use std::sync::{Arc, Mutex};

use eframe::egui::{CentralPanel, Key, Label, ScrollArea, TextStyle, TopBottomPanel};
use futures_util::{SinkExt, StreamExt};
use tokio::{
    runtime::Runtime,
    spawn,
    sync::mpsc::{self, UnboundedReceiver, UnboundedSender},
};
use tokio_tungstenite::{connect_async, tungstenite::Message};

fn main() {
    let rt = Runtime::new().unwrap();
    let _enter = rt.enter();

    let ui_state = Arc::new(Mutex::new(InnerState::new()));
    let update_state = ui_state.clone();
    let (tx, rx) = mpsc::unbounded_channel();

    std::thread::spawn(move || rt.block_on(update(update_state, rx)));

    let options = eframe::NativeOptions::default();
    eframe::run_native(
        "My App",
        options,
        Box::new(move |_cc| Box::new(App::new(ui_state, tx))),
    );
}

async fn update(state: State, mut rx: UnboundedReceiver<String>) {
    let (ws_stream, _) = connect_async("ws://localhost:3000/ws").await.unwrap();
    let (mut write, read) = ws_stream.split();

    spawn(async move {
        while let Some(msg) = rx.recv().await {
            write.send(Message::Text(msg)).await.unwrap();
        }
    });

    read.for_each(|message| async {
        let data = message.unwrap().into_text().unwrap();
        state.lock().unwrap().messages.push(data);
    })
    .await;
}

type State = Arc<Mutex<InnerState>>;

struct InnerState {
    messages: Vec<String>,
}

impl InnerState {
    fn new() -> Self {
        Self { messages: vec![] }
    }
}

struct App {
    state: State,
    tx: UnboundedSender<String>,
    draft: String,
}

impl App {
    fn new(state: State, tx: UnboundedSender<String>) -> Self {
        Self {
            state,
            tx,
            draft: String::new(),
        }
    }
}

impl eframe::App for App {
    fn update(&mut self, ctx: &eframe::egui::Context, _frame: &mut eframe::Frame) {
        let messages = &mut self.state.lock().unwrap().messages;

        TopBottomPanel::bottom("input").show(ctx, |ui| {
            let response = ui.text_edit_singleline(&mut self.draft);
            if response.lost_focus() && ui.input().key_pressed(Key::Enter) {
                self.tx.send(std::mem::take(&mut self.draft)).unwrap();
            }
            response.request_focus();
        });

        CentralPanel::default().show(ctx, |ui| {
            if ui.input().key_pressed(Key::ArrowUp) {
                messages.push(format!("Message {}", messages.len()));
            }

            ScrollArea::vertical()
                .auto_shrink([false, false])
                .stick_to_bottom(true)
                .show_rows(
                    ui,
                    ui.text_style_height(&TextStyle::Body),
                    messages.len(),
                    |ui, row_range| {
                        for message in &messages[row_range] {
                            ui.add(Label::new(message).wrap(true));
                        }
                    },
                );
        });
    }
}
