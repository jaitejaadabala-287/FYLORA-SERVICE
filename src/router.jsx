import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import UniversalConverterPage from './pages/UniversalConverterPage';
import AllToolsPage from './pages/AllToolsPage';
import CategoryPage from './pages/CategoryPage';
import ToolPage from './pages/ToolPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'convert', element: <UniversalConverterPage /> },
      { path: 'tools', element: <AllToolsPage /> },
      { path: 'tools/:categoryId', element: <CategoryPage /> },
      { path: 'tools/:categoryId/:toolId', element: <ToolPage /> },
    ],
  },
]);

export default router;
