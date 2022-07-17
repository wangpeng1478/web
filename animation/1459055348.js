// 拖动插件
(function($){
	//插件核心
	$.fn.extend({
		dnd:function(options){
	    // 插件的默认参数  
		  var defaults={
			  "range":$(document),//可拖动的范围
			  "pos":"xy",//拖动方向
			  "onChange":function(){}//回调函数
		  };
		  //合并传入的参数和默认参数
		  var opts=$.extend({},defaults,options);
		  return this.each(function(){
		      var $this=$(this);
			  var x,y;  
			  var lock=0;//是否可拖动  
		      var o=$.meta?$.extend({},opts,$this.data()):opts;
			  var $handle;
			  o.handle?$handle=o.handle:$handle=$this;
			 // var o=opts;
			  var dndFn={
			      //设置范围
				  setRange:function(){
					  var rangePosition={
					          minLeft:0,
							  minTop:0,
							  maxLeft:$(document).width(),
							  maxTop:$(document).height()
						  };
					  if(o.range.offset()){
						  var rangeOffset=o.range.offset();
						  rangePosition={
							  minLeft:rangeOffset.left,
							  minTop:rangeOffset.top,
							  maxLeft:o.range.width()+rangeOffset.left,
							  maxTop:o.range.height()+rangeOffset.top
						  }
					  }
					  return rangePosition;
				  },
				  //获取位置
				  getPosition:function(ex,ey){
					  var c=this.setRange();
					  var offsetLeft,offsetTop;
					  
					  if(o.range.offset()){
						  offsetLeft=o.range.offset().left;
						  offsetTop=o.range.offset().top;
					  }else{
						  offsetLeft=0;
						  offsetTop=0;
					  }
					  var m=ex-x,n=ey-y;
					  m=Math.max(m,c.minLeft);
					  m=Math.min(m,c.maxLeft-$this.outerWidth(true));
					  n=Math.max(n,c.minTop);
					  n=Math.min(n,c.maxTop-$this.outerHeight(true));
					  var pos={
						  "x":m-offsetLeft,
						  "y":n-offsetTop
					  }
					  return pos;
				  },
				  //设置位置
				  setPosition:function(left,top){
					  //判断是否锁定X轴或者Y轴
					  if(o.pos=="xy"){
						  $this.css({"left":left,"top":top});//X轴，Y轴都不锁定
					  }else if(o.pos=="x"){
						  $this.css({"top":top});//锁定了X轴
					  }else if(o.pos=="y"){
						  $this.css({"left":left});//锁定了Y轴
					  }					  
				  }
			  };
			  $handle.bind("mousedown",function(e){
				  lock=1;
				  //$this=$(e.target);
				  var offset=$this.offset();
				  //获取鼠标相对于拖动层右上角的距离
				  x=e.pageX-offset.left;
				  y=e.pageY-offset.top;
				  e.stopPropagation();
			  });
			  $(document).bind("mousemove",function(e){
				  if(lock){
				      var position=dndFn.getPosition(e.pageX,e.pageY);
					  if(position.x>5||position.x<5){
						  dndFn.setPosition(position.x,position.y);
						  o.onChange($handle,position.x,position.y,$this,e);
					  }
					  clear();
			      }
			  });
			  $(document).bind("mouseup",function(e){
				  lock=0;
			  });
		  });
		  //私有函数
		  function clear(){
		      //清除文本选中状态
              if(document.selection&&document.selection.empty){
			      document.selection.empty();//IE
			  }else if(window.getSelection){
				  window.getSelection().removeAllRanges();
			  }
		  };
		  //暴露到外部的函数
		  $.fn.drag.forUser=function(txt){
			  return "<strong>"+txt+"</strong>";
		  };
		  return this;//返回对象，以便链式调用
	    }
	});
})(jQuery);