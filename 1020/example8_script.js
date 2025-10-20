// example8_script.js
// 宣告一個學生物件，包含屬性與方法

var student = {
    name: '小明',
    id: 'A123456789',
    scores: [85, 90, 78],
    getAverage: function () {
        var sum = 0;
        for (var i = 0; i < this.scores.length; i++) {
            sum += this.scores[i];
        }
        return sum / this.scores.length;
    },
    info: function () {
        return '姓名：' + this.name + '\n學號：' + this.id;
    },
    getGrade: function () {
        var lev = "";
        if (this.scores > 80) {
            lev = 'A';
        } else if (this.scores > 60) {
            lev = 'B';
        } else if (n > 40) {
            msg += '\n' + n + ' 是c';
        } else if (n > 20) {
            msg += '\n' + n + ' 是D';
        } else {
            msg += '\n' + n + ' 是F';
        }
        return ;
    }
};


var text = student.info() + '\n平均：' + student.getAverage().toFixed(2) + student.getGrade();
document.getElementById('result').textContent = text;
