import styles from "./LoginLoading.css";

export default function LoginLoading() {
    return (
        <div className={styles['loader-main']}>
            <div className={styles["loader"]}>
                <div>l</div>
                <div>o</div>
                <div>a</div>
                <div>d</div>
                <div>i</div>
                <div>n</div>
                <div>g</div>
            </div>
        </div>
    )
}
