"use strict";var FeedbackOverlay=(()=>{function Ue(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function ge(){let t=Ue(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",r=t?.dataset.label??"feedback",n=t?.dataset.hotkey?.toLowerCase()??"",d=["alt+shift","ctrl+shift","meta+shift"].includes(n)?n:"alt+shift";o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag.");let a=t?.dataset.branch?.trim()||void 0,s=t?.dataset.version?.trim()||void 0;return{apiBase:e,repo:o,label:r,hotkey:d,branch:a,version:s}}var J=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let r=(o.method??"GET").toUpperCase(),n=r!=="GET"&&r!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+e,{...o,headers:{...n,...this.authHeaders(),...o.headers??{}}});if(!i.ok){i.status===401&&this.onUnauthorized&&this.onUnauthorized();let d=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${d}`)}if(!(i.status===204||i.status===205))return i.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listIssueBadges(e){return this.fetchJSON(`/issues?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await this.fetchJSON(`/feedback/${e}`,{method:"DELETE"})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var Fe="feedback_overlay_auth",ie="__fo_user__",V=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let r=this.apiOrigin(),n=`${this.config.apiBase}/auth/github?origin=${encodeURIComponent(window.location.origin)}`,i=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!i){o(new Error("Popup was blocked. Please allow popups for this site."));return}let d=setTimeout(()=>{s(),o(new Error("Authentication timed out."))},300*1e3),a=_=>{if(_.data?.type!==Fe||r&&_.origin!==r)return;clearTimeout(d),s();let{token:g,login:w,avatar:v}=_.data;this.api.setToken(g),this.user={login:w,avatarUrl:v},this.saveUser(this.user),e(this.user)},s=()=>{window.removeEventListener("message",a),this.messageHandler=null,i.closed||i.close()};this.messageHandler=a,window.addEventListener("message",a);let f=setInterval(()=>{i.closed&&(clearInterval(f),this.messageHandler===a&&(s(),clearTimeout(d),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}apiOrigin(){try{return new URL(this.config.apiBase).origin}catch{return""}}saveUser(e){try{localStorage.setItem(ie,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(ie);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(ie)}catch{}}};var $="idle",X=[],q="Alt",_e="Shift",G=!1,Y=!1,Z=!1;function W(t){$!==t&&($=t,X.forEach(e=>e(t)))}function he(){return $}function be(t){return X.push(t),()=>{X=X.filter(e=>e!==t)}}function O(t){W(t)}function ye(t){switch(t.hotkey){case"ctrl+shift":q="Control";break;case"meta+shift":q="Meta";break;case"alt+shift":default:q="Alt";break}window.addEventListener("keydown",De,!0),window.addEventListener("keyup",Ne,!0),window.addEventListener("blur",je)}function De(t){if(t.key==="Escape"&&($==="active"||$==="capturing")){W("idle");return}t.key===q&&(G=!0),t.key===_e&&(Y=!0),G&&Y&&!Z&&(Z=!0,$==="idle"?W("active"):$==="active"&&W("idle"))}function Ne(t){t.key===q&&(G=!1),t.key===_e&&(Y=!1),(!G||!Y)&&(Z=!1)}function je(){G=!1,Y=!1,Z=!1,$==="active"&&W("idle")}function A(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let r=o.getAttribute("data-testid");if(r){e.unshift(`[data-testid="${CSS.escape(r)}"]`);break}if(o.id&&!qe(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}let n=o.getAttribute("data-component");if(n){let a=o.parentElement;if(a){if(Array.from(a.children).filter(f=>f.getAttribute("data-component")===n).length>1){let _=Array.from(a.children).filter(g=>g.tagName===o.tagName).indexOf(o)+1;e.unshift(`[data-component="${CSS.escape(n)}"]:nth-of-type(${_})`)}else e.unshift(`[data-component="${CSS.escape(n)}"]`);if(a.getAttribute("data-component")){let f=a.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(f)}"]`);break}o=a;continue}else{e.unshift(`[data-component="${CSS.escape(n)}"]`);break}}let i=o.parentElement,d=o.tagName.toLowerCase();if(i){let a=Array.from(i.children).filter(s=>s.tagName===o.tagName);if(a.length>1){let s=a.indexOf(o)+1;e.unshift(`${d}:nth-of-type(${s})`)}else e.unshift(d)}else e.unshift(d);o=i}return e.join(" > ")}function qe(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function R(t){let e=t;for(;e&&e!==document.documentElement;){let o=e.getAttribute("data-component");if(o)return o;e=e.parentElement}return null}function xe(t){let e=t,o=[];for(;e&&e!==document.documentElement;){let d=e.getAttribute("data-component");if(d)return[d,...o.reverse()].join(" > ");o.push(e.tagName.toLowerCase()),e=e.parentElement}let r=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",i=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${r}${n}${i}>`}var we="__fo_highlight__",Ee="__fo_tooltip__",We="#22c55e",Ge="rgba(34, 197, 94, 0.08)",Ye="#4f86f7",Ke="rgba(79, 134, 247, 0.08)",ke=null;function ve(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function Se(t){ke=t;let e=t.getBoundingClientRect(),o=window.scrollX,r=window.scrollY,n=R(t)!==null,i=n?We:Ye,d=n?Ge:Ke,a=ve(we);Object.assign(a.style,{position:"absolute",top:`${e.top+r}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:`2px solid ${i}`,backgroundColor:d,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let s=xe(t),f=ve(Ee);f.textContent=s;let _=Math.min(e.left+o,window.innerWidth+o-(s.length*7+16));Object.assign(f.style,{position:"absolute",top:`${e.top+r-26}px`,left:`${Math.max(4,_)}px`,background:i,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function re(){ke=null,document.getElementById(we)?.remove(),document.getElementById(Ee)?.remove()}var ae="__fo_badge__",Q=[],ee=null;function le(){Q.forEach(t=>t.remove()),Q=[],ee?.disconnect(),ee=null}function Ce(t,e,o=[]){le();let r=[];t.forEach((i,d)=>{let a=null;try{a=document.querySelector(i.selector)}catch{return}if(!a)return;let s=document.createElement("div");s.id=`${ae}${d}`,s.textContent=String(i.count),s.title=`${i.count} comment${i.count!==1?"s":""} on this element`,Object.assign(s.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),e(i.ids,i.selector)}),document.body.appendChild(s),Q.push(s),r.push({badge:s,selector:i.selector}),se(s,a,0)}),o.forEach((i,d)=>{let a=null;try{a=document.querySelector(i.selector)}catch{return}if(!a)return;let s=document.createElement("div");s.id=`${ae}issue_${d}`,s.textContent=`#${i.issue_number}`,s.title=`GitHub issue #${i.issue_number}: ${i.title}`,Object.assign(s.style,{position:"absolute",background:"#c0392b",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),window.open(i.issue_url,"_blank","noopener")}),document.body.appendChild(s),Q.push(s),r.push({badge:s,selector:i.selector}),se(s,a,t.some(f=>f.selector===i.selector)?18:0)});let n=()=>{r.forEach(({badge:i,selector:d})=>{let a=null;try{a=document.querySelector(d)}catch{return}if(!a)return;let s=i.id.startsWith(`${ae}issue_`),f=s?t.some(_=>_.selector===d):!1;se(i,a,s&&f?18:0)})};window.addEventListener("scroll",n,{passive:!0}),window.addEventListener("resize",n,{passive:!0}),ee=new ResizeObserver(n),ee.observe(document.body)}function se(t,e,o=0){let r=e.getBoundingClientRect(),n=window.scrollX,i=window.scrollY;t.style.top=`${r.top+i-8+o}px`,t.style.left=`${r.right+n-8}px`}var ce="__fo_dialog__",Te="__fo_styles__";function $e(){if(document.getElementById(Te))return;let t=document.createElement("style");t.id=Te,t.textContent=`
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
  `,document.head.appendChild(t)}function Ie(){let t=document.getElementById(ce);return t||(t=document.createElement("div"),t.id=ce,document.body.appendChild(t)),t}function Me(t){$e();let e=Ie(),o=t.existingComments,r=o.map(p=>p.id),n=t.context,i=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(p=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${x(p.github_user)}</span>
            <span class="fo-comment-date">${x(p.created_at)}</span>
          </div>
          <div class="fo-comment-text">${x(p.comment)}</div>
        </div>`).join("")}
    </div>`,d=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",a=[];t.repo&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">repo</span>${x(t.repo)}</span>`),t.branch&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">branch</span>${x(t.branch)}</span>`),t.appVersion&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">version</span>${x(t.appVersion)}</span>`);let s=a.length>0?`<div class="fo-target-strip">${a.join("")}</div>`:"",f=t.componentHierarchy??[],_=f.length>1?`
    <div class="fo-component-row">
      <span class="fo-component-label">Component</span>
      <select class="fo-component-select" id="__fo_component__">
        ${f.map((p,b)=>`<option value="${b}" ${b===(t.selectedComponentIdx??0)?"selected":""}>
          ${p.isChild?"\u21B3 ":""}${x(p.name)}
        </option>`).join("")}
      </select>
    </div>`:"",g=[],w=n.dataComponent;w&&g.push(["component",w]),g.push(["selector",t.selector]);let v=n.boundingRect;v&&g.push(["position",`top ${v.top}, left ${v.left} \u2014 ${v.width} \xD7 ${v.height} px`]),g.push(["url",String(n.url??window.location.href)]);let L=n.viewport,C=n.devicePixelRatio;L&&g.push(["viewport",`${L.width} \xD7 ${L.height} px${C&&C!==1?` (${C}\xD7 DPR)`:""}`]);let M=n.cssFramework;M?.length&&g.push(["css framework",M.join(", ")]);let E=n.computedStyles;if(E){let p=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(b=>E[b]).map(b=>`${b}: ${E[b]}`).join(`
`);p&&g.push(["computed styles",p])}let F=String(n.userAgent??navigator.userAgent);g.push(["user agent",F]);let c=g.map(([p,b])=>`
    <div class="fo-meta-key">${x(p)}</div>
    <div class="fo-meta-val">${x(b)}</div>`).join(""),l=n.outerHTML;e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <div class="fo-header-top">
          <h2>${d}</h2>
          <div class="fo-user-pill">
            <img src="${x(t.user.avatarUrl)}" alt="">
            <span>${x(t.user.login)}</span>
          </div>
        </div>
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${c}</div>
        </details>
        ${l?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Ve(l)}</pre>
        </details>`:""}
        ${Xe(n)}
      </div>
      ${_}
      ${s}
      ${i}
      <div class="fo-compose">
        <div class="fo-topic-row">
          <label class="fo-topic-label" for="__fo_topic__">Issue title</label>
          <input class="fo-topic-input" id="__fo_topic__" type="text" value="${x(t.defaultIssueTopic)}">
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
  `;let u=e.querySelector("#__fo_comment__"),h=e.querySelector("#__fo_submit__"),y=e.querySelector("#__fo_cancel__"),m=e.querySelector("#__fo_export__"),k=e.querySelector("#__fo_err__"),K=e.querySelector("#__fo_component__");K&&t.onComponentChange&&K.addEventListener("change",()=>{t.onComponentChange(parseInt(K.value,10))});let B=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",me=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;u.focus();let D=p=>{p.key==="Escape"&&(H(),T(),t.onCancel())},H=()=>document.removeEventListener("keydown",D);document.addEventListener("keydown",D),y.addEventListener("click",()=>{H(),T(),t.onCancel()}),h.addEventListener("click",async()=>{let p=u.value.trim();if(!p){k.textContent="Please enter a comment.";return}h.disabled=!0,h.textContent="Submitting\u2026",k.textContent="";try{await t.onSubmit(p,B()),H(),T()}catch(b){k.textContent=String(b),h.disabled=!1,h.textContent="Save"}}),m.addEventListener("click",async()=>{m.disabled=!0,m.textContent="Exporting\u2026",h.disabled=!0,k.textContent="";try{let p=u.value.trim(),b=B(),N=me(),j=[...r];if(p){let ne=await t.onSubmit(p,b);j=[...j,ne]}if(j.length===0){k.textContent="Nothing to export \u2014 add a comment first.",m.disabled=!1,m.textContent="Send to GitHub",h.disabled=!1;return}H(),T(),t.onExport(j,b,N).catch(ne=>{de(`Failed to create issue: ${String(ne)}`)})}catch(p){k.textContent=String(p),m.disabled=!1,m.textContent="Send to GitHub",h.disabled=!1}}),e.addEventListener("click",p=>{p.target===e&&(H(),T(),t.onCancel())})}function He(t){$e();let e=Ie();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),r=e.querySelector("#__fo_cancel__"),n=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),T()}catch(i){o.disabled=!1,o.textContent="Sign in with GitHub",n.textContent=String(i)}}),r.addEventListener("click",()=>{T(),t.onCancel()}),e.addEventListener("click",i=>{i.target===e&&(T(),t.onCancel())})}function T(){let t=document.getElementById(ce);t&&t.remove()}var P="__fo_toast__";function Je(){if(document.getElementById(P+"_styles"))return;let t=document.createElement("style");t.id=P+"_styles",t.textContent=`
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
  `,document.head.appendChild(t)}function de(t){Je();let e=document.getElementById(P);e||(e=document.createElement("div"),e.id=P,document.body.appendChild(e)),e.textContent=t,e.classList.add("fo-visible"),clearTimeout(e.__fo_toast_timer),e.__fo_toast_timer=setTimeout(()=>{e.classList.remove("fo-visible")},3e3)}function Ve(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,o=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,r=g=>g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function n(g,w){return`<span class="${g}">${w}</span>`}let i=0,d=2,a=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function s(){return" ".repeat(i*d)}let f=[],_;for(e.lastIndex=0;(_=e.exec(t))!==null;){let g=_[0],w=_[1];if(g.startsWith("<!--")||g.startsWith("<!")){f.push(s()+n("fo-hd",r(g))+`
`);continue}if(!g.startsWith("<")){let E=g.trim();E&&f.push(s()+r(E)+`
`);continue}let v=g.startsWith("</"),L=g.endsWith("/>")||w&&a.has(w.toLowerCase());v&&(i=Math.max(0,i-1));let C=n("fo-hp","&lt;")+(v?n("fo-hp","/"):"");C+=n("fo-ht",r(w??""));let M=_[2]??"";if(M.trim()){o.lastIndex=0;let E;for(;(E=o.exec(M))!==null;){let F=E[1],c=E[2]??"";if(C+=" "+n("fo-ha",r(F)),c){let l=c.indexOf("="),u=c.slice(l+1).trim();C+=n("fo-hp","=")+n("fo-hv",r(u))}}}C+=L&&!v?n("fo-hp"," /&gt;"):n("fo-hp","&gt;"),f.push(s()+C+`
`),!v&&!L&&i++}return f.join("").trimEnd()}function Xe(t){let e=t.sessionHistory;if(!Array.isArray(e)||e.length===0)return"";let o=[];for(let r of e){let n=typeof r=="object"&&r?r:null;if(!n||!n.type||!n.data)continue;let i=Ze(n.timestamp);switch(n.type){case"navigation":{let d=Le(n.data.previousUrl),a=Le(n.data.url);o.push(`<div class="fo-history-line"><span class="fo-history-type">nav</span> ${i} ${x(d)} \u2192 ${x(a)}</div>`);break}case"input":{let d=n.data.component?` [${x(n.data.component)}]`:"",a=String(n.data.value??""),s=a.length>60?a.slice(0,57)+"...":a;o.push(`<div class="fo-history-line"><span class="fo-history-type">input</span> ${i} ${x(String(n.data.tagName??""))}${d} = "${x(s)}"</div>`);break}case"click":{let d=n.data.component?` [${x(n.data.component)}]`:"",a=n.data.text?` "${x(String(n.data.text))}"`:"";o.push(`<div class="fo-history-line"><span class="fo-history-type">click</span> ${i} ${x(String(n.data.tagName??""))}${d}${a}</div>`);break}}}return o.length===0?"":`
    <details class="fo-meta-toggle">
      <summary>Session history (last ${o.length} events)</summary>
      <div class="fo-history-list">${o.join("")}</div>
    </details>`}function Ze(t){try{return new Date(t).toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}}function Le(t){if(!t)return"(initial page)";try{let e=new URL(t);return e.pathname+e.search+e.hash||"/"}catch{return t.length>80?t.slice(0,77)+"...":t}}function x(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var oe="__fo_indicator__",Qe=`
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
`;function et(t){let e=/Mac|iPhone|iPad|iPod/.test(navigator.platform);switch(t){case"ctrl+shift":return"Ctrl+Shift";case"meta+shift":return e?"\u2318+Shift":"Win+Shift";case"alt+shift":default:return e?"\u2325+Shift":"Alt+Shift"}}var te=null,S=null,I=null;function Oe(t){te||(te=document.createElement("style"),te.textContent=Qe,document.head.appendChild(te)),S||(S=document.createElement("div"),S.id=oe,document.body.appendChild(S));let e=et(t);S.innerHTML=`<span class="fo-bar-dot"></span>Comment mode\u2002\u2014\u2002press\xA0<span class="fo-bar-key">${e}</span>\xA0to exit`,S.style.display="flex",S.style.opacity="1",I&&(clearTimeout(I),I=null),I=setTimeout(()=>{S&&(S.style.opacity="0"),I=null},3e3)}function pe(){I&&(clearTimeout(I),I=null),S&&(S.style.opacity="0",S.style.display="none")}var tt=15,U=[],Ae=!1,Be="",ue=0;function fe(t){let e=t;for(;e&&e!==document.documentElement;){if(e.id&&e.id.startsWith("__fo_"))return!0;e=e.parentElement}return!1}function z(t,e){U.push({type:t,timestamp:new Date().toISOString(),data:e}),U.length>tt&&U.shift()}function Re(t){if(t.type==="password")return!0;let e=[t.name,t.id,t.getAttribute("autocomplete")??""].join(" ").toLowerCase();return/(password|passwd|pwd|secret|token|api[_-]?key|credit|card|cvv|cvc|ssn|social.?security|routing|iban)/.test(e)}function Pe(){if(Ae||window.top!==window.self)return;Ae=!0;let t=window.location.href;window.addEventListener("popstate",()=>{let o=window.location.href;o!==t&&(z("navigation",{url:o,previousUrl:t,title:document.title}),t=o)});let e="__fo_history_patched__";if(!history[e]){history[e]=!0;let o=history.pushState.bind(history);history.pushState=function(...n){let i=window.location.href,d=o(...n),a=window.location.href;return a!==i&&(z("navigation",{url:a,previousUrl:i,title:document.title}),t=a),d};let r=history.replaceState.bind(history);history.replaceState=function(...n){let i=window.location.href,d=r(...n),a=window.location.href;return a!==i&&(z("navigation",{url:a,previousUrl:i,title:document.title}),t=a),d}}document.addEventListener("input",o=>{let r=o.target;if(!r||fe(r))return;let n=r.tagName.toLowerCase();if(n!=="input"&&n!=="textarea")return;let i=r,d=A(r),a=R(r),s=`${d}_${n}`,f=Date.now();if(s===Be&&f-ue<500){let _=U[U.length-1];if(_?.type==="input"){_.data.value=Re(i)?"<redacted>":i.value,_.timestamp=new Date().toISOString(),ue=f;return}}Be=s,ue=f,z("input",{selector:d,component:a,tagName:n,inputType:i.type||"text",value:Re(i)?"<redacted>":i.value})},!0),document.addEventListener("change",o=>{let r=o.target;if(!r||fe(r)||r.tagName.toLowerCase()!=="select")return;let n=r;z("input",{selector:A(r),component:R(r),tagName:"select",inputType:"select",value:n.value})},!0),document.addEventListener("click",o=>{let r=o.target;if(!r||fe(r))return;let n=r.tagName.toLowerCase(),i=r.getAttribute("role");if(n!=="a"&&n!=="button"&&i!=="button")return;let d=(r.textContent||"").trim().slice(0,80);z("click",{selector:A(r),component:R(r),tagName:n,text:d})},!0)}function ze(){return U.slice()}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0,Pe();let e=ge(),o=new J(e),r=new V(e,o);o.setOnUnauthorized(()=>r.logout()),ye(e),be(async c=>{c==="active"?(Oe(e.hotkey),n()):c==="idle"?(pe(),d()):(c==="capturing"||c==="commenting")&&pe()});function n(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",_,!0),i()}async function i(){let c=window.location.href,[l,u]=await Promise.all([o.listBadges(c).catch(()=>[]),o.listIssueBadges(c).catch(()=>[])]);Ce(l,g,u)}function d(){document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",_,!0),re(),le(),T()}function a(c){let l=c.target;!l||l===document.body||l===document.documentElement||s(l)||Se(l)}function s(c){return c.id.startsWith("__fo_")}async function f(c){let l=A(c),u=v(c),h=w(c),y=h.findIndex(p=>!c.closest("[data-component]")||p.element===c.closest("[data-component]")),m=y>=0?y:0;if(O("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",_,!0),re(),r.isAuthenticated()||await new Promise((p,b)=>{He({onLogin:async()=>{await r.login(),p()},onCancel:()=>{O("idle"),b(new Error("cancelled"))}})}).catch(()=>{}),!r.isAuthenticated())return;let k=r.getUser(),B=(await o.listComments(window.location.href).catch(()=>[])).filter(p=>p.selector===l);O("commenting");let D=u.dataComponent??l.split(">").pop()?.trim()??l,H=B.length>0?`Feedback: ${B.length+1} comments on ${D}`:`Feedback on ${D}`;Me({selector:l,existingComments:B,context:u,user:k,defaultIssueTopic:H,repo:e.repo,branch:e.branch,appVersion:e.version,componentHierarchy:h.map((p,b)=>({name:p.name,isChild:b>m})),selectedComponentIdx:m,onComponentChange:p=>{T(),f(h[p].element)},onSubmit:async(p,b)=>{let N=await o.createFeedback({url:window.location.href,selector:l,comment:p,context:u,repo:e.repo,label:e.label,feedbackType:b});return await i(),O("active"),N.id},onExport:async(p,b,N)=>{let j=await o.exportIssue({ids:p,repo:e.repo,labels:[e.label,b],title:N});de("Issue created successfully!"),await i(),O("active")},onCancel:()=>{O("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",_,!0)}})}async function _(c){let l=c.target;!l||s(l)||(c.preventDefault(),c.stopPropagation(),he()==="active"&&await f(l))}function g(c,l){let u=null;try{u=document.querySelector(l)}catch{}u&&f(u)}function w(c){let l=[],u=c;for(;u&&u!==document.documentElement;){let m=u.getAttribute("data-component");m&&l.push({name:m,element:u}),u=u.parentElement}l.reverse();let h=l.length>0?l[l.length-1].element:null,y=[];return h&&h.querySelectorAll("[data-component]").forEach(m=>{m.parentElement?.closest("[data-component]")===h&&y.push({name:m.getAttribute("data-component"),element:m})}),[...l,...y]}function v(c){let l=c.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:c.tagName.toLowerCase(),dataComponent:L(c)??void 0,outerHTML:c.outerHTML?.slice(0,4e3)??"",innerText:c.innerText?.slice(0,200)??"",attributes:C(c),cssFramework:F(c),computedStyles:E(c),boundingRect:{top:Math.round(l.top),left:Math.round(l.left),width:Math.round(l.width),height:Math.round(l.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString(),...e.branch?{branch:e.branch}:{},...e.version?{appVersion:e.version}:{},sessionHistory:ze()}}function L(c){let l=c,u=[];for(;l&&l!==document.documentElement;){let h=l.getAttribute("data-component");if(h)return[h,...u.reverse()].join(" > ");u.push(l.tagName.toLowerCase()),l=l.parentElement}return null}function C(c){let l={};for(let u of Array.from(c.attributes))u.value.length<200&&(l[u.name]=u.value);return l}let M=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function E(c){let l=window.getComputedStyle(c),u={};for(let h of M){let y=l.getPropertyValue(h.replace(/([A-Z])/g,m=>`-${m.toLowerCase()}`)).trim();y&&y!=="none"&&y!=="normal"&&y!=="auto"&&y!=="0px"&&(u[h]=y)}return u}function F(c){let l=Array.from(c.classList).join(" "),u=c,h=[];for(let k=0;k<6&&u;k++)h.push(...Array.from(u.classList)),u=u.parentElement;let y=h.join(" "),m=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(y)&&m.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(l)&&m.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(y)&&m.push("Bootstrap"),/\bMui[A-Z]/.test(y)&&m.push("Material UI"),/\bchakra-/.test(y)&&m.push("Chakra UI"),(c.hasAttribute("data-radix-collection-item")||/\bradix-/.test(y))&&m.push("Radix UI"),m.includes("Tailwind CSS")&&m.includes("Radix UI")&&m.push("shadcn/ui"),m}})();})();
