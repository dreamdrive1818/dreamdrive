const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

const procs = [
  ["services/identity-service/index.js"],
  ["services/notify-service/index.js"],
  ["services/crm-service/index.js"],
  ["services/booking-service/index.js"],
  ["services/catalog-service/index.js"],
];

for (const [script] of procs) {
  spawn(process.execPath, [path.join(root, script)], {
    stdio: "inherit",
    cwd: root,
    env: process.env,
  });
}

spawn(process.execPath, [path.join(root, "server.js")], {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env, RUN_MODE: "split" },
});
