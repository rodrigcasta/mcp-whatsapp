# language: es
Característica: Salud del servicio de ingesta
  Como responsable de operar el sistema
  Quiero consultar si el servicio de ingesta está activo
  Para saber que puede recibir los mensajes de WhatsApp

  Escenario: SAL1 - El servicio de ingesta responde que está activo
    Dado que el servicio de ingesta está levantado
    Cuando consulto su estado
    Entonces responde que está activo
