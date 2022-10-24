pub trait SelfExt {
    fn map_self<R>(self, body: impl FnOnce(Self) -> R) -> R
    where
        Self: Sized,
    {
        body(self)
    }
}

impl<T> SelfExt for T {}
