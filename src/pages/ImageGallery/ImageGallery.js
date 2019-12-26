import React, { Component } from 'react'
import styles from './ImageGallery.css'
import Shuffle from 'shufflejs'
import {Card,Modal,BackTop,Col,Radio} from 'antd'
const photos = [
    {
        groups:['scenery'],
        style:'itemOneCol',
        size:'1x1',
        src:'http://h1.ioliu.cn/bing/SloveniaAlps_ZH-CN6052706424_1920x1080.jpg'
    },
    {
        groups:['animal'],
        style:'itemOneCol',
        size:'1x1',
        src:'http://h1.ioliu.cn/bing/ReindeerNorway_ZH-CN5913190372_1920x1080.jpg'
    },
    {
        groups:['scenery'],
        style:'itemOneCol',
        size:'1x1',
        src:'http://h1.ioliu.cn/bing/ReconciliationDay_ZH-CN7914130812_1920x1080.jpg'
    },
    {
        groups:['scenery','animal'],
        style:'itemOneCol',
        size:'1x1',
        src:'http://h1.ioliu.cn/bing/WorldLemurDay_ZH-CN9867937861_1920x1080.jpg'
    },
    {
        groups:['animal'],
        style:'itemOneCol',
        size:'1x1',
        src:'http://h1.ioliu.cn/bing/CommonLoon_ZH-CN5437917206_1920x1080.jpg'
    },
    {
        groups:['character'],
        style:'itemOneCol',
        size:'1x2',
        src:'https://images.unsplash.com/photo-1577171724491-96592a1e6abd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
        groups:['character','scenery'],
        style:'itemOneCol',
        size:'1x2',
        src:'https://images.unsplash.com/photo-1577083971749-13ee66aa1f97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },{
        groups:['character'],
        style:'itemOneCol',
        size:'1x2',
        src:'https://images.unsplash.com/photo-1577280807905-bbdbb5bb583f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
        groups:['scenery'],
        style:'itemOneCol',
        size:'1x2',
        src:'https://images.unsplash.com/photo-1577083833438-b1ecacb8c04a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
        groups:['scenery'],
        style:'itemOneCol',
        size:'1x2',
        src:'https://images.unsplash.com/photo-1577293578066-bf68d41072b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },{
        groups:['animal'],
        style:'itemTwoCol',
        size:'1x1',
        src:'http://h1.ioliu.cn/bing/MaraRiverCrossing_ZH-CN6598585392_1920x1080.jpg'
    },
    {
        groups:['character'],
        style:'itemOneCol',
        size:'1x1',
        src:'https://images.unsplash.com/photo-1558980664-10e7170b5df9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
];
export default class ImageGallery extends Component {
    state={
        visible:false,
        imgSrc:'',
        photos
    }
    componentDidMount(){
        this.shuffle = new Shuffle(this.shuffleDemo, {
            itemSelector: '.photo-item',
            sizer: this.sizer,
        });
        this._whenPhotosLoaded(this.state.photos);
    }
    // componentDidUpdate() {
    //      this.shuffle.resetItems();
    // }
    componentWillUnmount() {
        this.shuffle.destroy();
        this.shuffle = null;
    }
    _whenPhotosLoaded(photos) {
        return Promise.all(photos.map(photo => new Promise((resolve) => {
            const image = document.createElement('img');
            image.src = photo.src;

            if (image.naturalWidth > 0 || image.complete) {
                resolve(photo);
            } else {
                image.onload = () => {
                    resolve(photo);
                };
            }
        })));
    }
    showImg = imgSrc => {
        this.setState({
            imgSrc,
            visible:true
        })
    }
    render() {
        return (
            <div>
                <div style={{padding:'0 32px'}}>
                    <Card bordered={false}>
                        <Radio.Group defaultValue="a" buttonStyle="solid">
                            <Radio.Button value="a"  onClick={()=>this.shuffle.filter()}>全部</Radio.Button>
                            <Radio.Button value="b" onClick={()=>this.shuffle.filter('scenery')}>风景</Radio.Button>
                            <Radio.Button value="c" onClick={()=>this.shuffle.filter('character')}>人物</Radio.Button>
                            <Radio.Button value="d" onClick={()=>this.shuffle.filter('animal')}>动物</Radio.Button>
                        </Radio.Group>
                    </Card>
                </div>
                <div style={{padding: '20px 32px',minHeight:500}}>
                    <div ref={(div)=>this.shuffleDemo=div}>
                        {
                            this.state.photos.map((item,index)=>(
                                <div
                                    className={'photo-item '+styles[item.style]}
                                    data-groups={JSON.stringify(item.groups)}
                                    onClick={()=>this.showImg(item.src)}
                                     key={item.src}>
                                    <div className={'aspect aspect--'+item.size}>
                                        <div className='aspect__inner'>
                                            <img src={item.src} alt="" width='100%' height='100%'/>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                       <Col span={1} ref={(div)=>this.sizer = div}></Col>
                    </div>
                </div>
                <Modal
                    footer={null} closable={false}
                    visible={this.state.visible}
                    onCancel={()=>this.setState({visible:false})}>
                    <img src={this.state.imgSrc} alt="" width='100%' />
                </Modal>
                <BackTop visibilityHeight={200} style={{right: 50}}/>
            </div>
        )
    }
}
