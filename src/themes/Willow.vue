<script setup>
defineOptions({ name: "CommentsThemesWillow" });

import { Willow } from "@svar-ui/vue-core";

const props = defineProps({
	fonts: {},
});
</script>

<template>
	<Willow v-if="$slots.default" :fonts="props.fonts">
		<slot />
	</Willow>
	<Willow v-else :fonts="props.fonts" />
</template>

<style>
.wx-willow-theme {
	--wx-filter-value-color: var(--wx-color-primary);
	--wx-filter-and-background: #fcba2e;
	--wx-filter-or-background: #77d257;
	--wx-filter-and-font-color: var(--wx-color-font);
	--wx-filter-or-font-color: var(--wx-color-font);
	--wx-filter-border: var(--wx-border);
}
</style>
