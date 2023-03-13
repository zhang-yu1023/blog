/**
 * multer 处理上传
 * sqlite3 数据库 方便服务端移植  install  sqlite3@5.0.0  不加具体版本会出错
 * uuid  生成唯一id
 * ****/

const express = require("express")
const multer = require("multer")
//实例化
const app = express();
//定义端口
const port = 8080;
const path = require("path")

const { db, genid } = require("./db/DbUtils")


//开发跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
})


//前后端交互
app.use(express.json())
//上传允许
const update = multer({
    dest: './public/upload/temp'
})
app.use(update.any())
//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")))

// category/_token/add
const ADIN_TOKEN_PATH = "/_token"  //检测带_token的路由
app.all("*", async (req, res,next) => {
    if (req.path.indexOf(ADIN_TOKEN_PATH) > -1) {
        let { token } = req.headers;
        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql, [token])
        if (adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return;
        } else {
            next()
        }
    } else {
        next()
    }
})

//注册路由
app.use("/test", require("./routers/TestRouter"))
app.use("/admin", require("./routers/AdminRouter"))
app.use("/category", require("./routers/CategoryRouter"))
app.use("/blog", require("./routers/BlogRouter"))
app.use("/upload", require("./routers/UploadRouter"))


app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen((port), () => {
    console.log(`启动成功：http://localhost:${port}/`)
})