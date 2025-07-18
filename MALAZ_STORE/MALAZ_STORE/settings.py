from pathlib import Path
import os
import dj_database_url
from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

# === Base Directory ===
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

# === Security ===
SECRET_KEY = os.environ.get('SECRET_KEY', 'unsafe-secret-key-for-dev-only')

# Determine DEBUG mode
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# Hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

# === Application Definition ===
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'django.contrib.sites',
    
    # Local apps
    'MALAZ.apps.MalazConfig',
    'about.apps.AboutConfig',
    
    # Third-party
    'whitenoise.runserver_nostatic',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',  # For translations
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

ROOT_URLCONF = 'MALAZ_STORE.urls'

# === Templates ===
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'MALAZ.context_processors.cart_contents',
            ],
            'builtins': [
                'django.templatetags.static',  # For static files
                'django.templatetags.i18n',    # For translation tags
            ],
        },
    },
]

WSGI_APPLICATION = 'MALAZ_STORE.wsgi.application'

# === Database ===
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# === Password Validation ===
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# === Internationalization ===
LANGUAGE_CODE = 'en-us'
LANGUAGES = [
    ('en', _('English')),
    ('ar', _('Arabic')),
]
LOCALE_PATHS = [BASE_DIR / 'locale']
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# === Static & Media Files ===
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / "MALAZ_STORE/static"]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# === Default Auto Field ===
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# === Email Configuration ===
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' if DEBUG else 'django.core.mail.backends.smtp.EmailBackend'

# === Security Headers ===
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# === CSRF Trusted Origins ===
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000'
]

# Add environment variable origins if they exist
env_origins = [
    origin.strip() for origin in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',')
    if origin.strip().startswith(('http://', 'https://'))
]
if env_origins:
    CSRF_TRUSTED_ORIGINS.extend(env_origins)

# === Production Settings ===
if not DEBUG:
    # HTTPS/SSL
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
    
    # Add production domains
    production_domains = [
        'https://yourdomain.com',
        'https://www.yourdomain.com'
    ]
    CSRF_TRUSTED_ORIGINS.extend(production_domains)
    
    # Database
    DATABASES['default']['OPTIONS'] = {'sslmode': 'require'}
    
    # Logging
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'file': {
                'level': 'ERROR',
                'class': 'logging.FileHandler',
                'filename': BASE_DIR / 'logs/django.log',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['file'],
                'level': 'ERROR',
                'propagate': True,
            },
        },
    }

# === Theme and Translation Settings ===
THEME_COOKIE_NAME = 'malaz_theme'
THEME_COOKIE_AGE = 30 * 24 * 60 * 60  # 30 days in seconds
LANGUAGE_COOKIE_NAME = 'malaz_language'
LANGUAGE_COOKIE_AGE = 30 * 24 * 60 * 60  # 30 days in seconds

# Whitenoise settings
WHITENOISE_MAX_AGE = 31536000
WHITENOISE_ADD_HEADERS_FUNCTION = 'whitenoise.storage.add_headers_function'

# Site ID
SITE_ID = 1


# === Admin Customization ===
ADMIN_SITE_HEADER = "MALAZ STORE Admin"
ADMIN_SITE_TITLE = "MALAZ STORE Admin Portal"
ADMIN_INDEX_TITLE = "Welcome to MALAZ STORE Administration"



LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),  # Path where translation files will be stored
]

