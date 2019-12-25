export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
// //路由变化时触发
// export function onRouteChange({ location, routes, action }) {
//   return <PrivateRoute/>
// }
