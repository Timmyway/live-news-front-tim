<template>
  <q-page padding>
    <template v-if="isLoading"> Loading... </template>
    <template v-else>
      <div class="q-pa-md">
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

const postStore = usePostStore();
const appStore = useAppStore();
const { allowMoreItems, pageItemsCount } = storeToRefs(appStore);
const { isLoading, posts } = storeToRefs(postStore);
const { loadPosts } = postStore;
const { paginate, resetPageItemsCount } = appStore;

console.log('-- 000.0 Entering index page');

const onLoad = async (index, done: () => void) => {
  /*
    The continuous triggering of the loading process occurs
    when the number of posts is insufficient to extend the container's height
    beyond the threshold, causing the infinite scroll event to fire repeatedly.    
  */
  if (allowMoreItems.value) {
    const loadedPostCount = await loadPosts(pageItemsCount.value);
    console.log('-- 996 -> Number of fetched posts: ', loadedPostCount);
    paginate();
  }
  done();
};

// onMounted(() => {
//   loadPosts();
// });

const sync = async () => {
  await appStore.sync();
};

// Attach the clearLocalStorageOnRefresh function to the beforeunload event
window.addEventListener('beforeunload', resetPageItemsCount);

// Cleanup the event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', resetPageItemsCount);
});
</script>
