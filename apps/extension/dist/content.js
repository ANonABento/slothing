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
    tailorFromPage: (job) => ({
        type: "TAILOR_FROM_PAGE",
        payload: job,
    }),
    generateCoverLetterFromPage: (job) => ({
        type: "GENERATE_COVER_LETTER_FROM_PAGE",
        payload: job,
    }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5VUE7QUFDc0Y7QUFDL0U7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QsV0FBVztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUI7QUFDbkYsZUFBZSwwQkFBMEI7QUFDekM7QUFDQTs7O0FDcE1BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIseUJBQXlCLEdBQUc7QUFDNUI7QUFDQTtBQUNBOzs7QUMvSEE7QUFDNkM7QUFDdEMsOEJBQThCLFdBQVc7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHFDQUFxQyxHQUFHLHFDQUFxQztBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUM2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sbUNBQW1DLFdBQVc7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQ0FBaUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLEtBQUs7QUFDckUsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsT0E7QUFDNkM7QUFDdEMsNEJBQTRCLFdBQVc7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLE9BQU87QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsd0NBQXdDLEdBQUcseUNBQXlDLEVBQUUsd0NBQXdDO0FBQ3hKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOU5BO0FBQzZDO0FBQ3RDLGdDQUFnQyxXQUFXO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdDQUF3QyxHQUFHLHdDQUF3QztBQUNqSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hPQTtBQUM2QztBQUN0QywyQkFBMkIsV0FBVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix3Q0FBd0MsR0FBRyx3Q0FBd0M7QUFDakg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM09BO0FBQzZDO0FBQ3RDLDZCQUE2QixXQUFXO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFLHNCQUFzQixJQUFJLHFCQUFxQjtBQUMzRjtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRSx1QkFBdUI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsTUFBTSwwRUFBMEU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxNQUFNLDhDQUE4QztBQUNwRCxNQUFNLDJDQUEyQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxNQUFNLDREQUE0RDtBQUNsRSxNQUFNLDJFQUEyRTtBQUNqRixNQUFNLDZEQUE2RDtBQUNuRSxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOzs7QUN0UndEO0FBQ1o7QUFDd0M7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDbEUsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Qk87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3QtZG9tQDE4LjMuMV9yZWFjdEAxOC4zLjEvbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS9janMvcmVhY3QtZG9tLnByb2R1Y3Rpb24ubWluLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0LWRvbUAxOC4zLjFfcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vY2xpZW50LmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0LWRvbUAxOC4zLjFfcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QtanN4LXJ1bnRpbWUucHJvZHVjdGlvbi5taW4uanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QucHJvZHVjdGlvbi5taW4uanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdEAxOC4zLjEvbm9kZV9tb2R1bGVzL3JlYWN0L2pzeC1ydW50aW1lLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3NjaGVkdWxlckAwLjIzLjIvbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3NjaGVkdWxlckAwLjIzLjIvbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvc2hhcmVkL2ZpZWxkLXBhdHRlcm5zLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9hdXRvLWZpbGwvZmllbGQtZGV0ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L2F1dG8tZmlsbC9maWVsZC1tYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L2F1dG8tZmlsbC9lbmdpbmUudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL2Jhc2Utc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvbGlua2VkaW4tc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvd2F0ZXJsb28td29ya3Mtc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvaW5kZWVkLXNjcmFwZXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NjcmFwZXJzL2dyZWVuaG91c2Utc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvbGV2ZXItc2NyYXBlci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2NyYXBlcnMvZ2VuZXJpYy1zY3JhcGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy9zY3JhcGVyLXJlZ2lzdHJ5LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zY3JhcGVycy93YXRlcmxvby13b3Jrcy1vcmNoZXN0cmF0b3IudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9zaGFyZWQvbWVzc2FnZXMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3RyYWNraW5nL2FwcGxpZWQtdG9hc3QudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3RyYWNraW5nL3BhZ2Utc25hcHNob3QudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3RyYWNraW5nL3N1Ym1pdC13YXRjaGVyLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zaWRlYmFyL2pvYi1wYWdlLXNpZGViYXIudHN4Iiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9mb3JtYXR0ZXJzL2luZGV4LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy90ZXh0LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2FjdGlvbi12ZXJicy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9hdHMtY2hhcmFjdGVycy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9hdHMtZnJpZW5kbGluZXNzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3N5bm9ueW1zLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2tleXdvcmQtbWF0Y2gudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvbGVuZ3RoLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3F1YW50aWZpZWQtYWNoaWV2ZW1lbnRzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3NlY3Rpb24tY29tcGxldGVuZXNzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3NwZWxsaW5nLWdyYW1tYXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9jb250ZW50L3NpZGViYXIvc2NvcmluZy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2lkZWJhci9zdG9yYWdlLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvY29udGVudC9zaWRlYmFyL3N0eWxlcy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvc2lkZWJhci9jb250cm9sbGVyLnRzeCIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QtZG9tLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbi8qXG4gTW9kZXJuaXpyIDMuMC4wcHJlIChDdXN0b20gQnVpbGQpIHwgTUlUXG4qL1xuJ3VzZSBzdHJpY3QnO3ZhciBhYT1yZXF1aXJlKFwicmVhY3RcIiksY2E9cmVxdWlyZShcInNjaGVkdWxlclwiKTtmdW5jdGlvbiBwKGEpe2Zvcih2YXIgYj1cImh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9lcnJvci1kZWNvZGVyLmh0bWw/aW52YXJpYW50PVwiK2EsYz0xO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspYis9XCImYXJnc1tdPVwiK2VuY29kZVVSSUNvbXBvbmVudChhcmd1bWVudHNbY10pO3JldHVyblwiTWluaWZpZWQgUmVhY3QgZXJyb3IgI1wiK2ErXCI7IHZpc2l0IFwiK2IrXCIgZm9yIHRoZSBmdWxsIG1lc3NhZ2Ugb3IgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50IGZvciBmdWxsIGVycm9ycyBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLlwifXZhciBkYT1uZXcgU2V0LGVhPXt9O2Z1bmN0aW9uIGZhKGEsYil7aGEoYSxiKTtoYShhK1wiQ2FwdHVyZVwiLGIpfVxuZnVuY3Rpb24gaGEoYSxiKXtlYVthXT1iO2ZvcihhPTA7YTxiLmxlbmd0aDthKyspZGEuYWRkKGJbYV0pfVxudmFyIGlhPSEoXCJ1bmRlZmluZWRcIj09PXR5cGVvZiB3aW5kb3d8fFwidW5kZWZpbmVkXCI9PT10eXBlb2Ygd2luZG93LmRvY3VtZW50fHxcInVuZGVmaW5lZFwiPT09dHlwZW9mIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KSxqYT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LGthPS9eWzpBLVpfYS16XFx1MDBDMC1cXHUwMEQ2XFx1MDBEOC1cXHUwMEY2XFx1MDBGOC1cXHUwMkZGXFx1MDM3MC1cXHUwMzdEXFx1MDM3Ri1cXHUxRkZGXFx1MjAwQy1cXHUyMDBEXFx1MjA3MC1cXHUyMThGXFx1MkMwMC1cXHUyRkVGXFx1MzAwMS1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkZEXVs6QS1aX2EtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcLS4wLTlcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwXSokLyxsYT1cbnt9LG1hPXt9O2Z1bmN0aW9uIG9hKGEpe2lmKGphLmNhbGwobWEsYSkpcmV0dXJuITA7aWYoamEuY2FsbChsYSxhKSlyZXR1cm4hMTtpZihrYS50ZXN0KGEpKXJldHVybiBtYVthXT0hMDtsYVthXT0hMDtyZXR1cm4hMX1mdW5jdGlvbiBwYShhLGIsYyxkKXtpZihudWxsIT09YyYmMD09PWMudHlwZSlyZXR1cm4hMTtzd2l0Y2godHlwZW9mIGIpe2Nhc2UgXCJmdW5jdGlvblwiOmNhc2UgXCJzeW1ib2xcIjpyZXR1cm4hMDtjYXNlIFwiYm9vbGVhblwiOmlmKGQpcmV0dXJuITE7aWYobnVsbCE9PWMpcmV0dXJuIWMuYWNjZXB0c0Jvb2xlYW5zO2E9YS50b0xvd2VyQ2FzZSgpLnNsaWNlKDAsNSk7cmV0dXJuXCJkYXRhLVwiIT09YSYmXCJhcmlhLVwiIT09YTtkZWZhdWx0OnJldHVybiExfX1cbmZ1bmN0aW9uIHFhKGEsYixjLGQpe2lmKG51bGw9PT1ifHxcInVuZGVmaW5lZFwiPT09dHlwZW9mIGJ8fHBhKGEsYixjLGQpKXJldHVybiEwO2lmKGQpcmV0dXJuITE7aWYobnVsbCE9PWMpc3dpdGNoKGMudHlwZSl7Y2FzZSAzOnJldHVybiFiO2Nhc2UgNDpyZXR1cm4hMT09PWI7Y2FzZSA1OnJldHVybiBpc05hTihiKTtjYXNlIDY6cmV0dXJuIGlzTmFOKGIpfHwxPmJ9cmV0dXJuITF9ZnVuY3Rpb24gdihhLGIsYyxkLGUsZixnKXt0aGlzLmFjY2VwdHNCb29sZWFucz0yPT09Ynx8Mz09PWJ8fDQ9PT1iO3RoaXMuYXR0cmlidXRlTmFtZT1kO3RoaXMuYXR0cmlidXRlTmFtZXNwYWNlPWU7dGhpcy5tdXN0VXNlUHJvcGVydHk9Yzt0aGlzLnByb3BlcnR5TmFtZT1hO3RoaXMudHlwZT1iO3RoaXMuc2FuaXRpemVVUkw9Zjt0aGlzLnJlbW92ZUVtcHR5U3RyaW5nPWd9dmFyIHo9e307XG5cImNoaWxkcmVuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIGRlZmF1bHRWYWx1ZSBkZWZhdWx0Q2hlY2tlZCBpbm5lckhUTUwgc3VwcHJlc3NDb250ZW50RWRpdGFibGVXYXJuaW5nIHN1cHByZXNzSHlkcmF0aW9uV2FybmluZyBzdHlsZVwiLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSwwLCExLGEsbnVsbCwhMSwhMSl9KTtbW1wiYWNjZXB0Q2hhcnNldFwiLFwiYWNjZXB0LWNoYXJzZXRcIl0sW1wiY2xhc3NOYW1lXCIsXCJjbGFzc1wiXSxbXCJodG1sRm9yXCIsXCJmb3JcIl0sW1wiaHR0cEVxdWl2XCIsXCJodHRwLWVxdWl2XCJdXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWFbMF07eltiXT1uZXcgdihiLDEsITEsYVsxXSxudWxsLCExLCExKX0pO1tcImNvbnRlbnRFZGl0YWJsZVwiLFwiZHJhZ2dhYmxlXCIsXCJzcGVsbENoZWNrXCIsXCJ2YWx1ZVwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSwyLCExLGEudG9Mb3dlckNhc2UoKSxudWxsLCExLCExKX0pO1xuW1wiYXV0b1JldmVyc2VcIixcImV4dGVybmFsUmVzb3VyY2VzUmVxdWlyZWRcIixcImZvY3VzYWJsZVwiLFwicHJlc2VydmVBbHBoYVwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSwyLCExLGEsbnVsbCwhMSwhMSl9KTtcImFsbG93RnVsbFNjcmVlbiBhc3luYyBhdXRvRm9jdXMgYXV0b1BsYXkgY29udHJvbHMgZGVmYXVsdCBkZWZlciBkaXNhYmxlZCBkaXNhYmxlUGljdHVyZUluUGljdHVyZSBkaXNhYmxlUmVtb3RlUGxheWJhY2sgZm9ybU5vVmFsaWRhdGUgaGlkZGVuIGxvb3Agbm9Nb2R1bGUgbm9WYWxpZGF0ZSBvcGVuIHBsYXlzSW5saW5lIHJlYWRPbmx5IHJlcXVpcmVkIHJldmVyc2VkIHNjb3BlZCBzZWFtbGVzcyBpdGVtU2NvcGVcIi5zcGxpdChcIiBcIikuZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMywhMSxhLnRvTG93ZXJDYXNlKCksbnVsbCwhMSwhMSl9KTtcbltcImNoZWNrZWRcIixcIm11bHRpcGxlXCIsXCJtdXRlZFwiLFwic2VsZWN0ZWRcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsMywhMCxhLG51bGwsITEsITEpfSk7W1wiY2FwdHVyZVwiLFwiZG93bmxvYWRcIl0uZm9yRWFjaChmdW5jdGlvbihhKXt6W2FdPW5ldyB2KGEsNCwhMSxhLG51bGwsITEsITEpfSk7W1wiY29sc1wiLFwicm93c1wiLFwic2l6ZVwiLFwic3BhblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSw2LCExLGEsbnVsbCwhMSwhMSl9KTtbXCJyb3dTcGFuXCIsXCJzdGFydFwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSw1LCExLGEudG9Mb3dlckNhc2UoKSxudWxsLCExLCExKX0pO3ZhciByYT0vW1xcLTpdKFthLXpdKS9nO2Z1bmN0aW9uIHNhKGEpe3JldHVybiBhWzFdLnRvVXBwZXJDYXNlKCl9XG5cImFjY2VudC1oZWlnaHQgYWxpZ25tZW50LWJhc2VsaW5lIGFyYWJpYy1mb3JtIGJhc2VsaW5lLXNoaWZ0IGNhcC1oZWlnaHQgY2xpcC1wYXRoIGNsaXAtcnVsZSBjb2xvci1pbnRlcnBvbGF0aW9uIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycyBjb2xvci1wcm9maWxlIGNvbG9yLXJlbmRlcmluZyBkb21pbmFudC1iYXNlbGluZSBlbmFibGUtYmFja2dyb3VuZCBmaWxsLW9wYWNpdHkgZmlsbC1ydWxlIGZsb29kLWNvbG9yIGZsb29kLW9wYWNpdHkgZm9udC1mYW1pbHkgZm9udC1zaXplIGZvbnQtc2l6ZS1hZGp1c3QgZm9udC1zdHJldGNoIGZvbnQtc3R5bGUgZm9udC12YXJpYW50IGZvbnQtd2VpZ2h0IGdseXBoLW5hbWUgZ2x5cGgtb3JpZW50YXRpb24taG9yaXpvbnRhbCBnbHlwaC1vcmllbnRhdGlvbi12ZXJ0aWNhbCBob3Jpei1hZHYteCBob3Jpei1vcmlnaW4teCBpbWFnZS1yZW5kZXJpbmcgbGV0dGVyLXNwYWNpbmcgbGlnaHRpbmctY29sb3IgbWFya2VyLWVuZCBtYXJrZXItbWlkIG1hcmtlci1zdGFydCBvdmVybGluZS1wb3NpdGlvbiBvdmVybGluZS10aGlja25lc3MgcGFpbnQtb3JkZXIgcGFub3NlLTEgcG9pbnRlci1ldmVudHMgcmVuZGVyaW5nLWludGVudCBzaGFwZS1yZW5kZXJpbmcgc3RvcC1jb2xvciBzdG9wLW9wYWNpdHkgc3RyaWtldGhyb3VnaC1wb3NpdGlvbiBzdHJpa2V0aHJvdWdoLXRoaWNrbmVzcyBzdHJva2UtZGFzaGFycmF5IHN0cm9rZS1kYXNob2Zmc2V0IHN0cm9rZS1saW5lY2FwIHN0cm9rZS1saW5lam9pbiBzdHJva2UtbWl0ZXJsaW1pdCBzdHJva2Utb3BhY2l0eSBzdHJva2Utd2lkdGggdGV4dC1hbmNob3IgdGV4dC1kZWNvcmF0aW9uIHRleHQtcmVuZGVyaW5nIHVuZGVybGluZS1wb3NpdGlvbiB1bmRlcmxpbmUtdGhpY2tuZXNzIHVuaWNvZGUtYmlkaSB1bmljb2RlLXJhbmdlIHVuaXRzLXBlci1lbSB2LWFscGhhYmV0aWMgdi1oYW5naW5nIHYtaWRlb2dyYXBoaWMgdi1tYXRoZW1hdGljYWwgdmVjdG9yLWVmZmVjdCB2ZXJ0LWFkdi15IHZlcnQtb3JpZ2luLXggdmVydC1vcmlnaW4teSB3b3JkLXNwYWNpbmcgd3JpdGluZy1tb2RlIHhtbG5zOnhsaW5rIHgtaGVpZ2h0XCIuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oYSl7dmFyIGI9YS5yZXBsYWNlKHJhLFxuc2EpO3pbYl09bmV3IHYoYiwxLCExLGEsbnVsbCwhMSwhMSl9KTtcInhsaW5rOmFjdHVhdGUgeGxpbms6YXJjcm9sZSB4bGluazpyb2xlIHhsaW5rOnNob3cgeGxpbms6dGl0bGUgeGxpbms6dHlwZVwiLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWEucmVwbGFjZShyYSxzYSk7eltiXT1uZXcgdihiLDEsITEsYSxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwhMSwhMSl9KTtbXCJ4bWw6YmFzZVwiLFwieG1sOmxhbmdcIixcInhtbDpzcGFjZVwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBiPWEucmVwbGFjZShyYSxzYSk7eltiXT1uZXcgdihiLDEsITEsYSxcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLCExLCExKX0pO1tcInRhYkluZGV4XCIsXCJjcm9zc09yaWdpblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSwxLCExLGEudG9Mb3dlckNhc2UoKSxudWxsLCExLCExKX0pO1xuei54bGlua0hyZWY9bmV3IHYoXCJ4bGlua0hyZWZcIiwxLCExLFwieGxpbms6aHJlZlwiLFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCEwLCExKTtbXCJzcmNcIixcImhyZWZcIixcImFjdGlvblwiLFwiZm9ybUFjdGlvblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3pbYV09bmV3IHYoYSwxLCExLGEudG9Mb3dlckNhc2UoKSxudWxsLCEwLCEwKX0pO1xuZnVuY3Rpb24gdGEoYSxiLGMsZCl7dmFyIGU9ei5oYXNPd25Qcm9wZXJ0eShiKT96W2JdOm51bGw7aWYobnVsbCE9PWU/MCE9PWUudHlwZTpkfHwhKDI8Yi5sZW5ndGgpfHxcIm9cIiE9PWJbMF0mJlwiT1wiIT09YlswXXx8XCJuXCIhPT1iWzFdJiZcIk5cIiE9PWJbMV0pcWEoYixjLGUsZCkmJihjPW51bGwpLGR8fG51bGw9PT1lP29hKGIpJiYobnVsbD09PWM/YS5yZW1vdmVBdHRyaWJ1dGUoYik6YS5zZXRBdHRyaWJ1dGUoYixcIlwiK2MpKTplLm11c3RVc2VQcm9wZXJ0eT9hW2UucHJvcGVydHlOYW1lXT1udWxsPT09Yz8zPT09ZS50eXBlPyExOlwiXCI6YzooYj1lLmF0dHJpYnV0ZU5hbWUsZD1lLmF0dHJpYnV0ZU5hbWVzcGFjZSxudWxsPT09Yz9hLnJlbW92ZUF0dHJpYnV0ZShiKTooZT1lLnR5cGUsYz0zPT09ZXx8ND09PWUmJiEwPT09Yz9cIlwiOlwiXCIrYyxkP2Euc2V0QXR0cmlidXRlTlMoZCxiLGMpOmEuc2V0QXR0cmlidXRlKGIsYykpKX1cbnZhciB1YT1hYS5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRCx2YT1TeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKSx3YT1TeW1ib2wuZm9yKFwicmVhY3QucG9ydGFsXCIpLHlhPVN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSx6YT1TeW1ib2wuZm9yKFwicmVhY3Quc3RyaWN0X21vZGVcIiksQWE9U3ltYm9sLmZvcihcInJlYWN0LnByb2ZpbGVyXCIpLEJhPVN5bWJvbC5mb3IoXCJyZWFjdC5wcm92aWRlclwiKSxDYT1TeW1ib2wuZm9yKFwicmVhY3QuY29udGV4dFwiKSxEYT1TeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIiksRWE9U3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpLEZhPVN5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZV9saXN0XCIpLEdhPVN5bWJvbC5mb3IoXCJyZWFjdC5tZW1vXCIpLEhhPVN5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpO1N5bWJvbC5mb3IoXCJyZWFjdC5zY29wZVwiKTtTeW1ib2wuZm9yKFwicmVhY3QuZGVidWdfdHJhY2VfbW9kZVwiKTtcbnZhciBJYT1TeW1ib2wuZm9yKFwicmVhY3Qub2Zmc2NyZWVuXCIpO1N5bWJvbC5mb3IoXCJyZWFjdC5sZWdhY3lfaGlkZGVuXCIpO1N5bWJvbC5mb3IoXCJyZWFjdC5jYWNoZVwiKTtTeW1ib2wuZm9yKFwicmVhY3QudHJhY2luZ19tYXJrZXJcIik7dmFyIEphPVN5bWJvbC5pdGVyYXRvcjtmdW5jdGlvbiBLYShhKXtpZihudWxsPT09YXx8XCJvYmplY3RcIiE9PXR5cGVvZiBhKXJldHVybiBudWxsO2E9SmEmJmFbSmFdfHxhW1wiQEBpdGVyYXRvclwiXTtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYT9hOm51bGx9dmFyIEE9T2JqZWN0LmFzc2lnbixMYTtmdW5jdGlvbiBNYShhKXtpZih2b2lkIDA9PT1MYSl0cnl7dGhyb3cgRXJyb3IoKTt9Y2F0Y2goYyl7dmFyIGI9Yy5zdGFjay50cmltKCkubWF0Y2goL1xcbiggKihhdCApPykvKTtMYT1iJiZiWzFdfHxcIlwifXJldHVyblwiXFxuXCIrTGErYX12YXIgTmE9ITE7XG5mdW5jdGlvbiBPYShhLGIpe2lmKCFhfHxOYSlyZXR1cm5cIlwiO05hPSEwO3ZhciBjPUVycm9yLnByZXBhcmVTdGFja1RyYWNlO0Vycm9yLnByZXBhcmVTdGFja1RyYWNlPXZvaWQgMDt0cnl7aWYoYilpZihiPWZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoKTt9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShiLnByb3RvdHlwZSxcInByb3BzXCIse3NldDpmdW5jdGlvbigpe3Rocm93IEVycm9yKCk7fX0pLFwib2JqZWN0XCI9PT10eXBlb2YgUmVmbGVjdCYmUmVmbGVjdC5jb25zdHJ1Y3Qpe3RyeXtSZWZsZWN0LmNvbnN0cnVjdChiLFtdKX1jYXRjaChsKXt2YXIgZD1sfVJlZmxlY3QuY29uc3RydWN0KGEsW10sYil9ZWxzZXt0cnl7Yi5jYWxsKCl9Y2F0Y2gobCl7ZD1sfWEuY2FsbChiLnByb3RvdHlwZSl9ZWxzZXt0cnl7dGhyb3cgRXJyb3IoKTt9Y2F0Y2gobCl7ZD1sfWEoKX19Y2F0Y2gobCl7aWYobCYmZCYmXCJzdHJpbmdcIj09PXR5cGVvZiBsLnN0YWNrKXtmb3IodmFyIGU9bC5zdGFjay5zcGxpdChcIlxcblwiKSxcbmY9ZC5zdGFjay5zcGxpdChcIlxcblwiKSxnPWUubGVuZ3RoLTEsaD1mLmxlbmd0aC0xOzE8PWcmJjA8PWgmJmVbZ10hPT1mW2hdOyloLS07Zm9yKDsxPD1nJiYwPD1oO2ctLSxoLS0paWYoZVtnXSE9PWZbaF0pe2lmKDEhPT1nfHwxIT09aCl7ZG8gaWYoZy0tLGgtLSwwPmh8fGVbZ10hPT1mW2hdKXt2YXIgaz1cIlxcblwiK2VbZ10ucmVwbGFjZShcIiBhdCBuZXcgXCIsXCIgYXQgXCIpO2EuZGlzcGxheU5hbWUmJmsuaW5jbHVkZXMoXCI8YW5vbnltb3VzPlwiKSYmKGs9ay5yZXBsYWNlKFwiPGFub255bW91cz5cIixhLmRpc3BsYXlOYW1lKSk7cmV0dXJuIGt9d2hpbGUoMTw9ZyYmMDw9aCl9YnJlYWt9fX1maW5hbGx5e05hPSExLEVycm9yLnByZXBhcmVTdGFja1RyYWNlPWN9cmV0dXJuKGE9YT9hLmRpc3BsYXlOYW1lfHxhLm5hbWU6XCJcIik/TWEoYSk6XCJcIn1cbmZ1bmN0aW9uIFBhKGEpe3N3aXRjaChhLnRhZyl7Y2FzZSA1OnJldHVybiBNYShhLnR5cGUpO2Nhc2UgMTY6cmV0dXJuIE1hKFwiTGF6eVwiKTtjYXNlIDEzOnJldHVybiBNYShcIlN1c3BlbnNlXCIpO2Nhc2UgMTk6cmV0dXJuIE1hKFwiU3VzcGVuc2VMaXN0XCIpO2Nhc2UgMDpjYXNlIDI6Y2FzZSAxNTpyZXR1cm4gYT1PYShhLnR5cGUsITEpLGE7Y2FzZSAxMTpyZXR1cm4gYT1PYShhLnR5cGUucmVuZGVyLCExKSxhO2Nhc2UgMTpyZXR1cm4gYT1PYShhLnR5cGUsITApLGE7ZGVmYXVsdDpyZXR1cm5cIlwifX1cbmZ1bmN0aW9uIFFhKGEpe2lmKG51bGw9PWEpcmV0dXJuIG51bGw7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGEpcmV0dXJuIGEuZGlzcGxheU5hbWV8fGEubmFtZXx8bnVsbDtpZihcInN0cmluZ1wiPT09dHlwZW9mIGEpcmV0dXJuIGE7c3dpdGNoKGEpe2Nhc2UgeWE6cmV0dXJuXCJGcmFnbWVudFwiO2Nhc2Ugd2E6cmV0dXJuXCJQb3J0YWxcIjtjYXNlIEFhOnJldHVyblwiUHJvZmlsZXJcIjtjYXNlIHphOnJldHVyblwiU3RyaWN0TW9kZVwiO2Nhc2UgRWE6cmV0dXJuXCJTdXNwZW5zZVwiO2Nhc2UgRmE6cmV0dXJuXCJTdXNwZW5zZUxpc3RcIn1pZihcIm9iamVjdFwiPT09dHlwZW9mIGEpc3dpdGNoKGEuJCR0eXBlb2Ype2Nhc2UgQ2E6cmV0dXJuKGEuZGlzcGxheU5hbWV8fFwiQ29udGV4dFwiKStcIi5Db25zdW1lclwiO2Nhc2UgQmE6cmV0dXJuKGEuX2NvbnRleHQuZGlzcGxheU5hbWV8fFwiQ29udGV4dFwiKStcIi5Qcm92aWRlclwiO2Nhc2UgRGE6dmFyIGI9YS5yZW5kZXI7YT1hLmRpc3BsYXlOYW1lO2F8fChhPWIuZGlzcGxheU5hbWV8fFxuYi5uYW1lfHxcIlwiLGE9XCJcIiE9PWE/XCJGb3J3YXJkUmVmKFwiK2ErXCIpXCI6XCJGb3J3YXJkUmVmXCIpO3JldHVybiBhO2Nhc2UgR2E6cmV0dXJuIGI9YS5kaXNwbGF5TmFtZXx8bnVsbCxudWxsIT09Yj9iOlFhKGEudHlwZSl8fFwiTWVtb1wiO2Nhc2UgSGE6Yj1hLl9wYXlsb2FkO2E9YS5faW5pdDt0cnl7cmV0dXJuIFFhKGEoYikpfWNhdGNoKGMpe319cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBSYShhKXt2YXIgYj1hLnR5cGU7c3dpdGNoKGEudGFnKXtjYXNlIDI0OnJldHVyblwiQ2FjaGVcIjtjYXNlIDk6cmV0dXJuKGIuZGlzcGxheU5hbWV8fFwiQ29udGV4dFwiKStcIi5Db25zdW1lclwiO2Nhc2UgMTA6cmV0dXJuKGIuX2NvbnRleHQuZGlzcGxheU5hbWV8fFwiQ29udGV4dFwiKStcIi5Qcm92aWRlclwiO2Nhc2UgMTg6cmV0dXJuXCJEZWh5ZHJhdGVkRnJhZ21lbnRcIjtjYXNlIDExOnJldHVybiBhPWIucmVuZGVyLGE9YS5kaXNwbGF5TmFtZXx8YS5uYW1lfHxcIlwiLGIuZGlzcGxheU5hbWV8fChcIlwiIT09YT9cIkZvcndhcmRSZWYoXCIrYStcIilcIjpcIkZvcndhcmRSZWZcIik7Y2FzZSA3OnJldHVyblwiRnJhZ21lbnRcIjtjYXNlIDU6cmV0dXJuIGI7Y2FzZSA0OnJldHVyblwiUG9ydGFsXCI7Y2FzZSAzOnJldHVyblwiUm9vdFwiO2Nhc2UgNjpyZXR1cm5cIlRleHRcIjtjYXNlIDE2OnJldHVybiBRYShiKTtjYXNlIDg6cmV0dXJuIGI9PT16YT9cIlN0cmljdE1vZGVcIjpcIk1vZGVcIjtjYXNlIDIyOnJldHVyblwiT2Zmc2NyZWVuXCI7XG5jYXNlIDEyOnJldHVyblwiUHJvZmlsZXJcIjtjYXNlIDIxOnJldHVyblwiU2NvcGVcIjtjYXNlIDEzOnJldHVyblwiU3VzcGVuc2VcIjtjYXNlIDE5OnJldHVyblwiU3VzcGVuc2VMaXN0XCI7Y2FzZSAyNTpyZXR1cm5cIlRyYWNpbmdNYXJrZXJcIjtjYXNlIDE6Y2FzZSAwOmNhc2UgMTc6Y2FzZSAyOmNhc2UgMTQ6Y2FzZSAxNTppZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilyZXR1cm4gYi5kaXNwbGF5TmFtZXx8Yi5uYW1lfHxudWxsO2lmKFwic3RyaW5nXCI9PT10eXBlb2YgYilyZXR1cm4gYn1yZXR1cm4gbnVsbH1mdW5jdGlvbiBTYShhKXtzd2l0Y2godHlwZW9mIGEpe2Nhc2UgXCJib29sZWFuXCI6Y2FzZSBcIm51bWJlclwiOmNhc2UgXCJzdHJpbmdcIjpjYXNlIFwidW5kZWZpbmVkXCI6cmV0dXJuIGE7Y2FzZSBcIm9iamVjdFwiOnJldHVybiBhO2RlZmF1bHQ6cmV0dXJuXCJcIn19XG5mdW5jdGlvbiBUYShhKXt2YXIgYj1hLnR5cGU7cmV0dXJuKGE9YS5ub2RlTmFtZSkmJlwiaW5wdXRcIj09PWEudG9Mb3dlckNhc2UoKSYmKFwiY2hlY2tib3hcIj09PWJ8fFwicmFkaW9cIj09PWIpfVxuZnVuY3Rpb24gVWEoYSl7dmFyIGI9VGEoYSk/XCJjaGVja2VkXCI6XCJ2YWx1ZVwiLGM9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihhLmNvbnN0cnVjdG9yLnByb3RvdHlwZSxiKSxkPVwiXCIrYVtiXTtpZighYS5oYXNPd25Qcm9wZXJ0eShiKSYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjJiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgYy5nZXQmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBjLnNldCl7dmFyIGU9Yy5nZXQsZj1jLnNldDtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxiLHtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGUuY2FsbCh0aGlzKX0sc2V0OmZ1bmN0aW9uKGEpe2Q9XCJcIithO2YuY2FsbCh0aGlzLGEpfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLGIse2VudW1lcmFibGU6Yy5lbnVtZXJhYmxlfSk7cmV0dXJue2dldFZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIGR9LHNldFZhbHVlOmZ1bmN0aW9uKGEpe2Q9XCJcIithfSxzdG9wVHJhY2tpbmc6ZnVuY3Rpb24oKXthLl92YWx1ZVRyYWNrZXI9XG5udWxsO2RlbGV0ZSBhW2JdfX19fWZ1bmN0aW9uIFZhKGEpe2EuX3ZhbHVlVHJhY2tlcnx8KGEuX3ZhbHVlVHJhY2tlcj1VYShhKSl9ZnVuY3Rpb24gV2EoYSl7aWYoIWEpcmV0dXJuITE7dmFyIGI9YS5fdmFsdWVUcmFja2VyO2lmKCFiKXJldHVybiEwO3ZhciBjPWIuZ2V0VmFsdWUoKTt2YXIgZD1cIlwiO2EmJihkPVRhKGEpP2EuY2hlY2tlZD9cInRydWVcIjpcImZhbHNlXCI6YS52YWx1ZSk7YT1kO3JldHVybiBhIT09Yz8oYi5zZXRWYWx1ZShhKSwhMCk6ITF9ZnVuY3Rpb24gWGEoYSl7YT1hfHwoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudD9kb2N1bWVudDp2b2lkIDApO2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgYSlyZXR1cm4gbnVsbDt0cnl7cmV0dXJuIGEuYWN0aXZlRWxlbWVudHx8YS5ib2R5fWNhdGNoKGIpe3JldHVybiBhLmJvZHl9fVxuZnVuY3Rpb24gWWEoYSxiKXt2YXIgYz1iLmNoZWNrZWQ7cmV0dXJuIEEoe30sYix7ZGVmYXVsdENoZWNrZWQ6dm9pZCAwLGRlZmF1bHRWYWx1ZTp2b2lkIDAsdmFsdWU6dm9pZCAwLGNoZWNrZWQ6bnVsbCE9Yz9jOmEuX3dyYXBwZXJTdGF0ZS5pbml0aWFsQ2hlY2tlZH0pfWZ1bmN0aW9uIFphKGEsYil7dmFyIGM9bnVsbD09Yi5kZWZhdWx0VmFsdWU/XCJcIjpiLmRlZmF1bHRWYWx1ZSxkPW51bGwhPWIuY2hlY2tlZD9iLmNoZWNrZWQ6Yi5kZWZhdWx0Q2hlY2tlZDtjPVNhKG51bGwhPWIudmFsdWU/Yi52YWx1ZTpjKTthLl93cmFwcGVyU3RhdGU9e2luaXRpYWxDaGVja2VkOmQsaW5pdGlhbFZhbHVlOmMsY29udHJvbGxlZDpcImNoZWNrYm94XCI9PT1iLnR5cGV8fFwicmFkaW9cIj09PWIudHlwZT9udWxsIT1iLmNoZWNrZWQ6bnVsbCE9Yi52YWx1ZX19ZnVuY3Rpb24gYWIoYSxiKXtiPWIuY2hlY2tlZDtudWxsIT1iJiZ0YShhLFwiY2hlY2tlZFwiLGIsITEpfVxuZnVuY3Rpb24gYmIoYSxiKXthYihhLGIpO3ZhciBjPVNhKGIudmFsdWUpLGQ9Yi50eXBlO2lmKG51bGwhPWMpaWYoXCJudW1iZXJcIj09PWQpe2lmKDA9PT1jJiZcIlwiPT09YS52YWx1ZXx8YS52YWx1ZSE9YylhLnZhbHVlPVwiXCIrY31lbHNlIGEudmFsdWUhPT1cIlwiK2MmJihhLnZhbHVlPVwiXCIrYyk7ZWxzZSBpZihcInN1Ym1pdFwiPT09ZHx8XCJyZXNldFwiPT09ZCl7YS5yZW1vdmVBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtyZXR1cm59Yi5oYXNPd25Qcm9wZXJ0eShcInZhbHVlXCIpP2NiKGEsYi50eXBlLGMpOmIuaGFzT3duUHJvcGVydHkoXCJkZWZhdWx0VmFsdWVcIikmJmNiKGEsYi50eXBlLFNhKGIuZGVmYXVsdFZhbHVlKSk7bnVsbD09Yi5jaGVja2VkJiZudWxsIT1iLmRlZmF1bHRDaGVja2VkJiYoYS5kZWZhdWx0Q2hlY2tlZD0hIWIuZGVmYXVsdENoZWNrZWQpfVxuZnVuY3Rpb24gZGIoYSxiLGMpe2lmKGIuaGFzT3duUHJvcGVydHkoXCJ2YWx1ZVwiKXx8Yi5oYXNPd25Qcm9wZXJ0eShcImRlZmF1bHRWYWx1ZVwiKSl7dmFyIGQ9Yi50eXBlO2lmKCEoXCJzdWJtaXRcIiE9PWQmJlwicmVzZXRcIiE9PWR8fHZvaWQgMCE9PWIudmFsdWUmJm51bGwhPT1iLnZhbHVlKSlyZXR1cm47Yj1cIlwiK2EuX3dyYXBwZXJTdGF0ZS5pbml0aWFsVmFsdWU7Y3x8Yj09PWEudmFsdWV8fChhLnZhbHVlPWIpO2EuZGVmYXVsdFZhbHVlPWJ9Yz1hLm5hbWU7XCJcIiE9PWMmJihhLm5hbWU9XCJcIik7YS5kZWZhdWx0Q2hlY2tlZD0hIWEuX3dyYXBwZXJTdGF0ZS5pbml0aWFsQ2hlY2tlZDtcIlwiIT09YyYmKGEubmFtZT1jKX1cbmZ1bmN0aW9uIGNiKGEsYixjKXtpZihcIm51bWJlclwiIT09Ynx8WGEoYS5vd25lckRvY3VtZW50KSE9PWEpbnVsbD09Yz9hLmRlZmF1bHRWYWx1ZT1cIlwiK2EuX3dyYXBwZXJTdGF0ZS5pbml0aWFsVmFsdWU6YS5kZWZhdWx0VmFsdWUhPT1cIlwiK2MmJihhLmRlZmF1bHRWYWx1ZT1cIlwiK2MpfXZhciBlYj1BcnJheS5pc0FycmF5O1xuZnVuY3Rpb24gZmIoYSxiLGMsZCl7YT1hLm9wdGlvbnM7aWYoYil7Yj17fTtmb3IodmFyIGU9MDtlPGMubGVuZ3RoO2UrKyliW1wiJFwiK2NbZV1dPSEwO2ZvcihjPTA7YzxhLmxlbmd0aDtjKyspZT1iLmhhc093blByb3BlcnR5KFwiJFwiK2FbY10udmFsdWUpLGFbY10uc2VsZWN0ZWQhPT1lJiYoYVtjXS5zZWxlY3RlZD1lKSxlJiZkJiYoYVtjXS5kZWZhdWx0U2VsZWN0ZWQ9ITApfWVsc2V7Yz1cIlwiK1NhKGMpO2I9bnVsbDtmb3IoZT0wO2U8YS5sZW5ndGg7ZSsrKXtpZihhW2VdLnZhbHVlPT09Yyl7YVtlXS5zZWxlY3RlZD0hMDtkJiYoYVtlXS5kZWZhdWx0U2VsZWN0ZWQ9ITApO3JldHVybn1udWxsIT09Ynx8YVtlXS5kaXNhYmxlZHx8KGI9YVtlXSl9bnVsbCE9PWImJihiLnNlbGVjdGVkPSEwKX19XG5mdW5jdGlvbiBnYihhLGIpe2lmKG51bGwhPWIuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpdGhyb3cgRXJyb3IocCg5MSkpO3JldHVybiBBKHt9LGIse3ZhbHVlOnZvaWQgMCxkZWZhdWx0VmFsdWU6dm9pZCAwLGNoaWxkcmVuOlwiXCIrYS5fd3JhcHBlclN0YXRlLmluaXRpYWxWYWx1ZX0pfWZ1bmN0aW9uIGhiKGEsYil7dmFyIGM9Yi52YWx1ZTtpZihudWxsPT1jKXtjPWIuY2hpbGRyZW47Yj1iLmRlZmF1bHRWYWx1ZTtpZihudWxsIT1jKXtpZihudWxsIT1iKXRocm93IEVycm9yKHAoOTIpKTtpZihlYihjKSl7aWYoMTxjLmxlbmd0aCl0aHJvdyBFcnJvcihwKDkzKSk7Yz1jWzBdfWI9Y31udWxsPT1iJiYoYj1cIlwiKTtjPWJ9YS5fd3JhcHBlclN0YXRlPXtpbml0aWFsVmFsdWU6U2EoYyl9fVxuZnVuY3Rpb24gaWIoYSxiKXt2YXIgYz1TYShiLnZhbHVlKSxkPVNhKGIuZGVmYXVsdFZhbHVlKTtudWxsIT1jJiYoYz1cIlwiK2MsYyE9PWEudmFsdWUmJihhLnZhbHVlPWMpLG51bGw9PWIuZGVmYXVsdFZhbHVlJiZhLmRlZmF1bHRWYWx1ZSE9PWMmJihhLmRlZmF1bHRWYWx1ZT1jKSk7bnVsbCE9ZCYmKGEuZGVmYXVsdFZhbHVlPVwiXCIrZCl9ZnVuY3Rpb24gamIoYSl7dmFyIGI9YS50ZXh0Q29udGVudDtiPT09YS5fd3JhcHBlclN0YXRlLmluaXRpYWxWYWx1ZSYmXCJcIiE9PWImJm51bGwhPT1iJiYoYS52YWx1ZT1iKX1mdW5jdGlvbiBrYihhKXtzd2l0Y2goYSl7Y2FzZSBcInN2Z1wiOnJldHVyblwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtjYXNlIFwibWF0aFwiOnJldHVyblwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO2RlZmF1bHQ6cmV0dXJuXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJ9fVxuZnVuY3Rpb24gbGIoYSxiKXtyZXR1cm4gbnVsbD09YXx8XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI9PT1hP2tiKGIpOlwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj09PWEmJlwiZm9yZWlnbk9iamVjdFwiPT09Yj9cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjphfVxudmFyIG1iLG5iPWZ1bmN0aW9uKGEpe3JldHVyblwidW5kZWZpbmVkXCIhPT10eXBlb2YgTVNBcHAmJk1TQXBwLmV4ZWNVbnNhZmVMb2NhbEZ1bmN0aW9uP2Z1bmN0aW9uKGIsYyxkLGUpe01TQXBwLmV4ZWNVbnNhZmVMb2NhbEZ1bmN0aW9uKGZ1bmN0aW9uKCl7cmV0dXJuIGEoYixjLGQsZSl9KX06YX0oZnVuY3Rpb24oYSxiKXtpZihcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIhPT1hLm5hbWVzcGFjZVVSSXx8XCJpbm5lckhUTUxcImluIGEpYS5pbm5lckhUTUw9YjtlbHNle21iPW1ifHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO21iLmlubmVySFRNTD1cIjxzdmc+XCIrYi52YWx1ZU9mKCkudG9TdHJpbmcoKStcIjwvc3ZnPlwiO2ZvcihiPW1iLmZpcnN0Q2hpbGQ7YS5maXJzdENoaWxkOylhLnJlbW92ZUNoaWxkKGEuZmlyc3RDaGlsZCk7Zm9yKDtiLmZpcnN0Q2hpbGQ7KWEuYXBwZW5kQ2hpbGQoYi5maXJzdENoaWxkKX19KTtcbmZ1bmN0aW9uIG9iKGEsYil7aWYoYil7dmFyIGM9YS5maXJzdENoaWxkO2lmKGMmJmM9PT1hLmxhc3RDaGlsZCYmMz09PWMubm9kZVR5cGUpe2Mubm9kZVZhbHVlPWI7cmV0dXJufX1hLnRleHRDb250ZW50PWJ9XG52YXIgcGI9e2FuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiEwLGFzcGVjdFJhdGlvOiEwLGJvcmRlckltYWdlT3V0c2V0OiEwLGJvcmRlckltYWdlU2xpY2U6ITAsYm9yZGVySW1hZ2VXaWR0aDohMCxib3hGbGV4OiEwLGJveEZsZXhHcm91cDohMCxib3hPcmRpbmFsR3JvdXA6ITAsY29sdW1uQ291bnQ6ITAsY29sdW1uczohMCxmbGV4OiEwLGZsZXhHcm93OiEwLGZsZXhQb3NpdGl2ZTohMCxmbGV4U2hyaW5rOiEwLGZsZXhOZWdhdGl2ZTohMCxmbGV4T3JkZXI6ITAsZ3JpZEFyZWE6ITAsZ3JpZFJvdzohMCxncmlkUm93RW5kOiEwLGdyaWRSb3dTcGFuOiEwLGdyaWRSb3dTdGFydDohMCxncmlkQ29sdW1uOiEwLGdyaWRDb2x1bW5FbmQ6ITAsZ3JpZENvbHVtblNwYW46ITAsZ3JpZENvbHVtblN0YXJ0OiEwLGZvbnRXZWlnaHQ6ITAsbGluZUNsYW1wOiEwLGxpbmVIZWlnaHQ6ITAsb3BhY2l0eTohMCxvcmRlcjohMCxvcnBoYW5zOiEwLHRhYlNpemU6ITAsd2lkb3dzOiEwLHpJbmRleDohMCxcbnpvb206ITAsZmlsbE9wYWNpdHk6ITAsZmxvb2RPcGFjaXR5OiEwLHN0b3BPcGFjaXR5OiEwLHN0cm9rZURhc2hhcnJheTohMCxzdHJva2VEYXNob2Zmc2V0OiEwLHN0cm9rZU1pdGVybGltaXQ6ITAsc3Ryb2tlT3BhY2l0eTohMCxzdHJva2VXaWR0aDohMH0scWI9W1wiV2Via2l0XCIsXCJtc1wiLFwiTW96XCIsXCJPXCJdO09iamVjdC5rZXlzKHBiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3FiLmZvckVhY2goZnVuY3Rpb24oYil7Yj1iK2EuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYS5zdWJzdHJpbmcoMSk7cGJbYl09cGJbYV19KX0pO2Z1bmN0aW9uIHJiKGEsYixjKXtyZXR1cm4gbnVsbD09Ynx8XCJib29sZWFuXCI9PT10eXBlb2YgYnx8XCJcIj09PWI/XCJcIjpjfHxcIm51bWJlclwiIT09dHlwZW9mIGJ8fDA9PT1ifHxwYi5oYXNPd25Qcm9wZXJ0eShhKSYmcGJbYV0/KFwiXCIrYikudHJpbSgpOmIrXCJweFwifVxuZnVuY3Rpb24gc2IoYSxiKXthPWEuc3R5bGU7Zm9yKHZhciBjIGluIGIpaWYoYi5oYXNPd25Qcm9wZXJ0eShjKSl7dmFyIGQ9MD09PWMuaW5kZXhPZihcIi0tXCIpLGU9cmIoYyxiW2NdLGQpO1wiZmxvYXRcIj09PWMmJihjPVwiY3NzRmxvYXRcIik7ZD9hLnNldFByb3BlcnR5KGMsZSk6YVtjXT1lfX12YXIgdGI9QSh7bWVudWl0ZW06ITB9LHthcmVhOiEwLGJhc2U6ITAsYnI6ITAsY29sOiEwLGVtYmVkOiEwLGhyOiEwLGltZzohMCxpbnB1dDohMCxrZXlnZW46ITAsbGluazohMCxtZXRhOiEwLHBhcmFtOiEwLHNvdXJjZTohMCx0cmFjazohMCx3YnI6ITB9KTtcbmZ1bmN0aW9uIHViKGEsYil7aWYoYil7aWYodGJbYV0mJihudWxsIT1iLmNoaWxkcmVufHxudWxsIT1iLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKSl0aHJvdyBFcnJvcihwKDEzNyxhKSk7aWYobnVsbCE9Yi5kYW5nZXJvdXNseVNldElubmVySFRNTCl7aWYobnVsbCE9Yi5jaGlsZHJlbil0aHJvdyBFcnJvcihwKDYwKSk7aWYoXCJvYmplY3RcIiE9PXR5cGVvZiBiLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MfHwhKFwiX19odG1sXCJpbiBiLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKSl0aHJvdyBFcnJvcihwKDYxKSk7fWlmKG51bGwhPWIuc3R5bGUmJlwib2JqZWN0XCIhPT10eXBlb2YgYi5zdHlsZSl0aHJvdyBFcnJvcihwKDYyKSk7fX1cbmZ1bmN0aW9uIHZiKGEsYil7aWYoLTE9PT1hLmluZGV4T2YoXCItXCIpKXJldHVyblwic3RyaW5nXCI9PT10eXBlb2YgYi5pcztzd2l0Y2goYSl7Y2FzZSBcImFubm90YXRpb24teG1sXCI6Y2FzZSBcImNvbG9yLXByb2ZpbGVcIjpjYXNlIFwiZm9udC1mYWNlXCI6Y2FzZSBcImZvbnQtZmFjZS1zcmNcIjpjYXNlIFwiZm9udC1mYWNlLXVyaVwiOmNhc2UgXCJmb250LWZhY2UtZm9ybWF0XCI6Y2FzZSBcImZvbnQtZmFjZS1uYW1lXCI6Y2FzZSBcIm1pc3NpbmctZ2x5cGhcIjpyZXR1cm4hMTtkZWZhdWx0OnJldHVybiEwfX12YXIgd2I9bnVsbDtmdW5jdGlvbiB4YihhKXthPWEudGFyZ2V0fHxhLnNyY0VsZW1lbnR8fHdpbmRvdzthLmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50JiYoYT1hLmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50KTtyZXR1cm4gMz09PWEubm9kZVR5cGU/YS5wYXJlbnROb2RlOmF9dmFyIHliPW51bGwsemI9bnVsbCxBYj1udWxsO1xuZnVuY3Rpb24gQmIoYSl7aWYoYT1DYihhKSl7aWYoXCJmdW5jdGlvblwiIT09dHlwZW9mIHliKXRocm93IEVycm9yKHAoMjgwKSk7dmFyIGI9YS5zdGF0ZU5vZGU7YiYmKGI9RGIoYikseWIoYS5zdGF0ZU5vZGUsYS50eXBlLGIpKX19ZnVuY3Rpb24gRWIoYSl7emI/QWI/QWIucHVzaChhKTpBYj1bYV06emI9YX1mdW5jdGlvbiBGYigpe2lmKHpiKXt2YXIgYT16YixiPUFiO0FiPXpiPW51bGw7QmIoYSk7aWYoYilmb3IoYT0wO2E8Yi5sZW5ndGg7YSsrKUJiKGJbYV0pfX1mdW5jdGlvbiBHYihhLGIpe3JldHVybiBhKGIpfWZ1bmN0aW9uIEhiKCl7fXZhciBJYj0hMTtmdW5jdGlvbiBKYihhLGIsYyl7aWYoSWIpcmV0dXJuIGEoYixjKTtJYj0hMDt0cnl7cmV0dXJuIEdiKGEsYixjKX1maW5hbGx5e2lmKEliPSExLG51bGwhPT16Ynx8bnVsbCE9PUFiKUhiKCksRmIoKX19XG5mdW5jdGlvbiBLYihhLGIpe3ZhciBjPWEuc3RhdGVOb2RlO2lmKG51bGw9PT1jKXJldHVybiBudWxsO3ZhciBkPURiKGMpO2lmKG51bGw9PT1kKXJldHVybiBudWxsO2M9ZFtiXTthOnN3aXRjaChiKXtjYXNlIFwib25DbGlja1wiOmNhc2UgXCJvbkNsaWNrQ2FwdHVyZVwiOmNhc2UgXCJvbkRvdWJsZUNsaWNrXCI6Y2FzZSBcIm9uRG91YmxlQ2xpY2tDYXB0dXJlXCI6Y2FzZSBcIm9uTW91c2VEb3duXCI6Y2FzZSBcIm9uTW91c2VEb3duQ2FwdHVyZVwiOmNhc2UgXCJvbk1vdXNlTW92ZVwiOmNhc2UgXCJvbk1vdXNlTW92ZUNhcHR1cmVcIjpjYXNlIFwib25Nb3VzZVVwXCI6Y2FzZSBcIm9uTW91c2VVcENhcHR1cmVcIjpjYXNlIFwib25Nb3VzZUVudGVyXCI6KGQ9IWQuZGlzYWJsZWQpfHwoYT1hLnR5cGUsZD0hKFwiYnV0dG9uXCI9PT1hfHxcImlucHV0XCI9PT1hfHxcInNlbGVjdFwiPT09YXx8XCJ0ZXh0YXJlYVwiPT09YSkpO2E9IWQ7YnJlYWsgYTtkZWZhdWx0OmE9ITF9aWYoYSlyZXR1cm4gbnVsbDtpZihjJiZcImZ1bmN0aW9uXCIhPT1cbnR5cGVvZiBjKXRocm93IEVycm9yKHAoMjMxLGIsdHlwZW9mIGMpKTtyZXR1cm4gY312YXIgTGI9ITE7aWYoaWEpdHJ5e3ZhciBNYj17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoTWIsXCJwYXNzaXZlXCIse2dldDpmdW5jdGlvbigpe0xiPSEwfX0pO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLE1iLE1iKTt3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRlc3RcIixNYixNYil9Y2F0Y2goYSl7TGI9ITF9ZnVuY3Rpb24gTmIoYSxiLGMsZCxlLGYsZyxoLGspe3ZhciBsPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywzKTt0cnl7Yi5hcHBseShjLGwpfWNhdGNoKG0pe3RoaXMub25FcnJvcihtKX19dmFyIE9iPSExLFBiPW51bGwsUWI9ITEsUmI9bnVsbCxTYj17b25FcnJvcjpmdW5jdGlvbihhKXtPYj0hMDtQYj1hfX07ZnVuY3Rpb24gVGIoYSxiLGMsZCxlLGYsZyxoLGspe09iPSExO1BiPW51bGw7TmIuYXBwbHkoU2IsYXJndW1lbnRzKX1cbmZ1bmN0aW9uIFViKGEsYixjLGQsZSxmLGcsaCxrKXtUYi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7aWYoT2Ipe2lmKE9iKXt2YXIgbD1QYjtPYj0hMTtQYj1udWxsfWVsc2UgdGhyb3cgRXJyb3IocCgxOTgpKTtRYnx8KFFiPSEwLFJiPWwpfX1mdW5jdGlvbiBWYihhKXt2YXIgYj1hLGM9YTtpZihhLmFsdGVybmF0ZSlmb3IoO2IucmV0dXJuOyliPWIucmV0dXJuO2Vsc2V7YT1iO2RvIGI9YSwwIT09KGIuZmxhZ3MmNDA5OCkmJihjPWIucmV0dXJuKSxhPWIucmV0dXJuO3doaWxlKGEpfXJldHVybiAzPT09Yi50YWc/YzpudWxsfWZ1bmN0aW9uIFdiKGEpe2lmKDEzPT09YS50YWcpe3ZhciBiPWEubWVtb2l6ZWRTdGF0ZTtudWxsPT09YiYmKGE9YS5hbHRlcm5hdGUsbnVsbCE9PWEmJihiPWEubWVtb2l6ZWRTdGF0ZSkpO2lmKG51bGwhPT1iKXJldHVybiBiLmRlaHlkcmF0ZWR9cmV0dXJuIG51bGx9ZnVuY3Rpb24gWGIoYSl7aWYoVmIoYSkhPT1hKXRocm93IEVycm9yKHAoMTg4KSk7fVxuZnVuY3Rpb24gWWIoYSl7dmFyIGI9YS5hbHRlcm5hdGU7aWYoIWIpe2I9VmIoYSk7aWYobnVsbD09PWIpdGhyb3cgRXJyb3IocCgxODgpKTtyZXR1cm4gYiE9PWE/bnVsbDphfWZvcih2YXIgYz1hLGQ9Yjs7KXt2YXIgZT1jLnJldHVybjtpZihudWxsPT09ZSlicmVhazt2YXIgZj1lLmFsdGVybmF0ZTtpZihudWxsPT09Zil7ZD1lLnJldHVybjtpZihudWxsIT09ZCl7Yz1kO2NvbnRpbnVlfWJyZWFrfWlmKGUuY2hpbGQ9PT1mLmNoaWxkKXtmb3IoZj1lLmNoaWxkO2Y7KXtpZihmPT09YylyZXR1cm4gWGIoZSksYTtpZihmPT09ZClyZXR1cm4gWGIoZSksYjtmPWYuc2libGluZ310aHJvdyBFcnJvcihwKDE4OCkpO31pZihjLnJldHVybiE9PWQucmV0dXJuKWM9ZSxkPWY7ZWxzZXtmb3IodmFyIGc9ITEsaD1lLmNoaWxkO2g7KXtpZihoPT09Yyl7Zz0hMDtjPWU7ZD1mO2JyZWFrfWlmKGg9PT1kKXtnPSEwO2Q9ZTtjPWY7YnJlYWt9aD1oLnNpYmxpbmd9aWYoIWcpe2ZvcihoPWYuY2hpbGQ7aDspe2lmKGg9PT1cbmMpe2c9ITA7Yz1mO2Q9ZTticmVha31pZihoPT09ZCl7Zz0hMDtkPWY7Yz1lO2JyZWFrfWg9aC5zaWJsaW5nfWlmKCFnKXRocm93IEVycm9yKHAoMTg5KSk7fX1pZihjLmFsdGVybmF0ZSE9PWQpdGhyb3cgRXJyb3IocCgxOTApKTt9aWYoMyE9PWMudGFnKXRocm93IEVycm9yKHAoMTg4KSk7cmV0dXJuIGMuc3RhdGVOb2RlLmN1cnJlbnQ9PT1jP2E6Yn1mdW5jdGlvbiBaYihhKXthPVliKGEpO3JldHVybiBudWxsIT09YT8kYihhKTpudWxsfWZ1bmN0aW9uICRiKGEpe2lmKDU9PT1hLnRhZ3x8Nj09PWEudGFnKXJldHVybiBhO2ZvcihhPWEuY2hpbGQ7bnVsbCE9PWE7KXt2YXIgYj0kYihhKTtpZihudWxsIT09YilyZXR1cm4gYjthPWEuc2libGluZ31yZXR1cm4gbnVsbH1cbnZhciBhYz1jYS51bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrLGJjPWNhLnVuc3RhYmxlX2NhbmNlbENhbGxiYWNrLGNjPWNhLnVuc3RhYmxlX3Nob3VsZFlpZWxkLGRjPWNhLnVuc3RhYmxlX3JlcXVlc3RQYWludCxCPWNhLnVuc3RhYmxlX25vdyxlYz1jYS51bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCxmYz1jYS51bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eSxnYz1jYS51bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSxoYz1jYS51bnN0YWJsZV9Ob3JtYWxQcmlvcml0eSxpYz1jYS51bnN0YWJsZV9Mb3dQcmlvcml0eSxqYz1jYS51bnN0YWJsZV9JZGxlUHJpb3JpdHksa2M9bnVsbCxsYz1udWxsO2Z1bmN0aW9uIG1jKGEpe2lmKGxjJiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgbGMub25Db21taXRGaWJlclJvb3QpdHJ5e2xjLm9uQ29tbWl0RmliZXJSb290KGtjLGEsdm9pZCAwLDEyOD09PShhLmN1cnJlbnQuZmxhZ3MmMTI4KSl9Y2F0Y2goYil7fX1cbnZhciBvYz1NYXRoLmNsejMyP01hdGguY2x6MzI6bmMscGM9TWF0aC5sb2cscWM9TWF0aC5MTjI7ZnVuY3Rpb24gbmMoYSl7YT4+Pj0wO3JldHVybiAwPT09YT8zMjozMS0ocGMoYSkvcWN8MCl8MH12YXIgcmM9NjQsc2M9NDE5NDMwNDtcbmZ1bmN0aW9uIHRjKGEpe3N3aXRjaChhJi1hKXtjYXNlIDE6cmV0dXJuIDE7Y2FzZSAyOnJldHVybiAyO2Nhc2UgNDpyZXR1cm4gNDtjYXNlIDg6cmV0dXJuIDg7Y2FzZSAxNjpyZXR1cm4gMTY7Y2FzZSAzMjpyZXR1cm4gMzI7Y2FzZSA2NDpjYXNlIDEyODpjYXNlIDI1NjpjYXNlIDUxMjpjYXNlIDEwMjQ6Y2FzZSAyMDQ4OmNhc2UgNDA5NjpjYXNlIDgxOTI6Y2FzZSAxNjM4NDpjYXNlIDMyNzY4OmNhc2UgNjU1MzY6Y2FzZSAxMzEwNzI6Y2FzZSAyNjIxNDQ6Y2FzZSA1MjQyODg6Y2FzZSAxMDQ4NTc2OmNhc2UgMjA5NzE1MjpyZXR1cm4gYSY0MTk0MjQwO2Nhc2UgNDE5NDMwNDpjYXNlIDgzODg2MDg6Y2FzZSAxNjc3NzIxNjpjYXNlIDMzNTU0NDMyOmNhc2UgNjcxMDg4NjQ6cmV0dXJuIGEmMTMwMDIzNDI0O2Nhc2UgMTM0MjE3NzI4OnJldHVybiAxMzQyMTc3Mjg7Y2FzZSAyNjg0MzU0NTY6cmV0dXJuIDI2ODQzNTQ1NjtjYXNlIDUzNjg3MDkxMjpyZXR1cm4gNTM2ODcwOTEyO2Nhc2UgMTA3Mzc0MTgyNDpyZXR1cm4gMTA3Mzc0MTgyNDtcbmRlZmF1bHQ6cmV0dXJuIGF9fWZ1bmN0aW9uIHVjKGEsYil7dmFyIGM9YS5wZW5kaW5nTGFuZXM7aWYoMD09PWMpcmV0dXJuIDA7dmFyIGQ9MCxlPWEuc3VzcGVuZGVkTGFuZXMsZj1hLnBpbmdlZExhbmVzLGc9YyYyNjg0MzU0NTU7aWYoMCE9PWcpe3ZhciBoPWcmfmU7MCE9PWg/ZD10YyhoKTooZiY9ZywwIT09ZiYmKGQ9dGMoZikpKX1lbHNlIGc9YyZ+ZSwwIT09Zz9kPXRjKGcpOjAhPT1mJiYoZD10YyhmKSk7aWYoMD09PWQpcmV0dXJuIDA7aWYoMCE9PWImJmIhPT1kJiYwPT09KGImZSkmJihlPWQmLWQsZj1iJi1iLGU+PWZ8fDE2PT09ZSYmMCE9PShmJjQxOTQyNDApKSlyZXR1cm4gYjswIT09KGQmNCkmJihkfD1jJjE2KTtiPWEuZW50YW5nbGVkTGFuZXM7aWYoMCE9PWIpZm9yKGE9YS5lbnRhbmdsZW1lbnRzLGImPWQ7MDxiOyljPTMxLW9jKGIpLGU9MTw8YyxkfD1hW2NdLGImPX5lO3JldHVybiBkfVxuZnVuY3Rpb24gdmMoYSxiKXtzd2l0Y2goYSl7Y2FzZSAxOmNhc2UgMjpjYXNlIDQ6cmV0dXJuIGIrMjUwO2Nhc2UgODpjYXNlIDE2OmNhc2UgMzI6Y2FzZSA2NDpjYXNlIDEyODpjYXNlIDI1NjpjYXNlIDUxMjpjYXNlIDEwMjQ6Y2FzZSAyMDQ4OmNhc2UgNDA5NjpjYXNlIDgxOTI6Y2FzZSAxNjM4NDpjYXNlIDMyNzY4OmNhc2UgNjU1MzY6Y2FzZSAxMzEwNzI6Y2FzZSAyNjIxNDQ6Y2FzZSA1MjQyODg6Y2FzZSAxMDQ4NTc2OmNhc2UgMjA5NzE1MjpyZXR1cm4gYis1RTM7Y2FzZSA0MTk0MzA0OmNhc2UgODM4ODYwODpjYXNlIDE2Nzc3MjE2OmNhc2UgMzM1NTQ0MzI6Y2FzZSA2NzEwODg2NDpyZXR1cm4tMTtjYXNlIDEzNDIxNzcyODpjYXNlIDI2ODQzNTQ1NjpjYXNlIDUzNjg3MDkxMjpjYXNlIDEwNzM3NDE4MjQ6cmV0dXJuLTE7ZGVmYXVsdDpyZXR1cm4tMX19XG5mdW5jdGlvbiB3YyhhLGIpe2Zvcih2YXIgYz1hLnN1c3BlbmRlZExhbmVzLGQ9YS5waW5nZWRMYW5lcyxlPWEuZXhwaXJhdGlvblRpbWVzLGY9YS5wZW5kaW5nTGFuZXM7MDxmOyl7dmFyIGc9MzEtb2MoZiksaD0xPDxnLGs9ZVtnXTtpZigtMT09PWspe2lmKDA9PT0oaCZjKXx8MCE9PShoJmQpKWVbZ109dmMoaCxiKX1lbHNlIGs8PWImJihhLmV4cGlyZWRMYW5lc3w9aCk7ZiY9fmh9fWZ1bmN0aW9uIHhjKGEpe2E9YS5wZW5kaW5nTGFuZXMmLTEwNzM3NDE4MjU7cmV0dXJuIDAhPT1hP2E6YSYxMDczNzQxODI0PzEwNzM3NDE4MjQ6MH1mdW5jdGlvbiB5Yygpe3ZhciBhPXJjO3JjPDw9MTswPT09KHJjJjQxOTQyNDApJiYocmM9NjQpO3JldHVybiBhfWZ1bmN0aW9uIHpjKGEpe2Zvcih2YXIgYj1bXSxjPTA7MzE+YztjKyspYi5wdXNoKGEpO3JldHVybiBifVxuZnVuY3Rpb24gQWMoYSxiLGMpe2EucGVuZGluZ0xhbmVzfD1iOzUzNjg3MDkxMiE9PWImJihhLnN1c3BlbmRlZExhbmVzPTAsYS5waW5nZWRMYW5lcz0wKTthPWEuZXZlbnRUaW1lcztiPTMxLW9jKGIpO2FbYl09Y31mdW5jdGlvbiBCYyhhLGIpe3ZhciBjPWEucGVuZGluZ0xhbmVzJn5iO2EucGVuZGluZ0xhbmVzPWI7YS5zdXNwZW5kZWRMYW5lcz0wO2EucGluZ2VkTGFuZXM9MDthLmV4cGlyZWRMYW5lcyY9YjthLm11dGFibGVSZWFkTGFuZXMmPWI7YS5lbnRhbmdsZWRMYW5lcyY9YjtiPWEuZW50YW5nbGVtZW50czt2YXIgZD1hLmV2ZW50VGltZXM7Zm9yKGE9YS5leHBpcmF0aW9uVGltZXM7MDxjOyl7dmFyIGU9MzEtb2MoYyksZj0xPDxlO2JbZV09MDtkW2VdPS0xO2FbZV09LTE7YyY9fmZ9fVxuZnVuY3Rpb24gQ2MoYSxiKXt2YXIgYz1hLmVudGFuZ2xlZExhbmVzfD1iO2ZvcihhPWEuZW50YW5nbGVtZW50cztjOyl7dmFyIGQ9MzEtb2MoYyksZT0xPDxkO2UmYnxhW2RdJmImJihhW2RdfD1iKTtjJj1+ZX19dmFyIEM9MDtmdW5jdGlvbiBEYyhhKXthJj0tYTtyZXR1cm4gMTxhPzQ8YT8wIT09KGEmMjY4NDM1NDU1KT8xNjo1MzY4NzA5MTI6NDoxfXZhciBFYyxGYyxHYyxIYyxJYyxKYz0hMSxLYz1bXSxMYz1udWxsLE1jPW51bGwsTmM9bnVsbCxPYz1uZXcgTWFwLFBjPW5ldyBNYXAsUWM9W10sUmM9XCJtb3VzZWRvd24gbW91c2V1cCB0b3VjaGNhbmNlbCB0b3VjaGVuZCB0b3VjaHN0YXJ0IGF1eGNsaWNrIGRibGNsaWNrIHBvaW50ZXJjYW5jZWwgcG9pbnRlcmRvd24gcG9pbnRlcnVwIGRyYWdlbmQgZHJhZ3N0YXJ0IGRyb3AgY29tcG9zaXRpb25lbmQgY29tcG9zaXRpb25zdGFydCBrZXlkb3duIGtleXByZXNzIGtleXVwIGlucHV0IHRleHRJbnB1dCBjb3B5IGN1dCBwYXN0ZSBjbGljayBjaGFuZ2UgY29udGV4dG1lbnUgcmVzZXQgc3VibWl0XCIuc3BsaXQoXCIgXCIpO1xuZnVuY3Rpb24gU2MoYSxiKXtzd2l0Y2goYSl7Y2FzZSBcImZvY3VzaW5cIjpjYXNlIFwiZm9jdXNvdXRcIjpMYz1udWxsO2JyZWFrO2Nhc2UgXCJkcmFnZW50ZXJcIjpjYXNlIFwiZHJhZ2xlYXZlXCI6TWM9bnVsbDticmVhaztjYXNlIFwibW91c2VvdmVyXCI6Y2FzZSBcIm1vdXNlb3V0XCI6TmM9bnVsbDticmVhaztjYXNlIFwicG9pbnRlcm92ZXJcIjpjYXNlIFwicG9pbnRlcm91dFwiOk9jLmRlbGV0ZShiLnBvaW50ZXJJZCk7YnJlYWs7Y2FzZSBcImdvdHBvaW50ZXJjYXB0dXJlXCI6Y2FzZSBcImxvc3Rwb2ludGVyY2FwdHVyZVwiOlBjLmRlbGV0ZShiLnBvaW50ZXJJZCl9fVxuZnVuY3Rpb24gVGMoYSxiLGMsZCxlLGYpe2lmKG51bGw9PT1hfHxhLm5hdGl2ZUV2ZW50IT09ZilyZXR1cm4gYT17YmxvY2tlZE9uOmIsZG9tRXZlbnROYW1lOmMsZXZlbnRTeXN0ZW1GbGFnczpkLG5hdGl2ZUV2ZW50OmYsdGFyZ2V0Q29udGFpbmVyczpbZV19LG51bGwhPT1iJiYoYj1DYihiKSxudWxsIT09YiYmRmMoYikpLGE7YS5ldmVudFN5c3RlbUZsYWdzfD1kO2I9YS50YXJnZXRDb250YWluZXJzO251bGwhPT1lJiYtMT09PWIuaW5kZXhPZihlKSYmYi5wdXNoKGUpO3JldHVybiBhfVxuZnVuY3Rpb24gVWMoYSxiLGMsZCxlKXtzd2l0Y2goYil7Y2FzZSBcImZvY3VzaW5cIjpyZXR1cm4gTGM9VGMoTGMsYSxiLGMsZCxlKSwhMDtjYXNlIFwiZHJhZ2VudGVyXCI6cmV0dXJuIE1jPVRjKE1jLGEsYixjLGQsZSksITA7Y2FzZSBcIm1vdXNlb3ZlclwiOnJldHVybiBOYz1UYyhOYyxhLGIsYyxkLGUpLCEwO2Nhc2UgXCJwb2ludGVyb3ZlclwiOnZhciBmPWUucG9pbnRlcklkO09jLnNldChmLFRjKE9jLmdldChmKXx8bnVsbCxhLGIsYyxkLGUpKTtyZXR1cm4hMDtjYXNlIFwiZ290cG9pbnRlcmNhcHR1cmVcIjpyZXR1cm4gZj1lLnBvaW50ZXJJZCxQYy5zZXQoZixUYyhQYy5nZXQoZil8fG51bGwsYSxiLGMsZCxlKSksITB9cmV0dXJuITF9XG5mdW5jdGlvbiBWYyhhKXt2YXIgYj1XYyhhLnRhcmdldCk7aWYobnVsbCE9PWIpe3ZhciBjPVZiKGIpO2lmKG51bGwhPT1jKWlmKGI9Yy50YWcsMTM9PT1iKXtpZihiPVdiKGMpLG51bGwhPT1iKXthLmJsb2NrZWRPbj1iO0ljKGEucHJpb3JpdHksZnVuY3Rpb24oKXtHYyhjKX0pO3JldHVybn19ZWxzZSBpZigzPT09YiYmYy5zdGF0ZU5vZGUuY3VycmVudC5tZW1vaXplZFN0YXRlLmlzRGVoeWRyYXRlZCl7YS5ibG9ja2VkT249Mz09PWMudGFnP2Muc3RhdGVOb2RlLmNvbnRhaW5lckluZm86bnVsbDtyZXR1cm59fWEuYmxvY2tlZE9uPW51bGx9XG5mdW5jdGlvbiBYYyhhKXtpZihudWxsIT09YS5ibG9ja2VkT24pcmV0dXJuITE7Zm9yKHZhciBiPWEudGFyZ2V0Q29udGFpbmVyczswPGIubGVuZ3RoOyl7dmFyIGM9WWMoYS5kb21FdmVudE5hbWUsYS5ldmVudFN5c3RlbUZsYWdzLGJbMF0sYS5uYXRpdmVFdmVudCk7aWYobnVsbD09PWMpe2M9YS5uYXRpdmVFdmVudDt2YXIgZD1uZXcgYy5jb25zdHJ1Y3RvcihjLnR5cGUsYyk7d2I9ZDtjLnRhcmdldC5kaXNwYXRjaEV2ZW50KGQpO3diPW51bGx9ZWxzZSByZXR1cm4gYj1DYihjKSxudWxsIT09YiYmRmMoYiksYS5ibG9ja2VkT249YywhMTtiLnNoaWZ0KCl9cmV0dXJuITB9ZnVuY3Rpb24gWmMoYSxiLGMpe1hjKGEpJiZjLmRlbGV0ZShiKX1mdW5jdGlvbiAkYygpe0pjPSExO251bGwhPT1MYyYmWGMoTGMpJiYoTGM9bnVsbCk7bnVsbCE9PU1jJiZYYyhNYykmJihNYz1udWxsKTtudWxsIT09TmMmJlhjKE5jKSYmKE5jPW51bGwpO09jLmZvckVhY2goWmMpO1BjLmZvckVhY2goWmMpfVxuZnVuY3Rpb24gYWQoYSxiKXthLmJsb2NrZWRPbj09PWImJihhLmJsb2NrZWRPbj1udWxsLEpjfHwoSmM9ITAsY2EudW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayhjYS51bnN0YWJsZV9Ob3JtYWxQcmlvcml0eSwkYykpKX1cbmZ1bmN0aW9uIGJkKGEpe2Z1bmN0aW9uIGIoYil7cmV0dXJuIGFkKGIsYSl9aWYoMDxLYy5sZW5ndGgpe2FkKEtjWzBdLGEpO2Zvcih2YXIgYz0xO2M8S2MubGVuZ3RoO2MrKyl7dmFyIGQ9S2NbY107ZC5ibG9ja2VkT249PT1hJiYoZC5ibG9ja2VkT249bnVsbCl9fW51bGwhPT1MYyYmYWQoTGMsYSk7bnVsbCE9PU1jJiZhZChNYyxhKTtudWxsIT09TmMmJmFkKE5jLGEpO09jLmZvckVhY2goYik7UGMuZm9yRWFjaChiKTtmb3IoYz0wO2M8UWMubGVuZ3RoO2MrKylkPVFjW2NdLGQuYmxvY2tlZE9uPT09YSYmKGQuYmxvY2tlZE9uPW51bGwpO2Zvcig7MDxRYy5sZW5ndGgmJihjPVFjWzBdLG51bGw9PT1jLmJsb2NrZWRPbik7KVZjKGMpLG51bGw9PT1jLmJsb2NrZWRPbiYmUWMuc2hpZnQoKX12YXIgY2Q9dWEuUmVhY3RDdXJyZW50QmF0Y2hDb25maWcsZGQ9ITA7XG5mdW5jdGlvbiBlZChhLGIsYyxkKXt2YXIgZT1DLGY9Y2QudHJhbnNpdGlvbjtjZC50cmFuc2l0aW9uPW51bGw7dHJ5e0M9MSxmZChhLGIsYyxkKX1maW5hbGx5e0M9ZSxjZC50cmFuc2l0aW9uPWZ9fWZ1bmN0aW9uIGdkKGEsYixjLGQpe3ZhciBlPUMsZj1jZC50cmFuc2l0aW9uO2NkLnRyYW5zaXRpb249bnVsbDt0cnl7Qz00LGZkKGEsYixjLGQpfWZpbmFsbHl7Qz1lLGNkLnRyYW5zaXRpb249Zn19XG5mdW5jdGlvbiBmZChhLGIsYyxkKXtpZihkZCl7dmFyIGU9WWMoYSxiLGMsZCk7aWYobnVsbD09PWUpaGQoYSxiLGQsaWQsYyksU2MoYSxkKTtlbHNlIGlmKFVjKGUsYSxiLGMsZCkpZC5zdG9wUHJvcGFnYXRpb24oKTtlbHNlIGlmKFNjKGEsZCksYiY0JiYtMTxSYy5pbmRleE9mKGEpKXtmb3IoO251bGwhPT1lOyl7dmFyIGY9Q2IoZSk7bnVsbCE9PWYmJkVjKGYpO2Y9WWMoYSxiLGMsZCk7bnVsbD09PWYmJmhkKGEsYixkLGlkLGMpO2lmKGY9PT1lKWJyZWFrO2U9Zn1udWxsIT09ZSYmZC5zdG9wUHJvcGFnYXRpb24oKX1lbHNlIGhkKGEsYixkLG51bGwsYyl9fXZhciBpZD1udWxsO1xuZnVuY3Rpb24gWWMoYSxiLGMsZCl7aWQ9bnVsbDthPXhiKGQpO2E9V2MoYSk7aWYobnVsbCE9PWEpaWYoYj1WYihhKSxudWxsPT09YilhPW51bGw7ZWxzZSBpZihjPWIudGFnLDEzPT09Yyl7YT1XYihiKTtpZihudWxsIT09YSlyZXR1cm4gYTthPW51bGx9ZWxzZSBpZigzPT09Yyl7aWYoYi5zdGF0ZU5vZGUuY3VycmVudC5tZW1vaXplZFN0YXRlLmlzRGVoeWRyYXRlZClyZXR1cm4gMz09PWIudGFnP2Iuc3RhdGVOb2RlLmNvbnRhaW5lckluZm86bnVsbDthPW51bGx9ZWxzZSBiIT09YSYmKGE9bnVsbCk7aWQ9YTtyZXR1cm4gbnVsbH1cbmZ1bmN0aW9uIGpkKGEpe3N3aXRjaChhKXtjYXNlIFwiY2FuY2VsXCI6Y2FzZSBcImNsaWNrXCI6Y2FzZSBcImNsb3NlXCI6Y2FzZSBcImNvbnRleHRtZW51XCI6Y2FzZSBcImNvcHlcIjpjYXNlIFwiY3V0XCI6Y2FzZSBcImF1eGNsaWNrXCI6Y2FzZSBcImRibGNsaWNrXCI6Y2FzZSBcImRyYWdlbmRcIjpjYXNlIFwiZHJhZ3N0YXJ0XCI6Y2FzZSBcImRyb3BcIjpjYXNlIFwiZm9jdXNpblwiOmNhc2UgXCJmb2N1c291dFwiOmNhc2UgXCJpbnB1dFwiOmNhc2UgXCJpbnZhbGlkXCI6Y2FzZSBcImtleWRvd25cIjpjYXNlIFwia2V5cHJlc3NcIjpjYXNlIFwia2V5dXBcIjpjYXNlIFwibW91c2Vkb3duXCI6Y2FzZSBcIm1vdXNldXBcIjpjYXNlIFwicGFzdGVcIjpjYXNlIFwicGF1c2VcIjpjYXNlIFwicGxheVwiOmNhc2UgXCJwb2ludGVyY2FuY2VsXCI6Y2FzZSBcInBvaW50ZXJkb3duXCI6Y2FzZSBcInBvaW50ZXJ1cFwiOmNhc2UgXCJyYXRlY2hhbmdlXCI6Y2FzZSBcInJlc2V0XCI6Y2FzZSBcInJlc2l6ZVwiOmNhc2UgXCJzZWVrZWRcIjpjYXNlIFwic3VibWl0XCI6Y2FzZSBcInRvdWNoY2FuY2VsXCI6Y2FzZSBcInRvdWNoZW5kXCI6Y2FzZSBcInRvdWNoc3RhcnRcIjpjYXNlIFwidm9sdW1lY2hhbmdlXCI6Y2FzZSBcImNoYW5nZVwiOmNhc2UgXCJzZWxlY3Rpb25jaGFuZ2VcIjpjYXNlIFwidGV4dElucHV0XCI6Y2FzZSBcImNvbXBvc2l0aW9uc3RhcnRcIjpjYXNlIFwiY29tcG9zaXRpb25lbmRcIjpjYXNlIFwiY29tcG9zaXRpb251cGRhdGVcIjpjYXNlIFwiYmVmb3JlYmx1clwiOmNhc2UgXCJhZnRlcmJsdXJcIjpjYXNlIFwiYmVmb3JlaW5wdXRcIjpjYXNlIFwiYmx1clwiOmNhc2UgXCJmdWxsc2NyZWVuY2hhbmdlXCI6Y2FzZSBcImZvY3VzXCI6Y2FzZSBcImhhc2hjaGFuZ2VcIjpjYXNlIFwicG9wc3RhdGVcIjpjYXNlIFwic2VsZWN0XCI6Y2FzZSBcInNlbGVjdHN0YXJ0XCI6cmV0dXJuIDE7Y2FzZSBcImRyYWdcIjpjYXNlIFwiZHJhZ2VudGVyXCI6Y2FzZSBcImRyYWdleGl0XCI6Y2FzZSBcImRyYWdsZWF2ZVwiOmNhc2UgXCJkcmFnb3ZlclwiOmNhc2UgXCJtb3VzZW1vdmVcIjpjYXNlIFwibW91c2VvdXRcIjpjYXNlIFwibW91c2VvdmVyXCI6Y2FzZSBcInBvaW50ZXJtb3ZlXCI6Y2FzZSBcInBvaW50ZXJvdXRcIjpjYXNlIFwicG9pbnRlcm92ZXJcIjpjYXNlIFwic2Nyb2xsXCI6Y2FzZSBcInRvZ2dsZVwiOmNhc2UgXCJ0b3VjaG1vdmVcIjpjYXNlIFwid2hlZWxcIjpjYXNlIFwibW91c2VlbnRlclwiOmNhc2UgXCJtb3VzZWxlYXZlXCI6Y2FzZSBcInBvaW50ZXJlbnRlclwiOmNhc2UgXCJwb2ludGVybGVhdmVcIjpyZXR1cm4gNDtcbmNhc2UgXCJtZXNzYWdlXCI6c3dpdGNoKGVjKCkpe2Nhc2UgZmM6cmV0dXJuIDE7Y2FzZSBnYzpyZXR1cm4gNDtjYXNlIGhjOmNhc2UgaWM6cmV0dXJuIDE2O2Nhc2UgamM6cmV0dXJuIDUzNjg3MDkxMjtkZWZhdWx0OnJldHVybiAxNn1kZWZhdWx0OnJldHVybiAxNn19dmFyIGtkPW51bGwsbGQ9bnVsbCxtZD1udWxsO2Z1bmN0aW9uIG5kKCl7aWYobWQpcmV0dXJuIG1kO3ZhciBhLGI9bGQsYz1iLmxlbmd0aCxkLGU9XCJ2YWx1ZVwiaW4ga2Q/a2QudmFsdWU6a2QudGV4dENvbnRlbnQsZj1lLmxlbmd0aDtmb3IoYT0wO2E8YyYmYlthXT09PWVbYV07YSsrKTt2YXIgZz1jLWE7Zm9yKGQ9MTtkPD1nJiZiW2MtZF09PT1lW2YtZF07ZCsrKTtyZXR1cm4gbWQ9ZS5zbGljZShhLDE8ZD8xLWQ6dm9pZCAwKX1cbmZ1bmN0aW9uIG9kKGEpe3ZhciBiPWEua2V5Q29kZTtcImNoYXJDb2RlXCJpbiBhPyhhPWEuY2hhckNvZGUsMD09PWEmJjEzPT09YiYmKGE9MTMpKTphPWI7MTA9PT1hJiYoYT0xMyk7cmV0dXJuIDMyPD1hfHwxMz09PWE/YTowfWZ1bmN0aW9uIHBkKCl7cmV0dXJuITB9ZnVuY3Rpb24gcWQoKXtyZXR1cm4hMX1cbmZ1bmN0aW9uIHJkKGEpe2Z1bmN0aW9uIGIoYixkLGUsZixnKXt0aGlzLl9yZWFjdE5hbWU9Yjt0aGlzLl90YXJnZXRJbnN0PWU7dGhpcy50eXBlPWQ7dGhpcy5uYXRpdmVFdmVudD1mO3RoaXMudGFyZ2V0PWc7dGhpcy5jdXJyZW50VGFyZ2V0PW51bGw7Zm9yKHZhciBjIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShjKSYmKGI9YVtjXSx0aGlzW2NdPWI/YihmKTpmW2NdKTt0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD0obnVsbCE9Zi5kZWZhdWx0UHJldmVudGVkP2YuZGVmYXVsdFByZXZlbnRlZDohMT09PWYucmV0dXJuVmFsdWUpP3BkOnFkO3RoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQ9cWQ7cmV0dXJuIHRoaXN9QShiLnByb3RvdHlwZSx7cHJldmVudERlZmF1bHQ6ZnVuY3Rpb24oKXt0aGlzLmRlZmF1bHRQcmV2ZW50ZWQ9ITA7dmFyIGE9dGhpcy5uYXRpdmVFdmVudDthJiYoYS5wcmV2ZW50RGVmYXVsdD9hLnByZXZlbnREZWZhdWx0KCk6XCJ1bmtub3duXCIhPT10eXBlb2YgYS5yZXR1cm5WYWx1ZSYmXG4oYS5yZXR1cm5WYWx1ZT0hMSksdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ9cGQpfSxzdG9wUHJvcGFnYXRpb246ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm5hdGl2ZUV2ZW50O2EmJihhLnN0b3BQcm9wYWdhdGlvbj9hLnN0b3BQcm9wYWdhdGlvbigpOlwidW5rbm93blwiIT09dHlwZW9mIGEuY2FuY2VsQnViYmxlJiYoYS5jYW5jZWxCdWJibGU9ITApLHRoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQ9cGQpfSxwZXJzaXN0OmZ1bmN0aW9uKCl7fSxpc1BlcnNpc3RlbnQ6cGR9KTtyZXR1cm4gYn1cbnZhciBzZD17ZXZlbnRQaGFzZTowLGJ1YmJsZXM6MCxjYW5jZWxhYmxlOjAsdGltZVN0YW1wOmZ1bmN0aW9uKGEpe3JldHVybiBhLnRpbWVTdGFtcHx8RGF0ZS5ub3coKX0sZGVmYXVsdFByZXZlbnRlZDowLGlzVHJ1c3RlZDowfSx0ZD1yZChzZCksdWQ9QSh7fSxzZCx7dmlldzowLGRldGFpbDowfSksdmQ9cmQodWQpLHdkLHhkLHlkLEFkPUEoe30sdWQse3NjcmVlblg6MCxzY3JlZW5ZOjAsY2xpZW50WDowLGNsaWVudFk6MCxwYWdlWDowLHBhZ2VZOjAsY3RybEtleTowLHNoaWZ0S2V5OjAsYWx0S2V5OjAsbWV0YUtleTowLGdldE1vZGlmaWVyU3RhdGU6emQsYnV0dG9uOjAsYnV0dG9uczowLHJlbGF0ZWRUYXJnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHZvaWQgMD09PWEucmVsYXRlZFRhcmdldD9hLmZyb21FbGVtZW50PT09YS5zcmNFbGVtZW50P2EudG9FbGVtZW50OmEuZnJvbUVsZW1lbnQ6YS5yZWxhdGVkVGFyZ2V0fSxtb3ZlbWVudFg6ZnVuY3Rpb24oYSl7aWYoXCJtb3ZlbWVudFhcImluXG5hKXJldHVybiBhLm1vdmVtZW50WDthIT09eWQmJih5ZCYmXCJtb3VzZW1vdmVcIj09PWEudHlwZT8od2Q9YS5zY3JlZW5YLXlkLnNjcmVlblgseGQ9YS5zY3JlZW5ZLXlkLnNjcmVlblkpOnhkPXdkPTAseWQ9YSk7cmV0dXJuIHdkfSxtb3ZlbWVudFk6ZnVuY3Rpb24oYSl7cmV0dXJuXCJtb3ZlbWVudFlcImluIGE/YS5tb3ZlbWVudFk6eGR9fSksQmQ9cmQoQWQpLENkPUEoe30sQWQse2RhdGFUcmFuc2ZlcjowfSksRGQ9cmQoQ2QpLEVkPUEoe30sdWQse3JlbGF0ZWRUYXJnZXQ6MH0pLEZkPXJkKEVkKSxHZD1BKHt9LHNkLHthbmltYXRpb25OYW1lOjAsZWxhcHNlZFRpbWU6MCxwc2V1ZG9FbGVtZW50OjB9KSxIZD1yZChHZCksSWQ9QSh7fSxzZCx7Y2xpcGJvYXJkRGF0YTpmdW5jdGlvbihhKXtyZXR1cm5cImNsaXBib2FyZERhdGFcImluIGE/YS5jbGlwYm9hcmREYXRhOndpbmRvdy5jbGlwYm9hcmREYXRhfX0pLEpkPXJkKElkKSxLZD1BKHt9LHNkLHtkYXRhOjB9KSxMZD1yZChLZCksTWQ9e0VzYzpcIkVzY2FwZVwiLFxuU3BhY2ViYXI6XCIgXCIsTGVmdDpcIkFycm93TGVmdFwiLFVwOlwiQXJyb3dVcFwiLFJpZ2h0OlwiQXJyb3dSaWdodFwiLERvd246XCJBcnJvd0Rvd25cIixEZWw6XCJEZWxldGVcIixXaW46XCJPU1wiLE1lbnU6XCJDb250ZXh0TWVudVwiLEFwcHM6XCJDb250ZXh0TWVudVwiLFNjcm9sbDpcIlNjcm9sbExvY2tcIixNb3pQcmludGFibGVLZXk6XCJVbmlkZW50aWZpZWRcIn0sTmQ9ezg6XCJCYWNrc3BhY2VcIiw5OlwiVGFiXCIsMTI6XCJDbGVhclwiLDEzOlwiRW50ZXJcIiwxNjpcIlNoaWZ0XCIsMTc6XCJDb250cm9sXCIsMTg6XCJBbHRcIiwxOTpcIlBhdXNlXCIsMjA6XCJDYXBzTG9ja1wiLDI3OlwiRXNjYXBlXCIsMzI6XCIgXCIsMzM6XCJQYWdlVXBcIiwzNDpcIlBhZ2VEb3duXCIsMzU6XCJFbmRcIiwzNjpcIkhvbWVcIiwzNzpcIkFycm93TGVmdFwiLDM4OlwiQXJyb3dVcFwiLDM5OlwiQXJyb3dSaWdodFwiLDQwOlwiQXJyb3dEb3duXCIsNDU6XCJJbnNlcnRcIiw0NjpcIkRlbGV0ZVwiLDExMjpcIkYxXCIsMTEzOlwiRjJcIiwxMTQ6XCJGM1wiLDExNTpcIkY0XCIsMTE2OlwiRjVcIiwxMTc6XCJGNlwiLDExODpcIkY3XCIsXG4xMTk6XCJGOFwiLDEyMDpcIkY5XCIsMTIxOlwiRjEwXCIsMTIyOlwiRjExXCIsMTIzOlwiRjEyXCIsMTQ0OlwiTnVtTG9ja1wiLDE0NTpcIlNjcm9sbExvY2tcIiwyMjQ6XCJNZXRhXCJ9LE9kPXtBbHQ6XCJhbHRLZXlcIixDb250cm9sOlwiY3RybEtleVwiLE1ldGE6XCJtZXRhS2V5XCIsU2hpZnQ6XCJzaGlmdEtleVwifTtmdW5jdGlvbiBQZChhKXt2YXIgYj10aGlzLm5hdGl2ZUV2ZW50O3JldHVybiBiLmdldE1vZGlmaWVyU3RhdGU/Yi5nZXRNb2RpZmllclN0YXRlKGEpOihhPU9kW2FdKT8hIWJbYV06ITF9ZnVuY3Rpb24gemQoKXtyZXR1cm4gUGR9XG52YXIgUWQ9QSh7fSx1ZCx7a2V5OmZ1bmN0aW9uKGEpe2lmKGEua2V5KXt2YXIgYj1NZFthLmtleV18fGEua2V5O2lmKFwiVW5pZGVudGlmaWVkXCIhPT1iKXJldHVybiBifXJldHVyblwia2V5cHJlc3NcIj09PWEudHlwZT8oYT1vZChhKSwxMz09PWE/XCJFbnRlclwiOlN0cmluZy5mcm9tQ2hhckNvZGUoYSkpOlwia2V5ZG93blwiPT09YS50eXBlfHxcImtleXVwXCI9PT1hLnR5cGU/TmRbYS5rZXlDb2RlXXx8XCJVbmlkZW50aWZpZWRcIjpcIlwifSxjb2RlOjAsbG9jYXRpb246MCxjdHJsS2V5OjAsc2hpZnRLZXk6MCxhbHRLZXk6MCxtZXRhS2V5OjAscmVwZWF0OjAsbG9jYWxlOjAsZ2V0TW9kaWZpZXJTdGF0ZTp6ZCxjaGFyQ29kZTpmdW5jdGlvbihhKXtyZXR1cm5cImtleXByZXNzXCI9PT1hLnR5cGU/b2QoYSk6MH0sa2V5Q29kZTpmdW5jdGlvbihhKXtyZXR1cm5cImtleWRvd25cIj09PWEudHlwZXx8XCJrZXl1cFwiPT09YS50eXBlP2Eua2V5Q29kZTowfSx3aGljaDpmdW5jdGlvbihhKXtyZXR1cm5cImtleXByZXNzXCI9PT1cbmEudHlwZT9vZChhKTpcImtleWRvd25cIj09PWEudHlwZXx8XCJrZXl1cFwiPT09YS50eXBlP2Eua2V5Q29kZTowfX0pLFJkPXJkKFFkKSxTZD1BKHt9LEFkLHtwb2ludGVySWQ6MCx3aWR0aDowLGhlaWdodDowLHByZXNzdXJlOjAsdGFuZ2VudGlhbFByZXNzdXJlOjAsdGlsdFg6MCx0aWx0WTowLHR3aXN0OjAscG9pbnRlclR5cGU6MCxpc1ByaW1hcnk6MH0pLFRkPXJkKFNkKSxVZD1BKHt9LHVkLHt0b3VjaGVzOjAsdGFyZ2V0VG91Y2hlczowLGNoYW5nZWRUb3VjaGVzOjAsYWx0S2V5OjAsbWV0YUtleTowLGN0cmxLZXk6MCxzaGlmdEtleTowLGdldE1vZGlmaWVyU3RhdGU6emR9KSxWZD1yZChVZCksV2Q9QSh7fSxzZCx7cHJvcGVydHlOYW1lOjAsZWxhcHNlZFRpbWU6MCxwc2V1ZG9FbGVtZW50OjB9KSxYZD1yZChXZCksWWQ9QSh7fSxBZCx7ZGVsdGFYOmZ1bmN0aW9uKGEpe3JldHVyblwiZGVsdGFYXCJpbiBhP2EuZGVsdGFYOlwid2hlZWxEZWx0YVhcImluIGE/LWEud2hlZWxEZWx0YVg6MH0sXG5kZWx0YVk6ZnVuY3Rpb24oYSl7cmV0dXJuXCJkZWx0YVlcImluIGE/YS5kZWx0YVk6XCJ3aGVlbERlbHRhWVwiaW4gYT8tYS53aGVlbERlbHRhWTpcIndoZWVsRGVsdGFcImluIGE/LWEud2hlZWxEZWx0YTowfSxkZWx0YVo6MCxkZWx0YU1vZGU6MH0pLFpkPXJkKFlkKSwkZD1bOSwxMywyNywzMl0sYWU9aWEmJlwiQ29tcG9zaXRpb25FdmVudFwiaW4gd2luZG93LGJlPW51bGw7aWEmJlwiZG9jdW1lbnRNb2RlXCJpbiBkb2N1bWVudCYmKGJlPWRvY3VtZW50LmRvY3VtZW50TW9kZSk7dmFyIGNlPWlhJiZcIlRleHRFdmVudFwiaW4gd2luZG93JiYhYmUsZGU9aWEmJighYWV8fGJlJiY4PGJlJiYxMT49YmUpLGVlPVN0cmluZy5mcm9tQ2hhckNvZGUoMzIpLGZlPSExO1xuZnVuY3Rpb24gZ2UoYSxiKXtzd2l0Y2goYSl7Y2FzZSBcImtleXVwXCI6cmV0dXJuLTEhPT0kZC5pbmRleE9mKGIua2V5Q29kZSk7Y2FzZSBcImtleWRvd25cIjpyZXR1cm4gMjI5IT09Yi5rZXlDb2RlO2Nhc2UgXCJrZXlwcmVzc1wiOmNhc2UgXCJtb3VzZWRvd25cIjpjYXNlIFwiZm9jdXNvdXRcIjpyZXR1cm4hMDtkZWZhdWx0OnJldHVybiExfX1mdW5jdGlvbiBoZShhKXthPWEuZGV0YWlsO3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmXCJkYXRhXCJpbiBhP2EuZGF0YTpudWxsfXZhciBpZT0hMTtmdW5jdGlvbiBqZShhLGIpe3N3aXRjaChhKXtjYXNlIFwiY29tcG9zaXRpb25lbmRcIjpyZXR1cm4gaGUoYik7Y2FzZSBcImtleXByZXNzXCI6aWYoMzIhPT1iLndoaWNoKXJldHVybiBudWxsO2ZlPSEwO3JldHVybiBlZTtjYXNlIFwidGV4dElucHV0XCI6cmV0dXJuIGE9Yi5kYXRhLGE9PT1lZSYmZmU/bnVsbDphO2RlZmF1bHQ6cmV0dXJuIG51bGx9fVxuZnVuY3Rpb24ga2UoYSxiKXtpZihpZSlyZXR1cm5cImNvbXBvc2l0aW9uZW5kXCI9PT1hfHwhYWUmJmdlKGEsYik/KGE9bmQoKSxtZD1sZD1rZD1udWxsLGllPSExLGEpOm51bGw7c3dpdGNoKGEpe2Nhc2UgXCJwYXN0ZVwiOnJldHVybiBudWxsO2Nhc2UgXCJrZXlwcmVzc1wiOmlmKCEoYi5jdHJsS2V5fHxiLmFsdEtleXx8Yi5tZXRhS2V5KXx8Yi5jdHJsS2V5JiZiLmFsdEtleSl7aWYoYi5jaGFyJiYxPGIuY2hhci5sZW5ndGgpcmV0dXJuIGIuY2hhcjtpZihiLndoaWNoKXJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGIud2hpY2gpfXJldHVybiBudWxsO2Nhc2UgXCJjb21wb3NpdGlvbmVuZFwiOnJldHVybiBkZSYmXCJrb1wiIT09Yi5sb2NhbGU/bnVsbDpiLmRhdGE7ZGVmYXVsdDpyZXR1cm4gbnVsbH19XG52YXIgbGU9e2NvbG9yOiEwLGRhdGU6ITAsZGF0ZXRpbWU6ITAsXCJkYXRldGltZS1sb2NhbFwiOiEwLGVtYWlsOiEwLG1vbnRoOiEwLG51bWJlcjohMCxwYXNzd29yZDohMCxyYW5nZTohMCxzZWFyY2g6ITAsdGVsOiEwLHRleHQ6ITAsdGltZTohMCx1cmw6ITAsd2VlazohMH07ZnVuY3Rpb24gbWUoYSl7dmFyIGI9YSYmYS5ub2RlTmFtZSYmYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PWI/ISFsZVthLnR5cGVdOlwidGV4dGFyZWFcIj09PWI/ITA6ITF9ZnVuY3Rpb24gbmUoYSxiLGMsZCl7RWIoZCk7Yj1vZShiLFwib25DaGFuZ2VcIik7MDxiLmxlbmd0aCYmKGM9bmV3IHRkKFwib25DaGFuZ2VcIixcImNoYW5nZVwiLG51bGwsYyxkKSxhLnB1c2goe2V2ZW50OmMsbGlzdGVuZXJzOmJ9KSl9dmFyIHBlPW51bGwscWU9bnVsbDtmdW5jdGlvbiByZShhKXtzZShhLDApfWZ1bmN0aW9uIHRlKGEpe3ZhciBiPXVlKGEpO2lmKFdhKGIpKXJldHVybiBhfVxuZnVuY3Rpb24gdmUoYSxiKXtpZihcImNoYW5nZVwiPT09YSlyZXR1cm4gYn12YXIgd2U9ITE7aWYoaWEpe3ZhciB4ZTtpZihpYSl7dmFyIHllPVwib25pbnB1dFwiaW4gZG9jdW1lbnQ7aWYoIXllKXt2YXIgemU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt6ZS5zZXRBdHRyaWJ1dGUoXCJvbmlucHV0XCIsXCJyZXR1cm47XCIpO3llPVwiZnVuY3Rpb25cIj09PXR5cGVvZiB6ZS5vbmlucHV0fXhlPXllfWVsc2UgeGU9ITE7d2U9eGUmJighZG9jdW1lbnQuZG9jdW1lbnRNb2RlfHw5PGRvY3VtZW50LmRvY3VtZW50TW9kZSl9ZnVuY3Rpb24gQWUoKXtwZSYmKHBlLmRldGFjaEV2ZW50KFwib25wcm9wZXJ0eWNoYW5nZVwiLEJlKSxxZT1wZT1udWxsKX1mdW5jdGlvbiBCZShhKXtpZihcInZhbHVlXCI9PT1hLnByb3BlcnR5TmFtZSYmdGUocWUpKXt2YXIgYj1bXTtuZShiLHFlLGEseGIoYSkpO0piKHJlLGIpfX1cbmZ1bmN0aW9uIENlKGEsYixjKXtcImZvY3VzaW5cIj09PWE/KEFlKCkscGU9YixxZT1jLHBlLmF0dGFjaEV2ZW50KFwib25wcm9wZXJ0eWNoYW5nZVwiLEJlKSk6XCJmb2N1c291dFwiPT09YSYmQWUoKX1mdW5jdGlvbiBEZShhKXtpZihcInNlbGVjdGlvbmNoYW5nZVwiPT09YXx8XCJrZXl1cFwiPT09YXx8XCJrZXlkb3duXCI9PT1hKXJldHVybiB0ZShxZSl9ZnVuY3Rpb24gRWUoYSxiKXtpZihcImNsaWNrXCI9PT1hKXJldHVybiB0ZShiKX1mdW5jdGlvbiBGZShhLGIpe2lmKFwiaW5wdXRcIj09PWF8fFwiY2hhbmdlXCI9PT1hKXJldHVybiB0ZShiKX1mdW5jdGlvbiBHZShhLGIpe3JldHVybiBhPT09YiYmKDAhPT1hfHwxL2E9PT0xL2IpfHxhIT09YSYmYiE9PWJ9dmFyIEhlPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBPYmplY3QuaXM/T2JqZWN0LmlzOkdlO1xuZnVuY3Rpb24gSWUoYSxiKXtpZihIZShhLGIpKXJldHVybiEwO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYXx8bnVsbD09PWF8fFwib2JqZWN0XCIhPT10eXBlb2YgYnx8bnVsbD09PWIpcmV0dXJuITE7dmFyIGM9T2JqZWN0LmtleXMoYSksZD1PYmplY3Qua2V5cyhiKTtpZihjLmxlbmd0aCE9PWQubGVuZ3RoKXJldHVybiExO2ZvcihkPTA7ZDxjLmxlbmd0aDtkKyspe3ZhciBlPWNbZF07aWYoIWphLmNhbGwoYixlKXx8IUhlKGFbZV0sYltlXSkpcmV0dXJuITF9cmV0dXJuITB9ZnVuY3Rpb24gSmUoYSl7Zm9yKDthJiZhLmZpcnN0Q2hpbGQ7KWE9YS5maXJzdENoaWxkO3JldHVybiBhfVxuZnVuY3Rpb24gS2UoYSxiKXt2YXIgYz1KZShhKTthPTA7Zm9yKHZhciBkO2M7KXtpZigzPT09Yy5ub2RlVHlwZSl7ZD1hK2MudGV4dENvbnRlbnQubGVuZ3RoO2lmKGE8PWImJmQ+PWIpcmV0dXJue25vZGU6YyxvZmZzZXQ6Yi1hfTthPWR9YTp7Zm9yKDtjOyl7aWYoYy5uZXh0U2libGluZyl7Yz1jLm5leHRTaWJsaW5nO2JyZWFrIGF9Yz1jLnBhcmVudE5vZGV9Yz12b2lkIDB9Yz1KZShjKX19ZnVuY3Rpb24gTGUoYSxiKXtyZXR1cm4gYSYmYj9hPT09Yj8hMDphJiYzPT09YS5ub2RlVHlwZT8hMTpiJiYzPT09Yi5ub2RlVHlwZT9MZShhLGIucGFyZW50Tm9kZSk6XCJjb250YWluc1wiaW4gYT9hLmNvbnRhaW5zKGIpOmEuY29tcGFyZURvY3VtZW50UG9zaXRpb24/ISEoYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKSYxNik6ITE6ITF9XG5mdW5jdGlvbiBNZSgpe2Zvcih2YXIgYT13aW5kb3csYj1YYSgpO2IgaW5zdGFuY2VvZiBhLkhUTUxJRnJhbWVFbGVtZW50Oyl7dHJ5e3ZhciBjPVwic3RyaW5nXCI9PT10eXBlb2YgYi5jb250ZW50V2luZG93LmxvY2F0aW9uLmhyZWZ9Y2F0Y2goZCl7Yz0hMX1pZihjKWE9Yi5jb250ZW50V2luZG93O2Vsc2UgYnJlYWs7Yj1YYShhLmRvY3VtZW50KX1yZXR1cm4gYn1mdW5jdGlvbiBOZShhKXt2YXIgYj1hJiZhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuIGImJihcImlucHV0XCI9PT1iJiYoXCJ0ZXh0XCI9PT1hLnR5cGV8fFwic2VhcmNoXCI9PT1hLnR5cGV8fFwidGVsXCI9PT1hLnR5cGV8fFwidXJsXCI9PT1hLnR5cGV8fFwicGFzc3dvcmRcIj09PWEudHlwZSl8fFwidGV4dGFyZWFcIj09PWJ8fFwidHJ1ZVwiPT09YS5jb250ZW50RWRpdGFibGUpfVxuZnVuY3Rpb24gT2UoYSl7dmFyIGI9TWUoKSxjPWEuZm9jdXNlZEVsZW0sZD1hLnNlbGVjdGlvblJhbmdlO2lmKGIhPT1jJiZjJiZjLm93bmVyRG9jdW1lbnQmJkxlKGMub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsYykpe2lmKG51bGwhPT1kJiZOZShjKSlpZihiPWQuc3RhcnQsYT1kLmVuZCx2b2lkIDA9PT1hJiYoYT1iKSxcInNlbGVjdGlvblN0YXJ0XCJpbiBjKWMuc2VsZWN0aW9uU3RhcnQ9YixjLnNlbGVjdGlvbkVuZD1NYXRoLm1pbihhLGMudmFsdWUubGVuZ3RoKTtlbHNlIGlmKGE9KGI9Yy5vd25lckRvY3VtZW50fHxkb2N1bWVudCkmJmIuZGVmYXVsdFZpZXd8fHdpbmRvdyxhLmdldFNlbGVjdGlvbil7YT1hLmdldFNlbGVjdGlvbigpO3ZhciBlPWMudGV4dENvbnRlbnQubGVuZ3RoLGY9TWF0aC5taW4oZC5zdGFydCxlKTtkPXZvaWQgMD09PWQuZW5kP2Y6TWF0aC5taW4oZC5lbmQsZSk7IWEuZXh0ZW5kJiZmPmQmJihlPWQsZD1mLGY9ZSk7ZT1LZShjLGYpO3ZhciBnPUtlKGMsXG5kKTtlJiZnJiYoMSE9PWEucmFuZ2VDb3VudHx8YS5hbmNob3JOb2RlIT09ZS5ub2RlfHxhLmFuY2hvck9mZnNldCE9PWUub2Zmc2V0fHxhLmZvY3VzTm9kZSE9PWcubm9kZXx8YS5mb2N1c09mZnNldCE9PWcub2Zmc2V0KSYmKGI9Yi5jcmVhdGVSYW5nZSgpLGIuc2V0U3RhcnQoZS5ub2RlLGUub2Zmc2V0KSxhLnJlbW92ZUFsbFJhbmdlcygpLGY+ZD8oYS5hZGRSYW5nZShiKSxhLmV4dGVuZChnLm5vZGUsZy5vZmZzZXQpKTooYi5zZXRFbmQoZy5ub2RlLGcub2Zmc2V0KSxhLmFkZFJhbmdlKGIpKSl9Yj1bXTtmb3IoYT1jO2E9YS5wYXJlbnROb2RlOykxPT09YS5ub2RlVHlwZSYmYi5wdXNoKHtlbGVtZW50OmEsbGVmdDphLnNjcm9sbExlZnQsdG9wOmEuc2Nyb2xsVG9wfSk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGMuZm9jdXMmJmMuZm9jdXMoKTtmb3IoYz0wO2M8Yi5sZW5ndGg7YysrKWE9YltjXSxhLmVsZW1lbnQuc2Nyb2xsTGVmdD1hLmxlZnQsYS5lbGVtZW50LnNjcm9sbFRvcD1hLnRvcH19XG52YXIgUGU9aWEmJlwiZG9jdW1lbnRNb2RlXCJpbiBkb2N1bWVudCYmMTE+PWRvY3VtZW50LmRvY3VtZW50TW9kZSxRZT1udWxsLFJlPW51bGwsU2U9bnVsbCxUZT0hMTtcbmZ1bmN0aW9uIFVlKGEsYixjKXt2YXIgZD1jLndpbmRvdz09PWM/Yy5kb2N1bWVudDo5PT09Yy5ub2RlVHlwZT9jOmMub3duZXJEb2N1bWVudDtUZXx8bnVsbD09UWV8fFFlIT09WGEoZCl8fChkPVFlLFwic2VsZWN0aW9uU3RhcnRcImluIGQmJk5lKGQpP2Q9e3N0YXJ0OmQuc2VsZWN0aW9uU3RhcnQsZW5kOmQuc2VsZWN0aW9uRW5kfTooZD0oZC5vd25lckRvY3VtZW50JiZkLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXd8fHdpbmRvdykuZ2V0U2VsZWN0aW9uKCksZD17YW5jaG9yTm9kZTpkLmFuY2hvck5vZGUsYW5jaG9yT2Zmc2V0OmQuYW5jaG9yT2Zmc2V0LGZvY3VzTm9kZTpkLmZvY3VzTm9kZSxmb2N1c09mZnNldDpkLmZvY3VzT2Zmc2V0fSksU2UmJkllKFNlLGQpfHwoU2U9ZCxkPW9lKFJlLFwib25TZWxlY3RcIiksMDxkLmxlbmd0aCYmKGI9bmV3IHRkKFwib25TZWxlY3RcIixcInNlbGVjdFwiLG51bGwsYixjKSxhLnB1c2goe2V2ZW50OmIsbGlzdGVuZXJzOmR9KSxiLnRhcmdldD1RZSkpKX1cbmZ1bmN0aW9uIFZlKGEsYil7dmFyIGM9e307Y1thLnRvTG93ZXJDYXNlKCldPWIudG9Mb3dlckNhc2UoKTtjW1wiV2Via2l0XCIrYV09XCJ3ZWJraXRcIitiO2NbXCJNb3pcIithXT1cIm1velwiK2I7cmV0dXJuIGN9dmFyIFdlPXthbmltYXRpb25lbmQ6VmUoXCJBbmltYXRpb25cIixcIkFuaW1hdGlvbkVuZFwiKSxhbmltYXRpb25pdGVyYXRpb246VmUoXCJBbmltYXRpb25cIixcIkFuaW1hdGlvbkl0ZXJhdGlvblwiKSxhbmltYXRpb25zdGFydDpWZShcIkFuaW1hdGlvblwiLFwiQW5pbWF0aW9uU3RhcnRcIiksdHJhbnNpdGlvbmVuZDpWZShcIlRyYW5zaXRpb25cIixcIlRyYW5zaXRpb25FbmRcIil9LFhlPXt9LFllPXt9O1xuaWEmJihZZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLnN0eWxlLFwiQW5pbWF0aW9uRXZlbnRcImluIHdpbmRvd3x8KGRlbGV0ZSBXZS5hbmltYXRpb25lbmQuYW5pbWF0aW9uLGRlbGV0ZSBXZS5hbmltYXRpb25pdGVyYXRpb24uYW5pbWF0aW9uLGRlbGV0ZSBXZS5hbmltYXRpb25zdGFydC5hbmltYXRpb24pLFwiVHJhbnNpdGlvbkV2ZW50XCJpbiB3aW5kb3d8fGRlbGV0ZSBXZS50cmFuc2l0aW9uZW5kLnRyYW5zaXRpb24pO2Z1bmN0aW9uIFplKGEpe2lmKFhlW2FdKXJldHVybiBYZVthXTtpZighV2VbYV0pcmV0dXJuIGE7dmFyIGI9V2VbYV0sYztmb3IoYyBpbiBiKWlmKGIuaGFzT3duUHJvcGVydHkoYykmJmMgaW4gWWUpcmV0dXJuIFhlW2FdPWJbY107cmV0dXJuIGF9dmFyICRlPVplKFwiYW5pbWF0aW9uZW5kXCIpLGFmPVplKFwiYW5pbWF0aW9uaXRlcmF0aW9uXCIpLGJmPVplKFwiYW5pbWF0aW9uc3RhcnRcIiksY2Y9WmUoXCJ0cmFuc2l0aW9uZW5kXCIpLGRmPW5ldyBNYXAsZWY9XCJhYm9ydCBhdXhDbGljayBjYW5jZWwgY2FuUGxheSBjYW5QbGF5VGhyb3VnaCBjbGljayBjbG9zZSBjb250ZXh0TWVudSBjb3B5IGN1dCBkcmFnIGRyYWdFbmQgZHJhZ0VudGVyIGRyYWdFeGl0IGRyYWdMZWF2ZSBkcmFnT3ZlciBkcmFnU3RhcnQgZHJvcCBkdXJhdGlvbkNoYW5nZSBlbXB0aWVkIGVuY3J5cHRlZCBlbmRlZCBlcnJvciBnb3RQb2ludGVyQ2FwdHVyZSBpbnB1dCBpbnZhbGlkIGtleURvd24ga2V5UHJlc3Mga2V5VXAgbG9hZCBsb2FkZWREYXRhIGxvYWRlZE1ldGFkYXRhIGxvYWRTdGFydCBsb3N0UG9pbnRlckNhcHR1cmUgbW91c2VEb3duIG1vdXNlTW92ZSBtb3VzZU91dCBtb3VzZU92ZXIgbW91c2VVcCBwYXN0ZSBwYXVzZSBwbGF5IHBsYXlpbmcgcG9pbnRlckNhbmNlbCBwb2ludGVyRG93biBwb2ludGVyTW92ZSBwb2ludGVyT3V0IHBvaW50ZXJPdmVyIHBvaW50ZXJVcCBwcm9ncmVzcyByYXRlQ2hhbmdlIHJlc2V0IHJlc2l6ZSBzZWVrZWQgc2Vla2luZyBzdGFsbGVkIHN1Ym1pdCBzdXNwZW5kIHRpbWVVcGRhdGUgdG91Y2hDYW5jZWwgdG91Y2hFbmQgdG91Y2hTdGFydCB2b2x1bWVDaGFuZ2Ugc2Nyb2xsIHRvZ2dsZSB0b3VjaE1vdmUgd2FpdGluZyB3aGVlbFwiLnNwbGl0KFwiIFwiKTtcbmZ1bmN0aW9uIGZmKGEsYil7ZGYuc2V0KGEsYik7ZmEoYixbYV0pfWZvcih2YXIgZ2Y9MDtnZjxlZi5sZW5ndGg7Z2YrKyl7dmFyIGhmPWVmW2dmXSxqZj1oZi50b0xvd2VyQ2FzZSgpLGtmPWhmWzBdLnRvVXBwZXJDYXNlKCkraGYuc2xpY2UoMSk7ZmYoamYsXCJvblwiK2tmKX1mZigkZSxcIm9uQW5pbWF0aW9uRW5kXCIpO2ZmKGFmLFwib25BbmltYXRpb25JdGVyYXRpb25cIik7ZmYoYmYsXCJvbkFuaW1hdGlvblN0YXJ0XCIpO2ZmKFwiZGJsY2xpY2tcIixcIm9uRG91YmxlQ2xpY2tcIik7ZmYoXCJmb2N1c2luXCIsXCJvbkZvY3VzXCIpO2ZmKFwiZm9jdXNvdXRcIixcIm9uQmx1clwiKTtmZihjZixcIm9uVHJhbnNpdGlvbkVuZFwiKTtoYShcIm9uTW91c2VFbnRlclwiLFtcIm1vdXNlb3V0XCIsXCJtb3VzZW92ZXJcIl0pO2hhKFwib25Nb3VzZUxlYXZlXCIsW1wibW91c2VvdXRcIixcIm1vdXNlb3ZlclwiXSk7aGEoXCJvblBvaW50ZXJFbnRlclwiLFtcInBvaW50ZXJvdXRcIixcInBvaW50ZXJvdmVyXCJdKTtcbmhhKFwib25Qb2ludGVyTGVhdmVcIixbXCJwb2ludGVyb3V0XCIsXCJwb2ludGVyb3ZlclwiXSk7ZmEoXCJvbkNoYW5nZVwiLFwiY2hhbmdlIGNsaWNrIGZvY3VzaW4gZm9jdXNvdXQgaW5wdXQga2V5ZG93biBrZXl1cCBzZWxlY3Rpb25jaGFuZ2VcIi5zcGxpdChcIiBcIikpO2ZhKFwib25TZWxlY3RcIixcImZvY3Vzb3V0IGNvbnRleHRtZW51IGRyYWdlbmQgZm9jdXNpbiBrZXlkb3duIGtleXVwIG1vdXNlZG93biBtb3VzZXVwIHNlbGVjdGlvbmNoYW5nZVwiLnNwbGl0KFwiIFwiKSk7ZmEoXCJvbkJlZm9yZUlucHV0XCIsW1wiY29tcG9zaXRpb25lbmRcIixcImtleXByZXNzXCIsXCJ0ZXh0SW5wdXRcIixcInBhc3RlXCJdKTtmYShcIm9uQ29tcG9zaXRpb25FbmRcIixcImNvbXBvc2l0aW9uZW5kIGZvY3Vzb3V0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgbW91c2Vkb3duXCIuc3BsaXQoXCIgXCIpKTtmYShcIm9uQ29tcG9zaXRpb25TdGFydFwiLFwiY29tcG9zaXRpb25zdGFydCBmb2N1c291dCBrZXlkb3duIGtleXByZXNzIGtleXVwIG1vdXNlZG93blwiLnNwbGl0KFwiIFwiKSk7XG5mYShcIm9uQ29tcG9zaXRpb25VcGRhdGVcIixcImNvbXBvc2l0aW9udXBkYXRlIGZvY3Vzb3V0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgbW91c2Vkb3duXCIuc3BsaXQoXCIgXCIpKTt2YXIgbGY9XCJhYm9ydCBjYW5wbGF5IGNhbnBsYXl0aHJvdWdoIGR1cmF0aW9uY2hhbmdlIGVtcHRpZWQgZW5jcnlwdGVkIGVuZGVkIGVycm9yIGxvYWRlZGRhdGEgbG9hZGVkbWV0YWRhdGEgbG9hZHN0YXJ0IHBhdXNlIHBsYXkgcGxheWluZyBwcm9ncmVzcyByYXRlY2hhbmdlIHJlc2l6ZSBzZWVrZWQgc2Vla2luZyBzdGFsbGVkIHN1c3BlbmQgdGltZXVwZGF0ZSB2b2x1bWVjaGFuZ2Ugd2FpdGluZ1wiLnNwbGl0KFwiIFwiKSxtZj1uZXcgU2V0KFwiY2FuY2VsIGNsb3NlIGludmFsaWQgbG9hZCBzY3JvbGwgdG9nZ2xlXCIuc3BsaXQoXCIgXCIpLmNvbmNhdChsZikpO1xuZnVuY3Rpb24gbmYoYSxiLGMpe3ZhciBkPWEudHlwZXx8XCJ1bmtub3duLWV2ZW50XCI7YS5jdXJyZW50VGFyZ2V0PWM7VWIoZCxiLHZvaWQgMCxhKTthLmN1cnJlbnRUYXJnZXQ9bnVsbH1cbmZ1bmN0aW9uIHNlKGEsYil7Yj0wIT09KGImNCk7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspe3ZhciBkPWFbY10sZT1kLmV2ZW50O2Q9ZC5saXN0ZW5lcnM7YTp7dmFyIGY9dm9pZCAwO2lmKGIpZm9yKHZhciBnPWQubGVuZ3RoLTE7MDw9ZztnLS0pe3ZhciBoPWRbZ10saz1oLmluc3RhbmNlLGw9aC5jdXJyZW50VGFyZ2V0O2g9aC5saXN0ZW5lcjtpZihrIT09ZiYmZS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKWJyZWFrIGE7bmYoZSxoLGwpO2Y9a31lbHNlIGZvcihnPTA7ZzxkLmxlbmd0aDtnKyspe2g9ZFtnXTtrPWguaW5zdGFuY2U7bD1oLmN1cnJlbnRUYXJnZXQ7aD1oLmxpc3RlbmVyO2lmKGshPT1mJiZlLmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpYnJlYWsgYTtuZihlLGgsbCk7Zj1rfX19aWYoUWIpdGhyb3cgYT1SYixRYj0hMSxSYj1udWxsLGE7fVxuZnVuY3Rpb24gRChhLGIpe3ZhciBjPWJbb2ZdO3ZvaWQgMD09PWMmJihjPWJbb2ZdPW5ldyBTZXQpO3ZhciBkPWErXCJfX2J1YmJsZVwiO2MuaGFzKGQpfHwocGYoYixhLDIsITEpLGMuYWRkKGQpKX1mdW5jdGlvbiBxZihhLGIsYyl7dmFyIGQ9MDtiJiYoZHw9NCk7cGYoYyxhLGQsYil9dmFyIHJmPVwiX3JlYWN0TGlzdGVuaW5nXCIrTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7ZnVuY3Rpb24gc2YoYSl7aWYoIWFbcmZdKXthW3JmXT0hMDtkYS5mb3JFYWNoKGZ1bmN0aW9uKGIpe1wic2VsZWN0aW9uY2hhbmdlXCIhPT1iJiYobWYuaGFzKGIpfHxxZihiLCExLGEpLHFmKGIsITAsYSkpfSk7dmFyIGI9OT09PWEubm9kZVR5cGU/YTphLm93bmVyRG9jdW1lbnQ7bnVsbD09PWJ8fGJbcmZdfHwoYltyZl09ITAscWYoXCJzZWxlY3Rpb25jaGFuZ2VcIiwhMSxiKSl9fVxuZnVuY3Rpb24gcGYoYSxiLGMsZCl7c3dpdGNoKGpkKGIpKXtjYXNlIDE6dmFyIGU9ZWQ7YnJlYWs7Y2FzZSA0OmU9Z2Q7YnJlYWs7ZGVmYXVsdDplPWZkfWM9ZS5iaW5kKG51bGwsYixjLGEpO2U9dm9pZCAwOyFMYnx8XCJ0b3VjaHN0YXJ0XCIhPT1iJiZcInRvdWNobW92ZVwiIT09YiYmXCJ3aGVlbFwiIT09Ynx8KGU9ITApO2Q/dm9pZCAwIT09ZT9hLmFkZEV2ZW50TGlzdGVuZXIoYixjLHtjYXB0dXJlOiEwLHBhc3NpdmU6ZX0pOmEuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITApOnZvaWQgMCE9PWU/YS5hZGRFdmVudExpc3RlbmVyKGIsYyx7cGFzc2l2ZTplfSk6YS5hZGRFdmVudExpc3RlbmVyKGIsYywhMSl9XG5mdW5jdGlvbiBoZChhLGIsYyxkLGUpe3ZhciBmPWQ7aWYoMD09PShiJjEpJiYwPT09KGImMikmJm51bGwhPT1kKWE6Zm9yKDs7KXtpZihudWxsPT09ZClyZXR1cm47dmFyIGc9ZC50YWc7aWYoMz09PWd8fDQ9PT1nKXt2YXIgaD1kLnN0YXRlTm9kZS5jb250YWluZXJJbmZvO2lmKGg9PT1lfHw4PT09aC5ub2RlVHlwZSYmaC5wYXJlbnROb2RlPT09ZSlicmVhaztpZig0PT09Zylmb3IoZz1kLnJldHVybjtudWxsIT09Zzspe3ZhciBrPWcudGFnO2lmKDM9PT1rfHw0PT09aylpZihrPWcuc3RhdGVOb2RlLmNvbnRhaW5lckluZm8saz09PWV8fDg9PT1rLm5vZGVUeXBlJiZrLnBhcmVudE5vZGU9PT1lKXJldHVybjtnPWcucmV0dXJufWZvcig7bnVsbCE9PWg7KXtnPVdjKGgpO2lmKG51bGw9PT1nKXJldHVybjtrPWcudGFnO2lmKDU9PT1rfHw2PT09ayl7ZD1mPWc7Y29udGludWUgYX1oPWgucGFyZW50Tm9kZX19ZD1kLnJldHVybn1KYihmdW5jdGlvbigpe3ZhciBkPWYsZT14YihjKSxnPVtdO1xuYTp7dmFyIGg9ZGYuZ2V0KGEpO2lmKHZvaWQgMCE9PWgpe3ZhciBrPXRkLG49YTtzd2l0Y2goYSl7Y2FzZSBcImtleXByZXNzXCI6aWYoMD09PW9kKGMpKWJyZWFrIGE7Y2FzZSBcImtleWRvd25cIjpjYXNlIFwia2V5dXBcIjprPVJkO2JyZWFrO2Nhc2UgXCJmb2N1c2luXCI6bj1cImZvY3VzXCI7az1GZDticmVhaztjYXNlIFwiZm9jdXNvdXRcIjpuPVwiYmx1clwiO2s9RmQ7YnJlYWs7Y2FzZSBcImJlZm9yZWJsdXJcIjpjYXNlIFwiYWZ0ZXJibHVyXCI6az1GZDticmVhaztjYXNlIFwiY2xpY2tcIjppZigyPT09Yy5idXR0b24pYnJlYWsgYTtjYXNlIFwiYXV4Y2xpY2tcIjpjYXNlIFwiZGJsY2xpY2tcIjpjYXNlIFwibW91c2Vkb3duXCI6Y2FzZSBcIm1vdXNlbW92ZVwiOmNhc2UgXCJtb3VzZXVwXCI6Y2FzZSBcIm1vdXNlb3V0XCI6Y2FzZSBcIm1vdXNlb3ZlclwiOmNhc2UgXCJjb250ZXh0bWVudVwiOms9QmQ7YnJlYWs7Y2FzZSBcImRyYWdcIjpjYXNlIFwiZHJhZ2VuZFwiOmNhc2UgXCJkcmFnZW50ZXJcIjpjYXNlIFwiZHJhZ2V4aXRcIjpjYXNlIFwiZHJhZ2xlYXZlXCI6Y2FzZSBcImRyYWdvdmVyXCI6Y2FzZSBcImRyYWdzdGFydFwiOmNhc2UgXCJkcm9wXCI6az1cbkRkO2JyZWFrO2Nhc2UgXCJ0b3VjaGNhbmNlbFwiOmNhc2UgXCJ0b3VjaGVuZFwiOmNhc2UgXCJ0b3VjaG1vdmVcIjpjYXNlIFwidG91Y2hzdGFydFwiOms9VmQ7YnJlYWs7Y2FzZSAkZTpjYXNlIGFmOmNhc2UgYmY6az1IZDticmVhaztjYXNlIGNmOms9WGQ7YnJlYWs7Y2FzZSBcInNjcm9sbFwiOms9dmQ7YnJlYWs7Y2FzZSBcIndoZWVsXCI6az1aZDticmVhaztjYXNlIFwiY29weVwiOmNhc2UgXCJjdXRcIjpjYXNlIFwicGFzdGVcIjprPUpkO2JyZWFrO2Nhc2UgXCJnb3Rwb2ludGVyY2FwdHVyZVwiOmNhc2UgXCJsb3N0cG9pbnRlcmNhcHR1cmVcIjpjYXNlIFwicG9pbnRlcmNhbmNlbFwiOmNhc2UgXCJwb2ludGVyZG93blwiOmNhc2UgXCJwb2ludGVybW92ZVwiOmNhc2UgXCJwb2ludGVyb3V0XCI6Y2FzZSBcInBvaW50ZXJvdmVyXCI6Y2FzZSBcInBvaW50ZXJ1cFwiOms9VGR9dmFyIHQ9MCE9PShiJjQpLEo9IXQmJlwic2Nyb2xsXCI9PT1hLHg9dD9udWxsIT09aD9oK1wiQ2FwdHVyZVwiOm51bGw6aDt0PVtdO2Zvcih2YXIgdz1kLHU7bnVsbCE9PVxudzspe3U9dzt2YXIgRj11LnN0YXRlTm9kZTs1PT09dS50YWcmJm51bGwhPT1GJiYodT1GLG51bGwhPT14JiYoRj1LYih3LHgpLG51bGwhPUYmJnQucHVzaCh0Zih3LEYsdSkpKSk7aWYoSilicmVhazt3PXcucmV0dXJufTA8dC5sZW5ndGgmJihoPW5ldyBrKGgsbixudWxsLGMsZSksZy5wdXNoKHtldmVudDpoLGxpc3RlbmVyczp0fSkpfX1pZigwPT09KGImNykpe2E6e2g9XCJtb3VzZW92ZXJcIj09PWF8fFwicG9pbnRlcm92ZXJcIj09PWE7az1cIm1vdXNlb3V0XCI9PT1hfHxcInBvaW50ZXJvdXRcIj09PWE7aWYoaCYmYyE9PXdiJiYobj1jLnJlbGF0ZWRUYXJnZXR8fGMuZnJvbUVsZW1lbnQpJiYoV2Mobil8fG5bdWZdKSlicmVhayBhO2lmKGt8fGgpe2g9ZS53aW5kb3c9PT1lP2U6KGg9ZS5vd25lckRvY3VtZW50KT9oLmRlZmF1bHRWaWV3fHxoLnBhcmVudFdpbmRvdzp3aW5kb3c7aWYoayl7aWYobj1jLnJlbGF0ZWRUYXJnZXR8fGMudG9FbGVtZW50LGs9ZCxuPW4/V2Mobik6bnVsbCxudWxsIT09XG5uJiYoSj1WYihuKSxuIT09Snx8NSE9PW4udGFnJiY2IT09bi50YWcpKW49bnVsbH1lbHNlIGs9bnVsbCxuPWQ7aWYoayE9PW4pe3Q9QmQ7Rj1cIm9uTW91c2VMZWF2ZVwiO3g9XCJvbk1vdXNlRW50ZXJcIjt3PVwibW91c2VcIjtpZihcInBvaW50ZXJvdXRcIj09PWF8fFwicG9pbnRlcm92ZXJcIj09PWEpdD1UZCxGPVwib25Qb2ludGVyTGVhdmVcIix4PVwib25Qb2ludGVyRW50ZXJcIix3PVwicG9pbnRlclwiO0o9bnVsbD09az9oOnVlKGspO3U9bnVsbD09bj9oOnVlKG4pO2g9bmV3IHQoRix3K1wibGVhdmVcIixrLGMsZSk7aC50YXJnZXQ9SjtoLnJlbGF0ZWRUYXJnZXQ9dTtGPW51bGw7V2MoZSk9PT1kJiYodD1uZXcgdCh4LHcrXCJlbnRlclwiLG4sYyxlKSx0LnRhcmdldD11LHQucmVsYXRlZFRhcmdldD1KLEY9dCk7Sj1GO2lmKGsmJm4pYjp7dD1rO3g9bjt3PTA7Zm9yKHU9dDt1O3U9dmYodSkpdysrO3U9MDtmb3IoRj14O0Y7Rj12ZihGKSl1Kys7Zm9yKDswPHctdTspdD12Zih0KSx3LS07Zm9yKDswPHUtdzspeD1cbnZmKHgpLHUtLTtmb3IoO3ctLTspe2lmKHQ9PT14fHxudWxsIT09eCYmdD09PXguYWx0ZXJuYXRlKWJyZWFrIGI7dD12Zih0KTt4PXZmKHgpfXQ9bnVsbH1lbHNlIHQ9bnVsbDtudWxsIT09ayYmd2YoZyxoLGssdCwhMSk7bnVsbCE9PW4mJm51bGwhPT1KJiZ3ZihnLEosbix0LCEwKX19fWE6e2g9ZD91ZShkKTp3aW5kb3c7az1oLm5vZGVOYW1lJiZoLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7aWYoXCJzZWxlY3RcIj09PWt8fFwiaW5wdXRcIj09PWsmJlwiZmlsZVwiPT09aC50eXBlKXZhciBuYT12ZTtlbHNlIGlmKG1lKGgpKWlmKHdlKW5hPUZlO2Vsc2V7bmE9RGU7dmFyIHhhPUNlfWVsc2Uoaz1oLm5vZGVOYW1lKSYmXCJpbnB1dFwiPT09ay50b0xvd2VyQ2FzZSgpJiYoXCJjaGVja2JveFwiPT09aC50eXBlfHxcInJhZGlvXCI9PT1oLnR5cGUpJiYobmE9RWUpO2lmKG5hJiYobmE9bmEoYSxkKSkpe25lKGcsbmEsYyxlKTticmVhayBhfXhhJiZ4YShhLGgsZCk7XCJmb2N1c291dFwiPT09YSYmKHhhPWguX3dyYXBwZXJTdGF0ZSkmJlxueGEuY29udHJvbGxlZCYmXCJudW1iZXJcIj09PWgudHlwZSYmY2IoaCxcIm51bWJlclwiLGgudmFsdWUpfXhhPWQ/dWUoZCk6d2luZG93O3N3aXRjaChhKXtjYXNlIFwiZm9jdXNpblwiOmlmKG1lKHhhKXx8XCJ0cnVlXCI9PT14YS5jb250ZW50RWRpdGFibGUpUWU9eGEsUmU9ZCxTZT1udWxsO2JyZWFrO2Nhc2UgXCJmb2N1c291dFwiOlNlPVJlPVFlPW51bGw7YnJlYWs7Y2FzZSBcIm1vdXNlZG93blwiOlRlPSEwO2JyZWFrO2Nhc2UgXCJjb250ZXh0bWVudVwiOmNhc2UgXCJtb3VzZXVwXCI6Y2FzZSBcImRyYWdlbmRcIjpUZT0hMTtVZShnLGMsZSk7YnJlYWs7Y2FzZSBcInNlbGVjdGlvbmNoYW5nZVwiOmlmKFBlKWJyZWFrO2Nhc2UgXCJrZXlkb3duXCI6Y2FzZSBcImtleXVwXCI6VWUoZyxjLGUpfXZhciAkYTtpZihhZSliOntzd2l0Y2goYSl7Y2FzZSBcImNvbXBvc2l0aW9uc3RhcnRcIjp2YXIgYmE9XCJvbkNvbXBvc2l0aW9uU3RhcnRcIjticmVhayBiO2Nhc2UgXCJjb21wb3NpdGlvbmVuZFwiOmJhPVwib25Db21wb3NpdGlvbkVuZFwiO1xuYnJlYWsgYjtjYXNlIFwiY29tcG9zaXRpb251cGRhdGVcIjpiYT1cIm9uQ29tcG9zaXRpb25VcGRhdGVcIjticmVhayBifWJhPXZvaWQgMH1lbHNlIGllP2dlKGEsYykmJihiYT1cIm9uQ29tcG9zaXRpb25FbmRcIik6XCJrZXlkb3duXCI9PT1hJiYyMjk9PT1jLmtleUNvZGUmJihiYT1cIm9uQ29tcG9zaXRpb25TdGFydFwiKTtiYSYmKGRlJiZcImtvXCIhPT1jLmxvY2FsZSYmKGllfHxcIm9uQ29tcG9zaXRpb25TdGFydFwiIT09YmE/XCJvbkNvbXBvc2l0aW9uRW5kXCI9PT1iYSYmaWUmJigkYT1uZCgpKTooa2Q9ZSxsZD1cInZhbHVlXCJpbiBrZD9rZC52YWx1ZTprZC50ZXh0Q29udGVudCxpZT0hMCkpLHhhPW9lKGQsYmEpLDA8eGEubGVuZ3RoJiYoYmE9bmV3IExkKGJhLGEsbnVsbCxjLGUpLGcucHVzaCh7ZXZlbnQ6YmEsbGlzdGVuZXJzOnhhfSksJGE/YmEuZGF0YT0kYTooJGE9aGUoYyksbnVsbCE9PSRhJiYoYmEuZGF0YT0kYSkpKSk7aWYoJGE9Y2U/amUoYSxjKTprZShhLGMpKWQ9b2UoZCxcIm9uQmVmb3JlSW5wdXRcIiksXG4wPGQubGVuZ3RoJiYoZT1uZXcgTGQoXCJvbkJlZm9yZUlucHV0XCIsXCJiZWZvcmVpbnB1dFwiLG51bGwsYyxlKSxnLnB1c2goe2V2ZW50OmUsbGlzdGVuZXJzOmR9KSxlLmRhdGE9JGEpfXNlKGcsYil9KX1mdW5jdGlvbiB0ZihhLGIsYyl7cmV0dXJue2luc3RhbmNlOmEsbGlzdGVuZXI6YixjdXJyZW50VGFyZ2V0OmN9fWZ1bmN0aW9uIG9lKGEsYil7Zm9yKHZhciBjPWIrXCJDYXB0dXJlXCIsZD1bXTtudWxsIT09YTspe3ZhciBlPWEsZj1lLnN0YXRlTm9kZTs1PT09ZS50YWcmJm51bGwhPT1mJiYoZT1mLGY9S2IoYSxjKSxudWxsIT1mJiZkLnVuc2hpZnQodGYoYSxmLGUpKSxmPUtiKGEsYiksbnVsbCE9ZiYmZC5wdXNoKHRmKGEsZixlKSkpO2E9YS5yZXR1cm59cmV0dXJuIGR9ZnVuY3Rpb24gdmYoYSl7aWYobnVsbD09PWEpcmV0dXJuIG51bGw7ZG8gYT1hLnJldHVybjt3aGlsZShhJiY1IT09YS50YWcpO3JldHVybiBhP2E6bnVsbH1cbmZ1bmN0aW9uIHdmKGEsYixjLGQsZSl7Zm9yKHZhciBmPWIuX3JlYWN0TmFtZSxnPVtdO251bGwhPT1jJiZjIT09ZDspe3ZhciBoPWMsaz1oLmFsdGVybmF0ZSxsPWguc3RhdGVOb2RlO2lmKG51bGwhPT1rJiZrPT09ZClicmVhazs1PT09aC50YWcmJm51bGwhPT1sJiYoaD1sLGU/KGs9S2IoYyxmKSxudWxsIT1rJiZnLnVuc2hpZnQodGYoYyxrLGgpKSk6ZXx8KGs9S2IoYyxmKSxudWxsIT1rJiZnLnB1c2godGYoYyxrLGgpKSkpO2M9Yy5yZXR1cm59MCE9PWcubGVuZ3RoJiZhLnB1c2goe2V2ZW50OmIsbGlzdGVuZXJzOmd9KX12YXIgeGY9L1xcclxcbj8vZyx5Zj0vXFx1MDAwMHxcXHVGRkZEL2c7ZnVuY3Rpb24gemYoYSl7cmV0dXJuKFwic3RyaW5nXCI9PT10eXBlb2YgYT9hOlwiXCIrYSkucmVwbGFjZSh4ZixcIlxcblwiKS5yZXBsYWNlKHlmLFwiXCIpfWZ1bmN0aW9uIEFmKGEsYixjKXtiPXpmKGIpO2lmKHpmKGEpIT09YiYmYyl0aHJvdyBFcnJvcihwKDQyNSkpO31mdW5jdGlvbiBCZigpe31cbnZhciBDZj1udWxsLERmPW51bGw7ZnVuY3Rpb24gRWYoYSxiKXtyZXR1cm5cInRleHRhcmVhXCI9PT1hfHxcIm5vc2NyaXB0XCI9PT1hfHxcInN0cmluZ1wiPT09dHlwZW9mIGIuY2hpbGRyZW58fFwibnVtYmVyXCI9PT10eXBlb2YgYi5jaGlsZHJlbnx8XCJvYmplY3RcIj09PXR5cGVvZiBiLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MJiZudWxsIT09Yi5kYW5nZXJvdXNseVNldElubmVySFRNTCYmbnVsbCE9Yi5kYW5nZXJvdXNseVNldElubmVySFRNTC5fX2h0bWx9XG52YXIgRmY9XCJmdW5jdGlvblwiPT09dHlwZW9mIHNldFRpbWVvdXQ/c2V0VGltZW91dDp2b2lkIDAsR2Y9XCJmdW5jdGlvblwiPT09dHlwZW9mIGNsZWFyVGltZW91dD9jbGVhclRpbWVvdXQ6dm9pZCAwLEhmPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBQcm9taXNlP1Byb21pc2U6dm9pZCAwLEpmPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBxdWV1ZU1pY3JvdGFzaz9xdWV1ZU1pY3JvdGFzazpcInVuZGVmaW5lZFwiIT09dHlwZW9mIEhmP2Z1bmN0aW9uKGEpe3JldHVybiBIZi5yZXNvbHZlKG51bGwpLnRoZW4oYSkuY2F0Y2goSWYpfTpGZjtmdW5jdGlvbiBJZihhKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhyb3cgYTt9KX1cbmZ1bmN0aW9uIEtmKGEsYil7dmFyIGM9YixkPTA7ZG97dmFyIGU9Yy5uZXh0U2libGluZzthLnJlbW92ZUNoaWxkKGMpO2lmKGUmJjg9PT1lLm5vZGVUeXBlKWlmKGM9ZS5kYXRhLFwiLyRcIj09PWMpe2lmKDA9PT1kKXthLnJlbW92ZUNoaWxkKGUpO2JkKGIpO3JldHVybn1kLS19ZWxzZVwiJFwiIT09YyYmXCIkP1wiIT09YyYmXCIkIVwiIT09Y3x8ZCsrO2M9ZX13aGlsZShjKTtiZChiKX1mdW5jdGlvbiBMZihhKXtmb3IoO251bGwhPWE7YT1hLm5leHRTaWJsaW5nKXt2YXIgYj1hLm5vZGVUeXBlO2lmKDE9PT1ifHwzPT09YilicmVhaztpZig4PT09Yil7Yj1hLmRhdGE7aWYoXCIkXCI9PT1ifHxcIiQhXCI9PT1ifHxcIiQ/XCI9PT1iKWJyZWFrO2lmKFwiLyRcIj09PWIpcmV0dXJuIG51bGx9fXJldHVybiBhfVxuZnVuY3Rpb24gTWYoYSl7YT1hLnByZXZpb3VzU2libGluZztmb3IodmFyIGI9MDthOyl7aWYoOD09PWEubm9kZVR5cGUpe3ZhciBjPWEuZGF0YTtpZihcIiRcIj09PWN8fFwiJCFcIj09PWN8fFwiJD9cIj09PWMpe2lmKDA9PT1iKXJldHVybiBhO2ItLX1lbHNlXCIvJFwiPT09YyYmYisrfWE9YS5wcmV2aW91c1NpYmxpbmd9cmV0dXJuIG51bGx9dmFyIE5mPU1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpLE9mPVwiX19yZWFjdEZpYmVyJFwiK05mLFBmPVwiX19yZWFjdFByb3BzJFwiK05mLHVmPVwiX19yZWFjdENvbnRhaW5lciRcIitOZixvZj1cIl9fcmVhY3RFdmVudHMkXCIrTmYsUWY9XCJfX3JlYWN0TGlzdGVuZXJzJFwiK05mLFJmPVwiX19yZWFjdEhhbmRsZXMkXCIrTmY7XG5mdW5jdGlvbiBXYyhhKXt2YXIgYj1hW09mXTtpZihiKXJldHVybiBiO2Zvcih2YXIgYz1hLnBhcmVudE5vZGU7Yzspe2lmKGI9Y1t1Zl18fGNbT2ZdKXtjPWIuYWx0ZXJuYXRlO2lmKG51bGwhPT1iLmNoaWxkfHxudWxsIT09YyYmbnVsbCE9PWMuY2hpbGQpZm9yKGE9TWYoYSk7bnVsbCE9PWE7KXtpZihjPWFbT2ZdKXJldHVybiBjO2E9TWYoYSl9cmV0dXJuIGJ9YT1jO2M9YS5wYXJlbnROb2RlfXJldHVybiBudWxsfWZ1bmN0aW9uIENiKGEpe2E9YVtPZl18fGFbdWZdO3JldHVybiFhfHw1IT09YS50YWcmJjYhPT1hLnRhZyYmMTMhPT1hLnRhZyYmMyE9PWEudGFnP251bGw6YX1mdW5jdGlvbiB1ZShhKXtpZig1PT09YS50YWd8fDY9PT1hLnRhZylyZXR1cm4gYS5zdGF0ZU5vZGU7dGhyb3cgRXJyb3IocCgzMykpO31mdW5jdGlvbiBEYihhKXtyZXR1cm4gYVtQZl18fG51bGx9dmFyIFNmPVtdLFRmPS0xO2Z1bmN0aW9uIFVmKGEpe3JldHVybntjdXJyZW50OmF9fVxuZnVuY3Rpb24gRShhKXswPlRmfHwoYS5jdXJyZW50PVNmW1RmXSxTZltUZl09bnVsbCxUZi0tKX1mdW5jdGlvbiBHKGEsYil7VGYrKztTZltUZl09YS5jdXJyZW50O2EuY3VycmVudD1ifXZhciBWZj17fSxIPVVmKFZmKSxXZj1VZighMSksWGY9VmY7ZnVuY3Rpb24gWWYoYSxiKXt2YXIgYz1hLnR5cGUuY29udGV4dFR5cGVzO2lmKCFjKXJldHVybiBWZjt2YXIgZD1hLnN0YXRlTm9kZTtpZihkJiZkLl9fcmVhY3RJbnRlcm5hbE1lbW9pemVkVW5tYXNrZWRDaGlsZENvbnRleHQ9PT1iKXJldHVybiBkLl9fcmVhY3RJbnRlcm5hbE1lbW9pemVkTWFza2VkQ2hpbGRDb250ZXh0O3ZhciBlPXt9LGY7Zm9yKGYgaW4gYyllW2ZdPWJbZl07ZCYmKGE9YS5zdGF0ZU5vZGUsYS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZFVubWFza2VkQ2hpbGRDb250ZXh0PWIsYS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZE1hc2tlZENoaWxkQ29udGV4dD1lKTtyZXR1cm4gZX1cbmZ1bmN0aW9uIFpmKGEpe2E9YS5jaGlsZENvbnRleHRUeXBlcztyZXR1cm4gbnVsbCE9PWEmJnZvaWQgMCE9PWF9ZnVuY3Rpb24gJGYoKXtFKFdmKTtFKEgpfWZ1bmN0aW9uIGFnKGEsYixjKXtpZihILmN1cnJlbnQhPT1WZil0aHJvdyBFcnJvcihwKDE2OCkpO0coSCxiKTtHKFdmLGMpfWZ1bmN0aW9uIGJnKGEsYixjKXt2YXIgZD1hLnN0YXRlTm9kZTtiPWIuY2hpbGRDb250ZXh0VHlwZXM7aWYoXCJmdW5jdGlvblwiIT09dHlwZW9mIGQuZ2V0Q2hpbGRDb250ZXh0KXJldHVybiBjO2Q9ZC5nZXRDaGlsZENvbnRleHQoKTtmb3IodmFyIGUgaW4gZClpZighKGUgaW4gYikpdGhyb3cgRXJyb3IocCgxMDgsUmEoYSl8fFwiVW5rbm93blwiLGUpKTtyZXR1cm4gQSh7fSxjLGQpfVxuZnVuY3Rpb24gY2coYSl7YT0oYT1hLnN0YXRlTm9kZSkmJmEuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNZXJnZWRDaGlsZENvbnRleHR8fFZmO1hmPUguY3VycmVudDtHKEgsYSk7RyhXZixXZi5jdXJyZW50KTtyZXR1cm4hMH1mdW5jdGlvbiBkZyhhLGIsYyl7dmFyIGQ9YS5zdGF0ZU5vZGU7aWYoIWQpdGhyb3cgRXJyb3IocCgxNjkpKTtjPyhhPWJnKGEsYixYZiksZC5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZE1lcmdlZENoaWxkQ29udGV4dD1hLEUoV2YpLEUoSCksRyhILGEpKTpFKFdmKTtHKFdmLGMpfXZhciBlZz1udWxsLGZnPSExLGdnPSExO2Z1bmN0aW9uIGhnKGEpe251bGw9PT1lZz9lZz1bYV06ZWcucHVzaChhKX1mdW5jdGlvbiBpZyhhKXtmZz0hMDtoZyhhKX1cbmZ1bmN0aW9uIGpnKCl7aWYoIWdnJiZudWxsIT09ZWcpe2dnPSEwO3ZhciBhPTAsYj1DO3RyeXt2YXIgYz1lZztmb3IoQz0xO2E8Yy5sZW5ndGg7YSsrKXt2YXIgZD1jW2FdO2RvIGQ9ZCghMCk7d2hpbGUobnVsbCE9PWQpfWVnPW51bGw7Zmc9ITF9Y2F0Y2goZSl7dGhyb3cgbnVsbCE9PWVnJiYoZWc9ZWcuc2xpY2UoYSsxKSksYWMoZmMsamcpLGU7fWZpbmFsbHl7Qz1iLGdnPSExfX1yZXR1cm4gbnVsbH12YXIga2c9W10sbGc9MCxtZz1udWxsLG5nPTAsb2c9W10scGc9MCxxZz1udWxsLHJnPTEsc2c9XCJcIjtmdW5jdGlvbiB0ZyhhLGIpe2tnW2xnKytdPW5nO2tnW2xnKytdPW1nO21nPWE7bmc9Yn1cbmZ1bmN0aW9uIHVnKGEsYixjKXtvZ1twZysrXT1yZztvZ1twZysrXT1zZztvZ1twZysrXT1xZztxZz1hO3ZhciBkPXJnO2E9c2c7dmFyIGU9MzItb2MoZCktMTtkJj1+KDE8PGUpO2MrPTE7dmFyIGY9MzItb2MoYikrZTtpZigzMDxmKXt2YXIgZz1lLWUlNTtmPShkJigxPDxnKS0xKS50b1N0cmluZygzMik7ZD4+PWc7ZS09ZztyZz0xPDwzMi1vYyhiKStlfGM8PGV8ZDtzZz1mK2F9ZWxzZSByZz0xPDxmfGM8PGV8ZCxzZz1hfWZ1bmN0aW9uIHZnKGEpe251bGwhPT1hLnJldHVybiYmKHRnKGEsMSksdWcoYSwxLDApKX1mdW5jdGlvbiB3ZyhhKXtmb3IoO2E9PT1tZzspbWc9a2dbLS1sZ10sa2dbbGddPW51bGwsbmc9a2dbLS1sZ10sa2dbbGddPW51bGw7Zm9yKDthPT09cWc7KXFnPW9nWy0tcGddLG9nW3BnXT1udWxsLHNnPW9nWy0tcGddLG9nW3BnXT1udWxsLHJnPW9nWy0tcGddLG9nW3BnXT1udWxsfXZhciB4Zz1udWxsLHlnPW51bGwsST0hMSx6Zz1udWxsO1xuZnVuY3Rpb24gQWcoYSxiKXt2YXIgYz1CZyg1LG51bGwsbnVsbCwwKTtjLmVsZW1lbnRUeXBlPVwiREVMRVRFRFwiO2Muc3RhdGVOb2RlPWI7Yy5yZXR1cm49YTtiPWEuZGVsZXRpb25zO251bGw9PT1iPyhhLmRlbGV0aW9ucz1bY10sYS5mbGFnc3w9MTYpOmIucHVzaChjKX1cbmZ1bmN0aW9uIENnKGEsYil7c3dpdGNoKGEudGFnKXtjYXNlIDU6dmFyIGM9YS50eXBlO2I9MSE9PWIubm9kZVR5cGV8fGMudG9Mb3dlckNhc2UoKSE9PWIubm9kZU5hbWUudG9Mb3dlckNhc2UoKT9udWxsOmI7cmV0dXJuIG51bGwhPT1iPyhhLnN0YXRlTm9kZT1iLHhnPWEseWc9TGYoYi5maXJzdENoaWxkKSwhMCk6ITE7Y2FzZSA2OnJldHVybiBiPVwiXCI9PT1hLnBlbmRpbmdQcm9wc3x8MyE9PWIubm9kZVR5cGU/bnVsbDpiLG51bGwhPT1iPyhhLnN0YXRlTm9kZT1iLHhnPWEseWc9bnVsbCwhMCk6ITE7Y2FzZSAxMzpyZXR1cm4gYj04IT09Yi5ub2RlVHlwZT9udWxsOmIsbnVsbCE9PWI/KGM9bnVsbCE9PXFnP3tpZDpyZyxvdmVyZmxvdzpzZ306bnVsbCxhLm1lbW9pemVkU3RhdGU9e2RlaHlkcmF0ZWQ6Yix0cmVlQ29udGV4dDpjLHJldHJ5TGFuZToxMDczNzQxODI0fSxjPUJnKDE4LG51bGwsbnVsbCwwKSxjLnN0YXRlTm9kZT1iLGMucmV0dXJuPWEsYS5jaGlsZD1jLHhnPWEseWc9XG5udWxsLCEwKTohMTtkZWZhdWx0OnJldHVybiExfX1mdW5jdGlvbiBEZyhhKXtyZXR1cm4gMCE9PShhLm1vZGUmMSkmJjA9PT0oYS5mbGFncyYxMjgpfWZ1bmN0aW9uIEVnKGEpe2lmKEkpe3ZhciBiPXlnO2lmKGIpe3ZhciBjPWI7aWYoIUNnKGEsYikpe2lmKERnKGEpKXRocm93IEVycm9yKHAoNDE4KSk7Yj1MZihjLm5leHRTaWJsaW5nKTt2YXIgZD14ZztiJiZDZyhhLGIpP0FnKGQsYyk6KGEuZmxhZ3M9YS5mbGFncyYtNDA5N3wyLEk9ITEseGc9YSl9fWVsc2V7aWYoRGcoYSkpdGhyb3cgRXJyb3IocCg0MTgpKTthLmZsYWdzPWEuZmxhZ3MmLTQwOTd8MjtJPSExO3hnPWF9fX1mdW5jdGlvbiBGZyhhKXtmb3IoYT1hLnJldHVybjtudWxsIT09YSYmNSE9PWEudGFnJiYzIT09YS50YWcmJjEzIT09YS50YWc7KWE9YS5yZXR1cm47eGc9YX1cbmZ1bmN0aW9uIEdnKGEpe2lmKGEhPT14ZylyZXR1cm4hMTtpZighSSlyZXR1cm4gRmcoYSksST0hMCwhMTt2YXIgYjsoYj0zIT09YS50YWcpJiYhKGI9NSE9PWEudGFnKSYmKGI9YS50eXBlLGI9XCJoZWFkXCIhPT1iJiZcImJvZHlcIiE9PWImJiFFZihhLnR5cGUsYS5tZW1vaXplZFByb3BzKSk7aWYoYiYmKGI9eWcpKXtpZihEZyhhKSl0aHJvdyBIZygpLEVycm9yKHAoNDE4KSk7Zm9yKDtiOylBZyhhLGIpLGI9TGYoYi5uZXh0U2libGluZyl9RmcoYSk7aWYoMTM9PT1hLnRhZyl7YT1hLm1lbW9pemVkU3RhdGU7YT1udWxsIT09YT9hLmRlaHlkcmF0ZWQ6bnVsbDtpZighYSl0aHJvdyBFcnJvcihwKDMxNykpO2E6e2E9YS5uZXh0U2libGluZztmb3IoYj0wO2E7KXtpZig4PT09YS5ub2RlVHlwZSl7dmFyIGM9YS5kYXRhO2lmKFwiLyRcIj09PWMpe2lmKDA9PT1iKXt5Zz1MZihhLm5leHRTaWJsaW5nKTticmVhayBhfWItLX1lbHNlXCIkXCIhPT1jJiZcIiQhXCIhPT1jJiZcIiQ/XCIhPT1jfHxiKyt9YT1hLm5leHRTaWJsaW5nfXlnPVxubnVsbH19ZWxzZSB5Zz14Zz9MZihhLnN0YXRlTm9kZS5uZXh0U2libGluZyk6bnVsbDtyZXR1cm4hMH1mdW5jdGlvbiBIZygpe2Zvcih2YXIgYT15ZzthOylhPUxmKGEubmV4dFNpYmxpbmcpfWZ1bmN0aW9uIElnKCl7eWc9eGc9bnVsbDtJPSExfWZ1bmN0aW9uIEpnKGEpe251bGw9PT16Zz96Zz1bYV06emcucHVzaChhKX12YXIgS2c9dWEuUmVhY3RDdXJyZW50QmF0Y2hDb25maWc7XG5mdW5jdGlvbiBMZyhhLGIsYyl7YT1jLnJlZjtpZihudWxsIT09YSYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGEmJlwib2JqZWN0XCIhPT10eXBlb2YgYSl7aWYoYy5fb3duZXIpe2M9Yy5fb3duZXI7aWYoYyl7aWYoMSE9PWMudGFnKXRocm93IEVycm9yKHAoMzA5KSk7dmFyIGQ9Yy5zdGF0ZU5vZGV9aWYoIWQpdGhyb3cgRXJyb3IocCgxNDcsYSkpO3ZhciBlPWQsZj1cIlwiK2E7aWYobnVsbCE9PWImJm51bGwhPT1iLnJlZiYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGIucmVmJiZiLnJlZi5fc3RyaW5nUmVmPT09ZilyZXR1cm4gYi5yZWY7Yj1mdW5jdGlvbihhKXt2YXIgYj1lLnJlZnM7bnVsbD09PWE/ZGVsZXRlIGJbZl06YltmXT1hfTtiLl9zdHJpbmdSZWY9ZjtyZXR1cm4gYn1pZihcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgRXJyb3IocCgyODQpKTtpZighYy5fb3duZXIpdGhyb3cgRXJyb3IocCgyOTAsYSkpO31yZXR1cm4gYX1cbmZ1bmN0aW9uIE1nKGEsYil7YT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYik7dGhyb3cgRXJyb3IocCgzMSxcIltvYmplY3QgT2JqZWN0XVwiPT09YT9cIm9iamVjdCB3aXRoIGtleXMge1wiK09iamVjdC5rZXlzKGIpLmpvaW4oXCIsIFwiKStcIn1cIjphKSk7fWZ1bmN0aW9uIE5nKGEpe3ZhciBiPWEuX2luaXQ7cmV0dXJuIGIoYS5fcGF5bG9hZCl9XG5mdW5jdGlvbiBPZyhhKXtmdW5jdGlvbiBiKGIsYyl7aWYoYSl7dmFyIGQ9Yi5kZWxldGlvbnM7bnVsbD09PWQ/KGIuZGVsZXRpb25zPVtjXSxiLmZsYWdzfD0xNik6ZC5wdXNoKGMpfX1mdW5jdGlvbiBjKGMsZCl7aWYoIWEpcmV0dXJuIG51bGw7Zm9yKDtudWxsIT09ZDspYihjLGQpLGQ9ZC5zaWJsaW5nO3JldHVybiBudWxsfWZ1bmN0aW9uIGQoYSxiKXtmb3IoYT1uZXcgTWFwO251bGwhPT1iOyludWxsIT09Yi5rZXk/YS5zZXQoYi5rZXksYik6YS5zZXQoYi5pbmRleCxiKSxiPWIuc2libGluZztyZXR1cm4gYX1mdW5jdGlvbiBlKGEsYil7YT1QZyhhLGIpO2EuaW5kZXg9MDthLnNpYmxpbmc9bnVsbDtyZXR1cm4gYX1mdW5jdGlvbiBmKGIsYyxkKXtiLmluZGV4PWQ7aWYoIWEpcmV0dXJuIGIuZmxhZ3N8PTEwNDg1NzYsYztkPWIuYWx0ZXJuYXRlO2lmKG51bGwhPT1kKXJldHVybiBkPWQuaW5kZXgsZDxjPyhiLmZsYWdzfD0yLGMpOmQ7Yi5mbGFnc3w9MjtyZXR1cm4gY31mdW5jdGlvbiBnKGIpe2EmJlxubnVsbD09PWIuYWx0ZXJuYXRlJiYoYi5mbGFnc3w9Mik7cmV0dXJuIGJ9ZnVuY3Rpb24gaChhLGIsYyxkKXtpZihudWxsPT09Ynx8NiE9PWIudGFnKXJldHVybiBiPVFnKGMsYS5tb2RlLGQpLGIucmV0dXJuPWEsYjtiPWUoYixjKTtiLnJldHVybj1hO3JldHVybiBifWZ1bmN0aW9uIGsoYSxiLGMsZCl7dmFyIGY9Yy50eXBlO2lmKGY9PT15YSlyZXR1cm4gbShhLGIsYy5wcm9wcy5jaGlsZHJlbixkLGMua2V5KTtpZihudWxsIT09YiYmKGIuZWxlbWVudFR5cGU9PT1mfHxcIm9iamVjdFwiPT09dHlwZW9mIGYmJm51bGwhPT1mJiZmLiQkdHlwZW9mPT09SGEmJk5nKGYpPT09Yi50eXBlKSlyZXR1cm4gZD1lKGIsYy5wcm9wcyksZC5yZWY9TGcoYSxiLGMpLGQucmV0dXJuPWEsZDtkPVJnKGMudHlwZSxjLmtleSxjLnByb3BzLG51bGwsYS5tb2RlLGQpO2QucmVmPUxnKGEsYixjKTtkLnJldHVybj1hO3JldHVybiBkfWZ1bmN0aW9uIGwoYSxiLGMsZCl7aWYobnVsbD09PWJ8fDQhPT1iLnRhZ3x8XG5iLnN0YXRlTm9kZS5jb250YWluZXJJbmZvIT09Yy5jb250YWluZXJJbmZvfHxiLnN0YXRlTm9kZS5pbXBsZW1lbnRhdGlvbiE9PWMuaW1wbGVtZW50YXRpb24pcmV0dXJuIGI9U2coYyxhLm1vZGUsZCksYi5yZXR1cm49YSxiO2I9ZShiLGMuY2hpbGRyZW58fFtdKTtiLnJldHVybj1hO3JldHVybiBifWZ1bmN0aW9uIG0oYSxiLGMsZCxmKXtpZihudWxsPT09Ynx8NyE9PWIudGFnKXJldHVybiBiPVRnKGMsYS5tb2RlLGQsZiksYi5yZXR1cm49YSxiO2I9ZShiLGMpO2IucmV0dXJuPWE7cmV0dXJuIGJ9ZnVuY3Rpb24gcShhLGIsYyl7aWYoXCJzdHJpbmdcIj09PXR5cGVvZiBiJiZcIlwiIT09Ynx8XCJudW1iZXJcIj09PXR5cGVvZiBiKXJldHVybiBiPVFnKFwiXCIrYixhLm1vZGUsYyksYi5yZXR1cm49YSxiO2lmKFwib2JqZWN0XCI9PT10eXBlb2YgYiYmbnVsbCE9PWIpe3N3aXRjaChiLiQkdHlwZW9mKXtjYXNlIHZhOnJldHVybiBjPVJnKGIudHlwZSxiLmtleSxiLnByb3BzLG51bGwsYS5tb2RlLGMpLFxuYy5yZWY9TGcoYSxudWxsLGIpLGMucmV0dXJuPWEsYztjYXNlIHdhOnJldHVybiBiPVNnKGIsYS5tb2RlLGMpLGIucmV0dXJuPWEsYjtjYXNlIEhhOnZhciBkPWIuX2luaXQ7cmV0dXJuIHEoYSxkKGIuX3BheWxvYWQpLGMpfWlmKGViKGIpfHxLYShiKSlyZXR1cm4gYj1UZyhiLGEubW9kZSxjLG51bGwpLGIucmV0dXJuPWEsYjtNZyhhLGIpfXJldHVybiBudWxsfWZ1bmN0aW9uIHIoYSxiLGMsZCl7dmFyIGU9bnVsbCE9PWI/Yi5rZXk6bnVsbDtpZihcInN0cmluZ1wiPT09dHlwZW9mIGMmJlwiXCIhPT1jfHxcIm51bWJlclwiPT09dHlwZW9mIGMpcmV0dXJuIG51bGwhPT1lP251bGw6aChhLGIsXCJcIitjLGQpO2lmKFwib2JqZWN0XCI9PT10eXBlb2YgYyYmbnVsbCE9PWMpe3N3aXRjaChjLiQkdHlwZW9mKXtjYXNlIHZhOnJldHVybiBjLmtleT09PWU/ayhhLGIsYyxkKTpudWxsO2Nhc2Ugd2E6cmV0dXJuIGMua2V5PT09ZT9sKGEsYixjLGQpOm51bGw7Y2FzZSBIYTpyZXR1cm4gZT1jLl9pbml0LHIoYSxcbmIsZShjLl9wYXlsb2FkKSxkKX1pZihlYihjKXx8S2EoYykpcmV0dXJuIG51bGwhPT1lP251bGw6bShhLGIsYyxkLG51bGwpO01nKGEsYyl9cmV0dXJuIG51bGx9ZnVuY3Rpb24geShhLGIsYyxkLGUpe2lmKFwic3RyaW5nXCI9PT10eXBlb2YgZCYmXCJcIiE9PWR8fFwibnVtYmVyXCI9PT10eXBlb2YgZClyZXR1cm4gYT1hLmdldChjKXx8bnVsbCxoKGIsYSxcIlwiK2QsZSk7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBkJiZudWxsIT09ZCl7c3dpdGNoKGQuJCR0eXBlb2Ype2Nhc2UgdmE6cmV0dXJuIGE9YS5nZXQobnVsbD09PWQua2V5P2M6ZC5rZXkpfHxudWxsLGsoYixhLGQsZSk7Y2FzZSB3YTpyZXR1cm4gYT1hLmdldChudWxsPT09ZC5rZXk/YzpkLmtleSl8fG51bGwsbChiLGEsZCxlKTtjYXNlIEhhOnZhciBmPWQuX2luaXQ7cmV0dXJuIHkoYSxiLGMsZihkLl9wYXlsb2FkKSxlKX1pZihlYihkKXx8S2EoZCkpcmV0dXJuIGE9YS5nZXQoYyl8fG51bGwsbShiLGEsZCxlLG51bGwpO01nKGIsZCl9cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBuKGUsZyxoLGspe2Zvcih2YXIgbD1udWxsLG09bnVsbCx1PWcsdz1nPTAseD1udWxsO251bGwhPT11JiZ3PGgubGVuZ3RoO3crKyl7dS5pbmRleD53Pyh4PXUsdT1udWxsKTp4PXUuc2libGluZzt2YXIgbj1yKGUsdSxoW3ddLGspO2lmKG51bGw9PT1uKXtudWxsPT09dSYmKHU9eCk7YnJlYWt9YSYmdSYmbnVsbD09PW4uYWx0ZXJuYXRlJiZiKGUsdSk7Zz1mKG4sZyx3KTtudWxsPT09bT9sPW46bS5zaWJsaW5nPW47bT1uO3U9eH1pZih3PT09aC5sZW5ndGgpcmV0dXJuIGMoZSx1KSxJJiZ0ZyhlLHcpLGw7aWYobnVsbD09PXUpe2Zvcig7dzxoLmxlbmd0aDt3KyspdT1xKGUsaFt3XSxrKSxudWxsIT09dSYmKGc9Zih1LGcsdyksbnVsbD09PW0/bD11Om0uc2libGluZz11LG09dSk7SSYmdGcoZSx3KTtyZXR1cm4gbH1mb3IodT1kKGUsdSk7dzxoLmxlbmd0aDt3KyspeD15KHUsZSx3LGhbd10sayksbnVsbCE9PXgmJihhJiZudWxsIT09eC5hbHRlcm5hdGUmJnUuZGVsZXRlKG51bGw9PT1cbngua2V5P3c6eC5rZXkpLGc9Zih4LGcsdyksbnVsbD09PW0/bD14Om0uc2libGluZz14LG09eCk7YSYmdS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3JldHVybiBiKGUsYSl9KTtJJiZ0ZyhlLHcpO3JldHVybiBsfWZ1bmN0aW9uIHQoZSxnLGgsayl7dmFyIGw9S2EoaCk7aWYoXCJmdW5jdGlvblwiIT09dHlwZW9mIGwpdGhyb3cgRXJyb3IocCgxNTApKTtoPWwuY2FsbChoKTtpZihudWxsPT1oKXRocm93IEVycm9yKHAoMTUxKSk7Zm9yKHZhciB1PWw9bnVsbCxtPWcsdz1nPTAseD1udWxsLG49aC5uZXh0KCk7bnVsbCE9PW0mJiFuLmRvbmU7dysrLG49aC5uZXh0KCkpe20uaW5kZXg+dz8oeD1tLG09bnVsbCk6eD1tLnNpYmxpbmc7dmFyIHQ9cihlLG0sbi52YWx1ZSxrKTtpZihudWxsPT09dCl7bnVsbD09PW0mJihtPXgpO2JyZWFrfWEmJm0mJm51bGw9PT10LmFsdGVybmF0ZSYmYihlLG0pO2c9Zih0LGcsdyk7bnVsbD09PXU/bD10OnUuc2libGluZz10O3U9dDttPXh9aWYobi5kb25lKXJldHVybiBjKGUsXG5tKSxJJiZ0ZyhlLHcpLGw7aWYobnVsbD09PW0pe2Zvcig7IW4uZG9uZTt3Kyssbj1oLm5leHQoKSluPXEoZSxuLnZhbHVlLGspLG51bGwhPT1uJiYoZz1mKG4sZyx3KSxudWxsPT09dT9sPW46dS5zaWJsaW5nPW4sdT1uKTtJJiZ0ZyhlLHcpO3JldHVybiBsfWZvcihtPWQoZSxtKTshbi5kb25lO3crKyxuPWgubmV4dCgpKW49eShtLGUsdyxuLnZhbHVlLGspLG51bGwhPT1uJiYoYSYmbnVsbCE9PW4uYWx0ZXJuYXRlJiZtLmRlbGV0ZShudWxsPT09bi5rZXk/dzpuLmtleSksZz1mKG4sZyx3KSxudWxsPT09dT9sPW46dS5zaWJsaW5nPW4sdT1uKTthJiZtLmZvckVhY2goZnVuY3Rpb24oYSl7cmV0dXJuIGIoZSxhKX0pO0kmJnRnKGUsdyk7cmV0dXJuIGx9ZnVuY3Rpb24gSihhLGQsZixoKXtcIm9iamVjdFwiPT09dHlwZW9mIGYmJm51bGwhPT1mJiZmLnR5cGU9PT15YSYmbnVsbD09PWYua2V5JiYoZj1mLnByb3BzLmNoaWxkcmVuKTtpZihcIm9iamVjdFwiPT09dHlwZW9mIGYmJm51bGwhPT1mKXtzd2l0Y2goZi4kJHR5cGVvZil7Y2FzZSB2YTphOntmb3IodmFyIGs9XG5mLmtleSxsPWQ7bnVsbCE9PWw7KXtpZihsLmtleT09PWspe2s9Zi50eXBlO2lmKGs9PT15YSl7aWYoNz09PWwudGFnKXtjKGEsbC5zaWJsaW5nKTtkPWUobCxmLnByb3BzLmNoaWxkcmVuKTtkLnJldHVybj1hO2E9ZDticmVhayBhfX1lbHNlIGlmKGwuZWxlbWVudFR5cGU9PT1rfHxcIm9iamVjdFwiPT09dHlwZW9mIGsmJm51bGwhPT1rJiZrLiQkdHlwZW9mPT09SGEmJk5nKGspPT09bC50eXBlKXtjKGEsbC5zaWJsaW5nKTtkPWUobCxmLnByb3BzKTtkLnJlZj1MZyhhLGwsZik7ZC5yZXR1cm49YTthPWQ7YnJlYWsgYX1jKGEsbCk7YnJlYWt9ZWxzZSBiKGEsbCk7bD1sLnNpYmxpbmd9Zi50eXBlPT09eWE/KGQ9VGcoZi5wcm9wcy5jaGlsZHJlbixhLm1vZGUsaCxmLmtleSksZC5yZXR1cm49YSxhPWQpOihoPVJnKGYudHlwZSxmLmtleSxmLnByb3BzLG51bGwsYS5tb2RlLGgpLGgucmVmPUxnKGEsZCxmKSxoLnJldHVybj1hLGE9aCl9cmV0dXJuIGcoYSk7Y2FzZSB3YTphOntmb3IobD1mLmtleTtudWxsIT09XG5kOyl7aWYoZC5rZXk9PT1sKWlmKDQ9PT1kLnRhZyYmZC5zdGF0ZU5vZGUuY29udGFpbmVySW5mbz09PWYuY29udGFpbmVySW5mbyYmZC5zdGF0ZU5vZGUuaW1wbGVtZW50YXRpb249PT1mLmltcGxlbWVudGF0aW9uKXtjKGEsZC5zaWJsaW5nKTtkPWUoZCxmLmNoaWxkcmVufHxbXSk7ZC5yZXR1cm49YTthPWQ7YnJlYWsgYX1lbHNle2MoYSxkKTticmVha31lbHNlIGIoYSxkKTtkPWQuc2libGluZ31kPVNnKGYsYS5tb2RlLGgpO2QucmV0dXJuPWE7YT1kfXJldHVybiBnKGEpO2Nhc2UgSGE6cmV0dXJuIGw9Zi5faW5pdCxKKGEsZCxsKGYuX3BheWxvYWQpLGgpfWlmKGViKGYpKXJldHVybiBuKGEsZCxmLGgpO2lmKEthKGYpKXJldHVybiB0KGEsZCxmLGgpO01nKGEsZil9cmV0dXJuXCJzdHJpbmdcIj09PXR5cGVvZiBmJiZcIlwiIT09Znx8XCJudW1iZXJcIj09PXR5cGVvZiBmPyhmPVwiXCIrZixudWxsIT09ZCYmNj09PWQudGFnPyhjKGEsZC5zaWJsaW5nKSxkPWUoZCxmKSxkLnJldHVybj1hLGE9ZCk6XG4oYyhhLGQpLGQ9UWcoZixhLm1vZGUsaCksZC5yZXR1cm49YSxhPWQpLGcoYSkpOmMoYSxkKX1yZXR1cm4gSn12YXIgVWc9T2coITApLFZnPU9nKCExKSxXZz1VZihudWxsKSxYZz1udWxsLFlnPW51bGwsWmc9bnVsbDtmdW5jdGlvbiAkZygpe1pnPVlnPVhnPW51bGx9ZnVuY3Rpb24gYWgoYSl7dmFyIGI9V2cuY3VycmVudDtFKFdnKTthLl9jdXJyZW50VmFsdWU9Yn1mdW5jdGlvbiBiaChhLGIsYyl7Zm9yKDtudWxsIT09YTspe3ZhciBkPWEuYWx0ZXJuYXRlOyhhLmNoaWxkTGFuZXMmYikhPT1iPyhhLmNoaWxkTGFuZXN8PWIsbnVsbCE9PWQmJihkLmNoaWxkTGFuZXN8PWIpKTpudWxsIT09ZCYmKGQuY2hpbGRMYW5lcyZiKSE9PWImJihkLmNoaWxkTGFuZXN8PWIpO2lmKGE9PT1jKWJyZWFrO2E9YS5yZXR1cm59fVxuZnVuY3Rpb24gY2goYSxiKXtYZz1hO1pnPVlnPW51bGw7YT1hLmRlcGVuZGVuY2llcztudWxsIT09YSYmbnVsbCE9PWEuZmlyc3RDb250ZXh0JiYoMCE9PShhLmxhbmVzJmIpJiYoZGg9ITApLGEuZmlyc3RDb250ZXh0PW51bGwpfWZ1bmN0aW9uIGVoKGEpe3ZhciBiPWEuX2N1cnJlbnRWYWx1ZTtpZihaZyE9PWEpaWYoYT17Y29udGV4dDphLG1lbW9pemVkVmFsdWU6YixuZXh0Om51bGx9LG51bGw9PT1ZZyl7aWYobnVsbD09PVhnKXRocm93IEVycm9yKHAoMzA4KSk7WWc9YTtYZy5kZXBlbmRlbmNpZXM9e2xhbmVzOjAsZmlyc3RDb250ZXh0OmF9fWVsc2UgWWc9WWcubmV4dD1hO3JldHVybiBifXZhciBmaD1udWxsO2Z1bmN0aW9uIGdoKGEpe251bGw9PT1maD9maD1bYV06ZmgucHVzaChhKX1cbmZ1bmN0aW9uIGhoKGEsYixjLGQpe3ZhciBlPWIuaW50ZXJsZWF2ZWQ7bnVsbD09PWU/KGMubmV4dD1jLGdoKGIpKTooYy5uZXh0PWUubmV4dCxlLm5leHQ9Yyk7Yi5pbnRlcmxlYXZlZD1jO3JldHVybiBpaChhLGQpfWZ1bmN0aW9uIGloKGEsYil7YS5sYW5lc3w9Yjt2YXIgYz1hLmFsdGVybmF0ZTtudWxsIT09YyYmKGMubGFuZXN8PWIpO2M9YTtmb3IoYT1hLnJldHVybjtudWxsIT09YTspYS5jaGlsZExhbmVzfD1iLGM9YS5hbHRlcm5hdGUsbnVsbCE9PWMmJihjLmNoaWxkTGFuZXN8PWIpLGM9YSxhPWEucmV0dXJuO3JldHVybiAzPT09Yy50YWc/Yy5zdGF0ZU5vZGU6bnVsbH12YXIgamg9ITE7ZnVuY3Rpb24ga2goYSl7YS51cGRhdGVRdWV1ZT17YmFzZVN0YXRlOmEubWVtb2l6ZWRTdGF0ZSxmaXJzdEJhc2VVcGRhdGU6bnVsbCxsYXN0QmFzZVVwZGF0ZTpudWxsLHNoYXJlZDp7cGVuZGluZzpudWxsLGludGVybGVhdmVkOm51bGwsbGFuZXM6MH0sZWZmZWN0czpudWxsfX1cbmZ1bmN0aW9uIGxoKGEsYil7YT1hLnVwZGF0ZVF1ZXVlO2IudXBkYXRlUXVldWU9PT1hJiYoYi51cGRhdGVRdWV1ZT17YmFzZVN0YXRlOmEuYmFzZVN0YXRlLGZpcnN0QmFzZVVwZGF0ZTphLmZpcnN0QmFzZVVwZGF0ZSxsYXN0QmFzZVVwZGF0ZTphLmxhc3RCYXNlVXBkYXRlLHNoYXJlZDphLnNoYXJlZCxlZmZlY3RzOmEuZWZmZWN0c30pfWZ1bmN0aW9uIG1oKGEsYil7cmV0dXJue2V2ZW50VGltZTphLGxhbmU6Yix0YWc6MCxwYXlsb2FkOm51bGwsY2FsbGJhY2s6bnVsbCxuZXh0Om51bGx9fVxuZnVuY3Rpb24gbmgoYSxiLGMpe3ZhciBkPWEudXBkYXRlUXVldWU7aWYobnVsbD09PWQpcmV0dXJuIG51bGw7ZD1kLnNoYXJlZDtpZigwIT09KEsmMikpe3ZhciBlPWQucGVuZGluZztudWxsPT09ZT9iLm5leHQ9YjooYi5uZXh0PWUubmV4dCxlLm5leHQ9Yik7ZC5wZW5kaW5nPWI7cmV0dXJuIGloKGEsYyl9ZT1kLmludGVybGVhdmVkO251bGw9PT1lPyhiLm5leHQ9YixnaChkKSk6KGIubmV4dD1lLm5leHQsZS5uZXh0PWIpO2QuaW50ZXJsZWF2ZWQ9YjtyZXR1cm4gaWgoYSxjKX1mdW5jdGlvbiBvaChhLGIsYyl7Yj1iLnVwZGF0ZVF1ZXVlO2lmKG51bGwhPT1iJiYoYj1iLnNoYXJlZCwwIT09KGMmNDE5NDI0MCkpKXt2YXIgZD1iLmxhbmVzO2QmPWEucGVuZGluZ0xhbmVzO2N8PWQ7Yi5sYW5lcz1jO0NjKGEsYyl9fVxuZnVuY3Rpb24gcGgoYSxiKXt2YXIgYz1hLnVwZGF0ZVF1ZXVlLGQ9YS5hbHRlcm5hdGU7aWYobnVsbCE9PWQmJihkPWQudXBkYXRlUXVldWUsYz09PWQpKXt2YXIgZT1udWxsLGY9bnVsbDtjPWMuZmlyc3RCYXNlVXBkYXRlO2lmKG51bGwhPT1jKXtkb3t2YXIgZz17ZXZlbnRUaW1lOmMuZXZlbnRUaW1lLGxhbmU6Yy5sYW5lLHRhZzpjLnRhZyxwYXlsb2FkOmMucGF5bG9hZCxjYWxsYmFjazpjLmNhbGxiYWNrLG5leHQ6bnVsbH07bnVsbD09PWY/ZT1mPWc6Zj1mLm5leHQ9ZztjPWMubmV4dH13aGlsZShudWxsIT09Yyk7bnVsbD09PWY/ZT1mPWI6Zj1mLm5leHQ9Yn1lbHNlIGU9Zj1iO2M9e2Jhc2VTdGF0ZTpkLmJhc2VTdGF0ZSxmaXJzdEJhc2VVcGRhdGU6ZSxsYXN0QmFzZVVwZGF0ZTpmLHNoYXJlZDpkLnNoYXJlZCxlZmZlY3RzOmQuZWZmZWN0c307YS51cGRhdGVRdWV1ZT1jO3JldHVybn1hPWMubGFzdEJhc2VVcGRhdGU7bnVsbD09PWE/Yy5maXJzdEJhc2VVcGRhdGU9YjphLm5leHQ9XG5iO2MubGFzdEJhc2VVcGRhdGU9Yn1cbmZ1bmN0aW9uIHFoKGEsYixjLGQpe3ZhciBlPWEudXBkYXRlUXVldWU7amg9ITE7dmFyIGY9ZS5maXJzdEJhc2VVcGRhdGUsZz1lLmxhc3RCYXNlVXBkYXRlLGg9ZS5zaGFyZWQucGVuZGluZztpZihudWxsIT09aCl7ZS5zaGFyZWQucGVuZGluZz1udWxsO3ZhciBrPWgsbD1rLm5leHQ7ay5uZXh0PW51bGw7bnVsbD09PWc/Zj1sOmcubmV4dD1sO2c9azt2YXIgbT1hLmFsdGVybmF0ZTtudWxsIT09bSYmKG09bS51cGRhdGVRdWV1ZSxoPW0ubGFzdEJhc2VVcGRhdGUsaCE9PWcmJihudWxsPT09aD9tLmZpcnN0QmFzZVVwZGF0ZT1sOmgubmV4dD1sLG0ubGFzdEJhc2VVcGRhdGU9aykpfWlmKG51bGwhPT1mKXt2YXIgcT1lLmJhc2VTdGF0ZTtnPTA7bT1sPWs9bnVsbDtoPWY7ZG97dmFyIHI9aC5sYW5lLHk9aC5ldmVudFRpbWU7aWYoKGQmcik9PT1yKXtudWxsIT09bSYmKG09bS5uZXh0PXtldmVudFRpbWU6eSxsYW5lOjAsdGFnOmgudGFnLHBheWxvYWQ6aC5wYXlsb2FkLGNhbGxiYWNrOmguY2FsbGJhY2ssXG5uZXh0Om51bGx9KTthOnt2YXIgbj1hLHQ9aDtyPWI7eT1jO3N3aXRjaCh0LnRhZyl7Y2FzZSAxOm49dC5wYXlsb2FkO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBuKXtxPW4uY2FsbCh5LHEscik7YnJlYWsgYX1xPW47YnJlYWsgYTtjYXNlIDM6bi5mbGFncz1uLmZsYWdzJi02NTUzN3wxMjg7Y2FzZSAwOm49dC5wYXlsb2FkO3I9XCJmdW5jdGlvblwiPT09dHlwZW9mIG4/bi5jYWxsKHkscSxyKTpuO2lmKG51bGw9PT1yfHx2b2lkIDA9PT1yKWJyZWFrIGE7cT1BKHt9LHEscik7YnJlYWsgYTtjYXNlIDI6amg9ITB9fW51bGwhPT1oLmNhbGxiYWNrJiYwIT09aC5sYW5lJiYoYS5mbGFnc3w9NjQscj1lLmVmZmVjdHMsbnVsbD09PXI/ZS5lZmZlY3RzPVtoXTpyLnB1c2goaCkpfWVsc2UgeT17ZXZlbnRUaW1lOnksbGFuZTpyLHRhZzpoLnRhZyxwYXlsb2FkOmgucGF5bG9hZCxjYWxsYmFjazpoLmNhbGxiYWNrLG5leHQ6bnVsbH0sbnVsbD09PW0/KGw9bT15LGs9cSk6bT1tLm5leHQ9eSxnfD1yO1xuaD1oLm5leHQ7aWYobnVsbD09PWgpaWYoaD1lLnNoYXJlZC5wZW5kaW5nLG51bGw9PT1oKWJyZWFrO2Vsc2Ugcj1oLGg9ci5uZXh0LHIubmV4dD1udWxsLGUubGFzdEJhc2VVcGRhdGU9cixlLnNoYXJlZC5wZW5kaW5nPW51bGx9d2hpbGUoMSk7bnVsbD09PW0mJihrPXEpO2UuYmFzZVN0YXRlPWs7ZS5maXJzdEJhc2VVcGRhdGU9bDtlLmxhc3RCYXNlVXBkYXRlPW07Yj1lLnNoYXJlZC5pbnRlcmxlYXZlZDtpZihudWxsIT09Yil7ZT1iO2RvIGd8PWUubGFuZSxlPWUubmV4dDt3aGlsZShlIT09Yil9ZWxzZSBudWxsPT09ZiYmKGUuc2hhcmVkLmxhbmVzPTApO3JofD1nO2EubGFuZXM9ZzthLm1lbW9pemVkU3RhdGU9cX19XG5mdW5jdGlvbiBzaChhLGIsYyl7YT1iLmVmZmVjdHM7Yi5lZmZlY3RzPW51bGw7aWYobnVsbCE9PWEpZm9yKGI9MDtiPGEubGVuZ3RoO2IrKyl7dmFyIGQ9YVtiXSxlPWQuY2FsbGJhY2s7aWYobnVsbCE9PWUpe2QuY2FsbGJhY2s9bnVsbDtkPWM7aWYoXCJmdW5jdGlvblwiIT09dHlwZW9mIGUpdGhyb3cgRXJyb3IocCgxOTEsZSkpO2UuY2FsbChkKX19fXZhciB0aD17fSx1aD1VZih0aCksdmg9VWYodGgpLHdoPVVmKHRoKTtmdW5jdGlvbiB4aChhKXtpZihhPT09dGgpdGhyb3cgRXJyb3IocCgxNzQpKTtyZXR1cm4gYX1cbmZ1bmN0aW9uIHloKGEsYil7Ryh3aCxiKTtHKHZoLGEpO0codWgsdGgpO2E9Yi5ub2RlVHlwZTtzd2l0Y2goYSl7Y2FzZSA5OmNhc2UgMTE6Yj0oYj1iLmRvY3VtZW50RWxlbWVudCk/Yi5uYW1lc3BhY2VVUkk6bGIobnVsbCxcIlwiKTticmVhaztkZWZhdWx0OmE9OD09PWE/Yi5wYXJlbnROb2RlOmIsYj1hLm5hbWVzcGFjZVVSSXx8bnVsbCxhPWEudGFnTmFtZSxiPWxiKGIsYSl9RSh1aCk7Ryh1aCxiKX1mdW5jdGlvbiB6aCgpe0UodWgpO0UodmgpO0Uod2gpfWZ1bmN0aW9uIEFoKGEpe3hoKHdoLmN1cnJlbnQpO3ZhciBiPXhoKHVoLmN1cnJlbnQpO3ZhciBjPWxiKGIsYS50eXBlKTtiIT09YyYmKEcodmgsYSksRyh1aCxjKSl9ZnVuY3Rpb24gQmgoYSl7dmguY3VycmVudD09PWEmJihFKHVoKSxFKHZoKSl9dmFyIEw9VWYoMCk7XG5mdW5jdGlvbiBDaChhKXtmb3IodmFyIGI9YTtudWxsIT09Yjspe2lmKDEzPT09Yi50YWcpe3ZhciBjPWIubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09YyYmKGM9Yy5kZWh5ZHJhdGVkLG51bGw9PT1jfHxcIiQ/XCI9PT1jLmRhdGF8fFwiJCFcIj09PWMuZGF0YSkpcmV0dXJuIGJ9ZWxzZSBpZigxOT09PWIudGFnJiZ2b2lkIDAhPT1iLm1lbW9pemVkUHJvcHMucmV2ZWFsT3JkZXIpe2lmKDAhPT0oYi5mbGFncyYxMjgpKXJldHVybiBifWVsc2UgaWYobnVsbCE9PWIuY2hpbGQpe2IuY2hpbGQucmV0dXJuPWI7Yj1iLmNoaWxkO2NvbnRpbnVlfWlmKGI9PT1hKWJyZWFrO2Zvcig7bnVsbD09PWIuc2libGluZzspe2lmKG51bGw9PT1iLnJldHVybnx8Yi5yZXR1cm49PT1hKXJldHVybiBudWxsO2I9Yi5yZXR1cm59Yi5zaWJsaW5nLnJldHVybj1iLnJldHVybjtiPWIuc2libGluZ31yZXR1cm4gbnVsbH12YXIgRGg9W107XG5mdW5jdGlvbiBFaCgpe2Zvcih2YXIgYT0wO2E8RGgubGVuZ3RoO2ErKylEaFthXS5fd29ya0luUHJvZ3Jlc3NWZXJzaW9uUHJpbWFyeT1udWxsO0RoLmxlbmd0aD0wfXZhciBGaD11YS5SZWFjdEN1cnJlbnREaXNwYXRjaGVyLEdoPXVhLlJlYWN0Q3VycmVudEJhdGNoQ29uZmlnLEhoPTAsTT1udWxsLE49bnVsbCxPPW51bGwsSWg9ITEsSmg9ITEsS2g9MCxMaD0wO2Z1bmN0aW9uIFAoKXt0aHJvdyBFcnJvcihwKDMyMSkpO31mdW5jdGlvbiBNaChhLGIpe2lmKG51bGw9PT1iKXJldHVybiExO2Zvcih2YXIgYz0wO2M8Yi5sZW5ndGgmJmM8YS5sZW5ndGg7YysrKWlmKCFIZShhW2NdLGJbY10pKXJldHVybiExO3JldHVybiEwfVxuZnVuY3Rpb24gTmgoYSxiLGMsZCxlLGYpe0hoPWY7TT1iO2IubWVtb2l6ZWRTdGF0ZT1udWxsO2IudXBkYXRlUXVldWU9bnVsbDtiLmxhbmVzPTA7RmguY3VycmVudD1udWxsPT09YXx8bnVsbD09PWEubWVtb2l6ZWRTdGF0ZT9PaDpQaDthPWMoZCxlKTtpZihKaCl7Zj0wO2Rve0poPSExO0toPTA7aWYoMjU8PWYpdGhyb3cgRXJyb3IocCgzMDEpKTtmKz0xO089Tj1udWxsO2IudXBkYXRlUXVldWU9bnVsbDtGaC5jdXJyZW50PVFoO2E9YyhkLGUpfXdoaWxlKEpoKX1GaC5jdXJyZW50PVJoO2I9bnVsbCE9PU4mJm51bGwhPT1OLm5leHQ7SGg9MDtPPU49TT1udWxsO0loPSExO2lmKGIpdGhyb3cgRXJyb3IocCgzMDApKTtyZXR1cm4gYX1mdW5jdGlvbiBTaCgpe3ZhciBhPTAhPT1LaDtLaD0wO3JldHVybiBhfVxuZnVuY3Rpb24gVGgoKXt2YXIgYT17bWVtb2l6ZWRTdGF0ZTpudWxsLGJhc2VTdGF0ZTpudWxsLGJhc2VRdWV1ZTpudWxsLHF1ZXVlOm51bGwsbmV4dDpudWxsfTtudWxsPT09Tz9NLm1lbW9pemVkU3RhdGU9Tz1hOk89Ty5uZXh0PWE7cmV0dXJuIE99ZnVuY3Rpb24gVWgoKXtpZihudWxsPT09Til7dmFyIGE9TS5hbHRlcm5hdGU7YT1udWxsIT09YT9hLm1lbW9pemVkU3RhdGU6bnVsbH1lbHNlIGE9Ti5uZXh0O3ZhciBiPW51bGw9PT1PP00ubWVtb2l6ZWRTdGF0ZTpPLm5leHQ7aWYobnVsbCE9PWIpTz1iLE49YTtlbHNle2lmKG51bGw9PT1hKXRocm93IEVycm9yKHAoMzEwKSk7Tj1hO2E9e21lbW9pemVkU3RhdGU6Ti5tZW1vaXplZFN0YXRlLGJhc2VTdGF0ZTpOLmJhc2VTdGF0ZSxiYXNlUXVldWU6Ti5iYXNlUXVldWUscXVldWU6Ti5xdWV1ZSxuZXh0Om51bGx9O251bGw9PT1PP00ubWVtb2l6ZWRTdGF0ZT1PPWE6Tz1PLm5leHQ9YX1yZXR1cm4gT31cbmZ1bmN0aW9uIFZoKGEsYil7cmV0dXJuXCJmdW5jdGlvblwiPT09dHlwZW9mIGI/YihhKTpifVxuZnVuY3Rpb24gV2goYSl7dmFyIGI9VWgoKSxjPWIucXVldWU7aWYobnVsbD09PWMpdGhyb3cgRXJyb3IocCgzMTEpKTtjLmxhc3RSZW5kZXJlZFJlZHVjZXI9YTt2YXIgZD1OLGU9ZC5iYXNlUXVldWUsZj1jLnBlbmRpbmc7aWYobnVsbCE9PWYpe2lmKG51bGwhPT1lKXt2YXIgZz1lLm5leHQ7ZS5uZXh0PWYubmV4dDtmLm5leHQ9Z31kLmJhc2VRdWV1ZT1lPWY7Yy5wZW5kaW5nPW51bGx9aWYobnVsbCE9PWUpe2Y9ZS5uZXh0O2Q9ZC5iYXNlU3RhdGU7dmFyIGg9Zz1udWxsLGs9bnVsbCxsPWY7ZG97dmFyIG09bC5sYW5lO2lmKChIaCZtKT09PW0pbnVsbCE9PWsmJihrPWsubmV4dD17bGFuZTowLGFjdGlvbjpsLmFjdGlvbixoYXNFYWdlclN0YXRlOmwuaGFzRWFnZXJTdGF0ZSxlYWdlclN0YXRlOmwuZWFnZXJTdGF0ZSxuZXh0Om51bGx9KSxkPWwuaGFzRWFnZXJTdGF0ZT9sLmVhZ2VyU3RhdGU6YShkLGwuYWN0aW9uKTtlbHNle3ZhciBxPXtsYW5lOm0sYWN0aW9uOmwuYWN0aW9uLGhhc0VhZ2VyU3RhdGU6bC5oYXNFYWdlclN0YXRlLFxuZWFnZXJTdGF0ZTpsLmVhZ2VyU3RhdGUsbmV4dDpudWxsfTtudWxsPT09az8oaD1rPXEsZz1kKTprPWsubmV4dD1xO00ubGFuZXN8PW07cmh8PW19bD1sLm5leHR9d2hpbGUobnVsbCE9PWwmJmwhPT1mKTtudWxsPT09az9nPWQ6ay5uZXh0PWg7SGUoZCxiLm1lbW9pemVkU3RhdGUpfHwoZGg9ITApO2IubWVtb2l6ZWRTdGF0ZT1kO2IuYmFzZVN0YXRlPWc7Yi5iYXNlUXVldWU9aztjLmxhc3RSZW5kZXJlZFN0YXRlPWR9YT1jLmludGVybGVhdmVkO2lmKG51bGwhPT1hKXtlPWE7ZG8gZj1lLmxhbmUsTS5sYW5lc3w9ZixyaHw9ZixlPWUubmV4dDt3aGlsZShlIT09YSl9ZWxzZSBudWxsPT09ZSYmKGMubGFuZXM9MCk7cmV0dXJuW2IubWVtb2l6ZWRTdGF0ZSxjLmRpc3BhdGNoXX1cbmZ1bmN0aW9uIFhoKGEpe3ZhciBiPVVoKCksYz1iLnF1ZXVlO2lmKG51bGw9PT1jKXRocm93IEVycm9yKHAoMzExKSk7Yy5sYXN0UmVuZGVyZWRSZWR1Y2VyPWE7dmFyIGQ9Yy5kaXNwYXRjaCxlPWMucGVuZGluZyxmPWIubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09ZSl7Yy5wZW5kaW5nPW51bGw7dmFyIGc9ZT1lLm5leHQ7ZG8gZj1hKGYsZy5hY3Rpb24pLGc9Zy5uZXh0O3doaWxlKGchPT1lKTtIZShmLGIubWVtb2l6ZWRTdGF0ZSl8fChkaD0hMCk7Yi5tZW1vaXplZFN0YXRlPWY7bnVsbD09PWIuYmFzZVF1ZXVlJiYoYi5iYXNlU3RhdGU9Zik7Yy5sYXN0UmVuZGVyZWRTdGF0ZT1mfXJldHVybltmLGRdfWZ1bmN0aW9uIFloKCl7fVxuZnVuY3Rpb24gWmgoYSxiKXt2YXIgYz1NLGQ9VWgoKSxlPWIoKSxmPSFIZShkLm1lbW9pemVkU3RhdGUsZSk7ZiYmKGQubWVtb2l6ZWRTdGF0ZT1lLGRoPSEwKTtkPWQucXVldWU7JGgoYWkuYmluZChudWxsLGMsZCxhKSxbYV0pO2lmKGQuZ2V0U25hcHNob3QhPT1ifHxmfHxudWxsIT09TyYmTy5tZW1vaXplZFN0YXRlLnRhZyYxKXtjLmZsYWdzfD0yMDQ4O2JpKDksY2kuYmluZChudWxsLGMsZCxlLGIpLHZvaWQgMCxudWxsKTtpZihudWxsPT09USl0aHJvdyBFcnJvcihwKDM0OSkpOzAhPT0oSGgmMzApfHxkaShjLGIsZSl9cmV0dXJuIGV9ZnVuY3Rpb24gZGkoYSxiLGMpe2EuZmxhZ3N8PTE2Mzg0O2E9e2dldFNuYXBzaG90OmIsdmFsdWU6Y307Yj1NLnVwZGF0ZVF1ZXVlO251bGw9PT1iPyhiPXtsYXN0RWZmZWN0Om51bGwsc3RvcmVzOm51bGx9LE0udXBkYXRlUXVldWU9YixiLnN0b3Jlcz1bYV0pOihjPWIuc3RvcmVzLG51bGw9PT1jP2Iuc3RvcmVzPVthXTpjLnB1c2goYSkpfVxuZnVuY3Rpb24gY2koYSxiLGMsZCl7Yi52YWx1ZT1jO2IuZ2V0U25hcHNob3Q9ZDtlaShiKSYmZmkoYSl9ZnVuY3Rpb24gYWkoYSxiLGMpe3JldHVybiBjKGZ1bmN0aW9uKCl7ZWkoYikmJmZpKGEpfSl9ZnVuY3Rpb24gZWkoYSl7dmFyIGI9YS5nZXRTbmFwc2hvdDthPWEudmFsdWU7dHJ5e3ZhciBjPWIoKTtyZXR1cm4hSGUoYSxjKX1jYXRjaChkKXtyZXR1cm4hMH19ZnVuY3Rpb24gZmkoYSl7dmFyIGI9aWgoYSwxKTtudWxsIT09YiYmZ2koYixhLDEsLTEpfVxuZnVuY3Rpb24gaGkoYSl7dmFyIGI9VGgoKTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgYSYmKGE9YSgpKTtiLm1lbW9pemVkU3RhdGU9Yi5iYXNlU3RhdGU9YTthPXtwZW5kaW5nOm51bGwsaW50ZXJsZWF2ZWQ6bnVsbCxsYW5lczowLGRpc3BhdGNoOm51bGwsbGFzdFJlbmRlcmVkUmVkdWNlcjpWaCxsYXN0UmVuZGVyZWRTdGF0ZTphfTtiLnF1ZXVlPWE7YT1hLmRpc3BhdGNoPWlpLmJpbmQobnVsbCxNLGEpO3JldHVybltiLm1lbW9pemVkU3RhdGUsYV19XG5mdW5jdGlvbiBiaShhLGIsYyxkKXthPXt0YWc6YSxjcmVhdGU6YixkZXN0cm95OmMsZGVwczpkLG5leHQ6bnVsbH07Yj1NLnVwZGF0ZVF1ZXVlO251bGw9PT1iPyhiPXtsYXN0RWZmZWN0Om51bGwsc3RvcmVzOm51bGx9LE0udXBkYXRlUXVldWU9YixiLmxhc3RFZmZlY3Q9YS5uZXh0PWEpOihjPWIubGFzdEVmZmVjdCxudWxsPT09Yz9iLmxhc3RFZmZlY3Q9YS5uZXh0PWE6KGQ9Yy5uZXh0LGMubmV4dD1hLGEubmV4dD1kLGIubGFzdEVmZmVjdD1hKSk7cmV0dXJuIGF9ZnVuY3Rpb24gamkoKXtyZXR1cm4gVWgoKS5tZW1vaXplZFN0YXRlfWZ1bmN0aW9uIGtpKGEsYixjLGQpe3ZhciBlPVRoKCk7TS5mbGFnc3w9YTtlLm1lbW9pemVkU3RhdGU9YmkoMXxiLGMsdm9pZCAwLHZvaWQgMD09PWQ/bnVsbDpkKX1cbmZ1bmN0aW9uIGxpKGEsYixjLGQpe3ZhciBlPVVoKCk7ZD12b2lkIDA9PT1kP251bGw6ZDt2YXIgZj12b2lkIDA7aWYobnVsbCE9PU4pe3ZhciBnPU4ubWVtb2l6ZWRTdGF0ZTtmPWcuZGVzdHJveTtpZihudWxsIT09ZCYmTWgoZCxnLmRlcHMpKXtlLm1lbW9pemVkU3RhdGU9YmkoYixjLGYsZCk7cmV0dXJufX1NLmZsYWdzfD1hO2UubWVtb2l6ZWRTdGF0ZT1iaSgxfGIsYyxmLGQpfWZ1bmN0aW9uIG1pKGEsYil7cmV0dXJuIGtpKDgzOTA2NTYsOCxhLGIpfWZ1bmN0aW9uICRoKGEsYil7cmV0dXJuIGxpKDIwNDgsOCxhLGIpfWZ1bmN0aW9uIG5pKGEsYil7cmV0dXJuIGxpKDQsMixhLGIpfWZ1bmN0aW9uIG9pKGEsYil7cmV0dXJuIGxpKDQsNCxhLGIpfVxuZnVuY3Rpb24gcGkoYSxiKXtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilyZXR1cm4gYT1hKCksYihhKSxmdW5jdGlvbigpe2IobnVsbCl9O2lmKG51bGwhPT1iJiZ2b2lkIDAhPT1iKXJldHVybiBhPWEoKSxiLmN1cnJlbnQ9YSxmdW5jdGlvbigpe2IuY3VycmVudD1udWxsfX1mdW5jdGlvbiBxaShhLGIsYyl7Yz1udWxsIT09YyYmdm9pZCAwIT09Yz9jLmNvbmNhdChbYV0pOm51bGw7cmV0dXJuIGxpKDQsNCxwaS5iaW5kKG51bGwsYixhKSxjKX1mdW5jdGlvbiByaSgpe31mdW5jdGlvbiBzaShhLGIpe3ZhciBjPVVoKCk7Yj12b2lkIDA9PT1iP251bGw6Yjt2YXIgZD1jLm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PWQmJm51bGwhPT1iJiZNaChiLGRbMV0pKXJldHVybiBkWzBdO2MubWVtb2l6ZWRTdGF0ZT1bYSxiXTtyZXR1cm4gYX1cbmZ1bmN0aW9uIHRpKGEsYil7dmFyIGM9VWgoKTtiPXZvaWQgMD09PWI/bnVsbDpiO3ZhciBkPWMubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09ZCYmbnVsbCE9PWImJk1oKGIsZFsxXSkpcmV0dXJuIGRbMF07YT1hKCk7Yy5tZW1vaXplZFN0YXRlPVthLGJdO3JldHVybiBhfWZ1bmN0aW9uIHVpKGEsYixjKXtpZigwPT09KEhoJjIxKSlyZXR1cm4gYS5iYXNlU3RhdGUmJihhLmJhc2VTdGF0ZT0hMSxkaD0hMCksYS5tZW1vaXplZFN0YXRlPWM7SGUoYyxiKXx8KGM9eWMoKSxNLmxhbmVzfD1jLHJofD1jLGEuYmFzZVN0YXRlPSEwKTtyZXR1cm4gYn1mdW5jdGlvbiB2aShhLGIpe3ZhciBjPUM7Qz0wIT09YyYmND5jP2M6NDthKCEwKTt2YXIgZD1HaC50cmFuc2l0aW9uO0doLnRyYW5zaXRpb249e307dHJ5e2EoITEpLGIoKX1maW5hbGx5e0M9YyxHaC50cmFuc2l0aW9uPWR9fWZ1bmN0aW9uIHdpKCl7cmV0dXJuIFVoKCkubWVtb2l6ZWRTdGF0ZX1cbmZ1bmN0aW9uIHhpKGEsYixjKXt2YXIgZD15aShhKTtjPXtsYW5lOmQsYWN0aW9uOmMsaGFzRWFnZXJTdGF0ZTohMSxlYWdlclN0YXRlOm51bGwsbmV4dDpudWxsfTtpZih6aShhKSlBaShiLGMpO2Vsc2UgaWYoYz1oaChhLGIsYyxkKSxudWxsIT09Yyl7dmFyIGU9UigpO2dpKGMsYSxkLGUpO0JpKGMsYixkKX19XG5mdW5jdGlvbiBpaShhLGIsYyl7dmFyIGQ9eWkoYSksZT17bGFuZTpkLGFjdGlvbjpjLGhhc0VhZ2VyU3RhdGU6ITEsZWFnZXJTdGF0ZTpudWxsLG5leHQ6bnVsbH07aWYoemkoYSkpQWkoYixlKTtlbHNle3ZhciBmPWEuYWx0ZXJuYXRlO2lmKDA9PT1hLmxhbmVzJiYobnVsbD09PWZ8fDA9PT1mLmxhbmVzKSYmKGY9Yi5sYXN0UmVuZGVyZWRSZWR1Y2VyLG51bGwhPT1mKSl0cnl7dmFyIGc9Yi5sYXN0UmVuZGVyZWRTdGF0ZSxoPWYoZyxjKTtlLmhhc0VhZ2VyU3RhdGU9ITA7ZS5lYWdlclN0YXRlPWg7aWYoSGUoaCxnKSl7dmFyIGs9Yi5pbnRlcmxlYXZlZDtudWxsPT09az8oZS5uZXh0PWUsZ2goYikpOihlLm5leHQ9ay5uZXh0LGsubmV4dD1lKTtiLmludGVybGVhdmVkPWU7cmV0dXJufX1jYXRjaChsKXt9ZmluYWxseXt9Yz1oaChhLGIsZSxkKTtudWxsIT09YyYmKGU9UigpLGdpKGMsYSxkLGUpLEJpKGMsYixkKSl9fVxuZnVuY3Rpb24gemkoYSl7dmFyIGI9YS5hbHRlcm5hdGU7cmV0dXJuIGE9PT1NfHxudWxsIT09YiYmYj09PU19ZnVuY3Rpb24gQWkoYSxiKXtKaD1JaD0hMDt2YXIgYz1hLnBlbmRpbmc7bnVsbD09PWM/Yi5uZXh0PWI6KGIubmV4dD1jLm5leHQsYy5uZXh0PWIpO2EucGVuZGluZz1ifWZ1bmN0aW9uIEJpKGEsYixjKXtpZigwIT09KGMmNDE5NDI0MCkpe3ZhciBkPWIubGFuZXM7ZCY9YS5wZW5kaW5nTGFuZXM7Y3w9ZDtiLmxhbmVzPWM7Q2MoYSxjKX19XG52YXIgUmg9e3JlYWRDb250ZXh0OmVoLHVzZUNhbGxiYWNrOlAsdXNlQ29udGV4dDpQLHVzZUVmZmVjdDpQLHVzZUltcGVyYXRpdmVIYW5kbGU6UCx1c2VJbnNlcnRpb25FZmZlY3Q6UCx1c2VMYXlvdXRFZmZlY3Q6UCx1c2VNZW1vOlAsdXNlUmVkdWNlcjpQLHVzZVJlZjpQLHVzZVN0YXRlOlAsdXNlRGVidWdWYWx1ZTpQLHVzZURlZmVycmVkVmFsdWU6UCx1c2VUcmFuc2l0aW9uOlAsdXNlTXV0YWJsZVNvdXJjZTpQLHVzZVN5bmNFeHRlcm5hbFN0b3JlOlAsdXNlSWQ6UCx1bnN0YWJsZV9pc05ld1JlY29uY2lsZXI6ITF9LE9oPXtyZWFkQ29udGV4dDplaCx1c2VDYWxsYmFjazpmdW5jdGlvbihhLGIpe1RoKCkubWVtb2l6ZWRTdGF0ZT1bYSx2b2lkIDA9PT1iP251bGw6Yl07cmV0dXJuIGF9LHVzZUNvbnRleHQ6ZWgsdXNlRWZmZWN0Om1pLHVzZUltcGVyYXRpdmVIYW5kbGU6ZnVuY3Rpb24oYSxiLGMpe2M9bnVsbCE9PWMmJnZvaWQgMCE9PWM/Yy5jb25jYXQoW2FdKTpudWxsO3JldHVybiBraSg0MTk0MzA4LFxuNCxwaS5iaW5kKG51bGwsYixhKSxjKX0sdXNlTGF5b3V0RWZmZWN0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIGtpKDQxOTQzMDgsNCxhLGIpfSx1c2VJbnNlcnRpb25FZmZlY3Q6ZnVuY3Rpb24oYSxiKXtyZXR1cm4ga2koNCwyLGEsYil9LHVzZU1lbW86ZnVuY3Rpb24oYSxiKXt2YXIgYz1UaCgpO2I9dm9pZCAwPT09Yj9udWxsOmI7YT1hKCk7Yy5tZW1vaXplZFN0YXRlPVthLGJdO3JldHVybiBhfSx1c2VSZWR1Y2VyOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1UaCgpO2I9dm9pZCAwIT09Yz9jKGIpOmI7ZC5tZW1vaXplZFN0YXRlPWQuYmFzZVN0YXRlPWI7YT17cGVuZGluZzpudWxsLGludGVybGVhdmVkOm51bGwsbGFuZXM6MCxkaXNwYXRjaDpudWxsLGxhc3RSZW5kZXJlZFJlZHVjZXI6YSxsYXN0UmVuZGVyZWRTdGF0ZTpifTtkLnF1ZXVlPWE7YT1hLmRpc3BhdGNoPXhpLmJpbmQobnVsbCxNLGEpO3JldHVybltkLm1lbW9pemVkU3RhdGUsYV19LHVzZVJlZjpmdW5jdGlvbihhKXt2YXIgYj1cblRoKCk7YT17Y3VycmVudDphfTtyZXR1cm4gYi5tZW1vaXplZFN0YXRlPWF9LHVzZVN0YXRlOmhpLHVzZURlYnVnVmFsdWU6cmksdXNlRGVmZXJyZWRWYWx1ZTpmdW5jdGlvbihhKXtyZXR1cm4gVGgoKS5tZW1vaXplZFN0YXRlPWF9LHVzZVRyYW5zaXRpb246ZnVuY3Rpb24oKXt2YXIgYT1oaSghMSksYj1hWzBdO2E9dmkuYmluZChudWxsLGFbMV0pO1RoKCkubWVtb2l6ZWRTdGF0ZT1hO3JldHVybltiLGFdfSx1c2VNdXRhYmxlU291cmNlOmZ1bmN0aW9uKCl7fSx1c2VTeW5jRXh0ZXJuYWxTdG9yZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9TSxlPVRoKCk7aWYoSSl7aWYodm9pZCAwPT09Yyl0aHJvdyBFcnJvcihwKDQwNykpO2M9YygpfWVsc2V7Yz1iKCk7aWYobnVsbD09PVEpdGhyb3cgRXJyb3IocCgzNDkpKTswIT09KEhoJjMwKXx8ZGkoZCxiLGMpfWUubWVtb2l6ZWRTdGF0ZT1jO3ZhciBmPXt2YWx1ZTpjLGdldFNuYXBzaG90OmJ9O2UucXVldWU9ZjttaShhaS5iaW5kKG51bGwsZCxcbmYsYSksW2FdKTtkLmZsYWdzfD0yMDQ4O2JpKDksY2kuYmluZChudWxsLGQsZixjLGIpLHZvaWQgMCxudWxsKTtyZXR1cm4gY30sdXNlSWQ6ZnVuY3Rpb24oKXt2YXIgYT1UaCgpLGI9US5pZGVudGlmaWVyUHJlZml4O2lmKEkpe3ZhciBjPXNnO3ZhciBkPXJnO2M9KGQmfigxPDwzMi1vYyhkKS0xKSkudG9TdHJpbmcoMzIpK2M7Yj1cIjpcIitiK1wiUlwiK2M7Yz1LaCsrOzA8YyYmKGIrPVwiSFwiK2MudG9TdHJpbmcoMzIpKTtiKz1cIjpcIn1lbHNlIGM9TGgrKyxiPVwiOlwiK2IrXCJyXCIrYy50b1N0cmluZygzMikrXCI6XCI7cmV0dXJuIGEubWVtb2l6ZWRTdGF0ZT1ifSx1bnN0YWJsZV9pc05ld1JlY29uY2lsZXI6ITF9LFBoPXtyZWFkQ29udGV4dDplaCx1c2VDYWxsYmFjazpzaSx1c2VDb250ZXh0OmVoLHVzZUVmZmVjdDokaCx1c2VJbXBlcmF0aXZlSGFuZGxlOnFpLHVzZUluc2VydGlvbkVmZmVjdDpuaSx1c2VMYXlvdXRFZmZlY3Q6b2ksdXNlTWVtbzp0aSx1c2VSZWR1Y2VyOldoLHVzZVJlZjpqaSx1c2VTdGF0ZTpmdW5jdGlvbigpe3JldHVybiBXaChWaCl9LFxudXNlRGVidWdWYWx1ZTpyaSx1c2VEZWZlcnJlZFZhbHVlOmZ1bmN0aW9uKGEpe3ZhciBiPVVoKCk7cmV0dXJuIHVpKGIsTi5tZW1vaXplZFN0YXRlLGEpfSx1c2VUcmFuc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9V2goVmgpWzBdLGI9VWgoKS5tZW1vaXplZFN0YXRlO3JldHVyblthLGJdfSx1c2VNdXRhYmxlU291cmNlOlloLHVzZVN5bmNFeHRlcm5hbFN0b3JlOlpoLHVzZUlkOndpLHVuc3RhYmxlX2lzTmV3UmVjb25jaWxlcjohMX0sUWg9e3JlYWRDb250ZXh0OmVoLHVzZUNhbGxiYWNrOnNpLHVzZUNvbnRleHQ6ZWgsdXNlRWZmZWN0OiRoLHVzZUltcGVyYXRpdmVIYW5kbGU6cWksdXNlSW5zZXJ0aW9uRWZmZWN0Om5pLHVzZUxheW91dEVmZmVjdDpvaSx1c2VNZW1vOnRpLHVzZVJlZHVjZXI6WGgsdXNlUmVmOmppLHVzZVN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuIFhoKFZoKX0sdXNlRGVidWdWYWx1ZTpyaSx1c2VEZWZlcnJlZFZhbHVlOmZ1bmN0aW9uKGEpe3ZhciBiPVVoKCk7cmV0dXJuIG51bGw9PT1cbk4/Yi5tZW1vaXplZFN0YXRlPWE6dWkoYixOLm1lbW9pemVkU3RhdGUsYSl9LHVzZVRyYW5zaXRpb246ZnVuY3Rpb24oKXt2YXIgYT1YaChWaClbMF0sYj1VaCgpLm1lbW9pemVkU3RhdGU7cmV0dXJuW2EsYl19LHVzZU11dGFibGVTb3VyY2U6WWgsdXNlU3luY0V4dGVybmFsU3RvcmU6WmgsdXNlSWQ6d2ksdW5zdGFibGVfaXNOZXdSZWNvbmNpbGVyOiExfTtmdW5jdGlvbiBDaShhLGIpe2lmKGEmJmEuZGVmYXVsdFByb3BzKXtiPUEoe30sYik7YT1hLmRlZmF1bHRQcm9wcztmb3IodmFyIGMgaW4gYSl2b2lkIDA9PT1iW2NdJiYoYltjXT1hW2NdKTtyZXR1cm4gYn1yZXR1cm4gYn1mdW5jdGlvbiBEaShhLGIsYyxkKXtiPWEubWVtb2l6ZWRTdGF0ZTtjPWMoZCxiKTtjPW51bGw9PT1jfHx2b2lkIDA9PT1jP2I6QSh7fSxiLGMpO2EubWVtb2l6ZWRTdGF0ZT1jOzA9PT1hLmxhbmVzJiYoYS51cGRhdGVRdWV1ZS5iYXNlU3RhdGU9Yyl9XG52YXIgRWk9e2lzTW91bnRlZDpmdW5jdGlvbihhKXtyZXR1cm4oYT1hLl9yZWFjdEludGVybmFscyk/VmIoYSk9PT1hOiExfSxlbnF1ZXVlU2V0U3RhdGU6ZnVuY3Rpb24oYSxiLGMpe2E9YS5fcmVhY3RJbnRlcm5hbHM7dmFyIGQ9UigpLGU9eWkoYSksZj1taChkLGUpO2YucGF5bG9hZD1iO3ZvaWQgMCE9PWMmJm51bGwhPT1jJiYoZi5jYWxsYmFjaz1jKTtiPW5oKGEsZixlKTtudWxsIT09YiYmKGdpKGIsYSxlLGQpLG9oKGIsYSxlKSl9LGVucXVldWVSZXBsYWNlU3RhdGU6ZnVuY3Rpb24oYSxiLGMpe2E9YS5fcmVhY3RJbnRlcm5hbHM7dmFyIGQ9UigpLGU9eWkoYSksZj1taChkLGUpO2YudGFnPTE7Zi5wYXlsb2FkPWI7dm9pZCAwIT09YyYmbnVsbCE9PWMmJihmLmNhbGxiYWNrPWMpO2I9bmgoYSxmLGUpO251bGwhPT1iJiYoZ2koYixhLGUsZCksb2goYixhLGUpKX0sZW5xdWV1ZUZvcmNlVXBkYXRlOmZ1bmN0aW9uKGEsYil7YT1hLl9yZWFjdEludGVybmFsczt2YXIgYz1SKCksZD1cbnlpKGEpLGU9bWgoYyxkKTtlLnRhZz0yO3ZvaWQgMCE9PWImJm51bGwhPT1iJiYoZS5jYWxsYmFjaz1iKTtiPW5oKGEsZSxkKTtudWxsIT09YiYmKGdpKGIsYSxkLGMpLG9oKGIsYSxkKSl9fTtmdW5jdGlvbiBGaShhLGIsYyxkLGUsZixnKXthPWEuc3RhdGVOb2RlO3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLnNob3VsZENvbXBvbmVudFVwZGF0ZT9hLnNob3VsZENvbXBvbmVudFVwZGF0ZShkLGYsZyk6Yi5wcm90b3R5cGUmJmIucHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50PyFJZShjLGQpfHwhSWUoZSxmKTohMH1cbmZ1bmN0aW9uIEdpKGEsYixjKXt2YXIgZD0hMSxlPVZmO3ZhciBmPWIuY29udGV4dFR5cGU7XCJvYmplY3RcIj09PXR5cGVvZiBmJiZudWxsIT09Zj9mPWVoKGYpOihlPVpmKGIpP1hmOkguY3VycmVudCxkPWIuY29udGV4dFR5cGVzLGY9KGQ9bnVsbCE9PWQmJnZvaWQgMCE9PWQpP1lmKGEsZSk6VmYpO2I9bmV3IGIoYyxmKTthLm1lbW9pemVkU3RhdGU9bnVsbCE9PWIuc3RhdGUmJnZvaWQgMCE9PWIuc3RhdGU/Yi5zdGF0ZTpudWxsO2IudXBkYXRlcj1FaTthLnN0YXRlTm9kZT1iO2IuX3JlYWN0SW50ZXJuYWxzPWE7ZCYmKGE9YS5zdGF0ZU5vZGUsYS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZFVubWFza2VkQ2hpbGRDb250ZXh0PWUsYS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZE1hc2tlZENoaWxkQ29udGV4dD1mKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIEhpKGEsYixjLGQpe2E9Yi5zdGF0ZTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgYi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZiLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoYyxkKTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgYi5VTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmYi5VTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhjLGQpO2Iuc3RhdGUhPT1hJiZFaS5lbnF1ZXVlUmVwbGFjZVN0YXRlKGIsYi5zdGF0ZSxudWxsKX1cbmZ1bmN0aW9uIElpKGEsYixjLGQpe3ZhciBlPWEuc3RhdGVOb2RlO2UucHJvcHM9YztlLnN0YXRlPWEubWVtb2l6ZWRTdGF0ZTtlLnJlZnM9e307a2goYSk7dmFyIGY9Yi5jb250ZXh0VHlwZTtcIm9iamVjdFwiPT09dHlwZW9mIGYmJm51bGwhPT1mP2UuY29udGV4dD1laChmKTooZj1aZihiKT9YZjpILmN1cnJlbnQsZS5jb250ZXh0PVlmKGEsZikpO2Uuc3RhdGU9YS5tZW1vaXplZFN0YXRlO2Y9Yi5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHM7XCJmdW5jdGlvblwiPT09dHlwZW9mIGYmJihEaShhLGIsZixjKSxlLnN0YXRlPWEubWVtb2l6ZWRTdGF0ZSk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGIuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzfHxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZS5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8XCJmdW5jdGlvblwiIT09dHlwZW9mIGUuVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGUuY29tcG9uZW50V2lsbE1vdW50fHwoYj1lLnN0YXRlLFxuXCJmdW5jdGlvblwiPT09dHlwZW9mIGUuY29tcG9uZW50V2lsbE1vdW50JiZlLmNvbXBvbmVudFdpbGxNb3VudCgpLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBlLlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQmJmUuVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCgpLGIhPT1lLnN0YXRlJiZFaS5lbnF1ZXVlUmVwbGFjZVN0YXRlKGUsZS5zdGF0ZSxudWxsKSxxaChhLGMsZSxkKSxlLnN0YXRlPWEubWVtb2l6ZWRTdGF0ZSk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGUuY29tcG9uZW50RGlkTW91bnQmJihhLmZsYWdzfD00MTk0MzA4KX1mdW5jdGlvbiBKaShhLGIpe3RyeXt2YXIgYz1cIlwiLGQ9YjtkbyBjKz1QYShkKSxkPWQucmV0dXJuO3doaWxlKGQpO3ZhciBlPWN9Y2F0Y2goZil7ZT1cIlxcbkVycm9yIGdlbmVyYXRpbmcgc3RhY2s6IFwiK2YubWVzc2FnZStcIlxcblwiK2Yuc3RhY2t9cmV0dXJue3ZhbHVlOmEsc291cmNlOmIsc3RhY2s6ZSxkaWdlc3Q6bnVsbH19XG5mdW5jdGlvbiBLaShhLGIsYyl7cmV0dXJue3ZhbHVlOmEsc291cmNlOm51bGwsc3RhY2s6bnVsbCE9Yz9jOm51bGwsZGlnZXN0Om51bGwhPWI/YjpudWxsfX1mdW5jdGlvbiBMaShhLGIpe3RyeXtjb25zb2xlLmVycm9yKGIudmFsdWUpfWNhdGNoKGMpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0aHJvdyBjO30pfX12YXIgTWk9XCJmdW5jdGlvblwiPT09dHlwZW9mIFdlYWtNYXA/V2Vha01hcDpNYXA7ZnVuY3Rpb24gTmkoYSxiLGMpe2M9bWgoLTEsYyk7Yy50YWc9MztjLnBheWxvYWQ9e2VsZW1lbnQ6bnVsbH07dmFyIGQ9Yi52YWx1ZTtjLmNhbGxiYWNrPWZ1bmN0aW9uKCl7T2l8fChPaT0hMCxQaT1kKTtMaShhLGIpfTtyZXR1cm4gY31cbmZ1bmN0aW9uIFFpKGEsYixjKXtjPW1oKC0xLGMpO2MudGFnPTM7dmFyIGQ9YS50eXBlLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcjtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZCl7dmFyIGU9Yi52YWx1ZTtjLnBheWxvYWQ9ZnVuY3Rpb24oKXtyZXR1cm4gZChlKX07Yy5jYWxsYmFjaz1mdW5jdGlvbigpe0xpKGEsYil9fXZhciBmPWEuc3RhdGVOb2RlO251bGwhPT1mJiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgZi5jb21wb25lbnREaWRDYXRjaCYmKGMuY2FsbGJhY2s9ZnVuY3Rpb24oKXtMaShhLGIpO1wiZnVuY3Rpb25cIiE9PXR5cGVvZiBkJiYobnVsbD09PVJpP1JpPW5ldyBTZXQoW3RoaXNdKTpSaS5hZGQodGhpcykpO3ZhciBjPWIuc3RhY2s7dGhpcy5jb21wb25lbnREaWRDYXRjaChiLnZhbHVlLHtjb21wb25lbnRTdGFjazpudWxsIT09Yz9jOlwiXCJ9KX0pO3JldHVybiBjfVxuZnVuY3Rpb24gU2koYSxiLGMpe3ZhciBkPWEucGluZ0NhY2hlO2lmKG51bGw9PT1kKXtkPWEucGluZ0NhY2hlPW5ldyBNaTt2YXIgZT1uZXcgU2V0O2Quc2V0KGIsZSl9ZWxzZSBlPWQuZ2V0KGIpLHZvaWQgMD09PWUmJihlPW5ldyBTZXQsZC5zZXQoYixlKSk7ZS5oYXMoYyl8fChlLmFkZChjKSxhPVRpLmJpbmQobnVsbCxhLGIsYyksYi50aGVuKGEsYSkpfWZ1bmN0aW9uIFVpKGEpe2Rve3ZhciBiO2lmKGI9MTM9PT1hLnRhZyliPWEubWVtb2l6ZWRTdGF0ZSxiPW51bGwhPT1iP251bGwhPT1iLmRlaHlkcmF0ZWQ/ITA6ITE6ITA7aWYoYilyZXR1cm4gYTthPWEucmV0dXJufXdoaWxlKG51bGwhPT1hKTtyZXR1cm4gbnVsbH1cbmZ1bmN0aW9uIFZpKGEsYixjLGQsZSl7aWYoMD09PShhLm1vZGUmMSkpcmV0dXJuIGE9PT1iP2EuZmxhZ3N8PTY1NTM2OihhLmZsYWdzfD0xMjgsYy5mbGFnc3w9MTMxMDcyLGMuZmxhZ3MmPS01MjgwNSwxPT09Yy50YWcmJihudWxsPT09Yy5hbHRlcm5hdGU/Yy50YWc9MTc6KGI9bWgoLTEsMSksYi50YWc9MixuaChjLGIsMSkpKSxjLmxhbmVzfD0xKSxhO2EuZmxhZ3N8PTY1NTM2O2EubGFuZXM9ZTtyZXR1cm4gYX12YXIgV2k9dWEuUmVhY3RDdXJyZW50T3duZXIsZGg9ITE7ZnVuY3Rpb24gWGkoYSxiLGMsZCl7Yi5jaGlsZD1udWxsPT09YT9WZyhiLG51bGwsYyxkKTpVZyhiLGEuY2hpbGQsYyxkKX1cbmZ1bmN0aW9uIFlpKGEsYixjLGQsZSl7Yz1jLnJlbmRlcjt2YXIgZj1iLnJlZjtjaChiLGUpO2Q9TmgoYSxiLGMsZCxmLGUpO2M9U2goKTtpZihudWxsIT09YSYmIWRoKXJldHVybiBiLnVwZGF0ZVF1ZXVlPWEudXBkYXRlUXVldWUsYi5mbGFncyY9LTIwNTMsYS5sYW5lcyY9fmUsWmkoYSxiLGUpO0kmJmMmJnZnKGIpO2IuZmxhZ3N8PTE7WGkoYSxiLGQsZSk7cmV0dXJuIGIuY2hpbGR9XG5mdW5jdGlvbiAkaShhLGIsYyxkLGUpe2lmKG51bGw9PT1hKXt2YXIgZj1jLnR5cGU7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGYmJiFhaihmKSYmdm9pZCAwPT09Zi5kZWZhdWx0UHJvcHMmJm51bGw9PT1jLmNvbXBhcmUmJnZvaWQgMD09PWMuZGVmYXVsdFByb3BzKXJldHVybiBiLnRhZz0xNSxiLnR5cGU9ZixiaihhLGIsZixkLGUpO2E9UmcoYy50eXBlLG51bGwsZCxiLGIubW9kZSxlKTthLnJlZj1iLnJlZjthLnJldHVybj1iO3JldHVybiBiLmNoaWxkPWF9Zj1hLmNoaWxkO2lmKDA9PT0oYS5sYW5lcyZlKSl7dmFyIGc9Zi5tZW1vaXplZFByb3BzO2M9Yy5jb21wYXJlO2M9bnVsbCE9PWM/YzpJZTtpZihjKGcsZCkmJmEucmVmPT09Yi5yZWYpcmV0dXJuIFppKGEsYixlKX1iLmZsYWdzfD0xO2E9UGcoZixkKTthLnJlZj1iLnJlZjthLnJldHVybj1iO3JldHVybiBiLmNoaWxkPWF9XG5mdW5jdGlvbiBiaihhLGIsYyxkLGUpe2lmKG51bGwhPT1hKXt2YXIgZj1hLm1lbW9pemVkUHJvcHM7aWYoSWUoZixkKSYmYS5yZWY9PT1iLnJlZilpZihkaD0hMSxiLnBlbmRpbmdQcm9wcz1kPWYsMCE9PShhLmxhbmVzJmUpKTAhPT0oYS5mbGFncyYxMzEwNzIpJiYoZGg9ITApO2Vsc2UgcmV0dXJuIGIubGFuZXM9YS5sYW5lcyxaaShhLGIsZSl9cmV0dXJuIGNqKGEsYixjLGQsZSl9XG5mdW5jdGlvbiBkaihhLGIsYyl7dmFyIGQ9Yi5wZW5kaW5nUHJvcHMsZT1kLmNoaWxkcmVuLGY9bnVsbCE9PWE/YS5tZW1vaXplZFN0YXRlOm51bGw7aWYoXCJoaWRkZW5cIj09PWQubW9kZSlpZigwPT09KGIubW9kZSYxKSliLm1lbW9pemVkU3RhdGU9e2Jhc2VMYW5lczowLGNhY2hlUG9vbDpudWxsLHRyYW5zaXRpb25zOm51bGx9LEcoZWosZmopLGZqfD1jO2Vsc2V7aWYoMD09PShjJjEwNzM3NDE4MjQpKXJldHVybiBhPW51bGwhPT1mP2YuYmFzZUxhbmVzfGM6YyxiLmxhbmVzPWIuY2hpbGRMYW5lcz0xMDczNzQxODI0LGIubWVtb2l6ZWRTdGF0ZT17YmFzZUxhbmVzOmEsY2FjaGVQb29sOm51bGwsdHJhbnNpdGlvbnM6bnVsbH0sYi51cGRhdGVRdWV1ZT1udWxsLEcoZWosZmopLGZqfD1hLG51bGw7Yi5tZW1vaXplZFN0YXRlPXtiYXNlTGFuZXM6MCxjYWNoZVBvb2w6bnVsbCx0cmFuc2l0aW9uczpudWxsfTtkPW51bGwhPT1mP2YuYmFzZUxhbmVzOmM7Ryhlaixmaik7Zmp8PWR9ZWxzZSBudWxsIT09XG5mPyhkPWYuYmFzZUxhbmVzfGMsYi5tZW1vaXplZFN0YXRlPW51bGwpOmQ9YyxHKGVqLGZqKSxmanw9ZDtYaShhLGIsZSxjKTtyZXR1cm4gYi5jaGlsZH1mdW5jdGlvbiBnaihhLGIpe3ZhciBjPWIucmVmO2lmKG51bGw9PT1hJiZudWxsIT09Y3x8bnVsbCE9PWEmJmEucmVmIT09YyliLmZsYWdzfD01MTIsYi5mbGFnc3w9MjA5NzE1Mn1mdW5jdGlvbiBjaihhLGIsYyxkLGUpe3ZhciBmPVpmKGMpP1hmOkguY3VycmVudDtmPVlmKGIsZik7Y2goYixlKTtjPU5oKGEsYixjLGQsZixlKTtkPVNoKCk7aWYobnVsbCE9PWEmJiFkaClyZXR1cm4gYi51cGRhdGVRdWV1ZT1hLnVwZGF0ZVF1ZXVlLGIuZmxhZ3MmPS0yMDUzLGEubGFuZXMmPX5lLFppKGEsYixlKTtJJiZkJiZ2ZyhiKTtiLmZsYWdzfD0xO1hpKGEsYixjLGUpO3JldHVybiBiLmNoaWxkfVxuZnVuY3Rpb24gaGooYSxiLGMsZCxlKXtpZihaZihjKSl7dmFyIGY9ITA7Y2coYil9ZWxzZSBmPSExO2NoKGIsZSk7aWYobnVsbD09PWIuc3RhdGVOb2RlKWlqKGEsYiksR2koYixjLGQpLElpKGIsYyxkLGUpLGQ9ITA7ZWxzZSBpZihudWxsPT09YSl7dmFyIGc9Yi5zdGF0ZU5vZGUsaD1iLm1lbW9pemVkUHJvcHM7Zy5wcm9wcz1oO3ZhciBrPWcuY29udGV4dCxsPWMuY29udGV4dFR5cGU7XCJvYmplY3RcIj09PXR5cGVvZiBsJiZudWxsIT09bD9sPWVoKGwpOihsPVpmKGMpP1hmOkguY3VycmVudCxsPVlmKGIsbCkpO3ZhciBtPWMuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzLHE9XCJmdW5jdGlvblwiPT09dHlwZW9mIG18fFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmdldFNuYXBzaG90QmVmb3JlVXBkYXRlO3F8fFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLlVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzfHxcbihoIT09ZHx8ayE9PWwpJiZIaShiLGcsZCxsKTtqaD0hMTt2YXIgcj1iLm1lbW9pemVkU3RhdGU7Zy5zdGF0ZT1yO3FoKGIsZCxnLGUpO2s9Yi5tZW1vaXplZFN0YXRlO2ghPT1kfHxyIT09a3x8V2YuY3VycmVudHx8amg/KFwiZnVuY3Rpb25cIj09PXR5cGVvZiBtJiYoRGkoYixjLG0sZCksaz1iLm1lbW9pemVkU3RhdGUpLChoPWpofHxGaShiLGMsaCxkLHIsayxsKSk/KHF8fFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLmNvbXBvbmVudFdpbGxNb3VudHx8KFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmNvbXBvbmVudFdpbGxNb3VudCYmZy5jb21wb25lbnRXaWxsTW91bnQoKSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5VTlNBRkVfY29tcG9uZW50V2lsbE1vdW50JiZnLlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQoKSksXCJmdW5jdGlvblwiPT09dHlwZW9mIGcuY29tcG9uZW50RGlkTW91bnQmJihiLmZsYWdzfD00MTk0MzA4KSk6XG4oXCJmdW5jdGlvblwiPT09dHlwZW9mIGcuY29tcG9uZW50RGlkTW91bnQmJihiLmZsYWdzfD00MTk0MzA4KSxiLm1lbW9pemVkUHJvcHM9ZCxiLm1lbW9pemVkU3RhdGU9ayksZy5wcm9wcz1kLGcuc3RhdGU9ayxnLmNvbnRleHQ9bCxkPWgpOihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5jb21wb25lbnREaWRNb3VudCYmKGIuZmxhZ3N8PTQxOTQzMDgpLGQ9ITEpfWVsc2V7Zz1iLnN0YXRlTm9kZTtsaChhLGIpO2g9Yi5tZW1vaXplZFByb3BzO2w9Yi50eXBlPT09Yi5lbGVtZW50VHlwZT9oOkNpKGIudHlwZSxoKTtnLnByb3BzPWw7cT1iLnBlbmRpbmdQcm9wcztyPWcuY29udGV4dDtrPWMuY29udGV4dFR5cGU7XCJvYmplY3RcIj09PXR5cGVvZiBrJiZudWxsIT09az9rPWVoKGspOihrPVpmKGMpP1hmOkguY3VycmVudCxrPVlmKGIsaykpO3ZhciB5PWMuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzOyhtPVwiZnVuY3Rpb25cIj09PXR5cGVvZiB5fHxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZy5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSl8fFxuXCJmdW5jdGlvblwiIT09dHlwZW9mIGcuVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHN8fChoIT09cXx8ciE9PWspJiZIaShiLGcsZCxrKTtqaD0hMTtyPWIubWVtb2l6ZWRTdGF0ZTtnLnN0YXRlPXI7cWgoYixkLGcsZSk7dmFyIG49Yi5tZW1vaXplZFN0YXRlO2ghPT1xfHxyIT09bnx8V2YuY3VycmVudHx8amg/KFwiZnVuY3Rpb25cIj09PXR5cGVvZiB5JiYoRGkoYixjLHksZCksbj1iLm1lbW9pemVkU3RhdGUpLChsPWpofHxGaShiLGMsbCxkLHIsbixrKXx8ITEpPyhtfHxcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5VTlNBRkVfY29tcG9uZW50V2lsbFVwZGF0ZSYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGcuY29tcG9uZW50V2lsbFVwZGF0ZXx8KFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmNvbXBvbmVudFdpbGxVcGRhdGUmJmcuY29tcG9uZW50V2lsbFVwZGF0ZShkLG4sayksXCJmdW5jdGlvblwiPT09dHlwZW9mIGcuVU5TQUZFX2NvbXBvbmVudFdpbGxVcGRhdGUmJlxuZy5VTlNBRkVfY29tcG9uZW50V2lsbFVwZGF0ZShkLG4saykpLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmNvbXBvbmVudERpZFVwZGF0ZSYmKGIuZmxhZ3N8PTQpLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBnLmdldFNuYXBzaG90QmVmb3JlVXBkYXRlJiYoYi5mbGFnc3w9MTAyNCkpOihcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5jb21wb25lbnREaWRVcGRhdGV8fGg9PT1hLm1lbW9pemVkUHJvcHMmJnI9PT1hLm1lbW9pemVkU3RhdGV8fChiLmZsYWdzfD00KSxcImZ1bmN0aW9uXCIhPT10eXBlb2YgZy5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8aD09PWEubWVtb2l6ZWRQcm9wcyYmcj09PWEubWVtb2l6ZWRTdGF0ZXx8KGIuZmxhZ3N8PTEwMjQpLGIubWVtb2l6ZWRQcm9wcz1kLGIubWVtb2l6ZWRTdGF0ZT1uKSxnLnByb3BzPWQsZy5zdGF0ZT1uLGcuY29udGV4dD1rLGQ9bCk6KFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBnLmNvbXBvbmVudERpZFVwZGF0ZXx8aD09PWEubWVtb2l6ZWRQcm9wcyYmcj09PVxuYS5tZW1vaXplZFN0YXRlfHwoYi5mbGFnc3w9NCksXCJmdW5jdGlvblwiIT09dHlwZW9mIGcuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fGg9PT1hLm1lbW9pemVkUHJvcHMmJnI9PT1hLm1lbW9pemVkU3RhdGV8fChiLmZsYWdzfD0xMDI0KSxkPSExKX1yZXR1cm4gamooYSxiLGMsZCxmLGUpfVxuZnVuY3Rpb24gamooYSxiLGMsZCxlLGYpe2dqKGEsYik7dmFyIGc9MCE9PShiLmZsYWdzJjEyOCk7aWYoIWQmJiFnKXJldHVybiBlJiZkZyhiLGMsITEpLFppKGEsYixmKTtkPWIuc3RhdGVOb2RlO1dpLmN1cnJlbnQ9Yjt2YXIgaD1nJiZcImZ1bmN0aW9uXCIhPT10eXBlb2YgYy5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3I/bnVsbDpkLnJlbmRlcigpO2IuZmxhZ3N8PTE7bnVsbCE9PWEmJmc/KGIuY2hpbGQ9VWcoYixhLmNoaWxkLG51bGwsZiksYi5jaGlsZD1VZyhiLG51bGwsaCxmKSk6WGkoYSxiLGgsZik7Yi5tZW1vaXplZFN0YXRlPWQuc3RhdGU7ZSYmZGcoYixjLCEwKTtyZXR1cm4gYi5jaGlsZH1mdW5jdGlvbiBraihhKXt2YXIgYj1hLnN0YXRlTm9kZTtiLnBlbmRpbmdDb250ZXh0P2FnKGEsYi5wZW5kaW5nQ29udGV4dCxiLnBlbmRpbmdDb250ZXh0IT09Yi5jb250ZXh0KTpiLmNvbnRleHQmJmFnKGEsYi5jb250ZXh0LCExKTt5aChhLGIuY29udGFpbmVySW5mbyl9XG5mdW5jdGlvbiBsaihhLGIsYyxkLGUpe0lnKCk7SmcoZSk7Yi5mbGFnc3w9MjU2O1hpKGEsYixjLGQpO3JldHVybiBiLmNoaWxkfXZhciBtaj17ZGVoeWRyYXRlZDpudWxsLHRyZWVDb250ZXh0Om51bGwscmV0cnlMYW5lOjB9O2Z1bmN0aW9uIG5qKGEpe3JldHVybntiYXNlTGFuZXM6YSxjYWNoZVBvb2w6bnVsbCx0cmFuc2l0aW9uczpudWxsfX1cbmZ1bmN0aW9uIG9qKGEsYixjKXt2YXIgZD1iLnBlbmRpbmdQcm9wcyxlPUwuY3VycmVudCxmPSExLGc9MCE9PShiLmZsYWdzJjEyOCksaDsoaD1nKXx8KGg9bnVsbCE9PWEmJm51bGw9PT1hLm1lbW9pemVkU3RhdGU/ITE6MCE9PShlJjIpKTtpZihoKWY9ITAsYi5mbGFncyY9LTEyOTtlbHNlIGlmKG51bGw9PT1hfHxudWxsIT09YS5tZW1vaXplZFN0YXRlKWV8PTE7RyhMLGUmMSk7aWYobnVsbD09PWEpe0VnKGIpO2E9Yi5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1hJiYoYT1hLmRlaHlkcmF0ZWQsbnVsbCE9PWEpKXJldHVybiAwPT09KGIubW9kZSYxKT9iLmxhbmVzPTE6XCIkIVwiPT09YS5kYXRhP2IubGFuZXM9ODpiLmxhbmVzPTEwNzM3NDE4MjQsbnVsbDtnPWQuY2hpbGRyZW47YT1kLmZhbGxiYWNrO3JldHVybiBmPyhkPWIubW9kZSxmPWIuY2hpbGQsZz17bW9kZTpcImhpZGRlblwiLGNoaWxkcmVuOmd9LDA9PT0oZCYxKSYmbnVsbCE9PWY/KGYuY2hpbGRMYW5lcz0wLGYucGVuZGluZ1Byb3BzPVxuZyk6Zj1waihnLGQsMCxudWxsKSxhPVRnKGEsZCxjLG51bGwpLGYucmV0dXJuPWIsYS5yZXR1cm49YixmLnNpYmxpbmc9YSxiLmNoaWxkPWYsYi5jaGlsZC5tZW1vaXplZFN0YXRlPW5qKGMpLGIubWVtb2l6ZWRTdGF0ZT1taixhKTpxaihiLGcpfWU9YS5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1lJiYoaD1lLmRlaHlkcmF0ZWQsbnVsbCE9PWgpKXJldHVybiByaihhLGIsZyxkLGgsZSxjKTtpZihmKXtmPWQuZmFsbGJhY2s7Zz1iLm1vZGU7ZT1hLmNoaWxkO2g9ZS5zaWJsaW5nO3ZhciBrPXttb2RlOlwiaGlkZGVuXCIsY2hpbGRyZW46ZC5jaGlsZHJlbn07MD09PShnJjEpJiZiLmNoaWxkIT09ZT8oZD1iLmNoaWxkLGQuY2hpbGRMYW5lcz0wLGQucGVuZGluZ1Byb3BzPWssYi5kZWxldGlvbnM9bnVsbCk6KGQ9UGcoZSxrKSxkLnN1YnRyZWVGbGFncz1lLnN1YnRyZWVGbGFncyYxNDY4MDA2NCk7bnVsbCE9PWg/Zj1QZyhoLGYpOihmPVRnKGYsZyxjLG51bGwpLGYuZmxhZ3N8PTIpO2YucmV0dXJuPVxuYjtkLnJldHVybj1iO2Quc2libGluZz1mO2IuY2hpbGQ9ZDtkPWY7Zj1iLmNoaWxkO2c9YS5jaGlsZC5tZW1vaXplZFN0YXRlO2c9bnVsbD09PWc/bmooYyk6e2Jhc2VMYW5lczpnLmJhc2VMYW5lc3xjLGNhY2hlUG9vbDpudWxsLHRyYW5zaXRpb25zOmcudHJhbnNpdGlvbnN9O2YubWVtb2l6ZWRTdGF0ZT1nO2YuY2hpbGRMYW5lcz1hLmNoaWxkTGFuZXMmfmM7Yi5tZW1vaXplZFN0YXRlPW1qO3JldHVybiBkfWY9YS5jaGlsZDthPWYuc2libGluZztkPVBnKGYse21vZGU6XCJ2aXNpYmxlXCIsY2hpbGRyZW46ZC5jaGlsZHJlbn0pOzA9PT0oYi5tb2RlJjEpJiYoZC5sYW5lcz1jKTtkLnJldHVybj1iO2Quc2libGluZz1udWxsO251bGwhPT1hJiYoYz1iLmRlbGV0aW9ucyxudWxsPT09Yz8oYi5kZWxldGlvbnM9W2FdLGIuZmxhZ3N8PTE2KTpjLnB1c2goYSkpO2IuY2hpbGQ9ZDtiLm1lbW9pemVkU3RhdGU9bnVsbDtyZXR1cm4gZH1cbmZ1bmN0aW9uIHFqKGEsYil7Yj1waih7bW9kZTpcInZpc2libGVcIixjaGlsZHJlbjpifSxhLm1vZGUsMCxudWxsKTtiLnJldHVybj1hO3JldHVybiBhLmNoaWxkPWJ9ZnVuY3Rpb24gc2ooYSxiLGMsZCl7bnVsbCE9PWQmJkpnKGQpO1VnKGIsYS5jaGlsZCxudWxsLGMpO2E9cWooYixiLnBlbmRpbmdQcm9wcy5jaGlsZHJlbik7YS5mbGFnc3w9MjtiLm1lbW9pemVkU3RhdGU9bnVsbDtyZXR1cm4gYX1cbmZ1bmN0aW9uIHJqKGEsYixjLGQsZSxmLGcpe2lmKGMpe2lmKGIuZmxhZ3MmMjU2KXJldHVybiBiLmZsYWdzJj0tMjU3LGQ9S2koRXJyb3IocCg0MjIpKSksc2ooYSxiLGcsZCk7aWYobnVsbCE9PWIubWVtb2l6ZWRTdGF0ZSlyZXR1cm4gYi5jaGlsZD1hLmNoaWxkLGIuZmxhZ3N8PTEyOCxudWxsO2Y9ZC5mYWxsYmFjaztlPWIubW9kZTtkPXBqKHttb2RlOlwidmlzaWJsZVwiLGNoaWxkcmVuOmQuY2hpbGRyZW59LGUsMCxudWxsKTtmPVRnKGYsZSxnLG51bGwpO2YuZmxhZ3N8PTI7ZC5yZXR1cm49YjtmLnJldHVybj1iO2Quc2libGluZz1mO2IuY2hpbGQ9ZDswIT09KGIubW9kZSYxKSYmVWcoYixhLmNoaWxkLG51bGwsZyk7Yi5jaGlsZC5tZW1vaXplZFN0YXRlPW5qKGcpO2IubWVtb2l6ZWRTdGF0ZT1tajtyZXR1cm4gZn1pZigwPT09KGIubW9kZSYxKSlyZXR1cm4gc2ooYSxiLGcsbnVsbCk7aWYoXCIkIVwiPT09ZS5kYXRhKXtkPWUubmV4dFNpYmxpbmcmJmUubmV4dFNpYmxpbmcuZGF0YXNldDtcbmlmKGQpdmFyIGg9ZC5kZ3N0O2Q9aDtmPUVycm9yKHAoNDE5KSk7ZD1LaShmLGQsdm9pZCAwKTtyZXR1cm4gc2ooYSxiLGcsZCl9aD0wIT09KGcmYS5jaGlsZExhbmVzKTtpZihkaHx8aCl7ZD1RO2lmKG51bGwhPT1kKXtzd2l0Y2goZyYtZyl7Y2FzZSA0OmU9MjticmVhaztjYXNlIDE2OmU9ODticmVhaztjYXNlIDY0OmNhc2UgMTI4OmNhc2UgMjU2OmNhc2UgNTEyOmNhc2UgMTAyNDpjYXNlIDIwNDg6Y2FzZSA0MDk2OmNhc2UgODE5MjpjYXNlIDE2Mzg0OmNhc2UgMzI3Njg6Y2FzZSA2NTUzNjpjYXNlIDEzMTA3MjpjYXNlIDI2MjE0NDpjYXNlIDUyNDI4ODpjYXNlIDEwNDg1NzY6Y2FzZSAyMDk3MTUyOmNhc2UgNDE5NDMwNDpjYXNlIDgzODg2MDg6Y2FzZSAxNjc3NzIxNjpjYXNlIDMzNTU0NDMyOmNhc2UgNjcxMDg4NjQ6ZT0zMjticmVhaztjYXNlIDUzNjg3MDkxMjplPTI2ODQzNTQ1NjticmVhaztkZWZhdWx0OmU9MH1lPTAhPT0oZSYoZC5zdXNwZW5kZWRMYW5lc3xnKSk/MDplO1xuMCE9PWUmJmUhPT1mLnJldHJ5TGFuZSYmKGYucmV0cnlMYW5lPWUsaWgoYSxlKSxnaShkLGEsZSwtMSkpfXRqKCk7ZD1LaShFcnJvcihwKDQyMSkpKTtyZXR1cm4gc2ooYSxiLGcsZCl9aWYoXCIkP1wiPT09ZS5kYXRhKXJldHVybiBiLmZsYWdzfD0xMjgsYi5jaGlsZD1hLmNoaWxkLGI9dWouYmluZChudWxsLGEpLGUuX3JlYWN0UmV0cnk9YixudWxsO2E9Zi50cmVlQ29udGV4dDt5Zz1MZihlLm5leHRTaWJsaW5nKTt4Zz1iO0k9ITA7emc9bnVsbDtudWxsIT09YSYmKG9nW3BnKytdPXJnLG9nW3BnKytdPXNnLG9nW3BnKytdPXFnLHJnPWEuaWQsc2c9YS5vdmVyZmxvdyxxZz1iKTtiPXFqKGIsZC5jaGlsZHJlbik7Yi5mbGFnc3w9NDA5NjtyZXR1cm4gYn1mdW5jdGlvbiB2aihhLGIsYyl7YS5sYW5lc3w9Yjt2YXIgZD1hLmFsdGVybmF0ZTtudWxsIT09ZCYmKGQubGFuZXN8PWIpO2JoKGEucmV0dXJuLGIsYyl9XG5mdW5jdGlvbiB3aihhLGIsYyxkLGUpe3ZhciBmPWEubWVtb2l6ZWRTdGF0ZTtudWxsPT09Zj9hLm1lbW9pemVkU3RhdGU9e2lzQmFja3dhcmRzOmIscmVuZGVyaW5nOm51bGwscmVuZGVyaW5nU3RhcnRUaW1lOjAsbGFzdDpkLHRhaWw6Yyx0YWlsTW9kZTplfTooZi5pc0JhY2t3YXJkcz1iLGYucmVuZGVyaW5nPW51bGwsZi5yZW5kZXJpbmdTdGFydFRpbWU9MCxmLmxhc3Q9ZCxmLnRhaWw9YyxmLnRhaWxNb2RlPWUpfVxuZnVuY3Rpb24geGooYSxiLGMpe3ZhciBkPWIucGVuZGluZ1Byb3BzLGU9ZC5yZXZlYWxPcmRlcixmPWQudGFpbDtYaShhLGIsZC5jaGlsZHJlbixjKTtkPUwuY3VycmVudDtpZigwIT09KGQmMikpZD1kJjF8MixiLmZsYWdzfD0xMjg7ZWxzZXtpZihudWxsIT09YSYmMCE9PShhLmZsYWdzJjEyOCkpYTpmb3IoYT1iLmNoaWxkO251bGwhPT1hOyl7aWYoMTM9PT1hLnRhZyludWxsIT09YS5tZW1vaXplZFN0YXRlJiZ2aihhLGMsYik7ZWxzZSBpZigxOT09PWEudGFnKXZqKGEsYyxiKTtlbHNlIGlmKG51bGwhPT1hLmNoaWxkKXthLmNoaWxkLnJldHVybj1hO2E9YS5jaGlsZDtjb250aW51ZX1pZihhPT09YilicmVhayBhO2Zvcig7bnVsbD09PWEuc2libGluZzspe2lmKG51bGw9PT1hLnJldHVybnx8YS5yZXR1cm49PT1iKWJyZWFrIGE7YT1hLnJldHVybn1hLnNpYmxpbmcucmV0dXJuPWEucmV0dXJuO2E9YS5zaWJsaW5nfWQmPTF9RyhMLGQpO2lmKDA9PT0oYi5tb2RlJjEpKWIubWVtb2l6ZWRTdGF0ZT1cbm51bGw7ZWxzZSBzd2l0Y2goZSl7Y2FzZSBcImZvcndhcmRzXCI6Yz1iLmNoaWxkO2ZvcihlPW51bGw7bnVsbCE9PWM7KWE9Yy5hbHRlcm5hdGUsbnVsbCE9PWEmJm51bGw9PT1DaChhKSYmKGU9YyksYz1jLnNpYmxpbmc7Yz1lO251bGw9PT1jPyhlPWIuY2hpbGQsYi5jaGlsZD1udWxsKTooZT1jLnNpYmxpbmcsYy5zaWJsaW5nPW51bGwpO3dqKGIsITEsZSxjLGYpO2JyZWFrO2Nhc2UgXCJiYWNrd2FyZHNcIjpjPW51bGw7ZT1iLmNoaWxkO2ZvcihiLmNoaWxkPW51bGw7bnVsbCE9PWU7KXthPWUuYWx0ZXJuYXRlO2lmKG51bGwhPT1hJiZudWxsPT09Q2goYSkpe2IuY2hpbGQ9ZTticmVha31hPWUuc2libGluZztlLnNpYmxpbmc9YztjPWU7ZT1hfXdqKGIsITAsYyxudWxsLGYpO2JyZWFrO2Nhc2UgXCJ0b2dldGhlclwiOndqKGIsITEsbnVsbCxudWxsLHZvaWQgMCk7YnJlYWs7ZGVmYXVsdDpiLm1lbW9pemVkU3RhdGU9bnVsbH1yZXR1cm4gYi5jaGlsZH1cbmZ1bmN0aW9uIGlqKGEsYil7MD09PShiLm1vZGUmMSkmJm51bGwhPT1hJiYoYS5hbHRlcm5hdGU9bnVsbCxiLmFsdGVybmF0ZT1udWxsLGIuZmxhZ3N8PTIpfWZ1bmN0aW9uIFppKGEsYixjKXtudWxsIT09YSYmKGIuZGVwZW5kZW5jaWVzPWEuZGVwZW5kZW5jaWVzKTtyaHw9Yi5sYW5lcztpZigwPT09KGMmYi5jaGlsZExhbmVzKSlyZXR1cm4gbnVsbDtpZihudWxsIT09YSYmYi5jaGlsZCE9PWEuY2hpbGQpdGhyb3cgRXJyb3IocCgxNTMpKTtpZihudWxsIT09Yi5jaGlsZCl7YT1iLmNoaWxkO2M9UGcoYSxhLnBlbmRpbmdQcm9wcyk7Yi5jaGlsZD1jO2ZvcihjLnJldHVybj1iO251bGwhPT1hLnNpYmxpbmc7KWE9YS5zaWJsaW5nLGM9Yy5zaWJsaW5nPVBnKGEsYS5wZW5kaW5nUHJvcHMpLGMucmV0dXJuPWI7Yy5zaWJsaW5nPW51bGx9cmV0dXJuIGIuY2hpbGR9XG5mdW5jdGlvbiB5aihhLGIsYyl7c3dpdGNoKGIudGFnKXtjYXNlIDM6a2ooYik7SWcoKTticmVhaztjYXNlIDU6QWgoYik7YnJlYWs7Y2FzZSAxOlpmKGIudHlwZSkmJmNnKGIpO2JyZWFrO2Nhc2UgNDp5aChiLGIuc3RhdGVOb2RlLmNvbnRhaW5lckluZm8pO2JyZWFrO2Nhc2UgMTA6dmFyIGQ9Yi50eXBlLl9jb250ZXh0LGU9Yi5tZW1vaXplZFByb3BzLnZhbHVlO0coV2csZC5fY3VycmVudFZhbHVlKTtkLl9jdXJyZW50VmFsdWU9ZTticmVhaztjYXNlIDEzOmQ9Yi5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1kKXtpZihudWxsIT09ZC5kZWh5ZHJhdGVkKXJldHVybiBHKEwsTC5jdXJyZW50JjEpLGIuZmxhZ3N8PTEyOCxudWxsO2lmKDAhPT0oYyZiLmNoaWxkLmNoaWxkTGFuZXMpKXJldHVybiBvaihhLGIsYyk7RyhMLEwuY3VycmVudCYxKTthPVppKGEsYixjKTtyZXR1cm4gbnVsbCE9PWE/YS5zaWJsaW5nOm51bGx9RyhMLEwuY3VycmVudCYxKTticmVhaztjYXNlIDE5OmQ9MCE9PShjJlxuYi5jaGlsZExhbmVzKTtpZigwIT09KGEuZmxhZ3MmMTI4KSl7aWYoZClyZXR1cm4geGooYSxiLGMpO2IuZmxhZ3N8PTEyOH1lPWIubWVtb2l6ZWRTdGF0ZTtudWxsIT09ZSYmKGUucmVuZGVyaW5nPW51bGwsZS50YWlsPW51bGwsZS5sYXN0RWZmZWN0PW51bGwpO0coTCxMLmN1cnJlbnQpO2lmKGQpYnJlYWs7ZWxzZSByZXR1cm4gbnVsbDtjYXNlIDIyOmNhc2UgMjM6cmV0dXJuIGIubGFuZXM9MCxkaihhLGIsYyl9cmV0dXJuIFppKGEsYixjKX12YXIgemosQWosQmosQ2o7XG56aj1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1iLmNoaWxkO251bGwhPT1jOyl7aWYoNT09PWMudGFnfHw2PT09Yy50YWcpYS5hcHBlbmRDaGlsZChjLnN0YXRlTm9kZSk7ZWxzZSBpZig0IT09Yy50YWcmJm51bGwhPT1jLmNoaWxkKXtjLmNoaWxkLnJldHVybj1jO2M9Yy5jaGlsZDtjb250aW51ZX1pZihjPT09YilicmVhaztmb3IoO251bGw9PT1jLnNpYmxpbmc7KXtpZihudWxsPT09Yy5yZXR1cm58fGMucmV0dXJuPT09YilyZXR1cm47Yz1jLnJldHVybn1jLnNpYmxpbmcucmV0dXJuPWMucmV0dXJuO2M9Yy5zaWJsaW5nfX07QWo9ZnVuY3Rpb24oKXt9O1xuQmo9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5tZW1vaXplZFByb3BzO2lmKGUhPT1kKXthPWIuc3RhdGVOb2RlO3hoKHVoLmN1cnJlbnQpO3ZhciBmPW51bGw7c3dpdGNoKGMpe2Nhc2UgXCJpbnB1dFwiOmU9WWEoYSxlKTtkPVlhKGEsZCk7Zj1bXTticmVhaztjYXNlIFwic2VsZWN0XCI6ZT1BKHt9LGUse3ZhbHVlOnZvaWQgMH0pO2Q9QSh7fSxkLHt2YWx1ZTp2b2lkIDB9KTtmPVtdO2JyZWFrO2Nhc2UgXCJ0ZXh0YXJlYVwiOmU9Z2IoYSxlKTtkPWdiKGEsZCk7Zj1bXTticmVhaztkZWZhdWx0OlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBlLm9uQ2xpY2smJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBkLm9uQ2xpY2smJihhLm9uY2xpY2s9QmYpfXViKGMsZCk7dmFyIGc7Yz1udWxsO2ZvcihsIGluIGUpaWYoIWQuaGFzT3duUHJvcGVydHkobCkmJmUuaGFzT3duUHJvcGVydHkobCkmJm51bGwhPWVbbF0paWYoXCJzdHlsZVwiPT09bCl7dmFyIGg9ZVtsXTtmb3IoZyBpbiBoKWguaGFzT3duUHJvcGVydHkoZykmJlxuKGN8fChjPXt9KSxjW2ddPVwiXCIpfWVsc2VcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sJiZcImNoaWxkcmVuXCIhPT1sJiZcInN1cHByZXNzQ29udGVudEVkaXRhYmxlV2FybmluZ1wiIT09bCYmXCJzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmdcIiE9PWwmJlwiYXV0b0ZvY3VzXCIhPT1sJiYoZWEuaGFzT3duUHJvcGVydHkobCk/Znx8KGY9W10pOihmPWZ8fFtdKS5wdXNoKGwsbnVsbCkpO2ZvcihsIGluIGQpe3ZhciBrPWRbbF07aD1udWxsIT1lP2VbbF06dm9pZCAwO2lmKGQuaGFzT3duUHJvcGVydHkobCkmJmshPT1oJiYobnVsbCE9a3x8bnVsbCE9aCkpaWYoXCJzdHlsZVwiPT09bClpZihoKXtmb3IoZyBpbiBoKSFoLmhhc093blByb3BlcnR5KGcpfHxrJiZrLmhhc093blByb3BlcnR5KGcpfHwoY3x8KGM9e30pLGNbZ109XCJcIik7Zm9yKGcgaW4gaylrLmhhc093blByb3BlcnR5KGcpJiZoW2ddIT09a1tnXSYmKGN8fChjPXt9KSxjW2ddPWtbZ10pfWVsc2UgY3x8KGZ8fChmPVtdKSxmLnB1c2gobCxcbmMpKSxjPWs7ZWxzZVwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIj09PWw/KGs9az9rLl9faHRtbDp2b2lkIDAsaD1oP2guX19odG1sOnZvaWQgMCxudWxsIT1rJiZoIT09ayYmKGY9Znx8W10pLnB1c2gobCxrKSk6XCJjaGlsZHJlblwiPT09bD9cInN0cmluZ1wiIT09dHlwZW9mIGsmJlwibnVtYmVyXCIhPT10eXBlb2Yga3x8KGY9Znx8W10pLnB1c2gobCxcIlwiK2spOlwic3VwcHJlc3NDb250ZW50RWRpdGFibGVXYXJuaW5nXCIhPT1sJiZcInN1cHByZXNzSHlkcmF0aW9uV2FybmluZ1wiIT09bCYmKGVhLmhhc093blByb3BlcnR5KGwpPyhudWxsIT1rJiZcIm9uU2Nyb2xsXCI9PT1sJiZEKFwic2Nyb2xsXCIsYSksZnx8aD09PWt8fChmPVtdKSk6KGY9Znx8W10pLnB1c2gobCxrKSl9YyYmKGY9Znx8W10pLnB1c2goXCJzdHlsZVwiLGMpO3ZhciBsPWY7aWYoYi51cGRhdGVRdWV1ZT1sKWIuZmxhZ3N8PTR9fTtDaj1mdW5jdGlvbihhLGIsYyxkKXtjIT09ZCYmKGIuZmxhZ3N8PTQpfTtcbmZ1bmN0aW9uIERqKGEsYil7aWYoIUkpc3dpdGNoKGEudGFpbE1vZGUpe2Nhc2UgXCJoaWRkZW5cIjpiPWEudGFpbDtmb3IodmFyIGM9bnVsbDtudWxsIT09YjspbnVsbCE9PWIuYWx0ZXJuYXRlJiYoYz1iKSxiPWIuc2libGluZztudWxsPT09Yz9hLnRhaWw9bnVsbDpjLnNpYmxpbmc9bnVsbDticmVhaztjYXNlIFwiY29sbGFwc2VkXCI6Yz1hLnRhaWw7Zm9yKHZhciBkPW51bGw7bnVsbCE9PWM7KW51bGwhPT1jLmFsdGVybmF0ZSYmKGQ9YyksYz1jLnNpYmxpbmc7bnVsbD09PWQ/Ynx8bnVsbD09PWEudGFpbD9hLnRhaWw9bnVsbDphLnRhaWwuc2libGluZz1udWxsOmQuc2libGluZz1udWxsfX1cbmZ1bmN0aW9uIFMoYSl7dmFyIGI9bnVsbCE9PWEuYWx0ZXJuYXRlJiZhLmFsdGVybmF0ZS5jaGlsZD09PWEuY2hpbGQsYz0wLGQ9MDtpZihiKWZvcih2YXIgZT1hLmNoaWxkO251bGwhPT1lOyljfD1lLmxhbmVzfGUuY2hpbGRMYW5lcyxkfD1lLnN1YnRyZWVGbGFncyYxNDY4MDA2NCxkfD1lLmZsYWdzJjE0NjgwMDY0LGUucmV0dXJuPWEsZT1lLnNpYmxpbmc7ZWxzZSBmb3IoZT1hLmNoaWxkO251bGwhPT1lOyljfD1lLmxhbmVzfGUuY2hpbGRMYW5lcyxkfD1lLnN1YnRyZWVGbGFncyxkfD1lLmZsYWdzLGUucmV0dXJuPWEsZT1lLnNpYmxpbmc7YS5zdWJ0cmVlRmxhZ3N8PWQ7YS5jaGlsZExhbmVzPWM7cmV0dXJuIGJ9XG5mdW5jdGlvbiBFaihhLGIsYyl7dmFyIGQ9Yi5wZW5kaW5nUHJvcHM7d2coYik7c3dpdGNoKGIudGFnKXtjYXNlIDI6Y2FzZSAxNjpjYXNlIDE1OmNhc2UgMDpjYXNlIDExOmNhc2UgNzpjYXNlIDg6Y2FzZSAxMjpjYXNlIDk6Y2FzZSAxNDpyZXR1cm4gUyhiKSxudWxsO2Nhc2UgMTpyZXR1cm4gWmYoYi50eXBlKSYmJGYoKSxTKGIpLG51bGw7Y2FzZSAzOmQ9Yi5zdGF0ZU5vZGU7emgoKTtFKFdmKTtFKEgpO0VoKCk7ZC5wZW5kaW5nQ29udGV4dCYmKGQuY29udGV4dD1kLnBlbmRpbmdDb250ZXh0LGQucGVuZGluZ0NvbnRleHQ9bnVsbCk7aWYobnVsbD09PWF8fG51bGw9PT1hLmNoaWxkKUdnKGIpP2IuZmxhZ3N8PTQ6bnVsbD09PWF8fGEubWVtb2l6ZWRTdGF0ZS5pc0RlaHlkcmF0ZWQmJjA9PT0oYi5mbGFncyYyNTYpfHwoYi5mbGFnc3w9MTAyNCxudWxsIT09emcmJihGaih6Zyksemc9bnVsbCkpO0FqKGEsYik7UyhiKTtyZXR1cm4gbnVsbDtjYXNlIDU6QmgoYik7dmFyIGU9eGgod2guY3VycmVudCk7XG5jPWIudHlwZTtpZihudWxsIT09YSYmbnVsbCE9Yi5zdGF0ZU5vZGUpQmooYSxiLGMsZCxlKSxhLnJlZiE9PWIucmVmJiYoYi5mbGFnc3w9NTEyLGIuZmxhZ3N8PTIwOTcxNTIpO2Vsc2V7aWYoIWQpe2lmKG51bGw9PT1iLnN0YXRlTm9kZSl0aHJvdyBFcnJvcihwKDE2NikpO1MoYik7cmV0dXJuIG51bGx9YT14aCh1aC5jdXJyZW50KTtpZihHZyhiKSl7ZD1iLnN0YXRlTm9kZTtjPWIudHlwZTt2YXIgZj1iLm1lbW9pemVkUHJvcHM7ZFtPZl09YjtkW1BmXT1mO2E9MCE9PShiLm1vZGUmMSk7c3dpdGNoKGMpe2Nhc2UgXCJkaWFsb2dcIjpEKFwiY2FuY2VsXCIsZCk7RChcImNsb3NlXCIsZCk7YnJlYWs7Y2FzZSBcImlmcmFtZVwiOmNhc2UgXCJvYmplY3RcIjpjYXNlIFwiZW1iZWRcIjpEKFwibG9hZFwiLGQpO2JyZWFrO2Nhc2UgXCJ2aWRlb1wiOmNhc2UgXCJhdWRpb1wiOmZvcihlPTA7ZTxsZi5sZW5ndGg7ZSsrKUQobGZbZV0sZCk7YnJlYWs7Y2FzZSBcInNvdXJjZVwiOkQoXCJlcnJvclwiLGQpO2JyZWFrO2Nhc2UgXCJpbWdcIjpjYXNlIFwiaW1hZ2VcIjpjYXNlIFwibGlua1wiOkQoXCJlcnJvclwiLFxuZCk7RChcImxvYWRcIixkKTticmVhaztjYXNlIFwiZGV0YWlsc1wiOkQoXCJ0b2dnbGVcIixkKTticmVhaztjYXNlIFwiaW5wdXRcIjpaYShkLGYpO0QoXCJpbnZhbGlkXCIsZCk7YnJlYWs7Y2FzZSBcInNlbGVjdFwiOmQuX3dyYXBwZXJTdGF0ZT17d2FzTXVsdGlwbGU6ISFmLm11bHRpcGxlfTtEKFwiaW52YWxpZFwiLGQpO2JyZWFrO2Nhc2UgXCJ0ZXh0YXJlYVwiOmhiKGQsZiksRChcImludmFsaWRcIixkKX11YihjLGYpO2U9bnVsbDtmb3IodmFyIGcgaW4gZilpZihmLmhhc093blByb3BlcnR5KGcpKXt2YXIgaD1mW2ddO1wiY2hpbGRyZW5cIj09PWc/XCJzdHJpbmdcIj09PXR5cGVvZiBoP2QudGV4dENvbnRlbnQhPT1oJiYoITAhPT1mLnN1cHByZXNzSHlkcmF0aW9uV2FybmluZyYmQWYoZC50ZXh0Q29udGVudCxoLGEpLGU9W1wiY2hpbGRyZW5cIixoXSk6XCJudW1iZXJcIj09PXR5cGVvZiBoJiZkLnRleHRDb250ZW50IT09XCJcIitoJiYoITAhPT1mLnN1cHByZXNzSHlkcmF0aW9uV2FybmluZyYmQWYoZC50ZXh0Q29udGVudCxcbmgsYSksZT1bXCJjaGlsZHJlblwiLFwiXCIraF0pOmVhLmhhc093blByb3BlcnR5KGcpJiZudWxsIT1oJiZcIm9uU2Nyb2xsXCI9PT1nJiZEKFwic2Nyb2xsXCIsZCl9c3dpdGNoKGMpe2Nhc2UgXCJpbnB1dFwiOlZhKGQpO2RiKGQsZiwhMCk7YnJlYWs7Y2FzZSBcInRleHRhcmVhXCI6VmEoZCk7amIoZCk7YnJlYWs7Y2FzZSBcInNlbGVjdFwiOmNhc2UgXCJvcHRpb25cIjpicmVhaztkZWZhdWx0OlwiZnVuY3Rpb25cIj09PXR5cGVvZiBmLm9uQ2xpY2smJihkLm9uY2xpY2s9QmYpfWQ9ZTtiLnVwZGF0ZVF1ZXVlPWQ7bnVsbCE9PWQmJihiLmZsYWdzfD00KX1lbHNle2c9OT09PWUubm9kZVR5cGU/ZTplLm93bmVyRG9jdW1lbnQ7XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI9PT1hJiYoYT1rYihjKSk7XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI9PT1hP1wic2NyaXB0XCI9PT1jPyhhPWcuY3JlYXRlRWxlbWVudChcImRpdlwiKSxhLmlubmVySFRNTD1cIjxzY3JpcHQ+XFx4M2Mvc2NyaXB0PlwiLGE9YS5yZW1vdmVDaGlsZChhLmZpcnN0Q2hpbGQpKTpcblwic3RyaW5nXCI9PT10eXBlb2YgZC5pcz9hPWcuY3JlYXRlRWxlbWVudChjLHtpczpkLmlzfSk6KGE9Zy5jcmVhdGVFbGVtZW50KGMpLFwic2VsZWN0XCI9PT1jJiYoZz1hLGQubXVsdGlwbGU/Zy5tdWx0aXBsZT0hMDpkLnNpemUmJihnLnNpemU9ZC5zaXplKSkpOmE9Zy5jcmVhdGVFbGVtZW50TlMoYSxjKTthW09mXT1iO2FbUGZdPWQ7emooYSxiLCExLCExKTtiLnN0YXRlTm9kZT1hO2E6e2c9dmIoYyxkKTtzd2l0Y2goYyl7Y2FzZSBcImRpYWxvZ1wiOkQoXCJjYW5jZWxcIixhKTtEKFwiY2xvc2VcIixhKTtlPWQ7YnJlYWs7Y2FzZSBcImlmcmFtZVwiOmNhc2UgXCJvYmplY3RcIjpjYXNlIFwiZW1iZWRcIjpEKFwibG9hZFwiLGEpO2U9ZDticmVhaztjYXNlIFwidmlkZW9cIjpjYXNlIFwiYXVkaW9cIjpmb3IoZT0wO2U8bGYubGVuZ3RoO2UrKylEKGxmW2VdLGEpO2U9ZDticmVhaztjYXNlIFwic291cmNlXCI6RChcImVycm9yXCIsYSk7ZT1kO2JyZWFrO2Nhc2UgXCJpbWdcIjpjYXNlIFwiaW1hZ2VcIjpjYXNlIFwibGlua1wiOkQoXCJlcnJvclwiLFxuYSk7RChcImxvYWRcIixhKTtlPWQ7YnJlYWs7Y2FzZSBcImRldGFpbHNcIjpEKFwidG9nZ2xlXCIsYSk7ZT1kO2JyZWFrO2Nhc2UgXCJpbnB1dFwiOlphKGEsZCk7ZT1ZYShhLGQpO0QoXCJpbnZhbGlkXCIsYSk7YnJlYWs7Y2FzZSBcIm9wdGlvblwiOmU9ZDticmVhaztjYXNlIFwic2VsZWN0XCI6YS5fd3JhcHBlclN0YXRlPXt3YXNNdWx0aXBsZTohIWQubXVsdGlwbGV9O2U9QSh7fSxkLHt2YWx1ZTp2b2lkIDB9KTtEKFwiaW52YWxpZFwiLGEpO2JyZWFrO2Nhc2UgXCJ0ZXh0YXJlYVwiOmhiKGEsZCk7ZT1nYihhLGQpO0QoXCJpbnZhbGlkXCIsYSk7YnJlYWs7ZGVmYXVsdDplPWR9dWIoYyxlKTtoPWU7Zm9yKGYgaW4gaClpZihoLmhhc093blByb3BlcnR5KGYpKXt2YXIgaz1oW2ZdO1wic3R5bGVcIj09PWY/c2IoYSxrKTpcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCI9PT1mPyhrPWs/ay5fX2h0bWw6dm9pZCAwLG51bGwhPWsmJm5iKGEsaykpOlwiY2hpbGRyZW5cIj09PWY/XCJzdHJpbmdcIj09PXR5cGVvZiBrPyhcInRleHRhcmVhXCIhPT1cbmN8fFwiXCIhPT1rKSYmb2IoYSxrKTpcIm51bWJlclwiPT09dHlwZW9mIGsmJm9iKGEsXCJcIitrKTpcInN1cHByZXNzQ29udGVudEVkaXRhYmxlV2FybmluZ1wiIT09ZiYmXCJzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmdcIiE9PWYmJlwiYXV0b0ZvY3VzXCIhPT1mJiYoZWEuaGFzT3duUHJvcGVydHkoZik/bnVsbCE9ayYmXCJvblNjcm9sbFwiPT09ZiYmRChcInNjcm9sbFwiLGEpOm51bGwhPWsmJnRhKGEsZixrLGcpKX1zd2l0Y2goYyl7Y2FzZSBcImlucHV0XCI6VmEoYSk7ZGIoYSxkLCExKTticmVhaztjYXNlIFwidGV4dGFyZWFcIjpWYShhKTtqYihhKTticmVhaztjYXNlIFwib3B0aW9uXCI6bnVsbCE9ZC52YWx1ZSYmYS5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLFwiXCIrU2EoZC52YWx1ZSkpO2JyZWFrO2Nhc2UgXCJzZWxlY3RcIjphLm11bHRpcGxlPSEhZC5tdWx0aXBsZTtmPWQudmFsdWU7bnVsbCE9Zj9mYihhLCEhZC5tdWx0aXBsZSxmLCExKTpudWxsIT1kLmRlZmF1bHRWYWx1ZSYmZmIoYSwhIWQubXVsdGlwbGUsZC5kZWZhdWx0VmFsdWUsXG4hMCk7YnJlYWs7ZGVmYXVsdDpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZS5vbkNsaWNrJiYoYS5vbmNsaWNrPUJmKX1zd2l0Y2goYyl7Y2FzZSBcImJ1dHRvblwiOmNhc2UgXCJpbnB1dFwiOmNhc2UgXCJzZWxlY3RcIjpjYXNlIFwidGV4dGFyZWFcIjpkPSEhZC5hdXRvRm9jdXM7YnJlYWsgYTtjYXNlIFwiaW1nXCI6ZD0hMDticmVhayBhO2RlZmF1bHQ6ZD0hMX19ZCYmKGIuZmxhZ3N8PTQpfW51bGwhPT1iLnJlZiYmKGIuZmxhZ3N8PTUxMixiLmZsYWdzfD0yMDk3MTUyKX1TKGIpO3JldHVybiBudWxsO2Nhc2UgNjppZihhJiZudWxsIT1iLnN0YXRlTm9kZSlDaihhLGIsYS5tZW1vaXplZFByb3BzLGQpO2Vsc2V7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBkJiZudWxsPT09Yi5zdGF0ZU5vZGUpdGhyb3cgRXJyb3IocCgxNjYpKTtjPXhoKHdoLmN1cnJlbnQpO3hoKHVoLmN1cnJlbnQpO2lmKEdnKGIpKXtkPWIuc3RhdGVOb2RlO2M9Yi5tZW1vaXplZFByb3BzO2RbT2ZdPWI7aWYoZj1kLm5vZGVWYWx1ZSE9PWMpaWYoYT1cbnhnLG51bGwhPT1hKXN3aXRjaChhLnRhZyl7Y2FzZSAzOkFmKGQubm9kZVZhbHVlLGMsMCE9PShhLm1vZGUmMSkpO2JyZWFrO2Nhc2UgNTohMCE9PWEubWVtb2l6ZWRQcm9wcy5zdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmcmJkFmKGQubm9kZVZhbHVlLGMsMCE9PShhLm1vZGUmMSkpfWYmJihiLmZsYWdzfD00KX1lbHNlIGQ9KDk9PT1jLm5vZGVUeXBlP2M6Yy5vd25lckRvY3VtZW50KS5jcmVhdGVUZXh0Tm9kZShkKSxkW09mXT1iLGIuc3RhdGVOb2RlPWR9UyhiKTtyZXR1cm4gbnVsbDtjYXNlIDEzOkUoTCk7ZD1iLm1lbW9pemVkU3RhdGU7aWYobnVsbD09PWF8fG51bGwhPT1hLm1lbW9pemVkU3RhdGUmJm51bGwhPT1hLm1lbW9pemVkU3RhdGUuZGVoeWRyYXRlZCl7aWYoSSYmbnVsbCE9PXlnJiYwIT09KGIubW9kZSYxKSYmMD09PShiLmZsYWdzJjEyOCkpSGcoKSxJZygpLGIuZmxhZ3N8PTk4NTYwLGY9ITE7ZWxzZSBpZihmPUdnKGIpLG51bGwhPT1kJiZudWxsIT09ZC5kZWh5ZHJhdGVkKXtpZihudWxsPT09XG5hKXtpZighZil0aHJvdyBFcnJvcihwKDMxOCkpO2Y9Yi5tZW1vaXplZFN0YXRlO2Y9bnVsbCE9PWY/Zi5kZWh5ZHJhdGVkOm51bGw7aWYoIWYpdGhyb3cgRXJyb3IocCgzMTcpKTtmW09mXT1ifWVsc2UgSWcoKSwwPT09KGIuZmxhZ3MmMTI4KSYmKGIubWVtb2l6ZWRTdGF0ZT1udWxsKSxiLmZsYWdzfD00O1MoYik7Zj0hMX1lbHNlIG51bGwhPT16ZyYmKEZqKHpnKSx6Zz1udWxsKSxmPSEwO2lmKCFmKXJldHVybiBiLmZsYWdzJjY1NTM2P2I6bnVsbH1pZigwIT09KGIuZmxhZ3MmMTI4KSlyZXR1cm4gYi5sYW5lcz1jLGI7ZD1udWxsIT09ZDtkIT09KG51bGwhPT1hJiZudWxsIT09YS5tZW1vaXplZFN0YXRlKSYmZCYmKGIuY2hpbGQuZmxhZ3N8PTgxOTIsMCE9PShiLm1vZGUmMSkmJihudWxsPT09YXx8MCE9PShMLmN1cnJlbnQmMSk/MD09PVQmJihUPTMpOnRqKCkpKTtudWxsIT09Yi51cGRhdGVRdWV1ZSYmKGIuZmxhZ3N8PTQpO1MoYik7cmV0dXJuIG51bGw7Y2FzZSA0OnJldHVybiB6aCgpLFxuQWooYSxiKSxudWxsPT09YSYmc2YoYi5zdGF0ZU5vZGUuY29udGFpbmVySW5mbyksUyhiKSxudWxsO2Nhc2UgMTA6cmV0dXJuIGFoKGIudHlwZS5fY29udGV4dCksUyhiKSxudWxsO2Nhc2UgMTc6cmV0dXJuIFpmKGIudHlwZSkmJiRmKCksUyhiKSxudWxsO2Nhc2UgMTk6RShMKTtmPWIubWVtb2l6ZWRTdGF0ZTtpZihudWxsPT09ZilyZXR1cm4gUyhiKSxudWxsO2Q9MCE9PShiLmZsYWdzJjEyOCk7Zz1mLnJlbmRlcmluZztpZihudWxsPT09ZylpZihkKURqKGYsITEpO2Vsc2V7aWYoMCE9PVR8fG51bGwhPT1hJiYwIT09KGEuZmxhZ3MmMTI4KSlmb3IoYT1iLmNoaWxkO251bGwhPT1hOyl7Zz1DaChhKTtpZihudWxsIT09Zyl7Yi5mbGFnc3w9MTI4O0RqKGYsITEpO2Q9Zy51cGRhdGVRdWV1ZTtudWxsIT09ZCYmKGIudXBkYXRlUXVldWU9ZCxiLmZsYWdzfD00KTtiLnN1YnRyZWVGbGFncz0wO2Q9Yztmb3IoYz1iLmNoaWxkO251bGwhPT1jOylmPWMsYT1kLGYuZmxhZ3MmPTE0NjgwMDY2LFxuZz1mLmFsdGVybmF0ZSxudWxsPT09Zz8oZi5jaGlsZExhbmVzPTAsZi5sYW5lcz1hLGYuY2hpbGQ9bnVsbCxmLnN1YnRyZWVGbGFncz0wLGYubWVtb2l6ZWRQcm9wcz1udWxsLGYubWVtb2l6ZWRTdGF0ZT1udWxsLGYudXBkYXRlUXVldWU9bnVsbCxmLmRlcGVuZGVuY2llcz1udWxsLGYuc3RhdGVOb2RlPW51bGwpOihmLmNoaWxkTGFuZXM9Zy5jaGlsZExhbmVzLGYubGFuZXM9Zy5sYW5lcyxmLmNoaWxkPWcuY2hpbGQsZi5zdWJ0cmVlRmxhZ3M9MCxmLmRlbGV0aW9ucz1udWxsLGYubWVtb2l6ZWRQcm9wcz1nLm1lbW9pemVkUHJvcHMsZi5tZW1vaXplZFN0YXRlPWcubWVtb2l6ZWRTdGF0ZSxmLnVwZGF0ZVF1ZXVlPWcudXBkYXRlUXVldWUsZi50eXBlPWcudHlwZSxhPWcuZGVwZW5kZW5jaWVzLGYuZGVwZW5kZW5jaWVzPW51bGw9PT1hP251bGw6e2xhbmVzOmEubGFuZXMsZmlyc3RDb250ZXh0OmEuZmlyc3RDb250ZXh0fSksYz1jLnNpYmxpbmc7RyhMLEwuY3VycmVudCYxfDIpO3JldHVybiBiLmNoaWxkfWE9XG5hLnNpYmxpbmd9bnVsbCE9PWYudGFpbCYmQigpPkdqJiYoYi5mbGFnc3w9MTI4LGQ9ITAsRGooZiwhMSksYi5sYW5lcz00MTk0MzA0KX1lbHNle2lmKCFkKWlmKGE9Q2goZyksbnVsbCE9PWEpe2lmKGIuZmxhZ3N8PTEyOCxkPSEwLGM9YS51cGRhdGVRdWV1ZSxudWxsIT09YyYmKGIudXBkYXRlUXVldWU9YyxiLmZsYWdzfD00KSxEaihmLCEwKSxudWxsPT09Zi50YWlsJiZcImhpZGRlblwiPT09Zi50YWlsTW9kZSYmIWcuYWx0ZXJuYXRlJiYhSSlyZXR1cm4gUyhiKSxudWxsfWVsc2UgMipCKCktZi5yZW5kZXJpbmdTdGFydFRpbWU+R2omJjEwNzM3NDE4MjQhPT1jJiYoYi5mbGFnc3w9MTI4LGQ9ITAsRGooZiwhMSksYi5sYW5lcz00MTk0MzA0KTtmLmlzQmFja3dhcmRzPyhnLnNpYmxpbmc9Yi5jaGlsZCxiLmNoaWxkPWcpOihjPWYubGFzdCxudWxsIT09Yz9jLnNpYmxpbmc9ZzpiLmNoaWxkPWcsZi5sYXN0PWcpfWlmKG51bGwhPT1mLnRhaWwpcmV0dXJuIGI9Zi50YWlsLGYucmVuZGVyaW5nPVxuYixmLnRhaWw9Yi5zaWJsaW5nLGYucmVuZGVyaW5nU3RhcnRUaW1lPUIoKSxiLnNpYmxpbmc9bnVsbCxjPUwuY3VycmVudCxHKEwsZD9jJjF8MjpjJjEpLGI7UyhiKTtyZXR1cm4gbnVsbDtjYXNlIDIyOmNhc2UgMjM6cmV0dXJuIEhqKCksZD1udWxsIT09Yi5tZW1vaXplZFN0YXRlLG51bGwhPT1hJiZudWxsIT09YS5tZW1vaXplZFN0YXRlIT09ZCYmKGIuZmxhZ3N8PTgxOTIpLGQmJjAhPT0oYi5tb2RlJjEpPzAhPT0oZmomMTA3Mzc0MTgyNCkmJihTKGIpLGIuc3VidHJlZUZsYWdzJjYmJihiLmZsYWdzfD04MTkyKSk6UyhiKSxudWxsO2Nhc2UgMjQ6cmV0dXJuIG51bGw7Y2FzZSAyNTpyZXR1cm4gbnVsbH10aHJvdyBFcnJvcihwKDE1NixiLnRhZykpO31cbmZ1bmN0aW9uIElqKGEsYil7d2coYik7c3dpdGNoKGIudGFnKXtjYXNlIDE6cmV0dXJuIFpmKGIudHlwZSkmJiRmKCksYT1iLmZsYWdzLGEmNjU1MzY/KGIuZmxhZ3M9YSYtNjU1Mzd8MTI4LGIpOm51bGw7Y2FzZSAzOnJldHVybiB6aCgpLEUoV2YpLEUoSCksRWgoKSxhPWIuZmxhZ3MsMCE9PShhJjY1NTM2KSYmMD09PShhJjEyOCk/KGIuZmxhZ3M9YSYtNjU1Mzd8MTI4LGIpOm51bGw7Y2FzZSA1OnJldHVybiBCaChiKSxudWxsO2Nhc2UgMTM6RShMKTthPWIubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09YSYmbnVsbCE9PWEuZGVoeWRyYXRlZCl7aWYobnVsbD09PWIuYWx0ZXJuYXRlKXRocm93IEVycm9yKHAoMzQwKSk7SWcoKX1hPWIuZmxhZ3M7cmV0dXJuIGEmNjU1MzY/KGIuZmxhZ3M9YSYtNjU1Mzd8MTI4LGIpOm51bGw7Y2FzZSAxOTpyZXR1cm4gRShMKSxudWxsO2Nhc2UgNDpyZXR1cm4gemgoKSxudWxsO2Nhc2UgMTA6cmV0dXJuIGFoKGIudHlwZS5fY29udGV4dCksbnVsbDtjYXNlIDIyOmNhc2UgMjM6cmV0dXJuIEhqKCksXG5udWxsO2Nhc2UgMjQ6cmV0dXJuIG51bGw7ZGVmYXVsdDpyZXR1cm4gbnVsbH19dmFyIEpqPSExLFU9ITEsS2o9XCJmdW5jdGlvblwiPT09dHlwZW9mIFdlYWtTZXQ/V2Vha1NldDpTZXQsVj1udWxsO2Z1bmN0aW9uIExqKGEsYil7dmFyIGM9YS5yZWY7aWYobnVsbCE9PWMpaWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGMpdHJ5e2MobnVsbCl9Y2F0Y2goZCl7VyhhLGIsZCl9ZWxzZSBjLmN1cnJlbnQ9bnVsbH1mdW5jdGlvbiBNaihhLGIsYyl7dHJ5e2MoKX1jYXRjaChkKXtXKGEsYixkKX19dmFyIE5qPSExO1xuZnVuY3Rpb24gT2ooYSxiKXtDZj1kZDthPU1lKCk7aWYoTmUoYSkpe2lmKFwic2VsZWN0aW9uU3RhcnRcImluIGEpdmFyIGM9e3N0YXJ0OmEuc2VsZWN0aW9uU3RhcnQsZW5kOmEuc2VsZWN0aW9uRW5kfTtlbHNlIGE6e2M9KGM9YS5vd25lckRvY3VtZW50KSYmYy5kZWZhdWx0Vmlld3x8d2luZG93O3ZhciBkPWMuZ2V0U2VsZWN0aW9uJiZjLmdldFNlbGVjdGlvbigpO2lmKGQmJjAhPT1kLnJhbmdlQ291bnQpe2M9ZC5hbmNob3JOb2RlO3ZhciBlPWQuYW5jaG9yT2Zmc2V0LGY9ZC5mb2N1c05vZGU7ZD1kLmZvY3VzT2Zmc2V0O3RyeXtjLm5vZGVUeXBlLGYubm9kZVR5cGV9Y2F0Y2goRil7Yz1udWxsO2JyZWFrIGF9dmFyIGc9MCxoPS0xLGs9LTEsbD0wLG09MCxxPWEscj1udWxsO2I6Zm9yKDs7KXtmb3IodmFyIHk7Oyl7cSE9PWN8fDAhPT1lJiYzIT09cS5ub2RlVHlwZXx8KGg9ZytlKTtxIT09Znx8MCE9PWQmJjMhPT1xLm5vZGVUeXBlfHwoaz1nK2QpOzM9PT1xLm5vZGVUeXBlJiYoZys9XG5xLm5vZGVWYWx1ZS5sZW5ndGgpO2lmKG51bGw9PT0oeT1xLmZpcnN0Q2hpbGQpKWJyZWFrO3I9cTtxPXl9Zm9yKDs7KXtpZihxPT09YSlicmVhayBiO3I9PT1jJiYrK2w9PT1lJiYoaD1nKTtyPT09ZiYmKyttPT09ZCYmKGs9Zyk7aWYobnVsbCE9PSh5PXEubmV4dFNpYmxpbmcpKWJyZWFrO3E9cjtyPXEucGFyZW50Tm9kZX1xPXl9Yz0tMT09PWh8fC0xPT09az9udWxsOntzdGFydDpoLGVuZDprfX1lbHNlIGM9bnVsbH1jPWN8fHtzdGFydDowLGVuZDowfX1lbHNlIGM9bnVsbDtEZj17Zm9jdXNlZEVsZW06YSxzZWxlY3Rpb25SYW5nZTpjfTtkZD0hMTtmb3IoVj1iO251bGwhPT1WOylpZihiPVYsYT1iLmNoaWxkLDAhPT0oYi5zdWJ0cmVlRmxhZ3MmMTAyOCkmJm51bGwhPT1hKWEucmV0dXJuPWIsVj1hO2Vsc2UgZm9yKDtudWxsIT09Vjspe2I9Vjt0cnl7dmFyIG49Yi5hbHRlcm5hdGU7aWYoMCE9PShiLmZsYWdzJjEwMjQpKXN3aXRjaChiLnRhZyl7Y2FzZSAwOmNhc2UgMTE6Y2FzZSAxNTpicmVhaztcbmNhc2UgMTppZihudWxsIT09bil7dmFyIHQ9bi5tZW1vaXplZFByb3BzLEo9bi5tZW1vaXplZFN0YXRlLHg9Yi5zdGF0ZU5vZGUsdz14LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKGIuZWxlbWVudFR5cGU9PT1iLnR5cGU/dDpDaShiLnR5cGUsdCksSik7eC5fX3JlYWN0SW50ZXJuYWxTbmFwc2hvdEJlZm9yZVVwZGF0ZT13fWJyZWFrO2Nhc2UgMzp2YXIgdT1iLnN0YXRlTm9kZS5jb250YWluZXJJbmZvOzE9PT11Lm5vZGVUeXBlP3UudGV4dENvbnRlbnQ9XCJcIjo5PT09dS5ub2RlVHlwZSYmdS5kb2N1bWVudEVsZW1lbnQmJnUucmVtb3ZlQ2hpbGQodS5kb2N1bWVudEVsZW1lbnQpO2JyZWFrO2Nhc2UgNTpjYXNlIDY6Y2FzZSA0OmNhc2UgMTc6YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihwKDE2MykpO319Y2F0Y2goRil7VyhiLGIucmV0dXJuLEYpfWE9Yi5zaWJsaW5nO2lmKG51bGwhPT1hKXthLnJldHVybj1iLnJldHVybjtWPWE7YnJlYWt9Vj1iLnJldHVybn1uPU5qO05qPSExO3JldHVybiBufVxuZnVuY3Rpb24gUGooYSxiLGMpe3ZhciBkPWIudXBkYXRlUXVldWU7ZD1udWxsIT09ZD9kLmxhc3RFZmZlY3Q6bnVsbDtpZihudWxsIT09ZCl7dmFyIGU9ZD1kLm5leHQ7ZG97aWYoKGUudGFnJmEpPT09YSl7dmFyIGY9ZS5kZXN0cm95O2UuZGVzdHJveT12b2lkIDA7dm9pZCAwIT09ZiYmTWooYixjLGYpfWU9ZS5uZXh0fXdoaWxlKGUhPT1kKX19ZnVuY3Rpb24gUWooYSxiKXtiPWIudXBkYXRlUXVldWU7Yj1udWxsIT09Yj9iLmxhc3RFZmZlY3Q6bnVsbDtpZihudWxsIT09Yil7dmFyIGM9Yj1iLm5leHQ7ZG97aWYoKGMudGFnJmEpPT09YSl7dmFyIGQ9Yy5jcmVhdGU7Yy5kZXN0cm95PWQoKX1jPWMubmV4dH13aGlsZShjIT09Yil9fWZ1bmN0aW9uIFJqKGEpe3ZhciBiPWEucmVmO2lmKG51bGwhPT1iKXt2YXIgYz1hLnN0YXRlTm9kZTtzd2l0Y2goYS50YWcpe2Nhc2UgNTphPWM7YnJlYWs7ZGVmYXVsdDphPWN9XCJmdW5jdGlvblwiPT09dHlwZW9mIGI/YihhKTpiLmN1cnJlbnQ9YX19XG5mdW5jdGlvbiBTaihhKXt2YXIgYj1hLmFsdGVybmF0ZTtudWxsIT09YiYmKGEuYWx0ZXJuYXRlPW51bGwsU2ooYikpO2EuY2hpbGQ9bnVsbDthLmRlbGV0aW9ucz1udWxsO2Euc2libGluZz1udWxsOzU9PT1hLnRhZyYmKGI9YS5zdGF0ZU5vZGUsbnVsbCE9PWImJihkZWxldGUgYltPZl0sZGVsZXRlIGJbUGZdLGRlbGV0ZSBiW29mXSxkZWxldGUgYltRZl0sZGVsZXRlIGJbUmZdKSk7YS5zdGF0ZU5vZGU9bnVsbDthLnJldHVybj1udWxsO2EuZGVwZW5kZW5jaWVzPW51bGw7YS5tZW1vaXplZFByb3BzPW51bGw7YS5tZW1vaXplZFN0YXRlPW51bGw7YS5wZW5kaW5nUHJvcHM9bnVsbDthLnN0YXRlTm9kZT1udWxsO2EudXBkYXRlUXVldWU9bnVsbH1mdW5jdGlvbiBUaihhKXtyZXR1cm4gNT09PWEudGFnfHwzPT09YS50YWd8fDQ9PT1hLnRhZ31cbmZ1bmN0aW9uIFVqKGEpe2E6Zm9yKDs7KXtmb3IoO251bGw9PT1hLnNpYmxpbmc7KXtpZihudWxsPT09YS5yZXR1cm58fFRqKGEucmV0dXJuKSlyZXR1cm4gbnVsbDthPWEucmV0dXJufWEuc2libGluZy5yZXR1cm49YS5yZXR1cm47Zm9yKGE9YS5zaWJsaW5nOzUhPT1hLnRhZyYmNiE9PWEudGFnJiYxOCE9PWEudGFnOyl7aWYoYS5mbGFncyYyKWNvbnRpbnVlIGE7aWYobnVsbD09PWEuY2hpbGR8fDQ9PT1hLnRhZyljb250aW51ZSBhO2Vsc2UgYS5jaGlsZC5yZXR1cm49YSxhPWEuY2hpbGR9aWYoIShhLmZsYWdzJjIpKXJldHVybiBhLnN0YXRlTm9kZX19XG5mdW5jdGlvbiBWaihhLGIsYyl7dmFyIGQ9YS50YWc7aWYoNT09PWR8fDY9PT1kKWE9YS5zdGF0ZU5vZGUsYj84PT09Yy5ub2RlVHlwZT9jLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsYik6Yy5pbnNlcnRCZWZvcmUoYSxiKTooOD09PWMubm9kZVR5cGU/KGI9Yy5wYXJlbnROb2RlLGIuaW5zZXJ0QmVmb3JlKGEsYykpOihiPWMsYi5hcHBlbmRDaGlsZChhKSksYz1jLl9yZWFjdFJvb3RDb250YWluZXIsbnVsbCE9PWMmJnZvaWQgMCE9PWN8fG51bGwhPT1iLm9uY2xpY2t8fChiLm9uY2xpY2s9QmYpKTtlbHNlIGlmKDQhPT1kJiYoYT1hLmNoaWxkLG51bGwhPT1hKSlmb3IoVmooYSxiLGMpLGE9YS5zaWJsaW5nO251bGwhPT1hOylWaihhLGIsYyksYT1hLnNpYmxpbmd9XG5mdW5jdGlvbiBXaihhLGIsYyl7dmFyIGQ9YS50YWc7aWYoNT09PWR8fDY9PT1kKWE9YS5zdGF0ZU5vZGUsYj9jLmluc2VydEJlZm9yZShhLGIpOmMuYXBwZW5kQ2hpbGQoYSk7ZWxzZSBpZig0IT09ZCYmKGE9YS5jaGlsZCxudWxsIT09YSkpZm9yKFdqKGEsYixjKSxhPWEuc2libGluZztudWxsIT09YTspV2ooYSxiLGMpLGE9YS5zaWJsaW5nfXZhciBYPW51bGwsWGo9ITE7ZnVuY3Rpb24gWWooYSxiLGMpe2ZvcihjPWMuY2hpbGQ7bnVsbCE9PWM7KVpqKGEsYixjKSxjPWMuc2libGluZ31cbmZ1bmN0aW9uIFpqKGEsYixjKXtpZihsYyYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGxjLm9uQ29tbWl0RmliZXJVbm1vdW50KXRyeXtsYy5vbkNvbW1pdEZpYmVyVW5tb3VudChrYyxjKX1jYXRjaChoKXt9c3dpdGNoKGMudGFnKXtjYXNlIDU6VXx8TGooYyxiKTtjYXNlIDY6dmFyIGQ9WCxlPVhqO1g9bnVsbDtZaihhLGIsYyk7WD1kO1hqPWU7bnVsbCE9PVgmJihYaj8oYT1YLGM9Yy5zdGF0ZU5vZGUsOD09PWEubm9kZVR5cGU/YS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGMpOmEucmVtb3ZlQ2hpbGQoYykpOlgucmVtb3ZlQ2hpbGQoYy5zdGF0ZU5vZGUpKTticmVhaztjYXNlIDE4Om51bGwhPT1YJiYoWGo/KGE9WCxjPWMuc3RhdGVOb2RlLDg9PT1hLm5vZGVUeXBlP0tmKGEucGFyZW50Tm9kZSxjKToxPT09YS5ub2RlVHlwZSYmS2YoYSxjKSxiZChhKSk6S2YoWCxjLnN0YXRlTm9kZSkpO2JyZWFrO2Nhc2UgNDpkPVg7ZT1YajtYPWMuc3RhdGVOb2RlLmNvbnRhaW5lckluZm87WGo9ITA7XG5ZaihhLGIsYyk7WD1kO1hqPWU7YnJlYWs7Y2FzZSAwOmNhc2UgMTE6Y2FzZSAxNDpjYXNlIDE1OmlmKCFVJiYoZD1jLnVwZGF0ZVF1ZXVlLG51bGwhPT1kJiYoZD1kLmxhc3RFZmZlY3QsbnVsbCE9PWQpKSl7ZT1kPWQubmV4dDtkb3t2YXIgZj1lLGc9Zi5kZXN0cm95O2Y9Zi50YWc7dm9pZCAwIT09ZyYmKDAhPT0oZiYyKT9NaihjLGIsZyk6MCE9PShmJjQpJiZNaihjLGIsZykpO2U9ZS5uZXh0fXdoaWxlKGUhPT1kKX1ZaihhLGIsYyk7YnJlYWs7Y2FzZSAxOmlmKCFVJiYoTGooYyxiKSxkPWMuc3RhdGVOb2RlLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkLmNvbXBvbmVudFdpbGxVbm1vdW50KSl0cnl7ZC5wcm9wcz1jLm1lbW9pemVkUHJvcHMsZC5zdGF0ZT1jLm1lbW9pemVkU3RhdGUsZC5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKGgpe1coYyxiLGgpfVlqKGEsYixjKTticmVhaztjYXNlIDIxOllqKGEsYixjKTticmVhaztjYXNlIDIyOmMubW9kZSYxPyhVPShkPVUpfHxudWxsIT09XG5jLm1lbW9pemVkU3RhdGUsWWooYSxiLGMpLFU9ZCk6WWooYSxiLGMpO2JyZWFrO2RlZmF1bHQ6WWooYSxiLGMpfX1mdW5jdGlvbiBhayhhKXt2YXIgYj1hLnVwZGF0ZVF1ZXVlO2lmKG51bGwhPT1iKXthLnVwZGF0ZVF1ZXVlPW51bGw7dmFyIGM9YS5zdGF0ZU5vZGU7bnVsbD09PWMmJihjPWEuc3RhdGVOb2RlPW5ldyBLaik7Yi5mb3JFYWNoKGZ1bmN0aW9uKGIpe3ZhciBkPWJrLmJpbmQobnVsbCxhLGIpO2MuaGFzKGIpfHwoYy5hZGQoYiksYi50aGVuKGQsZCkpfSl9fVxuZnVuY3Rpb24gY2soYSxiKXt2YXIgYz1iLmRlbGV0aW9ucztpZihudWxsIT09Yylmb3IodmFyIGQ9MDtkPGMubGVuZ3RoO2QrKyl7dmFyIGU9Y1tkXTt0cnl7dmFyIGY9YSxnPWIsaD1nO2E6Zm9yKDtudWxsIT09aDspe3N3aXRjaChoLnRhZyl7Y2FzZSA1Olg9aC5zdGF0ZU5vZGU7WGo9ITE7YnJlYWsgYTtjYXNlIDM6WD1oLnN0YXRlTm9kZS5jb250YWluZXJJbmZvO1hqPSEwO2JyZWFrIGE7Y2FzZSA0Olg9aC5zdGF0ZU5vZGUuY29udGFpbmVySW5mbztYaj0hMDticmVhayBhfWg9aC5yZXR1cm59aWYobnVsbD09PVgpdGhyb3cgRXJyb3IocCgxNjApKTtaaihmLGcsZSk7WD1udWxsO1hqPSExO3ZhciBrPWUuYWx0ZXJuYXRlO251bGwhPT1rJiYoay5yZXR1cm49bnVsbCk7ZS5yZXR1cm49bnVsbH1jYXRjaChsKXtXKGUsYixsKX19aWYoYi5zdWJ0cmVlRmxhZ3MmMTI4NTQpZm9yKGI9Yi5jaGlsZDtudWxsIT09YjspZGsoYixhKSxiPWIuc2libGluZ31cbmZ1bmN0aW9uIGRrKGEsYil7dmFyIGM9YS5hbHRlcm5hdGUsZD1hLmZsYWdzO3N3aXRjaChhLnRhZyl7Y2FzZSAwOmNhc2UgMTE6Y2FzZSAxNDpjYXNlIDE1OmNrKGIsYSk7ZWsoYSk7aWYoZCY0KXt0cnl7UGooMyxhLGEucmV0dXJuKSxRaigzLGEpfWNhdGNoKHQpe1coYSxhLnJldHVybix0KX10cnl7UGooNSxhLGEucmV0dXJuKX1jYXRjaCh0KXtXKGEsYS5yZXR1cm4sdCl9fWJyZWFrO2Nhc2UgMTpjayhiLGEpO2VrKGEpO2QmNTEyJiZudWxsIT09YyYmTGooYyxjLnJldHVybik7YnJlYWs7Y2FzZSA1OmNrKGIsYSk7ZWsoYSk7ZCY1MTImJm51bGwhPT1jJiZMaihjLGMucmV0dXJuKTtpZihhLmZsYWdzJjMyKXt2YXIgZT1hLnN0YXRlTm9kZTt0cnl7b2IoZSxcIlwiKX1jYXRjaCh0KXtXKGEsYS5yZXR1cm4sdCl9fWlmKGQmNCYmKGU9YS5zdGF0ZU5vZGUsbnVsbCE9ZSkpe3ZhciBmPWEubWVtb2l6ZWRQcm9wcyxnPW51bGwhPT1jP2MubWVtb2l6ZWRQcm9wczpmLGg9YS50eXBlLGs9YS51cGRhdGVRdWV1ZTtcbmEudXBkYXRlUXVldWU9bnVsbDtpZihudWxsIT09ayl0cnl7XCJpbnB1dFwiPT09aCYmXCJyYWRpb1wiPT09Zi50eXBlJiZudWxsIT1mLm5hbWUmJmFiKGUsZik7dmIoaCxnKTt2YXIgbD12YihoLGYpO2ZvcihnPTA7ZzxrLmxlbmd0aDtnKz0yKXt2YXIgbT1rW2ddLHE9a1tnKzFdO1wic3R5bGVcIj09PW0/c2IoZSxxKTpcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCI9PT1tP25iKGUscSk6XCJjaGlsZHJlblwiPT09bT9vYihlLHEpOnRhKGUsbSxxLGwpfXN3aXRjaChoKXtjYXNlIFwiaW5wdXRcIjpiYihlLGYpO2JyZWFrO2Nhc2UgXCJ0ZXh0YXJlYVwiOmliKGUsZik7YnJlYWs7Y2FzZSBcInNlbGVjdFwiOnZhciByPWUuX3dyYXBwZXJTdGF0ZS53YXNNdWx0aXBsZTtlLl93cmFwcGVyU3RhdGUud2FzTXVsdGlwbGU9ISFmLm11bHRpcGxlO3ZhciB5PWYudmFsdWU7bnVsbCE9eT9mYihlLCEhZi5tdWx0aXBsZSx5LCExKTpyIT09ISFmLm11bHRpcGxlJiYobnVsbCE9Zi5kZWZhdWx0VmFsdWU/ZmIoZSwhIWYubXVsdGlwbGUsXG5mLmRlZmF1bHRWYWx1ZSwhMCk6ZmIoZSwhIWYubXVsdGlwbGUsZi5tdWx0aXBsZT9bXTpcIlwiLCExKSl9ZVtQZl09Zn1jYXRjaCh0KXtXKGEsYS5yZXR1cm4sdCl9fWJyZWFrO2Nhc2UgNjpjayhiLGEpO2VrKGEpO2lmKGQmNCl7aWYobnVsbD09PWEuc3RhdGVOb2RlKXRocm93IEVycm9yKHAoMTYyKSk7ZT1hLnN0YXRlTm9kZTtmPWEubWVtb2l6ZWRQcm9wczt0cnl7ZS5ub2RlVmFsdWU9Zn1jYXRjaCh0KXtXKGEsYS5yZXR1cm4sdCl9fWJyZWFrO2Nhc2UgMzpjayhiLGEpO2VrKGEpO2lmKGQmNCYmbnVsbCE9PWMmJmMubWVtb2l6ZWRTdGF0ZS5pc0RlaHlkcmF0ZWQpdHJ5e2JkKGIuY29udGFpbmVySW5mbyl9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfWJyZWFrO2Nhc2UgNDpjayhiLGEpO2VrKGEpO2JyZWFrO2Nhc2UgMTM6Y2soYixhKTtlayhhKTtlPWEuY2hpbGQ7ZS5mbGFncyY4MTkyJiYoZj1udWxsIT09ZS5tZW1vaXplZFN0YXRlLGUuc3RhdGVOb2RlLmlzSGlkZGVuPWYsIWZ8fFxubnVsbCE9PWUuYWx0ZXJuYXRlJiZudWxsIT09ZS5hbHRlcm5hdGUubWVtb2l6ZWRTdGF0ZXx8KGZrPUIoKSkpO2QmNCYmYWsoYSk7YnJlYWs7Y2FzZSAyMjptPW51bGwhPT1jJiZudWxsIT09Yy5tZW1vaXplZFN0YXRlO2EubW9kZSYxPyhVPShsPVUpfHxtLGNrKGIsYSksVT1sKTpjayhiLGEpO2VrKGEpO2lmKGQmODE5Mil7bD1udWxsIT09YS5tZW1vaXplZFN0YXRlO2lmKChhLnN0YXRlTm9kZS5pc0hpZGRlbj1sKSYmIW0mJjAhPT0oYS5tb2RlJjEpKWZvcihWPWEsbT1hLmNoaWxkO251bGwhPT1tOyl7Zm9yKHE9Vj1tO251bGwhPT1WOyl7cj1WO3k9ci5jaGlsZDtzd2l0Y2goci50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTQ6Y2FzZSAxNTpQaig0LHIsci5yZXR1cm4pO2JyZWFrO2Nhc2UgMTpMaihyLHIucmV0dXJuKTt2YXIgbj1yLnN0YXRlTm9kZTtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2Ygbi5jb21wb25lbnRXaWxsVW5tb3VudCl7ZD1yO2M9ci5yZXR1cm47dHJ5e2I9ZCxuLnByb3BzPVxuYi5tZW1vaXplZFByb3BzLG4uc3RhdGU9Yi5tZW1vaXplZFN0YXRlLG4uY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaCh0KXtXKGQsYyx0KX19YnJlYWs7Y2FzZSA1OkxqKHIsci5yZXR1cm4pO2JyZWFrO2Nhc2UgMjI6aWYobnVsbCE9PXIubWVtb2l6ZWRTdGF0ZSl7Z2socSk7Y29udGludWV9fW51bGwhPT15Pyh5LnJldHVybj1yLFY9eSk6Z2socSl9bT1tLnNpYmxpbmd9YTpmb3IobT1udWxsLHE9YTs7KXtpZig1PT09cS50YWcpe2lmKG51bGw9PT1tKXttPXE7dHJ5e2U9cS5zdGF0ZU5vZGUsbD8oZj1lLnN0eWxlLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBmLnNldFByb3BlcnR5P2Yuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsXCJub25lXCIsXCJpbXBvcnRhbnRcIik6Zi5kaXNwbGF5PVwibm9uZVwiKTooaD1xLnN0YXRlTm9kZSxrPXEubWVtb2l6ZWRQcm9wcy5zdHlsZSxnPXZvaWQgMCE9PWsmJm51bGwhPT1rJiZrLmhhc093blByb3BlcnR5KFwiZGlzcGxheVwiKT9rLmRpc3BsYXk6bnVsbCxoLnN0eWxlLmRpc3BsYXk9XG5yYihcImRpc3BsYXlcIixnKSl9Y2F0Y2godCl7VyhhLGEucmV0dXJuLHQpfX19ZWxzZSBpZig2PT09cS50YWcpe2lmKG51bGw9PT1tKXRyeXtxLnN0YXRlTm9kZS5ub2RlVmFsdWU9bD9cIlwiOnEubWVtb2l6ZWRQcm9wc31jYXRjaCh0KXtXKGEsYS5yZXR1cm4sdCl9fWVsc2UgaWYoKDIyIT09cS50YWcmJjIzIT09cS50YWd8fG51bGw9PT1xLm1lbW9pemVkU3RhdGV8fHE9PT1hKSYmbnVsbCE9PXEuY2hpbGQpe3EuY2hpbGQucmV0dXJuPXE7cT1xLmNoaWxkO2NvbnRpbnVlfWlmKHE9PT1hKWJyZWFrIGE7Zm9yKDtudWxsPT09cS5zaWJsaW5nOyl7aWYobnVsbD09PXEucmV0dXJufHxxLnJldHVybj09PWEpYnJlYWsgYTttPT09cSYmKG09bnVsbCk7cT1xLnJldHVybn1tPT09cSYmKG09bnVsbCk7cS5zaWJsaW5nLnJldHVybj1xLnJldHVybjtxPXEuc2libGluZ319YnJlYWs7Y2FzZSAxOTpjayhiLGEpO2VrKGEpO2QmNCYmYWsoYSk7YnJlYWs7Y2FzZSAyMTpicmVhaztkZWZhdWx0OmNrKGIsXG5hKSxlayhhKX19ZnVuY3Rpb24gZWsoYSl7dmFyIGI9YS5mbGFncztpZihiJjIpe3RyeXthOntmb3IodmFyIGM9YS5yZXR1cm47bnVsbCE9PWM7KXtpZihUaihjKSl7dmFyIGQ9YzticmVhayBhfWM9Yy5yZXR1cm59dGhyb3cgRXJyb3IocCgxNjApKTt9c3dpdGNoKGQudGFnKXtjYXNlIDU6dmFyIGU9ZC5zdGF0ZU5vZGU7ZC5mbGFncyYzMiYmKG9iKGUsXCJcIiksZC5mbGFncyY9LTMzKTt2YXIgZj1VaihhKTtXaihhLGYsZSk7YnJlYWs7Y2FzZSAzOmNhc2UgNDp2YXIgZz1kLnN0YXRlTm9kZS5jb250YWluZXJJbmZvLGg9VWooYSk7VmooYSxoLGcpO2JyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IocCgxNjEpKTt9fWNhdGNoKGspe1coYSxhLnJldHVybixrKX1hLmZsYWdzJj0tM31iJjQwOTYmJihhLmZsYWdzJj0tNDA5Nyl9ZnVuY3Rpb24gaGsoYSxiLGMpe1Y9YTtpayhhLGIsYyl9XG5mdW5jdGlvbiBpayhhLGIsYyl7Zm9yKHZhciBkPTAhPT0oYS5tb2RlJjEpO251bGwhPT1WOyl7dmFyIGU9VixmPWUuY2hpbGQ7aWYoMjI9PT1lLnRhZyYmZCl7dmFyIGc9bnVsbCE9PWUubWVtb2l6ZWRTdGF0ZXx8Smo7aWYoIWcpe3ZhciBoPWUuYWx0ZXJuYXRlLGs9bnVsbCE9PWgmJm51bGwhPT1oLm1lbW9pemVkU3RhdGV8fFU7aD1Kajt2YXIgbD1VO0pqPWc7aWYoKFU9aykmJiFsKWZvcihWPWU7bnVsbCE9PVY7KWc9VixrPWcuY2hpbGQsMjI9PT1nLnRhZyYmbnVsbCE9PWcubWVtb2l6ZWRTdGF0ZT9qayhlKTpudWxsIT09az8oay5yZXR1cm49ZyxWPWspOmprKGUpO2Zvcig7bnVsbCE9PWY7KVY9ZixpayhmLGIsYyksZj1mLnNpYmxpbmc7Vj1lO0pqPWg7VT1sfWtrKGEsYixjKX1lbHNlIDAhPT0oZS5zdWJ0cmVlRmxhZ3MmODc3MikmJm51bGwhPT1mPyhmLnJldHVybj1lLFY9Zik6a2soYSxiLGMpfX1cbmZ1bmN0aW9uIGtrKGEpe2Zvcig7bnVsbCE9PVY7KXt2YXIgYj1WO2lmKDAhPT0oYi5mbGFncyY4NzcyKSl7dmFyIGM9Yi5hbHRlcm5hdGU7dHJ5e2lmKDAhPT0oYi5mbGFncyY4NzcyKSlzd2l0Y2goYi50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTU6VXx8UWooNSxiKTticmVhaztjYXNlIDE6dmFyIGQ9Yi5zdGF0ZU5vZGU7aWYoYi5mbGFncyY0JiYhVSlpZihudWxsPT09YylkLmNvbXBvbmVudERpZE1vdW50KCk7ZWxzZXt2YXIgZT1iLmVsZW1lbnRUeXBlPT09Yi50eXBlP2MubWVtb2l6ZWRQcm9wczpDaShiLnR5cGUsYy5tZW1vaXplZFByb3BzKTtkLmNvbXBvbmVudERpZFVwZGF0ZShlLGMubWVtb2l6ZWRTdGF0ZSxkLl9fcmVhY3RJbnRlcm5hbFNuYXBzaG90QmVmb3JlVXBkYXRlKX12YXIgZj1iLnVwZGF0ZVF1ZXVlO251bGwhPT1mJiZzaChiLGYsZCk7YnJlYWs7Y2FzZSAzOnZhciBnPWIudXBkYXRlUXVldWU7aWYobnVsbCE9PWcpe2M9bnVsbDtpZihudWxsIT09Yi5jaGlsZClzd2l0Y2goYi5jaGlsZC50YWcpe2Nhc2UgNTpjPVxuYi5jaGlsZC5zdGF0ZU5vZGU7YnJlYWs7Y2FzZSAxOmM9Yi5jaGlsZC5zdGF0ZU5vZGV9c2goYixnLGMpfWJyZWFrO2Nhc2UgNTp2YXIgaD1iLnN0YXRlTm9kZTtpZihudWxsPT09YyYmYi5mbGFncyY0KXtjPWg7dmFyIGs9Yi5tZW1vaXplZFByb3BzO3N3aXRjaChiLnR5cGUpe2Nhc2UgXCJidXR0b25cIjpjYXNlIFwiaW5wdXRcIjpjYXNlIFwic2VsZWN0XCI6Y2FzZSBcInRleHRhcmVhXCI6ay5hdXRvRm9jdXMmJmMuZm9jdXMoKTticmVhaztjYXNlIFwiaW1nXCI6ay5zcmMmJihjLnNyYz1rLnNyYyl9fWJyZWFrO2Nhc2UgNjpicmVhaztjYXNlIDQ6YnJlYWs7Y2FzZSAxMjpicmVhaztjYXNlIDEzOmlmKG51bGw9PT1iLm1lbW9pemVkU3RhdGUpe3ZhciBsPWIuYWx0ZXJuYXRlO2lmKG51bGwhPT1sKXt2YXIgbT1sLm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PW0pe3ZhciBxPW0uZGVoeWRyYXRlZDtudWxsIT09cSYmYmQocSl9fX1icmVhaztjYXNlIDE5OmNhc2UgMTc6Y2FzZSAyMTpjYXNlIDIyOmNhc2UgMjM6Y2FzZSAyNTpicmVhaztcbmRlZmF1bHQ6dGhyb3cgRXJyb3IocCgxNjMpKTt9VXx8Yi5mbGFncyY1MTImJlJqKGIpfWNhdGNoKHIpe1coYixiLnJldHVybixyKX19aWYoYj09PWEpe1Y9bnVsbDticmVha31jPWIuc2libGluZztpZihudWxsIT09Yyl7Yy5yZXR1cm49Yi5yZXR1cm47Vj1jO2JyZWFrfVY9Yi5yZXR1cm59fWZ1bmN0aW9uIGdrKGEpe2Zvcig7bnVsbCE9PVY7KXt2YXIgYj1WO2lmKGI9PT1hKXtWPW51bGw7YnJlYWt9dmFyIGM9Yi5zaWJsaW5nO2lmKG51bGwhPT1jKXtjLnJldHVybj1iLnJldHVybjtWPWM7YnJlYWt9Vj1iLnJldHVybn19XG5mdW5jdGlvbiBqayhhKXtmb3IoO251bGwhPT1WOyl7dmFyIGI9Vjt0cnl7c3dpdGNoKGIudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE1OnZhciBjPWIucmV0dXJuO3RyeXtRaig0LGIpfWNhdGNoKGspe1coYixjLGspfWJyZWFrO2Nhc2UgMTp2YXIgZD1iLnN0YXRlTm9kZTtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZC5jb21wb25lbnREaWRNb3VudCl7dmFyIGU9Yi5yZXR1cm47dHJ5e2QuY29tcG9uZW50RGlkTW91bnQoKX1jYXRjaChrKXtXKGIsZSxrKX19dmFyIGY9Yi5yZXR1cm47dHJ5e1JqKGIpfWNhdGNoKGspe1coYixmLGspfWJyZWFrO2Nhc2UgNTp2YXIgZz1iLnJldHVybjt0cnl7UmooYil9Y2F0Y2goayl7VyhiLGcsayl9fX1jYXRjaChrKXtXKGIsYi5yZXR1cm4sayl9aWYoYj09PWEpe1Y9bnVsbDticmVha312YXIgaD1iLnNpYmxpbmc7aWYobnVsbCE9PWgpe2gucmV0dXJuPWIucmV0dXJuO1Y9aDticmVha31WPWIucmV0dXJufX1cbnZhciBsaz1NYXRoLmNlaWwsbWs9dWEuUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixuaz11YS5SZWFjdEN1cnJlbnRPd25lcixvaz11YS5SZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxLPTAsUT1udWxsLFk9bnVsbCxaPTAsZmo9MCxlaj1VZigwKSxUPTAscGs9bnVsbCxyaD0wLHFrPTAscms9MCxzaz1udWxsLHRrPW51bGwsZms9MCxHaj1JbmZpbml0eSx1az1udWxsLE9pPSExLFBpPW51bGwsUmk9bnVsbCx2az0hMSx3az1udWxsLHhrPTAseWs9MCx6az1udWxsLEFrPS0xLEJrPTA7ZnVuY3Rpb24gUigpe3JldHVybiAwIT09KEsmNik/QigpOi0xIT09QWs/QWs6QWs9QigpfVxuZnVuY3Rpb24geWkoYSl7aWYoMD09PShhLm1vZGUmMSkpcmV0dXJuIDE7aWYoMCE9PShLJjIpJiYwIT09WilyZXR1cm4gWiYtWjtpZihudWxsIT09S2cudHJhbnNpdGlvbilyZXR1cm4gMD09PUJrJiYoQms9eWMoKSksQms7YT1DO2lmKDAhPT1hKXJldHVybiBhO2E9d2luZG93LmV2ZW50O2E9dm9pZCAwPT09YT8xNjpqZChhLnR5cGUpO3JldHVybiBhfWZ1bmN0aW9uIGdpKGEsYixjLGQpe2lmKDUwPHlrKXRocm93IHlrPTAsems9bnVsbCxFcnJvcihwKDE4NSkpO0FjKGEsYyxkKTtpZigwPT09KEsmMil8fGEhPT1RKWE9PT1RJiYoMD09PShLJjIpJiYocWt8PWMpLDQ9PT1UJiZDayhhLFopKSxEayhhLGQpLDE9PT1jJiYwPT09SyYmMD09PShiLm1vZGUmMSkmJihHaj1CKCkrNTAwLGZnJiZqZygpKX1cbmZ1bmN0aW9uIERrKGEsYil7dmFyIGM9YS5jYWxsYmFja05vZGU7d2MoYSxiKTt2YXIgZD11YyhhLGE9PT1RP1o6MCk7aWYoMD09PWQpbnVsbCE9PWMmJmJjKGMpLGEuY2FsbGJhY2tOb2RlPW51bGwsYS5jYWxsYmFja1ByaW9yaXR5PTA7ZWxzZSBpZihiPWQmLWQsYS5jYWxsYmFja1ByaW9yaXR5IT09Yil7bnVsbCE9YyYmYmMoYyk7aWYoMT09PWIpMD09PWEudGFnP2lnKEVrLmJpbmQobnVsbCxhKSk6aGcoRWsuYmluZChudWxsLGEpKSxKZihmdW5jdGlvbigpezA9PT0oSyY2KSYmamcoKX0pLGM9bnVsbDtlbHNle3N3aXRjaChEYyhkKSl7Y2FzZSAxOmM9ZmM7YnJlYWs7Y2FzZSA0OmM9Z2M7YnJlYWs7Y2FzZSAxNjpjPWhjO2JyZWFrO2Nhc2UgNTM2ODcwOTEyOmM9amM7YnJlYWs7ZGVmYXVsdDpjPWhjfWM9RmsoYyxHay5iaW5kKG51bGwsYSkpfWEuY2FsbGJhY2tQcmlvcml0eT1iO2EuY2FsbGJhY2tOb2RlPWN9fVxuZnVuY3Rpb24gR2soYSxiKXtBaz0tMTtCaz0wO2lmKDAhPT0oSyY2KSl0aHJvdyBFcnJvcihwKDMyNykpO3ZhciBjPWEuY2FsbGJhY2tOb2RlO2lmKEhrKCkmJmEuY2FsbGJhY2tOb2RlIT09YylyZXR1cm4gbnVsbDt2YXIgZD11YyhhLGE9PT1RP1o6MCk7aWYoMD09PWQpcmV0dXJuIG51bGw7aWYoMCE9PShkJjMwKXx8MCE9PShkJmEuZXhwaXJlZExhbmVzKXx8YiliPUlrKGEsZCk7ZWxzZXtiPWQ7dmFyIGU9SztLfD0yO3ZhciBmPUprKCk7aWYoUSE9PWF8fFohPT1iKXVrPW51bGwsR2o9QigpKzUwMCxLayhhLGIpO2RvIHRyeXtMaygpO2JyZWFrfWNhdGNoKGgpe01rKGEsaCl9d2hpbGUoMSk7JGcoKTttay5jdXJyZW50PWY7Sz1lO251bGwhPT1ZP2I9MDooUT1udWxsLFo9MCxiPVQpfWlmKDAhPT1iKXsyPT09YiYmKGU9eGMoYSksMCE9PWUmJihkPWUsYj1OayhhLGUpKSk7aWYoMT09PWIpdGhyb3cgYz1wayxLayhhLDApLENrKGEsZCksRGsoYSxCKCkpLGM7aWYoNj09PWIpQ2soYSxkKTtcbmVsc2V7ZT1hLmN1cnJlbnQuYWx0ZXJuYXRlO2lmKDA9PT0oZCYzMCkmJiFPayhlKSYmKGI9SWsoYSxkKSwyPT09YiYmKGY9eGMoYSksMCE9PWYmJihkPWYsYj1OayhhLGYpKSksMT09PWIpKXRocm93IGM9cGssS2soYSwwKSxDayhhLGQpLERrKGEsQigpKSxjO2EuZmluaXNoZWRXb3JrPWU7YS5maW5pc2hlZExhbmVzPWQ7c3dpdGNoKGIpe2Nhc2UgMDpjYXNlIDE6dGhyb3cgRXJyb3IocCgzNDUpKTtjYXNlIDI6UGsoYSx0ayx1ayk7YnJlYWs7Y2FzZSAzOkNrKGEsZCk7aWYoKGQmMTMwMDIzNDI0KT09PWQmJihiPWZrKzUwMC1CKCksMTA8Yikpe2lmKDAhPT11YyhhLDApKWJyZWFrO2U9YS5zdXNwZW5kZWRMYW5lcztpZigoZSZkKSE9PWQpe1IoKTthLnBpbmdlZExhbmVzfD1hLnN1c3BlbmRlZExhbmVzJmU7YnJlYWt9YS50aW1lb3V0SGFuZGxlPUZmKFBrLmJpbmQobnVsbCxhLHRrLHVrKSxiKTticmVha31QayhhLHRrLHVrKTticmVhaztjYXNlIDQ6Q2soYSxkKTtpZigoZCY0MTk0MjQwKT09PVxuZClicmVhaztiPWEuZXZlbnRUaW1lcztmb3IoZT0tMTswPGQ7KXt2YXIgZz0zMS1vYyhkKTtmPTE8PGc7Zz1iW2ddO2c+ZSYmKGU9Zyk7ZCY9fmZ9ZD1lO2Q9QigpLWQ7ZD0oMTIwPmQ/MTIwOjQ4MD5kPzQ4MDoxMDgwPmQ/MTA4MDoxOTIwPmQ/MTkyMDozRTM+ZD8zRTM6NDMyMD5kPzQzMjA6MTk2MCpsayhkLzE5NjApKS1kO2lmKDEwPGQpe2EudGltZW91dEhhbmRsZT1GZihQay5iaW5kKG51bGwsYSx0ayx1ayksZCk7YnJlYWt9UGsoYSx0ayx1ayk7YnJlYWs7Y2FzZSA1OlBrKGEsdGssdWspO2JyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IocCgzMjkpKTt9fX1EayhhLEIoKSk7cmV0dXJuIGEuY2FsbGJhY2tOb2RlPT09Yz9Hay5iaW5kKG51bGwsYSk6bnVsbH1cbmZ1bmN0aW9uIE5rKGEsYil7dmFyIGM9c2s7YS5jdXJyZW50Lm1lbW9pemVkU3RhdGUuaXNEZWh5ZHJhdGVkJiYoS2soYSxiKS5mbGFnc3w9MjU2KTthPUlrKGEsYik7MiE9PWEmJihiPXRrLHRrPWMsbnVsbCE9PWImJkZqKGIpKTtyZXR1cm4gYX1mdW5jdGlvbiBGaihhKXtudWxsPT09dGs/dGs9YTp0ay5wdXNoLmFwcGx5KHRrLGEpfVxuZnVuY3Rpb24gT2soYSl7Zm9yKHZhciBiPWE7Oyl7aWYoYi5mbGFncyYxNjM4NCl7dmFyIGM9Yi51cGRhdGVRdWV1ZTtpZihudWxsIT09YyYmKGM9Yy5zdG9yZXMsbnVsbCE9PWMpKWZvcih2YXIgZD0wO2Q8Yy5sZW5ndGg7ZCsrKXt2YXIgZT1jW2RdLGY9ZS5nZXRTbmFwc2hvdDtlPWUudmFsdWU7dHJ5e2lmKCFIZShmKCksZSkpcmV0dXJuITF9Y2F0Y2goZyl7cmV0dXJuITF9fX1jPWIuY2hpbGQ7aWYoYi5zdWJ0cmVlRmxhZ3MmMTYzODQmJm51bGwhPT1jKWMucmV0dXJuPWIsYj1jO2Vsc2V7aWYoYj09PWEpYnJlYWs7Zm9yKDtudWxsPT09Yi5zaWJsaW5nOyl7aWYobnVsbD09PWIucmV0dXJufHxiLnJldHVybj09PWEpcmV0dXJuITA7Yj1iLnJldHVybn1iLnNpYmxpbmcucmV0dXJuPWIucmV0dXJuO2I9Yi5zaWJsaW5nfX1yZXR1cm4hMH1cbmZ1bmN0aW9uIENrKGEsYil7YiY9fnJrO2ImPX5xazthLnN1c3BlbmRlZExhbmVzfD1iO2EucGluZ2VkTGFuZXMmPX5iO2ZvcihhPWEuZXhwaXJhdGlvblRpbWVzOzA8Yjspe3ZhciBjPTMxLW9jKGIpLGQ9MTw8YzthW2NdPS0xO2ImPX5kfX1mdW5jdGlvbiBFayhhKXtpZigwIT09KEsmNikpdGhyb3cgRXJyb3IocCgzMjcpKTtIaygpO3ZhciBiPXVjKGEsMCk7aWYoMD09PShiJjEpKXJldHVybiBEayhhLEIoKSksbnVsbDt2YXIgYz1JayhhLGIpO2lmKDAhPT1hLnRhZyYmMj09PWMpe3ZhciBkPXhjKGEpOzAhPT1kJiYoYj1kLGM9TmsoYSxkKSl9aWYoMT09PWMpdGhyb3cgYz1wayxLayhhLDApLENrKGEsYiksRGsoYSxCKCkpLGM7aWYoNj09PWMpdGhyb3cgRXJyb3IocCgzNDUpKTthLmZpbmlzaGVkV29yaz1hLmN1cnJlbnQuYWx0ZXJuYXRlO2EuZmluaXNoZWRMYW5lcz1iO1BrKGEsdGssdWspO0RrKGEsQigpKTtyZXR1cm4gbnVsbH1cbmZ1bmN0aW9uIFFrKGEsYil7dmFyIGM9SztLfD0xO3RyeXtyZXR1cm4gYShiKX1maW5hbGx5e0s9YywwPT09SyYmKEdqPUIoKSs1MDAsZmcmJmpnKCkpfX1mdW5jdGlvbiBSayhhKXtudWxsIT09d2smJjA9PT13ay50YWcmJjA9PT0oSyY2KSYmSGsoKTt2YXIgYj1LO0t8PTE7dmFyIGM9b2sudHJhbnNpdGlvbixkPUM7dHJ5e2lmKG9rLnRyYW5zaXRpb249bnVsbCxDPTEsYSlyZXR1cm4gYSgpfWZpbmFsbHl7Qz1kLG9rLnRyYW5zaXRpb249YyxLPWIsMD09PShLJjYpJiZqZygpfX1mdW5jdGlvbiBIaigpe2ZqPWVqLmN1cnJlbnQ7RShlail9XG5mdW5jdGlvbiBLayhhLGIpe2EuZmluaXNoZWRXb3JrPW51bGw7YS5maW5pc2hlZExhbmVzPTA7dmFyIGM9YS50aW1lb3V0SGFuZGxlOy0xIT09YyYmKGEudGltZW91dEhhbmRsZT0tMSxHZihjKSk7aWYobnVsbCE9PVkpZm9yKGM9WS5yZXR1cm47bnVsbCE9PWM7KXt2YXIgZD1jO3dnKGQpO3N3aXRjaChkLnRhZyl7Y2FzZSAxOmQ9ZC50eXBlLmNoaWxkQ29udGV4dFR5cGVzO251bGwhPT1kJiZ2b2lkIDAhPT1kJiYkZigpO2JyZWFrO2Nhc2UgMzp6aCgpO0UoV2YpO0UoSCk7RWgoKTticmVhaztjYXNlIDU6QmgoZCk7YnJlYWs7Y2FzZSA0OnpoKCk7YnJlYWs7Y2FzZSAxMzpFKEwpO2JyZWFrO2Nhc2UgMTk6RShMKTticmVhaztjYXNlIDEwOmFoKGQudHlwZS5fY29udGV4dCk7YnJlYWs7Y2FzZSAyMjpjYXNlIDIzOkhqKCl9Yz1jLnJldHVybn1RPWE7WT1hPVBnKGEuY3VycmVudCxudWxsKTtaPWZqPWI7VD0wO3BrPW51bGw7cms9cWs9cmg9MDt0az1zaz1udWxsO2lmKG51bGwhPT1maCl7Zm9yKGI9XG4wO2I8ZmgubGVuZ3RoO2IrKylpZihjPWZoW2JdLGQ9Yy5pbnRlcmxlYXZlZCxudWxsIT09ZCl7Yy5pbnRlcmxlYXZlZD1udWxsO3ZhciBlPWQubmV4dCxmPWMucGVuZGluZztpZihudWxsIT09Zil7dmFyIGc9Zi5uZXh0O2YubmV4dD1lO2QubmV4dD1nfWMucGVuZGluZz1kfWZoPW51bGx9cmV0dXJuIGF9XG5mdW5jdGlvbiBNayhhLGIpe2Rve3ZhciBjPVk7dHJ5eyRnKCk7RmguY3VycmVudD1SaDtpZihJaCl7Zm9yKHZhciBkPU0ubWVtb2l6ZWRTdGF0ZTtudWxsIT09ZDspe3ZhciBlPWQucXVldWU7bnVsbCE9PWUmJihlLnBlbmRpbmc9bnVsbCk7ZD1kLm5leHR9SWg9ITF9SGg9MDtPPU49TT1udWxsO0poPSExO0toPTA7bmsuY3VycmVudD1udWxsO2lmKG51bGw9PT1jfHxudWxsPT09Yy5yZXR1cm4pe1Q9MTtwaz1iO1k9bnVsbDticmVha31hOnt2YXIgZj1hLGc9Yy5yZXR1cm4saD1jLGs9YjtiPVo7aC5mbGFnc3w9MzI3Njg7aWYobnVsbCE9PWsmJlwib2JqZWN0XCI9PT10eXBlb2YgayYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGsudGhlbil7dmFyIGw9ayxtPWgscT1tLnRhZztpZigwPT09KG0ubW9kZSYxKSYmKDA9PT1xfHwxMT09PXF8fDE1PT09cSkpe3ZhciByPW0uYWx0ZXJuYXRlO3I/KG0udXBkYXRlUXVldWU9ci51cGRhdGVRdWV1ZSxtLm1lbW9pemVkU3RhdGU9ci5tZW1vaXplZFN0YXRlLFxubS5sYW5lcz1yLmxhbmVzKToobS51cGRhdGVRdWV1ZT1udWxsLG0ubWVtb2l6ZWRTdGF0ZT1udWxsKX12YXIgeT1VaShnKTtpZihudWxsIT09eSl7eS5mbGFncyY9LTI1NztWaSh5LGcsaCxmLGIpO3kubW9kZSYxJiZTaShmLGwsYik7Yj15O2s9bDt2YXIgbj1iLnVwZGF0ZVF1ZXVlO2lmKG51bGw9PT1uKXt2YXIgdD1uZXcgU2V0O3QuYWRkKGspO2IudXBkYXRlUXVldWU9dH1lbHNlIG4uYWRkKGspO2JyZWFrIGF9ZWxzZXtpZigwPT09KGImMSkpe1NpKGYsbCxiKTt0aigpO2JyZWFrIGF9az1FcnJvcihwKDQyNikpfX1lbHNlIGlmKEkmJmgubW9kZSYxKXt2YXIgSj1VaShnKTtpZihudWxsIT09Sil7MD09PShKLmZsYWdzJjY1NTM2KSYmKEouZmxhZ3N8PTI1Nik7VmkoSixnLGgsZixiKTtKZyhKaShrLGgpKTticmVhayBhfX1mPWs9SmkoayxoKTs0IT09VCYmKFQ9Mik7bnVsbD09PXNrP3NrPVtmXTpzay5wdXNoKGYpO2Y9Zztkb3tzd2l0Y2goZi50YWcpe2Nhc2UgMzpmLmZsYWdzfD02NTUzNjtcbmImPS1iO2YubGFuZXN8PWI7dmFyIHg9TmkoZixrLGIpO3BoKGYseCk7YnJlYWsgYTtjYXNlIDE6aD1rO3ZhciB3PWYudHlwZSx1PWYuc3RhdGVOb2RlO2lmKDA9PT0oZi5mbGFncyYxMjgpJiYoXCJmdW5jdGlvblwiPT09dHlwZW9mIHcuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yfHxudWxsIT09dSYmXCJmdW5jdGlvblwiPT09dHlwZW9mIHUuY29tcG9uZW50RGlkQ2F0Y2gmJihudWxsPT09Uml8fCFSaS5oYXModSkpKSl7Zi5mbGFnc3w9NjU1MzY7YiY9LWI7Zi5sYW5lc3w9Yjt2YXIgRj1RaShmLGgsYik7cGgoZixGKTticmVhayBhfX1mPWYucmV0dXJufXdoaWxlKG51bGwhPT1mKX1TayhjKX1jYXRjaChuYSl7Yj1uYTtZPT09YyYmbnVsbCE9PWMmJihZPWM9Yy5yZXR1cm4pO2NvbnRpbnVlfWJyZWFrfXdoaWxlKDEpfWZ1bmN0aW9uIEprKCl7dmFyIGE9bWsuY3VycmVudDttay5jdXJyZW50PVJoO3JldHVybiBudWxsPT09YT9SaDphfVxuZnVuY3Rpb24gdGooKXtpZigwPT09VHx8Mz09PVR8fDI9PT1UKVQ9NDtudWxsPT09UXx8MD09PShyaCYyNjg0MzU0NTUpJiYwPT09KHFrJjI2ODQzNTQ1NSl8fENrKFEsWil9ZnVuY3Rpb24gSWsoYSxiKXt2YXIgYz1LO0t8PTI7dmFyIGQ9SmsoKTtpZihRIT09YXx8WiE9PWIpdWs9bnVsbCxLayhhLGIpO2RvIHRyeXtUaygpO2JyZWFrfWNhdGNoKGUpe01rKGEsZSl9d2hpbGUoMSk7JGcoKTtLPWM7bWsuY3VycmVudD1kO2lmKG51bGwhPT1ZKXRocm93IEVycm9yKHAoMjYxKSk7UT1udWxsO1o9MDtyZXR1cm4gVH1mdW5jdGlvbiBUaygpe2Zvcig7bnVsbCE9PVk7KVVrKFkpfWZ1bmN0aW9uIExrKCl7Zm9yKDtudWxsIT09WSYmIWNjKCk7KVVrKFkpfWZ1bmN0aW9uIFVrKGEpe3ZhciBiPVZrKGEuYWx0ZXJuYXRlLGEsZmopO2EubWVtb2l6ZWRQcm9wcz1hLnBlbmRpbmdQcm9wcztudWxsPT09Yj9TayhhKTpZPWI7bmsuY3VycmVudD1udWxsfVxuZnVuY3Rpb24gU2soYSl7dmFyIGI9YTtkb3t2YXIgYz1iLmFsdGVybmF0ZTthPWIucmV0dXJuO2lmKDA9PT0oYi5mbGFncyYzMjc2OCkpe2lmKGM9RWooYyxiLGZqKSxudWxsIT09Yyl7WT1jO3JldHVybn19ZWxzZXtjPUlqKGMsYik7aWYobnVsbCE9PWMpe2MuZmxhZ3MmPTMyNzY3O1k9YztyZXR1cm59aWYobnVsbCE9PWEpYS5mbGFnc3w9MzI3NjgsYS5zdWJ0cmVlRmxhZ3M9MCxhLmRlbGV0aW9ucz1udWxsO2Vsc2V7VD02O1k9bnVsbDtyZXR1cm59fWI9Yi5zaWJsaW5nO2lmKG51bGwhPT1iKXtZPWI7cmV0dXJufVk9Yj1hfXdoaWxlKG51bGwhPT1iKTswPT09VCYmKFQ9NSl9ZnVuY3Rpb24gUGsoYSxiLGMpe3ZhciBkPUMsZT1vay50cmFuc2l0aW9uO3RyeXtvay50cmFuc2l0aW9uPW51bGwsQz0xLFdrKGEsYixjLGQpfWZpbmFsbHl7b2sudHJhbnNpdGlvbj1lLEM9ZH1yZXR1cm4gbnVsbH1cbmZ1bmN0aW9uIFdrKGEsYixjLGQpe2RvIEhrKCk7d2hpbGUobnVsbCE9PXdrKTtpZigwIT09KEsmNikpdGhyb3cgRXJyb3IocCgzMjcpKTtjPWEuZmluaXNoZWRXb3JrO3ZhciBlPWEuZmluaXNoZWRMYW5lcztpZihudWxsPT09YylyZXR1cm4gbnVsbDthLmZpbmlzaGVkV29yaz1udWxsO2EuZmluaXNoZWRMYW5lcz0wO2lmKGM9PT1hLmN1cnJlbnQpdGhyb3cgRXJyb3IocCgxNzcpKTthLmNhbGxiYWNrTm9kZT1udWxsO2EuY2FsbGJhY2tQcmlvcml0eT0wO3ZhciBmPWMubGFuZXN8Yy5jaGlsZExhbmVzO0JjKGEsZik7YT09PVEmJihZPVE9bnVsbCxaPTApOzA9PT0oYy5zdWJ0cmVlRmxhZ3MmMjA2NCkmJjA9PT0oYy5mbGFncyYyMDY0KXx8dmt8fCh2az0hMCxGayhoYyxmdW5jdGlvbigpe0hrKCk7cmV0dXJuIG51bGx9KSk7Zj0wIT09KGMuZmxhZ3MmMTU5OTApO2lmKDAhPT0oYy5zdWJ0cmVlRmxhZ3MmMTU5OTApfHxmKXtmPW9rLnRyYW5zaXRpb247b2sudHJhbnNpdGlvbj1udWxsO1xudmFyIGc9QztDPTE7dmFyIGg9SztLfD00O25rLmN1cnJlbnQ9bnVsbDtPaihhLGMpO2RrKGMsYSk7T2UoRGYpO2RkPSEhQ2Y7RGY9Q2Y9bnVsbDthLmN1cnJlbnQ9YztoayhjLGEsZSk7ZGMoKTtLPWg7Qz1nO29rLnRyYW5zaXRpb249Zn1lbHNlIGEuY3VycmVudD1jO3ZrJiYodms9ITEsd2s9YSx4az1lKTtmPWEucGVuZGluZ0xhbmVzOzA9PT1mJiYoUmk9bnVsbCk7bWMoYy5zdGF0ZU5vZGUsZCk7RGsoYSxCKCkpO2lmKG51bGwhPT1iKWZvcihkPWEub25SZWNvdmVyYWJsZUVycm9yLGM9MDtjPGIubGVuZ3RoO2MrKyllPWJbY10sZChlLnZhbHVlLHtjb21wb25lbnRTdGFjazplLnN0YWNrLGRpZ2VzdDplLmRpZ2VzdH0pO2lmKE9pKXRocm93IE9pPSExLGE9UGksUGk9bnVsbCxhOzAhPT0oeGsmMSkmJjAhPT1hLnRhZyYmSGsoKTtmPWEucGVuZGluZ0xhbmVzOzAhPT0oZiYxKT9hPT09ems/eWsrKzooeWs9MCx6az1hKTp5az0wO2pnKCk7cmV0dXJuIG51bGx9XG5mdW5jdGlvbiBIaygpe2lmKG51bGwhPT13ayl7dmFyIGE9RGMoeGspLGI9b2sudHJhbnNpdGlvbixjPUM7dHJ5e29rLnRyYW5zaXRpb249bnVsbDtDPTE2PmE/MTY6YTtpZihudWxsPT09d2spdmFyIGQ9ITE7ZWxzZXthPXdrO3drPW51bGw7eGs9MDtpZigwIT09KEsmNikpdGhyb3cgRXJyb3IocCgzMzEpKTt2YXIgZT1LO0t8PTQ7Zm9yKFY9YS5jdXJyZW50O251bGwhPT1WOyl7dmFyIGY9VixnPWYuY2hpbGQ7aWYoMCE9PShWLmZsYWdzJjE2KSl7dmFyIGg9Zi5kZWxldGlvbnM7aWYobnVsbCE9PWgpe2Zvcih2YXIgaz0wO2s8aC5sZW5ndGg7aysrKXt2YXIgbD1oW2tdO2ZvcihWPWw7bnVsbCE9PVY7KXt2YXIgbT1WO3N3aXRjaChtLnRhZyl7Y2FzZSAwOmNhc2UgMTE6Y2FzZSAxNTpQaig4LG0sZil9dmFyIHE9bS5jaGlsZDtpZihudWxsIT09cSlxLnJldHVybj1tLFY9cTtlbHNlIGZvcig7bnVsbCE9PVY7KXttPVY7dmFyIHI9bS5zaWJsaW5nLHk9bS5yZXR1cm47U2oobSk7aWYobT09PVxubCl7Vj1udWxsO2JyZWFrfWlmKG51bGwhPT1yKXtyLnJldHVybj15O1Y9cjticmVha31WPXl9fX12YXIgbj1mLmFsdGVybmF0ZTtpZihudWxsIT09bil7dmFyIHQ9bi5jaGlsZDtpZihudWxsIT09dCl7bi5jaGlsZD1udWxsO2Rve3ZhciBKPXQuc2libGluZzt0LnNpYmxpbmc9bnVsbDt0PUp9d2hpbGUobnVsbCE9PXQpfX1WPWZ9fWlmKDAhPT0oZi5zdWJ0cmVlRmxhZ3MmMjA2NCkmJm51bGwhPT1nKWcucmV0dXJuPWYsVj1nO2Vsc2UgYjpmb3IoO251bGwhPT1WOyl7Zj1WO2lmKDAhPT0oZi5mbGFncyYyMDQ4KSlzd2l0Y2goZi50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTU6UGooOSxmLGYucmV0dXJuKX12YXIgeD1mLnNpYmxpbmc7aWYobnVsbCE9PXgpe3gucmV0dXJuPWYucmV0dXJuO1Y9eDticmVhayBifVY9Zi5yZXR1cm59fXZhciB3PWEuY3VycmVudDtmb3IoVj13O251bGwhPT1WOyl7Zz1WO3ZhciB1PWcuY2hpbGQ7aWYoMCE9PShnLnN1YnRyZWVGbGFncyYyMDY0KSYmbnVsbCE9PVxudSl1LnJldHVybj1nLFY9dTtlbHNlIGI6Zm9yKGc9dztudWxsIT09Vjspe2g9VjtpZigwIT09KGguZmxhZ3MmMjA0OCkpdHJ5e3N3aXRjaChoLnRhZyl7Y2FzZSAwOmNhc2UgMTE6Y2FzZSAxNTpRaig5LGgpfX1jYXRjaChuYSl7VyhoLGgucmV0dXJuLG5hKX1pZihoPT09Zyl7Vj1udWxsO2JyZWFrIGJ9dmFyIEY9aC5zaWJsaW5nO2lmKG51bGwhPT1GKXtGLnJldHVybj1oLnJldHVybjtWPUY7YnJlYWsgYn1WPWgucmV0dXJufX1LPWU7amcoKTtpZihsYyYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGxjLm9uUG9zdENvbW1pdEZpYmVyUm9vdCl0cnl7bGMub25Qb3N0Q29tbWl0RmliZXJSb290KGtjLGEpfWNhdGNoKG5hKXt9ZD0hMH1yZXR1cm4gZH1maW5hbGx5e0M9Yyxvay50cmFuc2l0aW9uPWJ9fXJldHVybiExfWZ1bmN0aW9uIFhrKGEsYixjKXtiPUppKGMsYik7Yj1OaShhLGIsMSk7YT1uaChhLGIsMSk7Yj1SKCk7bnVsbCE9PWEmJihBYyhhLDEsYiksRGsoYSxiKSl9XG5mdW5jdGlvbiBXKGEsYixjKXtpZigzPT09YS50YWcpWGsoYSxhLGMpO2Vsc2UgZm9yKDtudWxsIT09Yjspe2lmKDM9PT1iLnRhZyl7WGsoYixhLGMpO2JyZWFrfWVsc2UgaWYoMT09PWIudGFnKXt2YXIgZD1iLnN0YXRlTm9kZTtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYi50eXBlLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcnx8XCJmdW5jdGlvblwiPT09dHlwZW9mIGQuY29tcG9uZW50RGlkQ2F0Y2gmJihudWxsPT09Uml8fCFSaS5oYXMoZCkpKXthPUppKGMsYSk7YT1RaShiLGEsMSk7Yj1uaChiLGEsMSk7YT1SKCk7bnVsbCE9PWImJihBYyhiLDEsYSksRGsoYixhKSk7YnJlYWt9fWI9Yi5yZXR1cm59fVxuZnVuY3Rpb24gVGkoYSxiLGMpe3ZhciBkPWEucGluZ0NhY2hlO251bGwhPT1kJiZkLmRlbGV0ZShiKTtiPVIoKTthLnBpbmdlZExhbmVzfD1hLnN1c3BlbmRlZExhbmVzJmM7UT09PWEmJihaJmMpPT09YyYmKDQ9PT1UfHwzPT09VCYmKFomMTMwMDIzNDI0KT09PVomJjUwMD5CKCktZms/S2soYSwwKTpya3w9Yyk7RGsoYSxiKX1mdW5jdGlvbiBZayhhLGIpezA9PT1iJiYoMD09PShhLm1vZGUmMSk/Yj0xOihiPXNjLHNjPDw9MSwwPT09KHNjJjEzMDAyMzQyNCkmJihzYz00MTk0MzA0KSkpO3ZhciBjPVIoKTthPWloKGEsYik7bnVsbCE9PWEmJihBYyhhLGIsYyksRGsoYSxjKSl9ZnVuY3Rpb24gdWooYSl7dmFyIGI9YS5tZW1vaXplZFN0YXRlLGM9MDtudWxsIT09YiYmKGM9Yi5yZXRyeUxhbmUpO1lrKGEsYyl9XG5mdW5jdGlvbiBiayhhLGIpe3ZhciBjPTA7c3dpdGNoKGEudGFnKXtjYXNlIDEzOnZhciBkPWEuc3RhdGVOb2RlO3ZhciBlPWEubWVtb2l6ZWRTdGF0ZTtudWxsIT09ZSYmKGM9ZS5yZXRyeUxhbmUpO2JyZWFrO2Nhc2UgMTk6ZD1hLnN0YXRlTm9kZTticmVhaztkZWZhdWx0OnRocm93IEVycm9yKHAoMzE0KSk7fW51bGwhPT1kJiZkLmRlbGV0ZShiKTtZayhhLGMpfXZhciBWaztcblZrPWZ1bmN0aW9uKGEsYixjKXtpZihudWxsIT09YSlpZihhLm1lbW9pemVkUHJvcHMhPT1iLnBlbmRpbmdQcm9wc3x8V2YuY3VycmVudClkaD0hMDtlbHNle2lmKDA9PT0oYS5sYW5lcyZjKSYmMD09PShiLmZsYWdzJjEyOCkpcmV0dXJuIGRoPSExLHlqKGEsYixjKTtkaD0wIT09KGEuZmxhZ3MmMTMxMDcyKT8hMDohMX1lbHNlIGRoPSExLEkmJjAhPT0oYi5mbGFncyYxMDQ4NTc2KSYmdWcoYixuZyxiLmluZGV4KTtiLmxhbmVzPTA7c3dpdGNoKGIudGFnKXtjYXNlIDI6dmFyIGQ9Yi50eXBlO2lqKGEsYik7YT1iLnBlbmRpbmdQcm9wczt2YXIgZT1ZZihiLEguY3VycmVudCk7Y2goYixjKTtlPU5oKG51bGwsYixkLGEsZSxjKTt2YXIgZj1TaCgpO2IuZmxhZ3N8PTE7XCJvYmplY3RcIj09PXR5cGVvZiBlJiZudWxsIT09ZSYmXCJmdW5jdGlvblwiPT09dHlwZW9mIGUucmVuZGVyJiZ2b2lkIDA9PT1lLiQkdHlwZW9mPyhiLnRhZz0xLGIubWVtb2l6ZWRTdGF0ZT1udWxsLGIudXBkYXRlUXVldWU9XG5udWxsLFpmKGQpPyhmPSEwLGNnKGIpKTpmPSExLGIubWVtb2l6ZWRTdGF0ZT1udWxsIT09ZS5zdGF0ZSYmdm9pZCAwIT09ZS5zdGF0ZT9lLnN0YXRlOm51bGwsa2goYiksZS51cGRhdGVyPUVpLGIuc3RhdGVOb2RlPWUsZS5fcmVhY3RJbnRlcm5hbHM9YixJaShiLGQsYSxjKSxiPWpqKG51bGwsYixkLCEwLGYsYykpOihiLnRhZz0wLEkmJmYmJnZnKGIpLFhpKG51bGwsYixlLGMpLGI9Yi5jaGlsZCk7cmV0dXJuIGI7Y2FzZSAxNjpkPWIuZWxlbWVudFR5cGU7YTp7aWooYSxiKTthPWIucGVuZGluZ1Byb3BzO2U9ZC5faW5pdDtkPWUoZC5fcGF5bG9hZCk7Yi50eXBlPWQ7ZT1iLnRhZz1aayhkKTthPUNpKGQsYSk7c3dpdGNoKGUpe2Nhc2UgMDpiPWNqKG51bGwsYixkLGEsYyk7YnJlYWsgYTtjYXNlIDE6Yj1oaihudWxsLGIsZCxhLGMpO2JyZWFrIGE7Y2FzZSAxMTpiPVlpKG51bGwsYixkLGEsYyk7YnJlYWsgYTtjYXNlIDE0OmI9JGkobnVsbCxiLGQsQ2koZC50eXBlLGEpLGMpO2JyZWFrIGF9dGhyb3cgRXJyb3IocCgzMDYsXG5kLFwiXCIpKTt9cmV0dXJuIGI7Y2FzZSAwOnJldHVybiBkPWIudHlwZSxlPWIucGVuZGluZ1Byb3BzLGU9Yi5lbGVtZW50VHlwZT09PWQ/ZTpDaShkLGUpLGNqKGEsYixkLGUsYyk7Y2FzZSAxOnJldHVybiBkPWIudHlwZSxlPWIucGVuZGluZ1Byb3BzLGU9Yi5lbGVtZW50VHlwZT09PWQ/ZTpDaShkLGUpLGhqKGEsYixkLGUsYyk7Y2FzZSAzOmE6e2tqKGIpO2lmKG51bGw9PT1hKXRocm93IEVycm9yKHAoMzg3KSk7ZD1iLnBlbmRpbmdQcm9wcztmPWIubWVtb2l6ZWRTdGF0ZTtlPWYuZWxlbWVudDtsaChhLGIpO3FoKGIsZCxudWxsLGMpO3ZhciBnPWIubWVtb2l6ZWRTdGF0ZTtkPWcuZWxlbWVudDtpZihmLmlzRGVoeWRyYXRlZClpZihmPXtlbGVtZW50OmQsaXNEZWh5ZHJhdGVkOiExLGNhY2hlOmcuY2FjaGUscGVuZGluZ1N1c3BlbnNlQm91bmRhcmllczpnLnBlbmRpbmdTdXNwZW5zZUJvdW5kYXJpZXMsdHJhbnNpdGlvbnM6Zy50cmFuc2l0aW9uc30sYi51cGRhdGVRdWV1ZS5iYXNlU3RhdGU9XG5mLGIubWVtb2l6ZWRTdGF0ZT1mLGIuZmxhZ3MmMjU2KXtlPUppKEVycm9yKHAoNDIzKSksYik7Yj1saihhLGIsZCxjLGUpO2JyZWFrIGF9ZWxzZSBpZihkIT09ZSl7ZT1KaShFcnJvcihwKDQyNCkpLGIpO2I9bGooYSxiLGQsYyxlKTticmVhayBhfWVsc2UgZm9yKHlnPUxmKGIuc3RhdGVOb2RlLmNvbnRhaW5lckluZm8uZmlyc3RDaGlsZCkseGc9YixJPSEwLHpnPW51bGwsYz1WZyhiLG51bGwsZCxjKSxiLmNoaWxkPWM7YzspYy5mbGFncz1jLmZsYWdzJi0zfDQwOTYsYz1jLnNpYmxpbmc7ZWxzZXtJZygpO2lmKGQ9PT1lKXtiPVppKGEsYixjKTticmVhayBhfVhpKGEsYixkLGMpfWI9Yi5jaGlsZH1yZXR1cm4gYjtjYXNlIDU6cmV0dXJuIEFoKGIpLG51bGw9PT1hJiZFZyhiKSxkPWIudHlwZSxlPWIucGVuZGluZ1Byb3BzLGY9bnVsbCE9PWE/YS5tZW1vaXplZFByb3BzOm51bGwsZz1lLmNoaWxkcmVuLEVmKGQsZSk/Zz1udWxsOm51bGwhPT1mJiZFZihkLGYpJiYoYi5mbGFnc3w9MzIpLFxuZ2ooYSxiKSxYaShhLGIsZyxjKSxiLmNoaWxkO2Nhc2UgNjpyZXR1cm4gbnVsbD09PWEmJkVnKGIpLG51bGw7Y2FzZSAxMzpyZXR1cm4gb2ooYSxiLGMpO2Nhc2UgNDpyZXR1cm4geWgoYixiLnN0YXRlTm9kZS5jb250YWluZXJJbmZvKSxkPWIucGVuZGluZ1Byb3BzLG51bGw9PT1hP2IuY2hpbGQ9VWcoYixudWxsLGQsYyk6WGkoYSxiLGQsYyksYi5jaGlsZDtjYXNlIDExOnJldHVybiBkPWIudHlwZSxlPWIucGVuZGluZ1Byb3BzLGU9Yi5lbGVtZW50VHlwZT09PWQ/ZTpDaShkLGUpLFlpKGEsYixkLGUsYyk7Y2FzZSA3OnJldHVybiBYaShhLGIsYi5wZW5kaW5nUHJvcHMsYyksYi5jaGlsZDtjYXNlIDg6cmV0dXJuIFhpKGEsYixiLnBlbmRpbmdQcm9wcy5jaGlsZHJlbixjKSxiLmNoaWxkO2Nhc2UgMTI6cmV0dXJuIFhpKGEsYixiLnBlbmRpbmdQcm9wcy5jaGlsZHJlbixjKSxiLmNoaWxkO2Nhc2UgMTA6YTp7ZD1iLnR5cGUuX2NvbnRleHQ7ZT1iLnBlbmRpbmdQcm9wcztmPWIubWVtb2l6ZWRQcm9wcztcbmc9ZS52YWx1ZTtHKFdnLGQuX2N1cnJlbnRWYWx1ZSk7ZC5fY3VycmVudFZhbHVlPWc7aWYobnVsbCE9PWYpaWYoSGUoZi52YWx1ZSxnKSl7aWYoZi5jaGlsZHJlbj09PWUuY2hpbGRyZW4mJiFXZi5jdXJyZW50KXtiPVppKGEsYixjKTticmVhayBhfX1lbHNlIGZvcihmPWIuY2hpbGQsbnVsbCE9PWYmJihmLnJldHVybj1iKTtudWxsIT09Zjspe3ZhciBoPWYuZGVwZW5kZW5jaWVzO2lmKG51bGwhPT1oKXtnPWYuY2hpbGQ7Zm9yKHZhciBrPWguZmlyc3RDb250ZXh0O251bGwhPT1rOyl7aWYoay5jb250ZXh0PT09ZCl7aWYoMT09PWYudGFnKXtrPW1oKC0xLGMmLWMpO2sudGFnPTI7dmFyIGw9Zi51cGRhdGVRdWV1ZTtpZihudWxsIT09bCl7bD1sLnNoYXJlZDt2YXIgbT1sLnBlbmRpbmc7bnVsbD09PW0/ay5uZXh0PWs6KGsubmV4dD1tLm5leHQsbS5uZXh0PWspO2wucGVuZGluZz1rfX1mLmxhbmVzfD1jO2s9Zi5hbHRlcm5hdGU7bnVsbCE9PWsmJihrLmxhbmVzfD1jKTtiaChmLnJldHVybixcbmMsYik7aC5sYW5lc3w9YzticmVha31rPWsubmV4dH19ZWxzZSBpZigxMD09PWYudGFnKWc9Zi50eXBlPT09Yi50eXBlP251bGw6Zi5jaGlsZDtlbHNlIGlmKDE4PT09Zi50YWcpe2c9Zi5yZXR1cm47aWYobnVsbD09PWcpdGhyb3cgRXJyb3IocCgzNDEpKTtnLmxhbmVzfD1jO2g9Zy5hbHRlcm5hdGU7bnVsbCE9PWgmJihoLmxhbmVzfD1jKTtiaChnLGMsYik7Zz1mLnNpYmxpbmd9ZWxzZSBnPWYuY2hpbGQ7aWYobnVsbCE9PWcpZy5yZXR1cm49ZjtlbHNlIGZvcihnPWY7bnVsbCE9PWc7KXtpZihnPT09Yil7Zz1udWxsO2JyZWFrfWY9Zy5zaWJsaW5nO2lmKG51bGwhPT1mKXtmLnJldHVybj1nLnJldHVybjtnPWY7YnJlYWt9Zz1nLnJldHVybn1mPWd9WGkoYSxiLGUuY2hpbGRyZW4sYyk7Yj1iLmNoaWxkfXJldHVybiBiO2Nhc2UgOTpyZXR1cm4gZT1iLnR5cGUsZD1iLnBlbmRpbmdQcm9wcy5jaGlsZHJlbixjaChiLGMpLGU9ZWgoZSksZD1kKGUpLGIuZmxhZ3N8PTEsWGkoYSxiLGQsYyksXG5iLmNoaWxkO2Nhc2UgMTQ6cmV0dXJuIGQ9Yi50eXBlLGU9Q2koZCxiLnBlbmRpbmdQcm9wcyksZT1DaShkLnR5cGUsZSksJGkoYSxiLGQsZSxjKTtjYXNlIDE1OnJldHVybiBiaihhLGIsYi50eXBlLGIucGVuZGluZ1Byb3BzLGMpO2Nhc2UgMTc6cmV0dXJuIGQ9Yi50eXBlLGU9Yi5wZW5kaW5nUHJvcHMsZT1iLmVsZW1lbnRUeXBlPT09ZD9lOkNpKGQsZSksaWooYSxiKSxiLnRhZz0xLFpmKGQpPyhhPSEwLGNnKGIpKTphPSExLGNoKGIsYyksR2koYixkLGUpLElpKGIsZCxlLGMpLGpqKG51bGwsYixkLCEwLGEsYyk7Y2FzZSAxOTpyZXR1cm4geGooYSxiLGMpO2Nhc2UgMjI6cmV0dXJuIGRqKGEsYixjKX10aHJvdyBFcnJvcihwKDE1NixiLnRhZykpO307ZnVuY3Rpb24gRmsoYSxiKXtyZXR1cm4gYWMoYSxiKX1cbmZ1bmN0aW9uICRrKGEsYixjLGQpe3RoaXMudGFnPWE7dGhpcy5rZXk9Yzt0aGlzLnNpYmxpbmc9dGhpcy5jaGlsZD10aGlzLnJldHVybj10aGlzLnN0YXRlTm9kZT10aGlzLnR5cGU9dGhpcy5lbGVtZW50VHlwZT1udWxsO3RoaXMuaW5kZXg9MDt0aGlzLnJlZj1udWxsO3RoaXMucGVuZGluZ1Byb3BzPWI7dGhpcy5kZXBlbmRlbmNpZXM9dGhpcy5tZW1vaXplZFN0YXRlPXRoaXMudXBkYXRlUXVldWU9dGhpcy5tZW1vaXplZFByb3BzPW51bGw7dGhpcy5tb2RlPWQ7dGhpcy5zdWJ0cmVlRmxhZ3M9dGhpcy5mbGFncz0wO3RoaXMuZGVsZXRpb25zPW51bGw7dGhpcy5jaGlsZExhbmVzPXRoaXMubGFuZXM9MDt0aGlzLmFsdGVybmF0ZT1udWxsfWZ1bmN0aW9uIEJnKGEsYixjLGQpe3JldHVybiBuZXcgJGsoYSxiLGMsZCl9ZnVuY3Rpb24gYWooYSl7YT1hLnByb3RvdHlwZTtyZXR1cm4hKCFhfHwhYS5pc1JlYWN0Q29tcG9uZW50KX1cbmZ1bmN0aW9uIFprKGEpe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhKXJldHVybiBhaihhKT8xOjA7aWYodm9pZCAwIT09YSYmbnVsbCE9PWEpe2E9YS4kJHR5cGVvZjtpZihhPT09RGEpcmV0dXJuIDExO2lmKGE9PT1HYSlyZXR1cm4gMTR9cmV0dXJuIDJ9XG5mdW5jdGlvbiBQZyhhLGIpe3ZhciBjPWEuYWx0ZXJuYXRlO251bGw9PT1jPyhjPUJnKGEudGFnLGIsYS5rZXksYS5tb2RlKSxjLmVsZW1lbnRUeXBlPWEuZWxlbWVudFR5cGUsYy50eXBlPWEudHlwZSxjLnN0YXRlTm9kZT1hLnN0YXRlTm9kZSxjLmFsdGVybmF0ZT1hLGEuYWx0ZXJuYXRlPWMpOihjLnBlbmRpbmdQcm9wcz1iLGMudHlwZT1hLnR5cGUsYy5mbGFncz0wLGMuc3VidHJlZUZsYWdzPTAsYy5kZWxldGlvbnM9bnVsbCk7Yy5mbGFncz1hLmZsYWdzJjE0NjgwMDY0O2MuY2hpbGRMYW5lcz1hLmNoaWxkTGFuZXM7Yy5sYW5lcz1hLmxhbmVzO2MuY2hpbGQ9YS5jaGlsZDtjLm1lbW9pemVkUHJvcHM9YS5tZW1vaXplZFByb3BzO2MubWVtb2l6ZWRTdGF0ZT1hLm1lbW9pemVkU3RhdGU7Yy51cGRhdGVRdWV1ZT1hLnVwZGF0ZVF1ZXVlO2I9YS5kZXBlbmRlbmNpZXM7Yy5kZXBlbmRlbmNpZXM9bnVsbD09PWI/bnVsbDp7bGFuZXM6Yi5sYW5lcyxmaXJzdENvbnRleHQ6Yi5maXJzdENvbnRleHR9O1xuYy5zaWJsaW5nPWEuc2libGluZztjLmluZGV4PWEuaW5kZXg7Yy5yZWY9YS5yZWY7cmV0dXJuIGN9XG5mdW5jdGlvbiBSZyhhLGIsYyxkLGUsZil7dmFyIGc9MjtkPWE7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGEpYWooYSkmJihnPTEpO2Vsc2UgaWYoXCJzdHJpbmdcIj09PXR5cGVvZiBhKWc9NTtlbHNlIGE6c3dpdGNoKGEpe2Nhc2UgeWE6cmV0dXJuIFRnKGMuY2hpbGRyZW4sZSxmLGIpO2Nhc2UgemE6Zz04O2V8PTg7YnJlYWs7Y2FzZSBBYTpyZXR1cm4gYT1CZygxMixjLGIsZXwyKSxhLmVsZW1lbnRUeXBlPUFhLGEubGFuZXM9ZixhO2Nhc2UgRWE6cmV0dXJuIGE9QmcoMTMsYyxiLGUpLGEuZWxlbWVudFR5cGU9RWEsYS5sYW5lcz1mLGE7Y2FzZSBGYTpyZXR1cm4gYT1CZygxOSxjLGIsZSksYS5lbGVtZW50VHlwZT1GYSxhLmxhbmVzPWYsYTtjYXNlIElhOnJldHVybiBwaihjLGUsZixiKTtkZWZhdWx0OmlmKFwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEpc3dpdGNoKGEuJCR0eXBlb2Ype2Nhc2UgQmE6Zz0xMDticmVhayBhO2Nhc2UgQ2E6Zz05O2JyZWFrIGE7Y2FzZSBEYTpnPTExO1xuYnJlYWsgYTtjYXNlIEdhOmc9MTQ7YnJlYWsgYTtjYXNlIEhhOmc9MTY7ZD1udWxsO2JyZWFrIGF9dGhyb3cgRXJyb3IocCgxMzAsbnVsbD09YT9hOnR5cGVvZiBhLFwiXCIpKTt9Yj1CZyhnLGMsYixlKTtiLmVsZW1lbnRUeXBlPWE7Yi50eXBlPWQ7Yi5sYW5lcz1mO3JldHVybiBifWZ1bmN0aW9uIFRnKGEsYixjLGQpe2E9QmcoNyxhLGQsYik7YS5sYW5lcz1jO3JldHVybiBhfWZ1bmN0aW9uIHBqKGEsYixjLGQpe2E9QmcoMjIsYSxkLGIpO2EuZWxlbWVudFR5cGU9SWE7YS5sYW5lcz1jO2Euc3RhdGVOb2RlPXtpc0hpZGRlbjohMX07cmV0dXJuIGF9ZnVuY3Rpb24gUWcoYSxiLGMpe2E9QmcoNixhLG51bGwsYik7YS5sYW5lcz1jO3JldHVybiBhfVxuZnVuY3Rpb24gU2coYSxiLGMpe2I9QmcoNCxudWxsIT09YS5jaGlsZHJlbj9hLmNoaWxkcmVuOltdLGEua2V5LGIpO2IubGFuZXM9YztiLnN0YXRlTm9kZT17Y29udGFpbmVySW5mbzphLmNvbnRhaW5lckluZm8scGVuZGluZ0NoaWxkcmVuOm51bGwsaW1wbGVtZW50YXRpb246YS5pbXBsZW1lbnRhdGlvbn07cmV0dXJuIGJ9XG5mdW5jdGlvbiBhbChhLGIsYyxkLGUpe3RoaXMudGFnPWI7dGhpcy5jb250YWluZXJJbmZvPWE7dGhpcy5maW5pc2hlZFdvcms9dGhpcy5waW5nQ2FjaGU9dGhpcy5jdXJyZW50PXRoaXMucGVuZGluZ0NoaWxkcmVuPW51bGw7dGhpcy50aW1lb3V0SGFuZGxlPS0xO3RoaXMuY2FsbGJhY2tOb2RlPXRoaXMucGVuZGluZ0NvbnRleHQ9dGhpcy5jb250ZXh0PW51bGw7dGhpcy5jYWxsYmFja1ByaW9yaXR5PTA7dGhpcy5ldmVudFRpbWVzPXpjKDApO3RoaXMuZXhwaXJhdGlvblRpbWVzPXpjKC0xKTt0aGlzLmVudGFuZ2xlZExhbmVzPXRoaXMuZmluaXNoZWRMYW5lcz10aGlzLm11dGFibGVSZWFkTGFuZXM9dGhpcy5leHBpcmVkTGFuZXM9dGhpcy5waW5nZWRMYW5lcz10aGlzLnN1c3BlbmRlZExhbmVzPXRoaXMucGVuZGluZ0xhbmVzPTA7dGhpcy5lbnRhbmdsZW1lbnRzPXpjKDApO3RoaXMuaWRlbnRpZmllclByZWZpeD1kO3RoaXMub25SZWNvdmVyYWJsZUVycm9yPWU7dGhpcy5tdXRhYmxlU291cmNlRWFnZXJIeWRyYXRpb25EYXRhPVxubnVsbH1mdW5jdGlvbiBibChhLGIsYyxkLGUsZixnLGgsayl7YT1uZXcgYWwoYSxiLGMsaCxrKTsxPT09Yj8oYj0xLCEwPT09ZiYmKGJ8PTgpKTpiPTA7Zj1CZygzLG51bGwsbnVsbCxiKTthLmN1cnJlbnQ9ZjtmLnN0YXRlTm9kZT1hO2YubWVtb2l6ZWRTdGF0ZT17ZWxlbWVudDpkLGlzRGVoeWRyYXRlZDpjLGNhY2hlOm51bGwsdHJhbnNpdGlvbnM6bnVsbCxwZW5kaW5nU3VzcGVuc2VCb3VuZGFyaWVzOm51bGx9O2toKGYpO3JldHVybiBhfWZ1bmN0aW9uIGNsKGEsYixjKXt2YXIgZD0zPGFyZ3VtZW50cy5sZW5ndGgmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106bnVsbDtyZXR1cm57JCR0eXBlb2Y6d2Esa2V5Om51bGw9PWQ/bnVsbDpcIlwiK2QsY2hpbGRyZW46YSxjb250YWluZXJJbmZvOmIsaW1wbGVtZW50YXRpb246Y319XG5mdW5jdGlvbiBkbChhKXtpZighYSlyZXR1cm4gVmY7YT1hLl9yZWFjdEludGVybmFsczthOntpZihWYihhKSE9PWF8fDEhPT1hLnRhZyl0aHJvdyBFcnJvcihwKDE3MCkpO3ZhciBiPWE7ZG97c3dpdGNoKGIudGFnKXtjYXNlIDM6Yj1iLnN0YXRlTm9kZS5jb250ZXh0O2JyZWFrIGE7Y2FzZSAxOmlmKFpmKGIudHlwZSkpe2I9Yi5zdGF0ZU5vZGUuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNZXJnZWRDaGlsZENvbnRleHQ7YnJlYWsgYX19Yj1iLnJldHVybn13aGlsZShudWxsIT09Yik7dGhyb3cgRXJyb3IocCgxNzEpKTt9aWYoMT09PWEudGFnKXt2YXIgYz1hLnR5cGU7aWYoWmYoYykpcmV0dXJuIGJnKGEsYyxiKX1yZXR1cm4gYn1cbmZ1bmN0aW9uIGVsKGEsYixjLGQsZSxmLGcsaCxrKXthPWJsKGMsZCwhMCxhLGUsZixnLGgsayk7YS5jb250ZXh0PWRsKG51bGwpO2M9YS5jdXJyZW50O2Q9UigpO2U9eWkoYyk7Zj1taChkLGUpO2YuY2FsbGJhY2s9dm9pZCAwIT09YiYmbnVsbCE9PWI/YjpudWxsO25oKGMsZixlKTthLmN1cnJlbnQubGFuZXM9ZTtBYyhhLGUsZCk7RGsoYSxkKTtyZXR1cm4gYX1mdW5jdGlvbiBmbChhLGIsYyxkKXt2YXIgZT1iLmN1cnJlbnQsZj1SKCksZz15aShlKTtjPWRsKGMpO251bGw9PT1iLmNvbnRleHQ/Yi5jb250ZXh0PWM6Yi5wZW5kaW5nQ29udGV4dD1jO2I9bWgoZixnKTtiLnBheWxvYWQ9e2VsZW1lbnQ6YX07ZD12b2lkIDA9PT1kP251bGw6ZDtudWxsIT09ZCYmKGIuY2FsbGJhY2s9ZCk7YT1uaChlLGIsZyk7bnVsbCE9PWEmJihnaShhLGUsZyxmKSxvaChhLGUsZykpO3JldHVybiBnfVxuZnVuY3Rpb24gZ2woYSl7YT1hLmN1cnJlbnQ7aWYoIWEuY2hpbGQpcmV0dXJuIG51bGw7c3dpdGNoKGEuY2hpbGQudGFnKXtjYXNlIDU6cmV0dXJuIGEuY2hpbGQuc3RhdGVOb2RlO2RlZmF1bHQ6cmV0dXJuIGEuY2hpbGQuc3RhdGVOb2RlfX1mdW5jdGlvbiBobChhLGIpe2E9YS5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1hJiZudWxsIT09YS5kZWh5ZHJhdGVkKXt2YXIgYz1hLnJldHJ5TGFuZTthLnJldHJ5TGFuZT0wIT09YyYmYzxiP2M6Yn19ZnVuY3Rpb24gaWwoYSxiKXtobChhLGIpOyhhPWEuYWx0ZXJuYXRlKSYmaGwoYSxiKX1mdW5jdGlvbiBqbCgpe3JldHVybiBudWxsfXZhciBrbD1cImZ1bmN0aW9uXCI9PT10eXBlb2YgcmVwb3J0RXJyb3I/cmVwb3J0RXJyb3I6ZnVuY3Rpb24oYSl7Y29uc29sZS5lcnJvcihhKX07ZnVuY3Rpb24gbGwoYSl7dGhpcy5faW50ZXJuYWxSb290PWF9XG5tbC5wcm90b3R5cGUucmVuZGVyPWxsLnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5faW50ZXJuYWxSb290O2lmKG51bGw9PT1iKXRocm93IEVycm9yKHAoNDA5KSk7ZmwoYSxiLG51bGwsbnVsbCl9O21sLnByb3RvdHlwZS51bm1vdW50PWxsLnByb3RvdHlwZS51bm1vdW50PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5faW50ZXJuYWxSb290O2lmKG51bGwhPT1hKXt0aGlzLl9pbnRlcm5hbFJvb3Q9bnVsbDt2YXIgYj1hLmNvbnRhaW5lckluZm87UmsoZnVuY3Rpb24oKXtmbChudWxsLGEsbnVsbCxudWxsKX0pO2JbdWZdPW51bGx9fTtmdW5jdGlvbiBtbChhKXt0aGlzLl9pbnRlcm5hbFJvb3Q9YX1cbm1sLnByb3RvdHlwZS51bnN0YWJsZV9zY2hlZHVsZUh5ZHJhdGlvbj1mdW5jdGlvbihhKXtpZihhKXt2YXIgYj1IYygpO2E9e2Jsb2NrZWRPbjpudWxsLHRhcmdldDphLHByaW9yaXR5OmJ9O2Zvcih2YXIgYz0wO2M8UWMubGVuZ3RoJiYwIT09YiYmYjxRY1tjXS5wcmlvcml0eTtjKyspO1FjLnNwbGljZShjLDAsYSk7MD09PWMmJlZjKGEpfX07ZnVuY3Rpb24gbmwoYSl7cmV0dXJuISghYXx8MSE9PWEubm9kZVR5cGUmJjkhPT1hLm5vZGVUeXBlJiYxMSE9PWEubm9kZVR5cGUpfWZ1bmN0aW9uIG9sKGEpe3JldHVybiEoIWF8fDEhPT1hLm5vZGVUeXBlJiY5IT09YS5ub2RlVHlwZSYmMTEhPT1hLm5vZGVUeXBlJiYoOCE9PWEubm9kZVR5cGV8fFwiIHJlYWN0LW1vdW50LXBvaW50LXVuc3RhYmxlIFwiIT09YS5ub2RlVmFsdWUpKX1mdW5jdGlvbiBwbCgpe31cbmZ1bmN0aW9uIHFsKGEsYixjLGQsZSl7aWYoZSl7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGQpe3ZhciBmPWQ7ZD1mdW5jdGlvbigpe3ZhciBhPWdsKGcpO2YuY2FsbChhKX19dmFyIGc9ZWwoYixkLGEsMCxudWxsLCExLCExLFwiXCIscGwpO2EuX3JlYWN0Um9vdENvbnRhaW5lcj1nO2FbdWZdPWcuY3VycmVudDtzZig4PT09YS5ub2RlVHlwZT9hLnBhcmVudE5vZGU6YSk7UmsoKTtyZXR1cm4gZ31mb3IoO2U9YS5sYXN0Q2hpbGQ7KWEucmVtb3ZlQ2hpbGQoZSk7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGQpe3ZhciBoPWQ7ZD1mdW5jdGlvbigpe3ZhciBhPWdsKGspO2guY2FsbChhKX19dmFyIGs9YmwoYSwwLCExLG51bGwsbnVsbCwhMSwhMSxcIlwiLHBsKTthLl9yZWFjdFJvb3RDb250YWluZXI9azthW3VmXT1rLmN1cnJlbnQ7c2YoOD09PWEubm9kZVR5cGU/YS5wYXJlbnROb2RlOmEpO1JrKGZ1bmN0aW9uKCl7ZmwoYixrLGMsZCl9KTtyZXR1cm4ga31cbmZ1bmN0aW9uIHJsKGEsYixjLGQsZSl7dmFyIGY9Yy5fcmVhY3RSb290Q29udGFpbmVyO2lmKGYpe3ZhciBnPWY7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGUpe3ZhciBoPWU7ZT1mdW5jdGlvbigpe3ZhciBhPWdsKGcpO2guY2FsbChhKX19ZmwoYixnLGEsZSl9ZWxzZSBnPXFsKGMsYixhLGUsZCk7cmV0dXJuIGdsKGcpfUVjPWZ1bmN0aW9uKGEpe3N3aXRjaChhLnRhZyl7Y2FzZSAzOnZhciBiPWEuc3RhdGVOb2RlO2lmKGIuY3VycmVudC5tZW1vaXplZFN0YXRlLmlzRGVoeWRyYXRlZCl7dmFyIGM9dGMoYi5wZW5kaW5nTGFuZXMpOzAhPT1jJiYoQ2MoYixjfDEpLERrKGIsQigpKSwwPT09KEsmNikmJihHaj1CKCkrNTAwLGpnKCkpKX1icmVhaztjYXNlIDEzOlJrKGZ1bmN0aW9uKCl7dmFyIGI9aWgoYSwxKTtpZihudWxsIT09Yil7dmFyIGM9UigpO2dpKGIsYSwxLGMpfX0pLGlsKGEsMSl9fTtcbkZjPWZ1bmN0aW9uKGEpe2lmKDEzPT09YS50YWcpe3ZhciBiPWloKGEsMTM0MjE3NzI4KTtpZihudWxsIT09Yil7dmFyIGM9UigpO2dpKGIsYSwxMzQyMTc3MjgsYyl9aWwoYSwxMzQyMTc3MjgpfX07R2M9ZnVuY3Rpb24oYSl7aWYoMTM9PT1hLnRhZyl7dmFyIGI9eWkoYSksYz1paChhLGIpO2lmKG51bGwhPT1jKXt2YXIgZD1SKCk7Z2koYyxhLGIsZCl9aWwoYSxiKX19O0hjPWZ1bmN0aW9uKCl7cmV0dXJuIEN9O0ljPWZ1bmN0aW9uKGEsYil7dmFyIGM9Qzt0cnl7cmV0dXJuIEM9YSxiKCl9ZmluYWxseXtDPWN9fTtcbnliPWZ1bmN0aW9uKGEsYixjKXtzd2l0Y2goYil7Y2FzZSBcImlucHV0XCI6YmIoYSxjKTtiPWMubmFtZTtpZihcInJhZGlvXCI9PT1jLnR5cGUmJm51bGwhPWIpe2ZvcihjPWE7Yy5wYXJlbnROb2RlOyljPWMucGFyZW50Tm9kZTtjPWMucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWU9XCIrSlNPTi5zdHJpbmdpZnkoXCJcIitiKSsnXVt0eXBlPVwicmFkaW9cIl0nKTtmb3IoYj0wO2I8Yy5sZW5ndGg7YisrKXt2YXIgZD1jW2JdO2lmKGQhPT1hJiZkLmZvcm09PT1hLmZvcm0pe3ZhciBlPURiKGQpO2lmKCFlKXRocm93IEVycm9yKHAoOTApKTtXYShkKTtiYihkLGUpfX19YnJlYWs7Y2FzZSBcInRleHRhcmVhXCI6aWIoYSxjKTticmVhaztjYXNlIFwic2VsZWN0XCI6Yj1jLnZhbHVlLG51bGwhPWImJmZiKGEsISFjLm11bHRpcGxlLGIsITEpfX07R2I9UWs7SGI9Ums7XG52YXIgc2w9e3VzaW5nQ2xpZW50RW50cnlQb2ludDohMSxFdmVudHM6W0NiLHVlLERiLEViLEZiLFFrXX0sdGw9e2ZpbmRGaWJlckJ5SG9zdEluc3RhbmNlOldjLGJ1bmRsZVR5cGU6MCx2ZXJzaW9uOlwiMTguMy4xXCIscmVuZGVyZXJQYWNrYWdlTmFtZTpcInJlYWN0LWRvbVwifTtcbnZhciB1bD17YnVuZGxlVHlwZTp0bC5idW5kbGVUeXBlLHZlcnNpb246dGwudmVyc2lvbixyZW5kZXJlclBhY2thZ2VOYW1lOnRsLnJlbmRlcmVyUGFja2FnZU5hbWUscmVuZGVyZXJDb25maWc6dGwucmVuZGVyZXJDb25maWcsb3ZlcnJpZGVIb29rU3RhdGU6bnVsbCxvdmVycmlkZUhvb2tTdGF0ZURlbGV0ZVBhdGg6bnVsbCxvdmVycmlkZUhvb2tTdGF0ZVJlbmFtZVBhdGg6bnVsbCxvdmVycmlkZVByb3BzOm51bGwsb3ZlcnJpZGVQcm9wc0RlbGV0ZVBhdGg6bnVsbCxvdmVycmlkZVByb3BzUmVuYW1lUGF0aDpudWxsLHNldEVycm9ySGFuZGxlcjpudWxsLHNldFN1c3BlbnNlSGFuZGxlcjpudWxsLHNjaGVkdWxlVXBkYXRlOm51bGwsY3VycmVudERpc3BhdGNoZXJSZWY6dWEuUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixmaW5kSG9zdEluc3RhbmNlQnlGaWJlcjpmdW5jdGlvbihhKXthPVpiKGEpO3JldHVybiBudWxsPT09YT9udWxsOmEuc3RhdGVOb2RlfSxmaW5kRmliZXJCeUhvc3RJbnN0YW5jZTp0bC5maW5kRmliZXJCeUhvc3RJbnN0YW5jZXx8XG5qbCxmaW5kSG9zdEluc3RhbmNlc0ZvclJlZnJlc2g6bnVsbCxzY2hlZHVsZVJlZnJlc2g6bnVsbCxzY2hlZHVsZVJvb3Q6bnVsbCxzZXRSZWZyZXNoSGFuZGxlcjpudWxsLGdldEN1cnJlbnRGaWJlcjpudWxsLHJlY29uY2lsZXJWZXJzaW9uOlwiMTguMy4xLW5leHQtZjEzMzhmODA4MC0yMDI0MDQyNlwifTtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyl7dmFyIHZsPV9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXztpZighdmwuaXNEaXNhYmxlZCYmdmwuc3VwcG9ydHNGaWJlcil0cnl7a2M9dmwuaW5qZWN0KHVsKSxsYz12bH1jYXRjaChhKXt9fWV4cG9ydHMuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQ9c2w7XG5leHBvcnRzLmNyZWF0ZVBvcnRhbD1mdW5jdGlvbihhLGIpe3ZhciBjPTI8YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTpudWxsO2lmKCFubChiKSl0aHJvdyBFcnJvcihwKDIwMCkpO3JldHVybiBjbChhLGIsbnVsbCxjKX07ZXhwb3J0cy5jcmVhdGVSb290PWZ1bmN0aW9uKGEsYil7aWYoIW5sKGEpKXRocm93IEVycm9yKHAoMjk5KSk7dmFyIGM9ITEsZD1cIlwiLGU9a2w7bnVsbCE9PWImJnZvaWQgMCE9PWImJighMD09PWIudW5zdGFibGVfc3RyaWN0TW9kZSYmKGM9ITApLHZvaWQgMCE9PWIuaWRlbnRpZmllclByZWZpeCYmKGQ9Yi5pZGVudGlmaWVyUHJlZml4KSx2b2lkIDAhPT1iLm9uUmVjb3ZlcmFibGVFcnJvciYmKGU9Yi5vblJlY292ZXJhYmxlRXJyb3IpKTtiPWJsKGEsMSwhMSxudWxsLG51bGwsYywhMSxkLGUpO2FbdWZdPWIuY3VycmVudDtzZig4PT09YS5ub2RlVHlwZT9hLnBhcmVudE5vZGU6YSk7cmV0dXJuIG5ldyBsbChiKX07XG5leHBvcnRzLmZpbmRET01Ob2RlPWZ1bmN0aW9uKGEpe2lmKG51bGw9PWEpcmV0dXJuIG51bGw7aWYoMT09PWEubm9kZVR5cGUpcmV0dXJuIGE7dmFyIGI9YS5fcmVhY3RJbnRlcm5hbHM7aWYodm9pZCAwPT09Yil7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGEucmVuZGVyKXRocm93IEVycm9yKHAoMTg4KSk7YT1PYmplY3Qua2V5cyhhKS5qb2luKFwiLFwiKTt0aHJvdyBFcnJvcihwKDI2OCxhKSk7fWE9WmIoYik7YT1udWxsPT09YT9udWxsOmEuc3RhdGVOb2RlO3JldHVybiBhfTtleHBvcnRzLmZsdXNoU3luYz1mdW5jdGlvbihhKXtyZXR1cm4gUmsoYSl9O2V4cG9ydHMuaHlkcmF0ZT1mdW5jdGlvbihhLGIsYyl7aWYoIW9sKGIpKXRocm93IEVycm9yKHAoMjAwKSk7cmV0dXJuIHJsKG51bGwsYSxiLCEwLGMpfTtcbmV4cG9ydHMuaHlkcmF0ZVJvb3Q9ZnVuY3Rpb24oYSxiLGMpe2lmKCFubChhKSl0aHJvdyBFcnJvcihwKDQwNSkpO3ZhciBkPW51bGwhPWMmJmMuaHlkcmF0ZWRTb3VyY2VzfHxudWxsLGU9ITEsZj1cIlwiLGc9a2w7bnVsbCE9PWMmJnZvaWQgMCE9PWMmJighMD09PWMudW5zdGFibGVfc3RyaWN0TW9kZSYmKGU9ITApLHZvaWQgMCE9PWMuaWRlbnRpZmllclByZWZpeCYmKGY9Yy5pZGVudGlmaWVyUHJlZml4KSx2b2lkIDAhPT1jLm9uUmVjb3ZlcmFibGVFcnJvciYmKGc9Yy5vblJlY292ZXJhYmxlRXJyb3IpKTtiPWVsKGIsbnVsbCxhLDEsbnVsbCE9Yz9jOm51bGwsZSwhMSxmLGcpO2FbdWZdPWIuY3VycmVudDtzZihhKTtpZihkKWZvcihhPTA7YTxkLmxlbmd0aDthKyspYz1kW2FdLGU9Yy5fZ2V0VmVyc2lvbixlPWUoYy5fc291cmNlKSxudWxsPT1iLm11dGFibGVTb3VyY2VFYWdlckh5ZHJhdGlvbkRhdGE/Yi5tdXRhYmxlU291cmNlRWFnZXJIeWRyYXRpb25EYXRhPVtjLGVdOmIubXV0YWJsZVNvdXJjZUVhZ2VySHlkcmF0aW9uRGF0YS5wdXNoKGMsXG5lKTtyZXR1cm4gbmV3IG1sKGIpfTtleHBvcnRzLnJlbmRlcj1mdW5jdGlvbihhLGIsYyl7aWYoIW9sKGIpKXRocm93IEVycm9yKHAoMjAwKSk7cmV0dXJuIHJsKG51bGwsYSxiLCExLGMpfTtleHBvcnRzLnVubW91bnRDb21wb25lbnRBdE5vZGU9ZnVuY3Rpb24oYSl7aWYoIW9sKGEpKXRocm93IEVycm9yKHAoNDApKTtyZXR1cm4gYS5fcmVhY3RSb290Q29udGFpbmVyPyhSayhmdW5jdGlvbigpe3JsKG51bGwsbnVsbCxhLCExLGZ1bmN0aW9uKCl7YS5fcmVhY3RSb290Q29udGFpbmVyPW51bGw7YVt1Zl09bnVsbH0pfSksITApOiExfTtleHBvcnRzLnVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzPVFrO1xuZXhwb3J0cy51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcj1mdW5jdGlvbihhLGIsYyxkKXtpZighb2woYykpdGhyb3cgRXJyb3IocCgyMDApKTtpZihudWxsPT1hfHx2b2lkIDA9PT1hLl9yZWFjdEludGVybmFscyl0aHJvdyBFcnJvcihwKDM4KSk7cmV0dXJuIHJsKGEsYixjLCExLGQpfTtleHBvcnRzLnZlcnNpb249XCIxOC4zLjEtbmV4dC1mMTMzOGY4MDgwLTIwMjQwNDI2XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBleHBvcnRzLmNyZWF0ZVJvb3QgPSBtLmNyZWF0ZVJvb3Q7XG4gIGV4cG9ydHMuaHlkcmF0ZVJvb3QgPSBtLmh5ZHJhdGVSb290O1xufSBlbHNlIHtcbiAgdmFyIGkgPSBtLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEO1xuICBleHBvcnRzLmNyZWF0ZVJvb3QgPSBmdW5jdGlvbihjLCBvKSB7XG4gICAgaS51c2luZ0NsaWVudEVudHJ5UG9pbnQgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gbS5jcmVhdGVSb290KGMsIG8pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgZXhwb3J0cy5oeWRyYXRlUm9vdCA9IGZ1bmN0aW9uKGMsIGgsIG8pIHtcbiAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBtLmh5ZHJhdGVSb290KGMsIGgsIG8pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gY2hlY2tEQ0UoKSB7XG4gIC8qIGdsb2JhbCBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gKi9cbiAgaWYgKFxuICAgIHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gPT09ICd1bmRlZmluZWQnIHx8XG4gICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5jaGVja0RDRSAhPT0gJ2Z1bmN0aW9uJ1xuICApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyBUaGlzIGJyYW5jaCBpcyB1bnJlYWNoYWJsZSBiZWNhdXNlIHRoaXMgZnVuY3Rpb24gaXMgb25seSBjYWxsZWRcbiAgICAvLyBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGNvbmRpdGlvbiBpcyB0cnVlIG9ubHkgaW4gZGV2ZWxvcG1lbnQuXG4gICAgLy8gVGhlcmVmb3JlIGlmIHRoZSBicmFuY2ggaXMgc3RpbGwgaGVyZSwgZGVhZCBjb2RlIGVsaW1pbmF0aW9uIHdhc24ndFxuICAgIC8vIHByb3Blcmx5IGFwcGxpZWQuXG4gICAgLy8gRG9uJ3QgY2hhbmdlIHRoZSBtZXNzYWdlLiBSZWFjdCBEZXZUb29scyByZWxpZXMgb24gaXQuIEFsc28gbWFrZSBzdXJlXG4gICAgLy8gdGhpcyBtZXNzYWdlIGRvZXNuJ3Qgb2NjdXIgZWxzZXdoZXJlIGluIHRoaXMgZnVuY3Rpb24sIG9yIGl0IHdpbGwgY2F1c2VcbiAgICAvLyBhIGZhbHNlIHBvc2l0aXZlLlxuICAgIHRocm93IG5ldyBFcnJvcignXl9eJyk7XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBWZXJpZnkgdGhhdCB0aGUgY29kZSBhYm92ZSBoYXMgYmVlbiBkZWFkIGNvZGUgZWxpbWluYXRlZCAoRENFJ2QpLlxuICAgIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5jaGVja0RDRShjaGVja0RDRSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIERldlRvb2xzIHNob3VsZG4ndCBjcmFzaCBSZWFjdCwgbm8gbWF0dGVyIHdoYXQuXG4gICAgLy8gV2Ugc2hvdWxkIHN0aWxsIHJlcG9ydCBpbiBjYXNlIHdlIGJyZWFrIHRoaXMgY29kZS5cbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH1cbn1cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgLy8gRENFIGNoZWNrIHNob3VsZCBoYXBwZW4gYmVmb3JlIFJlYWN0RE9NIGJ1bmRsZSBleGVjdXRlcyBzbyB0aGF0XG4gIC8vIERldlRvb2xzIGNhbiByZXBvcnQgYmFkIG1pbmlmaWNhdGlvbiBkdXJpbmcgaW5qZWN0aW9uLlxuICBjaGVja0RDRSgpO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWRvbS5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1kb20uZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qKlxuICogQGxpY2Vuc2UgUmVhY3RcbiAqIHJlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbid1c2Ugc3RyaWN0Jzt2YXIgZj1yZXF1aXJlKFwicmVhY3RcIiksaz1TeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKSxsPVN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSxtPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksbj1mLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVELlJlYWN0Q3VycmVudE93bmVyLHA9e2tleTohMCxyZWY6ITAsX19zZWxmOiEwLF9fc291cmNlOiEwfTtcbmZ1bmN0aW9uIHEoYyxhLGcpe3ZhciBiLGQ9e30sZT1udWxsLGg9bnVsbDt2b2lkIDAhPT1nJiYoZT1cIlwiK2cpO3ZvaWQgMCE9PWEua2V5JiYoZT1cIlwiK2Eua2V5KTt2b2lkIDAhPT1hLnJlZiYmKGg9YS5yZWYpO2ZvcihiIGluIGEpbS5jYWxsKGEsYikmJiFwLmhhc093blByb3BlcnR5KGIpJiYoZFtiXT1hW2JdKTtpZihjJiZjLmRlZmF1bHRQcm9wcylmb3IoYiBpbiBhPWMuZGVmYXVsdFByb3BzLGEpdm9pZCAwPT09ZFtiXSYmKGRbYl09YVtiXSk7cmV0dXJueyQkdHlwZW9mOmssdHlwZTpjLGtleTplLHJlZjpoLHByb3BzOmQsX293bmVyOm4uY3VycmVudH19ZXhwb3J0cy5GcmFnbWVudD1sO2V4cG9ydHMuanN4PXE7ZXhwb3J0cy5qc3hzPXE7XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC5wcm9kdWN0aW9uLm1pbi5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG4ndXNlIHN0cmljdCc7dmFyIGw9U3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIiksbj1TeW1ib2wuZm9yKFwicmVhY3QucG9ydGFsXCIpLHA9U3ltYm9sLmZvcihcInJlYWN0LmZyYWdtZW50XCIpLHE9U3ltYm9sLmZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpLHI9U3ltYm9sLmZvcihcInJlYWN0LnByb2ZpbGVyXCIpLHQ9U3ltYm9sLmZvcihcInJlYWN0LnByb3ZpZGVyXCIpLHU9U3ltYm9sLmZvcihcInJlYWN0LmNvbnRleHRcIiksdj1TeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIiksdz1TeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VcIikseD1TeW1ib2wuZm9yKFwicmVhY3QubWVtb1wiKSx5PVN5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpLHo9U3ltYm9sLml0ZXJhdG9yO2Z1bmN0aW9uIEEoYSl7aWYobnVsbD09PWF8fFwib2JqZWN0XCIhPT10eXBlb2YgYSlyZXR1cm4gbnVsbDthPXomJmFbel18fGFbXCJAQGl0ZXJhdG9yXCJdO3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBhP2E6bnVsbH1cbnZhciBCPXtpc01vdW50ZWQ6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sZW5xdWV1ZUZvcmNlVXBkYXRlOmZ1bmN0aW9uKCl7fSxlbnF1ZXVlUmVwbGFjZVN0YXRlOmZ1bmN0aW9uKCl7fSxlbnF1ZXVlU2V0U3RhdGU6ZnVuY3Rpb24oKXt9fSxDPU9iamVjdC5hc3NpZ24sRD17fTtmdW5jdGlvbiBFKGEsYixlKXt0aGlzLnByb3BzPWE7dGhpcy5jb250ZXh0PWI7dGhpcy5yZWZzPUQ7dGhpcy51cGRhdGVyPWV8fEJ9RS5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTtcbkUucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKGEsYil7aWYoXCJvYmplY3RcIiE9PXR5cGVvZiBhJiZcImZ1bmN0aW9uXCIhPT10eXBlb2YgYSYmbnVsbCE9YSl0aHJvdyBFcnJvcihcInNldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLlwiKTt0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsYSxiLFwic2V0U3RhdGVcIil9O0UucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKGEpe3RoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcyxhLFwiZm9yY2VVcGRhdGVcIil9O2Z1bmN0aW9uIEYoKXt9Ri5wcm90b3R5cGU9RS5wcm90b3R5cGU7ZnVuY3Rpb24gRyhhLGIsZSl7dGhpcy5wcm9wcz1hO3RoaXMuY29udGV4dD1iO3RoaXMucmVmcz1EO3RoaXMudXBkYXRlcj1lfHxCfXZhciBIPUcucHJvdG90eXBlPW5ldyBGO1xuSC5jb25zdHJ1Y3Rvcj1HO0MoSCxFLnByb3RvdHlwZSk7SC5pc1B1cmVSZWFjdENvbXBvbmVudD0hMDt2YXIgST1BcnJheS5pc0FycmF5LEo9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxLPXtjdXJyZW50Om51bGx9LEw9e2tleTohMCxyZWY6ITAsX19zZWxmOiEwLF9fc291cmNlOiEwfTtcbmZ1bmN0aW9uIE0oYSxiLGUpe3ZhciBkLGM9e30saz1udWxsLGg9bnVsbDtpZihudWxsIT1iKWZvcihkIGluIHZvaWQgMCE9PWIucmVmJiYoaD1iLnJlZiksdm9pZCAwIT09Yi5rZXkmJihrPVwiXCIrYi5rZXkpLGIpSi5jYWxsKGIsZCkmJiFMLmhhc093blByb3BlcnR5KGQpJiYoY1tkXT1iW2RdKTt2YXIgZz1hcmd1bWVudHMubGVuZ3RoLTI7aWYoMT09PWcpYy5jaGlsZHJlbj1lO2Vsc2UgaWYoMTxnKXtmb3IodmFyIGY9QXJyYXkoZyksbT0wO208ZzttKyspZlttXT1hcmd1bWVudHNbbSsyXTtjLmNoaWxkcmVuPWZ9aWYoYSYmYS5kZWZhdWx0UHJvcHMpZm9yKGQgaW4gZz1hLmRlZmF1bHRQcm9wcyxnKXZvaWQgMD09PWNbZF0mJihjW2RdPWdbZF0pO3JldHVybnskJHR5cGVvZjpsLHR5cGU6YSxrZXk6ayxyZWY6aCxwcm9wczpjLF9vd25lcjpLLmN1cnJlbnR9fVxuZnVuY3Rpb24gTihhLGIpe3JldHVybnskJHR5cGVvZjpsLHR5cGU6YS50eXBlLGtleTpiLHJlZjphLnJlZixwcm9wczphLnByb3BzLF9vd25lcjphLl9vd25lcn19ZnVuY3Rpb24gTyhhKXtyZXR1cm5cIm9iamVjdFwiPT09dHlwZW9mIGEmJm51bGwhPT1hJiZhLiQkdHlwZW9mPT09bH1mdW5jdGlvbiBlc2NhcGUoYSl7dmFyIGI9e1wiPVwiOlwiPTBcIixcIjpcIjpcIj0yXCJ9O3JldHVyblwiJFwiK2EucmVwbGFjZSgvWz06XS9nLGZ1bmN0aW9uKGEpe3JldHVybiBiW2FdfSl9dmFyIFA9L1xcLysvZztmdW5jdGlvbiBRKGEsYil7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSYmbnVsbCE9YS5rZXk/ZXNjYXBlKFwiXCIrYS5rZXkpOmIudG9TdHJpbmcoMzYpfVxuZnVuY3Rpb24gUihhLGIsZSxkLGMpe3ZhciBrPXR5cGVvZiBhO2lmKFwidW5kZWZpbmVkXCI9PT1rfHxcImJvb2xlYW5cIj09PWspYT1udWxsO3ZhciBoPSExO2lmKG51bGw9PT1hKWg9ITA7ZWxzZSBzd2l0Y2goayl7Y2FzZSBcInN0cmluZ1wiOmNhc2UgXCJudW1iZXJcIjpoPSEwO2JyZWFrO2Nhc2UgXCJvYmplY3RcIjpzd2l0Y2goYS4kJHR5cGVvZil7Y2FzZSBsOmNhc2UgbjpoPSEwfX1pZihoKXJldHVybiBoPWEsYz1jKGgpLGE9XCJcIj09PWQ/XCIuXCIrUShoLDApOmQsSShjKT8oZT1cIlwiLG51bGwhPWEmJihlPWEucmVwbGFjZShQLFwiJCYvXCIpK1wiL1wiKSxSKGMsYixlLFwiXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KSk6bnVsbCE9YyYmKE8oYykmJihjPU4oYyxlKyghYy5rZXl8fGgmJmgua2V5PT09Yy5rZXk/XCJcIjooXCJcIitjLmtleSkucmVwbGFjZShQLFwiJCYvXCIpK1wiL1wiKSthKSksYi5wdXNoKGMpKSwxO2g9MDtkPVwiXCI9PT1kP1wiLlwiOmQrXCI6XCI7aWYoSShhKSlmb3IodmFyIGc9MDtnPGEubGVuZ3RoO2crKyl7az1cbmFbZ107dmFyIGY9ZCtRKGssZyk7aCs9UihrLGIsZSxmLGMpfWVsc2UgaWYoZj1BKGEpLFwiZnVuY3Rpb25cIj09PXR5cGVvZiBmKWZvcihhPWYuY2FsbChhKSxnPTA7IShrPWEubmV4dCgpKS5kb25lOylrPWsudmFsdWUsZj1kK1EoayxnKyspLGgrPVIoayxiLGUsZixjKTtlbHNlIGlmKFwib2JqZWN0XCI9PT1rKXRocm93IGI9U3RyaW5nKGEpLEVycm9yKFwiT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiBcIisoXCJbb2JqZWN0IE9iamVjdF1cIj09PWI/XCJvYmplY3Qgd2l0aCBrZXlzIHtcIitPYmplY3Qua2V5cyhhKS5qb2luKFwiLCBcIikrXCJ9XCI6YikrXCIpLiBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5IGluc3RlYWQuXCIpO3JldHVybiBofVxuZnVuY3Rpb24gUyhhLGIsZSl7aWYobnVsbD09YSlyZXR1cm4gYTt2YXIgZD1bXSxjPTA7UihhLGQsXCJcIixcIlwiLGZ1bmN0aW9uKGEpe3JldHVybiBiLmNhbGwoZSxhLGMrKyl9KTtyZXR1cm4gZH1mdW5jdGlvbiBUKGEpe2lmKC0xPT09YS5fc3RhdHVzKXt2YXIgYj1hLl9yZXN1bHQ7Yj1iKCk7Yi50aGVuKGZ1bmN0aW9uKGIpe2lmKDA9PT1hLl9zdGF0dXN8fC0xPT09YS5fc3RhdHVzKWEuX3N0YXR1cz0xLGEuX3Jlc3VsdD1ifSxmdW5jdGlvbihiKXtpZigwPT09YS5fc3RhdHVzfHwtMT09PWEuX3N0YXR1cylhLl9zdGF0dXM9MixhLl9yZXN1bHQ9Yn0pOy0xPT09YS5fc3RhdHVzJiYoYS5fc3RhdHVzPTAsYS5fcmVzdWx0PWIpfWlmKDE9PT1hLl9zdGF0dXMpcmV0dXJuIGEuX3Jlc3VsdC5kZWZhdWx0O3Rocm93IGEuX3Jlc3VsdDt9XG52YXIgVT17Y3VycmVudDpudWxsfSxWPXt0cmFuc2l0aW9uOm51bGx9LFc9e1JlYWN0Q3VycmVudERpc3BhdGNoZXI6VSxSZWFjdEN1cnJlbnRCYXRjaENvbmZpZzpWLFJlYWN0Q3VycmVudE93bmVyOkt9O2Z1bmN0aW9uIFgoKXt0aHJvdyBFcnJvcihcImFjdCguLi4pIGlzIG5vdCBzdXBwb3J0ZWQgaW4gcHJvZHVjdGlvbiBidWlsZHMgb2YgUmVhY3QuXCIpO31cbmV4cG9ydHMuQ2hpbGRyZW49e21hcDpTLGZvckVhY2g6ZnVuY3Rpb24oYSxiLGUpe1MoYSxmdW5jdGlvbigpe2IuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxlKX0sY291bnQ6ZnVuY3Rpb24oYSl7dmFyIGI9MDtTKGEsZnVuY3Rpb24oKXtiKyt9KTtyZXR1cm4gYn0sdG9BcnJheTpmdW5jdGlvbihhKXtyZXR1cm4gUyhhLGZ1bmN0aW9uKGEpe3JldHVybiBhfSl8fFtdfSxvbmx5OmZ1bmN0aW9uKGEpe2lmKCFPKGEpKXRocm93IEVycm9yKFwiUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuXCIpO3JldHVybiBhfX07ZXhwb3J0cy5Db21wb25lbnQ9RTtleHBvcnRzLkZyYWdtZW50PXA7ZXhwb3J0cy5Qcm9maWxlcj1yO2V4cG9ydHMuUHVyZUNvbXBvbmVudD1HO2V4cG9ydHMuU3RyaWN0TW9kZT1xO2V4cG9ydHMuU3VzcGVuc2U9dztcbmV4cG9ydHMuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQ9VztleHBvcnRzLmFjdD1YO1xuZXhwb3J0cy5jbG9uZUVsZW1lbnQ9ZnVuY3Rpb24oYSxiLGUpe2lmKG51bGw9PT1hfHx2b2lkIDA9PT1hKXRocm93IEVycm9yKFwiUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IFRoZSBhcmd1bWVudCBtdXN0IGJlIGEgUmVhY3QgZWxlbWVudCwgYnV0IHlvdSBwYXNzZWQgXCIrYStcIi5cIik7dmFyIGQ9Qyh7fSxhLnByb3BzKSxjPWEua2V5LGs9YS5yZWYsaD1hLl9vd25lcjtpZihudWxsIT1iKXt2b2lkIDAhPT1iLnJlZiYmKGs9Yi5yZWYsaD1LLmN1cnJlbnQpO3ZvaWQgMCE9PWIua2V5JiYoYz1cIlwiK2Iua2V5KTtpZihhLnR5cGUmJmEudHlwZS5kZWZhdWx0UHJvcHMpdmFyIGc9YS50eXBlLmRlZmF1bHRQcm9wcztmb3IoZiBpbiBiKUouY2FsbChiLGYpJiYhTC5oYXNPd25Qcm9wZXJ0eShmKSYmKGRbZl09dm9pZCAwPT09YltmXSYmdm9pZCAwIT09Zz9nW2ZdOmJbZl0pfXZhciBmPWFyZ3VtZW50cy5sZW5ndGgtMjtpZigxPT09ZilkLmNoaWxkcmVuPWU7ZWxzZSBpZigxPGYpe2c9QXJyYXkoZik7XG5mb3IodmFyIG09MDttPGY7bSsrKWdbbV09YXJndW1lbnRzW20rMl07ZC5jaGlsZHJlbj1nfXJldHVybnskJHR5cGVvZjpsLHR5cGU6YS50eXBlLGtleTpjLHJlZjprLHByb3BzOmQsX293bmVyOmh9fTtleHBvcnRzLmNyZWF0ZUNvbnRleHQ9ZnVuY3Rpb24oYSl7YT17JCR0eXBlb2Y6dSxfY3VycmVudFZhbHVlOmEsX2N1cnJlbnRWYWx1ZTI6YSxfdGhyZWFkQ291bnQ6MCxQcm92aWRlcjpudWxsLENvbnN1bWVyOm51bGwsX2RlZmF1bHRWYWx1ZTpudWxsLF9nbG9iYWxOYW1lOm51bGx9O2EuUHJvdmlkZXI9eyQkdHlwZW9mOnQsX2NvbnRleHQ6YX07cmV0dXJuIGEuQ29uc3VtZXI9YX07ZXhwb3J0cy5jcmVhdGVFbGVtZW50PU07ZXhwb3J0cy5jcmVhdGVGYWN0b3J5PWZ1bmN0aW9uKGEpe3ZhciBiPU0uYmluZChudWxsLGEpO2IudHlwZT1hO3JldHVybiBifTtleHBvcnRzLmNyZWF0ZVJlZj1mdW5jdGlvbigpe3JldHVybntjdXJyZW50Om51bGx9fTtcbmV4cG9ydHMuZm9yd2FyZFJlZj1mdW5jdGlvbihhKXtyZXR1cm57JCR0eXBlb2Y6dixyZW5kZXI6YX19O2V4cG9ydHMuaXNWYWxpZEVsZW1lbnQ9TztleHBvcnRzLmxhenk9ZnVuY3Rpb24oYSl7cmV0dXJueyQkdHlwZW9mOnksX3BheWxvYWQ6e19zdGF0dXM6LTEsX3Jlc3VsdDphfSxfaW5pdDpUfX07ZXhwb3J0cy5tZW1vPWZ1bmN0aW9uKGEsYil7cmV0dXJueyQkdHlwZW9mOngsdHlwZTphLGNvbXBhcmU6dm9pZCAwPT09Yj9udWxsOmJ9fTtleHBvcnRzLnN0YXJ0VHJhbnNpdGlvbj1mdW5jdGlvbihhKXt2YXIgYj1WLnRyYW5zaXRpb247Vi50cmFuc2l0aW9uPXt9O3RyeXthKCl9ZmluYWxseXtWLnRyYW5zaXRpb249Yn19O2V4cG9ydHMudW5zdGFibGVfYWN0PVg7ZXhwb3J0cy51c2VDYWxsYmFjaz1mdW5jdGlvbihhLGIpe3JldHVybiBVLmN1cnJlbnQudXNlQ2FsbGJhY2soYSxiKX07ZXhwb3J0cy51c2VDb250ZXh0PWZ1bmN0aW9uKGEpe3JldHVybiBVLmN1cnJlbnQudXNlQ29udGV4dChhKX07XG5leHBvcnRzLnVzZURlYnVnVmFsdWU9ZnVuY3Rpb24oKXt9O2V4cG9ydHMudXNlRGVmZXJyZWRWYWx1ZT1mdW5jdGlvbihhKXtyZXR1cm4gVS5jdXJyZW50LnVzZURlZmVycmVkVmFsdWUoYSl9O2V4cG9ydHMudXNlRWZmZWN0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIFUuY3VycmVudC51c2VFZmZlY3QoYSxiKX07ZXhwb3J0cy51c2VJZD1mdW5jdGlvbigpe3JldHVybiBVLmN1cnJlbnQudXNlSWQoKX07ZXhwb3J0cy51c2VJbXBlcmF0aXZlSGFuZGxlPWZ1bmN0aW9uKGEsYixlKXtyZXR1cm4gVS5jdXJyZW50LnVzZUltcGVyYXRpdmVIYW5kbGUoYSxiLGUpfTtleHBvcnRzLnVzZUluc2VydGlvbkVmZmVjdD1mdW5jdGlvbihhLGIpe3JldHVybiBVLmN1cnJlbnQudXNlSW5zZXJ0aW9uRWZmZWN0KGEsYil9O2V4cG9ydHMudXNlTGF5b3V0RWZmZWN0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIFUuY3VycmVudC51c2VMYXlvdXRFZmZlY3QoYSxiKX07XG5leHBvcnRzLnVzZU1lbW89ZnVuY3Rpb24oYSxiKXtyZXR1cm4gVS5jdXJyZW50LnVzZU1lbW8oYSxiKX07ZXhwb3J0cy51c2VSZWR1Y2VyPWZ1bmN0aW9uKGEsYixlKXtyZXR1cm4gVS5jdXJyZW50LnVzZVJlZHVjZXIoYSxiLGUpfTtleHBvcnRzLnVzZVJlZj1mdW5jdGlvbihhKXtyZXR1cm4gVS5jdXJyZW50LnVzZVJlZihhKX07ZXhwb3J0cy51c2VTdGF0ZT1mdW5jdGlvbihhKXtyZXR1cm4gVS5jdXJyZW50LnVzZVN0YXRlKGEpfTtleHBvcnRzLnVzZVN5bmNFeHRlcm5hbFN0b3JlPWZ1bmN0aW9uKGEsYixlKXtyZXR1cm4gVS5jdXJyZW50LnVzZVN5bmNFeHRlcm5hbFN0b3JlKGEsYixlKX07ZXhwb3J0cy51c2VUcmFuc2l0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuIFUuY3VycmVudC51c2VUcmFuc2l0aW9uKCl9O2V4cG9ydHMudmVyc2lvbj1cIjE4LjMuMVwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtanN4LXJ1bnRpbWUucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtanN4LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qKlxuICogQGxpY2Vuc2UgUmVhY3RcbiAqIHNjaGVkdWxlci5wcm9kdWN0aW9uLm1pbi5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG4ndXNlIHN0cmljdCc7ZnVuY3Rpb24gZihhLGIpe3ZhciBjPWEubGVuZ3RoO2EucHVzaChiKTthOmZvcig7MDxjOyl7dmFyIGQ9Yy0xPj4+MSxlPWFbZF07aWYoMDxnKGUsYikpYVtkXT1iLGFbY109ZSxjPWQ7ZWxzZSBicmVhayBhfX1mdW5jdGlvbiBoKGEpe3JldHVybiAwPT09YS5sZW5ndGg/bnVsbDphWzBdfWZ1bmN0aW9uIGsoYSl7aWYoMD09PWEubGVuZ3RoKXJldHVybiBudWxsO3ZhciBiPWFbMF0sYz1hLnBvcCgpO2lmKGMhPT1iKXthWzBdPWM7YTpmb3IodmFyIGQ9MCxlPWEubGVuZ3RoLHc9ZT4+PjE7ZDx3Oyl7dmFyIG09MiooZCsxKS0xLEM9YVttXSxuPW0rMSx4PWFbbl07aWYoMD5nKEMsYykpbjxlJiYwPmcoeCxDKT8oYVtkXT14LGFbbl09YyxkPW4pOihhW2RdPUMsYVttXT1jLGQ9bSk7ZWxzZSBpZihuPGUmJjA+Zyh4LGMpKWFbZF09eCxhW25dPWMsZD1uO2Vsc2UgYnJlYWsgYX19cmV0dXJuIGJ9XG5mdW5jdGlvbiBnKGEsYil7dmFyIGM9YS5zb3J0SW5kZXgtYi5zb3J0SW5kZXg7cmV0dXJuIDAhPT1jP2M6YS5pZC1iLmlkfWlmKFwib2JqZWN0XCI9PT10eXBlb2YgcGVyZm9ybWFuY2UmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiBwZXJmb3JtYW5jZS5ub3cpe3ZhciBsPXBlcmZvcm1hbmNlO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIGwubm93KCl9fWVsc2V7dmFyIHA9RGF0ZSxxPXAubm93KCk7ZXhwb3J0cy51bnN0YWJsZV9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gcC5ub3coKS1xfX12YXIgcj1bXSx0PVtdLHU9MSx2PW51bGwseT0zLHo9ITEsQT0hMSxCPSExLEQ9XCJmdW5jdGlvblwiPT09dHlwZW9mIHNldFRpbWVvdXQ/c2V0VGltZW91dDpudWxsLEU9XCJmdW5jdGlvblwiPT09dHlwZW9mIGNsZWFyVGltZW91dD9jbGVhclRpbWVvdXQ6bnVsbCxGPVwidW5kZWZpbmVkXCIhPT10eXBlb2Ygc2V0SW1tZWRpYXRlP3NldEltbWVkaWF0ZTpudWxsO1xuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJnZvaWQgMCE9PW5hdmlnYXRvci5zY2hlZHVsaW5nJiZ2b2lkIDAhPT1uYXZpZ2F0b3Iuc2NoZWR1bGluZy5pc0lucHV0UGVuZGluZyYmbmF2aWdhdG9yLnNjaGVkdWxpbmcuaXNJbnB1dFBlbmRpbmcuYmluZChuYXZpZ2F0b3Iuc2NoZWR1bGluZyk7ZnVuY3Rpb24gRyhhKXtmb3IodmFyIGI9aCh0KTtudWxsIT09Yjspe2lmKG51bGw9PT1iLmNhbGxiYWNrKWsodCk7ZWxzZSBpZihiLnN0YXJ0VGltZTw9YSlrKHQpLGIuc29ydEluZGV4PWIuZXhwaXJhdGlvblRpbWUsZihyLGIpO2Vsc2UgYnJlYWs7Yj1oKHQpfX1mdW5jdGlvbiBIKGEpe0I9ITE7RyhhKTtpZighQSlpZihudWxsIT09aChyKSlBPSEwLEkoSik7ZWxzZXt2YXIgYj1oKHQpO251bGwhPT1iJiZLKEgsYi5zdGFydFRpbWUtYSl9fVxuZnVuY3Rpb24gSihhLGIpe0E9ITE7QiYmKEI9ITEsRShMKSxMPS0xKTt6PSEwO3ZhciBjPXk7dHJ5e0coYik7Zm9yKHY9aChyKTtudWxsIT09diYmKCEodi5leHBpcmF0aW9uVGltZT5iKXx8YSYmIU0oKSk7KXt2YXIgZD12LmNhbGxiYWNrO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkKXt2LmNhbGxiYWNrPW51bGw7eT12LnByaW9yaXR5TGV2ZWw7dmFyIGU9ZCh2LmV4cGlyYXRpb25UaW1lPD1iKTtiPWV4cG9ydHMudW5zdGFibGVfbm93KCk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGU/di5jYWxsYmFjaz1lOnY9PT1oKHIpJiZrKHIpO0coYil9ZWxzZSBrKHIpO3Y9aChyKX1pZihudWxsIT09dil2YXIgdz0hMDtlbHNle3ZhciBtPWgodCk7bnVsbCE9PW0mJksoSCxtLnN0YXJ0VGltZS1iKTt3PSExfXJldHVybiB3fWZpbmFsbHl7dj1udWxsLHk9Yyx6PSExfX12YXIgTj0hMSxPPW51bGwsTD0tMSxQPTUsUT0tMTtcbmZ1bmN0aW9uIE0oKXtyZXR1cm4gZXhwb3J0cy51bnN0YWJsZV9ub3coKS1RPFA/ITE6ITB9ZnVuY3Rpb24gUigpe2lmKG51bGwhPT1PKXt2YXIgYT1leHBvcnRzLnVuc3RhYmxlX25vdygpO1E9YTt2YXIgYj0hMDt0cnl7Yj1PKCEwLGEpfWZpbmFsbHl7Yj9TKCk6KE49ITEsTz1udWxsKX19ZWxzZSBOPSExfXZhciBTO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBGKVM9ZnVuY3Rpb24oKXtGKFIpfTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgTWVzc2FnZUNoYW5uZWwpe3ZhciBUPW5ldyBNZXNzYWdlQ2hhbm5lbCxVPVQucG9ydDI7VC5wb3J0MS5vbm1lc3NhZ2U9UjtTPWZ1bmN0aW9uKCl7VS5wb3N0TWVzc2FnZShudWxsKX19ZWxzZSBTPWZ1bmN0aW9uKCl7RChSLDApfTtmdW5jdGlvbiBJKGEpe089YTtOfHwoTj0hMCxTKCkpfWZ1bmN0aW9uIEsoYSxiKXtMPUQoZnVuY3Rpb24oKXthKGV4cG9ydHMudW5zdGFibGVfbm93KCkpfSxiKX1cbmV4cG9ydHMudW5zdGFibGVfSWRsZVByaW9yaXR5PTU7ZXhwb3J0cy51bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eT0xO2V4cG9ydHMudW5zdGFibGVfTG93UHJpb3JpdHk9NDtleHBvcnRzLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5PTM7ZXhwb3J0cy51bnN0YWJsZV9Qcm9maWxpbmc9bnVsbDtleHBvcnRzLnVuc3RhYmxlX1VzZXJCbG9ja2luZ1ByaW9yaXR5PTI7ZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjaz1mdW5jdGlvbihhKXthLmNhbGxiYWNrPW51bGx9O2V4cG9ydHMudW5zdGFibGVfY29udGludWVFeGVjdXRpb249ZnVuY3Rpb24oKXtBfHx6fHwoQT0hMCxJKEopKX07XG5leHBvcnRzLnVuc3RhYmxlX2ZvcmNlRnJhbWVSYXRlPWZ1bmN0aW9uKGEpezA+YXx8MTI1PGE/Y29uc29sZS5lcnJvcihcImZvcmNlRnJhbWVSYXRlIHRha2VzIGEgcG9zaXRpdmUgaW50IGJldHdlZW4gMCBhbmQgMTI1LCBmb3JjaW5nIGZyYW1lIHJhdGVzIGhpZ2hlciB0aGFuIDEyNSBmcHMgaXMgbm90IHN1cHBvcnRlZFwiKTpQPTA8YT9NYXRoLmZsb29yKDFFMy9hKTo1fTtleHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsPWZ1bmN0aW9uKCl7cmV0dXJuIHl9O2V4cG9ydHMudW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gaChyKX07ZXhwb3J0cy51bnN0YWJsZV9uZXh0PWZ1bmN0aW9uKGEpe3N3aXRjaCh5KXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzp2YXIgYj0zO2JyZWFrO2RlZmF1bHQ6Yj15fXZhciBjPXk7eT1iO3RyeXtyZXR1cm4gYSgpfWZpbmFsbHl7eT1jfX07ZXhwb3J0cy51bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbj1mdW5jdGlvbigpe307XG5leHBvcnRzLnVuc3RhYmxlX3JlcXVlc3RQYWludD1mdW5jdGlvbigpe307ZXhwb3J0cy51bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHk9ZnVuY3Rpb24oYSxiKXtzd2l0Y2goYSl7Y2FzZSAxOmNhc2UgMjpjYXNlIDM6Y2FzZSA0OmNhc2UgNTpicmVhaztkZWZhdWx0OmE9M312YXIgYz15O3k9YTt0cnl7cmV0dXJuIGIoKX1maW5hbGx5e3k9Y319O1xuZXhwb3J0cy51bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1leHBvcnRzLnVuc3RhYmxlX25vdygpO1wib2JqZWN0XCI9PT10eXBlb2YgYyYmbnVsbCE9PWM/KGM9Yy5kZWxheSxjPVwibnVtYmVyXCI9PT10eXBlb2YgYyYmMDxjP2QrYzpkKTpjPWQ7c3dpdGNoKGEpe2Nhc2UgMTp2YXIgZT0tMTticmVhaztjYXNlIDI6ZT0yNTA7YnJlYWs7Y2FzZSA1OmU9MTA3Mzc0MTgyMzticmVhaztjYXNlIDQ6ZT0xRTQ7YnJlYWs7ZGVmYXVsdDplPTVFM31lPWMrZTthPXtpZDp1KyssY2FsbGJhY2s6Yixwcmlvcml0eUxldmVsOmEsc3RhcnRUaW1lOmMsZXhwaXJhdGlvblRpbWU6ZSxzb3J0SW5kZXg6LTF9O2M+ZD8oYS5zb3J0SW5kZXg9YyxmKHQsYSksbnVsbD09PWgocikmJmE9PT1oKHQpJiYoQj8oRShMKSxMPS0xKTpCPSEwLEsoSCxjLWQpKSk6KGEuc29ydEluZGV4PWUsZihyLGEpLEF8fHp8fChBPSEwLEkoSikpKTtyZXR1cm4gYX07XG5leHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkPU07ZXhwb3J0cy51bnN0YWJsZV93cmFwQ2FsbGJhY2s9ZnVuY3Rpb24oYSl7dmFyIGI9eTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz15O3k9Yjt0cnl7cmV0dXJuIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZpbmFsbHl7eT1jfX19O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBGaWVsZCBkZXRlY3Rpb24gcGF0dGVybnMgZm9yIGF1dG8tZmlsbFxuZXhwb3J0IGNvbnN0IEZJRUxEX1BBVFRFUk5TID0gW1xuICAgIC8vIE5hbWUgZmllbGRzXG4gICAge1xuICAgICAgICB0eXBlOiBcImZpcnN0TmFtZVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcImdpdmVuLW5hbWVcIiwgXCJmaXJzdC1uYW1lXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZmlyc3QuP25hbWUvaSwgL2ZuYW1lL2ksIC9naXZlbi4/bmFtZS9pLCAvZm9yZW5hbWUvaV0sXG4gICAgICAgIGlkUGF0dGVybnM6IFsvZmlyc3QuP25hbWUvaSwgL2ZuYW1lL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2ZpcnN0XFxzKm5hbWUvaSwgL2dpdmVuXFxzKm5hbWUvaSwgL2ZvcmVuYW1lL2ldLFxuICAgICAgICBwbGFjZWhvbGRlclBhdHRlcm5zOiBbL2ZpcnN0XFxzKm5hbWUvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvbGFzdC9pLCAvY29tcGFueS9pLCAvbWlkZGxlL2ksIC9idXNpbmVzcy9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJsYXN0TmFtZVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcImZhbWlseS1uYW1lXCIsIFwibGFzdC1uYW1lXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvbGFzdC4/bmFtZS9pLCAvbG5hbWUvaSwgL3N1cm5hbWUvaSwgL2ZhbWlseS4/bmFtZS9pXSxcbiAgICAgICAgaWRQYXR0ZXJuczogWy9sYXN0Lj9uYW1lL2ksIC9sbmFtZS9pLCAvc3VybmFtZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9sYXN0XFxzKm5hbWUvaSwgL3N1cm5hbWUvaSwgL2ZhbWlseVxccypuYW1lL2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2ZpcnN0L2ksIC9jb21wYW55L2ksIC9idXNpbmVzcy9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJmdWxsTmFtZVwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcIm5hbWVcIl0sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9ebmFtZSQvaSwgL2Z1bGwuP25hbWUvaSwgL3lvdXIuP25hbWUvaSwgL2NhbmRpZGF0ZS4/bmFtZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9ebmFtZSQvaSwgL2Z1bGxcXHMqbmFtZS9pLCAveW91clxccypuYW1lL2ksIC9ebmFtZVxccypcXCovaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9jb21wYW55L2ksXG4gICAgICAgICAgICAvZmlyc3QvaSxcbiAgICAgICAgICAgIC9sYXN0L2ksXG4gICAgICAgICAgICAvdXNlci9pLFxuICAgICAgICAgICAgL2J1c2luZXNzL2ksXG4gICAgICAgICAgICAvam9iL2ksXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAvLyBDb250YWN0IGZpZWxkc1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJlbWFpbFwiLFxuICAgICAgICBhdXRvY29tcGxldGVWYWx1ZXM6IFtcImVtYWlsXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZT8tP21haWwvaSwgL2VtYWlsLj9hZGRyZXNzL2ldLFxuICAgICAgICBpZFBhdHRlcm5zOiBbL2U/LT9tYWlsL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2UtP21haWwvaSwgL2VtYWlsXFxzKmFkZHJlc3MvaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvZS0/bWFpbC9pLCAvQC9dLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcInBob25lXCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1widGVsXCIsIFwidGVsLW5hdGlvbmFsXCIsIFwidGVsLWxvY2FsXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvcGhvbmUvaSwgL21vYmlsZS9pLCAvY2VsbC9pLCAvdGVsKD86ZXBob25lKT8vaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9waG9uZS9pLFxuICAgICAgICAgICAgL21vYmlsZS9pLFxuICAgICAgICAgICAgL2NlbGwvaSxcbiAgICAgICAgICAgIC90ZWxlcGhvbmUvaSxcbiAgICAgICAgICAgIC9jb250YWN0XFxzKm51bWJlci9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImFkZHJlc3NcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJzdHJlZXQtYWRkcmVzc1wiLCBcImFkZHJlc3MtbGluZTFcIl0sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9hZGRyZXNzL2ksIC9zdHJlZXQvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvYWRkcmVzcy9pLCAvc3RyZWV0L2ldLFxuICAgICAgICBuZWdhdGl2ZVBhdHRlcm5zOiBbL2VtYWlsL2ksIC93ZWIvaSwgL3VybC9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJjaXR5XCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wiYWRkcmVzcy1sZXZlbDJcIl0sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jaXR5L2ksIC90b3duL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2NpdHkvaSwgL3Rvd24vaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwic3RhdGVcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJhZGRyZXNzLWxldmVsMVwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3N0YXRlL2ksIC9wcm92aW5jZS9pLCAvcmVnaW9uL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3N0YXRlL2ksIC9wcm92aW5jZS9pLCAvcmVnaW9uL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcInppcENvZGVcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJwb3N0YWwtY29kZVwiXSxcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3ppcC9pLCAvcG9zdGFsL2ksIC9wb3N0Y29kZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy96aXAvaSwgL3Bvc3RhbC9pLCAvcG9zdFxccypjb2RlL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImNvdW50cnlcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJjb3VudHJ5XCIsIFwiY291bnRyeS1uYW1lXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvY291bnRyeS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9jb3VudHJ5L2ldLFxuICAgIH0sXG4gICAgLy8gU29jaWFsL1Byb2Zlc3Npb25hbCBsaW5rc1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJsaW5rZWRpblwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvbGlua2VkaW4vaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvbGlua2VkaW4vaV0sXG4gICAgICAgIHBsYWNlaG9sZGVyUGF0dGVybnM6IFsvbGlua2VkaW5cXC5jb20vaSwgL2xpbmtlZGluL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImdpdGh1YlwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZ2l0aHViL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2dpdGh1Yi9pXSxcbiAgICAgICAgcGxhY2Vob2xkZXJQYXR0ZXJuczogWy9naXRodWJcXC5jb20vaSwgL2dpdGh1Yi9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJ3ZWJzaXRlXCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1widXJsXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvd2Vic2l0ZS9pLCAvcG9ydGZvbGlvL2ksIC9wZXJzb25hbC4/c2l0ZS9pLCAvYmxvZy9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy93ZWJzaXRlL2ksIC9wb3J0Zm9saW8vaSwgL3BlcnNvbmFsXFxzKihzaXRlfHVybCkvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvbGlua2VkaW4vaSwgL2dpdGh1Yi9pLCAvY29tcGFueS9pXSxcbiAgICB9LFxuICAgIC8vIEVtcGxveW1lbnQgZmllbGRzXG4gICAge1xuICAgICAgICB0eXBlOiBcImN1cnJlbnRDb21wYW55XCIsXG4gICAgICAgIGF1dG9jb21wbGV0ZVZhbHVlczogW1wib3JnYW5pemF0aW9uXCJdLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9jdXJyZW50Lj9jb21wYW55L2ksXG4gICAgICAgICAgICAvZW1wbG95ZXIvaSxcbiAgICAgICAgICAgIC9jb21wYW55Lj9uYW1lL2ksXG4gICAgICAgICAgICAvb3JnYW5pemF0aW9uL2ksXG4gICAgICAgIF0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9jdXJyZW50XFxzKihjb21wYW55fGVtcGxveWVyKS9pLFxuICAgICAgICAgICAgL2NvbXBhbnlcXHMqbmFtZS9pLFxuICAgICAgICAgICAgL2VtcGxveWVyL2ksXG4gICAgICAgIF0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvcHJldmlvdXMvaSwgL3Bhc3QvaSwgL2Zvcm1lci9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJjdXJyZW50VGl0bGVcIixcbiAgICAgICAgYXV0b2NvbXBsZXRlVmFsdWVzOiBbXCJvcmdhbml6YXRpb24tdGl0bGVcIl0sXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9jdXJyZW50Lj90aXRsZS9pLCAvam9iLj90aXRsZS9pLCAvcG9zaXRpb24vaSwgL3JvbGUvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvY3VycmVudFxccyoodGl0bGV8cG9zaXRpb258cm9sZSkvaSwgL2pvYlxccyp0aXRsZS9pXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9wcmV2aW91cy9pLCAvcGFzdC9pLCAvZGVzaXJlZC9pLCAvYXBwbHlpbmcvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwieWVhcnNFeHBlcmllbmNlXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy95ZWFycz8uPyhvZik/Lj9leHBlcmllbmNlL2ksIC9leHBlcmllbmNlLj95ZWFycy9pLCAveW9lL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAveWVhcnM/XFxzKihvZlxccyopP2V4cGVyaWVuY2UvaSxcbiAgICAgICAgICAgIC90b3RhbFxccypleHBlcmllbmNlL2ksXG4gICAgICAgICAgICAvaG93XFxzKm1hbnlcXHMqeWVhcnMvaSxcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIC8vIEVkdWNhdGlvbiBmaWVsZHNcbiAgICB7XG4gICAgICAgIHR5cGU6IFwic2Nob29sXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3NjaG9vbC9pLFxuICAgICAgICAgICAgL3VuaXZlcnNpdHkvaSxcbiAgICAgICAgICAgIC9jb2xsZWdlL2ksXG4gICAgICAgICAgICAvaW5zdGl0dXRpb24vaSxcbiAgICAgICAgICAgIC9hbG1hLj9tYXRlci9pLFxuICAgICAgICBdLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3NjaG9vbC9pLCAvdW5pdmVyc2l0eS9pLCAvY29sbGVnZS9pLCAvaW5zdGl0dXRpb24vaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvaGlnaFxccypzY2hvb2wvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZGVncmVlXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9kZWdyZWUvaSwgL3F1YWxpZmljYXRpb24vaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvZGVncmVlL2ksIC9xdWFsaWZpY2F0aW9uL2ksIC9sZXZlbFxccypvZlxccyplZHVjYXRpb24vaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZmllbGRPZlN0dWR5XCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogW1xuICAgICAgICAgICAgL2ZpZWxkLj9vZi4/c3R1ZHkvaSxcbiAgICAgICAgICAgIC9tYWpvci9pLFxuICAgICAgICAgICAgL2NvbmNlbnRyYXRpb24vaSxcbiAgICAgICAgICAgIC9zcGVjaWFsaXphdGlvbi9pLFxuICAgICAgICBdLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2ZpZWxkXFxzKm9mXFxzKnN0dWR5L2ksIC9tYWpvci9pLCAvYXJlYVxccypvZlxccypzdHVkeS9pXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogXCJncmFkdWF0aW9uWWVhclwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZ3JhZHVhdGlvbi4/KHllYXJ8ZGF0ZSkvaSwgL2dyYWQuP3llYXIvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9ncmFkdWF0aW9uXFxzKih5ZWFyfGRhdGUpL2ksXG4gICAgICAgICAgICAveWVhclxccypvZlxccypncmFkdWF0aW9uL2ksXG4gICAgICAgICAgICAvd2hlblxccypkaWRcXHMqeW91XFxzKmdyYWR1YXRlL2ksXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZ3BhXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9ncGEvaSwgL2dyYWRlLj9wb2ludC9pLCAvY2dwYS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9ncGEvaSwgL2dyYWRlXFxzKnBvaW50L2ksIC9jdW11bGF0aXZlXFxzKmdwYS9pXSxcbiAgICB9LFxuICAgIC8vIERvY3VtZW50c1xuICAgIHtcbiAgICAgICAgdHlwZTogXCJyZXN1bWVcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3Jlc3VtZS9pLCAvY3YvaSwgL2N1cnJpY3VsdW0uP3ZpdGFlL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvcmVzdW1lL2ksXG4gICAgICAgICAgICAvY3YvaSxcbiAgICAgICAgICAgIC9jdXJyaWN1bHVtXFxzKnZpdGFlL2ksXG4gICAgICAgICAgICAvdXBsb2FkXFxzKih5b3VyXFxzKik/cmVzdW1lL2ksXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiY292ZXJMZXR0ZXJcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2NvdmVyLj9sZXR0ZXIvaSwgL21vdGl2YXRpb24uP2xldHRlci9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9jb3ZlclxccypsZXR0ZXIvaSwgL21vdGl2YXRpb25cXHMqbGV0dGVyL2ldLFxuICAgIH0sXG4gICAgLy8gQ29tcGVuc2F0aW9uXG4gICAge1xuICAgICAgICB0eXBlOiBcInNhbGFyeVwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvc2FsYXJ5L2ksIC9jb21wZW5zYXRpb24vaSwgL3BheS9pLCAvd2FnZS9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogW1xuICAgICAgICAgICAgL3NhbGFyeS9pLFxuICAgICAgICAgICAgL2NvbXBlbnNhdGlvbi9pLFxuICAgICAgICAgICAgL2V4cGVjdGVkXFxzKihzYWxhcnl8cGF5KS9pLFxuICAgICAgICAgICAgL2Rlc2lyZWRcXHMqc2FsYXJ5L2ksXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAvLyBBdmFpbGFiaWxpdHlcbiAgICB7XG4gICAgICAgIHR5cGU6IFwic3RhcnREYXRlXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9zdGFydC4/ZGF0ZS9pLCAvYXZhaWxhYmxlLj9kYXRlL2ksIC9lYXJsaWVzdC4/c3RhcnQvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9zdGFydFxccypkYXRlL2ksXG4gICAgICAgICAgICAvd2hlblxccypjYW5cXHMqeW91XFxzKnN0YXJ0L2ksXG4gICAgICAgICAgICAvZWFybGllc3RcXHMqc3RhcnQvaSxcbiAgICAgICAgICAgIC9hdmFpbGFiaWxpdHkvaSxcbiAgICAgICAgXSxcbiAgICAgICAgbmVnYXRpdmVQYXR0ZXJuczogWy9lbmQvaSwgL2ZpbmlzaC9pXSxcbiAgICB9LFxuICAgIC8vIExlZ2FsL0NvbXBsaWFuY2VcbiAgICB7XG4gICAgICAgIHR5cGU6IFwid29ya0F1dGhvcml6YXRpb25cIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvd29yay4/YXV0aC9pLFxuICAgICAgICAgICAgL2F1dGhvcml6ZWQuP3RvLj93b3JrL2ksXG4gICAgICAgICAgICAvbGVnYWxseS4/d29yay9pLFxuICAgICAgICAgICAgL3dvcmsuP3Blcm1pdC9pLFxuICAgICAgICAgICAgL3Zpc2EuP3N0YXR1cy9pLFxuICAgICAgICBdLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvYXV0aG9yaXplZFxccyp0b1xccyp3b3JrL2ksXG4gICAgICAgICAgICAvbGVnYWxseVxccyooYXV0aG9yaXplZHxwZXJtaXR0ZWQpL2ksXG4gICAgICAgICAgICAvd29ya1xccyphdXRob3JpemF0aW9uL2ksXG4gICAgICAgICAgICAvcmlnaHRcXHMqdG9cXHMqd29yay9pLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcInNwb25zb3JzaGlwXCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9zcG9uc29yL2ksIC92aXNhLj9zcG9uc29yL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvc3BvbnNvci9pLFxuICAgICAgICAgICAgL3Zpc2FcXHMqc3BvbnNvci9pLFxuICAgICAgICAgICAgL3JlcXVpcmVcXHMqc3BvbnNvcnNoaXAvaSxcbiAgICAgICAgICAgIC9uZWVkXFxzKnNwb25zb3JzaGlwL2ksXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICAvLyBFRU8gZmllbGRzXG4gICAge1xuICAgICAgICB0eXBlOiBcInZldGVyYW5TdGF0dXNcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL3ZldGVyYW4vaSwgL21pbGl0YXJ5L2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL3ZldGVyYW4vaSwgL21pbGl0YXJ5XFxzKnN0YXR1cy9pLCAvc2VydmVkXFxzKmluL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImRpc2FiaWxpdHlcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbL2Rpc2FiaWxpdHkvaSwgL2Rpc2FibGVkL2ldLFxuICAgICAgICBsYWJlbFBhdHRlcm5zOiBbL2Rpc2FiaWxpdHkvaSwgL2Rpc2FibGVkL2ksIC9hY2NvbW1vZGF0aW9uL2ldLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiBcImdlbmRlclwiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvZ2VuZGVyL2ksIC9zZXgvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvZ2VuZGVyL2ksIC9zZXgvaV0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvaWRlbnRpdHkvaV0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6IFwiZXRobmljaXR5XCIsXG4gICAgICAgIG5hbWVQYXR0ZXJuczogWy9ldGhuaWNpdHkvaSwgL3JhY2UvaSwgL2V0aG5pYy9pXSxcbiAgICAgICAgbGFiZWxQYXR0ZXJuczogWy9ldGhuaWNpdHkvaSwgL3JhY2UvaSwgL2V0aG5pY1xccypiYWNrZ3JvdW5kL2ldLFxuICAgIH0sXG4gICAgLy8gU2tpbGxzXG4gICAge1xuICAgICAgICB0eXBlOiBcInNraWxsc1wiLFxuICAgICAgICBuYW1lUGF0dGVybnM6IFsvc2tpbGxzPy9pLCAvZXhwZXJ0aXNlL2ksIC9jb21wZXRlbmMvaV0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFsvc2tpbGxzPy9pLCAvdGVjaG5pY2FsXFxzKnNraWxscy9pLCAva2V5XFxzKnNraWxscy9pXSxcbiAgICB9LFxuICAgIC8vIFN1bW1hcnkvQmlvXG4gICAge1xuICAgICAgICB0eXBlOiBcInN1bW1hcnlcIixcbiAgICAgICAgbmFtZVBhdHRlcm5zOiBbXG4gICAgICAgICAgICAvc3VtbWFyeS9pLFxuICAgICAgICAgICAgL2Jpby9pLFxuICAgICAgICAgICAgL2Fib3V0Lj95b3UvaSxcbiAgICAgICAgICAgIC9wcm9maWxlL2ksXG4gICAgICAgICAgICAvaW50cm9kdWN0aW9uL2ksXG4gICAgICAgIF0sXG4gICAgICAgIGxhYmVsUGF0dGVybnM6IFtcbiAgICAgICAgICAgIC9zdW1tYXJ5L2ksXG4gICAgICAgICAgICAvcHJvZmVzc2lvbmFsXFxzKnN1bW1hcnkvaSxcbiAgICAgICAgICAgIC9hYm91dFxccyp5b3UvaSxcbiAgICAgICAgICAgIC90ZWxsXFxzKnVzXFxzKmFib3V0L2ksXG4gICAgICAgICAgICAvYmlvL2ksXG4gICAgICAgIF0sXG4gICAgICAgIG5lZ2F0aXZlUGF0dGVybnM6IFsvam9iL2ksIC9wb3NpdGlvbi9pXSxcbiAgICB9LFxuXTtcbi8vIEpvYiBzaXRlIFVSTCBwYXR0ZXJucyBmb3Igc2NyYXBlciBkZXRlY3Rpb25cbmV4cG9ydCBjb25zdCBKT0JfU0lURV9QQVRURVJOUyA9IHtcbiAgICBsaW5rZWRpbjogW1xuICAgICAgICAvbGlua2VkaW5cXC5jb21cXC9qb2JzXFwvdmlld1xcLy8sXG4gICAgICAgIC9saW5rZWRpblxcLmNvbVxcL2pvYnNcXC9zZWFyY2gvLFxuICAgICAgICAvbGlua2VkaW5cXC5jb21cXC9qb2JzXFwvY29sbGVjdGlvbnMvLFxuICAgIF0sXG4gICAgaW5kZWVkOiBbXG4gICAgICAgIC9pbmRlZWRcXC5jb21cXC92aWV3am9iLyxcbiAgICAgICAgL2luZGVlZFxcLmNvbVxcL2pvYnMvLFxuICAgICAgICAvaW5kZWVkXFwuY29tXFwvY21wXFwvLitcXC9qb2JzLyxcbiAgICBdLFxuICAgIGdyZWVuaG91c2U6IFsvYm9hcmRzXFwuZ3JlZW5ob3VzZVxcLmlvXFwvLywgL2dyZWVuaG91c2VcXC5pb1xcLy4qXFwvam9ic1xcLy9dLFxuICAgIGxldmVyOiBbL2pvYnNcXC5sZXZlclxcLmNvXFwvLywgL2xldmVyXFwuY29cXC8uKlxcL2pvYnNcXC8vXSxcbiAgICB3YXRlcmxvb1dvcmtzOiBbL3dhdGVybG9vd29ya3NcXC51d2F0ZXJsb29cXC5jYS9dLFxuICAgIHdvcmtkYXk6IFsvbXl3b3JrZGF5am9ic1xcLmNvbS8sIC93b3JrZGF5am9ic1xcLmNvbS9dLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RKb2JTaXRlKHVybCkge1xuICAgIGZvciAoY29uc3QgW3NpdGUsIHBhdHRlcm5zXSBvZiBPYmplY3QuZW50cmllcyhKT0JfU0lURV9QQVRURVJOUykpIHtcbiAgICAgICAgaWYgKHBhdHRlcm5zLnNvbWUoKHApID0+IHAudGVzdCh1cmwpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNpdGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuLy8gQ29tbW9uIHF1ZXN0aW9uIHBhdHRlcm5zIGZvciBsZWFybmluZyBzeXN0ZW1cbmV4cG9ydCBjb25zdCBDVVNUT01fUVVFU1RJT05fSU5ESUNBVE9SUyA9IFtcbiAgICAvd2h5Liood2FudHxpbnRlcmVzdGVkfGFwcGx5fGpvaW4pL2ksXG4gICAgL3doYXQuKihtYWtlc3xhdHRyYWN0ZWR8ZXhjaXRlcykvaSxcbiAgICAvdGVsbC4qYWJvdXQuKnlvdXJzZWxmL2ksXG4gICAgL2Rlc2NyaWJlLiooc2l0dWF0aW9ufHRpbWV8ZXhwZXJpZW5jZSkvaSxcbiAgICAvaG93LipoYW5kbGUvaSxcbiAgICAvZ3JlYXRlc3QuKihzdHJlbmd0aHx3ZWFrbmVzc3xhY2hpZXZlbWVudCkvaSxcbiAgICAvd2hlcmUuKnNlZS4qeW91cnNlbGYvaSxcbiAgICAvd2h5LipzaG91bGQuKmhpcmUvaSxcbiAgICAvd2hhdC4qY29udHJpYnV0ZS9pLFxuICAgIC9zYWxhcnkuKmV4cGVjdGF0aW9uL2ksXG4gICAgL2FkZGl0aW9uYWwuKmluZm9ybWF0aW9uL2ksXG4gICAgL2FueXRoaW5nLiplbHNlL2ksXG5dO1xuIiwiLy8gRmllbGQgZGV0ZWN0aW9uIGZvciBhdXRvLWZpbGxcbmltcG9ydCB7IEZJRUxEX1BBVFRFUk5TLCBDVVNUT01fUVVFU1RJT05fSU5ESUNBVE9SUywgfSBmcm9tIFwiQC9zaGFyZWQvZmllbGQtcGF0dGVybnNcIjtcbmV4cG9ydCBjbGFzcyBGaWVsZERldGVjdG9yIHtcbiAgICBkZXRlY3RGaWVsZHMoZm9ybSkge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXTtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHRleHRhcmVhLCBzZWxlY3RcIik7XG4gICAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgaW5wdXRzKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gaW5wdXQ7XG4gICAgICAgICAgICAvLyBTa2lwIGhpZGRlbiwgZGlzYWJsZWQsIG9yIHN1Ym1pdCBpbnB1dHNcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZFNraXBFbGVtZW50KGVsZW1lbnQpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgZGV0ZWN0aW9uID0gdGhpcy5kZXRlY3RGaWVsZFR5cGUoZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoZGV0ZWN0aW9uLmZpZWxkVHlwZSAhPT0gXCJ1bmtub3duXCIgfHwgZGV0ZWN0aW9uLmNvbmZpZGVuY2UgPiAwLjEpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHMucHVzaChkZXRlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuICAgIHNob3VsZFNraXBFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBlbGVtZW50O1xuICAgICAgICAvLyBDaGVjayBjb21wdXRlZCBzdHlsZSBmb3IgdmlzaWJpbGl0eVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICBpZiAoc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgc3R5bGUudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZGlzYWJsZWQgc3RhdGVcbiAgICAgICAgaWYgKGlucHV0LmRpc2FibGVkKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIC8vIENoZWNrIGlucHV0IHR5cGVcbiAgICAgICAgY29uc3Qgc2tpcFR5cGVzID0gW1wiaGlkZGVuXCIsIFwic3VibWl0XCIsIFwiYnV0dG9uXCIsIFwicmVzZXRcIiwgXCJpbWFnZVwiLCBcImZpbGVcIl07XG4gICAgICAgIGlmIChza2lwVHlwZXMuaW5jbHVkZXMoaW5wdXQudHlwZSkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBhIENTUkYvdG9rZW4gZmllbGRcbiAgICAgICAgaWYgKGlucHV0Lm5hbWU/LmluY2x1ZGVzKFwiY3NyZlwiKSB8fCBpbnB1dC5uYW1lPy5pbmNsdWRlcyhcInRva2VuXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGRldGVjdEZpZWxkVHlwZShlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHNpZ25hbHMgPSB0aGlzLmdhdGhlclNpZ25hbHMoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHNjb3JlcyA9IHRoaXMuc2NvcmVBbGxQYXR0ZXJucyhzaWduYWxzKTtcbiAgICAgICAgLy8gR2V0IGJlc3QgbWF0Y2hcbiAgICAgICAgc2NvcmVzLnNvcnQoKGEsIGIpID0+IGIuY29uZmlkZW5jZSAtIGEuY29uZmlkZW5jZSk7XG4gICAgICAgIGNvbnN0IGJlc3QgPSBzY29yZXNbMF07XG4gICAgICAgIC8vIERldGVybWluZSBpZiB0aGlzIGlzIGEgY3VzdG9tIHF1ZXN0aW9uXG4gICAgICAgIGxldCBmaWVsZFR5cGUgPSBiZXN0Py5maWVsZFR5cGUgfHwgXCJ1bmtub3duXCI7XG4gICAgICAgIGxldCBjb25maWRlbmNlID0gYmVzdD8uY29uZmlkZW5jZSB8fCAwO1xuICAgICAgICBpZiAoY29uZmlkZW5jZSA8IDAuMykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQgbG9va3MgbGlrZSBhIGN1c3RvbSBxdWVzdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMubG9va3NMaWtlQ3VzdG9tUXVlc3Rpb24oc2lnbmFscykpIHtcbiAgICAgICAgICAgICAgICBmaWVsZFR5cGUgPSBcImN1c3RvbVF1ZXN0aW9uXCI7XG4gICAgICAgICAgICAgICAgY29uZmlkZW5jZSA9IDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGZpZWxkVHlwZSxcbiAgICAgICAgICAgIGNvbmZpZGVuY2UsXG4gICAgICAgICAgICBsYWJlbDogc2lnbmFscy5sYWJlbCB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogc2lnbmFscy5wbGFjZWhvbGRlciB8fCB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdhdGhlclNpZ25hbHMoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lPy50b0xvd2VyQ2FzZSgpIHx8IFwiXCIsXG4gICAgICAgICAgICBpZDogZWxlbWVudC5pZD8udG9Mb3dlckNhc2UoKSB8fCBcIlwiLFxuICAgICAgICAgICAgdHlwZTogZWxlbWVudC50eXBlIHx8IFwidGV4dFwiLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGVsZW1lbnQucGxhY2Vob2xkZXI/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZTogZWxlbWVudC5hdXRvY29tcGxldGUgfHwgXCJcIixcbiAgICAgICAgICAgIGxhYmVsOiB0aGlzLmZpbmRMYWJlbChlbGVtZW50KT8udG9Mb3dlckNhc2UoKSB8fCBcIlwiLFxuICAgICAgICAgICAgYXJpYUxhYmVsOiBlbGVtZW50LmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIik/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgICAgIG5lYXJieVRleHQ6IHRoaXMuZ2V0TmVhcmJ5VGV4dChlbGVtZW50KT8udG9Mb3dlckNhc2UoKSB8fCBcIlwiLFxuICAgICAgICAgICAgcGFyZW50Q2xhc3NlczogdGhpcy5nZXRQYXJlbnRDbGFzc2VzKGVsZW1lbnQpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzY29yZUFsbFBhdHRlcm5zKHNpZ25hbHMpIHtcbiAgICAgICAgcmV0dXJuIEZJRUxEX1BBVFRFUk5TLm1hcCgocGF0dGVybikgPT4gKHtcbiAgICAgICAgICAgIGZpZWxkVHlwZTogcGF0dGVybi50eXBlLFxuICAgICAgICAgICAgY29uZmlkZW5jZTogdGhpcy5jYWxjdWxhdGVDb25maWRlbmNlKHNpZ25hbHMsIHBhdHRlcm4pLFxuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGNhbGN1bGF0ZUNvbmZpZGVuY2Uoc2lnbmFscywgcGF0dGVybikge1xuICAgICAgICBsZXQgc2NvcmUgPSAwO1xuICAgICAgICBsZXQgbWF4U2NvcmUgPSAwO1xuICAgICAgICAvLyBXZWlnaHQgZGlmZmVyZW50IHNpZ25hbHNcbiAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IHtcbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZTogMC40LFxuICAgICAgICAgICAgbmFtZTogMC4yLFxuICAgICAgICAgICAgaWQ6IDAuMTUsXG4gICAgICAgICAgICBsYWJlbDogMC4xNSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAwLjEsXG4gICAgICAgICAgICBhcmlhTGFiZWw6IDAuMSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQ2hlY2sgYXV0b2NvbXBsZXRlIGF0dHJpYnV0ZSAobW9zdCByZWxpYWJsZSlcbiAgICAgICAgaWYgKHNpZ25hbHMuYXV0b2NvbXBsZXRlICYmXG4gICAgICAgICAgICBwYXR0ZXJuLmF1dG9jb21wbGV0ZVZhbHVlcz8uaW5jbHVkZXMoc2lnbmFscy5hdXRvY29tcGxldGUpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLmF1dG9jb21wbGV0ZTtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLmF1dG9jb21wbGV0ZTtcbiAgICAgICAgLy8gQ2hlY2sgbmFtZSBhdHRyaWJ1dGVcbiAgICAgICAgaWYgKHBhdHRlcm4ubmFtZVBhdHRlcm5zPy5zb21lKChwKSA9PiBwLnRlc3Qoc2lnbmFscy5uYW1lKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLm5hbWU7XG4gICAgICAgIC8vIENoZWNrIElEXG4gICAgICAgIGlmIChwYXR0ZXJuLmlkUGF0dGVybnM/LnNvbWUoKHApID0+IHAudGVzdChzaWduYWxzLmlkKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgbWF4U2NvcmUgKz0gd2VpZ2h0cy5pZDtcbiAgICAgICAgLy8gQ2hlY2sgbGFiZWxcbiAgICAgICAgaWYgKHBhdHRlcm4ubGFiZWxQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMubGFiZWwpKSkge1xuICAgICAgICAgICAgc2NvcmUgKz0gd2VpZ2h0cy5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBtYXhTY29yZSArPSB3ZWlnaHRzLmxhYmVsO1xuICAgICAgICAvLyBDaGVjayBwbGFjZWhvbGRlclxuICAgICAgICBpZiAocGF0dGVybi5wbGFjZWhvbGRlclBhdHRlcm5zPy5zb21lKChwKSA9PiBwLnRlc3Qoc2lnbmFscy5wbGFjZWhvbGRlcikpKSB7XG4gICAgICAgICAgICBzY29yZSArPSB3ZWlnaHRzLnBsYWNlaG9sZGVyO1xuICAgICAgICB9XG4gICAgICAgIG1heFNjb3JlICs9IHdlaWdodHMucGxhY2Vob2xkZXI7XG4gICAgICAgIC8vIENoZWNrIGFyaWEtbGFiZWxcbiAgICAgICAgaWYgKHBhdHRlcm4ubGFiZWxQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMuYXJpYUxhYmVsKSkpIHtcbiAgICAgICAgICAgIHNjb3JlICs9IHdlaWdodHMuYXJpYUxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIG1heFNjb3JlICs9IHdlaWdodHMuYXJpYUxhYmVsO1xuICAgICAgICAvLyBOZWdhdGl2ZSBzaWduYWxzIChyZWR1Y2UgY29uZmlkZW5jZSBpZiBmb3VuZClcbiAgICAgICAgaWYgKHBhdHRlcm4ubmVnYXRpdmVQYXR0ZXJucz8uc29tZSgocCkgPT4gcC50ZXN0KHNpZ25hbHMubmFtZSkgfHwgcC50ZXN0KHNpZ25hbHMubGFiZWwpIHx8IHAudGVzdChzaWduYWxzLmlkKSkpIHtcbiAgICAgICAgICAgIHNjb3JlIC09IDAuMztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgbWF4U2NvcmUgPiAwID8gc2NvcmUgLyBtYXhTY29yZSA6IDApO1xuICAgIH1cbiAgICBmaW5kTGFiZWwoZWxlbWVudCkge1xuICAgICAgICAvLyBNZXRob2QgMTogRXhwbGljaXQgbGFiZWwgdmlhIGZvciBhdHRyaWJ1dGVcbiAgICAgICAgaWYgKGVsZW1lbnQuaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGFiZWxbZm9yPVwiJHtlbGVtZW50LmlkfVwiXWApO1xuICAgICAgICAgICAgaWYgKGxhYmVsPy50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ldGhvZCAyOiBXcmFwcGluZyBsYWJlbFxuICAgICAgICBjb25zdCBwYXJlbnRMYWJlbCA9IGVsZW1lbnQuY2xvc2VzdChcImxhYmVsXCIpO1xuICAgICAgICBpZiAocGFyZW50TGFiZWw/LnRleHRDb250ZW50KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGlucHV0J3MgdmFsdWUgZnJvbSBsYWJlbCB0ZXh0XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gcGFyZW50TGFiZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGVsZW1lbnQudmFsdWUgfHwgXCJcIjtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoaW5wdXRWYWx1ZSwgXCJcIikudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ldGhvZCAzOiBhcmlhLWxhYmVsbGVkYnlcbiAgICAgICAgY29uc3QgbGFiZWxsZWRCeSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbGxlZGJ5XCIpO1xuICAgICAgICBpZiAobGFiZWxsZWRCeSkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxhYmVsbGVkQnkpO1xuICAgICAgICAgICAgaWYgKGxhYmVsRWw/LnRleHRDb250ZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbEVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNZXRob2QgNDogUHJldmlvdXMgc2libGluZyBsYWJlbFxuICAgICAgICBsZXQgc2libGluZyA9IGVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgd2hpbGUgKHNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChzaWJsaW5nLnRhZ05hbWUgPT09IFwiTEFCRUxcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaWJsaW5nLnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNpYmxpbmcgPSBzaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWV0aG9kIDU6IFBhcmVudCdzIHByZXZpb3VzIHNpYmxpbmcgbGFiZWxcbiAgICAgICAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50U2libGluZyA9IHBhcmVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKHBhcmVudFNpYmxpbmc/LnRhZ05hbWUgPT09IFwiTEFCRUxcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRTaWJsaW5nLnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZ2V0TmVhcmJ5VGV4dChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQuY2xvc2VzdCgnLmZvcm0tZ3JvdXAsIC5maWVsZCwgLmlucHV0LXdyYXBwZXIsIFtjbGFzcyo9XCJmaWVsZFwiXSwgW2NsYXNzKj1cImlucHV0XCJdJyk7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwYXJlbnQudGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoIDwgMjAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXRQYXJlbnRDbGFzc2VzKGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IFtdO1xuICAgICAgICBsZXQgY3VycmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgbGV0IGRlcHRoID0gMDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgJiYgZGVwdGggPCAzKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goLi4uY3VycmVudC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xhc3NlcztcbiAgICB9XG4gICAgbG9va3NMaWtlQ3VzdG9tUXVlc3Rpb24oc2lnbmFscykge1xuICAgICAgICBjb25zdCB0ZXh0ID0gYCR7c2lnbmFscy5sYWJlbH0gJHtzaWduYWxzLnBsYWNlaG9sZGVyfSAke3NpZ25hbHMubmVhcmJ5VGV4dH1gO1xuICAgICAgICByZXR1cm4gQ1VTVE9NX1FVRVNUSU9OX0lORElDQVRPUlMuc29tZSgocGF0dGVybikgPT4gcGF0dGVybi50ZXN0KHRleHQpKTtcbiAgICB9XG59XG4iLCIvLyBGaWVsZC10by1wcm9maWxlIHZhbHVlIG1hcHBpbmdcbmV4cG9ydCBjbGFzcyBGaWVsZE1hcHBlciB7XG4gICAgY29uc3RydWN0b3IocHJvZmlsZSkge1xuICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgIH1cbiAgICBtYXBGaWVsZFRvVmFsdWUoZmllbGQpIHtcbiAgICAgICAgY29uc3QgZmllbGRUeXBlID0gZmllbGQuZmllbGRUeXBlO1xuICAgICAgICBjb25zdCBtYXBwaW5nID0gdGhpcy5nZXRNYXBwaW5ncygpO1xuICAgICAgICBjb25zdCBtYXBwZXIgPSBtYXBwaW5nW2ZpZWxkVHlwZV07XG4gICAgICAgIGlmIChtYXBwZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZ2V0TWFwcGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IHAgPSB0aGlzLnByb2ZpbGU7XG4gICAgICAgIGNvbnN0IGMgPSBwLmNvbXB1dGVkO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gTmFtZSBmaWVsZHNcbiAgICAgICAgICAgIGZpcnN0TmFtZTogKCkgPT4gYz8uZmlyc3ROYW1lIHx8IG51bGwsXG4gICAgICAgICAgICBsYXN0TmFtZTogKCkgPT4gYz8ubGFzdE5hbWUgfHwgbnVsbCxcbiAgICAgICAgICAgIGZ1bGxOYW1lOiAoKSA9PiBwLmNvbnRhY3Q/Lm5hbWUgfHwgbnVsbCxcbiAgICAgICAgICAgIC8vIENvbnRhY3QgZmllbGRzXG4gICAgICAgICAgICBlbWFpbDogKCkgPT4gcC5jb250YWN0Py5lbWFpbCB8fCBudWxsLFxuICAgICAgICAgICAgcGhvbmU6ICgpID0+IHAuY29udGFjdD8ucGhvbmUgfHwgbnVsbCxcbiAgICAgICAgICAgIGFkZHJlc3M6ICgpID0+IHAuY29udGFjdD8ubG9jYXRpb24gfHwgbnVsbCxcbiAgICAgICAgICAgIGNpdHk6ICgpID0+IHRoaXMuZXh0cmFjdENpdHkocC5jb250YWN0Py5sb2NhdGlvbiksXG4gICAgICAgICAgICBzdGF0ZTogKCkgPT4gdGhpcy5leHRyYWN0U3RhdGUocC5jb250YWN0Py5sb2NhdGlvbiksXG4gICAgICAgICAgICB6aXBDb2RlOiAoKSA9PiBudWxsLCAvLyBOb3QgdHlwaWNhbGx5IHN0b3JlZFxuICAgICAgICAgICAgY291bnRyeTogKCkgPT4gdGhpcy5leHRyYWN0Q291bnRyeShwLmNvbnRhY3Q/LmxvY2F0aW9uKSxcbiAgICAgICAgICAgIC8vIFNvY2lhbC9Qcm9mZXNzaW9uYWxcbiAgICAgICAgICAgIGxpbmtlZGluOiAoKSA9PiBwLmNvbnRhY3Q/LmxpbmtlZGluIHx8IG51bGwsXG4gICAgICAgICAgICBnaXRodWI6ICgpID0+IHAuY29udGFjdD8uZ2l0aHViIHx8IG51bGwsXG4gICAgICAgICAgICB3ZWJzaXRlOiAoKSA9PiBwLmNvbnRhY3Q/LndlYnNpdGUgfHwgbnVsbCxcbiAgICAgICAgICAgIHBvcnRmb2xpbzogKCkgPT4gcC5jb250YWN0Py53ZWJzaXRlIHx8IG51bGwsXG4gICAgICAgICAgICAvLyBFbXBsb3ltZW50XG4gICAgICAgICAgICBjdXJyZW50Q29tcGFueTogKCkgPT4gYz8uY3VycmVudENvbXBhbnkgfHwgbnVsbCxcbiAgICAgICAgICAgIGN1cnJlbnRUaXRsZTogKCkgPT4gYz8uY3VycmVudFRpdGxlIHx8IG51bGwsXG4gICAgICAgICAgICB5ZWFyc0V4cGVyaWVuY2U6ICgpID0+IGM/LnllYXJzRXhwZXJpZW5jZT8udG9TdHJpbmcoKSB8fCBudWxsLFxuICAgICAgICAgICAgLy8gRWR1Y2F0aW9uXG4gICAgICAgICAgICBzY2hvb2w6ICgpID0+IGM/Lm1vc3RSZWNlbnRTY2hvb2wgfHwgbnVsbCxcbiAgICAgICAgICAgIGVkdWNhdGlvbjogKCkgPT4gdGhpcy5mb3JtYXRFZHVjYXRpb24oKSxcbiAgICAgICAgICAgIGRlZ3JlZTogKCkgPT4gYz8ubW9zdFJlY2VudERlZ3JlZSB8fCBudWxsLFxuICAgICAgICAgICAgZmllbGRPZlN0dWR5OiAoKSA9PiBjPy5tb3N0UmVjZW50RmllbGQgfHwgbnVsbCxcbiAgICAgICAgICAgIGdyYWR1YXRpb25ZZWFyOiAoKSA9PiBjPy5ncmFkdWF0aW9uWWVhciB8fCBudWxsLFxuICAgICAgICAgICAgZ3BhOiAoKSA9PiBwLmVkdWNhdGlvbj8uWzBdPy5ncGEgfHwgbnVsbCxcbiAgICAgICAgICAgIC8vIERvY3VtZW50cyAocmV0dXJuIG51bGwsIGhhbmRsZWQgc2VwYXJhdGVseSlcbiAgICAgICAgICAgIHJlc3VtZTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgIGNvdmVyTGV0dGVyOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gQ29tcGVuc2F0aW9uXG4gICAgICAgICAgICBzYWxhcnk6ICgpID0+IG51bGwsIC8vIFVzZXItc3BlY2lmaWMsIGRvbid0IGF1dG8tZmlsbFxuICAgICAgICAgICAgc2FsYXJ5RXhwZWN0YXRpb246ICgpID0+IG51bGwsXG4gICAgICAgICAgICAvLyBBdmFpbGFiaWxpdHlcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogKCkgPT4gbnVsbCwgLy8gVXNlci1zcGVjaWZpY1xuICAgICAgICAgICAgYXZhaWxhYmlsaXR5OiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gV29yayBhdXRob3JpemF0aW9uIChzZW5zaXRpdmUsIGRvbid0IGF1dG8tZmlsbClcbiAgICAgICAgICAgIHdvcmtBdXRob3JpemF0aW9uOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgc3BvbnNvcnNoaXA6ICgpID0+IG51bGwsXG4gICAgICAgICAgICAvLyBFRU8gZmllbGRzIChzZW5zaXRpdmUsIGRvbid0IGF1dG8tZmlsbClcbiAgICAgICAgICAgIHZldGVyYW5TdGF0dXM6ICgpID0+IG51bGwsXG4gICAgICAgICAgICBkaXNhYmlsaXR5OiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgZ2VuZGVyOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgZXRobmljaXR5OiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgLy8gU2tpbGxzL1N1bW1hcnlcbiAgICAgICAgICAgIHNraWxsczogKCkgPT4gYz8uc2tpbGxzTGlzdCB8fCBudWxsLFxuICAgICAgICAgICAgc3VtbWFyeTogKCkgPT4gcC5zdW1tYXJ5IHx8IG51bGwsXG4gICAgICAgICAgICBleHBlcmllbmNlOiAoKSA9PiB0aGlzLmZvcm1hdEV4cGVyaWVuY2UoKSxcbiAgICAgICAgICAgIC8vIEN1c3RvbS9Vbmtub3duIChoYW5kbGVkIGJ5IGxlYXJuaW5nIHN5c3RlbSlcbiAgICAgICAgICAgIGN1c3RvbVF1ZXN0aW9uOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgdW5rbm93bjogKCkgPT4gbnVsbCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZXh0cmFjdENpdHkobG9jYXRpb24pIHtcbiAgICAgICAgaWYgKCFsb2NhdGlvbilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAvLyBDb21tb24gcGF0dGVybjogXCJDaXR5LCBTdGF0ZVwiIG9yIFwiQ2l0eSwgU3RhdGUsIENvdW50cnlcIlxuICAgICAgICBjb25zdCBwYXJ0cyA9IGxvY2F0aW9uLnNwbGl0KFwiLFwiKS5tYXAoKHApID0+IHAudHJpbSgpKTtcbiAgICAgICAgcmV0dXJuIHBhcnRzWzBdIHx8IG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RTdGF0ZShsb2NhdGlvbikge1xuICAgICAgICBpZiAoIWxvY2F0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gbG9jYXRpb24uc3BsaXQoXCIsXCIpLm1hcCgocCkgPT4gcC50cmltKCkpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBcIkNBXCIgb3IgXCJDYWxpZm9ybmlhXCIgb3IgXCJDQSA5NDEwNVwiXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHBhcnRzWzFdLnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0Q291bnRyeShsb2NhdGlvbikge1xuICAgICAgICBpZiAoIWxvY2F0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gbG9jYXRpb24uc3BsaXQoXCIsXCIpLm1hcCgocCkgPT4gcC50cmltKCkpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEZWZhdWx0IHRvIFVTQSBpZiBvbmx5IGNpdHkvc3RhdGVcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIFwiVW5pdGVkIFN0YXRlc1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmb3JtYXRFZHVjYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGVkdSA9IHRoaXMucHJvZmlsZS5lZHVjYXRpb24/LlswXTtcbiAgICAgICAgaWYgKCFlZHUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIGAke2VkdS5kZWdyZWV9IGluICR7ZWR1LmZpZWxkfSBmcm9tICR7ZWR1Lmluc3RpdHV0aW9ufWA7XG4gICAgfVxuICAgIGZvcm1hdEV4cGVyaWVuY2UoKSB7XG4gICAgICAgIGNvbnN0IGV4cHMgPSB0aGlzLnByb2ZpbGUuZXhwZXJpZW5jZXM7XG4gICAgICAgIGlmICghZXhwcyB8fCBleHBzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gZXhwc1xuICAgICAgICAgICAgLnNsaWNlKDAsIDMpXG4gICAgICAgICAgICAubWFwKChleHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmlvZCA9IGV4cC5jdXJyZW50XG4gICAgICAgICAgICAgICAgPyBgJHtleHAuc3RhcnREYXRlfSAtIFByZXNlbnRgXG4gICAgICAgICAgICAgICAgOiBgJHtleHAuc3RhcnREYXRlfSAtICR7ZXhwLmVuZERhdGV9YDtcbiAgICAgICAgICAgIHJldHVybiBgJHtleHAudGl0bGV9IGF0ICR7ZXhwLmNvbXBhbnl9ICgke3BlcmlvZH0pYDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpO1xuICAgIH1cbiAgICAvLyBHZXQgYWxsIG1hcHBlZCB2YWx1ZXMgZm9yIGEgZm9ybVxuICAgIGdldEFsbE1hcHBlZFZhbHVlcyhmaWVsZHMpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGZpZWxkcykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLm1hcEZpZWxkVG9WYWx1ZShmaWVsZCk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMuc2V0KGZpZWxkLmVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbn1cbiIsIi8vIEF1dG8tZmlsbCBlbmdpbmUgb3JjaGVzdHJhdG9yXG5leHBvcnQgY2xhc3MgQXV0b0ZpbGxFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGRldGVjdG9yLCBtYXBwZXIpIHtcbiAgICAgICAgdGhpcy5kZXRlY3RvciA9IGRldGVjdG9yO1xuICAgICAgICB0aGlzLm1hcHBlciA9IG1hcHBlcjtcbiAgICB9XG4gICAgYXN5bmMgZmlsbEZvcm0oZmllbGRzKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGZpbGxlZDogMCxcbiAgICAgICAgICAgIHNraXBwZWQ6IDAsXG4gICAgICAgICAgICBlcnJvcnM6IDAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLm1hcHBlci5tYXBGaWVsZFRvVmFsdWUoZmllbGQpO1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNraXBwZWQrKztcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmRldGFpbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFR5cGU6IGZpZWxkLmZpZWxkVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsbGVkID0gYXdhaXQgdGhpcy5maWxsRmllbGQoZmllbGQuZWxlbWVudCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZpbGxlZCsrO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZGV0YWlscy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkVHlwZTogZmllbGQuZmllbGRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5za2lwcGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5kZXRhaWxzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlOiBmaWVsZC5maWVsZFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9ycysrO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kZXRhaWxzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFR5cGU6IGZpZWxkLmZpZWxkVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsbGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGFzeW5jIGZpbGxGaWVsZChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9IGVsZW1lbnQudHlwZT8udG9Mb3dlckNhc2UoKSB8fCBcInRleHRcIjtcbiAgICAgICAgLy8gSGFuZGxlIGRpZmZlcmVudCBpbnB1dCB0eXBlc1xuICAgICAgICBpZiAodGFnTmFtZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFNlbGVjdChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFRleHRJbnB1dChlbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IFwiaW5wdXRcIikge1xuICAgICAgICAgICAgc3dpdGNoIChpbnB1dFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbWFpbFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZWxcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwidXJsXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxsVGV4dElucHV0KGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hlY2tib3hcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbENoZWNrYm94KGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBjYXNlIFwicmFkaW9cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFJhZGlvKGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxsRGF0ZUlucHV0KGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxsVGV4dElucHV0KGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZpbGxUZXh0SW5wdXQoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgLy8gRm9jdXMgdGhlIGVsZW1lbnRcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAvLyBDbGVhciBleGlzdGluZyB2YWx1ZVxuICAgICAgICBlbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgLy8gU2V0IG5ldyB2YWx1ZVxuICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIC8vIERpc3BhdGNoIGV2ZW50cyB0byB0cmlnZ2VyIHZhbGlkYXRpb24gYW5kIGZyYW1ld29ya3NcbiAgICAgICAgdGhpcy5kaXNwYXRjaElucHV0RXZlbnRzKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZSA9PT0gdmFsdWU7XG4gICAgfVxuICAgIGZpbGxTZWxlY3QoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZWxlbWVudC5vcHRpb25zKTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgLy8gVHJ5IGV4YWN0IG1hdGNoIGZpcnN0XG4gICAgICAgIGxldCBtYXRjaGluZ09wdGlvbiA9IG9wdGlvbnMuZmluZCgob3B0KSA9PiBvcHQudmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gbm9ybWFsaXplZFZhbHVlIHx8XG4gICAgICAgICAgICBvcHQudGV4dC50b0xvd2VyQ2FzZSgpID09PSBub3JtYWxpemVkVmFsdWUpO1xuICAgICAgICAvLyBUcnkgcGFydGlhbCBtYXRjaFxuICAgICAgICBpZiAoIW1hdGNoaW5nT3B0aW9uKSB7XG4gICAgICAgICAgICBtYXRjaGluZ09wdGlvbiA9IG9wdGlvbnMuZmluZCgob3B0KSA9PiBvcHQudmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkVmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgb3B0LnRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkVmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFZhbHVlLmluY2x1ZGVzKG9wdC52YWx1ZS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRWYWx1ZS5pbmNsdWRlcyhvcHQudGV4dC50b0xvd2VyQ2FzZSgpKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoaW5nT3B0aW9uKSB7XG4gICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gbWF0Y2hpbmdPcHRpb24udmFsdWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMoZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZpbGxDaGVja2JveChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBzaG91bGRDaGVjayA9IFtcInRydWVcIiwgXCJ5ZXNcIiwgXCIxXCIsIFwib25cIl0uaW5jbHVkZXModmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IHNob3VsZENoZWNrO1xuICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBmaWxsUmFkaW8oZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgLy8gRmluZCB0aGUgcmFkaW8gZ3JvdXBcbiAgICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnQubmFtZTtcbiAgICAgICAgaWYgKCFuYW1lKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCByYWRpb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBpbnB1dFt0eXBlPVwicmFkaW9cIl1bbmFtZT1cIiR7bmFtZX1cIl1gKTtcbiAgICAgICAgZm9yIChjb25zdCByYWRpbyBvZiByYWRpb3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhZGlvSW5wdXQgPSByYWRpbztcbiAgICAgICAgICAgIGNvbnN0IHJhZGlvVmFsdWUgPSByYWRpb0lucHV0LnZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCByYWRpb0xhYmVsID0gdGhpcy5nZXRSYWRpb0xhYmVsKHJhZGlvSW5wdXQpPy50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAocmFkaW9WYWx1ZSA9PT0gbm9ybWFsaXplZFZhbHVlIHx8XG4gICAgICAgICAgICAgICAgcmFkaW9MYWJlbC5pbmNsdWRlcyhub3JtYWxpemVkVmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFZhbHVlLmluY2x1ZGVzKHJhZGlvVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmFkaW9JbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoSW5wdXRFdmVudHMocmFkaW9JbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWxsRGF0ZUlucHV0KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIC8vIFRyeSB0byBwYXJzZSBhbmQgZm9ybWF0IHRoZSBkYXRlXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmIChpc05hTihkYXRlLmdldFRpbWUoKSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vIEZvcm1hdCBhcyBZWVlZLU1NLUREIGZvciBkYXRlIGlucHV0XG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IGRhdGUudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF07XG4gICAgICAgIGVsZW1lbnQudmFsdWUgPSBmb3JtYXR0ZWQ7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hJbnB1dEV2ZW50cyhlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGdldFJhZGlvTGFiZWwocmFkaW8pIHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIGFzc29jaWF0ZWQgbGFiZWxcbiAgICAgICAgaWYgKHJhZGlvLmlkKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7cmFkaW8uaWR9XCJdYCk7XG4gICAgICAgICAgICBpZiAobGFiZWwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsLnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3Igd3JhcHBpbmcgbGFiZWxcbiAgICAgICAgY29uc3QgcGFyZW50ID0gcmFkaW8uY2xvc2VzdChcImxhYmVsXCIpO1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LnRleHRDb250ZW50Py50cmltKCkgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3IgbmV4dCBzaWJsaW5nIHRleHRcbiAgICAgICAgY29uc3QgbmV4dCA9IHJhZGlvLm5leHRTaWJsaW5nO1xuICAgICAgICBpZiAobmV4dD8ubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dC50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGRpc3BhdGNoSW5wdXRFdmVudHMoZWxlbWVudCkge1xuICAgICAgICAvLyBEaXNwYXRjaCBldmVudHMgaW4gb3JkZXIgdGhhdCBtb3N0IGZyYW1ld29ya3MgZXhwZWN0XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJmb2N1c1wiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiYmx1clwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICAvLyBGb3IgUmVhY3QgY29udHJvbGxlZCBjb21wb25lbnRzXG4gICAgICAgIGNvbnN0IG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5IVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZSwgXCJ2YWx1ZVwiKT8uc2V0O1xuICAgICAgICBpZiAobmF0aXZlSW5wdXRWYWx1ZVNldHRlciAmJiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgbmF0aXZlSW5wdXRWYWx1ZVNldHRlci5jYWxsKGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gQmFzZSBzY3JhcGVyIGludGVyZmFjZSBhbmQgdXRpbGl0aWVzXG5leHBvcnQgY2xhc3MgQmFzZVNjcmFwZXIge1xuICAgIC8vIFNoYXJlZCB1dGlsaXRpZXNcbiAgICBleHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGVsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RIdG1sQ29udGVudChzZWxlY3Rvcikge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICByZXR1cm4gZWw/LmlubmVySFRNTD8udHJpbSgpIHx8IG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RBdHRyaWJ1dGUoc2VsZWN0b3IsIGF0dHIpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGVsPy5nZXRBdHRyaWJ1dGUoYXR0cikgfHwgbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEFsbFRleHQoc2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudHMpXG4gICAgICAgICAgICAubWFwKChlbCkgPT4gZWwudGV4dENvbnRlbnQ/LnRyaW0oKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKHRleHQpID0+ICEhdGV4dCk7XG4gICAgfVxuICAgIHdhaXRGb3JFbGVtZW50KHNlbGVjdG9yLCB0aW1lb3V0ID0gNTAwMCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShlbCk7XG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChfLCBvYnMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgICAgICBvYnMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRWxlbWVudCAke3NlbGVjdG9yfSBub3QgZm91bmQgYWZ0ZXIgJHt0aW1lb3V0fW1zYCkpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHRyYWN0UmVxdWlyZW1lbnRzKHRleHQpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZW1lbnRzID0gW107XG4gICAgICAgIC8vIFNwbGl0IGJ5IGNvbW1vbiBidWxsZXQgcGF0dGVybnNcbiAgICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KC9cXG584oCifOKXpnzil4Z84paqfOKXj3wtXFxzfFxcKlxccy8pO1xuICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuZWQgPSBsaW5lLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjbGVhbmVkLmxlbmd0aCA+IDIwICYmIGNsZWFuZWQubGVuZ3RoIDwgNTAwKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaXQgbG9va3MgbGlrZSBhIHJlcXVpcmVtZW50XG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuZWQubWF0Y2goL14oeW91fHdlfHRoZXxtdXN0fHNob3VsZHx3aWxsfGV4cGVyaWVuY2V8cHJvZmljaWVuY3l8a25vd2xlZGdlfGFiaWxpdHl8c3Ryb25nfGV4Y2VsbGVudCkvaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5lZC5tYXRjaCgvcmVxdWlyZWR8cHJlZmVycmVkfGJvbnVzfHBsdXMvaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5lZC5tYXRjaCgvXlxcZCtcXCs/XFxzKnllYXJzPy9pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlbWVudHMucHVzaChjbGVhbmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcXVpcmVtZW50cy5zbGljZSgwLCAxNSk7XG4gICAgfVxuICAgIGV4dHJhY3RLZXl3b3Jkcyh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGtleXdvcmRzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBDb21tb24gdGVjaCBza2lsbHMgcGF0dGVybnNcbiAgICAgICAgY29uc3QgdGVjaFBhdHRlcm5zID0gW1xuICAgICAgICAgICAgL1xcYihyZWFjdHxhbmd1bGFyfHZ1ZXxzdmVsdGV8bmV4dFxcLj9qc3xudXh0KVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIobm9kZVxcLj9qc3xleHByZXNzfGZhc3RpZnl8bmVzdFxcLj9qcylcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKHB5dGhvbnxkamFuZ298Zmxhc2t8ZmFzdGFwaSlcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKGphdmF8c3ByaW5nfGtvdGxpbilcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKGdvfGdvbGFuZ3xydXN0fGNcXCtcXCt8YyN8XFwubmV0KVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIodHlwZXNjcmlwdHxqYXZhc2NyaXB0fGVzNilcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKHNxbHxteXNxbHxwb3N0Z3Jlc3FsfG1vbmdvZGJ8cmVkaXN8ZWxhc3RpY3NlYXJjaClcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKGF3c3xnY3B8YXp1cmV8ZG9ja2VyfGt1YmVybmV0ZXN8azhzKVxcYi9naSxcbiAgICAgICAgICAgIC9cXGIoZ2l0fGNpXFwvY2R8amVua2luc3xnaXRodWJcXHMqYWN0aW9ucylcXGIvZ2ksXG4gICAgICAgICAgICAvXFxiKGdyYXBocWx8cmVzdHxhcGl8bWljcm9zZXJ2aWNlcylcXGIvZ2ksXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3QgcGF0dGVybiBvZiB0ZWNoUGF0dGVybnMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzLmZvckVhY2goKG0pID0+IGtleXdvcmRzLmFkZChtLnRvTG93ZXJDYXNlKCkudHJpbSgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oa2V5d29yZHMpO1xuICAgIH1cbiAgICBkZXRlY3RKb2JUeXBlKHRleHQpIHtcbiAgICAgICAgY29uc3QgbG93ZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcImludGVyblwiKSB8fFxuICAgICAgICAgICAgbG93ZXIuaW5jbHVkZXMoXCJpbnRlcm5zaGlwXCIpIHx8XG4gICAgICAgICAgICBsb3dlci5pbmNsdWRlcyhcImNvLW9wXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJpbnRlcm5zaGlwXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwiY29udHJhY3RcIikgfHwgbG93ZXIuaW5jbHVkZXMoXCJjb250cmFjdG9yXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb250cmFjdFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcInBhcnQtdGltZVwiKSB8fCBsb3dlci5pbmNsdWRlcyhcInBhcnQgdGltZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwicGFydC10aW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwiZnVsbC10aW1lXCIpIHx8IGxvd2VyLmluY2x1ZGVzKFwiZnVsbCB0aW1lXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJmdWxsLXRpbWVcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBkZXRlY3RSZW1vdGUodGV4dCkge1xuICAgICAgICBjb25zdCBsb3dlciA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIChsb3dlci5pbmNsdWRlcyhcInJlbW90ZVwiKSB8fFxuICAgICAgICAgICAgbG93ZXIuaW5jbHVkZXMoXCJ3b3JrIGZyb20gaG9tZVwiKSB8fFxuICAgICAgICAgICAgbG93ZXIuaW5jbHVkZXMoXCJ3ZmhcIikgfHxcbiAgICAgICAgICAgIGxvd2VyLmluY2x1ZGVzKFwiZnVsbHkgZGlzdHJpYnV0ZWRcIikgfHxcbiAgICAgICAgICAgIGxvd2VyLmluY2x1ZGVzKFwiYW55d2hlcmVcIikpO1xuICAgIH1cbiAgICBleHRyYWN0U2FsYXJ5KHRleHQpIHtcbiAgICAgICAgLy8gTWF0Y2ggc2FsYXJ5IHBhdHRlcm5zIGxpa2UgJDEwMCwwMDAgLSAkMTUwLDAwMCBvciAkMTAwayAtICQxNTBrXG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSAvXFwkW1xcZCxdKyg/OmspPyg/OlxccypbLeKAk11cXHMqXFwkW1xcZCxdKyg/OmspPyk/KD86XFxzKig/OnBlcnxcXC8pXFxzKig/OnllYXJ8eXJ8YW5udW18YW5udWFsfGhvdXJ8aHIpKT8vZ2k7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gcGF0dGVybi5leGVjKHRleHQpO1xuICAgICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFswXSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY2xlYW5EZXNjcmlwdGlvbihodG1sKSB7XG4gICAgICAgIC8vIFJlbW92ZSBIVE1MIHRhZ3MgYnV0IHByZXNlcnZlIGxpbmUgYnJlYWtzXG4gICAgICAgIHJldHVybiBodG1sXG4gICAgICAgICAgICAucmVwbGFjZSgvPGJyXFxzKlxcLz8+L2dpLCBcIlxcblwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzxcXC9wPi9naSwgXCJcXG5cXG5cIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88XFwvZGl2Pi9naSwgXCJcXG5cIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88XFwvbGk+L2dpLCBcIlxcblwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzxbXj5dKz4vZywgXCJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCIgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbnszLH0vZywgXCJcXG5cXG5cIilcbiAgICAgICAgICAgIC50cmltKCk7XG4gICAgfVxufVxuIiwiLy8gTGlua2VkSW4gam9iIHNjcmFwZXJcbmltcG9ydCB7IEJhc2VTY3JhcGVyIH0gZnJvbSBcIi4vYmFzZS1zY3JhcGVyXCI7XG5leHBvcnQgY2xhc3MgTGlua2VkSW5TY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IFwibGlua2VkaW5cIjtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJucyA9IFtcbiAgICAgICAgICAgIC9saW5rZWRpblxcLmNvbVxcL2pvYnNcXC92aWV3XFwvKFxcZCspLyxcbiAgICAgICAgICAgIC9saW5rZWRpblxcLmNvbVxcL2pvYnNcXC9zZWFyY2gvLFxuICAgICAgICAgICAgL2xpbmtlZGluXFwuY29tXFwvam9ic1xcL2NvbGxlY3Rpb25zLyxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgY2FuSGFuZGxlKHVybCkge1xuICAgICAgICByZXR1cm4gdGhpcy51cmxQYXR0ZXJucy5zb21lKChwKSA9PiBwLnRlc3QodXJsKSk7XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3RpbmcoKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIGpvYiBkZXRhaWxzIHRvIGxvYWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckVsZW1lbnQoXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19qb2ItdGl0bGUsIC5qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2pvYi10aXRsZVwiLCAzMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAvLyBUcnkgYWx0ZXJuYXRpdmUgc2VsZWN0b3JzXG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IG11bHRpcGxlIHNlbGVjdG9yIHN0cmF0ZWdpZXMgKExpbmtlZEluIGNoYW5nZXMgRE9NIGZyZXF1ZW50bHkpXG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5leHRyYWN0Sm9iVGl0bGUoKTtcbiAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZXh0cmFjdENvbXBhbnkoKTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmV4dHJhY3RMb2NhdGlvbigpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZXh0cmFjdERlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWNvbXBhbnkgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gTGlua2VkSW4gc2NyYXBlcjogTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiwge1xuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICEhZGVzY3JpcHRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSB0byBleHRyYWN0IGZyb20gc3RydWN0dXJlZCBkYXRhXG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZWREYXRhID0gdGhpcy5leHRyYWN0U3RydWN0dXJlZERhdGEoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiB8fCBzdHJ1Y3R1cmVkRGF0YT8ubG9jYXRpb24sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBzYWxhcnk6IHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbikgfHwgc3RydWN0dXJlZERhdGE/LnNhbGFyeSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8IFwiXCIpIHx8IHRoaXMuZGV0ZWN0UmVtb3RlKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgc291cmNlSm9iSWQ6IHRoaXMuZXh0cmFjdEpvYklkKCksXG4gICAgICAgICAgICBwb3N0ZWRBdDogc3RydWN0dXJlZERhdGE/LnBvc3RlZEF0LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0KCkge1xuICAgICAgICBjb25zdCBqb2JzID0gW107XG4gICAgICAgIC8vIEpvYiBjYXJkcyBpbiBzZWFyY2ggcmVzdWx0c1xuICAgICAgICBjb25zdCBqb2JDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuam9iLWNhcmQtY29udGFpbmVyLCAuam9icy1zZWFyY2gtcmVzdWx0c19fbGlzdC1pdGVtLCAuc2NhZmZvbGQtbGF5b3V0X19saXN0LWl0ZW1cIik7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBqb2JDYXJkcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuam9iLWNhcmQtbGlzdF9fdGl0bGUsIC5qb2ItY2FyZC1jb250YWluZXJfX2xpbmssIGFbZGF0YS1jb250cm9sLW5hbWU9XCJqb2JfY2FyZF90aXRsZVwiXScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnlFbCA9IGNhcmQucXVlcnlTZWxlY3RvcihcIi5qb2ItY2FyZC1jb250YWluZXJfX2NvbXBhbnktbmFtZSwgLmpvYi1jYXJkLWNvbnRhaW5lcl9fcHJpbWFyeS1kZXNjcmlwdGlvblwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKFwiLmpvYi1jYXJkLWNvbnRhaW5lcl9fbWV0YWRhdGEtaXRlbVwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueSA9IGNvbXBhbnlFbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGxvY2F0aW9uRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdGl0bGVFbD8uaHJlZjtcbiAgICAgICAgICAgICAgICBpZiAodGl0bGUgJiYgY29tcGFueSAmJiB1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsIC8vIFdvdWxkIG5lZWQgdG8gbmF2aWdhdGUgdG8gZ2V0IGZ1bGwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltDb2x1bWJ1c10gRXJyb3Igc2NyYXBpbmcgam9iIGNhcmQ6XCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19qb2ItdGl0bGVcIixcbiAgICAgICAgICAgIFwiLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fam9iLXRpdGxlXCIsXG4gICAgICAgICAgICBcIi50LTI0LmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fam9iLXRpdGxlXCIsXG4gICAgICAgICAgICBcImgxLnQtMjRcIixcbiAgICAgICAgICAgIFwiLmpvYnMtdG9wLWNhcmRfX2pvYi10aXRsZVwiLFxuICAgICAgICAgICAgJ2gxW2NsYXNzKj1cImpvYi10aXRsZVwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2NvbXBhbnktbmFtZVwiLFxuICAgICAgICAgICAgXCIuam9icy11bmlmaWVkLXRvcC1jYXJkX19jb21wYW55LW5hbWVcIixcbiAgICAgICAgICAgIFwiLmpvYnMtdG9wLWNhcmRfX2NvbXBhbnktdXJsXCIsXG4gICAgICAgICAgICAnYVtkYXRhLXRyYWNraW5nLWNvbnRyb2wtbmFtZT1cInB1YmxpY19qb2JzX3RvcGNhcmQtb3JnLW5hbWVcIl0nLFxuICAgICAgICAgICAgXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19wcmltYXJ5LWRlc2NyaXB0aW9uLWNvbnRhaW5lciBhXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RMb2NhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19idWxsZXRcIixcbiAgICAgICAgICAgIFwiLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fYnVsbGV0XCIsXG4gICAgICAgICAgICBcIi5qb2JzLXRvcC1jYXJkX19idWxsZXRcIixcbiAgICAgICAgICAgIFwiLmpvYi1kZXRhaWxzLWpvYnMtdW5pZmllZC10b3AtY2FyZF9fcHJpbWFyeS1kZXNjcmlwdGlvbi1jb250YWluZXIgLnQtYmxhY2stLWxpZ2h0XCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgIXRleHQuaW5jbHVkZXMoXCJhcHBsaWNhbnRcIikgJiYgIXRleHQuaW5jbHVkZXMoXCJhZ29cIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdERlc2NyaXB0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5qb2JzLWRlc2NyaXB0aW9uX19jb250ZW50XCIsXG4gICAgICAgICAgICBcIi5qb2JzLWRlc2NyaXB0aW9uLWNvbnRlbnRfX3RleHRcIixcbiAgICAgICAgICAgIFwiLmpvYnMtYm94X19odG1sLWNvbnRlbnRcIixcbiAgICAgICAgICAgIFwiI2pvYi1kZXRhaWxzXCIsXG4gICAgICAgICAgICBcIi5qb2JzLWRlc2NyaXB0aW9uXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sID0gdGhpcy5leHRyYWN0SHRtbENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbkRlc2NyaXB0aW9uKGh0bWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iSWQoKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcL3ZpZXdcXC8oXFxkKykvKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgfVxuICAgIGV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxkSnNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiXScpO1xuICAgICAgICAgICAgaWYgKCFsZEpzb24/LnRleHRDb250ZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UobGRKc29uLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb246IGRhdGEuam9iTG9jYXRpb24/LmFkZHJlc3M/LmFkZHJlc3NMb2NhbGl0eSxcbiAgICAgICAgICAgICAgICBzYWxhcnk6IGRhdGEuYmFzZVNhbGFyeT8udmFsdWVcbiAgICAgICAgICAgICAgICAgICAgPyBgJCR7ZGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1pblZhbHVlIHx8IFwiXCJ9LSR7ZGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8IFwiXCJ9YFxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwb3N0ZWRBdDogZGF0YS5kYXRlUG9zdGVkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIFdhdGVybG9vIFdvcmtzIGpvYiBzY3JhcGVyIChVbml2ZXJzaXR5IG9mIFdhdGVybG9vIGNvLW9wIHBvcnRhbCkuXG4vL1xuLy8gVGFyZ2V0cyB0aGUgbW9kZXJuIHN0dWRlbnQgcG9zdGluZy1zZWFyY2ggVUkgKGJvZHkubmV3LXN0dWRlbnRfX3Bvc3Rpbmctc2VhcmNoKS5cbi8vIFRoZSBsZWdhY3kgT3JiaXMtZXJhIHNlbGVjdG9ycyAoI3Bvc3RpbmdEaXYsIC5wb3N0aW5nLWRldGFpbHMsIC5qb2ItbGlzdGluZy10YWJsZSlcbi8vIGFyZSBubyBsb25nZXIgcHJlc2VudCBvbiB0aGUgcHJvZHVjdGlvbiBzaXRlOyB0aGlzIHNjcmFwZXIgZG9lcyBub3QgdHJ5IHRvXG4vLyBzdXBwb3J0IGJvdGgg4oCUIGlmIFdXIHJldmVydHMgb3IgYSBkaWZmZXJlbnQgc3VyZmFjZSBhcHBlYXJzLCBhZGQgYSBicmFuY2guXG5pbXBvcnQgeyBCYXNlU2NyYXBlciB9IGZyb20gXCIuL2Jhc2Utc2NyYXBlclwiO1xuLy8gRmllbGQgbGFiZWxzIGZyb20gdGhlIGxpdmUgVUkuIEVhY2ggZW50cnkgbGlzdHMgcHJlZml4ZXMgd2Ugd2FudCB0byBtYXRjaFxuLy8gYWdhaW5zdCB0aGUgLmxhYmVsIHRleHQgKHdoaWNoIGlzIG5vcm1hbGl6ZWQg4oCUIHRyYWlsaW5nIGNvbG9ucyBhbmQgd2hpdGVzcGFjZVxuLy8gc3RyaXBwZWQgYmVmb3JlIGNvbXBhcmlzb24pLiBUaGUgZmlyc3QgbWF0Y2hpbmcgY2FuZGlkYXRlIHdpbnMgcGVyIHJvdy5cbmNvbnN0IEZJRUxEX0xBQkVMUyA9IHtcbiAgICB0aXRsZTogW1wiSm9iIFRpdGxlXCJdLFxuICAgIHN1bW1hcnk6IFtcIkpvYiBTdW1tYXJ5XCJdLFxuICAgIHJlc3BvbnNpYmlsaXRpZXM6IFtcIkpvYiBSZXNwb25zaWJpbGl0aWVzXCIsIFwiUmVzcG9uc2liaWxpdGllc1wiXSxcbiAgICByZXF1aXJlbWVudHM6IFtcbiAgICAgICAgXCJSZXF1aXJlZCBTa2lsbHNcIixcbiAgICAgICAgXCJUYXJnZXRlZCBTa2lsbHNcIixcbiAgICAgICAgXCJUYXJnZXRlZCBEZWdyZWVzIGFuZCBEaXNjaXBsaW5lc1wiLFxuICAgIF0sXG4gICAgb3JnYW5pemF0aW9uOiBbXCJPcmdhbml6YXRpb25cIiwgXCJFbXBsb3llclwiLCBcIkNvbXBhbnlcIl0sXG4gICAgLy8gTW9kZXJuIFdXIHNwbGl0cyBsb2NhdGlvbiBhY3Jvc3MgbXVsdGlwbGUgbGFiZWxsZWQgcm93czsgd2UgY29sbGVjdCBlYWNoXG4gICAgLy8gcGllY2Ugc2VwYXJhdGVseSBhbmQgc3RpdGNoIHRoZW0gaW4gY29tcG9zZUxvY2F0aW9uKCkuXG4gICAgbG9jYXRpb25DaXR5OiBbXCJKb2IgLSBDaXR5XCJdLFxuICAgIGxvY2F0aW9uUmVnaW9uOiBbXCJKb2IgLSBQcm92aW5jZS9TdGF0ZVwiLCBcIkpvYiAtIFByb3ZpbmNlIC8gU3RhdGVcIl0sXG4gICAgbG9jYXRpb25Db3VudHJ5OiBbXCJKb2IgLSBDb3VudHJ5XCJdLFxuICAgIGxvY2F0aW9uRnVsbDogW1xuICAgICAgICBcIkpvYiBMb2NhdGlvblwiLFxuICAgICAgICBcIkxvY2F0aW9uXCIsXG4gICAgICAgIFwiSm9iIC0gQ2l0eSwgUHJvdmluY2UgLyBTdGF0ZSwgQ291bnRyeVwiLFxuICAgIF0sXG4gICAgZW1wbG95bWVudEFycmFuZ2VtZW50OiBbXCJFbXBsb3ltZW50IExvY2F0aW9uIEFycmFuZ2VtZW50XCJdLFxuICAgIHdvcmtUZXJtOiBbXCJXb3JrIFRlcm1cIl0sXG4gICAgd29ya1Rlcm1EdXJhdGlvbjogW1wiV29yayBUZXJtIER1cmF0aW9uXCJdLFxuICAgIGxldmVsOiBbXCJMZXZlbFwiXSxcbiAgICBvcGVuaW5nczogW1wiTnVtYmVyIG9mIEpvYiBPcGVuaW5nc1wiXSxcbiAgICBkZWFkbGluZTogW1wiQXBwbGljYXRpb24gRGVhZGxpbmVcIiwgXCJEZWFkbGluZVwiXSxcbiAgICBzYWxhcnk6IFtcbiAgICAgICAgXCJDb21wZW5zYXRpb24gYW5kIEJlbmVmaXRzIEluZm9ybWF0aW9uXCIsXG4gICAgICAgIFwiQ29tcGVuc2F0aW9uIGFuZCBCZW5lZml0c1wiLFxuICAgICAgICBcIkNvbXBlbnNhdGlvblwiLFxuICAgICAgICBcIlNhbGFyeVwiLFxuICAgIF0sXG4gICAgam9iVHlwZTogW1wiSm9iIFR5cGVcIl0sXG59O1xuZXhwb3J0IGNsYXNzIFdhdGVybG9vV29ya3NTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IFwid2F0ZXJsb293b3Jrc1wiO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm5zID0gWy93YXRlcmxvb3dvcmtzXFwudXdhdGVybG9vXFwuY2EvXTtcbiAgICB9XG4gICAgY2FuSGFuZGxlKHVybCkge1xuICAgICAgICByZXR1cm4gdGhpcy51cmxQYXR0ZXJucy5zb21lKChwKSA9PiBwLnRlc3QodXJsKSk7XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUpvYkxpc3RpbmcoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTG9naW5QYWdlKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBXYXRlcmxvbyBXb3JrczogUGxlYXNlIGxvZyBpbiBmaXJzdFwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JFbGVtZW50KFwiLmRhc2hib2FyZC1oZWFkZXJfX3Bvc3RpbmctdGl0bGVcIiwgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgLy8gTm8gcG9zdGluZyBwYW5lbCBvcGVuIOKAlCBub3QgYSBzY3JhcGUgZXJyb3IsIGp1c3Qgbm90aGluZyB0byBzY3JhcGUuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IHNvdXJjZUpvYklkLCB0aXRsZTogcGFuZWxUaXRsZSB9ID0gdGhpcy5wYXJzZVBvc3RpbmdIZWFkZXIoKTtcbiAgICAgICAgY29uc3QgZmllbGRzID0gdGhpcy5jb2xsZWN0RmllbGRzKCk7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZmllbGRzLnRpdGxlIHx8IHBhbmVsVGl0bGU7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSBmaWVsZHMub3JnYW5pemF0aW9uO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuY29tcG9zZURlc2NyaXB0aW9uKGZpZWxkcyk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gV2F0ZXJsb28gV29ya3Mgc2NyYXBlcjogTWlzc2luZyB0aXRsZSBvciBkZXNjcmlwdGlvblwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5jb21wb3NlTG9jYXRpb24oZmllbGRzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueTogY29tcGFueSB8fCBcIlVua25vd24gRW1wbG95ZXJcIixcbiAgICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMucGFyc2VCdWxsZXRMaXN0KGZpZWxkcy5yZXF1aXJlbWVudHMpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHJlc3BvbnNpYmlsaXRpZXM6IHRoaXMucGFyc2VCdWxsZXRMaXN0KGZpZWxkcy5yZXNwb25zaWJpbGl0aWVzKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICAvLyBTbG90aGluZydzIGV4dGVuc2lvbiBzY2hlbWEgY2FwcyBvcHRpb25hbCBzdHJpbmdzIGF0IDUwMCBjaGFycyBhbmRcbiAgICAgICAgICAgIC8vIFdhdGVybG9vV29ya3MgcHV0cyB0aGUgZnVsbCBiZW5lZml0cyBibHVyYiBpbiBcIkNvbXBlbnNhdGlvbiBhbmRcbiAgICAgICAgICAgIC8vIEJlbmVmaXRzXCIuIFRha2UgdGhlIGZpcnN0IGxpbmUvc2VudGVuY2Ugc28gd2FnZSByYW5nZXMgc3Vydml2ZS5cbiAgICAgICAgICAgIHNhbGFyeTogdGhpcy5jb25kZW5zZVNhbGFyeShmaWVsZHMuc2FsYXJ5KSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZShmaWVsZHMuam9iVHlwZSB8fCBkZXNjcmlwdGlvbikgfHwgXCJpbnRlcm5zaGlwXCIsXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlRnJvbUZpZWxkcyhmaWVsZHMsIGxvY2F0aW9uLCBkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkLFxuICAgICAgICAgICAgZGVhZGxpbmU6IGZpZWxkcy5kZWFkbGluZSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgLy8gTW9kZXJuIFdhdGVybG9vV29ya3MgcmVuZGVycyB0aGUgcG9zdGluZ3MgbGlzdCBpbiBhIHZpcnR1YWxpemVkIFNQQSB2aWV3XG4gICAgICAgIC8vIGFuZCB0aGUgcm93IHN1bW1hcmllcyBkb24ndCBpbmNsdWRlIGZ1bGwgZGVzY3JpcHRpb25zLiBCdWxrLWltcG9ydCBmcm9tXG4gICAgICAgIC8vIHRoZSBsaXN0IHZpZXcgaXMgcHJvdmlkZWQgYnkgdGhlIG9yY2hlc3RyYXRvciAoc2VlXG4gICAgICAgIC8vIHdhdGVybG9vLXdvcmtzLW9yY2hlc3RyYXRvci50cyksIHdoaWNoIHdhbGtzIGVhY2ggcm93LCBvcGVucyBpdHMgZGV0YWlsXG4gICAgICAgIC8vIHBhbmVsLCBhbmQgY2FsbHMgc2NyYXBlSm9iTGlzdGluZygpIHBlciByb3cuIHNjcmFwZUpvYkxpc3QoKSBpdHNlbGYgc3RheXNcbiAgICAgICAgLy8gZW1wdHkgc28gdGhlIGdlbmVyaWMgYXV0by1kZXRlY3QgcGF0aCBkb2Vzbid0IGFjY2lkZW50YWxseSBwaWNrIGl0IHVwLlxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlzTG9naW5QYWdlKCkge1xuICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXR1cm4gKHVybC5pbmNsdWRlcyhcIi9jYXMvXCIpIHx8XG4gICAgICAgICAgICB1cmwuaW5jbHVkZXMoXCIvbG9naW5cIikgfHxcbiAgICAgICAgICAgIHVybC5pbmNsdWRlcyhcIi9zaWduaW5cIikgfHxcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpICE9PSBudWxsKTtcbiAgICB9XG4gICAgcGFyc2VQb3N0aW5nSGVhZGVyKCkge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhc2hib2FyZC1oZWFkZXJfX3Bvc3RpbmctdGl0bGVcIik7XG4gICAgICAgIGlmICghaGVhZGVyKVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICBjb25zdCBoMlRleHQgPSBoZWFkZXIucXVlcnlTZWxlY3RvcihcImgyXCIpPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICBjb25zdCBpZE1hdGNoID0gKGhlYWRlci50ZXh0Q29udGVudCB8fCBcIlwiKS5tYXRjaCgvXFxiKFxcZHs0LDEwfSlcXGIvKTtcbiAgICAgICAgcmV0dXJuIHsgc291cmNlSm9iSWQ6IGlkTWF0Y2g/LlsxXSwgdGl0bGU6IGgyVGV4dCB9O1xuICAgIH1cbiAgICBjb2xsZWN0RmllbGRzKCkge1xuICAgICAgICBjb25zdCBiYWcgPSB7fTtcbiAgICAgICAgY29uc3QgYmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50YWdfX2tleS12YWx1ZS1saXN0LmpzLS1xdWVzdGlvbi0tY29udGFpbmVyXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2Nrcykge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxSYXcgPSBibG9jay5xdWVyeVNlbGVjdG9yKFwiLmxhYmVsXCIpPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgaWYgKCFsYWJlbFJhdylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5ub3JtYWxpemVMYWJlbChsYWJlbFJhdyk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZUVsID0gYmxvY2sucXVlcnlTZWxlY3RvcihcIi52YWx1ZVwiKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVFbFxuICAgICAgICAgICAgICAgID8gdmFsdWVFbC5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICA6IHRoaXMuc3RyaXBMYWJlbEZyb21CbG9jayhibG9jaywgbGFiZWxSYXcpO1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIHRoaXMuYXNzaWduRmllbGQoYmFnLCBsYWJlbCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYWc7XG4gICAgfVxuICAgIC8vIFwiV29yayBUZXJtOiAgXCIg4oaSIFwid29yayB0ZXJtXCJcbiAgICBub3JtYWxpemVMYWJlbChsYWJlbCkge1xuICAgICAgICByZXR1cm4gbGFiZWxcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1s6XFxzXSskLywgXCJcIilcbiAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBzdHJpcExhYmVsRnJvbUJsb2NrKGJsb2NrLCBsYWJlbCkge1xuICAgICAgICBjb25zdCBjbG9uZSA9IGJsb2NrLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvcihcIi5sYWJlbFwiKT8ucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiAoY2xvbmUuaW5uZXJIVE1MLnRyaW0oKSB8fFxuICAgICAgICAgICAgY2xvbmUudGV4dENvbnRlbnQ/LnJlcGxhY2UobGFiZWwsIFwiXCIpLnRyaW0oKSB8fFxuICAgICAgICAgICAgXCJcIik7XG4gICAgfVxuICAgIGFzc2lnbkZpZWxkKGJhZywgbm9ybWFsaXplZExhYmVsLCBodG1sVmFsdWUpIHtcbiAgICAgICAgY29uc3QgY2xlYW5lZCA9IHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sVmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGNhbmRpZGF0ZXNdIG9mIE9iamVjdC5lbnRyaWVzKEZJRUxEX0xBQkVMUykpIHtcbiAgICAgICAgICAgIGlmIChjYW5kaWRhdGVzLnNvbWUoKGMpID0+IG5vcm1hbGl6ZWRMYWJlbC5zdGFydHNXaXRoKGMudG9Mb3dlckNhc2UoKSkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiYWdba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBiYWdba2V5XSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPT09IFwicmVzcG9uc2liaWxpdGllc1wiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID09PSBcInJlcXVpcmVtZW50c1wiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID09PSBcInN1bW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaHRtbFZhbHVlIC8vIGtlZXAgSFRNTCBmb3IgYnVsbGV0IHBhcnNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGNsZWFuZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wb3NlRGVzY3JpcHRpb24oZmllbGRzKSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgICAgIGlmIChmaWVsZHMuc3VtbWFyeSlcbiAgICAgICAgICAgIHBhcnRzLnB1c2godGhpcy5jbGVhbkRlc2NyaXB0aW9uKGZpZWxkcy5zdW1tYXJ5KSk7XG4gICAgICAgIGlmIChmaWVsZHMucmVzcG9uc2liaWxpdGllcykge1xuICAgICAgICAgICAgcGFydHMucHVzaChcIlJlc3BvbnNpYmlsaXRpZXM6XCIpO1xuICAgICAgICAgICAgcGFydHMucHVzaCh0aGlzLmNsZWFuRGVzY3JpcHRpb24oZmllbGRzLnJlc3BvbnNpYmlsaXRpZXMpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGRzLnJlcXVpcmVtZW50cykge1xuICAgICAgICAgICAgcGFydHMucHVzaChcIlJlcXVpcmVkIFNraWxsczpcIik7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKHRoaXMuY2xlYW5EZXNjcmlwdGlvbihmaWVsZHMucmVxdWlyZW1lbnRzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnRzLmZpbHRlcihCb29sZWFuKS5qb2luKFwiXFxuXFxuXCIpLnRyaW0oKTtcbiAgICB9XG4gICAgY29tcG9zZUxvY2F0aW9uKGZpZWxkcykge1xuICAgICAgICBpZiAoZmllbGRzLmxvY2F0aW9uRnVsbClcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHMubG9jYXRpb25GdWxsO1xuICAgICAgICBjb25zdCBwaWVjZXMgPSBbXG4gICAgICAgICAgICBmaWVsZHMubG9jYXRpb25DaXR5LFxuICAgICAgICAgICAgZmllbGRzLmxvY2F0aW9uUmVnaW9uLFxuICAgICAgICAgICAgZmllbGRzLmxvY2F0aW9uQ291bnRyeSxcbiAgICAgICAgXVxuICAgICAgICAgICAgLm1hcCgocCkgPT4gcD8udHJpbSgpKVxuICAgICAgICAgICAgLmZpbHRlcigocCkgPT4gISFwICYmIHAubGVuZ3RoID4gMCk7XG4gICAgICAgIHJldHVybiBwaWVjZXMubGVuZ3RoID4gMCA/IHBpZWNlcy5qb2luKFwiLCBcIikgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGRldGVjdFJlbW90ZUZyb21GaWVsZHMoZmllbGRzLCBsb2NhdGlvbiwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgYXJyYW5nZW1lbnQgPSAoZmllbGRzLmVtcGxveW1lbnRBcnJhbmdlbWVudCB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoL3JlbW90ZXx2aXJ0dWFsfHdvcmsgZnJvbSBob21lfGRpc3RyaWJ1dGVkLy50ZXN0KGFycmFuZ2VtZW50KSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAoL2h5YnJpZC8udGVzdChhcnJhbmdlbWVudCkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gaHlicmlkIGltcGxpZXMgc29tZSByZW1vdGVcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8IFwiXCIpIHx8IHRoaXMuZGV0ZWN0UmVtb3RlKGRlc2NyaXB0aW9uKTtcbiAgICB9XG4gICAgY29uZGVuc2VTYWxhcnkocmF3KSB7XG4gICAgICAgIGlmICghcmF3KVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IHJhdy50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIC8vIFByZWZlciB0aGUgZmlyc3QgbGluZSAvIHNlbnRlbmNlIOKAlCB1c3VhbGx5IHRoZSB3YWdlIHJhbmdlLiBJZiBzdGlsbCB0b29cbiAgICAgICAgLy8gbG9uZywgaGFyZC1jYXAgYXQgNDgwIGNoYXJzIHdpdGggYW4gZWxsaXBzaXMgc28gdGhlIHNjaGVtYSB2YWxpZGF0b3JcbiAgICAgICAgLy8gYWNjZXB0cyBpdCAobGltaXQgaXMgNTAwKS5cbiAgICAgICAgY29uc3QgZmlyc3RDaHVuayA9IHRyaW1tZWQuc3BsaXQoL1xcblxcbnxcXG4oPz1bQS1aXSkvKVswXT8udHJpbSgpIHx8IHRyaW1tZWQ7XG4gICAgICAgIGlmIChmaXJzdENodW5rLmxlbmd0aCA8PSA0ODApXG4gICAgICAgICAgICByZXR1cm4gZmlyc3RDaHVuaztcbiAgICAgICAgcmV0dXJuIGZpcnN0Q2h1bmsuc2xpY2UoMCwgNDc3KSArIFwiLi4uXCI7XG4gICAgfVxuICAgIHBhcnNlQnVsbGV0TGlzdChodG1sKSB7XG4gICAgICAgIGlmICghaHRtbClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSlcbiAgICAgICAgICAgIC5tYXAoKGxpKSA9PiBsaS50ZXh0Q29udGVudD8udHJpbSgpIHx8IFwiXCIpXG4gICAgICAgICAgICAuZmlsdGVyKCh0KSA9PiB0Lmxlbmd0aCA+IDApO1xuICAgICAgICByZXR1cm4gaXRlbXMubGVuZ3RoID4gMCA/IGl0ZW1zIDogdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsIi8vIEluZGVlZCBqb2Igc2NyYXBlclxuaW1wb3J0IHsgQmFzZVNjcmFwZXIgfSBmcm9tIFwiLi9iYXNlLXNjcmFwZXJcIjtcbmV4cG9ydCBjbGFzcyBJbmRlZWRTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IFwiaW5kZWVkXCI7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybnMgPSBbXG4gICAgICAgICAgICAvaW5kZWVkXFwuY29tXFwvdmlld2pvYi8sXG4gICAgICAgICAgICAvaW5kZWVkXFwuY29tXFwvam9ic1xcLy8sXG4gICAgICAgICAgICAvaW5kZWVkXFwuY29tXFwvam9iXFwvLyxcbiAgICAgICAgICAgIC9pbmRlZWRcXC5jb21cXC9yY1xcL2Nsay8sXG4gICAgICAgIF07XG4gICAgfVxuICAgIGNhbkhhbmRsZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsUGF0dGVybnMuc29tZSgocCkgPT4gcC50ZXN0KHVybCkpO1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0aW5nKCkge1xuICAgICAgICAvLyBXYWl0IGZvciBqb2IgZGV0YWlscyB0byBsb2FkXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JFbGVtZW50KCcuam9ic2VhcmNoLUpvYkluZm9IZWFkZXItdGl0bGUsIFtkYXRhLXRlc3RpZD1cImpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXRpdGxlXCJdJywgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCBhdmFpbGFibGUgZGF0YVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5leHRyYWN0Sm9iVGl0bGUoKTtcbiAgICAgICAgY29uc3QgY29tcGFueSA9IHRoaXMuZXh0cmFjdENvbXBhbnkoKTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmV4dHJhY3RMb2NhdGlvbigpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZXh0cmFjdERlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWNvbXBhbnkgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gSW5kZWVkIHNjcmFwZXI6IE1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIsIHtcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAhIWRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgc3RydWN0dXJlZERhdGE/LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnlGcm9tUGFnZSgpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5leHRyYWN0U2FsYXJ5KGRlc2NyaXB0aW9uKSB8fFxuICAgICAgICAgICAgICAgIHN0cnVjdHVyZWREYXRhPy5zYWxhcnksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCBcIlwiKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIHNvdXJjZUpvYklkOiB0aGlzLmV4dHJhY3RKb2JJZCgpLFxuICAgICAgICAgICAgcG9zdGVkQXQ6IHN0cnVjdHVyZWREYXRhPy5wb3N0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgam9icyA9IFtdO1xuICAgICAgICAvLyBKb2IgY2FyZHMgaW4gc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgY29uc3Qgam9iQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuam9iX3NlZW5fYmVhY29uLCAuam9ic2VhcmNoLVJlc3VsdHNMaXN0ID4gbGksIFtkYXRhLXRlc3RpZD1cImpvYi1jYXJkXCJdJyk7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBqb2JDYXJkcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuam9iVGl0bGUsIFtkYXRhLXRlc3RpZD1cImpvYlRpdGxlXCJdLCBoMi5qb2JUaXRsZSBhLCAuamNzLUpvYlRpdGxlJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGFueUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuY29tcGFueU5hbWUsIFtkYXRhLXRlc3RpZD1cImNvbXBhbnktbmFtZVwiXSwgLmNvbXBhbnlfbG9jYXRpb24gLmNvbXBhbnlOYW1lJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb25FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignLmNvbXBhbnlMb2NhdGlvbiwgW2RhdGEtdGVzdGlkPVwidGV4dC1sb2NhdGlvblwiXSwgLmNvbXBhbnlfbG9jYXRpb24gLmNvbXBhbnlMb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbGFyeUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuc2FsYXJ5LXNuaXBwZXQtY29udGFpbmVyLCBbZGF0YS10ZXN0aWQ9XCJhdHRyaWJ1dGVfc25pcHBldF90ZXN0aWRcIl0sIC5lc3RpbWF0ZWQtc2FsYXJ5Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBhbnkgPSBjb21wYW55RWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbGFyeSA9IHNhbGFyeUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIC8vIEdldCBVUkwgZnJvbSB0aXRsZSBsaW5rIG9yIGRhdGEgYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHRpdGxlRWw/LmhyZWY7XG4gICAgICAgICAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgam9iS2V5ID0gY2FyZC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWprXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoam9iS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBgaHR0cHM6Ly93d3cuaW5kZWVkLmNvbS92aWV3am9iP2prPSR7am9iS2V5fWA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRpdGxlICYmIGNvbXBhbnkgJiYgdXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGpvYnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbGFyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VKb2JJZDogdGhpcy5leHRyYWN0Sm9iSWRGcm9tVXJsKHVybCksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0NvbHVtYnVzXSBFcnJvciBzY3JhcGluZyBJbmRlZWQgam9iIGNhcmQ6XCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvYnM7XG4gICAgfVxuICAgIGV4dHJhY3RKb2JUaXRsZSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgXCIuam9ic2VhcmNoLUpvYkluZm9IZWFkZXItdGl0bGVcIixcbiAgICAgICAgICAgICdbZGF0YS10ZXN0aWQ9XCJqb2JzZWFyY2gtSm9iSW5mb0hlYWRlci10aXRsZVwiXScsXG4gICAgICAgICAgICBcImgxLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXRpdGxlXCIsXG4gICAgICAgICAgICBcIi5pY2wtdS14cy1tYi0teHMgaDFcIixcbiAgICAgICAgICAgICdoMVtjbGFzcyo9XCJKb2JJbmZvSGVhZGVyXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdENvbXBhbnkoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdbZGF0YS10ZXN0aWQ9XCJpbmxpbmVIZWFkZXItY29tcGFueU5hbWVcIl0gYScsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiaW5saW5lSGVhZGVyLWNvbXBhbnlOYW1lXCJdJyxcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1JbmxpbmVDb21wYW55UmF0aW5nLWNvbXBhbnlIZWFkZXIgYVwiLFxuICAgICAgICAgICAgXCIuam9ic2VhcmNoLUlubGluZUNvbXBhbnlSYXRpbmcgYVwiLFxuICAgICAgICAgICAgXCIuaWNsLXUtbGctbXItLXNtIGFcIixcbiAgICAgICAgICAgICdbZGF0YS1jb21wYW55LW5hbWU9XCJ0cnVlXCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdExvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiaW5saW5lSGVhZGVyLWNvbXBhbnlMb2NhdGlvblwiXScsXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiam9iLWxvY2F0aW9uXCJdJyxcbiAgICAgICAgICAgIFwiLmpvYnNlYXJjaC1Kb2JJbmZvSGVhZGVyLXN1YnRpdGxlID4gZGl2Om50aC1jaGlsZCgyKVwiLFxuICAgICAgICAgICAgXCIuam9ic2VhcmNoLUlubGluZUNvbXBhbnlSYXRpbmcgKyBkaXZcIixcbiAgICAgICAgICAgIFwiLmljbC11LXhzLW10LS14cyAuaWNsLXUtdGV4dENvbG9yLS1zZWNvbmRhcnlcIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dCAmJiAhdGV4dC5pbmNsdWRlcyhcInJldmlld3NcIikgJiYgIXRleHQuaW5jbHVkZXMoXCJyYXRpbmdcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdERlc2NyaXB0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIiNqb2JEZXNjcmlwdGlvblRleHRcIixcbiAgICAgICAgICAgICdbZGF0YS10ZXN0aWQ9XCJqb2JEZXNjcmlwdGlvblRleHRcIl0nLFxuICAgICAgICAgICAgXCIuam9ic2VhcmNoLWpvYkRlc2NyaXB0aW9uVGV4dFwiLFxuICAgICAgICAgICAgXCIuam9ic2VhcmNoLUpvYkNvbXBvbmVudC1kZXNjcmlwdGlvblwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9IHRoaXMuZXh0cmFjdEh0bWxDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdFNhbGFyeUZyb21QYWdlKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAnW2RhdGEtdGVzdGlkPVwiam9ic2VhcmNoLUpvYk1ldGFkYXRhSGVhZGVyLXNhbGFyeUluZm9cIl0nLFxuICAgICAgICAgICAgXCIuam9ic2VhcmNoLUpvYk1ldGFkYXRhSGVhZGVyLXNhbGFyeUluZm9cIixcbiAgICAgICAgICAgIFwiI3NhbGFyeUluZm9BbmRKb2JUeXBlIC5hdHRyaWJ1dGVfc25pcHBldFwiLFxuICAgICAgICAgICAgXCIuam9ic2VhcmNoLUpvYkluZm9IZWFkZXItc2FsYXJ5XCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5pbmNsdWRlcyhcIiRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iSWQoKSB7XG4gICAgICAgIC8vIEZyb20gVVJMIHBhcmFtZXRlclxuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICBjb25zdCBqayA9IHVybFBhcmFtcy5nZXQoXCJqa1wiKTtcbiAgICAgICAgaWYgKGprKVxuICAgICAgICAgICAgcmV0dXJuIGprO1xuICAgICAgICAvLyBGcm9tIFVSTCBwYXRoXG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcL2pvYlxcLyhbYS1mMC05XSspL2kpO1xuICAgICAgICByZXR1cm4gbWF0Y2g/LlsxXTtcbiAgICB9XG4gICAgZXh0cmFjdEpvYklkRnJvbVVybCh1cmwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwodXJsKTtcbiAgICAgICAgICAgIGNvbnN0IGprID0gdXJsT2JqLnNlYXJjaFBhcmFtcy5nZXQoXCJqa1wiKTtcbiAgICAgICAgICAgIGlmIChqaylcbiAgICAgICAgICAgICAgICByZXR1cm4gams7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvam9iXFwvKFthLWYwLTldKykvaSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g/LlsxXTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxkSnNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiXScpO1xuICAgICAgICAgICAgaWYgKCFsZEpzb24/LnRleHRDb250ZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UobGRKc29uLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgIC8vIEluZGVlZCBtYXkgaGF2ZSBhbiBhcnJheSBvZiBzdHJ1Y3R1cmVkIGRhdGFcbiAgICAgICAgICAgIGNvbnN0IGpvYkRhdGEgPSBBcnJheS5pc0FycmF5KGRhdGEpXG4gICAgICAgICAgICAgICAgPyBkYXRhLmZpbmQoKGQpID0+IGRbXCJAdHlwZVwiXSA9PT0gXCJKb2JQb3N0aW5nXCIpXG4gICAgICAgICAgICAgICAgOiBkYXRhO1xuICAgICAgICAgICAgaWYgKCFqb2JEYXRhIHx8IGpvYkRhdGFbXCJAdHlwZVwiXSAhPT0gXCJKb2JQb3N0aW5nXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBqb2JEYXRhLmpvYkxvY2F0aW9uPy5hZGRyZXNzPy5hZGRyZXNzTG9jYWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgam9iRGF0YS5qb2JMb2NhdGlvbj8uYWRkcmVzcz8ubmFtZSxcbiAgICAgICAgICAgICAgICBzYWxhcnk6IGpvYkRhdGEuYmFzZVNhbGFyeT8udmFsdWVcbiAgICAgICAgICAgICAgICAgICAgPyBgJCR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1pblZhbHVlIHx8IFwiXCJ9LSR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8IFwiXCJ9ICR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLnVuaXRUZXh0IHx8IFwiXCJ9YFxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwb3N0ZWRBdDogam9iRGF0YS5kYXRlUG9zdGVkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEdyZWVuaG91c2Ugam9iIGJvYXJkIHNjcmFwZXJcbmltcG9ydCB7IEJhc2VTY3JhcGVyIH0gZnJvbSBcIi4vYmFzZS1zY3JhcGVyXCI7XG5leHBvcnQgY2xhc3MgR3JlZW5ob3VzZVNjcmFwZXIgZXh0ZW5kcyBCYXNlU2NyYXBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc291cmNlID0gXCJncmVlbmhvdXNlXCI7XG4gICAgICAgIHRoaXMudXJsUGF0dGVybnMgPSBbXG4gICAgICAgICAgICAvYm9hcmRzXFwuZ3JlZW5ob3VzZVxcLmlvXFwvW1xcdy1dK1xcL2pvYnNcXC9cXGQrLyxcbiAgICAgICAgICAgIC9bXFx3LV0rXFwuZ3JlZW5ob3VzZVxcLmlvXFwvam9ic1xcL1xcZCsvLFxuICAgICAgICAgICAgL2dyZWVuaG91c2VcXC5pb1xcL2VtYmVkXFwvam9iX2FwcC8sXG4gICAgICAgIF07XG4gICAgfVxuICAgIGNhbkhhbmRsZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsUGF0dGVybnMuc29tZSgocCkgPT4gcC50ZXN0KHVybCkpO1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0aW5nKCkge1xuICAgICAgICAvLyBXYWl0IGZvciBqb2IgY29udGVudCB0byBsb2FkXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JFbGVtZW50KFwiLmFwcC10aXRsZSwgI2hlYWRlciAuY29tcGFueS1uYW1lLCAuam9iLXRpdGxlXCIsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggYXZhaWxhYmxlIGRhdGFcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIEdyZWVuaG91c2Ugc2NyYXBlcjogTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiwge1xuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICEhZGVzY3JpcHRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZWREYXRhID0gdGhpcy5leHRyYWN0U3RydWN0dXJlZERhdGEoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgY29tcGFueSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiB8fCBzdHJ1Y3R1cmVkRGF0YT8ubG9jYXRpb24sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBzYWxhcnk6IHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbikgfHwgc3RydWN0dXJlZERhdGE/LnNhbGFyeSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbikgfHwgc3RydWN0dXJlZERhdGE/LnR5cGUsXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8IFwiXCIpIHx8IHRoaXMuZGV0ZWN0UmVtb3RlKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgc291cmNlSm9iSWQ6IHRoaXMuZXh0cmFjdEpvYklkKCksXG4gICAgICAgICAgICBwb3N0ZWRBdDogc3RydWN0dXJlZERhdGE/LnBvc3RlZEF0LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0KCkge1xuICAgICAgICBjb25zdCBqb2JzID0gW107XG4gICAgICAgIC8vIEpvYiBjYXJkcyBvbiBkZXBhcnRtZW50L2xpc3RpbmcgcGFnZXNcbiAgICAgICAgY29uc3Qgam9iQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub3BlbmluZywgLmpvYi1wb3N0LCBbZGF0YS1tYXBwZWQ9XCJ0cnVlXCJdLCBzZWN0aW9uLmxldmVsLTAgPiBkaXYnKTtcbiAgICAgICAgZm9yIChjb25zdCBjYXJkIG9mIGpvYkNhcmRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoXCJhLCAub3BlbmluZy10aXRsZSwgLmpvYi10aXRsZVwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLCAuam9iLWxvY2F0aW9uLCBzcGFuOmxhc3QtY2hpbGRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbG9jYXRpb25FbD8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSB0aXRsZUVsPy5ocmVmO1xuICAgICAgICAgICAgICAgIC8vIENvbXBhbnkgaXMgdXN1YWxseSBpbiBoZWFkZXJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5leHRyYWN0Q29tcGFueSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aXRsZSAmJiB1cmwgJiYgY29tcGFueSkge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSm9iSWQ6IHRoaXMuZXh0cmFjdEpvYklkRnJvbVVybCh1cmwpLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltDb2x1bWJ1c10gRXJyb3Igc2NyYXBpbmcgR3JlZW5ob3VzZSBqb2IgY2FyZDpcIiwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gam9icztcbiAgICB9XG4gICAgZXh0cmFjdEpvYlRpdGxlKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5hcHAtdGl0bGVcIixcbiAgICAgICAgICAgIFwiLmpvYi10aXRsZVwiLFxuICAgICAgICAgICAgXCJoMS5oZWFkaW5nXCIsXG4gICAgICAgICAgICBcIi5qb2ItaW5mbyBoMVwiLFxuICAgICAgICAgICAgXCIjaGVhZGVyIGgxXCIsXG4gICAgICAgICAgICAnaDFbY2xhc3MqPVwiam9iXCJdJyxcbiAgICAgICAgICAgIFwiLmhlcm8gaDFcIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgc3RydWN0dXJlZCBkYXRhXG4gICAgICAgIGNvbnN0IGxkSnNvbiA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIGlmIChsZEpzb24/LnRpdGxlKVxuICAgICAgICAgICAgcmV0dXJuIGxkSnNvbi50aXRsZTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5jb21wYW55LW5hbWVcIixcbiAgICAgICAgICAgIFwiI2hlYWRlciAuY29tcGFueS1uYW1lXCIsXG4gICAgICAgICAgICBcIi5sb2dvLXdyYXBwZXIgaW1nW2FsdF1cIixcbiAgICAgICAgICAgIFwiLmNvbXBhbnktaGVhZGVyIC5uYW1lXCIsXG4gICAgICAgICAgICAnbWV0YVtwcm9wZXJ0eT1cIm9nOnNpdGVfbmFtZVwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0b3IuaW5jbHVkZXMoXCJtZXRhXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBtZXRhPy5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbGVjdG9yLmluY2x1ZGVzKFwiaW1nW2FsdF1cIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbHQgPSBpbWc/LmdldEF0dHJpYnV0ZShcImFsdFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYWx0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXh0cmFjdCBmcm9tIFVSTCAoYm9hcmRzLmdyZWVuaG91c2UuaW8vQ09NUEFOWS9qb2JzLy4uLilcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvZ3JlZW5ob3VzZVxcLmlvXFwvKFteL10rKS8pO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMV0gIT09IFwiam9ic1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV1cbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvLS9nLCBcIiBcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxiXFx3L2csIChjKSA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0TG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLmxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi5qb2ItbG9jYXRpb25cIixcbiAgICAgICAgICAgIFwiLmNvbXBhbnktbG9jYXRpb25cIixcbiAgICAgICAgICAgIFwiLmpvYi1pbmZvIC5sb2NhdGlvblwiLFxuICAgICAgICAgICAgXCIjaGVhZGVyIC5sb2NhdGlvblwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0RGVzY3JpcHRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiI2NvbnRlbnRcIixcbiAgICAgICAgICAgIFwiLmpvYi1kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgXCIuY29udGVudC13cmFwcGVyIC5jb250ZW50XCIsXG4gICAgICAgICAgICBcIiNqb2JfZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgIFwiLmpvYi1jb250ZW50XCIsXG4gICAgICAgICAgICBcIi5qb2ItaW5mbyAuY29udGVudFwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9IHRoaXMuZXh0cmFjdEh0bWxDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChodG1sICYmIGh0bWwubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW5EZXNjcmlwdGlvbihodG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEpvYklkKCkge1xuICAgICAgICAvLyBGcm9tIFVSTDogYm9hcmRzLmdyZWVuaG91c2UuaW8vY29tcGFueS9qb2JzLzEyMzQ1XG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcL2pvYnNcXC8oXFxkKykvKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9cXC9qb2JzXFwvKFxcZCspLyk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBleHRyYWN0U3RydWN0dXJlZERhdGEoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsZEpzb25FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiXScpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbCBvZiBsZEpzb25FbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGlmICghZWwudGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGVsLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JEYXRhID0gQXJyYXkuaXNBcnJheShkYXRhKVxuICAgICAgICAgICAgICAgICAgICA/IGRhdGEuZmluZCgoZCkgPT4gZFtcIkB0eXBlXCJdID09PSBcIkpvYlBvc3RpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgOiBkYXRhO1xuICAgICAgICAgICAgICAgIGlmICgham9iRGF0YSB8fCBqb2JEYXRhW1wiQHR5cGVcIl0gIT09IFwiSm9iUG9zdGluZ1wiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbXBsb3ltZW50VHlwZSA9IGpvYkRhdGEuZW1wbG95bWVudFR5cGU/LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGU7XG4gICAgICAgICAgICAgICAgaWYgKGVtcGxveW1lbnRUeXBlPy5pbmNsdWRlcyhcImZ1bGxcIikpXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcImZ1bGwtdGltZVwiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVtcGxveW1lbnRUeXBlPy5pbmNsdWRlcyhcInBhcnRcIikpXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcInBhcnQtdGltZVwiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVtcGxveW1lbnRUeXBlPy5pbmNsdWRlcyhcImNvbnRyYWN0XCIpKVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gXCJjb250cmFjdFwiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVtcGxveW1lbnRUeXBlPy5pbmNsdWRlcyhcImludGVyblwiKSlcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IFwiaW50ZXJuc2hpcFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqb2JEYXRhLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogdHlwZW9mIGpvYkRhdGEuam9iTG9jYXRpb24gPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gam9iRGF0YS5qb2JMb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgOiBqb2JEYXRhLmpvYkxvY2F0aW9uPy5hZGRyZXNzPy5hZGRyZXNzTG9jYWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JEYXRhLmpvYkxvY2F0aW9uPy5hZGRyZXNzPy5uYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9iRGF0YS5qb2JMb2NhdGlvbj8ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc2FsYXJ5OiBqb2JEYXRhLmJhc2VTYWxhcnk/LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGAkJHtqb2JEYXRhLmJhc2VTYWxhcnkudmFsdWUubWluVmFsdWUgfHwgXCJcIn0tJHtqb2JEYXRhLmJhc2VTYWxhcnkudmFsdWUubWF4VmFsdWUgfHwgXCJcIn1gXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGpvYkRhdGEuZGF0ZVBvc3RlZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBMZXZlciBqb2IgYm9hcmQgc2NyYXBlclxuaW1wb3J0IHsgQmFzZVNjcmFwZXIgfSBmcm9tIFwiLi9iYXNlLXNjcmFwZXJcIjtcbmV4cG9ydCBjbGFzcyBMZXZlclNjcmFwZXIgZXh0ZW5kcyBCYXNlU2NyYXBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc291cmNlID0gXCJsZXZlclwiO1xuICAgICAgICB0aGlzLnVybFBhdHRlcm5zID0gW1xuICAgICAgICAgICAgL2pvYnNcXC5sZXZlclxcLmNvXFwvW1xcdy1dK1xcL1tcXHctXSsvLFxuICAgICAgICAgICAgL1tcXHctXStcXC5sZXZlclxcLmNvXFwvW1xcdy1dKy8sXG4gICAgICAgIF07XG4gICAgfVxuICAgIGNhbkhhbmRsZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsUGF0dGVybnMuc29tZSgocCkgPT4gcC50ZXN0KHVybCkpO1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0aW5nKCkge1xuICAgICAgICAvLyBXYWl0IGZvciBqb2IgY29udGVudCB0byBsb2FkXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JFbGVtZW50KFwiLnBvc3RpbmctaGVhZGxpbmUgaDIsIC5wb3N0aW5nLWhlYWRsaW5lIGgxLCAuc2VjdGlvbi13cmFwcGVyXCIsIDMwMDApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggYXZhaWxhYmxlIGRhdGFcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZXh0cmFjdEpvYlRpdGxlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSB0aGlzLmV4dHJhY3RDb21wYW55KCk7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5leHRyYWN0TG9jYXRpb24oKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLmV4dHJhY3REZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb21wYW55IHx8ICFkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIExldmVyIHNjcmFwZXI6IE1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIsIHtcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAhIWRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVkRGF0YSA9IHRoaXMuZXh0cmFjdFN0cnVjdHVyZWREYXRhKCk7XG4gICAgICAgIGNvbnN0IGNvbW1pdG1lbnQgPSB0aGlzLmV4dHJhY3RDb21taXRtZW50KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24gfHwgc3RydWN0dXJlZERhdGE/LmxvY2F0aW9uLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICByZXF1aXJlbWVudHM6IHRoaXMuZXh0cmFjdFJlcXVpcmVtZW50cyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBrZXl3b3JkczogdGhpcy5leHRyYWN0S2V5d29yZHMoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgc2FsYXJ5OiB0aGlzLmV4dHJhY3RTYWxhcnkoZGVzY3JpcHRpb24pIHx8IHN0cnVjdHVyZWREYXRhPy5zYWxhcnksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGVGcm9tQ29tbWl0bWVudChjb21taXRtZW50KSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuZGV0ZWN0Sm9iVHlwZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGxvY2F0aW9uIHx8IFwiXCIpIHx8IHRoaXMuZGV0ZWN0UmVtb3RlKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgc291cmNlSm9iSWQ6IHRoaXMuZXh0cmFjdEpvYklkKCksXG4gICAgICAgICAgICBwb3N0ZWRBdDogc3RydWN0dXJlZERhdGE/LnBvc3RlZEF0LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0KCkge1xuICAgICAgICBjb25zdCBqb2JzID0gW107XG4gICAgICAgIC8vIEpvYiBwb3N0aW5ncyBvbiBjb21wYW55IHBhZ2VcbiAgICAgICAgY29uc3Qgam9iQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9zdGluZywgW2RhdGEtcWE9XCJwb3N0aW5nLW5hbWVcIl0nKTtcbiAgICAgICAgZm9yIChjb25zdCBjYXJkIG9mIGpvYkNhcmRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5wb3N0aW5nLXRpdGxlIGg1LCAucG9zdGluZy1uYW1lLCBhW2RhdGEtcWE9XCJwb3N0aW5nLW5hbWVcIl0nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLCAucG9zdGluZy1jYXRlZ29yaWVzIC5zb3J0LWJ5LWxvY2F0aW9uLCAud29ya3BsYWNlVHlwZXNcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWl0bWVudEVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKFwiLmNvbW1pdG1lbnQsIC5wb3N0aW5nLWNhdGVnb3JpZXMgLnNvcnQtYnktY29tbWl0bWVudFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1pdG1lbnQgPSBjb21taXRtZW50RWw/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCdhLnBvc3RpbmctdGl0bGUsIGFbZGF0YS1xYT1cInBvc3RpbmctbmFtZVwiXScpPy5ocmVmIHx8IGNhcmQuaHJlZjtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5leHRyYWN0Q29tcGFueSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aXRsZSAmJiB1cmwgJiYgY29tcGFueSkge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVtZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSm9iSWQ6IHRoaXMuZXh0cmFjdEpvYklkRnJvbVVybCh1cmwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5kZXRlY3RKb2JUeXBlRnJvbUNvbW1pdG1lbnQoY29tbWl0bWVudCA/PyBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ29sdW1idXNdIEVycm9yIHNjcmFwaW5nIExldmVyIGpvYiBjYXJkOlwiLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2JzO1xuICAgIH1cbiAgICBleHRyYWN0Sm9iVGl0bGUoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLnBvc3RpbmctaGVhZGxpbmUgaDJcIixcbiAgICAgICAgICAgIFwiLnBvc3RpbmctaGVhZGxpbmUgaDFcIixcbiAgICAgICAgICAgICdbZGF0YS1xYT1cInBvc3RpbmctbmFtZVwiXScsXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWhlYWRlciBoMlwiLFxuICAgICAgICAgICAgXCIuc2VjdGlvbi5wYWdlLWNlbnRlcmVkLnBvc3RpbmctaGVhZGVyIGgxXCIsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21wYW55KCkge1xuICAgICAgICAvLyBUcnkgbG9nbyBhbHQgdGV4dFxuICAgICAgICBjb25zdCBsb2dvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWhlYWRlci1sb2dvIGltZywgLnBvc3RpbmctaGVhZGVyIC5sb2dvIGltZywgaGVhZGVyIGltZ1wiKTtcbiAgICAgICAgaWYgKGxvZ28pIHtcbiAgICAgICAgICAgIGNvbnN0IGFsdCA9IGxvZ28uZ2V0QXR0cmlidXRlKFwiYWx0XCIpO1xuICAgICAgICAgICAgaWYgKGFsdCAmJiBhbHQgIT09IFwiQ29tcGFueSBMb2dvXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsdDtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgcGFnZSB0aXRsZVxuICAgICAgICBjb25zdCBwYWdlVGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICAgICAgaWYgKHBhZ2VUaXRsZSkge1xuICAgICAgICAgICAgLy8gRm9ybWF0OiBcIkpvYiBUaXRsZSAtIENvbXBhbnkgTmFtZVwiXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHBhZ2VUaXRsZS5zcGxpdChcIiAtIFwiKTtcbiAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKFwiIEpvYnNcIiwgXCJcIikudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEV4dHJhY3QgZnJvbSBVUkxcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvbGV2ZXJcXC5jb1xcLyhbXi9dKykvKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV1cbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvLS9nLCBcIiBcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxiXFx3L2csIChjKSA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBleHRyYWN0TG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLnBvc3RpbmctY2F0ZWdvcmllcyAubG9jYXRpb25cIixcbiAgICAgICAgICAgIFwiLnBvc3RpbmctaGVhZGxpbmUgLmxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi5zb3J0LWJ5LWxvY2F0aW9uXCIsXG4gICAgICAgICAgICBcIi53b3JrcGxhY2VUeXBlc1wiLFxuICAgICAgICAgICAgJ1tkYXRhLXFhPVwicG9zdGluZy1sb2NhdGlvblwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGV4dHJhY3RDb21taXRtZW50KCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5wb3N0aW5nLWNhdGVnb3JpZXMgLmNvbW1pdG1lbnRcIixcbiAgICAgICAgICAgIFwiLnNvcnQtYnktY29tbWl0bWVudFwiLFxuICAgICAgICAgICAgJ1tkYXRhLXFhPVwicG9zdGluZy1jb21taXRtZW50XCJdJyxcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdERlc2NyaXB0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICBcIi5wb3N0aW5nLXBhZ2UgLmNvbnRlbnRcIixcbiAgICAgICAgICAgIFwiLnNlY3Rpb24td3JhcHBlci5wYWdlLWZ1bGwtd2lkdGhcIixcbiAgICAgICAgICAgIFwiLnNlY3Rpb24ucGFnZS1jZW50ZXJlZFwiLFxuICAgICAgICAgICAgJ1tkYXRhLXFhPVwiam9iLWRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgICAgIFwiLnBvc3RpbmctZGVzY3JpcHRpb25cIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIC8vIEZvciBMZXZlciwgd2Ugd2FudCB0byBnZXQgYWxsIGNvbnRlbnQgc2VjdGlvbnNcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoc2VjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBBcnJheS5mcm9tKHNlY3Rpb25zKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChzKSA9PiBzLmlubmVySFRNTClcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cXG5cIik7XG4gICAgICAgICAgICAgICAgaWYgKGh0bWwubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBnZXR0aW5nIHRoZSBtYWluIGNvbnRlbnQgYXJlYVxuICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGVudC13cmFwcGVyIC5jb250ZW50LCBtYWluIC5jb250ZW50XCIpO1xuICAgICAgICBpZiAobWFpbkNvbnRlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24obWFpbkNvbnRlbnQuaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZXh0cmFjdEpvYklkKCkge1xuICAgICAgICAvLyBGcm9tIFVSTDogam9icy5sZXZlci5jby9jb21wYW55L2pvYi1pZC11dWlkXG4gICAgICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL2xldmVyXFwuY29cXC9bXi9dK1xcLyhbYS1mMC05LV0rKS9pKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoPy5bMV07XG4gICAgfVxuICAgIGV4dHJhY3RKb2JJZEZyb21VcmwodXJsKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9sZXZlclxcLmNvXFwvW14vXStcXC8oW2EtZjAtOS1dKykvaSk7XG4gICAgICAgIHJldHVybiBtYXRjaD8uWzFdO1xuICAgIH1cbiAgICBkZXRlY3RKb2JUeXBlRnJvbUNvbW1pdG1lbnQoY29tbWl0bWVudCkge1xuICAgICAgICBpZiAoIWNvbW1pdG1lbnQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBsb3dlciA9IGNvbW1pdG1lbnQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwiZnVsbC10aW1lXCIpIHx8IGxvd2VyLmluY2x1ZGVzKFwiZnVsbCB0aW1lXCIpKVxuICAgICAgICAgICAgcmV0dXJuIFwiZnVsbC10aW1lXCI7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcInBhcnQtdGltZVwiKSB8fCBsb3dlci5pbmNsdWRlcyhcInBhcnQgdGltZVwiKSlcbiAgICAgICAgICAgIHJldHVybiBcInBhcnQtdGltZVwiO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJjb250cmFjdFwiKSB8fCBsb3dlci5pbmNsdWRlcyhcImNvbnRyYWN0b3JcIikpXG4gICAgICAgICAgICByZXR1cm4gXCJjb250cmFjdFwiO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJpbnRlcm5cIikpXG4gICAgICAgICAgICByZXR1cm4gXCJpbnRlcm5zaGlwXCI7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGxkSnNvbkVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCJdJyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGxkSnNvbkVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbC50ZXh0Q29udGVudClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZWwudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvYkRhdGEgPSBBcnJheS5pc0FycmF5KGRhdGEpXG4gICAgICAgICAgICAgICAgICAgID8gZGF0YS5maW5kKChkKSA9PiBkW1wiQHR5cGVcIl0gPT09IFwiSm9iUG9zdGluZ1wiKVxuICAgICAgICAgICAgICAgICAgICA6IGRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKCFqb2JEYXRhIHx8IGpvYkRhdGFbXCJAdHlwZVwiXSAhPT0gXCJKb2JQb3N0aW5nXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB0eXBlb2Ygam9iRGF0YS5qb2JMb2NhdGlvbiA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBqb2JEYXRhLmpvYkxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGpvYkRhdGEuam9iTG9jYXRpb24/LmFkZHJlc3M/LmFkZHJlc3NMb2NhbGl0eSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYkRhdGEuam9iTG9jYXRpb24/Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNhbGFyeTogam9iRGF0YS5iYXNlU2FsYXJ5Py52YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgJCR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1pblZhbHVlIHx8IFwiXCJ9LSR7am9iRGF0YS5iYXNlU2FsYXJ5LnZhbHVlLm1heFZhbHVlIHx8IFwiXCJ9YFxuICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHBvc3RlZEF0OiBqb2JEYXRhLmRhdGVQb3N0ZWQsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gR2VuZXJpYyBqb2Igc2NyYXBlciBmb3IgdW5rbm93biBzaXRlc1xuaW1wb3J0IHsgQmFzZVNjcmFwZXIgfSBmcm9tIFwiLi9iYXNlLXNjcmFwZXJcIjtcbmV4cG9ydCBjbGFzcyBHZW5lcmljU2NyYXBlciBleHRlbmRzIEJhc2VTY3JhcGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBcInVua25vd25cIjtcbiAgICAgICAgdGhpcy51cmxQYXR0ZXJucyA9IFtdO1xuICAgIH1cbiAgICBjYW5IYW5kbGUoX3VybCkge1xuICAgICAgICAvLyBHZW5lcmljIHNjcmFwZXIgYWx3YXlzIHJldHVybnMgdHJ1ZSBhcyBmYWxsYmFja1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXN5bmMgc2NyYXBlSm9iTGlzdGluZygpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGV4dHJhY3Qgam9iIGluZm9ybWF0aW9uIHVzaW5nIGNvbW1vbiBwYXR0ZXJuc1xuICAgICAgICAvLyBDaGVjayBmb3Igc3RydWN0dXJlZCBkYXRhIGZpcnN0XG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZWREYXRhID0gdGhpcy5leHRyYWN0U3RydWN0dXJlZERhdGEoKTtcbiAgICAgICAgaWYgKHN0cnVjdHVyZWREYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RydWN0dXJlZERhdGE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IGNvbW1vbiBzZWxlY3RvcnNcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmZpbmRUaXRsZSgpO1xuICAgICAgICBjb25zdCBjb21wYW55ID0gdGhpcy5maW5kQ29tcGFueSgpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZmluZERlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gR2VuZXJpYyBzY3JhcGVyOiBDb3VsZCBub3QgZmluZCByZXF1aXJlZCBmaWVsZHNcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZmluZExvY2F0aW9uKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnk6IGNvbXBhbnkgfHwgXCJVbmtub3duIENvbXBhbnlcIixcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbiB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBzYWxhcnk6IHRoaXMuZXh0cmFjdFNhbGFyeShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmRldGVjdEpvYlR5cGUoZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgcmVtb3RlOiB0aGlzLmRldGVjdFJlbW90ZShsb2NhdGlvbiB8fCBcIlwiKSB8fCB0aGlzLmRldGVjdFJlbW90ZShkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLmRldGVjdFNvdXJjZSgpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzY3JhcGVKb2JMaXN0KCkge1xuICAgICAgICAvLyBHZW5lcmljIHNjcmFwaW5nIG9mIGpvYiBsaXN0cyBpcyB1bnJlbGlhYmxlXG4gICAgICAgIC8vIFJldHVybiBlbXB0eSBhcnJheSBmb3IgdW5rbm93biBzaXRlc1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGV4dHJhY3RTdHJ1Y3R1cmVkRGF0YSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIExvb2sgZm9yIEpTT04tTEQgam9iIHBvc3Rpbmcgc2NoZW1hXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCJdJyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNjcmlwdCBvZiBzY3JpcHRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2Uoc2NyaXB0LnRleHRDb250ZW50IHx8IFwiXCIpO1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBzaW5nbGUgam9iIHBvc3RpbmdcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtcIkB0eXBlXCJdID09PSBcIkpvYlBvc3RpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUpvYlBvc3RpbmdTY2hlbWEoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBhcnJheSBvZiBpdGVtc1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpvYlBvc3RpbmcgPSBkYXRhLmZpbmQoKGl0ZW0pID0+IGl0ZW1bXCJAdHlwZVwiXSA9PT0gXCJKb2JQb3N0aW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoam9iUG9zdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VKb2JQb3N0aW5nU2NoZW1hKGpvYlBvc3RpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBAZ3JhcGhcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtcIkBncmFwaFwiXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqb2JQb3N0aW5nID0gZGF0YVtcIkBncmFwaFwiXS5maW5kKChpdGVtKSA9PiBpdGVtW1wiQHR5cGVcIl0gPT09IFwiSm9iUG9zdGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpvYlBvc3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSm9iUG9zdGluZ1NjaGVtYShqb2JQb3N0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gQ291bGQgbm90IHBhcnNlIHN0cnVjdHVyZWQgZGF0YTpcIiwgZXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcGFyc2VKb2JQb3N0aW5nU2NoZW1hKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBkYXRhLnRpdGxlIHx8IFwiXCI7XG4gICAgICAgIGNvbnN0IGNvbXBhbnkgPSBkYXRhLmhpcmluZ09yZ2FuaXphdGlvbj8ubmFtZSB8fCBcIlwiO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb24gfHwgXCJcIjtcbiAgICAgICAgLy8gRXh0cmFjdCBsb2NhdGlvblxuICAgICAgICBsZXQgbG9jYXRpb247XG4gICAgICAgIGNvbnN0IGpvYkxvY2F0aW9uID0gZGF0YS5qb2JMb2NhdGlvbjtcbiAgICAgICAgaWYgKGpvYkxvY2F0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gam9iTG9jYXRpb24uYWRkcmVzcztcbiAgICAgICAgICAgIGlmIChhZGRyZXNzKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24gPSBbXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3MuYWRkcmVzc0xvY2FsaXR5LFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzLmFkZHJlc3NSZWdpb24sXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3MuYWRkcmVzc0NvdW50cnksXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXh0cmFjdCBzYWxhcnlcbiAgICAgICAgbGV0IHNhbGFyeTtcbiAgICAgICAgY29uc3QgYmFzZVNhbGFyeSA9IGRhdGEuYmFzZVNhbGFyeTtcbiAgICAgICAgaWYgKGJhc2VTYWxhcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYmFzZVNhbGFyeS52YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbmN5ID0gYmFzZVNhbGFyeS5jdXJyZW5jeSB8fCBcIlVTRFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pbiA9IHZhbHVlLm1pblZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1heCA9IHZhbHVlLm1heFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChtaW4gJiYgbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbGFyeSA9IGAke2N1cnJlbmN5fSAke21pbi50b0xvY2FsZVN0cmluZygpfSAtICR7bWF4LnRvTG9jYWxlU3RyaW5nKCl9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2FsYXJ5ID0gYCR7Y3VycmVuY3l9ICR7dmFsdWUudG9Mb2NhbGVTdHJpbmcoKX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb21wYW55LFxuICAgICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5jbGVhbkRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogdGhpcy5leHRyYWN0UmVxdWlyZW1lbnRzKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIGtleXdvcmRzOiB0aGlzLmV4dHJhY3RLZXl3b3JkcyhkZXNjcmlwdGlvbiksXG4gICAgICAgICAgICBzYWxhcnksXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnBhcnNlRW1wbG95bWVudFR5cGUoZGF0YS5lbXBsb3ltZW50VHlwZSksXG4gICAgICAgICAgICByZW1vdGU6IHRoaXMuZGV0ZWN0UmVtb3RlKGRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuZGV0ZWN0U291cmNlKCksXG4gICAgICAgICAgICBwb3N0ZWRBdDogZGF0YS5kYXRlUG9zdGVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBwYXJzZUVtcGxveW1lbnRUeXBlKHR5cGUpIHtcbiAgICAgICAgaWYgKCF0eXBlKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbG93ZXIgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcImZ1bGxcIikpXG4gICAgICAgICAgICByZXR1cm4gXCJmdWxsLXRpbWVcIjtcbiAgICAgICAgaWYgKGxvd2VyLmluY2x1ZGVzKFwicGFydFwiKSlcbiAgICAgICAgICAgIHJldHVybiBcInBhcnQtdGltZVwiO1xuICAgICAgICBpZiAobG93ZXIuaW5jbHVkZXMoXCJjb250cmFjdFwiKSB8fCBsb3dlci5pbmNsdWRlcyhcInRlbXBvcmFyeVwiKSlcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRyYWN0XCI7XG4gICAgICAgIGlmIChsb3dlci5pbmNsdWRlcyhcImludGVyblwiKSlcbiAgICAgICAgICAgIHJldHVybiBcImludGVybnNoaXBcIjtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZmluZFRpdGxlKCkge1xuICAgICAgICAvLyBDb21tb24gdGl0bGUgc2VsZWN0b3JzXG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdoMVtjbGFzcyo9XCJ0aXRsZVwiXScsXG4gICAgICAgICAgICAnaDFbY2xhc3MqPVwiam9iXCJdJyxcbiAgICAgICAgICAgIFwiLmpvYi10aXRsZVwiLFxuICAgICAgICAgICAgXCIucG9zdGluZy10aXRsZVwiLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJqb2ItdGl0bGVcIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJwb3N0aW5nLXRpdGxlXCJdJyxcbiAgICAgICAgICAgIFwiaDFcIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmV4dHJhY3RUZXh0Q29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDMgJiYgdGV4dC5sZW5ndGggPCAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGNvbW1vbiBub24tdGl0bGUgY29udGVudFxuICAgICAgICAgICAgICAgIGlmICghdGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwic2lnbiBpblwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAhdGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwibG9nIGluXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgZG9jdW1lbnQgdGl0bGVcbiAgICAgICAgY29uc3QgZG9jVGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICAgICAgaWYgKGRvY1RpdGxlICYmIGRvY1RpdGxlLmxlbmd0aCA+IDUpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBjb21tb24gc3VmZml4ZXNcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuZWQgPSBkb2NUaXRsZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMqWy18XVxccyouKyQvLCBcIlwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMqYXRcXHMrLiskL2ksIFwiXCIpXG4gICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChjbGVhbmVkLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZmluZENvbXBhbnkoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdbY2xhc3MqPVwiY29tcGFueS1uYW1lXCJdJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwiZW1wbG95ZXJcIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJvcmdhbml6YXRpb25cIl0nLFxuICAgICAgICAgICAgXCIuY29tcGFueVwiLFxuICAgICAgICAgICAgXCIuZW1wbG95ZXJcIixcbiAgICAgICAgICAgICdhW2hyZWYqPVwiY29tcGFueVwiXScsXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5leHRyYWN0VGV4dENvbnRlbnQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAxICYmIHRleHQubGVuZ3RoIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHJ5IG1ldGEgdGFnc1xuICAgICAgICBjb25zdCBvZ1NpdGVOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cIm9nOnNpdGVfbmFtZVwiXScpO1xuICAgICAgICBpZiAob2dTaXRlTmFtZSkge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IG9nU2l0ZU5hbWUuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kRGVzY3JpcHRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgIFwiLmpvYi1kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgXCIucG9zdGluZy1kZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJqb2ItZGVzY3JpcHRpb25cIl0nLFxuICAgICAgICAgICAgJ1tjbGFzcyo9XCJwb3N0aW5nLWRlc2NyaXB0aW9uXCJdJyxcbiAgICAgICAgICAgICdbY2xhc3MqPVwiZGVzY3JpcHRpb25cIl0nLFxuICAgICAgICAgICAgXCJhcnRpY2xlXCIsXG4gICAgICAgICAgICBcIi5jb250ZW50XCIsXG4gICAgICAgICAgICBcIm1haW5cIixcbiAgICAgICAgXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLmV4dHJhY3RIdG1sQ29udGVudChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoaHRtbCAmJiBodG1sLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFuRGVzY3JpcHRpb24oaHRtbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZpbmRMb2NhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJ1tjbGFzcyo9XCJsb2NhdGlvblwiXScsXG4gICAgICAgICAgICAnW2NsYXNzKj1cImFkZHJlc3NcIl0nLFxuICAgICAgICAgICAgXCIubG9jYXRpb25cIixcbiAgICAgICAgICAgIFwiLmpvYi1sb2NhdGlvblwiLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZXh0cmFjdFRleHRDb250ZW50KHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMiAmJiB0ZXh0Lmxlbmd0aCA8IDEwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBkZXRlY3RTb3VyY2UoKSB7XG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIC8vIFJlbW92ZSBjb21tb24gcHJlZml4ZXNcbiAgICAgICAgY29uc3QgY2xlYW5lZCA9IGhvc3RuYW1lXG4gICAgICAgICAgICAucmVwbGFjZSgvXnd3d1xcLi8sIFwiXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXmpvYnNcXC4vLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15jYXJlZXJzXFwuLywgXCJcIik7XG4gICAgICAgIC8vIEV4dHJhY3QgbWFpbiBkb21haW5cbiAgICAgICAgY29uc3QgcGFydHMgPSBjbGVhbmVkLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbcGFydHMubGVuZ3RoIC0gMl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsZWFuZWQ7XG4gICAgfVxufVxuIiwiLy8gU2NyYXBlciByZWdpc3RyeSAtIG1hcHMgVVJMcyB0byBhcHByb3ByaWF0ZSBzY3JhcGVyc1xuaW1wb3J0IHsgTGlua2VkSW5TY3JhcGVyIH0gZnJvbSBcIi4vbGlua2VkaW4tc2NyYXBlclwiO1xuaW1wb3J0IHsgV2F0ZXJsb29Xb3Jrc1NjcmFwZXIgfSBmcm9tIFwiLi93YXRlcmxvby13b3Jrcy1zY3JhcGVyXCI7XG5pbXBvcnQgeyBJbmRlZWRTY3JhcGVyIH0gZnJvbSBcIi4vaW5kZWVkLXNjcmFwZXJcIjtcbmltcG9ydCB7IEdyZWVuaG91c2VTY3JhcGVyIH0gZnJvbSBcIi4vZ3JlZW5ob3VzZS1zY3JhcGVyXCI7XG5pbXBvcnQgeyBMZXZlclNjcmFwZXIgfSBmcm9tIFwiLi9sZXZlci1zY3JhcGVyXCI7XG5pbXBvcnQgeyBHZW5lcmljU2NyYXBlciB9IGZyb20gXCIuL2dlbmVyaWMtc2NyYXBlclwiO1xuLy8gSW5pdGlhbGl6ZSBhbGwgc2NyYXBlcnNcbmNvbnN0IHNjcmFwZXJzID0gW1xuICAgIG5ldyBMaW5rZWRJblNjcmFwZXIoKSxcbiAgICBuZXcgV2F0ZXJsb29Xb3Jrc1NjcmFwZXIoKSxcbiAgICBuZXcgSW5kZWVkU2NyYXBlcigpLFxuICAgIG5ldyBHcmVlbmhvdXNlU2NyYXBlcigpLFxuICAgIG5ldyBMZXZlclNjcmFwZXIoKSxcbl07XG5jb25zdCBnZW5lcmljU2NyYXBlciA9IG5ldyBHZW5lcmljU2NyYXBlcigpO1xuLyoqXG4gKiBHZXQgdGhlIGFwcHJvcHJpYXRlIHNjcmFwZXIgZm9yIGEgVVJMXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY3JhcGVyRm9yVXJsKHVybCkge1xuICAgIGNvbnN0IHNjcmFwZXIgPSBzY3JhcGVycy5maW5kKChzKSA9PiBzLmNhbkhhbmRsZSh1cmwpKTtcbiAgICByZXR1cm4gc2NyYXBlciB8fCBnZW5lcmljU2NyYXBlcjtcbn1cbi8qKlxuICogQ2hlY2sgaWYgd2UgaGF2ZSBhIHNwZWNpYWxpemVkIHNjcmFwZXIgZm9yIHRoaXMgVVJMXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNTcGVjaWFsaXplZFNjcmFwZXIodXJsKSB7XG4gICAgcmV0dXJuIHNjcmFwZXJzLnNvbWUoKHMpID0+IHMuY2FuSGFuZGxlKHVybCkpO1xufVxuLyoqXG4gKiBHZXQgYWxsIGF2YWlsYWJsZSBzY3JhcGVyIHNvdXJjZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEF2YWlsYWJsZVNvdXJjZXMoKSB7XG4gICAgcmV0dXJuIHNjcmFwZXJzLm1hcCgocykgPT4gcy5zb3VyY2UpO1xufVxuIiwiLy8gT3JjaGVzdHJhdG9yIGZvciBidWxrIFdhdGVybG9vV29ya3Mgc2NyYXBpbmcuIFdhbGtzIHRoZSB2aXNpYmxlIHBvc3RpbmdzXG4vLyB0YWJsZSwgb3BlbnMgZWFjaCByb3cncyBkZXRhaWwgcGFuZWwsIHJ1bnMgdGhlIHNpbmdsZS1wb3N0aW5nIHNjcmFwZXIsIGFuZFxuLy8geWllbGRzIHRoZSByZXN1bHRzLiBUd28gbW9kZXM6XG4vL1xuLy8gICBzY3JhcGVBbGxWaXNpYmxlKCkgICDigJQgY3VycmVudCBwYWdlIG9ubHlcbi8vICAgc2NyYXBlQWxsUGFnaW5hdGVkKCkg4oCUIGN1cnJlbnQgcGFnZSwgdGhlbiBjbGlja3MgXCJOZXh0IHBhZ2VcIiBhbmQgcmVwZWF0c1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHVudGlsIHRoZXJlIGlzIG5vIG5leHQgcGFnZSAob3IgdGhlIGhhcmQgY2FwIGhpdHMpLlxuLy9cbi8vIExpdmVzIGluIHRoZSBjb250ZW50IHNjcmlwdC4gUGFnaW5hdGlvbiArIHJvdyBjbGlja3MgcmVseSBvbiBzZWxlY3RvcnNcbi8vIG9ic2VydmVkIG9uIHRoZSBsaXZlIG1vZGVybiBXVyBVSSBpbiAyMDI2LTA1LiBJZiBXVyByZWRlc2lnbnMgYWdhaW4sIHRoZVxuLy8gb3JjaGVzdHJhdG9yIHdpbGwgcmV0dXJuIFtdIGdyYWNlZnVsbHkgKG5vIGV4Y2VwdGlvbnMgdGhyb3duIHRvIHRoZSBjYWxsZXIpLlxuaW1wb3J0IHsgV2F0ZXJsb29Xb3Jrc1NjcmFwZXIgfSBmcm9tIFwiLi93YXRlcmxvby13b3Jrcy1zY3JhcGVyXCI7XG5jb25zdCBERUZBVUxUX1RIUk9UVExFX01TID0gNTAwO1xuY29uc3QgUk9XX1NFTEVDVE9SID0gXCJ0YWJsZS5kYXRhLXZpZXdlci10YWJsZSB0Ym9keSB0ci50YWJsZV9fcm93LS1ib2R5XCI7XG5jb25zdCBST1dfVElUTEVfTElOS19TRUxFQ1RPUiA9IFwidGQgYVtocmVmPSdqYXZhc2NyaXB0OnZvaWQoMCknXVwiO1xuY29uc3QgUE9TVElOR19QQU5FTF9TRUxFQ1RPUiA9IFwiLmRhc2hib2FyZC1oZWFkZXJfX3Bvc3RpbmctdGl0bGVcIjtcbmNvbnN0IE5FWFRfUEFHRV9TRUxFQ1RPUiA9ICdhLnBhZ2luYXRpb25fX2xpbmtbYXJpYS1sYWJlbD1cIkdvIHRvIG5leHQgcGFnZVwiXSc7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcbmZ1bmN0aW9uIGlzSGlkZGVuKGVsKSB7XG4gICAgaWYgKCFlbClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpO1xufVxuYXN5bmMgZnVuY3Rpb24gd2FpdEZvcihwcmVkaWNhdGUsIHRpbWVvdXRNcywgaW50ZXJ2YWxNcyA9IDEwMCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB3aGlsZSAoRGF0ZS5ub3coKSAtIHN0YXJ0IDwgdGltZW91dE1zKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBhd2FpdCBzbGVlcChpbnRlcnZhbE1zKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IGNsYXNzIFdhdGVybG9vV29ya3NPcmNoZXN0cmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNjcmFwZXIgPSBuZXcgV2F0ZXJsb29Xb3Jrc1NjcmFwZXIoKTtcbiAgICB9XG4gICAgLyoqIFNjcmFwZSBldmVyeSByb3cgdmlzaWJsZSBvbiB0aGUgY3VycmVudCBwYWdlLiAqL1xuICAgIGFzeW5jIHNjcmFwZUFsbFZpc2libGUob3B0cyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHsgam9icyB9ID0gYXdhaXQgdGhpcy5zY3JhcGVDdXJyZW50UGFnZSh7XG4gICAgICAgICAgICBzY3JhcGVkU29GYXI6IDAsXG4gICAgICAgICAgICBwYWdlSW5kZXg6IDEsXG4gICAgICAgICAgICBvcHRzLFxuICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBqb2JzO1xuICAgIH1cbiAgICAvKiogV2FsayBldmVyeSByb3cgYWNyb3NzIGV2ZXJ5IHBhZ2UgKGNhcHBlZCBieSBtYXhKb2JzIC8gbWF4UGFnZXMpLiAqL1xuICAgIGFzeW5jIHNjcmFwZUFsbFBhZ2luYXRlZChvcHRzID0ge30pIHtcbiAgICAgICAgY29uc3QgbWF4Sm9icyA9IG9wdHMubWF4Sm9icyA/PyAyMDA7XG4gICAgICAgIGNvbnN0IG1heFBhZ2VzID0gb3B0cy5tYXhQYWdlcyA/PyA1MDtcbiAgICAgICAgY29uc3QgdGhyb3R0bGUgPSBvcHRzLnRocm90dGxlTXMgPz8gREVGQVVMVF9USFJPVFRMRV9NUztcbiAgICAgICAgY29uc3QgYWxsSm9icyA9IFtdO1xuICAgICAgICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgICAgICAgbGV0IHBhZ2VJbmRleCA9IDE7XG4gICAgICAgIHdoaWxlIChwYWdlSW5kZXggPD0gbWF4UGFnZXMgJiYgYWxsSm9icy5sZW5ndGggPCBtYXhKb2JzKSB7XG4gICAgICAgICAgICBjb25zdCB7IGpvYnMsIHN0b3BSZWFzb24gfSA9IGF3YWl0IHRoaXMuc2NyYXBlQ3VycmVudFBhZ2Uoe1xuICAgICAgICAgICAgICAgIHNjcmFwZWRTb0ZhcjogYWxsSm9icy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcGFnZUluZGV4LFxuICAgICAgICAgICAgICAgIG9wdHM6IHsgLi4ub3B0cywgbWF4Sm9icyB9LFxuICAgICAgICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWxsSm9icy5wdXNoKC4uLmpvYnMpO1xuICAgICAgICAgICAgaWYgKHN0b3BSZWFzb24gPT09IFwiY2FwLWhpdFwiKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gVHJ5IHRvIGdvIHRvIHRoZSBuZXh0IHBhZ2VcbiAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VkID0gYXdhaXQgdGhpcy5nb1RvTmV4dFBhZ2UodGhyb3R0bGUpO1xuICAgICAgICAgICAgaWYgKCFhZHZhbmNlZClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHBhZ2VJbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIG9wdHMub25Qcm9ncmVzcz8uKHtcbiAgICAgICAgICAgIHNjcmFwZWRDb3VudDogYWxsSm9icy5sZW5ndGgsXG4gICAgICAgICAgICBhdHRlbXB0ZWRDb3VudDogYWxsSm9icy5sZW5ndGgsXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogcGFnZUluZGV4LFxuICAgICAgICAgICAgdG90YWxSb3dzT25QYWdlOiB0aGlzLmdldFJvd3MoKS5sZW5ndGgsXG4gICAgICAgICAgICBkb25lOiB0cnVlLFxuICAgICAgICAgICAgZXJyb3JzLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFsbEpvYnM7XG4gICAgfVxuICAgIGFzeW5jIHNjcmFwZUN1cnJlbnRQYWdlKGFyZ3MpIHtcbiAgICAgICAgY29uc3QgeyBzY3JhcGVkU29GYXIsIHBhZ2VJbmRleCwgb3B0cywgZXJyb3JzIH0gPSBhcmdzO1xuICAgICAgICBjb25zdCBtYXhKb2JzID0gb3B0cy5tYXhKb2JzID8/IDIwMDtcbiAgICAgICAgY29uc3QgdGhyb3R0bGUgPSBvcHRzLnRocm90dGxlTXMgPz8gREVGQVVMVF9USFJPVFRMRV9NUztcbiAgICAgICAgY29uc3Qgcm93cyA9IHRoaXMuZ2V0Um93cygpO1xuICAgICAgICBjb25zdCBqb2JzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHNjcmFwZWRTb0ZhciArIGpvYnMubGVuZ3RoID49IG1heEpvYnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBqb2JzLCBzdG9wUmVhc29uOiBcImNhcC1oaXRcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmUtZmV0Y2ggdGhlIHJvdyBlYWNoIGl0ZXJhdGlvbiDigJQgdGhlIERPTSBtYXkgcmVidWlsZCBhZnRlciBwYW5lbCBjbG9zZS5cbiAgICAgICAgICAgIGNvbnN0IGxpdmVSb3dzID0gdGhpcy5nZXRSb3dzKCk7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBsaXZlUm93c1tpXTtcbiAgICAgICAgICAgIGlmICghcm93KVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY29uc3QgdGl0bGVMaW5rID0gcm93LnF1ZXJ5U2VsZWN0b3IoUk9XX1RJVExFX0xJTktfU0VMRUNUT1IpO1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRUaXRsZSA9IHRpdGxlTGluaz8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgICAgICAgICAgIGlmICghdGl0bGVMaW5rKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gQ2FwdHVyZSB0aGUgcGFuZWwncyBjdXJyZW50IHRpdGxlIHNvIHdlIGNhbiBkZXRlY3Qgd2hlbiB0aGUgbmV3XG4gICAgICAgICAgICAvLyBwb3N0aW5nJ3MgY29udGVudCBoYXMgYWN0dWFsbHkgcmVuZGVyZWQgKHRoZSBwYW5lbCBtYXkgYWxyZWFkeSBiZVxuICAgICAgICAgICAgLy8gdmlzaWJsZSBmcm9tIGEgcHJldmlvdXMgcm93KS5cbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzUGFuZWxUaXRsZSA9IGRvY3VtZW50XG4gICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoUE9TVElOR19QQU5FTF9TRUxFQ1RPUiArIFwiIGgyXCIpXG4gICAgICAgICAgICAgICAgPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICAgICAgdGl0bGVMaW5rLmNsaWNrKCk7XG4gICAgICAgICAgICBjb25zdCBvcGVuZWQgPSBhd2FpdCB3YWl0Rm9yKCgpID0+ICEhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihQT1NUSU5HX1BBTkVMX1NFTEVDVE9SKSwgNTAwMCk7XG4gICAgICAgICAgICBpZiAoIW9wZW5lZCkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGByb3cgJHtpfSAoJHtleHBlY3RlZFRpdGxlfSk6IHBhbmVsIGRpZCBub3Qgb3BlbmApO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIHBhbmVsJ3MgaDIgdG8gdXBkYXRlIChvciBhcHBlYXIgZm9yIHRoZSBmaXJzdCB0aW1lKSBBTkRcbiAgICAgICAgICAgIC8vIGZvciBwb3N0aW5nLXNwZWNpZmljIGZpZWxkIHJvd3MgdG8gYmUgcHJlc2VudC4gV2UgY2hlY2sgZm9yIGFcbiAgICAgICAgICAgIC8vIHJlY29nbmlzYWJsZSBsYWJlbCBsaWtlIFwiSm9iIFRpdGxlXCIg4oCUIHNlYXJjaCBmaWx0ZXJzIHNoYXJlIHRoZSBzYW1lXG4gICAgICAgICAgICAvLyAudGFnX19rZXktdmFsdWUtbGlzdCBjbGFzcyBzbyBhIG5vbi16ZXJvIGNvdW50IGlzIG5vdCBhIHJlbGlhYmxlXG4gICAgICAgICAgICAvLyBzaWduYWwgdGhhdCB0aGUgcG9zdGluZyBib2R5IGhhcyByZW5kZXJlZC5cbiAgICAgICAgICAgIGNvbnN0IGZ1bGx5UmVuZGVyZWQgPSBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoMiA9IGRvY3VtZW50XG4gICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFBPU1RJTkdfUEFORUxfU0VMRUNUT1IgKyBcIiBoMlwiKVxuICAgICAgICAgICAgICAgICAgICA/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFoMilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1BhbmVsVGl0bGUgJiYgaDIgPT09IHByZXZpb3VzUGFuZWxUaXRsZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50YWdfX2tleS12YWx1ZS1saXN0LmpzLS1xdWVzdGlvbi0tY29udGFpbmVyIC5sYWJlbFwiKSkubWFwKChlbCkgPT4gKGVsLnRleHRDb250ZW50IHx8IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWxzLnNvbWUoKGwpID0+IGwuc3RhcnRzV2l0aChcImpvYiB0aXRsZVwiKSB8fCBsLnN0YXJ0c1dpdGgoXCJvcmdhbml6YXRpb25cIikpO1xuICAgICAgICAgICAgfSwgODAwMCk7XG4gICAgICAgICAgICBpZiAoIWZ1bGx5UmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChgcm93ICR7aX0gKCR7ZXhwZWN0ZWRUaXRsZX0pOiBwYW5lbCBuZXZlciBmdWxseSByZW5kZXJlZGApO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgc2xlZXAodGhyb3R0bGUpO1xuICAgICAgICAgICAgbGV0IGpvYiA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGpvYiA9IGF3YWl0IHRoaXMuc2NyYXBlci5zY3JhcGVKb2JMaXN0aW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goYHJvdyAke2l9ICgke2V4cGVjdGVkVGl0bGV9KTogJHtTdHJpbmcoZXJyKS5zbGljZSgwLCAyMDApfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGpvYilcbiAgICAgICAgICAgICAgICBqb2JzLnB1c2goam9iKTtcbiAgICAgICAgICAgIG9wdHMub25Qcm9ncmVzcz8uKHtcbiAgICAgICAgICAgICAgICBzY3JhcGVkQ291bnQ6IHNjcmFwZWRTb0ZhciArIGpvYnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGF0dGVtcHRlZENvdW50OiBzY3JhcGVkU29GYXIgKyBpICsgMSxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogcGFnZUluZGV4LFxuICAgICAgICAgICAgICAgIHRvdGFsUm93c09uUGFnZTogbGl2ZVJvd3MubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGxhc3RUaXRsZTogam9iPy50aXRsZSB8fCBleHBlY3RlZFRpdGxlLFxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gTm8gbmVlZCB0byBleHBsaWNpdGx5IGNsb3NlIHRoZSBwYW5lbCDigJQgY2xpY2tpbmcgdGhlIG5leHQgcm93IHJlcGxhY2VzXG4gICAgICAgICAgICAvLyBpdHMgY29udGVudC4gV2Ugb25seSBzdG9wIGhlcmUgaWYgdGhpcyB3YXMgdGhlIGxhc3Qgcm93IG9uIHRoZSBwYWdlLlxuICAgICAgICAgICAgYXdhaXQgc2xlZXAodGhyb3R0bGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGpvYnMgfTtcbiAgICB9XG4gICAgYXN5bmMgZ29Ub05leHRQYWdlKHRocm90dGxlTXMpIHtcbiAgICAgICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTkVYVF9QQUdFX1NFTEVDVE9SKTtcbiAgICAgICAgaWYgKCFuZXh0QnRuIHx8IGlzSGlkZGVuKG5leHRCdG4pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyBDYXB0dXJlIHRoZSBmaXJzdCByb3cncyBzaWduYXR1cmUgdG8gZGV0ZWN0IHdoZW4gdGhlIHBhZ2UgaGFzIGNoYW5nZWQuXG4gICAgICAgIGNvbnN0IGJlZm9yZVNpZyA9IHRoaXMuZmlyc3RSb3dTaWduYXR1cmUoKTtcbiAgICAgICAgbmV4dEJ0bi5jbGljaygpO1xuICAgICAgICBjb25zdCBjaGFuZ2VkID0gYXdhaXQgd2FpdEZvcigoKSA9PiB0aGlzLmZpcnN0Um93U2lnbmF0dXJlKCkgIT09IGJlZm9yZVNpZyAmJiB0aGlzLmdldFJvd3MoKS5sZW5ndGggPiAwLCA4MDAwKTtcbiAgICAgICAgaWYgKCFjaGFuZ2VkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBhd2FpdCBzbGVlcCh0aHJvdHRsZU1zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGdldFJvd3MoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoUk9XX1NFTEVDVE9SKSk7XG4gICAgfVxuICAgIGZpcnN0Um93U2lnbmF0dXJlKCkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd3MoKVswXTtcbiAgICAgICAgcmV0dXJuIHJvdz8udGV4dENvbnRlbnQ/LnRyaW0oKS5zbGljZSgwLCAxMjApIHx8IFwiXCI7XG4gICAgfVxufVxuIiwiLy8gTWVzc2FnZSBwYXNzaW5nIHV0aWxpdGllcyBmb3IgZXh0ZW5zaW9uIGNvbW11bmljYXRpb25cbi8vIFR5cGUtc2FmZSBtZXNzYWdlIGNyZWF0b3JzXG5leHBvcnQgY29uc3QgTWVzc2FnZXMgPSB7XG4gICAgLy8gQXV0aCBtZXNzYWdlc1xuICAgIGdldEF1dGhTdGF0dXM6ICgpID0+ICh7IHR5cGU6IFwiR0VUX0FVVEhfU1RBVFVTXCIgfSksXG4gICAgb3BlbkF1dGg6ICgpID0+ICh7IHR5cGU6IFwiT1BFTl9BVVRIXCIgfSksXG4gICAgbG9nb3V0OiAoKSA9PiAoeyB0eXBlOiBcIkxPR09VVFwiIH0pLFxuICAgIC8vIFByb2ZpbGUgbWVzc2FnZXNcbiAgICBnZXRQcm9maWxlOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9QUk9GSUxFXCIgfSksXG4gICAgZ2V0U2V0dGluZ3M6ICgpID0+ICh7IHR5cGU6IFwiR0VUX1NFVFRJTkdTXCIgfSksXG4gICAgLy8gRm9ybSBmaWxsaW5nIG1lc3NhZ2VzXG4gICAgZmlsbEZvcm06IChmaWVsZHMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiRklMTF9GT1JNXCIsXG4gICAgICAgIHBheWxvYWQ6IGZpZWxkcyxcbiAgICB9KSxcbiAgICAvLyBTY3JhcGluZyBtZXNzYWdlc1xuICAgIHNjcmFwZUpvYjogKCkgPT4gKHsgdHlwZTogXCJTQ1JBUEVfSk9CXCIgfSksXG4gICAgc2NyYXBlSm9iTGlzdDogKCkgPT4gKHsgdHlwZTogXCJTQ1JBUEVfSk9CX0xJU1RcIiB9KSxcbiAgICBpbXBvcnRKb2I6IChqb2IpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiSU1QT1JUX0pPQlwiLFxuICAgICAgICBwYXlsb2FkOiBqb2IsXG4gICAgfSksXG4gICAgaW1wb3J0Sm9ic0JhdGNoOiAoam9icykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJJTVBPUlRfSk9CU19CQVRDSFwiLFxuICAgICAgICBwYXlsb2FkOiBqb2JzLFxuICAgIH0pLFxuICAgIHRyYWNrQXBwbGllZDogKHBheWxvYWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiVFJBQ0tfQVBQTElFRFwiLFxuICAgICAgICBwYXlsb2FkLFxuICAgIH0pLFxuICAgIG9wZW5EYXNoYm9hcmQ6ICgpID0+ICh7IHR5cGU6IFwiT1BFTl9EQVNIQk9BUkRcIiB9KSxcbiAgICBjYXB0dXJlVmlzaWJsZVRhYjogKCkgPT4gKHsgdHlwZTogXCJDQVBUVVJFX1ZJU0lCTEVfVEFCXCIgfSksXG4gICAgdGFpbG9yRnJvbVBhZ2U6IChqb2IpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiVEFJTE9SX0ZST01fUEFHRVwiLFxuICAgICAgICBwYXlsb2FkOiBqb2IsXG4gICAgfSksXG4gICAgZ2VuZXJhdGVDb3ZlckxldHRlckZyb21QYWdlOiAoam9iKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkdFTkVSQVRFX0NPVkVSX0xFVFRFUl9GUk9NX1BBR0VcIixcbiAgICAgICAgcGF5bG9hZDogam9iLFxuICAgIH0pLFxuICAgIC8vIExlYXJuaW5nIG1lc3NhZ2VzXG4gICAgc2F2ZUFuc3dlcjogKGRhdGEpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiU0FWRV9BTlNXRVJcIixcbiAgICAgICAgcGF5bG9hZDogZGF0YSxcbiAgICB9KSxcbiAgICBzZWFyY2hBbnN3ZXJzOiAocXVlc3Rpb24pID0+ICh7XG4gICAgICAgIHR5cGU6IFwiU0VBUkNIX0FOU1dFUlNcIixcbiAgICAgICAgcGF5bG9hZDogcXVlc3Rpb24sXG4gICAgfSksXG4gICAgam9iRGV0ZWN0ZWQ6IChtZXRhKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkpPQl9ERVRFQ1RFRFwiLFxuICAgICAgICBwYXlsb2FkOiBtZXRhLFxuICAgIH0pLFxuICAgIC8vIFdhdGVybG9vV29ya3Mtc3BlY2lmaWMgYnVsayBzY3JhcGluZyAoZHJpdmVuIGZyb20gcG9wdXAsIGV4ZWN1dGVkIGluIGNvbnRlbnRcbiAgICAvLyBzY3JpcHQgYnkgd2F0ZXJsb28td29ya3Mtb3JjaGVzdHJhdG9yLnRzKS5cbiAgICB3d1NjcmFwZUFsbFZpc2libGU6ICgpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiV1dfU0NSQVBFX0FMTF9WSVNJQkxFXCIsXG4gICAgfSksXG4gICAgd3dTY3JhcGVBbGxQYWdpbmF0ZWQ6IChvcHRzKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIldXX1NDUkFQRV9BTExfUEFHSU5BVEVEXCIsXG4gICAgICAgIHBheWxvYWQ6IG9wdHMgPz8ge30sXG4gICAgfSksXG4gICAgd3dHZXRQYWdlU3RhdGU6ICgpID0+ICh7IHR5cGU6IFwiV1dfR0VUX1BBR0VfU1RBVEVcIiB9KSxcbn07XG4vLyBTZW5kIG1lc3NhZ2UgdG8gYmFja2dyb3VuZCBzY3JpcHRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSB8fCB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyByZXNwb25zZSByZWNlaXZlZFwiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIFNlbmQgbWVzc2FnZSB0byBjb250ZW50IHNjcmlwdCBpbiBzcGVjaWZpYyB0YWJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kVG9UYWIodGFiSWQsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSB8fCB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyByZXNwb25zZSByZWNlaXZlZFwiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIFNlbmQgbWVzc2FnZSB0byBhbGwgY29udGVudCBzY3JpcHRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgICBmb3IgKGNvbnN0IHRhYiBvZiB0YWJzKSB7XG4gICAgICAgIGlmICh0YWIuaWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAvLyBUYWIgbWlnaHQgbm90IGhhdmUgY29udGVudCBzY3JpcHQgbG9hZGVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2hvd0FwcGxpZWRUb2FzdChjb21wYW55LCBvbkNsaWNrKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb2x1bWJ1cy10b2FzdC1hcHBsaWVkXCIpPy5yZW1vdmUoKTtcbiAgICBjb25zdCB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdG9hc3QuY2xhc3NOYW1lID0gXCJjb2x1bWJ1cy10b2FzdCBjb2x1bWJ1cy10b2FzdC1hcHBsaWVkXCI7XG4gICAgdG9hc3QudGFiSW5kZXggPSAwO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gICAgdG9hc3Quc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIk9wZW4gU2xvdGhpbmcgZGFzaGJvYXJkXCIpO1xuICAgIHRvYXN0LnRleHRDb250ZW50ID0gYOKckyBUcmFja2VkIGluIFNsb3RoaW5nIC0gYXBwbGllZCB0byAke2NvbXBhbnl9YDtcbiAgICBjb25zdCBkaXNtaXNzID0gKCkgPT4gdG9hc3QucmVtb3ZlKCk7XG4gICAgY29uc3QgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoZGlzbWlzcywgNjAwMCk7XG4gICAgdG9hc3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBvbkNsaWNrKCk7XG4gICAgICAgIGRpc21pc3MoKTtcbiAgICB9KTtcbiAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2ZW50LmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0b2FzdC5jbGljaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIGRpc21pc3MoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9hc3QpO1xufVxuIiwiaW1wb3J0IHsgc2VuZE1lc3NhZ2UsIE1lc3NhZ2VzIH0gZnJvbSBcIkAvc2hhcmVkL21lc3NhZ2VzXCI7XG5jb25zdCBNQVhfSEVBRExJTkVfTEVOR1RIID0gMjAwO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkUGFnZVNuYXBzaG90KHsgY2FwdHVyZVNjcmVlbnNob3QsIH0pIHtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnRpdGxlLnRyaW0oKTtcbiAgICBjb25zdCBoZWFkbGluZSA9IG5vcm1hbGl6ZVRleHQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpPy50ZXh0Q29udGVudCB8fCB0aXRsZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgaGVhZGxpbmU6IGhlYWRsaW5lID8gdHJ1bmNhdGUoaGVhZGxpbmUsIE1BWF9IRUFETElORV9MRU5HVEgpIDogdW5kZWZpbmVkLFxuICAgICAgICBzdWJtaXR0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB0aHVtYm5haWxEYXRhVXJsOiBjYXB0dXJlU2NyZWVuc2hvdFxuICAgICAgICAgICAgPyBhd2FpdCBjYXB0dXJlVmlzaWJsZVRhYlNhZmVseSgpXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICB9O1xufVxuZnVuY3Rpb24gbm9ybWFsaXplVGV4dCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5mdW5jdGlvbiB0cnVuY2F0ZSh2YWx1ZSwgbWF4TGVuZ3RoKSB7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA8PSBtYXhMZW5ndGgpXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWUuc2xpY2UoMCwgbWF4TGVuZ3RoIC0gMSkudHJpbUVuZCgpO1xufVxuYXN5bmMgZnVuY3Rpb24gY2FwdHVyZVZpc2libGVUYWJTYWZlbHkoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5jYXB0dXJlVmlzaWJsZVRhYigpKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN1Y2Nlc3MgPyByZXNwb25zZS5kYXRhPy5kYXRhVXJsIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgYnVpbGRQYWdlU25hcHNob3QgfSBmcm9tIFwiLi9wYWdlLXNuYXBzaG90XCI7XG5jb25zdCBBUFBMSUNBVElPTl9GSUVMRF9UWVBFUyA9IG5ldyBTZXQoW1xuICAgIFwiZmlyc3ROYW1lXCIsXG4gICAgXCJsYXN0TmFtZVwiLFxuICAgIFwiZnVsbE5hbWVcIixcbiAgICBcImVtYWlsXCIsXG4gICAgXCJwaG9uZVwiLFxuICAgIFwibGlua2VkaW5cIixcbiAgICBcImdpdGh1YlwiLFxuICAgIFwid2Vic2l0ZVwiLFxuICAgIFwicG9ydGZvbGlvXCIsXG4gICAgXCJyZXN1bWVcIixcbiAgICBcImNvdmVyTGV0dGVyXCIsXG4gICAgXCJ3b3JrQXV0aG9yaXphdGlvblwiLFxuICAgIFwic3BvbnNvcnNoaXBcIixcbiAgICBcImN1c3RvbVF1ZXN0aW9uXCIsXG5dKTtcbmNvbnN0IEJMT0NLRURfRk9STV9LRVlXT1JEUyA9IFtcbiAgICBcImxvZ2luXCIsXG4gICAgXCJsb2cgaW5cIixcbiAgICBcInNpZ25pblwiLFxuICAgIFwic2lnbiBpblwiLFxuICAgIFwic2lnbnVwXCIsXG4gICAgXCJzaWduIHVwXCIsXG4gICAgXCJyZWdpc3RlclwiLFxuICAgIFwic2VhcmNoXCIsXG4gICAgXCJzdWJzY3JpYmVcIixcbiAgICBcIm5ld3NsZXR0ZXJcIixcbl07XG5leHBvcnQgY2xhc3MgU3VibWl0V2F0Y2hlciB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLmhhbmRsZWRGb3JtcyA9IG5ldyBXZWFrU2V0KCk7XG4gICAgICAgIHRoaXMucGVuZGluZ0Zvcm1zID0gbmV3IFdlYWtTZXQoKTtcbiAgICAgICAgdGhpcy50cmFja2VkVXJscyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGlmICghKGZvcm0gaW5zdGFuY2VvZiBIVE1MRm9ybUVsZW1lbnQpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZvaWQgdGhpcy50cmFja0Zvcm1TdWJtaXQoZm9ybSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgdGhpcy5oYW5kbGVTdWJtaXQsIHRydWUpO1xuICAgICAgICB0aGlzLmF0dGFjaGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgZGV0YWNoKCkge1xuICAgICAgICBpZiAoIXRoaXMuYXR0YWNoZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgdGhpcy5oYW5kbGVTdWJtaXQsIHRydWUpO1xuICAgICAgICB0aGlzLmF0dGFjaGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGFzeW5jIHRyYWNrRm9ybVN1Ym1pdChmb3JtKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZWRGb3Jtcy5oYXMoZm9ybSkgfHxcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ0Zvcm1zLmhhcyhmb3JtKSB8fFxuICAgICAgICAgICAgdGhpcy50cmFja2VkVXJscy5oYXMod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZW5kaW5nRm9ybXMuYWRkKGZvcm0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLm9wdGlvbnMuZ2V0U2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGlmICghc2V0dGluZ3MuYXV0b1RyYWNrQXBwbGljYXRpb25zRW5hYmxlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBkZXRlY3RlZEZpZWxkcyA9IHRoaXMub3B0aW9ucy5nZXREZXRlY3RlZEZpZWxkcyhmb3JtKTtcbiAgICAgICAgICAgIGlmIChpc0xpa2VseVNlYXJjaE9yTG9naW5Gb3JtKGZvcm0sIHdpbmRvdy5sb2NhdGlvbi5ocmVmKSB8fFxuICAgICAgICAgICAgICAgICFsb29rc0xpa2VBcHBsaWNhdGlvbkZvcm0oZGV0ZWN0ZWRGaWVsZHMsIGZvcm0sIHRoaXMub3B0aW9ucy53YXNBdXRvZmlsbGVkKGZvcm0pKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlZEZvcm1zLmFkZChmb3JtKTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tlZFVybHMuYWRkKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgYnVpbGRQYWdlU25hcHNob3Qoe1xuICAgICAgICAgICAgICAgIGNhcHR1cmVTY3JlZW5zaG90OiBzZXR0aW5ncy5jYXB0dXJlU2NyZWVuc2hvdEVuYWJsZWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMub3B0aW9ucy5vblRyYWNrZWQoe1xuICAgICAgICAgICAgICAgIC4uLnNuYXBzaG90LFxuICAgICAgICAgICAgICAgIHNjcmFwZWRKb2I6IHRoaXMub3B0aW9ucy5nZXRTY3JhcGVkSm9iKCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ0Zvcm1zLmRlbGV0ZShmb3JtKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0xpa2VseVNlYXJjaE9yTG9naW5Gb3JtKGZvcm0sIHVybCkge1xuICAgIGNvbnN0IHVybFRleHQgPSB1cmwudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoLyhcXC98XFxiKShsb2dpbnxzaWduaW58c2lnbnVwfHJlZ2lzdGVyfHNlYXJjaCkoXFwvfFxcP3wjfFxcYikvLnRlc3QodXJsVGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHRleHQgPSBbXG4gICAgICAgIGZvcm0uaWQsXG4gICAgICAgIGZvcm0uY2xhc3NOYW1lLFxuICAgICAgICBmb3JtLmdldEF0dHJpYnV0ZShcIm5hbWVcIiksXG4gICAgICAgIGZvcm0uZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSxcbiAgICAgICAgZm9ybS5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIiksXG4gICAgICAgIGZvcm0udGV4dENvbnRlbnQsXG4gICAgXVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgIC5qb2luKFwiIFwiKVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoQkxPQ0tFRF9GT1JNX0tFWVdPUkRTLnNvbWUoKGtleXdvcmQpID0+IHRleHQuaW5jbHVkZXMoa2V5d29yZCkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dHMgPSBBcnJheS5mcm9tKGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpKTtcbiAgICByZXR1cm4gaW5wdXRzLnNvbWUoKGlucHV0KSA9PiB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBpbnB1dC50eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHtpbnB1dC5uYW1lfSAke2lucHV0LmlkfSAke2lucHV0LnBsYWNlaG9sZGVyfWAudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwic2VhcmNoXCIgfHwgbmFtZS5pbmNsdWRlcyhcInNlYXJjaFwiKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VBcHBsaWNhdGlvbkZvcm0oZGV0ZWN0ZWRGaWVsZHMsIGZvcm0sIHdhc0F1dG9maWxsZWQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGhpZ2hDb25maWRlbmNlQXBwbGljYXRpb25GaWVsZHMgPSBkZXRlY3RlZEZpZWxkcy5maWx0ZXIoKGZpZWxkKSA9PiBmaWVsZC5jb25maWRlbmNlID49IDAuMyAmJiBBUFBMSUNBVElPTl9GSUVMRF9UWVBFUy5oYXMoZmllbGQuZmllbGRUeXBlKSk7XG4gICAgaWYgKHdhc0F1dG9maWxsZWQgJiYgaGlnaENvbmZpZGVuY2VBcHBsaWNhdGlvbkZpZWxkcy5sZW5ndGggPj0gMikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGhpZ2hDb25maWRlbmNlQXBwbGljYXRpb25GaWVsZHMubGVuZ3RoID49IDMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGZvcm1UZXh0ID0gW1xuICAgICAgICBmb3JtLmlkLFxuICAgICAgICBmb3JtLmNsYXNzTmFtZSxcbiAgICAgICAgZm9ybS5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIiksXG4gICAgICAgIGZvcm0udGV4dENvbnRlbnQsXG4gICAgXVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgIC5qb2luKFwiIFwiKVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gKHdhc0F1dG9maWxsZWQgJiZcbiAgICAgICAgaGlnaENvbmZpZGVuY2VBcHBsaWNhdGlvbkZpZWxkcy5sZW5ndGggPiAwICYmXG4gICAgICAgIC9cXGIoYXBwbHl8YXBwbGljYXRpb258cmVzdW1lfGNvdmVyIGxldHRlcnxzdWJtaXQgYXBwbGljYXRpb24pXFxiLy50ZXN0KGZvcm1UZXh0KSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdENvbXBhbnlIaW50KHNjcmFwZWRKb2IsIGhvc3QpIHtcbiAgICBpZiAoc2NyYXBlZEpvYj8uY29tcGFueSlcbiAgICAgICAgcmV0dXJuIHNjcmFwZWRKb2IuY29tcGFueTtcbiAgICByZXR1cm4gaG9zdC5yZXBsYWNlKC9ed3d3XFwuLywgXCJcIik7XG59XG4iLCJpbXBvcnQgeyBqc3ggYXMgX2pzeCwganN4cyBhcyBfanN4cyB9IGZyb20gXCJyZWFjdC9qc3gtcnVudGltZVwiO1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmNvbnN0IEFDVElPTl9MQUJFTFMgPSB7XG4gICAgdGFpbG9yOiBcIlRhaWxvclwiLFxuICAgIGNvdmVyTGV0dGVyOiBcIkNvdmVyIExldHRlclwiLFxuICAgIHNhdmU6IFwiU2F2ZVwiLFxuICAgIGF1dG9GaWxsOiBcIkF1dG8tZmlsbFwiLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBKb2JQYWdlU2lkZWJhcihwcm9wcykge1xuICAgIGNvbnN0IFthY3RpdmVBY3Rpb24sIHNldEFjdGl2ZUFjdGlvbl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbbm90aWNlLCBzZXROb3RpY2VdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgICBjb25zdCBbYW5zd2Vycywgc2V0QW5zd2Vyc10gPSB1c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlYXJjaGluZywgc2V0U2VhcmNoaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoRXJyb3IsIHNldFNlYXJjaEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHNjb3JlVmFsdWUgPSBwcm9wcy5zY29yZT8ub3ZlcmFsbCA/PyBudWxsO1xuICAgIGNvbnN0IHNjb3JlRGVncmVlcyA9IE1hdGgucm91bmQoKChzY29yZVZhbHVlID8/IDApIC8gMTAwKSAqIDM2MCk7XG4gICAgY29uc3Qgam9iTWV0YSA9IHVzZU1lbW8oKCkgPT4gW3Byb3BzLnNjcmFwZWRKb2IuY29tcGFueSwgcHJvcHMuc2NyYXBlZEpvYi5sb2NhdGlvbl1cbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuam9pbihcIiAvIFwiKSwgW3Byb3BzLnNjcmFwZWRKb2IuY29tcGFueSwgcHJvcHMuc2NyYXBlZEpvYi5sb2NhdGlvbl0pO1xuICAgIGFzeW5jIGZ1bmN0aW9uIHJ1bkFjdGlvbihhY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHNldEFjdGl2ZUFjdGlvbihhY3Rpb24pO1xuICAgICAgICBzZXROb3RpY2UobnVsbCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICAgICAgc2V0Tm90aWNlKHtcbiAgICAgICAgICAgICAgICBraW5kOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBhY3Rpb24gPT09IFwiYXV0b0ZpbGxcIlxuICAgICAgICAgICAgICAgICAgICA/IFwiQXBwbGljYXRpb24gZmllbGRzIHVwZGF0ZWQuXCJcbiAgICAgICAgICAgICAgICAgICAgOiBgJHtBQ1RJT05fTEFCRUxTW2FjdGlvbl19IGNvbXBsZXRlLmAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHNldE5vdGljZSh7XG4gICAgICAgICAgICAgICAga2luZDogXCJlcnJvclwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgYCR7QUNUSU9OX0xBQkVMU1thY3Rpb25dfSBmYWlsZWQuYCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0QWN0aXZlQWN0aW9uKG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCB0cmltbWVkID0gcXVlcnkudHJpbSgpO1xuICAgICAgICBpZiAoIXRyaW1tZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHNldFNlYXJjaGluZyh0cnVlKTtcbiAgICAgICAgc2V0U2VhcmNoRXJyb3IobnVsbCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRBbnN3ZXJzKGF3YWl0IHByb3BzLm9uU2VhcmNoQW5zd2Vycyh0cmltbWVkKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hFcnJvcihlcnJvci5tZXNzYWdlIHx8IFwiQW5zd2VyIHNlYXJjaCBmYWlsZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0U2VhcmNoaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBjb3B5QW5zd2VyKGFuc3dlcikge1xuICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChhbnN3ZXIuYW5zd2VyKTtcbiAgICAgICAgc2V0Tm90aWNlKHsga2luZDogXCJzdWNjZXNzXCIsIG1lc3NhZ2U6IFwiQW5zd2VyIGNvcGllZC5cIiB9KTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmlzQ29sbGFwc2VkKSB7XG4gICAgICAgIHJldHVybiAoX2pzeChcImFzaWRlXCIsIHsgY2xhc3NOYW1lOiBcInNsb3RoaW5nLXNpZGViYXJcIiwgXCJhcmlhLWxhYmVsXCI6IFwiU2xvdGhpbmcgam9iIHNpZGViYXJcIiwgY2hpbGRyZW46IF9qc3hzKFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcInJhaWxcIiwgdHlwZTogXCJidXR0b25cIiwgb25DbGljazogKCkgPT4gcHJvcHMub25Db2xsYXBzZUNoYW5nZShmYWxzZSksIFwiYXJpYS1sYWJlbFwiOiBcIk9wZW4gU2xvdGhpbmcgc2lkZWJhclwiLCB0aXRsZTogXCJPcGVuIFNsb3RoaW5nIHNpZGViYXJcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJyYWlsLXNjb3JlXCIsIGNoaWxkcmVuOiBzY29yZVZhbHVlID8/IFwiLS1cIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicmFpbC1sYWJlbFwiLCBjaGlsZHJlbjogXCJTbG90aGluZ1wiIH0pXSB9KSB9KSk7XG4gICAgfVxuICAgIHJldHVybiAoX2pzeChcImFzaWRlXCIsIHsgY2xhc3NOYW1lOiBcInNsb3RoaW5nLXNpZGViYXJcIiwgXCJhcmlhLWxhYmVsXCI6IFwiU2xvdGhpbmcgam9iIHNpZGViYXJcIiwgY2hpbGRyZW46IF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInBhbmVsXCIsIGNoaWxkcmVuOiBbX2pzeHMoXCJoZWFkZXJcIiwgeyBjbGFzc05hbWU6IFwiaGVhZGVyXCIsIGNoaWxkcmVuOiBbX2pzeHMoXCJkaXZcIiwgeyBjaGlsZHJlbjogW19qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImJyYW5kXCIsIGNoaWxkcmVuOiBcIlNsb3RoaW5nXCIgfSksIF9qc3goXCJoMlwiLCB7IGNsYXNzTmFtZTogXCJ0aXRsZVwiLCBjaGlsZHJlbjogcHJvcHMuc2NyYXBlZEpvYi50aXRsZSB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiY29tcGFueVwiLCBjaGlsZHJlbjogam9iTWV0YSB8fCBwcm9wcy5zY3JhcGVkSm9iLmNvbXBhbnkgfSldIH0pLCBfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpY29uLXJvd1wiLCBjaGlsZHJlbjogW19qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiaWNvbi1idXR0b25cIiwgdHlwZTogXCJidXR0b25cIiwgb25DbGljazogKCkgPT4gcHJvcHMub25Db2xsYXBzZUNoYW5nZSh0cnVlKSwgXCJhcmlhLWxhYmVsXCI6IFwiQ29sbGFwc2UgU2xvdGhpbmcgc2lkZWJhclwiLCB0aXRsZTogXCJDb2xsYXBzZVwiLCBjaGlsZHJlbjogXCJcXHUyMDNBXCIgfSksIF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiaWNvbi1idXR0b25cIiwgdHlwZTogXCJidXR0b25cIiwgb25DbGljazogKCkgPT4gdm9pZCBwcm9wcy5vbkRpc21pc3MoKSwgXCJhcmlhLWxhYmVsXCI6IFwiRGlzbWlzcyBTbG90aGluZyBzaWRlYmFyIGZvciB0aGlzIGRvbWFpblwiLCB0aXRsZTogXCJEaXNtaXNzIGZvciB0aGlzIGRvbWFpblwiLCBjaGlsZHJlbjogXCJcXHUwMEQ3XCIgfSldIH0pXSB9KSwgX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiLCBjaGlsZHJlbjogW19qc3hzKFwic2VjdGlvblwiLCB7IGNsYXNzTmFtZTogXCJzY29yZS1jYXJkXCIsIFwiYXJpYS1sYWJlbFwiOiBcIk1hdGNoIHNjb3JlXCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJzY29yZS1udW1iZXJcIiwgc3R5bGU6IHsgXCItLXNjb3JlLWRlZ1wiOiBgJHtzY29yZURlZ3JlZXN9ZGVnYCB9LCBjaGlsZHJlbjogX2pzeChcInNwYW5cIiwgeyBjaGlsZHJlbjogc2NvcmVWYWx1ZSA/PyBcIi0tXCIgfSkgfSksIF9qc3hzKFwiZGl2XCIsIHsgY2hpbGRyZW46IFtfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzY29yZS1sYWJlbFwiLCBjaGlsZHJlbjogc2NvcmVWYWx1ZSA9PT0gbnVsbCA/IFwiUHJvZmlsZSBuZWVkZWRcIiA6IFwiTWF0Y2ggc2NvcmVcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwic2NvcmUtbm90ZVwiLCBjaGlsZHJlbjogc2NvcmVWYWx1ZSA9PT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIkNvbm5lY3QgeW91ciBwcm9maWxlIHRvIHNjb3JlIHRoaXMgam9iLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiQmFzZWQgb24geW91ciBwcm9maWxlIGFuZCB0aGlzIGpvYiBkZXNjcmlwdGlvbi5cIiB9KV0gfSldIH0pLCBfanN4cyhcInNlY3Rpb25cIiwgeyBjbGFzc05hbWU6IFwiYWN0aW9uc1wiLCBcImFyaWEtbGFiZWxcIjogXCJKb2IgYWN0aW9uc1wiLCBjaGlsZHJlbjogW19qc3goQWN0aW9uQnV0dG9uLCB7IGxhYmVsOiBcIlRhaWxvciByZXN1bWVcIiwgYWN0aXZlTGFiZWw6IFwiVGFpbG9yaW5nLi4uXCIsIGFjdGl2ZTogYWN0aXZlQWN0aW9uID09PSBcInRhaWxvclwiLCBkaXNhYmxlZDogYWN0aXZlQWN0aW9uICE9PSBudWxsLCBwcmltYXJ5OiB0cnVlLCBvbkNsaWNrOiAoKSA9PiBydW5BY3Rpb24oXCJ0YWlsb3JcIiwgcHJvcHMub25UYWlsb3IpIH0pLCBfanN4KEFjdGlvbkJ1dHRvbiwgeyBsYWJlbDogXCJDb3ZlciBsZXR0ZXJcIiwgYWN0aXZlTGFiZWw6IFwiR2VuZXJhdGluZy4uLlwiLCBhY3RpdmU6IGFjdGl2ZUFjdGlvbiA9PT0gXCJjb3ZlckxldHRlclwiLCBkaXNhYmxlZDogYWN0aXZlQWN0aW9uICE9PSBudWxsLCBvbkNsaWNrOiAoKSA9PiBydW5BY3Rpb24oXCJjb3ZlckxldHRlclwiLCBwcm9wcy5vbkNvdmVyTGV0dGVyKSB9KSwgX2pzeChBY3Rpb25CdXR0b24sIHsgbGFiZWw6IFwiU2F2ZSBqb2JcIiwgYWN0aXZlTGFiZWw6IFwiU2F2aW5nLi4uXCIsIGFjdGl2ZTogYWN0aXZlQWN0aW9uID09PSBcInNhdmVcIiwgZGlzYWJsZWQ6IGFjdGl2ZUFjdGlvbiAhPT0gbnVsbCwgb25DbGljazogKCkgPT4gcnVuQWN0aW9uKFwic2F2ZVwiLCBwcm9wcy5vblNhdmUpIH0pLCBfanN4KEFjdGlvbkJ1dHRvbiwgeyBsYWJlbDogcHJvcHMuZGV0ZWN0ZWRGaWVsZENvdW50ID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYEF1dG8tZmlsbCAke3Byb3BzLmRldGVjdGVkRmllbGRDb3VudH0gZmllbGRzYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJBdXRvLWZpbGxcIiwgYWN0aXZlTGFiZWw6IFwiRmlsbGluZy4uLlwiLCBhY3RpdmU6IGFjdGl2ZUFjdGlvbiA9PT0gXCJhdXRvRmlsbFwiLCBkaXNhYmxlZDogYWN0aXZlQWN0aW9uICE9PSBudWxsIHx8IHByb3BzLmRldGVjdGVkRmllbGRDb3VudCA9PT0gMCwgb25DbGljazogKCkgPT4gcnVuQWN0aW9uKFwiYXV0b0ZpbGxcIiwgcHJvcHMub25BdXRvRmlsbCkgfSldIH0pLCBub3RpY2UgJiYgKF9qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IGBzdGF0dXMtY2FyZCAke25vdGljZS5raW5kfWAsIHJvbGU6IFwic3RhdHVzXCIsIGNoaWxkcmVuOiBub3RpY2UubWVzc2FnZSB9KSksIF9qc3hzKFwic2VjdGlvblwiLCB7IGNsYXNzTmFtZTogXCJhbnN3ZXItYmFua1wiLCBcImFyaWEtbGFiZWxcIjogXCJBbnN3ZXIgYmFuayBzZWFyY2hcIiwgY2hpbGRyZW46IFtfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzZWN0aW9uLXRpdGxlXCIsIGNoaWxkcmVuOiBcIkFuc3dlciBiYW5rXCIgfSksIF9qc3hzKFwiZm9ybVwiLCB7IGNsYXNzTmFtZTogXCJzZWFyY2gtcm93XCIsIG9uU3VibWl0OiBoYW5kbGVTZWFyY2gsIGNoaWxkcmVuOiBbX2pzeChcImlucHV0XCIsIHsgdmFsdWU6IHF1ZXJ5LCBvbkNoYW5nZTogKGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpLCBwbGFjZWhvbGRlcjogXCJTZWFyY2ggc2F2ZWQgYW5zd2Vyc1wiLCBcImFyaWEtbGFiZWxcIjogXCJTZWFyY2ggc2F2ZWQgYW5zd2Vyc1wiIH0pLCBfanN4KFwiYnV0dG9uXCIsIHsgdHlwZTogXCJzdWJtaXRcIiwgZGlzYWJsZWQ6IHNlYXJjaGluZyB8fCAhcXVlcnkudHJpbSgpLCBjaGlsZHJlbjogc2VhcmNoaW5nID8gXCIuLi5cIiA6IFwiU2VhcmNoXCIgfSldIH0pLCBzZWFyY2hFcnJvciAmJiBfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzdGF0dXMtY2FyZCBlcnJvclwiLCBjaGlsZHJlbjogc2VhcmNoRXJyb3IgfSksIF9qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicmVzdWx0c1wiLCBjaGlsZHJlbjogYW5zd2Vycy5tYXAoKGFuc3dlcikgPT4gKF9qc3hzKFwiYXJ0aWNsZVwiLCB7IGNsYXNzTmFtZTogXCJyZXN1bHRcIiwgY2hpbGRyZW46IFtfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJyZXN1bHQtcXVlc3Rpb25cIiwgY2hpbGRyZW46IGFuc3dlci5xdWVzdGlvbiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwicmVzdWx0LWFuc3dlclwiLCBjaGlsZHJlbjogYW5zd2VyLmFuc3dlciB9KSwgX2pzeHMoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInJlc3VsdC1tZXRhXCIsIGNoaWxkcmVuOiBbTWF0aC5yb3VuZChhbnN3ZXIuc2ltaWxhcml0eSAqIDEwMCksIFwiJSBtYXRjaCAvIHVzZWRcIiwgXCIgXCIsIGFuc3dlci50aW1lc1VzZWQsIFwiIHRpbWVzXCJdIH0pLCBfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJyZXN1bHQtYWN0aW9uc1wiLCBjaGlsZHJlbjogW19qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwic21hbGwtYnV0dG9uIHNlY29uZGFyeVwiLCB0eXBlOiBcImJ1dHRvblwiLCBvbkNsaWNrOiAoKSA9PiBjb3B5QW5zd2VyKGFuc3dlciksIGNoaWxkcmVuOiBcIkNvcHlcIiB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJzbWFsbC1idXR0b25cIiwgdHlwZTogXCJidXR0b25cIiwgb25DbGljazogKCkgPT4gdm9pZCBwcm9wcy5vbkFwcGx5QW5zd2VyKGFuc3dlciksIGNoaWxkcmVuOiBcIkFwcGx5XCIgfSldIH0pXSB9LCBhbnN3ZXIuaWQpKSkgfSldIH0pXSB9KV0gfSkgfSkpO1xufVxuZnVuY3Rpb24gQWN0aW9uQnV0dG9uKHsgbGFiZWwsIGFjdGl2ZUxhYmVsLCBhY3RpdmUsIGRpc2FibGVkLCBwcmltYXJ5LCBvbkNsaWNrLCB9KSB7XG4gICAgcmV0dXJuIChfanN4cyhcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogYGFjdGlvbi1idXR0b24ke3ByaW1hcnkgPyBcIiBwcmltYXJ5XCIgOiBcIlwifWAsIHR5cGU6IFwiYnV0dG9uXCIsIGRpc2FibGVkOiBkaXNhYmxlZCwgb25DbGljazogb25DbGljaywgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNoaWxkcmVuOiBhY3RpdmUgPyBhY3RpdmVMYWJlbCA6IGxhYmVsIH0pLCBfanN4KFwic3BhblwiLCB7IFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCIsIGNoaWxkcmVuOiBcIi0+XCIgfSldIH0pKTtcbn1cbiIsImV4cG9ydCBjb25zdCBERUZBVUxUX0xPQ0FMRSA9IFwiZW4tVVNcIjtcbmNvbnN0IE5VTUVSSUNfUEFSVFNfTE9DQUxFID0gYCR7REVGQVVMVF9MT0NBTEV9LXUtbnUtbGF0bmA7XG5leHBvcnQgY29uc3QgTE9DQUxFX0NPT0tJRV9OQU1FID0gXCJ0YWlkYV9sb2NhbGVcIjtcbmV4cG9ydCBjb25zdCBMT0NBTEVfQ0hBTkdFX0VWRU5UID0gXCJ0YWlkYTpsb2NhbGUtY2hhbmdlXCI7XG5leHBvcnQgY29uc3QgU1VQUE9SVEVEX0xPQ0FMRVMgPSBbXG4gICAgeyB2YWx1ZTogXCJlbi1VU1wiLCBsYWJlbDogXCJFbmdsaXNoIChVUylcIiB9LFxuICAgIHsgdmFsdWU6IFwiZW4tQ0FcIiwgbGFiZWw6IFwiRW5nbGlzaCAoQ0EpXCIgfSxcbiAgICB7IHZhbHVlOiBcImVuLUdCXCIsIGxhYmVsOiBcIkVuZ2xpc2ggKFVLKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJmclwiLCBsYWJlbDogXCJGcmVuY2hcIiB9LFxuICAgIHsgdmFsdWU6IFwiZXNcIiwgbGFiZWw6IFwiU3BhbmlzaFwiIH0sXG4gICAgeyB2YWx1ZTogXCJkZVwiLCBsYWJlbDogXCJHZXJtYW5cIiB9LFxuICAgIHsgdmFsdWU6IFwiamFcIiwgbGFiZWw6IFwiSmFwYW5lc2VcIiB9LFxuICAgIHsgdmFsdWU6IFwiemgtQ05cIiwgbGFiZWw6IFwiQ2hpbmVzZSAoU2ltcGxpZmllZClcIiB9LFxuICAgIHsgdmFsdWU6IFwicHRcIiwgbGFiZWw6IFwiUG9ydHVndWVzZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJwdC1CUlwiLCBsYWJlbDogXCJQb3J0dWd1ZXNlIChCcmF6aWwpXCIgfSxcbiAgICB7IHZhbHVlOiBcImhpXCIsIGxhYmVsOiBcIkhpbmRpXCIgfSxcbiAgICB7IHZhbHVlOiBcImtvXCIsIGxhYmVsOiBcIktvcmVhblwiIH0sXG5dO1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShsb2NhbGUpIHtcbiAgICBpZiAoIWxvY2FsZSlcbiAgICAgICAgcmV0dXJuIERFRkFVTFRfTE9DQUxFO1xuICAgIGNvbnN0IHN1cHBvcnRlZCA9IFNVUFBPUlRFRF9MT0NBTEVTLmZpbmQoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGxvY2FsZS50b0xvd2VyQ2FzZSgpIHx8XG4gICAgICAgIGNhbmRpZGF0ZS52YWx1ZS5zcGxpdChcIi1cIilbMF0udG9Mb3dlckNhc2UoKSA9PT0gbG9jYWxlLnRvTG93ZXJDYXNlKCkpO1xuICAgIHJldHVybiBzdXBwb3J0ZWQ/LnZhbHVlID8/IERFRkFVTFRfTE9DQUxFO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vd0lzbygpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vd0RhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gbm93RXBvY2goKSB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUb0RhdGUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gXCJcIilcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZGF0ZSA9IHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSkgOiBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkgPyBudWxsIDogZGF0ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b0lzbyh2YWx1ZSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgfVxuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9OdWxsYWJsZUlzbyh2YWx1ZSkge1xuICAgIHJldHVybiBwYXJzZVRvRGF0ZSh2YWx1ZSk/LnRvSVNPU3RyaW5nKCkgPz8gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b0Vwb2NoKHZhbHVlKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUuZ2V0VGltZSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvTnVsbGFibGVFcG9jaCh2YWx1ZSkge1xuICAgIHJldHVybiBwYXJzZVRvRGF0ZSh2YWx1ZSk/LmdldFRpbWUoKSA/PyBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJUaW1lem9uZSgpIHtcbiAgICBpZiAodHlwZW9mIEludGwgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBcIlVUQ1wiO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmUgfHwgXCJVVENcIjtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gXCJVVENcIjtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXREaXNwbGF5VGltZXpvbmUodGltZVpvbmUpIHtcbiAgICBpZiAodGltZVpvbmUpXG4gICAgICAgIHJldHVybiB0aW1lWm9uZTtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiVVRDXCIgOiBnZXRVc2VyVGltZXpvbmUoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRBYnNvbHV0ZSh2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xuICAgIGNvbnN0IGluY2x1ZGVUaW1lID0gb3B0cy5pbmNsdWRlVGltZSA/PyB0cnVlO1xuICAgIGNvbnN0IGZvcm1hdHRlciA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KG5vcm1hbGl6ZUxvY2FsZShvcHRzLmxvY2FsZSksIHtcbiAgICAgICAgbW9udGg6IFwic2hvcnRcIixcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIC4uLihpbmNsdWRlVGltZSA/IHsgaG91cjogXCJudW1lcmljXCIsIG1pbnV0ZTogXCIyLWRpZ2l0XCIgfSA6IHt9KSxcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KTtcbiAgICBjb25zdCBmb3JtYXR0ZWQgPSBmb3JtYXR0ZXIuZm9ybWF0KGRhdGUpO1xuICAgIGlmICghaW5jbHVkZVRpbWUpXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWQ7XG4gICAgY29uc3QgbGFzdENvbW1hID0gZm9ybWF0dGVkLmxhc3RJbmRleE9mKFwiLFwiKTtcbiAgICBpZiAobGFzdENvbW1hID09PSAtMSlcbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgICByZXR1cm4gYCR7Zm9ybWF0dGVkLnNsaWNlKDAsIGxhc3RDb21tYSl9IMK3ICR7Zm9ybWF0dGVkXG4gICAgICAgIC5zbGljZShsYXN0Q29tbWEgKyAxKVxuICAgICAgICAudHJpbSgpfWA7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UmVsYXRpdmUodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudCA9IHBhcnNlVG9EYXRlKG9wdHMubm93ID8/IG5vd0lzbygpKTtcbiAgICBpZiAoIWRhdGUgfHwgIWN1cnJlbnQpIHtcbiAgICAgICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG4gICAgfVxuICAgIGNvbnN0IGRpZmZNcyA9IGN1cnJlbnQuZ2V0VGltZSgpIC0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc3QgYWJzTXMgPSBNYXRoLmFicyhkaWZmTXMpO1xuICAgIGNvbnN0IGlzRnV0dXJlID0gZGlmZk1zIDwgMDtcbiAgICBjb25zdCBtaW51dGUgPSA2MCAqIDEwMDA7XG4gICAgY29uc3QgaG91ciA9IDYwICogbWludXRlO1xuICAgIGNvbnN0IGRheSA9IDI0ICogaG91cjtcbiAgICBjb25zdCB3ZWVrID0gNyAqIGRheTtcbiAgICBjb25zdCBtb250aCA9IDMwICogZGF5O1xuICAgIGNvbnN0IHllYXIgPSAzNjUgKiBkYXk7XG4gICAgaWYgKGFic01zIDwgbWludXRlKVxuICAgICAgICByZXR1cm4gXCJKdXN0IG5vd1wiO1xuICAgIGlmIChhYnNNcyA8IGhvdXIpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gbWludXRlKSwgXCJtXCIsIGlzRnV0dXJlKTtcbiAgICBpZiAoYWJzTXMgPCBkYXkpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gaG91ciksIFwiaFwiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgMiAqIGRheSlcbiAgICAgICAgcmV0dXJuIGlzRnV0dXJlID8gXCJUb21vcnJvd1wiIDogXCJZZXN0ZXJkYXlcIjtcbiAgICBpZiAoYWJzTXMgPCB3ZWVrKVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIGRheSksIFwiZFwiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgbW9udGgpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gd2VlayksIFwid1wiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgeWVhcilcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyBtb250aCksIFwibW9cIiwgaXNGdXR1cmUpO1xuICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8geWVhciksIFwieVwiLCBpc0Z1dHVyZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGF0ZU9ubHkodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJVbmtub3duIGRhdGVcIjtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBtb250aDogXCJzaG9ydFwiLFxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZU9ubHkodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJVbmtub3duIHRpbWVcIjtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBob3VyOiBcIm51bWVyaWNcIixcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0SXNvRGF0ZU9ubHkodmFsdWUgPSBub3dJc28oKSkge1xuICAgIHJldHVybiB0b0lzbyhwYXJzZVRvRGF0ZSh2YWx1ZSkgPz8gbm93SXNvKCkpLnNsaWNlKDAsIDEwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRNb250aFllYXIodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBtb250aDogXCJzaG9ydFwiLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNQYXN0KHZhbHVlLCBub3cgPSBub3dJc28oKSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudCA9IHBhcnNlVG9EYXRlKG5vdyk7XG4gICAgcmV0dXJuIEJvb2xlYW4oZGF0ZSAmJiBjdXJyZW50ICYmIGRhdGUuZ2V0VGltZSgpIDwgY3VycmVudC5nZXRUaW1lKCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRnV0dXJlKHZhbHVlLCBub3cgPSBub3dJc28oKSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudCA9IHBhcnNlVG9EYXRlKG5vdyk7XG4gICAgcmV0dXJuIEJvb2xlYW4oZGF0ZSAmJiBjdXJyZW50ICYmIGRhdGUuZ2V0VGltZSgpID4gY3VycmVudC5nZXRUaW1lKCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZTZWNvbmRzKGEsIGIpIHtcbiAgICBjb25zdCBmaXJzdCA9IHBhcnNlVG9EYXRlKGEpO1xuICAgIGNvbnN0IHNlY29uZCA9IHBhcnNlVG9EYXRlKGIpO1xuICAgIGlmICghZmlyc3QgfHwgIXNlY29uZClcbiAgICAgICAgcmV0dXJuIE51bWJlci5OYU47XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMoKGZpcnN0LmdldFRpbWUoKSAtIHNlY29uZC5nZXRUaW1lKCkpIC8gMTAwMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGlmZkRheXMoYSwgYikge1xuICAgIGNvbnN0IHNlY29uZHMgPSBkaWZmU2Vjb25kcyhhLCBiKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHNlY29uZHMpID8gTnVtYmVyLk5hTiA6IHNlY29uZHMgLyA4NjQwMDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGREYXlzKHZhbHVlLCBkYXlzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgZGF5cyAqIDg2NDAwMDAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRNaW51dGVzKHZhbHVlLCBtaW51dGVzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgbWludXRlcyAqIDYwMDAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdGFydE9mRGF5KHZhbHVlLCB0aW1lWm9uZSA9IFwiVVRDXCIpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICBpZiAodGltZVpvbmUgPT09IFwiVVRDXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgZGF0ZS5nZXRVVENNb250aCgpLCBkYXRlLmdldFVUQ0RhdGUoKSkpO1xuICAgIH1cbiAgICBjb25zdCBwYXJ0cyA9IGdldFpvbmVkUGFydHMoZGF0ZSwgdGltZVpvbmUpO1xuICAgIHJldHVybiB6b25lZFRpbWVUb1V0YyhwYXJ0cy55ZWFyLCBwYXJ0cy5tb250aCwgcGFydHMuZGF5LCAwLCAwLCAwLCB0aW1lWm9uZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZW5kT2ZEYXkodmFsdWUsIHRpbWVab25lID0gXCJVVENcIikge1xuICAgIHJldHVybiBhZGRNaW51dGVzKGFkZERheXMoc3RhcnRPZkRheSh2YWx1ZSwgdGltZVpvbmUpLCAxKSwgLTEgLyA2MDAwMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9Vc2VyVHoodmFsdWUsIHRpbWVab25lID0gZ2V0VXNlclRpbWV6b25lKCkpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICBjb25zdCBwYXJ0cyA9IGdldFpvbmVkUGFydHMoZGF0ZSwgdGltZVpvbmUpO1xuICAgIHJldHVybiBuZXcgRGF0ZShwYXJ0cy55ZWFyLCBwYXJ0cy5tb250aCAtIDEsIHBhcnRzLmRheSwgcGFydHMuaG91ciwgcGFydHMubWludXRlLCBwYXJ0cy5zZWNvbmQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERhdGVBYnNvbHV0ZShkYXRlLCBsb2NhbGUgPSBERUZBVUxUX0xPQ0FMRSkge1xuICAgIHJldHVybiBmb3JtYXRBYnNvbHV0ZShkYXRlLCB7IGxvY2FsZSB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREYXRlUmVsYXRpdmUoZGF0ZSwgbm93ID0gbm93SXNvKCkpIHtcbiAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmUoZGF0ZSwgeyBub3cgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJvd3NlckRlZmF1bHRMb2NhbGUoKSB7XG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBERUZBVUxUX0xPQ0FMRTtcbiAgICByZXR1cm4gbm9ybWFsaXplTG9jYWxlKG5hdmlnYXRvci5sYW5ndWFnZSk7XG59XG5mdW5jdGlvbiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldCh2YWx1ZSwgdW5pdCwgaXNGdXR1cmUpIHtcbiAgICByZXR1cm4gaXNGdXR1cmUgPyBgaW4gJHt2YWx1ZX0ke3VuaXR9YCA6IGAke3ZhbHVlfSR7dW5pdH0gYWdvYDtcbn1cbmZ1bmN0aW9uIGdldFpvbmVkUGFydHMoZGF0ZSwgdGltZVpvbmUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KE5VTUVSSUNfUEFSVFNfTE9DQUxFLCB7XG4gICAgICAgIHRpbWVab25lLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgbW9udGg6IFwiMi1kaWdpdFwiLFxuICAgICAgICBkYXk6IFwiMi1kaWdpdFwiLFxuICAgICAgICBob3VyOiBcIjItZGlnaXRcIixcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgICAgc2Vjb25kOiBcIjItZGlnaXRcIixcbiAgICAgICAgaG91ckN5Y2xlOiBcImgyM1wiLFxuICAgIH0pLmZvcm1hdFRvUGFydHMoZGF0ZSk7XG4gICAgY29uc3QgZ2V0ID0gKHR5cGUpID0+IE51bWJlcihwYXJ0cy5maW5kKChwYXJ0KSA9PiBwYXJ0LnR5cGUgPT09IHR5cGUpPy52YWx1ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeWVhcjogZ2V0KFwieWVhclwiKSxcbiAgICAgICAgbW9udGg6IGdldChcIm1vbnRoXCIpLFxuICAgICAgICBkYXk6IGdldChcImRheVwiKSxcbiAgICAgICAgaG91cjogZ2V0KFwiaG91clwiKSxcbiAgICAgICAgbWludXRlOiBnZXQoXCJtaW51dGVcIiksXG4gICAgICAgIHNlY29uZDogZ2V0KFwic2Vjb25kXCIpLFxuICAgIH07XG59XG5mdW5jdGlvbiB6b25lZFRpbWVUb1V0Yyh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgdGltZVpvbmUpIHtcbiAgICBjb25zdCB1dGNHdWVzcyA9IG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoIC0gMSwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCkpO1xuICAgIGNvbnN0IHBhcnRzID0gZ2V0Wm9uZWRQYXJ0cyh1dGNHdWVzcywgdGltZVpvbmUpO1xuICAgIGNvbnN0IG9mZnNldE1zID0gRGF0ZS5VVEMocGFydHMueWVhciwgcGFydHMubW9udGggLSAxLCBwYXJ0cy5kYXksIHBhcnRzLmhvdXIsIHBhcnRzLm1pbnV0ZSwgcGFydHMuc2Vjb25kKSAtIHV0Y0d1ZXNzLmdldFRpbWUoKTtcbiAgICByZXR1cm4gbmV3IERhdGUodXRjR3Vlc3MuZ2V0VGltZSgpIC0gb2Zmc2V0TXMpO1xufVxuIiwiZXhwb3J0IGNvbnN0IFNVQl9TQ09SRV9NQVhfUE9JTlRTID0ge1xuICAgIHNlY3Rpb25Db21wbGV0ZW5lc3M6IDEwLFxuICAgIGFjdGlvblZlcmJzOiAxNSxcbiAgICBxdWFudGlmaWVkQWNoaWV2ZW1lbnRzOiAyMCxcbiAgICBrZXl3b3JkTWF0Y2g6IDI1LFxuICAgIGxlbmd0aDogMTAsXG4gICAgc3BlbGxpbmdHcmFtbWFyOiAxMCxcbiAgICBhdHNGcmllbmRsaW5lc3M6IDEwLFxufTtcbmV4cG9ydCBjb25zdCBBQ1RJT05fVkVSQlMgPSBbXG4gICAgXCJhY2hpZXZlZFwiLFxuICAgIFwiYW5hbHl6ZWRcIixcbiAgICBcImFyY2hpdGVjdGVkXCIsXG4gICAgXCJidWlsdFwiLFxuICAgIFwiY29sbGFib3JhdGVkXCIsXG4gICAgXCJjcmVhdGVkXCIsXG4gICAgXCJkZWxpdmVyZWRcIixcbiAgICBcImRlc2lnbmVkXCIsXG4gICAgXCJkZXZlbG9wZWRcIixcbiAgICBcImRyb3ZlXCIsXG4gICAgXCJpbXByb3ZlZFwiLFxuICAgIFwiaW5jcmVhc2VkXCIsXG4gICAgXCJsYXVuY2hlZFwiLFxuICAgIFwibGVkXCIsXG4gICAgXCJtYW5hZ2VkXCIsXG4gICAgXCJtZW50b3JlZFwiLFxuICAgIFwib3B0aW1pemVkXCIsXG4gICAgXCJyZWR1Y2VkXCIsXG4gICAgXCJyZXNvbHZlZFwiLFxuICAgIFwic2hpcHBlZFwiLFxuICAgIFwic3RyZWFtbGluZWRcIixcbiAgICBcInN1cHBvcnRlZFwiLFxuICAgIFwidHJhbnNmb3JtZWRcIixcbl07XG5leHBvcnQgY29uc3QgUVVBTlRJRklFRF9SRUdFWCA9IC9cXGQrJXxcXCRbXFxkLF0rKD86XFwuXFxkKyk/W2tLbU1iQl0/fFxcYlxcZCt4XFxifFxcYnRlYW0gb2YgXFxkK1xcYnxcXGJcXGQrXFxzKyh1c2Vyc3xjdXN0b21lcnN8Y2xpZW50c3xwcm9qZWN0c3xwZW9wbGV8ZW5naW5lZXJzfHJlcG9ydHN8aG91cnN8bWVtYmVyc3xjb3VudHJpZXN8bGFuZ3VhZ2VzfHN0YXRlc3xjaXRpZXN8c3RvcmVzfHBhcnRuZXJzfGRlYWxzfGxlYWRzKVxcYi9naTtcbiIsImV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVUZXh0KHRleHQpIHtcbiAgICByZXR1cm4gdGV4dFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgvW15hLXowLTkrIy5cXHMvLV0vZywgXCIgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuICAgICAgICAudHJpbSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3b3JkQm91bmRhcnlSZWdleCh0ZXJtLCBmbGFncyA9IFwiXCIpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ0V4cCh0ZXJtKX1cXFxcYmAsIGZsYWdzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc1dvcmQodGV4dCwgdGVybSkge1xuICAgIHJldHVybiB3b3JkQm91bmRhcnlSZWdleCh0ZXJtKS50ZXN0KHRleHQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50V29yZE9jY3VycmVuY2VzKHRleHQsIHRlcm0pIHtcbiAgICByZXR1cm4gKHRleHQubWF0Y2god29yZEJvdW5kYXJ5UmVnZXgodGVybSwgXCJnXCIpKSB8fCBbXSkubGVuZ3RoO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEhpZ2hsaWdodHMocHJvZmlsZSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIC4uLnByb2ZpbGUuZXhwZXJpZW5jZXMuZmxhdE1hcCgoZXhwZXJpZW5jZSkgPT4gZXhwZXJpZW5jZS5oaWdobGlnaHRzKSxcbiAgICAgICAgLi4ucHJvZmlsZS5wcm9qZWN0cy5mbGF0TWFwKChwcm9qZWN0KSA9PiBwcm9qZWN0LmhpZ2hsaWdodHMpLFxuICAgIF0uZmlsdGVyKEJvb2xlYW4pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RQcm9maWxlVGV4dChwcm9maWxlKSB7XG4gICAgY29uc3QgcGFydHMgPSBbXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ubmFtZSxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5lbWFpbCxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5waG9uZSxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5sb2NhdGlvbixcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5saW5rZWRpbixcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5naXRodWIsXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ud2Vic2l0ZSxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5oZWFkbGluZSxcbiAgICAgICAgcHJvZmlsZS5zdW1tYXJ5LFxuICAgICAgICAuLi5wcm9maWxlLmV4cGVyaWVuY2VzLmZsYXRNYXAoKGV4cGVyaWVuY2UpID0+IFtcbiAgICAgICAgICAgIGV4cGVyaWVuY2UudGl0bGUsXG4gICAgICAgICAgICBleHBlcmllbmNlLmNvbXBhbnksXG4gICAgICAgICAgICBleHBlcmllbmNlLmxvY2F0aW9uLFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIC4uLmV4cGVyaWVuY2UuaGlnaGxpZ2h0cyxcbiAgICAgICAgICAgIC4uLmV4cGVyaWVuY2Uuc2tpbGxzLFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5zdGFydERhdGUsXG4gICAgICAgICAgICBleHBlcmllbmNlLmVuZERhdGUsXG4gICAgICAgIF0pLFxuICAgICAgICAuLi5wcm9maWxlLmVkdWNhdGlvbi5mbGF0TWFwKChlZHVjYXRpb24pID0+IFtcbiAgICAgICAgICAgIGVkdWNhdGlvbi5pbnN0aXR1dGlvbixcbiAgICAgICAgICAgIGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgICAgICBlZHVjYXRpb24uZmllbGQsXG4gICAgICAgICAgICAuLi5lZHVjYXRpb24uaGlnaGxpZ2h0cyxcbiAgICAgICAgICAgIGVkdWNhdGlvbi5zdGFydERhdGUsXG4gICAgICAgICAgICBlZHVjYXRpb24uZW5kRGF0ZSxcbiAgICAgICAgXSksXG4gICAgICAgIC4uLnByb2ZpbGUuc2tpbGxzLm1hcCgoc2tpbGwpID0+IHNraWxsLm5hbWUpLFxuICAgICAgICAuLi5wcm9maWxlLnByb2plY3RzLmZsYXRNYXAoKHByb2plY3QpID0+IFtcbiAgICAgICAgICAgIHByb2plY3QubmFtZSxcbiAgICAgICAgICAgIHByb2plY3QuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBwcm9qZWN0LnVybCxcbiAgICAgICAgICAgIC4uLnByb2plY3QuaGlnaGxpZ2h0cyxcbiAgICAgICAgICAgIC4uLnByb2plY3QudGVjaG5vbG9naWVzLFxuICAgICAgICBdKSxcbiAgICAgICAgLi4ucHJvZmlsZS5jZXJ0aWZpY2F0aW9ucy5mbGF0TWFwKChjZXJ0aWZpY2F0aW9uKSA9PiBbXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uLm5hbWUsXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uLmlzc3VlcixcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb24uZGF0ZSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb24udXJsLFxuICAgICAgICBdKSxcbiAgICBdO1xuICAgIHJldHVybiBwYXJ0cy5maWx0ZXIoQm9vbGVhbikuam9pbihcIlxcblwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXN1bWVUZXh0KHByb2ZpbGUsIHJhd1RleHQpIHtcbiAgICByZXR1cm4gKHJhd1RleHQ/LnRyaW0oKSB8fCBwcm9maWxlLnJhd1RleHQ/LnRyaW0oKSB8fCBleHRyYWN0UHJvZmlsZVRleHQocHJvZmlsZSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdvcmRDb3VudCh0ZXh0KSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRleHQodGV4dCk7XG4gICAgaWYgKCFub3JtYWxpemVkKVxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gbm9ybWFsaXplZC5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG59XG4iLCJpbXBvcnQgeyBBQ1RJT05fVkVSQlMsIFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRIaWdobGlnaHRzLCBub3JtYWxpemVUZXh0LCB3b3JkQm91bmRhcnlSZWdleCB9IGZyb20gXCIuL3RleHRcIjtcbmZ1bmN0aW9uIHBvaW50c0ZvckRpc3RpbmN0VmVyYnMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgIHJldHVybiAwO1xuICAgIGlmIChjb3VudCA8PSAyKVxuICAgICAgICByZXR1cm4gNTtcbiAgICBpZiAoY291bnQgPD0gNClcbiAgICAgICAgcmV0dXJuIDk7XG4gICAgaWYgKGNvdW50IDw9IDcpXG4gICAgICAgIHJldHVybiAxMjtcbiAgICByZXR1cm4gMTU7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVBY3Rpb25WZXJicyhpbnB1dCkge1xuICAgIGNvbnN0IGRpc3RpbmN0VmVyYnMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChjb25zdCBoaWdobGlnaHQgb2YgZ2V0SGlnaGxpZ2h0cyhpbnB1dC5wcm9maWxlKSkge1xuICAgICAgICBjb25zdCBmaXJzdFdvcmQgPSBub3JtYWxpemVUZXh0KGhpZ2hsaWdodCkuc3BsaXQoL1xccysvKVswXSA/PyBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcmIgb2YgQUNUSU9OX1ZFUkJTKSB7XG4gICAgICAgICAgICBpZiAod29yZEJvdW5kYXJ5UmVnZXgodmVyYikudGVzdChmaXJzdFdvcmQpKSB7XG4gICAgICAgICAgICAgICAgZGlzdGluY3RWZXJicy5hZGQodmVyYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdmVyYnMgPSBBcnJheS5mcm9tKGRpc3RpbmN0VmVyYnMpLnNvcnQoKTtcbiAgICBjb25zdCBub3RlcyA9IHZlcmJzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IFtcIlN0YXJ0IGFjaGlldmVtZW50IGJ1bGxldHMgd2l0aCBzdHJvbmcgYWN0aW9uIHZlcmJzLlwiXVxuICAgICAgICA6IFtdO1xuICAgIGNvbnN0IHByZXZpZXcgPSB2ZXJicy5zbGljZSgwLCA1KS5qb2luKFwiLCBcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImFjdGlvblZlcmJzXCIsXG4gICAgICAgIGxhYmVsOiBcIkFjdGlvbiB2ZXJic1wiLFxuICAgICAgICBlYXJuZWQ6IHBvaW50c0ZvckRpc3RpbmN0VmVyYnModmVyYnMubGVuZ3RoKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5hY3Rpb25WZXJicyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbXG4gICAgICAgICAgICBwcmV2aWV3XG4gICAgICAgICAgICAgICAgPyBgJHt2ZXJicy5sZW5ndGh9IGRpc3RpbmN0IGFjdGlvbiB2ZXJicyAoJHtwcmV2aWV3fSlgXG4gICAgICAgICAgICAgICAgOiBcIjAgZGlzdGluY3QgYWN0aW9uIHZlcmJzXCIsXG4gICAgICAgIF0sXG4gICAgfTtcbn1cbiIsImV4cG9ydCBjb25zdCBQUk9CTEVNQVRJQ19DSEFSQUNURVJTID0gW1xuICAgIHsgY2hhcjogXCJcXHUyMDIyXCIsIG5hbWU6IFwiYnVsbGV0IHBvaW50XCIsIHJlcGxhY2VtZW50OiBcIi1cIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDEzXCIsIG5hbWU6IFwiZW4gZGFzaFwiLCByZXBsYWNlbWVudDogXCItXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxNFwiLCBuYW1lOiBcImVtIGRhc2hcIiwgcmVwbGFjZW1lbnQ6IFwiLVwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMWNcIiwgbmFtZTogXCJjdXJseSBxdW90ZSBsZWZ0XCIsIHJlcGxhY2VtZW50OiAnXCInIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMWRcIiwgbmFtZTogXCJjdXJseSBxdW90ZSByaWdodFwiLCByZXBsYWNlbWVudDogJ1wiJyB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDE4XCIsIG5hbWU6IFwiY3VybHkgYXBvc3Ryb3BoZSBsZWZ0XCIsIHJlcGxhY2VtZW50OiBcIidcIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDE5XCIsIG5hbWU6IFwiY3VybHkgYXBvc3Ryb3BoZSByaWdodFwiLCByZXBsYWNlbWVudDogXCInXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAyNlwiLCBuYW1lOiBcImVsbGlwc2lzXCIsIHJlcGxhY2VtZW50OiBcIi4uLlwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTAwYTlcIiwgbmFtZTogXCJjb3B5cmlnaHRcIiwgcmVwbGFjZW1lbnQ6IFwiKGMpXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MDBhZVwiLCBuYW1lOiBcInJlZ2lzdGVyZWRcIiwgcmVwbGFjZW1lbnQ6IFwiKFIpXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjEyMlwiLCBuYW1lOiBcInRyYWRlbWFya1wiLCByZXBsYWNlbWVudDogXCIoVE0pXCIgfSxcbl07XG4iLCJpbXBvcnQgeyBQUk9CTEVNQVRJQ19DSEFSQUNURVJTIH0gZnJvbSBcIi4vYXRzLWNoYXJhY3RlcnNcIjtcbmltcG9ydCB7IFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXN1bWVUZXh0IH0gZnJvbSBcIi4vdGV4dFwiO1xuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlQXRzRnJpZW5kbGluZXNzKGlucHV0KSB7XG4gICAgY29uc3QgdGV4dCA9IGdldFJlc3VtZVRleHQoaW5wdXQucHJvZmlsZSwgaW5wdXQucmF3VGV4dCk7XG4gICAgY29uc3QgcmF3VGV4dCA9IGlucHV0LnJhd1RleHQgPz8gaW5wdXQucHJvZmlsZS5yYXdUZXh0ID8/IFwiXCI7XG4gICAgY29uc3Qgbm90ZXMgPSBbXTtcbiAgICBjb25zdCBldmlkZW5jZSA9IFtdO1xuICAgIGxldCBkZWR1Y3Rpb25zID0gMDtcbiAgICBjb25zdCBmb3VuZFByb2JsZW1hdGljID0gUFJPQkxFTUFUSUNfQ0hBUkFDVEVSUy5maWx0ZXIoKHsgY2hhciB9KSA9PiB0ZXh0LmluY2x1ZGVzKGNoYXIpKTtcbiAgICBpZiAoZm91bmRQcm9ibGVtYXRpYy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1pbigzLCBmb3VuZFByb2JsZW1hdGljLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlNwZWNpYWwgZm9ybWF0dGluZyBjaGFyYWN0ZXJzIGNhbiByZWR1Y2UgQVRTIHBhcnNlIHF1YWxpdHkuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGAke2ZvdW5kUHJvYmxlbWF0aWMubGVuZ3RofSBzcGVjaWFsIGNoYXJhY3RlcnNgKTtcbiAgICB9XG4gICAgY29uc3QgYmFkQ2hhcnMgPSAodGV4dC5tYXRjaCgvW1xcdUZGRkRcXHUwMDAwLVxcdTAwMDhcXHUwMDBCXFx1MDAwQ1xcdTAwMEUtXFx1MDAxRl0vZykgfHwgW10pLmxlbmd0aDtcbiAgICBpZiAoYmFkQ2hhcnMgPiAwKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIkNvbnRyb2wgb3IgcmVwbGFjZW1lbnQgY2hhcmFjdGVycyBkZXRlY3RlZC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYCR7YmFkQ2hhcnN9IGNvbnRyb2wgb3IgcmVwbGFjZW1lbnQgY2hhcmFjdGVyKHMpYCk7XG4gICAgfVxuICAgIGlmIChyYXdUZXh0LmluY2x1ZGVzKFwiXFx0XCIpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIlRhYiBjaGFyYWN0ZXJzIG1heSBpbmRpY2F0ZSB0YWJsZS1zdHlsZSBmb3JtYXR0aW5nLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIlRhYiBjaGFyYWN0ZXJzIGZvdW5kXCIpO1xuICAgIH1cbiAgICBjb25zdCBsb25nTGluZXMgPSByYXdUZXh0LnNwbGl0KC9cXHI/XFxuLykuZmlsdGVyKChsaW5lKSA9PiBsaW5lLmxlbmd0aCA+IDIwMCk7XG4gICAgaWYgKGxvbmdMaW5lcy5sZW5ndGggPj0gNCkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJWZXJ5IGxvbmcgbGluZXMgbWF5IGluZGljYXRlIG11bHRpLWNvbHVtbiBvciB0YWJsZSBmb3JtYXR0aW5nLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgJHtsb25nTGluZXMubGVuZ3RofSBvdmVyLWxvbmcgbGluZXNgKTtcbiAgICB9XG4gICAgaWYgKC88W2EtekEtWi9dW14+XSo+Ly50ZXN0KHJhd1RleHQpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIkhUTUwgdGFncyBkZXRlY3RlZCBpbiByZXN1bWUgdGV4dC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJIVE1MIHRhZ3MgZm91bmRcIik7XG4gICAgfVxuICAgIGlmICghL1tcXHcuKy1dK0BbXFx3Li1dK1xcLlthLXpBLVpdezIsfS8udGVzdCh0ZXh0KSkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJObyBlbWFpbCBwYXR0ZXJuIGRldGVjdGVkIGluIHBhcnNlYWJsZSByZXN1bWUgdGV4dC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJObyBlbWFpbCBkZXRlY3RlZFwiKTtcbiAgICB9XG4gICAgaWYgKGlucHV0LnJhd1RleHQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBpbnB1dC5yYXdUZXh0LnRyaW0oKS5sZW5ndGggPCAyMDAgJiZcbiAgICAgICAgaW5wdXQucHJvZmlsZS5leHBlcmllbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMztcbiAgICAgICAgbm90ZXMucHVzaChcIkV4dHJhY3RlZCB0ZXh0IGlzIHZlcnkgc2hvcnQgZm9yIGEgcmVzdW1lIHdpdGggZXhwZXJpZW5jZS5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJQb3NzaWJsZSBpbWFnZS1vbmx5IFBERlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImF0c0ZyaWVuZGxpbmVzc1wiLFxuICAgICAgICBsYWJlbDogXCJBVFMgZnJpZW5kbGluZXNzXCIsXG4gICAgICAgIGVhcm5lZDogTWF0aC5tYXgoMCwgU1VCX1NDT1JFX01BWF9QT0lOVFMuYXRzRnJpZW5kbGluZXNzIC0gZGVkdWN0aW9ucyksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMuYXRzRnJpZW5kbGluZXNzLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IGV2aWRlbmNlLmxlbmd0aCA+IDAgPyBldmlkZW5jZSA6IFtcIk5vIEFUUyBmb3JtYXR0aW5nIGlzc3VlcyBkZXRlY3RlZC5cIl0sXG4gICAgfTtcbn1cbiIsIi8qKlxuICogU3lub255bSBncm91cHMgZm9yIHNlbWFudGljIGtleXdvcmQgbWF0Y2hpbmcgaW4gQVRTIHNjb3JpbmcuXG4gKiBFYWNoIGdyb3VwIG1hcHMgYSBjYW5vbmljYWwgdGVybSB0byBpdHMgc3lub255bXMvdmFyaWF0aW9ucy5cbiAqIEFsbCB0ZXJtcyBzaG91bGQgYmUgbG93ZXJjYXNlLlxuICovXG5leHBvcnQgY29uc3QgU1lOT05ZTV9HUk9VUFMgPSBbXG4gICAgLy8gUHJvZ3JhbW1pbmcgTGFuZ3VhZ2VzXG4gICAgeyBjYW5vbmljYWw6IFwiamF2YXNjcmlwdFwiLCBzeW5vbnltczogW1wianNcIiwgXCJlY21hc2NyaXB0XCIsIFwiZXM2XCIsIFwiZXMyMDE1XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwidHlwZXNjcmlwdFwiLCBzeW5vbnltczogW1widHNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJweXRob25cIiwgc3lub255bXM6IFtcInB5XCIsIFwicHl0aG9uM1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImdvbGFuZ1wiLCBzeW5vbnltczogW1wiZ29cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJjI1wiLCBzeW5vbnltczogW1wiY3NoYXJwXCIsIFwiYyBzaGFycFwiLCBcImRvdG5ldFwiLCBcIi5uZXRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJjKytcIiwgc3lub255bXM6IFtcImNwcFwiLCBcImNwbHVzcGx1c1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInJ1YnlcIiwgc3lub255bXM6IFtcInJiXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwia290bGluXCIsIHN5bm9ueW1zOiBbXCJrdFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm9iamVjdGl2ZS1jXCIsIHN5bm9ueW1zOiBbXCJvYmpjXCIsIFwib2JqLWNcIl0gfSxcbiAgICAvLyBGcm9udGVuZCBGcmFtZXdvcmtzXG4gICAgeyBjYW5vbmljYWw6IFwicmVhY3RcIiwgc3lub255bXM6IFtcInJlYWN0anNcIiwgXCJyZWFjdC5qc1wiLCBcInJlYWN0IGpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiYW5ndWxhclwiLCBzeW5vbnltczogW1wiYW5ndWxhcmpzXCIsIFwiYW5ndWxhci5qc1wiLCBcImFuZ3VsYXIganNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJ2dWVcIiwgc3lub255bXM6IFtcInZ1ZWpzXCIsIFwidnVlLmpzXCIsIFwidnVlIGpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibmV4dC5qc1wiLCBzeW5vbnltczogW1wibmV4dGpzXCIsIFwibmV4dCBqc1wiLCBcIm5leHRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJudXh0XCIsIHN5bm9ueW1zOiBbXCJudXh0anNcIiwgXCJudXh0LmpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwic3ZlbHRlXCIsIHN5bm9ueW1zOiBbXCJzdmVsdGVqc1wiLCBcInN2ZWx0ZWtpdFwiXSB9LFxuICAgIC8vIEJhY2tlbmQgRnJhbWV3b3Jrc1xuICAgIHsgY2Fub25pY2FsOiBcIm5vZGUuanNcIiwgc3lub255bXM6IFtcIm5vZGVqc1wiLCBcIm5vZGUganNcIiwgXCJub2RlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZXhwcmVzc1wiLCBzeW5vbnltczogW1wiZXhwcmVzc2pzXCIsIFwiZXhwcmVzcy5qc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImRqYW5nb1wiLCBzeW5vbnltczogW1wiZGphbmdvIHJlc3QgZnJhbWV3b3JrXCIsIFwiZHJmXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmxhc2tcIiwgc3lub255bXM6IFtcImZsYXNrIHB5dGhvblwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInNwcmluZ1wiLCBzeW5vbnltczogW1wic3ByaW5nIGJvb3RcIiwgXCJzcHJpbmdib290XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicnVieSBvbiByYWlsc1wiLCBzeW5vbnltczogW1wicmFpbHNcIiwgXCJyb3JcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJmYXN0YXBpXCIsIHN5bm9ueW1zOiBbXCJmYXN0IGFwaVwiXSB9LFxuICAgIC8vIERhdGFiYXNlc1xuICAgIHsgY2Fub25pY2FsOiBcInBvc3RncmVzcWxcIiwgc3lub255bXM6IFtcInBvc3RncmVzXCIsIFwicHNxbFwiLCBcInBnXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibW9uZ29kYlwiLCBzeW5vbnltczogW1wibW9uZ29cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJteXNxbFwiLCBzeW5vbnltczogW1wibWFyaWFkYlwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImR5bmFtb2RiXCIsIHN5bm9ueW1zOiBbXCJkeW5hbW8gZGJcIiwgXCJkeW5hbW9cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJlbGFzdGljc2VhcmNoXCIsIHN5bm9ueW1zOiBbXCJlbGFzdGljIHNlYXJjaFwiLCBcImVsYXN0aWNcIiwgXCJlc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInJlZGlzXCIsIHN5bm9ueW1zOiBbXCJyZWRpcyBjYWNoZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInNxbFwiLCBzeW5vbnltczogW1wic3RydWN0dXJlZCBxdWVyeSBsYW5ndWFnZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm5vc3FsXCIsIHN5bm9ueW1zOiBbXCJubyBzcWxcIiwgXCJub24tcmVsYXRpb25hbFwiXSB9LFxuICAgIC8vIENsb3VkICYgSW5mcmFzdHJ1Y3R1cmVcbiAgICB7IGNhbm9uaWNhbDogXCJhd3NcIiwgc3lub255bXM6IFtcImFtYXpvbiB3ZWIgc2VydmljZXNcIiwgXCJhbWF6b24gY2xvdWRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJnY3BcIiwgc3lub255bXM6IFtcImdvb2dsZSBjbG91ZFwiLCBcImdvb2dsZSBjbG91ZCBwbGF0Zm9ybVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImF6dXJlXCIsIHN5bm9ueW1zOiBbXCJtaWNyb3NvZnQgYXp1cmVcIiwgXCJtcyBhenVyZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImRvY2tlclwiLCBzeW5vbnltczogW1wiY29udGFpbmVyaXphdGlvblwiLCBcImNvbnRhaW5lcnNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJrdWJlcm5ldGVzXCIsIHN5bm9ueW1zOiBbXCJrOHNcIiwgXCJrdWJlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwidGVycmFmb3JtXCIsIHN5bm9ueW1zOiBbXCJpbmZyYXN0cnVjdHVyZSBhcyBjb2RlXCIsIFwiaWFjXCJdIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY2kvY2RcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwiY2ljZFwiLFxuICAgICAgICAgICAgXCJjaSBjZFwiLFxuICAgICAgICAgICAgXCJjb250aW51b3VzIGludGVncmF0aW9uXCIsXG4gICAgICAgICAgICBcImNvbnRpbnVvdXMgZGVwbG95bWVudFwiLFxuICAgICAgICAgICAgXCJjb250aW51b3VzIGRlbGl2ZXJ5XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJkZXZvcHNcIiwgc3lub255bXM6IFtcImRldiBvcHNcIiwgXCJzaXRlIHJlbGlhYmlsaXR5XCIsIFwic3JlXCJdIH0sXG4gICAgLy8gVG9vbHMgJiBQbGF0Zm9ybXNcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJnaXRcIixcbiAgICAgICAgc3lub255bXM6IFtcImdpdGh1YlwiLCBcImdpdGxhYlwiLCBcImJpdGJ1Y2tldFwiLCBcInZlcnNpb24gY29udHJvbFwiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcImppcmFcIiwgc3lub255bXM6IFtcImF0bGFzc2lhbiBqaXJhXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmlnbWFcIiwgc3lub255bXM6IFtcImZpZ21hIGRlc2lnblwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIndlYnBhY2tcIiwgc3lub255bXM6IFtcIm1vZHVsZSBidW5kbGVyXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZ3JhcGhxbFwiLCBzeW5vbnltczogW1wiZ3JhcGggcWxcIiwgXCJncWxcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJyZXN0IGFwaVwiLFxuICAgICAgICBzeW5vbnltczogW1wicmVzdGZ1bFwiLCBcInJlc3RmdWwgYXBpXCIsIFwicmVzdFwiLCBcImFwaVwiXSxcbiAgICB9LFxuICAgIC8vIFJvbGUgVGVybXNcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJmcm9udGVuZFwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJmcm9udC1lbmRcIixcbiAgICAgICAgICAgIFwiZnJvbnQgZW5kXCIsXG4gICAgICAgICAgICBcImNsaWVudC1zaWRlXCIsXG4gICAgICAgICAgICBcImNsaWVudCBzaWRlXCIsXG4gICAgICAgICAgICBcInVpIGRldmVsb3BtZW50XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJiYWNrZW5kXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJiYWNrLWVuZFwiLCBcImJhY2sgZW5kXCIsIFwic2VydmVyLXNpZGVcIiwgXCJzZXJ2ZXIgc2lkZVwiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcImZ1bGxzdGFja1wiLCBzeW5vbnltczogW1wiZnVsbC1zdGFja1wiLCBcImZ1bGwgc3RhY2tcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJzb2Z0d2FyZSBlbmdpbmVlclwiLFxuICAgICAgICBzeW5vbnltczogW1wic29mdHdhcmUgZGV2ZWxvcGVyXCIsIFwic3dlXCIsIFwiZGV2ZWxvcGVyXCIsIFwicHJvZ3JhbW1lclwiLCBcImNvZGVyXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZGF0YSBzY2llbnRpc3RcIixcbiAgICAgICAgc3lub255bXM6IFtcImRhdGEgc2NpZW5jZVwiLCBcIm1sIGVuZ2luZWVyXCIsIFwibWFjaGluZSBsZWFybmluZyBlbmdpbmVlclwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImRhdGEgZW5naW5lZXJcIixcbiAgICAgICAgc3lub255bXM6IFtcImRhdGEgZW5naW5lZXJpbmdcIiwgXCJldGwgZGV2ZWxvcGVyXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicHJvZHVjdCBtYW5hZ2VyXCIsIHN5bm9ueW1zOiBbXCJwbVwiLCBcInByb2R1Y3Qgb3duZXJcIiwgXCJwb1wiXSB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInFhIGVuZ2luZWVyXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJxdWFsaXR5IGFzc3VyYW5jZVwiLCBcInFhXCIsIFwidGVzdCBlbmdpbmVlclwiLCBcInNkZXRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ1eCBkZXNpZ25lclwiLFxuICAgICAgICBzeW5vbnltczogW1widXhcIiwgXCJ1c2VyIGV4cGVyaWVuY2VcIiwgXCJ1aS91eFwiLCBcInVpIHV4XCJdLFxuICAgIH0sXG4gICAgLy8gTWV0aG9kb2xvZ2llc1xuICAgIHsgY2Fub25pY2FsOiBcImFnaWxlXCIsIHN5bm9ueW1zOiBbXCJzY3J1bVwiLCBcImthbmJhblwiLCBcInNwcmludFwiLCBcInNwcmludHNcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ0ZGRcIixcbiAgICAgICAgc3lub255bXM6IFtcInRlc3QgZHJpdmVuIGRldmVsb3BtZW50XCIsIFwidGVzdC1kcml2ZW4gZGV2ZWxvcG1lbnRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJiZGRcIixcbiAgICAgICAgc3lub255bXM6IFtcImJlaGF2aW9yIGRyaXZlbiBkZXZlbG9wbWVudFwiLCBcImJlaGF2aW9yLWRyaXZlbiBkZXZlbG9wbWVudFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcIm1pY3Jvc2VydmljZXNcIixcbiAgICAgICAgc3lub255bXM6IFtcIm1pY3JvIHNlcnZpY2VzXCIsIFwibWljcm8tc2VydmljZXNcIiwgXCJzZXJ2aWNlLW9yaWVudGVkXCJdLFxuICAgIH0sXG4gICAgLy8gU29mdCBTa2lsbHNcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJsZWFkZXJzaGlwXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcImxlZFwiLFxuICAgICAgICAgICAgXCJtYW5hZ2VkXCIsXG4gICAgICAgICAgICBcImRpcmVjdGVkXCIsXG4gICAgICAgICAgICBcInN1cGVydmlzZWRcIixcbiAgICAgICAgICAgIFwibWVudG9yZWRcIixcbiAgICAgICAgICAgIFwidGVhbSBsZWFkXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJjb21tdW5pY2F0aW9uXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJjb21tdW5pY2F0ZWRcIiwgXCJwcmVzZW50ZWRcIiwgXCJwdWJsaWMgc3BlYWtpbmdcIiwgXCJpbnRlcnBlcnNvbmFsXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY29sbGFib3JhdGlvblwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJjb2xsYWJvcmF0ZWRcIixcbiAgICAgICAgICAgIFwidGVhbXdvcmtcIixcbiAgICAgICAgICAgIFwiY3Jvc3MtZnVuY3Rpb25hbFwiLFxuICAgICAgICAgICAgXCJjcm9zcyBmdW5jdGlvbmFsXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJwcm9ibGVtIHNvbHZpbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcInByb2JsZW0tc29sdmluZ1wiLCBcInRyb3VibGVzaG9vdGluZ1wiLCBcImRlYnVnZ2luZ1wiLCBcImFuYWx5dGljYWxcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJwcm9qZWN0IG1hbmFnZW1lbnRcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwicHJvamVjdC1tYW5hZ2VtZW50XCIsXG4gICAgICAgICAgICBcInByb2dyYW0gbWFuYWdlbWVudFwiLFxuICAgICAgICAgICAgXCJzdGFrZWhvbGRlciBtYW5hZ2VtZW50XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ0aW1lIG1hbmFnZW1lbnRcIixcbiAgICAgICAgc3lub255bXM6IFtcInRpbWUtbWFuYWdlbWVudFwiLCBcInByaW9yaXRpemF0aW9uXCIsIFwib3JnYW5pemF0aW9uXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibWVudG9yaW5nXCIsIHN5bm9ueW1zOiBbXCJjb2FjaGluZ1wiLCBcInRyYWluaW5nXCIsIFwib25ib2FyZGluZ1wiXSB9LFxuICAgIC8vIERhdGEgJiBNTFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcIm1hY2hpbmUgbGVhcm5pbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcIm1sXCIsIFwiZGVlcCBsZWFybmluZ1wiLCBcImRsXCIsIFwiYWlcIiwgXCJhcnRpZmljaWFsIGludGVsbGlnZW5jZVwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcIm5scFwiLFxuICAgICAgICBzeW5vbnltczogW1wibmF0dXJhbCBsYW5ndWFnZSBwcm9jZXNzaW5nXCIsIFwidGV4dCBwcm9jZXNzaW5nXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY29tcHV0ZXIgdmlzaW9uXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJjdlwiLCBcImltYWdlIHJlY29nbml0aW9uXCIsIFwiaW1hZ2UgcHJvY2Vzc2luZ1wiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcInRlbnNvcmZsb3dcIiwgc3lub255bXM6IFtcImtlcmFzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicHl0b3JjaFwiLCBzeW5vbnltczogW1widG9yY2hcIl0gfSxcbiAgICAvLyBUZXN0aW5nXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwidW5pdCB0ZXN0aW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJ1bml0IHRlc3RzXCIsIFwiamVzdFwiLCBcIm1vY2hhXCIsIFwidml0ZXN0XCIsIFwicHl0ZXN0XCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiaW50ZWdyYXRpb24gdGVzdGluZ1wiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJpbnRlZ3JhdGlvbiB0ZXN0c1wiLFxuICAgICAgICAgICAgXCJlMmUgdGVzdGluZ1wiLFxuICAgICAgICAgICAgXCJlbmQtdG8tZW5kIHRlc3RpbmdcIixcbiAgICAgICAgICAgIFwiZW5kIHRvIGVuZFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYXV0b21hdGlvbiB0ZXN0aW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcInRlc3QgYXV0b21hdGlvblwiLFxuICAgICAgICAgICAgXCJhdXRvbWF0ZWQgdGVzdGluZ1wiLFxuICAgICAgICAgICAgXCJzZWxlbml1bVwiLFxuICAgICAgICAgICAgXCJjeXByZXNzXCIsXG4gICAgICAgICAgICBcInBsYXl3cmlnaHRcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIC8vIFNlY3VyaXR5XG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY3liZXJzZWN1cml0eVwiLFxuICAgICAgICBzeW5vbnltczogW1wiY3liZXIgc2VjdXJpdHlcIiwgXCJpbmZvcm1hdGlvbiBzZWN1cml0eVwiLCBcImluZm9zZWNcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJhdXRoZW50aWNhdGlvblwiLFxuICAgICAgICBzeW5vbnltczogW1wiYXV0aFwiLCBcIm9hdXRoXCIsIFwic3NvXCIsIFwic2luZ2xlIHNpZ24tb25cIl0sXG4gICAgfSxcbiAgICAvLyBNb2JpbGVcbiAgICB7IGNhbm9uaWNhbDogXCJpb3NcIiwgc3lub255bXM6IFtcInN3aWZ0XCIsIFwiYXBwbGUgZGV2ZWxvcG1lbnRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJhbmRyb2lkXCIsIHN5bm9ueW1zOiBbXCJhbmRyb2lkIGRldmVsb3BtZW50XCIsIFwia290bGluIGFuZHJvaWRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJyZWFjdCBuYXRpdmVcIiwgc3lub255bXM6IFtcInJlYWN0LW5hdGl2ZVwiLCBcInJuXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmx1dHRlclwiLCBzeW5vbnltczogW1wiZGFydFwiXSB9LFxuICAgIC8vIEJ1c2luZXNzICYgQW5hbHl0aWNzXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYnVzaW5lc3MgaW50ZWxsaWdlbmNlXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJiaVwiLCBcInRhYmxlYXVcIiwgXCJwb3dlciBiaVwiLCBcImxvb2tlclwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImRhdGEgYW5hbHlzaXNcIixcbiAgICAgICAgc3lub255bXM6IFtcImRhdGEgYW5hbHl0aWNzXCIsIFwiZGF0YSBhbmFseXN0XCIsIFwiYW5hbHl0aWNzXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZXRsXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJleHRyYWN0IHRyYW5zZm9ybSBsb2FkXCIsIFwiZGF0YSBwaXBlbGluZVwiLCBcImRhdGEgcGlwZWxpbmVzXCJdLFxuICAgIH0sXG5dO1xuLyoqXG4gKiBCdWlsZHMgYSBsb29rdXAgbWFwIGZyb20gYW55IHRlcm0gKGNhbm9uaWNhbCBvciBzeW5vbnltKSB0b1xuICogdGhlIHNldCBvZiBhbGwgdGVybXMgaW4gdGhlIHNhbWUgZ3JvdXAgKGluY2x1ZGluZyB0aGUgY2Fub25pY2FsIGZvcm0pLlxuICogQWxsIGtleXMgYW5kIHZhbHVlcyBhcmUgbG93ZXJjYXNlLlxuICovXG5mdW5jdGlvbiBidWlsZFN5bm9ueW1Mb29rdXAoKSB7XG4gICAgY29uc3QgbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgU1lOT05ZTV9HUk9VUFMpIHtcbiAgICAgICAgY29uc3QgYWxsVGVybXMgPSBbZ3JvdXAuY2Fub25pY2FsLCAuLi5ncm91cC5zeW5vbnltc107XG4gICAgICAgIGNvbnN0IHRlcm1TZXQgPSBuZXcgU2V0KGFsbFRlcm1zKTtcbiAgICAgICAgZm9yIChjb25zdCB0ZXJtIG9mIGFsbFRlcm1zKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IGxvb2t1cC5nZXQodGVybSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBNZXJnZSBzZXRzIGlmIHRlcm0gYXBwZWFycyBpbiBtdWx0aXBsZSBncm91cHNcbiAgICAgICAgICAgICAgICB0ZXJtU2V0LmZvckVhY2goKHQpID0+IGV4aXN0aW5nLmFkZCh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb29rdXAuc2V0KHRlcm0sIG5ldyBTZXQodGVybVNldCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb29rdXA7XG59XG5jb25zdCBzeW5vbnltTG9va3VwID0gYnVpbGRTeW5vbnltTG9va3VwKCk7XG4vKipcbiAqIFJldHVybnMgYWxsIHN5bm9ueW1zIGZvciBhIGdpdmVuIHRlcm0gKGluY2x1ZGluZyB0aGUgdGVybSBpdHNlbGYpLlxuICogUmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBubyBzeW5vbnltcyBhcmUgZm91bmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTeW5vbnltcyh0ZXJtKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IHRlcm0udG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgY29uc3QgZ3JvdXAgPSBzeW5vbnltTG9va3VwLmdldChub3JtYWxpemVkKTtcbiAgICBpZiAoIWdyb3VwKVxuICAgICAgICByZXR1cm4gW107XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZ3JvdXApO1xufVxuLyoqXG4gKiBDaGVja3MgaWYgdHdvIHRlcm1zIGFyZSBzeW5vbnltcyBvZiBlYWNoIG90aGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJlU3lub255bXModGVybUEsIHRlcm1CKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZEEgPSB0ZXJtQS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICBjb25zdCBub3JtYWxpemVkQiA9IHRlcm1CLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGlmIChub3JtYWxpemVkQSA9PT0gbm9ybWFsaXplZEIpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGdyb3VwID0gc3lub255bUxvb2t1cC5nZXQobm9ybWFsaXplZEEpO1xuICAgIHJldHVybiBncm91cCA/IGdyb3VwLmhhcyhub3JtYWxpemVkQikgOiBmYWxzZTtcbn1cbi8qKiBXZWlnaHQgYXBwbGllZCB0byBzeW5vbnltIG1hdGNoZXMgKHZzIDEuMCBmb3IgZXhhY3QgbWF0Y2hlcykgKi9cbmV4cG9ydCBjb25zdCBTWU5PTllNX01BVENIX1dFSUdIVCA9IDAuODtcbiIsImltcG9ydCB7IGdldFN5bm9ueW1zLCBTWU5PTllNX01BVENIX1dFSUdIVCB9IGZyb20gXCIuL3N5bm9ueW1zXCI7XG5pbXBvcnQgeyBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY29udGFpbnNXb3JkLCBjb3VudFdvcmRPY2N1cnJlbmNlcywgZ2V0UmVzdW1lVGV4dCwgbm9ybWFsaXplVGV4dCwgfSBmcm9tIFwiLi90ZXh0XCI7XG5jb25zdCBTVE9QX1dPUkRTID0gbmV3IFNldChbXG4gICAgXCJhXCIsXG4gICAgXCJhblwiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJhcmVcIixcbiAgICBcImFzXCIsXG4gICAgXCJhdFwiLFxuICAgIFwiYmVcIixcbiAgICBcImJ5XCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZyb21cIixcbiAgICBcImluXCIsXG4gICAgXCJvZlwiLFxuICAgIFwib25cIixcbiAgICBcIm9yXCIsXG4gICAgXCJvdXJcIixcbiAgICBcInRoZVwiLFxuICAgIFwidG9cIixcbiAgICBcIndlXCIsXG4gICAgXCJ3aXRoXCIsXG4gICAgXCJ5b3VcIixcbiAgICBcInlvdXJcIixcbl0pO1xuZnVuY3Rpb24gdG9rZW5pemVLZXl3b3Jkcyh0ZXh0KSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZVRleHQodGV4dClcbiAgICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgICAgLm1hcCgodG9rZW4pID0+IHRva2VuLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcigodG9rZW4pID0+IHRva2VuLmxlbmd0aCA+PSAzICYmICFTVE9QX1dPUkRTLmhhcyh0b2tlbikpO1xufVxuZnVuY3Rpb24gdG9wVG9rZW5zKHRleHQsIGxpbWl0KSB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5pemVLZXl3b3Jkcyh0ZXh0KSkge1xuICAgICAgICBjb3VudHMuc2V0KHRva2VuLCAoY291bnRzLmdldCh0b2tlbikgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oY291bnRzLmVudHJpZXMoKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdIHx8IGFbMF0ubG9jYWxlQ29tcGFyZShiWzBdKSlcbiAgICAgICAgLnNsaWNlKDAsIGxpbWl0KVxuICAgICAgICAubWFwKChbdG9rZW5dKSA9PiB0b2tlbik7XG59XG5mdW5jdGlvbiBidWlsZEtleXdvcmRTZXQoam9iKSB7XG4gICAgY29uc3Qga2V5d29yZHMgPSBbXG4gICAgICAgIC4uLmpvYi5rZXl3b3JkcyxcbiAgICAgICAgLi4uam9iLnJlcXVpcmVtZW50cy5mbGF0TWFwKHRva2VuaXplS2V5d29yZHMpLFxuICAgICAgICAuLi50b3BUb2tlbnMoam9iLmRlc2NyaXB0aW9uLCAxMCksXG4gICAgXTtcbiAgICBjb25zdCBub3JtYWxpemVkID0ga2V5d29yZHNcbiAgICAgICAgLm1hcCgoa2V5d29yZCkgPT4gbm9ybWFsaXplVGV4dChrZXl3b3JkKSlcbiAgICAgICAgLmZpbHRlcigoa2V5d29yZCkgPT4ga2V5d29yZC5sZW5ndGggPj0gMiAmJiAhU1RPUF9XT1JEUy5oYXMoa2V5d29yZCkpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQobm9ybWFsaXplZCkpLnNsaWNlKDAsIDI0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzY29yZUtleXdvcmRNYXRjaChpbnB1dCkge1xuICAgIGlmICghaW5wdXQuam9iKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IFwia2V5d29yZE1hdGNoXCIsXG4gICAgICAgICAgICBsYWJlbDogXCJLZXl3b3JkIG1hdGNoXCIsXG4gICAgICAgICAgICBlYXJuZWQ6IDE4LFxuICAgICAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5rZXl3b3JkTWF0Y2gsXG4gICAgICAgICAgICBub3RlczogW1wiTm8gam9iIGRlc2NyaXB0aW9uIHN1cHBsaWVkOyBuZXV0cmFsIGJhc2VsaW5lLlwiXSxcbiAgICAgICAgICAgIGV2aWRlbmNlOiBbXCJObyBqb2IgZGVzY3JpcHRpb24gc3VwcGxpZWQuXCJdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBrZXl3b3JkcyA9IGJ1aWxkS2V5d29yZFNldChpbnB1dC5qb2IpO1xuICAgIGlmIChrZXl3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogXCJrZXl3b3JkTWF0Y2hcIixcbiAgICAgICAgICAgIGxhYmVsOiBcIktleXdvcmQgbWF0Y2hcIixcbiAgICAgICAgICAgIGVhcm5lZDogMTgsXG4gICAgICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmtleXdvcmRNYXRjaCxcbiAgICAgICAgICAgIG5vdGVzOiBbXCJKb2IgZGVzY3JpcHRpb24gaGFzIG5vIHVzYWJsZSBrZXl3b3JkczsgbmV1dHJhbCBiYXNlbGluZS5cIl0sXG4gICAgICAgICAgICBldmlkZW5jZTogW1wiMCBrZXl3b3JkcyBhdmFpbGFibGUuXCJdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCByZXN1bWVUZXh0ID0gbm9ybWFsaXplVGV4dChnZXRSZXN1bWVUZXh0KGlucHV0LnByb2ZpbGUsIGlucHV0LnJhd1RleHQpKTtcbiAgICBsZXQgd2VpZ2h0ZWRIaXRzID0gMDtcbiAgICBsZXQgZXhhY3RIaXRzID0gMDtcbiAgICBsZXQgc3R1ZmZpbmcgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGtleXdvcmQgb2Yga2V5d29yZHMpIHtcbiAgICAgICAgY29uc3QgZnJlcXVlbmN5ID0gY291bnRXb3JkT2NjdXJyZW5jZXMocmVzdW1lVGV4dCwga2V5d29yZCk7XG4gICAgICAgIGlmIChmcmVxdWVuY3kgPiAxMClcbiAgICAgICAgICAgIHN0dWZmaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKGZyZXF1ZW5jeSA+IDApIHtcbiAgICAgICAgICAgIHdlaWdodGVkSGl0cyArPSAxO1xuICAgICAgICAgICAgZXhhY3RIaXRzICs9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzeW5vbnltSGl0ID0gZ2V0U3lub255bXMoa2V5d29yZCkuc29tZSgoc3lub255bSkgPT4gc3lub255bSAhPT0ga2V5d29yZCAmJiBjb250YWluc1dvcmQocmVzdW1lVGV4dCwgc3lub255bSkpO1xuICAgICAgICBpZiAoc3lub255bUhpdClcbiAgICAgICAgICAgIHdlaWdodGVkSGl0cyArPSBTWU5PTllNX01BVENIX1dFSUdIVDtcbiAgICB9XG4gICAgY29uc3QgcmF3RWFybmVkID0gTWF0aC5yb3VuZCgod2VpZ2h0ZWRIaXRzIC8ga2V5d29yZHMubGVuZ3RoKSAqIFNVQl9TQ09SRV9NQVhfUE9JTlRTLmtleXdvcmRNYXRjaCk7XG4gICAgY29uc3QgZWFybmVkID0gTWF0aC5tYXgoMCwgcmF3RWFybmVkIC0gKHN0dWZmaW5nID8gMiA6IDApKTtcbiAgICBjb25zdCBub3RlcyA9IGV4YWN0SGl0cyA9PT0ga2V5d29yZHMubGVuZ3RoXG4gICAgICAgID8gW11cbiAgICAgICAgOiBbXCJBZGQgbmF0dXJhbCBtZW50aW9ucyBvZiBtaXNzaW5nIHRhcmdldCBqb2Iga2V5d29yZHMuXCJdO1xuICAgIGlmIChzdHVmZmluZylcbiAgICAgICAgbm90ZXMucHVzaChcIktleXdvcmQgc3R1ZmZpbmcgZGV0ZWN0ZWQ7IHJlcGVhdGVkIHRlcm1zIHRvbyBvZnRlbi5cIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImtleXdvcmRNYXRjaFwiLFxuICAgICAgICBsYWJlbDogXCJLZXl3b3JkIG1hdGNoXCIsXG4gICAgICAgIGVhcm5lZCxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5rZXl3b3JkTWF0Y2gsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogW1xuICAgICAgICAgICAgYCR7ZXhhY3RIaXRzfS8ke2tleXdvcmRzLmxlbmd0aH0ga2V5d29yZHMgbWF0Y2hlZGAsXG4gICAgICAgICAgICBgJHt3ZWlnaHRlZEhpdHMudG9GaXhlZCgxKX0vJHtrZXl3b3Jkcy5sZW5ndGh9IHdlaWdodGVkIGtleXdvcmQgaGl0c2AsXG4gICAgICAgIF0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXN1bWVUZXh0LCB3b3JkQ291bnQgfSBmcm9tIFwiLi90ZXh0XCI7XG5mdW5jdGlvbiBwb2ludHNGb3JXb3JkQ291bnQoY291bnQpIHtcbiAgICBpZiAoY291bnQgPj0gNDAwICYmIGNvdW50IDw9IDcwMClcbiAgICAgICAgcmV0dXJuIDEwO1xuICAgIGlmICgoY291bnQgPj0gMzAwICYmIGNvdW50IDw9IDM5OSkgfHwgKGNvdW50ID49IDcwMSAmJiBjb3VudCA8PSA5MDApKVxuICAgICAgICByZXR1cm4gNztcbiAgICBpZiAoKGNvdW50ID49IDIwMCAmJiBjb3VudCA8PSAyOTkpIHx8IChjb3VudCA+PSA5MDEgJiYgY291bnQgPD0gMTEwMCkpXG4gICAgICAgIHJldHVybiA0O1xuICAgIGlmICgoY291bnQgPj0gMTUwICYmIGNvdW50IDw9IDE5OSkgfHwgKGNvdW50ID49IDExMDEgJiYgY291bnQgPD0gMTQwMCkpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlTGVuZ3RoKGlucHV0KSB7XG4gICAgY29uc3QgY291bnQgPSB3b3JkQ291bnQoZ2V0UmVzdW1lVGV4dChpbnB1dC5wcm9maWxlLCBpbnB1dC5yYXdUZXh0KSk7XG4gICAgY29uc3QgZWFybmVkID0gcG9pbnRzRm9yV29yZENvdW50KGNvdW50KTtcbiAgICBjb25zdCBub3RlcyA9IGVhcm5lZCA9PT0gU1VCX1NDT1JFX01BWF9QT0lOVFMubGVuZ3RoXG4gICAgICAgID8gW11cbiAgICAgICAgOiBbXCJSZXN1bWUgbGVuZ3RoIGlzIG91dHNpZGUgdGhlIDQwMC03MDAgd29yZCB0YXJnZXQgYmFuZC5cIl07XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImxlbmd0aFwiLFxuICAgICAgICBsYWJlbDogXCJMZW5ndGhcIixcbiAgICAgICAgZWFybmVkLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmxlbmd0aCxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbYCR7Y291bnR9IHdvcmRzYF0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFFVQU5USUZJRURfUkVHRVgsIFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRIaWdobGlnaHRzIH0gZnJvbSBcIi4vdGV4dFwiO1xuZnVuY3Rpb24gcG9pbnRzRm9yUXVhbnRpZmllZFJlc3VsdHMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgIHJldHVybiAwO1xuICAgIGlmIChjb3VudCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIDY7XG4gICAgaWYgKGNvdW50ID09PSAyKVxuICAgICAgICByZXR1cm4gMTI7XG4gICAgaWYgKGNvdW50IDw9IDQpXG4gICAgICAgIHJldHVybiAxNjtcbiAgICByZXR1cm4gMjA7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzKGlucHV0KSB7XG4gICAgY29uc3QgdGV4dCA9IGdldEhpZ2hsaWdodHMoaW5wdXQucHJvZmlsZSkuam9pbihcIlxcblwiKTtcbiAgICBjb25zdCBtYXRjaGVzID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKFFVQU5USUZJRURfUkVHRVgpLCAobWF0Y2gpID0+IG1hdGNoWzBdKTtcbiAgICBjb25zdCBub3RlcyA9IG1hdGNoZXMubGVuZ3RoID09PSAwXG4gICAgICAgID8gW1wiQWRkIG1ldHJpY3Mgc3VjaCBhcyBwZXJjZW50YWdlcywgdm9sdW1lLCB0ZWFtIHNpemUsIG9yIHJldmVudWUuXCJdXG4gICAgICAgIDogW107XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcInF1YW50aWZpZWRBY2hpZXZlbWVudHNcIixcbiAgICAgICAgbGFiZWw6IFwiUXVhbnRpZmllZCBhY2hpZXZlbWVudHNcIixcbiAgICAgICAgZWFybmVkOiBwb2ludHNGb3JRdWFudGlmaWVkUmVzdWx0cyhtYXRjaGVzLmxlbmd0aCksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMucXVhbnRpZmllZEFjaGlldmVtZW50cyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbXG4gICAgICAgICAgICBgJHttYXRjaGVzLmxlbmd0aH0gcXVhbnRpZmllZCByZXN1bHQocylgLFxuICAgICAgICAgICAgLi4ubWF0Y2hlcy5zbGljZSgwLCAzKSxcbiAgICAgICAgXSxcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmV4cG9ydCBmdW5jdGlvbiBzY29yZVNlY3Rpb25Db21wbGV0ZW5lc3MoaW5wdXQpIHtcbiAgICBjb25zdCB7IHByb2ZpbGUgfSA9IGlucHV0O1xuICAgIGNvbnN0IG5vdGVzID0gW107XG4gICAgY29uc3QgZXZpZGVuY2UgPSBbXTtcbiAgICBsZXQgZWFybmVkID0gMDtcbiAgICBsZXQgY29tcGxldGVTZWN0aW9ucyA9IDA7XG4gICAgaWYgKHByb2ZpbGUuY29udGFjdC5uYW1lPy50cmltKCkpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiTWlzc2luZyBjb250YWN0IG5hbWUuXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5jb250YWN0LmVtYWlsPy50cmltKCkpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiTWlzc2luZyBjb250YWN0IGVtYWlsLlwiKTtcbiAgICB9XG4gICAgY29uc3Qgc3VtbWFyeUxlbmd0aCA9IHByb2ZpbGUuc3VtbWFyeT8udHJpbSgpLmxlbmd0aCA/PyAwO1xuICAgIGlmIChzdW1tYXJ5TGVuZ3RoID49IDUwICYmIHN1bW1hcnlMZW5ndGggPD0gNTAwKSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiU3VtbWFyeSBzaG91bGQgYmUgYmV0d2VlbiA1MCBhbmQgNTAwIGNoYXJhY3RlcnMuXCIpO1xuICAgIH1cbiAgICBjb25zdCBoYXNFeHBlcmllbmNlID0gcHJvZmlsZS5leHBlcmllbmNlcy5zb21lKChleHBlcmllbmNlKSA9PiBleHBlcmllbmNlLnRpdGxlLnRyaW0oKSAmJlxuICAgICAgICBleHBlcmllbmNlLmNvbXBhbnkudHJpbSgpICYmXG4gICAgICAgIGV4cGVyaWVuY2Uuc3RhcnREYXRlLnRyaW0oKSk7XG4gICAgaWYgKGhhc0V4cGVyaWVuY2UpIHtcbiAgICAgICAgZWFybmVkICs9IDI7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYXQgbGVhc3Qgb25lIHJvbGUgd2l0aCB0aXRsZSwgY29tcGFueSwgYW5kIHN0YXJ0IGRhdGUuXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5lZHVjYXRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBhdCBsZWFzdCBvbmUgZWR1Y2F0aW9uIGVudHJ5LlwiKTtcbiAgICB9XG4gICAgaWYgKHByb2ZpbGUuc2tpbGxzLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgIGVhcm5lZCArPSAyO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2UgaWYgKHByb2ZpbGUuc2tpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYXQgbGVhc3QgdGhyZWUgc2tpbGxzLlwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYSBza2lsbHMgc2VjdGlvbi5cIik7XG4gICAgfVxuICAgIGNvbnN0IGhhc0hpZ2hsaWdodCA9IHByb2ZpbGUuZXhwZXJpZW5jZXMuc29tZSgoZXhwZXJpZW5jZSkgPT4gZXhwZXJpZW5jZS5oaWdobGlnaHRzLmxlbmd0aCA+IDApO1xuICAgIGlmIChoYXNIaWdobGlnaHQpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYWNoaWV2ZW1lbnQgaGlnaGxpZ2h0cyB0byBleHBlcmllbmNlLlwiKTtcbiAgICB9XG4gICAgY29uc3QgaGFzU2Vjb25kYXJ5Q29udGFjdCA9IEJvb2xlYW4ocHJvZmlsZS5jb250YWN0LnBob25lPy50cmltKCkgfHxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0LmxpbmtlZGluPy50cmltKCkgfHxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0LmxvY2F0aW9uPy50cmltKCkpO1xuICAgIGlmIChoYXNTZWNvbmRhcnlDb250YWN0KSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIHBob25lLCBMaW5rZWRJbiwgb3IgbG9jYXRpb24uXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5jb250YWN0Lm5hbWU/LnRyaW0oKSAmJiBwcm9maWxlLmNvbnRhY3QuZW1haWw/LnRyaW0oKSkge1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGV2aWRlbmNlLnB1c2goYCR7Y29tcGxldGVTZWN0aW9uc30vNyBzZWN0aW9ucyBjb21wbGV0ZWApO1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJzZWN0aW9uQ29tcGxldGVuZXNzXCIsXG4gICAgICAgIGxhYmVsOiBcIlNlY3Rpb24gY29tcGxldGVuZXNzXCIsXG4gICAgICAgIGVhcm5lZDogTWF0aC5taW4oZWFybmVkLCBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zZWN0aW9uQ29tcGxldGVuZXNzKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zZWN0aW9uQ29tcGxldGVuZXNzLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2UsXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFDVElPTl9WRVJCUywgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldEhpZ2hsaWdodHMsIG5vcm1hbGl6ZVRleHQgfSBmcm9tIFwiLi90ZXh0XCI7XG5jb25zdCBSRVBFQVRFRF9XT1JEX0VYQ0VQVElPTlMgPSBuZXcgU2V0KFtcImhhZCBoYWRcIiwgXCJ0aGF0IHRoYXRcIl0pO1xuY29uc3QgQUNST05ZTVMgPSBuZXcgU2V0KFtcIkFQSVwiLCBcIkFXU1wiLCBcIkNTU1wiLCBcIkdDUFwiLCBcIkhUTUxcIiwgXCJTUUxcIl0pO1xuZnVuY3Rpb24gaGFzVmVyYkxpa2VUb2tlbih0ZXh0KSB7XG4gICAgY29uc3Qgd29yZHMgPSBub3JtYWxpemVUZXh0KHRleHQpLnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICAgIHJldHVybiB3b3Jkcy5zb21lKCh3b3JkKSA9PiBBQ1RJT05fVkVSQlMuaW5jbHVkZXMod29yZCkgfHxcbiAgICAgICAgLyg/OmVkfGluZ3xzKSQvLnRlc3Qod29yZCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlU3BlbGxpbmdHcmFtbWFyKGlucHV0KSB7XG4gICAgY29uc3QgaGlnaGxpZ2h0cyA9IGdldEhpZ2hsaWdodHMoaW5wdXQucHJvZmlsZSk7XG4gICAgY29uc3QgdGV4dCA9IGhpZ2hsaWdodHMuam9pbihcIlxcblwiKTtcbiAgICBjb25zdCBub3RlcyA9IFtdO1xuICAgIGNvbnN0IGV2aWRlbmNlID0gW107XG4gICAgbGV0IGRlZHVjdGlvbnMgPSAwO1xuICAgIGNvbnN0IHJlcGVhdGVkID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKC9cXGIoXFx3KylcXHMrXFwxXFxiL2dpKSwgKG1hdGNoKSA9PiBtYXRjaFswXSkuZmlsdGVyKChtYXRjaCkgPT4gIVJFUEVBVEVEX1dPUkRfRVhDRVBUSU9OUy5oYXMobWF0Y2gudG9Mb3dlckNhc2UoKSkpO1xuICAgIGlmIChyZXBlYXRlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1pbigyLCByZXBlYXRlZC5sZW5ndGgpO1xuICAgICAgICBkZWR1Y3Rpb25zICs9IHBlbmFsdHk7XG4gICAgICAgIG5vdGVzLnB1c2goXCJSZXBlYXRlZCBhZGphY2VudCB3b3JkcyBkZXRlY3RlZC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYFJlcGVhdGVkIHdvcmQ6ICR7cmVwZWF0ZWRbMF19YCk7XG4gICAgfVxuICAgIGlmICgvICArLy50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMTtcbiAgICAgICAgbm90ZXMucHVzaChcIk11bHRpcGxlIHNwYWNlcyBiZXR3ZWVuIHdvcmRzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIk11bHRpcGxlIHNwYWNlcyBmb3VuZC5cIik7XG4gICAgfVxuICAgIGNvbnN0IGxvd2VyY2FzZVN0YXJ0cyA9IGhpZ2hsaWdodHMuZmlsdGVyKChoaWdobGlnaHQpID0+IC9eW2Etel0vLnRlc3QoaGlnaGxpZ2h0LnRyaW0oKSkpO1xuICAgIGlmIChsb3dlcmNhc2VTdGFydHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5taW4oMywgbG93ZXJjYXNlU3RhcnRzLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlNvbWUgaGlnaGxpZ2h0cyBzdGFydCB3aXRoIGxvd2VyY2FzZSBsZXR0ZXJzLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgTG93ZXJjYXNlIHN0YXJ0OiAke2xvd2VyY2FzZVN0YXJ0c1swXX1gKTtcbiAgICB9XG4gICAgY29uc3QgZnJhZ21lbnRzID0gaGlnaGxpZ2h0cy5maWx0ZXIoKGhpZ2hsaWdodCkgPT4gaGlnaGxpZ2h0Lmxlbmd0aCA+IDQwICYmICFoYXNWZXJiTGlrZVRva2VuKGhpZ2hsaWdodCkpO1xuICAgIGlmIChmcmFnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5taW4oMiwgZnJhZ21lbnRzLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlNvbWUgbG9uZyBoaWdobGlnaHRzIG1heSByZWFkIGxpa2Ugc2VudGVuY2UgZnJhZ21lbnRzLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgUG9zc2libGUgZnJhZ21lbnQ6ICR7ZnJhZ21lbnRzWzBdfWApO1xuICAgIH1cbiAgICBjb25zdCBwdW5jdHVhdGlvbkVuZGluZ3MgPSBoaWdobGlnaHRzLmZpbHRlcigoaGlnaGxpZ2h0KSA9PiAvXFwuJC8udGVzdChoaWdobGlnaHQudHJpbSgpKSkubGVuZ3RoO1xuICAgIGlmIChoaWdobGlnaHRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgcmF0ZSA9IHB1bmN0dWF0aW9uRW5kaW5ncyAvIGhpZ2hsaWdodHMubGVuZ3RoO1xuICAgICAgICBpZiAocmF0ZSA+IDAuMyAmJiByYXRlIDwgMC43KSB7XG4gICAgICAgICAgICBkZWR1Y3Rpb25zICs9IDE7XG4gICAgICAgICAgICBub3Rlcy5wdXNoKFwiVHJhaWxpbmcgcHVuY3R1YXRpb24gaXMgaW5jb25zaXN0ZW50IGFjcm9zcyBoaWdobGlnaHRzLlwiKTtcbiAgICAgICAgICAgIGV2aWRlbmNlLnB1c2goYCR7cHVuY3R1YXRpb25FbmRpbmdzfS8ke2hpZ2hsaWdodHMubGVuZ3RofSBoaWdobGlnaHRzIGVuZCB3aXRoIHBlcmlvZHMuYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYWxsQ2FwcyA9IEFycmF5LmZyb20odGV4dC5tYXRjaEFsbCgvXFxiW0EtWl17NCx9XFxiL2cpLCAobWF0Y2gpID0+IG1hdGNoWzBdKS5maWx0ZXIoKHdvcmQpID0+ICFBQ1JPTllNUy5oYXMod29yZCkpO1xuICAgIGlmIChhbGxDYXBzLmxlbmd0aCA+IDUpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAxO1xuICAgICAgICBub3Rlcy5wdXNoKFwiRXhjZXNzaXZlIGFsbC1jYXBzIHdvcmRzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgQWxsLWNhcHMgd29yZHM6ICR7YWxsQ2Fwcy5zbGljZSgwLCAzKS5qb2luKFwiLCBcIil9YCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJzcGVsbGluZ0dyYW1tYXJcIixcbiAgICAgICAgbGFiZWw6IFwiU3BlbGxpbmcgYW5kIGdyYW1tYXJcIixcbiAgICAgICAgZWFybmVkOiBNYXRoLm1heCgwLCBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zcGVsbGluZ0dyYW1tYXIgLSBkZWR1Y3Rpb25zKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zcGVsbGluZ0dyYW1tYXIsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogZXZpZGVuY2UubGVuZ3RoID4gMCA/IGV2aWRlbmNlIDogW1wiTm8gaGV1cmlzdGljIGlzc3VlcyBkZXRlY3RlZC5cIl0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IG5vd0lzbyB9IGZyb20gXCIuLi9mb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBzY29yZUFjdGlvblZlcmJzIH0gZnJvbSBcIi4vYWN0aW9uLXZlcmJzXCI7XG5pbXBvcnQgeyBzY29yZUF0c0ZyaWVuZGxpbmVzcyB9IGZyb20gXCIuL2F0cy1mcmllbmRsaW5lc3NcIjtcbmltcG9ydCB7IHNjb3JlS2V5d29yZE1hdGNoIH0gZnJvbSBcIi4va2V5d29yZC1tYXRjaFwiO1xuaW1wb3J0IHsgc2NvcmVMZW5ndGggfSBmcm9tIFwiLi9sZW5ndGhcIjtcbmltcG9ydCB7IHNjb3JlUXVhbnRpZmllZEFjaGlldmVtZW50cyB9IGZyb20gXCIuL3F1YW50aWZpZWQtYWNoaWV2ZW1lbnRzXCI7XG5pbXBvcnQgeyBzY29yZVNlY3Rpb25Db21wbGV0ZW5lc3MgfSBmcm9tIFwiLi9zZWN0aW9uLWNvbXBsZXRlbmVzc1wiO1xuaW1wb3J0IHsgc2NvcmVTcGVsbGluZ0dyYW1tYXIgfSBmcm9tIFwiLi9zcGVsbGluZy1ncmFtbWFyXCI7XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVSZXN1bWUoaW5wdXQpIHtcbiAgICBjb25zdCBzdWJTY29yZXMgPSB7XG4gICAgICAgIHNlY3Rpb25Db21wbGV0ZW5lc3M6IHNjb3JlU2VjdGlvbkNvbXBsZXRlbmVzcyhpbnB1dCksXG4gICAgICAgIGFjdGlvblZlcmJzOiBzY29yZUFjdGlvblZlcmJzKGlucHV0KSxcbiAgICAgICAgcXVhbnRpZmllZEFjaGlldmVtZW50czogc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzKGlucHV0KSxcbiAgICAgICAga2V5d29yZE1hdGNoOiBzY29yZUtleXdvcmRNYXRjaChpbnB1dCksXG4gICAgICAgIGxlbmd0aDogc2NvcmVMZW5ndGgoaW5wdXQpLFxuICAgICAgICBzcGVsbGluZ0dyYW1tYXI6IHNjb3JlU3BlbGxpbmdHcmFtbWFyKGlucHV0KSxcbiAgICAgICAgYXRzRnJpZW5kbGluZXNzOiBzY29yZUF0c0ZyaWVuZGxpbmVzcyhpbnB1dCksXG4gICAgfTtcbiAgICBjb25zdCBvdmVyYWxsID0gT2JqZWN0LnZhbHVlcyhzdWJTY29yZXMpLnJlZHVjZSgoc3VtLCBzdWJTY29yZSkgPT4gc3VtICsgc3ViU2NvcmUuZWFybmVkLCAwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBvdmVyYWxsOiBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIE1hdGgucm91bmQob3ZlcmFsbCkpKSxcbiAgICAgICAgc3ViU2NvcmVzLFxuICAgICAgICBnZW5lcmF0ZWRBdDogbm93SXNvKCksXG4gICAgfTtcbn1cbmV4cG9ydCB7IHNjb3JlQWN0aW9uVmVyYnMgfSBmcm9tIFwiLi9hY3Rpb24tdmVyYnNcIjtcbmV4cG9ydCB7IHNjb3JlQXRzRnJpZW5kbGluZXNzIH0gZnJvbSBcIi4vYXRzLWZyaWVuZGxpbmVzc1wiO1xuZXhwb3J0IHsgc2NvcmVLZXl3b3JkTWF0Y2ggfSBmcm9tIFwiLi9rZXl3b3JkLW1hdGNoXCI7XG5leHBvcnQgeyBzY29yZUxlbmd0aCB9IGZyb20gXCIuL2xlbmd0aFwiO1xuZXhwb3J0IHsgc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzIH0gZnJvbSBcIi4vcXVhbnRpZmllZC1hY2hpZXZlbWVudHNcIjtcbmV4cG9ydCB7IHNjb3JlU2VjdGlvbkNvbXBsZXRlbmVzcyB9IGZyb20gXCIuL3NlY3Rpb24tY29tcGxldGVuZXNzXCI7XG5leHBvcnQgeyBzY29yZVNwZWxsaW5nR3JhbW1hciB9IGZyb20gXCIuL3NwZWxsaW5nLWdyYW1tYXJcIjtcbiIsImltcG9ydCB7IHNjb3JlUmVzdW1lIH0gZnJvbSBcIkBzbG90aGluZy9zaGFyZWQvc2NvcmluZ1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHNjcmFwZWRKb2JUb0pvYkRlc2NyaXB0aW9uKGpvYiwgY3JlYXRlZEF0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGpvYi5zb3VyY2VKb2JJZCB8fCBqb2IudXJsLFxuICAgICAgICB0aXRsZTogam9iLnRpdGxlLFxuICAgICAgICBjb21wYW55OiBqb2IuY29tcGFueSxcbiAgICAgICAgbG9jYXRpb246IGpvYi5sb2NhdGlvbixcbiAgICAgICAgdHlwZTogam9iLnR5cGUsXG4gICAgICAgIHJlbW90ZTogam9iLnJlbW90ZSxcbiAgICAgICAgc2FsYXJ5OiBqb2Iuc2FsYXJ5LFxuICAgICAgICBkZXNjcmlwdGlvbjogam9iLmRlc2NyaXB0aW9uLFxuICAgICAgICByZXF1aXJlbWVudHM6IGpvYi5yZXF1aXJlbWVudHMgfHwgW10sXG4gICAgICAgIHJlc3BvbnNpYmlsaXRpZXM6IGpvYi5yZXNwb25zaWJpbGl0aWVzIHx8IFtdLFxuICAgICAgICBrZXl3b3Jkczogam9iLmtleXdvcmRzIHx8IFtdLFxuICAgICAgICB1cmw6IGpvYi51cmwsXG4gICAgICAgIGRlYWRsaW5lOiBqb2IuZGVhZGxpbmUsXG4gICAgICAgIGNyZWF0ZWRBdCxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVKb2JNYXRjaFNjb3JlKHByb2ZpbGUsIGpvYikge1xuICAgIGlmICghcHJvZmlsZSB8fCAham9iKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gc2NvcmVSZXN1bWUoe1xuICAgICAgICBwcm9maWxlLFxuICAgICAgICByYXdUZXh0OiBwcm9maWxlLnJhd1RleHQsXG4gICAgICAgIGpvYjogc2NyYXBlZEpvYlRvSm9iRGVzY3JpcHRpb24oam9iKSxcbiAgICB9KTtcbn1cbiIsImNvbnN0IERJU01JU1NFRF9ET01BSU5TX0tFWSA9IFwic2xvdGhpbmc6c2lkZWJhcjpkaXNtaXNzZWREb21haW5zXCI7XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplU2lkZWJhckRvbWFpbihob3N0bmFtZSkge1xuICAgIHJldHVybiBob3N0bmFtZVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC9ed3d3XFwuLywgXCJcIik7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGlzbWlzc2VkU2lkZWJhckRvbWFpbnMoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChESVNNSVNTRURfRE9NQUlOU19LRVksIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdWx0W0RJU01JU1NFRF9ET01BSU5TX0tFWV07XG4gICAgICAgICAgICByZXNvbHZlKEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUuZmlsdGVyKGlzU3RyaW5nKSA6IFtdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNTaWRlYmFyRGlzbWlzc2VkRm9yRG9tYWluKGhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSB7XG4gICAgY29uc3QgZG9tYWluID0gbm9ybWFsaXplU2lkZWJhckRvbWFpbihob3N0bmFtZSk7XG4gICAgY29uc3QgZGlzbWlzc2VkRG9tYWlucyA9IGF3YWl0IGdldERpc21pc3NlZFNpZGViYXJEb21haW5zKCk7XG4gICAgcmV0dXJuIGRpc21pc3NlZERvbWFpbnMuaW5jbHVkZXMoZG9tYWluKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXNtaXNzU2lkZWJhckZvckRvbWFpbihob3N0bmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkge1xuICAgIGNvbnN0IGRvbWFpbiA9IG5vcm1hbGl6ZVNpZGViYXJEb21haW4oaG9zdG5hbWUpO1xuICAgIGNvbnN0IGRpc21pc3NlZERvbWFpbnMgPSBhd2FpdCBnZXREaXNtaXNzZWRTaWRlYmFyRG9tYWlucygpO1xuICAgIGNvbnN0IG5leHQgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLmRpc21pc3NlZERvbWFpbnMsIGRvbWFpbl0pKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW0RJU01JU1NFRF9ET01BSU5TX0tFWV06IG5leHQgfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCI7XG59XG4iLCJleHBvcnQgY29uc3QgU0lERUJBUl9TVFlMRVMgPSBgXG46aG9zdCB7XG4gIGFsbDogaW5pdGlhbDtcbiAgY29sb3Itc2NoZW1lOiBsaWdodDtcbiAgZm9udC1mYW1pbHk6IEludGVyLCB1aS1zYW5zLXNlcmlmLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xufVxuXG4qLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLnNsb3RoaW5nLXNpZGViYXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogOTZweDtcbiAgcmlnaHQ6IDA7XG4gIHotaW5kZXg6IDIxNDc0ODMwMDA7XG4gIGNvbG9yOiAjMTcyMDI2O1xuICBmb250LWZhbWlseTogaW5oZXJpdDtcbn1cblxuLnNsb3RoaW5nLXNpZGViYXJbaGlkZGVuXSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5yYWlsLFxuLnBhbmVsIHtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMywgMzIsIDM4LCAwLjE0KTtcbiAgYm94LXNoYWRvdzogMCAxNnB4IDQycHggcmdiYSgyMywgMzIsIDM4LCAwLjIyKTtcbn1cblxuLnJhaWwge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDhweDtcbiAgd2lkdGg6IDQ2cHg7XG4gIG1pbi1oZWlnaHQ6IDE0OHB4O1xuICBwYWRkaW5nOiAxMHB4IDdweDtcbiAgYm9yZGVyLXJpZ2h0OiAwO1xuICBib3JkZXItcmFkaXVzOiA4cHggMCAwIDhweDtcbiAgYmFja2dyb3VuZDogI2ZmZmZmZjtcbiAgd3JpdGluZy1tb2RlOiB2ZXJ0aWNhbC1ybDtcbiAgdGV4dC1vcmllbnRhdGlvbjogbWl4ZWQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnJhaWwtc2NvcmUge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1pbi13aWR0aDogMzBweDtcbiAgbWluLWhlaWdodDogMzBweDtcbiAgYm9yZGVyLXJhZGl1czogOTk5cHg7XG4gIGJhY2tncm91bmQ6ICNkZmY2ZTk7XG4gIGNvbG9yOiAjMTM1ZDNiO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIHdyaXRpbmctbW9kZTogaG9yaXpvbnRhbC10Yjtcbn1cblxuLnJhaWwtbGFiZWwge1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xufVxuXG4ucGFuZWwge1xuICB3aWR0aDogbWluKDM2MHB4LCBjYWxjKDEwMHZ3IC0gMjhweCkpO1xuICBtYXgtaGVpZ2h0OiBtaW4oNzIwcHgsIGNhbGMoMTAwdmggLSAxMjhweCkpO1xuICBvdmVyZmxvdzogYXV0bztcbiAgYm9yZGVyLXJpZ2h0OiAwO1xuICBib3JkZXItcmFkaXVzOiA4cHggMCAwIDhweDtcbiAgYmFja2dyb3VuZDogI2ZiZmNmYjtcbn1cblxuLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGdhcDogMTJweDtcbiAgcGFkZGluZzogMTZweCAxNnB4IDEycHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDIzLCAzMiwgMzgsIDAuMSk7XG4gIGJhY2tncm91bmQ6ICNmZmZmZmY7XG59XG5cbi5icmFuZCB7XG4gIG1hcmdpbjogMCAwIDhweDtcbiAgY29sb3I6ICMxZjZmNDY7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG5cbi50aXRsZSB7XG4gIG1hcmdpbjogMDtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBsaW5lLWhlaWdodDogMS4yNTtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG59XG5cbi5jb21wYW55IHtcbiAgbWFyZ2luOiA0cHggMCAwO1xuICBjb2xvcjogIzUzNjA2ODtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBsaW5lLWhlaWdodDogMS4zNTtcbiAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG59XG5cbi5pY29uLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogNnB4O1xufVxuXG5idXR0b24ge1xuICBib3JkZXI6IDA7XG4gIGZvbnQ6IGluaGVyaXQ7XG59XG5cbmJ1dHRvbjpmb2N1cy12aXNpYmxlLFxuaW5wdXQ6Zm9jdXMtdmlzaWJsZSB7XG4gIG91dGxpbmU6IDJweCBzb2xpZCAjMmY4ZjViO1xuICBvdXRsaW5lLW9mZnNldDogMnB4O1xufVxuXG4uaWNvbi1idXR0b24ge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHdpZHRoOiAzMHB4O1xuICBoZWlnaHQ6IDMwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgYmFja2dyb3VuZDogI2VlZjNmMDtcbiAgY29sb3I6ICMyNDMwMzg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmljb24tYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogI2RkZThlMTtcbn1cblxuLmJvZHkge1xuICBkaXNwbGF5OiBncmlkO1xuICBnYXA6IDEycHg7XG4gIHBhZGRpbmc6IDE0cHggMTZweCAxNnB4O1xufVxuXG4uc2NvcmUtY2FyZCxcbi5hY3Rpb25zLFxuLmFuc3dlci1iYW5rLFxuLnN0YXR1cy1jYXJkIHtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMywgMzIsIDM4LCAwLjEpO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGJhY2tncm91bmQ6ICNmZmZmZmY7XG59XG5cbi5zY29yZS1jYXJkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA4NHB4IDFmcjtcbiAgZ2FwOiAxMnB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAxMnB4O1xufVxuXG4uc2NvcmUtbnVtYmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHdpZHRoOiA3MnB4O1xuICBoZWlnaHQ6IDcycHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZDogY29uaWMtZ3JhZGllbnQoIzJmOGY1YiB2YXIoLS1zY29yZS1kZWcpLCAjZTdlY2U5IDApO1xufVxuXG4uc2NvcmUtbnVtYmVyIHNwYW4ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgd2lkdGg6IDU2cHg7XG4gIGhlaWdodDogNTZweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICBjb2xvcjogIzEzNWQzYjtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBmb250LXdlaWdodDogOTAwO1xufVxuXG4uc2NvcmUtbGFiZWwge1xuICBtYXJnaW46IDA7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cblxuLnNjb3JlLW5vdGUsXG4ubXV0ZWQsXG4ucmVzdWx0LW1ldGEge1xuICBjb2xvcjogIzYzNzE3YTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBsaW5lLWhlaWdodDogMS40O1xufVxuXG4uYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdhcDogOHB4O1xuICBwYWRkaW5nOiAxMHB4O1xufVxuXG4uYWN0aW9uLWJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi1oZWlnaHQ6IDQwcHg7XG4gIHBhZGRpbmc6IDlweCAxMXB4O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGJhY2tncm91bmQ6ICNlZWYzZjA7XG4gIGNvbG9yOiAjMTcyMDI2O1xuICBmb250LXdlaWdodDogNzUwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5hY3Rpb24tYnV0dG9uLnByaW1hcnkge1xuICBiYWNrZ3JvdW5kOiAjMWY2ZjQ2O1xuICBjb2xvcjogI2ZmZmZmZjtcbn1cblxuLmFjdGlvbi1idXR0b246aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICBmaWx0ZXI6IGJyaWdodG5lc3MoMC45Nik7XG59XG5cbi5hY3Rpb24tYnV0dG9uOmRpc2FibGVkIHtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgb3BhY2l0eTogMC42Mjtcbn1cblxuLnN0YXR1cy1jYXJkIHtcbiAgcGFkZGluZzogMTBweCAxMnB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XG59XG5cbi5zdGF0dXMtY2FyZC5zdWNjZXNzIHtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDMxLCAxMTEsIDcwLCAwLjMpO1xuICBjb2xvcjogIzEzNWQzYjtcbiAgYmFja2dyb3VuZDogI2VlZmFmMztcbn1cblxuLnN0YXR1cy1jYXJkLmVycm9yIHtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3NiwgNTIsIDUyLCAwLjMpO1xuICBjb2xvcjogIzhmMjQyNDtcbiAgYmFja2dyb3VuZDogI2ZmZjJmMjtcbn1cblxuLmFuc3dlci1iYW5rIHtcbiAgcGFkZGluZzogMTJweDtcbn1cblxuLnNlY3Rpb24tdGl0bGUge1xuICBtYXJnaW46IDAgMCA4cHg7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IDg1MDtcbn1cblxuLnNlYXJjaC1yb3cge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciBhdXRvO1xuICBnYXA6IDhweDtcbn1cblxuLnNlYXJjaC1yb3cgaW5wdXQge1xuICB3aWR0aDogMTAwJTtcbiAgbWluLXdpZHRoOiAwO1xuICBoZWlnaHQ6IDM0cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjMsIDMyLCAzOCwgMC4xNik7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgcGFkZGluZzogMCAxMHB4O1xuICBjb2xvcjogIzE3MjAyNjtcbiAgZm9udDogaW5oZXJpdDtcbiAgZm9udC1zaXplOiAxM3B4O1xufVxuXG4uc2VhcmNoLXJvdyBidXR0b24sXG4uc21hbGwtYnV0dG9uIHtcbiAgbWluLWhlaWdodDogMzRweDtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBwYWRkaW5nOiAwIDEwcHg7XG4gIGJhY2tncm91bmQ6ICMyNDMwMzg7XG4gIGNvbG9yOiAjZmZmZmZmO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5yZXN1bHRzIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ2FwOiA4cHg7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG59XG5cbi5yZXN1bHQge1xuICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiYSgyMywgMzIsIDM4LCAwLjEpO1xuICBwYWRkaW5nLXRvcDogOHB4O1xufVxuXG4ucmVzdWx0LXF1ZXN0aW9uLFxuLnJlc3VsdC1hbnN3ZXIge1xuICBtYXJnaW46IDA7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGluZS1oZWlnaHQ6IDEuNDtcbn1cblxuLnJlc3VsdC1xdWVzdGlvbiB7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbi5yZXN1bHQtYW5zd2VyIHtcbiAgbWFyZ2luLXRvcDogNHB4O1xuICBjb2xvcjogIzM4NDU0ZDtcbn1cblxuLnJlc3VsdC1hY3Rpb25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiA2cHg7XG4gIG1hcmdpbi10b3A6IDhweDtcbn1cblxuLnNtYWxsLWJ1dHRvbiB7XG4gIG1pbi1oZWlnaHQ6IDI4cHg7XG4gIHBhZGRpbmc6IDAgOHB4O1xuICBmb250LXNpemU6IDEycHg7XG59XG5cbi5zbWFsbC1idXR0b24uc2Vjb25kYXJ5IHtcbiAgYmFja2dyb3VuZDogI2VlZjNmMDtcbiAgY29sb3I6ICMyNDMwMzg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMDIzcHgpIHtcbiAgLnNsb3RoaW5nLXNpZGViYXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cbmA7XG4iLCJpbXBvcnQgeyBqc3ggYXMgX2pzeCB9IGZyb20gXCJyZWFjdC9qc3gtcnVudGltZVwiO1xuaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gXCJyZWFjdC1kb20vY2xpZW50XCI7XG5pbXBvcnQgeyBKb2JQYWdlU2lkZWJhciB9IGZyb20gXCIuL2pvYi1wYWdlLXNpZGViYXJcIjtcbmltcG9ydCB7IGNvbXB1dGVKb2JNYXRjaFNjb3JlIH0gZnJvbSBcIi4vc2NvcmluZ1wiO1xuaW1wb3J0IHsgZGlzbWlzc1NpZGViYXJGb3JEb21haW4sIGlzU2lkZWJhckRpc21pc3NlZEZvckRvbWFpbiwgbm9ybWFsaXplU2lkZWJhckRvbWFpbiwgfSBmcm9tIFwiLi9zdG9yYWdlXCI7XG5pbXBvcnQgeyBTSURFQkFSX1NUWUxFUyB9IGZyb20gXCIuL3N0eWxlc1wiO1xuY29uc3QgSE9TVF9JRCA9IFwic2xvdGhpbmctam9iLXBhZ2Utc2lkZWJhci1ob3N0XCI7XG5jb25zdCBERVNLVE9QX01JTl9XSURUSCA9IDEwMjQ7XG5leHBvcnQgY2xhc3MgSm9iUGFnZVNpZGViYXJDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzbWlzc2VkRG9tYWluID0gbnVsbDtcbiAgICAgICAgdGhpcy5oYW5kbGVSZXNpemUgPSAoKSA9PiB0aGlzLnJlbmRlcigpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgfVxuICAgIGFzeW5jIHVwZGF0ZShuZXh0KSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXh0O1xuICAgICAgICB0aGlzLmRpc21pc3NlZERvbWFpbiA9IChhd2FpdCBpc1NpZGViYXJEaXNtaXNzZWRGb3JEb21haW4oKSlcbiAgICAgICAgICAgID8gbm9ybWFsaXplU2lkZWJhckRvbWFpbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIHNob3dDb2xsYXBzZWQoKSB7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gICAgYXN5bmMgZGlzbWlzc0RvbWFpbigpIHtcbiAgICAgICAgYXdhaXQgZGlzbWlzc1NpZGViYXJGb3JEb21haW4oKTtcbiAgICAgICAgdGhpcy5kaXNtaXNzZWREb21haW4gPSBub3JtYWxpemVTaWRlYmFyRG9tYWluKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSk7XG4gICAgICAgIHRoaXMudW5tb3VudCgpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgIHRoaXMudW5tb3VudCgpO1xuICAgICAgICB0aGlzLnN0YXRlID0gbnVsbDtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGU/LnNjcmFwZWRKb2IgfHxcbiAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIDwgREVTS1RPUF9NSU5fV0lEVEggfHxcbiAgICAgICAgICAgIHRoaXMuZGlzbWlzc2VkRG9tYWluID09PSBub3JtYWxpemVTaWRlYmFyRG9tYWluKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMudW5tb3VudCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLmVuc3VyZVJvb3QoKTtcbiAgICAgICAgY29uc3Qgc2NvcmUgPSBjb21wdXRlSm9iTWF0Y2hTY29yZSh0aGlzLnN0YXRlLnByb2ZpbGUsIHRoaXMuc3RhdGUuc2NyYXBlZEpvYik7XG4gICAgICAgIHJvb3QucmVuZGVyKF9qc3goSm9iUGFnZVNpZGViYXIsIHsgc2NyYXBlZEpvYjogdGhpcy5zdGF0ZS5zY3JhcGVkSm9iLCBkZXRlY3RlZEZpZWxkQ291bnQ6IHRoaXMuc3RhdGUuZGV0ZWN0ZWRGaWVsZENvdW50LCBzY29yZTogc2NvcmUsIGlzQ29sbGFwc2VkOiB0aGlzLmNvbGxhcHNlZCwgb25Db2xsYXBzZUNoYW5nZTogKGNvbGxhcHNlZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGFwc2VkID0gY29sbGFwc2VkO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB9LCBvbkRpc21pc3M6ICgpID0+IHRoaXMuZGlzbWlzc0RvbWFpbigpLCBvblRhaWxvcjogdGhpcy5zdGF0ZS5vblRhaWxvciwgb25Db3ZlckxldHRlcjogdGhpcy5zdGF0ZS5vbkNvdmVyTGV0dGVyLCBvblNhdmU6IHRoaXMuc3RhdGUub25TYXZlLCBvbkF1dG9GaWxsOiB0aGlzLnN0YXRlLm9uQXV0b0ZpbGwsIG9uU2VhcmNoQW5zd2VyczogdGhpcy5zdGF0ZS5vblNlYXJjaEFuc3dlcnMsIG9uQXBwbHlBbnN3ZXI6IHRoaXMuc3RhdGUub25BcHBseUFuc3dlciB9KSk7XG4gICAgfVxuICAgIGVuc3VyZVJvb3QoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3QpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb290O1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEhPU1RfSUQpO1xuICAgICAgICB0aGlzLmhvc3QgPSBleGlzdGluZyB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmhvc3QuaWQgPSBIT1NUX0lEO1xuICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ob3N0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzaGFkb3dSb290ID0gdGhpcy5ob3N0LnNoYWRvd1Jvb3QgfHwgdGhpcy5ob3N0LmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xuICAgICAgICBpZiAoIXNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcihcInN0eWxlXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gU0lERUJBUl9TVFlMRVM7XG4gICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbW91bnQgPSBzaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1zaWRlYmFyLXJvb3RdXCIpO1xuICAgICAgICBpZiAoIW1vdW50KSB7XG4gICAgICAgICAgICBtb3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBtb3VudC5kYXRhc2V0LnNpZGViYXJSb290ID0gXCJ0cnVlXCI7XG4gICAgICAgICAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKG1vdW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QgPSBjcmVhdGVSb290KG1vdW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgICB9XG4gICAgdW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5yb290Py51bm1vdW50KCk7XG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMuaG9zdD8ucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuaG9zdCA9IG51bGw7XG4gICAgfVxufVxuIiwiLy8gQ29udGVudCBzY3JpcHQgZW50cnkgcG9pbnQgZm9yIENvbHVtYnVzIGV4dGVuc2lvblxuLy8gSW1wb3J0IHN0eWxlcyBmb3IgY29udGVudCBzY3JpcHRcbmltcG9ydCBcIi4vdWkvc3R5bGVzLmNzc1wiO1xuaW1wb3J0IHsgRmllbGREZXRlY3RvciB9IGZyb20gXCIuL2F1dG8tZmlsbC9maWVsZC1kZXRlY3RvclwiO1xuaW1wb3J0IHsgRmllbGRNYXBwZXIgfSBmcm9tIFwiLi9hdXRvLWZpbGwvZmllbGQtbWFwcGVyXCI7XG5pbXBvcnQgeyBBdXRvRmlsbEVuZ2luZSB9IGZyb20gXCIuL2F1dG8tZmlsbC9lbmdpbmVcIjtcbmltcG9ydCB7IGdldFNjcmFwZXJGb3JVcmwgfSBmcm9tIFwiLi9zY3JhcGVycy9zY3JhcGVyLXJlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBXYXRlcmxvb1dvcmtzT3JjaGVzdHJhdG9yIH0gZnJvbSBcIi4vc2NyYXBlcnMvd2F0ZXJsb28td29ya3Mtb3JjaGVzdHJhdG9yXCI7XG5pbXBvcnQgeyBzZW5kTWVzc2FnZSwgTWVzc2FnZXMgfSBmcm9tIFwiQC9zaGFyZWQvbWVzc2FnZXNcIjtcbmltcG9ydCB7IHNob3dBcHBsaWVkVG9hc3QgfSBmcm9tIFwiLi90cmFja2luZy9hcHBsaWVkLXRvYXN0XCI7XG5pbXBvcnQgeyBTdWJtaXRXYXRjaGVyLCBleHRyYWN0Q29tcGFueUhpbnQgfSBmcm9tIFwiLi90cmFja2luZy9zdWJtaXQtd2F0Y2hlclwiO1xuaW1wb3J0IHsgSm9iUGFnZVNpZGViYXJDb250cm9sbGVyIH0gZnJvbSBcIi4vc2lkZWJhci9jb250cm9sbGVyXCI7XG4vLyBJbml0aWFsaXplIGNvbXBvbmVudHNcbmNvbnN0IGZpZWxkRGV0ZWN0b3IgPSBuZXcgRmllbGREZXRlY3RvcigpO1xubGV0IGF1dG9GaWxsRW5naW5lID0gbnVsbDtcbmxldCBjYWNoZWRQcm9maWxlID0gbnVsbDtcbmxldCBkZXRlY3RlZEZpZWxkcyA9IFtdO1xuY29uc3QgZGV0ZWN0ZWRGaWVsZHNCeUZvcm0gPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgYXV0b2ZpbGxlZEZvcm1zID0gbmV3IFdlYWtTZXQoKTtcbmxldCBzY3JhcGVkSm9iID0gbnVsbDtcbmxldCBqb2JEZXRlY3RlZEZvclVybCA9IG51bGw7XG5sZXQgcHJvZmlsZUxvYWRQcm9taXNlID0gbnVsbDtcbmNvbnN0IHNpZGViYXJDb250cm9sbGVyID0gbmV3IEpvYlBhZ2VTaWRlYmFyQ29udHJvbGxlcigpO1xuY29uc3Qgc3VibWl0V2F0Y2hlciA9IG5ldyBTdWJtaXRXYXRjaGVyKHtcbiAgICBnZXREZXRlY3RlZEZpZWxkczogKGZvcm0pID0+IGRldGVjdGVkRmllbGRzQnlGb3JtLmdldChmb3JtKSB8fCBbXSxcbiAgICBnZXRTY3JhcGVkSm9iOiAoKSA9PiBzY3JhcGVkSm9iLFxuICAgIGdldFNldHRpbmdzOiBnZXRFeHRlbnNpb25TZXR0aW5ncyxcbiAgICB3YXNBdXRvZmlsbGVkOiAoZm9ybSkgPT4gYXV0b2ZpbGxlZEZvcm1zLmhhcyhmb3JtKSxcbiAgICBvblRyYWNrZWQ6IGFzeW5jIChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMudHJhY2tBcHBsaWVkKHBheWxvYWQpKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW0NvbHVtYnVzXSBGYWlsZWQgdG8gdHJhY2sgYXBwbGljYXRpb246XCIsIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzaG93QXBwbGllZFRvYXN0KGV4dHJhY3RDb21wYW55SGludChzY3JhcGVkSm9iLCBwYXlsb2FkLmhvc3QpLCAoKSA9PiB7XG4gICAgICAgICAgICBzZW5kTWVzc2FnZShNZXNzYWdlcy5vcGVuRGFzaGJvYXJkKCkpLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoXCJbQ29sdW1idXNdIEZhaWxlZCB0byBvcGVuIGRhc2hib2FyZDpcIiwgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcbi8vIFNjYW4gcGFnZSBvbiBsb2FkXG5zY2FuUGFnZSgpO1xuc3VibWl0V2F0Y2hlci5hdHRhY2goKTtcbi8vIFJlLXNjYW4gb24gZHluYW1pYyBjb250ZW50IGNoYW5nZXNcbmNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZGVib3VuY2Uoc2NhblBhZ2UsIDUwMCkpO1xub2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbmFzeW5jIGZ1bmN0aW9uIHNjYW5QYWdlKCkge1xuICAgIC8vIERldGVjdCBmb3Jtc1xuICAgIGNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImZvcm1cIik7XG4gICAgZm9yIChjb25zdCBmb3JtIG9mIGZvcm1zKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGZpZWxkRGV0ZWN0b3IuZGV0ZWN0RmllbGRzKGZvcm0pO1xuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRldGVjdGVkRmllbGRzQnlGb3JtLnNldChmb3JtLCBmaWVsZHMpO1xuICAgICAgICAgICAgZGV0ZWN0ZWRGaWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gRGV0ZWN0ZWQgZmllbGRzOlwiLCBmaWVsZHMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBDaGVjayBmb3Igam9iIGxpc3RpbmdcbiAgICBjb25zdCBzY3JhcGVyID0gZ2V0U2NyYXBlckZvclVybCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgbGV0IG5leHRTY3JhcGVkSm9iID0gbnVsbDtcbiAgICBpZiAoc2NyYXBlci5jYW5IYW5kbGUod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBuZXh0U2NyYXBlZEpvYiA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlSm9iTGlzdGluZygpO1xuICAgICAgICAgICAgc2NyYXBlZEpvYiA9IG5leHRTY3JhcGVkSm9iO1xuICAgICAgICAgICAgaWYgKG5leHRTY3JhcGVkSm9iKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ29sdW1idXNdIFNjcmFwZWQgam9iOlwiLCBuZXh0U2NyYXBlZEpvYi50aXRsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGpvYkRldGVjdGVkRm9yVXJsICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZikge1xuICAgICAgICAgICAgICAgICAgICBqb2JEZXRlY3RlZEZvclVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICAgICAgICAgICAgICBzZW5kTWVzc2FnZShNZXNzYWdlcy5qb2JEZXRlY3RlZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbmV4dFNjcmFwZWRKb2IudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55OiBuZXh0U2NyYXBlZEpvYi5jb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBuZXh0U2NyYXBlZEpvYi51cmwsXG4gICAgICAgICAgICAgICAgICAgIH0pKS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKFwiW0NvbHVtYnVzXSBGYWlsZWQgdG8gbm90aWZ5IGpvYiBkZXRlY3RlZDpcIiwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ29sdW1idXNdIFNjcmFwZSBlcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW5leHRTY3JhcGVkSm9iICYmIHNjcmFwZWRKb2I/LnVybCAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHtcbiAgICAgICAgc2NyYXBlZEpvYiA9IG51bGw7XG4gICAgfVxuICAgIHZvaWQgdXBkYXRlU2lkZWJhcigpO1xufVxuLy8gSGFuZGxlIG1lc3NhZ2VzIGZyb20gcG9wdXAgYW5kIGJhY2tncm91bmRcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBoYW5kbGVNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICAgIC50aGVuKHNlbmRSZXNwb25zZSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSkpO1xuICAgIHJldHVybiB0cnVlOyAvLyBBc3luYyByZXNwb25zZVxufSk7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIFwiR0VUX1BBR0VfU1RBVFVTXCI6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGhhc0Zvcm06IGRldGVjdGVkRmllbGRzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAgICAgaGFzSm9iTGlzdGluZzogc2NyYXBlZEpvYiAhPT0gbnVsbCxcbiAgICAgICAgICAgICAgICBkZXRlY3RlZEZpZWxkczogZGV0ZWN0ZWRGaWVsZHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHNjcmFwZWRKb2IsXG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFwiVFJJR0dFUl9GSUxMXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlRmlsbEZvcm0oKTtcbiAgICAgICAgY2FzZSBcIlRSSUdHRVJfSU1QT1JUXCI6XG4gICAgICAgICAgICBpZiAoc2NyYXBlZEpvYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZW5kTWVzc2FnZShNZXNzYWdlcy5pbXBvcnRKb2Ioc2NyYXBlZEpvYikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vIGpvYiBkZXRlY3RlZFwiIH07XG4gICAgICAgIGNhc2UgXCJTQ1JBUEVfSk9CXCI6XG4gICAgICAgICAgICBjb25zdCBzY3JhcGVyID0gZ2V0U2NyYXBlckZvclVybCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBpZiAoc2NyYXBlci5jYW5IYW5kbGUod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgICAgICAgICAgc2NyYXBlZEpvYiA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlSm9iTGlzdGluZygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHNjcmFwZWRKb2IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyBzY3JhcGVyIGF2YWlsYWJsZSBmb3IgdGhpcyBzaXRlXCIgfTtcbiAgICAgICAgY2FzZSBcIlNDUkFQRV9KT0JfTElTVFwiOlxuICAgICAgICAgICAgY29uc3QgbGlzdFNjcmFwZXIgPSBnZXRTY3JhcGVyRm9yVXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgICAgIGlmIChsaXN0U2NyYXBlci5jYW5IYW5kbGUod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9icyA9IGF3YWl0IGxpc3RTY3JhcGVyLnNjcmFwZUpvYkxpc3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBqb2JzIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gc2NyYXBlciBhdmFpbGFibGUgZm9yIHRoaXMgc2l0ZVwiIH07XG4gICAgICAgIGNhc2UgXCJXV19HRVRfUEFHRV9TVEFURVwiOlxuICAgICAgICAgICAgcmV0dXJuIGdldFd3UGFnZVN0YXRlKCk7XG4gICAgICAgIGNhc2UgXCJXV19TQ1JBUEVfQUxMX1ZJU0lCTEVcIjpcbiAgICAgICAgICAgIHJldHVybiBydW5Xd0J1bGtTY3JhcGUoeyBwYWdpbmF0ZWQ6IGZhbHNlIH0pO1xuICAgICAgICBjYXNlIFwiV1dfU0NSQVBFX0FMTF9QQUdJTkFURURcIjpcbiAgICAgICAgICAgIHJldHVybiBydW5Xd0J1bGtTY3JhcGUoe1xuICAgICAgICAgICAgICAgIHBhZ2luYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAuLi5tZXNzYWdlLnBheWxvYWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gbWVzc2FnZSB0eXBlOiAke21lc3NhZ2UudHlwZX1gIH07XG4gICAgfVxufVxuZnVuY3Rpb24gaXNXYXRlcmxvb1dvcmtzKCkge1xuICAgIHJldHVybiAvd2F0ZXJsb293b3Jrc1xcLnV3YXRlcmxvb1xcLmNhLy50ZXN0KHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbn1cbmZ1bmN0aW9uIGdldFd3UGFnZVN0YXRlKCkge1xuICAgIGlmICghaXNXYXRlcmxvb1dvcmtzKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICBkYXRhOiB7IGtpbmQ6IFwib3RoZXJcIiwgcm93Q291bnQ6IDAsIGhhc05leHRQYWdlOiBmYWxzZSB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCByb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRhYmxlLmRhdGEtdmlld2VyLXRhYmxlIHRib2R5IHRyLnRhYmxlX19yb3ctLWJvZHlcIik7XG4gICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2EucGFnaW5hdGlvbl9fbGlua1thcmlhLWxhYmVsPVwiR28gdG8gbmV4dCBwYWdlXCJdJyk7XG4gICAgY29uc3QgY3VycmVudFBhZ2UgPSBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcihcImEucGFnaW5hdGlvbl9fbGluay5hY3RpdmVcIilcbiAgICAgICAgPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgIGNvbnN0IGhhc0RldGFpbCA9ICEhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXNoYm9hcmQtaGVhZGVyX19wb3N0aW5nLXRpdGxlXCIpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtpbmQ6IGhhc0RldGFpbCA/IFwiZGV0YWlsXCIgOiByb3dzLmxlbmd0aCA+IDAgPyBcImxpc3RcIiA6IFwib3RoZXJcIixcbiAgICAgICAgICAgIHJvd0NvdW50OiByb3dzLmxlbmd0aCxcbiAgICAgICAgICAgIGhhc05leHRQYWdlOiAhIW5leHRCdG4gJiYgIW5leHRCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGlzYWJsZWRcIiksXG4gICAgICAgICAgICBjdXJyZW50UGFnZSxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gcnVuV3dCdWxrU2NyYXBlKG9wdHMpIHtcbiAgICBpZiAoIWlzV2F0ZXJsb29Xb3JrcygpKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYSBXYXRlcmxvb1dvcmtzIHBhZ2VcIiB9O1xuICAgIH1cbiAgICBjb25zdCBvcmNoZXN0cmF0b3IgPSBuZXcgV2F0ZXJsb29Xb3Jrc09yY2hlc3RyYXRvcigpO1xuICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICBsZXQgcGFnZXMgPSAxO1xuICAgIGNvbnN0IG9uUHJvZ3Jlc3MgPSAocCkgPT4ge1xuICAgICAgICBwYWdlcyA9IHAuY3VycmVudFBhZ2U7XG4gICAgICAgIGVycm9ycyA9IHAuZXJyb3JzO1xuICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQgcHJvZ3Jlc3MgZXZlbnQgdG8gdGhlIGJhY2tncm91bmQsIHdoaWNoIGNhbiBmYW4gaXQgb3V0XG4gICAgICAgIC8vIHRvIHRoZSBwb3B1cCBpZiBvcGVuLlxuICAgICAgICBzZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcIldXX0JVTEtfUFJPR1JFU1NcIixcbiAgICAgICAgICAgIHBheWxvYWQ6IHAsXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgfTtcbiAgICBjb25zdCBqb2JzID0gb3B0cy5wYWdpbmF0ZWRcbiAgICAgICAgPyBhd2FpdCBvcmNoZXN0cmF0b3Iuc2NyYXBlQWxsUGFnaW5hdGVkKHtcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MsXG4gICAgICAgICAgICBtYXhKb2JzOiBvcHRzLm1heEpvYnMsXG4gICAgICAgICAgICBtYXhQYWdlczogb3B0cy5tYXhQYWdlcyxcbiAgICAgICAgfSlcbiAgICAgICAgOiBhd2FpdCBvcmNoZXN0cmF0b3Iuc2NyYXBlQWxsVmlzaWJsZSh7IG9uUHJvZ3Jlc3MgfSk7XG4gICAgaWYgKGpvYnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogeyBpbXBvcnRlZDogMCwgYXR0ZW1wdGVkOiAwLCBwYWdlcywgZXJyb3JzIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEhhbmQgb2ZmIHRvIGJhY2tncm91bmQgdG8gYnVsay1pbXBvcnQgdG8gU2xvdGhpbmcuXG4gICAgY29uc3QgaW1wb3J0UmVzcCA9IGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLmltcG9ydEpvYnNCYXRjaChqb2JzKSk7XG4gICAgaWYgKCFpbXBvcnRSZXNwLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IGltcG9ydFJlc3AuZXJyb3IgfHwgXCJCdWxrIGltcG9ydCBmYWlsZWRcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaW1wb3J0ZWQ6IGltcG9ydFJlc3AuZGF0YT8uaW1wb3J0ZWQgPz8gam9icy5sZW5ndGgsXG4gICAgICAgICAgICBhdHRlbXB0ZWQ6IGpvYnMubGVuZ3RoLFxuICAgICAgICAgICAgcGFnZXMsXG4gICAgICAgICAgICBlcnJvcnMsXG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUZpbGxGb3JtKCkge1xuICAgIGlmIChkZXRlY3RlZEZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vIGZpZWxkcyBkZXRlY3RlZFwiIH07XG4gICAgfVxuICAgIC8vIEdldCBwcm9maWxlIGlmIG5vdCBjYWNoZWRcbiAgICBpZiAoIWNhY2hlZFByb2ZpbGUpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5nZXRQcm9maWxlKCkpO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MgfHwgIXJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gbG9hZCBwcm9maWxlXCIgfTtcbiAgICAgICAgfVxuICAgICAgICBjYWNoZWRQcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9XG4gICAgLy8gQ3JlYXRlIG1hcHBlciBhbmQgZW5naW5lXG4gICAgY29uc3QgbWFwcGVyID0gbmV3IEZpZWxkTWFwcGVyKGNhY2hlZFByb2ZpbGUpO1xuICAgIGF1dG9GaWxsRW5naW5lID0gbmV3IEF1dG9GaWxsRW5naW5lKGZpZWxkRGV0ZWN0b3IsIG1hcHBlcik7XG4gICAgLy8gRmlsbCB0aGUgZm9ybVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGF1dG9GaWxsRW5naW5lLmZpbGxGb3JtKGRldGVjdGVkRmllbGRzKTtcbiAgICBpZiAocmVzdWx0LmZpbGxlZCA+PSAyKSB7XG4gICAgICAgIGZvciAoY29uc3QgZm9ybSBvZiBuZXcgU2V0KGRldGVjdGVkRmllbGRzXG4gICAgICAgICAgICAubWFwKChmaWVsZCkgPT4gZmllbGQuZWxlbWVudC5jbG9zZXN0KFwiZm9ybVwiKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKGZvcm0pID0+IGZvcm0gaW5zdGFuY2VvZiBIVE1MRm9ybUVsZW1lbnQpKSkge1xuICAgICAgICAgICAgYXV0b2ZpbGxlZEZvcm1zLmFkZChmb3JtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEV4dGVuc2lvblNldHRpbmdzKCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0U2V0dGluZ3MoKSk7XG4gICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5lcnJvciB8fCBcIkZhaWxlZCB0byBsb2FkIGV4dGVuc2lvbiBzZXR0aW5nc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG59XG5hc3luYyBmdW5jdGlvbiB1cGRhdGVTaWRlYmFyKCkge1xuICAgIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBsb2FkUHJvZmlsZUZvclNpZGViYXIoKTtcbiAgICBhd2FpdCBzaWRlYmFyQ29udHJvbGxlci51cGRhdGUoe1xuICAgICAgICBzY3JhcGVkSm9iLFxuICAgICAgICBkZXRlY3RlZEZpZWxkQ291bnQ6IGRldGVjdGVkRmllbGRzLmxlbmd0aCxcbiAgICAgICAgcHJvZmlsZSxcbiAgICAgICAgb25UYWlsb3I6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmICghc2NyYXBlZEpvYilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBqb2IgZGV0ZWN0ZWRcIik7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLnRhaWxvckZyb21QYWdlKHNjcmFwZWRKb2IpKTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2VzcyB8fCAhcmVzcG9uc2UuZGF0YT8udXJsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yIHx8IFwiRmFpbGVkIHRvIHRhaWxvciByZXN1bWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cub3BlbihyZXNwb25zZS5kYXRhLnVybCwgXCJfYmxhbmtcIiwgXCJub29wZW5lcixub3JlZmVycmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvdmVyTGV0dGVyOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXNjcmFwZWRKb2IpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gam9iIGRldGVjdGVkXCIpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5nZW5lcmF0ZUNvdmVyTGV0dGVyRnJvbVBhZ2Uoc2NyYXBlZEpvYikpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhPy51cmwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IgfHwgXCJGYWlsZWQgdG8gZ2VuZXJhdGUgY292ZXIgbGV0dGVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93Lm9wZW4ocmVzcG9uc2UuZGF0YS51cmwsIFwiX2JsYW5rXCIsIFwibm9vcGVuZXIsbm9yZWZlcnJlclwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TYXZlOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXNjcmFwZWRKb2IpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gam9iIGRldGVjdGVkXCIpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5pbXBvcnRKb2Ioc2NyYXBlZEpvYikpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yIHx8IFwiRmFpbGVkIHRvIHNhdmUgam9iXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkF1dG9GaWxsOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZUZpbGxGb3JtKCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IgfHwgXCJGYWlsZWQgdG8gYXV0by1maWxsIGZvcm1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2VhcmNoQW5zd2VyczogYXN5bmMgKHF1ZXJ5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLnNlYXJjaEFuc3dlcnMocXVlcnkpKTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5lcnJvciB8fCBcIkFuc3dlciBzZWFyY2ggZmFpbGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEgfHwgW107XG4gICAgICAgIH0sXG4gICAgICAgIG9uQXBwbHlBbnN3ZXI6IChhbnN3ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCB8fFxuICAgICAgICAgICAgICAgIGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUudmFsdWUgPSBhbnN3ZXIuYW5zd2VyO1xuICAgICAgICAgICAgICAgIGFjdGl2ZS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgYWN0aXZlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiY2hhbmdlXCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBsb2FkUHJvZmlsZUZvclNpZGViYXIoKSB7XG4gICAgaWYgKGNhY2hlZFByb2ZpbGUpXG4gICAgICAgIHJldHVybiBjYWNoZWRQcm9maWxlO1xuICAgIGlmICghcHJvZmlsZUxvYWRQcm9taXNlKSB7XG4gICAgICAgIHByb2ZpbGVMb2FkUHJvbWlzZSA9IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLmdldFByb2ZpbGUoKSlcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgJiYgcmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICAgICAgIGNhY2hlZFByb2ZpbGUgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gbnVsbClcbiAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgIHByb2ZpbGVMb2FkUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZmlsZUxvYWRQcm9taXNlO1xufVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCAoKSA9PiB7XG4gICAgc3VibWl0V2F0Y2hlci5kZXRhY2goKTtcbiAgICBzaWRlYmFyQ29udHJvbGxlci5kZXN0cm95KCk7XG59KTtcbi8vIFV0aWxpdHk6IGRlYm91bmNlIGZ1bmN0aW9uXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcbiAgICBsZXQgdGltZW91dElkO1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBmbiguLi5hcmdzKSwgZGVsYXkpO1xuICAgIH07XG59XG5jb25zb2xlLmxvZyhcIltDb2x1bWJ1c10gQ29udGVudCBzY3JpcHQgbG9hZGVkXCIpO1xuLy8gUGljayB1cCBhIGxvY2FsU3RvcmFnZS10cmFuc3BvcnRlZCBhdXRoIHRva2VuIGZyb20gdGhlIFNsb3RoaW5nIGNvbm5lY3QgcGFnZS5cbi8vIFVzZWQgb24gYnJvd3NlcnMgdGhhdCBkb24ndCBob25vciBleHRlcm5hbGx5X2Nvbm5lY3RhYmxlIChGaXJlZm94IGluXG4vLyBwYXJ0aWN1bGFyKS4gVGhlIGNvbm5lY3QgcGFnZSB3cml0ZXMgdGhlIHRva2VuIHVuZGVyIHRoaXMga2V5OyB3ZSBmb3J3YXJkIGl0XG4vLyB0byB0aGUgYmFja2dyb3VuZCwgd2hpY2ggc3RvcmVzIGl0IGluIGNocm9tZS5zdG9yYWdlLmxvY2FsIGFuZCBjbGVhcnMgdGhlXG4vLyBsb2NhbFN0b3JhZ2UgZW50cnkuIFBvbGxzIGZvciB+MzBzIGluIGNhc2UgdGhlIHNjcmlwdCBydW5zIGJlZm9yZSB0aGUgcGFnZVxuLy8gaGFzIHdyaXR0ZW4gdGhlIGtleS5cbmNvbnN0IFNMT1RISU5HX1RPS0VOX0tFWSA9IFwiY29sdW1idXNfZXh0ZW5zaW9uX3Rva2VuXCI7XG5sZXQgcGlja3VwSW5GbGlnaHQgPSBmYWxzZTtcbmZ1bmN0aW9uIHBpY2tVcFNsb3RoaW5nVG9rZW4oKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oU0xPVEhJTkdfVE9LRU5fS0VZKTtcbiAgICAgICAgaWYgKCFyYXcpXG4gICAgICAgICAgICByZXR1cm4gXCJlbXB0eVwiO1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgIGlmICghcGFyc2VkPy50b2tlbiB8fCAhcGFyc2VkPy5leHBpcmVzQXQpIHtcbiAgICAgICAgICAgIC8vIE1hbGZvcm1lZCBwYXlsb2FkIOKAlCBwdXJnZSBzbyB3ZSBzdG9wIHBvbGxpbmcuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFNMT1RISU5HX1RPS0VOX0tFWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJlbXB0eVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwaWNrdXBJbkZsaWdodClcbiAgICAgICAgICAgIHJldHVybiBcInBlbmRpbmdcIjtcbiAgICAgICAgcGlja3VwSW5GbGlnaHQgPSB0cnVlO1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcIkFVVEhfQ0FMTEJBQ0tcIixcbiAgICAgICAgICAgIHRva2VuOiBwYXJzZWQudG9rZW4sXG4gICAgICAgICAgICBleHBpcmVzQXQ6IHBhcnNlZC5leHBpcmVzQXQsXG4gICAgICAgIH0sIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcGlja3VwSW5GbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZT8uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFNMT1RISU5HX1RPS0VOX0tFWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBwaWNrZWQgdXAgbG9jYWxTdG9yYWdlIHRva2VuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFwicGVuZGluZ1wiO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBcImVtcHR5XCI7XG4gICAgfVxufVxuaWYgKC8oXnxcXC4pbG9jYWxob3N0KDp8JCl8XjEyN1xcLjBcXC4wXFwuMSg6fCQpfF5cXFs6OjFcXF0oOnwkKS8udGVzdCh3aW5kb3cubG9jYXRpb24uaG9zdCkpIHtcbiAgICAvLyBJbml0aWFsIHByb2JlOiBpZiB0aGVyZSdzIG5vdGhpbmcgdG8gcGljayB1cCBhbmQgd2UncmUgbm90IG9uIHRoZSBjb25uZWN0XG4gICAgLy8gcGFnZSBpdHNlbGYsIHRoZXJlJ3Mgbm8gcmVhc29uIHRvIHBvbGwg4oCUIHRoZSBwYWdlIGhhc24ndCBiZWVuIG9wZW5lZC5cbiAgICAvLyBPbiB0aGUgY29ubmVjdCBwYWdlIChvciBhbnl3aGVyZSBlbHNlIGlmIHRoZSB1c2VyIGlzIGFib3V0IHRvIGxhbmQgb25cbiAgICAvLyAvZXh0ZW5zaW9uL2Nvbm5lY3QgdmlhIFNQQSBuYXYpLCBrZWVwIHBvbGxpbmcgZm9yIDMwcy5cbiAgICBjb25zdCBpbml0aWFsID0gcGlja1VwU2xvdGhpbmdUb2tlbigpO1xuICAgIGNvbnN0IG9uQ29ubmVjdFBhdGggPSAvXFwvZXh0ZW5zaW9uXFwvY29ubmVjdChcXGJ8XFwvKS8udGVzdCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgIGlmIChpbml0aWFsICE9PSBcImVtcHR5XCIgfHwgb25Db25uZWN0UGF0aCkge1xuICAgICAgICBsZXQgZWxhcHNlZE1zID0gMDtcbiAgICAgICAgY29uc3QgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGVsYXBzZWRNcyArPSA1MDA7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwaWNrVXBTbG90aGluZ1Rva2VuKCk7XG4gICAgICAgICAgICBpZiAoKHJlc3VsdCA9PT0gXCJlbXB0eVwiICYmICFwaWNrdXBJbkZsaWdodCAmJiBlbGFwc2VkTXMgPiAyMDAwKSB8fFxuICAgICAgICAgICAgICAgIGVsYXBzZWRNcyA+PSAzMDAwMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9