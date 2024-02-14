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

function MapComponent() {
  const mapElement1 = useRef(null);
  const mapElement2 = useRef(null);
  const circleLayer1 = useRef(null);
  const circleLayer2 = useRef(null);
  const circleFeature1 = useRef(
    new Feature({
      geometry: new Point([0, 0]),
    })
  );
  const circleFeature2 = useRef(
    new Feature({
      geometry: new Point([0, 0]),
    })
  );
  const [isSplitView, setIsSplitView] = useState(false);
  const [showCircle, setShowCircle] = useState(false);

  const toggleSplitView = () => {
    setIsSplitView((prevState) => !prevState);
    setShowCircle(false);
  };

  const toggleBlackMouse = () => {
    setShowCircle((prevState) => !prevState);

    if (circleLayer1.current) circleLayer1.current.setVisible(!showCircle);
    if (circleLayer2.current) circleLayer2.current.setVisible(!showCircle);
  };

  useEffect(() => {
    const mapInstances = [];
    const pointerInteractions = [];

    const handleMouseMove = (event) => {
      const coordinate = event.coordinate;
      circleFeature1.current?.getGeometry().setCoordinates(coordinate);
      circleFeature2.current?.getGeometry().setCoordinates(coordinate);
    };

    const createMapInstance = (element, circleLayer) => {
      const mapInstance = new Map({
        target: element.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          circleLayer,
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

      return { mapInstance, pointerInteraction };
    };

    if (mapElement1.current) {
      circleLayer1.current = new VectorLayer({
        source: new VectorSource({
          features: [circleFeature1.current],
        }),
        style: new Style({
          image: new CircleStyle({
            radius: 50,
            fill: new Fill({
              color: 'rgba(0, 0, 0, 0.5)',
            }),
            stroke: new Stroke({
              color: 'black',
              width: 2,
            }),
          }),
        }),
        visible: false,
      });

      const { mapInstance, pointerInteraction } = createMapInstance(
        mapElement1,
        circleLayer1.current,
        circleFeature1.current
      );

      mapInstances.push(mapInstance);
      pointerInteractions.push(pointerInteraction);
    }

    if (mapElement2.current) {
      circleLayer2.current = new VectorLayer({
        source: new VectorSource({
          features: [circleFeature2.current],
        }),
        style: new Style({
          image: new CircleStyle({
            radius: 50,
            fill: new Fill({
              color: 'rgba(0, 0, 0, 0.5)',
            }),
            stroke: new Stroke({
              color: 'black',
              width: 2,
            }),
          }),
        }),
        visible: false,
      });

      const { mapInstance, pointerInteraction } = createMapInstance(
        mapElement2,
        circleLayer2.current,
        circleFeature2.current
      );

      mapInstances.push(mapInstance);
      pointerInteractions.push(pointerInteraction);
    }

    return () => {
      mapInstances.forEach((map) => {
        map.dispose();
      });

      pointerInteractions.forEach((interaction) => {
        interaction.dispose();
      });
    };
  }, [isSplitView]);

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

export default MapComponent;
