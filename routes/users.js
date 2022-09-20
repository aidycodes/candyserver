const router = require('express').Router();
const User = require('../src/models/User')
const Product = require('../src/models/product')
const Order = require('../src/models/Order');
const Postage = require('../src/models/Postage')
const genPassword = require('../utils/passwordUtils').genPassword
const validPassword = require('../utils/passwordUtils').validPassword
const { v4: uuidv4 } = require('uuid');
const Cart = require('../src/models/Cart')

User.hasMany(Order, { as: "Orders", foreignKey: 'customer_id' })
Product.hasMany(Order, { as: "Orders", foreignKey: 'product_id' })

Order.belongsTo(User, { as: "User", foreignKey: "customer_id" })
Order.belongsTo(Product, { as: "Product", foreignKey: "product_id" })



// get session info

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});


router.get('/protect', async (req, res) => {
    console.log(req.headers, 'fffff')
    //console.log(req.session)
    if (req.session.user) {
        const user = await User.findAll({
            where: { email: req.session.user.email }
        })
        const currentUser = user.map(({ id, email, address, country, county, phone, isAdmin }) => {
            return { id, email, address, country, county, phone, isAdmin }
        })
        console.log(currentUser)
        res.send({ msg: 'authorized', currentUser })
    } else {
        res.send({ msg: 'you are not authozied' })
    }
});

router.post('/passwordCheck', async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        try {
            const data = await User.findAll({
                where: { email: email }
            })
            if (data.length > 0) {
                const { password: hash, salt, email, id, isAdmin } = data[0].dataValues
                if (validPassword(password, hash, salt)) {
                    req.session.user = { id: id, email: email, isAdmin }
                    res.send({ msg: 'loggedin', email: email })
                } else {
                    res.status(401).send({ msg: 'invalid password' })
                }
            } else {
                res.status(401).send({ msg: 'invalid password' })
            }
        } catch (err) {
            console.log(err)
            res.status(401).send({ msg: 'error', err })
        }
    } else {
        res.status(401).send({ msg: 'password must be provided' })
    }
});

// TODO
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        try {
            const data = await User.findAll({
                where: { email: email }
            })
            if (data.length > 0) {
                const { password: hash, salt, email, id, isAdmin } = data[0].dataValues
                if (validPassword(password, hash, salt)) {
                    req.session.user = { id: id, email: email, isAdmin }

                    res.send({ msg: 'loggedin', email: email })
                } else {
                    res.status(401).send({ msg: 'invalid username or password' })
                }
            } else {
                res.status(401).send({ msg: 'invalid username or password' })
            }
        } catch (err) {
            console.log(err)
            res.status(401).send({ msg: 'error', err })
        }
    } else {
        res.status(401).send({ msg: 'email and password must be provided' })
    }
});

// TODO
router.post('/register', async (req, res) => {
    const { email, password, address, country, county, phone } = req.body

    if (email && password) {
        const { salt, hash } = genPassword(password)
        try {
            const data = await User.findAll({
                where: { email: email }
            })
            if (data.length === 0) {
                const newUser = await User.create({
                    email: email,
                    password: hash,
                    isAdmin: false,
                    salt: salt,
                    address: address,
                    county: county,
                    country: country,
                    phone: phone
                })
                req.session.user = { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin }


                const newCart = await Cart.create({
                    customer_id: newUser.id,
                    items: []
                })

                res.send({ newUser })

            } else {
                res.status(409).send({ error: 'email address already has an account' })
            }
        } catch (err) {
            console.log(err)
            res.status(400).send({ error: 'Please ensure all fields are filled out correctly', err })
        }
    } else {
        res.status(422).send({ error: 'please fill out form correctly' })
    }
});

router.put('/edituser', async (req, res) => {
    if (req.session.user) {
        try {
            const currentUser = await User.findAll({
                where: { id: req.session.user.id }
            })
            if (currentUser[0]) {
                const { oldEmail, oldPassword, oldSalt, oldAddress, oldCounty, oldCountry, oldPhone } = currentUser[0].dataValues
                const { email, password, address, county, country, phone } = req.body
                if (password) {
                    var { salt, hash } = genPassword(password)
                }
                if (req.session.user.id === currentUser[0].dataValues.id) {
                    console.log(salt, hash, 'ssks')
                    const updatedUser = await User.update({
                        email: email || oldEmail,
                        password: hash || oldPassword,
                        salt: salt || oldSalt,
                        address: address || oldAddress,
                        county: county || oldCounty,
                        country: country || oldCountry,
                        phone: phone || oldPhone
                    }, {
                        where: {
                            id: req.session.user.id
                        }
                    });
                    res.send({ msg: 'authozied', updatedUser })
                } else {
                    res.send({ msg: "something went wrong please try logging in again" })
                }
            } else {
                res.send({ msg: 'you are not authozied' })
            }
        } catch (err) {
            res.status(403).send({ msg: err })
        }
    } else {
        res.send({ msg: 'you are not authozied2' })
    }

})

router.get('/orders', async (req, res) => {
    if (req.session.user) {
        const data = await Order.findAll({
            where: { customer_id: req.session.user.id },
            include: [{ model: Product, as: "Product", required: true }],
        })

        //const postage = []
        const postage = await data.map(async ({ dataValues }) => {
            return await Postage.findAll({
                where: { orderID: dataValues.orderID }
            })
        })
        const resolvedPostage = await Promise.all(postage)
        let flatPostage = resolvedPostage.flat()



        const filtered = flatPostage.filter((set => item => !set.has(item.orderID) && set.add(item.orderID)

        )
            (new Set)
        );
        console.log(filtered)
        const newArray = [...filtered, ...data]

        res.send(newArray)

    } else {
        res.send({ msg: 'you are not signed in' })
    }
})

router.post('/placeorder', async (req, res) => {
    const orderID = uuidv4()
    console.log(req.session)

    if (Array.isArray(req.body)) {
        const orderArray = req.body.map(order => {
            if (order.product_id) {
                return { orderID: orderID, customer_id: req.session?.user?.id || '1234', ...order }
            }
        }).filter((item => item))
        const postageInfo = req.body.map(postage => {
            if (postage.postagename && postage.postagecost) {
                return { postagename: postage.postagename, postagecost: postage.postagecost }
            }

        }).filter((item => item))
        console.log(postageInfo)
        try {
            const order = await Order.bulkCreate(orderArray);
            const postage = await Postage.create({ type: postageInfo[0].postagename, cost: postageInfo[0].postagecost, orderID: orderID })
            res.send({ msg: 'success', order, postage })
            if (req.session?.user) {
                const resetCart = await Cart.update({ items: [] }, {
                    where: {
                        customer_id: req.session.user.id
                    }
                })
            }
        } catch (err) {
            console.log(err)
            res.send({ msg: 'err', err })
        }
    } else {
        try {
            const orderObject = { orderID: orderID, customer_id: req.session?.user?.id ? req.session?.user?.id : '1234', ...req.body }
            console.log(orderObject)
            const newOrder = await Order.create(orderObject)
            const postage = await Postage.create({ type: req.body.postagename, cost: req.body.postagecost, orderID: orderID })
            if (req.session?.user) {
                const resetCart = await Cart.update({ items: [] }, {
                    where: {
                        customer_id: req.session.user.id
                    }
                })
            }
            res.send({ msg: "success", newOrder, postage })
        } catch (err) {
            console.log(err)
            res.send({ msg: 'err', err })
        }
    }

})

router.get('/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logout successful')
            }
        });
    } else {
        res.end()
    }


})


router.put('/cancelOrder', async (req, res) => {
    if (req.session.user) {
        try {
            const order = await Order.findAll({
                where: { id: req.body.id }
            })
            console.log(order[0].dataValues.customer_id)
            if (req.session.user.id === order[0].dataValues.customer_id) {
                const updatedOrder = await Order.update({ status: 'canceled' }, {
                    where: {
                        id: req.body.id
                    }
                });
                res.send({ msg: 'authozied', updatedOrder })
            } else {
                res.send({ msg: 'you are not authozied' })
            }
        } catch (err) {
            console.log(err)
        }
    }
    else {
        res.send({ msg: 'you are not authozied' })
    }


});



// not to be used
router.delete('/deleteorder', async (req, res, next) => {
    if (req.session.user) {
        const deletedOrder = await Order.destroy({
            where: {
                id: req.body.id
            }
        });
        res.send({ msg: 'authozied', deletedOrder })
    } else {
        res.send({ msg: 'you are not authozied' })
    }

});


module.exports = router;