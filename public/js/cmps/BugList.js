import BugPreview from './BugPreview.js'

export default {
	props: ['bugs'],
	template: `
    	<ul v-if="bugs.length" class="bug-list">                    
      		<BugPreview v-for="bug in bugs" :bug="bug" :key="bug._id" @removeBug="$emit('remove', $event)" />
		</ul>
    	<section v-else class="bug-none">Yay! No Bugs!</section>
    `,
	components: {
		BugPreview,
	},
}
