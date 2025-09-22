// src/constants/footer.ts

export const NAME = "S. Almonte"
export const COMPANY_NAME = "A.M.P.L. LLC";
export const TERMS_URL = "/terms";
export const PRIVACY_URL = "/privacy";

// Auto-updating copyright year
export const getCopyright = () =>
    `© ${new Date().getFullYear()} ${NAME} ${COMPANY_NAME}. All rights reserved`;
