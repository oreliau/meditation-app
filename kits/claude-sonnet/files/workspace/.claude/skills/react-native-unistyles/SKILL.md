---
name: react-native-unistyles
description: Aide à écrire, migrer, débugger ou reviewer du code utilisant React Native Unistyles 3.0 (styling cross-platform iOS/Android/Web via StyleSheet, themes, variants, breakpoints, media queries, ScopedTheme, UnistylesRuntime). Utilise systématiquement ce skill dès que le code ou la demande mentionne "unistyles", "react-native-unistyles", un fichier "unistyles.ts", StyleSheet.create avec theme/rt, des "variants"/"compoundVariants" dans un style RN, mq/breakpoints RN, withUnistyles, useUnistyles, UnistylesRuntime, ScopedTheme, ou plus généralement dès qu'on fait du style cross-platform React Native/Expo avec thèmes clairs/sombres, responsive design ou design system partagé web+mobile — même si l'utilisateur ne cite pas explicitement "Unistyles" par son nom.
---

# React Native Unistyles 3.0

Unistyles est un remplaçant du `StyleSheet` de React Native qui ajoute : thèmes, breakpoints, variants, compound variants, media queries, dynamic functions, scoped themes, et un support web natif — le tout sans re-render React (mises à jour directes du ShadowTree via C++/Fabric).

Ce skill sert de mémo technique fiable pour écrire du code Unistyles correct dès la génération, sans réinventer une API StyleSheet classique ou halluciner une syntaxe obsolète (v2).

## Repères essentiels à toujours respecter

1. **Prérequis stricts** : New Architecture obligatoire, React Native 0.78.0+, Expo SDK 53+ si Expo, `react-native-nitro-modules` en dépendance figée. **Pas de support Expo Go** (dev client requis).
2. **Import** : toujours `import { StyleSheet } from 'react-native-unistyles'` (jamais depuis `'react-native'` une fois la lib installée).
3. **Config unique** : `StyleSheet.configure({ themes, breakpoints, settings })` dans un fichier `unistyles.ts` importé **avant tout usage** (souvent `index.ts` ou tout en haut du point d'entrée).
4. **Jamais de spread de styles** — c'est l'erreur la plus fréquente et la plus cassante :
   ```tsx
   // ❌ interdit — casse l'état C++
   <View style={{...styles.a, ...styles.b}} />
   // ✅ toujours la syntaxe tableau
   <View style={[styles.a, styles.b]} />
   ```
5. **API v3, pas v2** : pas de `createStyleSheet`, pas de `useStyles`, pas de `UnistylesProvider`, pas de `UnistylesRegistry`. C'est `StyleSheet.create`, `styles.useVariants({...})`, et plus de Provider du tout. Si tu vois du code avec ces anciens noms, c'est de la v2 → proposer la migration (voir référence).
6. **Accès au thème dans un composant** : privilégier `theme` injecté directement par `StyleSheet.create(theme => ...)`. N'utiliser `useUnistyles()` qu'en dernier recours (re-render à chaque changement) — voir la référence pour l'algorithme de décision complet (`withUnistyles` d'abord).
7. **Runtime (`rt`)** : accessible en 2e argument de `StyleSheet.create((theme, rt) => ...)` pour insets, dimensions, breakpoint courant, etc. `UnistylesRuntime` (import direct) fait la même chose hors StyleSheet mais ne déclenche jamais de re-render.

## Comment utiliser ce skill

Pour toute tâche de génération, revue ou debug de code Unistyles :

1. Ouvre `references/full-docs.md` — il contient la documentation officielle condensée en français-friendly (structure, exemples de code fidèles à la doc officielle) sur : configuration, theming/adaptive themes, breakpoints, media queries (`mq`), variants/compound variants, dynamic functions, ScopedTheme, StyleSheet API complète, UnistylesRuntime (tous les getters/setters), useUnistyles, Display/Hide, dimensions/insets, edge-to-edge, Reanimated, SSR Next.js, Expo Router, testing (Jest/mocks), guide de migration 2.0→3.0, et l'algorithme de décision pour les composants tiers.
2. Si la doc locale ne couvre pas un point précis (ex: page dédiée `variants` seule, `withUnistyles` en détail, `web-only`/pseudo-classes CSS, `web-styles`, options avancées du babel-plugin, ou la FAQ), **fetch directement la page correspondante** sur `https://unistyl.es/v3/references/<nom>` ou `https://unistyl.es/v3/other/<nom>`, ou re-fetch `https://unistyl.es/llms-full.txt` pour la suite (le contenu est tronqué après la section `useUnistyles`).
3. Écris le code en respectant strictement les patterns v3 ci-dessus. En cas de doute entre plusieurs approches (ex: `withUnistyles` vs `useUnistyles` pour une lib tierce), suis l'algorithme de décision documenté plutôt que de deviner.

## Erreurs de debug courantes (raccourci)

- **Une vue ne se met pas à jour** → dans l'ordre : (1) vérifier que le babel plugin détecte bien le fichier (option `debug: true`), (2) vérifier que la dépendance (theme/breakpoint/etc.) est bien utilisée directement dans le style et pas via une variable intermédiaire non trackée, (3) vérifier s'il s'agit d'un composant tiers non-RN (→ algorithme de décision withUnistyles/useUnistyles), (4) sur web, `console.log(styles.x)` renvoie `{}` — normal, ce n'est pas un bug.
- **Warning "Style is not bound!" ou "we detected style object with N unistyles styles"** → spread de styles détecté, remplacer par la syntaxe tableau `[]`.
- **Erreur sur `initialTheme` + `adaptiveThemes`** → ces deux options sont mutuellement exclusives, n'en garder qu'une.
