const sqlite3 = require("sqlite3").verbose()
const path = require("path")
//引入雪花ID
const GenId = require("../utils/SnowFlake")

//连接数据库
var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"))

//promise 封装
db.async = {}
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}

db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}

const genid = new GenId({ WorkerId: 1 })




//导出
module.exports = { db, genid }