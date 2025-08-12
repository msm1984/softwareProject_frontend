import { Options } from 'vis';

export function getOptions() {
  const dataSetValue = document.body.getAttribute('data-theme');

  const labelColor: string =
    dataSetValue == 'dark' ? '#b5c4ff' : 'rgb(27, 89, 248)';

  const labelBorder: string =
    dataSetValue != 'dark' ? '#b5c4ff' : 'rgba(27, 89, 248, 0.8)';

  const labelHighlight: string = dataSetValue == 'dark' ? '#d1defe' : '#d1defe';

  const textColor: string =
    dataSetValue == 'dark' ? 'rgba(255,255,255,0.9)' : '#222';

  const svgDataUrl =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="${labelColor}" >
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
        </svg>
    `);

  return {
    physics: {
      stabilization: true,
      barnesHut: { damping: 1, springLength: 150 },
    },
    edges: {
      smooth: { enabled: false, type: 'vertical', roundness: 0 },
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
        },
      },
      arrowStrikethrough: false,
      font: {
        align: 'middle',
        color: textColor,
        strokeWidth: 0,
        face: 'MyCustomFont',
      },
    },
    nodes: {
      shape: 'image',
      image: svgDataUrl,
      color: {
        background: labelColor,
        border: labelBorder,
        highlight: {
          background: labelHighlight,
          border: labelBorder,
        },
      },
      font: {
        align: 'center',
        color: textColor,
        face: 'MyCustomFont',
      },
    },
  } as Options;
}

export function getSvg(color: string, borderColor = color) {
  return (
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="${color}"  stroke-width="2" stroke="${borderColor}">
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
        </svg>
    `)
  );
}
