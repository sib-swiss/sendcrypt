import {createMessage, decryptKey, encrypt, Key, PrivateKey, readKey, readPrivateKey, sign} from "openpgp";
import fs from "fs";
import {Readable} from "node:stream";

export interface Gpg {
    encrypt(
        inputPath: string,
        outputPath: string,
        publicKeyArmored: string
    ): Promise<string>

    sign(
        inputPath: string,
        outputPath: string,
        privateKeyArmored: string,
        passphrase: string,
    ): Promise<string>
}


export class Gpg implements Gpg {
    tmpDir: string
    publicKey?: Key
    privateKey?: PrivateKey

    constructor(
        tmpDir: string
    ) {
        this.tmpDir = tmpDir
    }

    async encrypt(
        inputPath: string,
        outputPath: string,
        publicKeyArmored: string
    ): Promise<string> {
        await this.loadPublicKey(publicKeyArmored)

        if (this.publicKey === undefined) {
            throw new Error('Public key is undefined')
        }

        const readStream = fs.createReadStream(inputPath)
        const writeStream = fs.createWriteStream(outputPath)
        const message = await createMessage({binary: readStream})
        const encrypted = await encrypt({
            message: message,
            encryptionKeys: this.publicKey,
            format: 'binary'
        }) as unknown as NodeJS.ReadableStream

        const finalStream = encrypted.pipe(writeStream)

        return new Promise((resolve, reject) => {
            finalStream.on('finish', () => {
                resolve(outputPath)
            })

            finalStream.on('error', (err) => {
                reject(err)
            })
        })
    }

    async sign(
        inputPath: string,
        outputPath: string,
        privateKeyArmored: string,
        passphrase?: string,
    ): Promise<string> {
        await this.loadPrivateKey(privateKeyArmored, passphrase)

        if (this.privateKey === undefined) {
            throw new Error('Private key is undefined')
        }

        const readStream = fs.createReadStream(inputPath)
        const writeStream = fs.createWriteStream(outputPath)

        const message = await createMessage({binary: readStream})

        const signed = await sign({
            message: message,
            signingKeys: this.privateKey,
            detached: true
        }) as unknown as NodeJS.ReadableStream

        const finalStream = signed.pipe(writeStream)

        return new Promise((resolve, reject) => {
            finalStream.on('finish', () => {
                resolve(outputPath)
            })

            finalStream.on('error', (err) => {
                reject(err)
            })

        })
    }

    private async loadPublicKey(publicKeyArmored: string): Promise<void> {
        this.publicKey = await readKey({armoredKey: publicKeyArmored})
    }

    private async loadPrivateKey(privateKeyArmored: string, passphrase?: string): Promise<void> {
        const privateKey = await readPrivateKey({armoredKey: privateKeyArmored})

        this.privateKey = await decryptKey({
            privateKey: privateKey,
            passphrase: passphrase
        })
    }

    private fileToStream(filePath: string) {
        const nodeStream = fs.createReadStream(filePath);
        return Readable.toWeb(nodeStream);
    }

    private createWriteStream(filePath: string) {
        const nodeStream = fs.createWriteStream(filePath)
        return nodeStream as unknown as WritableStream<Uint8Array>
    }
}