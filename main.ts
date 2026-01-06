import { Plugin } from 'obsidian';

export default class PixmiObPublisher extends Plugin {
  async onload() {
    console.log('PixmiObPublisher loaded');
  }

  onunload() {
    console.log('PixmiObPublisher unloaded');
  }
}
