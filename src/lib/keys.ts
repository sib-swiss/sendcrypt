import {decryptKey, generateKey, readPrivateKey} from "openpgp";
import forge from 'node-forge'
import {crypto_box_seal_open, crypto_kx_keypair, ready} from 'libsodium-wrappers';

export interface Keys {
    generateGpgKeys(email: string, gpgPassphrase: string): Promise<{ gpgPrivateKey: string, gpgPublicKey: string, uid: string, fingerprint: string }>
    generateSshKeys(): Promise<{ sshPrivateKey: string, sshPublicKey: string }>
    generateSessionKeys(): Promise<{ sessionPrivateKey: string, sessionPublicKey: string }>
    importGpgKey(armoredPrivateKey: string): Promise<{ gpgPrivateKey: string, gpgPublicKey: string, uid: string, fingerprint: string }>
    verifyGpgKeyPassphrase(passphrase: string | undefined, privateKeyArmored: string): Promise<{ needsPassphrase: boolean, passphrase?: string }>
    openBox(box: string, sessionPublicKey: string, sessionPrivateKey: string): Promise<string>
}

export class Keys implements Keys {
    async importGpgKey(armoredPrivateKey: string) {
        const privateKey = await readPrivateKey({armoredKey: armoredPrivateKey})

        return {
            gpgPrivateKey: armoredPrivateKey,
            gpgPublicKey: privateKey.toPublic().armor(),
            uid: privateKey.getUserIDs()[0],
            fingerprint: privateKey.getFingerprint()
        }
    }

    async verifyGpgKeyPassphrase(
        passphrase: string | undefined = undefined,
        privateKeyArmored: string,
    ): Promise<{needsPassphrase: boolean; passphrase?: string}> {
        try {
            await decryptKey({
                privateKey: await readPrivateKey({armoredKey: privateKeyArmored}),
                passphrase
            });

            return {needsPassphrase: false, passphrase: undefined}
        } catch (error) {
            if(error.message === 'Error decrypting private key: Incorrect key passphrase') {
                return {needsPassphrase:true, passphrase: undefined}
            }
            return {needsPassphrase:true, passphrase: passphrase}
        }
    }

    async generateGpgKeys(email: string, gpgPassphrase: string) {
        const {privateKey, publicKey} = await generateKey({
            type: 'rsa',
            rsaBits: 4096,
            userIDs: [{name: 'SendCrypt', email: email}],
            passphrase: gpgPassphrase,
            format: 'armored'
        })

        let fingerprint: string

        readPrivateKey({armoredKey: privateKey}).then((privateKey) => {
            fingerprint = privateKey.getFingerprint()
        })

        return {
            gpgPrivateKey: privateKey,
            gpgPublicKey: publicKey,
            uid: `SendCrypt <${email}>`,
            fingerprint: fingerprint
        }
    }

    async generateSshKeys() {
        const rsaKeyPair = forge.pki.rsa.generateKeyPair({
            bits: 4096,
            e: 0x10001,
            workers: -1,
        })

        const privateKey = forge.ssh.privateKeyToOpenSSH(rsaKeyPair.privateKey)
        const publicKey = forge.ssh.publicKeyToOpenSSH(rsaKeyPair.publicKey)

        return {
            sshPrivateKey: privateKey,
            sshPublicKey: publicKey,
        }
    }

    async generateSessionKeys() {
        await ready;
        const { publicKey, privateKey} = crypto_kx_keypair();

        return {
            sessionPrivateKey: Buffer.from(privateKey).toString('hex'),
            sessionPublicKey: Buffer.from(publicKey).toString('hex'),
        }
    }

    async openBox(box: string, sessionPublicKey: string, sessionPrivateKey: string) {
        const secretKey = Buffer.from(sessionPrivateKey, 'hex')
        const publicKey = Buffer.from(sessionPublicKey, 'hex')

        const jsonToDecryptBuffer = Buffer.from(box, 'base64')
        return crypto_box_seal_open(jsonToDecryptBuffer, publicKey, secretKey, 'text');
    }
}