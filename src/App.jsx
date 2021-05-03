import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Renderer } from "jscad-react";

import CSVParser from "./components/CSVParser.jsx";
import {
  makePolyhedra,
  makePolygons,
  stack,
} from "./components/makeGeometry.js";
import BootstrapSlider from "./components/BootstrapSlider.jsx";
import STLExport from "./components/STLExport.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.updatePulsarData = this.updatePulsarData.bind(this);
    this.generateSolid = this.generateSolid.bind(this);
    this.updateSpacing = this.updateSpacing.bind(this);
    this.updateAngle = this.updateAngle.bind(this);
    this.state = {
      pulsarX: [],
      pulsarY: [],
      solids: [],
      spacing: 10,
      angle: 30, // NOTICE THIS IS IN DEGREES, JSCAD REQUIRES RADIANS
    };
    this.polygons = [];
    this.polyhedra = [];
  }

  // Get the data points from the CSV uploaded in the <CSVParser> Component, then initiate the JSCAD rendering
  updatePulsarData(pulsarX, pulsarY) {
    this.setState({ pulsarX, pulsarY });
    this.generateSolid();
  }

  // Take the pulsar data, create polygons, rotate-extrude the polygons, and then lay the extrusions out in an array
  generateSolid() {
    const numWaves = this.state.pulsarY.length;
    const numValues = this.state.pulsarX.length;
    this.polygons = makePolygons(this.state.pulsarX, this.state.pulsarY);
    this.polyhedra = makePolyhedra(
      this.polygons,
      (this.state.angle * Math.PI) / 180
    );
    this.setState({ solids: stack(this.polyhedra, this.state.spacing) });
  }

  // Using the input from the spacing slider, update the distance between polyhedra
  updateSpacing(spacing) {
    this.setState({ spacing });
    this.setState({ solids: stack(this.polyhedra, spacing) });
  }

  updateAngle(angle) {
    const radians = (angle * Math.PI) / 180;
    this.polyhedra = makePolyhedra(this.polygons, radians);
    const solids = stack(this.polyhedra, this.state.spacing);
    this.setState({ angle, solids });
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>3D Pulsar Generator</title>
        </Helmet>
        <header className="App-header">
          <h1>3D Pulsar Generator</h1>
          <h2>
            (a.k.a. <i>Unknown Pleasures</i> Generator)
          </h2>
        </header>
        <main>
          <p>
            <i>TODO: explain how to format the .CSV files properly</i>
          </p>
          <CSVParser updatePulsarData={this.updatePulsarData} />
          <Renderer solids={this.state.solids} height={500} width={500} />
          <BootstrapSlider
            label={"Define the spacing between the pulses: "}
            min={0}
            max={20}
            step={0.1}
            value={this.state.spacing}
            onChange={this.updateSpacing}
          />
          <BootstrapSlider
            label={"Define the angle of rotation (in degrees): "}
            min={0}
            max={180}
            step={0.1}
            value={this.state.angle}
            onChange={this.updateAngle}
          />
          <STLExport input={this.state.solids} />
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
  }
}
