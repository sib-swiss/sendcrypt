import {Profile} from "../../src/types";
import path from "path";
import fs from "fs";
import os from "os";
import {expect, test} from "vitest";
import {Metadata} from "../../src/lib/metadata";

const profile: Profile = {
    id: 1,
    gpg_key: `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
hYf7T3KUL96iOVfUjS4n3FDQ
=ZKdZ
-----END PGP PUBLIC KEY BLOCK-----
`,
    name: "Test",
    host: "https://example.com",
    url: "https://example.com",
    port: 22,
    remote_path: "/",
    username: "test",
}

const filePath = path.resolve(__dirname, "../stubs/test.txt")
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vitest-electron'))
const outputFilePath = path.join(tempDir, 'metadata.json')

test('metadata can generate the json file', async () => {
    const metadata = new Metadata(profile, 'fake-fingerprint')
    await metadata.save(filePath, outputFilePath)
    const stats = fs.statSync(outputFilePath)
    expect(stats.size).toBeGreaterThan(0)
})