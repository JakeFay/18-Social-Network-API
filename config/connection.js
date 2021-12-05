const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/pizza-hunt', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose.connection;