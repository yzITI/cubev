const parser = new DOMParser()

export function parse (str) {
  const doc = parser.parseFromString(str, 'text/html')
  const tpls = doc.querySelectorAll('template')
  const res = {}
  for (const t of tpls) {
    const k = t.attributes && t.attributes[0] && t.attributes[0].name
    if (!k) continue
    res[k] = t.innerHTML.trim()
  }
  return res
}

export async function load (url) {
  try {
    const str = await fetch(url).then(resp => resp.text())
    return parse(str)
  } catch (e) {
    console.error(e)
    return false
  }
}