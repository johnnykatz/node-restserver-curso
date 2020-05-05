const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();

let Producto = require('../models/productos');


//===============
// index
//==================

app.get('/producto', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .limit(limite)
        .skip(desde)
        .sort({ 'descripcion': 'desc' })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        });
});

//===============
// index buscar con expresion regular
//==================

app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .sort({ 'descripcion': 'desc' })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        });
});

//===============
// traer producto por id
//==================

app.get('/producto/:id', verificaToken, (req, res) => {
    productoId = req.params.id;
    Producto.findById(productoId, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});


//===============
// crear producto
//==================

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        usuario: req.usuario._id,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        'message': 'No se encontro el producto para actualizar'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');

})


//=========
//eliminar producto => cambia estado
//==========
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
})


module.exports = app;