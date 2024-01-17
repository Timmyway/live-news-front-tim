import { Post, PrefetchedAvatars } from 'src/interfaces/index';
import { ref } from 'vue';
import { useUrlHelper } from './helpers/useUrlHelper';

export function usePrefetchAvatars(data: Post[] | object[], baseUrl = '') {
  const prefetchedAvatars = ref<PrefetchedAvatars>({});

  const loadAvatars = () => {
    console.log('-- 330 -> Prefetch avatars');
    data.forEach((post) => {
      // Each post document should have an author's avatar
      // like described in the Post interface.
      const author = post.author;
      let avatarUrl = author.avatar;

      const { prefixUrl } = useUrlHelper();
      avatarUrl = prefixUrl(avatarUrl, baseUrl);

      // Preload avatars
      if (!prefetchedAvatars.value[avatarUrl]) {
        const img = new Image();
        img.src = avatarUrl;

        img.onload = () => {
          prefetchedAvatars.value[avatarUrl] = img;
        };
      }
      console.log('-- 331 -> Finished avatars prefetching.');
    });
  };

  const loadAvatarsAsync = async () => {
    console.log('-- 330 -> Prefetch avatars');

    // Use Promise.all to wait for all avatar prefetching to complete
    await Promise.all(
      data.map(async (post) => {
        const author = post.author;
        let avatarUrl = author.avatar;

        const { prefixUrl } = useUrlHelper();
        avatarUrl = prefixUrl(avatarUrl, baseUrl);

        /* I aim to avoid waiting for avatar images to load,
          especially in scenarios where there are numerous images
          or they are excessively large.
        */
        const loadImage = new Promise<void>((resolve) => {
          const img = new Image();
          img.src = avatarUrl;

          img.onload = () => {
            prefetchedAvatars.value[avatarUrl] = img;
            resolve();
          };
        });

        // Wait for the image to load before moving to the next iteration
        await loadImage;
      })
    );

    console.log('-- 331 -> Finished avatars prefetching.');
  };

  loadAvatars();

  return { loadAvatarsAsync };
}
