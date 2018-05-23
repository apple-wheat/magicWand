//设置最后一天为今日，与common.js冲突
var start = {
    elem: '#startTime',
    event: 'focus',
    format: 'YYYY-MM-DD',
    min: '2017-06-29',
    max: laydate.now(-1, 'YYYY-MM-DD'),
    istime: false,
    isclear:false,
    istoday: false,
    choose: function(datas){
        end.min = datas;
        end.start = datas;
        startTime = datas;
    }
};
$('#startTime').val(laydate.now(-7, 'YYYY-MM-DD'));

var end ={
    elem: '#endTime',
    event: 'focus',
    format: 'YYYY-MM-DD',
    min: '2017-06-29',
    max: laydate.now(0, 'YYYY-MM-DD'),
    istime: false,
    isclear:false,
    istoday: false,
    choose: function(datas){
        start.max = datas;
        endTime = datas;
    }
};
laydate(start);
laydate(end);

$('#endTime').val(laydate.now(0, 'YYYY-MM-DD'));
laydate.skin('danlan');

startTime = $('#startTime').val();
endTime = $('#endTime').val();