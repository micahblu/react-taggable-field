// src/react-taggable-field/react-taggable-field.jsx
import React, { useState, useLayoutEffect, useRef, useCallback } from "react";

// src/react-taggable-field/helpers.js
var removeBreaks = (el) => {
  const nodes = el.getElementsByTagName("br");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].parentNode.removeChild(nodes[i]);
  }
};
var getLastElement = (parentEl, refNode) => {
  const len = parentEl.childNodes.length - 1;
  let lastElement;
  for (let i = 0; i <= len; i++) {
    const currentEl = parentEl.childNodes[i];
    if (currentEl.nodeName !== "#text") {
      lastElement = currentEl;
    }
    if (currentEl === refNode)
      break;
  }
  return lastElement;
};
var getLastNode = (parentNode, refNode) => {
  if (!refNode) {
    return parentNode.childNodes[parentNode.childNodes.length - 1];
  }
  const len = parentNode.childNodes.length - 1;
  let lastNode;
  for (let i = 0; i <= len; i++) {
    lastNode = parentNode.childNodes[i];
    if (lastNode === refNode)
      break;
  }
  return lastNode;
};
var getCaretPosition = (element) => {
  let caretOffset = 0;
  if (window.getSelection) {
    var range = window.getSelection().getRangeAt(0);
    var preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  } else if (document.selection && document.selection.type !== "Control") {
    var textRange = document.selection.createRange();
    var preCaretTextRange = document.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
};
var insertAtCaretPos = (parentEl, insertEl) => {
  const selection = window.getSelection();
  const anchorNode = selection.anchorNode;
  const caretPos = getCaretPosition(parentEl);
  let charCount = 0;
  for (let i = 0; i < parentEl.childNodes.length; i++) {
    if (parentEl.childNodes[i] === anchorNode)
      break;
    if (parentEl.childNodes[i].innerText) {
      charCount += parentEl.childNodes[i].innerText.length;
    } else {
      charCount += parentEl.childNodes[i].nodeValue.length;
    }
  }
  if (anchorNode === parentEl || charCount === caretPos) {
    if (caretPos === 0 && parentEl.firstChild) {
      parentEl.insertBefore(insertEl, parentEl.firstChild);
    } else {
      parentEl.appendChild(insertEl);
    }
    return;
  }
  let anchorCaretPos;
  if (parentEl.firstChild === anchorNode) {
    anchorCaretPos = caretPos;
  } else {
    anchorCaretPos = caretPos - charCount;
  }
  const beforeNode = document.createTextNode(anchorNode.nodeValue.substring(0, anchorCaretPos));
  const afterNode = document.createTextNode(anchorNode.nodeValue.substring(anchorCaretPos));
  const nextSibling = anchorNode.nextSibling;
  parentEl.removeChild(anchorNode);
  if (nextSibling) {
    parentEl.insertBefore(afterNode, nextSibling);
    parentEl.insertBefore(insertEl, afterNode);
    parentEl.insertBefore(beforeNode, insertEl);
  } else {
    parentEl.appendChild(beforeNode);
    parentEl.appendChild(insertEl);
    parentEl.appendChild(afterNode);
  }
};
var insertAfter = (newNode, existingNode) => {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

// src/react-taggable-field/ReactTaggableField.css
(function() {
  if (!document.getElementById("67b526266fbbcc04376843cfce31b0ad2a4b8a1bc20637f7b88c3b082d08e0d7")) {
    var e = document.createElement("style");
    e.id = "67b526266fbbcc04376843cfce31b0ad2a4b8a1bc20637f7b88c3b082d08e0d7";
    e.textContent = `react-taggable-field-container {
  position: relative;
}

.react-taggable-highlight {
  color: blue;
}

.react-taggable-field-input {
  width: 100%;
	min-height: 1rem;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: left;
  display: block;
  align-items: center;
  white-space: nowrap;
}

.react-taggable-field-suggested-tags {
  position: absolute;
  min-width: 300px;
  width: fit-content;
  display: grid;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  z-index: 1;
}

.react-taggable-field-suggested-tag {
  padding: 8px;
	cursor: pointer;
}

.react-taggable-field-suggested-tag:hover {
	background: #f2f2f2;
}

.react-taggable-field-input-tag {
  background: #333;
  color: white;
  padding: 0 5px;
  border-radius: 5px;
  display: inline-block;
}

[contenteditable=true]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: #777;
  font-style: italic;
}`;
    document.head.appendChild(e);
  }
})();

// src/react-taggable-field/react-taggable-field.jsx
var HIGHLIGHT_CLASS = "react-taggable-field-highlight";
var INPUT_TAG_CLASS = "react-taggable-field-input-tag";
var ReactTaggableField = ({
  clearRef,
  tags,
  onChange,
  autoFocus = false,
  defaultValue,
  placeHolder = "",
  disabled = false,
  inputClass,
  suggestionClass,
  onSubmit
}) => {
  const inputRef = useRef();
  const isMatching = useRef(false);
  const highlightEl = useRef(null);
  const triggerSymbol = useRef();
  const addedTags = useRef([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [matchingTags, setMatchingTags] = useState([]);
  const triggers = tags.map((tgroup) => tgroup.triggerSymbol);
  const heldKeys = useRef([]);
  const suggestionMap = tags.reduce((acc, tgroup) => {
    acc[tgroup.triggerSymbol] = { ...tgroup };
    return acc;
  }, {});
  clearRef.current = () => {
    inputRef.current.innerHTML = "";
    addedTags.current = [];
  };
  const matches = useRef([]);
  const autoPositionCaret = (anchorNode) => {
    const selection = window.getSelection();
    const anchor = anchorNode ? anchorNode : selection.anchorNode;
    if (!anchor)
      return;
    selection.collapse(anchor, anchor.childNodes.length);
  };
  const scrollIntoView = () => {
    const lastElement = getLastElement(inputRef.current);
    if (lastElement == null ? void 0 : lastElement.scrollIntoView) {
      lastElement.scrollIntoView();
    }
  };
  const updateTags = useCallback(() => {
    const tagElems = inputRef.current.getElementsByClassName(INPUT_TAG_CLASS);
    addedTags.current = [];
    for (let i = 0; i < tagElems.length; i++) {
      let trigger = tagElems[i].getAttribute("data-trigger");
      let tag = suggestionMap[trigger].suggestions.find((tag2) => tag2.label === tagElems[i].innerText);
      addedTags.current.push({
        ...tag,
        triggerSymbol: tagElems[i].getAttribute("data-trigger")
      });
    }
  }, [suggestionMap]);
  const addInputTag = useCallback((tag) => {
    var _a;
    const tagClasses = [INPUT_TAG_CLASS];
    const globalTagClass = (_a = suggestionMap[triggerSymbol.current]) == null ? void 0 : _a.tagClass;
    if (globalTagClass)
      tagClasses.push(globalTagClass);
    if (tag.tagClass)
      tagClasses.push(tag.tagClass);
    const tagEl = document.createElement("span");
    if (tag.style) {
      for (const style in tag.style) {
        tagEl.style[style] = tag.style[style];
      }
    }
    tagEl.className = tagClasses.join(" ");
    tagEl.contentEditable = false;
    tagEl.setAttribute("data-trigger", triggerSymbol.current);
    tagEl.innerText = tag.label;
    isMatching.current = false;
    insertAfter(tagEl, highlightEl.current);
    const anchorTextNode = document.createTextNode("\u200B");
    insertAfter(anchorTextNode, tagEl);
    inputRef.current.removeChild(highlightEl.current);
    highlightEl.current = null;
    setShowSuggestions(false);
    scrollIntoView();
    autoPositionCaret(anchorTextNode);
    updateTags();
  }, [updateTags, suggestionMap]);
  const removeHighlight = () => {
    const textNode = document.createTextNode(highlightEl.current.innerText);
    insertAfter(textNode, highlightEl.current);
    inputRef.current.removeChild(highlightEl.current);
    highlightEl.current = null;
    isMatching.current = false;
    setShowSuggestions(false);
  };
  useLayoutEffect(() => {
    if (disabled) {
      inputRef.current.setAttribute("contenteditable", false);
      inputRef.current.style.opacity = 0.5;
    }
  }, [disabled]);
  useLayoutEffect(() => {
    if (defaultValue !== void 0) {
      inputRef.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);
  useLayoutEffect(() => {
    const keyUpListener = (e) => {
      var _a;
      heldKeys.current = heldKeys.current.filter((k) => k !== e.key);
      updateTags();
      if (e.key === "Tab" || e.key === " " || e.key === "Enter") {
        const lastNode = getLastNode(inputRef.current);
        const nodeText = ((_a = lastNode == null ? void 0 : lastNode.innerText) == null ? void 0 : _a.replace(triggerSymbol.current, "").toLowerCase()) || "";
        if (matches.current.length === 1 && isMatching.current || matches.current.includes(nodeText)) {
          const tag = matches.current.length === 1 ? matches.current[0] : nodeText;
          addInputTag(tag);
        } else if (isMatching.current && matches.current.length === 0) {
          removeHighlight();
          autoPositionCaret(inputRef.current);
        } else if (e.key === "Enter" && onSubmit) {
          onSubmit({
            text: inputRef.current.innerText,
            __html: inputRef.current.innerHTML,
            tags: addedTags.current
          });
        }
      }
      if (isMatching.current && e.key !== triggerSymbol.current) {
        const inputStr = highlightEl.current.innerText;
        const symbolIndex = inputStr.lastIndexOf(triggerSymbol.current);
        const searchStr = inputStr.substr(symbolIndex + 1).replace(/[^\w]/, "");
        const regex = new RegExp(searchStr, "i");
        matches.current = suggestionMap[triggerSymbol.current].suggestions.filter((tag) => regex.test(tag.label));
        setMatchingTags(matches.current);
      }
      onChange({
        text: inputRef.current.innerText,
        __html: inputRef.current.innerHTML,
        tags: addedTags.current
      });
    };
    const keyDownListener = (e) => {
      var _a;
      removeBreaks(inputRef.current);
      if (e.key === "Enter" || e.key === "Tab")
        e.preventDefault();
      if (e.key === "Backspace") {
        if (heldKeys.current.slice(-1)[0] === "Meta") {
          addedTags.current = [];
          inputRef.current.innerHTML = "";
          isMatching.current = false;
          setShowSuggestions(false);
          return;
        } else if (isMatching.current && ((_a = highlightEl.current) == null ? void 0 : _a.innerText.length) === 1) {
          highlightEl.current = null;
          isMatching.current = false;
          setShowSuggestions(false);
        }
      } else if (triggers.includes(e.key)) {
        if (isMatching.current) {
          e.preventDefault();
          return;
        }
        triggerSymbol.current = e.key;
        setMatchingTags(tags.find((t) => t.triggerSymbol === e.key).suggestions);
        removeBreaks(inputRef.current);
        isMatching.current = true;
        highlightEl.current = document.createElement("span");
        highlightEl.current.className = `${HIGHLIGHT_CLASS} ${tags.find((t) => t.triggerSymbol === triggerSymbol.current).highlightClass}`;
        highlightEl.current.innerText = triggerSymbol.current;
        highlightEl.current.setAttribute("contentEditable", true);
        insertAtCaretPos(inputRef.current, highlightEl.current);
        setShowSuggestions(true);
        autoPositionCaret(highlightEl.current);
        scrollIntoView();
        e.preventDefault();
      }
      heldKeys.current.push(e.key);
    };
    inputRef.current.addEventListener("keydown", keyDownListener);
    inputRef.current.addEventListener("keyup", keyUpListener);
    const inputRefClone = inputRef.current;
    return () => {
      inputRefClone.removeEventListener("keydown", keyDownListener);
      inputRefClone.removeEventListener("keyup", keyUpListener);
    };
  }, [addInputTag, updateTags, tags, triggers, onChange, suggestionMap, onSubmit]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "react-taggable-field"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "react-taggable-field-container"
  }, /* @__PURE__ */ React.createElement("div", {
    placeholder: placeHolder,
    className: `react-taggable-field-input ${inputClass}`,
    ref: inputRef,
    contentEditable: true
  })), showSuggestions && /* @__PURE__ */ React.createElement("div", {
    className: `react-taggable-field-suggested-tags ${suggestionClass}`
  }, matchingTags.map((tag) => /* @__PURE__ */ React.createElement("div", {
    onClick: () => addInputTag(tag),
    key: tag.label,
    className: "react-taggable-field-suggested-tag"
  }, tag.label))));
};
var react_taggable_field_default = ReactTaggableField;
export {
  react_taggable_field_default as default
};
