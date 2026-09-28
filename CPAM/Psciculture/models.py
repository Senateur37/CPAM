from django.db import models


class Bassin(models.Model):
    nom = models.CharField(max_length=100)
    capacite = models.DecimalField(max_digits=10, decimal_places=2)  # en m³
    type = models.CharField(max_length=50)  # terre, béton, géomembrane
    ferme = models.ForeignKey('Comptes.Ferme', on_delete=models.CASCADE, related_name='bassins')

    def __str__(self):
        return self.nom


class Poisson(models.Model):
    espece = models.CharField(max_length=50)  # tilapia, carpe, etc.
    date_ensemencement = models.DateField()
    poids_moyen = models.DecimalField(max_digits=6, decimal_places=2)
    bassin = models.ForeignKey(Bassin, on_delete=models.CASCADE, related_name='poissons')

    def __str__(self):
        return f"{self.espece} - {self.bassin.nom}"


class QualiteEau(models.Model):
    bassin = models.ForeignKey(Bassin, on_delete=models.CASCADE, related_name='mesures_qualite')
    date_mesure = models.DateTimeField(auto_now_add=True)
    ph = models.DecimalField(max_digits=3, decimal_places=1)
    temperature = models.DecimalField(max_digits=4, decimal_places=1)
    oxygene = models.DecimalField(max_digits=4, decimal_places=2)

    def __str__(self):
        return f"Qualité eau - {self.bassin.nom} - {self.date_mesure:%d/%m/%Y}"
