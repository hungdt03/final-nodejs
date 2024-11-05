const express = require('express')
const path = require('path');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const toastr = require('express-toastr');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const customerRoutes = require('./routes/customer.routes');
const reportRoutes = require('./routes/report.routes');
const homeRoutes = require('./routes/home.routes');

const { seedAdminAccount } = require('./seeding/seeding-admin');
const { checkPasswordChange } = require('./middlewares/checkPasswordChange');
const { checkAuthenticated } = require('./middlewares/checkAuthenticated');
const { checkPermission } = require('./middlewares/checkPermission');
const helpers = require('./helpers');

const app = express()
const server = http.createServer(app); // Tạo server HTTP từ Express
const io = new Server(server);

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

const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString)
    .then(() => {
        console.log('MongoDB connected successfully')
        seedAdminAccount()
            .then(() => {
                console.log('Seediing admin successfully')
            })
            .catch(err => {
                console.error('Error seeding admin account', err);
            });

    })
    .catch(err => console.log('MongoDB connection error:', err));

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        ...helpers
    }
}));

app.set('view engine', 'hbs');

io.on('connection', (socket) => {
    console.log('A user connected');
    console.log(socket)

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.toastr = req.toastr.render()
    res.locals.user = req.session.user
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(checkAuthenticated);
app.use(checkPasswordChange);
app.use(checkPermission);

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
    })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

