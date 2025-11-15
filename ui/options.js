// Use shared config constants
const minLength = CONFIG.MIN_LENGTH;
const maxLength = CONFIG.MAX_LENGTH;
const defaultLength = CONFIG.DEFAULT_LENGTH;

const lengthNumber = document.getElementById('lengthNumber');
const statusEl = document.getElementById('status');
const saveBtn = document.getElementById('saveBtn');

function validateLength(value) {
    const v = parseInt(value, 10);
    return Number.isInteger(v) && v >= minLength && v <= maxLength;
}

function updateUI() {
    const value = lengthNumber.value;
    const isValid = validateLength(value);
    saveBtn.disabled = !isValid;
    const indicator = document.getElementById('lengthIndicator');
    if (!isValid) {
        indicator.style.display = '';
        indicator.title = `Value must be ${minLength}-${maxLength}`;
    } else {
        indicator.style.display = 'none';
        indicator.title = '';
    }
}

chrome.storage.sync.get(['passwordLength'], (data) => {
    const value = data.passwordLength || defaultLength;
    lengthNumber.value = value;
    updateUI();
});

lengthNumber.addEventListener('input', (e) => {
    updateUI();
});

saveBtn.addEventListener('click', () => {
    const value = parseInt(lengthNumber.value, 10);
    if (!validateLength(value)) {
        statusEl.textContent = `Length must be between ${minLength} and ${maxLength}.`;
        return;
    }
    chrome.storage.sync.set({ passwordLength: value }, () => {
        statusEl.textContent = 'Saved!';
        setTimeout(() => statusEl.textContent = '', 2500);
    });
});