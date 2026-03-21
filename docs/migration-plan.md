# `nodejs-next` Migration Plan

## Goal

Port `nodejs-clr` into a native Tsonic source package that becomes the future `@tsonic/nodejs`.

## Source of truth

- runtime substrate stays in .NET only where host interop is unavoidable
- Node-shaped library behavior moves into Tsonic
- no CLR-first re-generation layer for migrated modules

## Current slice

Implemented and validated natively in `versions/10/src`:

- `assert`
- `console`
- `path`
- `events`
- `process`
- `timers`
- `util`

## Coverage rule

Every migration slice must include:

- source-package packaging checks
- `tsonic test` coverage
- runtime smoke coverage
- a gap report against `../nodejs-clr/tests/nodejs.Tests`

For an implemented module to count as migrated, the gap report must show:

- exact selftest file parity
- exact fact-count parity

## Next batches

1. `fs`
2. `stream`
3. `http`
4. `net`
5. remaining module matrix
