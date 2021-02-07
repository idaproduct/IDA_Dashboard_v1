"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs-core");
const box_1 = require("./box");
class HandDetector {
    constructor(model, width, height, anchors, iouThreshold, scoreThreshold) {
        this.model = model;
        this.width = width;
        this.height = height;
        this.iouThreshold = iouThreshold;
        this.scoreThreshold = scoreThreshold;
        this.anchors = anchors.map(anchor => [anchor.x_center, anchor.y_center]);
        this.anchorsTensor = tf.tensor2d(this.anchors);
        this.inputSizeTensor = tf.tensor1d([width, height]);
        this.doubleInputSizeTensor = tf.tensor1d([width * 2, height * 2]);
    }
    normalizeBoxes(boxes) {
        return tf.tidy(() => {
            const boxOffsets = tf.slice(boxes, [0, 0], [-1, 2]);
            const boxSizes = tf.slice(boxes, [0, 2], [-1, 2]);
            const boxCenterPoints = tf.add(tf.div(boxOffsets, this.inputSizeTensor), this.anchorsTensor);
            const halfBoxSizes = tf.div(boxSizes, this.doubleInputSizeTensor);
            const startPoints = tf.mul(tf.sub(boxCenterPoints, halfBoxSizes), this.inputSizeTensor);
            const endPoints = tf.mul(tf.add(boxCenterPoints, halfBoxSizes), this.inputSizeTensor);
            return tf.concat2d([startPoints, endPoints], 1);
        });
    }
    normalizeLandmarks(rawPalmLandmarks, index) {
        return tf.tidy(() => {
            const landmarks = tf.add(tf.div(rawPalmLandmarks.reshape([-1, 7, 2]), this.inputSizeTensor), this.anchors[index]);
            return tf.mul(landmarks, this.inputSizeTensor);
        });
    }
    async getBoundingBoxes(input) {
        const normalizedInput = tf.tidy(() => tf.mul(tf.sub(input, 0.5), 2));
        const savedWebglPackDepthwiseConvFlag = tf.env().get('WEBGL_PACK_DEPTHWISECONV');
        tf.env().set('WEBGL_PACK_DEPTHWISECONV', true);
        const batchedPrediction = this.model.predict(normalizedInput);
        tf.env().set('WEBGL_PACK_DEPTHWISECONV', savedWebglPackDepthwiseConvFlag);
        const prediction = batchedPrediction.squeeze();
        const scores = tf.tidy(() => tf.sigmoid(tf.slice(prediction, [0, 0], [-1, 1])).squeeze());
        const rawBoxes = tf.slice(prediction, [0, 1], [-1, 4]);
        const boxes = this.normalizeBoxes(rawBoxes);
        const savedConsoleWarnFn = console.warn;
        console.warn = () => { };
        const boxesWithHandsTensor = tf.image.nonMaxSuppression(boxes, scores, 1, this.iouThreshold, this.scoreThreshold);
        console.warn = savedConsoleWarnFn;
        const boxesWithHands = await boxesWithHandsTensor.array();
        const toDispose = [
            normalizedInput, batchedPrediction, boxesWithHandsTensor, prediction,
            boxes, rawBoxes, scores
        ];
        if (boxesWithHands.length === 0) {
            toDispose.forEach(tensor => tensor.dispose());
            return null;
        }
        const boxIndex = boxesWithHands[0];
        const matchingBox = tf.slice(boxes, [boxIndex, 0], [1, -1]);
        const rawPalmLandmarks = tf.slice(prediction, [boxIndex, 5], [1, 14]);
        const palmLandmarks = tf.tidy(() => this.normalizeLandmarks(rawPalmLandmarks, boxIndex).reshape([
            -1, 2
        ]));
        toDispose.push(rawPalmLandmarks);
        toDispose.forEach(tensor => tensor.dispose());
        return { boxes: matchingBox, palmLandmarks };
    }
    async estimateHandBounds(input) {
        const inputHeight = input.shape[1];
        const inputWidth = input.shape[2];
        const image = tf.tidy(() => input.resizeBilinear([this.width, this.height]).div(255));
        const prediction = await this.getBoundingBoxes(image);
        if (prediction === null) {
            image.dispose();
            return null;
        }
        const boundingBoxes = prediction.boxes.arraySync();
        const startPoint = boundingBoxes[0].slice(0, 2);
        const endPoint = boundingBoxes[0].slice(2, 4);
        const palmLandmarks = prediction.palmLandmarks.arraySync();
        image.dispose();
        prediction.boxes.dispose();
        prediction.palmLandmarks.dispose();
        return box_1.scaleBoxCoordinates({ startPoint, endPoint, palmLandmarks }, [inputWidth / this.width, inputHeight / this.height]);
    }
}
exports.HandDetector = HandDetector;
//# sourceMappingURL=hand.js.map