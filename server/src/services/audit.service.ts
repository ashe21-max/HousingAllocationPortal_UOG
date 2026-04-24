// Audit service temporarily disabled - admin schema was removed
export class AuditService {
  static async log(data: any) {
    console.log('Audit log:', data);
  }

  static async logFailedLogin(email: string, ipAddress?: string, userAgent?: string) {
    console.log('Failed login attempt:', { email, ipAddress, userAgent });
  }

  static async logSuccessfulLogin(userId: string, ipAddress?: string, userAgent?: string) {
    console.log('Successful login:', { userId, ipAddress, userAgent });
  }
}
