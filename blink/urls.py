from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^$', 'blink.views.index', name='index'),
    url(r'^json_images$', 'blink.views.get_images', name='get_images'),
    url(r'^orcamentos/', include('budget.urls')),
    url(r'^contato/', include('contact.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

import os
from blink import settings
if settings.DEBUG:
    urlpatterns += patterns('', url(r'^media/(.*)$', 'django.views.static.serve', kwargs={'document_root': os.path.join(settings.PATH, 'media')}), )
