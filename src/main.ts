import {app, BrowserWindow, ipcMain, Menu, protocol, shell} from 'electron';
import path from 'path';
import {getSqlite3} from "@/sqlite3";
import {
    getEncryptedSetting,
    getSetting,
    getSettings,
    initializeSessionKeys,
    setSetting
} from "@/electron-store/settings";
import {addProfile, editProfile, getProfile, getProfiles, removeProfile} from "@/db/profiles";
import {GpgKey, Profile, Settings} from "@/types";
import {importGpgKeyWindow, selectFilesWindow, selectKeyWindow, selectTmpDirWindow} from "@/utils/windows";
import {addHistory, getHistories} from "@/db/histories";
import fs from "fs";
import {Keys} from "@/lib/keys";
import {addGpgKey, getGpgKey, getGpgKeys} from "@/db/gpg_keys";
import {Sendcrypt} from "@/lib/sendcrypt";
import {updateElectronApp, UpdateSourceType} from "update-electron-app";
import log from 'electron-log/main';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Check for updates
if (app.isPackaged) {
    updateElectronApp({
        logger: log,
    })
}

log.initialize()

const serverUrl = 'https://sendcrypt.sib.swiss'

// export let mainWindow: BrowserWindow
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string
let mainWindow: BrowserWindow
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        icon: 'renderer/assets/icon.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: !app.isPackaged,
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            sandbox: true
        },
    })

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
};

const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
    { role: 'appMenu' },
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Help',
                click: async () => {
                    const { shell } = await import('electron')
                    await shell.openExternal('https://clinbiokb.sib.swiss/s/sendcrypt')
                }
            },
            {
                label: 'Getting started',
                click: async () => {
                    const { shell } = await import('electron')
                    await shell.openExternal('https://clinbiokb.sib.swiss/s/sendcrypt/doc/getting-started-7uRWXFnHx7')
                }
            },
            { type: 'separator' },
            {
                label: 'Show log in Finder',
                click: async () => {
                    const { shell } = await import('electron')
                    const logPath = log.transports.file.getFile().path
                    shell.showItemInFolder(logPath)
                }
            },
            { type: 'separator' },
            {
                label: 'Register',
                click: async () => {
                    const { shell } = await import('electron')
                    await shell.openExternal('https://sendcrypt.sib.swiss/register')
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault()
    })
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

protocol.registerSchemesAsPrivileged([
    {
        scheme: 'sendcrypt',
        privileges: {
            secure: true,
            standard: true,
            supportFetchAPI: true
        }
    }
])

app.setAsDefaultProtocolClient('sendcrypt', process.execPath, ['%1'])

app.on('open-url', async (event, url) => {
    event.preventDefault
    const urlObj = new URL(url)

    if (urlObj.protocol === 'sendcrypt:') {
        const keys = new Keys()
        const box = urlObj.hostname + urlObj.pathname
        const payload = await keys.openBox(
            box,
            getSetting('X25519PublicSessionKey') as string,
            getSetting('X25519PrivateSessionKey') as string
        )

        mainWindow.webContents.send('login', JSON.parse(payload))
        setTimeout(() => {
            mainWindow.focus();
        }, 500);
    }
})

app.whenReady().then(async () => {
    getSqlite3().then(() => {
        // ensure did-finish-load
        setTimeout(async () => {
            mainWindow.webContents.send('main-process-message', '[sqlite3] initialize success :)')
        }, 999)
    })
    await initializeSessionKeys()
})

ipcMain.handle('profile:list', async () => {
    return await getProfiles()
})

ipcMain.handle('profile:load', (_event, id: number) => {
    setSetting('selectedProfile', id)
})

ipcMain.handle('profile:store', async (_event, json: string) => {
    const profile = JSON.parse(json) as Profile
    return await addProfile(profile)
})

ipcMain.handle('profile:update', async (_event, json: string) => {
    const profile = JSON.parse(json) as Profile
    await editProfile(profile)
})

ipcMain.handle('profile:remove', async (_event, id: number) => {
    await removeProfile(id)
})

ipcMain.handle('settings:all', () => {
    return getSettings()
})

ipcMain.handle('settings:set', async (_event, key: keyof Settings, value: boolean | string | number | null) => {
    if (key === 'tmpDir') {
        const path = selectTmpDirWindow()
        if (path !== undefined) {
            setSetting('tmpDir', path)
        }
        return path
    }

    if (key === 'sshPrivateKeyPath') {
        const path = selectKeyWindow('private')
        if (path !== undefined) {
            setSetting('sshPrivateKeyPath', path)
        }
        return path
    }

    if (key === 'sshPublicKeyPath') {
        const path = selectKeyWindow('public')
        if (path !== undefined) {
            setSetting('sshPublicKeyPath', path)
        }
        return path
    }


    return setSetting(key, value)
})

ipcMain.handle('history:list', async () => {
    return await getHistories()
})

ipcMain.handle('history:store', async (_event, json: string) => {
    const history = JSON.parse(json)
    return await addHistory(history)
})

ipcMain.handle('file:add', () => {
    return selectFilesWindow()
})

ipcMain.handle('ssh:copy', async () => {
    const path = getSetting('sshPublicKeyPath') as string
    return fs.readFileSync(path, 'utf8')
})

ipcMain.handle('gpg:list', async () => {
    return await getGpgKeys()
})

ipcMain.handle('gpg:load', (_event, id: number) => {
    setSetting('signingKey', id)
})

ipcMain.handle('gpg:copy', async () => {
    const gpgKeys = await getGpgKey(getSetting('signingKey') as number)
    return gpgKeys.public_key
})

ipcMain.handle('gpg:add', async (_event, json: string) => {
    const gpgKeys = JSON.parse(json) as GpgKey
    return await addGpgKey(gpgKeys)
})

ipcMain.handle('gpg:import', async () => {
    const keys = new Keys()
    const path = importGpgKeyWindow()
    if (path === undefined) {
        throw new Error('No file selected')
    }
    const content = await fs.promises.readFile(path, 'utf8')
    const {gpgPrivateKey, gpgPublicKey, uid, fingerprint} = await keys.importGpgKey(content)
    const gpgKeys = {
        uid,
        private_key: gpgPrivateKey,
        public_key: gpgPublicKey,
        fingerprint
    }
    const id = await addGpgKey(gpgKeys)
    return {id, uid, public_key: gpgPublicKey, fingerprint}
})

ipcMain.handle('gpg:verify', async (_event, passphrase: string | undefined) => {
    const signingKey = getSetting('signingKey') as number | null
    if (signingKey === null) {
        return new Promise<{ needsPassphrase: boolean, passphrase?: string }>((resolve) => resolve({needsPassphrase: false}))
    }
    const keys = new Keys()
    const gpgKeys = await getGpgKey(signingKey)
    return await keys.verifyGpgKeyPassphrase(passphrase, gpgKeys.private_key)
})

ipcMain.handle('ssh:generate', async () => {
    const keys = new Keys()
    const {sshPrivateKey, sshPublicKey} = await keys.generateSshKeys()

    let keysPath = app.getPath('userData')
    const sshPath = path.join(app.getPath('home'), '.ssh')

    if (fs.existsSync(sshPath)) {
        keysPath = sshPath
    }

    const sshPrivateKeyPath = path.join(keysPath, 'sendcrypt_rsa')
    const sshPublicKeyPath = path.join(keysPath, 'sendcrypt_rsa.pub')

    fs.writeFileSync(sshPrivateKeyPath, sshPrivateKey)
    fs.writeFileSync(sshPublicKeyPath, sshPublicKey)

    setSetting('sshPrivateKeyPath', sshPrivateKeyPath)
    setSetting('sshPublicKeyPath', sshPublicKeyPath)
    setSetting('sshPassphrase', undefined)

    return {
        sshPrivateKeyPath: sshPrivateKeyPath,
        sshPublicKeyPath: sshPublicKeyPath
    }
})

ipcMain.handle('file:send', async (_event, json: string, passphrase?: string) => {
    const currentProfileId = getSetting('selectedProfile') as number
    const currentProfile = await getProfile(currentProfileId) as Profile

    if (currentProfileId === null || currentProfile === undefined) {
        throw new Error('No profile selected')
    }

    const currentSigningKeyId = getSetting('signingKey') as number
    const currentGpgKey = await getGpgKey(currentSigningKeyId) as GpgKey

    if (currentSigningKeyId === null || currentGpgKey === undefined) {
        throw new Error('No GPG key selected')
    }

    const sendcrypt = new Sendcrypt(
        currentProfile,
            getSetting('tmpDir') as string,
            getSetting('sshPrivateKeyPath') as string,
            currentGpgKey.private_key,
            getEncryptedSetting('sshPassphrase') as string | undefined,
    )

    return await sendcrypt.send(json, passphrase)
})

ipcMain.handle('register', async () => {
    return await shell.openExternal(`${serverUrl}/register`)
})

ipcMain.handle('login', async () => {
    const loginKey = getSetting('X25519PublicSessionKey') as string
    return await shell.openExternal(`${serverUrl}/auth-app?loginKey=${loginKey}`)
})

ipcMain.handle('login:url', async () => {
    const loginKey = getSetting('X25519PublicSessionKey') as string
    return `${serverUrl}/auth-app?loginKey=${loginKey}`
})

ipcMain.handle('login:token', async (_event, token: string) => {
    const box = token
    const keys = new Keys()
    const payload = await keys.openBox(
        box,
            getSetting('X25519PublicSessionKey') as string,
            getSetting('X25519PrivateSessionKey') as string
    )
    mainWindow.webContents.send('login', JSON.parse(payload))
    setTimeout(() => {
        mainWindow.focus();
    }, 500);
})

ipcMain.handle('help', async () => {
    return await shell.openExternal('https://clinbiokb.sib.swiss/s/sendcrypt')
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
