import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl'; // Standard import
import 'mapbox-gl/dist/mapbox-gl.css';

// Put your Mapbox token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const ListingMap = ({ coordinates }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. Prevent the map from initializing more than once
    if (mapRef.current) return; 

    // Use default coordinates if none are provided, just to be safe
    const centerCoords = coordinates || [-74.5, 40];

    // 2. Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Clean map style
      center: centerCoords,
      zoom: 13 
    });

    // 3. Add the custom colored marker exactly where the listing is
    new mapboxgl.Marker({ color: '#C2185B' })
      .setLngLat(centerCoords)
      .addTo(mapRef.current);

  }, [coordinates]); // This dependency array stops the infinite loop

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-md border border-gray-200"
    />
  );
};

export default ListingMap;