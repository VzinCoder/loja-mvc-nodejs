const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId
  const editMode = req.query.edit === "true" ? true : false

  if (!editMode) {
    res.redirect('/')
  }

  Product.findById(productId, product => {
    if (!product) {
      res.redirect('/')
      return
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
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};


exports.postEditProduct = (req, res, next) => {
  const id = req.body.id
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const updatedProduct = new Product(id, title, imageUrl, description, price);

  updatedProduct.save()
  res.redirect('/admin/products')
};


exports.postDeleteProduct = (req, res, next) => {
  const idProduct = req.body.productID
  Product.delete(idProduct, (err)=>{
    console.log(err)
    res.redirect('/admin/products')
  })
};