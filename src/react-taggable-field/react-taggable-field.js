import { useState, useEffect, useRef, useCallback } from 'react'
import './ReactTaggableField.css'

const createEl = ({ elType = 'div', text = '', __html, contentEditable = true, className = ''}) => {
	const el = document.createElement(elType)
	el.className = className
	el.innerText = text
	if (__html) {
		el.innerHTML = __html
	}
	el.setAttribute('contenteditable', contentEditable)
	return el
}

const removeBreaks = (el) => {
	const nodes = el.getElementsByTagName('br')
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].parentNode.removeChild(nodes[i])
	}
}

export default function TaggableInput({ tags, onChange, autoFocus = false }) {
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

	const baseHighlightClass = 'react-taggable-highlight'
	const baseInputTagClass = 'react-taggable-input-tag'
	const matches = useRef([])

	const addInputTag = useCallback((tagName) => {
		addedTags.current.push({ symbol: triggerSymbol.current, name: tagName })
		const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1]
		const tagNode = createEl({
			elType: 'span',
			contentEditable: false,
			className: `${baseInputTagClass} ${tags.find(t => t.triggerSymbol === triggerSymbol.current).tagClass}`,
			text: tagName
		})
		
		// remove highlight el
		highlightEl.current = null

		// no longer matching
		isMatching.current = false
		// remove highlighted node and replace with tag node
		inputRef.current.removeChild(lastNode)
		inputRef.current.appendChild(tagNode)
		inputRef.current.appendChild(document.createTextNode('\u00A0')) // add white space at end
		setShowSuggestions(false)
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

  useEffect(() => {
		const keyUpListener = (e) => {
			// clear held keys
			heldKeys.current = []

			if (e.key === 'Tab' || e.key === ' ' || e.key === 'Enter') {
				const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1]
				const nodeText = lastNode.innerText.replace(triggerSymbol.current, '').toLowerCase()
				if ((matches.current.length === 1 && isMatching.current) || matches.current.includes(nodeText)) {
					const tag = matches.current.length === 1 ? matches.current[0] : nodeText
					addInputTag(tag)
				} else if (lastNode.nodeName !== '#text' && lastNode?.classList.contains(baseHighlightClass) && matches.current.length === 0) {
					removeHighlight(lastNode)
					if (e.key !== ' ') inputRef.current.appendChild(document.createTextNode('\u00A0'))
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
			if (e.key === 'Enter' || e.key === 'Tab') e.preventDefault()
      if (e.key === 'Backspace') {
				const lastNode = inputRef.current.childNodes[inputRef.current.childNodes.length - 1]

				// Remove any necessary tags from memory
				if (heldKeys.current.slice(-1)[0] === 'Meta') {
					addedTags.current = []
				} else if (lastNode?.classList.contains(baseInputTagClass)) {
					// remove the 
					addedTags.current.pop()
				}
				removeBreaks(inputRef.current)
				if (
					lastNode?.classList.contains(baseInputTagClass) ||
					(lastNode === highlightEl.current && lastNode.innerText === triggerSymbol.current) ||
					heldKeys.current.slice(-1)[0] === 'Meta' // command backspace
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

				const span = createEl({
					elType: 'span',
					className: `${baseHighlightClass} ${tags.find(t => t.triggerSymbol === triggerSymbol.current).highlightClass}`,
					contentEditable: true,
					text: triggerSymbol.current
				})

				inputRef.current.appendChild(span)

        setShowSuggestions(true)
				highlightEl.current = span
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
	
	useEffect(() => {
		if (inputRef.current) {
			if (autoFocus) {
				inputRef.current.focus()
			}

			// Options for the observer (which mutations to observe)
			const config = { attributes: true, childList: true, subtree: true }

			// Callback function to execute when mutations are observed
			const callback = function(mutationList, observer) {					
					const selection = window.getSelection()
					if (highlightEl.current) {
						highlightEl.current.focus()
						selection.collapse(highlightEl.current, highlightEl.current.childNodes.length)
					} else {
						inputRef.current.focus()
						selection.collapse(inputRef.current, inputRef.current.childNodes.length)
					}
			}

			// Create an observer instance linked to the callback function
			const observer = new MutationObserver(callback)

			// Start observing the target node for configured mutations
			observer.observe(inputRef.current, config)

			// Remove observer on unmount
			return () => observer.disconnect()
		}
	}, [inputRef, addInputTag, autoFocus])

  return (
    <div className='taggable'>
      <div className='inputWrapper'>
        <div
          className='input'
          ref={inputRef}
          contentEditable
        />
      </div>
      {showSuggestions && (
        <div className='suggestedTags'>
          {matchingTags.map((tag) => (
            <div onClick={() => addInputTag(tag)} key={tag} className='suggestedTag'>
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
