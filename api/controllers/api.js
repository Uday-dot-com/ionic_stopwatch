var express = require('express');
var router = express.Router();
const saveTemplate = require('../models/SaveTemplate');
const CardData = require('../models/cardData');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Bank = require('../models/Bank');
const Card = require('../models/Card');
var auth = require('./auth');
var User = require('../models/User');
const NodeRSA = require('node-rsa');
const run = new NodeRSA({b: 512});
//const publicDer = key.exportKey('pkcs8-public-der');
//const privateDer = key.exportKey('pkcs1-der');

//Add Banks
router.post('/addbank', auth.checkAuthenticated, (req, res) => {
   var e= run.encryptPrivate('uday').toString("base64")
    var d=run.decryptPublic(e).toString('utf8');
    console.log(d);
    var userData = req.body;
    var bank = new Bank(userData);
    bank.save((err, doc) => {
        if (err) {
            res.status(200).json({ message: "Adding Bank Error" });
        }
        else {
            res.status(200).json({ message: "Successfully Added", document: doc });
        }
    });
});

//Get Banks
router.get('/getBanks', auth.checkAuthenticated, async (req, res) => {
    try {
        var banks = await Bank.find({})
        res.status(200).send(banks)
    } catch (err) {
        res.status(500);
    }
});

//Update Bank
router.put('/updateBank',  auth.checkAuthenticated, async (req, res) => {
    await Bank.findByIdAndUpdate(req.body.id, req.body, function (err, doc) {
        if (err) {
            res.status(400).json({ mesage: 'error in fetching card data', error: err });
        }
        else {
            res.status(200).json(doc);
        }
    })
});

//Delete Bank
router.delete('/deleteBank/:id',  auth.checkAuthenticated, async (req, res, next) => {
    await Card.find({ bank: req.params.id }, function (err, doc) {
        if (doc != undefined) {
            if (doc.length) {
                res.status(200).json({ message: "Bank Cannot be Deleted" });
            }
            else {
                mongoose.set('useFindAndDelete', true);
                Bank.findByIdAndRemove(req.params.id, (err) => {
                    if (!err) {
                        res.status(200).json({ message: "Successfully Deleted" });
                    } else {
                        return next(err);
                    }
                })
            }
        }

    })
});

//Get Cards for a Given Bank
router.get('/getCardsForBank/:bankId', auth.checkAuthenticated, (req, res) => {
    Card.find({ bank: req.params.bankId }, function (err, doc) {
        if (doc != undefined) {
            if (doc.length) {
                res.status(200).json(doc);
            }

        }
        else {
            res.status(400).json({ err: 'no card found' });
        }
    }).populate('bank').catch((err) => {
        res.status(400).json(err);
    });
});

//Add Cards
router.post('/addCard', auth.checkAuthenticated,(req, res) => {
    var userData = req.body;
    var card = new Card(userData);
    var resultObj;
    var matchFound = false;
    Card.find({ cardName: card.cardName }, function (err, result) {
        if (result.length) {
            for (var index = 0; index < result.length; index++) {
                resultObj = result[index];
                var requestBank = String(card.bank);
                var resultBank = "" + resultObj.bank;
                if (requestBank == resultBank) {
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                card.save((err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: 'saving card error' })
                    }
                    else {
                        res.status(200).send(result);
                    }
                });
            }
            else {
                res.status(500).send({ message: 'saving card error' })
            }

        }
        else {
            card.save((err, result) => {
                if (err) {
                    res.status(500).send({ message: 'saving card error' })
                }
                else {
                    res.status(200).send(result);
                }
            });
        }
   }).collation({ locale: "en", strength: 2 });
});

//Get Cards
router.get('/getCards', auth.checkAuthenticated,(req, res) => {
    Card.find(function (err, doc) {
        if (doc.length) {
            res.status(200).json(doc);
        }
        else {
            res.status(400).json({ err: 'no card found' });
        }
    }).populate('bank').catch((err) => {
        res.status(400).json(err);
    });
});

//update Card
router.put("/editCard", auth.checkAuthenticated, async (req, res) => {
    await Card.findByIdAndUpdate(req.body._id, req.body, function (err, doc) {
        if (err) {
            res.status(400).json({ mesage: 'error in fetching card data', error: err });
        }
        else {
            res.status(200).json(doc);
        }
    });
});

//Delete Card
router.delete('/deleteCards/:CardId', auth.checkAuthenticated, (req, res, next) => {
    var id = req.params.CardId;
    Card.findByIdAndRemove(id).then(Card => {
        Card.delete().then(Card => {
            res.send({
                message: 'Card deleted successfully',
                status: 'success',
                Card: Card
            })
        })
            .catch(err => console.log(err))
    })
        .catch(err => console.log(err))
});

//Get Card Details
router.get('/getCardDetails/:cardId', auth.checkAuthenticated,(req, res, next) => {
    Card.find({ _id: req.params.cardId }, function (err, doc) {
        if (doc != undefined) {
            if (doc.length) {
                res.status(200).json(doc);
            }
        }
        else {
            console.log("Error Occured");
            res.status(400).json({ err: 'No Card found' });
        }
    }).populate('bank').catch((err) => {
        res.status(400).json(err);
    });
});

//Save Card Details
router.put('/saveCardDetails',auth.checkAuthenticated,async (req, res, next) => {
    await Card.findByIdAndUpdate(req.body._id, req.body, function (err, doc) {
        if (err) {
            res.status(400).json({ mesage: 'error in fetching card data', error: err });
        }
        else {
            res.status(200).json(doc);
        }

    });

});

//Get User
router.get('/getUser', auth.checkAuthenticated, (req, res) => {
    User.find(function (err, doc) {
        if (doc.length) {
            return res.status(200).json(doc);
        }
        else {
            return res.status(400).json({ err: 'no user found' });
        }
    }).populate('user').catch((err) => {
        return res.status(400).json(err);
    });
});

router.put('/editUser', auth.checkAuthenticated, async (req, res) => {
    await User.findByIdAndUpdate(req.body.id, req.body, function (err, doc) {
        if (err) {
            res.status(400).json({ message: 'error in fetching card data', error: err });
        }
        else {
            res.status(200).json(doc);
        }
    })
});

//Delete User
router.delete('/deleteUser/:id', auth.checkAuthenticated, (req, res, next) => {
    var id = req.params.id;
    User.findById(id).then(User => {
        User.delete().then(User => {
            res.send({
                message: 'User deleted successfully',
                status: 'success',
                User: User
            })
        })
            .catch(err => console.log(err))
    })
        .catch(err => console.log(err))
});

module.exports = router;
