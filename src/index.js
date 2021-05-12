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
  constructor(props){
    super(props)
    this.state = {
      num:0
    }
  }
  componentWillMount(){
    console.warn('组件挂载之前');
  }
  componentDidMount(){
    console.warn('组件挂载之后');
    for (let i = 0; i < 10; i++) {
      // this.setState({
      //   num:this.state.num+1
      // })
      // console.warn(this.state.num);
      this.setState((prevState,prevProps)=>{
        console.warn(this.state.num);
        return {
          num:prevState.num+1
        }
      })
    }
  }
  componentWillReceiveProps(props){
    console.warn('父组件发生render的时候子组件调用该函数',props);
  }
  componentWillUpdate(){
    console.warn('将要更新');
  }
  shouldComponentUpdate(){
    console.warn('组件挂载之后每次调用setState后都会调用该函数判断是否需要重新渲染组件，默认返回true');
    return true;
  }
  componentDidUpdate(){
    console.warn('更新之后');
  }
  componentWillUnmount(){
    console.warn('组件被卸载的时候调用，一般在componentDidMount注册的事件需要在这里删除');
  }
  render(){
    console.warn('render',this.state)
    return (
      <div className='active' title='123' >
        hello,<span>react 类组件Home num:{this.state.num}</span>
        <button onClick={()=>{
          this.setState({
            num:this.state.num+1
          })
        }}>add num</button>
      </div>
    )
  }
}
console.warn('类组件Home',<ClassHome/>);

// ReactDOM.render(ele,document.getElementById('root'))
// ReactDOM.render(<FunctionHome name='active'/>,document.getElementById('root'))
ReactDOM.render(<ClassHome name='active'/>,document.getElementById('root'))