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

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { describe, it, expect, vi } from 'vitest'

import { getLinks, getFooterLinks } from './navbarList.util'

vi.mock('../../../utils', () => ({
  generateNuclioLink: link => `nuclio:${link}`
}))

const PROJECT = 'my-project'
const BASE = `/projects/${PROJECT}`

describe('navbarList.util', () => {
  describe('getLinks', () => {
    it('returns an array of nav link objects', () => {
      expect(Array.isArray(getLinks(PROJECT))).toBe(true)
    })

    it('returns a non-empty list', () => {
      expect(getLinks(PROJECT).length).toBeGreaterThan(0)
    })

    it('every item has an id and a label', () => {
      getLinks(PROJECT).forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('label')
      })
    })

    it('every item has either a link or nestedLinks', () => {
      getLinks(PROJECT).forEach(item => {
        const hasLink = typeof item.link === 'string'
        const hasNested = Array.isArray(item.nestedLinks)
        expect(hasLink || hasNested).toBe(true)
      })
    })

    it('includes a Project monitoring link', () => {
      const links = getLinks(PROJECT)
      const monitoring = links.find(l => l.label === 'Project monitoring')
      expect(monitoring).toBeDefined()
      expect(monitoring.link).toContain(BASE)
    })

    it('includes a ML functions link', () => {
      const links = getLinks(PROJECT)
      const fn = links.find(l => l.label === 'ML functions')
      expect(fn).toBeDefined()
      expect(fn.link).toContain(BASE)
    })

    it('includes an Applications link', () => {
      const links = getLinks(PROJECT)
      const app = links.find(l => l.label === 'Applications')
      expect(app).toBeDefined()
      expect(app.link).toContain(`${BASE}/applications`)
    })

    it('includes Data and artifacts as a collapse item with nested links', () => {
      const links = getLinks(PROJECT)
      const data = links.find(l => l.label === 'Data and artifacts')
      expect(data).toBeDefined()
      expect(Array.isArray(data.nestedLinks)).toBe(true)
      expect(data.nestedLinks.length).toBeGreaterThan(0)
    })

    it('nested links inside Data and artifacts all have ids and labels', () => {
      const links = getLinks(PROJECT)
      const data = links.find(l => l.label === 'Data and artifacts')
      data.nestedLinks.forEach(nested => {
        expect(nested).toHaveProperty('id')
        expect(nested).toHaveProperty('label')
      })
    })

    it('includes Models as a collapse item', () => {
      const links = getLinks(PROJECT)
      const models = links.find(l => l.label === 'Models')
      expect(models).toBeDefined()
      expect(Array.isArray(models.nestedLinks)).toBe(true)
    })

    it('includes Jobs and workflows as a collapse item', () => {
      const links = getLinks(PROJECT)
      const jobs = links.find(l => l.label === 'Jobs and workflows')
      expect(jobs).toBeDefined()
      expect(Array.isArray(jobs.nestedLinks)).toBe(true)
    })

    it('includes Nuclio as a collapse item with externalLink nested items', () => {
      const links = getLinks(PROJECT)
      const nuclio = links.find(l => l.label === 'Nuclio')
      expect(nuclio).toBeDefined()
      expect(Array.isArray(nuclio.nestedLinks)).toBe(true)
      nuclio.nestedLinks.forEach(nested => {
        expect(nested.externalLink).toBe(true)
      })
    })

    it('builds links using the provided project name', () => {
      const linksA = getLinks('project-a')
      const linksB = getLinks('project-b')
      const monA = linksA.find(l => l.label === 'Project monitoring')
      const monB = linksB.find(l => l.label === 'Project monitoring')
      expect(monA.link).toContain('project-a')
      expect(monB.link).toContain('project-b')
    })
  })

  describe('getFooterLinks', () => {
    it('returns an array of footer link objects', () => {
      expect(Array.isArray(getFooterLinks(PROJECT))).toBe(true)
    })

    it('returns a non-empty list', () => {
      expect(getFooterLinks(PROJECT).length).toBeGreaterThan(0)
    })

    it('includes an Alerts link', () => {
      const links = getFooterLinks(PROJECT)
      const alerts = links.find(l => l.label === 'Alerts')
      expect(alerts).toBeDefined()
      expect(alerts.link).toContain(PROJECT)
    })

    it('includes a Project settings link', () => {
      const links = getFooterLinks(PROJECT)
      const settings = links.find(l => l.label === 'Project settings')
      expect(settings).toBeDefined()
      expect(settings.link).toContain(`${PROJECT}/settings`)
    })

    it('every footer item has an id and label', () => {
      getFooterLinks(PROJECT).forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('label')
      })
    })
  })
})
