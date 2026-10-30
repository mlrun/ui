/*
Copyright 2022 Iguazio Systems Ltd.
Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/

/**
 * Performs a floating-point arithmetic operation on two numbers.
 *
 * @param {number} num1 - The first operand.
 * @param {number} num2 - The second operand.
 * @param {string} operator - The operator to use for the operation. Supported operators are '+', and '-'.
 * @returns {number} The result of the arithmetic operation.
 */
export const performFloatOperation = (num1, num2, operator) => {
  const precision = Math.max(
    (num1.toString().split('.')[1] || '').length,
    (num2.toString().split('.')[1] || '').length
  )

  const multiplier = Math.pow(10, precision)

  switch (operator) {
    case '+':
      return (Math.round(num1 * multiplier) + Math.round(num2 * multiplier)) / multiplier
    case '-':
      return (Math.round(num1 * multiplier) - Math.round(num2 * multiplier)) / multiplier
    default:
      return 0
  }
}
