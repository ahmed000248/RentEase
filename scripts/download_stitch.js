const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  {
    step: 1,
    id: 'd4ef416162884943aba53f57808bc153',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNjYwM2M4ZTUwM2ZiMzc4ODcyMTk2ODU2EgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086'
  },
  {
    step: 2,
    id: 'c82f11d782204e52b2c8aa837c91c2a5',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNjljMzY3MDcwOTY4ODJkMDIxMDM4ZWUxEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086'
  },
  {
    step: 3,
    id: 'eafc7b9dd4264087881466e423009fd7',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmEwMjA3ZDcwNGU3NGQ2MmM1M2RhNzEwEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086'
  },
  {
    step: 4,
    id: '2fb47fe45a4f4339bbe1633c84ecc68b',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmNmM2ZjNjQwNGU3NGY0NWMxMjk1NWJkEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086'
  },
  {
    step: 5,
    id: '66dd752c189c4b1fb9b21ace58baf21d',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmM5MzgwODYwOTY4YmFjNmZmM2MyY2JkEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086'
  }
];

const outputDir = path.join(__dirname, 'stitch_html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

screens.forEach(screen => {
  const filePath = path.join(outputDir, `step_${screen.step}_${screen.id}.html`);
  console.log(`Downloading Step ${screen.step} from ${screen.url}...`);
  
  https.get(screen.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode === 302 || res.statusCode === 301) {
      console.log(`Redirected to ${res.headers.location}`);
      https.get(res.headers.location, (redirectRes) => {
        const fileStream = fs.createWriteStream(filePath);
        redirectRes.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`Saved Step ${screen.step} to ${filePath}`);
        });
      });
    } else {
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log(`Saved Step ${screen.step} to ${filePath}`);
      });
    }
  }).on('error', (err) => {
    console.error(`Error downloading step ${screen.step}:`, err.message);
  });
});
