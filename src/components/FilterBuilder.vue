<script setup>
// vue core
import { provide, watch } from 'vue';
import { writable } from '@svar-ui/lib-vue';

// components
import Layout from './Layout.vue';

// core widgets lib
import { Locale } from '@svar-ui/vue-core';
import { en } from '@svar-ui/filter-locales';

// stores
import { EventBusRouter } from '@svar-ui/lib-state';
import { DataStore } from '@svar-ui/filter-store';

const props = defineProps({
	value: { default: () => ({ glue: 'and', rules: [] }) },
	fields: { default: () => [] },
	options: { default: null },
	type: { default: 'list' },
	init: { default: null },
	// event callbacks
	onaddfilter: { type: Function },
	onremovefilter: { type: Function },
	onupdatefilter: { type: Function },
	onchange: { type: Function },
});

// init stores
const dataStore = new DataStore(writable);

// define event route
let firstInRoute = dataStore.in;

const dash = /-/g;
let lastInRoute = new EventBusRouter((a, b) => {
	const name = 'on' + a.replace(dash, '');
	if (props[name]) {
		props[name](b);
	}
});
firstInRoute.setNext(lastInRoute);

// public API
const getState = dataStore.getState.bind(dataStore);
const getReactiveState = dataStore.getReactive.bind(dataStore);
const getStores = () => ({ data: dataStore });
const exec = firstInRoute.exec;
const setNext = ev => (lastInRoute = lastInRoute.setNext(ev));
const intercept = firstInRoute.intercept.bind(firstInRoute);
const on = firstInRoute.on.bind(firstInRoute);
const detach = firstInRoute.detach.bind(firstInRoute);
const getValue = dataStore.getValue.bind(dataStore);

const api = {
	exec,
	setNext,
	intercept,
	on,
	detach,
	getState,
	getReactiveState,
	getStores,
	getValue,
};

// common API available in components
provide('wx-filter-store', {
	getState: dataStore.getState.bind(dataStore),
	getReactiveState: dataStore.getReactive.bind(dataStore),
	exec: firstInRoute.exec.bind(firstInRoute),
});

// Synchronous first initialization
dataStore.init({
	value: props.value,
	fields: props.fields,
	options: props.options,
});
if (props.init) {
	props.init(api);
}

// Watch for prop changes (not immediate - avoids double init)
watch(
	() => [props.value, props.fields, props.options],
	() => {
		dataStore.init({
			value: props.value,
			fields: props.fields,
			options: props.options,
		});
	}
);

defineExpose({
	getState,
	getReactiveState,
	getStores,
	exec,
	setNext,
	intercept,
	on,
	detach,
	getValue,
});
</script>

<template>
	<Locale :words="en" :optional="true">
		<Layout :type="type" />
	</Locale>
</template>
