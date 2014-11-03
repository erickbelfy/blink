from django.contrib import admin
from imagekit.admin import AdminThumbnail
from portfolio.models import Portfolio 

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('category', 'admin_thumbnail', 'client', 'agency',  'updated_date',)
    admin_thumbnail = AdminThumbnail(image_field = 'thumbnailImage')

admin.site.register(Portfolio, PortfolioAdmin)
