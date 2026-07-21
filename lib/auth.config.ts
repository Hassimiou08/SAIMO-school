/**
 * Configuration Auth0 pour SAIMO
 * 
 * Cette configuration doit être adaptée à votre tenant Auth0
 * Voir docs/AUTH_BIOMETRIC_SETUP.md pour les instructions
 */

export const auth0Config = {
  // URLs
  baseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,

  // Scopes demandés
  authorizationParams: {
    scope: 'openid profile email',
    response_type: 'code',
  },

  // Configuration de la session
  session: {
    duration: 86400 * 7, // 7 jours en secondes
    storeIDToken: true,
    storeAccessToken: true,
    storeRefreshToken: true,
  },

  // Routes Auth0
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: '/',
  },
};

/**
 * Configuration WebAuthn (Biométrie)
 */
export const webauthnConfig = {
  // Nom de l'application
  rp: {
    name: 'SAIMO - Gestion Scolaire',
    id: process.env.AUTH0_BASE_URL?.split('//')[1]?.split(':')[0] || 'localhost',
  },

  // Préférences d'authentificateur
  authenticatorSelection: {
    authenticatorAttachment: 'platform', // Empreinte/Facial (pas de clés USB)
    residentKey: 'preferred',
    userVerification: 'preferred', // Biométrie si disponible
  },

  // Timeouts
  timeout: 60000, // 1 minute

  // Attestation
  attestation: 'direct',
};

/**
 * Flux d'authentification supportés
 */
export const authFlows = {
  admin: {
    name: 'Administrateur',
    methods: ['credentials', 'biometric'],
    mfa: true,
    requiresApproval: false,
  },
  teacher: {
    name: 'Enseignant',
    methods: ['credentials', 'biometric'],
    mfa: false,
    requiresApproval: true,
  },
  student: {
    name: 'Élève',
    methods: ['credentials'],
    mfa: false,
    requiresApproval: true,
  },
  parent: {
    name: 'Parent/Tuteur',
    methods: ['credentials'],
    mfa: false,
    requiresApproval: true,
  },
};

/**
 * Vérifier si la configuration Auth0 est complète
 */
export const isAuth0Configured = () => {
  return !!(
    process.env.AUTH0_ISSUER_BASE_URL &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET &&
    process.env.AUTH0_SECRET
  );
};

/**
 * Vérifier la disponibilité de WebAuthn dans le navigateur
 */
export const isWebauthnAvailable = () => {
  if (typeof window === 'undefined') return false;
  return !!(
    window.PublicKeyCredential &&
    navigator.credentials?.create &&
    navigator.credentials?.get
  );
};

/**
 * Types utilisateur SAIMO
 */
export enum UserType {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

/**
 * Rôles utilisateur
 */
export const userRoles = {
  [UserType.ADMIN]: {
    permissions: ['read:all', 'write:all', 'delete:all', 'manage:users'],
    redirectUrl: '/portail',
  },
  [UserType.TEACHER]: {
    permissions: ['read:students', 'write:grades', 'read:classes'],
    redirectUrl: '/portail',
  },
  [UserType.STUDENT]: {
    permissions: ['read:own', 'read:grades', 'read:schedule'],
    redirectUrl: '/portail/eleves',
  },
  [UserType.PARENT]: {
    permissions: ['read:children', 'read:grades', 'read:schedule'],
    redirectUrl: '/portail',
  },
};

export default {
  auth0Config,
  webauthnConfig,
  authFlows,
  isAuth0Configured,
  isWebauthnAvailable,
  UserType,
  userRoles,
};
