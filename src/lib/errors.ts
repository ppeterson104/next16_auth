import { CredentialsSignin } from 'next-auth';

export class CustomError extends CredentialsSignin {
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'CustomAuthError';
    this.message = message;
  }
}
