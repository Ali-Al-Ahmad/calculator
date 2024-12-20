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

function clearAllFucntion() {
  expression = ''
  updateResult()
}

function deleteLastCharacter() {
  if (expression.length > 0) {
    expression = expression.substring(0, expression.length - 1)
    updateResult()
  }
  focusOnInputLastCharacter()
}

function isNotValidExpression() {
  return (
    expression.length < 2 ||
    expression.includes('I') ||
    (!expression.includes('+') &&
      !expression.includes('-') &&
      !expression.includes('*') &&
      !expression.includes('/') &&
      !expression.includes('x'))
  )
}

function createTableRow(index, exp, stack) {
  const new_row = document.createElement('tr')
  const td1 = document.createElement('td')
  const td2 = document.createElement('td')
  const td3 = document.createElement('td')
  td1.innerHTML = index + '.'
  td2.innerHTML = exp
  td3.innerHTML = stack
  new_row.appendChild(td1)
  new_row.appendChild(td2)
  new_row.appendChild(td3)
  document.querySelector('#stack-table tbody').appendChild(new_row)
}

function removeRows() {
  document.querySelector('#stack-table tbody').innerHTML = ''
}

function calculatePrefixOrPostfix() {
  expression = expression.trim()
  if (isNotValidExpression()) {
    expression = 'Invalid Expression'
    return updateResult()
  }

  const temp_array = formatSpacesInExpression(expression).split(' ')

  let isPrefix = isOperator(temp_array[0])

  if (!isPrefix) {
    temp_array.reverse()
  }
  let my_stack = []
  for (let i = temp_array.length - 1; i >= 0; i--) {
    let current_expression = temp_array[i]
    let num1, num2
    if (!isOperator(current_expression)) {
      my_stack.push(parseFloat(current_expression))
    } else {
      if (my_stack.length < 2) {
        expression = 'Invalid Expression'
        return updateResult()
      }

      num1 = my_stack[my_stack.length - 1]
      my_stack.pop()
      num2 = my_stack[my_stack.length - 1]
      my_stack.pop()

      if (current_expression == '+') {
        my_stack.push(num1 + num2)
      }
      if (current_expression == '-') {
        my_stack.push(isPrefix ? num1 - num2 : num2 - num1)
      }
      if (current_expression == '*' || current_expression == 'x') {
        my_stack.push(isPrefix ? num1 * num2 : num2 * num1)
      }
      if (current_expression == '/') {
        my_stack.push(isPrefix ? num1 / num2 : num2 / num1)
      }
    }

    let table_stack_expression = current_expression
    if (isOperator(current_expression) && isPrefix) {
      table_stack_expression = `(${num1} ${current_expression} ${num2})`
    } else if (isOperator(current_expression) && !isPrefix) {
      table_stack_expression = `(${num2} ${current_expression} ${num1})`
    }

    createTableRow(
      -(i - temp_array.length),
      current_expression,
      table_stack_expression
    )
  }

  if (my_stack.length > 1) {
    expression = 'Invalid Expression'
    return updateResult()
  }
  let last_result = my_stack[my_stack.length - 1]
  createTableRow('Result', expression, last_result.toFixed(2))
  expression = last_result.toFixed(2)

  return updateResult()
}

function isOperator(number) {
  return (
    number == '+' ||
    number == '-' ||
    number == 'x' ||
    number == '*' ||
    number == '/'
  )
}