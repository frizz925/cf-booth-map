import { assign, range, rangeRight } from 'lodash';
import { Cell, Cluster } from '../models/BoothMap';

interface ClusterData {
  cluster?: string;
  clusterRange?: string;
  clusterDirection?: string;
  clusterGap?: {
    top: number;
    left: number;
  };

  orientation: string;
  direction?: string;

  top: number;
  left: number;
  right: number;
  bottom: number;

  range: string;
  suffixes: string;
}

export default function parse(mapData: ClusterData[]): Cluster[] {
  const result: Cluster[] = [];
  mapData.forEach((data) => {
    if (data.clusterRange) {
      result.push(...parseClusterRange(data));
    } else if (data.cluster) {
      result.push(parseCluster(data));
    }
  });
  return result;
}

function parseClusterRange(data: ClusterData): Cluster[] {
  const { clusterDirection, clusterGap } = data;
  const clusterRange = parseRange(data.clusterRange);
  const renderedData = clusterRange.map((cluster, idx): ClusterData => {
    const leftGap = (data.right - data.left + clusterGap.left) * idx;
    const topGap = (data.bottom - data.top + clusterGap.top) * idx;
    const leftAdd = clusterDirection === 'right' ? leftGap : clusterDirection === 'left' ? -leftGap : 0;
    const topAdd = clusterDirection === 'down' ? topGap : clusterDirection === 'up' ? -topGap : 0;

    return assign({}, data, {
      cluster,
      left: data.left + leftAdd,
      top: data.top + topAdd,
      right: data.right + leftAdd,
      bottom: data.bottom + topAdd,
    });
  });
  return renderedData.map((x) => parseCluster(x));
}

function parseCluster(data: ClusterData): Cluster {
  const numberRange = parseRange(data.range);
  const suffixes = parseRange(data.suffixes);
  const cells = numberRange.reduce((curry, num) => {
    suffixes.map((suffix) => {
      curry.push({
        prefix: data.cluster,
        number: parseInt(num, 10),
        suffix,
      });
    });
    return curry;
  }, [] as Cell[]);

  return {
    name: data.cluster,
    top: data.top,
    left: data.left,
    cells: cells.reduce((curry, cell) => {
      if (data.orientation === 'horizontal') {
        if (curry.length <= 0) {
          curry.push([]);
        }
        curry[0].push(cell);
      } else {
        curry.push([cell]);
      }
      return curry;
    }, [] as Cell[][]),
  };
}

function parseRange(textRange?: string): string[] {
  if (!textRange) {
    return [];
  } else if (textRange.indexOf(',') >= 0) {
    return textRange.split(',').reduce(
      (curry, text) => curry.concat(parseRange(text)),
      [] as string[],
    );
  } else if (textRange.indexOf('-') < 0) {
    return [textRange];
  }

  let isCharRange = true;
  const [min, max] = textRange.split('-').map((x) => {
    const num = parseInt(x, 10);
    if (!isNaN(num)) {
      isCharRange = false;
      return num;
    }
    return x.charCodeAt(0);
  });
  const numberRange = min <= max ?
    range(min, max + 1) :
    rangeRight(max, min + 1);
  return numberRange.map((x) => isCharRange ? String.fromCharCode(x) : x.toString());
}
