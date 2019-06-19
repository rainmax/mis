// 路由模块负责指挥页面的其它部分，该以什么样的状态来呈现页面
// 表单模块负责承接用户的交互及告诉后面的模块如何组装数据，展示图表
// 数据处理模块，则根据用户的输入，对数据进行组合，提供给页面展现
// 表格模块负责用表格的形式展现数据
// 图表模块负责用图表的方式展现数据


//创建按钮组
var checkbox1 = new CheckBoxs('region-checkbox-wrapper', [{
    value: 1,
    text: '华北'
}, {
    value: 2,
    text: '华南'
}, {
    value: 3,
    text: '华东'
}]);
var checkbox2 = new CheckBoxs('product-checkbox-wrapper', [{
    value: 1,
    text: '手机'
}, {
    value: 2,
    text: '笔记本'
}, {
    value: 3,
    text: '智能音箱'
}]);

//创建表格对象与折线图对象
var table = new CreateTable();
var bar = new SvgBarGraph('graphicWrap', 650, 300);
var chart = new LineChart();

//传入表格、折线图和柱状图对象，实现按钮点击时各个模块实时渲染
checkbox1.bundleClickHandler(table, chart, bar);
checkbox2.bundleClickHandler(table, chart, bar);

//传入折线图和柱状图对象，实现鼠标指向表格上的不同数据时各个模块实时渲染
table.bundleMouseOverHandler(chart, bar);
table.bundleMouseLeaveHandler(chart, bar);

//初始化时显示全部数据
table.setTableData(getData());
chart.setData(getData());
bar.setData(getData());


