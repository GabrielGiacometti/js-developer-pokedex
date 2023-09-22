const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type} ">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img class ="img" src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function detailPokemon(pokemonDetail){
    return `
    <section id="specific" class="specific">
         
        <div class="details">
        <img class ="image" src="${pokemonDetail.Pokemon.photo}"
        alt="${pokemonDetail.Pokemon.name}">
            <span class="close" id="closeDetail">&times;</span>

            <h2 class="damage-status">Double from</h2>
            <ul  class="lista-geral">
                <li class="lista ">
                     ${pokemonDetail.doubleFrom.map((doubleFrom) => `<ol class="type ${doubleFrom}">${doubleFrom}</ol>`).join('')}
                 </li>

                <h2 class="damage-status">Double to</h2>
                <li class="lista ">
                    ${pokemonDetail.doubleTo.map((doubleTo) => `<ol class="type ${doubleTo}">${doubleTo}</ol>`).join('')}
                </li>

                <h2 class="damage-status">No damage to</h2>
                <li class="lista ">
                    ${pokemonDetail.noDamageTo.map((noDamageTo) => `<ol class="type ${noDamageTo}">${noDamageTo}</ol>`).join('')}
                </li>
                <h2 class="damage-status">No damage from</h2>
                <li class="lista ">
                    ${pokemonDetail.noDamageFrom.map((noDamageFrom) => `<ol class="type ${noDamageFrom}">${noDamageFrom}</ol>`).join('')}
                </li>
                <h2 class="damage-status">Half damage to</h2>
                <li class="lista ">
                    ${pokemonDetail.halfDamageTo.map((halfDamageTo) => `<ol class="type ${halfDamageTo}">${halfDamageTo}</ol>`).join('')}
                </li>
                <h2 class="damage-status">Half damage from</h2>
                <li class="lista ">
                    ${pokemonDetail.halfDamageFrom.map((halfDamageFrom) => `<ol class="type ${halfDamageFrom}">${halfDamageFrom}</ol>`).join('')}
                </li>
            </ul>
            </div>
    </section>"`;
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


pokemonList.addEventListener("click", function(event) {
    if (event.target.closest("LI")) {
        const elementoPokemonClicado = event.target.closest(".pokemon");
        
        let pokemon
        pokeApi.details(elementoPokemonClicado.querySelector(".name").textContent).then(data =>{
            pokemon = data
            const modalContainer = document.getElementById("detail-Pokemon");
            modalContainer.innerHTML = detailPokemon(pokemon);
            
            document.getElementById("closeDetail").addEventListener("click", function() {
                const modal = document.getElementById("specific");
                modal.style.display = "none";
            });
         });
    }
});


