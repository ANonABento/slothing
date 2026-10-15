import { spawn } from "child_process";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export const typstBin = () => join(process.cwd(), ".engines", "typst");

/** Run a compiler in a throwaway directory holding only `files`; return the produced PDF. */
export async function compileInTemp(
  files: Record<string, string>,
  bin: string,
  args: string[],
  output: string,
  timeoutMs = 60_000,
): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "slothing-"));
  try {
    for (const [name, content] of Object.entries(files)) await writeFile(join(dir, name), content);
    await new Promise<void>((resolve, reject) => {
      const child = spawn(bin, args, { cwd: dir });
      let log = "";
      child.stdout.on("data", (d) => (log += d));
      child.stderr.on("data", (d) => (log += d));
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error(`${bin} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      child.on("error", (err) => {
        clearTimeout(timer);
        reject(new Error(`Could not start ${bin} (${err.message}). Run \`npm run engines\` in v2/.`));
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        code === 0 ? resolve() : reject(new Error(`${bin} exited ${code}:\n${log.slice(-3000)}`));
      });
    });
    return await readFile(join(dir, output));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
