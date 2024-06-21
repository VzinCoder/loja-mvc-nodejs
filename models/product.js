const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      const updatedProducts = [...products]
      const existsProductIndex = updatedProducts.findIndex(p => p.id === this.id)

      if (existsProductIndex !== -1) {
        const updatedProduct = { ...this };
        updatedProducts[existsProductIndex] = updatedProduct;
      } else {
        const newProduct = { ...this, id: Math.random().toString() };
        updatedProducts.push(newProduct);
      }

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err);
      });
    });
  }

  static deleteById(id, cb) {
    getProductsFromFile(products => {
      const { price } = products.find(p => p.id === id)
      const updatedProducts = products.filter(p => p.id !== id)

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          cb(err)
          return
        }

        Cart.deleteProduct(id, price, (err) => {
          cb(err)
        })

      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }


  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }
};
