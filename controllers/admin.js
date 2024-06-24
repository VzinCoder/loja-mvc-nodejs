
const getProductBody = body =>
  ({ title, imageUrl, price, description } = body)


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  req.user.createProduct(getProductBody(req.body))
    .then(() => res.redirect('/'))
    .catch(console.log)
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId
  const editMode = req.query.edit === "true" ? true : false

  if (!editMode) {
    return res.redirect('/')
  }

  req.user.getProducts({ where: { id: productId } }).then(products => {
    const [product] = products
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
  req.user.getProducts().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch((err) => console.log(err))
};


exports.postEditProduct = (req, res, next) => {
  const id = req.body.id

  req.user.getProducts({ where: { id } })
    .then(([p]) => p.update(getProductBody(req.body)))
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
};


exports.postDeleteProduct = (req, res, next) => {
  const idProduct = req.body.productID

  req.user.getProducts({ where: { id: idProduct } })
    .then(([p]) => p ? p.destroy() : null)
    .catch((err) => console.log(err, "erro"))
    .finally(() => res.redirect('/admin/products'))
};