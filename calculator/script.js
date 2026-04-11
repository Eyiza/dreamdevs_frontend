let currentInput = '0';
let previousInput;

const currentElement = document.getElementById('current');
const historyElement = document.getElementById('history');

function updateDisplay() {
    currentElement.textContent = currentInput;
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

    if (event.target.classList.contains("clear") && event.target.textContent === "CE") {
        clearCurrent();
    }

    if (event.target.classList.contains("clear") && event.target.textContent === "C") {
        clearDisplay();
    }

    if (event.target.classList.contains("operator")) {
        // console.log(event)
        inputOperator(event.target.textContent);
    }
})

function inputDigit(digit) {
    if (currentInput === '0') {
        currentInput = digit;
    } else {
        currentInput += digit;
    }
    updateDisplay();
}

function clearCurrent() {
    currentInput = '0';
    updateDisplay();
}


function clearDisplay() {
   clearCurrent();
    historyElement.textContent = '';
}


function inputOperator(operator) {
    previousInput = currentInput; 
    historyElement.textContent = previousInput + ' ' + operator;
}
