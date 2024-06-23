const Product = require('../models/product');
const Cart = require('../models/cart')

exports.getProduct = (req, res, next) => {
  const idProduct = req.params.idProduct
  Product.findByPk(idProduct)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: 'Product detail',
        path: '/products'
      });
    })
    .catch(() => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      })
    })
    .catch((err) => console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch((err) => console.log(err))
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products => {

      const productsCart = cart.products.reduce((acc, cProduct) => {
        const product = products.find(prod => prod.id === cProduct.id)
        return product ? [...acc, { ...product, qty: cProduct.qty }] : acc
      }, [])

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: productsCart,
      });

    }))
  })
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};


exports.postCart = (req, res, next) => {
  const idProduct = req.body.idProduct

  Product.findById(idProduct, product => {
    if (product) {
      Cart.addProduct(idProduct, product.price, () => {
        res.redirect('/cart')
      })
    }
  })
};


exports.postCartDeleteProduct = (req, res, next) => {
  const idProduct = req.body.idProduct

  Product.findById(idProduct, product => {
    if (product) {
      Cart.deleteProduct(idProduct, product.price, (err) => {
        console.log(err)
        res.redirect('/cart')
      })
    }
  })
};
