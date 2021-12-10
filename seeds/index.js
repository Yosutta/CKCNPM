const mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR OWN SERVER
const database = 'test';          // REPLACE WITH YOUR OWN DB NAME

mongoose.connect(`mongodb://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});
