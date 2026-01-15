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
        # ESTA LÍNEA ES LA CLAVE: Le dice que no pida 'proforma' al validar
        read_only_fields = ['proforma']

class ProformaSerializer(serializers.ModelSerializer):
    # 'many=True' permite recibir una lista de detalles
    # Quitamos 'read_only' para permitir escribir
    detalles = DetalleProformaSerializer(many=True) 
    
    class Meta:
        model = Proforma
        fields = '__all__'

    # Sobreescribimos el método CREATE para guardar padre e hijos
    def create(self, validated_data):
        # 1. Sacamos los datos de la lista de detalles
        detalles_data = validated_data.pop('detalles')
        
        # 2. Creamos la Proforma (El Padre)
        proforma = Proforma.objects.create(**validated_data)
        
        # 3. Recorremos la lista y creamos cada detalle vinculado a la proforma
        for detalle_data in detalles_data:
            DetalleProforma.objects.create(proforma=proforma, **detalle_data)
            
        return proforma