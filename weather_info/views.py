from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
import json
from django.template.context import RequestContext
from django.shortcuts import render
from weather_info.models import *
import datetime
# import requests


@csrf_exempt
def weather_info(request):
	cityObj = city.objects.filter(is_deleted = False)

	context = RequestContext(request,{'request': request, 'cities':cityObj})
	return render(request, "index.html",context_instance=context)

@csrf_exempt
def save_city_data(request):

	if request.method == "POST":
		name = request.POST.get("name",None)
		lat = request.POST.get("lat",None)
		lng = request.POST.get("lng",None)

		if name and lat and lng:

			if city.objects.filter(lattitude=lat, longitude=lng).exists() :
				return HttpResponse(json.dumps({"success":False, "errorMsg":"This lattitude and longitude entry is already present."}))
			else:
				cityObj = city(
					name = name,
					lattitude = lat,
					longitude = lng
				)
				cityObj.save()
				return HttpResponse(json.dumps({"success":True, "data":{"name":cityObj.name} }))
		else:
			return HttpResponse(json.dumps({"success":False, "errorMsg":"Please send name, lat and lng in request."}))
	else:
		return HttpResponse(json.dumps({"success":False, "errorMsg":"Please use Post Method."}))


@csrf_exempt
def get_city_data(request):
	if request.method == "POST":
		cityObj = city.objects.filter(is_deleted = False).values('name','lattitude','longitude')
		return HttpResponse(json.dumps({"success":True, "data":list(cityObj) }))
	else:
		return HttpResponse(json.dumps({"success":False, "errorMsg":"Please use Post Method."}))
