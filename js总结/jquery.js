(function( window , undefined ){


    /**
    *核心构造函数的实现
    */
    function $( html ){
        return new $.fn.init( html );
    }

    var push = [].push;

    $.fn = $.prototype = {

        //顺序尽量不要乱
        constructor : $ ,

        length : 0 , //伪数组

        selector: '' , //选择器（判断是否为一个选择器）

        type : '$' , //声明是一个fox对象

        init : function( html ){

            if( html == null || html === "" ){
                this.events = {};
                return;
            }

            if( typeof html === 'function' ){

                var oldfn = window.onload ;
                if( typeof oldfn === 'function' ){
                    oldfn();
                    html();
                }else{
                    window.onload = html;
                }
                return;//后面的判断不执行了

            }

            /*$(function () {

            })*/
            if( html && html.type === '$' ){
                push.apply( this , html );
                this.selector = html.selector;
                this.events = html.events;
            }

            if( typeof html === 'string' ){
                //判断是html结构字符串或者是选择器
                if( /^= 0 ){
                dom = this.get( index );
            }else{
                dom = this.get( this.length + index );
            }
            return this.constructor( dom );
        },
        //遍历DOM元素
        each : function ( func ){
            return $.each ( this , func );
        },

        //遍历DOM元素
        map : function ( func ){
            return $.map ( this , func );
        }

    }

    //让init继承fox函数上的方法
    $.fn.init.prototype = $.fn;

    $.extend = $.fn.extend = function( obj ){
        for( var k in obj ){
            this[k] = obj[k];
        }
    } 

    /**
    *核心方法
    */
    //将字符串结构转化为DOM数组
    var parseHTML = (function(){
        var div = document.createElement('div');
        function parseHTML( html ){
            var res = [];
            div.innerHTML = html ;
            var list = div.childNodes;
            for(var i = 0 ; i < list.length ; i++){
                res.push( list[i] );
            }
            div.innerHTML = '';
            return res;
        }
        return parseHTML;
    })();

    
    
    /**
    *选择器模块
    */
    var select = (function(){
        //正则表达式
        var rnative = /\{\s*\[native/;
        var rbase = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\*)|(\w+))$/;
        var trim = /^\s+|\s+$/g;
        //能力检测
        var support = {};
        support.getElementsByClassName = rnative.test(document.getElementsByClassName + "");
        support.indexOf = rnative.test( Array.prototype.indexOf + "" );
        support.trim = rnative.test( String.prototype.trim + "" );
        support.qsa = rnative.test( document.querySelectorAll + "" );

        //方法集合
        var push = [].push;
        try {
            var div = document.createElement('div');
            div.innerHTML = '
';
            var ps = div.getElementsByTagName('p');
            var arr = [];
            push.apply( arr , ps );
        }catch (e){
            push = {
                apply : function( arr1 , arr2 ){
                    for(var i = 0; i < arr2.length ; i++){
                        arr1[arr1.length++] = arr2[i];
                    }
                }
            }
        }
        
        var myTrim = function( str ){
            if(support.trim){
                return str.trim();
            }else{
                return str.replace( trim , "" );
            }
        }
        var myIndexOf = function( arr , search , startIndex ){
            startIndex = startIndex || 0;
            if(support.indexOf){
                return arr.indexOf( search , startIndex );
            }else{
                for(var i = 0 ; i < arr.length ; i++){
                    if( arr[i] === search ){
                        //输出索引号
                        return i;
                    }
                }
                //找不到返回-1
                return -1;
            }
        }
        var unique = function( arr ){
            var newarr = [];
            for(var i = 0 ; i < arr.length ; i++){
                if( myIndexOf ( newarr , arr[i] ) == -1 ){
                    newarr.push( arr[i] );
                }
            }
            return newarr;
        }
        function getClassName( classname , node ){
            node = node || document;
            if(support.getElementsByClassName){
                return node.getElementsByClassName(classname);
            }else{
                var list = node.getElementsByTagName('*');
                var arr = [];
                for(var i = 0 ; i < list.length ; i++){
                    if( (" "+list[i].className+" ").indexOf(" "+classname+" ") > -1 ){
                        arr.push(list[i]);
                    }
                }
                return arr ;
            }
        }
        function baseSelect( selector , node ){
            node = node || document;
            var m = rbase.exec( selector ) , res ;
            if(m){
                if(m[1]){
                    res = node.getElementById(m[1]);
                    if( res ){
                        return [res];
                    }else{
                        return [];
                    }
                }else if( m[2] ){
                    return getClassName( m[2] , node );
                }else if( m[3] ){
                    return node.getElementsByTagName(m[3]);
                }else if( m[4] ){
                    return node.getElementsByTagName(m[4]);
                }
            }
            return [];
        }

        function select2( selector , results ){
            results = results || [];
            var selectors = selector.split(" ");
            var arr = [ ], node = [document];
            for(var i = 0 ; i < selectors.length ; i++){
                for(var j = 0 ; j < node.length ; j++){
                    push.apply( arr , baseSelect( selectors[i] , node[j] ) );
                }
                node = arr ;
                arr = [];
            }
            push.apply( results , node );
            return results;
        }
        //核心选择模块
        function select( selector , results ){
            results = results || [];
            if( typeof selector !== 'string' ) { return [] };

            if(support.qsa){
                push.apply( results , document.querySelectorAll(selector) );
            }else{
                var sels = selector.split(",");
                for(var i = 0 ; i < sels.length ; i++){
                    var sub = myTrim ( sels[i] );
                    var m = rbase.test( sub );
                    if(m){
                        //基本选择器
                        push.apply( results , baseSelect( sub ) );
                    }else{
                        //后代选择器
                        select2( sub , results );
                    }
                }
            }
            return unique ( results );
        }
        return select;
    })();
    $.select = select;

    //为fox对象原型添加可以拓展的方法
    $.fn.extend({
    
        appendTo: function( selector ){
            var iObj = this.constructor( selector );
            var newObj  = this.constructor();
            for(var i = 0 ; i < this.length; i++){
                for( var j = 0 ; j < iObj.length ; j++ ){
                    var temp = ( i == this.length - 1 && j == iObj.length - 1 )?
                    iObj[0].appendChild( this[i] ) :
                    iObj[0].appendChild( this[i].cloneNode(true) );
                    [].push.call( newObj , temp );
                    iObj[j].appendChild( temp );
                }
            }
            return newObj;
        },

        append: function( selector ){
            // //把selector添加到this上
            F( selector ).appendTo( this );
            // var iObj = this.constructor( selector );
            // for( var i = 0 ; i < iObj.length ; i++ ){
            //  for(var j = 0 ; j < this.length ; j++){
            //      var temp = ( i == iObj.length-1 && j == this.length-1 )?
            //      iObj[i] : iObj[i].cloneNode(true);
            //      //[].push.call( this , temp );
            //      this[j].appendChild( temp );
            //  }
            // }
            return this;
        },
        
        prependTo : function( selector ){
            //this[i] 添加到 selector 之前
            var iObj = this.constructor( selector );
            var newObj = this.constructor();
            for( var i = 0 ; i < this.length ; i++ ){
                for(var j = 0 ; j < iObj.length ; j++){
                    var temp = ( j == iObj.length - 1 && i == this.length - 1 )?
                                this[i] : this[i].cloneNode( true );
                    push.call( newObj , temp );
                    $.prependChild( iObj[j] , temp );
                }
            }
            return newObj;
        },
        
        prepend : function( selector ){
            var iObj = this.constructor( selector );
            iObj.prependTo( this );
            return this;
        },

        on : function( type , callback ){
            if( ! this.events[ type ] ){
                this.events[ type ] = [];
                var that = this;
                this.each(function(){
                    var self = this;
                    var fn = function(){
                        for(var i = 0 ; i < that.events[ type ].length ; i++){
                            that.events[type][i].call ( self );
                        }
                    };
                    if( this.addEventListener ){
                        this.addEventListener( type , fn , false );
                    }else {
                        this.attachEvent( 'on' + type , fn );
                    }

                });
            }
            this.events[type].push( callback );
            return this;
        },

        off :function( type , fn ){
            var arr = this.events[type];
            for(var i = arr.length - 1 ; i >= 0 ; i--){
                if( arr[i] === fn ){
                    arr.splice( i , 1 );
                    break;
                }
            }
        },

        hover : function( fn1 , fn2 ){
            this.mouseover( fn1 )
                .mouseout( fn2 );
        },

        toggle: function(  ){
            var i = 0 ;
            var ar = arguments
            this.on( 'click' , function( e ){
                ar[ i % ar.length ].call( this , e );
                i++;
            }); 
        },

        css : function(  ){
            var le = arguments.length;
            var args = arguments;
            if( le === 2 ){
                if( F.isString( args[0] ) && F.isString( args[1]) ){
                    return this.each( function(){
                        this.style[ args[0] ] = args[1];
                    })
                }
            }else if( le === 1 ){
                if( F.isString( args[0]) ){
                    return this[0].style[ args[0] ] || F.getStyle( this[0] , args[0] );
                }else {
                    return this.each(function(){
                        for(var k in args[0]){
                            this.style[k] = args[0][k];
                        }
                    })
                }
            }
        },

        addClass : function( cname ){
            return this.each(function(){
                var classname = this.className;

                if(classname){
                    if( (" "+classname+" ").indexOf(" "+cname+" ") == -1 ){
                        this.className += " " + cname;
                    }
                }else{
                    this.className = cname;
                }
            });
        },

        removeClass : function( cname ){
            return this.each(function(){
                //var classname = this.className;

                // if(classname){
                //  var ct = classname.split(" ");
                //  //length值会改变，从后面开始删除
                //  for(var i = ct.length - 1 ; i >= 0 ; i--){
                //      if( ct[i] == cname ){
                //          ct.splice( i , 1 );
                //      }
                //  }
                //  this.className = ct.join(' ');
                // }
                var cls = " "+this.className+" ";
                var r = new RegExp( " "+cname+" " , 'g' );
                this.className = cls.replace( r , " ").replace( /\s+/g , " ").trim();
            });
        },

        hasClass : function( cname ){
            
            for(var i = 0 ; i < this.length ; i ++){
                if( (" "+ this[i].className +" ").indexOf(" "+cname+" ") != -1 ){
                    return true;
                }
            }   
            return false;   
        },

        toggleClass : function( cname ){

            if( this.hasClass( cname ) ){
                this.removeClass( cname );
            }else{
                this.addClass( cname );
            }
            return this;
        },

        attr : function ( ){
            var args = arguments;
            if( args[1] ){
                if( F.isString( args[0] ) && F.isString( args[1] ) ) {
                    return this.each(function(){
                        this.setAttribute( args[0] , args[1] );
                    });
                }
            }else{
                if( F.isString( args[0] ) ) {
                    return this[0].getAttribute( args[0] );
                }
            } 
            return this;
        },

        prop : function (  ){
            var args = arguments;
            if( args[1] ){
                //设置属性
                if( F.isString( args[0] ) && F.isString( args[1] ) ){
                    return this.each( function(){
                        this[ args[0] ] = args[1] ;
                    });
                }
            }else{
                //获取属性
                if( F.isString(args[0]) ){
                    return this[0][ args[0] ];
                }
            }
            return this;
        },

        html : function( h ){
            return this.prop( 'innerHTML' , h )
        },

        val : function( v ){
            return this.prop( 'value' , v );
        },

        text : function ( txt ){
            if( txt ){
                //设置
                var t = document.createTextNode( txt + '' );
                this[0].innerHTML = '';
                this[0].appendChild (t);
            }else{
                var arr = [];
                getTxt( this[0] , arr );
                return arr.join(' ');
            }
            function getTxt( dom , arr ){
                var nodes = dom.childNodes;
                for(var i = 0 ; i < nodes.length ; i++){
                    if( nodes[i].nodeType === 3 ){
                        arr.push( nodes[i].nodeValue );
                    }
                    if( nodes[i].nodeType === 1 ){
                        getTxt( nodes , arr );
                    }
                }
            }
        },

        //动画模块
        animate : function( prop , dur , easing , fn ){
            clearInterval( this.intervalId );
            var startX = parseInt ( $.getStyle( this[0] , 'left' ) );
            var startY = parseInt( $.getStyle( this[0] , 'top' ) );
            var start = +new Date();
            var that = this;
            var isOver = false;
            this.intervalId = setInterval(function(){

                var t = ( +new Date()) - start;
                if( t >= dur ){
                    t = dur ;
                    clearInterval( that.intervalId );
                    isOver = true;
                }

                easing = easing || 'line';

                that[0].style.left = startX +
                 $.Easing[ easing ](  null , t , startX , parseInt( prop['left'] ) , dur ) + 'px';
                that[0].style.top = startY +
                 $.Easing[ easing ](  null , t , startY , parseInt( prop['top'] ) , dur ) + 'px';

                if( isOver && typeof fn === 'function' ){
                    fn.apply( that );
                }

            },20);
            return this;
        }
    });

    //fox的构造函数的静态方法
    $.extend({
        
    
        each : function( arr , func ){
            var i ;
            if( arr instanceof Array || arr.length >= 0 ){
                for( i = 0; i < arr.length ; i++ ){
                    func.call( arr[i] , i , arr[i] );
                }
            }else{
                for( i in arr ){
                    func.call( arr[i] , i , arr[i] );
                }
            }
            return arr;
        },

        map : function ( arr , func ){
            var i , res = [] , temp ;
            if( arr instanceof Array || arr.length >= 0 ){
                for( i = 0; i < arr.length ; i++ ){
                    temp = func.call( arr[i] ,  arr[i] , i );
                    if( temp != null ){
                        res.push( temp );
                    }
                }
            }else{
                for( i in arr ){
                    temp = func.call( arr[i] ,  arr[i] , i );
                    if( temp != null ){
                        res.push( temp );
                    }
                }
            }
            return res;
        },

        //prepend
        prependChild : function ( parent , child ){
            var first = parent.firstChild;
            return parent.insertBefore( child , first );
        },

        isString : function( str ){
            return typeof str === 'string';
        },

        getStyle : function ( obj , attr ){
            //返回的是数字类型
            if( window.getComputedStyle ){
                return window.getComputedStyle( obj , null )[attr];
            }else {
                return obj.currentStyle[attr];
            }
        }

    });


    $.Easing = {

              line: function ( x, t, b, c, d ) {
                var speed = ( c - b ) / d;
                return speed * t;
              },
              change: function ( x, t, b, c, d ) {
                return Math.log( t + 1 ) / Math.log( d + 1 ) * ( c - b );
              },
              easeInQuad: function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
              },
              easeOutQuad: function (x, t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
              },
              easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
              },
              easeInCubic: function (x, t, b, c, d) {
                return c*(t/=d)*t*t + b;
              },
              easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
              },
              easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
              },
              easeInQuart: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
              },
              easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
              },
              easeInOutQuart: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
              },
              easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
              },
              easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
              },
              easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
              },
              easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
              },
              easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
              },
              easeInOutSine: function (x, t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
              },
              easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
              },
              easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
              },
              easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
              },
              easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
              },
              easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
              },
              easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
              },
              easeInElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
              },
              easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
              },
              easeInOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
              },
              easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
              },
              easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
              },
              easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158; 
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
              },
              easeOutBounce: function (x, t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                  return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                  return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                  return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                  return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
              }


        };
    /*
    *事件对象模块
    */
    $.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
               "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
               "change select submit keydown keypress keyup error contextmenu").split(" "), 
    function( i , v ){
        $.fn[ v ] = function( fn ){
            this.on( v , fn );
            return this;
        };
    });

    window.$ = window.F = $ ;

})( window );