"use strict";

var gl;
var i,j;
var height;

var thetaLoc;
var radius;
var trans;
var canvas;
var Objects=[];
var changePosition;
var index=0;
var index_nr=0;
var currently_selectedINDEX = 0;

var modelViewMatrixLoc,modelViewMatrix ;
var projectionMatrixLoc,projectionMatrix;

var lightPosition= vec4(1.0, 1.0, -0.8, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var lightPositionLoc;
var normalMatrix, normalMatrixLoc;

// perspectiva and camera
var EyeXir=-2;
var EyeYir=0;
var EyeZir=0;

var AtXir;
var AtYir=0;
var AtZir=0;
var rotation = 2;
var text = [] ;

var ARir;




 // start of the program
 window.onload = function init()
 {
 	canvas = document.getElementById( "gl-canvas" );

 	gl = WebGLUtils.setupWebGL( canvas );
 	if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );   
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    var vColor = gl.getAttribLocation( program, "vColor" );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    //event listeners for buttons
    gl.uniform4fv( gl.getUniformLocation(program,
    	"ambientProduct"),flatten(ambientProduct) );

    gl.uniform4fv( gl.getUniformLocation(program,
    	"diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
    	"specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
    	"lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
    	"shininess"),materialShininess );

    //event listeners for buttons
    document.getElementById( "xButton" ).onclick = function () {
    	Objects[currently_selectedINDEX].axis = Objects[currently_selectedINDEX].xAxis;
    	Objects[currently_selectedINDEX].rotation += rotation;

    };
    document.getElementById( "yButton" ).onclick = function () {
    	Objects[currently_selectedINDEX].axis = Objects[currently_selectedINDEX].yAxis;
    	Objects[currently_selectedINDEX].rotation += rotation;
    };
    document.getElementById( "zButton" ).onclick = function () {
    	Objects[currently_selectedINDEX].axis = Objects[currently_selectedINDEX].zAxis;
    	Objects[currently_selectedINDEX].rotation += rotation;

    };

    document.getElementById("file").onchange=function(event){
    	openFile(event);
    	var button = document.createElement("BUTTON");
    	var text = document.createTextNode("Object "+ (index+1));
    	button.appendChild(text);
    	document.body.appendChild(button);
    	var temp = index;
    	button.onclick= function(){
    		currently_selectedINDEX=temp;
    	}
    	index++;

    }



    // parse(text);

    // console.log(text);


    thetaLoc = gl.getUniformLocation(program, "theta");
    trans = gl.getUniformLocation(program, "translation");
    scale = gl.getUniformLocation(program, "scale_matrix");

    //light01position = gl.getUniformLocation(program, "lightarray[" + index "].lightPosition");

    document.getElementById("cone").onclick = function (){
    	var newCone= new CONE((Math.floor(Math.random() * 3) + 1)/10,(Math.floor(Math.random() * 3) + 1)/10);
    	newCone.makeCone();
    	newCone.makeColor(newCone.color1,newCone.color2,newCone.color3);
    	Objects.push(newCone);

    	var button = document.createElement("BUTTON");
    	var text = document.createTextNode("Cone "+ (index+1));
    	button.appendChild(text);
    	document.body.appendChild(button);
    	var temp = index;
    	button.onclick= function(){
    		currently_selectedINDEX=temp;
    	}
    	index++;
    };
    document.getElementById("cilindru").onclick = function (){
    	var newCilinder= new Cilinder((Math.floor(Math.random() * 4) + 1)/50,(Math.floor(Math.random() * 3) + 1)/10);
    	newCilinder.makeCilinder();
    	newCilinder.makeColor(newCilinder.color1,newCilinder.color2,newCilinder.color3);
    	Objects.push(newCilinder);
    	var button = document.createElement("BUTTON");
    	var text = document.createTextNode("Cilinder "+ (index+1));
    	button.appendChild(text);
    	document.body.appendChild(button);
    	var temp = index;
    	button.onclick= function(){
    		currently_selectedINDEX=temp;
    	}
    	index++;

    };

    document.getElementById("square").onclick = function (){
    	var newSquare= new Square((Math.floor(Math.random() * 4) + 1)/50);
    	newSquare.makeCilinder();
    	newSquare.makeColor(newSquare.color1,newSquare.color2,newSquare.color3);
    	Objects.push(newSquare);
    	var button = document.createElement("BUTTON");
    	var text = document.createTextNode("Square "+ (index+1));
    	button.appendChild(text);
    	document.body.appendChild(button);
    	var temp = index;
    	button.onclick= function(){
    		currently_selectedINDEX=temp;
    	}
    	index++;

    };
    document.getElementById("sfera").onclick = function (){
    	var newSphere= new Sphere((Math.floor(Math.random() * 4) + 1)/10);
    	newSphere.makeSphere();
    	newSphere.makeColor(newSphere.color1,newSphere.color2,newSphere.color3);
    	Objects.push(newSphere);
    	var button = document.createElement("BUTTON");
    	var text = document.createTextNode("Sphere "+ (index+1));
    	button.appendChild(text);
    	document.body.appendChild(button);
    	var temp = index;
    	button.onclick= function(){
    		currently_selectedINDEX=temp;
    	}
    	index++;

    };



    document.getElementById("slideZ").oninput = function(){


    	Objects[currently_selectedINDEX].axis1 = Objects[currently_selectedINDEX].x;
    	Objects[currently_selectedINDEX].translationValue=this.value;


    }
    document.getElementById("slideY").oninput = function(){
    	Objects[currently_selectedINDEX].axis1 = Objects[currently_selectedINDEX].y;
    	Objects[currently_selectedINDEX].translationValue=this.value;

    }

    document.getElementById("slideX").oninput = function(){
    	Objects[currently_selectedINDEX].axis1 = Objects[currently_selectedINDEX].z;
    	Objects[currently_selectedINDEX].translationValue=this.value;

    }


    document.getElementById("scaleX").oninput = function(){
    	Objects[currently_selectedINDEX].ax = Objects[currently_selectedINDEX].xA;
    	Objects[currently_selectedINDEX].scaleValue = this.value;

    }
    document.getElementById("scaleY").oninput = function(){
    	Objects[currently_selectedINDEX].ax = Objects[currently_selectedINDEX].yA;
    	Objects[currently_selectedINDEX].scaleValue = this.value;

    }
    document.getElementById("scaleZ").oninput = function(){
    	Objects[currently_selectedINDEX].ax = Objects[currently_selectedINDEX].zA;
    	Objects[currently_selectedINDEX].scaleValue = this.value;

    }


    document.getElementById("red").oninput = function(){
    	Objects[currently_selectedINDEX].colors=[];
    	Objects[currently_selectedINDEX].makeColor(this.value,Objects[currently_selectedINDEX].color2,Objects[currently_selectedINDEX].color3);

    }
    document.getElementById("green").oninput = function(){
    	Objects[currently_selectedINDEX].colors=[];
    	Objects[currently_selectedINDEX].color2 = this.value;
    	Objects[currently_selectedINDEX].makeColor(Objects[currently_selectedINDEX].color1,this.value,Objects[currently_selectedINDEX].color3);


    }
    document.getElementById("blue").oninput = function(){
    	Objects[currently_selectedINDEX].colors=[];
    	Objects[currently_selectedINDEX].color3 = this.value;
    	Objects[currently_selectedINDEX].makeColor(Objects[currently_selectedINDEX].color1,Objects[currently_selectedINDEX].color2,this.value);
    }

    AtXir = document.getElementById('AtX');
    ARir = document.getElementById('AR');

    //perspectiva
    modelViewMatrix = new Float32Array(4*4);
    projectionMatrix = new Float32Array(4*4);
    identity4(modelViewMatrix);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelView");
    projectionMatrixLoc = gl.getUniformLocation(program,"projection");
    document.addEventListener('keydown', function(event) {
    	if (event.keyCode == 38) {
    		EyeXir+=0.1;
    	}
    	if (event.keyCode == 40) {
    		EyeXir-=0.1;
    	}
    	if (event.keyCode == 37) {
    		EyeYir+=0.1;
    	}
    	if (event.keyCode == 39) {
    		EyeYir-=0.1;
    	}
    	if (event.keyCode == 83) {
    		AtYir+=0.1;
    	}
    	if (event.keyCode == 87) {
    		AtYir-=0.1;
    	}
    	if (event.keyCode == 65) {
    		AtZir+=0.1;
    	}
    	if (event.keyCode == 68) {
    		AtZir-=0.1;
    	}
    	updateView();

    }, true);
    lookAt(modelViewMatrix,[-EyeXir -EyeYir, 0], [0, -AtYir, +AtZir], [0,1,0]);
    perspective(projectionMatrix, radians(+ARir.value), canvas.width / canvas.height, 0.1, 1000.0);

    //light
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

//cone constructor

function CONE(radius,height){
	//perspectiva
	//end perspectiva
	//-->light<--
	// this.lightPosition = vec4(1.0, 1.0, -2.0, 1.0 );
	this.normalsArray = [];
	this.indexNormals = 0;
	this.rotation=0;

	//end normal array
	this.xA = 0;
	this.yA = 1;
	this.zA = 2;
	this.ax = 0;
	this.scaleMatrix = [1, 1, 1];
	this.scaleValue=1;
	this.xAxis = 0;
	this.yAxis = 1;
	this.zAxis = 2;
	this.axis = 0;
	this.x = 0;
	this.y = 1;
	this.z = 2;
	this.translationMatrix=[0,0,0];
	this. axis1 = 0;
	this. theta = [ 0, 0 ,0];
	this.color1=(Math.floor(Math.random() * 10) + 1)/10;
	this.color2=(Math.floor(Math.random() * 10) + 1)/12;
	this.color3=(Math.floor(Math.random() * 10) + 1)/15;

	this.radius=radius;
	this.height=height;
	this.vertices=[];
	this. colors=[];
	this.pas=Math.PI* 2/100;
	this.translationValue=0;
	this.makeCone=function(){
        //draw cone
        for( i=0 ;i < 100; i ++){
        //coord of triangles
        this.vertices.push(vec3(this.radius*Math.sin(i*this.pas),0,this.radius* Math.cos(i*this.pas)));
        this.vertices.push(vec3(0,this.height,0));
        this.vertices.push(vec3(this.radius*Math.sin((i+1)*this.pas),0,this.radius*Math.cos((i+1)*this.pas)));
        //coord for bottom
        this.vertices.push(vec3(this.radius*Math.sin(i*this.pas),0,this.radius* Math.cos(i*this.pas)));
        this.vertices.push(vec3(0,0,0));
        this.vertices.push(vec3(this.radius*Math.sin((i+1)*this.pas),0,this.radius*Math.cos((i+1)*this.pas)));

    }

};
this.makeColor = function(color1,color2,color3){
	this.color1=color1;
	this.color2=color2;
	this.color3=color3;
	for(i=0; i<this.vertices.length/6;i++){
		this.colors.push(vec3(this.color1,this.color2,this.color3));
		this.colors.push(vec3(this.color2,this.color2,this.color3));
		this.colors.push(vec3(this.color1,this.color3,this.color3));
		this.colors.push(vec3(this.color3,this.color2,this.color1));
		this.colors.push(vec3(this.color3,this.color2,this.color1));
		this.colors.push(vec3(this.color3,this.color2,this.color1));
	}

	for (var i = 0; i < this.vertices.length; i += 3) {
		this.triangle(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]);
	}
};

//-->normals of the object for light
this.triangle=function(a, b, c) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.t1 = subtract(this.b, this.a);
	this.t2 = subtract(this.c,this. a);
	this.normal = normalize(cross(this.t2, this.t1));
	this.normal = vec4(this.normal);

	this.normalsArray.push(this.normal);
	this.normalsArray.push(this.normal);
	this.normalsArray.push(this.normal);


	this.indexNormals += 3;
}
 //end normal



 this.render=function(){

 	var nBuffer = gl.createBuffer();
 	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
 	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

 	var attributeLocation = gl.getAttribLocation( program, "vNormal" );
 	gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );
 	gl.enableVertexAttribArray( attributeLocation);
 	var verticesId = gl.createBuffer();
 	// __--__><
 	gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
 	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );


 	gl.vertexAttribPointer( vPosition, 3 , gl.FLOAT, false, 0, 0 );
 	gl.enableVertexAttribArray( vPosition );


 	var colorsId = gl.createBuffer();
 	gl.bindBuffer( gl.ARRAY_BUFFER, colorsId );
 	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );


 	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray( vColor );

 	this.theta[this.axis] = this.rotation;
 	gl.uniform3fv(thetaLoc, this.theta);

 	this.translationMatrix[this.axis1] = this.translationValue;
 	gl.uniform3fv(trans, this.translationMatrix);

 	this.scaleMatrix[this.ax] = this.scaleValue;
 	gl.uniform3fv(scale, this.scaleMatrix);

 	for( var i=0; i<this.indexNormals; i+=3)
 		gl.drawArrays( gl.TRIANGLES, i, 3 );

 }

};
//cilinder constructor

function Cilinder(radius,height){
	this.normalsArray = [];
	this.indexNormals = 0;
	this.xA = 0;
	this.rotation=0;

	this.yA = 1;
	this.zA = 2;
	this.ax = 0;
	this.scaleMatrix = [1, 1, 1];
	this.scaleValue=1;
	this.xAxis = 0;
	this.yAxis = 1;
	this.zAxis = 2;
	this.axis = 0;
	this.x = 0;
	this.y = 1;
	this.z = 2;
	this.translationMatrix=[0,0,0];
	this. axis1 = 0;
	this. theta = [ 0, 0 ,0];
	this.color1=(Math.floor(Math.random() * 10) + 1)/10;
	this.color2=(Math.floor(Math.random() * 10) + 1)/12;
	this.color3=(Math.floor(Math.random() * 10) + 1)/15;
	this.radius=radius;
	this.height=height;
	this.vertices=[];
	this. colors=[];
	this.pas=Math.PI* 2/100;
	this.translationValue=0;
	this.makeCilinder = function(){
		for( i=0;i<100;i++){

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), 0, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), this.height, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), 0, this.radius * Math.cos((i + 1) * this.pas)));

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), this.height, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), this.height, this.radius * Math.cos((i + 1) * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), 0, this.radius * Math.cos((i + 1) * this.pas)));

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), 0, radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(0, 0, 0));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), 0,this.radius * Math.cos((i + 1) * this.pas)));

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), this.height, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(0, this.height, 0));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), this.height, this.radius * Math.cos((i + 1) * this.pas)));

		}
		for (i = 0; i < this.vertices.length; i += 3) {
			this.triangle(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]);
		}
	};

	this.triangle=function(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.t1 = subtract(this.b, this.a);
		this.t2 = subtract(this.c,this. a);
		this.normal = normalize(cross(this.t2, this.t1));
		this.normal = vec4(this.normal);

		this.normalsArray.push(this.normal);
		this.normalsArray.push(this.normal);
		this.normalsArray.push(this.normal);


		this.indexNormals += 3;
	}
        //color
        // Cilinder

        this.makeColor = function(color1,color2,color3){
        	this.color1=color1;
        	this.color2=color2;
        	this.color3=color3;
        	for(i=0; i<this.vertices.length/12;i++){

        		this.colors.push(vec3(this.color2,this.color2,this.color2));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));

        		this.colors.push(vec3(this.color2,this.color3,this.color3));
        		this.colors.push(vec3(this.color1,this.color3,this.color3));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));

        		this.colors.push(vec3(this.color2,this.color1,this.color3));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));
        		this.colors.push(vec3(this.color3,this.color2,this.color1));

        		this.colors.push(vec3(this.color1,this.color2,this.color3));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));



        	}

        }

        this.render = function (){
        	console.log(this.normalsArray);

        	var nBuffer = gl.createBuffer();
        	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
        	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

        	var attributeLocation = gl.getAttribLocation( program, "vNormal" );
        	gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );
        	gl.enableVertexAttribArray( attributeLocation);
        	var verticesId = gl.createBuffer();

        	var verticesId = gl.createBuffer();
        	gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
        	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );


        	gl.vertexAttribPointer( vPosition, 3 , gl.FLOAT, false, 0, 0 );
        	gl.enableVertexAttribArray( vPosition );


        	var colorsId = gl.createBuffer();
        	gl.bindBuffer( gl.ARRAY_BUFFER, colorsId );
        	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );


        	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0);
        	gl.enableVertexAttribArray( vColor );
        	this.theta[this.axis] = this.rotation;
        	gl.uniform3fv(thetaLoc, this.theta);


        	this.translationMatrix[this.axis1] = this.translationValue;
        	gl.uniform3fv(trans, this.translationMatrix);

        	this.scaleMatrix[this.ax] = this.scaleValue;
        	gl.uniform3fv(scale, this.scaleMatrix);


            // gl.drawArrays( gl.TRIANGLES, 0,this.vertices.length);

            for( var i=0; i<this.indexNormals; i+=3)
            	gl.drawArrays( gl.TRIANGLES, i, 3 );

        }
    };

    function Sphere (radius){
    	this.normalsArray = [];
    	this.rotation=0;

    	this.indexNormals = 0;
    	this.vertices = [];
    	this.colors = [];
    	this.latPoints=20;
    	this.longPoints=20;
    	this.r=radius;
    	this.xA = 0;
    	this.yA = 1;
    	this.zA = 2;
    	this.ax = 0;
    	this.scaleMatrix = [1, 1, 1];
    	this.scaleValue=1;
    	this.xAxis = 0;
    	this.yAxis = 1;
    	this.zAxis = 2;
    	this.axis = 0;
    	this.x = 0;
    	this.y = 1;
    	this.z = 2;
    	this.translationMatrix=[0,0,0];
    	this. axis1 = 0;
    	this. theta = [ 0, 0 ,0];
    	this.vertices=[];
    	this. colors=[];
    	this.translationValue=0;
    	this.color1=(Math.floor(Math.random() * 10) + 1)/10;
    	this.color2=(Math.floor(Math.random() * 10) + 1)/12;
    	this.color3=(Math.floor(Math.random() * 10) + 1)/15;
    	var latitudeBands = 20;
    	var longitudeBands = 0;

    	this.makeSphere = function(){
    		for (  i=0; i<=this.latPoints; i++){
    			for (j=0; j<=this.longPoints; j++){
    				this.vertices.push(vec3(this.r*Math.cos(j*2*Math.PI/this.longPoints)*Math.sin(i*Math.PI/this.latPoints), this.r*Math.cos(i*Math.PI/this.latPoints), this.r*Math.sin(j*2*Math.PI/this.longPoints)*Math.sin(i*Math.PI/this.latPoints)));
    				this.vertices.push(vec3(this.r*Math.cos(j*2*Math.PI/this.longPoints)*Math.sin((i+1)*Math.PI/this.latPoints), this.r*Math.cos((i+1)*Math.PI/this.latPoints), this.r*Math.sin(j*2*Math.PI/this.longPoints)*Math.sin((i+1)*Math.PI/this.latPoints)));
    				this.vertices.push(vec3(this.r*Math.cos((j+1)*2*Math.PI/this.longPoints)*Math.sin(i*Math.PI/this.latPoints), this.r*Math.cos(i*Math.PI/this.latPoints), this.r*Math.sin((j+1)*2*Math.PI/this.longPoints)*Math.sin(i*Math.PI/this.latPoints)));

    				this.vertices.push(vec3(this.r*Math.cos(j*2*Math.PI/this.longPoints)*Math.sin((i+1)*Math.PI/this.latPoints), this.r*Math.cos((i+1)*Math.PI/this.latPoints), this.r*Math.sin(j*2*Math.PI/this.longPoints)*Math.sin((i+1)*Math.PI/this.latPoints)));
    				this.vertices.push(vec3(this.r*Math.cos((j+1)*2*Math.PI/this.longPoints)*Math.sin(i*Math.PI/this.latPoints), this.r*Math.cos(i*Math.PI/this.latPoints), this.r*Math.sin((j+1)*2*Math.PI/this.longPoints)*Math.sin(i*Math.PI/this.latPoints)));
    				this.vertices.push(vec3(this.r*Math.cos((j+1)*2*Math.PI/this.longPoints)*Math.sin((i+1)*Math.PI/this.latPoints), this.r*Math.cos((i+1)*Math.PI/this.latPoints), this.r*Math.sin((j+1)*2*Math.PI/this.longPoints)*Math.sin((i+1)*Math.PI/this.latPoints)));     
    			}
    		}

    		for (i = 0; i < this.vertices.length; i += 3) {
    			this.triangle(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]);
    		}

    	}

    	this.triangle=function(a, b, c) {
    		this.a = a;
    		this.b = b;
    		this.c = c;
    		this.t1 = subtract(this.b, this.a);
    		this.t2 = subtract(this.c,this. a);
    		this.normal = normalize(cross(this.t2, this.t1));
    		this.normal = vec4(this.normal);

    		this.normalsArray.push(this.normal);
    		this.normalsArray.push(this.normal);
    		this.normalsArray.push(this.normal);


    		this.indexNormals += 3;
    	}

    	this.makeColor = function(color1,color2,color3){
    		this.color1=color1;
    		this.color2=color2;
    		this.color3=color3;
    		for(i=0; i<this.vertices.length/3;i++){

    			this.colors.push(vec3(this.color1,this.color2,this.color3));
    			this.colors.push(vec3(this.color2,this.color2,this.color3));
    			this.colors.push(vec3(this.color1,this.color3,this.color3));
    		}
    	}
    	this.render = function(){
    		console.log(this.normalsArray.length);
    		console.log(this.vertices.length);
    		console.log(this.colors.length);
    		var nBuffer = gl.createBuffer();
    		gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    		gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

    		var attributeLocation = gl.getAttribLocation( program, "vNormal" );
    		gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );
    		gl.enableVertexAttribArray( attributeLocation);
    		var verticesId = gl.createBuffer();
    // Load the data into the GPU
    var verticesId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorsId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorsId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors),gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation (program, "vColor");
    gl.vertexAttribPointer( vColor,3,gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray( vColor);

    this.theta[this.axis] = this.rotation;
    gl.uniform3fv(thetaLoc, this.theta);


    this.translationMatrix[this.axis1] = this.translationValue;
    gl.uniform3fv(trans, this.translationMatrix);

    this.scaleMatrix[this.ax] = this.scaleValue;
    gl.uniform3fv(scale, this.scaleMatrix);

    for (var i = 0; i < this.vertices.length; i += 3)
    	gl.drawArrays(gl.TRIANGLES, i, 3);
    


}
}

//cilinder square

function Square(radius){
	this.normalsArray = [];
	this.indexNormals = 0;
	this.xA = 0;
	this.yA = 1;
	this.zA = 2;
	this.ax = 0;
	this.scaleMatrix = [1, 1, 1];
	this.scaleValue=1;
	this.xAxis = 0;
	this.yAxis = 1;
	this.zAxis = 2;
	this.axis = 0;
	this.x = 0;
	this.y = 1;
	this.z = 2;
	this.rotation=0;
	this.translationMatrix=[0,0,0];
	this. axis1 = 0;
	this. theta = [ 0, 0 ,0];
	this.color1=(Math.floor(Math.random() * 10) + 1)/10;
	this.color2=(Math.floor(Math.random() * 10) + 1)/12;
	this.color3=(Math.floor(Math.random() * 10) + 1)/15;
	this.radius=radius;
	this.height=1.5*radius;
	this.vertices=[];
	this. colors=[];
	this.pas=Math.PI* 2/4;
	this.translationValue=0;
	this.makeCilinder = function(){
		for( i=0;i<4;i++){

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), 0, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), this.height, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), 0, this.radius * Math.cos((i + 1) * this.pas)));

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), this.height, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), this.height, this.radius * Math.cos((i + 1) * this.pas)));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), 0, this.radius * Math.cos((i + 1) * this.pas)));

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), 0, radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(0, 0, 0));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), 0,this.radius * Math.cos((i + 1) * this.pas)));

			this.vertices.push(vec3(this.radius * Math.sin(i * this.pas), this.height, this.radius * Math.cos(i * this.pas)));
			this.vertices.push(vec3(0, this.height, 0));
			this.vertices.push(vec3(this.radius * Math.sin((i + 1) * this.pas), this.height, this.radius * Math.cos((i + 1) * this.pas)));

		}
		for (i = 0; i < this.vertices.length; i += 3) {
			this.triangle(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]);
		}
	};

	this.triangle=function(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.t1 = subtract(this.b, this.a);
		this.t2 = subtract(this.c,this. a);
		this.normal = normalize(cross(this.t2, this.t1));
		this.normal = vec4(this.normal);

		this.normalsArray.push(this.normal);
		this.normalsArray.push(this.normal);
		this.normalsArray.push(this.normal);


		this.indexNormals += 3;
	}
        //color
        // Cilinder

        this.makeColor = function(color1,color2,color3){
        	this.color1=color1;
        	this.color2=color2;
        	this.color3=color3;
        	for(i=0; i<this.vertices.length/2;i++){

        		this.colors.push(vec3(this.color2,this.color2,this.color2));
        		this.colors.push(vec3(this.color1,this.color2,this.color3));


        	}

        }

        this.render = function (){
        	console.log(this.colors);

        	var nBuffer = gl.createBuffer();
        	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
        	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

        	var attributeLocation = gl.getAttribLocation( program, "vNormal" );
        	gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );
        	gl.enableVertexAttribArray( attributeLocation);
        	var verticesId = gl.createBuffer();

        	var verticesId = gl.createBuffer();
        	gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
        	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );


        	gl.vertexAttribPointer( vPosition, 3 , gl.FLOAT, false, 0, 0 );
        	gl.enableVertexAttribArray( vPosition );


        	var colorsId = gl.createBuffer();
        	gl.bindBuffer( gl.ARRAY_BUFFER, colorsId );
        	gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );


        	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0);
        	gl.enableVertexAttribArray( vColor );
        	this.theta[this.axis] = this.rotation;
        	gl.uniform3fv(thetaLoc, this.theta);


        	this.translationMatrix[this.axis1] = this.translationValue;
        	gl.uniform3fv(trans, this.translationMatrix);

        	this.scaleMatrix[this.ax] = this.scaleValue;
        	gl.uniform3fv(scale, this.scaleMatrix);


            // gl.drawArrays( gl.TRIANGLES, 0,this.vertices.length);

            for( var i=0; i<this.indexNormals; i+=3)
            	gl.drawArrays( gl.TRIANGLES, i, 3 );

        }
    };

function Obj(){
    	this.normalsArray = [];
    	this.indexNormals = 0;
    	this.xA = 0;
    	this.yA = 1;
    	this.zA = 2;
    	this.ax = 0;
    	this.scaleMatrix = [1, 1, 1];
    	this.scaleValue=1;
    	this.xAxis = 0;
    	this.yAxis = 1;
    	this.zAxis = 2;
    	this.axis = 0;
    	this.x = 0;
    	this.y = 1;
    	this.z = 2;
    	this.rotation=0;
    	this.translationMatrix=[0,0,0];
    	this. axis1 = 0;
    	this. theta = [ 0, 0 ,0];
    	this.color1=(Math.floor(Math.random() * 10) + 1)/10;
    	this.color2=(Math.floor(Math.random() * 10) + 1)/12;
    	this.color3=(Math.floor(Math.random() * 10) + 1)/15;
    	this.radius=radius;
    	this.vertices=[];
    	this.colors=[];
    	this.pas=Math.PI* 2/4;
    	this.translationValue=0;

    	this.makeColor = function(color1,color2,color3){
    		this.color1=color1;
    		this.color2=color2;
    		this.color3=color3;
    		for(i=0; i<this.vertices.length;i++){

    			// this.colors.push(vec4(0,0,0,1));
    			this.colors.push(vec4(this.color1,this.color2,this.color3,1));


    		}

    	}

    	this.render = function (){
    		// console.log(this.normalsArray);
    		this.indexNormals = this.normalsArray.length;

    		var nBuffer = gl.createBuffer();
    		gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    		gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

    		var attributeLocation = gl.getAttribLocation( program, "vNormal" );
    		gl.vertexAttribPointer( attributeLocation, 4, gl.FLOAT, false, 0, 0 );

    		gl.enableVertexAttribArray( attributeLocation);

    		var verticesId = gl.createBuffer();
    		gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
    		gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );

    		gl.vertexAttribPointer( vPosition, 3 , gl.FLOAT, false, 0, 0 );
    		gl.enableVertexAttribArray( vPosition );

    		var clrs = [vec4(0,0,0,1)];

    		var colorsId = gl.createBuffer();
    		gl.bindBuffer( gl.ARRAY_BUFFER, colorsId );
    		gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

    		gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0);
    		gl.enableVertexAttribArray( vColor );


    		this.theta[this.axis] = this.rotation;
    		gl.uniform3fv(thetaLoc, this.theta);


    		this.translationMatrix[this.axis1] = this.translationValue;
    		gl.uniform3fv(trans, this.translationMatrix);

    		this.scaleMatrix[this.ax] = this.scaleValue;
    		gl.uniform3fv(scale, this.scaleMatrix);


            // gl.drawArrays( gl.TRIANGLES, 0,this.vertices.length);

           // for( var i=0; i<this.indexNormals; i+=3) 
           console.log(this.vertices.length);
            	gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length );

        }

    }

    function openFile (event) {
    	var input = event.target;
    	var reader = new FileReader();
    	reader.onload = function () {
    		var lines = reader.result;
    		text = lines.split("\n");
    		parse(text);

    	};
    	reader.readAsText(input.files[0]);
    };

    function parse(text){
    	var newObj = new Obj();
    	var indexLine;
    	var temporaryVertices = [];
    	temporaryVertices.push([]);
    	var temporarynormalsArray = [];
    	temporarynormalsArray.push([]);
    	var l;
    	var initialLine;
    	for( indexLine=0 ;indexLine<text.length ; indexLine++){
    		initialLine = text[indexLine].split(" ");
    		switch(initialLine[0]){
    			case "v":{
    				var x = parseFloat(initialLine[2]);
    				var y = parseFloat(initialLine[3]);
    				var z = parseFloat(initialLine[4])
    				temporaryVertices.push(vec3(x,y,z));
    				break;
    			}
    			case "vn":{
    				var x = parseFloat(initialLine[1]);
    				var y = parseFloat(initialLine[2]);
    				var z = parseFloat(initialLine[3])

    				temporarynormalsArray.push(vec4(x,y,z,1));
    				break;
    			}
    			case "f":{
    				var i = 0;
    				for(i=1;i<4;i++){
    					 l = initialLine[i].split("/");
    					newObj.vertices.push(temporaryVertices[l[0]]);
    					newObj.normalsArray.push(temporarynormalsArray[l[2]]);

    				}
    				break;
    			}
    		}

    	}

    	newObj.makeColor(newObj.color1,newObj.color2,newObj.color3);

    	// for(var i = 0; i < newObj.vertices.length; i++){
    	// 	newObj.colors.push(vec4(0,0,0,1));
    	// }

    	console.log(newObj.colors);

    	Objects.push(newObj);
    	console.log(newObj.vertices.length);
    	console.log(newObj.normalsArray.length);

    }


    render();


}


function render() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	updateLightPosition();
	normalMatrix = [
	modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2],
	modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2],
	modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2]
	];
	// console.log(text);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
	gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );
	for(i=0;i<Objects.length;i++){
		Objects[i].render();
	}
  // console.log(theta);

  requestAnimFrame( render );

}


function updateView(){
	lookAt(modelViewMatrix,[+EyeXir, -EyeYir, 0], [+AtXir.value, +AtYir, +AtZir], [0,1,0]);
    perspective(projectionMatrix, radians(+ARir.value), canvas.width / canvas.height, 0.1, 1000.0)//

    gl.uniformMatrix4fv(modelViewMatrixLoc, gl.FALSE, modelViewMatrix);

    gl.uniformMatrix4fv(projectionMatrixLoc, gl.FALSE, projectionMatrix);
}

function updateLightPosition(){

    // lightPosition = vec4(+LpXir.value,+LpYir.value,+LpZir.value, 1.0 );
    var speed = 0.001;
    lightPosition[0] = 2*Math.sin( (new Date).getTime() * speed ); 
    lightPosition[2] = Math.cos( (new Date).getTime() * speed ); 
}



