const express = require('express');
const route = express.Router();

const nodemailer = require('nodemailer');


const userController = require('../controllers/userController');
const employeController = require('../controllers/employerController');
const defaultDataController = require('../controllers/DefaultDataController');
const clientController = require('../controllers/ClientController');
const voitureController = require('../controllers/VoitureController');
const depenseController = require('../controllers/DepenseController');
const reparationController = require('../controllers/reparationController');

const diagnostiqueController = require('../controllers/diagnostiqueController');

const statistiqueController = require('../controllers/StatistiqueController');
//=================== Route Super Admin ==================
route.get('/initialisation-role-status', defaultDataController.insertDefaultData);

route.post('/verify-mail-user', userController.verifyEmail);
route.get('/list', (req, res) => {
    userController.teste().then((data) => {
        res.send(data)
    })
});
route.post('/new-first-spa', (req, res) => {
    userController.saveNewSAP(req.body.nicname, req.body.username, req.body.new_password, req.body.confirm_password).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});

//============= Api Employer ===========================
route.post('/resp.create', employeController.new_resp);
route.put('/resp.update/:id', employeController.update);
route.delete('/resp.delete', employeController.delete);


//=========== Api voiture =============================
route.get('/list/:id/voiture', voitureController.findAll);
route.post('/create/:id/voiture', voitureController.create);
route.get('/list/:id/voiture-reparation', (req, res) => { });
route.post('/create/:id/voiture-reparation', (req, res) => { });

//=========== Api Client ==============================
route.post('/new.client', clientController.new_client);

/*===================== APIT TESTE ===================*/

route.get('/form-new-client', (req, res) => {
    res.render('client/new_client');
});


route.post('/send-mail-teste', (req, res) => {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'antoenjara1998@gmail.com',
            pass: 'yzcufbqfsttpwblh'
        }
    });
    var mailOption = {
        from: 'Projet-Meam-M1<antoenjara1998@gmail.com>',
        to: 'francisco@constellation-group.co',
        replyTo: 'francisco@constellation-group.co',
        subject: 'Teste envoie email',
        text: 'Bonjour,'
    };

    /*     html:listing.contenu,
        attachments: [
            {
                filename: entries.cv_.name,
                path: process.env.URL_HOST + entries.cv_.url,
                cid: entries.cv_.hash
            },
            {
                filename: entries.lm_.name,
                path: process.env.URL_HOST + entries.lm_.url,
                cid: entries.lm_.hash
            }
        ]*/

    transport.sendMail(mailOption, (err, info) => {
        if (err) {
            console.log(err.message);
            res.send({ status: 400, message: err.message });
        } else {
            console.log(info.response);
            res.send({ status: 200, message: 'email envoyer', data: info.response });
        }
    });
});


//======================= API Depense ===================

route.post('/depense.create', depenseController.saveDepense);
route.put('/depense.update/:id', depenseController.updateDepense);
route.delete('/depense.delete/:id', depenseController.deleteDepense);
route.post('/other-depense.create', depenseController.saveOtherDepense);
route.put('/other-depense.update/:id', depenseController.updateOtherDepense);
route.delete('/other-depense.delete/:id', depenseController.deleteOtherDepense);

route.post('/statistiqueFilter',statistiqueController.statistiqueFilter);

/*
route.post('/statistiqueFilter',depenseController.statistiqueFilter);
route.post('/chiffre-affaire-filter',reparationController.totaleChiffreAffaireFilter);
*/
route.get('/test-statistiques',(req,res)=>{
    depenseController.statistiques().then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send({status:400,message:err.mesage});
    })
});
route.get('/test-statistique-chiffre-affaire',(req,res)=>{
    reparationController.totaleChiffreAffaire().then((result)=>{
            res.send(result)
    }).catch((err)=>{
        res.send(err);
    });
});

route.get('/test-montant-diagnostique/:id',(req,res)=>{
    diagnostiqueController.totaleMontant(req.params.id).then((result)=>{
            res.send(result)
    }).catch((err)=>{
        res.send(err);
    });
});

// ====================== API User ==========================

route.put('/desactived/:id/teams', (req, res) => {
    userController.desactived(req.params.id).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send({ status: 400, message: err.mesage })
    });
});

route.put('/actived/:id/teams', (req, res) => {
    userController.actived(req.params.id).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send({ status: 400, message: err.mesage })
    });
});








module.exports = route;