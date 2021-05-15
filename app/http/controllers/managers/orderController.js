const Order = require('../../../models/order')
function orderController () {
    return {
        
        index(req, res) {
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr) {
                    return res.json(orders)
                } else {
                 return res.render('hotel/neworders')
                }
            })

         },
        async displayOrder(req,res) {
            var x = new Date().toISOString().slice(0,10);
            const orders = await Order.find({
                $and: [
                  { "Date": { $eq: x }},
                   // change later to completed
                   {"status" :{$eq: "order_placed"} },
                ]
              })
            
            if(orders == null )
                return console.log("No order yet")
            console.log(orders)
            return res.render('hotel/completed_orders', {orders: orders})
           // res.render('hotel/menu')
        },

     }
 }

module.exports = orderController