const express = require('express')
const path = require('path');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

// db models
const Product = require('./models/product.model')
const User = require('./models/user.model');
const Customer = require('./models/customer.model');
const Order = require('./models/order.model');
const OrderItem = require('./models/orderItem.model');

const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const customerRoutes = require('./routes/customer.routes');
const reportRoutes = require('./routes/report.routes');
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const { seedAdminAccount } = require('./seeding/seeding-admin');
const { isAuthenticated } = require('./middlewares/authorizeRoles');

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-session', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: null, // Thiết lập maxAge là null để cookie không hết hạn
    }
}));

app.use(flash());

// ketnoi mongo
const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
}));

app.set('view engine', 'hbs');

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // console.log(req.session)
    res.locals.user = req.session.user
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', isAuthenticated, homeRoutes);

// Auth routing
app.use('/auth', authRoutes);

// Product routing
app.use('/products', productRoutes);

// Order routing
app.use('/orders', orderRoutes);

// User routing
app.use('/users', userRoutes);

// Customer routing
app.use('/customers', customerRoutes);

// Report routing
app.use('/report', reportRoutes);

app.get('/403', (req, res) => {
    res.status(403).render('403');
});

app.get('*', (req, res) => {
    return res.render('404', { title: 'Welcome to Express with Handlebars' });
});

const PORT = process.env.PORT || 8080;

seedAdminAccount()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error seeding admin account', err);
    });
