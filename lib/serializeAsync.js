module.exports = function serializeAsync(fn, options) {
    options = options || {};

    var waitingQueue = [],
        maxConcurrency = options.maxConcurrency || 1,
        concurrency = 0;

    function proceed() {
        while (waitingQueue.length > 0 && concurrency < maxConcurrency) {
            concurrency += 1;
            var queueEntry = waitingQueue.shift(),
                args = queueEntry.args;
            args.push(function () { // ...
                concurrency -= 1;
                proceed();
                queueEntry.cb.apply(this, arguments);
            });
            fn.apply(queueEntry.context, args);
        }
    }

    return function () { // ...
        var args = Array.prototype.slice.call(arguments),
            lastArg = args[args.length - 1],
            cb;
        if (typeof lastArg === 'function') {
            cb = lastArg;
            args.pop();
        }
        waitingQueue.push({context: this, args: args, cb: cb});
        proceed();
    };
};
