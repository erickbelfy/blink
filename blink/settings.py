import local_settings


PATH = local_settings.PATH
DEBUG = local_settings.DEBUG
TEMPLATE_DEBUG = local_settings.DEBUG
ALLOWED_HOSTS = ['www.blinkimagens.com.br', 'blinkimagens.com.br', 'blink.olh.am', ]

GRAPPELLI_ADMIN_TITLE = local_settings.GRAPPELLI_ADMIN_TITLE
ADMINS = local_settings.ADMINS
MANAGERS = ADMINS
DATABASES = local_settings.DATABASES


CACHES = { 'default': { 'BACKEND' : 'django.core.cache.backends.dummy.DummyCache', } }
# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Sao_Paulo'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'pt-br'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = local_settings.MEDIA_ROOT 

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = local_settings.MEDIA_URL

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = local_settings.STATIC_ROOT 

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = local_settings.STATIC_URL 

# Additional locations of static files
if DEBUG:
    STATICFILES_DIRS = (
        PATH + 'app/',
        PATH + 'app/components/modernizr/',
        PATH + 'app/styles/',
        PATH + 'app/scripts/',
        PATH + 'app/scripts/vendor/',
        PATH + 'app/images/',
        PATH + 'app/fonts/',
    )
else:
    STATICFILES_DIRS = (
        PATH + 'dist/',
        PATH + 'dist/styles/',
        PATH + 'dist/scripts/',
        PATH + 'dist/scripts/vendor/',
        PATH + 'dist/images/',
        PATH + 'dist/fonts/',
    )

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = local_settings.SECRET

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'blink.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'blink.wsgi.application'

TEMPLATE_DIRS = (
    PATH + 'blink/templates/',
    #local_settings.PATH + '/news/templates/',
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'grappelli',
    'django.contrib.admin',
    'imagekit',
    'tinymce',
    'portfolio',
    'contact',
    'budget',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

# Config email sending
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_PASSWORD = '$mail2012$'
EMAIL_HOST_USER = 'mail@olh.am'
EMAIL_PORT = 587
EMAIL_USE_TLS = 1
