import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {computed} from "vue";

const mq = computed(() => window.matchMedia('(prefers-color-scheme: dark)'))

const light = {
    dark: false,
    colors: {
        success: '#1E782F',
        base: '#F5F6F7',
        surface: '#F4F6F9',
        background: '#1B1E24'
    }
}

const dark = {
    dark: true,
    colors: {
        success: '#296C2B',
        base: '#2A3037',
        surface: '#15191E',
        background: '#1B1E24'
    }
}

const system = {
    dark: mq.value.matches,
    colors: {
        success: mq.value.matches ? '#296C2B' : '#1E782F',
        base: mq.value.matches ? '#2A3037' : '#F5F6F7',
        surface: mq.value.matches ? '#15191E' : '#F4F6F9',
        background: mq.value.matches ? '#1B1E24' : '#1B1E24'
    }
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'system',
        themes: {
            light,
            dark,
            system
        }
    },
    icons: {
        defaultSet: 'mdi'
    },
    defaults: {
        VBtn: {
            variant: 'flat',
            class: 'text-none py-2 px-4 text-body-2 font-weight-bold',
            elevation: 0,
            rounded: 'lg',
        }
    }
})

export default vuetify