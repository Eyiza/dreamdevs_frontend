let currentInput = '0';
let previousInput;
let operator;
let shouldResetScreen = false;
let lastKeyWasOperator = false;

const currentElement = document.getElementById('current');
const historyElement = document.getElementById('history');

function updateDisplay() {
    currentElement.textContent = currentInput;
}

const inputNumber = document.querySelector(".cal-buttons")
inputNumber.addEventListener("click", (event) => {
    // console.log(event)
    if (!event.target.classList.contains("button")) return;

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

    if (shouldResetScreen) {
        currentInput = (digit === '.') ? '0.' : digit;
        previousInput = null;
        historyElement.textContent = '';
        shouldResetScreen = false;
    } else {
        currentInput = (currentInput === '0') ? digit : currentInput + digit;
    }
    lastKeyWasOperator = false;
    updateDisplay();
}

function clearCurrent() {
    currentInput = '0';
    updateDisplay();
}


function clearDisplay() {
   currentInput = '0';
   previousInput = null;
   operator = null;
   historyElement.textContent = '';
   updateDisplay();
}


function inputOperator(op) {
    if ((operator && currentInput === '0') || (operator && lastKeyWasOperator)) {
        operator = op;
        historyElement.textContent = previousInput + ' ' + operator;
        return;
    }
    
    if (operator) calculate();
    operator = op;
    previousInput = currentInput; 
    currentInput = '0';
    historyElement.textContent = previousInput + ' ' + operator;
    shouldResetScreen = false; 
    lastKeyWasOperator = true;
}

function calculate() {
    // console.log(historyElement.textContent);
    if (!operator) return;
    if (isNaN(previousInput) || isNaN(currentInput)) return;
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
            if (num2 === 0) {
                currentInput = 'Cannot divide by zero';
                updateDisplay();
                shouldResetScreen = true;
                return;
            }
            result = num1 / num2;
            break;
            // result = (num2 === 0) ? 'Cannot divide by zero' : num1 / num2;
            // break;
        default:
            return;
    }
    historyElement.textContent = `${previousInput} ${operator} ${currentInput} =`;
    currentInput = result.toString();
    previousInput = currentInput;
    operator = null;
    shouldResetScreen = true;
    updateDisplay();
}

function calculatePercentage() {
    if (!previousInput) {
        currentInput = String(parseFloat(currentInput) / 100);
    } else {
        currentInput = String((parseFloat(previousInput) * parseFloat(currentInput)) / 100);
    }
    updateDisplay();
}