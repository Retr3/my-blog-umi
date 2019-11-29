import React from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Header } = Layout;

class HeaderBar extends React.Component {
  render() {
    return (
      <Header style={{background: '#fff', padding: '0 16px'}}>
          <Icon
            className="trigger"
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.props.toggle}
          />
        <div className="header-ul"></div>
      </Header>
    )
  }
}
export default HeaderBar