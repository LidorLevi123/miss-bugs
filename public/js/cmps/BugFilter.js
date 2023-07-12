import { utilService } from "../services/util.service.js"

export default {
	template: `
        <fieldset class="bug-filter">
			<legend>Filter</legend>
			<input 
				placeholder="Search by title" 
				type="text" 
				v-model="filterBy.title">
			<input 
				placeholder="Search by min severity" 
				type="number" max="3" 
				v-model.number="filterBy.minSeverity">
			<input 
				placeholder="Search by label" 
				type="text" 
				v-model="filterBy.label"
				list="labels">
				<datalist id="labels">
					<option 
						v-for="label in labels" 
						:value="label">
					</option>
				</datalist>
        </fieldset>
    `,

	data() {
		return {
			filterBy: {
				title: '',
				minSeverity: '',
				label: ''
			},
			labels: ['critical', 'need-CR', 'dev-branch']
		}
	},

	created() {
		this.filter = utilService.debounce(() => {
			this.$emit('filter', this.filterBy)
		}, 600)
	},

	watch: {
		filterBy: {
			handler() {
				this.filter()
			},
			deep: true,
		},
	},
}
