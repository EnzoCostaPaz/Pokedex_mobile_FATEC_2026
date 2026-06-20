import AsyncStorage from '@react-native-async-storage/async-storage';

// script que salva o time escolhido mesmo após o usuario sair da seção/pagina
const TEAM_KEY = (userId: string) => `@pokedex:team:${userId}`;

// Carrega os ids do time salvos localmente para este usuário.
export async function loadLocalTeam(userId: string | null): Promise<number[]> {
    if (!userId) return [];
    try {
        const raw = await AsyncStorage.getItem(TEAM_KEY(userId));
        const ids = raw ? JSON.parse(raw) : [];
        return Array.isArray(ids) ? ids.filter((n: any) => Number.isFinite(n)) : [];
    } catch (error) {
        console.error('Erro ao carregar o time local:', error);
        return [];
    }
}

// Salva localmente os ids do time deste usuário.
export async function saveLocalTeam(userId: string | null, ids: number[]): Promise<void> {
    if (!userId) return;
    try {
        await AsyncStorage.setItem(TEAM_KEY(userId), JSON.stringify(ids));
    } catch (error) {
        console.error('Erro ao salvar o time local:', error);
    }
}
