// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var a = prompt('請輸入第一個數字：');
var b = prompt('再輸入第二個數字：');
var numA = parseInt(a, 10);
var numB = parseInt(b, 10);
var output = '';
if( numA < numB ){
    n = numA;
    m = numB;
}
else{
    n = numB;
    m = numA;
}

for (var i = n; i <= m; i++) {
  for (var j = n; j <= m; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}
document.getElementById('result').textContent = output;
