let currentInput = '0';
let previousInput;
let operator;

const currentElement = document.getElementById('current');
const historyElement = document.getElementById('history');

function updateDisplay() {
    currentElement.textContent = currentInput;
}

const inputNumber = document.querySelector(".cal-buttons")
inputNumber.addEventListener("click", (event) => {
    // console.log(event)
    if (event.target.textContent === "+/-") {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }

    if (event.target.textContent === "%") {
        return calculatePercentage();
    }

    if (event.target.classList.contains("button") 
        && !event.target.classList.contains("clear") 
        && !event.target.classList.contains("operator") 
        && !event.target.classList.contains("equals")
        && !(event.target.textContent === "+/-")
        && !(event.target.textContent === "%")
    ) {
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

    if (event.target.classList.contains("equals")) {
        // console.log(event)
        calculate();
    }
})

function inputDigit(digit) {
    if (digit === '.' && currentInput.includes('.')) return;

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
   operator = null;
   previousInput = null;
   historyElement.textContent = '';
   updateDisplay();
}


function inputOperator(op) {
    if (operator) calculate();
    operator = op;
    previousInput = currentInput; 
    currentInput = '0';
    historyElement.textContent = previousInput + ' ' + operator;
}

function calculate() {
    if (!operator) return;
    // console.log(historyElement.textContent);
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case 'x':
            result = num1 * num2;
            break;
        case '÷':
            result = (num2 === 0) ? 'Cannot divide by zero' : num1 / num2;
            break;
        default:
            return;
    }
    historyElement.textContent = `${previousInput} ${operator} ${currentInput} =`;
    currentInput = result.toString();
    operator = null;

    updateDisplay();
}

function calculatePercentage() {
    currentInput = String(parseFloat(currentInput) / 100);
    previousInput = currentInput;
    historyElement.textContent = previousInput;
    updateDisplay();
}