var boolOpenSwipe,dvBack,dvtutorial, dvSwipe, dvUnderSwipe, pointer , calc , obj7Seg,boolswipe = true;
//var istrue = 0,press;
(function() {
	window
			.addEventListener(
					'tizenhwkey',
					function(ev) {
						if (ev.keyName === "back") {
							var page = document
									.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id
									: "";
							if (pageid === "main") {
								try {
									tizen.application.getCurrentApplication()
											.exit();
								} catch (ignore) {
								}
							} else {
								window.history.back();
							}
						}
					});
	dvtutorial = document.getElementById('dvtutorial');
	var firstTime = localStorage.getItem('firstTime');
	
	if(firstTime === null)
	{
		dvtutorial.style.visibility = 'visible';
	}
	tau.event.enableGesture(dvtutorial, new tau.event.gesture.Swipe({
		orientation : 'vertical'
	}));

	dvtutorial.addEventListener("swipe", function() {
		localStorage.setItem('firstTime', true);
		dvtutorial.style.visibility = 'hidden';
		mySwipe();

	});
	
	var para = document.getElementById('para');
	obj7Seg = new prRes(para);
	
	calc = new Calculator();
	document.getElementById("btn0").addEventListener("click", funNum);
	document.getElementById("btn1").addEventListener("click", funNum);
	document.getElementById("btn2").addEventListener("click", funNum);
	document.getElementById("btn3").addEventListener("click", funNum);
	document.getElementById("btn4").addEventListener("click", funNum);
	document.getElementById("btn5").addEventListener("click", funNum);
	document.getElementById("btn6").addEventListener("click", funNum);
	document.getElementById("btn7").addEventListener("click", funNum);
	document.getElementById("btn8").addEventListener("click", funNum);
	document.getElementById("btn9").addEventListener("click", funNum);
	document.getElementById("btnDot").addEventListener("click", funNum);

	document.getElementById("btnMul").addEventListener("click", funOp);
	document.getElementById("btnPercentage").addEventListener("click", funOp);
	document.getElementById("btnSub").addEventListener("click", funOp);
	document.getElementById("btnDiv").addEventListener("click", funOp);
	document.getElementById("btnAdd").addEventListener("click", funOp);
	document.getElementById("btnMod").addEventListener("click", funOp);
	document.getElementById("btnEq").addEventListener("click", funOp);
	document.getElementById("btnC").addEventListener("click", funOp);
	
	boolOpenSwipe = false;
	dvUnderSwipe = document.getElementById('dvUnderSwipe');
	dvBack = document.getElementById('dvBack');
	dvBack2 = document.getElementById('dvBack2');
	dvSwipe = document.getElementById('dvSwipe');
	pointer = document.getElementById('pointer');
	
	tau.event.enableGesture(dvBack, new tau.event.gesture.Swipe({
		orientation : 'vertical'
	}));

	dvBack.addEventListener("swipe", function(e) {
		mySwipe();

	});

	tau.event.enableGesture(pointer, new tau.event.gesture.Swipe({
		orientation : 'vertical'
	}));
	pointer.addEventListener("swipe", function(e) {
		mySwipe();

	});
	tau.event.enableGesture(dvUnderSwipe, new tau.event.gesture.Swipe({
		orientation : 'vertical'
	}));
	dvUnderSwipe.addEventListener("swipe", function(e) {
		mySwipe();

	});
	
	tau.event.enableGesture(dvSwipe, new tau.event.gesture.Swipe({
		orientation : 'vertical'
	}));
	dvUnderSwipe.addEventListener("click", function(e) {
		mySwipe();
	});

	dvSwipe.addEventListener("swipe", function(e) {
		mySwipe();

	});
	pointer.addEventListener("click", function(e) {
		mySwipe();
	});
	var Del = document.getElementById('btnDel'); //backspace
	Del.addEventListener('click' , function() {
		funBack();
	},false);
//	Del.addEventListener('touchstart', function() {
//		press = setTimeout(function() {
//			istrue = 1;
//			clearRes();
//		}, 300);
//	}, false);
//	 
//	Del.addEventListener('touchend', function() {
//		clearTimeout(press);
//		if(!istrue){
//			funBack();
//		}
//		istrue = 0;
//	}, false);
	
	document.addEventListener('rotarydetent', function(e) {
		 if (e.detail.direction === 'CW') {
		        
		    } else if (e.detail.direction === 'CCW') {
		        
		    }
		 localStorage.setItem('firstTime', true);
		 dvtutorial.style.visibility = 'hidden';
		 mySwipe();
	}, false);
}());



function mySwipe() {
	
	if(!boolswipe){
		return;
	}
	setTimeout(function() {
		boolswipe = true;
	}, 400);
	boolswipe = false;
	
	try {
		if (!boolOpenSwipe) {
			dvUnderSwipe.style.visibility = 'visible';
			boolOpenSwipe = true;
			$("#dvUnderSwipe").fadeIn(200);
			$('#dvSwipe').animate({
				top : '55%'
			},200);
			
		} else {
			$("#dvUnderSwipe").fadeOut(200);
			
			$('#dvSwipe').animate({
				top : '100%'
			},200, function() {
				dvUnderSwipe.style.visibility = 'hidden';
				boolOpenSwipe = false;
			});
			
		}
	} catch (e) {
		alert(e.message);
	}
}
var num = "0", op = "+", clean = true;
function funNum() {
	
	if (clean) {

		obj7Seg.setNumber(0);
		clean = false;
	}
	var tem = this.innerHTML;
	
	var pr = obj7Seg.getNumber();

	var len = 12;
	if (pr.search(/[.]/g) !== -1) {
		len++;
	}
	if (pr.length < len) {
		if (tem === "0" && pr === "0") {
			return;
		} else {
			if (tem === "." && pr.search(/[.]/g) !== -1) {

				return;
			} else {
				if (pr === "0" && tem !== ".") {
					pr = "";
				}
				pr = pr + "" + tem;

				
				obj7Seg.setNumber(pr);

			}
		}
	}

}
function funOp() {
	clean = true;

	num = obj7Seg.getNumber();
	var numForSet = parseFloat(num);
	calc.SetNum(numForSet);
	op = this.innerHTML;

	switch (op) {
	case "+":
		calc.SetOp(OPERATIONS.ADDITION);
		mySwipe();
		break;
	case "-":
		calc.SetOp(OPERATIONS.SUB);
		mySwipe();
		break;
	case "x":
		calc.SetOp(OPERATIONS.MUL);
		mySwipe();
		break;
	case "÷":
		calc.SetOp(OPERATIONS.DIV);
		mySwipe();
		break;
	case "MOD":
		calc.SetOp(OPERATIONS.MOD);
		mySwipe();
		break;
	case "%":
		calc.SetOp(OPERATIONS.Percentage);
		mySwipe();
		break;
	case "c":
		clearRes();
		//mySwipe();
		break;
	case "=":
		calc.SetOp(OPERATIONS.EQ);

		break;
	default:
		break;
	}
	var ans = calc.GetResult();
	obj7Seg.setNumber(ans);

}
function clearRes() {
	
	calc.SetOp(OPERATIONS.AC);
	num = "0";
	op = "+";
	clean = true;
	obj7Seg.setNumber(0);
}
function funBack() {

	if (!clean) {
		var x = obj7Seg.getNumber();

		x = x.slice(0, x.length - 1);
		if (x === "") {
			x = "0";
		}

		obj7Seg.setNumber(x);
	}
}
