const md5 = require("crypto-js/md5")

const utils = {
    createHash : () => {
        try {
            // 隨機亂數，並且做雜湊
            const randomCode = Math.random().toString(36).substring(2,10)
            +  Date.now().toString(36).substring(4,10)
            return md5(randomCode).toString().toUpperCase().substring(0, 8)
        } catch (error) {
            console.log("createHash catch error", error)
            return false
        }
    }, 
}

module.exports = utils;
