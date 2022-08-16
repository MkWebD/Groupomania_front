<template>
    <div class="fill-height">
        <v-container>
            <v-form @submit="onSubmit" class="add-form">
                <v-container class="border rounded-lg">
                    <h1 class="text-center text-tertiary mb-2">Please enter E-mail and password to sign up</h1>
                    <v-divider/>
                    <div class="d-flex flex-column flex-sm-row">
                        <div class="back-image"></div>
                        <v-container class="back-form">
                            <v-row class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-text-field
                                            class="form-control email"
                                            color="primary"
                                            name="email"
                                            v-model="email"
                                            type="email"
                                            label="E-mail"
                                            variant="solo"
                                            placeholder="Enter your e-mail address"
                                            :error-messages="emailError"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                            color="primary"
                                            v-model="password"
                                            type="password"
                                            label="Password"
                                            variant="solo"
                                            placeholder="Enter your password"
                                            name="password"
                                            :error-messages="passwordError"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="8" md="8">
                                    <v-btn type="submit" append>
                                        Sign Up
                                        <v-icon icon="mdi-send"></v-icon>
                                    </v-btn>

                                </v-col>
                                <v-row v-if="userError">{{userError}}</v-row>
                            </v-row>
                        </v-container>
                    </div>
                </v-container>
            </v-form>
        </v-container>
    </div>
</template>

<script setup lang="ts">
    // Importing required external resources
    import {useStore} from 'vuex'
    import {useRouter} from "vue-router"
    import {useField, useForm} from "vee-validate"
    import * as yup from 'yup'
    import '../../assets/styles/authForm.scss'
    import {ref} from 'vue'

    // Creating environment variables
    const router = useRouter()
    const store = useStore()
    const {handleSubmit} = useForm()
    const userError = ref("")

    // Creating function for signing in
    const onSubmit = handleSubmit(values => {
        const formData = new FormData;
        formData.append('email', values.email)
        formData.append('password', values.password)

        const serverUrl = "http://localhost:8080/api/auth/signup"
        const requestOptions: { method: string, mode: 'cors', headers: { "Content-Type": string }, body: string } = {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values)
        };
        const login = () => {
            store.dispatch('login')
        }

        fetch(serverUrl, requestOptions)
            .then(res => {
                if (res.status === 201) {
                    return res.json()
                }
            })
            .then(data => {
                if(!data) {
                    return userError.value = 'User already exists !'
                }
                localStorage.setItem('user', JSON.stringify(data))
                login()
                router.push({name: 'home'})
            })
            .catch(err => console.error(err.message))

    })

    const {value: email, errorMessage: emailError} = useField('email',
        yup.string()
            .email("Your e-mail must be valid")
            .required("You must enter an email"))

    const {value: password, errorMessage: passwordError} = useField('password',
        yup.string()
            .required("You must enter a password")
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/,
                "Must contain between 8 & 12 characters, One uppercase, One lowercase, One number and One special character")
    )

</script>