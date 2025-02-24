export const BLOCK_TYPES = {
  INBOX: 'inbox',
  TODAY: 'today',
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];
