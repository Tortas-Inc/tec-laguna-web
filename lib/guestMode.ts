// Se marca al hacer clic en "Continuar como invitado" (app/(auth)/login)
// y se limpia al iniciar sesión de verdad o cerrar sesión — mientras esté
// activa, /horarios no debe consultar Kardex en absoluto (un invitado, por
// definición, no tiene sesión con la que Kardex pueda responder nada).
export const GUEST_MODE_KEY = "teclaguna:modo-invitado";

// Carrera elegida a mano por un invitado en /horarios (no hay Kardex del
// que leerla). Se limpia también al cerrar sesión — si no, un login/logout
// posterior en el mismo navegador dejaría esta carrera vieja guardada y el
// próximo "Continuar como invitado" saltaría directo a ella en vez de
// mostrar el selector de carreras.
export const MANUAL_CARRERA_KEY = "teclaguna:carrera-invitado";
