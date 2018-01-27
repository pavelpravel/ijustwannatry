import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import {createStore} from 'redux';
import {combineReducers} from 'redux';
import React, {Component} from 'react';
import MotionMenu from './MenuFrom';

const Todo = ({onClick, completed, text}) => (<li onClick={onClick} style={{
    textDecoration: completed
      ? 'line-through'
      : 'none'
  }}>
  {text}
</li>);

const TodoList = ({todos, onTodoClick}) => (<ul>
  {todos.map(todo => <Todo key="todo.id" {...todo} onClick={() => onTodoClick(todo.id)}/>)}
</ul>);

const AddTodo = () => {
  let input;
  return (<div>
    <input ref={node => {
        input = node;
      }}/>
    <button onClick={() => {
      store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = '';
      }}>
      Add Todo
    </button>
  </div>)
};



const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {id: action.id, text: action.text, completed: false};
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({todos, visibilityFilter});

const store = createStore(todoApp);

const Footer = () => (<p>
  Show: {' '}
  <FilterLink filter='SHOW_ALL' >
    All
  </FilterLink>
  {' '}
  <FilterLink filter='SHOW_ACTIVE' >
    Active
  </FilterLink>
  {' '}
  <FilterLink filter='SHOW_COMPLETED' >
    Completed
  </FilterLink>
</p>);


const Link = ({active, children, onClick}) => {
  if (active) {
    return <span>{children}</span>
  }
  return (<a href='#' onClick={e => {
      e.preventDefault();
      onClick();
    }}>
    {children}
  </a>)
};

class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );
  }
};

class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  // Since the subscription happens in `componentDidMount`,
  // it's important to unsubscribe in `componentWillUnmount`.
  componentWillUnmount() {
    this.unsubscribe(); // return value of `store.subscribe()`
  }
  render () {
    const props = this.props;
    // this just reads the store, is not listening
    // for change messages from the store updating
    const state = store.getState();

    return (
      <Link
        active={
          props.filter ===
          state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      // Use the `Array.filter()` method
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
}

let nextTodoId = 0;
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList/>
    <Footer />
  <MotionMenu
    type="circle"
    margin={120}
   >
     <div className="button">
     <i className="fa fa-bars" >first </i>

   </div>
   <div className="button">
     <i className="fa fa-cogs" />

   </div>
   <div className="button">
     <i className="fa fa-cloud" />
   </div>
   <div className="button">
     <i className="fa fa-home" />
   </div>
 </MotionMenu>
);

  </div>)

ReactDOM.render(<TodoApp />, document.getElementById('root'))
