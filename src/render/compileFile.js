import { shouldTransformRef, transformRef } from './compilerLoader.js'
import * as SFCCompiler from './compilerLoader.js'
import sha256 from 'crypto-js/sha256'
import Hex from 'crypto-js/enc-hex'

const COMP_IDENTIFIER = `__sfc__`

async function transformTS(src) {
  return (await import('sucrase')).transform(src, {
    transforms: ['typescript']
  }).code
}

export default async function (filename, store) {
  let code = store.files[filename]
  if (!store.compiled[filename]) store.compiled[filename] = { js: '', css: '' }
  if (!code || !code.trim()) {
    store.errors = []
    return
  }

  if (!filename.endsWith('.vue')) {
    if (shouldTransformRef(code)) code = transformRef(code, { filename }).code
    if (filename.endsWith('.ts')) code = await transformTS(code)
    store.compiled[filename].js = code
    store.errors = []
    return
  }

  const id = Hex.stringify(sha256(filename)).substr(0, 8)
  const { errors, descriptor } = SFCCompiler.parse(code, { filename, sourceMap: true })
  if (errors.length) {
    store.errors = errors
    return
  }

  if (
    descriptor.styles.some(s => s.lang) ||
    (descriptor.template && descriptor.template.lang)
  ) {
    store.errors = [`lang="x" pre-processors for <template> or <style> are currently not supported.`]
    return
  }

  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang)
  if (scriptLang && scriptLang !== 'ts') {
    store.errors = [`Only lang="ts" is supported for <script> blocks.`]
    return
  }

  const hasScoped = descriptor.styles.some(s => s.scoped)
  let clientCode = ''

  const clientScriptResult = await doCompileScript(descriptor, id, store)
  if (!clientScriptResult) return
  const [clientScript, bindings] = clientScriptResult
  clientCode += clientScript

  // template
  // only need dedicated compilation if not using <script setup>
  if (descriptor.template && !descriptor.scriptSetup) {
    const clientTemplateResult = doCompileTemplate(descriptor, id, bindings, store)
    if (!clientTemplateResult) return
    clientCode += clientTemplateResult
  }

  if (hasScoped) clientCode += `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`

  if (clientCode) {
    clientCode += `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}\nexport default ${COMP_IDENTIFIER}`
    store.compiled[filename].js = clientCode.trimStart()
  }

  // styles
  let css = ''
  for (const style of descriptor.styles) {
    if (style.module) {
      store.errors = [`<style module> is not supported in the playground.`]
      return
    }

    const styleResult = await SFCCompiler.compileStyleAsync({
      source: style.content,
      filename, id,
      scoped: style.scoped,
      modules: !!style.module
    })
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) store.errors = styleResult.errors
      // proceed even if css compile errors
    } else css += styleResult.code + '\n'
  }
  if (css) store.compiled[filename].css = css.trim()
  else store.compiled[filename].css = '/* No <style> tags present */'
  // clear errors
  store.errors = []
}

async function doCompileScript(descriptor, id, store) {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const compiledScript = SFCCompiler.compileScript(descriptor, {
        id,
        refTransform: true,
        inlineTemplate: true
      })
      let code = ''
      if (compiledScript.bindings) {
        code += `\n/* Analyzed bindings: ${JSON.stringify(compiledScript.bindings, null, 2)} */`
      }
      code += '\n' + SFCCompiler.rewriteDefault(compiledScript.content, COMP_IDENTIFIER)

      if ((descriptor.script || descriptor.scriptSetup).lang === 'ts') code = await transformTS(code)

      return [code, compiledScript.bindings]
    } catch (e) {
      store.errors = [e.stack.split('\n').slice(0, 12).join('\n')]
      return
    }
  } else return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined]
}

function doCompileTemplate(descriptor, id, bindingMetadata, store) {
  const templateResult = SFCCompiler.compileTemplate({
    source: descriptor.template.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some(s => s.scoped),
    slotted: descriptor.slotted,
    isProd: false,
    compilerOptions: { bindingMetadata }
  })
  if (templateResult.errors.length) {
    store.errors = templateResult.errors
    return
  }

  const fnName = `render`
  return `\n${templateResult.code.replace(/\nexport (function|const) (render)/, `$1 ${fnName}`)}\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`
}
