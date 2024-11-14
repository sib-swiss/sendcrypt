import {ConnectConfig} from "ssh2";
import SSH2Promise from "ssh2-promise";
import path from "path";

export interface Sftp {
    send(
        localPath: string,
        remotePath: string,
    ): Promise<void>
}

export class Sftp implements Sftp {
    settings: ConnectConfig

    constructor(
        host: string,
        port: number,
        username: string,
        privateKey: string,
        passphrase?: string,
    ) {
        this.settings = {
            host: host,
            port: port,
            username: username,
            privateKey: privateKey,
            passphrase: passphrase,
        }
    }

    async send(
        localPath: string,
        remotePath: string,
    ): Promise<void> {
        const ssh = new SSH2Promise(this.settings, true)

        const sftp = ssh.sftp()

        await sftp.fastPut(localPath, `${remotePath}/${path.basename(localPath)}.part`)
        await sftp.rename(`${remotePath}/${path.basename(localPath)}.part`, `${remotePath}/${path.basename(localPath)}`)
    }
}