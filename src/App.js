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
      let task = snap.val();
      //create a timer to remove tasks older than 7 days in milliseconds
      if(task.setTime < (Date.now() - 604800000)) {
        firebase.database().ref('tasks').child(snap.key).update({
          expired: true
        });
      };
      task.expiredString = String(task.expired);
      task.id = snap.key
      this.setState({
        tasks: [task].concat(this.state.tasks)
      });
    });
  }

  addTask(e) {
    e.preventDefault();
    let todo = {
      text: this.inputEl.value,
      createAt: Date(),
      setTime: Date.now(),
      completed: false,
      expired: false
    }
    firebase.database().ref('tasks').push( todo );
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
          <div className="completeList">
            <h1>Tasks to be completed!</h1>
            <ul className="uList">
              {
                this.state.tasks.filter(
                task => !task.expired ).map(
                task => <li className="liList" key={task.id}>
                          {task.text} - Created:
                          {task.createAt}
                        </li> )
              }
            </ul>
          </div>
          <div className="expiredList">
            <h2>Expired Tasks!</h2>
            <ul className="uList">
              {
                this.state.tasks.filter(
                task => task.expired ).map(
                task => <li className="liList" key={task.id}>
                          {task.text} - Create:
                          {task.createAt}
                        </li> )
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
