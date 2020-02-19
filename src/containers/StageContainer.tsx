import React, { useEffect, useRef } from 'react';

const StageContainer = ({ loadMap }: { loadMap: MapStageLoader }) => {
  const stageRef = useRef<HTMLDivElement>();
  useEffect(() => {
    loadMap(stageRef.current);
  }, []);
  return <div id='stage' ref={stageRef} />;
};

export default StageContainer;
