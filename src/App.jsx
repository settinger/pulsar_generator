import React, { Component } from "react";
import { Helmet } from "react-helmet";

import {
  primitives,
  extrusions,
  transforms,
  expansions,
} from "@jscad/modeling";
import { Renderer } from "jscad-react";

import CSVParser from "./components/CSVParser.jsx";
import {
  makePolyhedron,
  makePolyhedra,
  makePolygon,
  makePolygons,
  stack,
} from "./components/makeGeometry.js";

import MySlider from "./components/MySlider.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.updatePulsarData = this.updatePulsarData.bind(this);
    this.generateSolid = this.generateSolid.bind(this);
    this.updateSpacing = this.updateSpacing.bind(this);
    this.state = {
      pulsarX: [],
      pulsarY: [],
      solids: [],
      spacing: [10],
    };
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
    const polygons = makePolygons(this.state.pulsarX, this.state.pulsarY);
    this.polyhedra = makePolyhedra(polygons);
    this.setState({ solids: stack(this.polyhedra, this.state.spacing[0]) });
  }

  // Using the input from the spacing slider, update the distance between polyhedra
  updateSpacing(spacing) {
    this.setState({ spacing });
    this.setState({ solids: stack(this.polyhedra, spacing[0]) });
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
          <CSVParser updatePulsarData={this.updatePulsarData} />
          <Renderer solids={this.state.solids} height={500} width={500} />
          <MySlider
            label={"Define the spacing between the pulses: "}
            mode={1}
            domain={[0, 20]}
            values={this.state.spacing}
            onChange={this.updateSpacing}
          />
        </main>
      </div>
    );
  }
}
