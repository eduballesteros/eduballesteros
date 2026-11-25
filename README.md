<p align="center">
  <img src="assets/banner.svg?v=mac-3" width="100%" alt="Edu Ballesteros. Desarrollador Backend Java en Sevilla. APIs, integración bancaria e inteligencia artificial aplicada."/>
</p>

<p align="center">
  <a href="https://www.eduballesteros.es"><img src="https://img.shields.io/badge/WEB-eduballesteros.es-ff9f0a?style=for-the-badge&labelColor=1c1c1e" alt="Visitar mi portfolio"/></a>
  <a href="https://www.linkedin.com/in/eduballesteross/"><img src="https://img.shields.io/badge/LINKEDIN-Hablemos-0a84ff?style=for-the-badge&labelColor=1c1c1e" alt="Contactar en LinkedIn"/></a>
  <a href="https://www.eduballesteros.es/cv-eduardo-ballesteros.pdf"><img src="https://img.shields.io/badge/CV-Descargar-30d158?style=for-the-badge&labelColor=1c1c1e" alt="Descargar mi currículum en PDF"/></a>
</p>

<p align="center">
  <a href="#perfil"><code>~/perfil</code></a> &nbsp; · &nbsp;
  <a href="#proyectos"><code>~/proyectos</code></a> &nbsp; · &nbsp;
  <a href="#stack"><code>~/stack</code></a> &nbsp; · &nbsp;
  <a href="#trayectoria"><code>~/trayectoria</code></a> &nbsp; · &nbsp;
  <a href="#actividad"><code>~/actividad</code></a>
</p>

---

## Perfil

Soy **Eduardo Ballesteros Pérez**, desarrollador backend en Sevilla. Trabajo con **Java y Spring Boot**, diseño APIs y conecto sistemas. En **NTT DATA**, para el cliente **Unicaja**, mi día a día gira alrededor de la integración bancaria, los contratos de las APIs y la resiliencia.

Fuera del trabajo construyo productos propios: finanzas personales, herramientas para planos y 3D, y aplicaciones que uso a diario. Me interesa entender el dominio, mantener claras las responsabilidades y poder explicar las decisiones detrás del código.

> **Ahora:** Open Engine y Extrude. **Aprendiendo:** AWS Developer Associate. **Mi forma de trabajar:** arquitectura limpia, pruebas y cambios pequeños que se puedan revisar.

## Proyectos

### [Open Engine](https://github.com/eduballesteros/openfinance-engine)

[![OpenFinance: tu dinero, en un solo sitio](assets/open-engine.svg?v=profile-refresh-5)](https://github.com/eduballesteros/openfinance-engine)

**Finanzas personales, desde el backend.** Mi proyecto para trabajar con cuentas, movimientos y análisis financiero sobre una base Java. Organizado por funcionalidades, con persistencia en PostgreSQL, migraciones y pruebas de integración.

La base backend está en marcha y el frontend en Angular ya muestra el resumen con datos de ejemplo. Las conexiones bancarias con **Enable Banking** y el asistente con **Spring AI y Anthropic** están previstos en la evolución del proyecto.

`Java 21` `Spring Boot 4` `PostgreSQL` `Flyway` `Spring Security` `Testcontainers` `Angular` `Docker`

[Explorar el repositorio →](https://github.com/eduballesteros/openfinance-engine) &nbsp; · &nbsp; <sub>En desarrollo</sub>

---

### [Extrude](https://github.com/eduballesteros/extrude)

[![Extrude: de planos CAD a modelos 3D](https://raw.githubusercontent.com/eduballesteros/extrude/main/docs/assets/cover.svg)](https://github.com/eduballesteros/extrude)

**Del plano al modelo navegable.** Pipeline que transforma planos **DWG/DXF** en modelos **glTF/GLB**: interpreta capas, asigna alturas y reconstruye terreno. El visor permite explorar capas, medir distancias, estudiar el sol y exportar vistas para Blender.

El reto está en interpretar la geometría CAD y producir resultados trazables que se puedan revisar, incluso al dividir modelos grandes en teselas.

`Python` `TypeScript` `Three.js` `glTF / GLB` `Blender`

[Explorar el repositorio →](https://github.com/eduballesteros/extrude)

---

### [RhythmOS](https://rhythmos.eduballesteros.es)

[![RhythmOS: planifica de noche, ejecuta de día](assets/rhythmos.svg?v=profile-refresh-5)](https://rhythmos.eduballesteros.es)

**Planifica de noche. Ejecuta de día.** Aplicación personal basada en *Los 7 hábitos*: cada noche elijo tres prioridades y sello el plan. Incluye sincronización con Google Tasks y Calendar mediante OAuth, Web Push y una PWA en producción.

`Java 21` `Spring Boot 4` `PostgreSQL` `React 19` `PWA` `Docker`

[Probar la demo →](https://rhythmos.eduballesteros.es) &nbsp; · &nbsp; [Ver código →](https://github.com/eduballesteros/rhythmos)

---

### [Free My TV · Glass](https://github.com/eduballesteros/free-my-tv)

**Mi Google TV, a mi manera.** Pantalla de inicio con una interfaz de cristal inspirada en iOS y tvOS. YouTube sin anuncios ni Shorts, inicio de sesión por código, fondo que sigue al sol y widgets de tiempo y calendario. Sin root.

`Java` `Android TV` `OAuth 2.0` `YouTube Data API` `TMDB API`

[Explorar el repositorio →](https://github.com/eduballesteros/free-my-tv) &nbsp; · &nbsp; <sub>Fork de [simbasjungles/free-my-tv](https://github.com/simbasjungles/free-my-tv), licencia MIT.</sub>

<details>
<summary><b>Más proyectos: e-commerce y aprendizaje en público</b></summary>

#### [Terra Nostra](https://github.com/eduballesteros/terra-nostra)

E-commerce full stack con microservicios, seguridad con Spring Security y OAuth2/JWT, pagos con PayPal, facturas PDF y entorno Docker Compose.

`Java 21` `Spring Boot 3` `MySQL` `Spring Security` `Docker`

#### [AWS Developer Associate](https://github.com/eduballesteros/aws-developer-associate)

Ruta práctica de preparación para AWS Certified Developer – Associate: guías en español, ejercicios y una API de tareas en Java con Lambda, API Gateway, DynamoDB y Cognito. Los despliegues y las integraciones reales se validan durante los laboratorios.

`Java 21` `AWS SDK v2` `AWS SAM` `Lambda` `DynamoDB` `JUnit`

</details>

<details>
<summary><b>Cómo uso la IA al construir software</b></summary>

En proyectos personales como Extrude, RhythmOS y Free My TV trabajo con **Claude Code**: yo decido el producto, el diseño y la arquitectura, y reviso los cambios; el agente escribe gran parte del código. Me interesa que el resultado se pueda entender, comprobar y mantener.

</details>

## Stack

| Área | Herramientas con las que trabajo |
| :--- | :--- |
| **Backend** | Java 21 · Spring Boot 3/4 · Spring Security · Python · FastAPI |
| **Integración** | APIs REST · IBM API Connect · App Connect Enterprise · OAuth2 · OpenAPI |
| **Datos** | PostgreSQL · MySQL · SQL Server · Redis · RabbitMQ |
| **IA aplicada** | Spring AI · LangChain · Azure AI · Prompt engineering · Claude Code |
| **Cloud y entrega** | AWS · Docker · Git · JUnit · Testcontainers |
| **Frontend y 3D** | TypeScript · React · Angular · Vue · Three.js |

## Trayectoria

**2026 — NTT DATA · cliente Unicaja**

Desarrollador Backend e Integración de Sistemas desde abril. Diseño y gobierno de APIs REST con IBM API Connect y ACE, microservicios con Spring Boot, pruebas de contrato y validación de endpoints.

**2025 — Odeon Multicines**

Prácticas de desarrollo web de abril a julio y Backend Junior de julio a septiembre.

### Formación y siguiente paso

- **AWS Certified Developer – Associate** — preparación en curso. [Ruta de estudio y laboratorios →](https://github.com/eduballesteros/aws-developer-associate)
- **Máster en Ingeniería y Desarrollo de Soluciones con IA Generativa** — EBIS + EUNEIZ, 2025–2026.
- **Técnico Superior en Desarrollo de Aplicaciones Web** — Centro Educativo Altair, 2023–2025.

## Actividad

<img src="assets/activity-terminal.svg?v=mac-1" width="100%" alt="Terminal de macOS que ejecuta gh stats y muestra estadísticas reales de GitHub y rachas de contribuciones. Actualización diaria."/>

---

<p align="center">
  <b>¿Hablamos de backend, APIs o de tu próximo proyecto?</b><br/><br/>
  <a href="https://www.eduballesteros.es/#contacto">Contactar desde mi web</a> &nbsp; · &nbsp;
  <a href="https://www.linkedin.com/in/eduballesteross/">LinkedIn</a> &nbsp; · &nbsp;
  <a href="https://www.eduballesteros.es/cv-eduardo-ballesteros.pdf">Currículum</a><br/><br/>
  <sub>Edu Ballesteros · Sevilla, España</sub>
</p>
