# -*- coding: utf8 -*-

from django.db import models

class Contact(models.Model):

    name = models.CharField('Nome', max_length=258)
    email = models.EmailField('E-mail', max_length=258)
    phone = models.CharField('Telefone', max_length=258)
    message = models.TextField('Mensagem', )

    class Meta:
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'
