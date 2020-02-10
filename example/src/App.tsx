import * as React from "react";
import SeekSlider from "@netless/seek-slider";
import debounce from "lodash/debounce";
import "./App.less";


export type AppStates = {
    currentTime: number;
    progress: number;
    test: boolean;
};

export default class App extends React.Component<{}, AppStates> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            currentTime: 10,
            progress: 0,
            test: false,
        };
        debounce(this.getSlider, 1000);
    }

    private setSeeking = ( evt: React.MouseEvent): void => {
        // evt.preventDefault();
        evt.stopPropagation();
        evt.nativeEvent.stopImmediatePropagation();
    }

    public componentDidMount(): void {
        setInterval(() => {
            this.setState({
                currentTime: this.state.currentTime < 11150 ? this.state.currentTime + 10 : 0,
            });
        }, 100);
        setInterval(() => {
            this.setState({
                progress: this.state.progress < 11150 ? this.state.progress + 20 : 0,
            });
        }, 100);
    }

    private getSlider(): React.ReactNode {
        return <SeekSlider
            fullTime={11150}
            thumbColor={"black"}
            bufferColor={"#D8D8D8"}
            sliderColor={"pink"}
            // sliderHoverColor={"red"}
            currentTime={this.state.currentTime}
            // bufferProgress={this.state.progress}
            onChange={(time: number, offsetTime: number) => {
                this.setState({
                    currentTime: time,
                });
                console.log("changeTime", time);
            }}
            limitTimeTooltipBySides={true}
        />;
    }

    public render(): React.ReactNode {
        return (
            <div className="container"
            >
                <h1>React slider</h1>
                {this.getSlider()}
            </div>
        );
    }
}
