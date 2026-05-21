const http = require('http');

http.get('http://localhost:3001/student-life', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('HTML Length:', data.length);
    console.log('Contains excalidraw-svg:', data.includes('excalidraw-svg'));
    console.log('Contains SVG tag:', data.includes('<svg'));
    console.log('Contains workspace-grid:', data.includes('workspace-grid'));
    console.log('Contains tabs-grid:', data.includes('tabs-grid'));
    // Let's print the tabs-grid HTML section
    const idx = data.indexOf('class="tabs-grid"');
    if (idx !== -1) {
      console.log('Tabs-grid HTML snippet:', data.substring(idx - 50, idx + 300));
    }
    const wIdx = data.indexOf('class="workspace-grid"');
    if (wIdx !== -1) {
      console.log('Workspace-grid HTML snippet:', data.substring(wIdx - 50, wIdx + 300));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching page:', err);
});
