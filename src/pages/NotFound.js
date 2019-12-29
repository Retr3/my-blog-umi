
import styles from './NotFound.css';
import img404 from '../assets/images/404.gif'
export default function() {
  return (
    <div className={styles['content_404']}>
      <h1><img src={img404} alt=""/></h1>
      <div className={styles['explain']}>啊哦,网页跑丢了</div>
      <a href="/home" className={styles['tip']}>返回首页</a>
    </div>
  );
}
