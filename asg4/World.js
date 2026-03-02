// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_CameraMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
   gl_Position = u_ProjectionMatrix * u_CameraMatrix * u_ModelMatrix * a_Position;
   v_UV = a_UV;
   v_Normal = a_Normal;
   v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler;
  uniform float u_TexColorWeight;
  uniform vec3 u_LightPos;
  uniform vec3 u_CameraPos;
  uniform float u_LightActive;
  uniform float u_NormalsActive;
  uniform vec3 u_LightCol;
  
  void main() {
    float t = u_TexColorWeight;
    vec4 TexColor = texture2D(u_Sampler, v_UV);
    
    // allow texture with alpha
    if (t > 0.0 && TexColor.a < 0.1) {
      discard;
    }
    
    // texture color
    vec4 col = t * TexColor + (1.0-t) * u_FragColor;
    //gl_FragColor = col;
    
    // light vector
    vec3 lightVector = u_LightPos - vec3(v_VertPos);
    float r = length(lightVector);
    
    // lighting
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(0.0, dot(N,L));
    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_CameraPos - vec3(v_VertPos));
    vec3 dif = vec3(col) * nDotL;
    vec3 amb = vec3(col) * 0.3;
    float spec = pow(max(0.0, dot(E,R)), 20.0);
    vec4 lightCol = vec4(u_LightCol,1) * vec4(spec + dif + amb, 1);
    
    gl_FragColor = (u_LightActive * lightCol) + (1.0 - u_LightActive) * col;
    
    if (u_NormalsActive > 0.0) gl_FragColor = vec4(0.5 - v_Normal, 1.0);
    //gl_FragColor = vec4(0.5 - v_Normal, 1.0);
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
let a_Normal;
let u_TexColorWeight;
let u_Sampler;
let u_LightPos;
let u_CameraPos;
let u_LightActive;
let u_NormalsActive;
let u_LightCol;
let g_startTime = performance.now()/1000;
let g_seconds = 0;
let g_camera;
let g_texture;
let g_brick;
let g_toby;
let g_jump;
let g_shape;
let g_speed = 0;
let g_lightActive = true;
let g_normalsActive = false;
let g_lightPosition;
let g_lightPositionSet = false;
let g_lightCol = [1,1,1];
let g_party = false;

//#region WebGL
function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  gl = canvas.getContext('webgl', { preserveAspectRatio: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (!a_Normal) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
  if (!u_LightPos) {
    console.log('Failed to get the storage location of u_LightPos');
    return false;
  }

  u_CameraPos = gl.getUniformLocation(gl.program, 'u_CameraPos');
  if (!u_CameraPos) {
    console.log('Failed to get the storage location of u_CameraPos');
    return false;
  }

  u_LightActive = gl.getUniformLocation(gl.program, 'u_LightActive');
  if (!u_LightActive) {
    console.log('Failed to get the storage location of u_LightActive');
    return false;
  }

  u_NormalsActive = gl.getUniformLocation(gl.program, 'u_NormalsActive');
  if (!u_NormalsActive) {
    console.log('Failed to get the storage location of u_NormalsActive');
    return false;
  }

  u_LightCol = gl.getUniformLocation(gl.program, 'u_LightCol');
  if (!u_LightCol) {
    console.log('Failed to get the storage location of u_LightCol');
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
  const faster = document.getElementById('speed');
  faster.addEventListener('change', () => {
    g_speed = faster.value;
  });

  document.getElementById("light-active").addEventListener("click", () => {
    g_lightActive = !g_lightActive;
  });

  document.getElementById("normals-active").addEventListener("click", () => {
    g_normalsActive = !g_normalsActive;
    gl.uniform1f(u_NormalsActive, g_normalsActive ? 1.0 : 0.0);
  });

  const pos = document.getElementById("light-position");
  pos.addEventListener("input", () => {
    g_lightPositionSet = true;
    g_lightPosition = pos.value;
  });

  //color
  const r = document.getElementById("r");
  r.addEventListener("input", () => {
    g_lightCol[0] = r.value;
  });
  const g = document.getElementById("g");
  g.addEventListener("input", () => {
    g_lightCol[1] = g.value;
  });
  const b = document.getElementById("b");
  b.addEventListener("input", () => {
    g_lightCol[2] = b.value;
  });
  document.getElementById("party").addEventListener("click", () => {
    g_party = !g_party;
  });
}
//#endregion

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  initTextures();
  g_camera = new Camera();
  g_shape = new Shape();

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
  gl.uniform3f(u_CameraPos, ...g_camera.eye.elements);

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

  g_jump = new Image();
  if (!g_jump) {
    console.log('Failed to create the image object');
    return false;
  }
  g_jump.src = '../images/jump.png';
}

function loadTexture(image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, g_texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
}
//endregion

