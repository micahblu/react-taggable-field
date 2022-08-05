"use strict";var e=require("react");function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=t(e);const n=e=>{const t=e.getElementsByTagName("br");for(let e=0;e<t.length;e++)t[e].parentNode.removeChild(t[e])},c=(e,t)=>{const r=window.getSelection().anchorNode,n=(e=>{let t=0;if(window.getSelection){var r=window.getSelection().getRangeAt(0),n=r.cloneRange();n.selectNodeContents(e),n.setEnd(r.endContainer,r.endOffset),t=n.toString().length}else if(document.selection&&"Control"!==document.selection.type){var c=document.selection.createRange(),l=document.body.createTextRange();l.moveToElementText(e),l.setEndPoint("EndToEnd",c),t=l.text.length}return t})(e);let c,l=0;for(let t=0;t<e.childNodes.length&&e.childNodes[t]!==r;t++)e.childNodes[t].innerText?l+=e.childNodes[t].innerText.length:l+=e.childNodes[t].nodeValue.length;if(r===e||l===n)return void(0===n&&e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t));c=e.firstChild===r?n:n-l;const a=document.createTextNode(r.nodeValue.substring(0,c)),i=document.createTextNode(r.nodeValue.substring(c)),s=r.nextSibling;e.removeChild(r),s?(e.insertBefore(i,s),e.insertBefore(t,i),e.insertBefore(a,t)):(e.appendChild(a),e.appendChild(t),e.appendChild(i))},l=(e,t)=>{t.parentNode.insertBefore(e,t.nextSibling)};!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],c=document.createElement("style");c.type="text/css","top"===r&&n.firstChild?n.insertBefore(c,n.firstChild):n.appendChild(c),c.styleSheet?c.styleSheet.cssText=e:c.appendChild(document.createTextNode(e))}}("react-taggable-field-container{position:relative}.react-taggable-highlight{color:blue}.react-taggable-field-input{align-items:center;border:1px solid #ccc;border-radius:5px;display:block;min-height:1rem;padding:.4rem;text-align:left;white-space:nowrap;width:100%}.react-taggable-field-suggested-tags{background-color:#fff;border:1px solid #ccc;border-radius:5px;display:grid;min-width:300px;position:absolute;text-align:left;width:fit-content;z-index:1}.react-taggable-field-suggested-tag{cursor:pointer;padding:8px}.react-taggable-field-suggested-tag:hover{background:#f2f2f2}.react-taggable-field-input-tag{background:#333;border-radius:5px;color:#fff;display:inline-block;padding:0 5px}");const a="react-taggable-field-input-tag";module.exports=function({tags:t,onChange:i,autoFocus:s=!1,defaultValue:o,disabled:u=!1,inputClass:d,suggestionClass:g,onSubmit:f}){const h=e.useRef(),m=e.useRef(!1),p=e.useRef(null),b=e.useRef(),y=e.useRef([]),[x,N]=e.useState(!1),[v,C]=e.useState([]),E=t.map((e=>e.triggerSymbol)),T=e.useRef([]),k=t.reduce(((e,t)=>(e[t.triggerSymbol]={...t},e)),{}),w=e.useRef([]),S=e=>{const t=window.getSelection(),r=e||t.anchorNode;r&&t.collapse(r,r.childNodes.length)},L=()=>{const e=((e,t)=>{const r=e.childNodes.length-1;let n;for(let c=0;c<=r;c++){const r=e.childNodes[c];if("#text"!==r.nodeName&&(n=r),r===t)break}return n})(h.current);e?.scrollIntoView&&e.scrollIntoView()},R=()=>{const e=h.current.getElementsByClassName(a);y.current=[];for(let t=0;t<e.length;t++)y.current.push({label:e[t].innerText,tagClass:e[t].className.replace(a,"").trim(),triggerSymbol:e[t].getAttribute("data-trigger")})},B=e.useCallback((e=>{const t=[a],r=k[b.current]?.tagClass;r&&t.push(r),e.tagClass&&t.push(e.tagClass);const n=document.createElement("span");n.className=t.join(" "),n.contentEditable=!1,n.setAttribute("data-trigger",b.current),n.innerText=e.label,m.current=!1,l(n,p.current);const c=document.createTextNode("​");l(c,n),h.current.removeChild(p.current),p.current=null,N(!1),L(),S(c),R()}),[y,k]);return e.useLayoutEffect((()=>{u&&(h.current.setAttribute("contenteditable",!1),h.current.style.opacity=.5)}),[u]),e.useLayoutEffect((()=>{void 0!==o&&(h.current.innerHTML=o)}),[o]),e.useLayoutEffect((()=>{const e=e=>{if(T.current=T.current.filter((t=>t!==e.key)),R(),"Tab"===e.key||" "===e.key||"Enter"===e.key){const t=((e,t)=>{if(!t)return e.childNodes[e.childNodes.length-1];const r=e.childNodes.length-1;let n;for(let c=0;c<=r&&(n=e.childNodes[c],n!==t);c++);return n})(h.current).innerText?.replace(b.current,"").toLowerCase()||"";if(1===w.current.length&&m.current||w.current.includes(t)){const e=1===w.current.length?w.current[0]:t;B(e)}else m.current&&0===w.current.length?((()=>{const e=document.createTextNode(p.current.innerText);l(e,p.current),h.current.removeChild(p.current),p.current=null,m.current=!1,N(!1)})(),S()):"Enter"===e.key&&f({text:h.current.innerText,__html:h.current.innerHTML,tags:y.current},(()=>{h.current.innerHTML="",y.current=[]}))}if(m.current&&e.key!==b.current){const e=p.current.innerText,t=e.lastIndexOf(b.current),r=e.substr(t+1).replace(/[^\w]/,""),n=new RegExp(r,"i");w.current=k[b.current].suggestions.filter((e=>n.test(e.label))),C(w.current)}i({text:h.current.innerText,__html:h.current.innerHTML,tags:y.current})},r=e=>{if(n(h.current),"Enter"!==e.key&&"Tab"!==e.key||e.preventDefault(),"Backspace"===e.key){if("Meta"===T.current.slice(-1)[0])return y.current=[],h.current.innerHTML="",m.current=!1,void N(!1);m.current&&1===p.current?.innerText.length&&(p.current=null,m.current=!1,N(!1))}else if(E.includes(e.key)){if(m.current)return void e.preventDefault();b.current=e.key,C(t.find((t=>t.triggerSymbol===e.key)).suggestions),n(h.current),m.current=!0,p.current=document.createElement("span"),p.current.className=`react-taggable-field-highlight ${t.find((e=>e.triggerSymbol===b.current)).highlightClass}`,p.current.innerText=b.current,p.current.setAttribute("contentEditable",!0),c(h.current,p.current),N(!0),S(p.current),L(),e.preventDefault()}T.current.push(e.key)};return document.addEventListener("keydown",r),document.addEventListener("keyup",e),()=>{document.removeEventListener("keydown",r),document.removeEventListener("keyup",e)}}),[B,t,E,i,k,f]),r.default.createElement("div",{className:"react-taggable-field"},r.default.createElement("div",{className:"react-taggable-field-container"},r.default.createElement("div",{className:`react-taggable-field-input ${d}`,ref:h,contentEditable:!0})),x&&r.default.createElement("div",{className:`react-taggable-field-suggested-tags ${g}`},v.map((e=>r.default.createElement("div",{onClick:()=>B(e),key:e.label,className:"react-taggable-field-suggested-tag"},e.label)))))};
