<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import List from '../custom/List.vue';
import { FilterBuilder, createArrayFilter } from '../../src';

const { simpleValue: value, fields, options, data } = getData();

const filteredData = ref(data);

function applyFilter(val) {
	const filter = createArrayFilter(val);
	filteredData.value = filter(data);
}
// apply initial filter state
applyFilter(value);
</script>

<template>
	<h4 style="margin: 20px 20px 0 20px;">
		Double-click any element to edit filtering conditions
	</h4>
	<div style="padding: 0 20px;">
		<FilterBuilder
			:value="value"
			:fields="fields"
			:options="options"
			type="simple"
			:onchange="({ value }) => applyFilter(value)"
		/>
		<List :data="filteredData" />
	</div>
</template>
