import { randomBytes } from "crypto";

export const newId = (prefix: string) => `${prefix}_${randomBytes(6).toString("hex")}`;
