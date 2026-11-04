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
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        tarjeta.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name.toUpperCase()}</h3>
            <p>Tipo(s): ${tipos}</p>
        `;
        tarjeta.onclick = function () {
            alert(`Hiciste click en ${pokemon.name}`);
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
    cargarTipos();
    cargarPokemones();
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=main.js.map