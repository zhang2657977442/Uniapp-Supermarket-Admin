'use strict';

const db = uniCloud.database()
const goodsCollection = db.collection("market-goods")
exports.main = async (event, context) => {
	const goods = await goodsCollection.get()
	
	return goods
};
