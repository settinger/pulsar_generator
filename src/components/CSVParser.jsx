import React, { Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import csv from "csvtojson";

const CSVParser = (props) => {
  const waveData = (arrays) => {
    // I should put some sanity checks here to ensure that data is in the proper format.
    // But for now, assume the following:
    // 1. First row is x-axis values
    // 2. All subsequent rows are y-axis values
    // 3. y-axis values are given in the order they will be displayed
    // 4. All rows are the same length
    // 5. x-axis values are in increasing order
    const pulsarX = arrays[0].map((x) => parseFloat(x)); // Convert a 1-d array from strings to floats
    const pulsarY = arrays.slice(1).map((row) => row.map((y) => parseFloat(y))); // Convert a 2-d array from strings to floats
    props.updatePulsarData(pulsarX, pulsarY);
  };

  const onUpload = (event) => {
    if (event?.target?.files?.length < 1) return;
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target.result;
      csv({ noheader: true, output: "csv" })
        .fromString(rawData)
        .then((arrays) => {
          waveData(arrays);
        });
    };
    reader.readAsText(uploadedFile);
  };

  // Just make some random waves to test things out
  const randomize2 = () => {
    const xVals = new Array(10);
    const yVals = new Array(10);

    for (let i = 0; i < 10; i++) {
      const yRow = new Array(10).fill(0).map((_) => Math.random());
      xVals[i] = i;
      yVals[i] = yRow;
    }

    props.updatePulsarData(xVals, yVals);
  };
  // Just make some random waves to test things out
  const randomize = (waves = 20, points = 29) => {
    const mu = (points + 1) / 2;
    const sigma = points / 5;

    // Apply normal distribution to points
    const normal = (x) => {
      return (
        (1.5 * sigma * Math.exp(-0.5 * ((x - mu) / sigma) ** 2)) /
        (Math.sqrt(2 * Math.PI) * sigma)
      );
    };
    const xVals = new Array(points).fill(0).map((_, i) => i);
    const yVals = new Array(waves).fill([]).map((_) => {
      return new Array(points).fill(0).map((_, j) => Math.random() * normal(j));
    });

    props.updatePulsarData(xVals, yVals);
  };

  return (
    <Fragment>
      <Form>
        <div className="custom-file" style={{ width: "30em", margin: "1em 0" }}>
          <input
            type="file"
            className="custom-file-input"
            id="csvUpload"
            accept=".csv,text/csv"
            onChange={onUpload}
          />
          <label htmlFor="csvUpload" className="custom-file-label">
            Upload .CSV file here
          </label>
        </div>
      </Form>
      <p>
        You can upload a .CSV file representing multiple line plots. Please
        structure the .CSV file so the first row is the x-axis data, and each
        subsequent row is the y-axis data for one of the waveforms. I know, it's
        clunky.
      </p>

      <Button onClick={randomize}>Generate 20 random waves</Button>
    </Fragment>
  );
};

export default CSVParser;
