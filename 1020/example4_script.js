// example4_script.js
// 判斷輸入數字是否為奇數或偶數

var input = prompt('請輸入一個整數：');
var n = parseInt(input, 10);
var msg = '';

if (isNaN(n)) {
  msg = '輸入不是有效的整數！';
} else if (n % 2 === 0) {
  msg = n + ' 是偶數';
} else {
  msg = n + ' 是奇數';
}

// 額外示範 switch（1、2、3 對應文字）
var choice = prompt('輸入 1/2/3 試試 switch：');
switch (choice) {
  case '1':
    msg += '\n你輸入了 1';
    break;
  case '2':
    msg += '\n你輸入了 2';
    break;
  case '3':
    msg += '\n你輸入了 3';
    break;
  default:
    msg += '\n非 1/2/3';
}

var input = prompt('請輸入分數：');

if (n >100 || n < 0) {
  msg += '\n輸入不是有效的分數！';
} else if (n > 80) {
  msg += '\n'+ n + ' 是A';
} else if (n > 60) {
  msg += '\n'+ n + ' 是B';
} else if (n > 40) {
  msg += '\n'+ n + ' 是是c';
} else if (n >20) {
  msg += '\n'+ n + ' 是是D';
} else {
  msg += '\n'+ n + ' 是是F';
}

document.getElementById('result').textContent = msg;
