'use strict';

const db = uniCloud.database()
const newsCategoriesCollection = db.collection('opendb-news-categories')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	const res = await newsCategoriesCollection.get()
	
	//返回数据给客户端
	return res
};
