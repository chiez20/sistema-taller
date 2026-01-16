from rest_framework import viewsets, filters
from rest_framework.decorators import action
from django.http import HttpResponse
from .models import Cliente, Vehiculo, Producto, Proforma
from .serializers import (
    ClienteSerializer, VehiculoSerializer, ProductoSerializer, 
    ProformaSerializer, ProformaListSerializer
)

# --- IMPORTANTE: Importar Decimal para el dinero ---
from decimal import Decimal 

# --- Librerías para el PDF ---
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from rest_framework.permissions import IsAuthenticated

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated] # <--- ¡CANDADO PUESTO!

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['placa', 'marca', 'modelo']
    permission_classes = [IsAuthenticated] # <--- ¡CANDADO PUESTO!

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'codigo']
    permission_classes = [IsAuthenticated] # <--- ¡CANDADO PUESTO!

class ProformaViewSet(viewsets.ModelViewSet):
    queryset = Proforma.objects.all().order_by('-fecha')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ProformaListSerializer
        return ProformaSerializer

    # --- FUNCIÓN PDF (Con corrección Decimal) ---
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        proforma = self.get_object()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="orden_{proforma.id}.pdf"'

        p = canvas.Canvas(response, pagesize=letter)
        ancho, alto = letter

        # 1. ENCABEZADO
        p.setFont("Helvetica-Bold", 18)
        p.drawString(50, alto - 50, "ORDEN DE TRABAJO / PROFORMA")
        
        p.setFont("Helvetica", 12)
        p.drawString(400, alto - 50, f"N° Orden: {proforma.id}")
        p.drawString(400, alto - 70, f"Fecha: {proforma.fecha}")

        # 2. DATOS
        p.line(50, alto - 90, 550, alto - 90)
        
        p.setFont("Helvetica-Bold", 10)
        # Usamos relaciones seguras (vehiculo -> cliente)
        # NOTA: Si vuelve a fallar por atributos vacíos, usamos 'getattr' o validamos antes
        nombre_cliente = proforma.vehiculo.cliente.nombre if proforma.vehiculo.cliente else "S/N"
        cedula_cliente = proforma.vehiculo.cliente.cedula if proforma.vehiculo.cliente else "S/N"

        p.drawString(50, alto - 110, f"Cliente: {nombre_cliente}")
        p.drawString(50, alto - 130, f"CI/RUC: {cedula_cliente}")
        
        p.drawString(300, alto - 110, f"Vehículo: {proforma.vehiculo.marca} {proforma.vehiculo.modelo}")
        p.drawString(300, alto - 130, f"Placa: {proforma.vehiculo.placa}")
        p.drawString(300, alto - 150, f"Km: {proforma.kilometraje}")

        # 3. CABECERA TABLA
        y = alto - 190
        p.setFillColor(colors.lightgrey)
        p.rect(50, y, 500, 20, fill=True, stroke=False)
        p.setFillColor(colors.black)
        p.setFont("Helvetica-Bold", 10)
        p.drawString(60, y + 6, "CANT")
        p.drawString(120, y + 6, "DESCRIPCIÓN")
        p.drawString(400, y + 6, "P. UNIT")
        p.drawString(480, y + 6, "TOTAL")
        
        y -= 20 

        # 4. LISTA DE PRODUCTOS
        p.setFont("Helvetica", 10)
        detalles = proforma.detalles.all()
        
        # Inicializamos como Decimal(0) para evitar errores de tipo
        suma_subtotal = Decimal(0) 
        
        for detalle in detalles:
            # Cálculo seguro
            fila_total = detalle.cantidad * detalle.precio_al_momento
            suma_subtotal += fila_total

            p.drawString(65, y - 10, str(detalle.cantidad))
            p.drawString(120, y - 10, detalle.producto.nombre[:45])
            p.drawString(400, y - 10, f"${detalle.precio_al_momento:.2f}")
            p.drawString(480, y - 10, f"${fila_total:.2f}")
            
            y -= 20
            
            if y < 50:
                p.showPage()
                y = alto - 50

        # 5. TOTALES FINALES (CORREGIDO: Decimal * Decimal)
        iva = suma_subtotal * Decimal("0.15") # <--- AQUÍ ESTABA EL ERROR
        total_a_pagar = suma_subtotal + iva

        p.line(50, y - 10, 550, y - 10)
        y -= 30
        
        p.setFont("Helvetica-Bold", 10)
        p.drawString(380, y + 15, "SUBTOTAL:")
        p.drawString(480, y + 15, f"${suma_subtotal:.2f}")

        p.drawString(380, y, "IVA (15%):")
        p.drawString(480, y, f"${iva:.2f}")

        p.setFont("Helvetica-Bold", 12)
        p.drawString(380, y - 20, "TOTAL A PAGAR:")
        p.drawString(480, y - 20, f"${total_a_pagar:.2f}")

        # 6. GUARDAR
        p.showPage()
        p.save()
        
        return response
    permission_classes = [IsAuthenticated] # <--- ¡CANDADO PUESTO!