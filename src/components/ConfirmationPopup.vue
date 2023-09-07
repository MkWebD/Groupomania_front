<template>
	<div class="confirmation-dialog">
		<p>{{ message }}</p>
		<button @click="onConfirm">Yes</button>
		<button @click="onCancel">No</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{ message: string; onConfirm: () => void; onCancel: () => void }>();
const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
	emit("confirm");
};

const onCancel = () => {
	emit("cancel");
};
</script>
