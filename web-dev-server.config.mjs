import { fromRollup } from '@web/dev-server-rollup'
import rollupBabel from '@rollup/plugin-babel'
import rollupHtml from 'rollup-plugin-html'
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

const html = fromRollup(rollupHtml)
const babel = fromRollup(rollupBabel)

dotenv.config();

const replacePlugin = fromRollup(replace)({
  preventAssignment: true,
  'process.env.UXMAL_API_URL': JSON.stringify(process.env.UXMAL_API_URL),
});

export default {
  mimeTypes: {
    // serve imported html files as js
    'src/editor/panels/*.html': 'js',
    'src/editor/templates/*.html': 'js',
    'src/editor/dialogs/*.html': 'js',
    'src/editor/extensions/*/*.html': 'js'
  },
  plugins: [
    replacePlugin,
    html({
      include: [
        'src/editor/panels/*.html',
        'src/editor/templates/*.html',
        'src/editor/dialogs/*.html',
        'src/editor/extensions/*/*.html'
      ]
    }),
    babel({
      babelHelpers: 'bundled',
      env: {
        test: {
          compact: false,
          plugins: [
            ['istanbul', {
              exclude: [
                'editor/jquery.min.js',
                'editor/jgraduate/**',
                'editor/react-extensions/react-test'
              ],
              include: [
                'src/**',
                'packages/svgcanvas/core/**',
                'packages/svgcanvas/common/**'
              ]
            }]
          ]
        }
      }
    })
  ]
}
