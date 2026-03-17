const execPath = process.env.npm_execpath || "";

if (!execPath.includes("pnpm")) {
  console.error("This repository only supports pnpm@10.6.0.");
  process.exit(1);
}
