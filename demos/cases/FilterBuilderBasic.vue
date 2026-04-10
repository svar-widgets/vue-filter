<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import List from '../custom/List.vue';
import { FilterBuilder, createArrayFilter } from '../../src';

const { value, fields, options, data } = getData();

const filteredData = ref(data);

function applyFilter(val) {
	const filter = createArrayFilter(val);
	filteredData.value = filter(data);
}
// apply initial filter state
applyFilter(value);
</script>

<template>
	<div class="demo">
		<h4 style="margin: 20px 20px 0 20px;">
			Double-click any line to edit filtering conditions
		</h4>
		<div class="layout">
			<div class="filter">
				<FilterBuilder
					:value="value"
					:fields="fields"
					:options="options"
					:onchange="({ value }) => applyFilter(value)"
				/>
			</div>
			<div class="list">
				<List :data="filteredData" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
.layout {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	min-height: 600px;
}
.filter {
	padding: 20px;
	min-width: 420px;
	flex: 0;
}
.list {
	flex: 1;
}
</style>
