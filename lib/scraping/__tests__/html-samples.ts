// Muestras de HTML committeadas junto al código, para que los tests sean
// autocontenidos y no dependan de fixtures/ (esa carpeta es solo para
// mocks locales de desarrollo y no se sube al repo). La estructura de
// estas muestras replica la de los *RepositoryImpl.kt de tec-laguna-android.

export const HORARIO_HTML = `
<!DOCTYPE html>
<html>
<head><title>Carga Académica</title></head>
<body>
  <form id="form1">
    <table id="MainContent_tblHeader">
      <tr><td>Alumno: <span id="MainContent_lblNombre">Ana García López</span></td></tr>
    </table>
    <table id="MainContent_gvHorario" cellspacing="0" border="1">
      <tr>
        <th>Grupo</th><th>Materia</th><th>Profesor</th>
        <th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th>
      </tr>
      <tr>
        <td>C16B</td><td>DESARROLLO EN ANDROID</td><td>GIL VAZQUEZ LUIS FERNANDO</td>
        <td>&nbsp;</td><td>15:00-16:00/19K</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      <tr>
        <td>C11A</td><td>BASES DE DATOS II</td><td>MARTINEZ SOTO ELENA</td>
        <td>&nbsp;</td><td>&nbsp;</td><td>10:00-11:00/12B</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      <tr>
        <td>C09C</td><td>INGENIERIA DE SOFTWARE</td><td>RAMIREZ CASTRO JORGE</td>
        <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>08:00-09:00/08A</td><td>&nbsp;</td>
      </tr>
    </table>
  </form>
</body>
</html>
`;

export const CALIFICACIONES_HTML = `
<!DOCTYPE html>
<html>
<head><title>Calificaciones Finales</title></head>
<body>
  <form id="form1">
    <table id="MainContent_tblHeader">
      <tr><td>Calificaciones del semestre</td></tr>
    </table>
    <table id="MainContent_gvCalificaciones" cellspacing="0" border="1">
      <tr>
        <th>Grupo</th><th>Materia</th><th>Profesor</th><th>Calificación</th><th>Oportunidad</th>
      </tr>
      <tr>
        <td>C11</td><td>TALLER DE ETICA</td><td>MARTINEZ SOTO ELENA</td><td>92</td><td>Ordinario</td>
      </tr>
      <tr>
        <td>C14</td><td>CALCULO DIFERENCIAL</td><td>RAMIREZ CASTRO JORGE</td><td>87</td><td>Ordinario</td>
      </tr>
      <tr>
        <td>C16B</td><td>DESARROLLO EN ANDROID</td><td>GIL VAZQUEZ LUIS FERNANDO</td><td>95</td><td>Ordinario</td>
      </tr>
    </table>
  </form>
</body>
</html>
`;

export const KARDEX_HTML = `
<!DOCTYPE html>
<html>
<head><title>Kardex</title></head>
<body>
  <form id="form1">
    <table id="MainContent_tblHeader">
      <tr>
        <td>Carrera: <span id="MainContent_lblCarrera">INGENIERIA EN SISTEMAS COMPUTACIONALES</span></td>
        <td>Promedio: <span id="MainContent_Label1">9.2</span></td>
      </tr>
    </table>
    <table id="MainContent_gvKardex" cellspacing="0" border="1">
      <tr>
        <th>Clave</th><th>Materia</th><th>Créditos</th><th>Calificación</th>
        <th>Periodo 1</th><th>Periodo 2</th><th>Periodo 3</th>
      </tr>
      <tr>
        <td>C11</td><td>TALLER DE ETICA</td><td>4</td><td>92</td>
        <td>Ago/Dic 2023</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      <tr>
        <td>C14</td><td>CALCULO DIFERENCIAL</td><td>6</td><td>87</td>
        <td>Ene/Jun 2023</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
      <tr>
        <td>C16B</td><td>DESARROLLO EN ANDROID</td><td>5</td><td>95</td>
        <td>Ago/Dic 2024</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
    </table>
  </form>
</body>
</html>
`;

export const HORARIOS_CARRERA_HTML = `
<!DOCTYPE html>
<html>
<head><title>Horarios por Carrera</title></head>
<body>
  <table id="tblHorarios" cellspacing="0" border="1">
    <tr>
      <th>Materia</th><th>Grupo</th>
      <th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th>
      <th>Profesor</th>
    </tr>
    <tr>
      <td>DESARROLLO EN ANDROID</td><td>C16B</td>
      <td>&nbsp;</td><td>15:00-16:00/19K</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      <td>GIL VAZQUEZ LUIS FERNANDO</td>
    </tr>
    <tr>
      <td>BASES DE DATOS II</td><td>C11A</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>10:00-11:00/12B</td><td>&nbsp;</td><td>&nbsp;</td>
      <td>MARTINEZ SOTO ELENA</td>
    </tr>
    <tr>
      <td>INGENIERIA DE SOFTWARE</td><td>C09C</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>08:00-09:00/08A</td><td>&nbsp;</td>
      <td>RAMIREZ CASTRO JORGE</td>
    </tr>
    <tr>
      <td>CALCULO DIFERENCIAL</td><td>C14A</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>09:00-10:00/05C</td>
      <td>RAMIREZ CASTRO JORGE</td>
    </tr>
    <tr>
      <td>TALLER DE ETICA</td><td>C11</td>
      <td>11:00-12:00/03A</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      <td>MARTINEZ SOTO ELENA</td>
    </tr>
    <tr>
      <td>REDES DE COMPUTADORAS</td><td>C18B</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>13:00-14:00/20L</td>
      <td>GIL VAZQUEZ LUIS FERNANDO</td>
    </tr>
  </table>
</body>
</html>
`;

export const LOGIN_ERROR_HTML = `
<!DOCTYPE html>
<html>
<head><title>Sistema de Control Escolar</title></head>
<body>
  <form id="form1" action="login.aspx" method="post">
    <div>
      <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="..." />
      <input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="..." />
    </div>
    <table>
      <tr>
        <td>Número de control:</td>
        <td><input name="tbLogin" type="text" id="tbLogin" /></td>
      </tr>
      <tr>
        <td>Contraseña:</td>
        <td><input name="tbPassword" type="password" id="tbPassword" /></td>
      </tr>
      <tr>
        <td colspan="2">
          <span id="MainContent_lblError" style="color:Red;">Usuario o contraseña incorrectos</span>
        </td>
      </tr>
    </table>
    <input type="submit" name="Button2" value="Ingresar" id="Button2" />
  </form>
</body>
</html>
`;
