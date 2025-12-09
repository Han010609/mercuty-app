/**
 * 應用程式入口檔案
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import router from './router'

// Quasar 樣式（由 @quasar/vite-plugin 自動處理 SASS 變數）
import 'quasar/dist/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// 應用程式樣式
import './style.css'

import App from './App.vue'

const app = createApp(App)

// 使用 Pinia
app.use(createPinia())

// 使用 Vue Router
app.use(router)

// 使用 Quasar
app.use(Quasar, {
  plugins: {}, // 導入 Quasar 插件
  config: {
    notify: {
      position: 'top',
      timeout: 3000
    }
  }
})

app.mount('#app')

