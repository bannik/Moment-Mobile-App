try{
	$(function(){
		
		/* Configuration */
		
		var APPID = '';		// Your Yahoo APP id
		var DEG = 'f';		// c for celsius, f for fahrenheit
		
		var universe = $('#universe');
		var weather = $('#weather');
		var temp = $('#temp');
		var container = $('#container');
		var cityh = $('#city');
		var errorwin = $('#error');
		
		// Does this browser support geolocation?
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
		}
		else{
		    showError("Οopsie, something went really wrong! D: Please enable the Location on your device");
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
			                        	showError("Oopsie, something went wrong. Your live in the midle of nowhere!");
			                        	if (window.console && window.console.info){
			    					    	console.info("%s, %s; woeid: %d", city, code, woeid);
			    					    }
			    					    
			    					    return false;
			                        }
			                        var condition = item.text.toLowerCase();
			                        var cityo = city.toLowerCase();
			                        weather.html(condition);
			                        temp.html(Math.floor((item.temp - 32) / 1.8) + 1 + '&deg; C / ' + item.temp + '&deg; F');				
			                        cityh.html(city + " , " + code);
			                        universe.fadeOut('fast');
			                        container.fadeIn();
			                        }
			                                        else {
			                                            showError("Oopsie, something went wrong! Go out of here, because I will not like it if I'll see you here!");
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
			                        				showError("Reopen the app PLZ!");
			                        				break;
			                        			case error.POSITION_UNAVAILABLE:
			                        				showError('Sorry but you live in a cave!');
			                        				break;
			                        			case error.PERMISSION_DENIED:
			                        				showError('Enable device Location!');
			                        				break;
			                        			case error.UNKNOWN_ERROR:
			                        				showError('Something just went wrong!');
			                        				break;
			                        		}
			                                
			                            }
			                            
			                        	function showError(msg){
			                        		errorwin.addClass('error').html(msg);
			                        	}
			                        
			                        });
			                        		                        }
		                        catch ( error ) { 
		                           bugsense.notify( error, { rotation: 'not supported' } ) 
		                        };