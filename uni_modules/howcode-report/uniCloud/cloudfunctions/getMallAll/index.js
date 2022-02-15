'use strict';
const db = uniCloud.database()
const categoriesCollection = db.collection("opendb-mall-categories")
const commentsCollection = db.collection("opendb-mall-comments")
const goodsCollection = db.collection("opendb-mall-goods")
const normCollection = db.collection("opendb-mall-norm")
const orderCollection = db.collection("opendb-mall-order")
const skuCollection = db.collection("opendb-mall-sku")

exports.main = async (event, context) => {
	//event为客户端上传的参数
    const categories = await categoriesCollection.get()
	const comments = await commentsCollection.get()
	const goods = await goodsCollection.get()
	const norm = await normCollection.get()
	const order = await orderCollection.get()
	const sku = await skuCollection.get()
	
    let allData = {"categories":categories,"comments":comments,"goods":goods,"norm":norm,"order":order,"sku":sku}
    
	//返回数据给客户端
	return allData
};
