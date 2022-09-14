const router = require('express').Router();
const Cart = require('../src/models/Cart')

router.get('/get', async (req, res) => {

    if (req.session.id) {
        try {
            const data = await Cart.findAll({
                where: { customer_id: req.session.user.id },
            })

            const { dataValues: { items } } = data[0]
            res.send(data[0].dataValues.items)

        } catch (err) {
            console.log(err)
            res.status(400).send({ error: err })
        }
    }
})

router.post('/update', async (req, res) => {
    if (req.session.id) {
        try {
            const updatedCart = await Cart.update({
                items: [...req.body.items]
            }, {
                where: { customer_id: req.session.user.id },
                returning: true
            })
            res.send({ updatedCart })
        } catch (err) {
            console.log(err)
            res.status(400).send({ error: err })
        }
    } else {
        res.send({ error: 'not logged in' })
    }
})

module.exports = router;