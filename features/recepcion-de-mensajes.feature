# language: es
Característica: Recepción de mensajes por webhook
  Como usuario con mi número de WhatsApp Business conectado
  Quiero que el sistema guarde cada mensaje que me escriben
  Para que Claude pueda consultarlos aunque yo no haya abierto el chat

  Antecedentes:
    Dado que el número "100200300" está conectado para el usuario "rodrigo" de la organización "estudio"

  Escenario: RME1 - Meta verifica el webhook con el token configurado
    Cuando Meta verifica el webhook con el token correcto y el desafío "1158201444"
    Entonces el webhook responde el desafío "1158201444"

  Escenario: RME2 - Se guarda un mensaje de texto entrante
    Cuando Meta notifica al número "100200300" un mensaje "wamid.1" de "Juan Pérez" (5493884111111) que dice "Hola, ¿tenés el presupuesto?"
    Entonces el usuario "rodrigo" tiene 1 mensaje entrante de 5493884111111 que dice "Hola, ¿tenés el presupuesto?"

  Escenario: RME3 - Un mensaje que Meta reenvía se guarda una sola vez
    Cuando Meta notifica al número "100200300" un mensaje "wamid.1" de "Juan Pérez" (5493884111111) que dice "Hola"
    Y Meta notifica al número "100200300" un mensaje "wamid.1" de "Juan Pérez" (5493884111111) que dice "Hola"
    Entonces el usuario "rodrigo" tiene 1 mensaje entrante de 5493884111111 que dice "Hola"

  Escenario: RME4 - Se descarta una notificación sin firma válida
    Cuando llega al webhook una notificación con firma inválida de un mensaje "wamid.2" para el número "100200300"
    Entonces el webhook la rechaza por no estar autorizada
    Y el usuario "rodrigo" no tiene mensajes

  Escenario: RME5 - Se descarta un mensaje para un número que no está conectado
    Cuando Meta notifica al número "999999999" un mensaje "wamid.3" de "Juan Pérez" (5493884111111) que dice "Hola"
    Entonces no se guarda ningún mensaje
