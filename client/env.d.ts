/// <reference types="vite/client" />

// 解决找不到 .vue 文件类型声明 的问题
declare module '*.vue' {
  import type { DefinedComponent } from 'vue'
  const VueComponent: DefinedComponent<{}, {}, any>
  export default VueComponent
}
