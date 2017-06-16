
export function timeout(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

export function rAF() {
  return new Promise(resolve => window.requestAnimationFrame(resolve));
}
