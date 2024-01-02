// https://vitejs.dev/config/
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import EslintPlugin from 'vite-plugin-eslint'
import VueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from 'vite-plugin-style-import'
import readline from 'readline'

export default defineConfig(({ command, mode }) => {
  command
  const colors = createColors()
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      viteCommonjs(),
      VueJsx(),
      vueSetupExtend(),
      EslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.jsx'],
      }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            resolveStyle: (name) => {
              return `element-plus/es/components/${name.substring(3)}/style/css`
            },
          },
        ],
      }),
      AutoImport({
        vueTemplate: true,
        resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
        dts: 'src/types/auto-imports.d.ts',
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
        imports: ['vue', 'vue-router', 'pinia'],
      }),
      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.tsx$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
        dts: 'src/types/components.d.ts',
      }),
      Icons({
        autoInstall: true,
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            description: '系统',
            version: '1.0.1',
          },
        },
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.json', '.scss', '.css'],
      alias: [
        {
          find: /\@\//,
          replacement: `${resolve(process.cwd(), '.', 'src')}/`,
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "@/assets/styles/variable.scss";',
        },
      },
    },
    server: {
      open: false,
      https: false,
      port: env.VITE_APP_PORT || 5173,
      host: '0.0.0.0',
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          ws: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              clearScreen()
              console.log(
                colors.bgYellow(' ' + req.method + ' '),
                colors.green(env.VITE_PROXY_URL + req.url),
              )
            })
            proxy.on('error', (_err, req, _res) => {
              console.log(
                colors.bgRed('Error：' + req.method + ' '),
                colors.green(env.VITE_PROXY_URL + req.url),
              )
            })
          },
        },
      },
    },
  }
})

function clearScreen() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

function formatter(open, close, replace = open) {
  return (input) => {
    const string = '' + input
    const index = string.indexOf(close, open.length)
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close
  }
}

function replaceClose(string, close, replace, index) {
  const start = string.substring(0, index) + replace
  const end = string.substring(index + close.length)
  const nextIndex = end.indexOf(close)
  return ~nextIndex
    ? start + replaceClose(end, close, replace, nextIndex)
    : start + end
}

function createColors() {
  return {
    reset: (s) => `\x1b[0m${s}\x1b[0m`,
    bold: formatter('\x1b[1m', '\x1b[22m', '\x1b[22m\x1b[1m'),
    dim: formatter('\x1b[2m', '\x1b[22m', '\x1b[22m\x1b[2m'),
    italic: formatter('\x1b[3m', '\x1b[23m'),
    underline: formatter('\x1b[4m', '\x1b[24m'),
    inverse: formatter('\x1b[7m', '\x1b[27m'),
    hidden: formatter('\x1b[8m', '\x1b[28m'),
    strikethrough: formatter('\x1b[9m', '\x1b[29m'),
    black: formatter('\x1b[30m', '\x1b[39m'),
    red: formatter('\x1b[31m', '\x1b[39m'),
    green: formatter('\x1b[32m', '\x1b[39m'),
    yellow: formatter('\x1b[33m', '\x1b[39m'),
    blue: formatter('\x1b[34m', '\x1b[39m'),
    magenta: formatter('\x1b[35m', '\x1b[39m'),
    cyan: formatter('\x1b[36m', '\x1b[39m'),
    white: formatter('\x1b[37m', '\x1b[39m'),
    gray: formatter('\x1b[90m', '\x1b[39m'),
    bgBlack: formatter('\x1b[40m', '\x1b[49m'),
    bgRed: formatter('\x1b[41m', '\x1b[49m', '\x1b[22m\x1b[1m'),
    bgGreen: formatter('\x1b[42m', '\x1b[49m'),
    bgYellow: formatter('\x1b[43m', '\x1b[49m'),
    bgBlue: formatter('\x1b[44m', '\x1b[49m'),
    bgMagenta: formatter('\x1b[45m', '\x1b[49m'),
    bgCyan: formatter('\x1b[46m', '\x1b[49m'),
    bgWhite: formatter('\x1b[47m', '\x1b[49m'),
  }
}
