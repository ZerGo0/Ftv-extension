import { emoteStore } from './emotes.svelte';
import { emoteProviderStore } from './providers.svelte';
import type { EmoteProviderType, Provider } from './providers/provider';

const storageKey = 'ftv-emote-tweaks';

export const emoteProviderToggleTypes = [
  'zergo0Bot',
  'twitchUser',
  'sevenTvUser',
  'ffzUser',
  'bttvUser',
  'sevenTvGlobal',
  'ffzGlobal',
  'bttvGlobal',
  'twitchGlobal'
] as const;

export type EmoteProviderToggleType = (typeof emoteProviderToggleTypes)[number];

export type EmoteProviderToggleSettings = Record<EmoteProviderToggleType, boolean>;

export const emoteProviderTypeLabels: Record<EmoteProviderToggleType, string> = {
  zergo0Bot: 'ZerGo0_Bot Emotes',
  twitchUser: 'Twitch Sub Emotes',
  sevenTvUser: '7TV User Emotes',
  ffzUser: 'FFZ User Emotes',
  bttvUser: 'BTTV User Emotes',
  twitchGlobal: 'Twitch Global Emotes',
  sevenTvGlobal: '7TV Global Emotes',
  ffzGlobal: 'FFZ Global Emotes',
  bttvGlobal: 'BTTV Global Emotes'
};

const defaultEmoteProviderToggleSettings = emoteProviderToggleTypes.reduce(
  (settings, providerType) => {
    settings[providerType] = true;
    return settings;
  },
  {} as EmoteProviderToggleSettings
);

function loadEmoteProviderToggleSettings(): EmoteProviderToggleSettings {
  try {
    const rawSettings = localStorage.getItem(storageKey);
    if (!rawSettings) {
      return defaultEmoteProviderToggleSettings;
    }

    const parsedSettings = JSON.parse(rawSettings) as Partial<EmoteProviderToggleSettings>;
    return emoteProviderToggleTypes.reduce((settings, providerType) => {
      settings[providerType] =
        parsedSettings[providerType] ?? defaultEmoteProviderToggleSettings[providerType];
      return settings;
    }, {} as EmoteProviderToggleSettings);
  } catch (error) {
    console.warn('Could not parse emote tweak settings', error);
    return defaultEmoteProviderToggleSettings;
  }
}

function saveEmoteProviderToggleSettings(settings: EmoteProviderToggleSettings) {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

function isEmoteProviderToggleType(
  providerType: EmoteProviderType
): providerType is EmoteProviderToggleType {
  return emoteProviderToggleTypes.includes(providerType as EmoteProviderToggleType);
}

function isProviderEnabled(provider: Provider, settings: EmoteProviderToggleSettings): boolean {
  if (!isEmoteProviderToggleType(provider.type)) {
    return true;
  }

  return settings[provider.type];
}

class EmoteTweakSettingsStore {
  emoteProviders: EmoteProviderToggleSettings = $state(loadEmoteProviderToggleSettings());

  setEmoteProviderEnabled(type: EmoteProviderToggleType, enabled: boolean) {
    this.emoteProviders = {
      ...this.emoteProviders,
      [type]: enabled
    };
    saveEmoteProviderToggleSettings(this.emoteProviders);
  }
}

export const emoteTweakSettings = new EmoteTweakSettingsStore();

export function applyEmoteProviderTweaks() {
  emoteProviderStore.providers = emoteProviderStore.allProviders.filter((provider) =>
    isProviderEnabled(provider, emoteTweakSettings.emoteProviders)
  );
  emoteStore.setEmotes(emoteProviderStore.providers.flatMap((provider) => provider.emotes));
}
