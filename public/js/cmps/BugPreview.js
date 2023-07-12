import { userService } from "../services/user.service.js"

export default {
	props: ['bug'],
	template: `
        <li class="bug-preview">
          <span>🐛</span>
          <span>By: <RouterLink :to="'/user/' + bug.creator._id">{{ bug.creator.fullname }}</RouterLink></span>
          <h4>{{ bug.title }}</h4>
          <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
          <div class="actions">
            <RouterLink :to="'/bug/' + bug._id">Details</RouterLink>
            <RouterLink v-if="isCreator(bug)" :to="'/bug/edit/' + bug._id"> Edit</RouterLink>
          </div>
          <button v-if="isCreator(bug)" @click="onRemove(bug._id)">X</button>
        </li>
`,

	methods: {
		onRemove(bugId) {
			this.$emit('removeBug', bugId)
		},
    isCreator(bug) {
      const user = userService.getLoggedinUser()
      if(!user) return false
      if(user.isAdmin) return true
      return bug.creator._id === user._id
    }
	},
}
