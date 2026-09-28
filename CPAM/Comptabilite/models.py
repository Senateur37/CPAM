from django.db import models


class CategorieTransaction(models.Model):
    TYPE_CHOICES = [
        ('revenu', 'Revenu'),
        ('depense', 'Dépense'),
    ]

    nom = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.nom} ({self.get_type_display()})"


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('revenu', 'Revenu'),
        ('depense', 'Dépense'),
    ]

    ferme = models.ForeignKey('Comptes.Ferme', on_delete=models.CASCADE, related_name='transactions')
    categorie = models.ForeignKey(CategorieTransaction, on_delete=models.SET_NULL, null=True, related_name='transactions')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_type_display()} - {self.montant} - {self.date}"


class Facture(models.Model):
    ferme = models.ForeignKey('Comptes.Ferme', on_delete=models.CASCADE, related_name='factures')
    numero = models.CharField(max_length=50, unique=True)
    date_emission = models.DateField()
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    payee = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"Facture {self.numero} - {self.ferme.nom}"
