function browserName(userAgent: string): { name: string; version?: string } {
  const edge = userAgent.match(/Edg\/(\d+)/);
  if (edge) return { name: "Edge", version: edge[1] };

  const opera = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
  if (opera) return { name: "Opera", version: opera[1] };

  const firefox = userAgent.match(/Firefox\/(\d+)/);
  if (firefox) return { name: "Firefox", version: firefox[1] };

  const chrome = userAgent.match(/Chrome\/(\d+)/);
  if (chrome) return { name: "Chrome", version: chrome[1] };

  const safari = userAgent.match(/Version\/(\d+).+Safari/);
  if (safari) return { name: "Safari", version: safari[1] };

  return { name: "Unknown browser" };
}

function osName(userAgent: string): string {
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Mac OS X|Macintosh/.test(userAgent)) return "macOS";
  if (/Windows NT/.test(userAgent)) return "Windows";
  if (/Linux/.test(userAgent)) return "Linux";
  return "Unknown OS";
}

export function parseDeviceName(userAgent: string): string {
  const browser = browserName(userAgent);
  const os = osName(userAgent);
  const browserLabel = browser.version
    ? `${browser.name} ${browser.version}`
    : browser.name;

  return `${browserLabel} on ${os}`;
}
