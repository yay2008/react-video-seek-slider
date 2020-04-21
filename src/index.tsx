import * as React from "react";
import styles from "./styles.less";

export type Time = {
  hh: string;
  mm: string;
  ss: string;
};

export type VideoSeekSliderProps = {
  fullTime: number;
  currentTime: number;
  onChange: (time: number, offsetTime: number) => void;
  onChangeCurTime: (time: number) => void;
  offset?: number;
  bufferProgress?: number;
  hideHoverTime?: boolean;
  secondsPrefix?: string;
  minutesPrefix?: string;
  limitTimeTooltipBySides?: boolean;
  sliderColor?: string;
  sliderHoverColor?: string;
  thumbColor?: string;
  bufferColor?: string;
};

export type VideoSeekSliderStates = {
  ready: boolean;
  trackWidth: number;
  seekHoverPosition: number;
};

export type TransformType = {
  transform: string;
};

export default class SeekSlider extends React.Component<VideoSeekSliderProps, VideoSeekSliderStates> {
  private seeking: boolean;
  private mobileSeeking: boolean;
  private track: HTMLDivElement | null;
  private hoverTime: HTMLDivElement | null;
  private readonly offset: number = 0;
  private readonly secondsPrefix: string = "00:00:";
  private readonly minutesPrefix: string = "00:";

  public constructor(props: VideoSeekSliderProps) {
    super(props);
    if (this.props.offset) {
      this.offset = this.props.offset;
    }
    if (this.props.secondsPrefix) {
      this.secondsPrefix = this.props.secondsPrefix;
    }
    if (this.props.minutesPrefix) {
      this.minutesPrefix = this.props.minutesPrefix;
    }
    this.state = {
      ready: false,
      trackWidth: 0,
      seekHoverPosition: 0,
    };

  }

  public componentDidMount(): void {
    this.setTrackWidthState();
    if (this.track) {
      window.addEventListener("resize", this.setTrackWidthState);
      this.track.addEventListener("resize", this.setTrackWidthState);
      this.track.addEventListener("mousemove", this.handleSeeking);
      this.track.addEventListener("mouseup", this.mouseSeekingHandler);
      this.track.addEventListener("touchmove", this.handleTouchSeeking);
      this.track.addEventListener("touchend", this.mobileTouchSeekingHandler);
      this.track.addEventListener("touchstart", this.handleTouchStart);
    }


  }

  public componentWillUnmount(): void {
    if (this.track) {
      window.removeEventListener("resize", this.setTrackWidthState);
      this.track.removeEventListener("resize", this.setTrackWidthState);
      this.track.removeEventListener("mousemove", this.handleSeeking);
      this.track.removeEventListener("mouseup", this.mouseSeekingHandler);
      this.track.removeEventListener("touchmove", this.handleTouchSeeking);
      this.track.removeEventListener("touchend", this.mobileTouchSeekingHandler);
      this.track.removeEventListener("touchstart", this.handleTouchStart);
    }
  }


  /**
   * 补偿拖动前的seekHoverPosition
   * @param event
   */
  private handleTouchStart = (event: any): void => {
    console.log('touchstart', event);
    let pageX: number = 0;

    for (let i = 0; i < event.changedTouches.length; i++) {
      pageX = event.changedTouches[i].pageX;
    }

    pageX = pageX < 0 ? 0 : pageX;

    this.changeCurrentTimePosition(pageX);
  }

  private handleTouchSeeking = (event: any): void => {
    let pageX: number = 0;

    for (let i = 0; i < event.changedTouches.length; i++) {
      pageX = event.changedTouches[i].pageX;
    }

    pageX = pageX < 0 ? 0 : pageX;

    if (this.mobileSeeking) {
      this.changeCurrentTimePosition(pageX);
    }
  }

  private handleSeeking = (evt: any): void => {
    if (this.seeking) {
      this.changeCurrentTimePosition(evt.pageX);
    }
  }

  private changeCurrentTimePosition(pageX: number): void {
    if (this.track) {
      let position: number = pageX - this.track.getBoundingClientRect().left;

      position = position < 0 ? 0 : position;
      position = position > this.state.trackWidth ? this.state.trackWidth : position;

      this.setState({
        seekHoverPosition: position,
      });

      // if (this.seeking) {
      //   const percent: number = position * 100 / this.state.trackWidth;
      //   const time: number = +(percent * (this.props.fullTime / 100)).toFixed(0);
      //   this.props.onChange(time, (time + this.offset));
      // }
      const percent: number = position * 100 / this.state.trackWidth;
      const time: number = +(percent * (this.props.fullTime / 100)).toFixed(0);
      this.props.onChangeCurTime(time);
      console.log('touchend', this.state.seekHoverPosition);
    }
  }


  private setTrackWidthState = (): void => {
    let track: any = this.track;
    if (track) {
      setTimeout(() => {
        console.log('track.offsetWidth', track.offsetWidth);
        this.setState({
          trackWidth: track.offsetWidth,
        });
      }, 400)
    }
  }

  private handleTrackHover = (clear: boolean, evt: React.MouseEvent): void => {
    if (this.track) {
      let position: number = evt.pageX - this.track.getBoundingClientRect().left;
      if (clear) {
        position = 0;
      }
      this.setState({
        seekHoverPosition: position,
      });
    }
  }

  private getPositionStyle(time: number): TransformType {
    if (this.mobileSeeking || this.seeking) {
      const position: number = this.state.seekHoverPosition * 100 / this.state.trackWidth;
      //  const position: number = 100 * 100 / this.state.trackWidth;
      return {
        transform: `scaleX(${position / 100})`,
      };
    } else {

      const position: number = time * 100 / this.props.fullTime;

      return {
        transform: `scaleX(${position / 100})`,
      };
    }
  }

  private getThumbHandlerPosition(): TransformType {

    if (this.mobileSeeking || this.seeking) {
      const position = this.state.seekHoverPosition;
      return {
        transform: `translateX(${position}px)`,
      };
    } else {
      const position: number = this.state.trackWidth / (this.props.fullTime / this.props.currentTime);
      // const position: number = this.state.seekHoverPosition - this.hoverTime.offsetWidth / 2;
      return {
        transform: `translateX(${position}px)`,
      };
    }

  }

  private getSeekHoverPosition(): TransformType {
    const position: number = this.state.seekHoverPosition * 100 / this.state.trackWidth;

    return {
      transform: `scaleX(${position / 100})`,
    };
  }

  private getHoverTimePosition(): TransformType {
    let position: number = 0;

    if (this.hoverTime) {
      position = this.state.seekHoverPosition - this.hoverTime.offsetWidth / 2;

      if (this.props.limitTimeTooltipBySides) {
        if (position < 0) {
          position = 0;
        } else if (position + this.hoverTime.offsetWidth > this.state.trackWidth) {
          position = this.state.trackWidth - this.hoverTime.offsetWidth;
        }
      }
    }

    return {
      transform: `translateX(${position}px)`,
    };
  }

  private secondsToTime(seconds: number): Time {
    seconds = Math.round(seconds + this.offset);

    const hours: number = Math.floor(seconds / 3600);
    const divirsForMinutes: number = seconds % 3600;
    const minutes: number = Math.floor(divirsForMinutes / 60);
    const sec: number = Math.ceil(divirsForMinutes % 60);

    return {
      hh: hours.toString(),
      mm: minutes < 10 ? "0" + minutes : minutes.toString(),
      ss: sec < 10 ? "0" + sec : sec.toString(),
    };
  }

  private getHoverTime(): string {
    const percent: number = this.state.seekHoverPosition * 100 / this.state.trackWidth;
    const time: number = Math.floor(+(percent * (this.props.fullTime / 100)));
    const times: Time = this.secondsToTime(time);

    if ((this.props.fullTime + this.offset) < 60) {
      return this.secondsPrefix + (times.ss);
    } else if ((this.props.fullTime + this.offset) < 3600) {
      return this.minutesPrefix + times.mm + ":" + times.ss;
    } else {
      return times.hh + ":" + times.mm + ":" + times.ss;
    }
  }

  private mouseSeekingHandler = (event: any): void => {
    this.setSeeking(false, event);
  }

  private seekOnChange = (state: boolean): void => {
    const percent: number = this.state.seekHoverPosition * 100 / this.state.trackWidth;
    const time: number = +(percent * (this.props.fullTime / 100)).toFixed(0);
    if (!state) {
      this.props.onChange(time, (time + this.offset));
    }
    console.log('state', !state ? 0 : this.state.seekHoverPosition);
    this.setState({
      seekHoverPosition: this.state.seekHoverPosition,
    });
  }

  private setSeeking = (state: boolean, evt: React.MouseEvent): void => {
    this.handleSeeking(evt);
    this.seeking = state;
    this.seekOnChange(state);
  }

  private mobileTouchSeekingHandler = (): void => {
    this.setMobileSeeking(false);
  }

  private setMobileSeeking = (state: boolean): void => {
    this.mobileSeeking = state;
    console.log('mobileSeeking', state, this.state.seekHoverPosition);

    this.seekOnChange(state);
  }

  private isThumbActive(): boolean {
    // return this.state.seekHoverPosition > 0 || this.seeking;
    return this.mobileSeeking || this.seeking
  }

  private renderBufferProgress = (): React.ReactNode => {
    if (this.props.bufferProgress) {
      if (this.props.bufferColor) {
        return <div
          className={styles.buffered}
          style={{
            ...this.getPositionStyle(this.props.bufferProgress),
            backgroundColor: this.props.bufferColor,
          }} />;
      } else {
        return <div
          className={styles.buffered}
          style={this.getPositionStyle(this.props.bufferProgress)} />;
      }
    } else {
      return null;
    }
  }


  private renderProgress = () => {
    if (this.props.sliderColor) {
      return <div
        className={styles.connect}
        style={{ ...this.getPositionStyle(this.props.currentTime), backgroundColor: this.props.sliderColor }}
      />;
    } else {
      return <div
        className={styles.connect}
        style={this.getPositionStyle(this.props.currentTime)} />;
    }
  }

  private renderHoverProgress = () => {
    if (this.props.sliderHoverColor) {
      return <div
        className={styles["seek-hover"]}
        style={{ ...this.getSeekHoverPosition(), backgroundColor: this.props.sliderHoverColor }} />;
    } else {
      return <div
        className={styles["seek-hover"]}
        style={this.getSeekHoverPosition()} />;
    }
  }

  private renderThumb = (): React.ReactNode => {
    if (this.props.thumbColor) {
      return <div
        className={this.isThumbActive() ? `${styles.thumb} ${styles.active}` : styles.thumb}
        style={{ ...this.getThumbHandlerPosition() }}>
        <div style={{ backgroundColor: this.props.thumbColor }} className={styles.handler} />
      </div>;
    } else {
      return <div
        className={this.isThumbActive() ? `${styles.thumb} ${styles.active}` : styles.thumb}
        style={{ ...this.getThumbHandlerPosition() }}>
        <div className={styles.handler} />
      </div>;
    }
    return <div></div>
  }

  private drawHoverTime(): React.ReactNode {
    if (!this.props.hideHoverTime) {
      return (
        <div
          className={this.isThumbActive() ? `${styles["hover-time"]} ${styles.active}` : styles["hover-time"]}
          style={this.getHoverTimePosition()}
          ref={ref => this.hoverTime = ref}
        >
          {this.getHoverTime()}
        </div>
      );
    } else {
      return null;
    }
  }

  public render(): React.ReactNode {
    return (
      <div className={styles["ui-video-seek-slider"]}>
        <div
          className={this.isThumbActive() ? `${styles.track} ${styles.active}` : styles.track}
          ref={ref => this.track = ref}
          onMouseMove={evt => this.handleTrackHover(false, evt)}
          onMouseLeave={evt => this.handleTrackHover(true, evt)}
          onMouseDown={evt => this.setSeeking(true, evt)}
          onTouchStart={() => this.setMobileSeeking(true)}
        >
          <div className={styles.main}>
            {this.renderBufferProgress()}
            {this.renderHoverProgress()}
            {this.renderProgress()}
          </div>
        </div>

        {this.drawHoverTime()}

        {this.renderThumb()}
      </div>
    );
  }
}
