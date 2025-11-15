// Password generator module
importScripts('config.js');

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL = ",.-"; // selected special characters

function generatePassword(length) {
    if (typeof length !== 'number' || length < self.CONFIG.MIN_LENGTH || length > self.CONFIG.MAX_LENGTH) {
        length = self.CONFIG.DEFAULT_LENGTH; // fallback default
    }
    const pools = [LOWER, UPPER, DIGITS, SPECIAL];
    // Ensure at least one from each pool
    const required = pools.map(pool => pool[Math.floor(Math.random() * pool.length)]);
    const allChars = pools.join('');
    const remainingLength = length - required.length;
    let result = required;
    for (let i = 0; i < remainingLength; i++) {
        result.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    // Shuffle (Fisher-Yates)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result.join('');
}

// Export for background service worker (MV3 scope)
self.generatePassword = generatePassword;