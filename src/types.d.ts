import { IpcRenderer } from 'electron'

export type Color = 'background' | 'surface' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type Variant = 'tonal' | 'outlined' | 'text'
export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
    sshPrivateKeyPath: string,
    sshPublicKeyPath: string,
    sshPassphrase: string | null,
    tmpDir: string,
    signMetadata: boolean,
    selectedProfile: number | null,
    signingKey: number | null,
    theme: Theme,
    X25519PrivateSessionKey: string | null,
    X25519PublicSessionKey: string | null,
}

export interface Profile {
    id: number,
    name: string,
    url: string,
    gpg_key: string,
    host: string,
    port: number,
    remote_path: string,
    username: string,
}

export interface RemoteProfile {
    name: string,
    gpg_key: string,
    host: string,
    port: number,
    remote_path: string,
    username: string,
}

export interface History {
    id: number,
    project: string,
    recipients: string,
    timestamp: string,
    checksum: string,
    checksum_algorithm: string,
    compression_algorithm: string,
    version: string,
}

export interface Metadata {
    project: string,
    recipients: Array<string>,
    timestamp: string,
    checksum: string,
    checksum_algorithm: string,
    compression_algorithm: string,
    version: string,
}

export interface File {
    index?: number,
    name: string,
    path: string,
    size: number,
}

export interface GpgKey {
    uid: string,
    public_key: string,
    private_key: string,
    fingerprint: string,
}

export interface GpgKeyIdentity {
    id: number,
    uid: string,
    public_key: string,
    private_key: string,
    fingerprint: string,
}

export interface DataTransfer {
    files: FileList;
}

export interface DataTransferEvent extends EventTarget {
    dataTransfer: DataTransfer | null;
}

declare global {
    interface Window {
        ipcRenderer: IpcRenderer
    }
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;