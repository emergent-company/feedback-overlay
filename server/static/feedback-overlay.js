"use strict";var FeedbackOverlay=(()=>{function Se(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function se(){let t=Se(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",a=t?.dataset.label??"feedback",n=t?.dataset.hotkey?.toLowerCase()??"",c=["alt+shift","ctrl+shift","meta+shift"].includes(n)?n:"alt+shift";o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag.");let f=t?.dataset.branch?.trim()||void 0,m=t?.dataset.version?.trim()||void 0;return{apiBase:e,repo:o,label:a,hotkey:c,branch:f,version:m}}var q=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let a=(o.method??"GET").toUpperCase(),n=a!=="GET"&&a!=="HEAD"?{"Content-Type":"application/json"}:{},l=await fetch(this.base+e,{...o,headers:{...n,...this.authHeaders(),...o.headers??{}}});if(!l.ok){l.status===401&&this.onUnauthorized&&this.onUnauthorized();let c=await l.text().catch(()=>l.statusText);throw new Error(`${l.status}: ${c}`)}return l.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var Le="feedback_overlay_auth",ee="__fo_user__",W=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let a=`${this.config.apiBase}/auth/github`,n=window.open(a,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!n){o(new Error("Popup was blocked. Please allow popups for this site."));return}let l=setTimeout(()=>{f(),o(new Error("Authentication timed out."))},300*1e3),c=_=>{if(_.data?.type!==Le)return;clearTimeout(l),f();let{token:x,login:u,avatar:y}=_.data;this.api.setToken(x),this.user={login:u,avatarUrl:y},this.saveUser(this.user),e(this.user)},f=()=>{window.removeEventListener("message",c),this.messageHandler=null,n.closed||n.close()};this.messageHandler=c,window.addEventListener("message",c);let m=setInterval(()=>{n.closed&&(clearInterval(m),this.messageHandler===c&&(f(),clearTimeout(l),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(ee,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(ee);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(ee)}catch{}}};var T="idle",G=[],R="Alt",le="Shift",U=!1,D=!1,Y=!1;function F(t){T!==t&&(T=t,G.forEach(e=>e(t)))}function ce(){return T}function de(t){return G.push(t),()=>{G=G.filter(e=>e!==t)}}function H(t){F(t)}function fe(t){switch(t.hotkey){case"ctrl+shift":R="Control";break;case"meta+shift":R="Meta";break;case"alt+shift":default:R="Alt";break}window.addEventListener("keydown",Te,!0),window.addEventListener("keyup",Me,!0),window.addEventListener("blur",$e)}function Te(t){if(t.key==="Escape"&&(T==="active"||T==="capturing")){F("idle");return}t.key===R&&(U=!0),t.key===le&&(D=!0),U&&D&&!Y&&(Y=!0,T==="idle"?F("active"):T==="active"&&F("idle"))}function Me(t){t.key===R&&(U=!1),t.key===le&&(D=!1),(!U||!D)&&(Y=!1)}function $e(){U=!1,D=!1,Y=!1,T==="active"&&F("idle")}function te(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let a=o.getAttribute("data-testid");if(a){e.unshift(`[data-testid="${CSS.escape(a)}"]`);break}if(o.id&&!Ie(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}let n=o.getAttribute("data-component");if(n){let f=o.parentElement;if(f){let m=Array.from(f.children).filter(_=>_.getAttribute("data-component")===n);if(m.length>1){let _=m.indexOf(o)+1;e.unshift(`[data-component="${CSS.escape(n)}"]:nth-of-type(${m.indexOf(o)+1})`);let u=Array.from(f.children).filter(y=>y.tagName===o.tagName).indexOf(o)+1;e[0]=`[data-component="${CSS.escape(n)}"]:nth-of-type(${u})`}else e.unshift(`[data-component="${CSS.escape(n)}"]`);if(f.getAttribute("data-component")){let _=f.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(_)}"]`);break}o=f;continue}else{e.unshift(`[data-component="${CSS.escape(n)}"]`);break}}let l=o.parentElement,c=o.tagName.toLowerCase();if(l){let f=Array.from(l.children).filter(m=>m.tagName===o.tagName);if(f.length>1){let m=f.indexOf(o)+1;e.unshift(`${c}:nth-of-type(${m})`)}else e.unshift(c)}else e.unshift(c);o=l}return e.join(" > ")}function Ie(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function pe(t){let e=t;for(;e&&e!==document.documentElement;){let o=e.getAttribute("data-component");if(o)return o;e=e.parentElement}return null}function ue(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let c=e.getAttribute("data-component");if(c)return[c,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let a=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",l=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${a}${n}${l}>`}var ge="__fo_highlight__",_e="__fo_tooltip__",Oe="#22c55e",Ae="rgba(34, 197, 94, 0.08)",He="#4f86f7",Pe="rgba(79, 134, 247, 0.08)",he=null;function me(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function be(t){he=t;let e=t.getBoundingClientRect(),o=window.scrollX,a=window.scrollY,n=pe(t)!==null,l=n?Oe:He,c=n?Ae:Pe,f=me(ge);Object.assign(f.style,{position:"absolute",top:`${e.top+a}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:`2px solid ${l}`,backgroundColor:c,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let m=ue(t),_=me(_e);_.textContent=m;let x=Math.min(e.left+o,window.innerWidth+o-(m.length*7+16));Object.assign(_.style,{position:"absolute",top:`${e.top+a-26}px`,left:`${Math.max(4,x)}px`,background:l,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function oe(){he=null,document.getElementById(ge)?.remove(),document.getElementById(_e)?.remove()}var Be="__fo_badge__",K=[],V=null;function ne(){K.forEach(t=>t.remove()),K=[],V?.disconnect(),V=null}function J(t,e){ne(),t.forEach((a,n)=>{let l=null;try{l=document.querySelector(a.selector)}catch{return}if(!l)return;let c=document.createElement("div");c.id=`${Be}${n}`,c.textContent=String(a.count),c.title=`${a.count} comment${a.count!==1?"s":""} on this element`,Object.assign(c.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),c.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),e(a.ids,a.selector)}),document.body.appendChild(c),K.push(c),xe(c,l)});let o=()=>{K.forEach((a,n)=>{let l=t[n];if(!l)return;let c=null;try{c=document.querySelector(l.selector)}catch{return}c&&xe(a,c)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),V=new ResizeObserver(o),V.observe(document.body)}function xe(t,e){let o=e.getBoundingClientRect(),a=window.scrollX,n=window.scrollY;t.style.top=`${o.top+n-8}px`,t.style.left=`${o.right+a-8}px`}var ie="__fo_dialog__",ye="__fo_styles__";function ve(){if(document.getElementById(ye))return;let t=document.createElement("style");t.id=ye,t.textContent=`
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
  `,document.head.appendChild(t)}function we(){let t=document.getElementById(ie);return t||(t=document.createElement("div"),t.id=ie,document.body.appendChild(t)),t}function ke(t){ve();let e=we(),o=t.existingComments,a=o.map(s=>s.id),n=t.context,l=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(s=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${E(s.github_user)}</span>
            <span class="fo-comment-date">${E(s.created_at)}</span>
          </div>
          <div class="fo-comment-text">${E(s.comment)}</div>
        </div>`).join("")}
    </div>`,c=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",f=[];t.repo&&f.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">repo</span>${E(t.repo)}</span>`),t.branch&&f.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">branch</span>${E(t.branch)}</span>`),t.appVersion&&f.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">version</span>${E(t.appVersion)}</span>`);let m=f.length>0?`<div class="fo-target-strip">${f.join("")}</div>`:"",_=t.componentHierarchy??[],x=_.length>1?`
    <div class="fo-component-row">
      <span class="fo-component-label">Component</span>
      <select class="fo-component-select" id="__fo_component__">
        ${_.map((s,b)=>`<option value="${b}" ${b===(t.selectedComponentIdx??0)?"selected":""}>
          ${s.isChild?"\u21B3 ":""}${E(s.name)}
        </option>`).join("")}
      </select>
    </div>`:"",u=[],y=n.dataComponent;y&&u.push(["component",y]),u.push(["selector",t.selector]);let w=n.boundingRect;w&&u.push(["position",`top ${w.top}, left ${w.left} \u2014 ${w.width} \xD7 ${w.height} px`]),u.push(["url",String(n.url??window.location.href)]);let L=n.viewport,C=n.devicePixelRatio;L&&u.push(["viewport",`${L.width} \xD7 ${L.height} px${C&&C!==1?` (${C}\xD7 DPR)`:""}`]);let $=n.cssFramework;$?.length&&u.push(["css framework",$.join(", ")]);let k=n.computedStyles;if(k){let s=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(b=>k[b]).map(b=>`${b}: ${k[b]}`).join(`
`);s&&u.push(["computed styles",s])}let r=String(n.userAgent??navigator.userAgent);u.push(["user agent",r]);let i=u.map(([s,b])=>`
    <div class="fo-meta-key">${E(s)}</div>
    <div class="fo-meta-val">${E(b)}</div>`).join(""),d=n.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${c}</h2>
          <div class="fo-user-pill">
            <img src="${E(t.user.avatarUrl)}" alt="">
            <span>${E(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${i}</div>
        </details>
        ${d?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Re(d)}</pre>
        </details>`:""}
      </div>
      ${x}
      ${m}
      ${l}
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
  `;let h=e.querySelector("#__fo_comment__"),p=e.querySelector("#__fo_submit__"),g=e.querySelector("#__fo_cancel__"),v=e.querySelector("#__fo_export__"),I=e.querySelector("#__fo_err__"),O=e.querySelector("#__fo_component__");O&&t.onComponentChange&&O.addEventListener("change",()=>{t.onComponentChange(parseInt(O.value,10))});let Q=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",N=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;h.focus(),g.addEventListener("click",()=>{S(),t.onCancel()}),p.addEventListener("click",async()=>{let s=h.value.trim();if(!s){I.textContent="Please enter a comment.";return}p.disabled=!0,p.textContent="Submitting\u2026",I.textContent="";try{await t.onSubmit(s,Q()),S()}catch(b){I.textContent=String(b),p.disabled=!1,p.textContent="Submit"}}),v.addEventListener("click",async()=>{v.disabled=!0,v.textContent="Exporting\u2026",p.disabled=!0,I.textContent="";try{let s=h.value.trim(),b=Q(),B=N(),A=[...a];if(s){let z=await t.onSubmit(s,b);A=[...A,z]}if(A.length===0){I.textContent="Nothing to export \u2014 add a comment first.",v.disabled=!1,v.textContent="Send to GitHub",p.disabled=!1;return}S(),t.onExport(A,b,B).catch(z=>{re(`Failed to create issue: ${String(z)}`)})}catch(s){I.textContent=String(s),v.disabled=!1,v.textContent="Send to GitHub",p.disabled=!1}}),e.addEventListener("click",s=>{s.target===e&&(S(),t.onCancel())});let j=s=>{s.key==="Escape"&&(S(),t.onCancel(),document.removeEventListener("keydown",j))};document.addEventListener("keydown",j)}function Ee(t){ve();let e=we();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),a=e.querySelector("#__fo_cancel__"),n=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),S()}catch(l){o.disabled=!1,o.textContent="Sign in with GitHub",n.textContent=String(l)}}),a.addEventListener("click",()=>{S(),t.onCancel()}),e.addEventListener("click",l=>{l.target===e&&(S(),t.onCancel())})}function S(){let t=document.getElementById(ie);t&&t.remove()}var P="__fo_toast__";function ze(){if(document.getElementById(P+"_styles"))return;let t=document.createElement("style");t.id=P+"_styles",t.textContent=`
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
  `,document.head.appendChild(t)}function re(t){ze();let e=document.getElementById(P);e||(e=document.createElement("div"),e.id=P,document.body.appendChild(e)),e.textContent=t,e.classList.add("fo-visible"),clearTimeout(e.__fo_toast_timer),e.__fo_toast_timer=setTimeout(()=>{e.classList.remove("fo-visible")},3e3)}function Re(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,a=u=>u.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function n(u,y){return`<span class="${u}">${y}</span>`}let l=0,c=2,f=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function m(){return" ".repeat(l*c)}let _=[],x;for(e.lastIndex=0;(x=e.exec(t))!==null;){let u=x[0],y=x[1];if(u.startsWith("<!--")||u.startsWith("<!")){_.push(m()+n("fo-hd",a(u))+`
`);continue}if(!u.startsWith("<")){let k=u.trim();k&&_.push(m()+a(k)+`
`);continue}let w=u.startsWith("</"),L=u.endsWith("/>")||y&&f.has(y.toLowerCase());w&&(l=Math.max(0,l-1));let C=n("fo-hp","&lt;")+(w?n("fo-hp","/"):"");C+=n("fo-ht",a(y??""));let $=x[2]??"";if($.trim()){o.lastIndex=0;let k;for(;(k=o.exec($))!==null;){let r=k[1],i=k[2]??"";if(C+=" "+n("fo-ha",a(r)),i){let d=i.indexOf("="),h=i.slice(d+1).trim();C+=n("fo-hp","=")+n("fo-hv",a(h))}}}C+=L&&!w?n("fo-hp"," /&gt;"):n("fo-hp","&gt;"),_.push(m()+C+`
`),!w&&!L&&l++}return _.join("").trimEnd()}function E(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Z="__fo_indicator__",Fe=`
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
`;function Ue(t){let e=/Mac|iPhone|iPad|iPod/.test(navigator.platform);switch(t){case"ctrl+shift":return"Ctrl+Shift";case"meta+shift":return e?"\u2318+Shift":"Win+Shift";case"alt+shift":default:return e?"\u2325+Shift":"Alt+Shift"}}var X=null,M=null;function Ce(t){X||(X=document.createElement("style"),X.textContent=Fe,document.head.appendChild(X)),M||(M=document.createElement("div"),M.id=Z,document.body.appendChild(M));let e=Ue(t);M.innerHTML=`<span class="fo-bar-dot"></span>Comment mode\u2002\u2014\u2002press\xA0<span class="fo-bar-key">${e}</span>\xA0to exit`,M.style.display="flex"}function ae(){M&&(M.style.display="none")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let e=se(),o=new q(e),a=new W(e,o);o.setOnUnauthorized(()=>a.logout()),fe(e),de(async r=>{r==="active"?(Ce(e.hotkey),n()):r==="idle"?(ae(),l()):(r==="capturing"||r==="commenting")&&ae()});function n(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",c,!0),document.addEventListener("click",_,!0),o.listBadges(window.location.href).then(r=>J(r,x)).catch(()=>{})}function l(){document.body.style.cursor="",document.removeEventListener("mouseover",c,!0),document.removeEventListener("click",_,!0),oe(),ne(),S()}function c(r){let i=r.target;!i||i===document.body||i===document.documentElement||f(i)||be(i)}function f(r){return r.id.startsWith("__fo_")}async function m(r){let i=te(r),d=y(r),h=u(r),p=h.findIndex(s=>!r.closest("[data-component]")||s.element===r.closest("[data-component]")),g=p>=0?p:0;if(H("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",c,!0),document.removeEventListener("click",_,!0),oe(),a.isAuthenticated()||await new Promise((s,b)=>{Ee({onLogin:async()=>{await a.login(),s()},onCancel:()=>{H("idle"),b(new Error("cancelled"))}})}).catch(()=>{}),!a.isAuthenticated())return;let v=a.getUser(),O=(await o.listComments(window.location.href).catch(()=>[])).filter(s=>s.selector===i);H("commenting");let N=d.dataComponent??i.split(">").pop()?.trim()??i,j=O.length>0?`Feedback: ${O.length+1} comments on ${N}`:`Feedback on ${N}`;ke({selector:i,existingComments:O,context:d,user:v,defaultIssueTopic:j,repo:e.repo,branch:e.branch,appVersion:e.version,componentHierarchy:h.map((s,b)=>({name:s.name,isChild:b>g})),selectedComponentIdx:g,onComponentChange:s=>{S(),m(h[s].element)},onSubmit:async(s,b)=>{let B=await o.createFeedback({url:window.location.href,selector:i,comment:s,context:d,repo:e.repo,label:e.label,feedbackType:b}),A=await o.listBadges(window.location.href).catch(()=>[]);return J(A,x),H("active"),B.id},onExport:async(s,b,B)=>{let A=await o.exportIssue({ids:s,repo:e.repo,labels:[e.label,b],title:B});re("Issue created successfully!");let z=await o.listBadges(window.location.href).catch(()=>[]);J(z,x),H("active")},onCancel:()=>{H("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",c,!0),document.addEventListener("click",_,!0)}})}async function _(r){let i=r.target;!i||f(i)||(r.preventDefault(),r.stopPropagation(),ce()==="active"&&await m(i))}function x(r,i){let d=null;try{d=document.querySelector(i)}catch{}d&&m(d)}function u(r){let i=[],d=r;for(;d&&d!==document.documentElement;){let g=d.getAttribute("data-component");g&&i.push({name:g,element:d}),d=d.parentElement}i.reverse();let h=i.length>0?i[i.length-1].element:null,p=[];return h&&h.querySelectorAll("[data-component]").forEach(g=>{g.parentElement?.closest("[data-component]")===h&&p.push({name:g.getAttribute("data-component"),element:g})}),[...i,...p]}function y(r){let i=r.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:r.tagName.toLowerCase(),dataComponent:w(r)??void 0,outerHTML:r.outerHTML?.slice(0,4e3)??"",innerText:r.innerText?.slice(0,200)??"",attributes:L(r),cssFramework:k(r),computedStyles:$(r),boundingRect:{top:Math.round(i.top),left:Math.round(i.left),width:Math.round(i.width),height:Math.round(i.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString(),...e.branch?{branch:e.branch}:{},...e.version?{appVersion:e.version}:{}}}function w(r){let i=r,d=[];for(;i&&i!==document.documentElement;){let h=i.getAttribute("data-component");if(h)return[h,...d.reverse()].join(" > ");d.push(i.tagName.toLowerCase()),i=i.parentElement}return null}function L(r){let i={};for(let d of Array.from(r.attributes))d.value.length<200&&(i[d.name]=d.value);return i}let C=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function $(r){let i=window.getComputedStyle(r),d={};for(let h of C){let p=i.getPropertyValue(h.replace(/([A-Z])/g,g=>`-${g.toLowerCase()}`)).trim();p&&p!=="none"&&p!=="normal"&&p!=="auto"&&p!=="0px"&&(d[h]=p)}return d}function k(r){let i=Array.from(r.classList).join(" "),d=r,h=[];for(let v=0;v<6&&d;v++)h.push(...Array.from(d.classList)),d=d.parentElement;let p=h.join(" "),g=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(p)&&g.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(i)&&g.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(p)&&g.push("Bootstrap"),/\bMui[A-Z]/.test(p)&&g.push("Material UI"),/\bchakra-/.test(p)&&g.push("Chakra UI"),(r.hasAttribute("data-radix-collection-item")||/\bradix-/.test(p))&&g.push("Radix UI"),g.includes("Tailwind CSS")&&g.includes("Radix UI")&&g.push("shadcn/ui"),g}})();})();
