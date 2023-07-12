import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import BugFilter from '../cmps/BugFilter.js'
import BugSort from '../cmps/BugSort.js'
import BugList from '../cmps/BugList.js'

export default {
	template: `
		<section class="bug-app">
			<a href="/api/download" target="_blank">
				<img class="pdf-icon" src="img/pdf.png" alt="pdf.png" title="Download as pdf">
			</a> 
			<div class="subheader">
				<BugFilter @filter="setFilterBy"/>
				<BugSort @filter="setFilterBy"/>
				<RouterLink to="/bug/edit">
					<button class="btn-add">Add New Bug</button>
				</RouterLink> 
			</div>
			<div class="paging-toggle">
				<h4>Use Paging?</h4>
				<label class="rocker rocker-small">
					<input @change="togglePaging" type="checkbox"> 
					<span class="switch-left">Yes</span>
					<span class="switch-right">No</span>
				</label>
			</div>
			<BugList 
				v-if="bugs" 
				:bugs="bugs" 
				@remove="removeBug"/>

			<section v-show="filterBy.isPagingUsed" class="pagination">
				<button @click="changePage(-1)" class="cta">
    				<span class="hover-underline-animation"> Prev </span>
				</button>
				<span>{{ filterBy.pageIdx+1 }}</span>
				<button @click="changePage(1)" class="cta">
    				<span class="hover-underline-animation"> Next </span>
				</button>
            </section>

		</section>
    `,
	data() {
		return {
			bugs: [],
			filterBy: { 
				isPagingUsed: false,
				pageSize: 3, 
				pageIdx: 0,
				minSeverity: 0,
				title: '',
				label: '',
				sortBy: ''
			},
		}
	},
	created() {
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			bugService.query(this.filterBy)
				.then(bugs => this.bugs = bugs)
				.catch(err => {
					showErrorMsg('Cannot load bugs')
				})
		},
		removeBug(bugId) {
			bugService
				.remove(bugId)
				.then(() => {
					const idx = this.bugs.findIndex((bug) => bug._id === bugId)
					this.bugs.splice(idx, 1)
					showSuccessMsg('Bug removed')
				})
				.catch((err) => {
					showErrorMsg('Cannot remove bug')
				})
		},
		setFilterBy(filterBy) {
			this.filterBy = {
				...filterBy,
				isPagingUsed: this.filterBy.isPagingUsed,
				pageSize: 3,
				pageIdx: 0 
			}
			this.loadBugs()
		},
		changePage(dir) {
			const { pageSize, pageIdx } = this.filterBy

			if (pageIdx <= 0 && dir === -1) return
			else if (pageIdx >= Math.ceil(this.bugs.length / pageSize) && dir === 1) return

			this.filterBy.pageIdx += dir
			this.loadBugs()
		},
		togglePaging() {
			this.filterBy.isPagingUsed = !this.filterBy.isPagingUsed
			this.loadBugs()
		},
	},
	computed: {
		filteredBugs() {
			if (!this.filterBy) return this.bugs
			const regex = new RegExp(this.filterBy.title, 'i')
			return this.bugs.filter((bug) => regex.test(bug.title))
		},
	},
	components: {
		BugFilter,
		BugSort,
		BugList,
	},
}
