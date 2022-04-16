const express = require("express");
const bodyParser = require("body-parser");
const md5 = require("crypto-js/md5");
const ogs = require('open-graph-scraper');
const redisClient = require("./configs/redisConfig");
const utils = require("./utils/utils");
const mysqlUtils = require("./utils/mysqlUtils");
const port = process.env.PORT || 3006;
const app = express();
const threeDay = 259200;

app.set("view engine", "ejs");
app.set('trust proxy', true);

app.use(express.static(__dirname + '/views/css'));
app.use(express.static(__dirname + '/views/javascript'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 首頁
app.get("/", (req, res) => {
    res.render("index");
});

// 縮短網址服務
app.post("/service", async (req, res) => {
    try {
        const url =  decodeURI(req.body.url);
        const options = { url };
        console.log("/service URL：", url);
        const ogs_data = await ogs(options);
        if (ogs_data.error) {
            console.log("/service ERROR: 無效網址");
            res.status(400);
            return res.json({ok: false});
        };
        const ogImage = ogs_data.result.ogImage ? ogs_data.result.ogImage.url : null;
        const ogTitle = ogs_data.result.ogTitle || null;
        const domain = req.hostname;
        const hashUrl = md5(url).toString();
        const hashId = utils.createHash();
        if (!hashUrl || !hashId) {
            console.log("/service ERROR: 產生哈希值失敗");
            res.status(500);
            return res.json({ok: false});
        };
        console.log(`hashId:${hashId} hashUrl:${hashUrl}`)
        // 取得 client ip 位置 兩個方式對應有無 proxy 的情況
        const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;
        console.log("/service IP為：", ip);
        const params = { hashId, url, ip, hashUrl };
        // 處理資料庫
        handleSaveData(params, (err, result) => {
            if (err) {
                res.status(500);
                return res.json({ok: false});
            };
            const { hashId, dedupIpCount } = result;
            const hashValue = "https://" + domain + ":3006" + "/shortURL/" + hashId;
            console.log(`/service success hashValue: ${hashValue} dedupIpCount: ${dedupIpCount} ogImage: ${ogImage} ogTitle: ${ogTitle}`);
            res.status(200);
            return res.json({ok: true, hashValue, dedupIpCount, ogImage, ogTitle});
        });
    } catch (error) {
        console.log("Post /service catch error", error);
        res.status(500);
        return res.json({ok: false});
    };
});

// 轉址
app.get("/shortURL/:hashId", async (req, res) => {
    try {
        const hashId = req.params.hashId;
        let url = await redisClient.get(hashId);
        // redis 無資料，找 RDBMS
        if (!url) {
            console.log("/shortURL Redis 無資料，查找 Mysql database");
            const isValue = await mysqlUtils.getDb(hashId, "hashId");
            if (isValue) {
                console.log("/shortURL Mysql 找到資料，重新寫回 redis 熱資料");
                // 如果 db 裡有資料，就重新將資料加入redis“熱資料”當中
                await redisClient.set(hashId, isValue.url, { EX: threeDay });
                await redisClient.set(isValue.hashUrl, hashId, { EX: threeDay });

                url = isValue.url;
            };
            if (!isValue) {
                console.log("/shortURL ERROR 沒有資料");
                res.status(400);
                return res.json({ok: false});
            };
        };
        console.log("/shortURL success");
        res.status(302);
        return res.redirect(url);
    } catch (error) {
        console.log("Get /shortURL catch error", error);
        res.status(500);
        return res.json({ok: false});
    };
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    redisClient.connect();
    redisClient.on("connect", () => {
        console.log("Redis client connected");
    });
});

// 處理資料儲存
async function handleSaveData (params, cb) {
    try {
        const { url, ip, hashUrl } = params;
        let { hashId } = params;
        const redisData = await redisClient.get(hashUrl);
        if (redisData) hashId = redisData;
        // redis 無資料或資料已過期，接著去資料庫確認
        if (!redisData) {
            const mysqlData = await mysqlUtils.getDb(hashUrl, "hashUrl");
            if (mysqlData) hashId = mysqlData.hashId;
            if (!mysqlData) {
                const inserData = await mysqlUtils.saveDb(params);
                console.log("/service 新資料存進 mysql database, ID為：", inserData.insertId);
            };
            await redisClient.set(hashId, url, { EX: threeDay });
            await redisClient.set(hashUrl, hashId, { EX: threeDay });
            console.log("/service redis資料寫入");
        }
        const urlDedupIpCountKey = hashUrl + ":dedupIpCount";
        await redisClient.sAdd(urlDedupIpCountKey, ip);
        const dedupIpCount = await redisClient.sCard(urlDedupIpCountKey);
        return cb(null, { hashId, dedupIpCount });
    } catch (error) {
        console.log("/service handleData catch error", error);
        return cb(error);
    };
};