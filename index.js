const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const outerWidth = 900;
const outerHeight = 700;
const margin = {
  left: 60,
  top: 40,
  right: 40,
  bottom: 40
};
const innerWidth = outerWidth - margin.left - margin.right;
const innerHeight = outerHeight - margin.top - margin.bottom;

const svg = d3.select('.svg-container')
.append('svg')
.attr('width', outerWidth)
.attr('height', outerHeight);


d3.json(url)
.then(data => {
  const tooltip = d3.select('#tooltip');
  
  data.map(d => {
    d.Time = new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])
  })

  const xScale = d3.scaleLinear()
  .domain([d3.min(data, d => d['Year']) - 1, d3.max(data, d => d['Year']) + 1])
  .range([margin.left, innerWidth]);
  
  const yScale = d3.scaleLinear()
  .domain([d3.min(data, d => d["Seconds"]), d3.max(data, d => d['Seconds'])])
  .range([margin.top, innerHeight]);
  
  const formatTime = d3.timeFormat('%M:%S');
  
  svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d['Year']))
  .attr('cy', d => yScale(d['Seconds']))
  .attr('r', d => 9)
  .attr('fill', d => {
    return d['Doping'] === '' ? 'ivory' : '#ff4800'
  })
  .style('stroke', 'green')
  .attr('opacity', .7)
  .attr('class', 'dot')
  .attr('data-xvalue', d => d['Year'])
  .attr('data-yvalue', d => d['Time'].toISOString())
  .on('mouseover', d => {
    tooltip.transition()
    .duration(200)
    .style('opacity', .9)
    .attr('data-year', d['Year'])
    tooltip.html(`${d['Name']}: ${d['Nationality']}<br/>Year: ${d['Year']} Time: ${formatTime(d['Time'])}<br/><br/>${d['Doping']}`)
    .style('left', `${d3.event.pageX}px`)
    .style('top', `${d3.event.pageY}px`)
  })
  .on('mouseout', d => {
    tooltip.transition()
    .duration(100)
    .style('opacity', 0)
    .attr('data-year', '')
  })
  const xAxis = d3.axisBottom(xScale).tickFormat(d => d);

  const yAxis = d3.axisLeft(yScale).ticks(15).tickFormat(d => formatTime(new Date(d * 1000)));
  
  svg.append('g')
  .attr('transform', `translate(0, ${innerHeight})`)
  .attr('id', 'x-axis')
  .call(xAxis)
  
  
  svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .attr('id', 'y-axis')
  .call(yAxis);
  
  const firstLegend = svg.append('g')
  .attr('fill', 'white')
  .attr('id', 'legend')
  .attr('transform', `translate(770, 200)`)
  
  firstLegend.append('rect')
  .attr('width', 30)
  .attr('height', 30)
  .attr('fill', 'ivory')
  .attr('opacity', .7);
  
  firstLegend.append('text')
  .text('No doping allegations')
  .attr('transform', `translate(-130, 20)`)
  .style('font-size', '20px')
  .attr('fill', 'ivory');
  
  const secondLegend = svg.append('g')
  .attr('fill', 'white')
  .attr('id', 'legend')
  .attr('transform', `translate(770, 235)`)
  
  secondLegend.append('rect')
  .attr('width', 30)
  .attr('height', 30)
  .attr('fill', '#ff4800')
  .attr('opacity', .7);
  
  secondLegend.append('text')
  .text('Riders with doping allegations')
  .attr('transform', `translate(-180, 20)`)
  .style('font-size', '20px')
  .attr('fill', 'ivory');
});