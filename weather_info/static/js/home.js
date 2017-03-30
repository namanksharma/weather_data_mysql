  var API_KEY = "11f12321792824d7"

  function initMap() {
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});

    autocomplete.addListener('place_changed', function() {
      $(".autocomplete_error").empty();
      $(".autocomplete_error").hide();
      
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        $(".autocomplete_error").empty();
        $(".autocomplete_error").text("No entry present for "+ place.name);
        $(".autocomplete_error").show();
        return;
      }
      else{
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        if (lat && lng && place.formatted_address){
          var data = {"lat": lat,
                      "lng": lng,
                      "name": place.formatted_address,
                      };
          createAPICall("/save_city_data/","POST",data,save_city_data_callback)
        }
        else{
          $(".autocomplete_error").empty();
          $(".autocomplete_error").text("No such place exists");
          $(".autocomplete_error").show();
        }
      }

    });

  }

  function showCityDialog(){
    $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 500
      },
      hide: {
        effect: "explode",
        duration: 500
      },
      width: 500,
      modal: true,
      resizable: false,
      draggable: false
    });
    $("#pac-input").val('');
    $(".autocomplete_error").empty();
    $(".autocomplete_error").hide();
    $( "#dialog" ).dialog( "open" );
  }

  function save_city_data_callback(res,data){
    $(".autocomplete_error").empty();
    $(".autocomplete_error").hide();
    if( res.success ){
      bindCitiesToSelectBox(data.lat.toString()+","+data.lng.toString());
      $( "#dialog" ).dialog( "close" );
    }
    else{
      $(".autocomplete_error").empty();
      $(".autocomplete_error").text(res.errorMsg);
      $(".autocomplete_error").show();
    }
  }

  function bindCitiesToSelectBox(preselectedVal){
    createAPICall("/get_city_data/","POST",{"preselectedVal":preselectedVal},get_city_data_callback)
  }

  function get_city_data_callback(res,data){
    if( res.success ){
      $("#city_list").empty();
      $("#city_list").append("<option></option>")
      for( i in res.data ){
        $("#city_list").append('<option value="'+res.data[i].lattitude+','+res.data[i].longitude+'">'+res.data[i].name+'</option>');
      }
      $(".select2Place").select2({
        placeholder : "Select place",
        autoclear : true,
      });
      if( data.preselectedVal != "" ){
        $("#city_list").val(data.preselectedVal).trigger('change');
      }
    }
    else{

    }
  }

  function plotGraph(){
    processingOn();
    var latlong = $("#city_list").val();
    var parameter = $("#param_list").val();
    var fromdate = $("#from_date").val();
    var todate = $("#to_date").val();
    if( (latlong!=null && latlong!="") && (parameter!=null && parameter!="") && (fromdate!=null && fromdate!="") && (todate!=null && todate!="") ){
      diffObj = getDateDiff(fromdate,todate);
      isCompleted = false;
      plotData = [];

      if(diffObj.success){

        var datalen = diffObj.data.length;

        $.each(diffObj.data, function (i, item) {
          processingOn();
          $.ajax({
              url: "http://api.wunderground.com/api/"+API_KEY+"/history_"+item+"/q/"+latlong+".json",
              cache: false,
              async: false,
              success: function(html){
                if( "error" in html.response ){
                  alert(data.response.error.description.toString())
                  return false;
                }
                else{
                  $.each(html.history.observations,function(j,obv){
                    obvObj = {"date" : obv.date.pretty, "temp_f" : obv.tempi, "temp_c" : obv.tempm, "humidity" : obv.hum};
                    plotData.push(obvObj)
                  })
                }
              },
              error: function(html){
                clearInterval(callbackInterval);
                processingOff();
              }
          });
          if(datalen >= (i+1)){
            isCompleted = true;
          }
        })

      }
      else{
        processingOff();
        alert(diffObj.errorMsg);
        return false;
      }
      callbackInterval = setInterval(function(){
        if(isCompleted){
            plotGraphCallback(plotData);
            clearInterval(callbackInterval);
        }
      }, 500);

    }
    else{
      processingOff();
      alert("Please fill all the required data");
    }
  }

  function plotGraphCallback(plotData) {
    x = [];
    y = [];
    var param = $("#param_list").val();
    switch(param){
      case "humidity":{
        param = "humidity";
        title = "Humidity of "+$("#city_list").find("option:selected").text()+" from "+plotData[0].date+" to "+plotData[plotData.length-1].date;
      }break;
      case "temp_c":{
        param = "temp_c";
        title = "Temperature(in C) of "+$("#city_list").find("option:selected").text()+" from "+plotData[0].date+" to "+plotData[plotData.length-1].date;
      }break;
      case "temp_f":{
        param = "temp_f";
        title = "Temperature(in F) of "+$("#city_list").find("option:selected").text()+" from "+plotData[0].date+" to "+plotData[plotData.length-1].date;
      }break;
      default:
        alert("No parameter selected");
        return false;
        break;
    }
    for (i in plotData){
      x.push(plotData[i].date);
      y.push(eval("plotData[i]."+param));
    }
    
    var data = [
      {
        x: x,
        y: y,
        type: 'scatter'
      }
    ];
    var layout = {
      title:title,
    };
    $("#myDiv").css("height","700px");
    $(".svg-container").css("height","700px");
    $(".main-svg").attr("height","700px");

    Plotly.newPlot('myDiv', data, layout);

    $("#myDiv").css("height","900px");
    $(".svg-container").css("height","900px");
    $(".main-svg").attr("height","900px");
    clearInterval(callbackInterval);
    processingOff();
  }

  function getDateDiff(startdate, enddate){
    var date1 = new Date(startdate);
    var date2 = new Date(enddate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    if(diffDays < 0 || (date1 > date2) ){
      return {"success":false,"errorMsg":"Date range is not valid"}
    }

    dateArr = [];

    dateArr.push(startdate.replace(/\-/g, ''));
    for(i=1; i<=diffDays; i++){
      new Date(date1.setDate(date1.getDate() + 1));
      dateArr.push( date1.getFullYear().toString()+ (date1.getMonth()<10 ? "0"+(date1.getMonth()+1) : date1.getMonth()+1).toString() + (date1.getDate()<10 ? "0"+date1.getDate() : date1.getDate()).toString() )
    }
    return {"success":true,"data":dateArr};
  }

  function processingOn(){
    $(".fade").show("fast");
  }

  function processingOff(){
    $(".fade").hide("slow"); 
  }

  function createAPICall( apiName , type , data , callback ) {
    $.ajax({
      url : apiName,
      type :type,
      enctype : 'application/x-www-form-urlencoded',
      data : data,
      dataType : "json",
      success : function( res )
        {
          callback(res,data);
        },
      error : function (err)
        {
          callback(err,data);
        }
    });
  };

  $(document).ready(function(){
    $(".select2Place").select2({
        placeholder : "Select place",
        autoclear : true,
      });

    $(".select2Parameter").select2({
        placeholder : "Select parameter",
        autoclear : true,
      });

    $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd', changeMonth: true,changeYear: true ,yearRange: "-100:+0"
    });

    $("#myDiv").css("width",$(window).width());

    $(".fade").css({"min-width":$(window).width(),"min-height":$(window).height()})
  })