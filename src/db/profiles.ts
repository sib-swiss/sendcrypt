import {Profile} from "@/types";
import {getSqlite3} from "@/sqlite3";

export const getProfiles = async (): Promise<Array<Profile>> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.all(`SELECT * FROM profiles`, (error, rows: Array<Profile>) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(rows)
                }
            })
        })
    })
}

export const getProfile = async (id: number): Promise<Profile> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.get(`SELECT * FROM profiles WHERE id = ? LIMIT 1`, id, (error, row: Profile) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(row)
                }
            })
        })
    })
}

export const removeProfile = async (id: number): Promise<null> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.run(`DELETE FROM profiles WHERE id = ?`, id, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(null)
                }
            })
        })
    })
}

export const addProfile = async (profile: Profile): Promise<number> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.run(`INSERT INTO profiles (name, url, username, host, port, remote_path, gpg_key) VALUES (?, ?, ?, ?, ?, ?, ?)`, [profile.name, profile.url, profile.username, profile.host, profile.port, profile.remote_path, profile.gpg_key], (error) => {
                if (error) {
                    reject(error)
                } else {
                    db.get("SELECT last_insert_rowid() AS lastId", [], (err, row: { lastId: number }) => {
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

export const editProfile = async (profile: Profile): Promise<number> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.run(`UPDATE profiles SET name = ?, url = ?, username = ?, host = ?, port = ?, remote_path = ?, gpg_key = ? WHERE id = ?`, [profile.name, profile.url, profile.username, profile.host, profile.port, profile.remote_path, profile.gpg_key, profile.id], (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(profile.id)
                }
            })
        })
    })
}