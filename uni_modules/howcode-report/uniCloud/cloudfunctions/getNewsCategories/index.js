'use strict';
const db = uniCloud.database()
const categoriesCollection = db.collection("opendb-news-categories")
exports.main = async (event, context) => {
	const categories = await categoriesCollection.get()
	
	return categories
};
