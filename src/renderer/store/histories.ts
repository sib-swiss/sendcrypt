import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {History, Metadata} from "@/types";

const ipcRenderer = window.ipcRenderer


export const useHistoriesStore = defineStore('histories', () => {
    const histories: Ref<Array<History>> = ref([])

    const loadHistories = () => {
        ipcRenderer.invoke('history:list').then((storedHistories: Array<History>) => {
            histories.value = storedHistories
        })
    }

    const storeHistory = (history: Metadata) => {
        const json = JSON.stringify(history)
        ipcRenderer.invoke('history:store', json).then((id: number) => {
            const storedHistory = {...history, id} as unknown as History
            histories.value = [storedHistory, ...histories.value]
        })
    }

    return { histories, loadHistories, storeHistory }
})