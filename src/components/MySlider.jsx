// Taken almost verbatim from react-compound-slider documentation

import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import { Handle, Track } from "./sliderStuff";

class MySlider extends Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      values: this.props.values,
      update: this.props.values,
    };
  }
  static defaultProps = {
    label: "",
    mode: 2,
    domain: [0, 100],
    rootStyle: { position: "relative", width: "50%", touchAction: "none" },
    values: [30],
    update: [30],
  };

  onUpdate = (update) => {
    this.setState({ update });
  };

  onChange = (values) => {
    console.log("bbbb");
    this.setState({ values });
  };

  render() {
    const railStyle = {
      position: "absolute",
      width: "100%",
      height: 10,
      marginTop: 35,
      borderRadius: 5,
      backgroundColor: "#8B9CB6",
    };
    return (
      <div style={{ padding: "1em" }}>
        {this.props.label.length > 0 && (
          <div style={{ marginBottom: "1em" }}>{this.props.label}</div>
        )}
        <Slider {...this.props}>
          <Rail>
            {({ getRailProps }) => (
              <div style={railStyle} {...getRailProps()} />
            )}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
        </Slider>
      </div>
    );
  }
}

export default MySlider;
