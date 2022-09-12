use eframe::egui::{CentralPanel, Key, Label, ScrollArea, TextStyle, TopBottomPanel};

fn main() {
    let options = eframe::NativeOptions::default();
    eframe::run_native("My App", options, Box::new(|_cc| Box::new(App::default())));
}

#[derive(Default)]
struct App {
    messages: Vec<String>,
    draft: String,
}

impl eframe::App for App {
    fn update(&mut self, ctx: &eframe::egui::Context, _frame: &mut eframe::Frame) {
        TopBottomPanel::bottom("input").show(ctx, |ui| {
            let response = ui.text_edit_singleline(&mut self.draft);
            if response.lost_focus() && ui.input().key_pressed(Key::Enter) {
                self.messages.push(std::mem::take(&mut self.draft));
            }
            response.request_focus();
        });

        CentralPanel::default().show(ctx, |ui| {
            if ui.input().key_pressed(Key::ArrowUp) {
                self.messages
                    .push(format!("Message {}", self.messages.len()));
            }

            ScrollArea::vertical()
                .auto_shrink([false, false])
                .stick_to_bottom(true)
                .show_rows(
                    ui,
                    ui.text_style_height(&TextStyle::Body),
                    self.messages.len(),
                    |ui, row_range| {
                        for message in &self.messages[row_range] {
                            ui.add(Label::new(message).wrap(true));
                        }
                    },
                );
        });
    }
}
