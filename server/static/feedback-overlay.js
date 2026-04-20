"use strict";var FeedbackOverlay=(()=>{function fe(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function Y(){let e=fe(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var H=class{constructor(t){this.token=null;this.onUnauthorized=null;this.base=t.apiBase}setOnUnauthorized(t){this.onUnauthorized=t}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),r=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},s=await fetch(this.base+t,{...o,headers:{...r,...this.authHeaders(),...o.headers??{}}});if(!s.ok){s.status===401&&this.onUnauthorized&&this.onUnauthorized();let c=await s.text().catch(()=>s.statusText);throw new Error(`${s.status}: ${c}`)}return s.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async listComments(t){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}};var ue="feedback_overlay_auth",j="__fo_user__",O=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,r=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!r){o(new Error("Popup was blocked. Please allow popups for this site."));return}let s=setTimeout(()=>{d(),o(new Error("Authentication timed out."))},300*1e3),c=_=>{if(_.data?.type!==ue)return;clearTimeout(s),d();let{token:b,login:w,avatar:S}=_.data;this.api.setToken(b),this.user={login:w,avatarUrl:S},this.saveUser(this.user),t(this.user)},d=()=>{window.removeEventListener("message",c),this.messageHandler=null,r.closed||r.close()};this.messageHandler=c,window.addEventListener("message",c);let y=setInterval(()=>{r.closed&&(clearInterval(y),this.messageHandler===c&&(d(),clearTimeout(s),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(j,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(j);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(j)}catch{}}};var J="Shift",C="idle",A=[],I=!1,M=!1;function B(e){C!==e&&(C=e,A.forEach(t=>t(e)))}function K(){return C}function X(e){return A.push(e),()=>{A=A.filter(t=>t!==e)}}function E(e){B(e)}function V(){window.addEventListener("keydown",pe,!0),window.addEventListener("keyup",ge,!0),window.addEventListener("blur",me)}function pe(e){e.key==="Alt"&&(I=!0),e.key===J&&(M=!0),I&&M&&C==="idle"&&B("active")}function ge(e){e.key==="Alt"&&(I=!1),e.key===J&&(M=!1),!I&&!M&&C==="active"&&B("idle")}function me(){I=!1,M=!1,C==="active"&&B("idle")}function q(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!Z(e.id)?`#${CSS.escape(e.id)}`:_e(e)}function Z(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function _e(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),r=o.parentElement,s=o.getAttribute("data-testid");if(s){t.unshift(`[data-testid="${CSS.escape(s)}"]`);break}if(o.id&&!Z(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(r){let c=Array.from(r.children).filter(d=>d.tagName===o.tagName);if(c.length>1){let d=c.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${d})`)}else t.unshift(n)}else t.unshift(n);o=r}return t.join(" > ")}function Q(e){let t=e;for(;t&&t!==document.documentElement;){let s=t.getAttribute("data-component");if(s)return s;t=t.parentElement}let o=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",r=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${o}${n}${r}>`}var te="__fo_highlight__",oe="__fo_tooltip__",ne=null;function ee(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function ie(e){ne=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,r=ee(te);Object.assign(r.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let s=ee(oe);s.textContent=Q(e),Object.assign(s.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function N(){ne=null,document.getElementById(te)?.remove(),document.getElementById(oe)?.remove()}var he="__fo_badge__",R=[],z=null;function G(){R.forEach(e=>e.remove()),R=[],z?.disconnect(),z=null}function P(e,t){G(),e.forEach((n,r)=>{let s=null;try{s=document.querySelector(n.selector)}catch{return}if(!s)return;let c=document.createElement("div");c.id=`${he}${r}`,c.textContent=String(n.count),c.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(c.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),c.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(c),R.push(c),re(c,s)});let o=()=>{R.forEach((n,r)=>{let s=e[r];if(!s)return;let c=null;try{c=document.querySelector(s.selector)}catch{return}c&&re(n,c)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),z=new ResizeObserver(o),z.observe(document.body)}function re(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,r=window.scrollY;e.style.top=`${o.top+r-8}px`,e.style.left=`${o.right+n-8}px`}var W="__fo_dialog__",ae="__fo_styles__";function se(){if(document.getElementById(ae))return;let e=document.createElement("style");e.id=ae,e.textContent=`
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
  `,document.head.appendChild(e)}function le(){let e=document.getElementById(W);return e||(e=document.createElement("div"),e.id=W,document.body.appendChild(e)),e}function ce(e){se();let t=le(),o=e.existingComments,n=o.map(l=>l.id),r=e.context,s=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(l=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${x(l.github_user)}</span>
            <span class="fo-comment-date">${x(l.created_at)}</span>
          </div>
          <div class="fo-comment-text">${x(l.comment)}</div>
        </div>`).join("")}
    </div>`,c=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback",d=[],y=be(e.selector,r);y&&d.push(["component",y]),d.push(["selector",e.selector]);let _=r.boundingRect;_&&d.push(["position",`top ${_.top}, left ${_.left} \u2014 ${_.width} \xD7 ${_.height} px`]),d.push(["url",String(r.url??window.location.href)]);let b=r.viewport,w=r.devicePixelRatio;b&&d.push(["viewport",`${b.width} \xD7 ${b.height} px${w&&w!==1?` (${w}\xD7 DPR)`:""}`]);let S=r.cssFramework;S?.length&&d.push(["css framework",S.join(", ")]);let T=r.computedStyles;if(T){let l=["display","position","color","backgroundColor","fontSize","fontFamily","fontWeight","padding","margin","borderRadius"].filter(g=>T[g]).map(g=>`${g}: ${T[g]}`).join(`
`);l&&d.push(["computed styles",l])}let U=String(r.userAgent??navigator.userAgent);d.push(["user agent",U]);let F=d.map(([l,g])=>`
    <div class="fo-meta-key">${x(l)}</div>
    <div class="fo-meta-val">${x(g)}</div>`).join("");t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>${c}</h2>
        <div class="fo-selector">${x(e.selector)}</div>
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
        <details class="fo-meta-toggle">
          <summary>Context that will be attached</summary>
          <div class="fo-meta-grid">${F}</div>
        </details>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
      <div class="fo-footer">
        <button class="fo-btn-export" id="__fo_export__">Send to GitHub</button>
        <div class="fo-footer-spacer"></div>
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
      </div>
    </div>
  `;let a=t.querySelector("#__fo_comment__"),i=t.querySelector("#__fo_submit__"),f=t.querySelector("#__fo_cancel__"),m=t.querySelector("#__fo_export__"),u=t.querySelector("#__fo_err__"),p=()=>t.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement",k=()=>t.querySelector("#__fo_topic__")?.value.trim()||e.defaultIssueTopic;a.focus(),f.addEventListener("click",()=>{h(),e.onCancel()}),i.addEventListener("click",async()=>{let l=a.value.trim();if(!l){u.textContent="Please enter a comment.";return}i.disabled=!0,i.textContent="Submitting\u2026",u.textContent="";try{await e.onSubmit(l,p()),h()}catch(g){u.textContent=String(g),i.disabled=!1,i.textContent="Submit"}}),m.addEventListener("click",async()=>{m.disabled=!0,m.textContent="Exporting\u2026",i.disabled=!0,u.textContent="";try{let l=a.value.trim(),g=p(),L=k(),v=[...n];if(l){let D=await e.onSubmit(l,g);v=[...v,D]}if(v.length===0){u.textContent="Nothing to export \u2014 add a comment first.",m.disabled=!1,m.textContent="Send to GitHub",i.disabled=!1;return}await e.onExport(v,g,L),h()}catch(l){u.textContent=String(l),m.disabled=!1,m.textContent="Send to GitHub",i.disabled=!1}}),t.addEventListener("click",l=>{l.target===t&&(h(),e.onCancel())});let $=l=>{l.key==="Escape"&&(h(),e.onCancel(),document.removeEventListener("keydown",$))};document.addEventListener("keydown",$)}function de(e){se();let t=le();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__"),r=t.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),h()}catch(s){o.disabled=!1,o.textContent="Sign in with GitHub",r.textContent=String(s)}}),n.addEventListener("click",()=>{h(),e.onCancel()}),t.addEventListener("click",s=>{s.target===t&&(h(),e.onCancel())})}function h(){let e=document.getElementById(W);e&&e.remove()}function be(e,t){let o=t.attributes;if(o?.["data-component"])return o["data-component"];let n=t.outerHTML;if(n){let r=n.match(/data-component="([^"]+)"/);if(r)return r[1]}return null}function x(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=Y(),o=new H(t),n=new O(t,o);o.setOnUnauthorized(()=>n.logout()),V(),X(async a=>{a==="active"?r():a==="idle"&&s()});function r(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",c,!0),document.addEventListener("click",_,!0),o.listBadges(window.location.href).then(a=>P(a,b)).catch(()=>{})}function s(){document.body.style.cursor="",document.removeEventListener("mouseover",c,!0),document.removeEventListener("click",_,!0),N(),G(),h()}function c(a){let i=a.target;!i||i===document.body||i===document.documentElement||d(i)||ie(i)}function d(a){return a.id.startsWith("__fo_")}async function y(a){let i=q(a),f=w(a);if(E("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",c,!0),document.removeEventListener("click",_,!0),N(),n.isAuthenticated()||await new Promise((l,g)=>{de({onLogin:async()=>{await n.login(),l()},onCancel:()=>{E("idle"),g(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let m=n.getUser(),p=(await o.listComments(window.location.href).catch(()=>[])).filter(l=>l.selector===i);E("commenting");let k=i.split(">").pop()?.trim()??i,$=p.length>0?`Feedback: ${p.length+1} comments on ${k}`:`Feedback on ${k}`;ce({selector:i,existingComments:p,context:f,user:m,defaultIssueTopic:$,onSubmit:async(l,g)=>{let L=await o.createFeedback({url:window.location.href,selector:i,comment:l,context:f,repo:t.repo,label:t.label,feedbackType:g}),v=await o.listBadges(window.location.href).catch(()=>[]);return P(v,b),E("active"),L.id},onExport:async(l,g,L)=>{let v=await o.exportIssue({ids:l,repo:t.repo,labels:[t.label,g],title:L});window.open(v.issue_url,"_blank");let D=await o.listBadges(window.location.href).catch(()=>[]);P(D,b),E("active")},onCancel:()=>{E("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",c,!0),document.addEventListener("click",_,!0)}})}async function _(a){let i=a.target;!i||d(i)||(a.preventDefault(),a.stopPropagation(),K()==="active"&&await y(i))}function b(a,i){let f=null;try{f=document.querySelector(i)}catch{}f&&y(f)}function w(a){let i=a.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:a.tagName.toLowerCase(),outerHTML:a.outerHTML?.slice(0,4e3)??"",innerText:a.innerText?.slice(0,200)??"",attributes:S(a),cssFramework:F(a),computedStyles:U(a),boundingRect:{top:Math.round(i.top),left:Math.round(i.left),width:Math.round(i.width),height:Math.round(i.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function S(a){let i={};for(let f of Array.from(a.attributes))f.value.length<200&&(i[f.name]=f.value);return i}let T=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function U(a){let i=window.getComputedStyle(a),f={};for(let m of T){let u=i.getPropertyValue(m.replace(/([A-Z])/g,p=>`-${p.toLowerCase()}`)).trim();u&&u!=="none"&&u!=="normal"&&u!=="auto"&&u!=="0px"&&(f[m]=u)}return f}function F(a){let i=Array.from(a.classList).join(" "),f=a,m=[];for(let k=0;k<6&&f;k++)m.push(...Array.from(f.classList)),f=f.parentElement;let u=m.join(" "),p=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(u)&&p.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(i)&&p.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(u)&&p.push("Bootstrap"),/\bMui[A-Z]/.test(u)&&p.push("Material UI"),/\bchakra-/.test(u)&&p.push("Chakra UI"),(a.hasAttribute("data-radix-collection-item")||/\bradix-/.test(u))&&p.push("Radix UI"),p.includes("Tailwind CSS")&&p.includes("Radix UI")&&p.push("shadcn/ui"),p}})();})();
