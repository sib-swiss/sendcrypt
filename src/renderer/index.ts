import {createApp} from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import "vue-toastification/dist/index.css";
import './style.css'
import App from './App.vue'
import vuetify from "./plugins/vuetify";
import router from "./router";
import {createPinia} from "pinia";
import options from "./plugins/vue-toastification";
import Toast from "vue-toastification";
import VueAxios from "vue-axios";
import axios from "axios";
import {useAxios} from "@/renderer/composables/axios";
import {useSessionStore} from "@/renderer/store/session";
import {useAuthenticator} from "@/renderer/composables/auth";
import {useSettingsStore} from "@/renderer/store/settings";
import {useProfilesStore} from "@/renderer/store/profiles";
import {useGpgKeyStore} from "@/renderer/store/gpg_keys";
import log from 'electron-log/renderer';

const pinia = createPinia()

export const app = createApp(App)

app.use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueAxios, axios)
    .use(Toast, options)
    .provide('axios', app.config.globalProperties.axios)
    .mount('#app')
    .$nextTick(() => {
        log.info('🎉 The application is running!')
        const {init} = useAxios()
        init()
        const sessionStore = useSessionStore()
        const {loadSession} = sessionStore
        loadSession()
        const settingsStore = useSettingsStore()
        const { loadSettings } = settingsStore
        loadSettings()
        const profilesStore = useProfilesStore()
        const { loadProfiles } = profilesStore
        loadProfiles()
        const gpgKeyStore = useGpgKeyStore()
        const { loadGpgKeys } = gpgKeyStore
        loadGpgKeys()
        const {check} = useAuthenticator()
        check()
    })