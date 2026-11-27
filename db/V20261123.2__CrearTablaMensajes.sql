CREATE TABLE mensajes (
  id_whatsapp TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizaciones (id),
  usuario_id TEXT NOT NULL REFERENCES usuarios (id),
  telefono_contacto TEXT NOT NULL,
  nombre_contacto TEXT,
  texto TEXT NOT NULL,
  enviado_en TIMESTAMPTZ NOT NULL,
  direccion TEXT NOT NULL CHECK (direccion IN ('entrante', 'saliente')),
  recibido_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX mensajes_por_conversacion ON mensajes (org_id, usuario_id, telefono_contacto, enviado_en);
