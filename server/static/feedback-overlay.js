"use strict";var FeedbackOverlay=(()=>{function oe(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function R(){let e=oe(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var w=class{constructor(t){this.token=null;this.base=t.apiBase}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),a=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+t,{...o,headers:{...a,...this.authHeaders(),...o.headers??{}}});if(!i.ok){let r=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${r}`)}return i.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}async getMe(){return this.fetchJSON("/me")}};var ne="feedback_overlay_auth",A="__fo_user__",E=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}async tryRestoreSession(){if(!this.api.isAuthenticated())return!1;try{let t=await this.api.getMe();return this.user={login:t.login,avatarUrl:t.avatar_url},this.saveUser(this.user),!0}catch{return this.clearSession(),!1}}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,a=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!a){o(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{c(),o(new Error("Authentication timed out."))},300*1e3),r=m=>{if(m.data?.type!==ne)return;clearTimeout(i),c();let{token:O,login:M,avatar:s}=m.data;this.api.setToken(O),this.user={login:M,avatarUrl:s},this.saveUser(this.user),t(this.user)},c=()=>{window.removeEventListener("message",r),this.messageHandler=null,a.closed||a.close()};this.messageHandler=r,window.addEventListener("message",r);let _=setInterval(()=>{a.closed&&(clearInterval(_),this.messageHandler===r&&(c(),clearTimeout(i),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(A,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(A);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(A)}catch{}}};var z="Shift",h="idle",S=[],x=!1,y=!1;function k(e){h!==e&&(h=e,S.forEach(t=>t(e)))}function q(){return h}function F(e){return S.push(e),()=>{S=S.filter(t=>t!==e)}}function b(e){k(e)}function N(){window.addEventListener("keydown",ie,!0),window.addEventListener("keyup",re,!0),window.addEventListener("blur",ae)}function ie(e){e.key==="Alt"&&(x=!0),e.key===z&&(y=!0),x&&y&&h==="idle"&&k("active")}function re(e){e.key==="Alt"&&(x=!1),e.key===z&&(y=!1),!x&&!y&&h==="active"&&k("idle")}function ae(){x=!1,y=!1,h==="active"&&k("idle")}function H(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!G(e.id)?`#${CSS.escape(e.id)}`:se(e)}function G(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function se(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),a=o.parentElement,i=o.getAttribute("data-testid");if(i){t.unshift(`[data-testid="${CSS.escape(i)}"]`);break}if(o.id&&!G(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(a){let r=Array.from(a.children).filter(c=>c.tagName===o.tagName);if(r.length>1){let c=r.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${c})`)}else t.unshift(n)}else t.unshift(n);o=a}return t.join(" > ")}function j(e){let t=e.tagName.toLowerCase(),o=e.id?`#${e.id}`:"",n=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${o}${n}>`}var Y="__fo_highlight__",K="__fo_tooltip__",W=null;function J(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function X(e){W=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,a=J(Y);Object.assign(a.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let i=J(K);i.textContent=j(e),Object.assign(i.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function B(){W=null,document.getElementById(Y)?.remove(),document.getElementById(K)?.remove()}var le="__fo_badge__",C=[],L=null;function $(){C.forEach(e=>e.remove()),C=[],L?.disconnect(),L=null}function T(e,t){$(),e.forEach((n,a)=>{let i=null;try{i=document.querySelector(n.selector)}catch{return}if(!i)return;let r=document.createElement("div");r.id=`${le}${a}`,r.textContent=String(n.count),r.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(r.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),r.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(r),C.push(r),V(r,i)});let o=()=>{C.forEach((n,a)=>{let i=e[a];if(!i)return;let r=null;try{r=document.querySelector(i.selector)}catch{return}r&&V(n,r)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),L=new ResizeObserver(o),L.observe(document.body)}function V(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,a=window.scrollY;e.style.top=`${o.top+a-8}px`,e.style.left=`${o.right+n-8}px`}var D="__fo_dialog__",Q="__fo_styles__";function Z(){if(document.getElementById(Q))return;let e=document.createElement("style");e.id=Q,e.textContent=`
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
  `,document.head.appendChild(e)}function ee(){let e=document.getElementById(D);return e||(e=document.createElement("div"),e.id=D,document.body.appendChild(e)),e}function te(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>Submit Feedback</h2>
        <div class="fo-meta">${P(e.selector)}</div>
      </div>
      <div class="fo-body fo-no-screenshot">
        <div class="fo-form-col">
          <div class="fo-user-bar">
            <img src="${P(e.user.avatarUrl)}" alt="avatar">
            <span>Signed in as <strong>${P(e.user.login)}</strong></span>
          </div>
          <textarea id="__fo_comment__" placeholder="Describe the issue or leave a comment\u2026"></textarea>
          <div class="fo-error" id="__fo_err__"></div>
        </div>
      </div>
      <div class="fo-footer">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit Feedback</button>
      </div>
    </div>
  `;let o=t.querySelector("#__fo_comment__"),n=t.querySelector("#__fo_submit__"),a=t.querySelector("#__fo_cancel__"),i=t.querySelector("#__fo_err__");o.focus(),a.addEventListener("click",()=>{u(),e.onCancel()}),n.addEventListener("click",async()=>{let c=o.value.trim();if(!c){i.textContent="Please enter a comment.";return}n.disabled=!0,n.textContent="Submitting\u2026",i.textContent="";try{await e.onSubmit(c),u()}catch(_){i.textContent=String(_),n.disabled=!1,n.textContent="Submit Feedback"}}),t.addEventListener("click",c=>{c.target===t&&(u(),e.onCancel())});let r=c=>{c.key==="Escape"&&(u(),e.onCancel(),document.removeEventListener("keydown",r))};document.addEventListener("keydown",r)}function U(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">Authentication required to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),u()}catch(a){o.disabled=!1,o.textContent="Sign in with GitHub";let i=document.createElement("div");i.className="fo-error",i.style.marginTop="8px",i.textContent=String(a),o.parentElement?.insertAdjacentElement("afterend",i)}}),n.addEventListener("click",()=>{u(),e.onCancel()}),t.addEventListener("click",a=>{a.target===t&&(u(),e.onCancel())})}function u(){let e=document.getElementById(D);e&&e.remove()}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=R(),o=new w(t),n=new E(t,o);n.tryRestoreSession().catch(()=>{}),N(),F(async s=>{s==="active"?a():s==="idle"&&i()});function a(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",_,!0),o.listBadges(window.location.href).then(s=>{T(s,m)}).catch(()=>{})}function i(){document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",_,!0),B(),$(),u()}function r(s){let l=s.target;!l||l===document.body||l===document.documentElement||c(l)||X(l)}function c(s){return s.id.startsWith("__fo_")}async function _(s){let l=s.target;if(!l||c(l)||(s.preventDefault(),s.stopPropagation(),q()!=="active"))return;let f=H(l),v=O(l);if(b("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",_,!0),B(),n.isAuthenticated()||await new Promise((g,p)=>{U({onLogin:async()=>{await n.login(),g()},onCancel:()=>{b("idle"),p(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let d=n.getUser();b("commenting"),te({selector:f,context:v,user:d,onSubmit:async g=>{await o.createFeedback({url:window.location.href,selector:f,comment:g,context:v,repo:t.repo,label:t.label}),b("active");let p=await o.listBadges(window.location.href);T(p,m)},onCancel:()=>{b("idle")}})}function m(s,l){if(!n.isAuthenticated()){U({onLogin:async()=>{await n.login(),m(s,l)},onCancel:()=>{}});return}let f=n.getUser(),v="__fo_dialog__",d=document.getElementById(v);d||(d=document.createElement("div"),d.id=v,document.body.appendChild(d)),d.innerHTML=`
      <div class="fo-card">
        <h2>${s.length} comment${s.length!==1?"s":""} on this element</h2>
        <div class="fo-meta">${l}</div>
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
    `,d.querySelector("#__fo_cancel__")?.addEventListener("click",()=>{u()}),d.querySelector("#__fo_export__")?.addEventListener("click",async()=>{let g=d.querySelector("#__fo_export__");g.disabled=!0,g.textContent="Exporting\u2026";try{let p=await o.exportIssue({ids:s,repo:t.repo,labels:[t.label]});window.open(p.issue_url,"_blank"),u();let I=await o.listBadges(window.location.href);T(I,m)}catch(p){let I=d.querySelector("#__fo_err__");I.textContent=String(p),g.disabled=!1,g.textContent="Export to GitHub Issue"}})}function O(s){let l=s.getBoundingClientRect();return{tagName:s.tagName.toLowerCase(),innerText:s.innerText?.slice(0,200)??"",attributes:M(s),boundingRect:{top:Math.round(l.top),left:Math.round(l.left),width:Math.round(l.width),height:Math.round(l.height)},viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,userAgent:navigator.userAgent,url:window.location.href,timestamp:new Date().toISOString()}}function M(s){let l={};for(let f of Array.from(s.attributes))f.value.length<200&&(l[f.name]=f.value);return l}})();})();
