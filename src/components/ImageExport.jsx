import React, { Fragment } from "react";
import { Button } from "react-bootstrap";

const ImageExport = (props) => {
  // General "download a URL" function
  const startDownload = (url, filename) => {
    const $link = document.createElement("a");
    $link.style.display = "none";
    $link.href = url;
    $link.download = filename;
    $link.click();
    $link.remove();
    document.activeElement.blur();
  };

  // Export the board as an SVG (relatively straightforward since the DOM already contains an SVG element)
  const exportSVG = () => {
    if (!props.board || !document.getElementById(props.board)) return;
    const $board = document.getElementById(props.board);
    const blob = new Blob([$board.outerHTML], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    startDownload(url, "my_pulsar.svg");
    window.URL.revokeObjectURL(url);
  };

  // Export the board as a PNG (slightly tougher because we have to render the SVG onto a canvas before we can export it)
  const exportPNG = () => {
    if (!props.board || !document.getElementById(props.board)) return;
    const $board = document.getElementById(props.board);
    const { width, height } = $board.getBoundingClientRect();
    const $boardClone = $board.cloneNode(true);

    // Convert SVG data to a URL we can drop into a Canvas
    const blob = new Blob([$board.outerHTML], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);

    // Create a canvas
    const $canvas = document.createElement("canvas");
    $canvas.width = width;
    $canvas.height = height;
    const context = $canvas.getContext("2d");

    // Apply URL to an Image, put that Image into Canvas
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
      // Download canvas as PNG
      const pngUrl = $canvas.toDataURL("image/png");
      startDownload(pngUrl, "my_pulsar.png");
      window.URL.revokeObjectURL(pngUrl);
      window.URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  return (
    <Fragment>
      <Button variant="primary" size="lg" onClick={exportSVG}>
        Export .svg
      </Button>
      <Button variant="primary" size="lg" onClick={exportPNG}>
        Export .png
      </Button>
    </Fragment>
  );
};

export default ImageExport;
