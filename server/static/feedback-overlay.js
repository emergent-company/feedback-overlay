"use strict";var FeedbackOverlay=(()=>{function ge(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function X(){let t=ge(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",a=t?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:e,repo:o,label:a}}var R=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let a=(o.method??"GET").toUpperCase(),n=a!=="GET"&&a!=="HEAD"?{"Content-Type":"application/json"}:{},s=await fetch(this.base+e,{...o,headers:{...n,...this.authHeaders(),...o.headers??{}}});if(!s.ok){s.status===401&&this.onUnauthorized&&this.onUnauthorized();let l=await s.text().catch(()=>s.statusText);throw new Error(`${s.status}: ${l}`)}return s.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var _e="feedback_overlay_auth",W="__fo_user__",B=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let a=`${this.config.apiBase}/auth/github`,n=window.open(a,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!n){o(new Error("Popup was blocked. Please allow popups for this site."));return}let s=setTimeout(()=>{c(),o(new Error("Authentication timed out."))},300*1e3),l=u=>{if(u.data?.type!==_e)return;clearTimeout(s),c();let{token:h,login:m,avatar:x}=u.data;this.api.setToken(h),this.user={login:m,avatarUrl:x},this.saveUser(this.user),e(this.user)},c=()=>{window.removeEventListener("message",l),this.messageHandler=null,n.closed||n.close()};this.messageHandler=l,window.addEventListener("message",l);let _=setInterval(()=>{n.closed&&(clearInterval(_),this.messageHandler===l&&(c(),clearTimeout(s),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(W,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(W);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(W)}catch{}}};var V="Shift",I="idle",P=[],A=!1,H=!1;function z(t){I!==t&&(I=t,P.forEach(e=>e(t)))}function Z(){return I}function Q(t){return P.push(t),()=>{P=P.filter(e=>e!==t)}}function M(t){z(t)}function ee(){window.addEventListener("keydown",he,!0),window.addEventListener("keyup",be,!0),window.addEventListener("blur",xe)}function he(t){t.key==="Alt"&&(A=!0),t.key===V&&(H=!0),A&&H&&I==="idle"&&z("active")}function be(t){t.key==="Alt"&&(A=!1),t.key===V&&(H=!1),!A&&!H&&I==="active"&&z("idle")}function xe(){A=!1,H=!1,I==="active"&&z("idle")}function F(t){if(t.getAttribute("data-component"))return t;let e=t.parentElement;for(;e&&e!==document.documentElement;){if(e.getAttribute("data-component"))return e;e=e.parentElement}return t}function G(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let a=o.getAttribute("data-testid");if(a){e.unshift(`[data-testid="${CSS.escape(a)}"]`);break}if(o.id&&!ve(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}let n=o.getAttribute("data-component");if(n){let c=o.parentElement;if(c){let _=Array.from(c.children).filter(u=>u.getAttribute("data-component")===n);if(_.length>1){let u=_.indexOf(o)+1;e.unshift(`[data-component="${CSS.escape(n)}"]:nth-of-type(${_.indexOf(o)+1})`);let m=Array.from(c.children).filter(x=>x.tagName===o.tagName).indexOf(o)+1;e[0]=`[data-component="${CSS.escape(n)}"]:nth-of-type(${m})`}else e.unshift(`[data-component="${CSS.escape(n)}"]`);if(c.getAttribute("data-component")){let u=c.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(u)}"]`);break}o=c;continue}else{e.unshift(`[data-component="${CSS.escape(n)}"]`);break}}let s=o.parentElement,l=o.tagName.toLowerCase();if(s){let c=Array.from(s.children).filter(_=>_.tagName===o.tagName);if(c.length>1){let _=c.indexOf(o)+1;e.unshift(`${l}:nth-of-type(${_})`)}else e.unshift(l)}else e.unshift(l);o=s}return e.join(" > ")}function ve(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function te(t){let e=t;for(;e&&e!==document.documentElement;){let o=e.getAttribute("data-component");if(o)return o;e=e.parentElement}return null}function oe(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let l=e.getAttribute("data-component");if(l)return[l,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let a=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",s=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${a}${n}${s}>`}var ie="__fo_highlight__",re="__fo_tooltip__",ye="#22c55e",we="rgba(34, 197, 94, 0.08)",Ee="#4f86f7",ke="rgba(79, 134, 247, 0.08)",ae=null;function ne(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function se(t){ae=t;let e=F(t),o=e.getBoundingClientRect(),a=window.scrollX,n=window.scrollY,s=te(e)!==null,l=s?ye:Ee,c=s?we:ke,_=ne(ie);Object.assign(_.style,{position:"absolute",top:`${o.top+n}px`,left:`${o.left+a}px`,width:`${o.width}px`,height:`${o.height}px`,outline:`2px solid ${l}`,backgroundColor:c,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let u=oe(e),h=ne(re);h.textContent=u;let m=Math.min(o.left+a,window.innerWidth+a-(u.length*7+16));Object.assign(h.style,{position:"absolute",top:`${o.top+n-26}px`,left:`${Math.max(4,m)}px`,background:l,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function Y(){ae=null,document.getElementById(ie)?.remove(),document.getElementById(re)?.remove()}var Ce="__fo_badge__",U=[],D=null;function J(){U.forEach(t=>t.remove()),U=[],D?.disconnect(),D=null}function N(t,e){J(),t.forEach((a,n)=>{let s=null;try{s=document.querySelector(a.selector)}catch{return}if(!s)return;let l=document.createElement("div");l.id=`${Ce}${n}`,l.textContent=String(a.count),l.title=`${a.count} comment${a.count!==1?"s":""} on this element`,Object.assign(l.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),l.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),e(a.ids,a.selector)}),document.body.appendChild(l),U.push(l),le(l,s)});let o=()=>{U.forEach((a,n)=>{let s=t[n];if(!s)return;let l=null;try{l=document.querySelector(s.selector)}catch{return}l&&le(a,l)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),D=new ResizeObserver(o),D.observe(document.body)}function le(t,e){let o=e.getBoundingClientRect(),a=window.scrollX,n=window.scrollY;t.style.top=`${o.top+n-8}px`,t.style.left=`${o.right+a-8}px`}var K="__fo_dialog__",ce="__fo_styles__";function de(){if(document.getElementById(ce))return;let t=document.createElement("style");t.id=ce,t.textContent=`
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
  `,document.head.appendChild(t)}function fe(){let t=document.getElementById(K);return t||(t=document.createElement("div"),t.id=K,document.body.appendChild(t)),t}function ue(t){de();let e=fe(),o=t.existingComments,a=o.map(f=>f.id),n=t.context,s=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(f=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${L(f.github_user)}</span>
            <span class="fo-comment-date">${L(f.created_at)}</span>
          </div>
          <div class="fo-comment-text">${L(f.comment)}</div>
        </div>`).join("")}
    </div>`,l=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",c=[],_=n.dataComponent;_&&c.push(["component",_]),c.push(["selector",t.selector]);let u=n.boundingRect;u&&c.push(["position",`top ${u.top}, left ${u.left} \u2014 ${u.width} \xD7 ${u.height} px`]),c.push(["url",String(n.url??window.location.href)]);let h=n.viewport,m=n.devicePixelRatio;h&&c.push(["viewport",`${h.width} \xD7 ${h.height} px${m&&m!==1?` (${m}\xD7 DPR)`:""}`]);let x=n.cssFramework;x?.length&&c.push(["css framework",x.join(", ")]);let y=n.computedStyles;if(y){let f=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(v=>y[v]).map(v=>`${v}: ${y[v]}`).join(`
`);f&&c.push(["computed styles",f])}let O=String(n.userAgent??navigator.userAgent);c.push(["user agent",O]);let k=c.map(([f,v])=>`
    <div class="fo-meta-key">${L(f)}</div>
    <div class="fo-meta-val">${L(v)}</div>`).join(""),T=n.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${l}</h2>
          <div class="fo-user-pill">
            <img src="${L(t.user.avatarUrl)}" alt="">
            <span>${L(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${k}</div>
        </details>
        ${T?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Se(T)}</pre>
        </details>`:""}
      </div>
      ${s}
      <div class="fo-compose">
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${L(t.defaultIssueTopic)}">
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
        <button class="fo-btn-export" id="__fo_export__">Send to GitHub</button>
        <div class="fo-footer-spacer"></div>
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
      </div>
    </div>
  `;let i=e.querySelector("#__fo_comment__"),r=e.querySelector("#__fo_submit__"),d=e.querySelector("#__fo_cancel__"),g=e.querySelector("#__fo_export__"),p=e.querySelector("#__fo_err__"),b=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",S=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;i.focus(),d.addEventListener("click",()=>{E(),t.onCancel()}),r.addEventListener("click",async()=>{let f=i.value.trim();if(!f){p.textContent="Please enter a comment.";return}r.disabled=!0,r.textContent="Submitting\u2026",p.textContent="";try{await t.onSubmit(f,b()),E()}catch(v){p.textContent=String(v),r.disabled=!1,r.textContent="Submit"}}),g.addEventListener("click",async()=>{g.disabled=!0,g.textContent="Exporting\u2026",r.disabled=!0,p.textContent="";try{let f=i.value.trim(),v=b(),C=S(),w=[...a];if(f){let $=await t.onSubmit(f,v);w=[...w,$]}if(w.length===0){p.textContent="Nothing to export \u2014 add a comment first.",g.disabled=!1,g.textContent="Send to GitHub",r.disabled=!1;return}await t.onExport(w,v,C),E()}catch(f){p.textContent=String(f),g.disabled=!1,g.textContent="Send to GitHub",r.disabled=!1}}),e.addEventListener("click",f=>{f.target===e&&(E(),t.onCancel())});let j=f=>{f.key==="Escape"&&(E(),t.onCancel(),document.removeEventListener("keydown",j))};document.addEventListener("keydown",j)}function pe(t){de();let e=fe();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),a=e.querySelector("#__fo_cancel__"),n=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),E()}catch(s){o.disabled=!1,o.textContent="Sign in with GitHub",n.textContent=String(s)}}),a.addEventListener("click",()=>{E(),t.onCancel()}),e.addEventListener("click",s=>{s.target===e&&(E(),t.onCancel())})}function E(){let t=document.getElementById(K);t&&t.remove()}function Se(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,a=m=>m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function n(m,x){return`<span class="${m}">${x}</span>`}let s=0,l=2,c=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function _(){return" ".repeat(s*l)}let u=[],h;for(e.lastIndex=0;(h=e.exec(t))!==null;){let m=h[0],x=h[1];if(m.startsWith("<!--")||m.startsWith("<!")){u.push(_()+n("fo-hd",a(m))+`
`);continue}if(!m.startsWith("<")){let i=m.trim();i&&u.push(_()+a(i)+`
`);continue}let y=m.startsWith("</"),O=m.endsWith("/>")||x&&c.has(x.toLowerCase());y&&(s=Math.max(0,s-1));let k=n("fo-hp","&lt;")+(y?n("fo-hp","/"):"");k+=n("fo-ht",a(x??""));let T=h[2]??"";if(T.trim()){o.lastIndex=0;let i;for(;(i=o.exec(T))!==null;){let r=i[1],d=i[2]??"";if(k+=" "+n("fo-ha",a(r)),d){let g=d.indexOf("="),p=d.slice(g+1).trim();k+=n("fo-hp","=")+n("fo-hv",a(p))}}}k+=O&&!y?n("fo-hp"," /&gt;"):n("fo-hp","&gt;"),u.push(_()+k+`
`),!y&&!O&&s++}return u.join("").trimEnd()}function L(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let e=X(),o=new R(e),a=new B(e,o);o.setOnUnauthorized(()=>a.logout()),ee(),Q(async i=>{i==="active"?n():i==="idle"&&s()});function n(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",u,!0),o.listBadges(window.location.href).then(i=>N(i,h)).catch(()=>{})}function s(){document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",u,!0),Y(),J(),E()}function l(i){let r=i.target;!r||r===document.body||r===document.documentElement||c(r)||se(r)}function c(i){return i.id.startsWith("__fo_")}async function _(i){let r=F(i),d=G(r),g=m(r);if(M("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",u,!0),Y(),a.isAuthenticated()||await new Promise((C,w)=>{pe({onLogin:async()=>{await a.login(),C()},onCancel:()=>{M("idle"),w(new Error("cancelled"))}})}).catch(()=>{}),!a.isAuthenticated())return;let p=a.getUser(),S=(await o.listComments(window.location.href).catch(()=>[])).filter(C=>C.selector===d);M("commenting");let f=g.dataComponent??d.split(">").pop()?.trim()??d,v=S.length>0?`Feedback: ${S.length+1} comments on ${f}`:`Feedback on ${f}`;ue({selector:d,existingComments:S,context:g,user:p,defaultIssueTopic:v,onSubmit:async(C,w)=>{let $=await o.createFeedback({url:window.location.href,selector:d,comment:C,context:g,repo:e.repo,label:e.label,feedbackType:w}),q=await o.listBadges(window.location.href).catch(()=>[]);return N(q,h),M("active"),$.id},onExport:async(C,w,$)=>{let q=await o.exportIssue({ids:C,repo:e.repo,labels:[e.label,w],title:$});window.open(q.issue_url,"_blank");let me=await o.listBadges(window.location.href).catch(()=>[]);N(me,h),M("active")},onCancel:()=>{M("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",u,!0)}})}async function u(i){let r=i.target;!r||c(r)||(i.preventDefault(),i.stopPropagation(),Z()==="active"&&await _(r))}function h(i,r){let d=null;try{d=document.querySelector(r)}catch{}d&&_(d)}function m(i){let r=i.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:i.tagName.toLowerCase(),dataComponent:x(i)??void 0,outerHTML:i.outerHTML?.slice(0,4e3)??"",innerText:i.innerText?.slice(0,200)??"",attributes:y(i),cssFramework:T(i),computedStyles:k(i),boundingRect:{top:Math.round(r.top),left:Math.round(r.left),width:Math.round(r.width),height:Math.round(r.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function x(i){let r=i,d=[];for(;r&&r!==document.documentElement;){let g=r.getAttribute("data-component");if(g)return[g,...d.reverse()].join(" > ");d.push(r.tagName.toLowerCase()),r=r.parentElement}return null}function y(i){let r={};for(let d of Array.from(i.attributes))d.value.length<200&&(r[d.name]=d.value);return r}let O=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function k(i){let r=window.getComputedStyle(i),d={};for(let g of O){let p=r.getPropertyValue(g.replace(/([A-Z])/g,b=>`-${b.toLowerCase()}`)).trim();p&&p!=="none"&&p!=="normal"&&p!=="auto"&&p!=="0px"&&(d[g]=p)}return d}function T(i){let r=Array.from(i.classList).join(" "),d=i,g=[];for(let S=0;S<6&&d;S++)g.push(...Array.from(d.classList)),d=d.parentElement;let p=g.join(" "),b=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(p)&&b.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(r)&&b.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(p)&&b.push("Bootstrap"),/\bMui[A-Z]/.test(p)&&b.push("Material UI"),/\bchakra-/.test(p)&&b.push("Chakra UI"),(i.hasAttribute("data-radix-collection-item")||/\bradix-/.test(p))&&b.push("Radix UI"),b.includes("Tailwind CSS")&&b.includes("Radix UI")&&b.push("shadcn/ui"),b}})();})();
