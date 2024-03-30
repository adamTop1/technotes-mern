import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'

import { store } from '../app/store'
import { Provider } from 'react-redux'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ index: true, element: <Public /> },
			{ path: 'login', element: <Login /> },
			{
				path: 'dash',
				element: <DashLayout />,
				children: [
					{ index: true, element: <Welcome /> },
					{ path: 'notes', children: [{ index: true, element: <NotesList /> }] },
					{ path: 'users', children: [{ index: true, element: <UsersList /> }] },
				],
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
)
