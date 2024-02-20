import {app, dialog} from "electron";
import fs from "fs";
import path from "path";

export const selectFilesWindow = () => {
    const selectedFiles = dialog.showOpenDialogSync({
        title: 'Add files',
        defaultPath: app.getPath('home'),
        properties: [
            'openFile',
            'multiSelections',
        ]
    })

    if (selectedFiles === undefined) {
        return []
    }

    return selectedFiles.map((file) => {
        const {size, isFile} = fs.statSync(file)
        if (!isFile) {
            return undefined
        }
        return {
            path: file,
            name: path.basename(file),
            size: size
        }
    }).filter((file) => file !== undefined)
}

export const selectTmpDirWindow = () => {
    const selectedFiles = dialog.showOpenDialogSync({
        title: 'Select temporary directory',
        defaultPath: app.getPath('temp'),
        properties: [
            'openDirectory',
            'showHiddenFiles'
        ]
    })

    if (selectedFiles === undefined) {
        return undefined
    }

    return selectedFiles[0]
}

export const selectKeyWindow = (type: 'private' | 'public') => {
    const keyPath = dialog.showOpenDialogSync({
        title: `Select your ${type} key`,
        defaultPath: `${app.getPath('home')}/.ssh`,
        properties: [
            'openFile',
            'showHiddenFiles',
        ]
    })

    if (keyPath === undefined) {
        return undefined
    }

    return keyPath[0]
}

export const importGpgKeyWindow = () => {
    const keyPath = dialog.showOpenDialogSync({
        title: 'Import PGP key',
        defaultPath: app.getPath('home'),
        properties: [
            'openFile',
        ]
    })

    if (keyPath === undefined) {
        return undefined
    }

    return keyPath[0]
}