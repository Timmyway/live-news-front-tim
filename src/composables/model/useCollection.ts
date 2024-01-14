import { PostCollection } from 'src/db/PostModel';
import { ref, computed, onMounted } from 'vue';

export function useCollection() {
  const postCollection = ref<PostCollection | null>(null);

  const init = () => {
    console.log('-- 000 -> Initialize post collection with PouchdbORM');
    postCollection.value = new PostCollection('local_livenews');
  };

  const postCollectionInfos = async () => {
    if (postCollection.value !== null) {
      const infos = await postCollection.value.db.info();
      console.log('-- 970 -> post collection infos: ', infos);
      return infos;
    } else {
      // Handle the case where postCollection.value is null
      console.error('Post collection is not initialized.');
      return null; // Or another appropriate value or behavior
    }
  };

  init();

  return { postCollection, postCollectionInfos };
}
