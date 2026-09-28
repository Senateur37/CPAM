import { IconAnimal, IconFish, IconLeaf } from '../components/icons'

function gallery(folder, names) {
  return names.map((name) => `/images/${folder}/${name}`)
}

// Contenu des pages publiques de présentation (une par module métier).
// Comptabilité n'a volontairement pas de page publique dédiée.
export const MODULE_PAGES = {
  agriculture: {
    path: '/agriculture',
    navLabel: 'Agricole',
    icon: IconLeaf,
    image: '/images/agriculture/agriculture-02.jpg',
    gallery: gallery('agriculture', [
      'agriculture-01.jpg',
      'agriculture-03.jpg',
      'agriculture-05.jpg',
      'agriculture-06.jpg',
      'agriculture-07.jpg',
      'agriculture-10.jpg',
      'agriculture-12.jpg',
      'agriculture-15.jpg',
    ]),
    title: 'Agriculture',
    tagline: 'Notre production agricole, du semis à la récolte',
    description:
      "CPAM cultive plusieurs parcelles suivies en continu : saisons, sols, rendements et irrigation, ferme par ferme, pour piloter chaque campagne au bon moment.",
    features: [
      'Suivi de chaque culture par ferme, saison et type de sol',
      'Rendement moyen et dates de plantation / récolte',
      "Gestion de l'irrigation (type, débit) par culture",
      'Historique consultable à tout moment depuis le tableau de bord',
    ],
  },
  elevage: {
    path: '/elevage',
    navLabel: 'Élevage',
    icon: IconAnimal,
    image: '/images/elevage/elevage-02.jpg',
    gallery: gallery('elevage', [
      'elevage-01.jpg',
      'elevage-03.jpg',
      'elevage-04.jpg',
      'elevage-05.jpg',
      'elevage-06.jpg',
      'elevage-07.jpg',
      'elevage-08.jpg',
      'elevage-09.jpg',
    ]),
    title: 'Élevage',
    tagline: 'La santé et la croissance de notre cheptel, suivies en continu',
    description:
      "CPAM élève plusieurs cheptels suivis animal par animal, avec un historique sanitaire complet pour réagir vite et garder une traçabilité totale.",
    features: [
      'Fiche détaillée par animal (espèce, race, âge, poids, naissance)',
      'Suivi sanitaire complet : visites, diagnostics, traitements',
      'Rattachement de chaque animal à sa ferme',
      'Historique de santé consultable par animal',
    ],
  },
  pisciculture: {
    path: '/pisciculture',
    navLabel: 'Pisciculture',
    icon: IconFish,
    image: '/images/pisciculture/pisciculture-05.jpg',
    gallery: gallery('pisciculture', [
      'pisciculture-01.jpg',
      'pisciculture-02.jpg',
      'pisciculture-03.jpg',
      'pisciculture-04.jpg',
      'pisciculture-07.jpg',
      'pisciculture-08.jpg',
      'pisciculture-10.jpg',
      'pisciculture-12.jpg',
    ]),
    title: 'Pisciculture',
    tagline: "Nos bassins et la qualité de l'eau, sous surveillance continue",
    description:
      'CPAM exploite plusieurs bassins suivis en continu — poissons et qualité de l’eau — pour sécuriser notre production piscicole.',
    features: [
      'Gestion des bassins par ferme (type, capacité)',
      'Suivi des poissons par bassin (espèce, poids moyen, ensemencement)',
      "Mesures de qualité de l'eau : pH, température, oxygène",
      'Historique des mesures par bassin',
    ],
  },
}

export const MODULE_LIST = Object.values(MODULE_PAGES)
