export const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://api.ledger.alexgalhardo.com"
        : `http://localhost:${process.env.PORT || 3000}`;
