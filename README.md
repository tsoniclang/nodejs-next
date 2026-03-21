# nodejs-next

Native Tsonic implementation of `@tsonic/nodejs`.

## Status

This repo is the replacement track for the current `nodejs-clr` + generated `nodejs` split.

The migration standard is:

- Tsonic becomes the source of truth for Node-shaped library behavior
- .NET remains only the host substrate where needed
- every migrated module must have checked-in coverage and a traceable test inventory

## Current native slice

The first validated native slice in this repo covers:

- `assert`
- `console`
- `path`
- `events`
- `process`
- `timers`
- `util`

For that slice, `npm run report:gaps` now proves:

- exact selftest file coverage parity against `nodejs-clr`
- exact fact-count parity for the ported `tsonic test` suites

The next work is moving through the remaining Node.js module matrix after the current `assert` / `console` / `events` / `path` / `process` / `timers` / `util` slice.

## Commands

- `npm run selftest`
- `npm run report:gaps`
