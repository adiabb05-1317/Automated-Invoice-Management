import React from 'react';
import './App.css'
import {Provider} from 'react-redux';
import store from './store/store'
import MainLayout from './Layouts/MainLayout'



function App() {
  return (
    <Provider store={store}>
       <div className="App">
           <MainLayout/>
       </div>
    </Provider>
  );
}

export default App;
