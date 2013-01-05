$(function(){
	
	/* Configuration */
	
	var APPID = '';		// Your Yahoo APP id
	var DEG = 'f';		// c for celsius, f for fahrenheit
	
	var universe = $('#universe');
	var weather = $('#weather');
	var temp = $('#temp');
	var container = $('#container');
	var cityh = $('#city');
	
	// Does this browser support geolocation?
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	}
	else{
	    showError("Ουπς, κατι πηγε στραβα! D: O περιηγιτης σου δεν υποστιριζει geolocation");
	}
	function locationSuccess(position) {
		    var lat = position.coords.latitude;
		    var lon = position.coords.longitude;
	
		    // Yahoo's PlaceFinder API http://developer.yahoo.com/geo/placefinder/
		    // We are passing the R gflag for reverse geocoding (coordinates to place name)
		    var geoAPI = 'http://where.yahooapis.com/geocode?location='+lat+','+lon+'&flags=J&gflags=R&appid='+APPID;
		    
		    // Forming the query for Yahoo's weather forecasting API with YQL
		    // http://developer.yahoo.com/weather/
		    
		    var wsql = 'select * from weather.forecast where woeid=WID and u="'+DEG+'"',
		        weatherYQL = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(wsql)+'&format=json&callback=?',
		        code, city, results, woeid;
		    
		    if (window.console && window.console.info){
		    	console.info("Coordinates: %f %f", lat, lon);
		    }
		    $.getJSON(geoAPI, function(r){
		           
		            if(r.ResultSet.Found == 1){
		            	
		                results = r.ResultSet.Results;
		                city = results[0].city;
		                code = results[0].statecode || results[0].countrycode;
		        
		                // This is the city identifier for the weather API
		                woeid = results[0].woeid;
		    
		                // Make a weather API request:
		                $.getJSON(weatherYQL.replace('WID',woeid), function(r){
		                	
		                    if(r.query && r.query.count == 1){
		                    	
		                    	// Create the weather items in the #scroller UL
		                    	
		                        var item = r.query.results.channel.item.condition;
		                        
		                        if(!item){
		                        	showError("Ουπς, κατι πηγε στραβα. Ζεις στη μεση του πουθενα!");
		                        	if (window.console && window.console.info){
		    					    	console.info("%s, %s; woeid: %d", city, code, woeid);
		    					    }
		    					    
		    					    return false;
		                        }
		                        var condition = item.text.toLowerCase();
		                        var cityo = city.toLowerCase();
		                        weather.html(condition);
		                        temp.html(Math.floor((item.temp - 32) / 1.8) + 1 + '° C / ' + item.temp + '&deg; F');				
		                        cityh.html(city + " , " + code);
		                        universe.fadeOut('fast');
		                        container.fadeIn();
		                        }
		                                        else {
		                                            showError("Ουπς κατι πηγε σταβα! Φυγε απο δω γιατι δεν θα μου αρεσει αν το δω");
		                                        }
		                                    });
		                            
		                                }
		                                
		                            }).error(function(){
		                            	showError("Your browser does not support CORS requests!");
		                            });
		                           
		                        }
		                        	function locationError(error){
		                            	switch(error.code) {
		                        			case error.TIMEOUT:
		                        				showError("Κανε μια επαναφορτωση και ολα καλα!");
		                        				break;
		                        			case error.POSITION_UNAVAILABLE:
		                        				showError('Συγνωμη αλλα ζεις σε σπιλια!');
		                        				break;
		                        			case error.PERMISSION_DENIED:
		                        				showError('Ενεργοποιησε το geolocation και θα σου δωσω ενα μπισκοτο!');
		                        				break;
		                        			case error.UNKNOWN_ERROR:
		                        				showError('Κατι απλα πηγε στραβα');
		                        				break;
		                        		}
		                                
		                            }
		                            
		                        	function showError(msg){
		                        		weather.addClass('error').html(msg);
		                        	}
		                        
		                        });
		                        