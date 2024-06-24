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
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(productsCart => {
      console.log(productsCart)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: productsCart,
      });
    })
    .catch(console.log)
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
  const idProduct = req.body.idProduct;
  let fetchedCart = null;
  let newQuantity = 1;

  const fetchCartProducts = cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: idProduct } });
  };

  const findOrUpdateProduct = ([product]) => {
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }

    return Product.findByPk(idProduct);
  };

  const addProductToCart = product =>
    fetchedCart.addProduct(product, { through: { quantity: newQuantity } });

  req.user.getCart()
    .then(fetchCartProducts)
    .then(findOrUpdateProduct)
    .then(addProductToCart)
    .then(() => res.redirect('/cart'))
    .catch(console.log);
};

exports.postCartDeleteProduct = (req, res, next) => {
  const idProduct = req.body.idProduct
  req.user.getCart()
    .then(cart => cart.getProducts({ where: { id: idProduct } }))
    .then(([product]) => product.cartItem.destroy())
    .then(() => res.redirect('/cart'))
    .catch(console.log)
};
