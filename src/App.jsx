import React, { useState, createRef } from "react";
import { Renderer } from "jscad-react";
import { Row, Col } from "react-bootstrap";

import CSVParser from "./components/CSVParser.jsx";
import BootstrapSlider from "./components/BootstrapSlider.jsx";
import STLExport from "./components/STLExport.jsx";
import PulsarCanvas from "./components/PulsarCanvas.jsx";
import ImageExport from "./components/ImageExport.jsx";

import {
  makePolyhedra,
  makePolygons,
  stack,
} from "./components/makeGeometry.js";

export const App = () => {
  // State variables and refs
  const [pulsarX, setPulsarX] = useState([]);
  const [pulsarY, setPulsarY] = useState([]);
  const [solids, setSolids] = useState([]);
  const [spacing, setSpacing] = useState(4);
  const [angle, setAngle] = useState(30); // NOTICE THIS IS IN DEGREES, JSCAD REQUIRES RADIANS
  const [polygons, setPolygons] = useState([]);
  const [polyhedra, setPolyhedra] = useState([]);
  const [renderWidth, setRenderWidth] = useState(500);
  const renderRef = createRef();

  // Take the pulsar data, create polygons, rotate-extrude the polygons, and then lay the extrusions out in an array
  const generateSolid = (newPulsarX, newPulsarY) => {
    const numWaves = newPulsarY.length;
    const numValues = newPulsarX.length;
    const newPolygons = makePolygons(newPulsarX, newPulsarY);
    const newPolyhedra = makePolyhedra(newPolygons, (angle * Math.PI) / 180);
    setPolygons(newPolygons);
    setPolyhedra(newPolyhedra);
    setSolids(stack(newPolyhedra, spacing));
  };

  // Get the data points from the CSV uploaded in the <CSVParser> Component, then initiate the JSCAD rendering
  const updatePulsarData = (pX, pY) => {
    setPulsarX(pX);
    setPulsarY(pY);
    generateSolid(pX, pY);
  };

  const updateSpacing = (newSpacing) => {
    setSpacing(newSpacing);
    setSolids(stack(polyhedra, newSpacing));
  };

  const updateAngle = (newAngle) => {
    const radians = (newAngle * Math.PI) / 180;
    const newPolyhedra = makePolyhedra(polygons, radians);
    setPolyhedra(newPolyhedra);
    setSolids(stack(newPolyhedra, spacing)); // Aaaaagh why isn't this using the correct spacing value?
    setAngle(newAngle);
  };

  // Add a vanilla JS event listener to recompute renderer width on window resize
  const resizeColumn = (e) => {
    setRenderWidth(renderRef.current?.getBoundingClientRect().width * 0.9);
  };

  window.onresize = resizeColumn;
  window.onload = resizeColumn;

  return (
    <div className="App">
      <header className="App-header">
        <h1>3D Pulsar Generator</h1>
        <h2>
          (a.k.a. <i>Unknown Pleasures</i> Generator)
        </h2>
        <h3>Extremely alpha release</h3>
      </header>
      <main>
        <CSVParser updatePulsarData={updatePulsarData} />
        <Row style={{ maxHeight: 500 }}>
          <Col
            ref={renderRef}
            md="6"
            id="renderer"
            className="d-flex justify-content-around"
          >
            <Renderer solids={solids} width={renderWidth} />
          </Col>
          <Col md="6" className="d-flex justify-content-around">
            <PulsarCanvas
              id="pulsar2d"
              pulsarX={pulsarX}
              pulsarY={pulsarY}
              yScale={100}
              spacing={spacing}
              width={renderWidth}
              height={500}
            />
          </Col>
        </Row>
        <BootstrapSlider
          label={"Define the spacing between the pulses: "}
          min={0}
          max={20}
          step={0.1}
          value={spacing}
          onChange={updateSpacing}
        />
        <BootstrapSlider
          label={"Define the angle of rotation (in degrees): "}
          min={0}
          max={180}
          step={0.1}
          value={angle}
          onChange={updateAngle}
        />
        <STLExport input={solids} />
        <ImageExport board="pulsar2d" />
      </main>
      <footer style={{ marginTop: "2em" }}>
        <div id="link">
          <a href="https://github.com/settinger/pulsar_generator">
            <img src="GitHub-Mark-64px.png" />
            <span style={{ marginLeft: "1em" }}>View source on GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
