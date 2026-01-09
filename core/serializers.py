from rest_framework import serializers
from .models import Cliente, Vehiculo, Producto, Proforma, DetalleProforma

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

# Para la proforma es un poco más especial porque tiene detalles hijos
class DetalleProformaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleProforma
        fields = '__all__'

class ProformaSerializer(serializers.ModelSerializer):
    # Esto permite ver los detalles dentro de la proforma
    detalles = DetalleProformaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Proforma
        fields = '__all__'