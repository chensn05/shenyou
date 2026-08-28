import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Landing from './pages/Landing.vue'
import Home from './pages/Home.vue'
import Story from './pages/Story.vue'
import Core from './pages/Core.vue'
import Pets from './pages/Pets.vue'
import Codex from './pages/Codex.vue'
import History from './pages/History.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Landing },
    { path: '/map', component: Home },
    { path: '/story/:id', component: Story },
    { path: '/core/:culture', component: Core },
    { path: '/pets', component: Pets },
    { path: '/codex', component: Codex },
    { path: '/history', component: History },
  ],
})

createApp(App).use(router).mount('#app')
