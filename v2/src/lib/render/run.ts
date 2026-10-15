import { spawn } from "child_process";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export const typstBin = () => join(process.cwd(), ".engines", "typst");

/** Run a command in a throwaway directory holding only `files`; return its stdout and, if named, an output file. */
async function runInTemp(
  files: Record<string, string>,
  bin: string,
  args: string[],
  output: string | null,
  timeoutMs = 60_000,
): Promise<{ stdout: string; file: Buffer | null }> {
  const dir = await mkdtemp(join(tmpdir(), "slothing-"));
  try {
    for (const [name, content] of Object.entries(files)) await writeFile(join(dir, name), content);
    const stdout = await new Promise<string>((resolve, reject) => {
      const child = spawn(bin, args, { cwd: dir });
      let out = "";
      let log = "";
      child.stdout.on("data", (d) => ((out += d), (log += d)));
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
        code === 0 ? resolve(out) : reject(new Error(`${bin} exited ${code}:\n${log.slice(-3000)}`));
      });
    });
    return { stdout, file: output ? await readFile(join(dir, output)) : null };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Compile in a throwaway directory; return the produced file (the PDF). */
export async function compileInTemp(files: Record<string, string>, bin: string, args: string[], output: string, timeoutMs?: number): Promise<Buffer> {
  return (await runInTemp(files, bin, args, output, timeoutMs)).file!;
}

/** Run in a throwaway directory; return stdout (e.g. `typst eval` output). */
export async function evalInTemp(files: Record<string, string>, bin: string, args: string[], timeoutMs?: number): Promise<string> {
  return (await runInTemp(files, bin, args, null, timeoutMs)).stdout;
}
