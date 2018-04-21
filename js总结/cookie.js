           function setcookie(key,value,day){//名 值  保存天数
				var d=new Date();
				d.setDate(d.getDate()+day);
				document.cookie=key+'='+encodeURI(value)+';expires='+d;
			}
		
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

		     function delcookie(key){
		   setcookie(key,'',-1);//调用新建cookie函数，设置成已过期即可