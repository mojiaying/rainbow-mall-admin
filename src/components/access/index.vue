<script setup lang="ts">
import {useMenuAccess} from "@/composables/access.ts";
import Error from "@/pages/exception/error.vue";
defineProps(['access'])
const { hasAccess } = useMenuAccess()
</script>

<template>
  <slot v-if="hasAccess(access)" />
  <Error v-else />
</template>
