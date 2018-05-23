
laydate({
    elem: '#chsDate', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
    event: 'focus', //响应事件。如果没有传入event，则按照默认的click
    format: 'YYYY-MM-DD',
    min: '2017-07-03', //设定最小日期为当前日期
    max: laydate.now(-7, 'YYYY-MM-DD'), //最大日期
    istime: false,
    istoday: false,
	isclear:false,
    choose: function(datas){
        model.startTime = datas;
    }
});
$('#chsDate').val(laydate.now(-7, 'YYYY-MM-DD'));
laydate.skin('danlan');

// 默认参数
var model = {
	allProjectID : [],
	allChannel : [],
	table : [],
	projectId : '',
	startTime : $('#chsDate').val(),
	channel : null,
	deviceType : null
};

function tableAction() {
	$.ajax({
		type : 'post',
		url : path + "/retention/table",
		data : {
			projectId : project_id,
			startTime : model.startTime,
			channel : model.channel,
			deviceType : model.deviceType
		},
		xhrFields : {
			withCredentials : true
		},
		crossDomain : true,
		success : function(data) {
            var datainfo='用户留存';
            data=getState(data,datainfo);

			model.table = data;
			tableManage();
            isVerification = false;
		}
	});
}
tableAction();

function tableManage() {
	var avg = model.table.avg;
	var table = model.table.table;

    //每次刷新完就及时清空
    $("#usersave tbody").empty();
    var head1 = $("#head1");
    head1.append("<td>新用户 " + avg.userNum + " 人</td>").append("<td></td>")
        .append("<td>" + zeroFormat(avg.avg_2) + "%</td>").append(
        "<td>" + zeroFormat(avg.avg_3) + "%</td>").append(
        "<td>" + zeroFormat(avg.avg_4) + "%</td>").append(
        "<td>" + zeroFormat(avg.avg_5) + "%</td>").append(
        "<td>" + zeroFormat(avg.avg_6) + "%</td>").append(
        "<td>" + zeroFormat(avg.avg_7) + "%</td>");

    var usersave = $("#usersave");

    $.each(table, function(index, item) {
        usersave.append("<tr id='line_" + index + "'></tr>");
        var line = $("#line_" + index);
        line.append("<td>" + dateFormat(item.createTime) + "</td>");
        for(var i=1;i<8;i++){
            var rate = item["rate_" + i];
            var device = item["deviceId_" + i];
            if(typeof rate === 'undefined' && typeof device === "undefined"){
                line.append("<td></td>");
            }else{
                line.append("<td class=\"usave\"><b>"+rate+"%</b><em>"+device+"</em></td>");
            }
        }

    });

}

function zeroFormat(val) {
	var index = val.indexOf('.');
	if (index == 0) {
		return '0' + val;
	}
	return val;
}

function dateFormat(val) {
	var arr = val.split("-");
	return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
}


$("#channel").click(function() {
     isVerification = true;
	var val = $("#channel").val();
	if (val == null || val == '') {
		model.channel = null;
	} else {
		model.channel = val;
	}
})

$("#projectid").change(function() {
    isVerification = true;
	project_id = $(this).val();
});

$('input:radio[name="device"]').change(function() {
     isVerification = true;
	var val = $("input:radio[name='device']:checked").val();
	if (val == null || val == '') {
		model.deviceType = null;
	} else {
		model.deviceType = val;
	}
});

document.getElementById('click').addEventListener('click', function () {
     isVerification = true;
	$("#head1 ~ tr").empty();
	$("#head1").empty();
	tableAction();
});

