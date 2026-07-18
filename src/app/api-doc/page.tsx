"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <SwaggerUI url="/api/swagger" />
      </div>
    </div>
  );
}
