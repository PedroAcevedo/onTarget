"use strict";

function main() {
    loadImages([
        "assets/Floor01.png",
        "assets/shooter.png",
        "assets/Enemy1.png",
    ], render);
}

function render(textureImages) {
    // Get WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var angleElement = document.querySelector("#angle");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var angleNode = document.createTextNode("");

    // Add those text nodes where they need to go
    angleElement.appendChild(angleNode);

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);
    var program3 = webglUtils.createProgramFromScripts(gl, ["vertex-shader-sprite", "fragment-shader-3d"]);
    var player = new PrimitiveObject(gl, "vertex-shader-3d", "fragment-shader-3d");

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texLocation = gl.getAttribLocation(program, "a_texcoord");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");

    // look up where the vertex data needs to go.
    var positionLocation3 = gl.getAttribLocation(program3, "a_position");
    var texLocation3 = gl.getAttribLocation(program3, "a_texcoord");
    var frameLocation3 = gl.getUniformLocation(program3, "u_frame");

    // lookup uniforms
    var matrixLocation3 = gl.getUniformLocation(program3, "u_matrix");
    var textureLocation3 = gl.getUniformLocation(program3, "u_texture");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometryCube(gl);

    // Create a buffer to put colors in
    var texBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = texBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    // Put geometry data into buffer
    setTexcoordsCube(gl);

    player.setup(0);

    // Create a buffer to put positions in
    var positionBuffer3 = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer3);
    // Put geometry data into buffer
    //setRectangle(gl, 0, 0, textureImages[1].width, textureImages[1].height);
    setGeometryPlane(gl);

    var ySize = 56 / textureImages[2].width;
    var xSize = 60 / textureImages[2].height;

    // Create a buffer to put colors in
    var texBuffer3 = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = texBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer3);
    // Put geometry data into buffer
    createRectArray(gl, 0, 0, ySize, xSize);

    // create 2 textures
    textures = [];
    for (var ii = 0; ii < 3; ++ii) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImages[ii]);

        // add the texture to the array of textures.
        textures.push(texture);
    }

    function mouseMove(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        lastMouseDelta = [x - lastMousePosition[0],
        y - lastMousePosition[1]];
        lastMousePosition = [x, y];

        cameraAngleRadians = degToRad(360 - (0.5 * (lastMousePosition[0])) % 360);
        //drawScene();
    };

    canvas.onmousemove = function (event) { mouseMove(event); };

    var cameraAngleRadians = degToRad(0.5 * lastMouseDelta[0]);
    var fieldOfViewRadians = degToRad(60);

    window.addEventListener('keydown', (e) => {
        keys[e.keyCode] = true;
        if (keys['87'] || keys['83']) {
            const direction = keys['87'] ? 1 : -1;
            pz += cameraMovement[10] * speed * direction;
            //drawScene();
        }

        if (keys['65'] || keys['68']) {
            const direction = keys['65'] ? 1 : -1;
            px += cameraMovement[10] * speed * direction;
            //drawScene();
        }
        e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
        keys[e.keyCode] = false;
        e.preventDefault();
    });

    now *= 0.001;  // seconds;
    const deltaTime = now - then;
    then = now;

    drawScene();

    // Draw the scene.
    function drawScene() {


        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        gl.enable(gl.DEPTH_TEST);

        // Enable the depth buffer
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        // Turn on culling. By default backfacing triangles
        // will be culled.
        gl.enable(gl.CULL_FACE);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        // Turn on the color attribute
        gl.enableVertexAttribArray(texLocation);

        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);

        // Tell the attribute how to get data out of texBuffer (ARRAY_BUFFER)
        var size = 2;                 // 2 components per iteration
        var type = gl.FLOAT;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texLocation, size, type, normalize, stride, offset);


        var numFs = 5;
        var radius = 200;

        // Compute the projection matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 1;
        var zFar = 2000;
        projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

        // Compute a matrix for the camera
        cameraMatrix = m4.yRotation(0);
        cameraMatrix = m4.translate(cameraMatrix, 0, 0, 0);

        if (cameraMovement == undefined)
            cameraMovement = cameraMatrix;

        cameraMovement = m4.translate(cameraMatrix, px, py, pz);

        // Make a view matrix from the camera matrix
        viewMatrix = m4.inverse(cameraMatrix);

        // Compute a view projection matrix
        viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        viewProjectionMatrix = m4.yRotate(viewProjectionMatrix, cameraAngleRadians);

        viewProjectionMatrix = m4.translate(viewProjectionMatrix, px, py, pz);


        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);

        // compute a matrix for the Floor
        for (var ii = 0; ii < 20; ++ii) {

            var x = -50 + ii * 5;

            for (var jj = 0; jj < 20; ++jj) {

                var z = -50 + jj * 5;

                var matrix = m4.translate(viewProjectionMatrix, x, -5, z);

                //matrix = m4.yRotate(matrix, degToRad(45));
                matrix = m4.scale(matrix, 5, 5, 5);


                // Set the matrix.
                gl.uniformMatrix4fv(matrixLocation, false, matrix);

                // Tell the shader to use texture unit 0 for u_texture
                gl.uniform1i(textureLocation, 0);

                // Draw the geometry.
                var primitiveType = gl.TRIANGLES;
                var offset = 0;
                var count = 6 * 6;
                gl.drawArrays(primitiveType, offset, count);
            }

        }

        angleNode.nodeValue = radToDeg(cameraAngleRadians).toFixed(0);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program3);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, textures[2]);

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation3);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer3);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation3, size, type, normalize, stride, offset);

        // Turn on the color attribute
        gl.enableVertexAttribArray(texLocation3);

        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer3);

        //createRectArray(gl, 0, 0, ySize, xSize);
        // Tell the attribute how to get data out of texBuffer (ARRAY_BUFFER)
        var size = 2;                 // 2 components per iteration
        var type = gl.FLOAT;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texLocation3, size, type, normalize, stride, offset);


        let frame_x = Math.floor((new Date() * 0.006) % 3) * ySize;
        let frame_y = Math.floor((new Date() * 0.006) % 1) * xSize;

        gl.uniform2f(frameLocation3, frame_x, frame_y);

        var matrix = m4.translate(viewProjectionMatrix, 0, 1, 0);

        //matrix = m4.yRotate(matrix, degToRad(45));
        matrix = m4.scale(matrix, 5, 5, 5);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation3, false, matrix);

        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(textureLocation3, 2);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6 * 2;
        gl.drawArrays(primitiveType, offset, count);
        
        player.render(1, textures[1]);

        requestAnimationFrame(drawScene);
    }
}

let px = 0;
let py = 0;
let pz = 0;
let elev = 0;
let ang = 0;
let roll = 0;
const speed = 0.5;
const turnSpeed = 90;
var lastMouseDelta = [0, 0];
var lastMousePosition = [0, 0];
var cameraMatrix;
var viewMatrix;
var viewProjectionMatrix;
var projectionMatrix;
var cameraMovement;
let then = 0;
let now = new Date().getTime();
const keys = {};
var textures;

main();