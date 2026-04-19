"use strict";var FeedbackOverlay=(()=>{function oe(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function P(){let e=oe(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var E=class{constructor(t){this.token=null;this.base=t.apiBase}setToken(t){this.token=t,sessionStorage.setItem("__fo_token__",t)}loadToken(){this.token=sessionStorage.getItem("__fo_token__")}clearToken(){this.token=null,sessionStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),a=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+t,{...o,headers:{...a,...this.authHeaders(),...o.headers??{}}});if(!i.ok){let r=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${r}`)}return i.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}async getMe(){return this.fetchJSON("/me")}};var ne="feedback_overlay_auth",k=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()}async tryRestoreSession(){if(!this.api.isAuthenticated())return!1;try{let t=await this.api.getMe();return this.user={login:t.login,avatarUrl:t.avatar_url},!0}catch{return this.api.clearToken(),!1}}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,a=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!a){o(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{l(),o(new Error("Authentication timed out."))},300*1e3),r=g=>{if(g.data?.type!==ne)return;clearTimeout(i),l();let{token:O,login:I,avatar:s}=g.data;this.api.setToken(O),this.user={login:I,avatarUrl:s},t(this.user)},l=()=>{window.removeEventListener("message",r),this.messageHandler=null,a.closed||a.close()};this.messageHandler=r,window.addEventListener("message",r);let d=setInterval(()=>{a.closed&&(clearInterval(d),this.messageHandler===r&&(l(),clearTimeout(i),o(new Error("Authentication cancelled."))))},500)})}logout(){this.user=null,this.api.clearToken()}};var U="Shift",b="idle",S=[],y=!1,w=!1;function L(e){b!==e&&(b=e,S.forEach(t=>t(e)))}function z(){return b}function F(e){return S.push(e),()=>{S=S.filter(t=>t!==e)}}function v(e){L(e)}function q(){window.addEventListener("keydown",ie,!0),window.addEventListener("keyup",re,!0),window.addEventListener("blur",ae)}function ie(e){e.key==="Alt"&&(y=!0),e.key===U&&(w=!0),y&&w&&b==="idle"&&L("active")}function re(e){e.key==="Alt"&&(y=!1),e.key===U&&(w=!1),!y&&!w&&b!=="idle"&&L("idle")}function ae(){y=!1,w=!1,b!=="idle"&&L("idle")}function H(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!N(e.id)?`#${CSS.escape(e.id)}`:se(e)}function N(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function se(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),a=o.parentElement,i=o.getAttribute("data-testid");if(i){t.unshift(`[data-testid="${CSS.escape(i)}"]`);break}if(o.id&&!N(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(a){let r=Array.from(a.children).filter(l=>l.tagName===o.tagName);if(r.length>1){let l=r.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${l})`)}else t.unshift(n)}else t.unshift(n);o=a}return t.join(" > ")}function j(e){let t=e.tagName.toLowerCase(),o=e.id?`#${e.id}`:"",n=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${o}${n}>`}var J="__fo_highlight__",Y="__fo_tooltip__",K=null;function G(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function W(e){K=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,a=G(J);Object.assign(a.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let i=G(Y);i.textContent=j(e),Object.assign(i.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function B(){K=null,document.getElementById(J)?.remove(),document.getElementById(Y)?.remove()}var le="__fo_badge__",C=[],M=null;function A(){C.forEach(e=>e.remove()),C=[],M?.disconnect(),M=null}function T(e,t){A(),e.forEach((n,a)=>{let i=null;try{i=document.querySelector(n.selector)}catch{return}if(!i)return;let r=document.createElement("div");r.id=`${le}${a}`,r.textContent=String(n.count),r.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(r.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),r.addEventListener("click",l=>{l.stopPropagation(),l.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(r),C.push(r),X(r,i)});let o=()=>{C.forEach((n,a)=>{let i=e[a];if(!i)return;let r=null;try{r=document.querySelector(i.selector)}catch{return}r&&X(n,r)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),M=new ResizeObserver(o),M.observe(document.body)}function X(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,a=window.scrollY;e.style.top=`${o.top+a-8}px`,e.style.left=`${o.right+n-8}px`}async function V(e){if(!navigator.mediaDevices?.getDisplayMedia)return console.warn("[feedback-overlay] getDisplayMedia not available."),null;let t=null;try{t=await navigator.mediaDevices.getDisplayMedia({video:{preferCurrentTab:!0,displaySurface:"browser"},audio:!1})}catch(o){return console.info("[feedback-overlay] Screen capture cancelled:",o),null}try{let o=t.getVideoTracks()[0],a=await new ImageCapture(o).grabFrame(),i=e.getBoundingClientRect(),r=window.devicePixelRatio||1,l=document.createElement("canvas");return l.width=Math.round(i.width*r),l.height=Math.round(i.height*r),l.getContext("2d").drawImage(a,Math.round(i.left*r),Math.round(i.top*r),l.width,l.height,0,0,l.width,l.height),a.close(),{dataURL:l.toDataURL("image/png")}}finally{t.getTracks().forEach(o=>o.stop())}}var D="__fo_dialog__",Q="__fo_styles__";function Z(){if(document.getElementById(Q))return;let e=document.createElement("style");e.id=Q,e.textContent=`
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
    #__fo_dialog__ .fo-card {
      background: #fff;
      border-radius: 10px;
      padding: 0;
      width: 680px;
      max-width: calc(100vw - 32px);
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
    }
    #__fo_dialog__ .fo-header {
      padding: 16px 20px 12px;
      border-bottom: 1px solid #e8e8e8;
    }
    #__fo_dialog__ .fo-header h2 {
      margin: 0 0 2px;
      font-size: 15px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_dialog__ .fo-header .fo-meta {
      font-size: 11px;
      color: #444;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      word-break: break-all;
    }
    #__fo_dialog__ .fo-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }
    #__fo_dialog__ .fo-body.fo-no-screenshot {
      flex-direction: column;
      padding: 16px 20px;
    }
    #__fo_dialog__ .fo-form-col {
      flex: 1;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      min-width: 0;
    }
    #__fo_dialog__ .fo-screenshot-col {
      width: 220px;
      flex-shrink: 0;
      border-left: 1px solid #e8e8e8;
      background: #f7f7f7;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 16px 12px;
      overflow: hidden;
    }
    #__fo_dialog__ .fo-screenshot-col img {
      width: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
      object-fit: contain;
      max-height: 300px;
    }
    #__fo_dialog__ .fo-user-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #222;
      font-weight: 500;
    }
    #__fo_dialog__ .fo-user-bar img {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #ddd;
    }
    #__fo_dialog__ textarea {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 9px 11px;
      font-size: 13px;
      color: #111;
      resize: vertical;
      min-height: 90px;
      outline: none;
      line-height: 1.5;
      flex: 1;
    }
    #__fo_dialog__ textarea:focus { border-color: #4f86f7; box-shadow: 0 0 0 3px rgba(79,134,247,0.15); }
    #__fo_dialog__ textarea::placeholder { color: #999; }
    #__fo_dialog__ .fo-footer {
      padding: 12px 20px;
      border-top: 1px solid #e8e8e8;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      background: #fafafa;
    }
    #__fo_dialog__ button {
      padding: 7px 18px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s;
    }
    #__fo_dialog__ .fo-btn-primary {
      background: #4f86f7;
      color: #fff;
    }
    #__fo_dialog__ .fo-btn-primary:hover { background: #3a6fd8; }
    #__fo_dialog__ .fo-btn-primary:disabled { background: #a0baf7; cursor: default; }
    #__fo_dialog__ .fo-btn-secondary {
      background: #efefef;
      color: #222;
    }
    #__fo_dialog__ .fo-btn-secondary:hover { background: #e0e0e0; }
    #__fo_dialog__ .fo-btn-danger {
      background: #e53e3e;
      color: #fff;
    }
    #__fo_dialog__ .fo-error {
      color: #c53030;
      font-size: 12px;
      font-weight: 500;
    }
    #__fo_dialog__ .fo-screenshot-label {
      font-size: 10px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    #__fo_dialog__ .fo-comment-list {
      list-style: none;
      padding: 0;
      margin: 0 0 12px;
    }
    #__fo_dialog__ .fo-comment-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
      color: #222;
    }
    #__fo_dialog__ .fo-comment-list li:last-child { border-bottom: none; }
    #__fo_dialog__ .fo-comment-author {
      font-weight: 600;
      color: #111;
      margin-right: 4px;
    }
    #__fo_dialog__ .fo-comment-date {
      color: #888;
      font-size: 11px;
    }
    /* Login dialog */
    #__fo_dialog__ .fo-login-card {
      background: #fff;
      border-radius: 10px;
      padding: 28px 28px 20px;
      width: 360px;
      max-width: calc(100vw - 32px);
      box-shadow: 0 12px 48px rgba(0,0,0,0.3);
    }
    #__fo_dialog__ .fo-login-card h2 {
      margin: 0 0 6px;
      font-size: 16px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_dialog__ .fo-login-card .fo-meta {
      font-size: 13px;
      color: #444;
      margin-bottom: 20px;
    }
    #__fo_dialog__ .fo-login-card .fo-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `,document.head.appendChild(e)}function ee(){let e=document.getElementById(D);return e||(e=document.createElement("div"),e.id=D,document.body.appendChild(e)),e}function te(e){Z();let t=ee(),o=!!e.screenshotDataURL;t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>Submit Feedback</h2>
        <div class="fo-meta">${$(e.selector)}</div>
      </div>
      <div class="fo-body${o?"":" fo-no-screenshot"}">
        <div class="fo-form-col">
          <div class="fo-user-bar">
            <img src="${$(e.user.avatarUrl)}" alt="avatar">
            <span>Signed in as <strong>${$(e.user.login)}</strong></span>
          </div>
          <textarea id="__fo_comment__" placeholder="Describe the issue or leave a comment\u2026"></textarea>
          <div class="fo-error" id="__fo_err__"></div>
        </div>
        ${o?`
        <div class="fo-screenshot-col">
          <div>
            <div class="fo-screenshot-label">Screenshot</div>
            <img src="${e.screenshotDataURL}" alt="Screenshot preview">
          </div>
        </div>`:""}
      </div>
      <div class="fo-footer">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit Feedback</button>
      </div>
    </div>
  `;let n=t.querySelector("#__fo_comment__"),a=t.querySelector("#__fo_submit__"),i=t.querySelector("#__fo_cancel__"),r=t.querySelector("#__fo_err__");n.focus(),i.addEventListener("click",()=>{f(),e.onCancel()}),a.addEventListener("click",async()=>{let d=n.value.trim();if(!d){r.textContent="Please enter a comment.";return}a.disabled=!0,a.textContent="Submitting\u2026",r.textContent="";try{await e.onSubmit(d),f()}catch(g){r.textContent=String(g),a.disabled=!1,a.textContent="Submit Feedback"}}),t.addEventListener("click",d=>{d.target===t&&(f(),e.onCancel())});let l=d=>{d.key==="Escape"&&(f(),e.onCancel(),document.removeEventListener("keydown",l))};document.addEventListener("keydown",l)}function R(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">Authentication required to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),f()}catch(a){o.disabled=!1,o.textContent="Sign in with GitHub";let i=document.createElement("div");i.className="fo-error",i.style.marginTop="8px",i.textContent=String(a),o.parentElement?.insertAdjacentElement("afterend",i)}}),n.addEventListener("click",()=>{f(),e.onCancel()}),t.addEventListener("click",a=>{a.target===t&&(f(),e.onCancel())})}function f(){let e=document.getElementById(D);e&&e.remove()}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=P(),o=new E(t),n=new k(t,o);n.tryRestoreSession().catch(()=>{}),q(),F(async s=>{s==="active"?a():s==="idle"&&i()});function a(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",d,!0),o.listBadges(window.location.href).then(s=>{T(s,g)}).catch(()=>{})}function i(){document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",d,!0),B(),A(),f()}function r(s){let c=s.target;!c||c===document.body||c===document.documentElement||l(c)||W(c)}function l(s){return s.id.startsWith("__fo_")}async function d(s){let c=s.target;if(!c||l(c)||(s.preventDefault(),s.stopPropagation(),z()!=="active"))return;let p=H(c),x=O(c);if(v("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",d,!0),B(),n.isAuthenticated()||await new Promise((_,h)=>{R({onLogin:async()=>{await n.login(),_()},onCancel:()=>{v("idle"),h(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let u=n.getUser(),m=await V(c);v("commenting"),te({selector:p,screenshotDataURL:m?.dataURL??null,context:x,user:u,onSubmit:async _=>{await o.createFeedback({url:window.location.href,selector:p,comment:_,context:x,screenshot:m?.dataURL,repo:t.repo,label:t.label}),v("active");let h=await o.listBadges(window.location.href);T(h,g)},onCancel:()=>{v("idle")}})}function g(s,c){if(!n.isAuthenticated()){R({onLogin:async()=>{await n.login(),g(s,c)},onCancel:()=>{}});return}let p=n.getUser(),x="__fo_dialog__",u=document.getElementById(x);u||(u=document.createElement("div"),u.id=x,document.body.appendChild(u)),u.innerHTML=`
      <div class="fo-card">
        <h2>${s.length} comment${s.length!==1?"s":""} on this element</h2>
        <div class="fo-meta">${c}</div>
        <div class="fo-user-bar">
          <img src="${p.avatarUrl}" alt="avatar">
          <span>Signed in as <strong>${p.login}</strong></span>
        </div>
        <div class="fo-actions">
          <button class="fo-btn-secondary" id="__fo_cancel__">Close</button>
          <button class="fo-btn-primary" id="__fo_export__">Export to GitHub Issue</button>
        </div>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
    `,u.querySelector("#__fo_cancel__")?.addEventListener("click",()=>{f()}),u.querySelector("#__fo_export__")?.addEventListener("click",async()=>{let m=u.querySelector("#__fo_export__");m.disabled=!0,m.textContent="Exporting\u2026";try{let _=await o.exportIssue({ids:s,repo:t.repo,labels:[t.label]});window.open(_.issue_url,"_blank"),f();let h=await o.listBadges(window.location.href);T(h,g)}catch(_){let h=u.querySelector("#__fo_err__");h.textContent=String(_),m.disabled=!1,m.textContent="Export to GitHub Issue"}})}function O(s){let c=s.getBoundingClientRect();return{tagName:s.tagName.toLowerCase(),innerText:s.innerText?.slice(0,200)??"",attributes:I(s),boundingRect:{top:Math.round(c.top),left:Math.round(c.left),width:Math.round(c.width),height:Math.round(c.height)},viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,userAgent:navigator.userAgent,url:window.location.href,timestamp:new Date().toISOString()}}function I(s){let c={};for(let p of Array.from(s.attributes))p.value.length<200&&(c[p.name]=p.value);return c}})();})();
