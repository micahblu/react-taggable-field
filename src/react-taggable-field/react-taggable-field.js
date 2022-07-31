import React, { useState, useLayoutEffect, useRef, useCallback } from 'react'
import { removeBreaks, getLastElement, getLastNode } from './helpers'
import './ReactTaggableField.css'

const HIGHLIGHT_CLASS = 'react-taggable-field-highlight'
const INPUT_TAG_CLASS = 'react-taggable-field-input-tag'

export default function ReactTaggableField({
	tags,
	onChange,
	autoFocus = false,
	defaultValue,
	disabled = false,
	inputClass,
	suggestionClass,
	onSubmit
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
		acc[tgroup.triggerSymbol] = { ...tgroup }
		return acc
	}, {})

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

	const nodeIsAfter = (nodeAfter, nodeBefore, parentNode) => {
		let nodeAfterPos = 0
		let nodeBeforePos = 0
		for (let i = 0; i < parentNode.childNodes.length; i++) {
			if (nodeAfter === parentNode.childNodes[i]) {
				nodeAfterPos = i
			}
			else if (nodeBefore === parentNode.childNodes[i]) {
				nodeBeforePos = i
			}
		}
		return nodeAfterPos > nodeBeforePos
	}

	const scrollIntoView = () => {
		const lastElement = getLastElement(inputRef.current)
		 if (lastElement?.scrollIntoView) {
			lastElement.scrollIntoView()
		 }
	}

	const addInputTag = useCallback((tag) => {
		addedTags.current.push({ symbol: triggerSymbol.current, ...tag })
		const lastNode = getLastNode(inputRef.current)
		const tagClasses = [INPUT_TAG_CLASS]
		const globalTagClass = suggestionMap[triggerSymbol.current].tagClass

		if (globalTagClass) tagClasses.push(globalTagClass)
		if (tag.tagClass) tagClasses.push(tag.tagClass)
		
		const tagHtml = `
			<span
				class='${tagClasses.join(' ')}'
				contenteditable='false'
			>
				${tag.label}
			</span>
			&ZeroWidthSpace;
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
	}, [addedTags, suggestionMap])

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
		if (defaultValue !== undefined) {
			inputRef.current.innerHTML = defaultValue
			autoPositionCaret()
		}
	}, [defaultValue])

  useLayoutEffect(() => {
		const keyUpListener = (e) => {
			// clear held keys
			heldKeys.current = []

			if (e.key === 'Tab' || e.key === ' ' || e.key === 'Enter') {
				const lastNode = getLastNode(inputRef.current)
				const nodeText = lastNode.innerText?.replace(triggerSymbol.current, '').toLowerCase() || ''
				if ((lastNode && matches.current.length === 1 && isMatching.current) || matches.current.includes(nodeText)) {
					const tag = matches.current.length === 1 ? matches.current[0] : nodeText
					addInputTag(tag)
				} else if (lastNode.nodeName !== '#text' && lastNode?.classList?.contains(HIGHLIGHT_CLASS) && matches.current.length === 0) {
					removeHighlight(lastNode)
					if (e.key !== ' ') inputRef.current.appendChild(document.createTextNode('\u00A0'))
					autoPositionCaret()
					e.preventDefault()
				} else if (e.key === 'Enter') {
					onSubmit({
						text: inputRef.current.innerText,
						__html: inputRef.current.innerHTML,
						tags: addedTags.current
					}, () => {
						// return a clear method
						inputRef.current.innerHTML = ''
						addedTags.current = []
					})
				}
      }
			if (isMatching.current && e.key !== triggerSymbol.current) {
				const inputStr = inputRef.current.innerText
				const symbolIndex = inputStr.lastIndexOf(triggerSymbol.current)
				const searchStr = inputStr.substr(symbolIndex + 1).replace(/[^\w]/, '')
				const regex = new RegExp(searchStr, 'i')
				matches.current = suggestionMap[triggerSymbol.current].suggestions.filter((tag) => regex.test(tag.label))
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
				const selection = window.getSelection()
				const anchorNode = selection.anchorNode
				const lastNode = getLastNode(anchorNode) || getLastNode(inputRef.current)
				const lastElement = getLastElement(anchorNode) || getLastElement(inputRef.current)

				if (heldKeys.current.slice(-1)[0] === 'Meta') {
					// remove everything
					addedTags.current = []
					inputRef.current.innerHTML = ''
					// reset any matching conditions
					isMatching.current = false
					setShowSuggestions(false)
					return
				} else if (
					lastElement?.classList?.contains(INPUT_TAG_CLASS) &&
					(anchorNode === inputRef.current || nodeIsAfter(anchorNode, lastElement, inputRef.current)) &&
					lastNode.nodeName === '#text' &&
					lastNode?.nodeValue?.replace(/[\r\t\n]+/g, '').length < 2
				) {
					// remove the tag
					addedTags.current.pop()
					inputRef.current.removeChild(lastNode || getLastNode(inputRef.current))
					inputRef.current.removeChild(lastElement || getLastElement(inputRef.current))
					// console.log('inputREf.current.childNodes', inputRef.current.childNodes)
					autoPositionCaret()
					e.preventDefault()
					return
				} else if (isMatching.current && lastNode.innerText === triggerSymbol.current) {
					inputRef.current.removeChild(highlightEl.current)
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
				highlightEl.current.className = `${HIGHLIGHT_CLASS} ${tags.find(t => t.triggerSymbol === triggerSymbol.current).highlightClass}`
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
  }, [addInputTag, tags, triggers, onChange, suggestionMap, onSubmit])

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
            <div onClick={() => addInputTag(tag)} key={tag.label} className='react-taggable-field-suggested-tag'>
              { tag.label }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
