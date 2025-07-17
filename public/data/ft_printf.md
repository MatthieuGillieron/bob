# ft_printf

## Description
Recoder la fonction printf de la libc.

## Prototype
```c
int ft_printf(const char *, ...);
```

## Spécificateurs obligatoires
- `%c` : caractère
- `%s` : chaîne de caractères  
- `%p` : pointeur en hexadécimal
- `%d` : nombre décimal
- `%i` : entier en base 10
- `%u` : nombre décimal non signé
- `%x` : nombre en hexadécimal (minuscules)
- `%X` : nombre en hexadécimal (majuscules)
- `%%` : caractère %

## Fonctions autorisées
- malloc, free, write
- va_start, va_arg, va_copy, va_end

## Objectifs pédagogiques
- Comprendre les arguments variables
- Manipulation des types de données
- Gestion de la mémoire
- Formatage de sortie