let expression = ''

const result = document.getElementById('result')
const numbers = document.querySelectorAll('.num-op')
const clear_all_ac = document.getElementById('clear-All')
const delete_last = document.getElementById('delete-last')
const equal_button = document.getElementById('equal-btn')
const space_button = document.getElementById('space-btn')
const button_dark_mode = document.getElementById('dark-mode')

result.addEventListener('input', function (event) {
  expression = event.target.value
})
result.addEventListener('keydown', function (event) {
  const allowedKeys = ['Backspace','0','1','2','3','4','5','6','7','8','9','+','-','*','/','x']

  if (!allowedKeys.includes(event.key)) {
    event.preventDefault()
  }
})
numbers.forEach((element) => {
  element.addEventListener('click', digitClick)
})
delete_last.addEventListener('click', deleteLastCharacter)
clear_all_ac.addEventListener('click', clearAllFucntion)
equal_button.addEventListener('click', calculatePrefixOrPostfix)
button_dark_mode.addEventListener('click', changeToDarkMode)

space_button.addEventListener('click', addSpace)
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    event.preventDefault()
    addSpace()
  }
})

function addSpace() {
  if (!expression.endsWith(' ') && expression.length > 0) {
    expression = expression + ' '
    updateResult()
  }
  focusOnInputLastCharacter()
}

function digitClick(e) {
  if (isOperator(e.target.innerHTML)) {
    if (expression.endsWith(' ') || expression.length == 0)
      expression = expression + e.target.innerHTML + ' '
    else {
      expression = expression + ' ' + e.target.innerHTML + ' '
    }
  } else {
    expression = expression + e.target.innerHTML
  }
  updateResult()
}

function updateResult() {
  result.value = expression
  result.dispatchEvent(new Event('input'))
  focusOnInputLastCharacter()
}

