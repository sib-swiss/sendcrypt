import type {ForgeConfig} from '@electron-forge/shared-types';
import {MakerZIP} from '@electron-forge/maker-zip';
import {VitePlugin} from '@electron-forge/plugin-vite';
import 'dotenv/config';
import MakerDeb from "@electron-forge/maker-deb";
import MakerSquirrel from "@electron-forge/maker-squirrel";
import MakerDMG from "@electron-forge/maker-dmg";

const config: ForgeConfig = {
    publishers: [
        {
            name: '@electron-forge/publisher-electron-release-server',
            config: {
                baseUrl: 'https://update.sendcrypt.sib.swiss',
                username: process.env.ERS_USERNAME,
                password: process.env.ERS_PASSWORD,
            }
        },
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'sib-swiss',
                    name: 'sendcrypt'
                },
                prerelease: true,
                authToken: process.env.GITHUB_TOKEN
            }
        }
    ],
    packagerConfig: {
        asar: true,
        ignore: [
            '.idea',
            '.env',
            '.eslintrc.js',
            '.gitignore',
            'CONTRIBUTING.md',
            'forge.config.ts',
            'README.md',
            'screenshot.png',
            'tsconfig.json',
        ],
        icon: 'icons/icon',
        osxSign: {
            identity: 'Developer ID Application: SIB Institut Suisse de Bioinformatique (7FTLFTUA9T)',
        },
        osxNotarize: {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD,
            teamId: process.env.TEAM_ID,
        },
        appCopyright: `© ${new Date().getUTCFullYear()} SIB Swiss Institute of Bioinformatics - All rights reserved`,
        appBundleId: 'sib.swiss.sendcrypt'
    },
    rebuildConfig: {},
    makers: [
        new MakerZIP({}, [
            'darwin',
        ]),
        new MakerSquirrel({
            iconUrl: 'https://sendcrypt.sib.swiss/favicon.ico',
            setupIcon: 'icons/icon.ico',
            name: 'SendCrypt',
            signWithParams: '/tr http://timestamp.sectigo.com /td sha256 /fd sha256',
        }),
        new MakerDeb({
            options: {
                name: 'SendCrypt',
                icon: 'icons/icon.png',
                bin: 'SendCrypt'
            },
        }),
        new MakerDMG({
            name: 'SendCrypt',
            icon: 'icons/icon.icns',
            format: 'ULFO',
            appPath: 'SendCrypt.app',
        }),
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {}
        },
        {
            name: '@electron-forge/plugin-electronegativity',
            config: {
                isSarif: true
            }
        },
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: 'src/main.ts',
                    config: 'vite.main.config.ts',
                },
                {
                    entry: 'src/preload.ts',
                    config: 'vite.preload.config.ts',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
    ],
};

export default config;
