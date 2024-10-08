const express = require('express')
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');
const mongoose = require('mongoose');

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

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ketnoi mongo
mongoose.connect('mongodb://localhost:27017/pos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    // layoutsDir: path.join(__dirname, 'views/layouts'),   // Thư mục layout
    // partialsDir: path.join(__dirname, 'views/partials')  // Thư mục partials
}));


app.set('view engine', 'hbs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    return res.render('home', { title: 'Welcome to Express with Handlebars', layout: 'sale' });
});

// Auth routing
app.use('/', authRoutes);

// Product routing
app.use('/products', productRoutes);

// Order routing
app.use('/orders', orderRoutes);

// Order routing
app.use('/users', userRoutes);

// Customer routing
app.use('/customers', customerRoutes);

// Report routing
app.use('/report', reportRoutes);

app.get('*', (req, res) => {
    return res.render('404', { title: 'Welcome to Express with Handlebars' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});