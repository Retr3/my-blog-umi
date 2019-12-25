import styles from "./LoginLoading.css";

export default function LoginLoading() {
    return (
        <div className={styles['loading-main']}>
            <div className={styles["loader"]}>
                <div className={styles["loader-bg"]}>
                <span>LOADING</span>
                </div>
                <div className={styles["drops"]}>
                    <div className={styles["drop1"]}></div>
                    <div className={styles["drop2"]}></div>  
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
                <filter id="liquid">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="liquid" />
                </filter>
            </defs>
            </svg>
        </div>
    )
}
