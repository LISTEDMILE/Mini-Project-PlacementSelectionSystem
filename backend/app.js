const express = require('express');
const hostRouter = require('./routes/hostRouter');
const storeRouter = require('./routes/storeRouter');
const authRouter = require('./routes/authRouter');
const errorr = require('./controllers/errorrController');
const rootDir = require("./utils/pathUtils");
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const DB_path = "mongodb+srv://place:place@placement.4nretom.mongodb.net/";
const cors = require('cors');


const app = express();

app.set('view engine', 'ejs');
app.set('views','views');

const store = new MongoDBStore({
    uri: DB_path,
    collection:'sessions'
})

app.use(cors({origin: 'http://localhost:5173', // or wherever your frontend is running
    credentials: true
}));
    
app.use(express.static(path.join(rootDir,'public')));
app.use(express.urlencoded());
app.use(express.json());


    app.use(session({
        secret: "NodeJs",
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
          httpOnly: true,
          secure: false, // true if you're using HTTPS
          sameSite: 'lax' // or 'none' if using secure + HTTPS
        }
      }));
      

app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});
      

app.use("/", authRouter);
app.use("/host",hostRouter);
app.use("/store",storeRouter);

app.use(errorr.errorr);



PORT = 3000;

mongoose.connect(DB_path).then(() => {
    app.listen(PORT,() => {
        console.log(`Server Running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.log("error connecting to server", err);
})
