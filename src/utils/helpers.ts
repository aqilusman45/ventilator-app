import { Parameter } from 'src/Interfaces/Parameter';

export function parameterArrayToMatrix(
  arrayToConvert: Array<Parameter>,
  itemsPerRow: number,
) {
  const matrix: Array<Array<Parameter>> = [];

  for (let i = 0, k = -1; i < arrayToConvert.length; i++) {
    if (i % itemsPerRow === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(arrayToConvert[i]);
  }
  return matrix;
}
