import { urlencoded } from "express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Car Mart",
    description:
      "This is a simple API for Car Mart a car showroom management soluion having multiple entitites like _Car Inventory and Customer_. All the CRUD operations can be performed on these and for security using JWT authentication.",
    contact: {
      email: "muhammad.shahid@cache-cloud.com",
    },
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "car inventory",
      description: "Operations related to car inventory",
    },
    {
      name: "customers",
      description: "Operations related to customers",
    },
    {
      name: "authentication",
      description: "Operations related to authentication",
    },
  ],
  components: {
    schemas: {
      CarInventory: {
        type: "object",
        required: [
          "engineNo",
          "chasisNo",
          "make",
          "modelName",
          "variant",
          "price",
          "registeredIn",
          "modelYear",
          "mileage",
          "fuelType",
          "transmissionType",
          "taxHistory",
          "assembly",
          "document",
          "image",
        ],
        properties: {
          engineNo: {
            type: "string",
            minLength: 2,
            maxLength: 20,
            example: "EN09187",
            description: "Engine number of Car",
          },
          chasisNo: {
            type: "string",
            minLength: 2,
            maxLength: 20,
            example: "CN09187",
            description: "Chasis number of Car",
          },
          make: {
            type: "string",
            minLength: 2,
            maxLength: 20,
            example: "Porsche",
            description: "The make or brand of the Car",
          },
          modelName: {
            type: "string",
            minLength: 2,
            maxLength: 20,
            example: "911",
            description: "The model name of the Car",
          },
          variant: {
            type: "string",
            example: "GT3 RS",
            description: "The variant of the Car",
          },
          price: {
            type: "integer",
            minimum: 50000,
            maximum: 100000000,
            example: 100000000,
            description: "The price of the Car in PKR",
          },
          registeredIn: {
            type: "string",
            default: "Punjab",
            description: "The region where car is registered",
            enum: [
              "Un-Registered",
              "Balochistan",
              "Islamabad",
              "KPK",
              "Punjab",
              "Sindh",
            ],
          },
          registrationNo: {
            type: "string",
            example: "VXR 1008",
            description:
              "Registration number of the car. It is required only if car is registered",
          },
          modelYear: {
            type: "integer",
            example: 2024,
            minimum: 1923,
            maximum: 2024,
            description: "Year of manufacturing of car",
          },
          mileage: {
            type: "integer",
            example: 1009,
            minimum: 100,
            maximum: 1000000,
            description: "The distance or mileage the car travelled in KM",
          },
          fuelType: {
            type: "string",
            default: "Petrol",
            description: "The fuel type of car",
            enum: ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"],
          },
          transmissionType: {
            type: "string",
            description: "The type of transmssion of vehicle",
            example: "Automatic",
            enum: ["Automatic", "Manual"],
          },
          taxHistory: {
            type: "string",
            description: "Tax history of car",
            default: "Token/Tax Paid",
            enum: ["Token/Tax Paid", "Token Remaining", "Lifetime Token Paid"],
          },
          assembly: {
            type: "string",
            default: "Local",
            description: "Engine assembly of car",
            enum: ["Local", "Imported"],
          },
          document: {
            type: "array",
            description: "Document status of car",
            items: {
              type: "string",
              example: ["Original Book", "Fresh Import"],
              enum: [
                "Original Book",
                "Auction Sheet Available",
                "Duplicate Book",
                "Duplicate Number Plate",
                "Fresh Import",
                "Complete Original File",
                "Duplicate File",
              ],
            },
          },
          image: {
            type: "string",
            format: "binary",
            description: "Image of car",
          },
          isSold: {
            type: "boolean",
            default: false,
            description: "Availavlity status of car",
          },
        },
      },
      Customer: {
        required: ["name", "cnic", "address", "contact"],
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Saad",
          },
          cnic: {
            type: "integer",
            example: 3660347880473,
            minimum: 13,
            maximum: 13,
          },
          address: {
            type: "string",
            example: "Shamsabad, Rawalpindi",
          },
          contact: {
            type: "string",
            example: 3357735290,
            minLength: 11,
            maxLength: 11,
          },
          purchaseHistory: {
            type: "array",
            description: "Customer purchase history",
            items: {
              $ref: "#/components/schemas/PurchaseHistory",
            },
          },
        },
      },
      PurchaseHistory: {
        required: ["chasisNo"],
        type: "object",
        properties: {
          chasisNo: {
            type: "string",
            example: "CN09187",
            minLength: 2,
            maxLength: 20,
          },
          purchaseDate: {
            type: "string",
            format: "date-time",
          },
        },
      },
    },
    encoding: {
      image: {
        contentType: "image/png, image/jpg, image,jpeg",
      },
    },
    responses: {
      SuccessResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
          },
          page: {
            type: "integer",
          },
          limit: {
            type: "integer",
          },
          totalPages: {
            type: "integer",
          },
          totalItems: {
            type: "integer",
          },
          data: {
            type: "object",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
          },
          errors: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      InvalidId: {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                message: "Invalid object ID",
              },
            },
          },
        },
      },
      NotFound: {
        description: "Not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                message: "Entity not found",
              },
            },
          },
        },
      },
      UnAuthorized: {
        description: "Unauthorized.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                message: "Invalid credentials. Login failed.",
              },
            },
          },
        },
      },
      Conflict: {
        description: "Conflict.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                message: "Entity already exists",
              },
            },
          },
        },
      },
      InvalidInput: {
        description: "Validation Error.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/responses/ErrorResponse",
            },
            example: {
              message: "Validation Error",
              errors: ["Invalid input data", "Another error message"],
            },
          },
        },
      },
      InternalServer: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                message: "Some error occured while proccessing data",
              },
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
