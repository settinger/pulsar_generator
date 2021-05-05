import React, { useState } from "react";

const PulsarCanvas = (props) => {
  // Shortcut to create an SVG element and give it multiple attributes at once
  const newSVG = (tag, props = {}) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    node.setAttributes = (attributes) => {
      for (let [key, value] of Object.entries(attributes)) {
        node.setAttribute(key, value);
      }
    };
    node.setAttributes(props);
    return node;
  };

  // More general method of setting multiple attributes at once
  const setAttributes = (elem, attributes) => {
    for (let [key, value] of Object.entries(attributes)) {
      elem.setAttribute(key, value);
    }
  };

  const points2SVG = (arrayY, i) => {
    const xScale = 500 / Math.max(...props.pulsarX);
    const points = arrayY.map((yVal, j) => {
      return `${props.pulsarX[j] * xScale} ${-yVal * props.yScale}`;
    });
    let path = `M -10 0 L ${points.join(" L ")} L 510 0`;
    return (
      <path
        key={`wave${i}`}
        fill="black"
        stroke="white"
        d={path}
        transform={`translate(0 ${10 * props.spacing * i + 75})`}
      ></path>
    );
  };

  return (
    <div>
      <svg
        id={props.id}
        width={props.width}
        height={props.height}
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          id="background"
          fill="black"
          stroke="none"
          width="500"
          height="500"
        />
        {props.pulsarY?.map(points2SVG)}
      </svg>
    </div>
  );
};

export default PulsarCanvas;
