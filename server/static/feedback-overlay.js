"use strict";var FeedbackOverlay=(()=>{function pe(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function J(){let t=pe(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",a=t?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:e,repo:o,label:a}}var P=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let a=(o.method??"GET").toUpperCase(),r=a!=="GET"&&a!=="HEAD"?{"Content-Type":"application/json"}:{},s=await fetch(this.base+e,{...o,headers:{...r,...this.authHeaders(),...o.headers??{}}});if(!s.ok){s.status===401&&this.onUnauthorized&&this.onUnauthorized();let l=await s.text().catch(()=>s.statusText);throw new Error(`${s.status}: ${l}`)}return s.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var ge="feedback_overlay_auth",j="__fo_user__",R=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let a=`${this.config.apiBase}/auth/github`,r=window.open(a,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!r){o(new Error("Popup was blocked. Please allow popups for this site."));return}let s=setTimeout(()=>{d(),o(new Error("Authentication timed out."))},300*1e3),l=h=>{if(h.data?.type!==ge)return;clearTimeout(s),d();let{token:b,login:g,avatar:x}=h.data;this.api.setToken(b),this.user={login:g,avatarUrl:x},this.saveUser(this.user),e(this.user)},d=()=>{window.removeEventListener("message",l),this.messageHandler=null,r.closed||r.close()};this.messageHandler=l,window.addEventListener("message",l);let v=setInterval(()=>{r.closed&&(clearInterval(v),this.messageHandler===l&&(d(),clearTimeout(s),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(j,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(j);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(j)}catch{}}};var K="Shift",M="idle",z=[],A=!1,B=!1;function F(t){M!==t&&(M=t,z.forEach(e=>e(t)))}function X(){return M}function V(t){return z.push(t),()=>{z=z.filter(e=>e!==t)}}function L(t){F(t)}function Z(){window.addEventListener("keydown",me,!0),window.addEventListener("keyup",_e,!0),window.addEventListener("blur",he)}function me(t){t.key==="Alt"&&(A=!0),t.key===K&&(B=!0),A&&B&&M==="idle"&&F("active")}function _e(t){t.key==="Alt"&&(A=!1),t.key===K&&(B=!1),!A&&!B&&M==="active"&&F("idle")}function he(){A=!1,B=!1,M==="active"&&F("idle")}function q(t){let e=t.getAttribute("data-testid");return e?`[data-testid="${CSS.escape(e)}"]`:t.id&&!Q(t.id)?`#${CSS.escape(t.id)}`:be(t)}function Q(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function be(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let a=o.tagName.toLowerCase(),r=o.parentElement,s=o.getAttribute("data-testid");if(s){e.unshift(`[data-testid="${CSS.escape(s)}"]`);break}if(o.id&&!Q(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}if(r){let l=Array.from(r.children).filter(d=>d.tagName===o.tagName);if(l.length>1){let d=l.indexOf(o)+1;e.unshift(`${a}:nth-of-type(${d})`)}else e.unshift(a)}else e.unshift(a);o=r}return e.join(" > ")}function ee(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let l=e.getAttribute("data-component");if(l)return[l,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let a=t.tagName.toLowerCase(),r=t.id?`#${t.id}`:"",s=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${a}${r}${s}>`}var oe="__fo_highlight__",ne="__fo_tooltip__",ie=null;function te(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function re(t){ie=t;let e=t.getBoundingClientRect(),o=window.scrollX,a=window.scrollY,r=te(oe);Object.assign(r.style,{position:"absolute",top:`${e.top+a}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let s=te(ne);s.textContent=ee(t),Object.assign(s.style,{position:"absolute",top:`${e.top+a-28}px`,left:`${e.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function W(){ie=null,document.getElementById(oe)?.remove(),document.getElementById(ne)?.remove()}var xe="__fo_badge__",U=[],D=null;function G(){U.forEach(t=>t.remove()),U=[],D?.disconnect(),D=null}function N(t,e){G(),t.forEach((a,r)=>{let s=null;try{s=document.querySelector(a.selector)}catch{return}if(!s)return;let l=document.createElement("div");l.id=`${xe}${r}`,l.textContent=String(a.count),l.title=`${a.count} comment${a.count!==1?"s":""} on this element`,Object.assign(l.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),l.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault(),e(a.ids,a.selector)}),document.body.appendChild(l),U.push(l),ae(l,s)});let o=()=>{U.forEach((a,r)=>{let s=t[r];if(!s)return;let l=null;try{l=document.querySelector(s.selector)}catch{return}l&&ae(a,l)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),D=new ResizeObserver(o),D.observe(document.body)}function ae(t,e){let o=e.getBoundingClientRect(),a=window.scrollX,r=window.scrollY;t.style.top=`${o.top+r-8}px`,t.style.left=`${o.right+a-8}px`}var Y="__fo_dialog__",se="__fo_styles__";function le(){if(document.getElementById(se))return;let t=document.createElement("style");t.id=se,t.textContent=`
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
  `,document.head.appendChild(t)}function ce(){let t=document.getElementById(Y);return t||(t=document.createElement("div"),t.id=Y,document.body.appendChild(t)),t}function de(t){le();let e=ce(),o=t.existingComments,a=o.map(f=>f.id),r=t.context,s=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(f=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${S(f.github_user)}</span>
            <span class="fo-comment-date">${S(f.created_at)}</span>
          </div>
          <div class="fo-comment-text">${S(f.comment)}</div>
        </div>`).join("")}
    </div>`,l=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",d=[],v=r.dataComponent;v&&d.push(["component",v]),d.push(["selector",t.selector]);let h=r.boundingRect;h&&d.push(["position",`top ${h.top}, left ${h.left} \u2014 ${h.width} \xD7 ${h.height} px`]),d.push(["url",String(r.url??window.location.href)]);let b=r.viewport,g=r.devicePixelRatio;b&&d.push(["viewport",`${b.width} \xD7 ${b.height} px${g&&g!==1?` (${g}\xD7 DPR)`:""}`]);let x=r.cssFramework;x?.length&&d.push(["css framework",x.join(", ")]);let y=r.computedStyles;if(y){let f=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(_=>y[_]).map(_=>`${_}: ${y[_]}`).join(`
`);f&&d.push(["computed styles",f])}let I=String(r.userAgent??navigator.userAgent);d.push(["user agent",I]);let k=d.map(([f,_])=>`
    <div class="fo-meta-key">${S(f)}</div>
    <div class="fo-meta-val">${S(_)}</div>`).join(""),C=r.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${l}</h2>
          <div class="fo-user-pill">
            <img src="${S(t.user.avatarUrl)}" alt="">
            <span>${S(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${k}</div>
        </details>
        ${C?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${ve(C)}</pre>
        </details>`:""}
      </div>
      ${s}
      <div class="fo-compose">
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${S(t.defaultIssueTopic)}">
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
  `;let i=e.querySelector("#__fo_comment__"),n=e.querySelector("#__fo_submit__"),c=e.querySelector("#__fo_cancel__"),p=e.querySelector("#__fo_export__"),u=e.querySelector("#__fo_err__"),m=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",$=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;i.focus(),c.addEventListener("click",()=>{w(),t.onCancel()}),n.addEventListener("click",async()=>{let f=i.value.trim();if(!f){u.textContent="Please enter a comment.";return}n.disabled=!0,n.textContent="Submitting\u2026",u.textContent="";try{await t.onSubmit(f,m()),w()}catch(_){u.textContent=String(_),n.disabled=!1,n.textContent="Submit"}}),p.addEventListener("click",async()=>{p.disabled=!0,p.textContent="Exporting\u2026",n.disabled=!0,u.textContent="";try{let f=i.value.trim(),_=m(),T=$(),E=[...a];if(f){let O=await t.onSubmit(f,_);E=[...E,O]}if(E.length===0){u.textContent="Nothing to export \u2014 add a comment first.",p.disabled=!1,p.textContent="Send to GitHub",n.disabled=!1;return}await t.onExport(E,_,T),w()}catch(f){u.textContent=String(f),p.disabled=!1,p.textContent="Send to GitHub",n.disabled=!1}}),e.addEventListener("click",f=>{f.target===e&&(w(),t.onCancel())});let H=f=>{f.key==="Escape"&&(w(),t.onCancel(),document.removeEventListener("keydown",H))};document.addEventListener("keydown",H)}function fe(t){le();let e=ce();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),a=e.querySelector("#__fo_cancel__"),r=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),w()}catch(s){o.disabled=!1,o.textContent="Sign in with GitHub",r.textContent=String(s)}}),a.addEventListener("click",()=>{w(),t.onCancel()}),e.addEventListener("click",s=>{s.target===e&&(w(),t.onCancel())})}function w(){let t=document.getElementById(Y);t&&t.remove()}function ve(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,a=g=>g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function r(g,x){return`<span class="${g}">${x}</span>`}let s=0,l=2,d=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function v(){return" ".repeat(s*l)}let h=[],b;for(e.lastIndex=0;(b=e.exec(t))!==null;){let g=b[0],x=b[1];if(g.startsWith("<!--")||g.startsWith("<!")){h.push(v()+r("fo-hd",a(g))+`
`);continue}if(!g.startsWith("<")){let i=g.trim();i&&h.push(v()+a(i)+`
`);continue}let y=g.startsWith("</"),I=g.endsWith("/>")||x&&d.has(x.toLowerCase());y&&(s=Math.max(0,s-1));let k=r("fo-hp","&lt;")+(y?r("fo-hp","/"):"");k+=r("fo-ht",a(x??""));let C=b[2]??"";if(C.trim()){o.lastIndex=0;let i;for(;(i=o.exec(C))!==null;){let n=i[1],c=i[2]??"";if(k+=" "+r("fo-ha",a(n)),c){let p=c.indexOf("="),u=c.slice(p+1).trim();k+=r("fo-hp","=")+r("fo-hv",a(u))}}}k+=I&&!y?r("fo-hp"," /&gt;"):r("fo-hp","&gt;"),h.push(v()+k+`
`),!y&&!I&&s++}return h.join("").trimEnd()}function S(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let e=J(),o=new P(e),a=new R(e,o);o.setOnUnauthorized(()=>a.logout()),Z(),V(async i=>{i==="active"?r():i==="idle"&&s()});function r(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",h,!0),o.listBadges(window.location.href).then(i=>N(i,b)).catch(()=>{})}function s(){document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",h,!0),W(),G(),w()}function l(i){let n=i.target;!n||n===document.body||n===document.documentElement||d(n)||re(n)}function d(i){return i.id.startsWith("__fo_")}async function v(i){let n=q(i),c=g(i);if(L("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",h,!0),W(),a.isAuthenticated()||await new Promise((_,T)=>{fe({onLogin:async()=>{await a.login(),_()},onCancel:()=>{L("idle"),T(new Error("cancelled"))}})}).catch(()=>{}),!a.isAuthenticated())return;let p=a.getUser(),m=(await o.listComments(window.location.href).catch(()=>[])).filter(_=>_.selector===n);L("commenting");let H=c.dataComponent??n.split(">").pop()?.trim()??n,f=m.length>0?`Feedback: ${m.length+1} comments on ${H}`:`Feedback on ${H}`;de({selector:n,existingComments:m,context:c,user:p,defaultIssueTopic:f,onSubmit:async(_,T)=>{let E=await o.createFeedback({url:window.location.href,selector:n,comment:_,context:c,repo:e.repo,label:e.label,feedbackType:T}),O=await o.listBadges(window.location.href).catch(()=>[]);return N(O,b),L("active"),E.id},onExport:async(_,T,E)=>{let O=await o.exportIssue({ids:_,repo:e.repo,labels:[e.label,T],title:E});window.open(O.issue_url,"_blank");let ue=await o.listBadges(window.location.href).catch(()=>[]);N(ue,b),L("active")},onCancel:()=>{L("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",h,!0)}})}async function h(i){let n=i.target;!n||d(n)||(i.preventDefault(),i.stopPropagation(),X()==="active"&&await v(n))}function b(i,n){let c=null;try{c=document.querySelector(n)}catch{}c&&v(c)}function g(i){let n=i.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:i.tagName.toLowerCase(),dataComponent:x(i)??void 0,outerHTML:i.outerHTML?.slice(0,4e3)??"",innerText:i.innerText?.slice(0,200)??"",attributes:y(i),cssFramework:C(i),computedStyles:k(i),boundingRect:{top:Math.round(n.top),left:Math.round(n.left),width:Math.round(n.width),height:Math.round(n.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function x(i){let n=i,c=[];for(;n&&n!==document.documentElement;){let p=n.getAttribute("data-component");if(p)return[p,...c.reverse()].join(" > ");c.push(n.tagName.toLowerCase()),n=n.parentElement}return null}function y(i){let n={};for(let c of Array.from(i.attributes))c.value.length<200&&(n[c.name]=c.value);return n}let I=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function k(i){let n=window.getComputedStyle(i),c={};for(let p of I){let u=n.getPropertyValue(p.replace(/([A-Z])/g,m=>`-${m.toLowerCase()}`)).trim();u&&u!=="none"&&u!=="normal"&&u!=="auto"&&u!=="0px"&&(c[p]=u)}return c}function C(i){let n=Array.from(i.classList).join(" "),c=i,p=[];for(let $=0;$<6&&c;$++)p.push(...Array.from(c.classList)),c=c.parentElement;let u=p.join(" "),m=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(u)&&m.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(n)&&m.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(u)&&m.push("Bootstrap"),/\bMui[A-Z]/.test(u)&&m.push("Material UI"),/\bchakra-/.test(u)&&m.push("Chakra UI"),(i.hasAttribute("data-radix-collection-item")||/\bradix-/.test(u))&&m.push("Radix UI"),m.includes("Tailwind CSS")&&m.includes("Radix UI")&&m.push("shadcn/ui"),m}})();})();
