const redis = require("redis");
const redisClient = redis.createClient({
    host: process.env.redisHost,
    password: process.env.redisPassword, 
});

module.exports = redisClient