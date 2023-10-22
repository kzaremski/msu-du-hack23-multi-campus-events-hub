function htmlFilter(myString) {

	//removes &nbsf and &amp from the string
	let descrFiltered = myString.replaceAll("&nbsf", "");
	descrFiltered = descrFiltered.replaceAll("&NBSF", "");
	descrFiltered = descrFiltered.replaceAll("&AMP", "");
	descrFiltered = descrFiltered.replaceAll("&AMP;", "");
	descrFiltered = descrFiltered.replaceAll("&amp", "");
	descrFiltered = descrFiltered.replaceAll("&amp;", "");
	descrFiltered = descrFiltered.replaceAll(";amp;", "");

	let array = descrFiltered.split("<");
	descrFiltered = []; //empties descrFiltered so that it can be filled with the filtered str later
	let tempArray = []; //temp array is used to dissect the html and normal text [0] is html and [1] is the regular text

	//For loop stores concatenates the filtered strings into descrFiltered
	for (let i = 0; i < array.length; i++) {
	  if (i !== 0) {
	  	tempArray = array[i].split(">");
	  	array[i] = tempArray[1]
	  }
	  descrFiltered += array[i];
	}
	return descrFiltered;
}


//grabs all items that need to be filtered
let toFilter = document.querySelectorAll(".needs-html-filter");
//changes the html for the text that needs to be filtered
for(let p = 0; p < toFilter.length; p++) {
	toFilter[p].innerHTML = htmlFilter(toFilter[p].innerHTML);
}
