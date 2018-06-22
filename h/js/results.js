window.onload = function(){
	filterHorses();

	function getQueryStringValue (key) {
		return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}

	function filterDates(date_from, date_to, date_check){
		//format dates
		console.log(" F:" + date_from + " T:" + date_to + " C:" + date_check);

		var d1 = date_from.split("-");
		console.log(d1);
		if(d1.length == 1) d1 = date_from.split("/");
		var d2 = date_to.split("-");
		console.log(d2);
		if(d2.length2 == 1) d2 = date_to.split("/");
		var c = date_check.split("-");
		console.log(c);
		if(c.length == 1) c = date_check.split("/");


		var year = c[2].split(" ")[0];
		var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
		var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
		var check = new Date(year, parseInt(c[1])-1, c[0]);

		console.log(from,to,check);
		if(check >= from && check <= to)
			return true;
		return false;
	}

	/********** FILTER ************/
	function filterHorses(){


		var filter_sex_flag = false;
		var results_flag = false;
		var limit = parseInt(getQueryStringValue('limit'));
		var adminNF = getQueryStringValue('adminNF');
		var sex = getQueryStringValue('sex');
		var dateFrom = getQueryStringValue('dateFrom');
		var dateTo = getQueryStringValue('dateTo');
		var cDateFrom = getQueryStringValue('cDateFrom');
		var cDateTo = getQueryStringValue('cDateTo');
		var minHeight = parseInt(getQueryStringValue('minHeight'));
		var maxHeight = parseInt(getQueryStringValue('maxHeight'));
		var minNumber = parseInt(getQueryStringValue('minNumber'));
		var maxFault = parseInt(getQueryStringValue('maxFault'));
		var reqScore = parseInt(getQueryStringValue('reqScore'));
		var maxPosition = parseInt(getQueryStringValue('maxPosition'));
		var reqPosition = parseInt(getQueryStringValue('reqPosition'));

		console.log(limit,adminNF,sex,dateFrom,dateTo);

		if(limit==''){
			limit = 50000;
		}

		if(limit=='' && adminNF=='' && sex==''){
			var q = rootRef.child('Horses');
			filter_sex_flag = true;
			console.log(q);
		}
		else if(limit=='' && adminNF=='' && !sex==''){
			var q = rootRef.child('Horses').orderByChild('Sex').equalTo(sex);
			filter_sex_flag = true;
			console.log(q);
		}
		else if(limit=='' && !adminNF=='' && sex==''){
			var q = rootRef.child('Horses').orderByChild('Admin NF').equalTo(adminNF);
			filter_sex_flag = true;
			console.log(q);
		}
		else if(limit=='' && !adminNF=='' && !sex==''){
			var q = rootRef.child('Horses').orderByChild('Admin NF').equalTo(adminNF);
			filter_sex_flag = false;
			console.log(q);
		}
		else if(!limit=='' && adminNF=='' && sex==''){
			var q = rootRef.child('Horses').limitToFirst(limit);
			filter_sex_flag = true;
			console.log(q);
		}
		else if(!limit=='' && adminNF=='' && !sex==''){
			var q = rootRef.child('Horses').limitToFirst(limit).orderByChild('Sex').equalTo(sex);
			filter_sex_flag = true;
			console.log(q);
		}
		else if(!limit=='' && !adminNF=='' && sex==''){
			var q = rootRef.child('Horses').limitToFirst(limit).orderByChild('Admin NF').equalTo(adminNF);
			window.alert(q)
			filter_sex_flag = true;
			console.log(q);
		}
		else if(!limit=='' && !adminNF=='' && !sex==''){
			var q = rootRef.child('Horses').limitToFirst(limit).orderByChild('Admin NF').equalTo(adminNF);
			filter_sex_flag = false;
			console.log(limit);
			console.log(q);
		}

		q.once('value', function(snap){
			console.log(snap)
			snap.forEach(function(childSnap) {//loop through Horses

				console.log(childSnap.val());


				if(filter_sex_flag || childSnap.val()["Sex"] == sex){//Filter Sex
					console.log("satisfied filter search flag");
					if(childSnap.val()["Date Of birth"] != null){

						console.log("satisfied date of birth");
					


					if(filterDates(dateFrom, dateTo, childSnap.val()["Date Of birth"])){//Filter date range
					
                        console.log("With in date range");

						var filteredComps = new Array();
						var filteredCompsForPosition = new Array();
						var filteredCompsForNoPosition = new Array();

						var comps = childSnap.val().Competitions;
						console.log(comps);
						for (var key in comps) {//loop through Competitions
							//window.alert("Comp Key:" + key);
							if (comps.hasOwnProperty(key)) {
								if(filterDates(cDateFrom, cDateTo, comps[key].StartDate) && (comps[key].ObstHeight >= minHeight && comps[key].ObstHeight <= maxHeight))
									
									filteredComps.push(comps[key]);
							}
						}
						var countScores = 0;
						var countScoresPosition = 0;
						var comps_count = filteredComps.length;
						var athleteName = "";

						if(comps_count > minNumber){
							for (var i = 0; i < comps_count; i++) {
								var faultAsIs = filteredComps[i].Score;
								var fault;
								if(faultAsIs != null){
									fault = faultAsIs.split("/")[0];
								}else{
									console.log("fault for horse: " + childSnap.val()["Name"] + " is:" + faultAsIs);
									fault = faultAsIs									
								}
								if(!isNaN(fault) && parseInt(fault) < maxFault){
									countScores++;
								}
							 	var position = filteredComps[i].Pos;
								var athleteName = filteredComps[i].Athlete;
							 	if(!isNaN(position) && parseInt(position) <= maxPosition){
								 	countScoresPosition++;
							 	}
							}
							if((countScores/comps_count) > (reqScore / 100)){

									results_flag = true;
									//$("#results_list").append("<tr> <td> "+childSnap.val()['FEIID']+" </td> <td> "+childSnap.val()['AdminNF']+" </td> <td> "+ childSnap.val()['Name'] +" </td> <td> "+ athleteName +" </td> <td> "+childSnap.val()['Sex']+" </td> <td> "+childSnap.val()['Date Of birth']+" </td> <td> " + parseFloat((countScoresPosition/comps_count)*100).toFixed(2) +" </td> <td> "+ parseFloat((countScores/comps_count)*100).toFixed(2) +" </td> <td> <a href='horse.html?id="+childSnap.key+"' ><button type='button' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary'>View Details</button></a> </td></tr>" );
									$("#results_list").append("<tr> <td> "+childSnap.val()['FEIID']+" </td> <td> "+childSnap.val()['Admin NF']+" </td> <td> "+ childSnap.val()['Name'] +" </td> <td> "+ athleteName +" </td> <td> "+childSnap.val()['Sex']+" </td> <td> "+childSnap.val()['Date Of birth']+" </td> <td> " + parseFloat((countScoresPosition/comps_count)*100).toFixed(2) +" </td> <td> "+ parseFloat((countScores/comps_count)*100).toFixed(2) +" </td> <td> <a href='" + childSnap.val()['URL'] + "' target='_blank' ><button type='button'>View Details</button></a> </td></tr>" );
							}

							else if((countScoresPosition/comps_count) >= (reqPosition / 100)){
								results_flag = true;
								//dispaly this horse in the results table
								//$("#results_list").append("<tr> <td> "+childSnap.val()['FEIID']+" </td> <td> "+childSnap.val()['AdminNF']+" </td> <td> "+childSnap.val()['Name']+" </td> <td> "+ athleteName +" </td> <td> "+childSnap.val()['Sex']+" </td> <td> "+childSnap.val()['Date Of birth']+" </td> <td> " + parseFloat((countScoresPosition/comps_count)*100).toFixed(2) +" </td> <td> "+ parseFloat((countScores/comps_count)*100).toFixed(2) +" </td> <td> <a href='horse.html?id="+childSnap.key+"' ><button type='button' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary'>View Details</button></a> </td></tr>" );
								$("#results_list").append("<tr> <td> "+childSnap.val()['FEIID']+" </td> <td> "+childSnap.val()['Admin NF']+" </td> <td> "+childSnap.val()['Name']+" </td> <td> "+ athleteName +" </td> <td> "+childSnap.val()['Sex']+" </td> <td> "+childSnap.val()['Date Of birth']+" </td> <td> " + parseFloat((countScoresPosition/comps_count)*100).toFixed(2) +" </td> <td> "+ parseFloat((countScores/comps_count)*100).toFixed(2) +" </td> <td> <a href='" + childSnap.val()['URL'] + "' target='_blank' ><button type='button'>View Details</button></a> </td></tr>" );
							}
						}
					}
				}
				}
			});
			//check if no results
			if(!results_flag){
				$('#no_results').html('No Results!');
			}
			$('#loading').removeClass('is-active');

			$("#results").tablesorter({dateFormat: 'pt', sortList: [[5,1]] });
		});
	}

};
