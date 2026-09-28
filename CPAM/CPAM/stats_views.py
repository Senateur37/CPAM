from decimal import Decimal
import datetime
from django.db.models import Avg, Count, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from Agriculture.models import Culture, Irrigation
from Comptabilite.models import Facture, Transaction
from Comptes.models import Ferme
from Elevage.models import Animal, SanteAnimale
from Psciculture.models import Bassin, Poisson, QualiteEau


class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tx_qs    = Transaction.objects.all()
        revenus  = tx_qs.filter(type='revenu').aggregate(total=Sum('montant'))['total'] or Decimal('0')
        depenses = tx_qs.filter(type='depense').aggregate(total=Sum('montant'))['total'] or Decimal('0')
        solde    = revenus - depenses

        today  = timezone.now().date()
        months = []
        for i in range(11, -1, -1):
            month_date = (today.replace(day=1) - datetime.timedelta(days=i * 30)).replace(day=1)
            label = month_date.strftime('%b %Y')
            m, y  = month_date.month, month_date.year
            rev = tx_qs.filter(type='revenu',  date__year=y, date__month=m).aggregate(total=Sum('montant'))['total'] or Decimal('0')
            dep = tx_qs.filter(type='depense', date__year=y, date__month=m).aggregate(total=Sum('montant'))['total'] or Decimal('0')
            months.append({'mois': label, 'revenus': float(rev), 'depenses': float(dep)})

        total_factures   = Facture.objects.count()
        factures_payees  = Facture.objects.filter(payee=True).count()
        montant_factures = Facture.objects.aggregate(total=Sum('montant'))['total'] or Decimal('0')

        cultures_by_saison  = list(Culture.objects.values('saison').annotate(count=Count('id')).order_by('-count'))
        rendement_moyen     = Culture.objects.aggregate(avg=Avg('rendement_moyen'))['avg'] or 0
        irrigations_by_type = list(Irrigation.objects.values('type').annotate(count=Count('id')).order_by('-count'))

        animaux_by_espece = list(Animal.objects.values('espece').annotate(count=Count('id')).order_by('-count')[:8])
        poids_moyen       = Animal.objects.aggregate(avg=Avg('poids'))['avg'] or 0
        total_animaux     = Animal.objects.count()
        total_visites     = SanteAnimale.objects.count()

        bassins_by_type    = list(Bassin.objects.values('type').annotate(count=Count('id')).order_by('-count'))
        poissons_by_espece = list(Poisson.objects.values('espece').annotate(count=Count('id')).order_by('-count')[:6])
        capacite_totale    = Bassin.objects.aggregate(total=Sum('capacite'))['total'] or Decimal('0')
        ph_moyen  = QualiteEau.objects.aggregate(avg=Avg('ph'))['avg'] or 0
        temp_moy  = QualiteEau.objects.aggregate(avg=Avg('temperature'))['avg'] or 0
        oxy_moyen = QualiteEau.objects.aggregate(avg=Avg('oxygene'))['avg'] or 0

        fermes_count = Ferme.objects.count()
        fermes_list  = list(
            Ferme.objects.annotate(
                nb_cultures=Count('cultures', distinct=True),
                nb_animaux=Count('animaux', distinct=True),
                nb_bassins=Count('bassins', distinct=True),
            ).values('nom', 'surface_totale', 'localisation', 'nb_cultures', 'nb_animaux', 'nb_bassins').order_by('nom')
        )

        return Response({
            'comptabilite': {
                'revenus': float(revenus), 'depenses': float(depenses), 'solde': float(solde),
                'total_factures': total_factures, 'factures_payees': factures_payees,
                'factures_impayees': total_factures - factures_payees,
                'montant_factures': float(montant_factures),
                'evolution_mensuelle': months,
            },
            'agriculture': {
                'total_cultures': Culture.objects.count(), 'rendement_moyen': float(rendement_moyen),
                'cultures_by_saison': cultures_by_saison, 'irrigations_by_type': irrigations_by_type,
            },
            'elevage': {
                'total_animaux': total_animaux, 'poids_moyen': float(poids_moyen),
                'total_visites': total_visites, 'animaux_by_espece': animaux_by_espece,
            },
            'pisciculture': {
                'capacite_totale': float(capacite_totale), 'ph_moyen': float(ph_moyen),
                'temperature_moy': float(temp_moy), 'oxygene_moyen': float(oxy_moyen),
                'bassins_by_type': bassins_by_type, 'poissons_by_espece': poissons_by_espece,
            },
            'fermes': {'total': fermes_count, 'liste': fermes_list},
        })
