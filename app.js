const express = require('express')
const bodyParser = require('body-parser')
const mySql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port, () => console.log(`Listen on port ${port}`))

const pool = mySql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'nodejs_crud',
    user: 'root'
})

app.get('/drinks', (req,res) => {
    pool.getConnection(
        (err, con) => {
            if(err) throw err
            console.log(`connnection as id ${con.threadId}`)
            con.query('select * from drinks', (err, rows) => {
                con.release()

                if(!err){res.send(rows)}
                else{console.log(err)}
            })
        }
    )
})

app.get('/drinks/:drinkID', (req,res) => {
    pool.getConnection(
        (err, con) => {
            if(err) throw err
            console.log(`connnection as id ${con.threadId}`)
            con.query('select * from drinks where id = ?', [req.params.drinkID], (err, rows) => {
                con.release()

                if(!err){res.send(rows)}
                else{console.log(err)}
            })
        }
    )
})

app.delete('/remove/:drinkID', (req,res) => {
    pool.getConnection(
        (err, con) => {
            if(err) throw err
            console.log(`connnection as id ${con.threadId}`)
            con.query('delete from drinks where id = ?', [req.params.drinkID], (err, rows) => {
                con.release()

                if(!err){res.send('Drink Removed')}
                else{console.log(err)}
            })
        }
    )
})

app.post('/add', (req,res) => {
    pool.getConnection(
        (err, con) => {
            if(err) throw err
            console.log(`connnection as id ${con.threadId}`)

            const params = req.body

            con.query('insert into drinks set ?', params, (err, rows) => {
                con.release()

                if(!err){res.send('Drink added')}
                else{console.log(err)}
            })
            console.log(req.body)
        })
})

app.put('/edit/:drinkID', (req,res) => {
    pool.getConnection(
        (err, con) => {
            if(err) throw err
            console.log(`connnection as id ${con.threadId}`)

            const {Id, Name, Stock, Description, Image} = req.body

            con.query(`update drinks set ? where id = ?`, [req.body, req.params.drinkID], (err, rows) => {
                con.release()

                if(!err){res.send('Drink edited')}
                else{console.log(err)}
            })
            console.log(req.body)
        })
})