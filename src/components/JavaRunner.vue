<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, markRaw } from 'vue'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

if (typeof window !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker(_, label) {
      return new EditorWorker()
    }
  }
}

// Full list from OneCompiler API
const ALL_LANGUAGES = [
  {"id":"python","name":"Python","languageType":"programming"},{"id":"java","name":"Java","languageType":"programming"},
  {"id":"c","name":"C","languageType":"programming"},{"id":"cpp","name":"C++","languageType":"programming"},
  {"id":"javascript","name":"JavaScript","languageType":"programming"},{"id":"lua","name":"Lua","languageType":"programming"},
  {"id":"php","name":"PHP","languageType":"programming"},{"id":"nodejs","name":"NodeJS","languageType":"programming"},
  {"id":"csharp","name":"C#","languageType":"programming"},{"id":"assembly","name":"Assembly","languageType":"programming"},
  {"id":"bash","name":"Bash","languageType":"programming"},{"id":"vb","name":"Visual Basic (VB.NET)","languageType":"programming"},
  {"id":"kotlin","name":"Kotlin","languageType":"programming"},{"id":"pascal","name":"Pascal","languageType":"programming"},
  {"id":"ruby","name":"Ruby","languageType":"programming"},{"id":"groovy","name":"Groovy","languageType":"programming"},
  {"id":"scala","name":"Scala","languageType":"programming"},{"id":"prolog","name":"Prolog","languageType":"programming"},
  {"id":"tcl","name":"Tcl","languageType":"programming"},{"id":"typescript","name":"TypeScript","languageType":"programming"},
  {"id":"jshell","name":"JShell","languageType":"programming"},{"id":"haskell","name":"Haskell","languageType":"programming"},
  {"id":"ada","name":"Ada","languageType":"programming"},{"id":"commonlisp","name":"CommonLisp","languageType":"programming"},
  {"id":"d","name":"D","languageType":"programming"},{"id":"elixir","name":"Elixir","languageType":"programming"},
  {"id":"erlang","name":"Erlang","languageType":"programming"},{"id":"fsharp","name":"F#","languageType":"programming"},
  {"id":"fortran","name":"Fortran","languageType":"programming"},{"id":"python2","name":"Python2","languageType":"programming"},
  {"id":"perl","name":"Perl","languageType":"programming"},{"id":"go","name":"Go","languageType":"programming"},
  {"id":"r","name":"R","languageType":"programming"},{"id":"racket","name":"Racket","languageType":"programming"},
  {"id":"ocaml","name":"OCaml","languageType":"programming"},{"id":"basic","name":"Basic","languageType":"programming"},
  {"id":"sh","name":"sh (Shell Script)","languageType":"programming"},{"id":"clojure","name":"Clojure","languageType":"programming"},
  {"id":"cobol","name":"Cobol","languageType":"programming"},{"id":"rust","name":"Rust","languageType":"programming"},
  {"id":"swift","name":"Swift","languageType":"programming"},{"id":"objectivec","name":"Objective-C","languageType":"programming"},
  {"id":"octave","name":"Octave","languageType":"programming"},{"id":"text","name":"Text","languageType":"programming"},
  {"id":"brainfk","name":"BrainFK","languageType":"programming"},{"id":"coffeescript","name":"CoffeeScript","languageType":"programming"},
  {"id":"ejs","name":"EJS","languageType":"programming"},{"id":"dart","name":"Dart","languageType":"programming"},
  {"id":"deno","name":"Deno","languageType":"programming"},{"id":"bun","name":"Bun","languageType":"programming"},
  {"id":"crystal","name":"Crystal","languageType":"programming"},{"id":"julia","name":"Julia","languageType":"programming"},
  {"id":"zig","name":"Zig","languageType":"programming"},{"id":"awk","name":"AWK","languageType":"programming"},
  {"id":"ispc","name":"ISPC","languageType":"programming"},{"id":"smalltalk","name":"Smalltalk","languageType":"programming"},
  {"id":"nim","name":"Nim","languageType":"programming"},{"id":"scheme","name":"Scheme","languageType":"programming"},
  {"id":"j","name":"J","languageType":"programming"},{"id":"v","name":"V","languageType":"programming"},
  {"id":"raku","name":"Raku","languageType":"programming"},{"id":"verilog","name":"Verilog","languageType":"programming"},
  {"id":"haxe","name":"Haxe","languageType":"programming"},{"id":"forth","name":"Forth","languageType":"programming"},
  {"id":"icon","name":"Icon","languageType":"programming"},{"id":"odin","name":"Odin","languageType":"programming"},
  {"id":"mysql","name":"MySQL","languageType":"database"},{"id":"oracle","name":"Oracle Database","languageType":"database"},
  {"id":"postgresql","name":"PostgreSQL","languageType":"database"},{"id":"mongodb","name":"MongoDB","languageType":"database"},
  {"id":"sqlite","name":"SQLite","languageType":"database"},{"id":"redis","name":"Redis","languageType":"database"},
  {"id":"mariadb","name":"MariaDB","languageType":"database"},{"id":"plsql","name":"Oracle PL/SQL","languageType":"database"},
  {"id":"sqlserver","name":"Microsoft SQL Server","languageType":"database"},{"id":"cassandra","name":"Cassandra","languageType":"database"},
  {"id":"questdb","name":"QuestDB","languageType":"database"},{"id":"duckdb","name":"DuckDB","languageType":"database"},
  {"id":"surrealdb","name":"SurrealDB","languageType":"database"},{"id":"firebird","name":"Firebird","languageType":"database"},
  {"id":"clickhouse","name":"ClickHouse","languageType":"database"}
]

const groupedLanguages = computed(() => {
  const groups = {}
  for (const lang of ALL_LANGUAGES) {
    if (!groups[lang.languageType]) groups[lang.languageType] = []
    groups[lang.languageType].push(lang)
  }
  return groups
})

// ─── Language / file helpers ─────────────────────────────────────────────────

function getMonacoLanguage(ocId) {
  const map = {
    python: 'python', python2: 'python', java: 'java', c: 'c', cpp: 'cpp',
    javascript: 'javascript', nodejs: 'javascript', deno: 'javascript', bun: 'javascript',
    typescript: 'typescript', csharp: 'csharp', ruby: 'ruby', go: 'go', php: 'php',
    rust: 'rust', swift: 'swift', bash: 'shell', sh: 'shell', lua: 'lua', r: 'r',
    sqlserver: 'sql', mysql: 'sql', postgresql: 'sql', sqlite: 'sql', mariadb: 'sql',
    oracle: 'sql', plsql: 'sql'
  }
  return map[ocId] || 'plaintext'
}

function getExtension(ocId) {
  const lang = ALL_LANGUAGES.find(l => l.id === ocId)
  if (lang?.languageType === 'database') return 'sql'
  const map = {
    python: 'py', python2: 'py', java: 'java', c: 'c', cpp: 'cpp',
    javascript: 'js', nodejs: 'js', deno: 'js', bun: 'js',
    typescript: 'ts', csharp: 'cs', ruby: 'rb', go: 'go', php: 'php',
    rust: 'rs', swift: 'swift', kotlin: 'kt', scala: 'scala', groovy: 'groovy',
    lua: 'lua', r: 'r', bash: 'sh', sh: 'sh', perl: 'pl', haskell: 'hs',
    dart: 'dart', julia: 'jl', zig: 'zig', vb: 'vb', fsharp: 'fs',
    elixir: 'ex', erlang: 'erl', clojure: 'clj', coffeescript: 'coffee',
    crystal: 'cr', nim: 'nim', ocaml: 'ml', racket: 'rkt', scheme: 'scm',
    fortran: 'f90', ada: 'adb', pascal: 'pas', prolog: 'pl', cobol: 'cbl',
    tcl: 'tcl', objectivec: 'm', d: 'd', haxe: 'hx', verilog: 'v',
    assembly: 'asm', octave: 'm', awk: 'awk', jshell: 'jsh', raku: 'raku',
    smalltalk: 'st', icon: 'icn', odin: 'odin', forth: 'fth', text: 'txt'
  }
  return map[ocId] || ocId
}

// Generate unique filename: untitled.py, untitled_2.py, untitled_3.py ...
function getUniqueFileName(ocId) {
  const ext = getExtension(ocId)
  const base = 'untitled'
  const existing = files.value.map(f => f.name)
  const first = `${base}.${ext}`
  if (!existing.includes(first)) return first
  let n = 2
  while (existing.includes(`${base}_${n}.${ext}`)) n++
  return `${base}_${n}.${ext}`
}

// For Java: filename (without .java) becomes the public class name
function getStarterCode(ocId, filename = '') {
  const javaClass = filename ? filename.replace(/\.java$/, '') : 'Main'

  const map = {
    java: `public class ${javaClass} {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    python: 'print("Hello, World!")',
    python2: 'print "Hello, World!"',
    javascript: 'console.log("Hello, World!");',
    nodejs: 'console.log("Hello, World!");',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    typescript: 'const message: string = "Hello, World!";\nconsole.log(message);',
    csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
    ruby: 'puts "Hello, World!"',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    rust: 'fn main() {\n    println!("Hello, World!");\n}',
    php: '<?php\necho "Hello, World!";\n?>',
    kotlin: 'fun main() {\n    println("Hello, World!")\n}',
    swift: 'print("Hello, World!")',
    mysql: '-- Write your MySQL queries here\nSELECT "Hello, World!" AS message;',
    postgresql: '-- Write your PostgreSQL queries here\nSELECT \'Hello, World!\' AS message;',
    sqlite: '-- Write your SQLite queries here\nSELECT "Hello, World!" AS message;',
  }
  return map[ocId] || '// Write your code here'
}

// Max files allowed per language
const MAX_FILES_PER_LANG = 5

// Count how many files exist for a given language extension
function countFilesForLang(ocId) {
  const ext = getExtension(ocId)
  return files.value.filter(f => f.name.endsWith('.' + ext)).length
}

// ─── Props & state ────────────────────────────────────────────────────────────

const props = defineProps({
  initialCode: { type: String, default: '' },
  initialLanguage: { type: String, default: 'python' }
})

const selectedLanguage = ref(props.initialLanguage)

const files = ref([])
const activeFileIndex = ref(0)
const isAddingFile = ref(false)
const newFileName = ref('')
const newFileInputRef = ref(null)
const newFileLang = ref('')

const editingFileIndex = ref(-1)
const editFileName = ref('')
const editFileInputRef = ref(null)

const activeFile = computed(() => files.value[activeFileIndex.value])

// Only show tabs that match the currently selected language extension
const visibleFiles = computed(() => {
  const ext = getExtension(selectedLanguage.value)
  return files.value
    .map((f, i) => ({ ...f, originalIndex: i }))
    .filter(f => f.name.endsWith('.' + ext))
})

// ─── File / tab management ────────────────────────────────────────────────────

const initDefaultFile = () => {
  const lang = selectedLanguage.value
  const name = getUniqueFileName(lang)
  const code = props.initialCode || getStarterCode(lang, name)
  const model = monaco.editor.createModel(code, getMonacoLanguage(lang))
  files.value.push({ name, model: markRaw(model) })
}

const switchTab = (index) => {
  activeFileIndex.value = index
  if (editorInstance) {
    editorInstance.setModel(files.value[index].model)
  }
}

// When language selector changes, switch to the first visible file for that language
// or stay if current file already matches
const onLanguageChange = (e) => {
  const lang = e.target.value
  selectedLanguage.value = lang

  const ext = getExtension(lang)
  const match = files.value.findIndex(f => f.name.endsWith('.' + ext))

  if (match !== -1) {
    switchTab(match)
  } else {
    // No file exists for this language yet — create one automatically
    const name = getUniqueFileName(lang)
    const code = getStarterCode(lang, name)
    const model = monaco.editor.createModel(code, getMonacoLanguage(lang))
    files.value.push({ name, model: markRaw(model) })
    switchTab(files.value.length - 1)
  }
}

const startAddFile = () => {

  if (countFilesForLang(selectedLanguage.value) >= MAX_FILES_PER_LANG) {
    alert(`You can only have up to ${MAX_FILES_PER_LANG} files per language.`)
    return
  }
  isAddingFile.value = true
  newFileLang.value = selectedLanguage.value
  newFileName.value = getUniqueFileName(selectedLanguage.value)
  nextTick(() => {
    newFileInputRef.value?.focus()
    newFileInputRef.value?.select()
  })
}

const onNewFileLangChange = () => {
  newFileName.value = getUniqueFileName(newFileLang.value)
  nextTick(() => {
    newFileInputRef.value?.focus()
    newFileInputRef.value?.select()
  })
}

const confirmAddFile = () => {
  if (!newFileName.value.trim()) {
    isAddingFile.value = false
    return
  }
  // Check limit for the chosen language before actually creating the file
  if (countFilesForLang(newFileLang.value) >= MAX_FILES_PER_LANG) {
    alert(`You can only have up to ${MAX_FILES_PER_LANG} files per language.`)
    isAddingFile.value = false
    return
  }
  const name = newFileName.value.trim()
  const lang = newFileLang.value
  const code = getStarterCode(lang, name)
  const model = monaco.editor.createModel(code, getMonacoLanguage(lang))
  files.value.push({ name, model: markRaw(model) })
  selectedLanguage.value = lang
  isAddingFile.value = false
  switchTab(files.value.length - 1)
}

const cancelAddFile = () => {
  isAddingFile.value = false
}

const deleteFile = (index) => {
  if (files.value.length <= 1) {
    alert("You must have at least one file.")
    return
  }
  files.value[index].model.dispose()
  files.value.splice(index, 1)
  if (activeFileIndex.value >= files.value.length) {
    switchTab(files.value.length - 1)
  } else if (activeFileIndex.value === index) {
    switchTab(activeFileIndex.value)
  } else if (activeFileIndex.value > index) {
    activeFileIndex.value--
  }
}

const startRenameFile = (index) => {
  editingFileIndex.value = index
  editFileName.value = files.value[index].name
  nextTick(() => {
    if (editFileInputRef.value?.[0]) editFileInputRef.value[0].focus()
  })
}

const confirmRenameFile = (index) => {
  if (editFileName.value.trim()) {
    const newName = editFileName.value.trim()
    files.value[index].name = newName
    // If Java, update the class name in the model content
    if (selectedLanguage.value === 'java') {
      const currentCode = files.value[index].model.getValue()
      const javaClass = newName.replace(/\.java$/, '')
      const updated = currentCode.replace(/public class \w+/, `public class ${javaClass}`)
      files.value[index].model.setValue(updated)
    }
  }
  editingFileIndex.value = -1
}

const cancelRenameFile = () => {
  editingFileIndex.value = -1
}

// ─── Editor ───────────────────────────────────────────────────────────────────

const editorContainer = ref(null)
const input = ref('')
const output = ref('')
const isRunning = ref(false)
const isError = ref(false)
const executionStats = ref(null)

let editorInstance = null

const showVisualizer = ref(false)
const visualizerUrl = ref('')

const VISUALIZER_LANG_MAP = {
  java: 'java', python: '3', cpp: 'cpp', c: 'c', javascript: 'javascript', ruby: 'ruby'
}

const canVisualize = computed(() => !!VISUALIZER_LANG_MAP[selectedLanguage.value])

const visualizeCode = () => {
  if (!editorInstance || !activeFile.value) return
  const code = activeFile.value.model.getValue()
  const pyLang = VISUALIZER_LANG_MAP[selectedLanguage.value]
  const encodedCode = encodeURIComponent(code)
  const stdinLines = input.value ? input.value.split('\n').filter(l => l !== '') : []
  const rawInputJson = encodeURIComponent(JSON.stringify(stdinLines))
  visualizerUrl.value = `https://pythontutor.com/iframe-embed.html#code=${encodedCode}&cumulative=false&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=${pyLang}&rawInputLstJSON=${rawInputJson}&textReferences=false`
  showVisualizer.value = true
}

onMounted(() => {
  nextTick(() => {
    if (editorContainer.value) {
      initDefaultFile()
      editorInstance = monaco.editor.create(editorContainer.value, {
        model: files.value[0].model,
        language: getMonacoLanguage(selectedLanguage.value),
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        padding: { top: 12, bottom: 12 }
      })

      const trapKeys = (e) => e.stopPropagation()
      editorContainer.value.addEventListener('keydown', trapKeys, false)
      editorContainer.value.addEventListener('keyup', trapKeys, false)

      const updateHeight = () => {
        if (!editorInstance) return
        const contentHeight = Math.max(150, editorInstance.getContentHeight())
        editorContainer.value.style.height = `${contentHeight}px`
        editorInstance.layout()
      }
      editorInstance.onDidContentSizeChange(updateHeight)
      setTimeout(updateHeight, 100)
    }
  })
})

onUnmounted(() => {
  files.value.forEach(f => f.model.dispose())
  if (editorInstance) editorInstance.dispose()
})

// ─── Editor settings ──────────────────────────────────────────────────────────

const editorTheme = ref('vs-dark')
const fontSize = ref(14)
const wordWrap = ref('off')

const toggleTheme = () => {
  editorTheme.value = editorTheme.value === 'vs-dark' ? 'vs' : 'vs-dark'
  monaco.editor.setTheme(editorTheme.value)
}

const changeFontSize = (delta) => {
  fontSize.value = Math.max(10, Math.min(32, fontSize.value + delta))
  if (editorInstance) editorInstance.updateOptions({ fontSize: fontSize.value })
  setTimeout(() => { if (editorInstance) editorInstance.layout() }, 50)
}

const toggleWordWrap = () => {
  wordWrap.value = wordWrap.value === 'off' ? 'on' : 'off'
  if (editorInstance) editorInstance.updateOptions({ wordWrap: wordWrap.value })
}

const resetCode = () => {
  if (editorInstance && confirm('Reset your workspace? This will delete all files and reset to the starter template.')) {
    files.value.forEach(f => f.model.dispose())
    files.value = []
    initDefaultFile()
    switchTab(0)
    output.value = ''
    isError.value = false
    executionStats.value = null
    showVisualizer.value = false
  }
}

// ─── Execution ────────────────────────────────────────────────────────────────

const executeCode = async () => {
  if (!editorInstance) return
  isRunning.value = true
  isError.value = false
  executionStats.value = null
  output.value = 'Executing...'

  try {
    const activeIdx = activeFileIndex.value
    const orderedFiles = [
      files.value[activeIdx],
      ...files.value.filter((_, i) => i !== activeIdx)
    ]

    const payload = {
      language: selectedLanguage.value,
      stdin: input.value,
      files: orderedFiles.map(f => ({
        name: f.name,
        content: f.model.getValue()
      }))
    }

    console.log(payload)

    const res = await fetch('/api/oc-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok || data.status === 'failed') {
      isError.value = true
      output.value = data.error || data.message || 'Execution failed.'
      return
    }

    let finalOutput = ''
    if (data.stdout) finalOutput += data.stdout
    if (data.stderr) finalOutput += '\n[STDERR]:\n' + data.stderr
    if (data.exception) finalOutput += '\n[EXCEPTION]:\n' + data.exception

    output.value = finalOutput || '(No output)'
    isError.value = !!(data.stderr || data.exception)
    executionStats.value = {
      executionTime: data.executionTime,
      memoryUsed: data.memoryUsed,
      limitRemaining: data.limitRemaining
    }
  } catch (err) {
    isError.value = true
    output.value = err.message
  } finally {
    isRunning.value = false
  }
}
</script>

<template>
  <div class="java-runner">
    <div class="editor-wrapper">
      <div class="mac-header">
        <div class="header-right">

          <div>
            <div class="tab add-tab">
              <div v-if="isAddingFile" class="tab-edit add-file-form">
                <select v-model="newFileLang" @change="onNewFileLangChange" class="new-file-lang-dropdown">
                  <optgroup v-for="(languages, type) in groupedLanguages" :key="type" :label="type.toUpperCase()">
                    <option v-for="lang in languages" :key="lang.id" :value="lang.id">
                      {{ lang.name }}
                    </option>
                  </optgroup>
                </select>
                <input
                  ref="newFileInputRef"
                  v-model="newFileName"
                  placeholder="filename.ext"
                  @keyup.enter="confirmAddFile"
                  @keyup.esc="cancelAddFile"
                />
                <button class="icon-btn check-btn" @click.stop="confirmAddFile"><div class="i-lucide-check"></div></button>
                <button class="icon-btn close-btn" @click.stop="cancelAddFile"><div class="i-lucide-x"></div></button>
              </div>
              <div v-else class="add-btn" @click="startAddFile" title="Add File">
                <div class="i-lucide-plus"></div>
              </div>
            </div>
          </div>
          
          <div class="toolbar">
            <button class="icon-btn" @click="resetCode" title="Reset Code">
              <div class="i-lucide-rotate-ccw"></div>
            </button>
            <button class="icon-btn" @click="toggleTheme" title="Toggle Theme">
              <div v-if="editorTheme === 'vs-dark'" class="i-lucide-sun"></div>
              <div v-else class="i-lucide-moon"></div>
            </button>
            <button class="icon-btn" @click="changeFontSize(-1)" title="Decrease Font">
              <div class="i-lucide-minus"></div>
            </button>
            <button class="icon-btn" @click="changeFontSize(1)" title="Increase Font">
              <div class="i-lucide-plus"></div>
            </button>
            <!-- <button class="icon-btn" @click="toggleWordWrap" :class="{ 'wrap-active': wordWrap === 'on' }" title="Toggle Word Wrap">
              <div class="i-lucide-wrap-text"></div>
            </button> -->
          </div>

          <div class="lang-selector">
            <select :value="selectedLanguage" @change="onLanguageChange" class="lang-dropdown" :disabled="isRunning">
              <optgroup v-for="(languages, type) in groupedLanguages" :key="type" :label="type.toUpperCase()">
                <option v-for="lang in languages" :key="lang.id" :value="lang.id">
                  {{ lang.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <button v-if="canVisualize" @click="visualizeCode" :disabled="isRunning" class="visualize-btn">
            <div class="i-lucide-eye"></div> Visualize
          </button>

          <button @click="executeCode" :disabled="isRunning" class="run-btn" :class="{ running: isRunning }">
            <div v-if="isRunning" class="i-lucide-loader-2 animate-spin"></div>
            <div v-else class="i-lucide-play"></div>
            {{ isRunning ? 'Running' : 'Run Code' }}
          </button>
        </div>
      </div>

      <!-- File tabs — only show files matching the selected language -->
      <div class="file-tabs">
        <div
          v-for="file in visibleFiles"
          :key="file.originalIndex"
          class="tab"
          :class="{ active: activeFileIndex === file.originalIndex }"
          @click="switchTab(file.originalIndex)"
          @dblclick="startRenameFile(file.originalIndex)"
        >
          <!-- Inline rename input -->
          <div v-if="editingFileIndex === file.originalIndex" class="tab-edit">
            <input
              ref="editFileInputRef"
              v-model="editFileName"
              @keyup.enter="confirmRenameFile(file.originalIndex)"
              @keyup.esc="cancelRenameFile"
              @blur="confirmRenameFile(file.originalIndex)"
            />
          </div>
          <div v-else class="tab-content">
            <span class="tab-name">{{ file.name }}</span>
            <span class="tab-close" @click.stop="deleteFile(file.originalIndex)">&times;</span>
          </div>
        </div>

        <!-- Add file button / inline form -->
        <!-- --------------------------------------------------------------------- -->
      </div>

      <div ref="editorContainer" class="editor-container"></div>
    </div>

    <div class="io-panels">
      <div class="pane input-pane">
        <label>Standard Input</label>
        <textarea v-model="input" placeholder="Inputs for your code..."></textarea>
      </div>
      <div class="pane output-pane">
        <div class="output-header">
          <label>Console Output</label>
        </div>
        <pre :class="{ error: isError }">{{ output }}</pre>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showVisualizer" class="modal-overlay" @click.self="showVisualizer = false">
        <div class="visualizer-pane modal-content">
          <div class="visualizer-header">
            <label>Memory Visualizer</label>
            <button @click="showVisualizer = false" class="close-btn">
              <div class="i-lucide-x"></div> Close
            </button>
          </div>
          <iframe :src="visualizerUrl" width="100%" style="flex: 1" frameborder="0"></iframe>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.java-runner {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 10px;
}

.editor-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #cbd5e1;
  border-radius: 5px 5px 0px 0px;
}

.mac-header {
  width: 100%;
  border-radius: 5px 5px 0px 0px;
  background-color: #537D96;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 12px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.dot.red    { background: #FF5F57; }
.dot.yellow { background: #FEBC2E; }
.dot.green  { background: #28C840; }

.filename {
  font-family: 'JetBrains Mono', monospace;
  color: #fcfcfc;
  font-weight: 600;
}

.editor-container {
  width: 100%;
}

.io-panels {
  display: flex;
  gap: 1rem;
}

.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-pane, .output-pane {
  margin-top: 10px;
}

.pane label {
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pane textarea,
.pane pre {
  width: 100%;
  min-height: 90px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.5;
  color: #0f172a;
  resize: vertical;
}

.pane textarea:focus {
  outline: none;
  border-color: #FF5A5A;
}

.pane pre.error {
  background: #ff5a5a56;
  border-color: #FF5A5A;
  color: #832f2f;
}

.run-btn {
  background: #ff5a5adf;
  color: white;
  border: none;
  min-width: 84px;
  padding: 0.3rem 0.1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.2s ease;
}

.run-btn:disabled,
.visualize-btn:disabled {
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.visualize-btn {
  background: #475569;
  color: white;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.2s ease;
}

.visualizer-pane {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.modal-content {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.visualizer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
}

.close-btn {
  background: #FF5A5A;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.6rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background 0.15s ease;
}

.lang-selector {
  display: flex;
  gap: 2px;
  background: #e2e8f0;
  border-radius: 6px;
  padding: 2px;
  flex-shrink: 0;
}

.lang-dropdown,
.new-file-lang-dropdown {
  background: #e2e8f0;
  border: none;
  border-radius: 4px;
  padding: 3px 3px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  font-size: 10px;
  width: 70px;
}

.toolbar {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.icon-btn {
  background: #e2e8f0;
  border: none;
  padding: 0.4rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-btn:hover {
  background: rgb(188, 192, 196);
  color: #334155;
}

.icon-btn.wrap-active {
  background: #cbd5e1;
  color: #ff5900;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

/* File tabs */
.file-tabs {
  width: 100%;
  min-height: 28px;

  display: flex;
  flex-direction: row;
  background: #537d96;
  overflow-x: auto;
  flex-wrap: nowrap;
}

.tab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 80px;
  background: rgba(0, 0, 0, 0.249);
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  transition: background 0.1s ease;
  user-select: none;
  color: #ffffff;
  min-height: 28px;
}

.tab.active {
  background: rgba(0, 0, 0, 0.653);
  color: #ffffff;
}

.tab-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
}

.tab-name {
  font-size: 11px;
}

.tab-close {
  font-size: 14px;
  color: #fff;
  line-height: 1;
  padding: 0 2px;
  border-radius: 2px;
  transition: color 0.15s, background 0.15s;
}

.tab-close:hover {
  color: #fff;
  background: #FF5A5A;
}

.tab-edit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-edit input {
  background: #3c3c3c;
  border: 1px solid #537D96;
  border-radius: 3px;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 2px 6px;
  width: 100px;
  outline: none;
}

.add-tab {
  min-width: 32px;
  padding: 0 8px;
  background: transparent;
  border-right: none;
  color: #9da5b4;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.15s;
}

.add-btn:hover {
  color: #fff;
}

.add-file-form {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

.check-btn { color: #28C840; }
.close-btn-icon { color: #FF5A5A; }
</style>