const typeSizes = {
  "undefined": () => 0,
  "boolean": () => 4,
  "number": () => 8,
  "string": item => 2 * item.length,
  "object": item => !item ? 0 : Object
    .keys(item)
    .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
};

let validRegisters = [
	"acc",
	"dcc",
	"x1",
	"x2",
	"x3",
	"x4",
	"x5",
	"x6",
	"x7",
	"x8"
];

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

window.acc = null;
window.dcc = null;
window.x1 = null;
window.x2 = null;
window.x3 = null;
window.x4 = null;

window.code = null;
window.codeLength = 0;
window.codePointer = 0;

let accd = document.getElementById("acc");
let dccd = document.getElementById("dcc");
let x1d = document.getElementById("x1");
let x2d = document.getElementById("x2");
let x3d = document.getElementById("x3");
let x4d = document.getElementById("x4");
let instructiond = document.getElementById("instruction");

function execute() {
	window.code = document.getElementById("code").value;
	window.codeLength = window.code.split("\n").length;
}

function next() {
	if(window.codePointer < window.codeLength) {
		let instruction = window.code.split("\n")[window.codePointer];
		instructiond.innerText = instruction.replace("\n", "");
		parse(instruction);
		updateValueDisplay();
		window.codePointer++;
	} else {
		window.codePointer = 0;
	}
}

function updateValueDisplay() {
        accd.innerText = window.acc;
        dccd.innerText = window.dcc;
        x1d.innerText = window.x1;
        x2d.innerText = window.x2;
        x3d.innerText = window.x3;
        x4d.innerText = window.x4;
}

function parse(stmt) {
	if(stmt.startsWith("mov")) {
		let parsedMov = stmt.replace("mov ", "").split(",").map(el => el.replace(" ", ""));
		writeToRegister(parsedMov[0], parsedMov[1]);
	} else if (stmt.startsWith("input")) {
		let input = prompt("Input: ");

		if(getValueSize(input) < 256) {
			x1 = input;
		} else {
			console.log("Too much data in 256 byte register!");
		}
	}
}

function writeToRegister(target, read) {
	if(validRegisters.includes(target) && validRegisters.includes(read)) {
		window[target] = window[read];
	} else if(validRegisters.includes(target)) {
		if(getValueSize(read) > 256) {
			console.log("Too much data in 256-byte register");
		}
		let readParsed = read.toString()
		readParsed = replaceAll(readParsed, "'", "")
		readParsed = replaceAll(readParsed, "\"", "");
		window[target] = readParsed;
	} else {
		console.log("Invalid I/O operation");
	}

	return "";
}

function getValueSize(value) {
	return typeSizes[typeof value](value);
}
