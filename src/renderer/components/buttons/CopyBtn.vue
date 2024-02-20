<script setup lang="ts">
import {ref} from "vue";
import {useClipboard} from "@vueuse/core/index";

interface Props {
    text: string
}
const props = defineProps<Props>()
const emit = defineEmits(['copied'])
const { copy, isSupported } = useClipboard()
const isShown = ref(false)
const randomId = Math.random().toString(36).substring(7)

const copyToClipboard = () => {
    copy(props.text)
    isShown.value = true
    emit('copied')
    setTimeout(() => {
        isShown.value = false
    }, 3000)
}
</script>

<template>
    <v-tooltip
        v-if="isSupported"
        :model-value="true"
        location="end"
        :activator="`#copy-btn-${randomId}`"
        offset="5"
        :class="isShown ? null : 'hidden'"
    >
        <template #activator>
            <v-btn
                :id="`copy-btn-${randomId}`"
                variant="text"
                size="small"
                :color="isShown ? 'success' : null"
                :icon="isShown ? 'mdi-check' : 'mdi-content-copy'"
                @click="copyToClipboard"
            />
        </template>
        Copied!
    </v-tooltip>
</template>

<style scoped>
.hidden {
    display: none;
}
</style>
