import axios from 'axios';

// Instância do backend da Pokemon API (API Gateway / AWS).
// baseURL é a raiz comum a todos os endpoints da coleção do Postman.
export const apiServer = axios.create({

    
    baseURL: 'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon',
});

// Token de autenticação guardado em memória e anexado a cada requisição.
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
}

apiServer.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});
