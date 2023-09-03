<script lang="ts" setup>
const emits = defineEmits(['confirm'])

const confirm = () => {
  emits('confirm')
}
</script>

<template>
  <div class="flex justify-between items-center mt-2">
    <slot name="switch" />
    <div class="ml-auto">
      <slot name="action" :confirm="confirm">
        <button
          type="button"
          class="bg-blue-600 text-white px-1 rounded hover:bg-blue-700"
          @click="confirm"
        >
          确定
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>

</style>
