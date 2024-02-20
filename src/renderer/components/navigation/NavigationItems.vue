<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

interface Props {
  items: Array<string>
}

defineProps<Props>()
defineEmits(['select'])

const route = useRoute()
const selected = ref<Array<string | symbol>>([])

function assignRoute() {
    setTimeout(() => {
        if (route.name) {
            selected.value = [route.name]
        }
    }, 500)
}

onMounted(() => {
    assignRoute()
})
</script>

<template>
    <v-list
        v-model:selected="selected"
        :nav="true"
        :mandatory="true"
        density="compact"
        @update:selected="$emit('select', selected[0].toString())"
    >
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :title="item"
            :value="item"
            class="text-body-1"
            rounded="lg"
        >
            <template #title="{ title }">
                <div class="text-body-2 font-weight-medium ml-2 text-capitalize">
                    {{ title }}
                </div>
            </template>
        </v-list-item>
    </v-list>
</template>

<style scoped>

</style>