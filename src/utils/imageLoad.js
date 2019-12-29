// 图片加载方法
export default function loadImgAsync(url) {
    return new Promise((resolve,reject)=>{
        const image = new Image();
        image.onload = () => {resolve(url)};
        image.onerror = () => {reject()};
        image.src = url;
    })
}