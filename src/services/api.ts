import axios from 'axios';
import { pokemon } from '../@types/pokemon';

export const api = axios.create({
    baseURL:'https://pokeapi.co/api/v2/'
});

export const getPokemon = async (limit = 151): Promise<pokemon[]> => {
    const response = await api.get(`pokemon?limit=${limit}`);
    const listPoke = response.data.results;

    const detalidList = await Promise.all(
        listPoke.map(async (pokemon: { url: string }) => {
            const detailRes = await api.get(pokemon.url);
            const data = detailRes.data;
            return {
                nome: data.name,
                index: data.id.toString().padStart(3,'0'),
                tipo: data.types.map((t: any) => t.type.name),
                imgPoke: data.sprites.front_default,
                poderes: data.stats.map((s: any) => ({
                    nome: s.stat.name,
                    forcaPoke: s.base_stat
                }))
            };
        })
    );
    return detalidList;
}