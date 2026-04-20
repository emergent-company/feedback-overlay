"use strict";var FeedbackOverlay=(()=>{function pe(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function J(){let e=pe(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",i=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:i}}var O=class{constructor(t){this.token=null;this.onUnauthorized=null;this.base=t.apiBase}setOnUnauthorized(t){this.onUnauthorized=t}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let i=(o.method??"GET").toUpperCase(),a=i!=="GET"&&i!=="HEAD"?{"Content-Type":"application/json"}:{},s=await fetch(this.base+t,{...o,headers:{...a,...this.authHeaders(),...o.headers??{}}});if(!s.ok){s.status===401&&this.onUnauthorized&&this.onUnauthorized();let l=await s.text().catch(()=>s.statusText);throw new Error(`${s.status}: ${l}`)}return s.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async listComments(t){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}};var ge="feedback_overlay_auth",q="__fo_user__",B=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((t,o)=>{let i=`${this.config.apiBase}/auth/github`,a=window.open(i,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!a){o(new Error("Popup was blocked. Please allow popups for this site."));return}let s=setTimeout(()=>{u(),o(new Error("Authentication timed out."))},300*1e3),l=_=>{if(_.data?.type!==ge)return;clearTimeout(s),u();let{token:b,login:w,avatar:S}=_.data;this.api.setToken(b),this.user={login:w,avatarUrl:S},this.saveUser(this.user),t(this.user)},u=()=>{window.removeEventListener("message",l),this.messageHandler=null,a.closed||a.close()};this.messageHandler=l,window.addEventListener("message",l);let y=setInterval(()=>{a.closed&&(clearInterval(y),this.messageHandler===l&&(u(),clearTimeout(s),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(q,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(q);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(q)}catch{}}};var K="Shift",C="idle",z=[],$=!1,H=!1;function R(e){C!==e&&(C=e,z.forEach(t=>t(e)))}function X(){return C}function V(e){return z.push(e),()=>{z=z.filter(t=>t!==e)}}function E(e){R(e)}function Z(){window.addEventListener("keydown",me,!0),window.addEventListener("keyup",_e,!0),window.addEventListener("blur",he)}function me(e){e.key==="Alt"&&($=!0),e.key===K&&(H=!0),$&&H&&C==="idle"&&R("active")}function _e(e){e.key==="Alt"&&($=!1),e.key===K&&(H=!1),!$&&!H&&C==="active"&&R("idle")}function he(){$=!1,H=!1,C==="active"&&R("idle")}function N(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!Q(e.id)?`#${CSS.escape(e.id)}`:be(e)}function Q(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function be(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let i=o.tagName.toLowerCase(),a=o.parentElement,s=o.getAttribute("data-testid");if(s){t.unshift(`[data-testid="${CSS.escape(s)}"]`);break}if(o.id&&!Q(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(a){let l=Array.from(a.children).filter(u=>u.tagName===o.tagName);if(l.length>1){let u=l.indexOf(o)+1;t.unshift(`${i}:nth-of-type(${u})`)}else t.unshift(i)}else t.unshift(i);o=a}return t.join(" > ")}function ee(e){let t=e;for(;t&&t!==document.documentElement;){let s=t.getAttribute("data-component");if(s)return s;t=t.parentElement}let o=e.tagName.toLowerCase(),i=e.id?`#${e.id}`:"",a=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${o}${i}${a}>`}var oe="__fo_highlight__",ne="__fo_tooltip__",ie=null;function te(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function re(e){ie=e;let t=e.getBoundingClientRect(),o=window.scrollX,i=window.scrollY,a=te(oe);Object.assign(a.style,{position:"absolute",top:`${t.top+i}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let s=te(ne);s.textContent=ee(e),Object.assign(s.style,{position:"absolute",top:`${t.top+i-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function G(){ie=null,document.getElementById(oe)?.remove(),document.getElementById(ne)?.remove()}var xe="__fo_badge__",P=[],F=null;function W(){P.forEach(e=>e.remove()),P=[],F?.disconnect(),F=null}function U(e,t){W(),e.forEach((i,a)=>{let s=null;try{s=document.querySelector(i.selector)}catch{return}if(!s)return;let l=document.createElement("div");l.id=`${xe}${a}`,l.textContent=String(i.count),l.title=`${i.count} comment${i.count!==1?"s":""} on this element`,Object.assign(l.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),l.addEventListener("click",u=>{u.stopPropagation(),u.preventDefault(),t(i.ids,i.selector)}),document.body.appendChild(l),P.push(l),ae(l,s)});let o=()=>{P.forEach((i,a)=>{let s=e[a];if(!s)return;let l=null;try{l=document.querySelector(s.selector)}catch{return}l&&ae(i,l)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),F=new ResizeObserver(o),F.observe(document.body)}function ae(e,t){let o=t.getBoundingClientRect(),i=window.scrollX,a=window.scrollY;e.style.top=`${o.top+a-8}px`,e.style.left=`${o.right+i-8}px`}var Y="__fo_dialog__",se="__fo_styles__";function le(){if(document.getElementById(se))return;let e=document.createElement("style");e.id=se,e.textContent=`
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
  `,document.head.appendChild(e)}function de(){let e=document.getElementById(Y);return e||(e=document.createElement("div"),e.id=Y,document.body.appendChild(e)),e}function ce(e){le();let t=de(),o=e.existingComments,i=o.map(d=>d.id),a=e.context,s=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(d=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${x(d.github_user)}</span>
            <span class="fo-comment-date">${x(d.created_at)}</span>
          </div>
          <div class="fo-comment-text">${x(d.comment)}</div>
        </div>`).join("")}
    </div>`,l=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",u=[],y=ve(e.selector,a);y&&u.push(["component",y]),u.push(["selector",e.selector]);let _=a.boundingRect;_&&u.push(["position",`top ${_.top}, left ${_.left} \u2014 ${_.width} \xD7 ${_.height} px`]),u.push(["url",String(a.url??window.location.href)]);let b=a.viewport,w=a.devicePixelRatio;b&&u.push(["viewport",`${b.width} \xD7 ${b.height} px${w&&w!==1?` (${w}\xD7 DPR)`:""}`]);let S=a.cssFramework;S?.length&&u.push(["css framework",S.join(", ")]);let L=a.computedStyles;if(L){let d=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(g=>L[g]).map(g=>`${g}: ${L[g]}`).join(`
`);d&&u.push(["computed styles",d])}let D=String(a.userAgent??navigator.userAgent);u.push(["user agent",D]);let j=u.map(([d,g])=>`
    <div class="fo-meta-key">${x(d)}</div>
    <div class="fo-meta-val">${x(g)}</div>`).join(""),A=a.outerHTML;t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>${l}</h2>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${j}</div>
        </details>
        ${A?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${x(A)}</pre>
        </details>`:""}
      </div>
      ${s}
      <div class="fo-compose">
        <div class="fo-user-bar">
          <img src="${x(e.user.avatarUrl)}" alt="">
          <span>${x(e.user.login)}</span>
        </div>
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${x(e.defaultIssueTopic)}">
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
  `;let r=t.querySelector("#__fo_comment__"),n=t.querySelector("#__fo_submit__"),c=t.querySelector("#__fo_cancel__"),m=t.querySelector("#__fo_export__"),f=t.querySelector("#__fo_err__"),p=()=>t.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",T=()=>t.querySelector("#__fo_topic__")?.value.trim()||e.defaultIssueTopic;r.focus(),c.addEventListener("click",()=>{h(),e.onCancel()}),n.addEventListener("click",async()=>{let d=r.value.trim();if(!d){f.textContent="Please enter a comment.";return}n.disabled=!0,n.textContent="Submitting\u2026",f.textContent="";try{await e.onSubmit(d,p()),h()}catch(g){f.textContent=String(g),n.disabled=!1,n.textContent="Submit"}}),m.addEventListener("click",async()=>{m.disabled=!0,m.textContent="Exporting\u2026",n.disabled=!0,f.textContent="";try{let d=r.value.trim(),g=p(),k=T(),v=[...i];if(d){let I=await e.onSubmit(d,g);v=[...v,I]}if(v.length===0){f.textContent="Nothing to export \u2014 add a comment first.",m.disabled=!1,m.textContent="Send to GitHub",n.disabled=!1;return}await e.onExport(v,g,k),h()}catch(d){f.textContent=String(d),m.disabled=!1,m.textContent="Send to GitHub",n.disabled=!1}}),t.addEventListener("click",d=>{d.target===t&&(h(),e.onCancel())});let M=d=>{d.key==="Escape"&&(h(),e.onCancel(),document.removeEventListener("keydown",M))};document.addEventListener("keydown",M)}function ue(e){le();let t=de();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),i=t.querySelector("#__fo_cancel__"),a=t.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),h()}catch(s){o.disabled=!1,o.textContent="Sign in with GitHub",a.textContent=String(s)}}),i.addEventListener("click",()=>{h(),e.onCancel()}),t.addEventListener("click",s=>{s.target===t&&(h(),e.onCancel())})}function h(){let e=document.getElementById(Y);e&&e.remove()}function ve(e,t){let o=t.attributes;if(o?.["data-component"])return o["data-component"];let i=t.outerHTML;if(i){let a=i.match(/data-component="([^"]+)"/);if(a)return a[1]}return null}function x(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=J(),o=new O(t),i=new B(t,o);o.setOnUnauthorized(()=>i.logout()),Z(),V(async r=>{r==="active"?a():r==="idle"&&s()});function a(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",_,!0),o.listBadges(window.location.href).then(r=>U(r,b)).catch(()=>{})}function s(){document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",_,!0),G(),W(),h()}function l(r){let n=r.target;!n||n===document.body||n===document.documentElement||u(n)||re(n)}function u(r){return r.id.startsWith("__fo_")}async function y(r){let n=N(r),c=w(r);if(E("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",l,!0),document.removeEventListener("click",_,!0),G(),i.isAuthenticated()||await new Promise((g,k)=>{ue({onLogin:async()=>{await i.login(),g()},onCancel:()=>{E("idle"),k(new Error("cancelled"))}})}).catch(()=>{}),!i.isAuthenticated())return;let m=i.getUser(),p=(await o.listComments(window.location.href).catch(()=>[])).filter(g=>g.selector===n);E("commenting");let M=c.dataComponent??n.split(">").pop()?.trim()??n,d=p.length>0?`Feedback: ${p.length+1} comments on ${M}`:`Feedback on ${M}`;ce({selector:n,existingComments:p,context:c,user:m,defaultIssueTopic:d,onSubmit:async(g,k)=>{let v=await o.createFeedback({url:window.location.href,selector:n,comment:g,context:c,repo:t.repo,label:t.label,feedbackType:k}),I=await o.listBadges(window.location.href).catch(()=>[]);return U(I,b),E("active"),v.id},onExport:async(g,k,v)=>{let I=await o.exportIssue({ids:g,repo:t.repo,labels:[t.label,k],title:v});window.open(I.issue_url,"_blank");let fe=await o.listBadges(window.location.href).catch(()=>[]);U(fe,b),E("active")},onCancel:()=>{E("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",l,!0),document.addEventListener("click",_,!0)}})}async function _(r){let n=r.target;!n||u(n)||(r.preventDefault(),r.stopPropagation(),X()==="active"&&await y(n))}function b(r,n){let c=null;try{c=document.querySelector(n)}catch{}c&&y(c)}function w(r){let n=r.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:r.tagName.toLowerCase(),dataComponent:S(r)??void 0,outerHTML:r.outerHTML?.slice(0,4e3)??"",innerText:r.innerText?.slice(0,200)??"",attributes:L(r),cssFramework:A(r),computedStyles:j(r),boundingRect:{top:Math.round(n.top),left:Math.round(n.left),width:Math.round(n.width),height:Math.round(n.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function S(r){let n=r;for(;n;){let c=n.getAttribute("data-component");if(c)return c;n=n.parentElement}return null}function L(r){let n={};for(let c of Array.from(r.attributes))c.value.length<200&&(n[c.name]=c.value);return n}let D=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function j(r){let n=window.getComputedStyle(r),c={};for(let m of D){let f=n.getPropertyValue(m.replace(/([A-Z])/g,p=>`-${p.toLowerCase()}`)).trim();f&&f!=="none"&&f!=="normal"&&f!=="auto"&&f!=="0px"&&(c[m]=f)}return c}function A(r){let n=Array.from(r.classList).join(" "),c=r,m=[];for(let T=0;T<6&&c;T++)m.push(...Array.from(c.classList)),c=c.parentElement;let f=m.join(" "),p=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(f)&&p.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(n)&&p.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(f)&&p.push("Bootstrap"),/\bMui[A-Z]/.test(f)&&p.push("Material UI"),/\bchakra-/.test(f)&&p.push("Chakra UI"),(r.hasAttribute("data-radix-collection-item")||/\bradix-/.test(f))&&p.push("Radix UI"),p.includes("Tailwind CSS")&&p.includes("Radix UI")&&p.push("shadcn/ui"),p}})();})();
