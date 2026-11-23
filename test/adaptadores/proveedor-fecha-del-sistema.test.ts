import { ProveedorFechaDelSistema } from "../../app/adaptadores/proveedor-fecha-del-sistema";

describe("ProveedorFechaDelSistema", () => {
  describe("ahora", () => {
    test("deberia devolver la fecha actual del sistema", () => {
      const proveedor = new ProveedorFechaDelSistema();
      const antes = Date.now();

      const ahora = proveedor.ahora().getTime();

      expect(ahora).toBeGreaterThanOrEqual(antes);
      expect(ahora).toBeLessThanOrEqual(Date.now());
    });
  });
});
