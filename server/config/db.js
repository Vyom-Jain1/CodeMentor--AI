const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('Continuing without database connection in development mode');
    }
  }
};

module.exports = connectDB;