/*
	dragstart：要被拖拽的元素开始拖拽时触发，这个事件对象是被拖拽元素
	dragenter：拖拽元素进入目标元素时触发，这个事件对象是目标元素
	dragover：拖拽某元素在目标元素上移动时触发，这个事件对象是目标元素
	dragleave：拖拽某元素离开目标元素时触发，这个事件对象是目标元素
	dragend：在drop之后触发，就是拖拽完毕时触发，这个事件对象是被拖拽元素
	drop：将被拖拽元素放在目标元素内时触发，这个事件对象是目标元素
	完成一次成功页面内元素拖拽的行为事件过程应该是： dragstart –> dragenter –> dragover –> drop –> dragend
*/
//拖拽文件功能演示
function DragAndDrop(node){
	this.node=node;
	this.init();
}

DragAndDrop.prototype={
	init:function(){
		this.enter();
		this.over();
		this.leave();
	},
	enter:function(){
		var self=this;
		this.node.addEventListener("dragenter",function(e){
			removeDefault(e);
			$(self.node).css("background-color","#999");
		},false);
	},
	over:function(){
		var self=this;
		this.node.addEventListener("dragover",function(e){
			removeDefault(e);
			//$(self.node).css("background-color","#666");
		},false)
	},
	imgFileDrop:function(){
		var self=this;
		this.node.addEventListener("drop",function(e){
			removeDefault(e);
			var fileList=e.dataTransfer.files;
			if(fileList.length===0||fileList[0].type.indexOf('image')===-1){return;};
			var reader=new FileReader();
			var x=e.pageX;
			var y=e.pageY;
			reader.onload=function(e){
				var src=this.result;
				imgHtml='<div class="mod_drag_img animation"><img src='+src+' /></div>';
				$(self.node).html(imgHtml);
				$(self.node).removeAttr("style");
				$(self.node).children().eq(0).css({
				    "left":x-$(".canvas").offset().left,
					"top":y-$(".canvas").offset().top
				});
				updateDataTransfer();
			}
			reader.readAsDataURL(fileList[0]);
		},false)
		
	},
	htmlDrop:function(){
		var self=this;
		this.node.addEventListener("drop",function(e){
			var _html ='<div class="item" id=Layer'+e.dataTransfer.getData('id')+'>'+e.dataTransfer.getData('_html')+'</div>';
			$(self.node).append(_html);
			$(self.node).removeAttr("style");
		},false);
	},
	leave:function(){
		var self=this;
		this.node.addEventListener("dragleave",function(e){
			removeDefault(e);
			$(self.node).removeAttr("style");
		},false)  
	}
}

//清除默认事件
function removeDefault(m){
	m.stopPropagation();
	m.preventDefault();
}
var dragItems;
//updateDataTransfer();
function updateDataTransfer(){
	dragItems = document.querySelectorAll('[draggable=true]');
	for (var i = 0; i < dragItems.length; i++){
		dragItems[i].addEventListener('dragstart', function(e){
			e.dataTransfer.setData('_html',this.innerHTML);
			e.dataTransfer.setData('id',i);
		},false);
	}
}
