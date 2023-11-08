/*Arreglos vacios*/
let eventos = [];
let arr = [];

/*Creación de constantes con el querySelector con el fin de obtener la refencia de los elementos html con el id dados allá */
const nombreEvento = document.querySelector("#nombreEvento");
const fechaEvento = document.querySelector("#fechaEvento");
const botonAgregar = document.querySelector("#agregar");
const listaEventos = document.querySelector("#listaEventos");

/*Significa que la función cargar() se ejecuta en el momento en que se declara la variable json, y el valor que devuelve la función se almacena en json.*/
const json = cargar();

/*El try y el catch se utilizan para poder manejar los posibles errores al momento de analizar JSON*/
try {
    /*El método JSON.parse() intenta convertir esta cadena JSON en un objeto JavaScript*/
    arr = JSON.parse(json);
} catch {
    /*Si ocurre un error se asigna un array vacío [] a la variable arr.*/
    arr = []
}/* Si arr tiene un valor (por ejemplo, si el análisis JSON fue exitoso o si se asignó un array vacío en el bloque catch), 
    entonces eventos se inicializa como una copia de arr utilizando el operador de propagación (...). 
    Si arr es null, undefined o cualquier otro valor "falsy", entonces eventos se inicializa como un array vacío [].*/
eventos = arr ? [...arr] : [];

/*Mostrar los eventos*/
mostrarEventos();

/*El querySelector busca en el html el primer formulario*/
/*Es un evento que esta escuchando el "submit". En el formulario HTML, el evento 
"submit" se dispara cuando el usuario envía el formulario*/
document.querySelector("form").addEventListener("submit", e => {
    /*Realizar una acción personalizada al no tener una base de datos*/
    e.preventDefault();
    /*Aregar el evento cuando se diligencia le formulario*/
    agregarEvento();
});

function agregarEvento () {
    /*Se verifica si el campo nombreEvento está vacío o si el campo fechaEvento está vacío. 
    Si cualquiera de ellos está vacío, no se ejecuta el codigo restante, 
    esto con el fin de evitar agregar eventos con campos vacío*/
    if (nombreEvento.value === "" || fechaEvento.value === "") {
        return;
    }
    /*Esta condicion no permite agregar eventos con fechas del pasado*/
    if (diferenciaFecha(fechaEvento.value) < 0) {
        return;
    }

    /*Si todo lo anterior es exitoso, se crea un objeto nuevoEvento que contiene 
    un ID generado aleatoriamente, con el nombre y fecha del evento.*/
    const nuevoEvento = {
        id: (Math.random() * 100).toString(36).slice(3),
        nombre: nombreEvento.value,
        fecha: fechaEvento.value,
    };

    /*unshift() permite acomodar los eventos por fecha mas reciente que se coloca en la parte superior de la lista.*/
    eventos.unshift(nuevoEvento);

    /*Lista completa de eventos en formato JSON (usando JSON.stringify())*/
    guardar(JSON.stringify(eventos));

    /*El campo de entrada nombreEvento se borra, es decir queda en blanco para el nuevo evento a ingresar*/
    nombreEvento.value = "";

    /*Se muestran la lista de eventos, con los nuevos ingresados*/
    mostrarEventos();
}

/*Funcion para calcular la diferencia en días entre la fecha actual y una fecha de destino específica*/
function diferenciaFecha (destino) {
    /*Se crea un objeto Date, que se supone que contiene una fecha en un formato reconocido por JavaScript. 
    Esto convierte la fecha de destino en un objeto de fecha y hora que se puede utilizar para cálculos.*/
    let fechaDestino = new Date(destino);
    /*Captura la fecha y hora actual del sistema*/
    let fechaActual = new Date();
    /* Se calcula la diferencia en milisegundos entre la fecha de destino y la fecha actual*/
    let diferencia = fechaDestino.getTime() - fechaActual.getTime();

    /*El calculo en formato de milisegundos se hace dividiendo la cantidad 
    de milisegundos en un día (1000 * 3600 * 24) para convertirla en días.*/

    /* El resultado se redondea utilizando Math.ceil()*/
    let dias = Math.ceil(diferencia / (1000 * 3600 * 24));

    /*Retorna los dias calculados*/
    return dias;
}

/*Se utiliza para actualizar la interfaz de usuario con la lista de los eventos*/
function mostrarEventos() {
    /*Se utiliza el método map() en el array eventos para crear un nuevo array llamado eventosHTML. 
    Cada elemento en este nuevo array representa un evento y se genera mediante una plantilla de cadena 
    que incluye el nombre del evento, la fecha, y un botón de eliminación.*/
    const  eventosHTML = eventos.map((evento) => {
        return `
        <div class="evento">
            <div class="dias">

                <span class="diasFaltantes">${diferenciaFecha(evento.fecha)}</span>
                <span class="texto">Dias para</span>

            </div>

                <div class="nombreEvento">${evento.nombre}</div>
                <div class="fechaEvento">${evento.fecha}</div>
                <div class="acciones">
                    <button data-id="${evento.id}" class="eliminar">Eliminar</button>
                </div>

        </div>
        `;
    });

    /*Esta línea actualiza el contenido del elemento HTML que tiene la clase "listaEventos" */
    /*.innerHTML se utiliza para establecer el contenido HTML dentro del contenedor, y join("") 
    combina todas las cadenas del array eventosHTML en una sola cadena que se establece 
    como el contenido HTML del contenedor, reemplazando cualquier contenido anterior.*/
    listaEventos.innerHTML = eventosHTML.join("");

    /*"eliminar" se itera sobre ellos con un bucle forEach*/
    document.querySelectorAll('.eliminar').forEach(button =>{
        button.addEventListener("click", e => {
            /*Obtiene el valor del atributo data-id, que contiene el ID único del evento asociado a ese botón*/
            const id = button.getAttribute('data-id');
            eventos = eventos.filter(evento => evento.id !== id);

            /*Guardar la lista actualizada de eventos en JSON*/
            guardar(JSON.stringify(eventos));

            /*Se puede visualiza que ya no existen los elementos que se eliminaron*/
            mostrarEventos();
        });
    });
}

/*
La función guardar() toma un argumento llamado datos, es una cadena que contiene los datos que deseas almacenar.
Utiliza localStorage.setItem("lista", datos); para almacenar estos datos en el almacenamiento local del navegador. 
En este caso, los datos se almacenan bajo la clave (key) "lista". 
Esto significa que puedes recuperar estos datos más tarde utilizando la misma clave "lista".*/
function guardar(datos) {
    localStorage.setItem("lista", datos);
}

/*La función cargar() no toma argumentos, en este caso toma localStorage.getItem("lista") 
para recuperar los datos previamente almacenados en el almacenamiento local bajo la clave "lista"*/
function cargar() {
    return localStorage.getItem("lista");
}