//以pages为根目录,自定义router
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        title: 'blog后台管理',
        antd: true,
        dva: true,
        locale: {
          enable: true,
          default: 'zh-CN',
          baseNavigator: true,
        },
        dynamicImport: {
          loadingComponent: './components/Loadable.js',
          webpackChunkName: true,
          level: 2,
        },
      },
    ],
  ],
  routes: [
    {
      path: '/login',
      component: './Login',
      Routes: ['./routes/LoginRoute.js'],
    },
    {
      path: '/',
      component: '../layouts',
      // 这里相对根目录，文件名后缀不能少
      Routes: ['./routes/PrivateRoute.js'],
      routes: [
        {
          path: '/',
          redirect: '/home',
        },
        {
          path: '/home',
          component: './Home/Home',
        },
        {
          path: '/article',
          component: '././ArticleManage/ArticleManage',
        },
        {
          path: '/resume',
          redirect: '/resume/online',
        },
        {
          path: '/resume/online',
          component: '././Resume/ResumeOnline',
        },
        {
          path: '/resume/upload',
          component: '././Resume/ResumeUpload',
        },
        {
          path: '/visitor',
          component: './Visitor/Visitor',
        },
        {
          path: '/gallery',
          component: './ImageGallery/ImageGallery',
        },
        {
          path: '/personal',
          component: './Personal/Personal',
        },
        {
          component: './NotFound',
        },
      ],
    },
  ],
  proxy: {
    "/api": {
      target: "https://api.mimiron.cn",
      changeOrigin: true
    },
    "/ip": {
      target: "https://bird.ioliu.cn/ip",
      changeOrigin: true
    }
  },
};
