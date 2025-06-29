const theme1 = document.getElementById("theme1");
const theme2 = document.getElementById("theme2");
const theme3 = document.getElementById("theme3");
const buttons = document.querySelectorAll("button");

const calculator = {
  displayValue: "0",
  firstOperand: null,
  haveSecondOperand: false,
  operator: null,
};

const existingTheme = localStorage.getItem("calculator-theme")
  ? localStorage.getItem("calculator-theme")
  : "theme1";
const themeToggles = document.querySelectorAll("lable");
const decimalPercision = 10;

function toggleTheme(switchToTheme) {
  document.documentElement.setAttribute("data-theme", switchToTheme);
  themeToggles.forEach((theme) => theme.classList.remove("toggle-on"));
  switchToTheme === "theme1"
    ? themeToggles[0].classList.add("toggled-on")
    : switchToTheme === "theme2"
    ? themeToggles[1].classList.add("toggled-on")
    : themeToggles[2].classList.add("toggled-on");
  localStorage.setItem("calculator-theme", switchToTheme);
}
if (existingTheme) {
  toggleTheme(existingTheme);
}
theme1.addEventListener("click", () => {
  toggleTheme("theme1");
});
theme2.addEventListener("click", () => {
  toggleTheme("theme2");
});
theme3.addEventListener("click", () => {
  toggleTheme("theme3");
});
function inputDigit(digit) {
  const { displayValue, haveSecondOperand } = calculator;
  if (haveSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.haveSecondOperand = false;
  } else {
    if (calculator.displayValue.length <= 10) {
      calculator.displayValue =
        displayValue === "0" ? digit : displayValue + digit;
    }
  }
}
function inputDecimal(dot) {
  if (calculator.haveSecondOperand === true) {
    calculator.displayValue = "0.";
    calculator.haveSecondOperand = false;
    return;
  }
  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}
function updateDisplay() {
  const display = document.getElementById("display");
  display.textContent =
    Number(calculator.displayValue) <= 99999999999
      ? Number(calculator.displayValue).toLocaleString("en-us", {
          maximumFractionDigits: decimalPercision,
        })
      : Number(calculator.displayValue).toExponential(4);
}
function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);
  if (operator !== "=" && calculator.haveSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }
  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculator(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(decimalPercision))}`;
    calculator.firstOperand = result;
  }
  calculator.haveSecondOperand = true;
  calculator.operator = nextOperator;
}
function calculator(firstOperand, secondOperand, operator) {
  if (operator === "+") {
    return firstOperand + secondOperand;
  } else if (operator === "-") {
    return firstOperand - secondOperand;
  } else if (operator === "x") {
    return firstOperand * secondOperand;
  } else if (operator === "/") {
    return firstOperand / secondOperand;
  }
  return secondOperand;
}
function resetCalculator() {
  calculator.displayValue = "0";
  calculator.firstOperand = null;
  calculator.haveSecondOperand = false;
  calculator.operator = null;
}
function handleInput(input) {
  switch (input) {
    case "+":
    case "-":
    case "x":
    case "/":
    case "=":
      handleOperator(input);
      break;
    case "DEL":
      calculator.displayValue = calculator.displayValue.slice(0, -1);
      break;
    case "delete":
      calculator.displayValue = calculator.displayValue.slice(0, -1);
      break;
    case "backspace":
      calculator.displayValue = calculator.displayValue.slice(0, -1);
      break;
    case ".":
      inputDecimal(input);
      break
      case 'RESET' :
        resetCalculator()
        break
        default:
            if(Number.isInteger(parseInt(input))) {
                inputDigit(input);
            }
  }
  updateDisplay();
}
 buttons.forEach(buttons =>{
    buttons.addEventListener('click', e =>{
        e.preventDefault()

        const {
            textContent
        } = e.target
        handleInput(textContent)
    })
 });

 document.body.addEventListener('keyup' , e =>{
    let {key} = e
    key = key.toLowerCase()
    key === 'enter' ? key = "=" : null
    key === '*' ? key = "x" : null

    handleInput(key)
 })
