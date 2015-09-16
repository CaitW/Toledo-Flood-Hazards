databyID= {}
dataByYear= null
allYearData={}
fullList = []

$(function(){

	// Defined Variables
	var targetYears = [6,7,8,9,10,11,12,23,24,25,26,27,28,29,57,58,59,60,61,62,63,74,75,76,77,78,79,80]


	// Data Containers
	var newAllData={}
		allYearData={}


	function callServer(year) {

		$.ajax({
			type: "GET",
			url: serviceURL + year + '/query',
			data: 'where=OBJECTID>0&text=&objectIds=&time=&geometry=&geometryType=esriGeometryMultipoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=BldgLossUS%2CBldgDmgPct%2COBJECTID&returnGeometry=true&maxAllowableOsingleFeatureYearset=&geometryPrecision=&outSR=4269&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson',
			dataType: 'jsonp',
			success: function(data) {

				newAllData[year] = data
				newListVersion = d3.keys(newAllData)
				console.log(newListVersion.length)
				if (newListVersion.length == targetYears.length) {
					console.log(newAllData)
					newCreateMasterObj(newAllData);
				}
			}
		})
	}
	$(targetYears).each(function(){callServer(this)})

	function newCreateMasterObj(newAllData) {
		allFeatures  = []
		allIndexes = []
		uniqueIntIndexes = []
		eachYear= {}
		dataValues = d3.values(newAllData).forEach(function(d, i){ eachYear[i]=(d.features); (d.features).forEach(function(d,i){allFeatures.push(d)})})
		getIndexes = allFeatures.forEach(function(d,i){ allIndexes.push(d.attributes.OBJECTID) })
		uniqueIndexes = d3.set(allIndexes).values()

		$(uniqueIndexes).each(function(){ uniqueIntIndexes.push(parseInt(this)) })

		function makeData(){
			Y = {}
			$(targetYears).each(function(){
				Z= {}
				oneyear=this
				oneyearData = newAllData[oneyear].features
				oneyearData.forEach(function(d,i){
					id = d.attributes.OBJECTID
					Z[id] = d
				})
				Y[oneyear]=Z
			})
			dataByYear= Y
			restructureData(Y)
		}
		makeData()

		function restructureData(Y){
			features= []
			$(uniqueIntIndexes).each(function(){
				eventObject = {}
				currentIndex=this
				latLngSet = false
				$(targetYears).each(function(){
					currentEvent=this
					result = (Y[currentEvent][currentIndex]==undefined) ? 0 : Y[currentEvent][currentIndex]
					setLatLng = ((latLngSet==false)&&(result!=0)) ? addLatLng() : null;
					if(result!=0){fullList.push(result.attributes)}
					function addLatLng(){
						eventObject["LatLng"] = new L.LatLng(result.geometry.y, result.geometry.x)
						latLngSet = true
					}
					eventObject[currentEvent]=result
				})
				eventObject["id"]= String(currentIndex)
				features.push(eventObject)
				databyID[String(currentIndex)] = eventObject
			})
			allYearData["features"]=features
			allYearData["length"]=features.length


			console.log("finished")
			createSymbols(allYearData)
		}
	}
})

