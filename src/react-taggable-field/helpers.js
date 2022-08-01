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

export const getCaretPosition = (elem) => {
  const sel = document.getSelection()
	sel.modify('extend', 'backward', 'paragraphboundary')
	const pos = sel.toString().replace(/[\u200B-\u200D\uFEFF]/g, '').length

	if(sel.anchorNode !== undefined) sel.collapseToEnd()

	return pos
}