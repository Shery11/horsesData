window.onload = function(){
	/*var limit, adminNF, sex, dateFrom, dateTo, cDateFrom, minHeight, maxHeight, minNumber, maxFault, reqScore;*/
	
	restoreData();
	
	function restoreData(){
		var limit = sessionStorage.getItem('limit');
		if (limit !== null) $('#limit').val(limit);
		var adminNF = sessionStorage.getItem('adminNF');
		if (adminNF !== null) $('#adminNF').val(adminNF);
		var sex = sessionStorage.getItem('sex');
		if (sex !== null) $('#sex').val(sex);
		var dateFrom = sessionStorage.getItem('dateFrom');
		if (dateFrom !== null) $('#dateFrom').val(dateFrom);
		var dateTo = sessionStorage.getItem('dateTo');
		if (dateTo !== null) $('#dateTo').val(dateTo);
		var cDateFrom = sessionStorage.getItem('cDateFrom');
		if (cDateFrom !== null) $('#cDateFrom').val(cDateFrom);
		var cDateTo = sessionStorage.getItem('cDateTo');
		if (cDateTo !== null) $('#cDateTo').val(cDateTo);
		var minHeight = sessionStorage.getItem('minHeight');
		if (minHeight !== null) $('#minHeight').val(minHeight);
		var maxHeight = sessionStorage.getItem('maxHeight');
		if (maxHeight !== null) $('#maxHeight').val(maxHeight);
		var minNumber = sessionStorage.getItem('minNumber');
		if (minNumber !== null) $('#minNumber').val(minNumber);
		var maxFault = sessionStorage.getItem('maxFault');
		if (maxFault !== null) $('#maxFault').val(maxFault);
		var reqScore = sessionStorage.getItem('reqScore');
		if (reqScore !== null) $('#reqScore').val(reqScore);
		
	}
	
	$('#search_btn').on('click', function(event){
		event.preventDefault()
		
		sessionStorage.setItem("limit", $("#limit").val());
		sessionStorage.setItem("adminNF", $("#adminNF").val());
		sessionStorage.setItem("sex", $("#sex").val());
		sessionStorage.setItem("dateFrom", $("#dateFrom").val());
		sessionStorage.setItem("dateTo", $("#dateTo").val());
		sessionStorage.setItem("cDateFrom", $("#cDateFrom").val());
		sessionStorage.setItem("cDateTo", $("#cDateTo").val());
		sessionStorage.setItem("minHeight", $("#minHeight").val());
		sessionStorage.setItem("maxHeight", $("#maxHeight").val());
		sessionStorage.setItem("minNumber", $("#minNumber").val());
		sessionStorage.setItem("maxFault", $("#maxFault").val());
		sessionStorage.setItem("reqScore", $("#reqScore").val());
		
//		$("#form").submit(); //submit form
		if(checkForm())
			$("#form").submit(); //submit form
		else
			alert('All fields are required except Admin NF, Sex, limit');
	});
	
	function checkForm(){
		limit = $("#limit").val();
		adminNF = $("#adminNF").val();
		sex = $("#sex").val();
		dateFrom = $("#dateFrom").val();
		dateTo = $("#dateTo").val();
		cDateFrom = $("#cDateFrom").val();
		cDateTo = $("#cDateTo").val();
		minHeight = $("#minHeight").val();
		maxHeight = $("#maxHeight").val();
		minNumber = $("#minNumber").val();
		maxFault = $("#maxFault").val();
		reqScore = $("#reqScore").val();
		
		if(check(dateFrom) || check(dateTo) || check(cDateFrom) || check(cDateTo) || check(minHeight) || check(maxHeight) || check(minNumber) || check(maxFault) || check(reqScore)){
			return false;
		}
		return true;
	}
	
	function check(s) {
		if (!s.replace(/\s/g, '').length) {
			return true;
		}
	}
};