<script setup>
import { Locale } from '@svar-ui/vue-core';
import { en } from '@svar-ui/filter-locales';
import Layout from './Layout.vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
	<Locale :words="en" :optional="true">
		<Layout v-bind="$attrs" />
	</Locale>
</template>
