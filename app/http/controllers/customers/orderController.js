const Order = require('../../../models/order')
const moment = require('moment')
//<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
//import Noty from noty
//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


  function orderController () {
    return {
        store(req, res) {
            const { paymentType, instructions, phone, address } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                instructions,
                phone,
                address,
                paymentType,
            })
            order.save().then(result => {
                req.flash('success','Order placed successfully')
                console.log('Saved....')
                delete req.session.cart
                return res.redirect('/customer/orders')
            }).catch(err => {
                req.flash('error','Something went wrong')
                console.log('Not saved....')
                console.log(err)
                return res.redirect('/cart')
            })

          /*  order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // req.flash('success', 'Order placed successfully')

                    // Stripe payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })*/
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.find({$and : [
                { customerId: { $eq:  req.user._id }},
                 // change later to completed
                 {"status" :{$ne: "completed"} }
              ]
            })
            return  res.redirect('/u_home')
        },
        async displayOrder(req,res) {
           const orders = await Order.find({ customerId: req.user._id },
            null,
            { sort: { 'createdAt': -1 } } )
        res.header('Cache-Control', 'no-store')
        res.render('customers/previous_orders', { orders: orders, moment: moment })
        },
    }
    
}

module.exports = orderController