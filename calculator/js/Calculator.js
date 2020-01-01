var OPERATIONS = {
	ADDITION : 0,
	SUB : 1,
	MUL : 2,
	DIV : 3,
	MOD : 4,
	Percentage : 5,
	AC : 0x15,
	EQ : 0x10,// Flag
};

var OPERATIONSMAP = {
	0 : "+",
	1 : "-",
	2 : "x",
	3 : "÷",
	4 : "MOD",
	5 : "%"
};
var MemoryOpMap = {
	"M+" : 0,
	"M-" : 1,
	"MR" : 3,
	"MC" : 4
};
function Calculator() {

	var result = 0, number = 0, operation = OPERATIONS.AC, equation = "", numMemory = 0;

	this.setNumMemory = function(num, memoryOp) {
		switch (MemoryOpMap[memoryOp]) {
		case MemoryOpMap["M+"]:
			numMemory += num;
			break;
		case MemoryOpMap["M-"]:
			numMemory -= num;
			break;
		case MemoryOpMap.MR:

			numMemory = parseFloat(MySliceNum(numMemory + ""));
			return numMemory;
		case MemoryOpMap.MC:
			numMemory = 0;
			break;

		default:
			break;
		}
	};

	var correctNum = function(num) {
		var numUpdated = {
			myNum : num,
			e : 0
		};
		num += "";
		var pos = num.search(/[.]/g);
		if (pos === -1) {
			return numUpdated;
		}
		numUpdated.e = num.length - pos - 1;
		num = num.slice(0, pos) + num.slice(pos + 1);
		numUpdated.myNum = parseFloat(num);
		return numUpdated;
	};

	var NumDot = function(num) {
		if (num.e === 0) {
			return num.myNum;
		} else if (num.e > 0) {
			num.myNum += "";
			// ////
			var minus = false;
			if (num.myNum.charAt(0) === '-') {
				minus = true;
				num.myNum = num.myNum.slice(1);
			}
			// ///
			var pos = num.myNum.search(/[.]/g);
			if (pos === -1) {
				num.myNum += ".";
				pos = num.myNum.length - 1;// change + to -
			}
			while (num.e) {
				if (pos > 0) {
					var ch = num.myNum.charAt(pos - 1);
					num.myNum = num.myNum.slice(0, pos - 1) + "." + ch
							+ num.myNum.slice(pos + 1);
					pos--;

				} else {
					num.myNum = ".0" + num.myNum.slice(1);
					pos--;
				}

				num.e--;
			}
			if (minus) {
				num.myNum = "-" + num.myNum;
			}
			if (num.myNum == "-0") {
				num.myNum = "0";
			}
		} else {

			num.myNum += "";
			// ///
			var minus = false;
			if (num.myNum.charAt(0) === '-') {
				minus = true;
				num.myNum = num.myNum.slice(1);
			}
			// //
			var pos = num.myNum.search(/[.]/g);
			if (pos === -1) {
				num.myNum += ".";
				pos = num.myNum.length - 1;
			}
			while (num.e) {
				if (pos < num.myNum.length - 1) {
					var ch = num.myNum.charAt(pos + 1);
					num.myNum = num.myNum.slice(0, pos) + ch + "."
							+ num.myNum.slice(pos + 2);

					pos++;

				} else {
					num.myNum = num.myNum.slice(0, num.myNum.length - 1) + "0.";
					pos++;
				}
				num.e++;
			}
			if (minus) {
				num.myNum = "-" + num.myNum;
			}
			if (num.myNum == "-0") {
				num.myNum = "0";
			}
		}
		return parseFloat(num.myNum);
	};

	var MySliceNum = function(num) {
		num += "";
		var pos = num.search(/[.]/g);
		if (pos === num.length - 1) {
			num = num.slice(0, num.length - 1);
		}
		if (pos === -1) {
			if (num.length > 12) {
				if (num.search("-") === -1) {
					num = "999999999999";
				} else {
					num = "-99999999999";
				}
			}
		} else {
			if (pos <= 11) {
				num = num.slice(0, 13);
				while (num.charAt(num.length - 1) === "0") {
					num = num.slice(0, num.length - 1);
				}
				if (num.charAt(num.length - 1) === ".") {
					num = num.slice(0, num.length - 1);
				}
			} else {
				var boolNeg = true;
				if (num.search("-") === -1)
					boolNeg = false;
				if (boolNeg) {
					if (pos > 12) {
						num = "-999999999999";
					} else {
						num = num.slice(0, pos);
					}
				} else {
					if (pos > 13) {
						num = "999999999999";
					} else {
						num = num.slice(0, pos);
					}
				}
			}
		}
		if (num == '-0') {
			num = "0";
		}
		return num;
	};
	var ToFixed = function(num) {
		num += "";
		var posE = num.search("e");
		if (posE === -1) {
			num = MySliceNum(num);
			return num;
		}
		// ///
		var minus = false;
		if (num.charAt(0) === '-') {
			posE--;
			minus = true;
			num = num.slice(1);
		}
		// //
		var countE = 0, boolNeg = false;

		if (num.charAt(posE + 1) === "-") {
			countE = num.slice(posE + 2);
			boolNeg = true;
		} else {
			countE = num.slice(posE + 2);
			boolNeg = false;
		}

		num = num.slice(0, posE);
		var pos = num.search(/[.]/g);
		if (pos === -1) {
			num += ".0";
		}
		pos = num.search(/[.]/g);
		countE = parseInt(countE);
		while (countE >= 1) {
			if (boolNeg) {
				if (pos > 0) {
					var ch = num.charAt(pos - 1);
					num = num.slice(0, pos - 1) + "." + ch + num.slice(pos + 1);

					pos--;

				} else {
					num = ".0" + num.slice(1);
					pos--;
				}
			} else {
				if (pos < num.length - 1) {
					var ch = num.charAt(pos + 1);
					num = num.slice(0, pos) + ch + "." + num.slice(pos + 2);

					pos++;

				} else {
					num = num.slice(0, num.length - 1) + "0.";
					pos++;
				}
			}
			countE--;
		}
		if (num.charAt(0) === ".") {
			num = "0" + num;
		}
		if (num.charAt(num.length - 1) === ".") {
			num.slice(0, num.length - 1);
		}
		if (minus) {
			num = "-" + num;
		}
		if (num == "-0") {
			num = "0";
		}
		num = MySliceNum(num);
		return num;
	};
	this.GetResult = function() {
		var num = ToFixed(result);
		return num + "";
	};

	this.GetEquation = function() {
		return equation;
	};
	this.SetNum = function(input) {
		if ((operation & OPERATIONS.EQ) === OPERATIONS.EQ) {
			result = input;
		} else {
			number = input;
		}
	};

	this.SetOp = function(input) {

		if (input === OPERATIONS.Percentage) {// Percentage
			if ((operation & OPERATIONS.EQ) !== OPERATIONS.EQ) {
				number = number * result / 100;
				operation = OPERATIONS.EQ | operation;
				res();
			} else {
				number = 0;
				result = 0;
			}
			
			return;
		}

		if (input === OPERATIONS.AC) {
			result = 0;
			number = 0;
			operation = OPERATIONS.AC;
			equation = "";

		} else {
			if (input === OPERATIONS.EQ) {
				operation = OPERATIONS.EQ | operation;

				res();
			} else {
				if ((operation & OPERATIONS.EQ) !== OPERATIONS.EQ) {
					res();
				}
				operation = input;
			}
		}
	};
	var res = function() {
		if (OPERATIONSMAP[operation & 0x0F] !== undefined) {
			equation = ToFixed(result).toString() + " "
					+ ToFixed(number).toString() + " "
					+ OPERATIONSMAP[operation & 0x0F];
		}
		switch (operation & 0x0F) {
		case OPERATIONS.ADDITION:
			var num1 = correctNum(ToFixed(result)), num2 = correctNum(ToFixed(number));
			while (num1.e < num2.e) {
				num1.e++;
				num1.myNum *= 10;
			}
			while (num2.e < num1.e) {
				num2.e++;
				num2.myNum *= 10;
			}
			num1.myNum = parseInt(num1.myNum) + parseInt(num2.myNum) + "";

			result = NumDot(num1);
			break;
		case OPERATIONS.SUB:
			var num1 = correctNum(ToFixed(result)), num2 = correctNum(ToFixed(number));
			while (num1.e < num2.e) {
				num1.e++;
				num1.myNum *= 10;
			}
			while (num2.e < num1.e) {
				num2.e++;
				num2.myNum *= 10;
			}
			num1.myNum = num1.myNum - num2.myNum;

			result = NumDot(num1);
			break;
		case OPERATIONS.MUL:
			var num1 = correctNum(ToFixed(result)), num2 = correctNum(ToFixed(number));
			num1.myNum = num1.myNum * num2.myNum;
			num1.e = num1.e + num2.e;
			result = NumDot(num1);
			break;
		case OPERATIONS.DIV:
			var num1 = correctNum(ToFixed(result)), num2 = correctNum(ToFixed(number));
			num1.myNum = num1.myNum / num2.myNum;
			num1.e = num1.e - num2.e;
			result = NumDot(num1);
			if (number === 0) {
				result = 0;
			}
			break;
		case OPERATIONS.MOD:
			result = result % number;
			break;

		default:
			break;
		}
	};
}
