import React from './react';
import ReactDOM from './react-dom';

const ele = (
  <div className='active' title='123'>
    hello,<span>react</span>
  </div>
)

console.warn('ele',ele);

function Home(){
  return (
    <div className='active' title='123'>
      hello,<span>react</span>
    </div>
  )
}

console.warn('Home',<Home title='111'/>);

// ReactDOM.render(ele,document.getElementById('root'))
ReactDOM.render(<Home title='111'/>,document.getElementById('root'))