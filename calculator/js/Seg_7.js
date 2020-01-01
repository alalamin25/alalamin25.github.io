
function Seq_7(c) {
	var number = "0";
	
	var ctx = c.getContext("2d");
	
	var width = c.width;
	var height = c.height;
	var radius = 20;
	ctx.fillStyle = "gray";
	//ctx.fillRect(0, 0, width, height);
	ctx.beginPath();
	ctx.moveTo(2*xlen,0);
	ctx.lineTo(c.width - 2*xlen , 0);
	ctx.arcTo(c.width,0,c.width,c.height/2,radius);
	ctx.arcTo(c.width,c.height,c.width - 2*xlen,c.height,radius);
	ctx.lineTo(2*xlen,c.height);
	ctx.arcTo(0,c.height,0,c.height/2,radius);
	ctx.arcTo(0,0,2*xlen,0,radius);
	ctx.fill();
	
	var xlen = 0;
	if (width > height * 8) {
		xlen = (height * 8) / 25;
	} else {
		xlen = width/25;
	}
	xlen = Math.floor(xlen);
	
	var qXlen = Math.floor(xlen / 4), hXlen = Math.floor(xlen / 2);

	var x = c.width - 2 * xlen, y = (c.height - 2*xlen)/2;
	var ANum = [ [ 1, 2, 3, 4, 5, 7 ], [ 2, 4 ], [ 2, 3, 5, 6, 7 ],
			[ 2, 4, 5, 6, 7 ], [ 1, 2, 4, 6 ], [ 1, 4, 5, 6, 7 ],
			[ 1, 3, 4, 5, 6, 7 ], [ 2, 4, 5 ], [ 1, 2, 3, 4, 5, 6, 7 ],
			[ 1, 2, 4, 5, 6 , 7 ],[] , [6]]; // add bool for dot
	var drawNumber  = function (num, boolDot) {

		ctx.globalAlpha = 0.2;
		var count = 1;

		x -= 0.28 * xlen;
		y += 0.28 * xlen;
		var t = 2;
		while (t--) {

			if (t === 0){
				y = y + xlen;
				}
			for (var i = 0; i < 2; i++) {
				x = x + i * 1.05 * xlen;

				var temX = x, temY = y;
				ctx.beginPath();
				ctx.moveTo(x, y);
				
				temX += qXlen;
				temY += qXlen;
				ctx.lineTo(temX, temY);

				temY += hXlen;
				ctx.lineTo(temX, temY);
				
				temX -= qXlen;
				temY += qXlen;
				ctx.lineTo(temX, temY);
				
				temX -= qXlen;
				temY -= qXlen;
				ctx.lineTo(temX, temY);
				
				temY -= hXlen;
				ctx.lineTo(temX, temY);
				
				ctx.lineTo(x, y);
				
				ctx.globalAlpha = 0.1;
				if (ANum[num].indexOf(count) !== -1) {
					ctx.globalAlpha = 1;
					ctx.fillStyle = "black";
					ctx.fill();
				} else{
					ctx.stroke();
					}
				count++;
				x = x - i * 1.05 * xlen;
			}
			if (t === 0){
				y = y - xlen;}
		}
		x += 0.28 * xlen;
		y -= 0.28 * xlen;
		for (var r = 0; r < 3; r++) {

			y = y + r * xlen * 1.025;
			var temX = x, temY = y;
			ctx.beginPath();
			ctx.moveTo(x, y);
			
			temX = x + hXlen;
			ctx.lineTo(temX, temY);
			
			temX += qXlen;
			temY += qXlen;
			ctx.lineTo(temX, temY);
			
			temX -= qXlen;
			temY += qXlen;
			ctx.lineTo(temX, temY);
			
			temX -= hXlen;
			ctx.lineTo(temX, temY);
			
			temX -= qXlen;
			temY -= qXlen;
			ctx.lineTo(temX, temY);
			
			ctx.lineTo(x, y);
			
			ctx.globalAlpha = 0.1;
			if (ANum[num].indexOf(count) !== -1) {
				ctx.globalAlpha = 1;
				ctx.fillStyle = "black";
				ctx.fill();
			} else {
				ctx.globalAlpha = 0.1;
				ctx.stroke();
			}
			count++;

			y = y - r * xlen * 1.025;
		}
		x = c.width - 2 * xlen; y =(c.height - 2*xlen - qXlen)/2;
		x += 1.3 * xlen;
		y += 2.3 * xlen;

		ctx.beginPath();
		ctx.arc(x, y, xlen / 5, 0, 2 * Math.PI);
		if (boolDot) {
			ctx.globalAlpha = 0.9;
			ctx.fill();
		} else {
			ctx.globalAlpha = 0.1;
			ctx.stroke();
		}

		x = c.width - 2 * xlen; y = (c.height - 2*xlen - qXlen)/2;

	};

	var clear = function(){
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.globalAlpha = 1;
		ctx.fillStyle = "gray";
		ctx.beginPath();
		ctx.moveTo(2*xlen,0);
		ctx.lineTo(c.width - 2*xlen , 0);
		ctx.arcTo(c.width,0,c.width,c.height/2,radius);
		ctx.arcTo(c.width,c.height,c.width - 2*xlen,c.height,radius);
		ctx.lineTo(2*xlen,c.height);
		ctx.arcTo(0,c.height,0,c.height/2,radius);
		ctx.arcTo(0,0,2*xlen,0,radius);
		ctx.fill();
		//ctx.fillRect(0, 0, c.width, c.height);
		
	};
	this.getNumber = function(){return number;};
	this.setNumber = function(num)
	{
		//alert("num : "+ num);
		clear();
		var boolShift = false;
		//ctx.save();
		var countDigit = 12;
		num += "";
		number = num;
		var boolDot = false;
		for (var i = num.length-1; i >= 0 ; i--) {
			var ch = num.charAt(i);
			if(ch === "."){
				boolDot = true;
				continue;
			}
			if(boolShift){
				ctx.translate(-xlen * 2, 0);			
			}
			boolShift = true;
			var pos = 11;
			if(ch !== "-"){
				pos = parseInt(ch);
			}
			drawNumber(pos, boolDot);
			countDigit--;
			boolDot = false;
		}
		while (countDigit--) {
			ctx.translate(-xlen * 2, 0);
			drawNumber(10, false);
		}
		
		//ctx.restore();
		while (countDigit !== 10) {
			countDigit++;
			ctx.translate(xlen * 2, 0);
		}
	};
	this.setNumber(0);
}
