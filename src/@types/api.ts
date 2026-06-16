
// OBS: A coleção do Postman não traz exemplos de resposta salvos, então os
// formatos de RESPOSTA abaixo são uma suposição razoável e os serviços tratam
// variações de nome de campo de forma defensiva. Ajuste conforme o backend real.

// ----- Auth -----

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

// Resposta de login/registro normalizada para uso interno do app.
export interface AuthSession {
    userId: string;
    username: string;
    token: string | null;
}

// ----- Perfil / Stats -----

export interface UserStats {
    level: number;
    vitorias: number;
    derrotas: number;
}

// O corpo do PUT de stats aceita strings ("1", "0") segundo o Postman.
export interface UpdateStatsRequest {
    level: number | string;
    vitorias: number | string;
    derrotas: number | string;
}

// ----- Time / Capturados -----

// O endpoint de time retorna a lista de pokémons do usuário. Normalizamos para
// uma lista de ids numéricos (1..151) para casar com o `index` da PokeAPI.
export type Team = number[];
