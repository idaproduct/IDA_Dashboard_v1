import * as tf from '@tensorflow/tfjs-core';
import { HandPipeline, Prediction } from './pipeline';
interface AnnotatedPrediction extends Prediction {
    annotations: {
        [key: string]: Array<[number, number, number]>;
    };
}
export declare function load({ maxContinuousChecks, detectionConfidence, iouThreshold, scoreThreshold }?: {
    maxContinuousChecks?: number;
    detectionConfidence?: number;
    iouThreshold?: number;
    scoreThreshold?: number;
}): Promise<HandPose>;
export declare class HandPose {
    private pipeline;
    constructor(pipeline: HandPipeline);
    static getAnnotations(): {
        [key: string]: number[];
    };
    estimateHands(input: tf.Tensor3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, flipHorizontal?: boolean): Promise<AnnotatedPrediction[]>;
}
export {};
