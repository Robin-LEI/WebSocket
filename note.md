### socket.io
- npm i socket.io -S
- 可以兼容到ie6
- io.on('connection', (sock) => {})

### 背景
- 浏览器和服务端走的是http协议
- 基于http
- 后台可以主动给前台发送内容

### WebSocket--socket.io
- 服务端
    + 先创建http服务
    + 在创建WebSocket服务 io.listen(httpServer)
    
1. 状态吗写在writeHeader
2. devDependencies // -D npm install

### WebSocket 
- 天然可跨域
- sock.on('disconnect', () => {}) // 监听客户端离线
- 比ajax安全
- 使用WebSocket时服务端的createServer里不在写各种校验逻辑

### 数据库
1. 关系型-mysql,oracle,强大，性能偏低
2. 文件型-简单，sqlite，支撑不了庞大的数据
3. 文档型-可以直接存储对象本身，mongodb，不够严谨，性能偏低，灵活
4. 空间型-存储坐标、位置

**NoSQL**
- redis
- memcached
- bigtable

### MySQL
1. npm search mysql
2. npm i mysql
3. 库--文件夹，本身不能存储数据
4. 表--文件，存储数据
5. 主键--唯一，本质上是一个index
6. createConnection({host,user,password,database}) // 创建单个连接
7. createPool // 连接池
8. 四大查询语句crud(增删改查)

### CRUD
- 增
```javascript
insert into 表 (字段列表) values(值);
```
- 删
```javascript
delete from 表 where 条件1 and 条件2; 
```
- 改
```javascript
update 表 set 字段=新值,字段=新值 where 条件;
```
- 查
```javascript
select 字段列表 from 表 where 条件;
```

1. db.query('sql语句', (err, data) => {})
2. 请求文件
3. 请求接口
4. 映射
5. 服务器校验极其重要

### 接口
1. 用户注册
2. 用户登录

### url
1. url.parse(url, true) // 把&也解析

### 前台WebSocket
1. sock.on()写在外面, 避免重复绑定sock事件
2. sock.once() // 不推荐这种
3. 在chrome network上不容易调试

### websocket、socket、ajax
1. 基于html5的浏览器与服务器之间异步通信的方法，服务器可以主动向客户端发送信息，客户端也可以主动向服务端发送消息，属于服务器推送技术的一种
2. ajax只能单向从客户端向服务端请求服务
3. socket 是基于TCP/IP协议的传输层和应用层的一个编程接口，和websocket毫无关系，就像Java和JavaScript


