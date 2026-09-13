export interface StyleOption {
  id: string
  label: string
  /** Prompt fragment appended to the dream description. */
  modifiers: string
  /** Small emoji used as a visual token in the UI. */
  icon: string
}

export interface MoodOption {
  id: string
  label: string
  modifiers: string
  icon: string
}

export interface AspectOption {
  id: string
  label: string
  width: number
  height: number
  icon: string
}

export const STYLES: StyleOption[] = [
  {
    id: 'dreamscape',
    label: 'Dreamscape',
    icon: '🌌',
    modifiers:
      'surreal dreamscape, ethereal, soft volumetric light, floating elements, hyper-detailed, painterly',
  },
  {
    id: 'ethereal',
    label: 'Ethereal',
    icon: '✨',
    modifiers:
      'ethereal, luminous, glowing particles, gossamer mist, delicate pastel palette, otherworldly beauty',
  },
  {
    id: 'oil',
    label: 'Oil Painting',
    icon: '🎨',
    modifiers:
      'classical oil painting, thick expressive brushstrokes, rich chiaroscuro, museum quality',
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    icon: '💧',
    modifiers:
      'delicate watercolor illustration, bleeding pigments, soft washes, textured paper, hand painted',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    icon: '🌃',
    modifiers:
      'cyberpunk, neon-drenched, rain-slicked streets, holographic signage, cinematic, blade runner mood',
  },
  {
    id: 'anime',
    label: 'Anime',
    icon: '🌸',
    modifiers:
      'anime key visual, cel shaded, vibrant, cinematic composition, studio ghibli inspired atmosphere',
  },
  {
    id: 'photoreal',
    label: 'Photoreal',
    icon: '📷',
    modifiers:
      'photorealistic, 35mm photograph, natural depth of field, cinematic lighting, ultra detailed, 8k',
  },
  {
    id: 'lowpoly',
    label: 'Retro 3D',
    icon: '🕹️',
    modifiers:
      'stylized low-poly 3d render, soft studio lighting, playful pastel gradients, isometric charm',
  },
  {
    id: 'gothic',
    label: 'Dark Fantasy',
    icon: '🕯️',
    modifiers:
      'dark fantasy, gothic, moody atmosphere, intricate detail, dramatic rim lighting, ominous grandeur',
  },
  {
    id: 'vaporwave',
    label: 'Vaporwave',
    icon: '📼',
    modifiers:
      'vaporwave aesthetic, retro 80s, magenta and cyan gradients, chrome, grid horizon, nostalgic glow',
  },
]

export const MOODS: MoodOption[] = [
  { id: 'serene', label: 'Serene', icon: '🕊️', modifiers: 'calm, peaceful, tranquil, gentle' },
  { id: 'joyful', label: 'Joyful', icon: '🌞', modifiers: 'joyful, warm, bright, uplifting, radiant' },
  { id: 'mysterious', label: 'Mysterious', icon: '🌙', modifiers: 'mysterious, enigmatic, shadowy, intriguing' },
  { id: 'epic', label: 'Epic', icon: '⚡', modifiers: 'epic scale, awe-inspiring, grand, majestic, cinematic' },
  { id: 'melancholy', label: 'Melancholy', icon: '🌧️', modifiers: 'melancholic, wistful, bittersweet, muted tones' },
  { id: 'whimsical', label: 'Whimsical', icon: '🎠', modifiers: 'whimsical, playful, charming, storybook wonder' },
  { id: 'nightmare', label: 'Uncanny', icon: '👁️', modifiers: 'uncanny, eerie, dreamlike distortion, liminal, surreal tension' },
]

export const ASPECTS: AspectOption[] = [
  { id: 'square', label: 'Square', width: 1024, height: 1024, icon: '⬜' },
  { id: 'portrait', label: 'Portrait', width: 832, height: 1216, icon: '📱' },
  { id: 'landscape', label: 'Landscape', width: 1216, height: 832, icon: '🖼️' },
  { id: 'wide', label: 'Cinematic', width: 1280, height: 720, icon: '🎬' },
]

export const DREAM_PROMPTS: string[] = [
  'I was floating through a library where every book was a glowing jellyfish drifting between the shelves.',
  'A whale made of constellations swam silently above a sleeping city, trailing stardust.',
  'I found a staircase in the ocean that led up into a sky full of paper lanterns.',
  'My childhood home was on the back of a giant tortoise walking across an endless desert of mirrors.',
  'Rain fell upward into a violet sky while clocks melted over the branches of a crystal tree.',
  'I danced with my shadow in a ballroom made entirely of moonlight and falling cherry blossoms.',
  'A door in the forest opened onto a beach where the waves were made of shifting golden sand.',
  'I rode a bicycle across the rings of Saturn as glowing koi fish swam through the empty space around me.',
  'The train had no walls and traveled through a storm of luminous butterflies over a sea of clouds.',
  'A lighthouse grew like a flower from the center of my grandmother’s garden, sweeping light over silver wheat.',
]
