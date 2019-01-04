// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end


/** 
* ITMO coordinates
*/
var itmo = {
    title: "ITMO",
	latitude: 59.957356,
	longitude: 30.309034,
};

/**
 * Define SVG path for target icon
 */
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Exclude Antartica
polygonSeries.exclude = ["AQ"];

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.fill = chart.colors.getIndex(0).brighten(0.5).saturate(0.2);
polygonTemplate.strokeOpacity = 0.5;
polygonTemplate.strokeWidth = 0.5;

// create capital markers
var imageSeries = chart.series.push(new am4maps.MapImageSeries());

// define template
var imageSeriesTemplate = imageSeries.mapImages.template;
var circle = imageSeriesTemplate.createChild(am4core.Sprite);
circle.scale = 0.6;
circle.fill = chart.colors.getIndex(3).saturate(0.1).lighten(-0.5)
circle.path = targetSVG;
// what about scale...

// set propertyfields
imageSeriesTemplate.propertyFields.latitude = "latitude";
imageSeriesTemplate.propertyFields.longitude = "longitude";

imageSeriesTemplate.horizontalCenter = "middle";
imageSeriesTemplate.verticalCenter = "middle";
imageSeriesTemplate.align = "center";
imageSeriesTemplate.valign = "middle";
imageSeriesTemplate.width = 8;
imageSeriesTemplate.height = 8;
imageSeriesTemplate.nonScaling = true;
imageSeriesTemplate.tooltipText = "{title}";
imageSeriesTemplate.fill = am4core.color("#000");
imageSeriesTemplate.background.fillOpacity = 0;
imageSeriesTemplate.background.fill = "#fff";
imageSeriesTemplate.setStateOnChildren = true;
imageSeriesTemplate.states.create("hover");

//Lines
var lineSeries = chart.series.push(new am4maps.MapLineSeries());
lineSeries.mapLines.template.strokeWidth = 0.15;
lineSeries.mapLines.template.stroke = am4core.color("#e03e96");
lineSeries.mapLines.template.line.nonScalingStroke = true;

// Zoom control
chart.zoomControl = new am4maps.ZoomControl();

chart.homeGeoPoint = itmo;
chart.homeZoomLevel = 1;
var homeButton = new am4core.Button();
homeButton.events.on("hit", function(){
  chart.goHome();
});
homeButton.icon = new am4core.Sprite();
homeButton.padding(7, 5, 7, 5);
homeButton.width = 20;
homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
homeButton.marginBottom = 10;
homeButton.parent = chart.zoomControl;
homeButton.insertBefore(chart.zoomControl.plusButton);

//Buttons data switch
var ubutton = new am4core.Button();
ubutton.padding(7, 5, 7, 5);
var uimg = new am4core.Image();
uimg.href = "cap.svg";
uimg.parent = ubutton;
uimg.height = 20;
uimg.width = 20;
ubutton.width = 20;
ubutton.marginBottom = 10;
ubutton.disabled = true
ubutton.parent = chart.zoomControl;
ubutton.insertBefore(homeButton);
ubutton.tooltipText  = "switch to research organizations"

var cbutton = new am4core.Button();
var cimg = new am4core.Image();
cimg.href = "portfolio.svg";
cimg.parent = cbutton;
cimg.height = 20;
cimg.width = 20;
cbutton.padding(7, 5, 7, 5);
cbutton.width = 20;
cbutton.marginBottom = 10;
cbutton.parent = chart.zoomControl;
cbutton.insertBefore(homeButton)
cbutton.tooltipText  = "switch to commercial organizations"

ubutton.events.on("hit", function(){
    update_toggle(ubutton, cbutton);
});

cbutton.events.on("hit", function(){
    update_toggle(cbutton, ubutton);
});


function update_toggle(btn_capture, btn_release){
    btn_capture.disabled = true;
    btn_release.disabled = false;
    if (btn_capture == ubutton){
        lineSeries.mapLines.template.stroke = am4core.color("#e03e96");
        renderMap("study_org.json") 
        chart.goHome();   
    }
    else{
        lineSeries.mapLines.template.stroke = am4core.color("#1946BA");
        renderMap("comm_org.json")
        chart.goHome();
    }
}


//Title
var labelContainer = chart.createChild(am4core.Container);
labelContainer.isMeasured = false;
labelContainer.x = 0;
labelContainer.y = 0;
labelContainer.zIndex = 10;

var plane = new am4core.Image();
plane.width = 700;
plane.height = 100;
plane.href = "itmo.png"
plane.parent = labelContainer;

var title = chart.titles.create();
title.align = "left"; // prevent from shifting left/right when text updates
title.valign = "top";
title.verticalCenter = "top";
title.dx = 290;
title.dy = 70;
title.text = "Scientific communications map";
title.fill = am4core.color("#1946BA");
title.fontSize = 20;
title.parent = labelContainer;


function getArray(jsonFile){
    return $.getJSON(jsonFile);
}

function renderMap(jsonFile){
getArray(jsonFile).done(function(json) {
    var array = [];
	for (var key in json) {
		if (json.hasOwnProperty(key)) {
			var item = json[key];
            if (item.latitude != 0 && item.longitude != 0)
			    array.push({
				    title: item.title,
				    latitude: item.latitude,
				    longitude: item.longitude,
			    });            
		}
	}
    
    var array_lines = [];
    array.forEach(function(item_uni){
        array_lines.push({"multiGeoLine": [
            [
                {"latitude": itmo["latitude"], "longitude": itmo["longitude"]},
                {"latitude": item_uni["latitude"], "longitude" :item_uni["longitude"]},
            ]
        ]});
    });
    
    console.log(array_lines.length)
    console.log(array.length)
    
    lineSeries.data = array_lines.slice(0, 109);
    imageSeries.data = array;
});
}

renderMap("study_org.json")