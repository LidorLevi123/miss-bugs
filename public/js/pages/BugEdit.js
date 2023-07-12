import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export default {
	template: `
    <section v-if="bugToEdit" class="bug-edit">
        <h1>{{(bugToEdit._id) ? 'Edit Bug': 'Add Bug'}}</h1>
        <form @submit.prevent="save">
            <label> 
                <span>Title: </span>
                <input type="text" v-model="bugToEdit.title" placeholder="Enter title...">
            </label>
            <label> 
                <span>Description: </span>
                <input type="text" v-model="bugToEdit.description" placeholder="Enter description...">
            </label>
            <label>
                <span>Severity: </span>
                <input type="number" v-model="bugToEdit.severity" placeholder="Enter severity..." min="0" max="3">
            </label>
            <label>
                <span>Labels: </span>
				<div class="labels">
					<div><input class="check-box" type="checkbox" @input="addLabel" value="critical">critical</div>
					<div><input class="check-box" type="checkbox" @input="addLabel" value="need-CR">need-CR</div>
					<div><input class="check-box" type="checkbox" @input="addLabel" value="dev-branch">dev-branch</div>
				</div>
            </label>
            <div class="actions">
              <button type="submit"> {{(bugToEdit._id) ? 'Save': 'Add'}}</button>
              <button @click.prevent="closeEdit">Close</button>
            </div>
        </form>
    </section>
    `,
	data() {
		return {
			bugToEdit: null,
		}
	},

	created() {
		const { bugId } = this.$route.params
		if (!bugId) this.bugToEdit = bugService.getEmptyBug()
		else {
			bugService
				.get(bugId)
				.then((bug) => {
					this.bugToEdit = bug
				})
				.catch(() => {
					showErrorMsg('Cannot load bug for edit')
					this.$router.push('/bug')
				})
			}
	},

	mounted() {
		setTimeout(()=> {
			const elCheckBoxes = document.querySelectorAll('.bug-edit .check-box')
			elCheckBoxes.forEach(checkBox => {
				checkBox.checked = this.bugToEdit.labels.includes(checkBox.value) ? true : false
			})
		}, 80)
	},

	methods: {
		save() {
			bugService
				.save(this.bugToEdit)
				.then(() => {
					showSuccessMsg('Bug saved')
					this.$router.push('/bug')
				})
				.catch(() => {
					showErrorMsg('Cannot save bug')
				})
		},
		closeEdit() {
			this.$router.push('/bug')
		},
		addLabel(ev) {
			const label = ev.target.value
			const isChecked = ev.target.checked

			if(isChecked && !this.bugToEdit.labels.includes(label)) {
				this.bugToEdit.labels.push(label)
			} else if(!isChecked && this.bugToEdit.labels.includes(label)) {
				const labelIdx = 
					this.bugToEdit.labels.findIndex(currLabel => 
						currLabel === label)

				this.bugToEdit.labels.splice(labelIdx, 1)
			}
		},
	},
}
