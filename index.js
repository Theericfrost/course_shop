const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/order')
const authRoutes = require('./routes/auth')


// const User = require('./models/user');

const varMiddleWare = require('./middleware/variables')
const userMiddleWare = require('./middleware/user')
const keys = require('./keys')


const server = express();

const hbs = exphbs.create({
  defaultLayout : "main",
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
})

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

server.engine('hbs', hbs.engine);
server.set('view engine' , 'hbs');
server.set('views', 'views');



server.use(express.static(path.join(__dirname, 'public')))
server.use(express.urlencoded({extended : true}))

server.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: true, 
  store: store
}))

server.use(csrf())
server.use(flash())
server.use(varMiddleWare)
server.use(userMiddleWare)

server.use('/',homeRoutes)
server.use('/courses',coursesRoutes)
server.use('/add',addRoutes)
server.use('/card', cardRoutes)
server.use('/orders', ordersRoutes)
server.use('/auth', authRoutes)


const port = process.env.PORT || 3000

async function start(){
  try {
    
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false 
    })
   
    server.listen(port , ()=> {
    console.log(`Сервер запущен на порте ${port}`)
  })
  } catch(error){
    console.log(error)
  }
} 

start()





