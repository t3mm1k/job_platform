import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Map.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVacancies, setCenter, setClusterData } from '../../../store/slices/vacanciesSlice';
import { setSearchValue, setSearchResult } from '../../../store/slices/searchSlice';
import { toggleClusterSelectionVisibility, toggleFilterVisibility, toggleSearchVisibility, setFilterVisibility, setIsClusterSelectionOpen, setSearchVisibility } from "../../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import { setSelectedVacancy } from "../../../store/slices/userSlice";
function Map() {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [ymaps3Ready, setYmaps3Ready] = useState(false);
  const navigate = useNavigate();
  const center = useSelector(state => state.vacancies.center);
  const mapData = useSelector(state => state.vacancies.filteredData);
  const searchValue = useSelector(state => state.search.searchValue);
  const searchResult = useSelector(state => state.search.searchResult);
  const isClusterSelectionOpen = useSelector(state => state.ui.isClusterSelectionOpen);
  const isFilterOpen = useSelector(state => state.ui.isFilterOpen);
  const isSearchOpen = useSelector(state => state.ui.isSearchOpen);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch]);
  useEffect(() => {
    if (!window.ymaps3 || !window.ymaps3.ready) {
      return;
    }
    async function waitForYmaps3() {
      await window.ymaps3.ready;
      setYmaps3Ready(true);
    }
    waitForYmaps3();
  }, []);
  useEffect(() => {
    if (!mapRef.current || !ymaps3Ready || mapInstance) {
      return;
    }
    async function initMap() {
      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer
      } = window.ymaps3;
      const newMap = new YMap(mapRef.current, {
        location: {
          center: center,
          zoom: 10
        }
      });
      newMap.addChild(new YMapDefaultSchemeLayer());
      newMap.addChild(new YMapDefaultFeaturesLayer());
      setMapInstance(newMap);
    }
    initMap();
  }, [ymaps3Ready, mapInstance]);
  useEffect(() => {
    if (mapInstance && center) {
      if (mapInstance.center !== center) {
        mapInstance.setLocation({
          center: center,
          zoom: 15
        });
      }
    }
  }, [mapInstance, center]);
  const createMapListener = useCallback(() => {
    if (!mapInstance || !ymaps3Ready || !mapRef.current) {
      return null;
    }
    const {
      YMapListener
    } = window.ymaps3;
    const onUpdate = event => {
      if (!mapRef.current) {
        return;
      }
      const zoom = event.location.zoom;
      const markers = mapRef.current.querySelectorAll('.custom-marker');
      markers.forEach(marker => {
        if (!marker.classList.contains('cluster-circle')) {
          if (zoom < 12) {
            marker.classList.add('icon-only');
          } else {
            marker.classList.remove('icon-only');
          }
        }
      });
    };
    const mapListener = new YMapListener({
      layer: 'any',
      onClick: event => {
        if (isClusterSelectionOpen) {
          dispatch(setIsClusterSelectionOpen(false));
        }
        if (isFilterOpen) {
          dispatch(setFilterVisibility(false));
        }
        if (isSearchOpen) {
          dispatch(setSearchVisibility(false));
        }
      },
      onUpdate: onUpdate
    });
    return mapListener;
  }, [mapInstance, ymaps3Ready, dispatch, isClusterSelectionOpen, isFilterOpen, isSearchOpen]);
  useEffect(() => {
    if (!mapInstance || !ymaps3Ready) {
      return;
    }
    async function updateMapData() {
      const {
        YMapMarker
      } = window.ymaps3;
      let clustererImport = null;
      try {
        clustererImport = await window.ymaps3.import('@yandex/ymaps3-clusterer@0.0.1');
      } catch (error) {
        console.error("Failed to import clusterer:", error);
        return;
      }
      const {
        YMapClusterer,
        clusterByGrid
      } = clustererImport;
      function createMarketplaceMarker(vacancy) {
        const markerElement = document.createElement('div');
        markerElement.classList.add('custom-marker');
        markerElement.style.cursor = 'pointer';
        let logoSrc = '';
        switch (vacancy.marketplace) {
          case 'Wildberries':
            logoSrc = '/img/marketplace-logo/Wildberries.png';
            break;
          case 'Yandex':
            logoSrc = '/img/marketplace-logo/Yandex.png';
            break;
          case 'Ozon':
            logoSrc = '/img/marketplace-logo/Ozon.png';
            break;
          case 'Avito':
            logoSrc = '/img/marketplace-logo/Avito.png';
            break;
          case 'Boxberry':
            logoSrc = '/img/marketplace-logo/Boxberry.png';
            break;
          case 'Others':
            logoSrc = '/img/marketplace-logo/Others.png';
            break;
          default:
            logoSrc = '/img/marketplace-logo/Others.png';
        }
        let salaryText = vacancy.vacancy_type === "part-time" ? " / за смену" : " / в месяц";
        markerElement.innerHTML = `
                    <img src="${logoSrc}" alt="${vacancy.marketplace}">
                    <div class="marker-context">
                        <p>${vacancy.position}</p>
                        <p>${vacancy.salary} ${salaryText}</p>
                    </div>
                `;
        return markerElement;
      }
      const markerRenderer = feature => {
        const coordinates = [feature.properties.address.longitude, feature.properties.address.latitude];
        const markerElement = createMarketplaceMarker(feature.properties);
        markerElement.addEventListener('click', e => {
          e.stopPropagation();
          dispatch(setIsClusterSelectionOpen(false));
          dispatch(setSelectedVacancy(feature.properties));
          mapInstance.setLocation({
            center: coordinates,
            zoom: Math.min(mapInstance.zoom + 2, 17),
            duration: 0
          });
          dispatch(setCenter(coordinates));
          navigate(`/vacancy/${feature.properties._id}`);
        });
        return new YMapMarker({
          coordinates
        }, markerElement);
      };
      function clusterRenderer(coordinates, features) {
        const count = features.length;
        const clusterElement = document.createElement('div');
        clusterElement.classList.add('cluster-circle');
        clusterElement.textContent = count;
        clusterElement.style.cursor = 'pointer';
        clusterElement.addEventListener('click', e => {
          if (features.length > 5) features = features.slice(0, 5);
          e.stopPropagation();
          mapInstance.setLocation({
            center: coordinates,
            zoom: Math.min(mapInstance.zoom + 2, 17),
            duration: 500
          });
          dispatch(setClusterData(features));
          if (!isClusterSelectionOpen) {
            dispatch(toggleClusterSelectionVisibility());
          }
        });
        return new YMapMarker({
          coordinates
        }, clusterElement);
      }
      function jitterCoordinates(coordinates, jitterAmount = 0.0001) {
        const [lng, lat] = coordinates;
        const jitteredLng = lng + (Math.random() - 0.5) * 2 * jitterAmount;
        const jitteredLat = lat + (Math.random() - 0.5) * 2 * jitterAmount;
        return [jitteredLng, jitteredLat];
      }
      if (!mapData) {
        return;
      }
      const points = mapData.map((item, i) => {
        const coords = jitterCoordinates([item.address.longitude, item.address.latitude]);
        return {
          type: 'Feature',
          id: i,
          geometry: {
            type: 'Point',
            coordinates: coords
          },
          properties: item
        };
      });
      mapInstance.children.forEach(child => {
        if (child instanceof YMapClusterer || child instanceof YMapMarker) {
          mapInstance.removeChild(child);
        }
      });
      const clusterer = new YMapClusterer({
        method: clusterByGrid({
          gridSize: 48
        }),
        features: points,
        marker: markerRenderer,
        cluster: clusterRenderer
      });
      mapInstance.addChild(clusterer);
      const mapListener = createMapListener();
      if (mapListener) {
        mapInstance.addChild(mapListener);
      }
    }
    updateMapData();
  }, [mapData, mapInstance, ymaps3Ready, dispatch, isClusterSelectionOpen, isFilterOpen, isSearchOpen, createMapListener]);
  useEffect(() => {
    if (!mapInstance || !searchResult) {
      return;
    }
    mapInstance.update({
      location: {
        center: searchResult,
        zoom: 17,
        duration: 400
      }
    });
  }, [mapInstance, searchResult, searchValue]);
  return <div id="map" className="absolute left-[10px] w-[calc(100vw-20px)]" ref={mapRef} style={{
    top: "max(var(--tg-safe-area-inset-top, 10px), 10px)",
    bottom: "max(var(--tg-safe-area-inset-bottom, 10px), 10px)"
  }}></div>;
}
export default Map;
