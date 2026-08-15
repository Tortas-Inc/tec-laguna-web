import { describe, expect, it } from "vitest";
import { parseCalificaciones } from "../calificaciones";
import { parseHorariosCarrera } from "../horarios-carrera";
import { getCarreraCode, parseKardex } from "../kardex";
import { isLoginError } from "../login";
import { parseHorario } from "../horario";
import {
  CALIFICACIONES_HTML,
  HORARIO_HTML,
  HORARIOS_CARRERA_HTML,
  KARDEX_HTML,
  LOGIN_ERROR_HTML,
} from "./html-samples";

describe("parseHorario", () => {
  it("extrae el nombre del alumno y las materias en orden de columnas", () => {
    const result = parseHorario(HORARIO_HTML);

    expect(result.studentName).toBe("Ana García López");
    expect(result.materias).toHaveLength(3);
    expect(result.materias[0]).toEqual({
      grupo: "C16B",
      materia: "DESARROLLO EN ANDROID",
      profesor: "GIL VAZQUEZ LUIS FERNANDO",
      lunes: "",
      martes: "15:00-16:00/19K",
      miercoles: "",
      jueves: "",
      viernes: "",
    });
  });
});

describe("parseCalificaciones", () => {
  it("extrae las materias y calcula el promedio en escala 0-10", () => {
    const result = parseCalificaciones(CALIFICACIONES_HTML);

    expect(result.materias).toHaveLength(3);
    expect(result.materias[0]).toEqual({
      grupo: "C11",
      materia: "TALLER DE ETICA",
      profesor: "MARTINEZ SOTO ELENA",
      calificacion: "92",
      oportunidad: "Ordinario",
    });
    // promedio(92, 87, 95) = 91.33... -> redondeado a 91 -> /10 = 9.1
    expect(result.promedio).toBe(9.1);
  });
});

describe("parseKardex", () => {
  it("extrae carrera, carreraCode, promedio, créditos totales y materias", () => {
    const result = parseKardex(KARDEX_HTML);

    expect(result.carrera).toBe("Ingenieria en Sistemas Computacionales");
    expect(result.carreraCode).toBe("1");
    expect(result.promedio).toBe("9.2");
    expect(result.creditosTotales).toBe(15);
    expect(result.materias).toHaveLength(3);
    expect(result.materias[0]).toEqual({
      clave: "C11",
      materia: "TALLER DE ETICA",
      creditos: 4,
      calificacion: "92",
      periodo1: "Ago/Dic 2023",
      periodo2: "",
      periodo3: "",
    });
  });
});

describe("getCarreraCode", () => {
  it("mapea la 10a carrera a 'Z' en vez de '10'", () => {
    expect(getCarreraCode("INGENIERIA EN GESTION EMPRESARIAL")).toBe("Z");
  });

  it("devuelve string vacío si la carrera no está en el listado", () => {
    expect(getCarreraCode("CARRERA INEXISTENTE")).toBe("");
  });
});

describe("parseHorariosCarrera", () => {
  it("usa la primera tabla, ignora el encabezado y marca isFinished", () => {
    const materias = parseHorariosCarrera(HORARIOS_CARRERA_HTML, [
      "C11A",
      "C11",
    ]);

    expect(materias).toHaveLength(6);
    expect(materias[0]).toEqual({
      materia: "DESARROLLO EN ANDROID",
      grupo: "C16B",
      lunes: "",
      martes: "15:00-16:00/19K",
      miercoles: "",
      jueves: "",
      viernes: "",
      profesor: "GIL VAZQUEZ LUIS FERNANDO",
      isFinished: false,
    });
    expect(materias[1].isFinished).toBe(true); // C11A
  });

  it("sin clavesCursadas, ninguna materia queda marcada como cursada", () => {
    const materias = parseHorariosCarrera(HORARIOS_CARRERA_HTML);
    expect(materias.every((m) => m.isFinished === false)).toBe(true);
  });
});

describe("isLoginError", () => {
  it("detecta el label de error en credenciales incorrectas", () => {
    expect(isLoginError(LOGIN_ERROR_HTML)).toBe(true);
  });

  it("no detecta error en un HTML sin ese label", () => {
    expect(isLoginError("<html><body>ok</body></html>")).toBe(false);
  });
});
