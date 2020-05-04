import { Parameter } from 'src/Interfaces/Parameter';

export function parameterArrayToMatrix(
  arrayOfParameters: Array<Parameter>,
  parametersPerSubArray: number,
) {
  const matrix: Array<Array<Parameter>> = [];
  let i;
  let k;

  for (i = 0, k = -1; i < arrayOfParameters.length; i++) {
    if (i % parametersPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(arrayOfParameters[i]);
  }
  return matrix;
}
