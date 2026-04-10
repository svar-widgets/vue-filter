<script setup>
defineOptions({ name: 'FilterSuggest' });

import { ref, watch } from 'vue';
import { Dropdown } from '@svar-ui/vue-core';
import { locateID } from '@svar-ui/lib-dom';

const props = defineProps({
	items: { default: () => [] },
	onselect: { type: Function },
	onclose: { type: Function },
});

const list = ref(null);
const navIndex = ref(-1);

function setNav(index) {
	navIndex.value = index;
}

function navigate(dir) {
	let index;
	if (navIndex.value === -1) {
		// First navigation: ArrowDown→first item, ArrowUp→last item
		index = dir > 0 ? 0 : props.items.length - 1;
	} else {
		index = Math.max(0, Math.min(navIndex.value + dir, props.items.length - 1));
	}
	if (index === navIndex.value) return;
	setNav(index);
	scrollToIndex(index);
}

function scrollToIndex(index) {
	if (index >= 0 && list.value) {
		const el = list.value.querySelectorAll('.wx-item')[index];
		if (el) {
			el.scrollIntoView({ block: 'nearest' });
		}
	}
}

function handleMove(ev) {
	const id = locateID(ev);
	const index = props.items.findIndex(a => a.id == id);
	if (index !== -1 && index !== navIndex.value) {
		setNav(index);
	}
}

function keydown(ev) {
	if (!props.items.length) return;

	switch (ev.code) {
		case 'Enter':
			if (navIndex.value >= 0) {
				ev.preventDefault();
				props.onselect?.({ id: props.items[navIndex.value].id });
			} else {
				props.onclose?.();
			}
			break;
		case 'Escape':
		case 'Tab':
			props.onclose?.();
			break;
		case 'ArrowDown':
			ev.preventDefault();
			navigate(1);
			break;
		case 'ArrowUp':
			ev.preventDefault();
			navigate(-1);
			break;
	}
}

function handleClick(ev) {
	ev.stopPropagation();
	const id = locateID(ev);
	const item = props.items.find(a => a.id == id);
	if (item) {
		props.onselect?.({ id: item.id });
	}
}

// Reset selection when items change to avoid stale index
watch(() => props.items, () => {
	if (!list.value || !props.items.length) {
		navIndex.value = -1;
	}
});

defineExpose({ keydown });
</script>

<template>
	<Dropdown v-if="items.length > 0" :oncancel="onclose">
		<div
			class="wx-list"
			ref="list"
			@click="handleClick"
			@mousemove="handleMove"
		>
			<div
				v-for="(data, index) in items"
				:key="data.id"
				class="wx-item"
				:class="{ 'wx-focus': index === navIndex }"
				:data-id="data.id"
			>
				<slot :option="data">{{ data.label }}</slot>
			</div>
		</div>
	</Dropdown>
</template>

<style scoped>
.wx-list {
	max-height: 250px;
	overflow-y: auto;
}

.wx-item {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	font-family: var(--wx-input-font-family);
	font-size: var(--wx-input-font-size);
	line-height: var(--wx-input-line-height);
	font-weight: var(--wx-input-font-weight);
	color: var(--wx-input-font-color);
	padding: var(--wx-input-padding);
	cursor: pointer;
}

.wx-item.wx-focus {
	background: var(--wx-background-hover);
}
</style>
