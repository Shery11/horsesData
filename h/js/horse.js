window.onload = function(){
	dispalyHorse();

	function getQueryStringValue (key) {
		return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
	}
	
	/********** Display ************/
	function dispalyHorse(){
		var horse_id = getQueryStringValue('id');

		rootRef.child('Horses/'+horse_id).once('value', function(snap){
			$("#horse_info").append("<tr> <td> "+snap.val()['FEIID']+" </td> <td> "+snap.val()['Admin NF']+" </td> <td> "+snap.val()['Name']+" </td> <td> "+snap.val()['Sex']+" </td> <td> "+snap.val()['Date Of birth']+" </td> <td> "+snap.val()['Pony']+" </td> <td> "+snap.val()['Registration']+" </td> <td> "+snap.val()['Studbook']+" </td> <td> "+snap.val()['Type']+" </td> </tr>" );
			
			var comps = snap.val().Competitions;
			for (var key in comps) {//loop through Competitions
				if (comps.hasOwnProperty(key)) {
					$("#results_list").append("<tr> <td> "+comps[key].Article+" </td> <td> "+comps[key].Athlete+" </td> <td> "+comps[key].Competition+" </td> <td> "+comps[key].Event+" </td> <td> "+comps[key].FEIID+" </td> <td> "+comps[key].ObsHeight+" </td> <td> "+comps[key].Pos+" </td> <td> "+comps[key].Score+" </td> <td> "+comps[key].Show+" </td> <td> "+comps[key].StartDate+" </td> </tr>" );
				}
			}
			
			$("#results").tablesorter( {dateFormat: 'pt',sortList: [[9,1]]} );
		});
	}

};