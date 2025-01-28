<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
    <!-- Background pattern -->
    <div class="bg-grid-white/[0.05] absolute inset-0" />

    <!-- Main content -->
    <div class="relative flex min-h-screen items-center">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center lg:flex-row lg:justify-between">
          <!-- Error code section -->
          <div class="text-center lg:w-1/2 lg:text-left">
            <h1
              class="text-[8rem] font-bold leading-none text-white opacity-50 sm:text-[10rem] lg:text-[12rem]"
              style="text-shadow: 4px 4px 0px rgba(0,0,0,0.1)"
            >
              {{ errorCode }}
            </h1>
            <div class="mt-4 text-xl font-medium text-white/80">
              Error Code
            </div>
          </div>

          <!-- Message section -->
          <div class="mt-8 text-center lg:mt-0 lg:w-1/2 lg:text-left">
            <h2 class="text-4xl font-bold text-white">
              {{ getErrorTitle }}
              <span class="ml-2 inline-block animate-bounce">
                {{ getErrorEmoji }}
              </span>
            </h2>

            <p class="mt-4 text-lg text-white/80">
              {{ getErrorMessage }}
            </p>

            <!-- Action buttons -->
            <div class="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-amber-500 shadow-lg transition-all hover:bg-opacity-90 hover:shadow-xl"
                @click="handleHomeRedirect"
              >
                <Icon name="heroicons:home" class="mr-2 size-5" />
                Return Home
              </button>

              <button
                v-if="errorCode === '500'"
                type="button"
                class="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10"
                @click="handleReload"
              >
                <Icon name="heroicons:arrow-path" class="mr-2 size-5" />
                Try Again
              </button>
            </div>

            <!-- Additional help text -->
            <p class="mt-6 text-sm text-white/60">
              Our site has recently been updated. If you're looking for an old page,
              please visit our new homepage to find what you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const errorCode = computed(() => route.query.code || '404');

// Get appropriate error title based on error code
const getErrorTitle = computed(() => {
  switch (errorCode.value) {
    case '404':
      return 'Page Not Found';
    case '500':
      return 'Server Error';
    case '403':
      return 'Access Denied';
    default:
      return 'Something Went Wrong';
  }
});

// Get appropriate emoji based on error code
const getErrorEmoji = computed(() => {
  switch (errorCode.value) {
    case '404':
      return '🔍';
    case '500':
      return '🔧';
    case '403':
      return '🔒';
    default:
      return '😕';
  }
});

// Get appropriate error message based on error code
const getErrorMessage = computed(() => {
  switch (errorCode.value) {
    case '404':
      return 'We couldn\'t find the page you\'re looking for. It might have been moved or deleted.';
    case '500':
      return 'Our servers encountered an error. Please try again later.';
    case '403':
      return 'You don\'t have permission to access this page.';
    default:
      return 'An unexpected error occurred while processing your request.';
  }
});

function handleHomeRedirect() {
  window.location.href = 'https://www.aaron-shih.com';
}

function handleReload() {
  window.location.reload();
}
</script>

<style scoped>
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
