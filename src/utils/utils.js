import moment from 'moment';
/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
/**
 * 计算提示框的宽度
 * @param str
 * @returns {number}
 */
export function calculateWidth(arr){
  return 30 + arr[0].length*15
}
/**
 * moment转日期字符串(YYYY-MM)
 * @param {*} monment 
 */
export function momentToStr(monments){
  return moment(monments).format('YYYY-MM');
 // return `${moment(monments).get('year')}-${moment(monments).get('month')+1}`
}