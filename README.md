# Pokémon Bank - Cajero Web

## Descripción del proyecto

Pokémon Bank es una aplicación web que simula el funcionamiento básico de un cajero automático. El proyecto permite al usuario iniciar sesión mediante un PIN, consultar su saldo disponible, realizar depósitos, retiros y pagos de servicios, además de visualizar el historial de transacciones realizadas.

Esta segunda fase del proyecto incorpora funcionalidad mediante JavaScript del lado del cliente, almacenamiento local con LocalStorage, validaciones de entrada, generación de comprobantes en PDF y representación gráfica de las transacciones.

## Datos del usuario de prueba

Nombre: Ash Ketchum  
PIN: 1234  
Número de cuenta: 0987654321  
Saldo inicial: $500.00

## Funcionalidades principales

- Inicio de sesión mediante PIN de 4 dígitos.
- Consulta de saldo disponible.
- Depósito de dinero.
- Retiro de dinero.
- Pago de servicios básicos:
  - Energía eléctrica
  - Internet
  - Telefonía
  - Agua potable
- Registro de historial de transacciones.
- Generación de comprobante PDF de la última transacción.
- Generación de historial de transacciones en PDF.
- Gráfico de cantidad de transacciones por tipo.
- Reinicio de datos almacenados.
- Persistencia de información mediante LocalStorage.
- Validación de datos ingresados por el usuario.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 4
- SweetAlert2
- jsPDF
- Chart.js
- ValidateJS
- LocalStorage
- Git
- GitHub

## Estructura del proyecto

```text
pokemon_bank_fase2/
│
├── index.html
├── style.css
├── app.js
└── README.md
