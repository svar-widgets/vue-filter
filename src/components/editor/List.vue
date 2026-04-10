<script setup>
defineOptions({ name: 'FilterEditorList' });

import { ref, computed, watch, inject } from 'vue';
import { delegateClick } from '@svar-ui/lib-dom';
import { Portal, Popup } from '@svar-ui/vue-core';
import { asDirective, subscribe } from '@svar-ui/lib-vue';
import Self from './List.vue';

import Panel from './Panel.vue';
import Rule from './Rule.vue';
import Glue from './Glue.vue';

const props = defineProps({
	group: {},
	type: {},
	onshowmenu: { type: Function },
});

const api = inject('wx-filter-store');

const reactiveState = api.getReactiveState();
const value = subscribe(reactiveState.value, true);
const fields = subscribe(reactiveState.fields);
const editor = subscribe(reactiveState._editor);

const filters = computed(() => value.value.getBranch(props.group.id) || []);

const cssType = computed(() => props.type == 'simple' ? 'line' : props.type);
const groupCss = computed(() => props.group.$level == 1 ? 'top' : 'inner');

const handlers = {
	dblclick: id => api.exec('edit-rule', { id }),
	menu: (id, ev) => props.onshowmenu?.({ id, ev }),
	delete: id => {
		api.exec('edit-rule', {});
		api.exec('delete-rule', { id });
	},
};

const getField = id => fields.value.find(a => a.id == id);

// line
const root = ref();
const ruleBox = ref();
const ruleEditor = ref();

watch(editor, () => {
	if (editor.value && ruleEditor.value === editor.value.id) return;

	if (
		editor.value &&
		props.type !== 'list' &&
		filters.value.find(a => a.id === editor.value.id)
	) {
		const rootNode = root.value?.querySelector(`[data-id='${editor.value.id}']`);
		if (rootNode) {
			ruleBox.value = rootNode.getBoundingClientRect();
			ruleEditor.value = editor.value.id;
			return;
		}
	}
	ruleBox.value = ruleEditor.value = null;
}, { flush: 'post' });

function cancel() {
	ruleBox.value = ruleEditor.value = null;
	api.exec('edit-rule', {});
}

const vDelegateClick = asDirective(delegateClick);
</script>

<template>
	<div
		ref="root"
		:class="['wx-group', `wx-${groupCss}`, `wx-${cssType}`]"
		v-delegate-click="handlers"
	>
		<template v-for="(rule, i) in filters" :key="rule.id">
			<Panel v-if="type === 'list' && editor && editor.id === rule.id" :rule="rule" />
			<Self v-else-if="rule.data" :type="type" :group="rule" :onshowmenu="onshowmenu" />
			<div v-else class="wx-rule-wrapper">
				<Rule
					:action="type == 'simple' ? 'delete' : 'menu'"
					:type="cssType"
					:filter="rule"
					:field="getField(rule.field)"
				/>
			</div>

			<div v-if="type !== 'simple' && i < filters.length - 1" class="wx-glue-wrapper">
				<Glue :mode="group.glue" :id="group.id" />
			</div>
		</template>
	</div>

	<Portal v-if="editor && ruleBox">
		<Popup
			:top="ruleBox.top + ruleBox.height"
			:left="ruleBox.left + ruleBox.width / 2"
			:oncancel="cancel"
		>
			<div class="wx-editor-wrapper">
				<Panel :type="type" :rule="value.byId(editor.id)" />
			</div>
		</Popup>
	</Portal>
</template>

<style scoped>
.wx-group.wx-inner.wx-list {
	margin-left: 20px;
	padding: 4px 0 0 8px;
	border-left: var(--wx-border);
}

/* line */
.wx-group.wx-inner.wx-line:before,
.wx-group.wx-inner.wx-line:after {
	content: "(";
	margin: 0 2px 0 -4px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	transform: scaleX(0.75);
	font-size: 30px;
	position: relative;
	top: -2px;
}
.wx-group.wx-inner.wx-line:after {
	content: ")";
	margin: 0 -4px 0 2px;
}
.wx-group.wx-line {
	display: flex;
	gap: 10px;
	padding: 4px;
}

.wx-line .wx-rule-wrapper,
.wx-line .wx-glue-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.wx-editor-wrapper {
	padding: 0 10px;
	min-width: 280px;
	max-width: 320px;
}
</style>
