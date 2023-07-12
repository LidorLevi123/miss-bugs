import { utilService } from "../services/util.service.js"

export default {
    template: `
        <section class="bug-sort">
            <select v-model="filterBy.sortBy" id="sort-select">
                <option value="">Sort by</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Time Created</option>
            </select>
            <label for="sort-descending">Descending</label>
            <input v-model="filterBy.isDescending" type="checkbox" id="sort-descending" />
        </section>
    `,

    data() {
        return {
            filterBy: {
                sortBy: '',
                isDescending: false
            }
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