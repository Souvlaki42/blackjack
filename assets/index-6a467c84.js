(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();let u=0,i=0,g=0,y=0,a,d,h=!0;window.addEventListener("load",()=>{const e={dealerCards:document.querySelector("#dealer-cards"),yourCards:document.querySelector("#your-cards"),hitBtn:document.querySelector("#hit"),stayBtn:document.querySelector("#stay"),restartBtn:document.querySelector("#restart"),hiddenCard:document.querySelector("#hidden"),resultsText:document.querySelector("#results"),dealerSumText:document.querySelector("#dealer-sum"),yourSumText:document.querySelector("#your-sum")};if(Object.values(e).some(r=>r==null||r==null))return console.error("One or more of the required ui elements is currenly undefined!");q(),v(),C(e)});function q(){const e=["A","2","3","4","5","6","7","8","9","10","J","Q","K"],t=["C","D","H","S"];d=[],t.forEach(r=>e.forEach(c=>d.push(`${c}-${r}`)))}function v(){for(let e=0;e<d.length;e++){const t=Math.floor(Math.random()*d.length),r=d[e];d[e]=d[t],d[t]=r}}function C(e){const{dealerCards:t,yourCards:r,hitBtn:c,stayBtn:n,hiddenCard:s}=e;if(a=d.pop(),!!a){for(s.src=`/cards/B-${a.split("-")[1]}.png`,u+=m(a),g+=p(a);u<17;){const o=document.createElement("img"),l=d.pop();if(o.src=`/cards/${l}.png`,!l)return;u+=m(l),g+=p(l),t.append(o)}for(let o=0;o<2;o++){const l=document.createElement("img"),f=d.pop();if(l.src=`/cards/${f}.png`,!f)return;i+=m(f),y+=p(f),r.append(l)}c.addEventListener("click",()=>E(e)),n.addEventListener("click",()=>T(e))}}function E(e){if(!h)return;const{yourCards:t}=e,r=document.createElement("img"),c=d.pop();r.src=`/cards/${c}.png`,c&&(i+=m(c),y+=p(c),t.append(r),S(i,y)>21&&(h=!1))}function T(e){const{hiddenCard:t,resultsText:r,dealerSumText:c,yourSumText:n,restartBtn:s}=e;s.addEventListener("click",()=>location.reload()),u=S(u,g),i=S(i,y),h=!1,t.src=`/cards/${a}.png`;let o="";i>21&&i!=u?o="You lose!":u>21&&i!=u?o="You win!":i===u?o="Tie!":i>u?o="You win!":i<u?o="You lose!":o="Invalid Result!",c.innerText=u.toString(),n.innerText=i.toString(),r.innerText=o,console.log("------- Open for debuging purposes! ------"),console.log(`Dealer's sum: ${u}`),console.log(`Your sum: ${i}`)}function m(e){const r=(e==null?void 0:e.split("-"))[0];return isNaN(parseInt(r))?r==="A"?11:10:parseInt(r)}function p(e){return e[0]==="A"?1:0}function S(e,t){for(;e>21&&t>0;)e-=10,t-=1;return e}
