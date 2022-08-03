export const removeBreaks = (el) => {
	const nodes = el.getElementsByTagName('br')
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].parentNode.removeChild(nodes[i])
	}
}

export const getLastElement = (parentEl, refNode) => {
	const len = parentEl.childNodes.length - 1
	let lastElement
	for (let i = 0; i <= len; i++) {
		const currentEl = parentEl.childNodes[i]
		if (currentEl.nodeName !== '#text') {
			lastElement = currentEl
		}
		if (currentEl === refNode) break
	}
	return lastElement
}

export const getLastNode = (parentNode, refNode) => {
	if (!refNode) {
		return parentNode.childNodes[parentNode.childNodes.length - 1]
	}
	const len = parentNode.childNodes.length - 1
	let lastNode
	for (let i = 0; i <= len; i++) {
		lastNode = parentNode.childNodes[i]
		if (lastNode === refNode) break
	}
	return lastNode
}

export const getCaretPosition = (element) => {
	let caretOffset = 0

  if (window.getSelection) {
    var range = window.getSelection().getRangeAt(0)
    var preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    caretOffset = preCaretRange.toString().length
  } 

  else if (document.selection && document.selection.type !== 'Control') {
    var textRange = document.selection.createRange()
    var preCaretTextRange = document.body.createTextRange()
    preCaretTextRange.moveToElementText(element)
    preCaretTextRange.setEndPoint("EndToEnd", textRange)
    caretOffset = preCaretTextRange.text.length
  }

  return caretOffset
}

export const insertAtCaretPos = (parentEl, insertEl) => {
	const selection = window.getSelection()
	const anchorNode = selection.anchorNode
	const caretPos = getCaretPosition(parentEl)

	let charCount = 0
	for (let i = 0; i < parentEl.childNodes.length; i++) {
		if (parentEl.childNodes[i] === anchorNode) break
		// console.log('ADDING CHAR LENGTH FROM NODE', parentEl.childNodes[i])
		if (parentEl.childNodes[i].innerText) {
			charCount += parentEl.childNodes[i].innerText.length
		} else {
			charCount += parentEl.childNodes[i].nodeValue.length
		}
	}
	if (anchorNode === parentEl || charCount === caretPos) {
		// If at caret position 0 and there are other elements, insert before, else append
		if (caretPos === 0 && parentEl.firstChild) {
			parentEl.insertBefore(insertEl, parentEl.firstChild)
		} else {
			parentEl.appendChild(insertEl)
		}
		return
	}
	let anchorCaretPos
	if (parentEl.firstChild === anchorNode) {
		anchorCaretPos = caretPos
	} else {
		anchorCaretPos = caretPos - charCount
	}
	// We need to insert the highlight El within the text node at the caret position
	const beforeNode = document.createTextNode(anchorNode.nodeValue.substring(0, anchorCaretPos))
	const afterNode = document.createTextNode(anchorNode.nodeValue.substring(anchorCaretPos))
	const nextSibling = anchorNode.nextSibling
	
	parentEl.removeChild(anchorNode)
	console.log('nextSibling', nextSibling)
	if (nextSibling) {
		console.log('INSERTING BEFORE --------------- ')
		parentEl.insertBefore(afterNode, nextSibling)
		parentEl.insertBefore(insertEl, afterNode)
		parentEl.insertBefore(beforeNode, insertEl)
	} else {
		console.log('APPENDING -------------- ')
		parentEl.appendChild(beforeNode)
		parentEl.appendChild(insertEl)
		parentEl.appendChild(afterNode)
	}
}

export const insertAfter = (newNode, existingNode) => {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}