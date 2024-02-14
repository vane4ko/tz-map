import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Pointer as PointerInteraction } from 'ol/interaction';

function MapPage() {
  const mapElement1 = useRef(null);
  const mapElement2 = useRef(null);
  const mapInstances = useRef([]);
  const pointerInteractions = useRef([]);
  const circleFeatures = useRef([
    new Feature({ geometry: new Point([0, 0]) }),
    new Feature({ geometry: new Point([0, 0]) }),
  ]);
  const circleLayers = useRef([new VectorLayer(), new VectorLayer()]);
  const [isSplitView, setIsSplitView] = useState(false);
  const [showCircle, setShowCircle] = useState(false);

  const toggleSplitView = () => {
    setIsSplitView((prevState) => !prevState);
    setShowCircle(false);
  };

  const toggleBlackMouse = () => {
    setShowCircle((prevState) => !prevState);
  };

  useEffect(() => {
    mapInstances.current.forEach((map) => map.dispose());
    pointerInteractions.current.forEach((interaction) => interaction.dispose());

    const newMapInstances = [];
    const newPointerInteractions = [];

    const handleMouseMove = (event) => {
      const coordinate = event.coordinate;
      circleFeatures.current.forEach((circleFeature) =>
        circleFeature.getGeometry().setCoordinates(coordinate)
      );
    };

    const createMapInstance = (element, circleLayer, index) => {
      const mapInstance = new Map({
        target: element.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          showCircle ? circleLayer : null,
        ].filter(Boolean),

        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      const pointerInteraction = new PointerInteraction({
        handleMoveEvent: handleMouseMove,
      });

      mapInstance.addInteraction(pointerInteraction);
      newMapInstances.push(mapInstance);
      newPointerInteractions.push(pointerInteraction);
    };

    if (mapInstances.current.length === 0) {
      mapInstances.current.push(
        createMapInstance(mapElement1, circleLayers.current[0], 0)
      );
    } else if (mapInstances.current.length === 1) {
      mapInstances.current.push(
        createMapInstance(mapElement2, circleLayers.current[1], 1)
      );
    }

    return () => {
      newMapInstances.forEach((map) => map.dispose());
      newPointerInteractions.forEach((interaction) => interaction.dispose());
    };
  }, [showCircle, isSplitView]);

  return (
    <>
      <button onClick={toggleSplitView}>{`${
        isSplitView ? 'One' : 'Two'
      }`}</button>
      {isSplitView && (
        <button type="button" onClick={toggleBlackMouse}>{`${
          showCircle ? 'Cursor' : 'Circle'
        }`}</button>
      )}

      <div className={`map-container ${isSplitView ? 'split-view' : ''}`}>
        <div ref={mapElement1} className="map1" />
        {isSplitView && <div ref={mapElement2} className="map2" />}
      </div>
    </>
  );
}

export default MapPage;
