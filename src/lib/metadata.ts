import {app} from "electron";
import {readKey} from "openpgp";
import {Hash} from "./checksum";
import {Profile, Metadata as MetadataInfo} from "@/types";
import fs from "fs";

export interface Metadata {
    fingerprint(publicKeyArmored: string): Promise<string>

    timestamp(): Promise<string>

    save(archivePath: string, outputPath: string): Promise<{ data: MetadataInfo; outputPath: string }>
}

export class Metadata implements Metadata {
    profile: Profile
    checksum_algorithm = 'SHA256'
    compression_algorithm = 'gzip'

    constructor(profile: Profile) {
        this.profile = profile
    }

    async fingerprint(publicKeyArmored: string) {
        const publicKey = await readKey({armoredKey: publicKeyArmored})
        return publicKey.getFingerprint()
    }

    async timestamp(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const hours = String(currentDate.getHours()).padStart(2, '0');
                const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                const seconds = String(currentDate.getSeconds()).padStart(2, '0');
                const timezoneOffset = -currentDate.getTimezoneOffset() / 60; // Convert to hours
                const timezoneOffsetStr = timezoneOffset >= 0 ? `+${String(timezoneOffset).padStart(2, '0')}` : `${String(timezoneOffset).padStart(3, '0')}`;

                const timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneOffsetStr}00`;

                resolve(timestamp)
            } catch (error) {
                reject(error)
            }
        })
    }

    async save(archivePath: string, outputPath: string): Promise<{ data: MetadataInfo, outputPath: string }> {
        const data: MetadataInfo = {
            project: this.profile.name,
            recipients: [await this.fingerprint(this.profile.gpg_key)],
            timestamp: await this.timestamp(),
            checksum: await (new Hash()).checksum(archivePath, 'sha256'),
            checksum_algorithm: this.checksum_algorithm,
            compression_algorithm: this.compression_algorithm,
            version: `${app?.getVersion()} - GUI`,
        }

        const jsonString = JSON.stringify(data, null, 4)

        await fs.promises.writeFile(outputPath, jsonString, 'utf8')

        return {
            data,
            outputPath
        }
    }
}