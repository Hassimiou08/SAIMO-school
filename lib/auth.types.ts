/**
 * Types TypeScript pour l'authentification SAIMO
 */

export type AuthMethod = 'credentials' | 'biometric';
export type BiometricType = 'fingerprint' | 'voice' | 'face';
export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  establishment?: string;
  verified: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserType {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export interface AdminUser extends User {
  establishment: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  mfaEnabled: boolean;
}

export interface VisitorUser extends User {
  verified: false;
  verificationToken: string;
  verificationExpires: Date;
}

export interface BiometricCredential {
  id: string;
  type: BiometricType;
  publicKey: string;
  counter: number;
  createdAt: Date;
  lastUsed?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  redirectUrl?: string;
  error?: string;
}

export interface BiometricRegistrationOptions {
  challenge: Uint8Array;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: Uint8Array;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    alg: number;
    type: string;
  }>;
  authenticatorSelection: {
    authenticatorAttachment: 'platform' | 'cross-platform';
    residentKey: 'discouraged' | 'preferred' | 'required';
    userVerification: 'preferred' | 'required' | 'discouraged';
  };
  timeout: number;
  attestation: 'direct' | 'indirect' | 'none' | 'enterprise';
}

export interface BiometricAuthenticationOptions {
  challenge: Uint8Array;
  timeout: number;
  rpId: string;
  userVerification: 'preferred' | 'required' | 'discouraged';
  allowCredentials: Array<{
    id: Uint8Array;
    type: string;
    transports: string[];
  }>;
}

export interface LoginFormData {
  establishment: string;
  email: string;
  password: string;
}

export interface VisitorFormData {
  name: string;
  email: string;
  type: UserType;
}

export interface VoiceAuthOptions {
  phrase: string; // "Authentifier" ou similaire
  language: string;
  timeout: number;
}

export interface VoiceAuthResult {
  recognized: boolean;
  confidence: number;
  transcript: string;
}
