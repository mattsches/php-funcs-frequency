function compare(a,b) {
  if (a.frequency < b.frequency)
     return 1;
  if (a.frequency > b.frequency)
    return -1;
  return 0;
}
var mychart;
d3.json("data/php_functions_frequencies.json", function (error, data) {
	data.sort(compare);
	var chart = AmCharts.makeChart("chart", {
		"type": "serial",
		"theme": "none",
		"dataProvider": data,
		"mouseWheelZoomEnabled": true,
		"thousandsSeparator": ".",
		"graphs": [{
			"balloonText": "[[function]]: <b>[[frequency]]</b>",
			"fillAlphas": 0.8,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "frequency",
			"fillColors": "#369",
			"fillColorsField": "#369",
			"lineColor": "#369"
		}],
		"chartCursor": {
			"categoryBalloonEnabled": false,
			"cursorAlpha": 0,
			"zoomable": true
		},
		"categoryField": "function",
		"categoryAxis": {
			"gridPosition": "start",
			"gridAlpha": 0,
			"tickPosition": "start",
			"tickLength": 20,
			"labelRotation": 90
		}
	});
	chart.addListener("clickGraphItem", function (e) {
		var url = 'http://php.net/manual-lookup.php?pattern=' + e.item.category;
		console.log(url);
		function openNewWindow(url) {
			popupWin = window.open(url,
					'open_window',
					'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width = 640, height = 480, left = 0, top = 0'
			);
		}
		openNewWindow(url);
	});
	mychart = chart;

	var searchmap = data.map(function (obj) {
		return obj.function;
	});
	$('.typeahead').typeahead({
	  minLength: 2,
	  highlight: true
	},
	{
	  name: 'my-dataset',
		displayKey: 'value',
	  source: substringMatcher(searchmap)
	});
});
$('#search').submit(function (e) {
	e.preventDefault();
	mychart.zoomOut();
	$('.typeahead').typeahead('val', '');
});
$('.typeahead').on('typeahead:selected', function (e) {
	e.preventDefault();
	var query = $('.typeahead').typeahead('val');
	var foo = mychart.getCategoryIndexByValue(query);
	if (foo) {
		mychart.zoomToCategoryValues(query, query);
	}
});
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });

    cb(matches);
  };
};
