var EventSource = require("global/window").EventSource

module.exports = EventSource ? EventSourceProxy : null

function EventSourceProxy(url, eventSourceInitDict) {
    var events = {}
    var source

    Object.defineProperties(this, {
        CONNECTING: { value: 0, writable: false },
        OPEN: { value: 1, writable: false },
        CLOSED: { value: 2, writable: false },
        URL: { get: getUrl },
        readyState: { get: readyState },
        withCredentials: { get: withCredentials },
        close: { value: close, writable: false },
        addEventListener: { value: addEventListener, writable: false },
        removeEventListener: { value: removeEventListener, writable: false },
        reconnect: { value: connect, writable: false }
    })

    connect()

    function connect(u, e) {
        if (source) {
            source.close()
            unbindHandlers(source, events)
        }

        source = new EventSource(u || url, e || eventSourceInitDict)
        bindHandlers(this, source, events)
    }

    function getUrl() { return source.url }
    function readyState() { return source.readyState }
    function withCredentials() { return source.withCredentials }
    function close() { source.close() }

    function addEventListener(name, listener) {
        var l = events[name] || []
        if (l.indexOf(listener) === -1) {
            l.push(listener)
            events[name] = l
            source.addEventListener(name, listener)
        }
    }

    function removeEventListener(name, listener) {
        var l = events[name]
        if (l) {
            var index = l.indexOf(listener)
            if (index !== -1) {
                l.splice(index, 1)
                source.removeEventListener(name, listener)
            }
        }
    }
}

function unbindHandlers(source, events) {
    source.onopen = null
    source.onmessage = null
    source.onerror = null

    if (events) {
        Object.keys(events).forEach(function (name) {
            events[name].forEach(function (listener) {
                source.removeEventListener(name, listener)
            })
        })
    }
}

function bindHandlers(proxy, source, events) {
    source.onopen = proxyHandler(proxy, "onopen")
    source.onmessage = proxyHandler(proxy, "onclose")
    source.onerror = proxyHandler(proxy, "onerror")

    if (events) {
        Object.keys(events).forEach(function (name) {
            events[name].forEach(function (listener) {
                source.addEventListener(name, listener)
            })
        })
    }
}

function proxyHandler(proxy, method) {
    return function () {
        var func = proxy[method]
        if (typeof func === "function") {
            func.apply(this, arguments)
        }
    }
}