import {setAttribute,setComponentProps,createComponent} from './index';

export function diff(dom,vnode,container){
  //对比节点的变化
  const ret = diffNode(dom,vnode);
  if(container){
    container.appendChild(ret);
  }
  return ret;
}

/**
 * 
 * @param {*} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 * @returns 
 */
export function diffNode(dom,vnode){
  // console.warn('dom',dom);
  // console.warn('vnode',vnode);
  let out = dom;
  if(vnode === undefined) return;
  if(typeof vnode === 'number') vnode=String(vnode);
  //vnode是字符串
  if(typeof vnode === 'string'){
    if(dom && dom.nodeType === 3){
      if(dom.textContent !== vnode){
        //更新文本内容
        dom.textContent = vnode;
      }
    }else{
      out =document.createTextNode(vnode);
      if(dom && dom.parentNode){
        dom.parentNode.replaceNode(out,dom);
      }
    }
    return out;
  }
  if(typeof vnode.tag === 'function'){
    return diffComponent(out,vnode);
  }
  //非文本DOM节点
  if(!dom){
    out = document.createElement(vnode.tag);
  }
  // console.warn('out-before',out);
  //比较子节点（DOM节点和组件）
  if(vnode.childrens && vnode.childrens.length>0 || (out.childNodes && out.childNodes.length>0)){
    //对比组件 或者子节点
    diffChildren(out,vnode.childrens);
  }
  diffAttribute(out,vnode);
  // console.warn('out-after',out);
  return out;
}

function diffComponent(dom,vnode){
  let comp = dom;
  //如果组件没有变化，重新设置props
  if(comp && comp.constructor === vnode.tag){
    //重新设置props
    setComponentProps(comp,vnode.attrs)
    //赋值
    dom = comp.base;
  }else{
    //组件类型发生了变化
    if(comp){
      //先移除旧的组件
      unmountComponent(comp);
      comp=null;
      if(comp.componentWillUnmount) comp.componentWillUnmount();
    }else{
      //1、创建新组件 
      comp = createComponent(vnode.tag,vnode.attrs);
      //2、设置组件属性
      setComponentProps(comp,vnode.attrs);
      //3、给当前组件挂载base
      dom = comp.base;
    }
  }
  return dom
}

function unmountComponent(comp) {
  removeNode(comp.base)
}

function removeNode(dom) {
  if(dom && dom.parentNode){
    dom.parentNode.replaceNode(dom);
  }
}

function diffChildren(dom,vChildren){
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  // console.warn('diffChildren-domChildren',domChildren);
  // console.warn('diffChildren-vChildren',vChildren);
  // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
  if(domChildren.length>0){
    // console.warn('domChildren.length>0');
    [...domChildren].forEach(item => {
      // 获取key
      const key = item.key;
      if (key) {
        // 如果key存在,保存到对象中
        keyed[key] = item;
      } else {
        // 如果key不存在,保存到数组中
        children.push(item)
      }
    })
  }
  if(vChildren && vChildren.length>0){
    let min = 0;
    let childrenLen = children.length;
    [...vChildren].map((vchild,i)=>{
      //获取虚拟DOM中所有的key
      const key = vchild.key;
      let child;
      if(key){
        //如果有key，找到对应的key值的节点
        if(keyed[key]){
          child = keyed[key];
          keyed[key] = undefined;
        }
      }else if(childrenLen > min){
        //如果没有key，会优先找类型相同的节点
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];
          if(c){
            child = c;
            children[j] = undefined;
            if(j === childrenLen-1) childrenLen--;
            if(j === min) min++;
            break;
          }
          
        }
      }
      //对比
      child = diffNode(child,vchild);
      // console.warn('child',child);
      // console.warn('dom',dom);
      //更新DOM
      const f = domChildren[i]
      // console.warn('f',f);
      if(child && child!==dom && child!==f){
        //如果更新前的对应位置唯恐，则说明次节点是新增的
        if(!f){
          dom.appendChild(child)
        //如果更新后的节点和更新前对应位置一样，则说明
        }else if(child === f.nextSibling){
          removeNode(f)
        //将更新后的节点移到正确的位置
        }else{
          //注意insertBefore的用法，第一个参数是要插入的节点
          dom.insertBefore(child,f);
        }
      }
    })
  }
}

/**
 * 
 * @param {*} dom 原有的节点对象
 * @param {*} vnode 虚拟DOM
 */
function diffAttribute(dom,vnode){
  //保存之前的DOM的所有属性
  const oldAttrs = {};
  const newAttrs = vnode.attrs;
  const domAttrs = dom.attributes;
  // console.warn('domAttrs',domAttrs,dom);
  // console.warn('newAttrs',newAttrs,vnode);
  [...domAttrs].map((item)=>{
    // console.warn(item.name,item.value);
    oldAttrs[item.name] = item.value;
  })
  // console.warn('oldAttrs',oldAttrs);
  //比较虚拟DOM
  for (let key in oldAttrs) {
    //原来的属性与新属性对比，不在新属性中将其移除
    if(!(key in newAttrs)){
      setAttribute(dom,key,undefined);
    }
  }
  //属性都存在的话对比 属性值是否一致，不一致需要更新
  for (let key in newAttrs) {
    if(oldAttrs[key] !== newAttrs[key]){
      setAttribute(dom,key,newAttrs[key]);
    }
  }
}