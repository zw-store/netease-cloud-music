/// <reference types="vite/client" />
//解决ts文件引入vue文件出现红色警告问题
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module '*.js' {
  import { Directive } from 'vue'
  const directive: Directive
  export default directive
}

declare module '@'
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
