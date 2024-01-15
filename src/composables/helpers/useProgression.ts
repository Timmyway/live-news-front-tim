import { computed, ref } from 'vue';

export function useProgression() {
  const itemsProgression = ref(0);

  const getItemsLoadingProgression = computed(() => {
    return itemsProgression.value;
  });
  const getItemsLoadingProgressionValue = computed(() => {
    return itemsProgression.value / 100;
  });

  const setLoadingProgression = (value: number) => {
    itemsProgression.value = value;
  };

  const cancelLoadingProgression = () => {
    // The sync page disappear when below value reach 100.
    itemsProgression.value = 100;
  };

  return {
    itemsProgression,
    getItemsLoadingProgression,
    getItemsLoadingProgressionValue,
    setLoadingProgression,
    cancelLoadingProgression,
  };
}
