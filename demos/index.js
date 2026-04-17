import { createApp } from 'vue'
import Demos from './common/Index.vue'

import { Globals, Button, Segmented, Locale } from '@svar-ui/vue-core';

import Willow from "../src/themes/Willow.vue";
import WillowDark from "../src/themes/WillowDark.vue";

import '@svar-ui/vue-core/style.css';
import '@svar-ui/vue-menu/style.css';

import { router } from "./common/helpers.js";

const skins = [
  { id: 'willow', label: 'Willow', component: Willow },
  { id: 'willow-dark', label: 'Dark', component: WillowDark },
];

const app = createApp(Demos, {
  publicName: "Filter",
  skins,
  productTag: "filter",
  productLink: "filter",
  Globals,
  Button,
  Segmented,
  Locale,
});
app.use(router);
app.mount('#app');
