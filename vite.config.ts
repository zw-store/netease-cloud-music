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

export default defineConfig(({ command, mode }) => {
  command
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
        imports: ['vue', 'vue-router'],
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
      extensions: ['.mjs', '.js', '.jsx', '.json', '.scss', '.css'],
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
          additionalData: '@import "@/styles/variable.scss";',
        },
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
