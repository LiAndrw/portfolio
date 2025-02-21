let data = [];

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line),
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
  }));

  processCommits();
  displayStats();
  console.log(commits);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    createScatterplot();
});

let commits = d3.groups(data, (d) => d.commit);

function updateTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (Object.keys(commit).length === 0) return;

  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'full',
  });
  time.textContent = commit.datetime?.toLocaleTimeString('en', { timeStyle: 'short' });
  author.textContent = commit.author || "Unknown";
  lines.textContent = commit.totalLines ?? "N/A";
}

function processCommits() {
  commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;

      let ret = {
          id: commit,
          url: `https://github.com/LiAndrw/portfolio/commit/` + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
          value: lines,
          enumerable: false,
          writable: false,
          configurable: false,
      });

      return ret;
  });
}

function displayStats() {
  processCommits(); 

  const statsContainer = d3.select('#stats');
  statsContainer.append('h2').text('Summary');

  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
  dl.append('dd').text(data.length);

  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  const numFiles = d3.group(data, (d) => d.file).size;
  dl.append('dt').text('Number of files');
  dl.append('dd').text(numFiles);

  const maxFileLength = d3.max(data, (d) => d.line);
  dl.append('dt').text('Longest file (in lines)');
  dl.append('dd').text(maxFileLength);

  const fileLengths = d3.rollups(data, (v) => d3.max(v, (d) => d.line), (d) => d.file);
  const avgFileLength = d3.mean(fileLengths, (d) => d[1]);
  dl.append('dt').text('Average file length');
  dl.append('dd').text(Math.round(avgFileLength));

  const workByPeriod = d3.rollups(
      data,
      (v) => v.length,
      (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  dl.append('dt').text('Most active time of day');
  dl.append('dd').text(maxPeriod);
}

function createScatterplot() {

  const width = 1000;
  const height = 600;

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

  const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');
  
  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
   .call(xAxis);

  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

      
  const sortedCommits = [...commits].sort((a, b) => b.totalLines - a.totalLines);
  
  function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
  }
  
  function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
  }

  const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines) || [0, 1];

  const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);
  
  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width))  
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 0.5);

  const dots = svg.append('g').attr('class', 'dots');

  dots
  .selectAll('circle')
  .data(sortedCommits)
  .join('circle')
  .attr('cx', (d) => xScale(d.datetime))
  .attr('cy', (d) => yScale(d.hourFrac))
  .attr('r', (d) => rScale(d.totalLines))
  .style('fill-opacity', 0.7)
  .attr('fill', (d) => (d.hourFrac >= 6 && d.hourFrac < 18 ? 'orange' : 'steelblue'))
  .on('mouseenter', function (event, d) {
    d3.select(this).style('fill-opacity', 1);
    updateTooltipContent(d);
    updateTooltipVisibility(true);
    updateTooltipPosition(event);
  })
  .on('mouseleave', function () {
    d3.select(this).style('fill-opacity', 0.7);
    updateTooltipContent({});
    updateTooltipVisibility(false);
  });
}

