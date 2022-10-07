import React, { useState, useLayoutEffect, useRef, useCallback} from 'react'
import { removeBreaks, getLastElement, getLastNode, insertAtCaretPos, insertAfter } from './helpers'
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
	onSubmit,
	onInit
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

	const clear = () => {
		// return a clear method
		inputRef.current.innerHTML = ''
		addedTags.current = []
	}

	// Pass back the inputRef and clear method
	if (onInit) onInit(inputRef, clear)

	const matches = useRef([])

	const autoPositionCaret = (anchorNode) => {
		const selection = window.getSelection()
		const anchor = anchorNode ? anchorNode : selection.anchorNode
		if (!anchor) return
		selection.collapse(anchor, anchor.childNodes.length)
	}

	// Horizontal scroll into view, for overflow text
	const scrollIntoView = () => {
		const lastElement = getLastElement(inputRef.current)
		 if (lastElement?.scrollIntoView) {
			lastElement.scrollIntoView()
		 }
	}

	const updateTags = useCallback(() => {
		// Update addedTags array
		const tagElems = inputRef.current.getElementsByClassName(INPUT_TAG_CLASS)

		addedTags.current = []
		for (let i = 0; i < tagElems.length; i++) {
			let trigger = tagElems[i].getAttribute('data-trigger')
			let tag = suggestionMap[trigger].suggestions.find(tag => tag.label === tagElems[i].innerText)
			addedTags.current.push({
				...tag,
				triggerSymbol: tagElems[i].getAttribute('data-trigger')
			})
		}
	}, [suggestionMap])

	const addInputTag = useCallback((tag) => {
		// addedTags.current.push({ symbol: triggerSymbol.current, ...tag })
		const tagClasses = [INPUT_TAG_CLASS]
		const globalTagClass = suggestionMap[triggerSymbol.current]?.tagClass

		if (globalTagClass) tagClasses.push(globalTagClass)
		if (tag.tagClass) tagClasses.push(tag.tagClass)

		const tagEl = document.createElement('span')
		
		if (tag.style) {
			for (const style in tag.style) {
				tagEl.style[style] = tag.style[style]
			}
		}
		
		tagEl.className = tagClasses.join(' ')
		tagEl.contentEditable = false
		tagEl.setAttribute('data-trigger', triggerSymbol.current)
		tagEl.innerText = tag.label

		// no longer matching
		isMatching.current = false

		// insert tag after highlight elemetn
		insertAfter(tagEl, highlightEl.current)

		const anchorTextNode = document.createTextNode('\u200b')
		insertAfter(anchorTextNode, tagEl)

		// remove highlighted node and replace with tag node
		inputRef.current.removeChild(highlightEl.current)

		// remove highlight el
		highlightEl.current = null

		setShowSuggestions(false)
		scrollIntoView()
		autoPositionCaret(anchorTextNode)

		updateTags()
	}, [updateTags, suggestionMap])

	const removeHighlight = () => {
		// Add text node
		const textNode = document.createTextNode(highlightEl.current.innerText)

		// remove highlighted node
		insertAfter(textNode, highlightEl.current)

		inputRef.current.removeChild(highlightEl.current)

		highlightEl.current = null
		isMatching.current = false

		setShowSuggestions(false)
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
		}
	}, [defaultValue])

  useLayoutEffect(() => {
		const keyUpListener = (e) => {
			// pop last hit key
			heldKeys.current = heldKeys.current.filter(k => k !== e.key)

			// update addedTags
			updateTags()

			if (e.key === 'Tab' || e.key === ' ' || e.key === 'Enter') {
				const lastNode = getLastNode(inputRef.current)
				const nodeText = lastNode?.innerText?.replace(triggerSymbol.current, '').toLowerCase() || ''
				if ((matches.current.length === 1 && isMatching.current) || matches.current.includes(nodeText)) {
					const tag = matches.current.length === 1 ? matches.current[0] : nodeText
					addInputTag(tag)
				} else if (isMatching.current && matches.current.length === 0) {
					removeHighlight()
					autoPositionCaret(inputRef.current)
				} else if (e.key === 'Enter' && onSubmit) {
					onSubmit({
						text: inputRef.current.innerText,
						__html: inputRef.current.innerHTML,
						tags: addedTags.current
					})
				}
      }
			if (isMatching.current && e.key !== triggerSymbol.current) {
				const inputStr = highlightEl.current.innerText
				const symbolIndex = inputStr.lastIndexOf(triggerSymbol.current)
				const searchStr = inputStr.substr(symbolIndex + 1).replace(/[^\w]/, '')
				const regex = new RegExp(searchStr, 'i')

				matches.current = suggestionMap[triggerSymbol.current].suggestions.filter((tag) => regex.test(tag.label))

				setMatchingTags(matches.current)
			}
			onChange({
				text: inputRef.current.innerText,
				__html: inputRef.current.innerHTML,
				tags: addedTags.current
			})
		}
    const keyDownListener = (e) => {
			removeBreaks(inputRef.current)
			if (e.key === 'Enter' || e.key === 'Tab') e.preventDefault()
      if (e.key === 'Backspace') {
				if (heldKeys.current.slice(-1)[0] === 'Meta') {
					// remove everything
					addedTags.current = []
					inputRef.current.innerHTML = ''
					// reset any matching conditions
					isMatching.current = false
					setShowSuggestions(false)
					return
				} else if (isMatching.current && highlightEl.current?.innerText.length === 1) {
					highlightEl.current = null
					isMatching.current = false
					setShowSuggestions(false)
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

				insertAtCaretPos(inputRef.current, highlightEl.current)

        setShowSuggestions(true)
				autoPositionCaret(highlightEl.current)
				scrollIntoView()
        e.preventDefault()
			}

			heldKeys.current.push(e.key)
    }
    inputRef.current.addEventListener('keydown', keyDownListener)
    inputRef.current.addEventListener('keyup', keyUpListener)

		// used in the clean up function as inputRef.current is likely to be destroyed
		const inputRefClone = inputRef.current
    return () => {
			inputRefClone.removeEventListener('keydown', keyDownListener)
      inputRefClone.removeEventListener('keyup', keyUpListener)
    }
  }, [addInputTag, updateTags, tags, triggers, onChange, suggestionMap, onSubmit])

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
