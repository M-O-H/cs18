const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`mongodb connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(error.message);
        console.log("failed to connect")
        process.exit(1); //exit the process with failure
    }
}
module.exports = connectDB;