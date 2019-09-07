import { pascalCase } from 'change-case';
import { assign, range, rangeRight, zip } from 'lodash';
import Booth, { Cluster, ClusterData, Direction, Orientation } from '../models/Booth';

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
  const booths = clusteredData.reduce((curry, zipped, idx) => {
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

    const clusterBooths = parseCluster(clusterData).booths;
    if (idx === 3) {
      curry.push(clusterBooths[0]);
    } else if (idx === 2) {
      clusterBooths.forEach((row, i) => {
        curry[i + 1].push(row[0]);
      });
    } else {
      return curry.concat(clusterBooths);
    }
    return curry;
  }, []);
  return createCluster(data, booths);
}

function parseCluster(data: ClusterData): Cluster {
  const direction = pascalCase(data.direction);
  const orientation = pascalCase(data.orientation);
  const numberRange = parseRange(data.range);
  const suffixes = parseRange(data.suffixes);
  const baseResult = {
    direction: Direction[direction],
    orientation: Orientation[orientation],
    prefix: data.cluster,
  };
  const booths = numberRange.reduce((curry, num) => {
    const parsedNumber = parseInt(num, 10);
    if (suffixes.length > 0) {
      suffixes.forEach((suffix) => {
        curry.push(assign({
          number: parsedNumber,
          suffix,
        }, baseResult));
      });
    } else {
      curry.push(assign({
        number: parsedNumber,
      }, baseResult));
    }
    return curry;
  }, [] as Booth[]);

  return createCluster(data, booths.reduce((curry, booth) => {
    if (data.orientation === 'horizontal') {
      if (curry.length <= 0) {
        curry.push([]);
      }
      curry[0].push(booth);
    } else {
      curry.push([booth]);
    }
    return curry;
  }, [] as Booth[][]));
}

function createCluster(data: ClusterData, booths: Booth[][]): Cluster {
  return {
    name: data.cluster,
    top: data.top,
    left: data.left,
    width: data.right - data.left,
    height: data.bottom - data.top,
    booths,
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
