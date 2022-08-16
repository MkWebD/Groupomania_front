// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import {createVuetify} from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify(
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
    {
        icons: {
            defaultSet: 'mdi',
        },
        theme: {
            themes: {
                light: {
                    colors: {
                        primary: "#FD2D01",
                        secondary: "#FFD7D7",
                        tertiary: "#4E5166",
                    }
                }
            }
        },
    }
)
