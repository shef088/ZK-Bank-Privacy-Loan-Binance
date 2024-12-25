 
import "./App.css";
import { Provider } from "react-redux";
import store from "./store/store";
import Router from "./Router"
import { ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
   

  return (
    <Provider store={store}>
       <ToastContainer position="top-left" />
    <Router />
    </Provider>
  );
};

export default App;
