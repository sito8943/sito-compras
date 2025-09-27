var d9 = Object.defineProperty,
    p9 = Object.defineProperties
var h9 = Object.getOwnPropertyDescriptors
var A3 = Object.getOwnPropertySymbols
var li = Object.prototype.hasOwnProperty,
    fi = Object.prototype.propertyIsEnumerable
var si = (e, t, r) =>
        t in e
            ? d9(e, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: r,
              })
            : (e[t] = r),
    z = (e, t) => {
        for (var r in (t ||= {})) li.call(t, r) && si(e, r, t[r])
        if (A3) for (var r of A3(t)) fi.call(t, r) && si(e, r, t[r])
        return e
    },
    K = (e, t) => p9(e, h9(t))
var ui = (e, t) => {
    var r = {}
    for (var n in e) li.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n])
    if (e != null && A3)
        for (var n of A3(e)) t.indexOf(n) < 0 && fi.call(e, n) && (r[n] = e[n])
    return r
}
function m9(e, t) {
    return Object.is(e, t)
}
var i2 = null,
    k3 = !1,
    R3 = 1,
    ke = Symbol('SIGNAL')
function j(e) {
    let t = i2
    return (i2 = e), t
}
var rn = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {},
}
function di(e) {
    if (k3) throw new Error('')
    if (i2 === null) return
    i2.consumerOnSignalRead(e)
    let t = i2.nextProducerIndex++
    if (
        (Ae(i2),
        t < i2.producerNode.length && i2.producerNode[t] !== e && L4(i2))
    ) {
        let r = i2.producerNode[t]
        P3(r, i2.producerIndexOfThis[t])
    }
    i2.producerNode[t] !== e &&
        ((i2.producerNode[t] = e),
        (i2.producerIndexOfThis[t] = L4(i2) ? Mi(e, i2, t) : 0)),
        (i2.producerLastReadVersion[t] = e.version)
}
function g9() {
    R3++
}
function v9(e) {
    if (!(L4(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === R3)) {
        if (!e.producerMustRecompute(e) && !an(e)) {
            ;(e.dirty = !1), (e.lastCleanEpoch = R3)
            return
        }
        e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = R3)
    }
}
function pi(e) {
    if (e.liveConsumerNode === void 0) return
    let t = k3
    k3 = !0
    try {
        for (let r of e.liveConsumerNode) r.dirty || M9(r)
    } finally {
        k3 = t
    }
}
function hi() {
    return i2?.consumerAllowSignalWrites !== !1
}
function M9(e) {
    ;(e.dirty = !0), pi(e), e.consumerMarkedDirty?.(e)
}
function mi(e) {
    return e && (e.nextProducerIndex = 0), j(e)
}
function gi(e, t) {
    if (
        (j(t),
        !(
            !e ||
            e.producerNode === void 0 ||
            e.producerIndexOfThis === void 0 ||
            e.producerLastReadVersion === void 0
        ))
    ) {
        if (L4(e))
            for (let r = e.nextProducerIndex; r < e.producerNode.length; r++)
                P3(e.producerNode[r], e.producerIndexOfThis[r])
        for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
                e.producerLastReadVersion.pop(),
                e.producerIndexOfThis.pop()
    }
}
function an(e) {
    Ae(e)
    for (let t = 0; t < e.producerNode.length; t++) {
        let r = e.producerNode[t],
            n = e.producerLastReadVersion[t]
        if (n !== r.version || (v9(r), n !== r.version)) return !0
    }
    return !1
}
function vi(e) {
    if ((Ae(e), L4(e)))
        for (let t = 0; t < e.producerNode.length; t++)
            P3(e.producerNode[t], e.producerIndexOfThis[t])
    ;(e.producerNode.length =
        e.producerLastReadVersion.length =
        e.producerIndexOfThis.length =
            0),
        e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}
function Mi(e, t, r) {
    if ((Ci(e), Ae(e), e.liveConsumerNode.length === 0))
        for (let n = 0; n < e.producerNode.length; n++)
            e.producerIndexOfThis[n] = Mi(e.producerNode[n], e, n)
    return e.liveConsumerIndexOfThis.push(r), e.liveConsumerNode.push(t) - 1
}
function P3(e, t) {
    if ((Ci(e), Ae(e), e.liveConsumerNode.length === 1))
        for (let n = 0; n < e.producerNode.length; n++)
            P3(e.producerNode[n], e.producerIndexOfThis[n])
    let r = e.liveConsumerNode.length - 1
    if (
        ((e.liveConsumerNode[t] = e.liveConsumerNode[r]),
        (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[r]),
        e.liveConsumerNode.length--,
        e.liveConsumerIndexOfThis.length--,
        t < e.liveConsumerNode.length)
    ) {
        let n = e.liveConsumerIndexOfThis[t],
            a = e.liveConsumerNode[t]
        Ae(a), (a.producerIndexOfThis[n] = t)
    }
}
function L4(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}
function Ae(e) {
    ;(e.producerNode ??= []),
        (e.producerIndexOfThis ??= []),
        (e.producerLastReadVersion ??= [])
}
function Ci(e) {
    ;(e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= [])
}
function C9() {
    throw new Error()
}
var yi = C9
function zi() {
    yi()
}
function Li(e) {
    yi = e
}
var y9 = null
function wi(e) {
    let t = Object.create(Si)
    t.value = e
    let r = () => (di(t), t.value)
    return (r[ke] = t), r
}
function on(e, t) {
    hi() || zi(), e.equal(e.value, t) || ((e.value = t), z9(e))
}
function bi(e, t) {
    hi() || zi(), on(e, t(e.value))
}
var Si = K(z({}, rn), { equal: m9, value: void 0 })
function z9(e) {
    e.version++, g9(), pi(e), y9?.()
}
function N(e) {
    return typeof e == 'function'
}
function Re(e) {
    let r = e(n => {
        Error.call(n), (n.stack = new Error().stack)
    })
    return (
        (r.prototype = Object.create(Error.prototype)),
        (r.prototype.constructor = r),
        r
    )
}
var _3 = Re(
    e =>
        function (r) {
            e(this),
                (this.message = r
                    ? `${r.length} errors occurred during unsubscription:
${r.map((n, a) => `${a + 1}) ${n.toString()}`).join(`
  `)}`
                    : ''),
                (this.name = 'UnsubscriptionError'),
                (this.errors = r)
        }
)
function w4(e, t) {
    if (e) {
        let r = e.indexOf(t)
        0 <= r && e.splice(r, 1)
    }
}
var n2 = class e {
    constructor(t) {
        ;(this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null)
    }
    unsubscribe() {
        let t
        if (!this.closed) {
            this.closed = !0
            let { _parentage: r } = this
            if (r)
                if (((this._parentage = null), Array.isArray(r)))
                    for (let i of r) i.remove(this)
                else r.remove(this)
            let { initialTeardown: n } = this
            if (N(n))
                try {
                    n()
                } catch (i) {
                    t = i instanceof _3 ? i.errors : [i]
                }
            let { _finalizers: a } = this
            if (a) {
                this._finalizers = null
                for (let i of a)
                    try {
                        xi(i)
                    } catch (o) {
                        ;(t = t ?? []),
                            o instanceof _3
                                ? (t = [...t, ...o.errors])
                                : t.push(o)
                    }
            }
            if (t) throw new _3(t)
        }
    }
    add(t) {
        var r
        if (t && t !== this)
            if (this.closed) xi(t)
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this)) return
                    t._addParent(this)
                }
                ;(this._finalizers =
                    (r = this._finalizers) !== null && r !== void 0
                        ? r
                        : []).push(t)
            }
    }
    _hasParent(t) {
        let { _parentage: r } = this
        return r === t || (Array.isArray(r) && r.includes(t))
    }
    _addParent(t) {
        let { _parentage: r } = this
        this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t
    }
    _removeParent(t) {
        let { _parentage: r } = this
        r === t ? (this._parentage = null) : Array.isArray(r) && w4(r, t)
    }
    remove(t) {
        let { _finalizers: r } = this
        r && w4(r, t), t instanceof e && t._removeParent(this)
    }
}
n2.EMPTY = (() => {
    let e = new n2()
    return (e.closed = !0), e
})()
var cn = n2.EMPTY
function F3(e) {
    return (
        e instanceof n2 ||
        (e && 'closed' in e && N(e.remove) && N(e.add) && N(e.unsubscribe))
    )
}
function xi(e) {
    N(e) ? e() : e.unsubscribe()
}
var U2 = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1,
}
var Pe = {
    setTimeout(e, t, ...r) {
        let { delegate: n } = Pe
        return n?.setTimeout ? n.setTimeout(e, t, ...r) : setTimeout(e, t, ...r)
    },
    clearTimeout(e) {
        let { delegate: t } = Pe
        return (t?.clearTimeout || clearTimeout)(e)
    },
    delegate: void 0,
}
function O3(e) {
    Pe.setTimeout(() => {
        let { onUnhandledError: t } = U2
        if (t) t(e)
        else throw e
    })
}
function b4() {}
var Di = sn('C', void 0, void 0)
function Ni(e) {
    return sn('E', void 0, e)
}
function Ei(e) {
    return sn('N', e, void 0)
}
function sn(e, t, r) {
    return { kind: e, value: t, error: r }
}
var ee = null
function _e(e) {
    if (U2.useDeprecatedSynchronousErrorHandling) {
        let t = !ee
        if ((t && (ee = { errorThrown: !1, error: null }), e(), t)) {
            let { errorThrown: r, error: n } = ee
            if (((ee = null), r)) throw n
        }
    } else e()
}
function Ii(e) {
    U2.useDeprecatedSynchronousErrorHandling &&
        ee &&
        ((ee.errorThrown = !0), (ee.error = e))
}
var te = class extends n2 {
        constructor(t) {
            super(),
                (this.isStopped = !1),
                t
                    ? ((this.destination = t), F3(t) && t.add(this))
                    : (this.destination = b9)
        }
        static create(t, r, n) {
            return new Fe(t, r, n)
        }
        next(t) {
            this.isStopped ? fn(Ei(t), this) : this._next(t)
        }
        error(t) {
            this.isStopped
                ? fn(Ni(t), this)
                : ((this.isStopped = !0), this._error(t))
        }
        complete() {
            this.isStopped
                ? fn(Di, this)
                : ((this.isStopped = !0), this._complete())
        }
        unsubscribe() {
            this.closed ||
                ((this.isStopped = !0),
                super.unsubscribe(),
                (this.destination = null))
        }
        _next(t) {
            this.destination.next(t)
        }
        _error(t) {
            try {
                this.destination.error(t)
            } finally {
                this.unsubscribe()
            }
        }
        _complete() {
            try {
                this.destination.complete()
            } finally {
                this.unsubscribe()
            }
        }
    },
    L9 = Function.prototype.bind
function ln(e, t) {
    return L9.call(e, t)
}
var un = class {
        constructor(t) {
            this.partialObserver = t
        }
        next(t) {
            let { partialObserver: r } = this
            if (r.next)
                try {
                    r.next(t)
                } catch (n) {
                    B3(n)
                }
        }
        error(t) {
            let { partialObserver: r } = this
            if (r.error)
                try {
                    r.error(t)
                } catch (n) {
                    B3(n)
                }
            else B3(t)
        }
        complete() {
            let { partialObserver: t } = this
            if (t.complete)
                try {
                    t.complete()
                } catch (r) {
                    B3(r)
                }
        }
    },
    Fe = class extends te {
        constructor(t, r, n) {
            super()
            let a
            if (N(t) || !t)
                a = {
                    next: t ?? void 0,
                    error: r ?? void 0,
                    complete: n ?? void 0,
                }
            else {
                let i
                this && U2.useDeprecatedNextContext
                    ? ((i = Object.create(t)),
                      (i.unsubscribe = () => this.unsubscribe()),
                      (a = {
                          next: t.next && ln(t.next, i),
                          error: t.error && ln(t.error, i),
                          complete: t.complete && ln(t.complete, i),
                      }))
                    : (a = t)
            }
            this.destination = new un(a)
        }
    }
function B3(e) {
    U2.useDeprecatedSynchronousErrorHandling ? Ii(e) : O3(e)
}
function w9(e) {
    throw e
}
function fn(e, t) {
    let { onStoppedNotification: r } = U2
    r && Pe.setTimeout(() => r(e, t))
}
var b9 = { closed: !0, next: b4, error: w9, complete: b4 }
var Oe = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function w2(e) {
    return e
}
function dn(...e) {
    return pn(e)
}
function pn(e) {
    return e.length === 0
        ? w2
        : e.length === 1
        ? e[0]
        : function (r) {
              return e.reduce((n, a) => a(n), r)
          }
}
var U = (() => {
    class e {
        constructor(r) {
            r && (this._subscribe = r)
        }
        lift(r) {
            let n = new e()
            return (n.source = this), (n.operator = r), n
        }
        subscribe(r, n, a) {
            let i = x9(r) ? r : new Fe(r, n, a)
            return (
                _e(() => {
                    let { operator: o, source: c } = this
                    i.add(
                        o
                            ? o.call(i, c)
                            : c
                            ? this._subscribe(i)
                            : this._trySubscribe(i)
                    )
                }),
                i
            )
        }
        _trySubscribe(r) {
            try {
                return this._subscribe(r)
            } catch (n) {
                r.error(n)
            }
        }
        forEach(r, n) {
            return (
                (n = Ti(n)),
                new n((a, i) => {
                    let o = new Fe({
                        next: c => {
                            try {
                                r(c)
                            } catch (s) {
                                i(s), o.unsubscribe()
                            }
                        },
                        error: i,
                        complete: a,
                    })
                    this.subscribe(o)
                })
            )
        }
        _subscribe(r) {
            var n
            return (n = this.source) === null || n === void 0
                ? void 0
                : n.subscribe(r)
        }
        [Oe]() {
            return this
        }
        pipe(...r) {
            return pn(r)(this)
        }
        toPromise(r) {
            return (
                (r = Ti(r)),
                new r((n, a) => {
                    let i
                    this.subscribe(
                        o => (i = o),
                        o => a(o),
                        () => n(i)
                    )
                })
            )
        }
    }
    return (e.create = t => new e(t)), e
})()
function Ti(e) {
    var t
    return (t = e ?? U2.Promise) !== null && t !== void 0 ? t : Promise
}
function S9(e) {
    return e && N(e.next) && N(e.error) && N(e.complete)
}
function x9(e) {
    return (e && e instanceof te) || (S9(e) && F3(e))
}
function hn(e) {
    return N(e?.lift)
}
function O(e) {
    return t => {
        if (hn(t))
            return t.lift(function (r) {
                try {
                    return e(r, this)
                } catch (n) {
                    this.error(n)
                }
            })
        throw new TypeError('Unable to lift unknown Observable type')
    }
}
function B(e, t, r, n, a) {
    return new mn(e, t, r, n, a)
}
var mn = class extends te {
    constructor(t, r, n, a, i, o) {
        super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = o),
            (this._next = r
                ? function (c) {
                      try {
                          r(c)
                      } catch (s) {
                          t.error(s)
                      }
                  }
                : super._next),
            (this._error = a
                ? function (c) {
                      try {
                          a(c)
                      } catch (s) {
                          t.error(s)
                      } finally {
                          this.unsubscribe()
                      }
                  }
                : super._error),
            (this._complete = n
                ? function () {
                      try {
                          n()
                      } catch (c) {
                          t.error(c)
                      } finally {
                          this.unsubscribe()
                      }
                  }
                : super._complete)
    }
    unsubscribe() {
        var t
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let { closed: r } = this
            super.unsubscribe(),
                !r &&
                    ((t = this.onFinalize) === null ||
                        t === void 0 ||
                        t.call(this))
        }
    }
}
function Be() {
    return O((e, t) => {
        let r = null
        e._refCount++
        let n = B(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                r = null
                return
            }
            let a = e._connection,
                i = r
            ;(r = null),
                a && (!i || a === i) && a.unsubscribe(),
                t.unsubscribe()
        })
        e.subscribe(n), n.closed || (r = e.connect())
    })
}
var je = class extends U {
    constructor(t, r) {
        super(),
            (this.source = t),
            (this.subjectFactory = r),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            hn(t) && (this.lift = t.lift)
    }
    _subscribe(t) {
        return this.getSubject().subscribe(t)
    }
    getSubject() {
        let t = this._subject
        return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
        )
    }
    _teardown() {
        this._refCount = 0
        let { _connection: t } = this
        ;(this._subject = this._connection = null), t?.unsubscribe()
    }
    connect() {
        let t = this._connection
        if (!t) {
            t = this._connection = new n2()
            let r = this.getSubject()
            t.add(
                this.source.subscribe(
                    B(
                        r,
                        void 0,
                        () => {
                            this._teardown(), r.complete()
                        },
                        n => {
                            this._teardown(), r.error(n)
                        },
                        () => this._teardown()
                    )
                )
            ),
                t.closed && ((this._connection = null), (t = n2.EMPTY))
        }
        return t
    }
    refCount() {
        return Be()(this)
    }
}
var Ai = Re(
    e =>
        function () {
            e(this),
                (this.name = 'ObjectUnsubscribedError'),
                (this.message = 'object unsubscribed')
        }
)
var v2 = (() => {
        class e extends U {
            constructor() {
                super(),
                    (this.closed = !1),
                    (this.currentObservers = null),
                    (this.observers = []),
                    (this.isStopped = !1),
                    (this.hasError = !1),
                    (this.thrownError = null)
            }
            lift(r) {
                let n = new j3(this, this)
                return (n.operator = r), n
            }
            _throwIfClosed() {
                if (this.closed) throw new Ai()
            }
            next(r) {
                _e(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.currentObservers ||
                            (this.currentObservers = Array.from(this.observers))
                        for (let n of this.currentObservers) n.next(r)
                    }
                })
            }
            error(r) {
                _e(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        ;(this.hasError = this.isStopped = !0),
                            (this.thrownError = r)
                        let { observers: n } = this
                        for (; n.length; ) n.shift().error(r)
                    }
                })
            }
            complete() {
                _e(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.isStopped = !0
                        let { observers: r } = this
                        for (; r.length; ) r.shift().complete()
                    }
                })
            }
            unsubscribe() {
                ;(this.isStopped = this.closed = !0),
                    (this.observers = this.currentObservers = null)
            }
            get observed() {
                var r
                return (
                    ((r = this.observers) === null || r === void 0
                        ? void 0
                        : r.length) > 0
                )
            }
            _trySubscribe(r) {
                return this._throwIfClosed(), super._trySubscribe(r)
            }
            _subscribe(r) {
                return (
                    this._throwIfClosed(),
                    this._checkFinalizedStatuses(r),
                    this._innerSubscribe(r)
                )
            }
            _innerSubscribe(r) {
                let { hasError: n, isStopped: a, observers: i } = this
                return n || a
                    ? cn
                    : ((this.currentObservers = null),
                      i.push(r),
                      new n2(() => {
                          ;(this.currentObservers = null), w4(i, r)
                      }))
            }
            _checkFinalizedStatuses(r) {
                let { hasError: n, thrownError: a, isStopped: i } = this
                n ? r.error(a) : i && r.complete()
            }
            asObservable() {
                let r = new U()
                return (r.source = this), r
            }
        }
        return (e.create = (t, r) => new j3(t, r)), e
    })(),
    j3 = class extends v2 {
        constructor(t, r) {
            super(), (this.destination = t), (this.source = r)
        }
        next(t) {
            var r, n
            ;(n =
                (r = this.destination) === null || r === void 0
                    ? void 0
                    : r.next) === null ||
                n === void 0 ||
                n.call(r, t)
        }
        error(t) {
            var r, n
            ;(n =
                (r = this.destination) === null || r === void 0
                    ? void 0
                    : r.error) === null ||
                n === void 0 ||
                n.call(r, t)
        }
        complete() {
            var t, r
            ;(r =
                (t = this.destination) === null || t === void 0
                    ? void 0
                    : t.complete) === null ||
                r === void 0 ||
                r.call(t)
        }
        _subscribe(t) {
            var r, n
            return (n =
                (r = this.source) === null || r === void 0
                    ? void 0
                    : r.subscribe(t)) !== null && n !== void 0
                ? n
                : cn
        }
    }
var l2 = class extends v2 {
    constructor(t) {
        super(), (this._value = t)
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let r = super._subscribe(t)
        return !r.closed && t.next(this._value), r
    }
    getValue() {
        let { hasError: t, thrownError: r, _value: n } = this
        if (t) throw r
        return this._throwIfClosed(), n
    }
    next(t) {
        super.next((this._value = t))
    }
}
var b2 = new U(e => e.complete())
function ki(e) {
    return e && N(e.schedule)
}
function Ri(e) {
    return e[e.length - 1]
}
function Pi(e) {
    return N(Ri(e)) ? e.pop() : void 0
}
function D1(e) {
    return ki(Ri(e)) ? e.pop() : void 0
}
function Fi(e, t, r, n) {
    function a(i) {
        return i instanceof r
            ? i
            : new r(function (o) {
                  o(i)
              })
    }
    return new (r || (r = Promise))(function (i, o) {
        function c(f) {
            try {
                l(n.next(f))
            } catch (u) {
                o(u)
            }
        }
        function s(f) {
            try {
                l(n.throw(f))
            } catch (u) {
                o(u)
            }
        }
        function l(f) {
            f.done ? i(f.value) : a(f.value).then(c, s)
        }
        l((n = n.apply(e, t || [])).next())
    })
}
function _i(e) {
    var t = typeof Symbol == 'function' && Symbol.iterator,
        r = t && e[t],
        n = 0
    if (r) return r.call(e)
    if (e && typeof e.length == 'number')
        return {
            next: function () {
                return (
                    e && n >= e.length && (e = void 0),
                    { value: e && e[n++], done: !e }
                )
            },
        }
    throw new TypeError(
        t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    )
}
function ne(e) {
    return this instanceof ne ? ((this.v = e), this) : new ne(e)
}
function Oi(e, t, r) {
    if (!Symbol.asyncIterator)
        throw new TypeError('Symbol.asyncIterator is not defined.')
    var n = r.apply(e, t || []),
        a,
        i = []
    return (
        (a = Object.create(
            (typeof AsyncIterator == 'function' ? AsyncIterator : Object)
                .prototype
        )),
        c('next'),
        c('throw'),
        c('return', o),
        (a[Symbol.asyncIterator] = function () {
            return this
        }),
        a
    )
    function o(p) {
        return function (m) {
            return Promise.resolve(m).then(p, u)
        }
    }
    function c(p, m) {
        n[p] &&
            ((a[p] = function (v) {
                return new Promise(function (C, M) {
                    i.push([p, v, C, M]) > 1 || s(p, v)
                })
            }),
            m && (a[p] = m(a[p])))
    }
    function s(p, m) {
        try {
            l(n[p](m))
        } catch (v) {
            d(i[0][3], v)
        }
    }
    function l(p) {
        p.value instanceof ne
            ? Promise.resolve(p.value.v).then(f, u)
            : d(i[0][2], p)
    }
    function f(p) {
        s('next', p)
    }
    function u(p) {
        s('throw', p)
    }
    function d(p, m) {
        p(m), i.shift(), i.length && s(i[0][0], i[0][1])
    }
}
function Bi(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError('Symbol.asyncIterator is not defined.')
    var t = e[Symbol.asyncIterator],
        r
    return t
        ? t.call(e)
        : ((e = typeof _i == 'function' ? _i(e) : e[Symbol.iterator]()),
          (r = {}),
          n('next'),
          n('throw'),
          n('return'),
          (r[Symbol.asyncIterator] = function () {
              return this
          }),
          r)
    function n(i) {
        r[i] =
            e[i] &&
            function (o) {
                return new Promise(function (c, s) {
                    ;(o = e[i](o)), a(c, s, o.done, o.value)
                })
            }
    }
    function a(i, o, c, s) {
        Promise.resolve(s).then(function (l) {
            i({ value: l, done: c })
        }, o)
    }
}
var U3 = e => e && typeof e.length == 'number' && typeof e != 'function'
function H3(e) {
    return N(e?.then)
}
function V3(e) {
    return N(e[Oe])
}
function $3(e) {
    return Symbol.asyncIterator && N(e?.[Symbol.asyncIterator])
}
function W3(e) {
    return new TypeError(
        `You provided ${
            e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`
        } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
    )
}
function D9() {
    return typeof Symbol != 'function' || !Symbol.iterator
        ? '@@iterator'
        : Symbol.iterator
}
var q3 = D9()
function G3(e) {
    return N(e?.[q3])
}
function Y3(e) {
    return Oi(this, arguments, function* () {
        let r = e.getReader()
        try {
            for (;;) {
                let { value: n, done: a } = yield ne(r.read())
                if (a) return yield ne(void 0)
                yield yield ne(n)
            }
        } finally {
            r.releaseLock()
        }
    })
}
function Q3(e) {
    return N(e?.getReader)
}
function o2(e) {
    if (e instanceof U) return e
    if (e != null) {
        if (V3(e)) return N9(e)
        if (U3(e)) return E9(e)
        if (H3(e)) return I9(e)
        if ($3(e)) return ji(e)
        if (G3(e)) return T9(e)
        if (Q3(e)) return A9(e)
    }
    throw W3(e)
}
function N9(e) {
    return new U(t => {
        let r = e[Oe]()
        if (N(r.subscribe)) return r.subscribe(t)
        throw new TypeError(
            'Provided object does not correctly implement Symbol.observable'
        )
    })
}
function E9(e) {
    return new U(t => {
        for (let r = 0; r < e.length && !t.closed; r++) t.next(e[r])
        t.complete()
    })
}
function I9(e) {
    return new U(t => {
        e.then(
            r => {
                t.closed || (t.next(r), t.complete())
            },
            r => t.error(r)
        ).then(null, O3)
    })
}
function T9(e) {
    return new U(t => {
        for (let r of e) if ((t.next(r), t.closed)) return
        t.complete()
    })
}
function ji(e) {
    return new U(t => {
        k9(e, t).catch(r => t.error(r))
    })
}
function A9(e) {
    return ji(Y3(e))
}
function k9(e, t) {
    var r, n, a, i
    return Fi(this, void 0, void 0, function* () {
        try {
            for (r = Bi(e); (n = yield r.next()), !n.done; ) {
                let o = n.value
                if ((t.next(o), t.closed)) return
            }
        } catch (o) {
            a = { error: o }
        } finally {
            try {
                n && !n.done && (i = r.return) && (yield i.call(r))
            } finally {
                if (a) throw a.error
            }
        }
        t.complete()
    })
}
function y2(e, t, r, n = 0, a = !1) {
    let i = t.schedule(function () {
        r(), a ? e.add(this.schedule(null, n)) : this.unsubscribe()
    }, n)
    if ((e.add(i), !a)) return i
}
function Z3(e, t = 0) {
    return O((r, n) => {
        r.subscribe(
            B(
                n,
                a => y2(n, e, () => n.next(a), t),
                () => y2(n, e, () => n.complete(), t),
                a => y2(n, e, () => n.error(a), t)
            )
        )
    })
}
function K3(e, t = 0) {
    return O((r, n) => {
        n.add(e.schedule(() => r.subscribe(n), t))
    })
}
function Ui(e, t) {
    return o2(e).pipe(K3(t), Z3(t))
}
function Hi(e, t) {
    return o2(e).pipe(K3(t), Z3(t))
}
function Vi(e, t) {
    return new U(r => {
        let n = 0
        return t.schedule(function () {
            n === e.length
                ? r.complete()
                : (r.next(e[n++]), r.closed || this.schedule())
        })
    })
}
function $i(e, t) {
    return new U(r => {
        let n
        return (
            y2(r, t, () => {
                ;(n = e[q3]()),
                    y2(
                        r,
                        t,
                        () => {
                            let a, i
                            try {
                                ;({ value: a, done: i } = n.next())
                            } catch (o) {
                                r.error(o)
                                return
                            }
                            i ? r.complete() : r.next(a)
                        },
                        0,
                        !0
                    )
            }),
            () => N(n?.return) && n.return()
        )
    })
}
function X3(e, t) {
    if (!e) throw new Error('Iterable cannot be null')
    return new U(r => {
        y2(r, t, () => {
            let n = e[Symbol.asyncIterator]()
            y2(
                r,
                t,
                () => {
                    n.next().then(a => {
                        a.done ? r.complete() : r.next(a.value)
                    })
                },
                0,
                !0
            )
        })
    })
}
function Wi(e, t) {
    return X3(Y3(e), t)
}
function qi(e, t) {
    if (e != null) {
        if (V3(e)) return Ui(e, t)
        if (U3(e)) return Vi(e, t)
        if (H3(e)) return Hi(e, t)
        if ($3(e)) return X3(e, t)
        if (G3(e)) return $i(e, t)
        if (Q3(e)) return Wi(e, t)
    }
    throw W3(e)
}
function X(e, t) {
    return t ? qi(e, t) : o2(e)
}
function S(...e) {
    let t = D1(e)
    return X(e, t)
}
function Ue(e, t) {
    let r = N(e) ? e : () => e,
        n = a => a.error(r())
    return new U(t ? a => t.schedule(n, 0, a) : n)
}
function gn(e) {
    return !!e && (e instanceof U || (N(e.lift) && N(e.subscribe)))
}
var f1 = Re(
    e =>
        function () {
            e(this),
                (this.name = 'EmptyError'),
                (this.message = 'no elements in sequence')
        }
)
function A(e, t) {
    return O((r, n) => {
        let a = 0
        r.subscribe(
            B(n, i => {
                n.next(e.call(t, i, a++))
            })
        )
    })
}
var { isArray: R9 } = Array
function P9(e, t) {
    return R9(t) ? e(...t) : e(t)
}
function Gi(e) {
    return A(t => P9(e, t))
}
var { isArray: _9 } = Array,
    { getPrototypeOf: F9, prototype: O9, keys: B9 } = Object
function Yi(e) {
    if (e.length === 1) {
        let t = e[0]
        if (_9(t)) return { args: t, keys: null }
        if (j9(t)) {
            let r = B9(t)
            return { args: r.map(n => t[n]), keys: r }
        }
    }
    return { args: e, keys: null }
}
function j9(e) {
    return e && typeof e == 'object' && F9(e) === O9
}
function Qi(e, t) {
    return e.reduce((r, n, a) => ((r[n] = t[a]), r), {})
}
function J3(...e) {
    let t = D1(e),
        r = Pi(e),
        { args: n, keys: a } = Yi(e)
    if (n.length === 0) return X([], t)
    let i = new U(U9(n, t, a ? o => Qi(a, o) : w2))
    return r ? i.pipe(Gi(r)) : i
}
function U9(e, t, r = w2) {
    return n => {
        Zi(
            t,
            () => {
                let { length: a } = e,
                    i = new Array(a),
                    o = a,
                    c = a
                for (let s = 0; s < a; s++)
                    Zi(
                        t,
                        () => {
                            let l = X(e[s], t),
                                f = !1
                            l.subscribe(
                                B(
                                    n,
                                    u => {
                                        ;(i[s] = u),
                                            f || ((f = !0), c--),
                                            c || n.next(r(i.slice()))
                                    },
                                    () => {
                                        --o || n.complete()
                                    }
                                )
                            )
                        },
                        n
                    )
            },
            n
        )
    }
}
function Zi(e, t, r) {
    e ? y2(r, e, t) : t()
}
function Ki(e, t, r, n, a, i, o, c) {
    let s = [],
        l = 0,
        f = 0,
        u = !1,
        d = () => {
            u && !s.length && !l && t.complete()
        },
        p = v => (l < n ? m(v) : s.push(v)),
        m = v => {
            i && t.next(v), l++
            let C = !1
            o2(r(v, f++)).subscribe(
                B(
                    t,
                    M => {
                        a?.(M), i ? p(M) : t.next(M)
                    },
                    () => {
                        C = !0
                    },
                    void 0,
                    () => {
                        if (C)
                            try {
                                for (l--; s.length && l < n; ) {
                                    let M = s.shift()
                                    o ? y2(t, o, () => m(M)) : m(M)
                                }
                                d()
                            } catch (M) {
                                t.error(M)
                            }
                    }
                )
            )
        }
    return (
        e.subscribe(
            B(t, p, () => {
                ;(u = !0), d()
            })
        ),
        () => {
            c?.()
        }
    )
}
function r2(e, t, r = 1 / 0) {
    return N(t)
        ? r2((n, a) => A((i, o) => t(n, i, a, o))(o2(e(n, a))), r)
        : (typeof t == 'number' && (r = t), O((n, a) => Ki(n, a, e, r)))
}
function vn(e = 1 / 0) {
    return r2(w2, e)
}
function Xi() {
    return vn(1)
}
function He(...e) {
    return Xi()(X(e, D1(e)))
}
function e0(e) {
    return new U(t => {
        o2(e()).subscribe(t)
    })
}
function S2(e, t) {
    return O((r, n) => {
        let a = 0
        r.subscribe(B(n, i => e.call(t, i, a++) && n.next(i)))
    })
}
function N1(e) {
    return O((t, r) => {
        let n = null,
            a = !1,
            i
        ;(n = t.subscribe(
            B(r, void 0, void 0, o => {
                ;(i = o2(e(o, N1(e)(t)))),
                    n ? (n.unsubscribe(), (n = null), i.subscribe(r)) : (a = !0)
            })
        )),
            a && (n.unsubscribe(), (n = null), i.subscribe(r))
    })
}
function Ji(e, t, r, n, a) {
    return (i, o) => {
        let c = r,
            s = t,
            l = 0
        i.subscribe(
            B(
                o,
                f => {
                    let u = l++
                    ;(s = c ? e(s, f, u) : ((c = !0), f)), n && o.next(s)
                },
                a &&
                    (() => {
                        c && o.next(s), o.complete()
                    })
            )
        )
    }
}
function E1(e, t) {
    return N(t) ? r2(e, t, 1) : r2(e, 1)
}
function I1(e) {
    return O((t, r) => {
        let n = !1
        t.subscribe(
            B(
                r,
                a => {
                    ;(n = !0), r.next(a)
                },
                () => {
                    n || r.next(e), r.complete()
                }
            )
        )
    })
}
function u1(e) {
    return e <= 0
        ? () => b2
        : O((t, r) => {
              let n = 0
              t.subscribe(
                  B(r, a => {
                      ++n <= e && (r.next(a), e <= n && r.complete())
                  })
              )
          })
}
function Mn(e) {
    return A(() => e)
}
function t0(e = H9) {
    return O((t, r) => {
        let n = !1
        t.subscribe(
            B(
                r,
                a => {
                    ;(n = !0), r.next(a)
                },
                () => (n ? r.complete() : r.error(e()))
            )
        )
    })
}
function H9() {
    return new f1()
}
function T1(e) {
    return O((t, r) => {
        try {
            t.subscribe(r)
        } finally {
            r.add(e)
        }
    })
}
function H2(e, t) {
    let r = arguments.length >= 2
    return n =>
        n.pipe(
            e ? S2((a, i) => e(a, i, n)) : w2,
            u1(1),
            r ? I1(t) : t0(() => new f1())
        )
}
function Ve(e) {
    return e <= 0
        ? () => b2
        : O((t, r) => {
              let n = []
              t.subscribe(
                  B(
                      r,
                      a => {
                          n.push(a), e < n.length && n.shift()
                      },
                      () => {
                          for (let a of n) r.next(a)
                          r.complete()
                      },
                      void 0,
                      () => {
                          n = null
                      }
                  )
              )
          })
}
function Cn(e, t) {
    let r = arguments.length >= 2
    return n =>
        n.pipe(
            e ? S2((a, i) => e(a, i, n)) : w2,
            Ve(1),
            r ? I1(t) : t0(() => new f1())
        )
}
function yn(e, t) {
    return O(Ji(e, t, arguments.length >= 2, !0))
}
function zn(...e) {
    let t = D1(e)
    return O((r, n) => {
        ;(t ? He(e, r, t) : He(e, r)).subscribe(n)
    })
}
function x2(e, t) {
    return O((r, n) => {
        let a = null,
            i = 0,
            o = !1,
            c = () => o && !a && n.complete()
        r.subscribe(
            B(
                n,
                s => {
                    a?.unsubscribe()
                    let l = 0,
                        f = i++
                    o2(e(s, f)).subscribe(
                        (a = B(
                            n,
                            u => n.next(t ? t(s, u, f, l++) : u),
                            () => {
                                ;(a = null), c()
                            }
                        ))
                    )
                },
                () => {
                    ;(o = !0), c()
                }
            )
        )
    })
}
function Ln(e) {
    return O((t, r) => {
        o2(e).subscribe(B(r, () => r.complete(), b4)),
            !r.closed && t.subscribe(r)
    })
}
function a2(e, t, r) {
    let n = N(e) || t || r ? { next: e, error: t, complete: r } : e
    return n
        ? O((a, i) => {
              var o
              ;(o = n.subscribe) === null || o === void 0 || o.call(n)
              let c = !0
              a.subscribe(
                  B(
                      i,
                      s => {
                          var l
                          ;(l = n.next) === null ||
                              l === void 0 ||
                              l.call(n, s),
                              i.next(s)
                      },
                      () => {
                          var s
                          ;(c = !1),
                              (s = n.complete) === null ||
                                  s === void 0 ||
                                  s.call(n),
                              i.complete()
                      },
                      s => {
                          var l
                          ;(c = !1),
                              (l = n.error) === null ||
                                  l === void 0 ||
                                  l.call(n, s),
                              i.error(s)
                      },
                      () => {
                          var s, l
                          c &&
                              ((s = n.unsubscribe) === null ||
                                  s === void 0 ||
                                  s.call(n)),
                              (l = n.finalize) === null ||
                                  l === void 0 ||
                                  l.call(n)
                      }
                  )
              )
          })
        : w2
}
var Wo = 'https://g.co/ng/security#xss',
    w = class extends Error {
        constructor(t, r) {
            super(_0(t, r)), (this.code = t)
        }
    }
function _0(e, t) {
    return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`
}
function j4(e) {
    return { toString: e }.toString()
}
var n0 = '__parameters__'
function V9(e) {
    return function (...r) {
        if (e) {
            let n = e(...r)
            for (let a in n) this[a] = n[a]
        }
    }
}
function qo(e, t, r) {
    return j4(() => {
        let n = V9(t)
        function a(...i) {
            if (this instanceof a) return n.apply(this, i), this
            let o = new a(...i)
            return (c.annotation = o), c
            function c(s, l, f) {
                let u = s.hasOwnProperty(n0)
                    ? s[n0]
                    : Object.defineProperty(s, n0, { value: [] })[n0]
                for (; u.length <= f; ) u.push(null)
                return (u[f] = u[f] || []).push(o), s
            }
        }
        return (
            r && (a.prototype = Object.create(r.prototype)),
            (a.prototype.ngMetadataName = e),
            (a.annotationCls = a),
            a
        )
    })
}
var D2 = globalThis
function $(e) {
    for (let t in e) if (e[t] === $) return t
    throw Error('Could not find renamed property on target object.')
}
function M2(e) {
    if (typeof e == 'string') return e
    if (Array.isArray(e)) return '[' + e.map(M2).join(', ') + ']'
    if (e == null) return '' + e
    if (e.overriddenName) return `${e.overriddenName}`
    if (e.name) return `${e.name}`
    let t = e.toString()
    if (t == null) return '' + t
    let r = t.indexOf(`
`)
    return r === -1 ? t : t.substring(0, r)
}
function eo(e, t) {
    return e == null || e === ''
        ? t === null
            ? ''
            : t
        : t == null || t === ''
        ? e
        : e + ' ' + t
}
var $9 = $({ __forward_ref__: $ })
function Go(e) {
    return (
        (e.__forward_ref__ = Go),
        (e.toString = function () {
            return M2(this())
        }),
        e
    )
}
function _2(e) {
    return Yo(e) ? e() : e
}
function Yo(e) {
    return (
        typeof e == 'function' &&
        e.hasOwnProperty($9) &&
        e.__forward_ref__ === Go
    )
}
function y(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0,
    }
}
function _1(e) {
    return { providers: e.providers || [], imports: e.imports || [] }
}
function F0(e) {
    return to(e, Zo) || to(e, Ko)
}
function Qo(e) {
    return F0(e) !== null
}
function to(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null
}
function W9(e) {
    let t = e && (e[Zo] || e[Ko])
    return t || null
}
function no(e) {
    return e && (e.hasOwnProperty(ro) || e.hasOwnProperty(q9)) ? e[ro] : null
}
var Zo = $({ ɵprov: $ }),
    ro = $({ ɵinj: $ }),
    Ko = $({ ngInjectableDef: $ }),
    q9 = $({ ngInjectorDef: $ }),
    b = class {
        constructor(t, r) {
            ;(this._desc = t),
                (this.ngMetadataName = 'InjectionToken'),
                (this.ɵprov = void 0),
                typeof r == 'number'
                    ? (this.__NG_ELEMENT_ID__ = r)
                    : r !== void 0 &&
                      (this.ɵprov = y({
                          token: this,
                          providedIn: r.providedIn || 'root',
                          factory: r.factory,
                      }))
        }
        get multi() {
            return this
        }
        toString() {
            return `InjectionToken ${this._desc}`
        }
    }
function Xo(e) {
    return e && !!e.ɵproviders
}
var G9 = $({ ɵcmp: $ }),
    Y9 = $({ ɵdir: $ }),
    Q9 = $({ ɵpipe: $ }),
    Z9 = $({ ɵmod: $ }),
    m0 = $({ ɵfac: $ }),
    S4 = $({ __NG_ELEMENT_ID__: $ }),
    ao = $({ __NG_ENV_ID__: $ })
function ae(e) {
    return typeof e == 'string' ? e : e == null ? '' : String(e)
}
function K9(e) {
    return typeof e == 'function'
        ? e.name || e.toString()
        : typeof e == 'object' && e != null && typeof e.type == 'function'
        ? e.type.name || e.type.toString()
        : ae(e)
}
function X9(e, t) {
    let r = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : ''
    throw new w(-200, e)
}
function kr(e, t) {
    throw new w(-201, !1)
}
var k = (function (e) {
        return (
            (e[(e.Default = 0)] = 'Default'),
            (e[(e.Host = 1)] = 'Host'),
            (e[(e.Self = 2)] = 'Self'),
            (e[(e.SkipSelf = 4)] = 'SkipSelf'),
            (e[(e.Optional = 8)] = 'Optional'),
            e
        )
    })(k || {}),
    Bn
function Jo() {
    return Bn
}
function z2(e) {
    let t = Bn
    return (Bn = e), t
}
function ec(e, t, r) {
    let n = F0(e)
    if (n && n.providedIn == 'root')
        return n.value === void 0 ? (n.value = n.factory()) : n.value
    if (r & k.Optional) return null
    if (t !== void 0) return t
    kr(e, 'Injector')
}
var J9 = {},
    x4 = J9,
    jn = '__NG_DI_FLAG__',
    g0 = 'ngTempTokenPath',
    ef = 'ngTokenPath',
    tf = /\n/gm,
    nf = '\u0275',
    io = '__source',
    Ge
function rf() {
    return Ge
}
function A1(e) {
    let t = Ge
    return (Ge = e), t
}
function af(e, t = k.Default) {
    if (Ge === void 0) throw new w(-203, !1)
    return Ge === null
        ? ec(e, void 0, t)
        : Ge.get(e, t & k.Optional ? null : void 0, t)
}
function D(e, t = k.Default) {
    return (Jo() || af)(_2(e), t)
}
function g(e, t = k.Default) {
    return D(e, O0(t))
}
function O0(e) {
    return typeof e > 'u' || typeof e == 'number'
        ? e
        : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4)
}
function Un(e) {
    let t = []
    for (let r = 0; r < e.length; r++) {
        let n = _2(e[r])
        if (Array.isArray(n)) {
            if (n.length === 0) throw new w(900, !1)
            let a,
                i = k.Default
            for (let o = 0; o < n.length; o++) {
                let c = n[o],
                    s = of(c)
                typeof s == 'number'
                    ? s === -1
                        ? (a = c.token)
                        : (i |= s)
                    : (a = c)
            }
            t.push(D(a, i))
        } else t.push(D(n))
    }
    return t
}
function tc(e, t) {
    return (e[jn] = t), (e.prototype[jn] = t), e
}
function of(e) {
    return e[jn]
}
function cf(e, t, r, n) {
    let a = e[g0]
    throw (
        (t[io] && a.unshift(t[io]),
        (e.message = sf(
            `
` + e.message,
            a,
            r,
            n
        )),
        (e[ef] = a),
        (e[g0] = null),
        e)
    )
}
function sf(e, t, r, n = null) {
    e =
        e &&
        e.charAt(0) ===
            `
` &&
        e.charAt(1) == nf
            ? e.slice(2)
            : e
    let a = M2(t)
    if (Array.isArray(t)) a = t.map(M2).join(' -> ')
    else if (typeof t == 'object') {
        let i = []
        for (let o in t)
            if (t.hasOwnProperty(o)) {
                let c = t[o]
                i.push(
                    o + ':' + (typeof c == 'string' ? JSON.stringify(c) : M2(c))
                )
            }
        a = `{${i.join(', ')}}`
    }
    return `${r}${n ? '(' + n + ')' : ''}[${a}]: ${e.replace(
        tf,
        `
  `
    )}`
}
var Rr = tc(qo('Optional'), 8)
var nc = tc(qo('SkipSelf'), 4)
function oe(e, t) {
    let r = e.hasOwnProperty(m0)
    return r ? e[m0] : null
}
function Pr(e, t) {
    e.forEach(r => (Array.isArray(r) ? Pr(r, t) : t(r)))
}
function rc(e, t, r) {
    t >= e.length ? e.push(r) : e.splice(t, 0, r)
}
function v0(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function lf(e, t) {
    let r = []
    for (let n = 0; n < e; n++) r.push(t)
    return r
}
function ff(e, t, r, n) {
    let a = e.length
    if (a == t) e.push(r, n)
    else if (a === 1) e.push(n, e[0]), (e[0] = r)
    else {
        for (a--, e.push(e[a - 1], e[a]); a > t; ) {
            let i = a - 2
            ;(e[a] = e[i]), a--
        }
        ;(e[t] = r), (e[t + 1] = n)
    }
}
function uf(e, t, r) {
    let n = U4(e, t)
    return n >= 0 ? (e[n | 1] = r) : ((n = ~n), ff(e, n, t, r)), n
}
function wn(e, t) {
    let r = U4(e, t)
    if (r >= 0) return e[r | 1]
}
function U4(e, t) {
    return df(e, t, 1)
}
function df(e, t, r) {
    let n = 0,
        a = e.length >> r
    for (; a !== n; ) {
        let i = n + ((a - n) >> 1),
            o = e[i << r]
        if (t === o) return i << r
        o > t ? (a = i) : (n = i + 1)
    }
    return ~(a << r)
}
var D4 = {},
    F2 = [],
    ce = new b(''),
    ac = new b('', -1),
    ic = new b(''),
    M0 = class {
        get(t, r = x4) {
            if (r === x4) {
                let n = new Error(
                    `NullInjectorError: No provider for ${M2(t)}!`
                )
                throw ((n.name = 'NullInjectorError'), n)
            }
            return r
        }
    },
    oc = (function (e) {
        return (
            (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e
        )
    })(oc || {}),
    r1 = (function (e) {
        return (
            (e[(e.Emulated = 0)] = 'Emulated'),
            (e[(e.None = 2)] = 'None'),
            (e[(e.ShadowDom = 3)] = 'ShadowDom'),
            e
        )
    })(r1 || {}),
    R1 = (function (e) {
        return (
            (e[(e.None = 0)] = 'None'),
            (e[(e.SignalBased = 1)] = 'SignalBased'),
            (e[(e.HasDecoratorInputTransform = 2)] =
                'HasDecoratorInputTransform'),
            e
        )
    })(R1 || {})
function pf(e, t, r) {
    let n = e.length
    for (;;) {
        let a = e.indexOf(t, r)
        if (a === -1) return a
        if (a === 0 || e.charCodeAt(a - 1) <= 32) {
            let i = t.length
            if (a + i === n || e.charCodeAt(a + i) <= 32) return a
        }
        r = a + 1
    }
}
function Hn(e, t, r) {
    let n = 0
    for (; n < r.length; ) {
        let a = r[n]
        if (typeof a == 'number') {
            if (a !== 0) break
            n++
            let i = r[n++],
                o = r[n++],
                c = r[n++]
            e.setAttribute(t, o, c, i)
        } else {
            let i = a,
                o = r[++n]
            mf(i) ? e.setProperty(t, i, o) : e.setAttribute(t, i, o), n++
        }
    }
    return n
}
function hf(e) {
    return e === 3 || e === 4 || e === 6
}
function mf(e) {
    return e.charCodeAt(0) === 64
}
function _r(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0) e = t.slice()
        else {
            let r = -1
            for (let n = 0; n < t.length; n++) {
                let a = t[n]
                typeof a == 'number'
                    ? (r = a)
                    : r === 0 ||
                      (r === -1 || r === 2
                          ? oo(e, r, a, null, t[++n])
                          : oo(e, r, a, null, null))
            }
        }
    return e
}
function oo(e, t, r, n, a) {
    let i = 0,
        o = e.length
    if (t === -1) o = -1
    else
        for (; i < e.length; ) {
            let c = e[i++]
            if (typeof c == 'number') {
                if (c === t) {
                    o = -1
                    break
                } else if (c > t) {
                    o = i - 1
                    break
                }
            }
        }
    for (; i < e.length; ) {
        let c = e[i]
        if (typeof c == 'number') break
        if (c === r) {
            if (n === null) {
                a !== null && (e[i + 1] = a)
                return
            } else if (n === e[i + 1]) {
                e[i + 2] = a
                return
            }
        }
        i++, n !== null && i++, a !== null && i++
    }
    o !== -1 && (e.splice(o, 0, t), (i = o + 1)),
        e.splice(i++, 0, r),
        n !== null && e.splice(i++, 0, n),
        a !== null && e.splice(i++, 0, a)
}
var cc = 'ng-template'
function gf(e, t, r, n) {
    let a = 0
    if (n) {
        for (; a < t.length && typeof t[a] == 'string'; a += 2)
            if (t[a] === 'class' && pf(t[a + 1].toLowerCase(), r, 0) !== -1)
                return !0
    } else if (Fr(e)) return !1
    if (((a = t.indexOf(1, a)), a > -1)) {
        let i
        for (; ++a < t.length && typeof (i = t[a]) == 'string'; )
            if (i.toLowerCase() === r) return !0
    }
    return !1
}
function Fr(e) {
    return e.type === 4 && e.value !== cc
}
function vf(e, t, r) {
    let n = e.type === 4 && !r ? cc : e.value
    return t === n
}
function Mf(e, t, r) {
    let n = 4,
        a = e.attrs,
        i = a !== null ? zf(a) : 0,
        o = !1
    for (let c = 0; c < t.length; c++) {
        let s = t[c]
        if (typeof s == 'number') {
            if (!o && !V2(n) && !V2(s)) return !1
            if (o && V2(s)) continue
            ;(o = !1), (n = s | (n & 1))
            continue
        }
        if (!o)
            if (n & 4) {
                if (
                    ((n = 2 | (n & 1)),
                    (s !== '' && !vf(e, s, r)) || (s === '' && t.length === 1))
                ) {
                    if (V2(n)) return !1
                    o = !0
                }
            } else if (n & 8) {
                if (a === null || !gf(e, a, s, r)) {
                    if (V2(n)) return !1
                    o = !0
                }
            } else {
                let l = t[++c],
                    f = Cf(s, a, Fr(e), r)
                if (f === -1) {
                    if (V2(n)) return !1
                    o = !0
                    continue
                }
                if (l !== '') {
                    let u
                    if (
                        (f > i ? (u = '') : (u = a[f + 1].toLowerCase()),
                        n & 2 && l !== u)
                    ) {
                        if (V2(n)) return !1
                        o = !0
                    }
                }
            }
    }
    return V2(n) || o
}
function V2(e) {
    return (e & 1) === 0
}
function Cf(e, t, r, n) {
    if (t === null) return -1
    let a = 0
    if (n || !r) {
        let i = !1
        for (; a < t.length; ) {
            let o = t[a]
            if (o === e) return a
            if (o === 3 || o === 6) i = !0
            else if (o === 1 || o === 2) {
                let c = t[++a]
                for (; typeof c == 'string'; ) c = t[++a]
                continue
            } else {
                if (o === 4) break
                if (o === 0) {
                    a += 4
                    continue
                }
            }
            a += i ? 1 : 2
        }
        return -1
    } else return Lf(t, e)
}
function sc(e, t, r = !1) {
    for (let n = 0; n < t.length; n++) if (Mf(e, t[n], r)) return !0
    return !1
}
function yf(e) {
    let t = e.attrs
    if (t != null) {
        let r = t.indexOf(5)
        if (!(r & 1)) return t[r + 1]
    }
    return null
}
function zf(e) {
    for (let t = 0; t < e.length; t++) {
        let r = e[t]
        if (hf(r)) return t
    }
    return e.length
}
function Lf(e, t) {
    let r = e.indexOf(4)
    if (r > -1)
        for (r++; r < e.length; ) {
            let n = e[r]
            if (typeof n == 'number') return -1
            if (n === t) return r
            r++
        }
    return -1
}
function wf(e, t) {
    e: for (let r = 0; r < t.length; r++) {
        let n = t[r]
        if (e.length === n.length) {
            for (let a = 0; a < e.length; a++) if (e[a] !== n[a]) continue e
            return !0
        }
    }
    return !1
}
function co(e, t) {
    return e ? ':not(' + t.trim() + ')' : t
}
function bf(e) {
    let t = e[0],
        r = 1,
        n = 2,
        a = '',
        i = !1
    for (; r < e.length; ) {
        let o = e[r]
        if (typeof o == 'string')
            if (n & 2) {
                let c = e[++r]
                a += '[' + o + (c.length > 0 ? '="' + c + '"' : '') + ']'
            } else n & 8 ? (a += '.' + o) : n & 4 && (a += ' ' + o)
        else
            a !== '' && !V2(o) && ((t += co(i, a)), (a = '')),
                (n = o),
                (i = i || !V2(n))
        r++
    }
    return a !== '' && (t += co(i, a)), t
}
function Sf(e) {
    return e.map(bf).join(',')
}
function xf(e) {
    let t = [],
        r = [],
        n = 1,
        a = 2
    for (; n < e.length; ) {
        let i = e[n]
        if (typeof i == 'string')
            a === 2 ? i !== '' && t.push(i, e[++n]) : a === 8 && r.push(i)
        else {
            if (!V2(a)) break
            a = i
        }
        n++
    }
    return { attrs: t, classes: r }
}
function e2(e) {
    return j4(() => {
        let t = hc(e),
            r = K(z({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === oc.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: (t.standalone && e.dependencies) || null,
                getStandaloneInjector: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || r1.Emulated,
                styles: e.styles || F2,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: '',
            })
        mc(r)
        let n = e.dependencies
        return (
            (r.directiveDefs = lo(n, !1)),
            (r.pipeDefs = lo(n, !0)),
            (r.id = Ef(r)),
            r
        )
    })
}
function Df(e) {
    return se(e) || fc(e)
}
function Nf(e) {
    return e !== null
}
function F1(e) {
    return j4(() => ({
        type: e.type,
        bootstrap: e.bootstrap || F2,
        declarations: e.declarations || F2,
        imports: e.imports || F2,
        exports: e.exports || F2,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null,
    }))
}
function so(e, t) {
    if (e == null) return D4
    let r = {}
    for (let n in e)
        if (e.hasOwnProperty(n)) {
            let a = e[n],
                i,
                o,
                c = R1.None
            Array.isArray(a)
                ? ((c = a[0]), (i = a[1]), (o = a[2] ?? i))
                : ((i = a), (o = a)),
                t
                    ? ((r[i] = c !== R1.None ? [n, c] : n), (t[i] = o))
                    : (r[i] = n)
        }
    return r
}
function he(e) {
    return j4(() => {
        let t = hc(e)
        return mc(t), t
    })
}
function lc(e) {
    return {
        type: e.type,
        name: e.name,
        factory: null,
        pure: e.pure !== !1,
        standalone: e.standalone === !0,
        onDestroy: e.type.prototype.ngOnDestroy || null,
    }
}
function se(e) {
    return e[G9] || null
}
function fc(e) {
    return e[Y9] || null
}
function uc(e) {
    return e[Q9] || null
}
function dc(e) {
    let t = se(e) || fc(e) || uc(e)
    return t !== null ? t.standalone : !1
}
function pc(e, t) {
    let r = e[Z9] || null
    if (!r && t === !0)
        throw new Error(`Type ${M2(e)} does not have '\u0275mod' property.`)
    return r
}
function hc(e) {
    let t = {}
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputTransforms: null,
        inputConfig: e.inputs || D4,
        exportAs: e.exportAs || null,
        standalone: e.standalone === !0,
        signals: e.signals === !0,
        selectors: e.selectors || F2,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: so(e.inputs, t),
        outputs: so(e.outputs),
        debugInfo: null,
    }
}
function mc(e) {
    e.features?.forEach(t => t(e))
}
function lo(e, t) {
    if (!e) return null
    let r = t ? uc : Df
    return () => (typeof e == 'function' ? e() : e).map(n => r(n)).filter(Nf)
}
function Ef(e) {
    let t = 0,
        r = [
            e.selectors,
            e.ngContentSelectors,
            e.hostVars,
            e.hostAttrs,
            e.consts,
            e.vars,
            e.decls,
            e.encapsulation,
            e.standalone,
            e.signals,
            e.exportAs,
            JSON.stringify(e.inputs),
            JSON.stringify(e.outputs),
            Object.getOwnPropertyNames(e.type.prototype),
            !!e.contentQueries,
            !!e.viewQuery,
        ].join('|')
    for (let a of r) t = (Math.imul(31, t) + a.charCodeAt(0)) << 0
    return (t += 2147483648), 'c' + t
}
function O1(e) {
    return { ɵproviders: e }
}
function If(...e) {
    return { ɵproviders: gc(!0, e), ɵfromNgModule: !0 }
}
function gc(e, ...t) {
    let r = [],
        n = new Set(),
        a,
        i = o => {
            r.push(o)
        }
    return (
        Pr(t, o => {
            let c = o
            Vn(c, i, [], n) && ((a ||= []), a.push(c))
        }),
        a !== void 0 && vc(a, i),
        r
    )
}
function vc(e, t) {
    for (let r = 0; r < e.length; r++) {
        let { ngModule: n, providers: a } = e[r]
        Or(a, i => {
            t(i, n)
        })
    }
}
function Vn(e, t, r, n) {
    if (((e = _2(e)), !e)) return !1
    let a = null,
        i = no(e),
        o = !i && se(e)
    if (!i && !o) {
        let s = e.ngModule
        if (((i = no(s)), i)) a = s
        else return !1
    } else {
        if (o && !o.standalone) return !1
        a = e
    }
    let c = n.has(a)
    if (o) {
        if (c) return !1
        if ((n.add(a), o.dependencies)) {
            let s =
                typeof o.dependencies == 'function'
                    ? o.dependencies()
                    : o.dependencies
            for (let l of s) Vn(l, t, r, n)
        }
    } else if (i) {
        if (i.imports != null && !c) {
            n.add(a)
            let l
            try {
                Pr(i.imports, f => {
                    Vn(f, t, r, n) && ((l ||= []), l.push(f))
                })
            } finally {
            }
            l !== void 0 && vc(l, t)
        }
        if (!c) {
            let l = oe(a) || (() => new a())
            t({ provide: a, useFactory: l, deps: F2 }, a),
                t({ provide: ic, useValue: a, multi: !0 }, a),
                t({ provide: ce, useValue: () => D(a), multi: !0 }, a)
        }
        let s = i.providers
        if (s != null && !c) {
            let l = e
            Or(s, f => {
                t(f, l)
            })
        }
    } else return !1
    return a !== e && e.providers !== void 0
}
function Or(e, t) {
    for (let r of e)
        Xo(r) && (r = r.ɵproviders), Array.isArray(r) ? Or(r, t) : t(r)
}
var Tf = $({ provide: String, useValue: $ })
function Mc(e) {
    return e !== null && typeof e == 'object' && Tf in e
}
function Af(e) {
    return !!(e && e.useExisting)
}
function kf(e) {
    return !!(e && e.useFactory)
}
function $n(e) {
    return typeof e == 'function'
}
var B0 = new b(''),
    f0 = {},
    Rf = {},
    bn
function Br() {
    return bn === void 0 && (bn = new M0()), bn
}
var L2 = class {},
    N4 = class extends L2 {
        get destroyed() {
            return this._destroyed
        }
        constructor(t, r, n, a) {
            super(),
                (this.parent = r),
                (this.source = n),
                (this.scopes = a),
                (this.records = new Map()),
                (this._ngOnDestroyHooks = new Set()),
                (this._onDestroyHooks = []),
                (this._destroyed = !1),
                qn(t, o => this.processProvider(o)),
                this.records.set(ac, $e(void 0, this)),
                a.has('environment') && this.records.set(L2, $e(void 0, this))
            let i = this.records.get(B0)
            i != null && typeof i.value == 'string' && this.scopes.add(i.value),
                (this.injectorDefTypes = new Set(this.get(ic, F2, k.Self)))
        }
        destroy() {
            this.assertNotDestroyed(), (this._destroyed = !0)
            let t = j(null)
            try {
                for (let n of this._ngOnDestroyHooks) n.ngOnDestroy()
                let r = this._onDestroyHooks
                this._onDestroyHooks = []
                for (let n of r) n()
            } finally {
                this.records.clear(),
                    this._ngOnDestroyHooks.clear(),
                    this.injectorDefTypes.clear(),
                    j(t)
            }
        }
        onDestroy(t) {
            return (
                this.assertNotDestroyed(),
                this._onDestroyHooks.push(t),
                () => this.removeOnDestroy(t)
            )
        }
        runInContext(t) {
            this.assertNotDestroyed()
            let r = A1(this),
                n = z2(void 0),
                a
            try {
                return t()
            } finally {
                A1(r), z2(n)
            }
        }
        get(t, r = x4, n = k.Default) {
            if ((this.assertNotDestroyed(), t.hasOwnProperty(ao)))
                return t[ao](this)
            n = O0(n)
            let a,
                i = A1(this),
                o = z2(void 0)
            try {
                if (!(n & k.SkipSelf)) {
                    let s = this.records.get(t)
                    if (s === void 0) {
                        let l = jf(t) && F0(t)
                        l && this.injectableDefInScope(l)
                            ? (s = $e(Wn(t), f0))
                            : (s = null),
                            this.records.set(t, s)
                    }
                    if (s != null) return this.hydrate(t, s)
                }
                let c = n & k.Self ? Br() : this.parent
                return (r = n & k.Optional && r === x4 ? null : r), c.get(t, r)
            } catch (c) {
                if (c.name === 'NullInjectorError') {
                    if (((c[g0] = c[g0] || []).unshift(M2(t)), i)) throw c
                    return cf(c, t, 'R3InjectorError', this.source)
                } else throw c
            } finally {
                z2(o), A1(i)
            }
        }
        resolveInjectorInitializers() {
            let t = j(null),
                r = A1(this),
                n = z2(void 0),
                a
            try {
                let i = this.get(ce, F2, k.Self)
                for (let o of i) o()
            } finally {
                A1(r), z2(n), j(t)
            }
        }
        toString() {
            let t = [],
                r = this.records
            for (let n of r.keys()) t.push(M2(n))
            return `R3Injector[${t.join(', ')}]`
        }
        assertNotDestroyed() {
            if (this._destroyed) throw new w(205, !1)
        }
        processProvider(t) {
            t = _2(t)
            let r = $n(t) ? t : _2(t && t.provide),
                n = _f(t)
            if (!$n(t) && t.multi === !0) {
                let a = this.records.get(r)
                a ||
                    ((a = $e(void 0, f0, !0)),
                    (a.factory = () => Un(a.multi)),
                    this.records.set(r, a)),
                    (r = t),
                    a.multi.push(t)
            }
            this.records.set(r, n)
        }
        hydrate(t, r) {
            let n = j(null)
            try {
                return (
                    r.value === f0 && ((r.value = Rf), (r.value = r.factory())),
                    typeof r.value == 'object' &&
                        r.value &&
                        Bf(r.value) &&
                        this._ngOnDestroyHooks.add(r.value),
                    r.value
                )
            } finally {
                j(n)
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn) return !1
            let r = _2(t.providedIn)
            return typeof r == 'string'
                ? r === 'any' || this.scopes.has(r)
                : this.injectorDefTypes.has(r)
        }
        removeOnDestroy(t) {
            let r = this._onDestroyHooks.indexOf(t)
            r !== -1 && this._onDestroyHooks.splice(r, 1)
        }
    }
function Wn(e) {
    let t = F0(e),
        r = t !== null ? t.factory : oe(e)
    if (r !== null) return r
    if (e instanceof b) throw new w(204, !1)
    if (e instanceof Function) return Pf(e)
    throw new w(204, !1)
}
function Pf(e) {
    if (e.length > 0) throw new w(204, !1)
    let r = W9(e)
    return r !== null ? () => r.factory(e) : () => new e()
}
function _f(e) {
    if (Mc(e)) return $e(void 0, e.useValue)
    {
        let t = Ff(e)
        return $e(t, f0)
    }
}
function Ff(e, t, r) {
    let n
    if ($n(e)) {
        let a = _2(e)
        return oe(a) || Wn(a)
    } else if (Mc(e)) n = () => _2(e.useValue)
    else if (kf(e)) n = () => e.useFactory(...Un(e.deps || []))
    else if (Af(e)) n = () => D(_2(e.useExisting))
    else {
        let a = _2(e && (e.useClass || e.provide))
        if (Of(e)) n = () => new a(...Un(e.deps))
        else return oe(a) || Wn(a)
    }
    return n
}
function $e(e, t, r = !1) {
    return { factory: e, value: t, multi: r ? [] : void 0 }
}
function Of(e) {
    return !!e.deps
}
function Bf(e) {
    return (
        e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
    )
}
function jf(e) {
    return typeof e == 'function' || (typeof e == 'object' && e instanceof b)
}
function qn(e, t) {
    for (let r of e)
        Array.isArray(r) ? qn(r, t) : r && Xo(r) ? qn(r.ɵproviders, t) : t(r)
}
function M1(e, t) {
    e instanceof N4 && e.assertNotDestroyed()
    let r,
        n = A1(e),
        a = z2(void 0)
    try {
        return t()
    } finally {
        A1(n), z2(a)
    }
}
function Uf() {
    return Jo() !== void 0 || rf() != null
}
function Hf(e) {
    return typeof e == 'function'
}
var E2 = 0,
    R = 1,
    x = 2,
    f2 = 3,
    W2 = 4,
    T2 = 5,
    O2 = 6,
    E4 = 7,
    q2 = 8,
    Qe = 9,
    G2 = 10,
    q = 11,
    I4 = 12,
    fo = 13,
    Xe = 14,
    I2 = 15,
    j0 = 16,
    We = 17,
    Ze = 18,
    U0 = 19,
    Cc = 20,
    k1 = 21,
    Sn = 22,
    le = 23,
    u2 = 25,
    yc = 1,
    T4 = 6,
    p1 = 7,
    C0 = 8,
    y0 = 9,
    N2 = 10,
    jr = (function (e) {
        return (
            (e[(e.None = 0)] = 'None'),
            (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
            e
        )
    })(jr || {})
function d1(e) {
    return Array.isArray(e) && typeof e[yc] == 'object'
}
function a1(e) {
    return Array.isArray(e) && e[yc] === !0
}
function zc(e) {
    return (e.flags & 4) !== 0
}
function H4(e) {
    return e.componentOffset > -1
}
function Ur(e) {
    return (e.flags & 1) === 1
}
function V4(e) {
    return !!e.template
}
function Lc(e) {
    return (e[x] & 512) !== 0
}
var Gn = class {
    constructor(t, r, n) {
        ;(this.previousValue = t),
            (this.currentValue = r),
            (this.firstChange = n)
    }
    isFirstChange() {
        return this.firstChange
    }
}
function wc(e, t, r, n) {
    t !== null ? t.applyValueToInputSignal(t, n) : (e[r] = n)
}
function B1() {
    return bc
}
function bc(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = $f), Vf
}
B1.ngInherit = !0
function Vf() {
    let e = xc(this),
        t = e?.current
    if (t) {
        let r = e.previous
        if (r === D4) e.previous = t
        else for (let n in t) r[n] = t[n]
        ;(e.current = null), this.ngOnChanges(t)
    }
}
function $f(e, t, r, n, a) {
    let i = this.declaredInputs[n],
        o = xc(e) || Wf(e, { previous: D4, current: null }),
        c = o.current || (o.current = {}),
        s = o.previous,
        l = s[i]
    ;(c[i] = new Gn(l && l.currentValue, r, s === D4)), wc(e, t, a, r)
}
var Sc = '__ngSimpleChanges__'
function xc(e) {
    return e[Sc] || null
}
function Wf(e, t) {
    return (e[Sc] = t)
}
var uo = null
var t1 = function (e, t, r) {
        uo?.(e, t, r)
    },
    qf = 'svg',
    Gf = 'math',
    Yf = !1
function Qf() {
    return Yf
}
function Y2(e) {
    for (; Array.isArray(e); ) e = e[E2]
    return e
}
function Dc(e, t) {
    return Y2(t[e])
}
function A2(e, t) {
    return Y2(t[e.index])
}
function Nc(e, t) {
    return e.data[t]
}
function Ec(e, t) {
    return e[t]
}
function j1(e, t) {
    let r = t[e]
    return d1(r) ? r : r[E2]
}
function Hr(e) {
    return (e[x] & 128) === 128
}
function Zf(e) {
    return a1(e[f2])
}
function z0(e, t) {
    return t == null ? null : e[t]
}
function Ic(e) {
    e[We] = 0
}
function Kf(e) {
    e[x] & 1024 || ((e[x] |= 1024), Hr(e) && A4(e))
}
function Xf(e, t) {
    for (; e > 0; ) (t = t[Xe]), e--
    return t
}
function Vr(e) {
    return !!(e[x] & 9216 || e[le]?.dirty)
}
function Yn(e) {
    e[G2].changeDetectionScheduler?.notify(1),
        Vr(e)
            ? A4(e)
            : e[x] & 64 &&
              (Qf()
                  ? ((e[x] |= 1024), A4(e))
                  : e[G2].changeDetectionScheduler?.notify())
}
function A4(e) {
    e[G2].changeDetectionScheduler?.notify()
    let t = k4(e)
    for (; t !== null && !(t[x] & 8192 || ((t[x] |= 8192), !Hr(t))); ) t = k4(t)
}
function Tc(e, t) {
    if ((e[x] & 256) === 256) throw new w(911, !1)
    e[k1] === null && (e[k1] = []), e[k1].push(t)
}
function Jf(e, t) {
    if (e[k1] === null) return
    let r = e[k1].indexOf(t)
    r !== -1 && e[k1].splice(r, 1)
}
function k4(e) {
    let t = e[f2]
    return a1(t) ? t[f2] : t
}
var T = { lFrame: Hc(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function eu() {
    return T.lFrame.elementDepthCount
}
function tu() {
    T.lFrame.elementDepthCount++
}
function nu() {
    T.lFrame.elementDepthCount--
}
function Ac() {
    return T.bindingsEnabled
}
function Je() {
    return T.skipHydrationRootTNode !== null
}
function ru(e) {
    return T.skipHydrationRootTNode === e
}
function au(e) {
    T.skipHydrationRootTNode = e
}
function iu() {
    T.skipHydrationRootTNode = null
}
function V() {
    return T.lFrame.lView
}
function B2() {
    return T.lFrame.tView
}
function kc(e) {
    return (T.lFrame.contextLView = e), e[q2]
}
function Rc(e) {
    return (T.lFrame.contextLView = null), e
}
function Q2() {
    let e = Pc()
    for (; e !== null && e.type === 64; ) e = e.parent
    return e
}
function Pc() {
    return T.lFrame.currentTNode
}
function ou() {
    let e = T.lFrame,
        t = e.currentTNode
    return e.isParent ? t : t.parent
}
function $4(e, t) {
    let r = T.lFrame
    ;(r.currentTNode = e), (r.isParent = t)
}
function _c() {
    return T.lFrame.isParent
}
function Fc() {
    T.lFrame.isParent = !1
}
function cu() {
    return T.lFrame.contextLView
}
function su() {
    let e = T.lFrame,
        t = e.bindingRootIndex
    return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t
}
function lu() {
    return T.lFrame.bindingIndex
}
function fu(e) {
    return (T.lFrame.bindingIndex = e)
}
function H0() {
    return T.lFrame.bindingIndex++
}
function Oc(e) {
    let t = T.lFrame,
        r = t.bindingIndex
    return (t.bindingIndex = t.bindingIndex + e), r
}
function uu() {
    return T.lFrame.inI18n
}
function du(e, t) {
    let r = T.lFrame
    ;(r.bindingIndex = r.bindingRootIndex = e), Qn(t)
}
function pu() {
    return T.lFrame.currentDirectiveIndex
}
function Qn(e) {
    T.lFrame.currentDirectiveIndex = e
}
function hu(e) {
    let t = T.lFrame.currentDirectiveIndex
    return t === -1 ? null : e[t]
}
function Bc(e) {
    T.lFrame.currentQueryIndex = e
}
function mu(e) {
    let t = e[R]
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[T2] : null
}
function jc(e, t, r) {
    if (r & k.SkipSelf) {
        let a = t,
            i = e
        for (; (a = a.parent), a === null && !(r & k.Host); )
            if (((a = mu(i)), a === null || ((i = i[Xe]), a.type & 10))) break
        if (a === null) return !1
        ;(t = a), (e = i)
    }
    let n = (T.lFrame = Uc())
    return (n.currentTNode = t), (n.lView = e), !0
}
function $r(e) {
    let t = Uc(),
        r = e[R]
    ;(T.lFrame = t),
        (t.currentTNode = r.firstChild),
        (t.lView = e),
        (t.tView = r),
        (t.contextLView = e),
        (t.bindingIndex = r.bindingStartIndex),
        (t.inI18n = !1)
}
function Uc() {
    let e = T.lFrame,
        t = e === null ? null : e.child
    return t === null ? Hc(e) : t
}
function Hc(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1,
    }
    return e !== null && (e.child = t), t
}
function Vc() {
    let e = T.lFrame
    return (T.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
}
var $c = Vc
function Wr() {
    let e = Vc()
    ;(e.isParent = !0),
        (e.tView = null),
        (e.selectedIndex = -1),
        (e.contextLView = null),
        (e.elementDepthCount = 0),
        (e.currentDirectiveIndex = -1),
        (e.currentNamespace = null),
        (e.bindingRootIndex = -1),
        (e.bindingIndex = -1),
        (e.currentQueryIndex = 0)
}
function gu(e) {
    return (T.lFrame.contextLView = Xf(e, T.lFrame.contextLView))[q2]
}
function me() {
    return T.lFrame.selectedIndex
}
function fe(e) {
    T.lFrame.selectedIndex = e
}
function qr() {
    let e = T.lFrame
    return Nc(e.tView, e.selectedIndex)
}
function Wc() {
    return T.lFrame.currentNamespace
}
var qc = !0
function Gr() {
    return qc
}
function i1(e) {
    qc = e
}
function vu(e, t, r) {
    let { ngOnChanges: n, ngOnInit: a, ngDoCheck: i } = t.type.prototype
    if (n) {
        let o = bc(t)
        ;(r.preOrderHooks ??= []).push(e, o),
            (r.preOrderCheckHooks ??= []).push(e, o)
    }
    a && (r.preOrderHooks ??= []).push(0 - e, a),
        i &&
            ((r.preOrderHooks ??= []).push(e, i),
            (r.preOrderCheckHooks ??= []).push(e, i))
}
function Yr(e, t) {
    for (let r = t.directiveStart, n = t.directiveEnd; r < n; r++) {
        let i = e.data[r].type.prototype,
            {
                ngAfterContentInit: o,
                ngAfterContentChecked: c,
                ngAfterViewInit: s,
                ngAfterViewChecked: l,
                ngOnDestroy: f,
            } = i
        o && (e.contentHooks ??= []).push(-r, o),
            c &&
                ((e.contentHooks ??= []).push(r, c),
                (e.contentCheckHooks ??= []).push(r, c)),
            s && (e.viewHooks ??= []).push(-r, s),
            l &&
                ((e.viewHooks ??= []).push(r, l),
                (e.viewCheckHooks ??= []).push(r, l)),
            f != null && (e.destroyHooks ??= []).push(r, f)
    }
}
function u0(e, t, r) {
    Gc(e, t, 3, r)
}
function d0(e, t, r, n) {
    ;(e[x] & 3) === r && Gc(e, t, r, n)
}
function xn(e, t) {
    let r = e[x]
    ;(r & 3) === t && ((r &= 16383), (r += 1), (e[x] = r))
}
function Gc(e, t, r, n) {
    let a = n !== void 0 ? e[We] & 65535 : 0,
        i = n ?? -1,
        o = t.length - 1,
        c = 0
    for (let s = a; s < o; s++)
        if (typeof t[s + 1] == 'number') {
            if (((c = t[s]), n != null && c >= n)) break
        } else
            t[s] < 0 && (e[We] += 65536),
                (c < i || i == -1) &&
                    (Mu(e, r, t, s), (e[We] = (e[We] & 4294901760) + s + 2)),
                s++
}
function po(e, t) {
    t1(4, e, t)
    let r = j(null)
    try {
        t.call(e)
    } finally {
        j(r), t1(5, e, t)
    }
}
function Mu(e, t, r, n) {
    let a = r[n] < 0,
        i = r[n + 1],
        o = a ? -r[n] : r[n],
        c = e[o]
    a
        ? e[x] >> 14 < e[We] >> 16 &&
          (e[x] & 3) === t &&
          ((e[x] += 16384), po(c, i))
        : po(c, i)
}
var Ye = -1,
    R4 = class {
        constructor(t, r, n) {
            ;(this.factory = t),
                (this.resolving = !1),
                (this.canSeeViewProviders = r),
                (this.injectImpl = n)
        }
    }
function Cu(e) {
    return e instanceof R4
}
function yu(e) {
    return (e.flags & 8) !== 0
}
function zu(e) {
    return (e.flags & 16) !== 0
}
function Yc(e) {
    return e !== Ye
}
function L0(e) {
    return e & 32767
}
function Lu(e) {
    return e >> 16
}
function w0(e, t) {
    let r = Lu(e),
        n = t
    for (; r > 0; ) (n = n[Xe]), r--
    return n
}
var Zn = !0
function b0(e) {
    let t = Zn
    return (Zn = e), t
}
var wu = 256,
    Qc = wu - 1,
    Zc = 5,
    bu = 0,
    n1 = {}
function Su(e, t, r) {
    let n
    typeof r == 'string'
        ? (n = r.charCodeAt(0) || 0)
        : r.hasOwnProperty(S4) && (n = r[S4]),
        n == null && (n = r[S4] = bu++)
    let a = n & Qc,
        i = 1 << a
    t.data[e + (a >> Zc)] |= i
}
function Kc(e, t) {
    let r = Xc(e, t)
    if (r !== -1) return r
    let n = t[R]
    n.firstCreatePass &&
        ((e.injectorIndex = t.length),
        Dn(n.data, e),
        Dn(t, null),
        Dn(n.blueprint, null))
    let a = Qr(e, t),
        i = e.injectorIndex
    if (Yc(a)) {
        let o = L0(a),
            c = w0(a, t),
            s = c[R].data
        for (let l = 0; l < 8; l++) t[i + l] = c[o + l] | s[o + l]
    }
    return (t[i + 8] = a), i
}
function Dn(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function Xc(e, t) {
    return e.injectorIndex === -1 ||
        (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
        t[e.injectorIndex + 8] === null
        ? -1
        : e.injectorIndex
}
function Qr(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex
    let r = 0,
        n = null,
        a = t
    for (; a !== null; ) {
        if (((n = rs(a)), n === null)) return Ye
        if ((r++, (a = a[Xe]), n.injectorIndex !== -1))
            return n.injectorIndex | (r << 16)
    }
    return Ye
}
function xu(e, t, r) {
    Su(e, t, r)
}
function Jc(e, t, r) {
    if (r & k.Optional || e !== void 0) return e
    kr(t, 'NodeInjector')
}
function es(e, t, r, n) {
    if (
        (r & k.Optional && n === void 0 && (n = null), !(r & (k.Self | k.Host)))
    ) {
        let a = e[Qe],
            i = z2(void 0)
        try {
            return a ? a.get(t, n, r & k.Optional) : ec(t, n, r & k.Optional)
        } finally {
            z2(i)
        }
    }
    return Jc(n, t, r)
}
function ts(e, t, r, n = k.Default, a) {
    if (e !== null) {
        if (t[x] & 2048 && !(n & k.Self)) {
            let o = Tu(e, t, r, n, n1)
            if (o !== n1) return o
        }
        let i = ns(e, t, r, n, n1)
        if (i !== n1) return i
    }
    return es(t, r, n, a)
}
function ns(e, t, r, n, a) {
    let i = Eu(r)
    if (typeof i == 'function') {
        if (!jc(t, e, n)) return n & k.Host ? Jc(a, r, n) : es(t, r, n, a)
        try {
            let o
            if (((o = i(n)), o == null && !(n & k.Optional))) kr(r)
            else return o
        } finally {
            $c()
        }
    } else if (typeof i == 'number') {
        let o = null,
            c = Xc(e, t),
            s = Ye,
            l = n & k.Host ? t[I2][T2] : null
        for (
            (c === -1 || n & k.SkipSelf) &&
            ((s = c === -1 ? Qr(e, t) : t[c + 8]),
            s === Ye || !mo(n, !1)
                ? (c = -1)
                : ((o = t[R]), (c = L0(s)), (t = w0(s, t))));
            c !== -1;

        ) {
            let f = t[R]
            if (ho(i, c, f.data)) {
                let u = Du(c, t, r, o, n, l)
                if (u !== n1) return u
            }
            ;(s = t[c + 8]),
                s !== Ye && mo(n, t[R].data[c + 8] === l) && ho(i, c, t)
                    ? ((o = f), (c = L0(s)), (t = w0(s, t)))
                    : (c = -1)
        }
    }
    return a
}
function Du(e, t, r, n, a, i) {
    let o = t[R],
        c = o.data[e + 8],
        s = n == null ? H4(c) && Zn : n != o && (c.type & 3) !== 0,
        l = a & k.Host && i === c,
        f = Nu(c, o, r, s, l)
    return f !== null ? P4(t, o, f, c) : n1
}
function Nu(e, t, r, n, a) {
    let i = e.providerIndexes,
        o = t.data,
        c = i & 1048575,
        s = e.directiveStart,
        l = e.directiveEnd,
        f = i >> 20,
        u = n ? c : c + f,
        d = a ? c + f : l
    for (let p = u; p < d; p++) {
        let m = o[p]
        if ((p < s && r === m) || (p >= s && m.type === r)) return p
    }
    if (a) {
        let p = o[s]
        if (p && V4(p) && p.type === r) return s
    }
    return null
}
function P4(e, t, r, n) {
    let a = e[r],
        i = t.data
    if (Cu(a)) {
        let o = a
        o.resolving && X9(K9(i[r]))
        let c = b0(o.canSeeViewProviders)
        o.resolving = !0
        let s,
            l = o.injectImpl ? z2(o.injectImpl) : null,
            f = jc(e, n, k.Default)
        try {
            ;(a = e[r] = o.factory(void 0, i, e, n)),
                t.firstCreatePass && r >= n.directiveStart && vu(r, i[r], t)
        } finally {
            l !== null && z2(l), b0(c), (o.resolving = !1), $c()
        }
    }
    return a
}
function Eu(e) {
    if (typeof e == 'string') return e.charCodeAt(0) || 0
    let t = e.hasOwnProperty(S4) ? e[S4] : void 0
    return typeof t == 'number' ? (t >= 0 ? t & Qc : Iu) : t
}
function ho(e, t, r) {
    let n = 1 << e
    return !!(r[t + (e >> Zc)] & n)
}
function mo(e, t) {
    return !(e & k.Self) && !(e & k.Host && t)
}
var ie = class {
    constructor(t, r) {
        ;(this._tNode = t), (this._lView = r)
    }
    get(t, r, n) {
        return ts(this._tNode, this._lView, t, O0(n), r)
    }
}
function Iu() {
    return new ie(Q2(), V())
}
function V0(e) {
    return j4(() => {
        let t = e.prototype.constructor,
            r = t[m0] || Kn(t),
            n = Object.prototype,
            a = Object.getPrototypeOf(e.prototype).constructor
        for (; a && a !== n; ) {
            let i = a[m0] || Kn(a)
            if (i && i !== r) return i
            a = Object.getPrototypeOf(a)
        }
        return i => new i()
    })
}
function Kn(e) {
    return Yo(e)
        ? () => {
              let t = Kn(_2(e))
              return t && t()
          }
        : oe(e)
}
function Tu(e, t, r, n, a) {
    let i = e,
        o = t
    for (; i !== null && o !== null && o[x] & 2048 && !(o[x] & 512); ) {
        let c = ns(i, o, r, n | k.Self, n1)
        if (c !== n1) return c
        let s = i.parent
        if (!s) {
            let l = o[Cc]
            if (l) {
                let f = l.get(r, n1, n)
                if (f !== n1) return f
            }
            ;(s = rs(o)), (o = o[Xe])
        }
        i = s
    }
    return a
}
function rs(e) {
    let t = e[R],
        r = t.type
    return r === 2 ? t.declTNode : r === 1 ? e[T2] : null
}
function go(e, t = null, r = null, n) {
    let a = as(e, t, r, n)
    return a.resolveInjectorInitializers(), a
}
function as(e, t = null, r = null, n, a = new Set()) {
    let i = [r || F2, If(e)]
    return (
        (n = n || (typeof e == 'object' ? void 0 : M2(e))),
        new N4(i, t || Br(), n || null, a)
    )
}
var ge = (() => {
    let t = class t {
        static create(n, a) {
            if (Array.isArray(n)) return go({ name: '' }, a, n, '')
            {
                let i = n.name ?? ''
                return go({ name: i }, n.parent, n.providers, i)
            }
        }
    }
    ;(t.THROW_IF_NOT_FOUND = x4),
        (t.NULL = new M0()),
        (t.ɵprov = y({ token: t, providedIn: 'any', factory: () => D(ac) })),
        (t.__NG_ELEMENT_ID__ = -1)
    let e = t
    return e
})()
var Au = 'ngOriginalError'
function Nn(e) {
    return e[Au]
}
var h1 = class {
        constructor() {
            this._console = console
        }
        handleError(t) {
            let r = this._findOriginalError(t)
            this._console.error('ERROR', t),
                r && this._console.error('ORIGINAL ERROR', r)
        }
        _findOriginalError(t) {
            let r = t && Nn(t)
            for (; r && Nn(r); ) r = Nn(r)
            return r || null
        }
    },
    is = new b('', {
        providedIn: 'root',
        factory: () => g(h1).handleError.bind(void 0),
    }),
    os = (() => {
        let t = class t {}
        ;(t.__NG_ELEMENT_ID__ = ku), (t.__NG_ENV_ID__ = n => n)
        let e = t
        return e
    })(),
    Xn = class extends os {
        constructor(t) {
            super(), (this._lView = t)
        }
        onDestroy(t) {
            return Tc(this._lView, t), () => Jf(this._lView, t)
        }
    }
function ku() {
    return new Xn(V())
}
function Ru() {
    return $0(Q2(), V())
}
function $0(e, t) {
    return new e4(A2(e, t))
}
var e4 = (() => {
    let t = class t {
        constructor(n) {
            this.nativeElement = n
        }
    }
    t.__NG_ELEMENT_ID__ = Ru
    let e = t
    return e
})()
var Jn = class extends v2 {
    constructor(t = !1) {
        super(),
            (this.destroyRef = void 0),
            (this.__isAsync = t),
            Uf() && (this.destroyRef = g(os, { optional: !0 }) ?? void 0)
    }
    emit(t) {
        let r = j(null)
        try {
            super.next(t)
        } finally {
            j(r)
        }
    }
    subscribe(t, r, n) {
        let a = t,
            i = r || (() => null),
            o = n
        if (t && typeof t == 'object') {
            let s = t
            ;(a = s.next?.bind(s)),
                (i = s.error?.bind(s)),
                (o = s.complete?.bind(s))
        }
        this.__isAsync && ((i = En(i)), a && (a = En(a)), o && (o = En(o)))
        let c = super.subscribe({ next: a, error: i, complete: o })
        return t instanceof n2 && t.add(c), c
    }
}
function En(e) {
    return t => {
        setTimeout(e, void 0, t)
    }
}
var $2 = Jn
var Pu = 'ngSkipHydration',
    _u = 'ngskiphydration'
function cs(e) {
    let t = e.mergedAttrs
    if (t === null) return !1
    for (let r = 0; r < t.length; r += 2) {
        let n = t[r]
        if (typeof n == 'number') return !1
        if (typeof n == 'string' && n.toLowerCase() === _u) return !0
    }
    return !1
}
function ss(e) {
    return e.hasAttribute(Pu)
}
function S0(e) {
    return (e.flags & 128) === 128
}
function Fu(e) {
    if (S0(e)) return !0
    let t = e.parent
    for (; t; ) {
        if (S0(e) || cs(t)) return !0
        t = t.parent
    }
    return !1
}
var ls = new Map(),
    Ou = 0
function Bu() {
    return Ou++
}
function ju(e) {
    ls.set(e[U0], e)
}
function Uu(e) {
    ls.delete(e[U0])
}
var vo = '__ngContext__'
function ue(e, t) {
    d1(t) ? ((e[vo] = t[U0]), ju(t)) : (e[vo] = t)
}
function fs(e) {
    return ds(e[I4])
}
function us(e) {
    return ds(e[W2])
}
function ds(e) {
    for (; e !== null && !a1(e); ) e = e[W2]
    return e
}
var er
function ps(e) {
    er = e
}
function W4() {
    if (er !== void 0) return er
    if (typeof document < 'u') return document
    throw new w(210, !1)
}
var W0 = new b('', { providedIn: 'root', factory: () => Hu }),
    Hu = 'ng',
    Zr = new b(''),
    Z2 = new b('', { providedIn: 'platform', factory: () => 'unknown' })
var Kr = new b('', {
    providedIn: 'root',
    factory: () =>
        W4().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
        null,
})
function Vu() {
    let e = new ve()
    return g(Z2) === 'browser' && (e.store = $u(W4(), g(W0))), e
}
var ve = (() => {
    let t = class t {
        constructor() {
            ;(this.store = {}), (this.onSerializeCallbacks = {})
        }
        get(n, a) {
            return this.store[n] !== void 0 ? this.store[n] : a
        }
        set(n, a) {
            this.store[n] = a
        }
        remove(n) {
            delete this.store[n]
        }
        hasKey(n) {
            return this.store.hasOwnProperty(n)
        }
        get isEmpty() {
            return Object.keys(this.store).length === 0
        }
        onSerialize(n, a) {
            this.onSerializeCallbacks[n] = a
        }
        toJson() {
            for (let n in this.onSerializeCallbacks)
                if (this.onSerializeCallbacks.hasOwnProperty(n))
                    try {
                        this.store[n] = this.onSerializeCallbacks[n]()
                    } catch (a) {
                        console.warn('Exception in onSerialize callback: ', a)
                    }
            return JSON.stringify(this.store).replace(/</g, '\\u003C')
        }
    }
    t.ɵprov = y({ token: t, providedIn: 'root', factory: Vu })
    let e = t
    return e
})()
function $u(e, t) {
    let r = e.getElementById(t + '-state')
    if (r?.textContent)
        try {
            return JSON.parse(r.textContent)
        } catch (n) {
            console.warn(
                'Exception while restoring TransferState for app ' + t,
                n
            )
        }
    return {}
}
var hs = 'h',
    ms = 'b',
    tr = (function (e) {
        return (e.FirstChild = 'f'), (e.NextSibling = 'n'), e
    })(tr || {}),
    Wu = 'e',
    qu = 't',
    Xr = 'c',
    gs = 'x',
    x0 = 'r',
    Gu = 'i',
    Yu = 'n',
    Qu = 'd',
    Zu = '__nghData__',
    vs = Zu,
    In = 'ngh',
    Ku = 'nghm',
    Ms = () => null
function Xu(e, t, r = !1) {
    let n = e.getAttribute(In)
    if (n == null) return null
    let [a, i] = n.split('|')
    if (((n = r ? i : a), !n)) return null
    let o = i ? `|${i}` : '',
        c = r ? a : o,
        s = {}
    if (n !== '') {
        let f = t.get(ve, null, { optional: !0 })
        f !== null && (s = f.get(vs, [])[Number(n)])
    }
    let l = { data: s, firstChild: e.firstChild ?? null }
    return (
        r && ((l.firstChild = e), q0(l, 0, e.nextSibling)),
        c ? e.setAttribute(In, c) : e.removeAttribute(In),
        l
    )
}
function Ju() {
    Ms = Xu
}
function Jr(e, t, r = !1) {
    return Ms(e, t, r)
}
function ed(e) {
    let t = e._lView
    return t[R].type === 2 ? null : (Lc(t) && (t = t[u2]), t)
}
function td(e) {
    return e.textContent?.replace(/\s/gm, '')
}
function nd(e) {
    let t = W4(),
        r = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
            acceptNode(i) {
                let o = td(i)
                return o === 'ngetn' || o === 'ngtns'
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT
            },
        }),
        n,
        a = []
    for (; (n = r.nextNode()); ) a.push(n)
    for (let i of a)
        i.textContent === 'ngetn'
            ? i.replaceWith(t.createTextNode(''))
            : i.remove()
}
function q0(e, t, r) {
    ;(e.segmentHeads ??= {}), (e.segmentHeads[t] = r)
}
function nr(e, t) {
    return e.segmentHeads?.[t] ?? null
}
function rd(e, t) {
    let r = e.data,
        n = r[Wu]?.[t] ?? null
    return n === null && r[Xr]?.[t] && (n = e6(e, t)), n
}
function Cs(e, t) {
    return e.data[Xr]?.[t] ?? null
}
function e6(e, t) {
    let r = Cs(e, t) ?? [],
        n = 0
    for (let a of r) n += a[x0] * (a[gs] ?? 1)
    return n
}
function G0(e, t) {
    if (typeof e.disconnectedNodes > 'u') {
        let r = e.data[Qu]
        e.disconnectedNodes = r ? new Set(r) : null
    }
    return !!e.disconnectedNodes?.has(t)
}
var r0 = new b(''),
    ys = !1,
    zs = new b('', { providedIn: 'root', factory: () => ys }),
    ad = new b(''),
    a0
function id() {
    if (a0 === void 0 && ((a0 = null), D2.trustedTypes))
        try {
            a0 = D2.trustedTypes.createPolicy('angular', {
                createHTML: e => e,
                createScript: e => e,
                createScriptURL: e => e,
            })
        } catch {}
    return a0
}
function Y0(e) {
    return id()?.createHTML(e) || e
}
var i0
function od() {
    if (i0 === void 0 && ((i0 = null), D2.trustedTypes))
        try {
            i0 = D2.trustedTypes.createPolicy('angular#unsafe-bypass', {
                createHTML: e => e,
                createScript: e => e,
                createScriptURL: e => e,
            })
        } catch {}
    return i0
}
function Mo(e) {
    return od()?.createHTML(e) || e
}
var m1 = class {
        constructor(t) {
            this.changingThisBreaksApplicationSecurity = t
        }
        toString() {
            return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Wo})`
        }
    },
    rr = class extends m1 {
        getTypeName() {
            return 'HTML'
        }
    },
    ar = class extends m1 {
        getTypeName() {
            return 'Style'
        }
    },
    ir = class extends m1 {
        getTypeName() {
            return 'Script'
        }
    },
    or = class extends m1 {
        getTypeName() {
            return 'URL'
        }
    },
    cr = class extends m1 {
        getTypeName() {
            return 'ResourceURL'
        }
    }
function C1(e) {
    return e instanceof m1 ? e.changingThisBreaksApplicationSecurity : e
}
function Me(e, t) {
    let r = cd(e)
    if (r != null && r !== t) {
        if (r === 'ResourceURL' && t === 'URL') return !0
        throw new Error(`Required a safe ${t}, got a ${r} (see ${Wo})`)
    }
    return r === t
}
function cd(e) {
    return (e instanceof m1 && e.getTypeName()) || null
}
function Ls(e) {
    return new rr(e)
}
function ws(e) {
    return new ar(e)
}
function bs(e) {
    return new ir(e)
}
function Ss(e) {
    return new or(e)
}
function xs(e) {
    return new cr(e)
}
function sd(e) {
    let t = new lr(e)
    return ld() ? new sr(t) : t
}
var sr = class {
        constructor(t) {
            this.inertDocumentHelper = t
        }
        getInertBodyElement(t) {
            t = '<body><remove></remove>' + t
            try {
                let r = new window.DOMParser().parseFromString(
                    Y0(t),
                    'text/html'
                ).body
                return r === null
                    ? this.inertDocumentHelper.getInertBodyElement(t)
                    : (r.removeChild(r.firstChild), r)
            } catch {
                return null
            }
        }
    },
    lr = class {
        constructor(t) {
            ;(this.defaultDoc = t),
                (this.inertDocument =
                    this.defaultDoc.implementation.createHTMLDocument(
                        'sanitization-inert'
                    ))
        }
        getInertBodyElement(t) {
            let r = this.inertDocument.createElement('template')
            return (r.innerHTML = Y0(t)), r
        }
    }
function ld() {
    try {
        return !!new window.DOMParser().parseFromString(Y0(''), 'text/html')
    } catch {
        return !1
    }
}
var fd = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i
function t6(e) {
    return (e = String(e)), e.match(fd) ? e : 'unsafe:' + e
}
function y1(e) {
    let t = {}
    for (let r of e.split(',')) t[r] = !0
    return t
}
function q4(...e) {
    let t = {}
    for (let r of e) for (let n in r) r.hasOwnProperty(n) && (t[n] = !0)
    return t
}
var Ds = y1('area,br,col,hr,img,wbr'),
    Ns = y1('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'),
    Es = y1('rp,rt'),
    ud = q4(Es, Ns),
    dd = q4(
        Ns,
        y1(
            'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'
        )
    ),
    pd = q4(
        Es,
        y1(
            'a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'
        )
    ),
    Co = q4(Ds, dd, pd, ud),
    Is = y1('background,cite,href,itemtype,longdesc,poster,src,xlink:href'),
    hd = y1(
        'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width'
    ),
    md = y1(
        'aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext'
    ),
    gd = q4(Is, hd, md),
    vd = y1('script,style,template'),
    fr = class {
        constructor() {
            ;(this.sanitizedSomething = !1), (this.buf = [])
        }
        sanitizeChildren(t) {
            let r = t.firstChild,
                n = !0,
                a = []
            for (; r; ) {
                if (
                    (r.nodeType === Node.ELEMENT_NODE
                        ? (n = this.startElement(r))
                        : r.nodeType === Node.TEXT_NODE
                        ? this.chars(r.nodeValue)
                        : (this.sanitizedSomething = !0),
                    n && r.firstChild)
                ) {
                    a.push(r), (r = yd(r))
                    continue
                }
                for (; r; ) {
                    r.nodeType === Node.ELEMENT_NODE && this.endElement(r)
                    let i = Cd(r)
                    if (i) {
                        r = i
                        break
                    }
                    r = a.pop()
                }
            }
            return this.buf.join('')
        }
        startElement(t) {
            let r = yo(t).toLowerCase()
            if (!Co.hasOwnProperty(r))
                return (this.sanitizedSomething = !0), !vd.hasOwnProperty(r)
            this.buf.push('<'), this.buf.push(r)
            let n = t.attributes
            for (let a = 0; a < n.length; a++) {
                let i = n.item(a),
                    o = i.name,
                    c = o.toLowerCase()
                if (!gd.hasOwnProperty(c)) {
                    this.sanitizedSomething = !0
                    continue
                }
                let s = i.value
                Is[c] && (s = t6(s)), this.buf.push(' ', o, '="', zo(s), '"')
            }
            return this.buf.push('>'), !0
        }
        endElement(t) {
            let r = yo(t).toLowerCase()
            Co.hasOwnProperty(r) &&
                !Ds.hasOwnProperty(r) &&
                (this.buf.push('</'), this.buf.push(r), this.buf.push('>'))
        }
        chars(t) {
            this.buf.push(zo(t))
        }
    }
function Md(e, t) {
    return (
        (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
        Node.DOCUMENT_POSITION_CONTAINED_BY
    )
}
function Cd(e) {
    let t = e.nextSibling
    if (t && e !== t.previousSibling) throw Ts(t)
    return t
}
function yd(e) {
    let t = e.firstChild
    if (t && Md(e, t)) throw Ts(t)
    return t
}
function yo(e) {
    let t = e.nodeName
    return typeof t == 'string' ? t : 'FORM'
}
function Ts(e) {
    return new Error(
        `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
    )
}
var zd = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
    Ld = /([^\#-~ |!])/g
function zo(e) {
    return e
        .replace(/&/g, '&amp;')
        .replace(zd, function (t) {
            let r = t.charCodeAt(0),
                n = t.charCodeAt(1)
            return '&#' + ((r - 55296) * 1024 + (n - 56320) + 65536) + ';'
        })
        .replace(Ld, function (t) {
            return '&#' + t.charCodeAt(0) + ';'
        })
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
var o0
function n6(e, t) {
    let r = null
    try {
        o0 = o0 || sd(e)
        let n = t ? String(t) : ''
        r = o0.getInertBodyElement(n)
        let a = 5,
            i = n
        do {
            if (a === 0)
                throw new Error(
                    'Failed to sanitize html because the input is unstable'
                )
            a--, (n = i), (i = r.innerHTML), (r = o0.getInertBodyElement(n))
        } while (n !== i)
        let c = new fr().sanitizeChildren(Lo(r) || r)
        return Y0(c)
    } finally {
        if (r) {
            let n = Lo(r) || r
            for (; n.firstChild; ) n.removeChild(n.firstChild)
        }
    }
}
function Lo(e) {
    return 'content' in e && wd(e) ? e.content : null
}
function wd(e) {
    return e.nodeType === Node.ELEMENT_NODE && e.nodeName === 'TEMPLATE'
}
var z1 = (function (e) {
    return (
        (e[(e.NONE = 0)] = 'NONE'),
        (e[(e.HTML = 1)] = 'HTML'),
        (e[(e.STYLE = 2)] = 'STYLE'),
        (e[(e.SCRIPT = 3)] = 'SCRIPT'),
        (e[(e.URL = 4)] = 'URL'),
        (e[(e.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
        e
    )
})(z1 || {})
function As(e) {
    let t = bd()
    return t
        ? Mo(t.sanitize(z1.HTML, e) || '')
        : Me(e, 'HTML')
        ? Mo(C1(e))
        : n6(W4(), ae(e))
}
function bd() {
    let e = V()
    return e && e[G2].sanitizer
}
var Sd = /^>|^->|<!--|-->|--!>|<!-$/g,
    xd = /(<|>)/g,
    Dd = '\u200B$1\u200B'
function Nd(e) {
    return e.replace(Sd, t => t.replace(xd, Dd))
}
function Q0(e) {
    return e.ownerDocument.defaultView
}
function Ed(e) {
    return e.ownerDocument.body
}
function ks(e) {
    return e instanceof Function ? e() : e
}
function c0(e) {
    return (e ?? g(ge)).get(Z2) === 'browser'
}
var g1 = (function (e) {
        return (
            (e[(e.Important = 1)] = 'Important'),
            (e[(e.DashCase = 2)] = 'DashCase'),
            e
        )
    })(g1 || {}),
    Id
function r6(e, t) {
    return Id(e, t)
}
function qe(e, t, r, n, a) {
    if (n != null) {
        let i,
            o = !1
        a1(n) ? (i = n) : d1(n) && ((o = !0), (n = n[E2]))
        let c = Y2(n)
        e === 0 && r !== null
            ? a == null
                ? Os(t, r, c)
                : D0(t, r, c, a || null, !0)
            : e === 1 && r !== null
            ? D0(t, r, c, a || null, !0)
            : e === 2
            ? s6(t, c, o)
            : e === 3 && t.destroyNode(c),
            i != null && Wd(t, e, i, r, a)
    }
}
function a6(e, t) {
    return e.createText(t)
}
function Td(e, t, r) {
    e.setValue(t, r)
}
function i6(e, t) {
    return e.createComment(Nd(t))
}
function Z0(e, t, r) {
    return e.createElement(t, r)
}
function Ad(e, t) {
    Rs(e, t), (t[E2] = null), (t[T2] = null)
}
function kd(e, t, r, n, a, i) {
    ;(n[E2] = a), (n[T2] = t), K0(e, n, r, 1, a, i)
}
function Rs(e, t) {
    t[G2].changeDetectionScheduler?.notify(1), K0(e, t, t[q], 2, null, null)
}
function Rd(e) {
    let t = e[I4]
    if (!t) return Tn(e[R], e)
    for (; t; ) {
        let r = null
        if (d1(t)) r = t[I4]
        else {
            let n = t[N2]
            n && (r = n)
        }
        if (!r) {
            for (; t && !t[W2] && t !== e; ) d1(t) && Tn(t[R], t), (t = t[f2])
            t === null && (t = e), d1(t) && Tn(t[R], t), (r = t && t[W2])
        }
        t = r
    }
}
function Pd(e, t, r, n) {
    let a = N2 + n,
        i = r.length
    n > 0 && (r[a - 1][W2] = t),
        n < i - N2
            ? ((t[W2] = r[a]), rc(r, N2 + n, t))
            : (r.push(t), (t[W2] = null)),
        (t[f2] = r)
    let o = t[j0]
    o !== null && r !== o && _d(o, t)
    let c = t[Ze]
    c !== null && c.insertView(e), Yn(t), (t[x] |= 128)
}
function _d(e, t) {
    let r = e[y0],
        a = t[f2][f2][I2]
    t[I2] !== a && (e[x] |= jr.HasTransplantedViews),
        r === null ? (e[y0] = [t]) : r.push(t)
}
function Ps(e, t) {
    let r = e[y0],
        n = r.indexOf(t)
    r.splice(n, 1)
}
function ur(e, t) {
    if (e.length <= N2) return
    let r = N2 + t,
        n = e[r]
    if (n) {
        let a = n[j0]
        a !== null && a !== e && Ps(a, n), t > 0 && (e[r - 1][W2] = n[W2])
        let i = v0(e, N2 + t)
        Ad(n[R], n)
        let o = i[Ze]
        o !== null && o.detachView(i[R]),
            (n[f2] = null),
            (n[W2] = null),
            (n[x] &= -129)
    }
    return n
}
function _s(e, t) {
    if (!(t[x] & 256)) {
        let r = t[q]
        r.destroyNode && K0(e, t, r, 3, null, null), Rd(t)
    }
}
function Tn(e, t) {
    if (t[x] & 256) return
    let r = j(null)
    try {
        ;(t[x] &= -129),
            (t[x] |= 256),
            t[le] && vi(t[le]),
            Od(e, t),
            Fd(e, t),
            t[R].type === 1 && t[q].destroy()
        let n = t[j0]
        if (n !== null && a1(t[f2])) {
            n !== t[f2] && Ps(n, t)
            let a = t[Ze]
            a !== null && a.detachView(e)
        }
        Uu(t)
    } finally {
        j(r)
    }
}
function Fd(e, t) {
    let r = e.cleanup,
        n = t[E4]
    if (r !== null)
        for (let i = 0; i < r.length - 1; i += 2)
            if (typeof r[i] == 'string') {
                let o = r[i + 3]
                o >= 0 ? n[o]() : n[-o].unsubscribe(), (i += 2)
            } else {
                let o = n[r[i + 1]]
                r[i].call(o)
            }
    n !== null && (t[E4] = null)
    let a = t[k1]
    if (a !== null) {
        t[k1] = null
        for (let i = 0; i < a.length; i++) {
            let o = a[i]
            o()
        }
    }
}
function Od(e, t) {
    let r
    if (e != null && (r = e.destroyHooks) != null)
        for (let n = 0; n < r.length; n += 2) {
            let a = t[r[n]]
            if (!(a instanceof R4)) {
                let i = r[n + 1]
                if (Array.isArray(i))
                    for (let o = 0; o < i.length; o += 2) {
                        let c = a[i[o]],
                            s = i[o + 1]
                        t1(4, c, s)
                        try {
                            s.call(c)
                        } finally {
                            t1(5, c, s)
                        }
                    }
                else {
                    t1(4, a, i)
                    try {
                        i.call(a)
                    } finally {
                        t1(5, a, i)
                    }
                }
            }
        }
}
function Fs(e, t, r) {
    return Bd(e, t.parent, r)
}
function Bd(e, t, r) {
    let n = t
    for (; n !== null && n.type & 40; ) (t = n), (n = t.parent)
    if (n === null) return r[E2]
    {
        let { componentOffset: a } = n
        if (a > -1) {
            let { encapsulation: i } = e.data[n.directiveStart + a]
            if (i === r1.None || i === r1.Emulated) return null
        }
        return A2(n, r)
    }
}
function D0(e, t, r, n, a) {
    e.insertBefore(t, r, n, a)
}
function Os(e, t, r) {
    e.appendChild(t, r)
}
function wo(e, t, r, n, a) {
    n !== null ? D0(e, t, r, n, a) : Os(e, t, r)
}
function jd(e, t, r, n) {
    e.removeChild(t, r, n)
}
function o6(e, t) {
    return e.parentNode(t)
}
function Ud(e, t) {
    return e.nextSibling(t)
}
function Bs(e, t, r) {
    return Vd(e, t, r)
}
function Hd(e, t, r) {
    return e.type & 40 ? A2(e, r) : null
}
var Vd = Hd,
    bo
function c6(e, t, r, n) {
    let a = Fs(e, n, t),
        i = t[q],
        o = n.parent || t[T2],
        c = Bs(o, n, t)
    if (a != null)
        if (Array.isArray(r))
            for (let s = 0; s < r.length; s++) wo(i, a, r[s], c, !1)
        else wo(i, a, r, c, !1)
    bo !== void 0 && bo(i, n, t, r, a)
}
function p0(e, t) {
    if (t !== null) {
        let r = t.type
        if (r & 3) return A2(t, e)
        if (r & 4) return dr(-1, e[t.index])
        if (r & 8) {
            let n = t.child
            if (n !== null) return p0(e, n)
            {
                let a = e[t.index]
                return a1(a) ? dr(-1, a) : Y2(a)
            }
        } else {
            if (r & 32) return r6(t, e)() || Y2(e[t.index])
            {
                let n = js(e, t)
                if (n !== null) {
                    if (Array.isArray(n)) return n[0]
                    let a = k4(e[I2])
                    return p0(a, n)
                } else return p0(e, t.next)
            }
        }
    }
    return null
}
function js(e, t) {
    if (t !== null) {
        let n = e[I2][T2],
            a = t.projection
        return n.projection[a]
    }
    return null
}
function dr(e, t) {
    let r = N2 + e + 1
    if (r < t.length) {
        let n = t[r],
            a = n[R].firstChild
        if (a !== null) return p0(n, a)
    }
    return t[p1]
}
function s6(e, t, r) {
    let n = o6(e, t)
    n && jd(e, n, t, r)
}
function Us(e) {
    e.textContent = ''
}
function l6(e, t, r, n, a, i, o) {
    for (; r != null; ) {
        let c = n[r.index],
            s = r.type
        if (
            (o && t === 0 && (c && ue(Y2(c), n), (r.flags |= 2)),
            (r.flags & 32) !== 32)
        )
            if (s & 8) l6(e, t, r.child, n, a, i, !1), qe(t, e, a, c, i)
            else if (s & 32) {
                let l = r6(r, n),
                    f
                for (; (f = l()); ) qe(t, e, a, f, i)
                qe(t, e, a, c, i)
            } else s & 16 ? Hs(e, t, n, r, a, i) : qe(t, e, a, c, i)
        r = o ? r.projectionNext : r.next
    }
}
function K0(e, t, r, n, a, i) {
    l6(r, n, e.firstChild, t, a, i, !1)
}
function $d(e, t, r) {
    let n = t[q],
        a = Fs(e, r, t),
        i = r.parent || t[T2],
        o = Bs(i, r, t)
    Hs(n, 0, t, r, a, o)
}
function Hs(e, t, r, n, a, i) {
    let o = r[I2],
        s = o[T2].projection[n.projection]
    if (Array.isArray(s))
        for (let l = 0; l < s.length; l++) {
            let f = s[l]
            qe(t, e, a, f, i)
        }
    else {
        let l = s,
            f = o[f2]
        S0(n) && (l.flags |= 128), l6(e, t, l, f, a, i, !0)
    }
}
function Wd(e, t, r, n, a) {
    let i = r[p1],
        o = Y2(r)
    i !== o && qe(t, e, n, i, a)
    for (let c = N2; c < r.length; c++) {
        let s = r[c]
        K0(s[R], s, e, t, n, i)
    }
}
function qd(e, t, r, n, a) {
    if (t) a ? e.addClass(r, n) : e.removeClass(r, n)
    else {
        let i = n.indexOf('-') === -1 ? void 0 : g1.DashCase
        a == null
            ? e.removeStyle(r, n, i)
            : (typeof a == 'string' &&
                  a.endsWith('!important') &&
                  ((a = a.slice(0, -10)), (i |= g1.Important)),
              e.setStyle(r, n, a, i))
    }
}
function Gd(e, t, r) {
    e.setAttribute(t, 'style', r)
}
function Vs(e, t, r) {
    r === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', r)
}
function $s(e, t, r) {
    let { mergedAttrs: n, classes: a, styles: i } = r
    n !== null && Hn(e, t, n),
        a !== null && Vs(e, t, a),
        i !== null && Gd(e, t, i)
}
var L1 = {}
function c2(e = 1) {
    Ws(B2(), V(), me() + e, !1)
}
function Ws(e, t, r, n) {
    if (!n)
        if ((t[x] & 3) === 3) {
            let i = e.preOrderCheckHooks
            i !== null && u0(t, i, r)
        } else {
            let i = e.preOrderHooks
            i !== null && d0(t, i, 0, r)
        }
    fe(r)
}
function Z(e, t = k.Default) {
    let r = V()
    if (r === null) return D(e, t)
    let n = Q2()
    return ts(n, r, _2(e), t)
}
function qs(e, t, r, n, a, i) {
    let o = j(null)
    try {
        let c = null
        a & R1.SignalBased && (c = t[n][ke]),
            c !== null && c.transformFn !== void 0 && (i = c.transformFn(i)),
            a & R1.HasDecoratorInputTransform &&
                (i = e.inputTransforms[n].call(t, i)),
            e.setInput !== null ? e.setInput(t, c, i, r, n) : wc(t, c, n, i)
    } finally {
        j(o)
    }
}
function Yd(e, t) {
    let r = e.hostBindingOpCodes
    if (r !== null)
        try {
            for (let n = 0; n < r.length; n++) {
                let a = r[n]
                if (a < 0) fe(~a)
                else {
                    let i = a,
                        o = r[++n],
                        c = r[++n]
                    du(o, i)
                    let s = t[i]
                    c(2, s)
                }
            }
        } finally {
            fe(-1)
        }
}
function X0(e, t, r, n, a, i, o, c, s, l, f) {
    let u = t.blueprint.slice()
    return (
        (u[E2] = a),
        (u[x] = n | 4 | 128 | 8 | 64),
        (l !== null || (e && e[x] & 2048)) && (u[x] |= 2048),
        Ic(u),
        (u[f2] = u[Xe] = e),
        (u[q2] = r),
        (u[G2] = o || (e && e[G2])),
        (u[q] = c || (e && e[q])),
        (u[Qe] = s || (e && e[Qe]) || null),
        (u[T2] = i),
        (u[U0] = Bu()),
        (u[O2] = f),
        (u[Cc] = l),
        (u[I2] = t.type == 2 ? e[I2] : u),
        u
    )
}
function G4(e, t, r, n, a) {
    let i = e.data[t]
    if (i === null) (i = Qd(e, t, r, n, a)), uu() && (i.flags |= 32)
    else if (i.type & 64) {
        ;(i.type = r), (i.value = n), (i.attrs = a)
        let o = ou()
        i.injectorIndex = o === null ? -1 : o.injectorIndex
    }
    return $4(i, !0), i
}
function Qd(e, t, r, n, a) {
    let i = Pc(),
        o = _c(),
        c = o ? i : i && i.parent,
        s = (e.data[t] = tp(e, c, r, t, n, a))
    return (
        e.firstChild === null && (e.firstChild = s),
        i !== null &&
            (o
                ? i.child == null && s.parent !== null && (i.child = s)
                : i.next === null && ((i.next = s), (s.prev = i))),
        s
    )
}
function Gs(e, t, r, n) {
    if (r === 0) return -1
    let a = t.length
    for (let i = 0; i < r; i++)
        t.push(n), e.blueprint.push(n), e.data.push(null)
    return a
}
function Ys(e, t, r, n, a) {
    let i = me(),
        o = n & 2
    try {
        fe(-1),
            o && t.length > u2 && Ws(e, t, u2, !1),
            t1(o ? 2 : 0, a),
            r(n, a)
    } finally {
        fe(i), t1(o ? 3 : 1, a)
    }
}
function Qs(e, t, r) {
    if (zc(t)) {
        let n = j(null)
        try {
            let a = t.directiveStart,
                i = t.directiveEnd
            for (let o = a; o < i; o++) {
                let c = e.data[o]
                if (c.contentQueries) {
                    let s = r[o]
                    c.contentQueries(1, s, o)
                }
            }
        } finally {
            j(n)
        }
    }
}
function Zs(e, t, r) {
    Ac() && (cp(e, t, r, A2(r, t)), (r.flags & 64) === 64 && r8(e, t, r))
}
function Ks(e, t, r = A2) {
    let n = t.localNames
    if (n !== null) {
        let a = t.index + 1
        for (let i = 0; i < n.length; i += 2) {
            let o = n[i + 1],
                c = o === -1 ? r(t, e) : e[o]
            e[a++] = c
        }
    }
}
function Xs(e) {
    let t = e.tView
    return t === null || t.incompleteFirstPass
        ? (e.tView = f6(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
          ))
        : t
}
function f6(e, t, r, n, a, i, o, c, s, l, f) {
    let u = u2 + n,
        d = u + a,
        p = Zd(u, d),
        m = typeof l == 'function' ? l() : l
    return (p[R] = {
        type: e,
        blueprint: p,
        template: r,
        queries: null,
        viewQuery: c,
        declTNode: t,
        data: p.slice().fill(null, u),
        bindingStartIndex: u,
        expandoStartIndex: d,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == 'function' ? i() : i,
        pipeRegistry: typeof o == 'function' ? o() : o,
        firstChild: null,
        schemas: s,
        consts: m,
        incompleteFirstPass: !1,
        ssrId: f,
    })
}
function Zd(e, t) {
    let r = []
    for (let n = 0; n < t; n++) r.push(n < e ? null : L1)
    return r
}
function Kd(e, t, r, n) {
    let i = n.get(zs, ys) || r === r1.ShadowDom,
        o = e.selectRootElement(t, i)
    return Xd(o), o
}
function Xd(e) {
    Js(e)
}
var Js = () => null
function Jd(e) {
    ss(e) ? Us(e) : nd(e)
}
function ep() {
    Js = Jd
}
function tp(e, t, r, n, a, i) {
    let o = t ? t.injectorIndex : -1,
        c = 0
    return (
        Je() && (c |= 128),
        {
            type: r,
            index: n,
            insertBeforeIndex: null,
            injectorIndex: o,
            directiveStart: -1,
            directiveEnd: -1,
            directiveStylingLast: -1,
            componentOffset: -1,
            propertyBindings: null,
            flags: c,
            providerIndexes: 0,
            value: a,
            attrs: i,
            mergedAttrs: null,
            localNames: null,
            initialInputs: void 0,
            inputs: null,
            outputs: null,
            tView: null,
            next: null,
            prev: null,
            projectionNext: null,
            child: null,
            parent: t,
            projection: null,
            styles: null,
            stylesWithoutHost: null,
            residualStyles: void 0,
            classes: null,
            classesWithoutHost: null,
            residualClasses: void 0,
            classBindings: 0,
            styleBindings: 0,
        }
    )
}
function So(e, t, r, n, a) {
    for (let i in t) {
        if (!t.hasOwnProperty(i)) continue
        let o = t[i]
        if (o === void 0) continue
        n ??= {}
        let c,
            s = R1.None
        Array.isArray(o) ? ((c = o[0]), (s = o[1])) : (c = o)
        let l = i
        if (a !== null) {
            if (!a.hasOwnProperty(i)) continue
            l = a[i]
        }
        e === 0 ? xo(n, r, l, c, s) : xo(n, r, l, c)
    }
    return n
}
function xo(e, t, r, n, a) {
    let i
    e.hasOwnProperty(r) ? (i = e[r]).push(t, n) : (i = e[r] = [t, n]),
        a !== void 0 && i.push(a)
}
function np(e, t, r) {
    let n = t.directiveStart,
        a = t.directiveEnd,
        i = e.data,
        o = t.attrs,
        c = [],
        s = null,
        l = null
    for (let f = n; f < a; f++) {
        let u = i[f],
            d = r ? r.get(u) : null,
            p = d ? d.inputs : null,
            m = d ? d.outputs : null
        ;(s = So(0, u.inputs, f, s, p)), (l = So(1, u.outputs, f, l, m))
        let v = s !== null && o !== null && !Fr(t) ? Mp(s, f, o) : null
        c.push(v)
    }
    s !== null &&
        (s.hasOwnProperty('class') && (t.flags |= 8),
        s.hasOwnProperty('style') && (t.flags |= 16)),
        (t.initialInputs = c),
        (t.inputs = s),
        (t.outputs = l)
}
function rp(e) {
    return e === 'class'
        ? 'className'
        : e === 'for'
        ? 'htmlFor'
        : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
        ? 'innerHTML'
        : e === 'readonly'
        ? 'readOnly'
        : e === 'tabindex'
        ? 'tabIndex'
        : e
}
function e8(e, t, r, n, a, i, o, c) {
    let s = A2(t, r),
        l = t.inputs,
        f
    !c && l != null && (f = l[n])
        ? (u6(e, r, f, n, a), H4(t) && ap(r, t.index))
        : t.type & 3
        ? ((n = rp(n)),
          (a = o != null ? o(a, t.value || '', n) : a),
          i.setProperty(s, n, a))
        : t.type & 12
}
function ap(e, t) {
    let r = j1(t, e)
    r[x] & 16 || (r[x] |= 64)
}
function t8(e, t, r, n) {
    if (Ac()) {
        let a = n === null ? null : { '': -1 },
            i = lp(e, r),
            o,
            c
        i === null ? (o = c = null) : ([o, c] = i),
            o !== null && n8(e, t, r, o, a, c),
            a && fp(r, n, a)
    }
    r.mergedAttrs = _r(r.mergedAttrs, r.attrs)
}
function n8(e, t, r, n, a, i) {
    for (let l = 0; l < n.length; l++) xu(Kc(r, t), e, n[l].type)
    dp(r, e.data.length, n.length)
    for (let l = 0; l < n.length; l++) {
        let f = n[l]
        f.providersResolver && f.providersResolver(f)
    }
    let o = !1,
        c = !1,
        s = Gs(e, t, n.length, null)
    for (let l = 0; l < n.length; l++) {
        let f = n[l]
        ;(r.mergedAttrs = _r(r.mergedAttrs, f.hostAttrs)),
            pp(e, r, t, s, f),
            up(s, f, a),
            f.contentQueries !== null && (r.flags |= 4),
            (f.hostBindings !== null ||
                f.hostAttrs !== null ||
                f.hostVars !== 0) &&
                (r.flags |= 64)
        let u = f.type.prototype
        !o &&
            (u.ngOnChanges || u.ngOnInit || u.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(r.index), (o = !0)),
            !c &&
                (u.ngOnChanges || u.ngDoCheck) &&
                ((e.preOrderCheckHooks ??= []).push(r.index), (c = !0)),
            s++
    }
    np(e, r, i)
}
function ip(e, t, r, n, a) {
    let i = a.hostBindings
    if (i) {
        let o = e.hostBindingOpCodes
        o === null && (o = e.hostBindingOpCodes = [])
        let c = ~t.index
        op(o) != c && o.push(c), o.push(r, n, i)
    }
}
function op(e) {
    let t = e.length
    for (; t > 0; ) {
        let r = e[--t]
        if (typeof r == 'number' && r < 0) return r
    }
    return 0
}
function cp(e, t, r, n) {
    let a = r.directiveStart,
        i = r.directiveEnd
    H4(r) && hp(t, r, e.data[a + r.componentOffset]),
        e.firstCreatePass || Kc(r, t),
        ue(n, t)
    let o = r.initialInputs
    for (let c = a; c < i; c++) {
        let s = e.data[c],
            l = P4(t, e, c, r)
        if ((ue(l, t), o !== null && vp(t, c - a, l, s, r, o), V4(s))) {
            let f = j1(r.index, t)
            f[q2] = P4(t, e, c, r)
        }
    }
}
function r8(e, t, r) {
    let n = r.directiveStart,
        a = r.directiveEnd,
        i = r.index,
        o = pu()
    try {
        fe(i)
        for (let c = n; c < a; c++) {
            let s = e.data[c],
                l = t[c]
            Qn(c),
                (s.hostBindings !== null ||
                    s.hostVars !== 0 ||
                    s.hostAttrs !== null) &&
                    sp(s, l)
        }
    } finally {
        fe(-1), Qn(o)
    }
}
function sp(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}
function lp(e, t) {
    let r = e.directiveRegistry,
        n = null,
        a = null
    if (r)
        for (let i = 0; i < r.length; i++) {
            let o = r[i]
            if (sc(t, o.selectors, !1))
                if ((n || (n = []), V4(o)))
                    if (o.findHostDirectiveDefs !== null) {
                        let c = []
                        ;(a = a || new Map()),
                            o.findHostDirectiveDefs(o, c, a),
                            n.unshift(...c, o)
                        let s = c.length
                        pr(e, t, s)
                    } else n.unshift(o), pr(e, t, 0)
                else
                    (a = a || new Map()),
                        o.findHostDirectiveDefs?.(o, n, a),
                        n.push(o)
        }
    return n === null ? null : [n, a]
}
function pr(e, t, r) {
    ;(t.componentOffset = r), (e.components ??= []).push(t.index)
}
function fp(e, t, r) {
    if (t) {
        let n = (e.localNames = [])
        for (let a = 0; a < t.length; a += 2) {
            let i = r[t[a + 1]]
            if (i == null) throw new w(-301, !1)
            n.push(t[a], i)
        }
    }
}
function up(e, t, r) {
    if (r) {
        if (t.exportAs)
            for (let n = 0; n < t.exportAs.length; n++) r[t.exportAs[n]] = e
        V4(t) && (r[''] = e)
    }
}
function dp(e, t, r) {
    ;(e.flags |= 1),
        (e.directiveStart = t),
        (e.directiveEnd = t + r),
        (e.providerIndexes = t)
}
function pp(e, t, r, n, a) {
    e.data[n] = a
    let i = a.factory || (a.factory = oe(a.type, !0)),
        o = new R4(i, V4(a), Z)
    ;(e.blueprint[n] = o), (r[n] = o), ip(e, t, n, Gs(e, r, a.hostVars, L1), a)
}
function hp(e, t, r) {
    let n = A2(t, e),
        a = Xs(r),
        i = e[G2].rendererFactory,
        o = 16
    r.signals ? (o = 4096) : r.onPush && (o = 64)
    let c = J0(
        e,
        X0(e, a, null, o, n, t, null, i.createRenderer(n, r), null, null, null)
    )
    e[t.index] = c
}
function mp(e, t, r, n, a, i) {
    let o = A2(e, t)
    gp(t[q], o, i, e.value, r, n, a)
}
function gp(e, t, r, n, a, i, o) {
    if (i == null) e.removeAttribute(t, a, r)
    else {
        let c = o == null ? ae(i) : o(i, n || '', a)
        e.setAttribute(t, a, c, r)
    }
}
function vp(e, t, r, n, a, i) {
    let o = i[t]
    if (o !== null)
        for (let c = 0; c < o.length; ) {
            let s = o[c++],
                l = o[c++],
                f = o[c++],
                u = o[c++]
            qs(n, r, s, l, f, u)
        }
}
function Mp(e, t, r) {
    let n = null,
        a = 0
    for (; a < r.length; ) {
        let i = r[a]
        if (i === 0) {
            a += 4
            continue
        } else if (i === 5) {
            a += 2
            continue
        }
        if (typeof i == 'number') break
        if (e.hasOwnProperty(i)) {
            n === null && (n = [])
            let o = e[i]
            for (let c = 0; c < o.length; c += 3)
                if (o[c] === t) {
                    n.push(i, o[c + 1], o[c + 2], r[a + 1])
                    break
                }
        }
        a += 2
    }
    return n
}
function a8(e, t, r, n) {
    return [e, !0, 0, t, null, n, null, r, null, null]
}
function i8(e, t) {
    let r = e.contentQueries
    if (r !== null) {
        let n = j(null)
        try {
            for (let a = 0; a < r.length; a += 2) {
                let i = r[a],
                    o = r[a + 1]
                if (o !== -1) {
                    let c = e.data[o]
                    Bc(i), c.contentQueries(2, t[o], o)
                }
            }
        } finally {
            j(n)
        }
    }
}
function J0(e, t) {
    return e[I4] ? (e[fo][W2] = t) : (e[I4] = t), (e[fo] = t), t
}
function hr(e, t, r) {
    Bc(0)
    let n = j(null)
    try {
        t(e, r)
    } finally {
        j(n)
    }
}
function Cp(e) {
    return e[E4] || (e[E4] = [])
}
function yp(e) {
    return e.cleanup || (e.cleanup = [])
}
function o8(e, t) {
    let r = e[Qe],
        n = r ? r.get(h1, null) : null
    n && n.handleError(t)
}
function u6(e, t, r, n, a) {
    for (let i = 0; i < r.length; ) {
        let o = r[i++],
            c = r[i++],
            s = r[i++],
            l = t[o],
            f = e.data[o]
        qs(f, l, n, c, s, a)
    }
}
function c8(e, t, r) {
    let n = Dc(t, e)
    Td(e[q], n, r)
}
function zp(e, t) {
    let r = j1(t, e),
        n = r[R]
    Lp(n, r)
    let a = r[E2]
    a !== null && r[O2] === null && (r[O2] = Jr(a, r[Qe])), d6(n, r, r[q2])
}
function Lp(e, t) {
    for (let r = t.length; r < e.blueprint.length; r++) t.push(e.blueprint[r])
}
function d6(e, t, r) {
    $r(t)
    try {
        let n = e.viewQuery
        n !== null && hr(1, n, r)
        let a = e.template
        a !== null && Ys(e, t, a, 1, r),
            e.firstCreatePass && (e.firstCreatePass = !1),
            t[Ze]?.finishViewCreation(e),
            e.staticContentQueries && i8(e, t),
            e.staticViewQueries && hr(2, e.viewQuery, r)
        let i = e.components
        i !== null && wp(t, i)
    } catch (n) {
        throw (
            (e.firstCreatePass &&
                ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            n)
        )
    } finally {
        ;(t[x] &= -5), Wr()
    }
}
function wp(e, t) {
    for (let r = 0; r < t.length; r++) zp(e, t[r])
}
function bp(e, t, r, n) {
    let a = j(null)
    try {
        let i = t.tView,
            c = e[x] & 4096 ? 4096 : 16,
            s = X0(
                e,
                i,
                r,
                c,
                null,
                t,
                null,
                null,
                n?.injector ?? null,
                n?.embeddedViewInjector ?? null,
                n?.dehydratedView ?? null
            ),
            l = e[t.index]
        s[j0] = l
        let f = e[Ze]
        return f !== null && (s[Ze] = f.createEmbeddedView(i)), d6(i, s, r), s
    } finally {
        j(a)
    }
}
function Do(e, t) {
    return !t || t.firstChild === null || S0(e)
}
function Sp(e, t, r, n = !0) {
    let a = t[R]
    if ((Pd(a, t, e, r), n)) {
        let o = dr(r, e),
            c = t[q],
            s = o6(c, e[p1])
        s !== null && kd(a, e[T2], c, t, s, o)
    }
    let i = t[O2]
    i !== null && i.firstChild !== null && (i.firstChild = null)
}
function N0(e, t, r, n, a = !1) {
    for (; r !== null; ) {
        let i = t[r.index]
        i !== null && n.push(Y2(i)), a1(i) && xp(i, n)
        let o = r.type
        if (o & 8) N0(e, t, r.child, n)
        else if (o & 32) {
            let c = r6(r, t),
                s
            for (; (s = c()); ) n.push(s)
        } else if (o & 16) {
            let c = js(t, r)
            if (Array.isArray(c)) n.push(...c)
            else {
                let s = k4(t[I2])
                N0(s[R], s, c, n, !0)
            }
        }
        r = a ? r.projectionNext : r.next
    }
    return n
}
function xp(e, t) {
    for (let r = N2; r < e.length; r++) {
        let n = e[r],
            a = n[R].firstChild
        a !== null && N0(n[R], n, a, t)
    }
    e[p1] !== e[E2] && t.push(e[p1])
}
var s8 = []
function Dp(e) {
    return e[le] ?? Np(e)
}
function Np(e) {
    let t = s8.pop() ?? Object.create(Ip)
    return (t.lView = e), t
}
function Ep(e) {
    e.lView[le] !== e && ((e.lView = null), s8.push(e))
}
var Ip = K(z({}, rn), {
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: e => {
            A4(e.lView)
        },
        consumerOnSignalRead() {
            this.lView[le] = this
        },
    }),
    l8 = 100
function f8(e, t = !0, r = 0) {
    let n = e[G2],
        a = n.rendererFactory,
        i = !1
    i || a.begin?.()
    try {
        Tp(e, r)
    } catch (o) {
        throw (t && o8(e, o), o)
    } finally {
        i || (a.end?.(), n.inlineEffectRunner?.flush())
    }
}
function Tp(e, t) {
    mr(e, t)
    let r = 0
    for (; Vr(e); ) {
        if (r === l8) throw new w(103, !1)
        r++, mr(e, 1)
    }
}
function Ap(e, t, r, n) {
    let a = t[x]
    if ((a & 256) === 256) return
    let i = !1
    !i && t[G2].inlineEffectRunner?.flush(), $r(t)
    let o = null,
        c = null
    !i && kp(e) && ((c = Dp(t)), (o = mi(c)))
    try {
        Ic(t), fu(e.bindingStartIndex), r !== null && Ys(e, t, r, 2, n)
        let s = (a & 3) === 3
        if (!i)
            if (s) {
                let u = e.preOrderCheckHooks
                u !== null && u0(t, u, null)
            } else {
                let u = e.preOrderHooks
                u !== null && d0(t, u, 0, null), xn(t, 0)
            }
        if ((Rp(t), u8(t, 0), e.contentQueries !== null && i8(e, t), !i))
            if (s) {
                let u = e.contentCheckHooks
                u !== null && u0(t, u)
            } else {
                let u = e.contentHooks
                u !== null && d0(t, u, 1), xn(t, 1)
            }
        Yd(e, t)
        let l = e.components
        l !== null && p8(t, l, 0)
        let f = e.viewQuery
        if ((f !== null && hr(2, f, n), !i))
            if (s) {
                let u = e.viewCheckHooks
                u !== null && u0(t, u)
            } else {
                let u = e.viewHooks
                u !== null && d0(t, u, 2), xn(t, 2)
            }
        if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Sn])) {
            for (let u of t[Sn]) u()
            t[Sn] = null
        }
        i || (t[x] &= -73)
    } catch (s) {
        throw (A4(t), s)
    } finally {
        c !== null && (gi(c, o), Ep(c)), Wr()
    }
}
function kp(e) {
    return e.type !== 2
}
function u8(e, t) {
    for (let r = fs(e); r !== null; r = us(r))
        for (let n = N2; n < r.length; n++) {
            let a = r[n]
            d8(a, t)
        }
}
function Rp(e) {
    for (let t = fs(e); t !== null; t = us(t)) {
        if (!(t[x] & jr.HasTransplantedViews)) continue
        let r = t[y0]
        for (let n = 0; n < r.length; n++) {
            let a = r[n],
                i = a[f2]
            Kf(a)
        }
    }
}
function Pp(e, t, r) {
    let n = j1(t, e)
    d8(n, r)
}
function d8(e, t) {
    Hr(e) && mr(e, t)
}
function mr(e, t) {
    let n = e[R],
        a = e[x],
        i = e[le],
        o = !!(t === 0 && a & 16)
    if (
        ((o ||= !!(a & 64 && t === 0)),
        (o ||= !!(a & 1024)),
        (o ||= !!(i?.dirty && an(i))),
        i && (i.dirty = !1),
        (e[x] &= -9217),
        o)
    )
        Ap(n, e, n.template, e[q2])
    else if (a & 8192) {
        u8(e, 1)
        let c = n.components
        c !== null && p8(e, c, 1)
    }
}
function p8(e, t, r) {
    for (let n = 0; n < t.length; n++) Pp(e, t[n], r)
}
function p6(e) {
    for (e[G2].changeDetectionScheduler?.notify(); e; ) {
        e[x] |= 64
        let t = k4(e)
        if (Lc(e) && !t) return e
        e = t
    }
    return null
}
var de = class {
        get rootNodes() {
            let t = this._lView,
                r = t[R]
            return N0(r, t, r.firstChild, [])
        }
        constructor(t, r, n = !0) {
            ;(this._lView = t),
                (this._cdRefInjectingView = r),
                (this.notifyErrorHandler = n),
                (this._appRef = null),
                (this._attachedToViewContainer = !1)
        }
        get context() {
            return this._lView[q2]
        }
        set context(t) {
            this._lView[q2] = t
        }
        get destroyed() {
            return (this._lView[x] & 256) === 256
        }
        destroy() {
            if (this._appRef) this._appRef.detachView(this)
            else if (this._attachedToViewContainer) {
                let t = this._lView[f2]
                if (a1(t)) {
                    let r = t[C0],
                        n = r ? r.indexOf(this) : -1
                    n > -1 && (ur(t, n), v0(r, n))
                }
                this._attachedToViewContainer = !1
            }
            _s(this._lView[R], this._lView)
        }
        onDestroy(t) {
            Tc(this._lView, t)
        }
        markForCheck() {
            p6(this._cdRefInjectingView || this._lView)
        }
        detach() {
            this._lView[x] &= -129
        }
        reattach() {
            Yn(this._lView), (this._lView[x] |= 128)
        }
        detectChanges() {
            ;(this._lView[x] |= 1024), f8(this._lView, this.notifyErrorHandler)
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
            if (this._appRef) throw new w(902, !1)
            this._attachedToViewContainer = !0
        }
        detachFromAppRef() {
            ;(this._appRef = null), Rs(this._lView[R], this._lView)
        }
        attachToAppRef(t) {
            if (this._attachedToViewContainer) throw new w(902, !1)
            ;(this._appRef = t), Yn(this._lView)
        }
    },
    et = (() => {
        let t = class t {}
        t.__NG_ELEMENT_ID__ = Op
        let e = t
        return e
    })(),
    _p = et,
    Fp = class extends _p {
        constructor(t, r, n) {
            super(),
                (this._declarationLView = t),
                (this._declarationTContainer = r),
                (this.elementRef = n)
        }
        get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null
        }
        createEmbeddedView(t, r) {
            return this.createEmbeddedViewImpl(t, r)
        }
        createEmbeddedViewImpl(t, r, n) {
            let a = bp(this._declarationLView, this._declarationTContainer, t, {
                embeddedViewInjector: r,
                dehydratedView: n,
            })
            return new de(a)
        }
    }
function Op() {
    return h8(Q2(), V())
}
function h8(e, t) {
    return e.type & 4 ? new Fp(t, e, $0(e, t)) : null
}
function m8(e) {
    let t = e[T4] ?? [],
        n = e[f2][q]
    for (let a of t) Bp(a, n)
    e[T4] = F2
}
function Bp(e, t) {
    let r = 0,
        n = e.firstChild
    if (n) {
        let a = e.data[x0]
        for (; r < a; ) {
            let i = n.nextSibling
            s6(t, n, !1), (n = i), r++
        }
    }
}
function g8(e) {
    m8(e)
    for (let t = N2; t < e.length; t++) E0(e[t])
}
function jp(e) {
    let t = e[O2]?.i18nNodes
    if (t) {
        let r = e[q]
        for (let n of t.values()) s6(r, n, !1)
        e[O2].i18nNodes = void 0
    }
}
function E0(e) {
    jp(e)
    let t = e[R]
    for (let r = u2; r < t.bindingStartIndex; r++)
        if (a1(e[r])) {
            let n = e[r]
            g8(n)
        } else d1(e[r]) && E0(e[r])
}
function Up(e) {
    let t = e._views
    for (let r of t) {
        let n = ed(r)
        if (n !== null && n[E2] !== null)
            if (d1(n)) E0(n)
            else {
                let a = n[E2]
                E0(a), g8(n)
            }
    }
}
var Hp = new RegExp(`^(\\d+)*(${ms}|${hs})*(.*)`)
function Vp(e) {
    let t = e.match(Hp),
        [r, n, a, i] = t,
        o = n ? parseInt(n, 10) : a,
        c = []
    for (let [s, l, f] of i.matchAll(/(f|n)(\d*)/g)) {
        let u = parseInt(f, 10) || 1
        c.push(l, u)
    }
    return [o, ...c]
}
function $p(e) {
    return !e.prev && e.parent?.type === 8
}
function An(e) {
    return e.index - u2
}
function Wp(e, t) {
    let r = e.i18nNodes
    if (r) {
        let n = r.get(t)
        return n && r.delete(t), n
    }
    return null
}
function tt(e, t, r, n) {
    let a = An(n),
        i = Wp(e, a)
    if (!i) {
        let o = e.data[Yu]
        if (o?.[a]) i = Gp(o[a], r)
        else if (t.firstChild === n) i = e.firstChild
        else {
            let c = n.prev === null,
                s = n.prev ?? n.parent
            if ($p(n)) {
                let l = An(n.parent)
                i = nr(e, l)
            } else {
                let l = A2(s, r)
                if (c) i = l.firstChild
                else {
                    let f = An(s),
                        u = nr(e, f)
                    if (s.type === 2 && u) {
                        let p = e6(e, f) + 1
                        i = nt(p, u)
                    } else i = l.nextSibling
                }
            }
        }
    }
    return i
}
function nt(e, t) {
    let r = t
    for (let n = 0; n < e; n++) r = r.nextSibling
    return r
}
function qp(e, t) {
    let r = e
    for (let n = 0; n < t.length; n += 2) {
        let a = t[n],
            i = t[n + 1]
        for (let o = 0; o < i; o++)
            switch (a) {
                case tr.FirstChild:
                    r = r.firstChild
                    break
                case tr.NextSibling:
                    r = r.nextSibling
                    break
            }
    }
    return r
}
function Gp(e, t) {
    let [r, ...n] = Vp(e),
        a
    if (r === hs) a = t[I2][E2]
    else if (r === ms) a = Ed(t[I2][E2])
    else {
        let i = Number(r)
        a = Y2(t[i + u2])
    }
    return qp(a, n)
}
function Yp(e, t) {
    let r = []
    for (let n of t)
        for (let a = 0; a < (n[gs] ?? 1); a++) {
            let i = { data: n, firstChild: null }
            n[x0] > 0 && ((i.firstChild = e), (e = nt(n[x0], e))), r.push(i)
        }
    return [e, r]
}
var v8 = () => null
function Qp(e, t) {
    let r = e[T4]
    return !t || r === null || r.length === 0
        ? null
        : r[0].data[Gu] === t
        ? r.shift()
        : (m8(e), null)
}
function Zp() {
    v8 = Qp
}
function No(e, t) {
    return v8(e, t)
}
var gr = class {},
    vr = class {},
    I0 = class {}
function Kp(e) {
    let t = Error(`No component factory found for ${M2(e)}.`)
    return (t[Xp] = e), t
}
var Xp = 'ngComponent'
var Mr = class {
        resolveComponentFactory(t) {
            throw Kp(t)
        }
    },
    rt = (() => {
        let t = class t {}
        t.NULL = new Mr()
        let e = t
        return e
    })(),
    _4 = class {},
    Y4 = (() => {
        let t = class t {
            constructor() {
                this.destroyNode = null
            }
        }
        t.__NG_ELEMENT_ID__ = () => Jp()
        let e = t
        return e
    })()
function Jp() {
    let e = V(),
        t = Q2(),
        r = j1(t.index, e)
    return (d1(r) ? r : e)[q]
}
var eh = (() => {
        let t = class t {}
        t.ɵprov = y({ token: t, providedIn: 'root', factory: () => null })
        let e = t
        return e
    })(),
    kn = {}
var Eo = new Set()
function t4(e) {
    Eo.has(e) ||
        (Eo.add(e),
        performance?.mark?.('mark_feature_usage', { detail: { feature: e } }))
}
function Io(...e) {}
function th() {
    let e = typeof D2.requestAnimationFrame == 'function',
        t = D2[e ? 'requestAnimationFrame' : 'setTimeout'],
        r = D2[e ? 'cancelAnimationFrame' : 'clearTimeout']
    if (typeof Zone < 'u' && t && r) {
        let n = t[Zone.__symbol__('OriginalDelegate')]
        n && (t = n)
        let a = r[Zone.__symbol__('OriginalDelegate')]
        a && (r = a)
    }
    return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: r }
}
var J = class e {
        constructor({
            enableLongStackTrace: t = !1,
            shouldCoalesceEventChangeDetection: r = !1,
            shouldCoalesceRunChangeDetection: n = !1,
        }) {
            if (
                ((this.hasPendingMacrotasks = !1),
                (this.hasPendingMicrotasks = !1),
                (this.isStable = !0),
                (this.onUnstable = new $2(!1)),
                (this.onMicrotaskEmpty = new $2(!1)),
                (this.onStable = new $2(!1)),
                (this.onError = new $2(!1)),
                typeof Zone > 'u')
            )
                throw new w(908, !1)
            Zone.assertZonePatched()
            let a = this
            ;(a._nesting = 0),
                (a._outer = a._inner = Zone.current),
                Zone.TaskTrackingZoneSpec &&
                    (a._inner = a._inner.fork(new Zone.TaskTrackingZoneSpec())),
                t &&
                    Zone.longStackTraceZoneSpec &&
                    (a._inner = a._inner.fork(Zone.longStackTraceZoneSpec)),
                (a.shouldCoalesceEventChangeDetection = !n && r),
                (a.shouldCoalesceRunChangeDetection = n),
                (a.lastRequestAnimationFrameId = -1),
                (a.nativeRequestAnimationFrame =
                    th().nativeRequestAnimationFrame),
                ah(a)
        }
        static isInAngularZone() {
            return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new w(909, !1)
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new w(909, !1)
        }
        run(t, r, n) {
            return this._inner.run(t, r, n)
        }
        runTask(t, r, n, a) {
            let i = this._inner,
                o = i.scheduleEventTask('NgZoneEvent: ' + a, t, nh, Io, Io)
            try {
                return i.runTask(o, r, n)
            } finally {
                i.cancelTask(o)
            }
        }
        runGuarded(t, r, n) {
            return this._inner.runGuarded(t, r, n)
        }
        runOutsideAngular(t) {
            return this._outer.run(t)
        }
    },
    nh = {}
function h6(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            e._nesting++, e.onMicrotaskEmpty.emit(null)
        } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
                try {
                    e.runOutsideAngular(() => e.onStable.emit(null))
                } finally {
                    e.isStable = !0
                }
        }
}
function rh(e) {
    e.isCheckStableRunning ||
        e.lastRequestAnimationFrameId !== -1 ||
        ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
            D2,
            () => {
                e.fakeTopEventTask ||
                    (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                        'fakeTopEventTask',
                        () => {
                            ;(e.lastRequestAnimationFrameId = -1),
                                Cr(e),
                                (e.isCheckStableRunning = !0),
                                h6(e),
                                (e.isCheckStableRunning = !1)
                        },
                        void 0,
                        () => {},
                        () => {}
                    )),
                    e.fakeTopEventTask.invoke()
            }
        )),
        Cr(e))
}
function ah(e) {
    let t = () => {
        rh(e)
    }
    e._inner = e._inner.fork({
        name: 'angular',
        properties: { isAngularZone: !0 },
        onInvokeTask: (r, n, a, i, o, c) => {
            if (ih(c)) return r.invokeTask(a, i, o, c)
            try {
                return To(e), r.invokeTask(a, i, o, c)
            } finally {
                ;((e.shouldCoalesceEventChangeDetection &&
                    i.type === 'eventTask') ||
                    e.shouldCoalesceRunChangeDetection) &&
                    t(),
                    Ao(e)
            }
        },
        onInvoke: (r, n, a, i, o, c, s) => {
            try {
                return To(e), r.invoke(a, i, o, c, s)
            } finally {
                e.shouldCoalesceRunChangeDetection && t(), Ao(e)
            }
        },
        onHasTask: (r, n, a, i) => {
            r.hasTask(a, i),
                n === a &&
                    (i.change == 'microTask'
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Cr(e),
                          h6(e))
                        : i.change == 'macroTask' &&
                          (e.hasPendingMacrotasks = i.macroTask))
        },
        onHandleError: (r, n, a, i) => (
            r.handleError(a, i),
            e.runOutsideAngular(() => e.onError.emit(i)),
            !1
        ),
    })
}
function Cr(e) {
    e._hasPendingMicrotasks ||
    ((e.shouldCoalesceEventChangeDetection ||
        e.shouldCoalesceRunChangeDetection) &&
        e.lastRequestAnimationFrameId !== -1)
        ? (e.hasPendingMicrotasks = !0)
        : (e.hasPendingMicrotasks = !1)
}
function To(e) {
    e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null))
}
function Ao(e) {
    e._nesting--, h6(e)
}
function ih(e) {
    return !Array.isArray(e) || e.length !== 1
        ? !1
        : e[0].data?.__ignore_ng_zone__ === !0
}
var M8 = (() => {
    let t = class t {
        constructor() {
            ;(this.handler = null), (this.internalCallbacks = [])
        }
        execute() {
            this.executeInternalCallbacks(), this.handler?.execute()
        }
        executeInternalCallbacks() {
            let n = [...this.internalCallbacks]
            this.internalCallbacks.length = 0
            for (let a of n) a()
        }
        ngOnDestroy() {
            this.handler?.destroy(),
                (this.handler = null),
                (this.internalCallbacks.length = 0)
        }
    }
    t.ɵprov = y({ token: t, providedIn: 'root', factory: () => new t() })
    let e = t
    return e
})()
function yr(e, t, r) {
    let n = r ? e.styles : null,
        a = r ? e.classes : null,
        i = 0
    if (t !== null)
        for (let o = 0; o < t.length; o++) {
            let c = t[o]
            if (typeof c == 'number') i = c
            else if (i == 1) a = eo(a, c)
            else if (i == 2) {
                let s = c,
                    l = t[++o]
                n = eo(n, s + ': ' + l + ';')
            }
        }
    r ? (e.styles = n) : (e.stylesWithoutHost = n),
        r ? (e.classes = a) : (e.classesWithoutHost = a)
}
var T0 = class extends rt {
    constructor(t) {
        super(), (this.ngModule = t)
    }
    resolveComponentFactory(t) {
        let r = se(t)
        return new F4(r, this.ngModule)
    }
}
function ko(e) {
    let t = []
    for (let r in e) {
        if (!e.hasOwnProperty(r)) continue
        let n = e[r]
        n !== void 0 &&
            t.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r })
    }
    return t
}
function oh(e) {
    let t = e.toLowerCase()
    return t === 'svg' ? qf : t === 'math' ? Gf : null
}
var zr = class {
        constructor(t, r) {
            ;(this.injector = t), (this.parentInjector = r)
        }
        get(t, r, n) {
            n = O0(n)
            let a = this.injector.get(t, kn, n)
            return a !== kn || r === kn ? a : this.parentInjector.get(t, r, n)
        }
    },
    F4 = class extends I0 {
        get inputs() {
            let t = this.componentDef,
                r = t.inputTransforms,
                n = ko(t.inputs)
            if (r !== null)
                for (let a of n)
                    r.hasOwnProperty(a.propName) &&
                        (a.transform = r[a.propName])
            return n
        }
        get outputs() {
            return ko(this.componentDef.outputs)
        }
        constructor(t, r) {
            super(),
                (this.componentDef = t),
                (this.ngModule = r),
                (this.componentType = t.type),
                (this.selector = Sf(t.selectors)),
                (this.ngContentSelectors = t.ngContentSelectors
                    ? t.ngContentSelectors
                    : []),
                (this.isBoundToModule = !!r)
        }
        create(t, r, n, a) {
            let i = j(null)
            try {
                a = a || this.ngModule
                let o = a instanceof L2 ? a : a?.injector
                o &&
                    this.componentDef.getStandaloneInjector !== null &&
                    (o = this.componentDef.getStandaloneInjector(o) || o)
                let c = o ? new zr(t, o) : t,
                    s = c.get(_4, null)
                if (s === null) throw new w(407, !1)
                let l = c.get(eh, null),
                    f = c.get(M8, null),
                    u = c.get(gr, null),
                    d = {
                        rendererFactory: s,
                        sanitizer: l,
                        inlineEffectRunner: null,
                        afterRenderEventManager: f,
                        changeDetectionScheduler: u,
                    },
                    p = s.createRenderer(null, this.componentDef),
                    m = this.componentDef.selectors[0][0] || 'div',
                    v = n
                        ? Kd(p, n, this.componentDef.encapsulation, c)
                        : Z0(p, m, oh(m)),
                    C = 512
                this.componentDef.signals
                    ? (C |= 4096)
                    : this.componentDef.onPush || (C |= 16)
                let M = null
                v !== null && (M = Jr(v, c, !0))
                let E = f6(
                        0,
                        null,
                        null,
                        1,
                        0,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ),
                    F = X0(null, E, null, C, null, null, d, p, c, null, M)
                $r(F)
                let P, Q
                try {
                    let s2 = this.componentDef,
                        e1,
                        J1 = null
                    s2.findHostDirectiveDefs
                        ? ((e1 = []),
                          (J1 = new Map()),
                          s2.findHostDirectiveDefs(s2, e1, J1),
                          e1.push(s2))
                        : (e1 = [s2])
                    let nn = ch(F, v),
                        u9 = sh(nn, v, s2, e1, F, d, p)
                    ;(Q = Nc(E, u2)),
                        v && uh(p, s2, v, n),
                        r !== void 0 && dh(Q, this.ngContentSelectors, r),
                        (P = fh(u9, s2, e1, J1, F, [ph])),
                        d6(E, F, null)
                } finally {
                    Wr()
                }
                return new Lr(this.componentType, P, $0(Q, F), F, Q)
            } finally {
                j(i)
            }
        }
    },
    Lr = class extends vr {
        constructor(t, r, n, a, i) {
            super(),
                (this.location = n),
                (this._rootLView = a),
                (this._tNode = i),
                (this.previousInputValues = null),
                (this.instance = r),
                (this.hostView = this.changeDetectorRef =
                    new de(a, void 0, !1)),
                (this.componentType = t)
        }
        setInput(t, r) {
            let n = this._tNode.inputs,
                a
            if (n !== null && (a = n[t])) {
                if (
                    ((this.previousInputValues ??= new Map()),
                    this.previousInputValues.has(t) &&
                        Object.is(this.previousInputValues.get(t), r))
                )
                    return
                let i = this._rootLView
                u6(i[R], i, a, t, r), this.previousInputValues.set(t, r)
                let o = j1(this._tNode.index, i)
                p6(o)
            }
        }
        get injector() {
            return new ie(this._tNode, this._rootLView)
        }
        destroy() {
            this.hostView.destroy()
        }
        onDestroy(t) {
            this.hostView.onDestroy(t)
        }
    }
function ch(e, t) {
    let r = e[R],
        n = u2
    return (e[n] = t), G4(r, n, 2, '#host', null)
}
function sh(e, t, r, n, a, i, o) {
    let c = a[R]
    lh(n, e, t, o)
    let s = null
    t !== null && (s = Jr(t, a[Qe]))
    let l = i.rendererFactory.createRenderer(t, r),
        f = 16
    r.signals ? (f = 4096) : r.onPush && (f = 64)
    let u = X0(a, Xs(r), null, f, a[e.index], e, i, l, null, null, s)
    return (
        c.firstCreatePass && pr(c, e, n.length - 1), J0(a, u), (a[e.index] = u)
    )
}
function lh(e, t, r, n) {
    for (let a of e) t.mergedAttrs = _r(t.mergedAttrs, a.hostAttrs)
    t.mergedAttrs !== null &&
        (yr(t, t.mergedAttrs, !0), r !== null && $s(n, r, t))
}
function fh(e, t, r, n, a, i) {
    let o = Q2(),
        c = a[R],
        s = A2(o, a)
    n8(c, a, o, r, null, n)
    for (let f = 0; f < r.length; f++) {
        let u = o.directiveStart + f,
            d = P4(a, c, u, o)
        ue(d, a)
    }
    r8(c, a, o), s && ue(s, a)
    let l = P4(a, c, o.directiveStart + o.componentOffset, o)
    if (((e[q2] = a[q2] = l), i !== null)) for (let f of i) f(l, t)
    return Qs(c, o, a), l
}
function uh(e, t, r, n) {
    if (n) Hn(e, r, ['ng-version', '17.3.11'])
    else {
        let { attrs: a, classes: i } = xf(t.selectors[0])
        a && Hn(e, r, a), i && i.length > 0 && Vs(e, r, i.join(' '))
    }
}
function dh(e, t, r) {
    let n = (e.projection = [])
    for (let a = 0; a < t.length; a++) {
        let i = r[a]
        n.push(i != null ? Array.from(i) : null)
    }
}
function ph() {
    let e = Q2()
    Yr(V()[R], e)
}
var n4 = (() => {
    let t = class t {}
    t.__NG_ELEMENT_ID__ = hh
    let e = t
    return e
})()
function hh() {
    let e = Q2()
    return gh(e, V())
}
var mh = n4,
    C8 = class extends mh {
        constructor(t, r, n) {
            super(),
                (this._lContainer = t),
                (this._hostTNode = r),
                (this._hostLView = n)
        }
        get element() {
            return $0(this._hostTNode, this._hostLView)
        }
        get injector() {
            return new ie(this._hostTNode, this._hostLView)
        }
        get parentInjector() {
            let t = Qr(this._hostTNode, this._hostLView)
            if (Yc(t)) {
                let r = w0(t, this._hostLView),
                    n = L0(t),
                    a = r[R].data[n + 8]
                return new ie(a, r)
            } else return new ie(null, this._hostLView)
        }
        clear() {
            for (; this.length > 0; ) this.remove(this.length - 1)
        }
        get(t) {
            let r = Ro(this._lContainer)
            return (r !== null && r[t]) || null
        }
        get length() {
            return this._lContainer.length - N2
        }
        createEmbeddedView(t, r, n) {
            let a, i
            typeof n == 'number'
                ? (a = n)
                : n != null && ((a = n.index), (i = n.injector))
            let o = No(this._lContainer, t.ssrId),
                c = t.createEmbeddedViewImpl(r || {}, i, o)
            return this.insertImpl(c, a, Do(this._hostTNode, o)), c
        }
        createComponent(t, r, n, a, i) {
            let o = t && !Hf(t),
                c
            if (o) c = r
            else {
                let m = r || {}
                ;(c = m.index),
                    (n = m.injector),
                    (a = m.projectableNodes),
                    (i = m.environmentInjector || m.ngModuleRef)
            }
            let s = o ? t : new F4(se(t)),
                l = n || this.parentInjector
            if (!i && s.ngModule == null) {
                let v = (o ? l : this.parentInjector).get(L2, null)
                v && (i = v)
            }
            let f = se(s.componentType ?? {}),
                u = No(this._lContainer, f?.id ?? null),
                d = u?.firstChild ?? null,
                p = s.create(l, a, d, i)
            return this.insertImpl(p.hostView, c, Do(this._hostTNode, u)), p
        }
        insert(t, r) {
            return this.insertImpl(t, r, !0)
        }
        insertImpl(t, r, n) {
            let a = t._lView
            if (Zf(a)) {
                let c = this.indexOf(t)
                if (c !== -1) this.detach(c)
                else {
                    let s = a[f2],
                        l = new C8(s, s[T2], s[f2])
                    l.detach(l.indexOf(t))
                }
            }
            let i = this._adjustIndex(r),
                o = this._lContainer
            return (
                Sp(o, a, i, n), t.attachToViewContainerRef(), rc(Rn(o), i, t), t
            )
        }
        move(t, r) {
            return this.insert(t, r)
        }
        indexOf(t) {
            let r = Ro(this._lContainer)
            return r !== null ? r.indexOf(t) : -1
        }
        remove(t) {
            let r = this._adjustIndex(t, -1),
                n = ur(this._lContainer, r)
            n && (v0(Rn(this._lContainer), r), _s(n[R], n))
        }
        detach(t) {
            let r = this._adjustIndex(t, -1),
                n = ur(this._lContainer, r)
            return n && v0(Rn(this._lContainer), r) != null ? new de(n) : null
        }
        _adjustIndex(t, r = 0) {
            return t ?? this.length + r
        }
    }
function Ro(e) {
    return e[C0]
}
function Rn(e) {
    return e[C0] || (e[C0] = [])
}
function gh(e, t) {
    let r,
        n = t[e.index]
    return (
        a1(n) ? (r = n) : ((r = a8(n, t, null, e)), (t[e.index] = r), J0(t, r)),
        y8(r, t, e, n),
        new C8(r, e, t)
    )
}
function vh(e, t) {
    let r = e[q],
        n = r.createComment(''),
        a = A2(t, e),
        i = o6(r, a)
    return D0(r, i, n, Ud(r, a), !1), n
}
var y8 = z8,
    m6 = () => !1
function Mh(e, t, r) {
    return m6(e, t, r)
}
function z8(e, t, r, n) {
    if (e[p1]) return
    let a
    r.type & 8 ? (a = Y2(n)) : (a = vh(t, r)), (e[p1] = a)
}
function Ch(e, t, r) {
    if (e[p1] && e[T4]) return !0
    let n = r[O2],
        a = t.index - u2
    if (!n || Fu(t) || G0(n, a)) return !1
    let o = nr(n, a),
        c = n.data[Xr]?.[a],
        [s, l] = Yp(o, c)
    return (e[p1] = s), (e[T4] = l), !0
}
function yh(e, t, r, n) {
    m6(e, r, t) || z8(e, t, r, n)
}
function zh() {
    ;(y8 = yh), (m6 = Ch)
}
function U1(e, t) {
    t4('NgSignals')
    let r = wi(e),
        n = r[ke]
    return (
        t?.equal && (n.equal = t.equal),
        (r.set = a => on(n, a)),
        (r.update = a => bi(n, a)),
        (r.asReadonly = Lh.bind(r)),
        r
    )
}
function Lh() {
    let e = this[ke]
    if (e.readonlyFn === void 0) {
        let t = () => this()
        ;(t[ke] = e), (e.readonlyFn = t)
    }
    return e.readonlyFn
}
var P1 = class {},
    O4 = class {}
var wr = class extends P1 {
        constructor(t, r, n) {
            super(),
                (this._parent = r),
                (this._bootstrapComponents = []),
                (this.destroyCbs = []),
                (this.componentFactoryResolver = new T0(this))
            let a = pc(t)
            ;(this._bootstrapComponents = ks(a.bootstrap)),
                (this._r3Injector = as(
                    t,
                    r,
                    [
                        { provide: P1, useValue: this },
                        {
                            provide: rt,
                            useValue: this.componentFactoryResolver,
                        },
                        ...n,
                    ],
                    M2(t),
                    new Set(['environment'])
                )),
                this._r3Injector.resolveInjectorInitializers(),
                (this.instance = this._r3Injector.get(t))
        }
        get injector() {
            return this._r3Injector
        }
        destroy() {
            let t = this._r3Injector
            !t.destroyed && t.destroy(),
                this.destroyCbs.forEach(r => r()),
                (this.destroyCbs = null)
        }
        onDestroy(t) {
            this.destroyCbs.push(t)
        }
    },
    br = class extends O4 {
        constructor(t) {
            super(), (this.moduleType = t)
        }
        create(t) {
            return new wr(this.moduleType, t, [])
        }
    }
var A0 = class extends P1 {
    constructor(t) {
        super(),
            (this.componentFactoryResolver = new T0(this)),
            (this.instance = null)
        let r = new N4(
            [
                ...t.providers,
                { provide: P1, useValue: this },
                { provide: rt, useValue: this.componentFactoryResolver },
            ],
            t.parent || Br(),
            t.debugName,
            new Set(['environment'])
        )
        ;(this.injector = r),
            t.runEnvironmentInitializers && r.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
}
function g6(e, t, r = null) {
    return new A0({
        providers: e,
        parent: t,
        debugName: r,
        runEnvironmentInitializers: !0,
    }).injector
}
var Ce = (() => {
    let t = class t {
        constructor() {
            ;(this.taskId = 0),
                (this.pendingTasks = new Set()),
                (this.hasPendingTasks = new l2(!1))
        }
        get _hasPendingTasks() {
            return this.hasPendingTasks.value
        }
        add() {
            this._hasPendingTasks || this.hasPendingTasks.next(!0)
            let n = this.taskId++
            return this.pendingTasks.add(n), n
        }
        remove(n) {
            this.pendingTasks.delete(n),
                this.pendingTasks.size === 0 &&
                    this._hasPendingTasks &&
                    this.hasPendingTasks.next(!1)
        }
        ngOnDestroy() {
            this.pendingTasks.clear(),
                this._hasPendingTasks && this.hasPendingTasks.next(!1)
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
function L8(e) {
    return bh(e)
        ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
        : !1
}
function wh(e, t) {
    if (Array.isArray(e)) for (let r = 0; r < e.length; r++) t(e[r])
    else {
        let r = e[Symbol.iterator](),
            n
        for (; !(n = r.next()).done; ) t(n.value)
    }
}
function bh(e) {
    return e !== null && (typeof e == 'function' || typeof e == 'object')
}
function Sh(e, t, r) {
    return (e[t] = r)
}
function v1(e, t, r) {
    let n = e[t]
    return Object.is(n, r) ? !1 : ((e[t] = r), !0)
}
function xh(e, t, r, n) {
    let a = v1(e, t, r)
    return v1(e, t + 1, n) || a
}
function Dh(e, t, r, n, a) {
    let i = xh(e, t, r, n)
    return v1(e, t + 2, a) || i
}
function Q4(e) {
    return (e.flags & 32) === 32
}
function Nh(e, t, r, n, a, i, o, c, s) {
    let l = t.consts,
        f = G4(t, e, 4, o || null, z0(l, c))
    t8(t, r, f, z0(l, s)), Yr(t, f)
    let u = (f.tView = f6(
        2,
        f,
        n,
        a,
        i,
        t.directiveRegistry,
        t.pipeRegistry,
        null,
        t.schemas,
        l,
        null
    ))
    return (
        t.queries !== null &&
            (t.queries.template(t, f),
            (u.queries = t.queries.embeddedTView(f))),
        f
    )
}
function ye(e, t, r, n, a, i, o, c) {
    let s = V(),
        l = B2(),
        f = e + u2,
        u = l.firstCreatePass ? Nh(f, l, s, t, r, n, a, i, o) : l.data[f]
    $4(u, !1)
    let d = w8(l, s, u, e)
    Gr() && c6(l, s, d, u), ue(d, s)
    let p = a8(d, s, d, u)
    return (
        (s[f] = p),
        J0(s, p),
        Mh(p, u, s),
        Ur(u) && Zs(l, s, u),
        o != null && Ks(s, u, c),
        ye
    )
}
var w8 = b8
function b8(e, t, r, n) {
    return i1(!0), t[q].createComment('')
}
function Eh(e, t, r, n) {
    let a = t[O2],
        i = !a || Je() || Q4(r) || G0(a, n)
    if ((i1(i), i)) return b8(e, t, r, n)
    let o = a.data[qu]?.[n] ?? null
    o !== null &&
        r.tView !== null &&
        r.tView.ssrId === null &&
        (r.tView.ssrId = o)
    let c = tt(a, e, t, r)
    q0(a, n, c)
    let s = e6(a, n)
    return nt(s, c)
}
function Ih() {
    w8 = Eh
}
function at(e, t, r, n) {
    let a = V(),
        i = H0()
    if (v1(a, i, t)) {
        let o = B2(),
            c = qr()
        mp(c, a, e, t, r, n)
    }
    return at
}
function Th(e, t, r, n) {
    return v1(e, H0(), r) ? t + ae(r) + n : L1
}
function Ah(e, t, r, n, a, i, o, c) {
    let s = lu(),
        l = Dh(e, s, r, a, o)
    return Oc(3), l ? t + ae(r) + n + ae(a) + i + ae(o) + c : L1
}
function s0(e, t) {
    return (e << 17) | (t << 2)
}
function pe(e) {
    return (e >> 17) & 32767
}
function kh(e) {
    return (e & 2) == 2
}
function Rh(e, t) {
    return (e & 131071) | (t << 17)
}
function Sr(e) {
    return e | 2
}
function Ke(e) {
    return (e & 131068) >> 2
}
function Pn(e, t) {
    return (e & -131069) | (t << 2)
}
function Ph(e) {
    return (e & 1) === 1
}
function xr(e) {
    return e | 1
}
function _h(e, t, r, n, a, i) {
    let o = i ? t.classBindings : t.styleBindings,
        c = pe(o),
        s = Ke(o)
    e[n] = r
    let l = !1,
        f
    if (Array.isArray(r)) {
        let u = r
        ;(f = u[1]), (f === null || U4(u, f) > 0) && (l = !0)
    } else f = r
    if (a)
        if (s !== 0) {
            let d = pe(e[c + 1])
            ;(e[n + 1] = s0(d, c)),
                d !== 0 && (e[d + 1] = Pn(e[d + 1], n)),
                (e[c + 1] = Rh(e[c + 1], n))
        } else
            (e[n + 1] = s0(c, 0)),
                c !== 0 && (e[c + 1] = Pn(e[c + 1], n)),
                (c = n)
    else
        (e[n + 1] = s0(s, 0)),
            c === 0 ? (c = n) : (e[s + 1] = Pn(e[s + 1], n)),
            (s = n)
    l && (e[n + 1] = Sr(e[n + 1])),
        Po(e, f, n, !0),
        Po(e, f, n, !1),
        Fh(t, f, e, n, i),
        (o = s0(c, s)),
        i ? (t.classBindings = o) : (t.styleBindings = o)
}
function Fh(e, t, r, n, a) {
    let i = a ? e.residualClasses : e.residualStyles
    i != null &&
        typeof t == 'string' &&
        U4(i, t) >= 0 &&
        (r[n + 1] = xr(r[n + 1]))
}
function Po(e, t, r, n) {
    let a = e[r + 1],
        i = t === null,
        o = n ? pe(a) : Ke(a),
        c = !1
    for (; o !== 0 && (c === !1 || i); ) {
        let s = e[o],
            l = e[o + 1]
        Oh(s, t) && ((c = !0), (e[o + 1] = n ? xr(l) : Sr(l))),
            (o = n ? pe(l) : Ke(l))
    }
    c && (e[r + 1] = n ? Sr(a) : xr(a))
}
function Oh(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
        ? !0
        : Array.isArray(e) && typeof t == 'string'
        ? U4(e, t) >= 0
        : !1
}
function K2(e, t, r) {
    let n = V(),
        a = H0()
    if (v1(n, a, t)) {
        let i = B2(),
            o = qr()
        e8(i, o, n, e, t, n[q], r, !1)
    }
    return K2
}
function _o(e, t, r, n, a) {
    let i = t.inputs,
        o = a ? 'class' : 'style'
    u6(e, r, i[o], o, n)
}
function r4(e, t) {
    return Bh(e, t, null, !0), r4
}
function Bh(e, t, r, n) {
    let a = V(),
        i = B2(),
        o = Oc(2)
    if ((i.firstUpdatePass && Uh(i, e, o, n), t !== L1 && v1(a, o, t))) {
        let c = i.data[me()]
        qh(i, c, a, a[q], e, (a[o + 1] = Gh(t, r)), n, o)
    }
}
function jh(e, t) {
    return t >= e.expandoStartIndex
}
function Uh(e, t, r, n) {
    let a = e.data
    if (a[r + 1] === null) {
        let i = a[me()],
            o = jh(e, r)
        Yh(i, n) && t === null && !o && (t = !1),
            (t = Hh(a, i, t, n)),
            _h(a, i, t, r, o, n)
    }
}
function Hh(e, t, r, n) {
    let a = hu(e),
        i = n ? t.residualClasses : t.residualStyles
    if (a === null)
        (n ? t.classBindings : t.styleBindings) === 0 &&
            ((r = _n(null, e, t, r, n)), (r = B4(r, t.attrs, n)), (i = null))
    else {
        let o = t.directiveStylingLast
        if (o === -1 || e[o] !== a)
            if (((r = _n(a, e, t, r, n)), i === null)) {
                let s = Vh(e, t, n)
                s !== void 0 &&
                    Array.isArray(s) &&
                    ((s = _n(null, e, t, s[1], n)),
                    (s = B4(s, t.attrs, n)),
                    $h(e, t, n, s))
            } else i = Wh(e, t, n)
    }
    return (
        i !== void 0 && (n ? (t.residualClasses = i) : (t.residualStyles = i)),
        r
    )
}
function Vh(e, t, r) {
    let n = r ? t.classBindings : t.styleBindings
    if (Ke(n) !== 0) return e[pe(n)]
}
function $h(e, t, r, n) {
    let a = r ? t.classBindings : t.styleBindings
    e[pe(a)] = n
}
function Wh(e, t, r) {
    let n,
        a = t.directiveEnd
    for (let i = 1 + t.directiveStylingLast; i < a; i++) {
        let o = e[i].hostAttrs
        n = B4(n, o, r)
    }
    return B4(n, t.attrs, r)
}
function _n(e, t, r, n, a) {
    let i = null,
        o = r.directiveEnd,
        c = r.directiveStylingLast
    for (
        c === -1 ? (c = r.directiveStart) : c++;
        c < o && ((i = t[c]), (n = B4(n, i.hostAttrs, a)), i !== e);

    )
        c++
    return e !== null && (r.directiveStylingLast = c), n
}
function B4(e, t, r) {
    let n = r ? 1 : 2,
        a = -1
    if (t !== null)
        for (let i = 0; i < t.length; i++) {
            let o = t[i]
            typeof o == 'number'
                ? (a = o)
                : a === n &&
                  (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]),
                  uf(e, o, r ? !0 : t[++i]))
        }
    return e === void 0 ? null : e
}
function qh(e, t, r, n, a, i, o, c) {
    if (!(t.type & 3)) return
    let s = e.data,
        l = s[c + 1],
        f = Ph(l) ? Fo(s, t, r, a, Ke(l), o) : void 0
    if (!k0(f)) {
        k0(i) || (kh(l) && (i = Fo(s, null, r, a, c, o)))
        let u = Dc(me(), r)
        qd(n, o, u, a, i)
    }
}
function Fo(e, t, r, n, a, i) {
    let o = t === null,
        c
    for (; a > 0; ) {
        let s = e[a],
            l = Array.isArray(s),
            f = l ? s[1] : s,
            u = f === null,
            d = r[a + 1]
        d === L1 && (d = u ? F2 : void 0)
        let p = u ? wn(d, n) : f === n ? d : void 0
        if ((l && !k0(p) && (p = wn(s, n)), k0(p) && ((c = p), o))) return c
        let m = e[a + 1]
        a = o ? pe(m) : Ke(m)
    }
    if (t !== null) {
        let s = i ? t.residualClasses : t.residualStyles
        s != null && (c = wn(s, n))
    }
    return c
}
function k0(e) {
    return e !== void 0
}
function Gh(e, t) {
    return (
        e == null ||
            e === '' ||
            (typeof t == 'string'
                ? (e = e + t)
                : typeof e == 'object' && (e = M2(C1(e)))),
        e
    )
}
function Yh(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0
}
function Qh(e, t, r, n, a, i) {
    let o = t.consts,
        c = z0(o, a),
        s = G4(t, e, 2, n, c)
    return (
        t8(t, r, s, z0(o, i)),
        s.attrs !== null && yr(s, s.attrs, !1),
        s.mergedAttrs !== null && yr(s, s.mergedAttrs, !0),
        t.queries !== null && t.queries.elementStart(t, s),
        s
    )
}
function W(e, t, r, n) {
    let a = V(),
        i = B2(),
        o = u2 + e,
        c = a[q],
        s = i.firstCreatePass ? Qh(o, i, a, t, r, n) : i.data[o],
        l = S8(i, a, s, c, t, e)
    a[o] = l
    let f = Ur(s)
    return (
        $4(s, !0),
        $s(c, l, s),
        !Q4(s) && Gr() && c6(i, a, l, s),
        eu() === 0 && ue(l, a),
        tu(),
        f && (Zs(i, a, s), Qs(i, s, a)),
        n !== null && Ks(a, s),
        W
    )
}
function G() {
    let e = Q2()
    _c() ? Fc() : ((e = e.parent), $4(e, !1))
    let t = e
    ru(t) && iu(), nu()
    let r = B2()
    return (
        r.firstCreatePass && (Yr(r, e), zc(e) && r.queries.elementEnd(e)),
        t.classesWithoutHost != null &&
            yu(t) &&
            _o(r, t, V(), t.classesWithoutHost, !0),
        t.stylesWithoutHost != null &&
            zu(t) &&
            _o(r, t, V(), t.stylesWithoutHost, !1),
        G
    )
}
function o1(e, t, r, n) {
    return W(e, t, r, n), G(), o1
}
var S8 = (e, t, r, n, a, i) => (i1(!0), Z0(n, a, Wc()))
function Zh(e, t, r, n, a, i) {
    let o = t[O2],
        c = !o || Je() || Q4(r) || G0(o, i)
    if ((i1(c), c)) return Z0(n, a, Wc())
    let s = tt(o, e, t, r)
    return (
        Cs(o, i) && q0(o, i, s.nextSibling),
        o && (cs(r) || ss(s)) && H4(r) && (au(r), Us(s)),
        s
    )
}
function Kh() {
    S8 = Zh
}
var Xh = (e, t, r, n) => (i1(!0), i6(t[q], ''))
function Jh(e, t, r, n) {
    let a,
        i = t[O2],
        o = !i || Je() || Q4(r)
    if ((i1(o), o)) return i6(t[q], '')
    let c = tt(i, e, t, r),
        s = rd(i, n)
    return q0(i, n, c), (a = nt(s, c)), a
}
function em() {
    Xh = Jh
}
function x8() {
    return V()
}
function v6(e, t, r) {
    let n = V(),
        a = H0()
    if (v1(n, a, t)) {
        let i = B2(),
            o = qr()
        e8(i, o, n, e, t, n[q], r, !0)
    }
    return v6
}
var re = void 0
function tm(e) {
    let t = e,
        r = Math.floor(Math.abs(e)),
        n = e.toString().replace(/^[^.]*\.?/, '').length
    return r === 1 && n === 0 ? 1 : 5
}
var nm = [
        'en',
        [['a', 'p'], ['AM', 'PM'], re],
        [['AM', 'PM'], re, re],
        [
            ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ],
            ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        ],
        re,
        [
            ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
        ],
        re,
        [
            ['B', 'A'],
            ['BC', 'AD'],
            ['Before Christ', 'Anno Domini'],
        ],
        0,
        [6, 0],
        ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
        ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
        ['{1}, {0}', re, "{1} 'at' {0}", re],
        [
            '.',
            ',',
            ';',
            '%',
            '+',
            '-',
            'E',
            '\xD7',
            '\u2030',
            '\u221E',
            'NaN',
            ':',
        ],
        ['#,##0.###', '#,##0%', '\xA4#,##0.00', '#E0'],
        'USD',
        '$',
        'US Dollar',
        {},
        'ltr',
        tm,
    ],
    Fn = {}
function it(e) {
    let t = rm(e),
        r = Oo(t)
    if (r) return r
    let n = t.split('-')[0]
    if (((r = Oo(n)), r)) return r
    if (n === 'en') return nm
    throw new w(701, !1)
}
function Oo(e) {
    return (
        e in Fn ||
            (Fn[e] =
                D2.ng &&
                D2.ng.common &&
                D2.ng.common.locales &&
                D2.ng.common.locales[e]),
        Fn[e]
    )
}
var ze = (function (e) {
    return (
        (e[(e.LocaleId = 0)] = 'LocaleId'),
        (e[(e.DayPeriodsFormat = 1)] = 'DayPeriodsFormat'),
        (e[(e.DayPeriodsStandalone = 2)] = 'DayPeriodsStandalone'),
        (e[(e.DaysFormat = 3)] = 'DaysFormat'),
        (e[(e.DaysStandalone = 4)] = 'DaysStandalone'),
        (e[(e.MonthsFormat = 5)] = 'MonthsFormat'),
        (e[(e.MonthsStandalone = 6)] = 'MonthsStandalone'),
        (e[(e.Eras = 7)] = 'Eras'),
        (e[(e.FirstDayOfWeek = 8)] = 'FirstDayOfWeek'),
        (e[(e.WeekendRange = 9)] = 'WeekendRange'),
        (e[(e.DateFormat = 10)] = 'DateFormat'),
        (e[(e.TimeFormat = 11)] = 'TimeFormat'),
        (e[(e.DateTimeFormat = 12)] = 'DateTimeFormat'),
        (e[(e.NumberSymbols = 13)] = 'NumberSymbols'),
        (e[(e.NumberFormats = 14)] = 'NumberFormats'),
        (e[(e.CurrencyCode = 15)] = 'CurrencyCode'),
        (e[(e.CurrencySymbol = 16)] = 'CurrencySymbol'),
        (e[(e.CurrencyName = 17)] = 'CurrencyName'),
        (e[(e.Currencies = 18)] = 'Currencies'),
        (e[(e.Directionality = 19)] = 'Directionality'),
        (e[(e.PluralCase = 20)] = 'PluralCase'),
        (e[(e.ExtraData = 21)] = 'ExtraData'),
        e
    )
})(ze || {})
function rm(e) {
    return e.toLowerCase().replace(/_/g, '-')
}
var R0 = 'en-US',
    am = 'USD'
var im = R0
function om(e) {
    typeof e == 'string' && (im = e.toLowerCase().replace(/_/g, '-'))
}
function D8(e, t, r) {
    let n = e[q]
    switch (r) {
        case Node.COMMENT_NODE:
            return i6(n, t)
        case Node.TEXT_NODE:
            return a6(n, t)
        case Node.ELEMENT_NODE:
            return Z0(n, t, null)
    }
}
var cm = (e, t, r, n) => (i1(!0), D8(e, r, n))
function sm(e, t, r, n) {
    return i1(!0), D8(e, r, n)
}
function lm() {
    cm = sm
}
function H1(e, t, r, n) {
    let a = V(),
        i = B2(),
        o = Q2()
    return um(i, a, a[q], o, e, t, n), H1
}
function fm(e, t, r, n) {
    let a = e.cleanup
    if (a != null)
        for (let i = 0; i < a.length - 1; i += 2) {
            let o = a[i]
            if (o === r && a[i + 1] === n) {
                let c = t[E4],
                    s = a[i + 2]
                return c.length > s ? c[s] : null
            }
            typeof o == 'string' && (i += 2)
        }
    return null
}
function um(e, t, r, n, a, i, o) {
    let c = Ur(n),
        l = e.firstCreatePass && yp(e),
        f = t[q2],
        u = Cp(t),
        d = !0
    if (n.type & 3 || o) {
        let v = A2(n, t),
            C = o ? o(v) : v,
            M = u.length,
            E = o ? P => o(Y2(P[n.index])) : n.index,
            F = null
        if ((!o && c && (F = fm(e, t, a, n.index)), F !== null)) {
            let P = F.__ngLastListenerFn__ || F
            ;(P.__ngNextListenerFn__ = i),
                (F.__ngLastListenerFn__ = i),
                (d = !1)
        } else {
            i = jo(n, t, f, i, !1)
            let P = r.listen(C, a, i)
            u.push(i, P), l && l.push(a, E, M, M + 1)
        }
    } else i = jo(n, t, f, i, !1)
    let p = n.outputs,
        m
    if (d && p !== null && (m = p[a])) {
        let v = m.length
        if (v)
            for (let C = 0; C < v; C += 2) {
                let M = m[C],
                    E = m[C + 1],
                    Q = t[M][E].subscribe(i),
                    s2 = u.length
                u.push(i, Q), l && l.push(a, n.index, s2, -(s2 + 1))
            }
    }
}
function Bo(e, t, r, n) {
    let a = j(null)
    try {
        return t1(6, t, r), r(n) !== !1
    } catch (i) {
        return o8(e, i), !1
    } finally {
        t1(7, t, r), j(a)
    }
}
function jo(e, t, r, n, a) {
    return function i(o) {
        if (o === Function) return n
        let c = e.componentOffset > -1 ? j1(e.index, t) : t
        p6(c)
        let s = Bo(t, r, n, o),
            l = i.__ngNextListenerFn__
        for (; l; ) (s = Bo(t, r, l, o) && s), (l = l.__ngNextListenerFn__)
        return a && s === !1 && o.preventDefault(), s
    }
}
function Z4(e = 1) {
    return gu(e)
}
function dm(e, t) {
    let r = null,
        n = yf(e)
    for (let a = 0; a < t.length; a++) {
        let i = t[a]
        if (i === '*') {
            r = a
            continue
        }
        if (n === null ? sc(e, i, !0) : wf(n, i)) return a
    }
    return r
}
function ot(e) {
    let t = V()[I2][T2]
    if (!t.projection) {
        let r = e ? e.length : 1,
            n = (t.projection = lf(r, null)),
            a = n.slice(),
            i = t.child
        for (; i !== null; ) {
            let o = e ? dm(i, e) : 0
            o !== null &&
                (a[o] ? (a[o].projectionNext = i) : (n[o] = i), (a[o] = i)),
                (i = i.next)
        }
    }
}
function ct(e, t = 0, r) {
    let n = V(),
        a = B2(),
        i = G4(a, u2 + e, 16, null, r || null)
    i.projection === null && (i.projection = t),
        Fc(),
        (!n[O2] || Je()) && (i.flags & 32) !== 32 && $d(a, n, i)
}
function pm(e, t, r, n) {
    r >= e.data.length && ((e.data[r] = null), (e.blueprint[r] = null)),
        (t[r] = n)
}
function N8(e) {
    let t = cu()
    return Ec(t, u2 + e)
}
function h2(e, t = '') {
    let r = V(),
        n = B2(),
        a = e + u2,
        i = n.firstCreatePass ? G4(n, a, 1, t, null) : n.data[a],
        o = E8(n, r, i, t, e)
    ;(r[a] = o), Gr() && c6(n, r, o, i), $4(i, !1)
}
var E8 = (e, t, r, n, a) => (i1(!0), a6(t[q], n))
function hm(e, t, r, n, a) {
    let i = t[O2],
        o = !i || Je() || Q4(r) || G0(i, a)
    return i1(o), o ? a6(t[q], n) : tt(i, e, t, r)
}
function mm() {
    E8 = hm
}
function Le(e) {
    return st('', e, ''), Le
}
function st(e, t, r) {
    let n = V(),
        a = Th(n, e, t, r)
    return a !== L1 && c8(n, me(), a), st
}
function M6(e, t, r, n, a, i, o) {
    let c = V(),
        s = Ah(c, e, t, r, n, a, i, o)
    return s !== L1 && c8(c, me(), s), M6
}
var gm = (() => {
    let t = class t {
        constructor(n) {
            ;(this._injector = n), (this.cachedInjectors = new Map())
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null
            if (!this.cachedInjectors.has(n)) {
                let a = gc(!1, n.type),
                    i =
                        a.length > 0
                            ? g6(
                                  [a],
                                  this._injector,
                                  `Standalone[${n.type.name}]`
                              )
                            : null
                this.cachedInjectors.set(n, i)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values())
                    n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
    }
    t.ɵprov = y({
        token: t,
        providedIn: 'environment',
        factory: () => new t(D(L2)),
    })
    let e = t
    return e
})()
function t2(e) {
    t4('NgStandalone'),
        (e.getStandaloneInjector = t =>
            t.get(gm).getOrCreateStandaloneInjector(e))
}
function vm(e, t) {
    let r = e[t]
    return r === L1 ? void 0 : r
}
function Mm(e, t, r, n, a, i) {
    let o = t + r
    return v1(e, o, a) ? Sh(e, o + 1, i ? n.call(i, a) : n(a)) : vm(e, o + 1)
}
function I8(e, t) {
    let r = B2(),
        n,
        a = e + u2
    r.firstCreatePass
        ? ((n = Cm(t, r.pipeRegistry)),
          (r.data[a] = n),
          n.onDestroy && (r.destroyHooks ??= []).push(a, n.onDestroy))
        : (n = r.data[a])
    let i = n.factory || (n.factory = oe(n.type, !0)),
        o,
        c = z2(Z)
    try {
        let s = b0(!1),
            l = i()
        return b0(s), pm(r, V(), a, l), l
    } finally {
        z2(c)
    }
}
function Cm(e, t) {
    if (t)
        for (let r = t.length - 1; r >= 0; r--) {
            let n = t[r]
            if (e === n.name) return n
        }
}
function T8(e, t, r) {
    let n = e + u2,
        a = V(),
        i = Ec(a, n)
    return ym(a, n) ? Mm(a, su(), t, i.transform, r, i) : i.transform(r)
}
function ym(e, t) {
    return e[R].data[t].pure
}
function A8(e, t) {
    return h8(e, t)
}
var lt = (() => {
    let t = class t {
        log(n) {
            console.log(n)
        }
        warn(n) {
            console.warn(n)
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'platform' }))
    let e = t
    return e
})()
var k8 = new b('')
function K4(e) {
    return !!e && typeof e.then == 'function'
}
function R8(e) {
    return !!e && typeof e.subscribe == 'function'
}
var P8 = new b(''),
    _8 = (() => {
        let t = class t {
            constructor() {
                ;(this.initialized = !1),
                    (this.done = !1),
                    (this.donePromise = new Promise((n, a) => {
                        ;(this.resolve = n), (this.reject = a)
                    })),
                    (this.appInits = g(P8, { optional: !0 }) ?? [])
            }
            runInitializers() {
                if (this.initialized) return
                let n = []
                for (let i of this.appInits) {
                    let o = i()
                    if (K4(o)) n.push(o)
                    else if (R8(o)) {
                        let c = new Promise((s, l) => {
                            o.subscribe({ complete: s, error: l })
                        })
                        n.push(c)
                    }
                }
                let a = () => {
                    ;(this.done = !0), this.resolve()
                }
                Promise.all(n)
                    .then(() => {
                        a()
                    })
                    .catch(i => {
                        this.reject(i)
                    }),
                    n.length === 0 && a(),
                    (this.initialized = !0)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    a4 = new b('')
function zm() {
    Li(() => {
        throw new w(600, !1)
    })
}
function Lm(e) {
    return e.isBoundToModule
}
function wm(e, t, r) {
    try {
        let n = r()
        return K4(n)
            ? n.catch(a => {
                  throw (t.runOutsideAngular(() => e.handleError(a)), a)
              })
            : n
    } catch (n) {
        throw (t.runOutsideAngular(() => e.handleError(n)), n)
    }
}
var V1 = (() => {
    let t = class t {
        constructor() {
            ;(this._bootstrapListeners = []),
                (this._runningTick = !1),
                (this._destroyed = !1),
                (this._destroyListeners = []),
                (this._views = []),
                (this.internalErrorHandler = g(is)),
                (this.afterRenderEffectManager = g(M8)),
                (this.externalTestViews = new Set()),
                (this.beforeRender = new v2()),
                (this.afterTick = new v2()),
                (this.componentTypes = []),
                (this.components = []),
                (this.isStable = g(Ce).hasPendingTasks.pipe(A(n => !n))),
                (this._injector = g(L2))
        }
        get destroyed() {
            return this._destroyed
        }
        get injector() {
            return this._injector
        }
        bootstrap(n, a) {
            let i = n instanceof I0
            if (!this._injector.get(_8).done) {
                let p = !i && dc(n),
                    m = !1
                throw new w(405, m)
            }
            let c
            i
                ? (c = n)
                : (c = this._injector.get(rt).resolveComponentFactory(n)),
                this.componentTypes.push(c.componentType)
            let s = Lm(c) ? void 0 : this._injector.get(P1),
                l = a || c.selector,
                f = c.create(ge.NULL, [], l, s),
                u = f.location.nativeElement,
                d = f.injector.get(k8, null)
            return (
                d?.registerApplication(u),
                f.onDestroy(() => {
                    this.detachView(f.hostView),
                        On(this.components, f),
                        d?.unregisterApplication(u)
                }),
                this._loadComponent(f),
                f
            )
        }
        tick() {
            this._tick(!0)
        }
        _tick(n) {
            if (this._runningTick) throw new w(101, !1)
            let a = j(null)
            try {
                ;(this._runningTick = !0), this.detectChangesInAttachedViews(n)
            } catch (i) {
                this.internalErrorHandler(i)
            } finally {
                this.afterTick.next(), (this._runningTick = !1), j(a)
            }
        }
        detectChangesInAttachedViews(n) {
            let a = 0,
                i = this.afterRenderEffectManager
            for (;;) {
                if (a === l8) throw new w(103, !1)
                if (n) {
                    let o = a === 0
                    this.beforeRender.next(o)
                    for (let { _lView: c, notifyErrorHandler: s } of this
                        ._views)
                        bm(c, o, s)
                }
                if (
                    (a++,
                    i.executeInternalCallbacks(),
                    ![...this.externalTestViews.keys(), ...this._views].some(
                        ({ _lView: o }) => Dr(o)
                    ) &&
                        (i.execute(),
                        ![
                            ...this.externalTestViews.keys(),
                            ...this._views,
                        ].some(({ _lView: o }) => Dr(o))))
                )
                    break
            }
        }
        attachView(n) {
            let a = n
            this._views.push(a), a.attachToAppRef(this)
        }
        detachView(n) {
            let a = n
            On(this._views, a), a.detachFromAppRef()
        }
        _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n)
            let a = this._injector.get(a4, [])
            ;[...this._bootstrapListeners, ...a].forEach(i => i(n))
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    this._destroyListeners.forEach(n => n()),
                        this._views.slice().forEach(n => n.destroy())
                } finally {
                    ;(this._destroyed = !0),
                        (this._views = []),
                        (this._bootstrapListeners = []),
                        (this._destroyListeners = [])
                }
        }
        onDestroy(n) {
            return (
                this._destroyListeners.push(n),
                () => On(this._destroyListeners, n)
            )
        }
        destroy() {
            if (this._destroyed) throw new w(406, !1)
            let n = this._injector
            n.destroy && !n.destroyed && n.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        warnIfDestroyed() {}
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
function On(e, t) {
    let r = e.indexOf(t)
    r > -1 && e.splice(r, 1)
}
var l0
function C6(e) {
    l0 ??= new WeakMap()
    let t = l0.get(e)
    if (t) return t
    let r = e.isStable
        .pipe(H2(n => n))
        .toPromise()
        .then(() => {})
    return l0.set(e, r), e.onDestroy(() => l0?.delete(e)), r
}
function bm(e, t, r) {
    ;(!t && !Dr(e)) || Sm(e, r, t)
}
function Dr(e) {
    return Vr(e)
}
function Sm(e, t, r) {
    let n
    r ? ((n = 0), (e[x] |= 1024)) : e[x] & 64 ? (n = 0) : (n = 1), f8(e, t, n)
}
var Nr = class {
        constructor(t, r) {
            ;(this.ngModuleFactory = t), (this.componentFactories = r)
        }
    },
    y6 = (() => {
        let t = class t {
            compileModuleSync(n) {
                return new br(n)
            }
            compileModuleAsync(n) {
                return Promise.resolve(this.compileModuleSync(n))
            }
            compileModuleAndAllComponentsSync(n) {
                let a = this.compileModuleSync(n),
                    i = pc(n),
                    o = ks(i.declarations).reduce((c, s) => {
                        let l = se(s)
                        return l && c.push(new F4(l)), c
                    }, [])
                return new Nr(a, o)
            }
            compileModuleAndAllComponentsAsync(n) {
                return Promise.resolve(
                    this.compileModuleAndAllComponentsSync(n)
                )
            }
            clearCache() {}
            clearCacheFor(n) {}
            getModuleId(n) {}
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })()
var xm = (() => {
    let t = class t {
        constructor() {
            ;(this.zone = g(J)), (this.applicationRef = g(V1))
        }
        initialize() {
            this._onMicrotaskEmptySubscription ||
                (this._onMicrotaskEmptySubscription =
                    this.zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this.zone.run(() => {
                                this.applicationRef.tick()
                            })
                        },
                    }))
        }
        ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe()
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
function Dm(e) {
    return [
        { provide: J, useFactory: e },
        {
            provide: ce,
            multi: !0,
            useFactory: () => {
                let t = g(xm, { optional: !0 })
                return () => t.initialize()
            },
        },
        {
            provide: ce,
            multi: !0,
            useFactory: () => {
                let t = g(Tm)
                return () => {
                    t.initialize()
                }
            },
        },
        { provide: is, useFactory: Nm },
    ]
}
function Nm() {
    let e = g(J),
        t = g(h1)
    return r => e.runOutsideAngular(() => t.handleError(r))
}
function Em(e) {
    let t = Dm(() => new J(Im(e)))
    return O1([[], t])
}
function Im(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
    }
}
var Tm = (() => {
    let t = class t {
        constructor() {
            ;(this.subscription = new n2()),
                (this.initialized = !1),
                (this.zone = g(J)),
                (this.pendingTasks = g(Ce))
        }
        initialize() {
            if (this.initialized) return
            this.initialized = !0
            let n = null
            !this.zone.isStable &&
                !this.zone.hasPendingMacrotasks &&
                !this.zone.hasPendingMicrotasks &&
                (n = this.pendingTasks.add()),
                this.zone.runOutsideAngular(() => {
                    this.subscription.add(
                        this.zone.onStable.subscribe(() => {
                            J.assertNotInAngularZone(),
                                queueMicrotask(() => {
                                    n !== null &&
                                        !this.zone.hasPendingMacrotasks &&
                                        !this.zone.hasPendingMicrotasks &&
                                        (this.pendingTasks.remove(n),
                                        (n = null))
                                })
                        })
                    )
                }),
                this.subscription.add(
                    this.zone.onUnstable.subscribe(() => {
                        J.assertInAngularZone(), (n ??= this.pendingTasks.add())
                    })
                )
        }
        ngOnDestroy() {
            this.subscription.unsubscribe()
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
function Am() {
    return (typeof $localize < 'u' && $localize.locale) || R0
}
var ft = new b('', {
        providedIn: 'root',
        factory: () => g(ft, k.Optional | k.SkipSelf) || Am(),
    }),
    F8 = new b('', { providedIn: 'root', factory: () => am })
var O8 = new b('')
var h0 = null
function km(e = [], t) {
    return ge.create({
        name: t,
        providers: [
            { provide: B0, useValue: 'platform' },
            { provide: O8, useValue: new Set([() => (h0 = null)]) },
            ...e,
        ],
    })
}
function Rm(e = []) {
    if (h0) return h0
    let t = km(e)
    return (h0 = t), zm(), Pm(t), t
}
function Pm(e) {
    e.get(Zr, null)?.forEach(r => r())
}
var X4 = (() => {
    let t = class t {}
    t.__NG_ELEMENT_ID__ = _m
    let e = t
    return e
})()
function _m(e) {
    return Fm(Q2(), V(), (e & 16) === 16)
}
function Fm(e, t, r) {
    if (H4(e) && !r) {
        let n = j1(e.index, t)
        return new de(n, n)
    } else if (e.type & 47) {
        let n = t[I2]
        return new de(n, t)
    }
    return null
}
var Er = class {
        constructor() {}
        supports(t) {
            return L8(t)
        }
        create(t) {
            return new Ir(t)
        }
    },
    Om = (e, t) => t,
    Ir = class {
        constructor(t) {
            ;(this.length = 0),
                (this._linkedRecords = null),
                (this._unlinkedRecords = null),
                (this._previousItHead = null),
                (this._itHead = null),
                (this._itTail = null),
                (this._additionsHead = null),
                (this._additionsTail = null),
                (this._movesHead = null),
                (this._movesTail = null),
                (this._removalsHead = null),
                (this._removalsTail = null),
                (this._identityChangesHead = null),
                (this._identityChangesTail = null),
                (this._trackByFn = t || Om)
        }
        forEachItem(t) {
            let r
            for (r = this._itHead; r !== null; r = r._next) t(r)
        }
        forEachOperation(t) {
            let r = this._itHead,
                n = this._removalsHead,
                a = 0,
                i = null
            for (; r || n; ) {
                let o = !n || (r && r.currentIndex < Uo(n, a, i)) ? r : n,
                    c = Uo(o, a, i),
                    s = o.currentIndex
                if (o === n) a--, (n = n._nextRemoved)
                else if (((r = r._next), o.previousIndex == null)) a++
                else {
                    i || (i = [])
                    let l = c - a,
                        f = s - a
                    if (l != f) {
                        for (let d = 0; d < l; d++) {
                            let p = d < i.length ? i[d] : (i[d] = 0),
                                m = p + d
                            f <= m && m < l && (i[d] = p + 1)
                        }
                        let u = o.previousIndex
                        i[u] = f - l
                    }
                }
                c !== s && t(o, c, s)
            }
        }
        forEachPreviousItem(t) {
            let r
            for (r = this._previousItHead; r !== null; r = r._nextPrevious) t(r)
        }
        forEachAddedItem(t) {
            let r
            for (r = this._additionsHead; r !== null; r = r._nextAdded) t(r)
        }
        forEachMovedItem(t) {
            let r
            for (r = this._movesHead; r !== null; r = r._nextMoved) t(r)
        }
        forEachRemovedItem(t) {
            let r
            for (r = this._removalsHead; r !== null; r = r._nextRemoved) t(r)
        }
        forEachIdentityChange(t) {
            let r
            for (
                r = this._identityChangesHead;
                r !== null;
                r = r._nextIdentityChange
            )
                t(r)
        }
        diff(t) {
            if ((t == null && (t = []), !L8(t))) throw new w(900, !1)
            return this.check(t) ? this : null
        }
        onDestroy() {}
        check(t) {
            this._reset()
            let r = this._itHead,
                n = !1,
                a,
                i,
                o
            if (Array.isArray(t)) {
                this.length = t.length
                for (let c = 0; c < this.length; c++)
                    (i = t[c]),
                        (o = this._trackByFn(c, i)),
                        r === null || !Object.is(r.trackById, o)
                            ? ((r = this._mismatch(r, i, o, c)), (n = !0))
                            : (n && (r = this._verifyReinsertion(r, i, o, c)),
                              Object.is(r.item, i) ||
                                  this._addIdentityChange(r, i)),
                        (r = r._next)
            } else
                (a = 0),
                    wh(t, c => {
                        ;(o = this._trackByFn(a, c)),
                            r === null || !Object.is(r.trackById, o)
                                ? ((r = this._mismatch(r, c, o, a)), (n = !0))
                                : (n &&
                                      (r = this._verifyReinsertion(r, c, o, a)),
                                  Object.is(r.item, c) ||
                                      this._addIdentityChange(r, c)),
                            (r = r._next),
                            a++
                    }),
                    (this.length = a)
            return this._truncate(r), (this.collection = t), this.isDirty
        }
        get isDirty() {
            return (
                this._additionsHead !== null ||
                this._movesHead !== null ||
                this._removalsHead !== null ||
                this._identityChangesHead !== null
            )
        }
        _reset() {
            if (this.isDirty) {
                let t
                for (
                    t = this._previousItHead = this._itHead;
                    t !== null;
                    t = t._next
                )
                    t._nextPrevious = t._next
                for (t = this._additionsHead; t !== null; t = t._nextAdded)
                    t.previousIndex = t.currentIndex
                for (
                    this._additionsHead = this._additionsTail = null,
                        t = this._movesHead;
                    t !== null;
                    t = t._nextMoved
                )
                    t.previousIndex = t.currentIndex
                ;(this._movesHead = this._movesTail = null),
                    (this._removalsHead = this._removalsTail = null),
                    (this._identityChangesHead = this._identityChangesTail =
                        null)
            }
        }
        _mismatch(t, r, n, a) {
            let i
            return (
                t === null
                    ? (i = this._itTail)
                    : ((i = t._prev), this._remove(t)),
                (t =
                    this._unlinkedRecords === null
                        ? null
                        : this._unlinkedRecords.get(n, null)),
                t !== null
                    ? (Object.is(t.item, r) || this._addIdentityChange(t, r),
                      this._reinsertAfter(t, i, a))
                    : ((t =
                          this._linkedRecords === null
                              ? null
                              : this._linkedRecords.get(n, a)),
                      t !== null
                          ? (Object.is(t.item, r) ||
                                this._addIdentityChange(t, r),
                            this._moveAfter(t, i, a))
                          : (t = this._addAfter(new Tr(r, n), i, a))),
                t
            )
        }
        _verifyReinsertion(t, r, n, a) {
            let i =
                this._unlinkedRecords === null
                    ? null
                    : this._unlinkedRecords.get(n, null)
            return (
                i !== null
                    ? (t = this._reinsertAfter(i, t._prev, a))
                    : t.currentIndex != a &&
                      ((t.currentIndex = a), this._addToMoves(t, a)),
                t
            )
        }
        _truncate(t) {
            for (; t !== null; ) {
                let r = t._next
                this._addToRemovals(this._unlink(t)), (t = r)
            }
            this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
                this._additionsTail !== null &&
                    (this._additionsTail._nextAdded = null),
                this._movesTail !== null && (this._movesTail._nextMoved = null),
                this._itTail !== null && (this._itTail._next = null),
                this._removalsTail !== null &&
                    (this._removalsTail._nextRemoved = null),
                this._identityChangesTail !== null &&
                    (this._identityChangesTail._nextIdentityChange = null)
        }
        _reinsertAfter(t, r, n) {
            this._unlinkedRecords !== null && this._unlinkedRecords.remove(t)
            let a = t._prevRemoved,
                i = t._nextRemoved
            return (
                a === null ? (this._removalsHead = i) : (a._nextRemoved = i),
                i === null ? (this._removalsTail = a) : (i._prevRemoved = a),
                this._insertAfter(t, r, n),
                this._addToMoves(t, n),
                t
            )
        }
        _moveAfter(t, r, n) {
            return (
                this._unlink(t),
                this._insertAfter(t, r, n),
                this._addToMoves(t, n),
                t
            )
        }
        _addAfter(t, r, n) {
            return (
                this._insertAfter(t, r, n),
                this._additionsTail === null
                    ? (this._additionsTail = this._additionsHead = t)
                    : (this._additionsTail = this._additionsTail._nextAdded =
                          t),
                t
            )
        }
        _insertAfter(t, r, n) {
            let a = r === null ? this._itHead : r._next
            return (
                (t._next = a),
                (t._prev = r),
                a === null ? (this._itTail = t) : (a._prev = t),
                r === null ? (this._itHead = t) : (r._next = t),
                this._linkedRecords === null &&
                    (this._linkedRecords = new P0()),
                this._linkedRecords.put(t),
                (t.currentIndex = n),
                t
            )
        }
        _remove(t) {
            return this._addToRemovals(this._unlink(t))
        }
        _unlink(t) {
            this._linkedRecords !== null && this._linkedRecords.remove(t)
            let r = t._prev,
                n = t._next
            return (
                r === null ? (this._itHead = n) : (r._next = n),
                n === null ? (this._itTail = r) : (n._prev = r),
                t
            )
        }
        _addToMoves(t, r) {
            return (
                t.previousIndex === r ||
                    (this._movesTail === null
                        ? (this._movesTail = this._movesHead = t)
                        : (this._movesTail = this._movesTail._nextMoved = t)),
                t
            )
        }
        _addToRemovals(t) {
            return (
                this._unlinkedRecords === null &&
                    (this._unlinkedRecords = new P0()),
                this._unlinkedRecords.put(t),
                (t.currentIndex = null),
                (t._nextRemoved = null),
                this._removalsTail === null
                    ? ((this._removalsTail = this._removalsHead = t),
                      (t._prevRemoved = null))
                    : ((t._prevRemoved = this._removalsTail),
                      (this._removalsTail = this._removalsTail._nextRemoved =
                          t)),
                t
            )
        }
        _addIdentityChange(t, r) {
            return (
                (t.item = r),
                this._identityChangesTail === null
                    ? (this._identityChangesTail = this._identityChangesHead =
                          t)
                    : (this._identityChangesTail =
                          this._identityChangesTail._nextIdentityChange =
                              t),
                t
            )
        }
    },
    Tr = class {
        constructor(t, r) {
            ;(this.item = t),
                (this.trackById = r),
                (this.currentIndex = null),
                (this.previousIndex = null),
                (this._nextPrevious = null),
                (this._prev = null),
                (this._next = null),
                (this._prevDup = null),
                (this._nextDup = null),
                (this._prevRemoved = null),
                (this._nextRemoved = null),
                (this._nextAdded = null),
                (this._nextMoved = null),
                (this._nextIdentityChange = null)
        }
    },
    Ar = class {
        constructor() {
            ;(this._head = null), (this._tail = null)
        }
        add(t) {
            this._head === null
                ? ((this._head = this._tail = t),
                  (t._nextDup = null),
                  (t._prevDup = null))
                : ((this._tail._nextDup = t),
                  (t._prevDup = this._tail),
                  (t._nextDup = null),
                  (this._tail = t))
        }
        get(t, r) {
            let n
            for (n = this._head; n !== null; n = n._nextDup)
                if (
                    (r === null || r <= n.currentIndex) &&
                    Object.is(n.trackById, t)
                )
                    return n
            return null
        }
        remove(t) {
            let r = t._prevDup,
                n = t._nextDup
            return (
                r === null ? (this._head = n) : (r._nextDup = n),
                n === null ? (this._tail = r) : (n._prevDup = r),
                this._head === null
            )
        }
    },
    P0 = class {
        constructor() {
            this.map = new Map()
        }
        put(t) {
            let r = t.trackById,
                n = this.map.get(r)
            n || ((n = new Ar()), this.map.set(r, n)), n.add(t)
        }
        get(t, r) {
            let n = t,
                a = this.map.get(n)
            return a ? a.get(t, r) : null
        }
        remove(t) {
            let r = t.trackById
            return this.map.get(r).remove(t) && this.map.delete(r), t
        }
        get isEmpty() {
            return this.map.size === 0
        }
        clear() {
            this.map.clear()
        }
    }
function Uo(e, t, r) {
    let n = e.previousIndex
    if (n === null) return n
    let a = 0
    return r && n < r.length && (a = r[n]), n + t + a
}
function Ho() {
    return new z6([new Er()])
}
var z6 = (() => {
    let t = class t {
        constructor(n) {
            this.factories = n
        }
        static create(n, a) {
            if (a != null) {
                let i = a.factories.slice()
                n = n.concat(i)
            }
            return new t(n)
        }
        static extend(n) {
            return {
                provide: t,
                useFactory: a => t.create(n, a || Ho()),
                deps: [[t, new nc(), new Rr()]],
            }
        }
        find(n) {
            let a = this.factories.find(i => i.supports(n))
            if (a != null) return a
            throw new w(901, !1)
        }
    }
    t.ɵprov = y({ token: t, providedIn: 'root', factory: Ho })
    let e = t
    return e
})()
function B8(e) {
    try {
        let { rootComponent: t, appProviders: r, platformProviders: n } = e,
            a = Rm(n),
            i = [Em(), ...(r || [])],
            c = new A0({
                providers: i,
                parent: a,
                debugName: '',
                runEnvironmentInitializers: !1,
            }).injector,
            s = c.get(J)
        return s.run(() => {
            c.resolveInjectorInitializers()
            let l = c.get(h1, null),
                f
            s.runOutsideAngular(() => {
                f = s.onError.subscribe({
                    next: p => {
                        l.handleError(p)
                    },
                })
            })
            let u = () => c.destroy(),
                d = a.get(O8)
            return (
                d.add(u),
                c.onDestroy(() => {
                    f.unsubscribe(), d.delete(u)
                }),
                wm(l, s, () => {
                    let p = c.get(_8)
                    return (
                        p.runInitializers(),
                        p.donePromise.then(() => {
                            let m = c.get(ft, R0)
                            om(m || R0)
                            let v = c.get(V1)
                            return t !== void 0 && v.bootstrap(t), v
                        })
                    )
                })
            )
        })
    } catch (t) {
        return Promise.reject(t)
    }
}
var Vo = !1,
    Bm = !1
function jm() {
    Vo || ((Vo = !0), Ju(), Kh(), mm(), em(), Ih(), zh(), Zp(), ep(), lm())
}
function Um(e, t) {
    return C6(e)
}
function j8() {
    return O1([
        {
            provide: r0,
            useFactory: () => {
                let e = !0
                return (
                    c0() && (e = !!g(ve, { optional: !0 })?.get(vs, null)),
                    e && t4('NgHydration'),
                    e
                )
            },
        },
        {
            provide: ce,
            useValue: () => {
                ;(Bm = !!g(ad, { optional: !0 })), c0() && g(r0) && (Hm(), jm())
            },
            multi: !0,
        },
        { provide: zs, useFactory: () => c0() && g(r0) },
        {
            provide: a4,
            useFactory: () => {
                if (c0() && g(r0)) {
                    let e = g(V1),
                        t = g(ge)
                    return () => {
                        Um(e, t).then(() => {
                            Up(e)
                        })
                    }
                }
                return () => {}
            },
            multi: !0,
        },
    ])
}
function Hm() {
    let e = W4(),
        t
    for (let r of e.body.childNodes)
        if (r.nodeType === Node.COMMENT_NODE && r.textContent?.trim() === Ku) {
            t = r
            break
        }
    if (!t) throw new w(-507, !1)
}
var Y8 = null
function i4() {
    return Y8
}
function Q8(e) {
    Y8 ??= e
}
var ut = class {}
var C2 = new b(''),
    Z8 = (() => {
        let t = class t {
            historyGo(n) {
                throw new Error('')
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => g(qm),
                providedIn: 'platform',
            }))
        let e = t
        return e
    })()
var qm = (() => {
    let t = class t extends Z8 {
        constructor() {
            super(),
                (this._doc = g(C2)),
                (this._location = window.location),
                (this._history = window.history)
        }
        getBaseHrefFromDOM() {
            return i4().getBaseHref(this._doc)
        }
        onPopState(n) {
            let a = i4().getGlobalEventTarget(this._doc, 'window')
            return (
                a.addEventListener('popstate', n, !1),
                () => a.removeEventListener('popstate', n)
            )
        }
        onHashChange(n) {
            let a = i4().getGlobalEventTarget(this._doc, 'window')
            return (
                a.addEventListener('hashchange', n, !1),
                () => a.removeEventListener('hashchange', n)
            )
        }
        get href() {
            return this._location.href
        }
        get protocol() {
            return this._location.protocol
        }
        get hostname() {
            return this._location.hostname
        }
        get port() {
            return this._location.port
        }
        get pathname() {
            return this._location.pathname
        }
        get search() {
            return this._location.search
        }
        get hash() {
            return this._location.hash
        }
        set pathname(n) {
            this._location.pathname = n
        }
        pushState(n, a, i) {
            this._history.pushState(n, a, i)
        }
        replaceState(n, a, i) {
            this._history.replaceState(n, a, i)
        }
        forward() {
            this._history.forward()
        }
        back() {
            this._history.back()
        }
        historyGo(n = 0) {
            this._history.go(n)
        }
        getState() {
            return this._history.state
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({
            token: t,
            factory: () => new t(),
            providedIn: 'platform',
        }))
    let e = t
    return e
})()
function K8(e, t) {
    if (e.length == 0) return t
    if (t.length == 0) return e
    let r = 0
    return (
        e.endsWith('/') && r++,
        t.startsWith('/') && r++,
        r == 2 ? e + t.substring(1) : r == 1 ? e + t : e + '/' + t
    )
}
function U8(e) {
    let t = e.match(/#|\?|$/),
        r = (t && t.index) || e.length,
        n = r - (e[r - 1] === '/' ? 1 : 0)
    return e.slice(0, n) + e.slice(r)
}
function we(e) {
    return e && e[0] !== '?' ? '?' + e : e
}
var pt = (() => {
        let t = class t {
            historyGo(n) {
                throw new Error('')
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => g(X8),
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    Gm = new b(''),
    X8 = (() => {
        let t = class t extends pt {
            constructor(n, a) {
                super(),
                    (this._platformLocation = n),
                    (this._removeListenerFns = []),
                    (this._baseHref =
                        a ??
                        this._platformLocation.getBaseHrefFromDOM() ??
                        g(C2).location?.origin ??
                        '')
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length; )
                    this._removeListenerFns.pop()()
            }
            onPopState(n) {
                this._removeListenerFns.push(
                    this._platformLocation.onPopState(n),
                    this._platformLocation.onHashChange(n)
                )
            }
            getBaseHref() {
                return this._baseHref
            }
            prepareExternalUrl(n) {
                return K8(this._baseHref, n)
            }
            path(n = !1) {
                let a =
                        this._platformLocation.pathname +
                        we(this._platformLocation.search),
                    i = this._platformLocation.hash
                return i && n ? `${a}${i}` : a
            }
            pushState(n, a, i, o) {
                let c = this.prepareExternalUrl(i + we(o))
                this._platformLocation.pushState(n, a, c)
            }
            replaceState(n, a, i, o) {
                let c = this.prepareExternalUrl(i + we(o))
                this._platformLocation.replaceState(n, a, c)
            }
            forward() {
                this._platformLocation.forward()
            }
            back() {
                this._platformLocation.back()
            }
            getState() {
                return this._platformLocation.getState()
            }
            historyGo(n = 0) {
                this._platformLocation.historyGo?.(n)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(Z8), D(Gm, 8))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })()
var be = (() => {
    let t = class t {
        constructor(n) {
            ;(this._subject = new $2()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n)
            let a = this._locationStrategy.getBaseHref()
            ;(this._basePath = Zm(U8(H8(a)))),
                this._locationStrategy.onPopState(i => {
                    this._subject.emit({
                        url: this.path(!0),
                        pop: !0,
                        state: i.state,
                        type: i.type,
                    })
                })
        }
        ngOnDestroy() {
            this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = [])
        }
        path(n = !1) {
            return this.normalize(this._locationStrategy.path(n))
        }
        getState() {
            return this._locationStrategy.getState()
        }
        isCurrentPathEqualTo(n, a = '') {
            return this.path() == this.normalize(n + we(a))
        }
        normalize(n) {
            return t.stripTrailingSlash(Qm(this._basePath, H8(n)))
        }
        prepareExternalUrl(n) {
            return (
                n && n[0] !== '/' && (n = '/' + n),
                this._locationStrategy.prepareExternalUrl(n)
            )
        }
        go(n, a = '', i = null) {
            this._locationStrategy.pushState(i, '', n, a),
                this._notifyUrlChangeListeners(
                    this.prepareExternalUrl(n + we(a)),
                    i
                )
        }
        replaceState(n, a = '', i = null) {
            this._locationStrategy.replaceState(i, '', n, a),
                this._notifyUrlChangeListeners(
                    this.prepareExternalUrl(n + we(a)),
                    i
                )
        }
        forward() {
            this._locationStrategy.forward()
        }
        back() {
            this._locationStrategy.back()
        }
        historyGo(n = 0) {
            this._locationStrategy.historyGo?.(n)
        }
        onUrlChange(n) {
            return (
                this._urlChangeListeners.push(n),
                (this._urlChangeSubscription ??= this.subscribe(a => {
                    this._notifyUrlChangeListeners(a.url, a.state)
                })),
                () => {
                    let a = this._urlChangeListeners.indexOf(n)
                    this._urlChangeListeners.splice(a, 1),
                        this._urlChangeListeners.length === 0 &&
                            (this._urlChangeSubscription?.unsubscribe(),
                            (this._urlChangeSubscription = null))
                }
            )
        }
        _notifyUrlChangeListeners(n = '', a) {
            this._urlChangeListeners.forEach(i => i(n, a))
        }
        subscribe(n, a, i) {
            return this._subject.subscribe({ next: n, error: a, complete: i })
        }
    }
    ;(t.normalizeQueryParams = we),
        (t.joinWithSlash = K8),
        (t.stripTrailingSlash = U8),
        (t.ɵfac = function (a) {
            return new (a || t)(D(pt))
        }),
        (t.ɵprov = y({ token: t, factory: () => Ym(), providedIn: 'root' }))
    let e = t
    return e
})()
function Ym() {
    return new be(D(pt))
}
function Qm(e, t) {
    if (!e || !t.startsWith(e)) return t
    let r = t.substring(e.length)
    return r === '' || ['/', ';', '?', '#'].includes(r[0]) ? r : t
}
function H8(e) {
    return e.replace(/\/index.html$/, '')
}
function Zm(e) {
    if (new RegExp('^(https?:)?//').test(e)) {
        let [, r] = e.split(/\/\/[^\/]+/)
        return r
    }
    return e
}
var J8 = {
        ADP: [void 0, void 0, 0],
        AFN: [void 0, '\u060B', 0],
        ALL: [void 0, void 0, 0],
        AMD: [void 0, '\u058F', 2],
        AOA: [void 0, 'Kz'],
        ARS: [void 0, '$'],
        AUD: ['A$', '$'],
        AZN: [void 0, '\u20BC'],
        BAM: [void 0, 'KM'],
        BBD: [void 0, '$'],
        BDT: [void 0, '\u09F3'],
        BHD: [void 0, void 0, 3],
        BIF: [void 0, void 0, 0],
        BMD: [void 0, '$'],
        BND: [void 0, '$'],
        BOB: [void 0, 'Bs'],
        BRL: ['R$'],
        BSD: [void 0, '$'],
        BWP: [void 0, 'P'],
        BYN: [void 0, void 0, 2],
        BYR: [void 0, void 0, 0],
        BZD: [void 0, '$'],
        CAD: ['CA$', '$', 2],
        CHF: [void 0, void 0, 2],
        CLF: [void 0, void 0, 4],
        CLP: [void 0, '$', 0],
        CNY: ['CN\xA5', '\xA5'],
        COP: [void 0, '$', 2],
        CRC: [void 0, '\u20A1', 2],
        CUC: [void 0, '$'],
        CUP: [void 0, '$'],
        CZK: [void 0, 'K\u010D', 2],
        DJF: [void 0, void 0, 0],
        DKK: [void 0, 'kr', 2],
        DOP: [void 0, '$'],
        EGP: [void 0, 'E\xA3'],
        ESP: [void 0, '\u20A7', 0],
        EUR: ['\u20AC'],
        FJD: [void 0, '$'],
        FKP: [void 0, '\xA3'],
        GBP: ['\xA3'],
        GEL: [void 0, '\u20BE'],
        GHS: [void 0, 'GH\u20B5'],
        GIP: [void 0, '\xA3'],
        GNF: [void 0, 'FG', 0],
        GTQ: [void 0, 'Q'],
        GYD: [void 0, '$', 2],
        HKD: ['HK$', '$'],
        HNL: [void 0, 'L'],
        HRK: [void 0, 'kn'],
        HUF: [void 0, 'Ft', 2],
        IDR: [void 0, 'Rp', 2],
        ILS: ['\u20AA'],
        INR: ['\u20B9'],
        IQD: [void 0, void 0, 0],
        IRR: [void 0, void 0, 0],
        ISK: [void 0, 'kr', 0],
        ITL: [void 0, void 0, 0],
        JMD: [void 0, '$'],
        JOD: [void 0, void 0, 3],
        JPY: ['\xA5', void 0, 0],
        KHR: [void 0, '\u17DB'],
        KMF: [void 0, 'CF', 0],
        KPW: [void 0, '\u20A9', 0],
        KRW: ['\u20A9', void 0, 0],
        KWD: [void 0, void 0, 3],
        KYD: [void 0, '$'],
        KZT: [void 0, '\u20B8'],
        LAK: [void 0, '\u20AD', 0],
        LBP: [void 0, 'L\xA3', 0],
        LKR: [void 0, 'Rs'],
        LRD: [void 0, '$'],
        LTL: [void 0, 'Lt'],
        LUF: [void 0, void 0, 0],
        LVL: [void 0, 'Ls'],
        LYD: [void 0, void 0, 3],
        MGA: [void 0, 'Ar', 0],
        MGF: [void 0, void 0, 0],
        MMK: [void 0, 'K', 0],
        MNT: [void 0, '\u20AE', 2],
        MRO: [void 0, void 0, 0],
        MUR: [void 0, 'Rs', 2],
        MXN: ['MX$', '$'],
        MYR: [void 0, 'RM'],
        NAD: [void 0, '$'],
        NGN: [void 0, '\u20A6'],
        NIO: [void 0, 'C$'],
        NOK: [void 0, 'kr', 2],
        NPR: [void 0, 'Rs'],
        NZD: ['NZ$', '$'],
        OMR: [void 0, void 0, 3],
        PHP: ['\u20B1'],
        PKR: [void 0, 'Rs', 2],
        PLN: [void 0, 'z\u0142'],
        PYG: [void 0, '\u20B2', 0],
        RON: [void 0, 'lei'],
        RSD: [void 0, void 0, 0],
        RUB: [void 0, '\u20BD'],
        RWF: [void 0, 'RF', 0],
        SBD: [void 0, '$'],
        SEK: [void 0, 'kr', 2],
        SGD: [void 0, '$'],
        SHP: [void 0, '\xA3'],
        SLE: [void 0, void 0, 2],
        SLL: [void 0, void 0, 0],
        SOS: [void 0, void 0, 0],
        SRD: [void 0, '$'],
        SSP: [void 0, '\xA3'],
        STD: [void 0, void 0, 0],
        STN: [void 0, 'Db'],
        SYP: [void 0, '\xA3', 0],
        THB: [void 0, '\u0E3F'],
        TMM: [void 0, void 0, 0],
        TND: [void 0, void 0, 3],
        TOP: [void 0, 'T$'],
        TRL: [void 0, void 0, 0],
        TRY: [void 0, '\u20BA'],
        TTD: [void 0, '$'],
        TWD: ['NT$', '$', 2],
        TZS: [void 0, void 0, 2],
        UAH: [void 0, '\u20B4'],
        UGX: [void 0, void 0, 0],
        USD: ['$'],
        UYI: [void 0, void 0, 0],
        UYU: [void 0, '$'],
        UYW: [void 0, void 0, 4],
        UZS: [void 0, void 0, 2],
        VEF: [void 0, 'Bs', 2],
        VND: ['\u20AB', void 0, 0],
        VUV: [void 0, void 0, 0],
        XAF: ['FCFA', void 0, 0],
        XCD: ['EC$', '$'],
        XOF: ['F\u202FCFA', void 0, 0],
        XPF: ['CFPF', void 0, 0],
        XXX: ['\xA4'],
        YER: [void 0, void 0, 0],
        ZAR: [void 0, 'R'],
        ZMK: [void 0, void 0, 0],
        ZMW: [void 0, 'ZK'],
        ZWD: [void 0, void 0, 0],
    },
    el = (function (e) {
        return (
            (e[(e.Decimal = 0)] = 'Decimal'),
            (e[(e.Percent = 1)] = 'Percent'),
            (e[(e.Currency = 2)] = 'Currency'),
            (e[(e.Scientific = 3)] = 'Scientific'),
            e
        )
    })(el || {})
var w1 = {
    Decimal: 0,
    Group: 1,
    List: 2,
    PercentSign: 3,
    PlusSign: 4,
    MinusSign: 5,
    Exponential: 6,
    SuperscriptingExponent: 7,
    PerMille: 8,
    Infinity: 9,
    NaN: 10,
    TimeSeparator: 11,
    CurrencyDecimal: 12,
    CurrencyGroup: 13,
}
function J4(e, t) {
    let r = it(e),
        n = r[ze.NumberSymbols][t]
    if (typeof n > 'u') {
        if (t === w1.CurrencyDecimal) return r[ze.NumberSymbols][w1.Decimal]
        if (t === w1.CurrencyGroup) return r[ze.NumberSymbols][w1.Group]
    }
    return n
}
function Km(e, t) {
    return it(e)[ze.NumberFormats][t]
}
function Xm(e) {
    return it(e)[ze.Currencies]
}
function Jm(e, t, r = 'en') {
    let n = Xm(r)[e] || J8[e] || [],
        a = n[1]
    return t === 'narrow' && typeof a == 'string' ? a : n[0] || e
}
var eg = 2
function tg(e) {
    let t,
        r = J8[e]
    return r && (t = r[2]), typeof t == 'number' ? t : eg
}
var ng = /^(\d+)?\.((\d+)(-(\d+))?)?$/,
    V8 = 22,
    dt = '.',
    e3 = '0',
    rg = ';',
    ag = ',',
    L6 = '#',
    $8 = '\xA4'
function ig(e, t, r, n, a, i, o = !1) {
    let c = '',
        s = !1
    if (!isFinite(e)) c = J4(r, w1.Infinity)
    else {
        let l = lg(e)
        o && (l = sg(l))
        let f = t.minInt,
            u = t.minFrac,
            d = t.maxFrac
        if (i) {
            let E = i.match(ng)
            if (E === null) throw new Error(`${i} is not a valid digit info`)
            let F = E[1],
                P = E[3],
                Q = E[5]
            F != null && (f = w6(F)),
                P != null && (u = w6(P)),
                Q != null ? (d = w6(Q)) : P != null && u > d && (d = u)
        }
        fg(l, u, d)
        let p = l.digits,
            m = l.integerLen,
            v = l.exponent,
            C = []
        for (s = p.every(E => !E); m < f; m++) p.unshift(0)
        for (; m < 0; m++) p.unshift(0)
        m > 0 ? (C = p.splice(m, p.length)) : ((C = p), (p = [0]))
        let M = []
        for (
            p.length >= t.lgSize &&
            M.unshift(p.splice(-t.lgSize, p.length).join(''));
            p.length > t.gSize;

        )
            M.unshift(p.splice(-t.gSize, p.length).join(''))
        p.length && M.unshift(p.join('')),
            (c = M.join(J4(r, n))),
            C.length && (c += J4(r, a) + C.join('')),
            v && (c += J4(r, w1.Exponential) + '+' + v)
    }
    return (
        e < 0 && !s
            ? (c = t.negPre + c + t.negSuf)
            : (c = t.posPre + c + t.posSuf),
        c
    )
}
function og(e, t, r, n, a) {
    let i = Km(t, el.Currency),
        o = cg(i, J4(t, w1.MinusSign))
    return (
        (o.minFrac = tg(n)),
        (o.maxFrac = o.minFrac),
        ig(e, o, t, w1.CurrencyGroup, w1.CurrencyDecimal, a)
            .replace($8, r)
            .replace($8, '')
            .trim()
    )
}
function cg(e, t = '-') {
    let r = {
            minInt: 1,
            minFrac: 0,
            maxFrac: 0,
            posPre: '',
            posSuf: '',
            negPre: '',
            negSuf: '',
            gSize: 0,
            lgSize: 0,
        },
        n = e.split(rg),
        a = n[0],
        i = n[1],
        o =
            a.indexOf(dt) !== -1
                ? a.split(dt)
                : [
                      a.substring(0, a.lastIndexOf(e3) + 1),
                      a.substring(a.lastIndexOf(e3) + 1),
                  ],
        c = o[0],
        s = o[1] || ''
    r.posPre = c.substring(0, c.indexOf(L6))
    for (let f = 0; f < s.length; f++) {
        let u = s.charAt(f)
        u === e3
            ? (r.minFrac = r.maxFrac = f + 1)
            : u === L6
            ? (r.maxFrac = f + 1)
            : (r.posSuf += u)
    }
    let l = c.split(ag)
    if (
        ((r.gSize = l[1] ? l[1].length : 0),
        (r.lgSize = l[2] || l[1] ? (l[2] || l[1]).length : 0),
        i)
    ) {
        let f = a.length - r.posPre.length - r.posSuf.length,
            u = i.indexOf(L6)
        ;(r.negPre = i.substring(0, u).replace(/'/g, '')),
            (r.negSuf = i.slice(u + f).replace(/'/g, ''))
    } else (r.negPre = t + r.posPre), (r.negSuf = r.posSuf)
    return r
}
function sg(e) {
    if (e.digits[0] === 0) return e
    let t = e.digits.length - e.integerLen
    return (
        e.exponent
            ? (e.exponent += 2)
            : (t === 0 ? e.digits.push(0, 0) : t === 1 && e.digits.push(0),
              (e.integerLen += 2)),
        e
    )
}
function lg(e) {
    let t = Math.abs(e) + '',
        r = 0,
        n,
        a,
        i,
        o,
        c
    for (
        (a = t.indexOf(dt)) > -1 && (t = t.replace(dt, '')),
            (i = t.search(/e/i)) > 0
                ? (a < 0 && (a = i),
                  (a += +t.slice(i + 1)),
                  (t = t.substring(0, i)))
                : a < 0 && (a = t.length),
            i = 0;
        t.charAt(i) === e3;
        i++
    );
    if (i === (c = t.length)) (n = [0]), (a = 1)
    else {
        for (c--; t.charAt(c) === e3; ) c--
        for (a -= i, n = [], o = 0; i <= c; i++, o++) n[o] = Number(t.charAt(i))
    }
    return (
        a > V8 && ((n = n.splice(0, V8 - 1)), (r = a - 1), (a = 1)),
        { digits: n, exponent: r, integerLen: a }
    )
}
function fg(e, t, r) {
    if (t > r)
        throw new Error(
            `The minimum number of digits after fraction (${t}) is higher than the maximum (${r}).`
        )
    let n = e.digits,
        a = n.length - e.integerLen,
        i = Math.min(Math.max(t, a), r),
        o = i + e.integerLen,
        c = n[o]
    if (o > 0) {
        n.splice(Math.max(e.integerLen, o))
        for (let u = o; u < n.length; u++) n[u] = 0
    } else {
        ;(a = Math.max(0, a)),
            (e.integerLen = 1),
            (n.length = Math.max(1, (o = i + 1))),
            (n[0] = 0)
        for (let u = 1; u < o; u++) n[u] = 0
    }
    if (c >= 5)
        if (o - 1 < 0) {
            for (let u = 0; u > o; u--) n.unshift(0), e.integerLen++
            n.unshift(1), e.integerLen++
        } else n[o - 1]++
    for (; a < Math.max(0, i); a++) n.push(0)
    let s = i !== 0,
        l = t + e.integerLen,
        f = n.reduceRight(function (u, d, p, m) {
            return (
                (d = d + u),
                (m[p] = d < 10 ? d : d - 10),
                s && (m[p] === 0 && p >= l ? m.pop() : (s = !1)),
                d >= 10 ? 1 : 0
            )
        }, 0)
    f && (n.unshift(f), e.integerLen++)
}
function w6(e) {
    let t = parseInt(e)
    if (isNaN(t)) throw new Error('Invalid integer literal when parsing ' + e)
    return t
}
function ht(e, t) {
    t = encodeURIComponent(t)
    for (let r of e.split(';')) {
        let n = r.indexOf('='),
            [a, i] = n == -1 ? [r, ''] : [r.slice(0, n), r.slice(n + 1)]
        if (a.trim() === t) return decodeURIComponent(i)
    }
    return null
}
var b6 = class {
        constructor(t, r, n, a) {
            ;(this.$implicit = t),
                (this.ngForOf = r),
                (this.index = n),
                (this.count = a)
        }
        get first() {
            return this.index === 0
        }
        get last() {
            return this.index === this.count - 1
        }
        get even() {
            return this.index % 2 === 0
        }
        get odd() {
            return !this.even
        }
    },
    tl = (() => {
        let t = class t {
            set ngForOf(n) {
                ;(this._ngForOf = n), (this._ngForOfDirty = !0)
            }
            set ngForTrackBy(n) {
                this._trackByFn = n
            }
            get ngForTrackBy() {
                return this._trackByFn
            }
            constructor(n, a, i) {
                ;(this._viewContainer = n),
                    (this._template = a),
                    (this._differs = i),
                    (this._ngForOf = null),
                    (this._ngForOfDirty = !0),
                    (this._differ = null)
            }
            set ngForTemplate(n) {
                n && (this._template = n)
            }
            ngDoCheck() {
                if (this._ngForOfDirty) {
                    this._ngForOfDirty = !1
                    let n = this._ngForOf
                    if (!this._differ && n)
                        if (0)
                            try {
                            } catch {}
                        else
                            this._differ = this._differs
                                .find(n)
                                .create(this.ngForTrackBy)
                }
                if (this._differ) {
                    let n = this._differ.diff(this._ngForOf)
                    n && this._applyChanges(n)
                }
            }
            _applyChanges(n) {
                let a = this._viewContainer
                n.forEachOperation((i, o, c) => {
                    if (i.previousIndex == null)
                        a.createEmbeddedView(
                            this._template,
                            new b6(i.item, this._ngForOf, -1, -1),
                            c === null ? void 0 : c
                        )
                    else if (c == null) a.remove(o === null ? void 0 : o)
                    else if (o !== null) {
                        let s = a.get(o)
                        a.move(s, c), W8(s, i)
                    }
                })
                for (let i = 0, o = a.length; i < o; i++) {
                    let s = a.get(i).context
                    ;(s.index = i), (s.count = o), (s.ngForOf = this._ngForOf)
                }
                n.forEachIdentityChange(i => {
                    let o = a.get(i.currentIndex)
                    W8(o, i)
                })
            }
            static ngTemplateContextGuard(n, a) {
                return !0
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(Z(n4), Z(et), Z(z6))
        }),
            (t.ɵdir = he({
                type: t,
                selectors: [['', 'ngFor', '', 'ngForOf', '']],
                inputs: {
                    ngForOf: 'ngForOf',
                    ngForTrackBy: 'ngForTrackBy',
                    ngForTemplate: 'ngForTemplate',
                },
                standalone: !0,
            }))
        let e = t
        return e
    })()
function W8(e, t) {
    e.context.$implicit = t.item
}
var mt = (() => {
        let t = class t {
            constructor(n, a) {
                ;(this._viewContainer = n),
                    (this._context = new S6()),
                    (this._thenTemplateRef = null),
                    (this._elseTemplateRef = null),
                    (this._thenViewRef = null),
                    (this._elseViewRef = null),
                    (this._thenTemplateRef = a)
            }
            set ngIf(n) {
                ;(this._context.$implicit = this._context.ngIf = n),
                    this._updateView()
            }
            set ngIfThen(n) {
                q8('ngIfThen', n),
                    (this._thenTemplateRef = n),
                    (this._thenViewRef = null),
                    this._updateView()
            }
            set ngIfElse(n) {
                q8('ngIfElse', n),
                    (this._elseTemplateRef = n),
                    (this._elseViewRef = null),
                    this._updateView()
            }
            _updateView() {
                this._context.$implicit
                    ? this._thenViewRef ||
                      (this._viewContainer.clear(),
                      (this._elseViewRef = null),
                      this._thenTemplateRef &&
                          (this._thenViewRef =
                              this._viewContainer.createEmbeddedView(
                                  this._thenTemplateRef,
                                  this._context
                              )))
                    : this._elseViewRef ||
                      (this._viewContainer.clear(),
                      (this._thenViewRef = null),
                      this._elseTemplateRef &&
                          (this._elseViewRef =
                              this._viewContainer.createEmbeddedView(
                                  this._elseTemplateRef,
                                  this._context
                              )))
            }
            static ngTemplateContextGuard(n, a) {
                return !0
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(Z(n4), Z(et))
        }),
            (t.ɵdir = he({
                type: t,
                selectors: [['', 'ngIf', '']],
                inputs: {
                    ngIf: 'ngIf',
                    ngIfThen: 'ngIfThen',
                    ngIfElse: 'ngIfElse',
                },
                standalone: !0,
            }))
        let e = t
        return e
    })(),
    S6 = class {
        constructor() {
            ;(this.$implicit = null), (this.ngIf = null)
        }
    }
function q8(e, t) {
    if (!!!(!t || t.createEmbeddedView))
        throw new Error(`${e} must be a TemplateRef, but received '${M2(t)}'.`)
}
function ug(e, t) {
    return new w(2100, !1)
}
var nl = (() => {
    let t = class t {
        constructor(n, a = 'USD') {
            ;(this._locale = n), (this._defaultCurrencyCode = a)
        }
        transform(n, a = this._defaultCurrencyCode, i = 'symbol', o, c) {
            if (!dg(n)) return null
            ;(c ||= this._locale),
                typeof i == 'boolean' && (i = i ? 'symbol' : 'code')
            let s = a || this._defaultCurrencyCode
            i !== 'code' &&
                (i === 'symbol' || i === 'symbol-narrow'
                    ? (s = Jm(s, i === 'symbol' ? 'wide' : 'narrow', c))
                    : (s = i))
            try {
                let l = pg(n)
                return og(l, c, s, a, o)
            } catch (l) {
                throw ug(t, l.message)
            }
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(Z(ft, 16), Z(F8, 16))
    }),
        (t.ɵpipe = lc({ name: 'currency', type: t, pure: !0, standalone: !0 }))
    let e = t
    return e
})()
function dg(e) {
    return !(e == null || e === '' || e !== e)
}
function pg(e) {
    if (typeof e == 'string' && !isNaN(Number(e) - parseFloat(e)))
        return Number(e)
    if (typeof e != 'number') throw new Error(`${e} is not a number`)
    return e
}
var d2 = (() => {
        let t = class t {}
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵmod = F1({ type: t })),
            (t.ɵinj = _1({}))
        let e = t
        return e
    })(),
    rl = 'browser',
    hg = 'server'
function t3(e) {
    return e === hg
}
var o4 = class {}
var r3 = class {},
    Mt = class {},
    W1 = class e {
        constructor(t) {
            ;(this.normalizedNames = new Map()),
                (this.lazyUpdate = null),
                t
                    ? typeof t == 'string'
                        ? (this.lazyInit = () => {
                              ;(this.headers = new Map()),
                                  t
                                      .split(
                                          `
`
                                      )
                                      .forEach(r => {
                                          let n = r.indexOf(':')
                                          if (n > 0) {
                                              let a = r.slice(0, n),
                                                  i = a.toLowerCase(),
                                                  o = r.slice(n + 1).trim()
                                              this.maybeSetNormalizedName(a, i),
                                                  this.headers.has(i)
                                                      ? this.headers
                                                            .get(i)
                                                            .push(o)
                                                      : this.headers.set(i, [o])
                                          }
                                      })
                          })
                        : typeof Headers < 'u' && t instanceof Headers
                        ? ((this.headers = new Map()),
                          t.forEach((r, n) => {
                              this.setHeaderEntries(n, r)
                          }))
                        : (this.lazyInit = () => {
                              ;(this.headers = new Map()),
                                  Object.entries(t).forEach(([r, n]) => {
                                      this.setHeaderEntries(r, n)
                                  })
                          })
                    : (this.headers = new Map())
        }
        has(t) {
            return this.init(), this.headers.has(t.toLowerCase())
        }
        get(t) {
            this.init()
            let r = this.headers.get(t.toLowerCase())
            return r && r.length > 0 ? r[0] : null
        }
        keys() {
            return this.init(), Array.from(this.normalizedNames.values())
        }
        getAll(t) {
            return this.init(), this.headers.get(t.toLowerCase()) || null
        }
        append(t, r) {
            return this.clone({ name: t, value: r, op: 'a' })
        }
        set(t, r) {
            return this.clone({ name: t, value: r, op: 's' })
        }
        delete(t, r) {
            return this.clone({ name: t, value: r, op: 'd' })
        }
        maybeSetNormalizedName(t, r) {
            this.normalizedNames.has(r) || this.normalizedNames.set(r, t)
        }
        init() {
            this.lazyInit &&
                (this.lazyInit instanceof e
                    ? this.copyFrom(this.lazyInit)
                    : this.lazyInit(),
                (this.lazyInit = null),
                this.lazyUpdate &&
                    (this.lazyUpdate.forEach(t => this.applyUpdate(t)),
                    (this.lazyUpdate = null)))
        }
        copyFrom(t) {
            t.init(),
                Array.from(t.headers.keys()).forEach(r => {
                    this.headers.set(r, t.headers.get(r)),
                        this.normalizedNames.set(r, t.normalizedNames.get(r))
                })
        }
        clone(t) {
            let r = new e()
            return (
                (r.lazyInit =
                    this.lazyInit && this.lazyInit instanceof e
                        ? this.lazyInit
                        : this),
                (r.lazyUpdate = (this.lazyUpdate || []).concat([t])),
                r
            )
        }
        applyUpdate(t) {
            let r = t.name.toLowerCase()
            switch (t.op) {
                case 'a':
                case 's':
                    let n = t.value
                    if ((typeof n == 'string' && (n = [n]), n.length === 0))
                        return
                    this.maybeSetNormalizedName(t.name, r)
                    let a = (t.op === 'a' ? this.headers.get(r) : void 0) || []
                    a.push(...n), this.headers.set(r, a)
                    break
                case 'd':
                    let i = t.value
                    if (!i)
                        this.headers.delete(r), this.normalizedNames.delete(r)
                    else {
                        let o = this.headers.get(r)
                        if (!o) return
                        ;(o = o.filter(c => i.indexOf(c) === -1)),
                            o.length === 0
                                ? (this.headers.delete(r),
                                  this.normalizedNames.delete(r))
                                : this.headers.set(r, o)
                    }
                    break
            }
        }
        setHeaderEntries(t, r) {
            let n = (Array.isArray(r) ? r : [r]).map(i => i.toString()),
                a = t.toLowerCase()
            this.headers.set(a, n), this.maybeSetNormalizedName(t, a)
        }
        forEach(t) {
            this.init(),
                Array.from(this.normalizedNames.keys()).forEach(r =>
                    t(this.normalizedNames.get(r), this.headers.get(r))
                )
        }
    }
var N6 = class {
    encodeKey(t) {
        return al(t)
    }
    encodeValue(t) {
        return al(t)
    }
    decodeKey(t) {
        return decodeURIComponent(t)
    }
    decodeValue(t) {
        return decodeURIComponent(t)
    }
}
function gg(e, t) {
    let r = new Map()
    return (
        e.length > 0 &&
            e
                .replace(/^\?/, '')
                .split('&')
                .forEach(a => {
                    let i = a.indexOf('='),
                        [o, c] =
                            i == -1
                                ? [t.decodeKey(a), '']
                                : [
                                      t.decodeKey(a.slice(0, i)),
                                      t.decodeValue(a.slice(i + 1)),
                                  ],
                        s = r.get(o) || []
                    s.push(c), r.set(o, s)
                }),
        r
    )
}
var vg = /%(\d[a-f0-9])/gi,
    Mg = {
        40: '@',
        '3A': ':',
        24: '$',
        '2C': ',',
        '3B': ';',
        '3D': '=',
        '3F': '?',
        '2F': '/',
    }
function al(e) {
    return encodeURIComponent(e).replace(vg, (t, r) => Mg[r] ?? t)
}
function gt(e) {
    return `${e}`
}
var $1 = class e {
    constructor(t = {}) {
        if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new N6()),
            t.fromString)
        ) {
            if (t.fromObject)
                throw new Error(
                    'Cannot specify both fromString and fromObject.'
                )
            this.map = gg(t.fromString, this.encoder)
        } else
            t.fromObject
                ? ((this.map = new Map()),
                  Object.keys(t.fromObject).forEach(r => {
                      let n = t.fromObject[r],
                          a = Array.isArray(n) ? n.map(gt) : [gt(n)]
                      this.map.set(r, a)
                  }))
                : (this.map = null)
    }
    has(t) {
        return this.init(), this.map.has(t)
    }
    get(t) {
        this.init()
        let r = this.map.get(t)
        return r ? r[0] : null
    }
    getAll(t) {
        return this.init(), this.map.get(t) || null
    }
    keys() {
        return this.init(), Array.from(this.map.keys())
    }
    append(t, r) {
        return this.clone({ param: t, value: r, op: 'a' })
    }
    appendAll(t) {
        let r = []
        return (
            Object.keys(t).forEach(n => {
                let a = t[n]
                Array.isArray(a)
                    ? a.forEach(i => {
                          r.push({ param: n, value: i, op: 'a' })
                      })
                    : r.push({ param: n, value: a, op: 'a' })
            }),
            this.clone(r)
        )
    }
    set(t, r) {
        return this.clone({ param: t, value: r, op: 's' })
    }
    delete(t, r) {
        return this.clone({ param: t, value: r, op: 'd' })
    }
    toString() {
        return (
            this.init(),
            this.keys()
                .map(t => {
                    let r = this.encoder.encodeKey(t)
                    return this.map
                        .get(t)
                        .map(n => r + '=' + this.encoder.encodeValue(n))
                        .join('&')
                })
                .filter(t => t !== '')
                .join('&')
        )
    }
    clone(t) {
        let r = new e({ encoder: this.encoder })
        return (
            (r.cloneFrom = this.cloneFrom || this),
            (r.updates = (this.updates || []).concat(t)),
            r
        )
    }
    init() {
        this.map === null && (this.map = new Map()),
            this.cloneFrom !== null &&
                (this.cloneFrom.init(),
                this.cloneFrom
                    .keys()
                    .forEach(t => this.map.set(t, this.cloneFrom.map.get(t))),
                this.updates.forEach(t => {
                    switch (t.op) {
                        case 'a':
                        case 's':
                            let r =
                                (t.op === 'a'
                                    ? this.map.get(t.param)
                                    : void 0) || []
                            r.push(gt(t.value)), this.map.set(t.param, r)
                            break
                        case 'd':
                            if (t.value !== void 0) {
                                let n = this.map.get(t.param) || [],
                                    a = n.indexOf(gt(t.value))
                                a !== -1 && n.splice(a, 1),
                                    n.length > 0
                                        ? this.map.set(t.param, n)
                                        : this.map.delete(t.param)
                            } else {
                                this.map.delete(t.param)
                                break
                            }
                    }
                }),
                (this.cloneFrom = this.updates = null))
    }
}
var E6 = class {
    constructor() {
        this.map = new Map()
    }
    set(t, r) {
        return this.map.set(t, r), this
    }
    get(t) {
        return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
        )
    }
    delete(t) {
        return this.map.delete(t), this
    }
    has(t) {
        return this.map.has(t)
    }
    keys() {
        return this.map.keys()
    }
}
function Cg(e) {
    switch (e) {
        case 'DELETE':
        case 'GET':
        case 'HEAD':
        case 'OPTIONS':
        case 'JSONP':
            return !1
        default:
            return !0
    }
}
function il(e) {
    return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer
}
function ol(e) {
    return typeof Blob < 'u' && e instanceof Blob
}
function cl(e) {
    return typeof FormData < 'u' && e instanceof FormData
}
function yg(e) {
    return typeof URLSearchParams < 'u' && e instanceof URLSearchParams
}
var n3 = class e {
        constructor(t, r, n, a) {
            ;(this.url = r),
                (this.body = null),
                (this.reportProgress = !1),
                (this.withCredentials = !1),
                (this.responseType = 'json'),
                (this.method = t.toUpperCase())
            let i
            if (
                (Cg(this.method) || a
                    ? ((this.body = n !== void 0 ? n : null), (i = a))
                    : (i = n),
                i &&
                    ((this.reportProgress = !!i.reportProgress),
                    (this.withCredentials = !!i.withCredentials),
                    i.responseType && (this.responseType = i.responseType),
                    i.headers && (this.headers = i.headers),
                    i.context && (this.context = i.context),
                    i.params && (this.params = i.params),
                    (this.transferCache = i.transferCache)),
                (this.headers ??= new W1()),
                (this.context ??= new E6()),
                !this.params)
            )
                (this.params = new $1()), (this.urlWithParams = r)
            else {
                let o = this.params.toString()
                if (o.length === 0) this.urlWithParams = r
                else {
                    let c = r.indexOf('?'),
                        s = c === -1 ? '?' : c < r.length - 1 ? '&' : ''
                    this.urlWithParams = r + s + o
                }
            }
        }
        serializeBody() {
            return this.body === null
                ? null
                : typeof this.body == 'string' ||
                  il(this.body) ||
                  ol(this.body) ||
                  cl(this.body) ||
                  yg(this.body)
                ? this.body
                : this.body instanceof $1
                ? this.body.toString()
                : typeof this.body == 'object' ||
                  typeof this.body == 'boolean' ||
                  Array.isArray(this.body)
                ? JSON.stringify(this.body)
                : this.body.toString()
        }
        detectContentTypeHeader() {
            return this.body === null || cl(this.body)
                ? null
                : ol(this.body)
                ? this.body.type || null
                : il(this.body)
                ? null
                : typeof this.body == 'string'
                ? 'text/plain'
                : this.body instanceof $1
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : typeof this.body == 'object' ||
                  typeof this.body == 'number' ||
                  typeof this.body == 'boolean'
                ? 'application/json'
                : null
        }
        clone(t = {}) {
            let r = t.method || this.method,
                n = t.url || this.url,
                a = t.responseType || this.responseType,
                i = t.transferCache ?? this.transferCache,
                o = t.body !== void 0 ? t.body : this.body,
                c = t.withCredentials ?? this.withCredentials,
                s = t.reportProgress ?? this.reportProgress,
                l = t.headers || this.headers,
                f = t.params || this.params,
                u = t.context ?? this.context
            return (
                t.setHeaders !== void 0 &&
                    (l = Object.keys(t.setHeaders).reduce(
                        (d, p) => d.set(p, t.setHeaders[p]),
                        l
                    )),
                t.setParams &&
                    (f = Object.keys(t.setParams).reduce(
                        (d, p) => d.set(p, t.setParams[p]),
                        f
                    )),
                new e(r, n, o, {
                    params: f,
                    headers: l,
                    context: u,
                    reportProgress: s,
                    responseType: a,
                    withCredentials: c,
                    transferCache: i,
                })
            )
        }
    },
    c4 = (function (e) {
        return (
            (e[(e.Sent = 0)] = 'Sent'),
            (e[(e.UploadProgress = 1)] = 'UploadProgress'),
            (e[(e.ResponseHeader = 2)] = 'ResponseHeader'),
            (e[(e.DownloadProgress = 3)] = 'DownloadProgress'),
            (e[(e.Response = 4)] = 'Response'),
            (e[(e.User = 5)] = 'User'),
            e
        )
    })(c4 || {}),
    a3 = class {
        constructor(t, r = yt.Ok, n = 'OK') {
            ;(this.headers = t.headers || new W1()),
                (this.status = t.status !== void 0 ? t.status : r),
                (this.statusText = t.statusText || n),
                (this.url = t.url || null),
                (this.ok = this.status >= 200 && this.status < 300)
        }
    },
    I6 = class e extends a3 {
        constructor(t = {}) {
            super(t), (this.type = c4.ResponseHeader)
        }
        clone(t = {}) {
            return new e({
                headers: t.headers || this.headers,
                status: t.status !== void 0 ? t.status : this.status,
                statusText: t.statusText || this.statusText,
                url: t.url || this.url || void 0,
            })
        }
    },
    s4 = class e extends a3 {
        constructor(t = {}) {
            super(t),
                (this.type = c4.Response),
                (this.body = t.body !== void 0 ? t.body : null)
        }
        clone(t = {}) {
            return new e({
                body: t.body !== void 0 ? t.body : this.body,
                headers: t.headers || this.headers,
                status: t.status !== void 0 ? t.status : this.status,
                statusText: t.statusText || this.statusText,
                url: t.url || this.url || void 0,
            })
        }
    },
    Ct = class extends a3 {
        constructor(t) {
            super(t, 0, 'Unknown Error'),
                (this.name = 'HttpErrorResponse'),
                (this.ok = !1),
                this.status >= 200 && this.status < 300
                    ? (this.message = `Http failure during parsing for ${
                          t.url || '(unknown url)'
                      }`)
                    : (this.message = `Http failure response for ${
                          t.url || '(unknown url)'
                      }: ${t.status} ${t.statusText}`),
                (this.error = t.error || null)
        }
    },
    yt = (function (e) {
        return (
            (e[(e.Continue = 100)] = 'Continue'),
            (e[(e.SwitchingProtocols = 101)] = 'SwitchingProtocols'),
            (e[(e.Processing = 102)] = 'Processing'),
            (e[(e.EarlyHints = 103)] = 'EarlyHints'),
            (e[(e.Ok = 200)] = 'Ok'),
            (e[(e.Created = 201)] = 'Created'),
            (e[(e.Accepted = 202)] = 'Accepted'),
            (e[(e.NonAuthoritativeInformation = 203)] =
                'NonAuthoritativeInformation'),
            (e[(e.NoContent = 204)] = 'NoContent'),
            (e[(e.ResetContent = 205)] = 'ResetContent'),
            (e[(e.PartialContent = 206)] = 'PartialContent'),
            (e[(e.MultiStatus = 207)] = 'MultiStatus'),
            (e[(e.AlreadyReported = 208)] = 'AlreadyReported'),
            (e[(e.ImUsed = 226)] = 'ImUsed'),
            (e[(e.MultipleChoices = 300)] = 'MultipleChoices'),
            (e[(e.MovedPermanently = 301)] = 'MovedPermanently'),
            (e[(e.Found = 302)] = 'Found'),
            (e[(e.SeeOther = 303)] = 'SeeOther'),
            (e[(e.NotModified = 304)] = 'NotModified'),
            (e[(e.UseProxy = 305)] = 'UseProxy'),
            (e[(e.Unused = 306)] = 'Unused'),
            (e[(e.TemporaryRedirect = 307)] = 'TemporaryRedirect'),
            (e[(e.PermanentRedirect = 308)] = 'PermanentRedirect'),
            (e[(e.BadRequest = 400)] = 'BadRequest'),
            (e[(e.Unauthorized = 401)] = 'Unauthorized'),
            (e[(e.PaymentRequired = 402)] = 'PaymentRequired'),
            (e[(e.Forbidden = 403)] = 'Forbidden'),
            (e[(e.NotFound = 404)] = 'NotFound'),
            (e[(e.MethodNotAllowed = 405)] = 'MethodNotAllowed'),
            (e[(e.NotAcceptable = 406)] = 'NotAcceptable'),
            (e[(e.ProxyAuthenticationRequired = 407)] =
                'ProxyAuthenticationRequired'),
            (e[(e.RequestTimeout = 408)] = 'RequestTimeout'),
            (e[(e.Conflict = 409)] = 'Conflict'),
            (e[(e.Gone = 410)] = 'Gone'),
            (e[(e.LengthRequired = 411)] = 'LengthRequired'),
            (e[(e.PreconditionFailed = 412)] = 'PreconditionFailed'),
            (e[(e.PayloadTooLarge = 413)] = 'PayloadTooLarge'),
            (e[(e.UriTooLong = 414)] = 'UriTooLong'),
            (e[(e.UnsupportedMediaType = 415)] = 'UnsupportedMediaType'),
            (e[(e.RangeNotSatisfiable = 416)] = 'RangeNotSatisfiable'),
            (e[(e.ExpectationFailed = 417)] = 'ExpectationFailed'),
            (e[(e.ImATeapot = 418)] = 'ImATeapot'),
            (e[(e.MisdirectedRequest = 421)] = 'MisdirectedRequest'),
            (e[(e.UnprocessableEntity = 422)] = 'UnprocessableEntity'),
            (e[(e.Locked = 423)] = 'Locked'),
            (e[(e.FailedDependency = 424)] = 'FailedDependency'),
            (e[(e.TooEarly = 425)] = 'TooEarly'),
            (e[(e.UpgradeRequired = 426)] = 'UpgradeRequired'),
            (e[(e.PreconditionRequired = 428)] = 'PreconditionRequired'),
            (e[(e.TooManyRequests = 429)] = 'TooManyRequests'),
            (e[(e.RequestHeaderFieldsTooLarge = 431)] =
                'RequestHeaderFieldsTooLarge'),
            (e[(e.UnavailableForLegalReasons = 451)] =
                'UnavailableForLegalReasons'),
            (e[(e.InternalServerError = 500)] = 'InternalServerError'),
            (e[(e.NotImplemented = 501)] = 'NotImplemented'),
            (e[(e.BadGateway = 502)] = 'BadGateway'),
            (e[(e.ServiceUnavailable = 503)] = 'ServiceUnavailable'),
            (e[(e.GatewayTimeout = 504)] = 'GatewayTimeout'),
            (e[(e.HttpVersionNotSupported = 505)] = 'HttpVersionNotSupported'),
            (e[(e.VariantAlsoNegotiates = 506)] = 'VariantAlsoNegotiates'),
            (e[(e.InsufficientStorage = 507)] = 'InsufficientStorage'),
            (e[(e.LoopDetected = 508)] = 'LoopDetected'),
            (e[(e.NotExtended = 510)] = 'NotExtended'),
            (e[(e.NetworkAuthenticationRequired = 511)] =
                'NetworkAuthenticationRequired'),
            e
        )
    })(yt || {})
function D6(e, t) {
    return {
        body: t,
        headers: e.headers,
        context: e.context,
        observe: e.observe,
        params: e.params,
        reportProgress: e.reportProgress,
        responseType: e.responseType,
        withCredentials: e.withCredentials,
        transferCache: e.transferCache,
    }
}
var zg = (() => {
    let t = class t {
        constructor(n) {
            this.handler = n
        }
        request(n, a, i = {}) {
            let o
            if (n instanceof n3) o = n
            else {
                let l
                i.headers instanceof W1
                    ? (l = i.headers)
                    : (l = new W1(i.headers))
                let f
                i.params &&
                    (i.params instanceof $1
                        ? (f = i.params)
                        : (f = new $1({ fromObject: i.params }))),
                    (o = new n3(n, a, i.body !== void 0 ? i.body : null, {
                        headers: l,
                        context: i.context,
                        params: f,
                        reportProgress: i.reportProgress,
                        responseType: i.responseType || 'json',
                        withCredentials: i.withCredentials,
                        transferCache: i.transferCache,
                    }))
            }
            let c = S(o).pipe(E1(l => this.handler.handle(l)))
            if (n instanceof n3 || i.observe === 'events') return c
            let s = c.pipe(S2(l => l instanceof s4))
            switch (i.observe || 'body') {
                case 'body':
                    switch (o.responseType) {
                        case 'arraybuffer':
                            return s.pipe(
                                A(l => {
                                    if (
                                        l.body !== null &&
                                        !(l.body instanceof ArrayBuffer)
                                    )
                                        throw new Error(
                                            'Response is not an ArrayBuffer.'
                                        )
                                    return l.body
                                })
                            )
                        case 'blob':
                            return s.pipe(
                                A(l => {
                                    if (
                                        l.body !== null &&
                                        !(l.body instanceof Blob)
                                    )
                                        throw new Error(
                                            'Response is not a Blob.'
                                        )
                                    return l.body
                                })
                            )
                        case 'text':
                            return s.pipe(
                                A(l => {
                                    if (
                                        l.body !== null &&
                                        typeof l.body != 'string'
                                    )
                                        throw new Error(
                                            'Response is not a string.'
                                        )
                                    return l.body
                                })
                            )
                        case 'json':
                        default:
                            return s.pipe(A(l => l.body))
                    }
                case 'response':
                    return s
                default:
                    throw new Error(
                        `Unreachable: unhandled observe type ${i.observe}}`
                    )
            }
        }
        delete(n, a = {}) {
            return this.request('DELETE', n, a)
        }
        get(n, a = {}) {
            return this.request('GET', n, a)
        }
        head(n, a = {}) {
            return this.request('HEAD', n, a)
        }
        jsonp(n, a) {
            return this.request('JSONP', n, {
                params: new $1().append(a, 'JSONP_CALLBACK'),
                observe: 'body',
                responseType: 'json',
            })
        }
        options(n, a = {}) {
            return this.request('OPTIONS', n, a)
        }
        patch(n, a, i = {}) {
            return this.request('PATCH', n, D6(i, a))
        }
        post(n, a, i = {}) {
            return this.request('POST', n, D6(i, a))
        }
        put(n, a, i = {}) {
            return this.request('PUT', n, D6(i, a))
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(D(r3))
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac }))
    let e = t
    return e
})()
function Ml(e, t) {
    return t(e)
}
function Lg(e, t) {
    return (r, n) => t.intercept(r, { handle: a => e(a, n) })
}
function wg(e, t, r) {
    return (n, a) => M1(r, () => t(n, i => e(i, a)))
}
var bg = new b(''),
    T6 = new b(''),
    Cl = new b(''),
    Sg = new b('')
function xg() {
    let e = null
    return (t, r) => {
        e === null && (e = (g(bg, { optional: !0 }) ?? []).reduceRight(Lg, Ml))
        let n = g(Ce),
            a = n.add()
        return e(t, r).pipe(T1(() => n.remove(a)))
    }
}
var sl = (() => {
    let t = class t extends r3 {
        constructor(n, a) {
            super(),
                (this.backend = n),
                (this.injector = a),
                (this.chain = null),
                (this.pendingTasks = g(Ce))
            let i = g(Sg, { optional: !0 })
            this.backend = i ?? n
        }
        handle(n) {
            if (this.chain === null) {
                let i = Array.from(
                    new Set([
                        ...this.injector.get(T6),
                        ...this.injector.get(Cl, []),
                    ])
                )
                this.chain = i.reduceRight(
                    (o, c) => wg(o, c, this.injector),
                    Ml
                )
            }
            let a = this.pendingTasks.add()
            return this.chain(n, i => this.backend.handle(i)).pipe(
                T1(() => this.pendingTasks.remove(a))
            )
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(D(Mt), D(L2))
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac }))
    let e = t
    return e
})()
var Dg = /^\)\]\}',?\n/
function Ng(e) {
    return 'responseURL' in e && e.responseURL
        ? e.responseURL
        : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
        ? e.getResponseHeader('X-Request-URL')
        : null
}
var ll = (() => {
        let t = class t {
            constructor(n) {
                this.xhrFactory = n
            }
            handle(n) {
                if (n.method === 'JSONP') throw new w(-2800, !1)
                let a = this.xhrFactory
                return (a.ɵloadImpl ? X(a.ɵloadImpl()) : S(null)).pipe(
                    x2(
                        () =>
                            new U(o => {
                                let c = a.build()
                                if (
                                    (c.open(n.method, n.urlWithParams),
                                    n.withCredentials &&
                                        (c.withCredentials = !0),
                                    n.headers.forEach((C, M) =>
                                        c.setRequestHeader(C, M.join(','))
                                    ),
                                    n.headers.has('Accept') ||
                                        c.setRequestHeader(
                                            'Accept',
                                            'application/json, text/plain, */*'
                                        ),
                                    !n.headers.has('Content-Type'))
                                ) {
                                    let C = n.detectContentTypeHeader()
                                    C !== null &&
                                        c.setRequestHeader('Content-Type', C)
                                }
                                if (n.responseType) {
                                    let C = n.responseType.toLowerCase()
                                    c.responseType = C !== 'json' ? C : 'text'
                                }
                                let s = n.serializeBody(),
                                    l = null,
                                    f = () => {
                                        if (l !== null) return l
                                        let C = c.statusText || 'OK',
                                            M = new W1(
                                                c.getAllResponseHeaders()
                                            ),
                                            E = Ng(c) || n.url
                                        return (
                                            (l = new I6({
                                                headers: M,
                                                status: c.status,
                                                statusText: C,
                                                url: E,
                                            })),
                                            l
                                        )
                                    },
                                    u = () => {
                                        let {
                                                headers: C,
                                                status: M,
                                                statusText: E,
                                                url: F,
                                            } = f(),
                                            P = null
                                        M !== yt.NoContent &&
                                            (P =
                                                typeof c.response > 'u'
                                                    ? c.responseText
                                                    : c.response),
                                            M === 0 && (M = P ? yt.Ok : 0)
                                        let Q = M >= 200 && M < 300
                                        if (
                                            n.responseType === 'json' &&
                                            typeof P == 'string'
                                        ) {
                                            let s2 = P
                                            P = P.replace(Dg, '')
                                            try {
                                                P =
                                                    P !== ''
                                                        ? JSON.parse(P)
                                                        : null
                                            } catch (e1) {
                                                ;(P = s2),
                                                    Q &&
                                                        ((Q = !1),
                                                        (P = {
                                                            error: e1,
                                                            text: P,
                                                        }))
                                            }
                                        }
                                        Q
                                            ? (o.next(
                                                  new s4({
                                                      body: P,
                                                      headers: C,
                                                      status: M,
                                                      statusText: E,
                                                      url: F || void 0,
                                                  })
                                              ),
                                              o.complete())
                                            : o.error(
                                                  new Ct({
                                                      error: P,
                                                      headers: C,
                                                      status: M,
                                                      statusText: E,
                                                      url: F || void 0,
                                                  })
                                              )
                                    },
                                    d = C => {
                                        let { url: M } = f(),
                                            E = new Ct({
                                                error: C,
                                                status: c.status || 0,
                                                statusText:
                                                    c.statusText ||
                                                    'Unknown Error',
                                                url: M || void 0,
                                            })
                                        o.error(E)
                                    },
                                    p = !1,
                                    m = C => {
                                        p || (o.next(f()), (p = !0))
                                        let M = {
                                            type: c4.DownloadProgress,
                                            loaded: C.loaded,
                                        }
                                        C.lengthComputable &&
                                            (M.total = C.total),
                                            n.responseType === 'text' &&
                                                c.responseText &&
                                                (M.partialText =
                                                    c.responseText),
                                            o.next(M)
                                    },
                                    v = C => {
                                        let M = {
                                            type: c4.UploadProgress,
                                            loaded: C.loaded,
                                        }
                                        C.lengthComputable &&
                                            (M.total = C.total),
                                            o.next(M)
                                    }
                                return (
                                    c.addEventListener('load', u),
                                    c.addEventListener('error', d),
                                    c.addEventListener('timeout', d),
                                    c.addEventListener('abort', d),
                                    n.reportProgress &&
                                        (c.addEventListener('progress', m),
                                        s !== null &&
                                            c.upload &&
                                            c.upload.addEventListener(
                                                'progress',
                                                v
                                            )),
                                    c.send(s),
                                    o.next({ type: c4.Sent }),
                                    () => {
                                        c.removeEventListener('error', d),
                                            c.removeEventListener('abort', d),
                                            c.removeEventListener('load', u),
                                            c.removeEventListener('timeout', d),
                                            n.reportProgress &&
                                                (c.removeEventListener(
                                                    'progress',
                                                    m
                                                ),
                                                s !== null &&
                                                    c.upload &&
                                                    c.upload.removeEventListener(
                                                        'progress',
                                                        v
                                                    )),
                                            c.readyState !== c.DONE && c.abort()
                                    }
                                )
                            })
                    )
                )
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(o4))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })(),
    yl = new b(''),
    Eg = 'XSRF-TOKEN',
    Ig = new b('', { providedIn: 'root', factory: () => Eg }),
    Tg = 'X-XSRF-TOKEN',
    Ag = new b('', { providedIn: 'root', factory: () => Tg }),
    zt = class {},
    kg = (() => {
        let t = class t {
            constructor(n, a, i) {
                ;(this.doc = n),
                    (this.platform = a),
                    (this.cookieName = i),
                    (this.lastCookieString = ''),
                    (this.lastToken = null),
                    (this.parseCount = 0)
            }
            getToken() {
                if (this.platform === 'server') return null
                let n = this.doc.cookie || ''
                return (
                    n !== this.lastCookieString &&
                        (this.parseCount++,
                        (this.lastToken = ht(n, this.cookieName)),
                        (this.lastCookieString = n)),
                    this.lastToken
                )
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(C2), D(Z2), D(Ig))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })()
function Rg(e, t) {
    let r = e.url.toLowerCase()
    if (
        !g(yl) ||
        e.method === 'GET' ||
        e.method === 'HEAD' ||
        r.startsWith('http://') ||
        r.startsWith('https://')
    )
        return t(e)
    let n = g(zt).getToken(),
        a = g(Ag)
    return (
        n != null &&
            !e.headers.has(a) &&
            (e = e.clone({ headers: e.headers.set(a, n) })),
        t(e)
    )
}
var zl = (function (e) {
    return (
        (e[(e.Interceptors = 0)] = 'Interceptors'),
        (e[(e.LegacyInterceptors = 1)] = 'LegacyInterceptors'),
        (e[(e.CustomXsrfConfiguration = 2)] = 'CustomXsrfConfiguration'),
        (e[(e.NoXsrfProtection = 3)] = 'NoXsrfProtection'),
        (e[(e.JsonpSupport = 4)] = 'JsonpSupport'),
        (e[(e.RequestsMadeViaParent = 5)] = 'RequestsMadeViaParent'),
        (e[(e.Fetch = 6)] = 'Fetch'),
        e
    )
})(zl || {})
function Pg(e, t) {
    return { ɵkind: e, ɵproviders: t }
}
function _g(...e) {
    let t = [
        zg,
        ll,
        sl,
        { provide: r3, useExisting: sl },
        { provide: Mt, useExisting: ll },
        { provide: T6, useValue: Rg, multi: !0 },
        { provide: yl, useValue: !0 },
        { provide: zt, useClass: kg },
    ]
    for (let r of e) t.push(...r.ɵproviders)
    return O1(t)
}
var fl = new b('')
function Fg() {
    return Pg(zl.LegacyInterceptors, [
        { provide: fl, useFactory: xg },
        { provide: T6, useExisting: fl, multi: !0 },
    ])
}
var Ll = (() => {
    let t = class t {}
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵmod = F1({ type: t })),
        (t.ɵinj = _1({ providers: [_g(Fg())] }))
    let e = t
    return e
})()
var ul = 'b',
    dl = 'h',
    pl = 's',
    hl = 'st',
    ml = 'u',
    gl = 'rt',
    vt = new b(''),
    Og = ['GET', 'HEAD']
function Bg(e, t) {
    let u = g(vt),
        { isCacheActive: r } = u,
        n = ui(u, ['isCacheActive']),
        { transferCache: a, method: i } = e
    if (
        !r ||
        (i === 'POST' && !n.includePostRequests && !a) ||
        (i !== 'POST' && !Og.includes(i)) ||
        a === !1 ||
        n.filter?.(e) === !1
    )
        return t(e)
    let o = g(ve),
        c = Ug(e),
        s = o.get(c, null),
        l = n.includeHeaders
    if (
        (typeof a == 'object' && a.includeHeaders && (l = a.includeHeaders), s)
    ) {
        let { [ul]: d, [gl]: p, [dl]: m, [pl]: v, [hl]: C, [ml]: M } = s,
            E = d
        switch (p) {
            case 'arraybuffer':
                E = new TextEncoder().encode(d).buffer
                break
            case 'blob':
                E = new Blob([d])
                break
        }
        let F = new W1(m)
        return S(
            new s4({ body: E, headers: F, status: v, statusText: C, url: M })
        )
    }
    let f = t3(g(Z2))
    return t(e).pipe(
        a2(d => {
            d instanceof s4 &&
                f &&
                o.set(c, {
                    [ul]: d.body,
                    [dl]: jg(d.headers, l),
                    [pl]: d.status,
                    [hl]: d.statusText,
                    [ml]: d.url || '',
                    [gl]: e.responseType,
                })
        })
    )
}
function jg(e, t) {
    if (!t) return {}
    let r = {}
    for (let n of t) {
        let a = e.getAll(n)
        a !== null && (r[n] = a)
    }
    return r
}
function vl(e) {
    return [...e.keys()]
        .sort()
        .map(t => `${t}=${e.getAll(t)}`)
        .join('&')
}
function Ug(e) {
    let { params: t, method: r, responseType: n, url: a } = e,
        i = vl(t),
        o = e.serializeBody()
    o instanceof URLSearchParams
        ? (o = vl(o))
        : typeof o != 'string' && (o = '')
    let c = [r, n, a, o, i].join('|'),
        s = Hg(c)
    return s
}
function Hg(e) {
    let t = 0
    for (let r of e) t = (Math.imul(31, t) + r.charCodeAt(0)) << 0
    return (t += 2147483648), t.toString()
}
function wl(e) {
    return [
        {
            provide: vt,
            useFactory: () => (
                t4('NgHttpTransferCache'), z({ isCacheActive: !0 }, e)
            ),
        },
        { provide: Cl, useValue: Bg, multi: !0, deps: [ve, vt] },
        {
            provide: a4,
            multi: !0,
            useFactory: () => {
                let t = g(V1),
                    r = g(vt)
                return () => {
                    C6(t).then(() => {
                        r.isCacheActive = !1
                    })
                }
            },
        },
    ]
}
var R6 = class extends ut {
        constructor() {
            super(...arguments), (this.supportsDOMEvents = !0)
        }
    },
    P6 = class e extends R6 {
        static makeCurrent() {
            Q8(new e())
        }
        onAndCancel(t, r, n) {
            return (
                t.addEventListener(r, n),
                () => {
                    t.removeEventListener(r, n)
                }
            )
        }
        dispatchEvent(t, r) {
            t.dispatchEvent(r)
        }
        remove(t) {
            t.parentNode && t.parentNode.removeChild(t)
        }
        createElement(t, r) {
            return (r = r || this.getDefaultDocument()), r.createElement(t)
        }
        createHtmlDocument() {
            return document.implementation.createHTMLDocument('fakeTitle')
        }
        getDefaultDocument() {
            return document
        }
        isElementNode(t) {
            return t.nodeType === Node.ELEMENT_NODE
        }
        isShadowRoot(t) {
            return t instanceof DocumentFragment
        }
        getGlobalEventTarget(t, r) {
            return r === 'window'
                ? window
                : r === 'document'
                ? t
                : r === 'body'
                ? t.body
                : null
        }
        getBaseHref(t) {
            let r = Vg()
            return r == null ? null : $g(r)
        }
        resetBaseElement() {
            i3 = null
        }
        getUserAgent() {
            return window.navigator.userAgent
        }
        getCookie(t) {
            return ht(document.cookie, t)
        }
    },
    i3 = null
function Vg() {
    return (
        (i3 = i3 || document.querySelector('base')),
        i3 ? i3.getAttribute('href') : null
    )
}
function $g(e) {
    return new URL(e, document.baseURI).pathname
}
var Wg = (() => {
        let t = class t {
            build() {
                return new XMLHttpRequest()
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })(),
    _6 = new b(''),
    Dl = (() => {
        let t = class t {
            constructor(n, a) {
                ;(this._zone = a),
                    (this._eventNameToPlugin = new Map()),
                    n.forEach(i => {
                        i.manager = this
                    }),
                    (this._plugins = n.slice().reverse())
            }
            addEventListener(n, a, i) {
                return this._findPluginFor(a).addEventListener(n, a, i)
            }
            getZone() {
                return this._zone
            }
            _findPluginFor(n) {
                let a = this._eventNameToPlugin.get(n)
                if (a) return a
                if (((a = this._plugins.find(o => o.supports(n))), !a))
                    throw new w(5101, !1)
                return this._eventNameToPlugin.set(n, a), a
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(_6), D(J))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })(),
    Lt = class {
        constructor(t) {
            this._doc = t
        }
    },
    A6 = 'ng-app-id',
    Nl = (() => {
        let t = class t {
            constructor(n, a, i, o = {}) {
                ;(this.doc = n),
                    (this.appId = a),
                    (this.nonce = i),
                    (this.platformId = o),
                    (this.styleRef = new Map()),
                    (this.hostNodes = new Set()),
                    (this.styleNodesInDOM = this.collectServerRenderedStyles()),
                    (this.platformIsServer = t3(o)),
                    this.resetHostNodes()
            }
            addStyles(n) {
                for (let a of n)
                    this.changeUsageCount(a, 1) === 1 && this.onStyleAdded(a)
            }
            removeStyles(n) {
                for (let a of n)
                    this.changeUsageCount(a, -1) <= 0 && this.onStyleRemoved(a)
            }
            ngOnDestroy() {
                let n = this.styleNodesInDOM
                n && (n.forEach(a => a.remove()), n.clear())
                for (let a of this.getAllStyles()) this.onStyleRemoved(a)
                this.resetHostNodes()
            }
            addHost(n) {
                this.hostNodes.add(n)
                for (let a of this.getAllStyles()) this.addStyleToHost(n, a)
            }
            removeHost(n) {
                this.hostNodes.delete(n)
            }
            getAllStyles() {
                return this.styleRef.keys()
            }
            onStyleAdded(n) {
                for (let a of this.hostNodes) this.addStyleToHost(a, n)
            }
            onStyleRemoved(n) {
                let a = this.styleRef
                a.get(n)?.elements?.forEach(i => i.remove()), a.delete(n)
            }
            collectServerRenderedStyles() {
                let n = this.doc.head?.querySelectorAll(
                    `style[${A6}="${this.appId}"]`
                )
                if (n?.length) {
                    let a = new Map()
                    return (
                        n.forEach(i => {
                            i.textContent != null && a.set(i.textContent, i)
                        }),
                        a
                    )
                }
                return null
            }
            changeUsageCount(n, a) {
                let i = this.styleRef
                if (i.has(n)) {
                    let o = i.get(n)
                    return (o.usage += a), o.usage
                }
                return i.set(n, { usage: a, elements: [] }), a
            }
            getStyleElement(n, a) {
                let i = this.styleNodesInDOM,
                    o = i?.get(a)
                if (o?.parentNode === n)
                    return i.delete(a), o.removeAttribute(A6), o
                {
                    let c = this.doc.createElement('style')
                    return (
                        this.nonce && c.setAttribute('nonce', this.nonce),
                        (c.textContent = a),
                        this.platformIsServer && c.setAttribute(A6, this.appId),
                        n.appendChild(c),
                        c
                    )
                }
            }
            addStyleToHost(n, a) {
                let i = this.getStyleElement(n, a),
                    o = this.styleRef,
                    c = o.get(a)?.elements
                c ? c.push(i) : o.set(a, { elements: [i], usage: 1 })
            }
            resetHostNodes() {
                let n = this.hostNodes
                n.clear(), n.add(this.doc.head)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(C2), D(W0), D(Kr, 8), D(Z2))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })(),
    k6 = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/',
        math: 'http://www.w3.org/1998/MathML/',
    },
    B6 = /%COMP%/g,
    El = '%COMP%',
    qg = `_nghost-${El}`,
    Gg = `_ngcontent-${El}`,
    Yg = !0,
    Qg = new b('', { providedIn: 'root', factory: () => Yg })
function Zg(e) {
    return Gg.replace(B6, e)
}
function Kg(e) {
    return qg.replace(B6, e)
}
function Il(e, t) {
    return t.map(r => r.replace(B6, e))
}
var bl = (() => {
        let t = class t {
            constructor(n, a, i, o, c, s, l, f = null) {
                ;(this.eventManager = n),
                    (this.sharedStylesHost = a),
                    (this.appId = i),
                    (this.removeStylesOnCompDestroy = o),
                    (this.doc = c),
                    (this.platformId = s),
                    (this.ngZone = l),
                    (this.nonce = f),
                    (this.rendererByCompId = new Map()),
                    (this.platformIsServer = t3(s)),
                    (this.defaultRenderer = new o3(
                        n,
                        c,
                        l,
                        this.platformIsServer
                    ))
            }
            createRenderer(n, a) {
                if (!n || !a) return this.defaultRenderer
                this.platformIsServer &&
                    a.encapsulation === r1.ShadowDom &&
                    (a = K(z({}, a), { encapsulation: r1.Emulated }))
                let i = this.getOrCreateRenderer(n, a)
                return (
                    i instanceof wt
                        ? i.applyToHost(n)
                        : i instanceof c3 && i.applyStyles(),
                    i
                )
            }
            getOrCreateRenderer(n, a) {
                let i = this.rendererByCompId,
                    o = i.get(a.id)
                if (!o) {
                    let c = this.doc,
                        s = this.ngZone,
                        l = this.eventManager,
                        f = this.sharedStylesHost,
                        u = this.removeStylesOnCompDestroy,
                        d = this.platformIsServer
                    switch (a.encapsulation) {
                        case r1.Emulated:
                            o = new wt(l, f, a, this.appId, u, c, s, d)
                            break
                        case r1.ShadowDom:
                            return new F6(l, f, n, a, c, s, this.nonce, d)
                        default:
                            o = new c3(l, f, a, u, c, s, d)
                            break
                    }
                    i.set(a.id, o)
                }
                return o
            }
            ngOnDestroy() {
                this.rendererByCompId.clear()
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(
                D(Dl),
                D(Nl),
                D(W0),
                D(Qg),
                D(C2),
                D(Z2),
                D(J),
                D(Kr)
            )
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })(),
    o3 = class {
        constructor(t, r, n, a) {
            ;(this.eventManager = t),
                (this.doc = r),
                (this.ngZone = n),
                (this.platformIsServer = a),
                (this.data = Object.create(null)),
                (this.throwOnSyntheticProps = !0),
                (this.destroyNode = null)
        }
        destroy() {}
        createElement(t, r) {
            return r
                ? this.doc.createElementNS(k6[r] || r, t)
                : this.doc.createElement(t)
        }
        createComment(t) {
            return this.doc.createComment(t)
        }
        createText(t) {
            return this.doc.createTextNode(t)
        }
        appendChild(t, r) {
            ;(Sl(t) ? t.content : t).appendChild(r)
        }
        insertBefore(t, r, n) {
            t && (Sl(t) ? t.content : t).insertBefore(r, n)
        }
        removeChild(t, r) {
            t && t.removeChild(r)
        }
        selectRootElement(t, r) {
            let n = typeof t == 'string' ? this.doc.querySelector(t) : t
            if (!n) throw new w(-5104, !1)
            return r || (n.textContent = ''), n
        }
        parentNode(t) {
            return t.parentNode
        }
        nextSibling(t) {
            return t.nextSibling
        }
        setAttribute(t, r, n, a) {
            if (a) {
                r = a + ':' + r
                let i = k6[a]
                i ? t.setAttributeNS(i, r, n) : t.setAttribute(r, n)
            } else t.setAttribute(r, n)
        }
        removeAttribute(t, r, n) {
            if (n) {
                let a = k6[n]
                a ? t.removeAttributeNS(a, r) : t.removeAttribute(`${n}:${r}`)
            } else t.removeAttribute(r)
        }
        addClass(t, r) {
            t.classList.add(r)
        }
        removeClass(t, r) {
            t.classList.remove(r)
        }
        setStyle(t, r, n, a) {
            a & (g1.DashCase | g1.Important)
                ? t.style.setProperty(r, n, a & g1.Important ? 'important' : '')
                : (t.style[r] = n)
        }
        removeStyle(t, r, n) {
            n & g1.DashCase ? t.style.removeProperty(r) : (t.style[r] = '')
        }
        setProperty(t, r, n) {
            t != null && (t[r] = n)
        }
        setValue(t, r) {
            t.nodeValue = r
        }
        listen(t, r, n) {
            if (
                typeof t == 'string' &&
                ((t = i4().getGlobalEventTarget(this.doc, t)), !t)
            )
                throw new Error(`Unsupported event target ${t} for event ${r}`)
            return this.eventManager.addEventListener(
                t,
                r,
                this.decoratePreventDefault(n)
            )
        }
        decoratePreventDefault(t) {
            return r => {
                if (r === '__ngUnwrap__') return t
                ;(this.platformIsServer
                    ? this.ngZone.runGuarded(() => t(r))
                    : t(r)) === !1 && r.preventDefault()
            }
        }
    }
function Sl(e) {
    return e.tagName === 'TEMPLATE' && e.content !== void 0
}
var F6 = class extends o3 {
        constructor(t, r, n, a, i, o, c, s) {
            super(t, i, o, s),
                (this.sharedStylesHost = r),
                (this.hostEl = n),
                (this.shadowRoot = n.attachShadow({ mode: 'open' })),
                this.sharedStylesHost.addHost(this.shadowRoot)
            let l = Il(a.id, a.styles)
            for (let f of l) {
                let u = document.createElement('style')
                c && u.setAttribute('nonce', c),
                    (u.textContent = f),
                    this.shadowRoot.appendChild(u)
            }
        }
        nodeOrShadowRoot(t) {
            return t === this.hostEl ? this.shadowRoot : t
        }
        appendChild(t, r) {
            return super.appendChild(this.nodeOrShadowRoot(t), r)
        }
        insertBefore(t, r, n) {
            return super.insertBefore(this.nodeOrShadowRoot(t), r, n)
        }
        removeChild(t, r) {
            return super.removeChild(this.nodeOrShadowRoot(t), r)
        }
        parentNode(t) {
            return this.nodeOrShadowRoot(
                super.parentNode(this.nodeOrShadowRoot(t))
            )
        }
        destroy() {
            this.sharedStylesHost.removeHost(this.shadowRoot)
        }
    },
    c3 = class extends o3 {
        constructor(t, r, n, a, i, o, c, s) {
            super(t, i, o, c),
                (this.sharedStylesHost = r),
                (this.removeStylesOnCompDestroy = a),
                (this.styles = s ? Il(s, n.styles) : n.styles)
        }
        applyStyles() {
            this.sharedStylesHost.addStyles(this.styles)
        }
        destroy() {
            this.removeStylesOnCompDestroy &&
                this.sharedStylesHost.removeStyles(this.styles)
        }
    },
    wt = class extends c3 {
        constructor(t, r, n, a, i, o, c, s) {
            let l = a + '-' + n.id
            super(t, r, n, i, o, c, s, l),
                (this.contentAttr = Zg(l)),
                (this.hostAttr = Kg(l))
        }
        applyToHost(t) {
            this.applyStyles(), this.setAttribute(t, this.hostAttr, '')
        }
        createElement(t, r) {
            let n = super.createElement(t, r)
            return super.setAttribute(n, this.contentAttr, ''), n
        }
    },
    Xg = (() => {
        let t = class t extends Lt {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return !0
            }
            addEventListener(n, a, i) {
                return (
                    n.addEventListener(a, i, !1),
                    () => this.removeEventListener(n, a, i)
                )
            }
            removeEventListener(n, a, i) {
                return n.removeEventListener(a, i)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(C2))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })(),
    xl = ['alt', 'control', 'meta', 'shift'],
    Jg = {
        '\b': 'Backspace',
        '	': 'Tab',
        '\x7F': 'Delete',
        '\x1B': 'Escape',
        Del: 'Delete',
        Esc: 'Escape',
        Left: 'ArrowLeft',
        Right: 'ArrowRight',
        Up: 'ArrowUp',
        Down: 'ArrowDown',
        Menu: 'ContextMenu',
        Scroll: 'ScrollLock',
        Win: 'OS',
    },
    ev = {
        alt: e => e.altKey,
        control: e => e.ctrlKey,
        meta: e => e.metaKey,
        shift: e => e.shiftKey,
    },
    tv = (() => {
        let t = class t extends Lt {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return t.parseEventName(n) != null
            }
            addEventListener(n, a, i) {
                let o = t.parseEventName(a),
                    c = t.eventCallback(o.fullKey, i, this.manager.getZone())
                return this.manager
                    .getZone()
                    .runOutsideAngular(() =>
                        i4().onAndCancel(n, o.domEventName, c)
                    )
            }
            static parseEventName(n) {
                let a = n.toLowerCase().split('.'),
                    i = a.shift()
                if (a.length === 0 || !(i === 'keydown' || i === 'keyup'))
                    return null
                let o = t._normalizeKey(a.pop()),
                    c = '',
                    s = a.indexOf('code')
                if (
                    (s > -1 && (a.splice(s, 1), (c = 'code.')),
                    xl.forEach(f => {
                        let u = a.indexOf(f)
                        u > -1 && (a.splice(u, 1), (c += f + '.'))
                    }),
                    (c += o),
                    a.length != 0 || o.length === 0)
                )
                    return null
                let l = {}
                return (l.domEventName = i), (l.fullKey = c), l
            }
            static matchEventFullKeyCode(n, a) {
                let i = Jg[n.key] || n.key,
                    o = ''
                return (
                    a.indexOf('code.') > -1 && ((i = n.code), (o = 'code.')),
                    i == null || !i
                        ? !1
                        : ((i = i.toLowerCase()),
                          i === ' ' ? (i = 'space') : i === '.' && (i = 'dot'),
                          xl.forEach(c => {
                              if (c !== i) {
                                  let s = ev[c]
                                  s(n) && (o += c + '.')
                              }
                          }),
                          (o += i),
                          o === a)
                )
            }
            static eventCallback(n, a, i) {
                return o => {
                    t.matchEventFullKeyCode(o, n) && i.runGuarded(() => a(o))
                }
            }
            static _normalizeKey(n) {
                return n === 'esc' ? 'escape' : n
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(C2))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac }))
        let e = t
        return e
    })()
function Tl(e, t) {
    return B8(z({ rootComponent: e }, nv(t)))
}
function nv(e) {
    return {
        appProviders: [...cv, ...(e?.providers ?? [])],
        platformProviders: ov,
    }
}
function rv() {
    P6.makeCurrent()
}
function av() {
    return new h1()
}
function iv() {
    return ps(document), document
}
var ov = [
    { provide: Z2, useValue: rl },
    { provide: Zr, useValue: rv, multi: !0 },
    { provide: C2, useFactory: iv, deps: [] },
]
var cv = [
    { provide: B0, useValue: 'root' },
    { provide: h1, useFactory: av, deps: [] },
    { provide: _6, useClass: Xg, multi: !0, deps: [C2, J, Z2] },
    { provide: _6, useClass: tv, multi: !0, deps: [C2] },
    bl,
    Nl,
    Dl,
    { provide: _4, useExisting: bl },
    { provide: o4, useClass: Wg, deps: [] },
    [],
]
var Al = (() => {
    let t = class t {
        constructor(n) {
            this._doc = n
        }
        getTitle() {
            return this._doc.title
        }
        setTitle(n) {
            this._doc.title = n || ''
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(D(C2))
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
var j6 = (() => {
        let t = class t {}
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: function (a) {
                    let i = null
                    return a ? (i = new (a || t)()) : (i = D(sv)), i
                },
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    sv = (() => {
        let t = class t extends j6 {
            constructor(n) {
                super(), (this._doc = n)
            }
            sanitize(n, a) {
                if (a == null) return null
                switch (n) {
                    case z1.NONE:
                        return a
                    case z1.HTML:
                        return Me(a, 'HTML')
                            ? C1(a)
                            : n6(this._doc, String(a)).toString()
                    case z1.STYLE:
                        return Me(a, 'Style') ? C1(a) : a
                    case z1.SCRIPT:
                        if (Me(a, 'Script')) return C1(a)
                        throw new w(5200, !1)
                    case z1.URL:
                        return Me(a, 'URL') ? C1(a) : t6(String(a))
                    case z1.RESOURCE_URL:
                        if (Me(a, 'ResourceURL')) return C1(a)
                        throw new w(5201, !1)
                    default:
                        throw new w(5202, !1)
                }
            }
            bypassSecurityTrustHtml(n) {
                return Ls(n)
            }
            bypassSecurityTrustStyle(n) {
                return ws(n)
            }
            bypassSecurityTrustScript(n) {
                return bs(n)
            }
            bypassSecurityTrustUrl(n) {
                return Ss(n)
            }
            bypassSecurityTrustResourceUrl(n) {
                return xs(n)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(C2))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    O6 = (function (e) {
        return (
            (e[(e.NoHttpTransferCache = 0)] = 'NoHttpTransferCache'),
            (e[(e.HttpTransferCacheOptions = 1)] = 'HttpTransferCacheOptions'),
            e
        )
    })(O6 || {})
function kl(...e) {
    let t = [],
        r = new Set(),
        n = r.has(O6.HttpTransferCacheOptions)
    for (let { ɵproviders: a, ɵkind: i } of e) r.add(i), a.length && t.push(a)
    return O1([[], j8(), r.has(O6.NoHttpTransferCache) || n ? [] : wl({}), t])
}
var I = 'primary',
    L3 = Symbol('RouteTitle'),
    W6 = class {
        constructor(t) {
            this.params = t || {}
        }
        has(t) {
            return Object.prototype.hasOwnProperty.call(this.params, t)
        }
        get(t) {
            if (this.has(t)) {
                let r = this.params[t]
                return Array.isArray(r) ? r[0] : r
            }
            return null
        }
        getAll(t) {
            if (this.has(t)) {
                let r = this.params[t]
                return Array.isArray(r) ? r : [r]
            }
            return []
        }
        get keys() {
            return Object.keys(this.params)
        }
    }
function p4(e) {
    return new W6(e)
}
function lv(e, t, r) {
    let n = r.path.split('/')
    if (
        n.length > e.length ||
        (r.pathMatch === 'full' && (t.hasChildren() || n.length < e.length))
    )
        return null
    let a = {}
    for (let i = 0; i < n.length; i++) {
        let o = n[i],
            c = e[i]
        if (o.startsWith(':')) a[o.substring(1)] = c
        else if (o !== c.path) return null
    }
    return { consumed: e.slice(0, n.length), posParams: a }
}
function fv(e, t) {
    if (e.length !== t.length) return !1
    for (let r = 0; r < e.length; ++r) if (!c1(e[r], t[r])) return !1
    return !0
}
function c1(e, t) {
    let r = e ? q6(e) : void 0,
        n = t ? q6(t) : void 0
    if (!r || !n || r.length != n.length) return !1
    let a
    for (let i = 0; i < r.length; i++)
        if (((a = r[i]), !jl(e[a], t[a]))) return !1
    return !0
}
function q6(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function jl(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1
        let r = [...e].sort(),
            n = [...t].sort()
        return r.every((a, i) => n[i] === a)
    } else return e === t
}
function Ul(e) {
    return e.length > 0 ? e[e.length - 1] : null
}
function Y1(e) {
    return gn(e) ? e : K4(e) ? X(Promise.resolve(e)) : S(e)
}
var uv = { exact: Vl, subset: $l },
    Hl = { exact: dv, subset: pv, ignored: () => !0 }
function Pl(e, t, r) {
    return (
        uv[r.paths](e.root, t.root, r.matrixParams) &&
        Hl[r.queryParams](e.queryParams, t.queryParams) &&
        !(r.fragment === 'exact' && e.fragment !== t.fragment)
    )
}
function dv(e, t) {
    return c1(e, t)
}
function Vl(e, t, r) {
    if (
        !xe(e.segments, t.segments) ||
        !xt(e.segments, t.segments, r) ||
        e.numberOfChildren !== t.numberOfChildren
    )
        return !1
    for (let n in t.children)
        if (!e.children[n] || !Vl(e.children[n], t.children[n], r)) return !1
    return !0
}
function pv(e, t) {
    return (
        Object.keys(t).length <= Object.keys(e).length &&
        Object.keys(t).every(r => jl(e[r], t[r]))
    )
}
function $l(e, t, r) {
    return Wl(e, t, t.segments, r)
}
function Wl(e, t, r, n) {
    if (e.segments.length > r.length) {
        let a = e.segments.slice(0, r.length)
        return !(!xe(a, r) || t.hasChildren() || !xt(a, r, n))
    } else if (e.segments.length === r.length) {
        if (!xe(e.segments, r) || !xt(e.segments, r, n)) return !1
        for (let a in t.children)
            if (!e.children[a] || !$l(e.children[a], t.children[a], n))
                return !1
        return !0
    } else {
        let a = r.slice(0, e.segments.length),
            i = r.slice(e.segments.length)
        return !xe(e.segments, a) || !xt(e.segments, a, n) || !e.children[I]
            ? !1
            : Wl(e.children[I], t, i, n)
    }
}
function xt(e, t, r) {
    return t.every((n, a) => Hl[r](e[a].parameters, n.parameters))
}
var q1 = class {
        constructor(t = new H([], {}), r = {}, n = null) {
            ;(this.root = t), (this.queryParams = r), (this.fragment = n)
        }
        get queryParamMap() {
            return (
                (this._queryParamMap ??= p4(this.queryParams)),
                this._queryParamMap
            )
        }
        toString() {
            return gv.serialize(this)
        }
    },
    H = class {
        constructor(t, r) {
            ;(this.segments = t),
                (this.children = r),
                (this.parent = null),
                Object.values(r).forEach(n => (n.parent = this))
        }
        hasChildren() {
            return this.numberOfChildren > 0
        }
        get numberOfChildren() {
            return Object.keys(this.children).length
        }
        toString() {
            return Dt(this)
        }
    },
    Se = class {
        constructor(t, r) {
            ;(this.path = t), (this.parameters = r)
        }
        get parameterMap() {
            return (
                (this._parameterMap ??= p4(this.parameters)), this._parameterMap
            )
        }
        toString() {
            return Gl(this)
        }
    }
function hv(e, t) {
    return xe(e, t) && e.every((r, n) => c1(r.parameters, t[n].parameters))
}
function xe(e, t) {
    return e.length !== t.length ? !1 : e.every((r, n) => r.path === t[n].path)
}
function mv(e, t) {
    let r = []
    return (
        Object.entries(e.children).forEach(([n, a]) => {
            n === I && (r = r.concat(t(a, n)))
        }),
        Object.entries(e.children).forEach(([n, a]) => {
            n !== I && (r = r.concat(t(a, n)))
        }),
        r
    )
}
var Ma = (() => {
        let t = class t {}
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => new Et(),
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    Et = class {
        parse(t) {
            let r = new Y6(t)
            return new q1(
                r.parseRootSegment(),
                r.parseQueryParams(),
                r.parseFragment()
            )
        }
        serialize(t) {
            let r = `/${s3(t.root, !0)}`,
                n = Cv(t.queryParams),
                a = typeof t.fragment == 'string' ? `#${vv(t.fragment)}` : ''
            return `${r}${n}${a}`
        }
    },
    gv = new Et()
function Dt(e) {
    return e.segments.map(t => Gl(t)).join('/')
}
function s3(e, t) {
    if (!e.hasChildren()) return Dt(e)
    if (t) {
        let r = e.children[I] ? s3(e.children[I], !1) : '',
            n = []
        return (
            Object.entries(e.children).forEach(([a, i]) => {
                a !== I && n.push(`${a}:${s3(i, !1)}`)
            }),
            n.length > 0 ? `${r}(${n.join('//')})` : r
        )
    } else {
        let r = mv(e, (n, a) =>
            a === I ? [s3(e.children[I], !1)] : [`${a}:${s3(n, !1)}`]
        )
        return Object.keys(e.children).length === 1 && e.children[I] != null
            ? `${Dt(e)}/${r[0]}`
            : `${Dt(e)}/(${r.join('//')})`
    }
}
function ql(e) {
    return encodeURIComponent(e)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
}
function bt(e) {
    return ql(e).replace(/%3B/gi, ';')
}
function vv(e) {
    return encodeURI(e)
}
function G6(e) {
    return ql(e)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/%26/gi, '&')
}
function Nt(e) {
    return decodeURIComponent(e)
}
function _l(e) {
    return Nt(e.replace(/\+/g, '%20'))
}
function Gl(e) {
    return `${G6(e.path)}${Mv(e.parameters)}`
}
function Mv(e) {
    return Object.entries(e)
        .map(([t, r]) => `;${G6(t)}=${G6(r)}`)
        .join('')
}
function Cv(e) {
    let t = Object.entries(e)
        .map(([r, n]) =>
            Array.isArray(n)
                ? n.map(a => `${bt(r)}=${bt(a)}`).join('&')
                : `${bt(r)}=${bt(n)}`
        )
        .filter(r => r)
    return t.length ? `?${t.join('&')}` : ''
}
var yv = /^[^\/()?;#]+/
function U6(e) {
    let t = e.match(yv)
    return t ? t[0] : ''
}
var zv = /^[^\/()?;=#]+/
function Lv(e) {
    let t = e.match(zv)
    return t ? t[0] : ''
}
var wv = /^[^=?&#]+/
function bv(e) {
    let t = e.match(wv)
    return t ? t[0] : ''
}
var Sv = /^[^&#]+/
function xv(e) {
    let t = e.match(Sv)
    return t ? t[0] : ''
}
var Y6 = class {
    constructor(t) {
        ;(this.url = t), (this.remaining = t)
    }
    parseRootSegment() {
        return (
            this.consumeOptional('/'),
            this.remaining === '' ||
            this.peekStartsWith('?') ||
            this.peekStartsWith('#')
                ? new H([], {})
                : new H([], this.parseChildren())
        )
    }
    parseQueryParams() {
        let t = {}
        if (this.consumeOptional('?'))
            do this.parseQueryParam(t)
            while (this.consumeOptional('&'))
        return t
    }
    parseFragment() {
        return this.consumeOptional('#')
            ? decodeURIComponent(this.remaining)
            : null
    }
    parseChildren() {
        if (this.remaining === '') return {}
        this.consumeOptional('/')
        let t = []
        for (
            this.peekStartsWith('(') || t.push(this.parseSegment());
            this.peekStartsWith('/') &&
            !this.peekStartsWith('//') &&
            !this.peekStartsWith('/(');

        )
            this.capture('/'), t.push(this.parseSegment())
        let r = {}
        this.peekStartsWith('/(') &&
            (this.capture('/'), (r = this.parseParens(!0)))
        let n = {}
        return (
            this.peekStartsWith('(') && (n = this.parseParens(!1)),
            (t.length > 0 || Object.keys(r).length > 0) && (n[I] = new H(t, r)),
            n
        )
    }
    parseSegment() {
        let t = U6(this.remaining)
        if (t === '' && this.peekStartsWith(';')) throw new w(4009, !1)
        return this.capture(t), new Se(Nt(t), this.parseMatrixParams())
    }
    parseMatrixParams() {
        let t = {}
        for (; this.consumeOptional(';'); ) this.parseParam(t)
        return t
    }
    parseParam(t) {
        let r = Lv(this.remaining)
        if (!r) return
        this.capture(r)
        let n = ''
        if (this.consumeOptional('=')) {
            let a = U6(this.remaining)
            a && ((n = a), this.capture(n))
        }
        t[Nt(r)] = Nt(n)
    }
    parseQueryParam(t) {
        let r = bv(this.remaining)
        if (!r) return
        this.capture(r)
        let n = ''
        if (this.consumeOptional('=')) {
            let o = xv(this.remaining)
            o && ((n = o), this.capture(n))
        }
        let a = _l(r),
            i = _l(n)
        if (t.hasOwnProperty(a)) {
            let o = t[a]
            Array.isArray(o) || ((o = [o]), (t[a] = o)), o.push(i)
        } else t[a] = i
    }
    parseParens(t) {
        let r = {}
        for (
            this.capture('(');
            !this.consumeOptional(')') && this.remaining.length > 0;

        ) {
            let n = U6(this.remaining),
                a = this.remaining[n.length]
            if (a !== '/' && a !== ')' && a !== ';') throw new w(4010, !1)
            let i
            n.indexOf(':') > -1
                ? ((i = n.slice(0, n.indexOf(':'))),
                  this.capture(i),
                  this.capture(':'))
                : t && (i = I)
            let o = this.parseChildren()
            ;(r[i] = Object.keys(o).length === 1 ? o[I] : new H([], o)),
                this.consumeOptional('//')
        }
        return r
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t)
    }
    consumeOptional(t) {
        return this.peekStartsWith(t)
            ? ((this.remaining = this.remaining.substring(t.length)), !0)
            : !1
    }
    capture(t) {
        if (!this.consumeOptional(t)) throw new w(4011, !1)
    }
}
function Yl(e) {
    return e.segments.length > 0 ? new H([], { [I]: e }) : e
}
function Ql(e) {
    let t = {}
    for (let [n, a] of Object.entries(e.children)) {
        let i = Ql(a)
        if (n === I && i.segments.length === 0 && i.hasChildren())
            for (let [o, c] of Object.entries(i.children)) t[o] = c
        else (i.segments.length > 0 || i.hasChildren()) && (t[n] = i)
    }
    let r = new H(e.segments, t)
    return Dv(r)
}
function Dv(e) {
    if (e.numberOfChildren === 1 && e.children[I]) {
        let t = e.children[I]
        return new H(e.segments.concat(t.segments), t.children)
    }
    return e
}
function h4(e) {
    return e instanceof q1
}
function Nv(e, t, r = null, n = null) {
    let a = Zl(e)
    return Kl(a, t, r, n)
}
function Zl(e) {
    let t
    function r(i) {
        let o = {}
        for (let s of i.children) {
            let l = r(s)
            o[s.outlet] = l
        }
        let c = new H(i.url, o)
        return i === e && (t = c), c
    }
    let n = r(e.root),
        a = Yl(n)
    return t ?? a
}
function Kl(e, t, r, n) {
    let a = e
    for (; a.parent; ) a = a.parent
    if (t.length === 0) return H6(a, a, a, r, n)
    let i = Ev(t)
    if (i.toRoot()) return H6(a, a, new H([], {}), r, n)
    let o = Iv(i, a, e),
        c = o.processChildren
            ? u3(o.segmentGroup, o.index, i.commands)
            : Jl(o.segmentGroup, o.index, i.commands)
    return H6(a, o.segmentGroup, c, r, n)
}
function It(e) {
    return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath
}
function h3(e) {
    return typeof e == 'object' && e != null && e.outlets
}
function H6(e, t, r, n, a) {
    let i = {}
    n &&
        Object.entries(n).forEach(([s, l]) => {
            i[s] = Array.isArray(l) ? l.map(f => `${f}`) : `${l}`
        })
    let o
    e === t ? (o = r) : (o = Xl(e, t, r))
    let c = Yl(Ql(o))
    return new q1(c, i, a)
}
function Xl(e, t, r) {
    let n = {}
    return (
        Object.entries(e.children).forEach(([a, i]) => {
            i === t ? (n[a] = r) : (n[a] = Xl(i, t, r))
        }),
        new H(e.segments, n)
    )
}
var Tt = class {
    constructor(t, r, n) {
        if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = r),
            (this.commands = n),
            t && n.length > 0 && It(n[0]))
        )
            throw new w(4003, !1)
        let a = n.find(h3)
        if (a && a !== Ul(n)) throw new w(4004, !1)
    }
    toRoot() {
        return (
            this.isAbsolute &&
            this.commands.length === 1 &&
            this.commands[0] == '/'
        )
    }
}
function Ev(e) {
    if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/')
        return new Tt(!0, 0, e)
    let t = 0,
        r = !1,
        n = e.reduce((a, i, o) => {
            if (typeof i == 'object' && i != null) {
                if (i.outlets) {
                    let c = {}
                    return (
                        Object.entries(i.outlets).forEach(([s, l]) => {
                            c[s] = typeof l == 'string' ? l.split('/') : l
                        }),
                        [...a, { outlets: c }]
                    )
                }
                if (i.segmentPath) return [...a, i.segmentPath]
            }
            return typeof i != 'string'
                ? [...a, i]
                : o === 0
                ? (i.split('/').forEach((c, s) => {
                      ;(s == 0 && c === '.') ||
                          (s == 0 && c === ''
                              ? (r = !0)
                              : c === '..'
                              ? t++
                              : c != '' && a.push(c))
                  }),
                  a)
                : [...a, i]
        }, [])
    return new Tt(r, t, n)
}
var u4 = class {
    constructor(t, r, n) {
        ;(this.segmentGroup = t), (this.processChildren = r), (this.index = n)
    }
}
function Iv(e, t, r) {
    if (e.isAbsolute) return new u4(t, !0, 0)
    if (!r) return new u4(t, !1, NaN)
    if (r.parent === null) return new u4(r, !0, 0)
    let n = It(e.commands[0]) ? 0 : 1,
        a = r.segments.length - 1 + n
    return Tv(r, a, e.numberOfDoubleDots)
}
function Tv(e, t, r) {
    let n = e,
        a = t,
        i = r
    for (; i > a; ) {
        if (((i -= a), (n = n.parent), !n)) throw new w(4005, !1)
        a = n.segments.length
    }
    return new u4(n, !1, a - i)
}
function Av(e) {
    return h3(e[0]) ? e[0].outlets : { [I]: e }
}
function Jl(e, t, r) {
    if (((e ??= new H([], {})), e.segments.length === 0 && e.hasChildren()))
        return u3(e, t, r)
    let n = kv(e, t, r),
        a = r.slice(n.commandIndex)
    if (n.match && n.pathIndex < e.segments.length) {
        let i = new H(e.segments.slice(0, n.pathIndex), {})
        return (
            (i.children[I] = new H(e.segments.slice(n.pathIndex), e.children)),
            u3(i, 0, a)
        )
    } else
        return n.match && a.length === 0
            ? new H(e.segments, {})
            : n.match && !e.hasChildren()
            ? Q6(e, t, r)
            : n.match
            ? u3(e, 0, a)
            : Q6(e, t, r)
}
function u3(e, t, r) {
    if (r.length === 0) return new H(e.segments, {})
    {
        let n = Av(r),
            a = {}
        if (
            Object.keys(n).some(i => i !== I) &&
            e.children[I] &&
            e.numberOfChildren === 1 &&
            e.children[I].segments.length === 0
        ) {
            let i = u3(e.children[I], t, r)
            return new H(e.segments, i.children)
        }
        return (
            Object.entries(n).forEach(([i, o]) => {
                typeof o == 'string' && (o = [o]),
                    o !== null && (a[i] = Jl(e.children[i], t, o))
            }),
            Object.entries(e.children).forEach(([i, o]) => {
                n[i] === void 0 && (a[i] = o)
            }),
            new H(e.segments, a)
        )
    }
}
function kv(e, t, r) {
    let n = 0,
        a = t,
        i = { match: !1, pathIndex: 0, commandIndex: 0 }
    for (; a < e.segments.length; ) {
        if (n >= r.length) return i
        let o = e.segments[a],
            c = r[n]
        if (h3(c)) break
        let s = `${c}`,
            l = n < r.length - 1 ? r[n + 1] : null
        if (a > 0 && s === void 0) break
        if (s && l && typeof l == 'object' && l.outlets === void 0) {
            if (!Ol(s, l, o)) return i
            n += 2
        } else {
            if (!Ol(s, {}, o)) return i
            n++
        }
        a++
    }
    return { match: !0, pathIndex: a, commandIndex: n }
}
function Q6(e, t, r) {
    let n = e.segments.slice(0, t),
        a = 0
    for (; a < r.length; ) {
        let i = r[a]
        if (h3(i)) {
            let s = Rv(i.outlets)
            return new H(n, s)
        }
        if (a === 0 && It(r[0])) {
            let s = e.segments[t]
            n.push(new Se(s.path, Fl(r[0]))), a++
            continue
        }
        let o = h3(i) ? i.outlets[I] : `${i}`,
            c = a < r.length - 1 ? r[a + 1] : null
        o && c && It(c)
            ? (n.push(new Se(o, Fl(c))), (a += 2))
            : (n.push(new Se(o, {})), a++)
    }
    return new H(n, {})
}
function Rv(e) {
    let t = {}
    return (
        Object.entries(e).forEach(([r, n]) => {
            typeof n == 'string' && (n = [n]),
                n !== null && (t[r] = Q6(new H([], {}), 0, n))
        }),
        t
    )
}
function Fl(e) {
    let t = {}
    return Object.entries(e).forEach(([r, n]) => (t[r] = `${n}`)), t
}
function Ol(e, t, r) {
    return e == r.path && c1(t, r.parameters)
}
var d3 = 'imperative',
    p2 = (function (e) {
        return (
            (e[(e.NavigationStart = 0)] = 'NavigationStart'),
            (e[(e.NavigationEnd = 1)] = 'NavigationEnd'),
            (e[(e.NavigationCancel = 2)] = 'NavigationCancel'),
            (e[(e.NavigationError = 3)] = 'NavigationError'),
            (e[(e.RoutesRecognized = 4)] = 'RoutesRecognized'),
            (e[(e.ResolveStart = 5)] = 'ResolveStart'),
            (e[(e.ResolveEnd = 6)] = 'ResolveEnd'),
            (e[(e.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
            (e[(e.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
            (e[(e.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
            (e[(e.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
            (e[(e.ChildActivationStart = 11)] = 'ChildActivationStart'),
            (e[(e.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
            (e[(e.ActivationStart = 13)] = 'ActivationStart'),
            (e[(e.ActivationEnd = 14)] = 'ActivationEnd'),
            (e[(e.Scroll = 15)] = 'Scroll'),
            (e[(e.NavigationSkipped = 16)] = 'NavigationSkipped'),
            e
        )
    })(p2 || {}),
    j2 = class {
        constructor(t, r) {
            ;(this.id = t), (this.url = r)
        }
    },
    m3 = class extends j2 {
        constructor(t, r, n = 'imperative', a = null) {
            super(t, r),
                (this.type = p2.NavigationStart),
                (this.navigationTrigger = n),
                (this.restoredState = a)
        }
        toString() {
            return `NavigationStart(id: ${this.id}, url: '${this.url}')`
        }
    },
    De = class extends j2 {
        constructor(t, r, n) {
            super(t, r),
                (this.urlAfterRedirects = n),
                (this.type = p2.NavigationEnd)
        }
        toString() {
            return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
        }
    },
    R2 = (function (e) {
        return (
            (e[(e.Redirect = 0)] = 'Redirect'),
            (e[(e.SupersededByNewNavigation = 1)] =
                'SupersededByNewNavigation'),
            (e[(e.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
            (e[(e.GuardRejected = 3)] = 'GuardRejected'),
            e
        )
    })(R2 || {}),
    Z6 = (function (e) {
        return (
            (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
            (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
                'IgnoredByUrlHandlingStrategy'),
            e
        )
    })(Z6 || {}),
    G1 = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.reason = n),
                (this.code = a),
                (this.type = p2.NavigationCancel)
        }
        toString() {
            return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
        }
    },
    Ne = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.reason = n),
                (this.code = a),
                (this.type = p2.NavigationSkipped)
        }
    },
    g3 = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.error = n),
                (this.target = a),
                (this.type = p2.NavigationError)
        }
        toString() {
            return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
        }
    },
    At = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.urlAfterRedirects = n),
                (this.state = a),
                (this.type = p2.RoutesRecognized)
        }
        toString() {
            return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    K6 = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.urlAfterRedirects = n),
                (this.state = a),
                (this.type = p2.GuardsCheckStart)
        }
        toString() {
            return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    X6 = class extends j2 {
        constructor(t, r, n, a, i) {
            super(t, r),
                (this.urlAfterRedirects = n),
                (this.state = a),
                (this.shouldActivate = i),
                (this.type = p2.GuardsCheckEnd)
        }
        toString() {
            return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
        }
    },
    J6 = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.urlAfterRedirects = n),
                (this.state = a),
                (this.type = p2.ResolveStart)
        }
        toString() {
            return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    ea = class extends j2 {
        constructor(t, r, n, a) {
            super(t, r),
                (this.urlAfterRedirects = n),
                (this.state = a),
                (this.type = p2.ResolveEnd)
        }
        toString() {
            return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    ta = class {
        constructor(t) {
            ;(this.route = t), (this.type = p2.RouteConfigLoadStart)
        }
        toString() {
            return `RouteConfigLoadStart(path: ${this.route.path})`
        }
    },
    na = class {
        constructor(t) {
            ;(this.route = t), (this.type = p2.RouteConfigLoadEnd)
        }
        toString() {
            return `RouteConfigLoadEnd(path: ${this.route.path})`
        }
    },
    ra = class {
        constructor(t) {
            ;(this.snapshot = t), (this.type = p2.ChildActivationStart)
        }
        toString() {
            return `ChildActivationStart(path: '${
                (this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
                ''
            }')`
        }
    },
    aa = class {
        constructor(t) {
            ;(this.snapshot = t), (this.type = p2.ChildActivationEnd)
        }
        toString() {
            return `ChildActivationEnd(path: '${
                (this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
                ''
            }')`
        }
    },
    ia = class {
        constructor(t) {
            ;(this.snapshot = t), (this.type = p2.ActivationStart)
        }
        toString() {
            return `ActivationStart(path: '${
                (this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
                ''
            }')`
        }
    },
    oa = class {
        constructor(t) {
            ;(this.snapshot = t), (this.type = p2.ActivationEnd)
        }
        toString() {
            return `ActivationEnd(path: '${
                (this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
                ''
            }')`
        }
    }
var v3 = class {},
    M3 = class {
        constructor(t) {
            this.url = t
        }
    }
var ca = class {
        constructor() {
            ;(this.outlet = null),
                (this.route = null),
                (this.injector = null),
                (this.children = new Ot()),
                (this.attachRef = null)
        }
    },
    Ot = (() => {
        let t = class t {
            constructor() {
                this.contexts = new Map()
            }
            onChildOutletCreated(n, a) {
                let i = this.getOrCreateContext(n)
                ;(i.outlet = a), this.contexts.set(n, i)
            }
            onChildOutletDestroyed(n) {
                let a = this.getContext(n)
                a && ((a.outlet = null), (a.attachRef = null))
            }
            onOutletDeactivated() {
                let n = this.contexts
                return (this.contexts = new Map()), n
            }
            onOutletReAttached(n) {
                this.contexts = n
            }
            getOrCreateContext(n) {
                let a = this.getContext(n)
                return a || ((a = new ca()), this.contexts.set(n, a)), a
            }
            getContext(n) {
                return this.contexts.get(n) || null
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    kt = class {
        constructor(t) {
            this._root = t
        }
        get root() {
            return this._root.value
        }
        parent(t) {
            let r = this.pathFromRoot(t)
            return r.length > 1 ? r[r.length - 2] : null
        }
        children(t) {
            let r = sa(t, this._root)
            return r ? r.children.map(n => n.value) : []
        }
        firstChild(t) {
            let r = sa(t, this._root)
            return r && r.children.length > 0 ? r.children[0].value : null
        }
        siblings(t) {
            let r = la(t, this._root)
            return r.length < 2
                ? []
                : r[r.length - 2].children
                      .map(a => a.value)
                      .filter(a => a !== t)
        }
        pathFromRoot(t) {
            return la(t, this._root).map(r => r.value)
        }
    }
function sa(e, t) {
    if (e === t.value) return t
    for (let r of t.children) {
        let n = sa(e, r)
        if (n) return n
    }
    return null
}
function la(e, t) {
    if (e === t.value) return [t]
    for (let r of t.children) {
        let n = la(e, r)
        if (n.length) return n.unshift(t), n
    }
    return []
}
var k2 = class {
    constructor(t, r) {
        ;(this.value = t), (this.children = r)
    }
    toString() {
        return `TreeNode(${this.value})`
    }
}
function f4(e) {
    let t = {}
    return e && e.children.forEach(r => (t[r.value.outlet] = r)), t
}
var Rt = class extends kt {
    constructor(t, r) {
        super(t), (this.snapshot = r), ya(this, t)
    }
    toString() {
        return this.snapshot.toString()
    }
}
function e5(e) {
    let t = Pv(e),
        r = new l2([new Se('', {})]),
        n = new l2({}),
        a = new l2({}),
        i = new l2({}),
        o = new l2(''),
        c = new m4(r, n, i, o, a, I, e, t.root)
    return (c.snapshot = t.root), new Rt(new k2(c, []), t)
}
function Pv(e) {
    let t = {},
        r = {},
        n = {},
        a = '',
        i = new C3([], t, n, a, r, I, e, null, {})
    return new Pt('', new k2(i, []))
}
var m4 = class {
    constructor(t, r, n, a, i, o, c, s) {
        ;(this.urlSubject = t),
            (this.paramsSubject = r),
            (this.queryParamsSubject = n),
            (this.fragmentSubject = a),
            (this.dataSubject = i),
            (this.outlet = o),
            (this.component = c),
            (this._futureSnapshot = s),
            (this.title = this.dataSubject?.pipe(A(l => l[L3])) ?? S(void 0)),
            (this.url = t),
            (this.params = r),
            (this.queryParams = n),
            (this.fragment = a),
            (this.data = i)
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return (
            (this._paramMap ??= this.params.pipe(A(t => p4(t)))), this._paramMap
        )
    }
    get queryParamMap() {
        return (
            (this._queryParamMap ??= this.queryParams.pipe(A(t => p4(t)))),
            this._queryParamMap
        )
    }
    toString() {
        return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`
    }
}
function Ca(e, t, r = 'emptyOnly') {
    let n,
        { routeConfig: a } = e
    return (
        t !== null &&
        (r === 'always' ||
            a?.path === '' ||
            (!t.component && !t.routeConfig?.loadComponent))
            ? (n = {
                  params: z(z({}, t.params), e.params),
                  data: z(z({}, t.data), e.data),
                  resolve: z(
                      z(z(z({}, e.data), t.data), a?.data),
                      e._resolvedData
                  ),
              })
            : (n = {
                  params: z({}, e.params),
                  data: z({}, e.data),
                  resolve: z(z({}, e.data), e._resolvedData ?? {}),
              }),
        a && n5(a) && (n.resolve[L3] = a.title),
        n
    )
}
var C3 = class {
        get title() {
            return this.data?.[L3]
        }
        constructor(t, r, n, a, i, o, c, s, l) {
            ;(this.url = t),
                (this.params = r),
                (this.queryParams = n),
                (this.fragment = a),
                (this.data = i),
                (this.outlet = o),
                (this.component = c),
                (this.routeConfig = s),
                (this._resolve = l)
        }
        get root() {
            return this._routerState.root
        }
        get parent() {
            return this._routerState.parent(this)
        }
        get firstChild() {
            return this._routerState.firstChild(this)
        }
        get children() {
            return this._routerState.children(this)
        }
        get pathFromRoot() {
            return this._routerState.pathFromRoot(this)
        }
        get paramMap() {
            return (this._paramMap ??= p4(this.params)), this._paramMap
        }
        get queryParamMap() {
            return (
                (this._queryParamMap ??= p4(this.queryParams)),
                this._queryParamMap
            )
        }
        toString() {
            let t = this.url.map(n => n.toString()).join('/'),
                r = this.routeConfig ? this.routeConfig.path : ''
            return `Route(url:'${t}', path:'${r}')`
        }
    },
    Pt = class extends kt {
        constructor(t, r) {
            super(r), (this.url = t), ya(this, r)
        }
        toString() {
            return t5(this._root)
        }
    }
function ya(e, t) {
    ;(t.value._routerState = e), t.children.forEach(r => ya(e, r))
}
function t5(e) {
    let t =
        e.children.length > 0 ? ` { ${e.children.map(t5).join(', ')} } ` : ''
    return `${e.value}${t}`
}
function V6(e) {
    if (e.snapshot) {
        let t = e.snapshot,
            r = e._futureSnapshot
        ;(e.snapshot = r),
            c1(t.queryParams, r.queryParams) ||
                e.queryParamsSubject.next(r.queryParams),
            t.fragment !== r.fragment && e.fragmentSubject.next(r.fragment),
            c1(t.params, r.params) || e.paramsSubject.next(r.params),
            fv(t.url, r.url) || e.urlSubject.next(r.url),
            c1(t.data, r.data) || e.dataSubject.next(r.data)
    } else
        (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data)
}
function fa(e, t) {
    let r = c1(e.params, t.params) && hv(e.url, t.url),
        n = !e.parent != !t.parent
    return r && !n && (!e.parent || fa(e.parent, t.parent))
}
function n5(e) {
    return typeof e.title == 'string' || e.title === null
}
var za = (() => {
        let t = class t {
            constructor() {
                ;(this.activated = null),
                    (this._activatedRoute = null),
                    (this.name = I),
                    (this.activateEvents = new $2()),
                    (this.deactivateEvents = new $2()),
                    (this.attachEvents = new $2()),
                    (this.detachEvents = new $2()),
                    (this.parentContexts = g(Ot)),
                    (this.location = g(n4)),
                    (this.changeDetector = g(X4)),
                    (this.environmentInjector = g(L2)),
                    (this.inputBinder = g(La, { optional: !0 })),
                    (this.supportsBindingToComponentInputs = !0)
            }
            get activatedComponentRef() {
                return this.activated
            }
            ngOnChanges(n) {
                if (n.name) {
                    let { firstChange: a, previousValue: i } = n.name
                    if (a) return
                    this.isTrackedInParentContexts(i) &&
                        (this.deactivate(),
                        this.parentContexts.onChildOutletDestroyed(i)),
                        this.initializeOutletWithName()
                }
            }
            ngOnDestroy() {
                this.isTrackedInParentContexts(this.name) &&
                    this.parentContexts.onChildOutletDestroyed(this.name),
                    this.inputBinder?.unsubscribeFromRouteData(this)
            }
            isTrackedInParentContexts(n) {
                return this.parentContexts.getContext(n)?.outlet === this
            }
            ngOnInit() {
                this.initializeOutletWithName()
            }
            initializeOutletWithName() {
                if (
                    (this.parentContexts.onChildOutletCreated(this.name, this),
                    this.activated)
                )
                    return
                let n = this.parentContexts.getContext(this.name)
                n?.route &&
                    (n.attachRef
                        ? this.attach(n.attachRef, n.route)
                        : this.activateWith(n.route, n.injector))
            }
            get isActivated() {
                return !!this.activated
            }
            get component() {
                if (!this.activated) throw new w(4012, !1)
                return this.activated.instance
            }
            get activatedRoute() {
                if (!this.activated) throw new w(4012, !1)
                return this._activatedRoute
            }
            get activatedRouteData() {
                return this._activatedRoute
                    ? this._activatedRoute.snapshot.data
                    : {}
            }
            detach() {
                if (!this.activated) throw new w(4012, !1)
                this.location.detach()
                let n = this.activated
                return (
                    (this.activated = null),
                    (this._activatedRoute = null),
                    this.detachEvents.emit(n.instance),
                    n
                )
            }
            attach(n, a) {
                ;(this.activated = n),
                    (this._activatedRoute = a),
                    this.location.insert(n.hostView),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.attachEvents.emit(n.instance)
            }
            deactivate() {
                if (this.activated) {
                    let n = this.component
                    this.activated.destroy(),
                        (this.activated = null),
                        (this._activatedRoute = null),
                        this.deactivateEvents.emit(n)
                }
            }
            activateWith(n, a) {
                if (this.isActivated) throw new w(4013, !1)
                this._activatedRoute = n
                let i = this.location,
                    c = n.snapshot.component,
                    s = this.parentContexts.getOrCreateContext(
                        this.name
                    ).children,
                    l = new ua(n, s, i.injector)
                ;(this.activated = i.createComponent(c, {
                    index: i.length,
                    injector: l,
                    environmentInjector: a ?? this.environmentInjector,
                })),
                    this.changeDetector.markForCheck(),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.activateEvents.emit(this.activated.instance)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵdir = he({
                type: t,
                selectors: [['router-outlet']],
                inputs: { name: 'name' },
                outputs: {
                    activateEvents: 'activate',
                    deactivateEvents: 'deactivate',
                    attachEvents: 'attach',
                    detachEvents: 'detach',
                },
                exportAs: ['outlet'],
                standalone: !0,
                features: [B1],
            }))
        let e = t
        return e
    })(),
    ua = class e {
        __ngOutletInjector(t) {
            return new e(this.route, this.childContexts, t)
        }
        constructor(t, r, n) {
            ;(this.route = t), (this.childContexts = r), (this.parent = n)
        }
        get(t, r) {
            return t === m4
                ? this.route
                : t === Ot
                ? this.childContexts
                : this.parent.get(t, r)
        }
    },
    La = new b('')
function _v(e, t, r) {
    let n = y3(e, t._root, r ? r._root : void 0)
    return new Rt(n, t)
}
function y3(e, t, r) {
    if (r && e.shouldReuseRoute(t.value, r.value.snapshot)) {
        let n = r.value
        n._futureSnapshot = t.value
        let a = Fv(e, t, r)
        return new k2(n, a)
    } else {
        if (e.shouldAttach(t.value)) {
            let i = e.retrieve(t.value)
            if (i !== null) {
                let o = i.route
                return (
                    (o.value._futureSnapshot = t.value),
                    (o.children = t.children.map(c => y3(e, c))),
                    o
                )
            }
        }
        let n = Ov(t.value),
            a = t.children.map(i => y3(e, i))
        return new k2(n, a)
    }
}
function Fv(e, t, r) {
    return t.children.map(n => {
        for (let a of r.children)
            if (e.shouldReuseRoute(n.value, a.value.snapshot))
                return y3(e, n, a)
        return y3(e, n)
    })
}
function Ov(e) {
    return new m4(
        new l2(e.url),
        new l2(e.params),
        new l2(e.queryParams),
        new l2(e.fragment),
        new l2(e.data),
        e.outlet,
        e.component,
        e
    )
}
var r5 = 'ngNavigationCancelingError'
function a5(e, t) {
    let { redirectTo: r, navigationBehaviorOptions: n } = h4(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
        a = i5(!1, R2.Redirect)
    return (a.url = r), (a.navigationBehaviorOptions = n), a
}
function i5(e, t) {
    let r = new Error(`NavigationCancelingError: ${e || ''}`)
    return (r[r5] = !0), (r.cancellationCode = t), r
}
function Bv(e) {
    return o5(e) && h4(e.url)
}
function o5(e) {
    return !!e && e[r5]
}
var jv = (() => {
    let t = class t {}
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['ng-component']],
            standalone: !0,
            features: [t2],
            decls: 1,
            vars: 0,
            template: function (a, i) {
                a & 1 && o1(0, 'router-outlet')
            },
            dependencies: [za],
            encapsulation: 2,
        }))
    let e = t
    return e
})()
function Uv(e, t) {
    return (
        e.providers &&
            !e._injector &&
            (e._injector = g6(e.providers, t, `Route: ${e.path}`)),
        e._injector ?? t
    )
}
function wa(e) {
    let t = e.children && e.children.map(wa),
        r = t ? K(z({}, e), { children: t }) : z({}, e)
    return (
        !r.component &&
            !r.loadComponent &&
            (t || r.loadChildren) &&
            r.outlet &&
            r.outlet !== I &&
            (r.component = jv),
        r
    )
}
function s1(e) {
    return e.outlet || I
}
function Hv(e, t) {
    let r = e.filter(n => s1(n) === t)
    return r.push(...e.filter(n => s1(n) !== t)), r
}
function w3(e) {
    if (!e) return null
    if (e.routeConfig?._injector) return e.routeConfig._injector
    for (let t = e.parent; t; t = t.parent) {
        let r = t.routeConfig
        if (r?._loadedInjector) return r._loadedInjector
        if (r?._injector) return r._injector
    }
    return null
}
var Vv = (e, t, r, n) =>
        A(
            a => (
                new da(
                    t,
                    a.targetRouterState,
                    a.currentRouterState,
                    r,
                    n
                ).activate(e),
                a
            )
        ),
    da = class {
        constructor(t, r, n, a, i) {
            ;(this.routeReuseStrategy = t),
                (this.futureState = r),
                (this.currState = n),
                (this.forwardEvent = a),
                (this.inputBindingEnabled = i)
        }
        activate(t) {
            let r = this.futureState._root,
                n = this.currState ? this.currState._root : null
            this.deactivateChildRoutes(r, n, t),
                V6(this.futureState.root),
                this.activateChildRoutes(r, n, t)
        }
        deactivateChildRoutes(t, r, n) {
            let a = f4(r)
            t.children.forEach(i => {
                let o = i.value.outlet
                this.deactivateRoutes(i, a[o], n), delete a[o]
            }),
                Object.values(a).forEach(i => {
                    this.deactivateRouteAndItsChildren(i, n)
                })
        }
        deactivateRoutes(t, r, n) {
            let a = t.value,
                i = r ? r.value : null
            if (a === i)
                if (a.component) {
                    let o = n.getContext(a.outlet)
                    o && this.deactivateChildRoutes(t, r, o.children)
                } else this.deactivateChildRoutes(t, r, n)
            else i && this.deactivateRouteAndItsChildren(r, n)
        }
        deactivateRouteAndItsChildren(t, r) {
            t.value.component &&
            this.routeReuseStrategy.shouldDetach(t.value.snapshot)
                ? this.detachAndStoreRouteSubtree(t, r)
                : this.deactivateRouteAndOutlet(t, r)
        }
        detachAndStoreRouteSubtree(t, r) {
            let n = r.getContext(t.value.outlet),
                a = n && t.value.component ? n.children : r,
                i = f4(t)
            for (let o of Object.values(i))
                this.deactivateRouteAndItsChildren(o, a)
            if (n && n.outlet) {
                let o = n.outlet.detach(),
                    c = n.children.onOutletDeactivated()
                this.routeReuseStrategy.store(t.value.snapshot, {
                    componentRef: o,
                    route: t,
                    contexts: c,
                })
            }
        }
        deactivateRouteAndOutlet(t, r) {
            let n = r.getContext(t.value.outlet),
                a = n && t.value.component ? n.children : r,
                i = f4(t)
            for (let o of Object.values(i))
                this.deactivateRouteAndItsChildren(o, a)
            n &&
                (n.outlet &&
                    (n.outlet.deactivate(), n.children.onOutletDeactivated()),
                (n.attachRef = null),
                (n.route = null))
        }
        activateChildRoutes(t, r, n) {
            let a = f4(r)
            t.children.forEach(i => {
                this.activateRoutes(i, a[i.value.outlet], n),
                    this.forwardEvent(new oa(i.value.snapshot))
            }),
                t.children.length && this.forwardEvent(new aa(t.value.snapshot))
        }
        activateRoutes(t, r, n) {
            let a = t.value,
                i = r ? r.value : null
            if ((V6(a), a === i))
                if (a.component) {
                    let o = n.getOrCreateContext(a.outlet)
                    this.activateChildRoutes(t, r, o.children)
                } else this.activateChildRoutes(t, r, n)
            else if (a.component) {
                let o = n.getOrCreateContext(a.outlet)
                if (this.routeReuseStrategy.shouldAttach(a.snapshot)) {
                    let c = this.routeReuseStrategy.retrieve(a.snapshot)
                    this.routeReuseStrategy.store(a.snapshot, null),
                        o.children.onOutletReAttached(c.contexts),
                        (o.attachRef = c.componentRef),
                        (o.route = c.route.value),
                        o.outlet &&
                            o.outlet.attach(c.componentRef, c.route.value),
                        V6(c.route.value),
                        this.activateChildRoutes(t, null, o.children)
                } else {
                    let c = w3(a.snapshot)
                    ;(o.attachRef = null),
                        (o.route = a),
                        (o.injector = c),
                        o.outlet && o.outlet.activateWith(a, o.injector),
                        this.activateChildRoutes(t, null, o.children)
                }
            } else this.activateChildRoutes(t, null, n)
        }
    },
    _t = class {
        constructor(t) {
            ;(this.path = t), (this.route = this.path[this.path.length - 1])
        }
    },
    d4 = class {
        constructor(t, r) {
            ;(this.component = t), (this.route = r)
        }
    }
function $v(e, t, r) {
    let n = e._root,
        a = t ? t._root : null
    return l3(n, a, r, [n.value])
}
function Wv(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null
    return !t || t.length === 0 ? null : { node: e, guards: t }
}
function v4(e, t) {
    let r = Symbol(),
        n = t.get(e, r)
    return n === r ? (typeof e == 'function' && !Qo(e) ? e : t.get(e)) : n
}
function l3(
    e,
    t,
    r,
    n,
    a = { canDeactivateChecks: [], canActivateChecks: [] }
) {
    let i = f4(t)
    return (
        e.children.forEach(o => {
            qv(o, i[o.value.outlet], r, n.concat([o.value]), a),
                delete i[o.value.outlet]
        }),
        Object.entries(i).forEach(([o, c]) => p3(c, r.getContext(o), a)),
        a
    )
}
function qv(
    e,
    t,
    r,
    n,
    a = { canDeactivateChecks: [], canActivateChecks: [] }
) {
    let i = e.value,
        o = t ? t.value : null,
        c = r ? r.getContext(e.value.outlet) : null
    if (o && i.routeConfig === o.routeConfig) {
        let s = Gv(o, i, i.routeConfig.runGuardsAndResolvers)
        s
            ? a.canActivateChecks.push(new _t(n))
            : ((i.data = o.data), (i._resolvedData = o._resolvedData)),
            i.component
                ? l3(e, t, c ? c.children : null, n, a)
                : l3(e, t, r, n, a),
            s &&
                c &&
                c.outlet &&
                c.outlet.isActivated &&
                a.canDeactivateChecks.push(new d4(c.outlet.component, o))
    } else
        o && p3(t, c, a),
            a.canActivateChecks.push(new _t(n)),
            i.component
                ? l3(e, null, c ? c.children : null, n, a)
                : l3(e, null, r, n, a)
    return a
}
function Gv(e, t, r) {
    if (typeof r == 'function') return r(e, t)
    switch (r) {
        case 'pathParamsChange':
            return !xe(e.url, t.url)
        case 'pathParamsOrQueryParamsChange':
            return !xe(e.url, t.url) || !c1(e.queryParams, t.queryParams)
        case 'always':
            return !0
        case 'paramsOrQueryParamsChange':
            return !fa(e, t) || !c1(e.queryParams, t.queryParams)
        case 'paramsChange':
        default:
            return !fa(e, t)
    }
}
function p3(e, t, r) {
    let n = f4(e),
        a = e.value
    Object.entries(n).forEach(([i, o]) => {
        a.component
            ? t
                ? p3(o, t.children.getContext(i), r)
                : p3(o, null, r)
            : p3(o, t, r)
    }),
        a.component
            ? t && t.outlet && t.outlet.isActivated
                ? r.canDeactivateChecks.push(new d4(t.outlet.component, a))
                : r.canDeactivateChecks.push(new d4(null, a))
            : r.canDeactivateChecks.push(new d4(null, a))
}
function b3(e) {
    return typeof e == 'function'
}
function Yv(e) {
    return typeof e == 'boolean'
}
function Qv(e) {
    return e && b3(e.canLoad)
}
function Zv(e) {
    return e && b3(e.canActivate)
}
function Kv(e) {
    return e && b3(e.canActivateChild)
}
function Xv(e) {
    return e && b3(e.canDeactivate)
}
function Jv(e) {
    return e && b3(e.canMatch)
}
function c5(e) {
    return e instanceof f1 || e?.name === 'EmptyError'
}
var St = Symbol('INITIAL_VALUE')
function g4() {
    return x2(e =>
        J3(e.map(t => t.pipe(u1(1), zn(St)))).pipe(
            A(t => {
                for (let r of t)
                    if (r !== !0) {
                        if (r === St) return St
                        if (r === !1 || r instanceof q1) return r
                    }
                return !0
            }),
            S2(t => t !== St),
            u1(1)
        )
    )
}
function eM(e, t) {
    return r2(r => {
        let {
            targetSnapshot: n,
            currentSnapshot: a,
            guards: { canActivateChecks: i, canDeactivateChecks: o },
        } = r
        return o.length === 0 && i.length === 0
            ? S(K(z({}, r), { guardsResult: !0 }))
            : tM(o, n, a, e).pipe(
                  r2(c => (c && Yv(c) ? nM(n, i, e, t) : S(c))),
                  A(c => K(z({}, r), { guardsResult: c }))
              )
    })
}
function tM(e, t, r, n) {
    return X(e).pipe(
        r2(a => cM(a.component, a.route, r, t, n)),
        H2(a => a !== !0, !0)
    )
}
function nM(e, t, r, n) {
    return X(t).pipe(
        E1(a =>
            He(
                aM(a.route.parent, n),
                rM(a.route, n),
                oM(e, a.path, r),
                iM(e, a.route, r)
            )
        ),
        H2(a => a !== !0, !0)
    )
}
function rM(e, t) {
    return e !== null && t && t(new ia(e)), S(!0)
}
function aM(e, t) {
    return e !== null && t && t(new ra(e)), S(!0)
}
function iM(e, t, r) {
    let n = t.routeConfig ? t.routeConfig.canActivate : null
    if (!n || n.length === 0) return S(!0)
    let a = n.map(i =>
        e0(() => {
            let o = w3(t) ?? r,
                c = v4(i, o),
                s = Zv(c) ? c.canActivate(t, e) : M1(o, () => c(t, e))
            return Y1(s).pipe(H2())
        })
    )
    return S(a).pipe(g4())
}
function oM(e, t, r) {
    let n = t[t.length - 1],
        i = t
            .slice(0, t.length - 1)
            .reverse()
            .map(o => Wv(o))
            .filter(o => o !== null)
            .map(o =>
                e0(() => {
                    let c = o.guards.map(s => {
                        let l = w3(o.node) ?? r,
                            f = v4(s, l),
                            u = Kv(f)
                                ? f.canActivateChild(n, e)
                                : M1(l, () => f(n, e))
                        return Y1(u).pipe(H2())
                    })
                    return S(c).pipe(g4())
                })
            )
    return S(i).pipe(g4())
}
function cM(e, t, r, n, a) {
    let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null
    if (!i || i.length === 0) return S(!0)
    let o = i.map(c => {
        let s = w3(t) ?? a,
            l = v4(c, s),
            f = Xv(l) ? l.canDeactivate(e, t, r, n) : M1(s, () => l(e, t, r, n))
        return Y1(f).pipe(H2())
    })
    return S(o).pipe(g4())
}
function sM(e, t, r, n) {
    let a = t.canLoad
    if (a === void 0 || a.length === 0) return S(!0)
    let i = a.map(o => {
        let c = v4(o, e),
            s = Qv(c) ? c.canLoad(t, r) : M1(e, () => c(t, r))
        return Y1(s)
    })
    return S(i).pipe(g4(), s5(n))
}
function s5(e) {
    return dn(
        a2(t => {
            if (h4(t)) throw a5(e, t)
        }),
        A(t => t === !0)
    )
}
function lM(e, t, r, n) {
    let a = t.canMatch
    if (!a || a.length === 0) return S(!0)
    let i = a.map(o => {
        let c = v4(o, e),
            s = Jv(c) ? c.canMatch(t, r) : M1(e, () => c(t, r))
        return Y1(s)
    })
    return S(i).pipe(g4(), s5(n))
}
var z3 = class {
        constructor(t) {
            this.segmentGroup = t || null
        }
    },
    Ft = class extends Error {
        constructor(t) {
            super(), (this.urlTree = t)
        }
    }
function l4(e) {
    return Ue(new z3(e))
}
function fM(e) {
    return Ue(new w(4e3, !1))
}
function uM(e) {
    return Ue(i5(!1, R2.GuardRejected))
}
var pa = class {
        constructor(t, r) {
            ;(this.urlSerializer = t), (this.urlTree = r)
        }
        lineralizeSegments(t, r) {
            let n = [],
                a = r.root
            for (;;) {
                if (((n = n.concat(a.segments)), a.numberOfChildren === 0))
                    return S(n)
                if (a.numberOfChildren > 1 || !a.children[I])
                    return fM(t.redirectTo)
                a = a.children[I]
            }
        }
        applyRedirectCommands(t, r, n) {
            let a = this.applyRedirectCreateUrlTree(
                r,
                this.urlSerializer.parse(r),
                t,
                n
            )
            if (r.startsWith('/')) throw new Ft(a)
            return a
        }
        applyRedirectCreateUrlTree(t, r, n, a) {
            let i = this.createSegmentGroup(t, r.root, n, a)
            return new q1(
                i,
                this.createQueryParams(r.queryParams, this.urlTree.queryParams),
                r.fragment
            )
        }
        createQueryParams(t, r) {
            let n = {}
            return (
                Object.entries(t).forEach(([a, i]) => {
                    if (typeof i == 'string' && i.startsWith(':')) {
                        let c = i.substring(1)
                        n[a] = r[c]
                    } else n[a] = i
                }),
                n
            )
        }
        createSegmentGroup(t, r, n, a) {
            let i = this.createSegments(t, r.segments, n, a),
                o = {}
            return (
                Object.entries(r.children).forEach(([c, s]) => {
                    o[c] = this.createSegmentGroup(t, s, n, a)
                }),
                new H(i, o)
            )
        }
        createSegments(t, r, n, a) {
            return r.map(i =>
                i.path.startsWith(':')
                    ? this.findPosParam(t, i, a)
                    : this.findOrReturn(i, n)
            )
        }
        findPosParam(t, r, n) {
            let a = n[r.path.substring(1)]
            if (!a) throw new w(4001, !1)
            return a
        }
        findOrReturn(t, r) {
            let n = 0
            for (let a of r) {
                if (a.path === t.path) return r.splice(n), a
                n++
            }
            return t
        }
    },
    ha = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
    }
function dM(e, t, r, n, a) {
    let i = ba(e, t, r)
    return i.matched
        ? ((n = Uv(t, n)),
          lM(n, t, r, a).pipe(A(o => (o === !0 ? i : z({}, ha)))))
        : S(i)
}
function ba(e, t, r) {
    if (t.path === '**') return pM(r)
    if (t.path === '')
        return t.pathMatch === 'full' && (e.hasChildren() || r.length > 0)
            ? z({}, ha)
            : {
                  matched: !0,
                  consumedSegments: [],
                  remainingSegments: r,
                  parameters: {},
                  positionalParamSegments: {},
              }
    let a = (t.matcher || lv)(r, e, t)
    if (!a) return z({}, ha)
    let i = {}
    Object.entries(a.posParams ?? {}).forEach(([c, s]) => {
        i[c] = s.path
    })
    let o =
        a.consumed.length > 0
            ? z(z({}, i), a.consumed[a.consumed.length - 1].parameters)
            : i
    return {
        matched: !0,
        consumedSegments: a.consumed,
        remainingSegments: r.slice(a.consumed.length),
        parameters: o,
        positionalParamSegments: a.posParams ?? {},
    }
}
function pM(e) {
    return {
        matched: !0,
        parameters: e.length > 0 ? Ul(e).parameters : {},
        consumedSegments: e,
        remainingSegments: [],
        positionalParamSegments: {},
    }
}
function Bl(e, t, r, n) {
    return r.length > 0 && gM(e, r, n)
        ? {
              segmentGroup: new H(t, mM(n, new H(r, e.children))),
              slicedSegments: [],
          }
        : r.length === 0 && vM(e, r, n)
        ? {
              segmentGroup: new H(e.segments, hM(e, r, n, e.children)),
              slicedSegments: r,
          }
        : { segmentGroup: new H(e.segments, e.children), slicedSegments: r }
}
function hM(e, t, r, n) {
    let a = {}
    for (let i of r)
        if (Bt(e, t, i) && !n[s1(i)]) {
            let o = new H([], {})
            a[s1(i)] = o
        }
    return z(z({}, n), a)
}
function mM(e, t) {
    let r = {}
    r[I] = t
    for (let n of e)
        if (n.path === '' && s1(n) !== I) {
            let a = new H([], {})
            r[s1(n)] = a
        }
    return r
}
function gM(e, t, r) {
    return r.some(n => Bt(e, t, n) && s1(n) !== I)
}
function vM(e, t, r) {
    return r.some(n => Bt(e, t, n))
}
function Bt(e, t, r) {
    return (e.hasChildren() || t.length > 0) && r.pathMatch === 'full'
        ? !1
        : r.path === ''
}
function MM(e, t, r, n) {
    return s1(e) !== n && (n === I || !Bt(t, r, e)) ? !1 : ba(t, e, r).matched
}
function CM(e, t, r) {
    return t.length === 0 && !e.children[r]
}
var ma = class {}
function yM(e, t, r, n, a, i, o = 'emptyOnly') {
    return new ga(e, t, r, n, a, o, i).recognize()
}
var zM = 31,
    ga = class {
        constructor(t, r, n, a, i, o, c) {
            ;(this.injector = t),
                (this.configLoader = r),
                (this.rootComponentType = n),
                (this.config = a),
                (this.urlTree = i),
                (this.paramsInheritanceStrategy = o),
                (this.urlSerializer = c),
                (this.applyRedirects = new pa(
                    this.urlSerializer,
                    this.urlTree
                )),
                (this.absoluteRedirectCount = 0),
                (this.allowRedirects = !0)
        }
        noMatchError(t) {
            return new w(4002, `'${t.segmentGroup}'`)
        }
        recognize() {
            let t = Bl(this.urlTree.root, [], [], this.config).segmentGroup
            return this.match(t).pipe(
                A(r => {
                    let n = new C3(
                            [],
                            Object.freeze({}),
                            Object.freeze(z({}, this.urlTree.queryParams)),
                            this.urlTree.fragment,
                            {},
                            I,
                            this.rootComponentType,
                            null,
                            {}
                        ),
                        a = new k2(n, r),
                        i = new Pt('', a),
                        o = Nv(
                            n,
                            [],
                            this.urlTree.queryParams,
                            this.urlTree.fragment
                        )
                    return (
                        (o.queryParams = this.urlTree.queryParams),
                        (i.url = this.urlSerializer.serialize(o)),
                        this.inheritParamsAndData(i._root, null),
                        { state: i, tree: o }
                    )
                })
            )
        }
        match(t) {
            return this.processSegmentGroup(
                this.injector,
                this.config,
                t,
                I
            ).pipe(
                N1(n => {
                    if (n instanceof Ft)
                        return (
                            (this.urlTree = n.urlTree),
                            this.match(n.urlTree.root)
                        )
                    throw n instanceof z3 ? this.noMatchError(n) : n
                })
            )
        }
        inheritParamsAndData(t, r) {
            let n = t.value,
                a = Ca(n, r, this.paramsInheritanceStrategy)
            ;(n.params = Object.freeze(a.params)),
                (n.data = Object.freeze(a.data)),
                t.children.forEach(i => this.inheritParamsAndData(i, n))
        }
        processSegmentGroup(t, r, n, a) {
            return n.segments.length === 0 && n.hasChildren()
                ? this.processChildren(t, r, n)
                : this.processSegment(t, r, n, n.segments, a, !0).pipe(
                      A(i => (i instanceof k2 ? [i] : []))
                  )
        }
        processChildren(t, r, n) {
            let a = []
            for (let i of Object.keys(n.children))
                i === 'primary' ? a.unshift(i) : a.push(i)
            return X(a).pipe(
                E1(i => {
                    let o = n.children[i],
                        c = Hv(r, i)
                    return this.processSegmentGroup(t, c, o, i)
                }),
                yn((i, o) => (i.push(...o), i)),
                I1(null),
                Cn(),
                r2(i => {
                    if (i === null) return l4(n)
                    let o = l5(i)
                    return LM(o), S(o)
                })
            )
        }
        processSegment(t, r, n, a, i, o) {
            return X(r).pipe(
                E1(c =>
                    this.processSegmentAgainstRoute(
                        c._injector ?? t,
                        r,
                        c,
                        n,
                        a,
                        i,
                        o
                    ).pipe(
                        N1(s => {
                            if (s instanceof z3) return S(null)
                            throw s
                        })
                    )
                ),
                H2(c => !!c),
                N1(c => {
                    if (c5(c)) return CM(n, a, i) ? S(new ma()) : l4(n)
                    throw c
                })
            )
        }
        processSegmentAgainstRoute(t, r, n, a, i, o, c) {
            return MM(n, a, i, o)
                ? n.redirectTo === void 0
                    ? this.matchSegmentAgainstRoute(t, a, n, i, o)
                    : this.allowRedirects && c
                    ? this.expandSegmentAgainstRouteUsingRedirect(
                          t,
                          a,
                          r,
                          n,
                          i,
                          o
                      )
                    : l4(a)
                : l4(a)
        }
        expandSegmentAgainstRouteUsingRedirect(t, r, n, a, i, o) {
            let {
                matched: c,
                consumedSegments: s,
                positionalParamSegments: l,
                remainingSegments: f,
            } = ba(r, a, i)
            if (!c) return l4(r)
            a.redirectTo.startsWith('/') &&
                (this.absoluteRedirectCount++,
                this.absoluteRedirectCount > zM && (this.allowRedirects = !1))
            let u = this.applyRedirects.applyRedirectCommands(
                s,
                a.redirectTo,
                l
            )
            return this.applyRedirects
                .lineralizeSegments(a, u)
                .pipe(r2(d => this.processSegment(t, n, r, d.concat(f), o, !1)))
        }
        matchSegmentAgainstRoute(t, r, n, a, i) {
            let o = dM(r, n, a, t, this.urlSerializer)
            return (
                n.path === '**' && (r.children = {}),
                o.pipe(
                    x2(c =>
                        c.matched
                            ? ((t = n._injector ?? t),
                              this.getChildConfig(t, n, a).pipe(
                                  x2(({ routes: s }) => {
                                      let l = n._loadedInjector ?? t,
                                          {
                                              consumedSegments: f,
                                              remainingSegments: u,
                                              parameters: d,
                                          } = c,
                                          p = new C3(
                                              f,
                                              d,
                                              Object.freeze(
                                                  z(
                                                      {},
                                                      this.urlTree.queryParams
                                                  )
                                              ),
                                              this.urlTree.fragment,
                                              bM(n),
                                              s1(n),
                                              n.component ??
                                                  n._loadedComponent ??
                                                  null,
                                              n,
                                              SM(n)
                                          ),
                                          {
                                              segmentGroup: m,
                                              slicedSegments: v,
                                          } = Bl(r, f, u, s)
                                      if (v.length === 0 && m.hasChildren())
                                          return this.processChildren(
                                              l,
                                              s,
                                              m
                                          ).pipe(
                                              A(M =>
                                                  M === null
                                                      ? null
                                                      : new k2(p, M)
                                              )
                                          )
                                      if (s.length === 0 && v.length === 0)
                                          return S(new k2(p, []))
                                      let C = s1(n) === i
                                      return this.processSegment(
                                          l,
                                          s,
                                          m,
                                          v,
                                          C ? I : i,
                                          !0
                                      ).pipe(
                                          A(
                                              M =>
                                                  new k2(
                                                      p,
                                                      M instanceof k2 ? [M] : []
                                                  )
                                          )
                                      )
                                  })
                              ))
                            : l4(r)
                    )
                )
            )
        }
        getChildConfig(t, r, n) {
            return r.children
                ? S({ routes: r.children, injector: t })
                : r.loadChildren
                ? r._loadedRoutes !== void 0
                    ? S({
                          routes: r._loadedRoutes,
                          injector: r._loadedInjector,
                      })
                    : sM(t, r, n, this.urlSerializer).pipe(
                          r2(a =>
                              a
                                  ? this.configLoader.loadChildren(t, r).pipe(
                                        a2(i => {
                                            ;(r._loadedRoutes = i.routes),
                                                (r._loadedInjector = i.injector)
                                        })
                                    )
                                  : uM(r)
                          )
                      )
                : S({ routes: [], injector: t })
        }
    }
function LM(e) {
    e.sort((t, r) =>
        t.value.outlet === I
            ? -1
            : r.value.outlet === I
            ? 1
            : t.value.outlet.localeCompare(r.value.outlet)
    )
}
function wM(e) {
    let t = e.value.routeConfig
    return t && t.path === ''
}
function l5(e) {
    let t = [],
        r = new Set()
    for (let n of e) {
        if (!wM(n)) {
            t.push(n)
            continue
        }
        let a = t.find(i => n.value.routeConfig === i.value.routeConfig)
        a !== void 0 ? (a.children.push(...n.children), r.add(a)) : t.push(n)
    }
    for (let n of r) {
        let a = l5(n.children)
        t.push(new k2(n.value, a))
    }
    return t.filter(n => !r.has(n))
}
function bM(e) {
    return e.data || {}
}
function SM(e) {
    return e.resolve || {}
}
function xM(e, t, r, n, a, i) {
    return r2(o =>
        yM(e, t, r, n, o.extractedUrl, a, i).pipe(
            A(({ state: c, tree: s }) =>
                K(z({}, o), { targetSnapshot: c, urlAfterRedirects: s })
            )
        )
    )
}
function DM(e, t) {
    return r2(r => {
        let {
            targetSnapshot: n,
            guards: { canActivateChecks: a },
        } = r
        if (!a.length) return S(r)
        let i = new Set(a.map(s => s.route)),
            o = new Set()
        for (let s of i) if (!o.has(s)) for (let l of f5(s)) o.add(l)
        let c = 0
        return X(o).pipe(
            E1(s =>
                i.has(s)
                    ? NM(s, n, e, t)
                    : ((s.data = Ca(s, s.parent, e).resolve), S(void 0))
            ),
            a2(() => c++),
            Ve(1),
            r2(s => (c === o.size ? S(r) : b2))
        )
    })
}
function f5(e) {
    let t = e.children.map(r => f5(r)).flat()
    return [e, ...t]
}
function NM(e, t, r, n) {
    let a = e.routeConfig,
        i = e._resolve
    return (
        a?.title !== void 0 && !n5(a) && (i[L3] = a.title),
        EM(i, e, t, n).pipe(
            A(
                o => (
                    (e._resolvedData = o),
                    (e.data = Ca(e, e.parent, r).resolve),
                    null
                )
            )
        )
    )
}
function EM(e, t, r, n) {
    let a = q6(e)
    if (a.length === 0) return S({})
    let i = {}
    return X(a).pipe(
        r2(o =>
            IM(e[o], t, r, n).pipe(
                H2(),
                a2(c => {
                    i[o] = c
                })
            )
        ),
        Ve(1),
        Mn(i),
        N1(o => (c5(o) ? b2 : Ue(o)))
    )
}
function IM(e, t, r, n) {
    let a = w3(t) ?? n,
        i = v4(e, a),
        o = i.resolve ? i.resolve(t, r) : M1(a, () => i(t, r))
    return Y1(o)
}
function $6(e) {
    return x2(t => {
        let r = e(t)
        return r ? X(r).pipe(A(() => t)) : S(t)
    })
}
var u5 = (() => {
        let t = class t {
            buildTitle(n) {
                let a,
                    i = n.root
                for (; i !== void 0; )
                    (a = this.getResolvedTitleForRoute(i) ?? a),
                        (i = i.children.find(o => o.outlet === I))
                return a
            }
            getResolvedTitleForRoute(n) {
                return n.data[L3]
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => g(TM),
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    TM = (() => {
        let t = class t extends u5 {
            constructor(n) {
                super(), (this.title = n)
            }
            updateTitle(n) {
                let a = this.buildTitle(n)
                a !== void 0 && this.title.setTitle(a)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(D(Al))
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    Sa = new b('', { providedIn: 'root', factory: () => ({}) }),
    xa = new b(''),
    AM = (() => {
        let t = class t {
            constructor() {
                ;(this.componentLoaders = new WeakMap()),
                    (this.childrenLoaders = new WeakMap()),
                    (this.compiler = g(y6))
            }
            loadComponent(n) {
                if (this.componentLoaders.get(n))
                    return this.componentLoaders.get(n)
                if (n._loadedComponent) return S(n._loadedComponent)
                this.onLoadStartListener && this.onLoadStartListener(n)
                let a = Y1(n.loadComponent()).pipe(
                        A(d5),
                        a2(o => {
                            this.onLoadEndListener && this.onLoadEndListener(n),
                                (n._loadedComponent = o)
                        }),
                        T1(() => {
                            this.componentLoaders.delete(n)
                        })
                    ),
                    i = new je(a, () => new v2()).pipe(Be())
                return this.componentLoaders.set(n, i), i
            }
            loadChildren(n, a) {
                if (this.childrenLoaders.get(a))
                    return this.childrenLoaders.get(a)
                if (a._loadedRoutes)
                    return S({
                        routes: a._loadedRoutes,
                        injector: a._loadedInjector,
                    })
                this.onLoadStartListener && this.onLoadStartListener(a)
                let o = kM(a, this.compiler, n, this.onLoadEndListener).pipe(
                        T1(() => {
                            this.childrenLoaders.delete(a)
                        })
                    ),
                    c = new je(o, () => new v2()).pipe(Be())
                return this.childrenLoaders.set(a, c), c
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })()
function kM(e, t, r, n) {
    return Y1(e.loadChildren()).pipe(
        A(d5),
        r2(a =>
            a instanceof O4 || Array.isArray(a)
                ? S(a)
                : X(t.compileModuleAsync(a))
        ),
        A(a => {
            n && n(e)
            let i,
                o,
                c = !1
            return (
                Array.isArray(a)
                    ? ((o = a), (c = !0))
                    : ((i = a.create(r).injector),
                      (o = i.get(xa, [], { optional: !0, self: !0 }).flat())),
                { routes: o.map(wa), injector: i }
            )
        })
    )
}
function RM(e) {
    return e && typeof e == 'object' && 'default' in e
}
function d5(e) {
    return RM(e) ? e.default : e
}
var Da = (() => {
        let t = class t {}
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => g(PM),
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    PM = (() => {
        let t = class t {
            shouldProcessUrl(n) {
                return !0
            }
            extract(n) {
                return n
            }
            merge(n, a) {
                return n
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    _M = new b('')
var FM = (() => {
    let t = class t {
        get hasRequestedNavigation() {
            return this.navigationId !== 0
        }
        constructor() {
            ;(this.currentNavigation = null),
                (this.currentTransition = null),
                (this.lastSuccessfulNavigation = null),
                (this.events = new v2()),
                (this.transitionAbortSubject = new v2()),
                (this.configLoader = g(AM)),
                (this.environmentInjector = g(L2)),
                (this.urlSerializer = g(Ma)),
                (this.rootContexts = g(Ot)),
                (this.location = g(be)),
                (this.inputBindingEnabled = g(La, { optional: !0 }) !== null),
                (this.titleStrategy = g(u5)),
                (this.options = g(Sa, { optional: !0 }) || {}),
                (this.paramsInheritanceStrategy =
                    this.options.paramsInheritanceStrategy || 'emptyOnly'),
                (this.urlHandlingStrategy = g(Da)),
                (this.createViewTransition = g(_M, { optional: !0 })),
                (this.navigationId = 0),
                (this.afterPreactivation = () => S(void 0)),
                (this.rootComponentType = null)
            let n = i => this.events.next(new ta(i)),
                a = i => this.events.next(new na(i))
            ;(this.configLoader.onLoadEndListener = a),
                (this.configLoader.onLoadStartListener = n)
        }
        complete() {
            this.transitions?.complete()
        }
        handleNavigationRequest(n) {
            let a = ++this.navigationId
            this.transitions?.next(
                K(z(z({}, this.transitions.value), n), { id: a })
            )
        }
        setupNavigations(n, a, i) {
            return (
                (this.transitions = new l2({
                    id: 0,
                    currentUrlTree: a,
                    currentRawUrl: a,
                    extractedUrl: this.urlHandlingStrategy.extract(a),
                    urlAfterRedirects: this.urlHandlingStrategy.extract(a),
                    rawUrl: a,
                    extras: {},
                    resolve: null,
                    reject: null,
                    promise: Promise.resolve(!0),
                    source: d3,
                    restoredState: null,
                    currentSnapshot: i.snapshot,
                    targetSnapshot: null,
                    currentRouterState: i,
                    targetRouterState: null,
                    guards: { canActivateChecks: [], canDeactivateChecks: [] },
                    guardsResult: null,
                })),
                this.transitions.pipe(
                    S2(o => o.id !== 0),
                    A(o =>
                        K(z({}, o), {
                            extractedUrl: this.urlHandlingStrategy.extract(
                                o.rawUrl
                            ),
                        })
                    ),
                    x2(o => {
                        let c = !1,
                            s = !1
                        return S(o).pipe(
                            x2(l => {
                                if (this.navigationId > o.id)
                                    return (
                                        this.cancelNavigationTransition(
                                            o,
                                            '',
                                            R2.SupersededByNewNavigation
                                        ),
                                        b2
                                    )
                                ;(this.currentTransition = o),
                                    (this.currentNavigation = {
                                        id: l.id,
                                        initialUrl: l.rawUrl,
                                        extractedUrl: l.extractedUrl,
                                        trigger: l.source,
                                        extras: l.extras,
                                        previousNavigation: this
                                            .lastSuccessfulNavigation
                                            ? K(
                                                  z(
                                                      {},
                                                      this
                                                          .lastSuccessfulNavigation
                                                  ),
                                                  { previousNavigation: null }
                                              )
                                            : null,
                                    })
                                let f =
                                        !n.navigated ||
                                        this.isUpdatingInternalState() ||
                                        this.isUpdatedBrowserUrl(),
                                    u =
                                        l.extras.onSameUrlNavigation ??
                                        n.onSameUrlNavigation
                                if (!f && u !== 'reload') {
                                    let d = ''
                                    return (
                                        this.events.next(
                                            new Ne(
                                                l.id,
                                                this.urlSerializer.serialize(
                                                    l.rawUrl
                                                ),
                                                d,
                                                Z6.IgnoredSameUrlNavigation
                                            )
                                        ),
                                        l.resolve(null),
                                        b2
                                    )
                                }
                                if (
                                    this.urlHandlingStrategy.shouldProcessUrl(
                                        l.rawUrl
                                    )
                                )
                                    return S(l).pipe(
                                        x2(d => {
                                            let p = this.transitions?.getValue()
                                            return (
                                                this.events.next(
                                                    new m3(
                                                        d.id,
                                                        this.urlSerializer.serialize(
                                                            d.extractedUrl
                                                        ),
                                                        d.source,
                                                        d.restoredState
                                                    )
                                                ),
                                                p !==
                                                this.transitions?.getValue()
                                                    ? b2
                                                    : Promise.resolve(d)
                                            )
                                        }),
                                        xM(
                                            this.environmentInjector,
                                            this.configLoader,
                                            this.rootComponentType,
                                            n.config,
                                            this.urlSerializer,
                                            this.paramsInheritanceStrategy
                                        ),
                                        a2(d => {
                                            ;(o.targetSnapshot =
                                                d.targetSnapshot),
                                                (o.urlAfterRedirects =
                                                    d.urlAfterRedirects),
                                                (this.currentNavigation = K(
                                                    z(
                                                        {},
                                                        this.currentNavigation
                                                    ),
                                                    {
                                                        finalUrl:
                                                            d.urlAfterRedirects,
                                                    }
                                                ))
                                            let p = new At(
                                                d.id,
                                                this.urlSerializer.serialize(
                                                    d.extractedUrl
                                                ),
                                                this.urlSerializer.serialize(
                                                    d.urlAfterRedirects
                                                ),
                                                d.targetSnapshot
                                            )
                                            this.events.next(p)
                                        })
                                    )
                                if (
                                    f &&
                                    this.urlHandlingStrategy.shouldProcessUrl(
                                        l.currentRawUrl
                                    )
                                ) {
                                    let {
                                            id: d,
                                            extractedUrl: p,
                                            source: m,
                                            restoredState: v,
                                            extras: C,
                                        } = l,
                                        M = new m3(
                                            d,
                                            this.urlSerializer.serialize(p),
                                            m,
                                            v
                                        )
                                    this.events.next(M)
                                    let E = e5(this.rootComponentType).snapshot
                                    return (
                                        (this.currentTransition = o =
                                            K(z({}, l), {
                                                targetSnapshot: E,
                                                urlAfterRedirects: p,
                                                extras: K(z({}, C), {
                                                    skipLocationChange: !1,
                                                    replaceUrl: !1,
                                                }),
                                            })),
                                        (this.currentNavigation.finalUrl = p),
                                        S(o)
                                    )
                                } else {
                                    let d = ''
                                    return (
                                        this.events.next(
                                            new Ne(
                                                l.id,
                                                this.urlSerializer.serialize(
                                                    l.extractedUrl
                                                ),
                                                d,
                                                Z6.IgnoredByUrlHandlingStrategy
                                            )
                                        ),
                                        l.resolve(null),
                                        b2
                                    )
                                }
                            }),
                            a2(l => {
                                let f = new K6(
                                    l.id,
                                    this.urlSerializer.serialize(
                                        l.extractedUrl
                                    ),
                                    this.urlSerializer.serialize(
                                        l.urlAfterRedirects
                                    ),
                                    l.targetSnapshot
                                )
                                this.events.next(f)
                            }),
                            A(
                                l => (
                                    (this.currentTransition = o =
                                        K(z({}, l), {
                                            guards: $v(
                                                l.targetSnapshot,
                                                l.currentSnapshot,
                                                this.rootContexts
                                            ),
                                        })),
                                    o
                                )
                            ),
                            eM(this.environmentInjector, l =>
                                this.events.next(l)
                            ),
                            a2(l => {
                                if (
                                    ((o.guardsResult = l.guardsResult),
                                    h4(l.guardsResult))
                                )
                                    throw a5(this.urlSerializer, l.guardsResult)
                                let f = new X6(
                                    l.id,
                                    this.urlSerializer.serialize(
                                        l.extractedUrl
                                    ),
                                    this.urlSerializer.serialize(
                                        l.urlAfterRedirects
                                    ),
                                    l.targetSnapshot,
                                    !!l.guardsResult
                                )
                                this.events.next(f)
                            }),
                            S2(l =>
                                l.guardsResult
                                    ? !0
                                    : (this.cancelNavigationTransition(
                                          l,
                                          '',
                                          R2.GuardRejected
                                      ),
                                      !1)
                            ),
                            $6(l => {
                                if (l.guards.canActivateChecks.length)
                                    return S(l).pipe(
                                        a2(f => {
                                            let u = new J6(
                                                f.id,
                                                this.urlSerializer.serialize(
                                                    f.extractedUrl
                                                ),
                                                this.urlSerializer.serialize(
                                                    f.urlAfterRedirects
                                                ),
                                                f.targetSnapshot
                                            )
                                            this.events.next(u)
                                        }),
                                        x2(f => {
                                            let u = !1
                                            return S(f).pipe(
                                                DM(
                                                    this
                                                        .paramsInheritanceStrategy,
                                                    this.environmentInjector
                                                ),
                                                a2({
                                                    next: () => (u = !0),
                                                    complete: () => {
                                                        u ||
                                                            this.cancelNavigationTransition(
                                                                f,
                                                                '',
                                                                R2.NoDataFromResolver
                                                            )
                                                    },
                                                })
                                            )
                                        }),
                                        a2(f => {
                                            let u = new ea(
                                                f.id,
                                                this.urlSerializer.serialize(
                                                    f.extractedUrl
                                                ),
                                                this.urlSerializer.serialize(
                                                    f.urlAfterRedirects
                                                ),
                                                f.targetSnapshot
                                            )
                                            this.events.next(u)
                                        })
                                    )
                            }),
                            $6(l => {
                                let f = u => {
                                    let d = []
                                    u.routeConfig?.loadComponent &&
                                        !u.routeConfig._loadedComponent &&
                                        d.push(
                                            this.configLoader
                                                .loadComponent(u.routeConfig)
                                                .pipe(
                                                    a2(p => {
                                                        u.component = p
                                                    }),
                                                    A(() => {})
                                                )
                                        )
                                    for (let p of u.children) d.push(...f(p))
                                    return d
                                }
                                return J3(f(l.targetSnapshot.root)).pipe(
                                    I1(null),
                                    u1(1)
                                )
                            }),
                            $6(() => this.afterPreactivation()),
                            x2(() => {
                                let { currentSnapshot: l, targetSnapshot: f } =
                                        o,
                                    u = this.createViewTransition?.(
                                        this.environmentInjector,
                                        l.root,
                                        f.root
                                    )
                                return u ? X(u).pipe(A(() => o)) : S(o)
                            }),
                            A(l => {
                                let f = _v(
                                    n.routeReuseStrategy,
                                    l.targetSnapshot,
                                    l.currentRouterState
                                )
                                return (
                                    (this.currentTransition = o =
                                        K(z({}, l), { targetRouterState: f })),
                                    (this.currentNavigation.targetRouterState =
                                        f),
                                    o
                                )
                            }),
                            a2(() => {
                                this.events.next(new v3())
                            }),
                            Vv(
                                this.rootContexts,
                                n.routeReuseStrategy,
                                l => this.events.next(l),
                                this.inputBindingEnabled
                            ),
                            u1(1),
                            a2({
                                next: l => {
                                    ;(c = !0),
                                        (this.lastSuccessfulNavigation =
                                            this.currentNavigation),
                                        this.events.next(
                                            new De(
                                                l.id,
                                                this.urlSerializer.serialize(
                                                    l.extractedUrl
                                                ),
                                                this.urlSerializer.serialize(
                                                    l.urlAfterRedirects
                                                )
                                            )
                                        ),
                                        this.titleStrategy?.updateTitle(
                                            l.targetRouterState.snapshot
                                        ),
                                        l.resolve(!0)
                                },
                                complete: () => {
                                    c = !0
                                },
                            }),
                            Ln(
                                this.transitionAbortSubject.pipe(
                                    a2(l => {
                                        throw l
                                    })
                                )
                            ),
                            T1(() => {
                                !c &&
                                    !s &&
                                    this.cancelNavigationTransition(
                                        o,
                                        '',
                                        R2.SupersededByNewNavigation
                                    ),
                                    this.currentTransition?.id === o.id &&
                                        ((this.currentNavigation = null),
                                        (this.currentTransition = null))
                            }),
                            N1(l => {
                                if (((s = !0), o5(l)))
                                    this.events.next(
                                        new G1(
                                            o.id,
                                            this.urlSerializer.serialize(
                                                o.extractedUrl
                                            ),
                                            l.message,
                                            l.cancellationCode
                                        )
                                    ),
                                        Bv(l)
                                            ? this.events.next(new M3(l.url))
                                            : o.resolve(!1)
                                else {
                                    this.events.next(
                                        new g3(
                                            o.id,
                                            this.urlSerializer.serialize(
                                                o.extractedUrl
                                            ),
                                            l,
                                            o.targetSnapshot ?? void 0
                                        )
                                    )
                                    try {
                                        o.resolve(n.errorHandler(l))
                                    } catch (f) {
                                        this.options
                                            .resolveNavigationPromiseOnError
                                            ? o.resolve(!1)
                                            : o.reject(f)
                                    }
                                }
                                return b2
                            })
                        )
                    })
                )
            )
        }
        cancelNavigationTransition(n, a, i) {
            let o = new G1(
                n.id,
                this.urlSerializer.serialize(n.extractedUrl),
                a,
                i
            )
            this.events.next(o), n.resolve(!1)
        }
        isUpdatingInternalState() {
            return (
                this.currentTransition?.extractedUrl.toString() !==
                this.currentTransition?.currentUrlTree.toString()
            )
        }
        isUpdatedBrowserUrl() {
            return (
                this.urlHandlingStrategy
                    .extract(this.urlSerializer.parse(this.location.path(!0)))
                    .toString() !==
                    this.currentTransition?.extractedUrl.toString() &&
                !this.currentTransition?.extras.skipLocationChange
            )
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
function OM(e) {
    return e !== d3
}
var BM = (() => {
        let t = class t {}
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => g(jM),
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    va = class {
        shouldDetach(t) {
            return !1
        }
        store(t, r) {}
        shouldAttach(t) {
            return !1
        }
        retrieve(t) {
            return null
        }
        shouldReuseRoute(t, r) {
            return t.routeConfig === r.routeConfig
        }
    },
    jM = (() => {
        let t = class t extends va {}
        ;(t.ɵfac = (() => {
            let n
            return function (i) {
                return (n || (n = V0(t)))(i || t)
            }
        })()),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    p5 = (() => {
        let t = class t {}
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({
                token: t,
                factory: () => g(UM),
                providedIn: 'root',
            }))
        let e = t
        return e
    })(),
    UM = (() => {
        let t = class t extends p5 {
            constructor() {
                super(...arguments),
                    (this.location = g(be)),
                    (this.urlSerializer = g(Ma)),
                    (this.options = g(Sa, { optional: !0 }) || {}),
                    (this.canceledNavigationResolution =
                        this.options.canceledNavigationResolution || 'replace'),
                    (this.urlHandlingStrategy = g(Da)),
                    (this.urlUpdateStrategy =
                        this.options.urlUpdateStrategy || 'deferred'),
                    (this.currentUrlTree = new q1()),
                    (this.rawUrlTree = this.currentUrlTree),
                    (this.currentPageId = 0),
                    (this.lastSuccessfulId = -1),
                    (this.routerState = e5(null)),
                    (this.stateMemento = this.createStateMemento())
            }
            getCurrentUrlTree() {
                return this.currentUrlTree
            }
            getRawUrlTree() {
                return this.rawUrlTree
            }
            restoredState() {
                return this.location.getState()
            }
            get browserPageId() {
                return this.canceledNavigationResolution !== 'computed'
                    ? this.currentPageId
                    : this.restoredState()?.ɵrouterPageId ?? this.currentPageId
            }
            getRouterState() {
                return this.routerState
            }
            createStateMemento() {
                return {
                    rawUrlTree: this.rawUrlTree,
                    currentUrlTree: this.currentUrlTree,
                    routerState: this.routerState,
                }
            }
            registerNonRouterCurrentEntryChangeListener(n) {
                return this.location.subscribe(a => {
                    a.type === 'popstate' && n(a.url, a.state)
                })
            }
            handleRouterEvent(n, a) {
                if (n instanceof m3)
                    this.stateMemento = this.createStateMemento()
                else if (n instanceof Ne) this.rawUrlTree = a.initialUrl
                else if (n instanceof At) {
                    if (
                        this.urlUpdateStrategy === 'eager' &&
                        !a.extras.skipLocationChange
                    ) {
                        let i = this.urlHandlingStrategy.merge(
                            a.finalUrl,
                            a.initialUrl
                        )
                        this.setBrowserUrl(i, a)
                    }
                } else
                    n instanceof v3
                        ? ((this.currentUrlTree = a.finalUrl),
                          (this.rawUrlTree = this.urlHandlingStrategy.merge(
                              a.finalUrl,
                              a.initialUrl
                          )),
                          (this.routerState = a.targetRouterState),
                          this.urlUpdateStrategy === 'deferred' &&
                              (a.extras.skipLocationChange ||
                                  this.setBrowserUrl(this.rawUrlTree, a)))
                        : n instanceof G1 &&
                          (n.code === R2.GuardRejected ||
                              n.code === R2.NoDataFromResolver)
                        ? this.restoreHistory(a)
                        : n instanceof g3
                        ? this.restoreHistory(a, !0)
                        : n instanceof De &&
                          ((this.lastSuccessfulId = n.id),
                          (this.currentPageId = this.browserPageId))
            }
            setBrowserUrl(n, a) {
                let i = this.urlSerializer.serialize(n)
                if (
                    this.location.isCurrentPathEqualTo(i) ||
                    a.extras.replaceUrl
                ) {
                    let o = this.browserPageId,
                        c = z(
                            z({}, a.extras.state),
                            this.generateNgRouterState(a.id, o)
                        )
                    this.location.replaceState(i, '', c)
                } else {
                    let o = z(
                        z({}, a.extras.state),
                        this.generateNgRouterState(a.id, this.browserPageId + 1)
                    )
                    this.location.go(i, '', o)
                }
            }
            restoreHistory(n, a = !1) {
                if (this.canceledNavigationResolution === 'computed') {
                    let i = this.browserPageId,
                        o = this.currentPageId - i
                    o !== 0
                        ? this.location.historyGo(o)
                        : this.currentUrlTree === n.finalUrl &&
                          o === 0 &&
                          (this.resetState(n), this.resetUrlToCurrentUrlTree())
                } else
                    this.canceledNavigationResolution === 'replace' &&
                        (a && this.resetState(n),
                        this.resetUrlToCurrentUrlTree())
            }
            resetState(n) {
                ;(this.routerState = this.stateMemento.routerState),
                    (this.currentUrlTree = this.stateMemento.currentUrlTree),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        this.currentUrlTree,
                        n.finalUrl ?? this.rawUrlTree
                    ))
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(
                    this.urlSerializer.serialize(this.rawUrlTree),
                    '',
                    this.generateNgRouterState(
                        this.lastSuccessfulId,
                        this.currentPageId
                    )
                )
            }
            generateNgRouterState(n, a) {
                return this.canceledNavigationResolution === 'computed'
                    ? { navigationId: n, ɵrouterPageId: a }
                    : { navigationId: n }
            }
        }
        ;(t.ɵfac = (() => {
            let n
            return function (i) {
                return (n || (n = V0(t)))(i || t)
            }
        })()),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    f3 = (function (e) {
        return (
            (e[(e.COMPLETE = 0)] = 'COMPLETE'),
            (e[(e.FAILED = 1)] = 'FAILED'),
            (e[(e.REDIRECTING = 2)] = 'REDIRECTING'),
            e
        )
    })(f3 || {})
function HM(e, t) {
    e.events
        .pipe(
            S2(
                r =>
                    r instanceof De ||
                    r instanceof G1 ||
                    r instanceof g3 ||
                    r instanceof Ne
            ),
            A(r =>
                r instanceof De || r instanceof Ne
                    ? f3.COMPLETE
                    : (
                          r instanceof G1
                              ? r.code === R2.Redirect ||
                                r.code === R2.SupersededByNewNavigation
                              : !1
                      )
                    ? f3.REDIRECTING
                    : f3.FAILED
            ),
            S2(r => r !== f3.REDIRECTING),
            u1(1)
        )
        .subscribe(() => {
            t()
        })
}
function VM(e) {
    throw e
}
var $M = {
        paths: 'exact',
        fragment: 'ignored',
        matrixParams: 'ignored',
        queryParams: 'exact',
    },
    WM = {
        paths: 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored',
        queryParams: 'subset',
    },
    jt = (() => {
        let t = class t {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree()
            }
            get rawUrlTree() {
                return this.stateManager.getRawUrlTree()
            }
            get events() {
                return this._events
            }
            get routerState() {
                return this.stateManager.getRouterState()
            }
            constructor() {
                ;(this.disposed = !1),
                    (this.isNgZoneEnabled = !1),
                    (this.console = g(lt)),
                    (this.stateManager = g(p5)),
                    (this.options = g(Sa, { optional: !0 }) || {}),
                    (this.pendingTasks = g(Ce)),
                    (this.urlUpdateStrategy =
                        this.options.urlUpdateStrategy || 'deferred'),
                    (this.navigationTransitions = g(FM)),
                    (this.urlSerializer = g(Ma)),
                    (this.location = g(be)),
                    (this.urlHandlingStrategy = g(Da)),
                    (this._events = new v2()),
                    (this.errorHandler = this.options.errorHandler || VM),
                    (this.navigated = !1),
                    (this.routeReuseStrategy = g(BM)),
                    (this.onSameUrlNavigation =
                        this.options.onSameUrlNavigation || 'ignore'),
                    (this.config = g(xa, { optional: !0 })?.flat() ?? []),
                    (this.componentInputBindingEnabled = !!g(La, {
                        optional: !0,
                    })),
                    (this.eventsSubscription = new n2()),
                    (this.isNgZoneEnabled =
                        g(J) instanceof J && J.isInAngularZone()),
                    this.resetConfig(this.config),
                    this.navigationTransitions
                        .setupNavigations(
                            this,
                            this.currentUrlTree,
                            this.routerState
                        )
                        .subscribe({
                            error: n => {
                                this.console.warn(n)
                            },
                        }),
                    this.subscribeToNavigationEvents()
            }
            subscribeToNavigationEvents() {
                let n = this.navigationTransitions.events.subscribe(a => {
                    try {
                        let i = this.navigationTransitions.currentTransition,
                            o = this.navigationTransitions.currentNavigation
                        if (i !== null && o !== null) {
                            if (
                                (this.stateManager.handleRouterEvent(a, o),
                                a instanceof G1 &&
                                    a.code !== R2.Redirect &&
                                    a.code !== R2.SupersededByNewNavigation)
                            )
                                this.navigated = !0
                            else if (a instanceof De) this.navigated = !0
                            else if (a instanceof M3) {
                                let c = this.urlHandlingStrategy.merge(
                                        a.url,
                                        i.currentRawUrl
                                    ),
                                    s = {
                                        info: i.extras.info,
                                        skipLocationChange:
                                            i.extras.skipLocationChange,
                                        replaceUrl:
                                            this.urlUpdateStrategy ===
                                                'eager' || OM(i.source),
                                    }
                                this.scheduleNavigation(c, d3, null, s, {
                                    resolve: i.resolve,
                                    reject: i.reject,
                                    promise: i.promise,
                                })
                            }
                        }
                        GM(a) && this._events.next(a)
                    } catch (i) {
                        this.navigationTransitions.transitionAbortSubject.next(
                            i
                        )
                    }
                })
                this.eventsSubscription.add(n)
            }
            resetRootComponentType(n) {
                ;(this.routerState.root.component = n),
                    (this.navigationTransitions.rootComponentType = n)
            }
            initialNavigation() {
                this.setUpLocationChangeListener(),
                    this.navigationTransitions.hasRequestedNavigation ||
                        this.navigateToSyncWithBrowser(
                            this.location.path(!0),
                            d3,
                            this.stateManager.restoredState()
                        )
            }
            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ??=
                    this.stateManager.registerNonRouterCurrentEntryChangeListener(
                        (n, a) => {
                            setTimeout(() => {
                                this.navigateToSyncWithBrowser(n, 'popstate', a)
                            }, 0)
                        }
                    )
            }
            navigateToSyncWithBrowser(n, a, i) {
                let o = { replaceUrl: !0 },
                    c = i?.navigationId ? i : null
                if (i) {
                    let l = z({}, i)
                    delete l.navigationId,
                        delete l.ɵrouterPageId,
                        Object.keys(l).length !== 0 && (o.state = l)
                }
                let s = this.parseUrl(n)
                this.scheduleNavigation(s, a, c, o)
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree)
            }
            getCurrentNavigation() {
                return this.navigationTransitions.currentNavigation
            }
            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation
            }
            resetConfig(n) {
                ;(this.config = n.map(wa)), (this.navigated = !1)
            }
            ngOnDestroy() {
                this.dispose()
            }
            dispose() {
                this.navigationTransitions.complete(),
                    this.nonRouterCurrentEntryChangeSubscription &&
                        (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
                        (this.nonRouterCurrentEntryChangeSubscription =
                            void 0)),
                    (this.disposed = !0),
                    this.eventsSubscription.unsubscribe()
            }
            createUrlTree(n, a = {}) {
                let {
                        relativeTo: i,
                        queryParams: o,
                        fragment: c,
                        queryParamsHandling: s,
                        preserveFragment: l,
                    } = a,
                    f = l ? this.currentUrlTree.fragment : c,
                    u = null
                switch (s) {
                    case 'merge':
                        u = z(z({}, this.currentUrlTree.queryParams), o)
                        break
                    case 'preserve':
                        u = this.currentUrlTree.queryParams
                        break
                    default:
                        u = o || null
                }
                u !== null && (u = this.removeEmptyProps(u))
                let d
                try {
                    let p = i ? i.snapshot : this.routerState.snapshot.root
                    d = Zl(p)
                } catch {
                    ;(typeof n[0] != 'string' || !n[0].startsWith('/')) &&
                        (n = []),
                        (d = this.currentUrlTree.root)
                }
                return Kl(d, n, u, f ?? null)
            }
            navigateByUrl(n, a = { skipLocationChange: !1 }) {
                let i = h4(n) ? n : this.parseUrl(n),
                    o = this.urlHandlingStrategy.merge(i, this.rawUrlTree)
                return this.scheduleNavigation(o, d3, null, a)
            }
            navigate(n, a = { skipLocationChange: !1 }) {
                return qM(n), this.navigateByUrl(this.createUrlTree(n, a), a)
            }
            serializeUrl(n) {
                return this.urlSerializer.serialize(n)
            }
            parseUrl(n) {
                try {
                    return this.urlSerializer.parse(n)
                } catch {
                    return this.urlSerializer.parse('/')
                }
            }
            isActive(n, a) {
                let i
                if (
                    (a === !0
                        ? (i = z({}, $M))
                        : a === !1
                        ? (i = z({}, WM))
                        : (i = a),
                    h4(n))
                )
                    return Pl(this.currentUrlTree, n, i)
                let o = this.parseUrl(n)
                return Pl(this.currentUrlTree, o, i)
            }
            removeEmptyProps(n) {
                return Object.entries(n).reduce(
                    (a, [i, o]) => (o != null && (a[i] = o), a),
                    {}
                )
            }
            scheduleNavigation(n, a, i, o, c) {
                if (this.disposed) return Promise.resolve(!1)
                let s, l, f
                c
                    ? ((s = c.resolve), (l = c.reject), (f = c.promise))
                    : (f = new Promise((d, p) => {
                          ;(s = d), (l = p)
                      }))
                let u = this.pendingTasks.add()
                return (
                    HM(this, () => {
                        queueMicrotask(() => this.pendingTasks.remove(u))
                    }),
                    this.navigationTransitions.handleNavigationRequest({
                        source: a,
                        restoredState: i,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.currentUrlTree,
                        rawUrl: n,
                        extras: o,
                        resolve: s,
                        reject: l,
                        promise: f,
                        currentSnapshot: this.routerState.snapshot,
                        currentRouterState: this.routerState,
                    }),
                    f.catch(d => Promise.reject(d))
                )
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })()
function qM(e) {
    for (let t = 0; t < e.length; t++) if (e[t] == null) throw new w(4008, !1)
}
function GM(e) {
    return !(e instanceof v3) && !(e instanceof M3)
}
var YM = new b('')
function h5(e, ...t) {
    return O1([
        { provide: xa, multi: !0, useValue: e },
        [],
        { provide: m4, useFactory: QM, deps: [jt] },
        { provide: a4, multi: !0, useFactory: ZM },
        t.map(r => r.ɵproviders),
    ])
}
function QM(e) {
    return e.routerState.root
}
function ZM() {
    let e = g(ge)
    return t => {
        let r = e.get(V1)
        if (t !== r.components[0]) return
        let n = e.get(jt),
            a = e.get(KM)
        e.get(XM) === 1 && n.initialNavigation(),
            e.get(JM, null, k.Optional)?.setUpPreloading(),
            e.get(YM, null, k.Optional)?.init(),
            n.resetRootComponentType(r.componentTypes[0]),
            a.closed || (a.next(), a.complete(), a.unsubscribe())
    }
}
var KM = new b('', { factory: () => new v2() }),
    XM = new b('', { providedIn: 'root', factory: () => 1 })
var JM = new b('')
var m5 = (() => {
    let t = class t {}
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-error']],
            standalone: !0,
            features: [t2],
            decls: 2,
            vars: 0,
            template: function (a, i) {
                a & 1 && (W(0, 'p'), h2(1, 'error works!'), G())
            },
            dependencies: [d2],
        }))
    let e = t
    return e
})()
function Pa(e, t) {
    ;(t == null || t > e.length) && (t = e.length)
    for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r]
    return n
}
function eC(e) {
    if (Array.isArray(e)) return e
}
function tC(e) {
    if (Array.isArray(e)) return Pa(e)
}
function nC(e, t) {
    if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function')
}
function g5(e, t) {
    for (var r = 0; r < t.length; r++) {
        var n = t[r]
        ;(n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            'value' in n && (n.writable = !0),
            Object.defineProperty(e, Y5(n.key), n)
    }
}
function rC(e, t, r) {
    return (
        t && g5(e.prototype, t),
        r && g5(e, r),
        Object.defineProperty(e, 'prototype', { writable: !1 }),
        e
    )
}
function Vt(e, t) {
    var r = (typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator']
    if (!r) {
        if (
            Array.isArray(e) ||
            (r = Qa(e)) ||
            (t && e && typeof e.length == 'number')
        ) {
            r && (e = r)
            var n = 0,
                a = function () {}
            return {
                s: a,
                n: function () {
                    return n >= e.length
                        ? { done: !0 }
                        : { done: !1, value: e[n++] }
                },
                e: function (s) {
                    throw s
                },
                f: a,
            }
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
    }
    var i,
        o = !0,
        c = !1
    return {
        s: function () {
            r = r.call(e)
        },
        n: function () {
            var s = r.next()
            return (o = s.done), s
        },
        e: function (s) {
            ;(c = !0), (i = s)
        },
        f: function () {
            try {
                o || r.return == null || r.return()
            } finally {
                if (c) throw i
            }
        },
    }
}
function _(e, t, r) {
    return (
        (t = Y5(t)) in e
            ? Object.defineProperty(e, t, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
              })
            : (e[t] = r),
        e
    )
}
function aC(e) {
    if (
        (typeof Symbol < 'u' && e[Symbol.iterator] != null) ||
        e['@@iterator'] != null
    )
        return Array.from(e)
}
function iC(e, t) {
    var r =
        e == null
            ? null
            : (typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator']
    if (r != null) {
        var n,
            a,
            i,
            o,
            c = [],
            s = !0,
            l = !1
        try {
            if (((i = (r = r.call(e)).next), t === 0)) {
                if (Object(r) !== r) return
                s = !1
            } else
                for (
                    ;
                    !(s = (n = i.call(r)).done) &&
                    (c.push(n.value), c.length !== t);
                    s = !0
                );
        } catch (f) {
            ;(l = !0), (a = f)
        } finally {
            try {
                if (
                    !s &&
                    r.return != null &&
                    ((o = r.return()), Object(o) !== o)
                )
                    return
            } finally {
                if (l) throw a
            }
        }
        return c
    }
}
function oC() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function cC() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function v5(e, t) {
    var r = Object.keys(e)
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e)
        t &&
            (n = n.filter(function (a) {
                return Object.getOwnPropertyDescriptor(e, a).enumerable
            })),
            r.push.apply(r, n)
    }
    return r
}
function h(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {}
        t % 2
            ? v5(Object(r), !0).forEach(function (n) {
                  _(e, n, r[n])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : v5(Object(r)).forEach(function (n) {
                  Object.defineProperty(
                      e,
                      n,
                      Object.getOwnPropertyDescriptor(r, n)
                  )
              })
    }
    return e
}
function Qt(e, t) {
    return eC(e) || iC(e, t) || Qa(e, t) || oC()
}
function J2(e) {
    return tC(e) || aC(e) || Qa(e) || cC()
}
function sC(e, t) {
    if (typeof e != 'object' || !e) return e
    var r = e[Symbol.toPrimitive]
    if (r !== void 0) {
        var n = r.call(e, t || 'default')
        if (typeof n != 'object') return n
        throw new TypeError('@@toPrimitive must return a primitive value.')
    }
    return (t === 'string' ? String : Number)(e)
}
function Y5(e) {
    var t = sC(e, 'string')
    return typeof t == 'symbol' ? t : t + ''
}
function qt(e) {
    '@babel/helpers - typeof'
    return (
        (qt =
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                ? function (t) {
                      return typeof t
                  }
                : function (t) {
                      return t &&
                          typeof Symbol == 'function' &&
                          t.constructor === Symbol &&
                          t !== Symbol.prototype
                          ? 'symbol'
                          : typeof t
                  }),
        qt(e)
    )
}
function Qa(e, t) {
    if (e) {
        if (typeof e == 'string') return Pa(e, t)
        var r = {}.toString.call(e).slice(8, -1)
        return (
            r === 'Object' && e.constructor && (r = e.constructor.name),
            r === 'Map' || r === 'Set'
                ? Array.from(e)
                : r === 'Arguments' ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                ? Pa(e, t)
                : void 0
        )
    }
}
var M5 = function () {},
    Za = {},
    Q5 = {},
    Z5 = null,
    K5 = { mark: M5, measure: M5 }
try {
    typeof window < 'u' && (Za = window),
        typeof document < 'u' && (Q5 = document),
        typeof MutationObserver < 'u' && (Z5 = MutationObserver),
        typeof performance < 'u' && (K5 = performance)
} catch {}
var lC = Za.navigator || {},
    C5 = lC.userAgent,
    y5 = C5 === void 0 ? '' : C5,
    Z1 = Za,
    Y = Q5,
    z5 = Z5,
    Ut = K5,
    AE = !!Z1.document,
    x1 =
        !!Y.documentElement &&
        !!Y.head &&
        typeof Y.addEventListener == 'function' &&
        typeof Y.createElement == 'function',
    X5 = ~y5.indexOf('MSIE') || ~y5.indexOf('Trident/'),
    Na,
    fC =
        /fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|jr|jfr|jdr|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,
    uC =
        /Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Slab Press|Slab|Whiteboard)?.*/i,
    J5 = {
        classic: {
            fa: 'solid',
            fas: 'solid',
            'fa-solid': 'solid',
            far: 'regular',
            'fa-regular': 'regular',
            fal: 'light',
            'fa-light': 'light',
            fat: 'thin',
            'fa-thin': 'thin',
            fab: 'brands',
            'fa-brands': 'brands',
        },
        duotone: {
            fa: 'solid',
            fad: 'solid',
            'fa-solid': 'solid',
            'fa-duotone': 'solid',
            fadr: 'regular',
            'fa-regular': 'regular',
            fadl: 'light',
            'fa-light': 'light',
            fadt: 'thin',
            'fa-thin': 'thin',
        },
        sharp: {
            fa: 'solid',
            fass: 'solid',
            'fa-solid': 'solid',
            fasr: 'regular',
            'fa-regular': 'regular',
            fasl: 'light',
            'fa-light': 'light',
            fast: 'thin',
            'fa-thin': 'thin',
        },
        'sharp-duotone': {
            fa: 'solid',
            fasds: 'solid',
            'fa-solid': 'solid',
            fasdr: 'regular',
            'fa-regular': 'regular',
            fasdl: 'light',
            'fa-light': 'light',
            fasdt: 'thin',
            'fa-thin': 'thin',
        },
        slab: { 'fa-regular': 'regular', faslr: 'regular' },
        'slab-press': { 'fa-regular': 'regular', faslpr: 'regular' },
        thumbprint: { 'fa-light': 'light', fatl: 'light' },
        whiteboard: { 'fa-semibold': 'semibold', fawsb: 'semibold' },
        notdog: { 'fa-solid': 'solid', fans: 'solid' },
        'notdog-duo': { 'fa-solid': 'solid', fands: 'solid' },
        etch: { 'fa-solid': 'solid', faes: 'solid' },
        jelly: { 'fa-regular': 'regular', fajr: 'regular' },
        'jelly-fill': { 'fa-regular': 'regular', fajfr: 'regular' },
        'jelly-duo': { 'fa-regular': 'regular', fajdr: 'regular' },
        chisel: { 'fa-regular': 'regular', facr: 'regular' },
    },
    dC = {
        GROUP: 'duotone-group',
        SWAP_OPACITY: 'swap-opacity',
        PRIMARY: 'primary',
        SECONDARY: 'secondary',
    },
    e7 = [
        'fa-classic',
        'fa-duotone',
        'fa-sharp',
        'fa-sharp-duotone',
        'fa-thumbprint',
        'fa-whiteboard',
        'fa-notdog',
        'fa-notdog-duo',
        'fa-chisel',
        'fa-etch',
        'fa-jelly',
        'fa-jelly-fill',
        'fa-jelly-duo',
        'fa-slab',
        'fa-slab-press',
    ],
    g2 = 'classic',
    E3 = 'duotone',
    t7 = 'sharp',
    n7 = 'sharp-duotone',
    r7 = 'chisel',
    a7 = 'etch',
    i7 = 'jelly',
    o7 = 'jelly-duo',
    c7 = 'jelly-fill',
    s7 = 'notdog',
    l7 = 'notdog-duo',
    f7 = 'slab',
    u7 = 'slab-press',
    d7 = 'thumbprint',
    p7 = 'whiteboard',
    pC = 'Classic',
    hC = 'Duotone',
    mC = 'Sharp',
    gC = 'Sharp Duotone',
    vC = 'Chisel',
    MC = 'Etch',
    CC = 'Jelly',
    yC = 'Jelly Duo',
    zC = 'Jelly Fill',
    LC = 'Notdog',
    wC = 'Notdog Duo',
    bC = 'Slab',
    SC = 'Slab Press',
    xC = 'Thumbprint',
    DC = 'Whiteboard',
    h7 = [g2, E3, t7, n7, r7, a7, i7, o7, c7, s7, l7, f7, u7, d7, p7],
    kE =
        ((Na = {}),
        _(
            _(
                _(
                    _(
                        _(
                            _(
                                _(_(_(_(Na, g2, pC), E3, hC), t7, mC), n7, gC),
                                r7,
                                vC
                            ),
                            a7,
                            MC
                        ),
                        i7,
                        CC
                    ),
                    o7,
                    yC
                ),
                c7,
                zC
            ),
            s7,
            LC
        ),
        _(_(_(_(_(Na, l7, wC), f7, bC), u7, SC), d7, xC), p7, DC)),
    NC = {
        classic: {
            900: 'fas',
            400: 'far',
            normal: 'far',
            300: 'fal',
            100: 'fat',
        },
        duotone: { 900: 'fad', 400: 'fadr', 300: 'fadl', 100: 'fadt' },
        sharp: { 900: 'fass', 400: 'fasr', 300: 'fasl', 100: 'fast' },
        'sharp-duotone': {
            900: 'fasds',
            400: 'fasdr',
            300: 'fasdl',
            100: 'fasdt',
        },
        slab: { 400: 'faslr' },
        'slab-press': { 400: 'faslpr' },
        whiteboard: { 600: 'fawsb' },
        thumbprint: { 300: 'fatl' },
        notdog: { 900: 'fans' },
        'notdog-duo': { 900: 'fands' },
        etch: { 900: 'faes' },
        chisel: { 400: 'facr' },
        jelly: { 400: 'fajr' },
        'jelly-fill': { 400: 'fajfr' },
        'jelly-duo': { 400: 'fajdr' },
    },
    EC = {
        'Font Awesome 7 Free': { 900: 'fas', 400: 'far' },
        'Font Awesome 7 Pro': {
            900: 'fas',
            400: 'far',
            normal: 'far',
            300: 'fal',
            100: 'fat',
        },
        'Font Awesome 7 Brands': { 400: 'fab', normal: 'fab' },
        'Font Awesome 7 Duotone': {
            900: 'fad',
            400: 'fadr',
            normal: 'fadr',
            300: 'fadl',
            100: 'fadt',
        },
        'Font Awesome 7 Sharp': {
            900: 'fass',
            400: 'fasr',
            normal: 'fasr',
            300: 'fasl',
            100: 'fast',
        },
        'Font Awesome 7 Sharp Duotone': {
            900: 'fasds',
            400: 'fasdr',
            normal: 'fasdr',
            300: 'fasdl',
            100: 'fasdt',
        },
        'Font Awesome 7 Jelly': { 400: 'fajr', normal: 'fajr' },
        'Font Awesome 7 Jelly Fill': { 400: 'fajfr', normal: 'fajfr' },
        'Font Awesome 7 Jelly Duo': { 400: 'fajdr', normal: 'fajdr' },
        'Font Awesome 7 Slab': { 400: 'faslr', normal: 'faslr' },
        'Font Awesome 7 Slab Press': { 400: 'faslpr', normal: 'faslpr' },
        'Font Awesome 7 Thumbprint': { 300: 'fatl', normal: 'fatl' },
        'Font Awesome 7 Notdog': { 900: 'fans', normal: 'fans' },
        'Font Awesome 7 Notdog Duo': { 900: 'fands', normal: 'fands' },
        'Font Awesome 7 Etch': { 900: 'faes', normal: 'faes' },
        'Font Awesome 7 Chisel': { 400: 'facr', normal: 'facr' },
        'Font Awesome 7 Whiteboard': { 600: 'fawsb', normal: 'fawsb' },
    },
    IC = new Map([
        [
            'classic',
            {
                defaultShortPrefixId: 'fas',
                defaultStyleId: 'solid',
                styleIds: ['solid', 'regular', 'light', 'thin', 'brands'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'duotone',
            {
                defaultShortPrefixId: 'fad',
                defaultStyleId: 'solid',
                styleIds: ['solid', 'regular', 'light', 'thin'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'sharp',
            {
                defaultShortPrefixId: 'fass',
                defaultStyleId: 'solid',
                styleIds: ['solid', 'regular', 'light', 'thin'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'sharp-duotone',
            {
                defaultShortPrefixId: 'fasds',
                defaultStyleId: 'solid',
                styleIds: ['solid', 'regular', 'light', 'thin'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'chisel',
            {
                defaultShortPrefixId: 'facr',
                defaultStyleId: 'regular',
                styleIds: ['regular'],
                futureStyleIds: [],
                defaultFontWeight: 400,
            },
        ],
        [
            'etch',
            {
                defaultShortPrefixId: 'faes',
                defaultStyleId: 'solid',
                styleIds: ['solid'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'jelly',
            {
                defaultShortPrefixId: 'fajr',
                defaultStyleId: 'regular',
                styleIds: ['regular'],
                futureStyleIds: [],
                defaultFontWeight: 400,
            },
        ],
        [
            'jelly-duo',
            {
                defaultShortPrefixId: 'fajdr',
                defaultStyleId: 'regular',
                styleIds: ['regular'],
                futureStyleIds: [],
                defaultFontWeight: 400,
            },
        ],
        [
            'jelly-fill',
            {
                defaultShortPrefixId: 'fajfr',
                defaultStyleId: 'regular',
                styleIds: ['regular'],
                futureStyleIds: [],
                defaultFontWeight: 400,
            },
        ],
        [
            'notdog',
            {
                defaultShortPrefixId: 'fans',
                defaultStyleId: 'solid',
                styleIds: ['solid'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'notdog-duo',
            {
                defaultShortPrefixId: 'fands',
                defaultStyleId: 'solid',
                styleIds: ['solid'],
                futureStyleIds: [],
                defaultFontWeight: 900,
            },
        ],
        [
            'slab',
            {
                defaultShortPrefixId: 'faslr',
                defaultStyleId: 'regular',
                styleIds: ['regular'],
                futureStyleIds: [],
                defaultFontWeight: 400,
            },
        ],
        [
            'slab-press',
            {
                defaultShortPrefixId: 'faslpr',
                defaultStyleId: 'regular',
                styleIds: ['regular'],
                futureStyleIds: [],
                defaultFontWeight: 400,
            },
        ],
        [
            'thumbprint',
            {
                defaultShortPrefixId: 'fatl',
                defaultStyleId: 'light',
                styleIds: ['light'],
                futureStyleIds: [],
                defaultFontWeight: 300,
            },
        ],
        [
            'whiteboard',
            {
                defaultShortPrefixId: 'fawsb',
                defaultStyleId: 'semibold',
                styleIds: ['semibold'],
                futureStyleIds: [],
                defaultFontWeight: 600,
            },
        ],
    ]),
    TC = {
        chisel: { regular: 'facr' },
        classic: {
            brands: 'fab',
            light: 'fal',
            regular: 'far',
            solid: 'fas',
            thin: 'fat',
        },
        duotone: { light: 'fadl', regular: 'fadr', solid: 'fad', thin: 'fadt' },
        etch: { solid: 'faes' },
        jelly: { regular: 'fajr' },
        'jelly-duo': { regular: 'fajdr' },
        'jelly-fill': { regular: 'fajfr' },
        notdog: { solid: 'fans' },
        'notdog-duo': { solid: 'fands' },
        sharp: { light: 'fasl', regular: 'fasr', solid: 'fass', thin: 'fast' },
        'sharp-duotone': {
            light: 'fasdl',
            regular: 'fasdr',
            solid: 'fasds',
            thin: 'fasdt',
        },
        slab: { regular: 'faslr' },
        'slab-press': { regular: 'faslpr' },
        thumbprint: { light: 'fatl' },
        whiteboard: { semibold: 'fawsb' },
    },
    m7 = ['fak', 'fa-kit', 'fakd', 'fa-kit-duotone'],
    L5 = {
        kit: { fak: 'kit', 'fa-kit': 'kit' },
        'kit-duotone': { fakd: 'kit-duotone', 'fa-kit-duotone': 'kit-duotone' },
    },
    AC = ['kit'],
    kC = 'kit',
    RC = 'kit-duotone',
    PC = 'Kit',
    _C = 'Kit Duotone',
    RE = _(_({}, kC, PC), RC, _C),
    FC = {
        kit: { 'fa-kit': 'fak' },
        'kit-duotone': { 'fa-kit-duotone': 'fakd' },
    },
    OC = {
        'Font Awesome Kit': { 400: 'fak', normal: 'fak' },
        'Font Awesome Kit Duotone': { 400: 'fakd', normal: 'fakd' },
    },
    BC = { kit: { fak: 'fa-kit' }, 'kit-duotone': { fakd: 'fa-kit-duotone' } },
    w5 = { kit: { kit: 'fak' }, 'kit-duotone': { 'kit-duotone': 'fakd' } },
    Ea,
    Ht = {
        GROUP: 'duotone-group',
        SWAP_OPACITY: 'swap-opacity',
        PRIMARY: 'primary',
        SECONDARY: 'secondary',
    },
    jC = [
        'fa-classic',
        'fa-duotone',
        'fa-sharp',
        'fa-sharp-duotone',
        'fa-thumbprint',
        'fa-whiteboard',
        'fa-notdog',
        'fa-notdog-duo',
        'fa-chisel',
        'fa-etch',
        'fa-jelly',
        'fa-jelly-fill',
        'fa-jelly-duo',
        'fa-slab',
        'fa-slab-press',
    ],
    UC = 'classic',
    HC = 'duotone',
    VC = 'sharp',
    $C = 'sharp-duotone',
    WC = 'chisel',
    qC = 'etch',
    GC = 'jelly',
    YC = 'jelly-duo',
    QC = 'jelly-fill',
    ZC = 'notdog',
    KC = 'notdog-duo',
    XC = 'slab',
    JC = 'slab-press',
    ey = 'thumbprint',
    ty = 'whiteboard',
    ny = 'Classic',
    ry = 'Duotone',
    ay = 'Sharp',
    iy = 'Sharp Duotone',
    oy = 'Chisel',
    cy = 'Etch',
    sy = 'Jelly',
    ly = 'Jelly Duo',
    fy = 'Jelly Fill',
    uy = 'Notdog',
    dy = 'Notdog Duo',
    py = 'Slab',
    hy = 'Slab Press',
    my = 'Thumbprint',
    gy = 'Whiteboard',
    PE =
        ((Ea = {}),
        _(
            _(
                _(
                    _(
                        _(
                            _(
                                _(_(_(_(Ea, UC, ny), HC, ry), VC, ay), $C, iy),
                                WC,
                                oy
                            ),
                            qC,
                            cy
                        ),
                        GC,
                        sy
                    ),
                    YC,
                    ly
                ),
                QC,
                fy
            ),
            ZC,
            uy
        ),
        _(_(_(_(_(Ea, KC, dy), XC, py), JC, hy), ey, my), ty, gy)),
    vy = 'kit',
    My = 'kit-duotone',
    Cy = 'Kit',
    yy = 'Kit Duotone',
    _E = _(_({}, vy, Cy), My, yy),
    zy = {
        classic: {
            'fa-brands': 'fab',
            'fa-duotone': 'fad',
            'fa-light': 'fal',
            'fa-regular': 'far',
            'fa-solid': 'fas',
            'fa-thin': 'fat',
        },
        duotone: {
            'fa-regular': 'fadr',
            'fa-light': 'fadl',
            'fa-thin': 'fadt',
        },
        sharp: {
            'fa-solid': 'fass',
            'fa-regular': 'fasr',
            'fa-light': 'fasl',
            'fa-thin': 'fast',
        },
        'sharp-duotone': {
            'fa-solid': 'fasds',
            'fa-regular': 'fasdr',
            'fa-light': 'fasdl',
            'fa-thin': 'fasdt',
        },
        slab: { 'fa-regular': 'faslr' },
        'slab-press': { 'fa-regular': 'faslpr' },
        whiteboard: { 'fa-semibold': 'fawsb' },
        thumbprint: { 'fa-light': 'fatl' },
        notdog: { 'fa-solid': 'fans' },
        'notdog-duo': { 'fa-solid': 'fands' },
        etch: { 'fa-solid': 'faes' },
        jelly: { 'fa-regular': 'fajr' },
        'jelly-fill': { 'fa-regular': 'fajfr' },
        'jelly-duo': { 'fa-regular': 'fajdr' },
        chisel: { 'fa-regular': 'facr' },
    },
    Ly = {
        classic: ['fas', 'far', 'fal', 'fat', 'fad'],
        duotone: ['fadr', 'fadl', 'fadt'],
        sharp: ['fass', 'fasr', 'fasl', 'fast'],
        'sharp-duotone': ['fasds', 'fasdr', 'fasdl', 'fasdt'],
        slab: ['faslr'],
        'slab-press': ['faslpr'],
        whiteboard: ['fawsb'],
        thumbprint: ['fatl'],
        notdog: ['fans'],
        'notdog-duo': ['fands'],
        etch: ['faes'],
        jelly: ['fajr'],
        'jelly-fill': ['fajfr'],
        'jelly-duo': ['fajdr'],
        chisel: ['facr'],
    },
    _a = {
        classic: {
            fab: 'fa-brands',
            fad: 'fa-duotone',
            fal: 'fa-light',
            far: 'fa-regular',
            fas: 'fa-solid',
            fat: 'fa-thin',
        },
        duotone: { fadr: 'fa-regular', fadl: 'fa-light', fadt: 'fa-thin' },
        sharp: {
            fass: 'fa-solid',
            fasr: 'fa-regular',
            fasl: 'fa-light',
            fast: 'fa-thin',
        },
        'sharp-duotone': {
            fasds: 'fa-solid',
            fasdr: 'fa-regular',
            fasdl: 'fa-light',
            fasdt: 'fa-thin',
        },
        slab: { faslr: 'fa-regular' },
        'slab-press': { faslpr: 'fa-regular' },
        whiteboard: { fawsb: 'fa-semibold' },
        thumbprint: { fatl: 'fa-light' },
        notdog: { fans: 'fa-solid' },
        'notdog-duo': { fands: 'fa-solid' },
        etch: { faes: 'fa-solid' },
        jelly: { fajr: 'fa-regular' },
        'jelly-fill': { fajfr: 'fa-regular' },
        'jelly-duo': { fajdr: 'fa-regular' },
        chisel: { facr: 'fa-regular' },
    },
    wy = [
        'fa-solid',
        'fa-regular',
        'fa-light',
        'fa-thin',
        'fa-duotone',
        'fa-brands',
        'fa-semibold',
    ],
    g7 = [
        'fa',
        'fas',
        'far',
        'fal',
        'fat',
        'fad',
        'fadr',
        'fadl',
        'fadt',
        'fab',
        'fass',
        'fasr',
        'fasl',
        'fast',
        'fasds',
        'fasdr',
        'fasdl',
        'fasdt',
        'faslr',
        'faslpr',
        'fawsb',
        'fatl',
        'fans',
        'fands',
        'faes',
        'fajr',
        'fajfr',
        'fajdr',
        'facr',
    ].concat(jC, wy),
    by = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands', 'semibold'],
    v7 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    Sy = v7.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
    xy = ['aw', 'fw', 'pull-left', 'pull-right'],
    Dy = []
        .concat(J2(Object.keys(Ly)), by, xy, [
            '2xs',
            'xs',
            'sm',
            'lg',
            'xl',
            '2xl',
            'beat',
            'border',
            'fade',
            'beat-fade',
            'bounce',
            'flip-both',
            'flip-horizontal',
            'flip-vertical',
            'flip',
            'inverse',
            'layers',
            'layers-bottom-left',
            'layers-bottom-right',
            'layers-counter',
            'layers-text',
            'layers-top-left',
            'layers-top-right',
            'li',
            'pull-end',
            'pull-start',
            'pulse',
            'rotate-180',
            'rotate-270',
            'rotate-90',
            'rotate-by',
            'shake',
            'spin-pulse',
            'spin-reverse',
            'spin',
            'stack-1x',
            'stack-2x',
            'stack',
            'ul',
            'width-auto',
            'width-fixed',
            Ht.GROUP,
            Ht.SWAP_OPACITY,
            Ht.PRIMARY,
            Ht.SECONDARY,
        ])
        .concat(
            v7.map(function (e) {
                return ''.concat(e, 'x')
            })
        )
        .concat(
            Sy.map(function (e) {
                return 'w-'.concat(e)
            })
        ),
    Ny = {
        'Font Awesome 5 Free': { 900: 'fas', 400: 'far' },
        'Font Awesome 5 Pro': {
            900: 'fas',
            400: 'far',
            normal: 'far',
            300: 'fal',
        },
        'Font Awesome 5 Brands': { 400: 'fab', normal: 'fab' },
        'Font Awesome 5 Duotone': { 900: 'fad' },
    },
    b1 = '___FONT_AWESOME___',
    Fa = 16,
    M7 = 'fa',
    C7 = 'svg-inline--fa',
    Ie = 'data-fa-i2svg',
    Oa = 'data-fa-pseudo-element',
    Ey = 'data-fa-pseudo-element-pending',
    Ka = 'data-prefix',
    Xa = 'data-icon',
    b5 = 'fontawesome-i2svg',
    Iy = 'async',
    Ty = ['HTML', 'HEAD', 'STYLE', 'SCRIPT'],
    y7 = ['::before', '::after', ':before', ':after'],
    z7 = (function () {
        try {
            return !0
        } catch {
            return !1
        }
    })()
function I3(e) {
    return new Proxy(e, {
        get: function (r, n) {
            return n in r ? r[n] : r[g2]
        },
    })
}
var L7 = h({}, J5)
L7[g2] = h(
    h(h(h({}, { 'fa-duotone': 'duotone' }), J5[g2]), L5.kit),
    L5['kit-duotone']
)
var Ay = I3(L7),
    Ba = h({}, TC)
Ba[g2] = h(h(h(h({}, { duotone: 'fad' }), Ba[g2]), w5.kit), w5['kit-duotone'])
var S5 = I3(Ba),
    ja = h({}, _a)
ja[g2] = h(h({}, ja[g2]), BC.kit)
var w7 = I3(ja),
    Ua = h({}, zy)
Ua[g2] = h(h({}, Ua[g2]), FC.kit)
var FE = I3(Ua),
    ky = fC,
    b7 = 'fa-layers-text',
    Ry = uC,
    Py = h({}, NC),
    OE = I3(Py),
    _y = [
        'class',
        'data-prefix',
        'data-icon',
        'data-fa-transform',
        'data-fa-mask',
    ],
    Ia = dC,
    Fy = [].concat(J2(AC), J2(Dy)),
    x3 = Z1.FontAwesomeConfig || {}
function Oy(e) {
    var t = Y.querySelector('script[' + e + ']')
    if (t) return t.getAttribute(e)
}
function By(e) {
    return e === '' ? !0 : e === 'false' ? !1 : e === 'true' ? !0 : e
}
Y &&
    typeof Y.querySelector == 'function' &&
    ((x5 = [
        ['data-family-prefix', 'familyPrefix'],
        ['data-css-prefix', 'cssPrefix'],
        ['data-family-default', 'familyDefault'],
        ['data-style-default', 'styleDefault'],
        ['data-replacement-class', 'replacementClass'],
        ['data-auto-replace-svg', 'autoReplaceSvg'],
        ['data-auto-add-css', 'autoAddCss'],
        ['data-search-pseudo-elements', 'searchPseudoElements'],
        [
            'data-search-pseudo-elements-warnings',
            'searchPseudoElementsWarnings',
        ],
        [
            'data-search-pseudo-elements-full-scan',
            'searchPseudoElementsFullScan',
        ],
        ['data-observe-mutations', 'observeMutations'],
        ['data-mutate-approach', 'mutateApproach'],
        ['data-keep-original-source', 'keepOriginalSource'],
        ['data-measure-performance', 'measurePerformance'],
        ['data-show-missing-icons', 'showMissingIcons'],
    ]),
    x5.forEach(function (e) {
        var t = Qt(e, 2),
            r = t[0],
            n = t[1],
            a = By(Oy(r))
        a != null && (x3[n] = a)
    }))
var x5,
    S7 = {
        styleDefault: 'solid',
        familyDefault: g2,
        cssPrefix: M7,
        replacementClass: C7,
        autoReplaceSvg: !0,
        autoAddCss: !0,
        searchPseudoElements: !1,
        searchPseudoElementsWarnings: !0,
        searchPseudoElementsFullScan: !1,
        observeMutations: !0,
        mutateApproach: 'async',
        keepOriginalSource: !0,
        measurePerformance: !1,
        showMissingIcons: !0,
    }
x3.familyPrefix && (x3.cssPrefix = x3.familyPrefix)
var y4 = h(h({}, S7), x3)
y4.autoReplaceSvg || (y4.observeMutations = !1)
var L = {}
Object.keys(S7).forEach(function (e) {
    Object.defineProperty(L, e, {
        enumerable: !0,
        set: function (r) {
            ;(y4[e] = r),
                D3.forEach(function (n) {
                    return n(L)
                })
        },
        get: function () {
            return y4[e]
        },
    })
})
Object.defineProperty(L, 'familyPrefix', {
    enumerable: !0,
    set: function (t) {
        ;(y4.cssPrefix = t),
            D3.forEach(function (r) {
                return r(L)
            })
    },
    get: function () {
        return y4.cssPrefix
    },
})
Z1.FontAwesomeConfig = L
var D3 = []
function jy(e) {
    return (
        D3.push(e),
        function () {
            D3.splice(D3.indexOf(e), 1)
        }
    )
}
var Q1 = Fa,
    l1 = { size: 16, x: 0, y: 0, rotate: 0, flipX: !1, flipY: !1 }
function Uy(e) {
    if (!(!e || !x1)) {
        var t = Y.createElement('style')
        t.setAttribute('type', 'text/css'), (t.innerHTML = e)
        for (
            var r = Y.head.childNodes, n = null, a = r.length - 1;
            a > -1;
            a--
        ) {
            var i = r[a],
                o = (i.tagName || '').toUpperCase()
            ;['STYLE', 'LINK'].indexOf(o) > -1 && (n = i)
        }
        return Y.head.insertBefore(t, n), e
    }
}
var Hy = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function D5() {
    for (var e = 12, t = ''; e-- > 0; ) t += Hy[(Math.random() * 62) | 0]
    return t
}
function z4(e) {
    for (var t = [], r = (e || []).length >>> 0; r--; ) t[r] = e[r]
    return t
}
function Ja(e) {
    return e.classList
        ? z4(e.classList)
        : (e.getAttribute('class') || '').split(' ').filter(function (t) {
              return t
          })
}
function x7(e) {
    return ''
        .concat(e)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
function Vy(e) {
    return Object.keys(e || {})
        .reduce(function (t, r) {
            return t + ''.concat(r, '="').concat(x7(e[r]), '" ')
        }, '')
        .trim()
}
function Zt(e) {
    return Object.keys(e || {}).reduce(function (t, r) {
        return t + ''.concat(r, ': ').concat(e[r].trim(), ';')
    }, '')
}
function ei(e) {
    return (
        e.size !== l1.size ||
        e.x !== l1.x ||
        e.y !== l1.y ||
        e.rotate !== l1.rotate ||
        e.flipX ||
        e.flipY
    )
}
function $y(e) {
    var t = e.transform,
        r = e.containerWidth,
        n = e.iconWidth,
        a = { transform: 'translate('.concat(r / 2, ' 256)') },
        i = 'translate('.concat(t.x * 32, ', ').concat(t.y * 32, ') '),
        o = 'scale('
            .concat((t.size / 16) * (t.flipX ? -1 : 1), ', ')
            .concat((t.size / 16) * (t.flipY ? -1 : 1), ') '),
        c = 'rotate('.concat(t.rotate, ' 0 0)'),
        s = { transform: ''.concat(i, ' ').concat(o, ' ').concat(c) },
        l = { transform: 'translate('.concat((n / 2) * -1, ' -256)') }
    return { outer: a, inner: s, path: l }
}
function Wy(e) {
    var t = e.transform,
        r = e.width,
        n = r === void 0 ? Fa : r,
        a = e.height,
        i = a === void 0 ? Fa : a,
        o = e.startCentered,
        c = o === void 0 ? !1 : o,
        s = ''
    return (
        c && X5
            ? (s += 'translate('
                  .concat(t.x / Q1 - n / 2, 'em, ')
                  .concat(t.y / Q1 - i / 2, 'em) '))
            : c
            ? (s += 'translate(calc(-50% + '
                  .concat(t.x / Q1, 'em), calc(-50% + ')
                  .concat(t.y / Q1, 'em)) '))
            : (s += 'translate('
                  .concat(t.x / Q1, 'em, ')
                  .concat(t.y / Q1, 'em) ')),
        (s += 'scale('
            .concat((t.size / Q1) * (t.flipX ? -1 : 1), ', ')
            .concat((t.size / Q1) * (t.flipY ? -1 : 1), ') ')),
        (s += 'rotate('.concat(t.rotate, 'deg) ')),
        s
    )
}
var qy = `:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 7 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 7 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 7 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 7 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 7 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 7 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-slab-regular: normal 400 1em/1 "Font Awesome 7 Slab";
  --fa-font-slab-press-regular: normal 400 1em/1 "Font Awesome 7 Slab Press";
  --fa-font-whiteboard-semibold: normal 600 1em/1 "Font Awesome 7 Whiteboard";
  --fa-font-thumbprint-light: normal 300 1em/1 "Font Awesome 7 Thumbprint";
  --fa-font-notdog-solid: normal 900 1em/1 "Font Awesome 7 Notdog";
  --fa-font-notdog-duo-solid: normal 900 1em/1 "Font Awesome 7 Notdog Duo";
  --fa-font-etch-solid: normal 900 1em/1 "Font Awesome 7 Etch";
  --fa-font-jelly-regular: normal 400 1em/1 "Font Awesome 7 Jelly";
  --fa-font-jelly-fill-regular: normal 400 1em/1 "Font Awesome 7 Jelly Fill";
  --fa-font-jelly-duo-regular: normal 400 1em/1 "Font Awesome 7 Jelly Duo";
  --fa-font-chisel-regular: normal 400 1em/1 "Font Awesome 7 Chisel";
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}`
function D7() {
    var e = M7,
        t = C7,
        r = L.cssPrefix,
        n = L.replacementClass,
        a = qy
    if (r !== e || n !== t) {
        var i = new RegExp('\\.'.concat(e, '\\-'), 'g'),
            o = new RegExp('\\--'.concat(e, '\\-'), 'g'),
            c = new RegExp('\\.'.concat(t), 'g')
        a = a
            .replace(i, '.'.concat(r, '-'))
            .replace(o, '--'.concat(r, '-'))
            .replace(c, '.'.concat(n))
    }
    return a
}
var N5 = !1
function Ta() {
    L.autoAddCss && !N5 && (Uy(D7()), (N5 = !0))
}
var Gy = {
        mixout: function () {
            return { dom: { css: D7, insertCss: Ta } }
        },
        hooks: function () {
            return {
                beforeDOMElementCreation: function () {
                    Ta()
                },
                beforeI2svg: function () {
                    Ta()
                },
            }
        },
    },
    S1 = Z1 || {}
S1[b1] || (S1[b1] = {})
S1[b1].styles || (S1[b1].styles = {})
S1[b1].hooks || (S1[b1].hooks = {})
S1[b1].shims || (S1[b1].shims = [])
var X2 = S1[b1],
    N7 = [],
    E7 = function () {
        Y.removeEventListener('DOMContentLoaded', E7),
            (Gt = 1),
            N7.map(function (t) {
                return t()
            })
    },
    Gt = !1
x1 &&
    ((Gt = (Y.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(
        Y.readyState
    )),
    Gt || Y.addEventListener('DOMContentLoaded', E7))
function Yy(e) {
    x1 && (Gt ? setTimeout(e, 0) : N7.push(e))
}
function T3(e) {
    var t = e.tag,
        r = e.attributes,
        n = r === void 0 ? {} : r,
        a = e.children,
        i = a === void 0 ? [] : a
    return typeof e == 'string'
        ? x7(e)
        : '<'
              .concat(t, ' ')
              .concat(Vy(n), '>')
              .concat(i.map(T3).join(''), '</')
              .concat(t, '>')
}
function E5(e, t, r) {
    if (e && e[t] && e[t][r]) return { prefix: t, iconName: r, icon: e[t][r] }
}
var Qy = function (t, r) {
        return function (n, a, i, o) {
            return t.call(r, n, a, i, o)
        }
    },
    Aa = function (t, r, n, a) {
        var i = Object.keys(t),
            o = i.length,
            c = a !== void 0 ? Qy(r, a) : r,
            s,
            l,
            f
        for (
            n === void 0 ? ((s = 1), (f = t[i[0]])) : ((s = 0), (f = n));
            s < o;
            s++
        )
            (l = i[s]), (f = c(f, t[l], l, t))
        return f
    }
function I7(e) {
    return J2(e).length !== 1 ? null : e.codePointAt(0).toString(16)
}
function I5(e) {
    return Object.keys(e).reduce(function (t, r) {
        var n = e[r],
            a = !!n.icon
        return a ? (t[n.iconName] = n.icon) : (t[r] = n), t
    }, {})
}
function T7(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
        n = r.skipHooks,
        a = n === void 0 ? !1 : n,
        i = I5(t)
    typeof X2.hooks.addPack == 'function' && !a
        ? X2.hooks.addPack(e, I5(t))
        : (X2.styles[e] = h(h({}, X2.styles[e] || {}), i)),
        e === 'fas' && T7('fa', t)
}
var N3 = X2.styles,
    Zy = X2.shims,
    A7 = Object.keys(w7),
    Ky = A7.reduce(function (e, t) {
        return (e[t] = Object.keys(w7[t])), e
    }, {}),
    ti = null,
    k7 = {},
    R7 = {},
    P7 = {},
    _7 = {},
    F7 = {}
function Xy(e) {
    return ~Fy.indexOf(e)
}
function Jy(e, t) {
    var r = t.split('-'),
        n = r[0],
        a = r.slice(1).join('-')
    return n === e && a !== '' && !Xy(a) ? a : null
}
var O7 = function () {
    var t = function (i) {
        return Aa(
            N3,
            function (o, c, s) {
                return (o[s] = Aa(c, i, {})), o
            },
            {}
        )
    }
    ;(k7 = t(function (a, i, o) {
        if ((i[3] && (a[i[3]] = o), i[2])) {
            var c = i[2].filter(function (s) {
                return typeof s == 'number'
            })
            c.forEach(function (s) {
                a[s.toString(16)] = o
            })
        }
        return a
    })),
        (R7 = t(function (a, i, o) {
            if (((a[o] = o), i[2])) {
                var c = i[2].filter(function (s) {
                    return typeof s == 'string'
                })
                c.forEach(function (s) {
                    a[s] = o
                })
            }
            return a
        })),
        (F7 = t(function (a, i, o) {
            var c = i[2]
            return (
                (a[o] = o),
                c.forEach(function (s) {
                    a[s] = o
                }),
                a
            )
        }))
    var r = 'far' in N3 || L.autoFetchSvg,
        n = Aa(
            Zy,
            function (a, i) {
                var o = i[0],
                    c = i[1],
                    s = i[2]
                return (
                    c === 'far' && !r && (c = 'fas'),
                    typeof o == 'string' &&
                        (a.names[o] = { prefix: c, iconName: s }),
                    typeof o == 'number' &&
                        (a.unicodes[o.toString(16)] = {
                            prefix: c,
                            iconName: s,
                        }),
                    a
                )
            },
            { names: {}, unicodes: {} }
        )
    ;(P7 = n.names),
        (_7 = n.unicodes),
        (ti = Kt(L.styleDefault, { family: L.familyDefault }))
}
jy(function (e) {
    ti = Kt(e.styleDefault, { family: L.familyDefault })
})
O7()
function ni(e, t) {
    return (k7[e] || {})[t]
}
function ez(e, t) {
    return (R7[e] || {})[t]
}
function Ee(e, t) {
    return (F7[e] || {})[t]
}
function B7(e) {
    return P7[e] || { prefix: null, iconName: null }
}
function tz(e) {
    var t = _7[e],
        r = ni('fas', e)
    return (
        t ||
        (r ? { prefix: 'fas', iconName: r } : null) || {
            prefix: null,
            iconName: null,
        }
    )
}
function K1() {
    return ti
}
var j7 = function () {
    return { prefix: null, iconName: null, rest: [] }
}
function nz(e) {
    var t = g2,
        r = A7.reduce(function (n, a) {
            return (n[a] = ''.concat(L.cssPrefix, '-').concat(a)), n
        }, {})
    return (
        h7.forEach(function (n) {
            ;(e.includes(r[n]) ||
                e.some(function (a) {
                    return Ky[n].includes(a)
                })) &&
                (t = n)
        }),
        t
    )
}
function Kt(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        r = t.family,
        n = r === void 0 ? g2 : r,
        a = Ay[n][e]
    if (n === E3 && !e) return 'fad'
    var i = S5[n][e] || S5[n][a],
        o = e in X2.styles ? e : null,
        c = i || o || null
    return c
}
function rz(e) {
    var t = [],
        r = null
    return (
        e.forEach(function (n) {
            var a = Jy(L.cssPrefix, n)
            a ? (r = a) : n && t.push(n)
        }),
        { iconName: r, rest: t }
    )
}
function T5(e) {
    return e.sort().filter(function (t, r, n) {
        return n.indexOf(t) === r
    })
}
var A5 = g7.concat(m7)
function Xt(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        r = t.skipLookups,
        n = r === void 0 ? !1 : r,
        a = null,
        i = T5(
            e.filter(function (p) {
                return A5.includes(p)
            })
        ),
        o = T5(
            e.filter(function (p) {
                return !A5.includes(p)
            })
        ),
        c = i.filter(function (p) {
            return (a = p), !e7.includes(p)
        }),
        s = Qt(c, 1),
        l = s[0],
        f = l === void 0 ? null : l,
        u = nz(i),
        d = h(h({}, rz(o)), {}, { prefix: Kt(f, { family: u }) })
    return h(
        h(
            h({}, d),
            cz({
                values: e,
                family: u,
                styles: N3,
                config: L,
                canonical: d,
                givenPrefix: a,
            })
        ),
        az(n, a, d)
    )
}
function az(e, t, r) {
    var n = r.prefix,
        a = r.iconName
    if (e || !n || !a) return { prefix: n, iconName: a }
    var i = t === 'fa' ? B7(a) : {},
        o = Ee(n, a)
    return (
        (a = i.iconName || o || a),
        (n = i.prefix || n),
        n === 'far' && !N3.far && N3.fas && !L.autoFetchSvg && (n = 'fas'),
        { prefix: n, iconName: a }
    )
}
var iz = h7.filter(function (e) {
        return e !== g2 || e !== E3
    }),
    oz = Object.keys(_a)
        .filter(function (e) {
            return e !== g2
        })
        .map(function (e) {
            return Object.keys(_a[e])
        })
        .flat()
function cz(e) {
    var t = e.values,
        r = e.family,
        n = e.canonical,
        a = e.givenPrefix,
        i = a === void 0 ? '' : a,
        o = e.styles,
        c = o === void 0 ? {} : o,
        s = e.config,
        l = s === void 0 ? {} : s,
        f = r === E3,
        u = t.includes('fa-duotone') || t.includes('fad'),
        d = l.familyDefault === 'duotone',
        p = n.prefix === 'fad' || n.prefix === 'fa-duotone'
    if (
        (!f && (u || d || p) && (n.prefix = 'fad'),
        (t.includes('fa-brands') || t.includes('fab')) && (n.prefix = 'fab'),
        !n.prefix && iz.includes(r))
    ) {
        var m = Object.keys(c).find(function (C) {
            return oz.includes(C)
        })
        if (m || l.autoFetchSvg) {
            var v = IC.get(r).defaultShortPrefixId
            ;(n.prefix = v),
                (n.iconName = Ee(n.prefix, n.iconName) || n.iconName)
        }
    }
    return (n.prefix === 'fa' || i === 'fa') && (n.prefix = K1() || 'fas'), n
}
var sz = (function () {
        function e() {
            nC(this, e), (this.definitions = {})
        }
        return rC(e, [
            {
                key: 'add',
                value: function () {
                    for (
                        var r = this,
                            n = arguments.length,
                            a = new Array(n),
                            i = 0;
                        i < n;
                        i++
                    )
                        a[i] = arguments[i]
                    var o = a.reduce(this._pullDefinitions, {})
                    Object.keys(o).forEach(function (c) {
                        ;(r.definitions[c] = h(
                            h({}, r.definitions[c] || {}),
                            o[c]
                        )),
                            T7(c, o[c]),
                            O7()
                    })
                },
            },
            {
                key: 'reset',
                value: function () {
                    this.definitions = {}
                },
            },
            {
                key: '_pullDefinitions',
                value: function (r, n) {
                    var a = n.prefix && n.iconName && n.icon ? { 0: n } : n
                    return (
                        Object.keys(a).map(function (i) {
                            var o = a[i],
                                c = o.prefix,
                                s = o.iconName,
                                l = o.icon,
                                f = l[2]
                            r[c] || (r[c] = {}),
                                f.length > 0 &&
                                    f.forEach(function (u) {
                                        typeof u == 'string' && (r[c][u] = l)
                                    }),
                                (r[c][s] = l)
                        }),
                        r
                    )
                },
            },
        ])
    })(),
    k5 = [],
    M4 = {},
    C4 = {},
    lz = Object.keys(C4)
function fz(e, t) {
    var r = t.mixoutsTo
    return (
        (k5 = e),
        (M4 = {}),
        Object.keys(C4).forEach(function (n) {
            lz.indexOf(n) === -1 && delete C4[n]
        }),
        k5.forEach(function (n) {
            var a = n.mixout ? n.mixout() : {}
            if (
                (Object.keys(a).forEach(function (o) {
                    typeof a[o] == 'function' && (r[o] = a[o]),
                        qt(a[o]) === 'object' &&
                            Object.keys(a[o]).forEach(function (c) {
                                r[o] || (r[o] = {}), (r[o][c] = a[o][c])
                            })
                }),
                n.hooks)
            ) {
                var i = n.hooks()
                Object.keys(i).forEach(function (o) {
                    M4[o] || (M4[o] = []), M4[o].push(i[o])
                })
            }
            n.provides && n.provides(C4)
        }),
        r
    )
}
function Ha(e, t) {
    for (
        var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), a = 2;
        a < r;
        a++
    )
        n[a - 2] = arguments[a]
    var i = M4[e] || []
    return (
        i.forEach(function (o) {
            t = o.apply(null, [t].concat(n))
        }),
        t
    )
}
function Te(e) {
    for (
        var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
        n < t;
        n++
    )
        r[n - 1] = arguments[n]
    var a = M4[e] || []
    a.forEach(function (i) {
        i.apply(null, r)
    })
}
function X1() {
    var e = arguments[0],
        t = Array.prototype.slice.call(arguments, 1)
    return C4[e] ? C4[e].apply(null, t) : void 0
}
function Va(e) {
    e.prefix === 'fa' && (e.prefix = 'fas')
    var t = e.iconName,
        r = e.prefix || K1()
    if (t)
        return (
            (t = Ee(r, t) || t), E5(U7.definitions, r, t) || E5(X2.styles, r, t)
        )
}
var U7 = new sz(),
    uz = function () {
        ;(L.autoReplaceSvg = !1), (L.observeMutations = !1), Te('noAuto')
    },
    dz = {
        i2svg: function () {
            var t =
                arguments.length > 0 && arguments[0] !== void 0
                    ? arguments[0]
                    : {}
            return x1
                ? (Te('beforeI2svg', t),
                  X1('pseudoElements2svg', t),
                  X1('i2svg', t))
                : Promise.reject(
                      new Error('Operation requires a DOM of some kind.')
                  )
        },
        watch: function () {
            var t =
                    arguments.length > 0 && arguments[0] !== void 0
                        ? arguments[0]
                        : {},
                r = t.autoReplaceSvgRoot
            L.autoReplaceSvg === !1 && (L.autoReplaceSvg = !0),
                (L.observeMutations = !0),
                Yy(function () {
                    hz({ autoReplaceSvgRoot: r }), Te('watch', t)
                })
        },
    },
    pz = {
        icon: function (t) {
            if (t === null) return null
            if (qt(t) === 'object' && t.prefix && t.iconName)
                return {
                    prefix: t.prefix,
                    iconName: Ee(t.prefix, t.iconName) || t.iconName,
                }
            if (Array.isArray(t) && t.length === 2) {
                var r = t[1].indexOf('fa-') === 0 ? t[1].slice(3) : t[1],
                    n = Kt(t[0])
                return { prefix: n, iconName: Ee(n, r) || r }
            }
            if (
                typeof t == 'string' &&
                (t.indexOf(''.concat(L.cssPrefix, '-')) > -1 || t.match(ky))
            ) {
                var a = Xt(t.split(' '), { skipLookups: !0 })
                return {
                    prefix: a.prefix || K1(),
                    iconName: Ee(a.prefix, a.iconName) || a.iconName,
                }
            }
            if (typeof t == 'string') {
                var i = K1()
                return { prefix: i, iconName: Ee(i, t) || t }
            }
        },
    },
    P2 = {
        noAuto: uz,
        config: L,
        dom: dz,
        parse: pz,
        library: U7,
        findIconDefinition: Va,
        toHtml: T3,
    },
    hz = function () {
        var t =
                arguments.length > 0 && arguments[0] !== void 0
                    ? arguments[0]
                    : {},
            r = t.autoReplaceSvgRoot,
            n = r === void 0 ? Y : r
        ;(Object.keys(X2.styles).length > 0 || L.autoFetchSvg) &&
            x1 &&
            L.autoReplaceSvg &&
            P2.dom.i2svg({ node: n })
    }
function Jt(e, t) {
    return (
        Object.defineProperty(e, 'abstract', { get: t }),
        Object.defineProperty(e, 'html', {
            get: function () {
                return e.abstract.map(function (n) {
                    return T3(n)
                })
            },
        }),
        Object.defineProperty(e, 'node', {
            get: function () {
                if (x1) {
                    var n = Y.createElement('div')
                    return (n.innerHTML = e.html), n.children
                }
            },
        }),
        e
    )
}
function mz(e) {
    var t = e.children,
        r = e.main,
        n = e.mask,
        a = e.attributes,
        i = e.styles,
        o = e.transform
    if (ei(o) && r.found && !n.found) {
        var c = r.width,
            s = r.height,
            l = { x: c / s / 2, y: 0.5 }
        a.style = Zt(
            h(
                h({}, i),
                {},
                {
                    'transform-origin': ''
                        .concat(l.x + o.x / 16, 'em ')
                        .concat(l.y + o.y / 16, 'em'),
                }
            )
        )
    }
    return [{ tag: 'svg', attributes: a, children: t }]
}
function gz(e) {
    var t = e.prefix,
        r = e.iconName,
        n = e.children,
        a = e.attributes,
        i = e.symbol,
        o = i === !0 ? ''.concat(t, '-').concat(L.cssPrefix, '-').concat(r) : i
    return [
        {
            tag: 'svg',
            attributes: { style: 'display: none;' },
            children: [
                {
                    tag: 'symbol',
                    attributes: h(h({}, a), {}, { id: o }),
                    children: n,
                },
            ],
        },
    ]
}
function vz(e) {
    var t = ['aria-label', 'aria-labelledby', 'title', 'role']
    return t.some(function (r) {
        return r in e
    })
}
function ri(e) {
    var t = e.icons,
        r = t.main,
        n = t.mask,
        a = e.prefix,
        i = e.iconName,
        o = e.transform,
        c = e.symbol,
        s = e.maskId,
        l = e.extra,
        f = e.watchable,
        u = f === void 0 ? !1 : f,
        d = n.found ? n : r,
        p = d.width,
        m = d.height,
        v = [L.replacementClass, i ? ''.concat(L.cssPrefix, '-').concat(i) : '']
            .filter(function (Q) {
                return l.classes.indexOf(Q) === -1
            })
            .filter(function (Q) {
                return Q !== '' || !!Q
            })
            .concat(l.classes)
            .join(' '),
        C = {
            children: [],
            attributes: h(
                h({}, l.attributes),
                {},
                {
                    'data-prefix': a,
                    'data-icon': i,
                    class: v,
                    role: l.attributes.role || 'img',
                    viewBox: '0 0 '.concat(p, ' ').concat(m),
                }
            ),
        }
    !vz(l.attributes) &&
        !l.attributes['aria-hidden'] &&
        (C.attributes['aria-hidden'] = 'true'),
        u && (C.attributes[Ie] = '')
    var M = h(
            h({}, C),
            {},
            {
                prefix: a,
                iconName: i,
                main: r,
                mask: n,
                maskId: s,
                transform: o,
                symbol: c,
                styles: h({}, l.styles),
            }
        ),
        E =
            n.found && r.found
                ? X1('generateAbstractMask', M) || {
                      children: [],
                      attributes: {},
                  }
                : X1('generateAbstractIcon', M) || {
                      children: [],
                      attributes: {},
                  },
        F = E.children,
        P = E.attributes
    return (M.children = F), (M.attributes = P), c ? gz(M) : mz(M)
}
function R5(e) {
    var t = e.content,
        r = e.width,
        n = e.height,
        a = e.transform,
        i = e.extra,
        o = e.watchable,
        c = o === void 0 ? !1 : o,
        s = h(h({}, i.attributes), {}, { class: i.classes.join(' ') })
    c && (s[Ie] = '')
    var l = h({}, i.styles)
    ei(a) &&
        ((l.transform = Wy({
            transform: a,
            startCentered: !0,
            width: r,
            height: n,
        })),
        (l['-webkit-transform'] = l.transform))
    var f = Zt(l)
    f.length > 0 && (s.style = f)
    var u = []
    return u.push({ tag: 'span', attributes: s, children: [t] }), u
}
function Mz(e) {
    var t = e.content,
        r = e.extra,
        n = h(h({}, r.attributes), {}, { class: r.classes.join(' ') }),
        a = Zt(r.styles)
    a.length > 0 && (n.style = a)
    var i = []
    return i.push({ tag: 'span', attributes: n, children: [t] }), i
}
var ka = X2.styles
function $a(e) {
    var t = e[0],
        r = e[1],
        n = e.slice(4),
        a = Qt(n, 1),
        i = a[0],
        o = null
    return (
        Array.isArray(i)
            ? (o = {
                  tag: 'g',
                  attributes: {
                      class: ''.concat(L.cssPrefix, '-').concat(Ia.GROUP),
                  },
                  children: [
                      {
                          tag: 'path',
                          attributes: {
                              class: ''
                                  .concat(L.cssPrefix, '-')
                                  .concat(Ia.SECONDARY),
                              fill: 'currentColor',
                              d: i[0],
                          },
                      },
                      {
                          tag: 'path',
                          attributes: {
                              class: ''
                                  .concat(L.cssPrefix, '-')
                                  .concat(Ia.PRIMARY),
                              fill: 'currentColor',
                              d: i[1],
                          },
                      },
                  ],
              })
            : (o = { tag: 'path', attributes: { fill: 'currentColor', d: i } }),
        { found: !0, width: t, height: r, icon: o }
    )
}
var Cz = { found: !1, width: 512, height: 512 }
function yz(e, t) {
    !z7 &&
        !L.showMissingIcons &&
        e &&
        console.error(
            'Icon with name "'
                .concat(e, '" and prefix "')
                .concat(t, '" is missing.')
        )
}
function Wa(e, t) {
    var r = t
    return (
        t === 'fa' && L.styleDefault !== null && (t = K1()),
        new Promise(function (n, a) {
            if (r === 'fa') {
                var i = B7(e) || {}
                ;(e = i.iconName || e), (t = i.prefix || t)
            }
            if (e && t && ka[t] && ka[t][e]) {
                var o = ka[t][e]
                return n($a(o))
            }
            yz(e, t),
                n(
                    h(
                        h({}, Cz),
                        {},
                        {
                            icon:
                                L.showMissingIcons && e
                                    ? X1('missingIconAbstract') || {}
                                    : {},
                        }
                    )
                )
        })
    )
}
var P5 = function () {},
    qa =
        L.measurePerformance && Ut && Ut.mark && Ut.measure
            ? Ut
            : { mark: P5, measure: P5 },
    S3 = 'FA "7.0.0"',
    zz = function (t) {
        return (
            qa.mark(''.concat(S3, ' ').concat(t, ' begins')),
            function () {
                return H7(t)
            }
        )
    },
    H7 = function (t) {
        qa.mark(''.concat(S3, ' ').concat(t, ' ends')),
            qa.measure(
                ''.concat(S3, ' ').concat(t),
                ''.concat(S3, ' ').concat(t, ' begins'),
                ''.concat(S3, ' ').concat(t, ' ends')
            )
    },
    ai = { begin: zz, end: H7 },
    $t = function () {}
function _5(e) {
    var t = e.getAttribute ? e.getAttribute(Ie) : null
    return typeof t == 'string'
}
function Lz(e) {
    var t = e.getAttribute ? e.getAttribute(Ka) : null,
        r = e.getAttribute ? e.getAttribute(Xa) : null
    return t && r
}
function wz(e) {
    return (
        e &&
        e.classList &&
        e.classList.contains &&
        e.classList.contains(L.replacementClass)
    )
}
function bz() {
    if (L.autoReplaceSvg === !0) return Wt.replace
    var e = Wt[L.autoReplaceSvg]
    return e || Wt.replace
}
function Sz(e) {
    return Y.createElementNS('http://www.w3.org/2000/svg', e)
}
function xz(e) {
    return Y.createElement(e)
}
function V7(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        r = t.ceFn,
        n = r === void 0 ? (e.tag === 'svg' ? Sz : xz) : r
    if (typeof e == 'string') return Y.createTextNode(e)
    var a = n(e.tag)
    Object.keys(e.attributes || []).forEach(function (o) {
        a.setAttribute(o, e.attributes[o])
    })
    var i = e.children || []
    return (
        i.forEach(function (o) {
            a.appendChild(V7(o, { ceFn: n }))
        }),
        a
    )
}
function Dz(e) {
    var t = ' '.concat(e.outerHTML, ' ')
    return (t = ''.concat(t, 'Font Awesome fontawesome.com ')), t
}
var Wt = {
    replace: function (t) {
        var r = t[0]
        if (r.parentNode)
            if (
                (t[1].forEach(function (a) {
                    r.parentNode.insertBefore(V7(a), r)
                }),
                r.getAttribute(Ie) === null && L.keepOriginalSource)
            ) {
                var n = Y.createComment(Dz(r))
                r.parentNode.replaceChild(n, r)
            } else r.remove()
    },
    nest: function (t) {
        var r = t[0],
            n = t[1]
        if (~Ja(r).indexOf(L.replacementClass)) return Wt.replace(t)
        var a = new RegExp(''.concat(L.cssPrefix, '-.*'))
        if ((delete n[0].attributes.id, n[0].attributes.class)) {
            var i = n[0].attributes.class.split(' ').reduce(
                function (c, s) {
                    return (
                        s === L.replacementClass || s.match(a)
                            ? c.toSvg.push(s)
                            : c.toNode.push(s),
                        c
                    )
                },
                { toNode: [], toSvg: [] }
            )
            ;(n[0].attributes.class = i.toSvg.join(' ')),
                i.toNode.length === 0
                    ? r.removeAttribute('class')
                    : r.setAttribute('class', i.toNode.join(' '))
        }
        var o = n.map(function (c) {
            return T3(c)
        }).join(`
`)
        r.setAttribute(Ie, ''), (r.innerHTML = o)
    },
}
function F5(e) {
    e()
}
function $7(e, t) {
    var r = typeof t == 'function' ? t : $t
    if (e.length === 0) r()
    else {
        var n = F5
        L.mutateApproach === Iy && (n = Z1.requestAnimationFrame || F5),
            n(function () {
                var a = bz(),
                    i = ai.begin('mutate')
                e.map(a), i(), r()
            })
    }
}
var ii = !1
function W7() {
    ii = !0
}
function Ga() {
    ii = !1
}
var Yt = null
function O5(e) {
    if (z5 && L.observeMutations) {
        var t = e.treeCallback,
            r = t === void 0 ? $t : t,
            n = e.nodeCallback,
            a = n === void 0 ? $t : n,
            i = e.pseudoElementsCallback,
            o = i === void 0 ? $t : i,
            c = e.observeMutationsRoot,
            s = c === void 0 ? Y : c
        ;(Yt = new z5(function (l) {
            if (!ii) {
                var f = K1()
                z4(l).forEach(function (u) {
                    if (
                        (u.type === 'childList' &&
                            u.addedNodes.length > 0 &&
                            !_5(u.addedNodes[0]) &&
                            (L.searchPseudoElements && o(u.target),
                            r(u.target)),
                        u.type === 'attributes' &&
                            u.target.parentNode &&
                            L.searchPseudoElements &&
                            o([u.target], !0),
                        u.type === 'attributes' &&
                            _5(u.target) &&
                            ~_y.indexOf(u.attributeName))
                    )
                        if (u.attributeName === 'class' && Lz(u.target)) {
                            var d = Xt(Ja(u.target)),
                                p = d.prefix,
                                m = d.iconName
                            u.target.setAttribute(Ka, p || f),
                                m && u.target.setAttribute(Xa, m)
                        } else wz(u.target) && a(u.target)
                })
            }
        })),
            x1 &&
                Yt.observe(s, {
                    childList: !0,
                    attributes: !0,
                    characterData: !0,
                    subtree: !0,
                })
    }
}
function Nz() {
    Yt && Yt.disconnect()
}
function Ez(e) {
    var t = e.getAttribute('style'),
        r = []
    return (
        t &&
            (r = t.split(';').reduce(function (n, a) {
                var i = a.split(':'),
                    o = i[0],
                    c = i.slice(1)
                return o && c.length > 0 && (n[o] = c.join(':').trim()), n
            }, {})),
        r
    )
}
function Iz(e) {
    var t = e.getAttribute('data-prefix'),
        r = e.getAttribute('data-icon'),
        n = e.innerText !== void 0 ? e.innerText.trim() : '',
        a = Xt(Ja(e))
    return (
        a.prefix || (a.prefix = K1()),
        t && r && ((a.prefix = t), (a.iconName = r)),
        (a.iconName && a.prefix) ||
            (a.prefix &&
                n.length > 0 &&
                (a.iconName =
                    ez(a.prefix, e.innerText) || ni(a.prefix, I7(e.innerText))),
            !a.iconName &&
                L.autoFetchSvg &&
                e.firstChild &&
                e.firstChild.nodeType === Node.TEXT_NODE &&
                (a.iconName = e.firstChild.data)),
        a
    )
}
function Tz(e) {
    var t = z4(e.attributes).reduce(function (r, n) {
        return (
            r.name !== 'class' && r.name !== 'style' && (r[n.name] = n.value), r
        )
    }, {})
    return t
}
function Az() {
    return {
        iconName: null,
        prefix: null,
        transform: l1,
        symbol: !1,
        mask: { iconName: null, prefix: null, rest: [] },
        maskId: null,
        extra: { classes: [], styles: {}, attributes: {} },
    }
}
function B5(e) {
    var t =
            arguments.length > 1 && arguments[1] !== void 0
                ? arguments[1]
                : { styleParser: !0 },
        r = Iz(e),
        n = r.iconName,
        a = r.prefix,
        i = r.rest,
        o = Tz(e),
        c = Ha('parseNodeAttributes', {}, e),
        s = t.styleParser ? Ez(e) : []
    return h(
        {
            iconName: n,
            prefix: a,
            transform: l1,
            mask: { iconName: null, prefix: null, rest: [] },
            maskId: null,
            symbol: !1,
            extra: { classes: i, styles: s, attributes: o },
        },
        c
    )
}
var kz = X2.styles
function q7(e) {
    var t = L.autoReplaceSvg === 'nest' ? B5(e, { styleParser: !1 }) : B5(e)
    return ~t.extra.classes.indexOf(b7)
        ? X1('generateLayersText', e, t)
        : X1('generateSvgReplacementMutation', e, t)
}
function Rz() {
    return [].concat(J2(m7), J2(g7))
}
function j5(e) {
    var t =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null
    if (!x1) return Promise.resolve()
    var r = Y.documentElement.classList,
        n = function (u) {
            return r.add(''.concat(b5, '-').concat(u))
        },
        a = function (u) {
            return r.remove(''.concat(b5, '-').concat(u))
        },
        i = L.autoFetchSvg ? Rz() : e7.concat(Object.keys(kz))
    i.includes('fa') || i.push('fa')
    var o = ['.'.concat(b7, ':not([').concat(Ie, '])')]
        .concat(
            i.map(function (f) {
                return '.'.concat(f, ':not([').concat(Ie, '])')
            })
        )
        .join(', ')
    if (o.length === 0) return Promise.resolve()
    var c = []
    try {
        c = z4(e.querySelectorAll(o))
    } catch {}
    if (c.length > 0) n('pending'), a('complete')
    else return Promise.resolve()
    var s = ai.begin('onTree'),
        l = c.reduce(function (f, u) {
            try {
                var d = q7(u)
                d && f.push(d)
            } catch (p) {
                z7 || (p.name === 'MissingIcon' && console.error(p))
            }
            return f
        }, [])
    return new Promise(function (f, u) {
        Promise.all(l)
            .then(function (d) {
                $7(d, function () {
                    n('active'),
                        n('complete'),
                        a('pending'),
                        typeof t == 'function' && t(),
                        s(),
                        f()
                })
            })
            .catch(function (d) {
                s(), u(d)
            })
    })
}
function Pz(e) {
    var t =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null
    q7(e).then(function (r) {
        r && $7([r], t)
    })
}
function _z(e) {
    return function (t) {
        var r =
                arguments.length > 1 && arguments[1] !== void 0
                    ? arguments[1]
                    : {},
            n = (t || {}).icon ? t : Va(t || {}),
            a = r.mask
        return (
            a && (a = (a || {}).icon ? a : Va(a || {})),
            e(n, h(h({}, r), {}, { mask: a }))
        )
    }
}
var Fz = function (t) {
        var r =
                arguments.length > 1 && arguments[1] !== void 0
                    ? arguments[1]
                    : {},
            n = r.transform,
            a = n === void 0 ? l1 : n,
            i = r.symbol,
            o = i === void 0 ? !1 : i,
            c = r.mask,
            s = c === void 0 ? null : c,
            l = r.maskId,
            f = l === void 0 ? null : l,
            u = r.classes,
            d = u === void 0 ? [] : u,
            p = r.attributes,
            m = p === void 0 ? {} : p,
            v = r.styles,
            C = v === void 0 ? {} : v
        if (t) {
            var M = t.prefix,
                E = t.iconName,
                F = t.icon
            return Jt(h({ type: 'icon' }, t), function () {
                return (
                    Te('beforeDOMElementCreation', {
                        iconDefinition: t,
                        params: r,
                    }),
                    ri({
                        icons: {
                            main: $a(F),
                            mask: s
                                ? $a(s.icon)
                                : {
                                      found: !1,
                                      width: null,
                                      height: null,
                                      icon: {},
                                  },
                        },
                        prefix: M,
                        iconName: E,
                        transform: h(h({}, l1), a),
                        symbol: o,
                        maskId: f,
                        extra: { attributes: m, styles: C, classes: d },
                    })
                )
            })
        }
    },
    Oz = {
        mixout: function () {
            return { icon: _z(Fz) }
        },
        hooks: function () {
            return {
                mutationObserverCallbacks: function (r) {
                    return (r.treeCallback = j5), (r.nodeCallback = Pz), r
                },
            }
        },
        provides: function (t) {
            ;(t.i2svg = function (r) {
                var n = r.node,
                    a = n === void 0 ? Y : n,
                    i = r.callback,
                    o = i === void 0 ? function () {} : i
                return j5(a, o)
            }),
                (t.generateSvgReplacementMutation = function (r, n) {
                    var a = n.iconName,
                        i = n.prefix,
                        o = n.transform,
                        c = n.symbol,
                        s = n.mask,
                        l = n.maskId,
                        f = n.extra
                    return new Promise(function (u, d) {
                        Promise.all([
                            Wa(a, i),
                            s.iconName
                                ? Wa(s.iconName, s.prefix)
                                : Promise.resolve({
                                      found: !1,
                                      width: 512,
                                      height: 512,
                                      icon: {},
                                  }),
                        ])
                            .then(function (p) {
                                var m = Qt(p, 2),
                                    v = m[0],
                                    C = m[1]
                                u([
                                    r,
                                    ri({
                                        icons: { main: v, mask: C },
                                        prefix: i,
                                        iconName: a,
                                        transform: o,
                                        symbol: c,
                                        maskId: l,
                                        extra: f,
                                        watchable: !0,
                                    }),
                                ])
                            })
                            .catch(d)
                    })
                }),
                (t.generateAbstractIcon = function (r) {
                    var n = r.children,
                        a = r.attributes,
                        i = r.main,
                        o = r.transform,
                        c = r.styles,
                        s = Zt(c)
                    s.length > 0 && (a.style = s)
                    var l
                    return (
                        ei(o) &&
                            (l = X1('generateAbstractTransformGrouping', {
                                main: i,
                                transform: o,
                                containerWidth: i.width,
                                iconWidth: i.width,
                            })),
                        n.push(l || i.icon),
                        { children: n, attributes: a }
                    )
                })
        },
    },
    Bz = {
        mixout: function () {
            return {
                layer: function (r) {
                    var n =
                            arguments.length > 1 && arguments[1] !== void 0
                                ? arguments[1]
                                : {},
                        a = n.classes,
                        i = a === void 0 ? [] : a
                    return Jt({ type: 'layer' }, function () {
                        Te('beforeDOMElementCreation', {
                            assembler: r,
                            params: n,
                        })
                        var o = []
                        return (
                            r(function (c) {
                                Array.isArray(c)
                                    ? c.map(function (s) {
                                          o = o.concat(s.abstract)
                                      })
                                    : (o = o.concat(c.abstract))
                            }),
                            [
                                {
                                    tag: 'span',
                                    attributes: {
                                        class: [
                                            ''.concat(L.cssPrefix, '-layers'),
                                        ]
                                            .concat(J2(i))
                                            .join(' '),
                                    },
                                    children: o,
                                },
                            ]
                        )
                    })
                },
            }
        },
    },
    jz = {
        mixout: function () {
            return {
                counter: function (r) {
                    var n =
                            arguments.length > 1 && arguments[1] !== void 0
                                ? arguments[1]
                                : {},
                        a = n.title,
                        i = a === void 0 ? null : a,
                        o = n.classes,
                        c = o === void 0 ? [] : o,
                        s = n.attributes,
                        l = s === void 0 ? {} : s,
                        f = n.styles,
                        u = f === void 0 ? {} : f
                    return Jt({ type: 'counter', content: r }, function () {
                        return (
                            Te('beforeDOMElementCreation', {
                                content: r,
                                params: n,
                            }),
                            Mz({
                                content: r.toString(),
                                title: i,
                                extra: {
                                    attributes: l,
                                    styles: u,
                                    classes: [
                                        ''.concat(
                                            L.cssPrefix,
                                            '-layers-counter'
                                        ),
                                    ].concat(J2(c)),
                                },
                            })
                        )
                    })
                },
            }
        },
    },
    Uz = {
        mixout: function () {
            return {
                text: function (r) {
                    var n =
                            arguments.length > 1 && arguments[1] !== void 0
                                ? arguments[1]
                                : {},
                        a = n.transform,
                        i = a === void 0 ? l1 : a,
                        o = n.classes,
                        c = o === void 0 ? [] : o,
                        s = n.attributes,
                        l = s === void 0 ? {} : s,
                        f = n.styles,
                        u = f === void 0 ? {} : f
                    return Jt({ type: 'text', content: r }, function () {
                        return (
                            Te('beforeDOMElementCreation', {
                                content: r,
                                params: n,
                            }),
                            R5({
                                content: r,
                                transform: h(h({}, l1), i),
                                extra: {
                                    attributes: l,
                                    styles: u,
                                    classes: [
                                        ''.concat(L.cssPrefix, '-layers-text'),
                                    ].concat(J2(c)),
                                },
                            })
                        )
                    })
                },
            }
        },
        provides: function (t) {
            t.generateLayersText = function (r, n) {
                var a = n.transform,
                    i = n.extra,
                    o = null,
                    c = null
                if (X5) {
                    var s = parseInt(getComputedStyle(r).fontSize, 10),
                        l = r.getBoundingClientRect()
                    ;(o = l.width / s), (c = l.height / s)
                }
                return Promise.resolve([
                    r,
                    R5({
                        content: r.innerHTML,
                        width: o,
                        height: c,
                        transform: a,
                        extra: i,
                        watchable: !0,
                    }),
                ])
            }
        },
    },
    G7 = new RegExp('"', 'ug'),
    U5 = [1105920, 1112319],
    H5 = h(
        h(h(h({}, { FontAwesome: { normal: 'fas', 400: 'fas' } }), EC), Ny),
        OC
    ),
    Ya = Object.keys(H5).reduce(function (e, t) {
        return (e[t.toLowerCase()] = H5[t]), e
    }, {}),
    Hz = Object.keys(Ya).reduce(function (e, t) {
        var r = Ya[t]
        return (e[t] = r[900] || J2(Object.entries(r))[0][1]), e
    }, {})
function Vz(e) {
    var t = e.replace(G7, '')
    return I7(J2(t)[0] || '')
}
function $z(e) {
    var t = e.getPropertyValue('font-feature-settings').includes('ss01'),
        r = e.getPropertyValue('content'),
        n = r.replace(G7, ''),
        a = n.codePointAt(0),
        i = a >= U5[0] && a <= U5[1],
        o = n.length === 2 ? n[0] === n[1] : !1
    return i || o || t
}
function Wz(e, t) {
    var r = e.replace(/^['"]|['"]$/g, '').toLowerCase(),
        n = parseInt(t),
        a = isNaN(n) ? 'normal' : n
    return (Ya[r] || {})[a] || Hz[r]
}
function V5(e, t) {
    var r = ''.concat(Ey).concat(t.replace(':', '-'))
    return new Promise(function (n, a) {
        if (e.getAttribute(r) !== null) return n()
        var i = z4(e.children),
            o = i.filter(function (s2) {
                return s2.getAttribute(Oa) === t
            })[0],
            c = Z1.getComputedStyle(e, t),
            s = c.getPropertyValue('font-family'),
            l = s.match(Ry),
            f = c.getPropertyValue('font-weight'),
            u = c.getPropertyValue('content')
        if (o && !l) return e.removeChild(o), n()
        if (l && u !== 'none' && u !== '') {
            var d = c.getPropertyValue('content'),
                p = Wz(s, f),
                m = Vz(d),
                v = l[0].startsWith('FontAwesome'),
                C = $z(c),
                M = ni(p, m),
                E = M
            if (v) {
                var F = tz(m)
                F.iconName && F.prefix && ((M = F.iconName), (p = F.prefix))
            }
            if (
                M &&
                !C &&
                (!o || o.getAttribute(Ka) !== p || o.getAttribute(Xa) !== E)
            ) {
                e.setAttribute(r, E), o && e.removeChild(o)
                var P = Az(),
                    Q = P.extra
                ;(Q.attributes[Oa] = t),
                    Wa(M, p)
                        .then(function (s2) {
                            var e1 = ri(
                                    h(
                                        h({}, P),
                                        {},
                                        {
                                            icons: { main: s2, mask: j7() },
                                            prefix: p,
                                            iconName: E,
                                            extra: Q,
                                            watchable: !0,
                                        }
                                    )
                                ),
                                J1 = Y.createElementNS(
                                    'http://www.w3.org/2000/svg',
                                    'svg'
                                )
                            t === '::before'
                                ? e.insertBefore(J1, e.firstChild)
                                : e.appendChild(J1),
                                (J1.outerHTML = e1.map(function (nn) {
                                    return T3(nn)
                                }).join(`
`)),
                                e.removeAttribute(r),
                                n()
                        })
                        .catch(a)
            } else n()
        } else n()
    })
}
function qz(e) {
    return Promise.all([V5(e, '::before'), V5(e, '::after')])
}
function Gz(e) {
    return (
        e.parentNode !== document.head &&
        !~Ty.indexOf(e.tagName.toUpperCase()) &&
        !e.getAttribute(Oa) &&
        (!e.parentNode || e.parentNode.tagName !== 'svg')
    )
}
var Yz = function (t) {
        return (
            !!t &&
            y7.some(function (r) {
                return t.includes(r)
            })
        )
    },
    Qz = function (t) {
        if (!t) return []
        for (
            var r = new Set(),
                n = [t],
                a = [/(?=\s:)/, new RegExp('(?<=\\)\\)?[^,]*,)')],
                i = function () {
                    var p = c[o]
                    n = n.flatMap(function (m) {
                        return m.split(p).map(function (v) {
                            return v.replace(/,\s*$/, '').trim()
                        })
                    })
                },
                o = 0,
                c = a;
            o < c.length;
            o++
        )
            i()
        n = n.flatMap(function (d) {
            return d.includes('(')
                ? d
                : d.split(',').map(function (p) {
                      return p.trim()
                  })
        })
        var s = Vt(n),
            l
        try {
            for (s.s(); !(l = s.n()).done; ) {
                var f = l.value
                if (Yz(f)) {
                    var u = y7.reduce(function (d, p) {
                        return d.replace(p, '')
                    }, f)
                    u !== '' && u !== '*' && r.add(u)
                }
            }
        } catch (d) {
            s.e(d)
        } finally {
            s.f()
        }
        return r
    }
function $5(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1
    if (x1) {
        var r
        if (t) r = e
        else if (L.searchPseudoElementsFullScan) r = e.querySelectorAll('*')
        else {
            var n = new Set(),
                a = Vt(document.styleSheets),
                i
            try {
                for (a.s(); !(i = a.n()).done; ) {
                    var o = i.value
                    try {
                        var c = Vt(o.cssRules),
                            s
                        try {
                            for (c.s(); !(s = c.n()).done; ) {
                                var l = s.value,
                                    f = Qz(l.selectorText),
                                    u = Vt(f),
                                    d
                                try {
                                    for (u.s(); !(d = u.n()).done; ) {
                                        var p = d.value
                                        n.add(p)
                                    }
                                } catch (v) {
                                    u.e(v)
                                } finally {
                                    u.f()
                                }
                            }
                        } catch (v) {
                            c.e(v)
                        } finally {
                            c.f()
                        }
                    } catch (v) {
                        L.searchPseudoElementsWarnings &&
                            console.warn(
                                'Font Awesome: cannot parse stylesheet: '
                                    .concat(o.href, ' (')
                                    .concat(
                                        v.message,
                                        `)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`
                                    )
                            )
                    }
                }
            } catch (v) {
                a.e(v)
            } finally {
                a.f()
            }
            if (!n.size) return
            var m = Array.from(n).join(', ')
            try {
                r = e.querySelectorAll(m)
            } catch {}
        }
        return new Promise(function (v, C) {
            var M = z4(r).filter(Gz).map(qz),
                E = ai.begin('searchPseudoElements')
            W7(),
                Promise.all(M)
                    .then(function () {
                        E(), Ga(), v()
                    })
                    .catch(function () {
                        E(), Ga(), C()
                    })
        })
    }
}
var Zz = {
        hooks: function () {
            return {
                mutationObserverCallbacks: function (r) {
                    return (r.pseudoElementsCallback = $5), r
                },
            }
        },
        provides: function (t) {
            t.pseudoElements2svg = function (r) {
                var n = r.node,
                    a = n === void 0 ? Y : n
                L.searchPseudoElements && $5(a)
            }
        },
    },
    W5 = !1,
    Kz = {
        mixout: function () {
            return {
                dom: {
                    unwatch: function () {
                        W7(), (W5 = !0)
                    },
                },
            }
        },
        hooks: function () {
            return {
                bootstrap: function () {
                    O5(Ha('mutationObserverCallbacks', {}))
                },
                noAuto: function () {
                    Nz()
                },
                watch: function (r) {
                    var n = r.observeMutationsRoot
                    W5
                        ? Ga()
                        : O5(
                              Ha('mutationObserverCallbacks', {
                                  observeMutationsRoot: n,
                              })
                          )
                },
            }
        },
    },
    q5 = function (t) {
        var r = { size: 16, x: 0, y: 0, flipX: !1, flipY: !1, rotate: 0 }
        return t
            .toLowerCase()
            .split(' ')
            .reduce(function (n, a) {
                var i = a.toLowerCase().split('-'),
                    o = i[0],
                    c = i.slice(1).join('-')
                if (o && c === 'h') return (n.flipX = !0), n
                if (o && c === 'v') return (n.flipY = !0), n
                if (((c = parseFloat(c)), isNaN(c))) return n
                switch (o) {
                    case 'grow':
                        n.size = n.size + c
                        break
                    case 'shrink':
                        n.size = n.size - c
                        break
                    case 'left':
                        n.x = n.x - c
                        break
                    case 'right':
                        n.x = n.x + c
                        break
                    case 'up':
                        n.y = n.y - c
                        break
                    case 'down':
                        n.y = n.y + c
                        break
                    case 'rotate':
                        n.rotate = n.rotate + c
                        break
                }
                return n
            }, r)
    },
    Xz = {
        mixout: function () {
            return {
                parse: {
                    transform: function (r) {
                        return q5(r)
                    },
                },
            }
        },
        hooks: function () {
            return {
                parseNodeAttributes: function (r, n) {
                    var a = n.getAttribute('data-fa-transform')
                    return a && (r.transform = q5(a)), r
                },
            }
        },
        provides: function (t) {
            t.generateAbstractTransformGrouping = function (r) {
                var n = r.main,
                    a = r.transform,
                    i = r.containerWidth,
                    o = r.iconWidth,
                    c = { transform: 'translate('.concat(i / 2, ' 256)') },
                    s = 'translate('
                        .concat(a.x * 32, ', ')
                        .concat(a.y * 32, ') '),
                    l = 'scale('
                        .concat((a.size / 16) * (a.flipX ? -1 : 1), ', ')
                        .concat((a.size / 16) * (a.flipY ? -1 : 1), ') '),
                    f = 'rotate('.concat(a.rotate, ' 0 0)'),
                    u = {
                        transform: ''.concat(s, ' ').concat(l, ' ').concat(f),
                    },
                    d = {
                        transform: 'translate('.concat((o / 2) * -1, ' -256)'),
                    },
                    p = { outer: c, inner: u, path: d }
                return {
                    tag: 'g',
                    attributes: h({}, p.outer),
                    children: [
                        {
                            tag: 'g',
                            attributes: h({}, p.inner),
                            children: [
                                {
                                    tag: n.icon.tag,
                                    children: n.icon.children,
                                    attributes: h(
                                        h({}, n.icon.attributes),
                                        p.path
                                    ),
                                },
                            ],
                        },
                    ],
                }
            }
        },
    },
    Ra = { x: 0, y: 0, width: '100%', height: '100%' }
function G5(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0
    return (
        e.attributes &&
            (e.attributes.fill || t) &&
            (e.attributes.fill = 'black'),
        e
    )
}
function Jz(e) {
    return e.tag === 'g' ? e.children : [e]
}
var eL = {
        hooks: function () {
            return {
                parseNodeAttributes: function (r, n) {
                    var a = n.getAttribute('data-fa-mask'),
                        i = a
                            ? Xt(
                                  a.split(' ').map(function (o) {
                                      return o.trim()
                                  })
                              )
                            : j7()
                    return (
                        i.prefix || (i.prefix = K1()),
                        (r.mask = i),
                        (r.maskId = n.getAttribute('data-fa-mask-id')),
                        r
                    )
                },
            }
        },
        provides: function (t) {
            t.generateAbstractMask = function (r) {
                var n = r.children,
                    a = r.attributes,
                    i = r.main,
                    o = r.mask,
                    c = r.maskId,
                    s = r.transform,
                    l = i.width,
                    f = i.icon,
                    u = o.width,
                    d = o.icon,
                    p = $y({ transform: s, containerWidth: u, iconWidth: l }),
                    m = {
                        tag: 'rect',
                        attributes: h(h({}, Ra), {}, { fill: 'white' }),
                    },
                    v = f.children ? { children: f.children.map(G5) } : {},
                    C = {
                        tag: 'g',
                        attributes: h({}, p.inner),
                        children: [
                            G5(
                                h(
                                    {
                                        tag: f.tag,
                                        attributes: h(
                                            h({}, f.attributes),
                                            p.path
                                        ),
                                    },
                                    v
                                )
                            ),
                        ],
                    },
                    M = { tag: 'g', attributes: h({}, p.outer), children: [C] },
                    E = 'mask-'.concat(c || D5()),
                    F = 'clip-'.concat(c || D5()),
                    P = {
                        tag: 'mask',
                        attributes: h(
                            h({}, Ra),
                            {},
                            {
                                id: E,
                                maskUnits: 'userSpaceOnUse',
                                maskContentUnits: 'userSpaceOnUse',
                            }
                        ),
                        children: [m, M],
                    },
                    Q = {
                        tag: 'defs',
                        children: [
                            {
                                tag: 'clipPath',
                                attributes: { id: F },
                                children: Jz(d),
                            },
                            P,
                        ],
                    }
                return (
                    n.push(Q, {
                        tag: 'rect',
                        attributes: h(
                            {
                                fill: 'currentColor',
                                'clip-path': 'url(#'.concat(F, ')'),
                                mask: 'url(#'.concat(E, ')'),
                            },
                            Ra
                        ),
                    }),
                    { children: n, attributes: a }
                )
            }
        },
    },
    tL = {
        provides: function (t) {
            var r = !1
            Z1.matchMedia &&
                (r = Z1.matchMedia('(prefers-reduced-motion: reduce)').matches),
                (t.missingIconAbstract = function () {
                    var n = [],
                        a = { fill: 'currentColor' },
                        i = {
                            attributeType: 'XML',
                            repeatCount: 'indefinite',
                            dur: '2s',
                        }
                    n.push({
                        tag: 'path',
                        attributes: h(
                            h({}, a),
                            {},
                            {
                                d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z',
                            }
                        ),
                    })
                    var o = h(h({}, i), {}, { attributeName: 'opacity' }),
                        c = {
                            tag: 'circle',
                            attributes: h(
                                h({}, a),
                                {},
                                { cx: '256', cy: '364', r: '28' }
                            ),
                            children: [],
                        }
                    return (
                        r ||
                            c.children.push(
                                {
                                    tag: 'animate',
                                    attributes: h(
                                        h({}, i),
                                        {},
                                        {
                                            attributeName: 'r',
                                            values: '28;14;28;28;14;28;',
                                        }
                                    ),
                                },
                                {
                                    tag: 'animate',
                                    attributes: h(
                                        h({}, o),
                                        {},
                                        { values: '1;0;1;1;0;1;' }
                                    ),
                                }
                            ),
                        n.push(c),
                        n.push({
                            tag: 'path',
                            attributes: h(
                                h({}, a),
                                {},
                                {
                                    opacity: '1',
                                    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z',
                                }
                            ),
                            children: r
                                ? []
                                : [
                                      {
                                          tag: 'animate',
                                          attributes: h(
                                              h({}, o),
                                              {},
                                              { values: '1;0;0;0;0;1;' }
                                          ),
                                      },
                                  ],
                        }),
                        r ||
                            n.push({
                                tag: 'path',
                                attributes: h(
                                    h({}, a),
                                    {},
                                    {
                                        opacity: '0',
                                        d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z',
                                    }
                                ),
                                children: [
                                    {
                                        tag: 'animate',
                                        attributes: h(
                                            h({}, o),
                                            {},
                                            { values: '0;0;1;1;0;0;' }
                                        ),
                                    },
                                ],
                            }),
                        {
                            tag: 'g',
                            attributes: { class: 'missing' },
                            children: n,
                        }
                    )
                })
        },
    },
    nL = {
        hooks: function () {
            return {
                parseNodeAttributes: function (r, n) {
                    var a = n.getAttribute('data-fa-symbol'),
                        i = a === null ? !1 : a === '' ? !0 : a
                    return (r.symbol = i), r
                },
            }
        },
    },
    rL = [Gy, Oz, Bz, jz, Uz, Zz, Kz, Xz, eL, tL, nL]
fz(rL, { mixoutsTo: P2 })
var BE = P2.noAuto,
    jE = P2.config,
    UE = P2.library,
    HE = P2.dom,
    Y7 = P2.parse,
    VE = P2.findIconDefinition,
    $E = P2.toHtml,
    Q7 = P2.icon,
    WE = P2.layer,
    aL = P2.text,
    iL = P2.counter
var oL = ['*'],
    cL = e => {
        throw new Error(
            `Could not find icon with iconName=${e.iconName} and prefix=${e.prefix} in the icon library.`
        )
    },
    sL = () => {
        throw new Error(
            'Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.'
        )
    },
    lL = e => {
        let t = {
            [`fa-${e.animation}`]:
                e.animation != null && !e.animation.startsWith('spin'),
            'fa-spin': e.animation === 'spin' || e.animation === 'spin-reverse',
            'fa-spin-pulse':
                e.animation === 'spin-pulse' ||
                e.animation === 'spin-pulse-reverse',
            'fa-spin-reverse':
                e.animation === 'spin-reverse' ||
                e.animation === 'spin-pulse-reverse',
            'fa-pulse':
                e.animation === 'spin-pulse' ||
                e.animation === 'spin-pulse-reverse',
            'fa-fw': e.fixedWidth,
            'fa-border': e.border,
            'fa-inverse': e.inverse,
            'fa-layers-counter': e.counter,
            'fa-flip-horizontal': e.flip === 'horizontal' || e.flip === 'both',
            'fa-flip-vertical': e.flip === 'vertical' || e.flip === 'both',
            [`fa-${e.size}`]: e.size !== null,
            [`fa-rotate-${e.rotate}`]: e.rotate !== null,
            [`fa-pull-${e.pull}`]: e.pull !== null,
            [`fa-stack-${e.stackItemSize}`]: e.stackItemSize != null,
        }
        return Object.keys(t)
            .map(r => (t[r] ? r : null))
            .filter(r => r)
    },
    fL = e => e.prefix !== void 0 && e.iconName !== void 0,
    uL = (e, t) =>
        fL(e)
            ? e
            : typeof e == 'string'
            ? { prefix: t, iconName: e }
            : { prefix: e[0], iconName: e[1] },
    dL = (() => {
        let t = class t {
            constructor() {
                ;(this.defaultPrefix = 'fas'), (this.fallbackIcon = null)
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    pL = (() => {
        let t = class t {
            constructor() {
                this.definitions = {}
            }
            addIcons(...n) {
                for (let a of n) {
                    a.prefix in this.definitions ||
                        (this.definitions[a.prefix] = {}),
                        (this.definitions[a.prefix][a.iconName] = a)
                    for (let i of a.icon[2])
                        typeof i == 'string' &&
                            (this.definitions[a.prefix][i] = a)
                }
            }
            addIconPacks(...n) {
                for (let a of n) {
                    let i = Object.keys(a).map(o => a[o])
                    this.addIcons(...i)
                }
            }
            getIconDefinition(n, a) {
                return n in this.definitions && a in this.definitions[n]
                    ? this.definitions[n][a]
                    : null
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
        let e = t
        return e
    })(),
    hL = (() => {
        let t = class t {
            constructor() {
                this.stackItemSize = '1x'
            }
            ngOnChanges(n) {
                if ('size' in n)
                    throw new Error(
                        'fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.'
                    )
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)()
        }),
            (t.ɵdir = he({
                type: t,
                selectors: [
                    ['fa-icon', 'stackItemSize', ''],
                    ['fa-duotone-icon', 'stackItemSize', ''],
                ],
                inputs: { stackItemSize: 'stackItemSize', size: 'size' },
                standalone: !0,
                features: [B1],
            }))
        let e = t
        return e
    })(),
    mL = (() => {
        let t = class t {
            constructor(n, a) {
                ;(this.renderer = n), (this.elementRef = a)
            }
            ngOnInit() {
                this.renderer.addClass(
                    this.elementRef.nativeElement,
                    'fa-stack'
                )
            }
            ngOnChanges(n) {
                'size' in n &&
                    (n.size.currentValue != null &&
                        this.renderer.addClass(
                            this.elementRef.nativeElement,
                            `fa-${n.size.currentValue}`
                        ),
                    n.size.previousValue != null &&
                        this.renderer.removeClass(
                            this.elementRef.nativeElement,
                            `fa-${n.size.previousValue}`
                        ))
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(Z(Y4), Z(e4))
        }),
            (t.ɵcmp = e2({
                type: t,
                selectors: [['fa-stack']],
                inputs: { size: 'size' },
                standalone: !0,
                features: [B1, t2],
                ngContentSelectors: oL,
                decls: 1,
                vars: 0,
                template: function (a, i) {
                    a & 1 && (ot(), ct(0))
                },
                encapsulation: 2,
            }))
        let e = t
        return e
    })(),
    en = (() => {
        let t = class t {
            set spin(n) {
                this.animation = n ? 'spin' : void 0
            }
            set pulse(n) {
                this.animation = n ? 'spin-pulse' : void 0
            }
            constructor(n, a, i, o, c) {
                ;(this.sanitizer = n),
                    (this.config = a),
                    (this.iconLibrary = i),
                    (this.stackItem = o),
                    (this.classes = []),
                    c != null &&
                        o == null &&
                        console.error(
                            'FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.'
                        )
            }
            ngOnChanges(n) {
                if (this.icon == null && this.config.fallbackIcon == null) {
                    sL()
                    return
                }
                if (n) {
                    let a =
                            this.icon != null
                                ? this.icon
                                : this.config.fallbackIcon,
                        i = this.findIconDefinition(a)
                    if (i != null) {
                        let o = this.buildParams()
                        this.renderIcon(i, o)
                    }
                }
            }
            render() {
                this.ngOnChanges({})
            }
            findIconDefinition(n) {
                let a = uL(n, this.config.defaultPrefix)
                if ('icon' in a) return a
                let i = this.iconLibrary.getIconDefinition(a.prefix, a.iconName)
                return i ?? (cL(a), null)
            }
            buildParams() {
                let n = {
                        flip: this.flip,
                        animation: this.animation,
                        border: this.border,
                        inverse: this.inverse,
                        size: this.size || null,
                        pull: this.pull || null,
                        rotate: this.rotate || null,
                        fixedWidth:
                            typeof this.fixedWidth == 'boolean'
                                ? this.fixedWidth
                                : this.config.fixedWidth,
                        stackItemSize:
                            this.stackItem != null
                                ? this.stackItem.stackItemSize
                                : null,
                    },
                    a =
                        typeof this.transform == 'string'
                            ? Y7.transform(this.transform)
                            : this.transform
                return {
                    title: this.title,
                    transform: a,
                    classes: [...lL(n), ...this.classes],
                    mask:
                        this.mask != null
                            ? this.findIconDefinition(this.mask)
                            : null,
                    styles: this.styles != null ? this.styles : {},
                    symbol: this.symbol,
                    attributes: { role: this.a11yRole },
                }
            }
            renderIcon(n, a) {
                let i = Q7(n, a)
                this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(
                    i.html.join(`
`)
                )
            }
        }
        ;(t.ɵfac = function (a) {
            return new (a || t)(Z(j6), Z(dL), Z(pL), Z(hL, 8), Z(mL, 8))
        }),
            (t.ɵcmp = e2({
                type: t,
                selectors: [['fa-icon']],
                hostAttrs: [1, 'ng-fa-icon'],
                hostVars: 2,
                hostBindings: function (a, i) {
                    a & 2 &&
                        (v6('innerHTML', i.renderedIconHTML, As),
                        at('title', i.title))
                },
                inputs: {
                    icon: 'icon',
                    title: 'title',
                    animation: 'animation',
                    spin: 'spin',
                    pulse: 'pulse',
                    mask: 'mask',
                    styles: 'styles',
                    flip: 'flip',
                    size: 'size',
                    pull: 'pull',
                    border: 'border',
                    inverse: 'inverse',
                    symbol: 'symbol',
                    rotate: 'rotate',
                    fixedWidth: 'fixedWidth',
                    classes: 'classes',
                    transform: 'transform',
                    a11yRole: 'a11yRole',
                },
                standalone: !0,
                features: [B1, t2],
                decls: 0,
                vars: 0,
                template: function (a, i) {},
                encapsulation: 2,
            }))
        let e = t
        return e
    })()
var tn = (() => {
    let t = class t {}
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵmod = F1({ type: t })),
        (t.ɵinj = _1({}))
    let e = t
    return e
})()
var K7 = {
    prefix: 'fas',
    iconName: 'arrow-left',
    icon: [
        512,
        512,
        [8592],
        'f060',
        'M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z',
    ],
}
var X7 = {
    prefix: 'fas',
    iconName: 'bars',
    icon: [
        448,
        512,
        ['navicon'],
        'f0c9',
        'M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z',
    ],
}
var gL = ['*']
function vL(e, t) {
    if (e & 1) {
        let r = x8()
        W(0, 'button', 5),
            H1('click', function () {
                kc(r)
                let a = Z4()
                return Rc(a.goBack())
            }),
            o1(1, 'fa-icon', 6),
            G()
    }
    if (e & 2) {
        let r = Z4()
        c2(), K2('icon', r.faArrowLeft)
    }
}
var J7 = (() => {
    let t = class t {
        constructor(n) {
            ;(this.location = n),
                (this.isScrolled = U1(!1)),
                (this.title = ''),
                (this.isLoading = !1),
                (this.isAnimated = !1),
                (this.showBackButton = !1),
                (this.faArrowLeft = K7)
        }
        goBack() {
            this.location.back()
        }
        onWindowScroll() {
            ;(window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0) > 100
                ? this.isScrolled.set(!0)
                : this.isScrolled.set(!1)
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(Z(be))
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-page']],
            hostBindings: function (a, i) {
                a & 1 &&
                    H1(
                        'scroll',
                        function (c) {
                            return i.onWindowScroll(c)
                        },
                        !1,
                        Q0
                    )
            },
            inputs: {
                title: 'title',
                isLoading: 'isLoading',
                isAnimated: 'isAnimated',
                showBackButton: 'showBackButton',
            },
            standalone: !0,
            features: [t2],
            ngContentSelectors: gL,
            decls: 8,
            vars: 4,
            consts: [
                [1, 'flex', 'flex-col'],
                [1, 'page-header'],
                ['class', 'action', 'name', 'atras', 3, 'click', 4, 'ngIf'],
                [1, 'text-3xl', 'font-bold'],
                [1, 'px-5', 'py-3', 'h-full'],
                ['name', 'atras', 1, 'action', 3, 'click'],
                [3, 'icon'],
            ],
            template: function (a, i) {
                a & 1 &&
                    (ot(),
                    W(0, 'div')(1, 'div', 0)(2, 'div', 1),
                    ye(3, vL, 2, 1, 'button', 2),
                    W(4, 'h2', 3),
                    h2(5),
                    G()()(),
                    W(6, 'div', 4),
                    ct(7),
                    G()()),
                    a & 2 &&
                        (c2(),
                        r4('appear', i.isAnimated),
                        c2(2),
                        K2('ngIf', i.showBackButton),
                        c2(2),
                        Le(i.title))
            },
            dependencies: [d2, mt, tn, en],
            styles: [
                `.page-header[_ngcontent-%COMP%]{transition:all .3s ease-in-out;display:flex;width:100%;align-items:center;justify-content:space-between;background-color:var(--color-base, hsl(0 0% 95%));padding-inline:calc(var(--spacing, .25rem) * 5);padding-block:calc(var(--spacing, .25rem) * 2)}.page-header.fixed[_ngcontent-%COMP%]{position:fixed;top:calc(var(--spacing, .25rem) * 12);z-index:35}

`,
            ],
        }))
    let e = t
    return e
})()
var e9 = (() => {
    let t = class t {
        setItem(n, a) {
            localStorage.setItem(n, JSON.stringify(a))
        }
        getItem(n) {
            let a = localStorage.getItem(n)
            return a ? JSON.parse(a) : null
        }
        removeItem(n) {
            localStorage.removeItem(n)
        }
        clear() {
            localStorage.clear()
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
var t9 = (() => {
    let t = class t {
        constructor(n) {
            ;(this.localStorage = n),
                (this.STORAGE_KEY = 'checklist'),
                (this.checklist = U1([])),
                this.load()
        }
        load() {
            let n = this.localStorage.getItem(this.STORAGE_KEY)
            n && this.checklist.set(n)
        }
        persist() {
            this.localStorage.setItem(this.STORAGE_KEY, this.checklist())
        }
        addList(n) {
            this.checklist.update(a => [...a, n]), this.persist()
        }
        removeList(n) {
            this.checklist.update(a => a.filter(i => i.title !== n)),
                this.persist()
        }
        clear() {
            this.checklist.set([]),
                this.localStorage.removeItem(this.STORAGE_KEY)
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(D(e9))
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
function yL(e, t) {
    if ((e & 1 && (W(0, 'li'), h2(1), I8(2, 'currency'), G()), e & 2)) {
        let r = t.$implicit
        c2(), M6(' ', r.count, ' x ', r.name, ' - ', T8(2, 3, r.price), ' ')
    }
}
function zL(e, t) {
    if (
        (e & 1 &&
            (W(0, 'li')(1, 'h3'),
            h2(2),
            G(),
            W(3, 'ul'),
            ye(4, yL, 3, 5, 'li', 3),
            G()()),
        e & 2)
    ) {
        let r = t.$implicit
        c2(2), Le(r.title), c2(2), K2('ngForOf', r.items)
    }
}
function LL(e, t) {
    if ((e & 1 && (W(0, 'ul'), ye(1, zL, 5, 2, 'li', 3), G()), e & 2)) {
        let r = Z4()
        c2(), K2('ngForOf', r.lists)
    }
}
function wL(e, t) {
    e & 1 && (W(0, 'p'), h2(1, 'No tienes listas de compras guardadas.'), G())
}
var n9 = (() => {
    let t = class t {
        constructor(n) {
            ;(this.checklistStore = n), (this.lists = [])
        }
        ngOnInit() {
            this.lists = this.checklistStore.checklist()
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)(Z(t9))
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-home']],
            standalone: !0,
            features: [t2],
            decls: 5,
            vars: 5,
            consts: [
                ['noLists', ''],
                [
                    'title',
                    'Home',
                    3,
                    'isLoading',
                    'isAnimated',
                    'showBackButton',
                ],
                [4, 'ngIf', 'ngIfElse'],
                [4, 'ngFor', 'ngForOf'],
            ],
            template: function (a, i) {
                if (
                    (a & 1 &&
                        (W(0, 'main')(1, 'app-page', 1),
                        ye(2, LL, 2, 1, 'ul', 2)(
                            3,
                            wL,
                            2,
                            0,
                            'ng-template',
                            null,
                            0,
                            A8
                        ),
                        G()()),
                    a & 2)
                ) {
                    let o = N8(4)
                    c2(),
                        K2('isLoading', !1)('isAnimated', !0)(
                            'showBackButton',
                            !1
                        ),
                        c2(),
                        K2('ngIf', i.lists.length > 0)('ngIfElse', o)
                }
            },
            dependencies: [d2, tl, mt, nl, J7],
        }))
    let e = t
    return e
})()
var r9 = (() => {
    let t = class t {}
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-maintenance']],
            standalone: !0,
            features: [t2],
            decls: 2,
            vars: 0,
            template: function (a, i) {
                a & 1 && (W(0, 'p'), h2(1, 'maintenance works!'), G())
            },
            dependencies: [d2],
        }))
    let e = t
    return e
})()
var a9 = (() => {
    let t = class t {
        constructor() {
            this.isSiteOnline = !0
        }
        getIsSiteOnline() {
            return this.isSiteOnline
        }
        setIsSiteOnline(n) {
            this.isSiteOnline = n
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
})()
var oi = () =>
    new a9().getIsSiteOnline() ? !0 : (new jt().navigate(['/maintenance']), !1)
var i9 = [
    { path: '', component: n9, canActivate: [oi] },
    { path: 'maintenance', component: r9 },
    { path: 'error', component: m5, canActivate: [oi] },
    { path: '**', redirectTo: 'error' },
]
var o9 = { providers: [h5(i9), kl()] }
var c9 = (() => {
    let t = class t {
        constructor() {
            this.year = new Date().getFullYear()
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-footer']],
            standalone: !0,
            features: [t2],
            decls: 3,
            vars: 1,
            consts: [
                [
                    1,
                    'w-full',
                    'bg-base',
                    'flex',
                    'items-center',
                    'justify-center',
                    'h-10',
                ],
            ],
            template: function (a, i) {
                a & 1 && (W(0, 'footer', 0)(1, 'p'), h2(2), G()()),
                    a & 2 && (c2(2), st('Sito Compras App \xA9 ', i.year, ''))
            },
            dependencies: [d2],
        }))
    let e = t
    return e
})()
function ci(e) {
    let t = e ? new Date(e) : new Date(),
        r = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: !0,
        },
        n = typeof navigator < 'u' ? navigator.language : 'es-ES'
    return t.toLocaleString(n, r)
}
var s9 = (() => {
    let t = class t {
        constructor() {
            this.dateNow = U1(ci())
        }
        ngOnInit() {
            this.intervalId = window.setInterval(() => {
                this.dateNow.set(ci())
            }, 1e3)
        }
        ngOnDestroy() {
            this.intervalId && clearInterval(this.intervalId)
        }
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-clock']],
            standalone: !0,
            features: [t2],
            decls: 2,
            vars: 1,
            consts: [[1, 'capitalize']],
            template: function (a, i) {
                a & 1 && (W(0, 'p', 0), h2(1), G()),
                    a & 2 && (c2(), Le(i.dateNow()))
            },
            dependencies: [d2],
        }))
    let e = t
    return e
})()
var l9 = (() => {
    let t = class t {
        constructor() {
            ;(this.isScrolled = U1(!1)), (this.faBars = X7)
        }
        onWindowScroll() {
            let n =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0
            console.log(n),
                n > 100 ? this.isScrolled.set(!0) : this.isScrolled.set(!1)
        }
        openDrawer() {}
    }
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-header']],
            hostBindings: function (a, i) {
                a & 1 &&
                    H1(
                        'scroll',
                        function (c) {
                            return i.onWindowScroll(c)
                        },
                        !1,
                        Q0
                    )
            },
            standalone: !0,
            features: [t2],
            decls: 8,
            vars: 3,
            consts: [
                [1, 'header'],
                [1, 'flex', 'gap-2', 'items-center'],
                [
                    'type',
                    'button',
                    'name',
                    'abrir-menu',
                    'aria-label',
                    'Abrir men\xFA',
                    1,
                    'button',
                    'menu',
                    'animated',
                    3,
                    'click',
                ],
                [3, 'icon'],
                [
                    1,
                    'text-lg',
                    'text-text',
                    'pointer-events-none',
                    'poppins',
                    'font-bold',
                ],
                [1, 'max-xs:hidden'],
            ],
            template: function (a, i) {
                a & 1 &&
                    (W(0, 'header', 0)(1, 'div', 1)(2, 'button', 2),
                    H1('click', function () {
                        return i.openDrawer()
                    }),
                    o1(3, 'fa-icon', 3),
                    G(),
                    W(4, 'h1', 4),
                    h2(5, ' Sito Compras '),
                    G()(),
                    W(6, 'div', 5),
                    o1(7, 'app-clock'),
                    G()()),
                    a & 2 &&
                        (r4('fixed', i.isScrolled()),
                        c2(3),
                        K2('icon', i.faBars))
            },
            dependencies: [d2, tn, en, s9],
            styles: [
                `.header[_ngcontent-%COMP%]{transition:all .3s ease-in-out;z-index:20;display:flex;height:calc(var(--spacing, .25rem) * 12);width:100%;align-items:center;justify-content:space-between;background-color:var(--color-base, hsl(0 0% 95%));padding-inline:calc(var(--spacing, .25rem) * 3)}.header.fixed[_ngcontent-%COMP%]{position:fixed;top:calc(var(--spacing, .25rem) * 0)}.button.menu[_ngcontent-%COMP%]{height:calc(var(--spacing, .25rem) * 10);width:calc(var(--spacing, .25rem) * 10);border-radius:calc(infinity * 1px);padding:calc(var(--spacing, .25rem) * 0)!important}

`,
            ],
        }))
    let e = t
    return e
})()
var f9 = (() => {
    let t = class t {}
    ;(t.ɵfac = function (a) {
        return new (a || t)()
    }),
        (t.ɵcmp = e2({
            type: t,
            selectors: [['app-root']],
            standalone: !0,
            features: [t2],
            decls: 3,
            vars: 0,
            template: function (a, i) {
                a & 1 &&
                    o1(0, 'app-header')(1, 'router-outlet')(2, 'app-footer')
            },
            dependencies: [d2, za, Ll, c9, l9],
        }))
    let e = t
    return e
})()
Tl(f9, o9).catch(e => console.error(e))
