function prRes(para) {
	
	var paraRes = para ;
	paraRes.innerHTML = '0';
	var number = "0";
	this.setNumber = function(num){
		try {
			num+="";
			number = num;
			paraRes.innerHTML = number;
		} catch (e) {
			console.log(e.message);
		}
		
		
	};
	this.getNumber = function(){
		return number;
	};
}