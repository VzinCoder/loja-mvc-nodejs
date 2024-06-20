const Product = require('../models/product');
const Cart = require('../models/cart')

exports.getProduct = (req, res, next) => {
  const idProduct = req.params.idProduct
  Product.findById(idProduct, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: 'Product detail',
      path: '/products'
    });
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
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
      Cart.addProduct(idProduct, product.price)
    }
  })

  res.redirect('/cart')
};
