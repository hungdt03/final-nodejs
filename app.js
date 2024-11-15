const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const toastr = require('express-toastr');
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const customerRoutes = require('./routes/customer.routes');
const reportRoutes = require('./routes/report.routes');
const homeRoutes = require('./routes/home.routes');

const { authMiddleware } = require('./middlewares/authMiddleware');
const helpers = require('./helpers');
const connectMongoose = require('./configuration/connect-mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use(flash());
app.use(toastr());

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        ...helpers
    }
}));

app.set('view engine', 'hbs');

connectMongoose()

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.toastr = req.toastr.render();
    res.locals.user = req.session.user;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(authMiddleware);

app.use('/', homeRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/report', reportRoutes);

app.get('/403', (req, res) => {
    res.status(403).render('403');
});

app.get('*', (req, res) => {
    return res.render('404');
});

app.use((err, req, res) => {
    res.render('500', {
        err
    });
});

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
} else {
    console.log('Running in development mode');
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
