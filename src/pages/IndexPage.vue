<template>
  <q-page padding>
    <template v-if="isLoading"> Loading... </template>
    <template v-else>
      <div class="q-pa-md">
        <!-- Show only when the distant api is unreachable -->
        <q-chip
          icon="wifi_off"
          color="deep-orange"
          text-color="white"
          v-show="apiUnreachable"
          >Offline posts may be outdated</q-chip
        >
        <q-infinite-scroll @load="onLoad" :offset="50" debounce="200">
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" size="40px" />
            </div>
          </template>
          <q-list class="column">
            <q-item v-for="post in posts" :key="post.id">
              <post-card :post="post"></post-card>
            </q-item>
          </q-list>
        </q-infinite-scroll>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePostStore } from 'src/stores/posts';
import PostCard from 'src/components/PostCard.vue';
import { useAppStore } from 'src/stores/application';
import { onBeforeUnmount } from 'vue';
import { useCacheStore } from 'src/stores/cache';

const postStore = usePostStore();
const { isLoading, posts, apiUnreachable } = storeToRefs(postStore);
const { loadPosts } = postStore;

const appStore = useAppStore();
const { allowMoreItems, pageItemsCount } = storeToRefs(appStore);
const { paginate, resetPageItemsCount } = appStore;

const cacheStore = useCacheStore();
const { scheduleInvalidation, stopScheduleInvalidation } = cacheStore;

console.log('-- 000.0 Entering index page');

const onLoad = async (index, done: () => void) => {
  /*
    The continuous triggering of the loading process occurs
    when the number of posts is insufficient to extend the container's height
    beyond the threshold, causing the infinite scroll event to fire repeatedly.
  */
  if (await allowMoreItems.value) {
    await loadPosts(pageItemsCount.value);
    paginate();
  }
  done();
};

const sync = async () => {
  await appStore.sync();
};

scheduleInvalidation(30);

// Cleaning just before users refresh the page.
window.addEventListener('beforeunload', () => {
  resetPageItemsCount();
});

// Cleanup the event listener when the component is unmounted.
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', resetPageItemsCount);
  // Cleanup the invalidation interval task.
  stopScheduleInvalidation();
});
</script>
