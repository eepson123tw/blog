<template>
  <UiPopover>
    <UiPopoverTrigger as-child>
      <UiButton variant="ghost" size="icon">
        <Icon name="lucide:languages" size="16" />
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent
      class="w-[23rem]"
      :align="breakpoints.isGreaterOrEqual('md') ? 'end' : 'center'"
    >
      <I18nSwitcher />
    </UiPopoverContent>
  </UiPopover>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';


const breakpoints = useBreakpoints(breakpointsTailwind);
</script>
