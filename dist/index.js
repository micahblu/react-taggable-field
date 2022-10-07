"use strict";var e=require("react");function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=t(e);const n=e=>{const t=e.getElementsByTagName("br");for(let e=0;e<t.length;e++)t[e].parentNode.removeChild(t[e])},l=(e,t)=>{const r=window.getSelection().anchorNode,n=(e=>{let t=0;if(window.getSelection){var r=window.getSelection().getRangeAt(0),n=r.cloneRange();n.selectNodeContents(e),n.setEnd(r.endContainer,r.endOffset),t=n.toString().length}else if(document.selection&&"Control"!==document.selection.type){var l=document.selection.createRange(),c=document.body.createTextRange();c.moveToElementText(e),c.setEndPoint("EndToEnd",l),t=c.text.length}return t})(e);let l,c=0;for(let t=0;t<e.childNodes.length&&e.childNodes[t]!==r;t++)e.childNodes[t].innerText?c+=e.childNodes[t].innerText.length:c+=e.childNodes[t].nodeValue.length;if(r===e||c===n)return void(0===n&&e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t));l=e.firstChild===r?n:n-c;const i=document.createTextNode(r.nodeValue.substring(0,l)),a=document.createTextNode(r.nodeValue.substring(l)),u=r.nextSibling;e.removeChild(r),u?(e.insertBefore(a,u),e.insertBefore(t,a),e.insertBefore(i,t)):(e.appendChild(i),e.appendChild(t),e.appendChild(a))},c=(e,t)=>{t.parentNode.insertBefore(e,t.nextSibling)};!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],l=document.createElement("style");l.type="text/css","top"===r&&n.firstChild?n.insertBefore(l,n.firstChild):n.appendChild(l),l.styleSheet?l.styleSheet.cssText=e:l.appendChild(document.createTextNode(e))}}("react-taggable-field-container{position:relative}.react-taggable-highlight{color:blue}.react-taggable-field-input{align-items:center;border:1px solid #ccc;border-radius:5px;display:block;min-height:1rem;padding:.4rem;text-align:left;white-space:nowrap;width:100%}.react-taggable-field-suggested-tags{background-color:#fff;border:1px solid #ccc;border-radius:5px;display:grid;min-width:300px;position:absolute;text-align:left;width:fit-content;z-index:1}.react-taggable-field-suggested-tag{cursor:pointer;padding:8px}.react-taggable-field-suggested-tag:hover{background:#f2f2f2}.react-taggable-field-input-tag{background:#333;border-radius:5px;color:#fff;display:inline-block;padding:0 5px}");module.exports=function({tags:t,onChange:i,autoFocus:a=!1,defaultValue:u,disabled:o=!1,inputClass:s,suggestionClass:d,onSubmit:g,onInit:f}){const h=e.useRef(),p=e.useRef(!1),b=e.useRef(null),m=e.useRef(),y=e.useRef([]),[v,x]=e.useState(!1),[N,C]=e.useState([]),E=t.map((e=>e.triggerSymbol)),T=e.useRef([]),k=t.reduce(((e,t)=>(e[t.triggerSymbol]={...t},e)),{});f&&f(h,(()=>{h.current.innerHTML="",y.current=[]}));const w=e.useRef([]),S=e=>{const t=window.getSelection(),r=e||t.anchorNode;r&&t.collapse(r,r.childNodes.length)},L=()=>{const e=((e,t)=>{const r=e.childNodes.length-1;let n;for(let l=0;l<=r;l++){const r=e.childNodes[l];if("#text"!==r.nodeName&&(n=r),r===t)break}return n})(h.current);null!=e&&e.scrollIntoView&&e.scrollIntoView()},R=e.useCallback((()=>{const e=h.current.getElementsByClassName("react-taggable-field-input-tag");y.current=[];for(let t=0;t<e.length;t++){let r=e[t].getAttribute("data-trigger"),n=k[r].suggestions.find((r=>r.label===e[t].innerText));y.current.push({...n,triggerSymbol:e[t].getAttribute("data-trigger")})}}),[k]),B=e.useCallback((e=>{var t;const r=["react-taggable-field-input-tag"],n=null===(t=k[m.current])||void 0===t?void 0:t.tagClass;n&&r.push(n),e.tagClass&&r.push(e.tagClass);const l=document.createElement("span");if(e.style)for(const t in e.style)l.style[t]=e.style[t];l.className=r.join(" "),l.contentEditable=!1,l.setAttribute("data-trigger",m.current),l.innerText=e.label,p.current=!1,c(l,b.current);const i=document.createTextNode("​");c(i,l),h.current.removeChild(b.current),b.current=null,x(!1),L(),S(i),R()}),[R,k]);return e.useLayoutEffect((()=>{o&&(h.current.setAttribute("contenteditable",!1),h.current.style.opacity=.5)}),[o]),e.useLayoutEffect((()=>{void 0!==u&&(h.current.innerHTML=u)}),[u]),e.useLayoutEffect((()=>{const e=e=>{if(T.current=T.current.filter((t=>t!==e.key)),R(),"Tab"===e.key||" "===e.key||"Enter"===e.key){var t;const r=((e,t)=>{if(!t)return e.childNodes[e.childNodes.length-1];const r=e.childNodes.length-1;let n;for(let l=0;l<=r&&(n=e.childNodes[l],n!==t);l++);return n})(h.current),n=(null==r||null===(t=r.innerText)||void 0===t?void 0:t.replace(m.current,"").toLowerCase())||"";if(1===w.current.length&&p.current||w.current.includes(n)){const e=1===w.current.length?w.current[0]:n;B(e)}else p.current&&0===w.current.length?((()=>{const e=document.createTextNode(b.current.innerText);c(e,b.current),h.current.removeChild(b.current),b.current=null,p.current=!1,x(!1)})(),S(h.current)):"Enter"===e.key&&g&&g({text:h.current.innerText,__html:h.current.innerHTML,tags:y.current})}if(p.current&&e.key!==m.current){const e=b.current.innerText,t=e.lastIndexOf(m.current),r=e.substr(t+1).replace(/[^\w]/,""),n=new RegExp(r,"i");w.current=k[m.current].suggestions.filter((e=>n.test(e.label))),C(w.current)}i({text:h.current.innerText,__html:h.current.innerHTML,tags:y.current})},r=e=>{if(n(h.current),"Enter"!==e.key&&"Tab"!==e.key||e.preventDefault(),"Backspace"===e.key){var r;if("Meta"===T.current.slice(-1)[0])return y.current=[],h.current.innerHTML="",p.current=!1,void x(!1);p.current&&1===(null===(r=b.current)||void 0===r?void 0:r.innerText.length)&&(b.current=null,p.current=!1,x(!1))}else if(E.includes(e.key)){if(p.current)return void e.preventDefault();m.current=e.key,C(t.find((t=>t.triggerSymbol===e.key)).suggestions),n(h.current),p.current=!0,b.current=document.createElement("span"),b.current.className=`react-taggable-field-highlight ${t.find((e=>e.triggerSymbol===m.current)).highlightClass}`,b.current.innerText=m.current,b.current.setAttribute("contentEditable",!0),l(h.current,b.current),x(!0),S(b.current),L(),e.preventDefault()}T.current.push(e.key)};h.current.addEventListener("keydown",r),h.current.addEventListener("keyup",e);const a=h.current;return()=>{a.removeEventListener("keydown",r),a.removeEventListener("keyup",e)}}),[B,R,t,E,i,k,g]),r.default.createElement("div",{className:"react-taggable-field"},r.default.createElement("div",{className:"react-taggable-field-container"},r.default.createElement("div",{className:`react-taggable-field-input ${s}`,ref:h,contentEditable:!0})),v&&r.default.createElement("div",{className:`react-taggable-field-suggested-tags ${d}`},N.map((e=>r.default.createElement("div",{onClick:()=>B(e),key:e.label,className:"react-taggable-field-suggested-tag"},e.label)))))};
