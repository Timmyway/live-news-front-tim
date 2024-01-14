import { IPost } from 'src/interfaces';
import { useCollection } from './useCollection';
import { usePostCrud } from '../http/usePostCrud';

export function useQuery() {
  console.log('-- 001.2 -> Initialize use query.');

  const { postCollection } = useCollection();

  // const findPostFromCacheFirst = async (limit = 10) => {
  //   const postInfos = await postCollectionInfos();
  //   const postCount = postInfos.doc_count;
  //   const hasDoc: boolean = postCount > 0;
  //   console.log(`-- 960 -> Found ${postCount} documents form post collection.`);
  //   if (hasDoc) {
  //     console.log('-- 961 -> Document exists inside local DB.');
  //     postsFromRemote.value = await postCollection.value.find();
  //     console.log('-- 961 -> Posts found from local database.');
  //   } else {
  //     console.log('-- 962 -> Document does not exists.');
  //     postsFromRemote.value = await findPost(limit);
  //     await saveLastPostOffline();
  //   }
  // };

  // const saveLastPostOffline = async (lastPostCount = 10) => {
  //   console.log('-- 001 -> Remote post found: ', postsFromRemote.value);
  //   // Get the last n posts.
  //   const lastPosts: IPost[] = postsFromRemote.value.slice(0, lastPostCount);
  //   console.log(`-- 002 -> Last ${lastPostCount} posts: ${lastPosts}`);
  //   // Save last posts offline
  //   // const postModel = await getPostModel();
  //   // const response = await postModel.bulkInsert(lastPosts);
  //   // console.log('-- 003 -> Response after bulk docs: ', response);
  //   if (postCollection.value !== null) {
  //     await postCollection.value.bulkUpsert(lastPosts);
  //   }
  // };

  return {
    /* Todo */
  };
}
