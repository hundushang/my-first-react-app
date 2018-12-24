import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import layer from './base/layer/layer'
import './base/layer/need/layer.css'
import App from './App'
window.layer = layer
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker();
