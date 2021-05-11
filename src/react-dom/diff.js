import {setAttribute} from './index';

export function diff(dom,vnode,container){
  //对比节点的变化
  const ret = diffNode(dom,vnode);
  if(container){
    container.appendChild(ret);
  }
  return ret;
}

function diffNode(dom,vnode){
  console.warn('dom',dom);
  console.warn('vnode',vnode);
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
  //非文本DOM节点
  if(!dom){
    out = document.createElement(vnode.tag);
  }
  // console.warn('out-before',out);
  //比较子节点（DOM节点和组件）
  if(vnode.childrens && vnode.childrens.length>0 || (out.cildNodes && out.cildNodes.length>0)){
    //对比组件 或者子节点
    diffChildren(out,vnode.childrens);
  }
  diffAttribute(out,vnode);
  // console.warn('out-after',out);
  return out;
}

function diffChildren(out,vChildren){

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
  console.warn('domAttrs',domAttrs,dom);
  console.warn('newAttrs',newAttrs,vnode);
  [...domAttrs].map((item)=>{
    // console.warn(item.name,item.value);
    oldAttrs[item.name] = item.value;
  })
  console.warn('oldAttrs',oldAttrs);
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