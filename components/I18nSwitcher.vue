<template>
  <div class="grid gap-6">
    <div class="grid space-y-1">
      <h1 class="text-lg font-semibold text-foreground">
        {{ t('title') }}
      </h1>
      <p class="text-sm text-muted-foreground">
        {{ t('subtitle') }}
      </p>
    </div>
    <div class="space-y-1.5">
      <div class="grid grid-cols-3 gap-2">
        <template v-for="lang in availableLocales" :key="lang.code">
          <UiButton
            class="justify-start gap-2"
            variant="outline"
            :class="{ 'border-2 border-primary': locale === lang.code }"
            @click="switchLocale(lang.code)"
          >
            <span class="text-xs capitalize">{{ lang.name }}</span>
          </UiButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale, LocaleMessageObject } from 'vue-i18n';

// Type-safe i18n composables
const { locale, locales, setLocale, t } = useI18n();
const router = useRouter();
const switchLocalePath = useSwitchLocalePath();

// Type casting and filtering locales
const availableLocales = computed(() =>
  (locales.value).filter(l => l.code),
);

// Locale switching with route preservation
function switchLocale(newLocale: Locale) {
  // Update locale
  setLocale(newLocale);

  // Navigate to equivalent page in new locale
  router.push({
    path: switchLocalePath(newLocale),
  });
}
</script>
