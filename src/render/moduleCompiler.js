import {
  babelParse,
  MagicString,
  walk,
  walkIdentifiers,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty
} from './sfcCompiler.js'
import { babelParserDefaultPlugins } from '@vue/shared'

const modulesKey = `__modules__`
const exportKey = `__export__`
const dynamicImportKey = `__dynamic_import__`
const moduleKey = `__module__`

export default function (compiled) {
  return processFile('App.vue', compiled).reverse()
}

function processFile(filename, compiled, seen = new Set()) {
  if (seen.has(filename)) return []
  seen.add(filename)

  const { js, css } = compiled[filename]
  const s = new MagicString(js)
  const ast = babelParse(js, {
    sourceFilename: filename,
    sourceType: 'module',
    plugins: [...babelParserDefaultPlugins]
  }).program.body

  const idToImportMap = new Map()
  const declaredConst = new Set()
  const importedFiles = new Set()
  const importToIdMap = new Map()

  function defineImport(node, source) {
    const fn = source.replace(/^\.\/+/, '')
    if (!(fn in compiled) && fn !== 'vue') {
      throw new Error(`File "${fn}" does not exist.`)
    }
    if (importedFiles.has(fn)) return importToIdMap.get(fn)
    importedFiles.add(fn)
    const id = `__import_${importedFiles.size}__`
    importToIdMap.set(fn, id)
    s.appendLeft(
      node.start,
      `const ${id} = ${modulesKey}[${JSON.stringify(fn)}]\n`
    )
    return id
  }

  function defineExport(name, local = name) {
    s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`)
  }

  // 0. instantiate module
  s.prepend(`const ${moduleKey} = __modules__[${JSON.stringify(filename)}] = { [Symbol.toStringTag]: "Module" }\n\n`)

  // 1. check all import statements and record id -> importName map
  for (const node of ast) {
    // import foo from 'foo' --> foo -> __import_foo__.default
    // import { baz } from 'foo' --> baz -> __import_foo__.baz
    // import * as ok from 'foo' --> ok -> __import_foo__
    if (node.type === 'ImportDeclaration') {
      const source = node.source.value
      if (source.startsWith('./') || source == 'vue') {
        const importId = defineImport(node, node.source.value)
        for (const spec of node.specifiers) {
          if (spec.type === 'ImportSpecifier') {
            idToImportMap.set(
              spec.local.name,
              `${importId}.${spec.imported.name}`
            )
          } else if (spec.type === 'ImportDefaultSpecifier') {
            idToImportMap.set(spec.local.name, `${importId}.default`)
          } else {
            // namespace specifier
            idToImportMap.set(spec.local.name, importId)
          }
        }
        s.remove(node.start, node.end)
      }
    }
  }

  // 2. check all export statements and define exports
  for (const node of ast) {
    // named exports
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (
          node.declaration.type === 'FunctionDeclaration' ||
          node.declaration.type === 'ClassDeclaration'
        ) {
          // export function foo() {}
          defineExport(node.declaration.id.name)
        } else if (node.declaration.type === 'VariableDeclaration') {
          // export const foo = 1, bar = 2
          for (const decl of node.declaration.declarations) {
            for (const id of extractIdentifiers(decl.id)) {
              defineExport(id.name)
            }
          }
        }
        s.remove(node.start, node.declaration.start)
      } else if (node.source) {
        // export { foo, bar } from './foo'
        const importId = defineImport(node, node.source.value)
        for (const spec of node.specifiers) {
          defineExport(
            (spec.exported).name,
            `${importId}.${spec.local.name}`
          )
        }
        s.remove(node.start, node.end)
      } else {
        // export { foo, bar }
        for (const spec of node.specifiers) {
          const local = spec.local.name
          const binding = idToImportMap.get(local)
          defineExport((spec.exported).name, binding || local)
        }
        s.remove(node.start, node.end)
      }
    }

    // default export
    if (node.type === 'ExportDefaultDeclaration') {
      if ('id' in node.declaration && node.declaration.id) {
        // named hoistable/class exports
        // export default function foo() {}
        // export default class A {}
        const { name } = node.declaration.id
        s.remove(node.start, node.start + 15)
        s.append(`\n${exportKey}(${moduleKey}, "default", () => ${name})`)
      } else {
        // anonymous default exports
        s.overwrite(node.start, node.start + 14, `${moduleKey}.default =`)
      }
    }

    // export * from './foo'
    if (node.type === 'ExportAllDeclaration') {
      const importId = defineImport(node, node.source.value)
      s.remove(node.start, node.end)
      s.append(`\nfor (const key in ${importId}) {
        if (key !== 'default') {
          ${exportKey}(${moduleKey}, key, () => ${importId}[key])
        }
      }`)
    }
  }

  // 3. convert references to import bindings
  for (const node of ast) {
    if (node.type === 'ImportDeclaration') continue
    walkIdentifiers(node, (id, parent, parentStack) => {
      const binding = idToImportMap.get(id.name)
      if (!binding) return
      if (isStaticProperty(parent) && parent.shorthand) {
        // let binding used in a property shorthand
        // { foo } -> { foo: __import_x__.foo }
        // skip for destructure patterns
        if (
          !parent.inPattern ||
          isInDestructureAssignment(parent, parentStack)
        ) s.appendLeft(id.end, `: ${binding}`)
      } else if (
        parent.type === 'ClassDeclaration' &&
        id === parent.superClass
      ) {
        if (!declaredConst.has(id.name)) {
          declaredConst.add(id.name)
          // locate the top-most node containing the class declaration
          const topNode = parentStack[1]
          s.prependRight(topNode.start, `const ${id.name} = ${binding};\n`)
        }
      } else s.overwrite(id.start, id.end, binding)
    })
  }

  // 4. convert dynamic imports
  ;(walk)(ast, {
    enter(node, parent) {
      if (node.type === 'Import' && parent.type === 'CallExpression') {
        const arg = parent.arguments[0]
        if (arg.type === 'StringLiteral' && arg.value.startsWith('./')) {
          s.overwrite(node.start, node.start + 6, dynamicImportKey)
          s.overwrite(
            arg.start,
            arg.end,
            JSON.stringify(arg.value.replace(/^\.\/+/, ''))
          )
        }
      }
    }
  })

  // append CSS injection code
  if (css) s.append(`\nwindow.__css__ += ${JSON.stringify(css)}`)

  const processed = [s.toString()]
  if (importedFiles.size) {
    for (const imported of importedFiles) {
      if (imported == 'vue') continue
      processed.push(...processFile(imported, compiled, seen))
    }
  }

  // console.log(idToImportMap, declaredConst, importedFiles, importToIdMap)

  // return a list of files to further process
  return processed
}
