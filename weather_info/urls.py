"""weather_info URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import patterns, include, url
from django.contrib import admin
from weather_info import views
from weather_info import settings
from django.conf.urls.static import static

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$',views.weather_info, name='weather_info'),
    url(r'^save_city_data/$',views.save_city_data, name='save_city_data'),
    url(r'^get_city_data/$',views.get_city_data, name='get_city_data'),

)
# + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)

urlpatterns += patterns('',
             (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.BASE_DIR+'/weather_info/static', 'show_indexes':True}),
         )
