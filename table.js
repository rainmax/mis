/*******************表格模块**********************/


//表格构造函数
function CreateTable(data) {
    this.table = document.createElement('table');
    this.bundleClick();
    this.setTableData(data);
    this.hasClick = false;
}

/**
 * 设置表格的显示内容
 * @param {Array}data 筛选后给表格显示的数据
 */
CreateTable.prototype.setTableData = function (data) {
    if (!data) {
        return;
    }
    var tableHead1 = ['商品', '地区', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var tableHead2 = ['地区', '商品', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var tableWrap = document.getElementById('table-wrapper');
    var tr = document.createElement('tr');
    tableWrap.innerHTML = '';
    this.table.innerHTML = '';
    var regionArr = [];
    var productArr = [];
    regionArr.push(data[0]['region']);
    productArr.push(data[0]['product']);

    for (var i = 0; i < data.length; i++) {
        if (regionArr.join('').indexOf(data[i]['region']) < 0) {
            regionArr.push(data[i]['region']);
        }
    }

    for (var i = 0; i < data.length; i++) {
        if (productArr.join('').indexOf(data[i]['product']) < 0) {
            productArr.push(data[i]['product']);
        }
    }

    var regionNum = regionArr.length;
    var productNum = productArr.length;

    //商品选项多于地区选项，且地区只被选择一项，则地区排第一列
    if (regionNum === 1 && productNum > 1) {
        //设置表头
        for (var i = 0; i < tableHead2.length; i++) {
            var th = document.createElement('th');
            th.textContent = tableHead2[i];
            tr.appendChild(th);
        }
        this.table.appendChild(tr);

        //设置表内容
        for (var i = 0; i < data.length; i++) {
            tr = document.createElement('tr');
            for (const index in data[i]) {
                const element = data[i][index];
                if (element instanceof Array) {
                    //如果是数组，则为销量数据
                    for (var j = 0; j < element.length; j++) {
                        var td = document.createElement('td');
                        td.textContent = element[j];
                        td.setAttribute('data-type', 'sales');
                        tr.appendChild(td);
                    }
                } else {
                    //地区名或商品名
                    var td = document.createElement('td');
                    td.textContent = element;
                    td.setAttribute('data-type', index);
                    tr.appendChild(td);
                }
            }
            tr.insertBefore(tr.childNodes[1], tr.childNodes[0]);
            this.table.appendChild(tr);
        }
        tableWrap.appendChild(this.table);

    } else {
        for (var i = 0; i < tableHead1.length; i++) {
            var th = document.createElement('th');
            th.textContent = tableHead1[i];
            tr.appendChild(th);
        }
        this.table.appendChild(tr);

        for (var i = 0; i < data.length; i++) {
            tr = document.createElement('tr');
            for (const index in data[i]) {
                const element = data[i][index];
                if (element instanceof Array) {
                    for (var j = 0; j < element.length; j++) {
                        var td = document.createElement('td');
                        td.textContent = element[j];
                        td.setAttribute('data-type', 'sales');
                        tr.appendChild(td);
                    }
                } else {
                    var td = document.createElement('td');
                    td.textContent = element;
                    td.setAttribute('data-type', index);
                    tr.appendChild(td);
                }
            }
            this.table.appendChild(tr);
        }

        tableWrap.appendChild(this.table);
    }

    //跨行合并相同项
    var rows = this.table.querySelectorAll('tr');
    var tempText = rows[1].firstChild.textContent;
    var count = 0;
    for (var i = 2; i < rows.length; i++) {
        if (tempText === rows[i].firstChild.textContent) {
            rows[i].removeChild(rows[i].firstChild);
            count++;
        } else {
            rows[i - count - 1].firstChild.setAttribute('rowspan', count + 1);
            tempText = rows[i].firstChild.textContent;
            count = 0;
        }

        if (i === rows.length - 1) {
            rows[i - count].firstChild.setAttribute('rowspan', count + 1);
            count = 0;
        }
    }
}



//鼠标指向表格中的销量时，获取销量数据并在传入的折线图和柱状图对象上渲染显示
CreateTable.prototype.bundleMouseOverHandler = function (chart, bar) {
    var that = this;
    this.table.onmouseover = function (e) {
        if(that.hasClick){
            return;
        }
        var target = e.target;
        if (target.tagName !== 'TD') return;
        /**@type {HTMLTableDataCellElement} */
        var parent = target.parentNode;
        var data = [];
        var obj = {};
        var arr = [];
        var flag = false;

        //添加图标
        if(target.getAttribute('data-type') === 'sales'){
            target.innerHTML = target.textContent + '<img src="./img/pencil.jpg" alt="" class="pencil" />';
            target.onmouseleave = function(){
                if(that.hasClick){
                    return;
                }
                target.innerHTML = target.textContent;
            }
        }
        
        //遍历到该组数据的第一行
        while (parent.childNodes[1].getAttribute('data-type') === 'sales') {
            parent = parent.previousElementSibling;
            flag = true;
        }

        var attr1 = parent.childNodes[0].getAttribute('data-type');
        obj[attr1] = parent.childNodes[0].textContent;

        
        if (flag) {
            parent = target.parentNode;
            var attr2 = parent.childNodes[0].getAttribute('data-type');
            obj[attr2] = parent.childNodes[0].textContent;
            flag = false;
        } else {
            var attr2 = parent.childNodes[1].getAttribute('data-type');
            obj[attr2] = parent.childNodes[1].textContent;
            parent = target.parentNode;
        }



        for (var i = 0; i < parent.childNodes.length; i++) {
            if (Number(parent.childNodes[i].textContent)) {
                data.push(Number(parent.childNodes[i].textContent));
            }
            obj.sale = data;
            arr[0] = obj;
            chart.setData(arr);
            bar.setData(arr);
        }
    }
}

//鼠标离开表格时，渲染表格中的所有销量数据
CreateTable.prototype.bundleMouseLeaveHandler = function (chart, bar) {
    var that = this;
    this.table.onmouseleave = function () {
        if(that.hasClick){
            return;
        }
        chart.setData(getData());
        bar.setData(getData());
    }
}

//鼠标点击单元格事件
CreateTable.prototype.bundleClick = function(){
    var that = this;
    this.table.onclick = function(e){
        that.hasClick = true;
        var target = e.target;
        var lastValue = target.textContent;

        //如果点击的是单元格，则为该单元格创建一个输入框
        if (target.tagName !== 'TD') return;
        if(target.getAttribute('data-type') === 'sales'){
            /**@type {HTMLInputElement} */
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.value = target.textContent;
            target.innerHTML = '';
            target.appendChild(input);
            input.focus();

            //创建取消和确定按钮
            var cancelButton = document.createElement('input');
            cancelButton.setAttribute('type', 'button');
            cancelButton.value = '取消';
            var enterButton = document.createElement('input');
            enterButton.setAttribute('type', 'button');
            enterButton.value = '确定';
            enterButton.style.marginTop = '5px';

            var div = document.createElement('div');
            div.appendChild(cancelButton);
            div.appendChild(enterButton);
            div.className = 'button';
            div.style.left = target.offsetLeft + target.clientWidth + 'px';
            div.style.top = target.offsetTop + target.offsetParent.offsetTop + 'px';
            document.body.appendChild(div);

            enterButton.onclick = function(){
                var value = input.value;
                if(!Number(value)){
                    alert('非法输入！');
                    input.focus();
                }else{
                    target.textContent = value;
                    document.body.removeChild(div);
                }
            }

            cancelButton.onclick = function(){
                document.body.removeChild(div);
            }

            //输入框失去焦点事件
            input.onblur = function(){
                that.hasClick = false;
                target.textContent = lastValue;
                document.body.removeChild(div);
            }

            
        }


    }
}
