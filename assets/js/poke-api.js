
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function convertPokeApiDetailToDetailPokemon(data,pokemon) {
    pokemon.doubleFrom = data.damage_relations.double_damage_from.map(element => element.name);
    pokemon.doubleTo = data.damage_relations.double_damage_to.map(element => element.name);
    pokemon.halfDamageTo = data.damage_relations.half_damage_to.map(element => element.name);
    pokemon.halfDamageFrom = data.damage_relations.half_damage_from.map(element => element.name);
    pokemon.noDamageFrom = data.damage_relations.no_damage_from.map(element => element.name);
    pokemon.noDamageTo = data.damage_relations.no_damage_to.map(element => element.name);
    
    return pokemon
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}



pokeApi.details = (nome) =>{
    let pokemonD = new PokemonDetail()
    const conjuntoDeFraqueza = new Set()
    const url = `https://pokeapi.co/api/v2/pokemon/${nome}`
      return fetch(url)
        .then(response => response.json())
        .then(data => {
            let pokemon = convertPokeApiDetailToPokemon(data)
            pokemonD.Pokemon = pokemon
            const tipos = data.types;
            const allPromises = tipos.map(tipo => {
                return fetch(tipo.type.url)
                    .then(response => response.json())
                    .then(dados => {
                        pokemonD = convertPokeApiDetailToDetailPokemon(dados, pokemonD);
                    });
            });
            return Promise.all(allPromises)
                .then(() => {
                    return pokemonD; 
                });
        });
        
}
