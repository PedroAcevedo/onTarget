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
        this.texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        setTexcoordsCube(gl);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        setGeometryPlane(gl);
    }

    render(tex, texture) {
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

        var matrix = m4.identity();
        matrix = m4.translate(matrix, 0.0, -0.5, 0.0);
        matrix = m4.yRotate(matrix, degToRad(180));

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



}