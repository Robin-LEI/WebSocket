var http = require('http')
var mysql = require('mysql')
var fs = require('fs')
var url = require('url')
var io = require('socket.io')
//1 success
//0 failure
var db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: '20190827'
})

var httpServer = http.createServer((req, res) => {
  const {pathname, query} = url.parse(req.url, true)
  const {username, pass} = query
  if (pathname == '/reg') {
    res.setHeader('content-type', 'text/plain;charset=utf-8')
    //先要判断用户名是否已经存在，如果存在，返回消息提示
    db.query(`select * from user_table where username='${username}';`, (err, data) => {
      if (err) {
        res.write(JSON.stringify({code: 0, msg: '数据库查询错误'}))
        res.end()
      } else {
        if (data.length >= 1) {
          res.write(JSON.stringify({code: 0, msg: '此用户名已经注册过'}))
          res.end()
        } else {
          db.query(`insert into user_table (username,password,online) values('${username}','${pass}',0);`, (err, data) => {
            if (err) {
              res.write(JSON.stringify({code: 0, msg: '数据库添加数据错误'}))
            } else {
              res.write(JSON.stringify({code: 1, msg: '注册成功'}))
            }
            res.end()
          })
        }
      }
    })
    //如果不存在，把改用户名和对应的密码存如数据库，返回成功的提示信息
  } else if(pathname == '/login') {

  } else { // 请求文件
    fs.readFile(`www${req.url}`, (err, data) => {
      if (err) {
        // 找不到文件，显示404页面
        fs.readFile('www/404.html', (err, data) => {
          if (err) {
            res.writeHeader(404)
            res.write('对不起，系统错误')
          } else {
            res.writeHeader(302)
            res.write(data.toString())
          }
          res.end()
        })
      } else {
        res.writeHeader(200)
        res.write(data.toString())
        res.end()
      }
    })
  }
})

httpServer.listen(3000, () => {
  console.log('running')
})
