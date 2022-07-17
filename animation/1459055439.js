// JavaScript Document
$(function(){
	Tool.init();
	Tool.scrollBarInit($(".scroll_bar"));
	Tool.runTransform();
	Tool.setTransformOrigin();
	Tool.modeRadio();
	Tool.matrix();
	Tool.viewTransform();
	Tool.copyCode();
	//Tool.copyCode($("#copy_ani"),$("#show_ani_code").find(".inner"));
	Tool.fransitionTimingFunction();
	Tool.Tab();
	Tool.animateDemo();
	Tool.resteTransform();
	Tool.resetAnimation();
	Tool.cubic();
	new Tool.Animation();
	var File=new DragAndDrop($(".canvas").eq(0)[0]);
	File.imgFileDrop();
});