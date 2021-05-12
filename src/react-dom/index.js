import Component from '../react/component';
import {diff,diffNode} from './diff';

const ReactDOM = {
  render
}

function render(vnode,container,dom){
  // console.log('render',vnode);
  return diff(dom,vnode,container);
  // return container.appendChild(_render(vnode));
}

export function createComponent(comp,props){
  // console.log('createComponent-comp',comp);
  // console.log('createComponent-comp()',comp());
  // console.log('createComponent-props',props);
  let inst;
  if(comp.prototype && comp.prototype.render){
    //如果是类组件 则创建实例
    inst = new comp(props);
  }else{
    //如果是函数组件 扩展成类组件
    inst = new Component(props);
    inst.constructor = comp;
    //定义render函数
    inst.render = function(){
      return this.constructor(props);
    }
  }
  return inst;
}

export function setComponentProps(comp,props){
  // console.log('setComponentProps-props',props);
  if(!comp.base){
    if(comp.componentWillMount) comp.componentWillMount();
  }else if(comp.componentWillReceiveProps){
    comp.componentWillReceiveProps(props);
  }
  //设置组件属性
  comp.props = props;
  //渲染组件
  renderComponent(comp);
}

export function renderComponent(comp){
  let base;
  // console.log('renderComponent-comp',comp);
  // console.log('renderComponent-comp.render',comp.render);
  if(comp.base){
    if(comp.shouldComponentUpdate && comp.shouldComponentUpdate() === false) return;
    if(comp.componentWillUpdate) comp.componentWillUpdate();
  }
  const renderer = comp.render();
  // console.log('renderComponent-renderer',renderer);
  // base = _render(renderer);
  base = diffNode(comp.base,renderer)
  if(comp.base){
    if(comp.componentDidUpdate) comp.componentDidUpdate();
  }else if(comp.componentDidMount){
    comp.componentDidMount();
  }
  // //节点替换
  // if(comp.base && comp.base.parentNode){
  //   console.error('base',base);
  //   console.error('comp.base',comp.base);
  //   // console.error(comp.base.parentNode);
  //   comp.base.parentNode.replaceChild(base,comp.base);
  // }
  // console.log('renderComponent-base',base);
  comp.base = base;
}

function _render(vnode){
  if(vnode === undefined) return;
  if(typeof vnode === 'number') vnode=String(vnode);
  //字符串直接输出字符串||数字到节点中
  if(typeof vnode === 'string'){
    return document.createTextNode(vnode);
  }
  const {tag,attrs,childrens} = vnode;
  if(typeof tag === 'function'){
    console.warn('函数组件');
    //1、创建组建
    const comp = createComponent(tag,attrs);
    // console.warn('createComponent-after',comp);
    //2、设置组件的属性
    setComponentProps(comp,attrs);
    //3、组件渲染的节点对象返回
    return comp.base;
  }
  const dom = document.createElement(tag);
  //处理输出
  if(attrs){
    Object.keys(attrs).forEach(key=>{
      const val = attrs[key];
      setAttribute(dom,key,val);
    })
  }
  //处理子节点
  childrens.forEach(child=>render(child,dom))
  return dom;
}

export function setAttribute(dom,key,val){
  //将React属性名转换成js属性名 (className->class)
  if(key === 'className'){
    key = 'class'
  }
  //处理事件 onClick onButtom
  if(/on\w+/.test(key)){
    key = key.toLowerCase();
    dom[key] = val || '';
  }else if (key === 'style') {
    if(!val || typeof val === 'string'){
      dom.style.cssText = val || '';
    }else if (val && typeof val === 'object') {
      //{width:20}
      for (const k in val) {
        if(typeof val[k] === 'number'){
          dom.style[k] = val[k] + 'px';
        }else{
          dom.style[k] = val[k];
        }
      }
    }
  }else{
    //其他属性
    if(key in dom){
      dom[key] = val || '';
    }
    if(val){
      //更新值
      dom.setAttribute(key,val);
    }else{
      dom.removeAttribute(key);
    }
  }
}

export default ReactDOM;