import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyDpfdVJnQZvyrJ9Oz1kCl4S-3iN97uZ9zo",
    authDomain: "blocitoff-c5fb1.firebaseapp.com",
    databaseURL: "https://blocitoff-c5fb1.firebaseio.com",
    projectId: "blocitoff-c5fb1",
    storageBucket: "blocitoff-c5fb1.appspot.com",
    messagingSenderId: "488274149986"
  };
  firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

registerServiceWorker();
