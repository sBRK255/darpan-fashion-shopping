const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Add retry logic
        let retries = 3;
        while (retries) {
            try {
                const conn = await mongoose.connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    // Add these connection stability options
                    socketTimeoutMS: 30000,
                    keepAlive: true,
                    keepAliveInitialDelay: 300000,
                    // Increase timeouts
                    connectTimeoutMS: 30000,
                    serverSelectionTimeoutMS: 30000,
                    // Enable retryWrites
                    retryWrites: true,
                    // Force IPv4
                    family: 4,
                    // Add maxPoolSize
                    maxPoolSize: 10
                });

                console.log(`MongoDB Connected: ${conn.connection.host}`);
                break;
            } catch (err) {
                retries -= 1;
                console.log(`Connection failed. Retries left: ${retries}`);
                if (!retries) throw err;
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Improve connection event handling
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
    // Attempt to reconnect after a delay
    setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectDB();
    }, 5000);
});

// Handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = connectDB; 