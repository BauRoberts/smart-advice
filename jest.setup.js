// jest.setup.js
// Configuración global para Jest

// Si necesitas mockear fetch global
global.fetch = jest.fn();

// Mockear TextEncoder/TextDecoder utilizados por Next.js
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

// Suprime los mensajes de consola durante los tests
// Comenta estas líneas si necesitas ver los logs durante las pruebas
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});
jest.spyOn(console, "debug").mockImplementation(() => {});
