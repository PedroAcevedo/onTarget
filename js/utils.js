"use strict";

// Fill the buffer with the values that define a cube 'Tile'.
function setGeometryCube(gl) {
    var positions = new Float32Array([
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates to a Cube.
function setTexcoordsCube(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            // top rung front
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            // middle rung front
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            // left column back
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,

            // top rung back
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,

            // middle rung back
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,

            // top
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,

            // top rung right
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,

            // under top rung
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,

            // between top rung and middle
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // top of middle rung
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // right of middle rung
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // bottom of middle rung.
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,

            // right of bottom
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // bottom
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,

            // left side
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0]),
        gl.STATIC_DRAW);
}

// Fill the buffer with the values that define a plane.
function setGeometryPlane(gl) {
    var positions = new Float32Array(
        [
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
        ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates for a plane.
function setTexcoordsPlane(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
            [
                0, 0,
                1, 0,
                0, 1,
                0, 1,
                1, 0,
                1, 1,
            ]),
        gl.STATIC_DRAW);
}

function createRectArray(gl, x = 0, y = 0, w = 1, h = 1) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            x, y,
            x + w, y,
            x, y + h,
            x, y + h,
            x + w, y,
            x + w, y + h
        ]),
        gl.STATIC_DRAW);
}

// Fill the buffer with the values that define a cube 'Tile'.
function setGeometryPiramid(gl) {
    var positions = new Float32Array([

        //Bottom Face
        0.0, 0.0, 0.0,
        0.0, 0.0, -1.0,
        1.0, 0.0, -1.0,
        0.0, 0.0, 0.0,
        1.0, 0.0, -1.0,
        1.0, 0.0, 0.0,

        //Front Face
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.5, 1.0, -0.5,

        //Right Face
        1.0, 0.0, 0.0,
        1.0, 0.0, -1.0,
        0.5, 1.0, -0.5,

        //Back Face
        1.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.5, 1.0, -0.5,

        //Left Face
        0.0, 0.0, -1.0,
        0.0, 0.0, 0.0,
        0.5, 1.0, -0.5,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates to a Cube.
function setTexcoordsPiramid(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,

            0.5, 0.0, 0.0,
            0.5, 0.0, 0.0,
            0.5, 0.0, 0.0,

            0.0, 5.0, 0.0,
            0.0, 5.0, 0.0,
            0.0, 5.0, 0.0,

            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,]),
        gl.STATIC_DRAW);
}


// Load a asset texture
function loadImage(url, callback) {
    var image = new Image();
    image.src = url;
    image.onload = callback;
    return image;
}

// Import game textures
function loadImages(urls, callback) {
    var textureImages = [];
    var imagesToLoad = urls.length;

    // Called each time an image finished loading.
    var onImageLoad = function () {
        --imagesToLoad;
        // If all the images are loaded call the callback.
        if (imagesToLoad == 0) {
            callback(textureImages);
        }
    };

    for (var ii = 0; ii < imagesToLoad; ++ii) {
        var image = loadImage(urls[ii], onImageLoad);
        textureImages.push(image);
    }

}

function currentTexture(gl, i) {

    switch (i) {
        case 0:
            return gl.TEXTURE0;
        case 1:
            return gl.TEXTURE1;
        case 2:
            return gl.TEXTURE2;
        case 3:
            return gl.TEXTURE3;
        case 4:
            return gl.TEXTURE4;
        case 5:
            return gl.TEXTURE5;
        case 6:
            return gl.TEXTURE6;
        default:
            return gl.TEXTURE0;
    }

}

function radToDeg(r) {
    return r * 180 / Math.PI;
}


function degToRad(d) {
    return d * Math.PI / 180;
}

class Point {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
}

function playSound(pathToFile) {
    var audio = new Audio(pathToFile);
    audio.play();
}

function getRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function normalize(v) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
        return [v[0] / length, v[1] / length, v[2] / length];
    } else {
        return [0, 0, 0];
    }
}

function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]];
}

function subtractVectors(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}