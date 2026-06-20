import { apiServer } from './apiServer';
import { Team } from '@/@types/api';
import { pokemon } from '@/@types/pokemon';

// Normaliza a resposta do time para uma lista de ids numéricos.
// Cobre formatos como [1,2,3], { team: [...] }, [{ id: 1 }, ...], etc.
function normalizeTeam(data: any): Team {
    const list = Array.isArray(data)
        ? data
        : (data?.team ?? data?.capture ?? data?.captured ?? data?.capturados ?? data?.pokemons ?? data?.items ?? []);
    if (!Array.isArray(list)) return [];
    return list
        .map((item: any) =>
            typeof item === 'number'
                ? item
                : Number(item?.id ?? item?.pokemonId ?? item?.['pokemon-id'] ?? item?.index ?? item)
        )
        .filter((id: number) => Number.isFinite(id));
}

// GET /pokemon/v1/team?user-id={userId} — só os ids do time (usado ao salvar).
export async function getTeam(userId: string): Promise<Team> {
    const { data } = await apiServer.get('/pokemon/v1/team', {
        params: { 'user-id': userId },
    });
    return normalizeTeam(data);
}

// Mapeia um pokémon vindo do backend para o tipo usado no app.
function mapBackendPokemon(item: any): pokemon {
    return {
        index: String(item?.index ?? ''),
        nome: item?.name ?? '',
        imgPoke: item?.image ?? '',
        tipo: Array.isArray(item?.types) ? item.types : [],
        poderes: Array.isArray(item?.abilities)
            ? item.abilities.map((a: any) => ({ nome: a?.name ?? '', forcaPoke: Number(a?.strength ?? 0) }))
            : [],
    };
}

// GET /pokemon/v1/team?user-id={userId} — retorna o time E a coleção de capturados
// do jogador já como objetos completos (a própria API traz nome, sprite, tipos e stats),
// dispensando a PokeAPI.
export async function getPlayerPokemons(userId: string): Promise<{ team: pokemon[]; capture: pokemon[] }> {
    const { data } = await apiServer.get('/pokemon/v1/team', {
        params: { 'user-id': userId },
    });
    const team = Array.isArray(data?.team) ? data.team.map(mapBackendPokemon) : [];
    const capture = Array.isArray(data?.capture) ? data.capture.map(mapBackendPokemon) : [];
    return { team, capture };
}


// GET /pokemon/v1/captured?user-id={userId}
// Retorna os ids dos pokémons capturados do jogador (a coleção que cresce nas batalhas).
// Se o endpoint ainda não existir no backend (404), trata como coleção vazia.
export async function getCapturedPokemons(userId: string): Promise<Team> {
    try {
        const { data } = await apiServer.get('/pokemon/v1/captured', {
            params: { 'user-id': userId },
        });
        return normalizeTeam(data);
    } catch (error: any) {
        // Endpoint opcional: se não existir (404) ou falhar por CORS/rede, trata como vazio.
        console.warn('[getCapturedPokemons] indisponível, tratando como vazio:', error?.response?.status ?? error?.message);
        return [];
    }
}


// PUT /pokemon/v1/team?user-id={userId}&removed-pokemon={id}&new-pokemon={id}
export async function updateTeam(
    userId: string,
    removedPokemon: number | string,
    newPokemon: number | string
): Promise<void> {
    await apiServer.put('/pokemon/v1/team', null, {
        params: {
            'user-id': userId,
            'removed-pokemon': removedPokemon,
            'new-pokemon': newPokemon,
        },
    });
}



// PUT /pokemon/v1/captured?user-id={userId}&pokemon-id={id}
// Idempotente: se o pokémon já existe no time/capturados (400), o estado desejado
// já está satisfeito, então tratamos como sucesso em vez de erro.
export async function addCapturedPokemon(userId: string, pokemonId: number | string): Promise<void> {
    try {
        await apiServer.put('/pokemon/v1/captured', null, {
            params: { 'user-id': userId, 'pokemon-id': pokemonId },
        });
    } catch (error: any) {
        const message = String(error?.response?.data?.message ?? '');
        if (error?.response?.status === 400 && /j[áa] existe|already exists/i.test(message)) {
            return;
        }
        throw error;
    }
}

// DELETE /pokemon/v1/captured?user-id={userId}&pokemon-id={id}
// Idempotente: se o pokémon não existe (já removido), tratamos como sucesso.
export async function deleteCapturedPokemon(userId: string, pokemonId: number | string): Promise<void> {
    try {
        await apiServer.delete('/pokemon/v1/captured', {
            params: { 'user-id': userId, 'pokemon-id': pokemonId },
        });
    } catch (error: any) {
        const status = error?.response?.status;
        const message = String(error?.response?.data?.message ?? '');
        if ((status === 400 || status === 404) && /n[ãa]o existe|not found|inexistente|n[ãa]o encontrado/i.test(message)) {
            return;
        }
        throw error;
    }
}
