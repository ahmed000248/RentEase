const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = {
  step1: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNjYwM2M4ZTUwM2ZiMzc4ODcyMTk2ODU2EgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086",
  step2: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNjljMzY3MDcwOTY4ODJkMDIxMDM4ZWUxEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086",
  step3: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmAwMjA3ZDcwNGU3NGQ2MmM1M2RhNzEwEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086",
  step4: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmNmM2ZjNjQwNGU3NGY0NWMxMjk1NWJkEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086",
  step5: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmM5MzgwODYwOTY4YmFjNmZmM2MyY2JkEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086"
};

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        download(res.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status Code: ${res.statusCode} for URL: ${url}`));
        return;
      }
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(urls)) {
    const dest = path.join(__dirname, `${name}.html`);
    try {
      await download(url, dest);
    } catch (err) {
      console.error(`Failed to download ${name}:`, err.message);
    }
  }
}

run().catch(console.error);
