const express=require('express')
const mongoose=require('mongoose')
const exphbs  = require('express-handlebars')
const bosyParser=require('body-parser')
const Todo=require('./models/todo')// 載入 Todo model
const bodyParser = require('body-parser')
const port=3000;


const app=express()

mongoose.connect('mongodb://127.0.0.1:27017/todo-list')

const db=mongoose.connection

db.on('error',()=>{
    console.log('mongodb error!')
})

db.once('open',()=>{
    console.log('mongodb connected!')
})


// 设置模板引擎
app.engine('.hbs', exphbs({defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs')

app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    Todo.find()// 取出 Todo model 裡的所有資料
        .lean()// 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
        .then(todos=>res.render('index',{todos:todos}))// 將資料傳給 index 樣板
        .catch(error=>console.error(error))// 錯誤處理
})

app.get('/todos/new',(req,res)=>{
    return res.render('new')
})

app.post('/todos',(req,res)=>{
    const name=req.body.name// 從 req.body 拿出表單裡的 name 資料
    
    return Todo.create({name})// 存入資料庫
        .then(()=>res.redirect('/'))// 新增完成後導回首頁
        .catch(error=>console.error(error))
    })

app.listen(3000,()=>{
    console.log('app is running on http://localhost:3000')
})