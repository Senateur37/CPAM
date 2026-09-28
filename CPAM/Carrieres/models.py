from django.db import models


class Offre(models.Model):
    CATEGORIE_CHOICES = [
        ('formation', 'Formation'),
        ('vente', 'Vente'),
        ('stage', 'Stage'),
        ('recrutement', 'Recrutement'),
        ('autre', 'Autre'),
    ]

    titre = models.CharField(max_length=150)
    categorie = models.CharField(max_length=20, choices=CATEGORIE_CHOICES)
    description = models.TextField()
    lieu = models.CharField(max_length=150, blank=True)
    active = models.BooleanField(default=True)
    date_publication = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_publication']

    def __str__(self):
        return f"{self.titre} ({self.get_categorie_display()})"


class Candidature(models.Model):
    STATUT_CHOICES = [
        ('nouveau', 'Nouveau'),
        ('en_cours', 'En cours d’examen'),
        ('accepte', 'Accepté'),
        ('refuse', 'Refusé'),
    ]

    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='candidatures')
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    cv = models.FileField(upload_to='candidatures/cv/', blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='nouveau')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.nom} — {self.offre.titre}"
