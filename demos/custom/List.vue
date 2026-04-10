<script setup>
defineOptions({ name: 'FilterDemoList' });

defineProps({
	data: { default: () => [] },
});
</script>

<template>
	<div class="block">
		<div v-for="row in data" :key="row.first_name + row.last_name" class="row">
			<h3>{{ row.first_name }} {{ row.last_name }}</h3>
			<p>Age: {{ row.age }}</p>
		</div>
	</div>
</template>

<style scoped>
.block {
	margin: 20px;
}
.row {
	color: var(--wx-color-font-alt);
}
.row h3 {
	font-size: var(--wx-font-size-hd);
	margin-bottom: 0px;
}
.row p {
	margin-top: 0px;
}
</style>
