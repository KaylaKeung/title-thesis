// Global variables

// NYT Headline
var headline;

// the animation
var theAnimation;

// variable for all interim states of the grid
var currentString;

var istArray;

// First string to be injected
var sollString = "a personal memory space. a personal exploration of my self-compression.";

var preparedString;

// The dimension of the grid
var cols = 20;
var rows = 8;

// These are the characters that are possible to display
var possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.,:!ˉ';

// Create the HTML-Grid 
function createGrid(){
	
	var index = 0;
	var colIndex = 0;

	for (var i = 0; i < rows*cols; i++){

		$("#stage").append('<a>ˉ</a>');
		index++;
	}

}

function injectString(sollString){

	var currentWord = 0;

	// Needed for linking the single words
	var singleWords;

	// The istArray represents all interim states of the grid

	var word = [];

	istArray = [];

	var countUp = 0;


	// The current index of the possible characters
	var possibleIndex = 0;


	// The current index of the grid
	var currentIndex = 0;

	// 
	var targetIndex = 0;
	

	function prepareString(){
		
		// Prepare and format the injected string
		for (var i = 0; i < sollString.length; i++){

			// 1. Delete all whitespaces
			// 2. Replace all special characters
			// 3. Replace all double dashes
			// 4. convert to upperacase
			preparedString = sollString.replace('’',' ').replace(/\s/g,'ˉ').replace(/[^\w\s.,_-–]/gi,'ˉ').replace(/ˉ{2,}/g, 'ˉ').toUpperCase();
		} 


		singleWords = preparedString.replace(/[.,]/g,"").toLowerCase().split('ˉ');
	}

	function animateGrid(){
		
		// Assign the animation to a variable, so it can be stopped afterwards
		theAnimation = setInterval(function(){ 

		// If the end of the preparedString is not reached
		if (currentIndex < preparedString.length){

				// If the end of the grid is reached, go back to the first position
				if (currentIndex >= cols*rows){
					currentIndex = 0; 

				}

			// If the letter is not the right one yet
			if (istArray[currentIndex] != preparedString[targetIndex]){

				// rotate the letter one more step
				istArray[currentIndex] = possibleCharacters[possibleIndex];
				$( "#stage a:nth-child("+(currentIndex+1)+")" ).html(istArray[currentIndex]);	

				possibleIndex++;

			

			} else {

				// If the letter is the right one
				// Add a title to the element, if it is part of a word
				if (preparedString[currentIndex] != 'ˉ' &&
					preparedString[currentIndex] != '.' &&
					preparedString[currentIndex] != ',' ){	
					$( "#stage a:nth-child("+(currentIndex+1)+")" ).attr("title", singleWords[currentWord]);
				}

			// Go to next letter
			possibleIndex = 0;
			currentIndex++;
			targetIndex++;

			// If the end of a word is reached
			if (preparedString[targetIndex] == 'ˉ'){
				currentWord++;
			}
			
			}

			}
		
		}, 10);		
	}

	prepareString();
	animateGrid();

}



// Create The Grid
createGrid();

// Inject The String
injectString(sollString);


function clearGrid(){

	// Clear current animation
	clearInterval(theAnimation);

	$( "#stage a" ).removeClass("active");	

	var clearingAnimation = setInterval(function(){ 
		for (var i = 0; i < istArray.length+1; i++){
			
			if ($( "#stage a:nth-child("+i+")" ).html() != 'ˉ'){

				var randomLetter = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];

				$( "#stage a:nth-child("+i+")" ).html(randomLetter);	
			} 
		}
	}, 10);		

	setTimeout(function() { 
		clearInterval( clearingAnimation ); 
		$( "#stage a" ).html('ˉ');
		$( "#stage a" ).removeClass("active");	
		$( "#stage a" ).removeAttr("title");
	}, 500);
}



// Launch the API-loader, when a word is clicked
$( "a" ).click(function() {
	if ($(this).attr('title')){
		clearGrid();

		var keyword = this.title;
		loadAPI(keyword);
	}
});


// blue color on mouse hover

$("a").hover(function(){
	if ($(this).attr('title')){
		var titleStr = $(this).attr("title");
		$("a[title=\""+titleStr+"\"]").addClass('active');
	}
}, function() {
 	if ($(this).attr('title')){
    	$("a").removeClass('active');
    }
});

// Load stuff from the New York Times API

function loadAPI() {
    var errorMsg = 'Error displaying coordinates. Please try again later';

    // List of visited places with Google Maps-style coordinate format
    const visitedPlaces = [
        { name: "---Shanghai", coordinates: "31.2304,121.4737" },
        { name: "---Hong Kong", coordinates: "22.3193,114.1694" },
        { name: "---Seoul", coordinates: "37.5665,126.9780" },
        { name: "---Tokyo", coordinates: "35.6895,139.6917" },
        { name: "---New York", coordinates: "40.7128,-74.0060" }
    ];

     // Randomly select a place from the list
	 const randomPlace = visitedPlaces[Math.floor(Math.random() * visitedPlaces.length)];

	 // Format the display as "Place Name: coordinates"
	 const headline = `${randomPlace.name}: ${randomPlace.coordinates}`;
 
	 // Log the headline to ensure it's fully intact before calling injectString
	 console.log("Generated headline:", headline);
 
	 // Display the headline
	 injectString(headline);
}






