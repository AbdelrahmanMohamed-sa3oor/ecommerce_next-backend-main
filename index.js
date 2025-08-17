const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

// Import routers
const productRouter = require('./routers/product.routes');
const categoryRouter = require('./routers/category');
const cartRouter = require('./routers/cart');
const orderRouter = require('./routers/order');
const reviewRouter = require('./routers/review');
const couponRouter = require('./routers/coupon');
const userRouter = require('./routers/user');
const dashboardRouter = require('./dashboard/index');
const settingsRouter = require('./routers/settings');
const BannerRouter = require('./routers/routesBanner');
const contactRouter = require('./routers/contact');


const app = express();
console.log(process.env.PORT);

// Middleware
app.use(express.json());
// CORS configuration
app.use(cors({
    origin:'https://s4mra-ixgnaa87v-abdelrahman-mohameds-projects-2fd316c8.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-API-Key', 
        'X-Admin-Secret', 
        'X-Client-Type',
        'x-api-key',
        'x-admin-secret', 
        'x-client-type'
    ],
    credentials: true
}));

// Database connection
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const opts = {
        // Add serverless-specific options
        bufferCommands: false,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };

    try {
        const db = await mongoose.connect(process.env.CONNECTION_STRING, opts);
        cachedDb = db;
        console.log('MongoDB connection established ok');
        return db;
    } catch (err) {
        console.log('MongoDB connection error:', err);
        throw err;
    }
}

app.use(express.static('static'));
// Initialize app with database connection first
const startServer = async () => {
    try {
        // Wait for database connection
        await connectToDatabase();
        console.log('Database connection ready');
        
        // Swagger UI
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Root route
        app.get('/', (req, res) => {
            res.json({
                message: 'E-commerce Backend API',
                status: 'running',
                version: '1.0.0',
                endpoints: {
                    auth: '/api/auth',
                    products: '/api/products',
                    categories: '/api/categories',
                    cart: '/api/cart',
                    orders: '/api/orders',
                    reviews: '/api/reviews',
                    coupons: '/api/coupons',
                    dashboard: '/api/dashboard',
                    contact: '/api/contact', 
                }
            });
        });

        // API Routes
        app.use('/api/auth', userRouter);
        app.use('/api/products', productRouter); // This includes nested variant routes
        app.use('/api/categories', categoryRouter);
        app.use('/api/cart', cartRouter);
        app.use('/api/orders', orderRouter);
        app.use('/api/reviews', reviewRouter);
        app.use('/api/coupons', couponRouter);
        app.use('/api/dashboard', dashboardRouter);
        app.use('/api/settings', settingsRouter);
        app.use('/api/banner', BannerRouter );
        app.use('/api/contact', contactRouter);



        // Admin login route (direct)
        app.post('/api/admin/login', (req, res) => {
            const { username, password } = req.body;
            // Replace this with your real admin check or database lookup
            if (username === 'admin' && password === 'admin') {
                // You should generate a real JWT token here
                return res.json({ token: 'your-jwt-token', user: { username: 'admin' } });
            }
            res.status(401).json({ message: 'Invalid credentials' });
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            const status = err.status || err.statusCode || 500;
            const message = err.message || err.error || 'Internal server error';
            res.status(status).json({
                status: 'error',
                message: message,
                ...(process.env.NODE_ENV === 'development' && { 
                    stack: err.stack,
                    details: err
                })
            });
        });

        // 404 handler
        app.use((req, res) => {
            console.log(`Route not found: ${req.method} ${req.url}`);
            res.status(404).json({
                status: 'error',
                message: 'Route not found'
            });
        });

        // Start server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            console.log(`Local: http://localhost:${PORT}`);
            console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
app.get('/test', (req, res) => {
  res.send('Server working fine!');
});

// Start the server
startServer();