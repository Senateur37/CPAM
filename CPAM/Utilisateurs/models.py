from django.conf import settings
from django.db import models


class Profil(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('exploitant', 'Exploitant'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profil')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='exploitant')
    telephone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


class ParametreSite(models.Model):
    nom_application = models.CharField(max_length=150, default="CPAM")
    slogan = models.CharField(max_length=255, default="Centre de Production Agricole et Multi-ressources", blank=True)
    description = models.TextField(default="Plateforme intégrée de gestion agricole, d'élevage et de pisciculture.", blank=True)
    logo_url = models.TextField(blank=True, default="")
    email_contact = models.EmailField(default="contact@cpam.com", blank=True)
    telephone = models.CharField(max_length=50, default="+223 70 00 00 00", blank=True)
    adresse = models.CharField(max_length=255, default="Bamako, Mali", blank=True)
    devise = models.CharField(max_length=10, default="FCFA", blank=True)
    site_web = models.URLField(blank=True, default="")
    facebook = models.CharField(max_length=255, blank=True, default="")
    linkedin = models.CharField(max_length=255, blank=True, default="")
    whatsapp = models.CharField(max_length=50, blank=True, default="")
    date_mise_a_jour = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Paramètre du site"
        verbose_name_plural = "Paramètres du site"

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(id=1)
        return obj

    def __str__(self):
        return self.nom_application

