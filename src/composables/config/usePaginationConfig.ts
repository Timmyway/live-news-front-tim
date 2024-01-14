import { PaginationConfig } from 'src/interfaces';
import { ref, computed, watch } from 'vue';

export function usePaginationConfig({
  items = 10,
  maxItems = 50,
  newItems = 10,
}: Partial<PaginationConfig> = {}) {
  // Retrieve values from localStorage or use default values
  const storedPageItemsCount = parseInt(
    localStorage.getItem('pageItemsCount') || '',
    10
  );
  const storedMaxItemCount = parseInt(
    localStorage.getItem('maxItemCount') || '',
    10
  );
  const storedNewItemsCount = parseInt(
    localStorage.getItem('newItemsCount') || '',
    10
  );

  // Initialize refs with retrieved or default values
  const pageItemsCount = ref(
    !isNaN(storedPageItemsCount) ? storedPageItemsCount : items
  );
  const maxItemCount = ref(
    !isNaN(storedMaxItemCount) ? storedMaxItemCount : maxItems
  );
  const newItemsCount = ref(
    !isNaN(storedNewItemsCount) ? storedNewItemsCount : newItems
  );

  // Watch for changes and update localStorage
  watch([pageItemsCount], () => {
    localStorage.setItem('pageItemsCount', pageItemsCount.value.toString());
  });

  const paginate = () => {
    console.log(`-- 998.1 -> Allow more items: ${allowMoreItems.value}`);
    console.log(
      `-- 998.2 -> BEFORE ${pageItemsCount.value} items out of ${maxItemCount.value} max allowed`
    );
    if (allowMoreItems.value) {
      pageItemsCount.value += newItemsCount.value;
    } else {
      console.log('-- 999 -> Reached max items allowed.');
    }
    console.log(
      `-- 998.3 -> AFTER ${pageItemsCount.value} items out of ${maxItemCount.value} max allowed`
    );
  };

  const resetPageItemsCount = (): void => {
    console.log('-- 990 -> Reset page item count from local storage.');
    localStorage.removeItem('pageItemsCount');
  };

  const allowMoreItems = computed((): boolean => {
    return pageItemsCount.value <= maxItemCount.value;
  });

  console.log(
    `-- 992 -> ${pageItemsCount.value} items out of ${maxItemCount.value} max allowed`
  );
  console.log('-- 993 -> Does allow more items: ', allowMoreItems.value);

  return {
    pageItemsCount,
    maxItemCount,
    newItemsCount,
    allowMoreItems,
    paginate,
    resetPageItemsCount,
  };
}
