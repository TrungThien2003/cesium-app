// src/CesiumMap.jsx
import React, { useEffect, useRef } from "react";
import {
  Ion,
  Viewer,
  Cartesian3,
  Cesium3DTileset,
  Transforms,
  HeadingPitchRoll,
  Math as CesiumMath,
  Color,
  OpenStreetMapImageryProvider,
  createOsmBuildingsAsync,
  Terrain,
  ClippingPlane,
  ClippingPlaneCollection,
  Plane,
  Cesium3DTileStyle,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NzEyNWQzZi00MWQ4LTRlYmMtYjZhNi1kMGFlYTY1MThjYWYiLCJpZCI6MzgwMTMwLCJpYXQiOjE3Njg2NjU3MDB9.NqtDl1yvYE1IYm1H5Uz8Fal45t6ExfrqOAf2DqMc7xA";

const CesiumMap = () => {
  const cesiumContainer = useRef(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    const viewer = new Viewer(cesiumContainer.current, {
      terrain: Terrain.fromWorldTerrain(),
      imageryProvider: new OpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      }),
    });

    const longitude = 105.77058310818754;
    const latitude = 10.030208376475343;
    const height = 0;
    const position = Cartesian3.fromDegrees(longitude, latitude, height);

    createOsmBuildingsAsync().then((buildingTileset) => {
      if (viewer.isDestroyed()) return;

      buildingTileset.style = new Cesium3DTileStyle({
        color: "color('white', 0.2)",
      });

      viewer.scene.primitives.add(buildingTileset);
    });

    const loadModel = async (viewer) => {
      try {
        const tileset = await Cesium3DTileset.fromIonAssetId(4357370);
        if (viewer.isDestroyed()) return;
        viewer.scene.primitives.add(tileset);

        const heading = CesiumMath.toRadians(0);
        const pitch = 0;
        const roll = 0;
        const hpr = new HeadingPitchRoll(heading, pitch, roll);

        const modelMatrix = Transforms.headingPitchRollToFixedFrame(
          position,
          hpr
        );
        tileset.modelMatrix = modelMatrix;

        await viewer.zoomTo(tileset);
      } catch (error) {
        console.error("Lỗi load model:", error);
      }
    };
    loadModel(viewer);

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={cesiumContainer}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    />
  );
};

export default CesiumMap;
