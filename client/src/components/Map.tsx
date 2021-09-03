/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";
import { useRef, useEffect, useState } from "react";
import store from "../store";
import { State } from "../reducers";
import { connect } from "react-redux";
import { RestaurantsState } from "../reducers/restaurants";
import { restaurantsFetch } from "../actions/restaurants";
import { mapDataState } from "../reducers/mapdata";
import { setMapData } from "../actions/mapdata";
import { mapData } from "../models";

import mapboxgl, { GeoJSONSource } from "mapbox-gl";

interface MapProps {
    readonly restaurants: RestaurantsState
    readonly mapData: mapDataState
}

interface RestaurantPropertiesPopup {
    readonly name: string,
    readonly address: string
}

const popupsHTML = (desc: RestaurantPropertiesPopup) => `<h3>${desc.name}</h3><h4>${desc.address}</h4>`;

function Map({ restaurants, mapData }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [initializedMap, setInitializedMap] = useState<mapboxgl.Map | null>(null);
    const restaurantData = "resource" in restaurants ? restaurants.resource : null;
    const allRestaurants = restaurantData?.restaurants.results;

    useEffect(() => {
        initializedMap && mapData && store.dispatch(restaurantsFetch([mapData.data.bounds, 1]));
    }, [initializedMap, mapData]);

    useEffect(() => {
        if (initializedMap && allRestaurants) {
            const geojsonSource: GeoJSONSource = initializedMap.getSource('Restaurants') as mapboxgl.GeoJSONSource;
            //add restaurants to map
            if (!geojsonSource) {
                initializedMap.addSource("Restaurants", {
                    type: "geojson",
                    data: allRestaurants,
                });

                initializedMap.addLayer({
                    id: "restaurants-layer",
                    type: "circle",
                    source: "Restaurants",
                    paint: {
                        "circle-radius": 8,
                        "circle-stroke-width": 2,
                        "circle-color": "navy",
                        "circle-stroke-color": "white",
                    },
                });
            }
            // Update the data after the GeoJSON source was created
            else {
                allRestaurants && geojsonSource.setData(allRestaurants);
            }
        }
    }, [initializedMap, allRestaurants]);

    useEffect(() => {
        // eslint-disable-next-line
        if (mapRef.current === null) {
            return;
        }
        // eslint-disable-next-line
        mapboxgl.accessToken = 'pk.eyJ1Ijoicm1vcmlubyIsImEiOiJja292Z3A3aXEwNDlmMnZ0bDg1eDBxMHkxIn0.vQGK_iJsdwIWk1_SOGLm3A' || "";

        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: mapData.data.center,
            zoom: mapData.data.zoom,
        });

        map.on("load", () => {
            //setMapData to get default bounds - viewer dependent 
            const newDataOnLoad: mapData = {
                center: map.getCenter(),
                zoom: map.getZoom(),
                bounds: map.getBounds()
            }
            store.dispatch(setMapData(newDataOnLoad));
            setInitializedMap(map);
        });

        map.on("moveend", () => {
            const newDataOnMove: mapData = {
                center: map.getCenter(),
                zoom: map.getZoom(),
                bounds: map.getBounds()
            }
            store.dispatch(setMapData(newDataOnMove));
        });

        map.addControl(
            new mapboxgl.NavigationControl({
                showCompass: false,
                showZoom: true,
            }),
            "top-right"
        );

        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.doubleClickZoom.disable();

        return () => map?.remove();

        // eslint-disable-next-line
    }, [mapRef]);

    useEffect(() => {
        if (initializedMap) {
            const hoverPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            const handlePopupEvent = (e: mapboxgl.MapLayerMouseEvent) => {
                // eslint-disable-next-line
                if (e.features && e.features[0].geometry.type === "Point" && e.features[0].properties) {
                    const coordsArray: mapboxgl.LngLatLike = {
                        lng: e.features[0].geometry.coordinates[0],
                        lat: e.features[0].geometry.coordinates[1],
                    };
                    const desc: RestaurantPropertiesPopup = {
                        name: e.features[0].properties.name,
                        address: e.features[0].properties.address
                    };

                    hoverPopup.setLngLat(coordsArray).setHTML(popupsHTML(desc)).addTo(initializedMap);
                }
            };

            initializedMap.on("mouseenter", "restaurants-layer", function (e: mapboxgl.MapLayerMouseEvent) {
                // eslint-disable-next-line
                initializedMap.getCanvas().style.cursor = "pointer";
                handlePopupEvent(e);
            });

            initializedMap.on("mouseleave", "restaurants-layer", function () {
                // eslint-disable-next-line
                initializedMap.getCanvas().style.cursor = "";
                hoverPopup.remove();
            });
        }
    }, [initializedMap]);


    return (
        <Flex>
            <div className='map-component'>
                <div ref={mapRef} className="map-container" />
            </div>
        </Flex>
    );

}

function mapStateToProps(state: State): MapProps {
    return {
        restaurants: state.restaurants,
        mapData: state.mapData
    };
}

export default connect(mapStateToProps)(Map);
