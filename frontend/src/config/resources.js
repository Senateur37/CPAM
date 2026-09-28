// Chaque ressource décrit un modèle Django exposé via l'API DRF :
// - endpoint  : chemin relatif sous /api/
// - columns   : colonnes affichées dans le tableau (clé + libellé)
// - fields    : champs du formulaire de création (type, options pour les listes déroulantes)
// - itemLabel : construit le libellé d'un élément quand il est utilisé comme option
//               dans une liste déroulante 'relation' d'un autre formulaire

export const RESOURCES = {
  fermes: {
    label: 'Fermes',
    endpoint: '/comptes/fermes/',
    itemLabel: (item) => item.nom,
    columns: [
      { key: 'nom', label: 'Nom' },
      { key: 'localisation', label: 'Localisation' },
      { key: 'surface_totale', label: 'Surface (ha)' },
      { key: 'proprietaire_nom', label: 'Propriétaire' },
    ],
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'localisation', label: 'Localisation', type: 'text', required: true },
      { name: 'surface_totale', label: 'Surface totale (ha)', type: 'number', step: '0.01', required: true },
    ],
  },
  cultures: {
    label: 'Cultures',
    endpoint: '/agriculture/cultures/',
    itemLabel: (item) => item.nom,
    columns: [
      { key: 'nom', label: 'Nom' },
      { key: 'saison', label: 'Saison' },
      { key: 'rendement_moyen', label: 'Rendement moyen' },
      { key: 'date_plantation', label: 'Plantation' },
      { key: 'date_recolte', label: 'Récolte' },
      { key: 'ferme_nom', label: 'Ferme' },
    ],
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'saison', label: 'Saison', type: 'text', required: true },
      { name: 'sol_requis', label: 'Sol requis', type: 'text', required: true },
      { name: 'rendement_moyen', label: 'Rendement moyen', type: 'number', step: '0.01', required: true },
      { name: 'date_plantation', label: 'Date de plantation', type: 'date', required: true },
      { name: 'date_recolte', label: 'Date de récolte', type: 'date', required: true },
      { name: 'ferme', label: 'Ferme', type: 'relation', resource: 'fermes', required: true },
    ],
  },
  irrigations: {
    label: 'Irrigations',
    endpoint: '/agriculture/irrigations/',
    columns: [
      { key: 'type', label: 'Type' },
      { key: 'debit', label: 'Débit' },
      { key: 'culture_nom', label: 'Culture' },
    ],
    fields: [
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'debit', label: 'Débit', type: 'number', step: '0.01', required: true },
      { name: 'culture', label: 'Culture', type: 'relation', resource: 'cultures', required: true },
    ],
  },
  animaux: {
    label: 'Animaux',
    endpoint: '/elevage/animaux/',
    itemLabel: (item) => `${item.espece} (${item.race})`,
    columns: [
      { key: 'espece', label: 'Espèce' },
      { key: 'race', label: 'Race' },
      { key: 'age', label: 'Âge (mois)' },
      { key: 'poids', label: 'Poids' },
      { key: 'ferme_nom', label: 'Ferme' },
    ],
    fields: [
      { name: 'espece', label: 'Espèce', type: 'text', required: true },
      { name: 'race', label: 'Race', type: 'text', required: true },
      { name: 'age', label: 'Âge (mois)', type: 'number', required: true },
      { name: 'poids', label: 'Poids (kg)', type: 'number', step: '0.01', required: true },
      { name: 'date_naissance', label: 'Date de naissance', type: 'date', required: true },
      { name: 'ferme', label: 'Ferme', type: 'relation', resource: 'fermes', required: true },
    ],
  },
  sante: {
    label: 'Santé animale',
    endpoint: '/elevage/sante/',
    columns: [
      { key: 'animal_label', label: 'Animal' },
      { key: 'date_visite', label: 'Date visite' },
      { key: 'diagnostic', label: 'Diagnostic' },
    ],
    fields: [
      { name: 'animal', label: 'Animal', type: 'relation', resource: 'animaux', required: true },
      { name: 'date_visite', label: 'Date de visite', type: 'date', required: true },
      { name: 'diagnostic', label: 'Diagnostic', type: 'textarea', required: true },
      { name: 'traitement', label: 'Traitement', type: 'textarea', required: true },
    ],
  },
  bassins: {
    label: 'Bassins',
    endpoint: '/psciculture/bassins/',
    itemLabel: (item) => item.nom,
    columns: [
      { key: 'nom', label: 'Nom' },
      { key: 'type', label: 'Type' },
      { key: 'capacite', label: 'Capacité (m³)' },
      { key: 'ferme_nom', label: 'Ferme' },
    ],
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'capacite', label: 'Capacité (m³)', type: 'number', step: '0.01', required: true },
      { name: 'ferme', label: 'Ferme', type: 'relation', resource: 'fermes', required: true },
    ],
  },
  poissons: {
    label: 'Poissons',
    endpoint: '/psciculture/poissons/',
    columns: [
      { key: 'espece', label: 'Espèce' },
      { key: 'bassin_nom', label: 'Bassin' },
      { key: 'date_ensemencement', label: 'Ensemencement' },
      { key: 'poids_moyen', label: 'Poids moyen' },
    ],
    fields: [
      { name: 'espece', label: 'Espèce', type: 'text', required: true },
      { name: 'date_ensemencement', label: "Date d'ensemencement", type: 'date', required: true },
      { name: 'poids_moyen', label: 'Poids moyen (kg)', type: 'number', step: '0.01', required: true },
      { name: 'bassin', label: 'Bassin', type: 'relation', resource: 'bassins', required: true },
    ],
  },
  'qualite-eau': {
    label: "Qualité de l'eau",
    endpoint: '/psciculture/qualite-eau/',
    columns: [
      { key: 'bassin_nom', label: 'Bassin' },
      { key: 'date_mesure', label: 'Date mesure' },
      { key: 'ph', label: 'pH' },
      { key: 'temperature', label: 'Température' },
      { key: 'oxygene', label: 'Oxygène' },
    ],
    fields: [
      { name: 'bassin', label: 'Bassin', type: 'relation', resource: 'bassins', required: true },
      { name: 'ph', label: 'pH', type: 'number', step: '0.1', required: true },
      { name: 'temperature', label: 'Température (°C)', type: 'number', step: '0.1', required: true },
      { name: 'oxygene', label: 'Oxygène (mg/L)', type: 'number', step: '0.01', required: true },
    ],
  },
  categories: {
    label: 'Catégories comptables',
    endpoint: '/comptabilite/categories/',
    itemLabel: (item) => item.nom,
    columns: [
      { key: 'nom', label: 'Nom' },
      { key: 'type', label: 'Type' },
    ],
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: [
          { value: 'revenu', label: 'Revenu' },
          { value: 'depense', label: 'Dépense' },
        ],
      },
    ],
  },
  transactions: {
    label: 'Transactions',
    endpoint: '/comptabilite/transactions/',
    columns: [
      { key: 'type', label: 'Type' },
      { key: 'montant', label: 'Montant' },
      { key: 'date', label: 'Date' },
      { key: 'ferme_nom', label: 'Ferme' },
      { key: 'categorie_nom', label: 'Catégorie' },
    ],
    fields: [
      { name: 'ferme', label: 'Ferme', type: 'relation', resource: 'fermes', required: true },
      { name: 'categorie', label: 'Catégorie', type: 'relation', resource: 'categories', required: false },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: [
          { value: 'revenu', label: 'Revenu' },
          { value: 'depense', label: 'Dépense' },
        ],
      },
      { name: 'montant', label: 'Montant', type: 'number', step: '0.01', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
    ],
  },
  factures: {
    label: 'Factures',
    endpoint: '/comptabilite/factures/',
    columns: [
      { key: 'numero', label: 'Numéro' },
      { key: 'ferme_nom', label: 'Ferme' },
      { key: 'date_emission', label: 'Émission' },
      { key: 'montant', label: 'Montant' },
      { key: 'payee', label: 'Payée' },
    ],
    fields: [
      { name: 'ferme', label: 'Ferme', type: 'relation', resource: 'fermes', required: true },
      { name: 'numero', label: 'Numéro', type: 'text', required: true },
      { name: 'date_emission', label: "Date d'émission", type: 'date', required: true },
      { name: 'montant', label: 'Montant', type: 'number', step: '0.01', required: true },
      { name: 'payee', label: 'Payée', type: 'checkbox', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
    ],
  },
  messages: {
    label: 'Messages de contact',
    endpoint: '/contact/messages/',
    columns: [
      { key: 'sujet', label: 'Sujet' },
      { key: 'nom', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'date_creation', label: 'Reçu le' },
      { key: 'lu', label: 'Lu' },
    ],
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'sujet', label: 'Sujet', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
      { name: 'lu', label: 'Lu', type: 'checkbox', required: false },
    ],
  },
  offres: {
    label: 'Offres (Carrières)',
    endpoint: '/carrieres/offres/',
    itemLabel: (item) => item.titre,
    columns: [
      { key: 'titre', label: 'Titre' },
      { key: 'categorie', label: 'Catégorie' },
      { key: 'lieu', label: 'Lieu' },
      { key: 'active', label: 'Active' },
      { key: 'date_publication', label: 'Publiée le' },
    ],
    fields: [
      { name: 'titre', label: 'Titre', type: 'text', required: true },
      {
        name: 'categorie',
        label: 'Catégorie',
        type: 'select',
        required: true,
        options: [
          { value: 'formation', label: 'Formation' },
          { value: 'vente', label: 'Vente' },
          { value: 'stage', label: 'Stage' },
          { value: 'recrutement', label: 'Recrutement' },
          { value: 'autre', label: 'Autre' },
        ],
      },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'lieu', label: 'Lieu', type: 'text', required: false },
      { name: 'active', label: 'Active', type: 'checkbox', required: false },
    ],
  },
  candidatures: {
    label: 'Candidatures',
    endpoint: '/carrieres/candidatures/',
    columns: [
      { key: 'nom', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'offre_titre', label: 'Offre' },
      { key: 'cv', label: 'CV' },
      { key: 'date_creation', label: 'Reçue le' },
      { key: 'statut', label: 'Statut' },
    ],
    fields: [
      { name: 'offre', label: 'Offre', type: 'relation', resource: 'offres', required: true },
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'telephone', label: 'Téléphone', type: 'text', required: false },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: false,
        options: [
          { value: 'nouveau', label: 'Nouveau' },
          { value: 'en_cours', label: 'En cours d’examen' },
          { value: 'accepte', label: 'Accepté' },
          { value: 'refuse', label: 'Refusé' },
        ],
      },
    ],
  },
}

export const NAV_ITEMS = [
  { key: 'fermes', group: 'Comptes' },
  { key: 'cultures', group: 'Agriculture' },
  { key: 'irrigations', group: 'Agriculture' },
  { key: 'animaux', group: 'Élevage' },
  { key: 'sante', group: 'Élevage' },
  { key: 'bassins', group: 'Pisciculture' },
  { key: 'poissons', group: 'Pisciculture' },
  { key: 'qualite-eau', group: 'Pisciculture' },
  { key: 'categories', group: 'Comptabilité' },
  { key: 'transactions', group: 'Comptabilité' },
  { key: 'factures', group: 'Comptabilité' },
  { key: 'messages', group: 'Messages' },
  { key: 'offres', group: 'Carrières' },
  { key: 'candidatures', group: 'Carrières' },
]
