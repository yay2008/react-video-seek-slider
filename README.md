# @yay2008/video-seek-slider

> a video seek slider

[![NPM](https://img.shields.io/npm/v/@yay2008/react-video-seek-slider.svg)](https://www.npmjs.com/package/@yay2008/react-video-seek-slider) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)



## 1. 说明

本项目技术选型为：`React` `Typescript`
打包工具为： `rollup`  



## 2. 安装

```bash
npm install --save @yay2008/react-video-seek-slider

或者

yarn add @yay2008/react-video-seek-slider
```



## 3. 接口说明

| 参数                       | 说明               | 类型                                         | 默认值 |
| :------------------------- | :----------------- | :------------------------------------------- | :----: |
| fullTime                | 总时长    | number                                  |        |
| currentTime             | 目前时间 | number |        |
| onChange | 变化回调 | (time: number, offsetTime: number) => void |        |
| offset | 起始时间 | number | 0 |
| bufferProgress? | buffer 进度 | number          |        |
| hideHoverTime? | 是否开启 hover 显示时间功能 | boolen         | false |
| secondsPrefix? | 秒的显示 | string         | "00:" |
| minutesPrefix? | 分的显示 | string          | "00:" |
| limitTimeTooltipBySides? | 三方按钮插入的位置 | boolean         |        |
| sliderColor? | 进度条颜色 | string          |        |
| sliderHoverColor? | hover 显示的进度条颜色 | string          |        |
| thumbColor? | thumb 颜色 | string          |        |
| bufferColor? | buffer 的颜色 | string          |        |



## 4. 使用概览

```tsx
import * as React from "react";
import ToolBox from "@netless/react-tool-box";

export default class ToolBoxExample extends React.Component<{}, {}> 
  render () {
    return (
      <SeekSlider
          // 全部时间
         fullTime={player.timeDuration}
          // 目前时间
         currentTime={this.getCurrentTime(this.state.currentTime)}
          // 时间变化的回调
         onChange={(time: number, offsetTime: number) => {
             if (this.state.player) {
                 this.setState({currentTime: time});
                this.state.player.seekToScheduleTime(time);
             }
         }}
         // hover 显示时间
         hideHoverTime={true}
         limitTimeTooltipBySides={true}
        />
    )
  }
}
```

## 5. 启动项目

1. 获取源码

    ```bash
    git clone https://github.com/yay2008/react-video-seek-slider.git
    ```

2. 进入项目并安装库文件依赖

    ```bash
    cd react-video-seek-slider
    yarn
    ```

3. 启动库文件项目

    ```bash
        yarn start
    ```

4. 进入项目并安装 `example` 文件依赖

    ```bash
        cd example
        yarn
    ```

5. 启动 `example` 项目

    ```bash
        yarn start
    ```

## 6. 项目截图

![slider](https://ohuuyffq2.qnssl.com/WeChat9c5904e21b183e907841753055f7d650.png)

## License

MIT © [yay2008](https://github.com/yay2008)
