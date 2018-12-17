"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 3;

var index = 0;

var pointsArray = [];
var normalsArray = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(2.0, 0.0, 0.0, 1.0 );
var lightPositionLoc;
var viewMatrix;
var projMatrix;
var matViewUniformLocation;
var matProjUniformLocation;

var EyeXir=-2;
var EyeYir;
var EyeZir;

var AtXir;
var AtYir;
var AtZir;

var ARir;

var LpXir;
var LpYir;
var LpZir;
var stepValue = 0.1;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

	sendArrayToShader(program, pointsArray, "vPosition");
	sendArrayToShader(program, normalsArray, "vNormal");

    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");

    ///////////////////////////////

    // EyeXir = document.getElementById('EyeX');
    EyeYir = document.getElementById('EyeY');
    EyeZir = document.getElementById('EyeZ');

    AtXir = document.getElementById('AtX');
    AtYir = document.getElementById('AtY');
    AtZir = document.getElementById('AtZ');

    ARir = document.getElementById('AR');

    LpXir = document.getElementById('LpX');
    LpYir = document.getElementById('LpY');
    LpZir = document.getElementById('LpZ');


    viewMatrix = new Float32Array(4*4);
    projMatrix = new Float32Array(4*4);
    identity4(viewMatrix);

    matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 38) {
        EyeXir+=0.1;
        updateView();
	
    }
    if (event.keyCode == 40) {
        EyeXir-=0.1;
        updateView();
    }
}, true);
    lookAt(viewMatrix,[-EyeXir, +EyeYir.value, +EyeZir.value], [+AtXir.value, +AtYir.value, +AtZir.value], [0,1,0]);
    perspective(projMatrix, radians(+ARir.value), canvas.width / canvas.height, 0.1, 1000.0)

    // ortho(projMatrix, -10, 10, -10, 10, -10, 10)


    console.log(projMatrix);

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    render();
}

function render() {


console.log(EyeXir);

    // send the updated light position to the shader (every frame!!!)
updateLightPosition();
	console.log(lightPosition);
    gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );

    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render);
}

function sendArrayToShader(program, inputArray, shaderAttributeName){
	var buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(inputArray), gl.STATIC_DRAW );

	var attributeLocation = gl.getAttribLocation( program, shaderAttributeName );
	gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( attributeLocation);
}

function triangle(a, b, c) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t2, t1));
     normal = vec4(normal);

     normalsArray.push(normal);
     normalsArray.push(normal);
     normalsArray.push(normal);

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function updateView(){
    lookAt(viewMatrix,[+EyeXir, +EyeYir.value, +EyeZir.value], [+AtXir.value, +AtYir.value, +AtZir.value], [0,1,0]);
    perspective(projMatrix, radians(+ARir.value), canvas.width / canvas.height, 0.1, 1000.0)//

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
}

function updateLightPosition(){
lightPosition = vec4(+LpXir.value,+LpYir.value,+LpZir.value, 1.0 );
 //    var speed = 0.001;
	// lightPosition[0] = 2*Math.sin( (new Date).getTime() * speed ); 
	// lightPosition[2] = Math.cos( (new Date).getTime() * speed ); 
}
