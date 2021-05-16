// const Order = require('../../../models/order')
 const Hotel = require('../../../models/hotel')
// function orderController () {
//     return {
        
//         async index(req, res) {
//             var hotel = await Hotel.findOne({email:req.user.email})
//             Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
//                 if(req.xhr) {
//                     return res.json(orders)
//                 } else {
//                  return res.render('hotel/neworders')
//                 }
//             })

//          },
            
//         async completedOrder(req,res) {
//             var x = new Date().toISOString().slice(0,10);
//             var hotel = await Hotel.findOne({email:req.user.email})
//             const orders = await Order.find({
//                 $and: [
//                   { "Date": { $eq: x }},
//                    // change later to completed
//                    {"status" :{$eq: "completed"} },
//                    {"hotel" : {$eq: hotel}}
//                 ]
//               })
            
//             if(orders == null )
//                 return console.log("No order yet")
//             console.log(orders)
//             return res.render('hotel/completed_orders', {orders: orders})
//            // res.render('hotel/menu')
//         },

//      }
//  }

// module.exports = orderController

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
            var hotel = await Hotel.findOne({email:req.user.email})
            const orders = await Order.find({
                $and: [
                  { "Date": { $eq: x }},
                   // change later to completed
                   {"status" :{$eq: "order_placed"} },
                   {"hotel" : {$eq: hotel.name}}
                ]
              })
            
            if(orders == null )
                return console.log("No order yet")
            console.log(orders)
            return res.render('hotel/completed_orders', {orders: orders})
           // res.render('hotel/menu')
        },

        async completedOrder(req,res) {
                        var x = new Date().toISOString().slice(0,10);
                        var hotel = await Hotel.findOne({email:req.user.email})
                        const orders = await Order.find({
                            $and: [
                              { "Date": { $eq: x }},
                               // change later to completed
                               {"status" :{$eq: "completed"} },
                               {"hotel" : {$eq: hotel.name}}
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