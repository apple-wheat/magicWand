/**
 * Created by Administrator on 2017/7/21.
 */

// //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
// var curWwwPath=window.document.location.href;
// //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
// var pathName=window.document.location.pathname;
// var pos=curWwwPath.indexOf(pathName);
// //获取主机地址，如： http://localhost:8083
// var localhostPaht=curWwwPath.substring(0,pos);
// //获取带"/"的项目名，如：/uimcardprj
// var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
//
// var url=localhostPaht+projectName;
//


// 上线路径有空格导致路径跳转不对，http和https
 var pathLogin = "https://san.511860.com/magic_dataview/overview/allProjectID";
 var path="https://san.511860.com/magic_dataview";

// 登录成功后跳转的页面路径
 var paths="https://san.511860.com/magicWand";
// 登录失效后强制用户重新登录的页面
 var loginUrl = "https://san.511860.com/magicWand/login.html";

//    测试
// var pathLogin = "http://172.16.82.45:8080/overview/allProjectID";
// var path="http://172.16.82.45:8080";
// var loginUrl = "http://localhost:63342/BONC/magicWand/login.html";
// var paths="http://localhost:63342/BONC/magicWand";


//本机测试
// var loginUrl = "D:\\Developer\\XAMPP\\htdocs\\BONC\\magicWand_Menu/login.html";
// var paths="D:\\Developer\\XAMPP\\htdocs\\BONC\\magicWand_Menu";