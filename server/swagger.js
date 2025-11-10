import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ClariPix API Docs",
            version: "1.0.0",
            description: "API documentation for ClariPix backend (Node.js + AWS + GCP)",
        },
        servers: [
            {
                url: "http://localhost:3618",
                description: "Local Dev Server",
            },
        ],
        components: {
            schemas: {
                Image: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9"
                        },
                        uploader_id: {
                            type: "string",
                            format: "uuid",
                            example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
                        },
                        image_url: {
                            type: "string",
                            example: "https://example.com/image.jpg"
                        },
                        description: {
                            type: "string",
                            example: "A beautiful landscape"
                        },
                        safe_score: {
                            type: "number",
                            format: "float",
                            example: 0.95
                        },
                        adult_level: {
                            type: "string",
                            enum: ["UNKNOWN", "VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "LIKELY", "VERY_LIKELY"],
                            example: "VERY_UNLIKELY"
                        },
                        violence_level: {
                            type: "string",
                            enum: ["UNKNOWN", "VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "LIKELY", "VERY_LIKELY"],
                            example: "UNLIKELY"
                        },
                        racy_level: {
                            type: "string",
                            enum: ["UNKNOWN", "VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "LIKELY", "VERY_LIKELY"],
                            example: "UNLIKELY"
                        },
                        categories: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            example: ["landscape", "nature"]
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2023-01-01T00:00:00.000Z"
                        },
                        total_views: {
                            type: "integer",
                            example: 150
                        },
                        total_likes: {
                            type: "integer",
                            example: 25
                        },
                        safe_search_status: {
                            type: "string",
                            enum: ["pending", "processed", "error"],
                            example: "processed"
                        },
                        categorization_status: {
                            type: "string",
                            enum: ["pending", "processed", "error"],
                            example: "processed"
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

export default function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📘 Swagger UI running at: http://localhost:3618/api-docs");
}
