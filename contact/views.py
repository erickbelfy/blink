from django.http import HttpResponse, Http404
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from blink import settings

from contact.models import Contact
from contact.forms import ContactForm

def save_contact(request):
    if request.method == 'POST':
        contact = Contact()
        form = ContactForm(request.POST, instance=contact)
        if form.is_valid():
            try:
                form.save()
            except Exception:
                return mail_response('false')
            sendmail(form)
            return mail_response('true')
        else:
            return mail_response('false')
    else:
        raise Http404

def sendmail(form):
    name = form.data.get('name', '')
    phone = form.data.get('phone', '')
    email = form.data.get('email', '')
    message = form.data.get('message', '')
    emailcontent = '' \
    + ( 'Nome: %s \n' % name ) \
    + ( 'Telefone: %s \n' % phone ) \
    + ( 'E-mail: %s \n' % email ) \
    + ( 'Message: %s \n' % message )
    html_content = render_to_string('contactmail.html', {
        'name': name,
        'phone': phone,
        'email': email,
        'message': message,
    })
    smtpemail = EmailMultiAlternatives(
        'Contato | Site',
        emailcontent,
        settings.EMAIL_HOST_USER,
        ('blinkimagens@gmail.com',),
    )
    smtpemail.attach_alternative(html_content, "text/html")
    smtpemail.send()

def mail_response(result):
    return HttpResponse(result, mimetype="application/json")
