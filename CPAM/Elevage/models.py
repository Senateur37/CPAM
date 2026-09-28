from django.db import models


class Animal(models.Model):
    espece = models.CharField(max_length=50)  # bovin, ovin, volaille...
    race = models.CharField(max_length=50)
    age = models.IntegerField()  # en mois
    poids = models.DecimalField(max_digits=6, decimal_places=2)
    date_naissance = models.DateField()
    ferme = models.ForeignKey('Comptes.Ferme', on_delete=models.CASCADE, related_name='animaux')

    def __str__(self):
        return f"{self.espece} ({self.race}) - {self.age} mois"


class SanteAnimale(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='visites_sante')
    date_visite = models.DateField()
    diagnostic = models.TextField()
    traitement = models.TextField()

    def __str__(self):
        return f"Santé de {self.animal.espece} - {self.date_visite}"
