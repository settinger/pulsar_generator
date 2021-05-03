import {
  transforms,
  extrusions,
  primitives,
  geometries,
} from "@jscad/modeling";

// Given a vector of x-values and a vector of y-values, generate a single JSCAD polygon
const makePolygon = (xArray, yArray) => {
  const xMin = Math.min(...xArray);
  const xMax = Math.max(...xArray);
  let points = yArray.map((y, index) => {
    let x = xArray[index];
    return [x, y + 0.2]; // Note to self, I should be doing the scaling/translating/transposing up here, not down there
  });
  // Terminate the wave with zeros on both ends
  points.unshift([xMin, 0]);
  points.push([xMax, 0]);

  // Scale, move, and transpose points
  let newPoints = points.map(([x, y]) => {
    return [y * 20, ((x - xMin) * 30) / (xMax - xMin)];
  });
  let shape = primitives.polygon({ points: newPoints, closed: true });

  /*
  let shape = primitives.polygon({ points });
  shape = transforms.translate([xMin * -1, 0, 0], shape); // For some reason I can't get translateX to work, oh well
  shape = transforms.scaleX(10 / (xMax - xMin), shape);
  */

  return shape;
};

// Given a vector of x-values and multiple vectors of y-values, generate a bunch of polygons
// For each vector within yArrays, generate a polygon
// Get range of values in xArray and normalize
// Stack and rotate-extrude the polygons
// Join the individual extrusions
const makePolygons = (xArray, yArrays) => {
  const xMin = Math.min(...xArray);
  const xMax = Math.max(...xArray);
  let polygons = yArrays.map((yArray) => {
    return makePolygon(xArray, yArray);
  });
  return polygons;
};

const makePolyhedron = (polygon, angle) => {
  // The rotate-extrude operation leaves us with a waveform that has to be rotated to return to its original appearance
  const polyhedron = extrusions.extrudeRotate({ angle, segments: 32 }, polygon);
  const newpolyhedron = transforms.rotateX(
    Math.PI / 2,
    transforms.rotateY(Math.PI / 2, polyhedron)
  );
  return newpolyhedron;
};

const makePolyhedra = (polygons, angle) => {
  return polygons.map((polygon) => {
    return makePolyhedron(polygon, angle);
  });
};

// Take an array of polyhedra (with bottom-left corner at origin) and space them out
const stack = (polyhedra, spacing = 10) => {
  return polyhedra.map((polygon, index) => {
    let offset = -1 * spacing * index;
    return transforms.translateY(offset, polygon);
  });
};

module.exports = {
  makePolyhedron,
  makePolyhedra,
  makePolygon,
  makePolygons,
  stack,
};
