// JavaScript Document
$(function(){
    //判断是否是Chrome浏览器
  var isChrome=navigator.userAgent.toLowerCase().match(/chrome/) != null;
  var cookies={
      //获取cookie
    getCookie:function(name){
        var cookieName=encodeURIComponent(name)+"=",
          cookieStart=document.cookie.indexOf(cookieName),
        cookieValue=null;
      if(cookieStart>-1){
          var cookieEnd=document.cookie.indexOf(";",cookieStart);
        if(cookieEnd==-1){
            cookieEnd=document.cookie.length;
        }
        cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
        if(cookieValue!="undefined"){
            return cookieValue;
        }
      }
    },
    //设置cookie
    setCookie:function(name,value,expires,path,domain,secure){
        var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
      if(expires instanceof Date){
          cookieText+="; expires="+expires.toGMTString();
      }
      if(path){
          cookieText+="; path="+path;
      }
      if(domain){
          cookieText+="; domain="+domain;
      }
      if(secure){
          cookieText+="; secure="+secure;
      }
      document.cookie=cookieText;
    },
    //删除cookie
    delCookie:function(name,path,domain,secure){
        this.setCookie(name,"",newDate(0),path,domain,secure);
    }
  }
  if($.browser.msie){
        
    var name=cookies.getCookie("chrome");
    if(!name){
        $("#mask").show();
        $("#pop2").show();
      cookies.setCookie("chrome","no");
    }
  }
  $("#close_chrome").click(function(){
      $("#mask").hide();
    $("#pop2").hide();
    return false;
  });
});