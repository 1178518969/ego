let express = require("express");

let md5 = require('md5-node');//加密

let bodyParser = require("body-parser");//post请求

let mysql = require("mysql");//连接数据库

let connection = mysql.createConnection({//连接数据库
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web'
});
connection.connect();//连接数据库

let app = express();

app.use(bodyParser.urlencoded({
    extended: false
}))//post请求

app.post("/user", (req, res) => {
    // console.log(req)
    let sql = "select * from user";
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            throw err;
        };

        let flag = true;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == req.body.username) {
                flag = false;
                if (rows[i].password == req.body.password) {
                    res.send({
                        msg: "登陆成功",
                        code: "1",
                        token: md5({ uname: rows[i].username, password: rows[i].password }),
                        username: req.body.username
                    })
                }else{
                    res.send({
                        msg:"用户名或密码错误",
                        code:"2"
                    })
                }
            }
        }

        if(flag){
            res.send({
                msg:"用户名不存在",
                code:"3"
            })
        }
    })
})

app.listen("3000", function () {
    console.log("运行在3000端口")
})