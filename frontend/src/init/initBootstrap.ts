import Vue from "vue";

import {
  // BButton,
  // BDropdownItem,
  // BForm,
  // BFormGroup,
  // BFormInput,
  // BIcon,
  // BIconCameraReels,
  // BIconChevronCompactDown,
  // BIconEnvelope,
  // BIconKey,
  // BIconLink45deg,
  // BIconLockFill,
  // BIconMap,
  // BIconUnlockFill,
  // BImg,
  // BInputGroup,
  // BNav,
  // BNavItem,
  // BNavItemDropdown,
  LayoutPlugin,
} from 'bootstrap-vue';

import "@/styles/bootstrap-custom.scss";

/**
 * From https://bootstrap-vue.org/docs:
 *
 *   Aliasing Vue import
 *
 *   If you are using a specific build of Vue (i.e. runtime-only vs. compiler +
 *   runtime), you will need to set up an alias to 'vue' in your bundler config
 *   to ensure that your project, BootstrapVue and PortalVue are all using the
 *   same build version of Vue. If you are seeing an error such as "$attr and
 *   $listeners is readonly", or "Multiple instances of Vue detected", then you
 *   will need to set up an alias.
 *
 * So, just keep that in mind in case it comes up.
 */

 export default function initBootstrap(): void {
  Vue.use(LayoutPlugin);
  // Vue.component('BButton', BButton);
  // Vue.component('BDropdownItem', BDropdownItem);
  // Vue.component('BForm', BForm);
  // Vue.component('BFormGroup', BFormGroup);
  // Vue.component('BFormInput', BFormInput);
  // Vue.component('BIcon', BIcon);
  // Vue.component('BIconCameraReels', BIconCameraReels);
  // Vue.component('BIconChevronCompactDown', BIconChevronCompactDown);
  // Vue.component('BIconEnvelope', BIconEnvelope);
  // Vue.component('BIconKey', BIconKey);
  // Vue.component('BIconLink45deg', BIconLink45deg);
  // Vue.component('BIconLockFill', BIconLockFill);
  // Vue.component('BIconMap', BIconMap);
  // Vue.component('BIconUnlockFill', BIconUnlockFill);
  // Vue.component('BImg', BImg);
  // Vue.component('BInputGroup', BInputGroup);
  // Vue.component('BNav', BNav);
  // Vue.component('BNavItem', BNavItem);
  // Vue.component('BNavItemDropdown', BNavItemDropdown);
}
