---
title: Publishing an NPM Component
description: NPM, Vue, Package publish
icon: 'lucide:package'
gitTalk: false
date: 2024-08-03 13:09:00
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Publishing an npm [component](https://www.npmjs.com/package/@eepson123tw/canvas-meme)

I've always wanted to create public components and consider uploading them to npm.

I thought of a topic I've always wanted to implement that's quite amusing 😂

After uploading an image, it can be converted into text and displayed on Canvas.

![npm](/images/npm/image.webp)

## Setting Goals

The implementation approach I wanted, listing several goals that must be achieved:

- Must be implemented using Vue3 TypeScript
- Must use automated version numbering process
- Configure various values in package.json
- Simple and fun program implementation

## Challenges Encountered

During actual implementation, I discovered...

### TypeScript Environment Configuration

- Initially, I wasn't familiar with what the various .json suffix files in TypeScript meant. After familiarizing myself for a while, I later understood that tsconfig.app.json where "app" represents the managed environment - app for application, node for backend build, etc. They are all referenced in tsconfig.json so the TypeScript compiler knows which environment to use.

::code-group

```json [tsconfig.json]
{
  "references": [
    {
      "path": "./tsconfig.app.json" // [!code focus] TypeScript configuration for application
    },
    {
      "path": "./tsconfig.node.json" // TypeScript configuration for Node.js environment
    },
    {
      "path": "./tsconfig.config.json" // TypeScript configuration for specific configs
    }
  ],
  "compilerOptions": {
    "allowSyntheticDefaultImports": true, // Allow synthetic default imports
    "baseUrl": "./", // Base path setting
    "declaration": true, // Generate declaration files
    "declarationDir": "./dist/types", // Output directory for declaration files
    "esModuleInterop": true, // Allow ES module interoperability
    "experimentalDecorators": true, // Enable experimental decorator features
    "importHelpers": true, // Import helper functions
    "isolatedModules": true, // Treat each file as a separate module
    "jsx": "preserve", // Preserve JSX syntax
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"], // TypeScript standard libraries to use
    "module": "esnext", // Module format
    "target": "esnext", // Compilation target
    "moduleResolution": "node", // Module resolution strategy
    "noUnusedLocals": true, // Disallow unused local variables
    "noUnusedParameters": true, // Disallow unused parameters
    "outDir": "dist", // Output directory
    "paths": {
      "@/*": ["src/*"] // Path alias setting
    },
    "resolveJsonModule": true, // Allow importing JSON modules
    "sourceMap": true, // Generate source maps
    "strict": true, // Enable all strict type checking options
    "types": ["node", "vue"], // Type definitions to include
    "useDefineForClassFields": true // Use `define` keyword for class fields
  },
  "exclude": [
    "node_modules", // Exclude node_modules directory
    "dist" // Exclude dist directory
  ]
}
```

```json [tsconfig.app.json]
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*", "src/**/*.vue"]
}
```

```json [tsconfig.node.json]
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

::

Some pitfalls you really only know after stepping on them 😭

### Bundler Configuration and Output

I originally thought packaging only required setting up the output properly. Following online tutorials and documentation, it should be simple to go live 😊, but I was still too naive.
To configure package.json and vite.config, there's a very important reminder:

::alert{type="info"}
"author": "Must be the actual person and correct", <== After nearly an hour of publishing and questioning life, I discovered changing this fixed it 👼
::

::code-group

```json [package.json]
{
  // Above omitted
  "main": "dist/canvas-image.umd.js", // Main entry file, using UMD format
  "module": "dist/canvas-image.es.js", // ES module format entry file
  "exports": { // File destinations when using different import methods, after doing this I truly realized how much npm helps
    ".": {
      "import": "./dist/canvas-image.es.js", // Entry file when using import
      "require": "./dist/canvas-image.umd.js", // Entry file when using require
      "types": "./dist/types/index.d.ts" // Type definition file
    },
    "./dist/style.css": "./dist/style.css" // Path for corresponding CSS file
  },
  "types": "./vue3-canvas-image.d.ts" // Default type definition file entry
}
```

```typescript [vite.config.ts]
export default defineConfig({
  plugins: [
    vue(), // Vue plugin for handling Vue files
    dts({
      clearPureImport: true, // Clear pure imports
    }),
  ],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname, // Set path alias pointing to src directory
    },
  },
  build: {
    cssCodeSplit: true, // Enable CSS code splitting
    sourcemap: true, // Generate source map files
    emptyOutDir: true, // Clear output directory during build
    target: 'esnext', // Target environment set to ESNext
    outDir: './dist', // Output directory
    lib: {
      // Entry file, can be a dictionary or array of multiple entry points
      entry: resolve(dirname(fileURLToPath(import.meta.url)), 'src/index.ts'),
      name: 'canvas-image', // Global name of the library
      // Generated file name, append corresponding extension based on format
      fileName: fileName => `${'canvas-image'}.${fileName}.js`,
    },
    rollupOptions: {
      // Ensure dependencies that shouldn't be bundled into the library are externalized
      external: ['vue'],
      output: {
        // Provide global variables for externalized dependencies, used in UMD builds
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
```

::

### NPM Publishing Failure

This was really the most painful and tearful part of this implementation. Online resources all say just run `npm publish`, but in reality, if auth authentication is enabled, you must implement git action secrets token, then copy .npmrc to point to the path, and set up the org properly, otherwise the publishing will go sideways.

### Release Version Number Issues

Release automation was also tricky. I studied vue/core's publishing process, using .husky pre-commit and pre-push hooks that work as their names suggest - executing my written commands before commit and push.

- pre-commit checks if commits follow the rules
- pre-push executes auto update release version

### Writing GitHub Actions YML

Since I had written similar pipelines before, it was simple to reference other CI/CD setups.

## Learning Conclusions

After actually going through the entire process, I discovered that creating your own third-party plugins isn't that difficult. I was quite shocked to see the download numbers - I thought it was just a project for going through the process, but it actually had 500 downloads! Though no one starred it hahaha.

In the future, I'll think about actual needs before continuing my plugin journey~ Writing something backend-related seems good too 👍
