import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Multi Vendor Application",
            version: "1.0.0",
            description: "API documentation for Multi-Vendor Application.",
        },
        servers: [
            {
                url: "http://localhost:3500",
                description: "Local Development Server"
            },
            {
                url: "https://multi-vendor-backend-qvdg.onrender.com",
                description: "Production Server"
            }
        ],
    },
    apis: ["./src/docs/*.yaml"],
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
