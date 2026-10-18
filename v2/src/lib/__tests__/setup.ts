import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

// Each test file gets its own database, so parallel files never wait on (or race) each other's locks.
process.env.SLOTHING_DATA_DIR = mkdtempSync(join(tmpdir(), "slothing-test-"));
