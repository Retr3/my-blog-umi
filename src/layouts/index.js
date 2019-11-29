import { Component } from 'react';
import { Layout } from 'antd';
import HeaderBar from './HeaderBar'
import SiderNav from './SiderNav'
import './index.css'
const { Content } = Layout;

class SiderDemo extends Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
    this.child.onCollapse();
  };
  render() {
    const selectKeys =  [this.props.location.pathname];
    return (
      <Layout>
        <SiderNav onRef={ref=>this.child=ref} selectKeys={selectKeys} collapsed={this.state.collapsed}></SiderNav>
        <Layout>
          <HeaderBar collapsed={this.state.collapsed} toggle={this.toggle}></HeaderBar>
          <Content
            style={{
              margin: '24px 16px',
              minHeight: 280,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo