"use strict";var FeedbackOverlay=(()=>{function le(){return document.currentScript instanceof HTMLScriptElement?document.currentScript:document.querySelector('script[src*="feedback-overlay"]')}function j(){let t=le(),e=t?.dataset.api?.replace(/\/$/,"")??"https://feedback.emergent-company.ai",o=t?.dataset.repo??"",n=t?.dataset.label??"feedback";return o||console.warn("[feedback-overlay] data-repo is not set on the <script> tag."),{apiBase:e,repo:o,label:n}}var I=class{constructor(e){this.token=null;this.onUnauthorized=null;this.base=e.apiBase}setOnUnauthorized(e){this.onUnauthorized=e}setToken(e){this.token=e,localStorage.setItem("__fo_token__",e)}loadToken(){this.token=localStorage.getItem("__fo_token__")}clearToken(){this.token=null,localStorage.removeItem("__fo_token__")}isAuthenticated(){return this.token!==null}authHeaders(){return this.token?{Authorization:`Bearer ${this.token}`}:{}}async fetchJSON(e,o={}){let n=(o.method??"GET").toUpperCase(),l=n!=="GET"&&n!=="HEAD"?{"Content-Type":"application/json"}:{},r=await fetch(this.base+e,{...o,headers:{...l,...this.authHeaders(),...o.headers??{}}});if(!r.ok){r.status===401&&this.onUnauthorized&&this.onUnauthorized();let a=await r.text().catch(()=>r.statusText);throw new Error(`${r.status}: ${a}`)}return r.json()}async listBadges(e){return this.fetchJSON(`/feedback?url=${encodeURIComponent(e)}`)}async listComments(e){return this.fetchJSON(`/feedback/list?url=${encodeURIComponent(e)}`)}async createFeedback(e){return this.fetchJSON("/feedback",{method:"POST",body:JSON.stringify(e)})}async deleteFeedback(e){await fetch(`${this.base}/feedback/${e}`,{method:"DELETE",headers:this.authHeaders()})}async exportIssue(e){return this.fetchJSON("/issue/export",{method:"POST",body:JSON.stringify(e)})}};var ce="feedback_overlay_auth",R="__fo_user__",O=class{constructor(e,o){this.user=null;this.messageHandler=null;this.config=e,this.api=o,this.api.loadToken(),this.user=this.loadUser()}getUser(){return this.user}isAuthenticated(){return this.api.isAuthenticated()&&this.user!==null}login(){return new Promise((e,o)=>{let n=`${this.config.apiBase}/auth/github`,l=window.open(n,"feedback_overlay_auth","width=600,height=700,left=200,top=100");if(!l){o(new Error("Popup was blocked. Please allow popups for this site."));return}let r=setTimeout(()=>{c(),o(new Error("Authentication timed out."))},300*1e3),a=f=>{if(f.data?.type!==ce)return;clearTimeout(r),c();let{token:p,login:y,avatar:w}=f.data;this.api.setToken(p),this.user={login:y,avatarUrl:w},this.saveUser(this.user),e(this.user)},c=()=>{window.removeEventListener("message",a),this.messageHandler=null,l.closed||l.close()};this.messageHandler=a,window.addEventListener("message",a);let v=setInterval(()=>{l.closed&&(clearInterval(v),this.messageHandler===a&&(c(),clearTimeout(r),o(new Error("Authentication cancelled."))))},500)})}logout(){this.clearSession()}saveUser(e){try{localStorage.setItem(R,JSON.stringify(e))}catch{}}loadUser(){try{let e=localStorage.getItem(R);return e?JSON.parse(e):null}catch{return null}}clearSession(){this.user=null,this.api.clearToken();try{localStorage.removeItem(R)}catch{}}};var G="Shift",S="idle",A=[],T=!1,M=!1;function H(t){S!==t&&(S=t,A.forEach(e=>e(t)))}function Y(){return S}function J(t){return A.push(t),()=>{A=A.filter(e=>e!==t)}}function x(t){H(t)}function W(){window.addEventListener("keydown",de,!0),window.addEventListener("keyup",ue,!0),window.addEventListener("blur",fe)}function de(t){t.key==="Alt"&&(T=!0),t.key===G&&(M=!0),T&&M&&S==="idle"&&H("active")}function ue(t){t.key==="Alt"&&(T=!1),t.key===G&&(M=!1),!T&&!M&&S==="active"&&H("idle")}function fe(){T=!1,M=!1,S==="active"&&H("idle")}function F(t){let e=t.getAttribute("data-testid");return e?`[data-testid="${CSS.escape(e)}"]`:t.id&&!K(t.id)?`#${CSS.escape(t.id)}`:ge(t)}function K(t){return/^\d+$/.test(t)||/[:\[\]{}]/.test(t)||t.length>50}function ge(t){let e=[],o=t;for(;o&&o!==document.documentElement;){let n=o.tagName.toLowerCase(),l=o.parentElement,r=o.getAttribute("data-testid");if(r){e.unshift(`[data-testid="${CSS.escape(r)}"]`);break}if(o.id&&!K(o.id)){e.unshift(`#${CSS.escape(o.id)}`);break}if(l){let a=Array.from(l.children).filter(c=>c.tagName===o.tagName);if(a.length>1){let c=a.indexOf(o)+1;e.unshift(`${n}:nth-of-type(${c})`)}else e.unshift(n)}else e.unshift(n);o=l}return e.join(" > ")}function X(t){let e=t;for(;e&&e!==document.documentElement;){let r=e.getAttribute("data-component");if(r)return r;e=e.parentElement}let o=t.tagName.toLowerCase(),n=t.id?`#${t.id}`:"",l=t.classList.length?"."+Array.from(t.classList).slice(0,2).join("."):"";return`<${o}${n}${l}>`}var Z="__fo_highlight__",Q="__fo_tooltip__",ee=null;function V(t,e="div"){let o=document.getElementById(t);return o||(o=document.createElement(e),o.id=t,document.body.appendChild(o)),o}function te(t){ee=t;let e=t.getBoundingClientRect(),o=window.scrollX,n=window.scrollY,l=V(Z);Object.assign(l.style,{position:"absolute",top:`${e.top+n}px`,left:`${e.left+o}px`,width:`${e.width}px`,height:`${e.height}px`,outline:"2px solid #4f86f7",backgroundColor:"rgba(79, 134, 247, 0.08)",pointerEvents:"none",zIndex:"2147483645",boxSizing:"border-box",borderRadius:"2px",transition:"all 80ms ease"});let r=V(Q);r.textContent=X(t),Object.assign(r.style,{position:"absolute",top:`${e.top+n-28}px`,left:`${e.left+o}px`,background:"#4f86f7",color:"#fff",fontSize:"11px",fontFamily:"monospace",padding:"2px 6px",borderRadius:"3px",pointerEvents:"none",zIndex:"2147483646",whiteSpace:"nowrap",maxWidth:"400px",overflow:"hidden",textOverflow:"ellipsis"})}function D(){ee=null,document.getElementById(Z)?.remove(),document.getElementById(Q)?.remove()}var me="__fo_badge__",B=[],$=null;function q(){B.forEach(t=>t.remove()),B=[],$?.disconnect(),$=null}function P(t,e){q(),t.forEach((n,l)=>{let r=null;try{r=document.querySelector(n.selector)}catch{return}if(!r)return;let a=document.createElement("div");a.id=`${me}${l}`,a.textContent=String(n.count),a.title=`${n.count} comment${n.count!==1?"s":""} on this element`,Object.assign(a.style,{position:"absolute",background:"#f0a500",color:"#fff",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"bold",lineHeight:"1",padding:"2px 5px",borderRadius:"10px",zIndex:"2147483644",cursor:"pointer",userSelect:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",minWidth:"16px",textAlign:"center"}),a.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),e(n.ids,n.selector)}),document.body.appendChild(a),B.push(a),oe(a,r)});let o=()=>{B.forEach((n,l)=>{let r=t[l];if(!r)return;let a=null;try{a=document.querySelector(r.selector)}catch{return}a&&oe(n,a)})};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),$=new ResizeObserver(o),$.observe(document.body)}function oe(t,e){let o=e.getBoundingClientRect(),n=window.scrollX,l=window.scrollY;t.style.top=`${o.top+l-8}px`,t.style.left=`${o.right+n-8}px`}var N="__fo_dialog__",ne="__fo_styles__";function ie(){if(document.getElementById(ne))return;let t=document.createElement("style");t.id=ne,t.textContent=`
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
  `,document.head.appendChild(t)}function re(){let t=document.getElementById(N);return t||(t=document.createElement("div"),t.id=N,document.body.appendChild(t)),t}function ae(t){ie();let e=re(),o=t.existingComments,n=o.map(d=>d.id),l=o.length===0?"":`
    <div class="fo-comments">
      ${o.map(d=>`
        <div class="fo-comment-item">
          <div class="fo-comment-meta">
            <span class="fo-comment-author">@${C(d.github_user)}</span>
            <span class="fo-comment-date">${C(d.created_at)}</span>
          </div>
          <div class="fo-comment-text">${C(d.comment)}</div>
        </div>`).join("")}
    </div>`,r=o.length>0?`${o.length} comment${o.length!==1?"s":""} on this element`:"Add feedback";e.innerHTML=`
    <div class="fo-card">
      <div class="fo-header">
        <h2>${r}</h2>
        <div class="fo-selector">${C(t.selector)}</div>
      </div>
      ${l}
      <div class="fo-compose">
        <div class="fo-user-bar">
          <img src="${C(t.user.avatarUrl)}" alt="">
          <span>${C(t.user.login)}</span>
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
        <button class="fo-btn-export" id="__fo_export__">Send to GitHub</button>
        <div class="fo-footer-spacer"></div>
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
      </div>
    </div>
  `;let a=e.querySelector("#__fo_comment__"),c=e.querySelector("#__fo_submit__"),v=e.querySelector("#__fo_cancel__"),f=e.querySelector("#__fo_export__"),p=e.querySelector("#__fo_err__"),y=()=>e.querySelector("input[name='__fo_type__']:checked")?.value??"enhancement";a.focus(),v.addEventListener("click",()=>{h(),t.onCancel()}),c.addEventListener("click",async()=>{let d=a.value.trim();if(!d){p.textContent="Please enter a comment.";return}c.disabled=!0,c.textContent="Submitting\u2026",p.textContent="";try{await t.onSubmit(d,y()),h()}catch(k){p.textContent=String(k),c.disabled=!1,c.textContent="Submit"}}),f.addEventListener("click",async()=>{f.disabled=!0,f.textContent="Exporting\u2026",c.disabled=!0,p.textContent="";try{let d=a.value.trim(),k=y(),E=[...n];if(d){let i=await t.onSubmit(d,k);E=[...E,i]}if(E.length===0){p.textContent="Nothing to export \u2014 add a comment first.",f.disabled=!1,f.textContent="Send to GitHub",c.disabled=!1;return}await t.onExport(E,k),h()}catch(d){p.textContent=String(d),f.disabled=!1,f.textContent="Send to GitHub",c.disabled=!1}}),e.addEventListener("click",d=>{d.target===e&&(h(),t.onCancel())});let w=d=>{d.key==="Escape"&&(h(),t.onCancel(),document.removeEventListener("keydown",w))};document.addEventListener("keydown",w)}function se(t){ie();let e=re();e.innerHTML=`
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <p>Authentication required to submit feedback.</p>
      <div class="fo-login-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
      <div class="fo-error" id="__fo_err__" style="margin-top:8px"></div>
    </div>
  `;let o=e.querySelector("#__fo_login__"),n=e.querySelector("#__fo_cancel__"),l=e.querySelector("#__fo_err__");o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Opening\u2026";try{await t.onLogin(),h()}catch(r){o.disabled=!1,o.textContent="Sign in with GitHub",l.textContent=String(r)}}),n.addEventListener("click",()=>{h(),t.onCancel()}),e.addEventListener("click",r=>{r.target===e&&(h(),t.onCancel())})}function h(){let t=document.getElementById(N);t&&t.remove()}function C(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(function(){if(window.__feedbackOverlayLoaded)return;window.__feedbackOverlayLoaded=!0;let e=j(),o=new I(e),n=new O(e,o);o.setOnUnauthorized(()=>n.logout()),W(),J(async i=>{i==="active"?l():i==="idle"&&r()});function l(){document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",f,!0),o.listBadges(window.location.href).then(i=>P(i,p)).catch(()=>{})}function r(){document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",f,!0),D(),q(),h()}function a(i){let s=i.target;!s||s===document.body||s===document.documentElement||c(s)||te(s)}function c(i){return i.id.startsWith("__fo_")}async function v(i){let s=F(i),u=y(i);if(x("capturing"),document.body.style.cursor="",document.removeEventListener("mouseover",a,!0),document.removeEventListener("click",f,!0),D(),n.isAuthenticated()||await new Promise((_,L)=>{se({onLogin:async()=>{await n.login(),_()},onCancel:()=>{x("idle"),L(new Error("cancelled"))}})}).catch(()=>{}),!n.isAuthenticated())return;let b=n.getUser(),g=(await o.listComments(window.location.href).catch(()=>[])).filter(_=>_.selector===s);x("commenting"),ae({selector:s,existingComments:g,context:u,user:b,onSubmit:async(_,L)=>{let U=await o.createFeedback({url:window.location.href,selector:s,comment:_,context:u,repo:e.repo,label:e.label,feedbackType:L}),z=await o.listBadges(window.location.href).catch(()=>[]);return P(z,p),x("active"),U.id},onExport:async(_,L)=>{let U=await o.exportIssue({ids:_,repo:e.repo,labels:[e.label,L]});window.open(U.issue_url,"_blank");let z=await o.listBadges(window.location.href).catch(()=>[]);P(z,p),x("active")},onCancel:()=>{x("active"),document.body.style.cursor="crosshair",document.addEventListener("mouseover",a,!0),document.addEventListener("click",f,!0)}})}async function f(i){let s=i.target;!s||c(s)||(i.preventDefault(),i.stopPropagation(),Y()==="active"&&await v(s))}function p(i,s){let u=null;try{u=document.querySelector(s)}catch{}u&&v(u)}function y(i){let s=i.getBoundingClientRect();return{url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight},devicePixelRatio:window.devicePixelRatio,tagName:i.tagName.toLowerCase(),outerHTML:i.outerHTML?.slice(0,4e3)??"",innerText:i.innerText?.slice(0,200)??"",attributes:w(i),cssFramework:E(i),computedStyles:k(i),boundingRect:{top:Math.round(s.top),left:Math.round(s.left),width:Math.round(s.width),height:Math.round(s.height)},userAgent:navigator.userAgent,timestamp:new Date().toISOString()}}function w(i){let s={};for(let u of Array.from(i.attributes))u.value.length<200&&(s[u.name]=u.value);return s}let d=["display","position","flexDirection","flexWrap","alignItems","justifyContent","gridTemplateColumns","gridTemplateRows","width","height","minWidth","minHeight","maxWidth","maxHeight","margin","padding","color","backgroundColor","opacity","fontSize","fontFamily","fontWeight","lineHeight","textAlign","border","borderRadius","boxShadow","overflow","overflowX","overflowY","zIndex","visibility","cursor"];function k(i){let s=window.getComputedStyle(i),u={};for(let b of d){let m=s.getPropertyValue(b.replace(/([A-Z])/g,g=>`-${g.toLowerCase()}`)).trim();m&&m!=="none"&&m!=="normal"&&m!=="auto"&&m!=="0px"&&(u[b]=m)}return u}function E(i){let s=Array.from(i.classList).join(" "),u=i,b=[];for(let _=0;_<6&&u;_++)b.push(...Array.from(u.classList)),u=u.parentElement;let m=b.join(" "),g=[];return/\b(bg-|text-|flex|grid|p-|m-|w-|h-|rounded|border|shadow|gap-|items-|justify-|font-|leading-|tracking-)/.test(m)&&g.push("Tailwind CSS"),/\b(btn|badge|card|modal|navbar|drawer|dropdown|alert|toast|menu|tab|hero|footer|input|select|checkbox|toggle|range|avatar|indicator)\b/.test(s)&&g.push("DaisyUI"),/\b(container|row|col-|btn-|navbar-|card-|modal-|form-control|d-flex|align-items-|justify-content-)/.test(m)&&g.push("Bootstrap"),/\bMui[A-Z]/.test(m)&&g.push("Material UI"),/\bchakra-/.test(m)&&g.push("Chakra UI"),(i.hasAttribute("data-radix-collection-item")||/\bradix-/.test(m))&&g.push("Radix UI"),g.includes("Tailwind CSS")&&g.includes("Radix UI")&&g.push("shadcn/ui"),g}})();})();
