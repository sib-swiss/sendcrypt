import {defineStore} from "pinia";
import {computed, Ref, ref} from "vue";
import {File} from "@/types";

const ipcRenderer = window.ipcRenderer


export const useFilesStore = defineStore('files', () => {
    const files: Ref<Array<File>> = ref([])

    const mappedFiles = computed(() => files.value.map((file, index) => ({...file, id: index})))

    function addFilesFromFinder() {
        ipcRenderer.invoke('file:add').then((newFiles: File[]) => {
            files.value = [...files.value, ...newFiles]

            files.value = files.value.filter((file, index, self) =>
                index === self.findIndex((t) => (
                    t.path === file.path
                ))
            )
        })
    }

    function addFiles(droppedFiles: FileList) {
        const newFiles = Array.from(droppedFiles)
            .filter(file => file.type !== '')
            .map(file => ({
                name: file.name,
                path: file.path,
                size: file.size,
            }))
        files.value = [...files.value, ...newFiles]

        files.value = files.value.filter((file, index, self) =>
            index === self.findIndex((t) => (
                t.path === file.path
            ))
        )
    }

    function removeFiles(ids: Array<number>) {
        files.value = files.value.filter((file, index) => !ids.includes(index))
    }

    function clearFiles() {
        files.value = []
    }

    return { files, mappedFiles, addFiles, addFilesFromFinder, removeFiles, clearFiles }
})