//電腦隨機產生 1–100（Math.floor(Math.random()*100)+1）。
//使用 prompt() 讓使用者輸入數字，提示「再大一點 / 再小一點」。
//猜中顯示次數統計。

var ans = Math.floor(Math.random() * 100) + 1;
var aStr;
var count = 0;
var line ='';

while (true) {
    var aStr = prompt('請輸入任意數字：');
    var aNum = parseFloat(aStr);
    count++;
    if (isNaN(aNum)) {
        alert('請輸入有效的數字！');
        continue;
    }

    if (aNum > ans) {
        alert('再小一點');
    } else if (aNum < ans) {
        alert('再大一點');
    } else {
        
        break;
    }
}
line = '恭喜你猜對了！\n答案是：' + ans + '\n你總共猜了 ' + count + ' 次。';
document.getElementById('result').textContent = line;
