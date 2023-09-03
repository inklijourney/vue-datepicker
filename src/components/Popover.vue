<script setup lang="ts">
import { createPopper } from '@popperjs/core'
import type { Instance, Options } from '@popperjs/core'

const popoverRef = ref<HTMLElement | null>(null)

const popperInstance = ref<Instance | null>(null)

const isVisible = ref(false)

const hide = () => {
  isVisible.value = false
}

const show = () => {
  isVisible.value = true
  popperInstance.value?.update()
}

const toggleVisible = () => {
  isVisible.value = !isVisible.value
  popperInstance.value?.update()
}

const initPopover = (targetRef: HTMLElement, options: Options) => {
  popperInstance.value = createPopper(targetRef, popoverRef.value!, options)
}

defineExpose({ hide, show, toggleVisible, popoverRef, popperInstance, initPopover, isVisible })
</script>

<template>
  <Transition>
    <div v-show="isVisible" ref="popoverRef" class="popover bg-white">
      <!-- <div class="popoer-arrow arrow" data-popper-arrow /> -->
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.popoer-arrow{
@apply after:absolute after:rotate-[45deg] after:w-4 after:h-4 after:visible invisible absolute left-0 w-4
after:border after:border-gray-200 after:border-r-0 after:border-b-0 after:bg-white

}

.popover[data-popper-placement^='top'] > .arrow {
  bottom: -8px;
}

.popover[data-popper-placement^='bottom'] > .arrow {
  top: -8px;
}

.popover[data-popper-placement^='left'] > .arrow {
  right: -8px;
}

.popover[data-popper-placement^='right'] > .arrow {
  left: -8px;
}
</style>
