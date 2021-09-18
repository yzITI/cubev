const parser = new DOMParser()

export default async function ({ url, str }) {
  try {
    if (!str) str = await fetch(url).then(resp => resp.text())
    const doc = parser.parseFromString(str, 'text/html')
    const tpls = doc.querySelectorAll('template')
    const res = {}
    for (const t of tpls) {
      const k = t.attributes && t.attributes[0] && t.attributes[0].name
      if (!k) continue
      res[k] = t.innerHTML.trim()
    }
    return res
  } catch (e) {
    console.error(e)
    return false
  }
}