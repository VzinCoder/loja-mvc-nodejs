const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body

  Product.create({ title, imageUrl, description, price }).then(() => {
    res.redirect('/');
  }).catch((err) => {
    console.log(err)
  })
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId
  const editMode = req.query.edit === "true" ? true : false

  if (!editMode) {
    return res.redirect('/')
  }

  Product.findByPk(productId).then(product => {
    if (!product) {
      return res.redirect('/')
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      prod: product,
      editing: editMode
    });

  })
}

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch((err) => console.log(err))
};


exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body

  Product.findByPk(id)
    .then((p) => p.update({ title, imageUrl, price, description}))
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
};


exports.postDeleteProduct = (req, res, next) => {
  const idProduct = req.body.productID

  Product.findByPk(idProduct)
    .then((p) = p ? p.destroy(): null)
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err,"erro"))
};