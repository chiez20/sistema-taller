from django.db import models

# 1. Tabla de Clientes
class Cliente(models.Model):
    cedula = models.CharField(max_length=15, unique=True)
    nombre = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

# 2. Tabla de Vehículos
class Vehiculo(models.Model):
    placa = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    color = models.CharField(max_length=30, blank=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.placa} - {self.modelo}"

# 3. Tabla de Productos y Servicios
class Producto(models.Model):
    TIPOS = [
        ('REPUESTO', 'Repuesto'),
        ('LUBRICANTE', 'Lubricante'),
        ('MANO_OBRA', 'Mano de Obra'),
    ]
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=20, choices=TIPOS)
    
    # Este campo es CLAVE: Si es True, el sistema pedirá la pieza vieja
    genera_residuo = models.BooleanField(default=False, verbose_name="¿Genera pieza vieja?") 

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

# 4. Tabla de Proformas (Encabezado)
class Proforma(models.Model):
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.PROTECT)
    fecha = models.DateTimeField(auto_now_add=True)
    kilometraje = models.IntegerField()
    parte_policial = models.CharField(max_length=50, blank=True, null=True)
    observaciones = models.TextField(blank=True)

    def __str__(self):
        return f"Proforma #{self.id} - {self.vehiculo.placa}"

# 5. Tabla de Detalles (Filas de la proforma)
class DetalleProforma(models.Model):
    proforma = models.ForeignKey(Proforma, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.IntegerField(default=1)
    precio_al_momento = models.DecimalField(max_digits=10, decimal_places=2)
    # Check manual: ¿El cliente dejó la pieza vieja?
    ingreso_bodega = models.BooleanField(default=True) 

    def save(self, *args, **kwargs):
        # Si no se especifica precio, toma el actual del producto
        if not self.precio_al_momento:
            self.precio_al_momento = self.producto.precio_unitario
        super().save(*args, **kwargs)