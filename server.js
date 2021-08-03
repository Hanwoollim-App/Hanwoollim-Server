const express = require("express");
const cors = require("cors");

const app = express();
require('dotenv').config();
var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


var corsOptions = { origin: "http://localhost:8081" };

// cors provides Express middleware to enable CORS
app.use(cors(corsOptions));


const db = require("./models");
const Position = db.position;


// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

function initial() {
    Position.create({
        pid: 0,
        name: "chairman"
    });

    Position.create({
        pid: 1,
        name: "admin"
    });

    Position.create({
        pid: 2,
        name: "user"
    });

    Position.create({
        pid: 3,
        name: "not_approved"
    });
}



app.get("/", (req, res) => {
    res.json({ message: "This is the root page of Hanwoolim application."});
});

// routes
require('./routes/auth.routes')(app);
require('./routes/homepage.routes')(app);

const user = require('./routes/user.routes');
const manager = require('./routes/manager.routes');

app.use('/user', user);
app.use('/manager', manager);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});