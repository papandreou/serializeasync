serializeasync
==============

Make sure that an async function is not run multiple times at once.

```javascript
var serializeAsync = require('serializeasync');

function cannotRunInParallel(text, cb) {
    require('fs').writeFile('/foo/bar.txt', text, 'utf-8', cb);
}

var serialized = serializeAsync(cannotRunInParallel);

// Now it's safe to do this (the second invocation will be queued up
// until the first has completed):

serialized('bla', function () {});
serialized('blabla', function () {});
```

You can also set the concurrency level to more than one:

```javascript
var serialized = serializeAsync(cannotRunInParallel, {maxConcurrency: 4});
```

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install serializeasync

License
-------

3-clause BSD license -- see the `LICENSE` file for details.
