
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import axios from './utils/axios'

const app = createApp(App)

app.config.globalProperties.$axios = axios;
app.use(createPinia())
app.use(router)

app.mount('#app')
