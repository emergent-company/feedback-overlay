"use strict";var FeedbackOverlay=(()=>{function ne(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function P(){let e=ne(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var k=class{constructor(t){this.token=null;this.onUnauthorized=null;this.base=t.apiBase}setOnUnauthorized(t){this.onUnauthorized=t}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),s=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},i=await fetch(this.base+t,{...o,headers:{...s,...this.authHeaders(),...o.headers??{}}});if(!i.ok){i.status===401&&this.onUnauthorized&&this.onUnauthorized();let r=await i.text().catch(()=>i.statusText);throw new Error(`${i.status}: ${r}`)}return i.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async listComments(t){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}};var ie="feedback_overlay_auth",I="__fo_user__",S=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,s=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!s){o(new Error("Popup was blocked. Please allow popups for this site."));return}let i=setTimeout(()=>{c(),o(new Error("Authentication timed out."))},300*1e3),r=u=>{if(u.data?.type!==ie)return;clearTimeout(i),c();let{token:f,login:b,avatar:d}=u.data;this.api.setToken(f),this.user={login:b,avatarUrl:d},this.saveUser(this.user),t(this.user)},c=()=>{window.removeEventListener("message",r),this.messageHandler=null,s.closed||s.close()};this.messageHandler=r,window.addEventListener("message",r);let h=setInterval(()=>{s.closed&&(clearInterval(h),this.messageHandler===r&&(c(),clearTimeout(i),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(I,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(I);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(I)}catch{}}};var z="Shift",v="idle",C=[],w=!1,E=!1;function L(e){v!==e&&(v=e,C.forEach(t=>t(e)))}function U(){return v}function D(e){return C.push(e),()=>{C=C.filter(t=>t!==e)}}function _(e){L(e)}function R(){window.addEventListener("keydown",re,!0),window.addEventListener("keyup",ae,!0),window.addEventListener("blur",se)}function re(e){e.key==="Alt"&&(w=!0),e.key===z&&(E=!0),w&&E&&v==="idle"&&L("active")}function ae(e){e.key==="Alt"&&(w=!1),e.key===z&&(E=!1),!w&&!E&&v==="active"&&L("idle")}function se(){w=!1,E=!1,v==="active"&&L("idle")}function A(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!F(e.id)?`#${CSS.escape(e.id)}`:le(e)}function F(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function le(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),s=o.parentElement,i=o.getAttribute("data-testid");if(i){t.unshift(`[data-testid="${CSS.escape(i)}"]`);break}if(o.id&&!F(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(s){let r=Array.from(s.children).filter(c=>c.tagName===o.tagName);if(r.length>1){let c=r.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${c})`)}else t.unshift(n)}else t.unshift(n);o=s}return t.join(" > ")}function q(e){let t=e.tagName.toLowerCase(),o=e.id?`#${e.id}`:"",n=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${o}${n}>`}var G="__fo_highlight__",j="__fo_tooltip__",J=null;function N(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function Y(e){J=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,s=N(G);Object.assign(s.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let i=N(j);i.textContent=q(e),Object.assign(i.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function H(){J=null,document.getElementById(G)?.remove(),document.getElementById(j)?.remove()}var ce="__fo_badge__",O=[],T=null;function $(){O.forEach(e=>e.remove()),O=[],T?.disconnect(),T=null}function M(e,t){$(),e.forEach((n,s)=>{let i=null;try{i=document.querySelector(n.selector)}catch{return}if(!i)return;let r=document.createElement("div");r.id=`${ce}${s}`,r.textContent=String(n.count),r.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(r.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),r.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(r),O.push(r),K(r,i)});let o=()=>{O.forEach((n,s)=>{let i=e[s];if(!i)return;let r=null;try{r=document.querySelector(i.selector)}catch{return}r&&K(n,r)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),T=new ResizeObserver(o),T.observe(document.body)}function K(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,s=window.scrollY;e.style.top=`${o.top+s-8}px`,e.style.left=`${o.right+n-8}px`}var B="__fo_dialog__",W="__fo_styles__";function X(){if(document.getElementById(W))return;let e=document.createElement("style");e.id=W,e.textContent=`
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
  `,document.head.appendChild(e)}function V(){let e=document.getElementById(B);return e||(e=document.createElement("div"),e.id=B,document.body.appendChild(e)),e}function Q(e){X();let t=V(),o=e.existingComments,n=o.map(d=>d.id),s=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(d=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${x(d.github_user)}</span>
            <span class="fo-comment-date">${x(d.created_at)}</span>
          </div>
          <div class="fo-comment-text">${x(d.comment)}</div>
        </div>`).join("")}
    </div>`,i=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback";t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>${i}</h2>
        <div class="fo-selector">${x(e.selector)}</div>
      </div>
      ${s}
      <div class="fo-compose">
        <div class="fo-user-bar">
          <img src="${x(e.user.avatarUrl)}" alt="">
          <span>${x(e.user.login)}</span>
        </div>
        <textarea id="__fo_comment__" placeholder="Add a comment\u2026"></textarea>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
      <div class="fo-footer">
        ${o.length>0?'<button class="fo-btn-export" id="__fo_export__">Send to GitHub</button>':""}
        <div class="fo-footer-spacer"></div>
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
      </div>
    </div>
  `;let r=t.querySelector("#__fo_comment__"),c=t.querySelector("#__fo_submit__"),h=t.querySelector("#__fo_cancel__"),u=t.querySelector("#__fo_export__"),f=t.querySelector("#__fo_err__");r.focus(),h.addEventListener("click",()=>{g(),e.onCancel()}),c.addEventListener("click",async()=>{let d=r.value.trim();if(!d){f.textContent="Please enter a comment.";return}c.disabled=!0,c.textContent="Submitting\u2026",f.textContent="";try{await e.onSubmit(d),g()}catch(a){f.textContent=String(a),c.disabled=!1,c.textContent="Submit"}}),u?.addEventListener("click",async()=>{u.disabled=!0,u.textContent="Exporting\u2026",f.textContent="";try{await e.onExport(n),g()}catch(d){f.textContent=String(d),u.disabled=!1,u.textContent="Send to GitHub"}}),t.addEventListener("click",d=>{d.target===t&&(g(),e.onCancel())});let b=d=>{d.key==="Escape"&&(g(),e.onCancel(),document.removeEventListener("keydown",b))};document.addEventListener("keydown",b)}function Z(e){X();let t=V();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__"),s=t.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),g()}catch(i){o.disabled=!1,o.textContent="Sign in with GitHub",s.textContent=String(i)}}),n.addEventListener("click",()=>{g(),e.onCancel()}),t.addEventListener("click",i=>{i.target===t&&(g(),e.onCancel())})}function g(){let e=document.getElementById(B);e&&e.remove()}function x(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=P(),o=new k(t),n=new S(t,o);o.setOnUnauthorized(()=>n.logout()),R(),D(async a=>{a==="active"?s():a==="idle"&&i()});function s(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",u,!0),o.listBadges(window.location.href).then(a=>M(a,f)).catch(()=>{})}function i(){document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",u,!0),H(),$(),g()}function r(a){let l=a.target;!l||l===document.body||l===document.documentElement||c(l)||Y(l)}function c(a){return a.id.startsWith("__fo_")}async function h(a){let l=A(a),m=b(a);if(_("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",u,!0),H(),n.isAuthenticated()||await new Promise((p,y)=>{Z({onLogin:async()=>{await n.login(),p()},onCancel:()=>{_("idle"),y(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let ee=n.getUser(),te=(await o.listComments(window.location.href).catch(()=>[])).filter(p=>p.selector===l);_("commenting"),Q({selector:l,existingComments:te,context:m,user:ee,onSubmit:async p=>{await o.createFeedback({url:window.location.href,selector:l,comment:p,context:m,repo:t.repo,label:t.label});let y=await o.listBadges(window.location.href).catch(()=>[]);M(y,f),_("active")},onExport:async p=>{let y=await o.exportIssue({ids:p,repo:t.repo,labels:[t.label]});window.open(y.issue_url,"_blank");let oe=await o.listBadges(window.location.href).catch(()=>[]);M(oe,f),_("active")},onCancel:()=>{_("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",u,!0)}})}async function u(a){let l=a.target;!l||c(l)||(a.preventDefault(),a.stopPropagation(),U()==="active"&&await h(l))}function f(a,l){let m=null;try{m=document.querySelector(l)}catch{}m&&h(m)}function b(a){let l=a.getBoundingClientRect();return{tagName:a.tagName.toLowerCase(),innerText:a.innerText?.slice(0,200)??"",attributes:d(a),boundingRect:{top:Math.round(l.top),left:Math.round(l.left),width:Math.round(l.width),height:Math.round(l.height)},viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,userAgent:navigator.userAgent,url:window.location.href,timestamp:new Date().toISOString()}}function d(a){let l={};for(let m of Array.from(a.attributes))m.value.length<200&&(l[m.name]=m.value);return l}})();})();
