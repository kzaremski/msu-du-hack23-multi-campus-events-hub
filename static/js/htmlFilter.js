function htmlFilter(myString) {



	let descrFiltered = myString.replace("&nbsf", "");
	descrFiltered = descrFiltered.replace("&NBSF", "");

	let array = descrFiltered.split("<");
	descrFiltered = [];

	let tempArray = [];

	for (let i = 0; i < array.length; i++) {
	  if (i !== 0) {
	  	tempArray = array[i].split(">");
	  	array[i] = tempArray[1]
	  }
	  descrFiltered += array[i];
	}
	return descrFiltered;
}
