import LoginPage from './pages/auth/login/LoginPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
const apiUrl = ''

function App() {
	const {data:authUser, isLoading} = useQuery({
		queryKey: ['authUser'],
		queryFn:async()=>{
			try {
				const res = await fetch(apiUrl+"/api/auth/me", {
					credentials: 'include',
				});
				const data = await res.json()
				if(data.error)return null;
				if(!res.ok){
					throw new Error(data.error || "Something went wrong")
				}
				// console.log("authuser is here", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry:false
	})
	if(isLoading){
		return(
			<div className='h-screen flex justify-center'>
				<LoadingSpinner size='lg'/>
			</div>
		)
	}
  return (
    <div className='flex max-w-6xl mx-auto'>
      	{authUser && <Sidebar/>}
			<Routes>
				<Route path='/' element={authUser ? <HomePage />:<Navigate to="/login"/>} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to = "/"/>} />
				<Route path='/signup' element={!authUser ?<SignUpPage /> : <Navigate to = "/"/>} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login"/>} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
			</Routes>
		{authUser && <RightPanel/>}
		<Toaster/>
	</div>
  )
}

export default App
