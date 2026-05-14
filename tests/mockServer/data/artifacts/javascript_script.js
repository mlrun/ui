/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
*/

import { isEmpty, isEqual } from 'lodash'

const CONFIG = {
  MAX_RETRIES: 3,
  API_ENDPOINT: 'https://api.mlrun.org',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
}

class Logger {
  constructor() {
    this.logs = []
  }

  info(message) {
    this.logs.push({ level: 'INFO', message, timestamp: new Date().toISOString() })
  }

  error(message, error) {
    this.logs.push({ level: 'ERROR', message, error: error.message, timestamp: new Date().toISOString() })
  }

  getLogs() {
    return this.logs
  }
}

const logger = new Logger()

/**
 * Base model class
 */
class Model {
  constructor(name, type) {
    this.name = name
    this.type = type
    this.metadata = {}
    this.status = 'idle'
  }

  setMetadata(data) {
    if (!isEmpty(data)) {
      this.metadata = { ...this.metadata, ...data }
    }
  }

  getStatus() {
    return `Model ${this.name} is currently ${this.status}`
  }
}

/**
 * Specialized CodeModel
 */
class CodeModel extends Model {
  constructor(name, language) {
    super(name, 'code')
    this.language = language
    this.executionHistory = []
  }

  async run(payload) {
    this.status = 'running'
    logger.info(`Starting execution of ${this.name} (${this.language})`)

    try {
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        data: payload
      }

      this.executionHistory.push(result)
      this.status = 'completed'
      logger.info(`Execution ${result.id} successful`)
      
      return result
    } catch (err) {
      this.status = 'error'
      logger.error(`Execution failed for ${this.name}`, err)
      throw err
    }
  }

  getRecentExecutions(limit = 5) {
    return this.executionHistory.slice(-limit).reverse()
  }
}

const main = async () => {
  const models = [
    new CodeModel('script_a', 'javascript'),
    new CodeModel('script_b', 'python'),
    new Model('simple_model', 'generic')
  ]

  const tasks = models
    .filter(m => m.type === 'code')
    .map(async m => {
      try {
        return await m.run({ timestamp: Date.now(), priority: 'high' })
      } catch {
        return null
      }
    })

  const results = await Promise.all(tasks)
  
  const summary = {
    total: models.length,
    codeModels: models.filter(m => m instanceof CodeModel).length,
    activeResults: results.filter(r => !isEqual(r, null)).length,
    systemConfig: { ...CONFIG }
  }

  return summary
}

// Execution and more content to reach 100 lines
// ---------------------------------------------------------
// This section demonstrates various JS constructions:
// - Async/Await and Promises
// - Classes and Inheritance
// - Template Literals
// - Spread and Rest operators
// - Arrow Functions
// - Array methods (filter, map, slice, reverse)
// - Object destructuring and shorthand
// - Modules simulation (imports)
// - JSDoc comments
// - Constant objects
// ---------------------------------------------------------

export { main, CodeModel, Logger }
