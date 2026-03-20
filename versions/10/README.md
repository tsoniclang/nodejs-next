# `@tsonic/nodejs`

Native Tsonic source-package implementation of Node.js APIs.

Current native slice:

- `path`

Known current blocker:

- exact numeric exports in native source packages still hit a Tsonic emitter issue
- because of that, `events` and `process` stay out of the published slice until the compiler issue is fixed cleanly

This package is authored as a first-party Tsonic source package and is intended to replace the current generated package over time.
