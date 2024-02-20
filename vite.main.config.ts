import {defineConfig} from 'vite';
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
        mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        rollupOptions: {
            external: [
                'sqlite3',
                'openpgp',
                'ssh2',
                'ssh2-promise',
            ],
        },
        sourcemap: 'inline',
        minify: process.env.MODE !== 'development',
    }
});
