declare module "swagger-ui-react" {
  import type { ComponentType } from "react";
  const SwaggerUI: ComponentType<{
    spec?: object | string;
    url?: string;
    [key: string]: unknown;
  }>;
  export default SwaggerUI;
}
