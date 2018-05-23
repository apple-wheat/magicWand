var startTime = "2017-07-10";
var endTime = "2017-07-24";
var project_id='';

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
$('#startTime').val(laydate.now(-8, 'YYYY-MM-DD'));

var end ={
    elem: '#endTime',
    event: 'focus',
    format: 'YYYY-MM-DD',
    min: '2017-06-29',
    max: laydate.now(-1, 'YYYY-MM-DD'),
    istime: false,
    isclear:false,
    istoday: false,
    choose: function(datas){
        start.max = datas;
        endTime = datas;
        date = datas;
    }
};
laydate(start);
laydate(end);


$('#endTime').val(laydate.now(-1, 'YYYY-MM-DD'));
laydate.skin('danlan');

startTime = $('#startTime').val();
endTime = $('#endTime').val();
date = $('#endTime').val();