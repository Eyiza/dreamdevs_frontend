let current = '0';
const currentElement = document.getElementById('current');

function updateDisplay() {
    currentElement.textContent = current;
}

const inputNumber = document.querySelector(".cal-buttons")
inputNumber.addEventListener("click", (event) => {
    // console.log(event)
    if (event.target.classList.contains("button") 
        && !event.target.classList.contains("clear") 
        && !event.target.classList.contains("operator") 
        && !event.target.classList.contains("equals")) {
        inputDigit(event.target.textContent);
    }

    if (event.target.classList.contains("clear")) {
        clearDisplay();
    }
})

function inputDigit(digit) {
    if (current === '0') {
        current = digit;
    } else {
        current += digit;
    }
    updateDisplay();
}

function clearDisplay() {
    current = '0';
    updateDisplay();
}