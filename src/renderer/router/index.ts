import {createRouter, createWebHashHistory} from "vue-router";
import HomeView from "@/renderer/views/Home/HomeView.vue";

const routes = [
    { name: 'send', path: '/', component: HomeView },
    { name: 'history', path: '/history', component: () => import('@/renderer/views/History/HistoryView.vue') },
    { name: 'projects', path: '/projects', component: () => import('@/renderer/views/Profiles/ProfilesView.vue') },
    { name: 'settings', path: '/settings', component: () => import('@/renderer/views/Settings/SettingsView.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router