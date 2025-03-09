const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');
const path = require('path');

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

// Helper function to build a slug from the first line of content
function buildSlug(line) {
  return line
    .replace(/^[#\s]+/, '')
    .replace(/\s+$/, '')
    .replace(/[^A-Za-z0-9]/g, '-')
    .toLowerCase();
}

// Helper function to generate PDF
async function generatePdf(req) {
  const userGuid = (req.query.userGuid || '').replace(/[^A-Za-z0-9]/g, '');
  const lines = req.query.content.split('\n');
  const slug = buildSlug(lines[0]) || 'lyrics';
  const content = lines.map(line => line + '  ').join('\n');
  const css = req.query.css;

  console.log(`User GUID: ${userGuid}`);
  console.log(`Content: ${content}`);
  console.log(`CSS: ${css}`);

  const filename = `${userGuid}.pdf`;
  const filepath = './output/' + filename;

  try {
    await mdToPdf({
      content: content
    }, {
      css: css,
      dest: filepath,
      pdf_options: {
        format: "Legal",
        margin: {},
        printBackground: true
      }
    });
    return { filepath, slug, userGuid };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

router.get('/preview.pdf', async function(req, res) {
  try {
    const { filepath } = await generatePdf(req);
    res.contentType("application/pdf");
    res.sendFile(path.resolve(filepath));
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
});

router.get('/download.pdf', async function(req, res) {
  try {
    const { filepath, slug, userGuid } = await generatePdf(req);
    res.contentType("application/octet-stream");
    res.setHeader('Content-Disposition', `attachment; filename="${slug}-${userGuid}.pdf"`);
    res.sendFile(path.resolve(filepath));
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;
