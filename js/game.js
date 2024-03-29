class PrimitiveObject {

    constructor(gl, vs, fs) {

        this.gl = gl;
        this.program = webglUtils.createProgramFromScripts(gl, [vs, fs]);

    }

    setup(type) {

        let gl = this.gl;

        gl.useProgram(this.program);

        // look up where the vertex data needs to go.
        this.posLoc = gl.getAttribLocation(this.program, "a_position");
        this.texLoc = gl.getAttribLocation(this.program, "a_texcoord");

        // lookup uniforms
        this.matrixLoc = gl.getUniformLocation(this.program, "u_matrix");
        this.textureLoc = gl.getUniformLocation(this.program, "u_texture");


        switch (type) {
            case 0:
                this.bindPlayer(gl);
                break;
            case 1:
                this.bindTile(gl);
                break;
        }


        gl.useProgram(null);

    }

    bindPlayer(gl) {
        this.texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        setTexcoordsPlane(gl);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        setGeometryPlane(gl);
    }

    bindTile(gl) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        setGeometryCube(gl);

        this.texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        setTexcoordsCube(gl);
    }

    render(tex, texture, matrix, count) {
        let gl = this.gl;

        gl.useProgram(this.program);

        gl.activeTexture(currentTexture(gl, tex));
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Turn on the position attribute
        gl.enableVertexAttribArray(this.posLoc);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.posLoc, size, type, normalize, stride, offset);

        // Turn on the color attribute
        gl.enableVertexAttribArray(this.texLoc);

        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);

        // Tell the attribute how to get data out of texBuffer (ARRAY_BUFFER)
        var size = 2;                 // 2 components per iteration
        var type = gl.FLOAT;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.texLoc, size, type, normalize, stride, offset);

        // Set the matrix.
        gl.uniformMatrix4fv(this.matrixLoc, false, matrix);

        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(this.textureLoc, tex);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        gl.drawArrays(primitiveType, offset, count);

        gl.useProgram(null);

    }


}

class Bullet {
    constructor(gl, vs, fs) {
        this.gl = gl;
        this.program = webglUtils.createProgramFromScripts(gl, [vs, fs]);
        this.speed = 0.06;
        this.initialPositionZ = 0;
        this.initialPositionX = 0;
        this.initialAngle = -1;
        this.bulletAngle = 0;
        this.enabled = true;
    }

    setup(px, py, pz) {

        let gl = this.gl;

        gl.useProgram(this.program);

        // look up where the vertex data needs to go.
        this.posLoc = gl.getAttribLocation(this.program, "a_position");
        this.texLoc = gl.getAttribLocation(this.program, "a_texcoord");

        // lookup uniforms
        this.matrixLoc = gl.getUniformLocation(this.program, "u_matrix");
        this.textureLoc = gl.getUniformLocation(this.program, "u_texture");

        this.texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        setTexcoordsCube(gl);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        setGeometryCube(gl);

        this.positionMatrix = [px, py, pz];

        this.collisionCircle = new SphereCollider(-this.positionMatrix[0], -this.positionMatrix[1] - 0.3, -this.positionMatrix[2], 0.3);

        gl.useProgram(null);

    }

    shootMovement() {

        //console.log(this.initialAngle);

        if (this.initialAngle == 90) {
            this.initialPositionX += speed;
            this.bulletAngle = 35;
        } else {
            if (this.initialAngle == 270) {
                this.initialPositionX -= speed;
                this.bulletAngle = -90;
            } else {
                if (this.initialAngle == 360 || this.initialAngle == 361) {
                    this.initialPositionZ -= speed;
                } else {
                    if (this.initialAngle == 180) {
                        this.initialPositionZ += speed;
                    } else {
                        if (this.initialAngle > 0 && this.initialAngle < 90) {

                            this.initialPositionX += speed * (this.initialAngle / 90);
                            this.initialPositionZ -= speed * (1 - (this.initialAngle / 90));

                        } else {
                            if (this.initialAngle > 90 && this.initialAngle < 180) {

                                this.initialPositionZ += speed * ((this.initialAngle - 90) / 90);
                                this.initialPositionX += speed * (1 - ((this.initialAngle - 90) / 90));
                            } else {
                                if (this.initialAngle > 180 && this.initialAngle < 270) {

                                    this.initialPositionX -= speed * ((this.initialAngle - 180) / 90);
                                    this.initialPositionZ += speed * (1 - ((this.initialAngle - 180) / 90));
                                } else {
                                    if (this.initialAngle > 270 && this.initialAngle < 360) {

                                        this.initialPositionX -= speed * (1 - ((this.initialAngle - 270) / 90));
                                        this.initialPositionZ -= speed * ((this.initialAngle - 270) / 90);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    render(tex, texture, angle) {
        let gl = this.gl;

        if (this.initialAngle == -1) {
            console.log("Assign angle --> " + angle);
            this.initialAngle = radToDeg(angle).toFixed(0);

            for (let i = 0; i < 5; i++)
                this.shootMovement();

        }

        gl.useProgram(this.program);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Turn on the position attribute
        gl.enableVertexAttribArray(this.posLoc);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.posLoc, size, type, normalize, stride, offset);

        // Turn on the color attribute
        gl.enableVertexAttribArray(this.texLoc);

        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);

        // Tell the attribute how to get data out of texBuffer (ARRAY_BUFFER)
        var size = 2;                 // 2 components per iteration
        var type = gl.FLOAT;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.texLoc, size, type, normalize, stride, offset);

        var matrix = m4.identity(0, 0, 0);

        var matrix = m4.multiply(viewProjectionMatrix, matrix);
        matrix = m4.translate(matrix, -this.positionMatrix[0], -this.positionMatrix[1] - 0.3, -this.positionMatrix[2]);

        //matrix = m4.yRotate(matrix, cameraAngleRadians);

        this.shootMovement();

        //matrix = m4.yRotate(matrix, degToRad(45));
        matrix = m4.translate(matrix, this.initialPositionX, 0, this.initialPositionZ);
        //matrix = m4.yRotate(matrix, this.initialAngle);
        //matrix = m4.xRotate(matrix, degToRad(-90));
        matrix = m4.scale(matrix, 0.1, 0.1, 0.1);

        // Set the matrix.
        gl.uniformMatrix4fv(this.matrixLoc, false, matrix);

        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(this.textureLoc, tex);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6 * 6;
        gl.drawArrays(primitiveType, offset, count);
        gl.useProgram(null);

        this.collisionCircle.update(this.initialPositionX, this.initialPositionZ);

    }

    collideSound() {
        this.enabled = false;

        try {
            playSound("assets/sound/bullet-collision-sound.mp3");
        } catch (error) {
            console.log(error)
        }
    }


    collide(collideObject) {

        if (this.collisionCircle.circleVsObject(collideObject)) {
            this.collideSound();
            return true;
        }

        return false;
    }
}

class Enemy {
    constructor(gl, vs, fs, texture, textureImage, width, height) {
        this.gl = gl;
        this.program = webglUtils.createProgramFromScripts(gl, [vs, fs]);
        this.texture = texture;
        this.ux = width / textureImage.width;
        this.uy = height / textureImage.height;
        this.health = 5;
        this.damage = 0;
    }

    setup(px, pz) {

        let gl = this.gl;

        gl.useProgram(this.program);

        // look up where the vertex data needs to go.
        this.posLoc = gl.getAttribLocation(this.program, "a_position");
        this.texLoc = gl.getAttribLocation(this.program, "a_texcoord");
        this.frameLoc = gl.getUniformLocation(this.program, "u_frame");

        // lookup uniforms
        this.matrixLoc = gl.getUniformLocation(this.program, "u_matrix");
        this.textureLoc = gl.getUniformLocation(this.program, "u_texture");
        this.damageLoc = gl.getUniformLocation(this.program, "u_damage");

        // Create a buffer to put positions in
        this.positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // Put geometry data into buffer
        setGeometryPlane(gl);

        // Create a buffer to put colors in
        this.texBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = texBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        // Put geometry data into buffer
        createRectArray(gl, 0, 0, this.ux, this.uy);

        gl.useProgram(null);

        this.position = [px, -0.2, pz];

        this.boundingBox = new CollideBox(px - 1, pz - 1, px + 1, pz + 1);
    }

    render(tex) {
        let gl = this.gl;

        gl.useProgram(this.program);

        gl.activeTexture(currentTexture(gl, tex));
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Turn on the position attribute
        gl.enableVertexAttribArray(this.posLoc);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.posLoc, size, type, normalize, stride, offset);

        // Turn on the color attribute
        gl.enableVertexAttribArray(this.texLoc);

        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);

        //createRectArray(gl, 0, 0, ySize, xSize);
        // Tell the attribute how to get data out of texBuffer (ARRAY_BUFFER)
        var size = 2;                 // 2 components per iteration
        var type = gl.FLOAT;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.texLoc, size, type, normalize, stride, offset);


        let frame_x = Math.floor((new Date() * 0.006) % 3) * this.ux;
        let frame_y = Math.floor((new Date() * 0.006) % 1) * this.uy;

        gl.uniform2f(this.frameLoc, frame_x, frame_y);
        gl.uniform1f(this.damageLoc, this.damage);

        var matrix = m4.translate(viewProjectionMatrix, this.position[0], this.position[1], this.position[2]);

        //matrix = m4.yRotate(matrix, degToRad(45));
        matrix = m4.scale(matrix, 5, 5, 5);

        // Set the matrix.
        gl.uniformMatrix4fv(this.matrixLoc, false, matrix);

        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(this.textureLoc, tex);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6 * 2;
        gl.drawArrays(primitiveType, offset, count);

        gl.useProgram(null);

    }

    isColliding(x, z) {

        if (this.boundingBox.isColliding(x, z)) {

            this.damage = 1;
            this.health -= 1;

            setTimeout(() => this.damage = 0, 200);

            if (this.health == 0) {
                console.log("I died");
                enemyDyingSound.play();
            }

            return true;
        }

        return false;
    }
}

class SphereCollider {

    constructor(x, y, z, r) {

        this.center = new Coordinate(x, y, z);
        this.initialPositionX = x;
        this.initialPositionZ = z;
        this.radius = r;
    }

    update(x, z) {
        this.center.x = this.initialPositionX + x;
        this.center.z = this.initialPositionZ + z;
    }

    circleVsObject(collideObject) {

        if (collideObject.isColliding(this.center.x - this.radius, this.center.z - this.radius)) {
            return true;
        }

        return false;
    }

}

class Coordinate {

    constructor(x, y, z) {

        this.x = x;
        this.y = y;
        this.z = z;
    }

}

class CollideBox {

    constructor(x1, z1, x2, z2) {

        this.xMin = x1;
        this.zMin = z1;
        this.xMax = x2;
        this.zMax = z2;
    }

    isColliding(x, z) {
        if (x >= this.xMin && x <= this.xMax && z >= this.zMin && z <= this.zMax) {
            return true
        }
        return false;
    }

    update(x1, z1, x2, z2) {

        this.xMin = x1;
        this.zMin = z1;
        this.xMax = x2;
        this.zMax = z2;
    }

    objectVsObject(colliderObject){
        if(colliderObject.isColliding(this.xMin, this.zMin) || colliderObject.isColliding(this.xMax, this.zMax)){
            return true;
        }
        return false;
    }

}