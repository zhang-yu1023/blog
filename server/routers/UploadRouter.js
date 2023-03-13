const express = require("express")
const router = express.Router()
const fs = require("fs")
const { db, genid } = require("../db/DbUtils")

router.post("/rich_editor_upload", async (req, res) => {
    if (!req.files) {
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return;
    }

    let files = req.files;
    let ret_files = [];

    for (let file of files) {
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        //随机文件名字
        let file_name = genid.NextId() + "." + file_ext;

        // var form = new formidable.IncomingForm();
        // form.uploadDir = "/public/upload/temp/";
        //修改名字加移动文件 
        // fs.renameSync()报错 //https://www.cnblogs.com/readerman/p/10286971.html
        // fs.renameSync(   //renameSync不能创建文件夹
        //     process.cwd() + "/public/upload/temp/" + file.filename,
        //     process.cwd() + "/public/upload/" + file_name
        // )

        //解决renameSync不能创建文件夹，但是文件并没有存入upload
        var is = fs.createReadStream("./public/upload/temp/" + file.filename);
        var os = fs.createWriteStream("./public/upload/" + file_name);
        is.pipe(os);
        is.on('end',function() {
            fs.unlinkSync("./public/upload/temp/" + file.filename);
        });


        ret_files.push("/upload/" + file_name);
        console.log(ret_files,files)

    }

    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src ，必须
        }
    })
})

module.exports = router