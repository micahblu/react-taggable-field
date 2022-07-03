export const removeBreaks = (el) => {
	const nodes = el.getElementsByTagName('br')
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].parentNode.removeChild(nodes[i])
	}
}

export const getLastElement = (parentEl) => {
	const len = parentEl.childNodes.length - 1
	for (let i = len; i >= 0; i--) {
		const currentEl = parentEl.childNodes[i]
		if (currentEl.nodeName !== '#text') return currentEl
	}
}