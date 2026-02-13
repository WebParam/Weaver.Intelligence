/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter, Navigate } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Environments = lazy(() => import('pages/environments'));
const Policies = lazy(() => import('pages/policies'));
const Agents = lazy(() => import('pages/agents'));
const Artifacts = lazy(() => import('pages/artifacts'));
const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Navigate to={paths.dashboard} replace />,
            },
            {
              path: paths.dashboard,
              element: <Dashboard />,
            },
            {
              path: paths.environments,
              element: <Environments />,
            },
            {
              path: paths.policies,
              element: <Policies />,
            },
            {
              path: paths.agents,
              element: <Agents />,
            },
            {
              path: paths.artifacts,
              element: <Artifacts />,
            },
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.login,
              element: <Login />,
            },
            {
              path: paths.signup,
              element: <Signup />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: '/',
  },
);

export default router;
