import e,{useRef as t,useState as r,useCallback as n,useLayoutEffect as l}from"react";const c=e=>{const t=e.getElementsByTagName("br");for(let e=0;e<t.length;e++)t[e].parentNode.removeChild(t[e])},i=(e,t)=>{const r=window.getSelection().anchorNode,n=(e=>{let t=0;if(window.getSelection){var r=window.getSelection().getRangeAt(0),n=r.cloneRange();n.selectNodeContents(e),n.setEnd(r.endContainer,r.endOffset),t=n.toString().length}else if(document.selection&&"Control"!==document.selection.type){var l=document.selection.createRange(),c=document.body.createTextRange();c.moveToElementText(e),c.setEndPoint("EndToEnd",l),t=c.text.length}return t})(e);let l,c=0;for(let t=0;t<e.childNodes.length&&e.childNodes[t]!==r;t++)e.childNodes[t].innerText?c+=e.childNodes[t].innerText.length:c+=e.childNodes[t].nodeValue.length;if(r===e||c===n)return void(0===n&&e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t));l=e.firstChild===r?n:n-c;const i=document.createTextNode(r.nodeValue.substring(0,l)),a=document.createTextNode(r.nodeValue.substring(l)),o=r.nextSibling;e.removeChild(r),o?(e.insertBefore(a,o),e.insertBefore(t,a),e.insertBefore(i,t)):(e.appendChild(i),e.appendChild(t),e.appendChild(a))},a=(e,t)=>{t.parentNode.insertBefore(e,t.nextSibling)};!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],l=document.createElement("style");l.type="text/css","top"===r&&n.firstChild?n.insertBefore(l,n.firstChild):n.appendChild(l),l.styleSheet?l.styleSheet.cssText=e:l.appendChild(document.createTextNode(e))}}("react-taggable-field-container{position:relative}.react-taggable-highlight{color:blue}.react-taggable-field-input{align-items:center;border:1px solid #ccc;border-radius:5px;display:block;min-height:1rem;padding:.4rem;text-align:left;white-space:nowrap;width:100%}.react-taggable-field-suggested-tags{background-color:#fff;border:1px solid #ccc;border-radius:5px;display:grid;min-width:300px;position:absolute;text-align:left;width:fit-content;z-index:1}.react-taggable-field-suggested-tag{cursor:pointer;padding:8px}.react-taggable-field-suggested-tag:hover{background:#f2f2f2}.react-taggable-field-input-tag{background:#333;border-radius:5px;color:#fff;display:inline-block;padding:0 5px}");function o({tags:o,onChange:d,autoFocus:s=!1,defaultValue:u,disabled:g=!1,inputClass:f,suggestionClass:h,onSubmit:p,onInit:m}){const b=t(),y=t(!1),x=t(null),v=t(),N=t([]),[T,C]=r(!1),[E,k]=r([]),w=o.map((e=>e.triggerSymbol)),S=t([]),B=o.reduce(((e,t)=>(e[t.triggerSymbol]={...t},e)),{});m&&m(b,(()=>{b.current.innerHTML="",N.current=[]}));const L=t([]),A=e=>{const t=window.getSelection(),r=e||t.anchorNode;r&&t.collapse(r,r.childNodes.length)},M=()=>{const e=((e,t)=>{const r=e.childNodes.length-1;let n;for(let l=0;l<=r;l++){const r=e.childNodes[l];if("#text"!==r.nodeName&&(n=r),r===t)break}return n})(b.current);null!=e&&e.scrollIntoView&&e.scrollIntoView()},V=n((()=>{const e=b.current.getElementsByClassName("react-taggable-field-input-tag");N.current=[];for(let t=0;t<e.length;t++){let r=e[t].getAttribute("data-trigger"),n=B[r].suggestions.find((r=>r.label===e[t].innerText));N.current.push({...n,triggerSymbol:e[t].getAttribute("data-trigger")})}}),[B]),H=n((e=>{var t;const r=["react-taggable-field-input-tag"],n=null===(t=B[v.current])||void 0===t?void 0:t.tagClass;n&&r.push(n),e.tagClass&&r.push(e.tagClass);const l=document.createElement("span");if(e.style)for(const t in e.style)l.style[t]=e.style[t];l.className=r.join(" "),l.contentEditable=!1,l.setAttribute("data-trigger",v.current),l.innerText=e.label,y.current=!1,a(l,x.current);const c=document.createTextNode("​");a(c,l),b.current.removeChild(x.current),x.current=null,C(!1),M(),A(c),V()}),[V,B]);return l((()=>{g&&(b.current.setAttribute("contenteditable",!1),b.current.style.opacity=.5)}),[g]),l((()=>{void 0!==u&&(b.current.innerHTML=u)}),[u]),l((()=>{const e=e=>{if(S.current=S.current.filter((t=>t!==e.key)),V(),"Tab"===e.key||" "===e.key||"Enter"===e.key){var t;const r=(null===(t=((e,t)=>{if(!t)return e.childNodes[e.childNodes.length-1];const r=e.childNodes.length-1;let n;for(let l=0;l<=r&&(n=e.childNodes[l],n!==t);l++);return n})(b.current).innerText)||void 0===t?void 0:t.replace(v.current,"").toLowerCase())||"";if(1===L.current.length&&y.current||L.current.includes(r)){const e=1===L.current.length?L.current[0]:r;H(e)}else y.current&&0===L.current.length?((()=>{const e=document.createTextNode(x.current.innerText);a(e,x.current),b.current.removeChild(x.current),x.current=null,y.current=!1,C(!1)})(),A(b.current)):"Enter"===e.key&&p({text:b.current.innerText,__html:b.current.innerHTML,tags:N.current})}if(y.current&&e.key!==v.current){const e=x.current.innerText,t=e.lastIndexOf(v.current),r=e.substr(t+1).replace(/[^\w]/,""),n=new RegExp(r,"i");L.current=B[v.current].suggestions.filter((e=>n.test(e.label))),k(L.current)}d({text:b.current.innerText,__html:b.current.innerHTML,tags:N.current})},t=e=>{if(c(b.current),"Enter"!==e.key&&"Tab"!==e.key||e.preventDefault(),"Backspace"===e.key){var t;if("Meta"===S.current.slice(-1)[0])return N.current=[],b.current.innerHTML="",y.current=!1,void C(!1);y.current&&1===(null===(t=x.current)||void 0===t?void 0:t.innerText.length)&&(x.current=null,y.current=!1,C(!1))}else if(w.includes(e.key)){if(y.current)return void e.preventDefault();v.current=e.key,k(o.find((t=>t.triggerSymbol===e.key)).suggestions),c(b.current),y.current=!0,x.current=document.createElement("span"),x.current.className=`react-taggable-field-highlight ${o.find((e=>e.triggerSymbol===v.current)).highlightClass}`,x.current.innerText=v.current,x.current.setAttribute("contentEditable",!0),i(b.current,x.current),C(!0),A(x.current),M(),e.preventDefault()}S.current.push(e.key)};b.current.addEventListener("keydown",t),b.current.addEventListener("keyup",e);const r=b.current;return()=>{r.removeEventListener("keydown",t),r.removeEventListener("keyup",e)}}),[H,V,o,w,d,B,p]),e.createElement("div",{className:"react-taggable-field"},e.createElement("div",{className:"react-taggable-field-container"},e.createElement("div",{className:`react-taggable-field-input ${f}`,ref:b,contentEditable:!0})),T&&e.createElement("div",{className:`react-taggable-field-suggested-tags ${h}`},E.map((t=>e.createElement("div",{onClick:()=>H(t),key:t.label,className:"react-taggable-field-suggested-tag"},t.label)))))}export{o as default};
