// 初始化区域滚动容器
mui('.mui-scroll-wrapper').scroll({
  indicators: false,
});

// 初始化轮播图
 mui('.mui-slider').slider({
  interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
});