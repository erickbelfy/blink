# -*- coding: utf8 -*-

from django.db import models
from imagekit.models import ProcessedImageField

class Portfolio (models.Model) :
    
    client = models.CharField('Cliente', blank=True, null=True, max_length=250)
    agency = models.CharField('Agência', blank=True, null= True, max_length=250)

    CATEGORY_CHOICES = (
        ('moda', 'Moda'),
        ('veiculos', 'Veículos'),
        ('publicidade', 'Publicidade'),
        ('produto', 'Produto'),
    )
    category =  models.CharField('Categoria', choices= CATEGORY_CHOICES, max_length= 20)

    imageProject = ProcessedImageField(
        blank=True,
        upload_to='portfolio/',
        format='JPEG',
        verbose_name='Projeto',
        options={'quality': 80})


    makingofImage = ProcessedImageField(
        blank=True,
        upload_to='portfolio/',
        format='JPEG',
        verbose_name='Making Of',
        options={'quality': 80})

    thumbnailImage = ProcessedImageField(
        blank=True,
        upload_to='portfolio/',
        format='JPEG',
        verbose_name='Thumbnail',
        options={'quality': 80})
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField('Data')

    def save(self, **kwargs):
        super(Portfolio, self).save()

    class Meta:
        verbose_name = 'Portfólio'
        verbose_name_plural = 'Portfólio'
