const input = document.querySelector('input');
const ul = document.querySelector('ul');
const addBtn = document.querySelector('.add-btn');
const invalidCheck = document.querySelector('.invalid-check');
const form = document.querySelector('#form');
const totalCountSpan = document.querySelector('.total-count');
const completedCountSpan = document.querySelector('.completed-count');
const incompletedCountSpan = document.querySelector('.incompleted-count');

console.log("la vista")
//muestra el conteo total de tareas
const totalCount = () => {
	const howMany = document.querySelector('ul').children.length; 
	totalCountSpan.innerHTML = howMany;
};
//muestra el conteo de tareas completadas
const completeCount = () => {
	const howMany = document.querySelectorAll('.line-through').length;//.line-through es el indicador de completado en el lado del cliente (la Vista).
	completedCountSpan.innerHTML = howMany;
};
//muestra el conteo de tareas incompletas
const incompletedCount = () => {
	const howMany = document.querySelectorAll('ul li:not(.line-through)').length;
	incompletedCountSpan.textContent = howMany;
};
//funcion que llama a las tres funciones de conteo de tareas
const todoCount = () => {
	totalCount(); //llama al conteo total de tareas
	completeCount();//llama al conteo de tareas completadas
	incompletedCount();//llama al conteo de tareas incompletas
};

//aqui el usuario interactua con el formulario para agregar tareas nuevas


// aqui donde dice form es donde se envia la informacion al servidor para que sea guardada en la base de datos o modelonel sibmit aunque sea ovbio es el boton (+) para agregar la tarea nueva
form.addEventListener('submit', async e => {
	e.preventDefault();

	//aqui se valida si el input esta vacio o no para mostrar el borde rojo de error
	//y si el imput no esta vacio se muestra el borde violeta de exito
	
	// Check if the input is empty
	if (input.value === '') {
		input.classList.remove('focus:ring-2', 'focus:ring-violet-600');
		input.classList.add('focus:ring-2', 'focus:ring-rose-600');
		invalidCheck.classList.remove('hidden');
		return
	}

	// Remove classes and hide invalidCheck
	input.classList.remove('focus:ring-2', 'focus:ring-rose-600', 'border-2', 'border-rose-600');
	input.classList.add('focus:ring-2', 'focus:ring-violet-600');
	invalidCheck.classList.add('hidden');

	// Create list item
	const { data } = await axios.post('/api/todos/', { text: input.value })
	console.log(data);
	//este metodo axios.post envia la informacion al servidor para que sea guardada en la base de datos o model 

	//esto crea un elemento en la lista de tareas con const listItem

	//cuando ya este creado en la lista de tareas con listItem.classlist.add despues de esa linea de crea ek estu
	const listItem = document.createElement('li');
	listItem.classList.add('flex', 'flex-row');
	listItem.id = data.id;
	listItem.innerHTML = `
		<div class="group grow flex flex-row justify-between">
			<button class="delete-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<p class="p-4 break-words grow">${data.text}</p>
		</div>
		<button class="check-icon w-12 md:w-14 flex justify-center items-center cursor-pointer border-l border-slate-300 dark:border-slate-400 hover:bg-green-300 transition duration-300 easy-in-out">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		</button>
	`;



	// Append listItem
	ul.append(listItem);

	// Empty input
	input.value = ''

	todoCount();// aqui llama a la funcion todoCount para actualizar los contadores de tareas
});

ul.addEventListener('click', async e => {

	// Select delete-icon
	if (e.target.closest('.delete-icon')) {
		const li = e.target.closest('.delete-icon').parentElement.parentElement;
		await axios.delete(`/api/todos/${li.id}`);
		li.remove();
		todoCount();// aqui llama despues de eliminar la tarea 
	}

	// Select check-icon
	if (e.target.closest('.check-icon')) {
		//esto cambia el estado de la tarea que se agrege a la lista de tareas de completada a incompleta y viceversa y eso se hace con el metodo 
		// if else el que determina si la tarea esta completa tendras ciertas caracteristicas y se es falso tendra caracteristicas diferentes
		const checkIcon = e.target.closest('.check-icon');
		const listItem = checkIcon.parentElement;
		// esta parte es la que hace la peticion al servidor para actualizar el estado de la tarea de falso a verdadero o de verdadero a falso
		if (!listItem.classList.contains('line-through')) {
			await axios.patch(`/api/todos/${listItem.id}`, { checked: true });
			//actualizacion de las visas (estilos tailwindcss) cuando la tarea es completada
			checkIcon.classList.add('bg-green-400');
			checkIcon.classList.remove('hover:bg-green-300');
			listItem.classList.add('line-through', 'text-slate-400', 'dark:text-slate-600');

		} else {
			await axios.patch(`/api/todos/${listItem.id}`, { checked: false });
			checkIcon.classList.remove('bg-green-400');
			checkIcon.classList.add('hover:bg-green-300');
			listItem.classList.remove('line-through', 'text-slate-400', 'dark:text-slate-600');
		}
		

		// Save in local storage
		todoCount();// aqui se invoca la funcion todoCount para actualizar los contadores de tareas
		localStorage.setItem('todoList', ul.innerHTML);
	}
});

( async () => {
	try {
		console.log("antes de data")
		//solicita las tareas al servidor para mostrarlas en la vista
		const { data } = await axios.get('/api/todos', {
			
			withCredentials : true
			
		});
		console.log(data)
		// Render todas las tareas obtenidas desde el servidor
		data.forEach(todo => {
			const listItem = document.createElement('li');
			listItem.id = todo.id;
			listItem.classList.add('flex', 'flex-row');
			listItem.innerHTML = `
				<div class="group grow flex flex-row justify-between">
					<button class="delete-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					<p class="p-4 break-words grow">${todo.text}</p>
				</div>
				<button class="check-icon w-12 md:w-14 flex justify-center items-center cursor-pointer border-l border-slate-300 dark:border-slate-400 hover:bg-green-300 transition duration-300 easy-in-out">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</button>
			`;
			if (todo.checked) {
				listItem.children[1].classList.add('bg-green-400');
				listItem.children[1].classList.remove('hover:bg-green-300');
				listItem.classList.add('line-through', 'text-slate-400', 'dark:text-slate-600');
			} else {
				listItem.children[1].classList.remove('bg-green-400');
				listItem.children[1].classList.add('hover:bg-green-300');
				listItem.classList.remove('line-through', 'text-slate-400', 'dark:text-slate-600');
			}

			ul.append(listItem);
		});
		todoCount();
		//en dado caso de que haya un error redirige al usuario a la pagina de login y muestra el error en la consola
	} catch (error) {
		 window.location.pathname = '/login';
		console.log(error)
	}
})();


//el metodo post es para crear nuevas tareas
//el metodo get es para obtener las tareas creadas
//el metodo delete es para eliminar las tareas creadas
//el metodo patch es para actualizar el estado de las tareas creadas


//aprender de mejor manera y edintificar el codigo y comentar donde se conecta cada cosa que solicita la informacion donde se solicita la informacion donde se crea con el modelo de vista controlodar y aparte
//crear un diagrama de flujo para entender mejor el proceso de creacion de tareas y demas funcionalidades
//crear un diagrama de flujo para entender mejor el proceso de creacion de tareas y demas funcionalidades
//anotarlo en el cuaderno para poder identificar de mejor manera el proceso y entender mejor el codigo y su funcionamiento
//hacer un repaso general de todo el codigo para entender mejor su funcionamiento y poder identificar de mejor manera las funcionalidades y demas procesos que se realizan en el codigo