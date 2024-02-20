import {PluginOptions, POSITION} from "vue-toastification";

const options: PluginOptions = {
    timeout: 3000,
    position: POSITION.BOTTOM_LEFT,
    maxToasts: 5,
    newestOnTop: true,
    pauseOnHover: false,
    hideProgressBar: true
}

export default options