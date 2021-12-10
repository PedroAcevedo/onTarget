"use strict";

function main() {
    // load before rendering
    backgroundMusic = tracks.map((e) => {
        var track = new Audio("assets/sound/background/"+e+".mp3");
        track.loop = true;
        return track;
    });
    enemyDyingSound = new Audio("assets/sound/death sound.mp3");

    loadImages([
        "assets/Floor01.png",
        "assets/shooter.png",
        "assets/Enemy1.png",
        "assets/shoot-fire.png",
        "assets/otherGun.png",
        "assets/otherGun1.png",
        "assets/wall.png",
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

    // create n textures
    textures = [];
    for (var ii = 0; ii < numberOfTextures; ++ii) {
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


    // setup GLSL program
    var floor = new PrimitiveObject(gl, "vertex-shader-3d", "fragment-shader-3d");
    var wall = new PrimitiveObject(gl, "vertex-shader-3d", "fragment-shader-3d");
    var player = new PrimitiveObject(gl, "vertex-shader-3d", "fragment-shader-3d");
    var enemy01 = new Enemy(gl, "vertex-shader-sprite", "fragment-shader-enemy", textures[2], textureImages[2], 56, 60);

    floor.setup(1);
    wall.setup(1);
    player.setup(0);
    enemy01.setup(0, 12);

    function mouseMove(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        lastMouseDelta = [x - lastMousePosition[0],
        y - lastMousePosition[1]];
        lastMousePosition = [x, y];

        cameraAngleRadians = degToRad(360 - (0.5 * (lastMousePosition[0])) % 360);
    };

    function shoot(e) {
        var bullet = new Bullet(gl, "vertex-shader-3d", "fragment-shader-3d");
        bullet.setup(px, py, pz);
        shoots.push(bullet);
        try {
            playSound("assets/sound/guns/"+soundsWeapons[currentGunSelected]+".mp3");
        } catch (error) {
            console.log(error)
        }

    }

    canvas.onmousemove = function (event) { mouseMove(event); };
    canvas.onclick = function (event) { shoot(event); };

    var cameraAngleRadians = degToRad(0.5 * lastMouseDelta[0]);
    var fieldOfViewRadians = degToRad(30);

    window.addEventListener('keydown', (e) => {
        keys[e.keyCode] = true;

        let angle = radToDeg(cameraAngleRadians).toFixed(0);

        if (keys['87'] || keys['83']) {
            let direction = keys['83'] ? 1 : -1;

            px += Math.cos((angle / 90 - 1) * Math.PI / 2) * speed * direction;
            pz += Math.sin((angle / 90 - 1) * Math.PI / 2) * speed * direction;

            //drawScene();
        }

        if (keys['65'] || keys['68']) {
            let direction = keys['68'] ? -1 : 1;

            px += Math.cos(angle * Math.PI / 180) * speed * direction;
            pz += Math.sin(angle * Math.PI / 180) * speed * direction;
            //drawScene();
        }
        // music
        if (!isPlaying && keys['77']) {
            isPlaying = true;
            backgroundMusic[currentTrackSelected].play();
            console.log("playing: " + tracks[currentTrackSelected]);
        } else if (keys['77']) {
            isPlaying = false;
            backgroundMusic[currentTrackSelected].pause();
        }
        // next track
        if (isPlaying && keys['78']) {
            backgroundMusic[currentTrackSelected].pause();
            backgroundMusic[currentTrackSelected].currentTime = 0.0;
            currentTrackSelected = (currentTrackSelected + 1) % tracks.length;
            backgroundMusic[currentTrackSelected].play();
            console.log("playing: " + tracks[currentTrackSelected]);
        }
        // show/hide controls
        if (keys['72']) {
            var x = document.getElementById('controls');
            if (x.style.display === 'none') {
                x.style.display = 'block';
            } else {
                x.style.display = 'none';
            }
        }
        // change weapon
        if (keys['49'] || keys['50'] || keys['51']){
            currentGunSelected = e.key -1;
        }

        e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
        keys[e.keyCode] = false;
        e.preventDefault();
    });

    drawScene();

    walls.push(new CollideBox(-50, -55, 50, -50));
    walls.push(new CollideBox(-50, 50, 50, 55));
    walls.push(new CollideBox(-55, -50, -50, 50));
    walls.push(new CollideBox(50, -50, 55, 50));

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

        // compute a matrix for the Floor
        for (var ii = 0; ii < 20; ++ii) {

            var x = -50 + ii * 5;

            for (var jj = 0; jj < 20; ++jj) {

                var z = -50 + jj * 5;

                var matrix = m4.translate(viewProjectionMatrix, x, -5, z);

                //matrix = m4.yRotate(matrix, degToRad(45));
                matrix = m4.scale(matrix, 5, 5, 5);

                floor.render(0, textures[0], matrix, 6 * 6);


            }

        }

        //Walls
        let xzLimits = [-55, 50]

        for (var ii = 0; ii < 4; ++ii) {

            for (var jj = 0; jj < 20; ++jj) {

                var around = -50 + jj * 5;

                var z = 0;
                var x = 0;

                if (ii > 1) {

                    z = around;
                    x = xzLimits[ii - 2];

                } else {

                    x = around;
                    z = xzLimits[ii];
                }

                for (var kk = 0; kk < 5; ++kk) {

                    var y = -5 + kk * 5;

                    var matrix = m4.translate(viewProjectionMatrix, x, y, z);

                    //matrix = m4.yRotate(matrix, degToRad(45));
                    matrix = m4.scale(matrix, 5, 5, 5);

                    wall.render(6, textures[6], matrix, 6 * 6);


                }

            }

        }


        shoots.forEach(bullet => {
            if (bullet.enabled) {
                bullet.render(3, textures[3], cameraAngleRadians);

                if (enemy01.health > 0) {
                    bullet.collide(enemy01);
                }

                for (let w = 0; w < walls.length; ++w) {
                    if (bullet.collide(walls[w])) break;
                }

            }


            //console.log("Hello bullte:" + Object.entries(bullet));
        });
        if (shoots.length > 0 && (Math.abs(shoots[0].initialPositionZ) > bulletMaxDrawDistance
            || Math.abs(shoots[0].initialPositionX) > bulletMaxDrawDistance)) {
            shoots.splice(0, 1);
        }

        angleNode.nodeValue = radToDeg(cameraAngleRadians).toFixed(0);

        if (enemy01.health > 0) {
            enemy01.render(2);
        }else if (!enemyDied){
            enemyDyingSound.play();
            enemyDied = true;
        }



        var matrix = m4.identity();
        matrix = m4.translate(matrix, 0.0, -0.5, 0.0);
        matrix = m4.yRotate(matrix, degToRad(180));

        player.render(1, textures[[1,4,5][currentGunSelected]], matrix, 6 * 2);

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
var cameraAngleRadians;
let then = 0;
let now = new Date().getTime();
const keys = {};
var textures;
var shoots = [];
let bulletMaxDrawDistance = 60;
var backgroundMusic;
let isPlaying = false;
var tracks = [
    "Doom OST E1M3 Dark Halls",
    "Everyone_is_so_alive",
    "Doom OST E1M5 Suspense",
    "Big_Crumble"]
var currentTrackSelected = Math.floor(Math.random()*tracks.length);
var soundsWeapons = [
    "M1-Garand-single",
    "M4A1-Single",
    "normal-shotgun-single"
]
var currentGunSelected = 0;
var numberOfTextures = 7;
var walls = [];
var enemyDied = false;
var enemyDyingSound;

main();