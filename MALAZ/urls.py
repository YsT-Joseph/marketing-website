from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('make_order/', views.make_order, name='make_order'),
]
