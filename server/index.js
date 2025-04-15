require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')
const session = require('express-session')
const path = require('path')

const server = express()

server.set('view engine', 'ejs')
server.set('views', path.join(process.cwd(), 'views'))

server.use(express.json())
server.use(cors())
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,             // не сохраняем сессию, если она не изменилась
    saveUninitialized: false,  // не сохраняем пустую сессию
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // срок жизни cookie — 30 дней
        secure: false,                   // true для HTTPS в production
    }
}));

const staticPath = path.join(__dirname, '../client/build');
console.log(staticPath)
server.use(express.static(staticPath));

server.use('/', require('./routes/index.js'))

// server.get('*', (req, res) => {
//     req.query
//   res.sendFile(path.join(staticPath, 'index.html'));
// });


const start = async (port) =>
{
    try
    {
        await sequelize.authenticate()
        await sequelize.sync()

        server.listen(port, () => console.log(`Нам очень хорошо с тобой на порту ${port}`))
    }
    catch (e)
    {
        console.log(e)
    }
}

start(PORT = process.env.PORT).catch((e) =>
{
    console.log(`Сервер не взлетел на порту ${PORT}`)
})