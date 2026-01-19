from rest_framework import serializers
from .models import Cliente, Vehiculo, Producto, Proforma, DetalleProforma

# --- 1. Serializadores BÁSICOS ---

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombre')
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())

    class Meta:
        model = Vehiculo
        # AGREGA 'anio' A LA LISTA 👇
        fields = ['id', 'placa', 'marca', 'modelo', 'color', 'anio', 'cliente', 'cliente_nombre']

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

# --- 2. Serializadores de PROFORMA (Lógica de Negocio) ---

class DetalleProformaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleProforma
        fields = '__all__'
        read_only_fields = ['proforma']

class ProformaSerializer(serializers.ModelSerializer):
    detalles = DetalleProformaSerializer(many=True) 
    
    class Meta:
        model = Proforma
        fields = '__all__'
        read_only_fields = ['total'] 

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        
        # Creamos la Proforma
        proforma = Proforma.objects.create(**validated_data)
        
        total_acumulado = 0 

        # Creamos los detalles y sumamos
        for detalle_data in detalles_data:
            detalle = DetalleProforma.objects.create(proforma=proforma, **detalle_data)
            subtotal = detalle.cantidad * detalle.precio_al_momento
            total_acumulado += subtotal
        
        # Guardamos el total
        proforma.total = total_acumulado
        proforma.save()
            
        return proforma

class ProformaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proforma
        fields = '__all__'
        depth = 1