from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, VehiculoViewSet, ProductoViewSet, ProformaViewSet

# El router crea las URLs automáticamente
router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'vehiculos', VehiculoViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'proformas', ProformaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]