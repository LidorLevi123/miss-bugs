import BugIndex from '../pages/BugIndex.js'
import BugEdit from '../pages/BugEdit.js'
import BugDetails from '../pages/BugDetails.js'

const { createRouter, createWebHashHistory } = VueRouter

const options = {
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: '/bug',
		},
		{
			path: '/bug',
			component: BugIndex,
		},
		{
			path: '/bug/:bugId',
			component: BugDetails,
		},
		{
			path: '/bug/edit/:bugId?',
			component: BugEdit,
		},
	],
}
export const router = createRouter(options)
