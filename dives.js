var request = require("request");
var bodyParser = require("body-parser");

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBmkiXqLLAmnRnFB7bBr4PENDaZ0e-RMFU'
});

// Geocode an address.
/*googleMapsClient.geocode({
  address: 'Giens, FR'
}, function(err, response) {
  if (!err) {
   // console.log(JSON.stringify(response.json.results,null,4));
    console.log("Coordonnées : " + JSON.stringify(response.json.results[0].geometry.location,null,4));
    var lat = response.json.results[0].geometry.location.lat;
    var lng = response.json.results[0].geometry.location.lng;
    var url =  "http://api.divesites.com/?mode=sites&lat="+lat+"&lng="+lng+"&dist=25"; 
console.log(url);
					request(url, function (err, response, body) {
				       if (!err && response.statusCode === 200) {
                        var result = JSON.parse(body);
                        console.log(JSON.stringify(result.sites,null,4));
                        console.log("Size " + result.sites.length);
                        console.log("Il y a "+result.sites.length+" sites autour de ce lieu.")

                       }
					    else{
							console.log("error Dives Sites "+ err);
							
					    }		    
					});
    }
});*/


googleMapsClient.reverseGeocode({
    latlng: '47.54009,-2.8984107'
}, function(err, response) {
  if (!err) {
      console.log("Coordonnées : " + JSON.stringify(response.json.results[1]));
      console.log("Coordonnées : " + response.json.results[2].address_components[0].long_name);
      var code_postal = response.json.results[2].address_components[0].long_name;
      var ville = response.json.results[1].formatted_address;
      var dep = code_postal.substring(0, 2);
      console.log("dep : " + dep);
      if (dep === "92" || dep === "75" || dep === "95" || dep === "56")
      {
          console.log("Good Dep");
      }
  }
});

