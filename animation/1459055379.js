var Tool = {
	//初始化拖动原点，针对变形演示
	scrollBarInit: function(node) {
		node.each(function() {
			$(this).css("left", ($(this).parent().width() - 18) / 2);
		});
	},
	initArgs: {
		csstxt: [],
		animationNode: $(".canvas").children().eq(0)
	},
	init: function() {
		/*$("#animation").dnd({
			  "range":$(".canvas"),
			  "pos":"xy"
		});*/
		var self = this;
		var height = $(".mod_side").height();
		this.canvasHeight(height);
		$(window).resize(function(e) {
			var _height = $(".mod_side").height();
			self.canvasHeight(_height);
		});

		this.inputBlur();
		$("#close_pop").click(function() {
			$("#show_ani_code").hide();
			$(".pop_mask").hide();
			return false;
		});

	},
	canvasHeight: function(h) {
		var canvasHeight = $(".canvas").height();
		var sideHeight = h;
		var documentHeight = $(document).height();
		if(documentHeight < 684) {
			$(".canvas").css("height", sideHeight);

		} else {
			$(".canvas").css("height", "", "bottom", 0);
		};
		if(documentHeight > 684 && documentHeight < h) {
			$(".canvas").css("height", sideHeight);
		}
	},
	inputBlur: function() {
		var self = this;
		$(".mod_fn .mod_input").bind("blur", function(e) {
			var obj = $(this).parent().next().children(".scroll_bar");
			var units = obj.attr("units");
			var maxValue = parseInt(obj.attr("maxVal"));
			var minValue = parseInt(obj.attr("minVal"));
			var fn = $(this).attr("id");
			var index = $(this).parent().parent().index();
			var value = parseInt($(this).val());
			var star = (obj.parent().width() - obj.width()) / 2;
			var bl = maxValue / star;
			if(value || value == 0) {
				if(value > maxValue) {
					alert("最大值不能超过：" + maxValue);
					return;
				};
				if(value < minValue) {
					alert("最小值不能小于：" + minValue);
					return;
				}
				if(value <= maxValue && value >= minValue) {
					self.initArgs.csstxt[index] = fn + "(" + value + units + ")";
					var css_transform = "";
					for(var i = 0; i < self.initArgs.csstxt.length; i++) {
						if(self.initArgs.csstxt[i]) {
							css_transform += self.initArgs.csstxt[i] + "";
						}
					}
					self.initArgs.animationNode.css({
						"-webkit-transform": css_transform,
						"-moz-transform": css_transform
					});

					if(value < 0) {
						var x = star + parseInt(value / bl);
						obj.css("left", x);
					} else if(value > 0) {
						var x = star + parseInt(value / bl);
						obj.css("left", x);
					} else {
						obj.css("left", star);
					}
				}
			};
			self.showCode();
			//console.info(units,maxValue,minValue,fn,index);
		});
		$("#transition-duration").bind("blur", function() {
			self.showCode();
		});
		$("#transition-delay").bind("blur", function() {
			self.showCode();
		});
		$("#mod_tran_ease span").bind("click", function() {
			self.showCode();
		});
	},
	aniPos: function() {
		var canvasWidth = $(".canvas").width();
		var canvasHeight = $(".canvas").height();
		$(".canvas").children().eq(0).css({
			"left": (canvasWidth - 301) / 2,
			"top": (canvasHeight - 301) / 2
		});
	},
	//设置变形函数的值
	setTransform: function(args) {
		/*
      aimLayer:要改变的动画层
      txtInput:输入框内容
      minVal:最大值
      maxVal:最小值
      currentPos:当前位置
    */
		var aimLayer = args.aimLayer,
			txtInput = args.txtInput,
			currentPos = args.currentPos,
			minVal = args.minVal,
			maxVal = args.maxVal,
			fn = args.fn,
			units = args.units,
			star = args.star,
			arrIndex = args.arrIndex;
		var bl = maxVal / star;
		if(currentPos < star) {
			if(fn != "scaleY" && fn != "scaleX") {
				this.initArgs.csstxt[arrIndex] = fn + "(" + -(-minVal + parseInt(-currentPos * bl)) + units + ")";
				txtInput.val(-(-minVal + parseInt(-currentPos * bl)));
			} else {
				this.initArgs.csstxt[arrIndex] = fn + "(" + -(-minVal + (-currentPos * bl)).toFixed(1) + units + ")";
				txtInput.val(-(-minVal + (-currentPos * bl)).toFixed(1));
			}
		} else {
			if(fn != "scaleY" && fn != "scaleX") {
				this.initArgs.csstxt[arrIndex] = fn + "(" + parseInt((currentPos - star) * bl) + units + ")";
				txtInput.val(parseInt((currentPos - star) * bl));
			} else {
				this.initArgs.csstxt[arrIndex] = fn + "(" + ((currentPos - star) * bl).toFixed(1) + units + ")";
				txtInput.val(((currentPos - star) * bl).toFixed(1));
			}
		}
		var css_transform = "";
		for(var i = 0; i < this.initArgs.csstxt.length; i++) {
			if(this.initArgs.csstxt[i]) {
				css_transform += this.initArgs.csstxt[i] + "";
			}
		}
		aimLayer.css({
			"-webkit-transform": css_transform,
			"-moz-transform": css_transform
		});
	},
	//运行变形函数
	runTransform: function() {
		var self = this;
		$(".scroll_bar").dnd({
			"range": $(".scroll_box").eq(5),
			//可拖动的范围
			"pos": "y",
			//锁定方向
			"onChange": function(obj, x, y, e) { //拖动时的回调函数
				var star = (obj.parent().width() - obj.width()) / 2;
				var arrIndex = obj.parent().parent("li").index();
				self.setTransform({
					aimLayer: $(".canvas").children("div").eq(0),
					txtInput: obj.parent().prev().find("input"),
					currentPos: x,
					//当前位置
					minVal: obj.attr("minVal"),
					//最小值
					maxVal: obj.attr("maxVal"),
					//最大值
					fn: obj.attr("fn"),
					//对应的变形函数
					units: obj.attr("units"),
					//单位
					star: star,
					arrIndex: arrIndex
				});
				self.showCode();
				$("body>style").empty();
			}
		});
	},
	//设置变形原点
	setTransformOrigin: function() {
		var self = this;
		$("#origin").dnd({
			"range": $("#animation"),
			"pos": "xy",
			"onChange": function(obj) {
				var origin = obj.position();
				var originLeft = parseInt((parseInt(origin.left) + obj.width() / 2) / 3) + "%";
				var originTop = parseInt((parseInt(origin.top) + obj.height() / 2) / 3) + "%";
				//设置变形原点
				$(".canvas").children("div").eq(0).css({
					"-webkit-transform-origin": originLeft + " " + originTop
				});
				$("#transform-origin-1").val(originLeft);
				$("#transform-origin-2").val(originTop);
			}
		});
		$("#transform-origin-1").bind("blur", function() {
			var originLeft = $("#transform-origin-1").val();
			var originTop = $("#transform-origin-2").val();
			var left = parseInt(parseInt(originLeft) / 100 * 300);
			$("#origin").css("left", left);
			$(".canvas").children("div").eq(0).css({
				"-webkit-transform-origin": originLeft + " " + originTop
			});
			$("#animation").css({
				"-webkit-transform-origin": originLeft + " " + originTop,
				"-moz-transform-origin": originLeft + " " + originTop
			});
			self.showCode();
		});
		$("#transform-origin-2").bind("blur", function() {
			var originLeft = $("#transform-origin-1").val();
			var originTop = $("#transform-origin-2").val();
			var top = parseInt(parseInt(originTop) / 100 * 300);
			$("#origin").css("top", top);
			$(".canvas").children("div").eq(0).css({
				"-webkit-transform-origin": originLeft + " " + originTop
			});
			$("#animation").css({
				"-webkit-transform-origin": originLeft + " " + originTop,
				"-moz-transform-origin": originLeft + " " + originTop
			});
			self.showCode();
		});
	},
	//判断2D或者3D变形
	modeRadio: function() {
		var self = this;
		$(".icon_radio").click(function() {
			var left = self.initArgs.animationNode.css("left");
			var top = self.initArgs.animationNode.css("top");
			if($(this).attr("id") == "3d") {
				$(".mode_3d").show();
				$(".mode_2d").hide();
				// self.initArgs.animationNode.removeAttr("style").css({"left":left,"top":top});
				self.initArgs.csstxt = [];
				$("#origin").hide();
			} else {
				$(".mode_2d").show();
				$(".mode_3d").hide();
				// self.initArgs.animationNode.removeAttr("style").css({"left":left,"top":top});
				self.initArgs.csstxt = [];
				$("#origin").show();
			}
			$(this).addClass("checked").siblings().removeClass("checked");
			self.scrollBarInit($(".scroll_bar"));
			$(".mod_fn .mod_input ").val("");
		});
	},
	//矩阵变形
	matrix: function() {
		var fn = [1, 0, 0, 1, 1, 0],
			matrix;
		var self = this;
		$("#matrix .matrix").blur(function() {
			fn[$(this).parent().index()] = $(this).val();
			martix = "matrix(" + fn.toString() + ")";
			self.initArgs.animationNode.css({
				"-webkit-transform": martix,
				"-moz-transform": martix
			});
			//实时显示变形代码
			self.showCode();
		});
	},
	//显示代码
	showCode: function() {
		var code = '<p>.animation{</p>\
            <p style="padding-left:2em;">',
			style = $(".canvas").children().eq(0).attr("style");
		if(style) {
			var arr = style.split(";");
			for(var i = 0; i < arr.length - 1; i++) {
				code += arr[i] + ";<br />";
			}
			code += "</p>";
		}
		code += "<p>}</p>";
		fn = $("#mod_tran_ease").find("span.checked").attr("value");
		var done = '';
		done += "-webkit-transition-property:" + $("#transition-property").val() + ";<br />";
		done += "-webkit-transition-duration:" + $("#transition-duration").val() + ";<br />";
		done += "-webkit-transition-delay:" + $("#transition-delay").val() + ";<br />";
		done += "-webkit-transition-timing-function:" + fn + ";<br />";
		//firefox
		if($.browser.mozilla) {
			done = done.replace(/webkit/g, 'moz');
		}
		doneHtml = '<p>.done{</p>\
            <p style="padding-left:2em;">';
		doneHtml += done;
		doneHtml += "</p>";
		doneHtml += "<p>}</p>";
		$("#show_code").html(code + doneHtml);
		if($("#show_code").hasClass("hidden")) {
			$("#show_code").removeClass("hidden");
		};
		var height = $(".mod_side").height();
		this.canvasHeight(height);
	},
	//设置过渡属性的初始值
	getTransition: function() {
		var css_transition = [];
		$(".transition_box :input").each(function(index, element) {
			switch($(this)[0].id) {
			case "transition-property":
				if($(this).val()) {
					css_transition[index] = $(this).val();
				} else {
					css_transition[index] = "all";
				}
				break;
			case "transition-duration":
				if($(this).val()) {
					css_transition[index] = $(this).val() + "s";
				} else {
					css_transition[index] = "0.5s";
				}
				break;
			case "transition-delay":
				if($(this).val()) {
					css_transition[index] = $(this).val() + "s";
				} else {
					css_transition[index] = "0" + "s";
				}
				break;
			case "transition-timing-function":
				css_transition[index] = $(this).val();
				break;
			}
		});
		css_transition[3] = $("#mod_tran_ease .checked").attr("value");
		return css_transition;
	},
	//变形动画预览
	viewTransform: function() {
		var timeoutId;
		var self = this;
		$("#view_transform").click(function() {
			var node = $(".canvas").children().eq(0);
			var css_transform = node.attr("style");
			var ct = self.setTransition(self.getTransition());
			var origin = $("#transform-origin-1").val() + " " + $("#transform-origin-2").val();
			var left = node.css("left");
			var top = node.css("top");
			node.removeAttr("style");
			$("body > style").text(".run{" + css_transform + "-webkit-transition:" + ct + ";-webkit-transform-origin:" + origin + ";-moz-transition:" + ct + ";-moz-transform-origin:" + origin + ";}");
			$("#show_code").find("div").html("<p style=\"text-indent:2em\">-webkit-transition:" + ct + ";</p><p style=\"text-indent:2em\">-webkit-transform-origin:" + origin + ";</p>");
			node.removeClass("run");
			clearTimeout(timeoutId);
			timeoutId = setTimeout(function() {
				node.addClass("run");
				setTimeout(function() {
					node.attr("style", css_transform);
				}, parseFloat(($("#transition-delay").val() + $("#transition-duration").val()) * 1000));
			}, 500);
		});
	},
	setTransition: function(transition_value) {
		var ct = "";
		for(var i = 0; i < transition_value.length; i++) {
			ct += transition_value[i] + " ";
		}
		this.initArgs.animationNode.css({
			"-webkit-transform": "" //这个状态必须清空
		});
		return ct;
	},
	//复制代码
	copyCode: function() {
		$(".c_flash").live("mouseout", function() {
			$(this).show().hide();
		});
		(function() {
			var clip = null;
			var self = this;
			var timeout;
			clip = new ZeroClipboard.Client();
			clip.setHandCursor(true);
			$("#copy_transform").mouseover(function() {
				$(".c_flash").show();
				var txt = $("#show_code").text();
				clip.setText(txt);
				if(clip.div) {
					clip.receiveEvent('mouseout', null);
					clip.reposition(this);
				} else {
					clip.glue(this);
				}
				clip.addEventListener('mouseOver', function(client) {
					clip.setText($("#show_code").text());
				});
				clip.receiveEvent('mouseover', null);
			});

			clip.addEventListener('complete', function(client, text) {
				clearTimeout(timeout);
				$("#js_gui_suc").removeClass("hidden");
				timeout = setTimeout(function() {
					$("#js_gui_suc").addClass("hidden");
				}, 1000)
			});
		})();
		(function() {
			var clip = null;
			var self = this;
			var timeout;
			clip = new ZeroClipboard.Client();
			clip.setHandCursor(true);
			$("#copy_ani").mouseover(function() {
				$(".c_flash").show();
				var txt = $("#show_ani_code").find(".inner").text();
				clip.setText(txt);
				if(clip.div) {
					clip.receiveEvent('mouseout', null);
					clip.reposition(this);
				} else {
					clip.glue(this);
				}
				clip.addEventListener('mouseOver', function(client) {
					clip.setText($("#show_ani_code").find(".inner").text());
				});
				clip.receiveEvent('mouseover', null);
			});

			clip.addEventListener('complete', function(client, text) {
				clearTimeout(timeout);
				$("#js_gui_suc").removeClass("hidden");
				timeout = setTimeout(function() {
					$("#js_gui_suc").addClass("hidden");
				}, 1000);
			});
		})();
	},
	//设置变形函数
	fransitionTimingFunction: function() {
		$(".ease_list .button").click(function() {
			$(this).addClass("checked").siblings().removeClass("checked");
		});
	},
	//重置变形样式
	resteTransform: function() {
		var self = this;
		$("#reset_transfrom").click(function() {
			self.scrollBarInit($(".scroll_bar"));
			$(".mod_fn .mod_input ").val("");
			self.initArgs.animationNode.removeClass("run").removeAttr("style");
			self.initArgs.csstxt = [];
			$("#show_code").html("").addClass("hidden");
			$(".matrix").eq(0).val(1);
			$(".matrix").eq(1).val(0);
			$(".matrix").eq(2).val(0);
			$(".matrix").eq(3).val(1);
			$(".matrix").eq(4).val(0);
			$(".matrix").eq(5).val(0);
			$("#transform-origin-1").val("50%");
			$("#transform-origin-2").val("50%");
			$("body style").html("");
			$("#origin").removeAttr("style");
			//self.aniPos();
		})
	},
	//选项卡切换
	Tab: function() {
		var self = this;
		$("#tab_nav li").click(function() {
			if(!$(this).hasClass("current")) {
				$(this).addClass("current").siblings().removeClass("current");
				$(".item").hide().eq($(this).index()).show(0, function() {
					var height = $(".mod_side").height();
					self.canvasHeight(height);
				});
				if($(this).index() == 1) {
					$("#ani").removeClass("hidden");
				} else {
					$("#ani").addClass("hidden");
				}
				if($(this).index() != 0) {
					$("#origin").hide();
				} else {
					$("#origin").show();
				}
				$("#show_code").addClass("hidden").html("");
				$(".c_flash").hide();
				$("body > style").text("");
				$("#animation").removeAttr("style");
			}
		})
	},
	//动画实例
	animateDemo: function() {
		var self = this;
		$(".butt").click(function() {
			var wait;
			clearTimeout(wait);
			var _class = $(this).attr("data-test");
			var animateName = $(this).attr("data-test");
			$("body > style").text("");
			$(".canvas").children().eq(0).removeClass(_class).addClass(_class);
			wait = window.setTimeout(function() {
				$(".canvas").children().eq(0).removeClass(_class)
			}, 1500);

			//显示代码
			$.getJSON("/animation/animate.json", function(data) {
				var cssCode = data[0];
				var keyframes = cssCode[animateName].keyframes;
				//console.info(keyframes);
				keyframes = keyframes + keyframes.replace(/webkit/g, 'moz');
				var cssCodeLast=cssCode["defaults"].slice(0,18)+animateName+" "+cssCode["defaults"].slice(18,-1)+";";
				//console.info(cssCode["defaults"],cssCodeLast);
				var defaults = "#animation{" + cssCodeLast + cssCodeLast.replace(/webkit/g, 'moz') + "}";
				var _html = defaults + keyframes;
				_html = _html.replace(/;/g, ';<br>');
				_html = _html.replace(/{/g, '{<br>');
				_html = _html.replace(/}/g, '}<br>');
				_html = _html.replace(/%{<br>/g, "%{");
				_html = _html.replace(/;<br>}/g, ";}");
				$("#show_ani_code").children(".inner").html(_html);
			});
		});
		$("#see_demo_css").click(function() {
			$(".pop_mask").show();
			$("#show_ani_code").show();
		});
	},
	//重置动画样式
	resetAnimation: function() {
		var self = this;
		$("#reset_animation").click(function() {
			$("body style").html("");
			self.initArgs.animationNode.removeAttr("class");
			$("#ani_pro li").remove();
			$("#ani").addClass("hidden");
			$("#mod_play_ani_pre .button_pre ").removeClass("checked");
			$("#mod_ani_ease .button").removeClass("checked").eq(0).addClass("checked");
			$("#mod_ani_pos .button").removeClass("checked").eq(0).addClass("checked");
			$("#mod_fill_mode .button").removeClass("checked").eq(0).addClass("checked");
			$("#mod_play_state .button").removeClass("checked").eq(0).addClass("checked");
			$("#animation-name").val("demo");
			$("#animation-duration").val("0.5");
			$("#animation-delay").val("0");
			$("#animation-iteration-count").val("1");
			$("#transform-origin-x").val("center");
			$("#transform-origin-y").val("center");
		});
	},
	//贝塞尔曲线浮层
	cubic: function() {
		$("#cubic,#cubic_2").click(function() {
			$(".mod_cubic_dialog").show();
		});
		$("#colse_cubic").click(function() {
			$(".mod_cubic_dialog").hide();
			return false;
		});
		$(document).live("click", function(e) {
			var b1 = $("#cubic");
			var b2 = $("#cubic_2");
			var tag = $(e.target);
			if(!tag.isChildAndSelfOf(".mod_cubic_dialog") || tag != b1 || tag != b2) {
				//$(".mod_cubic_dialog").hide();
			}
			e.stopPropagation();
		});
	},
	Animation: function() {
		this.run();
		this.createProBar();
		this.setValue();
		this.createKeyframe();
		this.delProBar();
		this.delProKeyframe();
		this.showAniCode();
		this.addAniPro();
	}
}
Tool.Animation.prototype = {
	//获取基本动画属性和值
	getProtoValue: function() {
		var aniArr = [];
		$(".animation_box :input").each(function(index, element) {
			switch($(this)[0].id) {
			case "animation-name":
				if($(this).val()) {
					aniArr[index] = $(this).val();
				} else {
					aniArr[index] = "demo";
				}
				break;
			case "animation-duration":
				if($(this).val()) {
					aniArr[index] = $(this).val() + "s";
				} else {
					aniArr[index] = "0.5s";
				}
				break;
			case "animation-delay":
				if($(this).val()) {
					aniArr[index] = $(this).val() + "s";
				} else {
					aniArr[index] = "0"
				}
				break;
			case "animation-iteration-count":
				if($(this).val()) {
					aniArr[index] = $(this).val();
				} else {
					aniArr[index] = "1";
				}
				break;
			case "animation-perspective":
				if($(this).val()) {
					$("div.canvas").css({
						"-webkit-perspective": $(this).val() + "px",
						"-moz-perspective": $(this).val() + "px",
						"perspective": $(this).val() + "px",
						"-moz-transform-style": "preserve-3d",
						"-webkit-transform-style": "preserve-3d"
					})
				}
				break;
			default:
				aniArr[index] = $(this).val();
				break;
			}
			aniArr[4] = $("#mod_ani_ease").find(".checked").attr("value");
			aniArr[5] = $("#mod_ani_pos").find(".checked").attr("value");
			aniArr[6] = $("#mod_fill_mode").find(".checked").attr("value");
			aniArr[7] = $("#mod_ani_backface").find(".checked").attr("value");
		});
		return aniArr;
	},
	//生成属性
	createProto: function() {
		var arr = this.getProtoValue();
		var arrProto = [];
		arrProto[0] = "    -webkit-animation-name:" + arr[0];
		arrProto[1] = "    -webkit-animation-duration:" + arr[1];
		arrProto[2] = "    -webkit-animation-timing-function:" + arr[4];
		arrProto[3] = "    -webkit-animation-delay:" + arr[2];
		arrProto[4] = "    -webkit-animation-iteration-count:" + arr[3];
		arrProto[5] = "    -webkit-animation-direction:" + arr[5];
		arrProto[6] = "    -webkit-animation-fill-mode:" + arr[6];
		arrProto[7] = "    -webkit-backface-visibility:" + arr[7];
		arrProto[8] = "    -webkit-transform-origin:" + $("#transform-origin-x").val() + " " + $("#transform-origin-y").val();
		var cssValue = ".canvas div:nth-of-type(1){\n";
		cssValue += arrProto[7] + ";";
		cssValue += arrProto[8] + ";";
		cssValue += "-webkit-animation:";
		for(var i = 0; i < arr.length - 1; i++) {
			cssValue += arr[i] + " ";
		}
		cssValue += ";}\n";
		return cssValue;
	},
	//生成动画样式
	setCss: function() {
		$("body > style").text("");
		var _css = this.createProto() + this.flash();
		_css = _css + _css.replace(/webkit/g, "moz");
		$("body > style").text(_css);
		//Tool.initArgs.animationNode.removeAttr("style");
	},
	//获取帧的值
	getZValue: function() {
		var arr = [];
		$(".z_box:visible").each(function(index, element) {
			var items = [];
			var pos = [];
			$(this).children(":visible").each(function(index, element) {
				var positionLeft = $(this).position().left;
				if(!$(this).attr("value")) {
					$(this).attr("value", $(this).prev().attr("value"));
				}
				items[index] = $(this).attr("value");
				pos[index] = parseInt((positionLeft / ($(this).parent().width() - 14)) * 100);
			});
			//pos.sort(numberorder);
			arr[index] = [];
			arr[index][0] = $(this).parent().attr("id").substr(2);
			arr[index][1] = items;
			arr[index][2] = pos;
			arr[index][3] = $(this).parent().attr("units");
		});
		var str = [];
		for(var i = 0; i < arr.length; i++) {
			var strChild = "";
			for(var j = 0; j < arr[i][1].length; j++) {
				var fn = arr[i][0];
				if(fn == "rotate" || fn == "rotateX" || fn == "rotateZ" || fn == "perspective" || fn == "rotateY" || fn == "scaleX" || fn == "scaleY" || fn == "translateX" || fn == "translateY" || fn == "translateZ" || fn == "skewX" || fn == "skewY") {
					strChild += arr[i][2][j] + "%{-webkit-transform:" + arr[i][0] + "(" + arr[i][1][j] + arr[i][3] + ");}";
				} else {
					strChild += arr[i][2][j] + "%{" + arr[i][0] + ":" + arr[i][1][j] + arr[i][3] + ";}";
				}
			}
			str[i] = strChild;
		}
		//
		return str;

	},
	//根据帧的值创建动画
	flash: function() {
		var name = $("#animation-name").val() || "demo";
		var _flash = '@-webkit-keyframes ' + name + '{\n    ';
		var arr = this.getZValue();
		var arrStr = arr.toString().replace(/,/g, "");
		var arr2 = arrStr.split("}");
		var arr3 = [];
		var obj = {};
		for(var i = 0; i < arr2.length - 1; i++) {
			arr3[i] = arr2[i].split("{");
		}
		//合并数组内的重复项
		for(var i = 0; i < arr3.length; i++) {
			obj[arr3[i][0]] = (arr3[i][1] + obj[arr3[i][0]]).replace(/undefined/g, "");
		}
		var str = "";
		for(i in obj) {
			var arr = obj[i].split(";");
			arr.pop();
			for(var j = 0; j < arr.length; j++) {
				arr[j] = arr[j].split(":");
			}
			var obj2 = {}
			for(var k = 0; k < arr.length; k++) {
				obj2[arr[k][0]] = (arr[k][1] + " " + obj2[arr[k][0]]).replace(/undefined/g, "");
			}
			var str2 = "";
			for(s in obj2) {
				str2 += s + ":" + obj2[s] + ";";
			}
			obj[i] = str2.replace(/ ;/g, ";");
		}
		for(i in obj) {
			str += i + "{" + obj[i] + "}\n    ";
		}
		_flash += str;
		_flash += '\n}';
		return _flash;
	},
	//创建属性控制条
	createProBar: function() {
		var self = this;
		$(document).on("click", function(e) {
			var tag = $(e.target);
			var width;
			if(tag.hasClass("z_box")) {
				var offsetLeft = tag.offset().left;
				width = tag.width() - 14;
				var left = e.pageX - offsetLeft;
				var times = ((parseFloat($("#animation-duration").val()) / width) * left).toFixed(2);
				var bfb = (left / width).toFixed(2);
				var val = tag.prev().text().replace(/:/g, "");
				var type = "text"
				if(val == "background" || val == "color" || val == "background-color") {
					type = "color";
				}
				tag.children(":last").before('<div class="z_move zon" style="left:' + left + 'px;" title="单击修改属性值,拖动改变时间点" value=""><div class="value">时间点:<input class="time_input" type="text" value=' + parseInt(bfb * 100) + ' /> %<span class="time">,' + times + 's</span><br />设置值:<input type=' + type + ' class="values" /><span class="btn_del" title="删除帧">删除帧</span></div></div>');
			}
			$("#time_line").css("left", left + 110);
			$(".z_move").dnd({
				"range": $(".z_box").eq(0),
				"pos": "y",
				"onChange": function(obj, x, y, e) {
					var width = obj.parent().width() - 14;
					var times = ((parseFloat($("#animation-duration").val()) / width) * x).toFixed(2);
					var bfb = parseInt((x / width).toFixed(2) * 100);
					obj.find(".time").text("," + times + "s");
					obj.find(".time_input").val(bfb);
					$("#time_line").css("left", x + 110);
					self.sortNote(obj);
					self.dragDelProKeyframe(obj);
				}
			});
			e.stopPropagation();
		})
	},
	//对节点进行排序
	sortNote: function(node) {
		if(node.position().left) {
			var positionLeft = node.position().left;
			var prevPositionLeft = node.prev().position().left;
			var nextPositionLeft = node.next().position().left;
			if(positionLeft < prevPositionLeft) {
				node.insertBefore(node.prev());
			};
			if(positionLeft > nextPositionLeft) {
				node.insertAfter(node.next());
			}
		}
	},
	//设置帧的值
	setValue: function() {
		$(document).live("click", function(e) {
			var tag = $(e.target);
			if(tag.hasClass("z") || tag.hasClass("z_move")) {
				$(".value").hide();
				tag.children(".value").show();
				tag.children(".value").children(".values").focus();
			};
			if(!$(e.target).isChildAndSelfOf(".zon")) {
				$(".value").hide();
			}
			e.stopPropagation();
		});
		$(".value > .values").live("blur", function() {
			$(this).parent().parent().attr("value", $(this).val());
		});
		$(".time_input").live("blur", function() {
			var width = $(this).parent().parent().parent().width() - 14;
			var val = $(this).val();
			var left = parseInt(width / 100 * val);
			$(this).parent().parent().css("left", left);
			$("#time_line").css("left", left + 110);
		});
	},
	//创建帧控件
	createKeyframe: function() {
		$(".button_pre").live("click", function() {
			if(!($(this).hasClass("checked"))) {
				var val = $(this).attr("value");
				var type = "text"
				if(val == "background" || val == "color" || val == "background-color") {
					type = "color";
				}
				var id = "z_" + val;
				var units = $(this).attr("units");
				var times = $("#animation-duration").val() + "s";
				var _html = '<li id=' + id + ' units=' + units + '>\
          <div class="pro_name">' + val + ':</div>\
          <div class="z_box" title="单击新建关键帧">\
            <div class="z first zon" title="起始值" value="">\
              <div class="value">\
                时间点:<span class="time">0%,0s</span><br />\
                设置值:<input type=' + type + ' class="values" />\
              </div>\
            </div>\
            <div class="z last zon" title="结束值" value="">\
              <div class="value">\
                时间点:<span class="time">100%,' + times + '</span><br />\
                设置值:<input type=' + type + ' class="values" />\
              </div>\
            </div>\
          </div>\
          <div class="del_z"><a href="#" title="删除" class="del">x</a></div>\
        </li>';
				$("#ani_pro").append(_html);
				$("#ani").removeClass("hidden");
				$(this).addClass("checked");
			}
		});
	},
	//删除属性控制条
	delProBar: function() {
		$(".del_z").live("click", function() {
			var _text = $(this).parent().children().eq(0).text().replace(/:/g, "");
			$(this).parent().remove();
			$(".button_pre").each(function(index, element) {
				if($(this).text() === _text) {
					$(this).removeClass("checked");
				}
			});
			if($("#ani_pro").children().length === 0) {
				$("#ani").addClass("hidden");
			}
			return false;
		});
	},
	//执行动画
	run: function() {
		var self = this;
		$("#view_animation").click(function() {
			self.setCss();
			self.timeLineRun();
		})
	},
	//时间轴运动
	timeLineRun: function() {
		$("#time_line").css("left", "110px");
		var width = $(".z_box").width() - 14;
		var runTime = parseFloat($("#animation-duration").val());
		var delayTime = parseFloat($("#animation-delay").val());
		setTimeout(function() {
			$("#time_line").animate({
				"left": width + 110
			}, runTime * 1000);
		}, delayTime * 1000);
	},
	//删除属性的关键帧
	delProKeyframe: function() {
		$(".btn_del").live("click", function(e) {
			$(this).parent().parent().remove();
			e.stopPropagation();
			return false;
		});
	},
	////拖动的时候判断位置删除关键帧
	dragDelProKeyframe: function(node) {
		var width = node.parent().width() - 14;
		if(node.position().left >= width || node.position().left === 0) {
			node.remove();
			return;
		}
	},
	//查看动画代码
	showAniCode: function() {
		$("#see_code").on("click", function() {
			var txt = $("body>style").html().replace(/;/g, ";<br>");
			txt = txt.replace(/{/g, "{<br>");
			txt = txt.replace(/}/g, "<br>}");
			txt = txt.replace(/<br><br>/g, "<br>");
			$(".pop_mask").show();
			$("#show_ani_code").children(".inner").html(txt);
			$("#show_ani_code").show();
		})
	},
	//添加动画属性;
	addAniPro: function() {
		$("#add_pro").click(function() {
			var pro = $("#pro").val();
			var units = $("#pro_unit").val();
			if(pro) {
				if(units) {
					$("#mod_play_ani_pre").append('<span value=' + pro + ' units=' + units + ' class="button_pre">' + pro + '</span>');
				} else {
					$("#mod_play_ani_pre").append('<span value=' + pro + ' units class="button_pre">' + pro + '</span>');
				}
			} else {
				alert("啥都不写的是屌丝");
			}
		});
	}
}
jQuery.fn.isChildAndSelfOf = function(b) {
	return(this.closest(b).length > 0);
};