/* CHIP 8 / SUPER CHIP 8 Emulator in Javascript
 * author Loren Puchalla Fiore
 * version 2011-Oct-03
 */

// good sites for documentation are the CHIP8 wikipedia page(s) and
// http://chip8.com/ where you can get programs to test on the emulator

// currently only basic CHIP8, need to add SUPERCHIP8, CHIP8 HIRES, and
// MEGACHIP8

/*
Copyright (c) 2011 Loren Puchalla Fiore

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function CHIP8(screen, runBtn) {
    this.m_GameMemory = new Array(0xFFF);
    this.m_Registers = new Array(16);
    this.m_AddressI = 0;
    this.m_ProgramCounter = 0;
    this.m_Stack = new Array();
    this.m_Screen = screen;
    this.m_RunBtn = runBtn;
    this.timer = null;
}

CHIP8.prototype.loadProgram = function(filename) {
    var b = new BinFileReader(filename);
    for (var i = 0; i < b.getFileSize(); i++) {
        this.m_GameMemory[0x200 + i] = b.readByteAt(i);
    }
}

CHIP8.prototype.CPUReset = function() {
    // reset internal variables
    this.m_AddressI = 0;
    this.m_ProgramCounter = 0x200;
    for (var i = 0; i < 16; i++) {
        this.m_Registers[i] = 0;
    }

    // load in the game
    this.loadProgram("Maze.ch8");
}

CHIP8.prototype.run = function() {
    if (this.timer == null) {
	this.timer = setTimeout(this.CPUStep, 1);
	this.m_RunBtn.innerHTML = 'Pause';
    } else {
	clearInterval(this.timer);
	this.timer = null;
	this.m_RunBtn.innerHTML = 'Run';
    }
}

CHIP8.prototype.CPUStep = function() {
    while (true) {
        var opcode = this.getNextOpcode();
        this.decodeOpcode(opcode);
    }
}

// the following two functions are the core of the fetch and decode loop
CHIP8.prototype.getNextOpcode = function() {
    var opcode = 0;
    opcode = this.m_GameMemory[this.m_ProgramCounter];
    opcode = opcode << 8;
    opcode = opcode | this.m_GameMemory[this.m_ProgramCounter+1];
    this.m_ProgramCounter = this.m_ProgramCounter + 2;
    return opcode;
}


CHIP8.prototype.setPixel = function(x, y) {
    // TODO
}

CHIP8.prototype.clearPixel = function(x, y) {
    // TODO
}

CHIP8.prototype.playBeep = function() {
}

CHIP8.prototype.decodeOpcode = function(opcode) {
    // decode the opcode
    switch (opcode & 0xF000) {
    case 0x0000:
        switch (opcode) {
        case 0x00E0: this.opcode00E0(); break;
        case 0x00EE: this.opcode00EE(); break;
        default: this.opcode0NNN(opcode); break;
        }
        break;
    case 0x1000: this.opcode1NNN(opcode); break;
    case 0x2000: this.opcode2NNN(opcode); break;
    case 0x3000: this.opcode3XNN(opcode); break;
    case 0x4000: this.opcode4XNN(opcode); break;
    case 0x5000: this.opcode5XY0(opcode); break;
    case 0x6000: this.opcode6XNN(opcode); break;
    case 0x7000: this.opcode7XNN(opcode); break;
    case 0x8000:
        switch (opcode & 0x000F) {
        case 0x0000: this.opcode8XY0(opcode); break;
        case 0x0001: this.opcode8XY1(opcode); break;
        case 0x0002: this.opcode8XY2(opcode); break;
        case 0x0003: this.opcode8XY3(opcode); break;
        case 0x0004: this.opcode8XY4(opcode); break;
        case 0x0005: this.opcode8XY5(opcode); break;
        case 0x0006: this.opcode8XY6(opcode); break;
        case 0x0007: this.opcode8XY7(opcode); break;
        case 0x000E: this.opcode8XYE(opcode); break;
        }
        break;
    case 0x9000: this.opcode9XY0(opcode); break;
    case 0xA000: this.opcodeANNN(opcode); break;
    case 0xB000: this.opcodeBNNN(opcode); break;
    case 0xC000: this.opcodeCXNN(opcode); break;
    case 0xD000: this.opcodeDXYN(opcode); break;
    case 0xE000:
        switch (opcode & 0x00FF) {
        case 0x009E: this.opcodeEX9E(opcode); break;
        case 0x00A1: this.opcodeEXA1(opcode); break;
        }
        break;
    case 0xF000:
        switch (opcode & 0x00FF) {
        case 0x0007: this.opcodeFX07(opcode); break;
        case 0x000A: this.opcodeFX0A(opcode); break;
        case 0x0015: this.opcodeFX15(opcode); break;
        case 0x0018: this.opcodeFX18(opcode); break;
        case 0x001E: this.opcodeFX1E(opcode); break;
        case 0x0029: this.opcodeFX29(opcode); break;
        case 0x0033: this.opcodeFX33(opcode); break;
        case 0x0055: this.opcodeFX55(opcode); break;
        case 0x0065: this.opcodeFX65(opcode); break;
        }
        break;
    default: break;
    }
}

// IMPLEMENTATIONS OF EACH OPCODE ----------------------------------------------

// Calls RCA 1802 program at address NNN
CHIP8.prototype.opcode0NNN = function(opcode) {
    // TODO
}

// Clears the screen
CHIP8.prototype.opcode00E0 = function() {
    for (var y = 0; y < 32; y++) {
        for (var x = 0; x < 64; x++) {
            this.clearPixel(x, y);
        }
    }
}

// Returns from a subroutine
CHIP8.prototype.opcode00EE = function() {
    this.m_ProgramCounter = this.m_Stack.pop();
}

// Jumps to address NNN
CHIP8.prototype.opcode1NNN = function(opcode) {
    this.m_ProgramCounter = opcode & 0x0FFF;
}

// Calls subroutine at NNN
CHIP8.prototype.opcode2NNN = function(opcode) {
    this.m_Stack.push(this.m_ProgramCounter);
    this.m_ProgramCounter = opcode & 0x0FFF;
}

// Skips the next instruction if VX equals NN
CHIP8.prototype.opcode3XNN = function(opcode) {
    var NN = opcode & 0x00FF;
    var X = (opcode & 0x0F00) >> 8;
    if (this.m_Registers[X] == NN) {
        this.m_ProgramCounter += 2;
    }
}

// Skips the next instruction if VX doesn't equal NN
CHIP8.prototype.opcode4XNN = function(opcode) {
    var NN = opcode & 0x00FF;
    var X = (opcode & 0x0F00) >> 8;
    if (this.m_Registers[X] != NN) {
        this.m_ProgramCounter += 2;
    }
}

// Skips the next instruction is VX equals VY
CHIP8.prototype.opcode5XY0 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    if (this.m_Registers[X] == this.m_Registers[Y]) {
        m_ProgramCounter += 2;
    }
}

// Sets VX to NN
CHIP8.prototype.opcode6XNN = function(opcode) {
    var NN = opcode & 0x00FF;
    var X = (opcode & 0x0F00) >> 8;
    this.m_Registers[X] = NN;
}

// Adds NN to VX (no carry effects)
CHIP8.prototype.opcode7XNN = function(opcode) {
    var NN = opcode & 0x00FF;
    var X = (opcode & 0x0F00) >> 8;
    this.m_Registers[X] += NN;
}

// Sets VX to the value of VY
CHIP8.prototype.opcode8XY0 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    this.m_Registers[X] = this.m_Registers[Y];
}

// Sets VX to VX OR VY
CHIP8.prototype.opcode8XY1 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    this.m_Registers[X] = this.m_Registers[Y] | this.m_Registers[X];
}

// Sets VX to VX AND VY
CHIP8.prototype.opcode8XY2 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    this.m_Registers[X] = this.m_Registers[Y] & this.m_Registers[X];
}

// Sets VX to VX XOR VY
CHIP8.prototype.opcode8XY3 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    this.m_Registers[X] = this.m_Registers[Y] ^ this.m_Registers[X];
}

// Adds VY to VX. VF is set to 1 when there's a carry, and 0 when there isn't.
CHIP8.prototype.opcode8XY4 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    var result = this.m_Registers[X] + this.m_Registers[Y];
    if (result > 255) {
        this.m_Registers[0xF] = 1;
        result = result % 255;
    } else {
        this.m_Registers[0xF] = 0;
    }
    this.m_Registers[X] = result;
}

// VY is subtracted from VX. VF is set to 0 if there's a borrow, and 1 if not.
CHIP8.prototype.opcode8XY5 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    var result = this.m_Registers[X] - this.m_Registers[Y];
    if (result < 0) {
        this.m_Registers[0xF] = 0;
        result = result % 255;
    } else {
        this.m_Registers[0xF] = 1;
    }
    this.m_Registers[X] = result;
}

// Shifts VX right by one. VF is set to the value of the LSB of VX before shift
CHIP8.prototype.opcode8XY6 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    this.m_Registers[0xF] = this.m_Registers[X] & 0x1;
    this.m_Registers[X] >>= 1;
}

// Sets VX to VY minux VX. VF is 0 if there is a borrow, 1 otherwise.
CHIP8.prototype.opcode8XY7 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    var value = this.m_Registers[Y] - this.m_Registers[X];

    if (value < 0) {
        this.m_Registers[0xF] = 0;
    } else {
        this.m_Registers[0xF] = 1;
    }
    this.m_Registers[X] = value % 255;
}

// Shifts VX left by one. VF is set to the value of the MSB of VX before shift.
CHIP8.prototype.opcode8XYE = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    this.m_Registers[0xF] = this.m_Registers[X] >> 7;
    this.m_Registers[X] <<= 1;
}

// Skips the next instruction if VX doesn't equal VY.
CHIP8.prototype.opcode9XY0 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var Y = (opcode & 0x00F0) >> 4;
    if (this.m_Registers[X] != this.m_Registers[Y]) {
        this.m_ProgramCounter += 2;
    }
}

// Sets I to the address NNN.
CHIP8.prototype.opcodeANNN = function(opcode) {
    this.m_AddressI = opcode & 0x0FFF;
}

// Jumps to the address NNN plus V0.
CHIP8.prototype.opcodeBNNN = function(opcode) {
    var NNN = opcode & 0x0FFF;
    this.m_ProgramCounter = this.m_Registers[0] + NNN;
}

// Sets VX to a random number AND NN.
CHIP8.prototype.opcodeCXNN = function(opcode) {
    // TODO
}

// Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a
// height of N pixels. Each row of 8 pixels is read as bit-coded (with the
// most significant bit of each byte displayed on the left) starting from
// memory location I; I value doesn't change after the execution of
// this instruction. As described above, VF is set to 1 if any screen pixels
// are flipped from set to unset when the sprite is drawn, and to 0 if that
// doesn't happen.
CHIP8.prototype.opcodeDXYN = function(opcode) {
    // TODO
}

// Skips the next instruction if the key stored in VX is pressed.
CHIP8.prototype.opcodeEX9E = function(opcode) {
    // TODO
}

// Skips the next instruction if the key stored in VX isn't pressed.
CHIP8.prototype.opcodeEXA1 = function(opcode) {
    // TODO
}

// Sets VX to the value of the delay timer.
CHIP8.prototype.opcodeFX07 = function(opcode) {
    // TODO
}

// A key press is awaited, and then stored in VX.
CHIP8.prototype.opcodeFX0A = function(opcode) {
    // TODO
}

// Sets the delay timer to VX.
CHIP8.prototype.opcodeFX15 = function(opcode) {
    // TODO
}

// Sets the sound timer to VX.
CHIP8.prototype.opcodeFX18 = function(opcode) {
    // TODO
}

// Adds VX to I.
CHIP8.prototype.opcodeFX1E = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    this.m_AddressI += this.m_Registers[X];
}

// Sets I to the location of the sprite for the character in VX.
// Characters 0-F (in hexadecimal) are represented by a 4x5 font.
CHIP8.prototype.opcodeFX29 = function(opcode) {
    // TODO
}

// Stores the Binary-coded decimal representation of VX, with the most
// significant of three digits at the address in I, the middle digit at
// I plus 1, and the least significant digit at I plus 2.
CHIP8.prototype.opcodeFX33 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    var value = this.m_Registers[X];
    var ones = value % 10;
    var tens = (value - ones) % 100;
    var hundreds = (value - ones - tens) % 1000;

    this.m_GameMemory[this.m_AddressI] = hundreds;
    this.m_GameMemory[this.m_AddressI+1] = tens;
    this.m_GameMemory[this.m_AddressI+2] = ones;
}

// Stores V0 to VX in memory starting at address I.
CHIP8.prototype.opcodeFX55 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    for (var i = 0; i <= X; i++) {
        this.m_GameMemory[this.m_AddressI + i] = this.m_Registers[i];
    }
    this.m_AddressI += X + 1;
}

// Fills V0 to VX with values from memory starting at address I.
CHIP8.prototype.opcodeFX65 = function(opcode) {
    var X = (opcode & 0x0F00) >> 8;
    for (var i = 0; i <= X; i++) {
        this.m_Registers[i] = this.m_GameMemory[this.m_AddressI + i];
    }
    this.m_AddressI = X + 1;
}
