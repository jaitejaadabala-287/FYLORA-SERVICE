import { RouterProvider } from 'react-router-dom';
import router from './router';
import './styles/global.css';
import './styles/components.css';

export default function App() {
  return <RouterProvider router={router} />;
}
