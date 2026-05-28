export interface Poderes{
    nome: string;
    forcaPoke: number;
}

export interface pokemon{
    index: string;
    nome: string;
    imgPoke: string;
    tipo: string[];
    poderes: Poderes[];
}