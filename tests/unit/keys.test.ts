import {expect, test} from "vitest";
import {Keys} from "../../src/lib/keys";

const privateArmoredKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
J9xQ0A==
=g0jl
-----END PGP PRIVATE KEY BLOCK-----`
const keys = new Keys()

test('keys can check if a passphrase is invalid', async () => {
    const {needsPassphrase, passphrase} = await keys.verifyGpgKeyPassphrase('test', privateArmoredKey)

    expect(needsPassphrase).toBe(true)
    expect(passphrase).toBeUndefined()
})

test('keys can check if a passphrase is valid', async () => {
    const {
        needsPassphrase,
        passphrase
    } = await keys.verifyGpgKeyPassphrase('pantyhose-curdle-quadrant-tables', privateArmoredKey)

    expect(needsPassphrase).toBe(false)
    expect(passphrase).toBeUndefined()

})

test('keys can generate a new pair of keys', async () => {
    const { gpgPrivateKey, gpgPublicKey} = await keys.generateGpgKeys(
        'test@example.com',
        'test'
    )

    expect(gpgPrivateKey).toBeDefined()
    expect(gpgPublicKey).toBeDefined()
}, 10000)


test('keys can generate a new pair of SSH keys', async () => {
    const {sshPrivateKey, sshPublicKey} = await keys.generateSshKeys()

    expect(sshPrivateKey).toBeDefined()
    expect(sshPublicKey).toBeDefined()
})