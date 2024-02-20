import fs from "fs";
import archiver from "archiver";
import path from "path";
import {ZlibOptions} from "zlib";

export interface Tar {
    archive(files: Array<string>, checksumFile: string, outputFilePath: string): Promise<string>
}

export class Tar implements Tar {
    gzip: boolean
    zlib: ZlibOptions

    constructor(gzip = true, zlib: ZlibOptions = {level: 9}) {
        this.gzip = gzip
        this.zlib = zlib
    }

    async archive(files: Array<string>, checksumFile: string, outputFilePath: string) {
        const output = fs.createWriteStream(outputFilePath)

        const archive = archiver('tar', {
            gzip: this.gzip,
            zlib: this.zlib
        })

        archive.pipe(output)

        archive.on('error', function (err) {
            throw err
        })

        archive.file(checksumFile, {name: 'checksum.sha256'})

        for (const file of files) {
            archive.file(file, {name: 'content/' + path.basename(file)})
        }

        await new Promise((resolve, reject) => {
            output.on('close', () => {
                resolve(outputFilePath)
            })

            output.on('error', err => {
                reject(err)
            })

            archive.finalize()
        })

        return outputFilePath
    }
}