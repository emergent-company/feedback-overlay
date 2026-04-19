"use strict";var FeedbackOverlay=(()=>{function le(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function U(){let e=le(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var v=class{constructor(t){this.token=null;this.onUnauthorized=null;this.base=t.apiBase}setOnUnauthorized(t){this.onUnauthorized=t}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),a=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+t,{...o,headers:{...a,...this.authHeaders(),...o.headers??{}}});if(!i.ok){i.status===401&&this.onUnauthorized&&this.onUnauthorized();let r=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${r}`)}return i.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async listComments(t){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}};var ce="feedback_overlay_auth",T="__fo_user__",y=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,a=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!a){o(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{s(),o(new Error("Authentication timed out."))},300*1e3),r=u=>{if(u.data?.type!==ce)return;clearTimeout(i),s();let{token:_,login:m,avatar:L}=u.data;this.api.setToken(_),this.user={login:m,avatarUrl:L},this.saveUser(this.user),t(this.user)},s=()=>{window.removeEventListener("message",r),this.messageHandler=null,a.closed||a.close()};this.messageHandler=r,window.addEventListener("message",r);let c=setInterval(()=>{a.closed&&(clearInterval(c),this.messageHandler===r&&(s(),clearTimeout(i),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(T,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(T);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(T)}catch{}}};var D="Shift",b="idle",w=[],h=!1,x=!1;function E(e){b!==e&&(b=e,w.forEach(t=>t(e)))}function F(){return b}function R(e){return w.push(e),()=>{w=w.filter(t=>t!==e)}}function p(e){E(e)}function q(){window.addEventListener("keydown",fe,!0),window.addEventListener("keyup",ue,!0),window.addEventListener("blur",_e)}function fe(e){e.key==="Alt"&&(h=!0),e.key===D&&(x=!0),h&&x&&b==="idle"&&E("active")}function ue(e){e.key==="Alt"&&(h=!1),e.key===D&&(x=!1),!h&&!x&&b==="active"&&E("idle")}function _e(){h=!1,x=!1,b==="active"&&E("idle")}function I(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!N(e.id)?`#${CSS.escape(e.id)}`:pe(e)}function N(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function pe(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),a=o.parentElement,i=o.getAttribute("data-testid");if(i){t.unshift(`[data-testid="${CSS.escape(i)}"]`);break}if(o.id&&!N(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(a){let r=Array.from(a.children).filter(s=>s.tagName===o.tagName);if(r.length>1){let s=r.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${s})`)}else t.unshift(n)}else t.unshift(n);o=a}return t.join(" > ")}function j(e){let t=e.tagName.toLowerCase(),o=e.id?`#${e.id}`:"",n=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${o}${n}>`}var J="__fo_highlight__",Y="__fo_tooltip__",K=null;function G(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function X(e){K=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,a=G(J);Object.assign(a.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let i=G(Y);i.textContent=j(e),Object.assign(i.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function M(){K=null,document.getElementById(J)?.remove(),document.getElementById(Y)?.remove()}var me="__fo_badge__",k=[],S=null;function A(){k.forEach(e=>e.remove()),k=[],S?.disconnect(),S=null}function V(e,t){A(),e.forEach((n,a)=>{let i=null;try{i=document.querySelector(n.selector)}catch{return}if(!i)return;let r=document.createElement("div");r.id=`${me}${a}`,r.textContent=String(n.count),r.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(r.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),r.addEventListener("click",s=>{s.stopPropagation(),s.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(r),k.push(r),W(r,i)});let o=()=>{k.forEach((n,a)=>{let i=e[a];if(!i)return;let r=null;try{r=document.querySelector(i.selector)}catch{return}r&&W(n,r)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),S=new ResizeObserver(o),S.observe(document.body)}function W(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,a=window.scrollY;e.style.top=`${o.top+a-8}px`,e.style.left=`${o.right+n-8}px`}var B="__fo_dialog__",Q="__fo_styles__";function Z(){if(document.getElementById(Q))return;let e=document.createElement("style");e.id=Q,e.textContent=`
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
  `,document.head.appendChild(e)}function ee(){let e=document.getElementById(B);return e||(e=document.createElement("div"),e.id=B,document.body.appendChild(e)),e}function te(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>Submit Feedback</h2>
        <div class="fo-meta">${H(e.selector)}</div>
      </div>
      <div class="fo-body fo-no-screenshot">
        <div class="fo-form-col">
          <div class="fo-user-bar">
            <img src="${H(e.user.avatarUrl)}" alt="avatar">
            <span>Signed in as <strong>${H(e.user.login)}</strong></span>
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
  `;let o=t.querySelector("#__fo_comment__"),n=t.querySelector("#__fo_submit__"),a=t.querySelector("#__fo_cancel__"),i=t.querySelector("#__fo_err__");o.focus(),a.addEventListener("click",()=>{f(),e.onCancel()}),n.addEventListener("click",async()=>{let s=o.value.trim();if(!s){i.textContent="Please enter a comment.";return}n.disabled=!0,n.textContent="Submitting\u2026",i.textContent="";try{await e.onSubmit(s),f()}catch(c){i.textContent=String(c),n.disabled=!1,n.textContent="Submit Feedback"}}),t.addEventListener("click",s=>{s.target===t&&(f(),e.onCancel())});let r=s=>{s.key==="Escape"&&(f(),e.onCancel(),document.removeEventListener("keydown",r))};document.addEventListener("keydown",r)}function oe(e){Z();let t=ee();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">Authentication required to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),f()}catch(a){o.disabled=!1,o.textContent="Sign in with GitHub";let i=document.createElement("div");i.className="fo-error",i.style.marginTop="8px",i.textContent=String(a),o.parentElement?.insertAdjacentElement("afterend",i)}}),n.addEventListener("click",()=>{f(),e.onCancel()}),t.addEventListener("click",a=>{a.target===t&&(f(),e.onCancel())})}function f(){let e=document.getElementById(B);e&&e.remove()}function H(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var $="__fo_sidebar__",ne="__fo_sidebar_styles__";function ge(){if(document.getElementById(ne))return;let e=document.createElement("style");e.id=ne,e.textContent=`
    #__fo_sidebar__ {
      position: fixed;
      top: 0;
      right: 0;
      width: 340px;
      height: 100vh;
      z-index: 2147483646;
      background: #fff;
      box-shadow: -4px 0 24px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 13px;
      color: #111;
      transform: translateX(100%);
      transition: transform 0.2s ease;
    }
    #__fo_sidebar__.fo-open {
      transform: translateX(0);
    }
    #__fo_sidebar__ * { box-sizing: border-box; }

    #__fo_sidebar__ .fo-sb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid #e8e8e8;
      flex-shrink: 0;
    }
    #__fo_sidebar__ .fo-sb-header h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_sidebar__ .fo-sb-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #666;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 4px;
    }
    #__fo_sidebar__ .fo-sb-close:hover { background: #f0f0f0; color: #111; }

    #__fo_sidebar__ .fo-sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }
    #__fo_sidebar__ .fo-sb-empty {
      padding: 32px 16px;
      text-align: center;
      color: #888;
      font-size: 13px;
    }
    #__fo_sidebar__ .fo-sb-group {
      border-bottom: 1px solid #f0f0f0;
    }
    #__fo_sidebar__ .fo-sb-group-header {
      padding: 10px 16px 6px;
      background: #fafafa;
      font-size: 10px;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      color: #555;
      word-break: break-all;
      line-height: 1.4;
      border-bottom: 1px solid #f0f0f0;
    }
    #__fo_sidebar__ .fo-sb-comment {
      padding: 10px 16px;
      border-bottom: 1px solid #f5f5f5;
    }
    #__fo_sidebar__ .fo-sb-comment:last-child { border-bottom: none; }
    #__fo_sidebar__ .fo-sb-comment-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    #__fo_sidebar__ .fo-sb-author {
      font-weight: 600;
      font-size: 12px;
      color: #0f0f0f;
    }
    #__fo_sidebar__ .fo-sb-date {
      font-size: 11px;
      color: #999;
    }
    #__fo_sidebar__ .fo-sb-comment-text {
      color: #222;
      line-height: 1.5;
    }

    #__fo_sidebar__ .fo-sb-footer {
      flex-shrink: 0;
      padding: 12px 16px;
      border-top: 1px solid #e8e8e8;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #__fo_sidebar__ .fo-sb-hint {
      font-size: 11px;
      color: #888;
      text-align: center;
    }
    #__fo_sidebar__ .fo-sb-export {
      width: 100%;
      padding: 9px;
      background: #4f86f7;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    #__fo_sidebar__ .fo-sb-export:hover { background: #3a6fd8; }
    #__fo_sidebar__ .fo-sb-export:disabled { background: #a0baf7; cursor: default; }
    #__fo_sidebar__ .fo-sb-error {
      font-size: 12px;
      color: #c53030;
      text-align: center;
    }
  `,document.head.appendChild(e)}function ie(e){ge();let t=document.getElementById($);t||(t=document.createElement("div"),t.id=$,document.body.appendChild(t));let o=new Map;for(let c of e.comments)o.has(c.selector)||o.set(c.selector,[]),o.get(c.selector).push(c);let n=e.comments.map(c=>c.id),a=e.comments.length,i="";if(a===0)i='<div class="fo-sb-empty">No comments on this page yet.<br>Hold <strong>Alt+Shift</strong> and click any element to add one.</div>';else for(let[c,u]of o)i+=`<div class="fo-sb-group">
        <div class="fo-sb-group-header">${C(c)}</div>
        ${u.map(_=>`
          <div class="fo-sb-comment">
            <div class="fo-sb-comment-meta">
              <span class="fo-sb-author">@${C(_.github_user)}</span>
              <span class="fo-sb-date">${C(_.created_at)}</span>
            </div>
            <div class="fo-sb-comment-text">${C(_.comment)}</div>
          </div>`).join("")}
      </div>`;t.innerHTML=`
    <div class="fo-sb-header">
      <h2>${a} comment${a!==1?"s":""} on this page</h2>
      <button class="fo-sb-close" id="__fo_sb_close__" title="Close">\u2715</button>
    </div>
    <div class="fo-sb-body">${i}</div>
    <div class="fo-sb-footer">
      <div class="fo-sb-hint">Hold <strong>Alt+Shift</strong> and click any element to add a comment</div>
      <button class="fo-sb-export" id="__fo_sb_export__" ${a===0?"disabled":""}>
        Send all to GitHub Issue
      </button>
      <div class="fo-sb-error" id="__fo_sb_err__"></div>
    </div>
  `,t.querySelector("#__fo_sb_close__")?.addEventListener("click",()=>{z(),e.onClose()});let r=t.querySelector("#__fo_sb_export__"),s=t.querySelector("#__fo_sb_err__");r.addEventListener("click",async()=>{r.disabled=!0,r.textContent="Exporting\u2026",s.textContent="";try{await e.onExportAll(n)}catch(c){s.textContent=String(c),r.disabled=!1,r.textContent="Send all to GitHub Issue"}}),requestAnimationFrame(()=>t.classList.add("fo-open"))}function z(){let e=document.getElementById($);e&&(e.classList.remove("fo-open"),setTimeout(()=>e.remove(),250))}function C(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=U(),o=new v(t),n=new y(t,o);o.setOnUnauthorized(()=>n.logout());let a=[];q(),R(async l=>{l==="active"?i():l==="idle"&&r()});function i(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",u,!0),document.addEventListener("click",m,!0),s()}function r(){document.body.style.cursor="",document.removeEventListener("mouseover",u,!0),document.removeEventListener("click",m,!0),M(),A(),f(),z()}async function s(){try{let[l,d]=await Promise.all([o.listBadges(window.location.href),o.listComments(window.location.href)]);a=d,V(l,L),c()}catch{}}function c(){ie({comments:a,onExportAll:async l=>{let d=await o.exportIssue({ids:l,repo:t.repo,labels:[t.label]});window.open(d.issue_url,"_blank"),await s()},onClose:()=>{p("idle")}})}function u(l){let d=l.target;!d||d===document.body||d===document.documentElement||_(d)||X(d)}function _(l){return l.id.startsWith("__fo_")}async function m(l){let d=l.target;if(!d||_(d)||(l.preventDefault(),l.stopPropagation(),F()!=="active"))return;let g=I(d),P=re(d);if(p("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",u,!0),document.removeEventListener("click",m,!0),M(),n.isAuthenticated()||await new Promise((O,de)=>{oe({onLogin:async()=>{await n.login(),O()},onCancel:()=>{p("idle"),de(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let se=n.getUser();p("commenting"),te({selector:g,context:P,user:se,onSubmit:async O=>{await o.createFeedback({url:window.location.href,selector:g,comment:O,context:P,repo:t.repo,label:t.label}),f(),p("active"),await s()},onCancel:()=>{p("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",u,!0),document.addEventListener("click",m,!0)}})}function L(l,d){c()}function re(l){let d=l.getBoundingClientRect();return{tagName:l.tagName.toLowerCase(),innerText:l.innerText?.slice(0,200)??"",attributes:ae(l),boundingRect:{top:Math.round(d.top),left:Math.round(d.left),width:Math.round(d.width),height:Math.round(d.height)},viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,userAgent:navigator.userAgent,url:window.location.href,timestamp:new Date().toISOString()}}function ae(l){let d={};for(let g of Array.from(l.attributes))g.value.length<200&&(d[g.name]=g.value);return d}})();})();
