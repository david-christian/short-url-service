module.exports = {
  apps : [{
    name: "shortURL",
    script: "./app.js",
    time: true, 
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode: 'cluster',
    instances: 'max',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
