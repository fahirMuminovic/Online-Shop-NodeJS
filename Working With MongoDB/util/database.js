const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (MONGO_URI, callBack) => {
	MongoClient.connect(MONGO_URI)
		.then((client) => {
			console.log('Database connection established successfully');
			_db = client.db();
			callBack(client);
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const getDb = () => {
	if(_db){
		return _db;
	}
	throw 'No Database Found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
