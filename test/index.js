var test = require("tape")

var nativeEventsource = require("../index")

test("nativeEventsource is a function", function (assert) {
    assert.equal(typeof nativeEventsource, "function")
    assert.end()
})
