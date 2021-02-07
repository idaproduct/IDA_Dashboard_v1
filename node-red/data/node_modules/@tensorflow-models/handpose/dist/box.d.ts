import * as tf from '@tensorflow/tfjs-core';
export declare type Box = {
    startPoint: [number, number];
    endPoint: [number, number];
    palmLandmarks?: Array<[number, number]>;
};
export declare function getBoxSize(box: Box): [number, number];
export declare function getBoxCenter(box: Box): [number, number];
export declare function cutBoxFromImageAndResize(box: Box, image: tf.Tensor4D, cropSize: [number, number]): tf.Tensor4D;
export declare function scaleBoxCoordinates(box: Box, factor: [number, number]): Box;
export declare function enlargeBox(box: Box, factor?: number): Box;
export declare function squarifyBox(box: Box): Box;
export declare function shiftBox(box: Box, shiftFactor: [number, number]): {
    startPoint: [number, number];
    endPoint: [number, number];
    palmLandmarks: [number, number][];
};
