import * as tfconv from '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';
import { Box } from './box';
export declare class HandDetector {
    private model;
    private width;
    private height;
    private iouThreshold;
    private scoreThreshold;
    private anchors;
    private anchorsTensor;
    private inputSizeTensor;
    private doubleInputSizeTensor;
    constructor(model: tfconv.GraphModel, width: number, height: number, anchors: Array<{
        x_center: number;
        y_center: number;
    }>, iouThreshold: number, scoreThreshold: number);
    private normalizeBoxes;
    private normalizeLandmarks;
    private getBoundingBoxes;
    estimateHandBounds(input: tf.Tensor4D): Promise<Box>;
}
