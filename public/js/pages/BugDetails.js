import { bugService } from '../services/bug.service.js'

export default {
	template: `
    <section v-if="bug" class="bug-details">
		<h1>{{ bug.title }}</h1>
		<span class="labels">{{ bug.labels.join(', ') }}</span>
		<p>{{ bug.description }} </p>
        <span :class='"severity" + bug.severity'>Severity: {{ bug.severity }}</span>
        <RouterLink to="/bug">Back</RouterLink>
    </section>
    `,
	data() {
		return {
			bug: null,
		}
	},
	created() {
		const { bugId } = this.$route.params
		bugService
			.get(bugId)
			.then((bug) => {
				this.bug = bug
			})
			.catch((err) => {
				alert('Hold your horses mate')
				this.$router.push('/bug')
			})
	},
}
