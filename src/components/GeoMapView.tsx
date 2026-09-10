import React from 'react';
import { GISMap } from './GISMap';
import { Constituency, WorkItem } from '../types';

export interface GeoMapViewProps {
  constituency: Constituency;
  works?: WorkItem[];
  selectedWork?: WorkItem | null;
  onSelectWork?: (work: WorkItem) => void;
  onNavigateTab?: (tab: string) => void;
  apiKey?: string;
  onSwitchToLeaflet?: () => void;
}

export const GeoMapView: React.FC<GeoMapViewProps> = ({
  constituency,
  works = [],
  selectedWork = null,
  onSelectWork = () => {},
  onNavigateTab = () => {},
}) => {
  return (
    <GISMap
      constituency={constituency}
      works={works}
      selectedWork={selectedWork}
      onSelectWork={onSelectWork}
      onNavigateTab={onNavigateTab}
    />
  );
};

export default GeoMapView;
