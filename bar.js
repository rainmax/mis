function SvgBarGraph(wrapId, width, height) {
    this.NS = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(this.NS, 'svg');
    this.svgWidth = width;
    this.svgHeight = height;
    this.svg.setAttribute('xmlns', this.NS);
    this.svg.setAttribute('width', this.svgWidth);
    this.svg.setAttribute('height', this.svgHeight);
    this.svg.setAttribute('version', '1.1');
    // this.svg.setAttribute('font-weight', '800');
    var graphicWrap = document.getElementById(wrapId);
    graphicWrap.appendChild(this.svg);

}

SvgBarGraph.prototype.createBarGraph = function () {
    this.originPoint = { x: 50, y: this.svgHeight - 50 };
    this.barColor = 'blue';
    this.yLength = 240;
    this.xLength = 500;
    this.yPoints = []; //记录y轴各个点的相对于原点的坐标
    this.xPoints = []; //记录x轴各个点的相对于原点的坐标
    this.yText = []; //记录y轴上各个坐标点的文本
    this.xText = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    this.yDivNum = 5; //y轴被平分的份数
    this.maxBarWidth = parseInt(this.xLength / (this.xText.length + 1)) - 10; //柱状图的最大宽度
    this.svg.innerHTML = '';

    /*根据数据得到y轴坐标点的各个文本值*/
    //1.得到y轴上的最大值
    var topValue;
    var maxNumArr = [];
    for (var i = 0; i < this.data.length; i++) {
        maxNumArr.push(getMaxNum(this.data[i].sale));
    }
    var maxNum = getMaxNum(maxNumArr);
    topValue = getTopValue(maxNum);
    this.max = topValue;

    //2.根据最大值和y轴的平分的份数得到各个点的文本值
    var between = this.max / this.yDivNum;
    for (var i = 0; i <= this.yDivNum; i++) {
        this.yText.push(i * between + '');
    }

    /*计算出x轴和y轴的各个点相对于原点的坐标值*/
    var yPointSpaceBetween = parseInt(this.yLength / (this.yText.length - 1));
    var xPointSpaceBetween = parseInt(this.xLength / (this.xText.length + 1));
    for (var i = 0; i < this.yText.length; i++) {
        this.yPoints.push(i * -yPointSpaceBetween);
    }

    var sum = 0;
    for (var i = 0; i < this.xText.length; i++) {
        sum += xPointSpaceBetween + 3;
        if (i == 0) {
            sum -= 15;
        }
        this.xPoints.push(sum);
    }

    this.drawXYAxis();
    this.drawXYPointAndText();
    this.drawBar();
    this.drawTitle();
}

SvgBarGraph.prototype.drawXYAxis = function () {
    var gTag = this.createTag('g', { transform: 'translate(' + this.originPoint.x + ',' + this.originPoint.y + ')' });
    var lineTag = this.createTag('line', {
        x1: '0', x2: '0',
        y1: '0', y2: -this.yLength, stroke: 'black'
    });
    gTag.appendChild(lineTag);

    lineTag = this.createTag('line', {
        x1: "0", x2: this.xLength,
        y1: '0', y2: '0', stroke: 'black'
    });
    gTag.appendChild(lineTag);
    this.svg.append(gTag);
}

SvgBarGraph.prototype.drawXYPointAndText = function () {
    // 创建坐标点
    var gTag = this.createTag('g', { transform: 'translate(' + this.originPoint.x + ',' + this.originPoint.y + ')' });
    for (var i = 0; i < this.yPoints.length; i++) {
        var lineTag = this.createTag('line', {
            x1: '0', x2: '-10', y1: this.yPoints[i], y2: this.yPoints[i],
            stroke: 'black', 'stroke-width': '1'
        });
        gTag.appendChild(lineTag);
    }

    for (var i = 0; i < this.xPoints.length; i++) {
        var lineTag = this.createTag('line', {
            x1: this.xPoints[i], x2: this.xPoints[i], y1: '0', y2: '10',
            stroke: 'black', 'stroke-width': '1'
        });
        gTag.appendChild(lineTag);
    }
    this.svg.appendChild(gTag);

    //绘制对齐线
    var gTag = this.createTag('g', { transform: 'translate(' + this.originPoint.x + ',' + this.originPoint.y + ')' });
    for (var i = 1; i < this.yPoints.length; i++) {
        var lineTag = this.createTag('line', {
            x1: '0', x2: this.xLength, y1: this.yPoints[i], y2: this.yPoints[i],
            stroke: '#ccc', 'stroke-width': '1'
        });
        gTag.appendChild(lineTag);
    }
    this.svg.appendChild(gTag);

    // 创建坐标点文本
    var gTag = this.createTag('g', { transform: 'translate(' + this.originPoint.x + ',' + this.originPoint.y + ')' });
    for (var i = 0; i < this.yText.length; i++) {
        var textTag = this.createTag('text', {
            x: '-15', y: this.yPoints[i] + 6,
            "text-anchor": 'end'
        });
        textTag.innerHTML = this.yText[i];
        gTag.appendChild(textTag);
    }
    this.svg.appendChild(gTag);

    for (var i = 0; i < this.xText.length; i++) {
        var textTag = this.createTag('text', {
            x: this.xPoints[i], y: '25',
            "text-anchor": 'middle',
            'font-size': 12, 'font-weight': '900'
        });
        textTag.innerHTML = this.xText[i];
        gTag.appendChild(textTag);
    }
    this.svg.appendChild(gTag);
}

SvgBarGraph.prototype.drawBar = function () {
    //当绘制多条柱状图时，每条柱子能分到的宽度
    var mulBarWidth = parseInt(this.maxBarWidth / (this.data.length));
    var gTag = this.createTag('g', { transform: 'translate(' + this.originPoint.x + ',' + this.originPoint.y + ')' });
    for (var i = 0; i < this.data.length; i++) {
        var sales = this.data[i].sale; //得到销量数据
        var color = getColor(this.data[i]); //得到对应的表示颜色
        for (var j = 0; j < sales.length; j++) {
            var barHeight = sales[j] / this.max * this.yLength;
            var rectTag = this.createTag('rect', {
                x: this.xPoints[j] - this.maxBarWidth / 2 + i * mulBarWidth, y: -barHeight,
                width: mulBarWidth, height: barHeight - 1, fill: color
            });
            gTag.appendChild(rectTag);
        }
    }
    this.svg.appendChild(gTag);
}

SvgBarGraph.prototype.createTag = function (tag, attr) {
    var tag = document.createElementNS(this.NS, tag);
    for (const index in attr) {
        tag.setAttribute(index, attr[index]);
    }
    return tag;
}

// 生成提示标签，说明每种柱状图的颜色代表什么数据
SvgBarGraph.prototype.drawTitle = function () {
    var radiu = 5; //提示标签中圆图标的半径
    var startY = -this.yLength;
    var startX = this.xLength + radiu + 8;
    var labelSpace = 2 * radiu + 8; //标签之间的间隔
    var gTag = this.createTag('g', { transform: 'translate(' + this.originPoint.x + ',' + this.originPoint.y + ')',
        'font-size': 12, 'font-weight':900 });
    for (var i = 0; i < this.data.length; i++) {
        var colorValue = getColor(this.data[i]);
        var product = this.data[i].product;
        var region = this.data[i].region;
        var title = product + '-' + region;
        var circleTag = this.createTag('circle', {
            cx: startX, cy: startY + i * labelSpace,
            r: radiu, style: 'fill:' + colorValue
        });
        var textTag = this.createTag('text', { x: startX + 2 * radiu, y: startY + i * labelSpace + 5});
        textTag.innerHTML = title;
        gTag.appendChild(circleTag);
        gTag.appendChild(textTag);
    }
    this.svg.appendChild(gTag);
}

SvgBarGraph.prototype.setData = function (data) {
    if (!data) return;
    this.data = data;
    this.createBarGraph(data);
}
