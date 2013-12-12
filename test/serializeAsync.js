var expect = require('unexpected'),
    async = require('async'),
    serializeAsync = require('../lib/serializeAsync');

describe('serializeAsync', function () {
    it('should only have one outstanding run of the wrapped function', function (done) {
        var concurrency = 0,
            concurrencyMeasurements = [concurrency];

        function adjustAndMeasure(delta) {
            concurrency += delta;
            concurrencyMeasurements.push(concurrency);
        }

        var serializedFunction = serializeAsync(function (invocationNumber, cb) {
            adjustAndMeasure(+1);
            setTimeout(function () {
                adjustAndMeasure(-1);
                cb();
            }, 2);
        });

        async.each([1, 2, 3, 4], serializedFunction, function (err) {
            expect(concurrencyMeasurements, 'to equal', [0, 1, 0, 1, 0, 1, 0, 1, 0]);
            done(err);
        });
    });

    it('should honor the maxConcurrency option', function (done) {
        var concurrency = 0,
            concurrencyMeasurements = [concurrency];

        function adjustAndMeasure(delta) {
            concurrency += delta;
            concurrencyMeasurements.push(concurrency);
        }

        var serializedFunction = serializeAsync(function (invocationNumber, cb) {
            adjustAndMeasure(+1);
            setTimeout(function () {
                adjustAndMeasure(-1);
                cb();
            }, 2);
        }, {maxConcurrency: 2});

        async.each([1, 2, 3, 4], serializedFunction, function (err) {
            expect(concurrencyMeasurements, 'to equal', [0, 1, 2, 1, 2, 1, 2, 1, 0]);
            done(err);
        });
    });
});
