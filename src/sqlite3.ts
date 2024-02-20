import { app } from 'electron'
import path from 'node:path'
import {
    type Database,
    verbose,
} from 'sqlite3'

let database: Promise<Database>

export function getSqlite3(filename = path.join(app.getPath('userData'), 'database.sqlite3')) {
    return database ??= new Promise<Database>((resolve, reject) => {
        const db = new (verbose().Database)(filename, error => {
            if (error) {
                reject(error)
            } else {
                resolve(db)
            }
        })

        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS profiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    url TEXT NULL,
                    username TEXT NOT NULL,
                    host TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    remote_path TEXT NULL,
                    gpg_key TEXT NOT NULL
                )
            `)

            db.run(`
                CREATE TABLE IF NOT EXISTS histories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project TEXT NOT NULL,
                    recipients TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    checksum TEXT NOT NULL,
                    checksum_algorithm TEXT NOT NULL,
                    compression_algorithm TEXT NOT NULL,
                    version TEXT NOT NULL
                )
            `)

            db.run(`
                CREATE TABLE IF NOT EXISTS gpg_keys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uid TEXT NOT NULL,
                    public_key TEXT NOT NULL,
                    private_key TEXT NOT NULL,
                    fingerprint TEXT NOT NULL UNIQUE
                )
            `)
        })
    })
}