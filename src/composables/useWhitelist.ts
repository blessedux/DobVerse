import { computed } from 'vue'

export function useWhitelist() {
  const whitelistedAddresses = computed(() => {
    const addresses = import.meta.env.VITE_WHITELISTED_ADDRESSES || ''
    return addresses
      .split(',')
      .map((addr: string) => addr.trim().toLowerCase())
      .filter((addr: string) => addr.startsWith('0x'))
  })

  const isAddressWhitelisted = (address: string) => {
    return whitelistedAddresses.value.includes(address.toLowerCase())
  }

  return {
    whitelistedAddresses,
    isAddressWhitelisted
  }
} 