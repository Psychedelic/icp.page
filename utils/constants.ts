// for social menu list
export const socialKeys = [
  { key: 'twitter', icon: '/twitter.svg' },
  { key: 'discord', icon: '/discord.svg' },
  { key: 'telegram', icon: '/telegram.svg' },
  { key: 'github', icon: '/github.svg' },
  { key: 'email', icon: '/mail.svg' }
]

/**
 * @param loading not loaded domain.
 * @param unclaimed noone owns it.
 * @param NoRecord owned but no record on it.
 * @param 
 */
export enum domainStatus {
  loading,
  loaded,
}