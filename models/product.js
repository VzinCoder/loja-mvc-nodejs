const fs = require('fs');
const path = require('path');

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

  static delete(id, cb) {
    getProductsFromFile(products => {
      const newProducts = products.filter(p => p.id !== id)
      const newProductsJSON = JSON.stringify(newProducts)
      fs.writeFile(p, newProductsJSON, (err) => {
        cb(err || null)
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
