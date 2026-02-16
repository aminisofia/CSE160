// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_CameraMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
   gl_Position = u_ProjectionMatrix * u_CameraMatrix * u_ModelMatrix * a_Position;
   v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler;
  uniform float u_TexColorWeight;
  void main() {
    gl_FragColor = u_FragColor;
    // gl_FragColor = vec4(v_UV, 0, 1);
    float t = u_TexColorWeight;
    gl_FragColor = t * texture2D(u_Sampler, v_UV) + (1.0-t) * u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_ModelMatrix;
let u_CameraMatrix;
let u_ProjectionMatrix;
let u_FragColor;
let a_UV;
let u_TexColorWeight;
let u_Sampler;
let g_startTime = performance.now()/1000;
let g_seconds = 0;
let g_cube;
let g_camera;
let g_texture;
let g_brick;
let g_toby;


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

  u_CameraMatrix = gl.getUniformLocation(gl.program, 'u_CameraMatrix');
  if (!u_CameraMatrix) {
    console.log('Failed to get the storage location of u_CameraMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_TexColorWeight = gl.getUniformLocation(gl.program, 'u_TexColorWeight');
  if (!u_TexColorWeight) {
    console.log('Failed to get the storage location of u_TexColorWeight');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  const projectionMat = new Matrix4();
  projectionMat.setPerspective(60, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMat.elements);

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

//endregion

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
  g_camera = new Camera();
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
  gl.uniformMatrix4fv(u_CameraMatrix, false, g_camera.getViewMat().elements);
  map();

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "fps");

}

//#region Textures
function initTextures() {
  g_texture = gl.createTexture();

  if (!g_texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  g_brick = new Image();
  if (!g_brick) {
    console.log('Failed to create the image object');
    return false;
  }
  g_brick.src = '../images/wall.png';

  g_toby = new Image();
  if (!g_toby) {
    console.log('Failed to create the image object');
    return false;
  }
  g_toby.src = '../images/undertaleDog.png';
}

function loadTexture(image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, g_texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
}
//endregion

