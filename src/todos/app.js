import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderPending } from './user-cases';
import { renderTodos } from './user-cases/render-todos';


const elementIds = {
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count' 

}



/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {
    
    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrenFilter());
        renderTodos(elementIds.TodoList, todos);
        updatePendingCount();

    }

    const updatePendingCount = () => {
        renderPending(elementIds.PendingCountLabel)
    }


    // Cuando la funcion App() se llama

    (() => {
        const App = document.createElement('div');
        App.innerHTML = html;
        document.querySelector(elementId).append(App);
        displayTodos();



    })();

    // Referencias HTML 
    const NewDescriptionInput = document.querySelector(elementIds.NewTodoInput);
    const todoListUl = document.querySelector(elementIds.TodoList);
    const clearCompletedButton = document.querySelector(elementIds.ClearCompletedButton);
    const filtersLis = document.querySelectorAll(elementIds.TodoFilters);

    // Listeners 
    NewDescriptionInput.addEventListener('keyup', (e) => {
        if ( e.keyCode !== 13 ) return;
        if (e.target.value.trim().length === 0) return;

        todoStore.addTodo(e.target.value);
        displayTodos();
        e.target.value = '';

    })

    todoListUl.addEventListener('click', (e) => {
        const element = e.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();

    })

    todoListUl.addEventListener('click', (e) => {
        const isDestroyElement = e.target.className === 'destroy';
        const element = e.target.closest('[data-id]');
        if ( !element || !isDestroyElement ) return; 
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    clearCompletedButton.addEventListener('click', (e) => {
        todoStore.deleteCompleted();
        displayTodos();
    })

    filtersLis.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLis.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text){
                case 'Todos': 
                todoStore.setFilter(Filters.All)
                break;
                case 'Pendientes': 
                todoStore.setFilter(Filters.Pending)
                break;
                case 'Completados': 
                todoStore.setFilter(Filters.Completed)
                break;
            };

            displayTodos();



        });

    });

};