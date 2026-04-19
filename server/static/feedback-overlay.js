"use strict";var FeedbackOverlay=(()=>{function te(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function R(){let e=te(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var w=class{constructor(t){this.token=null;this.base=t.apiBase}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),a=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+t,{...o,headers:{...a,...this.authHeaders(),...o.headers??{}}});if(!i.ok){let r=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${r}`)}return i.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}async getMe(){return this.fetchJSON("/me")}};var oe="feedback_overlay_auth",E=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()}async tryRestoreSession(){if(!this.api.isAuthenticated())return!1;try{let t=await this.api.getMe();return this.user={login:t.login,avatarUrl:t.avatar_url},!0}catch{return this.api.clearToken(),!1}}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,a=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!a){o(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{d(),o(new Error("Authentication timed out."))},300*1e3),r=m=>{if(m.data?.type!==oe)return;clearTimeout(i),d();let{token:M,login:O,avatar:s}=m.data;this.api.setToken(M),this.user={login:O,avatarUrl:s},t(this.user)},d=()=>{window.removeEventListener("message",r),this.messageHandler=null,a.closed||a.close()};this.messageHandler=r,window.addEventListener("message",r);let _=setInterval(()=>{a.closed&&(clearInterval(_),this.messageHandler===r&&(d(),clearTimeout(i),o(new Error("Authentication cancelled."))))},500)})}logout(){this.user=null,this.api.clearToken()}};var z="Shift",h="idle",k=[],x=!1,y=!1;function S(e){h!==e&&(h=e,k.forEach(t=>t(e)))}function U(){return h}function q(e){return k.push(e),()=>{k=k.filter(t=>t!==e)}}function b(e){S(e)}function F(){window.addEventListener("keydown",ne,!0),window.addEventListener("keyup",ie,!0),window.addEventListener("blur",re)}function ne(e){e.key==="Alt"&&(x=!0),e.key===z&&(y=!0),x&&y&&h==="idle"&&S("active")}function ie(e){e.key==="Alt"&&(x=!1),e.key===z&&(y=!1),!x&&!y&&h!=="idle"&&S("idle")}function re(){x=!1,y=!1,h!=="idle"&&S("idle")}function I(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!N(e.id)?`#${CSS.escape(e.id)}`:ae(e)}function N(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function ae(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),a=o.parentElement,i=o.getAttribute("data-testid");if(i){t.unshift(`[data-testid="${CSS.escape(i)}"]`);break}if(o.id&&!N(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(a){let r=Array.from(a.children).filter(d=>d.tagName===o.tagName);if(r.length>1){let d=r.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${d})`)}else t.unshift(n)}else t.unshift(n);o=a}return t.join(" > ")}function G(e){let t=e.tagName.toLowerCase(),o=e.id?`#${e.id}`:"",n=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${o}${n}>`}var J="__fo_highlight__",Y="__fo_tooltip__",K=null;function j(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function W(e){K=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,a=j(J);Object.assign(a.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let i=j(Y);i.textContent=G(e),Object.assign(i.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function A(){K=null,document.getElementById(J)?.remove(),document.getElementById(Y)?.remove()}var se="__fo_badge__",C=[],L=null;function B(){C.forEach(e=>e.remove()),C=[],L?.disconnect(),L=null}function T(e,t){B(),e.forEach((n,a)=>{let i=null;try{i=document.querySelector(n.selector)}catch{return}if(!i)return;let r=document.createElement("div");r.id=`${se}${a}`,r.textContent=String(n.count),r.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(r.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),r.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(r),C.push(r),X(r,i)});let o=()=>{C.forEach((n,a)=>{let i=e[a];if(!i)return;let r=null;try{r=document.querySelector(i.selector)}catch{return}r&&X(n,r)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),L=new ResizeObserver(o),L.observe(document.body)}function X(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,a=window.scrollY;e.style.top=`${o.top+a-8}px`,e.style.left=`${o.right+n-8}px`}var P="__fo_dialog__",V="__fo_styles__";function Q(){if(document.getElementById(V))return;let e=document.createElement("style");e.id=V,e.textContent=`
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
  `,document.head.appendChild(e)}function Z(){let e=document.getElementById(P);return e||(e=document.createElement("div"),e.id=P,document.body.appendChild(e)),e}function ee(e){Q();let t=Z();t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>Submit Feedback</h2>
        <div class="fo-meta">${$(e.selector)}</div>
      </div>
      <div class="fo-body fo-no-screenshot">
        <div class="fo-form-col">
          <div class="fo-user-bar">
            <img src="${$(e.user.avatarUrl)}" alt="avatar">
            <span>Signed in as <strong>${$(e.user.login)}</strong></span>
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
  `;let o=t.querySelector("#__fo_comment__"),n=t.querySelector("#__fo_submit__"),a=t.querySelector("#__fo_cancel__"),i=t.querySelector("#__fo_err__");o.focus(),a.addEventListener("click",()=>{u(),e.onCancel()}),n.addEventListener("click",async()=>{let d=o.value.trim();if(!d){i.textContent="Please enter a comment.";return}n.disabled=!0,n.textContent="Submitting\u2026",i.textContent="";try{await e.onSubmit(d),u()}catch(_){i.textContent=String(_),n.disabled=!1,n.textContent="Submit Feedback"}}),t.addEventListener("click",d=>{d.target===t&&(u(),e.onCancel())});let r=d=>{d.key==="Escape"&&(u(),e.onCancel(),document.removeEventListener("keydown",r))};document.addEventListener("keydown",r)}function D(e){Q();let t=Z();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">Authentication required to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),u()}catch(a){o.disabled=!1,o.textContent="Sign in with GitHub";let i=document.createElement("div");i.className="fo-error",i.style.marginTop="8px",i.textContent=String(a),o.parentElement?.insertAdjacentElement("afterend",i)}}),n.addEventListener("click",()=>{u(),e.onCancel()}),t.addEventListener("click",a=>{a.target===t&&(u(),e.onCancel())})}function u(){let e=document.getElementById(P);e&&e.remove()}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=R(),o=new w(t),n=new E(t,o);n.tryRestoreSession().catch(()=>{}),F(),q(async s=>{s==="active"?a():s==="idle"&&i()});function a(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",_,!0),o.listBadges(window.location.href).then(s=>{T(s,m)}).catch(()=>{})}function i(){document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",_,!0),A(),B(),u()}function r(s){let l=s.target;!l||l===document.body||l===document.documentElement||d(l)||W(l)}function d(s){return s.id.startsWith("__fo_")}async function _(s){let l=s.target;if(!l||d(l)||(s.preventDefault(),s.stopPropagation(),U()!=="active"))return;let f=I(l),v=M(l);if(b("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",_,!0),A(),n.isAuthenticated()||await new Promise((g,p)=>{D({onLogin:async()=>{await n.login(),g()},onCancel:()=>{b("idle"),p(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let c=n.getUser();b("commenting"),ee({selector:f,context:v,user:c,onSubmit:async g=>{await o.createFeedback({url:window.location.href,selector:f,comment:g,context:v,repo:t.repo,label:t.label}),b("active");let p=await o.listBadges(window.location.href);T(p,m)},onCancel:()=>{b("idle")}})}function m(s,l){if(!n.isAuthenticated()){D({onLogin:async()=>{await n.login(),m(s,l)},onCancel:()=>{}});return}let f=n.getUser(),v="__fo_dialog__",c=document.getElementById(v);c||(c=document.createElement("div"),c.id=v,document.body.appendChild(c)),c.innerHTML=`
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
    `,c.querySelector("#__fo_cancel__")?.addEventListener("click",()=>{u()}),c.querySelector("#__fo_export__")?.addEventListener("click",async()=>{let g=c.querySelector("#__fo_export__");g.disabled=!0,g.textContent="Exporting\u2026";try{let p=await o.exportIssue({ids:s,repo:t.repo,labels:[t.label]});window.open(p.issue_url,"_blank"),u();let H=await o.listBadges(window.location.href);T(H,m)}catch(p){let H=c.querySelector("#__fo_err__");H.textContent=String(p),g.disabled=!1,g.textContent="Export to GitHub Issue"}})}function M(s){let l=s.getBoundingClientRect();return{tagName:s.tagName.toLowerCase(),innerText:s.innerText?.slice(0,200)??"",attributes:O(s),boundingRect:{top:Math.round(l.top),left:Math.round(l.left),width:Math.round(l.width),height:Math.round(l.height)},viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,userAgent:navigator.userAgent,url:window.location.href,timestamp:new Date().toISOString()}}function O(s){let l={};for(let f of Array.from(s.attributes))f.value.length<200&&(l[f.name]=f.value);return l}})();})();
