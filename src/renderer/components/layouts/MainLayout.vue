<script setup lang="ts">

import ApplicationBar from "@/renderer/components/navigation/ApplicationBar.vue";
import NavigationLeftBar from "@/renderer/components/navigation/NavigationLeftBar.vue";
import ApplicationFooter from "@/renderer/components/footer/ApplicationFooter.vue";
import {useSettingsStore} from "@/renderer/store/settings";
import {storeToRefs} from "pinia";

const settingsStore = useSettingsStore()
const {settings} = storeToRefs(settingsStore)
</script>

<template>
    <v-layout :class="`${settings.theme}-theme`">
        <application-bar />
        <navigation-left-bar />

        <v-main class="d-flex align-center justify-center">
            <v-container
                :fluid="true"
                class="mt-2"
            >
                <router-view />
            </v-container>
        </v-main>
        <application-footer />
    </v-layout>
</template>

<style>
.system-theme {
  @media (prefers-color-scheme: dark) {
    :root {
      background-color: #191D23;
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      background-color: #FFF;
    }
  }
}

.light-theme {
  :root {
    background-color: #FFF;
  }
}

.dark-theme {
  :root {
    background-color: #191D23;
  }
}
</style>