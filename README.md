# Cryptography Service (NestJS)

A robust NestJS application providing hybrid encryption and decryption services using **AES-256-CBC** for payload encryption and **RSA** for key exchange. This service ensures secure data transmission by combining the speed of symmetric encryption with the security of asymmetric encryption.

## 🚀 Features

- **Encryption**: Encrypts payloads using a randomly generated AES key, then encrypts the AES key using an RSA Public Key.
- **Decryption**: Decrypts the AES key using an RSA Private Key, then decrypts the payload using the recovered AES key.
- **Swagger API Documentation**: Interactive API documentation available at `/api-docs`.
- **Custom Error Handling**: Standardized JSON error responses with specific error codes (e.g., `4001`, `5001`).
- **Validation**: Strict DTO validation with custom error mapping.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ▶️ How to Start the Service

### Development Mode
To start the application in development mode with hot-reload:
```bash
npm run start:dev
```
The server will start on `http://localhost:3000`.

### Production Mode
To build and run the application in production mode:
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, you can access the Swagger UI to explore and test the API endpoints:

👉 **http://localhost:3000/api-docs**

### Key Endpoints:
- **`POST /get-encrypt-data`**: Encrypts a payload.
- **`POST /get-decrypt-data`**: Decrypts data (requires `data1` (encrypted key) and `data2` (encrypted payload)).

## 🧪 Running Tests

This project includes both unit and end-to-end (E2E) tests.

### Unit Tests
Run unit tests for individual components (Controllers, Services):
```bash
npm run test
```

### End-to-End (E2E) Tests
Run integration tests to verify the full flow (Encryption -> Decryption):
```bash
npm run test:e2e
```

## 📂 Project Structure

```
src/
├── common/             # Shared resources
│   ├── constants/      # Error codes, maps
│   ├── exceptions/     # Custom exception classes
│   └── filters/        # Global exception filters
├── cryptography/       # Cryptography module
│   ├── request-dto/    # Input validation DTOs
│   └── response-dto/   # Output structure DTOs
├── shared/
│   └── crypto-logic/   # Core AES/RSA logic
├── keys/               # RSA Key files (private.pem, public.pem)
├── app.controller.ts   # Main API controller
└── main.ts             # Application entry point
```

## 📝 License

This project is [UNLICENSED](LICENSE).
