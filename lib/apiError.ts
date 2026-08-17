// Error tipado para poder distinguir "sesión expirada" (401) de otros
// fallos (portal caído, etc.) desde el cliente sin tener que parsear el
// mensaje — ver hooks/useSessionExpiredRedirect.ts.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
