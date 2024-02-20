import {expect, test} from "vitest";
import path from "path";
import {Hash} from "../../src/lib/checksum";

const filePath = path.resolve(__dirname, "../stubs/test.txt");


test('checksum works with one file', async () => {
    const hash = new Hash()

    expect(await hash.checksum(filePath))
        .toBe('c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a')
})

test('checksums works with multiple files', async () => {
    const hash = new Hash()

    expect(await hash.checksums([
        filePath,
        filePath,
        filePath
    ]))
        .toStrictEqual([
            {
                checksum: 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a',
                file: 'test.txt'
            },
            {
                checksum: 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a',
                file: 'test.txt'
            },
            {
                checksum: 'c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a',
                file: 'test.txt'
            }
        ])
})

