const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (MONGO_URI, callBack) => {
	MongoClient.connect(MONGO_URI)
		.then((client) => {
			console.log('Database connection established successfully');
			callBack(client);
		})
		.catch((err) => console.log(err));
};

module.exports = mongoConnect;
