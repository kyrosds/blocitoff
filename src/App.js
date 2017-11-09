import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    };
  }

  componentWillMount() {
    let tasksRef = firebase.database().ref('tasks').orderByKey().limitToLast(100);
    tasksRef.on('child_added', snap => {
      let task = {
        text: snap.val(),
        id: snap.key
      };
      this.setState({
        tasks: [task].concat(this.state.tasks)
      });
    });
  }

  addTask(e) {
    e.preventDefault();
    firebase.database().ref('tasks').push( this.inputEl.value );
    this.inputEl.value = '';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">This is a task list built with React</h1>
        </header>
        <body className="taskList">
        <form onSubmit={this.addTask.bind(this)}>
          <input type="text" ref={ el => this.inputEl = el } />
          <input type="submit" />
          <div>
            <ul>
              {
                this.state.tasks.map( task => <li key={task.id}>{task.text}</li>)
              }
            </ul>
          </div>
        </form>
        </body>
      </div>
    );
  }
}

export default App;
