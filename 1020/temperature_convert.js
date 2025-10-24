// temperature_convert.js
// 使用 prompt() 讀入溫度與單位（C 或 F）。
// 轉換公式：C = (F - 32) * 5 / 9；F = C * 9 / 5 + 32。
// 結果以 alert() 與頁面 <pre> 顯示。

var cStr = prompt('請輸入攝氏溫度：');
var fStr = prompt('請輸入華氏溫度：');
var cNum = parseFloat(cStr);
var fNum = parseFloat(fStr);

var output = '';
output += '攝氏為 ' + ((fNum - 32) * 5 / 9).toFixed(2);
output += '\n華氏為 ' + (cNum * 9 / 5 + 32).toFixed(2);

alert(output);
console.log(output);
document.getElementById('result').textContent = output;
