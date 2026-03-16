"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("prisma");
exports.default = (0, prisma_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
//# sourceMappingURL=prisma.config.js.map