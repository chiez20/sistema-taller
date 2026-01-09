from django.contrib import admin
from .models import Cliente, Vehiculo, Producto, Proforma, DetalleProforma

# Esto permite ver las tablas en el panel de administrador
admin.site.register(Cliente)
admin.site.register(Vehiculo)
admin.site.register(Producto)

admin.site.register(Proforma)
admin.site.register(DetalleProforma)