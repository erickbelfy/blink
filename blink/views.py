from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core import serializers

from blink import settings
from portfolio.models import Portfolio

def index(request):

    context = RequestContext(request, {})

    return render_to_response('index.html', context)

def get_images(request):
    images_data =  serializers.serialize('json',Portfolio.objects.all(), fields=('category', 'agency', 'client', 'thumbnailImage', 'imageProject', 'makingofImage') )
    return HttpResponse(images_data, mimetype = 'application/json')
