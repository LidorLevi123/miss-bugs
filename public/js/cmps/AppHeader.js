import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

import LoginSignup from "./LoginSignup.js"

export default {
	template: `
        <header>
            <h1>Miss Bug</h1>
            <div class="user-login-container">
                <section v-if="user">
                    <p>Welcome {{ user.fullname }}</p>   
                    <button @click="logout">Logout</button>
                </section>
                <section v-else>
                    <LoginSignup @setUser="onSetUser" />
                </section>
            </div>
        </header>
    `,

    data() {
        return {
            user: userService.getLoggedinUser()
        }
    },

    methods: {
        onSetUser(user) {
            this.user = user
        },
        logout() {
            userService.logout()
                .then(()=> {
                    this.user = null
                    this.$router.push('/abcdefg')
                    setTimeout(()=> {
                        this.$router.push('/')
                    }, 30)
                })
                .catch(err => {
                    console.error('Cannot logout', err)
                    showErrorMsg('Cannot logout')
                })
        }
    },

    components: {
        LoginSignup
    }
}
