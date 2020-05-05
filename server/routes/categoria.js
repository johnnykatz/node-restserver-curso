const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');



app.get('/categoria', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Categoria.find({})
        .sort({ 'descripcion': 'desc' })
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        });

})


//=========
//show categoria
//==========
app.get('/categoria/:id', (req, res) => {
    let categoriaId = req.params.id;
    Categoria.findById(categoriaId, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    'message': 'no se econtro la categoria'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
})


//=========
//crea categoria
//==========
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//=========
//actualiza categoria
//==========
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;
    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    'message': 'No se encontro la categoria para actualizar'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

})


//=========
//eliminar categoria
//==========
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findOneAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
})



module.exports = app;