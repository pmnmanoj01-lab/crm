import './App.css'
import { AuthProvider } from './context/store'

import { ToastContainer} from 'react-toastify';
import AppRouter from './router/Route';
function App() {

  return (
    <AuthProvider> 
    <AppRouter/>
    <ToastContainer/>
    </AuthProvider>
  )
}

export default App
