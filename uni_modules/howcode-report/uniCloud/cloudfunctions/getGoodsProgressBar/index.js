'use strict';

const db = uniCloud.database()
const goodsCollection = db.collection("opendb-mall-goods")
exports.main = async (event, context) => {
	const goods = await goodsCollection.get()
	
	return goods
};
