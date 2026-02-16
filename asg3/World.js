// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  void main() {
   gl_Position = u_ModelMatrix * a_Position;
   v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler;
  void main() {
    gl_FragColor = u_FragColor;
    // gl_FragColor = vec4(v_UV, 0, 1);
    gl_FragColor = texture2D(u_Sampler, v_UV);
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_ModelMatrix;
let u_FragColor;
let a_UV;
let u_Sampler;
let g_startTime = performance.now()/1000;
let g_seconds = 0;
let g_cube;


//#region WebGL
function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  gl = canvas.getContext('webgl', { preserveAspectRatio: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (!a_UV) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}

//#endregion

//#region HTML
function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get" + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function addActionsForHtmlUI(){
}
//#endregion

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  initTextures();
  g_cube = new Cube();

  // Specify the color for clearing <canvas>
  gl.clearColor(.755, .815, .980, 1);
  renderAllShapes();
  tick();
}

function tick() {
  g_seconds = (performance.now()/1000) - g_startTime;
  renderAllShapes();
  requestAnimationFrame(tick);
}

function renderAllShapes(){
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  g_cube.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "fps");

}

//#region textures
function initTextures() {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(texture, image); };
  // Tell the browser to load an image
  image.src = '../images/concrete.jpg';
  return true;
}

function loadTexture(texture, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
}
//endregion

