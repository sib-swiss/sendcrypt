import {getSqlite3} from "@/sqlite3";
import {History, Metadata} from "@/types";

export const getHistories = async (): Promise<Array<History>> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.all(`SELECT * FROM histories ORDER BY id DESC`, (error, rows: Array<History>) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(rows)
                }
            })
        })
    })
}

export const addHistory = async (history: Metadata): Promise<number> => {
    return new Promise((resolve, reject) => {
        getSqlite3().then(db => {
            db.run(`INSERT INTO histories (project, recipients, timestamp, checksum, checksum_algorithm, compression_algorithm, version) VALUES (?, ?, ?, ?, ?, ?, ?)`, [history.project, JSON.stringify(history.recipients), history.timestamp, history.checksum, history.checksum_algorithm, history.compression_algorithm, history.version], (error) => {
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