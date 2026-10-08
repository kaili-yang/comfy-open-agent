(function(){"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.appendChild(document.createTextNode(".coa-panel[data-v-fd82d059]{display:flex;flex-direction:column;height:100%;min-height:0;color:var(--input-text, #ddd);font-size:13px}.coa-header[data-v-fd82d059]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--border-color, #444)}.coa-heading[data-v-fd82d059]{display:flex;flex-direction:column;min-width:0}.coa-title[data-v-fd82d059]{font-weight:600;font-size:14px}.coa-model[data-v-fd82d059]{font-size:11px;opacity:.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.coa-messages[data-v-fd82d059]{flex:1;min-height:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}.coa-empty[data-v-fd82d059]{opacity:.7;line-height:1.5}.coa-bubble[data-v-fd82d059]{padding:8px 10px;border-radius:8px;white-space:pre-wrap;word-break:break-word;line-height:1.45}.coa-user[data-v-fd82d059]{align-self:flex-end;max-width:85%;background:var(--p-primary-color, #3b82f6);color:var(--p-primary-contrast-color, #fff)}.coa-assistant[data-v-fd82d059]{background:var(--comfy-input-bg, #222)}.coa-assistant[data-v-fd82d059] pre{margin:6px 0;padding:8px;overflow-x:auto;border-radius:6px;background:var(--comfy-menu-bg, #111);white-space:pre}.coa-assistant[data-v-fd82d059] code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}.coa-tool[data-v-fd82d059]{font-size:12px;border-left:2px solid var(--border-color, #444);padding-left:8px}.coa-tool summary[data-v-fd82d059]{cursor:pointer;display:flex;align-items:center;gap:6px;list-style:none}.coa-tool-name[data-v-fd82d059]{font-family:ui-monospace,Menlo,Consolas,monospace}.coa-tool-args[data-v-fd82d059]{opacity:.55;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.coa-tool pre[data-v-fd82d059]{margin:4px 0;padding:6px;max-height:200px;overflow:auto;border-radius:4px;background:var(--comfy-input-bg, #222);white-space:pre-wrap;word-break:break-word}.coa-ok[data-v-fd82d059]{color:#22c55e}.coa-fail[data-v-fd82d059]{color:#ef4444}.coa-notice[data-v-fd82d059]{font-size:12px;opacity:.75;font-style:italic}.coa-error[data-v-fd82d059]{color:#ef4444;opacity:1;font-style:normal}.coa-working[data-v-fd82d059]{font-size:12px;opacity:.7}.coa-input[data-v-fd82d059]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-top:1px solid var(--border-color, #444)}.coa-input textarea[data-v-fd82d059]{resize:vertical;min-height:60px;padding:8px;border-radius:6px;border:1px solid var(--border-color, #444);background:var(--comfy-input-bg, #222);color:inherit;font:inherit}.coa-button[data-v-fd82d059]{align-self:flex-end;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;background:var(--p-primary-color, #3b82f6);color:var(--p-primary-contrast-color, #fff);font:inherit}.coa-button[data-v-fd82d059]:disabled{opacity:.5;cursor:default}.coa-ghost[data-v-fd82d059]{background:transparent;color:inherit;border:1px solid var(--border-color, #444);font-size:12px;padding:4px 8px}.coa-stop[data-v-fd82d059]{background:#ef4444}")),document.head.appendChild(a)}}catch(o){console.error("vite-plugin-css-injected-by-js",o)}})();
import { api as Be } from "../../scripts/api.js";
import { app as et } from "../../scripts/app.js";
/**
* @vue/shared v3.5.43
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function is(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const V = {}, ft = [], Le = () => {
}, hr = () => !1, xn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), wn = (e) => e.startsWith("onUpdate:"), te = Object.assign, os = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ii = Object.prototype.hasOwnProperty, F = (e, t) => Ii.call(e, t), I = Array.isArray, Ze = (e) => Wt(e) === "[object Map]", dn = (e) => Wt(e) === "[object Set]", Es = (e) => Wt(e) === "[object Date]", P = (e) => typeof e == "function", G = (e) => typeof e == "string", Fe = (e) => typeof e == "symbol", k = (e) => e !== null && typeof e == "object", gr = (e) => (k(e) || P(e)) && P(e.then) && P(e.catch), mr = Object.prototype.toString, Wt = (e) => mr.call(e), Mi = (e) => Wt(e).slice(8, -1), _r = (e) => Wt(e) === "[object Object]", ls = (e) => G(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Pt = /* @__PURE__ */ is(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Sn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Pi = /-\w/g, xe = Sn(
  (e) => e.replace(Pi, (t) => t.slice(1).toUpperCase())
), $i = /\B([A-Z])/g, nt = Sn(
  (e) => e.replace($i, "-$1").toLowerCase()
), yr = Sn((e) => e.charAt(0).toUpperCase() + e.slice(1)), Fn = Sn(
  (e) => e ? `on${yr(e)}` : ""
), Re = (e, t) => !Object.is(e, t), fn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, br = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, cs = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let Is;
const Cn = () => Is || (Is = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function fs(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = G(s) ? Fi(s) : fs(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (G(e) || k(e))
    return e;
}
const Ri = /;(?![^(]*\))/g, Ni = /:([^]+)/, Li = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Fi(e) {
  const t = {};
  return e.replace(Li, (n) => n.startsWith("/*") ? "" : n).split(Ri).forEach((n) => {
    if (n) {
      const s = n.split(Ni);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function jt(e) {
  let t = "";
  if (G(e))
    t = e;
  else if (I(e))
    for (let n = 0; n < e.length; n++) {
      const s = jt(e[n]);
      s && (t += s + " ");
    }
  else if (k(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Di = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ji = /* @__PURE__ */ is(Di);
function vr(e) {
  return !!e || e === "";
}
function Hi(e, t, n) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let r = 0; s && r < e.length; r++)
    s = Tn(e[r], t[r], n);
  return s;
}
function Ms(e, t, n) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), r = new Uint8Array(s.length);
  for (const i of e) {
    let o = -1;
    for (let l = 0; l < s.length; l++)
      if (!r[l] && Tn(i, s[l], n)) {
        o = l;
        break;
      }
    if (o < 0) return !1;
    r[o] = 1;
  }
  return !0;
}
function ki(e, t, n) {
  let s = Ze(e), r = Ze(t);
  if (s || r || (s = dn(e), r = dn(t), s || r))
    return s && r ? Ms(e, t, n) : !1;
  const i = Object.keys(e).length, o = Object.keys(t).length;
  if (i !== o)
    return !1;
  for (const l in e) {
    const c = e.hasOwnProperty(l), d = t.hasOwnProperty(l);
    if (c && !d || !c && d || !Tn(e[l], t[l], n))
      return !1;
  }
  return String(e) === String(t);
}
function Ps(e, t, n, s) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [r, i] = n;
  if (r.has(e) || i.has(t))
    return r.get(e) === t && i.get(t) === e;
  r.set(e, t), i.set(t, e);
  const o = s(e, t, n);
  return r.delete(e), i.delete(t), o;
}
function Tn(e, t, n) {
  if (e === t) return !0;
  let s = Es(e), r = Es(t);
  return s || r ? s && r ? e.getTime() === t.getTime() : !1 : (s = Fe(e), r = Fe(t), s || r ? e === t : (s = I(e), r = I(t), s || r ? s && r ? Ps(e, t, n, Hi) : !1 : (s = k(e), r = k(t), s || r ? !s || !r ? !1 : Ps(e, t, n, ki) : String(e) === String(t))));
}
const xr = (e) => !!(e && e.__v_isRef === !0), ie = (e) => G(e) ? e : e == null ? "" : I(e) || k(e) && (e.toString === mr || !P(e.toString)) ? xr(e) ? ie(e.value) : JSON.stringify(e, wr, 2) : String(e), wr = (e, t) => xr(t) ? wr(e, t.value) : Ze(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[Dn(s, i) + " =>"] = r, n),
    {}
  )
} : dn(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Dn(n))
} : Fe(t) ? Dn(t) : k(t) && !I(t) && !_r(t) ? String(t) : t, Dn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Fe(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.43
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ee;
class Ki {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ee && (ee.active ? (this.parent = ee, this.index = (ee.scopes || (ee.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes) {
        const s = this.scopes.slice();
        for (t = 0, n = s.length; t < n; t++)
          s[t].pause();
      }
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes) {
        const r = this.scopes.slice();
        for (t = 0, n = r.length; t < n; t++)
          r[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, n = s.length; t < n; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = ee;
      try {
        return ee = this, t();
      } finally {
        ee = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ee, ee = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ee === this)
        ee = this.prevScope;
      else {
        let t = ee;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const r = this.scopes.slice();
        for (n = 0, s = r.length; n < s; n++)
          r[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Vi() {
  return ee;
}
let B;
const jn = /* @__PURE__ */ new WeakSet();
class Sr {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ee && (ee.active ? ee.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, jn.has(this) && (jn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Tr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, $s(this), Or(this);
    const t = B, n = we;
    B = this, we = !0;
    try {
      return this.fn();
    } finally {
      Ar(this), B = t, we = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ds(t);
      this.deps = this.depsTail = void 0, $s(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? jn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Yn(this) && this.run();
  }
  get dirty() {
    return Yn(this);
  }
}
let Cr = 0, $t, Rt;
function Tr(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Rt, Rt = e;
    return;
  }
  e.next = $t, $t = e;
}
function us() {
  Cr++;
}
function as() {
  if (--Cr > 0)
    return;
  if (Rt) {
    let t = Rt;
    for (Rt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; $t; ) {
    let t = $t;
    for ($t = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Or(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ar(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), ds(s), Ui(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function Yn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Er(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Er(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ht) || (e.globalVersion = Ht, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Yn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = B, s = we;
  B = e, we = !0;
  try {
    Or(e);
    const r = e.fn(e._value);
    (t.version === 0 || Re(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    B = n, we = s, Ar(e), e.flags &= -3;
  }
}
function ds(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      ds(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ui(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let we = !0;
const Ir = [];
function qe() {
  Ir.push(we), we = !1;
}
function Je() {
  const e = Ir.pop();
  we = e === void 0 ? !0 : e;
}
function $s(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = B;
    B = void 0;
    try {
      t();
    } finally {
      B = n;
    }
  }
}
let Ht = 0;
class Bi {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ps {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!B || !we || B === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== B)
      n = this.activeLink = new Bi(B, this), B.deps ? (n.prevDep = B.depsTail, B.depsTail.nextDep = n, B.depsTail = n) : B.deps = B.depsTail = n, Mr(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = B.depsTail, n.nextDep = void 0, B.depsTail.nextDep = n, B.depsTail = n, B.deps === n && (B.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Ht++, this.notify(t);
  }
  notify(t) {
    us();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      as();
    }
  }
}
function Mr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Mr(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const zn = /* @__PURE__ */ new WeakMap(), ut = /* @__PURE__ */ Symbol(
  ""
), Xn = /* @__PURE__ */ Symbol(
  ""
), kt = /* @__PURE__ */ Symbol(
  ""
);
function ne(e, t, n) {
  if (we && B) {
    let s = zn.get(e);
    s || zn.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new ps()), r.map = s, r.key = n), r.track();
  }
}
function Ve(e, t, n, s, r, i) {
  const o = zn.get(e);
  if (!o) {
    Ht++;
    return;
  }
  const l = (c) => {
    c && c.trigger();
  };
  if (us(), t === "clear")
    o.forEach(l);
  else {
    const c = I(e), d = c && ls(n);
    if (c && n === "length") {
      const a = Number(s);
      o.forEach((h, S) => {
        (S === "length" || S === kt || !Fe(S) && S >= a) && l(h);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && l(o.get(n)), d && l(o.get(kt)), t) {
        case "add":
          c ? d && l(o.get("length")) : (l(o.get(ut)), Ze(e) && l(o.get(Xn)));
          break;
        case "delete":
          c || (l(o.get(ut)), Ze(e) && l(o.get(Xn)));
          break;
        case "set":
          Ze(e) && l(o.get(ut));
          break;
      }
  }
  as();
}
function dt(e) {
  const t = /* @__PURE__ */ L(e);
  return t === e || (ne(t, "iterate", kt), /* @__PURE__ */ _e(e)) ? t : /* @__PURE__ */ De(e) ? /* @__PURE__ */ Qe(e) ? t.map((n) => tt(ye(n))) : t.map(tt) : t.map(ye);
}
function On(e) {
  return ne(e = /* @__PURE__ */ L(e), "iterate", kt), e;
}
function Pe(e, t) {
  return /* @__PURE__ */ De(e) ? tt(/* @__PURE__ */ Qe(e) ? ye(t) : t) : ye(t);
}
const Wi = {
  __proto__: null,
  [Symbol.iterator]() {
    return Hn(this, Symbol.iterator, (e) => Pe(this, e));
  },
  concat(...e) {
    return dt(this).concat(
      ...e.map((t) => I(t) ? dt(t) : t)
    );
  },
  entries() {
    return Hn(this, "entries", (e) => (e[1] = Pe(this, e[1]), e));
  },
  every(e, t) {
    return je(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return je(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => Pe(this, s)),
      arguments
    );
  },
  find(e, t) {
    return je(
      this,
      "find",
      e,
      t,
      (n) => Pe(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return je(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return je(
      this,
      "findLast",
      e,
      t,
      (n) => Pe(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return je(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return je(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return kn(this, "includes", e);
  },
  indexOf(...e) {
    return kn(this, "indexOf", e);
  },
  join(e) {
    return dt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return kn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return je(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return St(this, "pop");
  },
  push(...e) {
    return St(this, "push", e);
  },
  reduce(e, ...t) {
    return Rs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Rs(this, "reduceRight", e, t);
  },
  shift() {
    return St(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return je(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return St(this, "splice", e);
  },
  toReversed() {
    return dt(this).toReversed();
  },
  toSorted(e) {
    return dt(this).toSorted(e);
  },
  toSpliced(...e) {
    return dt(this).toSpliced(...e);
  },
  unshift(...e) {
    return St(this, "unshift", e);
  },
  values() {
    return Hn(this, "values", (e) => Pe(this, e));
  }
};
function Hn(e, t, n) {
  const s = On(e), r = s[t]();
  return s !== e && !/* @__PURE__ */ _e(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.done || (i.value = n(i.value)), i;
  }), r;
}
const qi = Array.prototype;
function je(e, t, n, s, r, i) {
  const o = On(e), l = o !== e && !/* @__PURE__ */ _e(e), c = o[t];
  if (c !== qi[t]) {
    const h = c.apply(e, i);
    return l ? ye(h) : h;
  }
  let d = n;
  o !== e && (l ? d = function(h, S) {
    return n.call(this, Pe(e, h), S, e);
  } : n.length > 2 && (d = function(h, S) {
    return n.call(this, h, S, e);
  }));
  const a = c.call(o, d, s);
  return l && r ? r(a) : a;
}
function Rs(e, t, n, s) {
  const r = On(e), i = r !== e && !/* @__PURE__ */ _e(e);
  let o = n, l = !1;
  r !== e && (i ? (l = s.length === 0, o = function(d, a, h) {
    return l && (l = !1, d = Pe(e, d)), n.call(this, d, Pe(e, a), h, e);
  }) : n.length > 3 && (o = function(d, a, h) {
    return n.call(this, d, a, h, e);
  }));
  const c = r[t](o, ...s);
  return l ? Pe(e, c) : c;
}
function kn(e, t, n) {
  const s = /* @__PURE__ */ L(e);
  ne(s, "iterate", kt);
  const r = s[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ ms(n[0]) ? (n[0] = /* @__PURE__ */ L(n[0]), s[t](...n)) : r;
}
function St(e, t, n = []) {
  qe(), us();
  const s = (/* @__PURE__ */ L(e))[t].apply(e, n);
  return as(), Je(), s;
}
const Ji = /* @__PURE__ */ is("__proto__,__v_isRef,__isVue"), Pr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Fe)
);
function Gi(e) {
  Fe(e) || (e = String(e));
  const t = /* @__PURE__ */ L(this);
  return ne(t, "has", e), t.hasOwnProperty(e);
}
class $r {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (r ? i ? ro : Fr : i ? Lr : Nr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = I(t);
    if (!r) {
      let c;
      if (o && (c = Wi[n]))
        return c;
      if (n === "hasOwnProperty")
        return Gi;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ se(t) ? t : s
    );
    if ((Fe(n) ? Pr.has(n) : Ji(n)) || (r || ne(t, "get", n), i))
      return l;
    if (/* @__PURE__ */ se(l)) {
      const c = o && ls(n) ? l : l.value;
      return r && k(c) ? /* @__PURE__ */ Qn(c) : c;
    }
    return k(l) ? r ? /* @__PURE__ */ Qn(l) : /* @__PURE__ */ An(l) : l;
  }
}
class Rr extends $r {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    const o = I(t) && ls(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ De(i);
      if (!/* @__PURE__ */ _e(s) && !/* @__PURE__ */ De(s) && (i = /* @__PURE__ */ L(i), s = /* @__PURE__ */ L(s)), !o && /* @__PURE__ */ se(i) && !/* @__PURE__ */ se(s))
        return d || (i.value = s), !0;
    }
    const l = o ? Number(n) < t.length : F(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ se(t) ? t : r
    );
    return t === /* @__PURE__ */ L(r) && c && (l ? Re(s, i) && Ve(t, "set", n, s) : Ve(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = F(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Ve(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Fe(n) || !Pr.has(n)) && ne(t, "has", n), s;
  }
  ownKeys(t) {
    return ne(
      t,
      "iterate",
      I(t) ? "length" : ut
    ), Reflect.ownKeys(t);
  }
}
class Yi extends $r {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const zi = /* @__PURE__ */ new Rr(), Xi = /* @__PURE__ */ new Yi(), Zi = /* @__PURE__ */ new Rr(!0);
const Zn = (e) => e, Qt = (e) => Reflect.getPrototypeOf(e);
function Qi(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = /* @__PURE__ */ L(r), o = Ze(i), l = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, d = r[e](...s), a = n ? Zn : t ? tt : ye;
    return !t && ne(
      i,
      "iterate",
      c ? Xn : ut
    ), te(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: S } = d.next();
          return S ? { value: h, done: S } : {
            value: l ? [a(h[0]), a(h[1])] : a(h),
            done: S
          };
        }
      }
    );
  };
}
function en(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function eo(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, o = /* @__PURE__ */ L(i), l = /* @__PURE__ */ L(r);
      e || (Re(r, l) && ne(o, "get", r), ne(o, "get", l));
      const { has: c } = Qt(o), d = t ? Zn : e ? tt : ye;
      if (c.call(o, r))
        return d(i.get(r));
      if (c.call(o, l))
        return d(i.get(l));
      i !== o && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && ne(/* @__PURE__ */ L(r), "iterate", ut), r.size;
    },
    has(r) {
      const i = this.__v_raw, o = /* @__PURE__ */ L(i), l = /* @__PURE__ */ L(r);
      return e || (Re(r, l) && ne(o, "has", r), ne(o, "has", l)), r === l ? i.has(r) : i.has(r) || i.has(l);
    },
    forEach(r, i) {
      const o = this, l = o.__v_raw, c = /* @__PURE__ */ L(l), d = t ? Zn : e ? tt : ye;
      return !e && ne(c, "iterate", ut), l.forEach((a, h) => r.call(i, d(a), d(h), o));
    }
  };
  return te(
    n,
    e ? {
      add: en("add"),
      set: en("set"),
      delete: en("delete"),
      clear: en("clear")
    } : {
      add(r) {
        const i = /* @__PURE__ */ L(this), o = Qt(i), l = /* @__PURE__ */ L(r), c = !t && !/* @__PURE__ */ _e(r) && !/* @__PURE__ */ De(r) ? l : r;
        return o.has.call(i, c) || Re(r, c) && o.has.call(i, r) || Re(l, c) && o.has.call(i, l) || (i.add(c), Ve(i, "add", c, c)), this;
      },
      set(r, i) {
        !t && !/* @__PURE__ */ _e(i) && !/* @__PURE__ */ De(i) && (i = /* @__PURE__ */ L(i));
        const o = /* @__PURE__ */ L(this), { has: l, get: c } = Qt(o);
        let d = l.call(o, r);
        d || (r = /* @__PURE__ */ L(r), d = l.call(o, r));
        const a = c.call(o, r);
        return o.set(r, i), d ? Re(i, a) && Ve(o, "set", r, i) : Ve(o, "add", r, i), this;
      },
      delete(r) {
        const i = /* @__PURE__ */ L(this), { has: o, get: l } = Qt(i);
        let c = o.call(i, r);
        c || (r = /* @__PURE__ */ L(r), c = o.call(i, r)), l && l.call(i, r);
        const d = i.delete(r);
        return c && Ve(i, "delete", r, void 0), d;
      },
      clear() {
        const r = /* @__PURE__ */ L(this), i = r.size !== 0, o = r.clear();
        return i && Ve(
          r,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = Qi(r, e, t);
  }), n;
}
function hs(e, t) {
  const n = eo(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    F(n, r) && r in s ? n : s,
    r,
    i
  );
}
const to = {
  get: /* @__PURE__ */ hs(!1, !1)
}, no = {
  get: /* @__PURE__ */ hs(!1, !0)
}, so = {
  get: /* @__PURE__ */ hs(!0, !1)
};
const Nr = /* @__PURE__ */ new WeakMap(), Lr = /* @__PURE__ */ new WeakMap(), Fr = /* @__PURE__ */ new WeakMap(), ro = /* @__PURE__ */ new WeakMap();
function io(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function An(e) {
  return /* @__PURE__ */ De(e) ? e : gs(
    e,
    !1,
    zi,
    to,
    Nr
  );
}
// @__NO_SIDE_EFFECTS__
function oo(e) {
  return gs(
    e,
    !1,
    Zi,
    no,
    Lr
  );
}
// @__NO_SIDE_EFFECTS__
function Qn(e) {
  return gs(
    e,
    !0,
    Xi,
    so,
    Fr
  );
}
function gs(e, t, n, s, r) {
  if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const o = io(Mi(e));
  if (o === 0)
    return e;
  const l = new Proxy(
    e,
    o === 2 ? s : n
  );
  return r.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function Qe(e) {
  return /* @__PURE__ */ De(e) ? /* @__PURE__ */ Qe(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function De(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function _e(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function ms(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ L(t) : e;
}
function lo(e) {
  return !F(e, "__v_skip") && Object.isExtensible(e) && br(e, "__v_skip", !0), e;
}
const ye = (e) => k(e) ? /* @__PURE__ */ An(e) : e, tt = (e) => k(e) ? /* @__PURE__ */ Qn(e) : e;
// @__NO_SIDE_EFFECTS__
function se(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Ns(e) {
  return co(e, !1);
}
function co(e, t) {
  return /* @__PURE__ */ se(e) ? e : new fo(e, t);
}
class fo {
  constructor(t, n) {
    this.dep = new ps(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ L(t), this._value = n ? t : ye(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ _e(t) || /* @__PURE__ */ De(t);
    t = s ? t : /* @__PURE__ */ L(t), Re(t, n) && (this._rawValue = t, this._value = s ? t : ye(t), this.dep.trigger());
  }
}
function J(e) {
  return /* @__PURE__ */ se(e) ? e.value : e;
}
const uo = {
  get: (e, t, n) => t === "__v_raw" ? e : J(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return /* @__PURE__ */ se(r) && !/* @__PURE__ */ se(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Dr(e) {
  return /* @__PURE__ */ Qe(e) ? e : new Proxy(e, uo);
}
class ao {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ps(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ht - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    B !== this)
      return Tr(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Er(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function po(e, t, n = !1) {
  let s, r;
  return P(e) ? s = e : (s = e.get, r = e.set), new ao(s, r, n);
}
const tn = {}, pn = /* @__PURE__ */ new WeakMap();
let ct;
function ho(e, t = !1, n = ct) {
  if (n) {
    let s = pn.get(n);
    s || pn.set(n, s = []), s.push(e);
  }
}
function go(e, t, n = V) {
  const { immediate: s, deep: r, once: i, scheduler: o, augmentJob: l, call: c } = n, d = (A) => r ? A : /* @__PURE__ */ _e(A) || r === !1 || r === 0 ? Ue(A, 1) : Ue(A);
  let a, h, S, C, D = !1, M = !1;
  if (/* @__PURE__ */ se(e) ? (h = () => e.value, D = /* @__PURE__ */ _e(e)) : /* @__PURE__ */ Qe(e) ? (h = () => d(e), D = !0) : I(e) ? (M = !0, D = e.some((A) => /* @__PURE__ */ Qe(A) || /* @__PURE__ */ _e(A)), h = () => e.map((A) => {
    if (/* @__PURE__ */ se(A))
      return A.value;
    if (/* @__PURE__ */ Qe(A))
      return d(A);
    if (P(A))
      return c ? c(A, 2) : A();
  })) : P(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (S) {
      qe();
      try {
        S();
      } finally {
        Je();
      }
    }
    const A = ct;
    ct = a;
    try {
      return c ? c(e, 3, [C]) : e(C);
    } finally {
      ct = A;
    }
  } : h = Le, t && r) {
    const A = h, Z = r === !0 ? 1 / 0 : r;
    h = () => Ue(A(), Z);
  }
  const Y = Vi(), W = () => {
    a.stop(), Y && Y.active && os(Y.effects, a);
  };
  if (i && t) {
    const A = t;
    t = (...Z) => {
      const Ce = A(...Z);
      return W(), Ce;
    };
  }
  let N = M ? new Array(e.length).fill(tn) : tn;
  const j = (A) => {
    if (!(!(a.flags & 1) || !a.dirty && !A))
      if (t) {
        const Z = a.run();
        if (A || r || D || (M ? Z.some((Ce, Te) => Re(Ce, N[Te])) : Re(Z, N))) {
          S && S();
          const Ce = ct;
          ct = a;
          try {
            const Te = [
              Z,
              // pass undefined as the old value when it's changed for the first time
              N === tn ? void 0 : M && N[0] === tn ? [] : N,
              C
            ];
            N = Z, c ? c(t, 3, Te) : (
              // @ts-expect-error
              t(...Te)
            );
          } finally {
            ct = Ce;
          }
        }
      } else
        a.run();
  };
  return l && l(j), a = new Sr(h), a.scheduler = o ? () => o(j, !1) : j, C = (A) => ho(A, !1, a), S = a.onStop = () => {
    const A = pn.get(a);
    if (A) {
      if (c)
        c(A, 4);
      else
        for (const Z of A) Z();
      pn.delete(a);
    }
  }, t ? s ? j(!0) : N = a.run() : o ? o(j.bind(null, !0), !0) : a.run(), W.pause = a.pause.bind(a), W.resume = a.resume.bind(a), W.stop = W, W;
}
function Ue(e, t = 1 / 0, n) {
  if (t <= 0 || !k(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ se(e))
    Ue(e.value, t, n);
  else if (I(e))
    for (let s = 0; s < e.length; s++)
      Ue(e[s], t, n);
  else if (dn(e) || Ze(e))
    e.forEach((s) => {
      Ue(s, t, n);
    });
  else if (_r(e)) {
    for (const s in e)
      Ue(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Ue(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.43
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function qt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    En(r, t, n);
  }
}
function Se(e, t, n, s) {
  if (P(e)) {
    const r = qt(e, t, n, s);
    return r && gr(r) && r.catch((i) => {
      En(i, t, n);
    }), r;
  }
  if (I(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push(Se(e[i], t, n, s));
    return r;
  }
}
function En(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: o } = t && t.appContext.config || V;
  if (t) {
    let l = t.parent;
    const c = t.proxy, d = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const a = l.ec;
      if (a) {
        for (let h = 0; h < a.length; h++)
          if (a[h](e, c, d) === !1)
            return;
      }
      l = l.parent;
    }
    if (i) {
      qe(), qt(i, null, 10, [
        e,
        c,
        d
      ]), Je();
      return;
    }
  }
  mo(e, n, r, s, o);
}
function mo(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const le = [];
let Me = -1;
const mt = [];
let Xe = null, pt = 0;
const jr = /* @__PURE__ */ Promise.resolve();
let hn = null;
function Hr(e) {
  const t = hn || jr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function _o(e) {
  let t = Me + 1, n = le.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = le[s], i = Kt(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function _s(e) {
  if (!(e.flags & 1)) {
    const t = Kt(e), n = le[le.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Kt(n) ? le.push(e) : le.splice(_o(t), 0, e), e.flags |= 1, kr();
  }
}
function kr() {
  hn || (hn = jr.then(Vr));
}
function yo(e) {
  if (!I(e))
    Xe && e.id === -1 ? Xe.splice(pt + 1, 0, e) : e.flags & 1 || (mt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      mt.push(e[t]);
  kr();
}
function Ls(e, t, n = Me + 1) {
  for (; n < le.length; n++) {
    const s = le[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      le.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Kr(e) {
  if (mt.length) {
    const t = [...new Set(mt)].sort(
      (n, s) => Kt(n) - Kt(s)
    );
    if (mt.length = 0, Xe) {
      for (let n = 0; n < t.length; n++)
        Xe.push(t[n]);
      return;
    }
    for (Xe = t, pt = 0; pt < Xe.length; pt++) {
      const n = Xe[pt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Xe = null, pt = 0;
  }
}
const Kt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Vr(e) {
  try {
    for (Me = 0; Me < le.length; Me++) {
      const t = le[Me];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), qt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Me < le.length; Me++) {
      const t = le[Me];
      t && (t.flags &= -2);
    }
    Me = -1, le.length = 0, Kr(), hn = null, (le.length || mt.length) && Vr();
  }
}
let me = null, Ur = null;
function gn(e) {
  const t = me;
  return me = e, Ur = e && e.type.__scopeId || null, t;
}
function bo(e, t = me, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && qs(-1);
    const i = gn(t), o = at.length;
    let l;
    try {
      l = e(...r);
    } finally {
      for (let c = at.length; c > o; c--) hi();
      gn(i), s._d && qs(1);
    }
    return l;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function vo(e, t) {
  if (me === null)
    return e;
  const n = Rn(me), s = e.dirs || (e.dirs = []);
  for (let r = 0; r < t.length; r++) {
    let [i, o, l, c = V] = t[r];
    i && (P(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && Ue(o), s.push({
      dir: i,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: l,
      modifiers: c
    }));
  }
  return e;
}
function ot(e, t, n, s) {
  const r = e.dirs, i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    i && (l.oldValue = i[o].value);
    let c = l.dir[s];
    c && (qe(), Se(c, n, 8, [
      e.el,
      l,
      e,
      t
    ]), Je());
  }
}
function xo(e, t) {
  if (ce) {
    let n = ce.provides;
    const s = ce.parent && ce.parent.provides;
    s === n && (n = ce.provides = Object.create(s)), n[e] = t;
  }
}
function un(e, t, n = !1) {
  const s = vl();
  if (s || _t) {
    let r = _t ? _t._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && P(t) ? t.call(s && s.proxy) : t;
  }
}
const wo = /* @__PURE__ */ Symbol.for("v-scx"), So = () => un(wo);
function Nt(e, t, n) {
  return Br(e, t, n);
}
function Br(e, t, n = V) {
  const { immediate: s, deep: r, flush: i, once: o } = n, l = te({}, n), c = t && s || !t && i !== "post";
  let d;
  if (Bt) {
    if (i === "sync") {
      const C = So();
      d = C.__watcherHandles || (C.__watcherHandles = []);
    } else if (!c) {
      const C = () => {
      };
      return C.stop = Le, C.resume = Le, C.pause = Le, C;
    }
  }
  const a = ce;
  l.call = (C, D, M) => Se(C, a, D, M);
  let h = !1;
  i === "post" ? l.scheduler = (C) => {
    ue(C, a && a.suspense);
  } : i !== "sync" && (h = !0, l.scheduler = (C, D) => {
    D ? C() : _s(C);
  }), l.augmentJob = (C) => {
    t && (C.flags |= 4), h && (C.flags |= 2, a && (C.id = a.uid, C.i = a));
  };
  const S = go(e, t, l);
  return Bt && (d ? d.push(S) : c && S()), S;
}
function Co(e, t, n) {
  const s = this.proxy, r = G(e) ? e.includes(".") ? Wr(s, e) : () => s[e] : e.bind(s, s);
  let i;
  P(t) ? i = t : (i = t.handler, n = t);
  const o = Jt(this), l = Br(r, i.bind(s), n);
  return o(), l;
}
function Wr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const To = /* @__PURE__ */ Symbol("_vte"), In = (e) => e.__isTeleport, Kn = /* @__PURE__ */ Symbol("_leaveCb");
function Oo(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== Ge) {
        t = n;
        break;
      }
  }
  return t;
}
function qr(e) {
  if (!bs(e))
    return In(e.type) && e.children ? Oo(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && P(n.default))
      return n.default();
  }
}
function ys(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    ys(
      In(n.type) && qr(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Ao(e, t) {
  return P(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    te({ name: e.name }, t, { setup: e })
  ) : e;
}
function Jr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Fs(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const mn = /* @__PURE__ */ new WeakMap();
function Lt(e, t, n, s, r = !1) {
  if (I(e)) {
    e.forEach(
      (M, Y) => Lt(
        M,
        t && (I(t) ? t[Y] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Ft(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Lt(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? Rn(s.component) : s.el, o = r ? null : i, { i: l, r: c } = e, d = t && t.r, a = l.refs === V ? l.refs = {} : l.refs, h = l.setupState, S = /* @__PURE__ */ L(h), C = h === V ? hr : (M) => Fs(a, M) ? !1 : F(S, M), D = (M, Y) => !(Y && Fs(a, Y));
  if (d != null && d !== c) {
    if (Ds(t), G(d))
      a[d] = null, C(d) && (h[d] = null);
    else if (/* @__PURE__ */ se(d)) {
      const M = t;
      D(d, M.k) && (d.value = null), M.k && (a[M.k] = null);
    }
  }
  if (P(c))
    qt(c, l, 12, [o, a]);
  else {
    const M = G(c), Y = /* @__PURE__ */ se(c);
    if (M || Y) {
      const W = () => {
        if (e.f) {
          const N = M ? C(c) ? h[c] : a[c] : D() || !e.k ? c.value : a[e.k];
          if (r)
            I(N) && os(N, i);
          else if (I(N))
            N.includes(i) || N.push(i);
          else if (M)
            a[c] = [i], C(c) && (h[c] = a[c]);
          else {
            const j = [i];
            D(c, e.k) && (c.value = j), e.k && (a[e.k] = j);
          }
        } else M ? (a[c] = o, C(c) && (h[c] = o)) : Y && (D(c, e.k) && (c.value = o), e.k && (a[e.k] = o));
      };
      if (o) {
        const N = () => {
          W(), mn.delete(e);
        };
        N.id = -1, mn.set(e, N), ue(N, n);
      } else
        Ds(e), W();
    }
  }
}
function Ds(e) {
  const t = mn.get(e);
  t && (t.flags |= 8, mn.delete(e));
}
Cn().requestIdleCallback;
Cn().cancelIdleCallback;
const Ft = (e) => !!e.type.__asyncLoader, bs = (e) => e.type.__isKeepAlive;
function Eo(e, t) {
  Gr(e, "a", t);
}
function Io(e, t) {
  Gr(e, "da", t);
}
function Gr(e, t, n = ce) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Mn(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      bs(r.parent.vnode) && Mo(s, t, n, r), r = r.parent;
  }
}
function Mo(e, t, n, s) {
  const r = Mn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  zr(() => {
    os(s[t], r);
  }, n);
}
function Mn(e, t, n = ce, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...o) => {
      qe();
      const l = Jt(n), c = Se(t, n, e, o);
      return l(), Je(), c;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const Ye = (e) => (t, n = ce) => {
  (!Bt || e === "sp") && Mn(e, (...s) => t(...s), n);
}, Po = Ye("bm"), Yr = Ye("m"), $o = Ye(
  "bu"
), Ro = Ye("u"), No = Ye(
  "bum"
), zr = Ye("um"), Lo = Ye(
  "sp"
), Fo = Ye("rtg"), Do = Ye("rtc");
function jo(e, t = ce) {
  Mn("ec", e, t);
}
const Ho = /* @__PURE__ */ Symbol.for("v-ndc");
function ko(e, t, n, s) {
  let r;
  const i = n, o = I(e);
  if (o || G(e)) {
    const l = o && /* @__PURE__ */ Qe(e);
    let c = !1, d = !1;
    l && (c = !/* @__PURE__ */ _e(e), d = /* @__PURE__ */ De(e), e = On(e)), r = new Array(e.length);
    for (let a = 0, h = e.length; a < h; a++)
      r[a] = t(
        c ? d ? tt(ye(e[a])) : ye(e[a]) : e[a],
        a,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let l = 0; l < e; l++)
      r[l] = t(l + 1, l, void 0, i);
  } else if (k(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (l, c) => t(l, c, void 0, i)
      );
    else {
      const l = Object.keys(e);
      r = new Array(l.length);
      for (let c = 0, d = l.length; c < d; c++) {
        const a = l[c];
        r[c] = t(e[a], a, c, i);
      }
    }
  else
    r = [];
  return r;
}
const es = (e) => e ? yi(e) ? Rn(e) : es(e.parent) : null, Dt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ te(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => es(e.parent),
    $root: (e) => es(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Zr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      _s(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Hr.bind(e.proxy)),
    $watch: (e) => Co.bind(e)
  })
), Vn = (e, t) => e !== V && !e.__isScriptSetup && F(e, t), Ko = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: i, accessCache: o, type: l, appContext: c } = e;
    if (t[0] !== "$") {
      const S = o[t];
      if (S !== void 0)
        switch (S) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Vn(s, t))
          return o[t] = 1, s[t];
        if (r !== V && F(r, t))
          return o[t] = 2, r[t];
        if (F(i, t))
          return o[t] = 3, i[t];
        if (n !== V && F(n, t))
          return o[t] = 4, n[t];
        ts && (o[t] = 0);
      }
    }
    const d = Dt[t];
    let a, h;
    if (d)
      return t === "$attrs" && ne(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (a = l.__cssModules) && (a = a[t])
    )
      return a;
    if (n !== V && F(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      h = c.config.globalProperties, F(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Vn(r, t) ? (r[t] = n, !0) : s !== V && F(s, t) ? (s[t] = n, !0) : F(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, props: i, type: o }
  }, l) {
    let c;
    return !!(n[l] || e !== V && l[0] !== "$" && F(e, l) || Vn(t, l) || F(i, l) || F(s, l) || F(Dt, l) || F(r.config.globalProperties, l) || (c = o.__cssModules) && c[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : F(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function js(e) {
  return I(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let ts = !0;
function Vo(e) {
  const t = Zr(e), n = e.proxy, s = e.ctx;
  ts = !1, t.beforeCreate && Hs(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: o,
    watch: l,
    provide: c,
    inject: d,
    // lifecycle
    created: a,
    beforeMount: h,
    mounted: S,
    beforeUpdate: C,
    updated: D,
    activated: M,
    deactivated: Y,
    beforeDestroy: W,
    beforeUnmount: N,
    destroyed: j,
    unmounted: A,
    render: Z,
    renderTracked: Ce,
    renderTriggered: Te,
    errorCaptured: ze,
    serverPrefetch: Gt,
    // public API
    expose: st,
    inheritAttrs: bt,
    // assets
    components: Yt,
    directives: zt,
    filters: Nn
  } = t;
  if (d && Uo(d, s, null), o)
    for (const q in o) {
      const U = o[q];
      P(U) && (s[q] = U.bind(n));
    }
  if (r) {
    const q = r.call(n, n);
    k(q) && (e.data = /* @__PURE__ */ An(q));
  }
  if (ts = !0, i)
    for (const q in i) {
      const U = i[q], rt = P(U) ? U.bind(n, n) : P(U.get) ? U.get.bind(n, n) : Le, Xt = !P(U) && P(U.set) ? U.set.bind(n) : Le, it = Ol({
        get: rt,
        set: Xt
      });
      Object.defineProperty(s, q, {
        enumerable: !0,
        configurable: !0,
        get: () => it.value,
        set: (be) => it.value = be
      });
    }
  if (l)
    for (const q in l)
      Xr(l[q], s, n, q);
  if (c) {
    const q = P(c) ? c.call(n) : c;
    Reflect.ownKeys(q).forEach((U) => {
      xo(U, q[U]);
    });
  }
  a && Hs(a, e, "c");
  function re(q, U) {
    I(U) ? U.forEach((rt) => q(rt.bind(n))) : U && q(U.bind(n));
  }
  if (re(Po, h), re(Yr, S), re($o, C), re(Ro, D), re(Eo, M), re(Io, Y), re(jo, ze), re(Do, Ce), re(Fo, Te), re(No, N), re(zr, A), re(Lo, Gt), I(st))
    if (st.length) {
      const q = e.exposed || (e.exposed = {});
      st.forEach((U) => {
        Object.defineProperty(q, U, {
          get: () => n[U],
          set: (rt) => n[U] = rt,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  Z && e.render === Le && (e.render = Z), bt != null && (e.inheritAttrs = bt), Yt && (e.components = Yt), zt && (e.directives = zt), Gt && Jr(e);
}
function Uo(e, t, n = Le) {
  I(e) && (e = ns(e));
  for (const s in e) {
    const r = e[s];
    let i;
    k(r) ? "default" in r ? i = un(
      r.from || s,
      r.default,
      !0
    ) : i = un(r.from || s) : i = un(r), /* @__PURE__ */ se(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (o) => i.value = o
    }) : t[s] = i;
  }
}
function Hs(e, t, n) {
  Se(
    I(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Xr(e, t, n, s) {
  let r = s.includes(".") ? Wr(n, s) : () => n[s];
  if (G(e)) {
    const i = t[e];
    P(i) && Nt(r, i);
  } else if (P(e))
    Nt(r, e.bind(n));
  else if (k(e))
    if (I(e))
      e.forEach((i) => Xr(i, t, n, s));
    else {
      const i = P(e.handler) ? e.handler.bind(n) : t[e.handler];
      P(i) && Nt(r, i, e);
    }
}
function Zr(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = i.get(t);
  let c;
  return l ? c = l : !r.length && !n && !s ? c = t : (c = {}, r.length && r.forEach(
    (d) => _n(c, d, o, !0)
  ), _n(c, t, o)), k(t) && i.set(t, c), c;
}
function _n(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && _n(e, i, n, !0), r && r.forEach(
    (o) => _n(e, o, n, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = Bo[o] || n && n[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const Bo = {
  data: ks,
  props: Ks,
  emits: Ks,
  // objects
  methods: It,
  computed: It,
  // lifecycle
  beforeCreate: oe,
  created: oe,
  beforeMount: oe,
  mounted: oe,
  beforeUpdate: oe,
  updated: oe,
  beforeDestroy: oe,
  beforeUnmount: oe,
  destroyed: oe,
  unmounted: oe,
  activated: oe,
  deactivated: oe,
  errorCaptured: oe,
  serverPrefetch: oe,
  // assets
  components: It,
  directives: It,
  // watch
  watch: qo,
  // provide / inject
  provide: ks,
  inject: Wo
};
function ks(e, t) {
  return t ? e ? function() {
    return te(
      P(e) ? e.call(this, this) : e,
      P(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Wo(e, t) {
  return It(ns(e), ns(t));
}
function ns(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function oe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function It(e, t) {
  return e ? te(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ks(e, t) {
  return e ? I(e) && I(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : te(
    /* @__PURE__ */ Object.create(null),
    js(e),
    js(t ?? {})
  ) : t;
}
function qo(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = te(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = oe(e[s], t[s]);
  return n;
}
function Qr() {
  return {
    app: null,
    config: {
      isNativeTag: hr,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Jo = 0;
function Go(e, t) {
  return function(s, r = null) {
    P(s) || (s = te({}, s)), r != null && !k(r) && (r = null);
    const i = Qr(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let c = !1;
    const d = i.app = {
      _uid: Jo++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Al,
      get config() {
        return i.config;
      },
      set config(a) {
      },
      use(a, ...h) {
        return o.has(a) || (a && P(a.install) ? (o.add(a), a.install(d, ...h)) : P(a) && (o.add(a), a(d, ...h))), d;
      },
      mixin(a) {
        return i.mixins.includes(a) || i.mixins.push(a), d;
      },
      component(a, h) {
        return h ? (i.components[a] = h, d) : i.components[a];
      },
      directive(a, h) {
        return h ? (i.directives[a] = h, d) : i.directives[a];
      },
      mount(a, h, S) {
        if (!c) {
          const C = d._ceVNode || We(s, r);
          return C.appContext = i, S === !0 ? S = "svg" : S === !1 && (S = void 0), e(C, a, S), c = !0, d._container = a, a.__vue_app__ = d, Rn(C.component);
        }
      },
      onUnmount(a) {
        l.push(a);
      },
      unmount() {
        c && (Se(
          l,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(a, h) {
        return i.provides[a] = h, d;
      },
      runWithContext(a) {
        const h = _t;
        _t = d;
        try {
          return a();
        } finally {
          _t = h;
        }
      }
    };
    return d;
  };
}
let _t = null;
const Yo = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${xe(t)}Modifiers`] || e[`${nt(t)}Modifiers`];
function zo(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || V;
  let r = n;
  const i = t.startsWith("update:"), o = i && Yo(s, t.slice(7));
  o && (o.trim && (r = n.map((a) => G(a) ? a.trim() : a)), o.number && (r = r.map(cs)));
  let l, c = s[l = Fn(t)] || // also try camelCase event handler (#2249)
  s[l = Fn(xe(t))];
  !c && i && (c = s[l = Fn(nt(t))]), c && Se(
    c,
    e,
    6,
    r
  );
  const d = s[l + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, Se(
      d,
      e,
      6,
      r
    );
  }
}
const Xo = /* @__PURE__ */ new WeakMap();
function ei(e, t, n = !1) {
  const s = n ? Xo : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let o = {}, l = !1;
  if (!P(e)) {
    const c = (d) => {
      const a = ei(d, t, !0);
      a && (l = !0, te(o, a));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !l ? (k(e) && s.set(e, null), null) : (I(i) ? i.forEach((c) => o[c] = null) : te(o, i), k(e) && s.set(e, o), o);
}
function Pn(e, t) {
  return !e || !xn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), F(e, t[0].toLowerCase() + t.slice(1)) || F(e, nt(t)) || F(e, t));
}
function Vs(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    propsOptions: [i],
    slots: o,
    attrs: l,
    emit: c,
    render: d,
    renderCache: a,
    props: h,
    data: S,
    setupState: C,
    ctx: D,
    inheritAttrs: M
  } = e, Y = gn(e);
  let W, N;
  try {
    if (n.shapeFlag & 4) {
      const A = r || s, Z = A;
      W = $e(
        d.call(
          Z,
          A,
          a,
          h,
          C,
          S,
          D
        )
      ), N = l;
    } else {
      const A = t;
      W = $e(
        A.length > 1 ? A(
          h,
          { attrs: l, slots: o, emit: c }
        ) : A(
          h,
          null
        )
      ), N = t.props ? l : Zo(l);
    }
  } catch (A) {
    at.length = 0, En(A, e, 1), W = We(Ge);
  }
  let j = W;
  if (N && M !== !1) {
    const A = Object.keys(N), { shapeFlag: Z } = j;
    A.length && Z & 7 && (i && A.some(wn) && (N = Qo(
      N,
      i
    )), j = yt(j, N, !1, !0));
  }
  if (n.dirs && (j = yt(j, null, !1, !0), j.dirs = j.dirs ? j.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const A = In(j.type) && qr(j) || j;
    ys(A, n.transition);
  }
  return W = j, gn(Y), W;
}
const Zo = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || xn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Qo = (e, t) => {
  const n = {};
  for (const s in e)
    (!wn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function el(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: o, children: l, patchFlag: c } = t, d = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Us(s, o, d) : !!o;
    if (c & 8) {
      const a = t.dynamicProps;
      for (let h = 0; h < a.length; h++) {
        const S = a[h];
        if (ti(o, s, S) && !Pn(d, S))
          return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : s === o ? !1 : s ? o ? Us(s, o, d) : !0 : !!o;
  return !1;
}
function Us(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (ti(t, e, i) && !Pn(n, i))
      return !0;
  }
  return !1;
}
function ti(e, t, n) {
  const s = e[n], r = t[n];
  return n === "style" && k(s) && k(r) ? !Tn(s, r) : s !== r;
}
function tl({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = s, e = r), r === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const ni = {}, si = () => Object.create(ni), ri = (e) => Object.getPrototypeOf(e) === ni;
function nl(e, t, n, s = !1) {
  const r = {}, i = si();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), ii(e, t, r, i);
  for (const o in e.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? e.props = s ? r : /* @__PURE__ */ oo(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function sl(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: o }
  } = e, l = /* @__PURE__ */ L(r), [c] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const a = e.vnode.dynamicProps;
      for (let h = 0; h < a.length; h++) {
        let S = a[h];
        if (Pn(e.emitsOptions, S))
          continue;
        const C = t[S];
        if (c)
          if (F(i, S))
            C !== i[S] && (i[S] = C, d = !0);
          else {
            const D = xe(S);
            r[D] = ss(
              c,
              l,
              D,
              C,
              e,
              !1
            );
          }
        else
          C !== i[S] && (i[S] = C, d = !0);
      }
    }
  } else {
    ii(e, t, r, i) && (d = !0);
    let a;
    for (const h in l)
      (!t || // for camelCase
      !F(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((a = nt(h)) === h || !F(t, a))) && (c ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[a] !== void 0) && (r[h] = ss(
        c,
        l,
        h,
        void 0,
        e,
        !0
      )) : delete r[h]);
    if (i !== l)
      for (const h in i)
        (!t || !F(t, h)) && (delete i[h], d = !0);
  }
  d && Ve(e.attrs, "set", "");
}
function ii(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let c in t) {
      if (Pt(c))
        continue;
      const d = t[c];
      let a;
      r && F(r, a = xe(c)) ? !i || !i.includes(a) ? n[a] = d : (l || (l = {}))[a] = d : Pn(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, o = !0);
    }
  if (i) {
    const c = /* @__PURE__ */ L(n), d = l || V;
    for (let a = 0; a < i.length; a++) {
      const h = i[a];
      n[h] = ss(
        r,
        c,
        h,
        d[h],
        e,
        !F(d, h)
      );
    }
  }
  return o;
}
function ss(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const l = F(o, "default");
    if (l && s === void 0) {
      const c = o.default;
      if (o.type !== Function && !o.skipFactory && P(c)) {
        const { propsDefaults: d } = r;
        if (n in d)
          s = d[n];
        else {
          const a = Jt(r);
          s = d[n] = c.call(
            null,
            t
          ), a();
        }
      } else
        s = c;
      r.ce && r.ce._setProp(n, s);
    }
    o[
      0
      /* shouldCast */
    ] && (i && !l ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === nt(n)) && (s = !0));
  }
  return s;
}
const rl = /* @__PURE__ */ new WeakMap();
function oi(e, t, n = !1) {
  const s = n ? rl : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, o = {}, l = [];
  let c = !1;
  if (!P(e)) {
    const a = (h) => {
      c = !0;
      const [S, C] = oi(h, t, !0);
      te(o, S), C && l.push(...C);
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  if (!i && !c)
    return k(e) && s.set(e, ft), ft;
  if (I(i))
    for (let a = 0; a < i.length; a++) {
      const h = xe(i[a]);
      Bs(h) && (o[h] = V);
    }
  else if (i)
    for (const a in i) {
      const h = xe(a);
      if (Bs(h)) {
        const S = i[a], C = o[h] = I(S) || P(S) ? { type: S } : te({}, S), D = C.type;
        let M = !1, Y = !0;
        if (I(D))
          for (let W = 0; W < D.length; ++W) {
            const N = D[W], j = P(N) && N.name;
            if (j === "Boolean") {
              M = !0;
              break;
            } else j === "String" && (Y = !1);
          }
        else
          M = P(D) && D.name === "Boolean";
        C[
          0
          /* shouldCast */
        ] = M, C[
          1
          /* shouldCastTrue */
        ] = Y, (M || F(C, "default")) && l.push(h);
      }
    }
  const d = [o, l];
  return k(e) && s.set(e, d), d;
}
function Bs(e) {
  return e[0] !== "$" && !Pt(e);
}
const vs = (e) => e === "_" || e === "_ctx" || e === "$stable", xs = (e) => I(e) ? e.map($e) : [$e(e)], il = (e, t, n) => {
  if (t._n)
    return t;
  const s = bo((...r) => xs(t(...r)), n);
  return s._c = !1, s;
}, li = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (vs(r)) continue;
    const i = e[r];
    if (P(i))
      t[r] = il(r, i, s);
    else if (i != null) {
      const o = xs(i);
      t[r] = () => o;
    }
  }
}, ci = (e, t) => {
  const n = xs(t);
  e.slots.default = () => n;
}, fi = (e, t, n) => {
  for (const s in t)
    (n || !vs(s)) && (e[s] = t[s]);
}, ol = (e, t, n) => {
  const s = e.slots = si();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (fi(s, t, n), n && br(s, "_", r, !0)) : li(t, s);
  } else t && ci(e, t);
}, ll = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, o = V;
  if (s.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? i = !1 : fi(r, t, n) : (i = !t.$stable, li(t, r)), o = t;
  } else t && (ci(e, t), o = { default: 1 });
  if (i)
    for (const l in r)
      !vs(l) && o[l] == null && delete r[l];
}, ue = dl;
function cl(e) {
  return fl(e);
}
function fl(e, t) {
  const n = Cn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: i,
    createElement: o,
    createText: l,
    createComment: c,
    setText: d,
    setElementText: a,
    parentNode: h,
    nextSibling: S,
    setScopeId: C = Le,
    insertStaticContent: D
  } = e, M = (f, u, p, y = null, g = null, _ = null, x = void 0, v = null, b = !!u.dynamicChildren) => {
    if (f === u)
      return;
    f && !Ct(f, u) && (y = Zt(f), be(f, g, _, !0), f = null), u.patchFlag === -2 && (b = !1, u.dynamicChildren = null), u.dynamicChildren && f && f.dynamicChildren && f.dynamicChildren.hasOnce && (u.dynamicChildren === ft && (u.dynamicChildren = []), u.dynamicChildren.hasOnce = !0);
    const { type: m, ref: O, shapeFlag: w } = u;
    switch (m) {
      case $n:
        Y(f, u, p, y);
        break;
      case Ge:
        W(f, u, p, y);
        break;
      case Bn:
        f == null && N(u, p, y, x);
        break;
      case ve:
        Yt(
          f,
          u,
          p,
          y,
          g,
          _,
          x,
          v,
          b
        );
        break;
      default:
        w & 1 ? Z(
          f,
          u,
          p,
          y,
          g,
          _,
          x,
          v,
          b
        ) : w & 6 ? zt(
          f,
          u,
          p,
          y,
          g,
          _,
          x,
          v,
          b
        ) : (w & 64 || w & 128) && m.process(
          f,
          u,
          p,
          y,
          g,
          _,
          x,
          v,
          b,
          xt
        );
    }
    O != null && g ? Lt(O, f && f.ref, _, u || f, !u) : O == null && f && f.ref != null && Lt(f.ref, null, _, f, !0);
  }, Y = (f, u, p, y) => {
    if (f == null)
      s(
        u.el = l(u.children),
        p,
        y
      );
    else {
      const g = u.el = f.el;
      u.children !== f.children && d(g, u.children);
    }
  }, W = (f, u, p, y) => {
    f == null ? s(
      u.el = c(u.children || ""),
      p,
      y
    ) : u.el = f.el;
  }, N = (f, u, p, y) => {
    [f.el, f.anchor] = D(
      f.children,
      u,
      p,
      y,
      f.el,
      f.anchor
    );
  }, j = ({ el: f, anchor: u }, p, y) => {
    let g;
    for (; f && f !== u; )
      g = S(f), s(f, p, y), f = g;
    s(u, p, y);
  }, A = ({ el: f, anchor: u }) => {
    let p;
    for (; f && f !== u; )
      p = S(f), r(f), f = p;
    r(u);
  }, Z = (f, u, p, y, g, _, x, v, b) => {
    if (u.type === "svg" ? x = "svg" : u.type === "math" && (x = "mathml"), f == null)
      Ce(
        u,
        p,
        y,
        g,
        _,
        x,
        v,
        b
      );
    else {
      const m = f.el && f.el._isVueCE ? f.el : null;
      try {
        m && m._beginPatch(), Gt(
          f,
          u,
          g,
          _,
          x,
          v,
          b
        );
      } finally {
        m && m._endPatch();
      }
    }
  }, Ce = (f, u, p, y, g, _, x, v) => {
    let b, m;
    const { props: O, shapeFlag: w, transition: T, dirs: E } = f;
    if (b = f.el = o(
      f.type,
      _,
      O && O.is,
      O
    ), w & 8 ? a(b, f.children) : w & 16 && ze(
      f.children,
      b,
      null,
      y,
      g,
      Un(f, _),
      x,
      v
    ), E && ot(f, null, y, "created"), Te(b, f, f.scopeId, x, y), O) {
      for (const K in O)
        K !== "value" && !Pt(K) && i(b, K, null, O[K], _, y);
      "value" in O && i(b, "value", null, O.value, _), (m = O.onVnodeBeforeMount) && Ie(m, y, f);
    }
    E && ot(f, null, y, "beforeMount");
    const R = ul(g, T);
    R && T.beforeEnter(b), s(b, u, p), ((m = O && O.onVnodeMounted) || R || E) && ue(() => {
      try {
        m && Ie(m, y, f), R && T.enter(b), E && ot(f, null, y, "mounted");
      } finally {
      }
    }, g);
  }, Te = (f, u, p, y, g) => {
    if (p && C(f, p), y)
      for (let _ = 0; _ < y.length; _++)
        C(f, y[_]);
    if (g) {
      let _ = g.subTree;
      if (u === _ || pi(_.type) && (_.ssContent === u || _.ssFallback === u)) {
        const x = g.vnode;
        Te(
          f,
          x,
          x.scopeId,
          x.slotScopeIds,
          g.parent
        );
      }
    }
  }, ze = (f, u, p, y, g, _, x, v, b = 0) => {
    for (let m = b; m < f.length; m++) {
      const O = f[m] = v ? Ke(f[m]) : $e(f[m]);
      M(
        null,
        O,
        u,
        p,
        y,
        g,
        _,
        x,
        v
      );
    }
  }, Gt = (f, u, p, y, g, _, x) => {
    const v = u.el = f.el;
    let { patchFlag: b, dynamicChildren: m, dirs: O } = u;
    b |= f.patchFlag & 16;
    const w = f.props || V, T = u.props || V;
    let E;
    if (p && lt(p, !1), (E = T.onVnodeBeforeUpdate) && Ie(E, p, u, f), O && ot(u, f, p, "beforeUpdate"), p && lt(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    m && (!f.dynamicChildren || f.dynamicChildren.length !== m.length) && (b = 0, x = !1, m = null), (w.innerHTML && T.innerHTML == null || w.textContent && T.textContent == null) && a(v, ""), m ? st(
      f.dynamicChildren,
      m,
      v,
      p,
      y,
      Un(u, g),
      _
    ) : x || U(
      f,
      u,
      v,
      null,
      p,
      y,
      Un(u, g),
      _,
      !1
    ), b > 0) {
      if (b & 16)
        bt(v, w, T, p, g);
      else if (b & 2 && w.class !== T.class && i(v, "class", null, T.class, g), b & 4 && i(v, "style", w.style, T.style, g), b & 8) {
        const R = u.dynamicProps;
        for (let K = 0; K < R.length; K++) {
          const H = R[K], z = w[H], Q = T[H];
          (Q !== z || H === "value") && i(v, H, z, Q, g, p);
        }
      }
      b & 1 && f.children !== u.children && a(v, u.children);
    } else !x && m == null && bt(v, w, T, p, g);
    ((E = T.onVnodeUpdated) || O) && ue(() => {
      E && Ie(E, p, u, f), O && ot(u, f, p, "updated");
    }, y);
  }, st = (f, u, p, y, g, _, x) => {
    for (let v = 0; v < u.length; v++) {
      const b = f[v], m = u[v], O = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        b.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (b.type === ve || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Ct(b, m) || // - In the case of a component, it could contain anything.
        b.shapeFlag & 198) ? h(b.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      M(
        b,
        m,
        O,
        null,
        y,
        g,
        _,
        x,
        !0
      );
    }
  }, bt = (f, u, p, y, g) => {
    if (u !== p) {
      if (u !== V)
        for (const _ in u)
          !Pt(_) && !(_ in p) && i(
            f,
            _,
            u[_],
            null,
            g,
            y
          );
      for (const _ in p) {
        if (Pt(_)) continue;
        const x = p[_], v = u[_];
        x !== v && _ !== "value" && i(f, _, v, x, g, y);
      }
      "value" in p && i(f, "value", u.value, p.value, g);
    }
  }, Yt = (f, u, p, y, g, _, x, v, b) => {
    const m = u.el = f ? f.el : l(""), O = u.anchor = f ? f.anchor : l("");
    let { patchFlag: w, dynamicChildren: T, slotScopeIds: E } = u;
    E && (v = v ? v.concat(E) : E), f == null ? (s(m, p, y), s(O, p, y), ze(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      u.children || [],
      p,
      O,
      g,
      _,
      x,
      v,
      b
    )) : w > 0 && w & 64 && T && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren && f.dynamicChildren.length === T.length ? (st(
      f.dynamicChildren,
      T,
      p,
      g,
      _,
      x,
      v
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || g && u === g.subTree) && ui(
      f,
      u,
      !0
      /* shallow */
    )) : U(
      f,
      u,
      p,
      O,
      g,
      _,
      x,
      v,
      b
    );
  }, zt = (f, u, p, y, g, _, x, v, b) => {
    u.slotScopeIds = v, f == null ? u.shapeFlag & 512 ? g.ctx.activate(
      u,
      p,
      y,
      x,
      b
    ) : Nn(
      u,
      p,
      y,
      g,
      _,
      x,
      b
    ) : ws(f, u, b);
  }, Nn = (f, u, p, y, g, _, x) => {
    const v = f.component = bl(
      f,
      y,
      g
    );
    if (bs(f) && (v.ctx.renderer = xt), xl(v, !1, x), v.asyncDep) {
      if (g && g.registerDep(v, re, x), !f.el) {
        const b = v.subTree = We(Ge);
        W(null, b, u, p), f.placeholder = b.el;
      }
    } else
      re(
        v,
        f,
        u,
        p,
        g,
        _,
        x
      );
  }, ws = (f, u, p) => {
    const y = u.component = f.component;
    if (el(f, u, p))
      if (y.asyncDep && !y.asyncResolved) {
        u.el = f.el, q(y, u, p);
        return;
      } else
        y.next = u, y.update();
    else
      u.el = f.el, y.vnode = u;
  }, re = (f, u, p, y, g, _, x) => {
    const v = () => {
      if (f.isMounted) {
        let { next: w, bu: T, u: E, parent: R, vnode: K } = f;
        {
          const Ae = ai(f);
          if (Ae) {
            w && (w.el = K.el, q(f, w, x)), Ae.asyncDep.then(() => {
              ue(() => {
                f.isUnmounted || m();
              }, g);
            });
            return;
          }
        }
        let H = w, z;
        lt(f, !1), w ? (w.el = K.el, q(f, w, x)) : w = K, T && fn(T), (z = w.props && w.props.onVnodeBeforeUpdate) && Ie(z, R, w, K), lt(f, !0);
        const Q = Vs(f), Oe = f.subTree;
        f.subTree = Q, M(
          Oe,
          Q,
          // parent may have changed if it's in a teleport
          h(Oe.el),
          // anchor may have changed if it's in a fragment
          Zt(Oe),
          f,
          g,
          _
        ), w.el = Q.el, H === null && tl(f, Q.el), E && ue(E, g), (z = w.props && w.props.onVnodeUpdated) && ue(
          () => Ie(z, R, w, K),
          g
        );
      } else {
        let w;
        const { el: T, props: E } = u, { bm: R, m: K, parent: H, root: z, type: Q } = f, Oe = Ft(u);
        lt(f, !1), R && fn(R), !Oe && (w = E && E.onVnodeBeforeMount) && Ie(w, H, u), lt(f, !0);
        {
          z.ce && z.ce._hasShadowRoot() && z.ce._injectChildStyle(
            Q,
            f.parent ? f.parent.type : void 0
          );
          const Ae = f.subTree = Vs(f);
          M(
            null,
            Ae,
            p,
            y,
            f,
            g,
            _
          ), u.el = Ae.el;
        }
        if (K && ue(K, g), !Oe && (w = E && E.onVnodeMounted)) {
          const Ae = u;
          ue(
            () => Ie(w, H, Ae),
            g
          );
        }
        (u.shapeFlag & 256 || H && Ft(H.vnode) && H.vnode.shapeFlag & 256) && f.a && ue(f.a, g), f.isMounted = !0, u = p = y = null;
      }
    };
    f.scope.on();
    const b = f.effect = new Sr(v);
    f.scope.off();
    const m = f.update = b.run.bind(b), O = f.job = b.runIfDirty.bind(b);
    O.i = f, O.id = f.uid, b.scheduler = () => _s(O), lt(f, !0), m();
  }, q = (f, u, p) => {
    u.component = f;
    const y = f.vnode.props;
    f.vnode = u, f.next = null, sl(f, u.props, y, p), ll(f, u.children, p), qe(), Ls(f), Je();
  }, U = (f, u, p, y, g, _, x, v, b = !1) => {
    const m = f && f.children, O = f ? f.shapeFlag : 0, w = u.children, { patchFlag: T, shapeFlag: E } = u;
    if (T > 0) {
      if (T & 128) {
        Xt(
          m,
          w,
          p,
          y,
          g,
          _,
          x,
          v,
          b
        );
        return;
      } else if (T & 256) {
        rt(
          m,
          w,
          p,
          y,
          g,
          _,
          x,
          v,
          b
        );
        return;
      }
    }
    E & 8 ? (O & 16 && vt(m, g, _), w !== m && a(p, w)) : O & 16 ? E & 16 ? Xt(
      m,
      w,
      p,
      y,
      g,
      _,
      x,
      v,
      b
    ) : vt(m, g, _, !0) : (O & 8 && a(p, ""), E & 16 && ze(
      w,
      p,
      y,
      g,
      _,
      x,
      v,
      b
    ));
  }, rt = (f, u, p, y, g, _, x, v, b) => {
    f = f || ft, u = u || ft;
    const m = f.length, O = u.length, w = Math.min(m, O);
    let T;
    for (T = 0; T < w; T++) {
      const E = u[T] = b ? Ke(u[T]) : $e(u[T]);
      M(
        f[T],
        E,
        p,
        null,
        g,
        _,
        x,
        v,
        b
      );
    }
    m > O ? vt(
      f,
      g,
      _,
      !0,
      !1,
      w
    ) : ze(
      u,
      p,
      y,
      g,
      _,
      x,
      v,
      b,
      w
    );
  }, Xt = (f, u, p, y, g, _, x, v, b) => {
    let m = 0;
    const O = u.length;
    let w = f.length - 1, T = O - 1;
    for (; m <= w && m <= T; ) {
      const E = f[m], R = u[m] = b ? Ke(u[m]) : $e(u[m]);
      if (Ct(E, R))
        M(
          E,
          R,
          p,
          null,
          g,
          _,
          x,
          v,
          b
        );
      else
        break;
      m++;
    }
    for (; m <= w && m <= T; ) {
      const E = f[w], R = u[T] = b ? Ke(u[T]) : $e(u[T]);
      if (Ct(E, R))
        M(
          E,
          R,
          p,
          null,
          g,
          _,
          x,
          v,
          b
        );
      else
        break;
      w--, T--;
    }
    if (m > w) {
      if (m <= T) {
        const E = T + 1, R = E < O ? u[E].el : y;
        for (; m <= T; )
          M(
            null,
            u[m] = b ? Ke(u[m]) : $e(u[m]),
            p,
            R,
            g,
            _,
            x,
            v,
            b
          ), m++;
      }
    } else if (m > T)
      for (; m <= w; )
        be(f[m], g, _, !0), m++;
    else {
      const E = m, R = m, K = /* @__PURE__ */ new Map();
      for (m = R; m <= T; m++) {
        const de = u[m] = b ? Ke(u[m]) : $e(u[m]);
        de.key != null && K.set(de.key, m);
      }
      let H, z = 0;
      const Q = T - R + 1;
      let Oe = !1, Ae = 0;
      const wt = new Array(Q);
      for (m = 0; m < Q; m++) wt[m] = 0;
      for (m = E; m <= w; m++) {
        const de = f[m];
        if (z >= Q) {
          be(de, g, _, !0);
          continue;
        }
        let Ee;
        if (de.key != null)
          Ee = K.get(de.key);
        else
          for (H = R; H <= T; H++)
            if (wt[H - R] === 0 && Ct(de, u[H])) {
              Ee = H;
              break;
            }
        Ee === void 0 ? be(de, g, _, !0) : (wt[Ee - R] = m + 1, Ee >= Ae ? Ae = Ee : Oe = !0, M(
          de,
          u[Ee],
          p,
          null,
          g,
          _,
          x,
          v,
          b
        ), z++);
      }
      const Ts = Oe ? al(wt) : ft;
      for (H = Ts.length - 1, m = Q - 1; m >= 0; m--) {
        const de = R + m, Ee = u[de], Os = u[de + 1], As = de + 1 < O ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Os.el || di(Os)
        ) : y;
        wt[m] === 0 ? M(
          null,
          Ee,
          p,
          As,
          g,
          _,
          x,
          v,
          b
        ) : Oe && (H < 0 || m !== Ts[H] ? it(Ee, p, As, 2) : H--);
      }
    }
  }, it = (f, u, p, y, g = null) => {
    const { el: _, type: x, transition: v, children: b, shapeFlag: m } = f;
    if (m & 6) {
      it(f.component.subTree, u, p, y);
      return;
    }
    if (m & 128) {
      f.suspense.move(u, p, y);
      return;
    }
    if (m & 64) {
      x.move(f, u, p, xt);
      return;
    }
    if (x === ve) {
      s(_, u, p);
      for (let w = 0; w < b.length; w++)
        it(b[w], u, p, y);
      s(f.anchor, u, p);
      return;
    }
    if (x === Bn) {
      j(f, u, p);
      return;
    }
    if (y !== 2 && m & 1 && v)
      if (y === 0)
        v.persisted && !_[Kn] ? s(_, u, p) : (v.beforeEnter(_), s(_, u, p), ue(() => v.enter(_), g));
      else {
        const { leave: w, delayLeave: T, afterLeave: E } = v, R = () => {
          f.ctx.isUnmounted ? r(_) : s(_, u, p);
        }, K = () => {
          const H = _._isLeaving || !!_[Kn];
          _._isLeaving && _[Kn](
            !0
            /* cancelled */
          ), v.persisted && !H ? R() : w(_, () => {
            R(), E && E();
          });
        };
        T ? T(_, R, K) : K();
      }
    else
      s(_, u, p);
  }, be = (f, u, p, y = !1, g = !1) => {
    const {
      type: _,
      props: x,
      ref: v,
      children: b,
      dynamicChildren: m,
      shapeFlag: O,
      patchFlag: w,
      dirs: T,
      cacheIndex: E,
      memo: R
    } = f;
    if ((w === -2 || m && m.hasOnce) && (g = !1), v != null && (qe(), Lt(v, null, p, f, !0), Je()), E != null && (!f.ctx || f.ctx === u) && (u.renderCache[E] = void 0), O & 256) {
      u.ctx.deactivate(f);
      return;
    }
    const K = O & 1 && T, H = !Ft(f);
    let z;
    if (H && (z = x && x.onVnodeBeforeUnmount) && Ie(z, u, f), O & 6)
      Ei(f.component, p, y);
    else {
      if (O & 128) {
        f.suspense.unmount(p, y);
        return;
      }
      K && ot(f, null, u, "beforeUnmount"), O & 64 ? f.type.remove(
        f,
        u,
        p,
        xt,
        y
      ) : m && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !m.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (_ !== ve || w > 0 && w & 64) ? vt(
        m,
        u,
        p,
        !1,
        !0
      ) : (_ === ve && w & 384 || !g && O & 16) && vt(b, u, p), y && Ss(f);
    }
    const Q = R != null && E == null;
    (H && (z = x && x.onVnodeUnmounted) || K || Q) && ue(() => {
      z && Ie(z, u, f), K && ot(f, null, u, "unmounted"), Q && (f.el = null);
    }, p);
  }, Ss = (f) => {
    const { type: u, el: p, anchor: y, transition: g } = f;
    if (u === ve) {
      Ai(p, y);
      return;
    }
    if (u === Bn) {
      A(f), g && !g.persisted && g.afterLeave && g.afterLeave();
      return;
    }
    const _ = () => {
      r(p), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (f.shapeFlag & 1 && g && !g.persisted) {
      const { leave: x, delayLeave: v } = g, b = () => x(p, _);
      v ? v(f.el, _, b) : b();
    } else
      _();
  }, Ai = (f, u) => {
    let p;
    for (; f !== u; )
      p = S(f), r(f), f = p;
    r(u);
  }, Ei = (f, u, p) => {
    const { bum: y, scope: g, job: _, subTree: x, um: v, m: b, a: m } = f;
    Ws(b), Ws(m), y && fn(y), g.stop(), _ ? (_.flags |= 8, be(x, f, u, p)) : f.vnode.el && x && (x.transition = f.vnode.transition, be(x, f, u, p)), v && ue(v, u), ue(() => {
      f.isUnmounted = !0;
    }, u);
  }, vt = (f, u, p, y = !1, g = !1, _ = 0) => {
    for (let x = _; x < f.length; x++)
      be(f[x], u, p, y, g);
  }, Zt = (f) => {
    if (f.shapeFlag & 6)
      return Zt(f.component.subTree);
    if (f.shapeFlag & 128)
      return f.suspense.next();
    const u = S(f.anchor || f.el), p = u && u[To];
    return p ? S(p) : u;
  };
  let Ln = !1;
  const Cs = (f, u, p) => {
    let y;
    f == null ? u._vnode && (be(u._vnode, null, null, !0), y = u._vnode.component) : M(
      u._vnode || null,
      f,
      u,
      null,
      null,
      null,
      p
    ), u._vnode = f, Ln || (Ln = !0, Ls(y), Kr(), Ln = !1);
  }, xt = {
    p: M,
    um: be,
    m: it,
    r: Ss,
    mt: Nn,
    mc: ze,
    pc: U,
    pbc: st,
    n: Zt,
    o: e
  };
  return {
    render: Cs,
    hydrate: void 0,
    createApp: Go(Cs)
  };
}
function Un({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function lt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ul(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ui(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (I(s) && I(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let l = r[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[i] = Ke(r[i]), l.el = o.el), !n && l.patchFlag !== -2 && ui(o, l)), l.type === $n && (l.patchFlag === -1 && (l = r[i] = Ke(l)), l.el = o.el), l.type === Ge && !l.el && (l.el = o.el);
    }
}
function al(e) {
  const t = e.slice(), n = [0];
  let s, r, i, o, l;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const d = e[s];
    if (d !== 0) {
      if (r = n[n.length - 1], e[r] < d) {
        t[s] = r, n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        l = i + o >> 1, e[n[l]] < d ? i = l + 1 : o = l;
      d < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; )
    n[i] = o, o = t[o];
  return n;
}
function ai(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : ai(t);
}
function Ws(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function di(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? di(t.subTree) : null;
}
const pi = (e) => e.__isSuspense;
function dl(e, t) {
  t && t.pendingBranch ? I(e) ? t.effects.push(...e) : t.effects.push(e) : yo(e);
}
const ve = /* @__PURE__ */ Symbol.for("v-fgt"), $n = /* @__PURE__ */ Symbol.for("v-txt"), Ge = /* @__PURE__ */ Symbol.for("v-cmt"), Bn = /* @__PURE__ */ Symbol.for("v-stc"), at = [];
let he = null;
function fe(e = !1) {
  at.push(he = e ? null : []);
}
function hi() {
  at.pop(), he = at[at.length - 1] || null;
}
let Vt = 1;
function qs(e, t = !1) {
  Vt += e, e < 0 && he && t && (he.hasOnce = !0);
}
function gi(e) {
  return e.dynamicChildren = Vt > 0 ? he || ft : null, hi(), Vt > 0 && he && he.push(e), e;
}
function pe(e, t, n, s, r, i) {
  return gi(
    X(
      e,
      t,
      n,
      s,
      r,
      i,
      !0
    )
  );
}
function pl(e, t, n, s, r) {
  return gi(
    We(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function mi(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Ct(e, t) {
  return e.type === t.type && e.key === t.key;
}
const _i = ({ key: e }) => e ?? null, an = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? G(e) || /* @__PURE__ */ se(e) || P(e) ? { i: me, r: e, k: t, f: !!n } : e : null);
function X(e, t = null, n = null, s = 0, r = null, i = e === ve ? 0 : 1, o = !1, l = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && _i(t),
    ref: t && an(t),
    scopeId: Ur,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: me
  };
  return l ? (yn(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= G(n) ? 8 : 16), Vt > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  he && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && he.push(c), c;
}
const We = hl;
function hl(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === Ho) && (e = Ge), mi(e)) {
    const l = yt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && yn(l, n), Vt > 0 && !i && he && (l.shapeFlag & 6 ? he[he.indexOf(e)] = l : he.push(l)), l.patchFlag = -2, l;
  }
  if (Tl(e) && (e = e.__vccOpts), t) {
    t = gl(t);
    let { class: l, style: c } = t;
    l && !G(l) && (t.class = jt(l)), k(c) && (/* @__PURE__ */ ms(c) && !I(c) && (c = te({}, c)), t.style = fs(c));
  }
  const o = G(e) ? 1 : pi(e) ? 128 : In(e) ? 64 : k(e) ? 4 : P(e) ? 2 : 0;
  return X(
    e,
    t,
    n,
    s,
    r,
    o,
    i,
    !0
  );
}
function gl(e) {
  return e ? /* @__PURE__ */ ms(e) || ri(e) ? te({}, e) : e : null;
}
function yt(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: o, children: l, transition: c } = e, d = t ? ml(r || {}, t) : r, a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && _i(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? I(i) ? i.concat(an(t)) : [i, an(t)] : an(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== ve ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: c,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && yt(e.ssContent),
    ssFallback: e.ssFallback && yt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return c && s && ys(
    a,
    c.clone(a)
  ), a;
}
function ht(e = " ", t = 0) {
  return We($n, null, e, t);
}
function nn(e = "", t = !1) {
  return t ? (fe(), pl(Ge, null, e)) : We(Ge, null, e);
}
function $e(e) {
  return e == null || typeof e == "boolean" ? We(Ge) : I(e) ? We(
    ve,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : mi(e) ? Ke(e) : We($n, null, String(e));
}
function Ke(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : yt(e);
}
function yn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (I(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), yn(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !ri(t) ? t._ctx = me : r === 3 && me && (me.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (P(t)) {
    if (s & 65) {
      yn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: me }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [ht(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function ml(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = jt([t.class, s.class]));
      else if (r === "style")
        t.style = fs([t.style, s.style]);
      else if (xn(r)) {
        const i = t[r], o = s[r];
        o && i !== o && !(I(i) && i.includes(o)) ? t[r] = i ? [].concat(i, o) : o : o == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !wn(r) && (t[r] = o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function Ie(e, t, n, s = null) {
  Se(e, t, 7, [
    n,
    s
  ]);
}
const _l = Qr();
let yl = 0;
function bl(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || _l, i = {
    uid: yl++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Ki(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: oi(s, r),
    emitsOptions: ei(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: V,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: V,
    data: V,
    props: V,
    attrs: V,
    slots: V,
    refs: V,
    setupState: V,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = zo.bind(null, i), e.ce && e.ce(i), i;
}
let ce = null;
const vl = () => ce || me;
let bn, Ut;
{
  const e = Cn(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
    };
  };
  bn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ce = n
  ), Ut = t(
    "__VUE_SSR_SETTERS__",
    (n) => Bt = n
  );
}
const Jt = (e) => {
  const t = ce;
  return bn(e), e.scope.on(), () => {
    e.scope.off(), bn(t);
  };
}, Js = () => {
  ce && ce.scope.off(), bn(null);
};
function yi(e) {
  return e.vnode.shapeFlag & 4;
}
let Bt = !1;
function xl(e, t = !1, n = !1) {
  t && Ut(t);
  const { props: s, children: r } = e.vnode, i = yi(e);
  nl(e, s, i, t), ol(e, r, n || t);
  const o = i ? wl(e, t) : void 0;
  return t && Ut(!1), o;
}
function wl(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ko);
  const { setup: s } = n;
  if (s) {
    qe();
    const r = e.setupContext = s.length > 1 ? Cl(e) : null, i = Jt(e), o = qt(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), l = gr(o);
    if (Je(), i(), (l || e.sp) && !Ft(e) && Jr(e), l) {
      if (o.then(Js, Js), t)
        return o.then((c) => {
          Ut(!0);
          try {
            Gs(e, c, t);
          } finally {
            Ut(!1);
          }
        }).catch((c) => {
          En(c, e, 0);
        });
      e.asyncDep = o;
    } else
      Gs(e, o);
  } else
    bi(e);
}
function Gs(e, t, n) {
  P(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = Dr(t)), bi(e);
}
function bi(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Le);
  {
    const r = Jt(e);
    qe();
    try {
      Vo(e);
    } finally {
      Je(), r();
    }
  }
}
const Sl = {
  get(e, t) {
    return ne(e, "get", ""), e[t];
  }
};
function Cl(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Sl),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Rn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Dr(lo(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Dt)
        return Dt[n](e);
    },
    has(t, n) {
      return n in t || n in Dt;
    }
  })) : e.proxy;
}
function Tl(e) {
  return P(e) && "__vccOpts" in e;
}
const Ol = (e, t) => /* @__PURE__ */ po(e, t, Bt), Al = "3.5.43";
/**
* @vue/runtime-dom v3.5.43
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let rs;
const Ys = typeof window < "u" && window.trustedTypes;
if (Ys)
  try {
    rs = /* @__PURE__ */ Ys.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const vi = rs ? (e) => rs.createHTML(e) : (e) => e, El = "http://www.w3.org/2000/svg", Il = "http://www.w3.org/1998/Math/MathML", ke = typeof document < "u" ? document : null, zs = ke && /* @__PURE__ */ ke.createElement("template"), Ml = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? ke.createElementNS(El, e) : t === "mathml" ? ke.createElementNS(Il, e) : n ? ke.createElement(e, { is: n }) : ke.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => ke.createTextNode(e),
  createComment: (e) => ke.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => ke.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, r, i) {
    const o = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      zs.innerHTML = vi(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const l = zs.content;
      if (s === "svg" || s === "mathml") {
        const c = l.firstChild;
        for (; c.firstChild; )
          l.appendChild(c.firstChild);
        l.removeChild(c);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Pl = /* @__PURE__ */ Symbol("_vtc");
function $l(e, t, n) {
  const s = e[Pl];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Xs = /* @__PURE__ */ Symbol("_vod"), Rl = /* @__PURE__ */ Symbol("_vsh"), Nl = /* @__PURE__ */ Symbol(""), Ll = /(?:^|;)\s*display\s*:/;
function Fl(e, t, n) {
  const s = e.style, r = G(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (G(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && Mt(s, l, "");
        }
      else
        for (const o in t)
          n[o] == null && Mt(s, o, "");
    for (const o in n) {
      o === "display" && (i = !0);
      const l = n[o];
      l != null ? jl(
        e,
        o,
        !G(t) && t ? t[o] : void 0,
        l
      ) || Mt(s, o, l) : Mt(s, o, "");
    }
  } else if (r) {
    if (t !== n) {
      const o = s[Nl];
      o && (n += ";" + o), s.cssText = n, i = Ll.test(n);
    }
  } else t && e.removeAttribute("style");
  Xs in e && (e[Xs] = i ? s.display : "", e[Rl] && (s.display = "none"));
}
const sn = /\s*!important$/;
function Mt(e, t, n) {
  if (I(n))
    n.forEach((s) => Mt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    sn.test(n) ? e.setProperty(t, n.replace(sn, ""), "important") : e.setProperty(t, n);
  else {
    const s = Dl(e, t);
    sn.test(n) ? e.setProperty(
      nt(s),
      n.replace(sn, ""),
      "important"
    ) : e[s] = n;
  }
}
const Zs = ["Webkit", "Moz", "ms"], Wn = {};
function Dl(e, t) {
  const n = Wn[t];
  if (n)
    return n;
  let s = xe(t);
  if (s !== "filter" && s in e)
    return Wn[t] = s;
  s = yr(s);
  for (let r = 0; r < Zs.length; r++) {
    const i = Zs[r] + s;
    if (i in e)
      return Wn[t] = i;
  }
  return t;
}
function jl(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && G(s) && n === s;
}
const Qs = "http://www.w3.org/1999/xlink";
function er(e, t, n, s, r, i = ji(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Qs, t.slice(6, t.length)) : e.setAttributeNS(Qs, t, n) : n == null || i && !vr(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : Fe(n) ? String(n) : n
  );
}
function tr(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? vi(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value, c = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== c || !("_value" in e)) && (e.value = c), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = vr(n) : n == null && l === "string" ? (n = "", o = !0) : l === "number" && (n = 0, o = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  o && e.removeAttribute(r || t);
}
function gt(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Hl(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const nr = /* @__PURE__ */ Symbol("_vei");
function kl(e, t, n, s, r = null) {
  const i = e[nr] || (e[nr] = {}), o = i[t];
  if (s && o)
    o.value = s;
  else {
    const [l, c] = Ul(t);
    if (s) {
      const d = i[t] = ql(
        s,
        r
      );
      gt(e, l, d, c);
    } else o && (Hl(e, l, o, c), i[t] = void 0);
  }
}
const Kl = /(Once|Passive|Capture)$/, Vl = /^on:?(?:Once|Passive|Capture)$/;
function Ul(e) {
  let t, n;
  for (; (n = e.match(Kl)) && !Vl.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : nt(e.slice(2)), t];
}
let qn = 0;
const Bl = /* @__PURE__ */ Promise.resolve(), Wl = () => qn || (Bl.then(() => qn = 0), qn = Date.now());
function ql(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const r = n.value;
    if (I(r)) {
      const i = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        i.call(s), s._stopped = !0;
      };
      const o = r.slice(), l = [s];
      for (let c = 0; c < o.length && !s._stopped; c++) {
        const d = o[c];
        d && Se(
          d,
          t,
          5,
          l
        );
      }
    } else
      Se(
        r,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Wl(), n;
}
const sr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Jl = (e, t, n, s, r, i) => {
  const o = r === "svg";
  t === "class" ? $l(e, s, o) : t === "style" ? Fl(e, n, s) : xn(t) ? wn(t) || kl(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Gl(e, t, s, o)) ? (tr(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && er(e, t, s, o, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Yl(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !G(s))) ? tr(e, xe(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), er(e, t, s, o));
};
function Gl(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && sr(t) && P(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return sr(t) && G(n) ? !1 : t in e;
}
function Yl(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = xe(t);
  return Array.isArray(n) ? n.some((r) => xe(r) === s) : Object.keys(n).some((r) => xe(r) === s);
}
const rr = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return I(t) ? (n) => fn(t, n) : t;
};
function zl(e) {
  e.target.composing = !0;
}
function ir(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const rn = /* @__PURE__ */ Symbol("_assign"), on = /* @__PURE__ */ Symbol("_initialValue");
function Jn(e, t, n) {
  return t && (e = e.trim()), n && (e = cs(e)), e;
}
const Xl = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, r) {
    e.parentNode && (e.type === "text" ? e[on] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[on] = e.defaultValue.replace(/\r\n?/g, `
`))), e[rn] = rr(r);
    const i = s || r.props && r.props.type === "number";
    gt(e, t ? "change" : "input", (o) => {
      o.target.composing || e[rn](Jn(e.value, n, i));
    }), (n || i) && gt(e, "change", () => {
      e.value = Jn(e.value, n, i);
    }), t || (gt(e, "compositionstart", zl), gt(e, "compositionend", ir), gt(e, "change", ir));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: s } }) {
    const r = t ?? "", i = e[on];
    delete e[on], i !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== i ? e[rn](Jn(e.value, n, s)) : e.value = r;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: r, number: i } }, o) {
    if (e[rn] = rr(o), e.composing) return;
    const l = (i || e.type === "number") && !/^0\d/.test(e.value) ? cs(e.value) : e.value, c = t ?? "";
    if (l === c)
      return;
    const d = e.getRootNode();
    (d instanceof Document || d instanceof ShadowRoot) && d.activeElement === e && e.type !== "range" && (s && t === n || r && e.value.trim() === c) || (e.value = c);
  }
}, Zl = ["ctrl", "shift", "alt", "meta"], Ql = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => Zl.some((n) => e[`${n}Key`] && !t.includes(n))
}, ec = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((r, ...i) => {
    for (let o = 0; o < t.length; o++) {
      const l = Ql[t[o]];
      if (l && l(r, t)) return;
    }
    return e(r, ...i);
  }));
}, tc = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, nc = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = ((r) => {
    if (!("key" in r))
      return;
    const i = nt(r.key);
    if (t.some(
      (o) => o === i || tc[o] === i
    ))
      return e(r);
  }));
}, sc = /* @__PURE__ */ te({ patchProp: Jl }, Ml);
let or;
function rc() {
  return or || (or = cl(sc));
}
const ic = ((...e) => {
  const t = rc().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = lc(s);
    if (!r) return;
    const i = t._component;
    !P(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, oc(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, t;
});
function oc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function lc(e) {
  return G(e) ? document.querySelector(e) : e;
}
async function* cc(e) {
  const t = e.getReader(), n = new TextDecoder();
  let s = "";
  for (; ; ) {
    const { value: r, done: i } = await t.read();
    s += n.decode(r, { stream: !i });
    const o = s.split(`
`);
    s = o.pop() ?? "";
    for (const l of o)
      l.trim() && (yield JSON.parse(l));
    if (i) break;
  }
  s.trim() && (yield JSON.parse(s));
}
async function* fc(e) {
  const t = await Be.fetchApi("/comfy-open-agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok || !t.body) {
    let n = `HTTP ${t.status}`;
    try {
      n = (await t.json()).error ?? n;
    } catch {
    }
    yield { type: "error", message: n };
    return;
  }
  yield* cc(t.body);
}
async function xi(e, t) {
  await Be.fetchApi(e, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
}
const uc = (e) => xi("/comfy-open-agent/chat/stop", { conversation_id: e }), ac = (e) => xi("/comfy-open-agent/chat/reset", { conversation_id: e }), dc = "Open Agent", pc = "Open Agent: build and edit workflows by chatting", hc = "Hi! Describe the workflow you want, or ask me to change, run or debug the one on the canvas.", gc = "Describe what you want… (Enter to send, Shift+Enter for a new line)", mc = "Send", _c = "Stop", yc = "New chat", bc = "Working…", vc = "Request failed: {message}", xc = "Model settings: Settings → Open Agent", wi = {
  title: dc,
  tooltip: pc,
  welcome: hc,
  placeholder: gc,
  send: mc,
  stop: _c,
  newChat: yc,
  working: bc,
  requestFailed: vc,
  settingsHint: xc
}, wc = "Open Agent", Sc = "Open Agent：通过对话搭建和修改工作流", Cc = "你好！描述你想要的工作流，或者让我修改、运行、调试画布上的工作流。", Tc = "描述你想做什么…（Enter 发送，Shift+Enter 换行）", Oc = "发送", Ac = "停止", Ec = "新对话", Ic = "处理中…", Mc = "请求失败：{message}", Pc = "模型设置：设置 → Open Agent", $c = {
  title: wc,
  tooltip: Sc,
  welcome: Cc,
  placeholder: Tc,
  send: Oc,
  stop: Ac,
  newChat: Ec,
  working: Ic,
  requestFailed: Mc,
  settingsHint: Pc
}, Rc = { en: wi, zh: $c };
function Nc() {
  var n;
  const e = (n = et.extensionManager) == null ? void 0 : n.setting.get("Comfy.Locale");
  return (typeof e == "string" ? e : navigator.language).toLowerCase().startsWith("zh") ? "zh" : "en";
}
function ge(e, t = {}) {
  return (Rc[Nc()][e] ?? wi[e]).replace(/\{(\w+)\}/g, (s, r) => t[r] ?? "");
}
const Ne = {
  provider: "OpenAgent.Provider",
  model: "OpenAgent.Model",
  baseUrl: "OpenAgent.BaseURL",
  apiKey: "OpenAgent.APIKey",
  maxSteps: "OpenAgent.MaxSteps"
}, Lc = ["local", "openai", "anthropic"], Tt = "Open Agent", Fc = [
  {
    id: Ne.provider,
    category: [Tt, "Model", "Provider"],
    name: "LLM provider",
    tooltip: "local = any OpenAI-compatible server (Ollama, LM Studio, vLLM...), openai = OpenAI API, anthropic = Claude API",
    type: "combo",
    options: [...Lc],
    defaultValue: "local"
  },
  {
    id: Ne.model,
    category: [Tt, "Model", "Model"],
    name: "Model name",
    tooltip: "Leave empty for the provider default (local: qwen3, openai: gpt-5, anthropic: claude-opus-5-5). Local models must support tool calling.",
    type: "text",
    defaultValue: ""
  },
  {
    id: Ne.baseUrl,
    category: [Tt, "Model", "Base URL"],
    name: "API base URL",
    tooltip: "Leave empty for the provider default (local: http://localhost:11434/v1).",
    type: "text",
    defaultValue: ""
  },
  {
    id: Ne.apiKey,
    category: [Tt, "Model", "API key"],
    name: "API key",
    tooltip: "Not needed for local servers. If empty, the ComfyUI server falls back to OPENAI_API_KEY / ANTHROPIC_API_KEY.",
    type: "text",
    defaultValue: "",
    attrs: { type: "password" }
  },
  {
    id: Ne.maxSteps,
    category: [Tt, "Agent", "Max steps"],
    name: "Max tool steps per message",
    type: "number",
    defaultValue: 30,
    attrs: { min: 1, max: 100, step: 1 }
  }
];
function Ot(e, t) {
  const n = et.extensionManager.setting.get(e);
  return n ?? t;
}
function Dc() {
  return {
    provider: Ot(Ne.provider, "local"),
    model: Ot(Ne.model, ""),
    base_url: Ot(Ne.baseUrl, ""),
    api_key: Ot(Ne.apiKey, ""),
    max_steps: Number(Ot(Ne.maxSteps, 30)) || 30
  };
}
const Si = "comfy-open-agent.chat", jc = 200;
function Hc() {
  try {
    const e = localStorage.getItem(Si);
    if (e) {
      const t = JSON.parse(e);
      return {
        items: (t.items ?? []).map(
          (n) => n.kind === "tool" && n.step.status === "running" ? { ...n, step: { ...n.step, status: "error" } } : n
        ),
        conversationId: t.conversationId,
        model: t.model,
        running: !1
      };
    }
  } catch {
  }
  return { items: [], running: !1 };
}
const $ = /* @__PURE__ */ An(Hc());
Nt(
  () => [$.items.length, $.conversationId, $.running],
  () => {
    try {
      localStorage.setItem(
        Si,
        JSON.stringify({
          items: $.items.slice(-jc),
          conversationId: $.conversationId,
          model: $.model
        })
      );
    } catch {
    }
  }
);
function kc(e) {
  for (let t = $.items.length - 1; t >= 0; t--) {
    const n = $.items[t];
    if (n.kind === "tool" && n.step.id === e) return n.step;
  }
}
function lr(e) {
  switch (e.type) {
    case "start":
      $.conversationId = e.conversation_id, $.model = `${e.provider} · ${e.model}`;
      break;
    case "text":
      $.items.push({ kind: "assistant", text: e.text });
      break;
    case "tool_call":
      $.items.push({
        kind: "tool",
        step: { id: e.id, name: e.name, arguments: e.arguments, status: "running" }
      });
      break;
    case "tool_result": {
      const t = kc(e.id);
      t && (t.status = e.ok ? "ok" : "error", t.summary = e.summary);
      break;
    }
    case "notice":
      $.items.push({ kind: "notice", text: e.message });
      break;
    case "error":
      $.items.push({ kind: "notice", text: e.message, error: !0 });
      break;
  }
}
async function Kc(e) {
  const t = e.trim();
  if (!(!t || $.running)) {
    $.items.push({ kind: "user", text: t }), $.running = !0;
    try {
      for await (const n of fc({
        ...Dc(),
        message: t,
        conversation_id: $.conversationId,
        client_id: Be.clientId
      }))
        lr(n);
    } catch (n) {
      lr({ type: "error", message: ge("requestFailed", { message: String(n) }) });
    } finally {
      $.running = !1;
    }
  }
}
async function cr() {
  $.conversationId && await uc($.conversationId);
}
async function fr() {
  if ($.running) return;
  const e = $.conversationId;
  $.items = [], $.conversationId = void 0, e && await ac(e).catch(() => {
  });
}
const Vc = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Ci(e) {
  return e.replace(/[&<>"']/g, (t) => Vc[t]);
}
function Uc(e) {
  return Ci(e).replace(/`([^`\n]+)`/g, "<code>$1</code>").replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
}
function Bc(e) {
  return e.split(/```[^\n]*\n?/).map(
    (t, n) => n % 2 === 1 ? `<pre><code>${Ci(t.replace(/\n$/, ""))}</code></pre>` : Uc(t)
  ).join("");
}
const Wc = { class: "coa-panel" }, qc = { class: "coa-header" }, Jc = { class: "coa-heading" }, Gc = { class: "coa-title" }, Yc = {
  key: 0,
  class: "coa-model"
}, zc = ["disabled", "title"], Xc = {
  key: 0,
  class: "coa-empty"
}, Zc = {
  key: 0,
  class: "coa-bubble coa-user"
}, Qc = ["innerHTML"], ef = {
  key: 2,
  class: "coa-tool"
}, tf = { class: "coa-tool-name" }, nf = { class: "coa-tool-args" }, sf = { key: 0 }, rf = {
  key: 1,
  class: "coa-working"
}, of = ["placeholder"], lf = ["disabled"], cf = /* @__PURE__ */ Ao({
  __name: "AgentChatPanel",
  setup(e) {
    const t = /* @__PURE__ */ Ns(""), n = /* @__PURE__ */ Ns();
    function s() {
      const c = t.value;
      !c.trim() || $.running || (t.value = "", Kc(c));
    }
    function r(c) {
      c.shiftKey || c.isComposing || (c.preventDefault(), s());
    }
    function i(c) {
      return c === "running" ? "pi pi-spin pi-spinner" : c === "ok" ? "pi pi-check coa-ok" : "pi pi-times coa-fail";
    }
    function o(c) {
      const d = JSON.stringify(c);
      return !d || d === "{}" ? "" : d.length > 60 ? `${d.slice(0, 60)}…` : d;
    }
    function l() {
      Hr(() => {
        n.value && (n.value.scrollTop = n.value.scrollHeight);
      });
    }
    return Nt(() => [$.items.length, $.running], l), Yr(l), (c, d) => (fe(), pe("div", Wc, [
      X("header", qc, [
        X("div", Jc, [
          X("span", Gc, ie(J(ge)("title")), 1),
          J($).model ? (fe(), pe("span", Yc, ie(J($).model), 1)) : nn("", !0)
        ]),
        X("button", {
          class: "coa-button coa-ghost",
          disabled: J($).running,
          title: J(ge)("newChat"),
          onClick: d[0] || (d[0] = //@ts-ignore
          (...a) => J(fr) && J(fr)(...a))
        }, [
          d[3] || (d[3] = X("i", { class: "pi pi-plus" }, null, -1)),
          ht(" " + ie(J(ge)("newChat")), 1)
        ], 8, zc)
      ]),
      X("div", {
        ref_key: "scroller",
        ref: n,
        class: "coa-messages"
      }, [
        J($).items.length === 0 ? (fe(), pe("p", Xc, [
          ht(ie(J(ge)("welcome")), 1),
          d[4] || (d[4] = X("br", null, null, -1)),
          X("small", null, ie(J(ge)("settingsHint")), 1)
        ])) : nn("", !0),
        (fe(!0), pe(ve, null, ko(J($).items, (a, h) => (fe(), pe(ve, { key: h }, [
          a.kind === "user" ? (fe(), pe("div", Zc, ie(a.text), 1)) : a.kind === "assistant" ? (fe(), pe("div", {
            key: 1,
            class: "coa-bubble coa-assistant",
            innerHTML: J(Bc)(a.text)
          }, null, 8, Qc)) : a.kind === "tool" ? (fe(), pe("details", ef, [
            X("summary", null, [
              X("i", {
                class: jt(i(a.step.status))
              }, null, 2),
              X("span", tf, ie(a.step.name), 1),
              X("span", nf, ie(o(a.step.arguments)), 1)
            ]),
            X("pre", null, ie(JSON.stringify(a.step.arguments, null, 2)), 1),
            a.step.summary ? (fe(), pe("pre", sf, ie(a.step.summary), 1)) : nn("", !0)
          ])) : (fe(), pe("div", {
            key: 3,
            class: jt(["coa-notice", a.error && "coa-error"])
          }, ie(a.text), 3))
        ], 64))), 128)),
        J($).running ? (fe(), pe("div", rf, [
          d[5] || (d[5] = X("i", { class: "pi pi-spin pi-spinner" }, null, -1)),
          ht(" " + ie(J(ge)("working")), 1)
        ])) : nn("", !0)
      ], 512),
      X("form", {
        class: "coa-input",
        onSubmit: ec(s, ["prevent"])
      }, [
        vo(X("textarea", {
          "onUpdate:modelValue": d[1] || (d[1] = (a) => t.value = a),
          rows: "3",
          placeholder: J(ge)("placeholder"),
          onKeydown: nc(r, ["enter"])
        }, null, 40, of), [
          [Xl, t.value]
        ]),
        J($).running ? (fe(), pe("button", {
          key: 0,
          type: "button",
          class: "coa-button coa-stop",
          onClick: d[2] || (d[2] = //@ts-ignore
          (...a) => J(cr) && J(cr)(...a))
        }, [
          d[6] || (d[6] = X("i", { class: "pi pi-stop-circle" }, null, -1)),
          ht(" " + ie(J(ge)("stop")), 1)
        ])) : (fe(), pe("button", {
          key: 1,
          type: "submit",
          class: "coa-button",
          disabled: !t.value.trim()
        }, [
          d[7] || (d[7] = X("i", { class: "pi pi-send" }, null, -1)),
          ht(" " + ie(J(ge)("send")), 1)
        ], 8, lf))
      ], 32)
    ]));
  }
}), ff = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, uf = /* @__PURE__ */ ff(cf, [["__scopeId", "data-v-fd82d059"]]), ur = 500, af = 60, ar = { 2: "muted", 4: "bypassed" };
class Ti extends Error {
}
function ae(e) {
  throw new Ti(e);
}
function ln(e, t) {
  return (e === null || typeof e != "object" || Array.isArray(e)) && ae(`${t} must be an object`), e;
}
function df(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.trim() !== "") {
    const t = e.trim();
    return /^\d+$/.test(t) ? Number(t) : t;
  }
  ae("node id is required");
}
function At(e, t) {
  const n = df(t), s = e.getNodeById(n);
  return s || ae(`Node ${String(n)} not found. Call get_canvas for current ids.`), s;
}
function pf(e, t) {
  if (e.getLink) return e.getLink(t);
  const n = e.links;
  return n instanceof Map ? n.get(t) : n[t];
}
function hf(e, t, n) {
  if (t.getInputLink) return t.getInputLink(n);
  const s = t.inputs[n].link;
  return s == null ? void 0 : pf(e, s);
}
function gf(e, t) {
  var n, s;
  return e.getOutputNodes ? ((n = e.getOutputNodes(t)) == null ? void 0 : n.length) ?? 0 : ((s = e.outputs[t].links) == null ? void 0 : s.length) ?? 0;
}
function Gn(e, t, n, s) {
  const r = String(t ?? "").trim(), i = () => e.map((d, a) => `${a}:${d.name}(${String(d.type)})`).join(", ") || "none";
  if (/^\d+$/.test(r)) {
    const d = Number(r);
    if (d < e.length) return d;
    ae(`${s.type} #${s.id} has no ${n} ${d}. ${n}s: ${i()}`);
  }
  const o = e.findIndex((d) => d.name === r);
  if (o !== -1) return o;
  const l = r.toLowerCase(), c = e.findIndex(
    (d) => d.name.toLowerCase() === l || String(d.type).toLowerCase() === l
  );
  if (c !== -1) return c;
  ae(`${s.type} #${s.id} has no ${n} '${r}'. ${n}s: ${i()}`);
}
function vn(e) {
  return Math.round(e);
}
function mf(e) {
  return typeof e == "string" && e.length > ur ? `${e.slice(0, ur)}… (${e.length} chars)` : e;
}
function _f(e, t) {
  const n = {};
  for (const i of t.widgets ?? [])
    !i.name || i.type === "button" || i.value === void 0 || typeof i.value == "object" && i.value !== null || (n[i.name] = mf(i.value));
  const s = t.inputs.map((i, o) => {
    const l = {
      name: i.name,
      type: i.type
    }, c = hf(e, t, o);
    return c && (l.from = { node: c.origin_id, output: c.origin_slot }), l;
  }), r = {
    id: t.id,
    type: t.type,
    pos: [vn(t.pos[0]), vn(t.pos[1])],
    inputs: s,
    outputs: t.outputs.map((i, o) => ({
      index: o,
      name: i.name,
      type: i.type,
      links: gf(t, o)
    })),
    widgets: n
  };
  return t.title && t.title !== t.type && (r.title = t.title), ar[t.mode] && (r.mode = ar[t.mode]), r;
}
function yf(e) {
  if (e.nodes.length === 0) return [100, 100];
  let t = -1 / 0, n = 1 / 0;
  for (const s of e.nodes)
    t = Math.max(t, s.pos[0] + s.size[0]), n = Math.min(n, s.pos[1]);
  return [vn(t + af), vn(n)];
}
function dr(e, t) {
  var r, i, o, l;
  const n = [], s = [];
  for (const [c, d] of Object.entries(t)) {
    const a = (r = e.widgets) == null ? void 0 : r.find((S) => S.name === c);
    if (!a) {
      const S = ((i = e.widgets) == null ? void 0 : i.map((C) => C.name).join(", ")) || "none";
      s.push(`no widget '${c}' (widgets: ${S})`);
      continue;
    }
    const h = (o = a.options) == null ? void 0 : o.values;
    if (Array.isArray(h) && !h.includes(d)) {
      const S = h.slice(0, 15).map(String).join(", ");
      s.push(
        `'${String(d)}' is not an option for ${c}. Options: ${S}${h.length > 15 ? ", …" : ""}`
      );
      continue;
    }
    a.value = d, (l = a.callback) == null || l.call(a, d, void 0, e), n.push(c);
  }
  return { applied: n, errors: s };
}
function Et(e) {
  e.setDirtyCanvas(!0, !0);
}
const bf = {
  get_canvas(e) {
    const t = e.graph();
    return {
      node_count: t.nodes.length,
      nodes: t.nodes.map((n) => _f(t, n))
    };
  },
  async load_workflow(e, t) {
    const n = ln(t.workflow, "workflow"), s = Object.entries(n);
    s.length === 0 && ae("workflow is empty");
    for (const [i, o] of s) {
      const l = ln(o, `node ${i}`).class_type;
      typeof l != "string" && ae(`node ${i} has no class_type`), e.hasNodeType(l) || ae(`node ${i}: unknown node type '${l}'. Use search_nodes.`);
    }
    await e.loadApiJson(n);
    const r = e.graph();
    return {
      loaded: r.nodes.length,
      nodes: r.nodes.map((i) => ({ id: i.id, type: i.type }))
    };
  },
  add_node(e, t) {
    var l;
    const n = String(t.node_type ?? "");
    n || ae("node_type is required");
    const s = e.graph(), r = e.createNode(n);
    r || ae(`Unknown node type '${n}'. Use search_nodes.`);
    const i = Array.isArray(t.pos) && t.pos.length === 2 ? [Number(t.pos[0]), Number(t.pos[1])] : yf(s);
    r.pos[0] = i[0], r.pos[1] = i[1], typeof t.title == "string" && t.title && (r.title = t.title), s.add(r);
    const o = {
      node_id: r.id,
      inputs: r.inputs.map((c) => `${c.name} (${String(c.type)})`),
      outputs: r.outputs.map((c, d) => `${d}:${c.name} (${String(c.type)})`),
      widgets: ((l = r.widgets) == null ? void 0 : l.map((c) => c.name)) ?? []
    };
    if (t.widgets) {
      const { errors: c } = dr(r, ln(t.widgets, "widgets"));
      c.length && (o.widget_errors = c);
    }
    return Et(s), o;
  },
  remove_node(e, t) {
    const n = e.graph(), s = At(n, t.node_id);
    return n.remove(s), Et(n), { removed: s.id };
  },
  connect(e, t) {
    const n = e.graph(), s = At(n, t.from_node), r = At(n, t.to_node), i = Gn(s.outputs, t.from_output, "output", s), o = Gn(r.inputs, t.to_input, "input", r);
    return s.connect(i, r, o) || ae(
      `Cannot connect ${s.type}.${s.outputs[i].name} (${String(s.outputs[i].type)}) to ${r.type}.${r.inputs[o].name} (${String(r.inputs[o].type)}): incompatible types`
    ), Et(n), {
      connected: `${s.id}:${s.outputs[i].name} -> ${r.id}:${r.inputs[o].name}`
    };
  },
  disconnect(e, t) {
    const n = e.graph(), s = At(n, t.node_id), r = Gn(s.inputs, t.input, "input", s), i = s.disconnectInput(r);
    return Et(n), { disconnected: i, input: s.inputs[r].name };
  },
  set_widgets(e, t) {
    const n = e.graph(), s = At(n, t.node_id), { applied: r, errors: i } = dr(s, ln(t.values, "values"));
    return Et(n), r.length === 0 && i.length && ae(i.join("; ")), i.length ? { applied: r, errors: i } : { applied: r };
  },
  async queue_workflow(e) {
    return e.graph().nodes.length === 0 && ae("The canvas is empty"), e.queue();
  }
};
async function vf(e, t, n) {
  const s = bf[t];
  return s || ae(`Unknown canvas operation '${t}'`), s(e, n ?? {});
}
const xf = "comfy-open-agent.tool_call", wf = "/comfy-open-agent/bridge/register", Sf = "/comfy-open-agent/bridge/result";
function Cf() {
  return et.rootGraph ?? et.graph;
}
async function Tf() {
  var t, n;
  const e = await et.graphToPrompt();
  try {
    const s = await Be.queuePrompt(0, e);
    return { queued: !0, prompt_id: s.prompt_id, number: s.number };
  } catch (s) {
    const r = s.response;
    if (!r) throw s;
    return {
      queued: !1,
      error: (typeof r.error == "string" ? r.error : [(t = r.error) == null ? void 0 : t.message, (n = r.error) == null ? void 0 : n.details].filter(Boolean).join(": ")) || "Prompt validation failed",
      node_errors: r.node_errors
    };
  }
}
const Of = {
  graph: Cf,
  createNode: (e) => {
    var t;
    return ((t = window.LiteGraph) == null ? void 0 : t.createNode(e)) ?? null;
  },
  hasNodeType: (e) => {
    var t;
    return !!((t = window.LiteGraph) != null && t.registered_node_types[e]);
  },
  loadApiJson: (e) => et.loadApiJson(e, "agent-workflow"),
  queue: Tf
};
async function Oi(e, t) {
  return Be.fetchApi(e, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
}
async function Af(e) {
  let t;
  try {
    const n = await vf(Of, e.op, e.args);
    t = { call_id: e.call_id, ok: !0, result: n };
  } catch (n) {
    const s = n instanceof Ti;
    s || console.error("[comfy-open-agent] canvas operation failed", n), t = {
      call_id: e.call_id,
      ok: !1,
      error: s ? n.message : `Unexpected error: ${String(n)}`
    };
  }
  await Oi(Sf, t);
}
let pr;
async function cn(e = !1) {
  const t = Be.clientId;
  if (!(!t || !e && t === pr)) {
    pr = t;
    try {
      await Oi(wf, { client_id: t });
    } catch (n) {
      console.warn("[comfy-open-agent] bridge registration failed", n);
    }
  }
}
function Ef() {
  Be.addEventListener(xf, (e) => {
    Af(e.detail);
  }), Be.addEventListener("status", () => void cn()), Be.addEventListener("reconnected", () => void cn(!0)), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "visible" && cn(!0);
  }), cn();
}
let He = null;
et.registerExtension({
  name: "comfy-open-agent",
  settings: Fc,
  setup() {
    Ef(), et.extensionManager.registerSidebarTab({
      id: "comfy-open-agent",
      title: ge("title"),
      icon: "pi pi-comments",
      tooltip: ge("tooltip"),
      type: "custom",
      render(e) {
        He == null || He.unmount(), Object.assign(e.style, {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }), He = ic(uf), He.mount(e);
      },
      destroy() {
        He == null || He.unmount(), He = null;
      }
    });
  }
});
