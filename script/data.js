let sourceData = [{
    product: "手机",
    region: "华东",
    sale: [120, 100, 140, 160, 180, 185, 190, 210, 230, 245, 255, 270]
}, {
    product: "手机",
    region: "华北",
    sale: [80, 70, 90, 110, 130, 145, 150, 160, 170, 185, 190, 200]
}, {
    product: "手机",
    region: "华南",
    sale: [220, 200, 240, 250, 260, 270, 280, 295, 310, 335, 355, 380]
}, {
    product: "笔记本",
    region: "华东",
    sale: [50, 60, 80, 110, 30, 20, 70, 30, 420, 30, 20, 20]
}, {
    product: "笔记本",
    region: "华北",
    sale: [30, 35, 50, 70, 20, 15, 30, 50, 710, 130, 20, 20]
}, {
    product: "笔记本",
    region: "华南",
    sale: [80, 120, 130, 140, 70, 75, 120, 90, 550, 120, 110, 100]
}, {
    product: "智能音箱",
    region: "华东",
    sale: [10, 30, 4, 5, 6, 5, 4, 5, 6, 5, 5, 25]
}, {
    product: "智能音箱",
    region: "华北",
    sale: [15, 50, 15, 15, 12, 11, 11, 12, 12, 14, 12, 40]
}, {
    product: "智能音箱",
    region: "华南",
    sale: [10, 40, 10, 6, 5, 6, 8, 6, 6, 6, 7, 26]
}]

var saveButton = document.getElementById('saveButton');
var clearButton = document.getElementById('clearButton');
saveButton.onclick = function () {
    var table = document.querySelector('table');
    var trs = table.querySelectorAll('tr');
    var data = [];
    for (var i = 1; i < trs.length; i++) {
        let obj = {};
        let sales = [];
        var tds = trs[i].querySelectorAll('td');
        if (tds[1].getAttribute('data-type') !== 'sales') {
            var attr1 = tds[0].getAttribute('data-type');
            var data1 = tds[0].textContent;
            var attr2 = tds[1].getAttribute('data-type');
            var data2 = tds[1].textContent;
        } else {
            var attr2 = tds[0].getAttribute('data-type');
            var data2 = tds[0].textContent;
        }
        // console.log(data1 + data2);
        for (j = 1; j < tds.length; j++) {
            if (tds[j].getAttribute('data-type') === 'sales') {
                sales.push(Number(tds[j].textContent));
            }
        }
        obj[attr1] = data1;
        obj[attr2] = data2;
        obj.sale = sales;
        data.push(obj);
    }
    console.log(JSON.stringify(data));
    localStorage.setItem('report', JSON.stringify(data));
}

clearButton.onclick = function(){
    localStorage.removeItem('report');
}

