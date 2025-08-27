import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//layouts
import RootLayout from './layouts/RootLayout';
import './App.css';

//pages
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import ArticlePage from './pages/ArticlePage';
import { articleLoader } from './pages/articleLoader';
import ArticlesLayout from './layouts/ArticlesLayout';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import { profileLoader } from './pages/profileLoader';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';

//components
import Loader from './components/Loader';
import { ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route
        path="profile/:slug"
        loader={profileLoader}
        hydrateFallbackElement={
          <div style={{ textAlign: 'center', marginTop: '118px' }}>
            <Loader />
          </div>
        }
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="new-article"
        element={
          <ProtectedRoute>
            <NewArticle />
          </ProtectedRoute>
        }
      />

      <Route path="/articles" element={<ArticlesLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route
          path=":slug"
          element={<ArticlePage />}
          loader={articleLoader}
          hydrateFallbackElement={
            <div style={{ textAlign: 'center', marginTop: '118px' }}>
              <Loader />
            </div>
          }
        />
        <Route
          path=":slug/edit"
          element={<EditArticle />}
          loader={articleLoader}
          hydrateFallbackElement={
            <div style={{ textAlign: 'center', marginTop: '118px' }}>
              <Loader />
            </div>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
