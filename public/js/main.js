class App {
  constructor() {
    this.userGuid = '';
  }

  init() {
    this.userGuid = this.getUserGuid();

    // Add event listeners for preview button
    document.getElementById('preview-btn').addEventListener('click', this.preview.bind(this));

    // Add event listeners for content and CSS changes
    document.getElementById('content').addEventListener('input', this.updateDownloadLink.bind(this));
    document.getElementById('css').addEventListener('input', this.updateDownloadLink.bind(this));

    this.preview();
  }

  getUserGuid() {
    let guid = localStorage.getItem('user_guid');
    if (!guid) {
      guid = this.generateGuid();
      localStorage.setItem('user_guid', guid);
    }
    return guid;
  }

  generateGuid() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 12;
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  pdfUrl(task) {
    task = task || 'preview';
    const content = document.getElementById('content').value;
    const css = document.getElementById('css').value;
    return `/${task}.pdf` +
      '?userGuid=' + encodeURIComponent(this.userGuid) +
      '&content=' + encodeURIComponent(content) +
      '&css=' + encodeURIComponent(css);
  }

  updateDownloadLink() {
    document.getElementById('download').href = this.pdfUrl('download');
  }

  preview() {
    const iframe = document.getElementById('preview');
    iframe.src = this.pdfUrl('preview');
    this.updateDownloadLink();
  }
}
