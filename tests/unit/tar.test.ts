import {expect, test} from "vitest";
import path from "path";
import {Tar} from "../../src/lib/tar";
import fs from "fs";
import * as os from "os";

const filePath = path.resolve(__dirname, "../stubs/test.txt")
const checksumFilePath = path.resolve(__dirname, "../stubs/checksum.sha256")
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vitest-electron'))
const outputFilePath = path.join(tempDir, 'data.tar.gz')

test('tar can archive a file and checksum file', async () => {
    const tar = new Tar()

    await tar.archive([filePath], checksumFilePath, outputFilePath)

    const stats = fs.statSync(outputFilePath)

    expect(stats.size)
        .toBeGreaterThan(0)
})

