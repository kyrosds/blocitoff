import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.firebase = firebase.database().ref('tasks')
    this.state = {
      tasks: []
    };
  }

  componentWillMount() {
    this.updateTasks();
  }

  updateTasks() {
    let tasksRef = this.firebase.orderByKey().limitToLast(100);
    tasksRef.on('child_added', snap => {
      let task = snap.val();
      //create a timer to remove tasks older than 7 days in milliseconds
      if(task.setTime < (Date.now() - 604800000)) {
        firebase.database().ref('tasks').child(snap.key).update({
          expired: true
        });
      }
      task.completedString = String(task.completed)
      task.expiredString = String(task.expired);
      task.id = snap.key
      this.setState({
        tasks: [task].concat(this.state.tasks)
      });
    });
  }

  addTask(e) {
    let input = this.inputEl;
    let textBody = this.textBody;
    let priority = this.priority;
    if(priority){
      e.preventDefault();
      let todo = {
        text: input.value,
        textBody: textBody.value,
        createAt: Date(),
        setTime: Date.now(),
        completed: false,
        expired: false,
        priorityLevel: priority.value
      }
      input.value = '';
      textBody.value = '';
      priority.value = 'Low';
      this.firebase.push( todo );
    }
    else {
      alert("Please fill in a task, and a priority level of either low, med, or high has been assigned.");
    }
  }

  completeTask(task) {
    this.firebase.child(task.id).update({
        completed: true
    });
    task.completed = true;

    this.updateTasks();

    this.firebase.on( 'child_changed', snap => {
      task = snap.val();
      console.log('Changed!');
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">This is a task list built with React</h1>
        </header>
        <div className="task-list">
          <form onSubmit={this.addTask.bind(this)}>
            <h3>Enter a task</h3>
            <input type="text" ref={ el => this.inputEl = el } />
            <div>
              <h4>Enter task description</h4>
              <textarea rows="6" cols="100" defaultValue='Please task description here...' ref={ el => this.textBody = el }></textarea>
            </div>
            <select ref={ el => this.priority = el }>
              <option value="Low">Low</option>
              <option value="Med">Med</option>
              <option value="High">High</option>
            </select>
            <input type="submit" value="Select Priority Level"/>
            <div className="complete-list">
              <h1>Tasks to be completed!</h1>
              <ul className="u-list">
                {
                  this.state.tasks.filter(
                  task => !task.expired && !task.completed).map(
                  task => <li className="li-list" key={task.id}>
                            <div className="label">{task.text}:</div>
                            {task.textBody}<br></br>
                            <span className="label">Created:</span>&nbsp;{task.createAt}<br></br>
                            <span className="label">Priority Level:</span>&nbsp;{task.priorityLevel}<br></br>
                            <input type="submit" value="Complete Task" onClick={() => this.completeTask(task)}/>
                          </li> )
                }
              </ul>
            </div>
            <div className="expired-list">
              <h2>Expired Tasks!</h2>
              <ul className="u-list">
                {
                  this.state.tasks.filter(
                  task => task.expired ).map(
                  task => <li className="li-list" key={task.id}>
                            <div className="label">{task.text}:</div>
                            {task.textBody}<br></br>
                            <span className="label">Created:</span>&nbsp;{task.createAt}<br></br>
                            <span className="label">Priority Level:</span>&nbsp;{task.priorityLevel}<br></br>
                            <span className="label">Expired:</span>&nbsp;{task.expiredString}
                          </li> )
                }
              </ul>
            </div>
            <div>
              <h2>Completed Tasks!</h2>
              <ul className="u-list">
                {
                  this.state.tasks.filter(
                  task => task.completed ).map(
                  task => <li className="li-list" key={task.id}>
                            <div className="label">{task.text}:</div>
                            {task.textBody}<br></br>
                            <span className="label">Created:</span>&nbsp;{task.createAt}<br></br>
                            <span className="label">Priority Level:</span>&nbsp;{task.priorityLevel}<br></br>
                            <span className="label">Completed task:</span>&nbsp;{task.completedString}
                          </li>
                  )
                }
              </ul>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
