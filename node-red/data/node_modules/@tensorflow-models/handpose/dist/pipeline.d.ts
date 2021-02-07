import * as tfconv from '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';
import { HandDetector } from './hand';
export declare type Coords3D = Array<[number, number, number]>;
export interface Prediction {
    handInViewConfidence: number;
    landmarks: Coords3D;
    boundingBox: {
        topLeft: [number, number];
        bottomRight: [number, number];
    };
}
export declare class HandPipeline {
    private boundingBoxDetector;
    private meshDetector;
    private maxHandsNumber;
    private maxContinuousChecks;
    private detectionConfidence;
    private meshWidth;
    private meshHeight;
    private regionsOfInterest;
    private runsWithoutHandDetector;
    constructor(boundingBoxDetector: HandDetector, meshDetector: tfconv.GraphModel, meshWidth: number, meshHeight: number, maxContinuousChecks: number, detectionConfidence: number);
    private getBoxForPalmLandmarks;
    private getBoxForHandLandmarks;
    private transformRawCoords;
    estimateHand(image: tf.Tensor4D): Promise<Prediction>;
    private calculateLandmarksBoundingBox;
    private updateRegionsOfInterest;
    private shouldUpdateRegionsOfInterest;
}
