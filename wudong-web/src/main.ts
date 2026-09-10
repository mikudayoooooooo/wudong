import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router'
import { useSession } from './stores/session'
import './styles/theme.css'
import './styles/accommodation.css'

const app = createApp(App).use(createPinia()).use(createAppRouter())

// 启动恢复登录态（有 token 则拉取个人信息）
useSession().init()

app.mount('#app')
