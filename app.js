const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const Product = require('./models/product')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {

    const admin = { name: 'admin', email: 'admin@gmail.com' };

    const createUser = (user) => {
        let userCreated = null
        return User.create(user)
            .then((user) => {
                userCreated = user
                return user.createCart()
            })
            .then(() => userCreated)
    }

    const getUser = user => user || createUser(admin);

    const setUserReq = user => {
        req.user = user;
        next();
    };

    User.findByPk(1)
        .then(getUser)
        .then(setUserReq)
        .catch(console.log);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


User.hasMany(Product)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })



sequelize.sync({ force: true }).then(() => app.listen(3000)).catch(console.log)




