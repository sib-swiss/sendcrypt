import AdmZip from "adm-zip";
import path from "node:path";

export interface Zip {
    archive(files: Array<string>, outputFilePath: string): Promise<string>
    setCurrentTimestamp(): string
}

export class Zip implements Zip {
    currentTimestamp: string
    tmpDir: string

    constructor(tmpDir: string) {
        this.tmpDir = tmpDir
        this.currentTimestamp = this.setCurrentTimestamp()
    }

    async archive(files: Array<string>, outputFilePath?: string) {
        if (!outputFilePath) {
            outputFilePath = path.join(this.tmpDir, `${this.currentTimestamp}.zip`)
        }

        return new Promise<string>((resolve, reject) => {
            const zip = new AdmZip()

            try {
                files.forEach((file) => {
                    zip.addLocalFile(file)
                });

                zip.writeZip(outputFilePath as string)
                resolve(outputFilePath as string)
            } catch (err) {
                reject(err)
            }
        })
    }

    setCurrentTimestamp(): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, "0")
        const day = String(currentDate.getDate()).padStart(2, "0")
        const hours = String(currentDate.getHours()).padStart(2, "0")
        const minutes = String(currentDate.getMinutes()).padStart(2, "0")
        const seconds = String(currentDate.getSeconds()).padStart(2, "0")

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }
}