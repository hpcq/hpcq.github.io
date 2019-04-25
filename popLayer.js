/**
 * Created with JetBrains PhpStorm.
 * User: whw678@qq.com
 * Date: 12-5-30
 * Time: 下午11:37
 * To change this template use File | Settings | File Templates.
 */

;(function(){
    var popLayer = function (){
        function PopLayer(){}
        PopLayer.prototype ={
            'self':function(){
                return this;
            },
            'IE6' : (window.XMLHttpRequest == undefined) && (ActiveXObject != undefined),
            'setDom':function(){
                var wrap = $('#'+this.box+'');
                this.dom={
                    'wrap':wrap
                }
            },
            'init':function(){
                this.box = "_pop_div_wrap";
                this.create();
                this.setDom();
                this.resize();
                this.esc();
                this.havedReset = false;
                var _this = this,
                    currBox = this.newBox;
                currBox.find('._close,._cancel').click(function(e){
                            e.stopPropagation();
                            return _this.close(currBox);
                        }).end()
                        .find('._ok').click(function(e){
                            e.stopPropagation();
                            return _this.okOpt(currBox);
                        });
            },
            'create':function(){
                var p = this.IE6 ? 'absolute' : 'fixed',
                    shade= 'opacity:0.3;  filter:alpha(opacity=30);   position:absolute; top:0; width:100%; z-index:99999; left:0; height:100%; background-color:#000;',
                    con =  (this.config.optBdr==true ? 'padding:10px;background:rgba(61, 0, 0, 0.2);' : 'padding:0') + '; position:'+p+'; z-index:1000000; top:50%; left:50%; box-shadow:1px 2px 12px rgba(0,0,0,.55); border-radius:5px; ',
                    closeBtn = 'position:absolute; z-index:10; height:16px; width:16px; top:16px; right:16px; font-size:12px;font-family:\'Comic Sans MS\'; text-align:center; color:#333;   overflow:hidden; cursor:pointer;',
                    bd = 'background-color:#FFF; font-size:1em; line-height:1.2em; padding:'+this.config.padding+'; width:'+this.config.width+'; height:'+this.config.height+';',
                    lockWrap = this.config.lock==true ? '<div class="_pop_div_shade"  style=\"'+shade+'\" ></div>' : '',
                    okBtn='', cancelBtn='', optArea='',wrap={};
                if(typeof(addEventListener) === 'undefined' && this.config.optBdr){
                    con += "filter:progid:DXImageTransform.Microsoft.gradient(enabled=\'true\',startColorstr=\'#4C000000\', endColorstr=\'#4C000000\');";
                }
                if(this.config.okBtn){
                    okBtn ='<a href="javascript:;" class="btn-4 _ok">'+this.config.okBtn+'</a>';
                }
                if(this.config.cancelBtn){
                    cancelBtn ='<a href="javascript:;" class="btn-4 _cancel">'+this.config.cancelBtn+'</a>';
                }
                if(this.config.okBtn || this.config.cancelBtn){
                    optArea ='<div style="padding:1em 1.2em; text-align:right;  background-color:#FFF" class="_div_opt">'+okBtn+' '+cancelBtn+'</div>';
                }
                if(this.config.title ){
                    titCl =  'padding:0.5em 1em; font-size:1.2em; line-height:30px; color:#6b6262;  background:#F3F3F3;';
                }else{
                    titCl = 'display:none';
                    closeBtn += 'background:transparent; height:30px; line-height:30px; color:#B3B3B3; font-size:20px; width:30px; text-indent:0; top:10px; right:10px;';
                }
                closeBtn += !this.config.cancel ? 'display:none' :'';
                if(!document.getElementById(this.box)){
                    wrap = $('<div id="'+this.box+'"></div>').appendTo('body');
                }else{
                    wrap = $('#'+this.box);
                }
                var style="<style>._pop_div_con .btn-4{ border: 0; color:#FFF; background:#eb644b; padding:0.5em 2em}</style>";
                this.newBox = $(style+'<div>'+lockWrap+'<div class="_pop_div_con" style=\"'+con+'\" >\
                                <div class="_pop_title" style=\"'+titCl+'\">'+this.config.title+'</div>\
                                <span title="关闭" class="_close" style=\"'+closeBtn+'\">X</span>\
                                <div class="_pop_div_bd" style=\"'+bd+'\">loading</div>'+optArea+'</div></div>').appendTo(wrap);
            },
            'showbox':function(opt){
                var _this = this;
                this.config ={
                    'content':'loading',
                    'type':null,
                    'url':null,
                    'padding':'1em',
                    'optBdr': false,
                    'title':'提示',
                    'cancel':true,
                    'width':'auto',
                    'height':'auto',
					'init':null,
					'close':null,
                    'autoClose':false,
                    'okBtn':null,
                    'cancelBtn':null,
                    'okOpt' : null,
                    'lock' : true
                };
                if(typeof opt === 'string'){
                    this.config.content = opt;
                }else{
                    opt = opt || {};
                    this.config = _this.merge(this.config, opt);
                }
                var config = this.config;
                 this.init();
                // if(!document.getElementById(this.box)){
                //     this.init();
                // }else{
                //     this.dom.wrap.show();
                // }
                var $box = this.dom.wrap,
                    newBox = this.newBox;
                    currBody = newBox.find('._pop_div_bd');
                if(config.type  && config.url){
                    $.ajax({
                        type:'GET',
                        url:config.url,
                        dataType:'html',
                        cache: false,
                        async:false,
                        success:function(data){
                            currBody.html(data);
                            _this.resetBox();
                        }
                    });
                }else{
                    currBody.html(config.content);
                    _this.resetBox();
                }
                $.isFunction(this.config.init) && this.config.init(this.dom.wrap);
                var time = this.config.autoClose;
                if(/^[0-9]+$/.test(time)){
                    clearTimeout(_t);
                    var _t=setTimeout(function(){
                        _this.close(newBox);
                    },time);
                }
                return this.newBox;
            },
            'resetBox':function(){
                var newCon = this.newBox.find('._pop_div_con'),
                    bh = $(document).height() > $('body').height() ? $(document).height() : $('body').height(),
                    h = newCon.outerHeight()/2,
                    w = newCon.outerWidth()/2,
                    sTop = $(document).scrollTop(),
                    miniWin = h*2 >= $(window).height();
                this.dom.wrap.find('._pop_div_shade').height(bh);
                if(miniWin){
                    newCon.css({
                        'top':(sTop+10)+'px',
                        'margin-top':'0',
                        'margin-left':-w+'px',
                        'position':'absolute'
                    });
                }else{
                    newCon.css({
                        'top':'50%',
                        'margin-top':-h+'px',
                        'margin-left':-w+'px',
                        'position':'fixed'
                    });
                }
                if(this.IE6){
                    var _this =this;
                    _this.ie6Scroll(newCon);
                    if(!miniWin){
                        $(window).scroll(function(){
                            _this.ie6Scroll(newCon);
                        });
                    }else{
                          $(window).unbind('scroll');
                    }
                }
                //重新调整
                if(!this.havedReset && w != (newCon.outerWidth()/2) ){
                    this.havedReset = true;
                    var _this = this;
                    setTimeout(function(){
                        _this.resetBox();
                    },5);
                    
                }
            },
            'resize':function(){
                var _this =this;
                $(window).resize(function(){
                    //_this.resetBox();
                });
            },
            "merge":function(a, b){
                a = a || {};
                b = b || {};
                for(i in b)
                    if(b[i] !== undefined)
                        a[i] = b[i];
                return a;
            },
            'ie6Scroll':function(obj){
                var sTop = $(document).scrollTop(),
                    wh = $(window).height(),
                    top = obj.outerHeight() >= wh ? sTop+10 : sTop + wh/2;
                obj.css({
                    'position':'absolute',
                    'top': top+'px'
                });
            },
            'close':function(obj){
                obj.remove();
                $.isFunction(this.config.close) && this.config.close();
                return this;
            },
            'esc':function(){
                var _this = this,
                    wrap = _this.dom.wrap,
                    len = wrap.children().length,
                    obj = $(wrap.children()[0]);
                if(this.config.cancel){
                    document.onkeydown = function(event){
                        var e= event || window.event;
                        (e.keyCode === 27) && _this.close(obj);
                    }
                }
            },
            'okOpt':function(obj){
                this.close(obj);
                $.isFunction(this.config.okOpt) && this.config.okOpt();
                return this;
            }

        };
        return new PopLayer;
    };
    window.popLayer = window.PLY  = popLayer();
})();

 
var share = {

    /**
     * 跨框架数据共享接口
     * @param   {String}    存储的数据名
     * @param   {Any}       将要存储的任意数据(无此项则返回被查询的数据)
     */
    data: function (name, value) {
        var top = window.top,
            cache = top['_CACHE'] || {};
        top['_CACHE'] = cache;
        
        return value !== undefined ? cache[name] = value : cache[name];
    },
    
    /**
     * 数据共享删除接口
     * @param   {String}    删除的数据名
     */
    removeData: function (name) {
        var cache = window.top['_CACHE'];
        if (cache && cache[name]) delete cache[name];
    }
    
};

//plus
PLY.tips=function(msg,callback,time,width,title){
    var time = parseInt(time) || 2,
        width = width || '200px';
    time = time*1000;
    var box=PLY.showbox({
        'content':msg,
        'width':width,
        'autoClose':time,
        'title': title || '提示',
        'close':callback
    });
    return box;
}
PLY.confirm=function(msg,callback,title,width,lock){
    var box=PLY.showbox({
        'content':msg,
        'width':width || '250px',
        'okBtn' : '确定',
        'cancelBtn' : '取消',
        'title': title || '确认消息',
        'lock' : lock || true,
        'okOpt':function(){
            callback();
        }
    });
    return box;
}
PLY.alert=function(msg, title, callback, width,lock){
    var box=PLY.showbox({
        'content':msg,
        'width':width || '250px',
        'title': title || '提示',
        'okBtn' : '确定',
        'lock' : lock || true,
        'close':callback
    });
    return box;
}
PLY.html=function(html,callback, lock, cancel,optBdr){
    var box=PLY.showbox({
        'content':html,
        'title': null,
        'okBtn' : null,
        'lock' : lock || true,
        'cancel' : cancel || false,
        'optBdr' : optBdr || false,
        'close':callback
    });
    return box;
}
PLY.loading=function(html,callback, lock, cancel,optBdr){
    var loading = html || '正在加载...';
    return PLY.html(loading,callback, lock, cancel,optBdr);
}
PLY.iframe=function(src,title){
    var box=PLY.showbox({
        'content':'<iframe frameborder="0" scrolling="yes" width="500" height="300" src="'+src+'"></iframe>',
        'width':'500px',
        'title': title || '上传图片',
        'okBtn' : '确定'
    });
    return box;
}

PLY.showImage=function(src,title,callback){

        var url = src;
        var title = title || '查看图片';
        var img  = new Image();
        var ww = $(window).width()-100;
        var wh = $(window).height()-100;
        //if(/[^\s]+\.(jpg|gif|png|bmp)$/i.test(url)){
            // var box = PLY.showbox('正在加载……');
            img.onload=function(){
                var w = img.width,
                h = img.height;
                if(w > h){
                    nw = w > ww ? ww : w;
                    nh = Math.round(h*(nw/w));
                }else{
                    nh = h > wh ? wh : h;
                    nw = Math.round(w*(nh/h));
                }
                // PLY.close(box);
                var box=PLY.showbox({
                    'content':'<img style=" vertical-align:top;" width=\"'+nw+'\" height=\"'+nh+'\" src=\"'+url+'\" />',
                    'padding' : '0px',
                    'title' : title
                });
                !!callback && callback(box);
            }
            img.src=url;
        //}
}