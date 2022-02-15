'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	db.collection('opendb-news-articles') // 注意collection方法内需要传入所有用到的表名，用逗号分隔，主表需要放在第一位
	  .get()
	  .then(res => {
	    console.log(res);
	  }).catch(err => {
	    console.error(err)
	  })
	
	//返回数据给客户端
	return event
};
