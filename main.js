let todosLosPokemones = [];
function cargarTipos() {
    fetch('https://pokeapi.co/api/v2/type')
        .then(function (respuesta) {
        return respuesta.json();
    })
        .then(function (datos) {
        const selectTipo = document.getElementById('filtroTipo');
        if (!selectTipo)
            return;
        datos.results.forEach(function (tipo) {
            const option = document.createElement('option');
            option.value = tipo.name;
            option.textContent = tipo.name.toUpperCase();
            selectTipo.appendChild(option);
        });
    })
        .catch(function (error) {
        console.error("Error al cargar los tipos:", error);
    });
}
function cargarPokemones() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
        .then(function (respuesta) {
        return respuesta.json();
    })
        .then(function (datos) {
        const promesas = datos.results.map(function (pokemon) {
            return fetch(pokemon.url).then(function (res) {
                return res.json();
            });
        });
        Promise.all(promesas)
            .then(function (resultados) {
            todosLosPokemones = resultados;
            mostrarPokemones(todosLosPokemones);
        });
    })
        .catch(function (error) {
        console.error("Error al cargar los Pokémon:", error);
    });
}
function mostrarPokemones(lista) {
    const contenedor = document.getElementById('listaPokemon');
    if (!contenedor)
        return;
    contenedor.innerHTML = '';
    if (lista.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron Pokémon.</p>';
        return;
    }
    lista.forEach(function (pokemon) {
        const tipos = pokemon.types.map(function (t) {
            return t.type.name;
        }).join(', ');
        let nombreGen = "Desconocida";
        const id = pokemon.id;
        if (id >= 1 && id <= 151)
            nombreGen = "1";
        else if (id >= 152 && id <= 251)
            nombreGen = "2";
        else if (id >= 252 && id <= 386)
            nombreGen = "3";
        else if (id >= 387 && id <= 493)
            nombreGen = "4";
        else if (id >= 494 && id <= 649)
            nombreGen = "5";
        else if (id >= 650 && id <= 721)
            nombreGen = "6";
        else if (id >= 722 && id <= 809)
            nombreGen = "7";
        else if (id >= 810 && id <= 905)
            nombreGen = "8";
        else if (id >= 906 && id <= 1025)
            nombreGen = "9";
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        tarjeta.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>#${pokemon.id} - ${pokemon.name.toUpperCase()}</h3>
            <p>Tipo(s): ${tipos}</p>
            <p>Generación: ${nombreGen}</p>
        `;
        tarjeta.onclick = function () {
            verDetallePokemon(pokemon.id);
        };
        contenedor.appendChild(tarjeta);
    });
}
function filtrarPokemones() {
    const inputBuscador = document.getElementById('buscador');
    const selectTipo = document.getElementById('filtroTipo');
    const selectGen = document.getElementById('filtroGeneracion');
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase() : '';
    const tipoSeleccionado = selectTipo ? selectTipo.value : '';
    const genSeleccionada = selectGen ? selectGen.value : '';
    const filtrados = todosLosPokemones.filter(function (pokemon) {
        const coincideNombre = pokemon.name.toLowerCase().includes(textoBusqueda);
        const coincideTipo = tipoSeleccionado === "" || pokemon.types.some(function (t) {
            return t.type.name === tipoSeleccionado;
        });
        let coincideGen = true;
        if (genSeleccionada === "gen1") {
            coincideGen = pokemon.id >= 1 && pokemon.id <= 151;
        }
        else if (genSeleccionada === "gen2") {
            coincideGen = pokemon.id >= 152 && pokemon.id <= 251;
        }
        else if (genSeleccionada === "gen3") {
            coincideGen = pokemon.id >= 252 && pokemon.id <= 386;
        }
        else if (genSeleccionada === "gen4") {
            coincideGen = pokemon.id >= 387 && pokemon.id <= 493;
        }
        else if (genSeleccionada === "gen5") {
            coincideGen = pokemon.id >= 494 && pokemon.id <= 649;
        }
        else if (genSeleccionada === "gen6") {
            coincideGen = pokemon.id >= 650 && pokemon.id <= 721;
        }
        else if (genSeleccionada === "gen7") {
            coincideGen = pokemon.id >= 722 && pokemon.id <= 809;
        }
        else if (genSeleccionada === "gen8") {
            coincideGen = pokemon.id >= 810 && pokemon.id <= 905;
        }
        else if (genSeleccionada === "gen9") {
            coincideGen = pokemon.id >= 906 && pokemon.id <= 1025;
        }
        return coincideNombre && coincideTipo && coincideGen;
    });
    mostrarPokemones(filtrados);
}
function verDetallePokemon(idOrName) {
    const grillaPrincipal = document.getElementById('listaPokemon');
    const controles = document.querySelector('.controles');
    const tituloPrincipal = document.querySelector('h1');
    const vistaDetalle = document.getElementById('vistaDetalle');
    const detalleContenido = document.getElementById('detalleContenido');
    if (grillaPrincipal)
        grillaPrincipal.classList.add('oculto');
    if (controles)
        controles.classList.add('oculto');
    if (tituloPrincipal)
        tituloPrincipal.classList.add('oculto');
    if (vistaDetalle)
        vistaDetalle.classList.remove('oculto');
    fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`)
        .then(res => res.json())
        .then(pokemon => {
        const tipos = pokemon.types.map((t) => t.type.name).join(', ');
        detalleContenido.innerHTML = `
                <div class="detalle-info">
                    <img src="${pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <h2>#${pokemon.id} - ${pokemon.name.toUpperCase()}</h2>
                    <p><strong>Tipo(s):</strong> ${tipos}</p>
                    <p><strong>Altura:</strong> ${pokemon.height / 10} m | <strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                    
                    <div class="evoluciones-section">
                        <h3>Cadena de Evolución</h3>
                        <div id="cadenaEvolutiva" class="chain-container">Cargando evoluciones...</div>
                    </div>
                </div>
            `;
        return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
    })
        .then(res => res.json())
        .then(species => {
        return fetch(species.evolution_chain.url);
    })
        .then(res => res.json())
        .then(evolutionData => {
        const contenedorEvo = document.getElementById('cadenaEvolutiva');
        if (!contenedorEvo)
            return;
        contenedorEvo.innerHTML = '';
        construirArbolEvolutivo(evolutionData.chain, contenedorEvo);
    })
        .catch(err => {
        console.error("Error al cargar los detalles del Pokémon:", err);
    });
}
function construirArbolEvolutivo(node, contenedor) {
    const nivelDiv = document.createElement('div');
    nivelDiv.classList.add('chain-level');
    const card = document.createElement('div');
    card.classList.add('evolution-card');
    card.innerHTML = `<p>${node.species.name.toUpperCase()}</p>`;
    card.onclick = function () {
        verDetallePokemon(node.species.name);
    };
    nivelDiv.appendChild(card);
    contenedor.appendChild(nivelDiv);
    if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach((evo) => {
            const arrow = document.createElement('div');
            arrow.classList.add('evolution-arrow');
            arrow.textContent = '⬇';
            contenedor.appendChild(arrow);
            construirArbolEvolutivo(evo, contenedor);
        });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const inputBuscador = document.getElementById('buscador');
    if (inputBuscador) {
        inputBuscador.addEventListener('input', filtrarPokemones);
    }
    const selectTipo = document.getElementById('filtroTipo');
    if (selectTipo) {
        selectTipo.addEventListener('change', filtrarPokemones);
    }
    const selectGen = document.getElementById('filtroGeneracion');
    if (selectGen) {
        selectGen.addEventListener('change', filtrarPokemones);
    }
    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            const grillaPrincipal = document.getElementById('listaPokemon');
            const controles = document.querySelector('.controles');
            const tituloPrincipal = document.querySelector('h1');
            const vistaDetalle = document.getElementById('vistaDetalle');
            if (grillaPrincipal)
                grillaPrincipal.classList.remove('oculto');
            if (controles)
                controles.classList.remove('oculto');
            if (tituloPrincipal)
                tituloPrincipal.classList.remove('oculto');
            if (vistaDetalle)
                vistaDetalle.classList.add('oculto');
        });
    }
    cargarTipos();
    cargarPokemones();
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=main.js.map