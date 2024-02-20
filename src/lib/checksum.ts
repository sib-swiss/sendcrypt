import crypto from "node:crypto";
import fs from "fs";
import path from "path";

export interface Hash {
    checksum(filePath: string): Promise<string>
    checksums(filePaths: Array<string>): Promise<Array<{file: string, checksum: string}>>
}

export class Hash implements Hash {
    async checksum(filePath: string, hash: 'sha256' | 'sha512' | 'md5' | 'sha1' | 'sha224' | 'sha384' | 'ripemd160' = "sha256"): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);

            const hasher = crypto.createHash(hash)

            stream.on('data', (data) => {
                hasher.update(data);
            });

            stream.on('end', () => {
                const checksum = hasher.digest('hex');
                resolve(checksum);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }

    async checksums(filePaths: Array<string>): Promise<Array<{file: string, checksum: string}>> {
        const results = [];
        for (const filePath of filePaths) {
            const checksum = await this.checksum(filePath);
            results.push({file: path.basename(filePath), checksum});
        }
        return results;
    }
}