// scripts/dev.ts - runs 'next dev' + ngrok as ONE supervised foreground process
// Launch wit bun run dev. CTRL-C (SIGINT) or an editor "stop (SIGTERM) tears down both
// bun auto loads .env

import { spawn } from "node:child_process";

const domain = process.env.NGROK_DOMAIN;
if (!domain) throw new Error("NGROK_DOMAIN missing");

// Single source of truth: Next and ngrok MUST agree on the port. `-p` pins Next
// so it fails loudly if PORT is taken, instead of silently drifting to 3001 and
// desyncing from the tunnel (the failure mode that bit us on 3000).
const PORT = "3001";

const next = spawn("bunx", ["next", "dev", "-p", PORT], { stdio: "inherit" });
const ngrok = spawn(
  "ngrok",
  ["http", PORT, `--url=https://${domain}`, "--log=stdout"],
  { stdio: "inherit" },
);

let stopping = false;
const stop = () => {
  if (stopping) return;
  stopping = true;
  next.kill();
  ngrok.kill();
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

next.on("exit", stop);
ngrok.on("exit", stop);
