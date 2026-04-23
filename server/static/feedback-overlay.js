"use strict";var FeedbackOverlay=(()=>{function me(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function J(){let t=me(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",a=t?.dataset.label??"feedback",n=t?.dataset.hotkey?.toLowerCase()??"",l=["alt+shift","ctrl+shift","meta+shift"].includes(n)?n:"alt+shift";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:e,repo:o,label:a,hotkey:l}}var R=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let a=(o.method??"GET").toUpperCase(),n=a!=="GET"&&a!=="HEAD"?{"Content-Type":"application/json"}:{},s=await fetch(this.base+e,{...o,headers:{...n,...this.authHeaders(),...o.headers??{}}});if(!s.ok){s.status===401&&this.onUnauthorized&&this.onUnauthorized();let l=await s.text().catch(()=>s.statusText);throw new Error(`${s.status}: ${l}`)}return s.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var ge="feedback_overlay_auth",q="__fo_user__",z=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let a=`${this.config.apiBase}/auth/github`,n=window.open(a,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!n){o(new Error("Popup was blocked. Please allow popups for this site."));return}let s=setTimeout(()=>{c(),o(new Error("Authentication timed out."))},300*1e3),l=f=>{if(f.data?.type!==ge)return;clearTimeout(s),c();let{token:x,login:g,avatar:y}=f.data;this.api.setToken(x),this.user={login:g,avatarUrl:y},this.saveUser(this.user),e(this.user)},c=()=>{window.removeEventListener("message",l),this.messageHandler=null,n.closed||n.close()};this.messageHandler=l,window.addEventListener("message",l);let m=setInterval(()=>{n.closed&&(clearInterval(m),this.messageHandler===l&&(c(),clearTimeout(s),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(q,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(q);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(q)}catch{}}};var M="idle",F=[],H="Alt",X="Shift",B=!1,P=!1;function U(t){M!==t&&(M=t,F.forEach(e=>e(t)))}function V(){return M}function Z(t){return F.push(t),()=>{F=F.filter(e=>e!==t)}}function T(t){U(t)}function Q(t){switch(t.hotkey){case"ctrl+shift":H="Control";break;case"meta+shift":H="Meta";break;case"alt+shift":default:H="Alt";break}window.addEventListener("keydown",_e,!0),window.addEventListener("keyup",he,!0),window.addEventListener("blur",be)}function _e(t){t.key===H&&(B=!0),t.key===X&&(P=!0),B&&P&&M==="idle"&&U("active")}function he(t){t.key===H&&(B=!1),t.key===X&&(P=!1),!B&&!P&&M==="active"&&U("idle")}function be(){B=!1,P=!1,M==="active"&&U("idle")}function W(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let a=o.getAttribute("data-testid");if(a){e.unshift(`[data-testid="${CSS.escape(a)}"]`);break}if(o.id&&!xe(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}let n=o.getAttribute("data-component");if(n){let c=o.parentElement;if(c){let m=Array.from(c.children).filter(f=>f.getAttribute("data-component")===n);if(m.length>1){let f=m.indexOf(o)+1;e.unshift(`[data-component="${CSS.escape(n)}"]:nth-of-type(${m.indexOf(o)+1})`);let g=Array.from(c.children).filter(y=>y.tagName===o.tagName).indexOf(o)+1;e[0]=`[data-component="${CSS.escape(n)}"]:nth-of-type(${g})`}else e.unshift(`[data-component="${CSS.escape(n)}"]`);if(c.getAttribute("data-component")){let f=c.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(f)}"]`);break}o=c;continue}else{e.unshift(`[data-component="${CSS.escape(n)}"]`);break}}let s=o.parentElement,l=o.tagName.toLowerCase();if(s){let c=Array.from(s.children).filter(m=>m.tagName===o.tagName);if(c.length>1){let m=c.indexOf(o)+1;e.unshift(`${l}:nth-of-type(${m})`)}else e.unshift(l)}else e.unshift(l);o=s}return e.join(" > ")}function xe(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function ee(t){let e=t;for(;e&&e!==document.documentElement;){let o=e.getAttribute("data-component");if(o)return o;e=e.parentElement}return null}function te(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let l=e.getAttribute("data-component");if(l)return[l,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let a=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",s=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${a}${n}${s}>`}var ne="__fo_highlight__",ie="__fo_tooltip__",ye="#22c55e",ve="rgba(34, 197, 94, 0.08)",we="#4f86f7",ke="rgba(79, 134, 247, 0.08)",re=null;function oe(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function ae(t){re=t;let e=t.getBoundingClientRect(),o=window.scrollX,a=window.scrollY,n=ee(t)!==null,s=n?ye:we,l=n?ve:ke,c=oe(ne);Object.assign(c.style,{position:"absolute",top:`${e.top+a}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:`2px solid ${s}`,backgroundColor:l,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let m=te(t),f=oe(ie);f.textContent=m;let x=Math.min(e.left+o,window.innerWidth+o-(m.length*7+16));Object.assign(f.style,{position:"absolute",top:`${e.top+a-26}px`,left:`${Math.max(4,x)}px`,background:s,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function G(){re=null,document.getElementById(ne)?.remove(),document.getElementById(ie)?.remove()}var Ee="__fo_badge__",D=[],N=null;function Y(){D.forEach(t=>t.remove()),D=[],N?.disconnect(),N=null}function j(t,e){Y(),t.forEach((a,n)=>{let s=null;try{s=document.querySelector(a.selector)}catch{return}if(!s)return;let l=document.createElement("div");l.id=`${Ee}${n}`,l.textContent=String(a.count),l.title=`${a.count} comment${a.count!==1?"s":""} on this element`,Object.assign(l.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),l.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),e(a.ids,a.selector)}),document.body.appendChild(l),D.push(l),se(l,s)});let o=()=>{D.forEach((a,n)=>{let s=t[n];if(!s)return;let l=null;try{l=document.querySelector(s.selector)}catch{return}l&&se(a,l)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),N=new ResizeObserver(o),N.observe(document.body)}function se(t,e){let o=e.getBoundingClientRect(),a=window.scrollX,n=window.scrollY;t.style.top=`${o.top+n-8}px`,t.style.left=`${o.right+a-8}px`}var K="__fo_dialog__",le="__fo_styles__";function ce(){if(document.getElementById(le))return;let t=document.createElement("style");t.id=le,t.textContent=`
    #__fo_dialog__ {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.55);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #__fo_dialog__ * { box-sizing: border-box; }

    /* \u2500\u2500 Main card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-card {
      background: #fff;
      border-radius: 10px;
      width: 520px;
      max-width: calc(100vw - 32px);
      max-height: 85vh;
      box-shadow: 0 12px 48px rgba(0,0,0,0.28);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #__fo_dialog__ .fo-header {
      padding: 14px 18px 10px;
      border-bottom: 1px solid #e8e8e8;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-header-top {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 3px;
    }
    #__fo_dialog__ .fo-header-top h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0f0f0f;
      flex: 1;
    }
    #__fo_dialog__ .fo-user-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: #666;
      font-weight: 500;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-user-pill img {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #ddd;
    }
    #__fo_dialog__ .fo-selector {
      font-size: 11px;
      color: #555;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      word-break: break-all;
    }

    /* \u2500\u2500 Existing comments \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-comments {
      flex-shrink: 0;
      max-height: 240px;
      overflow-y: auto;
      border-bottom: 1px solid #e8e8e8;
    }
    #__fo_dialog__ .fo-comment-item {
      padding: 10px 18px;
      border-bottom: 1px solid #f2f2f2;
    }
    #__fo_dialog__ .fo-comment-item:last-child { border-bottom: none; }
    #__fo_dialog__ .fo-comment-meta {
      display: flex;
      gap: 6px;
      align-items: baseline;
      margin-bottom: 3px;
    }
    #__fo_dialog__ .fo-comment-author {
      font-size: 12px;
      font-weight: 600;
      color: #0f0f0f;
    }
    #__fo_dialog__ .fo-comment-date {
      font-size: 11px;
      color: #999;
    }
    #__fo_dialog__ .fo-comment-text {
      font-size: 13px;
      color: #222;
      line-height: 1.5;
    }

    /* \u2500\u2500 Compose area \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-compose {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 18px;
      min-height: 0;
    }

    #__fo_dialog__ textarea {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 13px;
      font-family: inherit;
      color: #111;
      resize: vertical;
      min-height: 80px;
      outline: none;
      line-height: 1.5;
      flex: 1;
    }
    #__fo_dialog__ textarea:focus {
      border-color: #4f86f7;
      box-shadow: 0 0 0 3px rgba(79,134,247,0.15);
    }
    #__fo_dialog__ textarea::placeholder { color: #aaa; }
    #__fo_dialog__ .fo-error {
      color: #c53030;
      font-size: 12px;
    }

    /* \u2500\u2500 Type toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-type-toggle {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-type-toggle input[type="radio"] { display: none; }
    #__fo_dialog__ .fo-type-toggle label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 20px;
      border: 1.5px solid #ddd;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      color: #555;
      background: #fff;
      transition: all 0.1s;
      user-select: none;
    }
    #__fo_dialog__ .fo-type-toggle input[value="bug"]:checked + label {
      background: #fff0f0;
      border-color: #d73a4a;
      color: #d73a4a;
    }
    #__fo_dialog__ .fo-type-toggle input[value="enhancement"]:checked + label {
      background: #f0fbff;
      border-color: #0969da;
      color: #0969da;
    }

    /* \u2500\u2500 Footer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-footer {
      padding: 10px 18px;
      border-top: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fafafa;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-footer-spacer { flex: 1; }
    #__fo_dialog__ button {
      padding: 6px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      transition: background 0.12s;
    }
    #__fo_dialog__ .fo-btn-primary { background: #4f86f7; color: #fff; }
    #__fo_dialog__ .fo-btn-primary:hover { background: #3a6fd8; }
    #__fo_dialog__ .fo-btn-primary:disabled { background: #a0baf7; cursor: default; }
    #__fo_dialog__ .fo-btn-secondary { background: #efefef; color: #222; }
    #__fo_dialog__ .fo-btn-secondary:hover { background: #e0e0e0; }
    #__fo_dialog__ .fo-btn-export { background: #1a1a1a; color: #fff; }
    #__fo_dialog__ .fo-btn-export:hover { background: #333; }
    #__fo_dialog__ .fo-btn-export:disabled { background: #888; cursor: default; }

    /* \u2500\u2500 Metadata collapsible \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-meta-toggle {
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-meta-toggle summary {
      font-size: 11px;
      color: #888;
      cursor: pointer;
      user-select: none;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    #__fo_dialog__ .fo-meta-toggle summary::-webkit-details-marker { display: none; }
    #__fo_dialog__ .fo-meta-toggle summary::before {
      content: "\u25B6";
      font-size: 8px;
      transition: transform 0.15s;
      display: inline-block;
    }
    #__fo_dialog__ .fo-meta-toggle[open] summary::before { transform: rotate(90deg); }
    #__fo_dialog__ .fo-meta-grid {
      margin-top: 6px;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2px 10px;
      font-size: 11px;
      line-height: 1.6;
    }
    #__fo_dialog__ .fo-meta-key {
      color: #999;
      white-space: nowrap;
    }
    #__fo_dialog__ .fo-meta-val {
      color: #222;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      word-break: break-all;
      white-space: pre-wrap;
    }
    #__fo_dialog__ .fo-meta-section-title {
      grid-column: 1 / -1;
      font-weight: 600;
      color: #555;
      font-family: inherit;
      margin-top: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* \u2500\u2500 HTML preview \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-html-preview {
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      white-space: pre;
      overflow: auto;
      max-height: 160px;
      margin: 6px 0 0;
      padding: 8px 10px;
      background: #1e1e2e;
      border-radius: 5px;
      border: 1px solid #313149;
      color: #cdd6f4;
    }
    /* syntax token colours (Catppuccin-ish dark) */
    #__fo_dialog__ .fo-ht  { color: #89b4fa; }   /* tag name */
    #__fo_dialog__ .fo-ha  { color: #a6e3a1; }   /* attr name */
    #__fo_dialog__ .fo-hv  { color: #fab387; }   /* attr value */
    #__fo_dialog__ .fo-hd  { color: #6c7086; }   /* doctype / comment */
    #__fo_dialog__ .fo-hp  { color: #89dceb; }   /* punctuation <, >, = */

    /* \u2500\u2500 Issue topic override \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-topic-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-topic-label {
      font-size: 11px;
      color: #888;
    }
    #__fo_dialog__ .fo-topic-input {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 12px;
      font-family: inherit;
      color: #111;
      outline: none;
      background: #fafafa;
    }
    #__fo_dialog__ .fo-topic-input:focus {
      border-color: #4f86f7;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(79,134,247,0.12);
    }

    /* \u2500\u2500 Login card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-login-card {
      background: #fff;
      border-radius: 10px;
      padding: 28px 24px 20px;
      width: 340px;
      max-width: calc(100vw - 32px);
      box-shadow: 0 12px 48px rgba(0,0,0,0.28);
    }
    #__fo_dialog__ .fo-login-card h2 {
      margin: 0 0 6px;
      font-size: 15px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_dialog__ .fo-login-card p {
      margin: 0 0 18px;
      font-size: 13px;
      color: #555;
    }
    #__fo_dialog__ .fo-login-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `,document.head.appendChild(t)}function de(){let t=document.getElementById(K);return t||(t=document.createElement("div"),t.id=K,document.body.appendChild(t)),t}function fe(t){ce();let e=de(),o=t.existingComments,a=o.map(u=>u.id),n=t.context,s=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(u=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${C(u.github_user)}</span>
            <span class="fo-comment-date">${C(u.created_at)}</span>
          </div>
          <div class="fo-comment-text">${C(u.comment)}</div>
        </div>`).join("")}
    </div>`,l=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",c=[],m=n.dataComponent;m&&c.push(["component",m]),c.push(["selector",t.selector]);let f=n.boundingRect;f&&c.push(["position",`top ${f.top}, left ${f.left} \u2014 ${f.width} \xD7 ${f.height} px`]),c.push(["url",String(n.url??window.location.href)]);let x=n.viewport,g=n.devicePixelRatio;x&&c.push(["viewport",`${x.width} \xD7 ${x.height} px${g&&g!==1?` (${g}\xD7 DPR)`:""}`]);let y=n.cssFramework;y?.length&&c.push(["css framework",y.join(", ")]);let v=n.computedStyles;if(v){let u=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(b=>v[b]).map(b=>`${b}: ${v[b]}`).join(`
`);u&&c.push(["computed styles",u])}let O=String(n.userAgent??navigator.userAgent);c.push(["user agent",O]);let k=c.map(([u,b])=>`
    <div class="fo-meta-key">${C(u)}</div>
    <div class="fo-meta-val">${C(b)}</div>`).join(""),S=n.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${l}</h2>
          <div class="fo-user-pill">
            <img src="${C(t.user.avatarUrl)}" alt="">
            <span>${C(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${k}</div>
        </details>
        ${S?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Ce(S)}</pre>
        </details>`:""}
      </div>
      ${s}
      <div class="fo-compose">
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${C(t.defaultIssueTopic)}">
        </div>
        <textarea id="__fo_comment__" placeholder="Add a comment\u2026"></textarea>
        <div class="fo-type-toggle">
          <input type="radio" name="__fo_type__" id="__fo_type_bug__" value="bug">
          <label for="__fo_type_bug__">\u{1F41B} Bug</label>
          <input type="radio" name="__fo_type__" id="__fo_type_enh__" value="enhancement" checked>
          <label for="__fo_type_enh__">\u2728 Enhancement</label>
        </div>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
      <div class="fo-footer">
        <button class="fo-btn-secondary" id="__fo_submit__">Save</button>
        <div class="fo-footer-spacer"></div>
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_export__">Send to GitHub</button>
      </div>
    </div>
  `;let r=e.querySelector("#__fo_comment__"),i=e.querySelector("#__fo_submit__"),d=e.querySelector("#__fo_cancel__"),_=e.querySelector("#__fo_export__"),p=e.querySelector("#__fo_err__"),h=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",I=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;r.focus(),d.addEventListener("click",()=>{w(),t.onCancel()}),i.addEventListener("click",async()=>{let u=r.value.trim();if(!u){p.textContent="Please enter a comment.";return}i.disabled=!0,i.textContent="Submitting\u2026",p.textContent="";try{await t.onSubmit(u,h()),w()}catch(b){p.textContent=String(b),i.disabled=!1,i.textContent="Submit"}}),_.addEventListener("click",async()=>{_.disabled=!0,_.textContent="Exporting\u2026",i.disabled=!0,p.textContent="";try{let u=r.value.trim(),b=h(),L=I(),E=[...a];if(u){let A=await t.onSubmit(u,b);E=[...E,A]}if(E.length===0){p.textContent="Nothing to export \u2014 add a comment first.",_.disabled=!1,_.textContent="Send to GitHub",i.disabled=!1;return}await t.onExport(E,b,L),w()}catch(u){p.textContent=String(u),_.disabled=!1,_.textContent="Send to GitHub",i.disabled=!1}}),e.addEventListener("click",u=>{u.target===e&&(w(),t.onCancel())});let $=u=>{u.key==="Escape"&&(w(),t.onCancel(),document.removeEventListener("keydown",$))};document.addEventListener("keydown",$)}function ue(t){ce();let e=de();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),a=e.querySelector("#__fo_cancel__"),n=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),w()}catch(s){o.disabled=!1,o.textContent="Sign in with GitHub",n.textContent=String(s)}}),a.addEventListener("click",()=>{w(),t.onCancel()}),e.addEventListener("click",s=>{s.target===e&&(w(),t.onCancel())})}function w(){let t=document.getElementById(K);t&&t.remove()}function Ce(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,a=g=>g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function n(g,y){return`<span class="${g}">${y}</span>`}let s=0,l=2,c=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function m(){return" ".repeat(s*l)}let f=[],x;for(e.lastIndex=0;(x=e.exec(t))!==null;){let g=x[0],y=x[1];if(g.startsWith("<!--")||g.startsWith("<!")){f.push(m()+n("fo-hd",a(g))+`
`);continue}if(!g.startsWith("<")){let r=g.trim();r&&f.push(m()+a(r)+`
`);continue}let v=g.startsWith("</"),O=g.endsWith("/>")||y&&c.has(y.toLowerCase());v&&(s=Math.max(0,s-1));let k=n("fo-hp","&lt;")+(v?n("fo-hp","/"):"");k+=n("fo-ht",a(y??""));let S=x[2]??"";if(S.trim()){o.lastIndex=0;let r;for(;(r=o.exec(S))!==null;){let i=r[1],d=r[2]??"";if(k+=" "+n("fo-ha",a(i)),d){let _=d.indexOf("="),p=d.slice(_+1).trim();k+=n("fo-hp","=")+n("fo-hv",a(p))}}}k+=O&&!v?n("fo-hp"," /&gt;"):n("fo-hp","&gt;"),f.push(m()+k+`
`),!v&&!O&&s++}return f.join("").trimEnd()}function C(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let e=J(),o=new R(e),a=new z(e,o);o.setOnUnauthorized(()=>a.logout()),Q(e),Z(async r=>{r==="active"?n():r==="idle"&&s()});function n(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",f,!0),o.listBadges(window.location.href).then(r=>j(r,x)).catch(()=>{})}function s(){document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",f,!0),G(),Y(),w()}function l(r){let i=r.target;!i||i===document.body||i===document.documentElement||c(i)||ae(i)}function c(r){return r.id.startsWith("__fo_")}async function m(r){let i=W(r),d=g(r);if(T("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",f,!0),G(),a.isAuthenticated()||await new Promise((b,L)=>{ue({onLogin:async()=>{await a.login(),b()},onCancel:()=>{T("idle"),L(new Error("cancelled"))}})}).catch(()=>{}),!a.isAuthenticated())return;let _=a.getUser(),h=(await o.listComments(window.location.href).catch(()=>[])).filter(b=>b.selector===i);T("commenting");let $=d.dataComponent??i.split(">").pop()?.trim()??i,u=h.length>0?`Feedback: ${h.length+1} comments on ${$}`:`Feedback on ${$}`;fe({selector:i,existingComments:h,context:d,user:_,defaultIssueTopic:u,onSubmit:async(b,L)=>{let E=await o.createFeedback({url:window.location.href,selector:i,comment:b,context:d,repo:e.repo,label:e.label,feedbackType:L}),A=await o.listBadges(window.location.href).catch(()=>[]);return j(A,x),T("active"),E.id},onExport:async(b,L,E)=>{let A=await o.exportIssue({ids:b,repo:e.repo,labels:[e.label,L],title:E});window.open(A.issue_url,"_blank");let pe=await o.listBadges(window.location.href).catch(()=>[]);j(pe,x),T("active")},onCancel:()=>{T("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",f,!0)}})}async function f(r){let i=r.target;!i||c(i)||(r.preventDefault(),r.stopPropagation(),V()==="active"&&await m(i))}function x(r,i){let d=null;try{d=document.querySelector(i)}catch{}d&&m(d)}function g(r){let i=r.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:r.tagName.toLowerCase(),dataComponent:y(r)??void 0,outerHTML:r.outerHTML?.slice(0,4e3)??"",innerText:r.innerText?.slice(0,200)??"",attributes:v(r),cssFramework:S(r),computedStyles:k(r),boundingRect:{top:Math.round(i.top),left:Math.round(i.left),width:Math.round(i.width),height:Math.round(i.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function y(r){let i=r,d=[];for(;i&&i!==document.documentElement;){let _=i.getAttribute("data-component");if(_)return[_,...d.reverse()].join(" > ");d.push(i.tagName.toLowerCase()),i=i.parentElement}return null}function v(r){let i={};for(let d of Array.from(r.attributes))d.value.length<200&&(i[d.name]=d.value);return i}let O=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function k(r){let i=window.getComputedStyle(r),d={};for(let _ of O){let p=i.getPropertyValue(_.replace(/([A-Z])/g,h=>`-${h.toLowerCase()}`)).trim();p&&p!=="none"&&p!=="normal"&&p!=="auto"&&p!=="0px"&&(d[_]=p)}return d}function S(r){let i=Array.from(r.classList).join(" "),d=r,_=[];for(let I=0;I<6&&d;I++)_.push(...Array.from(d.classList)),d=d.parentElement;let p=_.join(" "),h=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(p)&&h.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(i)&&h.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(p)&&h.push("Bootstrap"),/\bMui[A-Z]/.test(p)&&h.push("Material UI"),/\bchakra-/.test(p)&&h.push("Chakra UI"),(r.hasAttribute("data-radix-collection-item")||/\bradix-/.test(p))&&h.push("Radix UI"),h.includes("Tailwind CSS")&&h.includes("Radix UI")&&h.push("shadcn/ui"),h}})();})();
