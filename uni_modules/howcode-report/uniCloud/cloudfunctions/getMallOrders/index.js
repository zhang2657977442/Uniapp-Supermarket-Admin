'use strict';
const db = uniCloud.database()
const orderCollection = db.collection("market-order")

exports.main = async (event, context) => {
	const order = await orderCollection.get()
	return order
};
