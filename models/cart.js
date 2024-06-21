const fs = require('fs')
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);


module.exports = class Cart {

    static addProduct(id, price, cb) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }

            if (!err) {
                cart = JSON.parse(fileContent)
            }

            const existsProductIndex = cart.products.findIndex(p => p.id === id)
            const existsProduct = cart.products[existsProductIndex]

            let updatedProduct = {}

            if (existsProduct) {
                updatedProduct = { ...existsProduct }
                updatedProduct.qty++
                cart.products[existsProductIndex] = updatedProduct
            } else {
                updatedProduct = { id, qty: 1 }
                cart.products = [...cart.products, updatedProduct]
            }

            cart.totalPrice += parseFloat(price)

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                cb(err || null)
            })
        })
    }

    static deleteProduct(id, price, cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(err)
                return
            }

            const updatedCart = { ...JSON.parse(fileContent) }

            const { products } = updatedCart

            const product = products.find(p => p.id === id)

            if (!product) {
                cb(null)
                return
            }

            const productQty = product.qty

            updatedCart.products = products.filter(p => p.id !== id)
            updatedCart.totalPrice -= productQty * price

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                cb(err)
            })

        })
    }


    static getCart(cb) {
        fs.readFile(p, (err, cart) => {
            cb(err || JSON.parse(cart))
        })
    }


}