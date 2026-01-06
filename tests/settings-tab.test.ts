import { describe, it, expect, vi } from 'vitest';
import { PluginSettingTab } from 'obsidian';
import { PixmiSettingTab } from '../settings-tab';

describe('PixmiSettingTab', () => {
  it('should be defined', () => {
    expect(PixmiSettingTab).toBeDefined();
  });

  it('should extend PluginSettingTab', () => {
    const plugin = { settings: {} } as any;
    const tab = new PixmiSettingTab({} as any, plugin);
    expect(tab).toBeInstanceOf(PluginSettingTab);
  });

  it('should have a display method', () => {
    const plugin = { settings: {} } as any;
    const tab = new PixmiSettingTab({} as any, plugin);
    expect(tab.display).toBeDefined();
  });
});
