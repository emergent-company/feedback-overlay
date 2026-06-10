"use strict";var FeedbackOverlay=(()=>{function Le(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function ce(){let t=Le(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",c=t?.dataset.label??"feedback",i=t?.dataset.hotkey?.toLowerCase()??"",p=["alt+shift","ctrl+shift","meta+shift"].includes(i)?i:"alt+shift";o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag.");let l=t?.dataset.branch?.trim()||void 0,s=t?.dataset.version?.trim()||void 0;return{apiBase:e,repo:o,label:c,hotkey:p,branch:l,version:s}}var W=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let c=(o.method??"GET").toUpperCase(),i=c!=="GET"&&c!=="HEAD"?{"Content-Type":"application/json"}:{},n=await fetch(this.base+e,{...o,headers:{...i,...this.authHeaders(),...o.headers??{}}});if(!n.ok){n.status===401&&this.onUnauthorized&&this.onUnauthorized();let p=await n.text().catch(()=>n.statusText);throw new Error(`${n.status}: ${p}`)}return n.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listIssueBadges(e){return this.fetchJSON(`/issues?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var Ie="feedback_overlay_auth",Q="__fo_user__",G=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let c=`${this.config.apiBase}/auth/github`,i=window.open(c,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!i){o(new Error("Popup was blocked. Please allow popups for this site."));return}let n=setTimeout(()=>{l(),o(new Error("Authentication timed out."))},300*1e3),p=f=>{if(f.data?.type!==Ie)return;clearTimeout(n),l();let{token:x,login:_,avatar:y}=f.data;this.api.setToken(x),this.user={login:_,avatarUrl:y},this.saveUser(this.user),e(this.user)},l=()=>{window.removeEventListener("message",p),this.messageHandler=null,i.closed||i.close()};this.messageHandler=p,window.addEventListener("message",p);let s=setInterval(()=>{i.closed&&(clearInterval(s),this.messageHandler===p&&(l(),clearTimeout(n),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(Q,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(Q);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(Q)}catch{}}};var M="idle",Y=[],F="Alt",de="Shift",D=!1,N=!1,J=!1;function U(t){M!==t&&(M=t,Y.forEach(e=>e(t)))}function fe(){return M}function pe(t){return Y.push(t),()=>{Y=Y.filter(e=>e!==t)}}function H(t){U(t)}function ue(t){switch(t.hotkey){case"ctrl+shift":F="Control";break;case"meta+shift":F="Meta";break;case"alt+shift":default:F="Alt";break}window.addEventListener("keydown",$e,!0),window.addEventListener("keyup",Me,!0),window.addEventListener("blur",Oe)}function $e(t){if(t.key==="Escape"&&(M==="active"||M==="capturing")){U("idle");return}t.key===F&&(D=!0),t.key===de&&(N=!0),D&&N&&!J&&(J=!0,M==="idle"?U("active"):M==="active"&&U("idle"))}function Me(t){t.key===F&&(D=!1),t.key===de&&(N=!1),(!D||!N)&&(J=!1)}function Oe(){D=!1,N=!1,J=!1,M==="active"&&U("idle")}function ee(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let c=o.getAttribute("data-testid");if(c){e.unshift(`[data-testid="${CSS.escape(c)}"]`);break}if(o.id&&!Ae(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}let i=o.getAttribute("data-component");if(i){let l=o.parentElement;if(l){let s=Array.from(l.children).filter(f=>f.getAttribute("data-component")===i);if(s.length>1){let f=s.indexOf(o)+1;e.unshift(`[data-component="${CSS.escape(i)}"]:nth-of-type(${s.indexOf(o)+1})`);let _=Array.from(l.children).filter(y=>y.tagName===o.tagName).indexOf(o)+1;e[0]=`[data-component="${CSS.escape(i)}"]:nth-of-type(${_})`}else e.unshift(`[data-component="${CSS.escape(i)}"]`);if(l.getAttribute("data-component")){let f=l.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(f)}"]`);break}o=l;continue}else{e.unshift(`[data-component="${CSS.escape(i)}"]`);break}}let n=o.parentElement,p=o.tagName.toLowerCase();if(n){let l=Array.from(n.children).filter(s=>s.tagName===o.tagName);if(l.length>1){let s=l.indexOf(o)+1;e.unshift(`${p}:nth-of-type(${s})`)}else e.unshift(p)}else e.unshift(p);o=n}return e.join(" > ")}function Ae(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function me(t){let e=t;for(;e&&e!==document.documentElement;){let o=e.getAttribute("data-component");if(o)return o;e=e.parentElement}return null}function ge(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let p=e.getAttribute("data-component");if(p)return[p,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let c=t.tagName.toLowerCase(),i=t.id?`#${t.id}`:"",n=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${c}${i}${n}>`}var he="__fo_highlight__",be="__fo_tooltip__",He="#22c55e",Be="rgba(34, 197, 94, 0.08)",Pe="#4f86f7",ze="rgba(79, 134, 247, 0.08)",xe=null;function _e(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function ye(t){xe=t;let e=t.getBoundingClientRect(),o=window.scrollX,c=window.scrollY,i=me(t)!==null,n=i?He:Pe,p=i?Be:ze,l=_e(he);Object.assign(l.style,{position:"absolute",top:`${e.top+c}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:`2px solid ${n}`,backgroundColor:p,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let s=ge(t),f=_e(be);f.textContent=s;let x=Math.min(e.left+o,window.innerWidth+o-(s.length*7+16));Object.assign(f.style,{position:"absolute",top:`${e.top+c-26}px`,left:`${Math.max(4,x)}px`,background:n,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function te(){xe=null,document.getElementById(he)?.remove(),document.getElementById(be)?.remove()}var oe="__fo_badge__",K=[],V=null;function ie(){K.forEach(t=>t.remove()),K=[],V?.disconnect(),V=null}function ve(t,e,o=[]){ie();let c=[];t.forEach((n,p)=>{let l=null;try{l=document.querySelector(n.selector)}catch{return}if(!l)return;let s=document.createElement("div");s.id=`${oe}${p}`,s.textContent=String(n.count),s.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(s.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),e(n.ids,n.selector)}),document.body.appendChild(s),K.push(s),c.push({badge:s,selector:n.selector}),ne(s,l,0)}),o.forEach((n,p)=>{let l=null;try{l=document.querySelector(n.selector)}catch{return}if(!l)return;let s=document.createElement("div");s.id=`${oe}issue_${p}`,s.textContent=`#${n.issue_number}`,s.title=`GitHub issue #${n.issue_number}: ${n.title}`,Object.assign(s.style,{position:"absolute",background:"#c0392b",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),window.open(n.issue_url,"_blank","noopener")}),document.body.appendChild(s),K.push(s),c.push({badge:s,selector:n.selector}),ne(s,l,t.some(f=>f.selector===n.selector)?18:0)});let i=()=>{c.forEach(({badge:n,selector:p})=>{let l=null;try{l=document.querySelector(p)}catch{return}if(!l)return;let s=n.id.startsWith(`${oe}issue_`),f=s?t.some(x=>x.selector===p):!1;ne(n,l,s&&f?18:0)})};window.addEventListener("scroll",i,{passive:!0}),window.addEventListener("resize",i,{passive:!0}),V=new ResizeObserver(i),V.observe(document.body)}function ne(t,e,o=0){let c=e.getBoundingClientRect(),i=window.scrollX,n=window.scrollY;t.style.top=`${c.top+n-8+o}px`,t.style.left=`${c.right+i-8}px`}var re="__fo_dialog__",we="__fo_styles__";function ke(){if(document.getElementById(we))return;let t=document.createElement("style");t.id=we,t.textContent=`
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

    /* \u2500\u2500 Component picker \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-component-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-bottom: 1px solid #e8e8e8;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-component-label {
      font-size: 11px;
      color: #999;
      white-space: nowrap;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-component-select {
      flex: 1;
      font-size: 12px;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      color: #111;
      background: #f7f7f7;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 3px 6px;
      outline: none;
      cursor: pointer;
    }
    #__fo_dialog__ .fo-component-select:focus {
      border-color: #4f86f7;
      background: #fff;
    }

    /* \u2500\u2500 Target info strip \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-target-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 6px 18px 10px;
      border-bottom: 1px solid #e8e8e8;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-target-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      color: #444;
      background: #f2f2f2;
      border-radius: 4px;
      padding: 2px 7px;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
    }
    #__fo_dialog__ .fo-target-chip-label {
      color: #999;
      font-family: inherit;
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
  `,document.head.appendChild(t)}function Ee(){let t=document.getElementById(re);return t||(t=document.createElement("div"),t.id=re,document.body.appendChild(t)),t}function Ce(t){ke();let e=Ee(),o=t.existingComments,c=o.map(m=>m.id),i=t.context,n=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(m=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${E(m.github_user)}</span>
            <span class="fo-comment-date">${E(m.created_at)}</span>
          </div>
          <div class="fo-comment-text">${E(m.comment)}</div>
        </div>`).join("")}
    </div>`,p=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",l=[];t.repo&&l.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">repo</span>${E(t.repo)}</span>`),t.branch&&l.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">branch</span>${E(t.branch)}</span>`),t.appVersion&&l.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">version</span>${E(t.appVersion)}</span>`);let s=l.length>0?`<div class="fo-target-strip">${l.join("")}</div>`:"",f=t.componentHierarchy??[],x=f.length>1?`
    <div class="fo-component-row">
      <span class="fo-component-label">Component</span>
      <select class="fo-component-select" id="__fo_component__">
        ${f.map((m,g)=>`<option value="${g}" ${g===(t.selectedComponentIdx??0)?"selected":""}>
          ${m.isChild?"\u21B3 ":""}${E(m.name)}
        </option>`).join("")}
      </select>
    </div>`:"",_=[],y=i.dataComponent;y&&_.push(["component",y]),_.push(["selector",t.selector]);let v=i.boundingRect;v&&_.push(["position",`top ${v.top}, left ${v.left} \u2014 ${v.width} \xD7 ${v.height} px`]),_.push(["url",String(i.url??window.location.href)]);let I=i.viewport,S=i.devicePixelRatio;I&&_.push(["viewport",`${I.width} \xD7 ${I.height} px${S&&S!==1?` (${S}\xD7 DPR)`:""}`]);let A=i.cssFramework;A?.length&&_.push(["css framework",A.join(", ")]);let w=i.computedStyles;if(w){let m=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(g=>w[g]).map(g=>`${g}: ${w[g]}`).join(`
`);m&&_.push(["computed styles",m])}let z=String(i.userAgent??navigator.userAgent);_.push(["user agent",z]);let a=_.map(([m,g])=>`
    <div class="fo-meta-key">${E(m)}</div>
    <div class="fo-meta-val">${E(g)}</div>`).join(""),r=i.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${p}</h2>
          <div class="fo-user-pill">
            <img src="${E(t.user.avatarUrl)}" alt="">
            <span>${E(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${a}</div>
        </details>
        ${r?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Fe(r)}</pre>
        </details>`:""}
      </div>
      ${x}
      ${s}
      ${n}
      <div class="fo-compose">
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${E(t.defaultIssueTopic)}">
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
  `;let d=e.querySelector("#__fo_comment__"),h=e.querySelector("#__fo_submit__"),b=e.querySelector("#__fo_cancel__"),u=e.querySelector("#__fo_export__"),k=e.querySelector("#__fo_err__"),j=e.querySelector("#__fo_component__");j&&t.onComponentChange&&j.addEventListener("change",()=>{t.onComponentChange(parseInt(j.value,10))});let B=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",le=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;d.focus(),b.addEventListener("click",()=>{T(),t.onCancel()}),h.addEventListener("click",async()=>{let m=d.value.trim();if(!m){k.textContent="Please enter a comment.";return}h.disabled=!0,h.textContent="Submitting\u2026",k.textContent="";try{await t.onSubmit(m,B()),T()}catch(g){k.textContent=String(g),h.disabled=!1,h.textContent="Submit"}}),u.addEventListener("click",async()=>{u.disabled=!0,u.textContent="Exporting\u2026",h.disabled=!0,k.textContent="";try{let m=d.value.trim(),g=B(),L=le(),$=[...c];if(m){let q=await t.onSubmit(m,g);$=[...$,q]}if($.length===0){k.textContent="Nothing to export \u2014 add a comment first.",u.disabled=!1,u.textContent="Send to GitHub",h.disabled=!1;return}T(),t.onExport($,g,L).catch(q=>{ae(`Failed to create issue: ${String(q)}`)})}catch(m){k.textContent=String(m),u.disabled=!1,u.textContent="Send to GitHub",h.disabled=!1}}),e.addEventListener("click",m=>{m.target===e&&(T(),t.onCancel())});let R=m=>{m.key==="Escape"&&(T(),t.onCancel(),document.removeEventListener("keydown",R))};document.addEventListener("keydown",R)}function Se(t){ke();let e=Ee();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),c=e.querySelector("#__fo_cancel__"),i=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),T()}catch(n){o.disabled=!1,o.textContent="Sign in with GitHub",i.textContent=String(n)}}),c.addEventListener("click",()=>{T(),t.onCancel()}),e.addEventListener("click",n=>{n.target===e&&(T(),t.onCancel())})}function T(){let t=document.getElementById(re);t&&t.remove()}var P="__fo_toast__";function Re(){if(document.getElementById(P+"_styles"))return;let t=document.createElement("style");t.id=P+"_styles",t.textContent=`
    #${P} {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      background: #1a1a1a;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      max-width: 360px;
    }
    #${P}.fo-visible {
      opacity: 1;
    }
  `,document.head.appendChild(t)}function ae(t){Re();let e=document.getElementById(P);e||(e=document.createElement("div"),e.id=P,document.body.appendChild(e)),e.textContent=t,e.classList.add("fo-visible"),clearTimeout(e.__fo_toast_timer),e.__fo_toast_timer=setTimeout(()=>{e.classList.remove("fo-visible")},3e3)}function Fe(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,c=_=>_.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function i(_,y){return`<span class="${_}">${y}</span>`}let n=0,p=2,l=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function s(){return" ".repeat(n*p)}let f=[],x;for(e.lastIndex=0;(x=e.exec(t))!==null;){let _=x[0],y=x[1];if(_.startsWith("<!--")||_.startsWith("<!")){f.push(s()+i("fo-hd",c(_))+`
`);continue}if(!_.startsWith("<")){let w=_.trim();w&&f.push(s()+c(w)+`
`);continue}let v=_.startsWith("</"),I=_.endsWith("/>")||y&&l.has(y.toLowerCase());v&&(n=Math.max(0,n-1));let S=i("fo-hp","&lt;")+(v?i("fo-hp","/"):"");S+=i("fo-ht",c(y??""));let A=x[2]??"";if(A.trim()){o.lastIndex=0;let w;for(;(w=o.exec(A))!==null;){let z=w[1],a=w[2]??"";if(S+=" "+i("fo-ha",c(z)),a){let r=a.indexOf("="),d=a.slice(r+1).trim();S+=i("fo-hp","=")+i("fo-hv",c(d))}}}S+=I&&!v?i("fo-hp"," /&gt;"):i("fo-hp","&gt;"),f.push(s()+S+`
`),!v&&!I&&n++}return f.join("").trimEnd()}function E(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Z="__fo_indicator__",Ue=`
#${Z} {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  background: rgba(17, 24, 39, 0.92);
  backdrop-filter: blur(4px);
  border-bottom: 2px solid #22c55e;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #f9fafb;
  letter-spacing: 0.01em;
  pointer-events: none;
  box-sizing: border-box;
  opacity: 1;
  transition: opacity 1.2s ease;
}
#${Z} .fo-bar-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  margin-right: 8px;
  flex-shrink: 0;
  animation: fo-pulse 2s ease-in-out infinite;
}
#${Z} .fo-bar-key {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 4px;
  padding: 0 5px;
  margin: 0 2px;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 11px;
  line-height: 18px;
}
@keyframes fo-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
`;function De(t){let e=/Mac|iPhone|iPad|iPod/.test(navigator.platform);switch(t){case"ctrl+shift":return"Ctrl+Shift";case"meta+shift":return e?"\u2318+Shift":"Win+Shift";case"alt+shift":default:return e?"\u2325+Shift":"Alt+Shift"}}var X=null,C=null,O=null;function Te(t){X||(X=document.createElement("style"),X.textContent=Ue,document.head.appendChild(X)),C||(C=document.createElement("div"),C.id=Z,document.body.appendChild(C));let e=De(t);C.innerHTML=`<span class="fo-bar-dot"></span>Comment mode\u2002\u2014\u2002press\xA0<span class="fo-bar-key">${e}</span>\xA0to exit`,C.style.display="flex",C.style.opacity="1",O&&(clearTimeout(O),O=null),O=setTimeout(()=>{C&&(C.style.opacity="0"),O=null},3e3)}function se(){O&&(clearTimeout(O),O=null),C&&(C.style.opacity="0",C.style.display="none")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let e=ce(),o=new W(e),c=new G(e,o);o.setOnUnauthorized(()=>c.logout()),ue(e),pe(async a=>{a==="active"?(Te(e.hotkey),i()):a==="idle"?(se(),p()):(a==="capturing"||a==="commenting")&&se()});function i(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",x,!0),n()}async function n(){let a=window.location.href,[r,d]=await Promise.all([o.listBadges(a).catch(()=>[]),o.listIssueBadges(a).catch(()=>[])]);ve(r,_,d)}function p(){document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",x,!0),te(),ie(),T()}function l(a){let r=a.target;!r||r===document.body||r===document.documentElement||s(r)||ye(r)}function s(a){return a.id.startsWith("__fo_")}async function f(a){let r=ee(a),d=v(a),h=y(a),b=h.findIndex(g=>!a.closest("[data-component]")||g.element===a.closest("[data-component]")),u=b>=0?b:0;if(H("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",x,!0),te(),c.isAuthenticated()||await new Promise((g,L)=>{Se({onLogin:async()=>{await c.login(),g()},onCancel:()=>{H("idle"),L(new Error("cancelled"))}})}).catch(()=>{}),!c.isAuthenticated())return;let k=c.getUser(),B=(await o.listComments(window.location.href).catch(()=>[])).filter(g=>g.selector===r);H("commenting");let R=d.dataComponent??r.split(">").pop()?.trim()??r,m=B.length>0?`Feedback: ${B.length+1} comments on ${R}`:`Feedback on ${R}`;Ce({selector:r,existingComments:B,context:d,user:k,defaultIssueTopic:m,repo:e.repo,branch:e.branch,appVersion:e.version,componentHierarchy:h.map((g,L)=>({name:g.name,isChild:L>u})),selectedComponentIdx:u,onComponentChange:g=>{T(),f(h[g].element)},onSubmit:async(g,L)=>{let $=await o.createFeedback({url:window.location.href,selector:r,comment:g,context:d,repo:e.repo,label:e.label,feedbackType:L});return await n(),H("active"),$.id},onExport:async(g,L,$)=>{let q=await o.exportIssue({ids:g,repo:e.repo,labels:[e.label,L],title:$});ae("Issue created successfully!"),await n(),H("active")},onCancel:()=>{H("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",x,!0)}})}async function x(a){let r=a.target;!r||s(r)||(a.preventDefault(),a.stopPropagation(),fe()==="active"&&await f(r))}function _(a,r){let d=null;try{d=document.querySelector(r)}catch{}d&&f(d)}function y(a){let r=[],d=a;for(;d&&d!==document.documentElement;){let u=d.getAttribute("data-component");u&&r.push({name:u,element:d}),d=d.parentElement}r.reverse();let h=r.length>0?r[r.length-1].element:null,b=[];return h&&h.querySelectorAll("[data-component]").forEach(u=>{u.parentElement?.closest("[data-component]")===h&&b.push({name:u.getAttribute("data-component"),element:u})}),[...r,...b]}function v(a){let r=a.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:a.tagName.toLowerCase(),dataComponent:I(a)??void 0,outerHTML:a.outerHTML?.slice(0,4e3)??"",innerText:a.innerText?.slice(0,200)??"",attributes:S(a),cssFramework:z(a),computedStyles:w(a),boundingRect:{top:Math.round(r.top),left:Math.round(r.left),width:Math.round(r.width),height:Math.round(r.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString(),...e.branch?{branch:e.branch}:{},...e.version?{appVersion:e.version}:{}}}function I(a){let r=a,d=[];for(;r&&r!==document.documentElement;){let h=r.getAttribute("data-component");if(h)return[h,...d.reverse()].join(" > ");d.push(r.tagName.toLowerCase()),r=r.parentElement}return null}function S(a){let r={};for(let d of Array.from(a.attributes))d.value.length<200&&(r[d.name]=d.value);return r}let A=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function w(a){let r=window.getComputedStyle(a),d={};for(let h of A){let b=r.getPropertyValue(h.replace(/([A-Z])/g,u=>`-${u.toLowerCase()}`)).trim();b&&b!=="none"&&b!=="normal"&&b!=="auto"&&b!=="0px"&&(d[h]=b)}return d}function z(a){let r=Array.from(a.classList).join(" "),d=a,h=[];for(let k=0;k<6&&d;k++)h.push(...Array.from(d.classList)),d=d.parentElement;let b=h.join(" "),u=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(b)&&u.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(r)&&u.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(b)&&u.push("Bootstrap"),/\bMui[A-Z]/.test(b)&&u.push("Material UI"),/\bchakra-/.test(b)&&u.push("Chakra UI"),(a.hasAttribute("data-radix-collection-item")||/\bradix-/.test(b))&&u.push("Radix UI"),u.includes("Tailwind CSS")&&u.includes("Radix UI")&&u.push("shadcn/ui"),u}})();})();
