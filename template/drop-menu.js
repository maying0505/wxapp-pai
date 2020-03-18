const DATA = require('data')
const DISTINCTS = DATA.distincts;
const DEFAULT_CODE = 100000;

function getData(code) {
  code = code ? code : DEFAULT_CODE
  console.log('code'+code)
  return DISTINCTS[code] || [];
}

function getProvince(choose,current) {
  return getChooseData(choose, current)
}

function getCities(choose,current){
  return getChooseData(choose, current)
}

function getAreas(choose,current){
  return getChooseData(choose,current)
}

function getChooseData(choose,current){

  if(choose==current){
    return [];
  }else{
    let code = getCode(choose);
    return getData(code)
  }
}



function getCode(name){
  for (let x in DISTINCTS){
    for (let y in DISTINCTS[x]){
      if (name == DISTINCTS[x][y]){
        return y;
      }
    }
  }
}

function getCode1(name) {
  let showCode = '';
  for (let x in DISTINCTS) {
    for (let y in DISTINCTS[x]) {
      if (name == DISTINCTS[x][y]) {
        showCode = y;
      }
    }
  }
  return showCode
}

function getCodeValue(code){
  for (let x in DISTINCTS) {
    for (let y in DISTINCTS[x]) {
      if (code === parseInt(y)) {
        return DISTINCTS[x][y];
      }
    }
  }
}

function getCodeIndex(name,array) {
  for (let x in array) {
    if (name === array[x].name) {
      return x;
    }
  }
}





module.exports = {
  getData: getData,
  getProvince: getProvince,
  getCities:getCities,
  getAreas:getAreas,
  getCode:getCode,
  getCode1: getCode1,
  getCodeValue: getCodeValue,
  getCodeIndex: getCodeIndex
};