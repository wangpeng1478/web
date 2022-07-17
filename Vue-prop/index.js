/*
 * @Author: your name
 * @Date: 2021-07-16 10:11:06
 * @LastEditTime: 2021-07-16 10:11:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 */
//props类型
const TYPES = [
    'String', 
    'Number', 
    'Boolean', 
    'Array', 
    'Object', 
    'Date', 
    'Function', 
    'Symbol'
  ]
  
  //处理数据
  function getData(data){
    try{
      var obj = {}
      data.filter(_ => _.key).forEach((item) => {
        let {
          key,
          type,
          defaultValue,
          isDefault,
          required,
        } = item
        obj[key] = {
          type: type.length>1?type:type[0]
        }
        if(required){
          obj[key]['required'] = true
        }
        if (isDefault){
          if(type.includes('String')){
            obj[key].default = (defaultValue || '')+''
          } else if (type.includes('Number')) {
            obj[key].default = Number(defaultValue)
          } else if (type.includes('Boolean')){
            obj[key].default = ((defaultValue|| '').toUpperCase() == 'TRUE')?true:false
          } else if (type.includes('Array') || type.includes('Object')){
            let cd = type.includes('Array')?'[]':'{}'
            obj[key].default = `function(){return ${cd};//todo}`
          } else{
            obj[key].default = "//todo"
          }
        }
      })
      return formatData(obj)
    }catch(e){
      console.error(e)
      return '请检查数据'
    }
  }
  
  //格式化数据
  function formatData(data){
    var str = JSON.stringify(data, null, 2);
    return str.replace(/"String"/g, 'String')
      .replace(/"Number"/g, 'Number')
      .replace(/"Boolean"/g, 'Boolean')
      .replace(/"Array"/g, 'Array')
      .replace(/"Object"/g, 'Object')
      .replace(/"Date"/g, 'Date')
      .replace(/"Function"/g, 'Function')
      .replace(/"Symbol"/g, 'Symbol')
      .replace(/"function\(\)\{return \[\];\/\/todo\}"/g, 'function(){return [];//todo}')
      .replace(/"function\(\)\{return \{\};\/\/todo\}"/g, 'function(){return {};//todo}')
      .replace(/"(\S*)": /g, "$1: ")
  }
  
  function geuuid(length = 6) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
      result += str[Math.floor(Math.random() * str.length)];
    return result;
  }