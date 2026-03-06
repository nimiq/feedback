<script setup lang="ts">
import arrowLeft from '../../../shared/icons/nimiq/arrow-left.svg?raw'
import check from '../../../shared/icons/nimiq/check.svg?raw'
import cross from '../../../shared/icons/nimiq/cross.svg?raw'
import exclamation from '../../../shared/icons/nimiq/exclamation.svg?raw'
import info from '../../../shared/icons/nimiq/info.svg?raw'
import leaf2Filled from '../../../shared/icons/nimiq/leaf-2-filled.svg?raw'
import logosGithub from '../../../shared/icons/nimiq/logos-github.svg?raw'
import mountainFrame from '../../../shared/icons/nimiq/mountain-frame.svg?raw'
import spinner from '../../../shared/icons/nimiq/spinner.svg?raw'
import star from '../../../shared/icons/nimiq/star.svg?raw'
import thumbUpThumbDown from '../../../shared/icons/nimiq/thumb-up-thumb-down.svg?raw'

const { name } = defineProps<{
  name:
    | 'arrow-left'
    | 'check'
    | 'cross'
    | 'exclamation'
    | 'info'
    | 'leaf-2-filled'
    | 'logos-github'
    | 'mountain-frame'
    | 'spinner'
    | 'star'
    | 'thumb-up-thumb-down'
}>()

const icons = {
  'arrow-left': arrowLeft,
  'check': check,
  'cross': cross,
  'exclamation': exclamation,
  'info': info,
  'leaf-2-filled': leaf2Filled,
  'logos-github': logosGithub,
  'mountain-frame': mountainFrame,
  'spinner': spinner,
  'star': star,
  'thumb-up-thumb-down': thumbUpThumbDown,
} as const
</script>

<template>
  <span
    aria-hidden="true"
    class="inline-flex h-full w-full [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg]:stroke-current"
    v-html="icons[name]"
  />
</template>
