"use strict";var FeedbackOverlay=(()=>{function Re(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function me(){let t=Re(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",n=t?.dataset.repo??"",r=t?.dataset.label??"feedback",o=t?.dataset.hotkey?.toLowerCase()??"",d=["alt+shift","ctrl+shift","meta+shift"].includes(o)?o:"alt+shift";n||console.warn("[feedback-overlay] data-repo is not set on the <script> tag.");let a=t?.dataset.branch?.trim()||void 0,s=t?.dataset.version?.trim()||void 0;return{apiBase:e,repo:n,label:r,hotkey:d,branch:a,version:s}}var V=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,n={}){let r=(n.method??"GET").toUpperCase(),o=r!=="GET"&&r!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+e,{...n,headers:{...o,...this.authHeaders(),...n.headers??{}}});if(!i.ok){i.status===401&&this.onUnauthorized&&this.onUnauthorized();let d=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${d}`)}return i.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listIssueBadges(e){return this.fetchJSON(`/issues?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var ze="feedback_overlay_auth",ne="__fo_user__",J=class{constructor(e,n){this.user=null;this.messageHandler=null;this.config=e,this.api=n,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,n)=>{let r=`${this.config.apiBase}/auth/github`,o=window.open(r,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!o){n(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{a(),n(new Error("Authentication timed out."))},300*1e3),d=f=>{if(f.data?.type!==ze)return;clearTimeout(i),a();let{token:b,login:u,avatar:v}=f.data;this.api.setToken(b),this.user={login:u,avatarUrl:v},this.saveUser(this.user),e(this.user)},a=()=>{window.removeEventListener("message",d),this.messageHandler=null,o.closed||o.close()};this.messageHandler=d,window.addEventListener("message",d);let s=setInterval(()=>{o.closed&&(clearInterval(s),this.messageHandler===d&&(a(),clearTimeout(i),n(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(ne,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(ne);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(ne)}catch{}}};var M="idle",X=[],j="Alt",ge="Shift",W=!1,G=!1,Z=!1;function q(t){M!==t&&(M=t,X.forEach(e=>e(t)))}function _e(){return M}function he(t){return X.push(t),()=>{X=X.filter(e=>e!==t)}}function A(t){q(t)}function be(t){switch(t.hotkey){case"ctrl+shift":j="Control";break;case"meta+shift":j="Meta";break;case"alt+shift":default:j="Alt";break}window.addEventListener("keydown",Ue,!0),window.addEventListener("keyup",Fe,!0),window.addEventListener("blur",De)}function Ue(t){if(t.key==="Escape"&&(M==="active"||M==="capturing")){q("idle");return}t.key===j&&(W=!0),t.key===ge&&(G=!0),W&&G&&!Z&&(Z=!0,M==="idle"?q("active"):M==="active"&&q("idle"))}function Fe(t){t.key===j&&(W=!1),t.key===ge&&(G=!1),(!W||!G)&&(Z=!1)}function De(){W=!1,G=!1,Z=!1,M==="active"&&q("idle")}function B(t){let e=[],n=t;for(;n&&n!==document.documentElement;){let r=n.getAttribute("data-testid");if(r){e.unshift(`[data-testid="${CSS.escape(r)}"]`);break}if(n.id&&!Ne(n.id)){e.unshift(`#${CSS.escape(n.id)}`);break}let o=n.getAttribute("data-component");if(o){let a=n.parentElement;if(a){let s=Array.from(a.children).filter(f=>f.getAttribute("data-component")===o);if(s.length>1){let f=s.indexOf(n)+1;e.unshift(`[data-component="${CSS.escape(o)}"]:nth-of-type(${s.indexOf(n)+1})`);let u=Array.from(a.children).filter(v=>v.tagName===n.tagName).indexOf(n)+1;e[0]=`[data-component="${CSS.escape(o)}"]:nth-of-type(${u})`}else e.unshift(`[data-component="${CSS.escape(o)}"]`);if(a.getAttribute("data-component")){let f=a.getAttribute("data-component");e.unshift(`[data-component="${CSS.escape(f)}"]`);break}n=a;continue}else{e.unshift(`[data-component="${CSS.escape(o)}"]`);break}}let i=n.parentElement,d=n.tagName.toLowerCase();if(i){let a=Array.from(i.children).filter(s=>s.tagName===n.tagName);if(a.length>1){let s=a.indexOf(n)+1;e.unshift(`${d}:nth-of-type(${s})`)}else e.unshift(d)}else e.unshift(d);n=i}return e.join(" > ")}function Ne(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function R(t){let e=t;for(;e&&e!==document.documentElement;){let n=e.getAttribute("data-component");if(n)return n;e=e.parentElement}return null}function xe(t){let e=t,n=[];for(;e&&e!==document.documentElement;){let d=e.getAttribute("data-component");if(d)return[d,...n.reverse()].join(" > ");n.push(e.tagName.toLowerCase()),e=e.parentElement}let r=t.tagName.toLowerCase(),o=t.id?`#${t.id}`:"",i=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${r}${o}${i}>`}var ve="__fo_highlight__",we="__fo_tooltip__",je="#22c55e",qe="rgba(34, 197, 94, 0.08)",We="#4f86f7",Ge="rgba(79, 134, 247, 0.08)",Ee=null;function ye(t,e="div"){let n=document.getElementById(t);return n||(n=document.createElement(e),n.id=t,document.body.appendChild(n)),n}function ke(t){Ee=t;let e=t.getBoundingClientRect(),n=window.scrollX,r=window.scrollY,o=R(t)!==null,i=o?je:We,d=o?qe:Ge,a=ye(ve);Object.assign(a.style,{position:"absolute",top:`${e.top+r}px`,left:`${e.left+n}px`,width:`${e.width}px`,height:`${e.height}px`,outline:`2px solid ${i}`,backgroundColor:d,pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let s=xe(t),f=ye(we);f.textContent=s;let b=Math.min(e.left+n,window.innerWidth+n-(s.length*7+16));Object.assign(f.style,{position:"absolute",top:`${e.top+r-26}px`,left:`${Math.max(4,b)}px`,background:i,color:"#fff",fontSize:"11px",fontFamily:"ui-monospace, 'SF Mono', Menlo, monospace",padding:"2px 7px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap"})}function ie(){Ee=null,document.getElementById(ve)?.remove(),document.getElementById(we)?.remove()}var re="__fo_badge__",Q=[],ee=null;function se(){Q.forEach(t=>t.remove()),Q=[],ee?.disconnect(),ee=null}function Se(t,e,n=[]){se();let r=[];t.forEach((i,d)=>{let a=null;try{a=document.querySelector(i.selector)}catch{return}if(!a)return;let s=document.createElement("div");s.id=`${re}${d}`,s.textContent=String(i.count),s.title=`${i.count} comment${i.count!==1?"s":""} on this element`,Object.assign(s.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),e(i.ids,i.selector)}),document.body.appendChild(s),Q.push(s),r.push({badge:s,selector:i.selector}),ae(s,a,0)}),n.forEach((i,d)=>{let a=null;try{a=document.querySelector(i.selector)}catch{return}if(!a)return;let s=document.createElement("div");s.id=`${re}issue_${d}`,s.textContent=`#${i.issue_number}`,s.title=`GitHub issue #${i.issue_number}: ${i.title}`,Object.assign(s.style,{position:"absolute",background:"#c0392b",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault(),window.open(i.issue_url,"_blank","noopener")}),document.body.appendChild(s),Q.push(s),r.push({badge:s,selector:i.selector}),ae(s,a,t.some(f=>f.selector===i.selector)?18:0)});let o=()=>{r.forEach(({badge:i,selector:d})=>{let a=null;try{a=document.querySelector(d)}catch{return}if(!a)return;let s=i.id.startsWith(`${re}issue_`),f=s?t.some(b=>b.selector===d):!1;ae(i,a,s&&f?18:0)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),ee=new ResizeObserver(o),ee.observe(document.body)}function ae(t,e,n=0){let r=e.getBoundingClientRect(),o=window.scrollX,i=window.scrollY;t.style.top=`${r.top+i-8+n}px`,t.style.left=`${r.right+o-8}px`}var le="__fo_dialog__",Ce="__fo_styles__";function Le(){if(document.getElementById(Ce))return;let t=document.createElement("style");t.id=Ce,t.textContent=`
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
  `,document.head.appendChild(t)}function $e(){let t=document.getElementById(le);return t||(t=document.createElement("div"),t.id=le,document.body.appendChild(t)),t}function Ie(t){Le();let e=$e(),n=t.existingComments,r=n.map(g=>g.id),o=t.context,i=n.length===0?"":`
    <div class="fo-comments">
      ${n.map(g=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${y(g.github_user)}</span>
            <span class="fo-comment-date">${y(g.created_at)}</span>
          </div>
          <div class="fo-comment-text">${y(g.comment)}</div>
        </div>`).join("")}
    </div>`,d=n.length>0?`${n.length} comment${n.length!==1?"s":""} on this element`:"Add feedback",a=[];t.repo&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">repo</span>${y(t.repo)}</span>`),t.branch&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">branch</span>${y(t.branch)}</span>`),t.appVersion&&a.push(`<span class="fo-target-chip"><span class="fo-target-chip-label">version</span>${y(t.appVersion)}</span>`);let s=a.length>0?`<div class="fo-target-strip">${a.join("")}</div>`:"",f=t.componentHierarchy??[],b=f.length>1?`
    <div class="fo-component-row">
      <span class="fo-component-label">Component</span>
      <select class="fo-component-select" id="__fo_component__">
        ${f.map((g,_)=>`<option value="${_}" ${_===(t.selectedComponentIdx??0)?"selected":""}>
          ${g.isChild?"\u21B3 ":""}${y(g.name)}
        </option>`).join("")}
      </select>
    </div>`:"",u=[],v=o.dataComponent;v&&u.push(["component",v]),u.push(["selector",t.selector]);let w=o.boundingRect;w&&u.push(["position",`top ${w.top}, left ${w.left} \u2014 ${w.width} \xD7 ${w.height} px`]),u.push(["url",String(o.url??window.location.href)]);let $=o.viewport,C=o.devicePixelRatio;$&&u.push(["viewport",`${$.width} \xD7 ${$.height} px${C&&C!==1?` (${C}\xD7 DPR)`:""}`]);let O=o.cssFramework;O?.length&&u.push(["css framework",O.join(", ")]);let E=o.computedStyles;if(E){let g=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(_=>E[_]).map(_=>`${_}: ${E[_]}`).join(`
`);g&&u.push(["computed styles",g])}let D=String(o.userAgent??navigator.userAgent);u.push(["user agent",D]);let c=u.map(([g,_])=>`
    <div class="fo-meta-key">${y(g)}</div>
    <div class="fo-meta-val">${y(_)}</div>`).join(""),l=o.outerHTML;e.innerHTML=`
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
          <div class="fo-meta-grid">${c}</div>
        </details>
        ${l?`
        <details class="fo-meta-toggle">
          <summary>Element HTML</summary>
          <pre class="fo-html-preview">${Ke(l)}</pre>
        </details>`:""}
        ${Ve(o)}
      </div>
      ${b}
      ${s}
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
  `;let p=e.querySelector("#__fo_comment__"),h=e.querySelector("#__fo_submit__"),x=e.querySelector("#__fo_cancel__"),m=e.querySelector("#__fo_export__"),k=e.querySelector("#__fo_err__"),Y=e.querySelector("#__fo_component__");Y&&t.onComponentChange&&Y.addEventListener("change",()=>{t.onComponentChange(parseInt(Y.value,10))});let P=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",ue=()=>e.querySelector("#__fo_topic__")?.value.trim()||t.defaultIssueTopic;p.focus(),x.addEventListener("click",()=>{T(),t.onCancel()}),h.addEventListener("click",async()=>{let g=p.value.trim();if(!g){k.textContent="Please enter a comment.";return}h.disabled=!0,h.textContent="Submitting\u2026",k.textContent="";try{await t.onSubmit(g,P()),T()}catch(_){k.textContent=String(_),h.disabled=!1,h.textContent="Submit"}}),m.addEventListener("click",async()=>{m.disabled=!0,m.textContent="Exporting\u2026",h.disabled=!0,k.textContent="";try{let g=p.value.trim(),_=P(),L=ue(),I=[...r];if(g){let K=await t.onSubmit(g,_);I=[...I,K]}if(I.length===0){k.textContent="Nothing to export \u2014 add a comment first.",m.disabled=!1,m.textContent="Send to GitHub",h.disabled=!1;return}T(),t.onExport(I,_,L).catch(K=>{ce(`Failed to create issue: ${String(K)}`)})}catch(g){k.textContent=String(g),m.disabled=!1,m.textContent="Send to GitHub",h.disabled=!1}}),e.addEventListener("click",g=>{g.target===e&&(T(),t.onCancel())});let N=g=>{g.key==="Escape"&&(T(),t.onCancel(),document.removeEventListener("keydown",N))};document.addEventListener("keydown",N)}function Me(t){Le();let e=$e();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let n=e.querySelector("#__fo_login__"),r=e.querySelector("#__fo_cancel__"),o=e.querySelector("#__fo_err__");n.addEventListener("click",async()=>{n.disabled=!0,n.textContent="Opening\u2026";try{await t.onLogin(),T()}catch(i){n.disabled=!1,n.textContent="Sign in with GitHub",o.textContent=String(i)}}),r.addEventListener("click",()=>{T(),t.onCancel()}),e.addEventListener("click",i=>{i.target===e&&(T(),t.onCancel())})}function T(){let t=document.getElementById(le);t&&t.remove()}var z="__fo_toast__";function Ye(){if(document.getElementById(z+"_styles"))return;let t=document.createElement("style");t.id=z+"_styles",t.textContent=`
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
  `,document.head.appendChild(t)}function ce(t){Ye();let e=document.getElementById(z);e||(e=document.createElement("div"),e.id=z,document.body.appendChild(e)),e.textContent=t,e.classList.add("fo-visible"),clearTimeout(e.__fo_toast_timer),e.__fo_toast_timer=setTimeout(()=>{e.classList.remove("fo-visible")},3e3)}function Ke(t){let e=/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*)\s*\/?>|[^<]+/gi,n=/([\w:-]+)(\s*=\s*(?:"([^"]*)")|'([^']*)'|([^\s>]*))?/g,r=u=>u.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function o(u,v){return`<span class="${u}">${v}</span>`}let i=0,d=2,a=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function s(){return" ".repeat(i*d)}let f=[],b;for(e.lastIndex=0;(b=e.exec(t))!==null;){let u=b[0],v=b[1];if(u.startsWith("<!--")||u.startsWith("<!")){f.push(s()+o("fo-hd",r(u))+`
`);continue}if(!u.startsWith("<")){let E=u.trim();E&&f.push(s()+r(E)+`
`);continue}let w=u.startsWith("</"),$=u.endsWith("/>")||v&&a.has(v.toLowerCase());w&&(i=Math.max(0,i-1));let C=o("fo-hp","&lt;")+(w?o("fo-hp","/"):"");C+=o("fo-ht",r(v??""));let O=b[2]??"";if(O.trim()){n.lastIndex=0;let E;for(;(E=n.exec(O))!==null;){let D=E[1],c=E[2]??"";if(C+=" "+o("fo-ha",r(D)),c){let l=c.indexOf("="),p=c.slice(l+1).trim();C+=o("fo-hp","=")+o("fo-hv",r(p))}}}C+=$&&!w?o("fo-hp"," /&gt;"):o("fo-hp","&gt;"),f.push(s()+C+`
`),!w&&!$&&i++}return f.join("").trimEnd()}function Ve(t){let e=t.sessionHistory;if(!Array.isArray(e)||e.length===0)return"";let n=[];for(let r of e){let o=typeof r=="object"&&r?r:null;if(!o||!o.type||!o.data)continue;let i=Je(o.timestamp);switch(o.type){case"navigation":{let d=Te(o.data.previousUrl),a=Te(o.data.url);n.push(`<div class="fo-history-line"><span class="fo-history-type">nav</span> ${i} ${y(d)} \u2192 ${y(a)}</div>`);break}case"input":{let d=o.data.component?` [${y(o.data.component)}]`:"",a=String(o.data.value??""),s=a.length>60?a.slice(0,57)+"...":a;n.push(`<div class="fo-history-line"><span class="fo-history-type">input</span> ${i} ${y(String(o.data.tagName??""))}${d} = "${y(s)}"</div>`);break}case"click":{let d=o.data.component?` [${y(o.data.component)}]`:"",a=o.data.text?` "${y(String(o.data.text))}"`:"";n.push(`<div class="fo-history-line"><span class="fo-history-type">click</span> ${i} ${y(String(o.data.tagName??""))}${d}${a}</div>`);break}}}return n.length===0?"":`
    <details class="fo-meta-toggle">
      <summary>Session history (last ${n.length} events)</summary>
      <div class="fo-history-list">${n.join("")}</div>
    </details>`}function Je(t){try{return new Date(t).toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}}function Te(t){if(!t)return"(initial page)";try{let e=new URL(t);return e.pathname+e.search+e.hash||"/"}catch{return t.length>80?t.slice(0,77)+"...":t}}function y(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var oe="__fo_indicator__",Xe=`
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
`;function Ze(t){let e=/Mac|iPhone|iPad|iPod/.test(navigator.platform);switch(t){case"ctrl+shift":return"Ctrl+Shift";case"meta+shift":return e?"\u2318+Shift":"Win+Shift";case"alt+shift":default:return e?"\u2325+Shift":"Alt+Shift"}}var te=null,S=null,H=null;function He(t){te||(te=document.createElement("style"),te.textContent=Xe,document.head.appendChild(te)),S||(S=document.createElement("div"),S.id=oe,document.body.appendChild(S));let e=Ze(t);S.innerHTML=`<span class="fo-bar-dot"></span>Comment mode\u2002\u2014\u2002press\xA0<span class="fo-bar-key">${e}</span>\xA0to exit`,S.style.display="flex",S.style.opacity="1",H&&(clearTimeout(H),H=null),H=setTimeout(()=>{S&&(S.style.opacity="0"),H=null},3e3)}function de(){H&&(clearTimeout(H),H=null),S&&(S.style.opacity="0",S.style.display="none")}var Qe=15,F=[],Oe=!1,Ae="",pe=0;function fe(t){let e=t;for(;e&&e!==document.documentElement;){if(e.id&&e.id.startsWith("__fo_"))return!0;e=e.parentElement}return!1}function U(t,e){F.push({type:t,timestamp:new Date().toISOString(),data:e}),F.length>Qe&&F.shift()}function Be(){if(Oe||window.top!==window.self)return;Oe=!0;let t=window.location.href;window.addEventListener("popstate",()=>{let r=window.location.href;r!==t&&(U("navigation",{url:r,previousUrl:t,title:document.title}),t=r)});let e=history.pushState.bind(history);history.pushState=function(...r){let o=window.location.href;e(...r);let i=window.location.href;i!==o&&(U("navigation",{url:i,previousUrl:o,title:document.title}),t=i)};let n=history.replaceState.bind(history);history.replaceState=function(...r){let o=window.location.href;n(...r);let i=window.location.href;i!==o&&(U("navigation",{url:i,previousUrl:o,title:document.title}),t=i)},document.addEventListener("input",r=>{let o=r.target;if(!o||fe(o))return;let i=o.tagName.toLowerCase();if(i!=="input"&&i!=="textarea")return;let d=o,a=B(o),s=R(o),f=`${a}_${i}`,b=Date.now();if(f===Ae&&b-pe<500){let u=F[F.length-1];if(u?.type==="input"){u.data.value=d.type==="password"?"<password>":d.value,u.timestamp=new Date().toISOString(),pe=b;return}}Ae=f,pe=b,U("input",{selector:a,component:s,tagName:i,inputType:d.type||"text",value:d.type==="password"?"<password>":d.value})},!0),document.addEventListener("change",r=>{let o=r.target;if(!o||fe(o)||o.tagName.toLowerCase()!=="select")return;let i=o;U("input",{selector:B(o),component:R(o),tagName:"select",inputType:"select",value:i.value})},!0),document.addEventListener("click",r=>{let o=r.target;if(!o||fe(o))return;let i=o.tagName.toLowerCase(),d=o.getAttribute("role");if(i!=="a"&&i!=="button"&&d!=="button")return;let a=(o.textContent||"").trim().slice(0,80);U("click",{selector:B(o),component:R(o),tagName:i,text:a})},!0)}function Pe(){return F.slice()}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0,Be();let e=me(),n=new V(e),r=new J(e,n);n.setOnUnauthorized(()=>r.logout()),be(e),he(async c=>{c==="active"?(He(e.hotkey),o()):c==="idle"?(de(),d()):(c==="capturing"||c==="commenting")&&de()});function o(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",b,!0),i()}async function i(){let c=window.location.href,[l,p]=await Promise.all([n.listBadges(c).catch(()=>[]),n.listIssueBadges(c).catch(()=>[])]);Se(l,u,p)}function d(){document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",b,!0),ie(),se(),T()}function a(c){let l=c.target;!l||l===document.body||l===document.documentElement||s(l)||ke(l)}function s(c){return c.id.startsWith("__fo_")}async function f(c){let l=B(c),p=w(c),h=v(c),x=h.findIndex(_=>!c.closest("[data-component]")||_.element===c.closest("[data-component]")),m=x>=0?x:0;if(A("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",b,!0),ie(),r.isAuthenticated()||await new Promise((_,L)=>{Me({onLogin:async()=>{await r.login(),_()},onCancel:()=>{A("idle"),L(new Error("cancelled"))}})}).catch(()=>{}),!r.isAuthenticated())return;let k=r.getUser(),P=(await n.listComments(window.location.href).catch(()=>[])).filter(_=>_.selector===l);A("commenting");let N=p.dataComponent??l.split(">").pop()?.trim()??l,g=P.length>0?`Feedback: ${P.length+1} comments on ${N}`:`Feedback on ${N}`;Ie({selector:l,existingComments:P,context:p,user:k,defaultIssueTopic:g,repo:e.repo,branch:e.branch,appVersion:e.version,componentHierarchy:h.map((_,L)=>({name:_.name,isChild:L>m})),selectedComponentIdx:m,onComponentChange:_=>{T(),f(h[_].element)},onSubmit:async(_,L)=>{let I=await n.createFeedback({url:window.location.href,selector:l,comment:_,context:p,repo:e.repo,label:e.label,feedbackType:L});return await i(),A("active"),I.id},onExport:async(_,L,I)=>{let K=await n.exportIssue({ids:_,repo:e.repo,labels:[e.label,L],title:I});ce("Issue created successfully!"),await i(),A("active")},onCancel:()=>{A("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",b,!0)}})}async function b(c){let l=c.target;!l||s(l)||(c.preventDefault(),c.stopPropagation(),_e()==="active"&&await f(l))}function u(c,l){let p=null;try{p=document.querySelector(l)}catch{}p&&f(p)}function v(c){let l=[],p=c;for(;p&&p!==document.documentElement;){let m=p.getAttribute("data-component");m&&l.push({name:m,element:p}),p=p.parentElement}l.reverse();let h=l.length>0?l[l.length-1].element:null,x=[];return h&&h.querySelectorAll("[data-component]").forEach(m=>{m.parentElement?.closest("[data-component]")===h&&x.push({name:m.getAttribute("data-component"),element:m})}),[...l,...x]}function w(c){let l=c.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:c.tagName.toLowerCase(),dataComponent:$(c)??void 0,outerHTML:c.outerHTML?.slice(0,4e3)??"",innerText:c.innerText?.slice(0,200)??"",attributes:C(c),cssFramework:D(c),computedStyles:E(c),boundingRect:{top:Math.round(l.top),left:Math.round(l.left),width:Math.round(l.width),height:Math.round(l.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString(),...e.branch?{branch:e.branch}:{},...e.version?{appVersion:e.version}:{},sessionHistory:Pe()}}function $(c){let l=c,p=[];for(;l&&l!==document.documentElement;){let h=l.getAttribute("data-component");if(h)return[h,...p.reverse()].join(" > ");p.push(l.tagName.toLowerCase()),l=l.parentElement}return null}function C(c){let l={};for(let p of Array.from(c.attributes))p.value.length<200&&(l[p.name]=p.value);return l}let O=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function E(c){let l=window.getComputedStyle(c),p={};for(let h of O){let x=l.getPropertyValue(h.replace(/([A-Z])/g,m=>`-${m.toLowerCase()}`)).trim();x&&x!=="none"&&x!=="normal"&&x!=="auto"&&x!=="0px"&&(p[h]=x)}return p}function D(c){let l=Array.from(c.classList).join(" "),p=c,h=[];for(let k=0;k<6&&p;k++)h.push(...Array.from(p.classList)),p=p.parentElement;let x=h.join(" "),m=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(x)&&m.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(l)&&m.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(x)&&m.push("Bootstrap"),/\bMui[A-Z]/.test(x)&&m.push("Material UI"),/\bchakra-/.test(x)&&m.push("Chakra UI"),(c.hasAttribute("data-radix-collection-item")||/\bradix-/.test(x))&&m.push("Radix UI"),m.includes("Tailwind CSS")&&m.includes("Radix UI")&&m.push("shadcn/ui"),m}})();})();
