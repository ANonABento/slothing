export function isCloudBuild(): boolean {
  return process.env.SLOTHING_CLOUD === "1";
}
