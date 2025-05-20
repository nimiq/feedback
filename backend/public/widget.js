(function (Tt) { typeof define == 'function' && define.amd ? define(Tt) : Tt() })(() => {
  'use strict'/**
               * @vue/shared v3.5.14
               * (c) 2018-present Yuxi (Evan) You and Vue contributors
               * @license MIT
               *//*! #__NO_SIDE_EFFECTS__ */function Tt(e) { const t = Object.create(null); for (const n of e.split(','))t[n] = 1; return n => n in t } const G = {}; const At = []; const Be = () => {}; const gi = () => !1; const gn = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97); const Yn = e => e.startsWith('onUpdate:'); const ce = Object.assign; const Xn = (e, t) => { const n = e.indexOf(t); n > -1 && e.splice(n, 1) }; const mi = Object.prototype.hasOwnProperty; const k = (e, t) => mi.call(e, t); const N = Array.isArray; const Bt = e => mn(e) === '[object Map]'; const vi = e => mn(e) === '[object Set]'; const j = e => typeof e == 'function'; const ne = e => typeof e == 'string'; const ht = e => typeof e == 'symbol'; const se = e => e !== null && typeof e == 'object'; const Js = e => (se(e) || j(e)) && j(e.then) && j(e.catch); const yi = Object.prototype.toString; const mn = e => yi.call(e); const bi = e => mn(e).slice(8, -1); const _i = e => mn(e) === '[object Object]'; const Zn = e => ne(e) && e !== 'NaN' && e[0] !== '-' && `${Number.parseInt(e, 10)}` === e; const jt = Tt(',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'); const vn = (e) => { const t = Object.create(null); return n => t[n] || (t[n] = e(n)) }; const Ei = /-(\w)/g; const Je = vn(e => e.replace(Ei, (t, n) => n ? n.toUpperCase() : '')); const wi = /\B([A-Z])/g; const gt = vn(e => e.replace(wi, '-$1').toLowerCase()); const zs = vn(e => e.charAt(0).toUpperCase() + e.slice(1)); const yn = vn(e => e ? `on${zs(e)}` : ''); const rt = (e, t) => !Object.is(e, t); const Qn = (e, ...t) => { for (let n = 0; n < e.length; n++)e[n](...t) }; const Ys = (e, t, n, s = !1) => { Object.defineProperty(e, t, { configurable: !0, enumerable: !1, writable: s, value: n }) }; const Ci = (e) => { const t = Number.parseFloat(e); return isNaN(t) ? e : t }; const xi = (e) => { const t = ne(e) ? Number(e) : Number.NaN; return isNaN(t) ? e : t }; let Xs; const bn = () => Xs || (Xs = typeof globalThis < 'u' ? globalThis : typeof self < 'u' ? self : typeof window < 'u' ? window : typeof global < 'u' ? global : {}); function Ht(e) {
    if (N(e)) {
      const t = {}; for (let n = 0; n < e.length; n++) {
        const s = e[n]; const r = ne(s) ? Ai(s) : Ht(s); if (r) {
          for (const o in r)t[o] = r[o]
        }
      } return t
    }
    else if (ne(e) || se(e)) {
      return e
    }
  } const Si = /;(?![^(]*\))/g; const Oi = /:([\s\S]+)/; const Ti = /\/\*[\s\S]*?\*\//g; function Ai(e) { const t = {}; return e.replace(Ti, '').split(Si).forEach((n) => { if (n) { const s = n.split(Oi); s.length > 1 && (t[s[0].trim()] = s[1].trim()) } }), t } function _n(e) {
    let t = ''; if (ne(e)) {
      t = e
    }
    else if (N(e)) {
      for (let n = 0; n < e.length; n++) { const s = _n(e[n]); s && (t += `${s} `) }
    }
    else if (se(e)) {
      for (const n in e)e[n] && (t += `${n} `)
    } return t.trim()
  } function Pi(e) {
    if (!e)
      return null; const { class: t, style: n } = e; return t && !ne(t) && (e.class = _n(t)), n && (e.style = Ht(n)), e
  } const Di = Tt('itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly'); function Zs(e) { return !!e || e === '' }/**
                                                                                                                                            * @vue/reactivity v3.5.14
                                                                                                                                            * (c) 2018-present Yuxi (Evan) You and Vue contributors
                                                                                                                                            * @license MIT
                                                                                                                                            */let he; class Qs {
    constructor(t = !1) { this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = he, !t && he && (this.index = (he.scopes || (he.scopes = [])).push(this) - 1) } get active() { return this._active }pause() {
      if (this._active) {
        this._isPaused = !0; let t, n; if (this.scopes) {
          for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].pause()
        } for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause()
      }
    }

    resume() {
      if (this._active && this._isPaused) {
        this._isPaused = !1; let t, n; if (this.scopes) {
          for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].resume()
        } for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].resume()
      }
    }

    run(t) {
      if (this._active) {
        const n = he; try { return he = this, t() }
        finally { he = n }
      }
    }

    on() { ++this._on === 1 && (this.prevScope = he, he = this) }off() { this._on > 0 && --this._on === 0 && (he = this.prevScope, this.prevScope = void 0) }stop(t) { if (this._active) { this._active = !1; let n, s; for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop(); for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++) this.cleanups[n](); if (this.cleanups.length = 0, this.scopes) { for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0); this.scopes.length = 0 } if (!this.detached && this.parent && !t) { const r = this.parent.scopes.pop(); r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index) } this.parent = void 0 } }
  } function er(e) { return new Qs(e) } function tr() { return he } function Ii(e, t = !1) { he && he.cleanups.push(e) } let J; const es = new WeakSet(); class nr {
    constructor(t) { this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, he && he.active && he.effects.push(this) }pause() { this.flags |= 64 }resume() { this.flags & 64 && (this.flags &= -65, es.has(this) && (es.delete(this), this.trigger())) }notify() { this.flags & 2 && !(this.flags & 32) || this.flags & 8 || rr(this) }run() {
      if (!(this.flags & 1))
        return this.fn(); this.flags |= 2, cr(this), or(this); const t = J; const n = Me; J = this, Me = !0; try { return this.fn() }
      finally { ir(this), J = t, Me = n, this.flags &= -3 }
    }

    stop() { if (this.flags & 1) { for (let t = this.deps; t; t = t.nextDep)rs(t); this.deps = this.depsTail = void 0, cr(this), this.onStop && this.onStop(), this.flags &= -2 } }trigger() { this.flags & 64 ? es.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty() }runIfDirty() { ss(this) && this.run() } get dirty() { return ss(this) }
  } let sr = 0; let Ut; let Vt; function rr(e, t = !1) { if (e.flags |= 8, t) { e.next = Vt, Vt = e; return }e.next = Ut, Ut = e } function ts() { sr++ } function ns() {
    if (--sr > 0)
      return; if (Vt) { let t = Vt; for (Vt = void 0; t;) { const n = t.next; t.next = void 0, t.flags &= -9, t = n } } let e; for (;Ut;) {
      let t = Ut; for (Ut = void 0; t;) {
        const n = t.next; if (t.next = void 0, t.flags &= -9, t.flags & 1) {
          try { t.trigger() }
          catch (s) { e || (e = s) }
        }t = n
      }
    } if (e)
      throw e
  } function or(e) { for (let t = e.deps; t; t = t.nextDep)t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t } function ir(e) { let t; let n = e.depsTail; let s = n; for (;s;) { const r = s.prevDep; s.version === -1 ? (s === n && (n = r), rs(s), Mi(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r }e.deps = t, e.depsTail = n } function ss(e) {
    for (let t = e.deps; t; t = t.nextDep) {
      if (t.dep.version !== t.version || t.dep.computed && (lr(t.dep.computed) || t.dep.version !== t.version))
        return !0
    } return !!e._dirty
  } function lr(e) {
    if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Kt) || (e.globalVersion = Kt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ss(e))))
      return; e.flags |= 2; const t = e.dep; const n = J; const s = Me; J = e, Me = !0; try { or(e); const r = e.fn(e._value); (t.version === 0 || rt(r, e._value)) && (e.flags |= 128, e._value = r, t.version++) }
    catch (r) { throw t.version++, r }
    finally { J = n, Me = s, ir(e), e.flags &= -3 }
  } function rs(e, t = !1) { const { dep: n, prevSub: s, nextSub: r } = e; if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) { n.computed.flags &= -5; for (let o = n.computed.deps; o; o = o.nextDep)rs(o, !0) }!t && !--n.sc && n.map && n.map.delete(n.key) } function Mi(e) { const { prevDep: t, nextDep: n } = e; t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0) } let Me = !0; const ur = []; function je() { ur.push(Me), Me = !1 } function He() { const e = ur.pop(); Me = e === void 0 ? !0 : e } function cr(e) {
    const { cleanup: t } = e; if (e.cleanup = void 0, t) {
      const n = J; J = void 0; try { t() }
      finally { J = n }
    }
  } let Kt = 0; class Fi {constructor(t, n) { this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0 }} class os {
    constructor(t) { this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0 }track(t) {
      if (!J || !Me || J === this.computed)
        return; let n = this.activeLink; if (n === void 0 || n.sub !== J) {
        n = this.activeLink = new Fi(J, this), J.deps ? (n.prevDep = J.depsTail, J.depsTail.nextDep = n, J.depsTail = n) : J.deps = J.depsTail = n, ar(n)
      }
      else if (n.version === -1 && (n.version = this.version, n.nextDep)) { const s = n.nextDep; s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = J.depsTail, n.nextDep = void 0, J.depsTail.nextDep = n, J.depsTail = n, J.deps === n && (J.deps = s) } return n
    }

    trigger(t) { this.version++, Kt++, this.notify(t) }notify(t) {
      ts(); try { for (let n = this.subs; n; n = n.prevSub)n.sub.notify() && n.sub.dep.notify() }
      finally { ns() }
    }
  } function ar(e) { if (e.dep.sc++, e.sub.flags & 4) { const t = e.dep.computed; if (t && !e.dep.subs) { t.flags |= 20; for (let s = t.deps; s; s = s.nextDep)ar(s) } const n = e.dep.subs; n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e } } const En = new WeakMap(); const mt = Symbol(''); const is = Symbol(''); const Wt = Symbol(''); function ge(e, t, n) { if (Me && J) { let s = En.get(e); s || En.set(e, s = new Map()); let r = s.get(n); r || (s.set(n, r = new os()), r.map = s, r.key = n), r.track() } } function ze(e, t, n, s, r, o) {
    const i = En.get(e); if (!i) { Kt++; return } const l = (u) => { u && u.trigger() }; if (ts(), t === 'clear') {
      i.forEach(l)
    }
    else {
      const u = N(e); const d = u && Zn(n); if (u && n === 'length') { const c = Number(s); i.forEach((a, h) => { (h === 'length' || h === Wt || !ht(h) && h >= c) && l(a) }) }
      else {
        switch ((n !== void 0 || i.has(void 0)) && l(i.get(n)), d && l(i.get(Wt)), t) { case 'add':u ? d && l(i.get('length')) : (l(i.get(mt)), Bt(e) && l(i.get(is))); break; case 'delete':u || (l(i.get(mt)), Bt(e) && l(i.get(is))); break; case 'set':Bt(e) && l(i.get(mt)); break }
      }
    }ns()
  } function Li(e, t) { const n = En.get(e); return n && n.get(t) } function Pt(e) { const t = V(e); return t === e ? t : (ge(t, 'iterate', Wt), Fe(e) ? t : t.map(ye)) } function ls(e) { return ge(e = V(e), 'iterate', Wt), e } const Ri = { __proto__: null, [Symbol.iterator]() { return us(this, Symbol.iterator, ye) }, concat(...e) { return Pt(this).concat(...e.map(t => N(t) ? Pt(t) : t)) }, entries() { return us(this, 'entries', e => (e[1] = ye(e[1]), e)) }, every(e, t) { return Ye(this, 'every', e, t, void 0, arguments) }, filter(e, t) { return Ye(this, 'filter', e, t, n => n.map(ye), arguments) }, find(e, t) { return Ye(this, 'find', e, t, ye, arguments) }, findIndex(e, t) { return Ye(this, 'findIndex', e, t, void 0, arguments) }, findLast(e, t) { return Ye(this, 'findLast', e, t, ye, arguments) }, findLastIndex(e, t) { return Ye(this, 'findLastIndex', e, t, void 0, arguments) }, forEach(e, t) { return Ye(this, 'forEach', e, t, void 0, arguments) }, includes(...e) { return cs(this, 'includes', e) }, indexOf(...e) { return cs(this, 'indexOf', e) }, join(e) { return Pt(this).join(e) }, lastIndexOf(...e) { return cs(this, 'lastIndexOf', e) }, map(e, t) { return Ye(this, 'map', e, t, void 0, arguments) }, pop() { return kt(this, 'pop') }, push(...e) { return kt(this, 'push', e) }, reduce(e, ...t) { return fr(this, 'reduce', e, t) }, reduceRight(e, ...t) { return fr(this, 'reduceRight', e, t) }, shift() { return kt(this, 'shift') }, some(e, t) { return Ye(this, 'some', e, t, void 0, arguments) }, splice(...e) { return kt(this, 'splice', e) }, toReversed() { return Pt(this).toReversed() }, toSorted(e) { return Pt(this).toSorted(e) }, toSpliced(...e) { return Pt(this).toSpliced(...e) }, unshift(...e) { return kt(this, 'unshift', e) }, values() { return us(this, 'values', ye) } }; function us(e, t, n) { const s = ls(e); const r = s[t](); return s !== e && !Fe(e) && (r._next = r.next, r.next = () => { const o = r._next(); return o.value && (o.value = n(o.value)), o }), r } const $i = Array.prototype; function Ye(e, t, n, s, r, o) { const i = ls(e); const l = i !== e && !Fe(e); const u = i[t]; if (u !== $i[t]) { const a = u.apply(e, o); return l ? ye(a) : a } let d = n; i !== e && (l ? d = function (a, h) { return n.call(this, ye(a), h, e) } : n.length > 2 && (d = function (a, h) { return n.call(this, a, h, e) })); const c = u.call(i, d, s); return l && r ? r(c) : c } function fr(e, t, n, s) { const r = ls(e); let o = n; return r !== e && (Fe(e) ? n.length > 3 && (o = function (i, l, u) { return n.call(this, i, l, u, e) }) : o = function (i, l, u) { return n.call(this, i, ye(l), u, e) }), r[t](o, ...s) } function cs(e, t, n) { const s = V(e); ge(s, 'iterate', Wt); const r = s[t](...n); return (r === -1 || r === !1) && fs(n[0]) ? (n[0] = V(n[0]), s[t](...n)) : r } function kt(e, t, n = []) { je(), ts(); const s = V(e)[t].apply(e, n); return ns(), He(), s } const Ni = Tt('__proto__,__v_isRef,__isVue'); const dr = new Set(Object.getOwnPropertyNames(Symbol).filter(e => e !== 'arguments' && e !== 'caller').map(e => Symbol[e]).filter(ht)); function Bi(e) { ht(e) || (e = String(e)); const t = V(this); return ge(t, 'has', e), t.hasOwnProperty(e) } class pr {
    constructor(t = !1, n = !1) { this._isReadonly = t, this._isShallow = n }get(t, n, s) {
      if (n === '__v_skip')
        return t.__v_skip; const r = this._isReadonly; const o = this._isShallow; if (n === '__v_isReactive')
        return !r; if (n === '__v_isReadonly')
        return r; if (n === '__v_isShallow')
        return o; if (n === '__v_raw')
        return s === (r ? o ? br : yr : o ? vr : mr).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0; const i = N(t); if (!r) {
        let u; if (i && (u = Ri[n]))
          return u; if (n === 'hasOwnProperty')
          return Bi
      } const l = Reflect.get(t, n, ae(t) ? t : s); return (ht(n) ? dr.has(n) : Ni(n)) || (r || ge(t, 'get', n), o) ? l : ae(l) ? i && Zn(n) ? l : l.value : se(l) ? r ? _r(l) : qt(l) : l
    }
  } class hr extends pr {
    constructor(t = !1) { super(!1, t) }set(t, n, s, r) {
      let o = t[n]; if (!this._isShallow) {
        const u = vt(o); if (!Fe(s) && !vt(s) && (o = V(o), s = V(s)), !N(t) && ae(o) && !ae(s))
          return u ? !1 : (o.value = s, !0)
      } const i = N(t) && Zn(n) ? Number(n) < t.length : k(t, n); const l = Reflect.set(t, n, s, ae(t) ? t : r); return t === V(r) && (i ? rt(s, o) && ze(t, 'set', n, s) : ze(t, 'add', n, s)), l
    }

    deleteProperty(t, n) { const s = k(t, n); t[n]; const r = Reflect.deleteProperty(t, n); return r && s && ze(t, 'delete', n, void 0), r }has(t, n) { const s = Reflect.has(t, n); return (!ht(n) || !dr.has(n)) && ge(t, 'has', n), s }ownKeys(t) { return ge(t, 'iterate', N(t) ? 'length' : mt), Reflect.ownKeys(t) }
  } class gr extends pr {constructor(t = !1) { super(!0, t) }set(t, n) { return !0 }deleteProperty(t, n) { return !0 }} const ji = new hr(); const Hi = new gr(); const Ui = new hr(!0); const Vi = new gr(!0); const as = e => e; const wn = e => Reflect.getPrototypeOf(e); function Ki(e, t, n) { return function (...s) { const r = this.__v_raw; const o = V(r); const i = Bt(o); const l = e === 'entries' || e === Symbol.iterator && i; const u = e === 'keys' && i; const d = r[e](...s); const c = n ? as : t ? ds : ye; return !t && ge(o, 'iterate', u ? is : mt), { next() { const { value: a, done: h } = d.next(); return h ? { value: a, done: h } : { value: l ? [c(a[0]), c(a[1])] : c(a), done: h } }, [Symbol.iterator]() { return this } } } } function Cn(e) { return function (...t) { return e === 'delete' ? !1 : e === 'clear' ? void 0 : this } } function Wi(e, t) {
    const n = { get(r) {
      const o = this.__v_raw; const i = V(o); const l = V(r); e || (rt(r, l) && ge(i, 'get', r), ge(i, 'get', l)); const { has: u } = wn(i); const d = t ? as : e ? ds : ye; if (u.call(i, r))
        return d(o.get(r)); if (u.call(i, l))
        return d(o.get(l)); o !== i && o.get(r)
    }, get size() { const r = this.__v_raw; return !e && ge(V(r), 'iterate', mt), Reflect.get(r, 'size', r) }, has(r) { const o = this.__v_raw; const i = V(o); const l = V(r); return e || (rt(r, l) && ge(i, 'has', r), ge(i, 'has', l)), r === l ? o.has(r) : o.has(r) || o.has(l) }, forEach(r, o) { const i = this; const l = i.__v_raw; const u = V(l); const d = t ? as : e ? ds : ye; return !e && ge(u, 'iterate', mt), l.forEach((c, a) => r.call(o, d(c), d(a), i)) } }; return ce(n, e ? { add: Cn('add'), set: Cn('set'), delete: Cn('delete'), clear: Cn('clear') } : { add(r) { !t && !Fe(r) && !vt(r) && (r = V(r)); const o = V(this); return wn(o).has.call(o, r) || (o.add(r), ze(o, 'add', r, r)), this }, set(r, o) { !t && !Fe(o) && !vt(o) && (o = V(o)); const i = V(this); const { has: l, get: u } = wn(i); let d = l.call(i, r); d || (r = V(r), d = l.call(i, r)); const c = u.call(i, r); return i.set(r, o), d ? rt(o, c) && ze(i, 'set', r, o) : ze(i, 'add', r, o), this }, delete(r) { const o = V(this); const { has: i, get: l } = wn(o); let u = i.call(o, r); u || (r = V(r), u = i.call(o, r)), l && l.call(o, r); const d = o.delete(r); return u && ze(o, 'delete', r, void 0), d }, clear() { const r = V(this); const o = r.size !== 0; const i = r.clear(); return o && ze(r, 'clear', void 0, void 0), i } }), ['keys', 'values', 'entries', Symbol.iterator].forEach((r) => { n[r] = Ki(r, e, t) }), n
  } function xn(e, t) { const n = Wi(e, t); return (s, r, o) => r === '__v_isReactive' ? !e : r === '__v_isReadonly' ? e : r === '__v_raw' ? s : Reflect.get(k(n, r) && r in s ? n : s, r, o) } const ki = { get: xn(!1, !1) }; const qi = { get: xn(!1, !0) }; const Gi = { get: xn(!0, !1) }; const Ji = { get: xn(!0, !0) }; const mr = new WeakMap(); const vr = new WeakMap(); const yr = new WeakMap(); const br = new WeakMap(); function zi(e) { switch (e) { case 'Object':case 'Array':return 1; case 'Map':case 'Set':case 'WeakMap':case 'WeakSet':return 2; default:return 0 } } function Yi(e) { return e.__v_skip || !Object.isExtensible(e) ? 0 : zi(bi(e)) } function qt(e) { return vt(e) ? e : Sn(e, !1, ji, ki, mr) } function Xi(e) { return Sn(e, !1, Ui, qi, vr) } function _r(e) { return Sn(e, !0, Hi, Gi, yr) } function ta(e) { return Sn(e, !0, Vi, Ji, br) } function Sn(e, t, n, s, r) {
    if (!se(e) || e.__v_raw && !(t && e.__v_isReactive))
      return e; const o = Yi(e); if (o === 0)
      return e; const i = r.get(e); if (i)
      return i; const l = new Proxy(e, o === 2 ? s : n); return r.set(e, l), l
  } function Gt(e) { return vt(e) ? Gt(e.__v_raw) : !!(e && e.__v_isReactive) } function vt(e) { return !!(e && e.__v_isReadonly) } function Fe(e) { return !!(e && e.__v_isShallow) } function fs(e) { return e ? !!e.__v_raw : !1 } function V(e) { const t = e && e.__v_raw; return t ? V(t) : e } function Zi(e) { return !k(e, '__v_skip') && Object.isExtensible(e) && Ys(e, '__v_skip', !0), e } const ye = e => se(e) ? qt(e) : e; const ds = e => se(e) ? _r(e) : e; function ae(e) { return e ? e.__v_isRef === !0 : !1 } function ie(e) { return Er(e, !1) } function Qi(e) { return Er(e, !0) } function Er(e, t) { return ae(e) ? e : new el(e, t) } class el {constructor(t, n) { this.dep = new os(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : V(t), this._value = n ? t : ye(t), this.__v_isShallow = n } get value() { return this.dep.track(), this._value } set value(t) { const n = this._rawValue; const s = this.__v_isShallow || Fe(t) || vt(t); t = s ? t : V(t), rt(t, n) && (this._rawValue = t, this._value = s ? t : ye(t), this.dep.trigger()) }} function P(e) { return ae(e) ? e.value : e } function Jt(e) { return j(e) ? e() : P(e) } const tl = { get: (e, t, n) => t === '__v_raw' ? e : P(Reflect.get(e, t, n)), set: (e, t, n, s) => { const r = e[t]; return ae(r) && !ae(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s) } }; function wr(e) { return Gt(e) ? e : new Proxy(e, tl) } function Cr(e) { const t = N(e) ? Array.from({ length: e.length }) : {}; for (const n in e)t[n] = sl(e, n); return t } class nl {constructor(t, n, s) { this._object = t, this._key = n, this._defaultValue = s, this.__v_isRef = !0, this._value = void 0 } get value() { const t = this._object[this._key]; return this._value = t === void 0 ? this._defaultValue : t } set value(t) { this._object[this._key] = t } get dep() { return Li(V(this._object), this._key) }} function sl(e, t, n) { const s = e[t]; return ae(s) ? s : new nl(e, t, n) } class rl {
    constructor(t, n, s) { this.fn = t, this.setter = n, this._value = void 0, this.dep = new os(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Kt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s }notify() {
      if (this.flags |= 16, !(this.flags & 8) && J !== this)
        return rr(this, !0), !0
    }

    get value() { const t = this.dep.track(); return lr(this), t && (t.version = this.dep.version), this._value } set value(t) { this.setter && this.setter(t) }
  } function ol(e, t, n = !1) { let s, r; return j(e) ? s = e : (s = e.get, r = e.set), new rl(s, r, n) } const On = {}; const Tn = new WeakMap(); let yt; function il(e, t = !1, n = yt) { if (n) { let s = Tn.get(n); s || Tn.set(n, s = []), s.push(e) } } function ll(e, t, n = G) {
    const { immediate: s, deep: r, once: o, scheduler: i, augmentJob: l, call: u } = n; const d = A => r ? A : Fe(A) || r === !1 || r === 0 ? ot(A, 1) : ot(A); let c; let a; let h; let m; let v = !1; let w = !1; if (ae(e)
      ? (a = () => e.value, v = Fe(e))
      : Gt(e)
        ? (a = () => d(e), v = !0)
        : N(e)
          ? (w = !0, v = e.some(A => Gt(A) || Fe(A)), a = () => e.map((A) => {
              if (ae(A))
                return A.value; if (Gt(A))
                return d(A); if (j(A))
                return u ? u(A, 2) : A()
            }))
          : j(e)
            ? t
              ? a = u ? () => u(e, 2) : e
              : a = () => {
                if (h) {
                  je(); try { h() }
                  finally { He() }
                } const A = yt; yt = c; try { return u ? u(e, 3, [m]) : e(m) }
                finally { yt = A }
              }
            : a = Be, t && r) { const A = a; const H = r === !0 ? 1 / 0 : r; a = () => ot(A(), H) } const L = tr(); const T = () => { c.stop(), L && L.active && Xn(L.effects, c) }; if (o && t) { const A = t; t = (...H) => { A(...H), T() } } let F = w ? Array.from({ length: e.length }).fill(On) : On; const $ = (A) => {
      if (!(!(c.flags & 1) || !c.dirty && !A)) {
        if (t) {
          const H = c.run(); if (r || v || (w ? H.some((U, re) => rt(U, F[re])) : rt(H, F))) {
            h && h(); const U = yt; yt = c; try { const re = [H, F === On ? void 0 : w && F[0] === On ? [] : F, m]; u ? u(t, 3, re) : t(...re), F = H }
            finally { yt = U }
          }
        }
        else {
          c.run()
        }
      }
    }; return l && l($), c = new nr(a), c.scheduler = i ? () => i($, !1) : $, m = A => il(A, !1, c), h = c.onStop = () => {
      const A = Tn.get(c); if (A) {
        if (u) {
          u(A, 4)
        }
        else {
          for (const H of A)H()
        }Tn.delete(c)
      }
    }, t ? s ? $(!0) : F = c.run() : i ? i($.bind(null, !0), !0) : c.run(), T.pause = c.pause.bind(c), T.resume = c.resume.bind(c), T.stop = T, T
  } function ot(e, t = 1 / 0, n) {
    if (t <= 0 || !se(e) || e.__v_skip || (n = n || new Set(), n.has(e)))
      return e; if (n.add(e), t--, ae(e)) {
      ot(e.value, t, n)
    }
    else if (N(e)) {
      for (let s = 0; s < e.length; s++)ot(e[s], t, n)
    }
    else if (vi(e) || Bt(e)) {
      e.forEach((s) => { ot(s, t, n) })
    }
    else if (_i(e)) { for (const s in e)ot(e[s], t, n); for (const s of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e, s) && ot(e[s], t, n) } return e
  }/**
    * @vue/runtime-core v3.5.14
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    */const zt = []; let ps = !1; function na(e, ...t) {
    if (ps)
      return; ps = !0, je(); const n = zt.length ? zt[zt.length - 1].component : null; const s = n && n.appContext.config.warnHandler; const r = ul(); if (s) {
      Dt(s, n, 11, [e + t.map((o) => { let i, l; return (l = (i = o.toString) == null ? void 0 : i.call(o)) != null ? l : JSON.stringify(o) }).join(''), n && n.proxy, r.map(({ vnode: o }) => `at <${Ao(n, o.type)}>`).join(`
`), r])
    }
    else {
      const o = [`[Vue warn]: ${e}`, ...t]; r.length && o.push(`
`, ...cl(r)), console.warn(...o)
    }He(), ps = !1
  } function ul() {
    let e = zt[zt.length - 1]; if (!e)
      return []; const t = []; for (;e;) { const n = t[0]; n && n.vnode === e ? n.recurseCount++ : t.push({ vnode: e, recurseCount: 0 }); const s = e.component && e.component.parent; e = s && s.vnode } return t
  } function cl(e) {
    const t = []; return e.forEach((n, s) => {
      t.push(...s === 0
        ? []
        : [`
`], ...al(n))
    }), t
  } function al({ vnode: e, recurseCount: t }) { const n = t > 0 ? `... (${t} recursive calls)` : ''; const s = e.component ? e.component.parent == null : !1; const r = ` at <${Ao(e.component, e.type, s)}`; const o = `>${n}`; return e.props ? [r, ...fl(e.props), o] : [r + o] } function fl(e) { const t = []; const n = Object.keys(e); return n.slice(0, 3).forEach((s) => { t.push(...xr(s, e[s])) }), n.length > 3 && t.push(' ...'), t } function xr(e, t, n) { return ne(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == 'number' || typeof t == 'boolean' || t == null ? n ? t : [`${e}=${t}`] : ae(t) ? (t = xr(e, V(t.value), !0), n ? t : [`${e}=Ref<`, t, '>']) : j(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ''}`] : (t = V(t), n ? t : [`${e}=`, t]) } function Dt(e, t, n, s) {
    try { return s ? e(...s) : e() }
    catch (r) { An(r, t, n) }
  } function Le(e, t, n, s) { if (j(e)) { const r = Dt(e, t, n, s); return r && Js(r) && r.catch((o) => { An(o, t, n) }), r } if (N(e)) { const r = []; for (let o = 0; o < e.length; o++)r.push(Le(e[o], t, n, s)); return r } } function An(e, t, n, s = !0) {
    const r = t ? t.vnode : null; const { errorHandler: o, throwUnhandledErrorInProduction: i } = t && t.appContext.config || G; if (t) {
      let l = t.parent; const u = t.proxy; const d = `https://vuejs.org/error-reference/#runtime-${n}`; for (;l;) {
        const c = l.ec; if (c) {
          for (let a = 0; a < c.length; a++) {
            if (c[a](e, u, d) === !1)
              return
          }
        }l = l.parent
      } if (o) { je(), Dt(o, null, 10, [e, u, d]), He(); return }
    }dl(e, n, r, s, i)
  } function dl(e, t, n, s = !0, r = !1) {
    if (r)
      throw e; console.error(e)
  } const be = []; let Ue = -1; const It = []; let it = null; let Mt = 0; const Sr = Promise.resolve(); let Pn = null; function lt(e) { const t = Pn || Sr; return e ? t.then(this ? e.bind(this) : e) : t } function pl(e) { let t = Ue + 1; let n = be.length; for (;t < n;) { const s = t + n >>> 1; const r = be[s]; const o = Yt(r); o < e || o === e && r.flags & 2 ? t = s + 1 : n = s } return t } function hs(e) { if (!(e.flags & 1)) { const t = Yt(e); const n = be[be.length - 1]; !n || !(e.flags & 2) && t >= Yt(n) ? be.push(e) : be.splice(pl(t), 0, e), e.flags |= 1, Or() } } function Or() { Pn || (Pn = Sr.then(Pr)) } function hl(e) { N(e) ? It.push(...e) : it && e.id === -1 ? it.splice(Mt + 1, 0, e) : e.flags & 1 || (It.push(e), e.flags |= 1), Or() } function Tr(e, t, n = Ue + 1) {
    for (;n < be.length; n++) {
      const s = be[n]; if (s && s.flags & 2) {
        if (e && s.id !== e.uid)
          continue; be.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2)
      }
    }
  } function Ar(e) { if (It.length) { const t = [...new Set(It)].sort((n, s) => Yt(n) - Yt(s)); if (It.length = 0, it) { it.push(...t); return } for (it = t, Mt = 0; Mt < it.length; Mt++) { const n = it[Mt]; n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2 }it = null, Mt = 0 } } const Yt = e => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id; function Pr(e) {
    try { for (Ue = 0; Ue < be.length; Ue++) { const t = be[Ue]; t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Dt(t, t.i, t.i ? 15 : 14), t.flags & 4 || (t.flags &= -2)) } }
    finally { for (;Ue < be.length; Ue++) { const t = be[Ue]; t && (t.flags &= -2) }Ue = -1, be.length = 0, Ar(), Pn = null, (be.length || It.length) && Pr() }
  } let _e = null; let Dr = null; function Dn(e) { const t = _e; return _e = e, Dr = e && e.type.__scopeId || null, t } function Z(e, t = _e, n) {
    if (!t || e._n)
      return e; const s = (...r) => {
      s._d && bo(-1); const o = Dn(t); let i; try { i = e(...r) }
      finally { Dn(o), s._d && bo(1) } return i
    }; return s._n = !0, s._c = !0, s._d = !0, s
  } function bt(e, t, n, s) { const r = e.dirs; const o = t && t.dirs; for (let i = 0; i < r.length; i++) { const l = r[i]; o && (l.oldValue = o[i].value); const u = l.dir[s]; u && (je(), Le(u, n, 8, [e.el, l, e, t]), He()) } } const Ir = Symbol('_vte'); const Mr = e => e.__isTeleport; const Xt = e => e && (e.disabled || e.disabled === ''); const Fr = e => e && (e.defer || e.defer === ''); const Lr = e => typeof SVGElement < 'u' && e instanceof SVGElement; const Rr = e => typeof MathMLElement == 'function' && e instanceof MathMLElement; const gs = (e, t) => { const n = e && e.to; return ne(n) ? t ? t(n) : null : n }; const $r = { name: 'Teleport', __isTeleport: !0, process(e, t, n, s, r, o, i, l, u, d) {
    const { mc: c, pc: a, pbc: h, o: { insert: m, querySelector: v, createText: w, createComment: L } } = d; const T = Xt(t.props); const { shapeFlag: F, children: $, dynamicChildren: A } = t; if (e == null) { const H = t.el = w(''); const U = t.anchor = w(''); m(H, n, s), m(U, n, s); const re = (R, K) => { F & 16 && (r && r.isCE && (r.ce._teleportTarget = R), c($, R, K, r, o, i, l, u)) }; const oe = () => { const R = t.target = gs(t.props, v); const K = Nr(R, t, w, m); R && (i !== 'svg' && Lr(R) ? i = 'svg' : i !== 'mathml' && Rr(R) && (i = 'mathml'), T || (re(R, K), Mn(t, !1))) }; T && (re(n, U), Mn(t, !0)), Fr(t.props) ? Ce(() => { oe(), t.el.__isMounted = !0 }, o) : oe() }
    else {
      if (Fr(t.props) && !e.el.__isMounted) { Ce(() => { $r.process(e, t, n, s, r, o, i, l, u, d), delete e.el.__isMounted }, o); return }t.el = e.el, t.targetStart = e.targetStart; const H = t.anchor = e.anchor; const U = t.target = e.target; const re = t.targetAnchor = e.targetAnchor; const oe = Xt(e.props); const R = oe ? n : U; const K = oe ? H : re; if (i === 'svg' || Lr(U) ? i = 'svg' : (i === 'mathml' || Rr(U)) && (i = 'mathml'), A ? (h(e.dynamicChildren, A, R, r, o, i, l), Ts(e, t, !0)) : u || a(e, t, R, K, r, o, i, l, !1), T) {
        oe ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : In(t, n, H, d, 1)
      }
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) { const z = t.target = gs(t.props, v); z && In(t, z, null, d, 0) }
      else {
        oe && In(t, U, re, d, 1)
      }Mn(t, T)
    }
  }, remove(e, t, n, { um: s, o: { remove: r } }, o) { const { shapeFlag: i, children: l, anchor: u, targetStart: d, targetAnchor: c, target: a, props: h } = e; if (a && (r(d), r(c)), o && r(u), i & 16) { const m = o || !Xt(h); for (let v = 0; v < l.length; v++) { const w = l[v]; s(w, t, n, m, !!w.dynamicChildren) } } }, move: In, hydrate: gl }; function In(e, t, n, { o: { insert: s }, m: r }, o = 2) {
    o === 0 && s(e.targetAnchor, t, n); const { el: i, anchor: l, shapeFlag: u, children: d, props: c } = e; const a = o === 2; if (a && s(i, t, n), (!a || Xt(c)) && u & 16) {
      for (let h = 0; h < d.length; h++)r(d[h], t, n, 2)
    } a && s(l, t, n)
  } function gl(e, t, n, s, r, o, { o: { nextSibling: i, parentNode: l, querySelector: u, insert: d, createText: c } }, a) {
    const h = t.target = gs(t.props, u); if (h) {
      const m = Xt(t.props); const v = h._lpa || h.firstChild; if (t.shapeFlag & 16) {
        if (m) {
          t.anchor = a(i(e), t, l(e), n, s, r, o), t.targetStart = v, t.targetAnchor = v && i(v)
        }
        else {
          t.anchor = i(e); let w = v; for (;w;) {
            if (w && w.nodeType === 8) {
              if (w.data === 'teleport start anchor') {
                t.targetStart = w
              }
              else if (w.data === 'teleport anchor') { t.targetAnchor = w, h._lpa = t.targetAnchor && i(t.targetAnchor); break }
            }w = i(w)
          }t.targetAnchor || Nr(h, t, c, d), a(v && i(v), t, h, n, s, r, o)
        }
      }Mn(t, m)
    } return t.anchor && i(t.anchor)
  } const ml = $r; function Mn(e, t) { const n = e.ctx; if (n && n.ut) { let s, r; for (t ? (s = e.el, r = e.anchor) : (s = e.targetStart, r = e.targetAnchor); s && s !== r;)s.nodeType === 1 && s.setAttribute('data-v-owner', n.uid), s = s.nextSibling; n.ut() } } function Nr(e, t, n, s) { const r = t.targetStart = n(''); const o = t.targetAnchor = n(''); return r[Ir] = o, e && (s(r, e), s(o, e)), o } const ut = Symbol('_leaveCb'); const Fn = Symbol('_enterCb'); function vl() { const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() }; return Qt(() => { e.isMounted = !0 }), ys(() => { e.isUnmounting = !0 }), e } const De = [Function, Array]; const Br = { mode: String, appear: Boolean, persisted: Boolean, onBeforeEnter: De, onEnter: De, onAfterEnter: De, onEnterCancelled: De, onBeforeLeave: De, onLeave: De, onAfterLeave: De, onLeaveCancelled: De, onBeforeAppear: De, onAppear: De, onAfterAppear: De, onAppearCancelled: De }; const jr = (e) => { const t = e.subTree; return t.component ? jr(t.component) : t }; const yl = { name: 'BaseTransition', props: Br, setup(e, { slots: t }) {
    const n = at(); const s = vl(); return () => {
      const r = t.default && Kr(t.default(), !0); if (!r || !r.length)
        return; const o = Hr(r); const i = V(e); const { mode: l } = i; if (s.isLeaving)
        return vs(o); const u = Vr(o); if (!u)
        return vs(o); let d = ms(u, i, s, n, a => d = a); u.type !== pe && Zt(u, d); let c = n.subTree && Vr(n.subTree); if (c && c.type !== pe && !Et(u, c) && jr(n).type !== pe) {
        const a = ms(c, i, s, n); if (Zt(c, a), l === 'out-in' && u.type !== pe)
          return s.isLeaving = !0, a.afterLeave = () => { s.isLeaving = !1, n.job.flags & 8 || n.update(), delete a.afterLeave, c = void 0 }, vs(o); l === 'in-out' && u.type !== pe ? a.delayLeave = (h, m, v) => { const w = Ur(s, c); w[String(c.key)] = c, h[ut] = () => { m(), h[ut] = void 0, delete d.delayedLeave, c = void 0 }, d.delayedLeave = () => { v(), delete d.delayedLeave, c = void 0 } } : c = void 0
      }
      else {
        c && (c = void 0)
      } return o
    }
  } }; function Hr(e) {
    let t = e[0]; if (e.length > 1) {
      for (const n of e) {
        if (n.type !== pe) { t = n; break }
      }
    } return t
  } const bl = yl; function Ur(e, t) { const { leavingVNodes: n } = e; let s = n.get(t.type); return s || (s = Object.create(null), n.set(t.type, s)), s } function ms(e, t, n, s, r) {
    const { appear: o, mode: i, persisted: l = !1, onBeforeEnter: u, onEnter: d, onAfterEnter: c, onEnterCancelled: a, onBeforeLeave: h, onLeave: m, onAfterLeave: v, onLeaveCancelled: w, onBeforeAppear: L, onAppear: T, onAfterAppear: F, onAppearCancelled: $ } = t; const A = String(e.key); const H = Ur(n, e); const U = (R, K) => { R && Le(R, s, 9, K) }; const re = (R, K) => { const z = K[1]; U(R, K), N(R) ? R.every(D => D.length <= 1) && z() : R.length <= 1 && z() }; const oe = { mode: i, persisted: l, beforeEnter(R) {
      let K = u; if (!n.isMounted) {
        if (o)
          K = L || u; else return
      } R[ut] && R[ut](!0); const z = H[A]; z && Et(e, z) && z.el[ut] && z.el[ut](), U(K, [R])
    }, enter(R) {
      let K = d; let z = c; let D = a; if (!n.isMounted) {
        if (o)
          K = T || d, z = F || c, D = $ || a; else return
      } let ee = !1; const ve = R[Fn] = (st) => { ee || (ee = !0, st ? U(D, [R]) : U(z, [R]), oe.delayedLeave && oe.delayedLeave(), R[Fn] = void 0) }; K ? re(K, [R, ve]) : ve()
    }, leave(R, K) {
      const z = String(e.key); if (R[Fn] && R[Fn](!0), n.isUnmounting)
        return K(); U(h, [R]); let D = !1; const ee = R[ut] = (ve) => { D || (D = !0, K(), ve ? U(w, [R]) : U(v, [R]), R[ut] = void 0, H[z] === e && delete H[z]) }; H[z] = e, m ? re(m, [R, ee]) : ee()
    }, clone(R) { const K = ms(R, t, n, s, r); return r && r(K), K } }; return oe
  } function vs(e) {
    if (Rn(e))
      return e = Ze(e), e.children = null, e
  } function Vr(e) {
    if (!Rn(e))
      return Mr(e.type) && e.children ? Hr(e.children) : e; if (e.component)
      return e.component.subTree; const { shapeFlag: t, children: n } = e; if (n) {
      if (t & 16)
        return n[0]; if (t & 32 && j(n.default))
        return n.default()
    }
  } function Zt(e, t) { e.shapeFlag & 6 && e.component ? (e.transition = t, Zt(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t } function Kr(e, t = !1, n) {
    let s = []; let r = 0; for (let o = 0; o < e.length; o++) { const i = e[o]; const l = n == null ? i.key : String(n) + String(i.key != null ? i.key : o); i.type === xe ? (i.patchFlag & 128 && r++, s = s.concat(Kr(i.children, t, l))) : (t || i.type !== pe) && s.push(l != null ? Ze(i, { key: l }) : i) } if (r > 1) {
      for (let o = 0; o < s.length; o++)s[o].patchFlag = -2
    } return s
  }/*! #__NO_SIDE_EFFECTS__ */ function fe(e, t) { return j(e) ? ce({ name: e.name }, t, { setup: e }) : e } function Wr() { const e = at(); return e ? `${e.appContext.config.idPrefix || 'v'}-${e.ids[0]}${e.ids[1]++}` : '' } function kr(e) { e.ids = [`${e.ids[0] + e.ids[2]++}-`, 0, 0] } function Ln(e, t, n, s, r = !1) {
    if (N(e)) { e.forEach((v, w) => Ln(v, t && (N(t) ? t[w] : t), n, s, r)); return } if (Ft(s) && !r) { s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Ln(e, t, n, s.component.subTree); return } const o = s.shapeFlag & 4 ? Ms(s.component) : s.el; const i = r ? null : o; const { i: l, r: u } = e; const d = t && t.r; const c = l.refs === G ? l.refs = {} : l.refs; const a = l.setupState; const h = V(a); const m = a === G ? () => !1 : v => k(h, v); if (d != null && d !== u && (ne(d) ? (c[d] = null, m(d) && (a[d] = null)) : ae(d) && (d.value = null)), j(u)) {
      Dt(u, l, 12, [i, c])
    }
    else {
      const v = ne(u); const w = ae(u); if (v || w) {
        const L = () => {
          if (e.f) { const T = v ? m(u) ? a[u] : c[u] : u.value; r ? N(T) && Xn(T, o) : N(T) ? T.includes(o) || T.push(o) : v ? (c[u] = [o], m(u) && (a[u] = c[u])) : (u.value = [o], e.k && (c[e.k] = u.value)) }
          else {
            v ? (c[u] = i, m(u) && (a[u] = i)) : w && (u.value = i, e.k && (c[e.k] = i))
          }
        }; i ? (L.id = -1, Ce(L, n)) : L()
      }
    }
  }bn().requestIdleCallback, bn().cancelIdleCallback; const Ft = e => !!e.type.__asyncLoader; const Rn = e => e.type.__isKeepAlive; function _l(e, t) { qr(e, 'a', t) } function El(e, t) { qr(e, 'da', t) } function qr(e, t, n = me) {
    const s = e.__wdc || (e.__wdc = () => {
      let r = n; for (;r;) {
        if (r.isDeactivated)
          return; r = r.parent
      } return e()
    }); if ($n(t, s, n), n) { let r = n.parent; for (;r && r.parent;)Rn(r.parent.vnode) && wl(s, t, n, r), r = r.parent }
  } function wl(e, t, n, s) { const r = $n(t, e, s, !0); Nn(() => { Xn(s[t], r) }, n) } function $n(e, t, n = me, s = !1) { if (n) { const r = n[e] || (n[e] = []); const o = t.__weh || (t.__weh = (...i) => { je(); const l = ln(n); const u = Le(t, n, e, i); return l(), He(), u }); return s ? r.unshift(o) : r.push(o), o } } const Xe = e => (t, n = me) => { (!un || e === 'sp') && $n(e, (...s) => t(...s), n) }; const Cl = Xe('bm'); const Qt = Xe('m'); const xl = Xe('bu'); const Sl = Xe('u'); const ys = Xe('bum'); const Nn = Xe('um'); const Ol = Xe('sp'); const Tl = Xe('rtg'); const Al = Xe('rtc'); function Pl(e, t = me) { $n('ec', e, t) } const Dl = Symbol.for('v-ndc'); function Ee(e, t, n = {}, s, r) {
    if (_e.ce || _e.parent && Ft(_e.parent) && _e.parent.ce)
      return le(), ue(xe, null, [Q('slot', n, s)], 64); const o = e[t]; o && o._c && (o._d = !1), le(); const i = o && Gr(o(n)); const l = n.key || i && i.key; const u = ue(xe, { key: `${l && !ht(l) ? l : `_${t}`}` }, i || [], i && e._ === 1 ? 64 : -2); return u.scopeId && (u.slotScopeIds = [`${u.scopeId}-s`]), o && o._c && (o._d = !0), u
  } function Gr(e) { return e.some(t => on(t) ? !(t.type === pe || t.type === xe && !Gr(t.children)) : !0) ? e : null } const bs = e => e ? So(e) ? Ms(e) : bs(e.parent) : null; const en = ce(Object.create(null), { $: e => e, $el: e => e.vnode.el, $data: e => e.data, $props: e => e.props, $attrs: e => e.attrs, $slots: e => e.slots, $refs: e => e.refs, $parent: e => bs(e.parent), $root: e => bs(e.root), $host: e => e.ce, $emit: e => e.emit, $options: e => Xr(e), $forceUpdate: e => e.f || (e.f = () => { hs(e.update) }), $nextTick: e => e.n || (e.n = lt.bind(e.proxy)), $watch: e => Xl.bind(e) }); const _s = (e, t) => e !== G && !e.__isScriptSetup && k(e, t); const Il = { get({ _: e }, t) {
    if (t === '__v_skip')
      return !0; const { ctx: n, setupState: s, data: r, props: o, accessCache: i, type: l, appContext: u } = e; let d; if (t[0] !== '$') {
      const m = i[t]; if (m !== void 0) {
        switch (m) { case 1:return s[t]; case 2:return r[t]; case 4:return n[t]; case 3:return o[t] }
      }
      else {
        if (_s(s, t))
          return i[t] = 1, s[t]; if (r !== G && k(r, t))
          return i[t] = 2, r[t]; if ((d = e.propsOptions[0]) && k(d, t))
          return i[t] = 3, o[t]; if (n !== G && k(n, t))
          return i[t] = 4, n[t]; Es && (i[t] = 0)
      }
    } const c = en[t]; let a, h; if (c)
      return t === '$attrs' && ge(e.attrs, 'get', ''), c(e); if ((a = l.__cssModules) && (a = a[t]))
      return a; if (n !== G && k(n, t))
      return i[t] = 4, n[t]; if (h = u.config.globalProperties, k(h, t))
      return h[t]
  }, set({ _: e }, t, n) { const { data: s, setupState: r, ctx: o } = e; return _s(r, t) ? (r[t] = n, !0) : s !== G && k(s, t) ? (s[t] = n, !0) : k(e.props, t) || t[0] === '$' && t.slice(1) in e ? !1 : (o[t] = n, !0) }, has({ _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: o } }, i) { let l; return !!n[i] || e !== G && k(e, i) || _s(t, i) || (l = o[0]) && k(l, i) || k(s, i) || k(en, i) || k(r.config.globalProperties, i) }, defineProperty(e, t, n) { return n.get != null ? e._.accessCache[t] = 0 : k(n, 'value') && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n) } }; function Jr(e) { return N(e) ? e.reduce((t, n) => (t[n] = null, t), {}) : e } let Es = !0; function Ml(e) {
    const t = Xr(e); const n = e.proxy; const s = e.ctx; Es = !1, t.beforeCreate && zr(t.beforeCreate, e, 'bc'); const { data: r, computed: o, methods: i, watch: l, provide: u, inject: d, created: c, beforeMount: a, mounted: h, beforeUpdate: m, updated: v, activated: w, deactivated: L, beforeDestroy: T, beforeUnmount: F, destroyed: $, unmounted: A, render: H, renderTracked: U, renderTriggered: re, errorCaptured: oe, serverPrefetch: R, expose: K, inheritAttrs: z, components: D, directives: ee, filters: ve } = t; if (d && Fl(d, s, null), i) {
      for (const te in i) { const Y = i[te]; j(Y) && (s[te] = Y.bind(n)) }
    } if (r) { const te = r.call(n, n); se(te) && (e.data = qt(te)) } if (Es = !0, o) {
      for (const te in o) { const Y = o[te]; const St = j(Y) ? Y.bind(n, n) : j(Y.get) ? Y.get.bind(n, n) : Be; const Jn = !j(Y) && j(Y.set) ? Y.set.bind(n) : Be; const Ot = Ie({ get: St, set: Jn }); Object.defineProperty(s, te, { enumerable: !0, configurable: !0, get: () => Ot.value, set: We => Ot.value = We }) }
    } if (l) {
      for (const te in l)Yr(l[te], s, n, te)
    } if (u) { const te = j(u) ? u.call(n) : u; Reflect.ownKeys(te).forEach((Y) => { to(Y, te[Y]) }) }c && zr(c, e, 'c'); function de(te, Y) { N(Y) ? Y.forEach(St => te(St.bind(n))) : Y && te(Y.bind(n)) } if (de(Cl, a), de(Qt, h), de(xl, m), de(Sl, v), de(_l, w), de(El, L), de(Pl, oe), de(Al, U), de(Tl, re), de(ys, F), de(Nn, A), de(Ol, R), N(K)) {
      if (K.length) { const te = e.exposed || (e.exposed = {}); K.forEach((Y) => { Object.defineProperty(te, Y, { get: () => n[Y], set: St => n[Y] = St }) }) }
      else {
        e.exposed || (e.exposed = {})
      }
    }H && e.render === Be && (e.render = H), z != null && (e.inheritAttrs = z), D && (e.components = D), ee && (e.directives = ee), R && kr(e)
  } function Fl(e, t, n = Be) { N(e) && (e = ws(e)); for (const s in e) { const r = e[s]; let o; se(r) ? 'default' in r ? o = nn(r.from || s, r.default, !0) : o = nn(r.from || s) : o = nn(r), ae(o) ? Object.defineProperty(t, s, { enumerable: !0, configurable: !0, get: () => o.value, set: i => o.value = i }) : t[s] = o } } function zr(e, t, n) { Le(N(e) ? e.map(s => s.bind(t.proxy)) : e.bind(t.proxy), t, n) } function Yr(e, t, n, s) {
    const r = s.includes('.') ? ho(n, s) : () => n[s]; if (ne(e)) { const o = t[e]; j(o) && Re(r, o) }
    else if (j(e)) {
      Re(r, e.bind(n))
    }
    else if (se(e)) {
      if (N(e)) {
        e.forEach(o => Yr(o, t, n, s))
      }
      else { const o = j(e.handler) ? e.handler.bind(n) : t[e.handler]; j(o) && Re(r, o, e) }
    }
  } function Xr(e) { const t = e.type; const { mixins: n, extends: s } = t; const { mixins: r, optionsCache: o, config: { optionMergeStrategies: i } } = e.appContext; const l = o.get(t); let u; return l ? u = l : !r.length && !n && !s ? u = t : (u = {}, r.length && r.forEach(d => Bn(u, d, i, !0)), Bn(u, t, i)), se(t) && o.set(t, u), u } function Bn(e, t, n, s = !1) {
    const { mixins: r, extends: o } = t; o && Bn(e, o, n, !0), r && r.forEach(i => Bn(e, i, n, !0)); for (const i in t) {
      if (!(s && i === 'expose')) { const l = Ll[i] || n && n[i]; e[i] = l ? l(e[i], t[i]) : t[i] }
    } return e
  } const Ll = { data: Zr, props: Qr, emits: Qr, methods: tn, computed: tn, beforeCreate: we, created: we, beforeMount: we, mounted: we, beforeUpdate: we, updated: we, beforeDestroy: we, beforeUnmount: we, destroyed: we, unmounted: we, activated: we, deactivated: we, errorCaptured: we, serverPrefetch: we, components: tn, directives: tn, watch: $l, provide: Zr, inject: Rl }; function Zr(e, t) { return t ? e ? function () { return ce(j(e) ? e.call(this, this) : e, j(t) ? t.call(this, this) : t) } : t : e } function Rl(e, t) { return tn(ws(e), ws(t)) } function ws(e) { if (N(e)) { const t = {}; for (let n = 0; n < e.length; n++)t[e[n]] = e[n]; return t } return e } function we(e, t) { return e ? [...new Set([].concat(e, t))] : t } function tn(e, t) { return e ? ce(Object.create(null), e, t) : t } function Qr(e, t) { return e ? N(e) && N(t) ? [...new Set([...e, ...t])] : ce(Object.create(null), Jr(e), Jr(t ?? {})) : t } function $l(e, t) {
    if (!e)
      return t; if (!t)
      return e; const n = ce(Object.create(null), e); for (const s in t)n[s] = we(e[s], t[s]); return n
  } function eo() { return { app: null, config: { isNativeTag: gi, performance: !1, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} }, mixins: [], components: {}, directives: {}, provides: Object.create(null), optionsCache: new WeakMap(), propsCache: new WeakMap(), emitsCache: new WeakMap() } } let Nl = 0; function Bl(e, t) {
    return function (s, r = null) {
      j(s) || (s = ce({}, s)), r != null && !se(r) && (r = null); const o = eo(); const i = new WeakSet(); const l = []; let u = !1; const d = o.app = { _uid: Nl++, _component: s, _props: r, _container: null, _context: o, _instance: null, version: bu, get config() { return o.config }, set config(c) {}, use(c, ...a) { return i.has(c) || (c && j(c.install) ? (i.add(c), c.install(d, ...a)) : j(c) && (i.add(c), c(d, ...a))), d }, mixin(c) { return o.mixins.includes(c) || o.mixins.push(c), d }, component(c, a) { return a ? (o.components[c] = a, d) : o.components[c] }, directive(c, a) { return a ? (o.directives[c] = a, d) : o.directives[c] }, mount(c, a, h) { if (!u) { const m = d._ceVNode || Q(s, r); return m.appContext = o, h === !0 ? h = 'svg' : h === !1 && (h = void 0), e(m, c, h), u = !0, d._container = c, c.__vue_app__ = d, Ms(m.component) } }, onUnmount(c) { l.push(c) }, unmount() { u && (Le(l, d._instance, 16), e(null, d._container), delete d._container.__vue_app__) }, provide(c, a) { return o.provides[c] = a, d }, runWithContext(c) {
        const a = Lt; Lt = d; try { return c() }
        finally { Lt = a }
      } }; return d
    }
  } let Lt = null; function to(e, t) { if (me) { let n = me.provides; const s = me.parent && me.parent.provides; s === n && (n = me.provides = Object.create(s)), n[e] = t } } function nn(e, t, n = !1) {
    const s = me || _e; if (s || Lt) {
      const r = Lt ? Lt._context.provides : s ? s.parent == null ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0; if (r && e in r)
        return r[e]; if (arguments.length > 1)
        return n && j(t) ? t.call(s && s.proxy) : t
    }
  } const no = {}; const so = () => Object.create(no); const ro = e => Object.getPrototypeOf(e) === no; function jl(e, t, n, s = !1) { const r = {}; const o = so(); e.propsDefaults = Object.create(null), oo(e, t, r, o); for (const i in e.propsOptions[0])i in r || (r[i] = void 0); n ? e.props = s ? r : Xi(r) : e.type.props ? e.props = r : e.props = o, e.attrs = o } function Hl(e, t, n, s) {
    const { props: r, attrs: o, vnode: { patchFlag: i } } = e; const l = V(r); const [u] = e.propsOptions; let d = !1; if ((s || i > 0) && !(i & 16)) {
      if (i & 8) {
        const c = e.vnode.dynamicProps; for (let a = 0; a < c.length; a++) {
          const h = c[a]; if (jn(e.emitsOptions, h))
            continue; const m = t[h]; if (u) {
            if (k(o, h)) {
              m !== o[h] && (o[h] = m, d = !0)
            }
            else { const v = Je(h); r[v] = Cs(u, l, v, m, e, !1) }
          }
          else {
            m !== o[h] && (o[h] = m, d = !0)
          }
        }
      }
    }
    else {
      oo(e, t, r, o) && (d = !0); let c; for (const a in l)(!t || !k(t, a) && ((c = gt(a)) === a || !k(t, c))) && (u ? n && (n[a] !== void 0 || n[c] !== void 0) && (r[a] = Cs(u, l, a, void 0, e, !0)) : delete r[a]); if (o !== l) {
        for (const a in o)(!t || !k(t, a)) && (delete o[a], d = !0)
      }
    }d && ze(e.attrs, 'set', '')
  } function oo(e, t, n, s) {
    const [r, o] = e.propsOptions; let i = !1; let l; if (t) {
      for (const u in t) {
        if (jt(u))
          continue; const d = t[u]; let c; r && k(r, c = Je(u)) ? !o || !o.includes(c) ? n[c] = d : (l || (l = {}))[c] = d : jn(e.emitsOptions, u) || (!(u in s) || d !== s[u]) && (s[u] = d, i = !0)
      }
    } if (o) { const u = V(n); const d = l || G; for (let c = 0; c < o.length; c++) { const a = o[c]; n[a] = Cs(r, u, a, d[a], e, !k(d, a)) } } return i
  } function Cs(e, t, n, s, r, o) {
    const i = e[n]; if (i != null) {
      const l = k(i, 'default'); if (l && s === void 0) {
        const u = i.default; if (i.type !== Function && !i.skipFactory && j(u)) {
          const { propsDefaults: d } = r; if (n in d) {
            s = d[n]
          }
          else { const c = ln(r); s = d[n] = u.call(null, t), c() }
        }
        else {
          s = u
        }r.ce && r.ce._setProp(n, s)
      }i[0] && (o && !l ? s = !1 : i[1] && (s === '' || s === gt(n)) && (s = !0))
    } return s
  } const Ul = new WeakMap(); function io(e, t, n = !1) {
    const s = n ? Ul : t.propsCache; const r = s.get(e); if (r)
      return r; const o = e.props; const i = {}; const l = []; let u = !1; if (!j(e)) { const c = (a) => { u = !0; const [h, m] = io(a, t, !0); ce(i, h), m && l.push(...m) }; !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c) } if (!o && !u)
      return se(e) && s.set(e, At), At; if (N(o)) {
      for (let c = 0; c < o.length; c++) { const a = Je(o[c]); lo(a) && (i[a] = G) }
    }
    else if (o) {
      for (const c in o) {
        const a = Je(c); if (lo(a)) {
          const h = o[c]; const m = i[a] = N(h) || j(h) ? { type: h } : ce({}, h); const v = m.type; let w = !1; let L = !0; if (N(v)) {
            for (let T = 0; T < v.length; ++T) {
              const F = v[T]; const $ = j(F) && F.name; if ($ === 'Boolean') { w = !0; break }
              else {
                $ === 'String' && (L = !1)
              }
            }
          }
          else {
            w = j(v) && v.name === 'Boolean'
          }m[0] = w, m[1] = L, (w || k(m, 'default')) && l.push(a)
        }
      }
    } const d = [i, l]; return se(e) && s.set(e, d), d
  } function lo(e) { return e[0] !== '$' && !jt(e) } const xs = e => e[0] === '_' || e === '$stable'; const Ss = e => N(e) ? e.map(Ve) : [Ve(e)]; const Vl = (e, t, n) => {
    if (t._n)
      return t; const s = Z((...r) => Ss(t(...r)), n); return s._c = !1, s
  }; const uo = (e, t, n) => {
    const s = e._ctx; for (const r in e) {
      if (xs(r))
        continue; const o = e[r]; if (j(o)) {
        t[r] = Vl(r, o, s)
      }
      else if (o != null) { const i = Ss(o); t[r] = () => i }
    }
  }; const co = (e, t) => { const n = Ss(t); e.slots.default = () => n }; const ao = (e, t, n) => { for (const s in t)(n || !xs(s)) && (e[s] = t[s]) }; const Kl = (e, t, n) => {
    const s = e.slots = so(); if (e.vnode.shapeFlag & 32) { const r = t._; r ? (ao(s, t, n), n && Ys(s, '_', r, !0)) : uo(t, s) }
    else {
      t && co(e, t)
    }
  }; const Wl = (e, t, n) => {
    const { vnode: s, slots: r } = e; let o = !0; let i = G; if (s.shapeFlag & 32) { const l = t._; l ? n && l === 1 ? o = !1 : ao(r, t, n) : (o = !t.$stable, uo(t, r)), i = t }
    else {
      t && (co(e, t), i = { default: 1 })
    } if (o) {
      for (const l in r)!xs(l) && i[l] == null && delete r[l]
    }
  }; const Ce = ru; function kl(e) { return ql(e) } function ql(e, t) {
    const n = bn(); n.__VUE__ = !0; const { insert: s, remove: r, patchProp: o, createElement: i, createText: l, createComment: u, setText: d, setElementText: c, parentNode: a, nextSibling: h, setScopeId: m = Be, insertStaticContent: v } = e; const w = (f, p, g, _ = null, y = null, b = null, S = void 0, x = null, C = !!p.dynamicChildren) => {
      if (f === p)
        return; f && !Et(f, p) && (_ = zn(f), We(f, y, b, !0), f = null), p.patchFlag === -2 && (C = !1, p.dynamicChildren = null); const { type: E, ref: M, shapeFlag: O } = p; switch (E) { case Hn:L(f, p, g, _); break; case pe:T(f, p, g, _); break; case Ps:f == null && F(p, g, _, S); break; case xe:D(f, p, g, _, y, b, S, x, C); break; default:O & 1 ? H(f, p, g, _, y, b, S, x, C) : O & 6 ? ee(f, p, g, _, y, b, S, x, C) : (O & 64 || O & 128) && E.process(f, p, g, _, y, b, S, x, C, pn) }M != null && y && Ln(M, f && f.ref, b, p || f, !p)
    }; const L = (f, p, g, _) => {
      if (f == null) {
        s(p.el = l(p.children), g, _)
      }
      else { const y = p.el = f.el; p.children !== f.children && d(y, p.children) }
    }; const T = (f, p, g, _) => { f == null ? s(p.el = u(p.children || ''), g, _) : p.el = f.el }; const F = (f, p, g, _) => { [f.el, f.anchor] = v(f.children, p, g, _, f.el, f.anchor) }; const $ = ({ el: f, anchor: p }, g, _) => { let y; for (;f && f !== p;)y = h(f), s(f, g, _), f = y; s(p, g, _) }; const A = ({ el: f, anchor: p }) => { let g; for (;f && f !== p;)g = h(f), r(f), f = g; r(p) }; const H = (f, p, g, _, y, b, S, x, C) => { p.type === 'svg' ? S = 'svg' : p.type === 'math' && (S = 'mathml'), f == null ? U(p, g, _, y, b, S, x, C) : R(f, p, y, b, S, x, C) }; const U = (f, p, g, _, y, b, S, x) => { let C, E; const { props: M, shapeFlag: O, transition: I, dirs: B } = f; if (C = f.el = i(f.type, b, M && M.is, M), O & 8 ? c(C, f.children) : O & 16 && oe(f.children, C, null, _, y, Os(f, b), S, x), B && bt(f, null, _, 'created'), re(C, f, f.scopeId, S, _), M) { for (const X in M)X !== 'value' && !jt(X) && o(C, X, null, M[X], b, _); 'value' in M && o(C, 'value', null, M.value, b), (E = M.onVnodeBeforeMount) && Ke(E, _, f) }B && bt(f, null, _, 'beforeMount'); const W = Gl(y, I); W && I.beforeEnter(C), s(C, p, g), ((E = M && M.onVnodeMounted) || W || B) && Ce(() => { E && Ke(E, _, f), W && I.enter(C), B && bt(f, null, _, 'mounted') }, y) }; const re = (f, p, g, _, y) => {
      if (g && m(f, g), _) {
        for (let b = 0; b < _.length; b++)m(f, _[b])
      } if (y) { const b = y.subTree; if (p === b || yo(b.type) && (b.ssContent === p || b.ssFallback === p)) { const S = y.vnode; re(f, S, S.scopeId, S.slotScopeIds, y.parent) } }
    }; const oe = (f, p, g, _, y, b, S, x, C = 0) => { for (let E = C; E < f.length; E++) { const M = f[E] = x ? ct(f[E]) : Ve(f[E]); w(null, M, p, g, _, y, b, S, x) } }; const R = (f, p, g, _, y, b, S) => {
      const x = p.el = f.el; let { patchFlag: C, dynamicChildren: E, dirs: M } = p; C |= f.patchFlag & 16; const O = f.props || G; const I = p.props || G; let B; if (g && _t(g, !1), (B = I.onVnodeBeforeUpdate) && Ke(B, g, p, f), M && bt(p, f, g, 'beforeUpdate'), g && _t(g, !0), (O.innerHTML && I.innerHTML == null || O.textContent && I.textContent == null) && c(x, ''), E ? K(f.dynamicChildren, E, x, g, _, Os(p, y), b) : S || Y(f, p, x, null, g, _, Os(p, y), b, !1), C > 0) {
        if (C & 16) {
          z(x, O, I, g, y)
        }
        else if (C & 2 && O.class !== I.class && o(x, 'class', null, I.class, y), C & 4 && o(x, 'style', O.style, I.style, y), C & 8) { const W = p.dynamicProps; for (let X = 0; X < W.length; X++) { const q = W[X]; const Ae = O[q]; const Se = I[q]; (Se !== Ae || q === 'value') && o(x, q, Ae, Se, y, g) } }C & 1 && f.children !== p.children && c(x, p.children)
      }
      else {
        !S && E == null && z(x, O, I, g, y)
      } ((B = I.onVnodeUpdated) || M) && Ce(() => { B && Ke(B, g, p, f), M && bt(p, f, g, 'updated') }, _)
    }; const K = (f, p, g, _, y, b, S) => { for (let x = 0; x < p.length; x++) { const C = f[x]; const E = p[x]; const M = C.el && (C.type === xe || !Et(C, E) || C.shapeFlag & 70) ? a(C.el) : g; w(C, E, M, null, _, y, b, S, !0) } }; const z = (f, p, g, _, y) => {
      if (p !== g) {
        if (p !== G) {
          for (const b in p)!jt(b) && !(b in g) && o(f, b, p[b], null, y, _)
        } for (const b in g) {
          if (jt(b))
            continue; const S = g[b]; const x = p[b]; S !== x && b !== 'value' && o(f, b, x, S, y, _)
        }'value' in g && o(f, 'value', p.value, g.value, y)
      }
    }; const D = (f, p, g, _, y, b, S, x, C) => { const E = p.el = f ? f.el : l(''); const M = p.anchor = f ? f.anchor : l(''); const { patchFlag: O, dynamicChildren: I, slotScopeIds: B } = p; B && (x = x ? x.concat(B) : B), f == null ? (s(E, g, _), s(M, g, _), oe(p.children || [], g, M, y, b, S, x, C)) : O > 0 && O & 64 && I && f.dynamicChildren ? (K(f.dynamicChildren, I, g, y, b, S, x), (p.key != null || y && p === y.subTree) && Ts(f, p, !0)) : Y(f, p, g, M, y, b, S, x, C) }; const ee = (f, p, g, _, y, b, S, x, C) => { p.slotScopeIds = x, f == null ? p.shapeFlag & 512 ? y.ctx.activate(p, g, _, S, C) : ve(p, g, _, y, b, S, C) : st(f, p, C) }; const ve = (f, p, g, _, y, b, S) => {
      const x = f.component = au(f, _, y); if (Rn(f) && (x.ctx.renderer = pn), fu(x, !1, S), x.asyncDep) { if (y && y.registerDep(x, de, S), !f.el) { const C = x.subTree = Q(pe); T(null, C, p, g) } }
      else {
        de(x, f, p, g, y, b, S)
      }
    }; const st = (f, p, g) => {
      const _ = p.component = f.component; if (nu(f, p, g)) {
        if (_.asyncDep && !_.asyncResolved) { te(_, p, g) }
        else {
          _.next = p, _.update()
        }
      }
      else {
        p.el = f.el, _.vnode = p
      }
    }; const de = (f, p, g, _, y, b, S) => {
      const x = () => {
        if (f.isMounted) { let { next: O, bu: I, u: B, parent: W, vnode: X } = f; { const qe = fo(f); if (qe) { O && (O.el = X.el, te(f, O, S)), qe.asyncDep.then(() => { f.isUnmounted || x() }); return } } const q = O; let Ae; _t(f, !1), O ? (O.el = X.el, te(f, O, S)) : O = X, I && Qn(I), (Ae = O.props && O.props.onVnodeBeforeUpdate) && Ke(Ae, W, O, X), _t(f, !0); const Se = mo(f); const ke = f.subTree; f.subTree = Se, w(ke, Se, a(ke.el), zn(ke), f, y, b), O.el = Se.el, q === null && su(f, Se.el), B && Ce(B, y), (Ae = O.props && O.props.onVnodeUpdated) && Ce(() => Ke(Ae, W, O, X), y) }
        else { let O; const { el: I, props: B } = p; const { bm: W, m: X, parent: q, root: Ae, type: Se } = f; const ke = Ft(p); _t(f, !1), W && Qn(W), !ke && (O = B && B.onVnodeBeforeMount) && Ke(O, q, p), _t(f, !0); { Ae.ce && Ae.ce._injectChildStyle(Se); const qe = f.subTree = mo(f); w(null, qe, g, _, f, y, b), p.el = qe.el } if (X && Ce(X, y), !ke && (O = B && B.onVnodeMounted)) { const qe = p; Ce(() => Ke(O, q, qe), y) }(p.shapeFlag & 256 || q && Ft(q.vnode) && q.vnode.shapeFlag & 256) && f.a && Ce(f.a, y), f.isMounted = !0, p = g = _ = null }
      }; f.scope.on(); const C = f.effect = new nr(x); f.scope.off(); const E = f.update = C.run.bind(C); const M = f.job = C.runIfDirty.bind(C); M.i = f, M.id = f.uid, C.scheduler = () => hs(M), _t(f, !0), E()
    }; const te = (f, p, g) => { p.component = f; const _ = f.vnode.props; f.vnode = p, f.next = null, Hl(f, p.props, _, g), Wl(f, p.children, g), je(), Tr(f), He() }; const Y = (f, p, g, _, y, b, S, x, C = !1) => {
      const E = f && f.children; const M = f ? f.shapeFlag : 0; const O = p.children; const { patchFlag: I, shapeFlag: B } = p; if (I > 0) {
        if (I & 128) { Jn(E, O, g, _, y, b, S, x, C); return }
        else if (I & 256) { St(E, O, g, _, y, b, S, x, C); return }
      }B & 8 ? (M & 16 && dn(E, y, b), O !== E && c(g, O)) : M & 16 ? B & 16 ? Jn(E, O, g, _, y, b, S, x, C) : dn(E, y, b, !0) : (M & 8 && c(g, ''), B & 16 && oe(O, g, _, y, b, S, x, C))
    }; const St = (f, p, g, _, y, b, S, x, C) => { f = f || At, p = p || At; const E = f.length; const M = p.length; const O = Math.min(E, M); let I; for (I = 0; I < O; I++) { const B = p[I] = C ? ct(p[I]) : Ve(p[I]); w(f[I], B, g, null, y, b, S, x, C) }E > M ? dn(f, y, b, !0, !1, O) : oe(p, g, _, y, b, S, x, C, O) }; const Jn = (f, p, g, _, y, b, S, x, C) => {
      let E = 0; const M = p.length; let O = f.length - 1; let I = M - 1; for (;E <= O && E <= I;) {
        const B = f[E]; const W = p[E] = C ? ct(p[E]) : Ve(p[E]); if (Et(B, W))
          w(B, W, g, null, y, b, S, x, C); else break; E++
      } for (;E <= O && E <= I;) {
        const B = f[O]; const W = p[I] = C ? ct(p[I]) : Ve(p[I]); if (Et(B, W))
          w(B, W, g, null, y, b, S, x, C); else break; O--, I--
      } if (E > O) { if (E <= I) { const B = I + 1; const W = B < M ? p[B].el : _; for (;E <= I;)w(null, p[E] = C ? ct(p[E]) : Ve(p[E]), g, W, y, b, S, x, C), E++ } }
      else if (E > I) {
        for (;E <= O;)We(f[E], y, b, !0), E++
      }
      else {
        const B = E; const W = E; const X = new Map(); for (E = W; E <= I; E++) { const Pe = p[E] = C ? ct(p[E]) : Ve(p[E]); Pe.key != null && X.set(Pe.key, E) } let q; let Ae = 0; const Se = I - W + 1; let ke = !1; let qe = 0; const hn = new Array(Se); for (E = 0; E < Se; E++)hn[E] = 0; for (E = B; E <= O; E++) {
          const Pe = f[E]; if (Ae >= Se) { We(Pe, y, b, !0); continue } let Ge; if (Pe.key != null) {
            Ge = X.get(Pe.key)
          }
          else {
            for (q = W; q <= I; q++) {
              if (hn[q - W] === 0 && Et(Pe, p[q])) { Ge = q; break }
            }
          }Ge === void 0 ? We(Pe, y, b, !0) : (hn[Ge - W] = E + 1, Ge >= qe ? qe = Ge : ke = !0, w(Pe, p[Ge], g, null, y, b, S, x, C), Ae++)
        } const pi = ke ? Jl(hn) : At; for (q = pi.length - 1, E = Se - 1; E >= 0; E--) { const Pe = W + E; const Ge = p[Pe]; const hi = Pe + 1 < M ? p[Pe + 1].el : _; hn[E] === 0 ? w(null, Ge, g, hi, y, b, S, x, C) : ke && (q < 0 || E !== pi[q] ? Ot(Ge, g, hi, 2) : q--) }
      }
    }; const Ot = (f, p, g, _, y = null) => {
      const { el: b, type: S, transition: x, children: C, shapeFlag: E } = f; if (E & 6) { Ot(f.component.subTree, p, g, _); return } if (E & 128) { f.suspense.move(p, g, _); return } if (E & 64) { S.move(f, p, g, pn); return } if (S === xe) { s(b, p, g); for (let O = 0; O < C.length; O++)Ot(C[O], p, g, _); s(f.anchor, p, g); return } if (S === Ps) { $(f, p, g); return } if (_ !== 2 && E & 1 && x) {
        if (_ === 0) {
          x.beforeEnter(b), s(b, p, g), Ce(() => x.enter(b), y)
        }
        else { const { leave: O, delayLeave: I, afterLeave: B } = x; const W = () => { f.ctx.isUnmounted ? r(b) : s(b, p, g) }; const X = () => { O(b, () => { W(), B && B() }) }; I ? I(b, W, X) : X() }
      }
      else {
        s(b, p, g)
      }
    }; const We = (f, p, g, _ = !1, y = !1) => {
      const { type: b, props: S, ref: x, children: C, dynamicChildren: E, shapeFlag: M, patchFlag: O, dirs: I, cacheIndex: B } = f; if (O === -2 && (y = !1), x != null && (je(), Ln(x, null, g, f, !0), He()), B != null && (p.renderCache[B] = void 0), M & 256) { p.ctx.deactivate(f); return } const W = M & 1 && I; const X = !Ft(f); let q; if (X && (q = S && S.onVnodeBeforeUnmount) && Ke(q, p, f), M & 6) {
        Qc(f.component, g, _)
      }
      else { if (M & 128) { f.suspense.unmount(g, _); return }W && bt(f, null, p, 'beforeUnmount'), M & 64 ? f.type.remove(f, p, g, pn, _) : E && !E.hasOnce && (b !== xe || O > 0 && O & 64) ? dn(E, p, g, !1, !0) : (b === xe && O & 384 || !y && M & 16) && dn(C, p, g), _ && fi(f) }(X && (q = S && S.onVnodeUnmounted) || W) && Ce(() => { q && Ke(q, p, f), W && bt(f, null, p, 'unmounted') }, g)
    }; const fi = (f) => {
      const { type: p, el: g, anchor: _, transition: y } = f; if (p === xe) { Zc(g, _); return } if (p === Ps) { A(f); return } const b = () => { r(g), y && !y.persisted && y.afterLeave && y.afterLeave() }; if (f.shapeFlag & 1 && y && !y.persisted) { const { leave: S, delayLeave: x } = y; const C = () => S(g, b); x ? x(f.el, b, C) : C() }
      else {
        b()
      }
    }; const Zc = (f, p) => { let g; for (;f !== p;)g = h(f), r(f), f = g; r(p) }; const Qc = (f, p, g) => { const { bum: _, scope: y, job: b, subTree: S, um: x, m: C, a: E, parent: M, slots: { __: O } } = f; po(C), po(E), _ && Qn(_), M && N(O) && O.forEach((I) => { M.renderCache[I] = void 0 }), y.stop(), b && (b.flags |= 8, We(S, f, p, g)), x && Ce(x, p), Ce(() => { f.isUnmounted = !0 }, p), p && p.pendingBranch && !p.isUnmounted && f.asyncDep && !f.asyncResolved && f.suspenseId === p.pendingId && (p.deps--, p.deps === 0 && p.resolve()) }; const dn = (f, p, g, _ = !1, y = !1, b = 0) => { for (let S = b; S < f.length; S++)We(f[S], p, g, _, y) }; const zn = (f) => {
      if (f.shapeFlag & 6)
        return zn(f.component.subTree); if (f.shapeFlag & 128)
        return f.suspense.next(); const p = h(f.anchor || f.el); const g = p && p[Ir]; return g ? h(g) : p
    }; let Gs = !1; const di = (f, p, g) => { f == null ? p._vnode && We(p._vnode, null, null, !0) : w(p._vnode || null, f, p, null, null, null, g), p._vnode = f, Gs || (Gs = !0, Tr(), Ar(), Gs = !1) }; const pn = { p: w, um: We, m: Ot, r: fi, mt: ve, mc: oe, pc: Y, pbc: K, n: zn, o: e }; return { render: di, hydrate: void 0, createApp: Bl(di) }
  } function Os({ type: e, props: t }, n) { return n === 'svg' && e === 'foreignObject' || n === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html') ? void 0 : n } function _t({ effect: e, job: t }, n) { n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5) } function Gl(e, t) { return (!e || e && !e.pendingBranch) && t && !t.persisted } function Ts(e, t, n = !1) {
    const s = e.children; const r = t.children; if (N(s) && N(r)) {
      for (let o = 0; o < s.length; o++) { const i = s[o]; let l = r[o]; l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[o] = ct(r[o]), l.el = i.el), !n && l.patchFlag !== -2 && Ts(i, l)), l.type === Hn && (l.el = i.el), l.type === pe && !l.el && (l.el = i.el) }
    }
  } function Jl(e) { const t = e.slice(); const n = [0]; let s, r, o, i, l; const u = e.length; for (s = 0; s < u; s++) { const d = e[s]; if (d !== 0) { if (r = n[n.length - 1], e[r] < d) { t[s] = r, n.push(s); continue } for (o = 0, i = n.length - 1; o < i;)l = o + i >> 1, e[n[l]] < d ? o = l + 1 : i = l; d < e[n[o]] && (o > 0 && (t[s] = n[o - 1]), n[o] = s) } } for (o = n.length, i = n[o - 1]; o-- > 0;)n[o] = i, i = t[i]; return n } function fo(e) {
    const t = e.subTree.component; if (t)
      return t.asyncDep && !t.asyncResolved ? t : fo(t)
  } function po(e) {
    if (e) {
      for (let t = 0; t < e.length; t++)e[t].flags |= 8
    }
  } const zl = Symbol.for('v-scx'); const Yl = () => nn(zl); function Rt(e, t) { return As(e, null, t) } function Re(e, t, n) { return As(e, t, n) } function As(e, t, n = G) {
    const { immediate: s, deep: r, flush: o, once: i } = n; const l = ce({}, n); const u = t && s || !t && o !== 'post'; let d; if (un) {
      if (o === 'sync') { const m = Yl(); d = m.__watcherHandles || (m.__watcherHandles = []) }
      else if (!u) { const m = () => {}; return m.stop = Be, m.resume = Be, m.pause = Be, m }
    } const c = me; l.call = (m, v, w) => Le(m, c, v, w); let a = !1; o === 'post' ? l.scheduler = (m) => { Ce(m, c && c.suspense) } : o !== 'sync' && (a = !0, l.scheduler = (m, v) => { v ? m() : hs(m) }), l.augmentJob = (m) => { t && (m.flags |= 4), a && (m.flags |= 2, c && (m.id = c.uid, m.i = c)) }; const h = ll(e, t, l); return un && (d ? d.push(h) : u && h()), h
  } function Xl(e, t, n) { const s = this.proxy; const r = ne(e) ? e.includes('.') ? ho(s, e) : () => s[e] : e.bind(s, s); let o; j(t) ? o = t : (o = t.handler, n = t); const i = ln(this); const l = As(r, o.bind(s), n); return i(), l } function ho(e, t) { const n = t.split('.'); return () => { let s = e; for (let r = 0; r < n.length && s; r++)s = s[n[r]]; return s } } const Zl = (e, t) => t === 'modelValue' || t === 'model-value' ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Je(t)}Modifiers`] || e[`${gt(t)}Modifiers`]; function Ql(e, t, ...n) {
    if (e.isUnmounted)
      return; const s = e.vnode.props || G; let r = n; const o = t.startsWith('update:'); const i = o && Zl(s, t.slice(7)); i && (i.trim && (r = n.map(c => ne(c) ? c.trim() : c)), i.number && (r = n.map(Ci))); let l; let u = s[l = yn(t)] || s[l = yn(Je(t))]; !u && o && (u = s[l = yn(gt(t))]), u && Le(u, e, 6, r); const d = s[`${l}Once`]; if (d) {
      if (!e.emitted)
        e.emitted = {}; else if (e.emitted[l])
        return; e.emitted[l] = !0, Le(d, e, 6, r)
    }
  } function go(e, t, n = !1) {
    const s = t.emitsCache; const r = s.get(e); if (r !== void 0)
      return r; const o = e.emits; const i = {}; let l = !1; if (!j(e)) { const u = (d) => { const c = go(d, t, !0); c && (l = !0, ce(i, c)) }; !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u) } return !o && !l ? (se(e) && s.set(e, null), null) : (N(o) ? o.forEach(u => i[u] = null) : ce(i, o), se(e) && s.set(e, i), i)
  } function jn(e, t) { return !e || !gn(t) ? !1 : (t = t.slice(2).replace(/Once$/, ''), k(e, t[0].toLowerCase() + t.slice(1)) || k(e, gt(t)) || k(e, t)) } function sa() {} function mo(e) {
    const { type: t, vnode: n, proxy: s, withProxy: r, propsOptions: [o], slots: i, attrs: l, emit: u, render: d, renderCache: c, props: a, data: h, setupState: m, ctx: v, inheritAttrs: w } = e; const L = Dn(e); let T, F; try {
      if (n.shapeFlag & 4) { const A = r || s; const H = A; T = Ve(d.call(H, A, c, a, m, h, v)), F = l }
      else { const A = t; T = Ve(A.length > 1 ? A(a, { attrs: l, slots: i, emit: u }) : A(a, null)), F = t.props ? l : eu(l) }
    }
    catch (A) { sn.length = 0, An(A, e, 1), T = Q(pe) } let $ = T; if (F && w !== !1) { const A = Object.keys(F); const { shapeFlag: H } = $; A.length && H & 7 && (o && A.some(Yn) && (F = tu(F, o)), $ = Ze($, F, !1, !0)) } return n.dirs && ($ = Ze($, null, !1, !0), $.dirs = $.dirs ? $.dirs.concat(n.dirs) : n.dirs), n.transition && Zt($, n.transition), T = $, Dn(L), T
  } const eu = (e) => { let t; for (const n in e)(n === 'class' || n === 'style' || gn(n)) && ((t || (t = {}))[n] = e[n]); return t }; const tu = (e, t) => { const n = {}; for (const s in e)(!Yn(s) || !(s.slice(9) in t)) && (n[s] = e[s]); return n }; function nu(e, t, n) {
    const { props: s, children: r, component: o } = e; const { props: i, children: l, patchFlag: u } = t; const d = o.emitsOptions; if (t.dirs || t.transition)
      return !0; if (n && u >= 0) {
      if (u & 1024)
        return !0; if (u & 16)
        return s ? vo(s, i, d) : !!i; if (u & 8) {
        const c = t.dynamicProps; for (let a = 0; a < c.length; a++) {
          const h = c[a]; if (i[h] !== s[h] && !jn(d, h))
            return !0
        }
      }
    }
    else {
      return (r || l) && (!l || !l.$stable) ? !0 : s === i ? !1 : s ? i ? vo(s, i, d) : !0 : !!i
    } return !1
  } function vo(e, t, n) {
    const s = Object.keys(t); if (s.length !== Object.keys(e).length)
      return !0; for (let r = 0; r < s.length; r++) {
      const o = s[r]; if (t[o] !== e[o] && !jn(n, o))
        return !0
    } return !1
  } function su({ vnode: e, parent: t }, n) {
    for (;t;) {
      const s = t.subTree; if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
        (e = t.vnode).el = n, t = t.parent; else break
    }
  } const yo = e => e.__isSuspense; function ru(e, t) { t && t.pendingBranch ? N(e) ? t.effects.push(...e) : t.effects.push(e) : hl(e) } const xe = Symbol.for('v-fgt'); const Hn = Symbol.for('v-txt'); const pe = Symbol.for('v-cmt'); const Ps = Symbol.for('v-stc'); const sn = []; let Oe = null; function le(e = !1) { sn.push(Oe = e ? null : []) } function ou() { sn.pop(), Oe = sn[sn.length - 1] || null } let rn = 1; function bo(e, t = !1) { rn += e, e < 0 && Oe && t && (Oe.hasOnce = !0) } function iu(e) { return e.dynamicChildren = rn > 0 ? Oe || At : null, ou(), rn > 0 && Oe && Oe.push(e), e } function ue(e, t, n, s, r) { return iu(Q(e, t, n, s, r, !0)) } function on(e) { return e ? e.__v_isVNode === !0 : !1 } function Et(e, t) { return e.type === t.type && e.key === t.key } const _o = ({ key: e }) => e ?? null; const Un = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == 'number' && (e = `${e}`), e != null ? ne(e) || ae(e) || j(e) ? { i: _e, r: e, k: t, f: !!n } : e : null); function Te(e, t = null, n = null, s = 0, r = null, o = e === xe ? 0 : 1, i = !1, l = !1) { const u = { __v_isVNode: !0, __v_skip: !0, type: e, props: t, key: t && _o(t), ref: t && Un(t), scopeId: Dr, slotScopeIds: null, children: n, component: null, suspense: null, ssContent: null, ssFallback: null, dirs: null, transition: null, el: null, anchor: null, target: null, targetStart: null, targetAnchor: null, staticCount: 0, shapeFlag: o, patchFlag: s, dynamicProps: r, dynamicChildren: null, appContext: null, ctx: _e }; return l ? (Ds(u, n), o & 128 && e.normalize(u)) : n && (u.shapeFlag |= ne(n) ? 8 : 16), rn > 0 && !i && Oe && (u.patchFlag > 0 || o & 6) && u.patchFlag !== 32 && Oe.push(u), u } const Q = lu; function lu(e, t = null, n = null, s = 0, r = null, o = !1) { if ((!e || e === Dl) && (e = pe), on(e)) { const l = Ze(e, t, !0); return n && Ds(l, n), rn > 0 && !o && Oe && (l.shapeFlag & 6 ? Oe[Oe.indexOf(e)] = l : Oe.push(l)), l.patchFlag = -2, l } if (yu(e) && (e = e.__vccOpts), t) { t = Eo(t); let { class: l, style: u } = t; l && !ne(l) && (t.class = _n(l)), se(u) && (fs(u) && !N(u) && (u = ce({}, u)), t.style = Ht(u)) } const i = ne(e) ? 1 : yo(e) ? 128 : Mr(e) ? 64 : se(e) ? 4 : j(e) ? 2 : 0; return Te(e, t, n, s, r, i, o, !0) } function Eo(e) { return e ? fs(e) || ro(e) ? ce({}, e) : e : null } function Ze(e, t, n = !1, s = !1) { const { props: r, ref: o, patchFlag: i, children: l, transition: u } = e; const d = t ? $e(r || {}, t) : r; const c = { __v_isVNode: !0, __v_skip: !0, type: e.type, props: d, key: d && _o(d), ref: t && t.ref ? n && o ? N(o) ? o.concat(Un(t)) : [o, Un(t)] : Un(t) : o, scopeId: e.scopeId, slotScopeIds: e.slotScopeIds, children: l, target: e.target, targetStart: e.targetStart, targetAnchor: e.targetAnchor, staticCount: e.staticCount, shapeFlag: e.shapeFlag, patchFlag: t && e.type !== xe ? i === -1 ? 16 : i | 16 : i, dynamicProps: e.dynamicProps, dynamicChildren: e.dynamicChildren, appContext: e.appContext, dirs: e.dirs, transition: u, component: e.component, suspense: e.suspense, ssContent: e.ssContent && Ze(e.ssContent), ssFallback: e.ssFallback && Ze(e.ssFallback), el: e.el, anchor: e.anchor, ctx: e.ctx, ce: e.ce }; return u && s && Zt(c, u.clone(c)), c } function wo(e = ' ', t = 0) { return Q(Hn, null, e, t) } function Co(e = '', t = !1) { return t ? (le(), ue(pe, null, e)) : Q(pe, null, e) } function Ve(e) { return e == null || typeof e == 'boolean' ? Q(pe) : N(e) ? Q(xe, null, e.slice()) : on(e) ? ct(e) : Q(Hn, null, String(e)) } function ct(e) { return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ze(e) } function Ds(e, t) {
    let n = 0; const { shapeFlag: s } = e; if (t == null) {
      t = null
    }
    else if (N(t)) {
      n = 16
    }
    else if (typeof t == 'object') {
      if (s & 65) { const r = t.default; r && (r._c && (r._d = !1), Ds(e, r()), r._c && (r._d = !0)); return }
      else { n = 32; const r = t._; !r && !ro(t) ? t._ctx = _e : r === 3 && _e && (_e.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024)) }
    }
    else {
      j(t) ? (t = { default: t, _ctx: _e }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [wo(t)]) : n = 8)
    }e.children = t, e.shapeFlag |= n
  } function $e(...e) {
    const t = {}; for (let n = 0; n < e.length; n++) {
      const s = e[n]; for (const r in s) {
        if (r === 'class') {
          t.class !== s.class && (t.class = _n([t.class, s.class]))
        }
        else if (r === 'style') {
          t.style = Ht([t.style, s.style])
        }
        else if (gn(r)) { const o = t[r]; const i = s[r]; i && o !== i && !(N(o) && o.includes(i)) && (t[r] = o ? [].concat(o, i) : i) }
        else {
          r !== '' && (t[r] = s[r])
        }
      }
    } return t
  } function Ke(e, t, n, s = null) { Le(e, t, 7, [n, s]) } const uu = eo(); let cu = 0; function au(e, t, n) { const s = e.type; const r = (t ? t.appContext : e.appContext) || uu; const o = { uid: cu++, vnode: e, type: s, parent: t, appContext: r, root: null, next: null, subTree: null, effect: null, update: null, job: null, scope: new Qs(!0), render: null, proxy: null, exposed: null, exposeProxy: null, withProxy: null, provides: t ? t.provides : Object.create(r.provides), ids: t ? t.ids : ['', 0, 0], accessCache: null, renderCache: [], components: null, directives: null, propsOptions: io(s, r), emitsOptions: go(s, r), emit: null, emitted: null, propsDefaults: G, inheritAttrs: s.inheritAttrs, ctx: G, data: G, props: G, attrs: G, slots: G, refs: G, setupState: G, setupContext: null, suspense: n, suspenseId: n ? n.pendingId : 0, asyncDep: null, asyncResolved: !1, isMounted: !1, isUnmounted: !1, isDeactivated: !1, bc: null, c: null, bm: null, m: null, bu: null, u: null, um: null, bum: null, da: null, a: null, rtg: null, rtc: null, ec: null, sp: null }; return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Ql.bind(null, o), e.ce && e.ce(o), o } let me = null; const at = () => me || _e; let Vn, Is; { const e = bn(); const t = (n, s) => { let r; return (r = e[n]) || (r = e[n] = []), r.push(s), (o) => { r.length > 1 ? r.forEach(i => i(o)) : r[0](o) } }; Vn = t('__VUE_INSTANCE_SETTERS__', n => me = n), Is = t('__VUE_SSR_SETTERS__', n => un = n) } const ln = (e) => { const t = me; return Vn(e), e.scope.on(), () => { e.scope.off(), Vn(t) } }; const xo = () => { me && me.scope.off(), Vn(null) }; function So(e) { return e.vnode.shapeFlag & 4 } let un = !1; function fu(e, t = !1, n = !1) { t && Is(t); const { props: s, children: r } = e.vnode; const o = So(e); jl(e, s, o, t), Kl(e, r, n || t); const i = o ? du(e, t) : void 0; return t && Is(!1), i } function du(e, t) {
    const n = e.type; e.accessCache = Object.create(null), e.proxy = new Proxy(e.ctx, Il); const { setup: s } = n; if (s) {
      je(); const r = e.setupContext = s.length > 1 ? hu(e) : null; const o = ln(e); const i = Dt(s, e, 0, [e.props, r]); const l = Js(i); if (He(), o(), (l || e.sp) && !Ft(e) && kr(e), l) {
        if (i.then(xo, xo), t)
          return i.then((u) => { Oo(e, u) }).catch((u) => { An(u, e, 0) }); e.asyncDep = i
      }
      else {
        Oo(e, i)
      }
    }
    else {
      To(e)
    }
  } function Oo(e, t, n) { j(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : se(t) && (e.setupState = wr(t)), To(e) } function To(e, t, n) {
    const s = e.type; e.render || (e.render = s.render || Be); { const r = ln(e); je(); try { Ml(e) }
    finally { He(), r() } }
  } const pu = { get(e, t) { return ge(e, 'get', ''), e[t] } }; function hu(e) { const t = (n) => { e.exposed = n || {} }; return { attrs: new Proxy(e.attrs, pu), slots: e.slots, emit: e.emit, expose: t } } function Ms(e) {
    return e.exposed
      ? e.exposeProxy || (e.exposeProxy = new Proxy(wr(Zi(e.exposed)), { get(t, n) {
        if (n in t)
          return t[n]; if (n in en)
          return en[n](e)
      }, has(t, n) { return n in t || n in en } }))
      : e.proxy
  } const gu = /(?:^|[-_])(\w)/g; const mu = e => e.replace(gu, t => t.toUpperCase()).replace(/[-_]/g, ''); function vu(e, t = !0) { return j(e) ? e.displayName || e.name : e.name || t && e.__name } function Ao(e, t, n = !1) {
    let s = vu(t); if (!s && t.__file) { const r = t.__file.match(/([^/\\]+)\.\w+$/); r && (s = r[1]) } if (!s && e && e.parent) {
      const r = (o) => {
        for (const i in o) {
          if (o[i] === t)
            return i
        }
      }; s = r(e.components || e.parent.type.components) || r(e.appContext.components)
    } return s ? mu(s) : n ? 'App' : 'Anonymous'
  } function yu(e) { return j(e) && '__vccOpts' in e } const Ie = (e, t) => ol(e, t, un); function cn(e, t, n) { const s = arguments.length; return s === 2 ? se(t) && !N(t) ? on(t) ? Q(e, null, [t]) : Q(e, t) : Q(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && on(n) && (n = [n]), Q(e, t, n)) } const bu = '3.5.14'/**
                                                                                                                                                                                                                                                                                                                                                            * @vue/runtime-dom v3.5.14
                                                                                                                                                                                                                                                                                                                                                            * (c) 2018-present Yuxi (Evan) You and Vue contributors
                                                                                                                                                                                                                                                                                                                                                            * @license MIT
                                                                                                                                                                                                                                                                                                                                                            */let Fs; const Po = typeof window < 'u' && window.trustedTypes; if (Po) {
    try { Fs = Po.createPolicy('vue', { createHTML: e => e }) }
    catch {}
  } const Do = Fs ? e => Fs.createHTML(e) : e => e; const _u = 'http://www.w3.org/2000/svg'; const Eu = 'http://www.w3.org/1998/Math/MathML'; const Qe = typeof document < 'u' ? document : null; const Io = Qe && Qe.createElement('template'); const wu = { insert: (e, t, n) => { t.insertBefore(e, n || null) }, remove: (e) => { const t = e.parentNode; t && t.removeChild(e) }, createElement: (e, t, n, s) => { const r = t === 'svg' ? Qe.createElementNS(_u, e) : t === 'mathml' ? Qe.createElementNS(Eu, e) : n ? Qe.createElement(e, { is: n }) : Qe.createElement(e); return e === 'select' && s && s.multiple != null && r.setAttribute('multiple', s.multiple), r }, createText: e => Qe.createTextNode(e), createComment: e => Qe.createComment(e), setText: (e, t) => { e.nodeValue = t }, setElementText: (e, t) => { e.textContent = t }, parentNode: e => e.parentNode, nextSibling: e => e.nextSibling, querySelector: e => Qe.querySelector(e), setScopeId(e, t) { e.setAttribute(t, '') }, insertStaticContent(e, t, n, s, r, o) {
    const i = n ? n.previousSibling : t.lastChild; if (r && (r === o || r.nextSibling)) {
      for (;t.insertBefore(r.cloneNode(!0), n), !(r === o || !(r = r.nextSibling)););
    }
    else { Io.innerHTML = Do(s === 'svg' ? `<svg>${e}</svg>` : s === 'mathml' ? `<math>${e}</math>` : e); const l = Io.content; if (s === 'svg' || s === 'mathml') { const u = l.firstChild; for (;u.firstChild;)l.appendChild(u.firstChild); l.removeChild(u) }t.insertBefore(l, n) } return [i ? i.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild]
  } }; const ft = 'transition'; const an = 'animation'; const fn = Symbol('_vtc'); const Mo = { name: String, type: String, css: { type: Boolean, default: !0 }, duration: [String, Number, Object], enterFromClass: String, enterActiveClass: String, enterToClass: String, appearFromClass: String, appearActiveClass: String, appearToClass: String, leaveFromClass: String, leaveActiveClass: String, leaveToClass: String }; const Cu = ce({}, Br, Mo); const Fo = (e => (e.displayName = 'Transition', e.props = Cu, e))((e, { slots: t }) => cn(bl, xu(e), t)); const wt = (e, t = []) => { N(e) ? e.forEach(n => n(...t)) : e && e(...t) }; const Lo = e => e ? N(e) ? e.some(t => t.length > 1) : e.length > 1 : !1; function xu(e) {
    const t = {}; for (const D in e)D in Mo || (t[D] = e[D]); if (e.css === !1)
      return t; const { name: n = 'v', type: s, duration: r, enterFromClass: o = `${n}-enter-from`, enterActiveClass: i = `${n}-enter-active`, enterToClass: l = `${n}-enter-to`, appearFromClass: u = o, appearActiveClass: d = i, appearToClass: c = l, leaveFromClass: a = `${n}-leave-from`, leaveActiveClass: h = `${n}-leave-active`, leaveToClass: m = `${n}-leave-to` } = e; const v = Su(r); const w = v && v[0]; const L = v && v[1]; const { onBeforeEnter: T, onEnter: F, onEnterCancelled: $, onLeave: A, onLeaveCancelled: H, onBeforeAppear: U = T, onAppear: re = F, onAppearCancelled: oe = $ } = t; const R = (D, ee, ve, st) => { D._enterCancelled = st, Ct(D, ee ? c : l), Ct(D, ee ? d : i), ve && ve() }; const K = (D, ee) => { D._isLeaving = !1, Ct(D, a), Ct(D, m), Ct(D, h), ee && ee() }; const z = D => (ee, ve) => { const st = D ? re : F; const de = () => R(ee, D, ve); wt(st, [ee, de]), Ro(() => { Ct(ee, D ? u : o), et(ee, D ? c : l), Lo(st) || $o(ee, s, w, de) }) }; return ce(t, { onBeforeEnter(D) { wt(T, [D]), et(D, o), et(D, i) }, onBeforeAppear(D) { wt(U, [D]), et(D, u), et(D, d) }, onEnter: z(!1), onAppear: z(!0), onLeave(D, ee) { D._isLeaving = !0; const ve = () => K(D, ee); et(D, a), D._enterCancelled ? (et(D, h), jo()) : (jo(), et(D, h)), Ro(() => { D._isLeaving && (Ct(D, a), et(D, m), Lo(A) || $o(D, s, L, ve)) }), wt(A, [D, ve]) }, onEnterCancelled(D) { R(D, !1, void 0, !0), wt($, [D]) }, onAppearCancelled(D) { R(D, !0, void 0, !0), wt(oe, [D]) }, onLeaveCancelled(D) { K(D), wt(H, [D]) } })
  } function Su(e) {
    if (e == null)
      return null; if (se(e))
      return [Ls(e.enter), Ls(e.leave)]; { const t = Ls(e); return [t, t] }
  } function Ls(e) { return xi(e) } function et(e, t) { t.split(/\s+/).forEach(n => n && e.classList.add(n)), (e[fn] || (e[fn] = new Set())).add(t) } function Ct(e, t) { t.split(/\s+/).forEach(s => s && e.classList.remove(s)); const n = e[fn]; n && (n.delete(t), n.size || (e[fn] = void 0)) } function Ro(e) { requestAnimationFrame(() => { requestAnimationFrame(e) }) } let Ou = 0; function $o(e, t, n, s) {
    const r = e._endId = ++Ou; const o = () => { r === e._endId && s() }; if (n != null)
      return setTimeout(o, n); const { type: i, timeout: l, propCount: u } = Tu(e, t); if (!i)
      return s(); const d = `${i}end`; let c = 0; const a = () => { e.removeEventListener(d, h), o() }; const h = (m) => { m.target === e && ++c >= u && a() }; setTimeout(() => { c < u && a() }, l + 1), e.addEventListener(d, h)
  } function Tu(e, t) { const n = window.getComputedStyle(e); const s = v => (n[v] || '').split(', '); const r = s(`${ft}Delay`); const o = s(`${ft}Duration`); const i = No(r, o); const l = s(`${an}Delay`); const u = s(`${an}Duration`); const d = No(l, u); let c = null; let a = 0; let h = 0; t === ft ? i > 0 && (c = ft, a = i, h = o.length) : t === an ? d > 0 && (c = an, a = d, h = u.length) : (a = Math.max(i, d), c = a > 0 ? i > d ? ft : an : null, h = c ? c === ft ? o.length : u.length : 0); const m = c === ft && /\b(transform|all)(,|$)/.test(s(`${ft}Property`).toString()); return { type: c, timeout: a, propCount: h, hasTransform: m } } function No(e, t) { for (;e.length < t.length;)e = e.concat(e); return Math.max(...t.map((n, s) => Bo(n) + Bo(e[s]))) } function Bo(e) { return e === 'auto' ? 0 : Number(e.slice(0, -1).replace(',', '.')) * 1e3 } function jo() { return document.body.offsetHeight } function Au(e, t, n) { const s = e[fn]; s && (t = (t ? [t, ...s] : [...s]).join(' ')), t == null ? e.removeAttribute('class') : n ? e.setAttribute('class', t) : e.className = t } const Ho = Symbol('_vod'); const Pu = Symbol('_vsh'); const Du = Symbol(''); const Iu = /(^|;)\s*display\s*:/; function Mu(e, t, n) {
    const s = e.style; const r = ne(n); let o = !1; if (n && !r) {
      if (t) {
        if (ne(t)) {
          for (const i of t.split(';')) { const l = i.slice(0, i.indexOf(':')).trim(); n[l] == null && Kn(s, l, '') }
        }
        else {
          for (const i in t)n[i] == null && Kn(s, i, '')
        }
      } for (const i in n)i === 'display' && (o = !0), Kn(s, i, n[i])
    }
    else if (r) { if (t !== n) { const i = s[Du]; i && (n += `;${i}`), s.cssText = n, o = Iu.test(n) } }
    else {
      t && e.removeAttribute('style')
    }Ho in e && (e[Ho] = o ? s.display : '', e[Pu] && (s.display = 'none'))
  } const Uo = /\s*!important$/; function Kn(e, t, n) {
    if (N(n)) {
      n.forEach(s => Kn(e, t, s))
    }
    else if (n == null && (n = ''), t.startsWith('--')) {
      e.setProperty(t, n)
    }
    else { const s = Fu(e, t); Uo.test(n) ? e.setProperty(gt(s), n.replace(Uo, ''), 'important') : e[s] = n }
  } const Vo = ['Webkit', 'Moz', 'ms']; const Rs = {}; function Fu(e, t) {
    const n = Rs[t]; if (n)
      return n; let s = Je(t); if (s !== 'filter' && s in e)
      return Rs[t] = s; s = zs(s); for (let r = 0; r < Vo.length; r++) {
      const o = Vo[r] + s; if (o in e)
        return Rs[t] = o
    } return t
  } const Ko = 'http://www.w3.org/1999/xlink'; function Wo(e, t, n, s, r, o = Di(t)) { s && t.startsWith('xlink:') ? n == null ? e.removeAttributeNS(Ko, t.slice(6, t.length)) : e.setAttributeNS(Ko, t, n) : n == null || o && !Zs(n) ? e.removeAttribute(t) : e.setAttribute(t, o ? '' : ht(n) ? String(n) : n) } function ko(e, t, n, s, r) {
    if (t === 'innerHTML' || t === 'textContent') { n != null && (e[t] = t === 'innerHTML' ? Do(n) : n); return } const o = e.tagName; if (t === 'value' && o !== 'PROGRESS' && !o.includes('-')) { const l = o === 'OPTION' ? e.getAttribute('value') || '' : e.value; const u = n == null ? e.type === 'checkbox' ? 'on' : '' : String(n); (l !== u || !('_value' in e)) && (e.value = u), n == null && e.removeAttribute(t), e._value = n; return } let i = !1; if (n === '' || n == null) { const l = typeof e[t]; l === 'boolean' ? n = Zs(n) : n == null && l === 'string' ? (n = '', i = !0) : l === 'number' && (n = 0, i = !0) } try { e[t] = n }
    catch {}i && e.removeAttribute(r || t)
  } function Lu(e, t, n, s) { e.addEventListener(t, n, s) } function Ru(e, t, n, s) { e.removeEventListener(t, n, s) } const qo = Symbol('_vei'); function $u(e, t, n, s, r = null) {
    const o = e[qo] || (e[qo] = {}); const i = o[t]; if (s && i) {
      i.value = s
    }
    else {
      const [l, u] = Nu(t); if (s) { const d = o[t] = Hu(s, r); Lu(e, l, d, u) }
      else {
        i && (Ru(e, l, i, u), o[t] = void 0)
      }
    }
  } const Go = /(?:Once|Passive|Capture)$/; function Nu(e) { let t; if (Go.test(e)) { t = {}; let s; for (;s = e.match(Go);)e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0 } return [e[2] === ':' ? e.slice(3) : gt(e.slice(2)), t] } let $s = 0; const Bu = Promise.resolve(); const ju = () => $s || (Bu.then(() => $s = 0), $s = Date.now()); function Hu(e, t) {
    const n = (s) => {
      if (!s._vts)
        s._vts = Date.now(); else if (s._vts <= n.attached)
        return; Le(Uu(s, n.value), t, 5, [s])
    }; return n.value = e, n.attached = ju(), n
  } function Uu(e, t) {
    if (N(t)) { const n = e.stopImmediatePropagation; return e.stopImmediatePropagation = () => { n.call(e), e._stopped = !0 }, t.map(s => r => !r._stopped && s && s(r)) }
    else {
      return t
    }
  } const Jo = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123; const Vu = (e, t, n, s, r, o) => { const i = r === 'svg'; t === 'class' ? Au(e, s, i) : t === 'style' ? Mu(e, n, s) : gn(t) ? Yn(t) || $u(e, t, n, s, o) : (t[0] === '.' ? (t = t.slice(1), !0) : t[0] === '^' ? (t = t.slice(1), !1) : Ku(e, t, s, i)) ? (ko(e, t, s), !e.tagName.includes('-') && (t === 'value' || t === 'checked' || t === 'selected') && Wo(e, t, s, i, o, t !== 'value')) : e._isVueCE && (/[A-Z]/.test(t) || !ne(s)) ? ko(e, Je(t), s, o, t) : (t === 'true-value' ? e._trueValue = s : t === 'false-value' && (e._falseValue = s), Wo(e, t, s, i)) }; function Ku(e, t, n, s) {
    if (s)
      return !!(t === 'innerHTML' || t === 'textContent' || t in e && Jo(t) && j(n)); if (t === 'spellcheck' || t === 'draggable' || t === 'translate' || t === 'autocorrect' || t === 'form' || t === 'list' && e.tagName === 'INPUT' || t === 'type' && e.tagName === 'TEXTAREA')
      return !1; if (t === 'width' || t === 'height') {
      const r = e.tagName; if (r === 'IMG' || r === 'VIDEO' || r === 'CANVAS' || r === 'SOURCE')
        return !1
    } return Jo(t) && ne(n) ? !1 : t in e
  } const Wu = ce({ patchProp: Vu }, wu); let zo; function ku() { return zo || (zo = kl(Wu)) } const qu = (...e) => {
    const t = ku().createApp(...e); const { mount: n } = t; return t.mount = (s) => {
      const r = Ju(s); if (!r)
        return; const o = t._component; !j(o) && !o.render && !o.template && (o.template = r.innerHTML), r.nodeType === 1 && (r.textContent = ''); const i = n(r, !1, Gu(r)); return r instanceof Element && (r.removeAttribute('v-cloak'), r.setAttribute('data-v-app', '')), i
    }, t
  }; function Gu(e) {
    if (e instanceof SVGElement)
      return 'svg'; if (typeof MathMLElement == 'function' && e instanceof MathMLElement)
      return 'mathml'
  } function Ju(e) { return ne(e) ? document.querySelector(e) : e } function Ns(e) { return e ? e.flatMap(t => t.type === xe ? Ns(t.children) : [t]) : [] } const zu = fe({ name: 'PrimitiveSlot', inheritAttrs: !1, setup(e, { attrs: t, slots: n }) {
    return () => {
      let u, d; if (!n.default)
        return null; const s = Ns(n.default()); const r = s.findIndex(c => c.type !== pe); if (r === -1)
        return s; const o = s[r]; (u = o.props) == null || delete u.ref; const i = o.props ? $e(t, o.props) : t; t.class && ((d = o.props) != null && d.class) && delete o.props.class; const l = Ze(o, i); for (const c in i)c.startsWith('on') && (l.props || (l.props = {}), l.props[c] = i[c]); return s.length === 1 ? l : (s[r] = l, s)
    }
  } }); const Yu = ['area', 'img', 'input']; const $t = fe({ name: 'Primitive', inheritAttrs: !1, props: { asChild: { type: Boolean, default: !1 }, as: { type: [String, Object], default: 'div' } }, setup(e, { attrs: t, slots: n }) { const s = e.asChild ? 'template' : e.as; return typeof s == 'string' && Yu.includes(s) ? () => cn(s, t) : s !== 'template' ? () => cn(e.as, t, { default: n.default }) : () => cn(zu, t, { default: n.default }) } }); function Yo(e) { return tr() ? (Ii(e), !0) : !1 } function Xu(e) { let t = !1; let n; const s = er(!0); return (...r) => (t || (n = s.run(() => e(...r)), t = !0), n) } function Zu(e) { let t = 0; let n; let s; const r = () => { t -= 1, s && t <= 0 && (s.stop(), n = void 0, s = void 0) }; return (...o) => (t += 1, s || (s = er(!0), n = s.run(() => e(...o))), Yo(r), n) } const xt = typeof window < 'u' && typeof document < 'u'; typeof WorkerGlobalScope < 'u' && globalThis instanceof WorkerGlobalScope; const Qu = e => typeof e < 'u'; const ec = Object.prototype.toString; const tc = e => ec.call(e) === '[object Object]'; const Xo = nc(); function nc() { let e, t; return xt && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window == null ? void 0 : window.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent)) } function sc(e) { return at() } function Bs(e) { return Array.isArray(e) ? e : [e] } function rc(e, t) { sc() && ys(e, t) } function oc(e, t, n) { return Re(e, t, { ...n, immediate: !0 }) } const js = xt ? window : void 0; function Wn(e) { let t; const n = Jt(e); return (t = n == null ? void 0 : n.$el) != null ? t : n } function Zo(...e) {
    const t = []; const n = () => { t.forEach(l => l()), t.length = 0 }; const s = (l, u, d, c) => (l.addEventListener(u, d, c), () => l.removeEventListener(u, d, c)); const r = Ie(() => { const l = Bs(Jt(e[0])).filter(u => u != null); return l.every(u => typeof u != 'string') ? l : void 0 }); const o = oc(() => { let l, u; return [(u = (l = r.value) == null ? void 0 : l.map(d => Wn(d))) != null ? u : [js].filter(d => d != null), Bs(Jt(r.value ? e[1] : e[0])), Bs(P(r.value ? e[2] : e[1])), Jt(r.value ? e[3] : e[2])] }, ([l, u, d, c]) => {
      if (n(), !(l != null && l.length) || !(u != null && u.length) || !(d != null && d.length))
        return; const a = tc(c) ? { ...c } : c; t.push(...l.flatMap(h => u.flatMap(m => d.map(v => s(h, m, v, a)))))
    }, { flush: 'post' }); const i = () => { o(), n() }; return Yo(n), i
  } function ic() { const e = Qi(!1); const t = at(); return t && Qt(() => { e.value = !0 }, t), e } function lc(e) { return typeof e == 'function' ? e : typeof e == 'string' ? t => t.key === e : Array.isArray(e) ? t => e.includes(t.key) : () => !0 } function uc(...e) { let t; let n; let s = {}; e.length === 3 ? (t = e[0], n = e[1], s = e[2]) : e.length === 2 ? typeof e[1] == 'object' ? (t = !0, n = e[0], s = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]); const { target: r = js, eventName: o = 'keydown', passive: i = !1, dedupe: l = !1 } = s; const u = lc(t); return Zo(r, o, (c) => { c.repeat && Jt(l) || u(c) && n(c) }, i) } function cc(e) { return JSON.parse(JSON.stringify(e)) } function ac(e, t, n, s = {}) {
    let r, o, i; const { clone: l = !1, passive: u = !1, eventName: d, deep: c = !1, defaultValue: a, shouldEmit: h } = s; const m = at(); const v = n || (m == null ? void 0 : m.emit) || ((r = m == null ? void 0 : m.$emit) == null ? void 0 : r.bind(m)) || ((i = (o = m == null ? void 0 : m.proxy) == null ? void 0 : o.$emit) == null ? void 0 : i.bind(m == null ? void 0 : m.proxy)); let w = d; w = w || `update:${t.toString()}`; const L = $ => l ? typeof l == 'function' ? l($) : cc($) : $; const T = () => Qu(e[t]) ? L(e[t]) : a; const F = ($) => { h ? h($) && v(w, $) : v(w, $) }; if (u) { const $ = T(); const A = ie($); let H = !1; return Re(() => e[t], (U) => { H || (H = !0, A.value = L(U), lt(() => H = !1)) }), Re(A, (U) => { !H && (U !== e[t] || c) && F(U) }, { deep: c }), A }
    else {
      return Ie({ get() { return T() }, set($) { F($) } })
    }
  } function Qo(e, t) {
    const n = typeof e == 'string' ? `${e}Context` : t; const s = Symbol(n); return [(i) => {
      const l = nn(s, i); if (l || l === null)
        return l; throw new Error(`Injection \`${s.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(', ')}` : `\`${e}\``}`)
    }, i => (to(s, i), i)]
  } const [ei, oa] = Qo('ConfigProvider'); function Ne() {
    const e = at(); const t = ie(); const n = Ie(() => { let i, l; return ['#text', '#comment'].includes((i = t.value) == null ? void 0 : i.$el.nodeName) ? (l = t.value) == null ? void 0 : l.$el.nextElementSibling : Wn(t) }); const s = Object.assign({}, e.exposed); const r = {}; for (const i in e.props)Object.defineProperty(r, i, { enumerable: !0, configurable: !0, get: () => e.props[i] }); if (Object.keys(s).length > 0) {
      for (const i in s)Object.defineProperty(r, i, { enumerable: !0, configurable: !0, get: () => s[i] })
    } Object.defineProperty(r, '$el', { enumerable: !0, configurable: !0, get: () => e.vnode.el }), e.exposed = r; function o(i) { t.value = i, i && (Object.defineProperty(r, '$el', { enumerable: !0, configurable: !0, get: () => i instanceof Element ? i : i.$el }), e.exposed = r) } return { forwardRef: o, currentRef: t, currentElement: n }
  } let fc = 0; function Hs(e, t = 'reka') { const n = ei({ useId: void 0 }); return Wr ? `${t}-${Wr()}` : n.useId ? `${t}-${n.useId()}` : `${t}-${++fc}` } function dc(e, t) { const n = ie(e); function s(o) { return t[n.value][o] ?? n.value } return { state: n, dispatch: (o) => { n.value = s(o) } } } function pc(e, t) { let L; const n = ie({}); const s = ie('none'); const r = ie(e); const o = e.value ? 'mounted' : 'unmounted'; let i; const l = ((L = t.value) == null ? void 0 : L.ownerDocument.defaultView) ?? js; const { state: u, dispatch: d } = dc(o, { mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' }, unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' }, unmounted: { MOUNT: 'mounted' } }); const c = (T) => { let F; if (xt) { const $ = new CustomEvent(T, { bubbles: !1, cancelable: !1 }); (F = t.value) == null || F.dispatchEvent($) } }; Re(e, async (T, F) => { let A; const $ = F !== T; if (await lt(), $) { const H = s.value; const U = kn(t.value); T ? (d('MOUNT'), c('enter'), U === 'none' && c('after-enter')) : U === 'none' || U === 'undefined' || ((A = n.value) == null ? void 0 : A.display) === 'none' ? (d('UNMOUNT'), c('leave'), c('after-leave')) : F && H !== U ? (d('ANIMATION_OUT'), c('leave')) : (d('UNMOUNT'), c('after-leave')) } }, { immediate: !0 }); const a = (T) => { const F = kn(t.value); const $ = F.includes(T.animationName); const A = u.value === 'mounted' ? 'enter' : 'leave'; if (T.target === t.value && $ && (c(`after-${A}`), d('ANIMATION_END'), !r.value)) { const H = t.value.style.animationFillMode; t.value.style.animationFillMode = 'forwards', i = l == null ? void 0 : l.setTimeout(() => { let U; ((U = t.value) == null ? void 0 : U.style.animationFillMode) === 'forwards' && (t.value.style.animationFillMode = H) }) }T.target === t.value && F === 'none' && d('ANIMATION_END') }; const h = (T) => { T.target === t.value && (s.value = kn(t.value)) }; const m = Re(t, (T, F) => { T ? (n.value = getComputedStyle(T), T.addEventListener('animationstart', h), T.addEventListener('animationcancel', a), T.addEventListener('animationend', a)) : (d('ANIMATION_END'), i !== void 0 && (l == null || l.clearTimeout(i)), F == null || F.removeEventListener('animationstart', h), F == null || F.removeEventListener('animationcancel', a), F == null || F.removeEventListener('animationend', a)) }, { immediate: !0 }); const v = Re(u, () => { const T = kn(t.value); s.value = u.value === 'mounted' ? T : 'none' }); return Nn(() => { m(), v() }), { isPresent: Ie(() => ['mounted', 'unmountSuspended'].includes(u.value)) } } function kn(e) { return e && getComputedStyle(e).animationName || 'none' } const ti = fe({ name: 'Presence', props: { present: { type: Boolean, required: !0 }, forceMount: { type: Boolean } }, slots: {}, setup(e, { slots: t, expose: n }) {
    let d; const { present: s, forceMount: r } = Cr(e); const o = ie(); const { isPresent: i } = pc(s, o); n({ present: i }); let l = t.default({ present: i.value }); l = Ns(l || []); const u = at(); if (l && (l == null ? void 0 : l.length) > 1) {
      const c = (d = u == null ? void 0 : u.parent) != null && d.type.name ? `<${u.parent.type.name} />` : 'component'; throw new Error([`Detected an invalid children for \`${c}\` for  \`Presence\` component.`, '', 'Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.', 'You can apply a few solutions:', ['Provide a single child element so that `presence` directive attach correctly.', 'Ensure the first child is an actual element instead of a raw text node or comment node.'].map(a => `  - ${a}`).join(`
`)].join(`
`))
    } return () => r.value || s.value || i.value ? cn(t.default({ present: i.value })[0], { ref: (c) => { const a = Wn(c); return typeof (a == null ? void 0 : a.hasAttribute) > 'u' || (a != null && a.hasAttribute('data-reka-popper-content-wrapper') ? o.value = a.firstElementChild : o.value = a), a } }) : null
  } }); const [tt, hc] = Qo('DialogRoot'); const gc = fe({ inheritAttrs: !1, __name: 'DialogRoot', props: { open: { type: Boolean, default: void 0 }, defaultOpen: { type: Boolean, default: !1 }, modal: { type: Boolean, default: !0 } }, emits: ['update:open'], setup(e, { emit: t }) { const n = e; const r = ac(n, 'open', t, { defaultValue: n.defaultOpen, passive: n.open === void 0 }); const o = ie(); const i = ie(); const { modal: l } = Cr(n); return hc({ open: r, modal: l, openModal: () => { r.value = !0 }, onOpenChange: (u) => { r.value = u }, onOpenToggle: () => { r.value = !r.value }, contentId: '', titleId: '', descriptionId: '', triggerElement: o, contentElement: i }), (u, d) => Ee(u.$slots, 'default', { open: P(r) }) } }); const mc = fe({ __name: 'DialogClose', props: { asChild: { type: Boolean }, as: { default: 'button' } }, setup(e) { const t = e; Ne(); const n = tt(); return (s, r) => (le(), ue(P($t), $e(t, { type: s.as === 'button' ? 'button' : void 0, onClick: r[0] || (r[0] = o => P(n).onOpenChange(!1)) }), { default: Z(() => [Ee(s.$slots, 'default')]), _: 3 }, 16, ['type'])) } }); function Us(e) { const t = at(); const n = t == null ? void 0 : t.type.emits; const s = {}; return n != null && n.length || console.warn(`No emitted event found. Please check component: ${t == null ? void 0 : t.type.__name}`), n == null || n.forEach((r) => { s[yn(Je(r))] = (...o) => e(r, ...o) }), s } function ni(e, t, n) { const s = n.originalEvent.target; const r = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n }); t && s.addEventListener(e, t, { once: !0 }), s.dispatchEvent(r) } const vc = 'dismissableLayer.pointerDownOutside'; const yc = 'dismissableLayer.focusOutside'; function si(e, t) { const n = t.closest('[data-dismissable-layer]'); const s = e.dataset.dismissableLayer === '' ? e : e.querySelector('[data-dismissable-layer]'); const r = Array.from(e.ownerDocument.querySelectorAll('[data-dismissable-layer]')); return !!(n && (s === n || r.indexOf(s) < r.indexOf(n))) } function bc(e, t) {
    let o; const n = ((o = t == null ? void 0 : t.value) == null ? void 0 : o.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document); const s = ie(!1); const r = ie(() => {}); return Rt((i) => {
      if (!xt)
        return; const l = async (d) => {
        const c = d.target; if (!(!(t != null && t.value) || !c)) {
          if (si(t.value, c)) { s.value = !1; return } if (d.target && !s.value) { const a = function () { ni(vc, e, h) }; const h = { originalEvent: d }; d.pointerType === 'touch' ? (n.removeEventListener('click', r.value), r.value = a, n.addEventListener('click', r.value, { once: !0 })) : a() }
          else {
            n.removeEventListener('click', r.value)
          }s.value = !1
        }
      }; const u = window.setTimeout(() => { n.addEventListener('pointerdown', l) }, 0); i(() => { window.clearTimeout(u), n.removeEventListener('pointerdown', l), n.removeEventListener('click', r.value) })
    }), { onPointerDownCapture: () => s.value = !0 }
  } function _c(e, t) {
    let r; const n = ((r = t == null ? void 0 : t.value) == null ? void 0 : r.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document); const s = ie(!1); return Rt((o) => {
      if (!xt)
        return; const i = async (l) => {
        if (!(t != null && t.value))
          return; await lt(), await lt(); const u = l.target; !t.value || !u || si(t.value, u) || l.target && !s.value && ni(yc, e, { originalEvent: l })
      }; n.addEventListener('focusin', i), o(() => n.removeEventListener('focusin', i))
    }), { onFocusCapture: () => s.value = !0, onBlurCapture: () => s.value = !1 }
  } const nt = qt({ layersRoot: new Set(), layersWithOutsidePointerEventsDisabled: new Set(), branches: new Set() }); const Ec = fe({ __name: 'DismissableLayer', props: { disableOutsidePointerEvents: { type: Boolean, default: !1 }, asChild: { type: Boolean }, as: {} }, emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'], setup(e, { emit: t }) { const n = e; const s = t; const { forwardRef: r, currentElement: o } = Ne(); const i = Ie(() => { let v; return ((v = o.value) == null ? void 0 : v.ownerDocument) ?? globalThis.document }); const l = Ie(() => nt.layersRoot); const u = Ie(() => o.value ? Array.from(l.value).indexOf(o.value) : -1); const d = Ie(() => nt.layersWithOutsidePointerEventsDisabled.size > 0); const c = Ie(() => { const v = Array.from(l.value); const [w] = [...nt.layersWithOutsidePointerEventsDisabled].slice(-1); const L = v.indexOf(w); return u.value >= L }); const a = bc(async (v) => { const w = [...nt.branches].some(L => L == null ? void 0 : L.contains(v.target)); !c.value || w || (s('pointerDownOutside', v), s('interactOutside', v), await lt(), v.defaultPrevented || s('dismiss')) }, o); const h = _c((v) => { [...nt.branches].some(L => L == null ? void 0 : L.contains(v.target)) || (s('focusOutside', v), s('interactOutside', v), v.defaultPrevented || s('dismiss')) }, o); uc('Escape', (v) => { u.value === l.value.size - 1 && (s('escapeKeyDown', v), v.defaultPrevented || s('dismiss')) }); let m; return Rt((v) => { o.value && (n.disableOutsidePointerEvents && (nt.layersWithOutsidePointerEventsDisabled.size === 0 && (m = i.value.body.style.pointerEvents, i.value.body.style.pointerEvents = 'none'), nt.layersWithOutsidePointerEventsDisabled.add(o.value)), l.value.add(o.value), v(() => { n.disableOutsidePointerEvents && nt.layersWithOutsidePointerEventsDisabled.size === 1 && (i.value.body.style.pointerEvents = m) })) }), Rt((v) => { v(() => { o.value && (l.value.delete(o.value), nt.layersWithOutsidePointerEventsDisabled.delete(o.value)) }) }), (v, w) => (le(), ue(P($t), { 'ref': P(r), 'as-child': v.asChild, 'as': v.as, 'data-dismissable-layer': '', 'style': Ht({ pointerEvents: d.value ? c.value ? 'auto' : 'none' : void 0 }), 'onFocusCapture': P(h).onFocusCapture, 'onBlurCapture': P(h).onBlurCapture, 'onPointerdownCapture': P(a).onPointerDownCapture }, { default: Z(() => [Ee(v.$slots, 'default')]), _: 3 }, 8, ['as-child', 'as', 'style', 'onFocusCapture', 'onBlurCapture', 'onPointerdownCapture'])) } }); function dt() {
    let e = document.activeElement; if (e == null)
      return null; for (;e != null && e.shadowRoot != null && e.shadowRoot.activeElement != null;)e = e.shadowRoot.activeElement; return e
  } function wc(e) { return e ? 'open' : 'closed' } const Cc = Xu(() => ie([])); function xc() { const e = Cc(); return { add(t) { const n = e.value[0]; t !== n && (n == null || n.pause()), e.value = ri(e.value, t), e.value.unshift(t) }, remove(t) { let n; e.value = ri(e.value, t), (n = e.value[0]) == null || n.resume() } } } function ri(e, t) { const n = [...e]; const s = n.indexOf(t); return s !== -1 && n.splice(s, 1), n } function Sc(e) { return e.filter(t => t.tagName !== 'A') } const Vs = 'focusScope.autoFocusOnMount'; const Ks = 'focusScope.autoFocusOnUnmount'; const oi = { bubbles: !1, cancelable: !0 }; function Oc(e, { select: t = !1 } = {}) {
    const n = dt(); for (const s of e) {
      if (pt(s, { select: t }), dt() !== n)
        return !0
    }
  } function Tc(e) { const t = ii(e); const n = li(t, e); const s = li(t.reverse(), e); return [n, s] } function ii(e) { const t = []; const n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (s) => { const r = s.tagName === 'INPUT' && s.type === 'hidden'; return s.disabled || s.hidden || r ? NodeFilter.FILTER_SKIP : s.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP } }); for (;n.nextNode();)t.push(n.currentNode); return t } function li(e, t) {
    for (const n of e) {
      if (!Ac(n, { upTo: t }))
        return n
    }
  } function Ac(e, { upTo: t }) {
    if (getComputedStyle(e).visibility === 'hidden')
      return !0; for (;e;) {
      if (t !== void 0 && e === t)
        return !1; if (getComputedStyle(e).display === 'none')
        return !0; e = e.parentElement
    } return !1
  } function Pc(e) { return e instanceof HTMLInputElement && 'select' in e } function pt(e, { select: t = !1 } = {}) { if (e && e.focus) { const n = dt(); e.focus({ preventScroll: !0 }), e !== n && Pc(e) && t && e.select() } } const Dc = fe({ __name: 'FocusScope', props: { loop: { type: Boolean, default: !1 }, trapped: { type: Boolean, default: !1 }, asChild: { type: Boolean }, as: {} }, emits: ['mountAutoFocus', 'unmountAutoFocus'], setup(e, { emit: t }) {
    const n = e; const s = t; const { currentRef: r, currentElement: o } = Ne(); const i = ie(null); const l = xc(); const u = qt({ paused: !1, pause() { this.paused = !0 }, resume() { this.paused = !1 } }); Rt((c) => {
      if (!xt)
        return; const a = o.value; if (!n.trapped)
        return; function h(L) {
        if (u.paused || !a)
          return; const T = L.target; a.contains(T) ? i.value = T : pt(i.value, { select: !0 })
      } function m(L) {
        if (u.paused || !a)
          return; const T = L.relatedTarget; T !== null && (a.contains(T) || pt(i.value, { select: !0 }))
      } function v(L) { a.contains(i.value) || pt(a) }document.addEventListener('focusin', h), document.addEventListener('focusout', m); const w = new MutationObserver(v); a && w.observe(a, { childList: !0, subtree: !0 }), c(() => { document.removeEventListener('focusin', h), document.removeEventListener('focusout', m), w.disconnect() })
    }), Rt(async (c) => {
      const a = o.value; if (await lt(), !a)
        return; l.add(u); const h = dt(); if (!a.contains(h)) { const v = new CustomEvent(Vs, oi); a.addEventListener(Vs, w => s('mountAutoFocus', w)), a.dispatchEvent(v), v.defaultPrevented || (Oc(Sc(ii(a)), { select: !0 }), dt() === h && pt(a)) }c(() => { a.removeEventListener(Vs, L => s('mountAutoFocus', L)); const v = new CustomEvent(Ks, oi); const w = (L) => { s('unmountAutoFocus', L) }; a.addEventListener(Ks, w), a.dispatchEvent(v), setTimeout(() => { v.defaultPrevented || pt(h ?? document.body, { select: !0 }), a.removeEventListener(Ks, w), l.remove(u) }, 0) })
    }); function d(c) {
      if (!n.loop && !n.trapped || u.paused)
        return; const a = c.key === 'Tab' && !c.altKey && !c.ctrlKey && !c.metaKey; const h = dt(); if (a && h) { const m = c.currentTarget; const [v, w] = Tc(m); v && w ? !c.shiftKey && h === w ? (c.preventDefault(), n.loop && pt(v, { select: !0 })) : c.shiftKey && h === v && (c.preventDefault(), n.loop && pt(w, { select: !0 })) : h === m && c.preventDefault() }
    } return (c, a) => (le(), ue(P($t), { 'ref_key': 'currentRef', 'ref': r, 'tabindex': '-1', 'as-child': c.asChild, 'as': c.as, 'onKeydown': d }, { default: Z(() => [Ee(c.$slots, 'default')]), _: 3 }, 8, ['as-child', 'as']))
  } }); const ui = fe({ __name: 'DialogContentImpl', props: { forceMount: { type: Boolean }, trapFocus: { type: Boolean }, disableOutsidePointerEvents: { type: Boolean }, asChild: { type: Boolean }, as: {} }, emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'openAutoFocus', 'closeAutoFocus'], setup(e, { emit: t }) { const n = e; const s = t; const r = tt(); const { forwardRef: o, currentElement: i } = Ne(); return r.titleId || (r.titleId = Hs(void 0, 'reka-dialog-title')), r.descriptionId || (r.descriptionId = Hs(void 0, 'reka-dialog-description')), Qt(() => { r.contentElement = i, dt() !== document.body && (r.triggerElement.value = dt()) }), (l, u) => (le(), ue(P(Dc), { 'as-child': '', 'loop': '', 'trapped': n.trapFocus, 'onMountAutoFocus': u[5] || (u[5] = d => s('openAutoFocus', d)), 'onUnmountAutoFocus': u[6] || (u[6] = d => s('closeAutoFocus', d)) }, { default: Z(() => [Q(P(Ec), $e({ 'id': P(r).contentId, 'ref': P(o), 'as': l.as, 'as-child': l.asChild, 'disable-outside-pointer-events': l.disableOutsidePointerEvents, 'role': 'dialog', 'aria-describedby': P(r).descriptionId, 'aria-labelledby': P(r).titleId, 'data-state': P(wc)(P(r).open.value) }, l.$attrs, { onDismiss: u[0] || (u[0] = d => P(r).onOpenChange(!1)), onEscapeKeyDown: u[1] || (u[1] = d => s('escapeKeyDown', d)), onFocusOutside: u[2] || (u[2] = d => s('focusOutside', d)), onInteractOutside: u[3] || (u[3] = d => s('interactOutside', d)), onPointerDownOutside: u[4] || (u[4] = d => s('pointerDownOutside', d)) }), { default: Z(() => [Ee(l.$slots, 'default')]), _: 3 }, 16, ['id', 'as', 'as-child', 'disable-outside-pointer-events', 'aria-describedby', 'aria-labelledby', 'data-state'])]), _: 3 }, 8, ['trapped'])) } }); const Ic = function (e) {
    if (typeof document > 'u')
      return null; const t = Array.isArray(e) ? e[0] : e; return t.ownerDocument.body
  }; let Nt = new WeakMap(); let qn = new WeakMap(); let Gn = {}; let Ws = 0; const ci = function (e) { return e && (e.host || ci(e.parentNode)) }; const Mc = function (e, t) {
    return t.map((n) => {
      if (e.contains(n))
        return n; const s = ci(n); return s && e.contains(s) ? s : (console.error('aria-hidden', n, 'in not contained inside', e, '. Doing nothing'), null)
    }).filter((n) => { return !!n })
  }; const Fc = function (e, t, n, s) {
    const r = Mc(t, Array.isArray(e) ? e : [e]); Gn[n] || (Gn[n] = new WeakMap()); const o = Gn[n]; const i = []; const l = new Set(); const u = new Set(r); const d = function (a) { !a || l.has(a) || (l.add(a), d(a.parentNode)) }; r.forEach(d); const c = function (a) {
      !a || u.has(a) || Array.prototype.forEach.call(a.children, (h) => {
        if (l.has(h)) {
          c(h)
        }
        else {
          try { const m = h.getAttribute(s); const v = m !== null && m !== 'false'; const w = (Nt.get(h) || 0) + 1; const L = (o.get(h) || 0) + 1; Nt.set(h, w), o.set(h, L), i.push(h), w === 1 && v && qn.set(h, !0), L === 1 && h.setAttribute(n, 'true'), v || h.setAttribute(s, 'true') }
          catch (T) { console.error('aria-hidden: cannot operate on ', h, T) }
        }
      })
    }; return c(t), l.clear(), Ws++, function () { i.forEach((a) => { const h = Nt.get(a) - 1; const m = o.get(a) - 1; Nt.set(a, h), o.set(a, m), h || (qn.has(a) || a.removeAttribute(s), qn.delete(a)), m || a.removeAttribute(n) }), Ws--, Ws || (Nt = new WeakMap(), Nt = new WeakMap(), qn = new WeakMap(), Gn = {}) }
  }; const Lc = function (e, t, n) { n === void 0 && (n = 'data-aria-hidden'); const s = Array.from(Array.isArray(e) ? e : [e]); const r = Ic(e); return r ? (s.push.apply(s, Array.from(r.querySelectorAll('[aria-live]'))), Fc(s, r, n, 'aria-hidden')) : function () { return null } }; function Rc(e) { let t; Re(() => Wn(e), (n) => { n ? t = Lc(n) : t && t() }), Nn(() => { t && t() }) } const $c = fe({ __name: 'DialogContentModal', props: { forceMount: { type: Boolean }, trapFocus: { type: Boolean }, disableOutsidePointerEvents: { type: Boolean }, asChild: { type: Boolean }, as: {} }, emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'openAutoFocus', 'closeAutoFocus'], setup(e, { emit: t }) { const n = e; const s = t; const r = tt(); const o = Us(s); const { forwardRef: i, currentElement: l } = Ne(); return Rc(l), (u, d) => (le(), ue(ui, $e({ ...n, ...P(o) }, { 'ref': P(i), 'trap-focus': P(r).open.value, 'disable-outside-pointer-events': !0, 'onCloseAutoFocus': d[0] || (d[0] = (c) => { let a; c.defaultPrevented || (c.preventDefault(), (a = P(r).triggerElement.value) == null || a.focus()) }), 'onPointerDownOutside': d[1] || (d[1] = (c) => { const a = c.detail.originalEvent; const h = a.button === 0 && a.ctrlKey === !0; (a.button === 2 || h) && c.preventDefault() }), 'onFocusOutside': d[2] || (d[2] = (c) => { c.preventDefault() }) }), { default: Z(() => [Ee(u.$slots, 'default')]), _: 3 }, 16, ['trap-focus'])) } }); const Nc = fe({ __name: 'DialogContentNonModal', props: { forceMount: { type: Boolean }, trapFocus: { type: Boolean }, disableOutsidePointerEvents: { type: Boolean }, asChild: { type: Boolean }, as: {} }, emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'openAutoFocus', 'closeAutoFocus'], setup(e, { emit: t }) { const n = e; const r = Us(t); Ne(); const o = tt(); const i = ie(!1); const l = ie(!1); return (u, d) => (le(), ue(ui, $e({ ...n, ...P(r) }, { 'trap-focus': !1, 'disable-outside-pointer-events': !1, 'onCloseAutoFocus': d[0] || (d[0] = (c) => { let a; c.defaultPrevented || (i.value || (a = P(o).triggerElement.value) == null || a.focus(), c.preventDefault()), i.value = !1, l.value = !1 }), 'onInteractOutside': d[1] || (d[1] = (c) => { let m; c.defaultPrevented || (i.value = !0, c.detail.originalEvent.type === 'pointerdown' && (l.value = !0)); const a = c.target; ((m = P(o).triggerElement.value) == null ? void 0 : m.contains(a)) && c.preventDefault(), c.detail.originalEvent.type === 'focusin' && l.value && c.preventDefault() }) }), { default: Z(() => [Ee(u.$slots, 'default')]), _: 3 }, 16)) } }); const Bc = fe({ __name: 'DialogContent', props: { forceMount: { type: Boolean }, trapFocus: { type: Boolean }, disableOutsidePointerEvents: { type: Boolean }, asChild: { type: Boolean }, as: {} }, emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'openAutoFocus', 'closeAutoFocus'], setup(e, { emit: t }) { const n = e; const s = t; const r = tt(); const o = Us(s); const { forwardRef: i } = Ne(); return (l, u) => (le(), ue(P(ti), { present: l.forceMount || P(r).open.value }, { default: Z(() => [P(r).modal.value ? (le(), ue($c, $e({ key: 0, ref: P(i) }, { ...n, ...P(o), ...l.$attrs }), { default: Z(() => [Ee(l.$slots, 'default')]), _: 3 }, 16)) : (le(), ue(Nc, $e({ key: 1, ref: P(i) }, { ...n, ...P(o), ...l.$attrs }), { default: Z(() => [Ee(l.$slots, 'default')]), _: 3 }, 16))]), _: 3 }, 8, ['present'])) } }); function ks(e) {
    if (e === null || typeof e != 'object')
      return !1; const t = Object.getPrototypeOf(e); return t !== null && t !== Object.prototype && Object.getPrototypeOf(t) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === '[object Module]' : !0
  } function qs(e, t, n = '.', s) {
    if (!ks(t))
      return qs(e, {}, n, s); const r = Object.assign({}, t); for (const o in e) {
      if (o === '__proto__' || o === 'constructor')
        continue; const i = e[o]; i != null && (s && s(r, o, i, n) || (Array.isArray(i) && Array.isArray(r[o]) ? r[o] = [...i, ...r[o]] : ks(i) && ks(r[o]) ? r[o] = qs(i, r[o], (n ? `${n}.` : '') + o.toString(), s) : r[o] = i))
    } return r
  } function jc(e) { return (...t) => t.reduce((n, s) => qs(n, s, '', e), {}) } const Hc = jc(); const Uc = Zu(() => {
    const e = ie(new Map()); const t = ie(); const n = Ie(() => {
      for (const i of e.value.values()) {
        if (i)
          return !0
      } return !1
    }); const s = ei({ scrollBody: ie(!0) }); let r = null; const o = () => { document.body.style.paddingRight = '', document.body.style.marginRight = '', document.body.style.pointerEvents = '', document.body.style.removeProperty('--scrollbar-width'), document.body.style.overflow = t.value ?? '', Xo && (r == null || r()), t.value = void 0 }; return Re(n, (i, l) => {
      let a; if (!xt)
        return; if (!i) { l && o(); return }t.value === void 0 && (t.value = document.body.style.overflow); const u = window.innerWidth - document.documentElement.clientWidth; const d = { padding: u, margin: 0 }; const c = (a = s.scrollBody) != null && a.value ? typeof s.scrollBody.value == 'object' ? Hc({ padding: s.scrollBody.value.padding === !0 ? u : s.scrollBody.value.padding, margin: s.scrollBody.value.margin === !0 ? u : s.scrollBody.value.margin }, d) : d : { padding: 0, margin: 0 }; u > 0 && (document.body.style.paddingRight = typeof c.padding == 'number' ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == 'number' ? `${c.margin}px` : String(c.margin), document.body.style.setProperty('--scrollbar-width', `${u}px`), document.body.style.overflow = 'hidden'), Xo && (r = Zo(document, 'touchmove', h => Kc(h), { passive: !1 })), lt(() => { document.body.style.pointerEvents = 'none', document.body.style.overflow = 'hidden' })
    }, { immediate: !0, flush: 'sync' }), e
  }); function Vc(e) { const t = Math.random().toString(36).substring(2, 7); const n = Uc(); n.value.set(t, e); const s = Ie({ get: () => n.value.get(t) ?? !1, set: r => n.value.set(t, r) }); return rc(() => { n.value.delete(t) }), s } function ai(e) {
    const t = window.getComputedStyle(e); if (t.overflowX === 'scroll' || t.overflowY === 'scroll' || t.overflowX === 'auto' && e.clientWidth < e.scrollWidth || t.overflowY === 'auto' && e.clientHeight < e.scrollHeight)
      return !0; { const n = e.parentNode; return !(n instanceof Element) || n.tagName === 'BODY' ? !1 : ai(n) }
  } function Kc(e) { const t = e || window.event; const n = t.target; return n instanceof Element && ai(n) ? !1 : t.touches.length > 1 ? !0 : (t.preventDefault && t.cancelable && t.preventDefault(), !1) } const Wc = fe({ __name: 'DialogOverlayImpl', props: { asChild: { type: Boolean }, as: {} }, setup(e) { const t = tt(); return Vc(!0), Ne(), (n, s) => (le(), ue(P($t), { 'as': n.as, 'as-child': n.asChild, 'data-state': P(t).open.value ? 'open' : 'closed', 'style': { 'pointer-events': 'auto' } }, { default: Z(() => [Ee(n.$slots, 'default')]), _: 3 }, 8, ['as', 'as-child', 'data-state'])) } }); const kc = fe({ __name: 'DialogOverlay', props: { forceMount: { type: Boolean }, asChild: { type: Boolean }, as: {} }, setup(e) { const t = tt(); const { forwardRef: n } = Ne(); return (s, r) => { let o; return (o = P(t)) != null && o.modal.value ? (le(), ue(P(ti), { key: 0, present: s.forceMount || P(t).open.value }, { default: Z(() => [Q(Wc, $e(s.$attrs, { 'ref': P(n), 'as': s.as, 'as-child': s.asChild }), { default: Z(() => [Ee(s.$slots, 'default')]), _: 3 }, 16, ['as', 'as-child'])]), _: 3 }, 8, ['present'])) : Co('', !0) } } }); const qc = fe({ __name: 'Teleport', props: { to: { default: 'body' }, disabled: { type: Boolean }, defer: { type: Boolean }, forceMount: { type: Boolean } }, setup(e) { const t = ic(); return (n, s) => P(t) || n.forceMount ? (le(), ue(ml, { key: 0, to: n.to, disabled: n.disabled, defer: n.defer }, [Ee(n.$slots, 'default')], 8, ['to', 'disabled', 'defer'])) : Co('', !0) } }); const Gc = fe({ __name: 'DialogTitle', props: { asChild: { type: Boolean }, as: { default: 'h2' } }, setup(e) { const t = e; const n = tt(); return Ne(), (s, r) => (le(), ue(P($t), $e(t, { id: P(n).titleId }), { default: Z(() => [Ee(s.$slots, 'default')]), _: 3 }, 16, ['id'])) } }); const Jc = fe({ __name: 'DialogTrigger', props: { asChild: { type: Boolean }, as: { default: 'button' } }, setup(e) { const t = e; const n = tt(); const { forwardRef: s, currentElement: r } = Ne(); return n.contentId || (n.contentId = Hs(void 0, 'reka-dialog-content')), Qt(() => { n.triggerElement.value = r.value }), (o, i) => (le(), ue(P($t), $e(t, { 'ref': P(s), 'type': o.as === 'button' ? 'button' : void 0, 'aria-haspopup': 'dialog', 'aria-expanded': P(n).open.value || !1, 'aria-controls': P(n).open.value ? P(n).contentId : void 0, 'data-state': P(n).open.value ? 'open' : 'closed', 'onClick': P(n).onOpenToggle }), { default: Z(() => [Ee(o.$slots, 'default')]), _: 3 }, 16, ['type', 'aria-expanded', 'aria-controls', 'data-state', 'onClick'])) } }); const zc = fe({ __name: 'DialogPortal', props: { to: {}, disabled: { type: Boolean }, defer: { type: Boolean }, forceMount: { type: Boolean } }, setup(e) { const t = e; return (n, s) => (le(), ue(P(qc), Pi(Eo(t)), { default: Z(() => [Ee(n.$slots, 'default')]), _: 3 }, 16)) } }); const Yc = { 'relative': '', 'bg-neutral-0': '', 'py-32': '', 'ring': '1.5 neutral/3', 'class': 'modal-container' }; const Xc = ((e, t) => { const n = e.__vccOpts || e; for (const [s, r] of t)n[s] = r; return n })(fe({ __name: 'Modal', setup(e) { return (t, n) => (le(), ue(P(gc), null, { default: Z(() => [Q(P(Jc), { 'text': '22/24 neutral-0', 'outline': '~ 1.5  offset--1.5 white/8', 'f-size': '36/40', 'fixed': '', 'rounded-full': '', 'bg-neutral': '', 'shadow-lg': '', 'stack': '', 'f-bottom-md': '', 'f-right-md': '' }, { default: Z(() => n[0] || (n[0] = [Te('div', { 'i-nimiq:thumb-up-thumb-down': '' }, null, -1)])), _: 1, __: [0] }), Q(P(zc), null, { default: Z(() => [Q(Fo, { name: 'backdrop' }, { default: Z(() => [Q(P(kc), { 'fixed': '', 'inset-0': '', 'z-200': '', 'bg-darkblue': '', 'op-60': '' })]), _: 1 }), Q(Fo, { name: 'modal' }, { default: Z(() => [Q(P(Bc), { 'lg': 'f-bottom-md f-right-md', 'rounded': 't-8 lg:8', 'data-modal': '', 'fixed': '', 'z-200': '', 'h-max': '', 'max-h-85dvh': '', 'w-full': '', 'transform': '', 'of-y-auto': '', 'shadow-lg': '', 'outline-none': '', 'lg:max-w-500': '' }, { default: Z(() => [Te('div', Yc, [Q(P(Gc), { 'text': '24 center neutral lh-24', 'mb-12': '', 'px-24': '', 'font-bold': '', 'lh-none': '', 'lg:px-40': '', 'as': 'h2' }, { default: Z(() => n[1] || (n[1] = [wo(' Send your feedback ')])), _: 1, __: [1] }), n[2] || (n[2] = Te('div', { 'grid': '~ rows-2 cols-2 gap-16', 'f-mt-lg': '', 'f-p-lg': '', 'class': 'grid-container' }, [Te('button', { 'data-color': 'red' }, [Te('div', { 'i-nimiq:alert': '' }), Te('span', null, 'Bug report')]), Te('button', { 'data-color': 'green' }, [Te('div', { 'i-nimiq:leaf-2-filled': '' }), Te('span', null, 'Got an idea?')]), Te('button', { 'data-color': 'gold' }, [Te('div', { 'i-nimiq:star': '' }), Te('span', null, 'Feedback')])], -1)), Q(P(mc), { 'aria-label': 'Close', 'close-btn': '', 'absolute': '', 'right-16': '', 'top-16': '', 'text-28': '' })])]), _: 1 })]), _: 1 })]), _: 1 })]), _: 1 })) } }), [['__scopeId', 'data-v-b3b0f42f']]); window.mountFeedbackWidget = (e, t = {}) => {
    const n = document.querySelector(e); if (!n)
      throw new Error(`Mount target ${e} not found`); console.log('Mounting feedback widget', e, t), qu(Xc, t).mount(n)
  }
})
