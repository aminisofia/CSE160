let canvas;
let ctx;

function main() {
  canvas = document.getElementById("cnv1");
  if (!canvas) return console.log("Failed");
  ctx = canvas.getContext("2d");
  clearCanvas();
}

function clearCanvas() {
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function angleBetween(v1, v2) {
  let dotprod = Vector3.dot(v1, v2);
  let m1 = v1.magnitude();
  let m2 = v2.magnitude();
  let cosAlpha = dotprod / (m1 * m2);
  return Math.acos(cosAlpha) * 180 / Math.PI;
}

function area(v1, v2) {
  let crossVec = Vector3.cross(v1, v2);
  return crossVec.magnitude() / 2;
}

function handleDrawEvent() {
  let v1 = new Vector3([
    parseFloat(document.getElementById("x1").value),
    parseFloat(document.getElementById("y1").value), 0
  ]);
  let v2 = new Vector3([
    parseFloat(document.getElementById("x2").value),
    parseFloat(document.getElementById("y2").value), 0
  ]);
  clearCanvas();
  ctx.strokeStyle = "red"; drawVector(v1, 20);
  ctx.strokeStyle = "blue"; drawVector(v2, 20);
}

function handleDrawOperationEvent() {
  let v1 = new Vector3([
    parseFloat(document.getElementById("x1").value),
    parseFloat(document.getElementById("y1").value), 0
  ]);
  let v2 = new Vector3([
    parseFloat(document.getElementById("x2").value),
    parseFloat(document.getElementById("y2").value), 0
  ]);
  let operator = document.getElementById("operators").value;
  let scalar = parseFloat(document.getElementById("op").value);

  clearCanvas();
  ctx.strokeStyle = "red"; drawVector(v1, 20);
  ctx.strokeStyle = "blue"; drawVector(v2, 20);
  ctx.strokeStyle = "green";
  if (operator === "add") {
    let v3 = new Vector3(v1.elements);
    v3.add(v2);
    drawVector(v3, 20);
  } else if (operator === "sub") {
    let v3 = new Vector3(v1.elements);
    v3.sub(v2);
    drawVector(v3, 20);
  } else if (operator === "mul") {
    let v3 = new Vector3(v1.elements);
    v3.mul(scalar);
    let v4 = new Vector3(v2.elements);
    v4.mul(scalar);
    drawVector(v3, 20);
    drawVector(v4, 20);
  } else if (operator === "div") {
    let v3 = new Vector3(v1.elements);
    v3.div(scalar);
    let v4 = new Vector3(v2.elements);
    v4.div(scalar);
    drawVector(v3, 20);
    drawVector(v4, 20);
  } else if (operator === "magnitude") {
    console.log(`%cMagnitude v1: ${v1.magnitude().toFixed(2)}`, "color: green; font-weight: bold;");
    console.log(`%cMagnitude v2: ${v2.magnitude().toFixed(2)}`, "color: green; font-weight: bold;");
  } else if (operator === "normalize") {
    console.log(`%cMagnitude v1: ${v1.magnitude().toFixed(2)}`, "color: green; font-weight: bold;");
    console.log(`%cMagnitude v2: ${v2.magnitude().toFixed(2)}`, "color: green; font-weight: bold;");
    let v3 = new Vector3(v1.elements);
    v3.normalize();
    drawVector(v3, 20);
    let v4 = new Vector3(v2.elements);
    v4.normalize();
    drawVector(v4, 20);
  } else if (operator === "angle") {
    let angle = angleBetween(v1, v2);
    console.log(`Angle between v1 v2: ${angle.toFixed(2)} degrees`);
  } else if (operator === "area") {
    let a = area(v1, v2);
    console.log(`Area of the triangle: ${a.toFixed(1)}`);
  }
}

function drawVector(v, scale) {
  let ox = canvas.width/2, oy = canvas.height/2;
  let ex = ox + v.elements[0]*scale;
  let ey = oy - v.elements[1]*scale;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
}
