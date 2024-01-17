<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding>
        <div class="row window-height">
          <div class="col column content-center">
            <div class="q-mt-xl">
              <q-img src="src/assets/Sowell-logo.svg" style="width: 210px" />
            </div>
            <div class="column col content-center justify-center center">
              <div class="q-pl-md q-pr-md" style="max-width: 500px">
                <h4 class="title">
                  Login {{ postStore.posts.length }} |
                  {{ postStore.postOffset }}
                </h4>
                <div class="subtitle">
                  Type a username and a complex password to log in
                </div>

                <q-form @submit="handleSubmit">
                  <div>
                    <div
                      class="q-ml-xs q-mb-xs text-subtitle2 text-weight-bold"
                    >
                      Username
                    </div>
                    <q-input
                      v-model.trim="username"
                      dense
                      outlined
                      :rules="[
                        (val) => !!val || 'Username is required',
                        (val) =>
                          val.length > 3 ||
                          'Username must at least have 4 characters',
                      ]"
                      input-class="text-subtitle2 text-weight-medium"
                    />
                    <div
                      class="q-ml-xs q-mb-xs text-subtitle2 text-weight-bold"
                    >
                      Password
                    </div>
                    <q-input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      dense
                      outlined
                      input-class="text-subtitle2 text-weight-bold"
                      bottom-slots
                    >
                      <template #append>
                        <q-icon
                          :name="showPassword ? ionEyeOffSharp : ionEyeSharp"
                          class="cursor-pointer q-mr-sm lightenDark"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                      <template #hint>
                        <div :class="passwordHint.color">
                          {{ passwordHint.label }}
                        </div>
                      </template>
                    </q-input>
                  </div>
                  <div class="row q-mt-md">
                    <q-btn
                      label="Log in"
                      color="primary"
                      no-caps
                      unelevated
                      data-cy="submit-login"
                      text-color="white"
                      :loading="isLoading"
                      type="submit"
                      :disable="isSubmitBtnDisabled || isLoading"
                      class="submitBtn text-subtitle2 text-weight-bold"
                    />
                  </div>
                </q-form>
              </div>
            </div>
          </div>
          <div
            class="column col justify-center content-center gt-sm"
            :style="'background: #eef8fd'"
          >
            <q-img
              src="src/assets/illustration-login.svg"
              class="q-pl-md q-pr-md logoWhite"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { ionEyeSharp, ionEyeOffSharp } from '@quasar/extras/ionicons-v5';
import { SessionStorage } from 'quasar';
import { usePostStore } from 'src/stores/posts';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const postStore = usePostStore();

enum PASSWORD_STRENGTH {
  TOO_SHORT = 'Too Short',
  WEAK = 'Weak',
  MEDIUM = 'Medium',
  STRONG = 'Strong',
  VERY_STRONG = 'Very Strong',
}

const $router = useRouter();

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);

const isSubmitBtnDisabled = computed(() => {
  return !username.value || passwordScore.value < 3;
});

const passwordScore = computed(() => {
  const upper = /[A-Z]/,
    lower = /[a-z]/,
    number = /[0-9]/,
    special = /[^A-Za-z0-9]/,
    minLength = 8;
  let score = 0;

  if (password.value.length < minLength) {
    return 0;
  }

  if (upper.test(password.value)) score++;
  if (lower.test(password.value)) score++;
  if (number.test(password.value)) score++;
  if (special.test(password.value)) score++;

  if (score < 3) score--;

  if (password.value.length > minLength) {
    score += Math.floor((password.value.length - minLength) / 2);
  }

  return score;
});

const passwordStrength = computed(() => {
  if (passwordScore.value === 0) return PASSWORD_STRENGTH.TOO_SHORT;
  else if (passwordScore.value < 3) return PASSWORD_STRENGTH.WEAK;
  else if (passwordScore.value < 4) return PASSWORD_STRENGTH.MEDIUM;
  else if (passwordScore.value < 6) return PASSWORD_STRENGTH.STRONG;
  else return PASSWORD_STRENGTH.VERY_STRONG;
});

const passwordHint = computed(() => {
  if (!password.value) {
    return {
      label: 'Type a complex password',
      color: '',
    };
  }
  let color = '';
  if (passwordStrength.value === PASSWORD_STRENGTH.TOO_SHORT)
    color = 'text-negative';
  else if (
    passwordStrength.value === PASSWORD_STRENGTH.WEAK ||
    passwordStrength.value === PASSWORD_STRENGTH.MEDIUM
  )
    color = 'text-warning';
  else color = 'text-positive';
  return {
    label: `Password strength: ${passwordStrength.value}`,
    color,
  };
});

const handleSubmit = () => {
  if (isSubmitBtnDisabled.value) return;
  SessionStorage.set('loggedUser', username.value);
  $router.push({ name: 'synchronization' });
};
</script>
