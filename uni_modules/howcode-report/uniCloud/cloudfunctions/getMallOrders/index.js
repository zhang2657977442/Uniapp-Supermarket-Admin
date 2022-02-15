'use strict';
const db = uniCloud.database()
const orderCollection = db.collection("opendb-mall-order")

exports.main = async (event, context) => {
	const order = await orderCollection.get()
	return order
};
