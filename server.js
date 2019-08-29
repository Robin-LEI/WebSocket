var http = require('http')
var fs = require('fs')
var io = require('socket.io')
var mysql = require('mysql')

var systemErr = '系统错误'
var userReg = /^\w{6,32}/
var pwdReg = /^\w{6,32}/

var db = mysql.createPool({
  host: '172.31.212.31',
  user: 'root',
  password: '123456',
  database: '20190827'
})

var httpServer = http.createServer((req, res) => {
  fs.readFile(`www${req.url}`, (err, data) => {
    if(err) {
      fs.readFile(`www/404.html`, (err, data) => {
        if (err) {
          res.write(systemErr)
        } else {
          res.write(data.toString())
        }
        res.end()
      })
    } else {
      res.write(data.toString())
      res.end()
    }
  })
})

httpServer.listen(3001, '172.31.212.31', () => {
  console.log('server running 3001')
})

ws = io.listen(httpServer)

// 广播
let userSockArr = []

//创建连接
ws.on('connection', (sock) => {
  let currentUserName = ''
  let currentUserID = ''

  userSockArr.push(sock)

  //注册
  sock.on('reg', (user, pass) => {
    if (user) {
      if (userReg.test(user)) { // 用户名规则校验通过
        if (pass) {
          if (pwdReg.test(pass)) {
            db.query(`select * from user_table where username='${user}'`, (err, data) => {
              if (err) {
                sock.emit('reg_ret', 0, '数据库查询失败')
              } else {
                if (data.length >= 1) {
                  sock.emit('reg_ret', 0, '此用户名已经注册过')
                } else {
                  db.query(`insert into user_table (username,password,online) values('${user}','${pass}',0);`, err => {
                    if (err) {
                      sock.emit('reg_ret', 0, '数据库插入失败')
                    } else {
                      sock.emit('reg_ret', 1, '注册成功')
                    }
                  })
                }
              }
            })
          } else {
            sock.emit('reg_ret', 0, '密码格式不正确, 应该在6-32位之间')
          }
        } else {
          sock.emit('reg_ret', 0, '密码格式不正确, 应该在6-32位之间')
        }
        // 还需要去库里查询，该用户名是否已经被注册过
      } else {
        sock.emit('reg_ret', 0, '用户名在6-32位之间')
      }
    } else { // 用户名为空
      sock.emit('reg_ret', 0, '用户名不能为空')
    }
  })
  // 登录
  sock.on('login', (user, pass) => {
    // 需要去校验用户名和密码是否正确，即库里有没有该数据
    if (user) {
      if (userReg.test(user)) {
        if (pass) {
          if (pwdReg.test(pass)) {
            db.query(`select * from user_table where username='${user}' and password='${pass}'`, (err, data) => {
              if (err) {
                sock.emit('login_ret', 0, '数据库查询失败')
              } else {
                const dt = data[0]
                // 还需要把当前用户的状态online设置为1
                db.query(`update user_table set online=1 where username='${user}' and password='${pass}';`, err => {
                  if (err) {
                    sock.emit('login_ret', 0, '数据库信息更新失败')
                  } else {
                    currentUserName = dt.username
                    currentUserID = dt.ID
                    sock.emit('login_ret', 1, '登录成功', dt.username)
                  }
                })
              }
            })
          } else {
            sock.emit('login_ret', 0, '密码格式不正确, 应该在6-32位之间')
          }
        } else {
          sock.emit('login_ret', 0, '密码格式不正确, 应该在6-32位之间')
        }
      }
    } else {
      sock.emit('reg_ret', 0, '用户名不能为空')
    }
  })
  // 断开连接
  sock.on('disconnect', () => {
    // 拿到当前离开的用户的信息，把online状态设置为0
    db.query(`update user_table set online=0 where username='${currentUserName}' and ID='${currentUserID}'`, (err) => {
      if (err) { // 成功离线
        console.log(`${currentUserName}离开时，online状态更新失败`)
      } else {
        currentUserName = ''
        currentUserID = ''
        userSockArr = userSockArr.filter(item => item != sock)
      }
    })
  })
  // 接收聊天消息
  sock.on('sendChart', cont => {
    if (cont) {
      userSockArr.forEach(item => {
        if (item == sock) return
        item.emit('sendChart', currentUserName, cont)
      })
      sock.emit('sendChart_ret', 1, '消息发送成功')
    } else {
      sock.emit('sendChart_ret', 0, '不能发送空消息')
    }
  })
})

