# `nodejs-next` Migration Plan

## Goal

Port `nodejs-clr` into a native Tsonic source package that becomes the future `@tsonic/nodejs`.

## Source of truth

- runtime substrate stays in .NET only where host interop is unavoidable
- Node-shaped library behavior moves into Tsonic
- no CLR-first re-generation layer for migrated modules

## Current slice

Implemented and validated natively in `versions/10/src`:

- `path`

Drafted but blocked on current Tsonic source-package exact-numeric emission:

- `events`
- `process`

Deferred from `process` until the runtime model is sound:

- `env`
- signal/process-control APIs beyond `exit`

## Coverage rule

Every migration slice must include:

- source-package packaging checks
- `tsonic test` coverage
- runtime smoke coverage
- a gap report against `../nodejs-clr/tests/nodejs.Tests`

## Next batches

1. finish `process`
2. `timers`
3. `console`
4. `util`
5. `assert`
6. `fs`
7. `stream`
8. `http`
9. `net`
10. remaining module matrix
