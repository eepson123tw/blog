<template>
  <div>
    <NuxtErrorBoundary @error="handleError">
      <!-- Main content -->
      <div
        class="px-4 py-6 md:px-8"
        :class="[config.main.padded && 'container']"
      >
        <Suspense>
          <ContentRenderer
            v-if="page"
            :key="page._id"
            :value="page"
          />
          <template #fallback>
            <div class="flex items-center justify-center py-10">
              <span class="text-gray-500">Loading...</span>
            </div>
          </template>
        </Suspense>
      </div>

      <!-- Error handling -->
      <template #error="{ error }">
        <div class="container mx-auto px-4 py-10">
          <div class="rounded-lg bg-red-50 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <!-- You can add an error icon here -->
                <span class="text-red-400">⚠️</span>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-red-800">
                  {{ error.statusCode === 500 ? 'Server Error' : 'Error' }}
                </h3>
                <div class="mt-2 text-red-700">
                  {{ error.message || 'An unexpected error occurred' }}
                </div>
                <div class="mt-4">
                  <button
                    type="button"
                    class="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                    @click="handleErrorClear(error)"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<script setup lang="ts">
const { page } = useContent();
const config = useConfig();

function handleError(error: any) {
  console.error('Page Error:', error);

  // Handle specific error cases
  if (error.statusCode === 404) {
    showError({ statusCode: 404, message: 'Content not found' });
  } else if (error.statusCode === 500) {
    showError({ statusCode: 500, message: 'Server error occurred' });
  }
}

function handleErrorClear(error: any) {
  // You might want to refresh the content or perform specific actions
  if (error.statusCode === 500) {
    // Reload the page for server errors
    window.location.reload();
  } else {
    // For other errors, just clear the error
    clearError({ redirect: '/' });
  }
}

// Your existing meta tags setup
useSeoMeta({
  title: `${page.value?.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',
  articleModifiedTime: page.value?.date,
});

useHead({
  meta: [{ property: 'article:modified_time', content: `${page.value?.date}` }],
});

defineOgImageComponent('BlogPost', {
  title: page.value?.title,
  description: page.value?.description,
  colorMode: 'light',
});
</script>
