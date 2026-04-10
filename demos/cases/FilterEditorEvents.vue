<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import { Button } from '@svar-ui/vue-core';
import { FilterEditor } from '../../src';

const { options } = getData();

const ruleValue = ref({});
const textValue = ref();
const counter = ref(0);

function setValue(rule) {
	ruleValue.value = rule;
	textValue.value = JSON.stringify(ruleValue.value, null, 2);
}

const updateTextValue = ev => {
	counter.value++;
	const newValue = ev.value;
	textValue.value = JSON.stringify(newValue, null, 2);
};
</script>

<template>
	<h4 style="margin: 20px 20px 0 20px;">Set any value and track its changes</h4>
	<div class="area">
		<div class="toolbar">
			<Button
				:onclick="() =>
					setValue({
						filter: 'beginsWith',
						value: 'A',
						includes: ['Alex'],
					})"
			>
				Value 1
			</Button>
			<Button :onclick="() => setValue({ filter: 'beginsWith', value: 'B' })">
				Value 2
			</Button>
			<Button :onclick="() => setValue({ includes: ['Agata'] })">
				Value 3
			</Button>
			<Button :onclick="() => setValue({})">Reset</Button>
		</div>

		<div class="box">
			<FilterEditor
				:buttons="false"
				:options="options.first_name"
				type="text"
				:onchange="updateTextValue"
				:includes="ruleValue.includes"
				:filter="ruleValue.filter"
				:value="ruleValue.value"
			/>
		</div>
		<div class="log">
			{{ counter }}
			updates
			<pre>{{ textValue || '' }}</pre>
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 10px;
}
.area {
	margin: 20px;
}

.box {
	max-width: 352px;
	border: 1px solid silver;
	padding: 10px;
}
</style>
