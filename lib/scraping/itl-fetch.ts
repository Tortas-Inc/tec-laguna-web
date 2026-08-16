export function itlCookieHeader(sessionId: string): string {
  return `ASP.NET_SessionId=${sessionId};`;
}
