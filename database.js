(function()
{
	var mongo_mongoose = require('mongoose');
	mongo_mongoose.connect('mongodb://127.0.0.1/planbotbob');
  global.pbb.mongoose = mongo_mongoose;
  global.pbb.database = mongo_mongoose.connection;
  global.pbb.database.on('error', console.error.bind(console, 'Database connection error:'));
  global.pbb.database.once('open', function callback() { console.log('Connected to the database'); });
})();
