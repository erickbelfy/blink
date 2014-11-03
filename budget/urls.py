from django.conf.urls import patterns, url

from budget import views

urlpatterns = patterns('',
    url(r'^save_budget$', views.save_budget, name='save_budget')
)
