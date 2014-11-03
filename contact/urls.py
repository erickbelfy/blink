from django.conf.urls import patterns, url

from contact import views

urlpatterns = patterns('',
    url(r'^save_contact$', views.save_contact, name='save_contact')
)
