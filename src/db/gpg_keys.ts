import {getSqlite3} from "@/sqlite3";
import {GpgKey, GpgKeyIdentity} from "@/types";

export const getGpgKeys = async (): Promise<Array<GpgKeyIdentity>> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.all(`SELECT * FROM gpg_keys ORDER BY id DESC`, (error, rows: Array<GpgKeyIdentity>) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(rows)
                }
            })
        })
    })
}

export const getGpgKey = async (id: number): Promise<GpgKeyIdentity> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.get(`SELECT * FROM gpg_keys WHERE id = ? LIMIT 1`, id, (error, row: GpgKeyIdentity) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(row)
                }
            })
        })
    })
}

export const addGpgKey = async (gpgKey: GpgKey): Promise<number> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.run(`INSERT INTO gpg_keys (uid, private_key, public_key, fingerprint) VALUES (?, ?, ?, ?)`, [gpgKey.uid, gpgKey.private_key, gpgKey.public_key, gpgKey.fingerprint], (error) => {
                if (error) {
                    reject(error)
                } else {
                    db.get("SELECT last_insert_rowid() AS lastId", [], (err, row: {lastId: number}) => {
                        if (err) {
                            reject(err)
                        } else {
                            const lastInsertedRowId = row.lastId
                            resolve(lastInsertedRowId)
                        }
                    });
                }
            })
        })
    })
}