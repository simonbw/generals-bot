// @flow

export function padLeft(s: any, pad: string): string {
  return (pad + s).slice(-pad.length);
}
