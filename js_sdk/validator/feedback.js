// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "range": [
          {
            "value": "功能建议",
            "text": "功能建议"
          },
          {
            "value": "故障反馈",
            "text": "故障反馈"
          },
          {
            "value": "其他问题",
            "text": "其他问题"
          }
        ]
      }
    ]
  },
  "content": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "maxLength": 500
      }
    ]
  },
  "contact": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 50
      }
    ]
  },
  "create_time": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "timestamp"
      }
    ]
  },
  "ip": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "platform": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
}

const enumConverter = {
  "type_valuetotext": {
    "功能建议": "功能建议",
    "故障反馈": "故障反馈",
    "其他问题": "其他问题"
  }
}

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
