import React, { Component, Fragment } from "react";
import csv from "csvtojson";

export default class CSVParser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
    };
    this.onUpload = this.onUpload.bind(this);
    this.waveData = this.waveData.bind(this);
  }

  // Convert a 2-d array (from a CSV) into the pulsarX and pulsarY vectors expected by other components
  waveData(arrays) {
    // I should put some sanity checks here to ensure that data is in the proper format.
    // But for now, assume the following:
    // 1. First row is x-axis values
    // 2. All subsequent rows are y-axis values
    // 3. y-axis values are given in the order they will be displayed
    // 4. All rows are the same length
    // 5. x-axis values are in increasing order
    const pulsarX = arrays[0].map((x) => parseFloat(x)); // Convert a 1-d array from strings to floats
    const pulsarY = arrays.slice(1).map((row) => row.map((y) => parseFloat(y))); // Convert a 2-d array from strings to floats
    this.props.updatePulsarData(pulsarX, pulsarY);
  }

  // Handle the file-reading and CSV parsing when user uploads their data
  onUpload(event) {
    if (event?.target?.files?.length < 1) return;
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target.result;
      csv({ noheader: true, output: "csv" })
        .fromString(rawData)
        .then((arrays) => {
          this.waveData(arrays);
        });
    };
    reader.readAsText(uploadedFile);
  }

  render() {
    return (
      <Fragment>
        <label htmlFor="upload">Upload .CSV file here: </label>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={this.onUpload}
        ></input>
      </Fragment>
    );
  }
}
