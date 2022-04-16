const db = require("../configs/mysqlConfig")
const urlModels = {
    saveUrl: (params, cb) => {
        const { hashId, url, ip, hashUrl } = params
        const sql = "INSERT INTO url_mapping(hashId, url, ip, hashUrl) VALUES(?, ?, ?, ?)"
        db.query(sql, [hashId, url, ip, hashUrl], (err, result) => {
            if (err) {
                return cb(err)
            }
            return cb(null, result)
        })
    }, 
    getUrl: (param, type, cb) => {
        const sql = `SELECT * FROM url_mapping WHERE ${type} = ?`
        db.query(sql, [param], (err, result) => {
            if (err) {
                return cb(err)
            }
            return cb(null, result[0])
        })
    }
}

module.exports = urlModels;