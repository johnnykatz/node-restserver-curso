const express = require('express');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

const fs = require('fs');




let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (!fs.existsSync(pathImagen)) {
        pathImagen = path.resolve(__dirname, '../assets/no-img.jpg');
    }
    res.sendFile(pathImagen);
});





module.exports = app;