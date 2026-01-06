import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PixmiSettingTab } from '../src/settings-tab';
// @ts-ignore
import { getCreatedSettings, clearCreatedSettings } from '../__mocks__/obsidian';
import { Notice } from 'obsidian';

vi.mock('obsidian', async () => {
    const actual = await vi.importActual('obsidian') as any;
    return {
        ...actual,
        Notice: vi.fn()
    };
});

describe('PixmiSettingTab', () => {
  let plugin: any;
  let tab: PixmiSettingTab;
  let containerEl: HTMLElement;

  beforeEach(() => {
    clearCreatedSettings();
    containerEl = document.createElement('div');
    plugin = {
      settings: { appId: '', appSecret: '' },
      saveSettings: vi.fn().mockResolvedValue(undefined),
      apiClient: {
        getAccessToken: vi.fn()
      }
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

  it('should have a Test Connection button', () => {
    tab.display();
    const settings = getCreatedSettings();
    const testBtn = settings.find((s: any) => s.name === 'Test Connection');
    expect(testBtn).toBeDefined();
  });

  it('should call api client when test button clicked', async () => {
    plugin.apiClient.getAccessToken.mockResolvedValue('token');
    tab.display();
    const settings = getCreatedSettings();
    const testBtn = settings.find((s: any) => s.name === 'Test Connection');
    
    await testBtn.onClickCb();
    
    expect(plugin.apiClient.getAccessToken).toHaveBeenCalled();
    expect(Notice).toHaveBeenCalledWith('Connection successful!');
  });

  it('should show error notice when connection fails', async () => {
    plugin.apiClient.getAccessToken.mockRejectedValue(new Error('Auth failed'));
    tab.display();
    const settings = getCreatedSettings();
    const testBtn = settings.find((s: any) => s.name === 'Test Connection');
    
    await testBtn.onClickCb();
    
    expect(plugin.apiClient.getAccessToken).toHaveBeenCalled();
    expect(Notice).toHaveBeenCalledWith('Connection failed: Error: Auth failed');
  });
});