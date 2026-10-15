<p align="center">
  <img src="assets/banner.svg" alt="Edu Ballesteros - Backend Java, Spring Boot, IA Generativa" width="100%"/>
</p>

<p align="center">
  <a href="https://www.eduballesteros.es"><img src="https://img.shields.io/badge/Portfolio-eduballesteros.es-22d3ee?style=for-the-badge&logo=googlechrome&logoColor=0b0f19&labelColor=0b0f19" alt="Portfolio"/></a>
  <a href="https://www.linkedin.com/in/eduballesteross/"><img src="https://img.shields.io/badge/LinkedIn-eduballesteross-818cf8?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0b0f19" alt="LinkedIn"/></a>
  <a href="https://www.eduballesteros.es/cv-eduardo-ballesteros.pdf"><img src="https://img.shields.io/badge/Descargar-CV-e879f9?style=for-the-badge&logo=adobeacrobatreader&logoColor=white&labelColor=0b0f19" alt="CV"/></a>
</p>

```json
{
  "nombre": "Eduardo Ballesteros Pérez",
  "rol": "Desarrollador Backend Java",
  "ubicacion": "Sevilla, España",
  "ahora": "APIs e integración bancaria en NTT DATA (cliente: Unicaja)",
  "construyendo": ["BarberMind · agente de IA + arquitectura hexagonal", "AWS DVA-C02 · Cloud Native"],
  "principios": ["SOLID", "Clean Architecture", "Hexagonal", "Clean Code"],
}
```

---

## ⚡ Sobre mí

Backend developer centrado en **Java y Spring Boot**. Resuelvo problemas complejos con **arquitectura hexagonal y patrones de integración**, en un entorno bancario donde la resiliencia no es opcional. Lo combino con **IA generativa** (máster EBIS + EUNEIZ) y **cloud**, rumbo a **AWS Certified Developer – Associate**.

## 🛤️ Trayectoria

```mermaid
timeline
    title De DAW a integración bancaria
    2023 : Inicio DAW · Centro Educativo Altair
    2025 : Prácticas y Backend Junior · Odeon Multicines : Máster en IA Generativa · EBIS + EUNEIZ : Fin de DAW
    2026 : Backend e Integración · NTT DATA (Unicaja) : AWS DVA-C02 en curso
```

<details>
<summary><b>💼 Detalle de experiencia</b></summary>

<br/>

| Periodo | Puesto | Empresa |
|---|---|---|
| Abr 2026 – Actualidad | Desarrollador Backend e Integración de Sistemas | **NTT DATA** (cliente: Unicaja) |
| Jul 2025 – Sep 2025 | Desarrollador Backend Junior | Odeon Multicines |
| Abr 2025 – Jul 2025 | Desarrollador Web (prácticas) | Odeon Multicines |

**Hoy:** diseño y gobierno de APIs REST con **IBM API Connect** y **App Connect Enterprise (ACE)**, microservicios con **Spring Boot**, pruebas de contrato y validación de endpoints con Postman.

</details>

---

## 🧰 Stack

| Capa | Tecnologías |
|---|---|
| ☕ **Backend** | ![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) |
| 🧠 **IA** | ![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white) ![Azure](https://img.shields.io/badge/Azure_AI-0078D4?style=flat-square&logo=microsoftazure&logoColor=white) Prompt Engineering |
| 🗄️ **Datos y mensajería** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) ![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white) |
| 🚀 **DevOps y cloud** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) |
| 🎨 **Frontend** | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white) ![Vue](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |

---

## 🔥 Proyectos

### 💈 [Barber Mind](https://github.com/eduballesteros/barbermind) · *en desarrollo*

Gestión de citas B2B potenciada por IA y mensajería asíncrona. El reto: alta concurrencia sin *double-booking* gracias a bloqueos distribuidos en Redis, y un agente con LangChain que realiza transacciones en base de datos en tiempo real.

```mermaid
flowchart LR
    MCP["Servidor MCP<br/>(Model Context Protocol)"] --> API["Spring Boot<br/>puerto de entrada"]
    subgraph HEX["Hexágono"]
        API --> UC["Casos de uso"]
        UC --> DOM["Dominio<br/>Citas · Barberos"]
    end
    UC --> DB[("PostgreSQL")]
    MCP -.->|"tools / resources"| AI["Agente IA"]
```

`Java` `Spring Boot` `PostgreSQL` `Redis` `RabbitMQ` `Docker` `Angular`

### 🌿 [Terra Nostra](https://github.com/eduballesteros/terra-nostra)

E-commerce full stack con microservicios y arquitectura limpia en capas. Seguridad con **Spring Security (OAuth2 + JWT)**, pagos reales con **PayPal SDK**, facturas PDF automatizadas y todo orquestado con Docker Compose.

`Java 21` `Spring Boot 3` `MySQL` `Docker` `Spring Security`

<p align="center">
  <a href="https://github.com/eduballesteros/barbermind"><img src="https://github-readme-stats.vercel.app/api/pin/?username=eduballesteros&repo=barbermind&theme=tokyonight&hide_border=true" alt="BarberMind"/></a>
  <a href="https://github.com/eduballesteros/terra-nostra"><img src="https://github-readme-stats.vercel.app/api/pin/?username=eduballesteros&repo=terra-nostra&theme=tokyonight&hide_border=true" alt="Terra Nostra"/></a>
</p>

---

## 🎓 Formación

- 🟠 **AWS Certified Developer – Associate (DVA-C02)** · en curso (2026) · S3, EC2, Lambda, IAM
- 🤖 **Máster en Ingeniería y Desarrollo de Soluciones con IA Generativa** · EBIS + EUNEIZ (2025 – 2026)
- 🎒 **Técnico Superior en Desarrollo de Aplicaciones Web** · Centro Educativo Altair (2023 – 2025)

## 📈 Actividad

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=eduballesteros&show_icons=true&count_private=true&theme=tokyonight&hide_border=true&border_radius=10" alt="Estadísticas de GitHub"/>
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=eduballesteros&layout=compact&theme=tokyonight&hide_border=true&border_radius=10" alt="Lenguajes principales"/>
</p>

## 📫 Contacto

¿Un proyecto, una colaboración o charlar de tecnología? Escríbeme desde [eduballesteros.es](https://www.eduballesteros.es/#contacto) o por [LinkedIn](https://www.linkedin.com/in/eduballesteross/). Respondo en menos de 48 h.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,12&height=110&section=footer" width="100%" alt=""/>
