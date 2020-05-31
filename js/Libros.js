//Variables globales
let formulario = document.getElementById('libro-form');
const divPrincipal = document.querySelector('#Principal');
const tbody = document.getElementById('libro-list');

//Clase principal
class Main{
    constructor(){
        this.Init();
    }

    Init(){

        //Evento para cuando cargue el formulario
        document.addEventListener('DOMContentLoaded', (e)=>{
            e.preventDefault();
            ui.CargarLibros();
        });

        //Evento para cuando enviemos el formulario
        formulario.addEventListener('submit', (e)=>{
            e.preventDefault();
            
            //Leer los datos
            const titulo = document.getElementById('titulo').value;
            const autor = document.getElementById('autor').value;
            const isbn = document.getElementById('isbn').value;

            //Evaluamos que no hayan campos vacios
            if(titulo.length == 0 || autor.length == 0 || isbn.length == 0){

                //Si hay campos vacios mostramos un mensaje de error
                ui.MostrarMensaje('Debe llenar todos los datos', 'alert alert-danger');
            }
            else{
                
                //Obtenemos los datos ingresados
                const libroObj = {
                    Titulo: titulo,
                    Autor: autor,
                    Isbn: isbn
                };

                ui.MostrarMensaje('Libro Agregado Correctamente', 'alert alert-success');
                libro.AgregarLibro(libroObj);
            }
        });

        //Eliminar libro
        document.querySelector('table').addEventListener('click', (e)=>{
            e.preventDefault();
            
            //Aplicamos Delegation para eliminar el libro seleccionado
            if(e.target.classList.contains( 'delete' )){
                if(confirm('Desea Eliminar este Libro?'))
                libro.EliminarLibro(e.target.parentElement.parentElement);
            }
        });
        
    }
}


//Clase encargada de mostrar los datos en el DOOM
class Interfaz{

    //Metodo de mostrar mensajes
    MostrarMensaje(mensaje, clases){

        const divMensaje = document.createElement('div');
        divMensaje.textContent = mensaje;
        divMensaje.className = clases;

        divPrincipal.insertBefore(divMensaje, formulario);

        setTimeout(()=>{divMensaje.remove(); formulario.reset();}, 3000);
    }

    //Metodo que muestra los libros en el doom
    MostrarLibrosDOOM(LibroObj){
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${LibroObj.Titulo}</td>
            <td>${LibroObj.Autor}</td>
            <td>${LibroObj.Isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    
        tbody.appendChild(tr);
    }

    //Metodo que carga los libros del Local storage al iniciar la app
    CargarLibros(){
        let librosLS;
        librosLS = local.ObtenerLibrosLocalStorage();

        librosLS.forEach((libro, index)=>{

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${libro.Titulo}</td>
                <td>${libro.Autor}</td>
                <td>${libro.Isbn}</td>
                <td><a href="#" class="btn btn-danger btn-sm delete" data-id=${index}>X</a></td>
            `;
        
            tbody.appendChild(tr);
        });
        
    } 
}

//Clase que maneja los libros
class Libros{
    constructor(){
         this.LibroArray = [];
    }


    AgregarLibro(ObjLibro){
        local.AgregarLibrosLocalStorage(ObjLibro);
        this.LibroArray.push(ObjLibro);
        ui.MostrarLibrosDOOM(ObjLibro);
        return this.LibroArray;
    }

    EliminarLibro(libroAEliminar){
        //Aplicamos traversing para eliminar el libro seleccionado
        const idLibro = libroAEliminar.lastElementChild.firstChild.attributes[2].value;
        libroAEliminar.remove();
        
        local.EliminarLibroLocalStorage(idLibro);
    }
}

//Clase que maneja las operaciones del local storage
class LocalStorage{

    ObtenerLibrosLocalStorage(){
        let libros;

        if(localStorage.getItem('Libros') == null){
            libros = [];
        }
        else{
            libros = JSON.parse(localStorage.getItem('Libros'));
        }

        return libros;
    }

    AgregarLibrosLocalStorage(objetoLibro){

        let libroArray;
        libroArray = this.ObtenerLibrosLocalStorage();
        libroArray.push(objetoLibro);
        localStorage.setItem('Libros', JSON.stringify(libroArray));

    }

    EliminarLibroLocalStorage(id){

        let librosLS;
        librosLS = local.ObtenerLibrosLocalStorage();

        librosLS.forEach((libro, index)=>{
            if(index == id){
                librosLS.splice(index,1);
            }
        });

        localStorage.setItem('Libros', JSON.stringify(librosLS));
        
    }
}

//Instancias
const main = new Main();
const libro = new Libros();
const ui = new Interfaz();
const local = new LocalStorage();
