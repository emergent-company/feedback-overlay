"use strict";var FeedbackOverlay=(()=>{function ne(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function P(){let e=ne(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",n=e?.dataset.repo??"",o=e?.dataset.label??"feedback";return n||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:n,label:o}}var E=class{constructor(t){this.token=null;this.base=t.apiBase}setToken(t){this.token=t,sessionStorage.setItem("__fo_token__",t)}loadToken(){this.token=sessionStorage.getItem("__fo_token__")}clearToken(){this.token=null,sessionStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,n={}){let o=await fetch(this.base+t,{...n,headers:{"Content-Type":"application/json",...this.authHeaders(),...n.headers??{}}});if(!o.ok){let s=await o.text().catch(()=>o.statusText);throw new Error(`${o.status}: ${s}`)}return o.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}async getMe(){return this.fetchJSON("/me")}};var oe="feedback_overlay_auth",k=class{constructor(t,n){this.user=null;this.messageHandler=null;this.config=t,this.api=n,this.api.loadToken()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()}async tryRestoreSession(){if(!this.api.isAuthenticated())return!1;try{let t=await this.api.getMe();return this.user={login:t.login,avatarUrl:t.avatar_url},!0}catch{return this.api.clearToken(),!1}}login(){return new Promise((t,n)=>{let o=`${this.config.apiBase}/auth/github`,s=window.open(o,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!s){n(new Error("Popup was blocked. Please allow popups for this site."));return}let r=setTimeout(()=>{a(),n(new Error("Authentication timed out."))},300*1e3),i=m=>{if(m.data?.type!==oe)return;clearTimeout(r),a();let{token:O,login:I,avatar:l}=m.data;this.api.setToken(O),this.user={login:I,avatarUrl:l},t(this.user)},a=()=>{window.removeEventListener("message",i),this.messageHandler=null,s.closed||s.close()};this.messageHandler=i,window.addEventListener("message",i);let g=setInterval(()=>{s.closed&&(clearInterval(g),this.messageHandler===i&&(a(),clearTimeout(r),n(new Error("Authentication cancelled."))))},500)})}logout(){this.user=null,this.api.clearToken()}};var U="Shift",b="idle",S=[],y=!1,w=!1;function L(e){b!==e&&(b=e,S.forEach(t=>t(e)))}function z(){return b}function q(e){return S.push(e),()=>{S=S.filter(t=>t!==e)}}function v(e){L(e)}function F(){window.addEventListener("keydown",ie,!0),window.addEventListener("keyup",re,!0),window.addEventListener("blur",ae)}function ie(e){e.key==="Alt"&&(y=!0),e.key===U&&(w=!0),y&&w&&b==="idle"&&L("active")}function re(e){e.key==="Alt"&&(y=!1),e.key===U&&(w=!1),!y&&!w&&b==="active"&&L("idle")}function ae(){y=!1,w=!1,b==="active"&&L("idle")}function B(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!N(e.id)?`#${CSS.escape(e.id)}`:se(e)}function N(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function se(e){let t=[],n=e;for(;n&&n!==document.documentElement;){let o=n.tagName.toLowerCase(),s=n.parentElement,r=n.getAttribute("data-testid");if(r){t.unshift(`[data-testid="${CSS.escape(r)}"]`);break}if(n.id&&!N(n.id)){t.unshift(`#${CSS.escape(n.id)}`);break}if(s){let i=Array.from(s.children).filter(a=>a.tagName===n.tagName);if(i.length>1){let a=i.indexOf(n)+1;t.unshift(`${o}:nth-of-type(${a})`)}else t.unshift(o)}else t.unshift(o);n=s}return t.join(" > ")}function j(e){let t=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",o=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${n}${o}>`}var Y="__fo_highlight__",J="__fo_tooltip__",K=null;function G(e,t="div"){let n=document.getElementById(e);return n||(n=document.createElement(t),n.id=e,document.body.appendChild(n)),n}function W(e){K=e;let t=e.getBoundingClientRect(),n=window.scrollX,o=window.scrollY,s=G(Y);Object.assign(s.style,{position:"absolute",top:`${t.top+o}px`,left:`${t.left+n}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let r=G(J);r.textContent=j(e),Object.assign(r.style,{position:"absolute",top:`${t.top+o-28}px`,left:`${t.left+n}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function H(){K=null,document.getElementById(Y)?.remove(),document.getElementById(J)?.remove()}var le="__fo_badge__",C=[],M=null;function A(){C.forEach(e=>e.remove()),C=[],M?.disconnect(),M=null}function T(e,t){A(),e.forEach((o,s)=>{let r=null;try{r=document.querySelector(o.selector)}catch{return}if(!r)return;let i=document.createElement("div");i.id=`${le}${s}`,i.textContent=String(o.count),i.title=`${o.count} comment${o.count!==1?"s":""} on this element`,Object.assign(i.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),i.addEventListener("click",a=>{a.stopPropagation(),a.preventDefault(),t(o.ids,o.selector)}),document.body.appendChild(i),C.push(i),X(i,r)});let n=()=>{C.forEach((o,s)=>{let r=e[s];if(!r)return;let i=null;try{i=document.querySelector(r.selector)}catch{return}i&&X(o,i)})};window.addEventListener("scroll",n,{passive:!0}),window.addEventListener("resize",n,{passive:!0}),M=new ResizeObserver(n),M.observe(document.body)}function X(e,t){let n=t.getBoundingClientRect(),o=window.scrollX,s=window.scrollY;e.style.top=`${n.top+s-8}px`,e.style.left=`${n.right+o-8}px`}async function V(e){if(!navigator.mediaDevices?.getDisplayMedia)return console.warn("[feedback-overlay] getDisplayMedia not available."),null;let t=null;try{t=await navigator.mediaDevices.getDisplayMedia({video:{preferCurrentTab:!0,displaySurface:"browser"},audio:!1})}catch(n){return console.info("[feedback-overlay] Screen capture cancelled:",n),null}try{let n=t.getVideoTracks()[0],s=await new ImageCapture(n).grabFrame(),r=e.getBoundingClientRect(),i=window.devicePixelRatio||1,a=document.createElement("canvas");return a.width=Math.round(r.width*i),a.height=Math.round(r.height*i),a.getContext("2d").drawImage(s,Math.round(r.left*i),Math.round(r.top*i),a.width,a.height,0,0,a.width,a.height),s.close(),{dataURL:a.toDataURL("image/png")}}finally{t.getTracks().forEach(n=>n.stop())}}var R="__fo_dialog__",Q="__fo_styles__";function Z(){if(document.getElementById(Q))return;let e=document.createElement("style");e.id=Q,e.textContent=`
    #__fo_dialog__ {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #__fo_dialog__ .fo-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px 24px;
      width: 480px;
      max-width: calc(100vw - 32px);
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 40px rgba(0,0,0,0.25);
    }
    #__fo_dialog__ .fo-card h2 {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 600;
      color: #111;
    }
    #__fo_dialog__ .fo-card .fo-meta {
      font-size: 11px;
      color: #666;
      margin-bottom: 12px;
      font-family: monospace;
      word-break: break-all;
    }
    #__fo_dialog__ textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 10px;
      font-size: 13px;
      resize: vertical;
      min-height: 80px;
      box-sizing: border-box;
      outline: none;
    }
    #__fo_dialog__ textarea:focus { border-color: #4f86f7; }
    #__fo_dialog__ .fo-screenshot {
      margin-top: 10px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #eee;
    }
    #__fo_dialog__ .fo-screenshot img {
      display: block;
      max-width: 100%;
      max-height: 150px;
      object-fit: contain;
    }
    #__fo_dialog__ .fo-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 14px;
    }
    #__fo_dialog__ button {
      padding: 7px 16px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    #__fo_dialog__ .fo-btn-primary {
      background: #4f86f7;
      color: #fff;
    }
    #__fo_dialog__ .fo-btn-primary:hover { background: #3a6fd8; }
    #__fo_dialog__ .fo-btn-primary:disabled { background: #a0baf7; cursor: default; }
    #__fo_dialog__ .fo-btn-secondary {
      background: #f0f0f0;
      color: #333;
    }
    #__fo_dialog__ .fo-btn-secondary:hover { background: #e0e0e0; }
    #__fo_dialog__ .fo-btn-danger {
      background: #e53e3e;
      color: #fff;
    }
    #__fo_dialog__ .fo-user-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 12px;
      color: #555;
    }
    #__fo_dialog__ .fo-user-bar img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    #__fo_dialog__ .fo-error {
      color: #e53e3e;
      font-size: 12px;
      margin-top: 6px;
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
    }
    #__fo_dialog__ .fo-comment-list li:last-child { border-bottom: none; }
    #__fo_dialog__ .fo-comment-author {
      font-weight: 600;
      color: #333;
      margin-right: 4px;
    }
    #__fo_dialog__ .fo-comment-date {
      color: #999;
      font-size: 11px;
    }
  `,document.head.appendChild(e)}function ee(){let e=document.getElementById(R);return e||(e=document.createElement("div"),e.id=R,document.body.appendChild(e)),e}function te(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-card">
      <h2>Submit Feedback</h2>
      <div class="fo-meta">${$(e.selector)}</div>
      <div class="fo-user-bar">
        <img src="${$(e.user.avatarUrl)}" alt="avatar">
        <span>As <strong>${$(e.user.login)}</strong></span>
      </div>
      ${e.screenshotDataURL?`
        <div class="fo-screenshot">
          <img src="${e.screenshotDataURL}" alt="Screenshot preview">
        </div>`:""}
      <textarea id="__fo_comment__" placeholder="Describe the issue or leave a comment\u2026"></textarea>
      <div class="fo-error" id="__fo_err__"></div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
      </div>
    </div>
  `;let n=t.querySelector("#__fo_comment__"),o=t.querySelector("#__fo_submit__"),s=t.querySelector("#__fo_cancel__"),r=t.querySelector("#__fo_err__");n.focus(),s.addEventListener("click",()=>{u(),e.onCancel()}),o.addEventListener("click",async()=>{let a=n.value.trim();if(!a){r.textContent="Please enter a comment.";return}o.disabled=!0,o.textContent="Submitting\u2026",r.textContent="";try{await e.onSubmit(a),u()}catch(g){r.textContent=String(g),o.disabled=!1,o.textContent="Submit"}}),t.addEventListener("click",a=>{a.target===t&&(u(),e.onCancel())});let i=a=>{a.key==="Escape"&&(u(),e.onCancel(),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i)}function D(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">You need to sign in to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Login with GitHub</button>
      </div>
    </div>
  `;let n=t.querySelector("#__fo_login__"),o=t.querySelector("#__fo_cancel__");n.addEventListener("click",async()=>{n.disabled=!0,n.textContent="Opening\u2026";try{await e.onLogin(),u()}catch(s){n.disabled=!1,n.textContent="Login with GitHub";let r=document.createElement("div");r.className="fo-error",r.textContent=String(s),n.parentElement?.insertAdjacentElement("beforebegin",r)}}),o.addEventListener("click",()=>{u(),e.onCancel()})}function u(){let e=document.getElementById(R);e&&(e.innerHTML="")}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=P(),n=new E(t),o=new k(t,n);o.tryRestoreSession().catch(()=>{}),F(),q(async l=>{l==="active"?s():l==="idle"&&r()});function s(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",i,!0),document.addEventListener("click",g,!0),n.listBadges(window.location.href).then(l=>{T(l,m)}).catch(()=>{})}function r(){document.body.style.cursor="",document.removeEventListener("mouseover",i,!0),document.removeEventListener("click",g,!0),H(),A(),u()}function i(l){let c=l.target;!c||c===document.body||c===document.documentElement||a(c)||W(c)}function a(l){return l.id.startsWith("__fo_")}async function g(l){let c=l.target;if(!c||a(c)||(l.preventDefault(),l.stopPropagation(),z()!=="active"))return;let f=B(c),x=O(c);if(v("capturing"),o.isAuthenticated()||await new Promise((_,h)=>{D({onLogin:async()=>{await o.login(),_()},onCancel:()=>{v("active"),h(new Error("cancelled"))}})}).catch(()=>{}),!o.isAuthenticated())return;let d=o.getUser();H();let p=await V(c);v("commenting"),te({selector:f,screenshotDataURL:p?.dataURL??null,context:x,user:d,onSubmit:async _=>{await n.createFeedback({url:window.location.href,selector:f,comment:_,context:x,screenshot:p?.dataURL,repo:t.repo,label:t.label}),v("active");let h=await n.listBadges(window.location.href);T(h,m)},onCancel:()=>{v("active")}})}function m(l,c){if(!o.isAuthenticated()){D({onLogin:async()=>{await o.login(),m(l,c)},onCancel:()=>{}});return}let f=o.getUser(),x="__fo_dialog__",d=document.getElementById(x);d||(d=document.createElement("div"),d.id=x,document.body.appendChild(d)),d.innerHTML=`
      <div class="fo-card">
        <h2>${l.length} comment${l.length!==1?"s":""} on this element</h2>
        <div class="fo-meta">${c}</div>
        <div class="fo-user-bar">
          <img src="${f.avatarUrl}" alt="avatar">
          <span>Signed in as <strong>${f.login}</strong></span>
        </div>
        <div class="fo-actions">
          <button class="fo-btn-secondary" id="__fo_cancel__">Close</button>
          <button class="fo-btn-primary" id="__fo_export__">Export to GitHub Issue</button>
        </div>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
    `,d.querySelector("#__fo_cancel__")?.addEventListener("click",()=>{u()}),d.querySelector("#__fo_export__")?.addEventListener("click",async()=>{let p=d.querySelector("#__fo_export__");p.disabled=!0,p.textContent="Exporting\u2026";try{let _=await n.exportIssue({ids:l,repo:t.repo,labels:[t.label]});window.open(_.issue_url,"_blank"),u();let h=await n.listBadges(window.location.href);T(h,m)}catch(_){let h=d.querySelector("#__fo_err__");h.textContent=String(_),p.disabled=!1,p.textContent="Export to GitHub Issue"}})}function O(l){let c=l.getBoundingClientRect();return{tagName:l.tagName.toLowerCase(),innerText:l.innerText?.slice(0,200)??"",attributes:I(l),boundingRect:{top:Math.round(c.top),left:Math.round(c.left),width:Math.round(c.width),height:Math.round(c.height)},viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,userAgent:navigator.userAgent,url:window.location.href,timestamp:new Date().toISOString()}}function I(l){let c={};for(let f of Array.from(l.attributes))f.value.length<200&&(c[f.name]=f.value);return c}})();})();
