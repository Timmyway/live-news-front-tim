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
        <q-infinite-scroll @load="onLoad" :offset="50" debounce="250">
          <template v-slot:loading>
            <div v-show="!outOfRange" class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" size="40px" />
            </div>
          </template>
          <q-list class="column">
            <q-item v-for="(post, index) in posts" :key="index">
              <span>{{ index + 1 }}</span>
              <post-card :post="post"></post-card>
            </q-item>
          </q-list>
        </q-infinite-scroll>
        <div v-if="outOfRange" class="row justify-center q-my-md">
          <q-banner class="bg-primary text-white">
            Explored it all! 🌐 Refresh for fresh posts! 🚀"
          </q-banner>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePostStore } from 'src/stores/posts';
import PostCard from 'src/components/PostCard.vue';
import { onBeforeUnmount } from 'vue';
import { useCacheStore } from 'src/stores/cache';

const postStore = usePostStore();
const { isLoading, posts, apiUnreachable, outOfRange } = storeToRefs(postStore);
const { loadPosts } = postStore;

const cacheStore = useCacheStore();
const { scheduleInvalidation, stopScheduleInvalidation } = cacheStore;

const onLoad = async (index, done: () => void) => {
  /*
    The continuous triggering of the loading process occurs
    when the number of posts is insufficient to extend the container's height
    beyond the threshold, causing the infinite scroll event to fire repeatedly.
  */
  setTimeout(async () => {
    // The timer is set to 1s to allow visibility of the loading spinner.
    await loadPosts();
    done();
  }, 1000);
};

// Change this value to tweek cache timeout validation.
// We can only fetch new posts after cache has been invalidated.
// So a bigger value means we load from cache longer time. Bellow set to 5 min
scheduleInvalidation(60 * 5);

// Cleanup the event listener when the component is unmounted.
onBeforeUnmount(() => {
  // Cleanup the invalidation interval task.
  stopScheduleInvalidation();
  posts.value = [];
});
</script>
