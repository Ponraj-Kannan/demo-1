<script setup>
import { ref, computed, watch } from 'vue'

// ── Props ─────────────────────────────────────────────────────────────────────
// ── Built-in code library (avoids template literal issues in .md files) ─────
const CODE_LIBRARY = {
  helloWorld: [
    'public class Main {',
    '    public static void main(String[] args) {',
    '        System.out.println("Hello, World!");',
    '        System.out.println("This runs inside the slide!");',
    '    }',
    '}'
  ].join('\n'),

  pythonBasics: [
    'x = 10',
    'y = 20',
    'result = x + y',
    'print("Sum =", result)',
    '',
    'nums = [1, 2, 3, 4, 5]',
    'total = 0',
    'for n in nums:',
    '    total += n',
    'print("Total:", total)'
  ].join('\n'),

  dataTypes: [
    'public class Main {',
    '    public static void main(String[] args) {',
    '        int age = 20;',
    '        double gpa = 8.75;',
    "        char grade = 'A';",
    '        boolean isStudent = true;',
    '        String name = "FACEPrep";',
    '',
    '        System.out.println("Name: " + name);',
    '        System.out.println("Age: " + age);',
    '        System.out.println("GPA: " + gpa);',
    '        System.out.println("Grade: " + grade);',
    '        System.out.println("Is Student: " + isStudent);',
    '    }',
    '}'
  ].join('\n'),

  variables: [
    'public class Main {',
    '    public static void main(String[] args) {',
    '        int age = 21;',
    '        double salary = 45000.50;',
    '        String name = "Alice";',
    '        boolean hired = true;',
    '',
    '        System.out.println(name + " is " + age + " years old");',
    '        System.out.println("Salary: " + salary);',
    '        System.out.println("Hired: " + hired);',
    '    }',
    '}'
  ].join('\n')
}

const props = defineProps({
  /** The language to use in OneCompiler. Supported: java, python, cpp */
  language: {
    type: String,
    default: 'java'
  },
  /** Key from CODE_LIBRARY to use as starter code */
  codeKey: {
    type: String,
    default: ''
  },
  /** Direct starter code string (URL-encoded automatically) — use codeKey when possible */
  starterCode: {
    type: String,
    default: ''
  },
  /** Hide the input panel */
  hideStdin: {
    type: Boolean,
    default: false
  },
  /** Title shown in the header bar */
  title: {
    type: String,
    default: ''
  },
  /** Theme: dark | light */
  theme: {
    type: String,
    default: 'light'
  }
})

// Resolved code: codeKey takes priority over starterCode
const resolvedCode = computed(() => {
  if (props.codeKey && CODE_LIBRARY[props.codeKey]) {
    return CODE_LIBRARY[props.codeKey]
  }
  return props.starterCode
})

// ── OneCompiler language IDs ──────────────────────────────────────────────────
// Note: OneCompiler embed uses 'python' not 'python3'
const OC_LANG_MAP = {
  java:    'java',
  python:  'python',
  python3: 'python',
  cpp:     'cpp',
  c:       'c',
  js:      'javascript',
  javascript: 'javascript'
}

// Track the language actively selected in OneCompiler
const activeLang = ref(props.language)

const ocLang = computed(() => OC_LANG_MAP[props.language] || props.language)

// Supported languages in Python Tutor
const ptLang = computed(() => {
  const lang = activeLang.value.toLowerCase()
  if (lang === 'python' || lang === 'python3') return '3'
  if (lang === 'java') return 'java'
  if (lang === 'cpp' || lang === 'c++') return 'cpp'
  if (lang === 'c') return 'c'
  if (lang === 'js' || lang === 'javascript') return 'js'
  if (lang === 'ruby') return 'ruby'
  return null
})

const isVisualizerSupported = computed(() => ptLang.value !== null)

const langLabel = computed(() => {
  const l = activeLang.value
  return l.charAt(0).toUpperCase() + l.slice(1)
})

// ── OneCompiler iframe URL ────────────────────────────────────────────────────
// OneCompiler supports an iframe embed with a `?theme=` and `?hideNewFileOption=` param.
// Code can be pre-filled via the `?code=` query param (URL-encoded).
const oneCompilerUrl = computed(() => {
  const base = `https://onecompiler.com/embed/${ocLang.value}`
  const params = new URLSearchParams({
    theme: props.theme,
    hideNewFileOption: 'false',
    hideStdin: props.hideStdin ? 'true' : 'false',
    hideTitle: 'true',
    listenToEvents: 'true',
    codeChangeEvent: 'true',
  })
  if (resolvedCode.value) {
    params.set('code', resolvedCode.value)
  }
  return `${base}?${params.toString()}`
})

// ── Python Tutor Visualizer ───────────────────────────────────────────────────
const showVisualizer = ref(false)
const visualizerCode = ref(resolvedCode.value)
const visualizerStdin = ref('')
const ocFrameRef = ref(null)

// Listen for postMessage from OneCompiler iframe so we can grab the latest code and stdin
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (!event.data) return

    // Ignore Vue devtools or other non-OneCompiler messages safely
    if (event.data.source === 'vue-devtools-proxy') return

    // Ensure the message came from OUR iframe, not another slide's OneCompiler instance
    if (ocFrameRef.value && event.source !== ocFrameRef.value.contentWindow) return

    // Update active language from the editor
    if (event.data.language && typeof event.data.language === 'string') {
      activeLang.value = event.data.language
    }
    
    // Extract code: aggressively look for the code payload in various OneCompiler formats
    if (event.data.files && Array.isArray(event.data.files) && event.data.files.length > 0 && event.data.files[0].content !== undefined) {
      visualizerCode.value = event.data.files[0].content || visualizerCode.value
    } else if (typeof event.data.code === 'string') {
      visualizerCode.value = event.data.code || visualizerCode.value
    } else if (typeof event.data.data === 'string' && event.data.type !== 'result') {
      visualizerCode.value = event.data.data || visualizerCode.value
    }

    // Extract stdin if present in the payload
    if (typeof event.data.stdin === 'string') {
      visualizerStdin.value = event.data.stdin
    }
  })
}

const visualizerUrl = computed(() => {
  if (!ptLang.value) return ''
  const encodedCode = encodeURIComponent(visualizerCode.value || resolvedCode.value || '')
  // PT expects a JSON-stringified array of strings for inputs
  const inputLines = visualizerStdin.value ? visualizerStdin.value.split('\n') : []
  const encodedInput = encodeURIComponent(JSON.stringify(inputLines))
  return `https://pythontutor.com/iframe-embed.html#code=${encodedCode}&cumulative=false&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=${ptLang.value}&rawInputLstJSON=${encodedInput}&textReferences=false`
})

const openVisualizer = () => {
  showVisualizer.value = true
}

const showCompiler = ref(false)

const openCompiler = () => {
  showCompiler.value = true;
  showVisualizer.value = false
}
</script>

<template>
  <div class="oc-slide">
    <!-- ── Header bar ─────────────────────────────────────────────────── -->
    <div class="oc-header">
      <div class="oc-header-left">
        <span class="oc-lang-badge">{{ langLabel }}</span>
        <span v-if="title" class="oc-title">{{ title }}</span>
      </div>
      <div class="oc-header-right">
        <button @click="openCompiler" class="oc-pill oc-pill--link">Full Screen</button>
        <button 
          class="oc-pill oc-pill--visualize" 
          :class="{ 'oc-pill--disabled': !isVisualizerSupported }"
          @click="isVisualizerSupported ? openVisualizer() : null" 
          :title="isVisualizerSupported ? 'Visualize with Python Tutor' : 'Visualizer is not available for this programming language'"
        >
          <!-- <svg class="oc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg> -->
          Visualize
        </button>
      </div>
    </div>

    <!-- ── OneCompiler iframe ──────────────────────────────────────────── -->
    <div class="oc-frame-wrap">
      <iframe
        ref="ocFrameRef"
        :src="oneCompilerUrl"
        class="oc-frame"
        frameborder="0"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
        id="compiler-text-area"
      ></iframe>
    </div>

    <!-- ── Python Tutor Modal ─────────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showVisualizer" class="pt-overlay" @click.self="showVisualizer = false" style="z-index: 2;">
        <div class="pt-modal">
          <div class="pt-modal-header">
            <div class="pt-modal-title">
              <svg class="oc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#6366f1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              Memory Visualizer
              <span class="pt-powered">via Python Tutor</span>
            </div>
            <div class="pt-modal-actions">
              <button class="pt-close-btn" @click="showVisualizer = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
                Close
              </button>
            </div>
          </div>
          <iframe :src="visualizerUrl" class="pt-frame" frameborder="0"></iframe>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showCompiler" class="pt-overlay" @click.self="showCompiler = false" style="z-index: 1;">
        <div class="pt-modal">
          <div class="pt-modal-header">
            <div class="pt-modal-title">
              <svg class="oc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#6366f1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              Online Compiler
              <span class="pt-powered">via Faceprep</span>
            </div>
            <div class="pt-modal-actions">
              <button 
                class="oc-pill oc-pill--visualize" 
                :class="{ 'oc-pill--disabled': !isVisualizerSupported }"
                @click="isVisualizerSupported ? openVisualizer() : null" 
                :title="isVisualizerSupported ? 'Visualize with Python Tutor' : 'Visualizer is not available for this programming language'"
              >
                <svg class="oc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Visualize
              </button>
              <button class="pt-close-btn" @click="showCompiler = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
                Close
              </button>
            </div>
          </div>
          <iframe style="height:100%;"
        ref="ocFrameRef"
        :src="oneCompilerUrl"
        class="oc-frame"
        frameborder="0"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
      ></iframe>
        </div>
      </div>
    </Teleport>
    
  </div>
</template>

<style scoped>
/* ── Container ───────────────────────────────────────────────────────── */
.oc-slide {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  flex: 1 1 auto;
  border-radius: 5px;
  overflow: hidden;
}

/* ── Header bar ──────────────────────────────────────────────────────── */
.oc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  
  background: rgba(2, 6, 23, 0.85);
  flex-shrink: 0;
  gap: 10px;
}

.oc-header-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.oc-header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  
}

.oc-lang-badge {
  color: #fcfcfc;
  border-radius: 4px;
  padding: 1px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-left: 2px;
}

.oc-title {
  font-size: 0.82rem;
  color: #fcfcfc;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* ── Pills (shared button/link style) ───────────────────────────────── */
.oc-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.oc-pill--visualize {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 2px 8px rgba(99,102,241,0.35);
}
.oc-pill--visualize:hover {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99,102,241,0.45);
}

.oc-pill--link {
  background: rgba(255,255,255,0.07);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,0.12);
}
.oc-pill--link:hover {
  background: rgba(255,255,255,0.12);
  color: #e2e8f0;
  transform: translateY(-1px);
}

.oc-pill--disabled {
  background: #334155 !important;
  color: #64748b !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  transform: none !important;
}

.oc-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}


/* ── OneCompiler frame ───────────────────────────────────────────────── */
.oc-frame-wrap {
  /* flex: 1;
  overflow: hidden;
  background: #ffffff;
  width: 100%;
  height: 100%; */
  width: 100%;
  min-height: 230px;
  background-color: palegoldenrod;
}

.oc-frame {
  width: 100%;
  /* display: block; */
  border: none;
  min-height: 330px;
  zoom: .7;
}

/* ── Python Tutor Modal Overlay ──────────────────────────────────────── */
.pt-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pt-modal {
  width: 96vw;
  height: 95vh;
  max-width: 1200px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2);
}

.pt-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-bottom: 1px solid #334155;
  flex-shrink: 0;
  gap: 12px;
}

.pt-modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #e2e8f0;
}

.pt-powered {
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748b;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 1px 7px;
  margin-left: 4px;
}

.pt-modal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pt-notice {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(245,158,11,0.08);
  border-bottom: 1px solid rgba(245,158,11,0.2);
  font-size: 0.73rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.pt-close-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}
.pt-close-btn:hover {
  background: #dc2626;
}

.pt-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: white;
}
</style>
