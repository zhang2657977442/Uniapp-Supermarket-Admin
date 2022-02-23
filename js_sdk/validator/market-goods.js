// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "goods_sn": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "货号"
  },
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "商品名称"
  },
  "goods_pic": {
    "rules": [
     {
       "format": "file"
     }
    ],
    "label": "商品图片"
  },
  "category_id": {
    "rules": [
  		{
  		  "required": true
  		},
      {
        "format": "string"
      }
    ],
	 "label": "类别"
  },
  "remain_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
    "label": "库存数量"
  },
  "month_sell_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
	 "label": "月销量"
  },
  "total_sell_count": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
	 "label": "总销量"
  },
  "is_real": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
    "label": "是否实物"
  },
  "is_on_sale": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
    "label": "是否上架"
  },
  "is_alone_sale": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
	 "label": "是否单销"
  },
  "is_best": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
	 "label": "是否精品"
  },
  "is_new": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ],
    "label": "是否新品"
  },
  "is_hot": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "bool"
      }
    ] ,
	"label": "是否热销"
  },
  "add_date": {
    "rules": [
		{
		  "required": true
		},
      {
        "format": "timestamp"
      }
    ],
	"label": "上架时间",
    "defaultValue": {
      "$env": "now"
    }
  },
  "seller_note": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
