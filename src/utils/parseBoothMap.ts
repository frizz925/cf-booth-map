import { assign, range, rangeRight, zip } from 'lodash';
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
  return renderedData.reduce((curry, clusterData) => {
    if (clusterData.orientation === 'clustered') {
      curry.push(parseClusteredOrientation(clusterData));
    } else {
      curry.push(parseCluster(clusterData));
    }
    return curry;
  }, []);
}

function parseClusteredOrientation(data: ClusterData): Cluster {
  const clusteredData = zip(
    data.range.split('|'),
    data.suffixes.split('|'),
  );
  const cells = clusteredData.reduce((curry, zipped, idx) => {
    const [numberRange, suffixes] = zipped;
    const clusterData = assign({}, data, {
      orientation: idx === 0 || idx === 3 ? 'horizontal' : 'vertical',
      direction: idx === 0 ? 'up' :
        idx === 1 ? 'left' :
        idx === 2 ? 'right' :
        'down',
      range: numberRange,
      suffixes,
    });

    const clusterCells = parseCluster(clusterData).cells;
    if (idx === 3) {
      curry.push(clusterCells[0]);
    } else if (idx === 2) {
      clusterCells.forEach((row, i) => {
        curry[i + 1].push(row[0]);
      });
    } else {
      return curry.concat(clusterCells);
    }
    return curry;
  }, []);
  return createCluster(data, cells);
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
  }, []);

  return createCluster(data, cells.reduce((curry, cell) => {
    if (data.orientation === 'horizontal') {
      if (curry.length <= 0) {
        curry.push([]);
      }
      curry[0].push(cell);
    } else {
      curry.push([cell]);
    }
    return curry;
  }, []));
}

function createCluster(data: ClusterData, cells: Cell[][]): Cluster {
  return {
    name: data.cluster,
    top: data.top,
    left: data.left,
    width: data.right - data.left,
    height: data.bottom - data.top,
    cells,
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
