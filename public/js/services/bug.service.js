// FRONTEND SERVICE
const BASE_URL = '/api/bug/'

export const bugService = {
	query,
	get,
	getEmptyBug,
	save,
	remove,
}

window.bugService = bugService

function query(filterBy = {}) {
	return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function get(bugId) {
	return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
	return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
	if(bug._id) {
		return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
	} else {
		return axios.post(BASE_URL, bug).then(res => res.data)
	}
}

function getEmptyBug(title = '', severity = '') {
	return {
		_id: '',
		title,
		severity,
		labels: []
	}
}