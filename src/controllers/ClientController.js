const bcrypt = require('bcrypt');

var cUser = require('./userController');
var Clientdb = require('../models/Client');
const Userdb = require('../models/User');
const Roledb = require('../models/Role');
exports.findViewEmployer = () => {

    return new promise((resolve, reject) => {
        Clientdb.find()
            .populate({ path: 'user', populate: { path: 'role' } })
            .exec((err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    console.log(err.message);
                    reject(err);
                }
            });
    });

};


exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Clientdb.find()
            .populate({ path: 'user', populate: { path: 'role' } })
            .exec((err, repertoir) => {
                if (!err) {
                    resolve(repertoir);
                } else {
                    reject({ status: 500, message: err.message });
                }
            });

    });
};

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Clientdb.findById(id)
            .then(data => {
                if (!data) {
                    reject({ status: 404, message: "Client non trouvé!" });
                } else {
                    resolve(data);
                }
            })
            .catch(err => {
                reject({ status: 500, message: "Erreur lors de la récupération du contact avec l'identifiant :" + id });
            });
    });
};

exports.findByClient = (idUser) => {
    return new Promise((resolve, reject) => {
        Clientdb.findOne({ user: idUser })
            .then(data => {
                if (!data) {
                    reject({ status: 404, message: "Client non trouvé!" });
                } else {
                    resolve(data);
                }
            })
            .catch(err => {
                reject({ status: 500, message: "Erreur lors de la récupération du contact avec l'identifiant :" + id });
            });
    });
};

exports.create = (name_, username_, contact_, adrs_, email_, cin_, user_id) => {

    return new Promise((resolve, reject) => {

        const new_ = {
            name: name_,
            username: username_,
            contact: contact_,
            adresse: adrs_,
            email: email_,
            cin: cin_,
            user: user_id
        };

        const new__ = new Clientdb(new_);
        console.log(new__);
        new__.save((err, docs) => {
            if (err) {
                reject({ status: 400, message: err.message });
            } else {
                resolve({ status: 200, data: docs, message: "Success !" });
            }
        });
    });
};

exports.new_client = async (req, res) => {
    const role = await Roledb.findOne({ role: 'isClient' });

    if (req.body.name != null && req.body.contact != null && req.body.adresse != null && req.body.email != null && req.body.cin != null) {
        if (req.body.new_password == req.body.confirm_password) {
            cUser.create(req.body.email, req.body.confirm_password, role._id, req.body.name + req.body.username).then((data) => {
                console.log('success1: ' + data._id);
                this.create(req.body.name, req.body.username, req.body.contact, req.body.adresse, req.body.email, req.body.cin, data._id).then((val) => {
                    console.log('success');
                    res.send({ status: 200,data:val, message: 'Success !' });
                }).catch((err) => {
                    res.send({ status: 400, message: err.message });
                });
            }).catch((err2) => {
                res.send({ status: 400, message: err2.message });
            });
        } else {
            res.send({ status: 400, message: 'Votre mot de passe est invalide' });
        }

    } else {
        res.send({ status: 400, message: 'Champs invalide !' });
    }
};

exports.login_client = (req, res) => {
    res.setHeader('Content-Type', 'application/json');


    if (req.body.username != null && req.body.password != null) {
        Userdb.findOne({ username: req.body.username, status: true })
            .populate({
                path: 'role'
            }).exec((err, user) => {
                if (err) {
                    res.send({ status: 400, message: err.message });
                } else {
                    if(user!=null){
                        bcrypt.compare(req.body.password, user.password, async function (err2, res2) {
                            if (err2) {
                                res.send({ status: 400, message: err2.message });
                            }
                            else if (res2 === false) {
                                res.send({ status: 400, message: "Mot de passe incorrecte" });
                            }
                            else {
                                const cli = await Clientdb.findOne({ user: user._id });
                                res.send({ status: 200, data: cli });
                            }
                        });
                    } else {
                        res.send({ status: 400, message: 'E-mail ou mot de passe est incorrecte !' });
                    }
                }
              
            });
    } else {
        res.send({ status: 400, message: 'E-mail ou mot de passe est incorrecte !' });
    }
};