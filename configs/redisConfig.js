const redis = require("redis");
const redisClient = redis.createClient({
    host: process.env.redisHost,
    password: process.env.redisPassword, 
    port: process.env.redisPort
});

module.exports = redisClient