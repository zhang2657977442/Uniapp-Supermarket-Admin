/**
 * 颜色配置
 */
const configColor = ["#FFBE68", "#0FEBE1", "#BF8DFC", "#FF859C", "#51ADCF"]

/**
 * 新闻进度条的数据api
 * name:标题
 * num:数值
 * width:宽度；但不传，组件内部根据用户是否开启排序并通过num值自动计算获得
 * background:自动分配配置颜色
 */
const getNewsProgressBar = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getNewsCategories",
			data
		}).then((res) => {
			if (res.result.data.length > 0) {
				let result = [];
				res.result.data.map((x, index) => {
					let object = {
						"name": x.name,
						"num": x.article_count,
						"width": "",
						"background": configColor[index % 5]
					};
					result.push(object);
				})
				reslove(result)
			} else {
				reject(res.result)
			}
		}).catch((err) => {
			console.log(err);
			reject(err)
		})
	})
}

/**
 * 新闻文本块的数据api
 * type：one为第一个textBlock，two为第二个textBlock；
 */
const getNewsTextBlock = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getNewsAll",
			data
		}).then((res) => {
			if (res.result.length > 0) {
				let result = [];
				switch (data.data.type) {
					case "one":
						res.result.map((x, index) => {
							let text = "";
							switch (index) {
								case 0:
									text = "类目数量";
									break;
								case 1:
									text = "文章数量";
									break;
								case 2:
									text = "收藏数量";
									break;
								case 3:
									text = "评论数量";
									break;
							}
							let object = {
								"kind": 1,
								"background": ["#3EB2F5", "#9374F7"],
								"content": [{
										"text": "",
										"value": x.affectedDocs,
										"colortext": "",
										"colorvalue": "#fff",
										"size": 44
									},
									{
										"text": text,
										"value": "",
										"colortext": "#fff",
										"colorvalue": "",
										"size": 24
									}
								]
							};
							result.push(object);
						})
						break;
					case "two":
						let view_count = 0;
						let like_count = 0;
						res.result[1].data.map(x => {
							view_count += x.view_count;
							like_count += x.like_count;
						})
						res.result.map((x, index) => {
							let text = "";
							let value = 0;
							switch (index) {
								case 0:
									text = "阅读数量";
									value = view_count;
									break;
								case 1:
									text = "点赞数量";
									value = like_count;
									break;
								case 2:
									text = "收藏数量";
									value = x.affectedDocs;
									break;
								case 3:
									text = "评论数量";
									value = x.affectedDocs;
									break;
							}
							let object = {
								"kind": 1,
								"background": ["#3EB2F5", "#9374F7"],
								"content": [{
										"text": "",
										"value": value,
										"colortext": "",
										"colorvalue": "#fff",
										"size": 44
									},
									{
										"text": text,
										"value": "",
										"colortext": "#fff",
										"colorvalue": "",
										"size": 24
									}
								]
							};
							result.push(object);
						})
						break;
				}
				reslove(result)
			} else {
				reject(res.result)
			}
		}).catch((err) => {
			console.log(err);
			reject(err)
		})
	})
}

/**
 * 新闻table的数据api
 * 第1列：标题
 * 第2列：类型
 * 第3列：评论量
 * 第4列：收藏量
 * 第5列：点赞量
 * 第6列：阅读量
 */
const getNewsTable = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getNewsAll",
			data
		}).then((res) => {
			if (res.result.length > 0) {
				let result = {};
				let headers = [{
					"label": "文章标题",
					"key": "col1"
				}, {
					"label": "类型",
					"key": "col2"
				}, {
					"label": "评论量",
					"key": "col3"
				}, {
					"label": "收藏量",
					"key": "col4"
				}, {
					"label": "点赞量",
					"key": "col5"
				}, {
					"label": "阅读量",
					"key": "col6"
				}];
				let sortCol = [{
						"key": "col1",
						"isNumber": false
					},
					{
						"key": "col2",
						"isNumber": false
					},
					{
						"key": "col3",
						"isNumber": true
					},
					{
						"key": "col4",
						"isNumber": true
					},
					{
						"key": "col5",
						"isNumber": true
					},
					{
						"key": "col6",
						"isNumber": true
					}
				];
				let contents = [];
				let categories = res.result[0].data;
				let article = res.result[1].data;
				let favorite = res.result[2].data;
				let comments = res.result[3].data;
				res.result.map((x, index) => {
					let object = {
						"col1": article[index].title,
						"col2": categories.filter(x => x._id == article[index].category_id)[0].name,
						"col3": comments.filter(x => x.article_id == article[index]._id).length,
						"col4": favorite.filter(x => x.article_id == article[index]._id).length,
						"col5": article[index].like_count,
						"col6": article[index].view_count
					};
					contents.push(object);
				})
				result = {
					headers,
					contents,
					sortCol
				}
				reslove(result)
			} else {
				reject(res.result)
			}
		}).catch((err) => {
			reject(err)
		})
	})
}

export default {
	getNewsProgressBar,
	getNewsTextBlock,
	getNewsTable
}
