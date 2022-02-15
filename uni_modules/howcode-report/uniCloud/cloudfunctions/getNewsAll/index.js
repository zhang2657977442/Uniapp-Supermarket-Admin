'use strict';
const db = uniCloud.database()
const categoriesCollection = db.collection("opendb-news-categories")
const articlesCollection = db.collection("opendb-news-articles")
const favoriteCollection = db.collection("opendb-news-favorite")
const commentsCollection = db.collection("opendb-news-comments")

exports.main = async (event, context) => {
	//event为客户端上传的参数
    const categories = await categoriesCollection.get()
	const articles = await articlesCollection.get()
	const favorite = await favoriteCollection.get()
	const comments = await commentsCollection.get()
	
    let allData = []
    allData.push(categories);
    allData.push(articles);
    allData.push(favorite);
    allData.push(comments);
    
	//返回数据给客户端
	return allData
};
