const router = require('express').Router();
const User = require('../src/models/User')
const Product = require('../src/models/product')
const Order = require('../src/models/Order');
const Catagory = require('../src/models/Category')
const Postage = require('../src/models/Postage')

const adminCheck = (req, res, next) => {

    if (req.session?.user?.isAdmin) {
        next()
    } else {
        res.send({ msg: "not an admin account" })
    }
}

router.use(adminCheck)

router.get('/allorders', async (req, res) => {
    if (req.session.id) {
        try {
            const data = await Order.findAndCountAll({
                include: [
                    { model: User, as: "User", required: true },        //INNER JOIN
                    { model: Product, as: "Product", required: false }      //LEFT OUTER JOIN
                ],
            })

            const userOrderData = data.rows.reduce((acc, val) => {
                const { id, orderID, order_date, qty, discount_code, final_price, status } = val
                console.log(val)
                const newObj = {
                    user: val.User.dataValues.email,
                    Product: val.Product.dataValues,
                    id: id, orderID, order_date, qty: qty, discountCode: discount_code, status: status, final_price
                }
                return [...acc, newObj]
            }, [])
            console.log(userOrderData)
            const postage = await data.rows.map(async ({ dataValues }) => {
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

            const postageWithUserName = filtered.map((meta => (postage) => {
                for (let i = 0; i < meta.length; i++) {
                    if (meta[i].orderID === postage.orderID) {
                        return { ...postage.dataValues, ...meta[i] }
                    }
                }
            })(userOrderData.map((order) => { return { orderID: order.orderID, user: order.user } }))
            )
            const newArray = [...userOrderData, ...postageWithUserName]
            res.send(newArray)
        } catch (err) {
            console.log(err)
            res.status(500).send({ msg: 'error getting orders', err })
        }
    } else {
        res.status(401).send({ msg: 'you are not logged in' })
    }
});

router.put('/updateorder', async (req, res) => {
    try {
        const updatedOrder = await Order.update({ status: req.body.status }, {
            where: {
                orderID: req.body.id
            }
        });
        res.send({ msg: 'authozied', updatedOrder })
    } catch (err) {
        console.log(err)
        res.send({ msg: 'there was an error', err })
    }
});

router.post('/addproducts', async (req, res) => {

    if (Array.isArray(req.body)) {
        try {
            const products = await Product.bulkCreate(req.body);

            res.send({ msg: 'success', products })
        } catch (err) {
            console.log(err)
            res.status(400).send({ msg: 'err', err })
        }
    } else {
        try {
            const newProduct = await Product.create({ ...req.body, qty: 99 })
            res.send({ msg: "success", newProduct })
        } catch (err) {
            console.log(err)
            res.status(400).send({ msg: 'err', err })
        }
    }
});

router.put('/editproduct', async (req, res) => {
    const product = await Product.findAll({
        where: { id: req.body.id }
    })
    if (product[0]) {
        try {
            const { oldName, oldBrand, oldCategory, oldQty, oldDesc, oldPrice, oldDiscount_percent, oldFinal_price } = product[0].dataValues
            const { name, brand, category, qty, desc, price, discount_percent, final_price } = req.body
            const updatedProduct = await Product.update({
                "name": name || oldName,
                "brand": brand || oldBrand,
                "category": category || oldCategory,
                "qty": qty || oldQty,
                "desc": desc || oldDesc,
                "price": price || oldPrice,
                "discount_percent": discount_percent || oldDiscount_percent,
                "final_price": final_price || oldFinal_price
            }, {
                where: {
                    id: req.body.id
                }
            })
            res.send({ msg: "product updated", updatedProduct })
        } catch (err) {
            console.log(err)
            res.send({ msg: "error updating product", err })
        }
    } else {
        res.send({ msg: "product does not exist" })
    }
});

router.post('/deleteproduct', async (req, res) => {
    try {
        const deletedProduct = await Product.destroy({
            where: {
                id: req.body.id
            }
        });
        res.send({ msg: 'deleted', deletedProduct })
    } catch (err) {
        console.log(err)
        res.send({ msg: 'there was an error', err })
    }
});

router.post('/addcatagory', async (req, res) => {
    try {
        const newCatagory = await Catagory.create(req.body)
        res.send({ msg: "success", newCatagory })
    } catch (err) {
        console.log(err)
        res.send({ msg: 'err', err })
    }
});

router.delete('/deletecatagory', async (req, res) => {
    try {
        const deletedCatagory = await Catagory.destroy({
            where: {
                name: req.body.name
            }
        });
        res.send({ msg: 'deleted', deletedCatagory })
    } catch (err) {
        console.log(err)
        res.send({ msg: 'there was an error', err })
    }

});

router.put('/editcatagory', async (req, res) => {          //renames catagory and all products.catagorys

    try {
        const updatedCatagory = await Catagory.update({ name: req.body.name, imgUrl: req.body.imgUrl }, {
            where: {
                id: req.body.id
            }
        });
        if (req.body.hasOwnProperty('name')) {

            const updatedProducts = await Product.update({ category: req.body.name }, {
                where: {
                    category: req.body.oldName
                }
            })
            res.send({ msg: "updated catagory and product catagory names", updatedCatagory, updatedProducts })
        } else {
            res.send({ msg: "updated image url", updatedCatagory })
        }
    } catch (err) {
        console.log(err)
        res.send({ msg: 'error', err })
    }


});


module.exports = router;