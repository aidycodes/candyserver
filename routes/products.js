const router = require('express').Router();
const Product = require('../src/models/product')

router.get('/all', async (req, res) => {
    try {
        const data = await Product.findAll({})
        const products = data.map(product => {
            return product.dataValues
        })
        res.send({ products })
    } catch (err) {
        console.log(err)
    }

});

router.get('/search/:id', async (req, res) => {
    try {
        const num = Number(req.params.id)
        const data = await Product.findOne({ where: { id: num } })
        res.send({ data })
    } catch (err) {
        console.log(err)
    }
});

router.get('/:category', async (req, res) => {
    try {
        const data = await Product.findAll({ where: req.params })
        const products = data.map(product => {
            return product.dataValues
        })
        res.send({ products })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});

router.get('/brand/:brand', async (req, res) => {
    try {
        console.log(req.params)
        const data = await Product.findAll({ where: req.params })
        const products = data.map(product => {
            return product.dataValues
        })
        console.log(data)
        res.send({ products })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});



module.exports = router;