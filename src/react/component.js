import {renderComponent} from '../react-dom'
import {enqueueSetState} from './setStateQueue';
class Component{
  constructor(props={}){
    this.props = props;
    this.state = {};
  }
  setState(stateChange){
    // Object.assign(this.state,stateChange);
    // //渲染组件
    // renderComponent(this)
    enqueueSetState(stateChange,this)
  }
}

export default Component;