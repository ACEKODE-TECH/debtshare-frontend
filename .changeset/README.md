# Changesets

Este directorio es gestionado por [Changesets](https://github.com/changesets/changesets).

Al terminar una feature con cambio relevante para el usuario final:

```bash
npx changeset
```

Selecciona el tipo de bump (patch/minor/major), escribe un resumen del cambio,
y commitea el archivo generado junto a tu codigo. Al mergear a main, el workflow
de release recoge los changesets pendientes y actualiza el CHANGELOG.
