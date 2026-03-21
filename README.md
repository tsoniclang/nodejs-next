# nodejs-next

Native Tsonic implementation of `@tsonic/nodejs`.

## Status

This repo is the replacement track for the current `nodejs-clr` + generated `nodejs` split.

The migration standard is:

- Tsonic becomes the source of truth for Node-shaped library behavior
- .NET remains only the host substrate where needed
- every migrated module must have checked-in coverage and a traceable test inventory

## Current state

This branch contains a broad mechanical native port of the Node.js module
matrix. The source and selftest trees now cover:

- `assert`
- `buffer`
- `child_process`
- `console`
- `crypto`
- `dgram`
- `dns`
- `events`
- `fs`
- `http`
- `net`
- `os`
- `path`
- `perf_hooks`
- `process`
- `querystring`
- `readline`
- `stream`
- `string_decoder`
- `timers`
- `tls`
- `url`
- `util`
- `zlib`

This repo is not considered complete until all of the above:

- compile under Tsonic
- run through the selftest matrix
- maintain traceable parity against `nodejs-clr`

Use `npm run report:gaps` to compare the checked-in selftest inventory against
the `nodejs-clr` baseline.

## Commands

- `npm run selftest`
- `npm run report:gaps`
