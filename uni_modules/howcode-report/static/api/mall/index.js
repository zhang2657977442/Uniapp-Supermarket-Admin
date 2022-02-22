/**
 * 颜色配置
 */
const configColor = ["#FFBE68", "#0FEBE1", "#BF8DFC", "#FF859C", "#51ADCF"]

/**
 *
 * @param {Number} n: 需要补齐两位数的数字
 * @return {String} String: 前面用0补齐的两位或多位数字，字符类型。如: 2->02 12->12
 */
function doubleNum(n) {
	const str = "" + n;
	// return str[1] ? str : `0${str}`;
	return str.padStart(2, "0");
}

/**
 *
 * @param 传入年月即可转成对应的月初和月末时间戳
 * @return [1614528000000, 1617120000000]
 */
function computeTime(year, month) {
	return [
		new Date(year, month - 1, 1).getTime(),
		new Date(year, month, 0).getTime()
	]
}
/**
 * @param 获取传入时间的时间戳
 */
function toTimeStamp(year, month,day) {
	return new Date(year, month - 1, day).getTime()
}

/**
 * 电商进度条的数据api
 * @param {Number} length:获取数据的长度
 * name:标题
 * num:数值
 * width:宽度；但不传，组件内部根据用户是否开启排序并通过num值自动计算获得
 * background:自动分配配置颜色
 */
const getGoodsProgressBar = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getGoodsProgressBar",
			data
		}).then((res) => {
			if (res.result.data.length > 0) {
				let result = [];
				let topResult = res.result.data.sort((a, b) => b.total_sell_count - a.total_sell_count).splice(0, data.length)
				topResult.map((x, index) => {
					let object = {
						"name": x.name,
						"num": x.total_sell_count,
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
 * 电商textBlock的数据api
 * * @param {String} ne为第一个textBlock，two为第二个textBlock
 * 注意第一个textBlock由于数据有限仅做了一条真实数据，第二个textBlock全是真实数据
 * 完成进度 = 本期数 / 指标目标 * 100%
 * 同比增长率 = （本期数-同期数）/ 同期数 × 100%
 * 环比增长率 = （本期数-上期数）/ 上期数 × 100%
 * 平均完成水平 = 指标表opendb-mall-norm对应的average数值
 */
const getMallTextBlock = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getMallAll",
			data
		}).then((res) => {
			if (res.result.categories.data.length > 0) {
				let result = [];
				//以三月为例当做本月,本月时间戳
				let timer = computeTime(2021, 3); 
				let timeStar = timer[0]
				let timeEnd = timer[1]
				
				//去年3月的时间戳
				let grewTimer = computeTime(2020, 3); 
				let grew_timeStar = grewTimer[0]
				let grew_timeEnd = grewTimer[1]
				
				//上月的时间戳
				let growthTimer = computeTime(2021, 2); 
				let growth_timeStar = growthTimer[0]
				let growth_timeEnd = growthTimer[1]
				
				switch (data.data.type) {
					// case "one":
					// 	let comments = res.result.comments //总评论
					// 	let commonNorm = res.result.norm.data.filter(x => x.name == "订单评论")[0]; //评论指标
					// 	let nowComments = comments.data.filter(x => x.create_date >= timeStar && x.create_date <= timeEnd); //本月评论
					// 	let grewComments = comments.data.filter(x => x.create_date >= grew_timeStar && x.create_date <= grew_timeEnd); //上年同月评论
					// 	let growthComments = comments.data.filter(x => x.create_date >= growth_timeStar && x.create_date <=
					// 		growth_timeEnd); //上月评论

					// 	let now = parseInt(nowComments.length / commonNorm.expect * 100) + "%" // 完成进度
					// 	let grew_rate = grewComments.length > 0 ? parseInt((nowComments.length - grewComments.length) / grewComments
					// 		.length * 100) + "%" : "100%" // 同比增长率
					// 	let growth_rate = growthComments.length > 0 ? parseInt((nowComments.length - growthComments.length) /
					// 		growthComments.length * 100) + "%" : "100%" // 环比增长率
					// 	let average = commonNorm.average // 平均完成水平

					// 	let array = [];
					// 	let obj1 = {
					// 		"name": "评论",
					// 		"now": now,
					// 		"grew_rate": grew_rate,
					// 		"growth_rate": growth_rate,
					// 		"average": average
					// 	} //只有本条是真实数据，由于数据有限下两条是模拟
					// 	let obj2 = {
					// 		"name": "门店销售",
					// 		"now": "78%",
					// 		"grew_rate": "-3.2%",
					// 		"growth_rate": "5.2%",
					// 		"average": "97%"
					// 	}
					// 	let obj3 = {
					// 		"name": "电商销售",
					// 		"now": "89%",
					// 		"grew_rate": "1.2",
					// 		"growth_rate": "-2.4%",
					// 		"average": "85%"
					// 	}
					// 	array.push(obj1)
					// 	array.push(obj2)
					// 	array.push(obj3)

					// 	array.map(x => {
					// 		let obj = {
					// 			"kind": 5,
					// 			"background": ["#3EB2F5", "#9374F7"],
					// 			"content": [{
					// 					"text": x.name,
					// 					"value": "",
					// 					"colortext": "#fff",
					// 					"colorvalue": "",
					// 					"size": 24
					// 				},
					// 				{
					// 					"text": "",
					// 					"value": x.now,
					// 					"colortext": "",
					// 					"colorvalue": "#fff",
					// 					"size": 44
					// 				},
					// 				{
					// 					"text": "环比",
					// 					"value": x.growth_rate,
					// 					"colortext": "#fff",
					// 					"colorvalue": "#fff",
					// 					"size": 20
					// 				},
					// 				{
					// 					"text": "同比",
					// 					"value": x.grew_rate,
					// 					"colortext": "#fff",
					// 					"colorvalue": "#fff",
					// 					"size": 20
					// 				},
					// 				{
					// 					"text": "平均参考水平",
					// 					"value": x.average,
					// 					"colortext": "#fff",
					// 					"colorvalue": "#fff",
					// 					"size": 20
					// 				}
					// 			]
					// 		}
					// 		result.push(obj)
					// 	})
					// 	break;
					// case "two":
					// 	let orders = res.result.order //总评论
					// 	let offlineNorm = res.result.norm.data.filter(x => x.name == "线下订单")[0]; //线下订单指标
					// 	let O2ONorm = res.result.norm.data.filter(x => x.name == "O2O订单")[0]; //O2O订单指标
					// 	let B2CNorm = res.result.norm.data.filter(x => x.name == "B2C订单")[0]; //B2C订单指标

					// 	/* 线下订单计算开始 */
					// 	let nowOfflineCount = 0;	//线下本期订单成交金额
					// 	let grewOfflineCount = 0;	//线下同期订单成交金额
					// 	let growthOfflineCount = 0;	//线下上期订单成交金额
					// 	let offline_now = "";
					// 	let offline_grew_rate = "";
					// 	let offline_growth_rate = "";
					// 	let offline_average = "";
						
					// 	/*分别取出每期订单，注意：这里没有过滤支付的订单，连同取消订单一同取出计算*/
					// 	let nowOfflineOrders = orders.data.filter(x => x.platform_type == 1 && x.create_date >= timeStar && x.create_date <=
					// 		timeEnd);
					// 	let grewOfflineOrders = orders.data.filter(x => x.platform_type == 1 && x.create_date >= grew_timeStar && x.create_date <=
					// 		grew_timeEnd);
					// 	let growthOfflineOrders = orders.data.filter(x => x.platform_type == 1 && x.create_date >= growth_timeStar &&
					// 		x.create_date <= growth_timeEnd);
							
					// 	/* 分别计算每期订单金额 */
					// 	nowOfflineOrders.forEach(ele => {
					// 		nowOfflineCount += ele.total_cash;
					// 	});
					// 	grewOfflineOrders.forEach(ele => {
					// 		grewOfflineCount += ele.total_cash;
					// 	});
					// 	growthOfflineOrders.forEach(ele => {
					// 		growthOfflineCount += ele.total_cash;
					// 	});
						
					// 	/*计算过程*/
					// 	offline_now = parseInt(nowOfflineCount / offlineNorm.expect * 100) + "%" //完成进度
					// 	offline_grew_rate = grewOfflineCount > 0 ? parseInt((nowOfflineCount - grewOfflineCount) /
					// 		grewOfflineCount * 100) + "%" : "100%"; //同比
					// 	offline_growth_rate = growthOfflineCount > 0 ? parseInt((nowOfflineCount - growthOfflineCount) /
					// 		growthOfflineCount * 100) + "%" : "100%"; //环比
					// 	offline_average = offlineNorm.average; //平均完成水平
					// 	/* 线下订单计算结束 */
						
					// 	/* O2O订单计算开始 */
					// 	let nowO2OCount = 0;
					// 	let grewO2OCount = 0;
					// 	let growthO2OCount = 0;
					// 	let O2O_now = "";
					// 	let O2O_grew_rate = "";
					// 	let O2O_growth_rate = "";
					// 	let O2O_average = "";
					// 	let nowO2OOrders = orders.data.filter(x => x.platform_type == 2 && x.create_date >= timeStar && x.create_date <=
					// 		timeEnd);
					// 	let grewO2OOrders = orders.data.filter(x => x.platform_type == 2 && x.create_date >= grew_timeStar && x.create_date <=
					// 		grew_timeEnd);
					// 	let growthO2OOrders = orders.data.filter(x => x.platform_type == 2 && x.create_date >= growth_timeStar &&
					// 		x.create_date <= growth_timeEnd);
					// 	nowO2OOrders.forEach(ele => {
					// 		nowO2OCount += ele.total_cash;
					// 	});
					// 	grewO2OOrders.forEach(ele => {
					// 		grewO2OCount += ele.total_cash;
					// 	});
					// 	growthO2OOrders.forEach(ele => {
					// 		growthO2OCount += ele.total_cash;
					// 	});
					// 	O2O_now = parseInt(nowO2OCount / O2ONorm.expect * 100) + "%"
					// 	O2O_grew_rate = grewO2OCount > 0 ? parseInt((nowO2OCount - grewO2OCount) /
					// 		grewO2OCount * 100) + "%" : "100%";
					// 	O2O_growth_rate = growthO2OCount > 0 ? parseInt((nowO2OCount - growthO2OCount) /
					// 		growthO2OCount * 100) + "%" : "100%";
					// 	O2O_average = O2ONorm.average; 
					// 	/* O2O订单计算结束 */
						
					// 	/* B2C订单计算开始 */
					// 	let nowB2CCount = 0;
					// 	let grewB2CCount = 0;
					// 	let growthB2CCount = 0;
					// 	let B2C_now = "";
					// 	let B2C_grew_rate = "";
					// 	let B2C_growth_rate = "";
					// 	let B2C_average = "";
					// 	let nowB2COrders = orders.data.filter(x => x.platform_type == 3 && x.create_date >= timeStar && x.create_date <=
					// 		timeEnd);
					// 	let grewB2COrders = orders.data.filter(x => x.platform_type == 3 && x.create_date >= grew_timeStar && x.create_date <=
					// 		grew_timeEnd);
					// 	let growthB2COrders = orders.data.filter(x => x.platform_type == 3 && x.create_date >= growth_timeStar &&
					// 		x.create_date <= growth_timeEnd);
					// 	nowB2COrders.forEach(ele => {
					// 		nowB2CCount += ele.total_cash;
					// 	});
					// 	grewB2COrders.forEach(ele => {
					// 		grewB2CCount += ele.total_cash;
					// 	});
					// 	growthB2COrders.forEach(ele => {
					// 		growthB2CCount += ele.total_cash;
					// 	});
					// 	B2C_now = parseInt(nowB2CCount / B2CNorm.expect * 100) + "%"
					// 	B2C_grew_rate = grewB2CCount > 0 ? parseInt((nowB2CCount - grewB2CCount) /
					// 		grewB2CCount * 100) + "%" : "100%";
					// 	B2C_growth_rate = growthB2CCount > 0 ? parseInt((nowB2CCount - growthB2CCount) /
					// 		growthB2CCount * 100) + "%" : "100%"; 
					// 	B2C_average = B2CNorm.average; 
					// 	/* B2C订单计算结束 */
						
					// 	let two_array = [];
					// 	let two_obj1 = {
					// 		"name": "线下订单",
					// 		"now": offline_now,
					// 		"grew_rate": offline_grew_rate,
					// 		"growth_rate": offline_growth_rate,
					// 		"average": offline_average
					// 	}

					// 	let two_obj2 = {
					// 		"name": "O2O订单",
					// 		"now": O2O_now,
					// 		"grew_rate": O2O_grew_rate,
					// 		"growth_rate": O2O_growth_rate,
					// 		"average": O2O_average
					// 	}
					// 	let two_obj3 = {
					// 		"name": "B2C订单",
					// 		"now": B2C_now,
					// 		"grew_rate": B2C_grew_rate,
					// 		"growth_rate": B2C_growth_rate,
					// 		"average": B2C_average
					// 	}
					// 	two_array.push(two_obj1)
					// 	two_array.push(two_obj2)
					// 	two_array.push(two_obj3)

					// 	two_array.map(x => {
					// 		let obj = {
					// 			"kind": 5,
					// 				"background": ["#3EB2F5", "#9374F7"],
					// 			"content": [{
					// 					"text": x.name,
					// 					"value": "",
					// 					"colortext": "#fff",
					// 					"colorvalue": "",
					// 					"size": 24
					// 				},
					// 				{
					// 					"text": "",
					// 					"value": x.now,
					// 					"colortext": "",
					// 					"colorvalue": "#fff",
					// 					"size": 44
					// 				},
					// 				{
					// 					"text": "环比",
					// 					"value": x.growth_rate,
					// 					"colortext": "#fff",
					// 					"colorvalue": "#fff",
					// 					"size": 20
					// 				},
					// 				{
					// 					"text": "同比",
					// 					"value": x.grew_rate,
					// 					"colortext": "#fff",
					// 					"colorvalue": "#fff",
					// 					"size": 20
					// 				},
					// 				{
					// 					"text": "平均参考水平",
					// 					"value": x.average,
					// 					"colortext": "#fff",
					// 					"colorvalue": "#fff",
					// 					"size": 20
					// 				}
					// 			]
					// 		}
					// 		result.push(obj)
					// 	})
					// 	break;
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
 * 电商Mix图表的数据api
 * column：柱形图表
 * line：折线图表
 * line + curve：曲线图表
 * 具体查看ucharts图表配置
 */
const getGoodsMixCharts = (data) => {
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: "getMallOrders",
			data
		}).then((res) => {
			if (res.result.data.length > 0) {
				let allOrder = res.result.data
				let result = {categories:[],series:[]};
				//由于数据不能一直更新且有限，故选取特定的一组时间计算
				let time_array =  ["2021-3-21", "2021-3-22", "2021-3-23", "2021-3-24", "2021-3-25", "2021-3-26", "2021-3-27"] 
				let time_stamp_arr = []
				result.categories = time_array.map(x=>{
					let time_arr = x.split("-");
					let timeStamp = toTimeStamp(time_arr[0],time_arr[1],time_arr[2]);
					time_stamp_arr.push(timeStamp);
					return x.substr(5,x.length);
				})
				let offlineData=[],o2oData=[],b2cData=[];
				time_stamp_arr.map((timeItem,index)=>{
					let offline_orders = allOrder.filter(x=>x.platform_type == 1 && x.create_date == timeItem);
					let o2o_order = allOrder.filter(x=>x.platform_type == 2 && x.create_date == timeItem);
					let b2c_order = allOrder.filter(x=>x.platform_type == 3 && x.create_date == timeItem);
					
					let offline_count=0,o2o_count=0,b2c_count=0
					offline_orders.map(x=>{offline_count+=x.total_cash});
					o2o_order.map(x=>{o2o_count+=x.total_cash});
					b2c_order.map(x=>{b2c_count+=x.total_cash});
					offlineData.push(offline_count)
					o2oData.push(o2o_count)
					b2cData.push(b2c_count)
				})
				let offlineObject = {
					"name":"线下销售",
					"data":offlineData,
					"type": "column",
					"color": "#F88F53",
				}
				let o2oObject = {
					"name":"O2O销售",
					"data":o2oData,
					"type": "line",
					"color": "#F37B1D"
				}
				let b2cObject = {
					"name":"B2C销售",
					"data":b2cData,
					"type": "line",
					"style": "curve",
					"lineType": "dash",
					"color": "#EE2223"
				}
				result.series.push(offlineObject)
				result.series.push(o2oObject)
				result.series.push(b2cObject)
				
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
export default {
	getGoodsProgressBar,
	getMallTextBlock,
	getGoodsMixCharts
}
