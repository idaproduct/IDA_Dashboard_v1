"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tfconv = require("@tensorflow/tfjs-converter");
const tf = require("@tensorflow/tfjs-core");
const hand_1 = require("./hand");
const keypoints_1 = require("./keypoints");
const pipeline_1 = require("./pipeline");
async function loadHandDetectorModel() {
    const HANDDETECT_MODEL_PATH = 'https://tfhub.dev/mediapipe/tfjs-model/handdetector/1/default/1';
    return tfconv.loadGraphModel(HANDDETECT_MODEL_PATH, { fromTFHub: true });
}
const MESH_MODEL_INPUT_WIDTH = 256;
const MESH_MODEL_INPUT_HEIGHT = 256;
async function loadHandPoseModel() {
    const HANDPOSE_MODEL_PATH = 'https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1';
    return tfconv.loadGraphModel(HANDPOSE_MODEL_PATH, { fromTFHub: true });
}
async function loadAnchors() {
    return tf.util
        .fetch('https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1/anchors.json?tfjs-format=file')
        .then(d => d.json());
}
async function load({ maxContinuousChecks = Infinity, detectionConfidence = 0.8, iouThreshold = 0.3, scoreThreshold = 0.5 } = {}) {
    const [ANCHORS, handDetectorModel, handPoseModel] = await Promise.all([loadAnchors(), loadHandDetectorModel(), loadHandPoseModel()]);
    const detector = new hand_1.HandDetector(handDetectorModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, ANCHORS, iouThreshold, scoreThreshold);
    const pipeline = new pipeline_1.HandPipeline(detector, handPoseModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, maxContinuousChecks, detectionConfidence);
    const handpose = new HandPose(pipeline);
    return handpose;
}
exports.load = load;
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
function flipHandHorizontal(prediction, width) {
    const { handInViewConfidence, landmarks, boundingBox } = prediction;
    return {
        handInViewConfidence,
        landmarks: landmarks.map((coord) => {
            return [width - 1 - coord[0], coord[1], coord[2]];
        }),
        boundingBox: {
            topLeft: [width - 1 - boundingBox.topLeft[0], boundingBox.topLeft[1]],
            bottomRight: [
                width - 1 - boundingBox.bottomRight[0], boundingBox.bottomRight[1]
            ]
        }
    };
}
class HandPose {
    constructor(pipeline) {
        this.pipeline = pipeline;
    }
    static getAnnotations() {
        return keypoints_1.MESH_ANNOTATIONS;
    }
    async estimateHands(input, flipHorizontal = false) {
        const [, width] = getInputTensorDimensions(input);
        const image = tf.tidy(() => {
            if (!(input instanceof tf.Tensor)) {
                input = tf.browser.fromPixels(input);
            }
            return input.toFloat().expandDims(0);
        });
        const result = await this.pipeline.estimateHand(image);
        image.dispose();
        if (result === null) {
            return [];
        }
        let prediction = result;
        if (flipHorizontal === true) {
            prediction = flipHandHorizontal(result, width);
        }
        const annotations = {};
        for (const key of Object.keys(keypoints_1.MESH_ANNOTATIONS)) {
            annotations[key] =
                keypoints_1.MESH_ANNOTATIONS[key].map(index => prediction.landmarks[index]);
        }
        return [{
                handInViewConfidence: prediction.handInViewConfidence,
                boundingBox: prediction.boundingBox,
                landmarks: prediction.landmarks,
                annotations
            }];
    }
}
exports.HandPose = HandPose;
//# sourceMappingURL=index.js.map