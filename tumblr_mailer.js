var fs = require('fs');
var ejs = require('ejs'); // loading EJS into our project
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'dvepr7TumFmKjuEzGsPSiPi28viWx4CEJCoiK8MGu1v6wYTNjy',
  consumer_secret: 'cpG0N6Br8doz4exn7pqo0Wu6zrwqjlYpnI9y1TcXmly88DDmOP',
  token: 'pFnyGzUrFr2CJWFkPADARwdS1ALHWXjxVn7Ac9My22IjESs4iM',
  token_secret: 'DXWrKlcNv10yv8PuFxhu5ek07kg6fCtyhAblvCnex5Wf9TjwMd'
});

var fileName = "friend_list.csv";


function csvParse (csvFile) {
	var objArray = [];	

	//read the file
	var fileContents = fs.readFileSync(csvFile, {encoding: "utf8"});

	//split the lines into an array
	var linesArray = fileContents.split("\n");

	//store the header from the first line
	var headers = linesArray[0].split(',');

	//read the rest of the file and store in objArray
	for (var i=1; i<linesArray.length-1; i++) {
		var row = linesArray[i].split(',');
		var obj = {};
		for (var j=0; j<row.length; j++) {
			obj[headers[j]] = row[j];
		}
		objArray.push(obj);
	}
	return objArray;
}

function getLatestPosts (posts) {
	var newPosts = []; //to store posts from last 7 days
	var today = new Date();
	for (var i=0; i<posts.length; i++) {
	  	var currPost = posts[i];
	  	var dateWritten = new Date(currPost.date);
	  	var numDaysOld = dateDiff(dateWritten, today);
	  	if (numDaysOld <= 7) {
	  		var postObj = {};
	  		postObj.href = currPost.post_url;
	  		postObj.title = currPost.title;
	  		postObj.date = currPost.date;
	  		newPosts.push(postObj);
	  	}
	}	
	return newPosts;
}

var dateDiff = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}


////Main program

var cvsData = csvParse(fileName);
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

client.posts('ontima.tumblr.com', function (err, blog){
  var newPosts = getLatestPosts(blog.posts);

  for (var i=0; i<cvsData.length; i++) {
  	cvsData[i].latestPosts = newPosts;
  	var customEmail = ejs.render(emailTemplate, cvsData[i]);
  	console.log(customEmail);
  }

})




