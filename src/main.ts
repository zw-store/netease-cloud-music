import { createApp } from 'vue'

import 'resetcss'
import '@/assets/styles/tailwind.css'
import ripple from '@/directives/ripple.js'
import App from '@/App.vue'

const app = createApp(App)
app.directive('ripple', ripple)
app.mount('#app')
