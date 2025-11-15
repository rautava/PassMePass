
// Configuration constants for password generator
if (typeof self !== 'undefined') {
    self.CONFIG = {
        MIN_LENGTH: 8,
        MAX_LENGTH: 80,
        DEFAULT_LENGTH: 21
    };
}
if (typeof window !== 'undefined') {
    window.CONFIG = {
        MIN_LENGTH: 8,
        MAX_LENGTH: 80,
        DEFAULT_LENGTH: 21
    };
}
