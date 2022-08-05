import e,{useRef as t,useState as r,useCallback as n,useLayoutEffect as c}from"react";const l=e=>{const t=e.getElementsByTagName("br");for(let e=0;e<t.length;e++)t[e].parentNode.removeChild(t[e])},i=(e,t)=>{const r=window.getSelection().anchorNode,n=(e=>{let t=0;if(window.getSelection){var r=window.getSelection().getRangeAt(0),n=r.cloneRange();n.selectNodeContents(e),n.setEnd(r.endContainer,r.endOffset),t=n.toString().length}else if(document.selection&&"Control"!==document.selection.type){var c=document.selection.createRange(),l=document.body.createTextRange();l.moveToElementText(e),l.setEndPoint("EndToEnd",c),t=l.text.length}return t})(e);let c,l=0;for(let t=0;t<e.childNodes.length&&e.childNodes[t]!==r;t++)e.childNodes[t].innerText?l+=e.childNodes[t].innerText.length:l+=e.childNodes[t].nodeValue.length;if(r===e||l===n)return void(0===n&&e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t));c=e.firstChild===r?n:n-l;const i=document.createTextNode(r.nodeValue.substring(0,c)),a=document.createTextNode(r.nodeValue.substring(c)),o=r.nextSibling;e.removeChild(r),o?(e.insertBefore(a,o),e.insertBefore(t,a),e.insertBefore(i,t)):(e.appendChild(i),e.appendChild(t),e.appendChild(a))},a=(e,t)=>{t.parentNode.insertBefore(e,t.nextSibling)};!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],c=document.createElement("style");c.type="text/css","top"===r&&n.firstChild?n.insertBefore(c,n.firstChild):n.appendChild(c),c.styleSheet?c.styleSheet.cssText=e:c.appendChild(document.createTextNode(e))}}("react-taggable-field-container{position:relative}.react-taggable-highlight{color:blue}.react-taggable-field-input{align-items:center;border:1px solid #ccc;border-radius:5px;display:block;min-height:1rem;padding:.4rem;text-align:left;white-space:nowrap;width:100%}.react-taggable-field-suggested-tags{background-color:#fff;border:1px solid #ccc;border-radius:5px;display:grid;min-width:300px;position:absolute;text-align:left;width:fit-content;z-index:1}.react-taggable-field-suggested-tag{cursor:pointer;padding:8px}.react-taggable-field-suggested-tag:hover{background:#f2f2f2}.react-taggable-field-input-tag{background:#333;border-radius:5px;color:#fff;display:inline-block;padding:0 5px}");const o="react-taggable-field-input-tag";function d({tags:d,onChange:s,autoFocus:u=!1,defaultValue:g,disabled:f=!1,inputClass:h,suggestionClass:m,onSubmit:p}){const b=t(),x=t(!1),v=t(null),y=t(),N=t([]),[T,C]=r(!1),[E,k]=r([]),w=d.map((e=>e.triggerSymbol)),S=t([]),B=d.reduce(((e,t)=>(e[t.triggerSymbol]={...t},e)),{}),L=t([]),A=e=>{const t=window.getSelection(),r=e||t.anchorNode;r&&t.collapse(r,r.childNodes.length)},M=()=>{const e=((e,t)=>{const r=e.childNodes.length-1;let n;for(let c=0;c<=r;c++){const r=e.childNodes[c];if("#text"!==r.nodeName&&(n=r),r===t)break}return n})(b.current);null!=e&&e.scrollIntoView&&e.scrollIntoView()},V=()=>{const e=b.current.getElementsByClassName(o);N.current=[];for(let t=0;t<e.length;t++)N.current.push({label:e[t].innerText,tagClass:e[t].className.replace(o,"").trim(),triggerSymbol:e[t].getAttribute("data-trigger")})},H=n((e=>{var t;const r=[o],n=null===(t=B[y.current])||void 0===t?void 0:t.tagClass;n&&r.push(n),e.tagClass&&r.push(e.tagClass);const c=document.createElement("span");c.className=r.join(" "),c.contentEditable=!1,c.setAttribute("data-trigger",y.current),c.innerText=e.label,x.current=!1,a(c,v.current);const l=document.createTextNode("​");a(l,c),b.current.removeChild(v.current),v.current=null,C(!1),M(),A(l),V()}),[N,B]);return c((()=>{f&&(b.current.setAttribute("contenteditable",!1),b.current.style.opacity=.5)}),[f]),c((()=>{void 0!==g&&(b.current.innerHTML=g)}),[g]),c((()=>{const e=e=>{if(S.current=S.current.filter((t=>t!==e.key)),V(),"Tab"===e.key||" "===e.key||"Enter"===e.key){var t;const r=(null===(t=((e,t)=>{if(!t)return e.childNodes[e.childNodes.length-1];const r=e.childNodes.length-1;let n;for(let c=0;c<=r&&(n=e.childNodes[c],n!==t);c++);return n})(b.current).innerText)||void 0===t?void 0:t.replace(y.current,"").toLowerCase())||"";if(1===L.current.length&&x.current||L.current.includes(r)){const e=1===L.current.length?L.current[0]:r;H(e)}else x.current&&0===L.current.length?((()=>{const e=document.createTextNode(v.current.innerText);a(e,v.current),b.current.removeChild(v.current),v.current=null,x.current=!1,C(!1)})(),A()):"Enter"===e.key&&p({text:b.current.innerText,__html:b.current.innerHTML,tags:N.current},(()=>{b.current.innerHTML="",N.current=[]}))}if(x.current&&e.key!==y.current){const e=v.current.innerText,t=e.lastIndexOf(y.current),r=e.substr(t+1).replace(/[^\w]/,""),n=new RegExp(r,"i");L.current=B[y.current].suggestions.filter((e=>n.test(e.label))),k(L.current)}s({text:b.current.innerText,__html:b.current.innerHTML,tags:N.current})},t=e=>{if(l(b.current),"Enter"!==e.key&&"Tab"!==e.key||e.preventDefault(),"Backspace"===e.key){var t;if("Meta"===S.current.slice(-1)[0])return N.current=[],b.current.innerHTML="",x.current=!1,void C(!1);x.current&&1===(null===(t=v.current)||void 0===t?void 0:t.innerText.length)&&(v.current=null,x.current=!1,C(!1))}else if(w.includes(e.key)){if(x.current)return void e.preventDefault();y.current=e.key,k(d.find((t=>t.triggerSymbol===e.key)).suggestions),l(b.current),x.current=!0,v.current=document.createElement("span"),v.current.className=`react-taggable-field-highlight ${d.find((e=>e.triggerSymbol===y.current)).highlightClass}`,v.current.innerText=y.current,v.current.setAttribute("contentEditable",!0),i(b.current,v.current),C(!0),A(v.current),M(),e.preventDefault()}S.current.push(e.key)};return document.addEventListener("keydown",t),document.addEventListener("keyup",e),()=>{document.removeEventListener("keydown",t),document.removeEventListener("keyup",e)}}),[H,d,w,s,B,p]),e.createElement("div",{className:"react-taggable-field"},e.createElement("div",{className:"react-taggable-field-container"},e.createElement("div",{className:`react-taggable-field-input ${h}`,ref:b,contentEditable:!0})),T&&e.createElement("div",{className:`react-taggable-field-suggested-tags ${m}`},E.map((t=>e.createElement("div",{onClick:()=>H(t),key:t.label,className:"react-taggable-field-suggested-tag"},t.label)))))}export{d as default};
