import Booth, { Cluster } from '@models/Booth';
import Circle from '@models/Circle';
import { BoothMapping, CircleMapping } from '@models/Mapped';
import { assign } from 'lodash';
import getBoothNumber from './booth';

interface BoothCluster {
  booth: Booth;
  cluster: Cluster;
}

interface BoothClusterMapping {
  [key: string]: BoothCluster;
}

interface MappingResult {
  byCircles: CircleMapping;
  byBooths: BoothMapping;
}

export default function mapCircleBooth(clusters: Cluster[], circles: Circle[]): MappingResult {
  const byCircles: CircleMapping = {};
  const byBooths: BoothMapping = {};
  const mapping = mapBoothNames(clusters);
  circles.forEach((circle) => {
    circle.boothNumbers.forEach((boothNumber) => {
      if (!mapping[boothNumber]) {
        const errMessage = `Booth number ${boothNumber} not found!`;
        console.error(errMessage, circle);
        throw new Error(errMessage);
      }
      const boothCluster = mapping[boothNumber];
      const { booth, cluster } = boothCluster;

      byCircles[circle.name] = assign({}, circle, {
        booth,
        cluster,
      });
      byBooths[boothNumber] = assign({}, booth, {
        circle,
        cluster,
      });
    });
  });
  return { byCircles, byBooths };
}

function mapBoothNames(clusters: Cluster[]): BoothClusterMapping {
  const mapping: BoothClusterMapping = {};
  clusters.forEach((cluster) => {
    cluster.booths.forEach((row) => {
      row.forEach((booth) => {
        const name = getBoothNumber(booth);
        mapping[name] = { booth, cluster };
      });
    });
  });
  return mapping;
}
