var User = require('../models/User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var express = require('express');
var router = express.Router();
var menu = require('../config/menu');
var auth = {
    router,
    checkAuthenticated: async function checkAuthenticated(req, res, next) {

        if (!req.header('authorization')) {
            return res.status(401).send({ message: "Unauthorized, missing auth header" })
        }
        var token = req.header('authorization').split(' ')[1];

        var payload = jwt.decode(token, '123')
        if (!payload) {
            return res.status(401).send({ message: "Unauthorized, Auth header Invalid" })
        }
        else {
            let userEmail = req.header('currentuseremail');
            let user = await User.findOne({ email: userEmail });
            let payload2 = { sub: user._id }
            let token2 = jwt.encode(payload2, '123');
            if (token != token2) {
                return res.status(401).send({ message: "Unauthorized, Auth header Invalid" })
            }
        }

        req.userId = payload.sub;

        next();
    }
}

router.post('/register', auth.checkAuthenticated, (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    user.save((err, result) => {
        if (err) {
            res.status(500).send({ message: 'error in saving user', err: err.errmsg })
        }
        else {
            res.status(200).send(result);
        }
    });
})

router.post('/login', async (req, res) => {
    var loginData = req.body;
    var sidebarMenu = [];
    var user = await User.findOne({ email: loginData.email });
    if (!user) {
        return res.status(200).send({ message: 'User Does not Exist' })
    }

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch) {
            return res.status(200).send({ message: 'Email or Password is Invalid' })
        }
        var payload = { sub: user._id }
        var token = jwt.encode(payload, '123');
        if (user.role == 'admin') {
            sidebarMenu = menu.admin;
        }
        else {
            sidebarMenu = menu.user;
        }
        res.status(200).send({ email: loginData.email, name: user.name, token: token, menu: sidebarMenu });
    })

});


module.exports = auth;