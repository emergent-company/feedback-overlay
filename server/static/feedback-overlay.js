"use strict";var FeedbackOverlay=(()=>{function ze(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function me(){let t=ze(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",r=t?.dataset.label??"feedback",n=t?.dataset.hotkey?.toLowerCase()??"",d=["alt+shift","ctrl+shift","meta+shift"].includes(n)?n:"alt+shift";o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag.");let a=t?.dataset.branch?.trim()||void 0,c=t?.dataset.version?.trim()||void 0;return{apiBase:e,repo:o,label:r,hotkey:d,branch:a,version:c}}var K=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let r=(o.method??"GET").toUpperCase(),n=r!=="GET"&&r!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+e,{...o,headers:{...n,...this.authHeaders(),...o.headers??{}}});if(!i.ok){i.status===401&&this.onUnauthorized&&this.onUnauthorized();let d=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${d}`)}if(!(i.status===204||i.status===205))return i.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listIssueBadges(e){return this.fetchJSON(`/issues?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await this.fetchJSON(`/feedback/${e}`,{method:"DELETE"})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var Ue="feedback_overlay_auth",ne="__fo_user__",V=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let r=`${this.config.apiBase}/auth/github`,n=window.open(r,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!n){o(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{a(),o(new Error("Authentication timed out."))},300*1e3),d=u=>{if(u.data?.type!==Ue)return;clearTimeout(i),a();let{token:b,login:_,avatar:v}=u.data;this.api.setToken(b),this.user={login:_,avatarUrl:v},this.saveUser(this.user),e(this.user)},a=()=>{window.removeEventListener("message",d),this.messageHandler=null,n.closed||n.close()};this.messageHandler=d,window.addEventListener("message",d);let c=setInterval(()=>{n.closed&&(clearInterval(c),this.messageHandler===d&&(a(),clearTimeout(i),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(ne,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(ne);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(ne)}catch{}}};var M="idle",X=[],j="Alt",ge="Shift",W=!1,G=!1,Z=!1;function q(t){M!==t&&(M=t,X.forEach(e=>e(t)))}function _e(){return M}function he(t){return X.push(t),()=>{X=X.filter(e=>e!==t)}}function A(t){q(t)}function be(t){switch(t.hotkey){case"ctrl+shift":j="Control";break;case"meta+shift":j="Meta";break;case"alt+shift":default:j="Alt";break}window.addEventListener("keydown",Fe,!0),window.addEventListener("keyup",De,!0),window.addEventListener("blur",Ne)}function Fe(t){if(t.key==="Escape"&&(M==="active"||M==="capturing")){q("idle");return}t.key===j&&(W=!0),t.key===ge&&(G=!0),W&&G&&!Z&&(Z=!0,M==="idle"?q("active"):M==="active"&&q("idle"))}function De(t){t.key===j&&(W=!1),t.key===ge&&(G=!1),(!W||!G)&&(Z=!1)}function Ne(){W=!1,G=!1,Z=!1,M==="active"&&q("idle")}function B(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let r=o.getAttribute("data-testid");if(r){e.unshift(`[data-testid="${CSS.escape(r)}"]`);break}if(o.id&&!je(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}let n=o.getAttribute("data-component");if(n){let a=o.parentElement;if(a){if(Array.from(a.children).filter(u=>u.getAttribute("data-component")===n).length>1){let b=Array.from(a.children).filter(_=>_.tagName===o.tagName).indexOf(o)+1;e.unshift(`[data-component="${CSS.escape(n)}"]:nth-of-type(${b})`)}else e.unshift(`[data-component="${CSS.escape(n)}"]`);if(a.getAttribute("data-component")){let u=a.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(u)}"]`);break}o=a;continue}else{e.unshift(`[data-component="${CSS.escape(n)}"]`);break}}let i=o.parentElement,d=o.tagName.toLowerCase();if(i){let a=Array.from(i.children).filter(c=>c.tagName===o.tagName);if(a.length>1){let c=a.indexOf(o)+1;e.unshift(`${d}:nth-of-type(${c})`)}else e.unshift(d)}else e.unshift(d);o=i}return e.join(" > ")}function je(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function R(t){let e=t;for(;e&&e!==document.documentElement;){let o=e.getAttribute("data-component");if(o)return o;e=e.parentElement}return null}function xe(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let d=e.getAttribute("data-component");if(d)return[d,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let r=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",i=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${r}${n}${i}>`}var ve="__fo_highlight__",we="__fo_tooltip__",qe="#22c55e",We="rgba(34, 197, 94, 0.08)",Ge="#4f86f7",Ye="rgba(79, 134, 247, 0.08)",Ee=null;function ye(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function ke(t){Ee=t;let e=t.getBoundingClientRect(),o=window.scrollX,r=window.scrollY,n=R(t)!==null,i=n?qe:Ge,d=n?We:Ye,a=ye(ve);Object.assign(a.style,{position:"absolute",top:`${e.top+r}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:`2px solid ${i}`,backgroundColor:d,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let c=xe(t),u=ye(we);u.textContent=c;let b=Math.min(e.left+o,window.innerWidth+o-(c.length*7+16));Object.assign(u.style,{position:"absolute",top:`${e.top+r-26}px`,left:`${Math.max(4,b)}px`,background:i,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function ie(){Ee=null,document.getElementById(ve)?.remove(),document.getElementById(we)?.remove()}var re="__fo_badge__",Q=[],ee=null;function se(){Q.forEach(t=>t.remove()),Q=[],ee?.disconnect(),ee=null}function Se(t,e,o=[]){se();let r=[];t.forEach((i,d)=>{let a=null;try{a=document.querySelector(i.selector)}catch{return}if(!a)return;let c=document.createElement("div");c.id=`${re}${d}`,c.textContent=String(i.count),c.title=`${i.count} comment${i.count!==1?"s":""} on this element`,Object.assign(c.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),c.addEventListener("click",u=>{u.stopPropagation(),u.preventDefault(),e(i.ids,i.selector)}),document.body.appendChild(c),Q.push(c),r.push({badge:c,selector:i.selector}),ae(c,a,0)}),o.forEach((i,d)=>{let a=null;try{a=document.querySelector(i.selector)}catch{return}if(!a)return;let c=document.createElement("div");c.id=`${re}issue_${d}`,c.textContent=`#${i.issue_number}`,c.title=`GitHub issue #${i.issue_number}: ${i.title}`,Object.assign(c.style,{position:"absolute",background:"#c0392b",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),c.addEventListener("click",u=>{u.stopPropagation(),u.preventDefault(),window.open(i.issue_url,"_blank","noopener")}),document.body.appendChild(c),Q.push(c),r.push({badge:c,selector:i.selector}),ae(c,a,t.some(u=>u.selector===i.selector)?18:0)});let n=()=>{r.forEach(({badge:i,selector:d})=>{let a=null;try{a=document.querySelector(d)}catch{return}if(!a)return;let c=i.id.startsWith(`${re}issue_`),u=c?t.some(b=>b.selector===d):!1;ae(i,a,c&&u?18:0)})};window.addEventListener("scroll",n,{passive:!0}),window.addEventListener("resize",n,{passive:!0}),ee=new ResizeObserver(n),ee.observe(document.body)}function ae(t,e,o=0){let r=e.getBoundingClientRect(),n=window.scrollX,i=window.scrollY;t.style.top=`${r.top+i-8+o}px`,t.style.left=`${r.right+n-8}px`}var le="__fo_dialog__",Ce="__fo_styles__";function Le(){if(document.getElementById(Ce))return;let t=document.createElement("style");t.id=Ce,t.textContent=`
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

    /* \u2500\u2500 Session history \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    #__fo_dialog__ .fo-history-list {
      margin-top: 6px;
      max-height: 200px;
      overflow-y: auto;
    }
    #__fo_dialog__ .fo-history-line {
      font-size: 11px;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      line-height: 1.7;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #__fo_dialog__ .fo-history-type {
      display: inline-block;
      width: 36px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      flex-shrink: 0;
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
  `,document.head.appendChild(t)}function $e(){let t=document.getElementById(le);return t||(t=document.createElement("div"),t.id=le,document.body.appendChild(t)),t}function Ie(t){Le();let e=$e(),o=t.existingComments,r=o.map(m=>m.id),n=t.context,i=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(m=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${y(m.github_user)}</span>
            <span class="fo-comment-date">${y(m.created_at)}</span>
          </div>
          <div class="fo-comment-text">${y(m.comment)}</div>
        </div>`).join("")}
    </div>`,d=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",a=[];t.repo&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">repo</span>${y(t.repo)}</span>`),t.branch&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">branch</span>${y(t.branch)}</span>`),t.appVersion&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">version</span>${y(t.appVersion)}</span>`);let c=a.length>0?`<div class="fo-target-strip">${a.join("")}</div>`:"",u=t.componentHierarchy??[],b=u.length>1?`
    <div class="fo-component-row">
      <span class="fo-component-label">Component</span>
      <select class="fo-component-select" id="__fo_component__">
        ${u.map((m,g)=>`<option value="${g}" ${g===(t.selectedComponentIdx??0)?"selected":""}>
          ${m.isChild?"\u21B3 ":""}${y(m.name)}
        </option>`).join("")}
      </select>
    </div>`:"",_=[],v=n.dataComponent;v&&_.push(["component",v]),_.push(["selector",t.selector]);let w=n.boundingRect;w&&_.push(["position",`top ${w.top}, left ${w.left} \u2014 ${w.width} \xD7 ${w.height} px`]),_.push(["url",String(n.url??window.location.href)]);let $=n.viewport,C=n.devicePixelRatio;$&&_.push(["viewport",`${$.width} \xD7 ${$.height} px${C&&C!==1?` (${C}\xD7 DPR)`:""}`]);let O=n.cssFramework;O?.length&&_.push(["css framework",O.join(", ")]);let E=n.computedStyles;if(E){let m=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(g=>E[g]).map(g=>`${g}: ${E[g]}`).join(`
`);m&&_.push(["computed styles",m])}let D=String(n.userAgent??navigator.userAgent);_.push(["user agent",D]);let l=_.map(([m,g])=>`
    <div class="fo-meta-key">${y(m)}</div>
    <div class="fo-meta-val">${y(g)}</div>`).join(""),s=n.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${d}</h2>
          <div class="fo-user-pill">
            <img src="${y(t.user.avatarUrl)}" alt="">
            <span>${y(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${l}</div>
        </details>
        ${s?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Ke(s)}</pre>
        </details>`:""}
        ${Ve(n)}
      </div>
      ${b}
      ${c}
      ${i}
      <div class="fo-compose">
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${y(t.defaultIssueTopic)}">
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
  `;let p=e.querySelector("#__fo_comment__"),h=e.querySelector("#__fo_submit__"),x=e.querySelector("#__fo_cancel__"),f=e.querySelector("#__fo_export__"),k=e.querySelector("#__fo_err__"),Y=e.querySelector("#__fo_component__");Y&&t.onComponentChange&&Y.addEventListener("change",()=>{t.onComponentChange(parseInt(Y.value,10))});let P=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",fe=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;p.focus(),x.addEventListener("click",()=>{T(),t.onCancel()}),h.addEventListener("click",async()=>{let m=p.value.trim();if(!m){k.textContent="Please enter a comment.";return}h.disabled=!0,h.textContent="Submitting\u2026",k.textContent="";try{await t.onSubmit(m,P()),T()}catch(g){k.textContent=String(g),h.disabled=!1,h.textContent="Save"}}),f.addEventListener("click",async()=>{f.disabled=!0,f.textContent="Exporting\u2026",h.disabled=!0,k.textContent="";try{let m=p.value.trim(),g=P(),L=fe(),I=[...r];if(m){let J=await t.onSubmit(m,g);I=[...I,J]}if(I.length===0){k.textContent="Nothing to export \u2014 add a comment first.",f.disabled=!1,f.textContent="Send to GitHub",h.disabled=!1;return}T(),t.onExport(I,g,L).catch(J=>{ce(`Failed to create issue: ${String(J)}`)})}catch(m){k.textContent=String(m),f.disabled=!1,f.textContent="Send to GitHub",h.disabled=!1}}),e.addEventListener("click",m=>{m.target===e&&(T(),t.onCancel())});let N=m=>{m.key==="Escape"&&(T(),t.onCancel(),document.removeEventListener("keydown",N))};document.addEventListener("keydown",N)}function Me(t){Le();let e=$e();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),r=e.querySelector("#__fo_cancel__"),n=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),T()}catch(i){o.disabled=!1,o.textContent="Sign in with GitHub",n.textContent=String(i)}}),r.addEventListener("click",()=>{T(),t.onCancel()}),e.addEventListener("click",i=>{i.target===e&&(T(),t.onCancel())})}function T(){let t=document.getElementById(le);t&&t.remove()}var z="__fo_toast__";function Je(){if(document.getElementById(z+"_styles"))return;let t=document.createElement("style");t.id=z+"_styles",t.textContent=`
    #${z} {
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
    #${z}.fo-visible {
      opacity: 1;
    }
  `,document.head.appendChild(t)}function ce(t){Je();let e=document.getElementById(z);e||(e=document.createElement("div"),e.id=z,document.body.appendChild(e)),e.textContent=t,e.classList.add("fo-visible"),clearTimeout(e.__fo_toast_timer),e.__fo_toast_timer=setTimeout(()=>{e.classList.remove("fo-visible")},3e3)}function Ke(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,r=_=>_.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function n(_,v){return`<span class="${_}">${v}</span>`}let i=0,d=2,a=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function c(){return" ".repeat(i*d)}let u=[],b;for(e.lastIndex=0;(b=e.exec(t))!==null;){let _=b[0],v=b[1];if(_.startsWith("<!--")||_.startsWith("<!")){u.push(c()+n("fo-hd",r(_))+`
`);continue}if(!_.startsWith("<")){let E=_.trim();E&&u.push(c()+r(E)+`
`);continue}let w=_.startsWith("</"),$=_.endsWith("/>")||v&&a.has(v.toLowerCase());w&&(i=Math.max(0,i-1));let C=n("fo-hp","&lt;")+(w?n("fo-hp","/"):"");C+=n("fo-ht",r(v??""));let O=b[2]??"";if(O.trim()){o.lastIndex=0;let E;for(;(E=o.exec(O))!==null;){let D=E[1],l=E[2]??"";if(C+=" "+n("fo-ha",r(D)),l){let s=l.indexOf("="),p=l.slice(s+1).trim();C+=n("fo-hp","=")+n("fo-hv",r(p))}}}C+=$&&!w?n("fo-hp"," /&gt;"):n("fo-hp","&gt;"),u.push(c()+C+`
`),!w&&!$&&i++}return u.join("").trimEnd()}function Ve(t){let e=t.sessionHistory;if(!Array.isArray(e)||e.length===0)return"";let o=[];for(let r of e){let n=typeof r=="object"&&r?r:null;if(!n||!n.type||!n.data)continue;let i=Xe(n.timestamp);switch(n.type){case"navigation":{let d=Te(n.data.previousUrl),a=Te(n.data.url);o.push(`<div class="fo-history-line"><span class="fo-history-type">nav</span> ${i} ${y(d)} \u2192 ${y(a)}</div>`);break}case"input":{let d=n.data.component?` [${y(n.data.component)}]`:"",a=String(n.data.value??""),c=a.length>60?a.slice(0,57)+"...":a;o.push(`<div class="fo-history-line"><span class="fo-history-type">input</span> ${i} ${y(String(n.data.tagName??""))}${d} = "${y(c)}"</div>`);break}case"click":{let d=n.data.component?` [${y(n.data.component)}]`:"",a=n.data.text?` "${y(String(n.data.text))}"`:"";o.push(`<div class="fo-history-line"><span class="fo-history-type">click</span> ${i} ${y(String(n.data.tagName??""))}${d}${a}</div>`);break}}}return o.length===0?"":`
    <details class="fo-meta-toggle">
      <summary>Session history (last ${o.length} events)</summary>
      <div class="fo-history-list">${o.join("")}</div>
    </details>`}function Xe(t){try{return new Date(t).toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}}function Te(t){if(!t)return"(initial page)";try{let e=new URL(t);return e.pathname+e.search+e.hash||"/"}catch{return t.length>80?t.slice(0,77)+"...":t}}function y(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var oe="__fo_indicator__",Ze=`
#${oe} {
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
#${oe} .fo-bar-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  margin-right: 8px;
  flex-shrink: 0;
  animation: fo-pulse 2s ease-in-out infinite;
}
#${oe} .fo-bar-key {
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
`;function Qe(t){let e=/Mac|iPhone|iPad|iPod/.test(navigator.platform);switch(t){case"ctrl+shift":return"Ctrl+Shift";case"meta+shift":return e?"\u2318+Shift":"Win+Shift";case"alt+shift":default:return e?"\u2325+Shift":"Alt+Shift"}}var te=null,S=null,H=null;function He(t){te||(te=document.createElement("style"),te.textContent=Ze,document.head.appendChild(te)),S||(S=document.createElement("div"),S.id=oe,document.body.appendChild(S));let e=Qe(t);S.innerHTML=`<span class="fo-bar-dot"></span>Comment mode\u2002\u2014\u2002press\xA0<span class="fo-bar-key">${e}</span>\xA0to exit`,S.style.display="flex",S.style.opacity="1",H&&(clearTimeout(H),H=null),H=setTimeout(()=>{S&&(S.style.opacity="0"),H=null},3e3)}function de(){H&&(clearTimeout(H),H=null),S&&(S.style.opacity="0",S.style.display="none")}var et=15,F=[],Oe=!1,Ae="",pe=0;function ue(t){let e=t;for(;e&&e!==document.documentElement;){if(e.id&&e.id.startsWith("__fo_"))return!0;e=e.parentElement}return!1}function U(t,e){F.push({type:t,timestamp:new Date().toISOString(),data:e}),F.length>et&&F.shift()}function Be(t){if(t.type==="password")return!0;let e=[t.name,t.id,t.getAttribute("autocomplete")??""].join(" ").toLowerCase();return/(password|passwd|pwd|secret|token|api[_-]?key|credit|card|cvv|cvc|ssn|social.?security|routing|iban)/.test(e)}function Pe(){if(Oe||window.top!==window.self)return;Oe=!0;let t=window.location.href;window.addEventListener("popstate",()=>{let o=window.location.href;o!==t&&(U("navigation",{url:o,previousUrl:t,title:document.title}),t=o)});let e="__fo_history_patched__";if(!history[e]){history[e]=!0;let o=history.pushState.bind(history);history.pushState=function(...n){let i=window.location.href,d=o(...n),a=window.location.href;return a!==i&&(U("navigation",{url:a,previousUrl:i,title:document.title}),t=a),d};let r=history.replaceState.bind(history);history.replaceState=function(...n){let i=window.location.href,d=r(...n),a=window.location.href;return a!==i&&(U("navigation",{url:a,previousUrl:i,title:document.title}),t=a),d}}document.addEventListener("input",o=>{let r=o.target;if(!r||ue(r))return;let n=r.tagName.toLowerCase();if(n!=="input"&&n!=="textarea")return;let i=r,d=B(r),a=R(r),c=`${d}_${n}`,u=Date.now();if(c===Ae&&u-pe<500){let b=F[F.length-1];if(b?.type==="input"){b.data.value=Be(i)?"<redacted>":i.value,b.timestamp=new Date().toISOString(),pe=u;return}}Ae=c,pe=u,U("input",{selector:d,component:a,tagName:n,inputType:i.type||"text",value:Be(i)?"<redacted>":i.value})},!0),document.addEventListener("change",o=>{let r=o.target;if(!r||ue(r)||r.tagName.toLowerCase()!=="select")return;let n=r;U("input",{selector:B(r),component:R(r),tagName:"select",inputType:"select",value:n.value})},!0),document.addEventListener("click",o=>{let r=o.target;if(!r||ue(r))return;let n=r.tagName.toLowerCase(),i=r.getAttribute("role");if(n!=="a"&&n!=="button"&&i!=="button")return;let d=(r.textContent||"").trim().slice(0,80);U("click",{selector:B(r),component:R(r),tagName:n,text:d})},!0)}function Re(){return F.slice()}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0,Pe();let e=me(),o=new K(e),r=new V(e,o);o.setOnUnauthorized(()=>r.logout()),be(e),he(async l=>{l==="active"?(He(e.hotkey),n()):l==="idle"?(de(),d()):(l==="capturing"||l==="commenting")&&de()});function n(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",b,!0),i()}async function i(){let l=window.location.href,[s,p]=await Promise.all([o.listBadges(l).catch(()=>[]),o.listIssueBadges(l).catch(()=>[])]);Se(s,_,p)}function d(){document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",b,!0),ie(),se(),T()}function a(l){let s=l.target;!s||s===document.body||s===document.documentElement||c(s)||ke(s)}function c(l){return l.id.startsWith("__fo_")}async function u(l){let s=B(l),p=w(l),h=v(l),x=h.findIndex(g=>!l.closest("[data-component]")||g.element===l.closest("[data-component]")),f=x>=0?x:0;if(A("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",b,!0),ie(),r.isAuthenticated()||await new Promise((g,L)=>{Me({onLogin:async()=>{await r.login(),g()},onCancel:()=>{A("idle"),L(new Error("cancelled"))}})}).catch(()=>{}),!r.isAuthenticated())return;let k=r.getUser(),P=(await o.listComments(window.location.href).catch(()=>[])).filter(g=>g.selector===s);A("commenting");let N=p.dataComponent??s.split(">").pop()?.trim()??s,m=P.length>0?`Feedback: ${P.length+1} comments on ${N}`:`Feedback on ${N}`;Ie({selector:s,existingComments:P,context:p,user:k,defaultIssueTopic:m,repo:e.repo,branch:e.branch,appVersion:e.version,componentHierarchy:h.map((g,L)=>({name:g.name,isChild:L>f})),selectedComponentIdx:f,onComponentChange:g=>{T(),u(h[g].element)},onSubmit:async(g,L)=>{let I=await o.createFeedback({url:window.location.href,selector:s,comment:g,context:p,repo:e.repo,label:e.label,feedbackType:L});return await i(),A("active"),I.id},onExport:async(g,L,I)=>{let J=await o.exportIssue({ids:g,repo:e.repo,labels:[e.label,L],title:I});ce("Issue created successfully!"),await i(),A("active")},onCancel:()=>{A("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",b,!0)}})}async function b(l){let s=l.target;!s||c(s)||(l.preventDefault(),l.stopPropagation(),_e()==="active"&&await u(s))}function _(l,s){let p=null;try{p=document.querySelector(s)}catch{}p&&u(p)}function v(l){let s=[],p=l;for(;p&&p!==document.documentElement;){let f=p.getAttribute("data-component");f&&s.push({name:f,element:p}),p=p.parentElement}s.reverse();let h=s.length>0?s[s.length-1].element:null,x=[];return h&&h.querySelectorAll("[data-component]").forEach(f=>{f.parentElement?.closest("[data-component]")===h&&x.push({name:f.getAttribute("data-component"),element:f})}),[...s,...x]}function w(l){let s=l.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:l.tagName.toLowerCase(),dataComponent:$(l)??void 0,outerHTML:l.outerHTML?.slice(0,4e3)??"",innerText:l.innerText?.slice(0,200)??"",attributes:C(l),cssFramework:D(l),computedStyles:E(l),boundingRect:{top:Math.round(s.top),left:Math.round(s.left),width:Math.round(s.width),height:Math.round(s.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString(),...e.branch?{branch:e.branch}:{},...e.version?{appVersion:e.version}:{},sessionHistory:Re()}}function $(l){let s=l,p=[];for(;s&&s!==document.documentElement;){let h=s.getAttribute("data-component");if(h)return[h,...p.reverse()].join(" > ");p.push(s.tagName.toLowerCase()),s=s.parentElement}return null}function C(l){let s={};for(let p of Array.from(l.attributes))p.value.length<200&&(s[p.name]=p.value);return s}let O=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function E(l){let s=window.getComputedStyle(l),p={};for(let h of O){let x=s.getPropertyValue(h.replace(/([A-Z])/g,f=>`-${f.toLowerCase()}`)).trim();x&&x!=="none"&&x!=="normal"&&x!=="auto"&&x!=="0px"&&(p[h]=x)}return p}function D(l){let s=Array.from(l.classList).join(" "),p=l,h=[];for(let k=0;k<6&&p;k++)h.push(...Array.from(p.classList)),p=p.parentElement;let x=h.join(" "),f=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(x)&&f.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(s)&&f.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(x)&&f.push("Bootstrap"),/\bMui[A-Z]/.test(x)&&f.push("Material UI"),/\bchakra-/.test(x)&&f.push("Chakra UI"),(l.hasAttribute("data-radix-collection-item")||/\bradix-/.test(x))&&f.push("Radix UI"),f.includes("Tailwind CSS")&&f.includes("Radix UI")&&f.push("shadcn/ui"),f}})();})();
