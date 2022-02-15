
const COLOR = [
    "#EE6A66", "#6BC588", "#FFC300", "#24ABFD"
];

const CANVAS_2D = true

const TIMEARRAY = [
    {
        text: '当天',
        value: 'today'
    },
    {
        text: '昨天',
        value: 'yesterday'
    },
    {
        text: '本周',
        value: 'week'
    },
    {
        text: '上周',
        value: 'weeklast'
    },
    {
        text: '本月',
        value: 'month'
    },
    {
        text: '上月',
        value: 'monthlast'
    },
	{
	    text: '指定日期',
	    value: 'auto'
	}
];
const TABLIST = [
    {text:"新闻运营",value:"PAGE_ONE"},
    {text:"电商运营",value:"PAGE_TWO"},
    {text:"会员健康",value:"PAGE_THREE"},
    {text:"会员服务",value:"PAGE_FOUR"},
];

module.exports = {
    COLOR,
	CANVAS_2D,
    TIMEARRAY,
    TABLIST,
}