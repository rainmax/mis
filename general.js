/*改文件存放通用函数与数据*/


//颜色表，用于区分多条折线，同种产品的色系相同，如手机都是粉色系
var colorArr = [{
    name: 'p1r1',
    colorValue: '#ffc0cb'
}, {
    name: 'p1r2',
    colorValue: '#ff7d93'
}, {
    name: 'p1r3',
    colorValue: '#ff4161'
}, {
    name: 'p2r1',
    colorValue: '#c1fff6'
}, {
    name: 'p2r2',
    colorValue: '#7dffec'
}, {
    name: 'p2r3',
    colorValue: '#41ffe4'
}, {
    name: 'p3r1',
    colorValue: '#f2ffc1'
}, {
    name: 'p3r2',
    colorValue: '#e3ff7d'
}, {
    name: 'p3r3',
    colorValue: '#d6ff41'
}];


//获取数组中的最大值
function getMaxNum(dataArr) {
    var max = dataArr[0];
    for (var i = 0; i < dataArr.length; i++) {
        if (max < dataArr[i]) {
            max = dataArr[i];
        }
    }
    return max;
}

//根据传递过来的参数值得到Y轴的顶点对应的值
//比如传过来725，该函数则返回750
function getTopValue(maxNum) {
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
function getColor(data) {
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
