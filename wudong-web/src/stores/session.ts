import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserBrief } from '../types'
import { getUser } from '../data/mock'

export const useSession = defineStore('session', () => {
  const user = ref<UserBrief | undefined>(undefined)
  const isLogged = computed(() => !!user.value)
  function login(): void {
    user.value = getUser(1)
  }
  return { user, isLogged, login }
})
