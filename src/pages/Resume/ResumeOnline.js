
import { connect } from 'dva';
import { Descriptions, Input } from 'antd'
import styles from './Resume.css'
export default function() {
  return (
    <div className={styles["resume-dom"]}>
      <Descriptions title="User Info" bordered column={{ xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label="姓名">张</Descriptions.Item>
        <Descriptions.Item label="性别">man</Descriptions.Item>
        <Descriptions.Item label="职业">前端攻城狮</Descriptions.Item>
        <Descriptions.Item label="毕业院校">XXXX大学</Descriptions.Item>
        <Descriptions.Item label="联系电话">12312354678</Descriptions.Item>
        <Descriptions.Item label="邮箱" span={2}>123@123.com</Descriptions.Item>
        <Descriptions.Item label="工作城市">上海</Descriptions.Item>
        <Descriptions.Item label="工作时间" span={2}>3年</Descriptions.Item>
        <Descriptions.Item label="求职意向" span={4}>最多30个字</Descriptions.Item>
        <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
        <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
        <Descriptions.Item label="Config Info">
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1<br />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
