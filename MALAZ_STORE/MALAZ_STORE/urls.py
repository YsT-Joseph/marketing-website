from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.views.i18n import set_language


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('MALAZ.urls')),
    path('about/', include('about.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('i18n/setlang/', set_language, name='set_language'),


]+ i18n_patterns(
    path('', include('MALAZ.urls')),  # These will get language prefixes
    # Other i18n URLs
    prefix_default_language=False  # Optional: removes language prefix for default language
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
