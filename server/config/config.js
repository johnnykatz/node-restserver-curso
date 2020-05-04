///=========
// PUERTO
//============

process.env.PORT = process.env.PORT || 3000;


//==========
//ENTORNO
//===========
process.env.NODE_ENV = process.env.NODE_ENV || 'env';


//==========
//Vencimeinto de token
//===========
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==========
//SEED de autenticacion
//===========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//==============
//BASE DE DATOS
//=================

let urlDB;
if (process.env.NODE_ENV === 'env') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb+srv://root:root@cluster0-t756a.mongodb.net/cafe';
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//==============
//BASE DE DATOS
//=================

process.env.CLIENT_ID = process.env.CLIENT_ID || '669949895770-nal485mjf6anaslec5t0cru3neo9sb3u.apps.googleusercontent.com';