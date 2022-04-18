# shortURL
<a href="https://imgur.com/xAjd1es"><img src="https://i.imgur.com/xAjd1es.png" title="source: imgur.com" /></a>
## Demo
<a href="https://stormy-fortress-99809.herokuapp.com/">歡迎使用縮網址服務</a>
## Synopsis
此專案提供縮網址服務，使用 Redis(NOSQL) 以及 MYSQL(RDBMS) 作為資料庫服務，  
Redis 為使用者提供熱資料的快速回應，並為存取的資料設置 Expire time ，避免資料過多佔據記憶體容量，  
MYSQL 始終抱持所有資料的存取，當資料在 Redis 上找不到時，會至這裡尋找，並在找到時重新存入 Redis 作為熱資料，  
此外，專案提供目標網站的 Open Graph ，以優化使用者體驗。  
最後，因專案部署在 heroku 的 free 方案下，在單一個 dyno 使用 PM2 cluster 模式，開啟多個 process ，以利於處理高流量高併發情況。
## Technology
### nodejs Express
專案構成語言及語言框架
### MYSQL
RDBMS 關聯式資料庫
### REDIS
NOSQL 做熱資料快取
### crypto-js/md5
雜湊套件，短網址隨機ID使用 md5 生成
### open-graph-scraper
用於從網站上抓取 Open Graph
### SQL Prepared Statement
參數化查詢，防禦SQL Injection攻擊。效能上佔有優勢
### PM2
cluster模式，開啟多個 process，緩解高流量高併發
## Exhibit
<a href="https://imgur.com/rM9iBsP"><img src="https://i.imgur.com/rM9iBsP.png" title="source: imgur.com" /></a>
<a href="https://imgur.com/xbOA55Y"><img src="https://i.imgur.com/xbOA55Y.png" title="source: imgur.com" /></a>
