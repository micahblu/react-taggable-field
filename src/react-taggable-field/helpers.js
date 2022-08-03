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

export const getCaretPosition = (editable) => {
	 // collapse selection to end
	 window.getSelection().collapseToEnd()

	 const sel = window.getSelection()
	 const range = sel.getRangeAt(0)

	 // get anchor node if startContainer parent is editable
	 let selectedNode = editable === range.startContainer.parentNode
		 ? sel.anchorNode 
		 : range.startContainer.parentNode

	 if (!selectedNode || !editable.firstChild) {
			return {
				caret: 0,
				line: 0,
			}
	 }

	 // select to top of editable
	 range.setStart(editable.firstChild, 0)

	 // do not use 'this' sel anymore since the selection has changed
	 const content = window.getSelection().toString()
	 const text = JSON.stringify(content)
	 const lines = (text.match(/\\n/g) || []).length + 1

	 // clear selection
	 window.getSelection().collapseToEnd()

	 // minus 2 because of strange text formatting
	 return {
			caret: text.length - 2, 
			line: lines,
	 }
}

export const insertAtCaretPos = (parentEl, insertEl) => {
	const selection = window.getSelection()
	const anchorNode = selection.anchorNode
	const caretPos = getCaretPosition(parentEl).caret

	if (anchorNode === parentEl) {
		parentEl.appendChild(insertEl)
	} else {
		let anchorCaretPos
		if (parentEl.firstChild === anchorNode) {
			anchorCaretPos = caretPos
		} else {
			// We need to get a caret position relative to the anchor element
			// Get a char count of all characters before the anchor node
			let charCount = 0
			for (let i = 0; i < parentEl.childNodes.length; i++) {
				if (parentEl.childNodes[i] === anchorNode) break
				if (parentEl.childNodes[i].innerText) {
					charCount += parentEl.childNodes[i].innerText.length
				} else {
					charCount += parentEl.childNodes[i].nodeValue.length
				}
			}
			// The relative anchor node will be the absolute caret position minus the charCount
			anchorCaretPos = caretPos - charCount
		}
		// We need to insert the highlight El within the text node at the caret position
		const beforeNode = document.createTextNode(anchorNode.nodeValue.substring(0, anchorCaretPos))
		const afterNode = document.createTextNode(anchorNode.nodeValue.substring(anchorCaretPos))
		const nextSibling = anchorNode.nextSibling
		
		parentEl.removeChild(anchorNode)

		if (nextSibling) {
			parentEl.insertBefore(afterNode, nextSibling)
			parentEl.insertBefore(insertEl, afterNode)
			parentEl.insertBefore(beforeNode, insertEl)
		} else {
			parentEl.appendChild(beforeNode)
			parentEl.appendChild(insertEl)
			parentEl.appendChild(afterNode)
		}
	}
}

export const insertAfter = (newNode, existingNode) => {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}