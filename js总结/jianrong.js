 
 
 

 //获取css属性
            function getCss(obj,attr){
		         	if(obj.currentStyle){
		               obj.currentStyle[attr]
		         		
		         	}else{
		               getComputedStyle(obj)[attr]
		         		
		         	}
		         }
 //获取元素的定位
            function getpostion(obj){
				//存储最终的值
				var _left=0;
				var _top=0;
				while(obj){//检测定位父级是否存在
					_left+=obj.offsetLeft;
					_top+=obj.offsetTop;
					obj=obj.offsetParent;//获取当前元素的定位父级
				}
				return {//结果返回一个对象，两个值
					left:_left,
					top:_top
				}
			}
 //添加事件监听
                function addEvent(obj,event,fn){//对象，事件(省略on)，事件函数
					if(obj.addEventListener){
						obj.addEventListener(event,fn,false);//false为不捕获，及冒泡
					}else{
						obj.attachEvent('on'+event,fn);//ie事件加上on
					}
				}
//删除事件监听
            function removeEvent(obj,event,fn){
					if(obj.removeEventListener){//标准
						obj.removeEventListener(event,fn,false);
					}else{
						obj.detachEvent('on'+event,fn);//ie8
					}
			}
//取消冒泡
           function cancelbubble(ev){
				var ev=ev||window.event;
				if(ev.stopPropagation){
					ev.stopPropagation();
				}else{
					ev.cancelBubble=true;
				}
			}
//新建cookie
			function setcookie(key,value,day){//名 值  保存天数
				var d=new Date();
				d.setDate(d.getDate()+day);
				document.cookie=key+'='+encodeURI(value)+';expires='+d;
			}
//获取cookie
		    function getcookie(key){//名
				var arr=decodeURI(document.cookie).split('; ');
				//获取的cookie是一串字符串/“名=值;(空格)名=值;(空格)名=值”/
				//变成数组arr=[名=值,名=值,名=值]
				for(var i=0;i<arr.length;i++){//遍历数组arr
					var newarr=arr[i].split('=');//每循环一次得一个newarr=[名，值]
					if(key==newarr[0]){//匹配查询的cookie名
						return newarr[1];//返回匹配到的cookie的值
					}
				}
			}
//删除cookie 
		    function delcookie(key){
				setcookie(key,'',-1);//调用新建cookie函数，设置成已过期即可
			}
		    
