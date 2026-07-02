# 09 - Prompts y Proceso de Investigacion con IA

> Documentacion academica de los prompts utilizados durante la auditoria.
> La IA se uso como **asistente**, no como autor unico del informe.

## Prompt 1 - Plan de trabajo

```
Actua como auditor de seguridad senior con experiencia en OWASP Top 10.
Tengo una instancia DVWA desplegada y una app React en Vercel.
Disename un plan de trabajo en 8 fases para una auditoria web academica
de 4 semanas, indicando entregables por fase.
```

**Resultado:** cronograma base con fases de descubrimiento, explotacion,
documentacion, mitigacion y despliegue.

## Prompt 2 - Payload SQLi

```
Genera 5 payloads de SQL Injection para DVWA nivel Low, clasificados por
tipo (tautologia, union-based, boolean-based, time-based, stacked queries).
Incluye la query vulnerable esperada y la consulta final generada.
```

**Validacion:** probados manualmente contra DVWA con `sqlmap --batch --level=3`.

## Prompt 3 - Payload XSS

```
Crea 5 payloads XSS funcionales para DVWA nivel Low y Medium:
- basico en script
- en atributo
- via event handler (onerror)
- que esquive filtro <script>
- bypass con codificacion HTML/URL
```

**Validacion:** ejecutados en navegador con DevTools abierto para revisar DOM.

## Prompt 4 - Heatmap

```
Disename una matriz de calor 5x5 (probabilidad vs impacto) para
clasificar hallazgos de seguridad. Incluir logica JS que asigne color
segun el valor de riesgo (PxI) y permita hacer hover para ver detalle.
```

**Resultado:** ver componente `Matriz.jsx` en `src/components`.

## Prompt 5 - Revision de codigo

```
Actua como revisor de codigo senior. Evalua este fragmento React por
vulnerabilidades XSS, inyeccion, exposicion de secretos y malas practicas:
[fragmento]
```

**Iteracion:** 3 rondas de revision; cada hallazgo cerro con commit nombrado
`fix(security): descripcion corta`.

## Prompt 6 - Generacion de documentacion

```
Redacta un markdown profesional de 600-800 palabras sobre SQL Injection
que incluya: descripcion tecnica, payload, impacto en banca, CVSS,
prevencion con ejemplo de codigo y mitigacion.
```

**Validacion:** se contrasto la informacion con OWASP Cheat Sheet y
documentacion oficial de MySQL.

## Prompt 7 - Prompt final para informe

```
Genera un resumen ejecutivo de maximo 250 palabras para una auditoria
web academica, dirigido a un docente tecnico. Debe cubrir:
- 3 hallazgos criticos
- 3 controles implementados
- puntuacion CVSS promedio
- conclusion sobre el nivel de riesgo residual.
```

## Lecciones aprendidas

1. La IA **acelera la redaccion** pero debe validarse manualmente cada payload.
2. Los CVSS deben calcularse con la calculadora oficial, no inventarse.
3. Documentar el prompt es parte del entregable academico y aporta transparencia.
4. Combinar IA + lectura de OWASP/NIST produce informes consistentes.