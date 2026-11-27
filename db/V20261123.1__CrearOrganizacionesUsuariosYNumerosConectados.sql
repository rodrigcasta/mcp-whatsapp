CREATE TABLE organizaciones (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE usuarios (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizaciones (id),
  nombre TEXT NOT NULL
);

-- Cada número de WhatsApp Business conectado pertenece a un usuario. id_telefono es el phone_number_id de Meta.
CREATE TABLE numeros_conectados (
  id_telefono TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizaciones (id),
  usuario_id TEXT NOT NULL REFERENCES usuarios (id)
);
