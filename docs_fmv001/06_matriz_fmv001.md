# 06 - Matriz de Riesgo

## Definicion

La matriz de riesgo cruza **probabilidad** (eje Y) con **impacto** (eje X) para
obtener el nivel de riesgo inherente de cada amenaza identificada.

### Escala de probabilidad (5 niveles)

| Nivel | Valor | Descripcion                                          |
|-------|-------|------------------------------------------------------|
| Muy baja | 1 | Explotacion requiere condiciones muy especificas. |
| Baja     | 2 | Requiere usuario autenticado o caracteristicas raras. |
| Media    | 3 | Atacante con herramientas publicas (sqlmap, XSStrike). |
| Alta     | 4 | Explotacion trivial, automatizable.                  |
| Muy alta | 5 | Payload de un solo click, sin autenticacion.        |

### Escala de impacto (5 niveles)

| Nivel | Valor | Descripcion (trio CIA)                                   |
|-------|-------|----------------------------------------------------------|
| Insignificante | 1 | Sin dano real, solo ruido.                       |
| Menor         | 2 | Dano reputacional leve.                          |
| Moderado      | 3 | perdida economica < 10k USD.                     |
| Mayor         | 4 | Filtracion de datos personales, regulacion.      |
| Catastrofico  | 5 | Cierre operativo, multa critica, perdida total. |

## Formula

```
Riesgo = Probabilidad x Impacto
```

| Rango    | Nivel          | Color sugerido |
|----------|----------------|----------------|
| 1 - 4    | Bajo           | Verde           |
| 5 - 9    | Medio          | Amarillo        |
| 10 - 16  | Alto           | Naranja         |
| 17 - 25  | Critico        | Rojo            |

## Hallazgos principales

| ID  | Amenaza              | Prob. | Imp. | Riesgo | CVSS |
|-----|----------------------|-------|------|--------|------|
| H-01 | SQL Injection        | 5     | 5    | 25     | 9.1  |
| H-02 | XSS Reflected        | 4     | 3    | 12     | 6.1  |
| H-03 | Command Injection    | 4     | 5    | 20     | 9.8  |
| H-04 | Falta de CSP         | 3     | 3    | 9      | 5.4  |
| H-05 | Cookies sin HttpOnly | 3     | 3    | 9      | 5.3  |

> La representacion visual interactiva se encuentra en la pagina **Matriz** de la SPA.