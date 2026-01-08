export interface PixmiSettings {
  appId: string;
  appSecret: string;
  proxyUrl: string;
}

export const DEFAULT_SETTINGS: PixmiSettings = {
  appId: '',
  appSecret: '',
  proxyUrl: '',
};
