from django.conf import settings
from django.db import models


class Ferme(models.Model):
    proprietaire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='fermes')
    nom = models.CharField(max_length=100)
    localisation = models.CharField(max_length=200)
    surface_totale = models.DecimalField(max_digits=10, decimal_places=2)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom
