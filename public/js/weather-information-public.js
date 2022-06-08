function getLocation() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(showPosition);
	} else { 
	  x.innerHTML = "Geolocation is not supported by this browser.";
	}
}
// function showPosition(position) {
// 	Latitude = position.coords.latitude; 
// 	Longitude = position.coords.longitude;
// }


window.addEventListener('load', (event) => {
	
	let appEl = document.getElementById('weather-widget-box');
	let appDetailsEl = document.getElementById('weather-details-box');

	// home app
	if(appEl){
		var mainApp = new Vue({
			el: '#weather-widget-box',
			data: {
				message: 'Hello Vue!',
				latitude: false, 
				longitude: false,
				weatherDetails: false,
				weatherCityDetails: false,
				weatherStateDetails:false,
				geocoder: false,
				address: false,
				iconmodal: false,
				modal: false,
				settings: {
				    temperature : 1,
				    windspeed : 2,
				    swellheight: 1,
				    tideheight: 1,
				},
			}, 
			methods: {
				getLocation () {
				    let lat = sessionStorage.getItem('lat');
                    let lon = sessionStorage.getItem('lon');
                    
				    if(lat !== null && lon !== null){
				        this.latitude = lat;
				        this.longitude = lon;
				        
				    }else{
    					if (navigator.geolocation) {
    					  navigator.geolocation.getCurrentPosition(this.showPosition, this.showErrorPosition);
    					} else { 
    					  x.innerHTML = "Geolocation is not supported by this browser.";
    					}
					}
				}, 
				getDateTime () {
					let datetime = new moment().format('YYYY-MM-DD h:mm:ss');
					return datetime;	
				}, 

				getWeatherInfo (lat, lon){
				    

					let insOfApp = this;
					let startdate = this.getDateTime();
					let url = "https://api.knowwake.com/wx_data_details.php?lat="+lat+"&lng="+lon+"&start="+startdate+"&";
				
					if(this.settings.temperature !==1 ) { url = url + "temp="+ this.settings.temperature } else { url = url + "temp=1" }

					if(this.settings.windspeed !==2 ) { url = url + "&windSpeed="+ this.settings.windspeed } else { url = url + "&windSpeed=2" }
				
					if(this.settings.swellheight !==1 ) { url = url + "&swellHeight="+ this.settings.swellheight } else { url = url + "&swellHeight=1" }
					
					if(this.settings.tideheight !==1 ) { url = url + "&tideHeight="+ this.settings.tideheight } else { url = url + "&tideHeight=1" }
					
					
                  
					let result = $.ajax({
						url: url,
						cache: false,
						dataType : 'json',   //you may use jsonp for cross origin request
  						crossDomain:true,
						success: function(res){
							insOfApp.weatherDetails = res.details;	
						}
					});
					
					
				}, 
				

				
				codeLatLng(lat, lng){
				    var address;
				    var thisInstance = this;
				    var latlng = new google.maps.LatLng(lat, lng);
				    
                    this.geocoder.geocode({'latLng': latlng}, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                          //console.log(results);
                            if (results[1]) {
                                var indice=0;
                                for (var j=0; j<results.length; j++)
                                {
                                    if (results[j].types[0]=='locality')
                                        {
                                            indice=j;
                                            break;
                                        }
                                }
                            
                                // console.log(results[j]);
                                for (var i=0; i<results[j].address_components.length; i++)
                                {
                                    if (results[j].address_components[i].types[0] == "locality") {
                                            //this is the object you are looking for City
                                            city = results[j].address_components[i];
                                        }
                                    if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                                            //this is the object you are looking for State
                                            region = results[j].address_components[i];
                                        }
                                    if (results[j].address_components[i].types[0] == "country") {
                                            //this is the object you are looking for
                                            country = results[j].address_components[i];
                                        }
                                }
                                
                                //console.log(city.long_name);
                                //city data
                                address = city.long_name + ", " + region.short_name ;
    
                            
                            } else {
                                  address = "No results found";
                            }
                            
                            
                            //}
                      } else {
                        //address = "Geocoder failed due to: " + status;
                      }

                      thisInstance.address = address;
                    });        
				},
				
				geoLocationSuccess(){
			        var lat = this.latitude;
                    var lng = this.longitude;
                    this.codeLatLng(lat, lng);
				},
				
				geoLocationError(){
				    
				},
				
				getCityInfo (){
				    
				    this.geocoder = new google.maps.Geocoder();
				    
				    if (navigator.geolocation) {
				        this.geoLocationSuccess();
                        //navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError);
                    }
				},
				
				showPosition (position) {
					this.latitude = position.coords.latitude; 
					this.longitude = position.coords.longitude;
					
                    let lat = sessionStorage.setItem('lat',this.latitude);
                    let lon = sessionStorage.setItem('lon', this.longitude);
				}, 
				
				showErrorPosition () {
					this.latitude = 26.122438;
					this.longitude = -80.137314;
				}, 
				
				getLink () { 
				    //let startdate = this.getDateTime();
					return window.location.origin+'/weather-details/?lat='+this.latitude+'&lon='+this.longitude;
					//+ '&start='+startdate+'&temp=1';
					
					//return window.location.href+'/weather-details/?lat='+this.latitude+'&lon='+this.longitude;
				},
				
				dateTime(value) {
                  return moment(value).format("h:mm A");
                },
                
                toggleModal(){
                    this.modal = !this.modal;
                    $( "body" ).toggleClass( "myClassyourClass" );
                }, 
                
                toggleIconModal(){
                    this.iconmodal = !this.iconmodal;
                    $( "body" ).toggleClass( "myClassyourClass" );
                }, 
                
                toggleTemperature(temp){
                    this.settings = {
                        ...this.settings, 
                        temperature : temp
                    }
                    //this.settings.temperature = temp;
                },
                toggleWindSpeed(wind){
                    this.settings = {
                        ...this.settings, 
                        windspeed : wind
                    }
                    //this.settings.windspeed = wind;
                },
                toggleSwellHeight(swell){
                    this.settings = {
                        ...this.settings, 
                        swellheight : swell
                    }
                    //this.settings.swellheight = swell;
                },
                toggleTideHeight(tide){
                    this.settings = {
                        ...this.settings, 
                        tideheight : tide
                    }
                    //this.settings.tideheight = tide;
                },
                
                updateWeatherSettings(){
                    this.getWeatherInfo(this.latitude, this.longitude);
                    this.modal = false;
                },
                
                
                copyToClipboard (elementId) {
                    var r = document.createRange();
                    r.selectNode(document.getElementById(elementId));
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(r);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                   
                },
                
                                
                copyToClipboardMessage(elementId){
                    console.log('pppp');
                    this.copyToClipboard (elementId);
                    jQuery("#urlcopied").text("Link copied to clipboard!");
                },
				
			}, 
			watch: {
				// whenever question changes, this function will run
				latitude: function (newlatitude, oldlatitude) {
					if(this.latitude !== false && this.longitude !== false){
						this.getWeatherInfo(this.latitude, this.longitude);
						this.getCityInfo (this.latitude, this.longitude);
					}
				},
				
				settings: function(item){
			        localStorage.setItem('settings', JSON.stringify(this.settings)); 
			    }
				
			}, 
			beforeMount: function () { 
			    
			    let settings = localStorage.getItem('settings');
			    if(settings !== null){
			        let settingsobj = JSON.parse(settings);
			        this.settings = {
			            ...this.settings,
			            ...settingsobj
			        }
			    }else{
			        localStorage.setItem('settings',JSON.stringify(this.settings));
			    }
			}, 
			mounted: function () { 
				this.getLocation();
			}, 
			updated: function () {
			    
			}, 
			template: `  
                       <div class="widget-root">
                            <div v-if="weatherDetails">
                                <div class="top-section">
                                    <div class="w-6/12 col-left hidden md:block">
                                        <div class="airtemperature">
                                            <span class="airtemp">{{weatherDetails.Weather.airTemperature}}°</span>
                                            <img :src="'https://admin.knowwake.com/images/'+weatherDetails.CraftAdvisoryIcon" v-if="weatherDetails.CraftAdvisory == 1" @click="toggleIconModal()">
                                        </div>
                                        <div class="airtemplowhing">
                                            <img :src="'https://admin.knowwake.com/images/'+weatherDetails.Weather.weatherIcon">
                                            <div class="airlowhigh">{{weatherDetails.Weather.airTemperatureLow}}° / {{weatherDetails.Weather.airTemperatureHigh}}°</div>
                                        </div>
                                        <div class="elementor-element elementor-element-85745f9 weather-button-seemore elementor-align-left elementor-widget elementor-widget-button" data-id="85745f9" data-element_type="widget" data-widget_type="button.default">
                                            <div class="elementor-widget-container">
                                                <div class="elementor-button-wrapper">
                                                    <a :href="getLink()" class="elementor-button-link elementor-button elementor-size-sm" role="button">
                                                        <span class="elementor-button-content-wrapper">
                                                            <span class="elementor-button-text">See more</span>
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-6/12 col-right hidden md:block">
                                        <div class="settingsicon" @click="toggleModal()">
                                            <i class="fa fa-cog" aria-hidden="true"></i>
                                        </div>

                                        <div class="suninfo">
                                            <div class="sunrise">
                                                <img src="https://www.knowwake.com/wp-content/uploads/2022/03/sunrise.png"> <span class="sunrisetime">{{dateTime(weatherDetails.Weather.sunrise) }} </span>
                                            </div>
                                            <div class="sunrise">
                                                <img src="https://www.knowwake.com/wp-content/uploads/2022/03/sunset.png"> <span class="sunrisetime">{{dateTime(weatherDetails.Weather.sunset) }}</span>
                                            </div>
                                        </div>
                                        <div class="windspeed">
                                            <span class="wind">{{weatherDetails.Weather.windSpeed}} <img :style="{ transform: 'rotate('+weatherDetails.Weather.windDirection+'deg)' }" src="https://www.knowwake.com/wp-content/uploads/2022/03/Arrow.png"></span>
                                        </div>
                                        <div class="tidelowhigh">
                                            High Tide: <strong>{{dateTime(weatherDetails.Weather.highTide)}}</strong><br>
                                            Low Tide: <strong>{{dateTime(weatherDetails.Weather.lowTide)}}</strong>
                                        </div>
                                        <div class="watertemp">
                                            <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Sea-Temp-icon.png"> Temp: <strong>{{weatherDetails.Weather.waterTemperature}}°</strong>
                                        </div>
                                    </div>
                                    <div class="w-full block md:hidden">
                                        <div class="settingsicon" @click="toggleModal()">
                                            <i class="fa fa-cog" aria-hidden="true"></i>
                                        </div>
                                        <div class="airtemperature">
                                            <span class="airtemp">{{weatherDetails.Weather.airTemperature}}°</span>
                                            <img :src="'https://admin.knowwake.com/images/'+weatherDetails.CraftAdvisoryIcon" v-if="weatherDetails.CraftAdvisory == 1">
                                        </div>
                                        <div class="w-6/12 col-left">
                                            <div class="airtemplowhing">
                                                <img :src="'https://admin.knowwake.com/images/'+weatherDetails.Weather.weatherIcon">
                                                <div class="airlowhigh">{{weatherDetails.Weather.airTemperatureLow}}° / {{weatherDetails.Weather.airTemperatureHigh}}°</div>
                                            </div>
                                        </div>
                                        <div class="w-6/12 col-right">
                                            <div class="suninfo">
                                                <div class="sunrise">
                                                    <img src="https://www.knowwake.com/wp-content/uploads/2022/03/sunrise.png"> <span class="sunrisetime">{{dateTime(weatherDetails.Weather.sunrise) }} </span>
                                                </div>
                                                <div class="sunrise">
                                                    <img src="https://www.knowwake.com/wp-content/uploads/2022/03/sunset.png"> <span class="sunrisetime">{{dateTime(weatherDetails.Weather.sunset) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="windspeed">
                                            <span class="wind">{{weatherDetails.Weather.windSpeed}} <img :style="{ transform: 'rotate('+weatherDetails.Weather.windDirection+'deg)' }" src="https://www.knowwake.com/wp-content/uploads/2022/03/Arrow.png"></span>
                                        </div>
                                        <div class="tidelowhigh">
                                            High Tide: <strong>{{dateTime(weatherDetails.Weather.highTide)}}</strong><br>
                                            Low Tide: <strong>{{dateTime(weatherDetails.Weather.lowTide)}}</strong>
                                        </div>
                                        <div class="watertemp">
                                            <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Sea-Temp-icon.png"> Temp: <strong>{{weatherDetails.Weather.waterTemperature}}°</strong>
                                        </div>
                                        <div class="locationdetails">
                                            <a :href="getLink()">{{address}} <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Pin.png"></a>
                                        </div>
                                        <div class="elementor-element elementor-element-85745f9 weather-button-seemore elementor-align-left elementor-widget elementor-widget-button" data-id="85745f9" data-element_type="widget" data-widget_type="button.default">
                                            <div class="elementor-widget-container">
                                                <div class="elementor-button-wrapper">
                                                    <a :href="getLink()" class="elementor-button-link elementor-button elementor-size-sm" role="button">
                                                        <span class="elementor-button-content-wrapper">
                                                            <span class="elementor-button-text">See more</span>
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="locationdetails hidden md:block">
                                    <a :href="getLink()">{{address}} <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Pin.png"></a>
                                </div>
                            </div>
                                
                            <div v-else>
                                <div class="loader"></div>
                            </div>
                        
                            <template v-if="iconmodal">
                                <div id="iconmodal">
                                    <div class="positionrelative">
                                    <span id="urlcopied"></span>
                                     <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Share.png" @click="copyToClipboardMessage('popupsectionicontext')">
                                        <div id="popupsectionicontext">
                                            <div class="closebutton"><img src="https://www.knowwake.com/wp-content/uploads/2022/03/btnX.png" @click="toggleIconModal()"></div>
                                            <ul id="example-1">
                                                <li v-for="item in weatherDetails.CraftAdvisoryData" :key="item.CraftAdvisoryTitle">
                                                    <h4>{{item.CraftAdvisoryTitle}}</h4>
                                                    <h5>{{item.CraftAdvisorySubTitle}}</h5>
                                                    <p class="advisorydatetime">{{item.CraftAdvisoryDateTime}}</p>
                                                    <p class="advisorycontent" v-html="item.CraftAdvisoryDetails"></p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            
                            <div id="modal" v-if="modal">
                                <div id="popupsection">
                                    <div class="closebutton"><img src="https://www.knowwake.com/wp-content/uploads/2022/03/btnX.png" @click="toggleModal()"></div>
                                    <div class="windspeedpop">
                                        <label>Wind speed</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.windspeed === 0 ? 'active' : '']" @click="toggleWindSpeed(0)">knots</li>
                                            <li :class="[settings.windspeed === 1 ? 'active' : '']" @click="toggleWindSpeed(1)">km/h</li>
                                            <li :class="[settings.windspeed === 2 ? 'active' : '']" @click="toggleWindSpeed(2)">mph</li>
                                            <li :class="[settings.windspeed === 3 ? 'active' : '']" @click="toggleWindSpeed(3)">m/s</li>
                                        </ul>
                                    </div>
                                    <div class="temperature">
                                        <label>Temperature</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.temperature === 0 ? 'active' : '']" @click="toggleTemperature(0)">°C</li>
                                            <li :class="[settings.temperature === 1 ? 'active' : '']" @click="toggleTemperature(1)">°F</li>
                                        </ul>
                                    </div>
                                    <div class="swellheight">
                                        <label>Swell height</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.swellheight === 0 ? 'active' : '']" @click="toggleSwellHeight(0)">meters</li>
                                            <li :class="[settings.swellheight === 1 ? 'active' : '']" @click="toggleSwellHeight(1)">feet</li>
                                        </ul>
                                    </div>
                                    <div class="tideheigt">
                                        <label>Tide heigt</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.tideheight === 0 ? 'active' : '']" @click="toggleTideHeight(0)">meters</li>
                                            <li :class="[settings.tideheight === 1 ? 'active' : '']" @click="toggleTideHeight(1)">feet</li>
                                        </ul>
                                    </div>
                                    <input type="button" class="weathersettingsupdate" value="UPDATE" @click="updateWeatherSettings()">
                                </div>
                            </div>
                            <div v-else>
                            </div>
                            
                        </div>
			`, 
		});
	}

	// detils app 
	if(appDetailsEl){

	    Vue.component("line-chart", {
           
                props: ['apidata'],
                watch: {
                    apidata: function(newData, oldData){
                        this.chartRanderInit();
                    }
                }, 
                methods: {
                    chartRanderInit(){
                       
                        let labels = this.apidata.Wind.map(function(item){
                            return moment(item.time).format('h A');
                        });
                        let labelsData = this.apidata.Wind.map(function(item){
                            return item.noaa;
                        });
                        
                        let winddirPoint = this.apidata.Wind.map(function(item){
                            return item.winddir16Point;
                        });
                        
                        //console.log( labelsData );
    
                        var ctx = document.getElementById("myChart").getContext("2d");
                        var chart =new Chart(ctx , { 
                            type: 'bar', 
                            data: {
                                labels: labels,
                                datasets: [
                                  {
                                    label: false,
                                    backgroundColor: "#1cb3f2",
                                    data: labelsData,
                                  },
                                ],
                            }, 
                            options: { 
                                events: [], 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                
                                "hover": {
                                     "animationDuration": 0
                                }, 
                                
                                "animation": {
                                  "duration": 1,
                                  "onComplete": function() {
                                    var chartInstance = this.chart,
                                      ctx = chartInstance.ctx;
                            
                                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                            
                                    this.data.datasets.forEach(function(dataset, i) {
                                      var meta = chartInstance.controller.getDatasetMeta(i);
                                      meta.data.forEach(function(bar, index) {
                                        var data = labelsData[index] + ' (' + winddirPoint[index] + ')';
                                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                      });
                                    });
                                  }
                                },
                                legend: {
                                    display: false
                                 },
                                 tooltips: {
                                    enabled: false
                                 },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: {
                                        display: false,
                                        text: 'Chart.js Stacked Line/Bar Chart'
                                    },
                                    labels: {
                                        render: function (args) {
                                            return ' ';
                                        },
                                        fontColor: '#000000',
                                    }
                                },
                    
                                
                                scales: {
                                    xAxes: [{
                                        maxBarThickness: 1,
                                        categoryPercentage: 0.5, 
                                        barPercentage: 1.0, 
                                        gridLines: {
                                            display:false, 
                                        },
                                    

                                    }],
                                    yAxes: [{
                                        display: false, 
                                        gridLines: {
                                            display:false,
                                        },
                                        
                                        ticks: {
                                            max: this.apidata.WindMaxValue + 2,
                                        }
                                    }]
                                }
                            } }); 
                        chart.update();
                    }
                }, 
                mounted() { 
                    this.chartRanderInit();
                },
                updated(){
                    //console.log('updated');
                },
                template: `
                <div class="chartWrapper">
                    <div class="chartAreaWrapper">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
                `
        });
        
        Vue.component("swell-chart", {
                // extends: VueChartJs.Bar,
                props: ['apidata'],
                watch: {
                    apidata: function(newData, oldData){
                        this.chartRanderInit();
                    }
                },
                methods: {
                    chartRanderInit(){
                        let labels = this.apidata.swell.map(function(item){
                            return moment(item.time).format('h A');
                        });
                        let labelsData = this.apidata.swell.map(function(item){
                            return item.noaa;
                        });
                    
                        
                        var ctx = document.getElementById("swellChart").getContext("2d");
                        var chart = new Chart(ctx , { 
                            type: 'bar', 
                        data: {
                                labels: labels,
                                datasets: [
                                  {
                                    label: false,
                                    backgroundColor: "#1cb3f2",
                                    data: labelsData,
                                    borderColor: "#1cb3f2",
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderSkipped: false,
                                  },
                                ],
                            }, 
                        options: {
                                events: [], 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                "hover": {
                                     "animationDuration": 0,
                                }, 
                                "animation": {
                                  "duration": 1,
                                  "onComplete": function() {
                                    var chartInstance = this.chart,
                                      ctx = chartInstance.ctx;
                            
                                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                            
                                    this.data.datasets.forEach(function(dataset, i) {
                                      var meta = chartInstance.controller.getDatasetMeta(i);
                                      meta.data.forEach(function(bar, index) {
                                        var data = labelsData[index];
                                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                      });
                                    });
                                  }
                                },
                                legend: {
                                    display: false
                                 },
                                 tooltips: {
                                    enabled: false
                                 },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: {
                                        display: false,
                                        text: 'Chart.js Stacked Line/Bar Chart'
                                    },
                                    labels: {
                                        // render: 'percentage',
                                        render: function (args) {
                                            // console.log(args);
                                            return 'ppppppp';
                                        },
                                        fontColor: '#000000',
                                    }
                                },
                                scales: {
                                    xAxes: [{
                                        maxBarThickness: 50,
                                        categoryPercentage: 0.5, 
                                        barPercentage: 1.0, 
                                        gridLines: {
                                            display:false, 
                                        }
                                    }],
                                    yAxes: [{
                                        display: false, 
                                        gridLines: {
                                            display:false,
                                        },
                                        ticks: {
                                            max: this.apidata.swellMaxValue
                                        }
                                    }]
                                }
                            } });
                        chart.update();
                    }
                }, 
                mounted() { 
                    this.chartRanderInit();
                },
                template: `
                <div class="chartWrapper">
                    <div class="chartAreaWrapper">
                        <canvas id="swellChart"></canvas>
                    </div>
                </div>
                `
        });
        
        Vue.component("precipitation-chart", {
                // extends: VueChartJs.Bar,
                props: ['apidata'],
                watch: {
                    apidata: function(newData, oldData){
                        this.chartRanderInit();
                    }
                },
                methods: {
                    chartRanderInit(){
                        let labels = this.apidata.precipitation.map(function(item){
                            return moment(item.time).format('h A');
                        });
                        let labelsData = this.apidata.precipitation.map(function(item){
                            return item.noaa;
                        });
                     
                        var ctx = document.getElementById("precipitationChart").getContext("2d");
                        var chart = new Chart(ctx , { 
                            type: 'bar', 
                            data: {
                                    labels: labels,
                                    datasets: [
                                      {
                                        label: false,
                                        backgroundColor: "#1cb3f2",
                                        data: labelsData,
                                      },
                                    ],
                                }, 
                            options: { 
                                events: [], 
                                    responsive: true, 
                                    maintainAspectRatio: false, 
                                    "hover": {
                                         "animationDuration": 0
                                    }, 
                                    "animation": {
                                      "duration": 1,
                                      "onComplete": function() {
                                        var chartInstance = this.chart,
                                          ctx = chartInstance.ctx;
                                
                                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'bottom';
                                
                                        this.data.datasets.forEach(function(dataset, i) {
                                          var meta = chartInstance.controller.getDatasetMeta(i);
                                          meta.data.forEach(function(bar, index) {
                                            var data = labelsData[index]+'%';
                                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                          });
                                        });
                                      }
                                    },
                                    legend: {
                                        display: false
                                     },
                                     tooltips: {
                                        enabled: false
                                     },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        title: {
                                            display: false,
                                            text: 'Chart.js Stacked Line/Bar Chart'
                                        },
                                        labels: {
                                            // render: 'percentage',
                                            render: function (args) {
                                                // console.log(args);
                                                return 'ppppppp';
                                            },
                                            fontColor: '#000000',
                                        }
                                    },
                                    scales: {
                                        xAxes: [{
                                            maxBarThickness: 50,
                                            categoryPercentage: 0.5, 
                                            barPercentage: 1.0, 
                                            gridLines: {
                                                display:false, 
                                            }
                                        }],
                                        yAxes: [{
                                            display: false, 
                                            gridLines: {
                                                display:false,
                                            },
                                            ticks: {
                                                max: this.apidata.precipitationMaxValue
                                            }
                                        }]
                                    }
                                } 
                        });
                        chart.update();
                    }
                }, 
                mounted() { 
                    this.chartRanderInit();
                },
                template: `
                <div class="chartWrapper">
                    <div class="chartAreaWrapper">
                        <canvas id="precipitationChart" height="300" width="1200"></canvas>
                    </div>
                </div>
                `
        });
        
        Vue.component("tide-chart", {
                // extends: VueChartJs.Bar,
                props: ['apidata'],
                watch: {
                    apidata: function(newData, oldData){
                        this.chartRanderInit();
                    }
                },
                methods: {
                    chartRanderInit(){
                        let labels = this.apidata.tide.map(function(item){
                            return moment(item.time).format('h A');
                        });
                        let timesData = this.apidata.tide.map(function(item){
                            return item.time;
                        });
                        let labelsData = this.apidata.tide.map(function(item){
                            return item.height;
                        });

                        
                        var apiCurrentTime = this.apidata.currentTime;
                        console.log(apiCurrentTime);
                        var ctx = document.getElementById("tidesChart").getContext("2d");
                        
                        // ************************ new code start **************************
                        // console.log(Chart.DatasetController);
                        var myLineExtend = Chart.controllers.line.prototype.draw;
                        
                        var tideLineObj = Chart.controllers.line.extend({
                            draw: function (item) {
                                myLineExtend.apply(this, arguments);   
                                
                                let CT_currentTime  = moment(apiCurrentTime);
                                let CT_startIndex   = false;
                                let CT_endIndex     = false;
                                let CT_LSBTIN       = false; // Line Should Betwin index
                                let CT_LSBTH        = false; // Line hours Betwin hours
                                let CT_timesData    = this.chart.config.data.timesData;
                          
                              
                                for(let x=0; x<(CT_timesData.length -1); x++){   
                                    if( CT_currentTime.isAfter(moment(CT_timesData[x])) && CT_currentTime.isBefore( moment(CT_timesData[x+1]))  ){
                                        CT_startIndex = x;
                                        CT_endIndex   = (x+1);
                                        CT_LSBTH = [ moment(CT_timesData[x]).valueOf(), moment(CT_timesData[x+1]).valueOf() ]; 
                                        break;
                                    }
                                } 
                                
                      
                                if(CT_startIndex >= 0 && CT_endIndex >= 1){
                                  
                                    var chart = this.chart;
                                    var ctx = chart.chart.ctx;
                                    
                                    //   var index = chart.config.data.lineAtIndex;
                                    var index = 2;
                                    var xaxis = chart.scales['x-axis-0'];
                                    var yaxis = chart.scales['y-axis-0'];
                                    
                                    CT_LSBTIN =[ xaxis.getPixelForValue(undefined, CT_startIndex), xaxis.getPixelForValue(undefined, CT_endIndex) ];

                           
                                    // time cal start
                                    let slotTime        = (CT_LSBTH[1] - CT_LSBTH[0]);
                                    let slotTimeCurrent = (CT_currentTime.valueOf() - CT_LSBTH[0]);
                                    let slotTimeToPercent = ((slotTimeCurrent / slotTime) * 100); 
                                    // time cal end
                                    
                                    // width cal start
                                    let slotWidth       = (CT_LSBTIN[1] - CT_LSBTIN[0]); 
                                    let slotExtrawWidth = ((slotWidth * Math.round(slotTimeToPercent)) / 100); 
                                    let CT_Line_XP      = ( CT_LSBTIN[0] + slotExtrawWidth); 
                                    // width cal end
                                
                                    ctx.setLineDash([10, 10]);
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.moveTo(CT_Line_XP, yaxis.top + 24);
                                    ctx.strokeStyle = '#f58235';
                                    ctx.lineTo(CT_Line_XP, yaxis.bottom);
                                    ctx.stroke();
                                    ctx.restore();
                                
                                    ctx.textAlign = 'center';
                                    ctx.fillStyle = "#000000";
                                    ctx.fillText(CT_currentTime.format('h:mm A').toString(), CT_Line_XP, yaxis.top + 12);
                                    
                                }
                            }
                        });
                        
                        Chart.controllers.tideLine = tideLineObj;
                        // ************************ new code end **************************
                        
                        var chart = new Chart(ctx , { 
                                type: 'tideLine',
                                data: {
                                    labels: labels,
                                    datasets: [
                                      {
                                        label: false,
                                        backgroundColor: "#1cb3f2",
                                        data: labelsData,
                                      },
                                    ],
                                    datasetFill : false,
                                    timesData: timesData
                                }, 
                                options: { 
                                    events: [], 
                                    responsive: true, 
                                    elements: {
                                      line: {
                                        fill: false,
                                        borderColor: "#1cb3f2",
                                      },
                                      
                                      point: {
                                        backgroundColor: "#ffffff",
                                        hoverBackgroundColor: "#ffffff",
                                        radius: 5,
                                        hoverRadius: 5,
                                      }
                                    },
                                    maintainAspectRatio: false, 
                                    "hover": {
                                         "animationDuration": 0
                                    }, 
                                    legend: false,
                                    
                                     tooltips: {
                                        enabled: false
                                     },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        title: {
                                            display: false,
                                            text: 'Chart.js Stacked Line/Bar Chart'
                                        },
                                        labels: {
                                        
                                            render: function (args) {
                                  
                                                return 'ppppppp';
                                            },
                                            fontColor: '#000000',
                                        }
                                    },
                                    scales: {
                                        xAxes: [{
                                            maxBarThickness: 50,
                                            categoryPercentage: 0.5, 
                                            barPercentage: 1.0, 
                                            gridLines: {
                                                display:false, 
                                            }
                                        }],
                                        yAxes: [{
                                            display: false, 
                                            gridLines: {
                                                display:false,
                                            },
                                            ticks: {
                                                
                                                max: this.apidata.tideMaxValue + 2
                                            }
                                        }]
                                    }, 
                                    draw: function (item) {
                                        // console.log(item);
                                        // console.log(this);
                                    }
                                } 
                            });
                        chart.update();
                    }
                }, 
                mounted() {
                    this.chartRanderInit();
                },
                template: `
                <div class="chartWrapperTides">
                    <div class="chartAreaWrapperTides">
                        <canvas id="tidesChart"></canvas>
                    </div>
                </div>
                `
        });
        
        Vue.component("solunarsun-chart", {
                // extends: VueChartJs.Bar,
                props: ['apidata'],
                watch: {
                    apidata: function(newData, oldData){
                        this.chartRanderInit();
                    }
                },
                methods: {
                    chartRanderInit(){
                        let labels = ['sunstart', 'sunCurrent'];
                        let currentTime = moment().format('H'); 
                        let labelsData = [0, 0 ];
                        let labelsDataTime = [this.apidata.solunar.sunrise, this.apidata.solunar.sunset ];
                        
                        var apiCurrentTime = this.apidata.currentTime;
           
                        var ctx = document.getElementById("solunarSunChart").getContext("2d");
                            
                            // ************************ new code start **************************
                            // console.log(Chart.DatasetController);
                            var myLineExtend = Chart.controllers.line.prototype.draw;
                            
                            var sunLineObj = Chart.controllers.line.extend({
                                draw: function (item) { 
                              
                                    // myLineExtend.apply(this, arguments);    
                                    
                                        var chart = this.chart;
                                        var ctx = chart.chart.ctx;   
                                        
                                        var xaxis = chart.scales['x-axis-0'];
                                        var yaxis = chart.scales['y-axis-0'];
                                         
                                        
                                        // time cal start
                                        let slotTime        = (moment(labelsDataTime[1]).valueOf() - moment(labelsDataTime[0]).valueOf());
                                        let slotTimeCurrent = (moment(apiCurrentTime).valueOf() - moment(labelsDataTime[0]).valueOf());
                                        let slotTimeToPercent = ((slotTimeCurrent / slotTime) * 100); 
                                     
                                        // time cal end
                                        
                                        // width cal start
                                        let slotWidth       = this.chart.width; 
                                        let slotExtrawWidth = ((slotWidth * Math.round(slotTimeToPercent)) / 100);  
                                        // width cal end 
                                        
                                        ctx.beginPath(); 
                                        ctx.moveTo(0, this.chart.height);
                                        ctx.quadraticCurveTo((this.chart.width/2), -140, this.chart.width, this.chart.height);
                                        ctx.fillStyle = "#a2dcf4"; 
                                        ctx.fill();
                                        
                                        ctx.beginPath(); 
                                        ctx.moveTo(0, this.chart.height);
                                        ctx.quadraticCurveTo((this.chart.width/2), -140, this.chart.width, this.chart.height);
                                        ctx.strokeStyle = '#1cb3f2';
                                        ctx.lineWidth = 2;
                                        ctx.stroke();  
                                        
                                        ctx.save();
                                        ctx.beginPath();
                                        ctx.setLineDash([10, 10]);
                                        ctx.moveTo(slotExtrawWidth, yaxis.top + 24);
                                        ctx.strokeStyle = '#f58235';
                                        ctx.lineTo(slotExtrawWidth, yaxis.bottom);
                                        ctx.stroke();
                                        ctx.restore();
                                    
                                        ctx.textAlign = 'center';
                                        ctx.fillStyle = "#000000";
                                    
                                        ctx.fillText(moment(apiCurrentTime).format('h:mm A'), slotExtrawWidth, yaxis.top + 22); 
                                }
                            });
                            
                            Chart.controllers.sunLine = sunLineObj;
                            // ************************ new code end **************************
                        
                        let sunchatObj = new Chart(ctx , { 
                            type: 'sunLine',
                            data: {
                                labels: labels,
                                datasets: [
                                  {
                                    label: false, 
                                    data: labelsData, 
                                  },
                                ],
                            }, 
                            options: { 
                                events: [],
                                responsive: true, 
                                elements: {
                                  line: {
                                    fill: true,
                                    backgroundColor: '#dbecf4', 
                                    borderColor: "#1cb3f2",
                                  },
                                },
                                maintainAspectRatio: false, 
                                "hover": {
                                     "animationDuration": 0
                                }, 
                                "animation": {
                                  "duration": 1,
                                  "onComplete": function() {
                                        
                                  }
                                },
                                legend: false, 
                                 tooltips: {
                                    enabled: false
                                 },
                                plugins: {
                                    legend: {
                                      display: false
                                    },
                                    title: {
                                        display: false,
                                        text: 'Chart.js Stacked Line/Bar Chart'
                                    },
                                    labels: {
                                        // render: 'percentage',
                                        render: function (args) {
                                            // console.log(args);
                                            return 'ppppppp';
                                        },
                                        fontColor: '#000000',
                                    },
                                    tooltip: {
                                      enabled: false
                                    },
                                    datalabels: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    xAxes: [{
                                        display: false, 
                                        maxBarThickness: 50,
                                        categoryPercentage: 0.5, 
                                        barPercentage: 1.0, 
                                        gridLines: {
                                            display:false, 
                                        }
                                    }],
                                    yAxes: [{
                                        display: false, 
                                        gridLines: {
                                            display:false,
                                        }
                                    }]
                                }
                            } });
                        sunchatObj.update(); 
                    }
                }, 
                mounted() { 
                    this.chartRanderInit();
                },
                template: `
                <div class="chartWrapperSun">
                    <div class="chartAreaWrapperSun">
                        <canvas id="solunarSunChart"></canvas>
                    </div>
                </div>
                `
        });
        
        Vue.component("solunarmoon-chart", {
                // extends: VueChartJs.Bar,
                props: ['apidata'],
                watch: {
                    apidata: function(newData, oldData){
                        this.chartRanderInit();
                    }
                },
                methods: {
                    chartRanderInit(){
                        let labels = ['moonstart', 'moonEnd'];
                        let labelsData = [0, 0];
                        let labelsDataTime = [this.apidata.solunar.moonrise, this.apidata.solunar.moonset ];
                        
                        var apiCurrentTime = this.apidata.currentTime;
                        
                        var ctx = document.getElementById("solunarMoonChart").getContext("2d");
                        
                        // ************************ new code start **************************
                            // console.log(Chart.DatasetController);
                            var myLineExtend = Chart.controllers.line.prototype.draw;
                            
                            var monLineObj = Chart.controllers.line.extend({
                                draw: function (item) { 
                                    // myLineExtend.apply(this, arguments);    
                                    
                                        var chart = this.chart;
                                        var ctx = chart.chart.ctx;   
                                        
                                        var xaxis = chart.scales['x-axis-0'];
                                        var yaxis = chart.scales['y-axis-0'];
                                         
                                        
                                        // time cal start
                                        let slotTime        = (moment(labelsDataTime[1]).valueOf() - moment(labelsDataTime[0]).valueOf());
                                        let slotTimeCurrent = (moment(apiCurrentTime).valueOf() - moment(labelsDataTime[0]).valueOf());
                                        let slotTimeToPercent = ((slotTimeCurrent / slotTime) * 100); 
                                     
                                        // time cal end
                                        
                                        // width cal start
                                        let slotWidth       = this.chart.width; 
                                        let slotExtrawWidth = ((slotWidth * Math.round(slotTimeToPercent)) / 100);  
                                        // width cal end 
                                        
                                        ctx.beginPath(); 
                                        ctx.moveTo(0, this.chart.height);
                                        ctx.quadraticCurveTo((this.chart.width/2), -140, this.chart.width, this.chart.height);
                                        ctx.fillStyle = "#a2dcf4"; 
                                        ctx.fill();
                                        
                                        ctx.beginPath(); 
                                        ctx.moveTo(0, this.chart.height);
                                        ctx.quadraticCurveTo((this.chart.width/2), -140, this.chart.width, this.chart.height);
                                        ctx.strokeStyle = '#1cb3f2';
                                        ctx.lineWidth = 2;
                                        ctx.stroke();  
                                        
                                        ctx.save();
                                        ctx.beginPath();
                                        ctx.setLineDash([10, 10]);
                                        ctx.moveTo(slotExtrawWidth, yaxis.top + 24);
                                        ctx.strokeStyle = '#f58235';
                                        ctx.lineTo(slotExtrawWidth, yaxis.bottom);
                                        ctx.stroke();
                                        ctx.restore();
                                    
                                        ctx.textAlign = 'center';
                                        ctx.fillStyle = "#000000";
                                        ctx.fillText(moment(apiCurrentTime).format('h:mm A'), slotExtrawWidth, yaxis.top + 12); 
                                }
                            });
                            
                            Chart.controllers.monLine = monLineObj;
                            // ************************ new code end **************************
                            
                        let monchatObj = new Chart(ctx , { 
                            type: 'monLine',
                            
                            data: {
                                labels: labels,
                                datasets: [
                                  {
                                    label: false, 
                                    data: labelsData, 
                                  },
                                ],
                            }, 
                            options: { 
                                responsive: true, 
                                elements: {
                                  line: {
                                    fill: true,
                                    backgroundColor: '#dbecf4', 
                                    borderColor: "#1cb3f2",
                                  },
                                },
                                maintainAspectRatio: false, 
                                "hover": {
                                     "animationDuration": 0
                                }, 
                                "animation": {
                                  "duration": 1,
                                  "onComplete": function() {
                                    var chartInstance = this.chart,
                                      ctx = chartInstance.ctx;
                            
                                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                            
                                    this.data.datasets.forEach(function(dataset, i) {
                                      var meta = chartInstance.controller.getDatasetMeta(i);
                                      meta.data.forEach(function(bar, index) {
                                        var data = labelsData[index];
                                        // ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                      });
                                    });
                                  }
                                },
                                legend: {
                                    display: false
                                 },
                                 tooltips: {
                                    enabled: false
                                 },
                                plugins: {
                                    legend:false,
                                    title: {
                                        display: false,
                                        text: 'Chart.js Stacked Line/Bar Chart'
                                    },
                                    labels: {
                                        // render: 'percentage',
                                        render: function (args) {
                                            // console.log(args);
                                            return 'ppppppp';
                                        },
                                        fontColor: '#000000',
                                    }
                                },
                                scales: {
                                    xAxes: [{
                                        display: false, 
                                        maxBarThickness: 50,
                                        categoryPercentage: 0.5, 
                                        barPercentage: 1.0, 
                                        gridLines: {
                                            display:false, 
                                        }
                                    }],
                                    yAxes: [{
                                        display: false, 
                                        gridLines: {
                                            display:false,
                                        }
                                    }]
                                }
                            } });
                        monchatObj.update();
                    }
                }, 
                mounted() { 
                    this.chartRanderInit();
                },
                template: `
                <div class="chartWrapperMoon">
                    <div class="chartAreaWrapperMoon">
                        <canvas id="solunarMoonChart"></canvas>
                    </div>
                </div>
                `
        });
        

        
		var mainAppDetails = new Vue({
			el: '#weather-details-box',
			data: {
				latitude: false, 
				longitude: false,
				currentTime: false,
				weatherDetails: false,
				weatherCityDetails: false,
				weatherStateDetails:false,
				autoCompleteStrated: false, 
				autocomplete: false,
				modal:false,
				iconmodal: false,
				settings: {
				    temperature : 1,
				    windspeed : 2,
				    swellheight: 1,
				    tideheight: 1,
				},
				sunmoonbutton: 'sun',
				datesettings: 'now',
				geocoder: false,
				address: false,
			}, 
			watch: {
			    weatherDetails: function(){  
			    },
			    settings: function(item){
			        localStorage.setItem('settings', JSON.stringify(this.settings)); 
			    }
			}, 
			methods: {
				setLocation () {
					let params = new URLSearchParams(window.location.search);
				
				    this.latitude = params.get('lat') ? params.get('lat') : false;
				    this.longitude = params.get('lon') ? params.get('lon') : false;
				    

				    sessionStorage.setItem('lat',this.latitude);
                    sessionStorage.setItem('lon', this.longitude);
				   
				}, 
				
				getDateTime (days = 'now') { 
					let datetime = new moment((this.currentTime == false ? '' : this.currentTime) );
					if( (days !== 'now') && (days > 0) ){
					    datetime.add(days, 'days');
					}
					return datetime.format('YYYY-MM-DD h:mm:ss');
				}, 
				
				getWeatherInfo (lat, lon, date = 'now'){
					let insOfApp = this;
					let startdate = this.getDateTime(date);
					let url = "https://api.knowwake.com/wx_data_details.php?lat="+lat+"&lng="+lon+"&start="+startdate+"&";
				
					if(this.settings.temperature !==1 ) { url = url + "temp="+ this.settings.temperature } else { url = url + "temp=1" }

					if(this.settings.windspeed !==2 ) { url = url + "&windSpeed="+ this.settings.windspeed } else { url = url + "&windSpeed=2" }
				
					if(this.settings.swellheight !==1 ) { url = url + "&swellHeight="+ this.settings.swellheight } else { url = url + "&swellHeight=1" }
					
					if(this.settings.tideheight !==1 ) { url = url + "&tideHeight="+ this.settings.tideheight } else { url = url + "&tideHeight=1" }
					
					
                  
					let result = $.ajax({
						url: url,
						cache: false,
						dataType : 'json',   //you may use jsonp for cross origin request
  						crossDomain:true,
						success: function(res){ 
						    if(insOfApp.currentTime == false){
						        insOfApp.currentTime = res.details.currentTime; 
						        insOfApp.getWeatherInfo(insOfApp.latitude, insOfApp.longitude, date);
						    }else {
						        insOfApp.currentTime = false; 
							    insOfApp.weatherDetails = res.details;  
						    }
						}
					});
				}, 
				
				codeLatLng(lat, lng){
				    var address;
				    var thisInstance = this;
				    var latlng = new google.maps.LatLng(lat, lng);
				    
                    this.geocoder.geocode({'latLng': latlng}, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                          //console.log(results);
                            if (results[1]) {
                                var indice=0;
                                for (var j=0; j<results.length; j++)
                                {
                                    if (results[j].types[0]=='locality')
                                        {
                                            indice=j;
                                            break;
                                        }
                                }
                            
                                // console.log(results[j]);
                                for (var i=0; i<results[j].address_components.length; i++)
                                {
                                    if (results[j].address_components[i].types[0] == "locality") {
                                            //this is the object you are looking for City
                                            city = results[j].address_components[i];
                                        }
                                    if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                                            //this is the object you are looking for State
                                            region = results[j].address_components[i];
                                        }
                                    if (results[j].address_components[i].types[0] == "country") {
                                            //this is the object you are looking for
                                            country = results[j].address_components[i];
                                        }
                                }
                                
                                //console.log(city.long_name);
                                //city data
                                address = city.long_name + ", " + region.short_name ;
    
                            
                            } else {
                                  address = "No results found";
                            }
                            
                            
                            //}
                      } else {
                        //address = "Geocoder failed due to: " + status;
                      }

                      thisInstance.address = address;
                    });        
				},
				
				geoLocationSuccess(){
			        var lat = this.latitude;
                    var lng = this.longitude;
                    this.codeLatLng(lat, lng);
				},
				
				geoLocationError(){
				    
				},
				
				getCityInfo (){
				    
				    this.geocoder = new google.maps.Geocoder();
				    
				    if (navigator.geolocation) {
				        this.geoLocationSuccess();
                        //navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError);
                    }
				},
				
				dateTime(value) {
                  return moment(value).format("h:mm A");
                },
                
                getLocationFromGoogle(){
                    let place       = this.autocomplete.getPlace();
                    
                    this.latitude   = place.geometry.location.lat();
                    this.longitude  = place.geometry.location.lng();
                    
                    sessionStorage.setItem('lat',this.latitude);
                    sessionStorage.setItem('lon', this.longitude);
                    
                    this.getWeatherInfo(this.latitude, this.longitude);
                    
                    // var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?lat='+this.latitude+'&lng='+this.longitude;
                    // window.history.pushState({path:newurl},'',newurl);
                    
                    this.getCityInfo ();
                    
                    var queryParams = new URLSearchParams(window.location.search);
 
                    // Set new or modify existing parameter value. 
                    queryParams.set("lat", this.latitude);
                    queryParams.set("lon", this.longitude);
                     
                    // Replace current querystring with the new one.
                    history.replaceState(null, null, "?"+queryParams.toString());
                    
                    
                },
                
                searchAddressFromGoogle(){  
			        let input = this.$refs.searchfield; 
			        
                    this.autocomplete = new google.maps.places.Autocomplete(input);
                    this.autocomplete.addListener('place_changed', this.getLocationFromGoogle);
                    this.autoCompleteStrated = true;
             
                }, 
                
                changeWeather(days){
                    this.getWeatherInfo(this.latitude, this.longitude, days);
                    this.datesettings = days;
                },
                
                toggleModal(){
                    this.modal = !this.modal;
                    $( "body" ).toggleClass( "myClassyourClass" );
                }, 
                
                toggleIconModal(){
                    this.iconmodal = !this.iconmodal;
                    $( "body" ).toggleClass( "myClassyourClass" );
                }, 
                
                toggleTemperature(temp){
                    this.settings = {
                        ...this.settings, 
                        temperature : temp
                    }
                    //this.settings.temperature = temp;
                },
                toggleWindSpeed(wind){
                    this.settings = {
                        ...this.settings, 
                        windspeed : wind
                    }
                    //this.settings.windspeed = wind;
                },
                toggleSwellHeight(swell){
                    this.settings = {
                        ...this.settings, 
                        swellheight : swell
                    }
                    //this.settings.swellheight = swell;
                },
                toggleTideHeight(tide){
                    this.settings = {
                        ...this.settings, 
                        tideheight : tide
                    }
                    //this.settings.tideheight = tide;
                },
                
                updateWeatherSettings(){
                    this.getWeatherInfo(this.latitude, this.longitude);
                    this.modal = false;
                },
                
                searchValue() {
                    return this.weatherStateDetails + ', '+ this.weatherCityDetails;
                },
                
                toggleSunMon(sunmoon){
                    this.sunmoonbutton = sunmoon;
                },
                
                initMap() {							
        			
        			var myLatLng = {
        			        lat: Number( this.latitude ),
                            lng: Number( this.longitude )
        			    };
        			
        			map = new google.maps.Map(document.getElementById('mapName'), {
        			    center: {
                            lat: myLatLng.lat,
                            lng: myLatLng.lng
                        },
        			  zoom: 14,
        			  disableDefaultUI: true,
                      keyboardShortcuts: false,
        			});
        			
        			const image = "https://www.knowwake.com/wp-content/uploads/2022/03/wx_pin-1.png";

        					
        			var marker = new google.maps.Marker({
        			  position: myLatLng,
        			  map: map,
        			  icon: image,

        			  title: myLatLng.lat + ', ' + myLatLng.lng 
        			});	
        			
                    map.addListener("center_changed", () => {
                    // 3 seconds after the center of the map has changed, pan back to the
                    // marker.
                    window.setTimeout(() => {
                      map.panTo(marker.getPosition());
                    }, 3000);
                    });
                    marker.addListener("click", () => {
                        map.setZoom(14);
                        map.setCenter(marker.getPosition());
                    });
  
        		}, 
        		
        		
        		copyToClipboard (elementId) {
                    var r = document.createRange();
                    r.selectNode(document.getElementById(elementId));
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(r);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                   
                },
                
                                
                copyToClipboardMessage(elementId){
                    this.copyToClipboard (elementId);
                    jQuery("#urlcopied").text("Link copied to clipboard!");
                },


			}, 

			created: function(){ 
			    this.setLocation();	 
			},
			beforeMount: function () { 
			    
			    let settings = localStorage.getItem('settings');
			    if(settings !== null){
			        let settingsobj = JSON.parse(settings);
			        this.settings = {
			            ...this.settings,
			            ...settingsobj
			        }
			    }else{
			        localStorage.setItem('settings',JSON.stringify(this.settings));
			    }
			    
			    
				if(this.latitude !== false && this.longitude !== false){
					this.getWeatherInfo(this.latitude, this.longitude);
					this.getCityInfo ();	
				}	
			}, 
			mounted: function(){
			},
			updated: function () { 
			    if( (this.weatherDetails !== false) && (this.autoCompleteStrated === false) ){
			        this.searchAddressFromGoogle();
			        this.initMap();
			    }
			    if( this.latitude !== false &&  this.longitude !== false ){
			        this.initMap();
			        
			        
			    }
			},
			
			template: `  
                        <div class="widget-root-section">
                            <div v-if="weatherDetails">
                                <div class="weatherdetailsdiv flex columns-2">
                                    <div class="weatherinfosection w-full md:w-1/2 items-center m-3 p-6">
                                        <div class="searchsection">
                                            <input type="text" class="w-full searchfield" id="searchfield" ref="searchfield" :value="address" />
                                        </div>
                                        <ul class="calenderdate inline-flex">
                                            <li class="p-3" @click="changeWeather('now')" :class="[datesettings === 'now' ? 'activedate' : '']"> <span class="date">{{ new moment(weatherDetails.currentTime).format('D') }}</span> <br>Today</li>
                                            <li class="p-3" @click="changeWeather(1)" :class="[datesettings === 1 ? 'activedate' : '']"><span class="date">{{ new moment(weatherDetails.currentTime).add(1, 'days').format('D') }} </span><br>{{new moment().add(1, 'days').format('ddd')}}</li>
                                            <li class="p-3" @click="changeWeather(2)" :class="[datesettings === 2 ? 'activedate' : '']"><span class="date">{{ new moment(weatherDetails.currentTime).add(2, 'days').format('D') }} </span><br>{{new moment().add(2, 'days').format('ddd')}}</li>
                                            <li class="p-3" @click="changeWeather(3)" :class="[datesettings === 3 ? 'activedate' : '']"><span class="date">{{ new moment(weatherDetails.currentTime).add(3, 'days').format('D') }} </span><br>{{new moment().add(3, 'days').format('ddd')}}</li>
                                            <li class="p-3" @click="changeWeather(4)" :class="[datesettings === 4 ? 'activedate' : '']"><span class="date">{{ new moment(weatherDetails.currentTime).add(4, 'days').format('D') }} </span><br>{{new moment().add(4, 'days').format('ddd')}}</li>
                                        </ul>
                                        
                                        <div class="top-section">
                                            <div class="col-left">
                                                <template v-if ="datesettings == 'now'">
                                                    <div class="airtemperature">
                                                        <span class="airtemp">{{weatherDetails.Weather.airTemperature}}°</span>
                                                        <img :src="'https://admin.knowwake.com/images/'+weatherDetails.CraftAdvisoryIcon" v-if="weatherDetails.CraftAdvisory == 1" @click="toggleIconModal()">
                                                    </div>
                                                </template>
                                                <div class="airtemplowhing">
                                                    <img :src="'https://admin.knowwake.com/images/'+weatherDetails.Weather.weatherIcon">
                                                    <div class="airlowhigh">{{weatherDetails.Weather.airTemperatureLow}}° / {{weatherDetails.Weather.airTemperatureHigh}}°</div>
                                                </div>
                                            </div>
                                            <div class="col-right">
                                                <div class="windspeed">
                                                    <span class="wind">{{weatherDetails.Weather.windSpeed}} <img :style="{ transform: 'rotate('+weatherDetails.Weather.windDirection+'deg)' }" src="https://www.knowwake.com/wp-content/uploads/2022/03/Arrow.png"></span>
                                                </div>
                                                <div class="tidelowhigh">
                                                    High Tide: <strong>{{dateTime(weatherDetails.Weather.highTide)}}</strong><br>
                                                    Low Tide: <strong>{{dateTime(weatherDetails.Weather.lowTide)}}</strong>
                                                </div>
                                                <div class="watertemp">
                                                    <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Sea-Temp-icon.png"> Temp: <strong>{{weatherDetails.Weather.waterTemperature}}°</strong>
                                                </div>
                                                <div class="prehudew">
                                                    <div class="alignleft">
                                                        Pressure: <strong>{{weatherDetails.Weather.pressure}}</strong><br>
                                                        Humidity: <strong>{{weatherDetails.Weather.humidity}}</strong><br>
                                                        Dew Point: <strong>{{weatherDetails.Weather.dewPoint}}°</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="locationsection">
                                            <div class="city-name">{{address}}</div>
                                        </div>
                                        <div class="mapsection">
                                            <div style="width: 100%">
                                                <div class="google-map" id="mapName"></div>
                                            </div>
                                        </div>
                                        <input type="button" class="weathersettings" value="Weather Settings" @click="toggleModal()">
                                    </div>
                                    <div class="right-section m-4 w-full md:w-1/2">
                                        <div class="winddata weatherinfosection">
                                            <h2>{{weatherDetails.WindTitle}}</h2>
                                            <line-chart :apidata="weatherDetails">
                                        </div>
                                        <div class="winddata weatherinfosection">
                                            <h2>{{weatherDetails.swellTitle}}</h2>
                                            <swell-chart :apidata="weatherDetails"></swell-chart>
                                        </div>
                                        <div class="winddata weatherinfosection precipitation">
                                            <h2>{{weatherDetails.precipitationTitle}}</h2>
                                            <precipitation-chart :apidata="weatherDetails"></precipitation-chart>
                                        </div>
                                    </div>
                                </div>
                                <div class="winddata weatherinfosection tides">
                                    <h2>{{weatherDetails.tideTitle}}</h2>
                                    <tide-chart :apidata="weatherDetails"></tide-chart>
                                </div>
                                <div class="winddata weatherinfosection solunar">
                                    <h2>Solunar </h2>
                                    <div class="solunarmooninfo">
                                        <img :src="'https://admin.knowwake.com/images/'+weatherDetails.solunar.moonIcon">
                                        <h3>{{weatherDetails.solunar.moonTitle}}</h3>
                                    </div>
                                    <template v-if="sunmoonbutton == 'sun'">
                                        <div>
                                            <solunarsun-chart :apidata="weatherDetails"></solunarsun-chart>
                                        </div>
                                        <div class="sun-moon-info">
                                            <div class="startinfo">Sunrise:<br>
                                                {{dateTime(weatherDetails.solunar.sunrise)}}
                                            </div>
                                            <div class="option-button">
                                                <ul class="switchsolunar">
                                                    <li :class="[sunmoonbutton === 'sun' ? 'active' : '']" @click="toggleSunMon('sun')">Sun</li>
                                                    <li :class="[sunmoonbutton === 'moon' ? 'active' : '']" @click="toggleSunMon('moon')">Moon</li>
                                                </ul>
                                            </div>
                                            <div class="endinfo">Sunset:<br>
                                                {{dateTime(weatherDetails.solunar.sunset)}}
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="sunmoonbutton == 'moon'">
                                        <div>
                                            <solunarmoon-chart :apidata="weatherDetails"></solunarmoon-chart>
                                        </div>
                                        <div class="sun-moon-info">
                                            <div class="startinfo">Moonrise:<br>
                                                {{dateTime(weatherDetails.solunar.moonrise)}}
                                            </div>
                                            <div class="option-button">
                                                <ul class="switchsolunar">
                                                    <li :class="[sunmoonbutton === 'sun' ? 'active' : '']" @click="toggleSunMon('sun')">Sun</li>
                                                    <li :class="[sunmoonbutton === 'moon' ? 'active' : '']" @click="toggleSunMon('moon')">Moon</li>
                                                </ul>
                                            </div>
                                            <div class="endinfo">Moonset:<br>
                                                {{dateTime(weatherDetails.solunar.moonset)}}
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        
                            
                            <div v-else>
                                <div class="centerloader">
                                    <div class="loader"></div>
                                </div>
                            </div>
                        
                            <template v-if="iconmodal">
                                <div id="iconmodal">
                                <div class="positionrelative">
                                    <span id="urlcopied"></span>
                                    <img src="https://www.knowwake.com/wp-content/uploads/2022/03/Share.png" @click="copyToClipboardMessage('popupsectionicontext')">
                                        <div id="popupsectionicontext">
                                            <div class="closebutton"><img src="https://www.knowwake.com/wp-content/uploads/2022/03/btnX.png" @click="toggleIconModal()"></div>
                                            <ul id="example-1">
                                                <li v-for="item in weatherDetails.CraftAdvisoryData" :key="item.CraftAdvisoryTitle">
                                                    <h4>{{item.CraftAdvisoryTitle}}</h4>
                                                    <h5>{{item.CraftAdvisorySubTitle}}</h5>
                                                    <p class="advisorydatetime">{{item.CraftAdvisoryDateTime}}</p>
                                                    <p class="advisorycontent" v-html="item.CraftAdvisoryDetails"></p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div id="modal" v-if="modal">
                                <div id="popupsection">
                                    <div class="closebutton"><img src="https://www.knowwake.com/wp-content/uploads/2022/03/btnX.png" @click="toggleModal()"></div>
                                    <div class="windspeedpop">
                                        <label>Wind speed</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.windspeed === 0 ? 'active' : '']" @click="toggleWindSpeed(0)">knots</li>
                                            <li :class="[settings.windspeed === 1 ? 'active' : '']" @click="toggleWindSpeed(1)">km/h</li>
                                            <li :class="[settings.windspeed === 2 ? 'active' : '']" @click="toggleWindSpeed(2)">mph</li>
                                            <li :class="[settings.windspeed === 3 ? 'active' : '']" @click="toggleWindSpeed(3)">m/s</li>
                                        </ul>
                                    </div>
                                    <div class="temperature">
                                        <label>Temperature</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.temperature === 0 ? 'active' : '']" @click="toggleTemperature(0)">°C</li>
                                            <li :class="[settings.temperature === 1 ? 'active' : '']" @click="toggleTemperature(1)">°F</li>
                                        </ul>
                                    </div>
                                    <div class="swellheight">
                                        <label>Swell height</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.swellheight === 0 ? 'active' : '']" @click="toggleSwellHeight(0)">meters</li>
                                            <li :class="[settings.swellheight === 1 ? 'active' : '']" @click="toggleSwellHeight(1)">feet</li>
                                        </ul>
                                    </div>
                                    <div class="tideheigt">
                                        <label>Tide heigt</label><br>
                                        <ul class="switch">
                                            <li :class="[settings.tideheight === 0 ? 'active' : '']" @click="toggleTideHeight(0)">meters</li>
                                            <li :class="[settings.tideheight === 1 ? 'active' : '']" @click="toggleTideHeight(1)">feet</li>
                                        </ul>
                                    </div>
                                    <input type="button" class="weathersettingsupdate" value="UPDATE" @click="updateWeatherSettings()">
                                </div>
                            </div>
                            <div v-else>
                            </div>
                        </div>
			`, 
		});	
	}
});

// <div class="tide-station">Tide Station: Port Laudania, Dania</div>
//v-if="weatherDetails.CraftAdvisory == 1"
//v-if="sunmoonbutton == 'moon'"                
