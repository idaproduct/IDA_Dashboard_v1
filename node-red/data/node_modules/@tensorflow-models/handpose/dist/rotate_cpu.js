"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs-core");
function rotate(image, radians, fillValue, center) {
    const cpuBackend = tf.backend();
    const output = tf.buffer(image.shape, image.dtype);
    const [batch, imageHeight, imageWidth, numChannels] = image.shape;
    const centerX = imageWidth * (typeof center === 'number' ? center : center[0]);
    const centerY = imageHeight * (typeof center === 'number' ? center : center[1]);
    const sinFactor = Math.sin(-radians);
    const cosFactor = Math.cos(-radians);
    const imageVals = cpuBackend.readSync(image.dataId);
    for (let batchIdx = 0; batchIdx < batch; batchIdx++) {
        for (let row = 0; row < imageHeight; row++) {
            for (let col = 0; col < imageWidth; col++) {
                for (let channel = 0; channel < numChannels; channel++) {
                    const coords = [batch, row, col, channel];
                    const x = coords[2];
                    const y = coords[1];
                    let coordX = (x - centerX) * cosFactor - (y - centerY) * sinFactor;
                    let coordY = (x - centerX) * sinFactor + (y - centerY) * cosFactor;
                    coordX = Math.round(coordX + centerX);
                    coordY = Math.round(coordY + centerY);
                    let outputValue = fillValue;
                    if (typeof fillValue !== 'number') {
                        if (channel === 3) {
                            outputValue = 255;
                        }
                        else {
                            outputValue = fillValue[channel];
                        }
                    }
                    if (coordX >= 0 && coordX < imageWidth && coordY >= 0 &&
                        coordY < imageHeight) {
                        const imageIdx = batchIdx * imageWidth * imageHeight * numChannels +
                            coordY * (imageWidth * numChannels) + coordX * numChannels +
                            channel;
                        outputValue = imageVals[imageIdx];
                    }
                    const outIdx = batchIdx * imageWidth * imageHeight * numChannels +
                        row * (imageWidth * numChannels) + col * numChannels + channel;
                    output.values[outIdx] = outputValue;
                }
            }
        }
    }
    return output.toTensor();
}
exports.rotate = rotate;
//# sourceMappingURL=rotate_cpu.js.map