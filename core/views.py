from rest_framework import viewsets
from .models import Cliente, Vehiculo, Producto, Proforma
from .serializers import ClienteSerializer, VehiculoSerializer, ProductoSerializer, ProformaSerializer
from rest_framework import filters 

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    # 2. Agregamos estas dos líneas:
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'codigo']

class ProformaViewSet(viewsets.ModelViewSet):
    queryset = Proforma.objects.all()
    serializer_class = ProformaSerializer