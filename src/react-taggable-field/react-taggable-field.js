import React, { useState, useLayoutEffect, useRef, useCallback } from 'react'
import './ReactTaggableField.css'

const removeBreaks = (el) => {
	const nodes = el.getElementsByTagName('br')
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].parentNode.removeChild(nodes[i])
	}
}

const getLastElement = (parentEl) => {
	const len = parentEl.childNodes.length - 1
	for (let i = len; i >= 0; i--) {
		const currentEl = parentEl.childNodes[i]
		if (currentEl.nodeName !== '#text') return currentEl
	}
}

export default function ReactTaggableField({
	tags,
	onChange,
	autoFocus = false,
	defaultValue,
	disabled = false,
	inputClass,
	suggestionClass
}) {
  const inputRef = useRef()
	const isMatching = useRef(false)
	const highlightEl = useRef(null)
	const triggerSymbol = useRef()
	const addedTags = useRef([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [matchingTags, setMatchingTags] = useState([])
	const triggers = tags.map(tgroup => tgroup.triggerSymbol)
	const heldKeys = useRef([])
	const suggestionMap = tags.reduce((acc, tgroup) => {
		acc[tgroup.triggerSymbol] = tgroup.suggestions
		return acc
	}, {})

	const baseHighlightClass = 'react-taggable-field-highlight'
	const baseInputTagClass = 'react-taggable-field-input-tag'
	const matches = useRef([])

	const autoPositionCaret = () => {
		const selection = window.getSelection()
		// Needed for firefox as caret and focus will be outside of the span element
		if (highlightEl.current) {
			highlightEl.current.focus()
			selection.collapse(highlightEl.current, highlightEl.current.childNodes.length)
		} else {
			inputRef.current.focus()
			selection.collapse(inputRef.current, inputRef.current.childNodes.length)
		}
	}

	const scrollIntoView = () => {
		const lastElement = getLastElement(inputRef.current)
		 if (lastElement?.scrollIntoView) {
			lastElement.scrollIntoView()
		 }
	}

	const addInputTag = useCallback((tagName) => {
		addedTags.current.push({ symbol: triggerSymbol.current, name: tagName })
		const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1]

		const tagHtml = `
			<span
				class='${baseInputTagClass} ${tags.find(t => t.triggerSymbol === triggerSymbol.current).tagClass}'
				contenteditable='false'
			>
				${tagName}
			</span>
			<span class='react-taggable-field-empty-space'>&nbsp;</span>
		`
		// remove highlight el
		highlightEl.current = null

		// no longer matching
		isMatching.current = false
		// remove highlighted node and replace with tag node
		inputRef.current.removeChild(lastNode)
		inputRef.current.innerHTML += tagHtml

		setShowSuggestions(false)
		scrollIntoView()
		autoPositionCaret()
	}, [addedTags, tags])

	const removeHighlight = (lastNode) => {
		const lastNodeText = lastNode.innerText

		// remove highlighted node
		inputRef.current.removeChild(lastNode)
		highlightEl.current = null
		isMatching.current = false

		setShowSuggestions(false)

		// Add text node
		const textNode = document.createTextNode(lastNodeText)
		inputRef.current.appendChild(textNode)
	}

	useLayoutEffect(() => {
		if (disabled) {
			inputRef.current.setAttribute('contenteditable', false)
			inputRef.current.style.opacity = .5
		}
	}, [disabled])

	useLayoutEffect(() => {
		if (defaultValue) {
			inputRef.current.innerHTML = defaultValue
			autoPositionCaret()
		}
	}, [defaultValue])

  useLayoutEffect(() => {
		const keyUpListener = (e) => {
			// clear held keys
			heldKeys.current = []

			if (e.key === 'Tab' || e.key === ' ' || e.key === 'Enter') {
				const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1]
				const nodeText = lastNode.innerText?.replace(triggerSymbol.current, '').toLowerCase() || ''
				if ((lastNode && matches.current.length === 1 && isMatching.current) || matches.current.includes(nodeText)) {
					const tag = matches.current.length === 1 ? matches.current[0] : nodeText
					addInputTag(tag)
				} else if (lastNode.nodeName !== '#text' && lastNode?.classList?.contains(baseHighlightClass) && matches.current.length === 0) {
					removeHighlight(lastNode)
					if (e.key !== ' ') inputRef.current.appendChild(document.createTextNode('\u00A0'))
					autoPositionCaret()
					e.preventDefault()
				}
      }
			if (isMatching.current && e.key !== triggerSymbol.current) {
				const inputStr = inputRef.current.innerText
				const symbolIndex = inputStr.lastIndexOf(triggerSymbol.current)
				const searchStr = inputStr.substr(symbolIndex + 1).replace(/[^\w]/, '')
				const regex = new RegExp(searchStr, 'i')
				matches.current = suggestionMap[triggerSymbol.current].filter((tag) => regex.test(tag))
				setMatchingTags(matches.current)
			} else {
				onChange({
					text: inputRef.current.innerText,
					__html: inputRef.current.innerHTML,
					tags: addedTags.current
				})
			}
		}
    const keyDownListener = (e) => {
			removeBreaks(inputRef.current)

			if (e.key === 'Enter' || e.key === 'Tab') e.preventDefault()
      if (e.key === 'Backspace') {
				const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1]
				const lastElement = inputRef.current.children[inputRef.current.children.length - 1]
			
				if (heldKeys.current.slice(-1)[0] === 'Meta') {
					// remove everything
					addedTags.current = []
					inputRef.current.innerHTML = ''
					return
				} else if (
					lastNode?.nodeValue === '\u00A0' && (
						lastNode?.classList?.contains(baseInputTagClass) ||
						lastElement?.classList?.contains(baseInputTagClass)
					)
				) {
					// remove the tag
					addedTags.current.pop()
					inputRef.current.removeChild(lastNode)
					inputRef.current.removeChild(lastElement)
					autoPositionCaret()
					e.preventDefault()
					return
				}

				if (
					lastNode?.classList?.contains(baseInputTagClass) ||
					(lastNode === highlightEl.current && lastNode.innerText === triggerSymbol.current) ||
					heldKeys.current.slice(-1)[0] === 'Alt' ||
					heldKeys.current.slice(-1)[0] === 'Control'
				) {
					inputRef.current.removeChild(lastNode)
					highlightEl.current = null
					isMatching.current = false
					setShowSuggestions(false)

					e.preventDefault()
				}
			} else if (triggers.includes(e.key)) {
				if (isMatching.current) {
					// Prevent reentering triggering symbol if already matching
					e.preventDefault()
					return
				}
				triggerSymbol.current = e.key
				setMatchingTags(tags.find(t => t.triggerSymbol === e.key).suggestions)
				// Remove any pesky br tags added by browser
				removeBreaks(inputRef.current)

				isMatching.current = true

				highlightEl.current = document.createElement('span')
				highlightEl.current.className = `${baseHighlightClass} ${tags.find(t => t.triggerSymbol === triggerSymbol.current).highlightClass}`
				highlightEl.current.innerText = triggerSymbol.current
				highlightEl.current.setAttribute('contentEditable', true)

				inputRef.current.appendChild(highlightEl.current)

        setShowSuggestions(true)
				autoPositionCaret()
				scrollIntoView()
        e.preventDefault()
			}

			// store held keys
			heldKeys.current.push(e.key)
    }
    document.addEventListener('keydown', keyDownListener)
    document.addEventListener('keyup', keyUpListener)
    return () => {
      document.removeEventListener('keydown', keyDownListener)
      document.removeEventListener('keyup', keyUpListener)
    }
  }, [addInputTag, tags, triggers, onChange, suggestionMap])

  return (
    <div className='react-taggable-field'>
      <div className='react-taggable-field-container'>
        <div
          className={`react-taggable-field-input ${inputClass}`}
          ref={inputRef}
          contentEditable
        />
      </div>
      {showSuggestions && (
        <div className={`react-taggable-field-suggested-tags ${suggestionClass}`}>
          {matchingTags.map((tag) => (
            <div onClick={() => addInputTag(tag)} key={tag} className='react-taggable-field-suggested-tag'>
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
