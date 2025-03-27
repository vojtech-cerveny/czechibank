"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const darkModeStyles = `
  /* Dark mode styles */
  .swagger-ui {
    color: #e4e4e7;
    background: #18181b;
  }
  .swagger-ui .info .title,
  .swagger-ui .info h1, 
  .swagger-ui .info h2, 
  .swagger-ui .info h3, 
  .swagger-ui .info h4, 
  .swagger-ui .info h5,
  .swagger-ui .opblock-tag,
  .swagger-ui table thead tr td, 
  .swagger-ui table thead tr th,
  .swagger-ui .parameter__name,
  .swagger-ui .tab li,
  .swagger-ui .opblock .opblock-section-header h4,
  .swagger-ui .opblock .opblock-section-header > label,
  .swagger-ui .scheme-container .schemes > label,
  .swagger-ui .response-col_status {
    color: #e4e4e7 !important;
  }
  .swagger-ui .opblock .opblock-section-header {
    background: #27272a;
  }
  .swagger-ui .opblock .opblock-section-header {
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  .swagger-ui .opblock {
    margin: 0 0 15px;
    border: 1px solid #27272a;
    border-radius: 4px;
    box-shadow: 0 0 3px rgba(0,0,0,.19);
  }
  .swagger-ui .opblock .opblock-summary-description {
    color: #a1a1aa;
  }
  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .opblock-external-docs-wrapper p,
  .swagger-ui .opblock-title_normal p {
    color: #a1a1aa;
  }
  .swagger-ui .opblock .opblock-summary {
    border-bottom: 1px solid #27272a;
  }
  .swagger-ui section.models {
    border: 1px solid #27272a;
  }
  .swagger-ui section.models.is-open h4 {
    border-bottom: 1px solid #27272a;
  }
  .swagger-ui .model-box {
    background: #27272a;
  }
  .swagger-ui section.models .model-container {
    background: #18181b;
  }
  .swagger-ui .parameter__in {
    color: #a1a1aa;
  }
  .swagger-ui input[type=email],
  .swagger-ui input[type=password],
  .swagger-ui input[type=search],
  .swagger-ui input[type=text] {
    background: #27272a;
    color: #e4e4e7;
  }
  .swagger-ui textarea {
    background: #27272a;
    color: #e4e4e7;
  }
  .swagger-ui .topbar {
    display: none;
  }
  .swagger-ui .scheme-container {
    background: #27272a;
  }
  .swagger-ui .btn {
    color: #e4e4e7;
    background: #3f3f46;
  }
`;

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="border-b border-zinc-700 bg-zinc-800">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold text-zinc-100">Czechibank API Documentation</h1>
          <p className="mt-2 text-zinc-400">Interactive API documentation for the Czechibank learning application.</p>
        </div>
      </div>
      <style>{darkModeStyles}</style>
      <div className="p-4">
        <SwaggerUI
          url="/api/v1/docs"
          docExpansion="list"
          defaultModelExpandDepth={3}
          persistAuthorization={true}
          defaultModelsExpandDepth={3}
          filter={true}
          withCredentials={true}
        />
      </div>
    </div>
  );
}
