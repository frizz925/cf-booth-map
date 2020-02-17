import React, { useEffect, useRef } from 'react';

interface StageContainerProps {
  loadMap: MapStageLoader;
}

const StageContainer = ({ loadMap }: StageContainerProps) => {
  const stageRef = useRef<HTMLDivElement>();
  useEffect(() => {
    loadMap(stageRef.current);
  }, []);
  return <div id='stage' ref={stageRef} />;
};

export default StageContainer;
