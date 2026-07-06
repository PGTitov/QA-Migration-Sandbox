/**
 * Test configuration
 */

export const testConfig = {
  baseUrl: 'https://demoqa.com',
  
  pages: {
    elements: '/elements',
    textBox: '/text-box',
    checkbox: '/checkbox',
    radioButton: '/radio-button',
    buttons: '/buttons',
    links: '/links',
    uploadDownload: '/upload-download',
    dynamicProperties: '/dynamic-properties',
    
    forms: '/automation-practice-form',
    
    widgets: {
      accordian: '/accordian',
      autoComplete: '/auto-complete',
      datePicker: '/date-picker',
      slider: '/slider',
      progressBar: '/progress-bar',
      tabs: '/tabs',
      toolTips: '/tool-tips',
      menu: '/menu',
      selectMenu: '/select-menu',
    },
    
    alerts: {
      browserWindows: '/browser-windows',
      alerts: '/alerts',
      frames: '/frames',
      nestedFrames: '/nestedframes',
      modalDialogs: '/modal-dialogs',
    },
    
    interactions: {
      sortable: '/sortable',
      selectable: '/selectable',
      resizable: '/resizable',
      droppable: '/droppable',
      draggable: '/dragabble',
    },
    
    bookStore: {
      login: '/login',
      books: '/books',
      profile: '/profile',
      swagger: '/swagger',
    },
  },
};

/**
 * Helper function to get full URL for a page
 */
export const getUrl = (path: string): string => {
  return `${testConfig.baseUrl}${path}`;
};
