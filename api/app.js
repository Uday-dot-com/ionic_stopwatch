var express = require('express');
var app = new express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User');
var auth = require('./controllers/auth');
const db = require('./config/db').database;
var api = require('./controllers/api');
var report = require('./controllers/report');

mongoose.connect(db, { useNewUrlParser: true,
     useUnifiedTopology: true}).then(() => {
    console.log("Databse Connected Successfully")
}).catch(() => {
    console.log('unable to connect to database')
});

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(auth.router);
app.use('/auth', auth.router)
app.use('/api', api)
app.use('/report', report)
app.listen(3000, () => {
    let admin = {
        email: "shauryamsolutions@gmail.com",
        password: "12345",
        name: "sysAdmin",
        role: "admin"
    };

    User.find({ email: admin.email }, function (err, doc) {
        if (doc.length) {

        } else {
            let user = new User(admin);
            user.save((err, result) => {
                if (err) {
                    console.log(err);

                }
                else {
                    console.log('Admin User Created', result);
                }
            });
        }
    });

});