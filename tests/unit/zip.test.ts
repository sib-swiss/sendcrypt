import path from "path";
import fs from "fs";
import os from "os";
import {expect, test} from "vitest";
import {Zip} from "../../src/lib/zip";

const filePath = path.resolve(__dirname, "../stubs/test.txt")
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vitest-electron'))
const outputFilePath = path.join(tempDir, 'data.zip')

test('zip can archive a file', async () => {
    const zip = new Zip(tempDir)

    await zip.archive([filePath], outputFilePath)

    const stats = fs.statSync(outputFilePath)

    expect(stats.size)
        .toBeGreaterThan(0)
})