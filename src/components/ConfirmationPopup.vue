<template>
	<div class="overlay">
		<div class="dialog">
			<p class="dialog__message">{{ message }}</p>
			<div class="dialog__buttons">
				<button class="dialog__buttons--confirm" @click="onConfirm">Yes</button>
				<button class="dialog__buttons--cancel" @click="onCancel">No</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import "./ConfirmationPopup.scss";
defineProps<{ message: string; onConfirm: () => void; onCancel: () => void }>();
const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
	emit("confirm");
};

const onCancel = () => {
	emit("cancel");
};
</script>
