<script setup lang="ts">
import {computed} from "vue";
import {Profile} from "@/types";

declare interface Props {
  modelValue: Profile | null
  items: Array<Profile>
  label: string
  placeholder: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'click:clear'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
</script>

<template>
    <v-row>
        <v-col
            cols="3"
            align-self="center"
            class="text-end font-weight-medium text-body-2 pb-5"
        >
            {{ label }}
        </v-col>
        <v-col
            cols="9"
            class="pb-0"
        >
            <v-autocomplete
                v-model="value"
                :items="items"
                item-title="name"
                :return-object="true"
                :placeholder="placeholder"
                variant="outlined"
                density="compact"
                rounded="lg"
                :hide-selected="true"
                :hide-no-data="true"
                :single-line="true"
                :clearable="true"
                color="primary"
                base-color="grey-lighten-1"
                @click:clear="$emit('click:clear')"
            />
        </v-col>
    </v-row>
</template>

<style scoped>

</style>