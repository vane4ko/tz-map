import { useRef, useEffect, useState } from 'react';
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
      <div className={`map-container ${isSplitView ? 'split-view' : ''}`}>
        <div className="mapAndButton">
          <button className="mapsButtons" onClick={toggleSplitView}>
            <svg
              width="32px"
              height="32px"
              fill="#000000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icomoon-ignore"></g>
              <path
                d="M27.197 3.735h-9.596c-0.641 0-1.21 0.289-1.6 0.738-0.392-0.449-0.96-0.738-1.601-0.738h-9.596c-1.178 0-2.132 0.955-2.132 2.132v18.134c0 1.178 0.955 2.133 2.132 2.133h9.596c0.010 0 0.021-0.003 0.031-0.003 0.567 0.014 1.025 0.471 1.038 1.038v1.098h1.066v-0.591h0.010v-0.481c0-0.576 0.46-1.045 1.033-1.063 0.007 0 0.016 0.003 0.023 0.003h9.596c1.178 0 2.133-0.955 2.133-2.133v-18.134c0-1.178-0.955-2.132-2.133-2.132zM3.737 24v-18.134c0-0.588 0.479-1.066 1.066-1.066h9.596c0.588 0 1.066 0.479 1.066 1.066v18.134c0 0.588-0.478 1.066-1.066 1.066h-9.596c-0.587-0-1.066-0.479-1.066-1.066zM28.263 24c0 0.588-0.478 1.066-1.066 1.066h-9.596c-0.587 0-1.066-0.479-1.066-1.066v-18.134c0-0.588 0.479-1.066 1.066-1.066h9.596c0.588 0 1.066 0.479 1.066 1.066v18.134z"
                fill="#000000"
              ></path>
            </svg>
          </button>
          <div ref={mapElement1} className="map1" />
        </div>
        <div className={`${isSplitView ? 'mapAndButton' : 'hiddenDiv'}`}>
          {isSplitView && (
            <button
              className="mapsButtons"
              type="button"
              onClick={toggleBlackMouse}
            >
              <svg
                fill="#000000"
                height="32px"
                width="32px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 297 297"
              >
                <path
                  d="M289.393,28.273L197.759,6.211c-1.518-0.366-3.077-0.358-4.561-0.017c-0.013,0.003-0.024,0.001-0.037,0.004l-91.568,21.522
	L12.258,6.211C9.299,5.497,6.177,6.18,3.786,8.064C1.394,9.948,0,12.824,0,15.868V223.26c0,4.591,3.144,8.583,7.607,9.657
	l91.634,22.063c0.769,0.185,1.549,0.276,2.325,0.276c0.762,0,1.519-0.094,2.257-0.266c0.005-0.001,0.011,0.003,0.016,0.002
	l30.884-7.26l14.687,29.447c4.207,8.436,12.922,13.887,22.203,13.887h0.001c3.711,0,7.271-0.837,10.583-2.489
	c11.967-5.969,16.731-20.794,10.621-33.047l-9.576-19.201l12.166-2.859l89.335,21.51c0.769,0.185,1.549,0.276,2.324,0.276
	c2.208,0,4.378-0.736,6.147-2.13c2.392-1.884,3.786-4.76,3.786-7.804V37.93C297,33.34,293.855,29.348,289.393,28.273z
	 M151.957,204.235c-0.239,0-0.477,0.014-0.715,0.02l-5.22-10.466c11.76-8.2,20.549-19.904,25.18-33.749
	c5.695-17.026,4.419-35.252-3.594-51.319c-10.842-21.738-32.091-35.673-56.109-37.099V45.799l74.002-17.394v186.986l-11.371,2.672
	C169.911,209.661,161.217,204.235,151.957,204.235z M107.414,91.359c18.094,0,34.347,10.051,42.416,26.229
	c5.645,11.318,6.545,24.158,2.532,36.152c-4.012,11.994-12.454,21.709-23.772,27.353c-6.64,3.311-13.734,4.991-21.088,4.991
	c-18.095,0-34.346-10.051-42.415-26.229c-11.653-23.364-2.125-51.854,21.239-63.506C92.965,93.037,100.06,91.359,107.414,91.359z
	 M111.499,205.831c5.724-0.337,11.312-1.423,16.734-3.196l5.227,10.48c-3.547,4.427-5.448,10.024-5.364,15.769l-16.598,3.9V205.831z
	 M19.866,215.434V28.476l71.767,17.278v27.627c-4.857,1.182-9.596,2.906-14.173,5.189c-33.167,16.542-46.692,56.983-30.151,90.15
	c9.027,18.102,25.273,30.791,44.324,35.356v28.636L19.866,215.434z M173.33,270.801c-0.533,0.265-1.111,0.399-1.717,0.399
	c-1.814,0-3.552-1.133-4.426-2.887l-18.656-37.408c-1.201-2.409-0.419-5.339,1.707-6.402c0-0.001,0-0.001,0-0.001
	c0.002-0.001,0.003-0.001,0.004-0.002c0.532-0.264,1.109-0.398,1.715-0.398c1.814,0,3.552,1.133,4.426,2.887l18.656,37.408
	C176.241,266.806,175.458,269.738,173.33,270.801z M277.134,232.714l-71.767-17.279V28.476l71.767,17.278V232.714z"
                />
              </svg>
            </button>
          )}

          {isSplitView && <div ref={mapElement2} className="map2" />}
        </div>
      </div>
    </>
  );
}

export default MapComponent;
