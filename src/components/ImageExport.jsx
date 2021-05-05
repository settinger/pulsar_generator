import React from "react";
import { Button } from "react-bootstrap";

const ImageExport = (props) => {
  // We receive an array of polyhedra, we need to union them and then export as AMF
  const exportSVG = () => {
    if (!props.board || !document.getElementById(props.board)) {
      console.log("aaa");
      return;
    }
    console.log(document.getElementById(props.board));
    const serializer = new XMLSerializer();
    const rawData = serializer.serializeToString(
      document.getElementById(props.board)
    );
    const blob = new Blob([rawData], { type: "image/svg+xml" });

    // How can I instigate a download without doing all this vanilla JS and ending it with a.click()?
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.style.display = "none";
    a.href = url;
    a.download = "my_pulsar.svg";
    a.click();
    window.URL.revokeObjectURL(url);
    document.activeElement.blur();
  };

  return (
    <Button variant="primary" size="lg" onClick={exportSVG}>
      Export .svg
    </Button>
  );
};

export default ImageExport;
