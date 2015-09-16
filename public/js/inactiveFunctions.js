

/* init.js */
function getMode(){
	console.log("getMode")
	var modeValue = $.cookie('mode')

	// cookie not set
	return setMode('advanced')//($.cookie('mode')==undefined) ? setMode('basic') : setMode(modeValue)
}
function setMode(modeValue){

	var DOMchanges = (modeValue=='advanced') ? makeAdvanced() : makeAdvanced()//makeBasic()

	return modeValue
}
function makeBasic(){
	function clickCompare(){
		$('#toggleCompare').parent().trigger('click')
	}
	var turnCompareOff = (showCompareFeatures==true) ? clickCompare() : null
	$('.adv-only').hide()
	$('.basic-only').show()
	$('#chartSelectors').removeClass('advanced').addClass('basic')
	$('#chart').removeClass('chart-advanced').addClass('chart-basic').addClass('invisible')
	$('.down-low').removeClass('down-low-advanced').addClass('down-low-basic')
	$('[name="layerCheckboxes"][data-name="fema"]:checked').trigger('click')
	$('[name="fieldRadios"]:eq(1)').not(':checked').trigger('click')

}
function makeAdvanced(){
	$('.adv-only').show()
	$('.basic-only').hide()
	$('#fieldSelector').selectpicker('val',''+currentAttribute+'')
	$('#chartSelectors').removeClass('basic').addClass('advanced')
	$('#chart').removeClass('chart-basic').removeClass('invisible').addClass('chart-advanced')
	$('.down-low').addClass('down-low-basic')
}


function removeCookie(cookieKey){
	$.removeCookie(cookieKey)
}
function setCookie(cookieKey, cookieValue){
	$.cookie(cookieKey, cookieValue)
}















// events.js
$('[name="modeRadios"]').on('change', function(){
    // Identify toggle mode state
    mode = $('[name="modeRadios"]:checked').val()
    // Call setMode
    setMode(mode)
    // Trigger alert
    $('#rememberMode-alert').slideDown()
    $('#sidebar-wrapper').scrollTo('#modeBody')
})

$('#forgetMode').on('click', function(){
    removeCookie('mode')
    $('#rememberMode-alert').slideUp()
})
$('#rememberMode').on('click', function(){
    setCookie('mode', 'advanced')
    $('#rememberMode-alert').slideUp()
})
/* COLOR SCALE OR DISPLAY FIELD CHANGES */
$('#scaleSelector').on('change', function() {
    handleStyle();
})










// global variables











// prototypes
var suffixes = {
	BldgLossUS : ",000",
	BldgDmgPct : "%"
}
var prefixes = {
	BldgLossUS : "$",
	BldgDmgPct : ""
}

