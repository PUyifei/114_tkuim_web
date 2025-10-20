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
        if (student.getAverage() > 80) {
            lev = 'A';
        } else if (student.getAverage() > 60) {
            lev = 'B';
        } else if (student.getAverage() > 40) {
            lev = 'C';
        } else if (student.getAverage() > 20) {
            lev = 'D';
        } else {
            lev = 'F';
        }
        return '\n等第：'+lev;
    }
};


var text = student.info() + '\n平均：' + student.getAverage().toFixed(2) + student.getGrade();
document.getElementById('result').textContent = text;
