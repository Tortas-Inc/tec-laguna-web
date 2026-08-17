import { describe, expect, it } from "vitest";
import { getSemestre, sortSemesters } from "../schedule";

describe("getSemestre", () => {
  it("usa el último dígito de la clave como semestre (verificado en ISC y Eléctrica)", () => {
    expect(getSemestre({ grupo: "A11A", materia: "CALCULO DIFERENCIAL" })).toBe("1");
    expect(getSemestre({ grupo: "A12A", materia: "CALCULO INTEGRAL" })).toBe("2");
    expect(getSemestre({ grupo: "A31A", materia: "CALCULO DIFERENCIAL" })).toBe("1");
    expect(getSemestre({ grupo: "A34B", materia: "ECUACIONES DIFERENCIALES" })).toBe("4");
  });

  it("clasifica Residencia aparte (clave termina en 9)", () => {
    expect(getSemestre({ grupo: "A39A", materia: "RESIDENCIA PROFESIONAL" })).toBe(
      "Residencia",
    );
    expect(getSemestre({ grupo: "R19A", materia: "RESIDENCIA" })).toBe("Residencia");
  });

  it("clasifica Tutoría aparte aunque su clave calce con el patrón", () => {
    expect(getSemestre({ grupo: "T11D", materia: "TUTORIA" })).toBe("Tutoría");
    expect(getSemestre({ grupo: "T31A", materia: "TUTORIA" })).toBe("Tutoría");
  });

  it("clasifica Electivas aparte (clave numérica o con sufijo D)", () => {
    expect(
      getSemestre({ grupo: "51DA", materia: "ANALISIS DE DATOS Y MACHINE LEARNING" }),
    ).toBe("Electivas");
    expect(
      getSemestre({ grupo: "131A", materia: "ANALISIS Y DIMENSIONAMIENTO" }),
    ).toBe("Electivas");
  });
});

describe("sortSemesters", () => {
  it("ordena numéricamente y deja Electivas, Residencia y Tutoría al final, en ese orden", () => {
    expect(
      sortSemesters(["Tutoría", "3", "Residencia", "1", "8", "Electivas", "2"]),
    ).toEqual(["1", "2", "3", "8", "Electivas", "Residencia", "Tutoría"]);
  });
});
