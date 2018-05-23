var showAlert=true;
var isVerification=false;


// 获取当前页面的名称；
// var strUrl=location.href;
// var arrUrl=strUrl.split("/");
// var strHref=arrUrl[arrUrl.length-1];
//
// console.log(strHref);

// if(strHref!='index.html'){
//     pageChange(strHref);
// }

//检测用户访问权限
// function pageChange(strHref){
//     $.ajax({
//         type:'post',
//         url:path+"/author/checkMenu",
//         data:{url:strHref},
//         xhrFields: {
//             withCredentials: true
//         },
//         crossDomain: true,
//         success:function(data){
//             console.log(data);
//             if(data.state == 0) {
//
//             }else{
//                 alert("无权限，请重新登录");
//                 window.parent.location.href=loginUrl;
//                 return;
//             }
//         }
//     });
// }


//数据状态判断
function getState(data,datainfo) {
    if(data.state == 0) {
        if(typeof data.data === 'string'){
            data = JSON.parse(data.data);
        }else{
            data = data.data;
        }
        return data;
    }else if(data.state == 1){
        if(showAlert) {
            alert(datainfo+"数据请求失败!");
            return;
        }
    }else{
        if(isVerification){
            if(showAlert){
                showAlert=false;
                alert("请重新登录");
                //这句超级帅气不会使得sesion过期之后login.html嵌入到iframe中
                // window.location.href=loginUrl;
                window.parent.location.href=loginUrl;
                return;
            }
        }
    }
}
