// 1. IMPORTACIONES: Traemos las funciones de los servidores de Google Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,   
    collection,     
    addDoc,         
    getDocs,         
    deleteDoc,      
    doc,             
    updateDoc        
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. CONFIGURACIÓN: Credenciales que vinculan este código con tu proyecto en la nube
 const firebaseConfig = {
    apiKey: "AIzaSyA8p5eM2wj1es_kc8D0PR9PXvy7a5K8-ks",
    authDomain: "crud-firebase-app-8a869.firebaseapp.com",
    projectId: "crud-firebase-app-8a869",
    storageBucket: "crud-firebase-app-8a869.firebasestorage.app",
    messagingSenderId: "699527315259",
    appId: "1:699527315259:web:ba3236e0c134247eac011e"
};

// 3. INICIALIZACIÓN: Activamos la conexión a Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let datos = [];

// --- FUNCIÓN AGREGAR (CREATE) ---
// Usamos window. para que el botón del HTML pueda 'ver' esta función
window.agregar = async function () {
    const nombre = document.getElementById("nombre").value; // Obtiene el texto del input
    const precio = document.getElementById("precio").value; // Obtiene el precio del input

    // Validación: Si están vacíos, detiene la ejecución con un aviso
    if (nombre === "" || precio === "") {
        alert("⚠️ Completa todos los campos");
        return;
    }

    try {
        // Envía el nuevo producto a la colección "productos" en la nube
        await addDoc(collection(db, "productos"), { nombre, precio });
        alert("✅ Producto agregado con éxito");
        
        // Limpia los cuadros de texto para que queden listos para otro producto
        document.getElementById("nombre").value = "";
        document.getElementById("precio").value = "";
        
        leer(); // Actualiza la tabla para mostrar el nuevo producto
    } catch (e) { 
        console.error("Error al guardar:", e); 
    }
};

// --- FUNCIÓN LEER (READ) ---
async function leer() {
    datos = []; // Vaciamos la lista local antes de volver a cargar
    // Traemos todos los documentos de la colección "productos" desde Firebase
    const querySnapshot = await getDocs(collection(db, "productos"));
    
    querySnapshot.forEach((docu) => {
        // Guardamos el ID único de Firebase y los datos (nombre/precio) en nuestra lista
        datos.push({ id: docu.id, ...docu.data() });
    });
    mostrar(datos); // Enviamos los datos a la función que los dibuja en el HTML
}

// --- FUNCIÓN MOSTRAR (VISUALIZACIÓN) ---
function mostrar(lista) {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = ""; // Borramos el contenido actual de la tabla para no duplicar

    lista.forEach((d) => {
        // Creamos filas HTML por cada producto e incluimos los botones de acción
        tabla.innerHTML += `
            <tr>
                <td>${d.nombre}</td>
                <td>${d.precio}</td>
                <td>
                    <button onclick="eliminar('${d.id}')">Eliminar</button>
                    <button onclick="editar('${d.id}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

// --- FUNCIÓN ELIMINAR (DELETE) ---
window.eliminar = async function (id) {
    // Si el usuario confirma, borramos el documento exacto usando su ID
    if(confirm("¿Seguro que quieres eliminar este producto?")){
        await deleteDoc(doc(db, "productos", id));
        leer(); // Refrescamos la tabla después de borrar
    }
};

// --- FUNCIÓN EDITAR (UPDATE) ---
window.editar = async function (id) {
    const nuevoNombre = prompt("Nuevo nombre:"); // Pide el nuevo nombre
    const nuevoPrecio = prompt("Nuevo precio:"); // Pide el nuevo precio

    // Si el usuario cancela o deja vacío, no hace nada
    if (!nuevoNombre || !nuevoPrecio) return;

    // Actualiza el documento en la nube con los nuevos valores
    await updateDoc(doc(db, "productos", id), {
        nombre: nuevoNombre,
        precio: nuevoPrecio
    });
    leer(); // Refrescamos la tabla
};

// --- FUNCIÓN FILTRAR (BÚSQUEDA) ---
window.filtrar = function () {
    const texto = document.getElementById("buscar").value.toLowerCase();
    // Filtramos sobre la variable 'datos' en memoria para que la búsqueda sea instantánea
    const filtrados = datos.filter(d => 
        d.nombre.toLowerCase().includes(texto)
    );
    mostrar(filtrados); // Redibujamos la tabla solo con los resultados encontrados
};

// Ejecutamos la lectura de datos en cuanto se abre la página
leer();