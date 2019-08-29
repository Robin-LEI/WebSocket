var http = require('http')
var io = require('socket.io')
//创建http服务
var hts = http.createServer()
hts.listen(8080, () => {
    console.log('running')
})
//创建websocket服务
var wsS = io.listen(hts)
wsS.on('connection', function (sock) {

    sock.on('test', function (n1, n2) {
        console.log(n1, n2)
    })

})

