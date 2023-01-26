import CleanCSS from 'clean-css';
import copy from 'rollup-plugin-copy';
import searchAndReplace from 'rollup-plugin-search-and-replace';
import terser from '@rollup/plugin-terser';

// Compile bundle
export default [
  {
    input: 'src/js/app.js',
    output: {
      file: 'dist/js/app.min.js',
      format: 'es',
    },
    plugins: [
      // Copy non-JS files; rename and minify CSS
      copy({
        targets: [
          {
            src: 'src/index.html',
            dest: 'dist',
          },
          {
            src: 'src/favicon.ico',
            dest: 'dist',
          },
          {
            src: 'src/css/app.css',
            dest: 'dist/css',
            rename: (name, extension) => `${name}.min.${extension}`,
            transform: (css) => new CleanCSS().minify(css).styles + '\n',
          }
        ],
      }),
      // Replace strings in HTML files; add cache busters
      searchAndReplace({
        entry: {
          files: 'dist/index.html',
          from: /\bapp\.(css|js)\b/g,
          to: 'app.min.$1?v=' + Date.now(),
        },
      }),
      // Minify JS
      terser({
        ecma: 2017,
        module: true,
      })
    ],
  }
];
