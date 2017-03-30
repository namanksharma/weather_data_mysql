from django.contrib import admin
from weather_info.models import *

class adminCity(admin.ModelAdmin) :

    list_display = ('name','lattitude','longitude','is_deleted')
    list_filter = ('is_deleted',)
    fields = ('name','lattitude','longitude','is_deleted')
    readonly_fields = ('name','lattitude','longitude')


    def delete_selected(self, request, queryset) :
        try:
            rows_updated = queryset.update(is_deleted = True)
            if rows_updated == 1:
                message_bit = "1 item was"
            else:
                message_bit = "%s items were" % rows_updated
            self.message_user(request, "%s successfully deleted." % message_bit)

        except Exception as e:
            raise
    
    def has_delete_permission(self, request, obj=None):
        #Disable delete
        return False

    def has_add_permission(self, request, obj=None):
        #Disable Add
        return False

    actions = [delete_selected]


admin.site.register(city,adminCity)