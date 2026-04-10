<script setup>
import { Locale } from '@svar-ui/vue-core';
import { en } from '@svar-ui/filter-locales';
import Layout from './Layout.vue';

const props = defineProps({
	fields: { default: () => [] },
	debounce: { default: 300 },
	onchange: { type: Function },
});
</script>

<template>
	<Locale :words="en" :optional="true">
		<Layout v-bind="props" />
	</Locale>
</template>
