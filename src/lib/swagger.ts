import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SAIMO Ecole API",
        version: "2.0.0",
        description: "API REST du système intégré de gestion scolaire SAIMO Ecole. Fournit les accès aux modules de Scolarité, Finance, Présences et Évaluation.",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Ajoutez le token JWT dans l'en-tête Authorization. Exemple: Bearer <token>"
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  });
  return spec;
};
