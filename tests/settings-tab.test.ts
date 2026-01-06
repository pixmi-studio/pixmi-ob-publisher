import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PixmiSettingTab } from '../src/settings-tab';
// @ts-ignore
import { getCreatedSettings, clearCreatedSettings } from '../__mocks__/obsidian';

describe('PixmiSettingTab', () => {
  let plugin: any;
  let tab: PixmiSettingTab;
  let containerEl: HTMLElement;

  beforeEach(() => {
    clearCreatedSettings();
    containerEl = document.createElement('div');
    plugin = {
      settings: { appId: '', appSecret: '' },
      saveSettings: vi.fn().mockResolvedValue(undefined)
    };
    tab = new PixmiSettingTab({} as any, plugin);
    (tab as any).containerEl = containerEl;
  });

  it('should be defined', () => {
    expect(PixmiSettingTab).toBeDefined();
  });

  it('should update appId when changed in UI', async () => {
    tab.display();
    const settings = getCreatedSettings();
    const appIdSetting = settings.find((s: any) => s.name === 'WeChat AppID');
    
    expect(appIdSetting).toBeDefined();
    await appIdSetting.onChangeCb('new-app-id');
    
    expect(plugin.settings.appId).toBe('new-app-id');
    expect(plugin.saveSettings).toHaveBeenCalled();
  });

  it('should update appSecret when changed in UI', async () => {
    tab.display();
    const settings = getCreatedSettings();
    const appSecretSetting = settings.find((s: any) => s.name === 'WeChat AppSecret');
    
    expect(appSecretSetting).toBeDefined();
    await appSecretSetting.onChangeCb('new-app-secret');
    
    expect(plugin.settings.appSecret).toBe('new-app-secret');
    expect(plugin.saveSettings).toHaveBeenCalled();
  });
});