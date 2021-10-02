// console.clear()
const log = console.log

inputElement = document.querySelector('input')
document.querySelector('button').addEventListener('click', (e) => {
	inputElement.value = ''
	console.clear()
})

const DEC = '.'
const SEP = ','
// TODO whole number limit may be required for each input (bill, rate, divisor)

// format to currency
const mask = (num) => {
	let output = []

	let wholeNum = num.includes(DEC) ?
		num.slice(0, num.indexOf(DEC)) : num
	let decNum = num.includes(DEC) ?
		num.slice(num.indexOf(DEC)) : ''
	let len = wholeNum.length

	for (let i = 0; i < len; i++) {
		if (i !== 0 && (len - i) % 3 === 0) {
			output.push(SEP)
		}
		output.push(wholeNum[i])
	}
	return output.join('').concat(decNum)
}



// reformat num from currency to base form
const unmask = (num) => {
	// log(arguments.callee.caller.name)
	let output = []
	let numRE = new RegExp(/\d|\./)

	for (let i = 0; i < num.length; i++) {
		let char = num.charAt(i)
		if (numRE.test(char) === true) {
			if (char === DEC && output.includes(DEC)) {//|| // removes excess decimal
				// char === DEC && i === 0) { // removes decimal at 0 index
				output.push("")
			} else {
				output.push(char)
			}
		}
	}
	output = output.join("")

	// removes leading 0
	if (output.indexOf(0) === 0 && output.length > 1) {
		let firstNonZeroIndex = Array.from(output).findIndex((a) => a > 0)

		if (output.charAt(1) === DEC) {
			// do nothing
		} else {
			output = output.slice(firstNonZeroIndex)
		}
	}

	// removes decimal numbers beyond 2 places
	// note: length > 3 allows output = .xx
	if (output.includes(DEC) && output.length > 3) {
		output = output.slice(0, output.indexOf(DEC) + 3)
	}
	return output
}







let oldCursor
let oldValue
const keydownHandler = (e) => {
	let el = e.target
	oldCursor = el.selectionStart
	oldValue = el.value
	// oldValue = mask(oldValue)
}

// optional
const checkSeparator = (position, len, interval) => {
	let posFromTail = len - position
	return len - Math.floor(posFromTail / (interval + 1))
}
// counter for testing
const separatorCount = (el) => {
	return Array.from(el).filter(a => a === SEP).length
}

const inputHandler = (e) => {
	let el = e.target
	let newCursorPosition
	let newValue = unmask(el.value)
	// let newValue = el.value
	newValue = mask(newValue)
	el.value = newValue
	// newValue !== '' ? el.value = newValue : el.value = ''

	let oldLen = oldValue.length
	let newLen = newValue.length
	let foo = Math.floor((oldLen + newLen) / 2)

	let testCursor = oldCursor - checkSeparator(oldCursor, oldLen, 3) + checkSeparator(oldCursor + (newValue.length - oldValue.length), foo, 3) + (unmask(newValue).length - unmask(oldValue).length)
	// ISSUE: cursor moves backwards by 1 when backspacing on desktop

	newCursorPosition = oldCursor + (newValue.length - oldValue.length)
	if (newCursorPosition === -1) {
		newCursorPosition = 0
	}

	el.setSelectionRange(newCursorPosition, newCursorPosition)

	// 	log(`
	//   key pressed        |  ${e.data}
	//   oldCursor (el.ss)  |  ${oldCursor}
	//   computed newCursor |  ${newCursorPosition} *
	//   testCursor         |  ${testCursor} **
	//   newCursor (el.ss)  |  ${el.selectionStart}
	//   newCursorAtEnd     |  ${el.selectionStart === el.value.length}
	//   oldValue           |  ${oldValue}
	//   newValue           |  ${newValue}
	//   old length         |  ${oldValue.length}
	//   new length         |  ${newValue.length}
	//   len change         |  ${newValue.length - oldValue.length}
	//   oldSepCount        |  ${separatorCount(oldValue)}
	//   newSepCount        |  ${separatorCount(newValue)}
	// `)

}

inputElement.addEventListener('keydown', keydownHandler)
inputElement.addEventListener('input', inputHandler)
