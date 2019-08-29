var mysql = require('mysql')

var db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: '20190827'
})

db.query('select * from user_table', (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log(JSON.stringify(data))
    }
})
