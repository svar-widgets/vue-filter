<script setup>
import { ref, computed, watch, inject } from 'vue';
import {
	parseSet,
	getAutocompleteContext,
	getSuggestions,
	prepareFields,
	buildFieldMaps,
	idsToLabels,
	labelsToIds,
} from '@svar-ui/filter-store';

import Suggest from './suggest/Suggest.vue';
import QueryHighlight from './QueryHighlight.vue';

import { locale } from '@svar-ui/lib-dom';
import { en } from '@svar-ui/filter-locales';

const i18n = (inject('wx-i18n', null) || locale(en)).getGroup('filter');

const value = defineModel('value', { default: '' });

const props = defineProps({
	placeholder: { default: '' },
	onchange: { type: Function },
	parse: { default: 'allowFreeText' },
	fields: { default: () => [] },
	options: { default: () => ({}) },
});

const parseEnabled = computed(() => props.parse !== 'none');
const strictParser = computed(() => props.parse === 'strict');

// Prepare fields: sanitize labels for parser-safe matching
const pFields = computed(() => prepareFields(props.fields));
const fieldMaps = computed(() => buildFieldMaps(pFields.value));

function getErrorMessage(error) {
	if (!error || typeof error === 'boolean') return null;

	const fn = i18n(error.code.toString().toLowerCase());
	if (typeof fn === 'function') return fn(error.field, error.value);
	return error.message || fn;
}

// Internal text (labels) synced with external value (IDs)
const text = ref('');
let isInternalChange = false;
let hasBeenSet = false;

watch(value, () => {
	if (isInternalChange) {
		isInternalChange = false;
		return;
	}
	if (!hasBeenSet) {
		hasBeenSet = true;
		if (!value.value) return;
	}
	text.value = idsToLabels(value.value, fieldMaps.value);
	triggerFilter();
});

const progressActive = ref(false);
const progressKey = ref(0);
const inputEl = ref(null);
const highlightEl = ref(null);
const showErrors = ref(true);
const cursorPos = ref(0);
const suggestRef = ref(null);
const suggestOpen = ref(false);

const parseResult = computed(() =>
	parseEnabled.value
		? parseSet(text.value, pFields.value, props.options, {
				allowFreeText: !strictParser.value,
			})
		: null
);

const activeTokenInfo = computed(() => {
	if (!parseEnabled.value) return null;
	return getAutocompleteContext(text.value, cursorPos.value, pFields.value);
});

const currentTokenValue = computed(() =>
	activeTokenInfo.value
		? text.value
				.slice(activeTokenInfo.value.start, activeTokenInfo.value.end)
				.toLowerCase()
		: ''
);

const suggestions = computed(() => {
	if (!suggestOpen.value) return [];
	// no autocomplete for strict-match-any
	if (activeTokenInfo.value && text.value[activeTokenInfo.value.start - 1] === '#')
		return [];
	const all = getSuggestions(activeTokenInfo.value, pFields.value, props.options);
	if (!all || !currentTokenValue.value) return all || [];
	// Hide suggestion that exactly matches what's already typed
	return all.filter(s => s.id.toLowerCase() !== currentTokenValue.value);
});

function startProgress() {
	progressKey.value++; // Increment key to restart CSS animation
	progressActive.value = true;
}

function endProgress() {
	progressActive.value = false;
}

function closeSuggestions() {
	suggestOpen.value = false;
}

function onkeydown(e) {
	if (suggestions.value && suggestions.value.length) {
		suggestRef.value.keydown(e);
	}
	// Enter triggers filter unless Suggest handled it (selected an item)
	if (e.key === 'Enter' && !e.defaultPrevented) {
		triggerFilter();
	}
}

function setText(newText) {
	text.value = newText;
	isInternalChange = true;
	value.value = labelsToIds(newText, fieldMaps.value);
}

function selectByEvent(event) {
	const insertText = event.id;
	if (!activeTokenInfo.value) return;

	const before = text.value.slice(0, activeTokenInfo.value.start);
	const after = text.value.slice(activeTokenInfo.value.end);

	let newText;
	let newCursorPos;
	if (activeTokenInfo.value.type === 'field') {
		// Append ": " after field name per query syntax
		newText = `${before}${insertText}: ${after}`;
		newCursorPos = before.length + insertText.length + 2;
	} else if (activeTokenInfo.value.type === 'predicate') {
		// Append ": " after predicate (e.g., "StartDate.year: ")
		newText = `${before}${insertText}: ${after}`;
		newCursorPos = before.length + insertText.length + 2;
	} else {
		// Add space after colon if missing: "field:" → "field: value"
		const needsSpace = before.endsWith(':');
		const prefix = needsSpace ? ' ' : '';
		newText = `${before}${prefix}${insertText}${after}`;
		newCursorPos = before.length + prefix.length + insertText.length;
	}

	setText(newText);
	cursorPos.value = newCursorPos;
	closeSuggestions();

	// Wait for Vue to update DOM before setting cursor position
	requestAnimationFrame(() => {
		if (inputEl.value) {
			inputEl.value.setSelectionRange(newCursorPos, newCursorPos);
			inputEl.value.focus();
		}
	});
}

function triggerFilter() {
	closeSuggestions();
	// Normalize text: convert any typed field IDs to labels
	text.value = idsToLabels(text.value, fieldMaps.value);
	showErrors.value = true;
	if (props.onchange) {
		if (parseEnabled.value && parseResult.value) {
			const error = parseResult.value.isInvalid
				? {
						...parseResult.value.isInvalid,
						message: getErrorMessage(parseResult.value.isInvalid),
					}
				: null;

			const finalText =
				!error || error.code === 'NO_DATA'
					? parseResult.value.naturalText || ''
					: text.value;
			props.onchange({
				parsed: parseResult.value,
				value: parseResult.value.config,
				text: finalText,
				error,
				startProgress,
				endProgress,
			});
		} else {
			props.onchange({ value: value.value, text: text.value, startProgress, endProgress });
		}
	}
}

function handleInput(e) {
	text.value = e.target.value;
	isInternalChange = true;
	value.value = labelsToIds(text.value, fieldMaps.value);
	cursorPos.value = e.target.selectionStart;
	showErrors.value = cursorPos.value; // Pass position to suppress errors at active token
	suggestOpen.value = true;
}

function handleScroll() {
	if (highlightEl.value && inputEl.value) {
		highlightEl.value.scrollLeft = inputEl.value.scrollLeft;
	}
}

function handleInputClick() {
	closeSuggestions();
}

function clear() {
	text.value = '';
	isInternalChange = true;
	value.value = '';
}
</script>

<template>
	<div class="wx-filter-query" @keydown="onkeydown">
		<div class="wx-progress-bar" :class="{ active: progressActive }">
			<div v-if="progressActive" :key="progressKey" class="wx-progress-fill"></div>
		</div>
		<div class="wx-filter-query-row">
			<div class="wx-filter-query-input-wrapper">
				<div
					v-if="parseEnabled"
					class="wx-filter-query-highlight"
					:class="{ 'wx-placeholder': !text }"
					ref="highlightEl"
					aria-hidden="true"
				>
					<template v-if="text">
						<QueryHighlight
							:parse="props.parse"
							:query="text"
							:fields="pFields"
							:options="props.options"
							:inline="true"
							:show-errors="showErrors"
							:cursor-pos="cursorPos"
						/>&nbsp;
					</template>
					<template v-else>
						{{ props.placeholder }}
					</template>
				</div>
				<input
					type="text"
					class="wx-filter-query-input"
					:class="{ 'wx-parse-mode': parseEnabled }"
					ref="inputEl"
					:value="text"
					:placeholder="parseEnabled ? '' : props.placeholder"
					@input="handleInput"
					@scroll="handleScroll"
					@click="handleInputClick"
				/>
			</div>
			<button
				v-if="text"
				type="button"
				class="wx-filter-query-clear"
				@click="clear"
				aria-label="Clear"
			>
				<svg viewBox="0 0 24 24" width="16" height="16">
					<path
						fill="currentColor"
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="wx-filter-query-search"
				@click="triggerFilter"
				aria-label="Search"
			>
				<svg viewBox="0 0 24 24" width="18" height="18">
					<path
						fill="currentColor"
						d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
					/>
				</svg>
			</button>
		</div>
		<Suggest
			ref="suggestRef"
			:items="suggestions"
			:onselect="selectByEvent"
			:onclose="closeSuggestions"
		>
			<template #default="{ option }">
				{{ option.label }}
			</template>
		</Suggest>
	</div>
</template>

<style scoped>
.wx-filter-query {
	display: flex;
	flex-direction: column;
	position: relative;
}

.wx-progress-bar {
	width: 100%;
	height: 3px;
	border-radius: 2px 2px 0 0;
	overflow: hidden;
	position: absolute;
	top: 0;
	left: 0;
}

.wx-progress-bar.active {
	background: var(--wx-background-alt);
}

.wx-progress-fill {
	height: 100%;
	background: var(--wx-color-primary);
	animation: wx-fill-progress 3000ms linear forwards;
}

@keyframes wx-fill-progress {
	from {
		width: 0%;
	}
	to {
		width: 100%;
		background: var(--wx-color-success);
	}
}

.wx-filter-query-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	border: var(--wx-border);
	border-radius: var(--wx-border-radius);
	background: var(--wx-background);
	overflow: hidden;
}

.wx-filter-query-input-wrapper {
	flex: 1;
	position: relative;
	overflow: hidden;
}

.wx-filter-query-highlight {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 6px 12px;
	white-space: pre;
	overflow-x: auto;
	pointer-events: none;
	scrollbar-width: none;
}

.wx-filter-query-highlight::-webkit-scrollbar {
	display: none;
}

.wx-filter-query-input {
	width: 100%;
	border: none;
	outline: none;
	padding: var(--wx-padding) 12px;
	white-space: pre;
	background: transparent;
	color: var(--wx-color-font);
	font-size: var(--wx-font-size);
	font-family: var(--wx-font-family);
}

.wx-filter-query-input.wx-parse-mode {
	color: transparent;
	caret-color: var(--wx-color-font);
	position: relative;
}

.wx-filter-query-input::placeholder {
	color: var(--wx-color-font-alt);
}

.wx-filter-query-highlight.wx-placeholder {
	color: var(--wx-color-font-alt);
}

.wx-filter-query-clear {
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	cursor: pointer;
	padding: var(--wx-padding);
	color: var(--wx-color-font-alt);
}

.wx-filter-query-clear:hover {
	color: var(--wx-color-font);
}

.wx-filter-query-search {
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-left: var(--wx-border);
	border-radius: var(--wx-border-radius);
	margin: 2px;
	background: var(--wx-color-primary);
	cursor: pointer;
	padding: 6px 12px;
	color: var(--wx-color-primary-font);
	position: relative;
}

.wx-filter-query-search:hover {
	background: color-mix(in srgb, var(--wx-color-primary) 90%, black);
	/*background: var(--wx-color-primary-hover);*/
}
</style>
