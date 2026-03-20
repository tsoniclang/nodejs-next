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

- `path`

`events` and `process` are blocked right now by a current Tsonic source-package emitter bug around exact numeric exports. That blocker is tracked in the migration plan instead of being hidden behind weakened types.

## Commands

- `npm run selftest`
- `npm run report:gaps`
