import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c,u as l}from"./index-1X0oCTIB.js";function u(e){if(Array.isArray(e))return e.flatMap(e=>u(e));if(typeof e!=`string`)return[];let t=[],n=0,r,i,a,o,s,c=()=>{for(;n<e.length&&/\s/.test(e.charAt(n));)n+=1;return n<e.length},l=()=>(i=e.charAt(n),i!==`=`&&i!==`;`&&i!==`,`);for(;n<e.length;){for(r=n,s=!1;c();)if(i=e.charAt(n),i===`,`){for(a=n,n+=1,c(),o=n;n<e.length&&l();)n+=1;n<e.length&&e.charAt(n)===`=`?(s=!0,n=o,t.push(e.slice(r,a)),r=n):n=a+1}else n+=1;(!s||n>=e.length)&&t.push(e.slice(r))}return t}function d(e){return e instanceof Headers?e:Array.isArray(e)||typeof e==`object`?new Headers(e):null}function f(...e){return e.reduce((e,t)=>{let n=d(t);if(!n)return e;for(let[t,r]of n.entries())t===`set-cookie`?u(r).forEach(t=>e.append(`set-cookie`,t)):e.set(t,r);return e},new Headers)}var p=c(`book-open`,[[`path`,{d:`M12 7v14`,key:`1akyts`}],[`path`,{d:`M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z`,key:`ruj8y`}]]),m=c(`bot`,[[`path`,{d:`M12 8V4H8`,key:`hb8ula`}],[`rect`,{width:`16`,height:`12`,x:`4`,y:`8`,rx:`2`,key:`enze0r`}],[`path`,{d:`M2 14h2`,key:`vft8re`}],[`path`,{d:`M20 14h2`,key:`4cs60a`}],[`path`,{d:`M15 13v2`,key:`1xurst`}],[`path`,{d:`M9 13v2`,key:`rq6x2g`}]]),h=c(`check`,[[`path`,{d:`M20 6 9 17l-5-5`,key:`1gmf2c`}]]),g=c(`copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),_=c(`list`,[[`path`,{d:`M3 12h.01`,key:`nlz23k`}],[`path`,{d:`M3 18h.01`,key:`1tta3j`}],[`path`,{d:`M3 6h.01`,key:`1rqtza`}],[`path`,{d:`M8 12h13`,key:`1za7za`}],[`path`,{d:`M8 18h13`,key:`1lx6n3`}],[`path`,{d:`M8 6h13`,key:`ik3vkj`}]]),v=c(`log-out`,[[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}],[`polyline`,{points:`16 17 21 12 16 7`,key:`1gabdz`}],[`line`,{x1:`21`,x2:`9`,y1:`12`,y2:`12`,key:`1uyos4`}]]),y=c(`minus`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}]]),b=c(`pause`,[[`rect`,{x:`14`,y:`4`,width:`4`,height:`16`,rx:`1`,key:`zuxfzm`}],[`rect`,{x:`6`,y:`4`,width:`4`,height:`16`,rx:`1`,key:`1okwgv`}]]),x=c(`play`,[[`polygon`,{points:`6 3 20 12 6 21 6 3`,key:`1oa8hb`}]]),S=c(`plus`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`M12 5v14`,key:`s699le`}]]),C=c(`rotate-ccw`,[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}]]),w=c(`skull`,[[`path`,{d:`m12.5 17-.5-1-.5 1h1z`,key:`3me087`}],[`path`,{d:`M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z`,key:`1o5pge`}],[`circle`,{cx:`15`,cy:`12`,r:`1`,key:`1tmaij`}],[`circle`,{cx:`9`,cy:`12`,r:`1`,key:`1vctgf`}]]),T=c(`swords`,[[`polyline`,{points:`14.5 17.5 3 6 3 3 6 3 17.5 14.5`,key:`1hfsw2`}],[`line`,{x1:`13`,x2:`19`,y1:`19`,y2:`13`,key:`1vrmhu`}],[`line`,{x1:`16`,x2:`20`,y1:`16`,y2:`20`,key:`1bron3`}],[`line`,{x1:`19`,x2:`21`,y1:`21`,y2:`19`,key:`13pww6`}],[`polyline`,{points:`14.5 6.5 18 3 21 3 21 6 17.5 9.5`,key:`hbey2j`}],[`line`,{x1:`5`,x2:`9`,y1:`14`,y2:`18`,key:`1hf58s`}],[`line`,{x1:`7`,x2:`4`,y1:`17`,y2:`20`,key:`pidxm4`}],[`line`,{x1:`3`,x2:`5`,y1:`19`,y2:`21`,key:`1pehsh`}]]),E=c(`users`,[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]),D=l(r(),1),O=Object.defineProperty,ee=(e,t)=>O(e,`name`,{value:t,configurable:!0});function k(e,t){if(typeof e==`function`)return e(t);e!=null&&(e.current=t)}ee(k,`setRef`);function te(...e){return t=>{let n=!1,r=e.map(e=>{let r=k(e,t);return!n&&typeof r==`function`&&(n=!0),r});if(n)return()=>{for(let t=0;t<r.length;t++){let n=r[t];typeof n==`function`?n():k(e[t],null)}}}}ee(te,`composeRefs`);function ne(...e){return D.useCallback(te(...e),e)}ee(ne,`useComposedRefs`);var A=Object.defineProperty,j=(e,t)=>A(e,`name`,{value:t,configurable:!0});function re(e){let t=D.forwardRef((t,n)=>{let{children:r,...i}=t,a=null,o=!1,s=[];ue(r)&&typeof me==`function`&&(r=me(r._payload)),D.Children.forEach(r,e=>{if(ce(e)){o=!0;let t=e,n=`child`in t.props?t.props.child:t.props.children;ue(n)&&typeof me==`function`&&(n=me(n._payload)),a=oe(t,n),s.push(a?.props?.children)}else s.push(e)}),a?a=D.cloneElement(a,void 0,s):!o&&D.Children.count(r)===1&&D.isValidElement(r)&&(a=r);let c=a?N(a):void 0,l=ne(n,c);if(!a){if(r||r===0)throw Error(o?pe(e):fe(e));return r}let u=se(i,a.props??{});return a.type!==D.Fragment&&(u.ref=n?l:c),D.cloneElement(a,u)});return t.displayName=`${e}.Slot`,t}j(re,`createSlot`);var M=re(`Slot`),ie=Symbol.for(`radix.slottable`);function ae(e){let t=j(e=>`child`in e?e.children(e.child):e.children,`Slottable`);return t.displayName=`${e}.Slottable`,t.__radixId=ie,t}j(ae,`createSlottable`);var oe=j((e,t)=>{if(`child`in e.props){let t=e.props.child;return D.isValidElement(t)?D.cloneElement(t,void 0,e.props.children(t.props.children)):null}return D.isValidElement(t)?t:null},`getSlottableElementFromSlottable`);function se(e,t){let n={...t};for(let r in t){let i=e[r],a=t[r];/^on[A-Z]/.test(r)?i&&a?n[r]=(...e)=>{let t=a(...e);return i(...e),t}:i&&(n[r]=i):r===`style`?n[r]={...i,...a}:r===`className`&&(n[r]=[i,a].filter(Boolean).join(` `))}return{...e,...n}}j(se,`mergeProps`);function N(e){let t=Object.getOwnPropertyDescriptor(e.props,`ref`)?.get,n=t&&`isReactWarning`in t&&t.isReactWarning;return n?e.ref:(t=Object.getOwnPropertyDescriptor(e,`ref`)?.get,n=t&&`isReactWarning`in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}j(N,`getElementRef`);function ce(e){return D.isValidElement(e)&&typeof e.type==`function`&&`__radixId`in e.type&&e.type.__radixId===ie}j(ce,`isSlottable`);var le=Symbol.for(`react.lazy`);function ue(e){return typeof e==`object`&&!!e&&`$$typeof`in e&&e.$$typeof===le&&`_payload`in e&&de(e._payload)}j(ue,`isLazyComponent`);function de(e){return typeof e==`object`&&!!e&&`then`in e}j(de,`isPromiseLike`);var fe=j(e=>`${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,`createSlotError`),pe=j(e=>`${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,`createSlottableError`),me=D.use;function he(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=he(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function ge(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=he(e))&&(r&&(r+=` `),r+=t);return r}var _e=e=>typeof e==`boolean`?`${e}`:e===0?`0`:e,ve=ge,ye=(e,t)=>n=>{if(t?.variants==null)return ve(e,n?.class,n?.className);let{variants:r,defaultVariants:i}=t,a=Object.keys(r).map(e=>{let t=n?.[e],a=i?.[e];if(t===null)return null;let o=_e(t)||_e(a);return r[e][o]}),o=n&&Object.entries(n).reduce((e,t)=>{let[n,r]=t;return r===void 0||(e[n]=r),e},{});return ve(e,a,t?.compoundVariants?.reduce((e,t)=>{let{class:n,className:r,...a}=t;return Object.entries(a).every(e=>{let[t,n]=e;return Array.isArray(n)?n.includes({...i,...o}[t]):{...i,...o}[t]===n})?[...e,n,r]:e},[]),n?.class,n?.className)},be=(e,t)=>{let n=Array(e.length+t.length);for(let t=0;t<e.length;t++)n[t]=e[t];for(let r=0;r<t.length;r++)n[e.length+r]=t[r];return n},xe=(e,t)=>({classGroupId:e,validator:t}),Se=(e=new Map,t=null,n)=>({nextPart:e,validators:t,classGroupId:n}),Ce=`-`,P=[],we=`arbitrary..`,Te=e=>{let t=De(e),{conflictingClassGroups:n,conflictingClassGroupModifiers:r}=e;return{getClassGroupId:e=>{if(e.startsWith(`[`)&&e.endsWith(`]`))return F(e);let n=e.split(Ce);return Ee(n,+(n[0]===``&&n.length>1),t)},getConflictingClassGroupIds:(e,t)=>{if(t){let t=r[e],i=n[e];return t?i?be(i,t):t:i||P}return n[e]||P}}},Ee=(e,t,n)=>{if(e.length-t===0)return n.classGroupId;let r=e[t],i=n.nextPart.get(r);if(i){let n=Ee(e,t+1,i);if(n)return n}let a=n.validators;if(a===null)return;let o=t===0?e.join(Ce):e.slice(t).join(Ce),s=a.length;for(let e=0;e<s;e++){let t=a[e];if(t.validator(o))return t.classGroupId}},F=e=>e.slice(1,-1).indexOf(`:`)===-1?void 0:(()=>{let t=e.slice(1,-1),n=t.indexOf(`:`),r=t.slice(0,n);return r?we+r:void 0})(),De=e=>{let{theme:t,classGroups:n}=e;return I(n,t)},I=(e,t)=>{let n=Se();for(let r in e){let i=e[r];Oe(i,n,r,t)}return n},Oe=(e,t,n,r)=>{let i=e.length;for(let a=0;a<i;a++){let i=e[a];ke(i,t,n,r)}},ke=(e,t,n,r)=>{if(typeof e==`string`){Ae(e,t,n);return}if(typeof e==`function`){je(e,t,n,r);return}Me(e,t,n,r)},Ae=(e,t,n)=>{let r=e===``?t:Ne(t,e);r.classGroupId=n},je=(e,t,n,r)=>{if(Pe(e)){Oe(e(r),t,n,r);return}t.validators===null&&(t.validators=[]),t.validators.push(xe(n,e))},Me=(e,t,n,r)=>{let i=Object.entries(e),a=i.length;for(let e=0;e<a;e++){let[a,o]=i[e];Oe(o,Ne(t,a),n,r)}},Ne=(e,t)=>{let n=e,r=t.split(Ce),i=r.length;for(let e=0;e<i;e++){let t=r[e],i=n.nextPart.get(t);i||(i=Se(),n.nextPart.set(t,i)),n=i}return n},Pe=e=>`isThemeGetter`in e&&e.isThemeGetter===!0,Fe=e=>{if(e<1)return{get:()=>void 0,set:()=>{}};let t=0,n=Object.create(null),r=Object.create(null),i=(i,a)=>{n[i]=a,t++,t>e&&(t=0,r=n,n=Object.create(null))};return{get(e){let t=n[e];if(t!==void 0)return t;if((t=r[e])!==void 0)return i(e,t),t},set(e,t){e in n?n[e]=t:i(e,t)}}},Ie=`!`,Le=`:`,Re=[],ze=(e,t,n,r,i)=>({modifiers:e,hasImportantModifier:t,baseClassName:n,maybePostfixModifierPosition:r,isExternal:i}),Be=e=>{let{prefix:t,experimentalParseClassName:n}=e,r=e=>{let t=[],n=0,r=0,i=0,a,o=e.length;for(let s=0;s<o;s++){let o=e[s];if(n===0&&r===0){if(o===Le){t.push(e.slice(i,s)),i=s+1;continue}if(o===`/`){a=s;continue}}o===`[`?n++:o===`]`?n--:o===`(`?r++:o===`)`&&r--}let s=t.length===0?e:e.slice(i),c=s,l=!1;s.endsWith(Ie)?(c=s.slice(0,-1),l=!0):s.startsWith(Ie)&&(c=s.slice(1),l=!0);let u=a&&a>i?a-i:void 0;return ze(t,l,c,u)};if(t){let e=t+Le,n=r;r=t=>t.startsWith(e)?n(t.slice(e.length)):ze(Re,!1,t,void 0,!0)}if(n){let e=r;r=t=>n({className:t,parseClassName:e})}return r},Ve=e=>{let t=new Map;return e.orderSensitiveModifiers.forEach((e,n)=>{t.set(e,1e6+n)}),e=>{let n=[],r=[];for(let i=0;i<e.length;i++){let a=e[i],o=a[0]===`[`,s=t.has(a);o||s?(r.length>0&&(r.sort(),n.push(...r),r=[]),n.push(a)):r.push(a)}return r.length>0&&(r.sort(),n.push(...r)),n}},He=e=>({cache:Fe(e.cacheSize),parseClassName:Be(e),sortModifiers:Ve(e),postfixLookupClassGroupIds:Ue(e),...Te(e)}),Ue=e=>{let t=Object.create(null),n=e.postfixLookupClassGroups;if(n)for(let e=0;e<n.length;e++)t[n[e]]=!0;return t},We=/\s+/,Ge=(e,t)=>{let{parseClassName:n,getClassGroupId:r,getConflictingClassGroupIds:i,sortModifiers:a,postfixLookupClassGroupIds:o}=t,s=[],c=e.trim().split(We),l=``;for(let e=c.length-1;e>=0;--e){let t=c[e],{isExternal:u,modifiers:d,hasImportantModifier:f,baseClassName:p,maybePostfixModifierPosition:m}=n(t);if(u){l=t+(l.length>0?` `+l:l);continue}let h=!!m,g;if(h){g=r(p.substring(0,m));let e=g&&o[g]?r(p):void 0;e&&e!==g&&(g=e,h=!1)}else g=r(p);if(!g){if(!h){l=t+(l.length>0?` `+l:l);continue}if(g=r(p),!g){l=t+(l.length>0?` `+l:l);continue}h=!1}let _=d.length===0?``:d.length===1?d[0]:a(d).join(`:`),v=f?_+Ie:_,y=v+g;if(s.indexOf(y)>-1)continue;s.push(y);let b=i(g,h);for(let e=0;e<b.length;++e){let t=b[e];s.push(v+t)}l=t+(l.length>0?` `+l:l)}return l},Ke=(...e)=>{let t=0,n,r,i=``;for(;t<e.length;)(n=e[t++])&&(r=qe(n))&&(i&&(i+=` `),i+=r);return i},qe=e=>{if(typeof e==`string`)return e;let t,n=``;for(let r=0;r<e.length;r++)e[r]&&(t=qe(e[r]))&&(n&&(n+=` `),n+=t);return n},Je=(e,...t)=>{let n,r,i,a,o=o=>(n=He(t.reduce((e,t)=>t(e),e())),r=n.cache.get,i=n.cache.set,a=s,s(o)),s=e=>{let t=r(e);if(t)return t;let a=Ge(e,n);return i(e,a),a};return a=o,(...e)=>a(Ke(...e))},Ye=[],Xe=e=>{let t=t=>t[e]||Ye;return t.isThemeGetter=!0,t},Ze=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Qe=/^\((?:(\w[\w-]*):)?(.+)\)$/i,$e=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,et=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,tt=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,nt=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,rt=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,it=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,at=e=>$e.test(e),L=e=>!!e&&!Number.isNaN(Number(e)),ot=e=>!!e&&Number.isInteger(Number(e)),st=e=>e.endsWith(`%`)&&L(e.slice(0,-1)),ct=e=>et.test(e),lt=()=>!0,ut=e=>tt.test(e)&&!nt.test(e),dt=()=>!1,ft=e=>rt.test(e),pt=e=>it.test(e),mt=e=>!R(e)&&!z(e),ht=e=>e.startsWith(`@container`)&&(e[10]===`/`&&e[11]!==void 0||e[11]===`s`&&e[16]!==void 0&&e.startsWith(`-size/`,10)||e[11]===`n`&&e[18]!==void 0&&e.startsWith(`-normal/`,10)),gt=e=>jt(e,Ft,dt),R=e=>Ze.test(e),_t=e=>jt(e,It,ut),vt=e=>jt(e,Lt,L),yt=e=>jt(e,zt,lt),bt=e=>jt(e,Rt,dt),xt=e=>jt(e,Nt,dt),St=e=>jt(e,Pt,pt),Ct=e=>jt(e,Bt,ft),z=e=>Qe.test(e),wt=e=>Mt(e,It),Tt=e=>Mt(e,Rt),Et=e=>Mt(e,Nt),Dt=e=>Mt(e,Ft),Ot=e=>Mt(e,Pt),kt=e=>Mt(e,Bt,!0),At=e=>Mt(e,zt,!0),jt=(e,t,n)=>{let r=Ze.exec(e);return r?r[1]?t(r[1]):n(r[2]):!1},Mt=(e,t,n=!1)=>{let r=Qe.exec(e);return r?r[1]?t(r[1]):n:!1},Nt=e=>e===`position`||e===`percentage`,Pt=e=>e===`image`||e===`url`,Ft=e=>e===`length`||e===`size`||e===`bg-size`,It=e=>e===`length`,Lt=e=>e===`number`,Rt=e=>e===`family-name`,zt=e=>e===`number`||e===`weight`,Bt=e=>e===`shadow`,Vt=Je(()=>{let e=Xe(`color`),t=Xe(`font`),n=Xe(`text`),r=Xe(`font-weight`),i=Xe(`tracking`),a=Xe(`leading`),o=Xe(`breakpoint`),s=Xe(`container`),c=Xe(`spacing`),l=Xe(`radius`),u=Xe(`shadow`),d=Xe(`inset-shadow`),f=Xe(`text-shadow`),p=Xe(`drop-shadow`),m=Xe(`blur`),h=Xe(`perspective`),g=Xe(`aspect`),_=Xe(`ease`),v=Xe(`animate`),y=()=>[`auto`,`avoid`,`all`,`avoid-page`,`page`,`left`,`right`,`column`],b=()=>[`center`,`top`,`bottom`,`left`,`right`,`top-left`,`left-top`,`top-right`,`right-top`,`bottom-right`,`right-bottom`,`bottom-left`,`left-bottom`],x=()=>[...b(),z,R],S=()=>[`auto`,`hidden`,`clip`,`visible`,`scroll`],C=()=>[`auto`,`contain`,`none`],w=()=>[z,R,c],T=()=>[at,`full`,`auto`,...w()],E=()=>[ot,`none`,`subgrid`,z,R],D=()=>[`auto`,{span:[`full`,ot,z,R]},ot,z,R],O=()=>[ot,`auto`,z,R],ee=()=>[`auto`,`min`,`max`,`fr`,z,R],k=()=>[`start`,`end`,`center`,`between`,`around`,`evenly`,`stretch`,`baseline`,`center-safe`,`end-safe`],te=()=>[`start`,`end`,`center`,`stretch`,`center-safe`,`end-safe`],ne=()=>[`auto`,...w()],A=()=>[at,`auto`,`full`,`dvw`,`dvh`,`lvw`,`lvh`,`svw`,`svh`,`min`,`max`,`fit`,...w()],j=()=>[at,`screen`,`full`,`dvw`,`lvw`,`svw`,`min`,`max`,`fit`,...w()],re=()=>[at,`screen`,`full`,`lh`,`dvh`,`lvh`,`svh`,`min`,`max`,`fit`,...w()],M=()=>[e,z,R],ie=()=>[...b(),Et,xt,{position:[z,R]}],ae=()=>[`no-repeat`,{repeat:[``,`x`,`y`,`space`,`round`]}],oe=()=>[`auto`,`cover`,`contain`,Dt,gt,{size:[z,R]}],se=()=>[st,wt,_t],N=()=>[``,`none`,`full`,l,z,R],ce=()=>[``,L,wt,_t],le=()=>[`solid`,`dashed`,`dotted`,`double`],ue=()=>[`normal`,`multiply`,`screen`,`overlay`,`darken`,`lighten`,`color-dodge`,`color-burn`,`hard-light`,`soft-light`,`difference`,`exclusion`,`hue`,`saturation`,`color`,`luminosity`],de=()=>[L,st,Et,xt],fe=()=>[``,`none`,m,z,R],pe=()=>[`none`,L,z,R],me=()=>[`none`,L,z,R],he=()=>[L,z,R],ge=()=>[at,`full`,...w()];return{cacheSize:500,theme:{animate:[`spin`,`ping`,`pulse`,`bounce`],aspect:[`video`],blur:[ct],breakpoint:[ct],color:[lt],container:[ct],"drop-shadow":[ct],ease:[`in`,`out`,`in-out`],font:[mt],"font-weight":[`thin`,`extralight`,`light`,`normal`,`medium`,`semibold`,`bold`,`extrabold`,`black`],"inset-shadow":[ct],leading:[`none`,`tight`,`snug`,`normal`,`relaxed`,`loose`],perspective:[`dramatic`,`near`,`normal`,`midrange`,`distant`,`none`],radius:[ct],shadow:[ct],spacing:[`px`,L],text:[ct],"text-shadow":[ct],tracking:[`tighter`,`tight`,`normal`,`wide`,`wider`,`widest`]},classGroups:{aspect:[{aspect:[`auto`,`square`,at,R,z,g]}],container:[`container`],"container-type":[{"@container":[``,`normal`,`size`,z,R]}],"container-named":[ht],columns:[{columns:[L,R,z,s]}],"break-after":[{"break-after":y()}],"break-before":[{"break-before":y()}],"break-inside":[{"break-inside":[`auto`,`avoid`,`avoid-page`,`avoid-column`]}],"box-decoration":[{"box-decoration":[`slice`,`clone`]}],box:[{box:[`border`,`content`]}],display:[`block`,`inline-block`,`inline`,`flex`,`inline-flex`,`table`,`inline-table`,`table-caption`,`table-cell`,`table-column`,`table-column-group`,`table-footer-group`,`table-header-group`,`table-row-group`,`table-row`,`flow-root`,`grid`,`inline-grid`,`contents`,`list-item`,`hidden`],sr:[`sr-only`,`not-sr-only`],float:[{float:[`right`,`left`,`none`,`start`,`end`]}],clear:[{clear:[`left`,`right`,`both`,`none`,`start`,`end`]}],isolation:[`isolate`,`isolation-auto`],"object-fit":[{object:[`contain`,`cover`,`fill`,`none`,`scale-down`]}],"object-position":[{object:x()}],overflow:[{overflow:S()}],"overflow-x":[{"overflow-x":S()}],"overflow-y":[{"overflow-y":S()}],overscroll:[{overscroll:C()}],"overscroll-x":[{"overscroll-x":C()}],"overscroll-y":[{"overscroll-y":C()}],position:[`static`,`fixed`,`absolute`,`relative`,`sticky`],inset:[{inset:T()}],"inset-x":[{"inset-x":T()}],"inset-y":[{"inset-y":T()}],start:[{"inset-s":T(),start:T()}],end:[{"inset-e":T(),end:T()}],"inset-bs":[{"inset-bs":T()}],"inset-be":[{"inset-be":T()}],top:[{top:T()}],right:[{right:T()}],bottom:[{bottom:T()}],left:[{left:T()}],visibility:[`visible`,`invisible`,`collapse`],z:[{z:[ot,`auto`,z,R]}],basis:[{basis:[at,`full`,`auto`,s,...w()]}],"flex-direction":[{flex:[`row`,`row-reverse`,`col`,`col-reverse`]}],"flex-wrap":[{flex:[`nowrap`,`wrap`,`wrap-reverse`]}],flex:[{flex:[L,at,`auto`,`initial`,`none`,R]}],grow:[{grow:[``,L,z,R]}],shrink:[{shrink:[``,L,z,R]}],order:[{order:[ot,`first`,`last`,`none`,z,R]}],"grid-cols":[{"grid-cols":E()}],"col-start-end":[{col:D()}],"col-start":[{"col-start":O()}],"col-end":[{"col-end":O()}],"grid-rows":[{"grid-rows":E()}],"row-start-end":[{row:D()}],"row-start":[{"row-start":O()}],"row-end":[{"row-end":O()}],"grid-flow":[{"grid-flow":[`row`,`col`,`dense`,`row-dense`,`col-dense`]}],"auto-cols":[{"auto-cols":ee()}],"auto-rows":[{"auto-rows":ee()}],gap:[{gap:w()}],"gap-x":[{"gap-x":w()}],"gap-y":[{"gap-y":w()}],"justify-content":[{justify:[...k(),`normal`]}],"justify-items":[{"justify-items":[...te(),`normal`]}],"justify-self":[{"justify-self":[`auto`,...te()]}],"align-content":[{content:[`normal`,...k()]}],"align-items":[{items:[...te(),{baseline:[``,`last`]}]}],"align-self":[{self:[`auto`,...te(),{baseline:[``,`last`]}]}],"place-content":[{"place-content":k()}],"place-items":[{"place-items":[...te(),`baseline`]}],"place-self":[{"place-self":[`auto`,...te()]}],p:[{p:w()}],px:[{px:w()}],py:[{py:w()}],ps:[{ps:w()}],pe:[{pe:w()}],pbs:[{pbs:w()}],pbe:[{pbe:w()}],pt:[{pt:w()}],pr:[{pr:w()}],pb:[{pb:w()}],pl:[{pl:w()}],m:[{m:ne()}],mx:[{mx:ne()}],my:[{my:ne()}],ms:[{ms:ne()}],me:[{me:ne()}],mbs:[{mbs:ne()}],mbe:[{mbe:ne()}],mt:[{mt:ne()}],mr:[{mr:ne()}],mb:[{mb:ne()}],ml:[{ml:ne()}],"space-x":[{"space-x":w()}],"space-x-reverse":[`space-x-reverse`],"space-y":[{"space-y":w()}],"space-y-reverse":[`space-y-reverse`],size:[{size:A()}],"inline-size":[{inline:[`auto`,...j()]}],"min-inline-size":[{"min-inline":[`auto`,...j()]}],"max-inline-size":[{"max-inline":[`none`,...j()]}],"block-size":[{block:[`auto`,...re()]}],"min-block-size":[{"min-block":[`auto`,...re()]}],"max-block-size":[{"max-block":[`none`,...re()]}],w:[{w:[s,`screen`,...A()]}],"min-w":[{"min-w":[s,`screen`,`none`,...A()]}],"max-w":[{"max-w":[s,`screen`,`none`,`prose`,{screen:[o]},...A()]}],h:[{h:[`screen`,`lh`,...A()]}],"min-h":[{"min-h":[`screen`,`lh`,`none`,...A()]}],"max-h":[{"max-h":[`screen`,`lh`,...A()]}],"font-size":[{text:[`base`,n,wt,_t]}],"font-smoothing":[`antialiased`,`subpixel-antialiased`],"font-style":[`italic`,`not-italic`],"font-weight":[{font:[r,At,yt]}],"font-stretch":[{"font-stretch":[`ultra-condensed`,`extra-condensed`,`condensed`,`semi-condensed`,`normal`,`semi-expanded`,`expanded`,`extra-expanded`,`ultra-expanded`,st,R]}],"font-family":[{font:[Tt,bt,t]}],"font-features":[{"font-features":[R]}],"fvn-normal":[`normal-nums`],"fvn-ordinal":[`ordinal`],"fvn-slashed-zero":[`slashed-zero`],"fvn-figure":[`lining-nums`,`oldstyle-nums`],"fvn-spacing":[`proportional-nums`,`tabular-nums`],"fvn-fraction":[`diagonal-fractions`,`stacked-fractions`],tracking:[{tracking:[i,z,R]}],"line-clamp":[{"line-clamp":[L,`none`,z,vt]}],leading:[{leading:[a,...w()]}],"list-image":[{"list-image":[`none`,z,R]}],"list-style-position":[{list:[`inside`,`outside`]}],"list-style-type":[{list:[`disc`,`decimal`,`none`,z,R]}],"text-alignment":[{text:[`left`,`center`,`right`,`justify`,`start`,`end`]}],"placeholder-color":[{placeholder:M()}],"text-color":[{text:M()}],"text-decoration":[`underline`,`overline`,`line-through`,`no-underline`],"text-decoration-style":[{decoration:[...le(),`wavy`]}],"text-decoration-thickness":[{decoration:[L,`from-font`,`auto`,z,_t]}],"text-decoration-color":[{decoration:M()}],"underline-offset":[{"underline-offset":[L,`auto`,z,R]}],"text-transform":[`uppercase`,`lowercase`,`capitalize`,`normal-case`],"text-overflow":[`truncate`,`text-ellipsis`,`text-clip`],"text-wrap":[{text:[`wrap`,`nowrap`,`balance`,`pretty`]}],indent:[{indent:w()}],"tab-size":[{tab:[ot,z,R]}],"vertical-align":[{align:[`baseline`,`top`,`middle`,`bottom`,`text-top`,`text-bottom`,`sub`,`super`,z,R]}],whitespace:[{whitespace:[`normal`,`nowrap`,`pre`,`pre-line`,`pre-wrap`,`break-spaces`]}],break:[{break:[`normal`,`words`,`all`,`keep`]}],wrap:[{wrap:[`break-word`,`anywhere`,`normal`]}],hyphens:[{hyphens:[`none`,`manual`,`auto`]}],content:[{content:[`none`,z,R]}],"bg-attachment":[{bg:[`fixed`,`local`,`scroll`]}],"bg-clip":[{"bg-clip":[`border`,`padding`,`content`,`text`]}],"bg-origin":[{"bg-origin":[`border`,`padding`,`content`]}],"bg-position":[{bg:ie()}],"bg-repeat":[{bg:ae()}],"bg-size":[{bg:oe()}],"bg-image":[{bg:[`none`,{linear:[{to:[`t`,`tr`,`r`,`br`,`b`,`bl`,`l`,`tl`]},ot,z,R],radial:[``,z,R],conic:[ot,z,R]},Ot,St]}],"bg-color":[{bg:M()}],"gradient-from-pos":[{from:se()}],"gradient-via-pos":[{via:se()}],"gradient-to-pos":[{to:se()}],"gradient-from":[{from:M()}],"gradient-via":[{via:M()}],"gradient-to":[{to:M()}],rounded:[{rounded:N()}],"rounded-s":[{"rounded-s":N()}],"rounded-e":[{"rounded-e":N()}],"rounded-t":[{"rounded-t":N()}],"rounded-r":[{"rounded-r":N()}],"rounded-b":[{"rounded-b":N()}],"rounded-l":[{"rounded-l":N()}],"rounded-ss":[{"rounded-ss":N()}],"rounded-se":[{"rounded-se":N()}],"rounded-ee":[{"rounded-ee":N()}],"rounded-es":[{"rounded-es":N()}],"rounded-tl":[{"rounded-tl":N()}],"rounded-tr":[{"rounded-tr":N()}],"rounded-br":[{"rounded-br":N()}],"rounded-bl":[{"rounded-bl":N()}],"border-w":[{border:ce()}],"border-w-x":[{"border-x":ce()}],"border-w-y":[{"border-y":ce()}],"border-w-s":[{"border-s":ce()}],"border-w-e":[{"border-e":ce()}],"border-w-bs":[{"border-bs":ce()}],"border-w-be":[{"border-be":ce()}],"border-w-t":[{"border-t":ce()}],"border-w-r":[{"border-r":ce()}],"border-w-b":[{"border-b":ce()}],"border-w-l":[{"border-l":ce()}],"divide-x":[{"divide-x":ce()}],"divide-x-reverse":[`divide-x-reverse`],"divide-y":[{"divide-y":ce()}],"divide-y-reverse":[`divide-y-reverse`],"border-style":[{border:[...le(),`hidden`,`none`]}],"divide-style":[{divide:[...le(),`hidden`,`none`]}],"border-color":[{border:M()}],"border-color-x":[{"border-x":M()}],"border-color-y":[{"border-y":M()}],"border-color-s":[{"border-s":M()}],"border-color-e":[{"border-e":M()}],"border-color-bs":[{"border-bs":M()}],"border-color-be":[{"border-be":M()}],"border-color-t":[{"border-t":M()}],"border-color-r":[{"border-r":M()}],"border-color-b":[{"border-b":M()}],"border-color-l":[{"border-l":M()}],"divide-color":[{divide:M()}],"outline-style":[{outline:[...le(),`none`,`hidden`]}],"outline-offset":[{"outline-offset":[L,z,R]}],"outline-w":[{outline:[``,L,wt,_t]}],"outline-color":[{outline:M()}],shadow:[{shadow:[``,`none`,u,kt,Ct]}],"shadow-color":[{shadow:M()}],"inset-shadow":[{"inset-shadow":[`none`,d,kt,Ct]}],"inset-shadow-color":[{"inset-shadow":M()}],"ring-w":[{ring:ce()}],"ring-w-inset":[`ring-inset`],"ring-color":[{ring:M()}],"ring-offset-w":[{"ring-offset":[L,_t]}],"ring-offset-color":[{"ring-offset":M()}],"inset-ring-w":[{"inset-ring":ce()}],"inset-ring-color":[{"inset-ring":M()}],"text-shadow":[{"text-shadow":[`none`,f,kt,Ct]}],"text-shadow-color":[{"text-shadow":M()}],opacity:[{opacity:[L,z,R]}],"mix-blend":[{"mix-blend":[...ue(),`plus-darker`,`plus-lighter`]}],"bg-blend":[{"bg-blend":ue()}],"mask-clip":[{"mask-clip":[`border`,`padding`,`content`,`fill`,`stroke`,`view`]},`mask-no-clip`],"mask-composite":[{mask:[`add`,`subtract`,`intersect`,`exclude`]}],"mask-image-linear-pos":[{"mask-linear":[L]}],"mask-image-linear-from-pos":[{"mask-linear-from":de()}],"mask-image-linear-to-pos":[{"mask-linear-to":de()}],"mask-image-linear-from-color":[{"mask-linear-from":M()}],"mask-image-linear-to-color":[{"mask-linear-to":M()}],"mask-image-t-from-pos":[{"mask-t-from":de()}],"mask-image-t-to-pos":[{"mask-t-to":de()}],"mask-image-t-from-color":[{"mask-t-from":M()}],"mask-image-t-to-color":[{"mask-t-to":M()}],"mask-image-r-from-pos":[{"mask-r-from":de()}],"mask-image-r-to-pos":[{"mask-r-to":de()}],"mask-image-r-from-color":[{"mask-r-from":M()}],"mask-image-r-to-color":[{"mask-r-to":M()}],"mask-image-b-from-pos":[{"mask-b-from":de()}],"mask-image-b-to-pos":[{"mask-b-to":de()}],"mask-image-b-from-color":[{"mask-b-from":M()}],"mask-image-b-to-color":[{"mask-b-to":M()}],"mask-image-l-from-pos":[{"mask-l-from":de()}],"mask-image-l-to-pos":[{"mask-l-to":de()}],"mask-image-l-from-color":[{"mask-l-from":M()}],"mask-image-l-to-color":[{"mask-l-to":M()}],"mask-image-x-from-pos":[{"mask-x-from":de()}],"mask-image-x-to-pos":[{"mask-x-to":de()}],"mask-image-x-from-color":[{"mask-x-from":M()}],"mask-image-x-to-color":[{"mask-x-to":M()}],"mask-image-y-from-pos":[{"mask-y-from":de()}],"mask-image-y-to-pos":[{"mask-y-to":de()}],"mask-image-y-from-color":[{"mask-y-from":M()}],"mask-image-y-to-color":[{"mask-y-to":M()}],"mask-image-radial":[{"mask-radial":[z,R]}],"mask-image-radial-from-pos":[{"mask-radial-from":de()}],"mask-image-radial-to-pos":[{"mask-radial-to":de()}],"mask-image-radial-from-color":[{"mask-radial-from":M()}],"mask-image-radial-to-color":[{"mask-radial-to":M()}],"mask-image-radial-shape":[{"mask-radial":[`circle`,`ellipse`]}],"mask-image-radial-size":[{"mask-radial":[{closest:[`side`,`corner`],farthest:[`side`,`corner`]}]}],"mask-image-radial-pos":[{"mask-radial-at":b()}],"mask-image-conic-pos":[{"mask-conic":[L]}],"mask-image-conic-from-pos":[{"mask-conic-from":de()}],"mask-image-conic-to-pos":[{"mask-conic-to":de()}],"mask-image-conic-from-color":[{"mask-conic-from":M()}],"mask-image-conic-to-color":[{"mask-conic-to":M()}],"mask-mode":[{mask:[`alpha`,`luminance`,`match`]}],"mask-origin":[{"mask-origin":[`border`,`padding`,`content`,`fill`,`stroke`,`view`]}],"mask-position":[{mask:ie()}],"mask-repeat":[{mask:ae()}],"mask-size":[{mask:oe()}],"mask-type":[{"mask-type":[`alpha`,`luminance`]}],"mask-image":[{mask:[`none`,z,R]}],filter:[{filter:[``,`none`,z,R]}],blur:[{blur:fe()}],brightness:[{brightness:[L,z,R]}],contrast:[{contrast:[L,z,R]}],"drop-shadow":[{"drop-shadow":[``,`none`,p,kt,Ct]}],"drop-shadow-color":[{"drop-shadow":M()}],grayscale:[{grayscale:[``,L,z,R]}],"hue-rotate":[{"hue-rotate":[L,z,R]}],invert:[{invert:[``,L,z,R]}],saturate:[{saturate:[L,z,R]}],sepia:[{sepia:[``,L,z,R]}],"backdrop-filter":[{"backdrop-filter":[``,`none`,z,R]}],"backdrop-blur":[{"backdrop-blur":fe()}],"backdrop-brightness":[{"backdrop-brightness":[L,z,R]}],"backdrop-contrast":[{"backdrop-contrast":[L,z,R]}],"backdrop-grayscale":[{"backdrop-grayscale":[``,L,z,R]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[L,z,R]}],"backdrop-invert":[{"backdrop-invert":[``,L,z,R]}],"backdrop-opacity":[{"backdrop-opacity":[L,z,R]}],"backdrop-saturate":[{"backdrop-saturate":[L,z,R]}],"backdrop-sepia":[{"backdrop-sepia":[``,L,z,R]}],"border-collapse":[{border:[`collapse`,`separate`]}],"border-spacing":[{"border-spacing":w()}],"border-spacing-x":[{"border-spacing-x":w()}],"border-spacing-y":[{"border-spacing-y":w()}],"table-layout":[{table:[`auto`,`fixed`]}],caption:[{caption:[`top`,`bottom`]}],transition:[{transition:[``,`all`,`colors`,`opacity`,`shadow`,`transform`,`none`,z,R]}],"transition-behavior":[{transition:[`normal`,`discrete`]}],duration:[{duration:[L,`initial`,z,R]}],ease:[{ease:[`linear`,`initial`,_,z,R]}],delay:[{delay:[L,z,R]}],animate:[{animate:[`none`,v,z,R]}],backface:[{backface:[`hidden`,`visible`]}],perspective:[{perspective:[h,z,R]}],"perspective-origin":[{"perspective-origin":x()}],rotate:[{rotate:pe()}],"rotate-x":[{"rotate-x":pe()}],"rotate-y":[{"rotate-y":pe()}],"rotate-z":[{"rotate-z":pe()}],scale:[{scale:me()}],"scale-x":[{"scale-x":me()}],"scale-y":[{"scale-y":me()}],"scale-z":[{"scale-z":me()}],"scale-3d":[`scale-3d`],skew:[{skew:he()}],"skew-x":[{"skew-x":he()}],"skew-y":[{"skew-y":he()}],transform:[{transform:[z,R,``,`none`,`gpu`,`cpu`]}],"transform-origin":[{origin:x()}],"transform-style":[{transform:[`3d`,`flat`]}],translate:[{translate:ge()}],"translate-x":[{"translate-x":ge()}],"translate-y":[{"translate-y":ge()}],"translate-z":[{"translate-z":ge()}],"translate-none":[`translate-none`],zoom:[{zoom:[ot,z,R]}],accent:[{accent:M()}],appearance:[{appearance:[`none`,`auto`]}],"caret-color":[{caret:M()}],"color-scheme":[{scheme:[`normal`,`dark`,`light`,`light-dark`,`only-dark`,`only-light`]}],cursor:[{cursor:[`auto`,`default`,`pointer`,`wait`,`text`,`move`,`help`,`not-allowed`,`none`,`context-menu`,`progress`,`cell`,`crosshair`,`vertical-text`,`alias`,`copy`,`no-drop`,`grab`,`grabbing`,`all-scroll`,`col-resize`,`row-resize`,`n-resize`,`e-resize`,`s-resize`,`w-resize`,`ne-resize`,`nw-resize`,`se-resize`,`sw-resize`,`ew-resize`,`ns-resize`,`nesw-resize`,`nwse-resize`,`zoom-in`,`zoom-out`,z,R]}],"field-sizing":[{"field-sizing":[`fixed`,`content`]}],"pointer-events":[{"pointer-events":[`auto`,`none`]}],resize:[{resize:[`none`,``,`y`,`x`]}],"scroll-behavior":[{scroll:[`auto`,`smooth`]}],"scrollbar-thumb-color":[{"scrollbar-thumb":M()}],"scrollbar-track-color":[{"scrollbar-track":M()}],"scrollbar-gutter":[{"scrollbar-gutter":[`auto`,`stable`,`both`]}],"scrollbar-w":[{scrollbar:[`auto`,`thin`,`none`]}],"scroll-m":[{"scroll-m":w()}],"scroll-mx":[{"scroll-mx":w()}],"scroll-my":[{"scroll-my":w()}],"scroll-ms":[{"scroll-ms":w()}],"scroll-me":[{"scroll-me":w()}],"scroll-mbs":[{"scroll-mbs":w()}],"scroll-mbe":[{"scroll-mbe":w()}],"scroll-mt":[{"scroll-mt":w()}],"scroll-mr":[{"scroll-mr":w()}],"scroll-mb":[{"scroll-mb":w()}],"scroll-ml":[{"scroll-ml":w()}],"scroll-p":[{"scroll-p":w()}],"scroll-px":[{"scroll-px":w()}],"scroll-py":[{"scroll-py":w()}],"scroll-ps":[{"scroll-ps":w()}],"scroll-pe":[{"scroll-pe":w()}],"scroll-pbs":[{"scroll-pbs":w()}],"scroll-pbe":[{"scroll-pbe":w()}],"scroll-pt":[{"scroll-pt":w()}],"scroll-pr":[{"scroll-pr":w()}],"scroll-pb":[{"scroll-pb":w()}],"scroll-pl":[{"scroll-pl":w()}],"snap-align":[{snap:[`start`,`end`,`center`,`align-none`]}],"snap-stop":[{snap:[`normal`,`always`]}],"snap-type":[{snap:[`none`,`x`,`y`,`both`]}],"snap-strictness":[{snap:[`mandatory`,`proximity`]}],touch:[{touch:[`auto`,`none`,`manipulation`]}],"touch-x":[{"touch-pan":[`x`,`left`,`right`]}],"touch-y":[{"touch-pan":[`y`,`up`,`down`]}],"touch-pz":[`touch-pinch-zoom`],select:[{select:[`none`,`text`,`all`,`auto`]}],"will-change":[{"will-change":[`auto`,`scroll`,`contents`,`transform`,z,R]}],fill:[{fill:[`none`,...M()]}],"stroke-w":[{stroke:[L,wt,_t,vt]}],stroke:[{stroke:[`none`,...M()]}],"forced-color-adjust":[{"forced-color-adjust":[`auto`,`none`]}]},conflictingClassGroups:{"container-named":[`container-type`],overflow:[`overflow-x`,`overflow-y`],overscroll:[`overscroll-x`,`overscroll-y`],inset:[`inset-x`,`inset-y`,`inset-bs`,`inset-be`,`start`,`end`,`top`,`right`,`bottom`,`left`],"inset-x":[`right`,`left`],"inset-y":[`top`,`bottom`],flex:[`basis`,`grow`,`shrink`],gap:[`gap-x`,`gap-y`],p:[`px`,`py`,`ps`,`pe`,`pbs`,`pbe`,`pt`,`pr`,`pb`,`pl`],px:[`pr`,`pl`],py:[`pt`,`pb`],m:[`mx`,`my`,`ms`,`me`,`mbs`,`mbe`,`mt`,`mr`,`mb`,`ml`],mx:[`mr`,`ml`],my:[`mt`,`mb`],size:[`w`,`h`],"font-size":[`leading`],"fvn-normal":[`fvn-ordinal`,`fvn-slashed-zero`,`fvn-figure`,`fvn-spacing`,`fvn-fraction`],"fvn-ordinal":[`fvn-normal`],"fvn-slashed-zero":[`fvn-normal`],"fvn-figure":[`fvn-normal`],"fvn-spacing":[`fvn-normal`],"fvn-fraction":[`fvn-normal`],"line-clamp":[`display`,`overflow`],rounded:[`rounded-s`,`rounded-e`,`rounded-t`,`rounded-r`,`rounded-b`,`rounded-l`,`rounded-ss`,`rounded-se`,`rounded-ee`,`rounded-es`,`rounded-tl`,`rounded-tr`,`rounded-br`,`rounded-bl`],"rounded-s":[`rounded-ss`,`rounded-es`],"rounded-e":[`rounded-se`,`rounded-ee`],"rounded-t":[`rounded-tl`,`rounded-tr`],"rounded-r":[`rounded-tr`,`rounded-br`],"rounded-b":[`rounded-br`,`rounded-bl`],"rounded-l":[`rounded-tl`,`rounded-bl`],"border-spacing":[`border-spacing-x`,`border-spacing-y`],"border-w":[`border-w-x`,`border-w-y`,`border-w-s`,`border-w-e`,`border-w-bs`,`border-w-be`,`border-w-t`,`border-w-r`,`border-w-b`,`border-w-l`],"border-w-x":[`border-w-r`,`border-w-l`],"border-w-y":[`border-w-t`,`border-w-b`],"border-color":[`border-color-x`,`border-color-y`,`border-color-s`,`border-color-e`,`border-color-bs`,`border-color-be`,`border-color-t`,`border-color-r`,`border-color-b`,`border-color-l`],"border-color-x":[`border-color-r`,`border-color-l`],"border-color-y":[`border-color-t`,`border-color-b`],translate:[`translate-x`,`translate-y`,`translate-none`],"translate-none":[`translate`,`translate-x`,`translate-y`,`translate-z`],"scroll-m":[`scroll-mx`,`scroll-my`,`scroll-ms`,`scroll-me`,`scroll-mbs`,`scroll-mbe`,`scroll-mt`,`scroll-mr`,`scroll-mb`,`scroll-ml`],"scroll-mx":[`scroll-mr`,`scroll-ml`],"scroll-my":[`scroll-mt`,`scroll-mb`],"scroll-p":[`scroll-px`,`scroll-py`,`scroll-ps`,`scroll-pe`,`scroll-pbs`,`scroll-pbe`,`scroll-pt`,`scroll-pr`,`scroll-pb`,`scroll-pl`],"scroll-px":[`scroll-pr`,`scroll-pl`],"scroll-py":[`scroll-pt`,`scroll-pb`],touch:[`touch-x`,`touch-y`,`touch-pz`],"touch-x":[`touch`],"touch-y":[`touch`],"touch-pz":[`touch`]},conflictingClassGroupModifiers:{"font-size":[`leading`]},postfixLookupClassGroups:[`container-type`],orderSensitiveModifiers:[`*`,`**`,`after`,`backdrop`,`before`,`details-content`,`file`,`first-letter`,`first-line`,`marker`,`placeholder`,`selection`]}});function B(...e){return Vt(ge(e))}var V=i(),Ht=ye(`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,{variants:{variant:{default:`bg-accent text-accent-fg hover:opacity-90`,secondary:`bg-surface text-fg border border-border hover:bg-surface-2`,ghost:`text-fg hover:bg-surface`,outline:`border border-border bg-transparent text-fg hover:bg-surface`,parchment:`bg-parchment text-ink hover:bg-parchment-2`,danger:`bg-danger text-parchment hover:opacity-90`},size:{default:`h-11 rounded-[var(--radius-md)] px-4 text-sm`,sm:`h-9 rounded-[var(--radius-sm)] px-3 text-xs`,lg:`h-12 rounded-[var(--radius-md)] px-5 text-base`,icon:`size-11 rounded-[var(--radius-md)]`}},defaultVariants:{variant:`default`,size:`default`}}),Ut=D.forwardRef(({className:e,variant:t,size:n,asChild:r=!1,...i},a)=>(0,V.jsx)(r?M:`button`,{className:B(Ht({variant:t,size:n,className:e})),ref:a,...i}));Ut.displayName=`Button`;var H={carnivore:{id:`carnivore`,name:`Хищник`,short:`Хищник`,description:`В свой ход вместо фишки еды может напасть на любое животное. При успехе получает 2 синие фишки. Голодный хищник может нападать в каждый свой ход; накормленный не нападает вовсе. +1 к потребности в еде.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:1,scoreBonus:1,aiValue:6},swimming:{id:`swimming`,name:`Водоплавающее`,short:`Вода`,description:`Может быть съедено только водоплавающим хищником. Водоплавающий хищник ест только водоплавающих.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,symmetricAquatic:!0,aiValue:5},camouflage:{id:`camouflage`,name:`Камуфляж`,short:`Камуфляж`,description:`Может быть съедено только хищником с острым зрением.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,protection:{stealthBypass:`sharpVision`},aiValue:5},sharpVision:{id:`sharpVision`,name:`Острое зрение`,short:`Зрение`,description:`Хищник с этим свойством может атаковать животных с камуфляжем.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:4},burrowing:{id:`burrowing`,name:`Норное`,short:`Нора`,description:`Накормленное животное нельзя атаковать. Жировой запас не считается кормлением.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,protection:{safeWhenFed:!0},aiValue:4},scavenger:{id:`scavenger`,name:`Падальщик`,short:`Падаль`,description:`Когда любое животное съедено, один падальщик (по часовой от владельца хищника) получает 1 синюю фишку. Не сочетается с хищником.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,onAnyKill:`scavenger`,aiValue:3},symbiosis:{id:`symbiosis`,name:`Симбиоз`,short:`Симбиоз`,description:`Парное. Карта кладётся между двумя животными (на пару — одна парная карта). Первое животное — симбионт: второе нельзя съесть, пока симбионт жив, и кормить его можно только после симбионта.`,isPair:!0,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:5},piracy:{id:`piracy`,name:`Пиратство`,short:`Пират`,description:`Раз за ход: забрать 1 фишку — красную или синюю — у любого не накормленного полностью животного, своего или чужого. Цвет фишки сохраняется. Ход при этом не заканчивается, но еду из базы в этот ход уже не взять. Накормленный пират не пиратствует.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},tailLoss:{id:`tailLoss`,name:`Отбрасывание хвоста`,short:`Хвост`,description:`При атаке можно сбросить эту карту — животное выживает, а хищник получает только 1 синюю фишку вместо двух.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,defense:`tailLoss`,aiValue:5},grazing:{id:`grazing`,name:`Топотун`,short:`Топотун`,description:`В каждую свою фазу питания можно уничтожить 1 фишку из кормовой базы.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},cooperation:{id:`cooperation`,name:`Сотрудничество`,short:`Сотрудн.`,description:`Парное, карта кладётся между двумя животными. Когда одно получает красную или синюю еду, второе сразу получает 1 синюю. Не срабатывает от жирового запаса.`,isPair:!0,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,onPartnerFed:`cooperation`,aiValue:4},running:{id:`running`,name:`Быстрое`,short:`Быстрое`,description:`При атаке бросок кубика: 4–6 — спасается, хищник больше не атакует в этот год.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,defense:`running`,aiValue:4},highBodyWeight:{id:`highBodyWeight`,name:`Большой`,short:`Большой`,description:`Может быть съедено только большим хищником. +1 к потребности в еде.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:1,scoreBonus:1,protection:{needsBulkyAttacker:!0},aiValue:5},parasite:{id:`parasite`,name:`Паразит`,short:`Паразит`,description:`Только на чужое животное. +2 к потребности в еде. В конце игры даёт владельцу животного 2 дополнительных очка.`,isPair:!1,opponentOnly:!0,virusLike:!0,stackable:!1,extraFood:2,scoreBonus:2,aiValue:-8},fatTissue:{id:`fatTissue`,name:`Жировой запас`,short:`Жир`,description:`Единственное свойство, которое можно класть несколько раз. Лишняя еда становится жиром. Вместо еды из базы можно превратить жир в синие фишки.`,isPair:!1,opponentOnly:!1,stackable:!0,extraFood:0,scoreBonus:0,aiValue:3},communication:{id:`communication`,name:`Взаимодействие`,short:`Взаимод.`,description:`Парное, карта кладётся между двумя животными. Когда одно берёт фишку из кормовой базы, второе сразу берёт фишку из базы вне очереди.`,isPair:!0,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,onPartnerFed:`communication`,aiValue:4},poisonous:{id:`poisonous`,name:`Ядовитое`,short:`Яд`,description:`Хищник, полностью съевший это животное, погибает в фазу вымирания. Отбрасывание хвоста яд не передаёт.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,killsKiller:!0,aiValue:5},hibernation:{id:`hibernation`,name:`Спячка`,short:`Спячка`,description:`Животное считается накормленным. Нельзя два года подряд и в последний год. Больше не берёт еду, даже в жировой запас.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},mimicry:{id:`mimicry`,name:`Мимикрия`,short:`Мимикрия`,description:`При атаке перенаправить хищника на другое своё животное, которое он мог бы съесть. Цепь мимикрии не возвращается на исходное.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,defense:`mimicry`,aiValue:4},migration:{id:`migration`,name:`Миграция`,short:`Мигр.`,description:`Объявите «Миграцию»: в этот ход не берите еду и не используйте других свойств — только миграцию и прилипал. Сколько угодно своих мигрирующих животных переезжает между континентами и из океана на континент (не наоборот). Сухопутное с континента на континент — нельзя, минуя океан.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},remora:{id:`remora`,name:`Прилипала`,short:`Прилипала`,description:`Переезжает вместе с чужим или своим мигрирующим животным — даже с континента на континент. Сама по себе не мигрирует. Если в игре несколько прилипал, право первой объявляет игрок, начавший миграцию, дальше по часовой.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},herding:{id:`herding`,name:`Стадность`,short:`Стадность`,description:`Защита числом: в своей локации считается отношение хищников к животным со «стадностью». Пока хищников не больше, чем стадных, — стадных нельзя атаковать. Считаются все хищники и все стадные локации, даже чужие.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,herdingProtection:!0,aiValue:3},nematocysts:{id:`nematocysts`,name:`Стрекательные клетки`,short:`Стрекат.`,description:`Атаковавший это животное хищник парализован до конца фазы питания: теряет все свойства, остаётся лишь базовая потребность 1. В океане он теряет и «водоплавающее» — уплывает на континент.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,paralyzesAttacker:!0,aiValue:4},regeneration:{id:`regeneration`,name:`Регенерация`,short:`Регенер.`,description:`Только на животное без свойств либо с одним свойством без +к еде. Других свойств (кроме повышающих потребность) на него играть нельзя — всего не больше двух. Съеденное хищником регенерирует: в вымирание владелец кладёт карту из руки как животное поверх оставленных свойств, без добора за него.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},recombination:{id:`recombination`,name:`Рекомбинация`,short:`Рекомб.`,description:`Парная, кладётся между двумя животными. Каждое обязано передать напарнику одно своё свойство; дубликаты сбрасываются. Потеряло «водоплавающее» — переезжает на континент. Свойство, уже использованное прежним владельцем в этот ход, повторно не работает.`,isPair:!0,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},edificator:{id:`edificator`,name:`Эдификатор`,short:`Эдифик.`,description:`В начале определения кормовой базы добавляет 2 красные фишки в банк своей территории. Эдификаторов несколько — добавляют каждый за себя.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},neoplasia:{id:`neoplasia`,name:`Неоплазия`,short:`Неоплазия`,description:`Играется на ЛЮБОЕ животное (своё или чужое), только на непарные свойства. Кладётся под свойства и каждый год в начале определения кормовой базы поднимается: выключает лежащее выше непарное свойство (оно перестаёт действовать, но очки даёт). Выключать нечего — животное немедленно погибает. «Водоплавающее» в океане неприкосновенно.`,isPair:!1,opponentOnly:!1,anyTarget:!0,stackable:!1,extraFood:0,scoreBonus:0,virusLike:!0,aiValue:-6},plantWater:{id:`plantWater`,name:`Водное`,short:`Водное`,description:`Свойство растения. Только водоплавающие животные могут получать пищу с такого растения.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},thorny:{id:`thorny`,name:`Колючее`,short:`Колючее`,description:`Свойство растения. Положите на растение 3 жетона убежища. Убежище защищает животное от хищников и хищных растений до конца фазы питания.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},rootVegetable:{id:`rootVegetable`,name:`Корнеплод`,short:`Корнеплод`,description:`Свойство растения. Только норные животные смогут добраться до его вкусных корешков.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},medicinal:{id:`medicinal`,name:`Лекарственное`,short:`Лекарств.`,description:`Свойство растения. Животное, откушавшее с него, считается накормленным, но все его свойства перестают действовать до конца фазы питания (действует только фишка убежища). Сытому с пустым жиром фишка уйдёт в жировой запас.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},plantParasite:{id:`plantParasite`,name:`Растение-Паразит`,short:`Паразит-раст.`,description:`Играется на растение-хозяина и само считается отдельным растением со своими свойствами — даже со своими паразитами. Ходом питания можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Паразит выживает без фишек, но погибает вместе с хозяином. В максимум растений не идёт.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},micorrhiza:{id:`micorrhiza`,name:`Микориза`,short:`Микориза`,description:`Свойство двух растений сразу (кладётся между ними). В вымирание связка выживает, если хотя бы на одном растении осталась пища; в конце фазы роста каждое растение без фишек получает по одной. Растение может быть связано с несколькими.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},tree:{id:`tree`,name:`Дерево`,short:`Дерево`,description:`Свойство растения. Только большие животные могут брать с него пищу. Положите на растение 1 жетон убежища.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:2},nutritious:{id:`nutritious`,name:`Питательное`,short:`Питат.`,description:`Свойство растения. Животное, получившее с него фишку, дополнительно получает ещё одну. Хищник может брать еду с питательного растения.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:4},honeyPlant:{id:`honeyPlant`,name:`Медонос`,short:`Медонос`,description:`Свойство растения. Если ваше животное получило с него фишку, выберите игрока, у которого в руке больше карт, чем у вас, и возьмите у него одну случайную карту. Нет такого игрока — карта не даётся.`,isPair:!1,opponentOnly:!1,plantTrait:!0,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},transparent:{id:`transparent`,name:`Прозрачное`,short:`Прозр.`,description:`Пока на этом животном нет красных и синих фишек, хищник не может его атаковать (жировой запас не в счёт).`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:4},insectivore:{id:`insectivore`,name:`Насекомоядное`,short:`Насеком.`,description:`Съев животное без свойств (в том числе животное с меткой «Сон»), хищник получает 1 синюю фишку вместо двух — и карта «Хищник» разворачивается: сможет атаковать снова в следующих раундах фазы питания.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:3},obligateCarnivore:{id:`obligateCarnivore`,name:`Облигатный хищник`,short:`Облигат`,description:`Раз в ход может атаковать другой вид. Успешная атака сразу делает его накормленным. Не может получать красные и синие фишки из кормовой базы, с растений и с помощью других свойств. +1 к потребности в еде. Не сочетается с «Хищником» и «Падальщиком».`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:1,scoreBonus:1,aiValue:5},budding:{id:`budding`,name:`Почкование`,short:`Почков.`,description:`В начале каждого своего хода в фазе развития вид получает новое животное из личной колоды. Ограничение численности «не выше числа видов» почкование игнорирует.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,aiValue:4},metabolicSyndrome:{id:`metabolicSyndrome`,name:`Метаболический синдром`,short:`Метабол.`,description:`Вредная мутация: слишком быстрый обмен веществ. Каждое животное вида требует +2 фишки еды. Даёт 2 дополнительных очка в конце игры.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:2,scoreBonus:2,harmful:!0,aiValue:-6},barkBeetle:{id:`barkBeetle`,name:`Короед`,short:`Короед`,description:`Вредная мутация. Пока животное не накормлено, жетон убежища, взятый им с растения, не защищает: он заменяется на синюю фишку еды, а убежище возвращается на растение. У накормленного животного (и облигатного хищника) убежище работает как обычно.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,harmful:!0,aiValue:-2},extremophile:{id:`extremophile`,name:`Экстрофил`,short:`Экстрофил`,description:`Вредная мутация. Чтобы добавить животное в этот вид, сбросьте дополнительную карту из личной колоды. Если в колоде осталась одна карта — животное добавить нельзя.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,harmful:!0,aiValue:-2},developmentDefects:{id:`developmentDefects`,name:`Дефекты развития`,short:`Дефекты`,description:`Вредная мутация. Хищник, атакующий этот вид, может игнорировать одно из его свойств (в онлайн-версии гасится сильнейшая защита или защита, мешающая атаке).`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,harmful:!0,aiValue:-3},simplification:{id:`simplification`,name:`Упрощение`,short:`Упрощ.`,description:`Вредная мутация. Сбросьте последнее свойство, сыгранное на этот вид: оно и сама карта «Упрощение» выкладываются как два новых вида животных.`,isPair:!1,opponentOnly:!1,stackable:!1,extraFood:0,scoreBonus:0,harmful:!0,aiValue:-2}},Wt=Object.keys(H),Gt=new Set([`migration`,`remora`,`herding`,`nematocysts`,`regeneration`,`recombination`,`edificator`,`neoplasia`]),Kt=new Set([`plantWater`,`thorny`,`rootVegetable`,`medicinal`,`plantParasite`,`micorrhiza`,`tree`,`nutritious`,`honeyPlant`]),qt=new Set([`transparent`,`insectivore`]),Jt=new Set([`obligateCarnivore`,`budding`,`metabolicSyndrome`,`barkBeetle`,`extremophile`,`developmentDefects`,`simplification`]),Yt=[{id:`laurasia`,name:`Лавразия`},{id:`gondwana`,name:`Гондвана`},{id:`ocean`,name:`Океан`}],Xt=[[`mimicry`,4],[`swimming`,8],[`poisonous`,4],[`running`,4],[`piracy`,4],[`tailLoss`,4],[`scavenger`,4],[`symbiosis`,4]],Zt=[[`parasite`,`carnivore`,4],[`parasite`,`fatTissue`,4],[`highBodyWeight`,`carnivore`,4],[`highBodyWeight`,`fatTissue`,4],[`communication`,`carnivore`,4],[`cooperation`,`carnivore`,4],[`cooperation`,`fatTissue`,4],[`burrowing`,`fatTissue`,4],[`camouflage`,`fatTissue`,4],[`sharpVision`,`fatTissue`,4],[`grazing`,`fatTissue`,4],[`hibernation`,`carnivore`,4]],Qt=[[`herding`,4],[`nematocysts`,6],[`edificator`,6],[`regeneration`,4]],$t=[[`migration`,`swimming`,8],[`remora`,`swimming`,6],[`parasite`,`swimming`,2]],en=[[`recombination`,4],[`neoplasia`,2]],tn=[[`nutritious`,`swimming`,4],[`micorrhiza`,`swimming`,4],[`rootVegetable`,`fatTissue`,4],[`honeyPlant`,`highBodyWeight`,4],[`thorny`,`cooperation`,4],[`plantWater`,`burrowing`,4],[`medicinal`,`carnivore`,4],[`tree`,`carnivore`,4],[`plantParasite`,`parasite`,4]],nn=[[`transparent`,4],[`insectivore`,4]],rn=[[`obligateCarnivore`,4],[`budding`,4],[`metabolicSyndrome`,4],[`barkBeetle`,4],[`extremophile`,4],[`developmentDefects`,4],[`simplification`,4]];Xt.reduce((e,[,t])=>e+t,0)+Zt.reduce((e,[,,t])=>e+t,0);function an(e,t){let n=[];for(let[t,r]of Xt)for(let i=0;i<r;i++)n.push({id:e(`c`),faces:[t]});for(let[t,r,i]of Zt)for(let a=0;a<i;a++)n.push({id:e(`c`),faces:[t,r]});if(t?.continents){for(let[t,r]of Qt)for(let i=0;i<r;i++)n.push({id:e(`c`),faces:[t]});for(let[t,r,i]of $t)for(let a=0;a<i;a++)n.push({id:e(`c`),faces:[t,r]});for(let[t,r]of en)for(let i=0;i<r;i++)n.push({id:e(`c`),faces:[t]})}if(t?.plants)for(let[t,r,i]of tn)for(let a=0;a<i;a++)n.push({id:e(`c`),faces:[t,r]});if(t?.fungi)for(let[t,r]of nn)for(let i=0;i<r;i++)n.push({id:e(`c`),faces:[t]});if(t?.randomMutations)for(let[t,r]of rn)for(let i=0;i<r;i++)n.push({id:e(`c`),faces:[t]});return n}var on={toadstool:{kind:`toadstool`,name:`Бледная поганка`,isFungus:!0,description:`Взявший фишку животное получает метку «Яд» (при получении метки «Яд» свойство «Паразит» этого животного сбрасывается). В фазу вымирания животное с меткой «Яд» погибает, если на нём нет «Антидота».`,mark:`poison`,aiHint:-3},mold:{kind:`mold`,name:`Плесневой гриб`,isFungus:!0,description:`Взявший фишку животное получает метку «Антидот»: не погибает в вымирание от метки «Яд» и от съедения животного со свойством «Ядовитое».`,mark:`antidote`,aiHint:2},madCap:{kind:`madCap`,name:`Безумная шляпка`,isFungus:!0,description:`Взявший фишку животное получает метку «Безумие»: в начале следующего раунда фазы питания его владелец снимает метку, и раунд вместо него проводит сосед справа (распоряжается его животными, но не смотрит руку).`,mark:`madness`,aiHint:-1.5},flyAgaric:{kind:`flyAgaric`,name:`Бешеный мухомор`,isFungus:!0,description:`Взявший фишку животное получает метку «Бешенство»: в начале следующего раунда фазы питания его владелец снимает метку и обязан атаковать этим животным, как хищником, другое животное — даже накормленное. Добычу бешеное животное не ест и фишек не получает; при любом исходе раунд заканчивается.`,mark:`rage`,aiHint:-2},insight:{kind:`insight`,name:`Гриб прозрения`,isFungus:!0,description:`Взяв фишку, владелец животного сбрасывает все карты из руки (в настольной игре затем смотрит чужие карты — в онлайн-версии подсмотр упрощён).`,aiHint:-6},soaring:{kind:`soaring`,name:`Окрыляющий гриб`,isFungus:!0,description:`Взяв фишку, животное сбрасывает все свои парные свойства, а затем получает 1 синюю фишку дополнительной еды.`,aiHint:-1},sleepGrass:{kind:`sleepGrass`,name:`Сон-трава`,isFungus:!1,description:`Взявший фишку животное получает метку «Сон»: считается животным без свойств (все свойства, включая парные, не действуют), его потребность в пище равна 1. Метки на нём продолжают действовать. «Насекомоядное» срабатывает при съедении животного с «Сном».`,mark:`sleep`,aiHint:-1.5},thryn:{kind:`thryn`,name:`Трын-трава`,isFungus:!1,description:`Взявший фишку животное получает метку «Трын»: не получает меток при взятии фишек с любых трав и грибов, а хищник с «Трын» не получает меток со съеденного животного. Хищник без «Трын», съев животное с «Трын» и другими метками, получает все эти метки одновременно.`,mark:`thryn`,aiHint:2.5},datura:{kind:`datura`,name:`Дурман-трава`,isFungus:!1,description:`Взявший фишку животное получает метку «Дурь»: хищник (или бешеное животное), атакующий его, может игнорировать одно из его свойств (в онлайн-версии выбирается автоматически — то, что сильнее всего мешает атаке).`,mark:`haze`,aiHint:-1},smile:{kind:`smile`,name:`Улыбнись-трава`,isFungus:!1,description:`Взявший фишку животное получает метку «Пацифизм»: не может атаковать, используя свойство «Хищник» или находясь под воздействием метки «Бешенство», и не может использовать «Пиратство».`,mark:`pacifism`,aiHint:-1.5},cleanser:{kind:`cleanser`,name:`Очистительная трава`,isFungus:!1,description:`Взяв фишку, животное теряет все другие красные и синие фишки (жировой запас остаётся) и все метки последствий.`,aiHint:-4},passionflower:{kind:`passionflower`,name:`Страстоцвет`,isFungus:!1,description:`Взяв фишку, владелец обязан взять одно свойство этого животного (кроме «Паразита») и выложить как новое животное (в онлайн-версии свойство выбирается автоматически — верхнее подходящее).`,aiHint:-2}},sn={poison:{id:`poison`,name:`Яд`,short:`Яд`,description:`В фазу вымирания животное с меткой «Яд» погибает, если на нём нет метки «Антидот». При получении метки «Яд» свойство «Паразит» животного уходит в сброс.`,tone:`danger`},antidote:{id:`antidote`,name:`Антидот`,short:`Антидот`,description:`Животное с меткой «Антидот» не погибает в вымирание от метки «Яд» и от последствий съедения животного со свойством «Ядовитое».`,tone:`good`},madness:{id:`madness`,name:`Безумие`,short:`Безумие`,description:`В начале следующего раунда фазы питания владелец снимает метку с одного своего животного, и этот раунд вместо него проводит сосед справа (не может смотреть карты в руке).`,tone:`virus`},rage:{id:`rage`,name:`Бешенство`,short:`Бешенство`,description:`В начале следующего раунда фазы питания владелец снимает метку с одного своего животного и обязан атаковать им, как хищником, другое животное (даже накормленное). Добычу не ест, фишек не получает; при любом исходе раунд заканчивается.`,tone:`danger`},sleep:{id:`sleep`,name:`Сон`,short:`Сон`,description:`Животное считается животным без свойств: все свойства, включая парные, не действуют, потребность в пище равна 1. Метки на нём продолжают действовать.`,tone:`info`},thryn:{id:`thryn`,name:`Трын`,short:`Трын`,description:`Животное не получает меток при взятии фишек с трав и грибов; хищник с «Трын» не получает меток со съеденной добычи. Хищник без «Трын», съев добычу с «Трын» и другими метками, получает все метки одновременно.`,tone:`leaf`},haze:{id:`haze`,name:`Дурь`,short:`Дурь`,description:`Хищник (или бешеное животное), собирающийся атаковать это животное, может игнорировать одно из его свойств.`,tone:`gold`},pacifism:{id:`pacifism`,name:`Пацифизм`,short:`Пацифизм`,description:`Животное не может атаковать свойством «Хищник» и в бешенстве и не может использовать «Пиратство».`,tone:`info`}};function cn(){return Object.keys(on).flatMap(e=>[e,e])}function ln(){let e={};for(let t of Object.keys(sn))e[t]=4;return e}var un={perennial:{kind:`perennial`,name:`Многолетник`,description:`Разрастается по схеме 1→2, 2→3, 3+→5 (максимум 5 фишек). Появляется с 3 фишками.`,startFood:3,maxFood:5,growth:[[3,5],[2,3],[1,2]],shelters:0,carnivoreEdible:!1,aiValue:4},annual:{kind:`annual`,name:`Однолетник`,description:`Разрастается по схеме 0→1, 1→2, 2+→3 (максимум 3). Единственное растение, которое выживает без фишек: в конце фазы роста получает 1 фишку.`,startFood:2,maxFood:3,growth:[[2,3],[1,2],[0,1]],shelters:0,carnivoreEdible:!1,aiValue:3},fruit:{kind:`fruit`,name:`Плодовое`,description:`Разрастается по схеме 1→5, 2→4, 3+→3 (максимум 5): при 3–4 фишках ждёт неурожай. Даёт 1 убежище. Хищники могут брать с него еду.`,startFood:2,maxFood:5,growth:[[3,3],[2,4],[1,5]],shelters:1,carnivoreEdible:!0,aiValue:4},succulent:{kind:`succulent`,name:`Суккулент`,description:`Разрастается по схеме 1→2, 2→3, 3+→4 (максимум 4). Даёт 1 убежище. Хищники могут брать с него еду.`,startFood:3,maxFood:4,growth:[[3,4],[2,3],[1,2]],shelters:1,carnivoreEdible:!0,aiValue:4},legume:{kind:`legume`,name:`Бобовое`,description:`Разрастается по схеме 1→3, 2→4, 3+→5 (максимум 5) — всегда на +2.`,startFood:2,maxFood:5,growth:[[3,5],[2,4],[1,3]],shelters:0,carnivoreEdible:!1,aiValue:4},grass:{kind:`grass`,name:`Злак`,description:`Разрастается по схеме 1→2, 2→4, 3+→5 (максимум 5). Появляется с 2 фишками (реконструкция схемы по иллюстрации правил).`,startFood:2,maxFood:5,growth:[[3,5],[2,4],[1,2]],shelters:0,carnivoreEdible:!1,aiValue:3},liana:{kind:`liana`,name:`Лиана`,description:`В фазу роста на неё кладётся столько фишек, сколько на столе растений, не являющихся лианами (паразиты учитываются). Максимум 6 (реконструкция).`,startFood:1,maxFood:6,growth:[],shelters:0,carnivoreEdible:!1,aiValue:3},fungus:{kind:`fungus`,name:`Гриб`,description:`Всякий раз, когда погибает любое животное, на каждом грибе появляется 1 фишка (максимум 6 — реконструкция). Хищники могут брать с него еду.`,startFood:0,maxFood:6,growth:[],shelters:0,carnivoreEdible:!0,aiValue:3},carnivorous:{kind:`carnivorous`,name:`Хищное`,description:`Раз в фазу питания атакует: контратакует животное, тянущее с него еду (игнорируя одну его защиту), либо один из игроков направляет его на чужое животное. Съело животное — 2 фишки, получило хвост — 1. Съело ядовитое — погибает в вымирание. Максимум 6 фишек, стартует пустым. Хищники могут брать с него еду.`,startFood:0,maxFood:6,growth:[],shelters:0,carnivoreEdible:!0,aiValue:4},parasite:{kind:`parasite`,name:`Растение-Паразит`,description:`Самостоятельное растение со своими свойствами. Не считается в максимуме растений. Ход питания: вместо еды можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Выживает без фишек; погибает вместе с хозяином.`,startFood:0,maxFood:6,growth:[],shelters:0,carnivoreEdible:!1,aiValue:2}};function dn(e,t){for(let[n,r]of e.growth)if(t>=n)return Math.min(r,e.maxFood);return t}var fn={2:{initial:3,add:1,max:6},3:{initial:4,add:2,max:8},4:{initial:5,add:3,max:10},5:{initial:6,add:3,max:12},6:{initial:7,add:3,max:14},7:{initial:8,add:4,max:16},8:{initial:9,add:4,max:18}};function pn(e){return fn[Math.min(Math.max(e,2),8)]}function mn(){return[`perennial`,`annual`,`fruit`,`succulent`,`legume`,`grass`,`liana`,`fungus`,`carnivorous`].flatMap(e=>[e,e,e,e])}function hn(e){let t=un[e.kind].shelters;for(let n of e.traits)n.type===`thorny`&&(t+=3),n.type===`tree`&&(t+=1);return t}function gn(e){e.rngState=e.rngState+1831565813|0;let t=e.rngState;return t=Math.imul(t^t>>>15,1|t),t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}function _n(e){return 1+Math.floor(gn(e)*6)}function vn(e,t){let n=t.slice();for(let t=n.length-1;t>0;t--){let r=Math.floor(gn(e)*(t+1)),i=n[t];n[t]=n[r],n[r]=i}return n}function yn(e){return!e.hidden&&!e.disabled}function bn(e){return W(e,`carnivore`)||W(e,`obligateCarnivore`)}function xn(e,t){return!!e.marks?.includes(t)}function Sn(e){return xn(e,`sleep`)}function Cn(e,t){let n=e.players.find(e=>e.id===t);if(!n)throw Error(`player ${t}`);return n}function wn(e){return e.players.flatMap(e=>e.animals)}function U(e,t){return wn(e).find(e=>e.id===t)}function Tn(e,t){let n=U(e,t);if(!n)throw Error(`animal ${t}`);return n}function En(e,t){return e.plants?.find(e=>e.id===t)}function Dn(e,t){let n=En(e,t);if(!n)throw Error(`plant ${t}`);return n}function W(e,t,n=!1){return e.sedated||Sn(e)?!1:e.traits.some(e=>e.type===t&&!e.disabled&&(n||!e.hidden))}function On(e,t,n=!1){return e.sedated||Sn(e)?[]:e.traits.filter(e=>e.type===t&&!e.disabled&&(n||!e.hidden))}function kn(e,t=!1){if(Sn(e))return 1;let n=1;for(let r of e.traits)!t&&r.hidden||r.disabled||(n+=H[r.type].extraFood);return n}function An(e,t=!1){return kn(e,t)*(e.population??1)}function jn(e,t){return e.modules.continents?t.zoneId:void 0}function Mn(e,t){return e.modules.continents&&t.zoneId===`ocean`?!0:W(t,`swimming`)}function Nn(e,t){return!!e.paralyzed?.includes(t)}function Pn(e,t){return!bn(t)||xn(t,`pacifism`)||t.hibernating||Ln(t)?!1:!Nn(e,t.id)}function Fn(e,t){let n=0,r=0;for(let i of wn(e))jn(e,i)===t&&(i.traits.some(e=>e.type===`herding`&&yn(e))&&!i.sedated&&!Sn(i)&&(n+=i.population??1),bn(i)&&(r+=1));for(let n of e.plants??[])n.kind===`carnivorous`&&(e.modules.continents&&(n.zoneId??`laurasia`)!==t||(r+=1));return{herding:n,carnivores:r}}function In(e,t){if(!e.modules.continents||!t.traits.some(e=>e.type===`herding`&&yn(e)))return!1;let n=Fn(e,t.zoneId??`laurasia`);return n.herding>n.carnivores}function Ln(e,t=!1){return e.hibernating?!0:e.food>=An(e,t)}function Rn(e,t=!1){let n=On(e,`fatTissue`,t).length;return Math.max(0,n-e.fatTokens)}function zn(e,t){if(t.hibernating)return!1;let n=t.traits.filter(e=>e.type===`symbiosis`&&e.pairRole===`b`&&!e.hidden&&!e.disabled&&e.pairWith);for(let t of n){let n=U(e,t.pairWith);if(!n||!Ln(n))return!1}return!Ln(t)||Rn(t)>0}function Bn(e,t){return!t.sedated&&t.traits.some(t=>t.hidden||t.disabled||t.type!==`symbiosis`||t.pairRole!==`b`||!t.pairWith?!1:!!U(e,t.pairWith))}function Vn(e,t,n){if(t.id===n.id||!bn(t)||t.hibernating||Ln(t)||Nn(e,t.id)||n.sheltered||W(n,`transparent`)&&n.food===0&&n.blueFood===0||e.modules.continents&&(t.zoneId!==n.zoneId||In(e,n))||Bn(e,n))return!1;let r=Hn(n,Un(e,t,n)),i=t.traits.some(e=>yn(e)&&H[e.type].symmetricAquatic)||r.some(e=>H[e.type].symmetricAquatic),a=e.modules.continents&&(t.zoneId===`ocean`||n.zoneId===`ocean`);if((i||a)&&Mn(e,t)!==Mn(e,n))return!1;for(let e of r){let r=H[e.type].protection;if(r&&(r.stealthBypass&&!W(t,r.stealthBypass)||r.needsBulkyAttacker&&!W(t,`highBodyWeight`)||r.safeWhenFed&&Ln(n)))return!1}return!0}function Hn(e,t){return e.sedated||Sn(e)?[]:e.traits.filter(e=>yn(e)&&e.id!==t)}function Un(e,t,n){if(!(!(xn(n,`haze`)||W(n,`developmentDefects`))||n.sedated||Sn(n))){for(let e of n.traits){if(!yn(e))continue;let r=H[e.type].protection;if(r&&(r.stealthBypass&&!W(t,r.stealthBypass)||r.needsBulkyAttacker&&!W(t,`highBodyWeight`)||r.safeWhenFed&&Ln(n)))return e.id}if(!Mn(e,t)){let e=n.traits.find(e=>yn(e)&&e.type===`swimming`);if(e)return e.id}for(let e of[`tailLoss`,`running`,`mimicry`]){let t=n.traits.find(t=>yn(t)&&t.type===e);if(t)return t.id}}}function Wn(e){return!e.hibernating&&!xn(e,`pacifism`)}function Gn(e,t,n){if(t.id===n.id||!Wn(t)||n.sheltered||W(n,`transparent`)&&n.food===0&&n.blueFood===0||e.modules.continents&&(t.zoneId!==n.zoneId||In(e,n))||Bn(e,n))return!1;let r=Hn(n,Un(e,t,n)),i=t.traits.some(e=>yn(e)&&H[e.type].symmetricAquatic)||r.some(e=>H[e.type].symmetricAquatic),a=e.modules.continents&&(t.zoneId===`ocean`||n.zoneId===`ocean`);if((i||a)&&Mn(e,t)!==Mn(e,n))return!1;for(let e of r){let r=H[e.type].protection;if(r&&(r.stealthBypass&&!W(t,r.stealthBypass)||r.needsBulkyAttacker&&!W(t,`highBodyWeight`)||r.safeWhenFed&&Ln(n)))return!1}return!0}function Kn(e){let t=2*(e.population??1);for(let n of e.traits)yn(n)&&(t+=1+H[n.type].scoreBonus);return t}function qn(e,t){return t.traits.some(e=>e.type===`migration`&&yn(e))&&!t.hibernating&&!Nn(e,t.id)&&!(e.migratedThisPhase??[]).includes(t.id)}function Jn(e,t){return e.traits.some(e=>e.type===t&&!e.disabled&&!e.hidden)}function Yn(e,t,n){return!(n.food<=0||t.hibernating||t.sedated||e.modules.continents&&(t.zoneId??`laurasia`)!==(n.zoneId??`laurasia`)||Jn(n,`plantWater`)&&!Mn(e,t)||Jn(n,`rootVegetable`)&&!W(t,`burrowing`)||Jn(n,`tree`)&&!W(t,`highBodyWeight`)||bn(t)&&!un[n.kind].carnivoreEdible&&!Jn(n,`nutritious`))}function Xn(e,t,n){return!(n.sheltered||n.hibernating||Mn(e,n)||e.modules.continents&&((n.zoneId??`laurasia`)!==(t.zoneId??`laurasia`)||In(e,n))||!n.sedated&&(W(n,`highBodyWeight`)||W(n,`camouflage`)||W(n,`burrowing`)&&Ln(n)||Bn(e,n)))}function Zn(e,t,n){return!(n.shelters<=0||t.hibernating||t.sheltered||e.modules.continents&&(t.zoneId??`laurasia`)!==(n.zoneId??`laurasia`))}function Qn(e,t=e.currentPlayerId){let n=e.players.length;return(t+1)%n}function $n(e,t){return e.flora?.find(e=>e.id===t)}function er(e,t){let n=$n(e,t);if(!n)throw Error(`flora ${t}`);return n}function tr(e,t,n){return!(n.food<=0||t.hibernating||e.modules.continents&&(t.zoneId??`laurasia`)!==(n.zoneId??`gondwana`))}var nr=[`Дарвин`,`Уоллес`,`Мендель`,`Линней`,`Кювье`,`Ламарк`,`Геккель`];function G(e,t,n=`neutral`){e.log.push({id:e.log.length+1,text:t,tone:n}),e.log.length>80&&e.log.splice(0,e.log.length-80)}function K(e,t){e.lastEvents.push(t)}function rr(e,t){return e.idSeq+=1,`${t}${e.idSeq}`}function ir(e,t,n=Date.now()%1e6,r,i){let a=[`Вы`,...nr].slice(0,e),o={players:(r&&r.length===e?r.map((e,t)=>({id:t,name:e.name,isAI:e.isAI})):a.map((e,t)=>({id:t,name:e,isAI:t!==0}))).map(e=>({...e,hand:[],animals:[],discardCount:0,passedDev:!1,passedFeed:!1,blindDeck:i?.randomMutations?[]:void 0})),deck:[],foodBank:0,foodRoll:null,currentPlayerId:0,firstPlayerId:0,phase:`development`,year:1,lastYear:!1,deckEmptyAfterDraw:!1,log:[],pendingAttack:null,playSeq:0,humanId:0,difficulty:t,rngSeed:n,rngState:n>>>0,idSeq:0,eventSeq:0,lastEvents:[],devStartPlaySeq:0,extinctionDeaths:[],modules:i??{},paralyzed:i?.continents?[]:void 0,turnUse:di()};if(o.deck=vn(o,an(e=>rr(o,e),o.modules)),o.modules.plants&&(o.plants=[],o.plantDeck=vn(o,[...mn()]),hr(o,pn(e).initial,!0),o.plantDeckCount=o.plantDeck.length),o.modules.fungi&&(o.flora=[],o.floraDeck=vn(o,cn()),o.marksPool=ln(),o.madTurn=void 0,o.rageTurn=null,_r(o,2,!0),o.floraDeckCount=o.floraDeck.length),o.modules.randomMutations){for(let e of o.players)for(let t=0;t<7;t++){let t=o.deck.pop();t&&e.blindDeck.push(t)}G(o,`Случайные мутации: у каждого игрока личная колода из 7 карт.`,`good`)}else{let e=o.modules.plants?8:6;for(let t=0;t<e;t++)for(let e of o.players){let t=o.deck.pop();t&&e.hand.push(t)}}let s=Math.floor(gn(o)*e);return o.currentPlayerId=s,o.firstPlayerId=s,G(o,`Год 1. Первым ходит ${o.players[s].name}.`,`good`),ni(o,s),o}function ar(e){return structuredClone(e)}var or=new Set;function sr(){or.clear()}function cr(e,t){let n=e.players.find(e=>e.animals.some(e=>e.id===t));if(!n)throw Error(`owner`);return n}function lr(e,t){let n=e.hand.findIndex(e=>e.id===t);if(n<0)throw Error(`card not in hand`);return e.hand.splice(n,1)[0]}function ur(e,t){let n=e.faces[t]??e.faces[0];if(!n)throw Error(`empty card`);return n}function dr(e,t,n,r){return e.playSeq+=1,{id:rr(e,`t`),cardId:t.id,type:n,hidden:!1,playSeq:e.playSeq,...r}}function fr(e,t){let n=cr(e,t.id);n.discardCount+=(t.population??1)+t.traits.length;for(let n of t.traits)if(n.pairWith){let t=U(e,n.pairWith);t&&(t.traits=t.traits.filter(e=>e.cardId!==n.cardId))}n.animals=n.animals.filter(e=>e.id!==t.id),pr(e),xr(e,t),vr(e)}function pr(e){if(e.modules.plants)for(let t of e.plants??[]){if(t.kind!==`fungus`)continue;let e=un.fungus.maxFood;t.food<e&&(t.food+=1)}}function mr(e,t,n){let r=un[t];e.playSeq+=1;let i;e.modules.continents&&(i=n??`gondwana`);let a={id:rr(e,`p`),kind:t,food:r.startFood,shelters:r.shelters,traits:[],playSeq:e.playSeq,...i===void 0?{}:{zoneId:i}};return e.plants.push(a),K(e,{kind:`plantPlaced`,plantId:a.id,kindOfPlant:t}),a}function hr(e,t,n=!1){if(!e.modules.plants)return;let r=pn(e.players.length),i=0;for(let a=0;a<t&&!(e.plants.filter(e=>e.kind!==`parasite`).length>=r.max);a++){let t=e.plantDeck.pop();if(!t)break;let r;e.modules.continents&&(r=n?e.plants.filter(e=>e.kind!==`parasite`).length%2==0?`gondwana`:`laurasia`:e.plants.filter(e=>e.kind!==`parasite`&&(e.zoneId??`gondwana`)===`gondwana`).length>e.plants.filter(e=>e.kind!==`parasite`&&(e.zoneId??`gondwana`)===`laurasia`).length?`laurasia`:`gondwana`),mr(e,t,r),i+=1,G(e,`Новое растение: ${un[t].name}${r?` (${r===`gondwana`?`Гондвана`:`Лавразия`})`:``}.`,`good`)}i===0&&t>0&&G(e,`Колода растений пуста — новых растений нет.`),e.plantDeckCount=e.plantDeck.length}function gr(e,t,n){let r=on[t];e.playSeq+=1;let i={id:rr(e,`f`),kind:t,food:r.isFungus?1:3,playSeq:e.playSeq,...n===void 0?{}:{zoneId:n}};return e.flora.push(i),K(e,{kind:`floraPlaced`,floraId:i.id,kindOfFlora:t}),i}function _r(e,t,n=!1){if(!e.modules.fungi)return;let r=0;for(let i=0;i<t&&!(e.flora.length>=8);i++){let t=e.floraDeck.pop();if(!t)break;let i;if(e.modules.continents){let t=e.flora.filter(e=>(e.zoneId??`gondwana`)===`gondwana`).length,r=e.flora.filter(e=>(e.zoneId??`gondwana`)===`laurasia`).length;i=n?t===0?`gondwana`:`laurasia`:t>r?`laurasia`:`gondwana`}gr(e,t,i),r+=1,G(e,`Новая карта флоры: ${on[t].name}${i?` (${i===`gondwana`?`Гондвана`:`Лавразия`})`:``}.`,`good`)}r===0&&t>0&&e.floraDeck.length===0&&G(e,`Колода трав и грибов пуста — новых карт нет.`),e.floraDeckCount=e.floraDeck.length}function vr(e){if(!e.modules.fungi||e.phase!==`feeding`&&e.phase!==`extinction`)return;let t=(e.flora??[]).filter(e=>on[e.kind].isFungus&&e.food<4);if(!t.length)return;let n=t.reduce((e,t)=>t.food<e.food?t:e,t[0]),r=n.food;n.food+=1,K(e,{kind:`floraGrew`,floraId:n.id,from:r,to:n.food})}function yr(e,t,n,r){if(xn(t,n)||xn(t,`thryn`))return!1;if(!r?.force){let t=e.marksPool?.[n]??0;if(t<=0)return!1;e.marksPool={...e.marksPool,[n]:t-1}}return t.marks=[...t.marks??[],n],K(e,{kind:`markGained`,animalId:t.id,mark:n}),G(e,`${cr(e,t.id).name}: животное получает метку «${sn[n].name}».`,n===`poison`?`bad`:`neutral`),n===`poison`&&Sr(e,t,`parasite`),!0}function br(e,t,n){for(let r of n)yr(e,t,r,{force:!0})}function xr(e,t){if(t.marks?.length){for(let n of t.marks){let t=e.marksPool?.[n]??0;e.marksPool={...e.marksPool,[n]:t+1}}t.marks=[]}}function Sr(e,t,n){let r=t.traits.find(e=>e.type===n&&yn(e));if(r){if(r.pairWith){let t=U(e,r.pairWith);t&&(t.traits=t.traits.filter(e=>e.cardId!==r.cardId))}t.traits=t.traits.filter(e=>e.id!==r.id),cr(e,t.id).discardCount+=1,G(e,`Свойство «${H[n].name}» уходит в сброс.`)}}function Cr(e,t){if(e.phase!==`development`||e.currentPlayerId!==t)return[];let n=Cn(e,t);if(n.passedDev)return[];let r=e.modules.continents,i=e.modules.plants?e.plants??[]:[],a=[{type:`devPass`}];if(e.modules.randomMutations){let t=n.blindDeck??[];if(!t.length)return a;r?(a.push({type:`devMutate`,intent:`newAnimal`,zoneId:`laurasia`}),a.push({type:`devMutate`,intent:`newAnimal`,zoneId:`gondwana`})):a.push({type:`devMutate`,intent:`newAnimal`});for(let e of n.animals){(e.population??1)===1&&a.push({type:`devMutate`,intent:`trait`,animalId:e.id});let r=e.traits.some(e=>e.type===`extremophile`&&yn(e));(e.population??1)<n.animals.length&&(!r||t.length>=2)&&a.push({type:`devMutate`,intent:`population`,animalId:e.id})}if(e.modules.plants)for(let e of i)a.push({type:`devMutate`,intent:`plant`,plantId:e.id});return a}for(let t of n.hand){r?(a.push({type:`devPlayAnimal`,cardId:t.id,zoneId:`laurasia`}),a.push({type:`devPlayAnimal`,cardId:t.id,zoneId:`gondwana`})):a.push({type:`devPlayAnimal`,cardId:t.id});for(let o=0;o<t.faces.length;o++){let s=ur(t,o),c=H[s];if(c.plantTrait&&e.modules.plants){if(s===`micorrhiza`){for(let n=0;n<i.length;n++)for(let r=0;r<i.length;r++)n!==r&&Dr(e,i[n],i[r])&&a.push({type:`devPlayPlantPair`,cardId:t.id,face:o,a:i[n].id,b:i[r].id});continue}for(let e of i){if(s===`plantParasite`){a.push({type:`devPlayPlantTrait`,cardId:t.id,face:o,plantId:e.id});continue}Jn(e,s)||a.push({type:`devPlayPlantTrait`,cardId:t.id,face:o,plantId:e.id})}continue}if(c.opponentOnly||c.anyTarget){for(let r of e.players)if(!(c.opponentOnly&&r.id===n.id))for(let e of r.animals)Tr(e,s,!0)&&a.push({type:`devPlayTrait`,cardId:t.id,face:o,animalId:e.id})}else if(c.isPair){let e=n.animals;for(let n=0;n<e.length;n++)for(let r=0;r<e.length;r++)n!==r&&Er(e[n],e[r],s)&&a.push({type:`devPlayPair`,cardId:t.id,face:o,a:e[n].id,b:e[r].id})}else for(let i of n.animals)Tr(i,s,!0)&&(r&&s!==`neoplasia`&&!wr(e,i,s)||a.push({type:`devPlayTrait`,cardId:t.id,face:o,animalId:i.id}))}}return a}function wr(e,t,n){return!0}function Tr(e,t,n){let r=H[t];return!(t===`parasite`&&e.traits.some(e=>e.type===`parasite`)||t===`carnivore`&&W(e,`scavenger`,n)||t===`scavenger`&&W(e,`carnivore`,n)||(t===`carnivore`||t===`scavenger`)&&W(e,`obligateCarnivore`,n)||t===`obligateCarnivore`&&(W(e,`carnivore`,n)||W(e,`scavenger`,n))||!r.stackable&&W(e,t,n)||t===`regeneration`&&(e.traits.length>1||e.traits.some(e=>H[e.type].extraFood>0)||W(e,`regeneration`,n))||W(e,`regeneration`,n)&&e.traits.length>=2||W(e,`regeneration`,n)&&r.extraFood>0)}function Er(e,t,n){return e.id===t.id||e.zoneId!==t.zoneId?!1:!(e.traits.some(e=>e.pairWith===t.id)||t.traits.some(t=>t.pairWith===e.id))}function Dr(e,t,n){return t.id===n.id||e.modules.continents&&(t.zoneId??`gondwana`)!==(n.zoneId??`gondwana`)?!1:!(t.traits.some(e=>e.type===`micorrhiza`&&e.pairWith===n.id)||n.traits.some(e=>e.type===`micorrhiza`&&e.pairWith===t.id))}function Or(e,t){Cn(e,t).passedFeed=!1}function kr(e,t,n,r,i){if(n<=0||W(t,`obligateCarnivore`)&&!i?.obligate||!zn(e,t)&&!(Ln(t)&&Rn(t)>0))return;let a=n;for(;a>0&&!t.hibernating;)if(Ln(t)){if(Rn(t)>0)t.fatTokens+=1,K(e,{kind:`foodToFat`,animalId:t.id}),--a;else break}else t.food+=1,r===`blue`&&(t.blueFood+=1),--a;n-a<=0||(t.receivedFoodThisYear=!0,i?.triggerComm&&r===`red`&&Ar(e,t,`communication`),i?.triggerCoop!==!1&&Ar(e,t,`cooperation`))}function Ar(e,t,n){for(let r of t.traits){if(!yn(r)||r.type!==jr(n)||!r.pairWith||H[r.type].onPartnerFed!==n)continue;let t=`${n}:${r.cardId}`;if(or.has(t))continue;let i=U(e,r.pairWith);if(!(!i||i.hibernating)){if(n===`communication`){if(e.foodBank<=0||!zn(e,i))continue;or.add(t),--e.foodBank,kr(e,i,1,`red`,{triggerCoop:!0,triggerComm:!1}),K(e,{kind:`foodFromBank`,animalId:i.id,playerId:cr(e,i.id).id,via:`communication`}),G(e,`Взаимодействие: ${cr(e,i.id).name} берёт еду из базы. База: ${e.foodBank}.`)}else{if(!zn(e,i)&&Rn(i)===0)continue;or.add(t),kr(e,i,1,`blue`,{triggerCoop:!1,triggerComm:!1}),K(e,{kind:`blueFood`,animalId:i.id,reason:`cooperation`}),G(e,`Сотрудничество: ${cr(e,i.id).name} получает 1 синюю фишку.`)}}}}function jr(e){return e===`communication`?`communication`:`cooperation`}function Mr(e,t){let n=e.players.length;for(let r=0;r<n;r++){let i=e.players[(t+r)%n];for(let t of i.animals)if(t.traits.some(e=>e.type===`scavenger`&&yn(e))&&!t.hibernating&&!(Ln(t)&&Rn(t)===0)&&!(!zn(e,t)&&!Ln(t))){kr(e,t,1,`blue`),K(e,{kind:`blueFood`,animalId:t.id,reason:`scavenger`}),G(e,`Падальщик ${i.name} получает 1 синюю фишку.`,`good`);return}}}function Nr(e,t){if(e.phase!==`feeding`||e.pendingAttack||e.currentPlayerId!==t)return[];let n=Cn(e,t),r=[];if(e.rageTurn){let t=U(e,e.rageTurn.animalId);if(t&&Wn(t))for(let n of wn(e))Gn(e,t,n)&&r.push({type:`feedHunt`,carnivoreId:t.id,preyId:n.id});return r.push({type:`feedEndTurn`}),r}let i=e.turnUse,a=e.modules.continents,o=e.modules.plants?e.plants??[]:[],s=e.modules.fungi?e.flora??[]:[],c=e.turnTerritory,l=e=>!a||c===void 0||c===(e??`laurasia`);for(let t of n.animals){if(a&&i.migrated)break;let n=t.zoneId??`laurasia`,u=l(n);if((a?!o.length||n===`ocean`:!o.length)&&(a?(e.territoryFood?.[n]??0)>0:e.foodBank>0)&&u&&!i.foodTaken&&!i.combatUsed&&!i.sheltered&&zn(e,t)&&!W(t,`obligateCarnivore`)&&r.push({type:`feedTake`,animalId:t.id}),e.modules.plants&&!i.foodTaken&&!i.combatUsed&&!i.sheltered&&zn(e,t)&&!W(t,`obligateCarnivore`)&&!(a&&n===`ocean`))for(let n of o)l(n.zoneId)&&Yn(e,t,n)&&r.push({type:`feedTakePlant`,animalId:t.id,plantId:n.id});if(e.modules.fungi&&!i.foodTaken&&!i.combatUsed&&!i.sheltered&&!i.migrated&&zn(e,t)&&!W(t,`obligateCarnivore`)&&!(a&&n===`ocean`))for(let n of s)tr(e,t,n)&&l(n.zoneId)&&r.push({type:`feedTakeFlora`,animalId:t.id,floraId:n.id});if(e.modules.plants&&!i.foodTaken&&!i.combatUsed&&!i.migrated&&!i.sheltered)for(let n of o)l(n.zoneId)&&Zn(e,t,n)&&r.push({type:`feedShelter`,animalId:t.id,plantId:n.id});if(Pn(e,t)&&!i.carnivores.includes(t.id)&&!i.foodTaken&&!i.sheltered)for(let n of wn(e))Vn(e,t,n)&&r.push({type:`feedHunt`,carnivoreId:t.id,preyId:n.id});if(W(t,`piracy`)&&!Ln(t)&&!t.hibernating&&!i.pirates.includes(t.id)&&!i.foodTaken&&!i.sheltered&&!Nn(e,t.id)&&!xn(t,`pacifism`)&&!W(t,`obligateCarnivore`))for(let n of wn(e))n.id!==t.id&&(a&&n.zoneId!==t.zoneId||Ln(n)||n.food<=0||r.push({type:`feedPirate`,pirateId:t.id,targetId:n.id}));if(W(t,`hibernation`)&&!t.hibernatedLastYear&&!e.lastYear&&!t.hibernating&&!Ln(t)&&r.push({type:`feedHibernate`,animalId:t.id}),t.fatTokens>0&&!t.hibernating&&!Ln(t)){let e=Math.max(1,An(t)-t.food);r.push({type:`feedConvertFat`,animalId:t.id,amount:Math.min(t.fatTokens,e)})}if(!a&&!o.length&&e.foodBank>0&&W(t,`grazing`)&&!i.grazers.includes(t.id)&&!i.sheltered&&!Ln(t)&&r.push({type:`feedGraze`,animalId:t.id}),a&&(e.territoryFood?.[n]??0)>0&&W(t,`grazing`)&&!i.grazers.includes(t.id)&&!i.sheltered&&!Ln(t)&&(c===void 0||c===n)&&r.push({type:`feedGraze`,animalId:t.id}),e.modules.plants&&W(t,`grazing`)&&!i.grazers.includes(t.id)&&!i.sheltered&&!Ln(t))for(let e of o)e.food<=0||l(e.zoneId)&&(a&&(e.zoneId??`laurasia`)!==n||r.push({type:`feedGraze`,animalId:t.id,plantId:e.id}));if(e.modules.fungi&&W(t,`grazing`)&&!i.grazers.includes(t.id)&&!i.sheltered&&!Ln(t))for(let n of s)n.food<=0||tr(e,t,n)&&l(n.zoneId)&&r.push({type:`feedGraze`,animalId:t.id,floraId:n.id});if(a&&qn(e,t)&&!i.migrated){let n=Fr(e,t);for(let e of n)r.push({type:`feedMigrate`,moves:[{animalId:t.id,to:e}]})}}if(e.modules.plants){if(!i.foodTaken&&!i.combatUsed&&!i.migrated&&!i.sheltered){for(let t of o)if(!(t.kind!==`carnivorous`||t.attackedThisYear)&&l(t.zoneId))for(let i of wn(e))i.ownerId!==n.id&&Xn(e,t,i)&&r.push({type:`feedPlantAttack`,plantId:t.id,preyId:i.id})}if(!i.foodTaken&&!i.combatUsed&&!i.migrated&&!i.sheltered)for(let t of o){if(t.kind!==`parasite`||!t.hostId)continue;let n=En(e,t.hostId);!n||n.food<=1||l(n.zoneId)&&r.push({type:`feedParasitize`,hostId:n.id,parasiteId:t.id})}}return r.push({type:`feedEndTurn`}),(!e.modules.plants||!Pr(e,t))&&r.push({type:`feedSkip`}),r}function Pr(e,t){let n=Cn(e,t),r=e.plants??[],i=e.flora??[],a=e.modules.continents;for(let t of n.animals)if(!t.hibernating){if(a&&(t.zoneId??`laurasia`)===`ocean`){if((e.territoryFood?.ocean??0)>0&&zn(e,t)&&!W(t,`obligateCarnivore`))return!0;continue}if(zn(e,t)&&!W(t,`obligateCarnivore`)&&(r.some(n=>Yn(e,t,n))||i.some(n=>tr(e,t,n)))||!t.sheltered&&r.some(n=>Zn(e,t,n)))return!0}return!1}function Fr(e,t){let n=t.zoneId??`laurasia`,r=n===`ocean`||W(t,`swimming`),i=[];return n===`ocean`?i.push(`laurasia`,`gondwana`):r&&i.push(`ocean`),i.filter(e=>e!==n)}function Ir(e,t){if(e.sedated||Sn(e))return[];let n=[];for(let r of e.traits){if(!yn(r)||t.ignoredTraitId&&r.id===t.ignoredTraitId)continue;let i=H[r.type].defense;!i||t.usedDefenses.includes(i)||i===`mimicry`&&t.mimicryChain.includes(e.id)||n.includes(i)||n.push(i)}return n}function Lr(e,t,n){let r=cr(e,n.id);if(t.plantId){let i=Dn(e,t.plantId);return r.animals.filter(r=>r.id===n.id||t.mimicryChain.includes(r.id)?!1:Xn(e,i,r))}let i=Tn(e,t.carnivoreId),a=n=>t.rage?Gn(e,i,n):Vn(e,i,n);return r.animals.filter(e=>e.id===n.id||t.mimicryChain.includes(e.id)?!1:a(e))}function Rr(e,t){let n=e.pendingAttack;if(!n||n.waitingFor!==t)return[];let r=U(e,n.preyId);if(!r)return[{type:`chooseDefense`,kind:`none`}];let i=[{type:`chooseDefense`,kind:`none`}],a=Ir(r,n);if(a.includes(`running`)&&i.push({type:`chooseDefense`,kind:`running`}),a.includes(`mimicry`))for(let t of Lr(e,n,r))i.push({type:`chooseDefense`,kind:`mimicry`,mimicryTargetId:t.id});if(a.includes(`tailLoss`)){let e=r.traits.find(e=>yn(e)&&e.type===`tailLoss`);e&&i.push({type:`chooseDefense`,kind:`tailLoss`,discardTraitId:e.id})}return i}function zr(e,t,n,r){let i=cr(e,n.id),a=n.traits.some(e=>yn(e)&&H[e.type].killsKiller);if(K(e,{kind:`preyKilled`,preyId:n.id,carnivoreId:t.id}),G(e,`Хищное растение съедает животное ${i.name} (${Kn(n)} очк.).`,`hunt`),a&&(t.doomed=!0,G(e,`Добыча была ядовитой — растение погибнет в вымирание.`,`bad`)),W(n,`regeneration`)){e.pendingRegeneration=[...e.pendingRegeneration??[],Vr(n,i.id)],G(e,`Свойства съеденного регенерируют — владелец вернёт их животным.`,`good`);let t=cr(e,n.id);t.animals=t.animals.filter(e=>e.id!==n.id),t.discardCount+=1}else fr(e,n);let o=un.carnivorous.maxFood;t.food=Math.min(o,t.food+r),Mr(e,e.currentPlayerId),e.pendingAttack=null,Ri(e)}function Br(e,t,n,r,i){let a=cr(e,t.id),o=cr(e,n.id),s=[...n.marks??[]],c=n.traits.length===0||Sn(n),l=!i?.rage&&W(t,`insectivore`)&&c,u=l?1:r,d=!i?.rage&&n.traits.some(e=>yn(e)&&H[e.type].killsKiller)&&u===2;if(K(e,{kind:`preyKilled`,preyId:n.id,carnivoreId:t.id}),G(e,i?.rage?`Бешеное животное ${a.name} убивает животное ${o.name} (${Kn(n)} очк.) — добычу не ест.`:`${a.name} охотится: ${o.name} теряет животное (${Kn(n)} очк.).`,`hunt`),l&&G(e,`Насекомоядное: добыча без свойств — 1 синяя фишка вместо двух.`,`good`),d&&(t.poisoned=!0,G(e,`Хищник ${a.name} отравлен и погибнет в вымирание.`,`bad`)),n.traits.some(e=>yn(e)&&H[e.type].paralyzesAttacker)&&(e.paralyzed=e.paralyzed??[],e.paralyzed.includes(t.id)||e.paralyzed.push(t.id),e.modules.continents&&t.zoneId===`ocean`?(Hr(e,t),G(e,`Хищник парализован в океане — выброшен на континент.`,`bad`)):G(e,`Хищник ${a.name} парализован стрекательными клетками.`,`bad`),K(e,{kind:`paralyzed`,carnivoreId:t.id})),e.modules.randomMutations&&(n.population??1)>1)n.population=(n.population??1)-1,K(e,{kind:`populationLost`,animalId:n.id,to:n.population}),G(e,`${o.name}: вид теряет животное (осталось ${n.population}).`,`bad`),pr(e),vr(e);else if(W(n,`regeneration`)){e.pendingRegeneration=[...e.pendingRegeneration??[],Vr(n,o.id)],G(e,`Свойства съеденного регенерируют — владелец вернёт их животным.`,`good`);let t=cr(e,n.id);t.animals=t.animals.filter(e=>e.id!==n.id),t.discardCount+=1,xr(e,n)}else fr(e,n);if(i?.rage)Mr(e,a.id);else if(kr(e,t,u,`blue`,{obligate:!0}),K(e,{kind:`blueFood`,animalId:t.id,reason:`hunt`}),u>0&&W(t,`obligateCarnivore`)&&!t.hibernating&&(t.food=An(t),t.receivedFoodThisYear=!0,G(e,`${a.name}: облигатный хищник накормлен добычей.`,`good`)),br(e,t,s),u===2){for(let t of Object.values(H))if(t.onAnyKill===`scavenger`){Mr(e,a.id);break}}e.pendingAttack=null,i?.rage?xi(e):Ri(e)}function Vr(e,t){return{ownerId:t,cardIds:e.traits.map(e=>e.cardId)}}function Hr(e,t){t.zoneId=gn(e)<.5?`laurasia`:`gondwana`}function Ur(e){let t=e.pendingAttack;if(!t)return;if(t.plantId){let n=En(e,t.plantId),r=U(e,t.preyId);if(!n||!r){e.pendingAttack=null;return}zr(e,n,r,2);return}let n=U(e,t.carnivoreId),r=U(e,t.preyId);if(!n||!r){e.pendingAttack=null;return}Br(e,n,r,2,t.rage?{rage:!0}:void 0)}function Wr(e,t){let n=ar(e);switch(sr(),n.eventSeq+=1,n.lastEvents=[],t.type){case`devPlayAnimal`:Gr(n,t.cardId,t.zoneId);break;case`devPlayTrait`:Kr(n,t.cardId,t.face,t.animalId);break;case`devPlayPair`:qr(n,t.cardId,t.face,t.a,t.b);break;case`devPlayPlantTrait`:ri(n,t.cardId,t.face,t.plantId);break;case`devPlayPlantPair`:ai(n,t.cardId,t.face,t.a,t.b);break;case`devPass`:Jr(n);break;case`devMutate`:ti(n,t);break;case`rollFoodBank`:li(n);break;case`beginFeeding`:ui(n);break;case`continueExtinction`:Xi(n);break;case`continueGrowth`:ea(n);break;case`feedTake`:Si(n,t.animalId);break;case`feedTakePlant`:Ei(n,t.animalId,t.plantId);break;case`feedTakeFlora`:Di(n,t.animalId,t.floraId);break;case`feedShelter`:ji(n,t.animalId,t.plantId);break;case`feedHunt`:Pi(n,t.carnivoreId,t.preyId);break;case`feedPlantAttack`:Mi(n,t.plantId,t.preyId);break;case`feedParasitize`:Ni(n,t.hostId,t.parasiteId);break;case`feedPirate`:Fi(n,t.pirateId,t.targetId);break;case`feedHibernate`:Ii(n,t.animalId);break;case`feedConvertFat`:zi(n,t.animalId,t.amount);break;case`feedGraze`:Bi(n,t.animalId,t.plantId,t.floraId);break;case`feedEndTurn`:Li(n);break;case`feedSkip`:Gi(n);break;case`feedMigrate`:Vi(n,t.moves);break;case`reorderAnimal`:t.toZoneId?Wi(n,t.animalId,t.toZoneId):Ui(n,t.animalId,t.beforeId);break;case`chooseDefense`:Ki(n,t);break;default:throw Error(`unknown action ${t.type}`)}return n}function Gr(e,t,n){let r=Cn(e,e.currentPlayerId),i=lr(r,t),a=e.modules.continents&&n===`ocean`?`laurasia`:n??`laurasia`,o={id:rr(e,`a`),ownerId:r.id,cardId:i.id,traits:[],food:0,blueFood:0,fatTokens:0,hibernating:!1,hibernatedLastYear:!1,receivedFoodThisYear:!1,poisoned:!1,seed:i.id.length*17+r.id*13+r.animals.length,...e.modules.continents?{zoneId:a}:{}};r.animals.push(o),K(e,{kind:`animalPlaced`,animalId:o.id,ownerId:r.id,zoneId:o.zoneId}),G(e,e.modules.continents?`${r.name} выкладывает новое животное (${a===`laurasia`?`Лавразия`:`Гондвана`}).`:`${r.name} выкладывает новое животное.`),oi(e)}function Kr(e,t,n,r){let i=Cn(e,e.currentPlayerId),a=lr(i,t),o=ur(a,n),s=Tn(e,r);o===`neoplasia`?(s.traits.unshift(dr(e,a,o)),s.neoplasia=s.traits[0]):s.traits.push(dr(e,a,o)),K(e,{kind:`traitPlaced`,animalId:r,type:o,hidden:!1});let c=cr(e,r);o===`parasite`?G(e,`${i.name}: ${H[o].name} → животное ${c.name}.`,`bad`):G(e,`${i.name}: свойство ${H[o].name}.`),pi(e,s),oi(e)}function qr(e,t,n,r,i){let a=Cn(e,e.currentPlayerId),o=lr(a,t),s=ur(o,n),c=Tn(e,r),l=Tn(e,i);if(e.modules.continents&&c.zoneId!==l.zoneId)throw Error(`pair across territories`);c.traits.push(dr(e,o,s,{pairWith:l.id,pairRole:`a`})),l.traits.push(dr(e,o,s,{pairWith:c.id,pairRole:`b`,playSeq:e.playSeq})),K(e,{kind:`traitPlaced`,animalId:r,type:s,hidden:!1});let u=a.animals.findIndex(e=>e.id===r),d=a.animals.findIndex(e=>e.id===i);if(u>=0&&d>=0&&d!==u+1){let[e]=a.animals.splice(d,1);a.animals.splice(d<u?u:u+1,0,e)}G(e,`${a.name} связывает двух животных: ${H[s].name}.`),oi(e)}function Jr(e){let t=Cn(e,e.currentPlayerId);t.passedDev=!0,G(e,`${t.name} пасует.`),oi(e)}function Yr(e,t){return t.faces.length<=1?t.faces[0]:t.faces[Math.floor(gn(e)*t.faces.length)]}function Xr(e,t){return{id:e,faces:[t]}}function Zr(e,t,n,r){let i={id:rr(e,`a`),ownerId:t.id,cardId:n.id,traits:[],food:0,blueFood:0,fatTokens:0,hibernating:!1,hibernatedLastYear:!1,receivedFoodThisYear:!1,poisoned:!1,seed:n.id.length*17+t.id*13+t.animals.length,population:1,...e.modules.continents?{zoneId:r===`ocean`?`laurasia`:r??`laurasia`}:{}};return t.animals.push(i),K(e,{kind:`animalPlaced`,animalId:i.id,ownerId:t.id,zoneId:i.zoneId}),i}function Qr(e,t,n,r){n===`neoplasia`?(r.traits.unshift(dr(e,t,n)),r.neoplasia=r.traits[0]):r.traits.push(dr(e,t,n)),K(e,{kind:`traitPlaced`,animalId:r.id,type:n,hidden:!1}),pi(e,r)}function $r(e,t,n,r,i){let a=H[r],o=Zr(e,t,n,i);K(e,{kind:`mutationFlipped`,playerId:t.id,cardId:n.id,trait:r,usedAs:`newSpecies`}),!a.plantTrait&&!a.isPair&&!a.opponentOnly&&Tr(o,r,!0)?(Qr(e,n,r,o),G(e,`${t.name}: «${a.name}» не подошло ни одному виду — появляется новый вид-мутант.`,a.harmful?`bad`:`good`)):G(e,`${t.name}: карта ложится новым видом (свойство «${a.name}» сыграть нельзя).`)}function ei(e,t,n,r){let i=[...r.traits].filter(e=>!e.pairWith&&!e.disabled).sort((e,t)=>t.playSeq-e.playSeq)[0];if(i){r.traits=r.traits.filter(e=>e.id!==i.id),r.neoplasia?.id===i.id&&(r.neoplasia=void 0);let n=Zr(e,t,Xr(i.cardId,i.type),r.zoneId);n.traits.push(dr(e,Xr(i.cardId,i.type),i.type,{playSeq:i.playSeq})),K(e,{kind:`traitPlaced`,animalId:n.id,type:i.type,hidden:!1}),G(e,`${t.name}: «Упрощение» — «${H[i.type].name}» отделяется новым видом.`,`bad`)}Zr(e,t,n,r.zoneId),G(e,`${t.name}: «Упрощение» — карта ложится новым видом.`,`bad`)}function ti(e,t){let n=Cn(e,e.currentPlayerId),r=n.blindDeck??[];if(!r.length){oi(e);return}let i=r.pop();if(t.intent===`newAnimal`){Zr(e,n,i,e.modules.continents?t.zoneId===`ocean`?`laurasia`:t.zoneId??`laurasia`:void 0),K(e,{kind:`mutationFlipped`,playerId:n.id,cardId:i.id,trait:null,usedAs:`animal`}),G(e,`${n.name}: объявлен новый вид — карта из колоды ложится животным.`),oi(e);return}if(t.intent===`population`){let a=U(e,t.animalId??``);if(!a||a.ownerId!==n.id||(a.population??1)>=n.animals.length){$r(e,n,i,Yr(e,i),a?.zoneId),oi(e);return}a.traits.some(e=>e.type===`extremophile`&&yn(e))&&r.length&&(r.pop(),n.discardCount+=1,G(e,`«Экстрофил»: дополнительная карта уходит в сброс.`,`bad`)),a.population=(a.population??1)+1,K(e,{kind:`mutationFlipped`,playerId:n.id,cardId:i.id,trait:null,usedAs:`population`}),K(e,{kind:`populationGrown`,animalId:a.id,to:a.population}),G(e,`${n.name}: вид получает +1 животное (численность ${a.population}).`),oi(e);return}if(t.intent===`plant`){let r=Yr(e,i),a=H[r],o=e.modules.plants?En(e,t.plantId??``):void 0;if(o&&a.plantTrait&&r!==`micorrhiza`&&(r===`plantParasite`||!Jn(o,r))){ii(e,n,i,r,o),K(e,{kind:`mutationFlipped`,playerId:n.id,cardId:i.id,trait:r,usedAs:`plantTrait`}),oi(e);return}$r(e,n,i,r,o?.zoneId),oi(e);return}let a=Yr(e,i),o=U(e,t.animalId??``);if(!o||o.ownerId!==n.id||(o.population??1)!==1){$r(e,n,i,a,o?.zoneId),oi(e);return}if(a===`simplification`){K(e,{kind:`mutationFlipped`,playerId:n.id,cardId:i.id,trait:a,usedAs:`newSpecies`}),ei(e,n,i,o),oi(e);return}let s=H[a],c=e=>!s.plantTrait&&!s.isPair&&!s.opponentOnly&&Tr(e,a,!0);if(c(o)){Qr(e,i,a,o),K(e,{kind:`mutationFlipped`,playerId:n.id,cardId:i.id,trait:a,usedAs:`trait`}),G(e,s.harmful?`${n.name}: вредная мутация — «${s.name}» на своём виде!`:`${n.name}: мутация «${s.name}».`,s.harmful?`bad`:`neutral`),oi(e);return}let l=n.animals.findIndex(e=>e.id===o.id);for(let t=1;t<n.animals.length;t++){let r=n.animals[(l+t)%n.animals.length];if((r.population??1)===1&&c(r)){Qr(e,i,a,r),K(e,{kind:`mutationFlipped`,playerId:n.id,cardId:i.id,trait:a,usedAs:`trait`}),G(e,`${n.name}: «${s.name}» не подошло виду — переехало соседнему.`),oi(e);return}}$r(e,n,i,a,o.zoneId),oi(e)}function ni(e,t){if(!e.modules.randomMutations||e.phase!==`development`)return;let n=Cn(e,t);if(!n.passedDev){for(let t of[...n.animals])if(t.traits.some(e=>e.type===`budding`&&yn(e))){if(!n.blindDeck?.length)break;n.blindDeck.pop(),t.population=(t.population??1)+1,K(e,{kind:`budding`,animalId:t.id,playerId:n.id}),K(e,{kind:`populationGrown`,animalId:t.id,to:t.population}),G(e,`${n.name}: «Почкование» — вид растёт до ${t.population} животного(-ых).`,`good`)}}}function ri(e,t,n,r){let i=Cn(e,e.currentPlayerId),a=lr(i,t);ii(e,i,a,ur(a,n),Dn(e,r)),oi(e)}function ii(e,t,n,r,i){if(r===`plantParasite`){e.playSeq+=1;let n={id:rr(e,`p`),kind:`parasite`,food:0,shelters:0,traits:[],hostId:i.id,playSeq:e.playSeq,...i.zoneId===void 0?{}:{zoneId:i.zoneId}};e.plants.push(n),K(e,{kind:`plantPlaced`,plantId:n.id,kindOfPlant:`parasite`}),G(e,`${t.name}: растение-паразит на ${un[i.kind].name}.`);return}i.traits.push(dr(e,n,r)),r===`thorny`&&(i.shelters+=3),r===`tree`&&(i.shelters+=1),G(e,`${t.name}: свойство ${H[r].name} → ${un[i.kind].name}.`)}function ai(e,t,n,r,i){let a=Cn(e,e.currentPlayerId),o=lr(a,t),s=ur(o,n),c=Dn(e,r),l=Dn(e,i);if(!Dr(e,c,l))throw Error(`micorrhiza link rejected`);c.traits.push(dr(e,o,s,{pairWith:l.id,pairRole:`a`})),l.traits.push(dr(e,o,s,{pairWith:c.id,pairRole:`b`,playSeq:e.playSeq})),G(e,`${a.name}: микориза связывает ${un[c.kind].name} и ${un[l.kind].name}.`),oi(e)}function oi(e){if(e.modules.randomMutations)for(let t of e.players)(t.blindDeck??[]).length||(t.passedDev=!0);else if(e.players.every(e=>e.passedDev||e.hand.length===0))for(let t of e.players)t.hand.length===0&&(t.passedDev=!0);if(e.players.every(e=>e.passedDev)){si(e);return}let t=Qn(e);for(let n=0;n<e.players.length;n++){if(!Cn(e,t).passedDev){e.currentPlayerId=t,ni(e,t);return}t=Qn(e,t)}si(e)}function si(e){for(let t of wn(e)){t.traits.sort((e,t)=>e.playSeq-t.playSeq);let e=new Set,n=[];for(let r of t.traits){let i=r.type===`fatTissue`?r.id:r.pairWith?`${r.type}:${r.pairWith}`:r.type;r.type===`carnivore`&&t.traits.some(e=>e.type===`scavenger`&&e.playSeq<r.playSeq)||r.type===`scavenger`&&t.traits.some(e=>e.type===`carnivore`&&e.playSeq<r.playSeq)||r.type!==`fatTissue`&&e.has(i)||(e.add(i),r.hidden=!1,n.push(r))}t.traits=n,t.neoplasia&&t.traits[0]!==t.neoplasia&&(t.traits=[t.neoplasia,...t.traits.filter(e=>e.id!==t.neoplasia.id)])}if(K(e,{kind:`traitsRevealed`}),(e.modules.plants||e.modules.fungi)&&!e.modules.continents){e.modules.fungi&&_r(e,e.players.length),G(e,e.modules.plants&&e.modules.fungi?`Питание: еда этого года — на растениях, травах и грибах.`:e.modules.plants?`Питание: еда этого года — на растениях.`:`Питание: еда этого года — на травах и грибах.`,`good`),ci(e);return}e.modules.fungi&&_r(e,e.players.length),G(e,`Определение кормовой базы.`,`good`),e.phase=`foodBank`,e.foodRoll=null,e.foodBank=0}function ci(e){e.phase=`feeding`,e.currentPlayerId=e.firstPlayerId;for(let t of e.players)t.passedFeed=!1;e.turnTerritory=void 0,e.madTurn=void 0,e.rageTurn=null,e.migratedThisPhase=[],vi(e,e.firstPlayerId)}function li(e){if(e.phase!==`foodBank`||e.foodRoll)return;let t=e.players.length;if(e.modules.plants||e.modules.fungi){Yi(e);let n=fi(t);for(let t of wn(e))t.hibernating||t.traits.some(e=>e.type===`edificator`&&yn(e))&&(t.zoneId??`laurasia`)===`ocean`&&(n.ocean+=2,K(e,{kind:`edificator`,territory:`ocean`,amount:2}));e.foodRoll=[_n(e)],e.territoryFood={laurasia:0,gondwana:0,ocean:n.ocean},e.foodBank=n.ocean,K(e,{kind:`diceRoll`,dice:e.foodRoll,total:n.ocean}),G(e,`Океан: кормовая база ${n.ocean}. На континентах еда — на столе флоры.`,`good`);return}if(e.modules.continents){Yi(e);let n=[_n(e),_n(e)],r=fi(t);for(let t of wn(e)){if(t.hibernating||!t.traits.some(e=>e.type===`edificator`&&yn(e)))continue;let n=t.zoneId??`laurasia`;r[n]+=2,K(e,{kind:`edificator`,territory:n,amount:2})}e.foodRoll=n,e.territoryFood=r,e.foodBank=r.laurasia+r.gondwana+r.ocean,K(e,{kind:`diceRoll`,dice:n,total:e.foodBank}),G(e,`Кормовые базы — Лавразия ${r.laurasia}, Гондвана ${r.gondwana}, Океан ${r.ocean}.`,`good`);return}let n=t===2?[_n(e)]:[_n(e),_n(e)],r=n.reduce((e,t)=>e+t,0);(t===2||t>=4)&&(r+=2),e.foodRoll=n,e.foodBank=r,K(e,{kind:`diceRoll`,dice:n,total:r}),G(e,`Кубики кормовой базы: ${n.join(` + `)}${t===3?``:` (+2)`} = ${r}.`,`good`)}function ui(e){if(!(e.phase!==`foodBank`||!e.foodRoll)){e.phase=`feeding`,e.currentPlayerId=e.firstPlayerId;for(let t of e.players)t.passedFeed=!1;(e.modules.plants||e.modules.fungi)&&e.modules.continents?G(e,`Океан: кормовая база ${e.territoryFood?.ocean??0}. На континентах еда — на столе флоры${e.modules.plants?` (растения`+(e.modules.fungi?` и травы с грибами)`:`)`):` (травы и грибы)`}.`,`good`):e.modules.continents?G(e,`Кормовые базы: Лавразия ${e.territoryFood?.laurasia??0}, Гондвана ${e.territoryFood?.gondwana??0}, Океан ${e.territoryFood?.ocean??0}.`,`good`):G(e,`Кормовая база: ${e.foodBank}.`,`good`),e.turnTerritory=void 0,e.madTurn=void 0,e.rageTurn=null,e.migratedThisPhase=[],vi(e,e.firstPlayerId)}}function di(){return{carnivores:[],pirates:[],grazers:[],foodTaken:!1,combatUsed:!1,migrated:!1,sheltered:!1}}function fi(e){if(e<=2)return{laurasia:8,gondwana:7,ocean:5};if(e===3)return{laurasia:11,gondwana:10,ocean:7};if(e===4)return{laurasia:14,gondwana:13,ocean:9};let t=e-4;return{laurasia:14+2*t,gondwana:13+2*t,ocean:9+t}}function pi(e,t){if(!e.modules.continents)return;t.zoneId||=`laurasia`;let n=t.zoneId;W(t,`swimming`)&&t.zoneId!==`ocean`&&mi(e,t,`ocean`),t.zoneId!==n&&Hi(e)}function mi(e,t,n){t.zoneId=n}function hi(e,t){return Nr({...e,currentPlayerId:t,turnUse:di(),turnTerritory:void 0},t).some(e=>e.type!==`feedSkip`&&e.type!==`feedEndTurn`)}function gi(e,t){return!e.modules.continents||!t?e.foodBank:e.territoryFood?.[t]??0}function _i(e,t,n=1){if(e.modules.continents&&t){let r=e.territoryFood?.[t]??0;e.territoryFood={...e.territoryFood,[t]:Math.max(0,r-n)},e.foodBank=Math.max(0,e.foodBank-n);return}e.foodBank=Math.max(0,e.foodBank-n)}function vi(e,t){e.madTurn=void 0,e.rageTurn=null;let n=t;for(let t=0;t<e.players.length;t++){if(!Cn(e,n).passedFeed&&hi(e,n)){e.currentPlayerId=n,e.turnUse=di(),e.turnTerritory=void 0,yi(e,n);return}n=Qn(e,n)}Ji(e)}function yi(e,t){if(!e.modules.fungi)return;let n=Cn(e,t),r=n.animals.find(e=>xn(e,`rage`));if(r){bi(e,r,`rage`),e.rageTurn={animalId:r.id},G(e,`Бешенство: животное игрока ${n.name} обязано атаковать в этот раунд!`,`hunt`);return}let i=n.animals.find(e=>xn(e,`madness`));i&&(bi(e,i,`madness`),e.madTurn=t,G(e,`Безумие: раунд игрока ${n.name} проводит сосед справа.`,`bad`))}function bi(e,t,n){if(!t.marks?.length)return;t.marks=t.marks.filter(e=>e!==n);let r=e.marksPool?.[n]??0;e.marksPool={...e.marksPool,[n]:r+1}}function xi(e){e.pendingAttack||vi(e,Qn(e))}function Si(e,t){let n=Cn(e,e.currentPlayerId);Or(e,n.id);let r=Tn(e,t),i=r.zoneId;gi(e,i)<=0||e.turnUse.foodTaken||e.turnUse.combatUsed||e.turnUse.migrated||e.turnUse.sheltered||e.modules.continents&&e.turnTerritory&&e.turnTerritory!==i||(_i(e,i,1),e.turnUse.foodTaken=!0,e.turnTerritory=e.modules.continents?i??`laurasia`:void 0,kr(e,r,1,`red`,{triggerComm:!0,triggerCoop:!0}),K(e,{kind:`foodFromBank`,animalId:r.id,playerId:n.id,via:`take`}),G(e,`${n.name} берёт еду из базы (${gi(e,i)} осталось).`),Ri(e))}function Ci(e,t,n){if(n.food<=0)return;let r=cr(e,t.id);if(--n.food,K(e,{kind:`plantFoodTaken`,animalId:t.id,plantId:n.id,playerId:r.id}),Jn(n,`medicinal`)){Ln(t)&&!t.sedated&&Rn(t)>0&&!t.hibernating?(t.fatTokens+=1,K(e,{kind:`foodToFat`,animalId:t.id})):t.food+=1,t.sedated=!0,t.receivedFoodThisYear=!0,G(e,`${r.name}: лекарственное растение — животное накормлено, свойства не действуют до конца фазы.`);return}kr(e,t,1,`red`,{triggerComm:!1,triggerCoop:!0}),wi(e,t,n),G(e,`${r.name}: фишка с растения ${un[n.kind].name} (осталось ${n.food}).`),Jn(n,`nutritious`)&&n.food>0&&(--n.food,kr(e,t,1,`red`,{triggerCoop:!0}),G(e,`Питательное растение: ещё одна фишка.`,`good`)),Jn(n,`honeyPlant`)&&Ti(e,r.id)}function wi(e,t,n){for(let r of t.traits){if(!yn(r)||r.type!==`communication`||!r.pairWith)continue;let t=`communication:${r.cardId}`;if(or.has(t))continue;let i=U(e,r.pairWith);if(!i||i.hibernating||n.food<=0||!zn(e,i)||!Yn(e,i,n))continue;or.add(t),--n.food,kr(e,i,1,`red`,{triggerCoop:!0,triggerComm:!1});let a=cr(e,i.id);K(e,{kind:`plantFoodTaken`,animalId:i.id,plantId:n.id,playerId:a.id}),G(e,`Взаимодействие: ${a.name} берёт фишку с того же растения.`)}}function Ti(e,t){let n=Cn(e,t),r=e.players.filter(e=>e.id!==t&&e.hand.length>n.hand.length);if(!r.length)return;let i=r.reduce((e,t)=>t.hand.length>e.hand.length?t:e,r[0]),a=Math.floor(gn(e)*i.hand.length),[o]=i.hand.splice(a,1);o&&(n.hand.push(o),K(e,{kind:`cardStolen`,fromPlayerId:i.id,toPlayerId:t}),G(e,`Медонос: ${n.name} вытягивает карту у ${i.name}.`,`good`))}function Ei(e,t,n){let r=Cn(e,e.currentPlayerId);Or(e,r.id);let i=Tn(e,t),a=Dn(e,n);if(!(e.turnUse.foodTaken||e.turnUse.combatUsed||e.turnUse.migrated||e.turnUse.sheltered)&&Yn(e,i,a)){if(e.modules.continents){let t=a.zoneId??`gondwana`;if(e.turnTerritory&&e.turnTerritory!==t)return;e.turnTerritory=t}if(a.kind===`carnivorous`&&!a.attackedThisYear){a.attackedThisYear=!0,e.turnUse.foodTaken=!0;let t={carnivoreId:a.id,preyId:i.id,mimicryChain:[],waitingFor:r.id,usedDefenses:[],plantId:a.id,plantCounter:!0,plantRequesterId:i.id};e.pendingAttack=t,K(e,{kind:`plantAttack`,plantId:a.id,preyId:i.id,counter:!0}),G(e,`Хищное растение контратакует ${r.name}!`,`hunt`),Ir(i,t).length===0&&Ur(e);return}e.turnUse.foodTaken=!0,Ci(e,i,a),Ri(e)}}function Di(e,t,n){Or(e,Cn(e,e.currentPlayerId).id);let r=Tn(e,t),i=er(e,n);if(!(e.turnUse.foodTaken||e.turnUse.combatUsed||e.turnUse.migrated||e.turnUse.sheltered)&&!(!tr(e,r,i)||!zn(e,r))){if(e.modules.continents){let t=i.zoneId??`gondwana`;if(e.turnTerritory&&e.turnTerritory!==t)return;e.turnTerritory=t}e.turnUse.foodTaken=!0,Oi(e,r,i),Ri(e)}}function Oi(e,t,n){if(n.food<=0)return;--n.food;let r=cr(e,t.id);K(e,{kind:`floraFoodTaken`,animalId:t.id,floraId:n.id,playerId:r.id}),Ai(e,t,n),kr(e,t,1,`red`,{triggerComm:!1,triggerCoop:!0}),ki(e,t,n),G(e,`${r.name}: фишка с карты ${on[n.kind].name} (осталось ${n.food}).`);let i=on[n.kind];i.mark&&yr(e,t,i.mark)}function ki(e,t,n){for(let r of t.traits){if(!yn(r)||r.type!==`communication`||!r.pairWith)continue;let t=`communication:${r.cardId}`;if(or.has(t))continue;let i=U(e,r.pairWith);!i||i.hibernating||!zn(e,i)||!tr(e,i,n)||(or.add(t),Oi(e,i,n),G(e,`Взаимодействие: ${cr(e,i.id).name} берёт фишку с той же карты флоры.`))}}function Ai(e,t,n){let r=cr(e,t.id);switch(n.kind){case`insight`:if(r.hand.length){let t=r.hand.length;r.hand=[],K(e,{kind:`handLost`,playerId:r.id}),G(e,`Гриб прозрения: ${r.name} сбрасывает всю руку (${t} карт).`,`bad`)}return;case`soaring`:{let n=0;for(let r of[...t.traits]){if(!r.pairWith)continue;let i=U(e,r.pairWith);i&&(i.traits=i.traits.filter(e=>e.cardId!==r.cardId)),t.traits=t.traits.filter(e=>e.cardId!==r.cardId),n+=1}n&&(r.discardCount+=n,G(e,`Окрыляющий гриб: ${n} парных свойств уходят в сброс.`,`bad`)),kr(e,t,1,`blue`),K(e,{kind:`blueFood`,animalId:t.id,reason:`soaring`}),G(e,`Окрыляющий гриб: животное получает 1 синюю фишку.`,`good`);return}case`cleanser`:{t.food=Math.min(t.food,1),t.blueFood=0;let n=(t.marks??[]).length;xr(e,t),G(e,`Очистительная трава: ${r.name} оставляет одну фишку, прочие сняты${n?`, меток снято: ${n}`:``}.`,`bad`);return}case`passionflower`:{let n=[...t.traits].reverse().find(e=>e.type!==`parasite`&&e.type!==`neoplasia`&&!e.pairWith&&!e.disabled);if(!n)return;t.traits=t.traits.filter(e=>e.id!==n.id),e.playSeq+=1;let i={id:rr(e,`a`),ownerId:r.id,cardId:n.cardId,traits:[],food:0,blueFood:0,fatTokens:0,hibernating:!1,hibernatedLastYear:!1,receivedFoodThisYear:!1,poisoned:!1,seed:n.cardId.length*17+r.id*13,...t.zoneId===void 0?{}:{zoneId:t.zoneId}};r.animals.push(i),K(e,{kind:`animalPlaced`,animalId:i.id,ownerId:r.id,zoneId:i.zoneId}),G(e,`Страстоцвет: свойство «${H[n.type].name}» становится новым животным ${r.name}.`,`good`);return}default:return}}function ji(e,t,n){let r=Cn(e,e.currentPlayerId);Or(e,r.id);let i=Tn(e,t),a=Dn(e,n);if(!(e.turnUse.foodTaken||e.turnUse.combatUsed||e.turnUse.migrated||e.turnUse.sheltered)&&Zn(e,i,a)){if(e.modules.continents){let t=a.zoneId??`gondwana`;if(e.turnTerritory&&e.turnTerritory!==t)return;e.turnTerritory=t}if(e.modules.randomMutations&&W(i,`barkBeetle`)&&!Ln(i)&&!W(i,`obligateCarnivore`)){e.turnUse.sheltered=!0,kr(e,i,1,`blue`),K(e,{kind:`blueFood`,animalId:i.id,reason:`beetle`}),G(e,`${r.name}: «Короед» — убежище превращается в синюю фишку еды.`,`bad`),Ri(e);return}--a.shelters,i.sheltered=!0,e.turnUse.sheltered=!0,K(e,{kind:`shelterTaken`,animalId:i.id,plantId:a.id}),G(e,`${r.name}: животное прячется в убежище (${un[a.kind].name}).`,`good`),Ri(e)}}function Mi(e,t,n){let r=Cn(e,e.currentPlayerId);Or(e,r.id);let i=Dn(e,t),a=Tn(e,n);if(e.turnUse.foodTaken||e.turnUse.combatUsed||e.turnUse.migrated||e.turnUse.sheltered||i.kind!==`carnivorous`||i.attackedThisYear||!Xn(e,i,a))return;i.attackedThisYear=!0,e.turnUse.combatUsed=!0;let o={carnivoreId:i.id,preyId:a.id,mimicryChain:[],waitingFor:a.ownerId,usedDefenses:[],plantId:i.id};e.pendingAttack=o,K(e,{kind:`plantAttack`,plantId:i.id,preyId:a.id,counter:!1}),G(e,`${r.name} направляет хищное растение на животное ${cr(e,a.id).name}!`,`hunt`),Ir(a,o).length===0&&Ur(e)}function Ni(e,t,n){let r=Cn(e,e.currentPlayerId);Or(e,r.id);let i=Dn(e,t),a=Dn(e,n);e.turnUse.foodTaken||e.turnUse.combatUsed||e.turnUse.migrated||e.turnUse.sheltered||a.kind!==`parasite`||a.hostId!==i.id||i.food<=1||(--i.food,a.food+=1,e.turnUse.foodTaken=!0,G(e,`${r.name}: фишка переходит на растение-паразит.`),Ri(e))}function Pi(e,t,n){let r=Cn(e,e.currentPlayerId);Or(e,r.id);let i=Tn(e,t),a=Tn(e,n);if(e.rageTurn){if(e.rageTurn.animalId!==t||!Gn(e,i,a))return;e.rageTurn=null,e.turnUse.combatUsed=!0,K(e,{kind:`huntDeclared`,carnivoreId:t,preyId:n});let o={carnivoreId:t,preyId:n,mimicryChain:[],waitingFor:a.ownerId,usedDefenses:[],rage:!0,ignoredTraitId:Un(e,i,a)};if(e.pendingAttack=o,G(e,`Бешеное животное игрока ${r.name} атакует!`,`hunt`),Ir(a,o).length===0){Ur(e);return}return}if(e.turnUse.foodTaken||e.turnUse.sheltered||e.turnUse.carnivores.includes(t)||!Vn(e,i,a))return;e.turnUse.carnivores.push(t),e.turnUse.combatUsed=!0,K(e,{kind:`huntDeclared`,carnivoreId:t,preyId:n});let o={carnivoreId:t,preyId:n,mimicryChain:[],waitingFor:a.ownerId,usedDefenses:[],ignoredTraitId:Un(e,i,a)};if(e.pendingAttack=o,Ir(a,o).length===0){Ur(e);return}G(e,`${r.name} атакует животное игрока ${cr(e,a.id).name}!`,`hunt`)}function Fi(e,t,n){let r=Cn(e,e.currentPlayerId);Or(e,r.id);let i=Tn(e,t),a=Tn(e,n);if(e.turnUse.foodTaken||e.turnUse.sheltered||e.turnUse.pirates.includes(t)||a.food<=0||Ln(a))return;e.turnUse.pirates.push(t),e.turnUse.combatUsed=!0;let o=a.blueFood>0;o&&--a.blueFood,--a.food,kr(e,i,1,o?`blue`:`red`),K(e,{kind:`blueFood`,animalId:i.id,reason:`piracy`}),G(e,`${r.name} пиратствует у ${cr(e,a.id).name}.`,`hunt`),Ri(e)}function Ii(e,t){let n=Cn(e,e.currentPlayerId);Or(e,n.id);let r=Tn(e,t);r.hibernating=!0,G(e,`${n.name} использует спячку.`,`good`),xi(e)}function Li(e){G(e,`${Cn(e,e.currentPlayerId).name} заканчивает ход.`),xi(e)}function Ri(e){e.phase!==`feeding`||e.pendingAttack||hi(e,e.currentPlayerId)||xi(e)}function zi(e,t,n){let r=Cn(e,e.currentPlayerId),i=Tn(e,t),a=Math.min(n,i.fatTokens);i.fatTokens-=a,i.food+=a,i.blueFood+=a,K(e,{kind:`blueFood`,animalId:i.id,reason:`fat`}),G(e,`${r.name} тратит жировой запас (${a}). Ход продолжается.`),Ri(e)}function Bi(e,t,n,r){let i=Cn(e,e.currentPlayerId);Or(e,i.id);let a=Tn(e,t);if(r&&e.modules.fungi){let n=er(e,r);if(!W(a,`grazing`)||n.food<=0||e.turnUse.sheltered){xi(e);return}let o=n.food;if(--n.food,e.turnUse.grazers.push(t),e.modules.continents){let t=n.zoneId??`gondwana`;(e.turnTerritory===void 0||e.turnTerritory===t)&&(e.turnTerritory=t)}K(e,{kind:`floraGrazed`,floraId:n.id,from:o,to:n.food}),G(e,`${i.name}: топтун уничтожает фишку с карты ${on[n.kind].name} (осталось ${n.food}).`),Ri(e);return}if(n&&e.modules.plants){let r=Dn(e,n);if(!W(a,`grazing`)||r.food<=0||e.turnUse.sheltered){xi(e);return}let o=r.food;if(--r.food,e.turnUse.grazers.push(t),e.modules.continents){let t=r.zoneId??`gondwana`;(e.turnTerritory===void 0||e.turnTerritory===t)&&(e.turnTerritory=t)}K(e,{kind:`plantGrazed`,plantId:r.id,from:o,to:r.food}),G(e,`${i.name}: топтун уничтожает фишку растения ${un[r.kind].name} (осталось ${r.food}).`),Ri(e);return}if(!W(a,`grazing`)||gi(e,a.zoneId)<=0||e.turnUse.sheltered){xi(e);return}let o=e.modules.randomMutations?Math.min(a.population??1,gi(e,a.zoneId)):1;_i(e,a.zoneId,o),e.turnUse.grazers.push(t),K(e,{kind:`bankBurned`,amount:o,territory:a.zoneId}),G(e,`${i.name}: топотун уничтожает ${o} ед. еды. База: ${gi(e,a.zoneId)}.`),Ri(e)}function Vi(e,t){let n=Cn(e,e.currentPlayerId);if(Or(e,n.id),e.turnUse.migrated)return;let r=[];for(let n of t){let t=U(e,n.animalId);if(!t||!qn(e,t))continue;let i=t.zoneId;if(i!==n.to&&Fr(e,t).includes(n.to)){t.zoneId=n.to,r.push({animalId:t.id,from:i,to:n.to});for(let a of cr(e,t.id).animals)a.id!==t.id&&(a.hibernating||a.zoneId===i&&a.traits.some(e=>e.type===`remora`&&yn(e))&&(a.zoneId=n.to,r.push({animalId:a.id,from:i,to:n.to})))}}if(!r.length){xi(e);return}e.turnUse.migrated=!0,e.migratedThisPhase=[...e.migratedThisPhase??[],...r.map(e=>e.animalId)],K(e,{kind:`migrated`,moves:r}),G(e,`${n.name} объявляет миграцию (${r.length} животное(-ых)).`),Hi(e),Ri(e)}function Hi(e){if(e.modules.continents)for(let t of e.players)for(let n of[...t.animals])for(let r of[...n.traits]){if(!r.pairWith)continue;let i=U(e,r.pairWith);i&&n.zoneId!==i.zoneId&&(n.traits=n.traits.filter(e=>e.cardId!==r.cardId),i.traits=i.traits.filter(e=>e.cardId!==r.cardId),t.discardCount+=1,G(e,`Парное свойство разъехавшихся животных уходит в сброс.`),pi(e,n),pi(e,i))}}function Ui(e,t,n){if(e.phase!==`development`&&e.phase!==`feeding`)return;let r=cr(e,t);if(r.id!==e.humanId)return;let i=r.animals.findIndex(e=>e.id===t);if(i<0)return;let[a]=r.animals.splice(i,1),o=r.animals.length;if(n&&n!==t){let e=r.animals.findIndex(e=>e.id===n);e>=0&&(o=e)}r.animals.splice(o,0,a)}function Wi(e,t,n){if(!e.modules.continents||e.phase!==`development`||cr(e,t).id!==e.humanId||n===`ocean`)return!1;let r=Tn(e,t);for(let t of r.traits){if(!t.pairWith)continue;let r=U(e,t.pairWith);if(r&&r.zoneId!==n)return!1}return r.zoneId=n,!0}function Gi(e){let t=Cn(e,e.currentPlayerId);t.passedFeed=!0,G(e,`${t.name} пасует.`),xi(e)}function Ki(e,t){let n=e.pendingAttack;if(!n)return;if(n.plantId){qi(e,t);return}let r=U(e,n.carnivoreId),i=U(e,n.preyId);if(!r||!i){e.pendingAttack=null;return}if(t.kind===`running`){n.usedDefenses.push(`running`);let t=_n(e);if(K(e,{kind:`defenseUsed`,defense:`running`,roll:t,preyId:n.preyId}),t>=4){G(e,`Быстрое: выпало ${t} — животное спаслось!`,`good`),e.pendingAttack=null,n.rage?xi(e):Ri(e);return}G(e,`Быстрое: выпало ${t} — хищник догнал.`,`bad`),Ir(i,n).length===0&&Ur(e);return}if(t.kind===`mimicry`&&t.mimicryTargetId){n.usedDefenses.push(`mimicry`),n.mimicryChain.push(i.id),n.preyId=t.mimicryTargetId,n.waitingFor=Tn(e,t.mimicryTargetId).ownerId,n.usedDefenses=[],K(e,{kind:`defenseUsed`,defense:`mimicry`,preyId:n.preyId}),G(e,`Мимикрия перенаправляет атаку.`),Ir(Tn(e,n.preyId),n).length===0&&Ur(e);return}if(t.kind===`tailLoss`){let t=i.traits.find(e=>yn(e)&&e.type===`tailLoss`);if(t){if(t.pairWith){let n=U(e,t.pairWith);n&&(n.traits=n.traits.filter(e=>e.cardId!==t.cardId))}i.traits=i.traits.filter(e=>e.cardId!==t.cardId),cr(e,i.id).discardCount+=1}!n.rage&&!W(r,`obligateCarnivore`)&&(kr(e,r,1,`blue`,{obligate:!0}),K(e,{kind:`blueFood`,animalId:r.id,reason:`tailLoss`})),K(e,{kind:`defenseUsed`,defense:`tailLoss`,preyId:n.preyId}),G(e,n.rage?`Отбрасывание хвоста: животное выжило — бешеное не получает фишку.`:`Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.`,`good`),e.pendingAttack=null,n.rage?xi(e):Ri(e);return}K(e,{kind:`defenseUsed`,defense:`none`,preyId:n.preyId}),Ur(e),Ri(e)}function qi(e,t){let n=e.pendingAttack,r=Dn(e,n.plantId),i=U(e,n.preyId);if(!i){e.pendingAttack=null;return}let a=!!n.plantCounter,o=()=>{if(a){let t=U(e,n.plantRequesterId??n.preyId);t&&Ci(e,t,r)}e.pendingAttack=null,Ri(e)};if(t.kind===`running`){n.usedDefenses.push(`running`);let t=_n(e);if(K(e,{kind:`defenseUsed`,defense:`running`,roll:t,preyId:n.preyId}),t>=4){G(e,`Быстрое: выпало ${t} — животное спаслось!`,`good`),o();return}G(e,`Быстрое: выпало ${t} — растение настигло.`,`bad`),Ir(i,n).length===0&&Ur(e);return}if(t.kind===`mimicry`&&t.mimicryTargetId){n.usedDefenses.push(`mimicry`),n.mimicryChain.push(i.id),n.preyId=t.mimicryTargetId,n.waitingFor=Tn(e,t.mimicryTargetId).ownerId,n.usedDefenses=[],K(e,{kind:`defenseUsed`,defense:`mimicry`,preyId:n.preyId}),G(e,`Мимикрия перенаправляет атаку растения.`),Ir(Tn(e,n.preyId),n).length===0&&Ur(e);return}if(t.kind===`tailLoss`){let t=i.traits.find(e=>yn(e)&&e.type===`tailLoss`);t&&(i.traits=i.traits.filter(e=>e.cardId!==t.cardId),cr(e,i.id).discardCount+=1),r.food=Math.min(un.carnivorous.maxFood,r.food+1),K(e,{kind:`defenseUsed`,defense:`tailLoss`,preyId:n.preyId}),G(e,`Отбрасывание хвоста: животное выжило, растение получило 1 фишку.`,`good`),o();return}K(e,{kind:`defenseUsed`,defense:`none`,preyId:n.preyId}),Ur(e)}function Ji(e){if(e.modules.continents&&e.territoryFood){let t=Object.entries(e.territoryFood).filter(([,e])=>(e??0)>0);if(t.length){let n=t.reduce((e,[,t])=>e+(t??0),0);K(e,{kind:`bankBurned`,amount:n}),G(e,`Остатки кормовых баз (${n}) сгорают.`);for(let[n]of t)e.territoryFood[n]=0;e.foodBank=0}}else e.foodBank>0&&(K(e,{kind:`bankBurned`,amount:e.foodBank}),G(e,`Остаток кормовой базы (${e.foodBank}) сгорает.`),e.foodBank=0);if(e.phase=`extinction`,e.extinctionDeaths=[],e.modules.randomMutations)for(let t of wn(e)){if(t.hibernating)continue;if(t.poisoned&&!xn(t,`antidote`)&&(t.population??1)>1){t.population=(t.population??1)-1,t.poisoned=!1,t.food=Math.min(t.food,An(t)),K(e,{kind:`populationLost`,animalId:t.id,to:t.population}),G(e,`Вид ${cr(e,t.id).name} теряет животное от яда (осталось ${t.population}).`,`bad`);continue}let n=An(t)-t.food;n<=0||n>=(t.population??1)||(t.population=(t.population??1)-n,t.food=Math.min(t.food,An(t)),K(e,{kind:`populationLost`,animalId:t.id,to:t.population}),G(e,`Вид ${cr(e,t.id).name} теряет ${n} животное(-ых) от голода (осталось ${t.population}).`,`bad`))}let t=wn(e).filter(e=>e.poisoned&&!xn(e,`antidote`)||xn(e,`poison`)&&!xn(e,`antidote`)||!Ln(e));for(let n of wn(e))t.some(e=>e.id===n.id)&&e.extinctionDeaths.push(n.id);for(let t of e.extinctionDeaths){let n=U(e,t);if(!n)continue;let r=cr(e,t);G(e,n.poisoned?`Хищник ${r.name} погибает от яда.`:xn(n,`poison`)&&!xn(n,`antidote`)?`Животное ${r.name} погибает от метки «Яд».`:`Животное ${r.name} вымирает — не накормлено.`,`bad`)}}function Yi(e){if(e.modules.continents)for(let t of e.players)for(let n of[...t.animals]){let r=n.traits.find(e=>e.type===`neoplasia`);if(!r)continue;n.neoplasia=r;let i=n.zoneId===`ocean`,a=[...n.traits.filter(e=>e.id!==r.id&&!e.pairWith&&!e.disabled&&!(i&&e.type===`swimming`))].sort((e,t)=>t.playSeq-e.playSeq||n.traits.indexOf(t)-n.traits.indexOf(e))[0];if(!a){K(e,{kind:`animalDied`,animalId:n.id,cause:`neoplasia`}),G(e,`Неоплазия поглощает животное ${t.name} целиком.`,`bad`),fr(e,n);continue}a.disabled=!0,G(e,`Неоплазия выключает свойство «${H[a.type].name}».`,`bad`)}}function Xi(e){if(e.phase===`extinction`){for(let t of e.extinctionDeaths){let n=U(e,t);n&&(K(e,{kind:`animalDied`,animalId:t,cause:n.poisoned?`poison`:`starved`}),fr(e,n))}e.extinctionDeaths=[],na.clear(),ta(e);for(let t of wn(e))t.food=0,t.blueFood=0,t.hibernatedLastYear=t.hibernating,t.hibernating=!1,t.receivedFoodThisYear=!1,t.poisoned=!1,t.sheltered=!1,t.sedated=!1,xr(e,t);if(e.modules.fungi&&Qi(e),e.modules.plants){if(Zi(e),e.lastYear||e.deck.length===0&&e.deckEmptyAfterDraw){aa(e);return}$i(e),e.phase=`growth`;return}if(e.lastYear||e.deck.length===0&&e.deckEmptyAfterDraw){aa(e);return}ra(e)}}function Zi(e){let t=e.plants??[];if(!t.length)return;let n=new Map(t.map(e=>[e.id,e])),r=new Set;for(let e of t)e.doomed&&r.add(e.id);let i=new Map(t.map(e=>[e.id,e.id])),a=e=>{let t=e;for(;i.get(t)!==t;)t=i.get(t);return t},o=(e,t)=>{let n=a(e),r=a(t);n!==r&&i.set(n,r)};for(let e of t)for(let t of e.traits)t.type===`micorrhiza`&&t.pairWith&&n.has(t.pairWith)&&o(e.id,t.pairWith);let s=new Set;for(let e of t)e.food>0&&s.add(a(e.id));for(let e of t)if(!(r.has(e.id)||e.food>0)&&e.kind!==`annual`&&e.kind!==`parasite`){if(Jn(e,`micorrhiza`)&&s.has(a(e.id))){e.starvedRevive=!0;continue}r.add(e.id)}let c=!0;for(;c;){c=!1;for(let e of t){if(r.has(e.id)||e.kind!==`parasite`||!e.hostId)continue;let t=n.get(e.hostId);t&&r.has(t.id)&&(r.add(e.id),c=!0)}}for(let t of r){let r=n.get(t);K(e,{kind:`plantDied`,plantId:t,cause:r.doomed?`poison`:r.kind===`parasite`?`host`:`eaten`}),G(e,`Растение ${un[r.kind].name} погибает${r.doomed?` — съело ядовитое животное`:r.kind===`parasite`?` — вместе с хозяином`:` — съедено дочиста`}.`,`bad`)}r.size&&(e.plants=t.filter(e=>!r.has(e.id)),e.plantDiscard=(e.plantDiscard??0)+r.size)}function Qi(e){let t=e.flora??[],n=new Set;for(let e of t)e.food<=0&&n.add(e.id);for(let r of n){let n=t.find(e=>e.id===r);K(e,{kind:`floraDied`,floraId:r}),G(e,`Карта ${on[n.kind].name} без фишек уходит в сброс.`,`bad`)}n.size&&(e.flora=t.filter(e=>!n.has(e.id)),e.floraDiscard=(e.floraDiscard??0)+n.size);for(let t of e.flora??[])if(!on[t.kind].isFungus&&t.food<4){let n=t.food;t.food+=1,K(e,{kind:`floraGrew`,floraId:t.id,from:n,to:t.food})}if(e.modules.continents)for(let t of wn(e)){if(t.hibernating||!t.traits.some(e=>e.type===`edificator`&&yn(e)))continue;let n=t.zoneId??`laurasia`;if(n!==`ocean`){for(let t of e.flora??[])(t.zoneId??`gondwana`)===n&&t.food<4&&(t.food+=1);G(e,`Эдификатор удобряет флору ${n===`laurasia`?`Лавразии`:`Гондваны`}.`,`good`)}}G(e,`Флора: травы подрастают, пустые карты уходят в сброс.`,`good`)}function $i(e){let t=e.plants??[];for(let n of t){let r=un[n.kind],i=n.food;if(n.kind===`liana`){let e=t.filter(e=>e.kind!==`liana`).length;n.food=Math.min(r.maxFood,e)}else n.kind===`fungus`||n.kind===`carnivorous`||n.kind===`parasite`||(n.food=dn(r,n.food));n.food!==i&&K(e,{kind:`plantGrew`,plantId:n.id,from:i,to:n.food})}for(let n of t)n.starvedRevive&&n.food===0?(n.food=1,n.starvedRevive=!1,K(e,{kind:`plantGrew`,plantId:n.id,from:0,to:1})):n.starvedRevive=!1;for(let e of t)e.shelters=hn(e),e.attackedThisYear=!1,e.doomed=!1;if(e.modules.continents)for(let n of wn(e)){if(n.hibernating||!n.traits.some(e=>e.type===`edificator`&&yn(e)))continue;let r=n.zoneId??`laurasia`;if(r!==`ocean`){for(let e of t)(e.zoneId??`gondwana`)===r&&e.food<un[e.kind].maxFood&&(e.food+=1);G(e,`Эдификатор удобряет растения ${r===`laurasia`?`Лавразии`:`Гондваны`}.`,`good`)}}hr(e,pn(e.players.length).add),G(e,`Фаза роста: растения разрастаются.`,`good`)}function ea(e){if(e.phase===`growth`){if(e.lastYear||e.deck.length===0&&e.deckEmptyAfterDraw){aa(e);return}ra(e)}}function ta(e){let t=e.pendingRegeneration;if(t?.length){e.pendingRegeneration=null;for(let n of t){let t=Cn(e,n.ownerId),r=t.hand.length?t.hand.pop():t.blindDeck?.length?t.blindDeck.pop():e.deck.pop();if(!r)continue;let i={id:rr(e,`a`),ownerId:t.id,cardId:r.id,traits:[],food:0,blueFood:0,fatTokens:0,hibernating:!1,hibernatedLastYear:!1,receivedFoodThisYear:!1,poisoned:!1,seed:r.id.length*17+t.id*13,...e.modules.continents?{zoneId:`laurasia`}:{}};t.animals.push(i),na.set(t.id,(na.get(t.id)??0)+1),K(e,{kind:`regenerated`,ownerId:t.id}),G(e,`${t.name} восстанавливает регенерировавшее животное.`,`good`)}}}var na=new Map;function ra(e){let t=e.firstPlayerId,n=e.players.length,r=e.deck.length===0,i=Array(n).fill(0);for(let a=0;a<n;a++){let o=(t+a)%n,s=e.players[o];if(e.modules.randomMutations){let t=s.animals.reduce((e,t)=>e+(t.population??1),0),n=Math.max(1,t-(na.get(s.id)??0)+2);if(s.animals.length===0&&(s.blindDeck??[]).length===0){if(e.modules.continents){for(let t=0;t<10;t++){let t=e.deck.pop();if(!t){r=!0;break}s.blindDeck.push(t),i[o]+=1}ia(e,s,`laurasia`),ia(e,s,`gondwana`);continue}n=6}for(let t=0;t<n;t++){let t=e.deck.pop();if(!t){r=!0;break}s.blindDeck.unshift(t),i[o]+=1}continue}let c=Math.max(1,s.animals.length-(na.get(s.id)??0)+1);if(s.animals.length===0&&s.hand.length===0){if(e.modules.continents){for(let t=0;t<10;t++){let t=e.deck.pop();if(!t){r=!0;break}s.hand.push(t),i[o]+=1}ia(e,s,`laurasia`),ia(e,s,`gondwana`);continue}c=6}for(let t=0;t<c;t++){let t=e.deck.pop();if(!t){r=!0;break}s.hand.push(t),i[o]+=1}}K(e,{kind:`cardsDrawn`,counts:i}),(r||e.deck.length===0)&&(e.deckEmptyAfterDraw=!0,e.lastYear=!0);for(let t of e.players)t.passedDev=!1;e.firstPlayerId=Qn(e,e.firstPlayerId),e.currentPlayerId=e.firstPlayerId,e.year+=1,e.phase=`development`,e.devStartPlaySeq=e.playSeq,G(e,e.lastYear?`Год ${e.year} — последний. Первым ходит ${Cn(e,e.firstPlayerId).name}.`:`Год ${e.year}. Первым ходит ${Cn(e,e.firstPlayerId).name}. Колода: ${e.deck.length}.`,e.lastYear?`bad`:`good`),ni(e,e.firstPlayerId)}function ia(e,t,n){let r=e.modules.randomMutations?t.blindDeck?.pop():t.hand.shift();if(!r)return;let i={id:rr(e,`a`),ownerId:t.id,cardId:r.id,traits:[],food:0,blueFood:0,fatTokens:0,hibernating:!1,hibernatedLastYear:!1,receivedFoodThisYear:!1,poisoned:!1,seed:r.id.length*17+t.id*13+t.animals.length,population:1,zoneId:n};t.animals.push(i),K(e,{kind:`animalPlaced`,animalId:i.id,ownerId:t.id,zoneId:n})}function aa(e){let t=e.players.map(e=>{let t=0,n=0,r=0;for(let i of e.animals){t+=2*(i.population??1);for(let e of i.traits)e.disabled||(n+=1,r+=H[e.type].scoreBonus)}return{playerId:e.id,name:e.name,animals:t,traits:n,extras:r,total:t+n+r,discard:e.discardCount}});t.sort((e,t)=>t.total-e.total||t.discard-e.discard);let n=t[0],r=t.filter(e=>e.total===n.total&&e.discard===n.discard);if(e.scores=t,e.winnerIds=r.map(e=>e.playerId),e.modules.fungi&&e.flora){let t=e.flora.length,r=e.flora.reduce((e,t)=>e+t.food,0),i=t*2+r;if(e.scores.push({playerId:-1,name:`Трава и грибы`,animals:t*2,traits:0,extras:r,total:i,discard:e.floraDiscard??0}),i>=n.total){e.winnerIds=[-1],G(e,`Победа: Трава и грибы (${i} очков).`,`good`),e.phase=`gameOver`;return}}e.phase=`gameOver`,G(e,r.length>1?`Ничья: ${r.map(e=>e.name).join(`, `)}.`:`Победа: ${r[0].name} (${r[0].total} очков).`,`good`)}function oa(e){return e.phase===`gameOver`?null:e.pendingAttack?Cn(e,e.pendingAttack.waitingFor):e.phase===`foodBank`||e.phase===`extinction`||e.phase===`growth`?null:Cn(e,e.currentPlayerId)}var sa={carnivore:`/img/trait/carnivore.jpg`,swimming:`/img/trait/swimming.jpg`,camouflage:`/img/trait/camouflage.jpg`,sharpVision:`/img/trait/sharpVision.jpg`,burrowing:`/img/trait/burrowing.jpg`,scavenger:`/img/trait/scavenger.jpg`,symbiosis:`/img/trait/symbiosis.jpg`,piracy:`/img/trait/piracy.jpg`,tailLoss:`/img/trait/tailLoss.jpg`,grazing:`/img/trait/grazing.jpg`,cooperation:`/img/trait/cooperation.jpg`,running:`/img/trait/running.jpg`,highBodyWeight:`/img/trait/highBodyWeight.jpg`,parasite:`/img/trait/parasite.jpg`,fatTissue:`/img/trait/fatTissue.jpg`,communication:`/img/trait/communication.jpg`,poisonous:`/img/trait/poisonous.jpg`,hibernation:`/img/trait/hibernation.jpg`,mimicry:`/img/trait/mimicry.jpg`,migration:`/img/trait/migration.jpg`,remora:`/img/trait/remora.jpg`,herding:`/img/trait/herding.jpg`,nematocysts:`/img/trait/nematocysts.jpg`,regeneration:`/img/trait/regeneration.jpg`,recombination:`/img/trait/recombination.jpg`,edificator:`/img/trait/edificator.jpg`,neoplasia:`/img/trait/neoplasia.jpg`,plantWater:`/img/trait/plantWater.jpg`,thorny:`/img/trait/thorny.jpg`,rootVegetable:`/img/trait/rootVegetable.jpg`,medicinal:`/img/trait/medicinal.jpg`,plantParasite:`/img/trait/plantParasite.jpg`,micorrhiza:`/img/trait/micorrhiza.jpg`,tree:`/img/trait/tree.jpg`,nutritious:`/img/trait/nutritious.jpg`,honeyPlant:`/img/trait/honeyPlant.jpg`},ca=new Set;function la(e){return e.swimming?`/img/species/aquatic.jpg`:e.carnivore?e.bulky?`/img/species/carn-large.jpg`:`/img/species/carn-medium.jpg`:e.bulky?`/img/species/herb-large.jpg`:`/img/species/herb-medium.jpg`}var ua=`/img/species/extinct.jpg`,da={menu:`/img/bg/menu.jpg`,valley:`/img/bg/valley.jpg`,extinction:`/img/bg/extinction.jpg`,victory:`/img/bg/victory.jpg`,bankBowl:`/img/bg/bank-bowl.jpg`,cardBack:`/img/meta/card-back.jpg`,paper:`/img/bg/texture-paper.jpg`,felt:`/img/bg/texture-felt.jpg`,water:`/img/bg/texture-water.jpg`,ocean:`/img/bg/ocean.jpg`},fa=`/img/meta/logo-emblem.png`,pa={development:`/img/phase/development.png`,foodBank:`/img/phase/roll-food.png`,feeding:`/img/phase/feeding.png`,extinction:`/img/phase/extinction.png`},ma={laurasia:`/img/world/laurasia.jpg`,gondwana:`/img/world/gondwana.jpg`,ocean:`/img/world/ocean.jpg`},ha={liana:`/img/plant/liana.jpg`,fungus:`/img/plant/fungus.jpg`,carnivorous:`/img/plant/carnivorous.jpg`,annual:`/img/plant/annual.jpg`,legume:`/img/plant/legume.jpg`,perennial:`/img/plant/perennial.jpg`,grass:`/img/plant/grass.jpg`,succulent:`/img/plant/succulent.jpg`,fruit:`/img/plant/fruit.jpg`,parasite:`/img/plant/parasite.jpg`},ga={},_a=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},va=(e=>e?_a(e):_a),ya=e=>e;function ba(e,t=ya){let n=D.useSyncExternalStore(e.subscribe,D.useCallback(()=>t(e.getState()),[e,t]),D.useCallback(()=>t(e.getInitialState()),[e,t]));return D.useDebugValue(n),n}var xa=e=>{let t=va(e),n=e=>ba(t,e);return Object.assign(n,t),n},Sa=(e=>e?xa(e):xa);function Ca(e){let t=gn(e);return e.difficulty===`easy`?(t-.5)*8:e.difficulty===`normal`?(t-.5)*2:0}function wa(e){if(e.pendingAttack){let t=Rr(e,e.pendingAttack.waitingFor);return t.length?Ta(e,t):{type:`chooseDefense`,kind:`none`}}return e.phase===`development`?Ea(e,Cr(e,e.currentPlayerId)):e.phase===`feeding`?ka(e,Nr(e,e.currentPlayerId)):null}function Ta(e,t){let n=t.find(e=>e.type===`chooseDefense`&&e.kind===`running`);if(n)return n;let r=t.filter(e=>e.type===`chooseDefense`&&e.kind===`mimicry`).sort((t,n)=>Kn(U(e,t.mimicryTargetId))-Kn(U(e,n.mimicryTargetId)));if(r[0])return r[0];let i=t.filter(e=>e.type===`chooseDefense`&&e.kind===`tailLoss`),a=U(e,e.pendingAttack.preyId);return a&&i.length?i.slice().sort((e,t)=>{let n=a.traits.find(t=>t.id===e.discardTraitId),r=a.traits.find(e=>e.id===t.discardTraitId);return(n?n.disabled?-99:H[n.type].aiValue??1:0)-(r?r.disabled?-99:H[r.type].aiValue??1:0)})[0]:t.find(e=>e.type===`chooseDefense`&&e.kind===`none`)??t[0]}function Ea(e,t){let n=Cn(e,e.currentPlayerId),r=e.modules.randomMutations?n.blindDeck?.length??0:n.hand.length,i=t[0],a=-1/0;for(let o of t){let t=0;if(o.type===`devPass`&&(t=r<=(e.lastYear||n.animals.length===0?0:1)?4:r<=2&&!e.lastYear?1.5:-1,n.animals.length===0&&r&&(t=-20)),o.type===`devPlayAnimal`&&(t=6-n.animals.length*1.4,n.animals.length===0&&(t=14),e.lastYear&&(t=8),o.zoneId)){let e=n.animals.filter(e=>e.zoneId===o.zoneId).length;t-=e*.6,n.hand.find(e=>e.id===o.cardId)?.faces.includes(`swimming`)&&(t+=.5)}if(o.type===`devMutate`){if(o.intent===`newAnimal`&&(t=6-n.animals.length*1.4,n.animals.length===0&&(t=14),e.lastYear&&(t=8),o.zoneId)){let e=n.animals.filter(e=>e.zoneId===o.zoneId).length;t-=e*.6}if(o.intent===`trait`){let n=o.animalId?U(e,o.animalId):void 0;t=4,n&&(t+=(3-Math.min(3,n.traits.length))*.8,n.traits.some(e=>e.disabled)&&--t),e.lastYear&&(t+=1.5)}if(o.intent===`population`){let n=o.animalId?U(e,o.animalId):void 0;if(t=3,n){let e=n.traits.reduce((e,t)=>e+(H[t.type]?.aiValue??0),0);t+=Math.max(0,Math.min(6,e))*.5,n.traits.some(e=>e.type===`budding`)&&(t+=2)}e.lastYear&&(t+=3)}o.intent===`plant`&&(t=2.2,e.lastYear&&(t-=2))}if(o.type===`devPlayTrait`){let r=n.hand.find(e=>e.id===o.cardId),i=r?.faces[o.face]??r?.faces[0],a=U(e,o.animalId);if(i&&a){if(t=(H[i].aiValue??2)+ +(a.ownerId===n.id),i===`parasite`&&(t=7+An(a)-(a.ownerId===n.id?20:0),e.difficulty===`easy`&&(t-=3)),i===`carnivore`&&a.ownerId===n.id&&(t+=3),i===`fatTissue`&&a.ownerId===n.id&&(t+=2),i===`carnivore`&&a.ownerId===n.id&&o.face!==void 0){let r=a.zoneId??`laurasia`,i=e.players.flatMap(e=>e.animals).filter(e=>e.ownerId!==n.id&&e.zoneId===r).length;t+=Math.min(i,3)*.7}e.lastYear&&(t+=H[i].scoreBonus*2+1)}}if(o.type===`devPlayPair`&&(t=5,e.lastYear&&(t+=2)),o.type===`devPlayPlantTrait`){let r=n.hand.find(e=>e.id===o.cardId),i=r?.faces[o.face]??r?.faces[0];if(t=2.5,i===`plantParasite`){let n=e.plants?.find(e=>e.id===o.plantId);t=n?1.5+Math.min(n.food,3)*.4:1.5}(i===`thorny`||i===`nutritious`)&&(t+=1),e.lastYear&&(t-=2)}o.type===`devPlayPlantPair`&&(t=2.8,e.lastYear&&(t-=2)),t+=Ca(e),t>a&&(a=t,i=o)}return i}function Da(e){return Math.max(0,An(e)-e.food)}function Oa(e){return e.modules.continents?Object.values(e.territoryFood??{}).every(e=>(e??0)<=0):e.foodBank<=0}function ka(e,t){let n=Cn(e,e.currentPlayerId),r=t[0],i=-1/0,a=n.animals.filter(e=>!Ln(e)).length,o=e.players.filter(e=>e.id!==n.id).reduce((e,t)=>e+t.animals.filter(e=>!Ln(e)).length,0);for(let s of t){let t=0;if(s.type===`feedTake`){let n=U(e,s.animalId);t=10+(3-Da(n))+(W(n,`burrowing`)?1.5:0),bn(n)&&Da(n)<=2&&(t-=.5)}if(s.type===`feedTakePlant`){let n=U(e,s.animalId),r=e.plants?.find(e=>e.id===s.plantId);t=10+(3-Da(n))+(W(n,`burrowing`)?1.5:0),r&&(t+=Math.min(r.food,4)*.2,r.traits.some(e=>e.type===`nutritious`&&!e.disabled)&&(t+=1.5),r.traits.some(e=>e.type===`medicinal`&&!e.disabled)&&n.traits.length>2&&(t-=4),r.kind===`carnivorous`&&(t-=2.5)),bn(n)&&Da(n)<=2&&(t-=.5)}if(s.type===`feedTakeFlora`){let r=U(e,s.animalId),i=e.flora?.find(e=>e.id===s.floraId);if(t=10+(3-Da(r))+(W(r,`burrowing`)?1.5:0),i){let e=on[i.kind];t+=Math.min(i.food,4)*.2+e.aiHint,e.mark===`poison`&&xn(r,`antidote`)&&(t+=3),i.kind===`cleanser`&&r.food>1&&(t-=5),i.kind===`insight`&&(t-=Math.min(n.hand.length,6)*.5),i.kind===`passionflower`&&r.traits.length>1&&(t-=1.5)}bn(r)&&Da(r)<=2&&(t-=.5)}if(s.type===`feedShelter`){let r=U(e,s.animalId);t=e.players.some(e=>e.id!==n.id&&e.animals.some(e=>bn(e)&&!Ln(e)))?7+Math.min(Kn(r),8)*.3:1.5,Ln(r)&&(t-=2)}if(s.type===`feedPlantAttack`){let r=U(e,s.preyId);t=Kn(r)+3+(r.ownerId===n.id?-12:0),e.difficulty===`easy`&&(t-=4)}if(s.type===`feedParasitize`&&(t=1),s.type===`feedHunt`){let r=U(e,s.preyId),i=U(e,s.carnivoreId);t=Kn(r)+(r.ownerId===n.id?-6:4),t+=Da(i)*1.2,W(r,`poisonous`)&&(t-=5),e.difficulty===`easy`&&(t-=4),e.difficulty===`hard`&&r.ownerId===0&&(t+=2)}if(s.type===`feedPirate`&&(t=6+Da(U(e,s.pirateId))),s.type===`feedHibernate`&&(t=5,e.foodBank>3&&a<=1&&(t-=2)),s.type===`feedConvertFat`&&(t=7),s.type===`feedGraze`&&(t=o>a?2.5:-1,e.foodBank<=1&&--t),s.type===`feedMigrate`){let n=U(e,s.moves[0].animalId);t=3,n&&(t-=Da(n)),a>0&&!Oa(e)&&(t-=6)}if(s.type===`feedEndTurn`){let n=e.turnUse;t=n.foodTaken||n.combatUsed||n.grazers.length>0?2:-5}s.type===`feedSkip`&&(t=a===0?4:-3),t+=Ca(e),t>i&&(i=t,r=s)}return r}function Aa(e){return e!==`__proto__`&&e!==`constructor`&&e!==`prototype`}function ja(e,t){let n=Object.create(null);if(e)for(let t of Object.keys(e))Aa(t)&&(n[t]=e[t]);if(t&&typeof t==`object`)for(let e of Object.keys(t))Aa(e)&&(n[e]=t[e]);return n}function Ma(e){if(!e)return Object.create(null);let t=Object.create(null);for(let n of Object.keys(e))Aa(n)&&(t[n]=e[n]);return t}var Na=()=>{throw Error(`createServerOnlyFn() functions can only be called on the server!`)},Pa=(t,n)=>{let r=n||t||{};r.method===void 0&&(r.method=`GET`);let i=e=>Pa(void 0,{...r,validator:e,inputValidator:e});return Object.assign(e=>Pa(void 0,{...r,...e}),{options:r,middleware:e=>{let t=[...r.middleware||[]];e.map(e=>{s in e?e.options.middleware&&t.push(...e.options.middleware):t.push(e)});let n=Pa(void 0,{...r,middleware:t});return n[s]=!0,n},validator:i,inputValidator:i,handler:(...t)=>{let[n,i]=t,a={...r,extractedFn:n,serverFn:i},o=[...a.middleware||[],Ra(a)];return n.method=r.method,Object.assign(async t=>{let r=await Fa(o,`client`,{...n,...a,data:t?.data,headers:t?.headers,signal:t?.signal,fetch:t?.fetch,context:Ma()}),i=e(r.error);if(i)throw i;if(r.error)throw r.error;return r.result},{...n,method:r.method,__executeServer:async e=>{let t=Na(),r=t.contextAfterGlobalMiddlewares;return await Fa(o,`server`,{...n,...e,serverFnMeta:n.serverFnMeta,context:ja(e.context,r),request:t.request}).then(e=>({result:e.result,error:e.error,context:e.sendContext}))}})}})};async function Fa(e,t,r){let i=Ia([...a()?.functionMiddleware||[],...e]);if(t===`server`){let e=Na({throwIfNotFound:!1});e?.executedRequestMiddlewares&&(i=i.filter(t=>!e.executedRequestMiddlewares.has(t)))}let o=async e=>{let r=i.shift();if(!r)return e;try{let i=`validator`in r.options?r.options.validator:void 0;!i&&`inputValidator`in r.options&&(i=r.options.inputValidator),i&&t===`server`&&(e.data=await La(i,e.data));let a;if(t===`client`?`client`in r.options&&(a=r.options.client):`server`in r.options&&(a=r.options.server),a){let t=async(t={})=>{let n=await o({...e,...t,context:ja(e.context,t.context),sendContext:ja(e.sendContext,t.sendContext),headers:f(e.headers,t.headers),_callSiteFetch:e._callSiteFetch,fetch:e._callSiteFetch??t.fetch??e.fetch,result:t.result===void 0?t instanceof Response?t:e.result:t.result,error:t.error??e.error});if(n.error)throw n.error;return n},r=await a({...e,next:t});if(n(r))return{...e,error:r};if(r instanceof Response)return{...e,result:r};if(!r)throw Error(`User middleware returned undefined. You must call next() or return a result in your middlewares.`);return r}return o(e)}catch(t){return{...e,error:t}}};return o({...r,headers:r.headers||{},sendContext:r.sendContext||{},context:r.context||Ma(),_callSiteFetch:r.fetch})}function Ia(e,t=100){let n=new Set,r=[],i=(e,a)=>{if(a>t)throw Error(`Middleware nesting depth exceeded maximum of ${t}. Check for circular references.`);e.forEach(e=>{e.options.middleware&&i(e.options.middleware,a+1),n.has(e)||(n.add(e),r.push(e))})};return i(e,0),r}async function La(e,t){if(e==null)return{};if(`~standard`in e){let n=await e[`~standard`].validate(t);if(n.issues)throw Error(JSON.stringify(n.issues,void 0,2));return n.value}if(`parse`in e)return e.parse(t);if(typeof e==`function`)return e(t);throw Error(`Invalid validator type!`)}function Ra(e){return{"~types":void 0,options:{inputValidator:e.validator??e.inputValidator,client:async({next:t,sendContext:n,fetch:r,...i})=>{let a={...i,context:n,fetch:r};return t(await e.extractedFn?.(a))},server:async({next:t,...n})=>{let r=await e.serverFn?.(n);return t({...n,result:r})}}}}var za=Pa({method:`POST`}).handler(o(`5d10ae946134fb6b27bc7c68ea783639ad617431c539331dc58524d97407b4bb`)),Ba=Pa({method:`POST`}).handler(o(`20bb5f392b3e05a16098d48523e3b73255d44092301929c9ed9a4bed4959d3d0`)),Va=Pa({method:`POST`}).handler(o(`9be6f8dbb902e4d7a86ed61a5ec451298b7693cb95cd353b30302c3968525e24`)),Ha=Pa({method:`POST`}).handler(o(`0ae6763f4a9392d1dc978022ba9a80b0b3aa8d50b84dfd2903b7639f24bfb552`)),Ua=Pa({method:`POST`}).handler(o(`fafa464b4c4488361c51f863768135107e02c148e255f23da160ffa440fc3f99`)),Wa=Pa({method:`POST`}).handler(o(`18b6efd10626f6282f46662236a9f4efa95081d933b3c79a203a2bf43f221fa0`)),Ga=Pa({method:`POST`}).handler(o(`97c6cf3f2776e31a2770acfbc62d86143077f49705e3043649873d49707919d1`)),Ka=Pa({method:`POST`}).handler(o(`c863eef5e87854022b362f26f321d98a7752563244b6bf8043f48c6e5e79acfc`)),qa=`evo-net-name`,Ja=e=>`evo-seat-${e}`;function Ya(){try{return localStorage.getItem(qa)??``}catch{return``}}function Xa(e){try{let t=e.trim();t&&localStorage.setItem(qa,t)}catch{}}function Za(e){try{return localStorage.getItem(Ja(e))}catch{return null}}function Qa(e,t){try{localStorage.setItem(Ja(e),t)}catch{}}var $a=class{hooks;code=``;token=``;lastVersion;timer=null;failCount=0;stopped=!1;lastOwnMoveAt=0;seenPlaying=!1;wasReconnecting=!1;constructor(e){this.hooks=e}async create(e){Xa(e.name);let t=await za({data:e});if(!t.ok)throw Error(t.error);this.attach(t.code,t.token),this.hooks.onStatus(`connecting`),this.schedule(0)}async join(e,t){Xa(t);let n=await Ba({data:{code:e.toUpperCase(),name:t}});if(!n.ok)throw Error(n.error);this.attach(e.toUpperCase(),n.token),this.hooks.onStatus(`connecting`),this.schedule(0)}async resume(e){let t=e.toUpperCase(),n=Za(t);if(!n)throw Error(`На этом устройстве нет места за этим столом`);let r=await Va({data:{code:t,token:n}});if(!r.ok){try{localStorage.removeItem(Ja(t))}catch{}throw Error(r.error)}this.attach(t,n),this.accept(r.snapshot),this.schedule(0)}async act(e){let t=await Wa({data:{code:this.code,token:this.token,action:e}});return t.ok?(this.lastOwnMoveAt=Date.now(),this.accept(t.snapshot),this.schedule(0),null):t.error}async setBots(e){let t=await Ha({data:{code:this.code,token:this.token,count:e}});if(!t.ok)throw Error(t.error)}async start(){let e=await Ua({data:{code:this.code,token:this.token}});if(!e.ok)throw Error(e.error);this.accept(e.snapshot)}async again(){let e=await Ka({data:{code:this.code,token:this.token}});if(!e.ok)throw Error(e.error)}stop(){this.stopped=!0,this.timer&&clearTimeout(this.timer)}refresh(){this.schedule(0)}attach(e,t){this.code=e,this.token=t,Qa(e,t),this.stopped=!1,this.failCount=0}accept(e){this.lastVersion=e.version,this.failCount=0,this.seenPlaying=e.room.status===`playing`;let t=this.seenPlaying?`playing`:`lobby`;this.wasReconnecting=!1,this.hooks.onSnapshot(e),this.hooks.onStatus(t)}schedule(e){this.stopped||(this.timer&&clearTimeout(this.timer),this.timer=setTimeout(()=>void this.tick(),e??this.nextDelay()))}nextDelay(){return this.failCount>0?Math.min(5e3,400*2**this.failCount):typeof document<`u`&&document.visibilityState===`hidden`?3e3:Date.now()-this.lastOwnMoveAt<3e3?350:700}async tick(){if(!this.stopped)try{let e=await Ga({data:{code:this.code,token:this.token,sinceVersion:this.lastVersion}});if(!e.ok)throw Error(e.error);`unchanged`in e?(this.failCount=0,this.hooks.onSeats(e.seats,e.hostSeat)):this.accept(e),this.wasReconnecting&&(this.wasReconnecting=!1,this.hooks.onStatus(this.seenPlaying?`playing`:`lobby`)),this.schedule()}catch{this.failCount+=1,this.failCount>=3&&(this.wasReconnecting=!0,this.hooks.onStatus(`reconnecting`)),this.schedule()}}},eo=null,to=null;function no(){eo&&=(clearTimeout(eo),null)}var ro={slow:1.7,normal:1,fast:.55},io=2e3,ao=2200,oo=1300,so=950,co=1050,lo=700,uo=null;function fo(e,t){return{onSnapshot:n=>{let r=t().net;r&&e({state:n.state,net:{...r,code:n.room.code,seat:n.seat,capacity:n.room.capacity,seats:n.seats,hostSeat:n.room.hostSeat}})},onSeats:(n,r)=>{let i=t().net;i&&e({net:{...i,seats:n,hostSeat:r}})},onStatus:n=>{let r=t().net;r&&e({net:{...r,status:n,error:n===`reconnecting`?r.error:null}})}}}function po(){try{let e=localStorage.getItem(`evo-speed`);if(e===`slow`||e===`normal`||e===`fast`)return e}catch{}return`normal`}var q=Sa((e,t)=>({state:null,thinking:!1,thinkingWho:null,intent:{kind:`none`},rulesOpen:!1,logOpen:!1,speed:`normal`,modules:{},mode:`solo`,net:null,start:(n,r)=>{no();let i=ir(n,r,Date.now()%1e6,void 0,t().modules);uo=null,e({state:i,thinking:!1,thinkingWho:null,intent:{kind:`none`}}),queueMicrotask(()=>t().tickAI())},setModules:t=>e({modules:t}),reset:()=>{no(),t().mode===`net`&&(to?.stop(),to=null),e({state:null,mode:`solo`,net:null,thinking:!1,thinkingWho:null,intent:{kind:`none`}})},dispatch:n=>{if(t().mode===`net`){let r=to;if(!r)return;e({intent:{kind:`none`}}),r.act(n).then(n=>{let r=t().net;n&&r&&e({net:{...r,error:n}})});return}let{state:r}=t();if(!r||r.phase===`gameOver`)return;let i=Wr(r,n);uo=null,e({state:i,intent:{kind:`none`},thinking:!1}),queueMicrotask(()=>t().tickAI())},setIntent:t=>e({intent:t}),setRulesOpen:t=>e({rulesOpen:t}),setLogOpen:t=>e({logOpen:t}),setSpeed:t=>{try{localStorage.setItem(`evo-speed`,t)}catch{}e({speed:t})},startNetCreate:async n=>{no();let r=new $a(fo(e,t));to=r,e({mode:`net`,state:null,intent:{kind:`none`},thinking:!1,thinkingWho:null,net:{code:``,seat:0,status:`connecting`,error:null,seats:[],hostSeat:0,capacity:n.capacity}});try{await r.create(n)}catch(t){throw r.stop(),to=null,e({mode:`solo`,net:null}),t}},startNetJoin:async(n,r)=>{no();let i=new $a(fo(e,t));to=i,e({mode:`net`,state:null,intent:{kind:`none`},thinking:!1,thinkingWho:null,net:{code:n.toUpperCase(),seat:-1,status:`connecting`,error:null,seats:[],hostSeat:0,capacity:0}});try{await i.join(n,r)}catch(t){throw i.stop(),to=null,e({mode:`solo`,net:null}),t}},resumeNetFromUrl:async n=>{no();let r=new $a(fo(e,t));try{await r.resume(n)}catch{return r.stop(),!1}return to=r,e({mode:`net`,state:null,intent:{kind:`none`},net:{code:n.toUpperCase(),seat:-1,status:`connecting`,error:null,seats:[],hostSeat:0,capacity:0}}),!0},netAddBots:async e=>{let n=t().net;if(!n||!to||n.status!==`lobby`)return;let r=n.seats.filter(e=>e.isAI).length,i=n.seats.length-r,a=Math.max(0,Math.min(r+e,n.capacity-i));await to.setBots(a).catch(()=>{}),to.refresh()},netStart:async()=>{to&&await to.start().catch(n=>{let r=t().net;r&&e({net:{...r,error:String(n.message??n)}})})},netAgain:async()=>{to&&(await to.again().catch(()=>{}),to.refresh())},leaveNet:()=>{to?.stop(),to=null,no(),e({mode:`solo`,net:null,state:null,thinking:!1,thinkingWho:null,intent:{kind:`none`}})},tickAI:()=>{if(t().mode===`net`){no();return}no();let{state:n,speed:r}=t();if(!n)return;let i=ro[r];if(n.phase===`gameOver`){e({thinking:!1,thinkingWho:null});return}if(n.phase===`foodBank`){if(e({thinking:!1,thinkingWho:null}),!n.foodRoll){t().dispatch({type:`rollFoodBank`});return}eo=setTimeout(()=>t().dispatch({type:`beginFeeding`}),io*i);return}if(n.phase===`extinction`){e({thinking:!1,thinkingWho:null}),eo=setTimeout(()=>t().dispatch({type:`continueExtinction`}),ao*i);return}if(n.phase===`growth`){e({thinking:!1,thinkingWho:null}),eo=setTimeout(()=>t().dispatch({type:`continueGrowth`}),ao*i);return}let a=oa(n);if(!a)return;if(!a.isAI&&n.madTurn!==a.id){e({thinking:!1,thinkingWho:null});return}e({thinking:!0,thinkingWho:a.id});let o=uo!==null&&uo!==a.id?lo:0,s=((n.pendingAttack===null?n.phase===`development`?oo:so:co)+o)*i*(.85+Math.random()*.3);eo=setTimeout(()=>{let n=t();if(!n.state)return;let r=oa(n.state);if(!r||!r.isAI&&n.state.madTurn!==r.id){e({thinking:!1,thinkingWho:null});return}let i=wa(n.state);if(!i){e({thinking:!1,thinkingWho:null});return}let a=Wr(n.state,i);uo=r.id,e({state:a}),queueMicrotask(()=>t().tickAI())},s)}})),J={fill:`none`,stroke:`currentColor`,strokeWidth:1.6,strokeLinecap:`round`,strokeLinejoin:`round`};function mo({id:e,className:t}){return(0,V.jsx)(`svg`,{viewBox:`0 0 24 24`,className:B(`size-4`,t),"aria-hidden":!0,children:ho(e)})}function ho(e){switch(e){case`carnivore`:return(0,V.jsx)(`path`,{...J,d:`M4 14c2-6 6-8 8-8s6 2 8 8M7 14l2 4 3-6 3 6 2-4`});case`swimming`:return(0,V.jsx)(`path`,{...J,d:`M4 12c4-6 8-6 16 0-8 6-12 6-16 0Zm8 0h.01M17 8c1 1 2 3 2 4`});case`camouflage`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`9`,cy:`12`,r:`4`,...J}),(0,V.jsx)(`circle`,{cx:`15`,cy:`12`,r:`4`,...J})]});case`sharpVision`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z`}),(0,V.jsx)(`circle`,{cx:`12`,cy:`12`,r:`2.2`,...J})]});case`burrowing`:return(0,V.jsx)(`path`,{...J,d:`M4 16c4-8 12-8 16 0M8 16v-3m4 3v-5m4 5v-3`});case`scavenger`:return(0,V.jsx)(`path`,{...J,d:`M5 16c2-8 12-8 14 0M9 10l-2-4m8 4 2-4M12 16v-3`});case`symbiosis`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`9`,cy:`12`,r:`3.5`,...J}),(0,V.jsx)(`circle`,{cx:`15`,cy:`12`,r:`3.5`,...J})]});case`piracy`:return(0,V.jsx)(`path`,{...J,d:`M5 18 12 5l7 13M8 13h8`});case`tailLoss`:return(0,V.jsx)(`path`,{...J,d:`M5 16c6-1 7-8 12-10M15 6l3 1-1 3`});case`grazing`:return(0,V.jsx)(`path`,{...J,d:`M5 17h14M7 17c0-6 3-9 5-9s5 3 5 9M12 8V5`});case`cooperation`:return(0,V.jsx)(`path`,{...J,d:`M8 10v6m8-6v6M6 14h4m4 0h4M10 12h4`});case`running`:return(0,V.jsx)(`path`,{...J,d:`M6 17l3-6 4 3 5-7M14 7h4v4`});case`highBodyWeight`:return(0,V.jsx)(`path`,{...J,d:`M5 16h14l-2-8H7l-2 8Zm3-8 1-3h6l1 3`});case`parasite`:return(0,V.jsx)(`path`,{...J,d:`M12 4v6m0 0c-3 0-5 2-5 5v5m5-10c3 0 5 2 5 5v5`});case`fatTissue`:return(0,V.jsx)(`path`,{...J,d:`M7 15c0-5 2.5-8 5-8s5 3 5 8-2 5-5 5-5-1-5-5Z`});case`communication`:return(0,V.jsx)(`path`,{...J,d:`M5 12h3l2-4 4 8 2-4h3`});case`poisonous`:return(0,V.jsx)(`path`,{...J,d:`M12 4c3 4 5 7 5 10a5 5 0 1 1-10 0c0-3 2-6 5-10Z`});case`hibernation`:return(0,V.jsx)(`path`,{...J,d:`M12 4v2M7 7l1.5 1.5M17 7l-1.5 1.5M6 14a6 6 0 0 0 12 0c0-4-6-6-6-6s-6 2-6 6Z`});case`mimicry`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`rect`,{x:`4`,y:`7`,width:`8`,height:`10`,rx:`1`,...J}),(0,V.jsx)(`rect`,{x:`12`,y:`7`,width:`8`,height:`10`,rx:`1`,opacity:.6,...J})]});case`migration`:return(0,V.jsx)(`path`,{...J,d:`M4 16c3-2 5-8 9-8m0 0h-4m4 0v4M17 6c2 2 3 4 3 6s-1 4-3 6`});case`remora`:return(0,V.jsx)(`path`,{...J,d:`M6 12c4-4 10-4 13 0-3 4-9 4-13 0Zm11 0h.01`});case`herding`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`7`,cy:`14`,r:`2.2`,...J}),(0,V.jsx)(`circle`,{cx:`12`,cy:`14`,r:`2.2`,...J}),(0,V.jsx)(`circle`,{cx:`17`,cy:`14`,r:`2.2`,...J})]});case`nematocysts`:return(0,V.jsx)(`path`,{...J,d:`M7 18V9m0 0L5 5m2 4 2-4m0 13V9m5 9V9m0 0-2-4m2 4 2-4`});case`regeneration`:return(0,V.jsx)(`path`,{...J,d:`M19 12a7 7 0 1 1-3-5.7M19 4v4h-4`});case`recombination`:return(0,V.jsx)(`path`,{...J,d:`M8 5v14m8-14v14M6 8h4m4 0h4M6 16h4m4 0h4`});case`edificator`:return(0,V.jsx)(`path`,{...J,d:`M6 20v-7l6-5 6 5v7M10 20v-5h4v5`});case`neoplasia`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`12`,cy:`12`,r:`3`,...J}),(0,V.jsx)(`path`,{...J,d:`M12 4v3m0 10v3M4 12h3m10 0h3M6.6 6.6l2.1 2.1m6.6 6.6 2.1 2.1m0-10.8-2.1 2.1M8.7 15.3l-2.1 2.1`})]});case`plantWater`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M4 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0`}),(0,V.jsx)(`path`,{...J,d:`M12 13c-1-3 .5-6 3-7-.4 3-1.2 5.5-3 7Z`})]});case`thorny`:return(0,V.jsx)(`path`,{...J,d:`M5 18c3-4 3-8 1-11m0 0 3 2M6 7l-2.6.8M9 13l3-1m-3 5 3 .5M9 14l-2.6 1.4M13 12c0-4 2-6 5-7-1 4-2.4 6.5-5 7Z`});case`rootVegetable`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M9 12c0 5 1.5 8 3 8s3-3 3-8`}),(0,V.jsx)(`path`,{...J,d:`M12 12V7m0 0c-2 0-3-1-3-3m3 3c2 0 3-1 3-3`})]});case`medicinal`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M12 20c-4 0-6-2-6-6 0-4 3-9 6-10 3 1 6 6 6 10 0 4-2 6-6 6Z`}),(0,V.jsx)(`path`,{...J,d:`M12 8v6M9 11h6`})]});case`plantParasite`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M6 20V10m0 0c0-3 2-5 5-5m0 0v10`}),(0,V.jsx)(`path`,{...J,d:`M14 5h4m-4 0V1m4 4v4`})]});case`micorrhiza`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M7 20v-6m0 0c-2 0-3-2-3-4m3 4c2 0 3-2 3-4M17 20v-6m0 0c-2 0-3-2-3-4m3 4c2 0 3-2 3-4`}),(0,V.jsx)(`path`,{...J,d:`M8 20h3m2 0h3M5 20c4 2 10 2 14 0`})]});case`tree`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M12 21v-7`}),(0,V.jsx)(`circle`,{cx:`12`,cy:`9`,r:`5`,...J}),(0,V.jsx)(`path`,{...J,d:`M12 4V2m-7 7H3m18 0h-2`})]});case`nutritious`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`12`,cy:`14`,r:`6`,...J}),(0,V.jsx)(`path`,{...J,d:`M12 8c0-2 1-3 3-4M9 13l2 2 4-4`})]});case`honeyPlant`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`12`,cy:`8`,r:`3`,...J}),(0,V.jsx)(`path`,{...J,d:`M12 11v6m0 0c-3 0-5-1-6-3m6 3c3 0 5-1 6-3M9 8H7m10 0h-2`}),(0,V.jsx)(`path`,{...J,d:`M17 3c1 1 1.5 2 1.5 3`})]});case`transparent`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M8 4h8l3 4-7 12L5 8l3-4Z`}),(0,V.jsx)(`path`,{...J,d:`M8 4l4 8 4-8M12 12l3 0`,opacity:.55})]});case`insectivore`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`ellipse`,{cx:`12`,cy:`14`,r:`4.5`,ry:`5.5`,...J}),(0,V.jsx)(`path`,{...J,d:`M12 8.5V6m0 0c-2 0-3-1-3-2.5M12 6c2 0 3-1 3-2.5M7.5 12H4m16 0h-3.5M8.5 17l-2.5 2m10-2 2.5 2`})]});case`obligateCarnivore`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M4 13c2-6 6-8 8-8s6 2 8 8M7 13l2 4 3-6 3 6 2-4`}),(0,V.jsx)(`circle`,{cx:`12`,cy:`13`,r:`1.4`})]});case`budding`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`10`,cy:`13`,r:`5`,...J}),(0,V.jsx)(`circle`,{cx:`16.5`,cy:`8.5`,r:`2.6`,...J}),(0,V.jsx)(`path`,{...J,d:`M13.8 10.6 15 9.4`})]});case`metabolicSyndrome`:return(0,V.jsx)(V.Fragment,{children:(0,V.jsx)(`path`,{...J,d:`M13 3 6 13h5l-1 8 8-11h-5l1-7Z`})});case`barkBeetle`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`ellipse`,{cx:`12`,cy:`13`,rx:`4.5`,ry:`6`,...J}),(0,V.jsx)(`path`,{...J,d:`M7.5 11c1.5 1 1.5 3 0 4m9-4c-1.5 1-1.5 3 0 4M12 7v12`,opacity:.55}),(0,V.jsx)(`path`,{...J,d:`M9 5.5 7 3m8 2.5L17 3`})]});case`extremophile`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M4 16c2 1 4 1 6 0m4 0c2 1 4 1 6 0`}),(0,V.jsx)(`path`,{...J,d:`M8 13c1-4 3-6 4-8 1 2 3 4 4 8`}),(0,V.jsx)(`path`,{...J,d:`M9 19h6`})]});case`developmentDefects`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`12`,cy:`12`,r:`7`,...J}),(0,V.jsx)(`path`,{...J,d:`M5.8 8.5 18.2 15.5M8.5 5.8l7 12.4`,opacity:.55})]});case`simplification`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M14 4 8 12h4l-2 8 8-10h-5l1-6Z`,opacity:.55}),(0,V.jsx)(`path`,{...J,d:`M4 4v6m0 0 3-3M4 10 1 7`})]});default:return(0,V.jsx)(`circle`,{cx:`12`,cy:`12`,r:`6`,...J})}}function go({kind:e,className:t}){let n=e===`toadstool`||e===`mold`||e===`madCap`||e===`flyAgaric`||e===`insight`||e===`soaring`;return(0,V.jsx)(`svg`,{viewBox:`0 0 24 24`,className:B(`size-4`,t),"aria-hidden":!0,children:n?(0,V.jsx)(`path`,{...J,d:`M4 11c0-4 3.6-7 8-7s8 3 8 7c0 .8-.6 1.4-1.4 1.2A16 16 0 0 0 12 11c-2.3 0-4.5.4-6.6 1.2C4.6 12.4 4 11.8 4 11Zm3 2.4 1.6 6.2c.1.5.6.9 1.1.9h4.6c.5 0 1-.4 1.1-.9l1.6-6.2`}):(0,V.jsx)(`path`,{...J,d:`M12 21c-1-4-1-8 0-12m0 0c-3 0-5-1.5-5-4 3 0 4.7 1.2 5 3.5M12 9c3 0 5-1.5 5-4-3 0-4.7 1.2-5 3.5M12 15c-2 0-3.5-1-4-3 2.2-.4 3.6.6 4 3Zm0 0c2 0 3.5-1 4-3-2.2-.4-3.6.6-4 3Z`})})}var _o={red:[`#d4705c`,`#a83f2f`,`#8c3123`],blue:[`#5f9cc9`,`#3c6f96`,`#2f5a7c`],yellow:[`#e3bd63`,`#b8913a`,`#9a7728`],green:[`#85b96a`,`#5c8f42`,`#497534`]};function vo({tone:e,className:t,title:n}){let[r,i,a]=_o[e];return(0,V.jsx)(`svg`,{viewBox:`0 0 20 21`,className:B(`shrink-0`,t),"aria-hidden":!n,role:n?`img`:void 0,"aria-label":n,children:(0,V.jsxs)(`g`,{stroke:`rgba(18,14,8,0.4)`,strokeWidth:`0.6`,strokeLinejoin:`round`,children:[(0,V.jsx)(`polygon`,{points:`10,1 19,6.2 10,11.4 1,6.2`,fill:r}),(0,V.jsx)(`polygon`,{points:`1,6.2 10,11.4 10,20.6 1,15.4`,fill:i}),(0,V.jsx)(`polygon`,{points:`19,6.2 10,11.4 10,20.6 19,15.4`,fill:a})]})})}function yo({kind:e,className:t}){return(0,V.jsx)(`svg`,{viewBox:`0 0 24 24`,className:B(`size-6`,t),"aria-hidden":!0,children:bo(e)})}function bo(e){switch(e){case`liana`:return(0,V.jsx)(`path`,{...J,d:`M6 3c6 2 5 8 2 12s-2 6 2 6m0-6c4 0 6-3 6-7 0-3-2-5-5-5`});case`fungus`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M4 11c0-4 3.5-7 8-7s8 3 8 7c0 1-1 2-2 2H6c-1 0-2-1-2-2Z`}),(0,V.jsx)(`path`,{...J,d:`M10 13v4m4-4v4m-6 0h8`})]});case`carnivorous`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M12 21v-6`}),(0,V.jsx)(`path`,{...J,d:`M12 15c-5-1-7-4-6-9 3 1 5 2 6 5 1-3 3-4 6-5 1 5-1 8-6 9Z`}),(0,V.jsx)(`path`,{...J,d:`M6 6l1.5 1.5M18 6l-1.5 1.5`})]});case`annual`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M12 21v-8`}),(0,V.jsx)(`path`,{...J,d:`M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Z`}),(0,V.jsx)(`circle`,{cx:`12`,cy:`5`,r:`1.6`,...J})]});case`legume`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M5 8c6 0 12 2 14 8-6 1-12-2-14-8Z`}),(0,V.jsx)(`circle`,{cx:`10`,cy:`11`,r:`1`,fill:`currentColor`,stroke:`none`}),(0,V.jsx)(`circle`,{cx:`13`,cy:`13`,r:`1`,fill:`currentColor`,stroke:`none`}),(0,V.jsx)(`path`,{...J,d:`M19 16c1-3 1-6-1-9`})]});case`perennial`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M12 21v-5`}),(0,V.jsx)(`path`,{...J,d:`M12 16c-4 0-6-3-6-7 4 0 6 3 6 7Zm0 0c4 0 6-3 6-7-4 0-6 3-6 7Z`})]});case`grass`:return(0,V.jsx)(`path`,{...J,d:`M12 21V9m0 0C10 7 8 6 5 6c1 4 3 6 7 5Zm0-1c2-2 4-3 7-3-1 4-3 6-7 5Z`});case`succulent`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M12 21v-8`}),(0,V.jsx)(`path`,{...J,d:`M12 13c-2-1-3-3-2-6 2 1 3 3 2 6Zm0 0c2-1 3-3 2-6-2 1-3 3-2 6Zm0 0c-3 0-5-1-6-4 3 0 5 1 6 4Zm0 0c3 0 5-1 6-4-3 0-5 1-6 4Z`})]});case`fruit`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`circle`,{cx:`12`,cy:`14`,r:`6`,...J}),(0,V.jsx)(`path`,{...J,d:`M12 8V5m0 0c-1.5-1-3-1-4 0m4 0c1.5-1 3-1 4 0`})]});case`parasite`:return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`path`,{...J,d:`M4 20v-7m0 0c0-4 3-7 8-7`}),(0,V.jsx)(`path`,{...J,d:`M12 6c2 0 4 1 5 3m-5-3V3`}),(0,V.jsx)(`path`,{...J,d:`M17 9c2 0 3 1 3 3`})]});default:return(0,V.jsx)(`circle`,{cx:`12`,cy:`12`,r:`6`,...J})}}var xo=t();function So({def:e,pair:t,pairNote:n,pairColor:r,disabled:i,anchorRect:a,id:o}){let s=(0,D.useRef)(null),[c,l]=(0,D.useState)(null);return(0,D.useLayoutEffect)(()=>{let e=s.current;if(!e)return;let t=e.offsetWidth,n=e.offsetHeight,r=Math.max(8,Math.min(a.left+a.width/2-t/2,window.innerWidth-8-t)),i=a.top-8-n;i<8&&(i=Math.min(a.bottom+8,window.innerHeight-8-n)),l({left:Math.round(r),top:Math.round(i)})},[a]),(0,xo.createPortal)((0,V.jsxs)(`div`,{ref:s,id:o,role:`tooltip`,style:{left:c?.left??-9999,top:c?.top??-9999},className:`pointer-events-none fixed z-50 w-max max-w-[min(190px,calc(100vw-16px))] animate-[fade-in_160ms_var(--ease-out)] overflow-hidden rounded-[var(--radius-sm)] border border-border-strong bg-bg/95 text-left shadow-[var(--shadow-card)] backdrop-blur-sm`,children:[e.image??sa[e.id]?(0,V.jsx)(`img`,{src:e.image??sa[e.id],alt:``,className:B(`-mx-3 -mt-2 mb-1.5 h-36 w-[calc(100%+24px)] max-w-none`,ca.has(e.id)?`bg-ink object-contain p-1.5`:`object-cover object-[50%_25%]`)}):(0,V.jsx)(`div`,{className:`-mx-3 -mt-2 mb-1.5 flex h-20 items-center justify-center border-b border-border bg-surface-2`,children:(0,V.jsx)(mo,{id:e.id,className:`size-10 text-muted`})}),(0,V.jsxs)(`div`,{className:`px-2.5 pb-2`,children:[(0,V.jsxs)(`div`,{className:`flex flex-wrap items-center gap-1.5 text-[11px] font-semibold`,children:[(0,V.jsx)(`span`,{className:B(`text-fg`,e.virusLike&&`text-virus`),children:e.name}),e.extraFood&&e.extraFood>0?(0,V.jsxs)(`span`,{className:`rounded-full bg-clay/20 px-1.5 text-[9px] uppercase tracking-wide text-clay`,children:[`+`,e.extraFood,` к еде`]}):null,e.scoreBonus&&e.scoreBonus>0?(0,V.jsxs)(`span`,{className:`rounded-full bg-good/20 px-1.5 text-[9px] uppercase tracking-wide text-good`,children:[`+`,e.scoreBonus,` очк.`]}):null,t?(0,V.jsxs)(`span`,{className:`flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted`,style:r?{color:r}:void 0,children:[r?(0,V.jsx)(`span`,{className:`size-2 rounded-full`,style:{background:r}}):null,n??`пара`]}):null,i?(0,V.jsx)(`span`,{className:`text-[9px] uppercase tracking-wider text-clay`,children:`отключено`}):null]}),(0,V.jsx)(`p`,{className:`mt-0.5 text-[11px] leading-snug text-muted`,children:e.description})]})]}),document.body)}function Co({toggleOnTap:e=!0,isolateClick:t=!1}={}){let n=(0,D.useRef)(null),[r,i]=(0,D.useState)(null),a=(0,D.useRef)(`mouse`),o=(0,D.useId)(),s=(0,D.useCallback)(()=>{n.current&&i(n.current.getBoundingClientRect())},[]),c=(0,D.useCallback)(()=>i(null),[]);return(0,D.useEffect)(()=>{if(!r)return;let e=e=>{e.key===`Escape`&&c()},t=e=>{!(e.target instanceof Node)||n.current?.contains(e.target)||c()},i=()=>c();return document.addEventListener(`keydown`,e),document.addEventListener(`pointerdown`,t,!0),window.addEventListener(`scroll`,i,!0),window.addEventListener(`resize`,i),()=>{document.removeEventListener(`keydown`,e),document.removeEventListener(`pointerdown`,t,!0),window.removeEventListener(`scroll`,i,!0),window.removeEventListener(`resize`,i)}},[r,c]),{anchorRef:n,tipId:o,anchorRect:r,close:c,triggerProps:(0,D.useMemo)(()=>({tabIndex:0,"aria-describedby":r?o:void 0,onPointerEnter:e=>{e.pointerType===`mouse`&&s()},onPointerLeave:e=>{e.pointerType===`mouse`&&c()},onPointerDown:e=>{a.current=e.pointerType},onClick:n=>{a.current!==`mouse`&&(t&&n.stopPropagation(),e&&(r?c():s()))},onFocus:()=>{a.current!==`touch`&&s()},onBlur:()=>c()}),[r,c,t,s,o,e])}}var wo={poison:`border-danger/50 bg-danger/15 text-clay`,antidote:`border-good/50 bg-good/15 text-good`,madness:`border-virus/50 bg-virus/15 text-virus`,rage:`border-danger/60 bg-danger/20 text-clay`,sleep:`border-border-strong/60 bg-ink/10 text-muted`,thryn:`border-leaf/50 bg-leaf/15 text-leaf`,haze:`border-food-yellow/60 bg-food-yellow/15 text-ink`,pacifism:`border-water/50 bg-water/15 text-water`},To=(0,D.memo)(function({mark:e}){let t=sn[e],n=Co({isolateClick:!0}),r={id:e,name:`Метка «${t.name}»`,description:t.description};return(0,V.jsxs)(`span`,{ref:e=>{n.anchorRef.current=e},...n.triggerProps,"data-mark-chip":!0,className:B(`anim-chip-in relative inline-flex h-5 items-center gap-1 rounded-[var(--radius-xs)] border px-1.5 text-[10px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent/60`,wo[e]),children:[t.short,n.anchorRect?(0,V.jsx)(So,{def:r,anchorRect:n.anchorRect,id:n.tipId}):null]})}),Eo=(0,D.memo)(function({flora:e,highlight:t,dimmed:n,selected:r,onClick:i}){let a=on[e.kind],o=ga[e.kind],s=Co({toggleOnTap:!1}),c={id:e.kind,name:`${a.name} · ${a.isFungus?`гриб`:`трава`}`,description:a.description,image:o},l=!!i;return(0,V.jsxs)(`div`,{"data-flora-id":e.id,ref:e=>{s.anchorRef.current=e},...s.triggerProps,"aria-label":`${a.name} — ${a.isFungus?`гриб`:`трава`}`,role:l?`button`:void 0,onClick:l?i:void 0,onKeyDown:l?e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),i?.())}:void 0,className:B(`plant-card anim-card-in relative flex w-[120px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border bg-parchment text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]`,a.isFungus?`border-virus/30`:`border-leaf/40`,r?`border-clay ring-2 ring-clay/40`:``,t?`border-accent ring-2 ring-accent`:``,n?`opacity-45`:``,l&&`hover:-translate-y-0.5`),children:[(0,V.jsxs)(`div`,{className:`relative aspect-[4/3] w-full overflow-hidden bg-parchment-2`,children:[o?(0,V.jsx)(`img`,{src:o,alt:``,loading:`lazy`,className:`absolute inset-0 h-full w-full object-cover`}):(0,V.jsx)(`span`,{className:B(`absolute inset-0 flex items-center justify-center`,a.isFungus?`text-virus`:`text-leaf`),children:(0,V.jsx)(go,{kind:e.kind,className:`size-10`})}),(0,V.jsx)(`span`,{className:B(`absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-parchment`,a.isFungus?`bg-virus/80`:`bg-leaf/80`),children:a.name})]}),(0,V.jsxs)(`div`,{className:`flex items-center gap-1.5 px-2 py-1.5`,children:[(0,V.jsxs)(`span`,{className:`flex items-center gap-0.5`,title:`Фишек еды: ${e.food} (максимум 4)`,children:[Array.from({length:e.food}).map((e,t)=>(0,V.jsx)(vo,{tone:`red`,className:`token-pop size-3`},t)),e.food===0?(0,V.jsx)(`span`,{className:`text-[10px] text-ink-soft`,children:`без еды`}):null]}),a.mark?(0,V.jsx)(`span`,{className:B(`ml-auto rounded-full border px-1.5 text-[9px] font-semibold`,wo[a.mark]),title:`Даёт метку «${sn[a.mark].name}»`,children:`метка`}):null]}),s.anchorRect?(0,V.jsx)(So,{def:c,anchorRect:s.anchorRect,id:s.tipId}):null]})});function Do({state:e,highlights:t,onFloraClick:n,zone:r}){let i=(e.flora??[]).filter(e=>!r||(e.zoneId??`gondwana`)===r);if(!i.length)return null;let a=!!n;return(0,V.jsxs)(`section`,{"aria-label":r?`Трава и грибы (${r===`laurasia`?`Лавразия`:`Гондвана`})`:`Трава и грибы`,className:`paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3`,children:[(0,V.jsxs)(`div`,{className:`flex w-full items-center justify-between text-xs text-muted`,children:[(0,V.jsx)(`span`,{className:`font-medium`,children:r?r===`laurasia`?`Флора Лавразии`:`Флора Гондваны`:`Трава и грибы · общие`}),r?null:(0,V.jsxs)(`span`,{className:`tabular-nums`,children:[`колода `,e.floraDeckCount??e.floraDeck?.length??0,` · сброс `,e.floraDiscard??0]})]}),(0,V.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:i.map(e=>(0,V.jsx)(Eo,{flora:e,highlight:t.has(e.id),dimmed:a&&t.size>0&&!t.has(e.id),onClick:a?()=>n?.(e):void 0},e.id))})]})}var Oo=(0,D.memo)(function({animal:e}){let t=An(e),n=Math.min(e.blueFood,e.food),r=e.food-n,i=Math.max(0,t-e.food);return(0,V.jsxs)(`div`,{className:`flex items-center gap-1.5`,title:`Еда ${e.food} / ${t}${n>0?` · синих ${n}`:``}${e.fatTokens>0?` · жир ${e.fatTokens}`:``}`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-1`,children:[Array.from({length:r}).map((e,t)=>(0,V.jsx)(vo,{tone:`red`,title:`Красная фишка`,className:`token-pop size-3.5`},`r${t}`)),Array.from({length:n}).map((e,t)=>(0,V.jsx)(vo,{tone:`blue`,title:`Синяя фишка`,className:`token-pop size-3.5`},`b${t}`)),Array.from({length:i}).map((e,t)=>(0,V.jsx)(`span`,{className:`inline-block size-3.5 rounded-full border border-ink/40 bg-parchment-2`},`e${t}`)),Array.from({length:e.fatTokens}).map((e,t)=>(0,V.jsx)(vo,{tone:`yellow`,title:`Жир`,className:`token-pop size-3.5`},`f${t}`))]}),(0,V.jsxs)(`span`,{className:`text-[10px] tabular-nums text-ink-soft`,children:[e.food,`/`,t]})]})}),ko=[`#1d6f8b`,`#8a4b1f`,`#4b7a2a`,`#7a3b86`,`#a33a3a`,`#2f6f57`],Ao=(0,D.memo)(function({type:e,pair:t,mark:n,disabled:r,fresh:i}){let a=H[e],o=Co({isolateClick:!0}),s=e=>{o.anchorRef.current=e},c=o.anchorRect?(0,V.jsx)(So,{def:a,pair:t,pairNote:n?.note,pairColor:n?.color,disabled:r,anchorRect:o.anchorRect,id:o.tipId}):null;return(0,V.jsxs)(`span`,{ref:s,...o.triggerProps,"data-trait-chip":!0,style:n&&!r?{backgroundColor:`${n.color}1f`,boxShadow:`inset 0 0 0 1px ${n.color}80`}:void 0,className:B(`anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/60`,r?`bg-virus/15 text-virus line-through decoration-virus/60`:a.virusLike?`bg-virus/20 text-virus ring-1 ring-inset ring-virus/50`:a.harmful?`bg-ink/85 text-parchment ring-1 ring-inset ring-clay/60`:e===`carnivore`?`bg-clay/15 text-clay`:e===`fatTissue`?`bg-food-yellow/20 text-ink`:`bg-ink/8 text-ink`,i&&!r&&`chip-fresh`),children:[n&&!r?(0,V.jsx)(`span`,{className:`size-2 shrink-0 rounded-full`,style:{background:n.color}}):(0,V.jsx)(mo,{id:e,className:`size-3.5`}),a.short,a.extraFood>0?(0,V.jsxs)(`span`,{className:`text-[9px] font-semibold text-clay`,title:`+${a.extraFood} к потребности в еде`,children:[`+`,a.extraFood]}):null,n?(0,V.jsx)(`span`,{className:`text-[9px] font-semibold`,style:{color:n.color},children:n.note}):t?(0,V.jsx)(`span`,{className:`text-[9px] opacity-70`,children:`пара`}):null,i?(0,V.jsx)(`span`,{className:`absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-clay`}):null,c]})}),jo=(0,D.memo)(function({animal:e,name:t,no:n,pairMarks:r,selected:i,dimmed:a,highlight:o,dying:s,freshSince:c,draggable:l,dropTarget:u,onDragStartCard:d,onDragOverCard:f,onDropCard:p,onDragEndCard:m}){let h=Ln(e),g=168+Math.min(Math.max(e.traits.length-3,0),3)*38;return(0,V.jsxs)(`div`,{"data-animal-id":e.id,draggable:l||void 0,onDragStart:d,onDragOver:f,onDrop:p,onDragEnd:m,style:{width:g},className:B(`animal-card anim-card-in relative shrink-0 cursor-pointer rounded-[var(--radius-lg)] border bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]`,i?`border-clay ring-2 ring-clay/40`:`border-ink/10`,o?`ring-2 ring-accent`:``,a?`opacity-45`:``,s?`dying-pulse border-danger/60`:``,u?`border-accent ring-2 ring-accent/60`:``,`hover:-translate-y-0.5`),children:[(0,V.jsxs)(`div`,{className:`mb-1 flex items-start justify-between gap-2`,children:[(0,V.jsxs)(`span`,{className:`flex items-baseline gap-1 font-display text-sm tracking-tight`,children:[n?(0,V.jsxs)(`span`,{className:`text-[10px] tabular-nums text-ink-soft`,children:[`№`,n]}):null,W(e,`obligateCarnivore`)?`Облигатный хищник`:W(e,`carnivore`)?`Хищник`:W(e,`swimming`)?`Водное`:`Животное`]}),(0,V.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(e.population??1)>1?(0,V.jsxs)(`span`,{title:`Численность вида: ${e.population} животного(-ых)`,className:`rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold tabular-nums text-accent`,children:[`×`,e.population]}):null,e.sheltered?(0,V.jsxs)(`span`,{title:`В убежище растения: хищники и хищные растения не тронут до конца фазы питания`,className:`flex items-center gap-1 rounded-full bg-leaf/25 px-1.5 text-[10px] font-medium uppercase tracking-wide text-leaf`,children:[(0,V.jsx)(`span`,{className:`size-2 rounded-full border border-leaf/60 bg-leaf/40`}),`убежище`]}):null,e.sedated?(0,V.jsx)(`span`,{title:`Откушало с лекарственного растения: накормлено, но свойства не действуют до конца фазы питания`,className:`rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft`,children:`усыплено`}):null,e.hibernating?(0,V.jsx)(`span`,{className:`rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide`,children:`сон`}):h?(0,V.jsx)(`span`,{className:`rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good`,children:`сыто`}):(0,V.jsx)(`span`,{className:`rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay`,children:`голод`})]})]}),(0,V.jsx)(`div`,{className:`mb-2 flex justify-center`,children:(0,V.jsx)(`img`,{src:la({swimming:W(e,`swimming`),carnivore:bn(e),bulky:W(e,`highBodyWeight`)}),alt:``,loading:`lazy`,className:`size-16 rounded-full border border-ink/25 object-cover object-top shadow-inner`})}),(0,V.jsx)(Oo,{animal:e}),(0,V.jsx)(`div`,{className:`mt-2 flex flex-wrap gap-1`,children:e.traits.length===0?(0,V.jsx)(`span`,{className:`text-[11px] text-ink-soft`,children:`без свойств`}):e.traits.map(e=>(0,V.jsx)(Ao,{type:e.type,pair:!!e.pairWith,mark:r?.[e.id],disabled:e.disabled,fresh:c!==void 0&&e.playSeq>c||void 0},e.id))}),e.marks?.length?(0,V.jsx)(`div`,{className:`mt-1 flex flex-wrap gap-1`,children:e.marks.map(e=>(0,V.jsx)(To,{mark:e},e))}):null,t?(0,V.jsx)(`div`,{className:`mt-2 text-[10px] uppercase tracking-wider text-ink-soft`,children:t}):null]})});function Mo({type:e,color:t,note:n}){let r=H[e],i=ca.has(e),a=Co({isolateClick:!0});return(0,V.jsxs)(`span`,{ref:e=>{a.anchorRef.current=e},...a.triggerProps,"data-trait-chip":!0,title:`${r.name}${n?` · ${n}`:``} — ${r.description}`,style:t?{borderColor:t,backgroundColor:`${t}14`}:void 0,className:`relative flex w-full shrink-0 cursor-help items-center gap-2 self-center rounded-[var(--radius-sm)] border border-dashed border-ink/30 bg-parchment-2/80 px-2 py-1 text-ink shadow-[var(--shadow-card)] sm:w-[58px] sm:flex-col sm:justify-center sm:gap-1 sm:px-1 sm:py-2`,children:[sa[e]?(0,V.jsx)(`img`,{src:sa[e],alt:``,loading:`lazy`,className:B(`size-8 shrink-0 rounded-[4px] border border-ink/20 object-cover object-top sm:h-12 sm:w-full`,i&&`bg-ink object-contain p-0.5`)}):(0,V.jsx)(`span`,{className:`flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-ink/20 bg-parchment sm:h-12 sm:w-full`,children:(0,V.jsx)(mo,{id:e,className:`size-5 text-ink-soft`})}),(0,V.jsxs)(`span`,{className:`flex min-w-0 flex-1 flex-col sm:w-full sm:flex-none sm:items-center`,children:[(0,V.jsxs)(`span`,{className:`flex items-center gap-1 truncate text-[10px] font-semibold leading-tight sm:text-[9px]`,children:[t?(0,V.jsx)(`span`,{className:`size-2 shrink-0 rounded-full`,style:{background:t}}):null,r.short]}),(0,V.jsx)(`span`,{className:`truncate text-[9px] leading-tight text-ink-soft sm:max-w-full sm:text-center sm:text-[8px]`,style:t?{color:t}:void 0,children:n??`пара`})]}),a.anchorRect?(0,V.jsx)(So,{def:r,pair:!0,pairNote:n,pairColor:t,anchorRect:a.anchorRect,id:a.tipId}):null]})}var No=(0,D.memo)(function({face:e,divided:t,active:n,disabled:r,onSelect:i}){let a=H[e],o=ca.has(e),s=Co({toggleOnTap:!1});return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`button`,{ref:e=>{s.anchorRef.current=e},...s.triggerProps,type:`button`,disabled:r,onClick:()=>i(),className:B(`flex min-h-0 flex-1 flex-col items-stretch text-left transition-colors duration-[var(--motion-fast)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60`,t?`border-b border-dashed border-ink/15`:``,n?`ring-2 ring-inset ring-accent/70`:`hover:bg-ink/5`),children:[(0,V.jsx)(`span`,{className:B(`relative block min-h-0 w-full flex-1 overflow-hidden`,o&&`bg-ink`),children:sa[e]?(0,V.jsx)(`img`,{src:sa[e],alt:``,loading:`lazy`,className:B(`absolute inset-0 h-full w-full`,o?`scale-[0.86] object-contain`:`object-cover object-[50%_28%]`)}):(0,V.jsx)(`span`,{className:`absolute inset-0 flex items-center justify-center bg-parchment-2`,children:(0,V.jsx)(mo,{id:e,className:`size-10 text-ink-soft`})})}),(0,V.jsxs)(`span`,{className:`flex items-center gap-1 px-2 pt-1.5 text-[11px] font-semibold leading-tight`,children:[(0,V.jsx)(mo,{id:e,className:`size-3.5 shrink-0`}),(0,V.jsx)(`span`,{className:`truncate`,children:a.name})]}),a.extraFood?(0,V.jsxs)(`span`,{className:`px-2 pb-1.5 text-[10px] leading-tight text-clay`,children:[`+`,a.extraFood,` еды`]}):(0,V.jsx)(`span`,{className:`pb-1.5`})]}),s.anchorRect?(0,V.jsx)(So,{def:a,anchorRect:s.anchorRect,id:s.tipId}):null]})});function Po({card:e,selected:t,selectedFace:n,onSelect:r,disabled:i}){return(0,V.jsxs)(`div`,{className:B(`relative flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border bg-parchment text-ink shadow-[var(--shadow-card)]`,t?`border-clay ring-2 ring-clay/40`:`border-ink/12`,i?`opacity-50`:``),children:[(0,V.jsx)(`button`,{type:`button`,disabled:i,onClick:()=>r(`animal`),className:B(`flex h-8 items-center justify-center border-b border-ink/10 text-[10px] font-medium uppercase tracking-wider`,t&&n===null?`bg-ink text-parchment`:`bg-parchment-2/60 text-ink-soft hover:bg-parchment-2`),children:`Животное`}),e.faces.map((a,o)=>(0,V.jsx)(No,{face:a,divided:o===0&&e.faces.length>1,active:t&&n===o,disabled:i,onSelect:()=>r(o)},`${e.id}-${a}-${o}`))]})}var Fo=(0,D.memo)(function({type:e,fresh:t}){let n=H[e],r=Co({isolateClick:!0});return(0,V.jsxs)(`span`,{ref:e=>{r.anchorRef.current=e},...r.triggerProps,"data-trait-chip":!0,className:B(`anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] bg-leaf/20 px-1.5 text-[11px] font-medium text-leaf ring-1 ring-inset ring-leaf/40 outline-none focus-visible:ring-2 focus-visible:ring-accent/60`,t&&`chip-fresh`),children:[(0,V.jsx)(mo,{id:e,className:`size-3.5`}),n.short,r.anchorRect?(0,V.jsx)(So,{def:n,anchorRect:r.anchorRect,id:r.tipId}):null]})}),Io=(0,D.memo)(function({plant:e,highlight:t,dimmed:n,selected:r,onClick:i,dying:a,fresh:o}){let s=un[e.kind],c=ha[e.kind],l=Co({toggleOnTap:!1}),u={id:e.kind,name:`${s.name} · растение`,description:s.description,image:c},d=!!i;return(0,V.jsxs)(`div`,{"data-plant-id":e.id,ref:e=>{l.anchorRef.current=e},...l.triggerProps,"aria-label":`${s.name} — растение`,role:d?`button`:void 0,onClick:d?i:void 0,onKeyDown:d?e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),i?.())}:void 0,className:B(`plant-card anim-card-in relative flex w-[132px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]`,r?`border-clay ring-2 ring-clay/40`:``,t?`border-accent ring-2 ring-accent`:``,n?`opacity-45`:``,a?`dying-pulse border-danger/60`:``,d&&`hover:-translate-y-0.5`),children:[(0,V.jsxs)(`div`,{className:`relative aspect-[4/3] w-full overflow-hidden bg-parchment-2`,children:[c?(0,V.jsx)(`img`,{src:c,alt:``,loading:`lazy`,className:`absolute inset-0 h-full w-full object-cover`}):(0,V.jsx)(`span`,{className:`absolute inset-0 flex items-center justify-center text-ink-soft`,children:(0,V.jsx)(yo,{kind:e.kind,className:`size-10`})}),(0,V.jsx)(`span`,{className:`absolute left-1 top-1 rounded-full bg-ink/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-parchment`,children:s.name}),s.carnivoreEdible?(0,V.jsx)(`span`,{className:`absolute right-1 top-1 size-4 rounded-full border border-ink/30 bg-food-yellow/80 text-center text-[10px] leading-4`,title:`Хищники могут брать с этого растения еду`,children:`🍎`}):null,e.kind===`carnivorous`&&e.attackedThisYear?(0,V.jsx)(`span`,{className:`absolute bottom-1 right-1 rounded-full bg-clay/85 px-1.5 text-[9px] font-medium text-parchment`,title:`Хищное растение уже атаковало в этом году`,children:`атака была`}):null]}),(0,V.jsxs)(`div`,{className:`flex items-center gap-1.5 px-2 py-1.5`,children:[(0,V.jsxs)(`span`,{className:`flex items-center gap-0.5`,title:`Фишек еды: ${e.food} (максимум ${s.maxFood})`,children:[Array.from({length:Math.min(e.food,5)}).map((e,t)=>(0,V.jsx)(vo,{tone:`green`,className:`token-pop size-3`},t)),e.food>5?(0,V.jsxs)(`span`,{className:`text-[10px] tabular-nums`,children:[`+`,e.food-5]}):null,e.food===0?(0,V.jsx)(`span`,{className:`text-[10px] text-ink-soft`,children:`без еды`}):null]}),e.shelters>0?(0,V.jsxs)(`span`,{className:`ml-auto flex items-center gap-0.5 rounded-full bg-leaf/25 px-1.5 text-[10px] font-semibold text-leaf`,title:`Свободных убежищ: ${e.shelters}`,children:[(0,V.jsx)(`span`,{className:`size-2.5 rounded-full border border-leaf/60 bg-leaf/40`}),e.shelters]}):null]}),e.traits.length?(0,V.jsx)(`div`,{className:`flex flex-wrap gap-1 px-2 pb-2`,children:e.traits.map(e=>(0,V.jsx)(Fo,{type:e.type},e.id))}):(0,V.jsx)(`div`,{className:`pb-2 pl-2 text-[10px] text-ink-soft`,children:o?`новое растение`:`без свойств`}),l.anchorRect?(0,V.jsx)(So,{def:u,anchorRect:l.anchorRect,id:l.tipId}):null]})});function Lo({state:e,highlights:t,dying:n,onPlantClick:r,freshSince:i,zone:a}){let o=(e.plants??[]).filter(e=>!a||(e.zoneId??`gondwana`)===a);if(!o.length)return null;let s=!!r;return(0,V.jsxs)(`section`,{"aria-label":a?`Растения (${a===`laurasia`?`Лавразия`:`Гондвана`})`:`Растения`,className:`paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3`,children:[(0,V.jsxs)(`div`,{className:`flex w-full items-center justify-between text-xs text-muted`,children:[(0,V.jsx)(`span`,{className:`font-medium`,children:a?a===`laurasia`?`Растения Лавразии`:`Растения Гондваны`:`Растения · общие`}),a?null:(0,V.jsxs)(`span`,{className:`tabular-nums`,children:[`колода `,e.plantDeckCount??e.plantDeck?.length??0,` · погибло `,e.plantDiscard??0]})]}),(0,V.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:o.map(e=>(0,V.jsx)(Io,{plant:e,highlight:t.has(e.id),dimmed:s&&t.size>0&&!t.has(e.id),dying:n?.has(e.id),onClick:s?()=>r?.(e):void 0,fresh:i!==void 0&&e.playSeq>i},e.id))})]})}var Ro=1e3,zo=1001,Bo=1002,Vo=1003,Ho=1004,Uo=1005,Wo=1006,Go=1007,Ko=1008,qo=1009,Jo=1010,Yo=1011,Xo=1012,Zo=1013,Qo=1014,$o=1015,es=1016,ts=1017,ns=1018,rs=1020,is=35902,as=35899,os=1021,ss=1022,cs=1023,ls=1026,us=1027,ds=1028,fs=1029,ps=1030,ms=1031,hs=1033,gs=33776,_s=33777,vs=33778,ys=33779,bs=35840,xs=35841,Ss=35842,Cs=35843,ws=36196,Ts=37492,Es=37496,Ds=37488,Os=37489,ks=37490,As=37491,js=37808,Ms=37809,Ns=37810,Ps=37811,Fs=37812,Is=37813,Ls=37814,Rs=37815,zs=37816,Bs=37817,Vs=37818,Hs=37819,Us=37820,Ws=37821,Gs=36492,Ks=36494,qs=36495,Js=36283,Ys=36284,Xs=36285,Zs=36286,Qs=2300,$s=2301,ec=2302,tc=2303,nc=2400,rc=2401,ic=2402,ac=3200,oc=`srgb`,sc=`srgb-linear`,cc=`linear`,lc=`srgb`,uc=7680,dc=35044,fc=2e3;function pc(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function mc(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function hc(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function gc(){let e=hc(`canvas`);return e.style.display=`block`,e}var _c={};function vc(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function yc(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function Y(...e){e=yc(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function X(...e){e=yc(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function bc(...e){let t=e.join(` `);t in _c||(_c[t]=!0,Y(...e))}function xc(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Sc={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Cc=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},wc=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Tc=Math.PI/180,Ec=180/Math.PI;function Dc(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(wc[e&255]+wc[e>>8&255]+wc[e>>16&255]+wc[e>>24&255]+`-`+wc[t&255]+wc[t>>8&255]+`-`+wc[t>>16&15|64]+wc[t>>24&255]+`-`+wc[n&63|128]+wc[n>>8&255]+`-`+wc[n>>16&255]+wc[n>>24&255]+wc[r&255]+wc[r>>8&255]+wc[r>>16&255]+wc[r>>24&255]).toLowerCase()}function Oc(e,t,n){return Math.max(t,Math.min(n,e))}function kc(e,t){return(e%t+t)%t}function Ac(e,t,n){return(1-n)*e+n*t}function jc(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Mc(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Nc=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Oc(this.x,e.x,t.x),this.y=Oc(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Oc(this.x,e,t),this.y=Oc(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oc(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Oc(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Pc=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:Y(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Oc(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Z=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ic.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ic.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Oc(this.x,e.x,t.x),this.y=Oc(this.y,e.y,t.y),this.z=Oc(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Oc(this.x,e,t),this.y=Oc(this.y,e,t),this.z=Oc(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oc(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Fc.copy(this).projectOnVector(e),this.sub(Fc)}reflect(e){return this.sub(Fc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Oc(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Fc=new Z,Ic=new Pc,Q=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return bc(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Lc.makeScale(e,t)),this}rotate(e){return bc(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Lc.makeRotation(-e)),this}translate(e,t){return bc(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Lc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Lc=new Q,Rc=new Q().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zc=new Q().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bc(){let e={enabled:!0,workingColorSpace:sc,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Hc(e.r),e.g=Hc(e.g),e.b=Hc(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Uc(e.r),e.g=Uc(e.g),e.b=Uc(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?cc:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return bc(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return bc(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[sc]:{primaries:t,whitePoint:r,transfer:cc,toXYZ:Rc,fromXYZ:zc,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:oc},outputColorSpaceConfig:{drawingBufferColorSpace:oc}},[oc]:{primaries:t,whitePoint:r,transfer:lc,toXYZ:Rc,fromXYZ:zc,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:oc}}}),e}var Vc=Bc();function Hc(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Uc(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Wc,Gc=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wc===void 0&&(Wc=hc(`canvas`)),Wc.width=e.width,Wc.height=e.height;let t=Wc.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Wc}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=hc(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Hc(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Hc(t[e]/255)*255):t[e]=Hc(t[e]);return{data:t,width:e.width,height:e.height}}return Y(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Kc=0,qc=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kc++}),this.uuid=Dc(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Jc(r[t].image)):e.push(Jc(r[t]))}else e=Jc(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Jc(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Gc.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Y(`Texture: Unable to serialize Texture.`),{})}var Yc=0,Xc=new Z,Zc=class e extends Cc{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=zo,i=zo,a=Wo,o=Ko,s=cs,c=qo,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yc++}),this.uuid=Dc(),this.name=``,this.source=new qc(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new Nc(0,0),this.repeat=new Nc(1,1),this.center=new Nc(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Q,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xc).x}get height(){return this.source.getSize(Xc).y}get depth(){return this.source.getSize(Xc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Y(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Y(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ro:e.x-=Math.floor(e.x);break;case zo:e.x=e.x<0?0:1;break;case Bo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Ro:e.y-=Math.floor(e.y);break;case zo:e.y=e.y<0?0:1;break;case Bo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zc.DEFAULT_IMAGE=null,Zc.DEFAULT_MAPPING=300,Zc.DEFAULT_ANISOTROPY=1;var Qc=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Oc(this.x,e.x,t.x),this.y=Oc(this.y,e.y,t.y),this.z=Oc(this.z,e.z,t.z),this.w=Oc(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Oc(this.x,e,t),this.y=Oc(this.y,e,t),this.z=Oc(this.z,e,t),this.w=Oc(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Oc(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$c=class extends Cc{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wo,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Qc(0,0,e,t),this.scissorTest=!1,this.viewport=new Qc(0,0,e,t),this.textures=[];let r=new Zc({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Wo,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new qc(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},el=class extends $c{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},tl=class extends Zc{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Vo,this.minFilter=Vo,this.wrapR=zo,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},nl=class extends Zc{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Vo,this.minFilter=Vo,this.wrapR=zo,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},rl=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/il.setFromMatrixColumn(e,0).length(),i=1/il.setFromMatrixColumn(e,1).length(),a=1/il.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ol,e,sl)}lookAt(e,t,n){let r=this.elements;return ul.subVectors(e,t),ul.lengthSq()===0&&(ul.z=1),ul.normalize(),cl.crossVectors(n,ul),cl.lengthSq()===0&&(Math.abs(n.z)===1?ul.x+=1e-4:ul.z+=1e-4,ul.normalize(),cl.crossVectors(n,ul)),cl.normalize(),ll.crossVectors(ul,cl),r[0]=cl.x,r[4]=ll.x,r[8]=ul.x,r[1]=cl.y,r[5]=ll.y,r[9]=ul.y,r[2]=cl.z,r[6]=ll.z,r[10]=ul.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],k=r[6],te=r[10],ne=r[14],A=r[3],j=r[7],re=r[11],M=r[15];return i[0]=a*x+o*T+s*ee+c*A,i[4]=a*S+o*E+s*k+c*j,i[8]=a*C+o*D+s*te+c*re,i[12]=a*w+o*O+s*ne+c*M,i[1]=l*x+u*T+d*ee+f*A,i[5]=l*S+u*E+d*k+f*j,i[9]=l*C+u*D+d*te+f*re,i[13]=l*w+u*O+d*ne+f*M,i[2]=p*x+m*T+h*ee+g*A,i[6]=p*S+m*E+h*k+g*j,i[10]=p*C+m*D+h*te+g*re,i[14]=p*w+m*O+h*ne+g*M,i[3]=_*x+v*T+y*ee+b*A,i[7]=_*S+v*E+y*k+b*j,i[11]=_*C+v*D+y*te+b*re,i[15]=_*w+v*O+y*ne+b*M,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/ee;return e[0]=(o*O-s*D+c*E)*k,e[1]=(r*D-n*O-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*O-c*w)*k,e[5]=(t*O-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=il.set(r[0],r[1],r[2]).length(),o=il.set(r[4],r[5],r[6]).length(),s=il.set(r[8],r[9],r[10]).length();i<0&&(a=-a),al.copy(this);let c=1/a,l=1/o,u=1/s;return al.elements[0]*=c,al.elements[1]*=c,al.elements[2]*=c,al.elements[4]*=l,al.elements[5]*=l,al.elements[6]*=l,al.elements[8]*=u,al.elements[9]*=u,al.elements[10]*=u,t.setFromRotationMatrix(al),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=fc,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=fc,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},il=new Z,al=new rl,ol=new Z(0,0,0),sl=new Z(1,1,1),cl=new Z,ll=new Z,ul=new Z,dl=new rl,fl=new Pc,pl=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Oc(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Oc(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Oc(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Oc(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Oc(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Oc(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:Y(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return dl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fl.setFromEuler(this),this.setFromQuaternion(fl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};pl.DEFAULT_ORDER=`XYZ`;var ml=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},hl=0,gl=new Z,_l=new Pc,vl=new rl,yl=new Z,bl=new Z,xl=new Z,Sl=new Pc,Cl=new Z(1,0,0),wl=new Z(0,1,0),Tl=new Z(0,0,1),El={type:`added`},Dl={type:`removed`},Ol={type:`childadded`,child:null},kl={type:`childremoved`,child:null},Al=class e extends Cc{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hl++}),this.uuid=Dc(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Z,n=new pl,r=new Pc,i=new Z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new rl},normalMatrix:{value:new Q}}),this.matrix=new rl,this.matrixWorld=new rl,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ml,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _l.setFromAxisAngle(e,t),this.quaternion.multiply(_l),this}rotateOnWorldAxis(e,t){return _l.setFromAxisAngle(e,t),this.quaternion.premultiply(_l),this}rotateX(e){return this.rotateOnAxis(Cl,e)}rotateY(e){return this.rotateOnAxis(wl,e)}rotateZ(e){return this.rotateOnAxis(Tl,e)}translateOnAxis(e,t){return gl.copy(e).applyQuaternion(this.quaternion),this.position.add(gl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cl,e)}translateY(e){return this.translateOnAxis(wl,e)}translateZ(e){return this.translateOnAxis(Tl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vl.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?yl.copy(e):yl.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),bl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vl.lookAt(bl,yl,this.up):vl.lookAt(yl,bl,this.up),this.quaternion.setFromRotationMatrix(vl),r&&(vl.extractRotation(r.matrixWorld),_l.setFromRotationMatrix(vl),this.quaternion.premultiply(_l.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(X(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(El),Ol.child=e,this.dispatchEvent(Ol),Ol.child=null):X(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Dl),kl.child=e,this.dispatchEvent(kl),kl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vl.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vl.multiply(e.parent.matrixWorld)),e.applyMatrix4(vl),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(El),Ol.child=e,this.dispatchEvent(Ol),Ol.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bl,e,xl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bl,Sl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Al.DEFAULT_UP=new Z(0,1,0),Al.DEFAULT_MATRIX_AUTO_UPDATE=!0,Al.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var jl=class extends Al{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Ml={type:`move`},Nl=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jl,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jl,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jl,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ml)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new jl;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Pl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fl={h:0,s:0,l:0},Il={h:0,s:0,l:0};function Ll(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Rl=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=oc){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vc.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Vc.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vc.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Vc.workingColorSpace){if(e=kc(e,1),t=Oc(t,0,1),n=Oc(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Ll(i,r,e+1/3),this.g=Ll(i,r,e),this.b=Ll(i,r,e-1/3)}return Vc.colorSpaceToWorking(this,r),this}setStyle(e,t=oc){function n(t){t!==void 0&&parseFloat(t)<1&&Y(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:Y(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);Y(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=oc){let n=Pl[e.toLowerCase()];return n===void 0?Y(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hc(e.r),this.g=Hc(e.g),this.b=Hc(e.b),this}copyLinearToSRGB(e){return this.r=Uc(e.r),this.g=Uc(e.g),this.b=Uc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=oc){return Vc.workingToColorSpace(zl.copy(this),e),Math.round(Oc(zl.r*255,0,255))*65536+Math.round(Oc(zl.g*255,0,255))*256+Math.round(Oc(zl.b*255,0,255))}getHexString(e=oc){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vc.workingColorSpace){Vc.workingToColorSpace(zl.copy(this),t);let n=zl.r,r=zl.g,i=zl.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Vc.workingColorSpace){return Vc.workingToColorSpace(zl.copy(this),t),e.r=zl.r,e.g=zl.g,e.b=zl.b,e}getStyle(e=oc){Vc.workingToColorSpace(zl.copy(this),e);let t=zl.r,n=zl.g,r=zl.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Fl),this.setHSL(Fl.h+e,Fl.s+t,Fl.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fl),e.getHSL(Il);let n=Ac(Fl.h,Il.h,t),r=Ac(Fl.s,Il.s,t),i=Ac(Fl.l,Il.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zl=new Rl;Rl.NAMES=Pl;var Bl=class extends Al{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pl,this.environmentIntensity=1,this.environmentRotation=new pl,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vl=new Z,Hl=new Z,Ul=new Z,Wl=new Z,Gl=new Z,Kl=new Z,ql=new Z,Jl=new Z,Yl=new Z,Xl=new Z,Zl=new Qc,Ql=new Qc,$l=new Qc,eu=class e{constructor(e=new Z,t=new Z,n=new Z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Vl.subVectors(e,t),r.cross(Vl);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Vl.subVectors(r,t),Hl.subVectors(n,t),Ul.subVectors(e,t);let a=Vl.dot(Vl),o=Vl.dot(Hl),s=Vl.dot(Ul),c=Hl.dot(Hl),l=Hl.dot(Ul),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Wl)!==null&&Wl.x>=0&&Wl.y>=0&&Wl.x+Wl.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Wl)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Wl.x),s.addScaledVector(a,Wl.y),s.addScaledVector(o,Wl.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Zl.setScalar(0),Ql.setScalar(0),$l.setScalar(0),Zl.fromBufferAttribute(e,t),Ql.fromBufferAttribute(e,n),$l.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Zl,i.x),a.addScaledVector(Ql,i.y),a.addScaledVector($l,i.z),a}static isFrontFacing(e,t,n,r){return Vl.subVectors(n,t),Hl.subVectors(e,t),Vl.cross(Hl).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vl.subVectors(this.c,this.b),Hl.subVectors(this.a,this.b),Vl.cross(Hl).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Gl.subVectors(r,n),Kl.subVectors(i,n),Jl.subVectors(e,n);let s=Gl.dot(Jl),c=Kl.dot(Jl);if(s<=0&&c<=0)return t.copy(n);Yl.subVectors(e,r);let l=Gl.dot(Yl),u=Kl.dot(Yl);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Gl,a);Xl.subVectors(e,i);let f=Gl.dot(Xl),p=Kl.dot(Xl);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Kl,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ql.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ql,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Gl,a).addScaledVector(Kl,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},tu=class{constructor(e=new Z(1/0,1/0,1/0),t=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ru.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ru.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ru.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ru):ru.fromBufferAttribute(r,t),ru.applyMatrix4(e.matrixWorld),this.expandByPoint(ru);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),iu.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),iu.copy(e.boundingBox)),iu.applyMatrix4(e.matrixWorld),this.union(iu)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ru),ru.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(du),fu.subVectors(this.max,du),au.subVectors(e.a,du),ou.subVectors(e.b,du),su.subVectors(e.c,du),cu.subVectors(ou,au),lu.subVectors(su,ou),uu.subVectors(au,su);let t=[0,-cu.z,cu.y,0,-lu.z,lu.y,0,-uu.z,uu.y,cu.z,0,-cu.x,lu.z,0,-lu.x,uu.z,0,-uu.x,-cu.y,cu.x,0,-lu.y,lu.x,0,-uu.y,uu.x,0];return!hu(t,au,ou,su,fu)||(t=[1,0,0,0,1,0,0,0,1],!hu(t,au,ou,su,fu))?!1:(pu.crossVectors(cu,lu),t=[pu.x,pu.y,pu.z],hu(t,au,ou,su,fu))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ru).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ru).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(nu[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),nu[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),nu[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),nu[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),nu[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),nu[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),nu[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),nu[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(nu),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},nu=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],ru=new Z,iu=new tu,au=new Z,ou=new Z,su=new Z,cu=new Z,lu=new Z,uu=new Z,du=new Z,fu=new Z,pu=new Z,mu=new Z;function hu(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){mu.fromArray(e,a);let o=i.x*Math.abs(mu.x)+i.y*Math.abs(mu.y)+i.z*Math.abs(mu.z),s=t.dot(mu),c=n.dot(mu),l=r.dot(mu);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var gu=new Z,_u=new Nc,vu=0,yu=class extends Cc{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vu++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=dc,this.updateRanges=[],this.gpuType=$o,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_u.fromBufferAttribute(this,t),_u.applyMatrix3(e),this.setXY(t,_u.x,_u.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gu.fromBufferAttribute(this,t),gu.applyMatrix3(e),this.setXYZ(t,gu.x,gu.y,gu.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gu.fromBufferAttribute(this,t),gu.applyMatrix4(e),this.setXYZ(t,gu.x,gu.y,gu.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gu.fromBufferAttribute(this,t),gu.applyNormalMatrix(e),this.setXYZ(t,gu.x,gu.y,gu.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gu.fromBufferAttribute(this,t),gu.transformDirection(e),this.setXYZ(t,gu.x,gu.y,gu.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=jc(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Mc(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jc(t,this.array)),t}setX(e,t){return this.normalized&&(t=Mc(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jc(t,this.array)),t}setY(e,t){return this.normalized&&(t=Mc(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jc(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Mc(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jc(t,this.array)),t}setW(e,t){return this.normalized&&(t=Mc(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Mc(t,this.array),n=Mc(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Mc(t,this.array),n=Mc(n,this.array),r=Mc(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Mc(t,this.array),n=Mc(n,this.array),r=Mc(r,this.array),i=Mc(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},bu=class extends yu{constructor(e,t,n){super(new Uint16Array(e),t,n)}},xu=class extends yu{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Su=class extends yu{constructor(e,t,n){super(new Float32Array(e),t,n)}},Cu=new tu,wu=new Z,Tu=new Z,Eu=class{constructor(e=new Z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Cu.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wu.subVectors(e,this.center);let t=wu.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(wu,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wu.copy(e.center).add(Tu)),this.expandByPoint(wu.copy(e.center).sub(Tu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Du=0,Ou=new rl,ku=new Al,Au=new Z,ju=new tu,Mu=new tu,Nu=new Z,Pu=class e extends Cc{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Du++}),this.uuid=Dc(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(pc(e)?xu:bu)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Q().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ou.makeRotationFromQuaternion(e),this.applyMatrix4(Ou),this}rotateX(e){return Ou.makeRotationX(e),this.applyMatrix4(Ou),this}rotateY(e){return Ou.makeRotationY(e),this.applyMatrix4(Ou),this}rotateZ(e){return Ou.makeRotationZ(e),this.applyMatrix4(Ou),this}translate(e,t,n){return Ou.makeTranslation(e,t,n),this.applyMatrix4(Ou),this}scale(e,t,n){return Ou.makeScale(e,t,n),this.applyMatrix4(Ou),this}lookAt(e){return ku.lookAt(e),ku.updateMatrix(),this.applyMatrix4(ku.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Au).negate(),this.translate(Au.x,Au.y,Au.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Su(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&Y(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tu);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){X(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ju.setFromBufferAttribute(n),this.morphTargetsRelative?(Nu.addVectors(this.boundingBox.min,ju.min),this.boundingBox.expandByPoint(Nu),Nu.addVectors(this.boundingBox.max,ju.max),this.boundingBox.expandByPoint(Nu)):(this.boundingBox.expandByPoint(ju.min),this.boundingBox.expandByPoint(ju.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&X(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Eu);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){X(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Z,1/0);return}if(e){let n=this.boundingSphere.center;if(ju.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mu.setFromBufferAttribute(n),this.morphTargetsRelative?(Nu.addVectors(ju.min,Mu.min),ju.expandByPoint(Nu),Nu.addVectors(ju.max,Mu.max),ju.expandByPoint(Nu)):(ju.expandByPoint(Mu.min),ju.expandByPoint(Mu.max))}ju.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Nu.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Nu));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Nu.fromBufferAttribute(a,t),o&&(Au.fromBufferAttribute(e,t),Nu.add(Au)),r=Math.max(r,n.distanceToSquared(Nu))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&X(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){X(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new yu(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new Z,s[e]=new Z;let c=new Z,l=new Z,u=new Z,d=new Nc,f=new Nc,p=new Nc,m=new Z,h=new Z;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new Z,y=new Z,b=new Z,x=new Z;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new yu(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Z,i=new Z,a=new Z,o=new Z,s=new Z,c=new Z,l=new Z,u=new Z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nu.fromBufferAttribute(e,t),Nu.normalize(),e.setXYZ(t,Nu.x,Nu.y,Nu.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new yu(a,r,i)}if(this.index===null)return Y(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Fu=0,Iu=class extends Cc{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Dc(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rl(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=uc,this.stencilZFail=uc,this.stencilZPass=uc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Y(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Y(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Rl().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new Nc().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Nc().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Lu=new Z,Ru=new Z,zu=new Z,Bu=new Z,Vu=new Z,Hu=new Z,Uu=new Z,Wu=class{constructor(e=new Z,t=new Z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Lu)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Lu.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Lu.copy(this.origin).addScaledVector(this.direction,t),Lu.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Ru.copy(e).add(t).multiplyScalar(.5),zu.copy(t).sub(e).normalize(),Bu.copy(this.origin).sub(Ru);let i=e.distanceTo(t)*.5,a=-this.direction.dot(zu),o=Bu.dot(this.direction),s=-Bu.dot(zu),c=Bu.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ru).addScaledVector(zu,d),f}intersectSphere(e,t){Lu.subVectors(e.center,this.origin);let n=Lu.dot(this.direction),r=Lu.dot(Lu)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Lu)!==null}intersectTriangle(e,t,n,r,i){Vu.subVectors(t,e),Hu.subVectors(n,e),Uu.crossVectors(Vu,Hu);let a=this.direction.dot(Uu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Bu.subVectors(this.origin,e);let s=o*this.direction.dot(Hu.crossVectors(Bu,Hu));if(s<0)return null;let c=o*this.direction.dot(Vu.cross(Bu));if(c<0||s+c>a)return null;let l=-o*Bu.dot(Uu);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Gu=class extends Iu{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Rl(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pl,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ku=new rl,qu=new Wu,Ju=new Eu,Yu=new Z,Xu=new Z,Zu=new Z,Qu=new Z,$u=new Z,ed=new Z,td=new Z,nd=new Z,rd=class extends Al{constructor(e=new Pu,t=new Gu){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ed.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&($u.fromBufferAttribute(s,e),a?ed.addScaledVector($u,r):ed.addScaledVector($u.sub(t),r))}t.add(ed)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ju.copy(n.boundingSphere),Ju.applyMatrix4(i),qu.copy(e.ray).recast(e.near),!(Ju.containsPoint(qu.origin)===!1&&(qu.intersectSphere(Ju,Yu)===null||qu.origin.distanceToSquared(Yu)>(e.far-e.near)**2))&&(Ku.copy(i).invert(),qu.copy(e.ray).applyMatrix4(Ku),(n.boundingBox===null||qu.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,qu)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ad(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ad(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ad(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ad(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function id(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;nd.copy(s),nd.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(nd);return l<n.near||l>n.far?null:{distance:l,point:nd.clone(),object:e}}function ad(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Xu),e.getVertexPosition(c,Zu),e.getVertexPosition(l,Qu);let u=id(e,t,n,r,Xu,Zu,Qu,td);if(u){let e=new Z;eu.getBarycoord(td,Xu,Zu,Qu,e),i&&(u.uv=eu.getInterpolatedAttribute(i,s,c,l,e,new Nc)),a&&(u.uv1=eu.getInterpolatedAttribute(a,s,c,l,e,new Nc)),o&&(u.normal=eu.getInterpolatedAttribute(o,s,c,l,e,new Z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Z,materialIndex:0};eu.getNormal(Xu,Zu,Qu,t.normal),u.face=t,u.barycoord=e}return u}var od=class extends Zc{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Vo,l=Vo,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},sd=new Z,cd=new Z,ld=new Q,ud=class{constructor(e=new Z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=sd.subVectors(n,t).cross(cd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(sd),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ld.getNormalMatrix(e),r=this.coplanarPoint(sd).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},dd=new Eu,fd=new Nc(.5,.5),pd=new Z,md=class{constructor(e=new ud,t=new ud,n=new ud,r=new ud,i=new ud,a=new ud){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=fc,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),dd.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),dd.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(dd)}intersectsSprite(e){return dd.center.set(0,0,0),dd.radius=.7071067811865476+fd.distanceTo(e.center),dd.applyMatrix4(e.matrixWorld),this.intersectsSphere(dd)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(pd.x=r.normal.x>0?e.max.x:e.min.x,pd.y=r.normal.y>0?e.max.y:e.min.y,pd.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(pd)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},hd=class extends Zc{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},gd=class extends Zc{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},_d=class extends Zc{constructor(e,t,n=Qo,r,i,a,o=Vo,s=Vo,c,l=ls,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},vd=class extends _d{constructor(e,t=Qo,n=301,r,i,a=Vo,o=Vo,s,c=ls){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},yd=class extends Zc{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},bd=class e extends Pu{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Su(c,3)),this.setAttribute(`normal`,new Su(l,3)),this.setAttribute(`uv`,new Su(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},xd=class e extends Pu{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Su(p,3)),this.setAttribute(`normal`,new Su(m,3)),this.setAttribute(`uv`,new Su(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function Sd(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(wd(i))i.isRenderTargetTexture?(Y(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(wd(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Cd(e){let t={};for(let n=0;n<e.length;n++){let r=Sd(e[n]);for(let e in r)t[e]=r[e]}return t}function wd(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Td(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ed(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vc.workingColorSpace}var Dd={clone:Sd,merge:Cd},Od=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ad=class extends Iu{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Od,this.fragmentShader=kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Sd(e.uniforms),this.uniformsGroups=Td(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Rl().setHex(r.value);break;case`v2`:this.uniforms[n].value=new Nc().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Qc().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Q().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new rl().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},jd=class extends Ad{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Md=class extends Iu{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new Rl(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rl(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Nc(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pl,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Nd=class extends Iu{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=ac,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Pd=class extends Iu{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Fd(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var Id=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ld=class extends Id{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:nc,endingEnd:nc}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case rc:i=e,o=2*t-n;break;case ic:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case rc:a=e,s=2*n-t;break;case ic:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Rd=class extends Id{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},zd=class extends Id{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Bd=class extends Id{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},Vd=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Fd(t,this.TimeBufferType),this.values=Fd(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Fd(e.times,Array),values:Fd(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new zd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Rd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ld(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Bd(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Qs:t=this.InterpolantFactoryMethodDiscrete;break;case $s:t=this.InterpolantFactoryMethodLinear;break;case ec:t=this.InterpolantFactoryMethodSmooth;break;case tc:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return Y(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qs;case this.InterpolantFactoryMethodLinear:return $s;case this.InterpolantFactoryMethodSmooth:return ec;case this.InterpolantFactoryMethodBezier:return tc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(X(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(X(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){X(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){X(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&mc(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){X(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===ec,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Vd.prototype.ValueTypeName=``,Vd.prototype.TimeBufferType=Float32Array,Vd.prototype.ValueBufferType=Float32Array,Vd.prototype.DefaultInterpolation=$s;var Hd=class extends Vd{constructor(e,t,n){super(e,t,n)}};Hd.prototype.ValueTypeName=`bool`,Hd.prototype.ValueBufferType=Array,Hd.prototype.DefaultInterpolation=Qs,Hd.prototype.InterpolantFactoryMethodLinear=void 0,Hd.prototype.InterpolantFactoryMethodSmooth=void 0;var Ud=class extends Vd{constructor(e,t,n,r){super(e,t,n,r)}};Ud.prototype.ValueTypeName=`color`;var Wd=class extends Vd{constructor(e,t,n,r){super(e,t,n,r)}};Wd.prototype.ValueTypeName=`number`;var Gd=class extends Id{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Pc.slerpFlat(i,0,a,c-o,a,c,s);return i}},Kd=class extends Vd{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Gd(this.times,this.values,this.getValueSize(),e)}};Kd.prototype.ValueTypeName=`quaternion`,Kd.prototype.InterpolantFactoryMethodSmooth=void 0;var qd=class extends Vd{constructor(e,t,n){super(e,t,n)}};qd.prototype.ValueTypeName=`string`,qd.prototype.ValueBufferType=Array,qd.prototype.DefaultInterpolation=Qs,qd.prototype.InterpolantFactoryMethodLinear=void 0,qd.prototype.InterpolantFactoryMethodSmooth=void 0;var Jd=class extends Vd{constructor(e,t,n,r){super(e,t,n,r)}};Jd.prototype.ValueTypeName=`vector`;var Yd=class extends Al{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new Rl(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Xd=new rl,Zd=new Z,Qd=new Z,$d=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Nc(512,512),this.mapType=qo,this.map=null,this.mapPass=null,this.matrix=new rl,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new md,this._frameExtents=new Nc(1,1),this._viewportCount=1,this._viewports=[new Qc(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Zd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zd),Qd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qd),t.updateMatrixWorld(),Xd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xd,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Xd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ef=new Z,tf=new Pc,nf=new Z,rf=class extends Al{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new rl,this.projectionMatrix=new rl,this.projectionMatrixInverse=new rl,this.coordinateSystem=fc,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ef,tf,nf),nf.x===1&&nf.y===1&&nf.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ef,tf,nf.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ef,tf,nf),nf.x===1&&nf.y===1&&nf.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ef,tf,nf.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},af=new Z,of=new Nc,sf=new Nc,cf=class extends rf{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ec*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Tc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ec*2*Math.atan(Math.tan(Tc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){af.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(af.x,af.y).multiplyScalar(-e/af.z),af.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(af.x,af.y).multiplyScalar(-e/af.z)}getViewSize(e,t){return this.getViewBounds(e,of,sf),t.subVectors(sf,of)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Tc*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},lf=class extends rf{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},uf=class extends $d{constructor(){super(new lf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},df=class extends Yd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Al.DEFAULT_UP),this.updateMatrix(),this.target=new Al,this.shadow=new uf}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ff=class extends Yd{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},pf=-90,mf=1,hf=class extends Al{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new cf(pf,mf,e,t);r.layers=this.layers,this.add(r);let i=new cf(pf,mf,e,t);i.layers=this.layers,this.add(i);let a=new cf(pf,mf,e,t);a.layers=this.layers,this.add(a);let o=new cf(pf,mf,e,t);o.layers=this.layers,this.add(o);let s=new cf(pf,mf,e,t);s.layers=this.layers,this.add(s);let c=new cf(pf,mf,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},gf=class extends cf{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},_f=`\\[\\]\\.:\\/`,vf=RegExp(`[\\[\\]\\.:\\/]`,`g`),yf=`[^\\[\\]\\.:\\/]`,bf=`[^`+_f.replace(`\\.`,``)+`]`,xf=`((?:WC+[\\/:])*)`.replace(`WC`,yf),Sf=`(WCOD+)?`.replace(`WCOD`,bf),Cf=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,yf),wf=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,yf),Tf=RegExp(`^`+xf+Sf+Cf+wf+`$`),Ef=[`material`,`materials`,`bones`,`map`],Df=class{constructor(e,t,n){let r=n||Of.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Of=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(vf,``)}static parseTrackName(e){let t=Tf.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ef.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Y(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){X(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){X(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){X(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){X(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){X(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){X(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){X(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;X(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){X(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){X(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Of.Composite=Df,Of.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Of.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Of.prototype.GetterByBindingType=[Of.prototype._getValue_direct,Of.prototype._getValue_array,Of.prototype._getValue_arrayElement,Of.prototype._getValue_toArray],Of.prototype.SetterByBindingTypeAndVersioning=[[Of.prototype._setValue_direct,Of.prototype._setValue_direct_setNeedsUpdate,Of.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Of.prototype._setValue_array,Of.prototype._setValue_array_setNeedsUpdate,Of.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Of.prototype._setValue_arrayElement,Of.prototype._setValue_arrayElement_setNeedsUpdate,Of.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Of.prototype._setValue_fromArray,Of.prototype._setValue_fromArray_setNeedsUpdate,Of.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function kf(e,t,n,r){let i=Af(r);switch(n){case os:return e*t;case ds:return e*t/i.components*i.byteLength;case fs:return e*t/i.components*i.byteLength;case ps:return e*t*2/i.components*i.byteLength;case ms:return e*t*2/i.components*i.byteLength;case ss:return e*t*3/i.components*i.byteLength;case cs:return e*t*4/i.components*i.byteLength;case hs:return e*t*4/i.components*i.byteLength;case gs:case _s:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case vs:case ys:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case xs:case Cs:return Math.max(e,16)*Math.max(t,8)/4;case bs:case Ss:return Math.max(e,8)*Math.max(t,8)/2;case ws:case Ts:case Ds:case Os:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Es:case ks:case As:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case js:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ms:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Ns:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Ps:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Fs:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Is:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ls:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Rs:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case zs:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Bs:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Vs:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Hs:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Us:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ws:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Gs:case Ks:case qs:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Js:case Ys:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Xs:case Zs:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Af(e){switch(e){case qo:case Jo:return{byteLength:1,components:1};case Xo:case Yo:case es:return{byteLength:2,components:1};case ts:case ns:return{byteLength:2,components:4};case Qo:case Zo:case $o:return{byteLength:4,components:1};case is:case as:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?Y(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function jf(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Mf(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Nf={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new Rl(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Q},alphaMap:{value:null},alphaMapTransform:{value:new Q},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Q}},envmap:{envMap:{value:null},envMapRotation:{value:new Q},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Q}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Q}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Q},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Q},normalScale:{value:new Nc(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Q},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Q}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Q}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Q}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rl(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Z},probesMax:{value:new Z},probesResolution:{value:new Z}},points:{diffuse:{value:new Rl(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Q},alphaTest:{value:0},uvTransform:{value:new Q}},sprite:{diffuse:{value:new Rl(16777215)},opacity:{value:1},center:{value:new Nc(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Q},alphaMap:{value:null},alphaMapTransform:{value:new Q},alphaTest:{value:0}}},Pf={basic:{uniforms:Cd([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:Nf.meshbasic_vert,fragmentShader:Nf.meshbasic_frag},lambert:{uniforms:Cd([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new Rl(0)},envMapIntensity:{value:1}}]),vertexShader:Nf.meshlambert_vert,fragmentShader:Nf.meshlambert_frag},phong:{uniforms:Cd([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new Rl(0)},specular:{value:new Rl(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Nf.meshphong_vert,fragmentShader:Nf.meshphong_frag},standard:{uniforms:Cd([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new Rl(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nf.meshphysical_vert,fragmentShader:Nf.meshphysical_frag},toon:{uniforms:Cd([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new Rl(0)}}]),vertexShader:Nf.meshtoon_vert,fragmentShader:Nf.meshtoon_frag},matcap:{uniforms:Cd([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:Nf.meshmatcap_vert,fragmentShader:Nf.meshmatcap_frag},points:{uniforms:Cd([$.points,$.fog]),vertexShader:Nf.points_vert,fragmentShader:Nf.points_frag},dashed:{uniforms:Cd([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nf.linedashed_vert,fragmentShader:Nf.linedashed_frag},depth:{uniforms:Cd([$.common,$.displacementmap]),vertexShader:Nf.depth_vert,fragmentShader:Nf.depth_frag},normal:{uniforms:Cd([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:Nf.meshnormal_vert,fragmentShader:Nf.meshnormal_frag},sprite:{uniforms:Cd([$.sprite,$.fog]),vertexShader:Nf.sprite_vert,fragmentShader:Nf.sprite_frag},background:{uniforms:{uvTransform:{value:new Q},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nf.background_vert,fragmentShader:Nf.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Q}},vertexShader:Nf.backgroundCube_vert,fragmentShader:Nf.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nf.cube_vert,fragmentShader:Nf.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nf.equirect_vert,fragmentShader:Nf.equirect_frag},distance:{uniforms:Cd([$.common,$.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nf.distance_vert,fragmentShader:Nf.distance_frag},shadow:{uniforms:Cd([$.lights,$.fog,{color:{value:new Rl(0)},opacity:{value:1}}]),vertexShader:Nf.shadow_vert,fragmentShader:Nf.shadow_frag}};Pf.physical={uniforms:Cd([Pf.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Q},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Q},clearcoatNormalScale:{value:new Nc(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Q},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Q},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Q},sheen:{value:0},sheenColor:{value:new Rl(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Q},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Q},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Q},transmissionSamplerSize:{value:new Nc},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Q},attenuationDistance:{value:0},attenuationColor:{value:new Rl(0)},specularColor:{value:new Rl(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Q},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Q},anisotropyVector:{value:new Nc},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Q}}]),vertexShader:Nf.meshphysical_vert,fragmentShader:Nf.meshphysical_frag};var Ff={r:0,b:0,g:0},If=new rl,Lf=new Q;Lf.set(-1,0,0,0,1,0,0,0,1);function Rf(e,t,n,r,i,a){let o=new Rl(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new rd(new bd(1,1,1),new Ad({name:`BackgroundCubeMaterial`,uniforms:Sd(Pf.backgroundCube.uniforms),vertexShader:Pf.backgroundCube.vertexShader,fragmentShader:Pf.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(If.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Lf),l.material.toneMapped=Vc.getTransfer(i.colorSpace)!==lc,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new rd(new xd(2,2),new Ad({name:`BackgroundMaterial`,uniforms:Sd(Pf.background.uniforms),vertexShader:Pf.background.vertexShader,fragmentShader:Pf.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Vc.getTransfer(i.colorSpace)!==lc,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ff,Ed(e)),n.buffers.color.setClear(Ff.r,Ff.g,Ff.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function zf(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Bf(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Vf(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(Y(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&Y(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Hf(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ud,s=new Q,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Uf=4,Wf=[.125,.215,.35,.446,.526,.582],Gf=20,Kf=256,qf=new lf,Jf=new Rl,Yf=null,Xf=0,Zf=0,Qf=!1,$f=new Z,ep=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=$f}=i;Yf=this._renderer.getRenderTarget(),Xf=this._renderer.getActiveCubeFace(),Zf=this._renderer.getActiveMipmapLevel(),Qf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=op(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Yf,Xf,Zf),this._renderer.xr.enabled=Qf,e.scissorTest=!1,rp(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Yf=this._renderer.getRenderTarget(),Xf=this._renderer.getActiveCubeFace(),Zf=this._renderer.getActiveMipmapLevel(),Qf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Wo,minFilter:Wo,generateMipmaps:!1,type:es,format:cs,colorSpace:sc,depthBuffer:!1},r=np(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=np(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=tp(r)),this._blurMaterial=ap(r,e,t),this._ggxMaterial=ip(r,e,t)}return r}_compileMaterial(e){let t=new rd(new Pu,e);this._renderer.compile(t,qf)}_sceneToCubeUV(e,t,n,r,i){let a=new cf(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Jf),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new rd(new bd,new Gu({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Jf),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;rp(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=sp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=op());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;rp(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,qf)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Uf?n-d+Uf:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,rp(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,qf),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,rp(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,qf)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&X(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Gf;m>Gf&&Y(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Gf}`);let h=[],g=0;for(let e=0;e<Gf;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];rp(t,3*v*(r>_-Uf?r-_+Uf:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,qf)}};function tp(e){let t=[],n=[],r=[],i=e,a=e-Uf+1+Wf.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Uf?s=Wf[o-e+Uf-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Pu;h.setAttribute(`position`,new yu(f,3)),h.setAttribute(`uv`,new yu(p,2)),h.setAttribute(`faceIndex`,new yu(m,1)),r.push(new rd(h,null)),i>Uf&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function np(e,t,n){let r=new el(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function rp(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ip(e,t,n){return new Ad({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Kf,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:cp(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ap(e,t,n){let r=new Float32Array(Gf),i=new Z(0,1,0);return new Ad({name:`SphericalGaussianBlur`,defines:{n:Gf,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:cp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function op(){return new Ad({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:cp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function sp(){return new Ad({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function cp(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var lp=class extends el{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new hd(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new bd(5,5,5),i=new Ad({name:`CubemapFromEquirect`,uniforms:Sd(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new rd(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Wo),new hf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function up(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new lp(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new ep(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new ep(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function dp(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&bc(`WebGLRenderer: `+e+` extension not supported.`),t}}}function fp(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?xu:bu)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function pp(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function mp(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:X(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function hp(e,t,n){let r=new WeakMap,i=new Qc;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new tl(h,p,m,u);g.type=$o,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new Nc(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function gp(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var _p={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function vp(e,t,n,r,i,a){let o=new el(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new _d(t,n):void 0}),s=new el(t,n,{type:es,depthBuffer:!1,stencilBuffer:!1}),c=new Pu;c.setAttribute(`position`,new Su([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new Su([0,2,0,0,2,0],2));let l=new jd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new rd(c,l),d=new lf(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},Vc.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=_p[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var yp=new Zc,bp=new _d(1,1),xp=new tl,Sp=new nl,Cp=new hd,wp=[],Tp=[],Ep=new Float32Array(16),Dp=new Float32Array(9),Op=new Float32Array(4);function kp(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=wp[i];if(a===void 0&&(a=new Float32Array(i),wp[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ap(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function jp(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Mp(e,t){let n=Tp[t];n===void 0&&(n=new Int32Array(t),Tp[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Np(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Pp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ap(n,t))return;e.uniform2fv(this.addr,t),jp(n,t)}}function Fp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ap(n,t))return;e.uniform3fv(this.addr,t),jp(n,t)}}function Ip(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ap(n,t))return;e.uniform4fv(this.addr,t),jp(n,t)}}function Lp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ap(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),jp(n,t)}else{if(Ap(n,r))return;Op.set(r),e.uniformMatrix2fv(this.addr,!1,Op),jp(n,r)}}function Rp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ap(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),jp(n,t)}else{if(Ap(n,r))return;Dp.set(r),e.uniformMatrix3fv(this.addr,!1,Dp),jp(n,r)}}function zp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ap(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),jp(n,t)}else{if(Ap(n,r))return;Ep.set(r),e.uniformMatrix4fv(this.addr,!1,Ep),jp(n,r)}}function Bp(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Vp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ap(n,t))return;e.uniform2iv(this.addr,t),jp(n,t)}}function Hp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ap(n,t))return;e.uniform3iv(this.addr,t),jp(n,t)}}function Up(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ap(n,t))return;e.uniform4iv(this.addr,t),jp(n,t)}}function Wp(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Gp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ap(n,t))return;e.uniform2uiv(this.addr,t),jp(n,t)}}function Kp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ap(n,t))return;e.uniform3uiv(this.addr,t),jp(n,t)}}function qp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ap(n,t))return;e.uniform4uiv(this.addr,t),jp(n,t)}}function Jp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(bp.compareFunction=n.isReversedDepthBuffer()?518:515,a=bp):a=yp,n.setTexture2D(t||a,i)}function Yp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Sp,i)}function Xp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Cp,i)}function Zp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||xp,i)}function Qp(e){switch(e){case 5126:return Np;case 35664:return Pp;case 35665:return Fp;case 35666:return Ip;case 35674:return Lp;case 35675:return Rp;case 35676:return zp;case 5124:case 35670:return Bp;case 35667:case 35671:return Vp;case 35668:case 35672:return Hp;case 35669:case 35673:return Up;case 5125:return Wp;case 36294:return Gp;case 36295:return Kp;case 36296:return qp;case 35678:case 36198:case 36298:case 36306:case 35682:return Jp;case 35679:case 36299:case 36307:return Yp;case 35680:case 36300:case 36308:case 36293:return Xp;case 36289:case 36303:case 36311:case 36292:return Zp}}function $p(e,t){e.uniform1fv(this.addr,t)}function em(e,t){let n=kp(t,this.size,2);e.uniform2fv(this.addr,n)}function tm(e,t){let n=kp(t,this.size,3);e.uniform3fv(this.addr,n)}function nm(e,t){let n=kp(t,this.size,4);e.uniform4fv(this.addr,n)}function rm(e,t){let n=kp(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function im(e,t){let n=kp(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function am(e,t){let n=kp(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function om(e,t){e.uniform1iv(this.addr,t)}function sm(e,t){e.uniform2iv(this.addr,t)}function cm(e,t){e.uniform3iv(this.addr,t)}function lm(e,t){e.uniform4iv(this.addr,t)}function um(e,t){e.uniform1uiv(this.addr,t)}function dm(e,t){e.uniform2uiv(this.addr,t)}function fm(e,t){e.uniform3uiv(this.addr,t)}function pm(e,t){e.uniform4uiv(this.addr,t)}function mm(e,t,n){let r=this.cache,i=t.length,a=Mp(n,i);Ap(r,a)||(e.uniform1iv(this.addr,a),jp(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?bp:yp;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function hm(e,t,n){let r=this.cache,i=t.length,a=Mp(n,i);Ap(r,a)||(e.uniform1iv(this.addr,a),jp(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Sp,a[e])}function gm(e,t,n){let r=this.cache,i=t.length,a=Mp(n,i);Ap(r,a)||(e.uniform1iv(this.addr,a),jp(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Cp,a[e])}function _m(e,t,n){let r=this.cache,i=t.length,a=Mp(n,i);Ap(r,a)||(e.uniform1iv(this.addr,a),jp(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||xp,a[e])}function vm(e){switch(e){case 5126:return $p;case 35664:return em;case 35665:return tm;case 35666:return nm;case 35674:return rm;case 35675:return im;case 35676:return am;case 5124:case 35670:return om;case 35667:case 35671:return sm;case 35668:case 35672:return cm;case 35669:case 35673:return lm;case 5125:return um;case 36294:return dm;case 36295:return fm;case 36296:return pm;case 35678:case 36198:case 36298:case 36306:case 35682:return mm;case 35679:case 36299:case 36307:return hm;case 35680:case 36300:case 36308:case 36293:return gm;case 36289:case 36303:case 36311:case 36292:return _m}}var ym=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Qp(t.type)}},bm=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=vm(t.type)}},xm=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Sm=/(\w+)(\])?(\[|\.)?/g;function Cm(e,t){e.seq.push(t),e.map[t.id]=t}function wm(e,t,n){let r=e.name,i=r.length;for(Sm.lastIndex=0;;){let a=Sm.exec(r),o=Sm.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Cm(n,l===void 0?new ym(s,e,t):new bm(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new xm(s),Cm(n,e)),n=e}}}var Tm=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);wm(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Em(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Dm=37297,Om=0;function km(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Am=new Q;function jm(e){Vc._getMatrix(Am,Vc.workingColorSpace,e);let t=`mat3( ${Am.elements.map(e=>e.toFixed(4))} )`;switch(Vc.getTransfer(e)){case cc:return[t,`LinearTransferOETF`];case lc:return[t,`sRGBTransferOETF`];default:return Y(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Mm(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+km(e.getShaderSource(t),r)}return i}function Nm(e,t){let n=jm(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Pm={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Fm(e,t){let n=Pm[t];return n===void 0?(Y(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Im=new Z;function Lm(){return Vc.getLuminanceCoefficients(Im),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Im.x.toFixed(4)}, ${Im.y.toFixed(4)}, ${Im.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Rm(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Vm).join(`
`)}function zm(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Bm(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Vm(e){return e!==``}function Hm(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Um(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Wm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gm(e){return e.replace(Wm,qm)}var Km=new Map;function qm(e,t){let n=Nf[t];if(n===void 0){let e=Km.get(t);if(e!==void 0)n=Nf[e],Y(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Gm(n)}var Jm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ym(e){return e.replace(Jm,Xm)}function Xm(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Zm(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Qm={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function $m(e){return Qm[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var eh={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function th(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:eh[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var nh={302:`ENVMAP_MODE_REFRACTION`};function rh(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:nh[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ih={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function ah(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ih[e.combine]||`ENVMAP_BLENDING_NONE`}function oh(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function sh(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=$m(n),l=th(n),u=rh(n),d=ah(n),f=oh(n),p=Rm(n),m=zm(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Vm).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Vm).join(`
`),_.length>0&&(_+=`
`)):(g=[Zm(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Vm).join(`
`),_=[Zm(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Nf.tonemapping_pars_fragment,n.toneMapping===0?``:Fm(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Nf.colorspace_pars_fragment,Nm(`linearToOutputTexel`,n.outputColorSpace),Lm(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Vm).join(`
`)),o=Gm(o),o=Hm(o,n),o=Um(o,n),s=Gm(s),s=Hm(s,n),s=Um(s,n),o=Ym(o),s=Ym(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Em(i,i.VERTEX_SHADER,y),S=Em(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Mm(i,x,`vertex`),n=Mm(i,S,`fragment`);X(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):Y(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Tm(i,h),T=Bm(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Dm)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Om++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var ch=0,lh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new uh(e),t.set(e,n)),n}},uh=class{constructor(e){this.id=ch++,this.code=e,this.usedTimes=0}};function dh(e){return e===1030||e===37490||e===36285}function fh(e,t,n,r,i,a){let o=new ml,s=new lh,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&Y(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=Pf[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),A=h.isInstancedMesh===!0,j=h.isBatchedMesh===!0,re=!!i.map,M=!!i.matcap,ie=!!x,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,N=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,ue=!!i.metalnessMap,de=!!i.roughnessMap,fe=i.anisotropy>0,pe=i.clearcoat>0,me=i.dispersion>0,he=i.iridescence>0,ge=i.sheen>0,_e=i.transmission>0,ve=fe&&!!i.anisotropyMap,ye=pe&&!!i.clearcoatMap,be=pe&&!!i.clearcoatNormalMap,xe=pe&&!!i.clearcoatRoughnessMap,Se=he&&!!i.iridescenceMap,Ce=he&&!!i.iridescenceThicknessMap,P=ge&&!!i.sheenColorMap,we=ge&&!!i.sheenRoughnessMap,Te=!!i.specularMap,Ee=!!i.specularColorMap,F=!!i.specularIntensityMap,De=_e&&!!i.transmissionMap,I=_e&&!!i.thicknessMap,Oe=!!i.gradientMap,ke=!!i.alphaMap,Ae=i.alphaTest>0,je=!!i.alphaHash,Me=!!i.extensions,Ne=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ne=e.toneMapping);let Pe={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:j,batchingColor:j&&h._colorsTexture!==null,instancing:A,instancingColor:A&&h.instanceColor!==null,instancingMorph:A&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Vc.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:re,matcap:M,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:N,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:N&&i.normalMapType===1,normalMapTangentSpace:N&&i.normalMapType===0,packedNormalMap:N&&i.normalMapType===0&&dh(i.normalMap.format),metalnessMap:ue,roughnessMap:de,anisotropy:fe,anisotropyMap:ve,clearcoat:pe,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:me,iridescence:he,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:ge,sheenColorMap:P,sheenRoughnessMap:we,specularMap:Te,specularColorMap:Ee,specularIntensityMap:F,transmission:_e,transmissionMap:De,thicknessMap:I,gradientMap:Oe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:ke,alphaTest:Ae,alphaHash:je,combine:i.combine,mapUv:re&&m(i.map.channel),aoMapUv:ae&&m(i.aoMap.channel),lightMapUv:oe&&m(i.lightMap.channel),bumpMapUv:se&&m(i.bumpMap.channel),normalMapUv:N&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:ue&&m(i.metalnessMap.channel),roughnessMapUv:de&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:P&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(i.sheenRoughnessMap.channel),specularMapUv:Te&&m(i.specularMap.channel),specularColorMapUv:Ee&&m(i.specularColorMap.channel),specularIntensityMapUv:F&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:I&&m(i.thicknessMap.channel),alphaMapUv:ke&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(N||fe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(re||ke),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&N===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ne,decodeVideoTexture:re&&i.map.isVideoTexture===!0&&Vc.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&Vc.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Me&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Me&&i.extensions.multiDraw===!0||j)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Pf[t];n=Dd.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new sh(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function ph(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function mh(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function hh(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function gh(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||mh),r.length>1&&r.sort(t||hh),i.length>1&&i.sort(t||hh),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function _h(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new gh,e.set(t,[i])):n>=r.length?(i=new gh,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function vh(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new Z,color:new Rl};break;case`SpotLight`:n={position:new Z,direction:new Z,color:new Rl,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Z,color:new Rl,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Z,skyColor:new Rl,groundColor:new Rl};break;case`RectAreaLight`:n={color:new Rl,position:new Z,halfWidth:new Z,halfHeight:new Z}}return e[t.id]=n,n}}}function yh(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nc};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nc};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nc,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var bh=0;function xh(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Sh(e){let t=new vh,n=yh(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Z);let i=new Z,a=new rl,o=new rl;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(xh);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=bh++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Ch(e){let t=new Sh(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function wh(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ch(e),t.set(n,[a])):r>=i.length?(a=new Ch(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Th=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Eh=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Dh=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],Oh=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],kh=new rl,Ah=new Z,jh=new Z;function Mh(e,t,n){let r=new md,i=new Nc,a=new Nc,o=new Qc,s=new Nd,c=new Pd,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Ad({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Nc},radius:{value:4}},vertexShader:Th,fragmentShader:Eh}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Pu;m.setAttribute(`position`,new yu(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new rd(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(Y(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){Y(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){Y(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new el(i.x,i.y,{format:ps,type:es,minFilter:Wo,magFilter:Wo,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new _d(i.x,i.y,$o),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ls,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Vo,d.map.depthTexture.magFilter=Vo}else l.isPointLight?(d.map=new lp(i.x),d.map.depthTexture=new vd(i.x,Qo)):(d.map=new el(i.x,i.y),d.map.depthTexture=new _d(i.x,i.y,Qo)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ls,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Wo,d.map.depthTexture.magFilter=Wo):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Vo,d.map.depthTexture.magFilter=Vo);d.camera.updateProjectionMatrix()}let g=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<g;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Ah.setFromMatrixPosition(l.matrixWorld),e.position.copy(Ah),jh.copy(e.position),jh.add(Dh[t]),e.up.copy(Oh[t]),e.lookAt(jh),e.updateMatrixWorld(),n.makeTranslation(-Ah.x,-Ah.y,-Ah.z),kh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(kh,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),b(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new el(i.x,i.y,{format:ps,type:es})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Nh(e,t){function n(){let t=!1,n=new Qc,r=null,i=new Qc(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ue(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Sc[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ue(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Rl(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),A=!1,j=0,re=e.getParameter(e.VERSION);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),A=j>=2):(j=parseFloat(/^WebGL (\d)/.exec(re)[1]),A=j>=1);let M=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new Qc().fromArray(ae),N=new Qc().fromArray(oe);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ue(e.DEPTH_TEST),o.setFunc(3),ye(!1),be(1),ue(e.CULL_FACE),_e(0);function ue(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function fe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function pe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function me(t){return h!==t&&(e.useProgram(t),h=t,!0)}let he={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};he[103]=e.MIN,he[104]=e.MAX;let ge={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function _e(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(de(e.BLEND),g=!1);return}if(g===!1&&(ue(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:X(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:X(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:X(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:X(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(he[n],he[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ge[r],ge[i],ge[o],ge[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ve(t,n){t.side===2?de(e.CULL_FACE):ue(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ye(r),t.blending===1&&t.transparent===!1?_e(0):_e(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Se(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ue(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function ye(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function be(t){t===0?de(e.CULL_FACE):(ue(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function xe(t){t!==ee&&(A&&e.lineWidth(t),ee=t)}function Se(t,n,r){t?(ue(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):de(e.POLYGON_OFFSET_FILL)}function Ce(t){t?ue(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function P(t){t===void 0&&(t=e.TEXTURE0+ne-1),M!==t&&(e.activeTexture(t),M=t)}function we(t,n,r){r===void 0&&(r=M===null?e.TEXTURE0+ne-1:M);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(M!==r&&(e.activeTexture(r),M=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=ie[M];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function F(){try{e.compressedTexImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function I(){try{e.texSubImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Me(){try{e.texImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Ne(){try{e.texImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Pe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Fe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Ie(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Le(t){N.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),N.copy(t))}function Re(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function ze(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Be(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},M=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Rl(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,se.set(0,0,e.canvas.width,e.canvas.height),N.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ue,disable:de,bindFramebuffer:fe,drawBuffers:pe,useProgram:me,setBlending:_e,setMaterial:ve,setFlipSided:ye,setCullFace:be,setLineWidth:xe,setPolygonOffset:Se,setScissorTest:Ce,activeTexture:P,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:F,texImage2D:Me,texImage3D:Ne,pixelStorei:Fe,getParameter:Pe,updateUBOMapping:Re,uniformBlockBinding:ze,texStorage2D:Ae,texStorage3D:je,texSubImage2D:De,texSubImage3D:I,compressedTexSubImage2D:Oe,compressedTexSubImage3D:ke,scissor:Ie,viewport:Le,reset:Be}}function Ph(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Nc,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):hc(`canvas`)}function g(e,t,n){let r=1,i=Ee(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),Y(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&Y(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];Y(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||Y(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?cc:Vc.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,Y(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function ee(){O=0}function k(){return O}function te(e){O=e}function ne(){let e=O;return e>=i.maxTextures&&Y(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function A(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function j(t,i){let a=r.get(t);if(t.isVideoTexture&&we(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)Y(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)Y(`WebGLRenderer: Texture marked for update but image is incomplete`);else{de(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function re(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){de(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function M(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){de(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){fe(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ae={[Ro]:e.REPEAT,[zo]:e.CLAMP_TO_EDGE,[Bo]:e.MIRRORED_REPEAT},oe={[Vo]:e.NEAREST,[Ho]:e.NEAREST_MIPMAP_NEAREST,[Uo]:e.NEAREST_MIPMAP_LINEAR,[Wo]:e.LINEAR,[Go]:e.LINEAR_MIPMAP_NEAREST,[Ko]:e.LINEAR_MIPMAP_LINEAR},se={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function N(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&Y(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,se[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ce(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=A(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function le(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ue(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=le(n.start,r.width,4),c=le(t.start,r.width,4);n.start<=i+1&&a===c&&le(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function de(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ce(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Vc.getPrimaries(Vc.workingColorSpace),r=o.colorSpace===``?null:Vc.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Te(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);N(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===us,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ue(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=kf(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data)}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=kf(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ee(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ee(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function fe(t,o,s){if(o.image.length!==6)return;let c=ce(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Vc.getPrimaries(Vc.workingColorSpace),r=o.colorSpace===``?null:Vc.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Te(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);N(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ee(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function pe(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ce(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function me(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);P(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ce(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function he(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),N(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else j(i.depthTexture,0);let u=l.__webglTexture,d=Ce(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)P(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ge(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)he(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?he(i.__webglFramebuffer[0],t,0):he(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),me(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),me(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,i){let a=r.get(t);n!==void 0&&pe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ge(t)}function ve(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&P(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ce(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),me(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),N(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)pe(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else pe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),N(c,a),pe(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),N(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)pe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else pe(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ge(t)}function ye(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let be=[],xe=[];function Se(t){if(t.samples>0){if(P(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(be.length=0,xe.length=0,be.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(be.push(l),xe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,xe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,be))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ce(e){return Math.min(i.maxSamples,e.samples)}function P(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function we(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Te(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Vc.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&Y(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):X(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ee(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=ee,this.getTextureUnits=k,this.setTextureUnits=te,this.setTexture2D=j,this.setTexture2DArray=re,this.setTexture3D=M,this.setTextureCube=ie,this.rebindTextures=_e,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=P,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Fh(e,t){function n(n,r=``){let i,a=Vc.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Ih=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Lh=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Rh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new yd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ad({vertexShader:Ih,fragmentShader:Lh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rd(new xd(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},zh=class extends Cc{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Rh,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new Nc,C=null,w=new cf;w.viewport=new Qc;let T=new cf;T.viewport=new Qc;let E=[w,T],D=new gf,O=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Nl,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Nl,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Nl,b[e]=t),t.getHandSpace()};function k(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function te(){r.removeEventListener(`select`,k),r.removeEventListener(`selectstart`,k),r.removeEventListener(`selectend`,k),r.removeEventListener(`squeeze`,k),r.removeEventListener(`squeezestart`,k),r.removeEventListener(`squeezeend`,k),r.removeEventListener(`end`,te),r.removeEventListener(`inputsourceschange`,ne);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}O=null,ee=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,se.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,k),r.addEventListener(`selectstart`,k),r.addEventListener(`selectend`,k),r.addEventListener(`squeeze`,k),r.addEventListener(`squeezestart`,k),r.addEventListener(`squeezeend`,k),r.addEventListener(`end`,te),r.addEventListener(`inputsourceschange`,ne),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?us:ls,a=_.stencil?rs:Qo);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new el(d.textureWidth,d.textureHeight,{format:cs,type:qo,depthTexture:new _d(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new el(f.framebufferWidth,f.framebufferHeight,{format:cs,type:qo,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ne(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let A=new Z,j=new Z;function re(e,t,n){A.setFromMatrixPosition(t.matrixWorld),j.setFromMatrixPosition(n.matrixWorld);let r=A.distanceTo(j),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function M(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),D.near=T.near=w.near=t,D.far=T.far=w.far=n,(O!==D.near||ee!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,ee=D.far),D.layers.mask=e.layers.mask|6,w.layers.mask=D.layers.mask&-5,T.layers.mask=D.layers.mask&-3;let i=e.parent,a=D.cameras;M(D,i);for(let e=0;e<a.length;e++)M(a[e],i);a.length===2?re(D,w,T):D.projectionMatrix.copy(w.projectionMatrix),ie(e,D,i)};function ie(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ec*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(D)},this.getCameraTexture=function(e){return g[e]};let ae=null;function oe(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==D.cameras.length&&(D.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=E[n];o===void 0&&(o=new cf,o.layers.enable(n),o.viewport=new Qc,E[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(D.matrix.copy(o.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),i===!0&&D.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new yd,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ae&&ae(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let se=new jf;se.setAnimationLoop(oe),this.setAnimationLoop=function(e){ae=e},this.dispose=function(){}}},Bh=new rl,Vh=new Q;Vh.set(-1,0,0,0,1,0,0,0,1);function Hh(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ed(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Bh.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Vh),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Uh(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return X(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?Y(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):Y(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Wh=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Gh=null;function Kh(){return Gh===null&&(Gh=new od(Wh,16,16,ps,es),Gh.name=`DFG_LUT`,Gh.minFilter=Wo,Gh.magFilter=Wo,Gh.wrapS=zo,Gh.wrapT=zo,Gh.generateMipmaps=!1,Gh.needsUpdate=!0),Gh}var qh=class{constructor(e={}){let{canvas:t=gc(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=qo}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([hs,ms,fs]),g=new Set([qo,Qo,Xo,rs,ts,ns]),_=new Uint32Array(4),v=new Int32Array(4),y=new Z,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,ee=null,k=null;this._outputColorSpace=oc;let te=0,ne=0,A=null,j=-1,re=null,M=new Qc,ie=new Qc,ae=null,oe=new Rl(0),se=0,N=t.width,ce=t.height,le=1,ue=null,de=null,fe=new Qc(0,0,N,ce),pe=new Qc(0,0,N,ce),me=!1,he=new md,ge=!1,_e=!1,ve=new rl,ye=new Z,be=new Qc,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Se=!1;function Ce(){return A===null?le:1}let P=n;function we(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,Je,!1),t.addEventListener(`webglcontextrestored`,Ye,!1),t.addEventListener(`webglcontextcreationerror`,Xe,!1),P===null){let t=`webgl2`;if(P=we(t,e),P===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw X(`WebGLRenderer: `+e.message),e}let Te,Ee,F,De,I,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge;function Ke(){Te=new dp(P),Te.init(),Ue=new Fh(P,Te),Ee=new Vf(P,Te,e,Ue),F=new Nh(P,Te),Ee.reversedDepthBuffer&&d&&F.buffers.depth.setReversed(!0),O=P.createFramebuffer(),ee=P.createFramebuffer(),k=P.createFramebuffer(),De=new mp(P),I=new ph,Oe=new Ph(P,Te,F,I,Ee,Ue,De),ke=new up(T),Ae=new Mf(P),We=new zf(P,Ae),je=new fp(P,Ae,De,We),Me=new gp(P,je,Ae,We,De),Be=new hp(P,Ee,Oe),Le=new Hf(I),Ne=new fh(T,ke,Te,Ee,We,Le),Pe=new Hh(T,I),Fe=new _h,Ie=new wh(Te),ze=new Rf(T,ke,F,Me,p,s),Re=new Mh(T,Me,Ee),Ge=new Uh(P,De,Ee,F),Ve=new Bf(P,Te,De),He=new pp(P,Te,De),De.programs=Ne.programs,T.capabilities=Ee,T.extensions=Te,T.properties=I,T.renderLists=Fe,T.shadowMap=Re,T.state=F,T.info=De}Ke(),m!==1009&&(w=new vp(m,t.width,t.height,o,r,i));let qe=new zh(T,P);this.xr=qe,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return le},this.setPixelRatio=function(e){e!==void 0&&(le=e,this.setSize(N,ce,!1))},this.getSize=function(e){return e.set(N,ce)},this.setSize=function(e,n,r=!0){if(qe.isPresenting){Y(`WebGLRenderer: Can't change size while VR device is presenting.`);return}N=e,ce=n,t.width=Math.floor(e*le),t.height=Math.floor(n*le),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(N*le,ce*le).floor()},this.setDrawingBufferSize=function(e,n,r){N=e,ce=n,le=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){X(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){Y(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(M)},this.getViewport=function(e){return e.copy(fe)},this.setViewport=function(e,t,n,r){e.isVector4?fe.set(e.x,e.y,e.z,e.w):fe.set(e,t,n,r),F.viewport(M.copy(fe).multiplyScalar(le).round())},this.getScissor=function(e){return e.copy(pe)},this.setScissor=function(e,t,n,r){e.isVector4?pe.set(e.x,e.y,e.z,e.w):pe.set(e,t,n,r),F.scissor(ie.copy(pe).multiplyScalar(le).round())},this.getScissorTest=function(){return me},this.setScissorTest=function(e){F.setScissorTest(me=e)},this.setOpaqueSort=function(e){ue=e},this.setTransparentSort=function(e){de=e},this.getClearColor=function(e){return e.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(A!==null){let t=A.texture.format;e=h.has(t)}if(e){let e=A.texture.type,t=g.has(e),n=ze.getClearColor(),r=ze.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,P.clearBufferuiv(P.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,P.clearBufferiv(P.COLOR,0,v))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Je,!1),t.removeEventListener(`webglcontextrestored`,Ye,!1),t.removeEventListener(`webglcontextcreationerror`,Xe,!1),ze.dispose(),Fe.dispose(),Ie.dispose(),I.dispose(),ke.dispose(),Me.dispose(),We.dispose(),Ge.dispose(),Ne.dispose(),qe.dispose(),qe.removeEventListener(`sessionstart`,rt),qe.removeEventListener(`sessionend`,it),at.stop()};function Je(e){e.preventDefault(),vc(`WebGLRenderer: Context Lost.`),E=!0}function Ye(){vc(`WebGLRenderer: Context Restored.`),E=!1;let e=De.autoReset,t=Re.enabled,n=Re.autoUpdate,r=Re.needsUpdate,i=Re.type;Ke(),De.autoReset=e,Re.enabled=t,Re.autoUpdate=n,Re.needsUpdate=r,Re.type=i}function Xe(e){X(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ze(e){let t=e.target;t.removeEventListener(`dispose`,Ze),Qe(t)}function Qe(e){$e(e),I.remove(e)}function $e(e){let t=I.get(e).programs;t!==void 0&&(t.forEach(function(e){Ne.releaseProgram(e)}),e.isShaderMaterial&&Ne.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=xe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=mt(e,t,n,r,i);F.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=je.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;We.setup(i,r,s,n,c);let h,g=Ve;if(c!==null&&(h=Ae.get(c),g=He,g.setIndex(h)),i.isMesh)r.wireframe===!0?(F.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),F.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ae.get(c).bytesPerElement:1,o=I.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(P,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function et(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ut(e,t,n),e.side=0,e.needsUpdate=!0,ut(e,t,n),e.side=2):ut(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),x=Ie.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];et(a,n,e),r.add(a)}else et(t,n,e),r.add(t)}}),x=C.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){I.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let tt=null;function nt(e){tt&&tt(e)}function rt(){at.stop()}function it(){at.start()}let at=new jf;at.setAnimationLoop(nt),typeof self<`u`&&at.setContext(self),this.setAnimationLoop=function(e){tt=e,qe.setAnimationLoop(e),e===null?at.stop():at.start()},qe.addEventListener(`sessionstart`,rt),qe.addEventListener(`sessionend`,it),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){X(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=qe.enabled===!0&&qe.isPresenting===!0,r=w!==null&&(A===null||n)&&w.begin(T,A);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),qe.enabled===!0&&qe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(qe.cameraAutoUpdate===!0&&qe.updateCamera(t),t=qe.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,A),x=Ie.get(e,C.length),x.init(t),x.state.textureUnits=Oe.getTextureUnits(),C.push(x),ve.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),he.setFromProjectionMatrix(ve,fc,t.reversedDepth),_e=this.localClippingEnabled,ge=Le.init(this.clippingPlanes,_e),b=Fe.get(e,S.length),b.init(),S.push(b),qe.enabled===!0&&qe.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&L(e,t,-1/0,T.sortObjects)}L(e,t,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(ue,de,t.reversedDepth),Se=qe.enabled===!1||qe.isPresenting===!1||qe.hasDepthSensing()===!1,Se&&ze.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ge===!0&&Le.beginShadows();let i=x.state.shadowsArray;if(Re.render(i,e,t),ge===!0&&Le.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];st(n,r,e,a)}Se&&ze.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];ot(b,e,n,n.viewport)}}else r.length>0&&st(n,r,e,t),Se&&ze.render(e),ot(b,e,t)}A!==null&&ne===0&&(Oe.updateMultisampleRenderTarget(A),Oe.updateRenderTargetMipmap(A)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),We.resetDefaultState(),j=-1,re=null,C.pop(),C.length>0?(x=C[C.length-1],Oe.setTextureUnits(x.state.textureUnits),ge===!0&&Le.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function L(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||he.intersectsSprite(e)){r&&be.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ve);let t=Me.update(e),i=e.material;i.visible&&b.push(e,t,i,n,be.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||he.intersectsObject(e))){let t=Me.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),be.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),be.copy(e.boundingSphere.center)),be.applyMatrix4(e.matrixWorld).applyMatrix4(ve)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&b.push(e,t,s,n,be.z,o)}}else i.visible&&b.push(e,t,i,n,be.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)L(i[e],t,n,r)}function ot(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ge===!0&&Le.setGlobalState(T.clippingPlanes,n),r&&F.viewport(M.copy(r)),i.length>0&&ct(i,t,n),a.length>0&&ct(a,t,n),o.length>0&&ct(o,t,n),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function st(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new el(1,1,{generateMipmaps:!0,type:e?es:qo,minFilter:Ko,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Vc.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||M;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(oe),se=T.getClearAlpha(),se<1&&T.setClearColor(16777215,.5),T.clear(),Se&&ze.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ge===!0&&Le.setGlobalState(T.clippingPlanes,r),ct(e,n,r),Oe.updateMultisampleRenderTarget(a),Oe.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,lt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Oe.updateMultisampleRenderTarget(a),Oe.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(oe,se),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&lt(o,t,n,s,l,c)}}function lt(e,t,n,r,i,a){e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ut(e,t,n){t.isScene!==!0&&(t=xe);let r=I.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ne.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ne.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ke.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ze),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return ft(e,s),d}else s.uniforms=Ne.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Ne.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Le.uniform),ft(e,s),r.needsLights=gt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function dt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Tm.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ft(e,t){let n=I.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function pt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function mt(e,t,n,r,i){t.isScene!==!0&&(t=xe),Oe.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=A===null?T.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Vc.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ke.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=I.get(r),y=x.state.lights;if(ge===!0&&(_e===!0||e!==re)){let t=e===re&&r.id===j;Le.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Le.numPlanes||v.numIntersection!==Le.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=ut(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),ee=v.uniforms;if(F.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==j&&(j=r.id,w=!0),v.needsLights){let e=pt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||re!==e){F.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(P,`projectionMatrix`,e.projectionMatrix),O.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(P,ye.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&O.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),re!==e&&(re=e,w=!0,E=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&O.setValue(P,`directionalShadowMap`,y.state.directionalShadowMap,Oe),y.state.spotShadowMap.length>0&&O.setValue(P,`spotShadowMap`,y.state.spotShadowMap,Oe),y.state.pointShadowMap.length>0&&O.setValue(P,`pointShadowMap`,y.state.pointShadowMap,Oe)),i.isSkinnedMesh){O.setOptional(P,i,`bindMatrix`),O.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(P,`boneTexture`,e.boneTexture,Oe))}i.isBatchedMesh&&(O.setOptional(P,i,`batchingTexture`),O.setValue(P,`batchingTexture`,i._matricesTexture,Oe),O.setOptional(P,i,`batchingIdTexture`),O.setValue(P,`batchingIdTexture`,i._indirectTexture,Oe),O.setOptional(P,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(P,`batchingColorTexture`,i._colorsTexture,Oe));let k=n.morphAttributes;if((k.position!==void 0||k.normal!==void 0||k.color!==void 0)&&Be.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(P,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(ee.envMapIntensity.value=t.environmentIntensity),ee.dfgLUT!==void 0&&(ee.dfgLUT.value=Kh()),w){if(O.setValue(P,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&ht(ee,E),a&&r.fog===!0&&Pe.refreshFogUniforms(ee,a),Pe.refreshMaterialUniforms(ee,r,le,ce,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;ee.probesSH.value=e.texture,ee.probesMin.value.copy(e.boundingBox.min),ee.probesMax.value.copy(e.boundingBox.max),ee.probesResolution.value.copy(e.resolution)}Tm.upload(P,dt(v),ee,Oe)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Tm.upload(P,dt(v),ee,Oe),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(P,`center`,i.center),O.setValue(P,`modelViewMatrix`,i.modelViewMatrix),O.setValue(P,`normalMatrix`,i.normalMatrix),O.setValue(P,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ge.update(n,S),Ge.bind(n,S)}}return S}function ht(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function gt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return te},this.getActiveMipmapLevel=function(){return ne},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(e,t,n){let r=I.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),I.get(e.texture).__webglTexture=t,I.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=I.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){A=e,te=t,ne=n;let r=null,i=!1,a=!1;if(e){let o=I.get(e);if(o.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(P.FRAMEBUFFER,o.__webglFramebuffer),M.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest,F.viewport(M),F.scissor(ie),F.setScissorTest(ae),j=-1;return}if(o.__webglFramebuffer===void 0)Oe.setupRenderTarget(e);else if(o.__hasExternalTextures)Oe.rebindTextures(e,I.get(e.texture).__webglTexture,I.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&I.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Oe.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=I.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Oe.useMultisampledRTT(e)===!1?I.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,M.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest}else M.copy(fe).multiplyScalar(le).floor(),ie.copy(pe).multiplyScalar(le).floor(),ae=me;if(n!==0&&(r=O),F.bindFramebuffer(P.FRAMEBUFFER,r)&&F.drawBuffers(e,r),F.viewport(M),F.scissor(ie),F.setScissorTest(ae),i){let r=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=I.get(e.textures[t]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=I.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,t.__webglTexture,n)}j=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){X(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){F.bindFramebuffer(P.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s),!Ee.textureFormatReadable(c)){X(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Ee.textureTypeReadable(l)){X(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,Ue.convert(c),Ue.convert(l),a)}finally{let e=A===null?null:I.get(A).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=I.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){F.bindFramebuffer(P.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+s),!Ee.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Ee.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,d),P.bufferData(P.PIXEL_PACK_BUFFER,a.byteLength,P.STREAM_READ),P.readPixels(t,n,r,i,Ue.convert(l),Ue.convert(u),0);let f=A===null?null:I.get(A).__webglFramebuffer;F.bindFramebuffer(P.FRAMEBUFFER,f);let p=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await xc(P,p,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,d),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,a),P.deleteBuffer(d),P.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Oe.setTexture2D(e,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,o,s,i,a),F.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ue.convert(t.format),_=Ue.convert(t.type),v;t.isData3DTexture?(Oe.setTexture3D(t,0),v=P.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Oe.setTexture2DArray(t,0),v=P.TEXTURE_2D_ARRAY):(Oe.setTexture2D(t,0),v=P.TEXTURE_2D),F.activeTexture(P.TEXTURE0),F.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,t.flipY),F.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),F.pixelStorei(P.UNPACK_ALIGNMENT,t.unpackAlignment);let y=F.getParameter(P.UNPACK_ROW_LENGTH),b=F.getParameter(P.UNPACK_IMAGE_HEIGHT),x=F.getParameter(P.UNPACK_SKIP_PIXELS),S=F.getParameter(P.UNPACK_SKIP_ROWS),C=F.getParameter(P.UNPACK_SKIP_IMAGES);F.pixelStorei(P.UNPACK_ROW_LENGTH,h.width),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,h.height),F.pixelStorei(P.UNPACK_SKIP_PIXELS,l),F.pixelStorei(P.UNPACK_SKIP_ROWS,u),F.pixelStorei(P.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=I.get(e),r=I.get(t),h=I.get(n.__renderTarget),g=I.get(r.__renderTarget);F.bindFramebuffer(P.READ_FRAMEBUFFER,h.__webglFramebuffer),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(e).__webglTexture,i,d+n),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,I.get(t).__webglTexture,a,m+n)),P.blitFramebuffer(l,u,o,s,f,p,o,s,P.DEPTH_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||I.has(e)){let n=I.get(e),r=I.get(t);F.bindFramebuffer(P.READ_FRAMEBUFFER,ee),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,k);for(let e=0;e<c;e++)w?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,n.__webglTexture,i),T?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,r.__webglTexture,a),i===0?T?P.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):P.copyTexSubImage2D(v,a,f,p,l,u,o,s):P.blitFramebuffer(l,u,o,s,f,p,o,s,P.COLOR_BUFFER_BIT,P.NEAREST);F.bindFramebuffer(P.READ_FRAMEBUFFER,null),F.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?P.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):P.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):P.texSubImage2D(P.TEXTURE_2D,a,f,p,o,s,g,_,h);F.pixelStorei(P.UNPACK_ROW_LENGTH,y),F.pixelStorei(P.UNPACK_IMAGE_HEIGHT,b),F.pixelStorei(P.UNPACK_SKIP_PIXELS,x),F.pixelStorei(P.UNPACK_SKIP_ROWS,S),F.pixelStorei(P.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&P.generateMipmap(v),F.unbindTexture()},this.initRenderTarget=function(e){I.get(e).__webglFramebuffer===void 0&&Oe.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Oe.setTextureCube(e,0):e.isData3DTexture?Oe.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Oe.setTexture2DArray(e,0):Oe.setTexture2D(e,0),F.unbindTexture()},this.resetState=function(){te=0,ne=0,A=null,F.reset(),We.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return fc}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Vc._getDrawingBufferColorSpace(e),t.unpackColorSpace=Vc._getUnpackColorSpace()}},Jh=[1,6,2,5,3,4],Yh={3:[0,0,0],4:[0,Math.PI,0],1:[0,-Math.PI/2,0],6:[0,Math.PI/2,0],2:[Math.PI/2,0,0],5:[-Math.PI/2,0,0]},Xh={1:[[.5,.5]],2:[[.3,.3],[.7,.7]],3:[[.3,.3],[.5,.5],[.7,.7]],4:[[.3,.3],[.7,.3],[.3,.7],[.7,.7]],5:[[.3,.3],[.7,.3],[.5,.5],[.3,.7],[.7,.7]],6:[[.3,.26],[.7,.26],[.3,.5],[.7,.5],[.3,.74],[.7,.74]]};function Zh(e){let t=document.createElement(`canvas`);t.width=t.height=128;let n=t.getContext(`2d`);n.beginPath(),n.moveTo(18,0),n.arcTo(128,0,128,128,18),n.arcTo(128,128,0,128,18),n.arcTo(0,128,0,0,18),n.arcTo(0,0,128,0,18),n.closePath();let r=n.createLinearGradient(0,0,0,128);r.addColorStop(0,`#faf4e4`),r.addColorStop(1,`#e7ddc4`),n.fillStyle=r,n.fill(),n.lineWidth=4,n.strokeStyle=`rgba(58,48,32,0.35)`,n.stroke();for(let[t,r]of Xh[e]??[]){let e=t*128,i=r*128,a=n.createRadialGradient(e-2,i-2,1,e,i,11);a.addColorStop(0,`#4a4234`),a.addColorStop(1,`#211c14`),n.fillStyle=a,n.beginPath(),n.arc(e,i,10,0,Math.PI*2),n.fill()}let i=new gd(t);return i.colorSpace=oc,i}function Qh({values:e,rolling:t,dieSize:n=64,gap:r=14,className:i,ariaLabel:a}){let o=(0,D.useRef)(null),s=(0,D.useRef)(t),c=(0,D.useRef)(e);s.current=t,c.current=e;let l=Math.max(e.length,1),u=l*n+(l-1)*r,d=Math.round(n*1.45),f=e.map(e=>e??`?`).join(`,`)+(t?`|rolling`:``);return(0,D.useEffect)(()=>{let e=o.current;if(!e)return;let t=new qh({canvas:e,alpha:!0,antialias:!0});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.setSize(u,d,!1);let n=new Bl,r=new cf(30,u/d,.1,50);r.position.set(0,1.9,6.6),r.lookAt(0,0,0),n.add(new ff(16774886,1.05));let i=new df(16777215,1.7);i.position.set(3,5,4),n.add(i);let a=new df(10466504,.55);a.position.set(-4,1.5,-2),n.add(a);let l=new bd(1,1,1),f=new Map,p=e=>{let t=f.get(e);return t||(t=new Md({map:Zh(e),roughness:.38,metalness:.04}),f.set(e,t)),t},m=[],h=Math.max(c.current.length,1);for(let e=0;e<h;e++){let t=new rd(l,Jh.map(e=>p(e)));t.position.x=(e-(h-1)/2)*1.75,n.add(t),m.push({mesh:t,spin:new Z(4+Math.random()*5,5+Math.random()*5,3+Math.random()*4)})}let g=e=>{if(!e)return null;let t=Yh[e]??Yh[3];return new Pc().setFromEuler(new pl(t[0],t[1],t[2]))};for(let e of m)e.mesh.quaternion.setFromEuler(new pl(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2));let _=new Pc,v=new pl,y=1-Math.exp(-11/60),b=0,x=performance.now(),S=e=>{let i=Math.min((e-x)/1e3,.05);x=e;let a=c.current,o=s.current;for(let t=0;t<m.length;t++){let n=m[t],r=a[t]??null;if(o||!r)v.set(n.spin.x*i,n.spin.y*i,n.spin.z*i),_.setFromEuler(v),n.mesh.quaternion.multiply(_).normalize(),n.mesh.position.y=Math.abs(Math.sin(e/140+t*1.7))*.22;else{let e=g(r);e&&n.mesh.quaternion.slerp(e,y),n.mesh.position.y+=(0-n.mesh.position.y)*y}}t.render(n,r),b=requestAnimationFrame(S)};return b=requestAnimationFrame(S),()=>{cancelAnimationFrame(b),l.dispose();for(let e of f.values())e.map?.dispose(),e.dispose();t.dispose()}},[f,l,u,d]),(0,V.jsx)(`canvas`,{ref:o,role:`img`,"aria-label":a??`Игральные кости`,style:{width:u,height:d,display:`block`},className:B(i)})}var $h=[[`easy`,`Проще`],[`normal`,`Обычная`],[`hard`,`Жёстче`]];function eg(){let e=q(e=>e.startNetCreate),t=q(e=>e.startNetJoin),n=q(e=>e.resumeNetFromUrl),[r,i]=(0,D.useState)(`none`),[a,o]=(0,D.useState)(Ya()),[s,c]=(0,D.useState)(``),[l,u]=(0,D.useState)(2),[d,f]=(0,D.useState)(0),[p,m]=(0,D.useState)(`normal`),[h,g]=(0,D.useState)(!1),[_,v]=(0,D.useState)(!1),[b,C]=(0,D.useState)(!1),[w,T]=(0,D.useState)(!1),[O,ee]=(0,D.useState)(null),[k,te]=(0,D.useState)(!1);(0,D.useEffect)(()=>{let e=new URLSearchParams(window.location.search).get(`room`);e&&(c(e.toUpperCase()),i(`join`),n(e))},[]);async function ne(e){if(!k){ee(null),te(!0);try{await e()}catch(e){ee(e instanceof Error?e.message:String(e))}finally{te(!1)}}}return r===`none`?(0,V.jsxs)(`fieldset`,{children:[(0,V.jsx)(`legend`,{className:`mb-3 text-sm font-medium text-muted`,children:`Сетевая игра`}),(0,V.jsxs)(Ut,{variant:`secondary`,size:`lg`,className:`w-full`,onClick:()=>i(`create`),children:[(0,V.jsx)(E,{className:`size-4`}),`Игра по сети`]})]}):(0,V.jsxs)(`fieldset`,{children:[(0,V.jsxs)(`legend`,{className:`mb-3 flex items-center gap-2 text-sm font-medium text-muted`,children:[(0,V.jsx)(E,{className:`size-4`}),`Игра по сети`]}),(0,V.jsxs)(`div`,{className:`mb-3 grid grid-cols-2 gap-2`,children:[(0,V.jsx)(`button`,{type:`button`,onClick:()=>i(`create`),className:B(`h-11 rounded-[var(--radius-md)] border text-sm font-medium`,r===`create`?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:`Создать стол`}),(0,V.jsx)(`button`,{type:`button`,onClick:()=>i(`join`),className:B(`h-11 rounded-[var(--radius-md)] border text-sm font-medium`,r===`join`?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:`Войти по коду`})]}),(0,V.jsxs)(`label`,{className:`mb-3 block`,children:[(0,V.jsx)(`span`,{className:`mb-1 block text-xs text-muted`,children:`Ваше имя`}),(0,V.jsx)(`input`,{value:a,onChange:e=>o(e.target.value),maxLength:16,placeholder:`Как вас видят соперники`,"aria-label":`Ваше имя`,className:`h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60`})]}),r===`create`?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`div`,{className:`mb-3`,children:[(0,V.jsx)(`p`,{className:`mb-1.5 text-xs text-muted`,children:`Мест за столом`}),(0,V.jsx)(`div`,{className:`grid grid-cols-4 gap-2 sm:grid-cols-7`,children:[2,3,4,5,6,7,8].map(e=>(0,V.jsx)(`button`,{type:`button`,onClick:()=>{u(e),f(t=>Math.min(t,e-1))},className:B(`h-10 rounded-[var(--radius-md)] border text-sm font-medium`,l===e?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:e},e))})]}),(0,V.jsxs)(`div`,{className:`mb-3`,children:[(0,V.jsx)(`p`,{className:`mb-1.5 text-xs text-muted`,children:`Боты (заполнят свободные места)`}),(0,V.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,V.jsx)(Ut,{variant:`secondary`,size:`icon`,"aria-label":`Меньше ботов`,disabled:d===0,onClick:()=>f(e=>Math.max(0,e-1)),children:(0,V.jsx)(y,{className:`size-4`})}),(0,V.jsx)(`span`,{className:`min-w-8 text-center font-display text-lg tabular-nums`,children:d}),(0,V.jsx)(Ut,{variant:`secondary`,size:`icon`,"aria-label":`Больше ботов`,disabled:d>=l-1,onClick:()=>f(e=>Math.min(l-1,e+1)),children:(0,V.jsx)(S,{className:`size-4`})})]})]}),(0,V.jsxs)(`div`,{className:`mb-3`,children:[(0,V.jsx)(`p`,{className:`mb-1.5 text-xs text-muted`,children:`Сложность ботов`}),(0,V.jsx)(`div`,{className:`grid grid-cols-3 gap-2`,children:$h.map(([e,t])=>(0,V.jsx)(`button`,{type:`button`,onClick:()=>m(e),className:B(`h-10 rounded-[var(--radius-md)] border text-sm font-medium`,p===e?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:t},e))})]}),(0,V.jsxs)(`div`,{className:`mb-3`,children:[(0,V.jsx)(`p`,{className:`mb-1.5 text-xs text-muted`,children:`Дополнения`}),(0,V.jsxs)(`div`,{className:`grid gap-2`,children:[(0,V.jsxs)(`button`,{type:`button`,onClick:()=>g(e=>!e),"aria-pressed":h,className:B(`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm`,h?`border-accent bg-accent/15 text-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:[(0,V.jsx)(`span`,{children:`Континенты — Лавразия, Гондвана и Океан`}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,h?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:h?`вкл`:`выкл`})]}),(0,V.jsxs)(`button`,{type:`button`,onClick:()=>v(e=>!e),"aria-pressed":_,title:`Растения: еда на общих растениях, фаза роста, убежища и хищные растения. Совместимо с Континентами.`,className:B(`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm`,_?`border-accent bg-accent/15 text-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:[(0,V.jsx)(`span`,{children:`Растения — общая кормовая база и убежища`}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,_?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:_?`вкл`:`выкл`})]}),(0,V.jsxs)(`button`,{type:`button`,onClick:()=>C(e=>!e),"aria-pressed":b,title:`Трава и грибы: еда на картах флоры, метки последствий, флора играет на победу. Совместимо с Континентами и Растениями.`,className:B(`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm`,b?`border-accent bg-accent/15 text-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:[(0,V.jsx)(`span`,{children:`Трава и грибы — флора и метки последствий`}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,b?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:b?`вкл`:`выкл`})]}),(0,V.jsxs)(`button`,{type:`button`,onClick:()=>T(e=>!e),"aria-pressed":w,title:`Случайные мутации: вместо руки — личная слепая колода, численность видов, вредные мутации. Совместимо со всеми дополнениями.`,className:B(`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm`,w?`border-accent bg-accent/15 text-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:[(0,V.jsx)(`span`,{children:`Случайные мутации — слепые колоды и вредные мутации`}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,w?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:w?`вкл`:`выкл`})]})]})]}),(0,V.jsxs)(Ut,{className:`w-full`,size:`lg`,disabled:k||!a.trim(),onClick:()=>ne(()=>e({name:a.trim(),capacity:l,botSeats:d,difficulty:p,modules:{...h?{continents:!0}:{},..._?{plants:!0}:{},...b?{fungi:!0}:{},...w?{randomMutations:!0}:{}}})),children:[(0,V.jsx)(x,{className:`size-4`}),`Создать стол`]})]}):(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`label`,{className:`mb-3 block`,children:[(0,V.jsx)(`span`,{className:`mb-1 block text-xs text-muted`,children:`Код стола`}),(0,V.jsx)(`input`,{value:s,onChange:e=>c(e.target.value.toUpperCase().slice(0,4)),maxLength:4,placeholder:`Например, KQXT`,"aria-label":`Код стола`,className:`h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] uppercase text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60`})]}),(0,V.jsxs)(Ut,{className:`w-full`,size:`lg`,disabled:k||!a.trim()||s.length!==4,onClick:()=>ne(()=>t(s,a.trim())),children:[(0,V.jsx)(x,{className:`size-4`}),`Войти`]})]}),O?(0,V.jsx)(`p`,{className:`mt-2 text-sm text-clay`,children:O}):null]})}function tg(){let e=q(e=>e.net),t=q(e=>e.netAddBots),n=q(e=>e.netStart),r=q(e=>e.leaveNet),[i,a]=(0,D.useState)(!1),o=e.hostSeat===e.seat,s=e.seats.filter(e=>!e.isAI).length,c=e.seats.length-s,l=e.seats.length>=e.capacity,u=`${window.location.origin}/?room=${e.code}`;async function d(){try{await navigator.clipboard.writeText(u),a(!0),setTimeout(()=>a(!1),1600)}catch{window.prompt(`Скопируйте ссылку вручную:`,u)}}return(0,V.jsxs)(`div`,{className:`mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-5 py-16`,children:[(0,V.jsx)(`p`,{className:`text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted`,children:`Стол · ждём игроков`}),(0,V.jsx)(`h1`,{className:`mt-2 text-center font-display text-4xl tracking-[0.18em]`,"data-room-code":e.code,children:e.code}),(0,V.jsxs)(`div`,{className:`mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7`,children:[(0,V.jsx)(`ul`,{className:`space-y-2`,children:Array.from({length:Math.max(e.capacity,e.seats.length)}).map((t,n)=>{let r=e.seats.find(e=>e.seat===n);return(0,V.jsxs)(`li`,{className:B(`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5`,r?`border-border bg-bg`:`border-dashed border-border bg-bg/40`,r?.seat===e.seat?`ring-1 ring-accent/50`:``),children:[(0,V.jsxs)(`span`,{className:`flex items-center gap-2 text-sm font-medium text-fg`,children:[r?r.isAI?(0,V.jsx)(m,{className:`size-4 text-muted`}):(0,V.jsx)(`span`,{className:B(`size-2 rounded-full`,r.online?`bg-good`:`bg-ink/25`),title:r.online?`в сети`:`не в сети`}):(0,V.jsx)(`span`,{className:`size-2 rounded-full bg-ink/15`}),r?r.name:`Свободное место`,r?.seat===e.hostSeat?(0,V.jsx)(`span`,{className:`rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent`,children:`хост`}):null,r?.seat===e.seat?(0,V.jsx)(`span`,{className:`text-[10px] uppercase tracking-wide text-muted`,children:`это вы`}):null]}),!r&&o?(0,V.jsx)(`span`,{className:`text-[10px] uppercase tracking-wide text-subtle`,children:`ждём`}):null]},n)})}),e.error?(0,V.jsx)(`p`,{className:`mt-3 text-sm text-clay`,children:e.error}):null,(0,V.jsxs)(`div`,{className:`mt-5 flex flex-col gap-2 sm:flex-row`,children:[(0,V.jsxs)(Ut,{variant:`secondary`,className:`flex-1`,onClick:d,children:[i?(0,V.jsx)(h,{className:`size-4 text-good`}):(0,V.jsx)(g,{className:`size-4`}),i?`Скопировано`:`Скопировать ссылку`]}),o?(0,V.jsxs)(`div`,{className:`flex gap-2`,children:[(0,V.jsxs)(Ut,{variant:`secondary`,className:`flex-1`,"aria-label":`Убрать бота`,disabled:c===0,onClick:()=>void t(-1),children:[(0,V.jsx)(y,{className:`size-4`}),`Бот`]}),(0,V.jsxs)(Ut,{variant:`secondary`,className:`flex-1`,"aria-label":`Добавить бота`,disabled:s+c>=e.capacity,onClick:()=>void t(1),children:[(0,V.jsx)(S,{className:`size-4`}),`Бот`]})]}):null]}),(0,V.jsxs)(`div`,{className:`mt-6 flex flex-col gap-2 sm:flex-row-reverse`,children:[(0,V.jsxs)(Ut,{className:`flex-1`,size:`lg`,disabled:!o||!l||s<1,title:o?l?void 0:`Заполните все места — людьми или ботами`:`Начинает хост`,onClick:()=>void n(),children:[(0,V.jsx)(x,{className:`size-4`}),`Начать год`]}),(0,V.jsxs)(Ut,{variant:`ghost`,size:`lg`,onClick:r,children:[(0,V.jsx)(v,{className:`size-4`}),`Покинуть стол`]})]})]}),(0,V.jsx)(`p`,{className:`mt-4 text-center text-xs text-subtle`,children:`Отправьте ссылку друзьям — они войдут по ней одним касанием.`})]})}var ng=[[`slow`,`Медленно`,`Боты думают дольше, фазы показываются с паузами`],[`normal`,`Обычно`,`Комфортный настольный темп`],[`fast`,`Быстро`,`Для тех, кто ждёт только своего хода`]],rg=[];function ig({onStart:e,onRules:t}){let[n,r]=(0,D.useState)(2),[i,a]=(0,D.useState)(`normal`),o=q(e=>e.speed),s=q(e=>e.setSpeed),c=q(e=>!!e.modules.continents),l=q(e=>!!e.modules.plants),u=q(e=>!!e.modules.fungi),d=q(e=>!!e.modules.randomMutations),f=q(e=>e.modules),m=q(e=>e.setModules);return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`div`,{"aria-hidden":!0,className:`pointer-events-none fixed inset-0 -z-10`,children:[(0,V.jsx)(`img`,{src:da.menu,alt:``,className:`h-full w-full object-cover opacity-45`}),(0,V.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg`})]}),(0,V.jsxs)(`div`,{className:`relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-5 py-16`,children:[(0,V.jsx)(`div`,{className:`mb-5 flex justify-center`,children:(0,V.jsx)(`img`,{src:fa,alt:``,className:`size-24 rounded-full border border-border-strong object-cover shadow-[var(--shadow-card)]`})}),(0,V.jsx)(`p`,{className:`relative mb-3 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted`,children:`Правильные игры · Кнорре`}),(0,V.jsx)(`h1`,{className:`relative text-center text-5xl text-fg sm:text-6xl`,children:`Эволюция`}),(0,V.jsx)(`p`,{className:`relative mx-auto mt-3 max-w-md text-center text-muted`,children:`Настольная игра о происхождении видов. Комбинируйте свойства, кормите популяцию и переживайте голодные годы.`}),(0,V.jsxs)(`div`,{className:`relative mt-10 space-y-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7`,children:[(0,V.jsx)(eg,{}),(0,V.jsxs)(`fieldset`,{children:[(0,V.jsxs)(`legend`,{className:`mb-3 flex items-center gap-2 text-sm font-medium text-muted`,children:[(0,V.jsx)(E,{className:`size-4`}),`Игроков за столом`]}),(0,V.jsx)(`div`,{className:`grid grid-cols-4 gap-2 sm:grid-cols-7`,children:[2,3,4,5,6,7,8].map(e=>(0,V.jsx)(`button`,{type:`button`,onClick:()=>r(e),className:B(`h-12 rounded-[var(--radius-md)] border text-sm font-medium`,n===e?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:e},e))}),(0,V.jsxs)(`p`,{className:`mt-2 text-xs text-subtle`,children:[`Вы против `,n-1==1?`одного бота`:`${n-1} ботов`]})]}),(0,V.jsxs)(`fieldset`,{children:[(0,V.jsx)(`legend`,{className:`mb-3 text-sm font-medium text-muted`,children:`Сложность`}),(0,V.jsx)(`div`,{className:`grid grid-cols-3 gap-2`,children:[[`easy`,`Проще`],[`normal`,`Обычная`],[`hard`,`Жёстче`]].map(([e,t])=>(0,V.jsx)(`button`,{type:`button`,onClick:()=>a(e),className:B(`h-12 rounded-[var(--radius-md)] border text-sm font-medium`,i===e?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:t},e))})]}),(0,V.jsxs)(`fieldset`,{children:[(0,V.jsx)(`legend`,{className:`mb-3 text-sm font-medium text-muted`,children:`Темп игры`}),(0,V.jsx)(`div`,{className:`grid gap-2 sm:grid-cols-3`,children:ng.map(([e,t,n])=>(0,V.jsx)(`button`,{type:`button`,title:n,onClick:()=>s(e),className:B(`h-11 rounded-[var(--radius-md)] border text-sm font-medium`,o===e?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:t},e))})]}),(0,V.jsxs)(`fieldset`,{children:[(0,V.jsx)(`legend`,{className:`mb-3 text-sm font-medium text-muted`,children:`Дополнения`}),(0,V.jsxs)(`div`,{className:`grid gap-2`,children:[(0,V.jsxs)(`button`,{type:`button`,onClick:()=>m({...f,continents:!c}),"aria-pressed":c,title:`Континенты: Лавразия и Гондвана с отдельными кормовыми базами, Океан для водоплавающих, миграция, прилипала, стадность, стрекательные клетки, эдификатор, регенерация, рекомбинация, неоплазия`,className:B(`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left`,c?`border-accent bg-accent/15`:`border-border bg-bg hover:bg-surface-2`),children:[(0,V.jsxs)(`span`,{children:[(0,V.jsx)(`span`,{className:`block text-sm font-medium text-fg`,children:`Континенты`}),(0,V.jsx)(`span`,{className:`mt-0.5 block text-xs text-muted`,children:`две кормовые базы и океан · миграция · новые свойства`})]}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,c?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:c?`вкл`:`выкл`})]}),(0,V.jsxs)(`button`,{type:`button`,onClick:()=>m({...f,plants:!l}),"aria-pressed":l,title:`Растения: еда этого года — на общих растениях, кубик не нужен; фаза роста, убежища, хищные растения, микориза и паразиты. Совместимо с Континентами.`,className:B(`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left`,l?`border-accent bg-accent/15`:`border-border bg-bg hover:bg-surface-2`),children:[(0,V.jsxs)(`span`,{children:[(0,V.jsx)(`span`,{className:`block text-sm font-medium text-fg`,children:`Растения`}),(0,V.jsx)(`span`,{className:`mt-0.5 block text-xs text-muted`,children:`еда на общих растениях · убежища · фаза роста · хищные растения`})]}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,l?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:l?`вкл`:`выкл`})]}),(0,V.jsxs)(`button`,{type:`button`,onClick:()=>m({...f,fungi:!u}),"aria-pressed":u,title:`Трава и грибы: еда этого года — на общих картах трав и грибов; метки последствий (Яд, Сон, Бешенство…), новые свойства «Прозрачное» и «Насекомоядное». Совместимо с Континентами и Растениями.`,className:B(`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left`,u?`border-accent bg-accent/15`:`border-border bg-bg hover:bg-surface-2`),children:[(0,V.jsxs)(`span`,{children:[(0,V.jsx)(`span`,{className:`block text-sm font-medium text-fg`,children:`Трава и грибы`}),(0,V.jsx)(`span`,{className:`mt-0.5 block text-xs text-muted`,children:`еда на травах и грибах · метки последствий · флора играет на победу`})]}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,u?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:u?`вкл`:`выкл`})]}),(0,V.jsxs)(`button`,{type:`button`,onClick:()=>m({...f,randomMutations:!d}),"aria-pressed":d,title:`Случайные мутации: вместо руки — личная слепая колода; объявите розыгрыш и вскройте карту. Новые свойства, в том числе вредные мутации. Совместимо со всеми дополнениями.`,className:B(`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left`,d?`border-accent bg-accent/15`:`border-border bg-bg hover:bg-surface-2`),children:[(0,V.jsxs)(`span`,{children:[(0,V.jsx)(`span`,{className:`block text-sm font-medium text-fg`,children:`Случайные мутации`}),(0,V.jsx)(`span`,{className:`mt-0.5 block text-xs text-muted`,children:`личная слепая колода · численность видов · вредные мутации`})]}),(0,V.jsx)(`span`,{className:B(`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide`,d?`bg-accent text-accent-fg`:`bg-ink/20 text-muted`),children:d?`вкл`:`выкл`})]}),(0,V.jsx)(`ul`,{className:`grid gap-2 sm:grid-cols-2`,children:rg.map(([e,t])=>(0,V.jsxs)(`li`,{title:`${e}: ${t}. Готовится — официальный пересказ правил следующим обновлением.`,className:`flex cursor-not-allowed items-center justify-between rounded-[var(--radius-md)] border border-dashed border-border bg-bg px-3 py-2.5 opacity-60`,children:[(0,V.jsx)(`span`,{className:`text-sm text-fg`,children:e}),(0,V.jsx)(`span`,{className:`rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted`,children:`скоро`})]},e))})]})]}),(0,V.jsxs)(`div`,{className:`flex flex-col gap-2 sm:flex-row`,children:[(0,V.jsxs)(Ut,{className:`flex-1`,size:`lg`,onClick:()=>e(n,i),children:[(0,V.jsx)(x,{className:`size-4`}),`Начать год`]}),(0,V.jsxs)(Ut,{variant:`secondary`,size:`lg`,onClick:t,children:[(0,V.jsx)(p,{className:`size-4`}),`Правила`]})]})]})]})]})}var ag=[{id:`base`,label:`Базовая игра`},{id:`continents`,label:`Континенты`},{id:`plants`,label:`Растения`},{id:`fungi`,label:`Трава и грибы`},{id:`mutations`,label:`Мутации`}],og={base:Wt.filter(e=>!Gt.has(e)&&!Kt.has(e)&&!qt.has(e)&&!Jt.has(e)),continents:Wt.filter(e=>Gt.has(e)),plants:Wt.filter(e=>Kt.has(e)),fungi:Wt.filter(e=>qt.has(e)),mutations:Wt.filter(e=>Jt.has(e))};function sg({ids:e}){return(0,V.jsx)(`ul`,{className:`grid gap-2 sm:grid-cols-2`,children:e.map(e=>{let t=H[e];return(0,V.jsxs)(`li`,{className:`flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3`,children:[sa[t.id]?(0,V.jsx)(`img`,{src:sa[t.id],alt:``,loading:`lazy`,className:B(`h-[68px] w-12 shrink-0 rounded-[var(--radius-xs)] object-cover object-top`,ca.has(t.id)&&`bg-ink object-contain p-0.5`)}):(0,V.jsx)(`span`,{className:`flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-border bg-surface`,children:(0,V.jsx)(mo,{id:t.id,className:`size-7 text-muted`})}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`div`,{className:`font-medium text-fg`,children:t.name}),(0,V.jsx)(`div`,{className:`mt-1 text-xs leading-snug`,children:t.description})]})]},t.id)})})}function cg(){let e=Object.keys(on);return(0,V.jsx)(`ul`,{className:`grid gap-2 sm:grid-cols-2`,children:e.map(e=>{let t=on[e];return(0,V.jsxs)(`li`,{className:`flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3`,children:[(0,V.jsx)(`span`,{className:B(`flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border`,t.isFungus?`border-virus/40 bg-virus/10 text-virus`:`border-leaf/40 bg-leaf/10 text-leaf`),children:(0,V.jsx)(go,{kind:e,className:`size-7`})}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`div`,{className:`font-medium text-fg`,children:[t.name,(0,V.jsxs)(`span`,{className:`ml-1 text-xs font-normal text-muted`,children:[`(`,t.isFungus?`гриб · входит с 1 фишкой`:`трава · входит с 3`,`)`]})]}),(0,V.jsx)(`div`,{className:`mt-1 text-xs leading-snug`,children:t.description})]})]},e)})})}function lg(){let e=Object.keys(sn);return(0,V.jsx)(`ul`,{className:`grid gap-2 sm:grid-cols-2`,children:e.map(e=>{let t=sn[e];return(0,V.jsxs)(`li`,{className:`rounded-[var(--radius-sm)] border border-border bg-bg p-3`,children:[(0,V.jsxs)(`div`,{className:`font-medium text-fg`,children:[`Метка «`,t.name,`» · по 4 в комплекте`]}),(0,V.jsx)(`div`,{className:`mt-1 text-xs leading-snug`,children:t.description})]},e)})})}function ug({onClose:e}){let[t,n]=(0,D.useState)(`base`);return(0,V.jsx)(`div`,{className:`fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6`,children:(0,V.jsxs)(`div`,{className:`max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8`,children:[(0,V.jsxs)(`div`,{className:`mb-4 flex items-start justify-between gap-4`,children:[(0,V.jsx)(`h2`,{className:`text-2xl`,children:`Правила`}),(0,V.jsx)(Ut,{variant:`ghost`,size:`sm`,onClick:e,children:`Закрыть`})]}),(0,V.jsx)(`div`,{role:`tablist`,"aria-label":`Раздел правил`,className:`mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4`,children:ag.map(({id:e,label:r})=>(0,V.jsx)(`button`,{type:`button`,role:`tab`,"aria-selected":t===e,onClick:()=>n(e),className:B(`h-11 rounded-[var(--radius-md)] border px-1 text-sm font-medium`,t===e?`border-accent bg-accent text-accent-fg`:`border-border bg-bg text-fg hover:bg-surface-2`),children:r},e))}),t===`base`&&(0,V.jsxs)(`div`,{className:`space-y-4 text-sm text-muted`,children:[(0,V.jsx)(`p`,{children:`Базовая русская «Эволюция» (Правильные игры, 2010). Колода 84 карты, 2–4 игрока. Побеждает тот, чья популяция набрала больше очков после последнего года.`}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Ход года`}),(0,V.jsxs)(`ol`,{className:`list-decimal space-y-2 pl-5`,children:[(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Развитие.`}),` По кругу выкладывайте по одной карте: новое животное или свойство. Свойства кладутся лицом вверх — все видят, кто что выложил. Двойные карты — одно из двух свойств. Паразит только на чужих. Парная карта (симбиоз, сотрудничество, взаимодействие) кладётся между двумя животными — на пару может лежать только одна парная карта. Пас — и больше не играете в этой фазе; когда спасовали все, фаза заканчивается.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Кормовая база.`}),` 2 игрока: 1d6+2. 3: 2d6. 4: 2d6+2.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Питание.`}),` Ход длится, пока не нажмёте «Закончить ход»: одно действие ход не отдаёт. За ход можно напасть каждым из своих хищников и/или использовать всех пиратов — либо взять одну фишку еды (накормленное животное берёт только в пустой жировой запас); если берёте еду, хищники и пираты в этот ход недоступны. Накормленное животное больше не использует свойства: не нападает, не пиратствует, не топчет, не уходит в спячку и не тратит жир. Топтуны топчут вместе с взятием еды, каждый — раз за ход. Превращение жира — свободное действие. Когда делать нечего совсем, ход передаётся сам. «Пас» выводит вас до конца фазы; фаза заканчивается, когда база пуста, все накормлены, все пасанули или никому нельзя ходить.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Вымирание.`}),` Ненакормленные погибают. Добор: число выживших + 1. Если никого нет и рука пуста — 6 карт. Пустая колода — последний год.`]})]}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Очки`}),(0,V.jsx)(`p`,{children:`2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе.`}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Свойства базовой игры`}),(0,V.jsx)(sg,{ids:og.base})]}),t===`continents`&&(0,V.jsxs)(`div`,{className:`space-y-4 text-sm text-muted`,children:[(0,V.jsx)(`p`,{children:`Дополнение «Континенты» (Правильные игры, 2012): 42 карты новых свойств. Включается в меню перед партией — все правила базовой игры остаются в силе.`}),(0,V.jsxs)(`ul`,{className:`list-decimal space-y-2 pl-5`,children:[(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Территории.`}),` Животные живут на Лавразии, в Гондване и в Океане. Выкладывая животное, выбираете континент кликом по нему; в Океан животное попадает только со свойством «Водоплавающее». В океане водность перманентна: её не снять ни неоплазией, ни рекомбинацией, ни параличом — только миграция выводит животное на континент.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Кормовые базы.`}),` У каждой территории своя база: 2 игрока — 8/7/5, три — 11/10/7, четыре — 14/13/9 (Лавразия/Гондвана/Океан). В свой ход вы привязаны к одной территории: берёте еду её базы и используете свойства животных, стоящих на ней. Хищник ест только в своей территории. «Эдификатор» добавляет 2 фишки в базу своей территории ежегодно.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Парные карты.`}),` Кладутся между двумя животными одной территории. Разъехалась пара — карта уходит в сброс.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Миграция.`}),` Объявите миграцию вместо обычного хода: ни еды, ни других свойств. Мигрирующие животные (в любом числе) переезжают: океан ↔ континенты, континент → континент напрямую нельзя. Сухопутное в океан не идёт. С мигрантом едут прилипалы — свои и чужие, даже с континента на континент.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Новые свойства.`}),` Стадность: пока стадных в локации больше, чем хищников, их нельзя есть. Стрекательные клетки: атаковавший хищник теряет все свойства до конца года (потребность 1), в океане ещё и выбрасывается на континент. Регенерация: съеденное хищником животное оставляет свойства — в вымирание владелец кладёт на них карту из руки как новое животное (добора за него нет). Рекомбинация (парная): партнёры обмениваются по одному свойству. `,(0,V.jsx)(`span`,{className:`text-virus`,children:`Неоплазия`}),` — вирус: играется на любое животное, своё или чужое, и каждый год в начале определения кормовой базы поднимается, выключая очередное непарное свойство (выключенное не работает, но очки даёт); когда выключать нечего — животное немедленно погибает. Вирусные свойства (паразит, неоплазия) помечены фиолетовым.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Спасение.`}),` Игрок без руки и животных берёт 10 карт и две сразу кладёт животными по континенту.`]})]}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Свойства дополнения`}),(0,V.jsx)(sg,{ids:og.continents})]}),t===`plants`&&(0,V.jsxs)(`div`,{className:`space-y-4 text-sm text-muted`,children:[(0,V.jsx)(`p`,{children:`Дополнение «Растения» (Правильные игры, 2016): 36 двусторонних карт — свойство растения либо свойство животного. Включается в меню перед партией, совместимо с «Континентами».`}),(0,V.jsxs)(`ul`,{className:`list-decimal space-y-2 pl-5`,children:[(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Кормовая база без кубика.`}),` Еда этого года лежит на растениях. В фазу определения базы броска нет: сразу питание. С «Континентами» растения стоят на Лавразии и Гондване, а Океан получает базу по обычным правилам. Растения общие — не принадлежат никому.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Питание.`}),` Фишка берётся с растения на животное — но только если животное способно им питаться: «Водное» растение кормит лишь водоплавающих, «Корнеплод» — норных, «Дерево» — больших. Хищники едят только с растений со значком плода и с «Питательных». Вместо еды или атаки можно занять убежище растения — жетон защищает от хищников и хищных растений до конца фазы. Пасовать нельзя, пока хоть одно ваше животное способно получить еду или убежище.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Хищное растение.`}),` Раз за фазу питания: контратакует животное, тянущее с него еду (выживший всё равно получает фишку), либо один из игроков направляет его на любое животное, которое смог бы атаковать хищник без свойств. Съело животное — 2 фишки, получило хвост — 1, съело ядовитое — гибнет в вымирание.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Вымирание.`}),` Съеденные дочиста растения погибают — кроме однолетника (выживает) и растений-паразитов (гибнут только с хозяином). Связка микориз выживает, если хоть на одном растении осталась еда. Гриб получает фишку за каждое погибшее животное.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Фаза роста.`}),` Выжившие растения разрастаются по своим схемам (многолетник 1→2, 2→3, 3+→5 и т.д.), лиана получает столько фишек, сколько на столе не-лиан, убежища восстанавливаются, из колоды выходят новые растения. Эдификатор с «Континентами» добавляет по фишке растениям своей локации.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Очки.`}),` Растения и их свойства при подсчёте не учитываются — очки дают только животные и их свойства.`]})]}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Свойства растений`}),(0,V.jsx)(sg,{ids:og.plants}),(0,V.jsx)(`p`,{className:`text-xs`,children:`Свойства животных на вторых гранях карт «Растений» — из базовой игры, смотрите их во вкладке «Базовая игра».`})]}),t===`fungi`&&(0,V.jsxs)(`div`,{className:`space-y-4 text-sm text-muted`,children:[(0,V.jsx)(`p`,{children:`Дополнение «Трава и грибы» (Правильные игры, 2019): 24 длинные карты флоры (6 грибов и 6 трав по 2 копии), 8 меток последствий и 2 новых свойства животных. Кормовая база этого года — все красные фишки на картах флоры; флора — полноправный участник партии и может победить.`}),(0,V.jsxs)(`ul`,{className:`list-decimal space-y-2 pl-5`,children:[(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Стол флоры.`}),` На старте открыты 2 карты; в фазу кормовой базы из колоды выходят карты по числу игроков (максимум 8 на столе). Гриб входит в игру с 1 красной фишкой, трава — с 3; максимум фишек на карте — 4. С «Континентами» флора живёт на Лавразии и Гондване, Океан кормится по обычным правилам.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Питание.`}),` Любое животное может брать фишки с любой травы или гриба — при взятии срабатывает способность карты. «Взаимодействие» и «Топотун» работают с картами флоры. Метки последствий: животное получает метку при взятии фишки с «меченой» карты, если не имеет такой же, если метка осталась на столе и если у него нет «Трына». Хищник, съевший добычу, получает все её метки.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Разрастание грибов.`}),` Каждый раз, когда животное погибает (в питании и в вымирании), на любой гриб кладётся 1 красная фишка.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Вымирание.`}),` Гибнут ненакормленные, отравлённые и животные с меткой «Яд» без «Антидота». С выживших снимаются все фишки и метки. Карты флоры без фишек уходят в сброс; каждая выжившая трава получает 1 фишку, грибы — только от гибели животных.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Очки.`}),` «Трава и грибы» играют сами за себя: 2 очка за каждую выжившую карту флоры и 1 за каждую фишку на ней; при равенстве очков преимущество у флоры.`]})]}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Карты флоры`}),(0,V.jsx)(cg,{}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Метки последствий`}),(0,V.jsx)(lg,{}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Свойства животных`}),(0,V.jsx)(sg,{ids:og.fungi})]}),t===`mutations`&&(0,V.jsxs)(`div`,{className:`space-y-4 text-sm text-muted`,children:[(0,V.jsxs)(`p`,{children:[`Дополнение «Случайные мутации» (по одноимённой игре Правильных игр, 2013): рука карт исчезает — у каждого игрока личная слепая колода. В фазу развития вы сначала объявляете, как разыграете верхнюю карту, и только потом её вскрываете. Свойства достаются случайно, в том числе `,(0,V.jsx)(`strong`,{className:`text-fg`,children:`вредные мутации`}),` (тёмные карты). Совместимо со всеми дополнениями.`]}),(0,V.jsxs)(`ul`,{className:`list-decimal space-y-2 pl-5`,children:[(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Личная колода.`}),` 7 карт на старте, просматривать нельзя. В свой ход развития объявите один из способов розыгрыша: (1) новый вид — карта ложится животным; (2) свойство — на свой вид из одного животного; (3) +1 животное к виду. С «Растениями» можно объявить и свойство растения — карта вскроется на выбранном растении.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Судьба свойства.`}),` Если свойство нельзя сыграть на выбранный вид, оно переезжает на соседний вид справа; если не подходит нигде — само становится новым видом-мутантом. Вредные мутации обязательны: отказаться от них нельзя.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Численность вида.`}),` Вид может состоять из нескольких животных (отмечается «×N» на карточке). Численность нельзя наращивать выше числа ваших видов — исключение «Почкование». Еда, охота, голод и яд действуют на животных по одному: атака снимает одно животное, а не весь вид.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Добор.`}),` В конце года: число животных + 2 карты на дно личной колоды. Общий запас кончился — последний год.`]}),(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`strong`,{className:`text-fg`,children:`Очки.`}),` 2 за каждое животное (с учётом численности), 1 за свойство и бонусы свойств; метаболический синдром даёт 2 дополнительных очка.`]})]}),(0,V.jsx)(`h3`,{className:`text-fg`,children:`Свойства дополнения`}),(0,V.jsx)(sg,{ids:og.mutations}),(0,V.jsx)(`p`,{className:`text-xs`,children:`Прочие свойства в слепой колоде — из базовой игры и включённых дополнений; их правила смотрите в соответствующих вкладках.`})]})]})})}function dg({scores:e,winnerIds:t,humanId:n,onAgain:r,onMenu:i}){let a=t.includes(n);return(0,V.jsxs)(`div`,{className:`fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4`,children:[(0,V.jsx)(`img`,{src:a?da.victory:da.extinction,alt:``,"aria-hidden":!0,className:`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30`}),(0,V.jsxs)(`div`,{className:`relative w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8`,children:[(0,V.jsx)(`p`,{className:`text-[11px] font-medium uppercase tracking-[0.24em] text-muted`,children:`Конец эволюции`}),(0,V.jsx)(`h2`,{className:`mt-2 text-3xl`,children:a?`Ваша популяция доминирует`:`Вас вытеснили`}),(0,V.jsx)(`ul`,{className:`mt-6 space-y-2`,children:e.map((e,n)=>(0,V.jsxs)(`li`,{className:B(`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-3`,t.includes(e.playerId)?`border-accent bg-accent/10`:`border-border bg-bg`),children:[(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`div`,{className:`font-medium`,children:[n+1,`. `,e.name]}),(0,V.jsxs)(`div`,{className:`text-xs text-muted`,children:[`животные `,e.animals,` · свойства `,e.traits,` · бонус `,e.extras,` · сброс `,e.discard]})]}),(0,V.jsx)(`div`,{className:`font-display text-2xl tabular-nums`,children:e.total})]},e.playerId))}),(0,V.jsxs)(`div`,{className:`mt-6 flex flex-col gap-2 sm:flex-row`,children:[(0,V.jsxs)(Ut,{className:`flex-1`,onClick:r,children:[(0,V.jsx)(C,{className:`size-4`}),`Ещё партия`]}),(0,V.jsx)(Ut,{variant:`secondary`,className:`flex-1`,onClick:i,children:`В меню`})]})]})]})}var fg={kill:`border-danger/70`,escape:`border-good/60`,death:`border-danger/60`,info:`border-border-strong`,plant:`border-leaf/60`};function pg(e,t){let n=U(e,t);if(!n)return null;let r=e.players.find(e=>e.id===n.ownerId),i=(r?.animals.findIndex(e=>e.id===t)??-1)+1;return{owner:r?.name??`—`,no:i||1,art:la({swimming:W(n,`swimming`),carnivore:W(n,`carnivore`),bulky:W(n,`highBodyWeight`)})}}function mg(e){return e?`${e.owner}: №${e.no}`:`животное`}function hg(e,t,n){let r=[],i=n=>pg(e,n)??t.get(n)??null;for(let t of e.lastEvents)switch(t.kind){case`diceRoll`:r.push({id:n(),tone:`info`,title:`Кормовая база`,dice:t.dice,note:`Еды на этот год: ${t.total}`,ms:2900});break;case`preyKilled`:{let e=i(t.carnivoreId),a=i(t.preyId);r.push({id:n(),tone:`kill`,title:`Добыча убита`,note:`${mg(e)} съедает ${mg(a)}`,cubes:[{tone:`blue`,n:2}],versus:{left:e?.art,right:a?.art,strike:!0},ms:3e3});break}case`defenseUsed`:{let e=i(t.preyId);if(t.defense===`running`){let i=(t.roll??0)>=4;r.push({id:n(),tone:i?`escape`:`kill`,title:`Быстрое — бросок кубика`,note:`${mg(e)} пытается убежать`,dice:[t.roll??1],verdict:{good:i,text:i?`Спаслось!`:`Хищник догнал!`},versus:{left:sa.running,right:e?.art},ms:3400})}else t.defense===`tailLoss`?r.push({id:n(),tone:`escape`,title:`Отбросить хвост`,note:`${mg(e)} выживает`,cubes:[{tone:`blue`,n:1}],versus:{left:sa.tailLoss,right:e?.art},ms:2800}):t.defense===`mimicry`&&r.push({id:n(),tone:`info`,title:`Мимикрия`,note:`Атака перенаправлена на другое животное`,versus:{left:sa.mimicry,right:e?.art},ms:2400});break}case`plantAttack`:{let a=i(t.preyId),o=(e.plants??[]).find(e=>e.id===t.plantId);r.push({id:n(),tone:`plant`,title:t.counter?`Контратака растения`:`Хищное растение`,note:`${t.counter?`Растение бьёт по нападавшему`:`Растение ловит ${mg(a).toLowerCase()}`}`,versus:{left:o?ha[o.kind]:ha.carnivorous,right:a?.art,strike:!0},ms:2500});break}case`paralyzed`:{let e=i(t.carnivoreId);r.push({id:n(),tone:`info`,title:`Паралич`,note:`${mg(e)} не может атаковать в этом году`,versus:{left:sa.nematocysts,right:e?.art},ms:2300});break}}let a=e.lastEvents.filter(e=>e.kind===`animalDied`);if(a.length){let e=a.filter(e=>e.kind===`animalDied`&&e.cause===`starved`).length;r.push({id:n(),tone:`death`,title:`Вымирание`,note:a.length===1?`Погибло животное${e===0?` — не от голода`:` от голода`}`:`Погибло животных: ${a.length}${e?` (от голода — ${e})`:``}`,versus:{left:ua},ms:2700})}return r}function gg(){let e=q(e=>e.state),t=q(e=>e.speed),n=t===`slow`?1.5:t===`fast`?.6:1,[r,i]=(0,D.useState)([]),[a,o]=(0,D.useState)(null),[s,c]=(0,D.useState)(!1),l=(0,D.useRef)(-1),u=(0,D.useRef)(0),d=(0,D.useRef)(new Map);return(0,D.useEffect)(()=>{if(e)for(let t of e.players)t.animals.forEach((e,n)=>{d.current.set(e.id,{owner:t.name,no:n+1,art:la({swimming:W(e,`swimming`),carnivore:W(e,`carnivore`),bulky:W(e,`highBodyWeight`)})})})},[e]),(0,D.useEffect)(()=>{if(!e||e.eventSeq===l.current)return;l.current=e.eventSeq;let t=hg(e,d.current,()=>(u.current+=1,u.current));t.length&&i(e=>[...e,...t].slice(-4))},[e]),(0,D.useEffect)(()=>{a||r.length===0||(o(r[0]),i(e=>e.slice(1)))},[a,r]),(0,D.useEffect)(()=>{if(!a)return;let e=Math.max(1500,a.ms*n),t=setTimeout(()=>c(!0),Math.max(0,e-280)),r=setTimeout(()=>{o(null),c(!1)},e);return()=>{clearTimeout(t),clearTimeout(r)}},[a,n]),a?(0,V.jsxs)(`div`,{role:`status`,"aria-live":`polite`,className:`fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6`,onClick:()=>{o(null),c(!1)},children:[(0,V.jsx)(`div`,{className:`spotlight-backdrop absolute inset-0`}),(0,V.jsx)(_g,{item:a,closing:s},a.id)]}):null}function _g({item:e,closing:t}){let[n,r]=(0,D.useState)(e.dice?`roll`:`result`);return(0,D.useEffect)(()=>{if(!e.dice)return;let t=setTimeout(()=>r(`result`),1150);return()=>clearTimeout(t)},[e]),(0,V.jsxs)(`article`,{className:B(`spotlight-card grain relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden border bg-surface px-6 py-10 text-center shadow-[var(--shadow-card)] sm:h-auto sm:max-w-md sm:rounded-[var(--radius-xl)] sm:px-8 sm:py-9`,fg[e.tone],t&&`spotlight-out`),children:[(0,V.jsx)(`h2`,{className:`font-display text-2xl leading-tight sm:text-[1.7rem]`,children:e.title}),e.versus?(0,V.jsxs)(`div`,{className:`flex items-center gap-4`,children:[e.versus.left?(0,V.jsx)(`img`,{src:e.versus.left,alt:``,className:`size-20 rounded-full border border-border object-cover object-top shadow-[var(--shadow-card)] sm:size-24`}):null,e.versus.left&&e.versus.right?e.versus.strike?(0,V.jsx)(`span`,{className:`grid size-10 place-items-center rounded-full border border-danger/60 bg-danger/20 text-clay`,children:(0,V.jsx)(w,{className:`size-5`})}):(0,V.jsx)(`span`,{className:`grid size-10 place-items-center rounded-full border border-border-strong bg-bg/60 text-muted`,children:(0,V.jsx)(T,{className:`size-5`})}):null,e.versus.right?(0,V.jsx)(`img`,{src:e.versus.right,alt:``,className:B(`size-20 rounded-full border border-border object-cover object-top shadow-[var(--shadow-card)] sm:size-24`,e.versus.strike&&`grayscale`)}):null]}):null,e.dice?(0,V.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,V.jsx)(Qh,{values:e.dice,rolling:n===`roll`,dieSize:64,ariaLabel:`Кубик: ${e.dice.join(`, `)}`}),e.verdict?(0,V.jsx)(`span`,{className:B(`font-display text-xl leading-none`,n===`result`?`pop-in`:`opacity-0`,e.verdict.good?`text-good`:`text-clay`),children:e.verdict.text}):null]}):null,e.cubes?.length?(0,V.jsx)(`div`,{className:`flex items-center gap-2`,children:e.cubes.flatMap(e=>Array.from({length:e.n}).map((t,n)=>(0,V.jsx)(vo,{tone:e.tone,className:`pop-in size-6`},`${e.tone}-${n}`)))}):null,e.note?(0,V.jsx)(`p`,{className:`max-w-[34ch] text-sm leading-snug text-muted`,children:e.note}):null,(0,V.jsx)(`span`,{className:`absolute bottom-4 text-[10px] uppercase tracking-[0.18em] text-subtle`,children:`нажмите, чтобы продолжить`})]})}var vg={development:`Развитие`,foodBank:`Кормовая база`,feeding:`Питание`,extinction:`Вымирание`,growth:`Рост`,gameOver:`Итог`},yg={slow:`Медленно`,normal:`Обычно`,fast:`Быстро`},bg={highlight:!1,dimmed:!1,selected:!1},xg={attack:`border-danger/70 bg-danger/25 text-clay`,good:`border-good/60 bg-good/25 text-good`,bad:`border-danger/60 bg-danger/15 text-clay`,info:`border-border-strong bg-surface text-fg`};function Sg(e){e&&(e.classList.remove(`anim-shake`),e.offsetWidth,e.classList.add(`anim-shake`),setTimeout(()=>e.classList.remove(`anim-shake`),600))}function Cg(e){let[t,n]=(0,D.useState)([]),r=(0,D.useRef)(0),i=(0,D.useRef)(0);return(0,D.useEffect)(()=>{if(!e||e.eventSeq===r.current)return;r.current=e.eventSeq;let t=e=>{if(!e)return{x:window.innerWidth/2,y:window.innerHeight/3};let t=e.getBoundingClientRect();return{x:Math.round(t.left+t.width/2),y:Math.round(t.top+6)}},a=e=>document.querySelector(`[data-animal-id="${e}"]`),o=e=>document.querySelector(`[data-plant-id="${e}"]`),s=e=>document.querySelector(`[data-flora-id="${e}"]`),c=e=>document.querySelector(`[data-player-section="${e}"]`),l=[],u=(e,t,n)=>{i.current+=1,l.push({id:i.current,...e,text:t,tone:n})};for(let n of e.lastEvents)switch(n.kind){case`huntDeclared`:Sg(a(n.carnivoreId)),Sg(a(n.preyId)),u(t(a(n.preyId)??a(n.carnivoreId)),`Атака!`,`attack`);break;case`preyKilled`:u(t(a(n.carnivoreId)),`добыча съедена +2 синие`,`attack`);break;case`defenseUsed`:{let e=a(n.preyId);n.defense===`tailLoss`?(Sg(e),u(t(e),`− хвост`,`bad`)):n.defense===`running`?(Sg(e),u(t(e),`кубик ${n.roll}`,`info`)):n.defense===`mimicry`&&u(t(e),`мимикрия →`,`info`);break}case`foodFromBank`:u(t(a(n.animalId)),`+1 красная`,`good`);break;case`blueFood`:{let e=n.reason===`piracy`?`пиратство +1 синяя`:n.reason===`cooperation`?`сотрудничество +1 синяя`:n.reason===`scavenger`?`падальщик +1 синяя`:n.reason===`fat`?`жир → синие`:n.reason===`tailLoss`?`+1 синяя`:null;e&&u(t(a(n.animalId)),e,`info`);break}case`bankBurned`:u(t(document.querySelector(`.felt`)),`−${n.amount} база`,`bad`);break;case`plantFoodTaken`:u(t(a(n.animalId)),`+1 с растения`,`good`);break;case`shelterTaken`:u(t(a(n.animalId)),`в убежище`,`good`);break;case`plantAttack`:Sg(a(n.preyId)),u(t(a(n.preyId)),n.counter?`растение контратакует!`:`хищное растение!`,`attack`);break;case`plantGrew`:u(t(o(n.plantId)),`рост ${n.from}→${n.to}`,`good`);break;case`plantGrazed`:u(t(o(n.plantId)),`− топтун`,`bad`);break;case`plantDied`:u(t(o(n.plantId)),`☠ растение`,`bad`);break;case`cardStolen`:u(t(c(n.toPlayerId)),`+1 карта (медонос)`,`info`);break;case`floraFoodTaken`:u(t(a(n.animalId)),`+1 с флоры`,`good`);break;case`floraGrew`:u(t(s(n.floraId)),`гриб ${n.from}→${n.to}`,`info`);break;case`floraGrazed`:u(t(s(n.floraId)),`− топтун`,`bad`);break;case`floraDied`:u(t(s(n.floraId)),`☠ флора`,`bad`);break;case`markGained`:u(t(a(n.animalId)),`метка: ${n.mark===`poison`?`яд`:n.mark}`,`bad`);break;case`handLost`:u(t(c(n.playerId)),`рука сброшена (прозрение)`,`bad`);break;case`cardsDrawn`:for(let e=0;e<n.counts.length;e++){let r=n.counts[e];r>0&&u(t(c(e)),`+${r} ${r===1?`карта`:r<5?`карты`:`карт`}`,`info`)}}if(e.lastEvents.some(e=>e.kind===`animalDied`)){let n=document.querySelector(`.felt`);if(n){let r=e.lastEvents.filter(e=>e.kind===`animalDied`).length;u(t(n),`☠ ${r}`,`bad`),n.classList.remove(`anim-felt-flash`),n.offsetWidth,n.classList.add(`anim-felt-flash`),setTimeout(()=>n.classList.remove(`anim-felt-flash`),1e3)}}if(l.length){n(e=>[...e,...l]);let e=new Set(l.map(e=>e.id));setTimeout(()=>n(t=>t.filter(t=>!e.has(t.id))),1750)}},[e]),t}function wg(){let e=q(e=>e.state);(0,D.useEffect)(()=>{let e=po();e!==`normal`&&q.getState().setSpeed(e)},[]);let t=q(e=>e.rulesOpen),n=q(e=>e.start),r=q(e=>e.reset),i=q(e=>e.setRulesOpen),a=q(e=>e.mode),o=q(e=>e.net),s=q(e=>e.netAgain),c=q(e=>e.leaveNet);return a===`net`?!o||o.status===`lobby`||o.status===`connecting`?(0,V.jsxs)(V.Fragment,{children:[o?.status===`connecting`&&!e?(0,V.jsx)(`p`,{className:`grid min-h-dvh place-items-center text-sm text-muted`,children:`Открываем стол…`}):(0,V.jsx)(tg,{}),t?(0,V.jsx)(ug,{onClose:()=>i(!1)}):null]}):(0,V.jsxs)(`div`,{className:`flex min-h-dvh flex-col`,children:[o.status===`reconnecting`?(0,V.jsx)(`div`,{className:`fixed inset-x-0 top-14 z-40 mx-auto w-fit rounded-full border border-danger/50 bg-danger/15 px-4 py-1.5 text-sm text-clay`,children:`Переподключение…`}):null,e?(0,V.jsx)(Tg,{}):(0,V.jsx)(`p`,{className:`grid min-h-dvh place-items-center text-sm text-muted`,children:`Загружаем партию…`}),e?.phase===`gameOver`&&e.scores?(0,V.jsx)(dg,{scores:e.scores,winnerIds:e.winnerIds??[],humanId:e.humanId,onAgain:()=>void s(),onMenu:c}):null,t?(0,V.jsx)(ug,{onClose:()=>i(!1)}):null]}):e?(0,V.jsxs)(`div`,{className:`flex min-h-dvh flex-col`,children:[(0,V.jsx)(Tg,{}),e.phase===`gameOver`&&e.scores?(0,V.jsx)(dg,{scores:e.scores,winnerIds:e.winnerIds??[],humanId:e.humanId,onAgain:()=>n(e.players.length,e.difficulty),onMenu:r}):null,t?(0,V.jsx)(ug,{onClose:()=>i(!1)}):null]}):(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(ig,{onStart:n,onRules:()=>i(!0)}),t?(0,V.jsx)(ug,{onClose:()=>i(!1)}):null]})}function Tg(){let e=q(e=>e.state),t=q(e=>e.thinking),n=q(e=>e.thinkingWho),r=q(e=>e.intent),i=q(e=>e.logOpen),a=q(e=>e.speed),o=q(e=>e.dispatch),s=q(e=>e.setIntent),c=q(e=>e.setLogOpen),l=q(e=>e.setRulesOpen),u=q(e=>e.setSpeed),d=q(e=>e.reset),f=q(e=>e.mode),m=Cn(e,e.humanId),h=oa(e),g=h?.id===m.id&&e.madTurn!==m.id,v=(0,D.useMemo)(()=>e.phase===`feeding`&&g&&!e.pendingAttack?Nr(e,m.id):[],[e,g,m.id]),y=(0,D.useMemo)(()=>e.phase===`development`&&g?Cr(e,m.id):[],[e,g,m.id]),x=(0,D.useMemo)(()=>e.pendingAttack&&e.pendingAttack.waitingFor===m.id?Rr(e,m.id):[],[e,m.id]),S=(0,D.useMemo)(()=>{let t=new Map;for(let n of e.players)for(let i of n.animals){let n=Dg(e,i,r,g,v,y);t.set(i.id,{highlight:n,dimmed:r.kind!==`none`&&!n,selected:r.kind===`playPair`&&r.first===i.id||r.kind===`hunt`&&r.carnivoreId===i.id||r.kind===`pirate`&&r.pirateId===i.id})}return t},[e,r,g,v,y]),C=(0,D.useCallback)(e=>S.get(e.id)??bg,[S]),w=!!e.modules.plants,T=!!e.modules.fungi,E=(0,D.useMemo)(()=>{let t=new Set;if(!w)return t;if(e.phase===`development`){if(r.kind===`playPlantTrait`)for(let e of y)e.type===`devPlayPlantTrait`&&e.cardId===r.cardId&&e.face===r.face&&t.add(e.plantId);else if(r.kind===`playPlantPair`)for(let e of y)e.type===`devPlayPlantPair`&&e.cardId===r.cardId&&e.face===r.face&&(!r.first||e.a===r.first)&&t.add(r.first?e.b:e.a);else if(r.kind===`mutatePlant`)for(let e of y)e.type===`devMutate`&&e.intent===`plant`&&e.plantId&&t.add(e.plantId)}else if(e.phase===`feeding`&&g){if((r.kind===`takePlant`||r.kind===`takeFlora`)&&r.animalId)for(let e of v)e.type===`feedTakePlant`&&e.animalId===r.animalId&&t.add(e.plantId);else if(r.kind===`shelter`&&r.animalId)for(let e of v)e.type===`feedShelter`&&e.animalId===r.animalId&&t.add(e.plantId);else if(r.kind===`plantAttack`){if(r.plantId)t.add(r.plantId);else for(let e of v)e.type===`feedPlantAttack`&&t.add(e.plantId)}else if(r.kind===`parasitize`)for(let e of v)e.type===`feedParasitize`&&t.add(e.parasiteId);else if(r.kind===`graze`&&r.animalId)for(let e of v)e.type===`feedGraze`&&e.animalId===r.animalId&&e.plantId&&t.add(e.plantId)}return t},[w,e.phase,r,y,v,g]),O=(0,D.useMemo)(()=>{let t=new Set;if(!T||e.phase!==`feeding`||!g)return t;if((r.kind===`takeFlora`||r.kind===`takePlant`)&&r.animalId)for(let e of v)e.type===`feedTakeFlora`&&e.animalId===r.animalId&&t.add(e.floraId);else if(r.kind===`graze`&&r.animalId)for(let e of v)e.type===`feedGraze`&&e.animalId===r.animalId&&e.floraId&&t.add(e.floraId);return t},[T,e.phase,r,v,g]);function ee(t){if(!g||e.pendingAttack)return;let n=e=>o(e);if(e.phase===`development`){if(r.kind===`playPlantTrait`){y.some(e=>e.type===`devPlayPlantTrait`&&e.cardId===r.cardId&&e.face===r.face&&e.plantId===t.id)&&n({type:`devPlayPlantTrait`,cardId:r.cardId,face:r.face,plantId:t.id});return}if(r.kind===`playPlantPair`){if(!r.first){s({...r,first:t.id});return}y.some(e=>e.type===`devPlayPlantPair`&&e.cardId===r.cardId&&e.face===r.face&&e.a===r.first&&e.b===t.id)&&n({type:`devPlayPlantPair`,cardId:r.cardId,face:r.face,a:r.first,b:t.id});return}r.kind===`mutatePlant`&&y.some(e=>e.type===`devMutate`&&e.intent===`plant`&&e.plantId===t.id)&&n({type:`devMutate`,intent:`plant`,plantId:t.id});return}if(e.phase===`feeding`){if((r.kind===`takePlant`||r.kind===`takeFlora`)&&r.animalId){v.some(e=>e.type===`feedTakePlant`&&e.animalId===r.animalId&&e.plantId===t.id)&&n({type:`feedTakePlant`,animalId:r.animalId,plantId:t.id});return}if(r.kind===`shelter`&&r.animalId){v.some(e=>e.type===`feedShelter`&&e.animalId===r.animalId&&e.plantId===t.id)&&n({type:`feedShelter`,animalId:r.animalId,plantId:t.id});return}if(r.kind===`plantAttack`){r.plantId||v.some(e=>e.type===`feedPlantAttack`&&e.plantId===t.id)&&s({kind:`plantAttack`,plantId:t.id});return}if(r.kind===`parasitize`){let e=v.find(e=>e.type===`feedParasitize`&&e.parasiteId===t.id);e&&e.type===`feedParasitize`&&n(e);return}r.kind===`graze`&&r.animalId&&v.some(e=>e.type===`feedGraze`&&e.animalId===r.animalId&&e.plantId===t.id)&&n({type:`feedGraze`,animalId:r.animalId,plantId:t.id})}}function k(t){if(!(!g||e.pendingAttack)&&e.phase===`feeding`){if((r.kind===`takeFlora`||r.kind===`takePlant`)&&r.animalId){v.some(e=>e.type===`feedTakeFlora`&&e.animalId===r.animalId&&e.floraId===t.id)&&o({type:`feedTakeFlora`,animalId:r.animalId,floraId:t.id});return}r.kind===`graze`&&r.animalId&&v.some(e=>e.type===`feedGraze`&&e.animalId===r.animalId&&e.floraId===t.id)&&o({type:`feedGraze`,animalId:r.animalId,floraId:t.id})}}function te(t){let n=t.target.closest(`[data-animal-id]`);if(!n||!g||e.pendingAttack)return;let i=U(e,n.getAttribute(`data-animal-id`));i&&Eg(i,{state:e,intent:r,isHumanTurn:g,human:m,feedActs:v,devActs:y,dispatch:o,setIntent:s})}let ne=e.players.filter(e=>e.id!==m.id),A=(0,D.useMemo)(()=>{let e=[],t=[],n=[],r=[];if(ne.length===1)e.push(ne[0]);else if(ne.length===2)t.push(ne[0]),n.push(ne[1]);else{let i=[e,t,n,e,t,n,r,r];ne.forEach((e,t)=>i[Math.min(t,i.length-1)].push(e))}return{top:e,left:t,right:n,bottom:r}},[ne]),j=A.left.length>0||A.right.length>0,re=e.log[e.log.length-1]?.text,M=(0,D.useMemo)(()=>new Set(e.extinctionDeaths),[e.extinctionDeaths]),ie=Cg(e);return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`div`,{"aria-hidden":!0,className:`paper-desk pointer-events-none fixed inset-0 -z-10 opacity-[0.14]`}),(0,V.jsx)(`div`,{"aria-hidden":!0,className:`pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.07]`,style:{backgroundImage:`url(${da.valley})`}}),(0,V.jsxs)(`header`,{className:`sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2.5 backdrop-blur-sm sm:px-5`,children:[(0,V.jsx)(`img`,{src:fa,alt:``,className:`size-8 shrink-0 rounded-full border border-border object-cover`}),(0,V.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,V.jsx)(`div`,{className:`font-display text-lg leading-none`,children:`Эволюция`}),(0,V.jsxs)(`div`,{className:`mt-1 truncate text-xs text-muted`,children:[`Год `,e.year,e.lastYear?` · последний`:``,` · `,vg[e.phase],h?` · ${h.name}`:``]})]}),f===`solo`?(0,V.jsx)(`div`,{className:`hidden items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1 md:flex`,role:`group`,"aria-label":`Скорость игры`,children:[`slow`,`normal`,`fast`].map(e=>(0,V.jsx)(`button`,{type:`button`,onClick:()=>u(e),className:B(`rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors duration-[var(--motion-fast)]`,a===e?`bg-accent text-accent-fg`:`text-muted hover:text-fg`),children:yg[e]},e))}):null,(0,V.jsx)(Pg,{count:e.foodBank,visible:e.phase===`feeding`||e.phase===`foodBank`}),(0,V.jsxs)(`div`,{className:`flex gap-1`,children:[(0,V.jsx)(Ut,{variant:`ghost`,size:`icon`,"aria-label":`Журнал`,onClick:()=>c(!i),children:(0,V.jsx)(_,{className:`size-4`})}),(0,V.jsx)(Ut,{variant:`ghost`,size:`icon`,"aria-label":`Правила`,onClick:()=>l(!0),children:(0,V.jsx)(p,{className:`size-4`})}),(0,V.jsx)(Ut,{variant:`ghost`,size:`icon`,"aria-label":`Меню`,onClick:d,children:(0,V.jsx)(b,{className:`size-4`})})]})]}),(0,V.jsxs)(`main`,{onClick:te,className:B(`flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5`,j&&(w||T)&&`lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-4 lg:[grid-template-areas:'plants_plants_plants''top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']`,j&&!w&&!T&&`lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-4 lg:[grid-template-areas:'top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']`,!j&&`lg:mx-auto lg:w-full lg:max-w-4xl`,e.phase===`extinction`?`extinction-glow`:``),children:[w||T?(0,V.jsx)(`div`,{style:j?{gridArea:`plants`}:void 0,className:`flex flex-col gap-2`,children:e.modules.continents?[`gondwana`,`laurasia`].map(t=>(0,V.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[w?(0,V.jsx)(Lo,{state:e,zone:t,highlights:E,onPlantClick:ee,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0}):null,T?(0,V.jsx)(Do,{state:e,zone:t,highlights:O,onFloraClick:k}):null]},t)):(0,V.jsxs)(V.Fragment,{children:[w?(0,V.jsx)(Lo,{state:e,highlights:E,onPlantClick:ee,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0}):null,T?(0,V.jsx)(Do,{state:e,highlights:O,onFloraClick:k}):null]})}):null,A.top.length?(0,V.jsx)(`div`,{style:j?{gridArea:`top`}:void 0,className:B(`grid gap-3`,A.top.length>1&&`lg:grid-cols-2`),children:A.top.map(r=>(0,V.jsx)(Og,{p:r,actorId:h?.id??null,thinking:t&&n===r.id,interactions:C,dying:M,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0,continents:!!e.modules.continents},r.id))}):null,(0,V.jsx)(`div`,{style:j?{gridArea:`left`}:void 0,className:B(j&&`lg:min-w-0`),children:A.left.map(r=>(0,V.jsx)(Og,{p:r,actorId:h?.id??null,thinking:t&&n===r.id,interactions:C,dying:M,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0,continents:!!e.modules.continents},r.id))}),(0,V.jsx)(Ag,{style:j?{gridArea:`felt`}:void 0,year:e.year,lastYear:e.lastYear,phase:e.phase,bank:e.foodBank,territoryFood:e.modules.continents?e.territoryFood:void 0,deckLeft:e.deckCount??e.deck.length,foodRoll:e.foodRoll,lastLog:re,actorName:h?.name,deaths:e.extinctionDeaths.length,plantsInfo:w?{count:(e.plants??[]).length,food:(e.plants??[]).reduce((e,t)=>e+t.food,0),shelters:(e.plants??[]).reduce((e,t)=>e+t.shelters,0),deck:e.plantDeckCount??e.plantDeck?.length??0}:void 0,floraInfo:T?{count:(e.flora??[]).length,food:(e.flora??[]).reduce((e,t)=>e+t.food,0),deck:e.floraDeckCount??e.floraDeck?.length??0}:void 0}),(0,V.jsx)(`div`,{style:j?{gridArea:`right`}:void 0,className:B(j&&`lg:min-w-0`),children:A.right.map(r=>(0,V.jsx)(Og,{p:r,actorId:h?.id??null,thinking:t&&n===r.id,interactions:C,dying:M,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0,continents:!!e.modules.continents},r.id))}),A.bottom.length?(0,V.jsx)(`div`,{style:j?{gridArea:`bottom`}:void 0,className:B(`grid gap-3`,A.bottom.length>1&&`lg:grid-cols-2`),children:A.bottom.map(r=>(0,V.jsx)(Og,{p:r,actorId:h?.id??null,thinking:t&&n===r.id,interactions:C,dying:M,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0,continents:!!e.modules.continents},r.id))}):null,(0,V.jsx)(Og,{p:m,isHuman:!0,actorId:h?.id??null,thinking:!1,interactions:C,dying:M,freshSince:e.phase===`development`?e.devStartPlaySeq:void 0,continents:!!e.modules.continents,style:j?{gridArea:`human`}:void 0})]}),i?(0,V.jsx)(`ol`,{className:`fixed inset-x-3 bottom-20 z-30 max-h-44 space-y-1 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-xs text-muted shadow-[var(--shadow-card)] backdrop-blur-sm sm:left-auto sm:right-5 sm:w-96`,children:[...e.log].reverse().slice(0,24).map(e=>(0,V.jsx)(`li`,{className:B(e.tone===`bad`&&`text-clay`,e.tone===`good`&&`text-good`,e.tone===`hunt`&&`text-fg`),children:e.text},e.id))}):null,(0,V.jsx)(`footer`,{className:`sticky bottom-0 z-20 border-t border-border bg-bg/95 px-3 py-3 backdrop-blur-sm sm:px-5`,children:e.phase===`development`?e.modules.randomMutations?(0,V.jsx)(Fg,{human:m,intent:r,disabled:!g||!!e.pendingAttack,continents:!!e.modules.continents,canPlant:!!e.modules.plants,onNewAnimal:e=>o({type:`devMutate`,intent:`newAnimal`,zoneId:e}),onTrait:()=>s({kind:`mutateTrait`}),onPop:()=>s({kind:`mutatePop`}),onPlant:()=>s({kind:`mutatePlant`}),onPass:()=>o({type:`devPass`})}):(0,V.jsx)(Ig,{human:m,intent:r,disabled:!g||!!e.pendingAttack,continents:!!e.modules.continents,onPlayAnimal:(e,t)=>o({type:`devPlayAnimal`,cardId:e,zoneId:t}),onPlaceAnimal:e=>s({kind:`placeAnimal`,cardId:e}),onPickTrait:(e,t)=>{let n=m.hand.find(t=>t.id===e)?.faces[t];if(!n)return;let r=H[n];if(r.plantTrait){s(n===`micorrhiza`?{kind:`playPlantPair`,cardId:e,face:t}:{kind:`playPlantTrait`,cardId:e,face:t});return}r.isPair?s({kind:`playPair`,cardId:e,face:t}):s({kind:`playTrait`,cardId:e,face:t})},onPass:()=>o({type:`devPass`})}):e.phase===`feeding`&&g&&!e.pendingAttack?(0,V.jsx)(Lg,{acts:v,intentKind:r.kind,bank:e.foodBank,rageTurn:e.rageTurn??null,onIntent:s,onEndTurn:()=>o({type:`feedEndTurn`}),onSkip:()=>o({type:`feedSkip`})}):(0,V.jsx)(`div`,{className:`flex h-14 items-center justify-center text-sm text-muted`,children:e.phase===`foodBank`?w||T?`Кормовая база Океана определяется…`:e.foodRoll?`Кубики брошены — кормовая база определяется…`:`Бросок кормовой базы…`:e.phase===`extinction`?`Вымирание: ненакормленные животные погибают…`:e.phase===`growth`?`Рост: растения разрастаются, добавляются новые…`:e.madTurn===(h?.id??-2)?`Безумие: раунд ${h?.name??``} проводит сосед справа…`:f===`net`&&h&&h.id!==m.id?`${h.name} ходит…`:t?`${h?.name??`Соперник`} думает…`:`Ожидание`})}),ie.map(e=>(0,V.jsx)(`div`,{style:{left:e.x,top:e.y},className:B(`fx-badge rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[var(--shadow-card)] backdrop-blur-sm`,xg[e.tone]),children:e.text},e.id)),(0,V.jsx)(gg,{}),e.pendingAttack&&e.pendingAttack.waitingFor===m.id?(0,V.jsx)(Rg,{acts:x,onPick:e=>o(e)}):null]})}function Eg(e,t){let{state:n,intent:r,human:i,feedActs:a,devActs:o,dispatch:s,setIntent:c}=t;if(!n.pendingAttack){if(n.phase===`development`){if(r.kind===`mutateTrait`){o.some(t=>t.type===`devMutate`&&t.intent===`trait`&&t.animalId===e.id)&&s({type:`devMutate`,intent:`trait`,animalId:e.id});return}if(r.kind===`mutatePop`){o.some(t=>t.type===`devMutate`&&t.intent===`population`&&t.animalId===e.id)&&s({type:`devMutate`,intent:`population`,animalId:e.id});return}if(r.kind===`playTrait`){o.some(t=>t.type===`devPlayTrait`&&t.cardId===r.cardId&&t.face===r.face&&t.animalId===e.id)&&s({type:`devPlayTrait`,cardId:r.cardId,face:r.face,animalId:e.id});return}if(r.kind===`playPair`){if(!r.first){if(e.ownerId!==i.id)return;c({...r,first:e.id});return}o.some(t=>t.type===`devPlayPair`&&t.cardId===r.cardId&&t.a===r.first&&t.b===e.id)&&s({type:`devPlayPair`,cardId:r.cardId,face:r.face,a:r.first,b:e.id});return}return}if(n.phase===`feeding`){if(r.kind===`takePlant`||r.kind===`takeFlora`){if(r.animalId)return;let t=a.filter(t=>(t.type===`feedTakePlant`||t.type===`feedTakeFlora`||t.type===`feedTake`)&&t.animalId===e.id);t.length===1?s(t[0]):t.length>1&&c({kind:n.modules.fungi?`takeFlora`:`takePlant`,animalId:e.id});return}if(r.kind===`shelter`){if(r.animalId)return;let t=a.filter(t=>t.type===`feedShelter`&&t.animalId===e.id);t.length===1?s(t[0]):t.length>1&&c({kind:`shelter`,animalId:e.id});return}if(r.kind===`plantAttack`&&r.plantId){a.some(t=>t.type===`feedPlantAttack`&&t.plantId===r.plantId&&t.preyId===e.id)&&s({type:`feedPlantAttack`,plantId:r.plantId,preyId:e.id});return}if(r.kind===`graze`){if(r.animalId)return;let t=a.filter(t=>t.type===`feedGraze`&&t.animalId===e.id);t.length===1?s(t[0]):t.length>1&&c({...r,animalId:e.id});return}if(r.kind===`hunt`){if(!r.carnivoreId){let t=n.rageTurn?e.id===n.rageTurn.animalId:!1;e.ownerId===i.id&&(t||W(e,`carnivore`))&&c({kind:`hunt`,carnivoreId:e.id});return}a.some(t=>t.type===`feedHunt`&&t.carnivoreId===r.carnivoreId&&t.preyId===e.id)&&s({type:`feedHunt`,carnivoreId:r.carnivoreId,preyId:e.id});return}if(r.kind===`pirate`){if(!r.pirateId){e.ownerId===i.id&&W(e,`piracy`)&&c({kind:`pirate`,pirateId:e.id});return}a.some(t=>t.type===`feedPirate`&&t.pirateId===r.pirateId&&t.targetId===e.id)&&s({type:`feedPirate`,pirateId:r.pirateId,targetId:e.id});return}if(r.kind===`hibernate`){a.some(t=>t.type===`feedHibernate`&&t.animalId===e.id)&&s({type:`feedHibernate`,animalId:e.id});return}if(r.kind===`fat`){let t=a.find(t=>t.type===`feedConvertFat`&&t.animalId===e.id);t&&t.type===`feedConvertFat`&&s(t);return}(r.kind===`take`||r.kind===`none`)&&a.some(t=>t.type===`feedTake`&&t.animalId===e.id)&&s({type:`feedTake`,animalId:e.id})}}}function Dg(e,t,n,r,i,a){if(!r)return!1;if(n.kind===`playTrait`)return a.some(e=>e.type===`devPlayTrait`&&e.cardId===n.cardId&&e.face===n.face&&e.animalId===t.id);if(n.kind===`mutateTrait`)return a.some(e=>e.type===`devMutate`&&e.intent===`trait`&&e.animalId===t.id);if(n.kind===`mutatePop`)return a.some(e=>e.type===`devMutate`&&e.intent===`population`&&e.animalId===t.id);if(n.kind===`playPair`)return n.first?a.some(e=>e.type===`devPlayPair`&&e.a===n.first&&e.b===t.id):t.ownerId===e.humanId;if(e.phase!==`feeding`)return!1;if(n.kind===`hunt`&&n.carnivoreId){let r=U(e,n.carnivoreId);return!!(r&&(e.rageTurn?Gn(e,r,t):Vn(e,r,t)))}if(n.kind===`hunt`&&!n.carnivoreId)return e.rageTurn?e.rageTurn.animalId===t.id:t.ownerId===e.humanId&&W(t,`carnivore`);if(n.kind===`pirate`&&n.pirateId)return i.some(e=>e.type===`feedPirate`&&e.targetId===t.id);if((n.kind===`takePlant`||n.kind===`takeFlora`)&&!n.animalId)return i.some(e=>(e.type===`feedTakePlant`||e.type===`feedTakeFlora`||e.type===`feedTake`)&&e.animalId===t.id);if((n.kind===`takePlant`||n.kind===`takeFlora`)&&n.animalId)return i.some(e=>e.type===`feedTakePlant`&&e.animalId===n.animalId&&t.id===n.animalId)||i.some(e=>e.type===`feedTakeFlora`&&e.animalId===n.animalId&&t.id===n.animalId);if(n.kind===`shelter`&&!n.animalId)return i.some(e=>e.type===`feedShelter`&&e.animalId===t.id);if(n.kind===`plantAttack`&&n.plantId){let r=e.plants?.find(e=>e.id===n.plantId);return!!(r&&Xn(e,r,t))}return n.kind===`plantAttack`&&!n.plantId?!1:n.kind===`graze`&&!n.animalId?i.some(e=>e.type===`feedGraze`&&e.animalId===t.id):n.kind===`take`||n.kind===`none`?t.ownerId===e.humanId&&zn(e,t)&&e.foodBank>0:n.kind===`hibernate`?i.some(e=>e.type===`feedHibernate`&&e.animalId===t.id):n.kind===`fat`?i.some(e=>e.type===`feedConvertFat`&&e.animalId===t.id):n.kind===`graze`&&i.some(e=>e.type===`feedGraze`&&e.animalId===t.id)}var Og=(0,D.memo)(function({p:e,isHuman:t,actorId:n,thinking:r,interactions:i,dying:a,freshSince:o,continents:s,style:c}){let l=q(e=>e.dispatch),u=q(e=>e.intent),d=q(e=>!!e.state?.modules.randomMutations),[f,p]=(0,D.useState)(null),[m,h]=(0,D.useState)(null),g=(0,D.useRef)(null),_=n===e.id,v=t&&_&&u.kind===`placeAnimal`?u.cardId:void 0,y=(0,D.useMemo)(()=>{let t=new Map;e.animals.forEach((e,n)=>t.set(e.id,n+1));let n=e.animals.flatMap(e=>e.traits.filter(e=>e.pairWith).map(t=>({owner:e,t}))).sort((e,t)=>e.t.playSeq-t.t.playSeq||e.t.id.localeCompare(t.t.id)),r=new Map;for(let{t:e}of n)r.has(e.cardId)||r.set(e.cardId,ko[r.size%ko.length]);let i={},a=new Map;for(let{t:e}of n){let n=r.get(e.cardId),a=t.get(e.pairWith),o=a?`№${a}`:`напарник`;e.type===`symbiosis`?i[e.id]={color:n,note:e.pairRole===`a`?`симбионт для ${o}`:`симбионт — ${o}`}:i[e.id]={color:n,note:`с ${o}`}}for(let{owner:e,t:r}of n){if(r.pairRole!==`a`)continue;let n=t.get(e.id),i=t.get(r.pairWith),o=n?`№${n}`:`?`,s=i?`№${i}`:`?`;a.set(r.cardId,r.type===`symbiosis`?`симбионт ${o} → ${s}`:`${o} ↔ ${s}`)}return{colorOf:r,marks:i,plateNote:a,numberOf:t}},[e.animals]),b=e=>({draggable:t,dropTarget:t&&f!==null&&m===e.id&&f!==e.id,onDragStartCard:t?t=>{p(e.id),g.current=e.id,t.dataTransfer.setData(`text/plain`,e.id),t.dataTransfer.effectAllowed=`move`}:void 0,onDragOverCard:t?t=>{f&&f!==e.id&&(t.preventDefault(),h(e.id))}:void 0,onDropCard:t?()=>{f&&f!==e.id&&l({type:`reorderAnimal`,animalId:f,beforeId:e.id}),p(null),h(null)}:void 0,onDragEndCard:t?()=>{p(null),h(null)}:void 0}),x=(e,n)=>{let r=i(e);return(0,V.jsx)(jo,{animal:e,no:n,pairMarks:y.marks,selected:r.selected,highlight:r.highlight,dimmed:r.dimmed,dying:a.has(e.id),freshSince:o,...t?b(e):{}},e.id)},S=[];if(e.animals.length===0)S.push((0,V.jsx)(`p`,{className:`text-xs text-subtle`,children:t?`Выложите животное из руки`:`Нет животных`},`empty`));else{let t=(e,t)=>e.traits.find(e=>e.pairWith===t.id)??t.traits.find(t=>t.pairWith===e.id),n=0;for(;n<e.animals.length;){let r=e.animals[n],i=[x(r,n+1)];for(;n+1<e.animals.length;){let r=e.animals[n],a=e.animals[n+1],o=t(r,a);if(!o)break;i.push((0,V.jsx)(Mo,{type:o.type,color:y.colorOf.get(o.cardId),note:y.plateNote.get(o.cardId)},`pair-${o.cardId}`)),i.push(x(a,n+2)),n+=1}i.length===1?S.push(i[0]):S.push((0,V.jsx)(`div`,{className:`flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-stretch`,children:i},`pair-group-${r.id}`)),n+=1}}let C=t?{onDragOver:e=>{f&&e.preventDefault()},onDrop:()=>{f&&l({type:`reorderAnimal`,animalId:f}),p(null),h(null)}}:{};return(0,V.jsxs)(`section`,{style:c,"data-player-section":e.id,className:B(`paper-sheet mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0`,_?`border-accent/70 shadow-[0_0_0_1px_var(--color-accent),var(--shadow-card)]`:`border-border`),children:[(0,V.jsxs)(`div`,{className:`mb-2 flex items-center justify-between text-sm`,children:[(0,V.jsxs)(`span`,{className:`flex items-center gap-2 font-medium`,children:[t?`Ваша популяция`:e.name,_?(0,V.jsxs)(`span`,{className:B(`flex items-center gap-1 text-xs`,`text-accent`),children:[(0,V.jsx)(`span`,{className:B(`size-1.5 rounded-full bg-accent`,r&&`pulse-dot`)}),r?`думает…`:`ходит`]}):null]}),(0,V.jsxs)(`span`,{className:`text-xs text-muted`,children:[d?`колода ${e.blindDeckCount??e.blindDeck?.length??0}`:`рука ${e.handCount??e.hand.length}`,` `,`· сброс `,e.discardCount]})]}),s?(0,V.jsx)(`div`,{className:`flex flex-col gap-2`,children:Yt.map(n=>{let r=e.animals.filter(e=>(e.zoneId??`laurasia`)===n.id),i=t&&v!==void 0&&n.id!==`ocean`&&_;return(0,V.jsxs)(kg,{zone:n.id,name:n.name,count:r.length,tall:v!==void 0||r.length>0,pickable:i,onPickZone:i?()=>l({type:`devPlayAnimal`,cardId:v,zoneId:n.id}):void 0,dropHint:t,onDropZone:t&&g.current?()=>l({type:`reorderAnimal`,animalId:g.current,toZoneId:n.id}):void 0,children:[r.length===0?(0,V.jsx)(`span`,{className:`px-1 text-[11px] text-subtle`,children:n.id===`ocean`?`пусто (нужна водоплавающая)`:`пусто`}):null,r.map(e=>x(e,y.numberOf.get(e.id)??1))]},n.id)})}):(0,V.jsx)(`div`,{className:`flex flex-wrap items-stretch gap-2`,...C,children:S})]})});function kg({zone:e,name:t,count:n,children:r,dropHint:i,onDropZone:a,tall:o,pickable:s,onPickZone:c}){return(0,V.jsxs)(`div`,{"data-zone":e,role:s?`button`:void 0,"aria-label":s?`Разместить на ${t}`:void 0,onClick:s?c:void 0,onKeyDown:s?e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),c?.())}:void 0,tabIndex:s?0:void 0,onDragOver:i?e=>e.preventDefault():void 0,onDrop:a,className:B(`relative flex flex-wrap items-stretch gap-2 rounded-[var(--radius-md)] border border-dashed px-2 transition-all duration-[var(--motion-quick)]`,e===`ocean`&&`water-strip`,o?`min-h-[188px] py-2`:`min-h-[52px] py-2`,e===`ocean`?`border-water/40 bg-water/10`:`border-border-strong/25 bg-bg/40`,s&&`cursor-pointer border-solid border-accent ring-2 ring-accent/50 hover:bg-accent/15`),children:[s?(0,V.jsxs)(`span`,{className:`absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs font-medium text-accent`,children:[`нажмите, чтобы разместить на «`,t,`»`]}):null,(0,V.jsx)(`img`,{src:ma[e],alt:``,"aria-hidden":!0,className:`pointer-events-none absolute inset-0 h-full w-full rounded-[var(--radius-md)] object-cover opacity-[0.08]`}),(0,V.jsxs)(`span`,{className:`absolute -top-1.5 left-2 z-10 rounded-full border border-border bg-surface px-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted`,children:[t,` · `,n]}),r]})}function Ag({year:e,lastYear:t,phase:n,bank:r,territoryFood:i,deckLeft:a,foodRoll:o,lastLog:s,actorName:c,deaths:l,plantsInfo:u,floraInfo:d,style:f}){let p=!!u&&!i,m=!!d&&!i,h=p||m,g=(n===`foodBank`||n===`feeding`)&&!h,_=o?o.join(`-`):`pending`;return(0,V.jsxs)(`section`,{style:f,className:`felt grain relative order-first flex min-h-[150px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[26px] border border-border p-4 text-fg shadow-[inset_0_0_60px_rgba(0,0,0,.45),var(--shadow-card)] lg:order-none lg:min-h-0`,children:[(0,V.jsx)(`img`,{src:da.bankBowl,alt:``,"aria-hidden":!0,className:`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.13]`}),(0,V.jsxs)(`div`,{className:`relative flex items-center gap-2 rounded-full border border-border-strong/60 bg-bg/55 px-3.5 py-1 text-xs backdrop-blur-sm`,children:[pa[n]?(0,V.jsx)(`img`,{src:pa[n],alt:``,className:`size-4 rounded-[4px]`}):null,(0,V.jsxs)(`span`,{className:`font-display tracking-wide`,children:[`Год `,e]}),t?(0,V.jsx)(`span`,{className:`text-clay`,children:`последний`}):null,(0,V.jsx)(`span`,{className:`text-subtle`,children:`·`}),(0,V.jsx)(`span`,{children:vg[n]??n}),(0,V.jsx)(`span`,{className:`text-subtle`,children:`·`}),(0,V.jsxs)(`span`,{className:`tabular-nums text-muted`,children:[`колода `,a]})]}),g?(0,V.jsx)(Ng,{roll:o},_):null,n===`growth`?(0,V.jsx)(`div`,{className:`relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-leaf/60 bg-leaf/15 px-4 py-1.5 text-sm font-medium text-leaf`,children:`Рост: растения разрастаются`}):n===`extinction`?(0,V.jsxs)(`div`,{className:`relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay`,children:[`Вымирание: погибает `,l===0?`никто`:`животных: ${l}`]}):h?(0,V.jsxs)(`div`,{className:`relative flex flex-col items-center gap-1`,title:`Еда этого года лежит на столе — берите фишки с растений и карт флоры`,children:[p&&u?(0,V.jsxs)(`div`,{className:`flex flex-col items-center gap-1`,title:`Еда этого года лежит на растениях — берите фишки с них`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-1`,children:[Array.from({length:Math.min(u.food,18)}).map((e,t)=>(0,V.jsx)(vo,{tone:`green`,className:`token-pop size-3.5`},t)),u.food>18?(0,V.jsxs)(`span`,{className:`text-[10px] tabular-nums text-muted`,children:[`+`,u.food-18]}):null]}),(0,V.jsx)(`span`,{className:`font-display text-xl tabular-nums leading-none`,children:u.food}),(0,V.jsxs)(`span`,{className:`text-[10px] uppercase tracking-[0.18em] text-muted`,children:[`фишек на `,u.count,` растениях · убежищ `,u.shelters]})]}):null,m&&d?(0,V.jsxs)(`div`,{className:`flex flex-col items-center gap-1`,title:`Еда этого года — на травах и грибах`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-1`,children:[Array.from({length:Math.min(d.food,18)}).map((e,t)=>(0,V.jsx)(vo,{tone:`red`,className:`token-pop size-3.5`},t)),d.food>18?(0,V.jsxs)(`span`,{className:`text-[10px] tabular-nums text-muted`,children:[`+`,d.food-18]}):null]}),(0,V.jsx)(`span`,{className:`font-display text-xl tabular-nums leading-none`,children:d.food}),(0,V.jsxs)(`span`,{className:`text-[10px] uppercase tracking-[0.18em] text-muted`,children:[`фишек на `,d.count,` травах и грибах`]})]}):null]}):i&&!u&&!d?(0,V.jsx)(jg,{banks:i,active:n===`feeding`}):(0,V.jsx)(Mg,{count:r,active:n===`feeding`,oceanOnly:!!(u||d)}),c&&(n===`feeding`||n===`development`)?(0,V.jsxs)(`p`,{className:`relative text-xs text-accent`,children:[`Ход: `,c]}):null,s?(0,V.jsx)(`p`,{className:`relative max-w-md text-center text-[11px] leading-snug text-muted`,children:s}):null]})}function jg({banks:e,active:t}){return(0,V.jsx)(`div`,{className:`relative grid w-full max-w-sm grid-cols-3 gap-2`,children:Yt.map(n=>{let r=e[n.id]??0;return(0,V.jsxs)(`div`,{title:`Кормовая база «${n.name}»`,className:B(`flex flex-col items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1.5`,n.id===`ocean`?`border-water/50 bg-water/15`:`border-border bg-bg/45`),children:[(0,V.jsx)(`img`,{src:ma[n.id],alt:``,"aria-hidden":!0,className:`size-14 shrink-0 rounded-[var(--radius-sm)] border border-ink/20 object-cover shadow-[var(--shadow-card)]`}),(0,V.jsxs)(`div`,{className:`flex items-center gap-1`,children:[Array.from({length:Math.min(r,6)}).map((e,t)=>(0,V.jsx)(vo,{tone:`red`,className:`token-pop size-3`},`${t}-${r}`)),r>6?(0,V.jsxs)(`span`,{className:`text-[10px] tabular-nums text-muted`,children:[`+`,r-6]}):null,r===0?(0,V.jsx)(`span`,{className:`text-[10px] text-subtle`,children:t?`пусто`:`—`}):null]}),(0,V.jsx)(`span`,{className:`font-display text-lg leading-none tabular-nums`,children:r})]},n.id)})})}function Mg({count:e,active:t,oceanOnly:n}){return(0,V.jsxs)(`div`,{className:`relative flex flex-col items-center gap-1.5`,title:t?n?`Кормовая база Океана — на континентах еда на растениях`:`Фишки кормовой базы — берите по одной в свой ход питания`:`Кормовая база`,children:[(0,V.jsxs)(`div`,{className:`flex max-w-[260px] flex-wrap items-center justify-center gap-1`,children:[e===0?(0,V.jsx)(`span`,{className:`text-xs text-subtle`,children:t?n?`океан пуст`:`база пуста`:`—`}):Array.from({length:Math.min(e,24)}).map((t,n)=>(0,V.jsx)(vo,{tone:`red`,className:`token-pop size-4`},`${n}-${e}`)),e>24?(0,V.jsxs)(`span`,{className:`ml-1 text-xs tabular-nums text-muted`,children:[`+`,e-24]}):null]}),(0,V.jsx)(`span`,{className:`font-display text-xl tabular-nums leading-none`,children:e}),(0,V.jsx)(`span`,{className:`text-[10px] uppercase tracking-[0.18em] text-muted`,children:n?`кормовая база океана`:`кормовая база`})]})}function Ng({roll:e}){let[t,n]=(0,D.useState)(!!e),r=e?.join(`,`)??``,i=(0,D.useRef)(null);if((0,D.useEffect)(()=>{if(r)return n(!0),i.current=setTimeout(()=>n(!1),900),()=>{i.current&&clearTimeout(i.current)}},[r]),!e)return(0,V.jsxs)(`div`,{className:`relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2`,children:[(0,V.jsx)(Qh,{values:[null,null],rolling:!0,dieSize:44}),(0,V.jsx)(`span`,{className:`text-xs uppercase tracking-[0.18em] text-muted`,children:`бросок…`})]});let a=e.reduce((e,t)=>e+t,0);return(0,V.jsxs)(`div`,{className:`relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2`,children:[(0,V.jsx)(Qh,{values:e,rolling:t,dieSize:44,ariaLabel:`Кубики кормовой базы: ${e.join(`, `)}`}),(0,V.jsxs)(`div`,{className:`flex flex-col`,children:[(0,V.jsx)(`span`,{className:B(`font-display text-2xl leading-none tabular-nums`,!t&&`pop-in`),children:t?`…`:a}),t?null:(0,V.jsx)(`span`,{className:`mt-1 text-[10px] uppercase tracking-[0.18em] text-good`,children:`кормовая база`})]})]})}function Pg({count:e,visible:t}){return(0,V.jsxs)(`div`,{className:`flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5`,title:`Кормовая база`,children:[(0,V.jsx)(`span`,{className:`text-[10px] uppercase tracking-wider text-muted`,children:`База`}),(0,V.jsx)(`span`,{className:`font-display text-lg tabular-nums leading-none`,children:t?e:`—`})]})}function Fg({human:e,intent:t,disabled:n,continents:r,canPlant:i,onNewAnimal:a,onTrait:o,onPop:s,onPlant:c,onPass:l}){let u=e.blindDeck?.length??e.blindDeckCount??0,d=t.kind===`mutateTrait`||t.kind===`mutatePop`||t.kind===`mutatePlant`;return(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,V.jsx)(`p`,{className:`text-xs text-muted`,children:n?`Ход соперника`:d?t.kind===`mutateTrait`?`Выберите свой вид из одного животного — карта вскроется на нём`:t.kind===`mutatePop`?`Выберите вид — карта станет +1 животным`:`Выберите растение — карта вскроется свойством на нём`:`Объявите розыгрыш верхней карты колоды — потом она вскроется`}),(0,V.jsxs)(`span`,{className:`flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted`,children:[(0,V.jsx)(`span`,{className:`text-[10px] uppercase tracking-wider`,children:`Колода`}),(0,V.jsx)(`span`,{className:`font-display text-sm tabular-nums leading-none`,children:u})]})]}),(0,V.jsxs)(`div`,{"data-hand-row":!0,className:`flex flex-wrap items-stretch gap-2`,children:[r?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`button`,{type:`button`,disabled:n||!u,onClick:()=>a(`laurasia`),className:`flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50`,children:[(0,V.jsx)(`span`,{className:`font-display`,children:`Новый вид · Лавразия`}),(0,V.jsx)(`span`,{className:`text-[10px] font-normal text-muted`,children:`карта ляжет животным`})]}),(0,V.jsxs)(`button`,{type:`button`,disabled:n||!u,onClick:()=>a(`gondwana`),className:`flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50`,children:[(0,V.jsx)(`span`,{className:`font-display`,children:`Новый вид · Гондвана`}),(0,V.jsx)(`span`,{className:`text-[10px] font-normal text-muted`,children:`карта ляжет животным`})]})]}):(0,V.jsxs)(`button`,{type:`button`,disabled:n||!u,onClick:()=>a(),className:`flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50`,children:[(0,V.jsx)(`span`,{className:`font-display`,children:`Новый вид`}),(0,V.jsx)(`span`,{className:`text-[10px] font-normal text-muted`,children:`карта ляжет животным`})]}),(0,V.jsxs)(`button`,{type:`button`,disabled:n||!u,onClick:o,className:B(`flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50`,t.kind===`mutateTrait`?`border-accent bg-accent/15 text-fg`:`border-border bg-surface-2 text-fg hover:bg-surface`),children:[(0,V.jsx)(`span`,{className:`font-display`,children:`Свойство`}),(0,V.jsx)(`span`,{className:`text-[10px] font-normal text-muted`,children:`на вид из одного животного`})]}),(0,V.jsxs)(`button`,{type:`button`,disabled:n||!u,onClick:s,className:B(`flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50`,t.kind===`mutatePop`?`border-accent bg-accent/15 text-fg`:`border-border bg-surface-2 text-fg hover:bg-surface`),children:[(0,V.jsx)(`span`,{className:`font-display`,children:`+1 животное виду`}),(0,V.jsx)(`span`,{className:`text-[10px] font-normal text-muted`,children:`численность ≤ числа видов`})]}),i?(0,V.jsxs)(`button`,{type:`button`,disabled:n||!u,onClick:c,className:B(`flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50`,t.kind===`mutatePlant`?`border-leaf bg-leaf/15 text-fg`:`border-border bg-surface-2 text-fg hover:bg-surface`),children:[(0,V.jsx)(`span`,{className:`font-display`,children:`Свойство растения`}),(0,V.jsx)(`span`,{className:`text-[10px] font-normal text-muted`,children:`если в колоде есть такая грань`})]}):null,(0,V.jsx)(Ut,{variant:`secondary`,size:`sm`,onClick:l,disabled:n,children:`Пас`})]})]})}function Ig({human:e,intent:t,disabled:n,continents:r,onPlayAnimal:i,onPlaceAnimal:a,onPickTrait:o,onPass:s}){return(0,V.jsxs)(`div`,{className:`space-y-2`,children:[(0,V.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,V.jsx)(`p`,{className:`text-xs text-muted`,children:n?`Ход соперника — карты остаются у вас`:t.kind===`placeAnimal`?`Выберите территорию на столе — животное разместится туда`:t.kind===`playPlantTrait`?t.kind===`playPlantTrait`&&`cardId`in t?`Выберите растение для свойства`:``:t.kind===`playPlantPair`&&!(`first`in t&&t.first)?`Микориза: выберите первое растение`:t.kind===`playPlantPair`?`Второе растение микоризы`:t.kind===`playTrait`?`Выберите животное для свойства`:t.kind===`playPair`&&!(`first`in t&&t.first)?`Парное свойство: выберите первое животное`:t.kind===`playPair`?`Второе животное пары`:r?`Карта как животное (затем клик по континенту) или свойство`:`Карта как животное или свойство`}),(0,V.jsx)(Ut,{variant:`secondary`,size:`sm`,onClick:s,disabled:n,children:`Пас`})]}),(0,V.jsx)(`div`,{"data-hand-row":!0,className:`flex gap-2 overflow-x-auto pb-1`,children:e.hand.map(e=>(0,V.jsx)(Po,{card:e,disabled:n,selected:t.kind!==`none`&&`cardId`in t&&t.cardId===e.id||t.kind===`placeAnimal`&&t.cardId===e.id,selectedFace:`face`in t&&t.cardId===e.id?t.face:null,onSelect:t=>{t===`animal`&&r&&a?a(e.id):t===`animal`?i(e.id):o(e.id,t)}},e.id))})]})}function Lg({acts:e,intentKind:t,bank:n,rageTurn:r,onIntent:i,onEndTurn:a,onSkip:o}){let s=q(e=>e.dispatch),c=e.filter(e=>e.type===`feedTake`),l=e.filter(e=>e.type===`feedTakePlant`),u=e.filter(e=>e.type===`feedTakeFlora`),d=[...c,...l,...u],f=e.filter(e=>e.type===`feedShelter`),p=e.filter(e=>e.type===`feedPlantAttack`),m=e.filter(e=>e.type===`feedParasitize`),h=e.some(e=>e.type===`feedHunt`),g=e.some(e=>e.type===`feedPirate`),_=e.filter(e=>e.type===`feedHibernate`),v=e.filter(e=>e.type===`feedConvertFat`),y=e.filter(e=>e.type===`feedGraze`),b=e.filter(e=>e.type===`feedMigrate`),x=e.some(e=>e.type===`feedSkip`),S=!x&&(f.length>0||l.length>0||u.length>0);return r?(0,V.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,V.jsx)(`span`,{className:`rounded-full border border-danger/60 bg-danger/15 px-3 py-1 text-xs font-medium text-clay`,children:`Бешенство: животное обязано атаковать — выберите жертву`}),h?(0,V.jsx)(Ut,{variant:`danger`,size:`sm`,onClick:()=>i({kind:`hunt`}),children:`Атака бешеного`}):(0,V.jsx)(`span`,{className:`text-xs text-subtle`,children:`Допустимой жертвы нет — заканчивайте ход`}),(0,V.jsx)(Ut,{variant:`secondary`,size:`sm`,onClick:a,children:`Закончить ход`})]}):(0,V.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[n>0?(0,V.jsxs)(`span`,{className:`mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted`,children:[`Океан: `,(0,V.jsx)(`span`,{className:`font-display text-sm text-fg`,children:n})]}):null,d.length?(0,V.jsx)(Ut,{variant:t===`take`||t===`takePlant`||t===`takeFlora`||t===`none`?`parchment`:`secondary`,size:`sm`,onClick:()=>{d.length===1?s(d[0]):i({kind:l.length||u.length?u.length&&!l.length?`takeFlora`:`takePlant`:`take`})},children:`Взять еду`}):null,f.length?(0,V.jsx)(Ut,{variant:t===`shelter`?`parchment`:`secondary`,size:`sm`,title:`Занять убежище растения: защита от хищников до конца фазы питания`,onClick:()=>{f.length===1?s(f[0]):i({kind:`shelter`})},children:`Убежище`}):null,p.length?(0,V.jsx)(Ut,{variant:t===`plantAttack`?`danger`:`secondary`,size:`sm`,title:`Направить хищное растение на жертву (раз за фазу)`,onClick:()=>{p.length===1?s(p[0]):i({kind:`plantAttack`})},children:`Хищное растение`}):null,m.length?(0,V.jsx)(Ut,{variant:t===`parasitize`?`parchment`:`secondary`,size:`sm`,title:`Перекинуть фишку с растения-хозяина на растение-паразит`,onClick:()=>{m.length===1?s(m[0]):i({kind:`parasitize`})},children:`На паразита`}):null,h?(0,V.jsx)(Ut,{variant:t===`hunt`?`danger`:`secondary`,size:`sm`,onClick:()=>i({kind:`hunt`}),children:`Охота`}):null,g?(0,V.jsx)(Ut,{variant:t===`pirate`?`parchment`:`secondary`,size:`sm`,onClick:()=>i({kind:`pirate`}),children:`Пиратство`}):null,_.length?(0,V.jsx)(Ut,{variant:t===`hibernate`?`parchment`:`secondary`,size:`sm`,onClick:()=>{_.length===1?s(_[0]):i({kind:`hibernate`})},children:`Спячка`}):null,v.length?(0,V.jsx)(Ut,{variant:t===`fat`?`parchment`:`secondary`,size:`sm`,onClick:()=>{v.length===1?s(v[0]):i({kind:`fat`})},children:`Жир`}):null,y.length?(0,V.jsx)(Ut,{variant:t===`graze`?`parchment`:`secondary`,size:`sm`,onClick:()=>{y.length===1?s(y[0]):i({kind:`graze`})},children:`Топтун`}):null,b.length?b.length===1?(0,V.jsx)(Ut,{variant:`secondary`,size:`sm`,onClick:()=>s(b[0]),children:`Миграция`}):(0,V.jsx)(`div`,{className:`flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1`,children:b.map((e,t)=>{let n=e.moves[0].to;return(0,V.jsx)(`button`,{type:`button`,onClick:()=>s(e),className:`rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium text-fg hover:bg-ink/10`,children:n===`laurasia`?`↑ Лавразия`:n===`gondwana`?`↓ Гондвана`:`≈ Океан`},t)})}):null,(0,V.jsx)(Ut,{variant:`secondary`,size:`sm`,onClick:a,children:`Закончить ход`}),x?(0,V.jsx)(Ut,{variant:`ghost`,size:`sm`,onClick:o,title:`Пас до конца фазы питания`,children:`Пас`}):S?(0,V.jsx)(`span`,{className:`text-xs text-subtle`,title:`Пока хотя бы одно ваше животное способно получить еду или убежище, пасовать нельзя (правила «Растений»)`,children:`Пас недоступен — есть доступная еда или убежища`}):null]})}function Rg({acts:e,onPick:t}){let n=q(e=>e.state),r=n.pendingAttack,i=U(n,r.preyId),a=e.find(e=>e.type===`chooseDefense`&&e.kind===`running`),o=e.find(e=>e.type===`chooseDefense`&&e.kind===`none`),s=e.filter(e=>e.type===`chooseDefense`&&e.kind===`mimicry`),c=e.filter(e=>e.type===`chooseDefense`&&e.kind===`tailLoss`);return(0,V.jsx)(`div`,{className:`fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 sm:items-center`,children:(0,V.jsxs)(`div`,{className:`w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-5`,children:[(0,V.jsx)(`h2`,{className:`text-xl`,children:`Нападение хищника`}),(0,V.jsxs)(`p`,{className:`mt-1 text-sm text-muted`,children:[`Нужно `,i?kn(i):`—`,` еды, сейчас `,i?.food??0,`. Выберите защиту.`]}),(0,V.jsxs)(`div`,{className:`mt-4 flex flex-col gap-2`,children:[a?(0,V.jsx)(Ut,{onClick:()=>t(a),children:`Быстрое — бросок кубика`}):null,s.map(e=>e.type===`chooseDefense`?(0,V.jsx)(Ut,{variant:`secondary`,onClick:()=>t(e),children:`Мимикрия на другое животное`},e.mimicryTargetId):null),c.map(e=>(0,V.jsx)(Ut,{variant:`secondary`,onClick:()=>t(e),children:`Отбросить хвост`},e.discardTraitId)),o?(0,V.jsx)(Ut,{variant:`danger`,onClick:()=>t(o),children:`Не защищаться`}):null]})]})})}function zg(){return(0,V.jsx)(wg,{})}export{zg as component};