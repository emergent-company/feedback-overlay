"use strict";var FeedbackOverlay=(()=>{function se(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function N(){let e=se(),t=e?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=e?.dataset.repo??"",n=e?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:t,repo:o,label:n}}var T=class{constructor(t){this.token=null;this.onUnauthorized=null;this.base=t.apiBase}setOnUnauthorized(t){this.onUnauthorized=t}setToken(t){this.token=t,localStorage.setItem("__fo_token__",t)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(t,o={}){let n=(o.method??"GET").toUpperCase(),l=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},a=await fetch(this.base+t,{...o,headers:{...l,...this.authHeaders(),...o.headers??{}}});if(!a.ok){a.status===401&&this.onUnauthorized&&this.onUnauthorized();let r=await a.text().catch(()=>a.statusText);throw new Error(`${a.status}: ${r}`)}return a.json()}async listBadges(t){return this.fetchJSON(`/feedback?url=${encodeURIComponent(t)}`)}async listComments(t){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(t)}`)}async createFeedback(t){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(t)})}async deleteFeedback(t){await fetch(`${this.base}/feedback/${t}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(t){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(t)})}};var le="feedback_overlay_auth",U="__fo_user__",M=class{constructor(t,o){this.user=null;this.messageHandler=null;this.config=t,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((t,o)=>{let n=`${this.config.apiBase}/auth/github`,l=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!l){o(new Error("Popup was blocked. Please allow popups for this site."));return}let a=setTimeout(()=>{c(),o(new Error("Authentication timed out."))},300*1e3),r=f=>{if(f.data?.type!==le)return;clearTimeout(a),c();let{token:p,login:w,avatar:d}=f.data;this.api.setToken(p),this.user={login:w,avatarUrl:d},this.saveUser(this.user),t(this.user)},c=()=>{window.removeEventListener("message",r),this.messageHandler=null,l.closed||l.close()};this.messageHandler=r,window.addEventListener("message",r);let y=setInterval(()=>{l.closed&&(clearInterval(y),this.messageHandler===r&&(c(),clearTimeout(a),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(t){try{localStorage.setItem(U,JSON.stringify(t))}catch{}}loadUser(){try{let t=localStorage.getItem(U);return t?JSON.parse(t):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(U)}catch{}}};var j="Shift",E="idle",O=[],C=!1,L=!1;function I(e){E!==e&&(E=e,O.forEach(t=>t(e)))}function q(){return E}function G(e){return O.push(e),()=>{O=O.filter(t=>t!==e)}}function v(e){I(e)}function Y(){window.addEventListener("keydown",ce,!0),window.addEventListener("keyup",de,!0),window.addEventListener("blur",ue)}function ce(e){e.key==="Alt"&&(C=!0),e.key===j&&(L=!0),C&&L&&E==="idle"&&I("active")}function de(e){e.key==="Alt"&&(C=!1),e.key===j&&(L=!1),!C&&!L&&E==="active"&&I("idle")}function ue(){C=!1,L=!1,E==="active"&&I("idle")}function z(e){let t=e.getAttribute("data-testid");return t?`[data-testid="${CSS.escape(t)}"]`:e.id&&!J(e.id)?`#${CSS.escape(e.id)}`:fe(e)}function J(e){return/^\d+$/.test(e)||/[:\[\]{}]/.test(e)||e.length>50}function fe(e){let t=[],o=e;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),l=o.parentElement,a=o.getAttribute("data-testid");if(a){t.unshift(`[data-testid="${CSS.escape(a)}"]`);break}if(o.id&&!J(o.id)){t.unshift(`#${CSS.escape(o.id)}`);break}if(l){let r=Array.from(l.children).filter(c=>c.tagName===o.tagName);if(r.length>1){let c=r.indexOf(o)+1;t.unshift(`${n}:nth-of-type(${c})`)}else t.unshift(n)}else t.unshift(n);o=l}return t.join(" > ")}function W(e){let t=e.tagName.toLowerCase(),o=e.id?`#${e.id}`:"",n=e.classList.length?"."+Array.from(e.classList).slice(0,2).join("."):"";return`<${t}${o}${n}>`}var X="__fo_highlight__",V="__fo_tooltip__",Z=null;function K(e,t="div"){let o=document.getElementById(e);return o||(o=document.createElement(t),o.id=e,document.body.appendChild(o)),o}function Q(e){Z=e;let t=e.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,l=K(X);Object.assign(l.style,{position:"absolute",top:`${t.top+n}px`,left:`${t.left+o}px`,width:`${t.width}px`,height:`${t.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let a=K(V);a.textContent=W(e),Object.assign(a.style,{position:"absolute",top:`${t.top+n-28}px`,left:`${t.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function R(){Z=null,document.getElementById(X)?.remove(),document.getElementById(V)?.remove()}var me="__fo_badge__",A=[],H=null;function D(){A.forEach(e=>e.remove()),A=[],H?.disconnect(),H=null}function $(e,t){D(),e.forEach((n,l)=>{let a=null;try{a=document.querySelector(n.selector)}catch{return}if(!a)return;let r=document.createElement("div");r.id=`${me}${l}`,r.textContent=String(n.count),r.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(r.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),r.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),t(n.ids,n.selector)}),document.body.appendChild(r),A.push(r),ee(r,a)});let o=()=>{A.forEach((n,l)=>{let a=e[l];if(!a)return;let r=null;try{r=document.querySelector(a.selector)}catch{return}r&&ee(n,r)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),H=new ResizeObserver(o),H.observe(document.body)}function ee(e,t){let o=t.getBoundingClientRect(),n=window.scrollX,l=window.scrollY;e.style.top=`${o.top+l-8}px`,e.style.left=`${o.right+n-8}px`}var F="__fo_dialog__",te="__fo_styles__";function oe(){if(document.getElementById(te))return;let e=document.createElement("style");e.id=te,e.textContent=`
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
  `,document.head.appendChild(e)}function ne(){let e=document.getElementById(F);return e||(e=document.createElement("div"),e.id=F,document.body.appendChild(e)),e}function ie(e){oe();let t=ne(),o=e.existingComments,n=o.map(d=>d.id),l=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(d=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${k(d.github_user)}</span>
            <span class="fo-comment-date">${k(d.created_at)}</span>
          </div>
          <div class="fo-comment-text">${k(d.comment)}</div>
        </div>`).join("")}
    </div>`,a=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback";t.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>${a}</h2>
        <div class="fo-selector">${k(e.selector)}</div>
      </div>
      ${l}
      <div class="fo-compose">
        <div class="fo-user-bar">
          <img src="${k(e.user.avatarUrl)}" alt="">
          <span>${k(e.user.login)}</span>
        </div>
        <textarea id="__fo_comment__" placeholder="Add a comment\u2026"></textarea>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
      <div class="fo-footer">
        <button class="fo-btn-export" id="__fo_export__">Send to GitHub</button>
        <div class="fo-footer-spacer"></div>
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
      </div>
    </div>
  `;let r=t.querySelector("#__fo_comment__"),c=t.querySelector("#__fo_submit__"),y=t.querySelector("#__fo_cancel__"),f=t.querySelector("#__fo_export__"),p=t.querySelector("#__fo_err__");r.focus(),y.addEventListener("click",()=>{h(),e.onCancel()}),c.addEventListener("click",async()=>{let d=r.value.trim();if(!d){p.textContent="Please enter a comment.";return}c.disabled=!0,c.textContent="Submitting\u2026",p.textContent="";try{await e.onSubmit(d),h()}catch(b){p.textContent=String(b),c.disabled=!1,c.textContent="Submit"}}),f.addEventListener("click",async()=>{f.disabled=!0,f.textContent="Exporting\u2026",c.disabled=!0,p.textContent="";try{let d=r.value.trim(),b=[...n];if(d){let B=await e.onSubmit(d);b=[...b,B]}if(b.length===0){p.textContent="Nothing to export \u2014 add a comment first.",f.disabled=!1,f.textContent="Send to GitHub",c.disabled=!1;return}await e.onExport(b),h()}catch(d){p.textContent=String(d),f.disabled=!1,f.textContent="Send to GitHub",c.disabled=!1}}),t.addEventListener("click",d=>{d.target===t&&(h(),e.onCancel())});let w=d=>{d.key==="Escape"&&(h(),e.onCancel(),document.removeEventListener("keydown",w))};document.addEventListener("keydown",w)}function re(e){oe();let t=ne();t.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=t.querySelector("#__fo_login__"),n=t.querySelector("#__fo_cancel__"),l=t.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await e.onLogin(),h()}catch(a){o.disabled=!1,o.textContent="Sign in with GitHub",l.textContent=String(a)}}),n.addEventListener("click",()=>{h(),e.onCancel()}),t.addEventListener("click",a=>{a.target===t&&(h(),e.onCancel())})}function h(){let e=document.getElementById(F);e&&e.remove()}function k(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let t=N(),o=new T(t),n=new M(t,o);o.setOnUnauthorized(()=>n.logout()),Y(),G(async i=>{i==="active"?l():i==="idle"&&a()});function l(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",f,!0),o.listBadges(window.location.href).then(i=>$(i,p)).catch(()=>{})}function a(){document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",f,!0),R(),D(),h()}function r(i){let s=i.target;!s||s===document.body||s===document.documentElement||c(s)||Q(s)}function c(i){return i.id.startsWith("__fo_")}async function y(i){let s=z(i),u=w(i);if(v("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",r,!0),document.removeEventListener("click",f,!0),R(),n.isAuthenticated()||await new Promise((_,S)=>{re({onLogin:async()=>{await n.login(),_()},onCancel:()=>{v("idle"),S(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let x=n.getUser(),m=(await o.listComments(window.location.href).catch(()=>[])).filter(_=>_.selector===s);v("commenting"),ie({selector:s,existingComments:m,context:u,user:x,onSubmit:async _=>{let S=await o.createFeedback({url:window.location.href,selector:s,comment:_,context:u,repo:t.repo,label:t.label}),P=await o.listBadges(window.location.href).catch(()=>[]);return $(P,p),v("active"),S.id},onExport:async _=>{let S=await o.exportIssue({ids:_,repo:t.repo,labels:[t.label]});window.open(S.issue_url,"_blank");let P=await o.listBadges(window.location.href).catch(()=>[]);$(P,p),v("active")},onCancel:()=>{v("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",r,!0),document.addEventListener("click",f,!0)}})}async function f(i){let s=i.target;!s||c(s)||(i.preventDefault(),i.stopPropagation(),q()==="active"&&await y(s))}function p(i,s){let u=null;try{u=document.querySelector(s)}catch{}u&&y(u)}function w(i){let s=i.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:i.tagName.toLowerCase(),outerHTML:i.outerHTML?.slice(0,4e3)??"",innerText:i.innerText?.slice(0,200)??"",attributes:d(i),cssFramework:ae(i),computedStyles:B(i),boundingRect:{top:Math.round(s.top),left:Math.round(s.left),width:Math.round(s.width),height:Math.round(s.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function d(i){let s={};for(let u of Array.from(i.attributes))u.value.length<200&&(s[u.name]=u.value);return s}let b=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function B(i){let s=window.getComputedStyle(i),u={};for(let x of b){let g=s.getPropertyValue(x.replace(/([A-Z])/g,m=>`-${m.toLowerCase()}`)).trim();g&&g!=="none"&&g!=="normal"&&g!=="auto"&&g!=="0px"&&(u[x]=g)}return u}function ae(i){let s=Array.from(i.classList).join(" "),u=i,x=[];for(let _=0;_<6&&u;_++)x.push(...Array.from(u.classList)),u=u.parentElement;let g=x.join(" "),m=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(g)&&m.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(s)&&m.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(g)&&m.push("Bootstrap"),/\bMui[A-Z]/.test(g)&&m.push("Material UI"),/\bchakra-/.test(g)&&m.push("Chakra UI"),(i.hasAttribute("data-radix-collection-item")||/\bradix-/.test(g))&&m.push("Radix UI"),m.includes("Tailwind CSS")&&m.includes("Radix UI")&&m.push("shadcn/ui"),m}})();})();
