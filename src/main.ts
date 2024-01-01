import { createApp } from 'vue'

import 'resetcss'
import '@/assets/styles/tailwind.css'
import ripple from '@/directives/ripple.js'
import App from '@/App.vue'
import router from '@/router'
import '@/router/permission'

import { setupStore } from '@/store'
const app = createApp(App)
app.directive('ripple', ripple)
app.use(router)
app.use(setupStore).mount('#app')
