//functions
export const mockMapOn = jest.fn();
export const mockRemove = jest.fn();
export const mockDisable = jest.fn();
export const mockMapdragRotate = jest.fn();
export const mockMapaddControl = jest.fn();
export const mocktouchZoomRotate = jest.fn();
export const mockdoubleClickZoom = jest.fn();
export const mockGetWest = jest.fn();
export const mockGetEast = jest.fn();
export const mockGetSouth = jest.fn();
export const mockGetNorth = jest.fn();

//constructors
export class mockLngLat {}
export class mockLngLatBounds {
    getWest = mockGetWest;
    getEast = mockGetEast;
    getSouth = mockGetSouth;
    getNorth = mockGetNorth;
}
export class mockNavigationControl {}

jest.mock("mapbox-gl", () => ({
    Map: function () {
        this.on = mockMapOn;
        this.remove = mockRemove;
        this.dragRotate = mockMapdragRotate;
        this.addControl = mockMapaddControl;
        this.touchZoomRotate = mocktouchZoomRotate;
        this.doubleClickZoom = mockdoubleClickZoom;

        this.dragRotate.disable = jest.fn();
        this.touchZoomRotate.disableRotation = jest.fn();
        this.doubleClickZoom.disable = jest.fn();
    },
    LngLat: mockLngLat,
    LngLatBounds: mockLngLatBounds,
    NavigationControl: mockNavigationControl,
}));
