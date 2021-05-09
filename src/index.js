import React from './react';
import ReactDOM from './react-dom';

const ele = (
  <div className='active' title='123'>
    hello,<span>react JSX</span>
  </div>
)
console.warn('JSX',ele);

function FunctionHome(){
  return (
    <div className='active' title='123'>
      hello,<span>react 函数组件Home</span>
    </div>
  )
}
console.warn('函数组件Home',<FunctionHome />);

class ClassHome extends React.Component{
  render(){
    return (
      <div className='active' title='123'>
        hello,<span>react 类组件Home</span>
      </div>
    )
  }
}
console.warn('类组件Home',<ClassHome/>);

ReactDOM.render(ele,document.getElementById('root'))
ReactDOM.render(<FunctionHome title='111'/>,document.getElementById('root'))
ReactDOM.render(<ClassHome title='111'/>,document.getElementById('root'))