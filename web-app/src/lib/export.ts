import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface ExportOptions {
  format: 'zip' | 'files' | 'html' | 'json'
  includeAssets?: boolean
  projectName?: string
  template?: 'vanilla' | 'react' | 'vue' | 'nextjs' | 'vite'
}

export interface CodeData {
  html: string
  css: string
  js: string
  assets?: string[]
  metadata?: {
    title: string
    description: string
    author?: string
    version?: string
  }
}

export class CodeExporter {
  static async exportCode(code: CodeData, options: ExportOptions) {
    const { format, projectName = 'codiner-project', template = 'vanilla' } = options

    switch (format) {
      case 'zip':
        return this.exportAsZip(code, options)
      case 'files':
        return this.exportAsFiles(code, options)
      case 'html':
        return this.exportAsSingleHTML(code, options)
      case 'json':
        return this.exportAsJSON(code, options)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  private static async exportAsZip(code: CodeData, options: ExportOptions) {
    const { projectName = 'codiner-project', template = 'vanilla' } = options
    const zip = new JSZip()

    // Create project structure based on template
    switch (template) {
      case 'vanilla':
        this.createVanillaStructure(zip, code, projectName)
        break
      case 'react':
        this.createReactStructure(zip, code, projectName)
        break
      case 'nextjs':
        this.createNextStructure(zip, code, projectName)
        break
      case 'vite':
        this.createViteStructure(zip, code, projectName)
        break
      default:
        this.createVanillaStructure(zip, code, projectName)
    }

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${projectName}.zip`)

    return { success: true, message: `Project exported as ${projectName}.zip` }
  }

  private static createVanillaStructure(zip: JSZip, code: CodeData, projectName: string) {
    // Main files
    zip.file('index.html', this.generateHTMLFile(code))
    zip.file('styles.css', code.css)
    zip.file('script.js', code.js)

    // Assets
    if (code.assets && code.assets.length > 0) {
      const assetsFolder = zip.folder('assets')
      code.assets.forEach((asset, index) => {
        assetsFolder?.file(`asset-${index + 1}`, asset)
      })
    }

    // Package files
    zip.file('package.json', JSON.stringify({
      name: projectName,
      version: '1.0.0',
      description: code.metadata?.description || 'A project created with Codiner',
      scripts: {
        start: 'python -m http.server 8000',
        dev: 'python -m http.server 8000'
      }
    }, null, 2))

    zip.file('README.md', this.generateReadme(code, projectName))
  }

  private static createReactStructure(zip: JSZip, code: CodeData, projectName: string) {
    const srcFolder = zip.folder('src')
    const publicFolder = zip.folder('public')

    // React component
    srcFolder?.file('App.js', this.convertToReactComponent(code))
    srcFolder?.file('App.css', code.css)
    srcFolder?.file('index.js', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`)

    // Public files
    publicFolder?.file('index.html', `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${code.metadata?.title || 'React App'}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`)

    // Package.json for React
    zip.file('package.json', JSON.stringify({
      name: projectName,
      version: '0.1.0',
      private: true,
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1"
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      }
    }, null, 2))

    zip.file('README.md', this.generateReadme(code, projectName, 'react'))
  }

  private static createNextStructure(zip: JSZip, code: CodeData, projectName: string) {
    const appFolder = zip.folder('app')
    const componentsFolder = zip.folder('app/components')

    // Next.js App Router structure
    appFolder?.file('layout.js', `export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`)
    appFolder?.file('page.js', this.convertToNextPage(code))
    appFolder?.file('globals.css', code.css)

    // Package.json for Next.js
    zip.file('package.json', JSON.stringify({
      name: projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: '14.0.0',
        react: '^18',
        'react-dom': '^18'
      }
    }, null, 2))

    zip.file('README.md', this.generateReadme(code, projectName, 'nextjs'))
  }

  private static createViteStructure(zip: JSZip, code: CodeData, projectName: string) {
    const srcFolder = zip.folder('src')

    // Vite structure
    srcFolder?.file('main.js', `import './style.css'
import ${code.js.includes('export default') ? '{ createApp }' : 'App'} from './App.js'

${code.js.includes('export default') ?
  `const app = createApp(App)
app.mount('#app')` :
  `document.querySelector('#app').innerHTML = App()`
}`)
    srcFolder?.file('App.js', this.convertToViteComponent(code))
    srcFolder?.file('style.css', code.css)

    zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${code.metadata?.title || 'Vite App'}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`)

    zip.file('package.json', JSON.stringify({
      name: projectName,
      type: 'module',
      version: '0.0.0',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      devDependencies: {
        vite: '^5.0.0'
      }
    }, null, 2))

    zip.file('README.md', this.generateReadme(code, projectName, 'vite'))
  }

  private static async exportAsFiles(code: CodeData, options: ExportOptions) {
    const { projectName = 'codiner-project' } = options

    // Download HTML file
    const htmlBlob = new Blob([this.generateHTMLFile(code)], { type: 'text/html' })
    saveAs(htmlBlob, `${projectName}.html`)

    // Download CSS file
    const cssBlob = new Blob([code.css], { type: 'text/css' })
    saveAs(cssBlob, `${projectName}.css`)

    // Download JS file
    const jsBlob = new Blob([code.js], { type: 'application/javascript' })
    saveAs(jsBlob, `${projectName}.js`)

    return { success: true, message: 'Files downloaded individually' }
  }

  private static async exportAsSingleHTML(code: CodeData, options: ExportOptions) {
    const { projectName = 'codiner-project' } = options

    const singleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${code.metadata?.title || projectName}</title>
    <style>${code.css}</style>
</head>
<body>
    ${code.html}
    <script>${code.js}</script>
</body>
</html>`

    const blob = new Blob([singleHTML], { type: 'text/html' })
    saveAs(blob, `${projectName}.html`)

    return { success: true, message: 'Single HTML file downloaded' }
  }

  private static async exportAsJSON(code: CodeData, options: ExportOptions) {
    const { projectName = 'codiner-project' } = options

    const exportData = {
      projectName,
      exportedAt: new Date().toISOString(),
      code,
      template: options.template || 'vanilla',
      version: '1.0.0'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    saveAs(blob, `${projectName}.json`)

    return { success: true, message: 'Project exported as JSON' }
  }

  private static generateHTMLFile(code: CodeData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${code.metadata?.title || 'Codiner Project'}</title>
    <meta name="description" content="${code.metadata?.description || 'A project created with Codiner'}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${code.html}
    <script src="script.js"></script>
</body>
</html>`
  }

  private static convertToReactComponent(code: CodeData): string {
    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      ${this.convertHTMLToJSX(code.html)}
    </div>
  );
}

export default App;`
  }

  private static convertToNextPage(code: CodeData): string {
    return `export default function Home() {
  return (
    <main>
      ${this.convertHTMLToJSX(code.html)}
    </main>
  )
}`
  }

  private static convertToViteComponent(code: CodeData): string {
    return `export default function App() {
  return \`
    ${code.html}
  \`
}`
  }

  private static convertHTMLToJSX(html: string): string {
    // Basic HTML to JSX conversion (simplified)
    return html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/<(\w+)/g, '<$1')
      .replace(/<\/(\w+)>/g, '</$1>')
  }

  private static generateReadme(code: CodeData, projectName: string, framework?: string): string {
    return `# ${projectName}

${code.metadata?.description || 'A project created with Codiner - the AI-powered app builder.'}

## 🚀 Getting Started

${framework === 'react' ? `### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Running the App
\`\`\`bash
npm start
\`\`\`
` : framework === 'nextjs' ? `### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Running the Development Server
\`\`\`bash
npm run dev
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`
` : framework === 'vite' ? `### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Running the Development Server
\`\`\`bash
npm run dev
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm run preview
\`\`\`
` : `### Running the App
Simply open \`index.html\` in your web browser, or use a local server:

\`\`\`bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
\`\`\`
`}

## 📁 Project Structure

${framework === 'vanilla' ? `- \`index.html\` - Main HTML file
- \`styles.css\` - CSS styles
- \`script.js\` - JavaScript functionality
- \`assets/\` - Static assets` : `- \`src/\` - Source code
- \`public/\` - Static assets
- \`package.json\` - Dependencies and scripts`}

## 🎨 Features

- Modern, responsive design
- Interactive elements
- Smooth animations
- Mobile-friendly interface

## 🛠️ Technologies Used

${framework === 'react' ? '- React
- CSS3
- JavaScript (ES6+)' : framework === 'nextjs' ? '- Next.js
- React
- CSS3
- JavaScript (ES6+)' : framework === 'vite' ? '- Vite
- JavaScript (ES6+)
- CSS3' : '- HTML5
- CSS3
- JavaScript (ES6+)'}

## 📝 Notes

This project was generated using [Codiner](https://codiner.online) - an AI-powered app builder that transforms natural language descriptions into production-ready code.

---

**Built with ❤️ using Codiner**`
  }
}

export default CodeExporter
