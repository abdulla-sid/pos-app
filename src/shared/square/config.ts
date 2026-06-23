// Single source of truth for the two Square wire-protocol constants the app's
// server-side code shares (catalog client + auth provider). Centralised here so
// the sandbox→production switch is ONE change, never a 5-site find-and-replace.
//
// The two constants are deliberately different *kinds* of thing:
//
//   SQUARE_API_BASE — CONFIG. It varies between deploys of the same code
//   (sandbox host in dev, production host in prod), which is the textbook
//   definition of config, so it lives in an env var and is read+validated once
//   here. Fail-fast if unset, mirroring the SQUARE_CLIENT_ID/SECRET guard in
//   auth.ts: a missing host should crash at boot, not silently fall back to the
//   wrong environment in production.
//
//   SQUARE_VERSION — CODE. It does NOT vary between deploys; it pins the dated
//   API contract that mappers.ts is written against. Bumping it is a code change
//   reviewed alongside the mapper, so it stays a constant in version control.
//   Putting it in an env var would let an operator change the API contract the
//   code assumes without anyone reviewing mappers.ts — a silent break git-blame
//   can't explain.
//
// Why a module `const`, not `globalThis`: a module const is immutable (can't be
// reassigned), literal-typed (the compiler knows the value), and ordered by the
// import graph (guaranteed initialised before any importer's body runs). A
// `globalThis` value would be mutable, `any`-typed, and load-order-fragile, with
// no upside for a constant. See docs/addendum-config-vs-code.md.
//
// No `import "server-only"` here on purpose: the host is not a secret (it's in
// Square's public docs), and client.ts already carries the server-only token
// guard. Keeping config.ts plain avoids any edge-runtime export-condition risk
// if auth.ts is ever pulled toward middleware.

const base = process.env.SQUARE_API_BASE;
if (!base) {
  throw new Error(
    "SQUARE_API_BASE must be set in .env (e.g. https://connect.squareupsandbox.com)",
  );
}

export const SQUARE_API_BASE = base;
export const SQUARE_VERSION = "2025-01-23";
