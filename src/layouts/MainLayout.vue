<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ title }}</q-toolbar-title>

        <div>Welcome, {{ username }}</div>
        <online-check class="q-ml-sm"></online-check>
        <q-btn
          class="q-ml-md"
          flat
          round
          :icon="ionLogOutOutline"
          @click="logout"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ionLogOutOutline } from '@quasar/extras/ionicons-v5';
import { SessionStorage } from 'quasar';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OnlineCheck from 'src/components/OnlineCheck.vue';
import { useAppStore } from 'src/stores/application';
import { cpuUsage } from 'process';

const $route = useRoute();
const $router = useRouter();

const appStore = useAppStore();
const { resetPageItemsCount } = appStore;

const title = computed(() => {
  return $route.meta.title || 'Untitled page';
});
const username = computed(() => {
  return SessionStorage.getItem('loggedUser');
});

const logout = () => {
  SessionStorage.remove('loggedUser');
  $router.push({ name: 'login' });
  // This is necessary for posts display mechanism.
  resetPageItemsCount();
};
</script>
