import { apiServer } from './apiServer';
import { AuthSession, UpdateStatsRequest, UserStats } from '@/@types/api';


function deepFind(obj: any, keys: string[]): any {
    if (obj == null || typeof obj !== 'object') return undefined;
    const queue: any[] = [obj];
    while (queue.length) {
        const cur = queue.shift();
        if (cur == null || typeof cur !== 'object') continue;
        for (const k of Object.keys(cur)) {
            const v = cur[k];
            if (keys.includes(k) && v != null && typeof v !== 'object') return v;
        }
        for (const k of Object.keys(cur)) {
            if (cur[k] && typeof cur[k] === 'object') queue.push(cur[k]);
        }
    }
    return undefined;
}


const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
function deepFindUuid(data: any): string | undefined {
    try {
        const match = JSON.stringify(data)?.match(UUID_RE);
        return match ? match[0] : undefined;
    } catch {
        return undefined;
    }
}

// Decodifica o userID de dentro de um JWT, caso o login só devolva token.
function decodeJwtSub(token: string | null): string | undefined {
    if (!token || token.split('.').length < 3) return undefined;
    try {
        const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = typeof atob === 'function' ? atob(part) : '';
        if (!json) return undefined;
        const payload = JSON.parse(json);
        const v = payload.sub ?? payload.userId ?? payload.user_id ?? payload.id;
        return v != null ? String(v) : undefined;
    } catch {
        return undefined;
    }
}

// Extrai o token da resposta cobrindo os nomes de campo mais comuns (aninhados).
function extractToken(data: any): string | null {
    const t = deepFind(data, [
        'token', 'accessToken', 'access_token', 'idToken', 'id_token', 'jwt', 'authToken',
    ]);
    return t != null ? String(t) : null;
}

// Extrai o userId tentando: campos diretos/aninhados -> UUID na resposta -> sub do JWT.
function extractUserId(data: any, token: string | null): string {
    const direct = deepFind(data, [
        'userId', 'user_id', 'user-id', 'userID', 'id', 'uuid', 'sub',
    ]);
    if (direct != null && String(direct).length > 0) return String(direct);
    return deepFindUuid(data) ?? decodeJwtSub(token) ?? '';
}

export async function registerUser(username: string, password: string): Promise<AuthSession> {
    const { data } = await apiServer.post('/auth/v1/register', { username, password });
    const token = extractToken(data);
    return { userId: extractUserId(data, token), username, token };
}

export async function loginUser(username: string, password: string): Promise<AuthSession> {
    const { data } = await apiServer.post('/auth/v1/login', { username, password });
    const token = extractToken(data);
    return { userId: extractUserId(data, token), username, token };
}

export async function getStats(userId: string): Promise<UserStats> {
    const { data } = await apiServer.get(`/auth/v1/stats/${userId}`);
    return {
        level: Number(data?.level ?? 0),
        vitorias: Number(data?.vitorias ?? 0),
        derrotas: Number(data?.derrotas ?? 0),
    };
}

export async function updateStats(userId: string, stats: UpdateStatsRequest): Promise<void> {
    await apiServer.put(`/auth/v1/stats/${userId}`, stats);
}
