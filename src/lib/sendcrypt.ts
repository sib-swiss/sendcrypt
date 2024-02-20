import {Metadata as MetadataInterface, Profile, File} from "@/types";
import {Hash} from "./checksum";
import {Gpg} from "./gpg";
import {Metadata} from "./metadata";
import {Sftp} from "./sftp";
import {Tar} from "./tar";
import {Zip} from "./zip";
import fs from "fs";
import path from "node:path";
import {addHistory} from "@/db/histories";

export class Sendcrypt {
    profile: Profile
    tmpDir: string
    files: Array<string> = []
    gpgPrivateArmoredKey: string | null
    shouldSign = false
    hash: Hash
    gpg: Gpg
    metadata: Metadata
    sftp: Sftp
    tar: Tar
    zip: Zip

    constructor(
        profile: Profile,
        tmpDir: string,
        sshPrivateKeyPath: string,
        gpgPrivateArmoredKey: string | null,
        sshPassphrase: string | undefined = undefined
    ) {
        this.profile = profile
        this.tmpDir = tmpDir
        this.hash = new Hash()
        this.gpg = new Gpg(tmpDir)
        this.metadata = new Metadata(this.profile)
        const sshPrivateKey = fs.readFileSync(sshPrivateKeyPath, 'utf8')
        this.sftp = new Sftp(
            profile.host,
            profile.port,
            profile.username,
            sshPrivateKey,
            sshPassphrase
        )
        this.tar = new Tar()
        this.zip = new Zip(tmpDir)
        this.gpgPrivateArmoredKey = gpgPrivateArmoredKey
        if (this.gpgPrivateArmoredKey !== null) {
            this.shouldSign = true
        }
    }

    private setFiles(files: Array<File>) {
        this.files = files.map((file) => file.path)
    }

    async send(filesJson: string, passphrase?: string) {
        this.directoryExists(this.tmpDir)

        this.setFiles(JSON.parse(filesJson) as Array<File>)
        
        const checksumFilePath = await this.checksumFile()

        const tarFilePath = await this.tarFile(checksumFilePath)

        const encryptedTarFilePath = await this.encryptedTarFile(tarFilePath)

        const {data: metadata, outputPath: metadataFilePath} = await this.metadataFile(encryptedTarFilePath)

        const filesToZip = [encryptedTarFilePath, metadataFilePath]

        if (this.shouldSign) {
            const signedMetadataFile = await this.signMetadataFile(metadataFilePath, passphrase)
            filesToZip.push(signedMetadataFile)
        }

        const zipFilePath = await this.zipFile(filesToZip)

        await this.sendFile(zipFilePath)

        await this.saveHistory(metadata)

        return metadata
    }

    private async checksumFile() {
        const outputPath = path.join(this.tmpDir, 'metadata.json')

        const checksums = await this.hash.checksums(this.files)

        let output = '';
        for (const checksum of checksums) {
            output += `${checksum.checksum}\t${checksum.file}\n`;
        }

        await fs.promises.writeFile(outputPath, output, 'utf8')

        return outputPath
    }

    private async tarFile(checksumFilePath: string) {
        const outputPath = path.join(this.tmpDir, 'data.tar.gz')

        await this.tar.archive(this.files, checksumFilePath, outputPath)

        return outputPath
    }

    private async encryptedTarFile(tarFilePath: string) {
        const outputPath = path.join(this.tmpDir, 'data.tar.gz.gpg')

        await this.gpg.encrypt(tarFilePath, outputPath, this.profile.gpg_key)

        return outputPath
    }

    private async metadataFile(encryptedTarFilePath: string) {
        const outputPath = path.join(this.tmpDir, 'metadata.json')

        return await this.metadata.save(encryptedTarFilePath, outputPath)
    }

    private async signMetadataFile(metadataFilePath: string, passphrase?: string) {
        const outputPath = path.join(this.tmpDir, 'metadata.json.sig')

        if (this.gpgPrivateArmoredKey === undefined || this.gpgPrivateArmoredKey === null) {
            throw new Error('Private key not found')
        }

        return await this.gpg.sign(
            metadataFilePath,
            outputPath,
            this.gpgPrivateArmoredKey,
            passphrase
        )
    }

    private async zipFile(files: Array<string>) {
        return await this.zip.archive(files)
    }

    private async sendFile(localPath: string) {
        let remotePath = './'

        const uploadPath = this.profile.remote_path

        if (uploadPath !== undefined && uploadPath !== null && uploadPath !== '') {
            if ((uploadPath as string).startsWith('/')) {
                remotePath = '' + uploadPath
            } else {
                remotePath = remotePath + uploadPath
            }
        }

        await this.sftp.send(localPath, remotePath)
    }

    async saveHistory(metadata: MetadataInterface) {
        await addHistory(metadata)
    }

    private directoryExists(path: string) {
        try {
            return fs.statSync(path).isDirectory()
        } catch {
            throw new Error(`Directory ${path} does not exist`)
        }
    }
}