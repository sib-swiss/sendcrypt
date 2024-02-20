<script setup lang="ts">

import NavigationItems from "@/renderer/components/navigation/NavigationItems.vue";
import router from "@/renderer/router";


const items = [
    'send',
    'history',
    'projects',
    'settings',
]

function goToView(view: string) {
    router.push({ name: view })
}
</script>

<template>
    <v-navigation-drawer
        :permanent="true"
    >
        <navigation-items
            :items="items"
            @select="goToView"
        />
    </v-navigation-drawer>
</template>

<style scoped>

</style>