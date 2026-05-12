/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 396
(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(155),ca=__webpack_require__(593);function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea={};function fa(a,b){ha(a,b);ha(a+"Capture",b)}
function ha(a,b){ea[a]=b;for(a=0;a<b.length;a++)da.add(b[a])}
var ia=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja=Object.prototype.hasOwnProperty,ka=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la=
{},ma={};function oa(a){if(ja.call(ma,a))return!0;if(ja.call(la,a))return!1;if(ka.test(a))return ma[a]=!0;la[a]=!0;return!1}function pa(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var z={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z[a]=new v(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z[b]=new v(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z[a]=new v(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z[a]=new v(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z[a]=new v(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){z[a]=new v(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){z[a]=new v(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){z[a]=new v(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){z[a]=new v(a,5,!1,a.toLowerCase(),null,!1,!1)});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
sa);z[b]=new v(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){z[a]=new v(a,1,!1,a.toLowerCase(),null,!1,!1)});
z.xlinkHref=new v("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z[a]=new v(a,1,!1,a.toLowerCase(),null,!0,!0)});
function ta(a,b,c,d){var e=z.hasOwnProperty(b)?z[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa(b,c,e,d)&&(c=null),d||null===e?oa(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)))}
var ua=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za=Symbol.for("react.strict_mode"),Aa=Symbol.for("react.profiler"),Ba=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da=Symbol.for("react.forward_ref"),Ea=Symbol.for("react.suspense"),Fa=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");
var Ia=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return"function"===typeof a?a:null}var A=Object.assign,La;function Ma(a){if(void 0===La)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La=b&&b[1]||""}return"\n"+La+a}var Na=!1;
function Oa(a,b){if(!a||Na)return"";Na=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(l){var d=l}Reflect.construct(a,[],b)}else{try{b.call()}catch(l){d=l}a.call(b.prototype)}else{try{throw Error();}catch(l){d=l}a()}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Ma(a):""}
function Pa(a){switch(a.tag){case 5:return Ma(a.type);case 16:return Ma("Lazy");case 13:return Ma("Suspense");case 19:return Ma("SuspenseList");case 0:case 2:case 15:return a=Oa(a.type,!1),a;case 11:return a=Oa(a.type.render,!1),a;case 1:return a=Oa(a.type,!0),a;default:return""}}
function Qa(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya:return"Fragment";case wa:return"Portal";case Aa:return"Profiler";case za:return"StrictMode";case Ea:return"Suspense";case Fa:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca:return(a.displayName||"Context")+".Consumer";case Ba:return(a._context.displayName||"Context")+".Provider";case Da:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga:return b=a.displayName||null,null!==b?b:Qa(a.type)||"Memo";case Ha:b=a._payload;a=a._init;try{return Qa(a(b))}catch(c){}}return null}
function Ra(a){var b=a.type;switch(a.tag){case 24:return"Cache";case 9:return(b.displayName||"Context")+".Consumer";case 10:return(b._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return"Fragment";case 5:return b;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Qa(b);case 8:return b===za?"StrictMode":"Mode";case 22:return"Offscreen";
case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return""}}
function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return A({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function ab(a,b){b=b.checked;null!=b&&ta(a,"checked",b,!1)}
function bb(a,b){ab(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function cb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}var eb=Array.isArray;
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p(91));return A({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p(92));if(eb(c)){if(1<c.length)throw Error(p(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}function kb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else{mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a]})});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var tb=A({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb()}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p(231,b,typeof c));return c}var Lb=!1;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb)}catch(a){Lb=!1}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(m){this.onError(m)}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments)}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null}else throw Error(p(198));Qb||(Qb=!0,Rb=l)}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling}throw Error(p(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(p(189));}}if(c.alternate!==d)throw Error(p(190));}if(3!==c.tag)throw Error(p(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling}return null}
var ac=ca.unstable_scheduleCallback,bc=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc=ca.unstable_requestPaint,B=ca.unstable_now,ec=ca.unstable_getCurrentPriorityLevel,fc=ca.unstable_ImmediatePriority,gc=ca.unstable_UserBlockingPriority,hc=ca.unstable_NormalPriority,ic=ca.unstable_LowPriority,jc=ca.unstable_IdlePriority,kc=null,lc=null;function mc(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc,a,void 0,128===(a.current.flags&128))}catch(b){}}
var oc=Math.clz32?Math.clz32:nc,pc=Math.log,qc=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc(a)/qc|0)|0}var rc=64,sc=4194304;
function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)))}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}
function wc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc(h,b)}else k<=b&&(a.expiredLanes|=h);f&=~h}}function xc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc(){var a=rc;rc<<=1;0===(rc&4194240)&&(rc=64);return a}function zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc(b);a[b]=c}function Bc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f}}
function Cc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e}}var C=0;function Dc(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec,Fc,Gc,Hc,Ic,Jc=!1,Kc=[],Lc=null,Mc=null,Nc=null,Oc=new Map,Pc=new Map,Qc=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc.delete(b.pointerId)}}
function Tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc(Lc,a,b,c,d,e),!0;case "dragenter":return Mc=Tc(Mc,a,b,c,d,e),!0;case "mouseover":return Nc=Tc(Nc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;Oc.set(f,Tc(Oc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,Pc.set(f,Tc(Pc.get(f)||null,a,b,c,d,e)),!0}return!1}
function Vc(a){var b=Wc(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic(a.priority,function(){Gc(c)});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function Xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=Yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null}else return b=Cb(c),null!==b&&Fc(b),a.blockedOn=c,!1;b.shift()}return!0}function Zc(a,b,c){Xc(a)&&c.delete(b)}function $c(){Jc=!1;null!==Lc&&Xc(Lc)&&(Lc=null);null!==Mc&&Xc(Mc)&&(Mc=null);null!==Nc&&Xc(Nc)&&(Nc=null);Oc.forEach(Zc);Pc.forEach(Zc)}
function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc||(Jc=!0,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c)))}
function bd(a){function b(b){return ad(b,a)}if(0<Kc.length){ad(Kc[0],a);for(var c=1;c<Kc.length;c++){var d=Kc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc&&ad(Nc,a);Oc.forEach(b);Pc.forEach(b);for(c=0;c<Qc.length;c++)d=Qc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc.length&&(c=Qc[0],null===c.blockedOn);)Vc(c),null===c.blockedOn&&Qc.shift()}var cd=ua.ReactCurrentBatchConfig,dd=!0;
function ed(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=1,fd(a,b,c,d)}finally{C=e,cd.transition=f}}function gd(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=4,fd(a,b,c,d)}finally{C=e,cd.transition=f}}
function fd(a,b,c,d){if(dd){var e=Yc(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc(a,d);else if(Uc(e,a,b,c,d))d.stopPropagation();else if(Sc(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec(f);f=Yc(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f}null!==e&&d.stopPropagation()}else hd(a,b,d,null,c)}}var id=null;
function Yc(a,b,c,d){id=null;a=xb(d);a=Wc(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec()){case fc:return 1;case gc:return 4;case hc:case ic:return 16;case jc:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=A({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=ia&&"CompositionEvent"in window,be=null;ia&&"documentMode"in document&&(be=document.documentMode);var ce=ia&&"TextEvent"in window&&!be,de=ia&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(ia){var xe;if(ia){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));Jb(re,b)}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge;
function Ie(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++){var e=c[d];if(!ja.call(b,e)||!He(a[e],b[e]))return!1}return!0}function Je(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke(a,b){var c=Je(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Je(c)}}function Le(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Le(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Me(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Ne(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe(a){var b=Me(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le(c.ownerDocument.documentElement,c)){if(null!==d&&Ne(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke(c,f);var g=Ke(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)))}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top}}
var Pe=ia&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Ne(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Ie(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
function Ve(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We={animationend:Ve("Animation","AnimationEnd"),animationiteration:Ve("Animation","AnimationIteration"),animationstart:Ve("Animation","AnimationStart"),transitionend:Ve("Transition","TransitionEnd")},Xe={},Ye={};
ia&&(Ye=document.createElement("div").style,"AnimationEvent"in window||(delete We.animationend.animation,delete We.animationiteration.animation,delete We.animationstart.animation),"TransitionEvent"in window||delete We.transitionend.transition);function Ze(a){if(Xe[a])return Xe[a];if(!We[a])return a;var b=We[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye)return Xe[a]=b[c];return a}var $e=Ze("animationend"),af=Ze("animationiteration"),bf=Ze("animationstart"),cf=Ze("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a,b){df.set(a,b);fa(b,[a])}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf)}ff($e,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
function D(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d))}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b)}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,!1,a),qf(b,!0,a))});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf("selectionchange",!1,b))}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue(k);u=null==n?h:ue(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x)}t=null}else t=null;null!==k&&wf(g,h,k,t,!1);null!==n&&null!==J&&wf(g,J,n,t,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve;else if(me(h))if(we)na=Fe;else{na=De;var xa=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee);if(na&&(na=na(a,d))){ne(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value)}xa=d?ue(d):window;switch(a){case "focusin":if(me(xa)||"true"===xa.contentEditable)Qe=xa,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var $a;if(ae)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0}else ie?ge(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),xa=oe(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he(c),null!==$a&&(ba.data=$a))));if($a=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a)}se(g,b)})}function tf(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return"textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;})}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--}else"$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e}while(c);bd(b)}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[Of]||a[uf];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return{current:a}}
function E(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--)}function G(a,b){Tf++;Sf[Tf]=a.current;a.current=b}var Vf={},H=Uf(Vf),Wf=Uf(!1),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E(Wf);E(H)}function ag(a,b,c){if(H.current!==Vf)throw Error(p(168));G(H,b);G(Wf,c)}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p(108,Ra(a)||"Unknown",e));return A({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H.current;G(H,a);G(Wf,Wf.current);return!0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E(Wf),E(H),G(H,a)):E(Wf);G(Wf,c)}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a)}function ig(a){fg=!0;hg(a)}
function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C;try{var c=eg;for(C=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C=b,gg=!1}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a}else rg=1<<f|c<<e|d,sg=a}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0))}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null}var xg=null,yg=null,I=!1,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c)}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,!0):!1;default:return!1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I=!1,xg=a)}}else{if(Dg(a))throw Error(p(418));a.flags=a.flags&-4097|2;I=!1;xg=a}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a}
function Gg(a){if(a!==xg)return!1;if(!I)return Fg(a),I=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling)}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}yg=
null}}else yg=xg?Lf(a.stateNode.nextSibling):null;return!0}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling)}function Ig(){yg=xg=null;I=!1}function Jg(a){null===zg?zg=[a]:zg.push(a)}var Kg=ua.ReactCurrentBatchConfig;
function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p(309));var d=c.stateNode}if(!d)throw Error(p(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p(284));if(!c._owner)throw Error(p(290,a));}return a}
function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c)}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
c.ref=Lg(a,null,b),c.return=a,c;case wa:return b=Sg(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b)}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c)}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d)}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x}if(w===h.length)return c(e,u),I&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p(150));h=l.call(h);if(null==h)throw Error(p(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x}if(n.done)return c(e,
m),I&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling}f.type===ya?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h)}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=Sg(f,a.mode,h);d.return=a;a=d}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);Mg(a,f)}return"string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(!0),Vg=Og(!1),Wg=Uf(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null}function ah(a){var b=Wg.current;E(Wg);a._currentValue=b}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return}}
function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=!0),a.firstContext=null)}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a}}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a)}
function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=!1;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}
function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function mh(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c)}}
function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function qh(a,b,c,d){var e=a.updateQueue;jh=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k))}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A({},q,r);break a;case 2:jh=!0}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h))}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q}}
function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p(191,e));e.call(d)}}}var th={},uh=Uf(th),vh=Uf(th),wh=Uf(th);function xh(a){if(a===th)throw Error(p(174));return a}
function yh(a,b){G(wh,b);G(vh,a);G(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a)}E(uh);G(uh,b)}function zh(){E(uh);E(vh);E(wh)}function Ah(a){xh(wh.current);var b=xh(uh.current);var c=lb(b,a.type);b!==c&&(G(vh,a),G(uh,c))}function Bh(a){vh.current===a&&(E(uh),E(vh))}var L=Uf(0);
function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var Dh=[];
function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0}var Fh=ua.ReactCurrentDispatcher,Gh=ua.ReactCurrentBatchConfig,Hh=0,M=null,N=null,O=null,Ih=!1,Jh=!1,Kh=0,Lh=0;function P(){throw Error(p(321));}function Mh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Nh(a,b,c,d,e,f){Hh=f;M=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=!1;Kh=0;if(25<=f)throw Error(p(301));f+=1;O=N=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e)}while(Jh)}Fh.current=Rh;b=null!==N&&null!==N.next;Hh=0;O=N=M=null;Ih=!1;if(b)throw Error(p(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O?M.memoizedState=O=a:O=O.next=a;return O}function Uh(){if(null===N){var a=M.alternate;a=null!==a?a.memoizedState:null}else a=N.next;var b=null===O?M.memoizedState:O.next;if(null!==b)O=b,N=a;else{if(null===a)throw Error(p(310));N=a;a={memoizedState:N.memoizedState,baseState:N.baseState,baseQueue:N.baseQueue,queue:N.queue,next:null};null===O?M.memoizedState=O=a:O=O.next=a}return O}
function Vh(a,b){return"function"===typeof b?b(a):b}
function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=N,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else{var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M.lanes|=m;rh|=m}l=l.next}while(null!==l&&l!==f);null===k?g=d:k.next=h;He(d,b.memoizedState)||(dh=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return[b.memoizedState,c.dispatch]}
function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(dh=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}function Yh(){}
function Zh(a,b){var c=M,d=Uh(),e=b(),f=!He(d.memoizedState,e);f&&(d.memoizedState=e,dh=!0);d=d.queue;$h(ai.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O&&O.memoizedState.tag&1){c.flags|=2048;bi(9,ci.bind(null,c,d,e,b),void 0,null);if(null===Q)throw Error(p(349));0!==(Hh&30)||di(c,b,e)}return e}function di(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M.updateQueue;null===b?(b={lastEffect:null,stores:null},M.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a))}
function ci(a,b,c,d){b.value=c;b.getSnapshot=d;ei(b)&&fi(a)}function ai(a,b,c){return c(function(){ei(b)&&fi(a)})}function ei(a){var b=a.getSnapshot;a=a.value;try{var c=b();return!He(a,c)}catch(d){return!0}}function fi(a){var b=ih(a,1);null!==b&&gi(b,a,1,-1)}
function hi(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii.bind(null,M,a);return[b.memoizedState,a]}
function bi(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M.updateQueue;null===b?(b={lastEffect:null,stores:null},M.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji(){return Uh().memoizedState}function ki(a,b,c,d){var e=Th();M.flags|=a;e.memoizedState=bi(1|b,c,void 0,void 0===d?null:d)}
function li(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N){var g=N.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi(b,c,f,d);return}}M.flags|=a;e.memoizedState=bi(1|b,c,f,d)}function mi(a,b){return ki(8390656,8,a,b)}function $h(a,b){return li(2048,8,a,b)}function ni(a,b){return li(4,2,a,b)}function oi(a,b){return li(4,4,a,b)}
function pi(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}function qi(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li(4,4,pi.bind(null,b,a),c)}function ri(){}function si(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function ti(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=!1,dh=!0),a.memoizedState=c;He(c,b)||(c=yc(),M.lanes|=c,rh|=c,a.baseState=!0);return b}function vi(a,b){var c=C;C=0!==c&&4>c?c:4;a(!0);var d=Gh.transition;Gh.transition={};try{a(!1),b()}finally{C=c,Gh.transition=d}}function wi(){return Uh().memoizedState}
function xi(a,b,c){var d=yi(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi(a))Ai(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R();gi(c,a,d,e);Bi(c,b,d)}}
function ii(a,b,c){var d=yi(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi(a))Ai(b,e);else{var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R(),gi(c,a,d,e),Bi(c,b,d))}}
function zi(a){var b=a.alternate;return a===M||null!==b&&b===M}function Ai(a,b){Jh=Ih=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}function Bi(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c)}}
var Rh={readContext:eh,useCallback:P,useContext:P,useEffect:P,useImperativeHandle:P,useInsertionEffect:P,useLayoutEffect:P,useMemo:P,useReducer:P,useRef:P,useState:P,useDebugValue:P,useDeferredValue:P,useTransition:P,useMutableSource:P,useSyncExternalStore:P,useId:P,unstable_isNewReconciler:!1},Oh={readContext:eh,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki(4194308,
4,pi.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi.bind(null,M,a);return[d.memoizedState,a]},useRef:function(a){var b=
Th();a={current:a};return b.memoizedState=a},useState:hi,useDebugValue:ri,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi(!1),b=a[0];a=vi.bind(null,a[1]);Th().memoizedState=a;return[b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M,e=Th();if(I){if(void 0===c)throw Error(p(407));c=c()}else{c=b();if(null===Q)throw Error(p(349));0!==(Hh&30)||di(d,b,c)}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi(ai.bind(null,d,
f,a),[a]);d.flags|=2048;bi(9,ci.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q.identifierPrefix;if(I){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":"}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Ph={readContext:eh,useCallback:si,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni,useLayoutEffect:oi,useMemo:ti,useReducer:Wh,useRef:ji,useState:function(){return Wh(Vh)},
useDebugValue:ri,useDeferredValue:function(a){var b=Uh();return ui(b,N.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return[a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:!1},Qh={readContext:eh,useCallback:si,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni,useLayoutEffect:oi,useMemo:ti,useReducer:Xh,useRef:ji,useState:function(){return Xh(Vh)},useDebugValue:ri,useDeferredValue:function(a){var b=Uh();return null===
N?b.memoizedState=a:ui(b,N.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return[a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:!1};function Ci(a,b){if(a&&a.defaultProps){b=A({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Ei={isMounted:function(a){return(a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R(),e=yi(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e))},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R(),e=yi(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e))},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R(),d=
yi(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi(b,a,d,c),oh(b,a,d))}};function Fi(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie(c,d)||!Ie(e,f):!0}
function Gi(a,b,c){var d=!1,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Hi(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei.enqueueReplaceState(b,b.state,null)}
function Ii(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308)}function Ji(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e,digest:null}}
function Ki(a,b,c){return{value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Mi="function"===typeof WeakMap?WeakMap:Map;function Ni(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi||(Oi=!0,Pi=d);Li(a,b)};return c}
function Qi(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li(a,b)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li(a,b);"function"!==typeof d&&(null===Ri?Ri=new Set([this]):Ri.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}
function Si(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi;var e=new Set;d.set(b,e)}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti.bind(null,a,b,c),b.then(a,a))}function Ui(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return}while(null!==a);return null}
function Vi(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi=ua.ReactCurrentOwner,dh=!1;function Xi(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d)}
function Yi(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I&&c&&vg(b);b.flags|=1;Xi(a,b,d,e);return b.child}
function $i(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie;if(c(g,d)&&a.ref===b.ref)return Zi(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie(f,d)&&a.ref===b.ref)if(dh=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=!0);else return b.lanes=a.lanes,Zi(a,b,e)}return cj(a,b,c,d,e)}
function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(ej,fj),fj|=c;else{if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G(ej,fj);fj|=d}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G(ej,fj),fj|=d;Xi(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H.current;f=Yf(b,f);ch(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I&&d&&vg(b);b.flags|=1;Xi(a,b,c,e);return b.child}
function hj(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b)}else f=!1;ch(b,e);if(null===b.stateNode)ij(a,b),Gi(b,c,d),Ii(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&Hi(b,g,d,l);jh=!1;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||jh?("function"===typeof m&&(Di(b,c,m,d),k=b.memoizedState),(h=jh||Fi(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1)}else{g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi(b,g,d,k);jh=!1;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||jh?("function"===typeof y&&(Di(b,c,y,d),n=b.memoizedState),(l=jh||Fi(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1)}return jj(a,b,c,d,f,e)}
function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),Zi(a,b,f);d=b.stateNode;Wi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);yh(a,b.containerInfo)}
function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return{baseLanes:a,cachePool:null,transitions:null}}
function oj(a,b,c){var d=b.pendingProps,e=L.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G(L,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki(Error(p(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p(419));d=Ki(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi(d,a,e,-1))}tj();d=Ki(Error(p(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c)}
function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e)}
function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi(a,b,d.children,c);d=L.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else{if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}G(L,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}wj(b,!0,c,null,f);break;case "together":wj(b,!1,null,null,void 0);break;default:b.memoizedState=null}return b.child}
function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2)}function Zi(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}
function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G(L,L.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G(L,L.current&1);a=Zi(a,b,c);return null!==a?a.sibling:null}G(L,L.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G(L,L.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi(a,b,c)}var zj,Aj,Bj,Cj;
zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Aj=function(){};
Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A({},e,{value:void 0});d=A({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf)}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,
c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4)};
function Dj(a,b){if(!I)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function S(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S(b),null;case 1:return Zf(b.type)&&$f(),S(b),null;case 3:d=b.stateNode;zh();E(Wf);E(H);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S(b);return null;case 5:Bh(b);var e=xh(wh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else{if(!d){if(null===b.stateNode)throw Error(p(166));S(b);return null}a=xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D("cancel",d);D("close",d);break;case "iframe":case "object":case "embed":D("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],d);break;case "source":D("error",d);break;case "img":case "image":case "link":D("error",
d);D("load",d);break;case "details":D("toggle",d);break;case "input":Za(d,f);D("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D("invalid",d);break;case "textarea":hb(d,f),D("invalid",d)}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D("scroll",d)}switch(c){case "input":Va(d);db(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf)}d=e;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;zj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D("cancel",a);D("close",a);e=d;break;case "iframe":case "object":case "embed":D("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],a);e=d;break;case "source":D("error",a);e=d;break;case "img":case "image":case "link":D("error",
a);D("load",a);e=d;break;case "details":D("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A({},d,{value:void 0});D("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D("invalid",a);break;default:e=d}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D("scroll",a):null!=k&&ta(a,f,k,g))}switch(c){case "input":Va(a);db(a,d,!1);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
!0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf)}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1}}d&&(b.flags|=4)}null!==b.ref&&(b.flags|=512,b.flags|=2097152)}S(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(p(166));c=xh(wh.current);xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1))}f&&(b.flags|=4)}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d}S(b);return null;case 13:E(L);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p(317));f[Of]=b}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S(b);f=!1}else null!==zg&&(Fj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L.current&1)?0===T&&(T=3):tj()));null!==b.updateQueue&&(b.flags|=4);S(b);return null;case 4:return zh(),
Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S(b),null;case 10:return ah(b.type._context),S(b),null;case 17:return Zf(b.type)&&$f(),S(b),null;case 19:E(L);f=b.memoizedState;if(null===f)return S(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,!1);else{if(0!==T||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G(L,L.current&1|2);return b.child}a=
a.sibling}null!==f.tail&&B()>Gj&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304)}else{if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I)return S(b),null}else 2*B()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g)}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B(),b.sibling=null,c=L.current,G(L,d?c&1|2:c&1),b;S(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S(b),b.subtreeFlags&6&&(b.flags|=8192)):S(b),null;case 24:return null;case 25:return null}throw Error(p(156,b.tag));}
function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E(Wf),E(H),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E(L);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p(340));Ig()}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E(L),null;case 4:return zh(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
null;case 24:return null;default:return null}}var Jj=!1,U=!1,Kj="function"===typeof WeakSet?WeakSet:Set,V=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null)}catch(d){W(a,b,d)}else c.current=null}function Mj(a,b,c){try{c()}catch(d){W(a,b,d)}}var Nj=!1;
function Oj(a,b){Cf=dd;a=Me();if(Ne(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode}q=y}c=-1===h||-1===k?null:{start:h,end:k}}else c=null}c=c||{start:0,end:0}}else c=null;Df={focusedElem:a,selectionRange:c};dd=!1;for(V=b;null!==V;)if(b=V,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V=a;else for(;null!==V;){b=V;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163));}}catch(F){W(b,b.return,F)}a=b.sibling;if(null!==a){a.return=b.return;V=a;break}V=b.return}n=Nj;Nj=!1;return n}
function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f)}e=e.next}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d()}c=c.next}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c}"function"===typeof b?b(a):b.current=a}}
function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child}if(!(a.flags&2))return a.stateNode}}
function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling}var X=null,Xj=!1;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling}
function Zj(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c)}catch(h){}switch(c.tag){case 5:U||Lj(c,b);case 6:var d=X,e=Xj;X=null;Yj(a,b,c);X=d;Xj=e;null!==X&&(Xj?(a=X,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X.removeChild(c.stateNode));break;case 18:null!==X&&(Xj?(a=X,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X,c.stateNode));break;case 4:d=X;e=Xj;X=c.stateNode.containerInfo;Xj=!0;
Yj(a,b,c);X=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next}while(e!==d)}Yj(a,b,c);break;case 1:if(!U&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount()}catch(h){W(c,b,h)}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U=(d=U)||null!==
c.memoizedState,Yj(a,b,c),U=d):Yj(a,b,c);break;default:Yj(a,b,c)}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X=h.stateNode;Xj=!1;break a;case 3:X=h.stateNode.containerInfo;Xj=!0;break a;case 4:X=h.stateNode.containerInfo;Xj=!0;break a}h=h.return}if(null===X)throw Error(p(160));Zj(f,g,e);X=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null}catch(l){W(e,b,l)}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling}
function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a)}catch(t){W(a,a.return,t)}try{Pj(5,a,a.return)}catch(t){W(a,a.return,t)}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"")}catch(t){W(a,a.return,t)}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l)}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1))}e[Pf]=f}catch(t){W(a,a.return,t)}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f}catch(t){W(a,a.return,t)}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo)}catch(t){W(a,a.return,t)}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U=(l=U)||m,ck(b,a),U=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V=a,m=a.child;null!==m;){for(q=V=m;null!==V;){r=V;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount()}catch(t){W(d,c,t)}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V=y):gk(q)}m=m.sibling}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g))}catch(t){W(a,a.return,t)}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps}catch(t){W(a,a.return,t)}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
a),ek(a)}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return}throw Error(p(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p(161));}}catch(k){W(a,a.return,k)}a.flags&=-3}b&4096&&(a.flags&=-4097)}function hk(a,b,c){V=a;ik(a,b,c)}
function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V;){var e=V,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U;h=Jj;var l=U;Jj=g;if((U=k)&&!l)for(V=e;null!==V;)g=V,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V=k):jk(e);for(;null!==f;)V=f,ik(f,b,c),f=f.sibling;V=e;Jj=h;U=l}kk(a,b,c)}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V=f):kk(a,b,c)}}
function kk(a){for(;null!==V;){var b=V;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U)if(null===c)d.componentDidMount();else{var e=b.elementType===b.type?c.memoizedProps:Ci(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate)}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode}sh(b,g,c)}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p(163));}U||b.flags&512&&Rj(b)}catch(r){W(b,b.return,r)}}if(b===a){V=null;break}c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return}}function gk(a){for(;null!==V;){var b=V;if(b===a){V=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return}}
function jk(a){for(;null!==V;){var b=V;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b)}catch(k){W(b,c,k)}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount()}catch(k){W(b,e,k)}}var f=b.return;try{Rj(b)}catch(k){W(b,f,k)}break;case 5:var g=b.return;try{Rj(b)}catch(k){W(b,g,k)}}}catch(k){W(b,b.return,k)}if(b===a){V=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V=h;break}V=b.return}}
var lk=Math.ceil,mk=ua.ReactCurrentDispatcher,nk=ua.ReactCurrentOwner,ok=ua.ReactCurrentBatchConfig,K=0,Q=null,Y=null,Z=0,fj=0,ej=Uf(0),T=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi=!1,Pi=null,Ri=null,vk=!1,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R(){return 0!==(K&6)?B():-1!==Ak?Ak:Ak=B()}
function yi(a){if(0===(a.mode&1))return 1;if(0!==(K&2)&&0!==Z)return Z&-Z;if(null!==Kg.transition)return 0===Bk&&(Bk=yc()),Bk;a=C;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p(185));Ac(a,c,d);if(0===(K&2)||a!==Q)a===Q&&(0===(K&2)&&(qk|=c),4===T&&Ck(a,Z)),Dk(a,d),1===c&&0===K&&0===(b.mode&1)&&(Gj=B()+500,fg&&jg())}
function Dk(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===Q?Z:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf(function(){0===(K&6)&&jg()}),c=null;else{switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc}c=Fk(c,Gk.bind(null,a))}a.callbackPriority=b;a.callbackNode=c}}
function Gk(a,b){Ak=-1;Bk=0;if(0!==(K&6))throw Error(p(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc(a,a===Q?Z:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else{b=d;var e=K;K|=2;var f=Jk();if(Q!==a||Z!==b)uk=null,Gj=B()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h)}while(1);$g();mk.current=f;K=e;null!==Y?b=0:(Q=null,Z=0,b=T)}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;if(6===b)Ck(a,d);
else{e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f}d=e;d=B()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p(329));}}}Dk(a,B());return a.callbackNode===c?Gk.bind(null,a):null}
function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a)}
function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He(f(),e))return!1}catch(g){return!1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else{if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return!0;b=b.return}b.sibling.return=b.return;b=b.sibling}}return!0}
function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d}}function Ek(a){if(0!==(K&6))throw Error(p(327));Hk();var b=uc(a,0);if(0===(b&1))return Dk(a,B()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Nk(a,d))}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B()),c;if(6===c)throw Error(p(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B());return null}
function Qk(a,b){var c=K;K|=1;try{return a(b)}finally{K=c,0===K&&(Gj=B()+500,fg&&jg())}}function Rk(a){null!==wk&&0===wk.tag&&0===(K&6)&&Hk();var b=K;K|=1;var c=ok.transition,d=C;try{if(ok.transition=null,C=1,a)return a()}finally{C=d,ok.transition=c,K=b,0===(K&6)&&jg()}}function Hj(){fj=ej.current;E(ej)}
function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:zh();E(Wf);E(H);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E(L);break;case 19:E(L);break;case 10:ah(d.type._context);break;case 22:case 23:Hj()}c=c.return}Q=a;Y=a=Pg(a.current,null);Z=fj=b;T=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g}c.pending=d}fh=null}return a}
function Mk(a,b){do{var c=Y;try{$g();Fh.current=Rh;if(Ih){for(var d=M.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}Ih=!1}Hh=0;O=N=M=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T=1;pk=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null)}var y=Ui(g);if(null!==y){y.flags&=-257;Vi(y,g,h,f,b);y.mode&1&&Si(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t}else n.add(k);break a}else{if(0===(b&1)){Si(f,l,b);tj();break a}k=Error(p(426))}}else if(I&&h.mode&1){var J=Ui(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi(J,g,h,f,b);Jg(Ji(k,h));break a}}f=k=Ji(k,h);4!==T&&(T=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Ni(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri||!Ri.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi(f,h,b);ph(f,F);break a}}f=f.return}while(null!==f)}Sk(c)}catch(na){b=na;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
function tj(){if(0===T||3===T||2===T)T=4;null===Q||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q,Z)}function Ik(a,b){var c=K;K|=2;var d=Jk();if(Q!==a||Z!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e)}while(1);$g();K=c;mk.current=d;if(null!==Y)throw Error(p(261));Q=null;Z=0;return T}function Tk(){for(;null!==Y;)Uk(Y)}function Lk(){for(;null!==Y&&!cc();)Uk(Y)}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y=b;nk.current=null}
function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y=c;return}}else{c=Ij(c,b);if(null!==c){c.flags&=32767;Y=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else{T=6;Y=null;return}}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===T&&(T=5)}function Pk(a,b,c){var d=C,e=ok.transition;try{ok.transition=null,C=1,Wk(a,b,c,d)}finally{ok.transition=e,C=d}return null}
function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K&6))throw Error(p(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===Q&&(Y=Q=null,Z=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=!0,Fk(hc,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
var g=C;C=1;var h=K;K|=4;nk.current=null;Oj(a,c);dk(c,a);Oe(Df);dd=!!Cf;Df=Cf=null;a.current=c;hk(c,a,e);dc();K=h;C=g;ok.transition=f}else a.current=c;vk&&(vk=!1,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri=null);mc(c.stateNode,d);Dk(a,B());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi)throw Oi=!1,a=Pi,Pi=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
function Hk(){if(null!==wk){var a=Dc(xk),b=ok.transition,c=C;try{ok.transition=null;C=16>a?16:a;if(null===wk)var d=!1;else{a=wk;wk=null;xk=0;if(0!==(K&6))throw Error(p(331));var e=K;K|=4;for(V=a.current;null!==V;){var f=V,g=f.child;if(0!==(V.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V=l;null!==V;){var m=V;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f)}var q=m.child;if(null!==q)q.return=m,V=q;else for(;null!==V;){m=V;var r=m.sibling,y=m.return;Sj(m);if(m===
l){V=null;break}if(null!==r){r.return=y;V=r;break}V=y}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J}while(null!==t)}}V=f}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V=g;else b:for(;null!==V;){f=V;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return)}var x=f.sibling;if(null!==x){x.return=f.return;V=x;break b}V=f.return}}var w=a.current;for(V=w;null!==V;){g=V;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V=u;else b:for(g=w;null!==V;){h=V;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h)}}catch(na){W(h,h.return,na)}if(h===g){V=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V=F;break b}V=h.return}}K=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a)}catch(na){}d=!0}return d}finally{C=c,ok.transition=b}}return!1}function Xk(a,b,c){b=Ji(c,b);b=Ni(a,b,1);a=nh(a,b,1);b=R();null!==a&&(Ac(a,1,b),Dk(a,b))}
function W(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri||!Ri.has(d))){a=Ji(c,a);a=Qi(b,a,1);b=nh(b,a,1);a=R();null!==b&&(Ac(b,1,a),Dk(b,a));break}}b=b.return}}
function Ti(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R();a.pingedLanes|=a.suspendedLanes&c;Q===a&&(Z&c)===c&&(4===T||3===T&&(Z&130023424)===Z&&500>B()-fk?Kk(a,0):rk|=c);Dk(a,b)}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=R();a=ih(a,b);null!==a&&(Ac(a,b,c),Dk(a,c))}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c)}
function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p(314));}null!==d&&d.delete(b);Yk(a,c)}var Vk;
Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)dh=!0;else{if(0===(a.lanes&c)&&0===(b.flags&128))return dh=!1,yj(a,b,c);dh=0!==(a.flags&131072)?!0:!1}else dh=!1,I&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf(b,H.current);ch(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei,b.stateNode=e,e._reactInternals=b,Ii(b,d,a,c),b=jj(null,b,d,!0,f,c)):(b.tag=0,I&&f&&vg(b),Xi(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi(null,b,d,a,c);break a;case 14:b=$i(null,b,d,Ci(d.type,a),c);break a}throw Error(p(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ji(Error(p(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji(Error(p(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I=!0,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else{Ig();if(d===e){b=Zi(a,b,c);break a}Xi(a,b,d,c)}b=b.child}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
gj(a,b),Xi(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),Yi(a,b,d,e,c);case 7:return Xi(a,b,b.pendingProps,c),b.child;case 8:return Xi(a,b,b.pendingProps.children,c),b.child;case 12:return Xi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He(f.value,g)){if(f.children===e.children&&!Wf.current){b=Zi(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
c,b);h.lanes|=c;break}k=k.next}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return}f=g}Xi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi(a,b,d,c),
b.child;case 14:return d=b.type,e=Ci(d,b.pendingProps),e=Ci(d.type,e),$i(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),ij(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,ch(b,c),Gi(b,d,e),Ii(b,d,e,c),jj(null,b,d,!0,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p(156,b.tag));};function Fk(a,b){return ac(a,b)}
function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Tg(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:!1};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null}function bl(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function dl(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return}while(null!==b);throw Error(p(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function el(a,b,c,d,e,f,g,h,k){a=bl(c,d,!0,a,e,f,g,h,k);a.context=dl(null);c=a.current;d=R();e=yi(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac(a,e,d);Dk(a,d);return a}function fl(a,b,c,d){var e=b.current,f=R(),g=yi(e);c=dl(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi(a,e,g,f),oh(a,e,g));return g}
function gl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function il(a,b){hl(a,b);(a=a.alternate)&&hl(a,b)}function jl(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a)};function ll(a){this._internalRoot=a}
ml.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p(409));fl(a,b,null,null)};ml.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl(null,a,null,null)});b[uf]=null}};function ml(a){this._internalRoot=a}
ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a)}};function nl(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl(){}
function ql(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl(g);f.call(a)}}var g=el(b,d,a,0,null,!1,!1,"",pl);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl(k);h.call(a)}}var k=bl(a,0,!1,null,null,!1,!1,"",pl);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl(b,k,c,d)});return k}
function rl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl(g);h.call(a)}}fl(b,g,a,e)}else g=ql(c,b,a,e,d);return gl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Dk(b,B()),0===(K&6)&&(Gj=B()+500,jg()))}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R();gi(b,a,1,c)}}),il(a,1)}};
Fc=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R();gi(b,a,134217728,c)}il(a,134217728)}};Gc=function(a){if(13===a.tag){var b=yi(a),c=ih(a,b);if(null!==c){var d=R();gi(c,a,b,d)}il(a,b)}};Hc=function(){return C};Ic=function(a,b){var c=C;try{return C=a,b()}finally{C=c}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p(90));Wa(d);bb(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Qk;Hb=Rk;
var sl={usingClientEntryPoint:!1,Events:[Cb,ue,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
var ul={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
jl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{kc=vl.inject(ul),lc=vl}catch(a){}}exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
exports.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p(200));return cl(a,b,null,c)};exports.createRoot=function(a,b){if(!nl(a))throw Error(p(299));var c=!1,d="",e=kl;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll(b)};
exports.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p(188));a=Object.keys(a).join(",");throw Error(p(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};exports.flushSync=function(a){return Rk(a)};exports.hydrate=function(a,b,c){if(!ol(b))throw Error(p(200));return rl(null,a,b,!0,c)};
exports.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=kl;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new ml(b)};exports.render=function(a,b,c){if(!ol(b))throw Error(p(200));return rl(null,a,b,!1,c)};exports.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p(40));return a._reactRootContainer?(Rk(function(){rl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null})}),!0):!1};exports.unstable_batchedUpdates=Qk;
exports.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p(200));if(null==a||void 0===a._reactInternals)throw Error(p(38));return rl(a,b,c,!1,d)};exports.version="18.3.1-next-f1338f8080-20240426";


/***/ },

/***/ 997
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;


var m = __webpack_require__(316);
if (true) {
  exports.H = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else // removed by dead control flow
{ var i; }


/***/ },

/***/ 316
(module, __unused_webpack_exports, __webpack_require__) {



function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) // removed by dead control flow
{}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(396);
} else // removed by dead control flow
{}


/***/ },

/***/ 921
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=__webpack_require__(155),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}__webpack_unused_export__=l;exports.jsx=q;exports.jsxs=q;


/***/ },

/***/ 18
(__unused_webpack_module, exports) {

/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=Symbol.for("react.element"),n=Symbol.for("react.portal"),p=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){if(null===a||"object"!==typeof a)return null;a=z&&a[z]||a["@@iterator"];return"function"===typeof a?a:null}
var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}E.prototype.isReactComponent={};
E.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}var H=G.prototype=new F;
H.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return{$$typeof:l,type:a,key:k,ref:h,props:c,_owner:K.current}}
function N(a,b){return{$$typeof:l,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return"object"===typeof a&&null!==a&&a.$$typeof===l}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\/+/g;function Q(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l:case n:h=!0}}if(h)return h=a,c=c(h),a=""===d?"."+Q(h,0):d,I(c)?(e="",null!=a&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q(k,g);h+=R(k,b,e,f,c)}else if(f=A(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b});-1===a._status&&(a._status=0,a._result=b)}if(1===a._status)return a._result.default;throw a._result;}
var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};function X(){throw Error("act(...) is not supported in production builds of React.");}
exports.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments)},e)},count:function(a){var b=0;S(a,function(){b++});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};exports.Component=E;exports.Fragment=p;exports.Profiler=r;exports.PureComponent=G;exports.StrictMode=q;exports.Suspense=w;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;exports.act=X;
exports.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g}return{$$typeof:l,type:a.type,key:c,ref:k,props:d,_owner:h}};exports.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};exports.createElement=M;exports.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};
exports.forwardRef=function(a){return{$$typeof:v,render:a}};exports.isValidElement=O;exports.lazy=function(a){return{$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};exports.memo=function(a,b){return{$$typeof:x,type:a,compare:void 0===b?null:b}};exports.startTransition=function(a){var b=V.transition;V.transition={};try{a()}finally{V.transition=b}};exports.unstable_act=X;exports.useCallback=function(a,b){return U.current.useCallback(a,b)};exports.useContext=function(a){return U.current.useContext(a)};
exports.useDebugValue=function(){};exports.useDeferredValue=function(a){return U.current.useDeferredValue(a)};exports.useEffect=function(a,b){return U.current.useEffect(a,b)};exports.useId=function(){return U.current.useId()};exports.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};exports.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};exports.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};
exports.useMemo=function(a,b){return U.current.useMemo(a,b)};exports.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};exports.useRef=function(a){return U.current.useRef(a)};exports.useState=function(a){return U.current.useState(a)};exports.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};exports.useTransition=function(){return U.current.useTransition()};exports.version="18.3.1";


/***/ },

/***/ 155
(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(18);
} else // removed by dead control flow
{}


/***/ },

/***/ 723
(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(921);
} else // removed by dead control flow
{}


/***/ },

/***/ 910
(__unused_webpack_module, exports) {

/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t)}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else{var b=h(t);null!==b&&K(H,b.startTime-a)}}
function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b)}else k(r);v=h(r)}if(null!==v)var w=!0;else{var m=h(t);null!==m&&K(H,m.startTime-b);w=!1}return w}finally{v=null,y=c,z=!1}}var N=!1,O=null,L=-1,P=5,Q=-1;
function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a)}finally{b?S():(N=!1,O=null)}}else N=!1}var S;if("function"===typeof F)S=function(){F(R)};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null)}}else S=function(){D(R,0)};function I(a){O=a;N||(N=!0,S())}function K(a,b){L=D(function(){a(exports.unstable_now())},b)}
exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J))};
exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y}var c=y;y=b;try{return a()}finally{y=c}};exports.unstable_pauseExecution=function(){};
exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=y;y=a;try{return b()}finally{y=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c}}};


/***/ },

/***/ 593
(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(910);
} else // removed by dead control flow
{}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// ./src/shared/field-patterns.ts
// Field detection patterns for auto-fill
const FIELD_PATTERNS = [
    // Name fields
    {
        type: "firstName",
        autocompleteValues: ["given-name", "first-name"],
        namePatterns: [/first.?name/i, /fname/i, /given.?name/i, /forename/i],
        idPatterns: [/first.?name/i, /fname/i],
        labelPatterns: [/first\s*name/i, /given\s*name/i, /forename/i],
        placeholderPatterns: [/first\s*name/i],
        negativePatterns: [/last/i, /company/i, /middle/i, /business/i],
    },
    {
        type: "lastName",
        autocompleteValues: ["family-name", "last-name"],
        namePatterns: [/last.?name/i, /lname/i, /surname/i, /family.?name/i],
        idPatterns: [/last.?name/i, /lname/i, /surname/i],
        labelPatterns: [/last\s*name/i, /surname/i, /family\s*name/i],
        negativePatterns: [/first/i, /company/i, /business/i],
    },
    {
        type: "fullName",
        autocompleteValues: ["name"],
        namePatterns: [/^name$/i, /full.?name/i, /your.?name/i, /candidate.?name/i],
        labelPatterns: [/^name$/i, /full\s*name/i, /your\s*name/i, /^name\s*\*/i],
        negativePatterns: [
            /company/i,
            /first/i,
            /last/i,
            /user/i,
            /business/i,
            /job/i,
        ],
    },
    // Contact fields
    {
        type: "email",
        autocompleteValues: ["email"],
        namePatterns: [/e?-?mail/i, /email.?address/i],
        idPatterns: [/e?-?mail/i],
        labelPatterns: [/e-?mail/i, /email\s*address/i],
        placeholderPatterns: [/e-?mail/i, /@/],
    },
    {
        type: "phone",
        autocompleteValues: ["tel", "tel-national", "tel-local"],
        namePatterns: [/phone/i, /mobile/i, /cell/i, /tel(?:ephone)?/i],
        labelPatterns: [
            /phone/i,
            /mobile/i,
            /cell/i,
            /telephone/i,
            /contact\s*number/i,
        ],
    },
    {
        type: "address",
        autocompleteValues: ["street-address", "address-line1"],
        namePatterns: [/address/i, /street/i],
        labelPatterns: [/address/i, /street/i],
        negativePatterns: [/email/i, /web/i, /url/i],
    },
    {
        type: "city",
        autocompleteValues: ["address-level2"],
        namePatterns: [/city/i, /town/i],
        labelPatterns: [/city/i, /town/i],
    },
    {
        type: "state",
        autocompleteValues: ["address-level1"],
        namePatterns: [/state/i, /province/i, /region/i],
        labelPatterns: [/state/i, /province/i, /region/i],
    },
    {
        type: "zipCode",
        autocompleteValues: ["postal-code"],
        namePatterns: [/zip/i, /postal/i, /postcode/i],
        labelPatterns: [/zip/i, /postal/i, /post\s*code/i],
    },
    {
        type: "country",
        autocompleteValues: ["country", "country-name"],
        namePatterns: [/country/i],
        labelPatterns: [/country/i],
    },
    // Social/Professional links
    {
        type: "linkedin",
        namePatterns: [/linkedin/i],
        labelPatterns: [/linkedin/i],
        placeholderPatterns: [/linkedin\.com/i, /linkedin/i],
    },
    {
        type: "github",
        namePatterns: [/github/i],
        labelPatterns: [/github/i],
        placeholderPatterns: [/github\.com/i, /github/i],
    },
    {
        type: "website",
        autocompleteValues: ["url"],
        namePatterns: [/website/i, /portfolio/i, /personal.?site/i, /blog/i],
        labelPatterns: [/website/i, /portfolio/i, /personal\s*(site|url)/i],
        negativePatterns: [/linkedin/i, /github/i, /company/i],
    },
    // Employment fields
    {
        type: "currentCompany",
        autocompleteValues: ["organization"],
        namePatterns: [
            /current.?company/i,
            /employer/i,
            /company.?name/i,
            /organization/i,
        ],
        labelPatterns: [
            /current\s*(company|employer)/i,
            /company\s*name/i,
            /employer/i,
        ],
        negativePatterns: [/previous/i, /past/i, /former/i],
    },
    {
        type: "currentTitle",
        autocompleteValues: ["organization-title"],
        namePatterns: [/current.?title/i, /job.?title/i, /position/i, /role/i],
        labelPatterns: [/current\s*(title|position|role)/i, /job\s*title/i],
        negativePatterns: [/previous/i, /past/i, /desired/i, /applying/i],
    },
    {
        type: "yearsExperience",
        namePatterns: [/years?.?(of)?.?experience/i, /experience.?years/i, /yoe/i],
        labelPatterns: [
            /years?\s*(of\s*)?experience/i,
            /total\s*experience/i,
            /how\s*many\s*years/i,
        ],
    },
    // Education fields
    {
        type: "school",
        namePatterns: [
            /school/i,
            /university/i,
            /college/i,
            /institution/i,
            /alma.?mater/i,
        ],
        labelPatterns: [/school/i, /university/i, /college/i, /institution/i],
        negativePatterns: [/high\s*school/i],
    },
    {
        type: "degree",
        namePatterns: [/degree/i, /qualification/i],
        labelPatterns: [/degree/i, /qualification/i, /level\s*of\s*education/i],
    },
    {
        type: "fieldOfStudy",
        namePatterns: [
            /field.?of.?study/i,
            /major/i,
            /concentration/i,
            /specialization/i,
        ],
        labelPatterns: [/field\s*of\s*study/i, /major/i, /area\s*of\s*study/i],
    },
    {
        type: "graduationYear",
        namePatterns: [/graduation.?(year|date)/i, /grad.?year/i],
        labelPatterns: [
            /graduation\s*(year|date)/i,
            /year\s*of\s*graduation/i,
            /when\s*did\s*you\s*graduate/i,
        ],
    },
    {
        type: "gpa",
        namePatterns: [/gpa/i, /grade.?point/i, /cgpa/i],
        labelPatterns: [/gpa/i, /grade\s*point/i, /cumulative\s*gpa/i],
    },
    // Documents
    {
        type: "resume",
        namePatterns: [/resume/i, /cv/i, /curriculum.?vitae/i],
        labelPatterns: [
            /resume/i,
            /cv/i,
            /curriculum\s*vitae/i,
            /upload\s*(your\s*)?resume/i,
        ],
    },
    {
        type: "coverLetter",
        namePatterns: [/cover.?letter/i, /motivation.?letter/i],
        labelPatterns: [/cover\s*letter/i, /motivation\s*letter/i],
    },
    // Compensation
    {
        type: "salary",
        namePatterns: [/salary/i, /compensation/i, /pay/i, /wage/i],
        labelPatterns: [
            /salary/i,
            /compensation/i,
            /expected\s*(salary|pay)/i,
            /desired\s*salary/i,
        ],
    },
    // Availability
    {
        type: "startDate",
        namePatterns: [/start.?date/i, /available.?date/i, /earliest.?start/i],
        labelPatterns: [
            /start\s*date/i,
            /when\s*can\s*you\s*start/i,
            /earliest\s*start/i,
            /availability/i,
        ],
        negativePatterns: [/end/i, /finish/i],
    },
    // Legal/Compliance
    {
        type: "workAuthorization",
        namePatterns: [
            /work.?auth/i,
            /authorized.?to.?work/i,
            /legally.?work/i,
            /work.?permit/i,
            /visa.?status/i,
        ],
        labelPatterns: [
            /authorized\s*to\s*work/i,
            /legally\s*(authorized|permitted)/i,
            /work\s*authorization/i,
            /right\s*to\s*work/i,
        ],
    },
    {
        type: "sponsorship",
        namePatterns: [/sponsor/i, /visa.?sponsor/i],
        labelPatterns: [
            /sponsor/i,
            /visa\s*sponsor/i,
            /require\s*sponsorship/i,
            /need\s*sponsorship/i,
        ],
    },
    // EEO fields
    {
        type: "veteranStatus",
        namePatterns: [/veteran/i, /military/i],
        labelPatterns: [/veteran/i, /military\s*status/i, /served\s*in/i],
    },
    {
        type: "disability",
        namePatterns: [/disability/i, /disabled/i],
        labelPatterns: [/disability/i, /disabled/i, /accommodation/i],
    },
    {
        type: "gender",
        namePatterns: [/gender/i, /sex/i],
        labelPatterns: [/gender/i, /sex/i],
        negativePatterns: [/identity/i],
    },
    {
        type: "ethnicity",
        namePatterns: [/ethnicity/i, /race/i, /ethnic/i],
        labelPatterns: [/ethnicity/i, /race/i, /ethnic\s*background/i],
    },
    // Skills
    {
        type: "skills",
        namePatterns: [/skills?/i, /expertise/i, /competenc/i],
        labelPatterns: [/skills?/i, /technical\s*skills/i, /key\s*skills/i],
    },
    // Summary/Bio
    {
        type: "summary",
        namePatterns: [
            /summary/i,
            /bio/i,
            /about.?you/i,
            /profile/i,
            /introduction/i,
        ],
        labelPatterns: [
            /summary/i,
            /professional\s*summary/i,
            /about\s*you/i,
            /tell\s*us\s*about/i,
            /bio/i,
        ],
        negativePatterns: [/job/i, /position/i],
    },
];
// Job site URL patterns for scraper detection
const JOB_SITE_PATTERNS = {
    linkedin: [
        /linkedin\.com\/jobs\/view\//,
        /linkedin\.com\/jobs\/search/,
        /linkedin\.com\/jobs\/collections/,
    ],
    indeed: [
        /indeed\.com\/viewjob/,
        /indeed\.com\/jobs/,
        /indeed\.com\/cmp\/.+\/jobs/,
    ],
    greenhouse: [/boards\.greenhouse\.io\//, /greenhouse\.io\/.*\/jobs\//],
    lever: [/jobs\.lever\.co\//, /lever\.co\/.*\/jobs\//],
    waterlooWorks: [/waterlooworks\.uwaterloo\.ca/],
    workday: [/myworkdayjobs\.com/, /workdayjobs\.com/],
};
function detectJobSite(url) {
    for (const [site, patterns] of Object.entries(JOB_SITE_PATTERNS)) {
        if (patterns.some((p) => p.test(url))) {
            return site;
        }
    }
    return "unknown";
}
// Common question patterns for learning system
const CUSTOM_QUESTION_INDICATORS = [
    /why.*(want|interested|apply|join)/i,
    /what.*(makes|attracted|excites)/i,
    /tell.*about.*yourself/i,
    /describe.*(situation|time|experience)/i,
    /how.*handle/i,
    /greatest.*(strength|weakness|achievement)/i,
    /where.*see.*yourself/i,
    /why.*should.*hire/i,
    /what.*contribute/i,
    /salary.*expectation/i,
    /additional.*information/i,
    /anything.*else/i,
];

;// ./src/content/auto-fill/field-detector.ts
// Field detection for auto-fill

class FieldDetector {
    detectFields(form) {
        const fields = [];
        const inputs = form.querySelectorAll("input, textarea, select");
        for (const input of inputs) {
            const element = input;
            // Skip hidden, disabled, or submit inputs
            if (this.shouldSkipElement(element))
                continue;
            const detection = this.detectFieldType(element);
            if (detection.fieldType !== "unknown" || detection.confidence > 0.1) {
                fields.push(detection);
            }
        }
        return fields;
    }
    shouldSkipElement(element) {
        const input = element;
        // Check computed style for visibility
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") {
            return true;
        }
        // Check disabled state
        if (input.disabled)
            return true;
        // Check input type
        const skipTypes = ["hidden", "submit", "button", "reset", "image", "file"];
        if (skipTypes.includes(input.type))
            return true;
        // Check if it's a CSRF/token field
        if (input.name?.includes("csrf") || input.name?.includes("token")) {
            return true;
        }
        return false;
    }
    detectFieldType(element) {
        const signals = this.gatherSignals(element);
        const scores = this.scoreAllPatterns(signals);
        // Get best match
        scores.sort((a, b) => b.confidence - a.confidence);
        const best = scores[0];
        // Determine if this is a custom question
        let fieldType = best?.fieldType || "unknown";
        let confidence = best?.confidence || 0;
        if (confidence < 0.3) {
            // Check if it looks like a custom question
            if (this.looksLikeCustomQuestion(signals)) {
                fieldType = "customQuestion";
                confidence = 0.5;
            }
        }
        return {
            element,
            fieldType,
            confidence,
            label: signals.label || undefined,
            placeholder: signals.placeholder || undefined,
        };
    }
    gatherSignals(element) {
        return {
            name: element.name?.toLowerCase() || "",
            id: element.id?.toLowerCase() || "",
            type: element.type || "text",
            placeholder: element.placeholder?.toLowerCase() || "",
            autocomplete: element.autocomplete || "",
            label: this.findLabel(element)?.toLowerCase() || "",
            ariaLabel: element.getAttribute("aria-label")?.toLowerCase() || "",
            nearbyText: this.getNearbyText(element)?.toLowerCase() || "",
            parentClasses: this.getParentClasses(element),
        };
    }
    scoreAllPatterns(signals) {
        return FIELD_PATTERNS.map((pattern) => ({
            fieldType: pattern.type,
            confidence: this.calculateConfidence(signals, pattern),
        }));
    }
    calculateConfidence(signals, pattern) {
        let score = 0;
        let maxScore = 0;
        // Weight different signals
        const weights = {
            autocomplete: 0.4,
            name: 0.2,
            id: 0.15,
            label: 0.15,
            placeholder: 0.1,
            ariaLabel: 0.1,
        };
        // Check autocomplete attribute (most reliable)
        if (signals.autocomplete &&
            pattern.autocompleteValues?.includes(signals.autocomplete)) {
            score += weights.autocomplete;
        }
        maxScore += weights.autocomplete;
        // Check name attribute
        if (pattern.namePatterns?.some((p) => p.test(signals.name))) {
            score += weights.name;
        }
        maxScore += weights.name;
        // Check ID
        if (pattern.idPatterns?.some((p) => p.test(signals.id))) {
            score += weights.id;
        }
        maxScore += weights.id;
        // Check label
        if (pattern.labelPatterns?.some((p) => p.test(signals.label))) {
            score += weights.label;
        }
        maxScore += weights.label;
        // Check placeholder
        if (pattern.placeholderPatterns?.some((p) => p.test(signals.placeholder))) {
            score += weights.placeholder;
        }
        maxScore += weights.placeholder;
        // Check aria-label
        if (pattern.labelPatterns?.some((p) => p.test(signals.ariaLabel))) {
            score += weights.ariaLabel;
        }
        maxScore += weights.ariaLabel;
        // Negative signals (reduce confidence if found)
        if (pattern.negativePatterns?.some((p) => p.test(signals.name) || p.test(signals.label) || p.test(signals.id))) {
            score -= 0.3;
        }
        return Math.max(0, maxScore > 0 ? score / maxScore : 0);
    }
    findLabel(element) {
        // Method 1: Explicit label via for attribute
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label?.textContent)
                return label.textContent.trim();
        }
        // Method 2: Wrapping label
        const parentLabel = element.closest("label");
        if (parentLabel?.textContent) {
            // Remove the input's value from label text
            const text = parentLabel.textContent.trim();
            const inputValue = element.value || "";
            return text.replace(inputValue, "").trim();
        }
        // Method 3: aria-labelledby
        const labelledBy = element.getAttribute("aria-labelledby");
        if (labelledBy) {
            const labelEl = document.getElementById(labelledBy);
            if (labelEl?.textContent)
                return labelEl.textContent.trim();
        }
        // Method 4: Previous sibling label
        let sibling = element.previousElementSibling;
        while (sibling) {
            if (sibling.tagName === "LABEL") {
                return sibling.textContent?.trim() || null;
            }
            sibling = sibling.previousElementSibling;
        }
        // Method 5: Parent's previous sibling label
        const parent = element.parentElement;
        if (parent) {
            let parentSibling = parent.previousElementSibling;
            if (parentSibling?.tagName === "LABEL") {
                return parentSibling.textContent?.trim() || null;
            }
        }
        return null;
    }
    getNearbyText(element) {
        const parent = element.closest('.form-group, .field, .input-wrapper, [class*="field"], [class*="input"]');
        if (parent) {
            const text = parent.textContent?.trim();
            if (text && text.length < 200)
                return text;
        }
        return null;
    }
    getParentClasses(element) {
        const classes = [];
        let current = element.parentElement;
        let depth = 0;
        while (current && depth < 3) {
            if (current.className) {
                classes.push(...current.className.split(" ").filter(Boolean));
            }
            current = current.parentElement;
            depth++;
        }
        return classes;
    }
    looksLikeCustomQuestion(signals) {
        const text = `${signals.label} ${signals.placeholder} ${signals.nearbyText}`;
        return CUSTOM_QUESTION_INDICATORS.some((pattern) => pattern.test(text));
    }
}

;// ./src/content/auto-fill/field-mapper.ts
// Field-to-profile value mapping
class FieldMapper {
    constructor(profile) {
        this.profile = profile;
    }
    mapFieldToValue(field) {
        const fieldType = field.fieldType;
        const mapping = this.getMappings();
        const mapper = mapping[fieldType];
        if (mapper) {
            return mapper();
        }
        return null;
    }
    getMappings() {
        const p = this.profile;
        const c = p.computed;
        return {
            // Name fields
            firstName: () => c?.firstName || null,
            lastName: () => c?.lastName || null,
            fullName: () => p.contact?.name || null,
            // Contact fields
            email: () => p.contact?.email || null,
            phone: () => p.contact?.phone || null,
            address: () => p.contact?.location || null,
            city: () => this.extractCity(p.contact?.location),
            state: () => this.extractState(p.contact?.location),
            zipCode: () => null, // Not typically stored
            country: () => this.extractCountry(p.contact?.location),
            // Social/Professional
            linkedin: () => p.contact?.linkedin || null,
            github: () => p.contact?.github || null,
            website: () => p.contact?.website || null,
            portfolio: () => p.contact?.website || null,
            // Employment
            currentCompany: () => c?.currentCompany || null,
            currentTitle: () => c?.currentTitle || null,
            yearsExperience: () => c?.yearsExperience?.toString() || null,
            // Education
            school: () => c?.mostRecentSchool || null,
            education: () => this.formatEducation(),
            degree: () => c?.mostRecentDegree || null,
            fieldOfStudy: () => c?.mostRecentField || null,
            graduationYear: () => c?.graduationYear || null,
            gpa: () => p.education?.[0]?.gpa || null,
            // Documents (return null, handled separately)
            resume: () => null,
            coverLetter: () => null,
            // Compensation
            salary: () => null, // User-specific, don't auto-fill
            salaryExpectation: () => null,
            // Availability
            startDate: () => null, // User-specific
            availability: () => null,
            // Work authorization (sensitive, don't auto-fill)
            workAuthorization: () => null,
            sponsorship: () => null,
            // EEO fields (sensitive, don't auto-fill)
            veteranStatus: () => null,
            disability: () => null,
            gender: () => null,
            ethnicity: () => null,
            // Skills/Summary
            skills: () => c?.skillsList || null,
            summary: () => p.summary || null,
            experience: () => this.formatExperience(),
            // Custom/Unknown (handled by learning system)
            customQuestion: () => null,
            unknown: () => null,
        };
    }
    extractCity(location) {
        if (!location)
            return null;
        // Common pattern: "City, State" or "City, State, Country"
        const parts = location.split(",").map((p) => p.trim());
        return parts[0] || null;
    }
    extractState(location) {
        if (!location)
            return null;
        const parts = location.split(",").map((p) => p.trim());
        if (parts.length >= 2) {
            // Handle "CA" or "California" or "CA 94105"
            const state = parts[1].split(" ")[0];
            return state || null;
        }
        return null;
    }
    extractCountry(location) {
        if (!location)
            return null;
        const parts = location.split(",").map((p) => p.trim());
        if (parts.length >= 3) {
            return parts[parts.length - 1];
        }
        // Default to USA if only city/state
        if (parts.length === 2) {
            return "United States";
        }
        return null;
    }
    formatEducation() {
        const edu = this.profile.education?.[0];
        if (!edu)
            return null;
        return `${edu.degree} in ${edu.field} from ${edu.institution}`;
    }
    formatExperience() {
        const exps = this.profile.experiences;
        if (!exps || exps.length === 0)
            return null;
        return exps
            .slice(0, 3)
            .map((exp) => {
            const period = exp.current
                ? `${exp.startDate} - Present`
                : `${exp.startDate} - ${exp.endDate}`;
            return `${exp.title} at ${exp.company} (${period})`;
        })
            .join("\n");
    }
    // Get all mapped values for a form
    getAllMappedValues(fields) {
        const values = new Map();
        for (const field of fields) {
            const value = this.mapFieldToValue(field);
            if (value) {
                values.set(field.element, value);
            }
        }
        return values;
    }
}

;// ./src/content/auto-fill/engine.ts
// Auto-fill engine orchestrator
class AutoFillEngine {
    constructor(detector, mapper) {
        this.detector = detector;
        this.mapper = mapper;
    }
    async fillForm(fields) {
        const result = {
            filled: 0,
            skipped: 0,
            errors: 0,
            details: [],
        };
        for (const field of fields) {
            try {
                const value = this.mapper.mapFieldToValue(field);
                if (!value) {
                    result.skipped++;
                    result.details.push({
                        fieldType: field.fieldType,
                        filled: false,
                    });
                    continue;
                }
                const filled = await this.fillField(field.element, value);
                if (filled) {
                    result.filled++;
                    result.details.push({
                        fieldType: field.fieldType,
                        filled: true,
                    });
                }
                else {
                    result.skipped++;
                    result.details.push({
                        fieldType: field.fieldType,
                        filled: false,
                    });
                }
            }
            catch (err) {
                result.errors++;
                result.details.push({
                    fieldType: field.fieldType,
                    filled: false,
                    error: err.message,
                });
            }
        }
        return result;
    }
    async fillField(element, value) {
        const tagName = element.tagName.toLowerCase();
        const inputType = element.type?.toLowerCase() || "text";
        // Handle different input types
        if (tagName === "select") {
            return this.fillSelect(element, value);
        }
        if (tagName === "textarea") {
            return this.fillTextInput(element, value);
        }
        if (tagName === "input") {
            switch (inputType) {
                case "text":
                case "email":
                case "tel":
                case "url":
                case "number":
                    return this.fillTextInput(element, value);
                case "checkbox":
                    return this.fillCheckbox(element, value);
                case "radio":
                    return this.fillRadio(element, value);
                case "date":
                    return this.fillDateInput(element, value);
                default:
                    return this.fillTextInput(element, value);
            }
        }
        return false;
    }
    fillTextInput(element, value) {
        // Focus the element
        element.focus();
        // Clear existing value
        element.value = "";
        // Set new value
        element.value = value;
        // Dispatch events to trigger validation and frameworks
        this.dispatchInputEvents(element);
        return element.value === value;
    }
    fillSelect(element, value) {
        const options = Array.from(element.options);
        const normalizedValue = value.toLowerCase();
        // Try exact match first
        let matchingOption = options.find((opt) => opt.value.toLowerCase() === normalizedValue ||
            opt.text.toLowerCase() === normalizedValue);
        // Try partial match
        if (!matchingOption) {
            matchingOption = options.find((opt) => opt.value.toLowerCase().includes(normalizedValue) ||
                opt.text.toLowerCase().includes(normalizedValue) ||
                normalizedValue.includes(opt.value.toLowerCase()) ||
                normalizedValue.includes(opt.text.toLowerCase()));
        }
        if (matchingOption) {
            element.value = matchingOption.value;
            this.dispatchInputEvents(element);
            return true;
        }
        return false;
    }
    fillCheckbox(element, value) {
        const shouldCheck = ["true", "yes", "1", "on"].includes(value.toLowerCase());
        element.checked = shouldCheck;
        this.dispatchInputEvents(element);
        return true;
    }
    fillRadio(element, value) {
        const normalizedValue = value.toLowerCase();
        // Find the radio group
        const name = element.name;
        if (!name)
            return false;
        const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
        for (const radio of radios) {
            const radioInput = radio;
            const radioValue = radioInput.value.toLowerCase();
            const radioLabel = this.getRadioLabel(radioInput)?.toLowerCase() || "";
            if (radioValue === normalizedValue ||
                radioLabel.includes(normalizedValue) ||
                normalizedValue.includes(radioValue)) {
                radioInput.checked = true;
                this.dispatchInputEvents(radioInput);
                return true;
            }
        }
        return false;
    }
    fillDateInput(element, value) {
        // Try to parse and format the date
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return false;
        // Format as YYYY-MM-DD for date input
        const formatted = date.toISOString().split("T")[0];
        element.value = formatted;
        this.dispatchInputEvents(element);
        return true;
    }
    getRadioLabel(radio) {
        // Check for associated label
        if (radio.id) {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label)
                return label.textContent?.trim() || null;
        }
        // Check for wrapping label
        const parent = radio.closest("label");
        if (parent) {
            return parent.textContent?.trim() || null;
        }
        // Check for next sibling text
        const next = radio.nextSibling;
        if (next?.nodeType === Node.TEXT_NODE) {
            return next.textContent?.trim() || null;
        }
        return null;
    }
    dispatchInputEvents(element) {
        // Dispatch events in order that most frameworks expect
        element.dispatchEvent(new Event("focus", { bubbles: true }));
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        element.dispatchEvent(new Event("blur", { bubbles: true }));
        // For React controlled components
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        if (nativeInputValueSetter && element instanceof HTMLInputElement) {
            const value = element.value;
            nativeInputValueSetter.call(element, value);
            element.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
}

;// ./src/content/scrapers/base-scraper.ts
// Base scraper interface and utilities
class BaseScraper {
    // Shared utilities
    extractTextContent(selector) {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || null;
    }
    extractHtmlContent(selector) {
        const el = document.querySelector(selector);
        return el?.innerHTML?.trim() || null;
    }
    extractAttribute(selector, attr) {
        const el = document.querySelector(selector);
        return el?.getAttribute(attr) || null;
    }
    extractAllText(selector) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements)
            .map((el) => el.textContent?.trim())
            .filter((text) => !!text);
    }
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el)
                return resolve(el);
            const observer = new MutationObserver((_, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found after ${timeout}ms`));
            }, timeout);
        });
    }
    extractRequirements(text) {
        const requirements = [];
        // Split by common bullet patterns
        const lines = text.split(/\n|•|◦|◆|▪|●|-\s|\*\s/);
        for (const line of lines) {
            const cleaned = line.trim();
            if (cleaned.length > 20 && cleaned.length < 500) {
                // Check if it looks like a requirement
                if (cleaned.match(/^(you|we|the|must|should|will|experience|proficiency|knowledge|ability|strong|excellent)/i) ||
                    cleaned.match(/required|preferred|bonus|plus/i) ||
                    cleaned.match(/^\d+\+?\s*years?/i)) {
                    requirements.push(cleaned);
                }
            }
        }
        return requirements.slice(0, 15);
    }
    extractKeywords(text) {
        const keywords = new Set();
        // Common tech skills patterns
        const techPatterns = [
            /\b(react|angular|vue|svelte|next\.?js|nuxt)\b/gi,
            /\b(node\.?js|express|fastify|nest\.?js)\b/gi,
            /\b(python|django|flask|fastapi)\b/gi,
            /\b(java|spring|kotlin)\b/gi,
            /\b(go|golang|rust|c\+\+|c#|\.net)\b/gi,
            /\b(typescript|javascript|es6)\b/gi,
            /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch)\b/gi,
            /\b(aws|gcp|azure|docker|kubernetes|k8s)\b/gi,
            /\b(git|ci\/cd|jenkins|github\s*actions)\b/gi,
            /\b(graphql|rest|api|microservices)\b/gi,
        ];
        for (const pattern of techPatterns) {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach((m) => keywords.add(m.toLowerCase().trim()));
            }
        }
        return Array.from(keywords);
    }
    detectJobType(text) {
        const lower = text.toLowerCase();
        if (lower.includes("intern") ||
            lower.includes("internship") ||
            lower.includes("co-op")) {
            return "internship";
        }
        if (lower.includes("contract") || lower.includes("contractor")) {
            return "contract";
        }
        if (lower.includes("part-time") || lower.includes("part time")) {
            return "part-time";
        }
        if (lower.includes("full-time") || lower.includes("full time")) {
            return "full-time";
        }
        return undefined;
    }
    detectRemote(text) {
        const lower = text.toLowerCase();
        return (lower.includes("remote") ||
            lower.includes("work from home") ||
            lower.includes("wfh") ||
            lower.includes("fully distributed") ||
            lower.includes("anywhere"));
    }
    extractSalary(text) {
        // Match salary patterns like $100,000 - $150,000 or $100k - $150k
        const pattern = /\$[\d,]+(?:k)?(?:\s*[-–]\s*\$[\d,]+(?:k)?)?(?:\s*(?:per|\/)\s*(?:year|yr|annum|annual|hour|hr))?/gi;
        const match = pattern.exec(text);
        return match ? match[0] : undefined;
    }
    cleanDescription(html) {
        // Remove HTML tags but preserve line breaks
        return html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/<\/li>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }
}

;// ./src/content/scrapers/linkedin-scraper.ts
// LinkedIn job scraper

class LinkedInScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = "linkedin";
        this.urlPatterns = [
            /linkedin\.com\/jobs\/view\/(\d+)/,
            /linkedin\.com\/jobs\/search/,
            /linkedin\.com\/jobs\/collections/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job details to load
        try {
            await this.waitForElement(".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title", 3000);
        }
        catch {
            // Try alternative selectors
        }
        // Try multiple selector strategies (LinkedIn changes DOM frequently)
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log("[Columbus] LinkedIn scraper: Missing required fields", {
                title,
                company,
                description: !!description,
            });
            return null;
        }
        // Try to extract from structured data
        const structuredData = this.extractStructuredData();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobType(description),
            remote: this.detectRemote(location || "") || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job cards in search results
        const jobCards = document.querySelectorAll(".job-card-container, .jobs-search-results__list-item, .scaffold-layout__list-item");
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('.job-card-list__title, .job-card-container__link, a[data-control-name="job_card_title"]');
                const companyEl = card.querySelector(".job-card-container__company-name, .job-card-container__primary-description");
                const locationEl = card.querySelector(".job-card-container__metadata-item");
                const title = titleEl?.textContent?.trim();
                const company = companyEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const url = titleEl?.href;
                if (title && company && url) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: "", // Would need to navigate to get full description
                        requirements: [],
                        url,
                        source: this.source,
                    });
                }
            }
            catch (err) {
                console.error("[Columbus] Error scraping job card:", err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            ".job-details-jobs-unified-top-card__job-title",
            ".jobs-unified-top-card__job-title",
            ".t-24.job-details-jobs-unified-top-card__job-title",
            "h1.t-24",
            ".jobs-top-card__job-title",
            'h1[class*="job-title"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCompany() {
        const selectors = [
            ".job-details-jobs-unified-top-card__company-name",
            ".jobs-unified-top-card__company-name",
            ".jobs-top-card__company-url",
            'a[data-tracking-control-name="public_jobs_topcard-org-name"]',
            ".job-details-jobs-unified-top-card__primary-description-container a",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            ".job-details-jobs-unified-top-card__bullet",
            ".jobs-unified-top-card__bullet",
            ".jobs-top-card__bullet",
            ".job-details-jobs-unified-top-card__primary-description-container .t-black--light",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && !text.includes("applicant") && !text.includes("ago")) {
                return text;
            }
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            ".jobs-description__content",
            ".jobs-description-content__text",
            ".jobs-box__html-content",
            "#job-details",
            ".jobs-description",
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    extractJobId() {
        const match = window.location.href.match(/\/view\/(\d+)/);
        return match?.[1];
    }
    extractStructuredData() {
        try {
            const ldJson = document.querySelector('script[type="application/ld+json"]');
            if (!ldJson?.textContent)
                return null;
            const data = JSON.parse(ldJson.textContent);
            return {
                location: data.jobLocation?.address?.addressLocality,
                salary: data.baseSalary?.value
                    ? `$${data.baseSalary.value.minValue || ""}-${data.baseSalary.value.maxValue || ""}`
                    : undefined,
                postedAt: data.datePosted,
            };
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/waterloo-works-scraper.ts
// Waterloo Works job scraper (University of Waterloo co-op portal).
//
// Targets the modern student posting-search UI (body.new-student__posting-search).
// The legacy Orbis-era selectors (#postingDiv, .posting-details, .job-listing-table)
// are no longer present on the production site; this scraper does not try to
// support both — if WW reverts or a different surface appears, add a branch.

// Field labels from the live UI. Each entry lists prefixes we want to match
// against the .label text (which is normalized — trailing colons and whitespace
// stripped before comparison). The first matching candidate wins per row.
const FIELD_LABELS = {
    title: ["Job Title"],
    summary: ["Job Summary"],
    responsibilities: ["Job Responsibilities", "Responsibilities"],
    requirements: [
        "Required Skills",
        "Targeted Skills",
        "Targeted Degrees and Disciplines",
    ],
    organization: ["Organization", "Employer", "Company"],
    // Modern WW splits location across multiple labelled rows; we collect each
    // piece separately and stitch them in composeLocation().
    locationCity: ["Job - City"],
    locationRegion: ["Job - Province/State", "Job - Province / State"],
    locationCountry: ["Job - Country"],
    locationFull: [
        "Job Location",
        "Location",
        "Job - City, Province / State, Country",
    ],
    employmentArrangement: ["Employment Location Arrangement"],
    workTerm: ["Work Term"],
    workTermDuration: ["Work Term Duration"],
    level: ["Level"],
    openings: ["Number of Job Openings"],
    deadline: ["Application Deadline", "Deadline"],
    salary: [
        "Compensation and Benefits Information",
        "Compensation and Benefits",
        "Compensation",
        "Salary",
    ],
    jobType: ["Job Type"],
};
class WaterlooWorksScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = "waterlooworks";
        this.urlPatterns = [/waterlooworks\.uwaterloo\.ca/];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        if (this.isLoginPage()) {
            console.log("[Columbus] Waterloo Works: Please log in first");
            return null;
        }
        try {
            await this.waitForElement(".dashboard-header__posting-title", 3000);
        }
        catch {
            // No posting panel open — not a scrape error, just nothing to scrape.
            return null;
        }
        const { sourceJobId, title: panelTitle } = this.parsePostingHeader();
        const fields = this.collectFields();
        const title = fields.title || panelTitle;
        const company = fields.organization;
        const description = this.composeDescription(fields);
        if (!title || !description) {
            console.log("[Columbus] Waterloo Works scraper: Missing title or description");
            return null;
        }
        const location = this.composeLocation(fields);
        return {
            title,
            company: company || "Unknown Employer",
            location,
            description,
            requirements: this.parseBulletList(fields.requirements) ||
                this.extractRequirements(description),
            responsibilities: this.parseBulletList(fields.responsibilities),
            keywords: this.extractKeywords(description),
            // Slothing's extension schema caps optional strings at 500 chars and
            // WaterlooWorks puts the full benefits blurb in "Compensation and
            // Benefits". Take the first line/sentence so wage ranges survive.
            salary: this.condenseSalary(fields.salary),
            type: this.detectJobType(fields.jobType || description) || "internship",
            remote: this.detectRemoteFromFields(fields, location, description),
            url: window.location.href,
            source: this.source,
            sourceJobId,
            deadline: fields.deadline,
        };
    }
    async scrapeJobList() {
        // Modern WaterlooWorks renders the postings list in a virtualized SPA view
        // and the row summaries don't include full descriptions. Bulk-import from
        // the list view is provided by the orchestrator (see
        // waterloo-works-orchestrator.ts), which walks each row, opens its detail
        // panel, and calls scrapeJobListing() per row. scrapeJobList() itself stays
        // empty so the generic auto-detect path doesn't accidentally pick it up.
        return [];
    }
    isLoginPage() {
        const url = window.location.href.toLowerCase();
        return (url.includes("/cas/") ||
            url.includes("/login") ||
            url.includes("/signin") ||
            document.querySelector('input[type="password"]') !== null);
    }
    parsePostingHeader() {
        const header = document.querySelector(".dashboard-header__posting-title");
        if (!header)
            return {};
        const h2Text = header.querySelector("h2")?.textContent?.trim();
        const idMatch = (header.textContent || "").match(/\b(\d{4,10})\b/);
        return { sourceJobId: idMatch?.[1], title: h2Text };
    }
    collectFields() {
        const bag = {};
        const blocks = document.querySelectorAll(".tag__key-value-list.js--question--container");
        for (const block of blocks) {
            const labelRaw = block.querySelector(".label")?.textContent?.trim();
            if (!labelRaw)
                continue;
            const label = this.normalizeLabel(labelRaw);
            const valueEl = block.querySelector(".value");
            const value = valueEl
                ? valueEl.innerHTML
                : this.stripLabelFromBlock(block, labelRaw);
            if (!value)
                continue;
            this.assignField(bag, label, value);
        }
        return bag;
    }
    // "Work Term:  " → "work term"
    normalizeLabel(label) {
        return label
            .replace(/\s+/g, " ")
            .replace(/[:\s]+$/, "")
            .toLowerCase();
    }
    stripLabelFromBlock(block, label) {
        const clone = block.cloneNode(true);
        clone.querySelector(".label")?.remove();
        return (clone.innerHTML.trim() ||
            clone.textContent?.replace(label, "").trim() ||
            "");
    }
    assignField(bag, normalizedLabel, htmlValue) {
        const cleaned = this.cleanDescription(htmlValue);
        for (const [key, candidates] of Object.entries(FIELD_LABELS)) {
            if (candidates.some((c) => normalizedLabel.startsWith(c.toLowerCase()))) {
                if (!bag[key]) {
                    bag[key] =
                        key === "responsibilities" ||
                            key === "requirements" ||
                            key === "summary"
                            ? htmlValue // keep HTML for bullet parsing
                            : cleaned;
                }
                return;
            }
        }
    }
    composeDescription(fields) {
        const parts = [];
        if (fields.summary)
            parts.push(this.cleanDescription(fields.summary));
        if (fields.responsibilities) {
            parts.push("Responsibilities:");
            parts.push(this.cleanDescription(fields.responsibilities));
        }
        if (fields.requirements) {
            parts.push("Required Skills:");
            parts.push(this.cleanDescription(fields.requirements));
        }
        return parts.filter(Boolean).join("\n\n").trim();
    }
    composeLocation(fields) {
        if (fields.locationFull)
            return fields.locationFull;
        const pieces = [
            fields.locationCity,
            fields.locationRegion,
            fields.locationCountry,
        ]
            .map((p) => p?.trim())
            .filter((p) => !!p && p.length > 0);
        return pieces.length > 0 ? pieces.join(", ") : undefined;
    }
    detectRemoteFromFields(fields, location, description) {
        const arrangement = (fields.employmentArrangement || "").toLowerCase();
        if (/remote|virtual|work from home|distributed/.test(arrangement))
            return true;
        if (/hybrid/.test(arrangement))
            return true; // hybrid implies some remote
        return this.detectRemote(location || "") || this.detectRemote(description);
    }
    condenseSalary(raw) {
        if (!raw)
            return undefined;
        const trimmed = raw.trim();
        if (trimmed.length === 0)
            return undefined;
        // Prefer the first line / sentence — usually the wage range. If still too
        // long, hard-cap at 480 chars with an ellipsis so the schema validator
        // accepts it (limit is 500).
        const firstChunk = trimmed.split(/\n\n|\n(?=[A-Z])/)[0]?.trim() || trimmed;
        if (firstChunk.length <= 480)
            return firstChunk;
        return firstChunk.slice(0, 477) + "...";
    }
    parseBulletList(html) {
        if (!html)
            return undefined;
        const container = document.createElement("div");
        container.innerHTML = html;
        const items = Array.from(container.querySelectorAll("li"))
            .map((li) => li.textContent?.trim() || "")
            .filter((t) => t.length > 0);
        return items.length > 0 ? items : undefined;
    }
}

;// ./src/content/scrapers/indeed-scraper.ts
// Indeed job scraper

class IndeedScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = "indeed";
        this.urlPatterns = [
            /indeed\.com\/viewjob/,
            /indeed\.com\/jobs\//,
            /indeed\.com\/job\//,
            /indeed\.com\/rc\/clk/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job details to load
        try {
            await this.waitForElement('.jobsearch-JobInfoHeader-title, [data-testid="jobsearch-JobInfoHeader-title"]', 3000);
        }
        catch {
            // Continue with available data
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log("[Columbus] Indeed scraper: Missing required fields", {
                title,
                company,
                description: !!description,
            });
            return null;
        }
        const structuredData = this.extractStructuredData();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalaryFromPage() ||
                this.extractSalary(description) ||
                structuredData?.salary,
            type: this.detectJobType(description),
            remote: this.detectRemote(location || "") || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job cards in search results
        const jobCards = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li, [data-testid="job-card"]');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('.jobTitle, [data-testid="jobTitle"], h2.jobTitle a, .jcs-JobTitle');
                const companyEl = card.querySelector('.companyName, [data-testid="company-name"], .company_location .companyName');
                const locationEl = card.querySelector('.companyLocation, [data-testid="text-location"], .company_location .companyLocation');
                const salaryEl = card.querySelector('.salary-snippet-container, [data-testid="attribute_snippet_testid"], .estimated-salary');
                const title = titleEl?.textContent?.trim();
                const company = companyEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const salary = salaryEl?.textContent?.trim();
                // Get URL from title link or data attribute
                let url = titleEl?.href;
                if (!url) {
                    const jobKey = card.getAttribute("data-jk");
                    if (jobKey) {
                        url = `https://www.indeed.com/viewjob?jk=${jobKey}`;
                    }
                }
                if (title && company && url) {
                    jobs.push({
                        title,
                        company,
                        location,
                        salary,
                        description: "",
                        requirements: [],
                        url,
                        source: this.source,
                        sourceJobId: this.extractJobIdFromUrl(url),
                    });
                }
            }
            catch (err) {
                console.error("[Columbus] Error scraping Indeed job card:", err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            ".jobsearch-JobInfoHeader-title",
            '[data-testid="jobsearch-JobInfoHeader-title"]',
            "h1.jobsearch-JobInfoHeader-title",
            ".icl-u-xs-mb--xs h1",
            'h1[class*="JobInfoHeader"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCompany() {
        const selectors = [
            '[data-testid="inlineHeader-companyName"] a',
            '[data-testid="inlineHeader-companyName"]',
            ".jobsearch-InlineCompanyRating-companyHeader a",
            ".jobsearch-InlineCompanyRating a",
            ".icl-u-lg-mr--sm a",
            '[data-company-name="true"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            '[data-testid="inlineHeader-companyLocation"]',
            '[data-testid="job-location"]',
            ".jobsearch-JobInfoHeader-subtitle > div:nth-child(2)",
            ".jobsearch-InlineCompanyRating + div",
            ".icl-u-xs-mt--xs .icl-u-textColor--secondary",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && !text.includes("reviews") && !text.includes("rating")) {
                return text;
            }
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            "#jobDescriptionText",
            '[data-testid="jobDescriptionText"]',
            ".jobsearch-jobDescriptionText",
            ".jobsearch-JobComponent-description",
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    extractSalaryFromPage() {
        const selectors = [
            '[data-testid="jobsearch-JobMetadataHeader-salaryInfo"]',
            ".jobsearch-JobMetadataHeader-salaryInfo",
            "#salaryInfoAndJobType .attribute_snippet",
            ".jobsearch-JobInfoHeader-salary",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.includes("$")) {
                return text;
            }
        }
        return undefined;
    }
    extractJobId() {
        // From URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const jk = urlParams.get("jk");
        if (jk)
            return jk;
        // From URL path
        const match = window.location.href.match(/\/job\/([a-f0-9]+)/i);
        return match?.[1];
    }
    extractJobIdFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const jk = urlObj.searchParams.get("jk");
            if (jk)
                return jk;
            const match = url.match(/\/job\/([a-f0-9]+)/i);
            return match?.[1];
        }
        catch {
            return undefined;
        }
    }
    extractStructuredData() {
        try {
            const ldJson = document.querySelector('script[type="application/ld+json"]');
            if (!ldJson?.textContent)
                return null;
            const data = JSON.parse(ldJson.textContent);
            // Indeed may have an array of structured data
            const jobData = Array.isArray(data)
                ? data.find((d) => d["@type"] === "JobPosting")
                : data;
            if (!jobData || jobData["@type"] !== "JobPosting")
                return null;
            return {
                location: jobData.jobLocation?.address?.addressLocality ||
                    jobData.jobLocation?.address?.name,
                salary: jobData.baseSalary?.value
                    ? `$${jobData.baseSalary.value.minValue || ""}-${jobData.baseSalary.value.maxValue || ""} ${jobData.baseSalary.value.unitText || ""}`
                    : undefined,
                postedAt: jobData.datePosted,
            };
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/greenhouse-scraper.ts
// Greenhouse job board scraper

class GreenhouseScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = "greenhouse";
        this.urlPatterns = [
            /boards\.greenhouse\.io\/[\w-]+\/jobs\/\d+/,
            /[\w-]+\.greenhouse\.io\/jobs\/\d+/,
            /greenhouse\.io\/embed\/job_app/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job content to load
        try {
            await this.waitForElement(".app-title, #header .company-name, .job-title", 3000);
        }
        catch {
            // Continue with available data
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log("[Columbus] Greenhouse scraper: Missing required fields", {
                title,
                company,
                description: !!description,
            });
            return null;
        }
        const structuredData = this.extractStructuredData();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobType(description) || structuredData?.type,
            remote: this.detectRemote(location || "") || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job cards on department/listing pages
        const jobCards = document.querySelectorAll('.opening, .job-post, [data-mapped="true"], section.level-0 > div');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector("a, .opening-title, .job-title");
                const locationEl = card.querySelector(".location, .job-location, span:last-child");
                const title = titleEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const url = titleEl?.href;
                // Company is usually in header
                const company = this.extractCompany();
                if (title && url && company) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: "",
                        requirements: [],
                        url,
                        source: this.source,
                        sourceJobId: this.extractJobIdFromUrl(url),
                    });
                }
            }
            catch (err) {
                console.error("[Columbus] Error scraping Greenhouse job card:", err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            ".app-title",
            ".job-title",
            "h1.heading",
            ".job-info h1",
            "#header h1",
            'h1[class*="job"]',
            ".hero h1",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        // Try structured data
        const ldJson = this.extractStructuredData();
        if (ldJson?.title)
            return ldJson.title;
        return null;
    }
    extractCompany() {
        const selectors = [
            ".company-name",
            "#header .company-name",
            ".logo-wrapper img[alt]",
            ".company-header .name",
            'meta[property="og:site_name"]',
        ];
        for (const selector of selectors) {
            if (selector.includes("meta")) {
                const meta = document.querySelector(selector);
                const content = meta?.getAttribute("content");
                if (content)
                    return content;
            }
            else if (selector.includes("img[alt]")) {
                const img = document.querySelector(selector);
                const alt = img?.getAttribute("alt");
                if (alt)
                    return alt;
            }
            else {
                const text = this.extractTextContent(selector);
                if (text)
                    return text;
            }
        }
        // Extract from URL (boards.greenhouse.io/COMPANY/jobs/...)
        const match = window.location.href.match(/greenhouse\.io\/([^/]+)/);
        if (match && match[1] !== "jobs") {
            return match[1]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            ".location",
            ".job-location",
            ".company-location",
            ".job-info .location",
            "#header .location",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            "#content",
            ".job-description",
            ".content-wrapper .content",
            "#job_description",
            ".job-content",
            ".job-info .content",
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html && html.length > 100) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    extractJobId() {
        // From URL: boards.greenhouse.io/company/jobs/12345
        const match = window.location.href.match(/\/jobs\/(\d+)/);
        return match?.[1];
    }
    extractJobIdFromUrl(url) {
        const match = url.match(/\/jobs\/(\d+)/);
        return match?.[1];
    }
    extractStructuredData() {
        try {
            const ldJsonElements = document.querySelectorAll('script[type="application/ld+json"]');
            for (const el of ldJsonElements) {
                if (!el.textContent)
                    continue;
                const data = JSON.parse(el.textContent);
                const jobData = Array.isArray(data)
                    ? data.find((d) => d["@type"] === "JobPosting")
                    : data;
                if (!jobData || jobData["@type"] !== "JobPosting")
                    continue;
                const employmentType = jobData.employmentType?.toLowerCase();
                let type;
                if (employmentType?.includes("full"))
                    type = "full-time";
                else if (employmentType?.includes("part"))
                    type = "part-time";
                else if (employmentType?.includes("contract"))
                    type = "contract";
                else if (employmentType?.includes("intern"))
                    type = "internship";
                return {
                    title: jobData.title,
                    location: typeof jobData.jobLocation === "string"
                        ? jobData.jobLocation
                        : jobData.jobLocation?.address?.addressLocality ||
                            jobData.jobLocation?.address?.name ||
                            jobData.jobLocation?.name,
                    salary: jobData.baseSalary?.value
                        ? `$${jobData.baseSalary.value.minValue || ""}-${jobData.baseSalary.value.maxValue || ""}`
                        : undefined,
                    postedAt: jobData.datePosted,
                    type,
                };
            }
            return null;
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/lever-scraper.ts
// Lever job board scraper

class LeverScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = "lever";
        this.urlPatterns = [
            /jobs\.lever\.co\/[\w-]+\/[\w-]+/,
            /[\w-]+\.lever\.co\/[\w-]+/,
        ];
    }
    canHandle(url) {
        return this.urlPatterns.some((p) => p.test(url));
    }
    async scrapeJobListing() {
        // Wait for job content to load
        try {
            await this.waitForElement(".posting-headline h2, .posting-headline h1, .section-wrapper", 3000);
        }
        catch {
            // Continue with available data
        }
        const title = this.extractJobTitle();
        const company = this.extractCompany();
        const location = this.extractLocation();
        const description = this.extractDescription();
        if (!title || !company || !description) {
            console.log("[Columbus] Lever scraper: Missing required fields", {
                title,
                company,
                description: !!description,
            });
            return null;
        }
        const structuredData = this.extractStructuredData();
        const commitment = this.extractCommitment();
        return {
            title,
            company,
            location: location || structuredData?.location,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description) || structuredData?.salary,
            type: this.detectJobTypeFromCommitment(commitment) ||
                this.detectJobType(description),
            remote: this.detectRemote(location || "") || this.detectRemote(description),
            url: window.location.href,
            source: this.source,
            sourceJobId: this.extractJobId(),
            postedAt: structuredData?.postedAt,
        };
    }
    async scrapeJobList() {
        const jobs = [];
        // Job postings on company page
        const jobCards = document.querySelectorAll('.posting, [data-qa="posting-name"]');
        for (const card of jobCards) {
            try {
                const titleEl = card.querySelector('.posting-title h5, .posting-name, a[data-qa="posting-name"]');
                const locationEl = card.querySelector(".location, .posting-categories .sort-by-location, .workplaceTypes");
                const commitmentEl = card.querySelector(".commitment, .posting-categories .sort-by-commitment");
                const title = titleEl?.textContent?.trim();
                const location = locationEl?.textContent?.trim();
                const commitment = commitmentEl?.textContent?.trim();
                const url = card.querySelector('a.posting-title, a[data-qa="posting-name"]')?.href || card.href;
                const company = this.extractCompany();
                if (title && url && company) {
                    jobs.push({
                        title,
                        company,
                        location,
                        description: "",
                        requirements: [],
                        url,
                        source: this.source,
                        sourceJobId: this.extractJobIdFromUrl(url),
                        type: this.detectJobTypeFromCommitment(commitment ?? null),
                    });
                }
            }
            catch (err) {
                console.error("[Columbus] Error scraping Lever job card:", err);
            }
        }
        return jobs;
    }
    extractJobTitle() {
        const selectors = [
            ".posting-headline h2",
            ".posting-headline h1",
            '[data-qa="posting-name"]',
            ".posting-header h2",
            ".section.page-centered.posting-header h1",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCompany() {
        // Try logo alt text
        const logo = document.querySelector(".main-header-logo img, .posting-header .logo img, header img");
        if (logo) {
            const alt = logo.getAttribute("alt");
            if (alt && alt !== "Company Logo")
                return alt;
        }
        // Try page title
        const pageTitle = document.title;
        if (pageTitle) {
            // Format: "Job Title - Company Name"
            const parts = pageTitle.split(" - ");
            if (parts.length >= 2) {
                return parts[parts.length - 1].replace(" Jobs", "").trim();
            }
        }
        // Extract from URL
        const match = window.location.href.match(/lever\.co\/([^/]+)/);
        if (match) {
            return match[1]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
        }
        return null;
    }
    extractLocation() {
        const selectors = [
            ".posting-categories .location",
            ".posting-headline .location",
            ".sort-by-location",
            ".workplaceTypes",
            '[data-qa="posting-location"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractCommitment() {
        const selectors = [
            ".posting-categories .commitment",
            ".sort-by-commitment",
            '[data-qa="posting-commitment"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text)
                return text;
        }
        return null;
    }
    extractDescription() {
        const selectors = [
            ".posting-page .content",
            ".section-wrapper.page-full-width",
            ".section.page-centered",
            '[data-qa="job-description"]',
            ".posting-description",
        ];
        for (const selector of selectors) {
            // For Lever, we want to get all content sections
            const sections = document.querySelectorAll(selector);
            if (sections.length > 0) {
                const html = Array.from(sections)
                    .map((s) => s.innerHTML)
                    .join("\n\n");
                if (html.length > 100) {
                    return this.cleanDescription(html);
                }
            }
        }
        // Try getting the main content area
        const mainContent = document.querySelector(".content-wrapper .content, main .content");
        if (mainContent) {
            return this.cleanDescription(mainContent.innerHTML);
        }
        return null;
    }
    extractJobId() {
        // From URL: jobs.lever.co/company/job-id-uuid
        const match = window.location.href.match(/lever\.co\/[^/]+\/([a-f0-9-]+)/i);
        return match?.[1];
    }
    extractJobIdFromUrl(url) {
        const match = url.match(/lever\.co\/[^/]+\/([a-f0-9-]+)/i);
        return match?.[1];
    }
    detectJobTypeFromCommitment(commitment) {
        if (!commitment)
            return undefined;
        const lower = commitment.toLowerCase();
        if (lower.includes("full-time") || lower.includes("full time"))
            return "full-time";
        if (lower.includes("part-time") || lower.includes("part time"))
            return "part-time";
        if (lower.includes("contract") || lower.includes("contractor"))
            return "contract";
        if (lower.includes("intern"))
            return "internship";
        return undefined;
    }
    extractStructuredData() {
        try {
            const ldJsonElements = document.querySelectorAll('script[type="application/ld+json"]');
            for (const el of ldJsonElements) {
                if (!el.textContent)
                    continue;
                const data = JSON.parse(el.textContent);
                const jobData = Array.isArray(data)
                    ? data.find((d) => d["@type"] === "JobPosting")
                    : data;
                if (!jobData || jobData["@type"] !== "JobPosting")
                    continue;
                return {
                    location: typeof jobData.jobLocation === "string"
                        ? jobData.jobLocation
                        : jobData.jobLocation?.address?.addressLocality ||
                            jobData.jobLocation?.name,
                    salary: jobData.baseSalary?.value
                        ? `$${jobData.baseSalary.value.minValue || ""}-${jobData.baseSalary.value.maxValue || ""}`
                        : undefined,
                    postedAt: jobData.datePosted,
                };
            }
            return null;
        }
        catch {
            return null;
        }
    }
}

;// ./src/content/scrapers/generic-scraper.ts
// Generic job scraper for unknown sites

class GenericScraper extends BaseScraper {
    constructor() {
        super(...arguments);
        this.source = "unknown";
        this.urlPatterns = [];
    }
    canHandle(_url) {
        // Generic scraper always returns true as fallback
        return true;
    }
    async scrapeJobListing() {
        // Try to extract job information using common patterns
        // Check for structured data first
        const structuredData = this.extractStructuredData();
        if (structuredData) {
            return structuredData;
        }
        // Try common selectors
        const title = this.findTitle();
        const company = this.findCompany();
        const description = this.findDescription();
        if (!title || !description) {
            console.log("[Columbus] Generic scraper: Could not find required fields");
            return null;
        }
        const location = this.findLocation();
        return {
            title,
            company: company || "Unknown Company",
            location: location || undefined,
            description,
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary: this.extractSalary(description),
            type: this.detectJobType(description),
            remote: this.detectRemote(location || "") || this.detectRemote(description),
            url: window.location.href,
            source: this.detectSource(),
        };
    }
    async scrapeJobList() {
        // Generic scraping of job lists is unreliable
        // Return empty array for unknown sites
        return [];
    }
    extractStructuredData() {
        try {
            // Look for JSON-LD job posting schema
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (const script of scripts) {
                const data = JSON.parse(script.textContent || "");
                // Handle single job posting
                if (data["@type"] === "JobPosting") {
                    return this.parseJobPostingSchema(data);
                }
                // Handle array of items
                if (Array.isArray(data)) {
                    const jobPosting = data.find((item) => item["@type"] === "JobPosting");
                    if (jobPosting) {
                        return this.parseJobPostingSchema(jobPosting);
                    }
                }
                // Handle @graph
                if (data["@graph"]) {
                    const jobPosting = data["@graph"].find((item) => item["@type"] === "JobPosting");
                    if (jobPosting) {
                        return this.parseJobPostingSchema(jobPosting);
                    }
                }
            }
        }
        catch (err) {
            console.log("[Columbus] Could not parse structured data:", err);
        }
        return null;
    }
    parseJobPostingSchema(data) {
        const title = data.title || "";
        const company = data.hiringOrganization?.name || "";
        const description = data.description || "";
        // Extract location
        let location;
        const jobLocation = data.jobLocation;
        if (jobLocation) {
            const address = jobLocation.address;
            if (address) {
                location = [
                    address.addressLocality,
                    address.addressRegion,
                    address.addressCountry,
                ]
                    .filter(Boolean)
                    .join(", ");
            }
        }
        // Extract salary
        let salary;
        const baseSalary = data.baseSalary;
        if (baseSalary) {
            const value = baseSalary.value;
            if (value) {
                const currency = baseSalary.currency || "USD";
                const min = value.minValue;
                const max = value.maxValue;
                if (min && max) {
                    salary = `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
                }
                else if (value) {
                    salary = `${currency} ${value.toLocaleString()}`;
                }
            }
        }
        return {
            title,
            company,
            location,
            description: this.cleanDescription(description),
            requirements: this.extractRequirements(description),
            keywords: this.extractKeywords(description),
            salary,
            type: this.parseEmploymentType(data.employmentType),
            remote: this.detectRemote(description),
            url: window.location.href,
            source: this.detectSource(),
            postedAt: data.datePosted,
        };
    }
    parseEmploymentType(type) {
        if (!type)
            return undefined;
        const lower = type.toLowerCase();
        if (lower.includes("full"))
            return "full-time";
        if (lower.includes("part"))
            return "part-time";
        if (lower.includes("contract") || lower.includes("temporary"))
            return "contract";
        if (lower.includes("intern"))
            return "internship";
        return undefined;
    }
    findTitle() {
        // Common title selectors
        const selectors = [
            'h1[class*="title"]',
            'h1[class*="job"]',
            ".job-title",
            ".posting-title",
            '[class*="job-title"]',
            '[class*="posting-title"]',
            "h1",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 3 && text.length < 200) {
                // Filter out common non-title content
                if (!text.toLowerCase().includes("sign in") &&
                    !text.toLowerCase().includes("log in")) {
                    return text;
                }
            }
        }
        // Try document title
        const docTitle = document.title;
        if (docTitle && docTitle.length > 5) {
            // Remove common suffixes
            const cleaned = docTitle
                .replace(/\s*[-|]\s*.+$/, "")
                .replace(/\s*at\s+.+$/i, "")
                .trim();
            if (cleaned.length > 3) {
                return cleaned;
            }
        }
        return null;
    }
    findCompany() {
        const selectors = [
            '[class*="company-name"]',
            '[class*="employer"]',
            '[class*="organization"]',
            ".company",
            ".employer",
            'a[href*="company"]',
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 1 && text.length < 100) {
                return text;
            }
        }
        // Try meta tags
        const ogSiteName = document.querySelector('meta[property="og:site_name"]');
        if (ogSiteName) {
            const content = ogSiteName.getAttribute("content");
            if (content)
                return content;
        }
        return null;
    }
    findDescription() {
        const selectors = [
            ".job-description",
            ".posting-description",
            '[class*="job-description"]',
            '[class*="posting-description"]',
            '[class*="description"]',
            "article",
            ".content",
            "main",
        ];
        for (const selector of selectors) {
            const html = this.extractHtmlContent(selector);
            if (html && html.length > 100) {
                return this.cleanDescription(html);
            }
        }
        return null;
    }
    findLocation() {
        const selectors = [
            '[class*="location"]',
            '[class*="address"]',
            ".location",
            ".job-location",
        ];
        for (const selector of selectors) {
            const text = this.extractTextContent(selector);
            if (text && text.length > 2 && text.length < 100) {
                return text;
            }
        }
        return null;
    }
    detectSource() {
        const hostname = window.location.hostname.toLowerCase();
        // Remove common prefixes
        const cleaned = hostname
            .replace(/^www\./, "")
            .replace(/^jobs\./, "")
            .replace(/^careers\./, "");
        // Extract main domain
        const parts = cleaned.split(".");
        if (parts.length >= 2) {
            return parts[parts.length - 2];
        }
        return cleaned;
    }
}

;// ./src/content/scrapers/scraper-registry.ts
// Scraper registry - maps URLs to appropriate scrapers






// Initialize all scrapers
const scrapers = [
    new LinkedInScraper(),
    new WaterlooWorksScraper(),
    new IndeedScraper(),
    new GreenhouseScraper(),
    new LeverScraper(),
];
const genericScraper = new GenericScraper();
/**
 * Get the appropriate scraper for a URL
 */
function getScraperForUrl(url) {
    const scraper = scrapers.find((s) => s.canHandle(url));
    return scraper || genericScraper;
}
/**
 * Check if we have a specialized scraper for this URL
 */
function hasSpecializedScraper(url) {
    return scrapers.some((s) => s.canHandle(url));
}
/**
 * Get all available scraper sources
 */
function getAvailableSources() {
    return scrapers.map((s) => s.source);
}

;// ./src/content/scrapers/waterloo-works-orchestrator.ts
// Orchestrator for bulk WaterlooWorks scraping. Walks the visible postings
// table, opens each row's detail panel, runs the single-posting scraper, and
// yields the results. Two modes:
//
//   scrapeAllVisible()   — current page only
//   scrapeAllPaginated() — current page, then clicks "Next page" and repeats
//                          until there is no next page (or the hard cap hits).
//
// Lives in the content script. Pagination + row clicks rely on selectors
// observed on the live modern WW UI in 2026-05. If WW redesigns again, the
// orchestrator will return [] gracefully (no exceptions thrown to the caller).

const DEFAULT_THROTTLE_MS = 500;
const ROW_SELECTOR = "table.data-viewer-table tbody tr.table__row--body";
const ROW_TITLE_LINK_SELECTOR = "td a[href='javascript:void(0)']";
const POSTING_PANEL_SELECTOR = ".dashboard-header__posting-title";
const NEXT_PAGE_SELECTOR = 'a.pagination__link[aria-label="Go to next page"]';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function isHidden(el) {
    if (!el)
        return true;
    return el.classList.contains("disabled");
}
async function waitFor(predicate, timeoutMs, intervalMs = 100) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        if (predicate())
            return true;
        await sleep(intervalMs);
    }
    return false;
}
class WaterlooWorksOrchestrator {
    constructor() {
        this.scraper = new WaterlooWorksScraper();
    }
    /** Scrape every row visible on the current page. */
    async scrapeAllVisible(opts = {}) {
        const { jobs } = await this.scrapeCurrentPage({
            scrapedSoFar: 0,
            pageIndex: 1,
            opts,
            errors: [],
        });
        return jobs;
    }
    /** Walk every row across every page (capped by maxJobs / maxPages). */
    async scrapeAllPaginated(opts = {}) {
        const maxJobs = opts.maxJobs ?? 200;
        const maxPages = opts.maxPages ?? 50;
        const throttle = opts.throttleMs ?? DEFAULT_THROTTLE_MS;
        const allJobs = [];
        const errors = [];
        let pageIndex = 1;
        while (pageIndex <= maxPages && allJobs.length < maxJobs) {
            const { jobs, stopReason } = await this.scrapeCurrentPage({
                scrapedSoFar: allJobs.length,
                pageIndex,
                opts: { ...opts, maxJobs },
                errors,
            });
            allJobs.push(...jobs);
            if (stopReason === "cap-hit")
                break;
            // Try to go to the next page
            const advanced = await this.goToNextPage(throttle);
            if (!advanced)
                break;
            pageIndex++;
        }
        opts.onProgress?.({
            scrapedCount: allJobs.length,
            attemptedCount: allJobs.length,
            currentPage: pageIndex,
            totalRowsOnPage: this.getRows().length,
            done: true,
            errors,
        });
        return allJobs;
    }
    async scrapeCurrentPage(args) {
        const { scrapedSoFar, pageIndex, opts, errors } = args;
        const maxJobs = opts.maxJobs ?? 200;
        const throttle = opts.throttleMs ?? DEFAULT_THROTTLE_MS;
        const rows = this.getRows();
        const jobs = [];
        for (let i = 0; i < rows.length; i++) {
            if (scrapedSoFar + jobs.length >= maxJobs) {
                return { jobs, stopReason: "cap-hit" };
            }
            // Re-fetch the row each iteration — the DOM may rebuild after panel close.
            const liveRows = this.getRows();
            const row = liveRows[i];
            if (!row)
                break;
            const titleLink = row.querySelector(ROW_TITLE_LINK_SELECTOR);
            const expectedTitle = titleLink?.textContent?.trim();
            if (!titleLink)
                continue;
            // Capture the panel's current title so we can detect when the new
            // posting's content has actually rendered (the panel may already be
            // visible from a previous row).
            const previousPanelTitle = document
                .querySelector(POSTING_PANEL_SELECTOR + " h2")
                ?.textContent?.trim();
            titleLink.click();
            const opened = await waitFor(() => !!document.querySelector(POSTING_PANEL_SELECTOR), 5000);
            if (!opened) {
                errors.push(`row ${i} (${expectedTitle}): panel did not open`);
                continue;
            }
            // Wait for the panel's h2 to update (or appear for the first time) AND
            // for posting-specific field rows to be present. We check for a
            // recognisable label like "Job Title" — search filters share the same
            // .tag__key-value-list class so a non-zero count is not a reliable
            // signal that the posting body has rendered.
            const fullyRendered = await waitFor(() => {
                const h2 = document
                    .querySelector(POSTING_PANEL_SELECTOR + " h2")
                    ?.textContent?.trim();
                if (!h2)
                    return false;
                if (previousPanelTitle && h2 === previousPanelTitle)
                    return false;
                const labels = Array.from(document.querySelectorAll(".tag__key-value-list.js--question--container .label")).map((el) => (el.textContent || "").trim().toLowerCase());
                return labels.some((l) => l.startsWith("job title") || l.startsWith("organization"));
            }, 8000);
            if (!fullyRendered) {
                errors.push(`row ${i} (${expectedTitle}): panel never fully rendered`);
                continue;
            }
            await sleep(throttle);
            let job = null;
            try {
                job = await this.scraper.scrapeJobListing();
            }
            catch (err) {
                errors.push(`row ${i} (${expectedTitle}): ${String(err).slice(0, 200)}`);
            }
            if (job)
                jobs.push(job);
            opts.onProgress?.({
                scrapedCount: scrapedSoFar + jobs.length,
                attemptedCount: scrapedSoFar + i + 1,
                currentPage: pageIndex,
                totalRowsOnPage: liveRows.length,
                lastTitle: job?.title || expectedTitle,
                done: false,
                errors,
            });
            // No need to explicitly close the panel — clicking the next row replaces
            // its content. We only stop here if this was the last row on the page.
            await sleep(throttle);
        }
        return { jobs };
    }
    async goToNextPage(throttleMs) {
        const nextBtn = document.querySelector(NEXT_PAGE_SELECTOR);
        if (!nextBtn || isHidden(nextBtn))
            return false;
        // Capture the first row's signature to detect when the page has changed.
        const beforeSig = this.firstRowSignature();
        nextBtn.click();
        const changed = await waitFor(() => this.firstRowSignature() !== beforeSig && this.getRows().length > 0, 8000);
        if (!changed)
            return false;
        await sleep(throttleMs);
        return true;
    }
    getRows() {
        return Array.from(document.querySelectorAll(ROW_SELECTOR));
    }
    firstRowSignature() {
        const row = this.getRows()[0];
        return row?.textContent?.trim().slice(0, 120) || "";
    }
}

;// ./src/shared/messages.ts
// Message passing utilities for extension communication
// Type-safe message creators
const Messages = {
    // Auth messages
    getAuthStatus: () => ({ type: "GET_AUTH_STATUS" }),
    openAuth: () => ({ type: "OPEN_AUTH" }),
    logout: () => ({ type: "LOGOUT" }),
    // Profile messages
    getProfile: () => ({ type: "GET_PROFILE" }),
    getSettings: () => ({ type: "GET_SETTINGS" }),
    // Form filling messages
    fillForm: (fields) => ({
        type: "FILL_FORM",
        payload: fields,
    }),
    // Scraping messages
    scrapeJob: () => ({ type: "SCRAPE_JOB" }),
    scrapeJobList: () => ({ type: "SCRAPE_JOB_LIST" }),
    importJob: (job) => ({
        type: "IMPORT_JOB",
        payload: job,
    }),
    importJobsBatch: (jobs) => ({
        type: "IMPORT_JOBS_BATCH",
        payload: jobs,
    }),
    trackApplied: (payload) => ({
        type: "TRACK_APPLIED",
        payload,
    }),
    openDashboard: () => ({ type: "OPEN_DASHBOARD" }),
    captureVisibleTab: () => ({ type: "CAPTURE_VISIBLE_TAB" }),
    tailorFromPage: (job, baseResumeId) => ({
        type: "TAILOR_FROM_PAGE",
        payload: { job, baseResumeId },
    }),
    generateCoverLetterFromPage: (job) => ({
        type: "GENERATE_COVER_LETTER_FROM_PAGE",
        payload: job,
    }),
    /** #34 — fetch the user's recently-saved tailored resumes for the picker. */
    listResumes: () => ({ type: "LIST_RESUMES" }),
    // Learning messages
    saveAnswer: (data) => ({
        type: "SAVE_ANSWER",
        payload: data,
    }),
    searchAnswers: (question) => ({
        type: "SEARCH_ANSWERS",
        payload: question,
    }),
    jobDetected: (meta) => ({
        type: "JOB_DETECTED",
        payload: meta,
    }),
    // WaterlooWorks-specific bulk scraping (driven from popup, executed in content
    // script by waterloo-works-orchestrator.ts).
    wwScrapeAllVisible: () => ({
        type: "WW_SCRAPE_ALL_VISIBLE",
    }),
    wwScrapeAllPaginated: (opts) => ({
        type: "WW_SCRAPE_ALL_PAGINATED",
        payload: opts ?? {},
    }),
    wwGetPageState: () => ({ type: "WW_GET_PAGE_STATE" }),
};
// Send message to background script
async function sendMessage(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                resolve(response || { success: false, error: "No response received" });
            }
        });
    });
}
// Send message to content script in specific tab
async function sendToTab(tabId, message) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                resolve(response || { success: false, error: "No response received" });
            }
        });
    });
}
// Send message to all content scripts
async function broadcastMessage(message) {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        if (tab.id) {
            try {
                await chrome.tabs.sendMessage(tab.id, message);
            }
            catch {
                // Tab might not have content script loaded
            }
        }
    }
}

;// ./src/content/tracking/applied-toast.ts
function showAppliedToast(company, onClick) {
    document.querySelector(".columbus-toast-applied")?.remove();
    const toast = document.createElement("div");
    toast.className = "columbus-toast columbus-toast-applied";
    toast.tabIndex = 0;
    toast.setAttribute("role", "button");
    toast.setAttribute("aria-label", "Open Slothing dashboard");
    toast.textContent = `✓ Tracked in Slothing - applied to ${company}`;
    const dismiss = () => toast.remove();
    const timeoutId = window.setTimeout(dismiss, 6000);
    toast.addEventListener("click", () => {
        window.clearTimeout(timeoutId);
        onClick();
        dismiss();
    });
    toast.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toast.click();
            return;
        }
        if (event.key === "Escape") {
            window.clearTimeout(timeoutId);
            dismiss();
        }
    });
    document.body.appendChild(toast);
}

;// ./src/content/tracking/page-snapshot.ts

const MAX_HEADLINE_LENGTH = 200;
async function buildPageSnapshot({ captureScreenshot, }) {
    const title = document.title.trim();
    const headline = normalizeText(document.querySelector("h1")?.textContent || title);
    return {
        url: window.location.href,
        host: window.location.hostname,
        title,
        headline: headline ? truncate(headline, MAX_HEADLINE_LENGTH) : undefined,
        submittedAt: new Date().toISOString(),
        thumbnailDataUrl: captureScreenshot
            ? await captureVisibleTabSafely()
            : undefined,
    };
}
function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
}
function truncate(value, maxLength) {
    if (value.length <= maxLength)
        return value;
    return value.slice(0, maxLength - 1).trimEnd();
}
async function captureVisibleTabSafely() {
    try {
        const response = await sendMessage(Messages.captureVisibleTab());
        return response.success ? response.data?.dataUrl : undefined;
    }
    catch {
        return undefined;
    }
}

;// ./src/content/tracking/submit-watcher.ts

const APPLICATION_FIELD_TYPES = new Set([
    "firstName",
    "lastName",
    "fullName",
    "email",
    "phone",
    "linkedin",
    "github",
    "website",
    "portfolio",
    "resume",
    "coverLetter",
    "workAuthorization",
    "sponsorship",
    "customQuestion",
]);
const BLOCKED_FORM_KEYWORDS = [
    "login",
    "log in",
    "signin",
    "sign in",
    "signup",
    "sign up",
    "register",
    "search",
    "subscribe",
    "newsletter",
];
class SubmitWatcher {
    constructor(options) {
        this.handledForms = new WeakSet();
        this.pendingForms = new WeakSet();
        this.trackedUrls = new Set();
        this.attached = false;
        this.handleSubmit = (event) => {
            const form = event.target;
            if (!(form instanceof HTMLFormElement))
                return;
            void this.trackFormSubmit(form);
        };
        this.options = options;
    }
    attach() {
        if (this.attached)
            return;
        document.addEventListener("submit", this.handleSubmit, true);
        this.attached = true;
    }
    detach() {
        if (!this.attached)
            return;
        document.removeEventListener("submit", this.handleSubmit, true);
        this.attached = false;
    }
    async trackFormSubmit(form) {
        if (this.handledForms.has(form) ||
            this.pendingForms.has(form) ||
            this.trackedUrls.has(window.location.href)) {
            return;
        }
        this.pendingForms.add(form);
        try {
            const settings = await this.options.getSettings();
            if (!settings.autoTrackApplicationsEnabled)
                return;
            const detectedFields = this.options.getDetectedFields(form);
            if (isLikelySearchOrLoginForm(form, window.location.href) ||
                !looksLikeApplicationForm(detectedFields, form, this.options.wasAutofilled(form))) {
                return;
            }
            this.handledForms.add(form);
            this.trackedUrls.add(window.location.href);
            const snapshot = await buildPageSnapshot({
                captureScreenshot: settings.captureScreenshotEnabled,
            });
            await this.options.onTracked({
                ...snapshot,
                scrapedJob: this.options.getScrapedJob(),
            });
        }
        finally {
            this.pendingForms.delete(form);
        }
    }
}
function isLikelySearchOrLoginForm(form, url) {
    const urlText = url.toLowerCase();
    if (/(\/|\b)(login|signin|signup|register|search)(\/|\?|#|\b)/.test(urlText)) {
        return true;
    }
    const text = [
        form.id,
        form.className,
        form.getAttribute("name"),
        form.getAttribute("aria-label"),
        form.getAttribute("action"),
        form.textContent,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    if (BLOCKED_FORM_KEYWORDS.some((keyword) => text.includes(keyword))) {
        return true;
    }
    const inputs = Array.from(form.querySelectorAll("input"));
    return inputs.some((input) => {
        const type = input.type.toLowerCase();
        const name = `${input.name} ${input.id} ${input.placeholder}`.toLowerCase();
        return type === "search" || name.includes("search");
    });
}
function looksLikeApplicationForm(detectedFields, form, wasAutofilled = false) {
    const highConfidenceApplicationFields = detectedFields.filter((field) => field.confidence >= 0.3 && APPLICATION_FIELD_TYPES.has(field.fieldType));
    if (wasAutofilled && highConfidenceApplicationFields.length >= 2) {
        return true;
    }
    if (highConfidenceApplicationFields.length >= 3) {
        return true;
    }
    const formText = [
        form.id,
        form.className,
        form.getAttribute("action"),
        form.textContent,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return (wasAutofilled &&
        highConfidenceApplicationFields.length > 0 &&
        /\b(apply|application|resume|cover letter|submit application)\b/.test(formText));
}
function extractCompanyHint(scrapedJob, host) {
    if (scrapedJob?.company)
        return scrapedJob.company;
    return host.replace(/^www\./, "");
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(723);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js
var client = __webpack_require__(997);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var react = __webpack_require__(155);
;// ./src/content/sidebar/job-page-sidebar.tsx


const ACTION_LABELS = {
    tailor: "Tailor",
    coverLetter: "Cover Letter",
    save: "Save",
    autoFill: "Auto-fill",
};
function JobPageSidebar(props) {
    const [activeAction, setActiveAction] = (0,react.useState)(null);
    const [notice, setNotice] = (0,react.useState)(null);
    const [query, setQuery] = (0,react.useState)("");
    const [answers, setAnswers] = (0,react.useState)([]);
    const [searching, setSearching] = (0,react.useState)(false);
    const [searchError, setSearchError] = (0,react.useState)(null);
    const scoreValue = props.score?.overall ?? null;
    const scoreDegrees = Math.round(((scoreValue ?? 0) / 100) * 360);
    const jobMeta = (0,react.useMemo)(() => [props.scrapedJob.company, props.scrapedJob.location]
        .filter(Boolean)
        .join(" / "), [props.scrapedJob.company, props.scrapedJob.location]);
    async function runAction(action, callback) {
        setActiveAction(action);
        setNotice(null);
        try {
            await callback();
            setNotice({
                kind: "success",
                message: action === "autoFill"
                    ? "Application fields updated."
                    : `${ACTION_LABELS[action]} complete.`,
            });
        }
        catch (error) {
            setNotice({
                kind: "error",
                message: error.message || `${ACTION_LABELS[action]} failed.`,
            });
        }
        finally {
            setActiveAction(null);
        }
    }
    async function handleSearch(event) {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed)
            return;
        setSearching(true);
        setSearchError(null);
        try {
            setAnswers(await props.onSearchAnswers(trimmed));
        }
        catch (error) {
            setSearchError(error.message || "Answer search failed.");
        }
        finally {
            setSearching(false);
        }
    }
    async function copyAnswer(answer) {
        await navigator.clipboard.writeText(answer.answer);
        setNotice({ kind: "success", message: "Answer copied." });
    }
    if (props.isCollapsed) {
        return ((0,jsx_runtime.jsx)("aside", { className: "slothing-sidebar", "aria-label": "Slothing job sidebar", children: (0,jsx_runtime.jsxs)("button", { className: "rail", type: "button", onClick: () => props.onCollapseChange(false), "aria-label": "Open Slothing sidebar", title: "Open Slothing sidebar", children: [(0,jsx_runtime.jsx)("span", { className: "rail-score", children: scoreValue ?? "--" }), (0,jsx_runtime.jsx)("span", { className: "rail-label", children: "Slothing" })] }) }));
    }
    return ((0,jsx_runtime.jsx)("aside", { className: "slothing-sidebar", "aria-label": "Slothing job sidebar", children: (0,jsx_runtime.jsxs)("div", { className: "panel", children: [(0,jsx_runtime.jsxs)("header", { className: "header", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "brand", children: "Slothing" }), (0,jsx_runtime.jsx)("h2", { className: "title", children: props.scrapedJob.title }), (0,jsx_runtime.jsx)("p", { className: "company", children: jobMeta || props.scrapedJob.company })] }), (0,jsx_runtime.jsxs)("div", { className: "icon-row", children: [(0,jsx_runtime.jsx)("button", { className: "icon-button", type: "button", onClick: () => props.onCollapseChange(true), "aria-label": "Collapse Slothing sidebar", title: "Collapse", children: "\u203A" }), (0,jsx_runtime.jsx)("button", { className: "icon-button", type: "button", onClick: () => void props.onDismiss(), "aria-label": "Dismiss Slothing sidebar for this domain", title: "Dismiss for this domain", children: "\u00D7" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "body", children: [(0,jsx_runtime.jsxs)("section", { className: "score-card", "aria-label": "Match score", children: [(0,jsx_runtime.jsx)("div", { className: "score-number", style: { "--score-deg": `${scoreDegrees}deg` }, children: (0,jsx_runtime.jsx)("span", { children: scoreValue ?? "--" }) }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "score-label", children: scoreValue === null ? "Profile needed" : "Match score" }), (0,jsx_runtime.jsx)("p", { className: "score-note", children: scoreValue === null
                                                ? "Connect your profile to score this job."
                                                : "Based on your profile and this job description." })] })] }), (0,jsx_runtime.jsxs)("section", { className: "actions", "aria-label": "Job actions", children: [(0,jsx_runtime.jsx)(ActionButton, { label: "Tailor resume", activeLabel: "Tailoring...", active: activeAction === "tailor", disabled: activeAction !== null, primary: true, onClick: () => runAction("tailor", props.onTailor) }), (0,jsx_runtime.jsx)(ActionButton, { label: "Cover letter", activeLabel: "Generating...", active: activeAction === "coverLetter", disabled: activeAction !== null, onClick: () => runAction("coverLetter", props.onCoverLetter) }), (0,jsx_runtime.jsx)(ActionButton, { label: "Save job", activeLabel: "Saving...", active: activeAction === "save", disabled: activeAction !== null, onClick: () => runAction("save", props.onSave) }), (0,jsx_runtime.jsx)(ActionButton, { label: props.detectedFieldCount > 0
                                        ? `Auto-fill ${props.detectedFieldCount} fields`
                                        : "Auto-fill", activeLabel: "Filling...", active: activeAction === "autoFill", disabled: activeAction !== null || props.detectedFieldCount === 0, onClick: () => runAction("autoFill", props.onAutoFill) })] }), notice && ((0,jsx_runtime.jsx)("div", { className: `status-card ${notice.kind}`, role: "status", children: notice.message })), (0,jsx_runtime.jsxs)("section", { className: "answer-bank", "aria-label": "Answer bank search", children: [(0,jsx_runtime.jsx)("p", { className: "section-title", children: "Answer bank" }), (0,jsx_runtime.jsxs)("form", { className: "search-row", onSubmit: handleSearch, children: [(0,jsx_runtime.jsx)("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search saved answers", "aria-label": "Search saved answers" }), (0,jsx_runtime.jsx)("button", { type: "submit", disabled: searching || !query.trim(), children: searching ? "..." : "Search" })] }), searchError && (0,jsx_runtime.jsx)("p", { className: "status-card error", children: searchError }), (0,jsx_runtime.jsx)("div", { className: "results", children: answers.map((answer) => ((0,jsx_runtime.jsxs)("article", { className: "result", children: [(0,jsx_runtime.jsx)("p", { className: "result-question", children: answer.question }), (0,jsx_runtime.jsx)("p", { className: "result-answer", children: answer.answer }), (0,jsx_runtime.jsxs)("p", { className: "result-meta", children: [Math.round(answer.similarity * 100), "% match / used", " ", answer.timesUsed, " times"] }), (0,jsx_runtime.jsxs)("div", { className: "result-actions", children: [(0,jsx_runtime.jsx)("button", { className: "small-button secondary", type: "button", onClick: () => copyAnswer(answer), children: "Copy" }), (0,jsx_runtime.jsx)("button", { className: "small-button", type: "button", onClick: () => void props.onApplyAnswer(answer), children: "Apply" })] })] }, answer.id))) })] })] })] }) }));
}
function ActionButton({ label, activeLabel, active, disabled, primary, onClick, }) {
    return ((0,jsx_runtime.jsxs)("button", { className: `action-button${primary ? " primary" : ""}`, type: "button", disabled: disabled, onClick: onClick, children: [(0,jsx_runtime.jsx)("span", { children: active ? activeLabel : label }), (0,jsx_runtime.jsx)("span", { "aria-hidden": "true", children: "->" })] }));
}

;// ../../packages/shared/src/formatters/index.ts
const DEFAULT_LOCALE = "en-US";
const NUMERIC_PARTS_LOCALE = (/* unused pure expression or super */ null && (`${DEFAULT_LOCALE}-u-nu-latn`));
const LOCALE_COOKIE_NAME = "taida_locale";
const LOCALE_CHANGE_EVENT = "taida:locale-change";
const SUPPORTED_LOCALES = [
    { value: "en-US", label: "English (US)" },
    { value: "en-CA", label: "English (CA)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "zh-CN", label: "Chinese (Simplified)" },
    { value: "pt", label: "Portuguese" },
    { value: "pt-BR", label: "Portuguese (Brazil)" },
    { value: "hi", label: "Hindi" },
    { value: "ko", label: "Korean" },
];
function normalizeLocale(locale) {
    if (!locale)
        return DEFAULT_LOCALE;
    const supported = SUPPORTED_LOCALES.find((candidate) => candidate.value.toLowerCase() === locale.toLowerCase() ||
        candidate.value.split("-")[0].toLowerCase() === locale.toLowerCase());
    return supported?.value ?? DEFAULT_LOCALE;
}
function nowIso() {
    return new Date().toISOString();
}
function nowDate() {
    return new Date();
}
function nowEpoch() {
    return Date.now();
}
function parseToDate(value) {
    if (value === null || value === undefined || value === "")
        return null;
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
function toIso(value) {
    const date = parseToDate(value);
    if (!date) {
        throw new TypeError("Expected a valid date value");
    }
    return date.toISOString();
}
function toNullableIso(value) {
    return parseToDate(value)?.toISOString() ?? null;
}
function toEpoch(value) {
    const date = parseToDate(value);
    if (!date) {
        throw new TypeError("Expected a valid date value");
    }
    return date.getTime();
}
function toNullableEpoch(value) {
    return parseToDate(value)?.getTime() ?? null;
}
function getUserTimezone() {
    if (typeof Intl === "undefined")
        return "UTC";
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
    catch {
        return "UTC";
    }
}
function getDisplayTimezone(timeZone) {
    if (timeZone)
        return timeZone;
    return typeof window === "undefined" ? "UTC" : getUserTimezone();
}
function formatAbsolute(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "Unknown date";
    const includeTime = opts.includeTime ?? true;
    const formatter = new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
        timeZone: getDisplayTimezone(opts.timeZone),
    });
    const formatted = formatter.format(date);
    if (!includeTime)
        return formatted;
    const lastComma = formatted.lastIndexOf(",");
    if (lastComma === -1)
        return formatted;
    return `${formatted.slice(0, lastComma)} · ${formatted
        .slice(lastComma + 1)
        .trim()}`;
}
function formatRelative(value, opts = {}) {
    const date = parseToDate(value);
    const current = parseToDate(opts.now ?? nowIso());
    if (!date || !current) {
        return "Unknown date";
    }
    const diffMs = current.getTime() - date.getTime();
    const absMs = Math.abs(diffMs);
    const isFuture = diffMs < 0;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    if (absMs < minute)
        return "Just now";
    if (absMs < hour)
        return formatRelativeBucket(Math.floor(absMs / minute), "m", isFuture);
    if (absMs < day)
        return formatRelativeBucket(Math.floor(absMs / hour), "h", isFuture);
    if (absMs < 2 * day)
        return isFuture ? "Tomorrow" : "Yesterday";
    if (absMs < week)
        return formatRelativeBucket(Math.floor(absMs / day), "d", isFuture);
    if (absMs < month)
        return formatRelativeBucket(Math.floor(absMs / week), "w", isFuture);
    if (absMs < year)
        return formatRelativeBucket(Math.floor(absMs / month), "mo", isFuture);
    return formatRelativeBucket(Math.floor(absMs / year), "y", isFuture);
}
function formatDateOnly(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "Unknown date";
    return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: getDisplayTimezone(opts.timeZone),
    }).format(date);
}
function formatTimeOnly(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "Unknown time";
    return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        hour: "numeric",
        minute: "2-digit",
        timeZone: getDisplayTimezone(opts.timeZone),
    }).format(date);
}
function formatIsoDateOnly(value = nowIso()) {
    return toIso(parseToDate(value) ?? nowIso()).slice(0, 10);
}
function formatMonthYear(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "";
    return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        month: "short",
        year: "numeric",
        timeZone: getDisplayTimezone(opts.timeZone),
    }).format(date);
}
function isPast(value, now = nowIso()) {
    const date = parseToDate(value);
    const current = parseToDate(now);
    return Boolean(date && current && date.getTime() < current.getTime());
}
function isFuture(value, now = nowIso()) {
    const date = parseToDate(value);
    const current = parseToDate(now);
    return Boolean(date && current && date.getTime() > current.getTime());
}
function diffSeconds(a, b) {
    const first = parseToDate(a);
    const second = parseToDate(b);
    if (!first || !second)
        return Number.NaN;
    return Math.trunc((first.getTime() - second.getTime()) / 1000);
}
function diffDays(a, b) {
    const seconds = diffSeconds(a, b);
    return Number.isNaN(seconds) ? Number.NaN : seconds / 86400;
}
function addDays(value, days) {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    return new Date(date.getTime() + days * 86400000);
}
function addMinutes(value, minutes) {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    return new Date(date.getTime() + minutes * 60000);
}
function startOfDay(value, timeZone = "UTC") {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    if (timeZone === "UTC") {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    const parts = getZonedParts(date, timeZone);
    return zonedTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0, timeZone);
}
function endOfDay(value, timeZone = "UTC") {
    return addMinutes(addDays(startOfDay(value, timeZone), 1), -1 / 60000);
}
function toUserTz(value, timeZone = getUserTimezone()) {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    const parts = getZonedParts(date, timeZone);
    return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}
function formatDateAbsolute(date, locale = DEFAULT_LOCALE) {
    return formatAbsolute(date, { locale });
}
function formatDateRelative(date, now = nowIso()) {
    return formatRelative(date, { now });
}
function getBrowserDefaultLocale() {
    if (typeof navigator === "undefined")
        return DEFAULT_LOCALE;
    return normalizeLocale(navigator.language);
}
function formatRelativeBucket(value, unit, isFuture) {
    return isFuture ? `in ${value}${unit}` : `${value}${unit} ago`;
}
function getZonedParts(date, timeZone) {
    const parts = new Intl.DateTimeFormat(NUMERIC_PARTS_LOCALE, {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);
    const get = (type) => Number(parts.find((part) => part.type === type)?.value);
    return {
        year: get("year"),
        month: get("month"),
        day: get("day"),
        hour: get("hour"),
        minute: get("minute"),
        second: get("second"),
    };
}
function zonedTimeToUtc(year, month, day, hour, minute, second, timeZone) {
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const parts = getZonedParts(utcGuess, timeZone);
    const offsetMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - utcGuess.getTime();
    return new Date(utcGuess.getTime() - offsetMs);
}

;// ../../packages/shared/src/scoring/constants.ts
const SUB_SCORE_MAX_POINTS = {
    sectionCompleteness: 10,
    actionVerbs: 15,
    quantifiedAchievements: 20,
    keywordMatch: 25,
    length: 10,
    spellingGrammar: 10,
    atsFriendliness: 10,
};
const ACTION_VERBS = [
    "achieved",
    "analyzed",
    "architected",
    "built",
    "collaborated",
    "created",
    "delivered",
    "designed",
    "developed",
    "drove",
    "improved",
    "increased",
    "launched",
    "led",
    "managed",
    "mentored",
    "optimized",
    "reduced",
    "resolved",
    "shipped",
    "streamlined",
    "supported",
    "transformed",
];
const QUANTIFIED_REGEX = /\d+%|\$[\d,]+(?:\.\d+)?[kKmMbB]?|\b\d+x\b|\bteam of \d+\b|\b\d+\s+(users|customers|clients|projects|people|engineers|reports|hours|members|countries|languages|states|cities|stores|partners|deals|leads)\b/gi;

;// ../../packages/shared/src/scoring/text.ts
function text_normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s/-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function wordBoundaryRegex(term, flags = "") {
    return new RegExp(`\\b${escapeRegExp(term)}\\b`, flags);
}
function containsWord(text, term) {
    return wordBoundaryRegex(term).test(text);
}
function countWordOccurrences(text, term) {
    return (text.match(wordBoundaryRegex(term, "g")) || []).length;
}
function getHighlights(profile) {
    return [
        ...profile.experiences.flatMap((experience) => experience.highlights),
        ...profile.projects.flatMap((project) => project.highlights),
    ].filter(Boolean);
}
function extractProfileText(profile) {
    const parts = [
        profile.contact?.name,
        profile.contact?.email,
        profile.contact?.phone,
        profile.contact?.location,
        profile.contact?.linkedin,
        profile.contact?.github,
        profile.contact?.website,
        profile.contact?.headline,
        profile.summary,
        ...profile.experiences.flatMap((experience) => [
            experience.title,
            experience.company,
            experience.location,
            experience.description,
            ...experience.highlights,
            ...experience.skills,
            experience.startDate,
            experience.endDate,
        ]),
        ...profile.education.flatMap((education) => [
            education.institution,
            education.degree,
            education.field,
            ...education.highlights,
            education.startDate,
            education.endDate,
        ]),
        ...profile.skills.map((skill) => skill.name),
        ...profile.projects.flatMap((project) => [
            project.name,
            project.description,
            project.url,
            ...project.highlights,
            ...project.technologies,
        ]),
        ...profile.certifications.flatMap((certification) => [
            certification.name,
            certification.issuer,
            certification.date,
            certification.url,
        ]),
    ];
    return parts.filter(Boolean).join("\n");
}
function getResumeText(profile, rawText) {
    return (rawText?.trim() || profile.rawText?.trim() || extractProfileText(profile));
}
function wordCount(text) {
    const normalized = text_normalizeText(text);
    if (!normalized)
        return 0;
    return normalized.split(/\s+/).filter(Boolean).length;
}

;// ../../packages/shared/src/scoring/action-verbs.ts


function pointsForDistinctVerbs(count) {
    if (count === 0)
        return 0;
    if (count <= 2)
        return 5;
    if (count <= 4)
        return 9;
    if (count <= 7)
        return 12;
    return 15;
}
function scoreActionVerbs(input) {
    const distinctVerbs = new Set();
    for (const highlight of getHighlights(input.profile)) {
        const firstWord = text_normalizeText(highlight).split(/\s+/)[0] ?? "";
        for (const verb of ACTION_VERBS) {
            if (wordBoundaryRegex(verb).test(firstWord)) {
                distinctVerbs.add(verb);
            }
        }
    }
    const verbs = Array.from(distinctVerbs).sort();
    const notes = verbs.length === 0
        ? ["Start achievement bullets with strong action verbs."]
        : [];
    const preview = verbs.slice(0, 5).join(", ");
    return {
        key: "actionVerbs",
        label: "Action verbs",
        earned: pointsForDistinctVerbs(verbs.length),
        maxPoints: SUB_SCORE_MAX_POINTS.actionVerbs,
        notes,
        evidence: [
            preview
                ? `${verbs.length} distinct action verbs (${preview})`
                : "0 distinct action verbs",
        ],
    };
}

;// ../../packages/shared/src/scoring/ats-characters.ts
const PROBLEMATIC_CHARACTERS = [
    { char: "\u2022", name: "bullet point", replacement: "-" },
    { char: "\u2013", name: "en dash", replacement: "-" },
    { char: "\u2014", name: "em dash", replacement: "-" },
    { char: "\u201c", name: "curly quote left", replacement: '"' },
    { char: "\u201d", name: "curly quote right", replacement: '"' },
    { char: "\u2018", name: "curly apostrophe left", replacement: "'" },
    { char: "\u2019", name: "curly apostrophe right", replacement: "'" },
    { char: "\u2026", name: "ellipsis", replacement: "..." },
    { char: "\u00a9", name: "copyright", replacement: "(c)" },
    { char: "\u00ae", name: "registered", replacement: "(R)" },
    { char: "\u2122", name: "trademark", replacement: "(TM)" },
];

;// ../../packages/shared/src/scoring/ats-friendliness.ts



function scoreAtsFriendliness(input) {
    const text = getResumeText(input.profile, input.rawText);
    const rawText = input.rawText ?? input.profile.rawText ?? "";
    const notes = [];
    const evidence = [];
    let deductions = 0;
    const foundProblematic = PROBLEMATIC_CHARACTERS.filter(({ char }) => text.includes(char));
    if (foundProblematic.length > 0) {
        const penalty = Math.min(3, foundProblematic.length);
        deductions += penalty;
        notes.push("Special formatting characters can reduce ATS parse quality.");
        evidence.push(`${foundProblematic.length} special characters`);
    }
    const badChars = (text.match(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
    if (badChars > 0) {
        deductions += 2;
        notes.push("Control or replacement characters detected.");
        evidence.push(`${badChars} control or replacement character(s)`);
    }
    if (rawText.includes("\t")) {
        deductions += 2;
        notes.push("Tab characters may indicate table-style formatting.");
        evidence.push("Tab characters found");
    }
    const longLines = rawText.split(/\r?\n/).filter((line) => line.length > 200);
    if (longLines.length >= 4) {
        deductions += 2;
        notes.push("Very long lines may indicate multi-column or table formatting.");
        evidence.push(`${longLines.length} over-long lines`);
    }
    if (/<[a-zA-Z/][^>]*>/.test(rawText)) {
        deductions += 2;
        notes.push("HTML tags detected in resume text.");
        evidence.push("HTML tags found");
    }
    if (!/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(text)) {
        deductions += 2;
        notes.push("No email pattern detected in parseable resume text.");
        evidence.push("No email detected");
    }
    if (input.rawText !== undefined &&
        input.rawText.trim().length < 200 &&
        input.profile.experiences.length > 0) {
        deductions += 3;
        notes.push("Extracted text is very short for a resume with experience.");
        evidence.push("Possible image-only PDF");
    }
    return {
        key: "atsFriendliness",
        label: "ATS friendliness",
        earned: Math.max(0, SUB_SCORE_MAX_POINTS.atsFriendliness - deductions),
        maxPoints: SUB_SCORE_MAX_POINTS.atsFriendliness,
        notes,
        evidence: evidence.length > 0 ? evidence : ["No ATS formatting issues detected."],
    };
}

;// ../../packages/shared/src/scoring/synonyms.ts
/**
 * Synonym groups for semantic keyword matching in ATS scoring.
 * Each group maps a canonical term to its synonyms/variations.
 * All terms should be lowercase.
 */
const SYNONYM_GROUPS = [
    // Programming Languages
    { canonical: "javascript", synonyms: ["js", "ecmascript", "es6", "es2015"] },
    { canonical: "typescript", synonyms: ["ts"] },
    { canonical: "python", synonyms: ["py", "python3"] },
    { canonical: "golang", synonyms: ["go"] },
    { canonical: "c#", synonyms: ["csharp", "c sharp", "dotnet", ".net"] },
    { canonical: "c++", synonyms: ["cpp", "cplusplus"] },
    { canonical: "ruby", synonyms: ["rb"] },
    { canonical: "kotlin", synonyms: ["kt"] },
    { canonical: "objective-c", synonyms: ["objc", "obj-c"] },
    // Frontend Frameworks
    { canonical: "react", synonyms: ["reactjs", "react.js", "react js"] },
    { canonical: "angular", synonyms: ["angularjs", "angular.js", "angular js"] },
    { canonical: "vue", synonyms: ["vuejs", "vue.js", "vue js"] },
    { canonical: "next.js", synonyms: ["nextjs", "next js", "next"] },
    { canonical: "nuxt", synonyms: ["nuxtjs", "nuxt.js"] },
    { canonical: "svelte", synonyms: ["sveltejs", "sveltekit"] },
    // Backend Frameworks
    { canonical: "node.js", synonyms: ["nodejs", "node js", "node"] },
    { canonical: "express", synonyms: ["expressjs", "express.js"] },
    { canonical: "django", synonyms: ["django rest framework", "drf"] },
    { canonical: "flask", synonyms: ["flask python"] },
    { canonical: "spring", synonyms: ["spring boot", "springboot"] },
    { canonical: "ruby on rails", synonyms: ["rails", "ror"] },
    { canonical: "fastapi", synonyms: ["fast api"] },
    // Databases
    { canonical: "postgresql", synonyms: ["postgres", "psql", "pg"] },
    { canonical: "mongodb", synonyms: ["mongo"] },
    { canonical: "mysql", synonyms: ["mariadb"] },
    { canonical: "dynamodb", synonyms: ["dynamo db", "dynamo"] },
    { canonical: "elasticsearch", synonyms: ["elastic search", "elastic", "es"] },
    { canonical: "redis", synonyms: ["redis cache"] },
    { canonical: "sql", synonyms: ["structured query language"] },
    { canonical: "nosql", synonyms: ["no sql", "non-relational"] },
    // Cloud & Infrastructure
    { canonical: "aws", synonyms: ["amazon web services", "amazon cloud"] },
    { canonical: "gcp", synonyms: ["google cloud", "google cloud platform"] },
    { canonical: "azure", synonyms: ["microsoft azure", "ms azure"] },
    { canonical: "docker", synonyms: ["containerization", "containers"] },
    { canonical: "kubernetes", synonyms: ["k8s", "kube"] },
    { canonical: "terraform", synonyms: ["infrastructure as code", "iac"] },
    {
        canonical: "ci/cd",
        synonyms: [
            "cicd",
            "ci cd",
            "continuous integration",
            "continuous deployment",
            "continuous delivery",
        ],
    },
    { canonical: "devops", synonyms: ["dev ops", "site reliability", "sre"] },
    // Tools & Platforms
    {
        canonical: "git",
        synonyms: ["github", "gitlab", "bitbucket", "version control"],
    },
    { canonical: "jira", synonyms: ["atlassian jira"] },
    { canonical: "figma", synonyms: ["figma design"] },
    { canonical: "webpack", synonyms: ["module bundler"] },
    { canonical: "graphql", synonyms: ["graph ql", "gql"] },
    {
        canonical: "rest api",
        synonyms: ["restful", "restful api", "rest", "api"],
    },
    // Role Terms
    {
        canonical: "frontend",
        synonyms: [
            "front-end",
            "front end",
            "client-side",
            "client side",
            "ui development",
        ],
    },
    {
        canonical: "backend",
        synonyms: ["back-end", "back end", "server-side", "server side"],
    },
    { canonical: "fullstack", synonyms: ["full-stack", "full stack"] },
    {
        canonical: "software engineer",
        synonyms: ["software developer", "swe", "developer", "programmer", "coder"],
    },
    {
        canonical: "data scientist",
        synonyms: ["data science", "ml engineer", "machine learning engineer"],
    },
    {
        canonical: "data engineer",
        synonyms: ["data engineering", "etl developer"],
    },
    { canonical: "product manager", synonyms: ["pm", "product owner", "po"] },
    {
        canonical: "qa engineer",
        synonyms: ["quality assurance", "qa", "test engineer", "sdet"],
    },
    {
        canonical: "ux designer",
        synonyms: ["ux", "user experience", "ui/ux", "ui ux"],
    },
    // Methodologies
    { canonical: "agile", synonyms: ["scrum", "kanban", "sprint", "sprints"] },
    {
        canonical: "tdd",
        synonyms: ["test driven development", "test-driven development"],
    },
    {
        canonical: "bdd",
        synonyms: ["behavior driven development", "behavior-driven development"],
    },
    {
        canonical: "microservices",
        synonyms: ["micro services", "micro-services", "service-oriented"],
    },
    // Soft Skills
    {
        canonical: "leadership",
        synonyms: [
            "led",
            "managed",
            "directed",
            "supervised",
            "mentored",
            "team lead",
        ],
    },
    {
        canonical: "communication",
        synonyms: ["communicated", "presented", "public speaking", "interpersonal"],
    },
    {
        canonical: "collaboration",
        synonyms: [
            "collaborated",
            "teamwork",
            "cross-functional",
            "cross functional",
        ],
    },
    {
        canonical: "problem solving",
        synonyms: ["problem-solving", "troubleshooting", "debugging", "analytical"],
    },
    {
        canonical: "project management",
        synonyms: [
            "project-management",
            "program management",
            "stakeholder management",
        ],
    },
    {
        canonical: "time management",
        synonyms: ["time-management", "prioritization", "organization"],
    },
    { canonical: "mentoring", synonyms: ["coaching", "training", "onboarding"] },
    // Data & ML
    {
        canonical: "machine learning",
        synonyms: ["ml", "deep learning", "dl", "ai", "artificial intelligence"],
    },
    {
        canonical: "nlp",
        synonyms: ["natural language processing", "text processing"],
    },
    {
        canonical: "computer vision",
        synonyms: ["cv", "image recognition", "image processing"],
    },
    { canonical: "tensorflow", synonyms: ["keras"] },
    { canonical: "pytorch", synonyms: ["torch"] },
    // Testing
    {
        canonical: "unit testing",
        synonyms: ["unit tests", "jest", "mocha", "vitest", "pytest"],
    },
    {
        canonical: "integration testing",
        synonyms: [
            "integration tests",
            "e2e testing",
            "end-to-end testing",
            "end to end",
        ],
    },
    {
        canonical: "automation testing",
        synonyms: [
            "test automation",
            "automated testing",
            "selenium",
            "cypress",
            "playwright",
        ],
    },
    // Security
    {
        canonical: "cybersecurity",
        synonyms: ["cyber security", "information security", "infosec"],
    },
    {
        canonical: "authentication",
        synonyms: ["auth", "oauth", "sso", "single sign-on"],
    },
    // Mobile
    { canonical: "ios", synonyms: ["swift", "apple development"] },
    { canonical: "android", synonyms: ["android development", "kotlin android"] },
    { canonical: "react native", synonyms: ["react-native", "rn"] },
    { canonical: "flutter", synonyms: ["dart"] },
    // Business & Analytics
    {
        canonical: "business intelligence",
        synonyms: ["bi", "tableau", "power bi", "looker"],
    },
    {
        canonical: "data analysis",
        synonyms: ["data analytics", "data analyst", "analytics"],
    },
    {
        canonical: "etl",
        synonyms: ["extract transform load", "data pipeline", "data pipelines"],
    },
];
/**
 * Builds a lookup map from any term (canonical or synonym) to
 * the set of all terms in the same group (including the canonical form).
 * All keys and values are lowercase.
 */
function buildSynonymLookup() {
    const lookup = new Map();
    for (const group of SYNONYM_GROUPS) {
        const allTerms = [group.canonical, ...group.synonyms];
        const termSet = new Set(allTerms);
        for (const term of allTerms) {
            const existing = lookup.get(term);
            if (existing) {
                // Merge sets if term appears in multiple groups
                termSet.forEach((t) => existing.add(t));
            }
            else {
                lookup.set(term, new Set(termSet));
            }
        }
    }
    return lookup;
}
const synonymLookup = buildSynonymLookup();
/**
 * Returns all synonyms for a given term (including the term itself).
 * Returns an empty array if no synonyms are found.
 */
function getSynonyms(term) {
    const normalized = term.toLowerCase().trim();
    const group = synonymLookup.get(normalized);
    if (!group)
        return [];
    return Array.from(group);
}
/**
 * Checks if two terms are synonyms of each other.
 */
function areSynonyms(termA, termB) {
    const normalizedA = termA.toLowerCase().trim();
    const normalizedB = termB.toLowerCase().trim();
    if (normalizedA === normalizedB)
        return true;
    const group = synonymLookup.get(normalizedA);
    return group ? group.has(normalizedB) : false;
}
/** Weight applied to synonym matches (vs 1.0 for exact matches) */
const SYNONYM_MATCH_WEIGHT = 0.8;

;// ../../packages/shared/src/scoring/keyword-match.ts



const STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "in",
    "of",
    "on",
    "or",
    "our",
    "the",
    "to",
    "we",
    "with",
    "you",
    "your",
]);
function tokenizeKeywords(text) {
    return text_normalizeText(text)
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}
function topTokens(text, limit) {
    const counts = new Map();
    for (const token of tokenizeKeywords(text)) {
        counts.set(token, (counts.get(token) ?? 0) + 1);
    }
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([token]) => token);
}
function buildKeywordSet(job) {
    const keywords = [
        ...job.keywords,
        ...job.requirements.flatMap(tokenizeKeywords),
        ...topTokens(job.description, 10),
    ];
    const normalized = keywords
        .map((keyword) => text_normalizeText(keyword))
        .filter((keyword) => keyword.length >= 2 && !STOP_WORDS.has(keyword));
    return Array.from(new Set(normalized)).slice(0, 24);
}
function scoreKeywordMatch(input) {
    if (!input.job) {
        return {
            key: "keywordMatch",
            label: "Keyword match",
            earned: 18,
            maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
            notes: ["No job description supplied; neutral baseline."],
            evidence: ["No job description supplied."],
        };
    }
    const keywords = buildKeywordSet(input.job);
    if (keywords.length === 0) {
        return {
            key: "keywordMatch",
            label: "Keyword match",
            earned: 18,
            maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
            notes: ["Job description has no usable keywords; neutral baseline."],
            evidence: ["0 keywords available."],
        };
    }
    const resumeText = text_normalizeText(getResumeText(input.profile, input.rawText));
    let weightedHits = 0;
    let exactHits = 0;
    let stuffing = false;
    for (const keyword of keywords) {
        const frequency = countWordOccurrences(resumeText, keyword);
        if (frequency > 10)
            stuffing = true;
        if (frequency > 0) {
            weightedHits += 1;
            exactHits += 1;
            continue;
        }
        const synonymHit = getSynonyms(keyword).some((synonym) => synonym !== keyword && containsWord(resumeText, synonym));
        if (synonymHit)
            weightedHits += SYNONYM_MATCH_WEIGHT;
    }
    const rawEarned = Math.round((weightedHits / keywords.length) * SUB_SCORE_MAX_POINTS.keywordMatch);
    const earned = Math.max(0, rawEarned - (stuffing ? 2 : 0));
    const notes = exactHits === keywords.length
        ? []
        : ["Add natural mentions of missing target job keywords."];
    if (stuffing)
        notes.push("Keyword stuffing detected; repeated terms too often.");
    return {
        key: "keywordMatch",
        label: "Keyword match",
        earned,
        maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
        notes,
        evidence: [
            `${exactHits}/${keywords.length} keywords matched`,
            `${weightedHits.toFixed(1)}/${keywords.length} weighted keyword hits`,
        ],
    };
}

;// ../../packages/shared/src/scoring/length.ts


function pointsForWordCount(count) {
    if (count >= 400 && count <= 700)
        return 10;
    if ((count >= 300 && count <= 399) || (count >= 701 && count <= 900))
        return 7;
    if ((count >= 200 && count <= 299) || (count >= 901 && count <= 1100))
        return 4;
    if ((count >= 150 && count <= 199) || (count >= 1101 && count <= 1400)) {
        return 2;
    }
    return 0;
}
function scoreLength(input) {
    const count = wordCount(getResumeText(input.profile, input.rawText));
    const earned = pointsForWordCount(count);
    const notes = earned === SUB_SCORE_MAX_POINTS.length
        ? []
        : ["Resume length is outside the 400-700 word target band."];
    return {
        key: "length",
        label: "Length",
        earned,
        maxPoints: SUB_SCORE_MAX_POINTS.length,
        notes,
        evidence: [`${count} words`],
    };
}

;// ../../packages/shared/src/scoring/quantified-achievements.ts


function pointsForQuantifiedResults(count) {
    if (count === 0)
        return 0;
    if (count === 1)
        return 6;
    if (count === 2)
        return 12;
    if (count <= 4)
        return 16;
    return 20;
}
function scoreQuantifiedAchievements(input) {
    const text = getHighlights(input.profile).join("\n");
    const matches = Array.from(text.matchAll(QUANTIFIED_REGEX), (match) => match[0]);
    const notes = matches.length === 0
        ? ["Add metrics such as percentages, volume, team size, or revenue."]
        : [];
    return {
        key: "quantifiedAchievements",
        label: "Quantified achievements",
        earned: pointsForQuantifiedResults(matches.length),
        maxPoints: SUB_SCORE_MAX_POINTS.quantifiedAchievements,
        notes,
        evidence: [
            `${matches.length} quantified result(s)`,
            ...matches.slice(0, 3),
        ],
    };
}

;// ../../packages/shared/src/scoring/section-completeness.ts

function scoreSectionCompleteness(input) {
    const { profile } = input;
    const notes = [];
    const evidence = [];
    let earned = 0;
    let completeSections = 0;
    if (profile.contact.name?.trim()) {
        earned += 1;
    }
    else {
        notes.push("Missing contact name.");
    }
    if (profile.contact.email?.trim()) {
        earned += 1;
    }
    else {
        notes.push("Missing contact email.");
    }
    const summaryLength = profile.summary?.trim().length ?? 0;
    if (summaryLength >= 50 && summaryLength <= 500) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Summary should be between 50 and 500 characters.");
    }
    const hasExperience = profile.experiences.some((experience) => experience.title.trim() &&
        experience.company.trim() &&
        experience.startDate.trim());
    if (hasExperience) {
        earned += 2;
        completeSections += 1;
    }
    else {
        notes.push("Add at least one role with title, company, and start date.");
    }
    if (profile.education.length > 0) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Add at least one education entry.");
    }
    if (profile.skills.length >= 3) {
        earned += 2;
        completeSections += 1;
    }
    else if (profile.skills.length > 0) {
        earned += 1;
        notes.push("Add at least three skills.");
    }
    else {
        notes.push("Add a skills section.");
    }
    const hasHighlight = profile.experiences.some((experience) => experience.highlights.length > 0);
    if (hasHighlight) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Add achievement highlights to experience.");
    }
    const hasSecondaryContact = Boolean(profile.contact.phone?.trim() ||
        profile.contact.linkedin?.trim() ||
        profile.contact.location?.trim());
    if (hasSecondaryContact) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Add phone, LinkedIn, or location.");
    }
    if (profile.contact.name?.trim() && profile.contact.email?.trim()) {
        completeSections += 1;
    }
    evidence.push(`${completeSections}/7 sections complete`);
    return {
        key: "sectionCompleteness",
        label: "Section completeness",
        earned: Math.min(earned, SUB_SCORE_MAX_POINTS.sectionCompleteness),
        maxPoints: SUB_SCORE_MAX_POINTS.sectionCompleteness,
        notes,
        evidence,
    };
}

;// ../../packages/shared/src/scoring/spelling-grammar.ts


const REPEATED_WORD_EXCEPTIONS = new Set(["had had", "that that"]);
const ACRONYMS = new Set(["API", "AWS", "CSS", "GCP", "HTML", "SQL"]);
function hasVerbLikeToken(text) {
    const words = text_normalizeText(text).split(/\s+/).filter(Boolean);
    return words.some((word) => ACTION_VERBS.includes(word) ||
        /(?:ed|ing|s)$/.test(word));
}
function scoreSpellingGrammar(input) {
    const highlights = getHighlights(input.profile);
    const text = highlights.join("\n");
    const notes = [];
    const evidence = [];
    let deductions = 0;
    const repeated = Array.from(text.matchAll(/\b(\w+)\s+\1\b/gi), (match) => match[0]).filter((match) => !REPEATED_WORD_EXCEPTIONS.has(match.toLowerCase()));
    if (repeated.length > 0) {
        const penalty = Math.min(2, repeated.length);
        deductions += penalty;
        notes.push("Repeated adjacent words detected.");
        evidence.push(`Repeated word: ${repeated[0]}`);
    }
    if (/  +/.test(text)) {
        deductions += 1;
        notes.push("Multiple spaces between words detected.");
        evidence.push("Multiple spaces found.");
    }
    const lowercaseStarts = highlights.filter((highlight) => /^[a-z]/.test(highlight.trim()));
    if (lowercaseStarts.length > 0) {
        const penalty = Math.min(3, lowercaseStarts.length);
        deductions += penalty;
        notes.push("Some highlights start with lowercase letters.");
        evidence.push(`Lowercase start: ${lowercaseStarts[0]}`);
    }
    const fragments = highlights.filter((highlight) => highlight.length > 40 && !hasVerbLikeToken(highlight));
    if (fragments.length > 0) {
        const penalty = Math.min(2, fragments.length);
        deductions += penalty;
        notes.push("Some long highlights may read like sentence fragments.");
        evidence.push(`Possible fragment: ${fragments[0]}`);
    }
    const punctuationEndings = highlights.filter((highlight) => /\.$/.test(highlight.trim())).length;
    if (highlights.length > 1) {
        const rate = punctuationEndings / highlights.length;
        if (rate > 0.3 && rate < 0.7) {
            deductions += 1;
            notes.push("Trailing punctuation is inconsistent across highlights.");
            evidence.push(`${punctuationEndings}/${highlights.length} highlights end with periods.`);
        }
    }
    const allCaps = Array.from(text.matchAll(/\b[A-Z]{4,}\b/g), (match) => match[0]).filter((word) => !ACRONYMS.has(word));
    if (allCaps.length > 5) {
        deductions += 1;
        notes.push("Excessive all-caps words detected.");
        evidence.push(`All-caps words: ${allCaps.slice(0, 3).join(", ")}`);
    }
    return {
        key: "spellingGrammar",
        label: "Spelling and grammar",
        earned: Math.max(0, SUB_SCORE_MAX_POINTS.spellingGrammar - deductions),
        maxPoints: SUB_SCORE_MAX_POINTS.spellingGrammar,
        notes,
        evidence: evidence.length > 0 ? evidence : ["No heuristic issues detected."],
    };
}

;// ../../packages/shared/src/scoring/index.ts








function scoreResume(input) {
    const subScores = {
        sectionCompleteness: scoreSectionCompleteness(input),
        actionVerbs: scoreActionVerbs(input),
        quantifiedAchievements: scoreQuantifiedAchievements(input),
        keywordMatch: scoreKeywordMatch(input),
        length: scoreLength(input),
        spellingGrammar: scoreSpellingGrammar(input),
        atsFriendliness: scoreAtsFriendliness(input),
    };
    const overall = Object.values(subScores).reduce((sum, subScore) => sum + subScore.earned, 0);
    return {
        overall: Math.max(0, Math.min(100, Math.round(overall))),
        subScores,
        generatedAt: nowIso(),
    };
}








;// ./src/content/sidebar/scoring.ts

function scrapedJobToJobDescription(job, createdAt = new Date().toISOString()) {
    return {
        id: job.sourceJobId || job.url,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        remote: job.remote,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        keywords: job.keywords || [],
        url: job.url,
        deadline: job.deadline,
        createdAt,
    };
}
function computeJobMatchScore(profile, job) {
    if (!profile || !job)
        return null;
    return scoreResume({
        profile,
        rawText: profile.rawText,
        job: scrapedJobToJobDescription(job),
    });
}

;// ./src/content/sidebar/storage.ts
const DISMISSED_DOMAINS_KEY = "slothing:sidebar:dismissedDomains";
function normalizeSidebarDomain(hostname) {
    return hostname
        .trim()
        .toLowerCase()
        .replace(/^www\./, "");
}
async function getDismissedSidebarDomains() {
    return new Promise((resolve) => {
        chrome.storage.local.get(DISMISSED_DOMAINS_KEY, (result) => {
            const value = result[DISMISSED_DOMAINS_KEY];
            resolve(Array.isArray(value) ? value.filter(isString) : []);
        });
    });
}
async function isSidebarDismissedForDomain(hostname = window.location.hostname) {
    const domain = normalizeSidebarDomain(hostname);
    const dismissedDomains = await getDismissedSidebarDomains();
    return dismissedDomains.includes(domain);
}
async function dismissSidebarForDomain(hostname = window.location.hostname) {
    const domain = normalizeSidebarDomain(hostname);
    const dismissedDomains = await getDismissedSidebarDomains();
    const next = Array.from(new Set([...dismissedDomains, domain]));
    return new Promise((resolve) => {
        chrome.storage.local.set({ [DISMISSED_DOMAINS_KEY]: next }, resolve);
    });
}
function isString(value) {
    return typeof value === "string";
}

;// ./src/content/sidebar/styles.ts
const SIDEBAR_STYLES = `
:host {
  all: initial;
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.slothing-sidebar {
  position: fixed;
  top: 96px;
  right: 0;
  z-index: 2147483000;
  color: #172026;
  font-family: inherit;
}

.slothing-sidebar[hidden] {
  display: none;
}

.rail,
.panel {
  border: 1px solid rgba(23, 32, 38, 0.14);
  box-shadow: 0 16px 42px rgba(23, 32, 38, 0.22);
}

.rail {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 46px;
  min-height: 148px;
  padding: 10px 7px;
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: #ffffff;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  cursor: pointer;
}

.rail-score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  border-radius: 999px;
  background: #dff6e9;
  color: #135d3b;
  font-size: 12px;
  font-weight: 800;
  writing-mode: horizontal-tb;
}

.rail-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
}

.panel {
  width: min(360px, calc(100vw - 28px));
  max-height: min(720px, calc(100vh - 128px));
  overflow: auto;
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: #fbfcfb;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(23, 32, 38, 0.1);
  background: #ffffff;
}

.brand {
  margin: 0 0 8px;
  color: #1f6f46;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.title {
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.company {
  margin: 4px 0 0;
  color: #536068;
  font-size: 13px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.icon-row {
  display: flex;
  gap: 6px;
}

button {
  border: 0;
  font: inherit;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid #2f8f5b;
  outline-offset: 2px;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #eef3f0;
  color: #243038;
  cursor: pointer;
}

.icon-button:hover {
  background: #dde8e1;
}

.body {
  display: grid;
  gap: 12px;
  padding: 14px 16px 16px;
}

.score-card,
.actions,
.answer-bank,
.status-card {
  border: 1px solid rgba(23, 32, 38, 0.1);
  border-radius: 8px;
  background: #ffffff;
}

.score-card {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
}

.score-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: conic-gradient(#2f8f5b var(--score-deg), #e7ece9 0);
}

.score-number span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ffffff;
  color: #135d3b;
  font-size: 20px;
  font-weight: 900;
}

.score-label {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
}

.score-note,
.muted,
.result-meta {
  color: #63717a;
  font-size: 12px;
  line-height: 1.4;
}

.actions {
  display: grid;
  gap: 8px;
  padding: 10px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
  padding: 9px 11px;
  border-radius: 6px;
  background: #eef3f0;
  color: #172026;
  font-weight: 750;
  cursor: pointer;
}

.action-button.primary {
  background: #1f6f46;
  color: #ffffff;
}

.action-button:hover:not(:disabled) {
  filter: brightness(0.96);
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.status-card {
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.4;
}

.status-card.success {
  border-color: rgba(31, 111, 70, 0.3);
  color: #135d3b;
  background: #eefaf3;
}

.status-card.error {
  border-color: rgba(176, 52, 52, 0.3);
  color: #8f2424;
  background: #fff2f2;
}

.answer-bank {
  padding: 12px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 850;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.search-row input {
  width: 100%;
  min-width: 0;
  height: 34px;
  border: 1px solid rgba(23, 32, 38, 0.16);
  border-radius: 6px;
  padding: 0 10px;
  color: #172026;
  font: inherit;
  font-size: 13px;
}

.search-row button,
.small-button {
  min-height: 34px;
  border-radius: 6px;
  padding: 0 10px;
  background: #243038;
  color: #ffffff;
  cursor: pointer;
}

.results {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.result {
  border-top: 1px solid rgba(23, 32, 38, 0.1);
  padding-top: 8px;
}

.result-question,
.result-answer {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.result-question {
  font-weight: 800;
}

.result-answer {
  margin-top: 4px;
  color: #38454d;
}

.result-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.small-button {
  min-height: 28px;
  padding: 0 8px;
  font-size: 12px;
}

.small-button.secondary {
  background: #eef3f0;
  color: #243038;
}

@media (max-width: 1023px) {
  .slothing-sidebar {
    display: none;
  }
}
`;

;// ./src/content/sidebar/controller.tsx






const HOST_ID = "slothing-job-page-sidebar-host";
const DESKTOP_MIN_WIDTH = 1024;
class JobPageSidebarController {
    constructor() {
        this.host = null;
        this.root = null;
        this.state = null;
        this.collapsed = false;
        this.dismissedDomain = null;
        this.handleResize = () => this.render();
        window.addEventListener("resize", this.handleResize);
    }
    async update(next) {
        this.state = next;
        this.dismissedDomain = (await isSidebarDismissedForDomain())
            ? normalizeSidebarDomain(window.location.hostname)
            : null;
        this.render();
    }
    showCollapsed() {
        this.collapsed = true;
        this.render();
    }
    async dismissDomain() {
        await dismissSidebarForDomain();
        this.dismissedDomain = normalizeSidebarDomain(window.location.hostname);
        this.unmount();
    }
    destroy() {
        window.removeEventListener("resize", this.handleResize);
        this.unmount();
        this.state = null;
    }
    render() {
        if (!this.state?.scrapedJob ||
            window.innerWidth < DESKTOP_MIN_WIDTH ||
            this.dismissedDomain === normalizeSidebarDomain(window.location.hostname)) {
            this.unmount();
            return;
        }
        const root = this.ensureRoot();
        const score = computeJobMatchScore(this.state.profile, this.state.scrapedJob);
        root.render((0,jsx_runtime.jsx)(JobPageSidebar, { scrapedJob: this.state.scrapedJob, detectedFieldCount: this.state.detectedFieldCount, score: score, isCollapsed: this.collapsed, onCollapseChange: (collapsed) => {
                this.collapsed = collapsed;
                this.render();
            }, onDismiss: () => this.dismissDomain(), onTailor: this.state.onTailor, onCoverLetter: this.state.onCoverLetter, onSave: this.state.onSave, onAutoFill: this.state.onAutoFill, onSearchAnswers: this.state.onSearchAnswers, onApplyAnswer: this.state.onApplyAnswer }));
    }
    ensureRoot() {
        if (this.root)
            return this.root;
        const existing = document.getElementById(HOST_ID);
        this.host = existing || document.createElement("div");
        this.host.id = HOST_ID;
        if (!existing) {
            document.documentElement.appendChild(this.host);
        }
        const shadowRoot = this.host.shadowRoot || this.host.attachShadow({ mode: "open" });
        if (!shadowRoot.querySelector("style")) {
            const style = document.createElement("style");
            style.textContent = SIDEBAR_STYLES;
            shadowRoot.appendChild(style);
        }
        let mount = shadowRoot.querySelector("[data-sidebar-root]");
        if (!mount) {
            mount = document.createElement("div");
            mount.dataset.sidebarRoot = "true";
            shadowRoot.appendChild(mount);
        }
        this.root = (0,client/* createRoot */.H)(mount);
        return this.root;
    }
    unmount() {
        this.root?.unmount();
        this.root = null;
        this.host?.remove();
        this.host = null;
    }
}

;// ./src/content/index.ts
// Content script entry point for Columbus extension
// Import styles for content script










// Initialize components
const fieldDetector = new FieldDetector();
let autoFillEngine = null;
let cachedProfile = null;
let detectedFields = [];
const detectedFieldsByForm = new WeakMap();
const autofilledForms = new WeakSet();
let scrapedJob = null;
let jobDetectedForUrl = null;
let profileLoadPromise = null;
const sidebarController = new JobPageSidebarController();
const submitWatcher = new SubmitWatcher({
    getDetectedFields: (form) => detectedFieldsByForm.get(form) || [],
    getScrapedJob: () => scrapedJob,
    getSettings: getExtensionSettings,
    wasAutofilled: (form) => autofilledForms.has(form),
    onTracked: async (payload) => {
        const response = await sendMessage(Messages.trackApplied(payload));
        if (!response.success) {
            console.error("[Columbus] Failed to track application:", response.error);
            return;
        }
        showAppliedToast(extractCompanyHint(scrapedJob, payload.host), () => {
            sendMessage(Messages.openDashboard()).catch((err) => console.error("[Columbus] Failed to open dashboard:", err));
        });
    },
});
// Scan page on load
scanPage();
submitWatcher.attach();
// Re-scan on dynamic content changes
const observer = new MutationObserver(debounce(scanPage, 500));
observer.observe(document.body, { childList: true, subtree: true });
async function scanPage() {
    // Detect forms
    const forms = document.querySelectorAll("form");
    for (const form of forms) {
        const fields = fieldDetector.detectFields(form);
        if (fields.length > 0) {
            detectedFieldsByForm.set(form, fields);
            detectedFields = fields;
            console.log("[Columbus] Detected fields:", fields.length);
        }
    }
    // Check for job listing
    const scraper = getScraperForUrl(window.location.href);
    let nextScrapedJob = null;
    if (scraper.canHandle(window.location.href)) {
        try {
            nextScrapedJob = await scraper.scrapeJobListing();
            scrapedJob = nextScrapedJob;
            if (nextScrapedJob) {
                console.log("[Columbus] Scraped job:", nextScrapedJob.title);
                if (jobDetectedForUrl !== window.location.href) {
                    jobDetectedForUrl = window.location.href;
                    sendMessage(Messages.jobDetected({
                        title: nextScrapedJob.title,
                        company: nextScrapedJob.company,
                        url: nextScrapedJob.url,
                    })).catch((err) => console.error("[Columbus] Failed to notify job detected:", err));
                }
            }
        }
        catch (err) {
            console.error("[Columbus] Scrape error:", err);
        }
    }
    if (!nextScrapedJob && scrapedJob?.url !== window.location.href) {
        scrapedJob = null;
    }
    void updateSidebar();
}
// Handle messages from popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message)
        .then(sendResponse)
        .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Async response
});
async function handleMessage(message) {
    switch (message.type) {
        case "GET_PAGE_STATUS":
            return {
                hasForm: detectedFields.length > 0,
                hasJobListing: scrapedJob !== null,
                detectedFields: detectedFields.length,
                scrapedJob,
            };
        case "TRIGGER_FILL":
            return handleFillForm();
        case "TRIGGER_IMPORT":
            if (scrapedJob) {
                return sendMessage(Messages.importJob(scrapedJob));
            }
            return { success: false, error: "No job detected" };
        case "SCRAPE_JOB":
            const scraper = getScraperForUrl(window.location.href);
            if (scraper.canHandle(window.location.href)) {
                scrapedJob = await scraper.scrapeJobListing();
                return { success: true, data: scrapedJob };
            }
            return { success: false, error: "No scraper available for this site" };
        case "SCRAPE_JOB_LIST":
            const listScraper = getScraperForUrl(window.location.href);
            if (listScraper.canHandle(window.location.href)) {
                const jobs = await listScraper.scrapeJobList();
                return { success: true, data: jobs };
            }
            return { success: false, error: "No scraper available for this site" };
        case "WW_GET_PAGE_STATE":
            return getWwPageState();
        case "WW_SCRAPE_ALL_VISIBLE":
            return runWwBulkScrape({ paginated: false });
        case "WW_SCRAPE_ALL_PAGINATED":
            return runWwBulkScrape({
                paginated: true,
                ...message.payload,
            });
        default:
            return { success: false, error: `Unknown message type: ${message.type}` };
    }
}
function isWaterlooWorks() {
    return /waterlooworks\.uwaterloo\.ca/.test(window.location.href);
}
function getWwPageState() {
    if (!isWaterlooWorks()) {
        return {
            success: true,
            data: { kind: "other", rowCount: 0, hasNextPage: false },
        };
    }
    const rows = document.querySelectorAll("table.data-viewer-table tbody tr.table__row--body");
    const nextBtn = document.querySelector('a.pagination__link[aria-label="Go to next page"]');
    const currentPage = document
        .querySelector("a.pagination__link.active")
        ?.textContent?.trim();
    const hasDetail = !!document.querySelector(".dashboard-header__posting-title");
    return {
        success: true,
        data: {
            kind: hasDetail ? "detail" : rows.length > 0 ? "list" : "other",
            rowCount: rows.length,
            hasNextPage: !!nextBtn && !nextBtn.classList.contains("disabled"),
            currentPage,
        },
    };
}
async function runWwBulkScrape(opts) {
    if (!isWaterlooWorks()) {
        return { success: false, error: "Not a WaterlooWorks page" };
    }
    const orchestrator = new WaterlooWorksOrchestrator();
    let errors = [];
    let pages = 1;
    const onProgress = (p) => {
        pages = p.currentPage;
        errors = p.errors;
        // Fire-and-forget progress event to the background, which can fan it out
        // to the popup if open.
        sendMessage({
            type: "WW_BULK_PROGRESS",
            payload: p,
        }).catch(() => undefined);
    };
    const jobs = opts.paginated
        ? await orchestrator.scrapeAllPaginated({
            onProgress,
            maxJobs: opts.maxJobs,
            maxPages: opts.maxPages,
        })
        : await orchestrator.scrapeAllVisible({ onProgress });
    if (jobs.length === 0) {
        return {
            success: true,
            data: { imported: 0, attempted: 0, pages, errors },
        };
    }
    // Hand off to background to bulk-import to Slothing.
    const importResp = await sendMessage(Messages.importJobsBatch(jobs));
    if (!importResp.success) {
        return {
            success: false,
            error: importResp.error || "Bulk import failed",
        };
    }
    return {
        success: true,
        data: {
            imported: importResp.data?.imported ?? jobs.length,
            attempted: jobs.length,
            pages,
            errors,
        },
    };
}
async function handleFillForm() {
    if (detectedFields.length === 0) {
        return { success: false, error: "No fields detected" };
    }
    // Get profile if not cached
    if (!cachedProfile) {
        const response = await sendMessage(Messages.getProfile());
        if (!response.success || !response.data) {
            return { success: false, error: "Failed to load profile" };
        }
        cachedProfile = response.data;
    }
    // Create mapper and engine
    const mapper = new FieldMapper(cachedProfile);
    autoFillEngine = new AutoFillEngine(fieldDetector, mapper);
    // Fill the form
    const result = await autoFillEngine.fillForm(detectedFields);
    if (result.filled >= 2) {
        for (const form of new Set(detectedFields
            .map((field) => field.element.closest("form"))
            .filter((form) => form instanceof HTMLFormElement))) {
            autofilledForms.add(form);
        }
    }
    return { success: true, data: result };
}
async function getExtensionSettings() {
    const response = await sendMessage(Messages.getSettings());
    if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to load extension settings");
    }
    return response.data;
}
async function updateSidebar() {
    const profile = await loadProfileForSidebar();
    await sidebarController.update({
        scrapedJob,
        detectedFieldCount: detectedFields.length,
        profile,
        onTailor: async () => {
            if (!scrapedJob)
                throw new Error("No job detected");
            const response = await sendMessage(Messages.tailorFromPage(scrapedJob));
            if (!response.success || !response.data?.url) {
                throw new Error(response.error || "Failed to tailor resume");
            }
            window.open(response.data.url, "_blank", "noopener,noreferrer");
        },
        onCoverLetter: async () => {
            if (!scrapedJob)
                throw new Error("No job detected");
            const response = await sendMessage(Messages.generateCoverLetterFromPage(scrapedJob));
            if (!response.success || !response.data?.url) {
                throw new Error(response.error || "Failed to generate cover letter");
            }
            window.open(response.data.url, "_blank", "noopener,noreferrer");
        },
        onSave: async () => {
            if (!scrapedJob)
                throw new Error("No job detected");
            const response = await sendMessage(Messages.importJob(scrapedJob));
            if (!response.success) {
                throw new Error(response.error || "Failed to save job");
            }
        },
        onAutoFill: async () => {
            const response = await handleFillForm();
            if (!response.success) {
                throw new Error(response.error || "Failed to auto-fill form");
            }
        },
        onSearchAnswers: async (query) => {
            const response = await sendMessage(Messages.searchAnswers(query));
            if (!response.success) {
                throw new Error(response.error || "Answer search failed");
            }
            return response.data || [];
        },
        onApplyAnswer: (answer) => {
            const active = document.activeElement;
            if (active instanceof HTMLInputElement ||
                active instanceof HTMLTextAreaElement) {
                active.value = answer.answer;
                active.dispatchEvent(new Event("input", { bubbles: true }));
                active.dispatchEvent(new Event("change", { bubbles: true }));
            }
        },
    });
}
async function loadProfileForSidebar() {
    if (cachedProfile)
        return cachedProfile;
    if (!profileLoadPromise) {
        profileLoadPromise = sendMessage(Messages.getProfile())
            .then((response) => {
            if (response.success && response.data) {
                cachedProfile = response.data;
                return response.data;
            }
            return null;
        })
            .catch(() => null)
            .finally(() => {
            profileLoadPromise = null;
        });
    }
    return profileLoadPromise;
}
window.addEventListener("pagehide", () => {
    submitWatcher.detach();
    sidebarController.destroy();
});
// Utility: debounce function
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
console.log("[Columbus] Content script loaded");
// Pick up a localStorage-transported auth token from the Slothing connect page.
// Used on browsers that don't honor externally_connectable (Firefox in
// particular). The connect page writes the token under this key; we forward it
// to the background, which stores it in chrome.storage.local and clears the
// localStorage entry. Polls for ~30s in case the script runs before the page
// has written the key.
const SLOTHING_TOKEN_KEY = "columbus_extension_token";
let pickupInFlight = false;
function pickUpSlothingToken() {
    try {
        const raw = localStorage.getItem(SLOTHING_TOKEN_KEY);
        if (!raw)
            return "empty";
        const parsed = JSON.parse(raw);
        if (!parsed?.token || !parsed?.expiresAt) {
            // Malformed payload — purge so we stop polling.
            try {
                localStorage.removeItem(SLOTHING_TOKEN_KEY);
            }
            catch {
                // ignore
            }
            return "empty";
        }
        if (pickupInFlight)
            return "pending";
        pickupInFlight = true;
        chrome.runtime.sendMessage({
            type: "AUTH_CALLBACK",
            token: parsed.token,
            expiresAt: parsed.expiresAt,
        }, (response) => {
            pickupInFlight = false;
            if (response?.success) {
                try {
                    localStorage.removeItem(SLOTHING_TOKEN_KEY);
                }
                catch {
                    // ignore
                }
                console.log("[Columbus] picked up localStorage token");
            }
        });
        return "pending";
    }
    catch {
        return "empty";
    }
}
if (/(^|\.)localhost(:|$)|^127\.0\.0\.1(:|$)|^\[::1\](:|$)/.test(window.location.host)) {
    // Initial probe: if there's nothing to pick up and we're not on the connect
    // page itself, there's no reason to poll — the page hasn't been opened.
    // On the connect page (or anywhere else if the user is about to land on
    // /extension/connect via SPA nav), keep polling for 30s.
    const initial = pickUpSlothingToken();
    const onConnectPath = /\/extension\/connect(\b|\/)/.test(window.location.pathname);
    if (initial !== "empty" || onConnectPath) {
        let elapsedMs = 0;
        const intervalId = setInterval(() => {
            elapsedMs += 500;
            const result = pickUpSlothingToken();
            if ((result === "empty" && !pickupInFlight && elapsedMs > 2000) ||
                elapsedMs >= 30000) {
                clearInterval(intervalId);
            }
        }, 500);
    }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5VUE7QUFDc0Y7QUFDL0U7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QsV0FBVztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUI7QUFDbkYsZUFBZSwwQkFBMEI7QUFDekM7QUFDQTs7O0FDcE1BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIseUJBQXlCLEdBQUc7QUFDNUI7QUFDQTtBQUNBOzs7QUMvSEE7QUFDNkM7QUFDdEMsOEJBQThCLFdBQVc7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHFDQUFxQyxHQUFHLHFDQUFxQztBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUM2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sbUNBQW1DLFdBQVc7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQ0FBaUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLEtBQUs7QUFDckUsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsT0E7QUFDNkM7QUFDdEMsNEJBQTRCLFdBQVc7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLE9BQU87QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsd0NBQXdDLEdBQUcseUNBQXlDLEVBQUUsd0NBQXdDO0FBQ3hKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOU5BO0FBQzZDO0FBQ3RDLGdDQUFnQyxXQUFXO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdDQUF3QyxHQUFHLHdDQUF3QztBQUNqSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hPQTtBQUM2QztBQUN0QywyQkFBMkIsV0FBVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix3Q0FBd0MsR0FBRyx3Q0FBd0M7QUFDakg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM09BO0FBQzZDO0FBQ3RDLDZCQUE2QixXQUFXO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFLHNCQUFzQixJQUFJLHFCQUFxQjtBQUMzRjtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRSx1QkFBdUI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLE1BQU0sMEVBQTBFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsTUFBTSw4Q0FBOEM7QUFDcEQsTUFBTSwyQ0FBMkM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsTUFBTSw0REFBNEQ7QUFDbEUsTUFBTSwyRUFBMkU7QUFDakYsTUFBTSw2REFBNkQ7QUFDbkUsTUFBTSwwQ0FBMEM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTzs7O0FDdFJ3RDtBQUNaO0FBQ3dDO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsK0JBQStCO0FBQ2xFLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0LWRvbUAxOC4zLjFfcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vY2pzL3JlYWN0LWRvbS5wcm9kdWN0aW9uLm1pbi5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdC1kb21AMTguMy4xX3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QtZG9tL2NsaWVudC5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdC1kb21AMTguMy4xX3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QtZG9tL2luZGV4LmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC9qc3gtcnVudGltZS5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zY2hlZHVsZXJAMC4yMy4yL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvY2pzL3NjaGVkdWxlci5wcm9kdWN0aW9uLm1pbi5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zY2hlZHVsZXJAMC4yMy4yL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL3NoYXJlZC9maWVsZC1wYXR0ZXJucy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvYXV0by1maWxsL2ZpZWxkLWRldGVjdG9yLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9hdXRvLWZpbGwvZmllbGQtbWFwcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9hdXRvLWZpbGwvZW5naW5lLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9iYXNlLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL2xpbmtlZGluLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL3dhdGVybG9vLXdvcmtzLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL2luZGVlZC1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9ncmVlbmhvdXNlLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL2xldmVyLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL2dlbmVyaWMtc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvc2NyYXBlci1yZWdpc3RyeS50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvd2F0ZXJsb28td29ya3Mtb3JjaGVzdHJhdG9yLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvc2hhcmVkL21lc3NhZ2VzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC90cmFja2luZy9hcHBsaWVkLXRvYXN0LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC90cmFja2luZy9wYWdlLXNuYXBzaG90LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC90cmFja2luZy9zdWJtaXQtd2F0Y2hlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2lkZWJhci9qb2ItcGFnZS1zaWRlYmFyLnRzeCIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvZm9ybWF0dGVycy9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvdGV4dC50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9hY3Rpb24tdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvYXRzLWNoYXJhY3RlcnMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvYXRzLWZyaWVuZGxpbmVzcy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9zeW5vbnltcy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9rZXl3b3JkLW1hdGNoLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2xlbmd0aC50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9xdWFudGlmaWVkLWFjaGlldmVtZW50cy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9zZWN0aW9uLWNvbXBsZXRlbmVzcy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9zcGVsbGluZy1ncmFtbWFyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2luZGV4LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zaWRlYmFyL3Njb3JpbmcudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NpZGViYXIvc3RvcmFnZS50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2lkZWJhci9zdHlsZXMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NpZGViYXIvY29udHJvbGxlci50c3giLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2UgUmVhY3RcbiAqIHJlYWN0LWRvbS5wcm9kdWN0aW9uLm1pbi5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG4vKlxuIE1vZGVybml6ciAzLjAuMHByZSAoQ3VzdG9tIEJ1aWxkKSB8IE1JVFxuKi9cbid1c2Ugc3RyaWN0Jzt2YXIgYWE9cmVxdWlyZShcInJlYWN0XCIpLGNhPXJlcXVpcmUoXCJzY2hlZHVsZXJcIik7ZnVuY3Rpb24gcChhKXtmb3IodmFyIGI9XCJodHRwczovL3JlYWN0anMub3JnL2RvY3MvZXJyb3ItZGVjb2Rlci5odG1sP2ludmFyaWFudD1cIithLGM9MTtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKWIrPVwiJmFyZ3NbXT1cIitlbmNvZGVVUklDb21wb25lbnQoYXJndW1lbnRzW2NdKTtyZXR1cm5cIk1pbmlmaWVkIFJlYWN0IGVycm9yICNcIithK1wiOyB2aXNpdCBcIitiK1wiIGZvciB0aGUgZnVsbCBtZXNzYWdlIG9yIHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCBmb3IgZnVsbCBlcnJvcnMgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy5cIn12YXIgZGE9bmV3IFNldCxlYT17fTtmdW5jdGlvbiBmYShhLGIpe2hhKGEsYik7aGEoYStcIkNhcHR1cmVcIixiKX1cbmZ1bmN0aW9uIGhhKGEsYil7ZWFbYV09Yjtmb3IoYT0wO2E8Yi5sZW5ndGg7YSsrKWRhLmFkZChiW2FdKX1cbnZhciBpYT0hKFwidW5kZWZpbmVkXCI9PT10eXBlb2Ygd2luZG93fHxcInVuZGVmaW5lZFwiPT09dHlwZW9mIHdpbmRvdy5kb2N1bWVudHx8XCJ1bmRlZmluZWRcIj09PXR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCksamE9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxrYT0vXls6QS1aX2EtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRF1bOkEtWl9hLXpcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRcXC0uMC05XFx1MDBCN1xcdTAzMDAtXFx1MDM2RlxcdTIwM0YtXFx1MjA0MF0qJC8sbGE9XG57fSxtYT17fTtmdW5jdGlvbiBvYShhKXtpZihqYS5jYWxsKG1hLGEpKXJldHVybiEwO2lmKGphLmNhbGwobGEsYSkpcmV0dXJuITE7aWYoa2EudGVzdChhKSlyZXR1cm4gbWFbYV09ITA7bGFbYV09ITA7cmV0dXJuITF9ZnVuY3Rpb24gcGEoYSxiLGMsZCl7aWYobnVsbCE9PWMmJjA9PT1jLnR5cGUpcmV0dXJuITE7c3dpdGNoKHR5cGVvZiBiKXtjYXNlIFwiZnVuY3Rpb25cIjpjYXNlIFwic3ltYm9sXCI6cmV0dXJuITA7Y2FzZSBcImJvb2xlYW5cIjppZihkKXJldHVybiExO2lmKG51bGwhPT1jKXJldHVybiFjLmFjY2VwdHNCb29sZWFuczthPWEudG9Mb3dlckNhc2UoKS5zbGljZSgwLDUpO3JldHVyblwiZGF0YS1cIiE9PWEmJlwiYXJpYS1cIiE9PWE7ZGVmYXVsdDpyZXR1cm4hMX19XG5mdW5jdGlvbiBxYShhLGIsYyxkKXtpZihudWxsPT09Ynx8XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBifHxwYShhLGIsYyxkKSlyZXR1cm4hMDtpZihkKXJldHVybiExO2lmKG51bGwhPT1jKXN3aXRjaChjLnR5cGUpe2Nhc2UgMzpyZXR1cm4hYjtjYXNlIDQ6cmV0dXJuITE9PT1iO2Nhc2UgNTpyZXR1cm4gaXNOYU4oYik7Y2FzZSA2OnJldHVybiBpc05hTihiKXx8MT5ifXJldHVybiExfWZ1bmN0aW9uIHYoYSxiLGMsZCxlLGYsZyl7dGhpcy5hY2NlcHRzQm9vbGVhbnM9Mj09PWJ8fDM9PT1ifHw0PT09Yjt0aGlzLmF0dHJpYnV0ZU5hbWU9ZDt0aGlzLmF0dHJpYnV0ZU5hbWVzcGFjZT1lO3RoaXMubXVzdFVzZVByb3BlcnR5PWM7dGhpcy5wcm9wZXJ0eU5hbWU9YTt0aGlzLnR5cGU9Yjt0aGlzLnNhbml0aXplVVJMPWY7dGhpcy5yZW1vdmVFbXB0eVN0cmluZz1nfXZhciB6PXt9O1xuXCJjaGlsZHJlbiBkYW5nZXJvdXNseVNldElubmVySFRNTCBkZWZhdWx0VmFsdWUgZGVmYXVsdENoZWNrZWQgaW5uZXJIVE1MIHN1cHByZXNzQ29udGVudEVkaXRhYmxlV2FybmluZyBzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmcgc3R5bGVcIi5zcGxpdChcIiBcIikuZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMCwhMSxhLG51bGwsITEsITEpfSk7W1tcImFjY2VwdENoYXJzZXRcIixcImFjY2VwdC1jaGFyc2V0XCJdLFtcImNsYXNzTmFtZVwiLFwiY2xhc3NcIl0sW1wiaHRtbEZvclwiLFwiZm9yXCJdLFtcImh0dHBFcXVpdlwiLFwiaHR0cC1lcXVpdlwiXV0uZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1hWzBdO3pbYl09bmV3IHYoYiwxLCExLGFbMV0sbnVsbCwhMSwhMSl9KTtbXCJjb250ZW50RWRpdGFibGVcIixcImRyYWdnYWJsZVwiLFwic3BlbGxDaGVja1wiLFwidmFsdWVcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMiwhMSxhLnRvTG93ZXJDYXNlKCksbnVsbCwhMSwhMSl9KTtcbltcImF1dG9SZXZlcnNlXCIsXCJleHRlcm5hbFJlc291cmNlc1JlcXVpcmVkXCIsXCJmb2N1c2FibGVcIixcInByZXNlcnZlQWxwaGFcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMiwhMSxhLG51bGwsITEsITEpfSk7XCJhbGxvd0Z1bGxTY3JlZW4gYXN5bmMgYXV0b0ZvY3VzIGF1dG9QbGF5IGNvbnRyb2xzIGRlZmF1bHQgZGVmZXIgZGlzYWJsZWQgZGlzYWJsZVBpY3R1cmVJblBpY3R1cmUgZGlzYWJsZVJlbW90ZVBsYXliYWNrIGZvcm1Ob1ZhbGlkYXRlIGhpZGRlbiBsb29wIG5vTW9kdWxlIG5vVmFsaWRhdGUgb3BlbiBwbGF5c0lubGluZSByZWFkT25seSByZXF1aXJlZCByZXZlcnNlZCBzY29wZWQgc2VhbWxlc3MgaXRlbVNjb3BlXCIuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oYSl7elthXT1uZXcgdihhLDMsITEsYS50b0xvd2VyQ2FzZSgpLG51bGwsITEsITEpfSk7XG5bXCJjaGVja2VkXCIsXCJtdWx0aXBsZVwiLFwibXV0ZWRcIixcInNlbGVjdGVkXCJdLmZvckVhY2goZnVuY3Rpb24oYSl7elthXT1uZXcgdihhLDMsITAsYSxudWxsLCExLCExKX0pO1tcImNhcHR1cmVcIixcImRvd25sb2FkXCJdLmZvckVhY2goZnVuY3Rpb24oYSl7elthXT1uZXcgdihhLDQsITEsYSxudWxsLCExLCExKX0pO1tcImNvbHNcIixcInJvd3NcIixcInNpemVcIixcInNwYW5cIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsNiwhMSxhLG51bGwsITEsITEpfSk7W1wicm93U3BhblwiLFwic3RhcnRcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsNSwhMSxhLnRvTG93ZXJDYXNlKCksbnVsbCwhMSwhMSl9KTt2YXIgcmE9L1tcXC06XShbYS16XSkvZztmdW5jdGlvbiBzYShhKXtyZXR1cm4gYVsxXS50b1VwcGVyQ2FzZSgpfVxuXCJhY2NlbnQtaGVpZ2h0IGFsaWdubWVudC1iYXNlbGluZSBhcmFiaWMtZm9ybSBiYXNlbGluZS1zaGlmdCBjYXAtaGVpZ2h0IGNsaXAtcGF0aCBjbGlwLXJ1bGUgY29sb3ItaW50ZXJwb2xhdGlvbiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnMgY29sb3ItcHJvZmlsZSBjb2xvci1yZW5kZXJpbmcgZG9taW5hbnQtYmFzZWxpbmUgZW5hYmxlLWJhY2tncm91bmQgZmlsbC1vcGFjaXR5IGZpbGwtcnVsZSBmbG9vZC1jb2xvciBmbG9vZC1vcGFjaXR5IGZvbnQtZmFtaWx5IGZvbnQtc2l6ZSBmb250LXNpemUtYWRqdXN0IGZvbnQtc3RyZXRjaCBmb250LXN0eWxlIGZvbnQtdmFyaWFudCBmb250LXdlaWdodCBnbHlwaC1uYW1lIGdseXBoLW9yaWVudGF0aW9uLWhvcml6b250YWwgZ2x5cGgtb3JpZW50YXRpb24tdmVydGljYWwgaG9yaXotYWR2LXggaG9yaXotb3JpZ2luLXggaW1hZ2UtcmVuZGVyaW5nIGxldHRlci1zcGFjaW5nIGxpZ2h0aW5nLWNvbG9yIG1hcmtlci1lbmQgbWFya2VyLW1pZCBtYXJrZXItc3RhcnQgb3ZlcmxpbmUtcG9zaXRpb24gb3ZlcmxpbmUtdGhpY2tuZXNzIHBhaW50LW9yZGVyIHBhbm9zZS0xIHBvaW50ZXItZXZlbnRzIHJlbmRlcmluZy1pbnRlbnQgc2hhcGUtcmVuZGVyaW5nIHN0b3AtY29sb3Igc3RvcC1vcGFjaXR5IHN0cmlrZXRocm91Z2gtcG9zaXRpb24gc3RyaWtldGhyb3VnaC10aGlja25lc3Mgc3Ryb2tlLWRhc2hhcnJheSBzdHJva2UtZGFzaG9mZnNldCBzdHJva2UtbGluZWNhcCBzdHJva2UtbGluZWpvaW4gc3Ryb2tlLW1pdGVybGltaXQgc3Ryb2tlLW9wYWNpdHkgc3Ryb2tlLXdpZHRoIHRleHQtYW5jaG9yIHRleHQtZGVjb3JhdGlvbiB0ZXh0LXJlbmRlcmluZyB1bmRlcmxpbmUtcG9zaXRpb24gdW5kZXJsaW5lLXRoaWNrbmVzcyB1bmljb2RlLWJpZGkgdW5pY29kZS1yYW5nZSB1bml0cy1wZXItZW0gdi1hbHBoYWJldGljIHYtaGFuZ2luZyB2LWlkZW9ncmFwaGljIHYtbWF0aGVtYXRpY2FsIHZlY3Rvci1lZmZlY3QgdmVydC1hZHYteSB2ZXJ0LW9yaWdpbi14IHZlcnQtb3JpZ2luLXkgd29yZC1zcGFjaW5nIHdyaXRpbmctbW9kZSB4bWxuczp4bGluayB4LWhlaWdodFwiLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWEucmVwbGFjZShyYSxcbnNhKTt6W2JdPW5ldyB2KGIsMSwhMSxhLG51bGwsITEsITEpfSk7XCJ4bGluazphY3R1YXRlIHhsaW5rOmFyY3JvbGUgeGxpbms6cm9sZSB4bGluazpzaG93IHhsaW5rOnRpdGxlIHhsaW5rOnR5cGVcIi5zcGxpdChcIiBcIikuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UocmEsc2EpO3pbYl09bmV3IHYoYiwxLCExLGEsXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsITEsITEpfSk7W1wieG1sOmJhc2VcIixcInhtbDpsYW5nXCIsXCJ4bWw6c3BhY2VcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UocmEsc2EpO3pbYl09bmV3IHYoYiwxLCExLGEsXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIiwhMSwhMSl9KTtbXCJ0YWJJbmRleFwiLFwiY3Jvc3NPcmlnaW5cIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMSwhMSxhLnRvTG93ZXJDYXNlKCksbnVsbCwhMSwhMSl9KTtcbnoueGxpbmtIcmVmPW5ldyB2KFwieGxpbmtIcmVmXCIsMSwhMSxcInhsaW5rOmhyZWZcIixcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwhMCwhMSk7W1wic3JjXCIsXCJocmVmXCIsXCJhY3Rpb25cIixcImZvcm1BY3Rpb25cIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMSwhMSxhLnRvTG93ZXJDYXNlKCksbnVsbCwhMCwhMCl9KTtcbmZ1bmN0aW9uIHRhKGEsYixjLGQpe3ZhciBlPXouaGFzT3duUHJvcGVydHkoYik/eltiXTpudWxsO2lmKG51bGwhPT1lPzAhPT1lLnR5cGU6ZHx8ISgyPGIubGVuZ3RoKXx8XCJvXCIhPT1iWzBdJiZcIk9cIiE9PWJbMF18fFwiblwiIT09YlsxXSYmXCJOXCIhPT1iWzFdKXFhKGIsYyxlLGQpJiYoYz1udWxsKSxkfHxudWxsPT09ZT9vYShiKSYmKG51bGw9PT1jP2EucmVtb3ZlQXR0cmlidXRlKGIpOmEuc2V0QXR0cmlidXRlKGIsXCJcIitjKSk6ZS5tdXN0VXNlUHJvcGVydHk/YVtlLnByb3BlcnR5TmFtZV09bnVsbD09PWM/Mz09PWUudHlwZT8hMTpcIlwiOmM6KGI9ZS5hdHRyaWJ1dGVOYW1lLGQ9ZS5hdHRyaWJ1dGVOYW1lc3BhY2UsbnVsbD09PWM/YS5yZW1vdmVBdHRyaWJ1dGUoYik6KGU9ZS50eXBlLGM9Mz09PWV8fDQ9PT1lJiYhMD09PWM/XCJcIjpcIlwiK2MsZD9hLnNldEF0dHJpYnV0ZU5TKGQsYixjKTphLnNldEF0dHJpYnV0ZShiLGMpKSl9XG52YXIgdWE9YWEuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQsdmE9U3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIiksd2E9U3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSx5YT1TeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIiksemE9U3ltYm9sLmZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpLEFhPVN5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKSxCYT1TeW1ib2wuZm9yKFwicmVhY3QucHJvdmlkZXJcIiksQ2E9U3ltYm9sLmZvcihcInJlYWN0LmNvbnRleHRcIiksRGE9U3ltYm9sLmZvcihcInJlYWN0LmZvcndhcmRfcmVmXCIpLEVhPVN5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZVwiKSxGYT1TeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VfbGlzdFwiKSxHYT1TeW1ib2wuZm9yKFwicmVhY3QubWVtb1wiKSxIYT1TeW1ib2wuZm9yKFwicmVhY3QubGF6eVwiKTtTeW1ib2wuZm9yKFwicmVhY3Quc2NvcGVcIik7U3ltYm9sLmZvcihcInJlYWN0LmRlYnVnX3RyYWNlX21vZGVcIik7XG52YXIgSWE9U3ltYm9sLmZvcihcInJlYWN0Lm9mZnNjcmVlblwiKTtTeW1ib2wuZm9yKFwicmVhY3QubGVnYWN5X2hpZGRlblwiKTtTeW1ib2wuZm9yKFwicmVhY3QuY2FjaGVcIik7U3ltYm9sLmZvcihcInJlYWN0LnRyYWNpbmdfbWFya2VyXCIpO3ZhciBKYT1TeW1ib2wuaXRlcmF0b3I7ZnVuY3Rpb24gS2EoYSl7aWYobnVsbD09PWF8fFwib2JqZWN0XCIhPT10eXBlb2YgYSlyZXR1cm4gbnVsbDthPUphJiZhW0phXXx8YVtcIkBAaXRlcmF0b3JcIl07cmV0dXJuXCJmdW5jdGlvblwiPT09dHlwZW9mIGE/YTpudWxsfXZhciBBPU9iamVjdC5hc3NpZ24sTGE7ZnVuY3Rpb24gTWEoYSl7aWYodm9pZCAwPT09TGEpdHJ5e3Rocm93IEVycm9yKCk7fWNhdGNoKGMpe3ZhciBiPWMuc3RhY2sudHJpbSgpLm1hdGNoKC9cXG4oICooYXQgKT8pLyk7TGE9YiYmYlsxXXx8XCJcIn1yZXR1cm5cIlxcblwiK0xhK2F9dmFyIE5hPSExO1xuZnVuY3Rpb24gT2EoYSxiKXtpZighYXx8TmEpcmV0dXJuXCJcIjtOYT0hMDt2YXIgYz1FcnJvci5wcmVwYXJlU3RhY2tUcmFjZTtFcnJvci5wcmVwYXJlU3RhY2tUcmFjZT12b2lkIDA7dHJ5e2lmKGIpaWYoYj1mdW5jdGlvbigpe3Rocm93IEVycm9yKCk7fSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYi5wcm90b3R5cGUsXCJwcm9wc1wiLHtzZXQ6ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcigpO319KSxcIm9iamVjdFwiPT09dHlwZW9mIFJlZmxlY3QmJlJlZmxlY3QuY29uc3RydWN0KXt0cnl7UmVmbGVjdC5jb25zdHJ1Y3QoYixbXSl9Y2F0Y2gobCl7dmFyIGQ9bH1SZWZsZWN0LmNvbnN0cnVjdChhLFtdLGIpfWVsc2V7dHJ5e2IuY2FsbCgpfWNhdGNoKGwpe2Q9bH1hLmNhbGwoYi5wcm90b3R5cGUpfWVsc2V7dHJ5e3Rocm93IEVycm9yKCk7fWNhdGNoKGwpe2Q9bH1hKCl9fWNhdGNoKGwpe2lmKGwmJmQmJlwic3RyaW5nXCI9PT10eXBlb2YgbC5zdGFjayl7Zm9yKHZhciBlPWwuc3RhY2suc3BsaXQoXCJcXG5cIiksXG5mPWQuc3RhY2suc3BsaXQoXCJcXG5cIiksZz1lLmxlbmd0aC0xLGg9Zi5sZW5ndGgtMTsxPD1nJiYwPD1oJiZlW2ddIT09ZltoXTspaC0tO2Zvcig7MTw9ZyYmMDw9aDtnLS0saC0tKWlmKGVbZ10hPT1mW2hdKXtpZigxIT09Z3x8MSE9PWgpe2RvIGlmKGctLSxoLS0sMD5ofHxlW2ddIT09ZltoXSl7dmFyIGs9XCJcXG5cIitlW2ddLnJlcGxhY2UoXCIgYXQgbmV3IFwiLFwiIGF0IFwiKTthLmRpc3BsYXlOYW1lJiZrLmluY2x1ZGVzKFwiPGFub255bW91cz5cIikmJihrPWsucmVwbGFjZShcIjxhbm9ueW1vdXM+XCIsYS5kaXNwbGF5TmFtZSkpO3JldHVybiBrfXdoaWxlKDE8PWcmJjA8PWgpfWJyZWFrfX19ZmluYWxseXtOYT0hMSxFcnJvci5wcmVwYXJlU3RhY2tUcmFjZT1jfXJldHVybihhPWE/YS5kaXNwbGF5TmFtZXx8YS5uYW1lOlwiXCIpP01hKGEpOlwiXCJ9XG5mdW5jdGlvbiBQYShhKXtzd2l0Y2goYS50YWcpe2Nhc2UgNTpyZXR1cm4gTWEoYS50eXBlKTtjYXNlIDE2OnJldHVybiBNYShcIkxhenlcIik7Y2FzZSAxMzpyZXR1cm4gTWEoXCJTdXNwZW5zZVwiKTtjYXNlIDE5OnJldHVybiBNYShcIlN1c3BlbnNlTGlzdFwiKTtjYXNlIDA6Y2FzZSAyOmNhc2UgMTU6cmV0dXJuIGE9T2EoYS50eXBlLCExKSxhO2Nhc2UgMTE6cmV0dXJuIGE9T2EoYS50eXBlLnJlbmRlciwhMSksYTtjYXNlIDE6cmV0dXJuIGE9T2EoYS50eXBlLCEwKSxhO2RlZmF1bHQ6cmV0dXJuXCJcIn19XG5mdW5jdGlvbiBRYShhKXtpZihudWxsPT1hKXJldHVybiBudWxsO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhKXJldHVybiBhLmRpc3BsYXlOYW1lfHxhLm5hbWV8fG51bGw7aWYoXCJzdHJpbmdcIj09PXR5cGVvZiBhKXJldHVybiBhO3N3aXRjaChhKXtjYXNlIHlhOnJldHVyblwiRnJhZ21lbnRcIjtjYXNlIHdhOnJldHVyblwiUG9ydGFsXCI7Y2FzZSBBYTpyZXR1cm5cIlByb2ZpbGVyXCI7Y2FzZSB6YTpyZXR1cm5cIlN0cmljdE1vZGVcIjtjYXNlIEVhOnJldHVyblwiU3VzcGVuc2VcIjtjYXNlIEZhOnJldHVyblwiU3VzcGVuc2VMaXN0XCJ9aWYoXCJvYmplY3RcIj09PXR5cGVvZiBhKXN3aXRjaChhLiQkdHlwZW9mKXtjYXNlIENhOnJldHVybihhLmRpc3BsYXlOYW1lfHxcIkNvbnRleHRcIikrXCIuQ29uc3VtZXJcIjtjYXNlIEJhOnJldHVybihhLl9jb250ZXh0LmRpc3BsYXlOYW1lfHxcIkNvbnRleHRcIikrXCIuUHJvdmlkZXJcIjtjYXNlIERhOnZhciBiPWEucmVuZGVyO2E9YS5kaXNwbGF5TmFtZTthfHwoYT1iLmRpc3BsYXlOYW1lfHxcbmIubmFtZXx8XCJcIixhPVwiXCIhPT1hP1wiRm9yd2FyZFJlZihcIithK1wiKVwiOlwiRm9yd2FyZFJlZlwiKTtyZXR1cm4gYTtjYXNlIEdhOnJldHVybiBiPWEuZGlzcGxheU5hbWV8fG51bGwsbnVsbCE9PWI/YjpRYShhLnR5cGUpfHxcIk1lbW9cIjtjYXNlIEhhOmI9YS5fcGF5bG9hZDthPWEuX2luaXQ7dHJ5e3JldHVybiBRYShhKGIpKX1jYXRjaChjKXt9fXJldHVybiBudWxsfVxuZnVuY3Rpb24gUmEoYSl7dmFyIGI9YS50eXBlO3N3aXRjaChhLnRhZyl7Y2FzZSAyNDpyZXR1cm5cIkNhY2hlXCI7Y2FzZSA5OnJldHVybihiLmRpc3BsYXlOYW1lfHxcIkNvbnRleHRcIikrXCIuQ29uc3VtZXJcIjtjYXNlIDEwOnJldHVybihiLl9jb250ZXh0LmRpc3BsYXlOYW1lfHxcIkNvbnRleHRcIikrXCIuUHJvdmlkZXJcIjtjYXNlIDE4OnJldHVyblwiRGVoeWRyYXRlZEZyYWdtZW50XCI7Y2FzZSAxMTpyZXR1cm4gYT1iLnJlbmRlcixhPWEuZGlzcGxheU5hbWV8fGEubmFtZXx8XCJcIixiLmRpc3BsYXlOYW1lfHwoXCJcIiE9PWE/XCJGb3J3YXJkUmVmKFwiK2ErXCIpXCI6XCJGb3J3YXJkUmVmXCIpO2Nhc2UgNzpyZXR1cm5cIkZyYWdtZW50XCI7Y2FzZSA1OnJldHVybiBiO2Nhc2UgNDpyZXR1cm5cIlBvcnRhbFwiO2Nhc2UgMzpyZXR1cm5cIlJvb3RcIjtjYXNlIDY6cmV0dXJuXCJUZXh0XCI7Y2FzZSAxNjpyZXR1cm4gUWEoYik7Y2FzZSA4OnJldHVybiBiPT09emE/XCJTdHJpY3RNb2RlXCI6XCJNb2RlXCI7Y2FzZSAyMjpyZXR1cm5cIk9mZnNjcmVlblwiO1xuY2FzZSAxMjpyZXR1cm5cIlByb2ZpbGVyXCI7Y2FzZSAyMTpyZXR1cm5cIlNjb3BlXCI7Y2FzZSAxMzpyZXR1cm5cIlN1c3BlbnNlXCI7Y2FzZSAxOTpyZXR1cm5cIlN1c3BlbnNlTGlzdFwiO2Nhc2UgMjU6cmV0dXJuXCJUcmFjaW5nTWFya2VyXCI7Y2FzZSAxOmNhc2UgMDpjYXNlIDE3OmNhc2UgMjpjYXNlIDE0OmNhc2UgMTU6aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGIpcmV0dXJuIGIuZGlzcGxheU5hbWV8fGIubmFtZXx8bnVsbDtpZihcInN0cmluZ1wiPT09dHlwZW9mIGIpcmV0dXJuIGJ9cmV0dXJuIG51bGx9ZnVuY3Rpb24gU2EoYSl7c3dpdGNoKHR5cGVvZiBhKXtjYXNlIFwiYm9vbGVhblwiOmNhc2UgXCJudW1iZXJcIjpjYXNlIFwic3RyaW5nXCI6Y2FzZSBcInVuZGVmaW5lZFwiOnJldHVybiBhO2Nhc2UgXCJvYmplY3RcIjpyZXR1cm4gYTtkZWZhdWx0OnJldHVyblwiXCJ9fVxuZnVuY3Rpb24gVGEoYSl7dmFyIGI9YS50eXBlO3JldHVybihhPWEubm9kZU5hbWUpJiZcImlucHV0XCI9PT1hLnRvTG93ZXJDYXNlKCkmJihcImNoZWNrYm94XCI9PT1ifHxcInJhZGlvXCI9PT1iKX1cbmZ1bmN0aW9uIFVhKGEpe3ZhciBiPVRhKGEpP1wiY2hlY2tlZFwiOlwidmFsdWVcIixjPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsYiksZD1cIlwiK2FbYl07aWYoIWEuaGFzT3duUHJvcGVydHkoYikmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgYyYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGMuZ2V0JiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgYy5zZXQpe3ZhciBlPWMuZ2V0LGY9Yy5zZXQ7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsYix7Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBlLmNhbGwodGhpcyl9LHNldDpmdW5jdGlvbihhKXtkPVwiXCIrYTtmLmNhbGwodGhpcyxhKX19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZX0pO3JldHVybntnZXRWYWx1ZTpmdW5jdGlvbigpe3JldHVybiBkfSxzZXRWYWx1ZTpmdW5jdGlvbihhKXtkPVwiXCIrYX0sc3RvcFRyYWNraW5nOmZ1bmN0aW9uKCl7YS5fdmFsdWVUcmFja2VyPVxubnVsbDtkZWxldGUgYVtiXX19fX1mdW5jdGlvbiBWYShhKXthLl92YWx1ZVRyYWNrZXJ8fChhLl92YWx1ZVRyYWNrZXI9VWEoYSkpfWZ1bmN0aW9uIFdhKGEpe2lmKCFhKXJldHVybiExO3ZhciBiPWEuX3ZhbHVlVHJhY2tlcjtpZighYilyZXR1cm4hMDt2YXIgYz1iLmdldFZhbHVlKCk7dmFyIGQ9XCJcIjthJiYoZD1UYShhKT9hLmNoZWNrZWQ/XCJ0cnVlXCI6XCJmYWxzZVwiOmEudmFsdWUpO2E9ZDtyZXR1cm4gYSE9PWM/KGIuc2V0VmFsdWUoYSksITApOiExfWZ1bmN0aW9uIFhhKGEpe2E9YXx8KFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQ/ZG9jdW1lbnQ6dm9pZCAwKTtpZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIGEpcmV0dXJuIG51bGw7dHJ5e3JldHVybiBhLmFjdGl2ZUVsZW1lbnR8fGEuYm9keX1jYXRjaChiKXtyZXR1cm4gYS5ib2R5fX1cbmZ1bmN0aW9uIFlhKGEsYil7dmFyIGM9Yi5jaGVja2VkO3JldHVybiBBKHt9LGIse2RlZmF1bHRDaGVja2VkOnZvaWQgMCxkZWZhdWx0VmFsdWU6dm9pZCAwLHZhbHVlOnZvaWQgMCxjaGVja2VkOm51bGwhPWM/YzphLl93cmFwcGVyU3RhdGUuaW5pdGlhbENoZWNrZWR9KX1mdW5jdGlvbiBaYShhLGIpe3ZhciBjPW51bGw9PWIuZGVmYXVsdFZhbHVlP1wiXCI6Yi5kZWZhdWx0VmFsdWUsZD1udWxsIT1iLmNoZWNrZWQ/Yi5jaGVja2VkOmIuZGVmYXVsdENoZWNrZWQ7Yz1TYShudWxsIT1iLnZhbHVlP2IudmFsdWU6Yyk7YS5fd3JhcHBlclN0YXRlPXtpbml0aWFsQ2hlY2tlZDpkLGluaXRpYWxWYWx1ZTpjLGNvbnRyb2xsZWQ6XCJjaGVja2JveFwiPT09Yi50eXBlfHxcInJhZGlvXCI9PT1iLnR5cGU/bnVsbCE9Yi5jaGVja2VkOm51bGwhPWIudmFsdWV9fWZ1bmN0aW9uIGFiKGEsYil7Yj1iLmNoZWNrZWQ7bnVsbCE9YiYmdGEoYSxcImNoZWNrZWRcIixiLCExKX1cbmZ1bmN0aW9uIGJiKGEsYil7YWIoYSxiKTt2YXIgYz1TYShiLnZhbHVlKSxkPWIudHlwZTtpZihudWxsIT1jKWlmKFwibnVtYmVyXCI9PT1kKXtpZigwPT09YyYmXCJcIj09PWEudmFsdWV8fGEudmFsdWUhPWMpYS52YWx1ZT1cIlwiK2N9ZWxzZSBhLnZhbHVlIT09XCJcIitjJiYoYS52YWx1ZT1cIlwiK2MpO2Vsc2UgaWYoXCJzdWJtaXRcIj09PWR8fFwicmVzZXRcIj09PWQpe2EucmVtb3ZlQXR0cmlidXRlKFwidmFsdWVcIik7cmV0dXJufWIuaGFzT3duUHJvcGVydHkoXCJ2YWx1ZVwiKT9jYihhLGIudHlwZSxjKTpiLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFZhbHVlXCIpJiZjYihhLGIudHlwZSxTYShiLmRlZmF1bHRWYWx1ZSkpO251bGw9PWIuY2hlY2tlZCYmbnVsbCE9Yi5kZWZhdWx0Q2hlY2tlZCYmKGEuZGVmYXVsdENoZWNrZWQ9ISFiLmRlZmF1bHRDaGVja2VkKX1cbmZ1bmN0aW9uIGRiKGEsYixjKXtpZihiLmhhc093blByb3BlcnR5KFwidmFsdWVcIil8fGIuaGFzT3duUHJvcGVydHkoXCJkZWZhdWx0VmFsdWVcIikpe3ZhciBkPWIudHlwZTtpZighKFwic3VibWl0XCIhPT1kJiZcInJlc2V0XCIhPT1kfHx2b2lkIDAhPT1iLnZhbHVlJiZudWxsIT09Yi52YWx1ZSkpcmV0dXJuO2I9XCJcIithLl93cmFwcGVyU3RhdGUuaW5pdGlhbFZhbHVlO2N8fGI9PT1hLnZhbHVlfHwoYS52YWx1ZT1iKTthLmRlZmF1bHRWYWx1ZT1ifWM9YS5uYW1lO1wiXCIhPT1jJiYoYS5uYW1lPVwiXCIpO2EuZGVmYXVsdENoZWNrZWQ9ISFhLl93cmFwcGVyU3RhdGUuaW5pdGlhbENoZWNrZWQ7XCJcIiE9PWMmJihhLm5hbWU9Yyl9XG5mdW5jdGlvbiBjYihhLGIsYyl7aWYoXCJudW1iZXJcIiE9PWJ8fFhhKGEub3duZXJEb2N1bWVudCkhPT1hKW51bGw9PWM/YS5kZWZhdWx0VmFsdWU9XCJcIithLl93cmFwcGVyU3RhdGUuaW5pdGlhbFZhbHVlOmEuZGVmYXVsdFZhbHVlIT09XCJcIitjJiYoYS5kZWZhdWx0VmFsdWU9XCJcIitjKX12YXIgZWI9QXJyYXkuaXNBcnJheTtcbmZ1bmN0aW9uIGZiKGEsYixjLGQpe2E9YS5vcHRpb25zO2lmKGIpe2I9e307Zm9yKHZhciBlPTA7ZTxjLmxlbmd0aDtlKyspYltcIiRcIitjW2VdXT0hMDtmb3IoYz0wO2M8YS5sZW5ndGg7YysrKWU9Yi5oYXNPd25Qcm9wZXJ0eShcIiRcIithW2NdLnZhbHVlKSxhW2NdLnNlbGVjdGVkIT09ZSYmKGFbY10uc2VsZWN0ZWQ9ZSksZSYmZCYmKGFbY10uZGVmYXVsdFNlbGVjdGVkPSEwKX1lbHNle2M9XCJcIitTYShjKTtiPW51bGw7Zm9yKGU9MDtlPGEubGVuZ3RoO2UrKyl7aWYoYVtlXS52YWx1ZT09PWMpe2FbZV0uc2VsZWN0ZWQ9ITA7ZCYmKGFbZV0uZGVmYXVsdFNlbGVjdGVkPSEwKTtyZXR1cm59bnVsbCE9PWJ8fGFbZV0uZGlzYWJsZWR8fChiPWFbZV0pfW51bGwhPT1iJiYoYi5zZWxlY3RlZD0hMCl9fVxuZnVuY3Rpb24gZ2IoYSxiKXtpZihudWxsIT1iLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKXRocm93IEVycm9yKHAoOTEpKTtyZXR1cm4gQSh7fSxiLHt2YWx1ZTp2b2lkIDAsZGVmYXVsdFZhbHVlOnZvaWQgMCxjaGlsZHJlbjpcIlwiK2EuX3dyYXBwZXJTdGF0ZS5pbml0aWFsVmFsdWV9KX1mdW5jdGlvbiBoYihhLGIpe3ZhciBjPWIudmFsdWU7aWYobnVsbD09Yyl7Yz1iLmNoaWxkcmVuO2I9Yi5kZWZhdWx0VmFsdWU7aWYobnVsbCE9Yyl7aWYobnVsbCE9Yil0aHJvdyBFcnJvcihwKDkyKSk7aWYoZWIoYykpe2lmKDE8Yy5sZW5ndGgpdGhyb3cgRXJyb3IocCg5MykpO2M9Y1swXX1iPWN9bnVsbD09YiYmKGI9XCJcIik7Yz1ifWEuX3dyYXBwZXJTdGF0ZT17aW5pdGlhbFZhbHVlOlNhKGMpfX1cbmZ1bmN0aW9uIGliKGEsYil7dmFyIGM9U2EoYi52YWx1ZSksZD1TYShiLmRlZmF1bHRWYWx1ZSk7bnVsbCE9YyYmKGM9XCJcIitjLGMhPT1hLnZhbHVlJiYoYS52YWx1ZT1jKSxudWxsPT1iLmRlZmF1bHRWYWx1ZSYmYS5kZWZhdWx0VmFsdWUhPT1jJiYoYS5kZWZhdWx0VmFsdWU9YykpO251bGwhPWQmJihhLmRlZmF1bHRWYWx1ZT1cIlwiK2QpfWZ1bmN0aW9uIGpiKGEpe3ZhciBiPWEudGV4dENvbnRlbnQ7Yj09PWEuX3dyYXBwZXJTdGF0ZS5pbml0aWFsVmFsdWUmJlwiXCIhPT1iJiZudWxsIT09YiYmKGEudmFsdWU9Yil9ZnVuY3Rpb24ga2IoYSl7c3dpdGNoKGEpe2Nhc2UgXCJzdmdcIjpyZXR1cm5cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7Y2FzZSBcIm1hdGhcIjpyZXR1cm5cImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjtkZWZhdWx0OnJldHVyblwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwifX1cbmZ1bmN0aW9uIGxiKGEsYil7cmV0dXJuIG51bGw9PWF8fFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiPT09YT9rYihiKTpcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI9PT1hJiZcImZvcmVpZ25PYmplY3RcIj09PWI/XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI6YX1cbnZhciBtYixuYj1mdW5jdGlvbihhKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIE1TQXBwJiZNU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbj9mdW5jdGlvbihiLGMsZCxlKXtNU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbihmdW5jdGlvbigpe3JldHVybiBhKGIsYyxkLGUpfSl9OmF9KGZ1bmN0aW9uKGEsYil7aWYoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIT09YS5uYW1lc3BhY2VVUkl8fFwiaW5uZXJIVE1MXCJpbiBhKWEuaW5uZXJIVE1MPWI7ZWxzZXttYj1tYnx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTttYi5pbm5lckhUTUw9XCI8c3ZnPlwiK2IudmFsdWVPZigpLnRvU3RyaW5nKCkrXCI8L3N2Zz5cIjtmb3IoYj1tYi5maXJzdENoaWxkO2EuZmlyc3RDaGlsZDspYS5yZW1vdmVDaGlsZChhLmZpcnN0Q2hpbGQpO2Zvcig7Yi5maXJzdENoaWxkOylhLmFwcGVuZENoaWxkKGIuZmlyc3RDaGlsZCl9fSk7XG5mdW5jdGlvbiBvYihhLGIpe2lmKGIpe3ZhciBjPWEuZmlyc3RDaGlsZDtpZihjJiZjPT09YS5sYXN0Q2hpbGQmJjM9PT1jLm5vZGVUeXBlKXtjLm5vZGVWYWx1ZT1iO3JldHVybn19YS50ZXh0Q29udGVudD1ifVxudmFyIHBiPXthbmltYXRpb25JdGVyYXRpb25Db3VudDohMCxhc3BlY3RSYXRpbzohMCxib3JkZXJJbWFnZU91dHNldDohMCxib3JkZXJJbWFnZVNsaWNlOiEwLGJvcmRlckltYWdlV2lkdGg6ITAsYm94RmxleDohMCxib3hGbGV4R3JvdXA6ITAsYm94T3JkaW5hbEdyb3VwOiEwLGNvbHVtbkNvdW50OiEwLGNvbHVtbnM6ITAsZmxleDohMCxmbGV4R3JvdzohMCxmbGV4UG9zaXRpdmU6ITAsZmxleFNocmluazohMCxmbGV4TmVnYXRpdmU6ITAsZmxleE9yZGVyOiEwLGdyaWRBcmVhOiEwLGdyaWRSb3c6ITAsZ3JpZFJvd0VuZDohMCxncmlkUm93U3BhbjohMCxncmlkUm93U3RhcnQ6ITAsZ3JpZENvbHVtbjohMCxncmlkQ29sdW1uRW5kOiEwLGdyaWRDb2x1bW5TcGFuOiEwLGdyaWRDb2x1bW5TdGFydDohMCxmb250V2VpZ2h0OiEwLGxpbmVDbGFtcDohMCxsaW5lSGVpZ2h0OiEwLG9wYWNpdHk6ITAsb3JkZXI6ITAsb3JwaGFuczohMCx0YWJTaXplOiEwLHdpZG93czohMCx6SW5kZXg6ITAsXG56b29tOiEwLGZpbGxPcGFjaXR5OiEwLGZsb29kT3BhY2l0eTohMCxzdG9wT3BhY2l0eTohMCxzdHJva2VEYXNoYXJyYXk6ITAsc3Ryb2tlRGFzaG9mZnNldDohMCxzdHJva2VNaXRlcmxpbWl0OiEwLHN0cm9rZU9wYWNpdHk6ITAsc3Ryb2tlV2lkdGg6ITB9LHFiPVtcIldlYmtpdFwiLFwibXNcIixcIk1velwiLFwiT1wiXTtPYmplY3Qua2V5cyhwYikuZm9yRWFjaChmdW5jdGlvbihhKXtxYi5mb3JFYWNoKGZ1bmN0aW9uKGIpe2I9YithLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK2Euc3Vic3RyaW5nKDEpO3BiW2JdPXBiW2FdfSl9KTtmdW5jdGlvbiByYihhLGIsYyl7cmV0dXJuIG51bGw9PWJ8fFwiYm9vbGVhblwiPT09dHlwZW9mIGJ8fFwiXCI9PT1iP1wiXCI6Y3x8XCJudW1iZXJcIiE9PXR5cGVvZiBifHwwPT09Ynx8cGIuaGFzT3duUHJvcGVydHkoYSkmJnBiW2FdPyhcIlwiK2IpLnRyaW0oKTpiK1wicHhcIn1cbmZ1bmN0aW9uIHNiKGEsYil7YT1hLnN0eWxlO2Zvcih2YXIgYyBpbiBiKWlmKGIuaGFzT3duUHJvcGVydHkoYykpe3ZhciBkPTA9PT1jLmluZGV4T2YoXCItLVwiKSxlPXJiKGMsYltjXSxkKTtcImZsb2F0XCI9PT1jJiYoYz1cImNzc0Zsb2F0XCIpO2Q/YS5zZXRQcm9wZXJ0eShjLGUpOmFbY109ZX19dmFyIHRiPUEoe21lbnVpdGVtOiEwfSx7YXJlYTohMCxiYXNlOiEwLGJyOiEwLGNvbDohMCxlbWJlZDohMCxocjohMCxpbWc6ITAsaW5wdXQ6ITAsa2V5Z2VuOiEwLGxpbms6ITAsbWV0YTohMCxwYXJhbTohMCxzb3VyY2U6ITAsdHJhY2s6ITAsd2JyOiEwfSk7XG5mdW5jdGlvbiB1YihhLGIpe2lmKGIpe2lmKHRiW2FdJiYobnVsbCE9Yi5jaGlsZHJlbnx8bnVsbCE9Yi5kYW5nZXJvdXNseVNldElubmVySFRNTCkpdGhyb3cgRXJyb3IocCgxMzcsYSkpO2lmKG51bGwhPWIuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpe2lmKG51bGwhPWIuY2hpbGRyZW4pdGhyb3cgRXJyb3IocCg2MCkpO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYi5kYW5nZXJvdXNseVNldElubmVySFRNTHx8IShcIl9faHRtbFwiaW4gYi5kYW5nZXJvdXNseVNldElubmVySFRNTCkpdGhyb3cgRXJyb3IocCg2MSkpO31pZihudWxsIT1iLnN0eWxlJiZcIm9iamVjdFwiIT09dHlwZW9mIGIuc3R5bGUpdGhyb3cgRXJyb3IocCg2MikpO319XG5mdW5jdGlvbiB2YihhLGIpe2lmKC0xPT09YS5pbmRleE9mKFwiLVwiKSlyZXR1cm5cInN0cmluZ1wiPT09dHlwZW9mIGIuaXM7c3dpdGNoKGEpe2Nhc2UgXCJhbm5vdGF0aW9uLXhtbFwiOmNhc2UgXCJjb2xvci1wcm9maWxlXCI6Y2FzZSBcImZvbnQtZmFjZVwiOmNhc2UgXCJmb250LWZhY2Utc3JjXCI6Y2FzZSBcImZvbnQtZmFjZS11cmlcIjpjYXNlIFwiZm9udC1mYWNlLWZvcm1hdFwiOmNhc2UgXCJmb250LWZhY2UtbmFtZVwiOmNhc2UgXCJtaXNzaW5nLWdseXBoXCI6cmV0dXJuITE7ZGVmYXVsdDpyZXR1cm4hMH19dmFyIHdiPW51bGw7ZnVuY3Rpb24geGIoYSl7YT1hLnRhcmdldHx8YS5zcmNFbGVtZW50fHx3aW5kb3c7YS5jb3JyZXNwb25kaW5nVXNlRWxlbWVudCYmKGE9YS5jb3JyZXNwb25kaW5nVXNlRWxlbWVudCk7cmV0dXJuIDM9PT1hLm5vZGVUeXBlP2EucGFyZW50Tm9kZTphfXZhciB5Yj1udWxsLHpiPW51bGwsQWI9bnVsbDtcbmZ1bmN0aW9uIEJiKGEpe2lmKGE9Q2IoYSkpe2lmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiB5Yil0aHJvdyBFcnJvcihwKDI4MCkpO3ZhciBiPWEuc3RhdGVOb2RlO2ImJihiPURiKGIpLHliKGEuc3RhdGVOb2RlLGEudHlwZSxiKSl9fWZ1bmN0aW9uIEViKGEpe3piP0FiP0FiLnB1c2goYSk6QWI9W2FdOnpiPWF9ZnVuY3Rpb24gRmIoKXtpZih6Yil7dmFyIGE9emIsYj1BYjtBYj16Yj1udWxsO0JiKGEpO2lmKGIpZm9yKGE9MDthPGIubGVuZ3RoO2ErKylCYihiW2FdKX19ZnVuY3Rpb24gR2IoYSxiKXtyZXR1cm4gYShiKX1mdW5jdGlvbiBIYigpe312YXIgSWI9ITE7ZnVuY3Rpb24gSmIoYSxiLGMpe2lmKEliKXJldHVybiBhKGIsYyk7SWI9ITA7dHJ5e3JldHVybiBHYihhLGIsYyl9ZmluYWxseXtpZihJYj0hMSxudWxsIT09emJ8fG51bGwhPT1BYilIYigpLEZiKCl9fVxuZnVuY3Rpb24gS2IoYSxiKXt2YXIgYz1hLnN0YXRlTm9kZTtpZihudWxsPT09YylyZXR1cm4gbnVsbDt2YXIgZD1EYihjKTtpZihudWxsPT09ZClyZXR1cm4gbnVsbDtjPWRbYl07YTpzd2l0Y2goYil7Y2FzZSBcIm9uQ2xpY2tcIjpjYXNlIFwib25DbGlja0NhcHR1cmVcIjpjYXNlIFwib25Eb3VibGVDbGlja1wiOmNhc2UgXCJvbkRvdWJsZUNsaWNrQ2FwdHVyZVwiOmNhc2UgXCJvbk1vdXNlRG93blwiOmNhc2UgXCJvbk1vdXNlRG93bkNhcHR1cmVcIjpjYXNlIFwib25Nb3VzZU1vdmVcIjpjYXNlIFwib25Nb3VzZU1vdmVDYXB0dXJlXCI6Y2FzZSBcIm9uTW91c2VVcFwiOmNhc2UgXCJvbk1vdXNlVXBDYXB0dXJlXCI6Y2FzZSBcIm9uTW91c2VFbnRlclwiOihkPSFkLmRpc2FibGVkKXx8KGE9YS50eXBlLGQ9IShcImJ1dHRvblwiPT09YXx8XCJpbnB1dFwiPT09YXx8XCJzZWxlY3RcIj09PWF8fFwidGV4dGFyZWFcIj09PWEpKTthPSFkO2JyZWFrIGE7ZGVmYXVsdDphPSExfWlmKGEpcmV0dXJuIG51bGw7aWYoYyYmXCJmdW5jdGlvblwiIT09XG50eXBlb2YgYyl0aHJvdyBFcnJvcihwKDIzMSxiLHR5cGVvZiBjKSk7cmV0dXJuIGN9dmFyIExiPSExO2lmKGlhKXRyeXt2YXIgTWI9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KE1iLFwicGFzc2l2ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtMYj0hMH19KTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIixNYixNYik7d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsTWIsTWIpfWNhdGNoKGEpe0xiPSExfWZ1bmN0aW9uIE5iKGEsYixjLGQsZSxmLGcsaCxrKXt2YXIgbD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMyk7dHJ5e2IuYXBwbHkoYyxsKX1jYXRjaChtKXt0aGlzLm9uRXJyb3IobSl9fXZhciBPYj0hMSxQYj1udWxsLFFiPSExLFJiPW51bGwsU2I9e29uRXJyb3I6ZnVuY3Rpb24oYSl7T2I9ITA7UGI9YX19O2Z1bmN0aW9uIFRiKGEsYixjLGQsZSxmLGcsaCxrKXtPYj0hMTtQYj1udWxsO05iLmFwcGx5KFNiLGFyZ3VtZW50cyl9XG5mdW5jdGlvbiBVYihhLGIsYyxkLGUsZixnLGgsayl7VGIuYXBwbHkodGhpcyxhcmd1bWVudHMpO2lmKE9iKXtpZihPYil7dmFyIGw9UGI7T2I9ITE7UGI9bnVsbH1lbHNlIHRocm93IEVycm9yKHAoMTk4KSk7UWJ8fChRYj0hMCxSYj1sKX19ZnVuY3Rpb24gVmIoYSl7dmFyIGI9YSxjPWE7aWYoYS5hbHRlcm5hdGUpZm9yKDtiLnJldHVybjspYj1iLnJldHVybjtlbHNle2E9YjtkbyBiPWEsMCE9PShiLmZsYWdzJjQwOTgpJiYoYz1iLnJldHVybiksYT1iLnJldHVybjt3aGlsZShhKX1yZXR1cm4gMz09PWIudGFnP2M6bnVsbH1mdW5jdGlvbiBXYihhKXtpZigxMz09PWEudGFnKXt2YXIgYj1hLm1lbW9pemVkU3RhdGU7bnVsbD09PWImJihhPWEuYWx0ZXJuYXRlLG51bGwhPT1hJiYoYj1hLm1lbW9pemVkU3RhdGUpKTtpZihudWxsIT09YilyZXR1cm4gYi5kZWh5ZHJhdGVkfXJldHVybiBudWxsfWZ1bmN0aW9uIFhiKGEpe2lmKFZiKGEpIT09YSl0aHJvdyBFcnJvcihwKDE4OCkpO31cbmZ1bmN0aW9uIFliKGEpe3ZhciBiPWEuYWx0ZXJuYXRlO2lmKCFiKXtiPVZiKGEpO2lmKG51bGw9PT1iKXRocm93IEVycm9yKHAoMTg4KSk7cmV0dXJuIGIhPT1hP251bGw6YX1mb3IodmFyIGM9YSxkPWI7Oyl7dmFyIGU9Yy5yZXR1cm47aWYobnVsbD09PWUpYnJlYWs7dmFyIGY9ZS5hbHRlcm5hdGU7aWYobnVsbD09PWYpe2Q9ZS5yZXR1cm47aWYobnVsbCE9PWQpe2M9ZDtjb250aW51ZX1icmVha31pZihlLmNoaWxkPT09Zi5jaGlsZCl7Zm9yKGY9ZS5jaGlsZDtmOyl7aWYoZj09PWMpcmV0dXJuIFhiKGUpLGE7aWYoZj09PWQpcmV0dXJuIFhiKGUpLGI7Zj1mLnNpYmxpbmd9dGhyb3cgRXJyb3IocCgxODgpKTt9aWYoYy5yZXR1cm4hPT1kLnJldHVybiljPWUsZD1mO2Vsc2V7Zm9yKHZhciBnPSExLGg9ZS5jaGlsZDtoOyl7aWYoaD09PWMpe2c9ITA7Yz1lO2Q9ZjticmVha31pZihoPT09ZCl7Zz0hMDtkPWU7Yz1mO2JyZWFrfWg9aC5zaWJsaW5nfWlmKCFnKXtmb3IoaD1mLmNoaWxkO2g7KXtpZihoPT09XG5jKXtnPSEwO2M9ZjtkPWU7YnJlYWt9aWYoaD09PWQpe2c9ITA7ZD1mO2M9ZTticmVha31oPWguc2libGluZ31pZighZyl0aHJvdyBFcnJvcihwKDE4OSkpO319aWYoYy5hbHRlcm5hdGUhPT1kKXRocm93IEVycm9yKHAoMTkwKSk7fWlmKDMhPT1jLnRhZyl0aHJvdyBFcnJvcihwKDE4OCkpO3JldHVybiBjLnN0YXRlTm9kZS5jdXJyZW50PT09Yz9hOmJ9ZnVuY3Rpb24gWmIoYSl7YT1ZYihhKTtyZXR1cm4gbnVsbCE9PWE/JGIoYSk6bnVsbH1mdW5jdGlvbiAkYihhKXtpZig1PT09YS50YWd8fDY9PT1hLnRhZylyZXR1cm4gYTtmb3IoYT1hLmNoaWxkO251bGwhPT1hOyl7dmFyIGI9JGIoYSk7aWYobnVsbCE9PWIpcmV0dXJuIGI7YT1hLnNpYmxpbmd9cmV0dXJuIG51bGx9XG52YXIgYWM9Y2EudW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayxiYz1jYS51bnN0YWJsZV9jYW5jZWxDYWxsYmFjayxjYz1jYS51bnN0YWJsZV9zaG91bGRZaWVsZCxkYz1jYS51bnN0YWJsZV9yZXF1ZXN0UGFpbnQsQj1jYS51bnN0YWJsZV9ub3csZWM9Y2EudW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWwsZmM9Y2EudW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHksZ2M9Y2EudW5zdGFibGVfVXNlckJsb2NraW5nUHJpb3JpdHksaGM9Y2EudW5zdGFibGVfTm9ybWFsUHJpb3JpdHksaWM9Y2EudW5zdGFibGVfTG93UHJpb3JpdHksamM9Y2EudW5zdGFibGVfSWRsZVByaW9yaXR5LGtjPW51bGwsbGM9bnVsbDtmdW5jdGlvbiBtYyhhKXtpZihsYyYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGxjLm9uQ29tbWl0RmliZXJSb290KXRyeXtsYy5vbkNvbW1pdEZpYmVyUm9vdChrYyxhLHZvaWQgMCwxMjg9PT0oYS5jdXJyZW50LmZsYWdzJjEyOCkpfWNhdGNoKGIpe319XG52YXIgb2M9TWF0aC5jbHozMj9NYXRoLmNsejMyOm5jLHBjPU1hdGgubG9nLHFjPU1hdGguTE4yO2Z1bmN0aW9uIG5jKGEpe2E+Pj49MDtyZXR1cm4gMD09PWE/MzI6MzEtKHBjKGEpL3FjfDApfDB9dmFyIHJjPTY0LHNjPTQxOTQzMDQ7XG5mdW5jdGlvbiB0YyhhKXtzd2l0Y2goYSYtYSl7Y2FzZSAxOnJldHVybiAxO2Nhc2UgMjpyZXR1cm4gMjtjYXNlIDQ6cmV0dXJuIDQ7Y2FzZSA4OnJldHVybiA4O2Nhc2UgMTY6cmV0dXJuIDE2O2Nhc2UgMzI6cmV0dXJuIDMyO2Nhc2UgNjQ6Y2FzZSAxMjg6Y2FzZSAyNTY6Y2FzZSA1MTI6Y2FzZSAxMDI0OmNhc2UgMjA0ODpjYXNlIDQwOTY6Y2FzZSA4MTkyOmNhc2UgMTYzODQ6Y2FzZSAzMjc2ODpjYXNlIDY1NTM2OmNhc2UgMTMxMDcyOmNhc2UgMjYyMTQ0OmNhc2UgNTI0Mjg4OmNhc2UgMTA0ODU3NjpjYXNlIDIwOTcxNTI6cmV0dXJuIGEmNDE5NDI0MDtjYXNlIDQxOTQzMDQ6Y2FzZSA4Mzg4NjA4OmNhc2UgMTY3NzcyMTY6Y2FzZSAzMzU1NDQzMjpjYXNlIDY3MTA4ODY0OnJldHVybiBhJjEzMDAyMzQyNDtjYXNlIDEzNDIxNzcyODpyZXR1cm4gMTM0MjE3NzI4O2Nhc2UgMjY4NDM1NDU2OnJldHVybiAyNjg0MzU0NTY7Y2FzZSA1MzY4NzA5MTI6cmV0dXJuIDUzNjg3MDkxMjtjYXNlIDEwNzM3NDE4MjQ6cmV0dXJuIDEwNzM3NDE4MjQ7XG5kZWZhdWx0OnJldHVybiBhfX1mdW5jdGlvbiB1YyhhLGIpe3ZhciBjPWEucGVuZGluZ0xhbmVzO2lmKDA9PT1jKXJldHVybiAwO3ZhciBkPTAsZT1hLnN1c3BlbmRlZExhbmVzLGY9YS5waW5nZWRMYW5lcyxnPWMmMjY4NDM1NDU1O2lmKDAhPT1nKXt2YXIgaD1nJn5lOzAhPT1oP2Q9dGMoaCk6KGYmPWcsMCE9PWYmJihkPXRjKGYpKSl9ZWxzZSBnPWMmfmUsMCE9PWc/ZD10YyhnKTowIT09ZiYmKGQ9dGMoZikpO2lmKDA9PT1kKXJldHVybiAwO2lmKDAhPT1iJiZiIT09ZCYmMD09PShiJmUpJiYoZT1kJi1kLGY9YiYtYixlPj1mfHwxNj09PWUmJjAhPT0oZiY0MTk0MjQwKSkpcmV0dXJuIGI7MCE9PShkJjQpJiYoZHw9YyYxNik7Yj1hLmVudGFuZ2xlZExhbmVzO2lmKDAhPT1iKWZvcihhPWEuZW50YW5nbGVtZW50cyxiJj1kOzA8YjspYz0zMS1vYyhiKSxlPTE8PGMsZHw9YVtjXSxiJj1+ZTtyZXR1cm4gZH1cbmZ1bmN0aW9uIHZjKGEsYil7c3dpdGNoKGEpe2Nhc2UgMTpjYXNlIDI6Y2FzZSA0OnJldHVybiBiKzI1MDtjYXNlIDg6Y2FzZSAxNjpjYXNlIDMyOmNhc2UgNjQ6Y2FzZSAxMjg6Y2FzZSAyNTY6Y2FzZSA1MTI6Y2FzZSAxMDI0OmNhc2UgMjA0ODpjYXNlIDQwOTY6Y2FzZSA4MTkyOmNhc2UgMTYzODQ6Y2FzZSAzMjc2ODpjYXNlIDY1NTM2OmNhc2UgMTMxMDcyOmNhc2UgMjYyMTQ0OmNhc2UgNTI0Mjg4OmNhc2UgMTA0ODU3NjpjYXNlIDIwOTcxNTI6cmV0dXJuIGIrNUUzO2Nhc2UgNDE5NDMwNDpjYXNlIDgzODg2MDg6Y2FzZSAxNjc3NzIxNjpjYXNlIDMzNTU0NDMyOmNhc2UgNjcxMDg4NjQ6cmV0dXJuLTE7Y2FzZSAxMzQyMTc3Mjg6Y2FzZSAyNjg0MzU0NTY6Y2FzZSA1MzY4NzA5MTI6Y2FzZSAxMDczNzQxODI0OnJldHVybi0xO2RlZmF1bHQ6cmV0dXJuLTF9fVxuZnVuY3Rpb24gd2MoYSxiKXtmb3IodmFyIGM9YS5zdXNwZW5kZWRMYW5lcyxkPWEucGluZ2VkTGFuZXMsZT1hLmV4cGlyYXRpb25UaW1lcyxmPWEucGVuZGluZ0xhbmVzOzA8Zjspe3ZhciBnPTMxLW9jKGYpLGg9MTw8ZyxrPWVbZ107aWYoLTE9PT1rKXtpZigwPT09KGgmYyl8fDAhPT0oaCZkKSllW2ddPXZjKGgsYil9ZWxzZSBrPD1iJiYoYS5leHBpcmVkTGFuZXN8PWgpO2YmPX5ofX1mdW5jdGlvbiB4YyhhKXthPWEucGVuZGluZ0xhbmVzJi0xMDczNzQxODI1O3JldHVybiAwIT09YT9hOmEmMTA3Mzc0MTgyND8xMDczNzQxODI0OjB9ZnVuY3Rpb24geWMoKXt2YXIgYT1yYztyYzw8PTE7MD09PShyYyY0MTk0MjQwKSYmKHJjPTY0KTtyZXR1cm4gYX1mdW5jdGlvbiB6YyhhKXtmb3IodmFyIGI9W10sYz0wOzMxPmM7YysrKWIucHVzaChhKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIEFjKGEsYixjKXthLnBlbmRpbmdMYW5lc3w9Yjs1MzY4NzA5MTIhPT1iJiYoYS5zdXNwZW5kZWRMYW5lcz0wLGEucGluZ2VkTGFuZXM9MCk7YT1hLmV2ZW50VGltZXM7Yj0zMS1vYyhiKTthW2JdPWN9ZnVuY3Rpb24gQmMoYSxiKXt2YXIgYz1hLnBlbmRpbmdMYW5lcyZ+YjthLnBlbmRpbmdMYW5lcz1iO2Euc3VzcGVuZGVkTGFuZXM9MDthLnBpbmdlZExhbmVzPTA7YS5leHBpcmVkTGFuZXMmPWI7YS5tdXRhYmxlUmVhZExhbmVzJj1iO2EuZW50YW5nbGVkTGFuZXMmPWI7Yj1hLmVudGFuZ2xlbWVudHM7dmFyIGQ9YS5ldmVudFRpbWVzO2ZvcihhPWEuZXhwaXJhdGlvblRpbWVzOzA8Yzspe3ZhciBlPTMxLW9jKGMpLGY9MTw8ZTtiW2VdPTA7ZFtlXT0tMTthW2VdPS0xO2MmPX5mfX1cbmZ1bmN0aW9uIENjKGEsYil7dmFyIGM9YS5lbnRhbmdsZWRMYW5lc3w9Yjtmb3IoYT1hLmVudGFuZ2xlbWVudHM7Yzspe3ZhciBkPTMxLW9jKGMpLGU9MTw8ZDtlJmJ8YVtkXSZiJiYoYVtkXXw9Yik7YyY9fmV9fXZhciBDPTA7ZnVuY3Rpb24gRGMoYSl7YSY9LWE7cmV0dXJuIDE8YT80PGE/MCE9PShhJjI2ODQzNTQ1NSk/MTY6NTM2ODcwOTEyOjQ6MX12YXIgRWMsRmMsR2MsSGMsSWMsSmM9ITEsS2M9W10sTGM9bnVsbCxNYz1udWxsLE5jPW51bGwsT2M9bmV3IE1hcCxQYz1uZXcgTWFwLFFjPVtdLFJjPVwibW91c2Vkb3duIG1vdXNldXAgdG91Y2hjYW5jZWwgdG91Y2hlbmQgdG91Y2hzdGFydCBhdXhjbGljayBkYmxjbGljayBwb2ludGVyY2FuY2VsIHBvaW50ZXJkb3duIHBvaW50ZXJ1cCBkcmFnZW5kIGRyYWdzdGFydCBkcm9wIGNvbXBvc2l0aW9uZW5kIGNvbXBvc2l0aW9uc3RhcnQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBpbnB1dCB0ZXh0SW5wdXQgY29weSBjdXQgcGFzdGUgY2xpY2sgY2hhbmdlIGNvbnRleHRtZW51IHJlc2V0IHN1Ym1pdFwiLnNwbGl0KFwiIFwiKTtcbmZ1bmN0aW9uIFNjKGEsYil7c3dpdGNoKGEpe2Nhc2UgXCJmb2N1c2luXCI6Y2FzZSBcImZvY3Vzb3V0XCI6TGM9bnVsbDticmVhaztjYXNlIFwiZHJhZ2VudGVyXCI6Y2FzZSBcImRyYWdsZWF2ZVwiOk1jPW51bGw7YnJlYWs7Y2FzZSBcIm1vdXNlb3ZlclwiOmNhc2UgXCJtb3VzZW91dFwiOk5jPW51bGw7YnJlYWs7Y2FzZSBcInBvaW50ZXJvdmVyXCI6Y2FzZSBcInBvaW50ZXJvdXRcIjpPYy5kZWxldGUoYi5wb2ludGVySWQpO2JyZWFrO2Nhc2UgXCJnb3Rwb2ludGVyY2FwdHVyZVwiOmNhc2UgXCJsb3N0cG9pbnRlcmNhcHR1cmVcIjpQYy5kZWxldGUoYi5wb2ludGVySWQpfX1cbmZ1bmN0aW9uIFRjKGEsYixjLGQsZSxmKXtpZihudWxsPT09YXx8YS5uYXRpdmVFdmVudCE9PWYpcmV0dXJuIGE9e2Jsb2NrZWRPbjpiLGRvbUV2ZW50TmFtZTpjLGV2ZW50U3lzdGVtRmxhZ3M6ZCxuYXRpdmVFdmVudDpmLHRhcmdldENvbnRhaW5lcnM6W2VdfSxudWxsIT09YiYmKGI9Q2IoYiksbnVsbCE9PWImJkZjKGIpKSxhO2EuZXZlbnRTeXN0ZW1GbGFnc3w9ZDtiPWEudGFyZ2V0Q29udGFpbmVycztudWxsIT09ZSYmLTE9PT1iLmluZGV4T2YoZSkmJmIucHVzaChlKTtyZXR1cm4gYX1cbmZ1bmN0aW9uIFVjKGEsYixjLGQsZSl7c3dpdGNoKGIpe2Nhc2UgXCJmb2N1c2luXCI6cmV0dXJuIExjPVRjKExjLGEsYixjLGQsZSksITA7Y2FzZSBcImRyYWdlbnRlclwiOnJldHVybiBNYz1UYyhNYyxhLGIsYyxkLGUpLCEwO2Nhc2UgXCJtb3VzZW92ZXJcIjpyZXR1cm4gTmM9VGMoTmMsYSxiLGMsZCxlKSwhMDtjYXNlIFwicG9pbnRlcm92ZXJcIjp2YXIgZj1lLnBvaW50ZXJJZDtPYy5zZXQoZixUYyhPYy5nZXQoZil8fG51bGwsYSxiLGMsZCxlKSk7cmV0dXJuITA7Y2FzZSBcImdvdHBvaW50ZXJjYXB0dXJlXCI6cmV0dXJuIGY9ZS5wb2ludGVySWQsUGMuc2V0KGYsVGMoUGMuZ2V0KGYpfHxudWxsLGEsYixjLGQsZSkpLCEwfXJldHVybiExfVxuZnVuY3Rpb24gVmMoYSl7dmFyIGI9V2MoYS50YXJnZXQpO2lmKG51bGwhPT1iKXt2YXIgYz1WYihiKTtpZihudWxsIT09YylpZihiPWMudGFnLDEzPT09Yil7aWYoYj1XYihjKSxudWxsIT09Yil7YS5ibG9ja2VkT249YjtJYyhhLnByaW9yaXR5LGZ1bmN0aW9uKCl7R2MoYyl9KTtyZXR1cm59fWVsc2UgaWYoMz09PWImJmMuc3RhdGVOb2RlLmN1cnJlbnQubWVtb2l6ZWRTdGF0ZS5pc0RlaHlkcmF0ZWQpe2EuYmxvY2tlZE9uPTM9PT1jLnRhZz9jLnN0YXRlTm9kZS5jb250YWluZXJJbmZvOm51bGw7cmV0dXJufX1hLmJsb2NrZWRPbj1udWxsfVxuZnVuY3Rpb24gWGMoYSl7aWYobnVsbCE9PWEuYmxvY2tlZE9uKXJldHVybiExO2Zvcih2YXIgYj1hLnRhcmdldENvbnRhaW5lcnM7MDxiLmxlbmd0aDspe3ZhciBjPVljKGEuZG9tRXZlbnROYW1lLGEuZXZlbnRTeXN0ZW1GbGFncyxiWzBdLGEubmF0aXZlRXZlbnQpO2lmKG51bGw9PT1jKXtjPWEubmF0aXZlRXZlbnQ7dmFyIGQ9bmV3IGMuY29uc3RydWN0b3IoYy50eXBlLGMpO3diPWQ7Yy50YXJnZXQuZGlzcGF0Y2hFdmVudChkKTt3Yj1udWxsfWVsc2UgcmV0dXJuIGI9Q2IoYyksbnVsbCE9PWImJkZjKGIpLGEuYmxvY2tlZE9uPWMsITE7Yi5zaGlmdCgpfXJldHVybiEwfWZ1bmN0aW9uIFpjKGEsYixjKXtYYyhhKSYmYy5kZWxldGUoYil9ZnVuY3Rpb24gJGMoKXtKYz0hMTtudWxsIT09TGMmJlhjKExjKSYmKExjPW51bGwpO251bGwhPT1NYyYmWGMoTWMpJiYoTWM9bnVsbCk7bnVsbCE9PU5jJiZYYyhOYykmJihOYz1udWxsKTtPYy5mb3JFYWNoKFpjKTtQYy5mb3JFYWNoKFpjKX1cbmZ1bmN0aW9uIGFkKGEsYil7YS5ibG9ja2VkT249PT1iJiYoYS5ibG9ja2VkT249bnVsbCxKY3x8KEpjPSEwLGNhLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2soY2EudW5zdGFibGVfTm9ybWFsUHJpb3JpdHksJGMpKSl9XG5mdW5jdGlvbiBiZChhKXtmdW5jdGlvbiBiKGIpe3JldHVybiBhZChiLGEpfWlmKDA8S2MubGVuZ3RoKXthZChLY1swXSxhKTtmb3IodmFyIGM9MTtjPEtjLmxlbmd0aDtjKyspe3ZhciBkPUtjW2NdO2QuYmxvY2tlZE9uPT09YSYmKGQuYmxvY2tlZE9uPW51bGwpfX1udWxsIT09TGMmJmFkKExjLGEpO251bGwhPT1NYyYmYWQoTWMsYSk7bnVsbCE9PU5jJiZhZChOYyxhKTtPYy5mb3JFYWNoKGIpO1BjLmZvckVhY2goYik7Zm9yKGM9MDtjPFFjLmxlbmd0aDtjKyspZD1RY1tjXSxkLmJsb2NrZWRPbj09PWEmJihkLmJsb2NrZWRPbj1udWxsKTtmb3IoOzA8UWMubGVuZ3RoJiYoYz1RY1swXSxudWxsPT09Yy5ibG9ja2VkT24pOylWYyhjKSxudWxsPT09Yy5ibG9ja2VkT24mJlFjLnNoaWZ0KCl9dmFyIGNkPXVhLlJlYWN0Q3VycmVudEJhdGNoQ29uZmlnLGRkPSEwO1xuZnVuY3Rpb24gZWQoYSxiLGMsZCl7dmFyIGU9QyxmPWNkLnRyYW5zaXRpb247Y2QudHJhbnNpdGlvbj1udWxsO3RyeXtDPTEsZmQoYSxiLGMsZCl9ZmluYWxseXtDPWUsY2QudHJhbnNpdGlvbj1mfX1mdW5jdGlvbiBnZChhLGIsYyxkKXt2YXIgZT1DLGY9Y2QudHJhbnNpdGlvbjtjZC50cmFuc2l0aW9uPW51bGw7dHJ5e0M9NCxmZChhLGIsYyxkKX1maW5hbGx5e0M9ZSxjZC50cmFuc2l0aW9uPWZ9fVxuZnVuY3Rpb24gZmQoYSxiLGMsZCl7aWYoZGQpe3ZhciBlPVljKGEsYixjLGQpO2lmKG51bGw9PT1lKWhkKGEsYixkLGlkLGMpLFNjKGEsZCk7ZWxzZSBpZihVYyhlLGEsYixjLGQpKWQuc3RvcFByb3BhZ2F0aW9uKCk7ZWxzZSBpZihTYyhhLGQpLGImNCYmLTE8UmMuaW5kZXhPZihhKSl7Zm9yKDtudWxsIT09ZTspe3ZhciBmPUNiKGUpO251bGwhPT1mJiZFYyhmKTtmPVljKGEsYixjLGQpO251bGw9PT1mJiZoZChhLGIsZCxpZCxjKTtpZihmPT09ZSlicmVhaztlPWZ9bnVsbCE9PWUmJmQuc3RvcFByb3BhZ2F0aW9uKCl9ZWxzZSBoZChhLGIsZCxudWxsLGMpfX12YXIgaWQ9bnVsbDtcbmZ1bmN0aW9uIFljKGEsYixjLGQpe2lkPW51bGw7YT14YihkKTthPVdjKGEpO2lmKG51bGwhPT1hKWlmKGI9VmIoYSksbnVsbD09PWIpYT1udWxsO2Vsc2UgaWYoYz1iLnRhZywxMz09PWMpe2E9V2IoYik7aWYobnVsbCE9PWEpcmV0dXJuIGE7YT1udWxsfWVsc2UgaWYoMz09PWMpe2lmKGIuc3RhdGVOb2RlLmN1cnJlbnQubWVtb2l6ZWRTdGF0ZS5pc0RlaHlkcmF0ZWQpcmV0dXJuIDM9PT1iLnRhZz9iLnN0YXRlTm9kZS5jb250YWluZXJJbmZvOm51bGw7YT1udWxsfWVsc2UgYiE9PWEmJihhPW51bGwpO2lkPWE7cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBqZChhKXtzd2l0Y2goYSl7Y2FzZSBcImNhbmNlbFwiOmNhc2UgXCJjbGlja1wiOmNhc2UgXCJjbG9zZVwiOmNhc2UgXCJjb250ZXh0bWVudVwiOmNhc2UgXCJjb3B5XCI6Y2FzZSBcImN1dFwiOmNhc2UgXCJhdXhjbGlja1wiOmNhc2UgXCJkYmxjbGlja1wiOmNhc2UgXCJkcmFnZW5kXCI6Y2FzZSBcImRyYWdzdGFydFwiOmNhc2UgXCJkcm9wXCI6Y2FzZSBcImZvY3VzaW5cIjpjYXNlIFwiZm9jdXNvdXRcIjpjYXNlIFwiaW5wdXRcIjpjYXNlIFwiaW52YWxpZFwiOmNhc2UgXCJrZXlkb3duXCI6Y2FzZSBcImtleXByZXNzXCI6Y2FzZSBcImtleXVwXCI6Y2FzZSBcIm1vdXNlZG93blwiOmNhc2UgXCJtb3VzZXVwXCI6Y2FzZSBcInBhc3RlXCI6Y2FzZSBcInBhdXNlXCI6Y2FzZSBcInBsYXlcIjpjYXNlIFwicG9pbnRlcmNhbmNlbFwiOmNhc2UgXCJwb2ludGVyZG93blwiOmNhc2UgXCJwb2ludGVydXBcIjpjYXNlIFwicmF0ZWNoYW5nZVwiOmNhc2UgXCJyZXNldFwiOmNhc2UgXCJyZXNpemVcIjpjYXNlIFwic2Vla2VkXCI6Y2FzZSBcInN1Ym1pdFwiOmNhc2UgXCJ0b3VjaGNhbmNlbFwiOmNhc2UgXCJ0b3VjaGVuZFwiOmNhc2UgXCJ0b3VjaHN0YXJ0XCI6Y2FzZSBcInZvbHVtZWNoYW5nZVwiOmNhc2UgXCJjaGFuZ2VcIjpjYXNlIFwic2VsZWN0aW9uY2hhbmdlXCI6Y2FzZSBcInRleHRJbnB1dFwiOmNhc2UgXCJjb21wb3NpdGlvbnN0YXJ0XCI6Y2FzZSBcImNvbXBvc2l0aW9uZW5kXCI6Y2FzZSBcImNvbXBvc2l0aW9udXBkYXRlXCI6Y2FzZSBcImJlZm9yZWJsdXJcIjpjYXNlIFwiYWZ0ZXJibHVyXCI6Y2FzZSBcImJlZm9yZWlucHV0XCI6Y2FzZSBcImJsdXJcIjpjYXNlIFwiZnVsbHNjcmVlbmNoYW5nZVwiOmNhc2UgXCJmb2N1c1wiOmNhc2UgXCJoYXNoY2hhbmdlXCI6Y2FzZSBcInBvcHN0YXRlXCI6Y2FzZSBcInNlbGVjdFwiOmNhc2UgXCJzZWxlY3RzdGFydFwiOnJldHVybiAxO2Nhc2UgXCJkcmFnXCI6Y2FzZSBcImRyYWdlbnRlclwiOmNhc2UgXCJkcmFnZXhpdFwiOmNhc2UgXCJkcmFnbGVhdmVcIjpjYXNlIFwiZHJhZ292ZXJcIjpjYXNlIFwibW91c2Vtb3ZlXCI6Y2FzZSBcIm1vdXNlb3V0XCI6Y2FzZSBcIm1vdXNlb3ZlclwiOmNhc2UgXCJwb2ludGVybW92ZVwiOmNhc2UgXCJwb2ludGVyb3V0XCI6Y2FzZSBcInBvaW50ZXJvdmVyXCI6Y2FzZSBcInNjcm9sbFwiOmNhc2UgXCJ0b2dnbGVcIjpjYXNlIFwidG91Y2htb3ZlXCI6Y2FzZSBcIndoZWVsXCI6Y2FzZSBcIm1vdXNlZW50ZXJcIjpjYXNlIFwibW91c2VsZWF2ZVwiOmNhc2UgXCJwb2ludGVyZW50ZXJcIjpjYXNlIFwicG9pbnRlcmxlYXZlXCI6cmV0dXJuIDQ7XG5jYXNlIFwibWVzc2FnZVwiOnN3aXRjaChlYygpKXtjYXNlIGZjOnJldHVybiAxO2Nhc2UgZ2M6cmV0dXJuIDQ7Y2FzZSBoYzpjYXNlIGljOnJldHVybiAxNjtjYXNlIGpjOnJldHVybiA1MzY4NzA5MTI7ZGVmYXVsdDpyZXR1cm4gMTZ9ZGVmYXVsdDpyZXR1cm4gMTZ9fXZhciBrZD1udWxsLGxkPW51bGwsbWQ9bnVsbDtmdW5jdGlvbiBuZCgpe2lmKG1kKXJldHVybiBtZDt2YXIgYSxiPWxkLGM9Yi5sZW5ndGgsZCxlPVwidmFsdWVcImluIGtkP2tkLnZhbHVlOmtkLnRleHRDb250ZW50LGY9ZS5sZW5ndGg7Zm9yKGE9MDthPGMmJmJbYV09PT1lW2FdO2ErKyk7dmFyIGc9Yy1hO2ZvcihkPTE7ZDw9ZyYmYltjLWRdPT09ZVtmLWRdO2QrKyk7cmV0dXJuIG1kPWUuc2xpY2UoYSwxPGQ/MS1kOnZvaWQgMCl9XG5mdW5jdGlvbiBvZChhKXt2YXIgYj1hLmtleUNvZGU7XCJjaGFyQ29kZVwiaW4gYT8oYT1hLmNoYXJDb2RlLDA9PT1hJiYxMz09PWImJihhPTEzKSk6YT1iOzEwPT09YSYmKGE9MTMpO3JldHVybiAzMjw9YXx8MTM9PT1hP2E6MH1mdW5jdGlvbiBwZCgpe3JldHVybiEwfWZ1bmN0aW9uIHFkKCl7cmV0dXJuITF9XG5mdW5jdGlvbiByZChhKXtmdW5jdGlvbiBiKGIsZCxlLGYsZyl7dGhpcy5fcmVhY3ROYW1lPWI7dGhpcy5fdGFyZ2V0SW5zdD1lO3RoaXMudHlwZT1kO3RoaXMubmF0aXZlRXZlbnQ9Zjt0aGlzLnRhcmdldD1nO3RoaXMuY3VycmVudFRhcmdldD1udWxsO2Zvcih2YXIgYyBpbiBhKWEuaGFzT3duUHJvcGVydHkoYykmJihiPWFbY10sdGhpc1tjXT1iP2IoZik6ZltjXSk7dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ9KG51bGwhPWYuZGVmYXVsdFByZXZlbnRlZD9mLmRlZmF1bHRQcmV2ZW50ZWQ6ITE9PT1mLnJldHVyblZhbHVlKT9wZDpxZDt0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkPXFkO3JldHVybiB0aGlzfUEoYi5wcm90b3R5cGUse3ByZXZlbnREZWZhdWx0OmZ1bmN0aW9uKCl7dGhpcy5kZWZhdWx0UHJldmVudGVkPSEwO3ZhciBhPXRoaXMubmF0aXZlRXZlbnQ7YSYmKGEucHJldmVudERlZmF1bHQ/YS5wcmV2ZW50RGVmYXVsdCgpOlwidW5rbm93blwiIT09dHlwZW9mIGEucmV0dXJuVmFsdWUmJlxuKGEucmV0dXJuVmFsdWU9ITEpLHRoaXMuaXNEZWZhdWx0UHJldmVudGVkPXBkKX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5uYXRpdmVFdmVudDthJiYoYS5zdG9wUHJvcGFnYXRpb24/YS5zdG9wUHJvcGFnYXRpb24oKTpcInVua25vd25cIiE9PXR5cGVvZiBhLmNhbmNlbEJ1YmJsZSYmKGEuY2FuY2VsQnViYmxlPSEwKSx0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkPXBkKX0scGVyc2lzdDpmdW5jdGlvbigpe30saXNQZXJzaXN0ZW50OnBkfSk7cmV0dXJuIGJ9XG52YXIgc2Q9e2V2ZW50UGhhc2U6MCxidWJibGVzOjAsY2FuY2VsYWJsZTowLHRpbWVTdGFtcDpmdW5jdGlvbihhKXtyZXR1cm4gYS50aW1lU3RhbXB8fERhdGUubm93KCl9LGRlZmF1bHRQcmV2ZW50ZWQ6MCxpc1RydXN0ZWQ6MH0sdGQ9cmQoc2QpLHVkPUEoe30sc2Qse3ZpZXc6MCxkZXRhaWw6MH0pLHZkPXJkKHVkKSx3ZCx4ZCx5ZCxBZD1BKHt9LHVkLHtzY3JlZW5YOjAsc2NyZWVuWTowLGNsaWVudFg6MCxjbGllbnRZOjAscGFnZVg6MCxwYWdlWTowLGN0cmxLZXk6MCxzaGlmdEtleTowLGFsdEtleTowLG1ldGFLZXk6MCxnZXRNb2RpZmllclN0YXRlOnpkLGJ1dHRvbjowLGJ1dHRvbnM6MCxyZWxhdGVkVGFyZ2V0OmZ1bmN0aW9uKGEpe3JldHVybiB2b2lkIDA9PT1hLnJlbGF0ZWRUYXJnZXQ/YS5mcm9tRWxlbWVudD09PWEuc3JjRWxlbWVudD9hLnRvRWxlbWVudDphLmZyb21FbGVtZW50OmEucmVsYXRlZFRhcmdldH0sbW92ZW1lbnRYOmZ1bmN0aW9uKGEpe2lmKFwibW92ZW1lbnRYXCJpblxuYSlyZXR1cm4gYS5tb3ZlbWVudFg7YSE9PXlkJiYoeWQmJlwibW91c2Vtb3ZlXCI9PT1hLnR5cGU/KHdkPWEuc2NyZWVuWC15ZC5zY3JlZW5YLHhkPWEuc2NyZWVuWS15ZC5zY3JlZW5ZKTp4ZD13ZD0wLHlkPWEpO3JldHVybiB3ZH0sbW92ZW1lbnRZOmZ1bmN0aW9uKGEpe3JldHVyblwibW92ZW1lbnRZXCJpbiBhP2EubW92ZW1lbnRZOnhkfX0pLEJkPXJkKEFkKSxDZD1BKHt9LEFkLHtkYXRhVHJhbnNmZXI6MH0pLERkPXJkKENkKSxFZD1BKHt9LHVkLHtyZWxhdGVkVGFyZ2V0OjB9KSxGZD1yZChFZCksR2Q9QSh7fSxzZCx7YW5pbWF0aW9uTmFtZTowLGVsYXBzZWRUaW1lOjAscHNldWRvRWxlbWVudDowfSksSGQ9cmQoR2QpLElkPUEoe30sc2Qse2NsaXBib2FyZERhdGE6ZnVuY3Rpb24oYSl7cmV0dXJuXCJjbGlwYm9hcmREYXRhXCJpbiBhP2EuY2xpcGJvYXJkRGF0YTp3aW5kb3cuY2xpcGJvYXJkRGF0YX19KSxKZD1yZChJZCksS2Q9QSh7fSxzZCx7ZGF0YTowfSksTGQ9cmQoS2QpLE1kPXtFc2M6XCJFc2NhcGVcIixcblNwYWNlYmFyOlwiIFwiLExlZnQ6XCJBcnJvd0xlZnRcIixVcDpcIkFycm93VXBcIixSaWdodDpcIkFycm93UmlnaHRcIixEb3duOlwiQXJyb3dEb3duXCIsRGVsOlwiRGVsZXRlXCIsV2luOlwiT1NcIixNZW51OlwiQ29udGV4dE1lbnVcIixBcHBzOlwiQ29udGV4dE1lbnVcIixTY3JvbGw6XCJTY3JvbGxMb2NrXCIsTW96UHJpbnRhYmxlS2V5OlwiVW5pZGVudGlmaWVkXCJ9LE5kPXs4OlwiQmFja3NwYWNlXCIsOTpcIlRhYlwiLDEyOlwiQ2xlYXJcIiwxMzpcIkVudGVyXCIsMTY6XCJTaGlmdFwiLDE3OlwiQ29udHJvbFwiLDE4OlwiQWx0XCIsMTk6XCJQYXVzZVwiLDIwOlwiQ2Fwc0xvY2tcIiwyNzpcIkVzY2FwZVwiLDMyOlwiIFwiLDMzOlwiUGFnZVVwXCIsMzQ6XCJQYWdlRG93blwiLDM1OlwiRW5kXCIsMzY6XCJIb21lXCIsMzc6XCJBcnJvd0xlZnRcIiwzODpcIkFycm93VXBcIiwzOTpcIkFycm93UmlnaHRcIiw0MDpcIkFycm93RG93blwiLDQ1OlwiSW5zZXJ0XCIsNDY6XCJEZWxldGVcIiwxMTI6XCJGMVwiLDExMzpcIkYyXCIsMTE0OlwiRjNcIiwxMTU6XCJGNFwiLDExNjpcIkY1XCIsMTE3OlwiRjZcIiwxMTg6XCJGN1wiLFxuMTE5OlwiRjhcIiwxMjA6XCJGOVwiLDEyMTpcIkYxMFwiLDEyMjpcIkYxMVwiLDEyMzpcIkYxMlwiLDE0NDpcIk51bUxvY2tcIiwxNDU6XCJTY3JvbGxMb2NrXCIsMjI0OlwiTWV0YVwifSxPZD17QWx0OlwiYWx0S2V5XCIsQ29udHJvbDpcImN0cmxLZXlcIixNZXRhOlwibWV0YUtleVwiLFNoaWZ0Olwic2hpZnRLZXlcIn07ZnVuY3Rpb24gUGQoYSl7dmFyIGI9dGhpcy5uYXRpdmVFdmVudDtyZXR1cm4gYi5nZXRNb2RpZmllclN0YXRlP2IuZ2V0TW9kaWZpZXJTdGF0ZShhKTooYT1PZFthXSk/ISFiW2FdOiExfWZ1bmN0aW9uIHpkKCl7cmV0dXJuIFBkfVxudmFyIFFkPUEoe30sdWQse2tleTpmdW5jdGlvbihhKXtpZihhLmtleSl7dmFyIGI9TWRbYS5rZXldfHxhLmtleTtpZihcIlVuaWRlbnRpZmllZFwiIT09YilyZXR1cm4gYn1yZXR1cm5cImtleXByZXNzXCI9PT1hLnR5cGU/KGE9b2QoYSksMTM9PT1hP1wiRW50ZXJcIjpTdHJpbmcuZnJvbUNoYXJDb2RlKGEpKTpcImtleWRvd25cIj09PWEudHlwZXx8XCJrZXl1cFwiPT09YS50eXBlP05kW2Eua2V5Q29kZV18fFwiVW5pZGVudGlmaWVkXCI6XCJcIn0sY29kZTowLGxvY2F0aW9uOjAsY3RybEtleTowLHNoaWZ0S2V5OjAsYWx0S2V5OjAsbWV0YUtleTowLHJlcGVhdDowLGxvY2FsZTowLGdldE1vZGlmaWVyU3RhdGU6emQsY2hhckNvZGU6ZnVuY3Rpb24oYSl7cmV0dXJuXCJrZXlwcmVzc1wiPT09YS50eXBlP29kKGEpOjB9LGtleUNvZGU6ZnVuY3Rpb24oYSl7cmV0dXJuXCJrZXlkb3duXCI9PT1hLnR5cGV8fFwia2V5dXBcIj09PWEudHlwZT9hLmtleUNvZGU6MH0sd2hpY2g6ZnVuY3Rpb24oYSl7cmV0dXJuXCJrZXlwcmVzc1wiPT09XG5hLnR5cGU/b2QoYSk6XCJrZXlkb3duXCI9PT1hLnR5cGV8fFwia2V5dXBcIj09PWEudHlwZT9hLmtleUNvZGU6MH19KSxSZD1yZChRZCksU2Q9QSh7fSxBZCx7cG9pbnRlcklkOjAsd2lkdGg6MCxoZWlnaHQ6MCxwcmVzc3VyZTowLHRhbmdlbnRpYWxQcmVzc3VyZTowLHRpbHRYOjAsdGlsdFk6MCx0d2lzdDowLHBvaW50ZXJUeXBlOjAsaXNQcmltYXJ5OjB9KSxUZD1yZChTZCksVWQ9QSh7fSx1ZCx7dG91Y2hlczowLHRhcmdldFRvdWNoZXM6MCxjaGFuZ2VkVG91Y2hlczowLGFsdEtleTowLG1ldGFLZXk6MCxjdHJsS2V5OjAsc2hpZnRLZXk6MCxnZXRNb2RpZmllclN0YXRlOnpkfSksVmQ9cmQoVWQpLFdkPUEoe30sc2Qse3Byb3BlcnR5TmFtZTowLGVsYXBzZWRUaW1lOjAscHNldWRvRWxlbWVudDowfSksWGQ9cmQoV2QpLFlkPUEoe30sQWQse2RlbHRhWDpmdW5jdGlvbihhKXtyZXR1cm5cImRlbHRhWFwiaW4gYT9hLmRlbHRhWDpcIndoZWVsRGVsdGFYXCJpbiBhPy1hLndoZWVsRGVsdGFYOjB9LFxuZGVsdGFZOmZ1bmN0aW9uKGEpe3JldHVyblwiZGVsdGFZXCJpbiBhP2EuZGVsdGFZOlwid2hlZWxEZWx0YVlcImluIGE/LWEud2hlZWxEZWx0YVk6XCJ3aGVlbERlbHRhXCJpbiBhPy1hLndoZWVsRGVsdGE6MH0sZGVsdGFaOjAsZGVsdGFNb2RlOjB9KSxaZD1yZChZZCksJGQ9WzksMTMsMjcsMzJdLGFlPWlhJiZcIkNvbXBvc2l0aW9uRXZlbnRcImluIHdpbmRvdyxiZT1udWxsO2lhJiZcImRvY3VtZW50TW9kZVwiaW4gZG9jdW1lbnQmJihiZT1kb2N1bWVudC5kb2N1bWVudE1vZGUpO3ZhciBjZT1pYSYmXCJUZXh0RXZlbnRcImluIHdpbmRvdyYmIWJlLGRlPWlhJiYoIWFlfHxiZSYmODxiZSYmMTE+PWJlKSxlZT1TdHJpbmcuZnJvbUNoYXJDb2RlKDMyKSxmZT0hMTtcbmZ1bmN0aW9uIGdlKGEsYil7c3dpdGNoKGEpe2Nhc2UgXCJrZXl1cFwiOnJldHVybi0xIT09JGQuaW5kZXhPZihiLmtleUNvZGUpO2Nhc2UgXCJrZXlkb3duXCI6cmV0dXJuIDIyOSE9PWIua2V5Q29kZTtjYXNlIFwia2V5cHJlc3NcIjpjYXNlIFwibW91c2Vkb3duXCI6Y2FzZSBcImZvY3Vzb3V0XCI6cmV0dXJuITA7ZGVmYXVsdDpyZXR1cm4hMX19ZnVuY3Rpb24gaGUoYSl7YT1hLmRldGFpbDtyZXR1cm5cIm9iamVjdFwiPT09dHlwZW9mIGEmJlwiZGF0YVwiaW4gYT9hLmRhdGE6bnVsbH12YXIgaWU9ITE7ZnVuY3Rpb24gamUoYSxiKXtzd2l0Y2goYSl7Y2FzZSBcImNvbXBvc2l0aW9uZW5kXCI6cmV0dXJuIGhlKGIpO2Nhc2UgXCJrZXlwcmVzc1wiOmlmKDMyIT09Yi53aGljaClyZXR1cm4gbnVsbDtmZT0hMDtyZXR1cm4gZWU7Y2FzZSBcInRleHRJbnB1dFwiOnJldHVybiBhPWIuZGF0YSxhPT09ZWUmJmZlP251bGw6YTtkZWZhdWx0OnJldHVybiBudWxsfX1cbmZ1bmN0aW9uIGtlKGEsYil7aWYoaWUpcmV0dXJuXCJjb21wb3NpdGlvbmVuZFwiPT09YXx8IWFlJiZnZShhLGIpPyhhPW5kKCksbWQ9bGQ9a2Q9bnVsbCxpZT0hMSxhKTpudWxsO3N3aXRjaChhKXtjYXNlIFwicGFzdGVcIjpyZXR1cm4gbnVsbDtjYXNlIFwia2V5cHJlc3NcIjppZighKGIuY3RybEtleXx8Yi5hbHRLZXl8fGIubWV0YUtleSl8fGIuY3RybEtleSYmYi5hbHRLZXkpe2lmKGIuY2hhciYmMTxiLmNoYXIubGVuZ3RoKXJldHVybiBiLmNoYXI7aWYoYi53aGljaClyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShiLndoaWNoKX1yZXR1cm4gbnVsbDtjYXNlIFwiY29tcG9zaXRpb25lbmRcIjpyZXR1cm4gZGUmJlwia29cIiE9PWIubG9jYWxlP251bGw6Yi5kYXRhO2RlZmF1bHQ6cmV0dXJuIG51bGx9fVxudmFyIGxlPXtjb2xvcjohMCxkYXRlOiEwLGRhdGV0aW1lOiEwLFwiZGF0ZXRpbWUtbG9jYWxcIjohMCxlbWFpbDohMCxtb250aDohMCxudW1iZXI6ITAscGFzc3dvcmQ6ITAscmFuZ2U6ITAsc2VhcmNoOiEwLHRlbDohMCx0ZXh0OiEwLHRpbWU6ITAsdXJsOiEwLHdlZWs6ITB9O2Z1bmN0aW9uIG1lKGEpe3ZhciBiPWEmJmEubm9kZU5hbWUmJmEubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT1iPyEhbGVbYS50eXBlXTpcInRleHRhcmVhXCI9PT1iPyEwOiExfWZ1bmN0aW9uIG5lKGEsYixjLGQpe0ViKGQpO2I9b2UoYixcIm9uQ2hhbmdlXCIpOzA8Yi5sZW5ndGgmJihjPW5ldyB0ZChcIm9uQ2hhbmdlXCIsXCJjaGFuZ2VcIixudWxsLGMsZCksYS5wdXNoKHtldmVudDpjLGxpc3RlbmVyczpifSkpfXZhciBwZT1udWxsLHFlPW51bGw7ZnVuY3Rpb24gcmUoYSl7c2UoYSwwKX1mdW5jdGlvbiB0ZShhKXt2YXIgYj11ZShhKTtpZihXYShiKSlyZXR1cm4gYX1cbmZ1bmN0aW9uIHZlKGEsYil7aWYoXCJjaGFuZ2VcIj09PWEpcmV0dXJuIGJ9dmFyIHdlPSExO2lmKGlhKXt2YXIgeGU7aWYoaWEpe3ZhciB5ZT1cIm9uaW5wdXRcImluIGRvY3VtZW50O2lmKCF5ZSl7dmFyIHplPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7emUuc2V0QXR0cmlidXRlKFwib25pbnB1dFwiLFwicmV0dXJuO1wiKTt5ZT1cImZ1bmN0aW9uXCI9PT10eXBlb2YgemUub25pbnB1dH14ZT15ZX1lbHNlIHhlPSExO3dlPXhlJiYoIWRvY3VtZW50LmRvY3VtZW50TW9kZXx8OTxkb2N1bWVudC5kb2N1bWVudE1vZGUpfWZ1bmN0aW9uIEFlKCl7cGUmJihwZS5kZXRhY2hFdmVudChcIm9ucHJvcGVydHljaGFuZ2VcIixCZSkscWU9cGU9bnVsbCl9ZnVuY3Rpb24gQmUoYSl7aWYoXCJ2YWx1ZVwiPT09YS5wcm9wZXJ0eU5hbWUmJnRlKHFlKSl7dmFyIGI9W107bmUoYixxZSxhLHhiKGEpKTtKYihyZSxiKX19XG5mdW5jdGlvbiBDZShhLGIsYyl7XCJmb2N1c2luXCI9PT1hPyhBZSgpLHBlPWIscWU9YyxwZS5hdHRhY2hFdmVudChcIm9ucHJvcGVydHljaGFuZ2VcIixCZSkpOlwiZm9jdXNvdXRcIj09PWEmJkFlKCl9ZnVuY3Rpb24gRGUoYSl7aWYoXCJzZWxlY3Rpb25jaGFuZ2VcIj09PWF8fFwia2V5dXBcIj09PWF8fFwia2V5ZG93blwiPT09YSlyZXR1cm4gdGUocWUpfWZ1bmN0aW9uIEVlKGEsYil7aWYoXCJjbGlja1wiPT09YSlyZXR1cm4gdGUoYil9ZnVuY3Rpb24gRmUoYSxiKXtpZihcImlucHV0XCI9PT1hfHxcImNoYW5nZVwiPT09YSlyZXR1cm4gdGUoYil9ZnVuY3Rpb24gR2UoYSxiKXtyZXR1cm4gYT09PWImJigwIT09YXx8MS9hPT09MS9iKXx8YSE9PWEmJmIhPT1ifXZhciBIZT1cImZ1bmN0aW9uXCI9PT10eXBlb2YgT2JqZWN0LmlzP09iamVjdC5pczpHZTtcbmZ1bmN0aW9uIEllKGEsYil7aWYoSGUoYSxiKSlyZXR1cm4hMDtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fG51bGw9PT1hfHxcIm9iamVjdFwiIT09dHlwZW9mIGJ8fG51bGw9PT1iKXJldHVybiExO3ZhciBjPU9iamVjdC5rZXlzKGEpLGQ9T2JqZWN0LmtleXMoYik7aWYoYy5sZW5ndGghPT1kLmxlbmd0aClyZXR1cm4hMTtmb3IoZD0wO2Q8Yy5sZW5ndGg7ZCsrKXt2YXIgZT1jW2RdO2lmKCFqYS5jYWxsKGIsZSl8fCFIZShhW2VdLGJbZV0pKXJldHVybiExfXJldHVybiEwfWZ1bmN0aW9uIEplKGEpe2Zvcig7YSYmYS5maXJzdENoaWxkOylhPWEuZmlyc3RDaGlsZDtyZXR1cm4gYX1cbmZ1bmN0aW9uIEtlKGEsYil7dmFyIGM9SmUoYSk7YT0wO2Zvcih2YXIgZDtjOyl7aWYoMz09PWMubm9kZVR5cGUpe2Q9YStjLnRleHRDb250ZW50Lmxlbmd0aDtpZihhPD1iJiZkPj1iKXJldHVybntub2RlOmMsb2Zmc2V0OmItYX07YT1kfWE6e2Zvcig7Yzspe2lmKGMubmV4dFNpYmxpbmcpe2M9Yy5uZXh0U2libGluZzticmVhayBhfWM9Yy5wYXJlbnROb2RlfWM9dm9pZCAwfWM9SmUoYyl9fWZ1bmN0aW9uIExlKGEsYil7cmV0dXJuIGEmJmI/YT09PWI/ITA6YSYmMz09PWEubm9kZVR5cGU/ITE6YiYmMz09PWIubm9kZVR5cGU/TGUoYSxiLnBhcmVudE5vZGUpOlwiY29udGFpbnNcImluIGE/YS5jb250YWlucyhiKTphLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uPyEhKGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYikmMTYpOiExOiExfVxuZnVuY3Rpb24gTWUoKXtmb3IodmFyIGE9d2luZG93LGI9WGEoKTtiIGluc3RhbmNlb2YgYS5IVE1MSUZyYW1lRWxlbWVudDspe3RyeXt2YXIgYz1cInN0cmluZ1wiPT09dHlwZW9mIGIuY29udGVudFdpbmRvdy5sb2NhdGlvbi5ocmVmfWNhdGNoKGQpe2M9ITF9aWYoYylhPWIuY29udGVudFdpbmRvdztlbHNlIGJyZWFrO2I9WGEoYS5kb2N1bWVudCl9cmV0dXJuIGJ9ZnVuY3Rpb24gTmUoYSl7dmFyIGI9YSYmYS5ub2RlTmFtZSYmYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVybiBiJiYoXCJpbnB1dFwiPT09YiYmKFwidGV4dFwiPT09YS50eXBlfHxcInNlYXJjaFwiPT09YS50eXBlfHxcInRlbFwiPT09YS50eXBlfHxcInVybFwiPT09YS50eXBlfHxcInBhc3N3b3JkXCI9PT1hLnR5cGUpfHxcInRleHRhcmVhXCI9PT1ifHxcInRydWVcIj09PWEuY29udGVudEVkaXRhYmxlKX1cbmZ1bmN0aW9uIE9lKGEpe3ZhciBiPU1lKCksYz1hLmZvY3VzZWRFbGVtLGQ9YS5zZWxlY3Rpb25SYW5nZTtpZihiIT09YyYmYyYmYy5vd25lckRvY3VtZW50JiZMZShjLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LGMpKXtpZihudWxsIT09ZCYmTmUoYykpaWYoYj1kLnN0YXJ0LGE9ZC5lbmQsdm9pZCAwPT09YSYmKGE9YiksXCJzZWxlY3Rpb25TdGFydFwiaW4gYyljLnNlbGVjdGlvblN0YXJ0PWIsYy5zZWxlY3Rpb25FbmQ9TWF0aC5taW4oYSxjLnZhbHVlLmxlbmd0aCk7ZWxzZSBpZihhPShiPWMub3duZXJEb2N1bWVudHx8ZG9jdW1lbnQpJiZiLmRlZmF1bHRWaWV3fHx3aW5kb3csYS5nZXRTZWxlY3Rpb24pe2E9YS5nZXRTZWxlY3Rpb24oKTt2YXIgZT1jLnRleHRDb250ZW50Lmxlbmd0aCxmPU1hdGgubWluKGQuc3RhcnQsZSk7ZD12b2lkIDA9PT1kLmVuZD9mOk1hdGgubWluKGQuZW5kLGUpOyFhLmV4dGVuZCYmZj5kJiYoZT1kLGQ9ZixmPWUpO2U9S2UoYyxmKTt2YXIgZz1LZShjLFxuZCk7ZSYmZyYmKDEhPT1hLnJhbmdlQ291bnR8fGEuYW5jaG9yTm9kZSE9PWUubm9kZXx8YS5hbmNob3JPZmZzZXQhPT1lLm9mZnNldHx8YS5mb2N1c05vZGUhPT1nLm5vZGV8fGEuZm9jdXNPZmZzZXQhPT1nLm9mZnNldCkmJihiPWIuY3JlYXRlUmFuZ2UoKSxiLnNldFN0YXJ0KGUubm9kZSxlLm9mZnNldCksYS5yZW1vdmVBbGxSYW5nZXMoKSxmPmQ/KGEuYWRkUmFuZ2UoYiksYS5leHRlbmQoZy5ub2RlLGcub2Zmc2V0KSk6KGIuc2V0RW5kKGcubm9kZSxnLm9mZnNldCksYS5hZGRSYW5nZShiKSkpfWI9W107Zm9yKGE9YzthPWEucGFyZW50Tm9kZTspMT09PWEubm9kZVR5cGUmJmIucHVzaCh7ZWxlbWVudDphLGxlZnQ6YS5zY3JvbGxMZWZ0LHRvcDphLnNjcm9sbFRvcH0pO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBjLmZvY3VzJiZjLmZvY3VzKCk7Zm9yKGM9MDtjPGIubGVuZ3RoO2MrKylhPWJbY10sYS5lbGVtZW50LnNjcm9sbExlZnQ9YS5sZWZ0LGEuZWxlbWVudC5zY3JvbGxUb3A9YS50b3B9fVxudmFyIFBlPWlhJiZcImRvY3VtZW50TW9kZVwiaW4gZG9jdW1lbnQmJjExPj1kb2N1bWVudC5kb2N1bWVudE1vZGUsUWU9bnVsbCxSZT1udWxsLFNlPW51bGwsVGU9ITE7XG5mdW5jdGlvbiBVZShhLGIsYyl7dmFyIGQ9Yy53aW5kb3c9PT1jP2MuZG9jdW1lbnQ6OT09PWMubm9kZVR5cGU/YzpjLm93bmVyRG9jdW1lbnQ7VGV8fG51bGw9PVFlfHxRZSE9PVhhKGQpfHwoZD1RZSxcInNlbGVjdGlvblN0YXJ0XCJpbiBkJiZOZShkKT9kPXtzdGFydDpkLnNlbGVjdGlvblN0YXJ0LGVuZDpkLnNlbGVjdGlvbkVuZH06KGQ9KGQub3duZXJEb2N1bWVudCYmZC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3fHx3aW5kb3cpLmdldFNlbGVjdGlvbigpLGQ9e2FuY2hvck5vZGU6ZC5hbmNob3JOb2RlLGFuY2hvck9mZnNldDpkLmFuY2hvck9mZnNldCxmb2N1c05vZGU6ZC5mb2N1c05vZGUsZm9jdXNPZmZzZXQ6ZC5mb2N1c09mZnNldH0pLFNlJiZJZShTZSxkKXx8KFNlPWQsZD1vZShSZSxcIm9uU2VsZWN0XCIpLDA8ZC5sZW5ndGgmJihiPW5ldyB0ZChcIm9uU2VsZWN0XCIsXCJzZWxlY3RcIixudWxsLGIsYyksYS5wdXNoKHtldmVudDpiLGxpc3RlbmVyczpkfSksYi50YXJnZXQ9UWUpKSl9XG5mdW5jdGlvbiBWZShhLGIpe3ZhciBjPXt9O2NbYS50b0xvd2VyQ2FzZSgpXT1iLnRvTG93ZXJDYXNlKCk7Y1tcIldlYmtpdFwiK2FdPVwid2Via2l0XCIrYjtjW1wiTW96XCIrYV09XCJtb3pcIitiO3JldHVybiBjfXZhciBXZT17YW5pbWF0aW9uZW5kOlZlKFwiQW5pbWF0aW9uXCIsXCJBbmltYXRpb25FbmRcIiksYW5pbWF0aW9uaXRlcmF0aW9uOlZlKFwiQW5pbWF0aW9uXCIsXCJBbmltYXRpb25JdGVyYXRpb25cIiksYW5pbWF0aW9uc3RhcnQ6VmUoXCJBbmltYXRpb25cIixcIkFuaW1hdGlvblN0YXJ0XCIpLHRyYW5zaXRpb25lbmQ6VmUoXCJUcmFuc2l0aW9uXCIsXCJUcmFuc2l0aW9uRW5kXCIpfSxYZT17fSxZZT17fTtcbmlhJiYoWWU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKS5zdHlsZSxcIkFuaW1hdGlvbkV2ZW50XCJpbiB3aW5kb3d8fChkZWxldGUgV2UuYW5pbWF0aW9uZW5kLmFuaW1hdGlvbixkZWxldGUgV2UuYW5pbWF0aW9uaXRlcmF0aW9uLmFuaW1hdGlvbixkZWxldGUgV2UuYW5pbWF0aW9uc3RhcnQuYW5pbWF0aW9uKSxcIlRyYW5zaXRpb25FdmVudFwiaW4gd2luZG93fHxkZWxldGUgV2UudHJhbnNpdGlvbmVuZC50cmFuc2l0aW9uKTtmdW5jdGlvbiBaZShhKXtpZihYZVthXSlyZXR1cm4gWGVbYV07aWYoIVdlW2FdKXJldHVybiBhO3ZhciBiPVdlW2FdLGM7Zm9yKGMgaW4gYilpZihiLmhhc093blByb3BlcnR5KGMpJiZjIGluIFllKXJldHVybiBYZVthXT1iW2NdO3JldHVybiBhfXZhciAkZT1aZShcImFuaW1hdGlvbmVuZFwiKSxhZj1aZShcImFuaW1hdGlvbml0ZXJhdGlvblwiKSxiZj1aZShcImFuaW1hdGlvbnN0YXJ0XCIpLGNmPVplKFwidHJhbnNpdGlvbmVuZFwiKSxkZj1uZXcgTWFwLGVmPVwiYWJvcnQgYXV4Q2xpY2sgY2FuY2VsIGNhblBsYXkgY2FuUGxheVRocm91Z2ggY2xpY2sgY2xvc2UgY29udGV4dE1lbnUgY29weSBjdXQgZHJhZyBkcmFnRW5kIGRyYWdFbnRlciBkcmFnRXhpdCBkcmFnTGVhdmUgZHJhZ092ZXIgZHJhZ1N0YXJ0IGRyb3AgZHVyYXRpb25DaGFuZ2UgZW1wdGllZCBlbmNyeXB0ZWQgZW5kZWQgZXJyb3IgZ290UG9pbnRlckNhcHR1cmUgaW5wdXQgaW52YWxpZCBrZXlEb3duIGtleVByZXNzIGtleVVwIGxvYWQgbG9hZGVkRGF0YSBsb2FkZWRNZXRhZGF0YSBsb2FkU3RhcnQgbG9zdFBvaW50ZXJDYXB0dXJlIG1vdXNlRG93biBtb3VzZU1vdmUgbW91c2VPdXQgbW91c2VPdmVyIG1vdXNlVXAgcGFzdGUgcGF1c2UgcGxheSBwbGF5aW5nIHBvaW50ZXJDYW5jZWwgcG9pbnRlckRvd24gcG9pbnRlck1vdmUgcG9pbnRlck91dCBwb2ludGVyT3ZlciBwb2ludGVyVXAgcHJvZ3Jlc3MgcmF0ZUNoYW5nZSByZXNldCByZXNpemUgc2Vla2VkIHNlZWtpbmcgc3RhbGxlZCBzdWJtaXQgc3VzcGVuZCB0aW1lVXBkYXRlIHRvdWNoQ2FuY2VsIHRvdWNoRW5kIHRvdWNoU3RhcnQgdm9sdW1lQ2hhbmdlIHNjcm9sbCB0b2dnbGUgdG91Y2hNb3ZlIHdhaXRpbmcgd2hlZWxcIi5zcGxpdChcIiBcIik7XG5mdW5jdGlvbiBmZihhLGIpe2RmLnNldChhLGIpO2ZhKGIsW2FdKX1mb3IodmFyIGdmPTA7Z2Y8ZWYubGVuZ3RoO2dmKyspe3ZhciBoZj1lZltnZl0samY9aGYudG9Mb3dlckNhc2UoKSxrZj1oZlswXS50b1VwcGVyQ2FzZSgpK2hmLnNsaWNlKDEpO2ZmKGpmLFwib25cIitrZil9ZmYoJGUsXCJvbkFuaW1hdGlvbkVuZFwiKTtmZihhZixcIm9uQW5pbWF0aW9uSXRlcmF0aW9uXCIpO2ZmKGJmLFwib25BbmltYXRpb25TdGFydFwiKTtmZihcImRibGNsaWNrXCIsXCJvbkRvdWJsZUNsaWNrXCIpO2ZmKFwiZm9jdXNpblwiLFwib25Gb2N1c1wiKTtmZihcImZvY3Vzb3V0XCIsXCJvbkJsdXJcIik7ZmYoY2YsXCJvblRyYW5zaXRpb25FbmRcIik7aGEoXCJvbk1vdXNlRW50ZXJcIixbXCJtb3VzZW91dFwiLFwibW91c2VvdmVyXCJdKTtoYShcIm9uTW91c2VMZWF2ZVwiLFtcIm1vdXNlb3V0XCIsXCJtb3VzZW92ZXJcIl0pO2hhKFwib25Qb2ludGVyRW50ZXJcIixbXCJwb2ludGVyb3V0XCIsXCJwb2ludGVyb3ZlclwiXSk7XG5oYShcIm9uUG9pbnRlckxlYXZlXCIsW1wicG9pbnRlcm91dFwiLFwicG9pbnRlcm92ZXJcIl0pO2ZhKFwib25DaGFuZ2VcIixcImNoYW5nZSBjbGljayBmb2N1c2luIGZvY3Vzb3V0IGlucHV0IGtleWRvd24ga2V5dXAgc2VsZWN0aW9uY2hhbmdlXCIuc3BsaXQoXCIgXCIpKTtmYShcIm9uU2VsZWN0XCIsXCJmb2N1c291dCBjb250ZXh0bWVudSBkcmFnZW5kIGZvY3VzaW4ga2V5ZG93biBrZXl1cCBtb3VzZWRvd24gbW91c2V1cCBzZWxlY3Rpb25jaGFuZ2VcIi5zcGxpdChcIiBcIikpO2ZhKFwib25CZWZvcmVJbnB1dFwiLFtcImNvbXBvc2l0aW9uZW5kXCIsXCJrZXlwcmVzc1wiLFwidGV4dElucHV0XCIsXCJwYXN0ZVwiXSk7ZmEoXCJvbkNvbXBvc2l0aW9uRW5kXCIsXCJjb21wb3NpdGlvbmVuZCBmb2N1c291dCBrZXlkb3duIGtleXByZXNzIGtleXVwIG1vdXNlZG93blwiLnNwbGl0KFwiIFwiKSk7ZmEoXCJvbkNvbXBvc2l0aW9uU3RhcnRcIixcImNvbXBvc2l0aW9uc3RhcnQgZm9jdXNvdXQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBtb3VzZWRvd25cIi5zcGxpdChcIiBcIikpO1xuZmEoXCJvbkNvbXBvc2l0aW9uVXBkYXRlXCIsXCJjb21wb3NpdGlvbnVwZGF0ZSBmb2N1c291dCBrZXlkb3duIGtleXByZXNzIGtleXVwIG1vdXNlZG93blwiLnNwbGl0KFwiIFwiKSk7dmFyIGxmPVwiYWJvcnQgY2FucGxheSBjYW5wbGF5dGhyb3VnaCBkdXJhdGlvbmNoYW5nZSBlbXB0aWVkIGVuY3J5cHRlZCBlbmRlZCBlcnJvciBsb2FkZWRkYXRhIGxvYWRlZG1ldGFkYXRhIGxvYWRzdGFydCBwYXVzZSBwbGF5IHBsYXlpbmcgcHJvZ3Jlc3MgcmF0ZWNoYW5nZSByZXNpemUgc2Vla2VkIHNlZWtpbmcgc3RhbGxlZCBzdXNwZW5kIHRpbWV1cGRhdGUgdm9sdW1lY2hhbmdlIHdhaXRpbmdcIi5zcGxpdChcIiBcIiksbWY9bmV3IFNldChcImNhbmNlbCBjbG9zZSBpbnZhbGlkIGxvYWQgc2Nyb2xsIHRvZ2dsZVwiLnNwbGl0KFwiIFwiKS5jb25jYXQobGYpKTtcbmZ1bmN0aW9uIG5mKGEsYixjKXt2YXIgZD1hLnR5cGV8fFwidW5rbm93bi1ldmVudFwiO2EuY3VycmVudFRhcmdldD1jO1ViKGQsYix2b2lkIDAsYSk7YS5jdXJyZW50VGFyZ2V0PW51bGx9XG5mdW5jdGlvbiBzZShhLGIpe2I9MCE9PShiJjQpO2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKXt2YXIgZD1hW2NdLGU9ZC5ldmVudDtkPWQubGlzdGVuZXJzO2E6e3ZhciBmPXZvaWQgMDtpZihiKWZvcih2YXIgZz1kLmxlbmd0aC0xOzA8PWc7Zy0tKXt2YXIgaD1kW2ddLGs9aC5pbnN0YW5jZSxsPWguY3VycmVudFRhcmdldDtoPWgubGlzdGVuZXI7aWYoayE9PWYmJmUuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSlicmVhayBhO25mKGUsaCxsKTtmPWt9ZWxzZSBmb3IoZz0wO2c8ZC5sZW5ndGg7ZysrKXtoPWRbZ107az1oLmluc3RhbmNlO2w9aC5jdXJyZW50VGFyZ2V0O2g9aC5saXN0ZW5lcjtpZihrIT09ZiYmZS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKWJyZWFrIGE7bmYoZSxoLGwpO2Y9a319fWlmKFFiKXRocm93IGE9UmIsUWI9ITEsUmI9bnVsbCxhO31cbmZ1bmN0aW9uIEQoYSxiKXt2YXIgYz1iW29mXTt2b2lkIDA9PT1jJiYoYz1iW29mXT1uZXcgU2V0KTt2YXIgZD1hK1wiX19idWJibGVcIjtjLmhhcyhkKXx8KHBmKGIsYSwyLCExKSxjLmFkZChkKSl9ZnVuY3Rpb24gcWYoYSxiLGMpe3ZhciBkPTA7YiYmKGR8PTQpO3BmKGMsYSxkLGIpfXZhciByZj1cIl9yZWFjdExpc3RlbmluZ1wiK01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO2Z1bmN0aW9uIHNmKGEpe2lmKCFhW3JmXSl7YVtyZl09ITA7ZGEuZm9yRWFjaChmdW5jdGlvbihiKXtcInNlbGVjdGlvbmNoYW5nZVwiIT09YiYmKG1mLmhhcyhiKXx8cWYoYiwhMSxhKSxxZihiLCEwLGEpKX0pO3ZhciBiPTk9PT1hLm5vZGVUeXBlP2E6YS5vd25lckRvY3VtZW50O251bGw9PT1ifHxiW3JmXXx8KGJbcmZdPSEwLHFmKFwic2VsZWN0aW9uY2hhbmdlXCIsITEsYikpfX1cbmZ1bmN0aW9uIHBmKGEsYixjLGQpe3N3aXRjaChqZChiKSl7Y2FzZSAxOnZhciBlPWVkO2JyZWFrO2Nhc2UgNDplPWdkO2JyZWFrO2RlZmF1bHQ6ZT1mZH1jPWUuYmluZChudWxsLGIsYyxhKTtlPXZvaWQgMDshTGJ8fFwidG91Y2hzdGFydFwiIT09YiYmXCJ0b3VjaG1vdmVcIiE9PWImJlwid2hlZWxcIiE9PWJ8fChlPSEwKTtkP3ZvaWQgMCE9PWU/YS5hZGRFdmVudExpc3RlbmVyKGIsYyx7Y2FwdHVyZTohMCxwYXNzaXZlOmV9KTphLmFkZEV2ZW50TGlzdGVuZXIoYixjLCEwKTp2b2lkIDAhPT1lP2EuYWRkRXZlbnRMaXN0ZW5lcihiLGMse3Bhc3NpdmU6ZX0pOmEuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfVxuZnVuY3Rpb24gaGQoYSxiLGMsZCxlKXt2YXIgZj1kO2lmKDA9PT0oYiYxKSYmMD09PShiJjIpJiZudWxsIT09ZClhOmZvcig7Oyl7aWYobnVsbD09PWQpcmV0dXJuO3ZhciBnPWQudGFnO2lmKDM9PT1nfHw0PT09Zyl7dmFyIGg9ZC5zdGF0ZU5vZGUuY29udGFpbmVySW5mbztpZihoPT09ZXx8OD09PWgubm9kZVR5cGUmJmgucGFyZW50Tm9kZT09PWUpYnJlYWs7aWYoND09PWcpZm9yKGc9ZC5yZXR1cm47bnVsbCE9PWc7KXt2YXIgaz1nLnRhZztpZigzPT09a3x8ND09PWspaWYoaz1nLnN0YXRlTm9kZS5jb250YWluZXJJbmZvLGs9PT1lfHw4PT09ay5ub2RlVHlwZSYmay5wYXJlbnROb2RlPT09ZSlyZXR1cm47Zz1nLnJldHVybn1mb3IoO251bGwhPT1oOyl7Zz1XYyhoKTtpZihudWxsPT09ZylyZXR1cm47az1nLnRhZztpZig1PT09a3x8Nj09PWspe2Q9Zj1nO2NvbnRpbnVlIGF9aD1oLnBhcmVudE5vZGV9fWQ9ZC5yZXR1cm59SmIoZnVuY3Rpb24oKXt2YXIgZD1mLGU9eGIoYyksZz1bXTtcbmE6e3ZhciBoPWRmLmdldChhKTtpZih2b2lkIDAhPT1oKXt2YXIgaz10ZCxuPWE7c3dpdGNoKGEpe2Nhc2UgXCJrZXlwcmVzc1wiOmlmKDA9PT1vZChjKSlicmVhayBhO2Nhc2UgXCJrZXlkb3duXCI6Y2FzZSBcImtleXVwXCI6az1SZDticmVhaztjYXNlIFwiZm9jdXNpblwiOm49XCJmb2N1c1wiO2s9RmQ7YnJlYWs7Y2FzZSBcImZvY3Vzb3V0XCI6bj1cImJsdXJcIjtrPUZkO2JyZWFrO2Nhc2UgXCJiZWZvcmVibHVyXCI6Y2FzZSBcImFmdGVyYmx1clwiOms9RmQ7YnJlYWs7Y2FzZSBcImNsaWNrXCI6aWYoMj09PWMuYnV0dG9uKWJyZWFrIGE7Y2FzZSBcImF1eGNsaWNrXCI6Y2FzZSBcImRibGNsaWNrXCI6Y2FzZSBcIm1vdXNlZG93blwiOmNhc2UgXCJtb3VzZW1vdmVcIjpjYXNlIFwibW91c2V1cFwiOmNhc2UgXCJtb3VzZW91dFwiOmNhc2UgXCJtb3VzZW92ZXJcIjpjYXNlIFwiY29udGV4dG1lbnVcIjprPUJkO2JyZWFrO2Nhc2UgXCJkcmFnXCI6Y2FzZSBcImRyYWdlbmRcIjpjYXNlIFwiZHJhZ2VudGVyXCI6Y2FzZSBcImRyYWdleGl0XCI6Y2FzZSBcImRyYWdsZWF2ZVwiOmNhc2UgXCJkcmFnb3ZlclwiOmNhc2UgXCJkcmFnc3RhcnRcIjpjYXNlIFwiZHJvcFwiOms9XG5EZDticmVhaztjYXNlIFwidG91Y2hjYW5jZWxcIjpjYXNlIFwidG91Y2hlbmRcIjpjYXNlIFwidG91Y2htb3ZlXCI6Y2FzZSBcInRvdWNoc3RhcnRcIjprPVZkO2JyZWFrO2Nhc2UgJGU6Y2FzZSBhZjpjYXNlIGJmOms9SGQ7YnJlYWs7Y2FzZSBjZjprPVhkO2JyZWFrO2Nhc2UgXCJzY3JvbGxcIjprPXZkO2JyZWFrO2Nhc2UgXCJ3aGVlbFwiOms9WmQ7YnJlYWs7Y2FzZSBcImNvcHlcIjpjYXNlIFwiY3V0XCI6Y2FzZSBcInBhc3RlXCI6az1KZDticmVhaztjYXNlIFwiZ290cG9pbnRlcmNhcHR1cmVcIjpjYXNlIFwibG9zdHBvaW50ZXJjYXB0dXJlXCI6Y2FzZSBcInBvaW50ZXJjYW5jZWxcIjpjYXNlIFwicG9pbnRlcmRvd25cIjpjYXNlIFwicG9pbnRlcm1vdmVcIjpjYXNlIFwicG9pbnRlcm91dFwiOmNhc2UgXCJwb2ludGVyb3ZlclwiOmNhc2UgXCJwb2ludGVydXBcIjprPVRkfXZhciB0PTAhPT0oYiY0KSxKPSF0JiZcInNjcm9sbFwiPT09YSx4PXQ/bnVsbCE9PWg/aCtcIkNhcHR1cmVcIjpudWxsOmg7dD1bXTtmb3IodmFyIHc9ZCx1O251bGwhPT1cbnc7KXt1PXc7dmFyIEY9dS5zdGF0ZU5vZGU7NT09PXUudGFnJiZudWxsIT09RiYmKHU9RixudWxsIT09eCYmKEY9S2Iodyx4KSxudWxsIT1GJiZ0LnB1c2godGYodyxGLHUpKSkpO2lmKEopYnJlYWs7dz13LnJldHVybn0wPHQubGVuZ3RoJiYoaD1uZXcgayhoLG4sbnVsbCxjLGUpLGcucHVzaCh7ZXZlbnQ6aCxsaXN0ZW5lcnM6dH0pKX19aWYoMD09PShiJjcpKXthOntoPVwibW91c2VvdmVyXCI9PT1hfHxcInBvaW50ZXJvdmVyXCI9PT1hO2s9XCJtb3VzZW91dFwiPT09YXx8XCJwb2ludGVyb3V0XCI9PT1hO2lmKGgmJmMhPT13YiYmKG49Yy5yZWxhdGVkVGFyZ2V0fHxjLmZyb21FbGVtZW50KSYmKFdjKG4pfHxuW3VmXSkpYnJlYWsgYTtpZihrfHxoKXtoPWUud2luZG93PT09ZT9lOihoPWUub3duZXJEb2N1bWVudCk/aC5kZWZhdWx0Vmlld3x8aC5wYXJlbnRXaW5kb3c6d2luZG93O2lmKGspe2lmKG49Yy5yZWxhdGVkVGFyZ2V0fHxjLnRvRWxlbWVudCxrPWQsbj1uP1djKG4pOm51bGwsbnVsbCE9PVxubiYmKEo9VmIobiksbiE9PUp8fDUhPT1uLnRhZyYmNiE9PW4udGFnKSluPW51bGx9ZWxzZSBrPW51bGwsbj1kO2lmKGshPT1uKXt0PUJkO0Y9XCJvbk1vdXNlTGVhdmVcIjt4PVwib25Nb3VzZUVudGVyXCI7dz1cIm1vdXNlXCI7aWYoXCJwb2ludGVyb3V0XCI9PT1hfHxcInBvaW50ZXJvdmVyXCI9PT1hKXQ9VGQsRj1cIm9uUG9pbnRlckxlYXZlXCIseD1cIm9uUG9pbnRlckVudGVyXCIsdz1cInBvaW50ZXJcIjtKPW51bGw9PWs/aDp1ZShrKTt1PW51bGw9PW4/aDp1ZShuKTtoPW5ldyB0KEYsdytcImxlYXZlXCIsayxjLGUpO2gudGFyZ2V0PUo7aC5yZWxhdGVkVGFyZ2V0PXU7Rj1udWxsO1djKGUpPT09ZCYmKHQ9bmV3IHQoeCx3K1wiZW50ZXJcIixuLGMsZSksdC50YXJnZXQ9dSx0LnJlbGF0ZWRUYXJnZXQ9SixGPXQpO0o9RjtpZihrJiZuKWI6e3Q9azt4PW47dz0wO2Zvcih1PXQ7dTt1PXZmKHUpKXcrKzt1PTA7Zm9yKEY9eDtGO0Y9dmYoRikpdSsrO2Zvcig7MDx3LXU7KXQ9dmYodCksdy0tO2Zvcig7MDx1LXc7KXg9XG52Zih4KSx1LS07Zm9yKDt3LS07KXtpZih0PT09eHx8bnVsbCE9PXgmJnQ9PT14LmFsdGVybmF0ZSlicmVhayBiO3Q9dmYodCk7eD12Zih4KX10PW51bGx9ZWxzZSB0PW51bGw7bnVsbCE9PWsmJndmKGcsaCxrLHQsITEpO251bGwhPT1uJiZudWxsIT09SiYmd2YoZyxKLG4sdCwhMCl9fX1hOntoPWQ/dWUoZCk6d2luZG93O2s9aC5ub2RlTmFtZSYmaC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2lmKFwic2VsZWN0XCI9PT1rfHxcImlucHV0XCI9PT1rJiZcImZpbGVcIj09PWgudHlwZSl2YXIgbmE9dmU7ZWxzZSBpZihtZShoKSlpZih3ZSluYT1GZTtlbHNle25hPURlO3ZhciB4YT1DZX1lbHNlKGs9aC5ub2RlTmFtZSkmJlwiaW5wdXRcIj09PWsudG9Mb3dlckNhc2UoKSYmKFwiY2hlY2tib3hcIj09PWgudHlwZXx8XCJyYWRpb1wiPT09aC50eXBlKSYmKG5hPUVlKTtpZihuYSYmKG5hPW5hKGEsZCkpKXtuZShnLG5hLGMsZSk7YnJlYWsgYX14YSYmeGEoYSxoLGQpO1wiZm9jdXNvdXRcIj09PWEmJih4YT1oLl93cmFwcGVyU3RhdGUpJiZcbnhhLmNvbnRyb2xsZWQmJlwibnVtYmVyXCI9PT1oLnR5cGUmJmNiKGgsXCJudW1iZXJcIixoLnZhbHVlKX14YT1kP3VlKGQpOndpbmRvdztzd2l0Y2goYSl7Y2FzZSBcImZvY3VzaW5cIjppZihtZSh4YSl8fFwidHJ1ZVwiPT09eGEuY29udGVudEVkaXRhYmxlKVFlPXhhLFJlPWQsU2U9bnVsbDticmVhaztjYXNlIFwiZm9jdXNvdXRcIjpTZT1SZT1RZT1udWxsO2JyZWFrO2Nhc2UgXCJtb3VzZWRvd25cIjpUZT0hMDticmVhaztjYXNlIFwiY29udGV4dG1lbnVcIjpjYXNlIFwibW91c2V1cFwiOmNhc2UgXCJkcmFnZW5kXCI6VGU9ITE7VWUoZyxjLGUpO2JyZWFrO2Nhc2UgXCJzZWxlY3Rpb25jaGFuZ2VcIjppZihQZSlicmVhaztjYXNlIFwia2V5ZG93blwiOmNhc2UgXCJrZXl1cFwiOlVlKGcsYyxlKX12YXIgJGE7aWYoYWUpYjp7c3dpdGNoKGEpe2Nhc2UgXCJjb21wb3NpdGlvbnN0YXJ0XCI6dmFyIGJhPVwib25Db21wb3NpdGlvblN0YXJ0XCI7YnJlYWsgYjtjYXNlIFwiY29tcG9zaXRpb25lbmRcIjpiYT1cIm9uQ29tcG9zaXRpb25FbmRcIjtcbmJyZWFrIGI7Y2FzZSBcImNvbXBvc2l0aW9udXBkYXRlXCI6YmE9XCJvbkNvbXBvc2l0aW9uVXBkYXRlXCI7YnJlYWsgYn1iYT12b2lkIDB9ZWxzZSBpZT9nZShhLGMpJiYoYmE9XCJvbkNvbXBvc2l0aW9uRW5kXCIpOlwia2V5ZG93blwiPT09YSYmMjI5PT09Yy5rZXlDb2RlJiYoYmE9XCJvbkNvbXBvc2l0aW9uU3RhcnRcIik7YmEmJihkZSYmXCJrb1wiIT09Yy5sb2NhbGUmJihpZXx8XCJvbkNvbXBvc2l0aW9uU3RhcnRcIiE9PWJhP1wib25Db21wb3NpdGlvbkVuZFwiPT09YmEmJmllJiYoJGE9bmQoKSk6KGtkPWUsbGQ9XCJ2YWx1ZVwiaW4ga2Q/a2QudmFsdWU6a2QudGV4dENvbnRlbnQsaWU9ITApKSx4YT1vZShkLGJhKSwwPHhhLmxlbmd0aCYmKGJhPW5ldyBMZChiYSxhLG51bGwsYyxlKSxnLnB1c2goe2V2ZW50OmJhLGxpc3RlbmVyczp4YX0pLCRhP2JhLmRhdGE9JGE6KCRhPWhlKGMpLG51bGwhPT0kYSYmKGJhLmRhdGE9JGEpKSkpO2lmKCRhPWNlP2plKGEsYyk6a2UoYSxjKSlkPW9lKGQsXCJvbkJlZm9yZUlucHV0XCIpLFxuMDxkLmxlbmd0aCYmKGU9bmV3IExkKFwib25CZWZvcmVJbnB1dFwiLFwiYmVmb3JlaW5wdXRcIixudWxsLGMsZSksZy5wdXNoKHtldmVudDplLGxpc3RlbmVyczpkfSksZS5kYXRhPSRhKX1zZShnLGIpfSl9ZnVuY3Rpb24gdGYoYSxiLGMpe3JldHVybntpbnN0YW5jZTphLGxpc3RlbmVyOmIsY3VycmVudFRhcmdldDpjfX1mdW5jdGlvbiBvZShhLGIpe2Zvcih2YXIgYz1iK1wiQ2FwdHVyZVwiLGQ9W107bnVsbCE9PWE7KXt2YXIgZT1hLGY9ZS5zdGF0ZU5vZGU7NT09PWUudGFnJiZudWxsIT09ZiYmKGU9ZixmPUtiKGEsYyksbnVsbCE9ZiYmZC51bnNoaWZ0KHRmKGEsZixlKSksZj1LYihhLGIpLG51bGwhPWYmJmQucHVzaCh0ZihhLGYsZSkpKTthPWEucmV0dXJufXJldHVybiBkfWZ1bmN0aW9uIHZmKGEpe2lmKG51bGw9PT1hKXJldHVybiBudWxsO2RvIGE9YS5yZXR1cm47d2hpbGUoYSYmNSE9PWEudGFnKTtyZXR1cm4gYT9hOm51bGx9XG5mdW5jdGlvbiB3ZihhLGIsYyxkLGUpe2Zvcih2YXIgZj1iLl9yZWFjdE5hbWUsZz1bXTtudWxsIT09YyYmYyE9PWQ7KXt2YXIgaD1jLGs9aC5hbHRlcm5hdGUsbD1oLnN0YXRlTm9kZTtpZihudWxsIT09ayYmaz09PWQpYnJlYWs7NT09PWgudGFnJiZudWxsIT09bCYmKGg9bCxlPyhrPUtiKGMsZiksbnVsbCE9ayYmZy51bnNoaWZ0KHRmKGMsayxoKSkpOmV8fChrPUtiKGMsZiksbnVsbCE9ayYmZy5wdXNoKHRmKGMsayxoKSkpKTtjPWMucmV0dXJufTAhPT1nLmxlbmd0aCYmYS5wdXNoKHtldmVudDpiLGxpc3RlbmVyczpnfSl9dmFyIHhmPS9cXHJcXG4/L2cseWY9L1xcdTAwMDB8XFx1RkZGRC9nO2Z1bmN0aW9uIHpmKGEpe3JldHVybihcInN0cmluZ1wiPT09dHlwZW9mIGE/YTpcIlwiK2EpLnJlcGxhY2UoeGYsXCJcXG5cIikucmVwbGFjZSh5ZixcIlwiKX1mdW5jdGlvbiBBZihhLGIsYyl7Yj16ZihiKTtpZih6ZihhKSE9PWImJmMpdGhyb3cgRXJyb3IocCg0MjUpKTt9ZnVuY3Rpb24gQmYoKXt9XG52YXIgQ2Y9bnVsbCxEZj1udWxsO2Z1bmN0aW9uIEVmKGEsYil7cmV0dXJuXCJ0ZXh0YXJlYVwiPT09YXx8XCJub3NjcmlwdFwiPT09YXx8XCJzdHJpbmdcIj09PXR5cGVvZiBiLmNoaWxkcmVufHxcIm51bWJlclwiPT09dHlwZW9mIGIuY2hpbGRyZW58fFwib2JqZWN0XCI9PT10eXBlb2YgYi5kYW5nZXJvdXNseVNldElubmVySFRNTCYmbnVsbCE9PWIuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwmJm51bGwhPWIuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sfVxudmFyIEZmPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBzZXRUaW1lb3V0P3NldFRpbWVvdXQ6dm9pZCAwLEdmPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBjbGVhclRpbWVvdXQ/Y2xlYXJUaW1lb3V0OnZvaWQgMCxIZj1cImZ1bmN0aW9uXCI9PT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlOnZvaWQgMCxKZj1cImZ1bmN0aW9uXCI9PT10eXBlb2YgcXVldWVNaWNyb3Rhc2s/cXVldWVNaWNyb3Rhc2s6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBIZj9mdW5jdGlvbihhKXtyZXR1cm4gSGYucmVzb2x2ZShudWxsKS50aGVuKGEpLmNhdGNoKElmKX06RmY7ZnVuY3Rpb24gSWYoYSl7c2V0VGltZW91dChmdW5jdGlvbigpe3Rocm93IGE7fSl9XG5mdW5jdGlvbiBLZihhLGIpe3ZhciBjPWIsZD0wO2Rve3ZhciBlPWMubmV4dFNpYmxpbmc7YS5yZW1vdmVDaGlsZChjKTtpZihlJiY4PT09ZS5ub2RlVHlwZSlpZihjPWUuZGF0YSxcIi8kXCI9PT1jKXtpZigwPT09ZCl7YS5yZW1vdmVDaGlsZChlKTtiZChiKTtyZXR1cm59ZC0tfWVsc2VcIiRcIiE9PWMmJlwiJD9cIiE9PWMmJlwiJCFcIiE9PWN8fGQrKztjPWV9d2hpbGUoYyk7YmQoYil9ZnVuY3Rpb24gTGYoYSl7Zm9yKDtudWxsIT1hO2E9YS5uZXh0U2libGluZyl7dmFyIGI9YS5ub2RlVHlwZTtpZigxPT09Ynx8Mz09PWIpYnJlYWs7aWYoOD09PWIpe2I9YS5kYXRhO2lmKFwiJFwiPT09Ynx8XCIkIVwiPT09Ynx8XCIkP1wiPT09YilicmVhaztpZihcIi8kXCI9PT1iKXJldHVybiBudWxsfX1yZXR1cm4gYX1cbmZ1bmN0aW9uIE1mKGEpe2E9YS5wcmV2aW91c1NpYmxpbmc7Zm9yKHZhciBiPTA7YTspe2lmKDg9PT1hLm5vZGVUeXBlKXt2YXIgYz1hLmRhdGE7aWYoXCIkXCI9PT1jfHxcIiQhXCI9PT1jfHxcIiQ/XCI9PT1jKXtpZigwPT09YilyZXR1cm4gYTtiLS19ZWxzZVwiLyRcIj09PWMmJmIrK31hPWEucHJldmlvdXNTaWJsaW5nfXJldHVybiBudWxsfXZhciBOZj1NYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKSxPZj1cIl9fcmVhY3RGaWJlciRcIitOZixQZj1cIl9fcmVhY3RQcm9wcyRcIitOZix1Zj1cIl9fcmVhY3RDb250YWluZXIkXCIrTmYsb2Y9XCJfX3JlYWN0RXZlbnRzJFwiK05mLFFmPVwiX19yZWFjdExpc3RlbmVycyRcIitOZixSZj1cIl9fcmVhY3RIYW5kbGVzJFwiK05mO1xuZnVuY3Rpb24gV2MoYSl7dmFyIGI9YVtPZl07aWYoYilyZXR1cm4gYjtmb3IodmFyIGM9YS5wYXJlbnROb2RlO2M7KXtpZihiPWNbdWZdfHxjW09mXSl7Yz1iLmFsdGVybmF0ZTtpZihudWxsIT09Yi5jaGlsZHx8bnVsbCE9PWMmJm51bGwhPT1jLmNoaWxkKWZvcihhPU1mKGEpO251bGwhPT1hOyl7aWYoYz1hW09mXSlyZXR1cm4gYzthPU1mKGEpfXJldHVybiBifWE9YztjPWEucGFyZW50Tm9kZX1yZXR1cm4gbnVsbH1mdW5jdGlvbiBDYihhKXthPWFbT2ZdfHxhW3VmXTtyZXR1cm4hYXx8NSE9PWEudGFnJiY2IT09YS50YWcmJjEzIT09YS50YWcmJjMhPT1hLnRhZz9udWxsOmF9ZnVuY3Rpb24gdWUoYSl7aWYoNT09PWEudGFnfHw2PT09YS50YWcpcmV0dXJuIGEuc3RhdGVOb2RlO3Rocm93IEVycm9yKHAoMzMpKTt9ZnVuY3Rpb24gRGIoYSl7cmV0dXJuIGFbUGZdfHxudWxsfXZhciBTZj1bXSxUZj0tMTtmdW5jdGlvbiBVZihhKXtyZXR1cm57Y3VycmVudDphfX1cbmZ1bmN0aW9uIEUoYSl7MD5UZnx8KGEuY3VycmVudD1TZltUZl0sU2ZbVGZdPW51bGwsVGYtLSl9ZnVuY3Rpb24gRyhhLGIpe1RmKys7U2ZbVGZdPWEuY3VycmVudDthLmN1cnJlbnQ9Yn12YXIgVmY9e30sSD1VZihWZiksV2Y9VWYoITEpLFhmPVZmO2Z1bmN0aW9uIFlmKGEsYil7dmFyIGM9YS50eXBlLmNvbnRleHRUeXBlcztpZighYylyZXR1cm4gVmY7dmFyIGQ9YS5zdGF0ZU5vZGU7aWYoZCYmZC5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZFVubWFza2VkQ2hpbGRDb250ZXh0PT09YilyZXR1cm4gZC5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZE1hc2tlZENoaWxkQ29udGV4dDt2YXIgZT17fSxmO2ZvcihmIGluIGMpZVtmXT1iW2ZdO2QmJihhPWEuc3RhdGVOb2RlLGEuX19yZWFjdEludGVybmFsTWVtb2l6ZWRVbm1hc2tlZENoaWxkQ29udGV4dD1iLGEuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNYXNrZWRDaGlsZENvbnRleHQ9ZSk7cmV0dXJuIGV9XG5mdW5jdGlvbiBaZihhKXthPWEuY2hpbGRDb250ZXh0VHlwZXM7cmV0dXJuIG51bGwhPT1hJiZ2b2lkIDAhPT1hfWZ1bmN0aW9uICRmKCl7RShXZik7RShIKX1mdW5jdGlvbiBhZyhhLGIsYyl7aWYoSC5jdXJyZW50IT09VmYpdGhyb3cgRXJyb3IocCgxNjgpKTtHKEgsYik7RyhXZixjKX1mdW5jdGlvbiBiZyhhLGIsYyl7dmFyIGQ9YS5zdGF0ZU5vZGU7Yj1iLmNoaWxkQ29udGV4dFR5cGVzO2lmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBkLmdldENoaWxkQ29udGV4dClyZXR1cm4gYztkPWQuZ2V0Q2hpbGRDb250ZXh0KCk7Zm9yKHZhciBlIGluIGQpaWYoIShlIGluIGIpKXRocm93IEVycm9yKHAoMTA4LFJhKGEpfHxcIlVua25vd25cIixlKSk7cmV0dXJuIEEoe30sYyxkKX1cbmZ1bmN0aW9uIGNnKGEpe2E9KGE9YS5zdGF0ZU5vZGUpJiZhLl9fcmVhY3RJbnRlcm5hbE1lbW9pemVkTWVyZ2VkQ2hpbGRDb250ZXh0fHxWZjtYZj1ILmN1cnJlbnQ7RyhILGEpO0coV2YsV2YuY3VycmVudCk7cmV0dXJuITB9ZnVuY3Rpb24gZGcoYSxiLGMpe3ZhciBkPWEuc3RhdGVOb2RlO2lmKCFkKXRocm93IEVycm9yKHAoMTY5KSk7Yz8oYT1iZyhhLGIsWGYpLGQuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNZXJnZWRDaGlsZENvbnRleHQ9YSxFKFdmKSxFKEgpLEcoSCxhKSk6RShXZik7RyhXZixjKX12YXIgZWc9bnVsbCxmZz0hMSxnZz0hMTtmdW5jdGlvbiBoZyhhKXtudWxsPT09ZWc/ZWc9W2FdOmVnLnB1c2goYSl9ZnVuY3Rpb24gaWcoYSl7Zmc9ITA7aGcoYSl9XG5mdW5jdGlvbiBqZygpe2lmKCFnZyYmbnVsbCE9PWVnKXtnZz0hMDt2YXIgYT0wLGI9Qzt0cnl7dmFyIGM9ZWc7Zm9yKEM9MTthPGMubGVuZ3RoO2ErKyl7dmFyIGQ9Y1thXTtkbyBkPWQoITApO3doaWxlKG51bGwhPT1kKX1lZz1udWxsO2ZnPSExfWNhdGNoKGUpe3Rocm93IG51bGwhPT1lZyYmKGVnPWVnLnNsaWNlKGErMSkpLGFjKGZjLGpnKSxlO31maW5hbGx5e0M9YixnZz0hMX19cmV0dXJuIG51bGx9dmFyIGtnPVtdLGxnPTAsbWc9bnVsbCxuZz0wLG9nPVtdLHBnPTAscWc9bnVsbCxyZz0xLHNnPVwiXCI7ZnVuY3Rpb24gdGcoYSxiKXtrZ1tsZysrXT1uZztrZ1tsZysrXT1tZzttZz1hO25nPWJ9XG5mdW5jdGlvbiB1ZyhhLGIsYyl7b2dbcGcrK109cmc7b2dbcGcrK109c2c7b2dbcGcrK109cWc7cWc9YTt2YXIgZD1yZzthPXNnO3ZhciBlPTMyLW9jKGQpLTE7ZCY9figxPDxlKTtjKz0xO3ZhciBmPTMyLW9jKGIpK2U7aWYoMzA8Zil7dmFyIGc9ZS1lJTU7Zj0oZCYoMTw8ZyktMSkudG9TdHJpbmcoMzIpO2Q+Pj1nO2UtPWc7cmc9MTw8MzItb2MoYikrZXxjPDxlfGQ7c2c9ZithfWVsc2Ugcmc9MTw8ZnxjPDxlfGQsc2c9YX1mdW5jdGlvbiB2ZyhhKXtudWxsIT09YS5yZXR1cm4mJih0ZyhhLDEpLHVnKGEsMSwwKSl9ZnVuY3Rpb24gd2coYSl7Zm9yKDthPT09bWc7KW1nPWtnWy0tbGddLGtnW2xnXT1udWxsLG5nPWtnWy0tbGddLGtnW2xnXT1udWxsO2Zvcig7YT09PXFnOylxZz1vZ1stLXBnXSxvZ1twZ109bnVsbCxzZz1vZ1stLXBnXSxvZ1twZ109bnVsbCxyZz1vZ1stLXBnXSxvZ1twZ109bnVsbH12YXIgeGc9bnVsbCx5Zz1udWxsLEk9ITEsemc9bnVsbDtcbmZ1bmN0aW9uIEFnKGEsYil7dmFyIGM9QmcoNSxudWxsLG51bGwsMCk7Yy5lbGVtZW50VHlwZT1cIkRFTEVURURcIjtjLnN0YXRlTm9kZT1iO2MucmV0dXJuPWE7Yj1hLmRlbGV0aW9ucztudWxsPT09Yj8oYS5kZWxldGlvbnM9W2NdLGEuZmxhZ3N8PTE2KTpiLnB1c2goYyl9XG5mdW5jdGlvbiBDZyhhLGIpe3N3aXRjaChhLnRhZyl7Y2FzZSA1OnZhciBjPWEudHlwZTtiPTEhPT1iLm5vZGVUeXBlfHxjLnRvTG93ZXJDYXNlKCkhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk/bnVsbDpiO3JldHVybiBudWxsIT09Yj8oYS5zdGF0ZU5vZGU9Yix4Zz1hLHlnPUxmKGIuZmlyc3RDaGlsZCksITApOiExO2Nhc2UgNjpyZXR1cm4gYj1cIlwiPT09YS5wZW5kaW5nUHJvcHN8fDMhPT1iLm5vZGVUeXBlP251bGw6YixudWxsIT09Yj8oYS5zdGF0ZU5vZGU9Yix4Zz1hLHlnPW51bGwsITApOiExO2Nhc2UgMTM6cmV0dXJuIGI9OCE9PWIubm9kZVR5cGU/bnVsbDpiLG51bGwhPT1iPyhjPW51bGwhPT1xZz97aWQ6cmcsb3ZlcmZsb3c6c2d9Om51bGwsYS5tZW1vaXplZFN0YXRlPXtkZWh5ZHJhdGVkOmIsdHJlZUNvbnRleHQ6YyxyZXRyeUxhbmU6MTA3Mzc0MTgyNH0sYz1CZygxOCxudWxsLG51bGwsMCksYy5zdGF0ZU5vZGU9YixjLnJldHVybj1hLGEuY2hpbGQ9Yyx4Zz1hLHlnPVxubnVsbCwhMCk6ITE7ZGVmYXVsdDpyZXR1cm4hMX19ZnVuY3Rpb24gRGcoYSl7cmV0dXJuIDAhPT0oYS5tb2RlJjEpJiYwPT09KGEuZmxhZ3MmMTI4KX1mdW5jdGlvbiBFZyhhKXtpZihJKXt2YXIgYj15ZztpZihiKXt2YXIgYz1iO2lmKCFDZyhhLGIpKXtpZihEZyhhKSl0aHJvdyBFcnJvcihwKDQxOCkpO2I9TGYoYy5uZXh0U2libGluZyk7dmFyIGQ9eGc7YiYmQ2coYSxiKT9BZyhkLGMpOihhLmZsYWdzPWEuZmxhZ3MmLTQwOTd8MixJPSExLHhnPWEpfX1lbHNle2lmKERnKGEpKXRocm93IEVycm9yKHAoNDE4KSk7YS5mbGFncz1hLmZsYWdzJi00MDk3fDI7ST0hMTt4Zz1hfX19ZnVuY3Rpb24gRmcoYSl7Zm9yKGE9YS5yZXR1cm47bnVsbCE9PWEmJjUhPT1hLnRhZyYmMyE9PWEudGFnJiYxMyE9PWEudGFnOylhPWEucmV0dXJuO3hnPWF9XG5mdW5jdGlvbiBHZyhhKXtpZihhIT09eGcpcmV0dXJuITE7aWYoIUkpcmV0dXJuIEZnKGEpLEk9ITAsITE7dmFyIGI7KGI9MyE9PWEudGFnKSYmIShiPTUhPT1hLnRhZykmJihiPWEudHlwZSxiPVwiaGVhZFwiIT09YiYmXCJib2R5XCIhPT1iJiYhRWYoYS50eXBlLGEubWVtb2l6ZWRQcm9wcykpO2lmKGImJihiPXlnKSl7aWYoRGcoYSkpdGhyb3cgSGcoKSxFcnJvcihwKDQxOCkpO2Zvcig7YjspQWcoYSxiKSxiPUxmKGIubmV4dFNpYmxpbmcpfUZnKGEpO2lmKDEzPT09YS50YWcpe2E9YS5tZW1vaXplZFN0YXRlO2E9bnVsbCE9PWE/YS5kZWh5ZHJhdGVkOm51bGw7aWYoIWEpdGhyb3cgRXJyb3IocCgzMTcpKTthOnthPWEubmV4dFNpYmxpbmc7Zm9yKGI9MDthOyl7aWYoOD09PWEubm9kZVR5cGUpe3ZhciBjPWEuZGF0YTtpZihcIi8kXCI9PT1jKXtpZigwPT09Yil7eWc9TGYoYS5uZXh0U2libGluZyk7YnJlYWsgYX1iLS19ZWxzZVwiJFwiIT09YyYmXCIkIVwiIT09YyYmXCIkP1wiIT09Y3x8YisrfWE9YS5uZXh0U2libGluZ315Zz1cbm51bGx9fWVsc2UgeWc9eGc/TGYoYS5zdGF0ZU5vZGUubmV4dFNpYmxpbmcpOm51bGw7cmV0dXJuITB9ZnVuY3Rpb24gSGcoKXtmb3IodmFyIGE9eWc7YTspYT1MZihhLm5leHRTaWJsaW5nKX1mdW5jdGlvbiBJZygpe3lnPXhnPW51bGw7ST0hMX1mdW5jdGlvbiBKZyhhKXtudWxsPT09emc/emc9W2FdOnpnLnB1c2goYSl9dmFyIEtnPXVhLlJlYWN0Q3VycmVudEJhdGNoQ29uZmlnO1xuZnVuY3Rpb24gTGcoYSxiLGMpe2E9Yy5yZWY7aWYobnVsbCE9PWEmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBhJiZcIm9iamVjdFwiIT09dHlwZW9mIGEpe2lmKGMuX293bmVyKXtjPWMuX293bmVyO2lmKGMpe2lmKDEhPT1jLnRhZyl0aHJvdyBFcnJvcihwKDMwOSkpO3ZhciBkPWMuc3RhdGVOb2RlfWlmKCFkKXRocm93IEVycm9yKHAoMTQ3LGEpKTt2YXIgZT1kLGY9XCJcIithO2lmKG51bGwhPT1iJiZudWxsIT09Yi5yZWYmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBiLnJlZiYmYi5yZWYuX3N0cmluZ1JlZj09PWYpcmV0dXJuIGIucmVmO2I9ZnVuY3Rpb24oYSl7dmFyIGI9ZS5yZWZzO251bGw9PT1hP2RlbGV0ZSBiW2ZdOmJbZl09YX07Yi5fc3RyaW5nUmVmPWY7cmV0dXJuIGJ9aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhKXRocm93IEVycm9yKHAoMjg0KSk7aWYoIWMuX293bmVyKXRocm93IEVycm9yKHAoMjkwLGEpKTt9cmV0dXJuIGF9XG5mdW5jdGlvbiBNZyhhLGIpe2E9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGIpO3Rocm93IEVycm9yKHAoMzEsXCJbb2JqZWN0IE9iamVjdF1cIj09PWE/XCJvYmplY3Qgd2l0aCBrZXlzIHtcIitPYmplY3Qua2V5cyhiKS5qb2luKFwiLCBcIikrXCJ9XCI6YSkpO31mdW5jdGlvbiBOZyhhKXt2YXIgYj1hLl9pbml0O3JldHVybiBiKGEuX3BheWxvYWQpfVxuZnVuY3Rpb24gT2coYSl7ZnVuY3Rpb24gYihiLGMpe2lmKGEpe3ZhciBkPWIuZGVsZXRpb25zO251bGw9PT1kPyhiLmRlbGV0aW9ucz1bY10sYi5mbGFnc3w9MTYpOmQucHVzaChjKX19ZnVuY3Rpb24gYyhjLGQpe2lmKCFhKXJldHVybiBudWxsO2Zvcig7bnVsbCE9PWQ7KWIoYyxkKSxkPWQuc2libGluZztyZXR1cm4gbnVsbH1mdW5jdGlvbiBkKGEsYil7Zm9yKGE9bmV3IE1hcDtudWxsIT09YjspbnVsbCE9PWIua2V5P2Euc2V0KGIua2V5LGIpOmEuc2V0KGIuaW5kZXgsYiksYj1iLnNpYmxpbmc7cmV0dXJuIGF9ZnVuY3Rpb24gZShhLGIpe2E9UGcoYSxiKTthLmluZGV4PTA7YS5zaWJsaW5nPW51bGw7cmV0dXJuIGF9ZnVuY3Rpb24gZihiLGMsZCl7Yi5pbmRleD1kO2lmKCFhKXJldHVybiBiLmZsYWdzfD0xMDQ4NTc2LGM7ZD1iLmFsdGVybmF0ZTtpZihudWxsIT09ZClyZXR1cm4gZD1kLmluZGV4LGQ8Yz8oYi5mbGFnc3w9MixjKTpkO2IuZmxhZ3N8PTI7cmV0dXJuIGN9ZnVuY3Rpb24gZyhiKXthJiZcbm51bGw9PT1iLmFsdGVybmF0ZSYmKGIuZmxhZ3N8PTIpO3JldHVybiBifWZ1bmN0aW9uIGgoYSxiLGMsZCl7aWYobnVsbD09PWJ8fDYhPT1iLnRhZylyZXR1cm4gYj1RZyhjLGEubW9kZSxkKSxiLnJldHVybj1hLGI7Yj1lKGIsYyk7Yi5yZXR1cm49YTtyZXR1cm4gYn1mdW5jdGlvbiBrKGEsYixjLGQpe3ZhciBmPWMudHlwZTtpZihmPT09eWEpcmV0dXJuIG0oYSxiLGMucHJvcHMuY2hpbGRyZW4sZCxjLmtleSk7aWYobnVsbCE9PWImJihiLmVsZW1lbnRUeXBlPT09Znx8XCJvYmplY3RcIj09PXR5cGVvZiBmJiZudWxsIT09ZiYmZi4kJHR5cGVvZj09PUhhJiZOZyhmKT09PWIudHlwZSkpcmV0dXJuIGQ9ZShiLGMucHJvcHMpLGQucmVmPUxnKGEsYixjKSxkLnJldHVybj1hLGQ7ZD1SZyhjLnR5cGUsYy5rZXksYy5wcm9wcyxudWxsLGEubW9kZSxkKTtkLnJlZj1MZyhhLGIsYyk7ZC5yZXR1cm49YTtyZXR1cm4gZH1mdW5jdGlvbiBsKGEsYixjLGQpe2lmKG51bGw9PT1ifHw0IT09Yi50YWd8fFxuYi5zdGF0ZU5vZGUuY29udGFpbmVySW5mbyE9PWMuY29udGFpbmVySW5mb3x8Yi5zdGF0ZU5vZGUuaW1wbGVtZW50YXRpb24hPT1jLmltcGxlbWVudGF0aW9uKXJldHVybiBiPVNnKGMsYS5tb2RlLGQpLGIucmV0dXJuPWEsYjtiPWUoYixjLmNoaWxkcmVufHxbXSk7Yi5yZXR1cm49YTtyZXR1cm4gYn1mdW5jdGlvbiBtKGEsYixjLGQsZil7aWYobnVsbD09PWJ8fDchPT1iLnRhZylyZXR1cm4gYj1UZyhjLGEubW9kZSxkLGYpLGIucmV0dXJuPWEsYjtiPWUoYixjKTtiLnJldHVybj1hO3JldHVybiBifWZ1bmN0aW9uIHEoYSxiLGMpe2lmKFwic3RyaW5nXCI9PT10eXBlb2YgYiYmXCJcIiE9PWJ8fFwibnVtYmVyXCI9PT10eXBlb2YgYilyZXR1cm4gYj1RZyhcIlwiK2IsYS5tb2RlLGMpLGIucmV0dXJuPWEsYjtpZihcIm9iamVjdFwiPT09dHlwZW9mIGImJm51bGwhPT1iKXtzd2l0Y2goYi4kJHR5cGVvZil7Y2FzZSB2YTpyZXR1cm4gYz1SZyhiLnR5cGUsYi5rZXksYi5wcm9wcyxudWxsLGEubW9kZSxjKSxcbmMucmVmPUxnKGEsbnVsbCxiKSxjLnJldHVybj1hLGM7Y2FzZSB3YTpyZXR1cm4gYj1TZyhiLGEubW9kZSxjKSxiLnJldHVybj1hLGI7Y2FzZSBIYTp2YXIgZD1iLl9pbml0O3JldHVybiBxKGEsZChiLl9wYXlsb2FkKSxjKX1pZihlYihiKXx8S2EoYikpcmV0dXJuIGI9VGcoYixhLm1vZGUsYyxudWxsKSxiLnJldHVybj1hLGI7TWcoYSxiKX1yZXR1cm4gbnVsbH1mdW5jdGlvbiByKGEsYixjLGQpe3ZhciBlPW51bGwhPT1iP2Iua2V5Om51bGw7aWYoXCJzdHJpbmdcIj09PXR5cGVvZiBjJiZcIlwiIT09Y3x8XCJudW1iZXJcIj09PXR5cGVvZiBjKXJldHVybiBudWxsIT09ZT9udWxsOmgoYSxiLFwiXCIrYyxkKTtpZihcIm9iamVjdFwiPT09dHlwZW9mIGMmJm51bGwhPT1jKXtzd2l0Y2goYy4kJHR5cGVvZil7Y2FzZSB2YTpyZXR1cm4gYy5rZXk9PT1lP2soYSxiLGMsZCk6bnVsbDtjYXNlIHdhOnJldHVybiBjLmtleT09PWU/bChhLGIsYyxkKTpudWxsO2Nhc2UgSGE6cmV0dXJuIGU9Yy5faW5pdCxyKGEsXG5iLGUoYy5fcGF5bG9hZCksZCl9aWYoZWIoYyl8fEthKGMpKXJldHVybiBudWxsIT09ZT9udWxsOm0oYSxiLGMsZCxudWxsKTtNZyhhLGMpfXJldHVybiBudWxsfWZ1bmN0aW9uIHkoYSxiLGMsZCxlKXtpZihcInN0cmluZ1wiPT09dHlwZW9mIGQmJlwiXCIhPT1kfHxcIm51bWJlclwiPT09dHlwZW9mIGQpcmV0dXJuIGE9YS5nZXQoYyl8fG51bGwsaChiLGEsXCJcIitkLGUpO2lmKFwib2JqZWN0XCI9PT10eXBlb2YgZCYmbnVsbCE9PWQpe3N3aXRjaChkLiQkdHlwZW9mKXtjYXNlIHZhOnJldHVybiBhPWEuZ2V0KG51bGw9PT1kLmtleT9jOmQua2V5KXx8bnVsbCxrKGIsYSxkLGUpO2Nhc2Ugd2E6cmV0dXJuIGE9YS5nZXQobnVsbD09PWQua2V5P2M6ZC5rZXkpfHxudWxsLGwoYixhLGQsZSk7Y2FzZSBIYTp2YXIgZj1kLl9pbml0O3JldHVybiB5KGEsYixjLGYoZC5fcGF5bG9hZCksZSl9aWYoZWIoZCl8fEthKGQpKXJldHVybiBhPWEuZ2V0KGMpfHxudWxsLG0oYixhLGQsZSxudWxsKTtNZyhiLGQpfXJldHVybiBudWxsfVxuZnVuY3Rpb24gbihlLGcsaCxrKXtmb3IodmFyIGw9bnVsbCxtPW51bGwsdT1nLHc9Zz0wLHg9bnVsbDtudWxsIT09dSYmdzxoLmxlbmd0aDt3Kyspe3UuaW5kZXg+dz8oeD11LHU9bnVsbCk6eD11LnNpYmxpbmc7dmFyIG49cihlLHUsaFt3XSxrKTtpZihudWxsPT09bil7bnVsbD09PXUmJih1PXgpO2JyZWFrfWEmJnUmJm51bGw9PT1uLmFsdGVybmF0ZSYmYihlLHUpO2c9ZihuLGcsdyk7bnVsbD09PW0/bD1uOm0uc2libGluZz1uO209bjt1PXh9aWYodz09PWgubGVuZ3RoKXJldHVybiBjKGUsdSksSSYmdGcoZSx3KSxsO2lmKG51bGw9PT11KXtmb3IoO3c8aC5sZW5ndGg7dysrKXU9cShlLGhbd10sayksbnVsbCE9PXUmJihnPWYodSxnLHcpLG51bGw9PT1tP2w9dTptLnNpYmxpbmc9dSxtPXUpO0kmJnRnKGUsdyk7cmV0dXJuIGx9Zm9yKHU9ZChlLHUpO3c8aC5sZW5ndGg7dysrKXg9eSh1LGUsdyxoW3ddLGspLG51bGwhPT14JiYoYSYmbnVsbCE9PXguYWx0ZXJuYXRlJiZ1LmRlbGV0ZShudWxsPT09XG54LmtleT93Ongua2V5KSxnPWYoeCxnLHcpLG51bGw9PT1tP2w9eDptLnNpYmxpbmc9eCxtPXgpO2EmJnUuZm9yRWFjaChmdW5jdGlvbihhKXtyZXR1cm4gYihlLGEpfSk7SSYmdGcoZSx3KTtyZXR1cm4gbH1mdW5jdGlvbiB0KGUsZyxoLGspe3ZhciBsPUthKGgpO2lmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBsKXRocm93IEVycm9yKHAoMTUwKSk7aD1sLmNhbGwoaCk7aWYobnVsbD09aCl0aHJvdyBFcnJvcihwKDE1MSkpO2Zvcih2YXIgdT1sPW51bGwsbT1nLHc9Zz0wLHg9bnVsbCxuPWgubmV4dCgpO251bGwhPT1tJiYhbi5kb25lO3crKyxuPWgubmV4dCgpKXttLmluZGV4Pnc/KHg9bSxtPW51bGwpOng9bS5zaWJsaW5nO3ZhciB0PXIoZSxtLG4udmFsdWUsayk7aWYobnVsbD09PXQpe251bGw9PT1tJiYobT14KTticmVha31hJiZtJiZudWxsPT09dC5hbHRlcm5hdGUmJmIoZSxtKTtnPWYodCxnLHcpO251bGw9PT11P2w9dDp1LnNpYmxpbmc9dDt1PXQ7bT14fWlmKG4uZG9uZSlyZXR1cm4gYyhlLFxubSksSSYmdGcoZSx3KSxsO2lmKG51bGw9PT1tKXtmb3IoOyFuLmRvbmU7dysrLG49aC5uZXh0KCkpbj1xKGUsbi52YWx1ZSxrKSxudWxsIT09biYmKGc9ZihuLGcsdyksbnVsbD09PXU/bD1uOnUuc2libGluZz1uLHU9bik7SSYmdGcoZSx3KTtyZXR1cm4gbH1mb3IobT1kKGUsbSk7IW4uZG9uZTt3Kyssbj1oLm5leHQoKSluPXkobSxlLHcsbi52YWx1ZSxrKSxudWxsIT09biYmKGEmJm51bGwhPT1uLmFsdGVybmF0ZSYmbS5kZWxldGUobnVsbD09PW4ua2V5P3c6bi5rZXkpLGc9ZihuLGcsdyksbnVsbD09PXU/bD1uOnUuc2libGluZz1uLHU9bik7YSYmbS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3JldHVybiBiKGUsYSl9KTtJJiZ0ZyhlLHcpO3JldHVybiBsfWZ1bmN0aW9uIEooYSxkLGYsaCl7XCJvYmplY3RcIj09PXR5cGVvZiBmJiZudWxsIT09ZiYmZi50eXBlPT09eWEmJm51bGw9PT1mLmtleSYmKGY9Zi5wcm9wcy5jaGlsZHJlbik7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBmJiZudWxsIT09Zil7c3dpdGNoKGYuJCR0eXBlb2Ype2Nhc2UgdmE6YTp7Zm9yKHZhciBrPVxuZi5rZXksbD1kO251bGwhPT1sOyl7aWYobC5rZXk9PT1rKXtrPWYudHlwZTtpZihrPT09eWEpe2lmKDc9PT1sLnRhZyl7YyhhLGwuc2libGluZyk7ZD1lKGwsZi5wcm9wcy5jaGlsZHJlbik7ZC5yZXR1cm49YTthPWQ7YnJlYWsgYX19ZWxzZSBpZihsLmVsZW1lbnRUeXBlPT09a3x8XCJvYmplY3RcIj09PXR5cGVvZiBrJiZudWxsIT09ayYmay4kJHR5cGVvZj09PUhhJiZOZyhrKT09PWwudHlwZSl7YyhhLGwuc2libGluZyk7ZD1lKGwsZi5wcm9wcyk7ZC5yZWY9TGcoYSxsLGYpO2QucmV0dXJuPWE7YT1kO2JyZWFrIGF9YyhhLGwpO2JyZWFrfWVsc2UgYihhLGwpO2w9bC5zaWJsaW5nfWYudHlwZT09PXlhPyhkPVRnKGYucHJvcHMuY2hpbGRyZW4sYS5tb2RlLGgsZi5rZXkpLGQucmV0dXJuPWEsYT1kKTooaD1SZyhmLnR5cGUsZi5rZXksZi5wcm9wcyxudWxsLGEubW9kZSxoKSxoLnJlZj1MZyhhLGQsZiksaC5yZXR1cm49YSxhPWgpfXJldHVybiBnKGEpO2Nhc2Ugd2E6YTp7Zm9yKGw9Zi5rZXk7bnVsbCE9PVxuZDspe2lmKGQua2V5PT09bClpZig0PT09ZC50YWcmJmQuc3RhdGVOb2RlLmNvbnRhaW5lckluZm89PT1mLmNvbnRhaW5lckluZm8mJmQuc3RhdGVOb2RlLmltcGxlbWVudGF0aW9uPT09Zi5pbXBsZW1lbnRhdGlvbil7YyhhLGQuc2libGluZyk7ZD1lKGQsZi5jaGlsZHJlbnx8W10pO2QucmV0dXJuPWE7YT1kO2JyZWFrIGF9ZWxzZXtjKGEsZCk7YnJlYWt9ZWxzZSBiKGEsZCk7ZD1kLnNpYmxpbmd9ZD1TZyhmLGEubW9kZSxoKTtkLnJldHVybj1hO2E9ZH1yZXR1cm4gZyhhKTtjYXNlIEhhOnJldHVybiBsPWYuX2luaXQsSihhLGQsbChmLl9wYXlsb2FkKSxoKX1pZihlYihmKSlyZXR1cm4gbihhLGQsZixoKTtpZihLYShmKSlyZXR1cm4gdChhLGQsZixoKTtNZyhhLGYpfXJldHVyblwic3RyaW5nXCI9PT10eXBlb2YgZiYmXCJcIiE9PWZ8fFwibnVtYmVyXCI9PT10eXBlb2YgZj8oZj1cIlwiK2YsbnVsbCE9PWQmJjY9PT1kLnRhZz8oYyhhLGQuc2libGluZyksZD1lKGQsZiksZC5yZXR1cm49YSxhPWQpOlxuKGMoYSxkKSxkPVFnKGYsYS5tb2RlLGgpLGQucmV0dXJuPWEsYT1kKSxnKGEpKTpjKGEsZCl9cmV0dXJuIEp9dmFyIFVnPU9nKCEwKSxWZz1PZyghMSksV2c9VWYobnVsbCksWGc9bnVsbCxZZz1udWxsLFpnPW51bGw7ZnVuY3Rpb24gJGcoKXtaZz1ZZz1YZz1udWxsfWZ1bmN0aW9uIGFoKGEpe3ZhciBiPVdnLmN1cnJlbnQ7RShXZyk7YS5fY3VycmVudFZhbHVlPWJ9ZnVuY3Rpb24gYmgoYSxiLGMpe2Zvcig7bnVsbCE9PWE7KXt2YXIgZD1hLmFsdGVybmF0ZTsoYS5jaGlsZExhbmVzJmIpIT09Yj8oYS5jaGlsZExhbmVzfD1iLG51bGwhPT1kJiYoZC5jaGlsZExhbmVzfD1iKSk6bnVsbCE9PWQmJihkLmNoaWxkTGFuZXMmYikhPT1iJiYoZC5jaGlsZExhbmVzfD1iKTtpZihhPT09YylicmVhazthPWEucmV0dXJufX1cbmZ1bmN0aW9uIGNoKGEsYil7WGc9YTtaZz1ZZz1udWxsO2E9YS5kZXBlbmRlbmNpZXM7bnVsbCE9PWEmJm51bGwhPT1hLmZpcnN0Q29udGV4dCYmKDAhPT0oYS5sYW5lcyZiKSYmKGRoPSEwKSxhLmZpcnN0Q29udGV4dD1udWxsKX1mdW5jdGlvbiBlaChhKXt2YXIgYj1hLl9jdXJyZW50VmFsdWU7aWYoWmchPT1hKWlmKGE9e2NvbnRleHQ6YSxtZW1vaXplZFZhbHVlOmIsbmV4dDpudWxsfSxudWxsPT09WWcpe2lmKG51bGw9PT1YZyl0aHJvdyBFcnJvcihwKDMwOCkpO1lnPWE7WGcuZGVwZW5kZW5jaWVzPXtsYW5lczowLGZpcnN0Q29udGV4dDphfX1lbHNlIFlnPVlnLm5leHQ9YTtyZXR1cm4gYn12YXIgZmg9bnVsbDtmdW5jdGlvbiBnaChhKXtudWxsPT09Zmg/Zmg9W2FdOmZoLnB1c2goYSl9XG5mdW5jdGlvbiBoaChhLGIsYyxkKXt2YXIgZT1iLmludGVybGVhdmVkO251bGw9PT1lPyhjLm5leHQ9YyxnaChiKSk6KGMubmV4dD1lLm5leHQsZS5uZXh0PWMpO2IuaW50ZXJsZWF2ZWQ9YztyZXR1cm4gaWgoYSxkKX1mdW5jdGlvbiBpaChhLGIpe2EubGFuZXN8PWI7dmFyIGM9YS5hbHRlcm5hdGU7bnVsbCE9PWMmJihjLmxhbmVzfD1iKTtjPWE7Zm9yKGE9YS5yZXR1cm47bnVsbCE9PWE7KWEuY2hpbGRMYW5lc3w9YixjPWEuYWx0ZXJuYXRlLG51bGwhPT1jJiYoYy5jaGlsZExhbmVzfD1iKSxjPWEsYT1hLnJldHVybjtyZXR1cm4gMz09PWMudGFnP2Muc3RhdGVOb2RlOm51bGx9dmFyIGpoPSExO2Z1bmN0aW9uIGtoKGEpe2EudXBkYXRlUXVldWU9e2Jhc2VTdGF0ZTphLm1lbW9pemVkU3RhdGUsZmlyc3RCYXNlVXBkYXRlOm51bGwsbGFzdEJhc2VVcGRhdGU6bnVsbCxzaGFyZWQ6e3BlbmRpbmc6bnVsbCxpbnRlcmxlYXZlZDpudWxsLGxhbmVzOjB9LGVmZmVjdHM6bnVsbH19XG5mdW5jdGlvbiBsaChhLGIpe2E9YS51cGRhdGVRdWV1ZTtiLnVwZGF0ZVF1ZXVlPT09YSYmKGIudXBkYXRlUXVldWU9e2Jhc2VTdGF0ZTphLmJhc2VTdGF0ZSxmaXJzdEJhc2VVcGRhdGU6YS5maXJzdEJhc2VVcGRhdGUsbGFzdEJhc2VVcGRhdGU6YS5sYXN0QmFzZVVwZGF0ZSxzaGFyZWQ6YS5zaGFyZWQsZWZmZWN0czphLmVmZmVjdHN9KX1mdW5jdGlvbiBtaChhLGIpe3JldHVybntldmVudFRpbWU6YSxsYW5lOmIsdGFnOjAscGF5bG9hZDpudWxsLGNhbGxiYWNrOm51bGwsbmV4dDpudWxsfX1cbmZ1bmN0aW9uIG5oKGEsYixjKXt2YXIgZD1hLnVwZGF0ZVF1ZXVlO2lmKG51bGw9PT1kKXJldHVybiBudWxsO2Q9ZC5zaGFyZWQ7aWYoMCE9PShLJjIpKXt2YXIgZT1kLnBlbmRpbmc7bnVsbD09PWU/Yi5uZXh0PWI6KGIubmV4dD1lLm5leHQsZS5uZXh0PWIpO2QucGVuZGluZz1iO3JldHVybiBpaChhLGMpfWU9ZC5pbnRlcmxlYXZlZDtudWxsPT09ZT8oYi5uZXh0PWIsZ2goZCkpOihiLm5leHQ9ZS5uZXh0LGUubmV4dD1iKTtkLmludGVybGVhdmVkPWI7cmV0dXJuIGloKGEsYyl9ZnVuY3Rpb24gb2goYSxiLGMpe2I9Yi51cGRhdGVRdWV1ZTtpZihudWxsIT09YiYmKGI9Yi5zaGFyZWQsMCE9PShjJjQxOTQyNDApKSl7dmFyIGQ9Yi5sYW5lcztkJj1hLnBlbmRpbmdMYW5lcztjfD1kO2IubGFuZXM9YztDYyhhLGMpfX1cbmZ1bmN0aW9uIHBoKGEsYil7dmFyIGM9YS51cGRhdGVRdWV1ZSxkPWEuYWx0ZXJuYXRlO2lmKG51bGwhPT1kJiYoZD1kLnVwZGF0ZVF1ZXVlLGM9PT1kKSl7dmFyIGU9bnVsbCxmPW51bGw7Yz1jLmZpcnN0QmFzZVVwZGF0ZTtpZihudWxsIT09Yyl7ZG97dmFyIGc9e2V2ZW50VGltZTpjLmV2ZW50VGltZSxsYW5lOmMubGFuZSx0YWc6Yy50YWcscGF5bG9hZDpjLnBheWxvYWQsY2FsbGJhY2s6Yy5jYWxsYmFjayxuZXh0Om51bGx9O251bGw9PT1mP2U9Zj1nOmY9Zi5uZXh0PWc7Yz1jLm5leHR9d2hpbGUobnVsbCE9PWMpO251bGw9PT1mP2U9Zj1iOmY9Zi5uZXh0PWJ9ZWxzZSBlPWY9YjtjPXtiYXNlU3RhdGU6ZC5iYXNlU3RhdGUsZmlyc3RCYXNlVXBkYXRlOmUsbGFzdEJhc2VVcGRhdGU6ZixzaGFyZWQ6ZC5zaGFyZWQsZWZmZWN0czpkLmVmZmVjdHN9O2EudXBkYXRlUXVldWU9YztyZXR1cm59YT1jLmxhc3RCYXNlVXBkYXRlO251bGw9PT1hP2MuZmlyc3RCYXNlVXBkYXRlPWI6YS5uZXh0PVxuYjtjLmxhc3RCYXNlVXBkYXRlPWJ9XG5mdW5jdGlvbiBxaChhLGIsYyxkKXt2YXIgZT1hLnVwZGF0ZVF1ZXVlO2poPSExO3ZhciBmPWUuZmlyc3RCYXNlVXBkYXRlLGc9ZS5sYXN0QmFzZVVwZGF0ZSxoPWUuc2hhcmVkLnBlbmRpbmc7aWYobnVsbCE9PWgpe2Uuc2hhcmVkLnBlbmRpbmc9bnVsbDt2YXIgaz1oLGw9ay5uZXh0O2submV4dD1udWxsO251bGw9PT1nP2Y9bDpnLm5leHQ9bDtnPWs7dmFyIG09YS5hbHRlcm5hdGU7bnVsbCE9PW0mJihtPW0udXBkYXRlUXVldWUsaD1tLmxhc3RCYXNlVXBkYXRlLGghPT1nJiYobnVsbD09PWg/bS5maXJzdEJhc2VVcGRhdGU9bDpoLm5leHQ9bCxtLmxhc3RCYXNlVXBkYXRlPWspKX1pZihudWxsIT09Zil7dmFyIHE9ZS5iYXNlU3RhdGU7Zz0wO209bD1rPW51bGw7aD1mO2Rve3ZhciByPWgubGFuZSx5PWguZXZlbnRUaW1lO2lmKChkJnIpPT09cil7bnVsbCE9PW0mJihtPW0ubmV4dD17ZXZlbnRUaW1lOnksbGFuZTowLHRhZzpoLnRhZyxwYXlsb2FkOmgucGF5bG9hZCxjYWxsYmFjazpoLmNhbGxiYWNrLFxubmV4dDpudWxsfSk7YTp7dmFyIG49YSx0PWg7cj1iO3k9Yztzd2l0Y2godC50YWcpe2Nhc2UgMTpuPXQucGF5bG9hZDtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2Ygbil7cT1uLmNhbGwoeSxxLHIpO2JyZWFrIGF9cT1uO2JyZWFrIGE7Y2FzZSAzOm4uZmxhZ3M9bi5mbGFncyYtNjU1Mzd8MTI4O2Nhc2UgMDpuPXQucGF5bG9hZDtyPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBuP24uY2FsbCh5LHEscik6bjtpZihudWxsPT09cnx8dm9pZCAwPT09cilicmVhayBhO3E9QSh7fSxxLHIpO2JyZWFrIGE7Y2FzZSAyOmpoPSEwfX1udWxsIT09aC5jYWxsYmFjayYmMCE9PWgubGFuZSYmKGEuZmxhZ3N8PTY0LHI9ZS5lZmZlY3RzLG51bGw9PT1yP2UuZWZmZWN0cz1baF06ci5wdXNoKGgpKX1lbHNlIHk9e2V2ZW50VGltZTp5LGxhbmU6cix0YWc6aC50YWcscGF5bG9hZDpoLnBheWxvYWQsY2FsbGJhY2s6aC5jYWxsYmFjayxuZXh0Om51bGx9LG51bGw9PT1tPyhsPW09eSxrPXEpOm09bS5uZXh0PXksZ3w9cjtcbmg9aC5uZXh0O2lmKG51bGw9PT1oKWlmKGg9ZS5zaGFyZWQucGVuZGluZyxudWxsPT09aClicmVhaztlbHNlIHI9aCxoPXIubmV4dCxyLm5leHQ9bnVsbCxlLmxhc3RCYXNlVXBkYXRlPXIsZS5zaGFyZWQucGVuZGluZz1udWxsfXdoaWxlKDEpO251bGw9PT1tJiYoaz1xKTtlLmJhc2VTdGF0ZT1rO2UuZmlyc3RCYXNlVXBkYXRlPWw7ZS5sYXN0QmFzZVVwZGF0ZT1tO2I9ZS5zaGFyZWQuaW50ZXJsZWF2ZWQ7aWYobnVsbCE9PWIpe2U9YjtkbyBnfD1lLmxhbmUsZT1lLm5leHQ7d2hpbGUoZSE9PWIpfWVsc2UgbnVsbD09PWYmJihlLnNoYXJlZC5sYW5lcz0wKTtyaHw9ZzthLmxhbmVzPWc7YS5tZW1vaXplZFN0YXRlPXF9fVxuZnVuY3Rpb24gc2goYSxiLGMpe2E9Yi5lZmZlY3RzO2IuZWZmZWN0cz1udWxsO2lmKG51bGwhPT1hKWZvcihiPTA7YjxhLmxlbmd0aDtiKyspe3ZhciBkPWFbYl0sZT1kLmNhbGxiYWNrO2lmKG51bGwhPT1lKXtkLmNhbGxiYWNrPW51bGw7ZD1jO2lmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBlKXRocm93IEVycm9yKHAoMTkxLGUpKTtlLmNhbGwoZCl9fX12YXIgdGg9e30sdWg9VWYodGgpLHZoPVVmKHRoKSx3aD1VZih0aCk7ZnVuY3Rpb24geGgoYSl7aWYoYT09PXRoKXRocm93IEVycm9yKHAoMTc0KSk7cmV0dXJuIGF9XG5mdW5jdGlvbiB5aChhLGIpe0cod2gsYik7Ryh2aCxhKTtHKHVoLHRoKTthPWIubm9kZVR5cGU7c3dpdGNoKGEpe2Nhc2UgOTpjYXNlIDExOmI9KGI9Yi5kb2N1bWVudEVsZW1lbnQpP2IubmFtZXNwYWNlVVJJOmxiKG51bGwsXCJcIik7YnJlYWs7ZGVmYXVsdDphPTg9PT1hP2IucGFyZW50Tm9kZTpiLGI9YS5uYW1lc3BhY2VVUkl8fG51bGwsYT1hLnRhZ05hbWUsYj1sYihiLGEpfUUodWgpO0codWgsYil9ZnVuY3Rpb24gemgoKXtFKHVoKTtFKHZoKTtFKHdoKX1mdW5jdGlvbiBBaChhKXt4aCh3aC5jdXJyZW50KTt2YXIgYj14aCh1aC5jdXJyZW50KTt2YXIgYz1sYihiLGEudHlwZSk7YiE9PWMmJihHKHZoLGEpLEcodWgsYykpfWZ1bmN0aW9uIEJoKGEpe3ZoLmN1cnJlbnQ9PT1hJiYoRSh1aCksRSh2aCkpfXZhciBMPVVmKDApO1xuZnVuY3Rpb24gQ2goYSl7Zm9yKHZhciBiPWE7bnVsbCE9PWI7KXtpZigxMz09PWIudGFnKXt2YXIgYz1iLm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PWMmJihjPWMuZGVoeWRyYXRlZCxudWxsPT09Y3x8XCIkP1wiPT09Yy5kYXRhfHxcIiQhXCI9PT1jLmRhdGEpKXJldHVybiBifWVsc2UgaWYoMTk9PT1iLnRhZyYmdm9pZCAwIT09Yi5tZW1vaXplZFByb3BzLnJldmVhbE9yZGVyKXtpZigwIT09KGIuZmxhZ3MmMTI4KSlyZXR1cm4gYn1lbHNlIGlmKG51bGwhPT1iLmNoaWxkKXtiLmNoaWxkLnJldHVybj1iO2I9Yi5jaGlsZDtjb250aW51ZX1pZihiPT09YSlicmVhaztmb3IoO251bGw9PT1iLnNpYmxpbmc7KXtpZihudWxsPT09Yi5yZXR1cm58fGIucmV0dXJuPT09YSlyZXR1cm4gbnVsbDtiPWIucmV0dXJufWIuc2libGluZy5yZXR1cm49Yi5yZXR1cm47Yj1iLnNpYmxpbmd9cmV0dXJuIG51bGx9dmFyIERoPVtdO1xuZnVuY3Rpb24gRWgoKXtmb3IodmFyIGE9MDthPERoLmxlbmd0aDthKyspRGhbYV0uX3dvcmtJblByb2dyZXNzVmVyc2lvblByaW1hcnk9bnVsbDtEaC5sZW5ndGg9MH12YXIgRmg9dWEuUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixHaD11YS5SZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxIaD0wLE09bnVsbCxOPW51bGwsTz1udWxsLEloPSExLEpoPSExLEtoPTAsTGg9MDtmdW5jdGlvbiBQKCl7dGhyb3cgRXJyb3IocCgzMjEpKTt9ZnVuY3Rpb24gTWgoYSxiKXtpZihudWxsPT09YilyZXR1cm4hMTtmb3IodmFyIGM9MDtjPGIubGVuZ3RoJiZjPGEubGVuZ3RoO2MrKylpZighSGUoYVtjXSxiW2NdKSlyZXR1cm4hMTtyZXR1cm4hMH1cbmZ1bmN0aW9uIE5oKGEsYixjLGQsZSxmKXtIaD1mO009YjtiLm1lbW9pemVkU3RhdGU9bnVsbDtiLnVwZGF0ZVF1ZXVlPW51bGw7Yi5sYW5lcz0wO0ZoLmN1cnJlbnQ9bnVsbD09PWF8fG51bGw9PT1hLm1lbW9pemVkU3RhdGU/T2g6UGg7YT1jKGQsZSk7aWYoSmgpe2Y9MDtkb3tKaD0hMTtLaD0wO2lmKDI1PD1mKXRocm93IEVycm9yKHAoMzAxKSk7Zis9MTtPPU49bnVsbDtiLnVwZGF0ZVF1ZXVlPW51bGw7RmguY3VycmVudD1RaDthPWMoZCxlKX13aGlsZShKaCl9RmguY3VycmVudD1SaDtiPW51bGwhPT1OJiZudWxsIT09Ti5uZXh0O0hoPTA7Tz1OPU09bnVsbDtJaD0hMTtpZihiKXRocm93IEVycm9yKHAoMzAwKSk7cmV0dXJuIGF9ZnVuY3Rpb24gU2goKXt2YXIgYT0wIT09S2g7S2g9MDtyZXR1cm4gYX1cbmZ1bmN0aW9uIFRoKCl7dmFyIGE9e21lbW9pemVkU3RhdGU6bnVsbCxiYXNlU3RhdGU6bnVsbCxiYXNlUXVldWU6bnVsbCxxdWV1ZTpudWxsLG5leHQ6bnVsbH07bnVsbD09PU8/TS5tZW1vaXplZFN0YXRlPU89YTpPPU8ubmV4dD1hO3JldHVybiBPfWZ1bmN0aW9uIFVoKCl7aWYobnVsbD09PU4pe3ZhciBhPU0uYWx0ZXJuYXRlO2E9bnVsbCE9PWE/YS5tZW1vaXplZFN0YXRlOm51bGx9ZWxzZSBhPU4ubmV4dDt2YXIgYj1udWxsPT09Tz9NLm1lbW9pemVkU3RhdGU6Ty5uZXh0O2lmKG51bGwhPT1iKU89YixOPWE7ZWxzZXtpZihudWxsPT09YSl0aHJvdyBFcnJvcihwKDMxMCkpO049YTthPXttZW1vaXplZFN0YXRlOk4ubWVtb2l6ZWRTdGF0ZSxiYXNlU3RhdGU6Ti5iYXNlU3RhdGUsYmFzZVF1ZXVlOk4uYmFzZVF1ZXVlLHF1ZXVlOk4ucXVldWUsbmV4dDpudWxsfTtudWxsPT09Tz9NLm1lbW9pemVkU3RhdGU9Tz1hOk89Ty5uZXh0PWF9cmV0dXJuIE99XG5mdW5jdGlvbiBWaChhLGIpe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBiP2IoYSk6Yn1cbmZ1bmN0aW9uIFdoKGEpe3ZhciBiPVVoKCksYz1iLnF1ZXVlO2lmKG51bGw9PT1jKXRocm93IEVycm9yKHAoMzExKSk7Yy5sYXN0UmVuZGVyZWRSZWR1Y2VyPWE7dmFyIGQ9TixlPWQuYmFzZVF1ZXVlLGY9Yy5wZW5kaW5nO2lmKG51bGwhPT1mKXtpZihudWxsIT09ZSl7dmFyIGc9ZS5uZXh0O2UubmV4dD1mLm5leHQ7Zi5uZXh0PWd9ZC5iYXNlUXVldWU9ZT1mO2MucGVuZGluZz1udWxsfWlmKG51bGwhPT1lKXtmPWUubmV4dDtkPWQuYmFzZVN0YXRlO3ZhciBoPWc9bnVsbCxrPW51bGwsbD1mO2Rve3ZhciBtPWwubGFuZTtpZigoSGgmbSk9PT1tKW51bGwhPT1rJiYoaz1rLm5leHQ9e2xhbmU6MCxhY3Rpb246bC5hY3Rpb24saGFzRWFnZXJTdGF0ZTpsLmhhc0VhZ2VyU3RhdGUsZWFnZXJTdGF0ZTpsLmVhZ2VyU3RhdGUsbmV4dDpudWxsfSksZD1sLmhhc0VhZ2VyU3RhdGU/bC5lYWdlclN0YXRlOmEoZCxsLmFjdGlvbik7ZWxzZXt2YXIgcT17bGFuZTptLGFjdGlvbjpsLmFjdGlvbixoYXNFYWdlclN0YXRlOmwuaGFzRWFnZXJTdGF0ZSxcbmVhZ2VyU3RhdGU6bC5lYWdlclN0YXRlLG5leHQ6bnVsbH07bnVsbD09PWs/KGg9az1xLGc9ZCk6az1rLm5leHQ9cTtNLmxhbmVzfD1tO3JofD1tfWw9bC5uZXh0fXdoaWxlKG51bGwhPT1sJiZsIT09Zik7bnVsbD09PWs/Zz1kOmsubmV4dD1oO0hlKGQsYi5tZW1vaXplZFN0YXRlKXx8KGRoPSEwKTtiLm1lbW9pemVkU3RhdGU9ZDtiLmJhc2VTdGF0ZT1nO2IuYmFzZVF1ZXVlPWs7Yy5sYXN0UmVuZGVyZWRTdGF0ZT1kfWE9Yy5pbnRlcmxlYXZlZDtpZihudWxsIT09YSl7ZT1hO2RvIGY9ZS5sYW5lLE0ubGFuZXN8PWYscmh8PWYsZT1lLm5leHQ7d2hpbGUoZSE9PWEpfWVsc2UgbnVsbD09PWUmJihjLmxhbmVzPTApO3JldHVybltiLm1lbW9pemVkU3RhdGUsYy5kaXNwYXRjaF19XG5mdW5jdGlvbiBYaChhKXt2YXIgYj1VaCgpLGM9Yi5xdWV1ZTtpZihudWxsPT09Yyl0aHJvdyBFcnJvcihwKDMxMSkpO2MubGFzdFJlbmRlcmVkUmVkdWNlcj1hO3ZhciBkPWMuZGlzcGF0Y2gsZT1jLnBlbmRpbmcsZj1iLm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PWUpe2MucGVuZGluZz1udWxsO3ZhciBnPWU9ZS5uZXh0O2RvIGY9YShmLGcuYWN0aW9uKSxnPWcubmV4dDt3aGlsZShnIT09ZSk7SGUoZixiLm1lbW9pemVkU3RhdGUpfHwoZGg9ITApO2IubWVtb2l6ZWRTdGF0ZT1mO251bGw9PT1iLmJhc2VRdWV1ZSYmKGIuYmFzZVN0YXRlPWYpO2MubGFzdFJlbmRlcmVkU3RhdGU9Zn1yZXR1cm5bZixkXX1mdW5jdGlvbiBZaCgpe31cbmZ1bmN0aW9uIFpoKGEsYil7dmFyIGM9TSxkPVVoKCksZT1iKCksZj0hSGUoZC5tZW1vaXplZFN0YXRlLGUpO2YmJihkLm1lbW9pemVkU3RhdGU9ZSxkaD0hMCk7ZD1kLnF1ZXVlOyRoKGFpLmJpbmQobnVsbCxjLGQsYSksW2FdKTtpZihkLmdldFNuYXBzaG90IT09Ynx8Znx8bnVsbCE9PU8mJk8ubWVtb2l6ZWRTdGF0ZS50YWcmMSl7Yy5mbGFnc3w9MjA0ODtiaSg5LGNpLmJpbmQobnVsbCxjLGQsZSxiKSx2b2lkIDAsbnVsbCk7aWYobnVsbD09PVEpdGhyb3cgRXJyb3IocCgzNDkpKTswIT09KEhoJjMwKXx8ZGkoYyxiLGUpfXJldHVybiBlfWZ1bmN0aW9uIGRpKGEsYixjKXthLmZsYWdzfD0xNjM4NDthPXtnZXRTbmFwc2hvdDpiLHZhbHVlOmN9O2I9TS51cGRhdGVRdWV1ZTtudWxsPT09Yj8oYj17bGFzdEVmZmVjdDpudWxsLHN0b3JlczpudWxsfSxNLnVwZGF0ZVF1ZXVlPWIsYi5zdG9yZXM9W2FdKTooYz1iLnN0b3JlcyxudWxsPT09Yz9iLnN0b3Jlcz1bYV06Yy5wdXNoKGEpKX1cbmZ1bmN0aW9uIGNpKGEsYixjLGQpe2IudmFsdWU9YztiLmdldFNuYXBzaG90PWQ7ZWkoYikmJmZpKGEpfWZ1bmN0aW9uIGFpKGEsYixjKXtyZXR1cm4gYyhmdW5jdGlvbigpe2VpKGIpJiZmaShhKX0pfWZ1bmN0aW9uIGVpKGEpe3ZhciBiPWEuZ2V0U25hcHNob3Q7YT1hLnZhbHVlO3RyeXt2YXIgYz1iKCk7cmV0dXJuIUhlKGEsYyl9Y2F0Y2goZCl7cmV0dXJuITB9fWZ1bmN0aW9uIGZpKGEpe3ZhciBiPWloKGEsMSk7bnVsbCE9PWImJmdpKGIsYSwxLC0xKX1cbmZ1bmN0aW9uIGhpKGEpe3ZhciBiPVRoKCk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGEmJihhPWEoKSk7Yi5tZW1vaXplZFN0YXRlPWIuYmFzZVN0YXRlPWE7YT17cGVuZGluZzpudWxsLGludGVybGVhdmVkOm51bGwsbGFuZXM6MCxkaXNwYXRjaDpudWxsLGxhc3RSZW5kZXJlZFJlZHVjZXI6VmgsbGFzdFJlbmRlcmVkU3RhdGU6YX07Yi5xdWV1ZT1hO2E9YS5kaXNwYXRjaD1paS5iaW5kKG51bGwsTSxhKTtyZXR1cm5bYi5tZW1vaXplZFN0YXRlLGFdfVxuZnVuY3Rpb24gYmkoYSxiLGMsZCl7YT17dGFnOmEsY3JlYXRlOmIsZGVzdHJveTpjLGRlcHM6ZCxuZXh0Om51bGx9O2I9TS51cGRhdGVRdWV1ZTtudWxsPT09Yj8oYj17bGFzdEVmZmVjdDpudWxsLHN0b3JlczpudWxsfSxNLnVwZGF0ZVF1ZXVlPWIsYi5sYXN0RWZmZWN0PWEubmV4dD1hKTooYz1iLmxhc3RFZmZlY3QsbnVsbD09PWM/Yi5sYXN0RWZmZWN0PWEubmV4dD1hOihkPWMubmV4dCxjLm5leHQ9YSxhLm5leHQ9ZCxiLmxhc3RFZmZlY3Q9YSkpO3JldHVybiBhfWZ1bmN0aW9uIGppKCl7cmV0dXJuIFVoKCkubWVtb2l6ZWRTdGF0ZX1mdW5jdGlvbiBraShhLGIsYyxkKXt2YXIgZT1UaCgpO00uZmxhZ3N8PWE7ZS5tZW1vaXplZFN0YXRlPWJpKDF8YixjLHZvaWQgMCx2b2lkIDA9PT1kP251bGw6ZCl9XG5mdW5jdGlvbiBsaShhLGIsYyxkKXt2YXIgZT1VaCgpO2Q9dm9pZCAwPT09ZD9udWxsOmQ7dmFyIGY9dm9pZCAwO2lmKG51bGwhPT1OKXt2YXIgZz1OLm1lbW9pemVkU3RhdGU7Zj1nLmRlc3Ryb3k7aWYobnVsbCE9PWQmJk1oKGQsZy5kZXBzKSl7ZS5tZW1vaXplZFN0YXRlPWJpKGIsYyxmLGQpO3JldHVybn19TS5mbGFnc3w9YTtlLm1lbW9pemVkU3RhdGU9YmkoMXxiLGMsZixkKX1mdW5jdGlvbiBtaShhLGIpe3JldHVybiBraSg4MzkwNjU2LDgsYSxiKX1mdW5jdGlvbiAkaChhLGIpe3JldHVybiBsaSgyMDQ4LDgsYSxiKX1mdW5jdGlvbiBuaShhLGIpe3JldHVybiBsaSg0LDIsYSxiKX1mdW5jdGlvbiBvaShhLGIpe3JldHVybiBsaSg0LDQsYSxiKX1cbmZ1bmN0aW9uIHBpKGEsYil7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGIpcmV0dXJuIGE9YSgpLGIoYSksZnVuY3Rpb24oKXtiKG51bGwpfTtpZihudWxsIT09YiYmdm9pZCAwIT09YilyZXR1cm4gYT1hKCksYi5jdXJyZW50PWEsZnVuY3Rpb24oKXtiLmN1cnJlbnQ9bnVsbH19ZnVuY3Rpb24gcWkoYSxiLGMpe2M9bnVsbCE9PWMmJnZvaWQgMCE9PWM/Yy5jb25jYXQoW2FdKTpudWxsO3JldHVybiBsaSg0LDQscGkuYmluZChudWxsLGIsYSksYyl9ZnVuY3Rpb24gcmkoKXt9ZnVuY3Rpb24gc2koYSxiKXt2YXIgYz1VaCgpO2I9dm9pZCAwPT09Yj9udWxsOmI7dmFyIGQ9Yy5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1kJiZudWxsIT09YiYmTWgoYixkWzFdKSlyZXR1cm4gZFswXTtjLm1lbW9pemVkU3RhdGU9W2EsYl07cmV0dXJuIGF9XG5mdW5jdGlvbiB0aShhLGIpe3ZhciBjPVVoKCk7Yj12b2lkIDA9PT1iP251bGw6Yjt2YXIgZD1jLm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PWQmJm51bGwhPT1iJiZNaChiLGRbMV0pKXJldHVybiBkWzBdO2E9YSgpO2MubWVtb2l6ZWRTdGF0ZT1bYSxiXTtyZXR1cm4gYX1mdW5jdGlvbiB1aShhLGIsYyl7aWYoMD09PShIaCYyMSkpcmV0dXJuIGEuYmFzZVN0YXRlJiYoYS5iYXNlU3RhdGU9ITEsZGg9ITApLGEubWVtb2l6ZWRTdGF0ZT1jO0hlKGMsYil8fChjPXljKCksTS5sYW5lc3w9YyxyaHw9YyxhLmJhc2VTdGF0ZT0hMCk7cmV0dXJuIGJ9ZnVuY3Rpb24gdmkoYSxiKXt2YXIgYz1DO0M9MCE9PWMmJjQ+Yz9jOjQ7YSghMCk7dmFyIGQ9R2gudHJhbnNpdGlvbjtHaC50cmFuc2l0aW9uPXt9O3RyeXthKCExKSxiKCl9ZmluYWxseXtDPWMsR2gudHJhbnNpdGlvbj1kfX1mdW5jdGlvbiB3aSgpe3JldHVybiBVaCgpLm1lbW9pemVkU3RhdGV9XG5mdW5jdGlvbiB4aShhLGIsYyl7dmFyIGQ9eWkoYSk7Yz17bGFuZTpkLGFjdGlvbjpjLGhhc0VhZ2VyU3RhdGU6ITEsZWFnZXJTdGF0ZTpudWxsLG5leHQ6bnVsbH07aWYoemkoYSkpQWkoYixjKTtlbHNlIGlmKGM9aGgoYSxiLGMsZCksbnVsbCE9PWMpe3ZhciBlPVIoKTtnaShjLGEsZCxlKTtCaShjLGIsZCl9fVxuZnVuY3Rpb24gaWkoYSxiLGMpe3ZhciBkPXlpKGEpLGU9e2xhbmU6ZCxhY3Rpb246YyxoYXNFYWdlclN0YXRlOiExLGVhZ2VyU3RhdGU6bnVsbCxuZXh0Om51bGx9O2lmKHppKGEpKUFpKGIsZSk7ZWxzZXt2YXIgZj1hLmFsdGVybmF0ZTtpZigwPT09YS5sYW5lcyYmKG51bGw9PT1mfHwwPT09Zi5sYW5lcykmJihmPWIubGFzdFJlbmRlcmVkUmVkdWNlcixudWxsIT09ZikpdHJ5e3ZhciBnPWIubGFzdFJlbmRlcmVkU3RhdGUsaD1mKGcsYyk7ZS5oYXNFYWdlclN0YXRlPSEwO2UuZWFnZXJTdGF0ZT1oO2lmKEhlKGgsZykpe3ZhciBrPWIuaW50ZXJsZWF2ZWQ7bnVsbD09PWs/KGUubmV4dD1lLGdoKGIpKTooZS5uZXh0PWsubmV4dCxrLm5leHQ9ZSk7Yi5pbnRlcmxlYXZlZD1lO3JldHVybn19Y2F0Y2gobCl7fWZpbmFsbHl7fWM9aGgoYSxiLGUsZCk7bnVsbCE9PWMmJihlPVIoKSxnaShjLGEsZCxlKSxCaShjLGIsZCkpfX1cbmZ1bmN0aW9uIHppKGEpe3ZhciBiPWEuYWx0ZXJuYXRlO3JldHVybiBhPT09TXx8bnVsbCE9PWImJmI9PT1NfWZ1bmN0aW9uIEFpKGEsYil7Smg9SWg9ITA7dmFyIGM9YS5wZW5kaW5nO251bGw9PT1jP2IubmV4dD1iOihiLm5leHQ9Yy5uZXh0LGMubmV4dD1iKTthLnBlbmRpbmc9Yn1mdW5jdGlvbiBCaShhLGIsYyl7aWYoMCE9PShjJjQxOTQyNDApKXt2YXIgZD1iLmxhbmVzO2QmPWEucGVuZGluZ0xhbmVzO2N8PWQ7Yi5sYW5lcz1jO0NjKGEsYyl9fVxudmFyIFJoPXtyZWFkQ29udGV4dDplaCx1c2VDYWxsYmFjazpQLHVzZUNvbnRleHQ6UCx1c2VFZmZlY3Q6UCx1c2VJbXBlcmF0aXZlSGFuZGxlOlAsdXNlSW5zZXJ0aW9uRWZmZWN0OlAsdXNlTGF5b3V0RWZmZWN0OlAsdXNlTWVtbzpQLHVzZVJlZHVjZXI6UCx1c2VSZWY6UCx1c2VTdGF0ZTpQLHVzZURlYnVnVmFsdWU6UCx1c2VEZWZlcnJlZFZhbHVlOlAsdXNlVHJhbnNpdGlvbjpQLHVzZU11dGFibGVTb3VyY2U6UCx1c2VTeW5jRXh0ZXJuYWxTdG9yZTpQLHVzZUlkOlAsdW5zdGFibGVfaXNOZXdSZWNvbmNpbGVyOiExfSxPaD17cmVhZENvbnRleHQ6ZWgsdXNlQ2FsbGJhY2s6ZnVuY3Rpb24oYSxiKXtUaCgpLm1lbW9pemVkU3RhdGU9W2Esdm9pZCAwPT09Yj9udWxsOmJdO3JldHVybiBhfSx1c2VDb250ZXh0OmVoLHVzZUVmZmVjdDptaSx1c2VJbXBlcmF0aXZlSGFuZGxlOmZ1bmN0aW9uKGEsYixjKXtjPW51bGwhPT1jJiZ2b2lkIDAhPT1jP2MuY29uY2F0KFthXSk6bnVsbDtyZXR1cm4ga2koNDE5NDMwOCxcbjQscGkuYmluZChudWxsLGIsYSksYyl9LHVzZUxheW91dEVmZmVjdDpmdW5jdGlvbihhLGIpe3JldHVybiBraSg0MTk0MzA4LDQsYSxiKX0sdXNlSW5zZXJ0aW9uRWZmZWN0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIGtpKDQsMixhLGIpfSx1c2VNZW1vOmZ1bmN0aW9uKGEsYil7dmFyIGM9VGgoKTtiPXZvaWQgMD09PWI/bnVsbDpiO2E9YSgpO2MubWVtb2l6ZWRTdGF0ZT1bYSxiXTtyZXR1cm4gYX0sdXNlUmVkdWNlcjpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9VGgoKTtiPXZvaWQgMCE9PWM/YyhiKTpiO2QubWVtb2l6ZWRTdGF0ZT1kLmJhc2VTdGF0ZT1iO2E9e3BlbmRpbmc6bnVsbCxpbnRlcmxlYXZlZDpudWxsLGxhbmVzOjAsZGlzcGF0Y2g6bnVsbCxsYXN0UmVuZGVyZWRSZWR1Y2VyOmEsbGFzdFJlbmRlcmVkU3RhdGU6Yn07ZC5xdWV1ZT1hO2E9YS5kaXNwYXRjaD14aS5iaW5kKG51bGwsTSxhKTtyZXR1cm5bZC5tZW1vaXplZFN0YXRlLGFdfSx1c2VSZWY6ZnVuY3Rpb24oYSl7dmFyIGI9XG5UaCgpO2E9e2N1cnJlbnQ6YX07cmV0dXJuIGIubWVtb2l6ZWRTdGF0ZT1hfSx1c2VTdGF0ZTpoaSx1c2VEZWJ1Z1ZhbHVlOnJpLHVzZURlZmVycmVkVmFsdWU6ZnVuY3Rpb24oYSl7cmV0dXJuIFRoKCkubWVtb2l6ZWRTdGF0ZT1hfSx1c2VUcmFuc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9aGkoITEpLGI9YVswXTthPXZpLmJpbmQobnVsbCxhWzFdKTtUaCgpLm1lbW9pemVkU3RhdGU9YTtyZXR1cm5bYixhXX0sdXNlTXV0YWJsZVNvdXJjZTpmdW5jdGlvbigpe30sdXNlU3luY0V4dGVybmFsU3RvcmU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPU0sZT1UaCgpO2lmKEkpe2lmKHZvaWQgMD09PWMpdGhyb3cgRXJyb3IocCg0MDcpKTtjPWMoKX1lbHNle2M9YigpO2lmKG51bGw9PT1RKXRocm93IEVycm9yKHAoMzQ5KSk7MCE9PShIaCYzMCl8fGRpKGQsYixjKX1lLm1lbW9pemVkU3RhdGU9Yzt2YXIgZj17dmFsdWU6YyxnZXRTbmFwc2hvdDpifTtlLnF1ZXVlPWY7bWkoYWkuYmluZChudWxsLGQsXG5mLGEpLFthXSk7ZC5mbGFnc3w9MjA0ODtiaSg5LGNpLmJpbmQobnVsbCxkLGYsYyxiKSx2b2lkIDAsbnVsbCk7cmV0dXJuIGN9LHVzZUlkOmZ1bmN0aW9uKCl7dmFyIGE9VGgoKSxiPVEuaWRlbnRpZmllclByZWZpeDtpZihJKXt2YXIgYz1zZzt2YXIgZD1yZztjPShkJn4oMTw8MzItb2MoZCktMSkpLnRvU3RyaW5nKDMyKStjO2I9XCI6XCIrYitcIlJcIitjO2M9S2grKzswPGMmJihiKz1cIkhcIitjLnRvU3RyaW5nKDMyKSk7Yis9XCI6XCJ9ZWxzZSBjPUxoKyssYj1cIjpcIitiK1wiclwiK2MudG9TdHJpbmcoMzIpK1wiOlwiO3JldHVybiBhLm1lbW9pemVkU3RhdGU9Yn0sdW5zdGFibGVfaXNOZXdSZWNvbmNpbGVyOiExfSxQaD17cmVhZENvbnRleHQ6ZWgsdXNlQ2FsbGJhY2s6c2ksdXNlQ29udGV4dDplaCx1c2VFZmZlY3Q6JGgsdXNlSW1wZXJhdGl2ZUhhbmRsZTpxaSx1c2VJbnNlcnRpb25FZmZlY3Q6bmksdXNlTGF5b3V0RWZmZWN0Om9pLHVzZU1lbW86dGksdXNlUmVkdWNlcjpXaCx1c2VSZWY6amksdXNlU3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gV2goVmgpfSxcbnVzZURlYnVnVmFsdWU6cmksdXNlRGVmZXJyZWRWYWx1ZTpmdW5jdGlvbihhKXt2YXIgYj1VaCgpO3JldHVybiB1aShiLE4ubWVtb2l6ZWRTdGF0ZSxhKX0sdXNlVHJhbnNpdGlvbjpmdW5jdGlvbigpe3ZhciBhPVdoKFZoKVswXSxiPVVoKCkubWVtb2l6ZWRTdGF0ZTtyZXR1cm5bYSxiXX0sdXNlTXV0YWJsZVNvdXJjZTpZaCx1c2VTeW5jRXh0ZXJuYWxTdG9yZTpaaCx1c2VJZDp3aSx1bnN0YWJsZV9pc05ld1JlY29uY2lsZXI6ITF9LFFoPXtyZWFkQ29udGV4dDplaCx1c2VDYWxsYmFjazpzaSx1c2VDb250ZXh0OmVoLHVzZUVmZmVjdDokaCx1c2VJbXBlcmF0aXZlSGFuZGxlOnFpLHVzZUluc2VydGlvbkVmZmVjdDpuaSx1c2VMYXlvdXRFZmZlY3Q6b2ksdXNlTWVtbzp0aSx1c2VSZWR1Y2VyOlhoLHVzZVJlZjpqaSx1c2VTdGF0ZTpmdW5jdGlvbigpe3JldHVybiBYaChWaCl9LHVzZURlYnVnVmFsdWU6cmksdXNlRGVmZXJyZWRWYWx1ZTpmdW5jdGlvbihhKXt2YXIgYj1VaCgpO3JldHVybiBudWxsPT09XG5OP2IubWVtb2l6ZWRTdGF0ZT1hOnVpKGIsTi5tZW1vaXplZFN0YXRlLGEpfSx1c2VUcmFuc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9WGgoVmgpWzBdLGI9VWgoKS5tZW1vaXplZFN0YXRlO3JldHVyblthLGJdfSx1c2VNdXRhYmxlU291cmNlOlloLHVzZVN5bmNFeHRlcm5hbFN0b3JlOlpoLHVzZUlkOndpLHVuc3RhYmxlX2lzTmV3UmVjb25jaWxlcjohMX07ZnVuY3Rpb24gQ2koYSxiKXtpZihhJiZhLmRlZmF1bHRQcm9wcyl7Yj1BKHt9LGIpO2E9YS5kZWZhdWx0UHJvcHM7Zm9yKHZhciBjIGluIGEpdm9pZCAwPT09YltjXSYmKGJbY109YVtjXSk7cmV0dXJuIGJ9cmV0dXJuIGJ9ZnVuY3Rpb24gRGkoYSxiLGMsZCl7Yj1hLm1lbW9pemVkU3RhdGU7Yz1jKGQsYik7Yz1udWxsPT09Y3x8dm9pZCAwPT09Yz9iOkEoe30sYixjKTthLm1lbW9pemVkU3RhdGU9YzswPT09YS5sYW5lcyYmKGEudXBkYXRlUXVldWUuYmFzZVN0YXRlPWMpfVxudmFyIEVpPXtpc01vdW50ZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuKGE9YS5fcmVhY3RJbnRlcm5hbHMpP1ZiKGEpPT09YTohMX0sZW5xdWV1ZVNldFN0YXRlOmZ1bmN0aW9uKGEsYixjKXthPWEuX3JlYWN0SW50ZXJuYWxzO3ZhciBkPVIoKSxlPXlpKGEpLGY9bWgoZCxlKTtmLnBheWxvYWQ9Yjt2b2lkIDAhPT1jJiZudWxsIT09YyYmKGYuY2FsbGJhY2s9Yyk7Yj1uaChhLGYsZSk7bnVsbCE9PWImJihnaShiLGEsZSxkKSxvaChiLGEsZSkpfSxlbnF1ZXVlUmVwbGFjZVN0YXRlOmZ1bmN0aW9uKGEsYixjKXthPWEuX3JlYWN0SW50ZXJuYWxzO3ZhciBkPVIoKSxlPXlpKGEpLGY9bWgoZCxlKTtmLnRhZz0xO2YucGF5bG9hZD1iO3ZvaWQgMCE9PWMmJm51bGwhPT1jJiYoZi5jYWxsYmFjaz1jKTtiPW5oKGEsZixlKTtudWxsIT09YiYmKGdpKGIsYSxlLGQpLG9oKGIsYSxlKSl9LGVucXVldWVGb3JjZVVwZGF0ZTpmdW5jdGlvbihhLGIpe2E9YS5fcmVhY3RJbnRlcm5hbHM7dmFyIGM9UigpLGQ9XG55aShhKSxlPW1oKGMsZCk7ZS50YWc9Mjt2b2lkIDAhPT1iJiZudWxsIT09YiYmKGUuY2FsbGJhY2s9Yik7Yj1uaChhLGUsZCk7bnVsbCE9PWImJihnaShiLGEsZCxjKSxvaChiLGEsZCkpfX07ZnVuY3Rpb24gRmkoYSxiLGMsZCxlLGYsZyl7YT1hLnN0YXRlTm9kZTtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYS5zaG91bGRDb21wb25lbnRVcGRhdGU/YS5zaG91bGRDb21wb25lbnRVcGRhdGUoZCxmLGcpOmIucHJvdG90eXBlJiZiLnByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudD8hSWUoYyxkKXx8IUllKGUsZik6ITB9XG5mdW5jdGlvbiBHaShhLGIsYyl7dmFyIGQ9ITEsZT1WZjt2YXIgZj1iLmNvbnRleHRUeXBlO1wib2JqZWN0XCI9PT10eXBlb2YgZiYmbnVsbCE9PWY/Zj1laChmKTooZT1aZihiKT9YZjpILmN1cnJlbnQsZD1iLmNvbnRleHRUeXBlcyxmPShkPW51bGwhPT1kJiZ2b2lkIDAhPT1kKT9ZZihhLGUpOlZmKTtiPW5ldyBiKGMsZik7YS5tZW1vaXplZFN0YXRlPW51bGwhPT1iLnN0YXRlJiZ2b2lkIDAhPT1iLnN0YXRlP2Iuc3RhdGU6bnVsbDtiLnVwZGF0ZXI9RWk7YS5zdGF0ZU5vZGU9YjtiLl9yZWFjdEludGVybmFscz1hO2QmJihhPWEuc3RhdGVOb2RlLGEuX19yZWFjdEludGVybmFsTWVtb2l6ZWRVbm1hc2tlZENoaWxkQ29udGV4dD1lLGEuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNYXNrZWRDaGlsZENvbnRleHQ9Zik7cmV0dXJuIGJ9XG5mdW5jdGlvbiBIaShhLGIsYyxkKXthPWIuc3RhdGU7XCJmdW5jdGlvblwiPT09dHlwZW9mIGIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmYi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGMsZCk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGIuVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJmIuVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoYyxkKTtiLnN0YXRlIT09YSYmRWkuZW5xdWV1ZVJlcGxhY2VTdGF0ZShiLGIuc3RhdGUsbnVsbCl9XG5mdW5jdGlvbiBJaShhLGIsYyxkKXt2YXIgZT1hLnN0YXRlTm9kZTtlLnByb3BzPWM7ZS5zdGF0ZT1hLm1lbW9pemVkU3RhdGU7ZS5yZWZzPXt9O2toKGEpO3ZhciBmPWIuY29udGV4dFR5cGU7XCJvYmplY3RcIj09PXR5cGVvZiBmJiZudWxsIT09Zj9lLmNvbnRleHQ9ZWgoZik6KGY9WmYoYik/WGY6SC5jdXJyZW50LGUuY29udGV4dD1ZZihhLGYpKTtlLnN0YXRlPWEubWVtb2l6ZWRTdGF0ZTtmPWIuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBmJiYoRGkoYSxiLGYsYyksZS5zdGF0ZT1hLm1lbW9pemVkU3RhdGUpO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBiLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wc3x8XCJmdW5jdGlvblwiPT09dHlwZW9mIGUuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBlLlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBlLmNvbXBvbmVudFdpbGxNb3VudHx8KGI9ZS5zdGF0ZSxcblwiZnVuY3Rpb25cIj09PXR5cGVvZiBlLmNvbXBvbmVudFdpbGxNb3VudCYmZS5jb21wb25lbnRXaWxsTW91bnQoKSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZS5VTlNBRkVfY29tcG9uZW50V2lsbE1vdW50JiZlLlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQoKSxiIT09ZS5zdGF0ZSYmRWkuZW5xdWV1ZVJlcGxhY2VTdGF0ZShlLGUuc3RhdGUsbnVsbCkscWgoYSxjLGUsZCksZS5zdGF0ZT1hLm1lbW9pemVkU3RhdGUpO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBlLmNvbXBvbmVudERpZE1vdW50JiYoYS5mbGFnc3w9NDE5NDMwOCl9ZnVuY3Rpb24gSmkoYSxiKXt0cnl7dmFyIGM9XCJcIixkPWI7ZG8gYys9UGEoZCksZD1kLnJldHVybjt3aGlsZShkKTt2YXIgZT1jfWNhdGNoKGYpe2U9XCJcXG5FcnJvciBnZW5lcmF0aW5nIHN0YWNrOiBcIitmLm1lc3NhZ2UrXCJcXG5cIitmLnN0YWNrfXJldHVybnt2YWx1ZTphLHNvdXJjZTpiLHN0YWNrOmUsZGlnZXN0Om51bGx9fVxuZnVuY3Rpb24gS2koYSxiLGMpe3JldHVybnt2YWx1ZTphLHNvdXJjZTpudWxsLHN0YWNrOm51bGwhPWM/YzpudWxsLGRpZ2VzdDpudWxsIT1iP2I6bnVsbH19ZnVuY3Rpb24gTGkoYSxiKXt0cnl7Y29uc29sZS5lcnJvcihiLnZhbHVlKX1jYXRjaChjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhyb3cgYzt9KX19dmFyIE1pPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBXZWFrTWFwP1dlYWtNYXA6TWFwO2Z1bmN0aW9uIE5pKGEsYixjKXtjPW1oKC0xLGMpO2MudGFnPTM7Yy5wYXlsb2FkPXtlbGVtZW50Om51bGx9O3ZhciBkPWIudmFsdWU7Yy5jYWxsYmFjaz1mdW5jdGlvbigpe09pfHwoT2k9ITAsUGk9ZCk7TGkoYSxiKX07cmV0dXJuIGN9XG5mdW5jdGlvbiBRaShhLGIsYyl7Yz1taCgtMSxjKTtjLnRhZz0zO3ZhciBkPWEudHlwZS5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3I7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGQpe3ZhciBlPWIudmFsdWU7Yy5wYXlsb2FkPWZ1bmN0aW9uKCl7cmV0dXJuIGQoZSl9O2MuY2FsbGJhY2s9ZnVuY3Rpb24oKXtMaShhLGIpfX12YXIgZj1hLnN0YXRlTm9kZTtudWxsIT09ZiYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGYuY29tcG9uZW50RGlkQ2F0Y2gmJihjLmNhbGxiYWNrPWZ1bmN0aW9uKCl7TGkoYSxiKTtcImZ1bmN0aW9uXCIhPT10eXBlb2YgZCYmKG51bGw9PT1SaT9SaT1uZXcgU2V0KFt0aGlzXSk6UmkuYWRkKHRoaXMpKTt2YXIgYz1iLnN0YWNrO3RoaXMuY29tcG9uZW50RGlkQ2F0Y2goYi52YWx1ZSx7Y29tcG9uZW50U3RhY2s6bnVsbCE9PWM/YzpcIlwifSl9KTtyZXR1cm4gY31cbmZ1bmN0aW9uIFNpKGEsYixjKXt2YXIgZD1hLnBpbmdDYWNoZTtpZihudWxsPT09ZCl7ZD1hLnBpbmdDYWNoZT1uZXcgTWk7dmFyIGU9bmV3IFNldDtkLnNldChiLGUpfWVsc2UgZT1kLmdldChiKSx2b2lkIDA9PT1lJiYoZT1uZXcgU2V0LGQuc2V0KGIsZSkpO2UuaGFzKGMpfHwoZS5hZGQoYyksYT1UaS5iaW5kKG51bGwsYSxiLGMpLGIudGhlbihhLGEpKX1mdW5jdGlvbiBVaShhKXtkb3t2YXIgYjtpZihiPTEzPT09YS50YWcpYj1hLm1lbW9pemVkU3RhdGUsYj1udWxsIT09Yj9udWxsIT09Yi5kZWh5ZHJhdGVkPyEwOiExOiEwO2lmKGIpcmV0dXJuIGE7YT1hLnJldHVybn13aGlsZShudWxsIT09YSk7cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBWaShhLGIsYyxkLGUpe2lmKDA9PT0oYS5tb2RlJjEpKXJldHVybiBhPT09Yj9hLmZsYWdzfD02NTUzNjooYS5mbGFnc3w9MTI4LGMuZmxhZ3N8PTEzMTA3MixjLmZsYWdzJj0tNTI4MDUsMT09PWMudGFnJiYobnVsbD09PWMuYWx0ZXJuYXRlP2MudGFnPTE3OihiPW1oKC0xLDEpLGIudGFnPTIsbmgoYyxiLDEpKSksYy5sYW5lc3w9MSksYTthLmZsYWdzfD02NTUzNjthLmxhbmVzPWU7cmV0dXJuIGF9dmFyIFdpPXVhLlJlYWN0Q3VycmVudE93bmVyLGRoPSExO2Z1bmN0aW9uIFhpKGEsYixjLGQpe2IuY2hpbGQ9bnVsbD09PWE/VmcoYixudWxsLGMsZCk6VWcoYixhLmNoaWxkLGMsZCl9XG5mdW5jdGlvbiBZaShhLGIsYyxkLGUpe2M9Yy5yZW5kZXI7dmFyIGY9Yi5yZWY7Y2goYixlKTtkPU5oKGEsYixjLGQsZixlKTtjPVNoKCk7aWYobnVsbCE9PWEmJiFkaClyZXR1cm4gYi51cGRhdGVRdWV1ZT1hLnVwZGF0ZVF1ZXVlLGIuZmxhZ3MmPS0yMDUzLGEubGFuZXMmPX5lLFppKGEsYixlKTtJJiZjJiZ2ZyhiKTtiLmZsYWdzfD0xO1hpKGEsYixkLGUpO3JldHVybiBiLmNoaWxkfVxuZnVuY3Rpb24gJGkoYSxiLGMsZCxlKXtpZihudWxsPT09YSl7dmFyIGY9Yy50eXBlO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBmJiYhYWooZikmJnZvaWQgMD09PWYuZGVmYXVsdFByb3BzJiZudWxsPT09Yy5jb21wYXJlJiZ2b2lkIDA9PT1jLmRlZmF1bHRQcm9wcylyZXR1cm4gYi50YWc9MTUsYi50eXBlPWYsYmooYSxiLGYsZCxlKTthPVJnKGMudHlwZSxudWxsLGQsYixiLm1vZGUsZSk7YS5yZWY9Yi5yZWY7YS5yZXR1cm49YjtyZXR1cm4gYi5jaGlsZD1hfWY9YS5jaGlsZDtpZigwPT09KGEubGFuZXMmZSkpe3ZhciBnPWYubWVtb2l6ZWRQcm9wcztjPWMuY29tcGFyZTtjPW51bGwhPT1jP2M6SWU7aWYoYyhnLGQpJiZhLnJlZj09PWIucmVmKXJldHVybiBaaShhLGIsZSl9Yi5mbGFnc3w9MTthPVBnKGYsZCk7YS5yZWY9Yi5yZWY7YS5yZXR1cm49YjtyZXR1cm4gYi5jaGlsZD1hfVxuZnVuY3Rpb24gYmooYSxiLGMsZCxlKXtpZihudWxsIT09YSl7dmFyIGY9YS5tZW1vaXplZFByb3BzO2lmKEllKGYsZCkmJmEucmVmPT09Yi5yZWYpaWYoZGg9ITEsYi5wZW5kaW5nUHJvcHM9ZD1mLDAhPT0oYS5sYW5lcyZlKSkwIT09KGEuZmxhZ3MmMTMxMDcyKSYmKGRoPSEwKTtlbHNlIHJldHVybiBiLmxhbmVzPWEubGFuZXMsWmkoYSxiLGUpfXJldHVybiBjaihhLGIsYyxkLGUpfVxuZnVuY3Rpb24gZGooYSxiLGMpe3ZhciBkPWIucGVuZGluZ1Byb3BzLGU9ZC5jaGlsZHJlbixmPW51bGwhPT1hP2EubWVtb2l6ZWRTdGF0ZTpudWxsO2lmKFwiaGlkZGVuXCI9PT1kLm1vZGUpaWYoMD09PShiLm1vZGUmMSkpYi5tZW1vaXplZFN0YXRlPXtiYXNlTGFuZXM6MCxjYWNoZVBvb2w6bnVsbCx0cmFuc2l0aW9uczpudWxsfSxHKGVqLGZqKSxmanw9YztlbHNle2lmKDA9PT0oYyYxMDczNzQxODI0KSlyZXR1cm4gYT1udWxsIT09Zj9mLmJhc2VMYW5lc3xjOmMsYi5sYW5lcz1iLmNoaWxkTGFuZXM9MTA3Mzc0MTgyNCxiLm1lbW9pemVkU3RhdGU9e2Jhc2VMYW5lczphLGNhY2hlUG9vbDpudWxsLHRyYW5zaXRpb25zOm51bGx9LGIudXBkYXRlUXVldWU9bnVsbCxHKGVqLGZqKSxmanw9YSxudWxsO2IubWVtb2l6ZWRTdGF0ZT17YmFzZUxhbmVzOjAsY2FjaGVQb29sOm51bGwsdHJhbnNpdGlvbnM6bnVsbH07ZD1udWxsIT09Zj9mLmJhc2VMYW5lczpjO0coZWosZmopO2ZqfD1kfWVsc2UgbnVsbCE9PVxuZj8oZD1mLmJhc2VMYW5lc3xjLGIubWVtb2l6ZWRTdGF0ZT1udWxsKTpkPWMsRyhlaixmaiksZmp8PWQ7WGkoYSxiLGUsYyk7cmV0dXJuIGIuY2hpbGR9ZnVuY3Rpb24gZ2ooYSxiKXt2YXIgYz1iLnJlZjtpZihudWxsPT09YSYmbnVsbCE9PWN8fG51bGwhPT1hJiZhLnJlZiE9PWMpYi5mbGFnc3w9NTEyLGIuZmxhZ3N8PTIwOTcxNTJ9ZnVuY3Rpb24gY2ooYSxiLGMsZCxlKXt2YXIgZj1aZihjKT9YZjpILmN1cnJlbnQ7Zj1ZZihiLGYpO2NoKGIsZSk7Yz1OaChhLGIsYyxkLGYsZSk7ZD1TaCgpO2lmKG51bGwhPT1hJiYhZGgpcmV0dXJuIGIudXBkYXRlUXVldWU9YS51cGRhdGVRdWV1ZSxiLmZsYWdzJj0tMjA1MyxhLmxhbmVzJj1+ZSxaaShhLGIsZSk7SSYmZCYmdmcoYik7Yi5mbGFnc3w9MTtYaShhLGIsYyxlKTtyZXR1cm4gYi5jaGlsZH1cbmZ1bmN0aW9uIGhqKGEsYixjLGQsZSl7aWYoWmYoYykpe3ZhciBmPSEwO2NnKGIpfWVsc2UgZj0hMTtjaChiLGUpO2lmKG51bGw9PT1iLnN0YXRlTm9kZSlpaihhLGIpLEdpKGIsYyxkKSxJaShiLGMsZCxlKSxkPSEwO2Vsc2UgaWYobnVsbD09PWEpe3ZhciBnPWIuc3RhdGVOb2RlLGg9Yi5tZW1vaXplZFByb3BzO2cucHJvcHM9aDt2YXIgaz1nLmNvbnRleHQsbD1jLmNvbnRleHRUeXBlO1wib2JqZWN0XCI9PT10eXBlb2YgbCYmbnVsbCE9PWw/bD1laChsKToobD1aZihjKT9YZjpILmN1cnJlbnQsbD1ZZihiLGwpKTt2YXIgbT1jLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyxxPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBtfHxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZTtxfHxcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5VTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGcuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wc3x8XG4oaCE9PWR8fGshPT1sKSYmSGkoYixnLGQsbCk7amg9ITE7dmFyIHI9Yi5tZW1vaXplZFN0YXRlO2cuc3RhdGU9cjtxaChiLGQsZyxlKTtrPWIubWVtb2l6ZWRTdGF0ZTtoIT09ZHx8ciE9PWt8fFdmLmN1cnJlbnR8fGpoPyhcImZ1bmN0aW9uXCI9PT10eXBlb2YgbSYmKERpKGIsYyxtLGQpLGs9Yi5tZW1vaXplZFN0YXRlKSwoaD1qaHx8RmkoYixjLGgsZCxyLGssbCkpPyhxfHxcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5VTlNBRkVfY29tcG9uZW50V2lsbE1vdW50JiZcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5jb21wb25lbnRXaWxsTW91bnR8fChcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5jb21wb25lbnRXaWxsTW91bnQmJmcuY29tcG9uZW50V2lsbE1vdW50KCksXCJmdW5jdGlvblwiPT09dHlwZW9mIGcuVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCYmZy5VTlNBRkVfY29tcG9uZW50V2lsbE1vdW50KCkpLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmNvbXBvbmVudERpZE1vdW50JiYoYi5mbGFnc3w9NDE5NDMwOCkpOlxuKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmNvbXBvbmVudERpZE1vdW50JiYoYi5mbGFnc3w9NDE5NDMwOCksYi5tZW1vaXplZFByb3BzPWQsYi5tZW1vaXplZFN0YXRlPWspLGcucHJvcHM9ZCxnLnN0YXRlPWssZy5jb250ZXh0PWwsZD1oKTooXCJmdW5jdGlvblwiPT09dHlwZW9mIGcuY29tcG9uZW50RGlkTW91bnQmJihiLmZsYWdzfD00MTk0MzA4KSxkPSExKX1lbHNle2c9Yi5zdGF0ZU5vZGU7bGgoYSxiKTtoPWIubWVtb2l6ZWRQcm9wcztsPWIudHlwZT09PWIuZWxlbWVudFR5cGU/aDpDaShiLnR5cGUsaCk7Zy5wcm9wcz1sO3E9Yi5wZW5kaW5nUHJvcHM7cj1nLmNvbnRleHQ7az1jLmNvbnRleHRUeXBlO1wib2JqZWN0XCI9PT10eXBlb2YgayYmbnVsbCE9PWs/az1laChrKTooaz1aZihjKT9YZjpILmN1cnJlbnQsaz1ZZihiLGspKTt2YXIgeT1jLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wczsobT1cImZ1bmN0aW9uXCI9PT10eXBlb2YgeXx8XCJmdW5jdGlvblwiPT09dHlwZW9mIGcuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUpfHxcblwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLlVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzfHwoaCE9PXF8fHIhPT1rKSYmSGkoYixnLGQsayk7amg9ITE7cj1iLm1lbW9pemVkU3RhdGU7Zy5zdGF0ZT1yO3FoKGIsZCxnLGUpO3ZhciBuPWIubWVtb2l6ZWRTdGF0ZTtoIT09cXx8ciE9PW58fFdmLmN1cnJlbnR8fGpoPyhcImZ1bmN0aW9uXCI9PT10eXBlb2YgeSYmKERpKGIsYyx5LGQpLG49Yi5tZW1vaXplZFN0YXRlKSwobD1qaHx8RmkoYixjLGwsZCxyLG4sayl8fCExKT8obXx8XCJmdW5jdGlvblwiIT09dHlwZW9mIGcuVU5TQUZFX2NvbXBvbmVudFdpbGxVcGRhdGUmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLmNvbXBvbmVudFdpbGxVcGRhdGV8fChcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5jb21wb25lbnRXaWxsVXBkYXRlJiZnLmNvbXBvbmVudFdpbGxVcGRhdGUoZCxuLGspLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLlVOU0FGRV9jb21wb25lbnRXaWxsVXBkYXRlJiZcbmcuVU5TQUZFX2NvbXBvbmVudFdpbGxVcGRhdGUoZCxuLGspKSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5jb21wb25lbnREaWRVcGRhdGUmJihiLmZsYWdzfD00KSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSYmKGIuZmxhZ3N8PTEwMjQpKTooXCJmdW5jdGlvblwiIT09dHlwZW9mIGcuY29tcG9uZW50RGlkVXBkYXRlfHxoPT09YS5tZW1vaXplZFByb3BzJiZyPT09YS5tZW1vaXplZFN0YXRlfHwoYi5mbGFnc3w9NCksXCJmdW5jdGlvblwiIT09dHlwZW9mIGcuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fGg9PT1hLm1lbW9pemVkUHJvcHMmJnI9PT1hLm1lbW9pemVkU3RhdGV8fChiLmZsYWdzfD0xMDI0KSxiLm1lbW9pemVkUHJvcHM9ZCxiLm1lbW9pemVkU3RhdGU9biksZy5wcm9wcz1kLGcuc3RhdGU9bixnLmNvbnRleHQ9ayxkPWwpOihcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5jb21wb25lbnREaWRVcGRhdGV8fGg9PT1hLm1lbW9pemVkUHJvcHMmJnI9PT1cbmEubWVtb2l6ZWRTdGF0ZXx8KGIuZmxhZ3N8PTQpLFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHxoPT09YS5tZW1vaXplZFByb3BzJiZyPT09YS5tZW1vaXplZFN0YXRlfHwoYi5mbGFnc3w9MTAyNCksZD0hMSl9cmV0dXJuIGpqKGEsYixjLGQsZixlKX1cbmZ1bmN0aW9uIGpqKGEsYixjLGQsZSxmKXtnaihhLGIpO3ZhciBnPTAhPT0oYi5mbGFncyYxMjgpO2lmKCFkJiYhZylyZXR1cm4gZSYmZGcoYixjLCExKSxaaShhLGIsZik7ZD1iLnN0YXRlTm9kZTtXaS5jdXJyZW50PWI7dmFyIGg9ZyYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGMuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yP251bGw6ZC5yZW5kZXIoKTtiLmZsYWdzfD0xO251bGwhPT1hJiZnPyhiLmNoaWxkPVVnKGIsYS5jaGlsZCxudWxsLGYpLGIuY2hpbGQ9VWcoYixudWxsLGgsZikpOlhpKGEsYixoLGYpO2IubWVtb2l6ZWRTdGF0ZT1kLnN0YXRlO2UmJmRnKGIsYywhMCk7cmV0dXJuIGIuY2hpbGR9ZnVuY3Rpb24ga2ooYSl7dmFyIGI9YS5zdGF0ZU5vZGU7Yi5wZW5kaW5nQ29udGV4dD9hZyhhLGIucGVuZGluZ0NvbnRleHQsYi5wZW5kaW5nQ29udGV4dCE9PWIuY29udGV4dCk6Yi5jb250ZXh0JiZhZyhhLGIuY29udGV4dCwhMSk7eWgoYSxiLmNvbnRhaW5lckluZm8pfVxuZnVuY3Rpb24gbGooYSxiLGMsZCxlKXtJZygpO0pnKGUpO2IuZmxhZ3N8PTI1NjtYaShhLGIsYyxkKTtyZXR1cm4gYi5jaGlsZH12YXIgbWo9e2RlaHlkcmF0ZWQ6bnVsbCx0cmVlQ29udGV4dDpudWxsLHJldHJ5TGFuZTowfTtmdW5jdGlvbiBuaihhKXtyZXR1cm57YmFzZUxhbmVzOmEsY2FjaGVQb29sOm51bGwsdHJhbnNpdGlvbnM6bnVsbH19XG5mdW5jdGlvbiBvaihhLGIsYyl7dmFyIGQ9Yi5wZW5kaW5nUHJvcHMsZT1MLmN1cnJlbnQsZj0hMSxnPTAhPT0oYi5mbGFncyYxMjgpLGg7KGg9Zyl8fChoPW51bGwhPT1hJiZudWxsPT09YS5tZW1vaXplZFN0YXRlPyExOjAhPT0oZSYyKSk7aWYoaClmPSEwLGIuZmxhZ3MmPS0xMjk7ZWxzZSBpZihudWxsPT09YXx8bnVsbCE9PWEubWVtb2l6ZWRTdGF0ZSllfD0xO0coTCxlJjEpO2lmKG51bGw9PT1hKXtFZyhiKTthPWIubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09YSYmKGE9YS5kZWh5ZHJhdGVkLG51bGwhPT1hKSlyZXR1cm4gMD09PShiLm1vZGUmMSk/Yi5sYW5lcz0xOlwiJCFcIj09PWEuZGF0YT9iLmxhbmVzPTg6Yi5sYW5lcz0xMDczNzQxODI0LG51bGw7Zz1kLmNoaWxkcmVuO2E9ZC5mYWxsYmFjaztyZXR1cm4gZj8oZD1iLm1vZGUsZj1iLmNoaWxkLGc9e21vZGU6XCJoaWRkZW5cIixjaGlsZHJlbjpnfSwwPT09KGQmMSkmJm51bGwhPT1mPyhmLmNoaWxkTGFuZXM9MCxmLnBlbmRpbmdQcm9wcz1cbmcpOmY9cGooZyxkLDAsbnVsbCksYT1UZyhhLGQsYyxudWxsKSxmLnJldHVybj1iLGEucmV0dXJuPWIsZi5zaWJsaW5nPWEsYi5jaGlsZD1mLGIuY2hpbGQubWVtb2l6ZWRTdGF0ZT1uaihjKSxiLm1lbW9pemVkU3RhdGU9bWosYSk6cWooYixnKX1lPWEubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09ZSYmKGg9ZS5kZWh5ZHJhdGVkLG51bGwhPT1oKSlyZXR1cm4gcmooYSxiLGcsZCxoLGUsYyk7aWYoZil7Zj1kLmZhbGxiYWNrO2c9Yi5tb2RlO2U9YS5jaGlsZDtoPWUuc2libGluZzt2YXIgaz17bW9kZTpcImhpZGRlblwiLGNoaWxkcmVuOmQuY2hpbGRyZW59OzA9PT0oZyYxKSYmYi5jaGlsZCE9PWU/KGQ9Yi5jaGlsZCxkLmNoaWxkTGFuZXM9MCxkLnBlbmRpbmdQcm9wcz1rLGIuZGVsZXRpb25zPW51bGwpOihkPVBnKGUsayksZC5zdWJ0cmVlRmxhZ3M9ZS5zdWJ0cmVlRmxhZ3MmMTQ2ODAwNjQpO251bGwhPT1oP2Y9UGcoaCxmKTooZj1UZyhmLGcsYyxudWxsKSxmLmZsYWdzfD0yKTtmLnJldHVybj1cbmI7ZC5yZXR1cm49YjtkLnNpYmxpbmc9ZjtiLmNoaWxkPWQ7ZD1mO2Y9Yi5jaGlsZDtnPWEuY2hpbGQubWVtb2l6ZWRTdGF0ZTtnPW51bGw9PT1nP25qKGMpOntiYXNlTGFuZXM6Zy5iYXNlTGFuZXN8YyxjYWNoZVBvb2w6bnVsbCx0cmFuc2l0aW9uczpnLnRyYW5zaXRpb25zfTtmLm1lbW9pemVkU3RhdGU9ZztmLmNoaWxkTGFuZXM9YS5jaGlsZExhbmVzJn5jO2IubWVtb2l6ZWRTdGF0ZT1tajtyZXR1cm4gZH1mPWEuY2hpbGQ7YT1mLnNpYmxpbmc7ZD1QZyhmLHttb2RlOlwidmlzaWJsZVwiLGNoaWxkcmVuOmQuY2hpbGRyZW59KTswPT09KGIubW9kZSYxKSYmKGQubGFuZXM9Yyk7ZC5yZXR1cm49YjtkLnNpYmxpbmc9bnVsbDtudWxsIT09YSYmKGM9Yi5kZWxldGlvbnMsbnVsbD09PWM/KGIuZGVsZXRpb25zPVthXSxiLmZsYWdzfD0xNik6Yy5wdXNoKGEpKTtiLmNoaWxkPWQ7Yi5tZW1vaXplZFN0YXRlPW51bGw7cmV0dXJuIGR9XG5mdW5jdGlvbiBxaihhLGIpe2I9cGooe21vZGU6XCJ2aXNpYmxlXCIsY2hpbGRyZW46Yn0sYS5tb2RlLDAsbnVsbCk7Yi5yZXR1cm49YTtyZXR1cm4gYS5jaGlsZD1ifWZ1bmN0aW9uIHNqKGEsYixjLGQpe251bGwhPT1kJiZKZyhkKTtVZyhiLGEuY2hpbGQsbnVsbCxjKTthPXFqKGIsYi5wZW5kaW5nUHJvcHMuY2hpbGRyZW4pO2EuZmxhZ3N8PTI7Yi5tZW1vaXplZFN0YXRlPW51bGw7cmV0dXJuIGF9XG5mdW5jdGlvbiByaihhLGIsYyxkLGUsZixnKXtpZihjKXtpZihiLmZsYWdzJjI1NilyZXR1cm4gYi5mbGFncyY9LTI1NyxkPUtpKEVycm9yKHAoNDIyKSkpLHNqKGEsYixnLGQpO2lmKG51bGwhPT1iLm1lbW9pemVkU3RhdGUpcmV0dXJuIGIuY2hpbGQ9YS5jaGlsZCxiLmZsYWdzfD0xMjgsbnVsbDtmPWQuZmFsbGJhY2s7ZT1iLm1vZGU7ZD1waih7bW9kZTpcInZpc2libGVcIixjaGlsZHJlbjpkLmNoaWxkcmVufSxlLDAsbnVsbCk7Zj1UZyhmLGUsZyxudWxsKTtmLmZsYWdzfD0yO2QucmV0dXJuPWI7Zi5yZXR1cm49YjtkLnNpYmxpbmc9ZjtiLmNoaWxkPWQ7MCE9PShiLm1vZGUmMSkmJlVnKGIsYS5jaGlsZCxudWxsLGcpO2IuY2hpbGQubWVtb2l6ZWRTdGF0ZT1uaihnKTtiLm1lbW9pemVkU3RhdGU9bWo7cmV0dXJuIGZ9aWYoMD09PShiLm1vZGUmMSkpcmV0dXJuIHNqKGEsYixnLG51bGwpO2lmKFwiJCFcIj09PWUuZGF0YSl7ZD1lLm5leHRTaWJsaW5nJiZlLm5leHRTaWJsaW5nLmRhdGFzZXQ7XG5pZihkKXZhciBoPWQuZGdzdDtkPWg7Zj1FcnJvcihwKDQxOSkpO2Q9S2koZixkLHZvaWQgMCk7cmV0dXJuIHNqKGEsYixnLGQpfWg9MCE9PShnJmEuY2hpbGRMYW5lcyk7aWYoZGh8fGgpe2Q9UTtpZihudWxsIT09ZCl7c3dpdGNoKGcmLWcpe2Nhc2UgNDplPTI7YnJlYWs7Y2FzZSAxNjplPTg7YnJlYWs7Y2FzZSA2NDpjYXNlIDEyODpjYXNlIDI1NjpjYXNlIDUxMjpjYXNlIDEwMjQ6Y2FzZSAyMDQ4OmNhc2UgNDA5NjpjYXNlIDgxOTI6Y2FzZSAxNjM4NDpjYXNlIDMyNzY4OmNhc2UgNjU1MzY6Y2FzZSAxMzEwNzI6Y2FzZSAyNjIxNDQ6Y2FzZSA1MjQyODg6Y2FzZSAxMDQ4NTc2OmNhc2UgMjA5NzE1MjpjYXNlIDQxOTQzMDQ6Y2FzZSA4Mzg4NjA4OmNhc2UgMTY3NzcyMTY6Y2FzZSAzMzU1NDQzMjpjYXNlIDY3MTA4ODY0OmU9MzI7YnJlYWs7Y2FzZSA1MzY4NzA5MTI6ZT0yNjg0MzU0NTY7YnJlYWs7ZGVmYXVsdDplPTB9ZT0wIT09KGUmKGQuc3VzcGVuZGVkTGFuZXN8ZykpPzA6ZTtcbjAhPT1lJiZlIT09Zi5yZXRyeUxhbmUmJihmLnJldHJ5TGFuZT1lLGloKGEsZSksZ2koZCxhLGUsLTEpKX10aigpO2Q9S2koRXJyb3IocCg0MjEpKSk7cmV0dXJuIHNqKGEsYixnLGQpfWlmKFwiJD9cIj09PWUuZGF0YSlyZXR1cm4gYi5mbGFnc3w9MTI4LGIuY2hpbGQ9YS5jaGlsZCxiPXVqLmJpbmQobnVsbCxhKSxlLl9yZWFjdFJldHJ5PWIsbnVsbDthPWYudHJlZUNvbnRleHQ7eWc9TGYoZS5uZXh0U2libGluZyk7eGc9YjtJPSEwO3pnPW51bGw7bnVsbCE9PWEmJihvZ1twZysrXT1yZyxvZ1twZysrXT1zZyxvZ1twZysrXT1xZyxyZz1hLmlkLHNnPWEub3ZlcmZsb3cscWc9Yik7Yj1xaihiLGQuY2hpbGRyZW4pO2IuZmxhZ3N8PTQwOTY7cmV0dXJuIGJ9ZnVuY3Rpb24gdmooYSxiLGMpe2EubGFuZXN8PWI7dmFyIGQ9YS5hbHRlcm5hdGU7bnVsbCE9PWQmJihkLmxhbmVzfD1iKTtiaChhLnJldHVybixiLGMpfVxuZnVuY3Rpb24gd2ooYSxiLGMsZCxlKXt2YXIgZj1hLm1lbW9pemVkU3RhdGU7bnVsbD09PWY/YS5tZW1vaXplZFN0YXRlPXtpc0JhY2t3YXJkczpiLHJlbmRlcmluZzpudWxsLHJlbmRlcmluZ1N0YXJ0VGltZTowLGxhc3Q6ZCx0YWlsOmMsdGFpbE1vZGU6ZX06KGYuaXNCYWNrd2FyZHM9YixmLnJlbmRlcmluZz1udWxsLGYucmVuZGVyaW5nU3RhcnRUaW1lPTAsZi5sYXN0PWQsZi50YWlsPWMsZi50YWlsTW9kZT1lKX1cbmZ1bmN0aW9uIHhqKGEsYixjKXt2YXIgZD1iLnBlbmRpbmdQcm9wcyxlPWQucmV2ZWFsT3JkZXIsZj1kLnRhaWw7WGkoYSxiLGQuY2hpbGRyZW4sYyk7ZD1MLmN1cnJlbnQ7aWYoMCE9PShkJjIpKWQ9ZCYxfDIsYi5mbGFnc3w9MTI4O2Vsc2V7aWYobnVsbCE9PWEmJjAhPT0oYS5mbGFncyYxMjgpKWE6Zm9yKGE9Yi5jaGlsZDtudWxsIT09YTspe2lmKDEzPT09YS50YWcpbnVsbCE9PWEubWVtb2l6ZWRTdGF0ZSYmdmooYSxjLGIpO2Vsc2UgaWYoMTk9PT1hLnRhZyl2aihhLGMsYik7ZWxzZSBpZihudWxsIT09YS5jaGlsZCl7YS5jaGlsZC5yZXR1cm49YTthPWEuY2hpbGQ7Y29udGludWV9aWYoYT09PWIpYnJlYWsgYTtmb3IoO251bGw9PT1hLnNpYmxpbmc7KXtpZihudWxsPT09YS5yZXR1cm58fGEucmV0dXJuPT09YilicmVhayBhO2E9YS5yZXR1cm59YS5zaWJsaW5nLnJldHVybj1hLnJldHVybjthPWEuc2libGluZ31kJj0xfUcoTCxkKTtpZigwPT09KGIubW9kZSYxKSliLm1lbW9pemVkU3RhdGU9XG5udWxsO2Vsc2Ugc3dpdGNoKGUpe2Nhc2UgXCJmb3J3YXJkc1wiOmM9Yi5jaGlsZDtmb3IoZT1udWxsO251bGwhPT1jOylhPWMuYWx0ZXJuYXRlLG51bGwhPT1hJiZudWxsPT09Q2goYSkmJihlPWMpLGM9Yy5zaWJsaW5nO2M9ZTtudWxsPT09Yz8oZT1iLmNoaWxkLGIuY2hpbGQ9bnVsbCk6KGU9Yy5zaWJsaW5nLGMuc2libGluZz1udWxsKTt3aihiLCExLGUsYyxmKTticmVhaztjYXNlIFwiYmFja3dhcmRzXCI6Yz1udWxsO2U9Yi5jaGlsZDtmb3IoYi5jaGlsZD1udWxsO251bGwhPT1lOyl7YT1lLmFsdGVybmF0ZTtpZihudWxsIT09YSYmbnVsbD09PUNoKGEpKXtiLmNoaWxkPWU7YnJlYWt9YT1lLnNpYmxpbmc7ZS5zaWJsaW5nPWM7Yz1lO2U9YX13aihiLCEwLGMsbnVsbCxmKTticmVhaztjYXNlIFwidG9nZXRoZXJcIjp3aihiLCExLG51bGwsbnVsbCx2b2lkIDApO2JyZWFrO2RlZmF1bHQ6Yi5tZW1vaXplZFN0YXRlPW51bGx9cmV0dXJuIGIuY2hpbGR9XG5mdW5jdGlvbiBpaihhLGIpezA9PT0oYi5tb2RlJjEpJiZudWxsIT09YSYmKGEuYWx0ZXJuYXRlPW51bGwsYi5hbHRlcm5hdGU9bnVsbCxiLmZsYWdzfD0yKX1mdW5jdGlvbiBaaShhLGIsYyl7bnVsbCE9PWEmJihiLmRlcGVuZGVuY2llcz1hLmRlcGVuZGVuY2llcyk7cmh8PWIubGFuZXM7aWYoMD09PShjJmIuY2hpbGRMYW5lcykpcmV0dXJuIG51bGw7aWYobnVsbCE9PWEmJmIuY2hpbGQhPT1hLmNoaWxkKXRocm93IEVycm9yKHAoMTUzKSk7aWYobnVsbCE9PWIuY2hpbGQpe2E9Yi5jaGlsZDtjPVBnKGEsYS5wZW5kaW5nUHJvcHMpO2IuY2hpbGQ9Yztmb3IoYy5yZXR1cm49YjtudWxsIT09YS5zaWJsaW5nOylhPWEuc2libGluZyxjPWMuc2libGluZz1QZyhhLGEucGVuZGluZ1Byb3BzKSxjLnJldHVybj1iO2Muc2libGluZz1udWxsfXJldHVybiBiLmNoaWxkfVxuZnVuY3Rpb24geWooYSxiLGMpe3N3aXRjaChiLnRhZyl7Y2FzZSAzOmtqKGIpO0lnKCk7YnJlYWs7Y2FzZSA1OkFoKGIpO2JyZWFrO2Nhc2UgMTpaZihiLnR5cGUpJiZjZyhiKTticmVhaztjYXNlIDQ6eWgoYixiLnN0YXRlTm9kZS5jb250YWluZXJJbmZvKTticmVhaztjYXNlIDEwOnZhciBkPWIudHlwZS5fY29udGV4dCxlPWIubWVtb2l6ZWRQcm9wcy52YWx1ZTtHKFdnLGQuX2N1cnJlbnRWYWx1ZSk7ZC5fY3VycmVudFZhbHVlPWU7YnJlYWs7Y2FzZSAxMzpkPWIubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09ZCl7aWYobnVsbCE9PWQuZGVoeWRyYXRlZClyZXR1cm4gRyhMLEwuY3VycmVudCYxKSxiLmZsYWdzfD0xMjgsbnVsbDtpZigwIT09KGMmYi5jaGlsZC5jaGlsZExhbmVzKSlyZXR1cm4gb2ooYSxiLGMpO0coTCxMLmN1cnJlbnQmMSk7YT1aaShhLGIsYyk7cmV0dXJuIG51bGwhPT1hP2Euc2libGluZzpudWxsfUcoTCxMLmN1cnJlbnQmMSk7YnJlYWs7Y2FzZSAxOTpkPTAhPT0oYyZcbmIuY2hpbGRMYW5lcyk7aWYoMCE9PShhLmZsYWdzJjEyOCkpe2lmKGQpcmV0dXJuIHhqKGEsYixjKTtiLmZsYWdzfD0xMjh9ZT1iLm1lbW9pemVkU3RhdGU7bnVsbCE9PWUmJihlLnJlbmRlcmluZz1udWxsLGUudGFpbD1udWxsLGUubGFzdEVmZmVjdD1udWxsKTtHKEwsTC5jdXJyZW50KTtpZihkKWJyZWFrO2Vsc2UgcmV0dXJuIG51bGw7Y2FzZSAyMjpjYXNlIDIzOnJldHVybiBiLmxhbmVzPTAsZGooYSxiLGMpfXJldHVybiBaaShhLGIsYyl9dmFyIHpqLEFqLEJqLENqO1xuemo9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9Yi5jaGlsZDtudWxsIT09Yzspe2lmKDU9PT1jLnRhZ3x8Nj09PWMudGFnKWEuYXBwZW5kQ2hpbGQoYy5zdGF0ZU5vZGUpO2Vsc2UgaWYoNCE9PWMudGFnJiZudWxsIT09Yy5jaGlsZCl7Yy5jaGlsZC5yZXR1cm49YztjPWMuY2hpbGQ7Y29udGludWV9aWYoYz09PWIpYnJlYWs7Zm9yKDtudWxsPT09Yy5zaWJsaW5nOyl7aWYobnVsbD09PWMucmV0dXJufHxjLnJldHVybj09PWIpcmV0dXJuO2M9Yy5yZXR1cm59Yy5zaWJsaW5nLnJldHVybj1jLnJldHVybjtjPWMuc2libGluZ319O0FqPWZ1bmN0aW9uKCl7fTtcbkJqPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEubWVtb2l6ZWRQcm9wcztpZihlIT09ZCl7YT1iLnN0YXRlTm9kZTt4aCh1aC5jdXJyZW50KTt2YXIgZj1udWxsO3N3aXRjaChjKXtjYXNlIFwiaW5wdXRcIjplPVlhKGEsZSk7ZD1ZYShhLGQpO2Y9W107YnJlYWs7Y2FzZSBcInNlbGVjdFwiOmU9QSh7fSxlLHt2YWx1ZTp2b2lkIDB9KTtkPUEoe30sZCx7dmFsdWU6dm9pZCAwfSk7Zj1bXTticmVhaztjYXNlIFwidGV4dGFyZWFcIjplPWdiKGEsZSk7ZD1nYihhLGQpO2Y9W107YnJlYWs7ZGVmYXVsdDpcImZ1bmN0aW9uXCIhPT10eXBlb2YgZS5vbkNsaWNrJiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgZC5vbkNsaWNrJiYoYS5vbmNsaWNrPUJmKX11YihjLGQpO3ZhciBnO2M9bnVsbDtmb3IobCBpbiBlKWlmKCFkLmhhc093blByb3BlcnR5KGwpJiZlLmhhc093blByb3BlcnR5KGwpJiZudWxsIT1lW2xdKWlmKFwic3R5bGVcIj09PWwpe3ZhciBoPWVbbF07Zm9yKGcgaW4gaCloLmhhc093blByb3BlcnR5KGcpJiZcbihjfHwoYz17fSksY1tnXT1cIlwiKX1lbHNlXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCYmXCJjaGlsZHJlblwiIT09bCYmXCJzdXBwcmVzc0NvbnRlbnRFZGl0YWJsZVdhcm5pbmdcIiE9PWwmJlwic3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nXCIhPT1sJiZcImF1dG9Gb2N1c1wiIT09bCYmKGVhLmhhc093blByb3BlcnR5KGwpP2Z8fChmPVtdKTooZj1mfHxbXSkucHVzaChsLG51bGwpKTtmb3IobCBpbiBkKXt2YXIgaz1kW2xdO2g9bnVsbCE9ZT9lW2xdOnZvaWQgMDtpZihkLmhhc093blByb3BlcnR5KGwpJiZrIT09aCYmKG51bGwhPWt8fG51bGwhPWgpKWlmKFwic3R5bGVcIj09PWwpaWYoaCl7Zm9yKGcgaW4gaCkhaC5oYXNPd25Qcm9wZXJ0eShnKXx8ayYmay5oYXNPd25Qcm9wZXJ0eShnKXx8KGN8fChjPXt9KSxjW2ddPVwiXCIpO2ZvcihnIGluIGspay5oYXNPd25Qcm9wZXJ0eShnKSYmaFtnXSE9PWtbZ10mJihjfHwoYz17fSksY1tnXT1rW2ddKX1lbHNlIGN8fChmfHwoZj1bXSksZi5wdXNoKGwsXG5jKSksYz1rO2Vsc2VcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCI9PT1sPyhrPWs/ay5fX2h0bWw6dm9pZCAwLGg9aD9oLl9faHRtbDp2b2lkIDAsbnVsbCE9ayYmaCE9PWsmJihmPWZ8fFtdKS5wdXNoKGwsaykpOlwiY2hpbGRyZW5cIj09PWw/XCJzdHJpbmdcIiE9PXR5cGVvZiBrJiZcIm51bWJlclwiIT09dHlwZW9mIGt8fChmPWZ8fFtdKS5wdXNoKGwsXCJcIitrKTpcInN1cHByZXNzQ29udGVudEVkaXRhYmxlV2FybmluZ1wiIT09bCYmXCJzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmdcIiE9PWwmJihlYS5oYXNPd25Qcm9wZXJ0eShsKT8obnVsbCE9ayYmXCJvblNjcm9sbFwiPT09bCYmRChcInNjcm9sbFwiLGEpLGZ8fGg9PT1rfHwoZj1bXSkpOihmPWZ8fFtdKS5wdXNoKGwsaykpfWMmJihmPWZ8fFtdKS5wdXNoKFwic3R5bGVcIixjKTt2YXIgbD1mO2lmKGIudXBkYXRlUXVldWU9bCliLmZsYWdzfD00fX07Q2o9ZnVuY3Rpb24oYSxiLGMsZCl7YyE9PWQmJihiLmZsYWdzfD00KX07XG5mdW5jdGlvbiBEaihhLGIpe2lmKCFJKXN3aXRjaChhLnRhaWxNb2RlKXtjYXNlIFwiaGlkZGVuXCI6Yj1hLnRhaWw7Zm9yKHZhciBjPW51bGw7bnVsbCE9PWI7KW51bGwhPT1iLmFsdGVybmF0ZSYmKGM9YiksYj1iLnNpYmxpbmc7bnVsbD09PWM/YS50YWlsPW51bGw6Yy5zaWJsaW5nPW51bGw7YnJlYWs7Y2FzZSBcImNvbGxhcHNlZFwiOmM9YS50YWlsO2Zvcih2YXIgZD1udWxsO251bGwhPT1jOyludWxsIT09Yy5hbHRlcm5hdGUmJihkPWMpLGM9Yy5zaWJsaW5nO251bGw9PT1kP2J8fG51bGw9PT1hLnRhaWw/YS50YWlsPW51bGw6YS50YWlsLnNpYmxpbmc9bnVsbDpkLnNpYmxpbmc9bnVsbH19XG5mdW5jdGlvbiBTKGEpe3ZhciBiPW51bGwhPT1hLmFsdGVybmF0ZSYmYS5hbHRlcm5hdGUuY2hpbGQ9PT1hLmNoaWxkLGM9MCxkPTA7aWYoYilmb3IodmFyIGU9YS5jaGlsZDtudWxsIT09ZTspY3w9ZS5sYW5lc3xlLmNoaWxkTGFuZXMsZHw9ZS5zdWJ0cmVlRmxhZ3MmMTQ2ODAwNjQsZHw9ZS5mbGFncyYxNDY4MDA2NCxlLnJldHVybj1hLGU9ZS5zaWJsaW5nO2Vsc2UgZm9yKGU9YS5jaGlsZDtudWxsIT09ZTspY3w9ZS5sYW5lc3xlLmNoaWxkTGFuZXMsZHw9ZS5zdWJ0cmVlRmxhZ3MsZHw9ZS5mbGFncyxlLnJldHVybj1hLGU9ZS5zaWJsaW5nO2Euc3VidHJlZUZsYWdzfD1kO2EuY2hpbGRMYW5lcz1jO3JldHVybiBifVxuZnVuY3Rpb24gRWooYSxiLGMpe3ZhciBkPWIucGVuZGluZ1Byb3BzO3dnKGIpO3N3aXRjaChiLnRhZyl7Y2FzZSAyOmNhc2UgMTY6Y2FzZSAxNTpjYXNlIDA6Y2FzZSAxMTpjYXNlIDc6Y2FzZSA4OmNhc2UgMTI6Y2FzZSA5OmNhc2UgMTQ6cmV0dXJuIFMoYiksbnVsbDtjYXNlIDE6cmV0dXJuIFpmKGIudHlwZSkmJiRmKCksUyhiKSxudWxsO2Nhc2UgMzpkPWIuc3RhdGVOb2RlO3poKCk7RShXZik7RShIKTtFaCgpO2QucGVuZGluZ0NvbnRleHQmJihkLmNvbnRleHQ9ZC5wZW5kaW5nQ29udGV4dCxkLnBlbmRpbmdDb250ZXh0PW51bGwpO2lmKG51bGw9PT1hfHxudWxsPT09YS5jaGlsZClHZyhiKT9iLmZsYWdzfD00Om51bGw9PT1hfHxhLm1lbW9pemVkU3RhdGUuaXNEZWh5ZHJhdGVkJiYwPT09KGIuZmxhZ3MmMjU2KXx8KGIuZmxhZ3N8PTEwMjQsbnVsbCE9PXpnJiYoRmooemcpLHpnPW51bGwpKTtBaihhLGIpO1MoYik7cmV0dXJuIG51bGw7Y2FzZSA1OkJoKGIpO3ZhciBlPXhoKHdoLmN1cnJlbnQpO1xuYz1iLnR5cGU7aWYobnVsbCE9PWEmJm51bGwhPWIuc3RhdGVOb2RlKUJqKGEsYixjLGQsZSksYS5yZWYhPT1iLnJlZiYmKGIuZmxhZ3N8PTUxMixiLmZsYWdzfD0yMDk3MTUyKTtlbHNle2lmKCFkKXtpZihudWxsPT09Yi5zdGF0ZU5vZGUpdGhyb3cgRXJyb3IocCgxNjYpKTtTKGIpO3JldHVybiBudWxsfWE9eGgodWguY3VycmVudCk7aWYoR2coYikpe2Q9Yi5zdGF0ZU5vZGU7Yz1iLnR5cGU7dmFyIGY9Yi5tZW1vaXplZFByb3BzO2RbT2ZdPWI7ZFtQZl09ZjthPTAhPT0oYi5tb2RlJjEpO3N3aXRjaChjKXtjYXNlIFwiZGlhbG9nXCI6RChcImNhbmNlbFwiLGQpO0QoXCJjbG9zZVwiLGQpO2JyZWFrO2Nhc2UgXCJpZnJhbWVcIjpjYXNlIFwib2JqZWN0XCI6Y2FzZSBcImVtYmVkXCI6RChcImxvYWRcIixkKTticmVhaztjYXNlIFwidmlkZW9cIjpjYXNlIFwiYXVkaW9cIjpmb3IoZT0wO2U8bGYubGVuZ3RoO2UrKylEKGxmW2VdLGQpO2JyZWFrO2Nhc2UgXCJzb3VyY2VcIjpEKFwiZXJyb3JcIixkKTticmVhaztjYXNlIFwiaW1nXCI6Y2FzZSBcImltYWdlXCI6Y2FzZSBcImxpbmtcIjpEKFwiZXJyb3JcIixcbmQpO0QoXCJsb2FkXCIsZCk7YnJlYWs7Y2FzZSBcImRldGFpbHNcIjpEKFwidG9nZ2xlXCIsZCk7YnJlYWs7Y2FzZSBcImlucHV0XCI6WmEoZCxmKTtEKFwiaW52YWxpZFwiLGQpO2JyZWFrO2Nhc2UgXCJzZWxlY3RcIjpkLl93cmFwcGVyU3RhdGU9e3dhc011bHRpcGxlOiEhZi5tdWx0aXBsZX07RChcImludmFsaWRcIixkKTticmVhaztjYXNlIFwidGV4dGFyZWFcIjpoYihkLGYpLEQoXCJpbnZhbGlkXCIsZCl9dWIoYyxmKTtlPW51bGw7Zm9yKHZhciBnIGluIGYpaWYoZi5oYXNPd25Qcm9wZXJ0eShnKSl7dmFyIGg9ZltnXTtcImNoaWxkcmVuXCI9PT1nP1wic3RyaW5nXCI9PT10eXBlb2YgaD9kLnRleHRDb250ZW50IT09aCYmKCEwIT09Zi5zdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmcmJkFmKGQudGV4dENvbnRlbnQsaCxhKSxlPVtcImNoaWxkcmVuXCIsaF0pOlwibnVtYmVyXCI9PT10eXBlb2YgaCYmZC50ZXh0Q29udGVudCE9PVwiXCIraCYmKCEwIT09Zi5zdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmcmJkFmKGQudGV4dENvbnRlbnQsXG5oLGEpLGU9W1wiY2hpbGRyZW5cIixcIlwiK2hdKTplYS5oYXNPd25Qcm9wZXJ0eShnKSYmbnVsbCE9aCYmXCJvblNjcm9sbFwiPT09ZyYmRChcInNjcm9sbFwiLGQpfXN3aXRjaChjKXtjYXNlIFwiaW5wdXRcIjpWYShkKTtkYihkLGYsITApO2JyZWFrO2Nhc2UgXCJ0ZXh0YXJlYVwiOlZhKGQpO2piKGQpO2JyZWFrO2Nhc2UgXCJzZWxlY3RcIjpjYXNlIFwib3B0aW9uXCI6YnJlYWs7ZGVmYXVsdDpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZi5vbkNsaWNrJiYoZC5vbmNsaWNrPUJmKX1kPWU7Yi51cGRhdGVRdWV1ZT1kO251bGwhPT1kJiYoYi5mbGFnc3w9NCl9ZWxzZXtnPTk9PT1lLm5vZGVUeXBlP2U6ZS5vd25lckRvY3VtZW50O1wiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiPT09YSYmKGE9a2IoYykpO1wiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiPT09YT9cInNjcmlwdFwiPT09Yz8oYT1nLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksYS5pbm5lckhUTUw9XCI8c2NyaXB0PlxceDNjL3NjcmlwdD5cIixhPWEucmVtb3ZlQ2hpbGQoYS5maXJzdENoaWxkKSk6XG5cInN0cmluZ1wiPT09dHlwZW9mIGQuaXM/YT1nLmNyZWF0ZUVsZW1lbnQoYyx7aXM6ZC5pc30pOihhPWcuY3JlYXRlRWxlbWVudChjKSxcInNlbGVjdFwiPT09YyYmKGc9YSxkLm11bHRpcGxlP2cubXVsdGlwbGU9ITA6ZC5zaXplJiYoZy5zaXplPWQuc2l6ZSkpKTphPWcuY3JlYXRlRWxlbWVudE5TKGEsYyk7YVtPZl09YjthW1BmXT1kO3pqKGEsYiwhMSwhMSk7Yi5zdGF0ZU5vZGU9YTthOntnPXZiKGMsZCk7c3dpdGNoKGMpe2Nhc2UgXCJkaWFsb2dcIjpEKFwiY2FuY2VsXCIsYSk7RChcImNsb3NlXCIsYSk7ZT1kO2JyZWFrO2Nhc2UgXCJpZnJhbWVcIjpjYXNlIFwib2JqZWN0XCI6Y2FzZSBcImVtYmVkXCI6RChcImxvYWRcIixhKTtlPWQ7YnJlYWs7Y2FzZSBcInZpZGVvXCI6Y2FzZSBcImF1ZGlvXCI6Zm9yKGU9MDtlPGxmLmxlbmd0aDtlKyspRChsZltlXSxhKTtlPWQ7YnJlYWs7Y2FzZSBcInNvdXJjZVwiOkQoXCJlcnJvclwiLGEpO2U9ZDticmVhaztjYXNlIFwiaW1nXCI6Y2FzZSBcImltYWdlXCI6Y2FzZSBcImxpbmtcIjpEKFwiZXJyb3JcIixcbmEpO0QoXCJsb2FkXCIsYSk7ZT1kO2JyZWFrO2Nhc2UgXCJkZXRhaWxzXCI6RChcInRvZ2dsZVwiLGEpO2U9ZDticmVhaztjYXNlIFwiaW5wdXRcIjpaYShhLGQpO2U9WWEoYSxkKTtEKFwiaW52YWxpZFwiLGEpO2JyZWFrO2Nhc2UgXCJvcHRpb25cIjplPWQ7YnJlYWs7Y2FzZSBcInNlbGVjdFwiOmEuX3dyYXBwZXJTdGF0ZT17d2FzTXVsdGlwbGU6ISFkLm11bHRpcGxlfTtlPUEoe30sZCx7dmFsdWU6dm9pZCAwfSk7RChcImludmFsaWRcIixhKTticmVhaztjYXNlIFwidGV4dGFyZWFcIjpoYihhLGQpO2U9Z2IoYSxkKTtEKFwiaW52YWxpZFwiLGEpO2JyZWFrO2RlZmF1bHQ6ZT1kfXViKGMsZSk7aD1lO2ZvcihmIGluIGgpaWYoaC5oYXNPd25Qcm9wZXJ0eShmKSl7dmFyIGs9aFtmXTtcInN0eWxlXCI9PT1mP3NiKGEsayk6XCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiPT09Zj8oaz1rP2suX19odG1sOnZvaWQgMCxudWxsIT1rJiZuYihhLGspKTpcImNoaWxkcmVuXCI9PT1mP1wic3RyaW5nXCI9PT10eXBlb2Ygaz8oXCJ0ZXh0YXJlYVwiIT09XG5jfHxcIlwiIT09aykmJm9iKGEsayk6XCJudW1iZXJcIj09PXR5cGVvZiBrJiZvYihhLFwiXCIrayk6XCJzdXBwcmVzc0NvbnRlbnRFZGl0YWJsZVdhcm5pbmdcIiE9PWYmJlwic3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nXCIhPT1mJiZcImF1dG9Gb2N1c1wiIT09ZiYmKGVhLmhhc093blByb3BlcnR5KGYpP251bGwhPWsmJlwib25TY3JvbGxcIj09PWYmJkQoXCJzY3JvbGxcIixhKTpudWxsIT1rJiZ0YShhLGYsayxnKSl9c3dpdGNoKGMpe2Nhc2UgXCJpbnB1dFwiOlZhKGEpO2RiKGEsZCwhMSk7YnJlYWs7Y2FzZSBcInRleHRhcmVhXCI6VmEoYSk7amIoYSk7YnJlYWs7Y2FzZSBcIm9wdGlvblwiOm51bGwhPWQudmFsdWUmJmEuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIlwiK1NhKGQudmFsdWUpKTticmVhaztjYXNlIFwic2VsZWN0XCI6YS5tdWx0aXBsZT0hIWQubXVsdGlwbGU7Zj1kLnZhbHVlO251bGwhPWY/ZmIoYSwhIWQubXVsdGlwbGUsZiwhMSk6bnVsbCE9ZC5kZWZhdWx0VmFsdWUmJmZiKGEsISFkLm11bHRpcGxlLGQuZGVmYXVsdFZhbHVlLFxuITApO2JyZWFrO2RlZmF1bHQ6XCJmdW5jdGlvblwiPT09dHlwZW9mIGUub25DbGljayYmKGEub25jbGljaz1CZil9c3dpdGNoKGMpe2Nhc2UgXCJidXR0b25cIjpjYXNlIFwiaW5wdXRcIjpjYXNlIFwic2VsZWN0XCI6Y2FzZSBcInRleHRhcmVhXCI6ZD0hIWQuYXV0b0ZvY3VzO2JyZWFrIGE7Y2FzZSBcImltZ1wiOmQ9ITA7YnJlYWsgYTtkZWZhdWx0OmQ9ITF9fWQmJihiLmZsYWdzfD00KX1udWxsIT09Yi5yZWYmJihiLmZsYWdzfD01MTIsYi5mbGFnc3w9MjA5NzE1Mil9UyhiKTtyZXR1cm4gbnVsbDtjYXNlIDY6aWYoYSYmbnVsbCE9Yi5zdGF0ZU5vZGUpQ2ooYSxiLGEubWVtb2l6ZWRQcm9wcyxkKTtlbHNle2lmKFwic3RyaW5nXCIhPT10eXBlb2YgZCYmbnVsbD09PWIuc3RhdGVOb2RlKXRocm93IEVycm9yKHAoMTY2KSk7Yz14aCh3aC5jdXJyZW50KTt4aCh1aC5jdXJyZW50KTtpZihHZyhiKSl7ZD1iLnN0YXRlTm9kZTtjPWIubWVtb2l6ZWRQcm9wcztkW09mXT1iO2lmKGY9ZC5ub2RlVmFsdWUhPT1jKWlmKGE9XG54ZyxudWxsIT09YSlzd2l0Y2goYS50YWcpe2Nhc2UgMzpBZihkLm5vZGVWYWx1ZSxjLDAhPT0oYS5tb2RlJjEpKTticmVhaztjYXNlIDU6ITAhPT1hLm1lbW9pemVkUHJvcHMuc3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nJiZBZihkLm5vZGVWYWx1ZSxjLDAhPT0oYS5tb2RlJjEpKX1mJiYoYi5mbGFnc3w9NCl9ZWxzZSBkPSg5PT09Yy5ub2RlVHlwZT9jOmMub3duZXJEb2N1bWVudCkuY3JlYXRlVGV4dE5vZGUoZCksZFtPZl09YixiLnN0YXRlTm9kZT1kfVMoYik7cmV0dXJuIG51bGw7Y2FzZSAxMzpFKEwpO2Q9Yi5tZW1vaXplZFN0YXRlO2lmKG51bGw9PT1hfHxudWxsIT09YS5tZW1vaXplZFN0YXRlJiZudWxsIT09YS5tZW1vaXplZFN0YXRlLmRlaHlkcmF0ZWQpe2lmKEkmJm51bGwhPT15ZyYmMCE9PShiLm1vZGUmMSkmJjA9PT0oYi5mbGFncyYxMjgpKUhnKCksSWcoKSxiLmZsYWdzfD05ODU2MCxmPSExO2Vsc2UgaWYoZj1HZyhiKSxudWxsIT09ZCYmbnVsbCE9PWQuZGVoeWRyYXRlZCl7aWYobnVsbD09PVxuYSl7aWYoIWYpdGhyb3cgRXJyb3IocCgzMTgpKTtmPWIubWVtb2l6ZWRTdGF0ZTtmPW51bGwhPT1mP2YuZGVoeWRyYXRlZDpudWxsO2lmKCFmKXRocm93IEVycm9yKHAoMzE3KSk7ZltPZl09Yn1lbHNlIElnKCksMD09PShiLmZsYWdzJjEyOCkmJihiLm1lbW9pemVkU3RhdGU9bnVsbCksYi5mbGFnc3w9NDtTKGIpO2Y9ITF9ZWxzZSBudWxsIT09emcmJihGaih6Zyksemc9bnVsbCksZj0hMDtpZighZilyZXR1cm4gYi5mbGFncyY2NTUzNj9iOm51bGx9aWYoMCE9PShiLmZsYWdzJjEyOCkpcmV0dXJuIGIubGFuZXM9YyxiO2Q9bnVsbCE9PWQ7ZCE9PShudWxsIT09YSYmbnVsbCE9PWEubWVtb2l6ZWRTdGF0ZSkmJmQmJihiLmNoaWxkLmZsYWdzfD04MTkyLDAhPT0oYi5tb2RlJjEpJiYobnVsbD09PWF8fDAhPT0oTC5jdXJyZW50JjEpPzA9PT1UJiYoVD0zKTp0aigpKSk7bnVsbCE9PWIudXBkYXRlUXVldWUmJihiLmZsYWdzfD00KTtTKGIpO3JldHVybiBudWxsO2Nhc2UgNDpyZXR1cm4gemgoKSxcbkFqKGEsYiksbnVsbD09PWEmJnNmKGIuc3RhdGVOb2RlLmNvbnRhaW5lckluZm8pLFMoYiksbnVsbDtjYXNlIDEwOnJldHVybiBhaChiLnR5cGUuX2NvbnRleHQpLFMoYiksbnVsbDtjYXNlIDE3OnJldHVybiBaZihiLnR5cGUpJiYkZigpLFMoYiksbnVsbDtjYXNlIDE5OkUoTCk7Zj1iLm1lbW9pemVkU3RhdGU7aWYobnVsbD09PWYpcmV0dXJuIFMoYiksbnVsbDtkPTAhPT0oYi5mbGFncyYxMjgpO2c9Zi5yZW5kZXJpbmc7aWYobnVsbD09PWcpaWYoZClEaihmLCExKTtlbHNle2lmKDAhPT1UfHxudWxsIT09YSYmMCE9PShhLmZsYWdzJjEyOCkpZm9yKGE9Yi5jaGlsZDtudWxsIT09YTspe2c9Q2goYSk7aWYobnVsbCE9PWcpe2IuZmxhZ3N8PTEyODtEaihmLCExKTtkPWcudXBkYXRlUXVldWU7bnVsbCE9PWQmJihiLnVwZGF0ZVF1ZXVlPWQsYi5mbGFnc3w9NCk7Yi5zdWJ0cmVlRmxhZ3M9MDtkPWM7Zm9yKGM9Yi5jaGlsZDtudWxsIT09YzspZj1jLGE9ZCxmLmZsYWdzJj0xNDY4MDA2Nixcbmc9Zi5hbHRlcm5hdGUsbnVsbD09PWc/KGYuY2hpbGRMYW5lcz0wLGYubGFuZXM9YSxmLmNoaWxkPW51bGwsZi5zdWJ0cmVlRmxhZ3M9MCxmLm1lbW9pemVkUHJvcHM9bnVsbCxmLm1lbW9pemVkU3RhdGU9bnVsbCxmLnVwZGF0ZVF1ZXVlPW51bGwsZi5kZXBlbmRlbmNpZXM9bnVsbCxmLnN0YXRlTm9kZT1udWxsKTooZi5jaGlsZExhbmVzPWcuY2hpbGRMYW5lcyxmLmxhbmVzPWcubGFuZXMsZi5jaGlsZD1nLmNoaWxkLGYuc3VidHJlZUZsYWdzPTAsZi5kZWxldGlvbnM9bnVsbCxmLm1lbW9pemVkUHJvcHM9Zy5tZW1vaXplZFByb3BzLGYubWVtb2l6ZWRTdGF0ZT1nLm1lbW9pemVkU3RhdGUsZi51cGRhdGVRdWV1ZT1nLnVwZGF0ZVF1ZXVlLGYudHlwZT1nLnR5cGUsYT1nLmRlcGVuZGVuY2llcyxmLmRlcGVuZGVuY2llcz1udWxsPT09YT9udWxsOntsYW5lczphLmxhbmVzLGZpcnN0Q29udGV4dDphLmZpcnN0Q29udGV4dH0pLGM9Yy5zaWJsaW5nO0coTCxMLmN1cnJlbnQmMXwyKTtyZXR1cm4gYi5jaGlsZH1hPVxuYS5zaWJsaW5nfW51bGwhPT1mLnRhaWwmJkIoKT5HaiYmKGIuZmxhZ3N8PTEyOCxkPSEwLERqKGYsITEpLGIubGFuZXM9NDE5NDMwNCl9ZWxzZXtpZighZClpZihhPUNoKGcpLG51bGwhPT1hKXtpZihiLmZsYWdzfD0xMjgsZD0hMCxjPWEudXBkYXRlUXVldWUsbnVsbCE9PWMmJihiLnVwZGF0ZVF1ZXVlPWMsYi5mbGFnc3w9NCksRGooZiwhMCksbnVsbD09PWYudGFpbCYmXCJoaWRkZW5cIj09PWYudGFpbE1vZGUmJiFnLmFsdGVybmF0ZSYmIUkpcmV0dXJuIFMoYiksbnVsbH1lbHNlIDIqQigpLWYucmVuZGVyaW5nU3RhcnRUaW1lPkdqJiYxMDczNzQxODI0IT09YyYmKGIuZmxhZ3N8PTEyOCxkPSEwLERqKGYsITEpLGIubGFuZXM9NDE5NDMwNCk7Zi5pc0JhY2t3YXJkcz8oZy5zaWJsaW5nPWIuY2hpbGQsYi5jaGlsZD1nKTooYz1mLmxhc3QsbnVsbCE9PWM/Yy5zaWJsaW5nPWc6Yi5jaGlsZD1nLGYubGFzdD1nKX1pZihudWxsIT09Zi50YWlsKXJldHVybiBiPWYudGFpbCxmLnJlbmRlcmluZz1cbmIsZi50YWlsPWIuc2libGluZyxmLnJlbmRlcmluZ1N0YXJ0VGltZT1CKCksYi5zaWJsaW5nPW51bGwsYz1MLmN1cnJlbnQsRyhMLGQ/YyYxfDI6YyYxKSxiO1MoYik7cmV0dXJuIG51bGw7Y2FzZSAyMjpjYXNlIDIzOnJldHVybiBIaigpLGQ9bnVsbCE9PWIubWVtb2l6ZWRTdGF0ZSxudWxsIT09YSYmbnVsbCE9PWEubWVtb2l6ZWRTdGF0ZSE9PWQmJihiLmZsYWdzfD04MTkyKSxkJiYwIT09KGIubW9kZSYxKT8wIT09KGZqJjEwNzM3NDE4MjQpJiYoUyhiKSxiLnN1YnRyZWVGbGFncyY2JiYoYi5mbGFnc3w9ODE5MikpOlMoYiksbnVsbDtjYXNlIDI0OnJldHVybiBudWxsO2Nhc2UgMjU6cmV0dXJuIG51bGx9dGhyb3cgRXJyb3IocCgxNTYsYi50YWcpKTt9XG5mdW5jdGlvbiBJaihhLGIpe3dnKGIpO3N3aXRjaChiLnRhZyl7Y2FzZSAxOnJldHVybiBaZihiLnR5cGUpJiYkZigpLGE9Yi5mbGFncyxhJjY1NTM2PyhiLmZsYWdzPWEmLTY1NTM3fDEyOCxiKTpudWxsO2Nhc2UgMzpyZXR1cm4gemgoKSxFKFdmKSxFKEgpLEVoKCksYT1iLmZsYWdzLDAhPT0oYSY2NTUzNikmJjA9PT0oYSYxMjgpPyhiLmZsYWdzPWEmLTY1NTM3fDEyOCxiKTpudWxsO2Nhc2UgNTpyZXR1cm4gQmgoYiksbnVsbDtjYXNlIDEzOkUoTCk7YT1iLm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PWEmJm51bGwhPT1hLmRlaHlkcmF0ZWQpe2lmKG51bGw9PT1iLmFsdGVybmF0ZSl0aHJvdyBFcnJvcihwKDM0MCkpO0lnKCl9YT1iLmZsYWdzO3JldHVybiBhJjY1NTM2PyhiLmZsYWdzPWEmLTY1NTM3fDEyOCxiKTpudWxsO2Nhc2UgMTk6cmV0dXJuIEUoTCksbnVsbDtjYXNlIDQ6cmV0dXJuIHpoKCksbnVsbDtjYXNlIDEwOnJldHVybiBhaChiLnR5cGUuX2NvbnRleHQpLG51bGw7Y2FzZSAyMjpjYXNlIDIzOnJldHVybiBIaigpLFxubnVsbDtjYXNlIDI0OnJldHVybiBudWxsO2RlZmF1bHQ6cmV0dXJuIG51bGx9fXZhciBKaj0hMSxVPSExLEtqPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBXZWFrU2V0P1dlYWtTZXQ6U2V0LFY9bnVsbDtmdW5jdGlvbiBMaihhLGIpe3ZhciBjPWEucmVmO2lmKG51bGwhPT1jKWlmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBjKXRyeXtjKG51bGwpfWNhdGNoKGQpe1coYSxiLGQpfWVsc2UgYy5jdXJyZW50PW51bGx9ZnVuY3Rpb24gTWooYSxiLGMpe3RyeXtjKCl9Y2F0Y2goZCl7VyhhLGIsZCl9fXZhciBOaj0hMTtcbmZ1bmN0aW9uIE9qKGEsYil7Q2Y9ZGQ7YT1NZSgpO2lmKE5lKGEpKXtpZihcInNlbGVjdGlvblN0YXJ0XCJpbiBhKXZhciBjPXtzdGFydDphLnNlbGVjdGlvblN0YXJ0LGVuZDphLnNlbGVjdGlvbkVuZH07ZWxzZSBhOntjPShjPWEub3duZXJEb2N1bWVudCkmJmMuZGVmYXVsdFZpZXd8fHdpbmRvdzt2YXIgZD1jLmdldFNlbGVjdGlvbiYmYy5nZXRTZWxlY3Rpb24oKTtpZihkJiYwIT09ZC5yYW5nZUNvdW50KXtjPWQuYW5jaG9yTm9kZTt2YXIgZT1kLmFuY2hvck9mZnNldCxmPWQuZm9jdXNOb2RlO2Q9ZC5mb2N1c09mZnNldDt0cnl7Yy5ub2RlVHlwZSxmLm5vZGVUeXBlfWNhdGNoKEYpe2M9bnVsbDticmVhayBhfXZhciBnPTAsaD0tMSxrPS0xLGw9MCxtPTAscT1hLHI9bnVsbDtiOmZvcig7Oyl7Zm9yKHZhciB5Ozspe3EhPT1jfHwwIT09ZSYmMyE9PXEubm9kZVR5cGV8fChoPWcrZSk7cSE9PWZ8fDAhPT1kJiYzIT09cS5ub2RlVHlwZXx8KGs9ZytkKTszPT09cS5ub2RlVHlwZSYmKGcrPVxucS5ub2RlVmFsdWUubGVuZ3RoKTtpZihudWxsPT09KHk9cS5maXJzdENoaWxkKSlicmVhaztyPXE7cT15fWZvcig7Oyl7aWYocT09PWEpYnJlYWsgYjtyPT09YyYmKytsPT09ZSYmKGg9Zyk7cj09PWYmJisrbT09PWQmJihrPWcpO2lmKG51bGwhPT0oeT1xLm5leHRTaWJsaW5nKSlicmVhaztxPXI7cj1xLnBhcmVudE5vZGV9cT15fWM9LTE9PT1ofHwtMT09PWs/bnVsbDp7c3RhcnQ6aCxlbmQ6a319ZWxzZSBjPW51bGx9Yz1jfHx7c3RhcnQ6MCxlbmQ6MH19ZWxzZSBjPW51bGw7RGY9e2ZvY3VzZWRFbGVtOmEsc2VsZWN0aW9uUmFuZ2U6Y307ZGQ9ITE7Zm9yKFY9YjtudWxsIT09VjspaWYoYj1WLGE9Yi5jaGlsZCwwIT09KGIuc3VidHJlZUZsYWdzJjEwMjgpJiZudWxsIT09YSlhLnJldHVybj1iLFY9YTtlbHNlIGZvcig7bnVsbCE9PVY7KXtiPVY7dHJ5e3ZhciBuPWIuYWx0ZXJuYXRlO2lmKDAhPT0oYi5mbGFncyYxMDI0KSlzd2l0Y2goYi50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTU6YnJlYWs7XG5jYXNlIDE6aWYobnVsbCE9PW4pe3ZhciB0PW4ubWVtb2l6ZWRQcm9wcyxKPW4ubWVtb2l6ZWRTdGF0ZSx4PWIuc3RhdGVOb2RlLHc9eC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShiLmVsZW1lbnRUeXBlPT09Yi50eXBlP3Q6Q2koYi50eXBlLHQpLEopO3guX19yZWFjdEludGVybmFsU25hcHNob3RCZWZvcmVVcGRhdGU9d31icmVhaztjYXNlIDM6dmFyIHU9Yi5zdGF0ZU5vZGUuY29udGFpbmVySW5mbzsxPT09dS5ub2RlVHlwZT91LnRleHRDb250ZW50PVwiXCI6OT09PXUubm9kZVR5cGUmJnUuZG9jdW1lbnRFbGVtZW50JiZ1LnJlbW92ZUNoaWxkKHUuZG9jdW1lbnRFbGVtZW50KTticmVhaztjYXNlIDU6Y2FzZSA2OmNhc2UgNDpjYXNlIDE3OmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IocCgxNjMpKTt9fWNhdGNoKEYpe1coYixiLnJldHVybixGKX1hPWIuc2libGluZztpZihudWxsIT09YSl7YS5yZXR1cm49Yi5yZXR1cm47Vj1hO2JyZWFrfVY9Yi5yZXR1cm59bj1OajtOaj0hMTtyZXR1cm4gbn1cbmZ1bmN0aW9uIFBqKGEsYixjKXt2YXIgZD1iLnVwZGF0ZVF1ZXVlO2Q9bnVsbCE9PWQ/ZC5sYXN0RWZmZWN0Om51bGw7aWYobnVsbCE9PWQpe3ZhciBlPWQ9ZC5uZXh0O2Rve2lmKChlLnRhZyZhKT09PWEpe3ZhciBmPWUuZGVzdHJveTtlLmRlc3Ryb3k9dm9pZCAwO3ZvaWQgMCE9PWYmJk1qKGIsYyxmKX1lPWUubmV4dH13aGlsZShlIT09ZCl9fWZ1bmN0aW9uIFFqKGEsYil7Yj1iLnVwZGF0ZVF1ZXVlO2I9bnVsbCE9PWI/Yi5sYXN0RWZmZWN0Om51bGw7aWYobnVsbCE9PWIpe3ZhciBjPWI9Yi5uZXh0O2Rve2lmKChjLnRhZyZhKT09PWEpe3ZhciBkPWMuY3JlYXRlO2MuZGVzdHJveT1kKCl9Yz1jLm5leHR9d2hpbGUoYyE9PWIpfX1mdW5jdGlvbiBSaihhKXt2YXIgYj1hLnJlZjtpZihudWxsIT09Yil7dmFyIGM9YS5zdGF0ZU5vZGU7c3dpdGNoKGEudGFnKXtjYXNlIDU6YT1jO2JyZWFrO2RlZmF1bHQ6YT1jfVwiZnVuY3Rpb25cIj09PXR5cGVvZiBiP2IoYSk6Yi5jdXJyZW50PWF9fVxuZnVuY3Rpb24gU2ooYSl7dmFyIGI9YS5hbHRlcm5hdGU7bnVsbCE9PWImJihhLmFsdGVybmF0ZT1udWxsLFNqKGIpKTthLmNoaWxkPW51bGw7YS5kZWxldGlvbnM9bnVsbDthLnNpYmxpbmc9bnVsbDs1PT09YS50YWcmJihiPWEuc3RhdGVOb2RlLG51bGwhPT1iJiYoZGVsZXRlIGJbT2ZdLGRlbGV0ZSBiW1BmXSxkZWxldGUgYltvZl0sZGVsZXRlIGJbUWZdLGRlbGV0ZSBiW1JmXSkpO2Euc3RhdGVOb2RlPW51bGw7YS5yZXR1cm49bnVsbDthLmRlcGVuZGVuY2llcz1udWxsO2EubWVtb2l6ZWRQcm9wcz1udWxsO2EubWVtb2l6ZWRTdGF0ZT1udWxsO2EucGVuZGluZ1Byb3BzPW51bGw7YS5zdGF0ZU5vZGU9bnVsbDthLnVwZGF0ZVF1ZXVlPW51bGx9ZnVuY3Rpb24gVGooYSl7cmV0dXJuIDU9PT1hLnRhZ3x8Mz09PWEudGFnfHw0PT09YS50YWd9XG5mdW5jdGlvbiBVaihhKXthOmZvcig7Oyl7Zm9yKDtudWxsPT09YS5zaWJsaW5nOyl7aWYobnVsbD09PWEucmV0dXJufHxUaihhLnJldHVybikpcmV0dXJuIG51bGw7YT1hLnJldHVybn1hLnNpYmxpbmcucmV0dXJuPWEucmV0dXJuO2ZvcihhPWEuc2libGluZzs1IT09YS50YWcmJjYhPT1hLnRhZyYmMTghPT1hLnRhZzspe2lmKGEuZmxhZ3MmMiljb250aW51ZSBhO2lmKG51bGw9PT1hLmNoaWxkfHw0PT09YS50YWcpY29udGludWUgYTtlbHNlIGEuY2hpbGQucmV0dXJuPWEsYT1hLmNoaWxkfWlmKCEoYS5mbGFncyYyKSlyZXR1cm4gYS5zdGF0ZU5vZGV9fVxuZnVuY3Rpb24gVmooYSxiLGMpe3ZhciBkPWEudGFnO2lmKDU9PT1kfHw2PT09ZClhPWEuc3RhdGVOb2RlLGI/OD09PWMubm9kZVR5cGU/Yy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLGIpOmMuaW5zZXJ0QmVmb3JlKGEsYik6KDg9PT1jLm5vZGVUeXBlPyhiPWMucGFyZW50Tm9kZSxiLmluc2VydEJlZm9yZShhLGMpKTooYj1jLGIuYXBwZW5kQ2hpbGQoYSkpLGM9Yy5fcmVhY3RSb290Q29udGFpbmVyLG51bGwhPT1jJiZ2b2lkIDAhPT1jfHxudWxsIT09Yi5vbmNsaWNrfHwoYi5vbmNsaWNrPUJmKSk7ZWxzZSBpZig0IT09ZCYmKGE9YS5jaGlsZCxudWxsIT09YSkpZm9yKFZqKGEsYixjKSxhPWEuc2libGluZztudWxsIT09YTspVmooYSxiLGMpLGE9YS5zaWJsaW5nfVxuZnVuY3Rpb24gV2ooYSxiLGMpe3ZhciBkPWEudGFnO2lmKDU9PT1kfHw2PT09ZClhPWEuc3RhdGVOb2RlLGI/Yy5pbnNlcnRCZWZvcmUoYSxiKTpjLmFwcGVuZENoaWxkKGEpO2Vsc2UgaWYoNCE9PWQmJihhPWEuY2hpbGQsbnVsbCE9PWEpKWZvcihXaihhLGIsYyksYT1hLnNpYmxpbmc7bnVsbCE9PWE7KVdqKGEsYixjKSxhPWEuc2libGluZ312YXIgWD1udWxsLFhqPSExO2Z1bmN0aW9uIFlqKGEsYixjKXtmb3IoYz1jLmNoaWxkO251bGwhPT1jOylaaihhLGIsYyksYz1jLnNpYmxpbmd9XG5mdW5jdGlvbiBaaihhLGIsYyl7aWYobGMmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBsYy5vbkNvbW1pdEZpYmVyVW5tb3VudCl0cnl7bGMub25Db21taXRGaWJlclVubW91bnQoa2MsYyl9Y2F0Y2goaCl7fXN3aXRjaChjLnRhZyl7Y2FzZSA1OlV8fExqKGMsYik7Y2FzZSA2OnZhciBkPVgsZT1YajtYPW51bGw7WWooYSxiLGMpO1g9ZDtYaj1lO251bGwhPT1YJiYoWGo/KGE9WCxjPWMuc3RhdGVOb2RlLDg9PT1hLm5vZGVUeXBlP2EucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjKTphLnJlbW92ZUNoaWxkKGMpKTpYLnJlbW92ZUNoaWxkKGMuc3RhdGVOb2RlKSk7YnJlYWs7Y2FzZSAxODpudWxsIT09WCYmKFhqPyhhPVgsYz1jLnN0YXRlTm9kZSw4PT09YS5ub2RlVHlwZT9LZihhLnBhcmVudE5vZGUsYyk6MT09PWEubm9kZVR5cGUmJktmKGEsYyksYmQoYSkpOktmKFgsYy5zdGF0ZU5vZGUpKTticmVhaztjYXNlIDQ6ZD1YO2U9WGo7WD1jLnN0YXRlTm9kZS5jb250YWluZXJJbmZvO1hqPSEwO1xuWWooYSxiLGMpO1g9ZDtYaj1lO2JyZWFrO2Nhc2UgMDpjYXNlIDExOmNhc2UgMTQ6Y2FzZSAxNTppZighVSYmKGQ9Yy51cGRhdGVRdWV1ZSxudWxsIT09ZCYmKGQ9ZC5sYXN0RWZmZWN0LG51bGwhPT1kKSkpe2U9ZD1kLm5leHQ7ZG97dmFyIGY9ZSxnPWYuZGVzdHJveTtmPWYudGFnO3ZvaWQgMCE9PWcmJigwIT09KGYmMik/TWooYyxiLGcpOjAhPT0oZiY0KSYmTWooYyxiLGcpKTtlPWUubmV4dH13aGlsZShlIT09ZCl9WWooYSxiLGMpO2JyZWFrO2Nhc2UgMTppZighVSYmKExqKGMsYiksZD1jLnN0YXRlTm9kZSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZC5jb21wb25lbnRXaWxsVW5tb3VudCkpdHJ5e2QucHJvcHM9Yy5tZW1vaXplZFByb3BzLGQuc3RhdGU9Yy5tZW1vaXplZFN0YXRlLGQuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChoKXtXKGMsYixoKX1ZaihhLGIsYyk7YnJlYWs7Y2FzZSAyMTpZaihhLGIsYyk7YnJlYWs7Y2FzZSAyMjpjLm1vZGUmMT8oVT0oZD1VKXx8bnVsbCE9PVxuYy5tZW1vaXplZFN0YXRlLFlqKGEsYixjKSxVPWQpOllqKGEsYixjKTticmVhaztkZWZhdWx0OllqKGEsYixjKX19ZnVuY3Rpb24gYWsoYSl7dmFyIGI9YS51cGRhdGVRdWV1ZTtpZihudWxsIT09Yil7YS51cGRhdGVRdWV1ZT1udWxsO3ZhciBjPWEuc3RhdGVOb2RlO251bGw9PT1jJiYoYz1hLnN0YXRlTm9kZT1uZXcgS2opO2IuZm9yRWFjaChmdW5jdGlvbihiKXt2YXIgZD1iay5iaW5kKG51bGwsYSxiKTtjLmhhcyhiKXx8KGMuYWRkKGIpLGIudGhlbihkLGQpKX0pfX1cbmZ1bmN0aW9uIGNrKGEsYil7dmFyIGM9Yi5kZWxldGlvbnM7aWYobnVsbCE9PWMpZm9yKHZhciBkPTA7ZDxjLmxlbmd0aDtkKyspe3ZhciBlPWNbZF07dHJ5e3ZhciBmPWEsZz1iLGg9ZzthOmZvcig7bnVsbCE9PWg7KXtzd2l0Y2goaC50YWcpe2Nhc2UgNTpYPWguc3RhdGVOb2RlO1hqPSExO2JyZWFrIGE7Y2FzZSAzOlg9aC5zdGF0ZU5vZGUuY29udGFpbmVySW5mbztYaj0hMDticmVhayBhO2Nhc2UgNDpYPWguc3RhdGVOb2RlLmNvbnRhaW5lckluZm87WGo9ITA7YnJlYWsgYX1oPWgucmV0dXJufWlmKG51bGw9PT1YKXRocm93IEVycm9yKHAoMTYwKSk7WmooZixnLGUpO1g9bnVsbDtYaj0hMTt2YXIgaz1lLmFsdGVybmF0ZTtudWxsIT09ayYmKGsucmV0dXJuPW51bGwpO2UucmV0dXJuPW51bGx9Y2F0Y2gobCl7VyhlLGIsbCl9fWlmKGIuc3VidHJlZUZsYWdzJjEyODU0KWZvcihiPWIuY2hpbGQ7bnVsbCE9PWI7KWRrKGIsYSksYj1iLnNpYmxpbmd9XG5mdW5jdGlvbiBkayhhLGIpe3ZhciBjPWEuYWx0ZXJuYXRlLGQ9YS5mbGFncztzd2l0Y2goYS50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTQ6Y2FzZSAxNTpjayhiLGEpO2VrKGEpO2lmKGQmNCl7dHJ5e1BqKDMsYSxhLnJldHVybiksUWooMyxhKX1jYXRjaCh0KXtXKGEsYS5yZXR1cm4sdCl9dHJ5e1BqKDUsYSxhLnJldHVybil9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfX1icmVhaztjYXNlIDE6Y2soYixhKTtlayhhKTtkJjUxMiYmbnVsbCE9PWMmJkxqKGMsYy5yZXR1cm4pO2JyZWFrO2Nhc2UgNTpjayhiLGEpO2VrKGEpO2QmNTEyJiZudWxsIT09YyYmTGooYyxjLnJldHVybik7aWYoYS5mbGFncyYzMil7dmFyIGU9YS5zdGF0ZU5vZGU7dHJ5e29iKGUsXCJcIil9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfX1pZihkJjQmJihlPWEuc3RhdGVOb2RlLG51bGwhPWUpKXt2YXIgZj1hLm1lbW9pemVkUHJvcHMsZz1udWxsIT09Yz9jLm1lbW9pemVkUHJvcHM6ZixoPWEudHlwZSxrPWEudXBkYXRlUXVldWU7XG5hLnVwZGF0ZVF1ZXVlPW51bGw7aWYobnVsbCE9PWspdHJ5e1wiaW5wdXRcIj09PWgmJlwicmFkaW9cIj09PWYudHlwZSYmbnVsbCE9Zi5uYW1lJiZhYihlLGYpO3ZiKGgsZyk7dmFyIGw9dmIoaCxmKTtmb3IoZz0wO2c8ay5sZW5ndGg7Zys9Mil7dmFyIG09a1tnXSxxPWtbZysxXTtcInN0eWxlXCI9PT1tP3NiKGUscSk6XCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiPT09bT9uYihlLHEpOlwiY2hpbGRyZW5cIj09PW0/b2IoZSxxKTp0YShlLG0scSxsKX1zd2l0Y2goaCl7Y2FzZSBcImlucHV0XCI6YmIoZSxmKTticmVhaztjYXNlIFwidGV4dGFyZWFcIjppYihlLGYpO2JyZWFrO2Nhc2UgXCJzZWxlY3RcIjp2YXIgcj1lLl93cmFwcGVyU3RhdGUud2FzTXVsdGlwbGU7ZS5fd3JhcHBlclN0YXRlLndhc011bHRpcGxlPSEhZi5tdWx0aXBsZTt2YXIgeT1mLnZhbHVlO251bGwhPXk/ZmIoZSwhIWYubXVsdGlwbGUseSwhMSk6ciE9PSEhZi5tdWx0aXBsZSYmKG51bGwhPWYuZGVmYXVsdFZhbHVlP2ZiKGUsISFmLm11bHRpcGxlLFxuZi5kZWZhdWx0VmFsdWUsITApOmZiKGUsISFmLm11bHRpcGxlLGYubXVsdGlwbGU/W106XCJcIiwhMSkpfWVbUGZdPWZ9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfX1icmVhaztjYXNlIDY6Y2soYixhKTtlayhhKTtpZihkJjQpe2lmKG51bGw9PT1hLnN0YXRlTm9kZSl0aHJvdyBFcnJvcihwKDE2MikpO2U9YS5zdGF0ZU5vZGU7Zj1hLm1lbW9pemVkUHJvcHM7dHJ5e2Uubm9kZVZhbHVlPWZ9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfX1icmVhaztjYXNlIDM6Y2soYixhKTtlayhhKTtpZihkJjQmJm51bGwhPT1jJiZjLm1lbW9pemVkU3RhdGUuaXNEZWh5ZHJhdGVkKXRyeXtiZChiLmNvbnRhaW5lckluZm8pfWNhdGNoKHQpe1coYSxhLnJldHVybix0KX1icmVhaztjYXNlIDQ6Y2soYixhKTtlayhhKTticmVhaztjYXNlIDEzOmNrKGIsYSk7ZWsoYSk7ZT1hLmNoaWxkO2UuZmxhZ3MmODE5MiYmKGY9bnVsbCE9PWUubWVtb2l6ZWRTdGF0ZSxlLnN0YXRlTm9kZS5pc0hpZGRlbj1mLCFmfHxcbm51bGwhPT1lLmFsdGVybmF0ZSYmbnVsbCE9PWUuYWx0ZXJuYXRlLm1lbW9pemVkU3RhdGV8fChmaz1CKCkpKTtkJjQmJmFrKGEpO2JyZWFrO2Nhc2UgMjI6bT1udWxsIT09YyYmbnVsbCE9PWMubWVtb2l6ZWRTdGF0ZTthLm1vZGUmMT8oVT0obD1VKXx8bSxjayhiLGEpLFU9bCk6Y2soYixhKTtlayhhKTtpZihkJjgxOTIpe2w9bnVsbCE9PWEubWVtb2l6ZWRTdGF0ZTtpZigoYS5zdGF0ZU5vZGUuaXNIaWRkZW49bCkmJiFtJiYwIT09KGEubW9kZSYxKSlmb3IoVj1hLG09YS5jaGlsZDtudWxsIT09bTspe2ZvcihxPVY9bTtudWxsIT09Vjspe3I9Vjt5PXIuY2hpbGQ7c3dpdGNoKHIudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE0OmNhc2UgMTU6UGooNCxyLHIucmV0dXJuKTticmVhaztjYXNlIDE6TGoocixyLnJldHVybik7dmFyIG49ci5zdGF0ZU5vZGU7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIG4uY29tcG9uZW50V2lsbFVubW91bnQpe2Q9cjtjPXIucmV0dXJuO3RyeXtiPWQsbi5wcm9wcz1cbmIubWVtb2l6ZWRQcm9wcyxuLnN0YXRlPWIubWVtb2l6ZWRTdGF0ZSxuLmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2godCl7VyhkLGMsdCl9fWJyZWFrO2Nhc2UgNTpMaihyLHIucmV0dXJuKTticmVhaztjYXNlIDIyOmlmKG51bGwhPT1yLm1lbW9pemVkU3RhdGUpe2drKHEpO2NvbnRpbnVlfX1udWxsIT09eT8oeS5yZXR1cm49cixWPXkpOmdrKHEpfW09bS5zaWJsaW5nfWE6Zm9yKG09bnVsbCxxPWE7Oyl7aWYoNT09PXEudGFnKXtpZihudWxsPT09bSl7bT1xO3RyeXtlPXEuc3RhdGVOb2RlLGw/KGY9ZS5zdHlsZSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZi5zZXRQcm9wZXJ0eT9mLnNldFByb3BlcnR5KFwiZGlzcGxheVwiLFwibm9uZVwiLFwiaW1wb3J0YW50XCIpOmYuZGlzcGxheT1cIm5vbmVcIik6KGg9cS5zdGF0ZU5vZGUsaz1xLm1lbW9pemVkUHJvcHMuc3R5bGUsZz12b2lkIDAhPT1rJiZudWxsIT09ayYmay5oYXNPd25Qcm9wZXJ0eShcImRpc3BsYXlcIik/ay5kaXNwbGF5Om51bGwsaC5zdHlsZS5kaXNwbGF5PVxucmIoXCJkaXNwbGF5XCIsZykpfWNhdGNoKHQpe1coYSxhLnJldHVybix0KX19fWVsc2UgaWYoNj09PXEudGFnKXtpZihudWxsPT09bSl0cnl7cS5zdGF0ZU5vZGUubm9kZVZhbHVlPWw/XCJcIjpxLm1lbW9pemVkUHJvcHN9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfX1lbHNlIGlmKCgyMiE9PXEudGFnJiYyMyE9PXEudGFnfHxudWxsPT09cS5tZW1vaXplZFN0YXRlfHxxPT09YSkmJm51bGwhPT1xLmNoaWxkKXtxLmNoaWxkLnJldHVybj1xO3E9cS5jaGlsZDtjb250aW51ZX1pZihxPT09YSlicmVhayBhO2Zvcig7bnVsbD09PXEuc2libGluZzspe2lmKG51bGw9PT1xLnJldHVybnx8cS5yZXR1cm49PT1hKWJyZWFrIGE7bT09PXEmJihtPW51bGwpO3E9cS5yZXR1cm59bT09PXEmJihtPW51bGwpO3Euc2libGluZy5yZXR1cm49cS5yZXR1cm47cT1xLnNpYmxpbmd9fWJyZWFrO2Nhc2UgMTk6Y2soYixhKTtlayhhKTtkJjQmJmFrKGEpO2JyZWFrO2Nhc2UgMjE6YnJlYWs7ZGVmYXVsdDpjayhiLFxuYSksZWsoYSl9fWZ1bmN0aW9uIGVrKGEpe3ZhciBiPWEuZmxhZ3M7aWYoYiYyKXt0cnl7YTp7Zm9yKHZhciBjPWEucmV0dXJuO251bGwhPT1jOyl7aWYoVGooYykpe3ZhciBkPWM7YnJlYWsgYX1jPWMucmV0dXJufXRocm93IEVycm9yKHAoMTYwKSk7fXN3aXRjaChkLnRhZyl7Y2FzZSA1OnZhciBlPWQuc3RhdGVOb2RlO2QuZmxhZ3MmMzImJihvYihlLFwiXCIpLGQuZmxhZ3MmPS0zMyk7dmFyIGY9VWooYSk7V2ooYSxmLGUpO2JyZWFrO2Nhc2UgMzpjYXNlIDQ6dmFyIGc9ZC5zdGF0ZU5vZGUuY29udGFpbmVySW5mbyxoPVVqKGEpO1ZqKGEsaCxnKTticmVhaztkZWZhdWx0OnRocm93IEVycm9yKHAoMTYxKSk7fX1jYXRjaChrKXtXKGEsYS5yZXR1cm4sayl9YS5mbGFncyY9LTN9YiY0MDk2JiYoYS5mbGFncyY9LTQwOTcpfWZ1bmN0aW9uIGhrKGEsYixjKXtWPWE7aWsoYSxiLGMpfVxuZnVuY3Rpb24gaWsoYSxiLGMpe2Zvcih2YXIgZD0wIT09KGEubW9kZSYxKTtudWxsIT09Vjspe3ZhciBlPVYsZj1lLmNoaWxkO2lmKDIyPT09ZS50YWcmJmQpe3ZhciBnPW51bGwhPT1lLm1lbW9pemVkU3RhdGV8fEpqO2lmKCFnKXt2YXIgaD1lLmFsdGVybmF0ZSxrPW51bGwhPT1oJiZudWxsIT09aC5tZW1vaXplZFN0YXRlfHxVO2g9Smo7dmFyIGw9VTtKaj1nO2lmKChVPWspJiYhbClmb3IoVj1lO251bGwhPT1WOylnPVYsaz1nLmNoaWxkLDIyPT09Zy50YWcmJm51bGwhPT1nLm1lbW9pemVkU3RhdGU/amsoZSk6bnVsbCE9PWs/KGsucmV0dXJuPWcsVj1rKTpqayhlKTtmb3IoO251bGwhPT1mOylWPWYsaWsoZixiLGMpLGY9Zi5zaWJsaW5nO1Y9ZTtKaj1oO1U9bH1rayhhLGIsYyl9ZWxzZSAwIT09KGUuc3VidHJlZUZsYWdzJjg3NzIpJiZudWxsIT09Zj8oZi5yZXR1cm49ZSxWPWYpOmtrKGEsYixjKX19XG5mdW5jdGlvbiBrayhhKXtmb3IoO251bGwhPT1WOyl7dmFyIGI9VjtpZigwIT09KGIuZmxhZ3MmODc3Mikpe3ZhciBjPWIuYWx0ZXJuYXRlO3RyeXtpZigwIT09KGIuZmxhZ3MmODc3Mikpc3dpdGNoKGIudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE1OlV8fFFqKDUsYik7YnJlYWs7Y2FzZSAxOnZhciBkPWIuc3RhdGVOb2RlO2lmKGIuZmxhZ3MmNCYmIVUpaWYobnVsbD09PWMpZC5jb21wb25lbnREaWRNb3VudCgpO2Vsc2V7dmFyIGU9Yi5lbGVtZW50VHlwZT09PWIudHlwZT9jLm1lbW9pemVkUHJvcHM6Q2koYi50eXBlLGMubWVtb2l6ZWRQcm9wcyk7ZC5jb21wb25lbnREaWRVcGRhdGUoZSxjLm1lbW9pemVkU3RhdGUsZC5fX3JlYWN0SW50ZXJuYWxTbmFwc2hvdEJlZm9yZVVwZGF0ZSl9dmFyIGY9Yi51cGRhdGVRdWV1ZTtudWxsIT09ZiYmc2goYixmLGQpO2JyZWFrO2Nhc2UgMzp2YXIgZz1iLnVwZGF0ZVF1ZXVlO2lmKG51bGwhPT1nKXtjPW51bGw7aWYobnVsbCE9PWIuY2hpbGQpc3dpdGNoKGIuY2hpbGQudGFnKXtjYXNlIDU6Yz1cbmIuY2hpbGQuc3RhdGVOb2RlO2JyZWFrO2Nhc2UgMTpjPWIuY2hpbGQuc3RhdGVOb2RlfXNoKGIsZyxjKX1icmVhaztjYXNlIDU6dmFyIGg9Yi5zdGF0ZU5vZGU7aWYobnVsbD09PWMmJmIuZmxhZ3MmNCl7Yz1oO3ZhciBrPWIubWVtb2l6ZWRQcm9wcztzd2l0Y2goYi50eXBlKXtjYXNlIFwiYnV0dG9uXCI6Y2FzZSBcImlucHV0XCI6Y2FzZSBcInNlbGVjdFwiOmNhc2UgXCJ0ZXh0YXJlYVwiOmsuYXV0b0ZvY3VzJiZjLmZvY3VzKCk7YnJlYWs7Y2FzZSBcImltZ1wiOmsuc3JjJiYoYy5zcmM9ay5zcmMpfX1icmVhaztjYXNlIDY6YnJlYWs7Y2FzZSA0OmJyZWFrO2Nhc2UgMTI6YnJlYWs7Y2FzZSAxMzppZihudWxsPT09Yi5tZW1vaXplZFN0YXRlKXt2YXIgbD1iLmFsdGVybmF0ZTtpZihudWxsIT09bCl7dmFyIG09bC5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1tKXt2YXIgcT1tLmRlaHlkcmF0ZWQ7bnVsbCE9PXEmJmJkKHEpfX19YnJlYWs7Y2FzZSAxOTpjYXNlIDE3OmNhc2UgMjE6Y2FzZSAyMjpjYXNlIDIzOmNhc2UgMjU6YnJlYWs7XG5kZWZhdWx0OnRocm93IEVycm9yKHAoMTYzKSk7fVV8fGIuZmxhZ3MmNTEyJiZSaihiKX1jYXRjaChyKXtXKGIsYi5yZXR1cm4scil9fWlmKGI9PT1hKXtWPW51bGw7YnJlYWt9Yz1iLnNpYmxpbmc7aWYobnVsbCE9PWMpe2MucmV0dXJuPWIucmV0dXJuO1Y9YzticmVha31WPWIucmV0dXJufX1mdW5jdGlvbiBnayhhKXtmb3IoO251bGwhPT1WOyl7dmFyIGI9VjtpZihiPT09YSl7Vj1udWxsO2JyZWFrfXZhciBjPWIuc2libGluZztpZihudWxsIT09Yyl7Yy5yZXR1cm49Yi5yZXR1cm47Vj1jO2JyZWFrfVY9Yi5yZXR1cm59fVxuZnVuY3Rpb24gamsoYSl7Zm9yKDtudWxsIT09Vjspe3ZhciBiPVY7dHJ5e3N3aXRjaChiLnRhZyl7Y2FzZSAwOmNhc2UgMTE6Y2FzZSAxNTp2YXIgYz1iLnJldHVybjt0cnl7UWooNCxiKX1jYXRjaChrKXtXKGIsYyxrKX1icmVhaztjYXNlIDE6dmFyIGQ9Yi5zdGF0ZU5vZGU7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGQuY29tcG9uZW50RGlkTW91bnQpe3ZhciBlPWIucmV0dXJuO3RyeXtkLmNvbXBvbmVudERpZE1vdW50KCl9Y2F0Y2goayl7VyhiLGUsayl9fXZhciBmPWIucmV0dXJuO3RyeXtSaihiKX1jYXRjaChrKXtXKGIsZixrKX1icmVhaztjYXNlIDU6dmFyIGc9Yi5yZXR1cm47dHJ5e1JqKGIpfWNhdGNoKGspe1coYixnLGspfX19Y2F0Y2goayl7VyhiLGIucmV0dXJuLGspfWlmKGI9PT1hKXtWPW51bGw7YnJlYWt9dmFyIGg9Yi5zaWJsaW5nO2lmKG51bGwhPT1oKXtoLnJldHVybj1iLnJldHVybjtWPWg7YnJlYWt9Vj1iLnJldHVybn19XG52YXIgbGs9TWF0aC5jZWlsLG1rPXVhLlJlYWN0Q3VycmVudERpc3BhdGNoZXIsbms9dWEuUmVhY3RDdXJyZW50T3duZXIsb2s9dWEuUmVhY3RDdXJyZW50QmF0Y2hDb25maWcsSz0wLFE9bnVsbCxZPW51bGwsWj0wLGZqPTAsZWo9VWYoMCksVD0wLHBrPW51bGwscmg9MCxxaz0wLHJrPTAsc2s9bnVsbCx0az1udWxsLGZrPTAsR2o9SW5maW5pdHksdWs9bnVsbCxPaT0hMSxQaT1udWxsLFJpPW51bGwsdms9ITEsd2s9bnVsbCx4az0wLHlrPTAsems9bnVsbCxBaz0tMSxCaz0wO2Z1bmN0aW9uIFIoKXtyZXR1cm4gMCE9PShLJjYpP0IoKTotMSE9PUFrP0FrOkFrPUIoKX1cbmZ1bmN0aW9uIHlpKGEpe2lmKDA9PT0oYS5tb2RlJjEpKXJldHVybiAxO2lmKDAhPT0oSyYyKSYmMCE9PVopcmV0dXJuIFomLVo7aWYobnVsbCE9PUtnLnRyYW5zaXRpb24pcmV0dXJuIDA9PT1CayYmKEJrPXljKCkpLEJrO2E9QztpZigwIT09YSlyZXR1cm4gYTthPXdpbmRvdy5ldmVudDthPXZvaWQgMD09PWE/MTY6amQoYS50eXBlKTtyZXR1cm4gYX1mdW5jdGlvbiBnaShhLGIsYyxkKXtpZig1MDx5ayl0aHJvdyB5az0wLHprPW51bGwsRXJyb3IocCgxODUpKTtBYyhhLGMsZCk7aWYoMD09PShLJjIpfHxhIT09USlhPT09USYmKDA9PT0oSyYyKSYmKHFrfD1jKSw0PT09VCYmQ2soYSxaKSksRGsoYSxkKSwxPT09YyYmMD09PUsmJjA9PT0oYi5tb2RlJjEpJiYoR2o9QigpKzUwMCxmZyYmamcoKSl9XG5mdW5jdGlvbiBEayhhLGIpe3ZhciBjPWEuY2FsbGJhY2tOb2RlO3djKGEsYik7dmFyIGQ9dWMoYSxhPT09UT9aOjApO2lmKDA9PT1kKW51bGwhPT1jJiZiYyhjKSxhLmNhbGxiYWNrTm9kZT1udWxsLGEuY2FsbGJhY2tQcmlvcml0eT0wO2Vsc2UgaWYoYj1kJi1kLGEuY2FsbGJhY2tQcmlvcml0eSE9PWIpe251bGwhPWMmJmJjKGMpO2lmKDE9PT1iKTA9PT1hLnRhZz9pZyhFay5iaW5kKG51bGwsYSkpOmhnKEVrLmJpbmQobnVsbCxhKSksSmYoZnVuY3Rpb24oKXswPT09KEsmNikmJmpnKCl9KSxjPW51bGw7ZWxzZXtzd2l0Y2goRGMoZCkpe2Nhc2UgMTpjPWZjO2JyZWFrO2Nhc2UgNDpjPWdjO2JyZWFrO2Nhc2UgMTY6Yz1oYzticmVhaztjYXNlIDUzNjg3MDkxMjpjPWpjO2JyZWFrO2RlZmF1bHQ6Yz1oY31jPUZrKGMsR2suYmluZChudWxsLGEpKX1hLmNhbGxiYWNrUHJpb3JpdHk9YjthLmNhbGxiYWNrTm9kZT1jfX1cbmZ1bmN0aW9uIEdrKGEsYil7QWs9LTE7Qms9MDtpZigwIT09KEsmNikpdGhyb3cgRXJyb3IocCgzMjcpKTt2YXIgYz1hLmNhbGxiYWNrTm9kZTtpZihIaygpJiZhLmNhbGxiYWNrTm9kZSE9PWMpcmV0dXJuIG51bGw7dmFyIGQ9dWMoYSxhPT09UT9aOjApO2lmKDA9PT1kKXJldHVybiBudWxsO2lmKDAhPT0oZCYzMCl8fDAhPT0oZCZhLmV4cGlyZWRMYW5lcyl8fGIpYj1JayhhLGQpO2Vsc2V7Yj1kO3ZhciBlPUs7S3w9Mjt2YXIgZj1KaygpO2lmKFEhPT1hfHxaIT09Yil1az1udWxsLEdqPUIoKSs1MDAsS2soYSxiKTtkbyB0cnl7TGsoKTticmVha31jYXRjaChoKXtNayhhLGgpfXdoaWxlKDEpOyRnKCk7bWsuY3VycmVudD1mO0s9ZTtudWxsIT09WT9iPTA6KFE9bnVsbCxaPTAsYj1UKX1pZigwIT09Yil7Mj09PWImJihlPXhjKGEpLDAhPT1lJiYoZD1lLGI9TmsoYSxlKSkpO2lmKDE9PT1iKXRocm93IGM9cGssS2soYSwwKSxDayhhLGQpLERrKGEsQigpKSxjO2lmKDY9PT1iKUNrKGEsZCk7XG5lbHNle2U9YS5jdXJyZW50LmFsdGVybmF0ZTtpZigwPT09KGQmMzApJiYhT2soZSkmJihiPUlrKGEsZCksMj09PWImJihmPXhjKGEpLDAhPT1mJiYoZD1mLGI9TmsoYSxmKSkpLDE9PT1iKSl0aHJvdyBjPXBrLEtrKGEsMCksQ2soYSxkKSxEayhhLEIoKSksYzthLmZpbmlzaGVkV29yaz1lO2EuZmluaXNoZWRMYW5lcz1kO3N3aXRjaChiKXtjYXNlIDA6Y2FzZSAxOnRocm93IEVycm9yKHAoMzQ1KSk7Y2FzZSAyOlBrKGEsdGssdWspO2JyZWFrO2Nhc2UgMzpDayhhLGQpO2lmKChkJjEzMDAyMzQyNCk9PT1kJiYoYj1mays1MDAtQigpLDEwPGIpKXtpZigwIT09dWMoYSwwKSlicmVhaztlPWEuc3VzcGVuZGVkTGFuZXM7aWYoKGUmZCkhPT1kKXtSKCk7YS5waW5nZWRMYW5lc3w9YS5zdXNwZW5kZWRMYW5lcyZlO2JyZWFrfWEudGltZW91dEhhbmRsZT1GZihQay5iaW5kKG51bGwsYSx0ayx1ayksYik7YnJlYWt9UGsoYSx0ayx1ayk7YnJlYWs7Y2FzZSA0OkNrKGEsZCk7aWYoKGQmNDE5NDI0MCk9PT1cbmQpYnJlYWs7Yj1hLmV2ZW50VGltZXM7Zm9yKGU9LTE7MDxkOyl7dmFyIGc9MzEtb2MoZCk7Zj0xPDxnO2c9YltnXTtnPmUmJihlPWcpO2QmPX5mfWQ9ZTtkPUIoKS1kO2Q9KDEyMD5kPzEyMDo0ODA+ZD80ODA6MTA4MD5kPzEwODA6MTkyMD5kPzE5MjA6M0UzPmQ/M0UzOjQzMjA+ZD80MzIwOjE5NjAqbGsoZC8xOTYwKSktZDtpZigxMDxkKXthLnRpbWVvdXRIYW5kbGU9RmYoUGsuYmluZChudWxsLGEsdGssdWspLGQpO2JyZWFrfVBrKGEsdGssdWspO2JyZWFrO2Nhc2UgNTpQayhhLHRrLHVrKTticmVhaztkZWZhdWx0OnRocm93IEVycm9yKHAoMzI5KSk7fX19RGsoYSxCKCkpO3JldHVybiBhLmNhbGxiYWNrTm9kZT09PWM/R2suYmluZChudWxsLGEpOm51bGx9XG5mdW5jdGlvbiBOayhhLGIpe3ZhciBjPXNrO2EuY3VycmVudC5tZW1vaXplZFN0YXRlLmlzRGVoeWRyYXRlZCYmKEtrKGEsYikuZmxhZ3N8PTI1Nik7YT1JayhhLGIpOzIhPT1hJiYoYj10ayx0az1jLG51bGwhPT1iJiZGaihiKSk7cmV0dXJuIGF9ZnVuY3Rpb24gRmooYSl7bnVsbD09PXRrP3RrPWE6dGsucHVzaC5hcHBseSh0ayxhKX1cbmZ1bmN0aW9uIE9rKGEpe2Zvcih2YXIgYj1hOzspe2lmKGIuZmxhZ3MmMTYzODQpe3ZhciBjPWIudXBkYXRlUXVldWU7aWYobnVsbCE9PWMmJihjPWMuc3RvcmVzLG51bGwhPT1jKSlmb3IodmFyIGQ9MDtkPGMubGVuZ3RoO2QrKyl7dmFyIGU9Y1tkXSxmPWUuZ2V0U25hcHNob3Q7ZT1lLnZhbHVlO3RyeXtpZighSGUoZigpLGUpKXJldHVybiExfWNhdGNoKGcpe3JldHVybiExfX19Yz1iLmNoaWxkO2lmKGIuc3VidHJlZUZsYWdzJjE2Mzg0JiZudWxsIT09YyljLnJldHVybj1iLGI9YztlbHNle2lmKGI9PT1hKWJyZWFrO2Zvcig7bnVsbD09PWIuc2libGluZzspe2lmKG51bGw9PT1iLnJldHVybnx8Yi5yZXR1cm49PT1hKXJldHVybiEwO2I9Yi5yZXR1cm59Yi5zaWJsaW5nLnJldHVybj1iLnJldHVybjtiPWIuc2libGluZ319cmV0dXJuITB9XG5mdW5jdGlvbiBDayhhLGIpe2ImPX5yaztiJj1+cWs7YS5zdXNwZW5kZWRMYW5lc3w9YjthLnBpbmdlZExhbmVzJj1+Yjtmb3IoYT1hLmV4cGlyYXRpb25UaW1lczswPGI7KXt2YXIgYz0zMS1vYyhiKSxkPTE8PGM7YVtjXT0tMTtiJj1+ZH19ZnVuY3Rpb24gRWsoYSl7aWYoMCE9PShLJjYpKXRocm93IEVycm9yKHAoMzI3KSk7SGsoKTt2YXIgYj11YyhhLDApO2lmKDA9PT0oYiYxKSlyZXR1cm4gRGsoYSxCKCkpLG51bGw7dmFyIGM9SWsoYSxiKTtpZigwIT09YS50YWcmJjI9PT1jKXt2YXIgZD14YyhhKTswIT09ZCYmKGI9ZCxjPU5rKGEsZCkpfWlmKDE9PT1jKXRocm93IGM9cGssS2soYSwwKSxDayhhLGIpLERrKGEsQigpKSxjO2lmKDY9PT1jKXRocm93IEVycm9yKHAoMzQ1KSk7YS5maW5pc2hlZFdvcms9YS5jdXJyZW50LmFsdGVybmF0ZTthLmZpbmlzaGVkTGFuZXM9YjtQayhhLHRrLHVrKTtEayhhLEIoKSk7cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBRayhhLGIpe3ZhciBjPUs7S3w9MTt0cnl7cmV0dXJuIGEoYil9ZmluYWxseXtLPWMsMD09PUsmJihHaj1CKCkrNTAwLGZnJiZqZygpKX19ZnVuY3Rpb24gUmsoYSl7bnVsbCE9PXdrJiYwPT09d2sudGFnJiYwPT09KEsmNikmJkhrKCk7dmFyIGI9SztLfD0xO3ZhciBjPW9rLnRyYW5zaXRpb24sZD1DO3RyeXtpZihvay50cmFuc2l0aW9uPW51bGwsQz0xLGEpcmV0dXJuIGEoKX1maW5hbGx5e0M9ZCxvay50cmFuc2l0aW9uPWMsSz1iLDA9PT0oSyY2KSYmamcoKX19ZnVuY3Rpb24gSGooKXtmaj1lai5jdXJyZW50O0UoZWopfVxuZnVuY3Rpb24gS2soYSxiKXthLmZpbmlzaGVkV29yaz1udWxsO2EuZmluaXNoZWRMYW5lcz0wO3ZhciBjPWEudGltZW91dEhhbmRsZTstMSE9PWMmJihhLnRpbWVvdXRIYW5kbGU9LTEsR2YoYykpO2lmKG51bGwhPT1ZKWZvcihjPVkucmV0dXJuO251bGwhPT1jOyl7dmFyIGQ9Yzt3ZyhkKTtzd2l0Y2goZC50YWcpe2Nhc2UgMTpkPWQudHlwZS5jaGlsZENvbnRleHRUeXBlcztudWxsIT09ZCYmdm9pZCAwIT09ZCYmJGYoKTticmVhaztjYXNlIDM6emgoKTtFKFdmKTtFKEgpO0VoKCk7YnJlYWs7Y2FzZSA1OkJoKGQpO2JyZWFrO2Nhc2UgNDp6aCgpO2JyZWFrO2Nhc2UgMTM6RShMKTticmVhaztjYXNlIDE5OkUoTCk7YnJlYWs7Y2FzZSAxMDphaChkLnR5cGUuX2NvbnRleHQpO2JyZWFrO2Nhc2UgMjI6Y2FzZSAyMzpIaigpfWM9Yy5yZXR1cm59UT1hO1k9YT1QZyhhLmN1cnJlbnQsbnVsbCk7Wj1maj1iO1Q9MDtwaz1udWxsO3JrPXFrPXJoPTA7dGs9c2s9bnVsbDtpZihudWxsIT09Zmgpe2ZvcihiPVxuMDtiPGZoLmxlbmd0aDtiKyspaWYoYz1maFtiXSxkPWMuaW50ZXJsZWF2ZWQsbnVsbCE9PWQpe2MuaW50ZXJsZWF2ZWQ9bnVsbDt2YXIgZT1kLm5leHQsZj1jLnBlbmRpbmc7aWYobnVsbCE9PWYpe3ZhciBnPWYubmV4dDtmLm5leHQ9ZTtkLm5leHQ9Z31jLnBlbmRpbmc9ZH1maD1udWxsfXJldHVybiBhfVxuZnVuY3Rpb24gTWsoYSxiKXtkb3t2YXIgYz1ZO3RyeXskZygpO0ZoLmN1cnJlbnQ9Umg7aWYoSWgpe2Zvcih2YXIgZD1NLm1lbW9pemVkU3RhdGU7bnVsbCE9PWQ7KXt2YXIgZT1kLnF1ZXVlO251bGwhPT1lJiYoZS5wZW5kaW5nPW51bGwpO2Q9ZC5uZXh0fUloPSExfUhoPTA7Tz1OPU09bnVsbDtKaD0hMTtLaD0wO25rLmN1cnJlbnQ9bnVsbDtpZihudWxsPT09Y3x8bnVsbD09PWMucmV0dXJuKXtUPTE7cGs9YjtZPW51bGw7YnJlYWt9YTp7dmFyIGY9YSxnPWMucmV0dXJuLGg9YyxrPWI7Yj1aO2guZmxhZ3N8PTMyNzY4O2lmKG51bGwhPT1rJiZcIm9iamVjdFwiPT09dHlwZW9mIGsmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBrLnRoZW4pe3ZhciBsPWssbT1oLHE9bS50YWc7aWYoMD09PShtLm1vZGUmMSkmJigwPT09cXx8MTE9PT1xfHwxNT09PXEpKXt2YXIgcj1tLmFsdGVybmF0ZTtyPyhtLnVwZGF0ZVF1ZXVlPXIudXBkYXRlUXVldWUsbS5tZW1vaXplZFN0YXRlPXIubWVtb2l6ZWRTdGF0ZSxcbm0ubGFuZXM9ci5sYW5lcyk6KG0udXBkYXRlUXVldWU9bnVsbCxtLm1lbW9pemVkU3RhdGU9bnVsbCl9dmFyIHk9VWkoZyk7aWYobnVsbCE9PXkpe3kuZmxhZ3MmPS0yNTc7VmkoeSxnLGgsZixiKTt5Lm1vZGUmMSYmU2koZixsLGIpO2I9eTtrPWw7dmFyIG49Yi51cGRhdGVRdWV1ZTtpZihudWxsPT09bil7dmFyIHQ9bmV3IFNldDt0LmFkZChrKTtiLnVwZGF0ZVF1ZXVlPXR9ZWxzZSBuLmFkZChrKTticmVhayBhfWVsc2V7aWYoMD09PShiJjEpKXtTaShmLGwsYik7dGooKTticmVhayBhfWs9RXJyb3IocCg0MjYpKX19ZWxzZSBpZihJJiZoLm1vZGUmMSl7dmFyIEo9VWkoZyk7aWYobnVsbCE9PUopezA9PT0oSi5mbGFncyY2NTUzNikmJihKLmZsYWdzfD0yNTYpO1ZpKEosZyxoLGYsYik7SmcoSmkoayxoKSk7YnJlYWsgYX19Zj1rPUppKGssaCk7NCE9PVQmJihUPTIpO251bGw9PT1zaz9zaz1bZl06c2sucHVzaChmKTtmPWc7ZG97c3dpdGNoKGYudGFnKXtjYXNlIDM6Zi5mbGFnc3w9NjU1MzY7XG5iJj0tYjtmLmxhbmVzfD1iO3ZhciB4PU5pKGYsayxiKTtwaChmLHgpO2JyZWFrIGE7Y2FzZSAxOmg9azt2YXIgdz1mLnR5cGUsdT1mLnN0YXRlTm9kZTtpZigwPT09KGYuZmxhZ3MmMTI4KSYmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiB3LmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcnx8bnVsbCE9PXUmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiB1LmNvbXBvbmVudERpZENhdGNoJiYobnVsbD09PVJpfHwhUmkuaGFzKHUpKSkpe2YuZmxhZ3N8PTY1NTM2O2ImPS1iO2YubGFuZXN8PWI7dmFyIEY9UWkoZixoLGIpO3BoKGYsRik7YnJlYWsgYX19Zj1mLnJldHVybn13aGlsZShudWxsIT09Zil9U2soYyl9Y2F0Y2gobmEpe2I9bmE7WT09PWMmJm51bGwhPT1jJiYoWT1jPWMucmV0dXJuKTtjb250aW51ZX1icmVha313aGlsZSgxKX1mdW5jdGlvbiBKaygpe3ZhciBhPW1rLmN1cnJlbnQ7bWsuY3VycmVudD1SaDtyZXR1cm4gbnVsbD09PWE/Umg6YX1cbmZ1bmN0aW9uIHRqKCl7aWYoMD09PVR8fDM9PT1UfHwyPT09VClUPTQ7bnVsbD09PVF8fDA9PT0ocmgmMjY4NDM1NDU1KSYmMD09PShxayYyNjg0MzU0NTUpfHxDayhRLFopfWZ1bmN0aW9uIElrKGEsYil7dmFyIGM9SztLfD0yO3ZhciBkPUprKCk7aWYoUSE9PWF8fFohPT1iKXVrPW51bGwsS2soYSxiKTtkbyB0cnl7VGsoKTticmVha31jYXRjaChlKXtNayhhLGUpfXdoaWxlKDEpOyRnKCk7Sz1jO21rLmN1cnJlbnQ9ZDtpZihudWxsIT09WSl0aHJvdyBFcnJvcihwKDI2MSkpO1E9bnVsbDtaPTA7cmV0dXJuIFR9ZnVuY3Rpb24gVGsoKXtmb3IoO251bGwhPT1ZOylVayhZKX1mdW5jdGlvbiBMaygpe2Zvcig7bnVsbCE9PVkmJiFjYygpOylVayhZKX1mdW5jdGlvbiBVayhhKXt2YXIgYj1WayhhLmFsdGVybmF0ZSxhLGZqKTthLm1lbW9pemVkUHJvcHM9YS5wZW5kaW5nUHJvcHM7bnVsbD09PWI/U2soYSk6WT1iO25rLmN1cnJlbnQ9bnVsbH1cbmZ1bmN0aW9uIFNrKGEpe3ZhciBiPWE7ZG97dmFyIGM9Yi5hbHRlcm5hdGU7YT1iLnJldHVybjtpZigwPT09KGIuZmxhZ3MmMzI3NjgpKXtpZihjPUVqKGMsYixmaiksbnVsbCE9PWMpe1k9YztyZXR1cm59fWVsc2V7Yz1JaihjLGIpO2lmKG51bGwhPT1jKXtjLmZsYWdzJj0zMjc2NztZPWM7cmV0dXJufWlmKG51bGwhPT1hKWEuZmxhZ3N8PTMyNzY4LGEuc3VidHJlZUZsYWdzPTAsYS5kZWxldGlvbnM9bnVsbDtlbHNle1Q9NjtZPW51bGw7cmV0dXJufX1iPWIuc2libGluZztpZihudWxsIT09Yil7WT1iO3JldHVybn1ZPWI9YX13aGlsZShudWxsIT09Yik7MD09PVQmJihUPTUpfWZ1bmN0aW9uIFBrKGEsYixjKXt2YXIgZD1DLGU9b2sudHJhbnNpdGlvbjt0cnl7b2sudHJhbnNpdGlvbj1udWxsLEM9MSxXayhhLGIsYyxkKX1maW5hbGx5e29rLnRyYW5zaXRpb249ZSxDPWR9cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBXayhhLGIsYyxkKXtkbyBIaygpO3doaWxlKG51bGwhPT13ayk7aWYoMCE9PShLJjYpKXRocm93IEVycm9yKHAoMzI3KSk7Yz1hLmZpbmlzaGVkV29yazt2YXIgZT1hLmZpbmlzaGVkTGFuZXM7aWYobnVsbD09PWMpcmV0dXJuIG51bGw7YS5maW5pc2hlZFdvcms9bnVsbDthLmZpbmlzaGVkTGFuZXM9MDtpZihjPT09YS5jdXJyZW50KXRocm93IEVycm9yKHAoMTc3KSk7YS5jYWxsYmFja05vZGU9bnVsbDthLmNhbGxiYWNrUHJpb3JpdHk9MDt2YXIgZj1jLmxhbmVzfGMuY2hpbGRMYW5lcztCYyhhLGYpO2E9PT1RJiYoWT1RPW51bGwsWj0wKTswPT09KGMuc3VidHJlZUZsYWdzJjIwNjQpJiYwPT09KGMuZmxhZ3MmMjA2NCl8fHZrfHwodms9ITAsRmsoaGMsZnVuY3Rpb24oKXtIaygpO3JldHVybiBudWxsfSkpO2Y9MCE9PShjLmZsYWdzJjE1OTkwKTtpZigwIT09KGMuc3VidHJlZUZsYWdzJjE1OTkwKXx8Zil7Zj1vay50cmFuc2l0aW9uO29rLnRyYW5zaXRpb249bnVsbDtcbnZhciBnPUM7Qz0xO3ZhciBoPUs7S3w9NDtuay5jdXJyZW50PW51bGw7T2ooYSxjKTtkayhjLGEpO09lKERmKTtkZD0hIUNmO0RmPUNmPW51bGw7YS5jdXJyZW50PWM7aGsoYyxhLGUpO2RjKCk7Sz1oO0M9Zztvay50cmFuc2l0aW9uPWZ9ZWxzZSBhLmN1cnJlbnQ9Yzt2ayYmKHZrPSExLHdrPWEseGs9ZSk7Zj1hLnBlbmRpbmdMYW5lczswPT09ZiYmKFJpPW51bGwpO21jKGMuc3RhdGVOb2RlLGQpO0RrKGEsQigpKTtpZihudWxsIT09Yilmb3IoZD1hLm9uUmVjb3ZlcmFibGVFcnJvcixjPTA7YzxiLmxlbmd0aDtjKyspZT1iW2NdLGQoZS52YWx1ZSx7Y29tcG9uZW50U3RhY2s6ZS5zdGFjayxkaWdlc3Q6ZS5kaWdlc3R9KTtpZihPaSl0aHJvdyBPaT0hMSxhPVBpLFBpPW51bGwsYTswIT09KHhrJjEpJiYwIT09YS50YWcmJkhrKCk7Zj1hLnBlbmRpbmdMYW5lczswIT09KGYmMSk/YT09PXprP3lrKys6KHlrPTAsems9YSk6eWs9MDtqZygpO3JldHVybiBudWxsfVxuZnVuY3Rpb24gSGsoKXtpZihudWxsIT09d2spe3ZhciBhPURjKHhrKSxiPW9rLnRyYW5zaXRpb24sYz1DO3RyeXtvay50cmFuc2l0aW9uPW51bGw7Qz0xNj5hPzE2OmE7aWYobnVsbD09PXdrKXZhciBkPSExO2Vsc2V7YT13azt3az1udWxsO3hrPTA7aWYoMCE9PShLJjYpKXRocm93IEVycm9yKHAoMzMxKSk7dmFyIGU9SztLfD00O2ZvcihWPWEuY3VycmVudDtudWxsIT09Vjspe3ZhciBmPVYsZz1mLmNoaWxkO2lmKDAhPT0oVi5mbGFncyYxNikpe3ZhciBoPWYuZGVsZXRpb25zO2lmKG51bGwhPT1oKXtmb3IodmFyIGs9MDtrPGgubGVuZ3RoO2srKyl7dmFyIGw9aFtrXTtmb3IoVj1sO251bGwhPT1WOyl7dmFyIG09Vjtzd2l0Y2gobS50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTU6UGooOCxtLGYpfXZhciBxPW0uY2hpbGQ7aWYobnVsbCE9PXEpcS5yZXR1cm49bSxWPXE7ZWxzZSBmb3IoO251bGwhPT1WOyl7bT1WO3ZhciByPW0uc2libGluZyx5PW0ucmV0dXJuO1NqKG0pO2lmKG09PT1cbmwpe1Y9bnVsbDticmVha31pZihudWxsIT09cil7ci5yZXR1cm49eTtWPXI7YnJlYWt9Vj15fX19dmFyIG49Zi5hbHRlcm5hdGU7aWYobnVsbCE9PW4pe3ZhciB0PW4uY2hpbGQ7aWYobnVsbCE9PXQpe24uY2hpbGQ9bnVsbDtkb3t2YXIgSj10LnNpYmxpbmc7dC5zaWJsaW5nPW51bGw7dD1KfXdoaWxlKG51bGwhPT10KX19Vj1mfX1pZigwIT09KGYuc3VidHJlZUZsYWdzJjIwNjQpJiZudWxsIT09ZylnLnJldHVybj1mLFY9ZztlbHNlIGI6Zm9yKDtudWxsIT09Vjspe2Y9VjtpZigwIT09KGYuZmxhZ3MmMjA0OCkpc3dpdGNoKGYudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE1OlBqKDksZixmLnJldHVybil9dmFyIHg9Zi5zaWJsaW5nO2lmKG51bGwhPT14KXt4LnJldHVybj1mLnJldHVybjtWPXg7YnJlYWsgYn1WPWYucmV0dXJufX12YXIgdz1hLmN1cnJlbnQ7Zm9yKFY9dztudWxsIT09Vjspe2c9Vjt2YXIgdT1nLmNoaWxkO2lmKDAhPT0oZy5zdWJ0cmVlRmxhZ3MmMjA2NCkmJm51bGwhPT1cbnUpdS5yZXR1cm49ZyxWPXU7ZWxzZSBiOmZvcihnPXc7bnVsbCE9PVY7KXtoPVY7aWYoMCE9PShoLmZsYWdzJjIwNDgpKXRyeXtzd2l0Y2goaC50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTU6UWooOSxoKX19Y2F0Y2gobmEpe1coaCxoLnJldHVybixuYSl9aWYoaD09PWcpe1Y9bnVsbDticmVhayBifXZhciBGPWguc2libGluZztpZihudWxsIT09Ril7Ri5yZXR1cm49aC5yZXR1cm47Vj1GO2JyZWFrIGJ9Vj1oLnJldHVybn19Sz1lO2pnKCk7aWYobGMmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBsYy5vblBvc3RDb21taXRGaWJlclJvb3QpdHJ5e2xjLm9uUG9zdENvbW1pdEZpYmVyUm9vdChrYyxhKX1jYXRjaChuYSl7fWQ9ITB9cmV0dXJuIGR9ZmluYWxseXtDPWMsb2sudHJhbnNpdGlvbj1ifX1yZXR1cm4hMX1mdW5jdGlvbiBYayhhLGIsYyl7Yj1KaShjLGIpO2I9TmkoYSxiLDEpO2E9bmgoYSxiLDEpO2I9UigpO251bGwhPT1hJiYoQWMoYSwxLGIpLERrKGEsYikpfVxuZnVuY3Rpb24gVyhhLGIsYyl7aWYoMz09PWEudGFnKVhrKGEsYSxjKTtlbHNlIGZvcig7bnVsbCE9PWI7KXtpZigzPT09Yi50YWcpe1hrKGIsYSxjKTticmVha31lbHNlIGlmKDE9PT1iLnRhZyl7dmFyIGQ9Yi5zdGF0ZU5vZGU7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGIudHlwZS5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3J8fFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkLmNvbXBvbmVudERpZENhdGNoJiYobnVsbD09PVJpfHwhUmkuaGFzKGQpKSl7YT1KaShjLGEpO2E9UWkoYixhLDEpO2I9bmgoYixhLDEpO2E9UigpO251bGwhPT1iJiYoQWMoYiwxLGEpLERrKGIsYSkpO2JyZWFrfX1iPWIucmV0dXJufX1cbmZ1bmN0aW9uIFRpKGEsYixjKXt2YXIgZD1hLnBpbmdDYWNoZTtudWxsIT09ZCYmZC5kZWxldGUoYik7Yj1SKCk7YS5waW5nZWRMYW5lc3w9YS5zdXNwZW5kZWRMYW5lcyZjO1E9PT1hJiYoWiZjKT09PWMmJig0PT09VHx8Mz09PVQmJihaJjEzMDAyMzQyNCk9PT1aJiY1MDA+QigpLWZrP0trKGEsMCk6cmt8PWMpO0RrKGEsYil9ZnVuY3Rpb24gWWsoYSxiKXswPT09YiYmKDA9PT0oYS5tb2RlJjEpP2I9MTooYj1zYyxzYzw8PTEsMD09PShzYyYxMzAwMjM0MjQpJiYoc2M9NDE5NDMwNCkpKTt2YXIgYz1SKCk7YT1paChhLGIpO251bGwhPT1hJiYoQWMoYSxiLGMpLERrKGEsYykpfWZ1bmN0aW9uIHVqKGEpe3ZhciBiPWEubWVtb2l6ZWRTdGF0ZSxjPTA7bnVsbCE9PWImJihjPWIucmV0cnlMYW5lKTtZayhhLGMpfVxuZnVuY3Rpb24gYmsoYSxiKXt2YXIgYz0wO3N3aXRjaChhLnRhZyl7Y2FzZSAxMzp2YXIgZD1hLnN0YXRlTm9kZTt2YXIgZT1hLm1lbW9pemVkU3RhdGU7bnVsbCE9PWUmJihjPWUucmV0cnlMYW5lKTticmVhaztjYXNlIDE5OmQ9YS5zdGF0ZU5vZGU7YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihwKDMxNCkpO31udWxsIT09ZCYmZC5kZWxldGUoYik7WWsoYSxjKX12YXIgVms7XG5Waz1mdW5jdGlvbihhLGIsYyl7aWYobnVsbCE9PWEpaWYoYS5tZW1vaXplZFByb3BzIT09Yi5wZW5kaW5nUHJvcHN8fFdmLmN1cnJlbnQpZGg9ITA7ZWxzZXtpZigwPT09KGEubGFuZXMmYykmJjA9PT0oYi5mbGFncyYxMjgpKXJldHVybiBkaD0hMSx5aihhLGIsYyk7ZGg9MCE9PShhLmZsYWdzJjEzMTA3Mik/ITA6ITF9ZWxzZSBkaD0hMSxJJiYwIT09KGIuZmxhZ3MmMTA0ODU3NikmJnVnKGIsbmcsYi5pbmRleCk7Yi5sYW5lcz0wO3N3aXRjaChiLnRhZyl7Y2FzZSAyOnZhciBkPWIudHlwZTtpaihhLGIpO2E9Yi5wZW5kaW5nUHJvcHM7dmFyIGU9WWYoYixILmN1cnJlbnQpO2NoKGIsYyk7ZT1OaChudWxsLGIsZCxhLGUsYyk7dmFyIGY9U2goKTtiLmZsYWdzfD0xO1wib2JqZWN0XCI9PT10eXBlb2YgZSYmbnVsbCE9PWUmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBlLnJlbmRlciYmdm9pZCAwPT09ZS4kJHR5cGVvZj8oYi50YWc9MSxiLm1lbW9pemVkU3RhdGU9bnVsbCxiLnVwZGF0ZVF1ZXVlPVxubnVsbCxaZihkKT8oZj0hMCxjZyhiKSk6Zj0hMSxiLm1lbW9pemVkU3RhdGU9bnVsbCE9PWUuc3RhdGUmJnZvaWQgMCE9PWUuc3RhdGU/ZS5zdGF0ZTpudWxsLGtoKGIpLGUudXBkYXRlcj1FaSxiLnN0YXRlTm9kZT1lLGUuX3JlYWN0SW50ZXJuYWxzPWIsSWkoYixkLGEsYyksYj1qaihudWxsLGIsZCwhMCxmLGMpKTooYi50YWc9MCxJJiZmJiZ2ZyhiKSxYaShudWxsLGIsZSxjKSxiPWIuY2hpbGQpO3JldHVybiBiO2Nhc2UgMTY6ZD1iLmVsZW1lbnRUeXBlO2E6e2lqKGEsYik7YT1iLnBlbmRpbmdQcm9wcztlPWQuX2luaXQ7ZD1lKGQuX3BheWxvYWQpO2IudHlwZT1kO2U9Yi50YWc9WmsoZCk7YT1DaShkLGEpO3N3aXRjaChlKXtjYXNlIDA6Yj1jaihudWxsLGIsZCxhLGMpO2JyZWFrIGE7Y2FzZSAxOmI9aGoobnVsbCxiLGQsYSxjKTticmVhayBhO2Nhc2UgMTE6Yj1ZaShudWxsLGIsZCxhLGMpO2JyZWFrIGE7Y2FzZSAxNDpiPSRpKG51bGwsYixkLENpKGQudHlwZSxhKSxjKTticmVhayBhfXRocm93IEVycm9yKHAoMzA2LFxuZCxcIlwiKSk7fXJldHVybiBiO2Nhc2UgMDpyZXR1cm4gZD1iLnR5cGUsZT1iLnBlbmRpbmdQcm9wcyxlPWIuZWxlbWVudFR5cGU9PT1kP2U6Q2koZCxlKSxjaihhLGIsZCxlLGMpO2Nhc2UgMTpyZXR1cm4gZD1iLnR5cGUsZT1iLnBlbmRpbmdQcm9wcyxlPWIuZWxlbWVudFR5cGU9PT1kP2U6Q2koZCxlKSxoaihhLGIsZCxlLGMpO2Nhc2UgMzphOntraihiKTtpZihudWxsPT09YSl0aHJvdyBFcnJvcihwKDM4NykpO2Q9Yi5wZW5kaW5nUHJvcHM7Zj1iLm1lbW9pemVkU3RhdGU7ZT1mLmVsZW1lbnQ7bGgoYSxiKTtxaChiLGQsbnVsbCxjKTt2YXIgZz1iLm1lbW9pemVkU3RhdGU7ZD1nLmVsZW1lbnQ7aWYoZi5pc0RlaHlkcmF0ZWQpaWYoZj17ZWxlbWVudDpkLGlzRGVoeWRyYXRlZDohMSxjYWNoZTpnLmNhY2hlLHBlbmRpbmdTdXNwZW5zZUJvdW5kYXJpZXM6Zy5wZW5kaW5nU3VzcGVuc2VCb3VuZGFyaWVzLHRyYW5zaXRpb25zOmcudHJhbnNpdGlvbnN9LGIudXBkYXRlUXVldWUuYmFzZVN0YXRlPVxuZixiLm1lbW9pemVkU3RhdGU9ZixiLmZsYWdzJjI1Nil7ZT1KaShFcnJvcihwKDQyMykpLGIpO2I9bGooYSxiLGQsYyxlKTticmVhayBhfWVsc2UgaWYoZCE9PWUpe2U9SmkoRXJyb3IocCg0MjQpKSxiKTtiPWxqKGEsYixkLGMsZSk7YnJlYWsgYX1lbHNlIGZvcih5Zz1MZihiLnN0YXRlTm9kZS5jb250YWluZXJJbmZvLmZpcnN0Q2hpbGQpLHhnPWIsST0hMCx6Zz1udWxsLGM9VmcoYixudWxsLGQsYyksYi5jaGlsZD1jO2M7KWMuZmxhZ3M9Yy5mbGFncyYtM3w0MDk2LGM9Yy5zaWJsaW5nO2Vsc2V7SWcoKTtpZihkPT09ZSl7Yj1aaShhLGIsYyk7YnJlYWsgYX1YaShhLGIsZCxjKX1iPWIuY2hpbGR9cmV0dXJuIGI7Y2FzZSA1OnJldHVybiBBaChiKSxudWxsPT09YSYmRWcoYiksZD1iLnR5cGUsZT1iLnBlbmRpbmdQcm9wcyxmPW51bGwhPT1hP2EubWVtb2l6ZWRQcm9wczpudWxsLGc9ZS5jaGlsZHJlbixFZihkLGUpP2c9bnVsbDpudWxsIT09ZiYmRWYoZCxmKSYmKGIuZmxhZ3N8PTMyKSxcbmdqKGEsYiksWGkoYSxiLGcsYyksYi5jaGlsZDtjYXNlIDY6cmV0dXJuIG51bGw9PT1hJiZFZyhiKSxudWxsO2Nhc2UgMTM6cmV0dXJuIG9qKGEsYixjKTtjYXNlIDQ6cmV0dXJuIHloKGIsYi5zdGF0ZU5vZGUuY29udGFpbmVySW5mbyksZD1iLnBlbmRpbmdQcm9wcyxudWxsPT09YT9iLmNoaWxkPVVnKGIsbnVsbCxkLGMpOlhpKGEsYixkLGMpLGIuY2hpbGQ7Y2FzZSAxMTpyZXR1cm4gZD1iLnR5cGUsZT1iLnBlbmRpbmdQcm9wcyxlPWIuZWxlbWVudFR5cGU9PT1kP2U6Q2koZCxlKSxZaShhLGIsZCxlLGMpO2Nhc2UgNzpyZXR1cm4gWGkoYSxiLGIucGVuZGluZ1Byb3BzLGMpLGIuY2hpbGQ7Y2FzZSA4OnJldHVybiBYaShhLGIsYi5wZW5kaW5nUHJvcHMuY2hpbGRyZW4sYyksYi5jaGlsZDtjYXNlIDEyOnJldHVybiBYaShhLGIsYi5wZW5kaW5nUHJvcHMuY2hpbGRyZW4sYyksYi5jaGlsZDtjYXNlIDEwOmE6e2Q9Yi50eXBlLl9jb250ZXh0O2U9Yi5wZW5kaW5nUHJvcHM7Zj1iLm1lbW9pemVkUHJvcHM7XG5nPWUudmFsdWU7RyhXZyxkLl9jdXJyZW50VmFsdWUpO2QuX2N1cnJlbnRWYWx1ZT1nO2lmKG51bGwhPT1mKWlmKEhlKGYudmFsdWUsZykpe2lmKGYuY2hpbGRyZW49PT1lLmNoaWxkcmVuJiYhV2YuY3VycmVudCl7Yj1aaShhLGIsYyk7YnJlYWsgYX19ZWxzZSBmb3IoZj1iLmNoaWxkLG51bGwhPT1mJiYoZi5yZXR1cm49Yik7bnVsbCE9PWY7KXt2YXIgaD1mLmRlcGVuZGVuY2llcztpZihudWxsIT09aCl7Zz1mLmNoaWxkO2Zvcih2YXIgaz1oLmZpcnN0Q29udGV4dDtudWxsIT09azspe2lmKGsuY29udGV4dD09PWQpe2lmKDE9PT1mLnRhZyl7az1taCgtMSxjJi1jKTtrLnRhZz0yO3ZhciBsPWYudXBkYXRlUXVldWU7aWYobnVsbCE9PWwpe2w9bC5zaGFyZWQ7dmFyIG09bC5wZW5kaW5nO251bGw9PT1tP2submV4dD1rOihrLm5leHQ9bS5uZXh0LG0ubmV4dD1rKTtsLnBlbmRpbmc9a319Zi5sYW5lc3w9YztrPWYuYWx0ZXJuYXRlO251bGwhPT1rJiYoay5sYW5lc3w9Yyk7YmgoZi5yZXR1cm4sXG5jLGIpO2gubGFuZXN8PWM7YnJlYWt9az1rLm5leHR9fWVsc2UgaWYoMTA9PT1mLnRhZylnPWYudHlwZT09PWIudHlwZT9udWxsOmYuY2hpbGQ7ZWxzZSBpZigxOD09PWYudGFnKXtnPWYucmV0dXJuO2lmKG51bGw9PT1nKXRocm93IEVycm9yKHAoMzQxKSk7Zy5sYW5lc3w9YztoPWcuYWx0ZXJuYXRlO251bGwhPT1oJiYoaC5sYW5lc3w9Yyk7YmgoZyxjLGIpO2c9Zi5zaWJsaW5nfWVsc2UgZz1mLmNoaWxkO2lmKG51bGwhPT1nKWcucmV0dXJuPWY7ZWxzZSBmb3IoZz1mO251bGwhPT1nOyl7aWYoZz09PWIpe2c9bnVsbDticmVha31mPWcuc2libGluZztpZihudWxsIT09Zil7Zi5yZXR1cm49Zy5yZXR1cm47Zz1mO2JyZWFrfWc9Zy5yZXR1cm59Zj1nfVhpKGEsYixlLmNoaWxkcmVuLGMpO2I9Yi5jaGlsZH1yZXR1cm4gYjtjYXNlIDk6cmV0dXJuIGU9Yi50eXBlLGQ9Yi5wZW5kaW5nUHJvcHMuY2hpbGRyZW4sY2goYixjKSxlPWVoKGUpLGQ9ZChlKSxiLmZsYWdzfD0xLFhpKGEsYixkLGMpLFxuYi5jaGlsZDtjYXNlIDE0OnJldHVybiBkPWIudHlwZSxlPUNpKGQsYi5wZW5kaW5nUHJvcHMpLGU9Q2koZC50eXBlLGUpLCRpKGEsYixkLGUsYyk7Y2FzZSAxNTpyZXR1cm4gYmooYSxiLGIudHlwZSxiLnBlbmRpbmdQcm9wcyxjKTtjYXNlIDE3OnJldHVybiBkPWIudHlwZSxlPWIucGVuZGluZ1Byb3BzLGU9Yi5lbGVtZW50VHlwZT09PWQ/ZTpDaShkLGUpLGlqKGEsYiksYi50YWc9MSxaZihkKT8oYT0hMCxjZyhiKSk6YT0hMSxjaChiLGMpLEdpKGIsZCxlKSxJaShiLGQsZSxjKSxqaihudWxsLGIsZCwhMCxhLGMpO2Nhc2UgMTk6cmV0dXJuIHhqKGEsYixjKTtjYXNlIDIyOnJldHVybiBkaihhLGIsYyl9dGhyb3cgRXJyb3IocCgxNTYsYi50YWcpKTt9O2Z1bmN0aW9uIEZrKGEsYil7cmV0dXJuIGFjKGEsYil9XG5mdW5jdGlvbiAkayhhLGIsYyxkKXt0aGlzLnRhZz1hO3RoaXMua2V5PWM7dGhpcy5zaWJsaW5nPXRoaXMuY2hpbGQ9dGhpcy5yZXR1cm49dGhpcy5zdGF0ZU5vZGU9dGhpcy50eXBlPXRoaXMuZWxlbWVudFR5cGU9bnVsbDt0aGlzLmluZGV4PTA7dGhpcy5yZWY9bnVsbDt0aGlzLnBlbmRpbmdQcm9wcz1iO3RoaXMuZGVwZW5kZW5jaWVzPXRoaXMubWVtb2l6ZWRTdGF0ZT10aGlzLnVwZGF0ZVF1ZXVlPXRoaXMubWVtb2l6ZWRQcm9wcz1udWxsO3RoaXMubW9kZT1kO3RoaXMuc3VidHJlZUZsYWdzPXRoaXMuZmxhZ3M9MDt0aGlzLmRlbGV0aW9ucz1udWxsO3RoaXMuY2hpbGRMYW5lcz10aGlzLmxhbmVzPTA7dGhpcy5hbHRlcm5hdGU9bnVsbH1mdW5jdGlvbiBCZyhhLGIsYyxkKXtyZXR1cm4gbmV3ICRrKGEsYixjLGQpfWZ1bmN0aW9uIGFqKGEpe2E9YS5wcm90b3R5cGU7cmV0dXJuISghYXx8IWEuaXNSZWFjdENvbXBvbmVudCl9XG5mdW5jdGlvbiBaayhhKXtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYSlyZXR1cm4gYWooYSk/MTowO2lmKHZvaWQgMCE9PWEmJm51bGwhPT1hKXthPWEuJCR0eXBlb2Y7aWYoYT09PURhKXJldHVybiAxMTtpZihhPT09R2EpcmV0dXJuIDE0fXJldHVybiAyfVxuZnVuY3Rpb24gUGcoYSxiKXt2YXIgYz1hLmFsdGVybmF0ZTtudWxsPT09Yz8oYz1CZyhhLnRhZyxiLGEua2V5LGEubW9kZSksYy5lbGVtZW50VHlwZT1hLmVsZW1lbnRUeXBlLGMudHlwZT1hLnR5cGUsYy5zdGF0ZU5vZGU9YS5zdGF0ZU5vZGUsYy5hbHRlcm5hdGU9YSxhLmFsdGVybmF0ZT1jKTooYy5wZW5kaW5nUHJvcHM9YixjLnR5cGU9YS50eXBlLGMuZmxhZ3M9MCxjLnN1YnRyZWVGbGFncz0wLGMuZGVsZXRpb25zPW51bGwpO2MuZmxhZ3M9YS5mbGFncyYxNDY4MDA2NDtjLmNoaWxkTGFuZXM9YS5jaGlsZExhbmVzO2MubGFuZXM9YS5sYW5lcztjLmNoaWxkPWEuY2hpbGQ7Yy5tZW1vaXplZFByb3BzPWEubWVtb2l6ZWRQcm9wcztjLm1lbW9pemVkU3RhdGU9YS5tZW1vaXplZFN0YXRlO2MudXBkYXRlUXVldWU9YS51cGRhdGVRdWV1ZTtiPWEuZGVwZW5kZW5jaWVzO2MuZGVwZW5kZW5jaWVzPW51bGw9PT1iP251bGw6e2xhbmVzOmIubGFuZXMsZmlyc3RDb250ZXh0OmIuZmlyc3RDb250ZXh0fTtcbmMuc2libGluZz1hLnNpYmxpbmc7Yy5pbmRleD1hLmluZGV4O2MucmVmPWEucmVmO3JldHVybiBjfVxuZnVuY3Rpb24gUmcoYSxiLGMsZCxlLGYpe3ZhciBnPTI7ZD1hO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhKWFqKGEpJiYoZz0xKTtlbHNlIGlmKFwic3RyaW5nXCI9PT10eXBlb2YgYSlnPTU7ZWxzZSBhOnN3aXRjaChhKXtjYXNlIHlhOnJldHVybiBUZyhjLmNoaWxkcmVuLGUsZixiKTtjYXNlIHphOmc9ODtlfD04O2JyZWFrO2Nhc2UgQWE6cmV0dXJuIGE9QmcoMTIsYyxiLGV8MiksYS5lbGVtZW50VHlwZT1BYSxhLmxhbmVzPWYsYTtjYXNlIEVhOnJldHVybiBhPUJnKDEzLGMsYixlKSxhLmVsZW1lbnRUeXBlPUVhLGEubGFuZXM9ZixhO2Nhc2UgRmE6cmV0dXJuIGE9QmcoMTksYyxiLGUpLGEuZWxlbWVudFR5cGU9RmEsYS5sYW5lcz1mLGE7Y2FzZSBJYTpyZXR1cm4gcGooYyxlLGYsYik7ZGVmYXVsdDppZihcIm9iamVjdFwiPT09dHlwZW9mIGEmJm51bGwhPT1hKXN3aXRjaChhLiQkdHlwZW9mKXtjYXNlIEJhOmc9MTA7YnJlYWsgYTtjYXNlIENhOmc9OTticmVhayBhO2Nhc2UgRGE6Zz0xMTtcbmJyZWFrIGE7Y2FzZSBHYTpnPTE0O2JyZWFrIGE7Y2FzZSBIYTpnPTE2O2Q9bnVsbDticmVhayBhfXRocm93IEVycm9yKHAoMTMwLG51bGw9PWE/YTp0eXBlb2YgYSxcIlwiKSk7fWI9QmcoZyxjLGIsZSk7Yi5lbGVtZW50VHlwZT1hO2IudHlwZT1kO2IubGFuZXM9ZjtyZXR1cm4gYn1mdW5jdGlvbiBUZyhhLGIsYyxkKXthPUJnKDcsYSxkLGIpO2EubGFuZXM9YztyZXR1cm4gYX1mdW5jdGlvbiBwaihhLGIsYyxkKXthPUJnKDIyLGEsZCxiKTthLmVsZW1lbnRUeXBlPUlhO2EubGFuZXM9YzthLnN0YXRlTm9kZT17aXNIaWRkZW46ITF9O3JldHVybiBhfWZ1bmN0aW9uIFFnKGEsYixjKXthPUJnKDYsYSxudWxsLGIpO2EubGFuZXM9YztyZXR1cm4gYX1cbmZ1bmN0aW9uIFNnKGEsYixjKXtiPUJnKDQsbnVsbCE9PWEuY2hpbGRyZW4/YS5jaGlsZHJlbjpbXSxhLmtleSxiKTtiLmxhbmVzPWM7Yi5zdGF0ZU5vZGU9e2NvbnRhaW5lckluZm86YS5jb250YWluZXJJbmZvLHBlbmRpbmdDaGlsZHJlbjpudWxsLGltcGxlbWVudGF0aW9uOmEuaW1wbGVtZW50YXRpb259O3JldHVybiBifVxuZnVuY3Rpb24gYWwoYSxiLGMsZCxlKXt0aGlzLnRhZz1iO3RoaXMuY29udGFpbmVySW5mbz1hO3RoaXMuZmluaXNoZWRXb3JrPXRoaXMucGluZ0NhY2hlPXRoaXMuY3VycmVudD10aGlzLnBlbmRpbmdDaGlsZHJlbj1udWxsO3RoaXMudGltZW91dEhhbmRsZT0tMTt0aGlzLmNhbGxiYWNrTm9kZT10aGlzLnBlbmRpbmdDb250ZXh0PXRoaXMuY29udGV4dD1udWxsO3RoaXMuY2FsbGJhY2tQcmlvcml0eT0wO3RoaXMuZXZlbnRUaW1lcz16YygwKTt0aGlzLmV4cGlyYXRpb25UaW1lcz16YygtMSk7dGhpcy5lbnRhbmdsZWRMYW5lcz10aGlzLmZpbmlzaGVkTGFuZXM9dGhpcy5tdXRhYmxlUmVhZExhbmVzPXRoaXMuZXhwaXJlZExhbmVzPXRoaXMucGluZ2VkTGFuZXM9dGhpcy5zdXNwZW5kZWRMYW5lcz10aGlzLnBlbmRpbmdMYW5lcz0wO3RoaXMuZW50YW5nbGVtZW50cz16YygwKTt0aGlzLmlkZW50aWZpZXJQcmVmaXg9ZDt0aGlzLm9uUmVjb3ZlcmFibGVFcnJvcj1lO3RoaXMubXV0YWJsZVNvdXJjZUVhZ2VySHlkcmF0aW9uRGF0YT1cbm51bGx9ZnVuY3Rpb24gYmwoYSxiLGMsZCxlLGYsZyxoLGspe2E9bmV3IGFsKGEsYixjLGgsayk7MT09PWI/KGI9MSwhMD09PWYmJihifD04KSk6Yj0wO2Y9QmcoMyxudWxsLG51bGwsYik7YS5jdXJyZW50PWY7Zi5zdGF0ZU5vZGU9YTtmLm1lbW9pemVkU3RhdGU9e2VsZW1lbnQ6ZCxpc0RlaHlkcmF0ZWQ6YyxjYWNoZTpudWxsLHRyYW5zaXRpb25zOm51bGwscGVuZGluZ1N1c3BlbnNlQm91bmRhcmllczpudWxsfTtraChmKTtyZXR1cm4gYX1mdW5jdGlvbiBjbChhLGIsYyl7dmFyIGQ9Mzxhcmd1bWVudHMubGVuZ3RoJiZ2b2lkIDAhPT1hcmd1bWVudHNbM10/YXJndW1lbnRzWzNdOm51bGw7cmV0dXJueyQkdHlwZW9mOndhLGtleTpudWxsPT1kP251bGw6XCJcIitkLGNoaWxkcmVuOmEsY29udGFpbmVySW5mbzpiLGltcGxlbWVudGF0aW9uOmN9fVxuZnVuY3Rpb24gZGwoYSl7aWYoIWEpcmV0dXJuIFZmO2E9YS5fcmVhY3RJbnRlcm5hbHM7YTp7aWYoVmIoYSkhPT1hfHwxIT09YS50YWcpdGhyb3cgRXJyb3IocCgxNzApKTt2YXIgYj1hO2Rve3N3aXRjaChiLnRhZyl7Y2FzZSAzOmI9Yi5zdGF0ZU5vZGUuY29udGV4dDticmVhayBhO2Nhc2UgMTppZihaZihiLnR5cGUpKXtiPWIuc3RhdGVOb2RlLl9fcmVhY3RJbnRlcm5hbE1lbW9pemVkTWVyZ2VkQ2hpbGRDb250ZXh0O2JyZWFrIGF9fWI9Yi5yZXR1cm59d2hpbGUobnVsbCE9PWIpO3Rocm93IEVycm9yKHAoMTcxKSk7fWlmKDE9PT1hLnRhZyl7dmFyIGM9YS50eXBlO2lmKFpmKGMpKXJldHVybiBiZyhhLGMsYil9cmV0dXJuIGJ9XG5mdW5jdGlvbiBlbChhLGIsYyxkLGUsZixnLGgsayl7YT1ibChjLGQsITAsYSxlLGYsZyxoLGspO2EuY29udGV4dD1kbChudWxsKTtjPWEuY3VycmVudDtkPVIoKTtlPXlpKGMpO2Y9bWgoZCxlKTtmLmNhbGxiYWNrPXZvaWQgMCE9PWImJm51bGwhPT1iP2I6bnVsbDtuaChjLGYsZSk7YS5jdXJyZW50LmxhbmVzPWU7QWMoYSxlLGQpO0RrKGEsZCk7cmV0dXJuIGF9ZnVuY3Rpb24gZmwoYSxiLGMsZCl7dmFyIGU9Yi5jdXJyZW50LGY9UigpLGc9eWkoZSk7Yz1kbChjKTtudWxsPT09Yi5jb250ZXh0P2IuY29udGV4dD1jOmIucGVuZGluZ0NvbnRleHQ9YztiPW1oKGYsZyk7Yi5wYXlsb2FkPXtlbGVtZW50OmF9O2Q9dm9pZCAwPT09ZD9udWxsOmQ7bnVsbCE9PWQmJihiLmNhbGxiYWNrPWQpO2E9bmgoZSxiLGcpO251bGwhPT1hJiYoZ2koYSxlLGcsZiksb2goYSxlLGcpKTtyZXR1cm4gZ31cbmZ1bmN0aW9uIGdsKGEpe2E9YS5jdXJyZW50O2lmKCFhLmNoaWxkKXJldHVybiBudWxsO3N3aXRjaChhLmNoaWxkLnRhZyl7Y2FzZSA1OnJldHVybiBhLmNoaWxkLnN0YXRlTm9kZTtkZWZhdWx0OnJldHVybiBhLmNoaWxkLnN0YXRlTm9kZX19ZnVuY3Rpb24gaGwoYSxiKXthPWEubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09YSYmbnVsbCE9PWEuZGVoeWRyYXRlZCl7dmFyIGM9YS5yZXRyeUxhbmU7YS5yZXRyeUxhbmU9MCE9PWMmJmM8Yj9jOmJ9fWZ1bmN0aW9uIGlsKGEsYil7aGwoYSxiKTsoYT1hLmFsdGVybmF0ZSkmJmhsKGEsYil9ZnVuY3Rpb24gamwoKXtyZXR1cm4gbnVsbH12YXIga2w9XCJmdW5jdGlvblwiPT09dHlwZW9mIHJlcG9ydEVycm9yP3JlcG9ydEVycm9yOmZ1bmN0aW9uKGEpe2NvbnNvbGUuZXJyb3IoYSl9O2Z1bmN0aW9uIGxsKGEpe3RoaXMuX2ludGVybmFsUm9vdD1hfVxubWwucHJvdG90eXBlLnJlbmRlcj1sbC5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuX2ludGVybmFsUm9vdDtpZihudWxsPT09Yil0aHJvdyBFcnJvcihwKDQwOSkpO2ZsKGEsYixudWxsLG51bGwpfTttbC5wcm90b3R5cGUudW5tb3VudD1sbC5wcm90b3R5cGUudW5tb3VudD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuX2ludGVybmFsUm9vdDtpZihudWxsIT09YSl7dGhpcy5faW50ZXJuYWxSb290PW51bGw7dmFyIGI9YS5jb250YWluZXJJbmZvO1JrKGZ1bmN0aW9uKCl7ZmwobnVsbCxhLG51bGwsbnVsbCl9KTtiW3VmXT1udWxsfX07ZnVuY3Rpb24gbWwoYSl7dGhpcy5faW50ZXJuYWxSb290PWF9XG5tbC5wcm90b3R5cGUudW5zdGFibGVfc2NoZWR1bGVIeWRyYXRpb249ZnVuY3Rpb24oYSl7aWYoYSl7dmFyIGI9SGMoKTthPXtibG9ja2VkT246bnVsbCx0YXJnZXQ6YSxwcmlvcml0eTpifTtmb3IodmFyIGM9MDtjPFFjLmxlbmd0aCYmMCE9PWImJmI8UWNbY10ucHJpb3JpdHk7YysrKTtRYy5zcGxpY2UoYywwLGEpOzA9PT1jJiZWYyhhKX19O2Z1bmN0aW9uIG5sKGEpe3JldHVybiEoIWF8fDEhPT1hLm5vZGVUeXBlJiY5IT09YS5ub2RlVHlwZSYmMTEhPT1hLm5vZGVUeXBlKX1mdW5jdGlvbiBvbChhKXtyZXR1cm4hKCFhfHwxIT09YS5ub2RlVHlwZSYmOSE9PWEubm9kZVR5cGUmJjExIT09YS5ub2RlVHlwZSYmKDghPT1hLm5vZGVUeXBlfHxcIiByZWFjdC1tb3VudC1wb2ludC11bnN0YWJsZSBcIiE9PWEubm9kZVZhbHVlKSl9ZnVuY3Rpb24gcGwoKXt9XG5mdW5jdGlvbiBxbChhLGIsYyxkLGUpe2lmKGUpe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkKXt2YXIgZj1kO2Q9ZnVuY3Rpb24oKXt2YXIgYT1nbChnKTtmLmNhbGwoYSl9fXZhciBnPWVsKGIsZCxhLDAsbnVsbCwhMSwhMSxcIlwiLHBsKTthLl9yZWFjdFJvb3RDb250YWluZXI9ZzthW3VmXT1nLmN1cnJlbnQ7c2YoOD09PWEubm9kZVR5cGU/YS5wYXJlbnROb2RlOmEpO1JrKCk7cmV0dXJuIGd9Zm9yKDtlPWEubGFzdENoaWxkOylhLnJlbW92ZUNoaWxkKGUpO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkKXt2YXIgaD1kO2Q9ZnVuY3Rpb24oKXt2YXIgYT1nbChrKTtoLmNhbGwoYSl9fXZhciBrPWJsKGEsMCwhMSxudWxsLG51bGwsITEsITEsXCJcIixwbCk7YS5fcmVhY3RSb290Q29udGFpbmVyPWs7YVt1Zl09ay5jdXJyZW50O3NmKDg9PT1hLm5vZGVUeXBlP2EucGFyZW50Tm9kZTphKTtSayhmdW5jdGlvbigpe2ZsKGIsayxjLGQpfSk7cmV0dXJuIGt9XG5mdW5jdGlvbiBybChhLGIsYyxkLGUpe3ZhciBmPWMuX3JlYWN0Um9vdENvbnRhaW5lcjtpZihmKXt2YXIgZz1mO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBlKXt2YXIgaD1lO2U9ZnVuY3Rpb24oKXt2YXIgYT1nbChnKTtoLmNhbGwoYSl9fWZsKGIsZyxhLGUpfWVsc2UgZz1xbChjLGIsYSxlLGQpO3JldHVybiBnbChnKX1FYz1mdW5jdGlvbihhKXtzd2l0Y2goYS50YWcpe2Nhc2UgMzp2YXIgYj1hLnN0YXRlTm9kZTtpZihiLmN1cnJlbnQubWVtb2l6ZWRTdGF0ZS5pc0RlaHlkcmF0ZWQpe3ZhciBjPXRjKGIucGVuZGluZ0xhbmVzKTswIT09YyYmKENjKGIsY3wxKSxEayhiLEIoKSksMD09PShLJjYpJiYoR2o9QigpKzUwMCxqZygpKSl9YnJlYWs7Y2FzZSAxMzpSayhmdW5jdGlvbigpe3ZhciBiPWloKGEsMSk7aWYobnVsbCE9PWIpe3ZhciBjPVIoKTtnaShiLGEsMSxjKX19KSxpbChhLDEpfX07XG5GYz1mdW5jdGlvbihhKXtpZigxMz09PWEudGFnKXt2YXIgYj1paChhLDEzNDIxNzcyOCk7aWYobnVsbCE9PWIpe3ZhciBjPVIoKTtnaShiLGEsMTM0MjE3NzI4LGMpfWlsKGEsMTM0MjE3NzI4KX19O0djPWZ1bmN0aW9uKGEpe2lmKDEzPT09YS50YWcpe3ZhciBiPXlpKGEpLGM9aWgoYSxiKTtpZihudWxsIT09Yyl7dmFyIGQ9UigpO2dpKGMsYSxiLGQpfWlsKGEsYil9fTtIYz1mdW5jdGlvbigpe3JldHVybiBDfTtJYz1mdW5jdGlvbihhLGIpe3ZhciBjPUM7dHJ5e3JldHVybiBDPWEsYigpfWZpbmFsbHl7Qz1jfX07XG55Yj1mdW5jdGlvbihhLGIsYyl7c3dpdGNoKGIpe2Nhc2UgXCJpbnB1dFwiOmJiKGEsYyk7Yj1jLm5hbWU7aWYoXCJyYWRpb1wiPT09Yy50eXBlJiZudWxsIT1iKXtmb3IoYz1hO2MucGFyZW50Tm9kZTspYz1jLnBhcmVudE5vZGU7Yz1jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFtuYW1lPVwiK0pTT04uc3RyaW5naWZ5KFwiXCIrYikrJ11bdHlwZT1cInJhZGlvXCJdJyk7Zm9yKGI9MDtiPGMubGVuZ3RoO2IrKyl7dmFyIGQ9Y1tiXTtpZihkIT09YSYmZC5mb3JtPT09YS5mb3JtKXt2YXIgZT1EYihkKTtpZighZSl0aHJvdyBFcnJvcihwKDkwKSk7V2EoZCk7YmIoZCxlKX19fWJyZWFrO2Nhc2UgXCJ0ZXh0YXJlYVwiOmliKGEsYyk7YnJlYWs7Y2FzZSBcInNlbGVjdFwiOmI9Yy52YWx1ZSxudWxsIT1iJiZmYihhLCEhYy5tdWx0aXBsZSxiLCExKX19O0diPVFrO0hiPVJrO1xudmFyIHNsPXt1c2luZ0NsaWVudEVudHJ5UG9pbnQ6ITEsRXZlbnRzOltDYix1ZSxEYixFYixGYixRa119LHRsPXtmaW5kRmliZXJCeUhvc3RJbnN0YW5jZTpXYyxidW5kbGVUeXBlOjAsdmVyc2lvbjpcIjE4LjMuMVwiLHJlbmRlcmVyUGFja2FnZU5hbWU6XCJyZWFjdC1kb21cIn07XG52YXIgdWw9e2J1bmRsZVR5cGU6dGwuYnVuZGxlVHlwZSx2ZXJzaW9uOnRsLnZlcnNpb24scmVuZGVyZXJQYWNrYWdlTmFtZTp0bC5yZW5kZXJlclBhY2thZ2VOYW1lLHJlbmRlcmVyQ29uZmlnOnRsLnJlbmRlcmVyQ29uZmlnLG92ZXJyaWRlSG9va1N0YXRlOm51bGwsb3ZlcnJpZGVIb29rU3RhdGVEZWxldGVQYXRoOm51bGwsb3ZlcnJpZGVIb29rU3RhdGVSZW5hbWVQYXRoOm51bGwsb3ZlcnJpZGVQcm9wczpudWxsLG92ZXJyaWRlUHJvcHNEZWxldGVQYXRoOm51bGwsb3ZlcnJpZGVQcm9wc1JlbmFtZVBhdGg6bnVsbCxzZXRFcnJvckhhbmRsZXI6bnVsbCxzZXRTdXNwZW5zZUhhbmRsZXI6bnVsbCxzY2hlZHVsZVVwZGF0ZTpudWxsLGN1cnJlbnREaXNwYXRjaGVyUmVmOnVhLlJlYWN0Q3VycmVudERpc3BhdGNoZXIsZmluZEhvc3RJbnN0YW5jZUJ5RmliZXI6ZnVuY3Rpb24oYSl7YT1aYihhKTtyZXR1cm4gbnVsbD09PWE/bnVsbDphLnN0YXRlTm9kZX0sZmluZEZpYmVyQnlIb3N0SW5zdGFuY2U6dGwuZmluZEZpYmVyQnlIb3N0SW5zdGFuY2V8fFxuamwsZmluZEhvc3RJbnN0YW5jZXNGb3JSZWZyZXNoOm51bGwsc2NoZWR1bGVSZWZyZXNoOm51bGwsc2NoZWR1bGVSb290Om51bGwsc2V0UmVmcmVzaEhhbmRsZXI6bnVsbCxnZXRDdXJyZW50RmliZXI6bnVsbCxyZWNvbmNpbGVyVmVyc2lvbjpcIjE4LjMuMS1uZXh0LWYxMzM4ZjgwODAtMjAyNDA0MjZcIn07aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18pe3ZhciB2bD1fX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX187aWYoIXZsLmlzRGlzYWJsZWQmJnZsLnN1cHBvcnRzRmliZXIpdHJ5e2tjPXZsLmluamVjdCh1bCksbGM9dmx9Y2F0Y2goYSl7fX1leHBvcnRzLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEPXNsO1xuZXhwb3J0cy5jcmVhdGVQb3J0YWw9ZnVuY3Rpb24oYSxiKXt2YXIgYz0yPGFyZ3VtZW50cy5sZW5ndGgmJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06bnVsbDtpZighbmwoYikpdGhyb3cgRXJyb3IocCgyMDApKTtyZXR1cm4gY2woYSxiLG51bGwsYyl9O2V4cG9ydHMuY3JlYXRlUm9vdD1mdW5jdGlvbihhLGIpe2lmKCFubChhKSl0aHJvdyBFcnJvcihwKDI5OSkpO3ZhciBjPSExLGQ9XCJcIixlPWtsO251bGwhPT1iJiZ2b2lkIDAhPT1iJiYoITA9PT1iLnVuc3RhYmxlX3N0cmljdE1vZGUmJihjPSEwKSx2b2lkIDAhPT1iLmlkZW50aWZpZXJQcmVmaXgmJihkPWIuaWRlbnRpZmllclByZWZpeCksdm9pZCAwIT09Yi5vblJlY292ZXJhYmxlRXJyb3ImJihlPWIub25SZWNvdmVyYWJsZUVycm9yKSk7Yj1ibChhLDEsITEsbnVsbCxudWxsLGMsITEsZCxlKTthW3VmXT1iLmN1cnJlbnQ7c2YoOD09PWEubm9kZVR5cGU/YS5wYXJlbnROb2RlOmEpO3JldHVybiBuZXcgbGwoYil9O1xuZXhwb3J0cy5maW5kRE9NTm9kZT1mdW5jdGlvbihhKXtpZihudWxsPT1hKXJldHVybiBudWxsO2lmKDE9PT1hLm5vZGVUeXBlKXJldHVybiBhO3ZhciBiPWEuX3JlYWN0SW50ZXJuYWxzO2lmKHZvaWQgMD09PWIpe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLnJlbmRlcil0aHJvdyBFcnJvcihwKDE4OCkpO2E9T2JqZWN0LmtleXMoYSkuam9pbihcIixcIik7dGhyb3cgRXJyb3IocCgyNjgsYSkpO31hPVpiKGIpO2E9bnVsbD09PWE/bnVsbDphLnN0YXRlTm9kZTtyZXR1cm4gYX07ZXhwb3J0cy5mbHVzaFN5bmM9ZnVuY3Rpb24oYSl7cmV0dXJuIFJrKGEpfTtleHBvcnRzLmh5ZHJhdGU9ZnVuY3Rpb24oYSxiLGMpe2lmKCFvbChiKSl0aHJvdyBFcnJvcihwKDIwMCkpO3JldHVybiBybChudWxsLGEsYiwhMCxjKX07XG5leHBvcnRzLmh5ZHJhdGVSb290PWZ1bmN0aW9uKGEsYixjKXtpZighbmwoYSkpdGhyb3cgRXJyb3IocCg0MDUpKTt2YXIgZD1udWxsIT1jJiZjLmh5ZHJhdGVkU291cmNlc3x8bnVsbCxlPSExLGY9XCJcIixnPWtsO251bGwhPT1jJiZ2b2lkIDAhPT1jJiYoITA9PT1jLnVuc3RhYmxlX3N0cmljdE1vZGUmJihlPSEwKSx2b2lkIDAhPT1jLmlkZW50aWZpZXJQcmVmaXgmJihmPWMuaWRlbnRpZmllclByZWZpeCksdm9pZCAwIT09Yy5vblJlY292ZXJhYmxlRXJyb3ImJihnPWMub25SZWNvdmVyYWJsZUVycm9yKSk7Yj1lbChiLG51bGwsYSwxLG51bGwhPWM/YzpudWxsLGUsITEsZixnKTthW3VmXT1iLmN1cnJlbnQ7c2YoYSk7aWYoZClmb3IoYT0wO2E8ZC5sZW5ndGg7YSsrKWM9ZFthXSxlPWMuX2dldFZlcnNpb24sZT1lKGMuX3NvdXJjZSksbnVsbD09Yi5tdXRhYmxlU291cmNlRWFnZXJIeWRyYXRpb25EYXRhP2IubXV0YWJsZVNvdXJjZUVhZ2VySHlkcmF0aW9uRGF0YT1bYyxlXTpiLm11dGFibGVTb3VyY2VFYWdlckh5ZHJhdGlvbkRhdGEucHVzaChjLFxuZSk7cmV0dXJuIG5ldyBtbChiKX07ZXhwb3J0cy5yZW5kZXI9ZnVuY3Rpb24oYSxiLGMpe2lmKCFvbChiKSl0aHJvdyBFcnJvcihwKDIwMCkpO3JldHVybiBybChudWxsLGEsYiwhMSxjKX07ZXhwb3J0cy51bm1vdW50Q29tcG9uZW50QXROb2RlPWZ1bmN0aW9uKGEpe2lmKCFvbChhKSl0aHJvdyBFcnJvcihwKDQwKSk7cmV0dXJuIGEuX3JlYWN0Um9vdENvbnRhaW5lcj8oUmsoZnVuY3Rpb24oKXtybChudWxsLG51bGwsYSwhMSxmdW5jdGlvbigpe2EuX3JlYWN0Um9vdENvbnRhaW5lcj1udWxsO2FbdWZdPW51bGx9KX0pLCEwKTohMX07ZXhwb3J0cy51bnN0YWJsZV9iYXRjaGVkVXBkYXRlcz1RaztcbmV4cG9ydHMudW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXI9ZnVuY3Rpb24oYSxiLGMsZCl7aWYoIW9sKGMpKXRocm93IEVycm9yKHAoMjAwKSk7aWYobnVsbD09YXx8dm9pZCAwPT09YS5fcmVhY3RJbnRlcm5hbHMpdGhyb3cgRXJyb3IocCgzOCkpO3JldHVybiBybChhLGIsYywhMSxkKX07ZXhwb3J0cy52ZXJzaW9uPVwiMTguMy4xLW5leHQtZjEzMzhmODA4MC0yMDI0MDQyNlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgZXhwb3J0cy5jcmVhdGVSb290ID0gbS5jcmVhdGVSb290O1xuICBleHBvcnRzLmh5ZHJhdGVSb290ID0gbS5oeWRyYXRlUm9vdDtcbn0gZWxzZSB7XG4gIHZhciBpID0gbS5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDtcbiAgZXhwb3J0cy5jcmVhdGVSb290ID0gZnVuY3Rpb24oYywgbykge1xuICAgIGkudXNpbmdDbGllbnRFbnRyeVBvaW50ID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG0uY3JlYXRlUm9vdChjLCBvKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaS51c2luZ0NsaWVudEVudHJ5UG9pbnQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG4gIGV4cG9ydHMuaHlkcmF0ZVJvb3QgPSBmdW5jdGlvbihjLCBoLCBvKSB7XG4gICAgaS51c2luZ0NsaWVudEVudHJ5UG9pbnQgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gbS5oeWRyYXRlUm9vdChjLCBoLCBvKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaS51c2luZ0NsaWVudEVudHJ5UG9pbnQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNoZWNrRENFKCkge1xuICAvKiBnbG9iYWwgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fICovXG4gIGlmIChcbiAgICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fID09PSAndW5kZWZpbmVkJyB8fFxuICAgIHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18uY2hlY2tEQ0UgIT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgLy8gVGhpcyBicmFuY2ggaXMgdW5yZWFjaGFibGUgYmVjYXVzZSB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkXG4gICAgLy8gaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBjb25kaXRpb24gaXMgdHJ1ZSBvbmx5IGluIGRldmVsb3BtZW50LlxuICAgIC8vIFRoZXJlZm9yZSBpZiB0aGUgYnJhbmNoIGlzIHN0aWxsIGhlcmUsIGRlYWQgY29kZSBlbGltaW5hdGlvbiB3YXNuJ3RcbiAgICAvLyBwcm9wZXJseSBhcHBsaWVkLlxuICAgIC8vIERvbid0IGNoYW5nZSB0aGUgbWVzc2FnZS4gUmVhY3QgRGV2VG9vbHMgcmVsaWVzIG9uIGl0LiBBbHNvIG1ha2Ugc3VyZVxuICAgIC8vIHRoaXMgbWVzc2FnZSBkb2Vzbid0IG9jY3VyIGVsc2V3aGVyZSBpbiB0aGlzIGZ1bmN0aW9uLCBvciBpdCB3aWxsIGNhdXNlXG4gICAgLy8gYSBmYWxzZSBwb3NpdGl2ZS5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ15fXicpO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGNvZGUgYWJvdmUgaGFzIGJlZW4gZGVhZCBjb2RlIGVsaW1pbmF0ZWQgKERDRSdkKS5cbiAgICBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18uY2hlY2tEQ0UoY2hlY2tEQ0UpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBEZXZUb29scyBzaG91bGRuJ3QgY3Jhc2ggUmVhY3QsIG5vIG1hdHRlciB3aGF0LlxuICAgIC8vIFdlIHNob3VsZCBzdGlsbCByZXBvcnQgaW4gY2FzZSB3ZSBicmVhayB0aGlzIGNvZGUuXG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIC8vIERDRSBjaGVjayBzaG91bGQgaGFwcGVuIGJlZm9yZSBSZWFjdERPTSBidW5kbGUgZXhlY3V0ZXMgc28gdGhhdFxuICAvLyBEZXZUb29scyBjYW4gcmVwb3J0IGJhZCBtaW5pZmljYXRpb24gZHVyaW5nIGluamVjdGlvbi5cbiAgY2hlY2tEQ0UoKTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1kb20ucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtZG9tLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC1qc3gtcnVudGltZS5wcm9kdWN0aW9uLm1pbi5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG4ndXNlIHN0cmljdCc7dmFyIGY9cmVxdWlyZShcInJlYWN0XCIpLGs9U3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIiksbD1TeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIiksbT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LG49Zi5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRC5SZWFjdEN1cnJlbnRPd25lcixwPXtrZXk6ITAscmVmOiEwLF9fc2VsZjohMCxfX3NvdXJjZTohMH07XG5mdW5jdGlvbiBxKGMsYSxnKXt2YXIgYixkPXt9LGU9bnVsbCxoPW51bGw7dm9pZCAwIT09ZyYmKGU9XCJcIitnKTt2b2lkIDAhPT1hLmtleSYmKGU9XCJcIithLmtleSk7dm9pZCAwIT09YS5yZWYmJihoPWEucmVmKTtmb3IoYiBpbiBhKW0uY2FsbChhLGIpJiYhcC5oYXNPd25Qcm9wZXJ0eShiKSYmKGRbYl09YVtiXSk7aWYoYyYmYy5kZWZhdWx0UHJvcHMpZm9yKGIgaW4gYT1jLmRlZmF1bHRQcm9wcyxhKXZvaWQgMD09PWRbYl0mJihkW2JdPWFbYl0pO3JldHVybnskJHR5cGVvZjprLHR5cGU6YyxrZXk6ZSxyZWY6aCxwcm9wczpkLF9vd25lcjpuLmN1cnJlbnR9fWV4cG9ydHMuRnJhZ21lbnQ9bDtleHBvcnRzLmpzeD1xO2V4cG9ydHMuanN4cz1xO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuJ3VzZSBzdHJpY3QnO3ZhciBsPVN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpLG49U3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSxwPVN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSxxPVN5bWJvbC5mb3IoXCJyZWFjdC5zdHJpY3RfbW9kZVwiKSxyPVN5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKSx0PVN5bWJvbC5mb3IoXCJyZWFjdC5wcm92aWRlclwiKSx1PVN5bWJvbC5mb3IoXCJyZWFjdC5jb250ZXh0XCIpLHY9U3ltYm9sLmZvcihcInJlYWN0LmZvcndhcmRfcmVmXCIpLHc9U3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpLHg9U3ltYm9sLmZvcihcInJlYWN0Lm1lbW9cIikseT1TeW1ib2wuZm9yKFwicmVhY3QubGF6eVwiKSx6PVN5bWJvbC5pdGVyYXRvcjtmdW5jdGlvbiBBKGEpe2lmKG51bGw9PT1hfHxcIm9iamVjdFwiIT09dHlwZW9mIGEpcmV0dXJuIG51bGw7YT16JiZhW3pdfHxhW1wiQEBpdGVyYXRvclwiXTtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYT9hOm51bGx9XG52YXIgQj17aXNNb3VudGVkOmZ1bmN0aW9uKCl7cmV0dXJuITF9LGVucXVldWVGb3JjZVVwZGF0ZTpmdW5jdGlvbigpe30sZW5xdWV1ZVJlcGxhY2VTdGF0ZTpmdW5jdGlvbigpe30sZW5xdWV1ZVNldFN0YXRlOmZ1bmN0aW9uKCl7fX0sQz1PYmplY3QuYXNzaWduLEQ9e307ZnVuY3Rpb24gRShhLGIsZSl7dGhpcy5wcm9wcz1hO3RoaXMuY29udGV4dD1iO3RoaXMucmVmcz1EO3RoaXMudXBkYXRlcj1lfHxCfUUucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQ9e307XG5FLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihhLGIpe2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYSYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGEmJm51bGwhPWEpdGhyb3cgRXJyb3IoXCJzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy5cIik7dGhpcy51cGRhdGVyLmVucXVldWVTZXRTdGF0ZSh0aGlzLGEsYixcInNldFN0YXRlXCIpfTtFLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihhKXt0aGlzLnVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlKHRoaXMsYSxcImZvcmNlVXBkYXRlXCIpfTtmdW5jdGlvbiBGKCl7fUYucHJvdG90eXBlPUUucHJvdG90eXBlO2Z1bmN0aW9uIEcoYSxiLGUpe3RoaXMucHJvcHM9YTt0aGlzLmNvbnRleHQ9Yjt0aGlzLnJlZnM9RDt0aGlzLnVwZGF0ZXI9ZXx8Qn12YXIgSD1HLnByb3RvdHlwZT1uZXcgRjtcbkguY29uc3RydWN0b3I9RztDKEgsRS5wcm90b3R5cGUpO0guaXNQdXJlUmVhY3RDb21wb25lbnQ9ITA7dmFyIEk9QXJyYXkuaXNBcnJheSxKPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksSz17Y3VycmVudDpudWxsfSxMPXtrZXk6ITAscmVmOiEwLF9fc2VsZjohMCxfX3NvdXJjZTohMH07XG5mdW5jdGlvbiBNKGEsYixlKXt2YXIgZCxjPXt9LGs9bnVsbCxoPW51bGw7aWYobnVsbCE9Yilmb3IoZCBpbiB2b2lkIDAhPT1iLnJlZiYmKGg9Yi5yZWYpLHZvaWQgMCE9PWIua2V5JiYoaz1cIlwiK2Iua2V5KSxiKUouY2FsbChiLGQpJiYhTC5oYXNPd25Qcm9wZXJ0eShkKSYmKGNbZF09YltkXSk7dmFyIGc9YXJndW1lbnRzLmxlbmd0aC0yO2lmKDE9PT1nKWMuY2hpbGRyZW49ZTtlbHNlIGlmKDE8Zyl7Zm9yKHZhciBmPUFycmF5KGcpLG09MDttPGc7bSsrKWZbbV09YXJndW1lbnRzW20rMl07Yy5jaGlsZHJlbj1mfWlmKGEmJmEuZGVmYXVsdFByb3BzKWZvcihkIGluIGc9YS5kZWZhdWx0UHJvcHMsZyl2b2lkIDA9PT1jW2RdJiYoY1tkXT1nW2RdKTtyZXR1cm57JCR0eXBlb2Y6bCx0eXBlOmEsa2V5OmsscmVmOmgscHJvcHM6Yyxfb3duZXI6Sy5jdXJyZW50fX1cbmZ1bmN0aW9uIE4oYSxiKXtyZXR1cm57JCR0eXBlb2Y6bCx0eXBlOmEudHlwZSxrZXk6YixyZWY6YS5yZWYscHJvcHM6YS5wcm9wcyxfb3duZXI6YS5fb3duZXJ9fWZ1bmN0aW9uIE8oYSl7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSYmYS4kJHR5cGVvZj09PWx9ZnVuY3Rpb24gZXNjYXBlKGEpe3ZhciBiPXtcIj1cIjpcIj0wXCIsXCI6XCI6XCI9MlwifTtyZXR1cm5cIiRcIithLnJlcGxhY2UoL1s9Ol0vZyxmdW5jdGlvbihhKXtyZXR1cm4gYlthXX0pfXZhciBQPS9cXC8rL2c7ZnVuY3Rpb24gUShhLGIpe3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEmJm51bGwhPWEua2V5P2VzY2FwZShcIlwiK2Eua2V5KTpiLnRvU3RyaW5nKDM2KX1cbmZ1bmN0aW9uIFIoYSxiLGUsZCxjKXt2YXIgaz10eXBlb2YgYTtpZihcInVuZGVmaW5lZFwiPT09a3x8XCJib29sZWFuXCI9PT1rKWE9bnVsbDt2YXIgaD0hMTtpZihudWxsPT09YSloPSEwO2Vsc2Ugc3dpdGNoKGspe2Nhc2UgXCJzdHJpbmdcIjpjYXNlIFwibnVtYmVyXCI6aD0hMDticmVhaztjYXNlIFwib2JqZWN0XCI6c3dpdGNoKGEuJCR0eXBlb2Ype2Nhc2UgbDpjYXNlIG46aD0hMH19aWYoaClyZXR1cm4gaD1hLGM9YyhoKSxhPVwiXCI9PT1kP1wiLlwiK1EoaCwwKTpkLEkoYyk/KGU9XCJcIixudWxsIT1hJiYoZT1hLnJlcGxhY2UoUCxcIiQmL1wiKStcIi9cIiksUihjLGIsZSxcIlwiLGZ1bmN0aW9uKGEpe3JldHVybiBhfSkpOm51bGwhPWMmJihPKGMpJiYoYz1OKGMsZSsoIWMua2V5fHxoJiZoLmtleT09PWMua2V5P1wiXCI6KFwiXCIrYy5rZXkpLnJlcGxhY2UoUCxcIiQmL1wiKStcIi9cIikrYSkpLGIucHVzaChjKSksMTtoPTA7ZD1cIlwiPT09ZD9cIi5cIjpkK1wiOlwiO2lmKEkoYSkpZm9yKHZhciBnPTA7ZzxhLmxlbmd0aDtnKyspe2s9XG5hW2ddO3ZhciBmPWQrUShrLGcpO2grPVIoayxiLGUsZixjKX1lbHNlIGlmKGY9QShhKSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZilmb3IoYT1mLmNhbGwoYSksZz0wOyEoaz1hLm5leHQoKSkuZG9uZTspaz1rLnZhbHVlLGY9ZCtRKGssZysrKSxoKz1SKGssYixlLGYsYyk7ZWxzZSBpZihcIm9iamVjdFwiPT09ayl0aHJvdyBiPVN0cmluZyhhKSxFcnJvcihcIk9iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogXCIrKFwiW29iamVjdCBPYmplY3RdXCI9PT1iP1wib2JqZWN0IHdpdGgga2V5cyB7XCIrT2JqZWN0LmtleXMoYSkuam9pbihcIiwgXCIpK1wifVwiOmIpK1wiKS4gSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSBpbnN0ZWFkLlwiKTtyZXR1cm4gaH1cbmZ1bmN0aW9uIFMoYSxiLGUpe2lmKG51bGw9PWEpcmV0dXJuIGE7dmFyIGQ9W10sYz0wO1IoYSxkLFwiXCIsXCJcIixmdW5jdGlvbihhKXtyZXR1cm4gYi5jYWxsKGUsYSxjKyspfSk7cmV0dXJuIGR9ZnVuY3Rpb24gVChhKXtpZigtMT09PWEuX3N0YXR1cyl7dmFyIGI9YS5fcmVzdWx0O2I9YigpO2IudGhlbihmdW5jdGlvbihiKXtpZigwPT09YS5fc3RhdHVzfHwtMT09PWEuX3N0YXR1cylhLl9zdGF0dXM9MSxhLl9yZXN1bHQ9Yn0sZnVuY3Rpb24oYil7aWYoMD09PWEuX3N0YXR1c3x8LTE9PT1hLl9zdGF0dXMpYS5fc3RhdHVzPTIsYS5fcmVzdWx0PWJ9KTstMT09PWEuX3N0YXR1cyYmKGEuX3N0YXR1cz0wLGEuX3Jlc3VsdD1iKX1pZigxPT09YS5fc3RhdHVzKXJldHVybiBhLl9yZXN1bHQuZGVmYXVsdDt0aHJvdyBhLl9yZXN1bHQ7fVxudmFyIFU9e2N1cnJlbnQ6bnVsbH0sVj17dHJhbnNpdGlvbjpudWxsfSxXPXtSZWFjdEN1cnJlbnREaXNwYXRjaGVyOlUsUmVhY3RDdXJyZW50QmF0Y2hDb25maWc6VixSZWFjdEN1cnJlbnRPd25lcjpLfTtmdW5jdGlvbiBYKCl7dGhyb3cgRXJyb3IoXCJhY3QoLi4uKSBpcyBub3Qgc3VwcG9ydGVkIGluIHByb2R1Y3Rpb24gYnVpbGRzIG9mIFJlYWN0LlwiKTt9XG5leHBvcnRzLkNoaWxkcmVuPXttYXA6Uyxmb3JFYWNoOmZ1bmN0aW9uKGEsYixlKXtTKGEsZnVuY3Rpb24oKXtiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sZSl9LGNvdW50OmZ1bmN0aW9uKGEpe3ZhciBiPTA7UyhhLGZ1bmN0aW9uKCl7YisrfSk7cmV0dXJuIGJ9LHRvQXJyYXk6ZnVuY3Rpb24oYSl7cmV0dXJuIFMoYSxmdW5jdGlvbihhKXtyZXR1cm4gYX0pfHxbXX0sb25seTpmdW5jdGlvbihhKXtpZighTyhhKSl0aHJvdyBFcnJvcihcIlJlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLlwiKTtyZXR1cm4gYX19O2V4cG9ydHMuQ29tcG9uZW50PUU7ZXhwb3J0cy5GcmFnbWVudD1wO2V4cG9ydHMuUHJvZmlsZXI9cjtleHBvcnRzLlB1cmVDb21wb25lbnQ9RztleHBvcnRzLlN0cmljdE1vZGU9cTtleHBvcnRzLlN1c3BlbnNlPXc7XG5leHBvcnRzLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEPVc7ZXhwb3J0cy5hY3Q9WDtcbmV4cG9ydHMuY2xvbmVFbGVtZW50PWZ1bmN0aW9uKGEsYixlKXtpZihudWxsPT09YXx8dm9pZCAwPT09YSl0aHJvdyBFcnJvcihcIlJlYWN0LmNsb25lRWxlbWVudCguLi4pOiBUaGUgYXJndW1lbnQgbXVzdCBiZSBhIFJlYWN0IGVsZW1lbnQsIGJ1dCB5b3UgcGFzc2VkIFwiK2ErXCIuXCIpO3ZhciBkPUMoe30sYS5wcm9wcyksYz1hLmtleSxrPWEucmVmLGg9YS5fb3duZXI7aWYobnVsbCE9Yil7dm9pZCAwIT09Yi5yZWYmJihrPWIucmVmLGg9Sy5jdXJyZW50KTt2b2lkIDAhPT1iLmtleSYmKGM9XCJcIitiLmtleSk7aWYoYS50eXBlJiZhLnR5cGUuZGVmYXVsdFByb3BzKXZhciBnPWEudHlwZS5kZWZhdWx0UHJvcHM7Zm9yKGYgaW4gYilKLmNhbGwoYixmKSYmIUwuaGFzT3duUHJvcGVydHkoZikmJihkW2ZdPXZvaWQgMD09PWJbZl0mJnZvaWQgMCE9PWc/Z1tmXTpiW2ZdKX12YXIgZj1hcmd1bWVudHMubGVuZ3RoLTI7aWYoMT09PWYpZC5jaGlsZHJlbj1lO2Vsc2UgaWYoMTxmKXtnPUFycmF5KGYpO1xuZm9yKHZhciBtPTA7bTxmO20rKylnW21dPWFyZ3VtZW50c1ttKzJdO2QuY2hpbGRyZW49Z31yZXR1cm57JCR0eXBlb2Y6bCx0eXBlOmEudHlwZSxrZXk6YyxyZWY6ayxwcm9wczpkLF9vd25lcjpofX07ZXhwb3J0cy5jcmVhdGVDb250ZXh0PWZ1bmN0aW9uKGEpe2E9eyQkdHlwZW9mOnUsX2N1cnJlbnRWYWx1ZTphLF9jdXJyZW50VmFsdWUyOmEsX3RocmVhZENvdW50OjAsUHJvdmlkZXI6bnVsbCxDb25zdW1lcjpudWxsLF9kZWZhdWx0VmFsdWU6bnVsbCxfZ2xvYmFsTmFtZTpudWxsfTthLlByb3ZpZGVyPXskJHR5cGVvZjp0LF9jb250ZXh0OmF9O3JldHVybiBhLkNvbnN1bWVyPWF9O2V4cG9ydHMuY3JlYXRlRWxlbWVudD1NO2V4cG9ydHMuY3JlYXRlRmFjdG9yeT1mdW5jdGlvbihhKXt2YXIgYj1NLmJpbmQobnVsbCxhKTtiLnR5cGU9YTtyZXR1cm4gYn07ZXhwb3J0cy5jcmVhdGVSZWY9ZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpudWxsfX07XG5leHBvcnRzLmZvcndhcmRSZWY9ZnVuY3Rpb24oYSl7cmV0dXJueyQkdHlwZW9mOnYscmVuZGVyOmF9fTtleHBvcnRzLmlzVmFsaWRFbGVtZW50PU87ZXhwb3J0cy5sYXp5PWZ1bmN0aW9uKGEpe3JldHVybnskJHR5cGVvZjp5LF9wYXlsb2FkOntfc3RhdHVzOi0xLF9yZXN1bHQ6YX0sX2luaXQ6VH19O2V4cG9ydHMubWVtbz1mdW5jdGlvbihhLGIpe3JldHVybnskJHR5cGVvZjp4LHR5cGU6YSxjb21wYXJlOnZvaWQgMD09PWI/bnVsbDpifX07ZXhwb3J0cy5zdGFydFRyYW5zaXRpb249ZnVuY3Rpb24oYSl7dmFyIGI9Vi50cmFuc2l0aW9uO1YudHJhbnNpdGlvbj17fTt0cnl7YSgpfWZpbmFsbHl7Vi50cmFuc2l0aW9uPWJ9fTtleHBvcnRzLnVuc3RhYmxlX2FjdD1YO2V4cG9ydHMudXNlQ2FsbGJhY2s9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gVS5jdXJyZW50LnVzZUNhbGxiYWNrKGEsYil9O2V4cG9ydHMudXNlQ29udGV4dD1mdW5jdGlvbihhKXtyZXR1cm4gVS5jdXJyZW50LnVzZUNvbnRleHQoYSl9O1xuZXhwb3J0cy51c2VEZWJ1Z1ZhbHVlPWZ1bmN0aW9uKCl7fTtleHBvcnRzLnVzZURlZmVycmVkVmFsdWU9ZnVuY3Rpb24oYSl7cmV0dXJuIFUuY3VycmVudC51c2VEZWZlcnJlZFZhbHVlKGEpfTtleHBvcnRzLnVzZUVmZmVjdD1mdW5jdGlvbihhLGIpe3JldHVybiBVLmN1cnJlbnQudXNlRWZmZWN0KGEsYil9O2V4cG9ydHMudXNlSWQ9ZnVuY3Rpb24oKXtyZXR1cm4gVS5jdXJyZW50LnVzZUlkKCl9O2V4cG9ydHMudXNlSW1wZXJhdGl2ZUhhbmRsZT1mdW5jdGlvbihhLGIsZSl7cmV0dXJuIFUuY3VycmVudC51c2VJbXBlcmF0aXZlSGFuZGxlKGEsYixlKX07ZXhwb3J0cy51c2VJbnNlcnRpb25FZmZlY3Q9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gVS5jdXJyZW50LnVzZUluc2VydGlvbkVmZmVjdChhLGIpfTtleHBvcnRzLnVzZUxheW91dEVmZmVjdD1mdW5jdGlvbihhLGIpe3JldHVybiBVLmN1cnJlbnQudXNlTGF5b3V0RWZmZWN0KGEsYil9O1xuZXhwb3J0cy51c2VNZW1vPWZ1bmN0aW9uKGEsYil7cmV0dXJuIFUuY3VycmVudC51c2VNZW1vKGEsYil9O2V4cG9ydHMudXNlUmVkdWNlcj1mdW5jdGlvbihhLGIsZSl7cmV0dXJuIFUuY3VycmVudC51c2VSZWR1Y2VyKGEsYixlKX07ZXhwb3J0cy51c2VSZWY9ZnVuY3Rpb24oYSl7cmV0dXJuIFUuY3VycmVudC51c2VSZWYoYSl9O2V4cG9ydHMudXNlU3RhdGU9ZnVuY3Rpb24oYSl7cmV0dXJuIFUuY3VycmVudC51c2VTdGF0ZShhKX07ZXhwb3J0cy51c2VTeW5jRXh0ZXJuYWxTdG9yZT1mdW5jdGlvbihhLGIsZSl7cmV0dXJuIFUuY3VycmVudC51c2VTeW5jRXh0ZXJuYWxTdG9yZShhLGIsZSl9O2V4cG9ydHMudXNlVHJhbnNpdGlvbj1mdW5jdGlvbigpe3JldHVybiBVLmN1cnJlbnQudXNlVHJhbnNpdGlvbigpfTtleHBvcnRzLnZlcnNpb249XCIxOC4zLjFcIjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiBzY2hlZHVsZXIucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuJ3VzZSBzdHJpY3QnO2Z1bmN0aW9uIGYoYSxiKXt2YXIgYz1hLmxlbmd0aDthLnB1c2goYik7YTpmb3IoOzA8Yzspe3ZhciBkPWMtMT4+PjEsZT1hW2RdO2lmKDA8ZyhlLGIpKWFbZF09YixhW2NdPWUsYz1kO2Vsc2UgYnJlYWsgYX19ZnVuY3Rpb24gaChhKXtyZXR1cm4gMD09PWEubGVuZ3RoP251bGw6YVswXX1mdW5jdGlvbiBrKGEpe2lmKDA9PT1hLmxlbmd0aClyZXR1cm4gbnVsbDt2YXIgYj1hWzBdLGM9YS5wb3AoKTtpZihjIT09Yil7YVswXT1jO2E6Zm9yKHZhciBkPTAsZT1hLmxlbmd0aCx3PWU+Pj4xO2Q8dzspe3ZhciBtPTIqKGQrMSktMSxDPWFbbV0sbj1tKzEseD1hW25dO2lmKDA+ZyhDLGMpKW48ZSYmMD5nKHgsQyk/KGFbZF09eCxhW25dPWMsZD1uKTooYVtkXT1DLGFbbV09YyxkPW0pO2Vsc2UgaWYobjxlJiYwPmcoeCxjKSlhW2RdPXgsYVtuXT1jLGQ9bjtlbHNlIGJyZWFrIGF9fXJldHVybiBifVxuZnVuY3Rpb24gZyhhLGIpe3ZhciBjPWEuc29ydEluZGV4LWIuc29ydEluZGV4O3JldHVybiAwIT09Yz9jOmEuaWQtYi5pZH1pZihcIm9iamVjdFwiPT09dHlwZW9mIHBlcmZvcm1hbmNlJiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgcGVyZm9ybWFuY2Uubm93KXt2YXIgbD1wZXJmb3JtYW5jZTtleHBvcnRzLnVuc3RhYmxlX25vdz1mdW5jdGlvbigpe3JldHVybiBsLm5vdygpfX1lbHNle3ZhciBwPURhdGUscT1wLm5vdygpO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHAubm93KCktcX19dmFyIHI9W10sdD1bXSx1PTEsdj1udWxsLHk9Myx6PSExLEE9ITEsQj0hMSxEPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBzZXRUaW1lb3V0P3NldFRpbWVvdXQ6bnVsbCxFPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBjbGVhclRpbWVvdXQ/Y2xlYXJUaW1lb3V0Om51bGwsRj1cInVuZGVmaW5lZFwiIT09dHlwZW9mIHNldEltbWVkaWF0ZT9zZXRJbW1lZGlhdGU6bnVsbDtcblwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiZ2b2lkIDAhPT1uYXZpZ2F0b3Iuc2NoZWR1bGluZyYmdm9pZCAwIT09bmF2aWdhdG9yLnNjaGVkdWxpbmcuaXNJbnB1dFBlbmRpbmcmJm5hdmlnYXRvci5zY2hlZHVsaW5nLmlzSW5wdXRQZW5kaW5nLmJpbmQobmF2aWdhdG9yLnNjaGVkdWxpbmcpO2Z1bmN0aW9uIEcoYSl7Zm9yKHZhciBiPWgodCk7bnVsbCE9PWI7KXtpZihudWxsPT09Yi5jYWxsYmFjaylrKHQpO2Vsc2UgaWYoYi5zdGFydFRpbWU8PWEpayh0KSxiLnNvcnRJbmRleD1iLmV4cGlyYXRpb25UaW1lLGYocixiKTtlbHNlIGJyZWFrO2I9aCh0KX19ZnVuY3Rpb24gSChhKXtCPSExO0coYSk7aWYoIUEpaWYobnVsbCE9PWgocikpQT0hMCxJKEopO2Vsc2V7dmFyIGI9aCh0KTtudWxsIT09YiYmSyhILGIuc3RhcnRUaW1lLWEpfX1cbmZ1bmN0aW9uIEooYSxiKXtBPSExO0ImJihCPSExLEUoTCksTD0tMSk7ej0hMDt2YXIgYz15O3RyeXtHKGIpO2Zvcih2PWgocik7bnVsbCE9PXYmJighKHYuZXhwaXJhdGlvblRpbWU+Yil8fGEmJiFNKCkpOyl7dmFyIGQ9di5jYWxsYmFjaztpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZCl7di5jYWxsYmFjaz1udWxsO3k9di5wcmlvcml0eUxldmVsO3ZhciBlPWQodi5leHBpcmF0aW9uVGltZTw9Yik7Yj1leHBvcnRzLnVuc3RhYmxlX25vdygpO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBlP3YuY2FsbGJhY2s9ZTp2PT09aChyKSYmayhyKTtHKGIpfWVsc2UgayhyKTt2PWgocil9aWYobnVsbCE9PXYpdmFyIHc9ITA7ZWxzZXt2YXIgbT1oKHQpO251bGwhPT1tJiZLKEgsbS5zdGFydFRpbWUtYik7dz0hMX1yZXR1cm4gd31maW5hbGx5e3Y9bnVsbCx5PWMsej0hMX19dmFyIE49ITEsTz1udWxsLEw9LTEsUD01LFE9LTE7XG5mdW5jdGlvbiBNKCl7cmV0dXJuIGV4cG9ydHMudW5zdGFibGVfbm93KCktUTxQPyExOiEwfWZ1bmN0aW9uIFIoKXtpZihudWxsIT09Tyl7dmFyIGE9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtRPWE7dmFyIGI9ITA7dHJ5e2I9TyghMCxhKX1maW5hbGx5e2I/UygpOihOPSExLE89bnVsbCl9fWVsc2UgTj0hMX12YXIgUztpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgRilTPWZ1bmN0aW9uKCl7RihSKX07ZWxzZSBpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIE1lc3NhZ2VDaGFubmVsKXt2YXIgVD1uZXcgTWVzc2FnZUNoYW5uZWwsVT1ULnBvcnQyO1QucG9ydDEub25tZXNzYWdlPVI7Uz1mdW5jdGlvbigpe1UucG9zdE1lc3NhZ2UobnVsbCl9fWVsc2UgUz1mdW5jdGlvbigpe0QoUiwwKX07ZnVuY3Rpb24gSShhKXtPPWE7Tnx8KE49ITAsUygpKX1mdW5jdGlvbiBLKGEsYil7TD1EKGZ1bmN0aW9uKCl7YShleHBvcnRzLnVuc3RhYmxlX25vdygpKX0sYil9XG5leHBvcnRzLnVuc3RhYmxlX0lkbGVQcmlvcml0eT01O2V4cG9ydHMudW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHk9MTtleHBvcnRzLnVuc3RhYmxlX0xvd1ByaW9yaXR5PTQ7ZXhwb3J0cy51bnN0YWJsZV9Ob3JtYWxQcmlvcml0eT0zO2V4cG9ydHMudW5zdGFibGVfUHJvZmlsaW5nPW51bGw7ZXhwb3J0cy51bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eT0yO2V4cG9ydHMudW5zdGFibGVfY2FuY2VsQ2FsbGJhY2s9ZnVuY3Rpb24oYSl7YS5jYWxsYmFjaz1udWxsfTtleHBvcnRzLnVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uPWZ1bmN0aW9uKCl7QXx8enx8KEE9ITAsSShKKSl9O1xuZXhwb3J0cy51bnN0YWJsZV9mb3JjZUZyYW1lUmF0ZT1mdW5jdGlvbihhKXswPmF8fDEyNTxhP2NvbnNvbGUuZXJyb3IoXCJmb3JjZUZyYW1lUmF0ZSB0YWtlcyBhIHBvc2l0aXZlIGludCBiZXR3ZWVuIDAgYW5kIDEyNSwgZm9yY2luZyBmcmFtZSByYXRlcyBoaWdoZXIgdGhhbiAxMjUgZnBzIGlzIG5vdCBzdXBwb3J0ZWRcIik6UD0wPGE/TWF0aC5mbG9vcigxRTMvYSk6NX07ZXhwb3J0cy51bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbD1mdW5jdGlvbigpe3JldHVybiB5fTtleHBvcnRzLnVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIGgocil9O2V4cG9ydHMudW5zdGFibGVfbmV4dD1mdW5jdGlvbihhKXtzd2l0Y2goeSl7Y2FzZSAxOmNhc2UgMjpjYXNlIDM6dmFyIGI9MzticmVhaztkZWZhdWx0OmI9eX12YXIgYz15O3k9Yjt0cnl7cmV0dXJuIGEoKX1maW5hbGx5e3k9Y319O2V4cG9ydHMudW5zdGFibGVfcGF1c2VFeGVjdXRpb249ZnVuY3Rpb24oKXt9O1xuZXhwb3J0cy51bnN0YWJsZV9yZXF1ZXN0UGFpbnQ9ZnVuY3Rpb24oKXt9O2V4cG9ydHMudW5zdGFibGVfcnVuV2l0aFByaW9yaXR5PWZ1bmN0aW9uKGEsYil7c3dpdGNoKGEpe2Nhc2UgMTpjYXNlIDI6Y2FzZSAzOmNhc2UgNDpjYXNlIDU6YnJlYWs7ZGVmYXVsdDphPTN9dmFyIGM9eTt5PWE7dHJ5e3JldHVybiBiKCl9ZmluYWxseXt5PWN9fTtcbmV4cG9ydHMudW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjaz1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcIm9iamVjdFwiPT09dHlwZW9mIGMmJm51bGwhPT1jPyhjPWMuZGVsYXksYz1cIm51bWJlclwiPT09dHlwZW9mIGMmJjA8Yz9kK2M6ZCk6Yz1kO3N3aXRjaChhKXtjYXNlIDE6dmFyIGU9LTE7YnJlYWs7Y2FzZSAyOmU9MjUwO2JyZWFrO2Nhc2UgNTplPTEwNzM3NDE4MjM7YnJlYWs7Y2FzZSA0OmU9MUU0O2JyZWFrO2RlZmF1bHQ6ZT01RTN9ZT1jK2U7YT17aWQ6dSsrLGNhbGxiYWNrOmIscHJpb3JpdHlMZXZlbDphLHN0YXJ0VGltZTpjLGV4cGlyYXRpb25UaW1lOmUsc29ydEluZGV4Oi0xfTtjPmQ/KGEuc29ydEluZGV4PWMsZih0LGEpLG51bGw9PT1oKHIpJiZhPT09aCh0KSYmKEI/KEUoTCksTD0tMSk6Qj0hMCxLKEgsYy1kKSkpOihhLnNvcnRJbmRleD1lLGYocixhKSxBfHx6fHwoQT0hMCxJKEopKSk7cmV0dXJuIGF9O1xuZXhwb3J0cy51bnN0YWJsZV9zaG91bGRZaWVsZD1NO2V4cG9ydHMudW5zdGFibGVfd3JhcENhbGxiYWNrPWZ1bmN0aW9uKGEpe3ZhciBiPXk7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9eTt5PWI7dHJ5e3JldHVybiBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1maW5hbGx5e3k9Y319fTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXIucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gRmllbGQgZGV0ZWN0aW9uIHBhdHRlcm5zIGZvciBhdXRvLWZpbGxcbmV4cG9ydCBjb25zdCBGSUVMRF9QQVRURVJOUyA9IFtcbiAgICAvLyBOYW1lIGZpZWxkc1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJmaXJzdE5hbWVcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJnaXZlbi1uYW1lXCIsIFwiZmlyc3QtbmFtZVwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2ZpcnN0Lj9uYW1lL2ksIC9mbmFtZS9pLCAvZ2l2ZW4uP25hbWUvaSwgL2ZvcmVuYW1lL2ldLFxuICAgICAgICBpZFBhdHRlcm5zOiBbL2ZpcnN0Lj9uYW1lL2ksIC9mbmFtZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9maXJzdFxccypuYW1lL2ksIC9naXZlblxccypuYW1lL2ksIC9mb3JlbmFtZS9pXSxcbiAgICAgICAgcGxhY2Vob2xkZXJQYXR0ZXJuczogWy9maXJzdFxccypuYW1lL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2xhc3QvaSwgL2NvbXBhbnkvaSwgL21pZGRsZS9pLCAvYnVzaW5lc3MvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwibGFzdE5hbWVcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJmYW1pbHktbmFtZVwiLCBcImxhc3QtbmFtZVwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2xhc3QuP25hbWUvaSwgL2xuYW1lL2ksIC9zdXJuYW1lL2ksIC9mYW1pbHkuP25hbWUvaV0sXG4gICAgICAgIGlkUGF0dGVybnM6IFsvbGFzdC4/bmFtZS9pLCAvbG5hbWUvaSwgL3N1cm5hbWUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvbGFzdFxccypuYW1lL2ksIC9zdXJuYW1lL2ksIC9mYW1pbHlcXHMqbmFtZS9pXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9maXJzdC9pLCAvY29tcGFueS9pLCAvYnVzaW5lc3MvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZnVsbE5hbWVcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJuYW1lXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvXm5hbWUkL2ksIC9mdWxsLj9uYW1lL2ksIC95b3VyLj9uYW1lL2ksIC9jYW5kaWRhdGUuP25hbWUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvXm5hbWUkL2ksIC9mdWxsXFxzKm5hbWUvaSwgL3lvdXJcXHMqbmFtZS9pLCAvXm5hbWVcXHMqXFwqL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvY29tcGFueS9pLFxuICAgICAgICAgICAgL2ZpcnN0L2ksXG4gICAgICAgICAgICAvbGFzdC9pLFxuICAgICAgICAgICAgL3VzZXIvaSxcbiAgICAgICAgICAgIC9idXNpbmVzcy9pLFxuICAgICAgICAgICAgL2pvYi9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgLy8gQ29udGFjdCBmaWVsZHNcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZW1haWxcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJlbWFpbFwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2U/LT9tYWlsL2ksIC9lbWFpbC4/YWRkcmVzcy9pXSxcbiAgICAgICAgaWRQYXR0ZXJuczogWy9lPy0/bWFpbC9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9lLT9tYWlsL2ksIC9lbWFpbFxccyphZGRyZXNzL2ldLFxuICAgICAgICBwbGFjZWhvbGRlclBhdHRlcm5zOiBbL2UtP21haWwvaSwgL0AvXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJwaG9uZVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcInRlbFwiLCBcInRlbC1uYXRpb25hbFwiLCBcInRlbC1sb2NhbFwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3Bob25lL2ksIC9tb2JpbGUvaSwgL2NlbGwvaSwgL3RlbCg/OmVwaG9uZSk/L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvcGhvbmUvaSxcbiAgICAgICAgICAgIC9tb2JpbGUvaSxcbiAgICAgICAgICAgIC9jZWxsL2ksXG4gICAgICAgICAgICAvdGVsZXBob25lL2ksXG4gICAgICAgICAgICAvY29udGFjdFxccypudW1iZXIvaSxcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJhZGRyZXNzXCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wic3RyZWV0LWFkZHJlc3NcIiwgXCJhZGRyZXNzLWxpbmUxXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvYWRkcmVzcy9pLCAvc3RyZWV0L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2FkZHJlc3MvaSwgL3N0cmVldC9pXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9lbWFpbC9pLCAvd2ViL2ksIC91cmwvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiY2l0eVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcImFkZHJlc3MtbGV2ZWwyXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvY2l0eS9pLCAvdG93bi9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9jaXR5L2ksIC90b3duL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcInN0YXRlXCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wiYWRkcmVzcy1sZXZlbDFcIl0sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9zdGF0ZS9pLCAvcHJvdmluY2UvaSwgL3JlZ2lvbi9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9zdGF0ZS9pLCAvcHJvdmluY2UvaSwgL3JlZ2lvbi9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJ6aXBDb2RlXCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wicG9zdGFsLWNvZGVcIl0sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy96aXAvaSwgL3Bvc3RhbC9pLCAvcG9zdGNvZGUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvemlwL2ksIC9wb3N0YWwvaSwgL3Bvc3RcXHMqY29kZS9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJjb3VudHJ5XCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wiY291bnRyeVwiLCBcImNvdW50cnktbmFtZVwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2NvdW50cnkvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvY291bnRyeS9pXSxcbiAgICB9LFxuICAgIC8vIFNvY2lhbC9Qcm9mZXNzaW9uYWwgbGlua3NcbiAgICB7XG4gICAgICAgIHR5cGU6IFwibGlua2VkaW5cIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2xpbmtlZGluL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2xpbmtlZGluL2ldLFxuICAgICAgICBwbGFjZWhvbGRlclBhdHRlcm5zOiBbL2xpbmtlZGluXFwuY29tL2ksIC9saW5rZWRpbi9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJnaXRodWJcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2dpdGh1Yi9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9naXRodWIvaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvZ2l0aHViXFwuY29tL2ksIC9naXRodWIvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwid2Vic2l0ZVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcInVybFwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3dlYnNpdGUvaSwgL3BvcnRmb2xpby9pLCAvcGVyc29uYWwuP3NpdGUvaSwgL2Jsb2cvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvd2Vic2l0ZS9pLCAvcG9ydGZvbGlvL2ksIC9wZXJzb25hbFxccyooc2l0ZXx1cmwpL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2xpbmtlZGluL2ksIC9naXRodWIvaSwgL2NvbXBhbnkvaV0sXG4gICAgfSxcbiAgICAvLyBFbXBsb3ltZW50IGZpZWxkc1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJjdXJyZW50Q29tcGFueVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcIm9yZ2FuaXphdGlvblwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvY3VycmVudC4/Y29tcGFueS9pLFxuICAgICAgICAgICAgL2VtcGxveWVyL2ksXG4gICAgICAgICAgICAvY29tcGFueS4/bmFtZS9pLFxuICAgICAgICAgICAgL29yZ2FuaXphdGlvbi9pLFxuICAgICAgICBdLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvY3VycmVudFxccyooY29tcGFueXxlbXBsb3llcikvaSxcbiAgICAgICAgICAgIC9jb21wYW55XFxzKm5hbWUvaSxcbiAgICAgICAgICAgIC9lbXBsb3llci9pLFxuICAgICAgICBdLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL3ByZXZpb3VzL2ksIC9wYXN0L2ksIC9mb3JtZXIvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiY3VycmVudFRpdGxlXCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wib3JnYW5pemF0aW9uLXRpdGxlXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvY3VycmVudC4/dGl0bGUvaSwgL2pvYi4/dGl0bGUvaSwgL3Bvc2l0aW9uL2ksIC9yb2xlL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2N1cnJlbnRcXHMqKHRpdGxlfHBvc2l0aW9ufHJvbGUpL2ksIC9qb2JcXHMqdGl0bGUvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvcHJldmlvdXMvaSwgL3Bhc3QvaSwgL2Rlc2lyZWQvaSwgL2FwcGx5aW5nL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcInllYXJzRXhwZXJpZW5jZVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsveWVhcnM/Lj8ob2YpPy4/ZXhwZXJpZW5jZS9pLCAvZXhwZXJpZW5jZS4/eWVhcnMvaSwgL3lvZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3llYXJzP1xccyoob2ZcXHMqKT9leHBlcmllbmNlL2ksXG4gICAgICAgICAgICAvdG90YWxcXHMqZXhwZXJpZW5jZS9pLFxuICAgICAgICAgICAgL2hvd1xccyptYW55XFxzKnllYXJzL2ksXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAvLyBFZHVjYXRpb24gZmllbGRzXG4gICAge1xuICAgICAgICB0eXBlOiBcInNjaG9vbFwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9zY2hvb2wvaSxcbiAgICAgICAgICAgIC91bml2ZXJzaXR5L2ksXG4gICAgICAgICAgICAvY29sbGVnZS9pLFxuICAgICAgICAgICAgL2luc3RpdHV0aW9uL2ksXG4gICAgICAgICAgICAvYWxtYS4/bWF0ZXIvaSxcbiAgICAgICAgXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9zY2hvb2wvaSwgL3VuaXZlcnNpdHkvaSwgL2NvbGxlZ2UvaSwgL2luc3RpdHV0aW9uL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2hpZ2hcXHMqc2Nob29sL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImRlZ3JlZVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZGVncmVlL2ksIC9xdWFsaWZpY2F0aW9uL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2RlZ3JlZS9pLCAvcXVhbGlmaWNhdGlvbi9pLCAvbGV2ZWxcXHMqb2ZcXHMqZWR1Y2F0aW9uL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImZpZWxkT2ZTdHVkeVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9maWVsZC4/b2YuP3N0dWR5L2ksXG4gICAgICAgICAgICAvbWFqb3IvaSxcbiAgICAgICAgICAgIC9jb25jZW50cmF0aW9uL2ksXG4gICAgICAgICAgICAvc3BlY2lhbGl6YXRpb24vaSxcbiAgICAgICAgXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9maWVsZFxccypvZlxccypzdHVkeS9pLCAvbWFqb3IvaSwgL2FyZWFcXHMqb2ZcXHMqc3R1ZHkvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZ3JhZHVhdGlvblllYXJcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2dyYWR1YXRpb24uPyh5ZWFyfGRhdGUpL2ksIC9ncmFkLj95ZWFyL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvZ3JhZHVhdGlvblxccyooeWVhcnxkYXRlKS9pLFxuICAgICAgICAgICAgL3llYXJcXHMqb2ZcXHMqZ3JhZHVhdGlvbi9pLFxuICAgICAgICAgICAgL3doZW5cXHMqZGlkXFxzKnlvdVxccypncmFkdWF0ZS9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImdwYVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZ3BhL2ksIC9ncmFkZS4/cG9pbnQvaSwgL2NncGEvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvZ3BhL2ksIC9ncmFkZVxccypwb2ludC9pLCAvY3VtdWxhdGl2ZVxccypncGEvaV0sXG4gICAgfSxcbiAgICAvLyBEb2N1bWVudHNcbiAgICB7XG4gICAgICAgIHR5cGU6IFwicmVzdW1lXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9yZXN1bWUvaSwgL2N2L2ksIC9jdXJyaWN1bHVtLj92aXRhZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3Jlc3VtZS9pLFxuICAgICAgICAgICAgL2N2L2ksXG4gICAgICAgICAgICAvY3VycmljdWx1bVxccyp2aXRhZS9pLFxuICAgICAgICAgICAgL3VwbG9hZFxccyooeW91clxccyopP3Jlc3VtZS9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImNvdmVyTGV0dGVyXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jb3Zlci4/bGV0dGVyL2ksIC9tb3RpdmF0aW9uLj9sZXR0ZXIvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvY292ZXJcXHMqbGV0dGVyL2ksIC9tb3RpdmF0aW9uXFxzKmxldHRlci9pXSxcbiAgICB9LFxuICAgIC8vIENvbXBlbnNhdGlvblxuICAgIHtcbiAgICAgICAgdHlwZTogXCJzYWxhcnlcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3NhbGFyeS9pLCAvY29tcGVuc2F0aW9uL2ksIC9wYXkvaSwgL3dhZ2UvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9zYWxhcnkvaSxcbiAgICAgICAgICAgIC9jb21wZW5zYXRpb24vaSxcbiAgICAgICAgICAgIC9leHBlY3RlZFxccyooc2FsYXJ5fHBheSkvaSxcbiAgICAgICAgICAgIC9kZXNpcmVkXFxzKnNhbGFyeS9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgLy8gQXZhaWxhYmlsaXR5XG4gICAge1xuICAgICAgICB0eXBlOiBcInN0YXJ0RGF0ZVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvc3RhcnQuP2RhdGUvaSwgL2F2YWlsYWJsZS4/ZGF0ZS9pLCAvZWFybGllc3QuP3N0YXJ0L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvc3RhcnRcXHMqZGF0ZS9pLFxuICAgICAgICAgICAgL3doZW5cXHMqY2FuXFxzKnlvdVxccypzdGFydC9pLFxuICAgICAgICAgICAgL2VhcmxpZXN0XFxzKnN0YXJ0L2ksXG4gICAgICAgICAgICAvYXZhaWxhYmlsaXR5L2ksXG4gICAgICAgIF0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvZW5kL2ksIC9maW5pc2gvaV0sXG4gICAgfSxcbiAgICAvLyBMZWdhbC9Db21wbGlhbmNlXG4gICAge1xuICAgICAgICB0eXBlOiBcIndvcmtBdXRob3JpemF0aW9uXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3dvcmsuP2F1dGgvaSxcbiAgICAgICAgICAgIC9hdXRob3JpemVkLj90by4/d29yay9pLFxuICAgICAgICAgICAgL2xlZ2FsbHkuP3dvcmsvaSxcbiAgICAgICAgICAgIC93b3JrLj9wZXJtaXQvaSxcbiAgICAgICAgICAgIC92aXNhLj9zdGF0dXMvaSxcbiAgICAgICAgXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogW1xuICAgICAgICAgICAgL2F1dGhvcml6ZWRcXHMqdG9cXHMqd29yay9pLFxuICAgICAgICAgICAgL2xlZ2FsbHlcXHMqKGF1dGhvcml6ZWR8cGVybWl0dGVkKS9pLFxuICAgICAgICAgICAgL3dvcmtcXHMqYXV0aG9yaXphdGlvbi9pLFxuICAgICAgICAgICAgL3JpZ2h0XFxzKnRvXFxzKndvcmsvaSxcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJzcG9uc29yc2hpcFwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvc3BvbnNvci9pLCAvdmlzYS4/c3BvbnNvci9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3Nwb25zb3IvaSxcbiAgICAgICAgICAgIC92aXNhXFxzKnNwb25zb3IvaSxcbiAgICAgICAgICAgIC9yZXF1aXJlXFxzKnNwb25zb3JzaGlwL2ksXG4gICAgICAgICAgICAvbmVlZFxccypzcG9uc29yc2hpcC9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgLy8gRUVPIGZpZWxkc1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJ2ZXRlcmFuU3RhdHVzXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy92ZXRlcmFuL2ksIC9taWxpdGFyeS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy92ZXRlcmFuL2ksIC9taWxpdGFyeVxccypzdGF0dXMvaSwgL3NlcnZlZFxccyppbi9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJkaXNhYmlsaXR5XCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9kaXNhYmlsaXR5L2ksIC9kaXNhYmxlZC9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9kaXNhYmlsaXR5L2ksIC9kaXNhYmxlZC9pLCAvYWNjb21tb2RhdGlvbi9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJnZW5kZXJcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2dlbmRlci9pLCAvc2V4L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2dlbmRlci9pLCAvc2V4L2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2lkZW50aXR5L2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImV0aG5pY2l0eVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZXRobmljaXR5L2ksIC9yYWNlL2ksIC9ldGhuaWMvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvZXRobmljaXR5L2ksIC9yYWNlL2ksIC9ldGhuaWNcXHMqYmFja2dyb3VuZC9pXSxcbiAgICB9LFxuICAgIC8vIFNraWxsc1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJza2lsbHNcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3NraWxscz8vaSwgL2V4cGVydGlzZS9pLCAvY29tcGV0ZW5jL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3NraWxscz8vaSwgL3RlY2huaWNhbFxccypza2lsbHMvaSwgL2tleVxccypza2lsbHMvaV0sXG4gICAgfSxcbiAgICAvLyBTdW1tYXJ5L0Jpb1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJzdW1tYXJ5XCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3N1bW1hcnkvaSxcbiAgICAgICAgICAgIC9iaW8vaSxcbiAgICAgICAgICAgIC9hYm91dC4/eW91L2ksXG4gICAgICAgICAgICAvcHJvZmlsZS9pLFxuICAgICAgICAgICAgL2ludHJvZHVjdGlvbi9pLFxuICAgICAgICBdLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvc3VtbWFyeS9pLFxuICAgICAgICAgICAgL3Byb2Zlc3Npb25hbFxccypzdW1tYXJ5L2ksXG4gICAgICAgICAgICAvYWJvdXRcXHMqeW91L2ksXG4gICAgICAgICAgICAvdGVsbFxccyp1c1xccyphYm91dC9pLFxuICAgICAgICAgICAgL2Jpby9pLFxuICAgICAgICBdLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2pvYi9pLCAvcG9zaXRpb24vaV0sXG4gICAgfSxcbl07XG4vLyBKb2Igc2l0ZSBVUkwgcGF0dGVybnMgZm9yIHNjcmFwZXIgZGV0ZWN0aW9uXG5leHBvcnQgY29uc3QgSk9CX1NJVEVfUEFUVEVSTlMgPSB7XG4gICAgbGlua2VkaW46IFtcbiAgICAgICAgL2xpbmtlZGluXFwuY29tXFwvam9ic1xcL3ZpZXdcXC8vLFxuICAgICAgICAvbGlua2VkaW5cXC5jb21cXC9qb2JzXFwvc2VhcmNoLyxcbiAgICAgICAgL2xpbmtlZGluXFwuY29tXFwvam9ic1xcL2NvbGxlY3Rpb25zLyxcbiAgICBdLFxuICAgIGluZGVlZDogW1xuICAgICAgICAvaW5kZWVkXFwuY29tXFwvdmlld2pvYi8sXG4gICAgICAgIC9pbmRlZWRcXC5jb21cXC9qb2JzLyxcbiAgICAgICAgL2luZGVlZFxcLmNvbVxcL2NtcFxcLy4rXFwvam9icy8sXG4gICAgXSxcbiAgICBncmVlbmhvdXNlOiBbL2JvYXJkc1xcLmdyZWVuaG91c2VcXC5pb1xcLy8sIC9ncmVlbmhvdXNlXFwuaW9cXC8uKlxcL2pvYnNcXC8vXSxcbiAgICBsZXZlcjogWy9qb2JzXFwubGV2ZXJcXC5jb1xcLy8sIC9sZXZlclxcLmNvXFwvLipcXC9qb2JzXFwvL10sXG4gICAgd2F0ZXJsb29Xb3JrczogWy93YXRlcmxvb3dvcmtzXFwudXdhdGVybG9vXFwuY2EvXSxcbiAgICB3b3JrZGF5OiBbL215d29ya2RheWpvYnNcXC5jb20vLCAvd29ya2RheWpvYnNcXC5jb20vXSxcbn07XG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0Sm9iU2l0ZSh1cmwpIHtcbiAgICBmb3IgKGNvbnN0IFtzaXRlLCBwYXR0ZXJuc10gb2YgT2JqZWN0LmVudHJpZXMoSk9CX1NJVEVfUEFUVEVSTlMpKSB7XG4gICAgICAgIGlmIChwYXR0ZXJucy5zb21lKChwKSA9PiBwLnRlc3QodXJsKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzaXRlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcInVua25vd25cIjtcbn1cbi8vIENvbW1vbiBxdWVzdGlvbiBwYXR0ZXJucyBmb3IgbGVhcm5pbmcgc3lzdGVtXG5leHBvcnQgY29uc3QgQ1VTVE9NX1FVRVNUSU9OX0lORElDQVRPUlMgPSBbXG4gICAgL3doeS4qKHdhbnR8aW50ZXJlc3RlZHxhcHBseXxqb2luKS9pLFxuICAgIC93aGF0LioobWFrZXN8YXR0cmFjdGVkfGV4Y2l0ZXMpL2ksXG4gICAgL3RlbGwuKmFib3V0Lip5b3Vyc2VsZi9pLFxuICAgIC9kZXNjcmliZS4qKHNpdHVhdGlvbnx0aW1lfGV4cGVyaWVuY2UpL2ksXG4gICAgL2hvdy4qaGFuZGxlL2ksXG4gICAgL2dyZWF0ZXN0Liooc3RyZW5ndGh8d2Vha25lc3N8YWNoaWV2ZW1lbnQpL2ksXG4gICAgL3doZXJlLipzZWUuKnlvdXJzZWxmL2ksXG4gICAgL3doeS4qc2hvdWxkLipoaXJlL2ksXG4gICAgL3doYXQuKmNvbnRyaWJ1dGUvaSxcbiAgICAvc2FsYXJ5LipleHBlY3RhdGlvbi9pLFxuICAgIC9hZGRpdGlvbmFsLippbmZvcm1hdGlvbi9pLFxuICAgIC9hbnl0aGluZy4qZWxzZS9pLFxuXTtcbiIsIi8vIEZpZWxkIGRldGVjdGlvbiBmb3IgYXV0by1maWxsXG5pbXBvcnQgeyBGSUVMRF9QQVRURVJOUywgQ1VTVE9NX1FVRVNUSU9OX0lORElDQVRPUlMsIH0gZnJvbSBcIkAvc2hhcmVkL2ZpZWxkLXBhdHRlcm5zXCI7XG5leHBvcnQgY2xhc3MgRmllbGREZXRlY3RvciB7XG4gICAgZGV0ZWN0RmllbGRzKGZvcm0pIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gW107XG4gICAgICAgIGNvbnN0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0LCB0ZXh0YXJlYSwgc2VsZWN0XCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGlucHV0cykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGlucHV0O1xuICAgICAgICAgICAgLy8gU2tpcCBoaWRkZW4sIGRpc2FibGVkLCBvciBzdWJtaXQgaW5wdXRzXG4gICAgICAgICAgICBpZiAodGhpcy5zaG91bGRTa2lwRWxlbWVudChlbGVtZW50KSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IGRldGVjdGlvbiA9IHRoaXMuZGV0ZWN0RmllbGRUeXBlKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGRldGVjdGlvbi5maWVsZFR5cGUgIT09IFwidW5rbm93blwiIHx8IGRldGVjdGlvbi5jb25maWRlbmNlID4gMC4xKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzLnB1c2goZGV0ZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cbiAgICBzaG91bGRTa2lwRWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudDtcbiAgICAgICAgLy8gQ2hlY2sgY29tcHV0ZWQgc3R5bGUgZm9yIHZpc2liaWxpdHlcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgICAgICAgaWYgKHN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiIHx8IHN0eWxlLnZpc2liaWxpdHkgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGRpc2FibGVkIHN0YXRlXG4gICAgICAgIGlmIChpbnB1dC5kaXNhYmxlZClcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAvLyBDaGVjayBpbnB1dCB0eXBlXG4gICAgICAgIGNvbnN0IHNraXBUeXBlcyA9IFtcImhpZGRlblwiLCBcInN1Ym1pdFwiLCBcImJ1dHRvblwiLCBcInJlc2V0XCIsIFwiaW1hZ2VcIiwgXCJmaWxlXCJdO1xuICAgICAgICBpZiAoc2tpcFR5cGVzLmluY2x1ZGVzKGlucHV0LnR5cGUpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIC8vIENoZWNrIGlmIGl0J3MgYSBDU1JGL3Rva2VuIGZpZWxkXG4gICAgICAgIGlmIChpbnB1dC5uYW1lPy5pbmNsdWRlcyhcImNzcmZcIikgfHwgaW5wdXQubmFtZT8uaW5jbHVkZXMoXCJ0b2tlblwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBkZXRlY3RGaWVsZFR5cGUoZWxlbWVudCkge1xuICAgICAgICBjb25zdCBzaWduYWxzID0gdGhpcy5nYXRoZXJTaWduYWxzKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBzY29yZXMgPSB0aGlzLnNjb3JlQWxsUGF0dGVybnMoc2lnbmFscyk7XG4gICAgICAgIC8vIEdldCBiZXN0IG1hdGNoXG4gICAgICAgIHNjb3Jlcy5zb3J0KChhLCBiKSA9PiBiLmNvbmZpZGVuY2UgLSBhLmNvbmZpZGVuY2UpO1xuICAgICAgICBjb25zdCBiZXN0ID0gc2NvcmVzWzBdO1xuICAgICAgICAvLyBEZXRlcm1pbmUgaWYgdGhpcyBpcyBhIGN1c3RvbSBxdWVzdGlvblxuICAgICAgICBsZXQgZmllbGRUeXBlID0gYmVzdD8uZmllbGRUeXBlIHx8IFwidW5rbm93blwiO1xuICAgICAgICBsZXQgY29uZmlkZW5jZSA9IGJlc3Q/LmNvbmZpZGVuY2UgfHwgMDtcbiAgICAgICAgaWYgKGNvbmZpZGVuY2UgPCAwLjMpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGl0IGxvb2tzIGxpa2UgYSBjdXN0b20gcXVlc3Rpb25cbiAgICAgICAgICAgIGlmICh0aGlzLmxvb2tzTGlrZUN1c3RvbVF1ZXN0aW9uKHNpZ25hbHMpKSB7XG4gICAgICAgICAgICAgICAgZmllbGRUeXBlID0gXCJjdXN0b21RdWVzdGlvblwiO1xuICAgICAgICAgICAgICAgIGNvbmZpZGVuY2UgPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBmaWVsZFR5cGUsXG4gICAgICAgICAgICBjb25maWRlbmNlLFxuICAgICAgICAgICAgbGFiZWw6IHNpZ25hbHMubGFiZWwgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHNpZ25hbHMucGxhY2Vob2xkZXIgfHwgdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnYXRoZXJTaWduYWxzKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGVsZW1lbnQubmFtZT8udG9Mb3dlckNhc2UoKSB8fCBcIlwiLFxuICAgICAgICAgICAgaWQ6IGVsZW1lbnQuaWQ/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgICAgIHR5cGU6IGVsZW1lbnQudHlwZSB8fCBcInRleHRcIixcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbGVtZW50LnBsYWNlaG9sZGVyPy50b0xvd2VyQ2FzZSgpIHx8IFwiXCIsXG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IGVsZW1lbnQuYXV0b2NvbXBsZXRlIHx8IFwiXCIsXG4gICAgICAgICAgICBsYWJlbDogdGhpcy5maW5kTGFiZWwoZWxlbWVudCk/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgICAgIGFyaWFMYWJlbDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpPy50b0xvd2VyQ2FzZSgpIHx8IFwiXCIsXG4gICAgICAgICAgICBuZWFyYnlUZXh0OiB0aGlzLmdldE5lYXJieVRleHQoZWxlbWVudCk/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgICAgIHBhcmVudENsYXNzZXM6IHRoaXMuZ2V0UGFyZW50Q2xhc3NlcyhlbGVtZW50KSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc2NvcmVBbGxQYXR0ZXJucyhzaWduYWxzKSB7XG4gICAgICAgIHJldHVybiBGSUVMRF9QQVRURVJOUy5tYXAoKHBhdHRlcm4pID0+ICh7XG4gICAgICAgICAgICBmaWVsZFR5cGU6IHBhdHRlcm4udHlwZSxcbiAgICAgICAgICAgIGNvbmZpZGVuY2U6IHRoaXMuY2FsY3VsYXRlQ29uZmlkZW5jZShzaWduYWxzLCBwYXR0ZXJuKSxcbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICBjYWxjdWxhdGVDb25maWRlbmNlKHNpZ25hbHMsIHBhdHRlcm4pIHtcbiAgICAgICAgbGV0IHNjb3JlID0gMDtcbiAgICAgICAgbGV0IG1heFNjb3JlID0gMDtcbiAgICAgICAgLy8gV2VpZ2h0IGRpZmZlcmVudCBzaWduYWxzXG4gICAgICAgIGNvbnN0IHdlaWdodHMgPSB7XG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IDAuNCxcbiAgICAgICAgICAgIG5hbWU6IDAuMixcbiAgICAgICAgICAgIGlkOiAwLjE1LFxuICAgICAgICAgICAgbGFiZWw6IDAuMTUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogMC4xLFxuICAgICAgICAgICAgYXJpYUxhYmVsOiAwLjEsXG4gICAgICAgIH07XG4gICAgICAgIC8vIENoZWNrIGF1dG9jb21wbGV0ZSBhdHRyaWJ1dGUgKG1vc3QgcmVsaWFibGUpXG4gICAgICAgIGlmIChzaWduYWxzLmF1dG9jb21wbGV0ZSAmJlxuICAgICAgICAgICAgcGF0dGVybi5hdXRvY29tcGxldGVWYWx1ZXM/LmluY2x1ZGVzKHNpZ25hbHMuYXV0b2NvbXBsZXRlKSkge1xuICAgICAgICAgICAgc2NvcmUgKz0gd2VpZ2h0cy5hdXRvY29tcGxldGU7XG4gICAgICAgIH1cbiAgICAgICAgbWF4U2NvcmUgKz0gd2VpZ2h0cy5hdXRvY29tcGxldGU7XG4gICAgICAgIC8vIENoZWNrIG5hbWUgYXR0cmlidXRlXG4gICAgICAgIGlmIChwYXR0ZXJuLm5hbWVQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMubmFtZSkpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgbWF4U2NvcmUgKz0gd2VpZ2h0cy5uYW1lO1xuICAgICAgICAvLyBDaGVjayBJRFxuICAgICAgICBpZiAocGF0dGVybi5pZFBhdHRlcm5zPy5zb21lKChwKSA9PiBwLnRlc3Qoc2lnbmFscy5pZCkpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLmlkO1xuICAgICAgICB9XG4gICAgICAgIG1heFNjb3JlICs9IHdlaWdodHMuaWQ7XG4gICAgICAgIC8vIENoZWNrIGxhYmVsXG4gICAgICAgIGlmIChwYXR0ZXJuLmxhYmVsUGF0dGVybnM/LnNvbWUoKHApID0+IHAudGVzdChzaWduYWxzLmxhYmVsKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgbWF4U2NvcmUgKz0gd2VpZ2h0cy5sYWJlbDtcbiAgICAgICAgLy8gQ2hlY2sgcGxhY2Vob2xkZXJcbiAgICAgICAgaWYgKHBhdHRlcm4ucGxhY2Vob2xkZXJQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMucGxhY2Vob2xkZXIpKSkge1xuICAgICAgICAgICAgc2NvcmUgKz0gd2VpZ2h0cy5wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLnBsYWNlaG9sZGVyO1xuICAgICAgICAvLyBDaGVjayBhcmlhLWxhYmVsXG4gICAgICAgIGlmIChwYXR0ZXJuLmxhYmVsUGF0dGVybnM/LnNvbWUoKHApID0+IHAudGVzdChzaWduYWxzLmFyaWFMYWJlbCkpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLmFyaWFMYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLmFyaWFMYWJlbDtcbiAgICAgICAgLy8gTmVnYXRpdmUgc2lnbmFscyAocmVkdWNlIGNvbmZpZGVuY2UgaWYgZm91bmQpXG4gICAgICAgIGlmIChwYXR0ZXJuLm5lZ2F0aXZlUGF0dGVybnM/LnNvbWUoKHApID0+IHAudGVzdChzaWduYWxzLm5hbWUpIHx8IHAudGVzdChzaWduYWxzLmxhYmVsKSB8fCBwLnRlc3Qoc2lnbmFscy5pZCkpKSB7XG4gICAgICAgICAgICBzY29yZSAtPSAwLjM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIG1heFNjb3JlID4gMCA/IHNjb3JlIC8gbWF4U2NvcmUgOiAwKTtcbiAgICB9XG4gICAgZmluZExhYmVsKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gTWV0aG9kIDE6IEV4cGxpY2l0IGxhYmVsIHZpYSBmb3IgYXR0cmlidXRlXG4gICAgICAgIGlmIChlbGVtZW50LmlkKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7ZWxlbWVudC5pZH1cIl1gKTtcbiAgICAgICAgICAgIGlmIChsYWJlbD8udGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNZXRob2QgMjogV3JhcHBpbmcgbGFiZWxcbiAgICAgICAgY29uc3QgcGFyZW50TGFiZWwgPSBlbGVtZW50LmNsb3Nlc3QoXCJsYWJlbFwiKTtcbiAgICAgICAgaWYgKHBhcmVudExhYmVsPy50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBpbnB1dCdzIHZhbHVlIGZyb20gbGFiZWwgdGV4dFxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBhcmVudExhYmVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBlbGVtZW50LnZhbHVlIHx8IFwiXCI7XG4gICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKGlucHV0VmFsdWUsIFwiXCIpLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNZXRob2QgMzogYXJpYS1sYWJlbGxlZGJ5XG4gICAgICAgIGNvbnN0IGxhYmVsbGVkQnkgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiKTtcbiAgICAgICAgaWYgKGxhYmVsbGVkQnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYWJlbGxlZEJ5KTtcbiAgICAgICAgICAgIGlmIChsYWJlbEVsPy50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWxFbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWV0aG9kIDQ6IFByZXZpb3VzIHNpYmxpbmcgbGFiZWxcbiAgICAgICAgbGV0IHNpYmxpbmcgPSBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIHdoaWxlIChzaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2libGluZy50YWdOYW1lID09PSBcIkxBQkVMXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2libGluZy50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaWJsaW5nID0gc2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ldGhvZCA1OiBQYXJlbnQncyBwcmV2aW91cyBzaWJsaW5nIGxhYmVsXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgbGV0IHBhcmVudFNpYmxpbmcgPSBwYXJlbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChwYXJlbnRTaWJsaW5nPy50YWdOYW1lID09PSBcIkxBQkVMXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50U2libGluZy50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldE5lYXJieVRleHQoZWxlbWVudCkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LmNsb3Nlc3QoJy5mb3JtLWdyb3VwLCAuZmllbGQsIC5pbnB1dC13cmFwcGVyLCBbY2xhc3MqPVwiZmllbGRcIl0sIFtjbGFzcyo9XCJpbnB1dFwiXScpO1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gcGFyZW50LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA8IDIwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZ2V0UGFyZW50Q2xhc3NlcyhlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGxldCBkZXB0aCA9IDA7XG4gICAgICAgIHdoaWxlIChjdXJyZW50ICYmIGRlcHRoIDwgMykge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKC4uLmN1cnJlbnQuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsYXNzZXM7XG4gICAgfVxuICAgIGxvb2tzTGlrZUN1c3RvbVF1ZXN0aW9uKHNpZ25hbHMpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGAke3NpZ25hbHMubGFiZWx9ICR7c2lnbmFscy5wbGFjZWhvbGRlcn0gJHtzaWduYWxzLm5lYXJieVRleHR9YDtcbiAgICAgICAgcmV0dXJuIENVU1RPTV9RVUVTVElPTl9JTkRJQ0FUT1JTLnNvbWUoKHBhdHRlcm4pID0+IHBhdHRlcm4udGVzdCh0ZXh0KSk7XG4gICAgfVxufVxuIiwiLy8gRmllbGQtdG8tcHJvZmlsZSB2YWx1ZSBtYXBwaW5nXG5leHBvcnQgY2xhc3MgRmllbGRNYXBwZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2ZpbGUpIHtcbiAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICB9XG4gICAgbWFwRmllbGRUb1ZhbHVlKGZpZWxkKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkLmZpZWxkVHlwZTtcbiAgICAgICAgY29uc3QgbWFwcGluZyA9IHRoaXMuZ2V0TWFwcGluZ3MoKTtcbiAgICAgICAgY29uc3QgbWFwcGVyID0gbWFwcGluZ1tmaWVsZFR5cGVdO1xuICAgICAgICBpZiAobWFwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwcGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldE1hcHBpbmdzKCkge1xuICAgICAgICBjb25zdCBwID0gdGhpcy5wcm9maWxlO1xuICAgICAgICBjb25zdCBjID0gcC5jb21wdXRlZDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIE5hbWUgZmllbGRzXG4gICAgICAgICAgICBmaXJzdE5hbWU6ICgpID0+IGM/LmZpcnN0TmFtZSB8fCBudWxsLFxuICAgICAgICAgICAgbGFzdE5hbWU6ICgpID0+IGM/Lmxhc3ROYW1lIHx8IG51bGwsXG4gICAgICAgICAgICBmdWxsTmFtZTogKCkgPT4gcC5jb250YWN0Py5uYW1lIHx8IG51bGwsXG4gICAgICAgICAgICAvLyBDb250YWN0IGZpZWxkc1xuICAgICAgICAgICAgZW1haWw6ICgpID0+IHAuY29udGFjdD8uZW1haWwgfHwgbnVsbCxcbiAgICAgICAgICAgIHBob25lOiAoKSA9PiBwLmNvbnRhY3Q/LnBob25lIHx8IG51bGwsXG4gICAgICAgICAgICBhZGRyZXNzOiAoKSA9PiBwLmNvbnRhY3Q/LmxvY2F0aW9uIHx8IG51bGwsXG4gICAgICAgICAgICBjaXR5OiAoKSA9PiB0aGlzLmV4dHJhY3RDaXR5KHAuY29udGFjdD8ubG9jYXRpb24pLFxuICAgICAgICAgICAgc3RhdGU6ICgpID0+IHRoaXMuZXh0cmFjdFN0YXRlKHAuY29udGFjdD8ubG9jYXRpb24pLFxuICAgICAgICAgICAgemlwQ29kZTogKCkgPT4gbnVsbCwgLy8gTm90IHR5cGljYWxseSBzdG9yZWRcbiAgICAgICAgICAgIGNvdW50cnk6ICgpID0+IHRoaXMuZXh0cmFjdENvdW50cnkocC5jb250YWN0Py5sb2NhdGlvbiksXG4gICAgICAgICAgICAvLyBTb2NpYWwvUHJvZmVzc2lvbmFsXG4gICAgICAgICAgICBsaW5rZWRpbjogKCkgPT4gcC5jb250YWN0Py5saW5rZWRpbiB8fCBudWxsLFxuICAgICAgICAgICAgZ2l0aHViOiAoKSA9PiBwLmNvbnRhY3Q/LmdpdGh1YiB8fCBudWxsLFxuICAgICAgICAgICAgd2Vic2l0ZTogKCkgPT4gcC5jb250YWN0Py53ZWJzaXRlIHx8IG51bGwsXG4gICAgICAgICAgICBwb3J0Zm9saW86ICgpID0+IHAuY29udGFjdD8ud2Vic2l0ZSB8fCBudWxsLFxuICAgICAgICAgICAgLy8gRW1wbG95bWVudFxuICAgICAgICAgICAgY3VycmVudENvbXBhbnk6ICgpID0+IGM/LmN1cnJlbnRDb21wYW55IHx8IG51bGwsXG4gICAgICAgICAgICBjdXJyZW50VGl0bGU6ICgpID0+IGM/LmN1cnJlbnRUaXRsZSB8fCBudWxsLFxuICAgICAgICAgICAgeWVhcnNFeHBlcmllbmNlOiAoKSA9PiBjPy55ZWFyc0V4cGVyaWVuY2U/LnRvU3RyaW5nKCkgfHwgbnVsbCxcbiAgICAgICAgICAgIC8vIEVkdWNhdGlvblxuICAgICAgICAgICAgc2Nob29sOiAoKSA9PiBjPy5tb3N0UmVjZW50U2Nob29sIHx8IG51bGwsXG4gICAgICAgICAgICBlZHVjYXRpb246ICgpID0+IHRoaXMuZm9ybWF0RWR1Y2F0aW9uKCksXG4gICAgICAgICAgICBkZWdyZWU6ICgpID0+IGM/Lm1vc3RSZWNlbnREZWdyZWUgfHwgbnVsbCxcbiAgICAgICAgICAgIGZpZWxkT2ZTdHVkeTogKCkgPT4gYz8ubW9zdFJlY2VudEZpZWxkIHx8IG51bGwsXG4gICAgICAgICAgICBncmFkdWF0aW9uWWVhcjogKCkgPT4gYz8uZ3JhZHVhdGlvblllYXIgfHwgbnVsbCxcbiAgICAgICAgICAgIGdwYTogKCkgPT4gcC5lZHVjYXRpb24/LlswXT8uZ3BhIHx8IG51bGwsXG4gICAgICAgICAgICAvLyBEb2N1bWVudHMgKHJldHVybiBudWxsLCBoYW5kbGVkIHNlcGFyYXRlbHkpXG4gICAgICAgICAgICByZXN1bWU6ICgpID0+IG51bGwsXG4gICAgICAgICAgICBjb3ZlckxldHRlcjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIC8vIENvbXBlbnNhdGlvblxuICAgICAgICAgICAgc2FsYXJ5OiAoKSA9PiBudWxsLCAvLyBVc2VyLXNwZWNpZmljLCBkb24ndCBhdXRvLWZpbGxcbiAgICAgICAgICAgIHNhbGFyeUV4cGVjdGF0aW9uOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gQXZhaWxhYmlsaXR5XG4gICAgICAgICAgICBzdGFydERhdGU6ICgpID0+IG51bGwsIC8vIFVzZXItc3BlY2lmaWNcbiAgICAgICAgICAgIGF2YWlsYWJpbGl0eTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIC8vIFdvcmsgYXV0aG9yaXphdGlvbiAoc2Vuc2l0aXZlLCBkb24ndCBhdXRvLWZpbGwpXG4gICAgICAgICAgICB3b3JrQXV0aG9yaXphdGlvbjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIHNwb25zb3JzaGlwOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gRUVPIGZpZWxkcyAoc2Vuc2l0aXZlLCBkb24ndCBhdXRvLWZpbGwpXG4gICAgICAgICAgICB2ZXRlcmFuU3RhdHVzOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgZGlzYWJpbGl0eTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIGdlbmRlcjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIGV0aG5pY2l0eTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIC8vIFNraWxscy9TdW1tYXJ5XG4gICAgICAgICAgICBza2lsbHM6ICgpID0+IGM/LnNraWxsc0xpc3QgfHwgbnVsbCxcbiAgICAgICAgICAgIHN1bW1hcnk6ICgpID0+IHAuc3VtbWFyeSB8fCBudWxsLFxuICAgICAgICAgICAgZXhwZXJpZW5jZTogKCkgPT4gdGhpcy5mb3JtYXRFeHBlcmllbmNlKCksXG4gICAgICAgICAgICAvLyBDdXN0b20vVW5rbm93biAoaGFuZGxlZCBieSBsZWFybmluZyBzeXN0ZW0pXG4gICAgICAgICAgICBjdXN0b21RdWVzdGlvbjogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIHVua25vd246ICgpID0+IG51bGwsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGV4dHJhY3RDaXR5KGxvY2F0aW9uKSB7XG4gICAgICAgIGlmICghbG9jYXRpb24pXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gQ29tbW9uIHBhdHRlcm46IFwiQ2l0eSwgU3RhdGVcIiBvciBcIkNpdHksIFN0YXRlLCBDb3VudHJ5XCJcbiAgICAgICAgY29uc3QgcGFydHMgPSBsb2NhdGlvbi5zcGxpdChcIixcIikubWFwKChwKSA9PiBwLnRyaW0oKSk7XG4gICAgICAgIHJldHVybiBwYXJ0c1swXSB8fCBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0U3RhdGUobG9jYXRpb24pIHtcbiAgICAgICAgaWYgKCFsb2NhdGlvbilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IGxvY2F0aW9uLnNwbGl0KFwiLFwiKS5tYXAoKHApID0+IHAudHJpbSgpKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgXCJDQVwiIG9yIFwiQ2FsaWZvcm5pYVwiIG9yIFwiQ0EgOTQxMDVcIlxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBwYXJ0c1sxXS5zcGxpdChcIiBcIilbMF07XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdENvdW50cnkobG9jYXRpb24pIHtcbiAgICAgICAgaWYgKCFsb2NhdGlvbilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IGxvY2F0aW9uLnNwbGl0KFwiLFwiKS5tYXAoKHApID0+IHAudHJpbSgpKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGVmYXVsdCB0byBVU0EgaWYgb25seSBjaXR5L3N0YXRlXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlVuaXRlZCBTdGF0ZXNcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZm9ybWF0RWR1Y2F0aW9uKCkge1xuICAgICAgICBjb25zdCBlZHUgPSB0aGlzLnByb2ZpbGUuZWR1Y2F0aW9uPy5bMF07XG4gICAgICAgIGlmICghZWR1KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBgJHtlZHUuZGVncmVlfSBpbiAke2VkdS5maWVsZH0gZnJvbSAke2VkdS5pbnN0aXR1dGlvbn1gO1xuICAgIH1cbiAgICBmb3JtYXRFeHBlcmllbmNlKCkge1xuICAgICAgICBjb25zdCBleHBzID0gdGhpcy5wcm9maWxlLmV4cGVyaWVuY2VzO1xuICAgICAgICBpZiAoIWV4cHMgfHwgZXhwcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIGV4cHNcbiAgICAgICAgICAgIC5zbGljZSgwLCAzKVxuICAgICAgICAgICAgLm1hcCgoZXhwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwZXJpb2QgPSBleHAuY3VycmVudFxuICAgICAgICAgICAgICAgID8gYCR7ZXhwLnN0YXJ0RGF0ZX0gLSBQcmVzZW50YFxuICAgICAgICAgICAgICAgIDogYCR7ZXhwLnN0YXJ0RGF0ZX0gLSAke2V4cC5lbmREYXRlfWA7XG4gICAgICAgICAgICByZXR1cm4gYCR7ZXhwLnRpdGxlfSBhdCAke2V4cC5jb21wYW55fSAoJHtwZXJpb2R9KWA7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKTtcbiAgICB9XG4gICAgLy8gR2V0IGFsbCBtYXBwZWQgdmFsdWVzIGZvciBhIGZvcm1cbiAgICBnZXRBbGxNYXBwZWRWYWx1ZXMoZmllbGRzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tYXBGaWVsZFRvVmFsdWUoZmllbGQpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnNldChmaWVsZC5lbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG59XG4iLCIvLyBBdXRvLWZpbGwgZW5naW5lIG9yY2hlc3RyYXRvclxuZXhwb3J0IGNsYXNzIEF1dG9GaWxsRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcihkZXRlY3RvciwgbWFwcGVyKSB7XG4gICAgICAgIHRoaXMuZGV0ZWN0b3IgPSBkZXRlY3RvcjtcbiAgICAgICAgdGhpcy5tYXBwZXIgPSBtYXBwZXI7XG4gICAgfVxuICAgIGFzeW5jIGZpbGxGb3JtKGZpZWxkcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBmaWxsZWQ6IDAsXG4gICAgICAgICAgICBza2lwcGVkOiAwLFxuICAgICAgICAgICAgZXJyb3JzOiAwLFxuICAgICAgICAgICAgZGV0YWlsczogW10sXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tYXBwZXIubWFwRmllbGRUb1ZhbHVlKGZpZWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5za2lwcGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5kZXRhaWxzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlOiBmaWVsZC5maWVsZFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGxlZCA9IGF3YWl0IHRoaXMuZmlsbEZpZWxkKGZpZWxkLmVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5maWxsZWQrKztcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmRldGFpbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFR5cGU6IGZpZWxkLmZpZWxkVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc2tpcHBlZCsrO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkVHlwZTogZmllbGQuZmllbGRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvcnMrKztcbiAgICAgICAgICAgICAgICByZXN1bHQuZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlOiBmaWVsZC5maWVsZFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBhc3luYyBmaWxsRmllbGQoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpbnB1dFR5cGUgPSBlbGVtZW50LnR5cGU/LnRvTG93ZXJDYXNlKCkgfHwgXCJ0ZXh0XCI7XG4gICAgICAgIC8vIEhhbmRsZSBkaWZmZXJlbnQgaW5wdXQgdHlwZXNcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGxTZWxlY3QoZWxlbWVudCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWdOYW1lID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGxUZXh0SW5wdXQoZWxlbWVudCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWdOYW1lID09PSBcImlucHV0XCIpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoaW5wdXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZW1haWxcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwidGVsXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInVybFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFRleHRJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY2FzZSBcImNoZWNrYm94XCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGxDaGVja2JveChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJhZGlvXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGxSYWRpbyhlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbERhdGVJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFRleHRJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWxsVGV4dElucHV0KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIC8vIEZvY3VzIHRoZSBlbGVtZW50XG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgLy8gQ2xlYXIgZXhpc3RpbmcgdmFsdWVcbiAgICAgICAgZWxlbWVudC52YWx1ZSA9IFwiXCI7XG4gICAgICAgIC8vIFNldCBuZXcgdmFsdWVcbiAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAvLyBEaXNwYXRjaCBldmVudHMgdG8gdHJpZ2dlciB2YWxpZGF0aW9uIGFuZCBmcmFtZXdvcmtzXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hJbnB1dEV2ZW50cyhlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWUgPT09IHZhbHVlO1xuICAgIH1cbiAgICBmaWxsU2VsZWN0KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBBcnJheS5mcm9tKGVsZW1lbnQub3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIC8vIFRyeSBleGFjdCBtYXRjaCBmaXJzdFxuICAgICAgICBsZXQgbWF0Y2hpbmdPcHRpb24gPSBvcHRpb25zLmZpbmQoKG9wdCkgPT4gb3B0LnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWRWYWx1ZSB8fFxuICAgICAgICAgICAgb3B0LnRleHQudG9Mb3dlckNhc2UoKSA9PT0gbm9ybWFsaXplZFZhbHVlKTtcbiAgICAgICAgLy8gVHJ5IHBhcnRpYWwgbWF0Y2hcbiAgICAgICAgaWYgKCFtYXRjaGluZ09wdGlvbikge1xuICAgICAgICAgICAgbWF0Y2hpbmdPcHRpb24gPSBvcHRpb25zLmZpbmQoKG9wdCkgPT4gb3B0LnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZFZhbHVlKSB8fFxuICAgICAgICAgICAgICAgIG9wdC50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZFZhbHVlKSB8fFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRWYWx1ZS5pbmNsdWRlcyhvcHQudmFsdWUudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkVmFsdWUuaW5jbHVkZXMob3B0LnRleHQudG9Mb3dlckNhc2UoKSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaGluZ09wdGlvbikge1xuICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IG1hdGNoaW5nT3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaElucHV0RXZlbnRzKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWxsQ2hlY2tib3goZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgc2hvdWxkQ2hlY2sgPSBbXCJ0cnVlXCIsIFwieWVzXCIsIFwiMVwiLCBcIm9uXCJdLmluY2x1ZGVzKHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSBzaG91bGRDaGVjaztcbiAgICAgICAgdGhpcy5kaXNwYXRjaElucHV0RXZlbnRzKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZmlsbFJhZGlvKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIC8vIEZpbmQgdGhlIHJhZGlvIGdyb3VwXG4gICAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50Lm5hbWU7XG4gICAgICAgIGlmICghbmFtZSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgcmFkaW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgaW5wdXRbdHlwZT1cInJhZGlvXCJdW25hbWU9XCIke25hbWV9XCJdYCk7XG4gICAgICAgIGZvciAoY29uc3QgcmFkaW8gb2YgcmFkaW9zKSB7XG4gICAgICAgICAgICBjb25zdCByYWRpb0lucHV0ID0gcmFkaW87XG4gICAgICAgICAgICBjb25zdCByYWRpb1ZhbHVlID0gcmFkaW9JbnB1dC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY29uc3QgcmFkaW9MYWJlbCA9IHRoaXMuZ2V0UmFkaW9MYWJlbChyYWRpb0lucHV0KT8udG9Mb3dlckNhc2UoKSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKHJhZGlvVmFsdWUgPT09IG5vcm1hbGl6ZWRWYWx1ZSB8fFxuICAgICAgICAgICAgICAgIHJhZGlvTGFiZWwuaW5jbHVkZXMobm9ybWFsaXplZFZhbHVlKSB8fFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRWYWx1ZS5pbmNsdWRlcyhyYWRpb1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJhZGlvSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaElucHV0RXZlbnRzKHJhZGlvSW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZmlsbERhdGVJbnB1dChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICAvLyBUcnkgdG8gcGFyc2UgYW5kIGZvcm1hdCB0aGUgZGF0ZVxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpO1xuICAgICAgICBpZiAoaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyBGb3JtYXQgYXMgWVlZWS1NTS1ERCBmb3IgZGF0ZSBpbnB1dFxuICAgICAgICBjb25zdCBmb3JtYXR0ZWQgPSBkYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xuICAgICAgICBlbGVtZW50LnZhbHVlID0gZm9ybWF0dGVkO1xuICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBnZXRSYWRpb0xhYmVsKHJhZGlvKSB7XG4gICAgICAgIC8vIENoZWNrIGZvciBhc3NvY2lhdGVkIGxhYmVsXG4gICAgICAgIGlmIChyYWRpby5pZCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke3JhZGlvLmlkfVwiXWApO1xuICAgICAgICAgICAgaWYgKGxhYmVsKVxuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbC50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHdyYXBwaW5nIGxhYmVsXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHJhZGlvLmNsb3Nlc3QoXCJsYWJlbFwiKTtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZm9yIG5leHQgc2libGluZyB0ZXh0XG4gICAgICAgIGNvbnN0IG5leHQgPSByYWRpby5uZXh0U2libGluZztcbiAgICAgICAgaWYgKG5leHQ/Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICAgICAgcmV0dXJuIG5leHQudGV4dENvbnRlbnQ/LnRyaW0oKSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBkaXNwYXRjaElucHV0RXZlbnRzKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gRGlzcGF0Y2ggZXZlbnRzIGluIG9yZGVyIHRoYXQgbW9zdCBmcmFtZXdvcmtzIGV4cGVjdFxuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiZm9jdXNcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJjaGFuZ2VcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImJsdXJcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgLy8gRm9yIFJlYWN0IGNvbnRyb2xsZWQgY29tcG9uZW50c1xuICAgICAgICBjb25zdCBuYXRpdmVJbnB1dFZhbHVlU2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGUsIFwidmFsdWVcIik/LnNldDtcbiAgICAgICAgaWYgKG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIuY2FsbChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEJhc2Ugc2NyYXBlciBpbnRlcmZhY2UgYW5kIHV0aWxpdGllc1xuZXhwb3J0IGNsYXNzIEJhc2VTY3JhcGVyIHtcbiAgICAvLyBTaGFyZWQgdXRpbGl0aWVzXG4gICAgZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIHJldHVybiBlbD8udGV4dENvbnRlbnQ/LnRyaW0oKSB8fCBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0SHRtbENvbnRlbnQoc2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGVsPy5pbm5lckhUTUw/LnRyaW0oKSB8fCBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0QXR0cmlidXRlKHNlbGVjdG9yLCBhdHRyKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIHJldHVybiBlbD8uZ2V0QXR0cmlidXRlKGF0dHIpIHx8IG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RBbGxUZXh0KHNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnRzKVxuICAgICAgICAgICAgLm1hcCgoZWwpID0+IGVsLnRleHRDb250ZW50Py50cmltKCkpXG4gICAgICAgICAgICAuZmlsdGVyKCh0ZXh0KSA9PiAhIXRleHQpO1xuICAgIH1cbiAgICB3YWl0Rm9yRWxlbWVudChzZWxlY3RvciwgdGltZW91dCA9IDUwMDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZWwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZWwpO1xuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoXywgb2JzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kIGFmdGVyICR7dGltZW91dH1tc2ApKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXh0cmFjdFJlcXVpcmVtZW50cyh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVtZW50cyA9IFtdO1xuICAgICAgICAvLyBTcGxpdCBieSBjb21tb24gYnVsbGV0IHBhdHRlcm5zXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgvXFxufOKAonzil6Z84peGfOKWqnzil498LVxcc3xcXCpcXHMvKTtcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICAgICAgICBjb25zdCBjbGVhbmVkID0gbGluZS50cmltKCk7XG4gICAgICAgICAgICBpZiAoY2xlYW5lZC5sZW5ndGggPiAyMCAmJiBjbGVhbmVkLmxlbmd0aCA8IDUwMCkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGl0IGxvb2tzIGxpa2UgYSByZXF1aXJlbWVudFxuICAgICAgICAgICAgICAgIGlmIChjbGVhbmVkLm1hdGNoKC9eKHlvdXx3ZXx0aGV8bXVzdHxzaG91bGR8d2lsbHxleHBlcmllbmNlfHByb2ZpY2llbmN5fGtub3dsZWRnZXxhYmlsaXR5fHN0cm9uZ3xleGNlbGxlbnQpL2kpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuZWQubWF0Y2goL3JlcXVpcmVkfHByZWZlcnJlZHxib251c3xwbHVzL2kpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuZWQubWF0Y2goL15cXGQrXFwrP1xccyp5ZWFycz8vaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzLnB1c2goY2xlYW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXF1aXJlbWVudHMuc2xpY2UoMCwgMTUpO1xuICAgIH1cbiAgICBleHRyYWN0S2V5d29yZHModGV4dCkge1xuICAgICAgICBjb25zdCBrZXl3b3JkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gQ29tbW9uIHRlY2ggc2tpbGxzIHBhdHRlcm5zXG4gICAgICAgIGNvbnN0IHRlY2hQYXR0ZXJucyA9IFtcbiAgICAgICAgICAgIC9cXGIocmVhY3R8YW5ndWxhcnx2dWV8c3ZlbHRlfG5leHRcXC4/anN8bnV4dClcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKG5vZGVcXC4/anN8ZXhwcmVzc3xmYXN0aWZ5fG5lc3RcXC4/anMpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihweXRob258ZGphbmdvfGZsYXNrfGZhc3RhcGkpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihqYXZhfHNwcmluZ3xrb3RsaW4pXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihnb3xnb2xhbmd8cnVzdHxjXFwrXFwrfGMjfFxcLm5ldClcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKHR5cGVzY3JpcHR8amF2YXNjcmlwdHxlczYpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihzcWx8bXlzcWx8cG9zdGdyZXNxbHxtb25nb2RifHJlZGlzfGVsYXN0aWNzZWFyY2gpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihhd3N8Z2NwfGF6dXJlfGRvY2tlcnxrdWJlcm5ldGVzfGs4cylcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKGdpdHxjaVxcL2NkfGplbmtpbnN8Z2l0aHViXFxzKmFjdGlvbnMpXFxiL2dpLFxuICAgICAgICAgICAgL1xcYihncmFwaHFsfHJlc3R8YXBpfG1pY3Jvc2VydmljZXMpXFxiL2dpLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgdGVjaFBhdHRlcm5zKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVzID0gdGV4dC5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKChtKSA9PiBrZXl3b3Jkcy5hZGQobS50b0xvd2VyQ2FzZSgpLnRyaW0oKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGtleXdvcmRzKTtcbiAgICB9XG4gICAgZGV0ZWN0Sm9iVHlwZSh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGxvd2VyID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJpbnRlcm5cIikgfHxcbiAgICAgICAgICAgIGxvd2VyLmluY2x1ZGVzKFwiaW50ZXJuc2hpcFwiKSB8fFxuICAgICAgICAgICAgbG93ZXIuaW5jbHVkZXMoXCJjby1vcFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiaW50ZXJuc2hpcFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcImNvbnRyYWN0XCIpIHx8IGxvd2VyLmluY2x1ZGVzKFwiY29udHJhY3RvclwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udHJhY3RcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJwYXJ0LXRpbWVcIikgfHwgbG93ZXIuaW5jbHVkZXMoXCJwYXJ0IHRpbWVcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBcInBhcnQtdGltZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcImZ1bGwtdGltZVwiKSB8fCBsb3dlci5pbmNsdWRlcyhcImZ1bGwgdGltZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZnVsbC10aW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZGV0ZWN0UmVtb3RlKHRleHQpIHtcbiAgICAgICAgY29uc3QgbG93ZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiAobG93ZXIuaW5jbHVkZXMoXCJyZW1vdGVcIikgfHxcbiAgICAgICAgICAgIGxvd2VyLmluY2x1ZGVzKFwid29yayBmcm9tIGhvbWVcIikgfHxcbiAgICAgICAgICAgIGxvd2VyLmluY2x1ZGVzKFwid2ZoXCIpIHx8XG4gICAgICAgICAgICBsb3dlci5pbmNsdWRlcyhcImZ1bGx5IGRpc3RyaWJ1dGVkXCIpIHx8XG4gICAgICAgICAgICBsb3dlci5pbmNsdWRlcyhcImFueXdoZXJlXCIpKTtcbiAgICB9XG4gICAgZXh0cmFjdFNhbGFyeSh0ZXh0KSB7XG4gICAgICAgIC8vIE1hdGNoIHNhbGFyeSBwYXR0ZXJucyBsaWtlICQxMDAsMDAwIC0gJDE1MCwwMDAgb3IgJDEwMGsgLSAkMTUwa1xuICAgICAgICBjb25zdCBwYXR0ZXJuID0gL1xcJFtcXGQsXSsoPzprKT8oPzpcXHMqWy3igJNdXFxzKlxcJFtcXGQsXSsoPzprKT8pPyg/OlxccyooPzpwZXJ8XFwvKVxccyooPzp5ZWFyfHlyfGFubnVtfGFubnVhbHxob3VyfGhyKSk/L2dpO1xuICAgICAgICBjb25zdCBtYXRjaCA9IHBhdHRlcm4uZXhlYyh0ZXh0KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMF0gOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNsZWFuRGVzY3JpcHRpb24oaHRtbCkge1xuICAgICAgICAvLyBSZW1vdmUgSFRNTCB0YWdzIGJ1dCBwcmVzZXJ2ZSBsaW5lIGJyZWFrc1xuICAgICAgICByZXR1cm4gaHRtbFxuICAgICAgICAgICAgLnJlcGxhY2UoLzxiclxccypcXC8/Pi9naSwgXCJcXG5cIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88XFwvcD4vZ2ksIFwiXFxuXFxuXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPFxcL2Rpdj4vZ2ksIFwiXFxuXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPFxcL2xpPi9naSwgXCJcXG5cIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88W14+XSs+L2csIFwiXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiIFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csIFwiJlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG57Myx9L2csIFwiXFxuXFxuXCIpXG4gICAgICAgICAgICAudHJpbSgpO1xuICAgIH1cbn1cbiIsIi8vIExpbmtlZEluIGpvYiBzY3JhcGVyXG5pbXBvcnQgeyBCYXNlU2NyYXBlciB9IGZyb20gXCIuL2Jhc2Utc2NyYXBlclwiO1xuZXhwb3J0IGNsYXNzIExpbmtlZEluU2NyYXBlciBleHRlbmRzIEJhc2VTY3JhcGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBcImxpbmtlZGluXCI7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybnMgPSBbXG4gICAgICAgICAgICAvbGlua2VkaW5cXC5jb21cXC9qb2JzXFwvdmlld1xcLyhcXGQrKS8sXG4gICAgICAgICAgICAvbGlua2VkaW5cXC5jb21cXC9qb2JzXFwvc2VhcmNoLyxcbiAgICAgICAgICAgIC9saW5rZWRpblxcLmNvbVxcL2pvYnNcXC9jb2xsZWN0aW9ucy8sXG4gICAgICAgIF07XG4gICAgfVxuICAgIGNhbkhhbmRsZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsUGF0dGVybnMuc29tZSgocCkgPT4gcC50ZXN0KHVybCkpO1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0aW5nKCkge1xuICAgICAgICAvLyBXYWl0IGZvciBqb2IgZGV0YWlscyB0byBsb2FkXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JFbGVtZW50KFwiLmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fam9iLXRpdGxlLCAuam9icy11bmlmaWVkLXRvcC1jYXJkX19qb2ItdGl0bGVcIiwgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgLy8gVHJ5IGFsdGVybmF0aXZlIHNlbGVjdG9yc1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBtdWx0aXBsZSBzZWxlY3RvciBzdHJhdGVnaWVzIChMaW5rZWRJbiBjaGFuZ2VzIERPTSBmcmVxdWVudGx5KVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIExpbmtlZEluIHNjcmFwZXI6IE1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIsIHtcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAhIWRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgdG8gZXh0cmFjdCBmcm9tIHN0cnVjdHVyZWQgZGF0YVxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgc3RydWN0dXJlZERhdGE/LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnkoZGVzY3JpcHRpb24pIHx8IHN0cnVjdHVyZWREYXRhPy5zYWxhcnksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCBcIlwiKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgY2FyZHMgaW4gc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgY29uc3Qgam9iQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmpvYi1jYXJkLWNvbnRhaW5lciwgLmpvYnMtc2VhcmNoLXJlc3VsdHNfX2xpc3QtaXRlbSwgLnNjYWZmb2xkLWxheW91dF9fbGlzdC1pdGVtXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGNhcmQgb2Ygam9iQ2FyZHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLmpvYi1jYXJkLWxpc3RfX3RpdGxlLCAuam9iLWNhcmQtY29udGFpbmVyX19saW5rLCBhW2RhdGEtY29udHJvbC1uYW1lPVwiam9iX2NhcmRfdGl0bGVcIl0nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wYW55RWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoXCIuam9iLWNhcmQtY29udGFpbmVyX19jb21wYW55LW5hbWUsIC5qb2ItY2FyZC1jb250YWluZXJfX3ByaW1hcnktZGVzY3JpcHRpb25cIik7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FbCA9IGNhcmQucXVlcnlTZWxlY3RvcihcIi5qb2ItY2FyZC1jb250YWluZXJfX21ldGFkYXRhLWl0ZW1cIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnkgPSBjb21wYW55RWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHRpdGxlRWw/LmhyZWY7XG4gICAgICAgICAgICAgICAgaWYgKHRpdGxlICYmIGNvbXBhbnkgJiYgdXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGpvYnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiLCAvLyBXb3VsZCBuZWVkIHRvIG5hdmlnYXRlIHRvIGdldCBmdWxsIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ29sdW1idXNdIEVycm9yIHNjcmFwaW5nIGpvYiBjYXJkOlwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2JzO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iVGl0bGUoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fam9iLXRpdGxlXCIsXG4gICAgICAgICAgICBcIi5qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2pvYi10aXRsZVwiLFxuICAgICAgICAgICAgXCIudC0yNC5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2pvYi10aXRsZVwiLFxuICAgICAgICAgICAgXCJoMS50LTI0XCIsXG4gICAgICAgICAgICBcIi5qb2JzLXRvcC1jYXJkX19qb2ItdGl0bGVcIixcbiAgICAgICAgICAgICdoMVtjbGFzcyo9XCJqb2ItdGl0bGVcIl0nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0Q29tcGFueSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19jb21wYW55LW5hbWVcIixcbiAgICAgICAgICAgIFwiLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fY29tcGFueS1uYW1lXCIsXG4gICAgICAgICAgICBcIi5qb2JzLXRvcC1jYXJkX19jb21wYW55LXVybFwiLFxuICAgICAgICAgICAgJ2FbZGF0YS10cmFja2luZy1jb250cm9sLW5hbWU9XCJwdWJsaWNfam9ic190b3BjYXJkLW9yZy1uYW1lXCJdJyxcbiAgICAgICAgICAgIFwiLmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fcHJpbWFyeS1kZXNjcmlwdGlvbi1jb250YWluZXIgYVwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0TG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fYnVsbGV0XCIsXG4gICAgICAgICAgICBcIi5qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2J1bGxldFwiLFxuICAgICAgICAgICAgXCIuam9icy10b3AtY2FyZF9fYnVsbGV0XCIsXG4gICAgICAgICAgICBcIi5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX3ByaW1hcnktZGVzY3JpcHRpb24tY29udGFpbmVyIC50LWJsYWNrLS1saWdodFwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmICF0ZXh0LmluY2x1ZGVzKFwiYXBwbGljYW50XCIpICYmICF0ZXh0LmluY2x1ZGVzKFwiYWdvXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3REZXNjcmlwdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuam9icy1kZXNjcmlwdGlvbl9fY29udGVudFwiLFxuICAgICAgICAgICAgXCIuam9icy1kZXNjcmlwdGlvbi1jb250ZW50X190ZXh0XCIsXG4gICAgICAgICAgICBcIi5qb2JzLWJveF9faHRtbC1jb250ZW50XCIsXG4gICAgICAgICAgICBcIiNqb2ItZGV0YWlsc1wiLFxuICAgICAgICAgICAgXCIuam9icy1kZXNjcmlwdGlvblwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9IHRoaXMuZXh0cmFjdEh0bWxDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEpvYklkKCkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXC92aWV3XFwvKFxcZCspLyk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBleHRyYWN0U3RydWN0dXJlZERhdGEoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsZEpzb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbdHlwZT1cImFwcGxpY2F0aW9uL2xkK2pzb25cIl0nKTtcbiAgICAgICAgICAgIGlmICghbGRKc29uPy50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGxkSnNvbi50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBkYXRhLmpvYkxvY2F0aW9uPy5hZGRyZXNzPy5hZGRyZXNzTG9jYWxpdHksXG4gICAgICAgICAgICAgICAgc2FsYXJ5OiBkYXRhLmJhc2VTYWxhcnk/LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgID8gYCQke2RhdGEuYmFzZVNhbGFyeS52YWx1ZS5taW5WYWx1ZSB8fCBcIlwifS0ke2RhdGEuYmFzZVNhbGFyeS52YWx1ZS5tYXhWYWx1ZSB8fCBcIlwifWBcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBXYXRlcmxvbyBXb3JrcyBqb2Igc2NyYXBlciAoVW5pdmVyc2l0eSBvZiBXYXRlcmxvbyBjby1vcCBwb3J0YWwpLlxuLy9cbi8vIFRhcmdldHMgdGhlIG1vZGVybiBzdHVkZW50IHBvc3Rpbmctc2VhcmNoIFVJIChib2R5Lm5ldy1zdHVkZW50X19wb3N0aW5nLXNlYXJjaCkuXG4vLyBUaGUgbGVnYWN5IE9yYmlzLWVyYSBzZWxlY3RvcnMgKCNwb3N0aW5nRGl2LCAucG9zdGluZy1kZXRhaWxzLCAuam9iLWxpc3RpbmctdGFibGUpXG4vLyBhcmUgbm8gbG9uZ2VyIHByZXNlbnQgb24gdGhlIHByb2R1Y3Rpb24gc2l0ZTsgdGhpcyBzY3JhcGVyIGRvZXMgbm90IHRyeSB0b1xuLy8gc3VwcG9ydCBib3RoIOKAlCBpZiBXVyByZXZlcnRzIG9yIGEgZGlmZmVyZW50IHN1cmZhY2UgYXBwZWFycywgYWRkIGEgYnJhbmNoLlxuaW1wb3J0IHsgQmFzZVNjcmFwZXIgfSBmcm9tIFwiLi9iYXNlLXNjcmFwZXJcIjtcbi8vIEZpZWxkIGxhYmVscyBmcm9tIHRoZSBsaXZlIFVJLiBFYWNoIGVudHJ5IGxpc3RzIHByZWZpeGVzIHdlIHdhbnQgdG8gbWF0Y2hcbi8vIGFnYWluc3QgdGhlIC5sYWJlbCB0ZXh0ICh3aGljaCBpcyBub3JtYWxpemVkIOKAlCB0cmFpbGluZyBjb2xvbnMgYW5kIHdoaXRlc3BhY2Vcbi8vIHN0cmlwcGVkIGJlZm9yZSBjb21wYXJpc29uKS4gVGhlIGZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIHBlciByb3cuXG5jb25zdCBGSUVMRF9MQUJFTFMgPSB7XG4gICAgdGl0bGU6IFtcIkpvYiBUaXRsZVwiXSxcbiAgICBzdW1tYXJ5OiBbXCJKb2IgU3VtbWFyeVwiXSxcbiAgICByZXNwb25zaWJpbGl0aWVzOiBbXCJKb2IgUmVzcG9uc2liaWxpdGllc1wiLCBcIlJlc3BvbnNpYmlsaXRpZXNcIl0sXG4gICAgcmVxdWlyZW1lbnRzOiBbXG4gICAgICAgIFwiUmVxdWlyZWQgU2tpbGxzXCIsXG4gICAgICAgIFwiVGFyZ2V0ZWQgU2tpbGxzXCIsXG4gICAgICAgIFwiVGFyZ2V0ZWQgRGVncmVlcyBhbmQgRGlzY2lwbGluZXNcIixcbiAgICBdLFxuICAgIG9yZ2FuaXphdGlvbjogW1wiT3JnYW5pemF0aW9uXCIsIFwiRW1wbG95ZXJcIiwgXCJDb21wYW55XCJdLFxuICAgIC8vIE1vZGVybiBXVyBzcGxpdHMgbG9jYXRpb24gYWNyb3NzIG11bHRpcGxlIGxhYmVsbGVkIHJvd3M7IHdlIGNvbGxlY3QgZWFjaFxuICAgIC8vIHBpZWNlIHNlcGFyYXRlbHkgYW5kIHN0aXRjaCB0aGVtIGluIGNvbXBvc2VMb2NhdGlvbigpLlxuICAgIGxvY2F0aW9uQ2l0eTogW1wiSm9iIC0gQ2l0eVwiXSxcbiAgICBsb2NhdGlvblJlZ2lvbjogW1wiSm9iIC0gUHJvdmluY2UvU3RhdGVcIiwgXCJKb2IgLSBQcm92aW5jZSAvIFN0YXRlXCJdLFxuICAgIGxvY2F0aW9uQ291bnRyeTogW1wiSm9iIC0gQ291bnRyeVwiXSxcbiAgICBsb2NhdGlvbkZ1bGw6IFtcbiAgICAgICAgXCJKb2IgTG9jYXRpb25cIixcbiAgICAgICAgXCJMb2NhdGlvblwiLFxuICAgICAgICBcIkpvYiAtIENpdHksIFByb3ZpbmNlIC8gU3RhdGUsIENvdW50cnlcIixcbiAgICBdLFxuICAgIGVtcGxveW1lbnRBcnJhbmdlbWVudDogW1wiRW1wbG95bWVudCBMb2NhdGlvbiBBcnJhbmdlbWVudFwiXSxcbiAgICB3b3JrVGVybTogW1wiV29yayBUZXJtXCJdLFxuICAgIHdvcmtUZXJtRHVyYXRpb246IFtcIldvcmsgVGVybSBEdXJhdGlvblwiXSxcbiAgICBsZXZlbDogW1wiTGV2ZWxcIl0sXG4gICAgb3BlbmluZ3M6IFtcIk51bWJlciBvZiBKb2IgT3BlbmluZ3NcIl0sXG4gICAgZGVhZGxpbmU6IFtcIkFwcGxpY2F0aW9uIERlYWRsaW5lXCIsIFwiRGVhZGxpbmVcIl0sXG4gICAgc2FsYXJ5OiBbXG4gICAgICAgIFwiQ29tcGVuc2F0aW9uIGFuZCBCZW5lZml0cyBJbmZvcm1hdGlvblwiLFxuICAgICAgICBcIkNvbXBlbnNhdGlvbiBhbmQgQmVuZWZpdHNcIixcbiAgICAgICAgXCJDb21wZW5zYXRpb25cIixcbiAgICAgICAgXCJTYWxhcnlcIixcbiAgICBdLFxuICAgIGpvYlR5cGU6IFtcIkpvYiBUeXBlXCJdLFxufTtcbmV4cG9ydCBjbGFzcyBXYXRlcmxvb1dvcmtzU2NyYXBlciBleHRlbmRzIEJhc2VTY3JhcGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBcIndhdGVybG9vd29ya3NcIjtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJucyA9IFsvd2F0ZXJsb293b3Jrc1xcLnV3YXRlcmxvb1xcLmNhL107XG4gICAgfVxuICAgIGNhbkhhbmRsZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsUGF0dGVybnMuc29tZSgocCkgPT4gcC50ZXN0KHVybCkpO1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0aW5nKCkge1xuICAgICAgICBpZiAodGhpcy5pc0xvZ2luUGFnZSgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gV2F0ZXJsb28gV29ya3M6IFBsZWFzZSBsb2cgaW4gZmlyc3RcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yRWxlbWVudChcIi5kYXNoYm9hcmQtaGVhZGVyX19wb3N0aW5nLXRpdGxlXCIsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIC8vIE5vIHBvc3RpbmcgcGFuZWwgb3BlbiDigJQgbm90IGEgc2NyYXBlIGVycm9yLCBqdXN0IG5vdGhpbmcgdG8gc2NyYXBlLlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBzb3VyY2VKb2JJZCwgdGl0bGU6IHBhbmVsVGl0bGUgfSA9IHRoaXMucGFyc2VQb3N0aW5nSGVhZGVyKCk7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IHRoaXMuY29sbGVjdEZpZWxkcygpO1xuICAgICAgICBjb25zdCB0aXRsZSA9IGZpZWxkcy50aXRsZSB8fCBwYW5lbFRpdGxlO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gZmllbGRzLm9yZ2FuaXphdGlvbjtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmNvbXBvc2VEZXNjcmlwdGlvbihmaWVsZHMpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIFdhdGVybG9vIFdvcmtzIHNjcmFwZXI6IE1pc3NpbmcgdGl0bGUgb3IgZGVzY3JpcHRpb25cIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuY29tcG9zZUxvY2F0aW9uKGZpZWxkcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnk6IGNvbXBhbnkgfHwgXCJVbmtub3duIEVtcGxveWVyXCIsXG4gICAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB0aGlzLnBhcnNlQnVsbGV0TGlzdChmaWVsZHMucmVxdWlyZW1lbnRzKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZXNwb25zaWJpbGl0aWVzOiB0aGlzLnBhcnNlQnVsbGV0TGlzdChmaWVsZHMucmVzcG9uc2liaWxpdGllcyksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgLy8gU2xvdGhpbmcncyBleHRlbnNpb24gc2NoZW1hIGNhcHMgb3B0aW9uYWwgc3RyaW5ncyBhdCA1MDAgY2hhcnMgYW5kXG4gICAgICAgICAgICAvLyBXYXRlcmxvb1dvcmtzIHB1dHMgdGhlIGZ1bGwgYmVuZWZpdHMgYmx1cmIgaW4gXCJDb21wZW5zYXRpb24gYW5kXG4gICAgICAgICAgICAvLyBCZW5lZml0c1wiLiBUYWtlIHRoZSBmaXJzdCBsaW5lL3NlbnRlbmNlIHNvIHdhZ2UgcmFuZ2VzIHN1cnZpdmUuXG4gICAgICAgICAgICBzYWxhcnk6IHRoaXMuY29uZGVuc2VTYWxhcnkoZmllbGRzLnNhbGFyeSksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGUoZmllbGRzLmpvYlR5cGUgfHwgZGVzY3JpcHRpb24pIHx8IFwiaW50ZXJuc2hpcFwiLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZUZyb21GaWVsZHMoZmllbGRzLCBsb2NhdGlvbiwgZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBzb3VyY2VKb2JJZCxcbiAgICAgICAgICAgIGRlYWRsaW5lOiBmaWVsZHMuZGVhZGxpbmUsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3QoKSB7XG4gICAgICAgIC8vIE1vZGVybiBXYXRlcmxvb1dvcmtzIHJlbmRlcnMgdGhlIHBvc3RpbmdzIGxpc3QgaW4gYSB2aXJ0dWFsaXplZCBTUEEgdmlld1xuICAgICAgICAvLyBhbmQgdGhlIHJvdyBzdW1tYXJpZXMgZG9uJ3QgaW5jbHVkZSBmdWxsIGRlc2NyaXB0aW9ucy4gQnVsay1pbXBvcnQgZnJvbVxuICAgICAgICAvLyB0aGUgbGlzdCB2aWV3IGlzIHByb3ZpZGVkIGJ5IHRoZSBvcmNoZXN0cmF0b3IgKHNlZVxuICAgICAgICAvLyB3YXRlcmxvby13b3Jrcy1vcmNoZXN0cmF0b3IudHMpLCB3aGljaCB3YWxrcyBlYWNoIHJvdywgb3BlbnMgaXRzIGRldGFpbFxuICAgICAgICAvLyBwYW5lbCwgYW5kIGNhbGxzIHNjcmFwZUpvYkxpc3RpbmcoKSBwZXIgcm93LiBzY3JhcGVKb2JMaXN0KCkgaXRzZWxmIHN0YXlzXG4gICAgICAgIC8vIGVtcHR5IHNvIHRoZSBnZW5lcmljIGF1dG8tZGV0ZWN0IHBhdGggZG9lc24ndCBhY2NpZGVudGFsbHkgcGljayBpdCB1cC5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpc0xvZ2luUGFnZSgpIHtcbiAgICAgICAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuICh1cmwuaW5jbHVkZXMoXCIvY2FzL1wiKSB8fFxuICAgICAgICAgICAgdXJsLmluY2x1ZGVzKFwiL2xvZ2luXCIpIHx8XG4gICAgICAgICAgICB1cmwuaW5jbHVkZXMoXCIvc2lnbmluXCIpIHx8XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSAhPT0gbnVsbCk7XG4gICAgfVxuICAgIHBhcnNlUG9zdGluZ0hlYWRlcigpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXNoYm9hcmQtaGVhZGVyX19wb3N0aW5nLXRpdGxlXCIpO1xuICAgICAgICBpZiAoIWhlYWRlcilcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgY29uc3QgaDJUZXh0ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKT8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgY29uc3QgaWRNYXRjaCA9IChoZWFkZXIudGV4dENvbnRlbnQgfHwgXCJcIikubWF0Y2goL1xcYihcXGR7NCwxMH0pXFxiLyk7XG4gICAgICAgIHJldHVybiB7IHNvdXJjZUpvYklkOiBpZE1hdGNoPy5bMV0sIHRpdGxlOiBoMlRleHQgfTtcbiAgICB9XG4gICAgY29sbGVjdEZpZWxkcygpIHtcbiAgICAgICAgY29uc3QgYmFnID0ge307XG4gICAgICAgIGNvbnN0IGJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGFnX19rZXktdmFsdWUtbGlzdC5qcy0tcXVlc3Rpb24tLWNvbnRhaW5lclwiKTtcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBibG9ja3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsUmF3ID0gYmxvY2sucXVlcnlTZWxlY3RvcihcIi5sYWJlbFwiKT8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgIGlmICghbGFiZWxSYXcpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMubm9ybWFsaXplTGFiZWwobGFiZWxSYXcpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWVFbCA9IGJsb2NrLnF1ZXJ5U2VsZWN0b3IoXCIudmFsdWVcIik7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlRWxcbiAgICAgICAgICAgICAgICA/IHZhbHVlRWwuaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgOiB0aGlzLnN0cmlwTGFiZWxGcm9tQmxvY2soYmxvY2ssIGxhYmVsUmF3KTtcbiAgICAgICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB0aGlzLmFzc2lnbkZpZWxkKGJhZywgbGFiZWwsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFnO1xuICAgIH1cbiAgICAvLyBcIldvcmsgVGVybTogIFwiIOKGkiBcIndvcmsgdGVybVwiXG4gICAgbm9ybWFsaXplTGFiZWwobGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIGxhYmVsXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9bOlxcc10rJC8sIFwiXCIpXG4gICAgICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgc3RyaXBMYWJlbEZyb21CbG9jayhibG9jaywgbGFiZWwpIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSBibG9jay5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3IoXCIubGFiZWxcIik/LnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gKGNsb25lLmlubmVySFRNTC50cmltKCkgfHxcbiAgICAgICAgICAgIGNsb25lLnRleHRDb250ZW50Py5yZXBsYWNlKGxhYmVsLCBcIlwiKS50cmltKCkgfHxcbiAgICAgICAgICAgIFwiXCIpO1xuICAgIH1cbiAgICBhc3NpZ25GaWVsZChiYWcsIG5vcm1hbGl6ZWRMYWJlbCwgaHRtbFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGNsZWFuZWQgPSB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbFZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBjYW5kaWRhdGVzXSBvZiBPYmplY3QuZW50cmllcyhGSUVMRF9MQUJFTFMpKSB7XG4gICAgICAgICAgICBpZiAoY2FuZGlkYXRlcy5zb21lKChjKSA9PiBub3JtYWxpemVkTGFiZWwuc3RhcnRzV2l0aChjLnRvTG93ZXJDYXNlKCkpKSkge1xuICAgICAgICAgICAgICAgIGlmICghYmFnW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYmFnW2tleV0gPVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID09PSBcInJlc3BvbnNpYmlsaXRpZXNcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9PT0gXCJyZXF1aXJlbWVudHNcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9PT0gXCJzdW1tYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGh0bWxWYWx1ZSAvLyBrZWVwIEhUTUwgZm9yIGJ1bGxldCBwYXJzaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjbGVhbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcG9zZURlc2NyaXB0aW9uKGZpZWxkcykge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgICAgICBpZiAoZmllbGRzLnN1bW1hcnkpXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHRoaXMuY2xlYW5EZXNjcmlwdGlvbihmaWVsZHMuc3VtbWFyeSkpO1xuICAgICAgICBpZiAoZmllbGRzLnJlc3BvbnNpYmlsaXRpZXMpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goXCJSZXNwb25zaWJpbGl0aWVzOlwiKTtcbiAgICAgICAgICAgIHBhcnRzLnB1c2godGhpcy5jbGVhbkRlc2NyaXB0aW9uKGZpZWxkcy5yZXNwb25zaWJpbGl0aWVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkcy5yZXF1aXJlbWVudHMpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goXCJSZXF1aXJlZCBTa2lsbHM6XCIpO1xuICAgICAgICAgICAgcGFydHMucHVzaCh0aGlzLmNsZWFuRGVzY3JpcHRpb24oZmllbGRzLnJlcXVpcmVtZW50cykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJ0cy5maWx0ZXIoQm9vbGVhbikuam9pbihcIlxcblxcblwiKS50cmltKCk7XG4gICAgfVxuICAgIGNvbXBvc2VMb2NhdGlvbihmaWVsZHMpIHtcbiAgICAgICAgaWYgKGZpZWxkcy5sb2NhdGlvbkZ1bGwpXG4gICAgICAgICAgICByZXR1cm4gZmllbGRzLmxvY2F0aW9uRnVsbDtcbiAgICAgICAgY29uc3QgcGllY2VzID0gW1xuICAgICAgICAgICAgZmllbGRzLmxvY2F0aW9uQ2l0eSxcbiAgICAgICAgICAgIGZpZWxkcy5sb2NhdGlvblJlZ2lvbixcbiAgICAgICAgICAgIGZpZWxkcy5sb2NhdGlvbkNvdW50cnksXG4gICAgICAgIF1cbiAgICAgICAgICAgIC5tYXAoKHApID0+IHA/LnRyaW0oKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKHApID0+ICEhcCAmJiBwLmxlbmd0aCA+IDApO1xuICAgICAgICByZXR1cm4gcGllY2VzLmxlbmd0aCA+IDAgPyBwaWVjZXMuam9pbihcIiwgXCIpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBkZXRlY3RSZW1vdGVGcm9tRmllbGRzKGZpZWxkcywgbG9jYXRpb24sIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IGFycmFuZ2VtZW50ID0gKGZpZWxkcy5lbXBsb3ltZW50QXJyYW5nZW1lbnQgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKC9yZW1vdGV8dmlydHVhbHx3b3JrIGZyb20gaG9tZXxkaXN0cmlidXRlZC8udGVzdChhcnJhbmdlbWVudCkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKC9oeWJyaWQvLnRlc3QoYXJyYW5nZW1lbnQpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIGh5YnJpZCBpbXBsaWVzIHNvbWUgcmVtb3RlXG4gICAgICAgIHJldHVybiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCBcIlwiKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbik7XG4gICAgfVxuICAgIGNvbmRlbnNlU2FsYXJ5KHJhdykge1xuICAgICAgICBpZiAoIXJhdylcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSByYXcudHJpbSgpO1xuICAgICAgICBpZiAodHJpbW1lZC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAvLyBQcmVmZXIgdGhlIGZpcnN0IGxpbmUgLyBzZW50ZW5jZSDigJQgdXN1YWxseSB0aGUgd2FnZSByYW5nZS4gSWYgc3RpbGwgdG9vXG4gICAgICAgIC8vIGxvbmcsIGhhcmQtY2FwIGF0IDQ4MCBjaGFycyB3aXRoIGFuIGVsbGlwc2lzIHNvIHRoZSBzY2hlbWEgdmFsaWRhdG9yXG4gICAgICAgIC8vIGFjY2VwdHMgaXQgKGxpbWl0IGlzIDUwMCkuXG4gICAgICAgIGNvbnN0IGZpcnN0Q2h1bmsgPSB0cmltbWVkLnNwbGl0KC9cXG5cXG58XFxuKD89W0EtWl0pLylbMF0/LnRyaW0oKSB8fCB0cmltbWVkO1xuICAgICAgICBpZiAoZmlyc3RDaHVuay5sZW5ndGggPD0gNDgwKVxuICAgICAgICAgICAgcmV0dXJuIGZpcnN0Q2h1bms7XG4gICAgICAgIHJldHVybiBmaXJzdENodW5rLnNsaWNlKDAsIDQ3NykgKyBcIi4uLlwiO1xuICAgIH1cbiAgICBwYXJzZUJ1bGxldExpc3QoaHRtbCkge1xuICAgICAgICBpZiAoIWh0bWwpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpXG4gICAgICAgICAgICAubWFwKChsaSkgPT4gbGkudGV4dENvbnRlbnQ/LnRyaW0oKSB8fCBcIlwiKVxuICAgICAgICAgICAgLmZpbHRlcigodCkgPT4gdC5sZW5ndGggPiAwKTtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLmxlbmd0aCA+IDAgPyBpdGVtcyA6IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iLCIvLyBJbmRlZWQgam9iIHNjcmFwZXJcbmltcG9ydCB7IEJhc2VTY3JhcGVyIH0gZnJvbSBcIi4vYmFzZS1zY3JhcGVyXCI7XG5leHBvcnQgY2xhc3MgSW5kZWVkU2NyYXBlciBleHRlbmRzIEJhc2VTY3JhcGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBcImluZGVlZFwiO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm5zID0gW1xuICAgICAgICAgICAgL2luZGVlZFxcLmNvbVxcL3ZpZXdqb2IvLFxuICAgICAgICAgICAgL2luZGVlZFxcLmNvbVxcL2pvYnNcXC8vLFxuICAgICAgICAgICAgL2luZGVlZFxcLmNvbVxcL2pvYlxcLy8sXG4gICAgICAgICAgICAvaW5kZWVkXFwuY29tXFwvcmNcXC9jbGsvLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gV2FpdCBmb3Igam9iIGRldGFpbHMgdG8gbG9hZFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yRWxlbWVudCgnLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXRpdGxlLCBbZGF0YS10ZXN0aWQ9XCJqb2JzZWFyY2gtSm9iSW5mb0hlYWRlci10aXRsZVwiXScsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggYXZhaWxhYmxlIGRhdGFcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIEluZGVlZCBzY3JhcGVyOiBNaXNzaW5nIHJlcXVpcmVkIGZpZWxkc1wiLCB7XG4gICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogISFkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RydWN0dXJlZERhdGEgPSB0aGlzLmV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uIHx8IHN0cnVjdHVyZWREYXRhPy5sb2NhdGlvbixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB0aGlzLmV4dHJhY3RSZXF1aXJlbWVudHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAga2V5d29yZHM6IHRoaXMuZXh0cmFjdEtleXdvcmRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHNhbGFyeTogdGhpcy5leHRyYWN0U2FsYXJ5RnJvbVBhZ2UoKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbikgfHxcbiAgICAgICAgICAgICAgICBzdHJ1Y3R1cmVkRGF0YT8uc2FsYXJ5LFxuICAgICAgICAgICAgdHlwZTogdGhpcy5kZXRlY3RKb2JUeXBlKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHJlbW90ZTogdGhpcy5kZXRlY3RSZW1vdGUobG9jYXRpb24gfHwgXCJcIikgfHwgdGhpcy5kZXRlY3RSZW1vdGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBzb3VyY2VKb2JJZDogdGhpcy5leHRyYWN0Sm9iSWQoKSxcbiAgICAgICAgICAgIHBvc3RlZEF0OiBzdHJ1Y3R1cmVkRGF0YT8ucG9zdGVkQXQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3QoKSB7XG4gICAgICAgIGNvbnN0IGpvYnMgPSBbXTtcbiAgICAgICAgLy8gSm9iIGNhcmRzIGluIHNlYXJjaCByZXN1bHRzXG4gICAgICAgIGNvbnN0IGpvYkNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpvYl9zZWVuX2JlYWNvbiwgLmpvYnNlYXJjaC1SZXN1bHRzTGlzdCA+IGxpLCBbZGF0YS10ZXN0aWQ9XCJqb2ItY2FyZFwiXScpO1xuICAgICAgICBmb3IgKGNvbnN0IGNhcmQgb2Ygam9iQ2FyZHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLmpvYlRpdGxlLCBbZGF0YS10ZXN0aWQ9XCJqb2JUaXRsZVwiXSwgaDIuam9iVGl0bGUgYSwgLmpjcy1Kb2JUaXRsZScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnlFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLmNvbXBhbnlOYW1lLCBbZGF0YS10ZXN0aWQ9XCJjb21wYW55LW5hbWVcIl0sIC5jb21wYW55X2xvY2F0aW9uIC5jb21wYW55TmFtZScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5jb21wYW55TG9jYXRpb24sIFtkYXRhLXRlc3RpZD1cInRleHQtbG9jYXRpb25cIl0sIC5jb21wYW55X2xvY2F0aW9uIC5jb21wYW55TG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYWxhcnlFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLnNhbGFyeS1zbmlwcGV0LWNvbnRhaW5lciwgW2RhdGEtdGVzdGlkPVwiYXR0cmlidXRlX3NuaXBwZXRfdGVzdGlkXCJdLCAuZXN0aW1hdGVkLXNhbGFyeScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGl0bGVFbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wYW55ID0gY29tcGFueUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbG9jYXRpb25FbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYWxhcnkgPSBzYWxhcnlFbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICAvLyBHZXQgVVJMIGZyb20gdGl0bGUgbGluayBvciBkYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSB0aXRsZUVsPy5ocmVmO1xuICAgICAgICAgICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpvYktleSA9IGNhcmQuZ2V0QXR0cmlidXRlKFwiZGF0YS1qa1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYktleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gYGh0dHBzOi8vd3d3LmluZGVlZC5jb20vdmlld2pvYj9qaz0ke2pvYktleX1gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aXRsZSAmJiBjb21wYW55ICYmIHVybCkge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBzYWxhcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSm9iSWQ6IHRoaXMuZXh0cmFjdEpvYklkRnJvbVVybCh1cmwpLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltDb2x1bWJ1c10gRXJyb3Igc2NyYXBpbmcgSW5kZWVkIGpvYiBjYXJkOlwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2JzO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iVGl0bGUoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXRpdGxlXCIsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiam9ic2VhcmNoLUpvYkluZm9IZWFkZXItdGl0bGVcIl0nLFxuICAgICAgICAgICAgXCJoMS5qb2JzZWFyY2gtSm9iSW5mb0hlYWRlci10aXRsZVwiLFxuICAgICAgICAgICAgXCIuaWNsLXUteHMtbWItLXhzIGgxXCIsXG4gICAgICAgICAgICAnaDFbY2xhc3MqPVwiSm9iSW5mb0hlYWRlclwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiaW5saW5lSGVhZGVyLWNvbXBhbnlOYW1lXCJdIGEnLFxuICAgICAgICAgICAgJ1tkYXRhLXRlc3RpZD1cImlubGluZUhlYWRlci1jb21wYW55TmFtZVwiXScsXG4gICAgICAgICAgICBcIi5qb2JzZWFyY2gtSW5saW5lQ29tcGFueVJhdGluZy1jb21wYW55SGVhZGVyIGFcIixcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1JbmxpbmVDb21wYW55UmF0aW5nIGFcIixcbiAgICAgICAgICAgIFwiLmljbC11LWxnLW1yLS1zbSBhXCIsXG4gICAgICAgICAgICAnW2RhdGEtY29tcGFueS1uYW1lPVwidHJ1ZVwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RMb2NhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJ1tkYXRhLXRlc3RpZD1cImlubGluZUhlYWRlci1jb21wYW55TG9jYXRpb25cIl0nLFxuICAgICAgICAgICAgJ1tkYXRhLXRlc3RpZD1cImpvYi1sb2NhdGlvblwiXScsXG4gICAgICAgICAgICBcIi5qb2JzZWFyY2gtSm9iSW5mb0hlYWRlci1zdWJ0aXRsZSA+IGRpdjpudGgtY2hpbGQoMilcIixcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1JbmxpbmVDb21wYW55UmF0aW5nICsgZGl2XCIsXG4gICAgICAgICAgICBcIi5pY2wtdS14cy1tdC0teHMgLmljbC11LXRleHRDb2xvci0tc2Vjb25kYXJ5XCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgIXRleHQuaW5jbHVkZXMoXCJyZXZpZXdzXCIpICYmICF0ZXh0LmluY2x1ZGVzKFwicmF0aW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3REZXNjcmlwdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIjam9iRGVzY3JpcHRpb25UZXh0XCIsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiam9iRGVzY3JpcHRpb25UZXh0XCJdJyxcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1qb2JEZXNjcmlwdGlvblRleHRcIixcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1Kb2JDb21wb25lbnQtZGVzY3JpcHRpb25cIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLmV4dHJhY3RIdG1sQ29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoaHRtbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RTYWxhcnlGcm9tUGFnZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJ1tkYXRhLXRlc3RpZD1cImpvYnNlYXJjaC1Kb2JNZXRhZGF0YUhlYWRlci1zYWxhcnlJbmZvXCJdJyxcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1Kb2JNZXRhZGF0YUhlYWRlci1zYWxhcnlJbmZvXCIsXG4gICAgICAgICAgICBcIiNzYWxhcnlJbmZvQW5kSm9iVHlwZSAuYXR0cmlidXRlX3NuaXBwZXRcIixcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXNhbGFyeVwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQuaW5jbHVkZXMoXCIkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZXh0cmFjdEpvYklkKCkge1xuICAgICAgICAvLyBGcm9tIFVSTCBwYXJhbWV0ZXJcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAgICAgY29uc3QgamsgPSB1cmxQYXJhbXMuZ2V0KFwiamtcIik7XG4gICAgICAgIGlmIChqaylcbiAgICAgICAgICAgIHJldHVybiBqaztcbiAgICAgICAgLy8gRnJvbSBVUkwgcGF0aFxuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXC9qb2JcXC8oW2EtZjAtOV0rKS9pKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKHVybCk7XG4gICAgICAgICAgICBjb25zdCBqayA9IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KFwiamtcIik7XG4gICAgICAgICAgICBpZiAoamspXG4gICAgICAgICAgICAgICAgcmV0dXJuIGprO1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2pvYlxcLyhbYS1mMC05XSspL2kpO1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHRyYWN0U3RydWN0dXJlZERhdGEoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsZEpzb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbdHlwZT1cImFwcGxpY2F0aW9uL2xkK2pzb25cIl0nKTtcbiAgICAgICAgICAgIGlmICghbGRKc29uPy50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGxkSnNvbi50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICAvLyBJbmRlZWQgbWF5IGhhdmUgYW4gYXJyYXkgb2Ygc3RydWN0dXJlZCBkYXRhXG4gICAgICAgICAgICBjb25zdCBqb2JEYXRhID0gQXJyYXkuaXNBcnJheShkYXRhKVxuICAgICAgICAgICAgICAgID8gZGF0YS5maW5kKChkKSA9PiBkW1wiQHR5cGVcIl0gPT09IFwiSm9iUG9zdGluZ1wiKVxuICAgICAgICAgICAgICAgIDogZGF0YTtcbiAgICAgICAgICAgIGlmICgham9iRGF0YSB8fCBqb2JEYXRhW1wiQHR5cGVcIl0gIT09IFwiSm9iUG9zdGluZ1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8uYWRkcmVzc0xvY2FsaXR5IHx8XG4gICAgICAgICAgICAgICAgICAgIGpvYkRhdGEuam9iTG9jYXRpb24/LmFkZHJlc3M/Lm5hbWUsXG4gICAgICAgICAgICAgICAgc2FsYXJ5OiBqb2JEYXRhLmJhc2VTYWxhcnk/LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgID8gYCQke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS5taW5WYWx1ZSB8fCBcIlwifS0ke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS5tYXhWYWx1ZSB8fCBcIlwifSAke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS51bml0VGV4dCB8fCBcIlwifWBcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGpvYkRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBHcmVlbmhvdXNlIGpvYiBib2FyZCBzY3JhcGVyXG5pbXBvcnQgeyBCYXNlU2NyYXBlciB9IGZyb20gXCIuL2Jhc2Utc2NyYXBlclwiO1xuZXhwb3J0IGNsYXNzIEdyZWVuaG91c2VTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IFwiZ3JlZW5ob3VzZVwiO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm5zID0gW1xuICAgICAgICAgICAgL2JvYXJkc1xcLmdyZWVuaG91c2VcXC5pb1xcL1tcXHctXStcXC9qb2JzXFwvXFxkKy8sXG4gICAgICAgICAgICAvW1xcdy1dK1xcLmdyZWVuaG91c2VcXC5pb1xcL2pvYnNcXC9cXGQrLyxcbiAgICAgICAgICAgIC9ncmVlbmhvdXNlXFwuaW9cXC9lbWJlZFxcL2pvYl9hcHAvLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gV2FpdCBmb3Igam9iIGNvbnRlbnQgdG8gbG9hZFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yRWxlbWVudChcIi5hcHAtdGl0bGUsICNoZWFkZXIgLmNvbXBhbnktbmFtZSwgLmpvYi10aXRsZVwiLCAzMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIGF2YWlsYWJsZSBkYXRhXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmV4dHJhY3RKb2JUaXRsZSgpO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5leHRyYWN0Q29tcGFueSgpO1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5leHRyYWN0RGVzY3JpcHRpb24oKTtcbiAgICAgICAgaWYgKCF0aXRsZSB8fCAhY29tcGFueSB8fCAhZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBHcmVlbmhvdXNlIHNjcmFwZXI6IE1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIsIHtcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAhIWRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgc3RydWN0dXJlZERhdGE/LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnkoZGVzY3JpcHRpb24pIHx8IHN0cnVjdHVyZWREYXRhPy5zYWxhcnksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGUoZGVzY3JpcHRpb24pIHx8IHN0cnVjdHVyZWREYXRhPy50eXBlLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCBcIlwiKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgY2FyZHMgb24gZGVwYXJ0bWVudC9saXN0aW5nIHBhZ2VzXG4gICAgICAgIGNvbnN0IGpvYkNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9wZW5pbmcsIC5qb2ItcG9zdCwgW2RhdGEtbWFwcGVkPVwidHJ1ZVwiXSwgc2VjdGlvbi5sZXZlbC0wID4gZGl2Jyk7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBqb2JDYXJkcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKFwiYSwgLm9wZW5pbmctdGl0bGUsIC5qb2ItdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FbCA9IGNhcmQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbiwgLmpvYi1sb2NhdGlvbiwgc3BhbjpsYXN0LWNoaWxkXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGl0bGVFbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGxvY2F0aW9uRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdGl0bGVFbD8uaHJlZjtcbiAgICAgICAgICAgICAgICAvLyBDb21wYW55IGlzIHVzdWFsbHkgaW4gaGVhZGVyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZXh0cmFjdENvbXBhbnkoKTtcbiAgICAgICAgICAgICAgICBpZiAodGl0bGUgJiYgdXJsICYmIGNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ29sdW1idXNdIEVycm9yIHNjcmFwaW5nIEdyZWVuaG91c2Ugam9iIGNhcmQ6XCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuYXBwLXRpdGxlXCIsXG4gICAgICAgICAgICBcIi5qb2ItdGl0bGVcIixcbiAgICAgICAgICAgIFwiaDEuaGVhZGluZ1wiLFxuICAgICAgICAgICAgXCIuam9iLWluZm8gaDFcIixcbiAgICAgICAgICAgIFwiI2hlYWRlciBoMVwiLFxuICAgICAgICAgICAgJ2gxW2NsYXNzKj1cImpvYlwiXScsXG4gICAgICAgICAgICBcIi5oZXJvIGgxXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHN0cnVjdHVyZWQgZGF0YVxuICAgICAgICBjb25zdCBsZEpzb24gPSB0aGlzLmV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpO1xuICAgICAgICBpZiAobGRKc29uPy50aXRsZSlcbiAgICAgICAgICAgIHJldHVybiBsZEpzb24udGl0bGU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0Q29tcGFueSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuY29tcGFueS1uYW1lXCIsXG4gICAgICAgICAgICBcIiNoZWFkZXIgLmNvbXBhbnktbmFtZVwiLFxuICAgICAgICAgICAgXCIubG9nby13cmFwcGVyIGltZ1thbHRdXCIsXG4gICAgICAgICAgICBcIi5jb21wYW55LWhlYWRlciAubmFtZVwiLFxuICAgICAgICAgICAgJ21ldGFbcHJvcGVydHk9XCJvZzpzaXRlX25hbWVcIl0nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yLmluY2x1ZGVzKFwibWV0YVwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gbWV0YT8uZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZWxlY3Rvci5pbmNsdWRlcyhcImltZ1thbHRdXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgY29uc3QgYWx0ID0gaW1nPy5nZXRBdHRyaWJ1dGUoXCJhbHRcIik7XG4gICAgICAgICAgICAgICAgaWYgKGFsdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEV4dHJhY3QgZnJvbSBVUkwgKGJvYXJkcy5ncmVlbmhvdXNlLmlvL0NPTVBBTlkvam9icy8uLi4pXG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL2dyZWVuaG91c2VcXC5pb1xcLyhbXi9dKykvKTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzFdICE9PSBcImpvYnNcIikge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLy0vZywgXCIgXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcYlxcdy9nLCAoYykgPT4gYy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdExvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5sb2NhdGlvblwiLFxuICAgICAgICAgICAgXCIuam9iLWxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi5jb21wYW55LWxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi5qb2ItaW5mbyAubG9jYXRpb25cIixcbiAgICAgICAgICAgIFwiI2hlYWRlciAubG9jYXRpb25cIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdERlc2NyaXB0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIiNjb250ZW50XCIsXG4gICAgICAgICAgICBcIi5qb2ItZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgIFwiLmNvbnRlbnQtd3JhcHBlciAuY29udGVudFwiLFxuICAgICAgICAgICAgXCIjam9iX2Rlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICBcIi5qb2ItY29udGVudFwiLFxuICAgICAgICAgICAgXCIuam9iLWluZm8gLmNvbnRlbnRcIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLmV4dHJhY3RIdG1sQ29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoaHRtbCAmJiBodG1sLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZCgpIHtcbiAgICAgICAgLy8gRnJvbSBVUkw6IGJvYXJkcy5ncmVlbmhvdXNlLmlvL2NvbXBhbnkvam9icy8xMjM0NVxuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXC9qb2JzXFwvKFxcZCspLyk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iSWRGcm9tVXJsKHVybCkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvam9ic1xcLyhcXGQrKS8pO1xuICAgICAgICByZXR1cm4gbWF0Y2g/LlsxXTtcbiAgICB9XG4gICAgZXh0cmFjdFN0cnVjdHVyZWREYXRhKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbGRKc29uRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cImFwcGxpY2F0aW9uL2xkK2pzb25cIl0nKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGRKc29uRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVsLnRleHRDb250ZW50KVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShlbC50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9iRGF0YSA9IEFycmF5LmlzQXJyYXkoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgPyBkYXRhLmZpbmQoKGQpID0+IGRbXCJAdHlwZVwiXSA9PT0gXCJKb2JQb3N0aW5nXCIpXG4gICAgICAgICAgICAgICAgICAgIDogZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoIWpvYkRhdGEgfHwgam9iRGF0YVtcIkB0eXBlXCJdICE9PSBcIkpvYlBvc3RpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1wbG95bWVudFR5cGUgPSBqb2JEYXRhLmVtcGxveW1lbnRUeXBlPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlO1xuICAgICAgICAgICAgICAgIGlmIChlbXBsb3ltZW50VHlwZT8uaW5jbHVkZXMoXCJmdWxsXCIpKVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gXCJmdWxsLXRpbWVcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbXBsb3ltZW50VHlwZT8uaW5jbHVkZXMoXCJwYXJ0XCIpKVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gXCJwYXJ0LXRpbWVcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbXBsb3ltZW50VHlwZT8uaW5jbHVkZXMoXCJjb250cmFjdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IFwiY29udHJhY3RcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbXBsb3ltZW50VHlwZT8uaW5jbHVkZXMoXCJpbnRlcm5cIikpXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcImludGVybnNoaXBcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogam9iRGF0YS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IHR5cGVvZiBqb2JEYXRhLmpvYkxvY2F0aW9uID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGpvYkRhdGEuam9iTG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIDogam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8uYWRkcmVzc0xvY2FsaXR5IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8ubmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYkRhdGEuam9iTG9jYXRpb24/Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNhbGFyeTogam9iRGF0YS5iYXNlU2FsYXJ5Py52YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgJCR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1pblZhbHVlIHx8IFwiXCJ9LSR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8IFwiXCJ9YFxuICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHBvc3RlZEF0OiBqb2JEYXRhLmRhdGVQb3N0ZWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gTGV2ZXIgam9iIGJvYXJkIHNjcmFwZXJcbmltcG9ydCB7IEJhc2VTY3JhcGVyIH0gZnJvbSBcIi4vYmFzZS1zY3JhcGVyXCI7XG5leHBvcnQgY2xhc3MgTGV2ZXJTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IFwibGV2ZXJcIjtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJucyA9IFtcbiAgICAgICAgICAgIC9qb2JzXFwubGV2ZXJcXC5jb1xcL1tcXHctXStcXC9bXFx3LV0rLyxcbiAgICAgICAgICAgIC9bXFx3LV0rXFwubGV2ZXJcXC5jb1xcL1tcXHctXSsvLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybFBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gV2FpdCBmb3Igam9iIGNvbnRlbnQgdG8gbG9hZFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yRWxlbWVudChcIi5wb3N0aW5nLWhlYWRsaW5lIGgyLCAucG9zdGluZy1oZWFkbGluZSBoMSwgLnNlY3Rpb24td3JhcHBlclwiLCAzMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIGF2YWlsYWJsZSBkYXRhXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmV4dHJhY3RKb2JUaXRsZSgpO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5leHRyYWN0Q29tcGFueSgpO1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5leHRyYWN0RGVzY3JpcHRpb24oKTtcbiAgICAgICAgaWYgKCF0aXRsZSB8fCAhY29tcGFueSB8fCAhZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBMZXZlciBzY3JhcGVyOiBNaXNzaW5nIHJlcXVpcmVkIGZpZWxkc1wiLCB7XG4gICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogISFkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RydWN0dXJlZERhdGEgPSB0aGlzLmV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpO1xuICAgICAgICBjb25zdCBjb21taXRtZW50ID0gdGhpcy5leHRyYWN0Q29tbWl0bWVudCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uIHx8IHN0cnVjdHVyZWREYXRhPy5sb2NhdGlvbixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiB0aGlzLmV4dHJhY3RSZXF1aXJlbWVudHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAga2V5d29yZHM6IHRoaXMuZXh0cmFjdEtleXdvcmRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHNhbGFyeTogdGhpcy5leHRyYWN0U2FsYXJ5KGRlc2NyaXB0aW9uKSB8fCBzdHJ1Y3R1cmVkRGF0YT8uc2FsYXJ5LFxuICAgICAgICAgICAgdHlwZTogdGhpcy5kZXRlY3RKb2JUeXBlRnJvbUNvbW1pdG1lbnQoY29tbWl0bWVudCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmRldGVjdEpvYlR5cGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCBcIlwiKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgcG9zdGluZ3Mgb24gY29tcGFueSBwYWdlXG4gICAgICAgIGNvbnN0IGpvYkNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvc3RpbmcsIFtkYXRhLXFhPVwicG9zdGluZy1uYW1lXCJdJyk7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBqb2JDYXJkcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcucG9zdGluZy10aXRsZSBoNSwgLnBvc3RpbmctbmFtZSwgYVtkYXRhLXFhPVwicG9zdGluZy1uYW1lXCJdJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FbCA9IGNhcmQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbiwgLnBvc3RpbmctY2F0ZWdvcmllcyAuc29ydC1ieS1sb2NhdGlvbiwgLndvcmtwbGFjZVR5cGVzXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1pdG1lbnRFbCA9IGNhcmQucXVlcnlTZWxlY3RvcihcIi5jb21taXRtZW50LCAucG9zdGluZy1jYXRlZ29yaWVzIC5zb3J0LWJ5LWNvbW1pdG1lbnRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbG9jYXRpb25FbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21taXRtZW50ID0gY29tbWl0bWVudEVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGNhcmQucXVlcnlTZWxlY3RvcignYS5wb3N0aW5nLXRpdGxlLCBhW2RhdGEtcWE9XCJwb3N0aW5nLW5hbWVcIl0nKT8uaHJlZiB8fCBjYXJkLmhyZWY7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZXh0cmFjdENvbXBhbnkoKTtcbiAgICAgICAgICAgICAgICBpZiAodGl0bGUgJiYgdXJsICYmIGNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZUZyb21Db21taXRtZW50KGNvbW1pdG1lbnQgPz8gbnVsbCksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0NvbHVtYnVzXSBFcnJvciBzY3JhcGluZyBMZXZlciBqb2IgY2FyZDpcIiwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gam9icztcbiAgICB9XG4gICAgZXh0cmFjdEpvYlRpdGxlKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWhlYWRsaW5lIGgyXCIsXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWhlYWRsaW5lIGgxXCIsXG4gICAgICAgICAgICAnW2RhdGEtcWE9XCJwb3N0aW5nLW5hbWVcIl0nLFxuICAgICAgICAgICAgXCIucG9zdGluZy1oZWFkZXIgaDJcIixcbiAgICAgICAgICAgIFwiLnNlY3Rpb24ucGFnZS1jZW50ZXJlZC5wb3N0aW5nLWhlYWRlciBoMVwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0Q29tcGFueSgpIHtcbiAgICAgICAgLy8gVHJ5IGxvZ28gYWx0IHRleHRcbiAgICAgICAgY29uc3QgbG9nbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1oZWFkZXItbG9nbyBpbWcsIC5wb3N0aW5nLWhlYWRlciAubG9nbyBpbWcsIGhlYWRlciBpbWdcIik7XG4gICAgICAgIGlmIChsb2dvKSB7XG4gICAgICAgICAgICBjb25zdCBhbHQgPSBsb2dvLmdldEF0dHJpYnV0ZShcImFsdFwiKTtcbiAgICAgICAgICAgIGlmIChhbHQgJiYgYWx0ICE9PSBcIkNvbXBhbnkgTG9nb1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBhbHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IHBhZ2UgdGl0bGVcbiAgICAgICAgY29uc3QgcGFnZVRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgICAgIGlmIChwYWdlVGl0bGUpIHtcbiAgICAgICAgICAgIC8vIEZvcm1hdDogXCJKb2IgVGl0bGUgLSBDb21wYW55IE5hbWVcIlxuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBwYWdlVGl0bGUuc3BsaXQoXCIgLSBcIik7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZShcIiBKb2JzXCIsIFwiXCIpLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHRyYWN0IGZyb20gVVJMXG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL2xldmVyXFwuY29cXC8oW14vXSspLyk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzFdXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLy0vZywgXCIgXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcYlxcdy9nLCAoYykgPT4gYy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdExvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWNhdGVnb3JpZXMgLmxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWhlYWRsaW5lIC5sb2NhdGlvblwiLFxuICAgICAgICAgICAgXCIuc29ydC1ieS1sb2NhdGlvblwiLFxuICAgICAgICAgICAgXCIud29ya3BsYWNlVHlwZXNcIixcbiAgICAgICAgICAgICdbZGF0YS1xYT1cInBvc3RpbmctbG9jYXRpb25cIl0nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0Q29tbWl0bWVudCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIucG9zdGluZy1jYXRlZ29yaWVzIC5jb21taXRtZW50XCIsXG4gICAgICAgICAgICBcIi5zb3J0LWJ5LWNvbW1pdG1lbnRcIixcbiAgICAgICAgICAgICdbZGF0YS1xYT1cInBvc3RpbmctY29tbWl0bWVudFwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3REZXNjcmlwdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIucG9zdGluZy1wYWdlIC5jb250ZW50XCIsXG4gICAgICAgICAgICBcIi5zZWN0aW9uLXdyYXBwZXIucGFnZS1mdWxsLXdpZHRoXCIsXG4gICAgICAgICAgICBcIi5zZWN0aW9uLnBhZ2UtY2VudGVyZWRcIixcbiAgICAgICAgICAgICdbZGF0YS1xYT1cImpvYi1kZXNjcmlwdGlvblwiXScsXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWRlc2NyaXB0aW9uXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICAvLyBGb3IgTGV2ZXIsIHdlIHdhbnQgdG8gZ2V0IGFsbCBjb250ZW50IHNlY3Rpb25zXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBodG1sID0gQXJyYXkuZnJvbShzZWN0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgocykgPT4gcy5pbm5lckhUTUwpXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXFxuXCIpO1xuICAgICAgICAgICAgICAgIGlmIChodG1sLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgZ2V0dGluZyB0aGUgbWFpbiBjb250ZW50IGFyZWFcbiAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnQtd3JhcHBlciAuY29udGVudCwgbWFpbiAuY29udGVudFwiKTtcbiAgICAgICAgaWYgKG1haW5Db250ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKG1haW5Db250ZW50LmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZCgpIHtcbiAgICAgICAgLy8gRnJvbSBVUkw6IGpvYnMubGV2ZXIuY28vY29tcGFueS9qb2ItaWQtdXVpZFxuICAgICAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9sZXZlclxcLmNvXFwvW14vXStcXC8oW2EtZjAtOS1dKykvaSk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iSWRGcm9tVXJsKHVybCkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvbGV2ZXJcXC5jb1xcL1teL10rXFwvKFthLWYwLTktXSspL2kpO1xuICAgICAgICByZXR1cm4gbWF0Y2g/LlsxXTtcbiAgICB9XG4gICAgZGV0ZWN0Sm9iVHlwZUZyb21Db21taXRtZW50KGNvbW1pdG1lbnQpIHtcbiAgICAgICAgaWYgKCFjb21taXRtZW50KVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbG93ZXIgPSBjb21taXRtZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcImZ1bGwtdGltZVwiKSB8fCBsb3dlci5pbmNsdWRlcyhcImZ1bGwgdGltZVwiKSlcbiAgICAgICAgICAgIHJldHVybiBcImZ1bGwtdGltZVwiO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJwYXJ0LXRpbWVcIikgfHwgbG93ZXIuaW5jbHVkZXMoXCJwYXJ0IHRpbWVcIikpXG4gICAgICAgICAgICByZXR1cm4gXCJwYXJ0LXRpbWVcIjtcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwiY29udHJhY3RcIikgfHwgbG93ZXIuaW5jbHVkZXMoXCJjb250cmFjdG9yXCIpKVxuICAgICAgICAgICAgcmV0dXJuIFwiY29udHJhY3RcIjtcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwiaW50ZXJuXCIpKVxuICAgICAgICAgICAgcmV0dXJuIFwiaW50ZXJuc2hpcFwiO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleHRyYWN0U3RydWN0dXJlZERhdGEoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsZEpzb25FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiXScpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbCBvZiBsZEpzb25FbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGlmICghZWwudGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGVsLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JEYXRhID0gQXJyYXkuaXNBcnJheShkYXRhKVxuICAgICAgICAgICAgICAgICAgICA/IGRhdGEuZmluZCgoZCkgPT4gZFtcIkB0eXBlXCJdID09PSBcIkpvYlBvc3RpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgOiBkYXRhO1xuICAgICAgICAgICAgICAgIGlmICgham9iRGF0YSB8fCBqb2JEYXRhW1wiQHR5cGVcIl0gIT09IFwiSm9iUG9zdGluZ1wiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogdHlwZW9mIGpvYkRhdGEuam9iTG9jYXRpb24gPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gam9iRGF0YS5qb2JMb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgOiBqb2JEYXRhLmpvYkxvY2F0aW9uPy5hZGRyZXNzPy5hZGRyZXNzTG9jYWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JEYXRhLmpvYkxvY2F0aW9uPy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBzYWxhcnk6IGpvYkRhdGEuYmFzZVNhbGFyeT8udmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCQke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS5taW5WYWx1ZSB8fCBcIlwifS0ke2pvYkRhdGEuYmFzZVNhbGFyeS52YWx1ZS5tYXhWYWx1ZSB8fCBcIlwifWBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBwb3N0ZWRBdDogam9iRGF0YS5kYXRlUG9zdGVkLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEdlbmVyaWMgam9iIHNjcmFwZXIgZm9yIHVua25vd24gc2l0ZXNcbmltcG9ydCB7IEJhc2VTY3JhcGVyIH0gZnJvbSBcIi4vYmFzZS1zY3JhcGVyXCI7XG5leHBvcnQgY2xhc3MgR2VuZXJpY1NjcmFwZXIgZXh0ZW5kcyBCYXNlU2NyYXBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc291cmNlID0gXCJ1bmtub3duXCI7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybnMgPSBbXTtcbiAgICB9XG4gICAgY2FuSGFuZGxlKF91cmwpIHtcbiAgICAgICAgLy8gR2VuZXJpYyBzY3JhcGVyIGFsd2F5cyByZXR1cm5zIHRydWUgYXMgZmFsbGJhY2tcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3RpbmcoKSB7XG4gICAgICAgIC8vIFRyeSB0byBleHRyYWN0IGpvYiBpbmZvcm1hdGlvbiB1c2luZyBjb21tb24gcGF0dGVybnNcbiAgICAgICAgLy8gQ2hlY2sgZm9yIHN0cnVjdHVyZWQgZGF0YSBmaXJzdFxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIGlmIChzdHJ1Y3R1cmVkRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cnVjdHVyZWREYXRhO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBjb21tb24gc2VsZWN0b3JzXG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5maW5kVGl0bGUoKTtcbiAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZmluZENvbXBhbnkoKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmZpbmREZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIEdlbmVyaWMgc2NyYXBlcjogQ291bGQgbm90IGZpbmQgcmVxdWlyZWQgZmllbGRzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmZpbmRMb2NhdGlvbigpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb21wYW55OiBjb21wYW55IHx8IFwiVW5rbm93biBDb21wYW55XCIsXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnkoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5kZXRlY3RKb2JUeXBlKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHJlbW90ZTogdGhpcy5kZXRlY3RSZW1vdGUobG9jYXRpb24gfHwgXCJcIikgfHwgdGhpcy5kZXRlY3RSZW1vdGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5kZXRlY3RTb3VyY2UoKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgLy8gR2VuZXJpYyBzY3JhcGluZyBvZiBqb2IgbGlzdHMgaXMgdW5yZWxpYWJsZVxuICAgICAgICAvLyBSZXR1cm4gZW1wdHkgYXJyYXkgZm9yIHVua25vd24gc2l0ZXNcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBleHRyYWN0U3RydWN0dXJlZERhdGEoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBMb29rIGZvciBKU09OLUxEIGpvYiBwb3N0aW5nIHNjaGVtYVxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiXScpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBzY3JpcHQgb2Ygc2NyaXB0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHNjcmlwdC50ZXh0Q29udGVudCB8fCBcIlwiKTtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgc2luZ2xlIGpvYiBwb3N0aW5nXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbXCJAdHlwZVwiXSA9PT0gXCJKb2JQb3N0aW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VKb2JQb3N0aW5nU2NoZW1hKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgYXJyYXkgb2YgaXRlbXNcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqb2JQb3N0aW5nID0gZGF0YS5maW5kKChpdGVtKSA9PiBpdGVtW1wiQHR5cGVcIl0gPT09IFwiSm9iUG9zdGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYlBvc3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSm9iUG9zdGluZ1NjaGVtYShqb2JQb3N0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgQGdyYXBoXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbXCJAZ3JhcGhcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgam9iUG9zdGluZyA9IGRhdGFbXCJAZ3JhcGhcIl0uZmluZCgoaXRlbSkgPT4gaXRlbVtcIkB0eXBlXCJdID09PSBcIkpvYlBvc3RpbmdcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqb2JQb3N0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUpvYlBvc3RpbmdTY2hlbWEoam9iUG9zdGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIENvdWxkIG5vdCBwYXJzZSBzdHJ1Y3R1cmVkIGRhdGE6XCIsIGVycik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHBhcnNlSm9iUG9zdGluZ1NjaGVtYShkYXRhKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZGF0YS50aXRsZSB8fCBcIlwiO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gZGF0YS5oaXJpbmdPcmdhbml6YXRpb24/Lm5hbWUgfHwgXCJcIjtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBkYXRhLmRlc2NyaXB0aW9uIHx8IFwiXCI7XG4gICAgICAgIC8vIEV4dHJhY3QgbG9jYXRpb25cbiAgICAgICAgbGV0IGxvY2F0aW9uO1xuICAgICAgICBjb25zdCBqb2JMb2NhdGlvbiA9IGRhdGEuam9iTG9jYXRpb247XG4gICAgICAgIGlmIChqb2JMb2NhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgYWRkcmVzcyA9IGpvYkxvY2F0aW9uLmFkZHJlc3M7XG4gICAgICAgICAgICBpZiAoYWRkcmVzcykge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gW1xuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzLmFkZHJlc3NMb2NhbGl0eSxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzcy5hZGRyZXNzUmVnaW9uLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzLmFkZHJlc3NDb3VudHJ5LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEV4dHJhY3Qgc2FsYXJ5XG4gICAgICAgIGxldCBzYWxhcnk7XG4gICAgICAgIGNvbnN0IGJhc2VTYWxhcnkgPSBkYXRhLmJhc2VTYWxhcnk7XG4gICAgICAgIGlmIChiYXNlU2FsYXJ5KSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGJhc2VTYWxhcnkudmFsdWU7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW5jeSA9IGJhc2VTYWxhcnkuY3VycmVuY3kgfHwgXCJVU0RcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBtaW4gPSB2YWx1ZS5taW5WYWx1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXggPSB2YWx1ZS5tYXhWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAobWluICYmIG1heCkge1xuICAgICAgICAgICAgICAgICAgICBzYWxhcnkgPSBgJHtjdXJyZW5jeX0gJHttaW4udG9Mb2NhbGVTdHJpbmcoKX0gLSAke21heC50b0xvY2FsZVN0cmluZygpfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbGFyeSA9IGAke2N1cnJlbmN5fSAke3ZhbHVlLnRvTG9jYWxlU3RyaW5nKCl9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuY2xlYW5EZXNjcmlwdGlvbihkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5LFxuICAgICAgICAgICAgdHlwZTogdGhpcy5wYXJzZUVtcGxveW1lbnRUeXBlKGRhdGEuZW1wbG95bWVudFR5cGUpLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLmRldGVjdFNvdXJjZSgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IGRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcGFyc2VFbXBsb3ltZW50VHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSlcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGxvd2VyID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJmdWxsXCIpKVxuICAgICAgICAgICAgcmV0dXJuIFwiZnVsbC10aW1lXCI7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcInBhcnRcIikpXG4gICAgICAgICAgICByZXR1cm4gXCJwYXJ0LXRpbWVcIjtcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwiY29udHJhY3RcIikgfHwgbG93ZXIuaW5jbHVkZXMoXCJ0ZW1wb3JhcnlcIikpXG4gICAgICAgICAgICByZXR1cm4gXCJjb250cmFjdFwiO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJpbnRlcm5cIikpXG4gICAgICAgICAgICByZXR1cm4gXCJpbnRlcm5zaGlwXCI7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGZpbmRUaXRsZSgpIHtcbiAgICAgICAgLy8gQ29tbW9uIHRpdGxlIHNlbGVjdG9yc1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnaDFbY2xhc3MqPVwidGl0bGVcIl0nLFxuICAgICAgICAgICAgJ2gxW2NsYXNzKj1cImpvYlwiXScsXG4gICAgICAgICAgICBcIi5qb2ItdGl0bGVcIixcbiAgICAgICAgICAgIFwiLnBvc3RpbmctdGl0bGVcIixcbiAgICAgICAgICAgICdbY2xhc3MqPVwiam9iLXRpdGxlXCJdJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwicG9zdGluZy10aXRsZVwiXScsXG4gICAgICAgICAgICBcImgxXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAzICYmIHRleHQubGVuZ3RoIDwgMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBjb21tb24gbm9uLXRpdGxlIGNvbnRlbnRcbiAgICAgICAgICAgICAgICBpZiAoIXRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcInNpZ24gaW5cIikgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcImxvZyBpblwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IGRvY3VtZW50IHRpdGxlXG4gICAgICAgIGNvbnN0IGRvY1RpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgICAgIGlmIChkb2NUaXRsZSAmJiBkb2NUaXRsZS5sZW5ndGggPiA1KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgY29tbW9uIHN1ZmZpeGVzXG4gICAgICAgICAgICBjb25zdCBjbGVhbmVkID0gZG9jVGl0bGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKlstfF1cXHMqLiskLywgXCJcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKmF0XFxzKy4rJC9pLCBcIlwiKVxuICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICBpZiAoY2xlYW5lZC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZpbmRDb21wYW55KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnW2NsYXNzKj1cImNvbXBhbnktbmFtZVwiXScsXG4gICAgICAgICAgICAnW2NsYXNzKj1cImVtcGxveWVyXCJdJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwib3JnYW5pemF0aW9uXCJdJyxcbiAgICAgICAgICAgIFwiLmNvbXBhbnlcIixcbiAgICAgICAgICAgIFwiLmVtcGxveWVyXCIsXG4gICAgICAgICAgICAnYVtocmVmKj1cImNvbXBhbnlcIl0nLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMSAmJiB0ZXh0Lmxlbmd0aCA8IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBtZXRhIHRhZ3NcbiAgICAgICAgY29uc3Qgb2dTaXRlTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbcHJvcGVydHk9XCJvZzpzaXRlX25hbWVcIl0nKTtcbiAgICAgICAgaWYgKG9nU2l0ZU5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBvZ1NpdGVOYW1lLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIik7XG4gICAgICAgICAgICBpZiAoY29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZmluZERlc2NyaXB0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5qb2ItZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgIFwiLnBvc3RpbmctZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgICdbY2xhc3MqPVwiam9iLWRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwicG9zdGluZy1kZXNjcmlwdGlvblwiXScsXG4gICAgICAgICAgICAnW2NsYXNzKj1cImRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgICAgIFwiYXJ0aWNsZVwiLFxuICAgICAgICAgICAgXCIuY29udGVudFwiLFxuICAgICAgICAgICAgXCJtYWluXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sID0gdGhpcy5leHRyYWN0SHRtbENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGh0bWwgJiYgaHRtbC5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKGh0bWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kTG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdbY2xhc3MqPVwibG9jYXRpb25cIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJhZGRyZXNzXCJdJyxcbiAgICAgICAgICAgIFwiLmxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi5qb2ItbG9jYXRpb25cIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDIgJiYgdGV4dC5sZW5ndGggPCAxMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGV0ZWN0U291cmNlKCkge1xuICAgICAgICBjb25zdCBob3N0bmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAvLyBSZW1vdmUgY29tbW9uIHByZWZpeGVzXG4gICAgICAgIGNvbnN0IGNsZWFuZWQgPSBob3N0bmFtZVxuICAgICAgICAgICAgLnJlcGxhY2UoL153d3dcXC4vLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15qb2JzXFwuLywgXCJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eY2FyZWVyc1xcLi8sIFwiXCIpO1xuICAgICAgICAvLyBFeHRyYWN0IG1haW4gZG9tYWluXG4gICAgICAgIGNvbnN0IHBhcnRzID0gY2xlYW5lZC5zcGxpdChcIi5cIik7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDJdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGVhbmVkO1xuICAgIH1cbn1cbiIsIi8vIFNjcmFwZXIgcmVnaXN0cnkgLSBtYXBzIFVSTHMgdG8gYXBwcm9wcmlhdGUgc2NyYXBlcnNcbmltcG9ydCB7IExpbmtlZEluU2NyYXBlciB9IGZyb20gXCIuL2xpbmtlZGluLXNjcmFwZXJcIjtcbmltcG9ydCB7IFdhdGVybG9vV29ya3NTY3JhcGVyIH0gZnJvbSBcIi4vd2F0ZXJsb28td29ya3Mtc2NyYXBlclwiO1xuaW1wb3J0IHsgSW5kZWVkU2NyYXBlciB9IGZyb20gXCIuL2luZGVlZC1zY3JhcGVyXCI7XG5pbXBvcnQgeyBHcmVlbmhvdXNlU2NyYXBlciB9IGZyb20gXCIuL2dyZWVuaG91c2Utc2NyYXBlclwiO1xuaW1wb3J0IHsgTGV2ZXJTY3JhcGVyIH0gZnJvbSBcIi4vbGV2ZXItc2NyYXBlclwiO1xuaW1wb3J0IHsgR2VuZXJpY1NjcmFwZXIgfSBmcm9tIFwiLi9nZW5lcmljLXNjcmFwZXJcIjtcbi8vIEluaXRpYWxpemUgYWxsIHNjcmFwZXJzXG5jb25zdCBzY3JhcGVycyA9IFtcbiAgICBuZXcgTGlua2VkSW5TY3JhcGVyKCksXG4gICAgbmV3IFdhdGVybG9vV29ya3NTY3JhcGVyKCksXG4gICAgbmV3IEluZGVlZFNjcmFwZXIoKSxcbiAgICBuZXcgR3JlZW5ob3VzZVNjcmFwZXIoKSxcbiAgICBuZXcgTGV2ZXJTY3JhcGVyKCksXG5dO1xuY29uc3QgZ2VuZXJpY1NjcmFwZXIgPSBuZXcgR2VuZXJpY1NjcmFwZXIoKTtcbi8qKlxuICogR2V0IHRoZSBhcHByb3ByaWF0ZSBzY3JhcGVyIGZvciBhIFVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2NyYXBlckZvclVybCh1cmwpIHtcbiAgICBjb25zdCBzY3JhcGVyID0gc2NyYXBlcnMuZmluZCgocykgPT4gcy5jYW5IYW5kbGUodXJsKSk7XG4gICAgcmV0dXJuIHNjcmFwZXIgfHwgZ2VuZXJpY1NjcmFwZXI7XG59XG4vKipcbiAqIENoZWNrIGlmIHdlIGhhdmUgYSBzcGVjaWFsaXplZCBzY3JhcGVyIGZvciB0aGlzIFVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzU3BlY2lhbGl6ZWRTY3JhcGVyKHVybCkge1xuICAgIHJldHVybiBzY3JhcGVycy5zb21lKChzKSA9PiBzLmNhbkhhbmRsZSh1cmwpKTtcbn1cbi8qKlxuICogR2V0IGFsbCBhdmFpbGFibGUgc2NyYXBlciBzb3VyY2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmFpbGFibGVTb3VyY2VzKCkge1xuICAgIHJldHVybiBzY3JhcGVycy5tYXAoKHMpID0+IHMuc291cmNlKTtcbn1cbiIsIi8vIE9yY2hlc3RyYXRvciBmb3IgYnVsayBXYXRlcmxvb1dvcmtzIHNjcmFwaW5nLiBXYWxrcyB0aGUgdmlzaWJsZSBwb3N0aW5nc1xuLy8gdGFibGUsIG9wZW5zIGVhY2ggcm93J3MgZGV0YWlsIHBhbmVsLCBydW5zIHRoZSBzaW5nbGUtcG9zdGluZyBzY3JhcGVyLCBhbmRcbi8vIHlpZWxkcyB0aGUgcmVzdWx0cy4gVHdvIG1vZGVzOlxuLy9cbi8vICAgc2NyYXBlQWxsVmlzaWJsZSgpICAg4oCUIGN1cnJlbnQgcGFnZSBvbmx5XG4vLyAgIHNjcmFwZUFsbFBhZ2luYXRlZCgpIOKAlCBjdXJyZW50IHBhZ2UsIHRoZW4gY2xpY2tzIFwiTmV4dCBwYWdlXCIgYW5kIHJlcGVhdHNcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB1bnRpbCB0aGVyZSBpcyBubyBuZXh0IHBhZ2UgKG9yIHRoZSBoYXJkIGNhcCBoaXRzKS5cbi8vXG4vLyBMaXZlcyBpbiB0aGUgY29udGVudCBzY3JpcHQuIFBhZ2luYXRpb24gKyByb3cgY2xpY2tzIHJlbHkgb24gc2VsZWN0b3JzXG4vLyBvYnNlcnZlZCBvbiB0aGUgbGl2ZSBtb2Rlcm4gV1cgVUkgaW4gMjAyNi0wNS4gSWYgV1cgcmVkZXNpZ25zIGFnYWluLCB0aGVcbi8vIG9yY2hlc3RyYXRvciB3aWxsIHJldHVybiBbXSBncmFjZWZ1bGx5IChubyBleGNlcHRpb25zIHRocm93biB0byB0aGUgY2FsbGVyKS5cbmltcG9ydCB7IFdhdGVybG9vV29ya3NTY3JhcGVyIH0gZnJvbSBcIi4vd2F0ZXJsb28td29ya3Mtc2NyYXBlclwiO1xuY29uc3QgREVGQVVMVF9USFJPVFRMRV9NUyA9IDUwMDtcbmNvbnN0IFJPV19TRUxFQ1RPUiA9IFwidGFibGUuZGF0YS12aWV3ZXItdGFibGUgdGJvZHkgdHIudGFibGVfX3Jvdy0tYm9keVwiO1xuY29uc3QgUk9XX1RJVExFX0xJTktfU0VMRUNUT1IgPSBcInRkIGFbaHJlZj0namF2YXNjcmlwdDp2b2lkKDApJ11cIjtcbmNvbnN0IFBPU1RJTkdfUEFORUxfU0VMRUNUT1IgPSBcIi5kYXNoYm9hcmQtaGVhZGVyX19wb3N0aW5nLXRpdGxlXCI7XG5jb25zdCBORVhUX1BBR0VfU0VMRUNUT1IgPSAnYS5wYWdpbmF0aW9uX19saW5rW2FyaWEtbGFiZWw9XCJHbyB0byBuZXh0IHBhZ2VcIl0nO1xuY29uc3Qgc2xlZXAgPSAobXMpID0+IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIG1zKSk7XG5mdW5jdGlvbiBpc0hpZGRlbihlbCkge1xuICAgIGlmICghZWwpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJkaXNhYmxlZFwiKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3IocHJlZGljYXRlLCB0aW1lb3V0TXMsIGludGVydmFsTXMgPSAxMDApIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgd2hpbGUgKERhdGUubm93KCkgLSBzdGFydCA8IHRpbWVvdXRNcykge1xuICAgICAgICBpZiAocHJlZGljYXRlKCkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgYXdhaXQgc2xlZXAoaW50ZXJ2YWxNcyk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBjbGFzcyBXYXRlcmxvb1dvcmtzT3JjaGVzdHJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zY3JhcGVyID0gbmV3IFdhdGVybG9vV29ya3NTY3JhcGVyKCk7XG4gICAgfVxuICAgIC8qKiBTY3JhcGUgZXZlcnkgcm93IHZpc2libGUgb24gdGhlIGN1cnJlbnQgcGFnZS4gKi9cbiAgICBhc3luYyBzY3JhcGVBbGxWaXNpYmxlKG9wdHMgPSB7fSkge1xuICAgICAgICBjb25zdCB7IGpvYnMgfSA9IGF3YWl0IHRoaXMuc2NyYXBlQ3VycmVudFBhZ2Uoe1xuICAgICAgICAgICAgc2NyYXBlZFNvRmFyOiAwLFxuICAgICAgICAgICAgcGFnZUluZGV4OiAxLFxuICAgICAgICAgICAgb3B0cyxcbiAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gam9icztcbiAgICB9XG4gICAgLyoqIFdhbGsgZXZlcnkgcm93IGFjcm9zcyBldmVyeSBwYWdlIChjYXBwZWQgYnkgbWF4Sm9icyAvIG1heFBhZ2VzKS4gKi9cbiAgICBhc3luYyBzY3JhcGVBbGxQYWdpbmF0ZWQob3B0cyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IG1heEpvYnMgPSBvcHRzLm1heEpvYnMgPz8gMjAwO1xuICAgICAgICBjb25zdCBtYXhQYWdlcyA9IG9wdHMubWF4UGFnZXMgPz8gNTA7XG4gICAgICAgIGNvbnN0IHRocm90dGxlID0gb3B0cy50aHJvdHRsZU1zID8/IERFRkFVTFRfVEhST1RUTEVfTVM7XG4gICAgICAgIGNvbnN0IGFsbEpvYnMgPSBbXTtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gW107XG4gICAgICAgIGxldCBwYWdlSW5kZXggPSAxO1xuICAgICAgICB3aGlsZSAocGFnZUluZGV4IDw9IG1heFBhZ2VzICYmIGFsbEpvYnMubGVuZ3RoIDwgbWF4Sm9icykge1xuICAgICAgICAgICAgY29uc3QgeyBqb2JzLCBzdG9wUmVhc29uIH0gPSBhd2FpdCB0aGlzLnNjcmFwZUN1cnJlbnRQYWdlKHtcbiAgICAgICAgICAgICAgICBzY3JhcGVkU29GYXI6IGFsbEpvYnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHBhZ2VJbmRleCxcbiAgICAgICAgICAgICAgICBvcHRzOiB7IC4uLm9wdHMsIG1heEpvYnMgfSxcbiAgICAgICAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFsbEpvYnMucHVzaCguLi5qb2JzKTtcbiAgICAgICAgICAgIGlmIChzdG9wUmVhc29uID09PSBcImNhcC1oaXRcIilcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIFRyeSB0byBnbyB0byB0aGUgbmV4dCBwYWdlXG4gICAgICAgICAgICBjb25zdCBhZHZhbmNlZCA9IGF3YWl0IHRoaXMuZ29Ub05leHRQYWdlKHRocm90dGxlKTtcbiAgICAgICAgICAgIGlmICghYWR2YW5jZWQpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBwYWdlSW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBvcHRzLm9uUHJvZ3Jlc3M/Lih7XG4gICAgICAgICAgICBzY3JhcGVkQ291bnQ6IGFsbEpvYnMubGVuZ3RoLFxuICAgICAgICAgICAgYXR0ZW1wdGVkQ291bnQ6IGFsbEpvYnMubGVuZ3RoLFxuICAgICAgICAgICAgY3VycmVudFBhZ2U6IHBhZ2VJbmRleCxcbiAgICAgICAgICAgIHRvdGFsUm93c09uUGFnZTogdGhpcy5nZXRSb3dzKCkubGVuZ3RoLFxuICAgICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhbGxKb2JzO1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVDdXJyZW50UGFnZShhcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgc2NyYXBlZFNvRmFyLCBwYWdlSW5kZXgsIG9wdHMsIGVycm9ycyB9ID0gYXJncztcbiAgICAgICAgY29uc3QgbWF4Sm9icyA9IG9wdHMubWF4Sm9icyA/PyAyMDA7XG4gICAgICAgIGNvbnN0IHRocm90dGxlID0gb3B0cy50aHJvdHRsZU1zID8/IERFRkFVTFRfVEhST1RUTEVfTVM7XG4gICAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLmdldFJvd3MoKTtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChzY3JhcGVkU29GYXIgKyBqb2JzLmxlbmd0aCA+PSBtYXhKb2JzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgam9icywgc3RvcFJlYXNvbjogXCJjYXAtaGl0XCIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlLWZldGNoIHRoZSByb3cgZWFjaCBpdGVyYXRpb24g4oCUIHRoZSBET00gbWF5IHJlYnVpbGQgYWZ0ZXIgcGFuZWwgY2xvc2UuXG4gICAgICAgICAgICBjb25zdCBsaXZlUm93cyA9IHRoaXMuZ2V0Um93cygpO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gbGl2ZVJvd3NbaV07XG4gICAgICAgICAgICBpZiAoIXJvdylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlTGluayA9IHJvdy5xdWVyeVNlbGVjdG9yKFJPV19USVRMRV9MSU5LX1NFTEVDVE9SKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVGl0bGUgPSB0aXRsZUxpbms/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICBpZiAoIXRpdGxlTGluaylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIC8vIENhcHR1cmUgdGhlIHBhbmVsJ3MgY3VycmVudCB0aXRsZSBzbyB3ZSBjYW4gZGV0ZWN0IHdoZW4gdGhlIG5ld1xuICAgICAgICAgICAgLy8gcG9zdGluZydzIGNvbnRlbnQgaGFzIGFjdHVhbGx5IHJlbmRlcmVkICh0aGUgcGFuZWwgbWF5IGFscmVhZHkgYmVcbiAgICAgICAgICAgIC8vIHZpc2libGUgZnJvbSBhIHByZXZpb3VzIHJvdykuXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c1BhbmVsVGl0bGUgPSBkb2N1bWVudFxuICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFBPU1RJTkdfUEFORUxfU0VMRUNUT1IgKyBcIiBoMlwiKVxuICAgICAgICAgICAgICAgID8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgIHRpdGxlTGluay5jbGljaygpO1xuICAgICAgICAgICAgY29uc3Qgb3BlbmVkID0gYXdhaXQgd2FpdEZvcigoKSA9PiAhIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoUE9TVElOR19QQU5FTF9TRUxFQ1RPUiksIDUwMDApO1xuICAgICAgICAgICAgaWYgKCFvcGVuZWQpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChgcm93ICR7aX0gKCR7ZXhwZWN0ZWRUaXRsZX0pOiBwYW5lbCBkaWQgbm90IG9wZW5gKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFdhaXQgZm9yIHRoZSBwYW5lbCdzIGgyIHRvIHVwZGF0ZSAob3IgYXBwZWFyIGZvciB0aGUgZmlyc3QgdGltZSkgQU5EXG4gICAgICAgICAgICAvLyBmb3IgcG9zdGluZy1zcGVjaWZpYyBmaWVsZCByb3dzIHRvIGJlIHByZXNlbnQuIFdlIGNoZWNrIGZvciBhXG4gICAgICAgICAgICAvLyByZWNvZ25pc2FibGUgbGFiZWwgbGlrZSBcIkpvYiBUaXRsZVwiIOKAlCBzZWFyY2ggZmlsdGVycyBzaGFyZSB0aGUgc2FtZVxuICAgICAgICAgICAgLy8gLnRhZ19fa2V5LXZhbHVlLWxpc3QgY2xhc3Mgc28gYSBub24temVybyBjb3VudCBpcyBub3QgYSByZWxpYWJsZVxuICAgICAgICAgICAgLy8gc2lnbmFsIHRoYXQgdGhlIHBvc3RpbmcgYm9keSBoYXMgcmVuZGVyZWQuXG4gICAgICAgICAgICBjb25zdCBmdWxseVJlbmRlcmVkID0gYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaDIgPSBkb2N1bWVudFxuICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcihQT1NUSU5HX1BBTkVMX1NFTEVDVE9SICsgXCIgaDJcIilcbiAgICAgICAgICAgICAgICAgICAgPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGlmICghaDIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNQYW5lbFRpdGxlICYmIGgyID09PSBwcmV2aW91c1BhbmVsVGl0bGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGFnX19rZXktdmFsdWUtbGlzdC5qcy0tcXVlc3Rpb24tLWNvbnRhaW5lciAubGFiZWxcIikpLm1hcCgoZWwpID0+IChlbC50ZXh0Q29udGVudCB8fCBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVscy5zb21lKChsKSA9PiBsLnN0YXJ0c1dpdGgoXCJqb2IgdGl0bGVcIikgfHwgbC5zdGFydHNXaXRoKFwib3JnYW5pemF0aW9uXCIpKTtcbiAgICAgICAgICAgIH0sIDgwMDApO1xuICAgICAgICAgICAgaWYgKCFmdWxseVJlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYHJvdyAke2l9ICgke2V4cGVjdGVkVGl0bGV9KTogcGFuZWwgbmV2ZXIgZnVsbHkgcmVuZGVyZWRgKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHNsZWVwKHRocm90dGxlKTtcbiAgICAgICAgICAgIGxldCBqb2IgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBqb2IgPSBhd2FpdCB0aGlzLnNjcmFwZXIuc2NyYXBlSm9iTGlzdGluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGByb3cgJHtpfSAoJHtleHBlY3RlZFRpdGxlfSk6ICR7U3RyaW5nKGVycikuc2xpY2UoMCwgMjAwKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChqb2IpXG4gICAgICAgICAgICAgICAgam9icy5wdXNoKGpvYik7XG4gICAgICAgICAgICBvcHRzLm9uUHJvZ3Jlc3M/Lih7XG4gICAgICAgICAgICAgICAgc2NyYXBlZENvdW50OiBzY3JhcGVkU29GYXIgKyBqb2JzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBhdHRlbXB0ZWRDb3VudDogc2NyYXBlZFNvRmFyICsgaSArIDEsXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IHBhZ2VJbmRleCxcbiAgICAgICAgICAgICAgICB0b3RhbFJvd3NPblBhZ2U6IGxpdmVSb3dzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBsYXN0VGl0bGU6IGpvYj8udGl0bGUgfHwgZXhwZWN0ZWRUaXRsZSxcbiAgICAgICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZXhwbGljaXRseSBjbG9zZSB0aGUgcGFuZWwg4oCUIGNsaWNraW5nIHRoZSBuZXh0IHJvdyByZXBsYWNlc1xuICAgICAgICAgICAgLy8gaXRzIGNvbnRlbnQuIFdlIG9ubHkgc3RvcCBoZXJlIGlmIHRoaXMgd2FzIHRoZSBsYXN0IHJvdyBvbiB0aGUgcGFnZS5cbiAgICAgICAgICAgIGF3YWl0IHNsZWVwKHRocm90dGxlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBqb2JzIH07XG4gICAgfVxuICAgIGFzeW5jIGdvVG9OZXh0UGFnZSh0aHJvdHRsZU1zKSB7XG4gICAgICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKE5FWFRfUEFHRV9TRUxFQ1RPUik7XG4gICAgICAgIGlmICghbmV4dEJ0biB8fCBpc0hpZGRlbihuZXh0QnRuKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gQ2FwdHVyZSB0aGUgZmlyc3Qgcm93J3Mgc2lnbmF0dXJlIHRvIGRldGVjdCB3aGVuIHRoZSBwYWdlIGhhcyBjaGFuZ2VkLlxuICAgICAgICBjb25zdCBiZWZvcmVTaWcgPSB0aGlzLmZpcnN0Um93U2lnbmF0dXJlKCk7XG4gICAgICAgIG5leHRCdG4uY2xpY2soKTtcbiAgICAgICAgY29uc3QgY2hhbmdlZCA9IGF3YWl0IHdhaXRGb3IoKCkgPT4gdGhpcy5maXJzdFJvd1NpZ25hdHVyZSgpICE9PSBiZWZvcmVTaWcgJiYgdGhpcy5nZXRSb3dzKCkubGVuZ3RoID4gMCwgODAwMCk7XG4gICAgICAgIGlmICghY2hhbmdlZClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgYXdhaXQgc2xlZXAodGhyb3R0bGVNcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBnZXRSb3dzKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFJPV19TRUxFQ1RPUikpO1xuICAgIH1cbiAgICBmaXJzdFJvd1NpZ25hdHVyZSgpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3dzKClbMF07XG4gICAgICAgIHJldHVybiByb3c/LnRleHRDb250ZW50Py50cmltKCkuc2xpY2UoMCwgMTIwKSB8fCBcIlwiO1xuICAgIH1cbn1cbiIsIi8vIE1lc3NhZ2UgcGFzc2luZyB1dGlsaXRpZXMgZm9yIGV4dGVuc2lvbiBjb21tdW5pY2F0aW9uXG4vLyBUeXBlLXNhZmUgbWVzc2FnZSBjcmVhdG9yc1xuZXhwb3J0IGNvbnN0IE1lc3NhZ2VzID0ge1xuICAgIC8vIEF1dGggbWVzc2FnZXNcbiAgICBnZXRBdXRoU3RhdHVzOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9BVVRIX1NUQVRVU1wiIH0pLFxuICAgIG9wZW5BdXRoOiAoKSA9PiAoeyB0eXBlOiBcIk9QRU5fQVVUSFwiIH0pLFxuICAgIGxvZ291dDogKCkgPT4gKHsgdHlwZTogXCJMT0dPVVRcIiB9KSxcbiAgICAvLyBQcm9maWxlIG1lc3NhZ2VzXG4gICAgZ2V0UHJvZmlsZTogKCkgPT4gKHsgdHlwZTogXCJHRVRfUFJPRklMRVwiIH0pLFxuICAgIGdldFNldHRpbmdzOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9TRVRUSU5HU1wiIH0pLFxuICAgIC8vIEZvcm0gZmlsbGluZyBtZXNzYWdlc1xuICAgIGZpbGxGb3JtOiAoZmllbGRzKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkZJTExfRk9STVwiLFxuICAgICAgICBwYXlsb2FkOiBmaWVsZHMsXG4gICAgfSksXG4gICAgLy8gU2NyYXBpbmcgbWVzc2FnZXNcbiAgICBzY3JhcGVKb2I6ICgpID0+ICh7IHR5cGU6IFwiU0NSQVBFX0pPQlwiIH0pLFxuICAgIHNjcmFwZUpvYkxpc3Q6ICgpID0+ICh7IHR5cGU6IFwiU0NSQVBFX0pPQl9MSVNUXCIgfSksXG4gICAgaW1wb3J0Sm9iOiAoam9iKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIklNUE9SVF9KT0JcIixcbiAgICAgICAgcGF5bG9hZDogam9iLFxuICAgIH0pLFxuICAgIGltcG9ydEpvYnNCYXRjaDogKGpvYnMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiSU1QT1JUX0pPQlNfQkFUQ0hcIixcbiAgICAgICAgcGF5bG9hZDogam9icyxcbiAgICB9KSxcbiAgICB0cmFja0FwcGxpZWQ6IChwYXlsb2FkKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlRSQUNLX0FQUExJRURcIixcbiAgICAgICAgcGF5bG9hZCxcbiAgICB9KSxcbiAgICBvcGVuRGFzaGJvYXJkOiAoKSA9PiAoeyB0eXBlOiBcIk9QRU5fREFTSEJPQVJEXCIgfSksXG4gICAgY2FwdHVyZVZpc2libGVUYWI6ICgpID0+ICh7IHR5cGU6IFwiQ0FQVFVSRV9WSVNJQkxFX1RBQlwiIH0pLFxuICAgIHRhaWxvckZyb21QYWdlOiAoam9iLCBiYXNlUmVzdW1lSWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiVEFJTE9SX0ZST01fUEFHRVwiLFxuICAgICAgICBwYXlsb2FkOiB7IGpvYiwgYmFzZVJlc3VtZUlkIH0sXG4gICAgfSksXG4gICAgZ2VuZXJhdGVDb3ZlckxldHRlckZyb21QYWdlOiAoam9iKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkdFTkVSQVRFX0NPVkVSX0xFVFRFUl9GUk9NX1BBR0VcIixcbiAgICAgICAgcGF5bG9hZDogam9iLFxuICAgIH0pLFxuICAgIC8qKiAjMzQg4oCUIGZldGNoIHRoZSB1c2VyJ3MgcmVjZW50bHktc2F2ZWQgdGFpbG9yZWQgcmVzdW1lcyBmb3IgdGhlIHBpY2tlci4gKi9cbiAgICBsaXN0UmVzdW1lczogKCkgPT4gKHsgdHlwZTogXCJMSVNUX1JFU1VNRVNcIiB9KSxcbiAgICAvLyBMZWFybmluZyBtZXNzYWdlc1xuICAgIHNhdmVBbnN3ZXI6IChkYXRhKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlNBVkVfQU5TV0VSXCIsXG4gICAgICAgIHBheWxvYWQ6IGRhdGEsXG4gICAgfSksXG4gICAgc2VhcmNoQW5zd2VyczogKHF1ZXN0aW9uKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlNFQVJDSF9BTlNXRVJTXCIsXG4gICAgICAgIHBheWxvYWQ6IHF1ZXN0aW9uLFxuICAgIH0pLFxuICAgIGpvYkRldGVjdGVkOiAobWV0YSkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJKT0JfREVURUNURURcIixcbiAgICAgICAgcGF5bG9hZDogbWV0YSxcbiAgICB9KSxcbiAgICAvLyBXYXRlcmxvb1dvcmtzLXNwZWNpZmljIGJ1bGsgc2NyYXBpbmcgKGRyaXZlbiBmcm9tIHBvcHVwLCBleGVjdXRlZCBpbiBjb250ZW50XG4gICAgLy8gc2NyaXB0IGJ5IHdhdGVybG9vLXdvcmtzLW9yY2hlc3RyYXRvci50cykuXG4gICAgd3dTY3JhcGVBbGxWaXNpYmxlOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIldXX1NDUkFQRV9BTExfVklTSUJMRVwiLFxuICAgIH0pLFxuICAgIHd3U2NyYXBlQWxsUGFnaW5hdGVkOiAob3B0cykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJXV19TQ1JBUEVfQUxMX1BBR0lOQVRFRFwiLFxuICAgICAgICBwYXlsb2FkOiBvcHRzID8/IHt9LFxuICAgIH0pLFxuICAgIHd3R2V0UGFnZVN0YXRlOiAoKSA9PiAoeyB0eXBlOiBcIldXX0dFVF9QQUdFX1NUQVRFXCIgfSksXG59O1xuLy8gU2VuZCBtZXNzYWdlIHRvIGJhY2tncm91bmQgc2NyaXB0XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UgfHwgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gcmVzcG9uc2UgcmVjZWl2ZWRcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBTZW5kIG1lc3NhZ2UgdG8gY29udGVudCBzY3JpcHQgaW4gc3BlY2lmaWMgdGFiXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFRvVGFiKHRhYklkLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBtZXNzYWdlLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UgfHwgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gcmVzcG9uc2UgcmVjZWl2ZWRcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBTZW5kIG1lc3NhZ2UgdG8gYWxsIGNvbnRlbnQgc2NyaXB0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gICAgZm9yIChjb25zdCB0YWIgb2YgdGFicykge1xuICAgICAgICBpZiAodGFiLmlkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgLy8gVGFiIG1pZ2h0IG5vdCBoYXZlIGNvbnRlbnQgc2NyaXB0IGxvYWRlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNob3dBcHBsaWVkVG9hc3QoY29tcGFueSwgb25DbGljaykge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29sdW1idXMtdG9hc3QtYXBwbGllZFwiKT8ucmVtb3ZlKCk7XG4gICAgY29uc3QgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRvYXN0LmNsYXNzTmFtZSA9IFwiY29sdW1idXMtdG9hc3QgY29sdW1idXMtdG9hc3QtYXBwbGllZFwiO1xuICAgIHRvYXN0LnRhYkluZGV4ID0gMDtcbiAgICB0b2FzdC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJPcGVuIFNsb3RoaW5nIGRhc2hib2FyZFwiKTtcbiAgICB0b2FzdC50ZXh0Q29udGVudCA9IGDinJMgVHJhY2tlZCBpbiBTbG90aGluZyAtIGFwcGxpZWQgdG8gJHtjb21wYW55fWA7XG4gICAgY29uc3QgZGlzbWlzcyA9ICgpID0+IHRvYXN0LnJlbW92ZSgpO1xuICAgIGNvbnN0IHRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGRpc21pc3MsIDYwMDApO1xuICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgb25DbGljaygpO1xuICAgICAgICBkaXNtaXNzKCk7XG4gICAgfSk7XG4gICAgdG9hc3QuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiRW50ZXJcIiB8fCBldmVudC5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdG9hc3QuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBkaXNtaXNzKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvYXN0KTtcbn1cbiIsImltcG9ydCB7IHNlbmRNZXNzYWdlLCBNZXNzYWdlcyB9IGZyb20gXCJAL3NoYXJlZC9tZXNzYWdlc1wiO1xuY29uc3QgTUFYX0hFQURMSU5FX0xFTkdUSCA9IDIwMDtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZFBhZ2VTbmFwc2hvdCh7IGNhcHR1cmVTY3JlZW5zaG90LCB9KSB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC50aXRsZS50cmltKCk7XG4gICAgY29uc3QgaGVhZGxpbmUgPSBub3JtYWxpemVUZXh0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKT8udGV4dENvbnRlbnQgfHwgdGl0bGUpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGhlYWRsaW5lOiBoZWFkbGluZSA/IHRydW5jYXRlKGhlYWRsaW5lLCBNQVhfSEVBRExJTkVfTEVOR1RIKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgc3VibWl0dGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgdGh1bWJuYWlsRGF0YVVybDogY2FwdHVyZVNjcmVlbnNob3RcbiAgICAgICAgICAgID8gYXdhaXQgY2FwdHVyZVZpc2libGVUYWJTYWZlbHkoKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRleHQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpO1xufVxuZnVuY3Rpb24gdHJ1bmNhdGUodmFsdWUsIG1heExlbmd0aCkge1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPD0gbWF4TGVuZ3RoKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlLnNsaWNlKDAsIG1heExlbmd0aCAtIDEpLnRyaW1FbmQoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNhcHR1cmVWaXNpYmxlVGFiU2FmZWx5KCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuY2FwdHVyZVZpc2libGVUYWIoKSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdWNjZXNzID8gcmVzcG9uc2UuZGF0YT8uZGF0YVVybCA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGJ1aWxkUGFnZVNuYXBzaG90IH0gZnJvbSBcIi4vcGFnZS1zbmFwc2hvdFwiO1xuY29uc3QgQVBQTElDQVRJT05fRklFTERfVFlQRVMgPSBuZXcgU2V0KFtcbiAgICBcImZpcnN0TmFtZVwiLFxuICAgIFwibGFzdE5hbWVcIixcbiAgICBcImZ1bGxOYW1lXCIsXG4gICAgXCJlbWFpbFwiLFxuICAgIFwicGhvbmVcIixcbiAgICBcImxpbmtlZGluXCIsXG4gICAgXCJnaXRodWJcIixcbiAgICBcIndlYnNpdGVcIixcbiAgICBcInBvcnRmb2xpb1wiLFxuICAgIFwicmVzdW1lXCIsXG4gICAgXCJjb3ZlckxldHRlclwiLFxuICAgIFwid29ya0F1dGhvcml6YXRpb25cIixcbiAgICBcInNwb25zb3JzaGlwXCIsXG4gICAgXCJjdXN0b21RdWVzdGlvblwiLFxuXSk7XG5jb25zdCBCTE9DS0VEX0ZPUk1fS0VZV09SRFMgPSBbXG4gICAgXCJsb2dpblwiLFxuICAgIFwibG9nIGluXCIsXG4gICAgXCJzaWduaW5cIixcbiAgICBcInNpZ24gaW5cIixcbiAgICBcInNpZ251cFwiLFxuICAgIFwic2lnbiB1cFwiLFxuICAgIFwicmVnaXN0ZXJcIixcbiAgICBcInNlYXJjaFwiLFxuICAgIFwic3Vic2NyaWJlXCIsXG4gICAgXCJuZXdzbGV0dGVyXCIsXG5dO1xuZXhwb3J0IGNsYXNzIFN1Ym1pdFdhdGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVkRm9ybXMgPSBuZXcgV2Vha1NldCgpO1xuICAgICAgICB0aGlzLnBlbmRpbmdGb3JtcyA9IG5ldyBXZWFrU2V0KCk7XG4gICAgICAgIHRoaXMudHJhY2tlZFVybHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoIShmb3JtIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2b2lkIHRoaXMudHJhY2tGb3JtU3VibWl0KGZvcm0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuaGFuZGxlU3VibWl0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5hdHRhY2hlZCA9IHRydWU7XG4gICAgfVxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmF0dGFjaGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuaGFuZGxlU3VibWl0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBhc3luYyB0cmFja0Zvcm1TdWJtaXQoZm9ybSkge1xuICAgICAgICBpZiAodGhpcy5oYW5kbGVkRm9ybXMuaGFzKGZvcm0pIHx8XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdGb3Jtcy5oYXMoZm9ybSkgfHxcbiAgICAgICAgICAgIHRoaXMudHJhY2tlZFVybHMuaGFzKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVuZGluZ0Zvcm1zLmFkZChmb3JtKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5vcHRpb25zLmdldFNldHRpbmdzKCk7XG4gICAgICAgICAgICBpZiAoIXNldHRpbmdzLmF1dG9UcmFja0FwcGxpY2F0aW9uc0VuYWJsZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgZGV0ZWN0ZWRGaWVsZHMgPSB0aGlzLm9wdGlvbnMuZ2V0RGV0ZWN0ZWRGaWVsZHMoZm9ybSk7XG4gICAgICAgICAgICBpZiAoaXNMaWtlbHlTZWFyY2hPckxvZ2luRm9ybShmb3JtLCB3aW5kb3cubG9jYXRpb24uaHJlZikgfHxcbiAgICAgICAgICAgICAgICAhbG9va3NMaWtlQXBwbGljYXRpb25Gb3JtKGRldGVjdGVkRmllbGRzLCBmb3JtLCB0aGlzLm9wdGlvbnMud2FzQXV0b2ZpbGxlZChmb3JtKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhhbmRsZWRGb3Jtcy5hZGQoZm9ybSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrZWRVcmxzLmFkZCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGJ1aWxkUGFnZVNuYXBzaG90KHtcbiAgICAgICAgICAgICAgICBjYXB0dXJlU2NyZWVuc2hvdDogc2V0dGluZ3MuY2FwdHVyZVNjcmVlbnNob3RFbmFibGVkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm9wdGlvbnMub25UcmFja2VkKHtcbiAgICAgICAgICAgICAgICAuLi5zbmFwc2hvdCxcbiAgICAgICAgICAgICAgICBzY3JhcGVkSm9iOiB0aGlzLm9wdGlvbnMuZ2V0U2NyYXBlZEpvYigpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdGb3Jtcy5kZWxldGUoZm9ybSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gaXNMaWtlbHlTZWFyY2hPckxvZ2luRm9ybShmb3JtLCB1cmwpIHtcbiAgICBjb25zdCB1cmxUZXh0ID0gdXJsLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKC8oXFwvfFxcYikobG9naW58c2lnbmlufHNpZ251cHxyZWdpc3RlcnxzZWFyY2gpKFxcL3xcXD98I3xcXGIpLy50ZXN0KHVybFRleHQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCB0ZXh0ID0gW1xuICAgICAgICBmb3JtLmlkLFxuICAgICAgICBmb3JtLmNsYXNzTmFtZSxcbiAgICAgICAgZm9ybS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpLFxuICAgICAgICBmb3JtLmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiksXG4gICAgICAgIGZvcm0uZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpLFxuICAgICAgICBmb3JtLnRleHRDb250ZW50LFxuICAgIF1cbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuam9pbihcIiBcIilcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKEJMT0NLRURfRk9STV9LRVlXT1JEUy5zb21lKChrZXl3b3JkKSA9PiB0ZXh0LmluY2x1ZGVzKGtleXdvcmQpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKSk7XG4gICAgcmV0dXJuIGlucHV0cy5zb21lKChpbnB1dCkgPT4ge1xuICAgICAgICBjb25zdCB0eXBlID0gaW5wdXQudHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBuYW1lID0gYCR7aW5wdXQubmFtZX0gJHtpbnB1dC5pZH0gJHtpbnB1dC5wbGFjZWhvbGRlcn1gLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiB0eXBlID09PSBcInNlYXJjaFwiIHx8IG5hbWUuaW5jbHVkZXMoXCJzZWFyY2hcIik7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbG9va3NMaWtlQXBwbGljYXRpb25Gb3JtKGRldGVjdGVkRmllbGRzLCBmb3JtLCB3YXNBdXRvZmlsbGVkID0gZmFsc2UpIHtcbiAgICBjb25zdCBoaWdoQ29uZmlkZW5jZUFwcGxpY2F0aW9uRmllbGRzID0gZGV0ZWN0ZWRGaWVsZHMuZmlsdGVyKChmaWVsZCkgPT4gZmllbGQuY29uZmlkZW5jZSA+PSAwLjMgJiYgQVBQTElDQVRJT05fRklFTERfVFlQRVMuaGFzKGZpZWxkLmZpZWxkVHlwZSkpO1xuICAgIGlmICh3YXNBdXRvZmlsbGVkICYmIGhpZ2hDb25maWRlbmNlQXBwbGljYXRpb25GaWVsZHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChoaWdoQ29uZmlkZW5jZUFwcGxpY2F0aW9uRmllbGRzLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBmb3JtVGV4dCA9IFtcbiAgICAgICAgZm9ybS5pZCxcbiAgICAgICAgZm9ybS5jbGFzc05hbWUsXG4gICAgICAgIGZvcm0uZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpLFxuICAgICAgICBmb3JtLnRleHRDb250ZW50LFxuICAgIF1cbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuam9pbihcIiBcIilcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuICh3YXNBdXRvZmlsbGVkICYmXG4gICAgICAgIGhpZ2hDb25maWRlbmNlQXBwbGljYXRpb25GaWVsZHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAvXFxiKGFwcGx5fGFwcGxpY2F0aW9ufHJlc3VtZXxjb3ZlciBsZXR0ZXJ8c3VibWl0IGFwcGxpY2F0aW9uKVxcYi8udGVzdChmb3JtVGV4dCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RDb21wYW55SGludChzY3JhcGVkSm9iLCBob3N0KSB7XG4gICAgaWYgKHNjcmFwZWRKb2I/LmNvbXBhbnkpXG4gICAgICAgIHJldHVybiBzY3JhcGVkSm9iLmNvbXBhbnk7XG4gICAgcmV0dXJuIGhvc3QucmVwbGFjZSgvXnd3d1xcLi8sIFwiXCIpO1xufVxuIiwiaW1wb3J0IHsganN4IGFzIF9qc3gsIGpzeHMgYXMgX2pzeHMgfSBmcm9tIFwicmVhY3QvanN4LXJ1bnRpbWVcIjtcbmltcG9ydCB7IHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5jb25zdCBBQ1RJT05fTEFCRUxTID0ge1xuICAgIHRhaWxvcjogXCJUYWlsb3JcIixcbiAgICBjb3ZlckxldHRlcjogXCJDb3ZlciBMZXR0ZXJcIixcbiAgICBzYXZlOiBcIlNhdmVcIixcbiAgICBhdXRvRmlsbDogXCJBdXRvLWZpbGxcIixcbn07XG5leHBvcnQgZnVuY3Rpb24gSm9iUGFnZVNpZGViYXIocHJvcHMpIHtcbiAgICBjb25zdCBbYWN0aXZlQWN0aW9uLCBzZXRBY3RpdmVBY3Rpb25dID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW25vdGljZSwgc2V0Tm90aWNlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoXCJcIik7XG4gICAgY29uc3QgW2Fuc3dlcnMsIHNldEFuc3dlcnNdID0gdXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hpbmcsIHNldFNlYXJjaGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaEVycm9yLCBzZXRTZWFyY2hFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBzY29yZVZhbHVlID0gcHJvcHMuc2NvcmU/Lm92ZXJhbGwgPz8gbnVsbDtcbiAgICBjb25zdCBzY29yZURlZ3JlZXMgPSBNYXRoLnJvdW5kKCgoc2NvcmVWYWx1ZSA/PyAwKSAvIDEwMCkgKiAzNjApO1xuICAgIGNvbnN0IGpvYk1ldGEgPSB1c2VNZW1vKCgpID0+IFtwcm9wcy5zY3JhcGVkSm9iLmNvbXBhbnksIHByb3BzLnNjcmFwZWRKb2IubG9jYXRpb25dXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgLmpvaW4oXCIgLyBcIiksIFtwcm9wcy5zY3JhcGVkSm9iLmNvbXBhbnksIHByb3BzLnNjcmFwZWRKb2IubG9jYXRpb25dKTtcbiAgICBhc3luYyBmdW5jdGlvbiBydW5BY3Rpb24oYWN0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICBzZXRBY3RpdmVBY3Rpb24oYWN0aW9uKTtcbiAgICAgICAgc2V0Tm90aWNlKG51bGwpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHNldE5vdGljZSh7XG4gICAgICAgICAgICAgICAga2luZDogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uID09PSBcImF1dG9GaWxsXCJcbiAgICAgICAgICAgICAgICAgICAgPyBcIkFwcGxpY2F0aW9uIGZpZWxkcyB1cGRhdGVkLlwiXG4gICAgICAgICAgICAgICAgICAgIDogYCR7QUNUSU9OX0xBQkVMU1thY3Rpb25dfSBjb21wbGV0ZS5gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBzZXROb3RpY2Uoe1xuICAgICAgICAgICAgICAgIGtpbmQ6IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8IGAke0FDVElPTl9MQUJFTFNbYWN0aW9uXX0gZmFpbGVkLmAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldEFjdGl2ZUFjdGlvbihudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVTZWFyY2goZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IHF1ZXJ5LnRyaW0oKTtcbiAgICAgICAgaWYgKCF0cmltbWVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBzZXRTZWFyY2hpbmcodHJ1ZSk7XG4gICAgICAgIHNldFNlYXJjaEVycm9yKG51bGwpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0QW5zd2Vycyhhd2FpdCBwcm9wcy5vblNlYXJjaEFuc3dlcnModHJpbW1lZCkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgc2V0U2VhcmNoRXJyb3IoZXJyb3IubWVzc2FnZSB8fCBcIkFuc3dlciBzZWFyY2ggZmFpbGVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gY29weUFuc3dlcihhbnN3ZXIpIHtcbiAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoYW5zd2VyLmFuc3dlcik7XG4gICAgICAgIHNldE5vdGljZSh7IGtpbmQ6IFwic3VjY2Vzc1wiLCBtZXNzYWdlOiBcIkFuc3dlciBjb3BpZWQuXCIgfSk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5pc0NvbGxhcHNlZCkge1xuICAgICAgICByZXR1cm4gKF9qc3goXCJhc2lkZVwiLCB7IGNsYXNzTmFtZTogXCJzbG90aGluZy1zaWRlYmFyXCIsIFwiYXJpYS1sYWJlbFwiOiBcIlNsb3RoaW5nIGpvYiBzaWRlYmFyXCIsIGNoaWxkcmVuOiBfanN4cyhcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJyYWlsXCIsIHR5cGU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6ICgpID0+IHByb3BzLm9uQ29sbGFwc2VDaGFuZ2UoZmFsc2UpLCBcImFyaWEtbGFiZWxcIjogXCJPcGVuIFNsb3RoaW5nIHNpZGViYXJcIiwgdGl0bGU6IFwiT3BlbiBTbG90aGluZyBzaWRlYmFyXCIsIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicmFpbC1zY29yZVwiLCBjaGlsZHJlbjogc2NvcmVWYWx1ZSA/PyBcIi0tXCIgfSksIF9qc3goXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInJhaWwtbGFiZWxcIiwgY2hpbGRyZW46IFwiU2xvdGhpbmdcIiB9KV0gfSkgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gKF9qc3goXCJhc2lkZVwiLCB7IGNsYXNzTmFtZTogXCJzbG90aGluZy1zaWRlYmFyXCIsIFwiYXJpYS1sYWJlbFwiOiBcIlNsb3RoaW5nIGpvYiBzaWRlYmFyXCIsIGNoaWxkcmVuOiBfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwYW5lbFwiLCBjaGlsZHJlbjogW19qc3hzKFwiaGVhZGVyXCIsIHsgY2xhc3NOYW1lOiBcImhlYWRlclwiLCBjaGlsZHJlbjogW19qc3hzKFwiZGl2XCIsIHsgY2hpbGRyZW46IFtfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJicmFuZFwiLCBjaGlsZHJlbjogXCJTbG90aGluZ1wiIH0pLCBfanN4KFwiaDJcIiwgeyBjbGFzc05hbWU6IFwidGl0bGVcIiwgY2hpbGRyZW46IHByb3BzLnNjcmFwZWRKb2IudGl0bGUgfSksIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImNvbXBhbnlcIiwgY2hpbGRyZW46IGpvYk1ldGEgfHwgcHJvcHMuc2NyYXBlZEpvYi5jb21wYW55IH0pXSB9KSwgX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaWNvbi1yb3dcIiwgY2hpbGRyZW46IFtfanN4KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImljb24tYnV0dG9uXCIsIHR5cGU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6ICgpID0+IHByb3BzLm9uQ29sbGFwc2VDaGFuZ2UodHJ1ZSksIFwiYXJpYS1sYWJlbFwiOiBcIkNvbGxhcHNlIFNsb3RoaW5nIHNpZGViYXJcIiwgdGl0bGU6IFwiQ29sbGFwc2VcIiwgY2hpbGRyZW46IFwiXFx1MjAzQVwiIH0pLCBfanN4KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImljb24tYnV0dG9uXCIsIHR5cGU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6ICgpID0+IHZvaWQgcHJvcHMub25EaXNtaXNzKCksIFwiYXJpYS1sYWJlbFwiOiBcIkRpc21pc3MgU2xvdGhpbmcgc2lkZWJhciBmb3IgdGhpcyBkb21haW5cIiwgdGl0bGU6IFwiRGlzbWlzcyBmb3IgdGhpcyBkb21haW5cIiwgY2hpbGRyZW46IFwiXFx1MDBEN1wiIH0pXSB9KV0gfSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJvZHlcIiwgY2hpbGRyZW46IFtfanN4cyhcInNlY3Rpb25cIiwgeyBjbGFzc05hbWU6IFwic2NvcmUtY2FyZFwiLCBcImFyaWEtbGFiZWxcIjogXCJNYXRjaCBzY29yZVwiLCBjaGlsZHJlbjogW19qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2NvcmUtbnVtYmVyXCIsIHN0eWxlOiB7IFwiLS1zY29yZS1kZWdcIjogYCR7c2NvcmVEZWdyZWVzfWRlZ2AgfSwgY2hpbGRyZW46IF9qc3goXCJzcGFuXCIsIHsgY2hpbGRyZW46IHNjb3JlVmFsdWUgPz8gXCItLVwiIH0pIH0pLCBfanN4cyhcImRpdlwiLCB7IGNoaWxkcmVuOiBbX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwic2NvcmUtbGFiZWxcIiwgY2hpbGRyZW46IHNjb3JlVmFsdWUgPT09IG51bGwgPyBcIlByb2ZpbGUgbmVlZGVkXCIgOiBcIk1hdGNoIHNjb3JlXCIgfSksIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcInNjb3JlLW5vdGVcIiwgY2hpbGRyZW46IHNjb3JlVmFsdWUgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJDb25uZWN0IHlvdXIgcHJvZmlsZSB0byBzY29yZSB0aGlzIGpvYi5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIkJhc2VkIG9uIHlvdXIgcHJvZmlsZSBhbmQgdGhpcyBqb2IgZGVzY3JpcHRpb24uXCIgfSldIH0pXSB9KSwgX2pzeHMoXCJzZWN0aW9uXCIsIHsgY2xhc3NOYW1lOiBcImFjdGlvbnNcIiwgXCJhcmlhLWxhYmVsXCI6IFwiSm9iIGFjdGlvbnNcIiwgY2hpbGRyZW46IFtfanN4KEFjdGlvbkJ1dHRvbiwgeyBsYWJlbDogXCJUYWlsb3IgcmVzdW1lXCIsIGFjdGl2ZUxhYmVsOiBcIlRhaWxvcmluZy4uLlwiLCBhY3RpdmU6IGFjdGl2ZUFjdGlvbiA9PT0gXCJ0YWlsb3JcIiwgZGlzYWJsZWQ6IGFjdGl2ZUFjdGlvbiAhPT0gbnVsbCwgcHJpbWFyeTogdHJ1ZSwgb25DbGljazogKCkgPT4gcnVuQWN0aW9uKFwidGFpbG9yXCIsIHByb3BzLm9uVGFpbG9yKSB9KSwgX2pzeChBY3Rpb25CdXR0b24sIHsgbGFiZWw6IFwiQ292ZXIgbGV0dGVyXCIsIGFjdGl2ZUxhYmVsOiBcIkdlbmVyYXRpbmcuLi5cIiwgYWN0aXZlOiBhY3RpdmVBY3Rpb24gPT09IFwiY292ZXJMZXR0ZXJcIiwgZGlzYWJsZWQ6IGFjdGl2ZUFjdGlvbiAhPT0gbnVsbCwgb25DbGljazogKCkgPT4gcnVuQWN0aW9uKFwiY292ZXJMZXR0ZXJcIiwgcHJvcHMub25Db3ZlckxldHRlcikgfSksIF9qc3goQWN0aW9uQnV0dG9uLCB7IGxhYmVsOiBcIlNhdmUgam9iXCIsIGFjdGl2ZUxhYmVsOiBcIlNhdmluZy4uLlwiLCBhY3RpdmU6IGFjdGl2ZUFjdGlvbiA9PT0gXCJzYXZlXCIsIGRpc2FibGVkOiBhY3RpdmVBY3Rpb24gIT09IG51bGwsIG9uQ2xpY2s6ICgpID0+IHJ1bkFjdGlvbihcInNhdmVcIiwgcHJvcHMub25TYXZlKSB9KSwgX2pzeChBY3Rpb25CdXR0b24sIHsgbGFiZWw6IHByb3BzLmRldGVjdGVkRmllbGRDb3VudCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGBBdXRvLWZpbGwgJHtwcm9wcy5kZXRlY3RlZEZpZWxkQ291bnR9IGZpZWxkc2BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiQXV0by1maWxsXCIsIGFjdGl2ZUxhYmVsOiBcIkZpbGxpbmcuLi5cIiwgYWN0aXZlOiBhY3RpdmVBY3Rpb24gPT09IFwiYXV0b0ZpbGxcIiwgZGlzYWJsZWQ6IGFjdGl2ZUFjdGlvbiAhPT0gbnVsbCB8fCBwcm9wcy5kZXRlY3RlZEZpZWxkQ291bnQgPT09IDAsIG9uQ2xpY2s6ICgpID0+IHJ1bkFjdGlvbihcImF1dG9GaWxsXCIsIHByb3BzLm9uQXV0b0ZpbGwpIH0pXSB9KSwgbm90aWNlICYmIChfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBgc3RhdHVzLWNhcmQgJHtub3RpY2Uua2luZH1gLCByb2xlOiBcInN0YXR1c1wiLCBjaGlsZHJlbjogbm90aWNlLm1lc3NhZ2UgfSkpLCBfanN4cyhcInNlY3Rpb25cIiwgeyBjbGFzc05hbWU6IFwiYW5zd2VyLWJhbmtcIiwgXCJhcmlhLWxhYmVsXCI6IFwiQW5zd2VyIGJhbmsgc2VhcmNoXCIsIGNoaWxkcmVuOiBbX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwic2VjdGlvbi10aXRsZVwiLCBjaGlsZHJlbjogXCJBbnN3ZXIgYmFua1wiIH0pLCBfanN4cyhcImZvcm1cIiwgeyBjbGFzc05hbWU6IFwic2VhcmNoLXJvd1wiLCBvblN1Ym1pdDogaGFuZGxlU2VhcmNoLCBjaGlsZHJlbjogW19qc3goXCJpbnB1dFwiLCB7IHZhbHVlOiBxdWVyeSwgb25DaGFuZ2U6IChldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKSwgcGxhY2Vob2xkZXI6IFwiU2VhcmNoIHNhdmVkIGFuc3dlcnNcIiwgXCJhcmlhLWxhYmVsXCI6IFwiU2VhcmNoIHNhdmVkIGFuc3dlcnNcIiB9KSwgX2pzeChcImJ1dHRvblwiLCB7IHR5cGU6IFwic3VibWl0XCIsIGRpc2FibGVkOiBzZWFyY2hpbmcgfHwgIXF1ZXJ5LnRyaW0oKSwgY2hpbGRyZW46IHNlYXJjaGluZyA/IFwiLi4uXCIgOiBcIlNlYXJjaFwiIH0pXSB9KSwgc2VhcmNoRXJyb3IgJiYgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwic3RhdHVzLWNhcmQgZXJyb3JcIiwgY2hpbGRyZW46IHNlYXJjaEVycm9yIH0pLCBfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInJlc3VsdHNcIiwgY2hpbGRyZW46IGFuc3dlcnMubWFwKChhbnN3ZXIpID0+IChfanN4cyhcImFydGljbGVcIiwgeyBjbGFzc05hbWU6IFwicmVzdWx0XCIsIGNoaWxkcmVuOiBbX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwicmVzdWx0LXF1ZXN0aW9uXCIsIGNoaWxkcmVuOiBhbnN3ZXIucXVlc3Rpb24gfSksIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcInJlc3VsdC1hbnN3ZXJcIiwgY2hpbGRyZW46IGFuc3dlci5hbnN3ZXIgfSksIF9qc3hzKFwicFwiLCB7IGNsYXNzTmFtZTogXCJyZXN1bHQtbWV0YVwiLCBjaGlsZHJlbjogW01hdGgucm91bmQoYW5zd2VyLnNpbWlsYXJpdHkgKiAxMDApLCBcIiUgbWF0Y2ggLyB1c2VkXCIsIFwiIFwiLCBhbnN3ZXIudGltZXNVc2VkLCBcIiB0aW1lc1wiXSB9KSwgX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicmVzdWx0LWFjdGlvbnNcIiwgY2hpbGRyZW46IFtfanN4KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcInNtYWxsLWJ1dHRvbiBzZWNvbmRhcnlcIiwgdHlwZTogXCJidXR0b25cIiwgb25DbGljazogKCkgPT4gY29weUFuc3dlcihhbnN3ZXIpLCBjaGlsZHJlbjogXCJDb3B5XCIgfSksIF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwic21hbGwtYnV0dG9uXCIsIHR5cGU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6ICgpID0+IHZvaWQgcHJvcHMub25BcHBseUFuc3dlcihhbnN3ZXIpLCBjaGlsZHJlbjogXCJBcHBseVwiIH0pXSB9KV0gfSwgYW5zd2VyLmlkKSkpIH0pXSB9KV0gfSldIH0pIH0pKTtcbn1cbmZ1bmN0aW9uIEFjdGlvbkJ1dHRvbih7IGxhYmVsLCBhY3RpdmVMYWJlbCwgYWN0aXZlLCBkaXNhYmxlZCwgcHJpbWFyeSwgb25DbGljaywgfSkge1xuICAgIHJldHVybiAoX2pzeHMoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IGBhY3Rpb24tYnV0dG9uJHtwcmltYXJ5ID8gXCIgcHJpbWFyeVwiIDogXCJcIn1gLCB0eXBlOiBcImJ1dHRvblwiLCBkaXNhYmxlZDogZGlzYWJsZWQsIG9uQ2xpY2s6IG9uQ2xpY2ssIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjaGlsZHJlbjogYWN0aXZlID8gYWN0aXZlTGFiZWwgOiBsYWJlbCB9KSwgX2pzeChcInNwYW5cIiwgeyBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiLCBjaGlsZHJlbjogXCItPlwiIH0pXSB9KSk7XG59XG4iLCJleHBvcnQgY29uc3QgREVGQVVMVF9MT0NBTEUgPSBcImVuLVVTXCI7XG5jb25zdCBOVU1FUklDX1BBUlRTX0xPQ0FMRSA9IGAke0RFRkFVTFRfTE9DQUxFfS11LW51LWxhdG5gO1xuZXhwb3J0IGNvbnN0IExPQ0FMRV9DT09LSUVfTkFNRSA9IFwidGFpZGFfbG9jYWxlXCI7XG5leHBvcnQgY29uc3QgTE9DQUxFX0NIQU5HRV9FVkVOVCA9IFwidGFpZGE6bG9jYWxlLWNoYW5nZVwiO1xuZXhwb3J0IGNvbnN0IFNVUFBPUlRFRF9MT0NBTEVTID0gW1xuICAgIHsgdmFsdWU6IFwiZW4tVVNcIiwgbGFiZWw6IFwiRW5nbGlzaCAoVVMpXCIgfSxcbiAgICB7IHZhbHVlOiBcImVuLUNBXCIsIGxhYmVsOiBcIkVuZ2xpc2ggKENBKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJlbi1HQlwiLCBsYWJlbDogXCJFbmdsaXNoIChVSylcIiB9LFxuICAgIHsgdmFsdWU6IFwiZnJcIiwgbGFiZWw6IFwiRnJlbmNoXCIgfSxcbiAgICB7IHZhbHVlOiBcImVzXCIsIGxhYmVsOiBcIlNwYW5pc2hcIiB9LFxuICAgIHsgdmFsdWU6IFwiZGVcIiwgbGFiZWw6IFwiR2VybWFuXCIgfSxcbiAgICB7IHZhbHVlOiBcImphXCIsIGxhYmVsOiBcIkphcGFuZXNlXCIgfSxcbiAgICB7IHZhbHVlOiBcInpoLUNOXCIsIGxhYmVsOiBcIkNoaW5lc2UgKFNpbXBsaWZpZWQpXCIgfSxcbiAgICB7IHZhbHVlOiBcInB0XCIsIGxhYmVsOiBcIlBvcnR1Z3Vlc2VcIiB9LFxuICAgIHsgdmFsdWU6IFwicHQtQlJcIiwgbGFiZWw6IFwiUG9ydHVndWVzZSAoQnJhemlsKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJoaVwiLCBsYWJlbDogXCJIaW5kaVwiIH0sXG4gICAgeyB2YWx1ZTogXCJrb1wiLCBsYWJlbDogXCJLb3JlYW5cIiB9LFxuXTtcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUobG9jYWxlKSB7XG4gICAgaWYgKCFsb2NhbGUpXG4gICAgICAgIHJldHVybiBERUZBVUxUX0xPQ0FMRTtcbiAgICBjb25zdCBzdXBwb3J0ZWQgPSBTVVBQT1JURURfTE9DQUxFUy5maW5kKChjYW5kaWRhdGUpID0+IGNhbmRpZGF0ZS52YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBsb2NhbGUudG9Mb3dlckNhc2UoKSB8fFxuICAgICAgICBjYW5kaWRhdGUudmFsdWUuc3BsaXQoXCItXCIpWzBdLnRvTG93ZXJDYXNlKCkgPT09IGxvY2FsZS50b0xvd2VyQ2FzZSgpKTtcbiAgICByZXR1cm4gc3VwcG9ydGVkPy52YWx1ZSA/PyBERUZBVUxUX0xPQ0FMRTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3dJc28oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3dEYXRlKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vd0Vwb2NoKCkge1xuICAgIHJldHVybiBEYXRlLm5vdygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVG9EYXRlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IFwiXCIpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGRhdGUgPSB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyBuZXcgRGF0ZSh2YWx1ZS5nZXRUaW1lKCkpIDogbmV3IERhdGUodmFsdWUpO1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpID8gbnVsbCA6IGRhdGU7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9Jc28odmFsdWUpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBkYXRlIHZhbHVlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvTnVsbGFibGVJc28odmFsdWUpIHtcbiAgICByZXR1cm4gcGFyc2VUb0RhdGUodmFsdWUpPy50b0lTT1N0cmluZygpID8/IG51bGw7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9FcG9jaCh2YWx1ZSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgfVxuICAgIHJldHVybiBkYXRlLmdldFRpbWUoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b051bGxhYmxlRXBvY2godmFsdWUpIHtcbiAgICByZXR1cm4gcGFyc2VUb0RhdGUodmFsdWUpPy5nZXRUaW1lKCkgPz8gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VyVGltZXpvbmUoKSB7XG4gICAgaWYgKHR5cGVvZiBJbnRsID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gXCJVVENcIjtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLnRpbWVab25lIHx8IFwiVVRDXCI7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIFwiVVRDXCI7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0RGlzcGxheVRpbWV6b25lKHRpbWVab25lKSB7XG4gICAgaWYgKHRpbWVab25lKVxuICAgICAgICByZXR1cm4gdGltZVpvbmU7XG4gICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBcIlVUQ1wiIDogZ2V0VXNlclRpbWV6b25lKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0QWJzb2x1dGUodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJVbmtub3duIGRhdGVcIjtcbiAgICBjb25zdCBpbmNsdWRlVGltZSA9IG9wdHMuaW5jbHVkZVRpbWUgPz8gdHJ1ZTtcbiAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChub3JtYWxpemVMb2NhbGUob3B0cy5sb2NhbGUpLCB7XG4gICAgICAgIG1vbnRoOiBcInNob3J0XCIsXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICAuLi4oaW5jbHVkZVRpbWUgPyB7IGhvdXI6IFwibnVtZXJpY1wiLCBtaW51dGU6IFwiMi1kaWdpdFwiIH0gOiB7fSksXG4gICAgICAgIHRpbWVab25lOiBnZXREaXNwbGF5VGltZXpvbmUob3B0cy50aW1lWm9uZSksXG4gICAgfSk7XG4gICAgY29uc3QgZm9ybWF0dGVkID0gZm9ybWF0dGVyLmZvcm1hdChkYXRlKTtcbiAgICBpZiAoIWluY2x1ZGVUaW1lKVxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkO1xuICAgIGNvbnN0IGxhc3RDb21tYSA9IGZvcm1hdHRlZC5sYXN0SW5kZXhPZihcIixcIik7XG4gICAgaWYgKGxhc3RDb21tYSA9PT0gLTEpXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWQ7XG4gICAgcmV0dXJuIGAke2Zvcm1hdHRlZC5zbGljZSgwLCBsYXN0Q29tbWEpfSDCtyAke2Zvcm1hdHRlZFxuICAgICAgICAuc2xpY2UobGFzdENvbW1hICsgMSlcbiAgICAgICAgLnRyaW0oKX1gO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFJlbGF0aXZlKHZhbHVlLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZVRvRGF0ZShvcHRzLm5vdyA/PyBub3dJc28oKSk7XG4gICAgaWYgKCFkYXRlIHx8ICFjdXJyZW50KSB7XG4gICAgICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xuICAgIH1cbiAgICBjb25zdCBkaWZmTXMgPSBjdXJyZW50LmdldFRpbWUoKSAtIGRhdGUuZ2V0VGltZSgpO1xuICAgIGNvbnN0IGFic01zID0gTWF0aC5hYnMoZGlmZk1zKTtcbiAgICBjb25zdCBpc0Z1dHVyZSA9IGRpZmZNcyA8IDA7XG4gICAgY29uc3QgbWludXRlID0gNjAgKiAxMDAwO1xuICAgIGNvbnN0IGhvdXIgPSA2MCAqIG1pbnV0ZTtcbiAgICBjb25zdCBkYXkgPSAyNCAqIGhvdXI7XG4gICAgY29uc3Qgd2VlayA9IDcgKiBkYXk7XG4gICAgY29uc3QgbW9udGggPSAzMCAqIGRheTtcbiAgICBjb25zdCB5ZWFyID0gMzY1ICogZGF5O1xuICAgIGlmIChhYnNNcyA8IG1pbnV0ZSlcbiAgICAgICAgcmV0dXJuIFwiSnVzdCBub3dcIjtcbiAgICBpZiAoYWJzTXMgPCBob3VyKVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIG1pbnV0ZSksIFwibVwiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgZGF5KVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIGhvdXIpLCBcImhcIiwgaXNGdXR1cmUpO1xuICAgIGlmIChhYnNNcyA8IDIgKiBkYXkpXG4gICAgICAgIHJldHVybiBpc0Z1dHVyZSA/IFwiVG9tb3Jyb3dcIiA6IFwiWWVzdGVyZGF5XCI7XG4gICAgaWYgKGFic01zIDwgd2VlaylcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyBkYXkpLCBcImRcIiwgaXNGdXR1cmUpO1xuICAgIGlmIChhYnNNcyA8IG1vbnRoKVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIHdlZWspLCBcIndcIiwgaXNGdXR1cmUpO1xuICAgIGlmIChhYnNNcyA8IHllYXIpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gbW9udGgpLCBcIm1vXCIsIGlzRnV0dXJlKTtcbiAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIHllYXIpLCBcInlcIiwgaXNGdXR1cmUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERhdGVPbmx5KHZhbHVlLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KG5vcm1hbGl6ZUxvY2FsZShvcHRzLmxvY2FsZSksIHtcbiAgICAgICAgbW9udGg6IFwic2hvcnRcIixcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIHRpbWVab25lOiBnZXREaXNwbGF5VGltZXpvbmUob3B0cy50aW1lWm9uZSksXG4gICAgfSkuZm9ybWF0KGRhdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWVPbmx5KHZhbHVlLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgcmV0dXJuIFwiVW5rbm93biB0aW1lXCI7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KG5vcm1hbGl6ZUxvY2FsZShvcHRzLmxvY2FsZSksIHtcbiAgICAgICAgaG91cjogXCJudW1lcmljXCIsXG4gICAgICAgIG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG4gICAgICAgIHRpbWVab25lOiBnZXREaXNwbGF5VGltZXpvbmUob3B0cy50aW1lWm9uZSksXG4gICAgfSkuZm9ybWF0KGRhdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdElzb0RhdGVPbmx5KHZhbHVlID0gbm93SXNvKCkpIHtcbiAgICByZXR1cm4gdG9Jc28ocGFyc2VUb0RhdGUodmFsdWUpID8/IG5vd0lzbygpKS5zbGljZSgwLCAxMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TW9udGhZZWFyKHZhbHVlLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KG5vcm1hbGl6ZUxvY2FsZShvcHRzLmxvY2FsZSksIHtcbiAgICAgICAgbW9udGg6IFwic2hvcnRcIixcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIHRpbWVab25lOiBnZXREaXNwbGF5VGltZXpvbmUob3B0cy50aW1lWm9uZSksXG4gICAgfSkuZm9ybWF0KGRhdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUGFzdCh2YWx1ZSwgbm93ID0gbm93SXNvKCkpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZVRvRGF0ZShub3cpO1xuICAgIHJldHVybiBCb29sZWFuKGRhdGUgJiYgY3VycmVudCAmJiBkYXRlLmdldFRpbWUoKSA8IGN1cnJlbnQuZ2V0VGltZSgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1dHVyZSh2YWx1ZSwgbm93ID0gbm93SXNvKCkpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZVRvRGF0ZShub3cpO1xuICAgIHJldHVybiBCb29sZWFuKGRhdGUgJiYgY3VycmVudCAmJiBkYXRlLmdldFRpbWUoKSA+IGN1cnJlbnQuZ2V0VGltZSgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkaWZmU2Vjb25kcyhhLCBiKSB7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJzZVRvRGF0ZShhKTtcbiAgICBjb25zdCBzZWNvbmQgPSBwYXJzZVRvRGF0ZShiKTtcbiAgICBpZiAoIWZpcnN0IHx8ICFzZWNvbmQpXG4gICAgICAgIHJldHVybiBOdW1iZXIuTmFOO1xuICAgIHJldHVybiBNYXRoLnRydW5jKChmaXJzdC5nZXRUaW1lKCkgLSBzZWNvbmQuZ2V0VGltZSgpKSAvIDEwMDApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZEYXlzKGEsIGIpIHtcbiAgICBjb25zdCBzZWNvbmRzID0gZGlmZlNlY29uZHMoYSwgYik7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihzZWNvbmRzKSA/IE51bWJlci5OYU4gOiBzZWNvbmRzIC8gODY0MDA7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkRGF5cyh2YWx1ZSwgZGF5cykge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBkYXRlIHZhbHVlXCIpO1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArIGRheXMgKiA4NjQwMDAwMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkTWludXRlcyh2YWx1ZSwgbWludXRlcykge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBkYXRlIHZhbHVlXCIpO1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArIG1pbnV0ZXMgKiA2MDAwMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3RhcnRPZkRheSh2YWx1ZSwgdGltZVpvbmUgPSBcIlVUQ1wiKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgaWYgKHRpbWVab25lID09PSBcIlVUQ1wiKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyhkYXRlLmdldFVUQ0Z1bGxZZWFyKCksIGRhdGUuZ2V0VVRDTW9udGgoKSwgZGF0ZS5nZXRVVENEYXRlKCkpKTtcbiAgICB9XG4gICAgY29uc3QgcGFydHMgPSBnZXRab25lZFBhcnRzKGRhdGUsIHRpbWVab25lKTtcbiAgICByZXR1cm4gem9uZWRUaW1lVG9VdGMocGFydHMueWVhciwgcGFydHMubW9udGgsIHBhcnRzLmRheSwgMCwgMCwgMCwgdGltZVpvbmUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGVuZE9mRGF5KHZhbHVlLCB0aW1lWm9uZSA9IFwiVVRDXCIpIHtcbiAgICByZXR1cm4gYWRkTWludXRlcyhhZGREYXlzKHN0YXJ0T2ZEYXkodmFsdWUsIHRpbWVab25lKSwgMSksIC0xIC8gNjAwMDApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvVXNlclR6KHZhbHVlLCB0aW1lWm9uZSA9IGdldFVzZXJUaW1lem9uZSgpKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgY29uc3QgcGFydHMgPSBnZXRab25lZFBhcnRzKGRhdGUsIHRpbWVab25lKTtcbiAgICByZXR1cm4gbmV3IERhdGUocGFydHMueWVhciwgcGFydHMubW9udGggLSAxLCBwYXJ0cy5kYXksIHBhcnRzLmhvdXIsIHBhcnRzLm1pbnV0ZSwgcGFydHMuc2Vjb25kKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREYXRlQWJzb2x1dGUoZGF0ZSwgbG9jYWxlID0gREVGQVVMVF9MT0NBTEUpIHtcbiAgICByZXR1cm4gZm9ybWF0QWJzb2x1dGUoZGF0ZSwgeyBsb2NhbGUgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGF0ZVJlbGF0aXZlKGRhdGUsIG5vdyA9IG5vd0lzbygpKSB7XG4gICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlKGRhdGUsIHsgbm93IH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyb3dzZXJEZWZhdWx0TG9jYWxlKCkge1xuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gREVGQVVMVF9MT0NBTEU7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUxvY2FsZShuYXZpZ2F0b3IubGFuZ3VhZ2UpO1xufVxuZnVuY3Rpb24gZm9ybWF0UmVsYXRpdmVCdWNrZXQodmFsdWUsIHVuaXQsIGlzRnV0dXJlKSB7XG4gICAgcmV0dXJuIGlzRnV0dXJlID8gYGluICR7dmFsdWV9JHt1bml0fWAgOiBgJHt2YWx1ZX0ke3VuaXR9IGFnb2A7XG59XG5mdW5jdGlvbiBnZXRab25lZFBhcnRzKGRhdGUsIHRpbWVab25lKSB7XG4gICAgY29uc3QgcGFydHMgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChOVU1FUklDX1BBUlRTX0xPQ0FMRSwge1xuICAgICAgICB0aW1lWm9uZSxcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIG1vbnRoOiBcIjItZGlnaXRcIixcbiAgICAgICAgZGF5OiBcIjItZGlnaXRcIixcbiAgICAgICAgaG91cjogXCIyLWRpZ2l0XCIsXG4gICAgICAgIG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG4gICAgICAgIHNlY29uZDogXCIyLWRpZ2l0XCIsXG4gICAgICAgIGhvdXJDeWNsZTogXCJoMjNcIixcbiAgICB9KS5mb3JtYXRUb1BhcnRzKGRhdGUpO1xuICAgIGNvbnN0IGdldCA9ICh0eXBlKSA9PiBOdW1iZXIocGFydHMuZmluZCgocGFydCkgPT4gcGFydC50eXBlID09PSB0eXBlKT8udmFsdWUpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHllYXI6IGdldChcInllYXJcIiksXG4gICAgICAgIG1vbnRoOiBnZXQoXCJtb250aFwiKSxcbiAgICAgICAgZGF5OiBnZXQoXCJkYXlcIiksXG4gICAgICAgIGhvdXI6IGdldChcImhvdXJcIiksXG4gICAgICAgIG1pbnV0ZTogZ2V0KFwibWludXRlXCIpLFxuICAgICAgICBzZWNvbmQ6IGdldChcInNlY29uZFwiKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gem9uZWRUaW1lVG9VdGMoeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIHRpbWVab25lKSB7XG4gICAgY29uc3QgdXRjR3Vlc3MgPSBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCAtIDEsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQpKTtcbiAgICBjb25zdCBwYXJ0cyA9IGdldFpvbmVkUGFydHModXRjR3Vlc3MsIHRpbWVab25lKTtcbiAgICBjb25zdCBvZmZzZXRNcyA9IERhdGUuVVRDKHBhcnRzLnllYXIsIHBhcnRzLm1vbnRoIC0gMSwgcGFydHMuZGF5LCBwYXJ0cy5ob3VyLCBwYXJ0cy5taW51dGUsIHBhcnRzLnNlY29uZCkgLSB1dGNHdWVzcy5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHV0Y0d1ZXNzLmdldFRpbWUoKSAtIG9mZnNldE1zKTtcbn1cbiIsImV4cG9ydCBjb25zdCBTVUJfU0NPUkVfTUFYX1BPSU5UUyA9IHtcbiAgICBzZWN0aW9uQ29tcGxldGVuZXNzOiAxMCxcbiAgICBhY3Rpb25WZXJiczogMTUsXG4gICAgcXVhbnRpZmllZEFjaGlldmVtZW50czogMjAsXG4gICAga2V5d29yZE1hdGNoOiAyNSxcbiAgICBsZW5ndGg6IDEwLFxuICAgIHNwZWxsaW5nR3JhbW1hcjogMTAsXG4gICAgYXRzRnJpZW5kbGluZXNzOiAxMCxcbn07XG5leHBvcnQgY29uc3QgQUNUSU9OX1ZFUkJTID0gW1xuICAgIFwiYWNoaWV2ZWRcIixcbiAgICBcImFuYWx5emVkXCIsXG4gICAgXCJhcmNoaXRlY3RlZFwiLFxuICAgIFwiYnVpbHRcIixcbiAgICBcImNvbGxhYm9yYXRlZFwiLFxuICAgIFwiY3JlYXRlZFwiLFxuICAgIFwiZGVsaXZlcmVkXCIsXG4gICAgXCJkZXNpZ25lZFwiLFxuICAgIFwiZGV2ZWxvcGVkXCIsXG4gICAgXCJkcm92ZVwiLFxuICAgIFwiaW1wcm92ZWRcIixcbiAgICBcImluY3JlYXNlZFwiLFxuICAgIFwibGF1bmNoZWRcIixcbiAgICBcImxlZFwiLFxuICAgIFwibWFuYWdlZFwiLFxuICAgIFwibWVudG9yZWRcIixcbiAgICBcIm9wdGltaXplZFwiLFxuICAgIFwicmVkdWNlZFwiLFxuICAgIFwicmVzb2x2ZWRcIixcbiAgICBcInNoaXBwZWRcIixcbiAgICBcInN0cmVhbWxpbmVkXCIsXG4gICAgXCJzdXBwb3J0ZWRcIixcbiAgICBcInRyYW5zZm9ybWVkXCIsXG5dO1xuZXhwb3J0IGNvbnN0IFFVQU5USUZJRURfUkVHRVggPSAvXFxkKyV8XFwkW1xcZCxdKyg/OlxcLlxcZCspP1trS21NYkJdP3xcXGJcXGQreFxcYnxcXGJ0ZWFtIG9mIFxcZCtcXGJ8XFxiXFxkK1xccysodXNlcnN8Y3VzdG9tZXJzfGNsaWVudHN8cHJvamVjdHN8cGVvcGxlfGVuZ2luZWVyc3xyZXBvcnRzfGhvdXJzfG1lbWJlcnN8Y291bnRyaWVzfGxhbmd1YWdlc3xzdGF0ZXN8Y2l0aWVzfHN0b3Jlc3xwYXJ0bmVyc3xkZWFsc3xsZWFkcylcXGIvZ2k7XG4iLCJleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVGV4dCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnJlcGxhY2UoL1teYS16MC05KyMuXFxzLy1dL2csIFwiIFwiKVxuICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgICAgLnRyaW0oKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gd29yZEJvdW5kYXJ5UmVnZXgodGVybSwgZmxhZ3MgPSBcIlwiKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdFeHAodGVybSl9XFxcXGJgLCBmbGFncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNXb3JkKHRleHQsIHRlcm0pIHtcbiAgICByZXR1cm4gd29yZEJvdW5kYXJ5UmVnZXgodGVybSkudGVzdCh0ZXh0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb3VudFdvcmRPY2N1cnJlbmNlcyh0ZXh0LCB0ZXJtKSB7XG4gICAgcmV0dXJuICh0ZXh0Lm1hdGNoKHdvcmRCb3VuZGFyeVJlZ2V4KHRlcm0sIFwiZ1wiKSkgfHwgW10pLmxlbmd0aDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRIaWdobGlnaHRzKHByb2ZpbGUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAuLi5wcm9maWxlLmV4cGVyaWVuY2VzLmZsYXRNYXAoKGV4cGVyaWVuY2UpID0+IGV4cGVyaWVuY2UuaGlnaGxpZ2h0cyksXG4gICAgICAgIC4uLnByb2ZpbGUucHJvamVjdHMuZmxhdE1hcCgocHJvamVjdCkgPT4gcHJvamVjdC5oaWdobGlnaHRzKSxcbiAgICBdLmZpbHRlcihCb29sZWFuKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UHJvZmlsZVRleHQocHJvZmlsZSkge1xuICAgIGNvbnN0IHBhcnRzID0gW1xuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/Lm5hbWUsXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8uZW1haWwsXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ucGhvbmUsXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ubG9jYXRpb24sXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ubGlua2VkaW4sXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8uZ2l0aHViLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LndlYnNpdGUsXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8uaGVhZGxpbmUsXG4gICAgICAgIHByb2ZpbGUuc3VtbWFyeSxcbiAgICAgICAgLi4ucHJvZmlsZS5leHBlcmllbmNlcy5mbGF0TWFwKChleHBlcmllbmNlKSA9PiBbXG4gICAgICAgICAgICBleHBlcmllbmNlLnRpdGxlLFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5jb21wYW55LFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5sb2NhdGlvbixcbiAgICAgICAgICAgIGV4cGVyaWVuY2UuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAuLi5leHBlcmllbmNlLmhpZ2hsaWdodHMsXG4gICAgICAgICAgICAuLi5leHBlcmllbmNlLnNraWxscyxcbiAgICAgICAgICAgIGV4cGVyaWVuY2Uuc3RhcnREYXRlLFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5lbmREYXRlLFxuICAgICAgICBdKSxcbiAgICAgICAgLi4ucHJvZmlsZS5lZHVjYXRpb24uZmxhdE1hcCgoZWR1Y2F0aW9uKSA9PiBbXG4gICAgICAgICAgICBlZHVjYXRpb24uaW5zdGl0dXRpb24sXG4gICAgICAgICAgICBlZHVjYXRpb24uZGVncmVlLFxuICAgICAgICAgICAgZWR1Y2F0aW9uLmZpZWxkLFxuICAgICAgICAgICAgLi4uZWR1Y2F0aW9uLmhpZ2hsaWdodHMsXG4gICAgICAgICAgICBlZHVjYXRpb24uc3RhcnREYXRlLFxuICAgICAgICAgICAgZWR1Y2F0aW9uLmVuZERhdGUsXG4gICAgICAgIF0pLFxuICAgICAgICAuLi5wcm9maWxlLnNraWxscy5tYXAoKHNraWxsKSA9PiBza2lsbC5uYW1lKSxcbiAgICAgICAgLi4ucHJvZmlsZS5wcm9qZWN0cy5mbGF0TWFwKChwcm9qZWN0KSA9PiBbXG4gICAgICAgICAgICBwcm9qZWN0Lm5hbWUsXG4gICAgICAgICAgICBwcm9qZWN0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcHJvamVjdC51cmwsXG4gICAgICAgICAgICAuLi5wcm9qZWN0LmhpZ2hsaWdodHMsXG4gICAgICAgICAgICAuLi5wcm9qZWN0LnRlY2hub2xvZ2llcyxcbiAgICAgICAgXSksXG4gICAgICAgIC4uLnByb2ZpbGUuY2VydGlmaWNhdGlvbnMuZmxhdE1hcCgoY2VydGlmaWNhdGlvbikgPT4gW1xuICAgICAgICAgICAgY2VydGlmaWNhdGlvbi5uYW1lLFxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbi5pc3N1ZXIsXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uLmRhdGUsXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uLnVybCxcbiAgICAgICAgXSksXG4gICAgXTtcbiAgICByZXR1cm4gcGFydHMuZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCJcXG5cIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzdW1lVGV4dChwcm9maWxlLCByYXdUZXh0KSB7XG4gICAgcmV0dXJuIChyYXdUZXh0Py50cmltKCkgfHwgcHJvZmlsZS5yYXdUZXh0Py50cmltKCkgfHwgZXh0cmFjdFByb2ZpbGVUZXh0KHByb2ZpbGUpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3b3JkQ291bnQodGV4dCkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVUZXh0KHRleHQpO1xuICAgIGlmICghbm9ybWFsaXplZClcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xufVxuIiwiaW1wb3J0IHsgQUNUSU9OX1ZFUkJTLCBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0SGlnaGxpZ2h0cywgbm9ybWFsaXplVGV4dCwgd29yZEJvdW5kYXJ5UmVnZXggfSBmcm9tIFwiLi90ZXh0XCI7XG5mdW5jdGlvbiBwb2ludHNGb3JEaXN0aW5jdFZlcmJzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICByZXR1cm4gMDtcbiAgICBpZiAoY291bnQgPD0gMilcbiAgICAgICAgcmV0dXJuIDU7XG4gICAgaWYgKGNvdW50IDw9IDQpXG4gICAgICAgIHJldHVybiA5O1xuICAgIGlmIChjb3VudCA8PSA3KVxuICAgICAgICByZXR1cm4gMTI7XG4gICAgcmV0dXJuIDE1O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlQWN0aW9uVmVyYnMoaW5wdXQpIHtcbiAgICBjb25zdCBkaXN0aW5jdFZlcmJzID0gbmV3IFNldCgpO1xuICAgIGZvciAoY29uc3QgaGlnaGxpZ2h0IG9mIGdldEhpZ2hsaWdodHMoaW5wdXQucHJvZmlsZSkpIHtcbiAgICAgICAgY29uc3QgZmlyc3RXb3JkID0gbm9ybWFsaXplVGV4dChoaWdobGlnaHQpLnNwbGl0KC9cXHMrLylbMF0gPz8gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCB2ZXJiIG9mIEFDVElPTl9WRVJCUykge1xuICAgICAgICAgICAgaWYgKHdvcmRCb3VuZGFyeVJlZ2V4KHZlcmIpLnRlc3QoZmlyc3RXb3JkKSkge1xuICAgICAgICAgICAgICAgIGRpc3RpbmN0VmVyYnMuYWRkKHZlcmIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHZlcmJzID0gQXJyYXkuZnJvbShkaXN0aW5jdFZlcmJzKS5zb3J0KCk7XG4gICAgY29uc3Qgbm90ZXMgPSB2ZXJicy5sZW5ndGggPT09IDBcbiAgICAgICAgPyBbXCJTdGFydCBhY2hpZXZlbWVudCBidWxsZXRzIHdpdGggc3Ryb25nIGFjdGlvbiB2ZXJicy5cIl1cbiAgICAgICAgOiBbXTtcbiAgICBjb25zdCBwcmV2aWV3ID0gdmVyYnMuc2xpY2UoMCwgNSkuam9pbihcIiwgXCIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJhY3Rpb25WZXJic1wiLFxuICAgICAgICBsYWJlbDogXCJBY3Rpb24gdmVyYnNcIixcbiAgICAgICAgZWFybmVkOiBwb2ludHNGb3JEaXN0aW5jdFZlcmJzKHZlcmJzLmxlbmd0aCksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMuYWN0aW9uVmVyYnMsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogW1xuICAgICAgICAgICAgcHJldmlld1xuICAgICAgICAgICAgICAgID8gYCR7dmVyYnMubGVuZ3RofSBkaXN0aW5jdCBhY3Rpb24gdmVyYnMgKCR7cHJldmlld30pYFxuICAgICAgICAgICAgICAgIDogXCIwIGRpc3RpbmN0IGFjdGlvbiB2ZXJic1wiLFxuICAgICAgICBdLFxuICAgIH07XG59XG4iLCJleHBvcnQgY29uc3QgUFJPQkxFTUFUSUNfQ0hBUkFDVEVSUyA9IFtcbiAgICB7IGNoYXI6IFwiXFx1MjAyMlwiLCBuYW1lOiBcImJ1bGxldCBwb2ludFwiLCByZXBsYWNlbWVudDogXCItXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxM1wiLCBuYW1lOiBcImVuIGRhc2hcIiwgcmVwbGFjZW1lbnQ6IFwiLVwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMTRcIiwgbmFtZTogXCJlbSBkYXNoXCIsIHJlcGxhY2VtZW50OiBcIi1cIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDFjXCIsIG5hbWU6IFwiY3VybHkgcXVvdGUgbGVmdFwiLCByZXBsYWNlbWVudDogJ1wiJyB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDFkXCIsIG5hbWU6IFwiY3VybHkgcXVvdGUgcmlnaHRcIiwgcmVwbGFjZW1lbnQ6ICdcIicgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxOFwiLCBuYW1lOiBcImN1cmx5IGFwb3N0cm9waGUgbGVmdFwiLCByZXBsYWNlbWVudDogXCInXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxOVwiLCBuYW1lOiBcImN1cmx5IGFwb3N0cm9waGUgcmlnaHRcIiwgcmVwbGFjZW1lbnQ6IFwiJ1wiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMjZcIiwgbmFtZTogXCJlbGxpcHNpc1wiLCByZXBsYWNlbWVudDogXCIuLi5cIiB9LFxuICAgIHsgY2hhcjogXCJcXHUwMGE5XCIsIG5hbWU6IFwiY29weXJpZ2h0XCIsIHJlcGxhY2VtZW50OiBcIihjKVwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTAwYWVcIiwgbmFtZTogXCJyZWdpc3RlcmVkXCIsIHJlcGxhY2VtZW50OiBcIihSKVwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIxMjJcIiwgbmFtZTogXCJ0cmFkZW1hcmtcIiwgcmVwbGFjZW1lbnQ6IFwiKFRNKVwiIH0sXG5dO1xuIiwiaW1wb3J0IHsgUFJPQkxFTUFUSUNfQ0hBUkFDVEVSUyB9IGZyb20gXCIuL2F0cy1jaGFyYWN0ZXJzXCI7XG5pbXBvcnQgeyBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0UmVzdW1lVGV4dCB9IGZyb20gXCIuL3RleHRcIjtcbmV4cG9ydCBmdW5jdGlvbiBzY29yZUF0c0ZyaWVuZGxpbmVzcyhpbnB1dCkge1xuICAgIGNvbnN0IHRleHQgPSBnZXRSZXN1bWVUZXh0KGlucHV0LnByb2ZpbGUsIGlucHV0LnJhd1RleHQpO1xuICAgIGNvbnN0IHJhd1RleHQgPSBpbnB1dC5yYXdUZXh0ID8/IGlucHV0LnByb2ZpbGUucmF3VGV4dCA/PyBcIlwiO1xuICAgIGNvbnN0IG5vdGVzID0gW107XG4gICAgY29uc3QgZXZpZGVuY2UgPSBbXTtcbiAgICBsZXQgZGVkdWN0aW9ucyA9IDA7XG4gICAgY29uc3QgZm91bmRQcm9ibGVtYXRpYyA9IFBST0JMRU1BVElDX0NIQVJBQ1RFUlMuZmlsdGVyKCh7IGNoYXIgfSkgPT4gdGV4dC5pbmNsdWRlcyhjaGFyKSk7XG4gICAgaWYgKGZvdW5kUHJvYmxlbWF0aWMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5taW4oMywgZm91bmRQcm9ibGVtYXRpYy5sZW5ndGgpO1xuICAgICAgICBkZWR1Y3Rpb25zICs9IHBlbmFsdHk7XG4gICAgICAgIG5vdGVzLnB1c2goXCJTcGVjaWFsIGZvcm1hdHRpbmcgY2hhcmFjdGVycyBjYW4gcmVkdWNlIEFUUyBwYXJzZSBxdWFsaXR5LlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgJHtmb3VuZFByb2JsZW1hdGljLmxlbmd0aH0gc3BlY2lhbCBjaGFyYWN0ZXJzYCk7XG4gICAgfVxuICAgIGNvbnN0IGJhZENoYXJzID0gKHRleHQubWF0Y2goL1tcXHVGRkZEXFx1MDAwMC1cXHUwMDA4XFx1MDAwQlxcdTAwMENcXHUwMDBFLVxcdTAwMUZdL2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgaWYgKGJhZENoYXJzID4gMCkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJDb250cm9sIG9yIHJlcGxhY2VtZW50IGNoYXJhY3RlcnMgZGV0ZWN0ZWQuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGAke2JhZENoYXJzfSBjb250cm9sIG9yIHJlcGxhY2VtZW50IGNoYXJhY3RlcihzKWApO1xuICAgIH1cbiAgICBpZiAocmF3VGV4dC5pbmNsdWRlcyhcIlxcdFwiKSkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJUYWIgY2hhcmFjdGVycyBtYXkgaW5kaWNhdGUgdGFibGUtc3R5bGUgZm9ybWF0dGluZy5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJUYWIgY2hhcmFjdGVycyBmb3VuZFwiKTtcbiAgICB9XG4gICAgY29uc3QgbG9uZ0xpbmVzID0gcmF3VGV4dC5zcGxpdCgvXFxyP1xcbi8pLmZpbHRlcigobGluZSkgPT4gbGluZS5sZW5ndGggPiAyMDApO1xuICAgIGlmIChsb25nTGluZXMubGVuZ3RoID49IDQpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAyO1xuICAgICAgICBub3Rlcy5wdXNoKFwiVmVyeSBsb25nIGxpbmVzIG1heSBpbmRpY2F0ZSBtdWx0aS1jb2x1bW4gb3IgdGFibGUgZm9ybWF0dGluZy5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYCR7bG9uZ0xpbmVzLmxlbmd0aH0gb3Zlci1sb25nIGxpbmVzYCk7XG4gICAgfVxuICAgIGlmICgvPFthLXpBLVovXVtePl0qPi8udGVzdChyYXdUZXh0KSkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJIVE1MIHRhZ3MgZGV0ZWN0ZWQgaW4gcmVzdW1lIHRleHQuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKFwiSFRNTCB0YWdzIGZvdW5kXCIpO1xuICAgIH1cbiAgICBpZiAoIS9bXFx3ListXStAW1xcdy4tXStcXC5bYS16QS1aXXsyLH0vLnRlc3QodGV4dCkpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAyO1xuICAgICAgICBub3Rlcy5wdXNoKFwiTm8gZW1haWwgcGF0dGVybiBkZXRlY3RlZCBpbiBwYXJzZWFibGUgcmVzdW1lIHRleHQuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKFwiTm8gZW1haWwgZGV0ZWN0ZWRcIik7XG4gICAgfVxuICAgIGlmIChpbnB1dC5yYXdUZXh0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgaW5wdXQucmF3VGV4dC50cmltKCkubGVuZ3RoIDwgMjAwICYmXG4gICAgICAgIGlucHV0LnByb2ZpbGUuZXhwZXJpZW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDM7XG4gICAgICAgIG5vdGVzLnB1c2goXCJFeHRyYWN0ZWQgdGV4dCBpcyB2ZXJ5IHNob3J0IGZvciBhIHJlc3VtZSB3aXRoIGV4cGVyaWVuY2UuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKFwiUG9zc2libGUgaW1hZ2Utb25seSBQREZcIik7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJhdHNGcmllbmRsaW5lc3NcIixcbiAgICAgICAgbGFiZWw6IFwiQVRTIGZyaWVuZGxpbmVzc1wiLFxuICAgICAgICBlYXJuZWQ6IE1hdGgubWF4KDAsIFNVQl9TQ09SRV9NQVhfUE9JTlRTLmF0c0ZyaWVuZGxpbmVzcyAtIGRlZHVjdGlvbnMpLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmF0c0ZyaWVuZGxpbmVzcyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBldmlkZW5jZS5sZW5ndGggPiAwID8gZXZpZGVuY2UgOiBbXCJObyBBVFMgZm9ybWF0dGluZyBpc3N1ZXMgZGV0ZWN0ZWQuXCJdLFxuICAgIH07XG59XG4iLCIvKipcbiAqIFN5bm9ueW0gZ3JvdXBzIGZvciBzZW1hbnRpYyBrZXl3b3JkIG1hdGNoaW5nIGluIEFUUyBzY29yaW5nLlxuICogRWFjaCBncm91cCBtYXBzIGEgY2Fub25pY2FsIHRlcm0gdG8gaXRzIHN5bm9ueW1zL3ZhcmlhdGlvbnMuXG4gKiBBbGwgdGVybXMgc2hvdWxkIGJlIGxvd2VyY2FzZS5cbiAqL1xuZXhwb3J0IGNvbnN0IFNZTk9OWU1fR1JPVVBTID0gW1xuICAgIC8vIFByb2dyYW1taW5nIExhbmd1YWdlc1xuICAgIHsgY2Fub25pY2FsOiBcImphdmFzY3JpcHRcIiwgc3lub255bXM6IFtcImpzXCIsIFwiZWNtYXNjcmlwdFwiLCBcImVzNlwiLCBcImVzMjAxNVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInR5cGVzY3JpcHRcIiwgc3lub255bXM6IFtcInRzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicHl0aG9uXCIsIHN5bm9ueW1zOiBbXCJweVwiLCBcInB5dGhvbjNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJnb2xhbmdcIiwgc3lub255bXM6IFtcImdvXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiYyNcIiwgc3lub255bXM6IFtcImNzaGFycFwiLCBcImMgc2hhcnBcIiwgXCJkb3RuZXRcIiwgXCIubmV0XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiYysrXCIsIHN5bm9ueW1zOiBbXCJjcHBcIiwgXCJjcGx1c3BsdXNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJydWJ5XCIsIHN5bm9ueW1zOiBbXCJyYlwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImtvdGxpblwiLCBzeW5vbnltczogW1wia3RcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJvYmplY3RpdmUtY1wiLCBzeW5vbnltczogW1wib2JqY1wiLCBcIm9iai1jXCJdIH0sXG4gICAgLy8gRnJvbnRlbmQgRnJhbWV3b3Jrc1xuICAgIHsgY2Fub25pY2FsOiBcInJlYWN0XCIsIHN5bm9ueW1zOiBbXCJyZWFjdGpzXCIsIFwicmVhY3QuanNcIiwgXCJyZWFjdCBqc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImFuZ3VsYXJcIiwgc3lub255bXM6IFtcImFuZ3VsYXJqc1wiLCBcImFuZ3VsYXIuanNcIiwgXCJhbmd1bGFyIGpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwidnVlXCIsIHN5bm9ueW1zOiBbXCJ2dWVqc1wiLCBcInZ1ZS5qc1wiLCBcInZ1ZSBqc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm5leHQuanNcIiwgc3lub255bXM6IFtcIm5leHRqc1wiLCBcIm5leHQganNcIiwgXCJuZXh0XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibnV4dFwiLCBzeW5vbnltczogW1wibnV4dGpzXCIsIFwibnV4dC5qc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInN2ZWx0ZVwiLCBzeW5vbnltczogW1wic3ZlbHRlanNcIiwgXCJzdmVsdGVraXRcIl0gfSxcbiAgICAvLyBCYWNrZW5kIEZyYW1ld29ya3NcbiAgICB7IGNhbm9uaWNhbDogXCJub2RlLmpzXCIsIHN5bm9ueW1zOiBbXCJub2RlanNcIiwgXCJub2RlIGpzXCIsIFwibm9kZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImV4cHJlc3NcIiwgc3lub255bXM6IFtcImV4cHJlc3Nqc1wiLCBcImV4cHJlc3MuanNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJkamFuZ29cIiwgc3lub255bXM6IFtcImRqYW5nbyByZXN0IGZyYW1ld29ya1wiLCBcImRyZlwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImZsYXNrXCIsIHN5bm9ueW1zOiBbXCJmbGFzayBweXRob25cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJzcHJpbmdcIiwgc3lub255bXM6IFtcInNwcmluZyBib290XCIsIFwic3ByaW5nYm9vdFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInJ1Ynkgb24gcmFpbHNcIiwgc3lub255bXM6IFtcInJhaWxzXCIsIFwicm9yXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmFzdGFwaVwiLCBzeW5vbnltczogW1wiZmFzdCBhcGlcIl0gfSxcbiAgICAvLyBEYXRhYmFzZXNcbiAgICB7IGNhbm9uaWNhbDogXCJwb3N0Z3Jlc3FsXCIsIHN5bm9ueW1zOiBbXCJwb3N0Z3Jlc1wiLCBcInBzcWxcIiwgXCJwZ1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm1vbmdvZGJcIiwgc3lub255bXM6IFtcIm1vbmdvXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibXlzcWxcIiwgc3lub255bXM6IFtcIm1hcmlhZGJcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJkeW5hbW9kYlwiLCBzeW5vbnltczogW1wiZHluYW1vIGRiXCIsIFwiZHluYW1vXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZWxhc3RpY3NlYXJjaFwiLCBzeW5vbnltczogW1wiZWxhc3RpYyBzZWFyY2hcIiwgXCJlbGFzdGljXCIsIFwiZXNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJyZWRpc1wiLCBzeW5vbnltczogW1wicmVkaXMgY2FjaGVcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJzcWxcIiwgc3lub255bXM6IFtcInN0cnVjdHVyZWQgcXVlcnkgbGFuZ3VhZ2VcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJub3NxbFwiLCBzeW5vbnltczogW1wibm8gc3FsXCIsIFwibm9uLXJlbGF0aW9uYWxcIl0gfSxcbiAgICAvLyBDbG91ZCAmIEluZnJhc3RydWN0dXJlXG4gICAgeyBjYW5vbmljYWw6IFwiYXdzXCIsIHN5bm9ueW1zOiBbXCJhbWF6b24gd2ViIHNlcnZpY2VzXCIsIFwiYW1hem9uIGNsb3VkXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZ2NwXCIsIHN5bm9ueW1zOiBbXCJnb29nbGUgY2xvdWRcIiwgXCJnb29nbGUgY2xvdWQgcGxhdGZvcm1cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJhenVyZVwiLCBzeW5vbnltczogW1wibWljcm9zb2Z0IGF6dXJlXCIsIFwibXMgYXp1cmVcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJkb2NrZXJcIiwgc3lub255bXM6IFtcImNvbnRhaW5lcml6YXRpb25cIiwgXCJjb250YWluZXJzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwia3ViZXJuZXRlc1wiLCBzeW5vbnltczogW1wiazhzXCIsIFwia3ViZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInRlcnJhZm9ybVwiLCBzeW5vbnltczogW1wiaW5mcmFzdHJ1Y3R1cmUgYXMgY29kZVwiLCBcImlhY1wiXSB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImNpL2NkXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcImNpY2RcIixcbiAgICAgICAgICAgIFwiY2kgY2RcIixcbiAgICAgICAgICAgIFwiY29udGludW91cyBpbnRlZ3JhdGlvblwiLFxuICAgICAgICAgICAgXCJjb250aW51b3VzIGRlcGxveW1lbnRcIixcbiAgICAgICAgICAgIFwiY29udGludW91cyBkZWxpdmVyeVwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZGV2b3BzXCIsIHN5bm9ueW1zOiBbXCJkZXYgb3BzXCIsIFwic2l0ZSByZWxpYWJpbGl0eVwiLCBcInNyZVwiXSB9LFxuICAgIC8vIFRvb2xzICYgUGxhdGZvcm1zXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZ2l0XCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJnaXRodWJcIiwgXCJnaXRsYWJcIiwgXCJiaXRidWNrZXRcIiwgXCJ2ZXJzaW9uIGNvbnRyb2xcIl0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJqaXJhXCIsIHN5bm9ueW1zOiBbXCJhdGxhc3NpYW4gamlyYVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImZpZ21hXCIsIHN5bm9ueW1zOiBbXCJmaWdtYSBkZXNpZ25cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJ3ZWJwYWNrXCIsIHN5bm9ueW1zOiBbXCJtb2R1bGUgYnVuZGxlclwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImdyYXBocWxcIiwgc3lub255bXM6IFtcImdyYXBoIHFsXCIsIFwiZ3FsXCJdIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwicmVzdCBhcGlcIixcbiAgICAgICAgc3lub255bXM6IFtcInJlc3RmdWxcIiwgXCJyZXN0ZnVsIGFwaVwiLCBcInJlc3RcIiwgXCJhcGlcIl0sXG4gICAgfSxcbiAgICAvLyBSb2xlIFRlcm1zXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZnJvbnRlbmRcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwiZnJvbnQtZW5kXCIsXG4gICAgICAgICAgICBcImZyb250IGVuZFwiLFxuICAgICAgICAgICAgXCJjbGllbnQtc2lkZVwiLFxuICAgICAgICAgICAgXCJjbGllbnQgc2lkZVwiLFxuICAgICAgICAgICAgXCJ1aSBkZXZlbG9wbWVudFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYmFja2VuZFwiLFxuICAgICAgICBzeW5vbnltczogW1wiYmFjay1lbmRcIiwgXCJiYWNrIGVuZFwiLCBcInNlcnZlci1zaWRlXCIsIFwic2VydmVyIHNpZGVcIl0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJmdWxsc3RhY2tcIiwgc3lub255bXM6IFtcImZ1bGwtc3RhY2tcIiwgXCJmdWxsIHN0YWNrXCJdIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwic29mdHdhcmUgZW5naW5lZXJcIixcbiAgICAgICAgc3lub255bXM6IFtcInNvZnR3YXJlIGRldmVsb3BlclwiLCBcInN3ZVwiLCBcImRldmVsb3BlclwiLCBcInByb2dyYW1tZXJcIiwgXCJjb2RlclwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImRhdGEgc2NpZW50aXN0XCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJkYXRhIHNjaWVuY2VcIiwgXCJtbCBlbmdpbmVlclwiLCBcIm1hY2hpbmUgbGVhcm5pbmcgZW5naW5lZXJcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJkYXRhIGVuZ2luZWVyXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJkYXRhIGVuZ2luZWVyaW5nXCIsIFwiZXRsIGRldmVsb3BlclwiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcInByb2R1Y3QgbWFuYWdlclwiLCBzeW5vbnltczogW1wicG1cIiwgXCJwcm9kdWN0IG93bmVyXCIsIFwicG9cIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJxYSBlbmdpbmVlclwiLFxuICAgICAgICBzeW5vbnltczogW1wicXVhbGl0eSBhc3N1cmFuY2VcIiwgXCJxYVwiLCBcInRlc3QgZW5naW5lZXJcIiwgXCJzZGV0XCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwidXggZGVzaWduZXJcIixcbiAgICAgICAgc3lub255bXM6IFtcInV4XCIsIFwidXNlciBleHBlcmllbmNlXCIsIFwidWkvdXhcIiwgXCJ1aSB1eFwiXSxcbiAgICB9LFxuICAgIC8vIE1ldGhvZG9sb2dpZXNcbiAgICB7IGNhbm9uaWNhbDogXCJhZ2lsZVwiLCBzeW5vbnltczogW1wic2NydW1cIiwgXCJrYW5iYW5cIiwgXCJzcHJpbnRcIiwgXCJzcHJpbnRzXCJdIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwidGRkXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJ0ZXN0IGRyaXZlbiBkZXZlbG9wbWVudFwiLCBcInRlc3QtZHJpdmVuIGRldmVsb3BtZW50XCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYmRkXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJiZWhhdmlvciBkcml2ZW4gZGV2ZWxvcG1lbnRcIiwgXCJiZWhhdmlvci1kcml2ZW4gZGV2ZWxvcG1lbnRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJtaWNyb3NlcnZpY2VzXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJtaWNybyBzZXJ2aWNlc1wiLCBcIm1pY3JvLXNlcnZpY2VzXCIsIFwic2VydmljZS1vcmllbnRlZFwiXSxcbiAgICB9LFxuICAgIC8vIFNvZnQgU2tpbGxzXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwibGVhZGVyc2hpcFwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJsZWRcIixcbiAgICAgICAgICAgIFwibWFuYWdlZFwiLFxuICAgICAgICAgICAgXCJkaXJlY3RlZFwiLFxuICAgICAgICAgICAgXCJzdXBlcnZpc2VkXCIsXG4gICAgICAgICAgICBcIm1lbnRvcmVkXCIsXG4gICAgICAgICAgICBcInRlYW0gbGVhZFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY29tbXVuaWNhdGlvblwiLFxuICAgICAgICBzeW5vbnltczogW1wiY29tbXVuaWNhdGVkXCIsIFwicHJlc2VudGVkXCIsIFwicHVibGljIHNwZWFraW5nXCIsIFwiaW50ZXJwZXJzb25hbFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImNvbGxhYm9yYXRpb25cIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwiY29sbGFib3JhdGVkXCIsXG4gICAgICAgICAgICBcInRlYW13b3JrXCIsXG4gICAgICAgICAgICBcImNyb3NzLWZ1bmN0aW9uYWxcIixcbiAgICAgICAgICAgIFwiY3Jvc3MgZnVuY3Rpb25hbFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwicHJvYmxlbSBzb2x2aW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJwcm9ibGVtLXNvbHZpbmdcIiwgXCJ0cm91Ymxlc2hvb3RpbmdcIiwgXCJkZWJ1Z2dpbmdcIiwgXCJhbmFseXRpY2FsXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwicHJvamVjdCBtYW5hZ2VtZW50XCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcInByb2plY3QtbWFuYWdlbWVudFwiLFxuICAgICAgICAgICAgXCJwcm9ncmFtIG1hbmFnZW1lbnRcIixcbiAgICAgICAgICAgIFwic3Rha2Vob2xkZXIgbWFuYWdlbWVudFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwidGltZSBtYW5hZ2VtZW50XCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJ0aW1lLW1hbmFnZW1lbnRcIiwgXCJwcmlvcml0aXphdGlvblwiLCBcIm9yZ2FuaXphdGlvblwiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm1lbnRvcmluZ1wiLCBzeW5vbnltczogW1wiY29hY2hpbmdcIiwgXCJ0cmFpbmluZ1wiLCBcIm9uYm9hcmRpbmdcIl0gfSxcbiAgICAvLyBEYXRhICYgTUxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJtYWNoaW5lIGxlYXJuaW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJtbFwiLCBcImRlZXAgbGVhcm5pbmdcIiwgXCJkbFwiLCBcImFpXCIsIFwiYXJ0aWZpY2lhbCBpbnRlbGxpZ2VuY2VcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJubHBcIixcbiAgICAgICAgc3lub255bXM6IFtcIm5hdHVyYWwgbGFuZ3VhZ2UgcHJvY2Vzc2luZ1wiLCBcInRleHQgcHJvY2Vzc2luZ1wiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImNvbXB1dGVyIHZpc2lvblwiLFxuICAgICAgICBzeW5vbnltczogW1wiY3ZcIiwgXCJpbWFnZSByZWNvZ25pdGlvblwiLCBcImltYWdlIHByb2Nlc3NpbmdcIl0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJ0ZW5zb3JmbG93XCIsIHN5bm9ueW1zOiBbXCJrZXJhc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInB5dG9yY2hcIiwgc3lub255bXM6IFtcInRvcmNoXCJdIH0sXG4gICAgLy8gVGVzdGluZ1xuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInVuaXQgdGVzdGluZ1wiLFxuICAgICAgICBzeW5vbnltczogW1widW5pdCB0ZXN0c1wiLCBcImplc3RcIiwgXCJtb2NoYVwiLCBcInZpdGVzdFwiLCBcInB5dGVzdFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImludGVncmF0aW9uIHRlc3RpbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwiaW50ZWdyYXRpb24gdGVzdHNcIixcbiAgICAgICAgICAgIFwiZTJlIHRlc3RpbmdcIixcbiAgICAgICAgICAgIFwiZW5kLXRvLWVuZCB0ZXN0aW5nXCIsXG4gICAgICAgICAgICBcImVuZCB0byBlbmRcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImF1dG9tYXRpb24gdGVzdGluZ1wiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJ0ZXN0IGF1dG9tYXRpb25cIixcbiAgICAgICAgICAgIFwiYXV0b21hdGVkIHRlc3RpbmdcIixcbiAgICAgICAgICAgIFwic2VsZW5pdW1cIixcbiAgICAgICAgICAgIFwiY3lwcmVzc1wiLFxuICAgICAgICAgICAgXCJwbGF5d3JpZ2h0XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAvLyBTZWN1cml0eVxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImN5YmVyc2VjdXJpdHlcIixcbiAgICAgICAgc3lub255bXM6IFtcImN5YmVyIHNlY3VyaXR5XCIsIFwiaW5mb3JtYXRpb24gc2VjdXJpdHlcIiwgXCJpbmZvc2VjXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYXV0aGVudGljYXRpb25cIixcbiAgICAgICAgc3lub255bXM6IFtcImF1dGhcIiwgXCJvYXV0aFwiLCBcInNzb1wiLCBcInNpbmdsZSBzaWduLW9uXCJdLFxuICAgIH0sXG4gICAgLy8gTW9iaWxlXG4gICAgeyBjYW5vbmljYWw6IFwiaW9zXCIsIHN5bm9ueW1zOiBbXCJzd2lmdFwiLCBcImFwcGxlIGRldmVsb3BtZW50XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiYW5kcm9pZFwiLCBzeW5vbnltczogW1wiYW5kcm9pZCBkZXZlbG9wbWVudFwiLCBcImtvdGxpbiBhbmRyb2lkXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicmVhY3QgbmF0aXZlXCIsIHN5bm9ueW1zOiBbXCJyZWFjdC1uYXRpdmVcIiwgXCJyblwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImZsdXR0ZXJcIiwgc3lub255bXM6IFtcImRhcnRcIl0gfSxcbiAgICAvLyBCdXNpbmVzcyAmIEFuYWx5dGljc1xuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImJ1c2luZXNzIGludGVsbGlnZW5jZVwiLFxuICAgICAgICBzeW5vbnltczogW1wiYmlcIiwgXCJ0YWJsZWF1XCIsIFwicG93ZXIgYmlcIiwgXCJsb29rZXJcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJkYXRhIGFuYWx5c2lzXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJkYXRhIGFuYWx5dGljc1wiLCBcImRhdGEgYW5hbHlzdFwiLCBcImFuYWx5dGljc1wiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImV0bFwiLFxuICAgICAgICBzeW5vbnltczogW1wiZXh0cmFjdCB0cmFuc2Zvcm0gbG9hZFwiLCBcImRhdGEgcGlwZWxpbmVcIiwgXCJkYXRhIHBpcGVsaW5lc1wiXSxcbiAgICB9LFxuXTtcbi8qKlxuICogQnVpbGRzIGEgbG9va3VwIG1hcCBmcm9tIGFueSB0ZXJtIChjYW5vbmljYWwgb3Igc3lub255bSkgdG9cbiAqIHRoZSBzZXQgb2YgYWxsIHRlcm1zIGluIHRoZSBzYW1lIGdyb3VwIChpbmNsdWRpbmcgdGhlIGNhbm9uaWNhbCBmb3JtKS5cbiAqIEFsbCBrZXlzIGFuZCB2YWx1ZXMgYXJlIGxvd2VyY2FzZS5cbiAqL1xuZnVuY3Rpb24gYnVpbGRTeW5vbnltTG9va3VwKCkge1xuICAgIGNvbnN0IGxvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIFNZTk9OWU1fR1JPVVBTKSB7XG4gICAgICAgIGNvbnN0IGFsbFRlcm1zID0gW2dyb3VwLmNhbm9uaWNhbCwgLi4uZ3JvdXAuc3lub255bXNdO1xuICAgICAgICBjb25zdCB0ZXJtU2V0ID0gbmV3IFNldChhbGxUZXJtcyk7XG4gICAgICAgIGZvciAoY29uc3QgdGVybSBvZiBhbGxUZXJtcykge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBsb29rdXAuZ2V0KHRlcm0pO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gTWVyZ2Ugc2V0cyBpZiB0ZXJtIGFwcGVhcnMgaW4gbXVsdGlwbGUgZ3JvdXBzXG4gICAgICAgICAgICAgICAgdGVybVNldC5mb3JFYWNoKCh0KSA9PiBleGlzdGluZy5hZGQodCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9va3VwLnNldCh0ZXJtLCBuZXcgU2V0KHRlcm1TZXQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbG9va3VwO1xufVxuY29uc3Qgc3lub255bUxvb2t1cCA9IGJ1aWxkU3lub255bUxvb2t1cCgpO1xuLyoqXG4gKiBSZXR1cm5zIGFsbCBzeW5vbnltcyBmb3IgYSBnaXZlbiB0ZXJtIChpbmNsdWRpbmcgdGhlIHRlcm0gaXRzZWxmKS5cbiAqIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgbm8gc3lub255bXMgYXJlIGZvdW5kLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3lub255bXModGVybSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0ZXJtLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGNvbnN0IGdyb3VwID0gc3lub255bUxvb2t1cC5nZXQobm9ybWFsaXplZCk7XG4gICAgaWYgKCFncm91cClcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGdyb3VwKTtcbn1cbi8qKlxuICogQ2hlY2tzIGlmIHR3byB0ZXJtcyBhcmUgc3lub255bXMgb2YgZWFjaCBvdGhlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyZVN5bm9ueW1zKHRlcm1BLCB0ZXJtQikge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRBID0gdGVybUEudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgY29uc3Qgbm9ybWFsaXplZEIgPSB0ZXJtQi50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICBpZiAobm9ybWFsaXplZEEgPT09IG5vcm1hbGl6ZWRCKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBncm91cCA9IHN5bm9ueW1Mb29rdXAuZ2V0KG5vcm1hbGl6ZWRBKTtcbiAgICByZXR1cm4gZ3JvdXAgPyBncm91cC5oYXMobm9ybWFsaXplZEIpIDogZmFsc2U7XG59XG4vKiogV2VpZ2h0IGFwcGxpZWQgdG8gc3lub255bSBtYXRjaGVzICh2cyAxLjAgZm9yIGV4YWN0IG1hdGNoZXMpICovXG5leHBvcnQgY29uc3QgU1lOT05ZTV9NQVRDSF9XRUlHSFQgPSAwLjg7XG4iLCJpbXBvcnQgeyBnZXRTeW5vbnltcywgU1lOT05ZTV9NQVRDSF9XRUlHSFQgfSBmcm9tIFwiLi9zeW5vbnltc1wiO1xuaW1wb3J0IHsgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGNvbnRhaW5zV29yZCwgY291bnRXb3JkT2NjdXJyZW5jZXMsIGdldFJlc3VtZVRleHQsIG5vcm1hbGl6ZVRleHQsIH0gZnJvbSBcIi4vdGV4dFwiO1xuY29uc3QgU1RPUF9XT1JEUyA9IG5ldyBTZXQoW1xuICAgIFwiYVwiLFxuICAgIFwiYW5cIixcbiAgICBcImFuZFwiLFxuICAgIFwiYXJlXCIsXG4gICAgXCJhc1wiLFxuICAgIFwiYXRcIixcbiAgICBcImJlXCIsXG4gICAgXCJieVwiLFxuICAgIFwiZm9yXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJpblwiLFxuICAgIFwib2ZcIixcbiAgICBcIm9uXCIsXG4gICAgXCJvclwiLFxuICAgIFwib3VyXCIsXG4gICAgXCJ0aGVcIixcbiAgICBcInRvXCIsXG4gICAgXCJ3ZVwiLFxuICAgIFwid2l0aFwiLFxuICAgIFwieW91XCIsXG4gICAgXCJ5b3VyXCIsXG5dKTtcbmZ1bmN0aW9uIHRva2VuaXplS2V5d29yZHModGV4dCkge1xuICAgIHJldHVybiBub3JtYWxpemVUZXh0KHRleHQpXG4gICAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAgIC5tYXAoKHRva2VuKSA9PiB0b2tlbi50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoKHRva2VuKSA9PiB0b2tlbi5sZW5ndGggPj0gMyAmJiAhU1RPUF9XT1JEUy5oYXModG9rZW4pKTtcbn1cbmZ1bmN0aW9uIHRvcFRva2Vucyh0ZXh0LCBsaW1pdCkge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2VuaXplS2V5d29yZHModGV4dCkpIHtcbiAgICAgICAgY291bnRzLnNldCh0b2tlbiwgKGNvdW50cy5nZXQodG9rZW4pID8/IDApICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKGNvdW50cy5lbnRyaWVzKCkpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSB8fCBhWzBdLmxvY2FsZUNvbXBhcmUoYlswXSkpXG4gICAgICAgIC5zbGljZSgwLCBsaW1pdClcbiAgICAgICAgLm1hcCgoW3Rva2VuXSkgPT4gdG9rZW4pO1xufVxuZnVuY3Rpb24gYnVpbGRLZXl3b3JkU2V0KGpvYikge1xuICAgIGNvbnN0IGtleXdvcmRzID0gW1xuICAgICAgICAuLi5qb2Iua2V5d29yZHMsXG4gICAgICAgIC4uLmpvYi5yZXF1aXJlbWVudHMuZmxhdE1hcCh0b2tlbml6ZUtleXdvcmRzKSxcbiAgICAgICAgLi4udG9wVG9rZW5zKGpvYi5kZXNjcmlwdGlvbiwgMTApLFxuICAgIF07XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IGtleXdvcmRzXG4gICAgICAgIC5tYXAoKGtleXdvcmQpID0+IG5vcm1hbGl6ZVRleHQoa2V5d29yZCkpXG4gICAgICAgIC5maWx0ZXIoKGtleXdvcmQpID0+IGtleXdvcmQubGVuZ3RoID49IDIgJiYgIVNUT1BfV09SRFMuaGFzKGtleXdvcmQpKTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KG5vcm1hbGl6ZWQpKS5zbGljZSgwLCAyNCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVLZXl3b3JkTWF0Y2goaW5wdXQpIHtcbiAgICBpZiAoIWlucHV0LmpvYikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBcImtleXdvcmRNYXRjaFwiLFxuICAgICAgICAgICAgbGFiZWw6IFwiS2V5d29yZCBtYXRjaFwiLFxuICAgICAgICAgICAgZWFybmVkOiAxOCxcbiAgICAgICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMua2V5d29yZE1hdGNoLFxuICAgICAgICAgICAgbm90ZXM6IFtcIk5vIGpvYiBkZXNjcmlwdGlvbiBzdXBwbGllZDsgbmV1dHJhbCBiYXNlbGluZS5cIl0sXG4gICAgICAgICAgICBldmlkZW5jZTogW1wiTm8gam9iIGRlc2NyaXB0aW9uIHN1cHBsaWVkLlwiXSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3Qga2V5d29yZHMgPSBidWlsZEtleXdvcmRTZXQoaW5wdXQuam9iKTtcbiAgICBpZiAoa2V5d29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IFwia2V5d29yZE1hdGNoXCIsXG4gICAgICAgICAgICBsYWJlbDogXCJLZXl3b3JkIG1hdGNoXCIsXG4gICAgICAgICAgICBlYXJuZWQ6IDE4LFxuICAgICAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5rZXl3b3JkTWF0Y2gsXG4gICAgICAgICAgICBub3RlczogW1wiSm9iIGRlc2NyaXB0aW9uIGhhcyBubyB1c2FibGUga2V5d29yZHM7IG5ldXRyYWwgYmFzZWxpbmUuXCJdLFxuICAgICAgICAgICAgZXZpZGVuY2U6IFtcIjAga2V5d29yZHMgYXZhaWxhYmxlLlwiXSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcmVzdW1lVGV4dCA9IG5vcm1hbGl6ZVRleHQoZ2V0UmVzdW1lVGV4dChpbnB1dC5wcm9maWxlLCBpbnB1dC5yYXdUZXh0KSk7XG4gICAgbGV0IHdlaWdodGVkSGl0cyA9IDA7XG4gICAgbGV0IGV4YWN0SGl0cyA9IDA7XG4gICAgbGV0IHN0dWZmaW5nID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XG4gICAgICAgIGNvbnN0IGZyZXF1ZW5jeSA9IGNvdW50V29yZE9jY3VycmVuY2VzKHJlc3VtZVRleHQsIGtleXdvcmQpO1xuICAgICAgICBpZiAoZnJlcXVlbmN5ID4gMTApXG4gICAgICAgICAgICBzdHVmZmluZyA9IHRydWU7XG4gICAgICAgIGlmIChmcmVxdWVuY3kgPiAwKSB7XG4gICAgICAgICAgICB3ZWlnaHRlZEhpdHMgKz0gMTtcbiAgICAgICAgICAgIGV4YWN0SGl0cyArPSAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3lub255bUhpdCA9IGdldFN5bm9ueW1zKGtleXdvcmQpLnNvbWUoKHN5bm9ueW0pID0+IHN5bm9ueW0gIT09IGtleXdvcmQgJiYgY29udGFpbnNXb3JkKHJlc3VtZVRleHQsIHN5bm9ueW0pKTtcbiAgICAgICAgaWYgKHN5bm9ueW1IaXQpXG4gICAgICAgICAgICB3ZWlnaHRlZEhpdHMgKz0gU1lOT05ZTV9NQVRDSF9XRUlHSFQ7XG4gICAgfVxuICAgIGNvbnN0IHJhd0Vhcm5lZCA9IE1hdGgucm91bmQoKHdlaWdodGVkSGl0cyAvIGtleXdvcmRzLmxlbmd0aCkgKiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5rZXl3b3JkTWF0Y2gpO1xuICAgIGNvbnN0IGVhcm5lZCA9IE1hdGgubWF4KDAsIHJhd0Vhcm5lZCAtIChzdHVmZmluZyA/IDIgOiAwKSk7XG4gICAgY29uc3Qgbm90ZXMgPSBleGFjdEhpdHMgPT09IGtleXdvcmRzLmxlbmd0aFxuICAgICAgICA/IFtdXG4gICAgICAgIDogW1wiQWRkIG5hdHVyYWwgbWVudGlvbnMgb2YgbWlzc2luZyB0YXJnZXQgam9iIGtleXdvcmRzLlwiXTtcbiAgICBpZiAoc3R1ZmZpbmcpXG4gICAgICAgIG5vdGVzLnB1c2goXCJLZXl3b3JkIHN0dWZmaW5nIGRldGVjdGVkOyByZXBlYXRlZCB0ZXJtcyB0b28gb2Z0ZW4uXCIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJrZXl3b3JkTWF0Y2hcIixcbiAgICAgICAgbGFiZWw6IFwiS2V5d29yZCBtYXRjaFwiLFxuICAgICAgICBlYXJuZWQsXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMua2V5d29yZE1hdGNoLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IFtcbiAgICAgICAgICAgIGAke2V4YWN0SGl0c30vJHtrZXl3b3Jkcy5sZW5ndGh9IGtleXdvcmRzIG1hdGNoZWRgLFxuICAgICAgICAgICAgYCR7d2VpZ2h0ZWRIaXRzLnRvRml4ZWQoMSl9LyR7a2V5d29yZHMubGVuZ3RofSB3ZWlnaHRlZCBrZXl3b3JkIGhpdHNgLFxuICAgICAgICBdLFxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0UmVzdW1lVGV4dCwgd29yZENvdW50IH0gZnJvbSBcIi4vdGV4dFwiO1xuZnVuY3Rpb24gcG9pbnRzRm9yV29yZENvdW50KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID49IDQwMCAmJiBjb3VudCA8PSA3MDApXG4gICAgICAgIHJldHVybiAxMDtcbiAgICBpZiAoKGNvdW50ID49IDMwMCAmJiBjb3VudCA8PSAzOTkpIHx8IChjb3VudCA+PSA3MDEgJiYgY291bnQgPD0gOTAwKSlcbiAgICAgICAgcmV0dXJuIDc7XG4gICAgaWYgKChjb3VudCA+PSAyMDAgJiYgY291bnQgPD0gMjk5KSB8fCAoY291bnQgPj0gOTAxICYmIGNvdW50IDw9IDExMDApKVxuICAgICAgICByZXR1cm4gNDtcbiAgICBpZiAoKGNvdW50ID49IDE1MCAmJiBjb3VudCA8PSAxOTkpIHx8IChjb3VudCA+PSAxMTAxICYmIGNvdW50IDw9IDE0MDApKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzY29yZUxlbmd0aChpbnB1dCkge1xuICAgIGNvbnN0IGNvdW50ID0gd29yZENvdW50KGdldFJlc3VtZVRleHQoaW5wdXQucHJvZmlsZSwgaW5wdXQucmF3VGV4dCkpO1xuICAgIGNvbnN0IGVhcm5lZCA9IHBvaW50c0ZvcldvcmRDb3VudChjb3VudCk7XG4gICAgY29uc3Qgbm90ZXMgPSBlYXJuZWQgPT09IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmxlbmd0aFxuICAgICAgICA/IFtdXG4gICAgICAgIDogW1wiUmVzdW1lIGxlbmd0aCBpcyBvdXRzaWRlIHRoZSA0MDAtNzAwIHdvcmQgdGFyZ2V0IGJhbmQuXCJdO1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJsZW5ndGhcIixcbiAgICAgICAgbGFiZWw6IFwiTGVuZ3RoXCIsXG4gICAgICAgIGVhcm5lZCxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5sZW5ndGgsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogW2Ake2NvdW50fSB3b3Jkc2BdLFxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBRVUFOVElGSUVEX1JFR0VYLCBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0SGlnaGxpZ2h0cyB9IGZyb20gXCIuL3RleHRcIjtcbmZ1bmN0aW9uIHBvaW50c0ZvclF1YW50aWZpZWRSZXN1bHRzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICByZXR1cm4gMDtcbiAgICBpZiAoY291bnQgPT09IDEpXG4gICAgICAgIHJldHVybiA2O1xuICAgIGlmIChjb3VudCA9PT0gMilcbiAgICAgICAgcmV0dXJuIDEyO1xuICAgIGlmIChjb3VudCA8PSA0KVxuICAgICAgICByZXR1cm4gMTY7XG4gICAgcmV0dXJuIDIwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlUXVhbnRpZmllZEFjaGlldmVtZW50cyhpbnB1dCkge1xuICAgIGNvbnN0IHRleHQgPSBnZXRIaWdobGlnaHRzKGlucHV0LnByb2ZpbGUpLmpvaW4oXCJcXG5cIik7XG4gICAgY29uc3QgbWF0Y2hlcyA9IEFycmF5LmZyb20odGV4dC5tYXRjaEFsbChRVUFOVElGSUVEX1JFR0VYKSwgKG1hdGNoKSA9PiBtYXRjaFswXSk7XG4gICAgY29uc3Qgbm90ZXMgPSBtYXRjaGVzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IFtcIkFkZCBtZXRyaWNzIHN1Y2ggYXMgcGVyY2VudGFnZXMsIHZvbHVtZSwgdGVhbSBzaXplLCBvciByZXZlbnVlLlwiXVxuICAgICAgICA6IFtdO1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJxdWFudGlmaWVkQWNoaWV2ZW1lbnRzXCIsXG4gICAgICAgIGxhYmVsOiBcIlF1YW50aWZpZWQgYWNoaWV2ZW1lbnRzXCIsXG4gICAgICAgIGVhcm5lZDogcG9pbnRzRm9yUXVhbnRpZmllZFJlc3VsdHMobWF0Y2hlcy5sZW5ndGgpLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLnF1YW50aWZpZWRBY2hpZXZlbWVudHMsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogW1xuICAgICAgICAgICAgYCR7bWF0Y2hlcy5sZW5ndGh9IHF1YW50aWZpZWQgcmVzdWx0KHMpYCxcbiAgICAgICAgICAgIC4uLm1hdGNoZXMuc2xpY2UoMCwgMyksXG4gICAgICAgIF0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVTZWN0aW9uQ29tcGxldGVuZXNzKGlucHV0KSB7XG4gICAgY29uc3QgeyBwcm9maWxlIH0gPSBpbnB1dDtcbiAgICBjb25zdCBub3RlcyA9IFtdO1xuICAgIGNvbnN0IGV2aWRlbmNlID0gW107XG4gICAgbGV0IGVhcm5lZCA9IDA7XG4gICAgbGV0IGNvbXBsZXRlU2VjdGlvbnMgPSAwO1xuICAgIGlmIChwcm9maWxlLmNvbnRhY3QubmFtZT8udHJpbSgpKSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIk1pc3NpbmcgY29udGFjdCBuYW1lLlwiKTtcbiAgICB9XG4gICAgaWYgKHByb2ZpbGUuY29udGFjdC5lbWFpbD8udHJpbSgpKSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIk1pc3NpbmcgY29udGFjdCBlbWFpbC5cIik7XG4gICAgfVxuICAgIGNvbnN0IHN1bW1hcnlMZW5ndGggPSBwcm9maWxlLnN1bW1hcnk/LnRyaW0oKS5sZW5ndGggPz8gMDtcbiAgICBpZiAoc3VtbWFyeUxlbmd0aCA+PSA1MCAmJiBzdW1tYXJ5TGVuZ3RoIDw9IDUwMCkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIlN1bW1hcnkgc2hvdWxkIGJlIGJldHdlZW4gNTAgYW5kIDUwMCBjaGFyYWN0ZXJzLlwiKTtcbiAgICB9XG4gICAgY29uc3QgaGFzRXhwZXJpZW5jZSA9IHByb2ZpbGUuZXhwZXJpZW5jZXMuc29tZSgoZXhwZXJpZW5jZSkgPT4gZXhwZXJpZW5jZS50aXRsZS50cmltKCkgJiZcbiAgICAgICAgZXhwZXJpZW5jZS5jb21wYW55LnRyaW0oKSAmJlxuICAgICAgICBleHBlcmllbmNlLnN0YXJ0RGF0ZS50cmltKCkpO1xuICAgIGlmIChoYXNFeHBlcmllbmNlKSB7XG4gICAgICAgIGVhcm5lZCArPSAyO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIGF0IGxlYXN0IG9uZSByb2xlIHdpdGggdGl0bGUsIGNvbXBhbnksIGFuZCBzdGFydCBkYXRlLlwiKTtcbiAgICB9XG4gICAgaWYgKHByb2ZpbGUuZWR1Y2F0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYXQgbGVhc3Qgb25lIGVkdWNhdGlvbiBlbnRyeS5cIik7XG4gICAgfVxuICAgIGlmIChwcm9maWxlLnNraWxscy5sZW5ndGggPj0gMykge1xuICAgICAgICBlYXJuZWQgKz0gMjtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIGlmIChwcm9maWxlLnNraWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIGF0IGxlYXN0IHRocmVlIHNraWxscy5cIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIGEgc2tpbGxzIHNlY3Rpb24uXCIpO1xuICAgIH1cbiAgICBjb25zdCBoYXNIaWdobGlnaHQgPSBwcm9maWxlLmV4cGVyaWVuY2VzLnNvbWUoKGV4cGVyaWVuY2UpID0+IGV4cGVyaWVuY2UuaGlnaGxpZ2h0cy5sZW5ndGggPiAwKTtcbiAgICBpZiAoaGFzSGlnaGxpZ2h0KSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIGFjaGlldmVtZW50IGhpZ2hsaWdodHMgdG8gZXhwZXJpZW5jZS5cIik7XG4gICAgfVxuICAgIGNvbnN0IGhhc1NlY29uZGFyeUNvbnRhY3QgPSBCb29sZWFuKHByb2ZpbGUuY29udGFjdC5waG9uZT8udHJpbSgpIHx8XG4gICAgICAgIHByb2ZpbGUuY29udGFjdC5saW5rZWRpbj8udHJpbSgpIHx8XG4gICAgICAgIHByb2ZpbGUuY29udGFjdC5sb2NhdGlvbj8udHJpbSgpKTtcbiAgICBpZiAoaGFzU2Vjb25kYXJ5Q29udGFjdCkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBwaG9uZSwgTGlua2VkSW4sIG9yIGxvY2F0aW9uLlwiKTtcbiAgICB9XG4gICAgaWYgKHByb2ZpbGUuY29udGFjdC5uYW1lPy50cmltKCkgJiYgcHJvZmlsZS5jb250YWN0LmVtYWlsPy50cmltKCkpIHtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBldmlkZW5jZS5wdXNoKGAke2NvbXBsZXRlU2VjdGlvbnN9Lzcgc2VjdGlvbnMgY29tcGxldGVgKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwic2VjdGlvbkNvbXBsZXRlbmVzc1wiLFxuICAgICAgICBsYWJlbDogXCJTZWN0aW9uIGNvbXBsZXRlbmVzc1wiLFxuICAgICAgICBlYXJuZWQ6IE1hdGgubWluKGVhcm5lZCwgU1VCX1NDT1JFX01BWF9QT0lOVFMuc2VjdGlvbkNvbXBsZXRlbmVzcyksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMuc2VjdGlvbkNvbXBsZXRlbmVzcyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlLFxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBBQ1RJT05fVkVSQlMsIFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRIaWdobGlnaHRzLCBub3JtYWxpemVUZXh0IH0gZnJvbSBcIi4vdGV4dFwiO1xuY29uc3QgUkVQRUFURURfV09SRF9FWENFUFRJT05TID0gbmV3IFNldChbXCJoYWQgaGFkXCIsIFwidGhhdCB0aGF0XCJdKTtcbmNvbnN0IEFDUk9OWU1TID0gbmV3IFNldChbXCJBUElcIiwgXCJBV1NcIiwgXCJDU1NcIiwgXCJHQ1BcIiwgXCJIVE1MXCIsIFwiU1FMXCJdKTtcbmZ1bmN0aW9uIGhhc1ZlcmJMaWtlVG9rZW4odGV4dCkge1xuICAgIGNvbnN0IHdvcmRzID0gbm9ybWFsaXplVGV4dCh0ZXh0KS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgICByZXR1cm4gd29yZHMuc29tZSgod29yZCkgPT4gQUNUSU9OX1ZFUkJTLmluY2x1ZGVzKHdvcmQpIHx8XG4gICAgICAgIC8oPzplZHxpbmd8cykkLy50ZXN0KHdvcmQpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzY29yZVNwZWxsaW5nR3JhbW1hcihpbnB1dCkge1xuICAgIGNvbnN0IGhpZ2hsaWdodHMgPSBnZXRIaWdobGlnaHRzKGlucHV0LnByb2ZpbGUpO1xuICAgIGNvbnN0IHRleHQgPSBoaWdobGlnaHRzLmpvaW4oXCJcXG5cIik7XG4gICAgY29uc3Qgbm90ZXMgPSBbXTtcbiAgICBjb25zdCBldmlkZW5jZSA9IFtdO1xuICAgIGxldCBkZWR1Y3Rpb25zID0gMDtcbiAgICBjb25zdCByZXBlYXRlZCA9IEFycmF5LmZyb20odGV4dC5tYXRjaEFsbCgvXFxiKFxcdyspXFxzK1xcMVxcYi9naSksIChtYXRjaCkgPT4gbWF0Y2hbMF0pLmZpbHRlcigobWF0Y2gpID0+ICFSRVBFQVRFRF9XT1JEX0VYQ0VQVElPTlMuaGFzKG1hdGNoLnRvTG93ZXJDYXNlKCkpKTtcbiAgICBpZiAocmVwZWF0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5taW4oMiwgcmVwZWF0ZWQubGVuZ3RoKTtcbiAgICAgICAgZGVkdWN0aW9ucyArPSBwZW5hbHR5O1xuICAgICAgICBub3Rlcy5wdXNoKFwiUmVwZWF0ZWQgYWRqYWNlbnQgd29yZHMgZGV0ZWN0ZWQuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGBSZXBlYXRlZCB3b3JkOiAke3JlcGVhdGVkWzBdfWApO1xuICAgIH1cbiAgICBpZiAoLyAgKy8udGVzdCh0ZXh0KSkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDE7XG4gICAgICAgIG5vdGVzLnB1c2goXCJNdWx0aXBsZSBzcGFjZXMgYmV0d2VlbiB3b3JkcyBkZXRlY3RlZC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJNdWx0aXBsZSBzcGFjZXMgZm91bmQuXCIpO1xuICAgIH1cbiAgICBjb25zdCBsb3dlcmNhc2VTdGFydHMgPSBoaWdobGlnaHRzLmZpbHRlcigoaGlnaGxpZ2h0KSA9PiAvXlthLXpdLy50ZXN0KGhpZ2hsaWdodC50cmltKCkpKTtcbiAgICBpZiAobG93ZXJjYXNlU3RhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGVuYWx0eSA9IE1hdGgubWluKDMsIGxvd2VyY2FzZVN0YXJ0cy5sZW5ndGgpO1xuICAgICAgICBkZWR1Y3Rpb25zICs9IHBlbmFsdHk7XG4gICAgICAgIG5vdGVzLnB1c2goXCJTb21lIGhpZ2hsaWdodHMgc3RhcnQgd2l0aCBsb3dlcmNhc2UgbGV0dGVycy5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYExvd2VyY2FzZSBzdGFydDogJHtsb3dlcmNhc2VTdGFydHNbMF19YCk7XG4gICAgfVxuICAgIGNvbnN0IGZyYWdtZW50cyA9IGhpZ2hsaWdodHMuZmlsdGVyKChoaWdobGlnaHQpID0+IGhpZ2hsaWdodC5sZW5ndGggPiA0MCAmJiAhaGFzVmVyYkxpa2VUb2tlbihoaWdobGlnaHQpKTtcbiAgICBpZiAoZnJhZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGVuYWx0eSA9IE1hdGgubWluKDIsIGZyYWdtZW50cy5sZW5ndGgpO1xuICAgICAgICBkZWR1Y3Rpb25zICs9IHBlbmFsdHk7XG4gICAgICAgIG5vdGVzLnB1c2goXCJTb21lIGxvbmcgaGlnaGxpZ2h0cyBtYXkgcmVhZCBsaWtlIHNlbnRlbmNlIGZyYWdtZW50cy5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYFBvc3NpYmxlIGZyYWdtZW50OiAke2ZyYWdtZW50c1swXX1gKTtcbiAgICB9XG4gICAgY29uc3QgcHVuY3R1YXRpb25FbmRpbmdzID0gaGlnaGxpZ2h0cy5maWx0ZXIoKGhpZ2hsaWdodCkgPT4gL1xcLiQvLnRlc3QoaGlnaGxpZ2h0LnRyaW0oKSkpLmxlbmd0aDtcbiAgICBpZiAoaGlnaGxpZ2h0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IHJhdGUgPSBwdW5jdHVhdGlvbkVuZGluZ3MgLyBoaWdobGlnaHRzLmxlbmd0aDtcbiAgICAgICAgaWYgKHJhdGUgPiAwLjMgJiYgcmF0ZSA8IDAuNykge1xuICAgICAgICAgICAgZGVkdWN0aW9ucyArPSAxO1xuICAgICAgICAgICAgbm90ZXMucHVzaChcIlRyYWlsaW5nIHB1bmN0dWF0aW9uIGlzIGluY29uc2lzdGVudCBhY3Jvc3MgaGlnaGxpZ2h0cy5cIik7XG4gICAgICAgICAgICBldmlkZW5jZS5wdXNoKGAke3B1bmN0dWF0aW9uRW5kaW5nc30vJHtoaWdobGlnaHRzLmxlbmd0aH0gaGlnaGxpZ2h0cyBlbmQgd2l0aCBwZXJpb2RzLmApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFsbENhcHMgPSBBcnJheS5mcm9tKHRleHQubWF0Y2hBbGwoL1xcYltBLVpdezQsfVxcYi9nKSwgKG1hdGNoKSA9PiBtYXRjaFswXSkuZmlsdGVyKCh3b3JkKSA9PiAhQUNST05ZTVMuaGFzKHdvcmQpKTtcbiAgICBpZiAoYWxsQ2Fwcy5sZW5ndGggPiA1KSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMTtcbiAgICAgICAgbm90ZXMucHVzaChcIkV4Y2Vzc2l2ZSBhbGwtY2FwcyB3b3JkcyBkZXRlY3RlZC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYEFsbC1jYXBzIHdvcmRzOiAke2FsbENhcHMuc2xpY2UoMCwgMykuam9pbihcIiwgXCIpfWApO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwic3BlbGxpbmdHcmFtbWFyXCIsXG4gICAgICAgIGxhYmVsOiBcIlNwZWxsaW5nIGFuZCBncmFtbWFyXCIsXG4gICAgICAgIGVhcm5lZDogTWF0aC5tYXgoMCwgU1VCX1NDT1JFX01BWF9QT0lOVFMuc3BlbGxpbmdHcmFtbWFyIC0gZGVkdWN0aW9ucyksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMuc3BlbGxpbmdHcmFtbWFyLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IGV2aWRlbmNlLmxlbmd0aCA+IDAgPyBldmlkZW5jZSA6IFtcIk5vIGhldXJpc3RpYyBpc3N1ZXMgZGV0ZWN0ZWQuXCJdLFxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBub3dJc28gfSBmcm9tIFwiLi4vZm9ybWF0dGVyc1wiO1xuaW1wb3J0IHsgc2NvcmVBY3Rpb25WZXJicyB9IGZyb20gXCIuL2FjdGlvbi12ZXJic1wiO1xuaW1wb3J0IHsgc2NvcmVBdHNGcmllbmRsaW5lc3MgfSBmcm9tIFwiLi9hdHMtZnJpZW5kbGluZXNzXCI7XG5pbXBvcnQgeyBzY29yZUtleXdvcmRNYXRjaCB9IGZyb20gXCIuL2tleXdvcmQtbWF0Y2hcIjtcbmltcG9ydCB7IHNjb3JlTGVuZ3RoIH0gZnJvbSBcIi4vbGVuZ3RoXCI7XG5pbXBvcnQgeyBzY29yZVF1YW50aWZpZWRBY2hpZXZlbWVudHMgfSBmcm9tIFwiLi9xdWFudGlmaWVkLWFjaGlldmVtZW50c1wiO1xuaW1wb3J0IHsgc2NvcmVTZWN0aW9uQ29tcGxldGVuZXNzIH0gZnJvbSBcIi4vc2VjdGlvbi1jb21wbGV0ZW5lc3NcIjtcbmltcG9ydCB7IHNjb3JlU3BlbGxpbmdHcmFtbWFyIH0gZnJvbSBcIi4vc3BlbGxpbmctZ3JhbW1hclwiO1xuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlUmVzdW1lKGlucHV0KSB7XG4gICAgY29uc3Qgc3ViU2NvcmVzID0ge1xuICAgICAgICBzZWN0aW9uQ29tcGxldGVuZXNzOiBzY29yZVNlY3Rpb25Db21wbGV0ZW5lc3MoaW5wdXQpLFxuICAgICAgICBhY3Rpb25WZXJiczogc2NvcmVBY3Rpb25WZXJicyhpbnB1dCksXG4gICAgICAgIHF1YW50aWZpZWRBY2hpZXZlbWVudHM6IHNjb3JlUXVhbnRpZmllZEFjaGlldmVtZW50cyhpbnB1dCksXG4gICAgICAgIGtleXdvcmRNYXRjaDogc2NvcmVLZXl3b3JkTWF0Y2goaW5wdXQpLFxuICAgICAgICBsZW5ndGg6IHNjb3JlTGVuZ3RoKGlucHV0KSxcbiAgICAgICAgc3BlbGxpbmdHcmFtbWFyOiBzY29yZVNwZWxsaW5nR3JhbW1hcihpbnB1dCksXG4gICAgICAgIGF0c0ZyaWVuZGxpbmVzczogc2NvcmVBdHNGcmllbmRsaW5lc3MoaW5wdXQpLFxuICAgIH07XG4gICAgY29uc3Qgb3ZlcmFsbCA9IE9iamVjdC52YWx1ZXMoc3ViU2NvcmVzKS5yZWR1Y2UoKHN1bSwgc3ViU2NvcmUpID0+IHN1bSArIHN1YlNjb3JlLmVhcm5lZCwgMCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb3ZlcmFsbDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKG92ZXJhbGwpKSksXG4gICAgICAgIHN1YlNjb3JlcyxcbiAgICAgICAgZ2VuZXJhdGVkQXQ6IG5vd0lzbygpLFxuICAgIH07XG59XG5leHBvcnQgeyBzY29yZUFjdGlvblZlcmJzIH0gZnJvbSBcIi4vYWN0aW9uLXZlcmJzXCI7XG5leHBvcnQgeyBzY29yZUF0c0ZyaWVuZGxpbmVzcyB9IGZyb20gXCIuL2F0cy1mcmllbmRsaW5lc3NcIjtcbmV4cG9ydCB7IHNjb3JlS2V5d29yZE1hdGNoIH0gZnJvbSBcIi4va2V5d29yZC1tYXRjaFwiO1xuZXhwb3J0IHsgc2NvcmVMZW5ndGggfSBmcm9tIFwiLi9sZW5ndGhcIjtcbmV4cG9ydCB7IHNjb3JlUXVhbnRpZmllZEFjaGlldmVtZW50cyB9IGZyb20gXCIuL3F1YW50aWZpZWQtYWNoaWV2ZW1lbnRzXCI7XG5leHBvcnQgeyBzY29yZVNlY3Rpb25Db21wbGV0ZW5lc3MgfSBmcm9tIFwiLi9zZWN0aW9uLWNvbXBsZXRlbmVzc1wiO1xuZXhwb3J0IHsgc2NvcmVTcGVsbGluZ0dyYW1tYXIgfSBmcm9tIFwiLi9zcGVsbGluZy1ncmFtbWFyXCI7XG4iLCJpbXBvcnQgeyBzY29yZVJlc3VtZSB9IGZyb20gXCJAc2xvdGhpbmcvc2hhcmVkL3Njb3JpbmdcIjtcbmV4cG9ydCBmdW5jdGlvbiBzY3JhcGVkSm9iVG9Kb2JEZXNjcmlwdGlvbihqb2IsIGNyZWF0ZWRBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBqb2Iuc291cmNlSm9iSWQgfHwgam9iLnVybCxcbiAgICAgICAgdGl0bGU6IGpvYi50aXRsZSxcbiAgICAgICAgY29tcGFueTogam9iLmNvbXBhbnksXG4gICAgICAgIGxvY2F0aW9uOiBqb2IubG9jYXRpb24sXG4gICAgICAgIHR5cGU6IGpvYi50eXBlLFxuICAgICAgICByZW1vdGU6IGpvYi5yZW1vdGUsXG4gICAgICAgIHNhbGFyeTogam9iLnNhbGFyeSxcbiAgICAgICAgZGVzY3JpcHRpb246IGpvYi5kZXNjcmlwdGlvbixcbiAgICAgICAgcmVxdWlyZW1lbnRzOiBqb2IucmVxdWlyZW1lbnRzIHx8IFtdLFxuICAgICAgICByZXNwb25zaWJpbGl0aWVzOiBqb2IucmVzcG9uc2liaWxpdGllcyB8fCBbXSxcbiAgICAgICAga2V5d29yZHM6IGpvYi5rZXl3b3JkcyB8fCBbXSxcbiAgICAgICAgdXJsOiBqb2IudXJsLFxuICAgICAgICBkZWFkbGluZTogam9iLmRlYWRsaW5lLFxuICAgICAgICBjcmVhdGVkQXQsXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlSm9iTWF0Y2hTY29yZShwcm9maWxlLCBqb2IpIHtcbiAgICBpZiAoIXByb2ZpbGUgfHwgIWpvYilcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHNjb3JlUmVzdW1lKHtcbiAgICAgICAgcHJvZmlsZSxcbiAgICAgICAgcmF3VGV4dDogcHJvZmlsZS5yYXdUZXh0LFxuICAgICAgICBqb2I6IHNjcmFwZWRKb2JUb0pvYkRlc2NyaXB0aW9uKGpvYiksXG4gICAgfSk7XG59XG4iLCJjb25zdCBESVNNSVNTRURfRE9NQUlOU19LRVkgPSBcInNsb3RoaW5nOnNpZGViYXI6ZGlzbWlzc2VkRG9tYWluc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVNpZGViYXJEb21haW4oaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gaG9zdG5hbWVcbiAgICAgICAgLnRyaW0oKVxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgvXnd3d1xcLi8sIFwiXCIpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpc21pc3NlZFNpZGViYXJEb21haW5zKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoRElTTUlTU0VEX0RPTUFJTlNfS0VZLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJlc3VsdFtESVNNSVNTRURfRE9NQUlOU19LRVldO1xuICAgICAgICAgICAgcmVzb2x2ZShBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlLmZpbHRlcihpc1N0cmluZykgOiBbXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzU2lkZWJhckRpc21pc3NlZEZvckRvbWFpbihob3N0bmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkge1xuICAgIGNvbnN0IGRvbWFpbiA9IG5vcm1hbGl6ZVNpZGViYXJEb21haW4oaG9zdG5hbWUpO1xuICAgIGNvbnN0IGRpc21pc3NlZERvbWFpbnMgPSBhd2FpdCBnZXREaXNtaXNzZWRTaWRlYmFyRG9tYWlucygpO1xuICAgIHJldHVybiBkaXNtaXNzZWREb21haW5zLmluY2x1ZGVzKGRvbWFpbik7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlzbWlzc1NpZGViYXJGb3JEb21haW4oaG9zdG5hbWUgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpIHtcbiAgICBjb25zdCBkb21haW4gPSBub3JtYWxpemVTaWRlYmFyRG9tYWluKGhvc3RuYW1lKTtcbiAgICBjb25zdCBkaXNtaXNzZWREb21haW5zID0gYXdhaXQgZ2V0RGlzbWlzc2VkU2lkZWJhckRvbWFpbnMoKTtcbiAgICBjb25zdCBuZXh0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5kaXNtaXNzZWREb21haW5zLCBkb21haW5dKSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtESVNNSVNTRURfRE9NQUlOU19LRVldOiBuZXh0IH0sIHJlc29sdmUpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiO1xufVxuIiwiZXhwb3J0IGNvbnN0IFNJREVCQVJfU1RZTEVTID0gYFxuOmhvc3Qge1xuICBhbGw6IGluaXRpYWw7XG4gIGNvbG9yLXNjaGVtZTogbGlnaHQ7XG4gIGZvbnQtZmFtaWx5OiBJbnRlciwgdWktc2Fucy1zZXJpZiwgc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcbn1cblxuKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5zbG90aGluZy1zaWRlYmFyIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDk2cHg7XG4gIHJpZ2h0OiAwO1xuICB6LWluZGV4OiAyMTQ3NDgzMDAwO1xuICBjb2xvcjogIzE3MjAyNjtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG59XG5cbi5zbG90aGluZy1zaWRlYmFyW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4ucmFpbCxcbi5wYW5lbCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjMsIDMyLCAzOCwgMC4xNCk7XG4gIGJveC1zaGFkb3c6IDAgMTZweCA0MnB4IHJnYmEoMjMsIDMyLCAzOCwgMC4yMik7XG59XG5cbi5yYWlsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiA4cHg7XG4gIHdpZHRoOiA0NnB4O1xuICBtaW4taGVpZ2h0OiAxNDhweDtcbiAgcGFkZGluZzogMTBweCA3cHg7XG4gIGJvcmRlci1yaWdodDogMDtcbiAgYm9yZGVyLXJhZGl1czogOHB4IDAgMCA4cHg7XG4gIGJhY2tncm91bmQ6ICNmZmZmZmY7XG4gIHdyaXRpbmctbW9kZTogdmVydGljYWwtcmw7XG4gIHRleHQtb3JpZW50YXRpb246IG1peGVkO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5yYWlsLXNjb3JlIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtaW4td2lkdGg6IDMwcHg7XG4gIG1pbi1oZWlnaHQ6IDMwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICBiYWNrZ3JvdW5kOiAjZGZmNmU5O1xuICBjb2xvcjogIzEzNWQzYjtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogODAwO1xuICB3cml0aW5nLW1vZGU6IGhvcml6b250YWwtdGI7XG59XG5cbi5yYWlsLWxhYmVsIHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogODAwO1xuICBsZXR0ZXItc3BhY2luZzogMDtcbn1cblxuLnBhbmVsIHtcbiAgd2lkdGg6IG1pbigzNjBweCwgY2FsYygxMDB2dyAtIDI4cHgpKTtcbiAgbWF4LWhlaWdodDogbWluKDcyMHB4LCBjYWxjKDEwMHZoIC0gMTI4cHgpKTtcbiAgb3ZlcmZsb3c6IGF1dG87XG4gIGJvcmRlci1yaWdodDogMDtcbiAgYm9yZGVyLXJhZGl1czogOHB4IDAgMCA4cHg7XG4gIGJhY2tncm91bmQ6ICNmYmZjZmI7XG59XG5cbi5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBnYXA6IDEycHg7XG4gIHBhZGRpbmc6IDE2cHggMTZweCAxMnB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgyMywgMzIsIDM4LCAwLjEpO1xuICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xufVxuXG4uYnJhbmQge1xuICBtYXJnaW46IDAgMCA4cHg7XG4gIGNvbG9yOiAjMWY2ZjQ2O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4udGl0bGUge1xuICBtYXJnaW46IDA7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgbGluZS1oZWlnaHQ6IDEuMjU7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xufVxuXG4uY29tcGFueSB7XG4gIG1hcmdpbjogNHB4IDAgMDtcbiAgY29sb3I6ICM1MzYwNjg7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgbGluZS1oZWlnaHQ6IDEuMzU7XG4gIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xufVxuXG4uaWNvbi1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDZweDtcbn1cblxuYnV0dG9uIHtcbiAgYm9yZGVyOiAwO1xuICBmb250OiBpbmhlcml0O1xufVxuXG5idXR0b246Zm9jdXMtdmlzaWJsZSxcbmlucHV0OmZvY3VzLXZpc2libGUge1xuICBvdXRsaW5lOiAycHggc29saWQgIzJmOGY1YjtcbiAgb3V0bGluZS1vZmZzZXQ6IDJweDtcbn1cblxuLmljb24tYnV0dG9uIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB3aWR0aDogMzBweDtcbiAgaGVpZ2h0OiAzMHB4O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGJhY2tncm91bmQ6ICNlZWYzZjA7XG4gIGNvbG9yOiAjMjQzMDM4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5pY29uLWJ1dHRvbjpob3ZlciB7XG4gIGJhY2tncm91bmQ6ICNkZGU4ZTE7XG59XG5cbi5ib2R5IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ2FwOiAxMnB4O1xuICBwYWRkaW5nOiAxNHB4IDE2cHggMTZweDtcbn1cblxuLnNjb3JlLWNhcmQsXG4uYWN0aW9ucyxcbi5hbnN3ZXItYmFuayxcbi5zdGF0dXMtY2FyZCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjMsIDMyLCAzOCwgMC4xKTtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xufVxuXG4uc2NvcmUtY2FyZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogODRweCAxZnI7XG4gIGdhcDogMTJweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogMTJweDtcbn1cblxuLnNjb3JlLW51bWJlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB3aWR0aDogNzJweDtcbiAgaGVpZ2h0OiA3MnB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KCMyZjhmNWIgdmFyKC0tc2NvcmUtZGVnKSwgI2U3ZWNlOSAwKTtcbn1cblxuLnNjb3JlLW51bWJlciBzcGFuIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHdpZHRoOiA1NnB4O1xuICBoZWlnaHQ6IDU2cHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZDogI2ZmZmZmZjtcbiAgY29sb3I6ICMxMzVkM2I7XG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgZm9udC13ZWlnaHQ6IDkwMDtcbn1cblxuLnNjb3JlLWxhYmVsIHtcbiAgbWFyZ2luOiAwO1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbi5zY29yZS1ub3RlLFxuLm11dGVkLFxuLnJlc3VsdC1tZXRhIHtcbiAgY29sb3I6ICM2MzcxN2E7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGluZS1oZWlnaHQ6IDEuNDtcbn1cblxuLmFjdGlvbnMge1xuICBkaXNwbGF5OiBncmlkO1xuICBnYXA6IDhweDtcbiAgcGFkZGluZzogMTBweDtcbn1cblxuLmFjdGlvbi1idXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHdpZHRoOiAxMDAlO1xuICBtaW4taGVpZ2h0OiA0MHB4O1xuICBwYWRkaW5nOiA5cHggMTFweDtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBiYWNrZ3JvdW5kOiAjZWVmM2YwO1xuICBjb2xvcjogIzE3MjAyNjtcbiAgZm9udC13ZWlnaHQ6IDc1MDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYWN0aW9uLWJ1dHRvbi5wcmltYXJ5IHtcbiAgYmFja2dyb3VuZDogIzFmNmY0NjtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG5cbi5hY3Rpb24tYnV0dG9uOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgZmlsdGVyOiBicmlnaHRuZXNzKDAuOTYpO1xufVxuXG4uYWN0aW9uLWJ1dHRvbjpkaXNhYmxlZCB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIG9wYWNpdHk6IDAuNjI7XG59XG5cbi5zdGF0dXMtY2FyZCB7XG4gIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBsaW5lLWhlaWdodDogMS40O1xufVxuXG4uc3RhdHVzLWNhcmQuc3VjY2VzcyB7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgzMSwgMTExLCA3MCwgMC4zKTtcbiAgY29sb3I6ICMxMzVkM2I7XG4gIGJhY2tncm91bmQ6ICNlZWZhZjM7XG59XG5cbi5zdGF0dXMtY2FyZC5lcnJvciB7XG4gIGJvcmRlci1jb2xvcjogcmdiYSgxNzYsIDUyLCA1MiwgMC4zKTtcbiAgY29sb3I6ICM4ZjI0MjQ7XG4gIGJhY2tncm91bmQ6ICNmZmYyZjI7XG59XG5cbi5hbnN3ZXItYmFuayB7XG4gIHBhZGRpbmc6IDEycHg7XG59XG5cbi5zZWN0aW9uLXRpdGxlIHtcbiAgbWFyZ2luOiAwIDAgOHB4O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiA4NTA7XG59XG5cbi5zZWFyY2gtcm93IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgYXV0bztcbiAgZ2FwOiA4cHg7XG59XG5cbi5zZWFyY2gtcm93IGlucHV0IHtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi13aWR0aDogMDtcbiAgaGVpZ2h0OiAzNHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIzLCAzMiwgMzgsIDAuMTYpO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIHBhZGRpbmc6IDAgMTBweDtcbiAgY29sb3I6ICMxNzIwMjY7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIGZvbnQtc2l6ZTogMTNweDtcbn1cblxuLnNlYXJjaC1yb3cgYnV0dG9uLFxuLnNtYWxsLWJ1dHRvbiB7XG4gIG1pbi1oZWlnaHQ6IDM0cHg7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgcGFkZGluZzogMCAxMHB4O1xuICBiYWNrZ3JvdW5kOiAjMjQzMDM4O1xuICBjb2xvcjogI2ZmZmZmZjtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ucmVzdWx0cyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdhcDogOHB4O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4ucmVzdWx0IHtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMjMsIDMyLCAzOCwgMC4xKTtcbiAgcGFkZGluZy10b3A6IDhweDtcbn1cblxuLnJlc3VsdC1xdWVzdGlvbixcbi5yZXN1bHQtYW5zd2VyIHtcbiAgbWFyZ2luOiAwO1xuICBmb250LXNpemU6IDEycHg7XG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XG59XG5cbi5yZXN1bHQtcXVlc3Rpb24ge1xuICBmb250LXdlaWdodDogODAwO1xufVxuXG4ucmVzdWx0LWFuc3dlciB7XG4gIG1hcmdpbi10b3A6IDRweDtcbiAgY29sb3I6ICMzODQ1NGQ7XG59XG5cbi5yZXN1bHQtYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogNnB4O1xuICBtYXJnaW4tdG9wOiA4cHg7XG59XG5cbi5zbWFsbC1idXR0b24ge1xuICBtaW4taGVpZ2h0OiAyOHB4O1xuICBwYWRkaW5nOiAwIDhweDtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuXG4uc21hbGwtYnV0dG9uLnNlY29uZGFyeSB7XG4gIGJhY2tncm91bmQ6ICNlZWYzZjA7XG4gIGNvbG9yOiAjMjQzMDM4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTAyM3B4KSB7XG4gIC5zbG90aGluZy1zaWRlYmFyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5gO1xuIiwiaW1wb3J0IHsganN4IGFzIF9qc3ggfSBmcm9tIFwicmVhY3QvanN4LXJ1bnRpbWVcIjtcbmltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tIFwicmVhY3QtZG9tL2NsaWVudFwiO1xuaW1wb3J0IHsgSm9iUGFnZVNpZGViYXIgfSBmcm9tIFwiLi9qb2ItcGFnZS1zaWRlYmFyXCI7XG5pbXBvcnQgeyBjb21wdXRlSm9iTWF0Y2hTY29yZSB9IGZyb20gXCIuL3Njb3JpbmdcIjtcbmltcG9ydCB7IGRpc21pc3NTaWRlYmFyRm9yRG9tYWluLCBpc1NpZGViYXJEaXNtaXNzZWRGb3JEb21haW4sIG5vcm1hbGl6ZVNpZGViYXJEb21haW4sIH0gZnJvbSBcIi4vc3RvcmFnZVwiO1xuaW1wb3J0IHsgU0lERUJBUl9TVFlMRVMgfSBmcm9tIFwiLi9zdHlsZXNcIjtcbmNvbnN0IEhPU1RfSUQgPSBcInNsb3RoaW5nLWpvYi1wYWdlLXNpZGViYXItaG9zdFwiO1xuY29uc3QgREVTS1RPUF9NSU5fV0lEVEggPSAxMDI0O1xuZXhwb3J0IGNsYXNzIEpvYlBhZ2VTaWRlYmFyQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IG51bGw7XG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc21pc3NlZERvbWFpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gKCkgPT4gdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5oYW5kbGVSZXNpemUpO1xuICAgIH1cbiAgICBhc3luYyB1cGRhdGUobmV4dCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gbmV4dDtcbiAgICAgICAgdGhpcy5kaXNtaXNzZWREb21haW4gPSAoYXdhaXQgaXNTaWRlYmFyRGlzbWlzc2VkRm9yRG9tYWluKCkpXG4gICAgICAgICAgICA/IG5vcm1hbGl6ZVNpZGViYXJEb21haW4od2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgICBzaG93Q29sbGFwc2VkKCkge1xuICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIGFzeW5jIGRpc21pc3NEb21haW4oKSB7XG4gICAgICAgIGF3YWl0IGRpc21pc3NTaWRlYmFyRm9yRG9tYWluKCk7XG4gICAgICAgIHRoaXMuZGlzbWlzc2VkRG9tYWluID0gbm9ybWFsaXplU2lkZWJhckRvbWFpbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpO1xuICAgICAgICB0aGlzLnVubW91bnQoKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5oYW5kbGVSZXNpemUpO1xuICAgICAgICB0aGlzLnVubW91bnQoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlPy5zY3JhcGVkSm9iIHx8XG4gICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCA8IERFU0tUT1BfTUlOX1dJRFRIIHx8XG4gICAgICAgICAgICB0aGlzLmRpc21pc3NlZERvbWFpbiA9PT0gbm9ybWFsaXplU2lkZWJhckRvbWFpbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnVubW91bnQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb290ID0gdGhpcy5lbnN1cmVSb290KCk7XG4gICAgICAgIGNvbnN0IHNjb3JlID0gY29tcHV0ZUpvYk1hdGNoU2NvcmUodGhpcy5zdGF0ZS5wcm9maWxlLCB0aGlzLnN0YXRlLnNjcmFwZWRKb2IpO1xuICAgICAgICByb290LnJlbmRlcihfanN4KEpvYlBhZ2VTaWRlYmFyLCB7IHNjcmFwZWRKb2I6IHRoaXMuc3RhdGUuc2NyYXBlZEpvYiwgZGV0ZWN0ZWRGaWVsZENvdW50OiB0aGlzLnN0YXRlLmRldGVjdGVkRmllbGRDb3VudCwgc2NvcmU6IHNjb3JlLCBpc0NvbGxhcHNlZDogdGhpcy5jb2xsYXBzZWQsIG9uQ29sbGFwc2VDaGFuZ2U6IChjb2xsYXBzZWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IGNvbGxhcHNlZDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgfSwgb25EaXNtaXNzOiAoKSA9PiB0aGlzLmRpc21pc3NEb21haW4oKSwgb25UYWlsb3I6IHRoaXMuc3RhdGUub25UYWlsb3IsIG9uQ292ZXJMZXR0ZXI6IHRoaXMuc3RhdGUub25Db3ZlckxldHRlciwgb25TYXZlOiB0aGlzLnN0YXRlLm9uU2F2ZSwgb25BdXRvRmlsbDogdGhpcy5zdGF0ZS5vbkF1dG9GaWxsLCBvblNlYXJjaEFuc3dlcnM6IHRoaXMuc3RhdGUub25TZWFyY2hBbnN3ZXJzLCBvbkFwcGx5QW5zd2VyOiB0aGlzLnN0YXRlLm9uQXBwbHlBbnN3ZXIgfSkpO1xuICAgIH1cbiAgICBlbnN1cmVSb290KCkge1xuICAgICAgICBpZiAodGhpcy5yb290KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChIT1NUX0lEKTtcbiAgICAgICAgdGhpcy5ob3N0ID0gZXhpc3RpbmcgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5ob3N0LmlkID0gSE9TVF9JRDtcbiAgICAgICAgaWYgKCFleGlzdGluZykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaG9zdCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IHRoaXMuaG9zdC5zaGFkb3dSb290IHx8IHRoaXMuaG9zdC5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KTtcbiAgICAgICAgaWYgKCFzaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoXCJzdHlsZVwiKSkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IFNJREVCQVJfU1RZTEVTO1xuICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1vdW50ID0gc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtc2lkZWJhci1yb290XVwiKTtcbiAgICAgICAgaWYgKCFtb3VudCkge1xuICAgICAgICAgICAgbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgbW91bnQuZGF0YXNldC5zaWRlYmFyUm9vdCA9IFwidHJ1ZVwiO1xuICAgICAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChtb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290ID0gY3JlYXRlUm9vdChtb3VudCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvb3Q7XG4gICAgfVxuICAgIHVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucm9vdD8udW5tb3VudCgpO1xuICAgICAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgICAgICB0aGlzLmhvc3Q/LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmhvc3QgPSBudWxsO1xuICAgIH1cbn1cbiIsIi8vIENvbnRlbnQgc2NyaXB0IGVudHJ5IHBvaW50IGZvciBDb2x1bWJ1cyBleHRlbnNpb25cbi8vIEltcG9ydCBzdHlsZXMgZm9yIGNvbnRlbnQgc2NyaXB0XG5pbXBvcnQgXCIuL3VpL3N0eWxlcy5jc3NcIjtcbmltcG9ydCB7IEZpZWxkRGV0ZWN0b3IgfSBmcm9tIFwiLi9hdXRvLWZpbGwvZmllbGQtZGV0ZWN0b3JcIjtcbmltcG9ydCB7IEZpZWxkTWFwcGVyIH0gZnJvbSBcIi4vYXV0by1maWxsL2ZpZWxkLW1hcHBlclwiO1xuaW1wb3J0IHsgQXV0b0ZpbGxFbmdpbmUgfSBmcm9tIFwiLi9hdXRvLWZpbGwvZW5naW5lXCI7XG5pbXBvcnQgeyBnZXRTY3JhcGVyRm9yVXJsIH0gZnJvbSBcIi4vc2NyYXBlcnMvc2NyYXBlci1yZWdpc3RyeVwiO1xuaW1wb3J0IHsgV2F0ZXJsb29Xb3Jrc09yY2hlc3RyYXRvciB9IGZyb20gXCIuL3NjcmFwZXJzL3dhdGVybG9vLXdvcmtzLW9yY2hlc3RyYXRvclwiO1xuaW1wb3J0IHsgc2VuZE1lc3NhZ2UsIE1lc3NhZ2VzIH0gZnJvbSBcIkAvc2hhcmVkL21lc3NhZ2VzXCI7XG5pbXBvcnQgeyBzaG93QXBwbGllZFRvYXN0IH0gZnJvbSBcIi4vdHJhY2tpbmcvYXBwbGllZC10b2FzdFwiO1xuaW1wb3J0IHsgU3VibWl0V2F0Y2hlciwgZXh0cmFjdENvbXBhbnlIaW50IH0gZnJvbSBcIi4vdHJhY2tpbmcvc3VibWl0LXdhdGNoZXJcIjtcbmltcG9ydCB7IEpvYlBhZ2VTaWRlYmFyQ29udHJvbGxlciB9IGZyb20gXCIuL3NpZGViYXIvY29udHJvbGxlclwiO1xuLy8gSW5pdGlhbGl6ZSBjb21wb25lbnRzXG5jb25zdCBmaWVsZERldGVjdG9yID0gbmV3IEZpZWxkRGV0ZWN0b3IoKTtcbmxldCBhdXRvRmlsbEVuZ2luZSA9IG51bGw7XG5sZXQgY2FjaGVkUHJvZmlsZSA9IG51bGw7XG5sZXQgZGV0ZWN0ZWRGaWVsZHMgPSBbXTtcbmNvbnN0IGRldGVjdGVkRmllbGRzQnlGb3JtID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGF1dG9maWxsZWRGb3JtcyA9IG5ldyBXZWFrU2V0KCk7XG5sZXQgc2NyYXBlZEpvYiA9IG51bGw7XG5sZXQgam9iRGV0ZWN0ZWRGb3JVcmwgPSBudWxsO1xubGV0IHByb2ZpbGVMb2FkUHJvbWlzZSA9IG51bGw7XG5jb25zdCBzaWRlYmFyQ29udHJvbGxlciA9IG5ldyBKb2JQYWdlU2lkZWJhckNvbnRyb2xsZXIoKTtcbmNvbnN0IHN1Ym1pdFdhdGNoZXIgPSBuZXcgU3VibWl0V2F0Y2hlcih7XG4gICAgZ2V0RGV0ZWN0ZWRGaWVsZHM6IChmb3JtKSA9PiBkZXRlY3RlZEZpZWxkc0J5Rm9ybS5nZXQoZm9ybSkgfHwgW10sXG4gICAgZ2V0U2NyYXBlZEpvYjogKCkgPT4gc2NyYXBlZEpvYixcbiAgICBnZXRTZXR0aW5nczogZ2V0RXh0ZW5zaW9uU2V0dGluZ3MsXG4gICAgd2FzQXV0b2ZpbGxlZDogKGZvcm0pID0+IGF1dG9maWxsZWRGb3Jtcy5oYXMoZm9ybSksXG4gICAgb25UcmFja2VkOiBhc3luYyAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLnRyYWNrQXBwbGllZChwYXlsb2FkKSk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltDb2x1bWJ1c10gRmFpbGVkIHRvIHRyYWNrIGFwcGxpY2F0aW9uOlwiLCByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2hvd0FwcGxpZWRUb2FzdChleHRyYWN0Q29tcGFueUhpbnQoc2NyYXBlZEpvYiwgcGF5bG9hZC5ob3N0KSwgKCkgPT4ge1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2UoTWVzc2FnZXMub3BlbkRhc2hib2FyZCgpKS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKFwiW0NvbHVtYnVzXSBGYWlsZWQgdG8gb3BlbiBkYXNoYm9hcmQ6XCIsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9LFxufSk7XG4vLyBTY2FuIHBhZ2Ugb24gbG9hZFxuc2NhblBhZ2UoKTtcbnN1Ym1pdFdhdGNoZXIuYXR0YWNoKCk7XG4vLyBSZS1zY2FuIG9uIGR5bmFtaWMgY29udGVudCBjaGFuZ2VzXG5jb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGRlYm91bmNlKHNjYW5QYWdlLCA1MDApKTtcbm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG5hc3luYyBmdW5jdGlvbiBzY2FuUGFnZSgpIHtcbiAgICAvLyBEZXRlY3QgZm9ybXNcbiAgICBjb25zdCBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJmb3JtXCIpO1xuICAgIGZvciAoY29uc3QgZm9ybSBvZiBmb3Jtcykge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBmaWVsZERldGVjdG9yLmRldGVjdEZpZWxkcyhmb3JtKTtcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXRlY3RlZEZpZWxkc0J5Rm9ybS5zZXQoZm9ybSwgZmllbGRzKTtcbiAgICAgICAgICAgIGRldGVjdGVkRmllbGRzID0gZmllbGRzO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIERldGVjdGVkIGZpZWxkczpcIiwgZmllbGRzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgZm9yIGpvYiBsaXN0aW5nXG4gICAgY29uc3Qgc2NyYXBlciA9IGdldFNjcmFwZXJGb3JVcmwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgIGxldCBuZXh0U2NyYXBlZEpvYiA9IG51bGw7XG4gICAgaWYgKHNjcmFwZXIuY2FuSGFuZGxlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbmV4dFNjcmFwZWRKb2IgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZUpvYkxpc3RpbmcoKTtcbiAgICAgICAgICAgIHNjcmFwZWRKb2IgPSBuZXh0U2NyYXBlZEpvYjtcbiAgICAgICAgICAgIGlmIChuZXh0U2NyYXBlZEpvYikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBTY3JhcGVkIGpvYjpcIiwgbmV4dFNjcmFwZWRKb2IudGl0bGUpO1xuICAgICAgICAgICAgICAgIGlmIChqb2JEZXRlY3RlZEZvclVybCAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgam9iRGV0ZWN0ZWRGb3JVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuam9iRGV0ZWN0ZWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG5leHRTY3JhcGVkSm9iLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueTogbmV4dFNjcmFwZWRKb2IuY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogbmV4dFNjcmFwZWRKb2IudXJsLFxuICAgICAgICAgICAgICAgICAgICB9KSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihcIltDb2x1bWJ1c10gRmFpbGVkIHRvIG5vdGlmeSBqb2IgZGV0ZWN0ZWQ6XCIsIGVycikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0NvbHVtYnVzXSBTY3JhcGUgZXJyb3I6XCIsIGVycik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFuZXh0U2NyYXBlZEpvYiAmJiBzY3JhcGVkSm9iPy51cmwgIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSB7XG4gICAgICAgIHNjcmFwZWRKb2IgPSBudWxsO1xuICAgIH1cbiAgICB2b2lkIHVwZGF0ZVNpZGViYXIoKTtcbn1cbi8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHBvcHVwIGFuZCBiYWNrZ3JvdW5kXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgaGFuZGxlTWVzc2FnZShtZXNzYWdlKVxuICAgICAgICAudGhlbihzZW5kUmVzcG9uc2UpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTsgLy8gQXN5bmMgcmVzcG9uc2Vcbn0pO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcIkdFVF9QQUdFX1NUQVRVU1wiOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBoYXNGb3JtOiBkZXRlY3RlZEZpZWxkcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgIGhhc0pvYkxpc3Rpbmc6IHNjcmFwZWRKb2IgIT09IG51bGwsXG4gICAgICAgICAgICAgICAgZGV0ZWN0ZWRGaWVsZHM6IGRldGVjdGVkRmllbGRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBzY3JhcGVkSm9iLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBcIlRSSUdHRVJfRklMTFwiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUZpbGxGb3JtKCk7XG4gICAgICAgIGNhc2UgXCJUUklHR0VSX0lNUE9SVFwiOlxuICAgICAgICAgICAgaWYgKHNjcmFwZWRKb2IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2UoTWVzc2FnZXMuaW1wb3J0Sm9iKHNjcmFwZWRKb2IpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyBqb2IgZGV0ZWN0ZWRcIiB9O1xuICAgICAgICBjYXNlIFwiU0NSQVBFX0pPQlwiOlxuICAgICAgICAgICAgY29uc3Qgc2NyYXBlciA9IGdldFNjcmFwZXJGb3JVcmwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgaWYgKHNjcmFwZXIuY2FuSGFuZGxlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkge1xuICAgICAgICAgICAgICAgIHNjcmFwZWRKb2IgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZUpvYkxpc3RpbmcoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBzY3JhcGVkSm9iIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gc2NyYXBlciBhdmFpbGFibGUgZm9yIHRoaXMgc2l0ZVwiIH07XG4gICAgICAgIGNhc2UgXCJTQ1JBUEVfSk9CX0xJU1RcIjpcbiAgICAgICAgICAgIGNvbnN0IGxpc3RTY3JhcGVyID0gZ2V0U2NyYXBlckZvclVybCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBpZiAobGlzdFNjcmFwZXIuY2FuSGFuZGxlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvYnMgPSBhd2FpdCBsaXN0U2NyYXBlci5zY3JhcGVKb2JMaXN0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogam9icyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vIHNjcmFwZXIgYXZhaWxhYmxlIGZvciB0aGlzIHNpdGVcIiB9O1xuICAgICAgICBjYXNlIFwiV1dfR0VUX1BBR0VfU1RBVEVcIjpcbiAgICAgICAgICAgIHJldHVybiBnZXRXd1BhZ2VTdGF0ZSgpO1xuICAgICAgICBjYXNlIFwiV1dfU0NSQVBFX0FMTF9WSVNJQkxFXCI6XG4gICAgICAgICAgICByZXR1cm4gcnVuV3dCdWxrU2NyYXBlKHsgcGFnaW5hdGVkOiBmYWxzZSB9KTtcbiAgICAgICAgY2FzZSBcIldXX1NDUkFQRV9BTExfUEFHSU5BVEVEXCI6XG4gICAgICAgICAgICByZXR1cm4gcnVuV3dCdWxrU2NyYXBlKHtcbiAgICAgICAgICAgICAgICBwYWdpbmF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgLi4ubWVzc2FnZS5wYXlsb2FkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIG1lc3NhZ2UgdHlwZTogJHttZXNzYWdlLnR5cGV9YCB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzV2F0ZXJsb29Xb3JrcygpIHtcbiAgICByZXR1cm4gL3dhdGVybG9vd29ya3NcXC51d2F0ZXJsb29cXC5jYS8udGVzdCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG59XG5mdW5jdGlvbiBnZXRXd1BhZ2VTdGF0ZSgpIHtcbiAgICBpZiAoIWlzV2F0ZXJsb29Xb3JrcygpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogeyBraW5kOiBcIm90aGVyXCIsIHJvd0NvdW50OiAwLCBoYXNOZXh0UGFnZTogZmFsc2UgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3Qgcm93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJsZS5kYXRhLXZpZXdlci10YWJsZSB0Ym9keSB0ci50YWJsZV9fcm93LS1ib2R5XCIpO1xuICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhLnBhZ2luYXRpb25fX2xpbmtbYXJpYS1sYWJlbD1cIkdvIHRvIG5leHQgcGFnZVwiXScpO1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJhLnBhZ2luYXRpb25fX2xpbmsuYWN0aXZlXCIpXG4gICAgICAgID8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICBjb25zdCBoYXNEZXRhaWwgPSAhIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGFzaGJvYXJkLWhlYWRlcl9fcG9zdGluZy10aXRsZVwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBraW5kOiBoYXNEZXRhaWwgPyBcImRldGFpbFwiIDogcm93cy5sZW5ndGggPiAwID8gXCJsaXN0XCIgOiBcIm90aGVyXCIsXG4gICAgICAgICAgICByb3dDb3VudDogcm93cy5sZW5ndGgsXG4gICAgICAgICAgICBoYXNOZXh0UGFnZTogISFuZXh0QnRuICYmICFuZXh0QnRuLmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpLFxuICAgICAgICAgICAgY3VycmVudFBhZ2UsXG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJ1bld3QnVsa1NjcmFwZShvcHRzKSB7XG4gICAgaWYgKCFpc1dhdGVybG9vV29ya3MoKSkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGEgV2F0ZXJsb29Xb3JrcyBwYWdlXCIgfTtcbiAgICB9XG4gICAgY29uc3Qgb3JjaGVzdHJhdG9yID0gbmV3IFdhdGVybG9vV29ya3NPcmNoZXN0cmF0b3IoKTtcbiAgICBsZXQgZXJyb3JzID0gW107XG4gICAgbGV0IHBhZ2VzID0gMTtcbiAgICBjb25zdCBvblByb2dyZXNzID0gKHApID0+IHtcbiAgICAgICAgcGFnZXMgPSBwLmN1cnJlbnRQYWdlO1xuICAgICAgICBlcnJvcnMgPSBwLmVycm9ycztcbiAgICAgICAgLy8gRmlyZS1hbmQtZm9yZ2V0IHByb2dyZXNzIGV2ZW50IHRvIHRoZSBiYWNrZ3JvdW5kLCB3aGljaCBjYW4gZmFuIGl0IG91dFxuICAgICAgICAvLyB0byB0aGUgcG9wdXAgaWYgb3Blbi5cbiAgICAgICAgc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJXV19CVUxLX1BST0dSRVNTXCIsXG4gICAgICAgICAgICBwYXlsb2FkOiBwLFxuICAgICAgICB9KS5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgIH07XG4gICAgY29uc3Qgam9icyA9IG9wdHMucGFnaW5hdGVkXG4gICAgICAgID8gYXdhaXQgb3JjaGVzdHJhdG9yLnNjcmFwZUFsbFBhZ2luYXRlZCh7XG4gICAgICAgICAgICBvblByb2dyZXNzLFxuICAgICAgICAgICAgbWF4Sm9iczogb3B0cy5tYXhKb2JzLFxuICAgICAgICAgICAgbWF4UGFnZXM6IG9wdHMubWF4UGFnZXMsXG4gICAgICAgIH0pXG4gICAgICAgIDogYXdhaXQgb3JjaGVzdHJhdG9yLnNjcmFwZUFsbFZpc2libGUoeyBvblByb2dyZXNzIH0pO1xuICAgIGlmIChqb2JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHsgaW1wb3J0ZWQ6IDAsIGF0dGVtcHRlZDogMCwgcGFnZXMsIGVycm9ycyB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBIYW5kIG9mZiB0byBiYWNrZ3JvdW5kIHRvIGJ1bGstaW1wb3J0IHRvIFNsb3RoaW5nLlxuICAgIGNvbnN0IGltcG9ydFJlc3AgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5pbXBvcnRKb2JzQmF0Y2goam9icykpO1xuICAgIGlmICghaW1wb3J0UmVzcC5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiBpbXBvcnRSZXNwLmVycm9yIHx8IFwiQnVsayBpbXBvcnQgZmFpbGVkXCIsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGltcG9ydGVkOiBpbXBvcnRSZXNwLmRhdGE/LmltcG9ydGVkID8/IGpvYnMubGVuZ3RoLFxuICAgICAgICAgICAgYXR0ZW1wdGVkOiBqb2JzLmxlbmd0aCxcbiAgICAgICAgICAgIHBhZ2VzLFxuICAgICAgICAgICAgZXJyb3JzLFxuICAgICAgICB9LFxuICAgIH07XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVGaWxsRm9ybSgpIHtcbiAgICBpZiAoZGV0ZWN0ZWRGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyBmaWVsZHMgZGV0ZWN0ZWRcIiB9O1xuICAgIH1cbiAgICAvLyBHZXQgcHJvZmlsZSBpZiBub3QgY2FjaGVkXG4gICAgaWYgKCFjYWNoZWRQcm9maWxlKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0UHJvZmlsZSgpKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIGxvYWQgcHJvZmlsZVwiIH07XG4gICAgICAgIH1cbiAgICAgICAgY2FjaGVkUHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBtYXBwZXIgYW5kIGVuZ2luZVxuICAgIGNvbnN0IG1hcHBlciA9IG5ldyBGaWVsZE1hcHBlcihjYWNoZWRQcm9maWxlKTtcbiAgICBhdXRvRmlsbEVuZ2luZSA9IG5ldyBBdXRvRmlsbEVuZ2luZShmaWVsZERldGVjdG9yLCBtYXBwZXIpO1xuICAgIC8vIEZpbGwgdGhlIGZvcm1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhdXRvRmlsbEVuZ2luZS5maWxsRm9ybShkZXRlY3RlZEZpZWxkcyk7XG4gICAgaWYgKHJlc3VsdC5maWxsZWQgPj0gMikge1xuICAgICAgICBmb3IgKGNvbnN0IGZvcm0gb2YgbmV3IFNldChkZXRlY3RlZEZpZWxkc1xuICAgICAgICAgICAgLm1hcCgoZmllbGQpID0+IGZpZWxkLmVsZW1lbnQuY2xvc2VzdChcImZvcm1cIikpXG4gICAgICAgICAgICAuZmlsdGVyKChmb3JtKSA9PiBmb3JtIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSkpIHtcbiAgICAgICAgICAgIGF1dG9maWxsZWRGb3Jtcy5hZGQoZm9ybSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0IH07XG59XG5hc3luYyBmdW5jdGlvbiBnZXRFeHRlbnNpb25TZXR0aW5ncygpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLmdldFNldHRpbmdzKCkpO1xuICAgIGlmICghcmVzcG9uc2Uuc3VjY2VzcyB8fCAhcmVzcG9uc2UuZGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IgfHwgXCJGYWlsZWQgdG8gbG9hZCBleHRlbnNpb24gc2V0dGluZ3NcIik7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU2lkZWJhcigpIHtcbiAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgbG9hZFByb2ZpbGVGb3JTaWRlYmFyKCk7XG4gICAgYXdhaXQgc2lkZWJhckNvbnRyb2xsZXIudXBkYXRlKHtcbiAgICAgICAgc2NyYXBlZEpvYixcbiAgICAgICAgZGV0ZWN0ZWRGaWVsZENvdW50OiBkZXRlY3RlZEZpZWxkcy5sZW5ndGgsXG4gICAgICAgIHByb2ZpbGUsXG4gICAgICAgIG9uVGFpbG9yOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXNjcmFwZWRKb2IpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gam9iIGRldGVjdGVkXCIpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy50YWlsb3JGcm9tUGFnZShzY3JhcGVkSm9iKSk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MgfHwgIXJlc3BvbnNlLmRhdGE/LnVybCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5lcnJvciB8fCBcIkZhaWxlZCB0byB0YWlsb3IgcmVzdW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93Lm9wZW4ocmVzcG9uc2UuZGF0YS51cmwsIFwiX2JsYW5rXCIsIFwibm9vcGVuZXIsbm9yZWZlcnJlclwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db3ZlckxldHRlcjogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzY3JhcGVkSm9iKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGpvYiBkZXRlY3RlZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2VuZXJhdGVDb3ZlckxldHRlckZyb21QYWdlKHNjcmFwZWRKb2IpKTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2VzcyB8fCAhcmVzcG9uc2UuZGF0YT8udXJsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yIHx8IFwiRmFpbGVkIHRvIGdlbmVyYXRlIGNvdmVyIGxldHRlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHJlc3BvbnNlLmRhdGEudXJsLCBcIl9ibGFua1wiLCBcIm5vb3BlbmVyLG5vcmVmZXJyZXJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2F2ZTogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzY3JhcGVkSm9iKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGpvYiBkZXRlY3RlZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuaW1wb3J0Sm9iKHNjcmFwZWRKb2IpKTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5lcnJvciB8fCBcIkZhaWxlZCB0byBzYXZlIGpvYlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25BdXRvRmlsbDogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVGaWxsRm9ybSgpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yIHx8IFwiRmFpbGVkIHRvIGF1dG8tZmlsbCBmb3JtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvblNlYXJjaEFuc3dlcnM6IGFzeW5jIChxdWVyeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5zZWFyY2hBbnN3ZXJzKHF1ZXJ5KSk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IgfHwgXCJBbnN3ZXIgc2VhcmNoIGZhaWxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhIHx8IFtdO1xuICAgICAgICB9LFxuICAgICAgICBvbkFwcGx5QW5zd2VyOiAoYW5zd2VyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICBhY3RpdmUgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlLnZhbHVlID0gYW5zd2VyLmFuc3dlcjtcbiAgICAgICAgICAgICAgICBhY3RpdmUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICAgICAgICAgIGFjdGl2ZS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0pO1xufVxuYXN5bmMgZnVuY3Rpb24gbG9hZFByb2ZpbGVGb3JTaWRlYmFyKCkge1xuICAgIGlmIChjYWNoZWRQcm9maWxlKVxuICAgICAgICByZXR1cm4gY2FjaGVkUHJvZmlsZTtcbiAgICBpZiAoIXByb2ZpbGVMb2FkUHJvbWlzZSkge1xuICAgICAgICBwcm9maWxlTG9hZFByb21pc2UgPSBzZW5kTWVzc2FnZShNZXNzYWdlcy5nZXRQcm9maWxlKCkpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBjYWNoZWRQcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IG51bGwpXG4gICAgICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICBwcm9maWxlTG9hZFByb21pc2UgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2ZpbGVMb2FkUHJvbWlzZTtcbn1cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgKCkgPT4ge1xuICAgIHN1Ym1pdFdhdGNoZXIuZGV0YWNoKCk7XG4gICAgc2lkZWJhckNvbnRyb2xsZXIuZGVzdHJveSgpO1xufSk7XG4vLyBVdGlsaXR5OiBkZWJvdW5jZSBmdW5jdGlvblxuZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG4gICAgbGV0IHRpbWVvdXRJZDtcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gZm4oLi4uYXJncyksIGRlbGF5KTtcbiAgICB9O1xufVxuY29uc29sZS5sb2coXCJbQ29sdW1idXNdIENvbnRlbnQgc2NyaXB0IGxvYWRlZFwiKTtcbi8vIFBpY2sgdXAgYSBsb2NhbFN0b3JhZ2UtdHJhbnNwb3J0ZWQgYXV0aCB0b2tlbiBmcm9tIHRoZSBTbG90aGluZyBjb25uZWN0IHBhZ2UuXG4vLyBVc2VkIG9uIGJyb3dzZXJzIHRoYXQgZG9uJ3QgaG9ub3IgZXh0ZXJuYWxseV9jb25uZWN0YWJsZSAoRmlyZWZveCBpblxuLy8gcGFydGljdWxhcikuIFRoZSBjb25uZWN0IHBhZ2Ugd3JpdGVzIHRoZSB0b2tlbiB1bmRlciB0aGlzIGtleTsgd2UgZm9yd2FyZCBpdFxuLy8gdG8gdGhlIGJhY2tncm91bmQsIHdoaWNoIHN0b3JlcyBpdCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCBhbmQgY2xlYXJzIHRoZVxuLy8gbG9jYWxTdG9yYWdlIGVudHJ5LiBQb2xscyBmb3IgfjMwcyBpbiBjYXNlIHRoZSBzY3JpcHQgcnVucyBiZWZvcmUgdGhlIHBhZ2Vcbi8vIGhhcyB3cml0dGVuIHRoZSBrZXkuXG5jb25zdCBTTE9USElOR19UT0tFTl9LRVkgPSBcImNvbHVtYnVzX2V4dGVuc2lvbl90b2tlblwiO1xubGV0IHBpY2t1cEluRmxpZ2h0ID0gZmFsc2U7XG5mdW5jdGlvbiBwaWNrVXBTbG90aGluZ1Rva2VuKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNMT1RISU5HX1RPS0VOX0tFWSk7XG4gICAgICAgIGlmICghcmF3KVxuICAgICAgICAgICAgcmV0dXJuIFwiZW1wdHlcIjtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICBpZiAoIXBhcnNlZD8udG9rZW4gfHwgIXBhcnNlZD8uZXhwaXJlc0F0KSB7XG4gICAgICAgICAgICAvLyBNYWxmb3JtZWQgcGF5bG9hZCDigJQgcHVyZ2Ugc28gd2Ugc3RvcCBwb2xsaW5nLlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShTTE9USElOR19UT0tFTl9LRVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiZW1wdHlcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGlja3VwSW5GbGlnaHQpXG4gICAgICAgICAgICByZXR1cm4gXCJwZW5kaW5nXCI7XG4gICAgICAgIHBpY2t1cEluRmxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJBVVRIX0NBTExCQUNLXCIsXG4gICAgICAgICAgICB0b2tlbjogcGFyc2VkLnRva2VuLFxuICAgICAgICAgICAgZXhwaXJlc0F0OiBwYXJzZWQuZXhwaXJlc0F0LFxuICAgICAgICB9LCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHBpY2t1cEluRmxpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShTTE9USElOR19UT0tFTl9LRVkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gcGlja2VkIHVwIGxvY2FsU3RvcmFnZSB0b2tlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBcInBlbmRpbmdcIjtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gXCJlbXB0eVwiO1xuICAgIH1cbn1cbmlmICgvKF58XFwuKWxvY2FsaG9zdCg6fCQpfF4xMjdcXC4wXFwuMFxcLjEoOnwkKXxeXFxbOjoxXFxdKDp8JCkvLnRlc3Qod2luZG93LmxvY2F0aW9uLmhvc3QpKSB7XG4gICAgLy8gSW5pdGlhbCBwcm9iZTogaWYgdGhlcmUncyBub3RoaW5nIHRvIHBpY2sgdXAgYW5kIHdlJ3JlIG5vdCBvbiB0aGUgY29ubmVjdFxuICAgIC8vIHBhZ2UgaXRzZWxmLCB0aGVyZSdzIG5vIHJlYXNvbiB0byBwb2xsIOKAlCB0aGUgcGFnZSBoYXNuJ3QgYmVlbiBvcGVuZWQuXG4gICAgLy8gT24gdGhlIGNvbm5lY3QgcGFnZSAob3IgYW55d2hlcmUgZWxzZSBpZiB0aGUgdXNlciBpcyBhYm91dCB0byBsYW5kIG9uXG4gICAgLy8gL2V4dGVuc2lvbi9jb25uZWN0IHZpYSBTUEEgbmF2KSwga2VlcCBwb2xsaW5nIGZvciAzMHMuXG4gICAgY29uc3QgaW5pdGlhbCA9IHBpY2tVcFNsb3RoaW5nVG9rZW4oKTtcbiAgICBjb25zdCBvbkNvbm5lY3RQYXRoID0gL1xcL2V4dGVuc2lvblxcL2Nvbm5lY3QoXFxifFxcLykvLnRlc3Qod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICBpZiAoaW5pdGlhbCAhPT0gXCJlbXB0eVwiIHx8IG9uQ29ubmVjdFBhdGgpIHtcbiAgICAgICAgbGV0IGVsYXBzZWRNcyA9IDA7XG4gICAgICAgIGNvbnN0IGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBlbGFwc2VkTXMgKz0gNTAwO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcGlja1VwU2xvdGhpbmdUb2tlbigpO1xuICAgICAgICAgICAgaWYgKChyZXN1bHQgPT09IFwiZW1wdHlcIiAmJiAhcGlja3VwSW5GbGlnaHQgJiYgZWxhcHNlZE1zID4gMjAwMCkgfHxcbiAgICAgICAgICAgICAgICBlbGFwc2VkTXMgPj0gMzAwMDApIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA1MDApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==