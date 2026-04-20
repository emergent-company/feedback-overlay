"use strict";var FeedbackOverlay=(()=>{function ue(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function Y(){let e=ue(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var H=class{constructor(t){this.token=null;this.onUnauthorized=null;this.base=t.apiBase}setOnUnauthorized(t){this.onUnauthorized=t}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),i=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},a=await fetch(this.base+t,{...o,headers:{...i,...this.authHeaders(),...o.headers??{}}});if(!a.ok){a.status===401&&this.onUnauthorized&&this.onUnauthorized();let c=await a.text().catch(()=>a.statusText);throw new Error(`${a.status}: ${c}`)}return a.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async listComments(t){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}};var pe="feedback_overlay_auth",j="__fo_user__",O=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,i=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!i){o(new Error("Popup was blocked. Please allow popups for this site."));return}let a=setTimeout(()=>{f(),o(new Error("Authentication timed out."))},300*1e3),c=m=>{if(m.data?.type!==pe)return;clearTimeout(a),f();let{token:b,login:k,avatar:S}=m.data;this.api.setToken(b),this.user={login:k,avatarUrl:S},this.saveUser(this.user),t(this.user)},f=()=>{window.removeEventListener("message",c),this.messageHandler=null,i.closed||i.close()};this.messageHandler=c,window.addEventListener("message",c);let w=setInterval(()=>{i.closed&&(clearInterval(w),this.messageHandler===c&&(f(),clearTimeout(a),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(j,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(j);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(j)}catch{}}};var J="Shift",T="idle",A=[],I=!1,$=!1;function B(e){T!==e&&(T=e,A.forEach(t=>t(e)))}function K(){return T}function X(e){return A.push(e),()=>{A=A.filter(t=>t!==e)}}function E(e){B(e)}function V(){window.addEventListener("keydown",ge,!0),window.addEventListener("keyup",me,!0),window.addEventListener("blur",_e)}function ge(e){e.key==="Alt"&&(I=!0),e.key===J&&($=!0),I&&$&&T==="idle"&&B("active")}function me(e){e.key==="Alt"&&(I=!1),e.key===J&&($=!1),!I&&!$&&T==="active"&&B("idle")}function _e(){I=!1,$=!1,T==="active"&&B("idle")}function q(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!Z(e.id)?`#${CSS.escape(e.id)}`:he(e)}function Z(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function he(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),i=o.parentElement,a=o.getAttribute("data-testid");if(a){t.unshift(`[data-testid="${CSS.escape(a)}"]`);break}if(o.id&&!Z(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(i){let c=Array.from(i.children).filter(f=>f.tagName===o.tagName);if(c.length>1){let f=c.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${f})`)}else t.unshift(n)}else t.unshift(n);o=i}return t.join(" > ")}function Q(e){let t=e;for(;t&&t!==document.documentElement;){let a=t.getAttribute("data-component");if(a)return a;t=t.parentElement}let o=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",i=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${o}${n}${i}>`}var te="__fo_highlight__",oe="__fo_tooltip__",ne=null;function ee(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function ie(e){ne=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,i=ee(te);Object.assign(i.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let a=ee(oe);a.textContent=Q(e),Object.assign(a.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function N(){ne=null,document.getElementById(te)?.remove(),document.getElementById(oe)?.remove()}var be="__fo_badge__",z=[],R=null;function G(){z.forEach(e=>e.remove()),z=[],R?.disconnect(),R=null}function P(e,t){G(),e.forEach((n,i)=>{let a=null;try{a=document.querySelector(n.selector)}catch{return}if(!a)return;let c=document.createElement("div");c.id=`${be}${i}`,c.textContent=String(n.count),c.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(c.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),c.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(c),z.push(c),re(c,a)});let o=()=>{z.forEach((n,i)=>{let a=e[i];if(!a)return;let c=null;try{c=document.querySelector(a.selector)}catch{return}c&&re(n,c)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),R=new ResizeObserver(o),R.observe(document.body)}function re(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,i=window.scrollY;e.style.top=`${o.top+i-8}px`,e.style.left=`${o.right+n-8}px`}var W="__fo_dialog__",ae="__fo_styles__";function se(){if(document.getElementById(ae))return;let e=document.createElement("style");e.id=ae,e.textContent=`
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
    #__fo_dialog__ .fo-header h2 {
      margin: 0 0 3px;
      font-size: 14px;
      font-weight: 700;
      color: #0f0f0f;
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
    #__fo_dialog__ .fo-user-bar {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      color: #333;
      font-weight: 500;
      flex-shrink: 0;
    }
    #__fo_dialog__ .fo-user-bar img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid #ddd;
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
      line-height: 1.5;
      white-space: pre;
      overflow: auto;
      max-height: 150px;
      margin: 6px 0 0;
      padding: 6px 8px;
      background: #f5f5f5;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      color: #333;
    }

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
  `,document.head.appendChild(e)}function le(){let e=document.getElementById(W);return e||(e=document.createElement("div"),e.id=W,document.body.appendChild(e)),e}function ce(e){se();let t=le(),o=e.existingComments,n=o.map(l=>l.id),i=e.context,a=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(l=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${v(l.github_user)}</span>
            <span class="fo-comment-date">${v(l.created_at)}</span>
          </div>
          <div class="fo-comment-text">${v(l.comment)}</div>
        </div>`).join("")}
    </div>`,c=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",f=[],w=xe(e.selector,i);w&&f.push(["component",w]),f.push(["selector",e.selector]);let m=i.boundingRect;m&&f.push(["position",`top ${m.top}, left ${m.left} \u2014 ${m.width} \xD7 ${m.height} px`]),f.push(["url",String(i.url??window.location.href)]);let b=i.viewport,k=i.devicePixelRatio;b&&f.push(["viewport",`${b.width} \xD7 ${b.height} px${k&&k!==1?` (${k}\xD7 DPR)`:""}`]);let S=i.cssFramework;S?.length&&f.push(["css framework",S.join(", ")]);let L=i.computedStyles;if(L){let l=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(g=>L[g]).map(g=>`${g}: ${L[g]}`).join(`
`);l&&f.push(["computed styles",l])}let F=String(i.userAgent??navigator.userAgent);f.push(["user agent",F]);let U=f.map(([l,g])=>`
    <div class="fo-meta-key">${v(l)}</div>
    <div class="fo-meta-val">${v(g)}</div>`).join(""),r=i.outerHTML;t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>${c}</h2>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${U}</div>
        </details>
        ${r?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${v(r)}</pre>
        </details>`:""}
      </div>
      ${a}
      <div class="fo-compose">
        <div class="fo-user-bar">
          <img src="${v(e.user.avatarUrl)}" alt="">
          <span>${v(e.user.login)}</span>
        </div>
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${v(e.defaultIssueTopic)}">
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
  `;let s=t.querySelector("#__fo_comment__"),d=t.querySelector("#__fo_submit__"),x=t.querySelector("#__fo_cancel__"),p=t.querySelector("#__fo_export__"),u=t.querySelector("#__fo_err__"),y=()=>t.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",D=()=>t.querySelector("#__fo_topic__")?.value.trim()||e.defaultIssueTopic;s.focus(),x.addEventListener("click",()=>{h(),e.onCancel()}),d.addEventListener("click",async()=>{let l=s.value.trim();if(!l){u.textContent="Please enter a comment.";return}d.disabled=!0,d.textContent="Submitting\u2026",u.textContent="";try{await e.onSubmit(l,y()),h()}catch(g){u.textContent=String(g),d.disabled=!1,d.textContent="Submit"}}),p.addEventListener("click",async()=>{p.disabled=!0,p.textContent="Exporting\u2026",d.disabled=!0,u.textContent="";try{let l=s.value.trim(),g=y(),M=D(),C=[...n];if(l){let fe=await e.onSubmit(l,g);C=[...C,fe]}if(C.length===0){u.textContent="Nothing to export \u2014 add a comment first.",p.disabled=!1,p.textContent="Send to GitHub",d.disabled=!1;return}await e.onExport(C,g,M),h()}catch(l){u.textContent=String(l),p.disabled=!1,p.textContent="Send to GitHub",d.disabled=!1}}),t.addEventListener("click",l=>{l.target===t&&(h(),e.onCancel())});let _=l=>{l.key==="Escape"&&(h(),e.onCancel(),document.removeEventListener("keydown",_))};document.addEventListener("keydown",_)}function de(e){se();let t=le();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__"),i=t.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),h()}catch(a){o.disabled=!1,o.textContent="Sign in with GitHub",i.textContent=String(a)}}),n.addEventListener("click",()=>{h(),e.onCancel()}),t.addEventListener("click",a=>{a.target===t&&(h(),e.onCancel())})}function h(){let e=document.getElementById(W);e&&e.remove()}function xe(e,t){let o=t.attributes;if(o?.["data-component"])return o["data-component"];let n=t.outerHTML;if(n){let i=n.match(/data-component="([^"]+)"/);if(i)return i[1]}return null}function v(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=Y(),o=new H(t),n=new O(t,o);o.setOnUnauthorized(()=>n.logout()),V(),X(async r=>{r==="active"?i():r==="idle"&&a()});function i(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",c,!0),document.addEventListener("click",m,!0),o.listBadges(window.location.href).then(r=>P(r,b)).catch(()=>{})}function a(){document.body.style.cursor="",document.removeEventListener("mouseover",c,!0),document.removeEventListener("click",m,!0),N(),G(),h()}function c(r){let s=r.target;!s||s===document.body||s===document.documentElement||f(s)||ie(s)}function f(r){return r.id.startsWith("__fo_")}async function w(r){let s=q(r),d=k(r);if(E("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",c,!0),document.removeEventListener("click",m,!0),N(),n.isAuthenticated()||await new Promise((_,l)=>{de({onLogin:async()=>{await n.login(),_()},onCancel:()=>{E("idle"),l(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let x=n.getUser(),u=(await o.listComments(window.location.href).catch(()=>[])).filter(_=>_.selector===s);E("commenting");let y=s.split(">").pop()?.trim()??s,D=u.length>0?`Feedback: ${u.length+1} comments on ${y}`:`Feedback on ${y}`;ce({selector:s,existingComments:u,context:d,user:x,defaultIssueTopic:D,onSubmit:async(_,l)=>{let g=await o.createFeedback({url:window.location.href,selector:s,comment:_,context:d,repo:t.repo,label:t.label,feedbackType:l}),M=await o.listBadges(window.location.href).catch(()=>[]);return P(M,b),E("active"),g.id},onExport:async(_,l,g)=>{let M=await o.exportIssue({ids:_,repo:t.repo,labels:[t.label,l],title:g});window.open(M.issue_url,"_blank");let C=await o.listBadges(window.location.href).catch(()=>[]);P(C,b),E("active")},onCancel:()=>{E("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",c,!0),document.addEventListener("click",m,!0)}})}async function m(r){let s=r.target;!s||f(s)||(r.preventDefault(),r.stopPropagation(),K()==="active"&&await w(s))}function b(r,s){let d=null;try{d=document.querySelector(s)}catch{}d&&w(d)}function k(r){let s=r.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:r.tagName.toLowerCase(),outerHTML:r.outerHTML?.slice(0,4e3)??"",innerText:r.innerText?.slice(0,200)??"",attributes:S(r),cssFramework:U(r),computedStyles:F(r),boundingRect:{top:Math.round(s.top),left:Math.round(s.left),width:Math.round(s.width),height:Math.round(s.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function S(r){let s={};for(let d of Array.from(r.attributes))d.value.length<200&&(s[d.name]=d.value);return s}let L=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function F(r){let s=window.getComputedStyle(r),d={};for(let x of L){let p=s.getPropertyValue(x.replace(/([A-Z])/g,u=>`-${u.toLowerCase()}`)).trim();p&&p!=="none"&&p!=="normal"&&p!=="auto"&&p!=="0px"&&(d[x]=p)}return d}function U(r){let s=Array.from(r.classList).join(" "),d=r,x=[];for(let y=0;y<6&&d;y++)x.push(...Array.from(d.classList)),d=d.parentElement;let p=x.join(" "),u=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(p)&&u.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(s)&&u.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(p)&&u.push("Bootstrap"),/\bMui[A-Z]/.test(p)&&u.push("Material UI"),/\bchakra-/.test(p)&&u.push("Chakra UI"),(r.hasAttribute("data-radix-collection-item")||/\bradix-/.test(p))&&u.push("Radix UI"),u.includes("Tailwind CSS")&&u.includes("Radix UI")&&u.push("shadcn/ui"),u}})();})();
