const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const css = fs.readFileSync('./prompter.css', 'utf8');
  res.render('index', {
    title: 'Prompter',
    css: css
  });
});

router.get('/preview.pdf', function(req, res) {
  const lines = req.query.content.split('\n');
  const content = lines.map(line => line + '  ').join('\n');
  const css = req.query.css;

  console.log(`Content: ${content}`);
  console.log(`CSS: ${css}`);

  const filename = 'output.pdf';
  const filepath = './output/' + filename;

  mdToPdf({
    content: content
  }, {
    css: css,
    dest: filepath,
    pdf_options: {
      format: "Legal",
      margin: {},
      printBackground: true
    }
  })
  .then(() => {
    res.contentType("application/pdf");
    res.sendFile(require('path').resolve(filepath));
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error generating PDF');
  });
});

module.exports = router;
