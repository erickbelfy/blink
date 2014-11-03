DEBUG = True
PATH = '{{PATH}}'
SECRET = '{{SECRET}}'
LANGUAGE = 'pt-br'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.{{DB_TYPE}}', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '{{DB_NAME}}',           # Or path to database file if using sqlite3.
        'USER': '{{DB_USER}}',                      # Not used with sqlite3.
        'PASSWORD': '{{DB_PASS}}',                  # Not used with sqlite3.
        'HOST': '{{DB_HOST}}',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '{{DB_PORT}}',                      # Set to empty string for default. Not used with sqlite3.
    }
}
ADMINS = (
    ('{{ADMIN_NAME}}', '{{ADMIN_EMAIL}}'),
)
