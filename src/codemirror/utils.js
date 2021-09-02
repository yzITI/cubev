export function debounce(fn, n = 100) {
  let handle
  return (...args) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => { fn(...args) }, n)
  }
}

// prefer old unicode hacks for backward compatibility
// https://base64.guru/developers/javascript/examples/unicode-strings
export function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)))
}

export function atou(base64) {
  return decodeURIComponent(escape(atob(base64)))
}
