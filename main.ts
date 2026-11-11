let todosLosPokemones: any[] = [];

function cargarTipos(): void {
    fetch('https://pokeapi.co/api/v2/type')
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(datos) {
            const selectTipo = document.getElementById('filtroTipo') as HTMLSelectElement;
            if (!selectTipo) return;

            datos.results.forEach(function(tipo: any) {
                const option = document.createElement('option');
                option.value = tipo.name;
                option.textContent = tipo.name.toUpperCase();
                selectTipo.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error("Error al cargar los tipos:", error);
        });
}

function cargarPokemones(): void {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(datos) {
            const promesas = datos.results.map(function(pokemon: any) {
                return fetch(pokemon.url).then(function(res) {
                    return res.json();
                });
            });

            Promise.all(promesas)
                .then(function(resultados: any[]) {
                    todosLosPokemones = resultados;
                    mostrarPokemones(todosLosPokemones);
                });
        })
        .catch(function(error) {
            console.error("Error al cargar los Pokémon:", error);
        });
}

function mostrarPokemones(lista: any[]): void {
    const contenedor = document.getElementById('listaPokemon');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron Pokémon.</p>';
        return;
    }

    lista.forEach(function(pokemon: any) {
        const tipos = pokemon.types.map(function(t: any) {
            return t.type.name;
        }).join(', ');
        
        let nombreGen = "Desconocida";
        const id = pokemon.id;
        
        if (id >= 1 && id <= 151) nombreGen = "1";
        else if (id >= 152 && id <= 251) nombreGen = "2";
        else if (id >= 252 && id <= 386) nombreGen = "3";
        else if (id >= 387 && id <= 493) nombreGen = "4";
        else if (id >= 494 && id <= 649) nombreGen = "5";
        else if (id >= 650 && id <= 721) nombreGen = "6";
        else if (id >= 722 && id <= 809) nombreGen = "7";
        else if (id >= 810 && id <= 905) nombreGen = "8";
        else if (id >= 906 && id <= 1025) nombreGen = "9";

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        tarjeta.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>#${pokemon.id} - ${pokemon.name.toUpperCase()}</h3>
            <p>Tipo(s): ${tipos}</p>
            <p>Generación: ${nombreGen}</p>
        `;
        
        tarjeta.onclick = function() {
            verDetallePokemon(pokemon.id);
        };

        contenedor.appendChild(tarjeta);
    });
}

function filtrarPokemones(): void {
    const inputBuscador = document.getElementById('buscador');
    const selectTipo = document.getElementById('filtroTipo');
    const selectGen = document.getElementById('filtroGeneracion');

    const textoBusqueda = inputBuscador ? (inputBuscador as HTMLInputElement).value.toLowerCase() : '';
    const tipoSeleccionado = selectTipo ? (selectTipo as HTMLSelectElement).value : '';
    const genSeleccionada = selectGen ? (selectGen as HTMLSelectElement).value : '';

    const filtrados = todosLosPokemones.filter(function (pokemon: any) {
        const coincideNombre = pokemon.name.toLowerCase().includes(textoBusqueda);

        const coincideTipo = tipoSeleccionado === "" || pokemon.types.some(function (t: any) {
            return t.type.name === tipoSeleccionado;
        });

        let coincideGen = true;
        if (genSeleccionada === "gen1") {
            coincideGen = pokemon.id >= 1 && pokemon.id <= 151;
        } else if (genSeleccionada === "gen2") {
            coincideGen = pokemon.id >= 152 && pokemon.id <= 251;
        } else if (genSeleccionada === "gen3") {
            coincideGen = pokemon.id >= 252 && pokemon.id <= 386;
        } else if (genSeleccionada === "gen4") {
            coincideGen = pokemon.id >= 387 && pokemon.id <= 493;
        } else if (genSeleccionada === "gen5") {
            coincideGen = pokemon.id >= 494 && pokemon.id <= 649;
        } else if (genSeleccionada === "gen6") {
            coincideGen = pokemon.id >= 650 && pokemon.id <= 721;
        } else if (genSeleccionada === "gen7") {
            coincideGen = pokemon.id >= 722 && pokemon.id <= 809;
        } else if (genSeleccionada === "gen8") {
            coincideGen = pokemon.id >= 810 && pokemon.id <= 905;
        } else if (genSeleccionada === "gen9") {
            coincideGen = pokemon.id >= 906 && pokemon.id <= 1025;
        }

        return coincideNombre && coincideTipo && coincideGen;
    });

    mostrarPokemones(filtrados);
}

function verDetallePokemon(idOrName: string | number): void {
    const grillaPrincipal = document.getElementById('listaPokemon') as HTMLElement;
    const controles = document.querySelector('.controles') as HTMLElement;
    const tituloPrincipal = document.querySelector('h1') as HTMLElement;
    const vistaDetalle = document.getElementById('vistaDetalle') as HTMLElement;
    const detalleContenido = document.getElementById('detalleContenido') as HTMLElement;

    if (grillaPrincipal) grillaPrincipal.classList.add('oculto');
    if (controles) controles.classList.add('oculto');
    if (tituloPrincipal) tituloPrincipal.classList.add('oculto');
    if (vistaDetalle) vistaDetalle.classList.remove('oculto');

    fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`)
        .then(res => res.json())
        .then(pokemon => {
            const tipos = pokemon.types.map((t: any) => t.type.name).join(', ');
            
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
            if (!contenedorEvo) return;
            
            contenedorEvo.innerHTML = '';
            construirArbolEvolutivo(evolutionData.chain, contenedorEvo);
        })
        .catch(err => {
            console.error("Error al cargar los detalles del Pokémon:", err);
        });
}

function construirArbolEvolutivo(node: any, contenedor: HTMLElement): void {
    const nivelDiv = document.createElement('div');
    nivelDiv.classList.add('chain-level');

    const card = document.createElement('div');
    card.classList.add('evolution-card');
    card.innerHTML = `<p>${node.species.name.toUpperCase()}</p>`;
    
    card.onclick = function() {
        verDetallePokemon(node.species.name);
    };

    nivelDiv.appendChild(card);
    contenedor.appendChild(nivelDiv);

    if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach((evo: any) => {
            const arrow = document.createElement('div');
            arrow.classList.add('evolution-arrow');
            arrow.textContent = '⬇';
            contenedor.appendChild(arrow);

            construirArbolEvolutivo(evo, contenedor);
        });
    }
}

let pokemonActualQuiz: any = null;
let intentosRestantes = 3;

function iniciarQuiz(): void {
    if (todosLosPokemones.length === 0) {
        alert("Los Pokémon aún se están cargando, por favor aguarda un momento.");
        return;
    }

    const grillaPrincipal = document.getElementById('listaPokemon') as HTMLElement;
    const controles = document.querySelector('.controles') as HTMLElement;
    const tituloPrincipal = document.querySelector('h1') as HTMLElement;
    const vistaDetalle = document.getElementById('vistaDetalle') as HTMLElement;
    const vistaQuiz = document.getElementById('vistaQuiz') as HTMLElement;

    if (grillaPrincipal) grillaPrincipal.classList.add('oculto');
    if (controles) controles.classList.add('oculto');
    if (tituloPrincipal) tituloPrincipal.classList.add('oculto');
    if (vistaDetalle) vistaDetalle.classList.add('oculto');
    if (vistaQuiz) vistaQuiz.classList.remove('oculto');

    cargarNuevoPokemonQuiz();
}

function cargarNuevoPokemonQuiz(): void {
    intentosRestantes = 3;
    const indiceAleatorio = Math.floor(Math.random() * todosLosPokemones.length);
    pokemonActualQuiz = todosLosPokemones[indiceAleatorio];

    const img = document.getElementById('quizImagen') as HTMLImageElement;
    const pistas = document.getElementById('quizPistas') as HTMLElement;
    const resultado = document.getElementById('quizResultado') as HTMLElement;
    const intentosTxt = document.getElementById('quizIntentos') as HTMLElement;
    const input = document.getElementById('quizInput') as HTMLInputElement;

    if (img) {
        img.src = pokemonActualQuiz.sprites.front_default;
        img.classList.remove('pokemon-revelado');
    }
    if (pistas) pistas.innerHTML = "<strong>Pista:</strong> ¡Adivina el Pokémon oculto!";
    if (resultado) resultado.textContent = "";
    if (intentosTxt) intentosTxt.textContent = `Intentos restantes: ${intentosRestantes}`;
    if (input) {
        input.value = "";
        input.disabled = false;
        input.focus();
    }
}

function verificarAdivinanza(): void {
    const input = document.getElementById('quizInput') as HTMLInputElement;
    const resultado = document.getElementById('quizResultado') as HTMLElement;
    const pistas = document.getElementById('quizPistas') as HTMLElement;
    const intentosTxt = document.getElementById('quizIntentos') as HTMLElement;
    const img = document.getElementById('quizImagen') as HTMLImageElement;

    if (!input || !pokemonActualQuiz) return;

    const respuestaUsuario = input.value.trim().toLowerCase();
    const nombreReal = pokemonActualQuiz.name.toLowerCase();

    if (respuestaUsuario === nombreReal) {
        if (resultado) {
            resultado.style.color = "#10b981";
            resultado.textContent = `¡Correcto! Era ${pokemonActualQuiz.name.toUpperCase()} 🎉`;
        }
        if (img) img.classList.add('pokemon-revelado');
        input.disabled = true;
        setTimeout(cargarNuevoPokemonQuiz, 3500);
    } else {
        intentosRestantes--;
        if (intentosRestantes > 0) {
            if (intentosTxt) intentosTxt.textContent = `Intentos restantes: ${intentosRestantes}`;
            if (resultado) {
                resultado.style.color = "#ef4444";
                resultado.textContent = "¡Incorrecto! Se ha revelado una pista.";
            }

            const tipos = pokemonActualQuiz.types.map((t: any) => t.type.name).join(', ');
            let nombreGen = "1";
            const id = pokemonActualQuiz.id;
            if (id >= 152 && id <= 251) nombreGen = "2";
            else if (id >= 252 && id <= 386) nombreGen = "3";
            else if (id >= 387 && id <= 493) nombreGen = "4";
            else if (id >= 494 && id <= 649) nombreGen = "5";
            else if (id >= 650 && id <= 721) nombreGen = "6";
            else if (id >= 722 && id <= 809) nombreGen = "7";
            else if (id >= 810 && id <= 905) nombreGen = "8";
            else if (id >= 906 && id <= 1025) nombreGen = "9";

            if (intentosRestantes === 2) {
                pistas.innerHTML = `<strong>Pista 1 (Tipos):</strong> Sus tipos son ${tipos}`;
            } else if (intentosRestantes === 1) {
                pistas.innerHTML = `<strong>Pista 2 (Generación):</strong> Pertenece a la Generación ${nombreGen} y su nombre empieza con "${nombreReal.charAt(0).toUpperCase()}"`;
            }
        } else {
            if (intentosTxt) intentosTxt.textContent = "¡Te quedaste sin intentos!";
            if (resultado) {
                resultado.style.color = "#ef4444";
                resultado.textContent = `Era ${pokemonActualQuiz.name.toUpperCase()}. ¡Nueva ronda en breve!`;
            }
            if (img) img.classList.add('pokemon-revelado');
            input.disabled = true;
            setTimeout(cargarNuevoPokemonQuiz, 4000);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const inputBuscador = document.getElementById('buscador') as HTMLInputElement;
    if (inputBuscador) {
        inputBuscador.addEventListener('input', filtrarPokemones);
    }

    const selectTipo = document.getElementById('filtroTipo') as HTMLSelectElement;
    if (selectTipo) {
        selectTipo.addEventListener('change', filtrarPokemones);
    }

    const selectGen = document.getElementById('filtroGeneracion') as HTMLSelectElement;
    if (selectGen) {
        selectGen.addEventListener('change', filtrarPokemones);
    }

    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            const grillaPrincipal = document.getElementById('listaPokemon') as HTMLElement;
            const controles = document.querySelector('.controles') as HTMLElement;
            const tituloPrincipal = document.querySelector('h1') as HTMLElement;
            const vistaDetalle = document.getElementById('vistaDetalle') as HTMLElement;

            if (grillaPrincipal) grillaPrincipal.classList.remove('oculto');
            if (controles) controles.classList.remove('oculto');
            if (tituloPrincipal) tituloPrincipal.classList.remove('oculto');
            if (vistaDetalle) vistaDetalle.classList.add('oculto');
        });
    }

    const btnAbrirQuiz = document.getElementById('btnAbrirQuiz');
    if (btnAbrirQuiz) {
        btnAbrirQuiz.addEventListener('click', iniciarQuiz);
    }

    const btnVolverQuiz = document.getElementById('btnVolverQuiz');
    if (btnVolverQuiz) {
        btnVolverQuiz.addEventListener('click', function() {
            const grillaPrincipal = document.getElementById('listaPokemon') as HTMLElement;
            const controles = document.querySelector('.controles') as HTMLElement;
            const tituloPrincipal = document.querySelector('h1') as HTMLElement;
            const vistaQuiz = document.getElementById('vistaQuiz') as HTMLElement;

            if (grillaPrincipal) grillaPrincipal.classList.remove('oculto');
            if (controles) controles.classList.remove('oculto');
            if (tituloPrincipal) tituloPrincipal.classList.remove('oculto');
            if (vistaQuiz) vistaQuiz.classList.add('oculto');
        });
    }

    const btnAdivinar = document.getElementById('quizBtnAdivinar');
    if (btnAdivinar) {
        btnAdivinar.addEventListener('click', verificarAdivinanza);
    }

    const quizInput = document.getElementById('quizInput') as HTMLInputElement;
    if (quizInput) {
        quizInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                verificarAdivinanza();
            }
        });
    }

    cargarTipos();
    cargarPokemones();
});