import React from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

class LoadingPage extends React.Component {
  //顶部加载条，页面加载时触发
  componentDidMount(){
    NProgress.start()
  }
  componentWillUnmount(){
    NProgress.done()
  }
  render () {
    return (
      <div/>
    )
  }
}
export default LoadingPage