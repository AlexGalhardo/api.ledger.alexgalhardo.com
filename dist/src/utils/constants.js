"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = void 0;
exports.API_URL = process.env.NODE_ENV === "production"
    ? "https://api.ledger.alexgalhardo.com"
    : `http://localhost:${process.env.PORT || 3000}`;
//# sourceMappingURL=constants.js.map