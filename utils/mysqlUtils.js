const urlModel = require("../models/urlModels")

const mysqlUtils = {
    saveDb: (params) => {
        return new Promise ((res, rej) => {
            urlModel.saveUrl(params, (err, result) => {
                if (err) {
                    return rej(err)
                }
                return res(result)
            })
        })
    }, 
    getDb: (param, type) => {
        return new Promise ((res, rej) => {
            urlModel.getUrl(param, type, (err, result) => {
                if (err) {
                    return rej(err)
                }
                return res(result)
            })
        })
    }
}
module.exports = mysqlUtils;