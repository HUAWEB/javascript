import 'babel-polyfill'; //兼容IE8等不支持es5的浏览器

import Base from './lottery/base.js';
import Timer from './lottery/timer.js';
import Calculate from './lottery/calculate.js';
import Interface from './lottery/interface.js';
import  $ from 'jquery';

/**
 * 深度拷贝 (多重继承)
 * @param target 拷贝目标
 * @param source 拷贝对象
 */
const copyProperties=function(target,source){
    for(let key of Reflect.ownKeys(source)){
        if(key!=='constructor'&&key!=='prototype'&&key!=='name'){
            let desc=Object.getOwnPropertyDescriptor(source,key);
            Object.defineProperty(target,key,desc);
        }
    }
}

/**
 * 多重继承方法 (类的多重继承)
 * @param mixins
 * @returns {Mix}
 */
const mix=function(...mixins){
    class Mix{}
    for(let mixin of mixins){
        copyProperties(Mix,mixin);
        copyProperties(Mix.prototype,mixin.prototype);
    }
    return Mix
}

/**
 *
 */
class Lottery extends mix(Base,Calculate,Interface,Timer){
    constructor(name='syy',cname='11选5',issue='**',state='**'){
        super();
        this.name=name;
        this.cname=cname;
        this.issue=issue;
        this.state=state;
        this.el='';
        this.omit=new Map();
        this.open_code=new Set();
        this.open_code_list=new Set();
        this.play_list=new Map();
        this.number=new Set();
        this.issue_el='#curr_issue';
        this.countdown_el='#countdown';
        this.state_el='.state_el';
        this.cart_el='.codelist';
        this.omit_el='';
        this.cur_play='r5';
        this.initPlayList();
        this.initNumber();
        this.updateState();
        this.initEvent();
    }

    /**
     * [updateState 状态更新]
     * @return {[type]} [description]
     */
    updateState(){
        let self=this;
        this.getState().then(function(res){
            self.issue=res.issue;
            self.end_time=res.end_time;
            self.state=res.state;
            $(self.issue_el).text(res.issue);
            //倒计时更新
            self.countdown(res.end_time,function(time){
                $(self.countdown_el).html(time)
            },function(){
                setTimeout(function () {
                    self.updateState();
                    self.getOmit(self.issue).then(function(res){

                    });
                    self.getOpenCode(self.issue).then(function(res){

                    })
                }, 500);
            })
        })
    }

    /**
     * [initEvent 初始化事件]
     * @return {[type]} [description]
     */
    initEvent(){
        let self=this;
        $('#plays').on('click','li',self.changePlayNav.bind(self));
        $('.boll-list').on('click','.btn-boll',self.toggleCodeActive.bind(self));
        $('#confirm_sel_code').on('click',self.addCode.bind(self));
        $('.dxjo').on('click','li',self.assistHandle.bind(self));
        $('.qkmethod').on('click','.btn-middle',self.getRandomCode.bind(self));
    }
}

export default Lottery;
