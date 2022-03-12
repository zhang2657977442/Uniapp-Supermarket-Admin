'use strict';
const db = uniCloud.database()
const categoriesCollection = db.collection("market-categories")
const goodsCollection = db.collection("market-goods")
const orderCollection = db.collection("market-order")
const skuCollection = db.collection("market-sku")

exports.main = async (event, context) => {
	//event为客户端上传的参数
    const categories = await categoriesCollection.get()
	const goods = await goodsCollection.get()
	const order = await orderCollection.get()
	const sku = await skuCollection.get()
	
    let allData = {"categories":categories,"goods":goods,"order":order,"sku":sku}
    
	//返回数据给客户端
	return allData
};
