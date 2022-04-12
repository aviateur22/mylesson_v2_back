const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const router = require('./routers');

//Inclu pour fectionner les cookie sur le navigateur
app.set('trust proxy', 1);

const corsOptions = {   
     
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin:process.env.CORS_ORIGIN.split(',')
};

//Cors middleware
app.use(cors(corsOptions));

//Gestion pour les fichiers a inclure(image...)
app.use(express.static(__dirname + '/static'));

//Permet de gerer les formulaire (pas les formData)
app.use(express.urlencoded({ extended: true }));

//parse en format json
app.use(express.json());

//Router middleware
app.use(router);

const c = process.cwd();

module.exports = app;