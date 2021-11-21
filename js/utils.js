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