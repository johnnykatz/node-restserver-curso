///=========
// PUERTO
//============

process.env.PORT = process.env.PORT || 3000;


//==========
//ENTORNO
//===========
process.env.NODE_ENV = process.env.NODE_ENV || 'env';


//==============
//BASE DE DATOS
//=================

let urlDB;
if (process.env.NODE_ENV === 'env') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:root@cluster0-t756a.mongodb.net/cafe';
}

process.env.URLDB = urlDB;