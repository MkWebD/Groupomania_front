<template>
	<div class="fill-height main-bg">
		<v-container class="main">
			<div class="main__content">
				<input type="checkbox" class="main__content--checkbox" id="check" aria-hidden="true" />

				<div class="signup">
					<VeeForm v-slot="{ handleSubmit }" :validation-schema="signUpSchema" as="div">
						<form @submit="handleSubmit($event, onSignUp)">
							<label class="signup__label" for="check" aria-hidden="true">Sign up</label>
							<Field
								class="auth__input"
								:class="{ 'is-invalid': signUpEmailError }"
								v-model="signUpEmail"
								name="signUpEmail"
								type="email"
								placeholder="Email"
							/>
							<div>
								<p class="email__error" :class="{ 'is-invalid': signUpUserError }" v-if="signUpUserError">
									{{ signUpUserError }}
								</p>
							</div>
							<Field
								class="auth__input"
								v-model="signUpPassword"
								:class="{ 'is-invalid': signUpPassword && signUpPasswordError }"
								type="password"
								name="signUpPassword"
								placeholder="Password"
							/>
							<div class="password__error">
								<p class="password__hint" :class="{ 'is-valid': signUpPassword?.match(/^.{8,12}$/) }">
									{{ passWordErrorsMessages.length }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': signUpPassword?.match(/^(?=.*[A-Z])/) }">
									{{ passWordErrorsMessages.uppercase }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': signUpPassword?.match(/^(?=.*[a-z])/) }">
									{{ passWordErrorsMessages.lowercase }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': signUpPassword?.match(/\d/) }">
									{{ passWordErrorsMessages.number }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': signUpPassword?.match(/[@$!%*#?&]/) }">
									{{ passWordErrorsMessages.specialCharacter }}
								</p>
							</div>
							<button class="login__button">Sign up</button>
						</form>
					</VeeForm>
				</div>

				<div class="login">
					<VeeForm v-slot="{ handleSubmit }" :validation-schema="logInSchema" as="div">
						<form @submit="handleSubmit($event, onlogIn)">
							<label class="login__label" for="check" aria-hidden="true">Log in</label>
							<Field
								class="auth__input"
								:class="{ 'is-invalid': logInEmailError }"
								v-model="logInEmail"
								name="logInEmail"
								type="email"
								placeholder="Email"
							/>
							<div>
								<p class="password__error" :class="{ 'is-invalid': logInUserError }" v-if="logInUserError">
									{{ logInUserError }}
								</p>
							</div>
							<Field
								class="auth__input"
								v-model="logInPassword"
								:class="{ 'is-invalid': logInPassword && logInPasswordError }"
								type="password"
								name="logInPassword"
								placeholder="Password"
							/>
							<div class="password__error">
								<p class="password__hint" :class="{ 'is-valid': logInPassword?.match(/^.{8,12}$/) }">
									{{ passWordErrorsMessages.length }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': logInPassword?.match(/^(?=.*[A-Z])/) }">
									{{ passWordErrorsMessages.uppercase }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': logInPassword?.match(/^(?=.*[a-z])/) }">
									{{ passWordErrorsMessages.lowercase }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': logInPassword?.match(/\d/) }">
									{{ passWordErrorsMessages.number }}
								</p>
								<p class="password__hint" :class="{ 'is-valid': logInPassword?.match(/[@$!%*#?&]/) }">
									{{ passWordErrorsMessages.specialCharacter }}
								</p>
							</div>
							<button class="login__button">Log in</button>
						</form>
					</VeeForm>
				</div>
			</div>
		</v-container>
	</div>
</template>

<script setup lang="ts">
// Importing required etruexternal resources
import { Field, Form as VeeForm, useField } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as yup from "yup";
import "../../assets/styles/authForm.scss";
import "./AuthenticationStyles.scss";

// Creating router variables
const router = useRouter();
const store = useStore();
const signUpUserError = ref("");
const logInUserError = ref("");
const serverUrl = "https://server.kevinmas.com/groupomania/api";

const yupPasswordValidationSchema = yup
	.string()
	.min(8)
	.max(12)
	.matches(/\d/)
	.matches(/[a-z]/)
	.matches(/[A-Z]/)
	.matches(/[@$!%*#?&]/);

const { value: signUpEmail, errorMessage: signUpEmailError } = useField("signUpEmail", yup.string().email());
const { value: signUpPassword, errorMessage: signUpPasswordError } = useField(
	"signUpPassword",
	yupPasswordValidationSchema
);

const signUpSchema = yup.object({
	signUpEmail: yup.string().required().email(),
	signUpPassword: yupPasswordValidationSchema,
});

const { value: logInEmail, errorMessage: logInEmailError } = useField("logInEmail", yup.string().email());
const { value: logInPassword, errorMessage: logInPasswordError } = useField(
	"logInPassword",
	yupPasswordValidationSchema
);

const logInSchema = yup.object({
	logInEmail: yup.string().required().email(),
	logInPassword: yupPasswordValidationSchema,
});

const login = () => {
	store.dispatch("login");
};

const fetchData = (formData: unknown, authenticationType: "login" | "signup") => {
	const fetchRequestOptions: { method: string; mode: "cors"; headers: { "Content-Type": string }; body: string } = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	};
	const responseStatus = authenticationType === "login" ? 200 : 201;
	const errorMessage = authenticationType === "login" ? "User doesn't exist !" : "User already exists !";
	fetch(`${serverUrl}/auth/${authenticationType}`, fetchRequestOptions)
		.then((res) => {
			if (res.status === responseStatus) {
				return res.json();
			}
		})
		.then((data) => {
			if (!data) {
				return authenticationType === "signup"
					? (signUpUserError.value = errorMessage)
					: (logInUserError.value = errorMessage);
			}
			localStorage.setItem("user", JSON.stringify(data));
			login();
			router.push({ name: "home" });
		})
		.catch((err) => console.error(err.message));
};

function onSignUp(values: unknown) {
	const formValues = values as { signUpEmail: string; signUpPassword: string };
	const payload = { email: formValues.signUpEmail, password: formValues.signUpPassword };

	fetchData(payload, "signup");
}

function onlogIn(values: unknown) {
	const formValues = values as { logInEmail: string; logInPassword: string };
	const payload = { email: formValues.logInEmail, password: formValues.logInPassword };

	fetchData(payload, "login");
}

const passWordErrorsMessages = {
	length: "Must have 8 to 12 characters",
	uppercase: "Must have one uppercase letter",
	lowercase: "Must have one lowercase letter",
	number: "Must have one number",
	specialCharacter: "Must have one special character",
};
</script>
