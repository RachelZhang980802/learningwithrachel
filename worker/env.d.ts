// DB is optional: the current hosting configuration does not provision D1.
// getDb() retains its existing runtime guard before using this binding.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
