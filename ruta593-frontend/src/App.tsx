import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/cooperative';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import BusRegistration from './pages/Registration/bus.registration';
import RoutesRegistration from './pages/Processes/routes.processes';
import TypebusRegistration from './pages/Registration/typebus.registration';
import TicketsalesRegistration from './pages/Processes/ticketsales.processes';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import FrequencyRegistration from './pages/Processes/frequency.processes';
import TicketSeriesRegistration from './pages/Registration/tickets.registration';
import BusStationRegistration from './pages/Registration/busStation.registration';
import FrequencyList from './pages/Processes/frequencyList.processes';
import ProtectedRoute from './utils/protectedRoute.utils';
import LinkStationsRegistration from './pages/Registration/linkStations.registration';
import { authInterceptor } from './hooks/useInterceptor';
import TypeSeats from './pages/Registration/typeSeats.registration';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  //user authenticated?
  const { authUser } = useAuthContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Condición para determinar si aplicar o no DefaultLayout
  const isAuthRoute = pathname === '/auth/signin';

  return loading ? (
    <Loader />
  ) : (
    <>
      {isAuthRoute ? (
        <>
          <Routes>
            <Route
              path="/auth/signin"
              element={
                authUser ? <Navigate to='/' /> :
                  <>
                    <PageTitle title="Signin | ruta593" />
                    <SignIn />
                  </>
              }
            />
          </Routes>
          <Toaster />
        </>
      ) : (
        <DefaultLayout>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="eCommerce Dashboard | ruta593" />
                    <ECommerce />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <PageTitle title="Cooperativa | ruta593" />
                    <Profile />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <>
                    <PageTitle title="Settings | ruta593" />
                    <Settings />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <>
                    <PageTitle title="Signin | ruta593" />
                    <SignUp />
                  </>
                </ProtectedRoute>
              }
            />
            {/* Added by me  */}
            <Route
              path="/register/bus"
              element={

                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Bus | ruta593" />
                    <BusRegistration />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/processes/routes"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Routes | ruta593" />
                    <RoutesRegistration />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register/busStations"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="BusStations| ruta593" />
                    <BusStationRegistration />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register/typebus"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <>
                    <PageTitle title="Typebus| ruta593" />
                    <TypebusRegistration />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register/tickets"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Tickets| ruta593" />
                    <TicketSeriesRegistration />
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/processes/ticketsales"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Ticketsales| ruta593" />
                    <TicketsalesRegistration />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/processes/frequency"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Frecuencias Creación | ruta593" />
                    <FrequencyRegistration />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/processes/frequency-list"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Frecuencias de selección | ruta593" />
                    <FrequencyList />
                  </>
                </ProtectedRoute>

              }
            />
            <Route
              path="/register/linkStations"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Enlazar estaciones | ruta593" />
                    <LinkStationsRegistration />
                  </>
                </ProtectedRoute>

              }
            />
            <Route
              path="/register/typeSeats"
              element={
                <ProtectedRoute requiredRole={['admin', 'clerk']}>
                  <>
                    <PageTitle title="Tipos De Asientos | ruta593" />
                    <TypeSeats />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </DefaultLayout>
      )}
    </>
  );
}

export default authInterceptor(App);
