export declare type TransformationMatrix = [[number, number, number], [number, number, number], [number, number, number]];
export declare function normalizeRadians(angle: number): number;
export declare function computeRotation(point1: [number, number], point2: [number, number]): number;
export declare function dot(v1: number[], v2: number[]): number;
export declare function getColumnFrom2DArr(arr: number[][], columnIndex: number): number[];
export declare function buildRotationMatrix(rotation: number, center: [number, number]): TransformationMatrix;
export declare function invertTransformMatrix(matrix: TransformationMatrix): TransformationMatrix;
export declare function rotatePoint(homogeneousCoordinate: [number, number, number], rotationMatrix: TransformationMatrix): [number, number];
