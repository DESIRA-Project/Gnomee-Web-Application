export function getUrl(protocol: string, host: string, port: string, endpoint: string): string {
  return protocol + '://' + host + (port !== '' ? ':' + port : '') + '/' + endpoint;
}
