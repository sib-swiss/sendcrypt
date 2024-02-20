<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import {History} from "@/types";
import HistoryDetailsDialog from "@/renderer/views/History/components/HistoryDetailsDialog.vue";
import {useHistoriesStore} from "@/renderer/store/histories";
import {storeToRefs} from "pinia";
import {useDateFormatter} from "@/renderer/composables/date";

const historiesStore = useHistoriesStore()
const {loadHistories} = historiesStore
const {histories} = storeToRefs(historiesStore)
const {timestampToTime, dateToHumanFormat} = useDateFormatter()

const selected: Ref<null | History> = ref(null)

const isDialogOpen = ref(false)

const groupedHistories = computed(() => {
    const groupedData = new Map<string, History[]>();

    histories.value.forEach((obj) => {
        const date = dateToHumanFormat(new Date(obj.timestamp))
        const existingData = groupedData.get(date) || []
        groupedData.set(date, [...existingData, obj])
    })

    return groupedData
})

function openDialog(history: History) {
    selected.value = history
    isDialogOpen.value = true
}

onMounted(() => {
    loadHistories()
})
</script>

<template>
    <v-card
        :flat="true"
        rounded
        class="overflow-auto"
        color="transparent"
    >
        <v-card-subtitle
            v-if="histories.length === 0"
            class="text--disabled"
        >
            No data found
        </v-card-subtitle>
        <v-list
            v-for="(entries, index) in groupedHistories"
            :key="index"
            :flat="true"
            class="rounded-lg py-0"
            bg-color="transparent"
        >
            <v-list-subheader class="font-weight-bold border-b">
                {{ entries[0] }}
            </v-list-subheader>
            <v-list-item
                v-for="(item, i) in entries[1]"
                :key="i"
                color="transparent"
                @click="openDialog(item)"
            >
                <div class="font-weight-medium">
                    {{ item.project }}
                </div>
                <v-list-item-subtitle>
                    {{ timestampToTime(item.timestamp) }}
                </v-list-item-subtitle>
                <template #append>
                    <br>
                    {{ item.version }}
                </template>
            </v-list-item>
        </v-list>
    </v-card>
    <history-details-dialog
        v-model="isDialogOpen"
        :history="selected"
    />
</template>

<style scoped>

</style>