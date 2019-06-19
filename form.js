//创建按钮组对象
function CheckBoxs(wrapId, checkBoxs) {
    this.createCheckBoxs(wrapId, checkBoxs);
}

CheckBoxs.prototype.createCheckBoxs = function (wrapId, checkBoxs) {
    var wrap = document.getElementById(wrapId);
    this.wrap = wrap;
    // 创建checkbox组
    var selectAll = document.createElement('input');
    var span = document.createElement('span');
    selectAll.type = 'checkbox';
    selectAll.setAttribute('checkbox-type', 'all');
    this.selectAllButton = selectAll;
    span.textContent = '全选';
    wrap.appendChild(selectAll);
    wrap.appendChild(span);
    for (var i = 0; i < checkBoxs.length; i++) {
        var checkBox = document.createElement('input');
        var span = document.createElement('span');
        checkBox.type = 'checkbox';
        checkBox.value = checkBoxs[i].value;
        span.textContent = checkBoxs[i].text;
        wrap.appendChild(checkBox);
        wrap.appendChild(span);
    }
}

//按钮组的点击事件处理逻辑
CheckBoxs.prototype.bundleClickHandler = function (table, chart, bar) {
    var that = this;
    // 创建事件委托
    this.wrap.onclick = function (e) {
        var target = e.target;
        if (target.type !== 'checkbox') { return }
        var checkboxs = that.wrap.getElementsByTagName('input');
        var checkboxType = target.getAttribute('checkbox-type');

        if (checkboxType === 'all') {
            //全选按钮被点击
            for (var i = 0; i < checkboxs.length; i++) {
                checkboxs[i].checked = true;
            }

        } else {
            //其他按钮被点击
            let count = 0;
            checkboxs[0].checked = false;
            for (let i = 1; i < checkboxs.length; i++) {
                if (checkboxs[i].checked) {
                    count++;
                }
            }
            if (count === checkboxs.length - 1) {
                checkboxs[0].checked = true;
            }

            if (count === 0) {
                target.checked = true;
            }
        }
        //设置hash,记录用户操作
        // var allCheckBoxs = document.querySelectorAll('input');
        // var hashStr = [];
        // for (var i = 0; i < allCheckBoxs.length; i++) {
        //     if (allCheckBoxs[i].type === 'button') continue;
        //     if (allCheckBoxs[i].getAttribute('checkbox-type') !== 'all') {
        //         if (allCheckBoxs[i].checked) {
        //             hashStr.push('y');
        //         } else {
        //             hashStr.push('n');
        //         }
        //     }
        // }
        // hashStr = hashStr.join('');
        // location.hash = hashStr;


        table.setTableData(getData());
        chart.setData(getData());
        bar.setData(getData());
    }
    // var hashValue = location.hash;
    // hashValue = hashValue.slice(1);
    // if (hashValue) {
    //     var allCheckBoxs = document.querySelectorAll('input');
    //     var noAllCheckBoxs = [];
    //     for (var i = 0; i < allCheckBoxs.length; i++) {
    //         if (allCheckBoxs[i].type === 'button') continue;
    //         if (allCheckBoxs[i].getAttribute('checkbox-type') !== 'all') {
    //             noAllCheckBoxs.push(allCheckBoxs[i]);
    //         }
    //     }

    //     for(var i = 0; i < noAllCheckBoxs.length; i++){
    //         if(hashValue[i] === 'y'){
    //             noAllCheckBoxs[i].checked = true;
    //         }else{
    //             noAllCheckBoxs[i].checked = false;
    //         }
    //     }
    // }
    this.selectAllButton.click();
}

//获取表单选中的选项的数据
function getData() {
    var data = localStorage.getItem('report');
    if (data) {
        // console.log(data);
        var reportData = JSON.parse(data);
    } else {
        var reportData = sourceData;
    }
    var regionWrap = document.getElementById('region-checkbox-wrapper');
    var productWrap = document.getElementById('product-checkbox-wrapper');
    var regionCheckboxs = regionWrap.querySelectorAll('input');
    var productCheckboxs = productWrap.querySelectorAll('input');
    var regionArr = [];
    var productArr = [];
    var firstFilt = [];
    var secondFile = [];
    var result = [];
    //获取勾选的复选框的内容
    for (var i = 0; i < regionCheckboxs.length; i++) {
        if (regionCheckboxs[i].checked) {
            regionArr.push(regionCheckboxs[i].nextElementSibling.textContent);
        }
    }

    for (var i = 0; i < productCheckboxs.length; i++) {
        if (productCheckboxs[i].checked) {
            productArr.push(productCheckboxs[i].nextElementSibling.textContent);
        }
    }

    //每组至少选一个
    if (regionArr.length < 1 || productArr.length < 1) {
        return;
    }

    //筛选数据
    if (regionArr.length > 0) {
        for (var i = 0; i < regionArr.length; i++) {
            for (var j = 0; j < reportData.length; j++) {
                if (reportData[j]['region'] === regionArr[i]) {
                    firstFilt.push(reportData[j]);
                }
            }
        }
        result = firstFilt;
    }

    if (productArr.length > 0) {
        if (!result[0]) {
            result = reportData;
        }
        for (var i = 0; i < productArr.length; i++) {
            for (var j = 0; j < result.length; j++) {
                if (result[j]['product'] === productArr[i]) {
                    secondFile.push(result[j]);
                }
            }
        }
        result = secondFile;
    }
    return result;
}