import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

const getHtmlEntries = () => {
  const pagesDir = path.resolve(__dirname, '');
  const entries = {};
  const files = fs.readdirSync(pagesDir);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  htmlFiles.forEach((file) => {
    const name = path.basename(file, '.html');
    entries[name] = path.resolve(pagesDir, file);
  });

  return entries;
};

const jsToBottomNoModule = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html) {
      html = html.replace(`type="module" crossorigin`, '');
      let scriptTag = html.match(/<script[^>]*>(.*?)<\/script[^>]*>/)[0];
      html = html.replace(scriptTag, '');
      html = html.replace('<!-- SCRIPT -->', scriptTag);
      return html;
    },
  };
};

const cssCrossOriginRemove = () => {
  return {
    name: 'css-cross-origin-remove',
    transformIndexHtml(html) {
      return html.replace(
        /(<link[^>]*rel=["']stylesheet["'][^>]*?)\s+crossorigin(?:=["'][^"']*["'])?/g,
        '$1'
      );
    },
  };
};

const vendorMinifier = () => {
  return {
    name: 'vendor-minifier',
    async generateBundle(options, bundle) {
      // Minify vendor scripts after build
      const vendorDir = path.resolve(__dirname, 'dist/vendor');

      if (fs.existsSync(vendorDir)) {
        const vendorFiles = fs.readdirSync(vendorDir);

        for (const file of vendorFiles) {
          if (file.endsWith('.js')) {
            const filePath = path.join(vendorDir, file);
            const content = fs.readFileSync(filePath, 'utf8');

            try {
              // Use Terser for advanced minification
              const minified = await minify(content, {
                compress: {
                  drop_console: false, // Keep console logs for debugging
                  drop_debugger: true,
                  pure_funcs: ['console.log'], // Remove console.log calls
                  passes: 2,
                },
                mangle: {
                  toplevel: false, // Don't mangle top-level names to avoid breaking
                },
                format: {
                  comments: /@license|@preserve|@format|@version/i, // Preserve license comments
                },
                sourceMap: false,
              });

              // Write minified content back
              fs.writeFileSync(filePath, minified.code);

              // Calculate size reduction
              const originalSize = content.length;
              const minifiedSize = minified.code.length;
              const reduction = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);

              console.log(`✅ Minified vendor script: ${file} (${reduction}% smaller)`);
            } catch (error) {
              console.warn(`⚠️ Failed to minify ${file}:`, error.message);
              // Fallback to basic minification
              const basicMinified = content
                .replace(/\/\/(?!.*@license|.*@preserve|.*@format|.*@version).*$/gm, '')
                .replace(/\/\*[\s\S]*?\*\/(?!.*@license|.*@preserve|.*@format|.*@version)/g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
                .replace(/\s+$/gm, '')
                .replace(/^\s*[\r\n]/gm, '')
                .trim();

              fs.writeFileSync(filePath, basicMinified);
              console.log(`✅ Basic minified vendor script: ${file}`);
            }
          }
        }
      }
    },
  };
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    injectHTML({
      tagName: 'Component',
    }),
    jsToBottomNoModule(),
    cssCrossOriginRemove(),
    vendorMinifier(),
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        // Code splitting configuration
        manualChunks: {
          // Split heavy libraries into separate chunks
          'vendor-animations': [
            './src/js/animation/swiper.js',
            './src/js/animation/slider.js',
            './src/js/animation/modal.js'
          ],
          'vendor-utils': [
            './src/js/utils/leaflet.js',
            './src/js/common/parallax-effect.js'
          ],
          // Core functionality
          'core': [
            './src/js/common/common.js',
            './src/js/common/mobile-menu.js',
            './src/js/common/navigation-menu.js'
          ]
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (ext === 'css') {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Enable minification and tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      // Pre-bundle commonly used modules
    ],
    exclude: [
      // Exclude heavy modules from pre-bundling
      './src/js/utils/leaflet.js',
      './src/js/animation/swiper.js'
    ]
  },
  server: {
    open: true,
  },
  base: './',
});
