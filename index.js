const express = require('express')
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT;
const bodyParser = express.json;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./config/db');
const bot = require('./bot')
const { register, login, getMe, setEmargement } = require('./Controlers/user');
const { addDemandeVip, getDemandeVip } = require('./Controlers/demandeVip');
const { checkAuth, isAdmin } = require('./Controlers/middlewares/auth');
const { DB_CON_STRING } = process.env
db();

app.use(cors())
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// authenticate
app.post('/api/register', register)
app.post('/api/login', login)
    // demander vip
app.post("/api/demandeVip", addDemandeVip)
app.get('/api/demandeVip', [isAdmin], getDemandeVip)
app.post('/api/emargement', setEmargement)

// get current user
app.get('/api/user', getMe)




app.listen((process.env.PORT || 8081), () => {
    console.log(` app listening on port ${process.env.PORT}!`)
});