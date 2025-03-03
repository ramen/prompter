class App {
  constructor() {
  }

  init() {
    document.getElementById('preview-btn').addEventListener('click', this.preview.bind(this));
    this.preview();
  }

  pdfUrl() {
    const content = document.getElementById('content').value;
    const css = document.getElementById('css').value;
    return '/preview.pdf?content=' + encodeURIComponent(content) + '&css=' + encodeURIComponent(css);
  }

  preview() {
    const iframe = document.getElementById('preview');
    const url = this.pdfUrl();
    iframe.src = url;
    document.getElementById('download').href = url;
  }
}
