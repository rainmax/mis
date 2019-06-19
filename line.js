function LineChart(ctx) {
    /**@type {HTMLCanvasElement}*/
    this.ctx = document.querySelector('canvas').getContext('2d');
    // X轴和Y轴与canvas画布边缘的距离
    this.canvasWidth = this.ctx.canvas.width;
    this.canvasHeight = this.ctx.canvas.height;
    //原点坐标
    this.x0 = 50;
    this.y0 = this.canvasHeight - 50;
    //x轴和y轴的长度
    this.yLength = 240;
    this.xLength = 500;
    this.yAxisPointsNum = 6; //y轴上坐标点的个数，包括原点
    this.reallyX = []; //用于存储x轴各个点的位置
    this.data = [];
    this.max = 0;
}


LineChart.prototype.init = function (data) {
    // if(!data[0]) return;
    // this.drawXAndYAxis();
    // this.drawLine();
    // this.setData(data);
};

//画出x轴和y轴
LineChart.prototype.drawXAndYAxis = function () {
    var xText = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var yText = [];

    //得到y轴坐标的最大值
    var topValue;
    var maxNumArr = [];
    for (var i = 0; i < this.data.length; i++) {
        maxNumArr.push(this.getMaxNum(this.data[i].sale));
    }
    var maxNum = this.getMaxNum(maxNumArr);
    topValue = this.getTopValue(maxNum);
    this.max = topValue;

    //根据Y轴坐标最大值与Y轴上点的个数，得到Y轴上各个刻度的值
    var difValue = topValue / (this.yAxisPointsNum - 1);
    for (var i = 0; i < this.yAxisPointsNum; i++) {
        yText.push(i * difValue + '');
    }

    this.ctx.beginPath();

    this.ctx.moveTo(this.x0, this.y0);
    this.ctx.lineTo(this.x0, this.y0 - this.yLength);
    this.ctx.moveTo(this.x0, this.y0);
    this.ctx.lineTo(this.x0 + this.xLength, this.y0);

    // 1. 绘制出x轴和y轴的坐标点
    // 获取x轴长度，根据x轴坐标点个数求出各个点的间距
    var xSpace = Math.floor((this.xLength) / (xText.length - 1));
    var lineLength = 10; //坐标点的标签线的长度
    for (var i = 0; i < xText.length; i++) {
        var currentXPoint = i * xSpace + this.x0;
        this.ctx.moveTo(currentXPoint, this.y0);
        this.ctx.lineTo(currentXPoint, this.y0 + lineLength);
        this.reallyX.push(currentXPoint);
    }

    var ySpace = Math.floor((this.yLength) / (yText.length - 1));
    for (var i = 0; i < yText.length; i++) {
        var currentYPoint = this.y0 - (i * ySpace);
        this.ctx.moveTo(this.x0, currentYPoint);
        this.ctx.lineTo(this.x0 - lineLength, currentYPoint);
    }
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();

    this.ctx.beginPath();
    for (var i = 1; i < yText.length; i++) {
        var currentYPoint = this.y0 - (i * ySpace);
        this.ctx.moveTo(this.x0, currentYPoint);
        this.ctx.lineTo(this.x0 + this.xLength, currentYPoint);
    }
    this.ctx.strokeStyle = '#ccc';
    this.ctx.stroke();




    //2.绘制出x轴和y轴的坐标点的文本
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.textBaseline = 'top';
    this.ctx.font = '12px san-serif';
    this.ctx.textAlign = 'center';
    for (var i = 0; i < xText.length; i++) {
        var currentXPoint = i * xSpace + this.x0;
        this.ctx.strokeText(xText[i], currentXPoint, this.y0 + lineLength);
    }

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'end';
    for (var i = 0; i < yText.length; i++) {
        var currentYPoint = this.y0 - (i * ySpace);
        this.ctx.strokeText(yText[i], this.x0 - lineLength - 3, currentYPoint);
    }
};

//根据数据画出折线
LineChart.prototype.drawLine = function () {
    if (!this.data[0]) return;
    //求出数据在Y轴的位置
    for (var i = 0; i < this.data.length; i++) {
        var sales = this.data[i].sale;
        var colorValue = this.getColor(this.data[i]);
        for (var j = 0; j < sales.length; j++) {
            var currentYPoint = Math.floor((this.data[i].sale[j] / this.max) * (this.yLength));
            currentYPoint = this.y0 - currentYPoint;
            //画出对应的折线图
            var preX;
            var preY;
            var currentX = this.reallyX[j];
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentYPoint, 2.5, 0, 2 * Math.PI);
            this.ctx.fillStyle = colorValue;
            this.ctx.strokeStyle = colorValue;
            this.ctx.fill();
            if (j > 0) {
                this.ctx.moveTo(preX, preY);
                this.ctx.lineTo(currentX, currentYPoint);
                this.ctx.stroke();
            }
            preX = currentX;
            preY = currentYPoint;
        }

    }

}

LineChart.prototype.setData = function (data) {
    if (!data) return;
    this.data = data;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawXAndYAxis();
    this.drawLine();
    this.drawTitle();
}

//获取某数组中的最大值
LineChart.prototype.getMaxNum = function (dataArr) {
    var max = dataArr[0];
    for (var i = 0; i < dataArr.length; i++) {
        if (max < dataArr[i]) {
            max = dataArr[i];
        }
    }
    return max;
}

//根据数据中的最大值得到Y轴的顶点对应的值
LineChart.prototype.getTopValue = function (maxNum) {
    var topValue;
    if (maxNum >= 100) { //三位数
        topValue = Math.ceil(maxNum / 100) * 100;
        if (topValue - maxNum >= 50) {
            topValue -= 50;
        }
    } else {
        topValue = Math.ceil(maxNum / 10) * 10;
        if (topValue - maxNum >= 5) {
            topValue -= 5;
        }
    }
    return topValue;
}

//根据数据中的地区和商品分配颜色值
LineChart.prototype.getColor = function (data) {
    var rSearch, pSearch, colorValue;
    switch (data.region) {
        case '华东':
            rSearch = 'r1';
            break;
        case '华北':
            rSearch = 'r2';
            break;
        case '华南':
            rSearch = 'r3';
            break;
        default:
            break;
    }

    switch (data.product) {
        case '手机':
            pSearch = 'p1';
            break;
        case '笔记本':
            pSearch = 'p2';
            break;
        case '智能音箱':
            pSearch = 'p3';
            break;
        default:
            break;
    }

    for (var i = 0; i < colorArr.length; i++) {
        var colorObj = colorArr[i];
        if (colorObj.name.indexOf(pSearch) != -1 && colorObj.name.indexOf(rSearch) != -1) {
            colorValue = colorObj.colorValue;
            break;
        }
    }
    return colorValue;
}

// 生成提示标签，说明每条折线的颜色代表什么数据
LineChart.prototype.drawTitle = function () {
    var radiu = 5; //提示标签中圆图标的半径
    var startY = this.y0 - this.yLength;
    var startX = this.x0 + this.xLength + radiu + 8;
    var labelSpace = 2 * radiu + 5; //标签之间的间隔
    for (var i = 0; i < this.data.length; i++) {
        var colorValue = this.getColor(this.data[i]);
        var product = this.data[i].product;
        var region = this.data[i].region;
        var title = product + '-' + region;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY + i * labelSpace, radiu, 0, 2 * Math.PI);
        this.ctx.fillStyle = colorValue;
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.textAlign = 'start';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeText(title, startX + 2 * radiu, startY + i * labelSpace);
    }
}
