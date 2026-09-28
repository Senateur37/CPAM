from django.db import models


class Culture(models.Model):
    nom = models.CharField(max_length=100)
    saison = models.CharField(max_length=50)  # pluie, sèche, etc.
    sol_requis = models.CharField(max_length=100)
    rendement_moyen = models.DecimalField(max_digits=10, decimal_places=2)
    date_plantation = models.DateField()
    date_recolte = models.DateField()
    ferme = models.ForeignKey('Comptes.Ferme', on_delete=models.CASCADE, related_name='cultures')

    def __str__(self):
        return self.nom


class Irrigation(models.Model):
    type = models.CharField(max_length=50)  # goutte-à-goutte, aspersion...
    debit = models.DecimalField(max_digits=10, decimal_places=2)
    culture = models.ForeignKey(Culture, on_delete=models.CASCADE, related_name='irrigations')

    def __str__(self):
        return f"{self.type} - {self.culture.nom}"
