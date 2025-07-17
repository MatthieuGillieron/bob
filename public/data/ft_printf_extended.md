# ft_printf - Guide complet

## Description
Recoder la fonction printf de la libc. Cette fonction permet d'afficher du texte formaté sur la sortie standard.

## Prototype
```c
int ft_printf(const char *format, ...);
```

## Arguments variables (Variadic Functions)
Les fonctions à arguments variables utilisent les macros définies dans <stdarg.h>.

### va_list
Type de données qui stocke les informations nécessaires pour récupérer les arguments supplémentaires.

### va_start(ap, last)
Initialise ap pour pointer sur le premier argument variable. 'last' est le dernier paramètre fixe.
Pense à va_start comme à l'ouverture d'une boîte contenant tous tes arguments.

### va_arg(ap, type)
Récupère l'argument suivant du type spécifié et avance le pointeur.
C'est comme prendre un objet dans la boîte, en sachant quel type d'objet tu cherches.

### va_end(ap)
Nettoie et ferme la liste d'arguments variables.
Comme refermer la boîte une fois que tu as fini.

## Spécificateurs de format

### %c - Caractère
Affiche un seul caractère. Prend un int (promotion automatique de char).

### %s - Chaîne de caractères
Affiche une chaîne terminée par '\0'. Gère les pointeurs NULL.

### %p - Pointeur
Affiche l'adresse mémoire en hexadécimal, préfixée par "0x".

### %d et %i - Entiers décimaux
Affichent des nombres entiers en base 10. %d et %i sont identiques pour printf.

### %u - Entier non signé
Affiche un nombre entier non signé en base 10.

### %x - Hexadécimal minuscules
Affiche un nombre en base 16 avec les lettres a-f en minuscules.

### %X - Hexadécimal majuscules
Affiche un nombre en base 16 avec les lettres A-F en majuscules.

### %% - Caractère %
Affiche le caractère % littéral.

## Fonctions autorisées
- malloc, free : gestion mémoire
- write : écriture sur file descriptor
- va_start, va_arg, va_copy, va_end : gestion arguments variables

## Stratégie d'implémentation

### 1. Parser le format
Parcourir la chaîne caractère par caractère, identifier les spécificateurs.

### 2. Traiter chaque spécificateur
Pour chaque %, déterminer le type et appeler la fonction appropriée.

### 3. Conversion des nombres
Implémenter des fonctions pour convertir int vers string dans différentes bases.

### 4. Gestion des cas spéciaux
- Pointeurs NULL pour %s
- Valeur 0 pour %p
- Nombres négatifs

## Objectifs pédagogiques
- Comprendre les arguments variables
- Manipulation des types de données
- Gestion de la mémoire dynamique
- Conversion de bases numériques
- Formatage de sortie